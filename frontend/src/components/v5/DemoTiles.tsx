/**
 * DemoTiles.tsx — The three interactive tiles in the "Work" section
 *
 * Each tile is a small working model of the one decision that makes the
 * project interesting, so a visitor can try the idea instead of reading
 * about it. They're demos, not the real services:
 *
 *   MovePlanTile   MuutoKaveri's rules, using the real thresholds from its
 *                  src/rules.ts (old building ≤ 1989, old appliance ≥ 7 yrs)
 *   QuoteApiTile   the Quote API's request path with real quotes from its
 *                  dataset; the cold-start/warm timings are simulated
 *   FraudScoreTile PetosVahti's decision step with illustrative scoring
 *                  rules (the real service will use a trained model)
 */

import { useEffect, useRef, useState } from 'react'

// ─── Shared bits ──────────────────────────────────────────────────────────────

interface ChipOption<T> {
  value: T
  label: string
}

/** A row of toggle buttons where exactly one is pressed (like radio buttons). */
function ChipGroup<T extends string | number>({ label, options, value, onChange }: {
  label: string
  options: ChipOption<T>[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="pf5-field">
      <span className="pf5-field__label">{label}</span>
      <div role="group" aria-label={label} className="pf5-chiprow">
        {options.map(option => (
          <button
            key={String(option.value)}
            type="button"
            className="pf5-chip"
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── MuutoKaveri: rules that turn a home into a moving plan ──────────────────

const OLD_BUILDING_YEAR = 1989 // ~70% of leaks happen in buildings from the 1980s or earlier
const APPLIANCE_OLD_YEARS = 7

type HomeType = 'apartment' | 'house'

interface PlanCard {
  phase: 'Before' | 'Moving day' | 'First 30'
  text: string
  risk?: boolean
}

function buildMovePlan(home: HomeType, built: number, dishwasherAge: number): PlanCard[] {
  const oldBuilding = built <= OLD_BUILDING_YEAR
  const cards: PlanCard[] = [
    { phase: 'Before', text: 'Check whether your things are covered while you move.' },
  ]
  if (dishwasherAge >= APPLIANCE_OLD_YEARS) {
    cards.push({ phase: 'Before', risk: true, text: `Your dishwasher is ${dishwasherAge} years old: check the hoses before you connect it.` })
  }
  cards.push({ phase: 'Before', text: 'Sell, donate or recycle what you won’t take, and rent reusable moving boxes.' })
  cards.push(
    oldBuilding
      ? { phase: 'Moving day', risk: true, text: `Your building is from ${built}: find the main water shut-off valve on day one.` }
      : { phase: 'Moving day', text: 'Write down where the main water shut-off and the fuse box are.' },
  )
  if (oldBuilding) {
    cards.push({
      phase: 'First 30',
      risk: true,
      text: home === 'house'
        ? `A house from ${built}: find out when the pipes were last renewed.`
        : `A building from ${built}: ask the housing company when the pipes were last renewed.`,
    })
  }
  return cards
}

export function MovePlanTile() {
  const [home, setHome] = useState<HomeType>('apartment')
  const [built, setBuilt] = useState(1985)
  const [dishwasherAge, setDishwasherAge] = useState(9)

  const plan = buildMovePlan(home, built, dishwasherAge)
  const leakReasons = [
    built <= OLD_BUILDING_YEAR ? `a building from ${built}` : null,
    dishwasherAge >= APPLIANCE_OLD_YEARS ? `a ${dishwasherAge}-year-old dishwasher` : null,
  ].filter((reason): reason is string => reason !== null)

  return (
    <div className="pf5-card">
      <div className="pf5-tile__head">
        <p className="pf5-tile__name">Your move</p>
        <p className="pf5-tile__note">{plan.length} plan cards</p>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        <ChipGroup
          label="Home"
          value={home}
          onChange={setHome}
          options={[{ value: 'apartment', label: 'Apartment' }, { value: 'house', label: 'House' }]}
        />
        <ChipGroup
          label="Built"
          value={built}
          onChange={setBuilt}
          options={[1975, 1985, 2005, 2021].map(year => ({ value: year, label: String(year) }))}
        />
        <ChipGroup
          label="Dishwasher age"
          value={dishwasherAge}
          onChange={setDishwasherAge}
          options={[2, 5, 9].map(age => ({ value: age, label: `${age} yrs` }))}
        />
      </div>

      <ul className="pf5-plan" aria-label="Moving plan">
        {plan.map(card => (
          <li key={card.text} data-risk={card.risk ?? false}>
            <span className="pf5-plan__phase">{card.phase}</span>
            <span>{card.text}</span>
          </li>
        ))}
      </ul>

      <p aria-live="polite" className={`pf5-message ${leakReasons.length ? 'pf5-message--warn' : 'pf5-message--ok'}`} style={{ marginTop: 10 }}>
        {leakReasons.length
          ? `Raised leak risk (${leakReasons.join(' and ')}), so the plan offers a leak sensor.`
          : 'Normal leak risk, so no leak sensor offer.'}
      </p>
    </div>
  )
}

// ─── Quote API: cold start vs warm Lambda ─────────────────────────────────────

type QuoteCategory = 'motivation' | 'wisdom' | 'courage'
type CallStatus = 'idle' | 'loading' | 'cold' | 'warm' | 'recycled'

interface Quote {
  text: string
  author: string
}

// A few quotes from the API's own dataset (src/quotes/data.py).
const QUOTES: Record<QuoteCategory, Quote[]> = {
  motivation: [
    { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
    { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
    { text: 'It always seems impossible until it’s done.', author: 'Nelson Mandela' },
  ],
  wisdom: [
    { text: 'Knowing yourself is the beginning of all wisdom.', author: 'Aristotle' },
    { text: 'In the middle of every difficulty lies opportunity.', author: 'Albert Einstein' },
    { text: 'The measure of intelligence is the ability to change.', author: 'Albert Einstein' },
  ],
  courage: [
    { text: 'Courage is not the absence of fear, but the triumph over it.', author: 'Nelson Mandela' },
  ],
}

const NODES = ['Client', 'API Gateway', 'Lambda', 'QuoteService']

const ACTIVE_NODES: Record<CallStatus, number[]> = {
  idle: [],
  recycled: [],
  loading: [0, 1],
  cold: [0, 1, 2, 3],
  warm: [0, 1, 2, 3],
}

const STATUS_TEXT: Record<CallStatus, string> = {
  idle: 'Not sent yet. No Lambda container is running.',
  loading: 'Waiting for a response…',
  cold: 'Cold start: Lambda started a new container first, then answered.',
  warm: 'Warm: the same container answered, with no start-up cost.',
  recycled: 'Idle long enough that the container was recycled. The next call is cold again.',
}

export function QuoteApiTile({ reduceMotion }: { reduceMotion: boolean }) {
  const [category, setCategory] = useState<QuoteCategory>('motivation')
  const [status, setStatus] = useState<CallStatus>('idle')
  const [isWarm, setIsWarm] = useState(false)
  const [calls, setCalls] = useState(0)
  const [coldStarts, setColdStarts] = useState(0)
  const [shownMs, setShownMs] = useState(0)
  const [quote, setQuote] = useState<Quote | null>(null)

  const timeoutRef = useRef<number>()
  const frameRef = useRef<number>()

  // Stop pending timers/animation frames if the tile unmounts mid-request.
  useEffect(() => () => {
    window.clearTimeout(timeoutRef.current)
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
  }, [])

  const busy = status === 'loading'

  // Count the response time up from 0 so the difference is easy to feel.
  function animateResponseTime(target: number) {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    if (reduceMotion) {
      setShownMs(target)
      return
    }
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / 650)
      const eased = 1 - Math.pow(1 - progress, 3)
      setShownMs(Math.round(target * eased))
      if (progress < 1) frameRef.current = requestAnimationFrame(step)
    }
    frameRef.current = requestAnimationFrame(step)
  }

  function sendRequest() {
    if (busy) return
    const cold = !isWarm
    setStatus('loading')
    timeoutRef.current = window.setTimeout(() => {
      const pool = QUOTES[category]
      setQuote(pool[Math.floor(Math.random() * pool.length)])
      setCalls(n => n + 1)
      if (cold) setColdStarts(n => n + 1)
      setIsWarm(true)
      setStatus(cold ? 'cold' : 'warm')
      animateResponseTime(cold ? 380 + Math.floor(Math.random() * 80) : 28 + Math.floor(Math.random() * 18))
    }, cold ? 700 : 160)
  }

  function letItIdle() {
    if (busy) return
    setIsWarm(false)
    setStatus('recycled')
  }

  const active = ACTIVE_NODES[status]
  const lastActive = active[active.length - 1]

  return (
    <div className="pf5-card">
      <div className="pf5-request">
        <span className="pf5-request__method">GET</span>
        <span className="pf5-request__path">/quote?category={category}</span>
      </div>

      <ChipGroup
        label="Category"
        value={category}
        onChange={setCategory}
        options={(Object.keys(QUOTES) as QuoteCategory[]).map(c => ({ value: c, label: c }))}
      />

      <div className="pf5-nodes" aria-hidden="true">
        {NODES.map((node, i) => {
          const state = !active.includes(i) ? 'off' : i === lastActive && !busy ? 'end' : 'on'
          return (
            <span key={node} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="pf5-node" data-state={state}>{node}</span>
              {i < NODES.length - 1 && <span className="pf5-muted" style={{ fontSize: 12 }}>→</span>}
            </span>
          )
        })}
      </div>

      <div className="pf5-stats">
        <div className="pf5-stat">
          <p className="pf5-stat__label">Response time</p>
          <p className="pf5-stat__value">{calls ? `${shownMs} ms` : '—'}</p>
        </div>
        <div className="pf5-stat">
          <p className="pf5-stat__label">Cold starts</p>
          <p className="pf5-stat__value">
            {coldStarts}
            <span className="pf5-stat__unit"> / {calls} calls</span>
          </p>
        </div>
      </div>

      <div aria-live="polite">
        <p style={{ marginBottom: 10, minHeight: 20, fontSize: 13, color: status === 'warm' ? 'var(--ok)' : status === 'cold' ? 'var(--ink)' : 'var(--ink-3)' }}>
          {STATUS_TEXT[status]}
        </p>
        <blockquote className="pf5-quote" style={{ margin: '0 0 12px' }}>
          {quote ? (
            <>
              “{quote.text}”
              <cite>{quote.author}</cite>
            </>
          ) : (
            <span className="pf5-muted">The quote appears here.</span>
          )}
        </blockquote>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" className="pf5-btn pf5-btn--primary" style={{ flex: 1 }} onClick={sendRequest} disabled={busy} aria-busy={busy}>
          {busy ? 'Sending…' : 'Send request'}
        </button>
        <button type="button" className="pf5-btn pf5-btn--ghost" onClick={letItIdle} disabled={busy}>
          Let it idle
        </button>
      </div>
      <p className="pf5-tile__note" style={{ marginTop: 10 }}>Timings are simulated; the quotes come from the API’s dataset.</p>
    </div>
  )
}

// ─── PetosVahti: score a transaction, decide approve / review / block ────────

type Channel = 'Card' | 'Siirto' | 'MobilePay'

const REVIEW_AT = 0.5
const BLOCK_AT = 0.8

interface Transaction {
  amount: number
  channel: Channel
  newDevice: boolean
  night: boolean
  newPayee: boolean
}

// Illustrative rules standing in for the model: each risk signal adds to the
// score and leaves a reason code, the way the real API will explain itself.
function scoreTransaction(t: Transaction) {
  let score = 0.05
  const reasons: string[] = []
  if (t.amount >= 2900) { score += 0.35; reasons.push('AMOUNT_HIGH') }
  else if (t.amount >= 480) { score += 0.15; reasons.push('AMOUNT_ELEVATED') }
  if (t.channel === 'Siirto') { score += 0.1; reasons.push('INSTANT_RAIL') }
  if (t.newDevice) { score += 0.25; reasons.push('NEW_DEVICE') }
  if (t.night) { score += 0.15; reasons.push('ODD_HOUR') }
  if (t.newPayee) { score += 0.2; reasons.push('NEW_PAYEE') }
  return { score: Math.min(score, 0.99), reasons }
}

const DECISION_STYLE = {
  approve: { bg: 'var(--ok-soft)', fg: 'var(--ok)' },
  review: { bg: 'var(--warn-soft)', fg: 'var(--warn)' },
  block: { bg: 'var(--danger-soft)', fg: 'var(--danger)' },
}

export function FraudScoreTile() {
  const [txn, setTxn] = useState<Transaction>({ amount: 480, channel: 'Card', newDevice: false, night: false, newPayee: false })
  const update = (patch: Partial<Transaction>) => setTxn(current => ({ ...current, ...patch }))

  const { score, reasons } = scoreTransaction(txn)
  const decision = score >= BLOCK_AT ? 'block' : score >= REVIEW_AT ? 'review' : 'approve'
  const style = DECISION_STYLE[decision]

  const toggles: { key: 'newDevice' | 'night' | 'newPayee'; label: string }[] = [
    { key: 'newDevice', label: 'New device' },
    { key: 'night', label: 'Night-time (03:12)' },
    { key: 'newPayee', label: 'First payment to this IBAN' },
  ]

  return (
    <div className="pf5-card">
      <div className="pf5-tile__head">
        <p className="pf5-tile__name">Transaction</p>
        <p className="pf5-tile__note">EUR · FI IBAN</p>
      </div>

      <div className="pf5-txn">
        <ChipGroup
          label="Amount"
          value={txn.amount}
          onChange={amount => update({ amount })}
          options={[24, 480, 2900].map(a => ({ value: a, label: `€${a.toLocaleString('en-US')}` }))}
        />
        <ChipGroup
          label="Channel"
          value={txn.channel}
          onChange={channel => update({ channel })}
          options={(['Card', 'Siirto', 'MobilePay'] as Channel[]).map(c => ({ value: c, label: c }))}
        />
        <div>
          {toggles.map(t => (
            <label key={t.key} className="pf5-toggle">
              <input type="checkbox" checked={txn[t.key]} onChange={e => update({ [t.key]: e.target.checked })} />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      <div aria-hidden="true">
        <div className="pf5-meter">
          <div className="pf5-meter__fill" style={{ width: `${score * 100}%`, background: style.fg }} />
          <div className="pf5-meter__mark" style={{ left: `${REVIEW_AT * 100}%` }} />
          <div className="pf5-meter__mark" style={{ left: `${BLOCK_AT * 100}%` }} />
        </div>
        <div className="pf5-meter__labels">
          <span style={{ left: `${REVIEW_AT * 100}%` }}>review</span>
          <span style={{ left: `${BLOCK_AT * 100}%` }}>block</span>
        </div>
      </div>

      <div aria-live="polite" className="pf5-decision">
        <span>Risk score <span className="mono">{score.toFixed(2)}</span></span>
        <span className="pf5-decision__pill" style={{ background: style.bg, color: style.fg }}>{decision}</span>
      </div>
      <div className="pf5-reasons" aria-label="Reason codes">
        {reasons.length ? reasons.map(reason => <span key={reason}>{reason}</span>) : <span>NO_FLAGS</span>}
      </div>
      <p className="pf5-tile__note" style={{ marginTop: 10 }}>Illustrative rules; the service will score with a trained Isolation Forest.</p>
    </div>
  )
}
