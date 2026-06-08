import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { DISP, BODY } from '../../theme/palette'

const B = {
  bg: '#E7E3DB',
  surface: '#FBF9F5',
  ink: '#2B2A26',
  ink2: '#4A4842',
  muted: '#837E74',
  line: 'rgba(43,42,38,0.12)',
  brown: '#8B6B4A',
  brownSoft: '#F2EBE2',
  danger: '#C0392B',
  dangerSoft: '#FDF0EE',
  ok: '#2E7D32',
  okSoft: '#EDF7ED',
}

interface Props {
  onLogin: () => void
}

export function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)

    if (mode === 'login') {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) setError(err.message)
      else onLogin()
    } else {
      const { error: err } = await supabase.auth.signUp({ email, password })
      if (err) setError(err.message)
      else setInfo('Compte créé. Vérifiez votre email ou connectez-vous directement.')
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: B.bg, fontFamily: BODY,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, background: B.ink,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 14,
          }}>
            <div style={{ width: 22, height: 14, borderRadius: 3, background: 'linear-gradient(135deg,#D7B477,#8B6B4A)' }} />
          </div>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 26, color: B.ink }}>
            Sama<span style={{ color: B.brown }}>Campus</span>
          </div>
          <div style={{ fontSize: 13.5, color: B.muted, fontWeight: 600, marginTop: 4 }}>Administration</div>
        </div>

        {/* Card */}
        <div style={{
          background: B.surface, border: '1px solid ' + B.line,
          borderRadius: 22, padding: 32,
        }}>
          <h2 style={{ margin: '0 0 24px', fontFamily: DISP, fontWeight: 700, fontSize: 20, color: B.ink }}>
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h2>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: B.muted, display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                Email
              </label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@campus.sn"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '12px 14px', borderRadius: 12,
                  border: '1px solid ' + B.line, background: B.bg,
                  fontFamily: BODY, fontSize: 14.5, color: B.ink,
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: B.muted, display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                Mot de passe
              </label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '12px 14px', borderRadius: 12,
                  border: '1px solid ' + B.line, background: B.bg,
                  fontFamily: BODY, fontSize: 14.5, color: B.ink,
                  outline: 'none',
                }}
              />
            </div>

            {error && (
              <div style={{ background: B.dangerSoft, color: B.danger, padding: '11px 14px', borderRadius: 10, fontSize: 13.5, fontWeight: 600 }}>
                {error}
              </div>
            )}
            {info && (
              <div style={{ background: B.okSoft, color: B.ok, padding: '11px 14px', borderRadius: 10, fontSize: 13.5, fontWeight: 600 }}>
                {info}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                marginTop: 6, padding: '14px 0', borderRadius: 12, border: 'none',
                background: loading ? B.muted : B.brown, color: '#fff',
                fontFamily: DISP, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Chargement…' : mode === 'login' ? 'Se connecter' : 'Créer le compte'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13.5, color: B.muted }}>
            {mode === 'login' ? (
              <>Pas encore de compte ?{' '}
                <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: B.brown, fontFamily: DISP, fontWeight: 700, fontSize: 13.5, cursor: 'pointer' }}>
                  Créer un compte
                </button>
              </>
            ) : (
              <>Déjà un compte ?{' '}
                <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: B.brown, fontFamily: DISP, fontWeight: 700, fontSize: 13.5, cursor: 'pointer' }}>
                  Se connecter
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
