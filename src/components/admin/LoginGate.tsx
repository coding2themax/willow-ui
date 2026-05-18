import { useState, type ReactNode } from 'react'
import { setAdminToken, getAdminToken } from '../../api/client'
import ErrorBanner from '../ui/ErrorBanner'
import Spinner from '../ui/Spinner'

interface Props {
  children: ReactNode
}

const EXPECTED_TOKEN = (import.meta.env.VITE_ADMIN_TOKEN as string | undefined) ?? ''

export default function LoginGate({ children }: Props) {
  const [authed, setAuthed]   = useState(() => {
    const stored = getAdminToken()
    // In dev with a known token, accept immediately; in prod the API will reject bad tokens.
    return stored.length > 0
  })
  const [token,   setToken]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  if (authed) return <>{children}</>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token.trim()) { setError('Please enter your admin token.'); return }

    setLoading(true)
    setError(null)

    try {
      // Optimistically accept any token when no VITE_ADMIN_TOKEN is configured
      // (lets local dev work without env vars). In production the API will reject
      // requests with an invalid token and each tab will surface the error.
      if (EXPECTED_TOKEN && token !== EXPECTED_TOKEN) {
        throw new Error('Invalid token.')
      }
      setAdminToken(token)
      setAuthed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1e0f08',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 380,
        padding: '2.5rem',
        background: '#2a170c',
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          fontWeight: 400,
          color: 'var(--cream)',
          marginBottom: '0.25rem',
          letterSpacing: '0.02em',
        }}>
          Willow
        </div>
        <div style={{
          fontSize: '0.6rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          marginBottom: '2rem',
        }}>
          Admin Access
        </div>

        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.6rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(184,85,31,0.8)',
              marginBottom: '0.5rem',
            }}>
              Admin Token
            </label>
            <input
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="Enter your admin token"
              autoComplete="current-password"
              style={{
                width: '100%',
                height: 40,
                padding: '0 12px',
                background: '#3a1f12',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                color: 'var(--cream)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              height: 40,
              background: loading ? 'rgba(184,130,42,0.5)' : 'var(--gold)',
              border: 'none',
              borderRadius: 2,
              color: '#fff',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.68rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'background 0.2s',
            }}
          >
            {loading ? <Spinner size={14} /> : null}
            {loading ? 'Verifying…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
