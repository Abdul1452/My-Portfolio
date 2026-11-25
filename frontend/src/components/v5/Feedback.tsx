/**
 * Feedback.tsx — How the site tells you what's happening
 *
 *   Banner          inline status message (info / warning / offline)
 *   OfflineBanner   appears when the browser goes offline, hides on reconnect
 *   ToastProvider   short confirmations ("Email copied") at the bottom
 *   SectionBoundary if one section crashes, the rest of the page still works
 *   Skeleton        loading placeholder that keeps the final layout's size
 *
 * Status messages use role="status" (polite: read when the reader is idle);
 * errors use role="alert" (read immediately).
 */

import {
  Component,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ErrorInfo,
  type ReactNode,
} from 'react'
import { CircleCheck, RefreshCw, TriangleAlert, WifiOff, X, type LucideIcon } from 'lucide-react'

// ─── Banner ───────────────────────────────────────────────────────────────────

type BannerTone = 'info' | 'warn' | 'offline'

const BANNER_ICON: Record<BannerTone, LucideIcon> = { info: RefreshCw, warn: TriangleAlert, offline: WifiOff }

export function Banner({ tone, title, children, onDismiss, action }: {
  tone: BannerTone
  title: string
  children: ReactNode
  onDismiss?: () => void
  action?: ReactNode
}) {
  const Icon = BANNER_ICON[tone]
  return (
    <div role={tone === 'warn' ? 'alert' : 'status'} className={`pf6-banner${tone === 'info' ? '' : ` pf6-banner--${tone}`}`}>
      <Icon size={20} aria-hidden="true" />
      <div className="pf6-banner__text">
        <p className="pf6-banner__title">{title}</p>
        <p className="pf6-banner__body">{children}</p>
        {action && <div style={{ marginTop: 8 }}>{action}</div>}
      </div>
      {onDismiss && (
        <button type="button" className="pf6-banner__close" aria-label="Dismiss" onClick={onDismiss}>
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

export function OfflineBanner() {
  const [online, setOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  if (online) return null
  return (
    <div className="pf6-statusbar">
      <Banner tone="offline" title="You’re offline">
        Pages you’ve opened still work. Links to GitHub and LinkedIn need a connection.
      </Banner>
    </div>
  )
}

// ─── Toasts ───────────────────────────────────────────────────────────────────

type ToastTone = 'success' | 'error'
interface Toast { id: number; tone: ToastTone; message: string }

const ToastContext = createContext<((tone: ToastTone, message: string) => void) | null>(null)

const TOAST_MS = 4000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)

  const show = useCallback((tone: ToastTone, message: string) => {
    const id = ++nextId.current
    // Only one toast at a time: a new message replaces the old one.
    setToasts([{ id, tone, message }])
    window.setTimeout(() => setToasts(current => current.filter(t => t.id !== id)), TOAST_MS)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="pf6-toasts" role="status" aria-live="polite">
        {toasts.map(toast => (
          <div key={toast.id} className="pf6-toast">
            {toast.tone === 'success'
              ? <CircleCheck size={18} className="pf6-c-ok" aria-hidden="true" />
              : <TriangleAlert size={18} className="pf6-c-danger" aria-hidden="true" />}
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const show = useContext(ToastContext)
  if (!show) throw new Error('useToast must be used inside <ToastProvider>')
  return show
}

// ─── Error boundary per section ───────────────────────────────────────────────
//
// Error boundaries still have to be class components in React 18: only
// componentDidCatch / getDerivedStateFromError can catch render errors.

interface BoundaryState { failed: boolean }

export class SectionBoundary extends Component<{ name: string; children: ReactNode }, BoundaryState> {
  state: BoundaryState = { failed: false }

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[SectionBoundary] ${this.props.name} failed to render`, error, info.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="pf5-section">
        <Banner
          tone="warn"
          title="Something went wrong"
          action={
            <button type="button" className="pf5-btn pf5-btn--ghost" onClick={() => this.setState({ failed: false })}>
              <RefreshCw size={16} aria-hidden="true" /> Try again
            </button>
          }
        >
          The {this.props.name} section couldn’t load. Try again, or reach me by email.
        </Banner>
      </div>
    )
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function Skeleton({ width = '100%', height = 14, style }: { width?: number | string; height?: number; style?: CSSProperties }) {
  return <span aria-hidden="true" className="pf6-skel" style={{ width, height, ...style }} />
}
