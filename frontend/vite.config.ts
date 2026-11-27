import { createReadStream, statSync } from 'fs'
import { extname, resolve, sep } from 'path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fileTypes from './scripts/file-types.json'

const FILES_DIR = resolve(__dirname, 'files')

/**
 * Dev only: serve /files/* from frontend/files/, the local mirror of the R2
 * bucket, so links like /files/docs/... work in `pnpm dev` the same way the
 * Worker serves them in production.
 */
function localFiles(): Plugin {
  return {
    name: 'local-r2-files',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/files', (req, res, next) => {
        let file: string
        try {
          file = resolve(FILES_DIR, '.' + decodeURIComponent((req.url ?? '/').split('?')[0]))
        } catch {
          return next()
        }
        // Stay inside files/ — no "../" escapes.
        if (!file.startsWith(FILES_DIR + sep)) return next()
        try {
          if (!statSync(file).isFile()) return next()
        } catch {
          return next() // not there: fall through to Vite's 404
        }
        const types: Record<string, string> = fileTypes
        res.setHeader('Content-Type', types[extname(file).toLowerCase()] ?? 'application/octet-stream')
        createReadStream(file).pipe(res)
      })
    },
  }
}

/**
 * Build only: write robots.txt and sitemap.xml for the site's real address
 * (VITE_SITE_URL), so they never point at a domain the site isn't on.
 * Keep the paths in sync with the routes in src/App.tsx.
 */
function siteFiles(siteUrl: string | undefined): Plugin {
  const SITEMAP_PATHS = ['/', '/pm']
  return {
    name: 'site-files',
    apply: 'build',
    generateBundle() {
      const base = siteUrl?.replace(/\/+$/, '')
      const robots = ['User-agent: *', 'Allow: /', ...(base ? ['', `Sitemap: ${base}/sitemap.xml`] : [])].join('\n')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots}\n` })
      if (!base) {
        this.warn('VITE_SITE_URL is not set: no sitemap.xml, and canonical/social URLs in index.html stay unresolved.')
        return
      }
      const urls = SITEMAP_PATHS.map(path => `  <url><loc>${base}${path}</loc></url>`).join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), localFiles(), siteFiles(loadEnv(mode, __dirname, 'VITE_').VITE_SITE_URL)],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@sections': resolve(__dirname, 'src/components/sections'),
      '@ui': resolve(__dirname, 'src/components/ui'),
      '@layout': resolve(__dirname, 'src/components/layout'),
      '@pm': resolve(__dirname, 'src/components/pm'),
      '@coastal': resolve(__dirname, 'src/components/coastal'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@app-types': resolve(__dirname, 'src/types'),
      '@data': resolve(__dirname, 'src/data'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@context': resolve(__dirname, 'src/context'),
      '@pages': resolve(__dirname, 'src/pages'),
    },
  },
  server: {
    port: 5173,
    // /api goes to the Cloudflare Worker running locally (`pnpm dev:api`),
    // the same code that serves /api in production.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    // Maps are still written (for debugging locally) but the bundles don't
    // point to them, and public/.assetsignore keeps them off Cloudflare, so
    // the original source isn't published.
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
}))
