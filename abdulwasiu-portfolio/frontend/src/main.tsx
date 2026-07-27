/**
 * main.tsx — Application Entry Point (React → DOM)
 *
 * WHAT THIS FILE DOES:
 *   Finds the <div id="root"> in index.html and renders the React app into it.
 *   This is where React "takes over" the page.
 *
 * THE PROVIDER STACK (order matters!):
 *   Each wrapper makes something available to everything nested inside it.
 *   We nest them outermost → innermost:
 *
 *     ThemeProvider   → theme (light/dark) available to all components
 *     AppProvider     → projects/skills/pmProjects data available to all
 *     BrowserRouter   → routing (useParams, useNavigate, <Routes>) available
 *     App             → the actual route definitions
 *
 *   If a component tries to useTheme() but ThemeProvider isn't above it,
 *   you'd get the "must be used within a Provider" error we built in Phase 5.
 *
 * React.StrictMode:
 *   A development-only wrapper that helps catch bugs (it double-invokes some
 *   functions to surface side-effect mistakes). It has no effect in production.
 *
 * import './styles/globals.css':
 *   Loads ALL our styles (reset, tokens, typography, animations, Tailwind).
 *   Importing CSS in the entry file applies it globally.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@context/ThemeContext'
import { AppProvider } from '@context/AppContext'
import { App } from './App'
import './styles/globals.css'

// createRoot is React 18's entry API. The "!" tells TypeScript we're certain
// the #root element exists (it's in index.html).
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  </React.StrictMode>
)
