import { useEffect, useState } from 'react'

// Cookie consent banner — GDPR / ePrivacy / CCPA aligned.
// Stores choice in localStorage with a timestamp so we re-prompt every 12 months,
// or sooner if the consent record is missing.
//
// Categories:
//   - necessary: always on, no consent collected (login/security/payment session)
//   - analytics: Vercel + LearnWorlds analytics — opt-in in EU/UK, opt-out in US
//
// To re-open the banner from anywhere, dispatch:
//   window.dispatchEvent(new Event('aiaware:open-cookie-settings'))
// (the footer "Cookie Settings" link does this)

const STORAGE_KEY = 'aiaware-cookie-consent-v1'
const REPROMPT_AFTER_DAYS = 365

const loadConsent = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.savedAt) return null
    const age = (Date.now() - parsed.savedAt) / (1000 * 60 * 60 * 24)
    if (age > REPROMPT_AFTER_DAYS) return null
    return parsed
  } catch {
    return null
  }
}

const saveConsent = (analytics) => {
  const record = {
    necessary: true, // always
    analytics,
    savedAt: Date.now(),
    version: 1,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  // Notify any listeners (analytics scripts) that consent changed.
  window.dispatchEvent(new CustomEvent('aiaware:consent-changed', { detail: record }))
  return record
}

export default function CookieBanner() {
  const [consent, setConsent] = useState(() => loadConsent())
  const [view, setView] = useState('banner') // 'banner' | 'preferences'
  const [analyticsToggle, setAnalyticsToggle] = useState(true)

  // Listen for "open settings" events (footer link can dispatch this).
  useEffect(() => {
    const reopen = () => {
      setConsent(null)
      setView('preferences')
      setAnalyticsToggle(loadConsent()?.analytics ?? true)
    }
    window.addEventListener('aiaware:open-cookie-settings', reopen)
    return () => window.removeEventListener('aiaware:open-cookie-settings', reopen)
  }, [])

  if (consent) return null

  const acceptAll = () => {
    saveConsent(true)
    setConsent({ analytics: true })
  }
  const rejectNonEssential = () => {
    saveConsent(false)
    setConsent({ analytics: false })
  }
  const savePreferences = () => {
    saveConsent(analyticsToggle)
    setConsent({ analytics: analyticsToggle })
  }

  // ---- Styles ----
  // Self-contained inline styles so this drops into any page without depending on
  // the surrounding Tailwind classes.
  const overlay = {
    position: 'fixed',
    bottom: 0, left: 0, right: 0,
    zIndex: 9999,
    padding: '16px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
  }
  const card = {
    maxWidth: 1100,
    margin: '0 auto',
    background: 'linear-gradient(135deg, rgba(8,22,24,0.97) 0%, rgba(13,38,38,0.97) 100%)',
    border: '1px solid rgba(13,115,119,0.4)',
    borderRadius: 12,
    padding: '20px 24px',
    color: 'rgba(255,255,255,0.85)',
    boxShadow: '0 -8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(13,115,119,0.15)',
    backdropFilter: 'blur(16px)',
  }
  const title = {
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#14a098',
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  }
  const dot = {
    width: 8, height: 8, borderRadius: '50%',
    background: '#14a098', boxShadow: '0 0 8px rgba(20,160,152,0.6)',
  }
  const body = { fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.75)', marginBottom: 14 }
  const btnRow = { display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-end', alignItems: 'center' }
  const btnPrimary = {
    background: 'linear-gradient(135deg, #0D7377 0%, #14a098 100%)',
    color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6,
    fontSize: 13, fontWeight: 700, letterSpacing: 0.5, cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
  }
  const btnGhost = {
    background: 'transparent', color: 'rgba(255,255,255,0.85)',
    border: '1px solid rgba(255,255,255,0.2)', padding: '10px 18px', borderRadius: 6,
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    transition: 'border-color 0.15s, color 0.15s',
  }
  const btnLink = {
    background: 'transparent', color: 'rgba(20,160,152,0.85)',
    border: 'none', padding: '6px 8px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
    textDecoration: 'underline', textUnderlineOffset: 3,
  }
  const link = { color: '#14a098', textDecoration: 'underline', textUnderlineOffset: 3 }
  const prefRow = {
    display: 'flex', alignItems: 'flex-start', gap: 14,
    padding: '12px 14px', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, marginBottom: 10,
  }

  if (view === 'banner') {
    return (
      <div style={overlay} role="region" aria-label="Cookie consent">
        <div style={card}>
          <div style={title}><span style={dot} />Cookies &amp; Privacy</div>
          <p style={body}>
            We use cookies to keep you logged in, secure the platform, and understand how learners use our site.
            Strictly necessary cookies are always on. Analytics cookies are <strong>opt-in</strong> in the EU/UK and similar jurisdictions, opt-out elsewhere.{' '}
            <a href="/legal/trust.html#cookies" style={link}>Read our Cookie Notice</a>.
          </p>
          <div style={btnRow}>
            <button style={btnLink} onClick={() => setView('preferences')}>Manage preferences</button>
            <button style={btnGhost} onClick={rejectNonEssential}>Reject non-essential</button>
            <button style={btnPrimary} onClick={acceptAll}>Accept all</button>
          </div>
        </div>
      </div>
    )
  }

  // Preferences view
  return (
    <div style={overlay} role="dialog" aria-label="Cookie preferences">
      <div style={card}>
        <div style={title}><span style={dot} />Cookie Preferences</div>
        <p style={body}>
          Choose which categories of cookies we may use during your visit. You can change this later via the
          "Cookie Settings" link in our footer. Full details in our{' '}
          <a href="/legal/trust.html#cookies" style={link}>Cookie Notice</a>.
        </p>

        <div style={prefRow}>
          <input type="checkbox" checked disabled style={{ marginTop: 4, accentColor: '#14a098' }} />
          <div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>Strictly Necessary <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>· always on</span></div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
              Required for login, security, and payment session. Cannot be disabled.
            </div>
          </div>
        </div>

        <div style={prefRow}>
          <input
            type="checkbox"
            checked={analyticsToggle}
            onChange={(e) => setAnalyticsToggle(e.target.checked)}
            style={{ marginTop: 4, accentColor: '#14a098', cursor: 'pointer' }}
            id="analytics-toggle"
          />
          <label htmlFor="analytics-toggle" style={{ cursor: 'pointer' }}>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>Analytics &amp; Performance</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
              Anonymized site analytics (Vercel) and LearnWorlds course engagement metrics. No personal identifiers, no advertising.
            </div>
          </label>
        </div>

        <div style={btnRow}>
          <button style={btnGhost} onClick={() => setView('banner')}>Back</button>
          <button style={btnPrimary} onClick={savePreferences}>Save preferences</button>
        </div>
      </div>
    </div>
  )
}
