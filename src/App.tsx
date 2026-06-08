import React, { useState, useEffect } from 'react'
import { BODY, DISP } from './theme/palette'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { LoginPage } from './components/auth/LoginPage'
import { supabase } from './lib/supabase'

// ── Force-change-password screen ──────────────────────────
function ChangePasswordPage({ onDone }: { onDone: () => void }) {
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const B = {
    bg: '#E7E3DB', surface: '#FBF9F5', ink: '#2B2A26',
    muted: '#837E74', line: 'rgba(43,42,38,0.12)',
    brown: '#8B6B4A', danger: '#C0392B', dangerSoft: '#FDF0EE',
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (pw.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return }
    if (pw !== pw2) { setError('Les mots de passe ne correspondent pas.'); return }
    setLoading(true)

    // 1. Change the password
    const { error: pwErr } = await supabase.auth.updateUser({ password: pw })
    if (pwErr) { setError(pwErr.message); setLoading(false); return }

    // 2. Clear the must_change_password flag in user metadata
    await supabase.auth.updateUser({ data: { must_change_password: false } })

    setLoading(false)
    onDone()
  }

  return (
    <div style={{ minHeight: '100vh', background: B.bg, fontFamily: BODY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: B.ink, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <div style={{ width: 22, height: 14, borderRadius: 3, background: 'linear-gradient(135deg,#D7B477,#8B6B4A)' }} />
          </div>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 26, color: B.ink }}>
            Sama<span style={{ color: B.brown }}>Campus</span>
          </div>
        </div>

        <div style={{ background: B.surface, border: '1px solid ' + B.line, borderRadius: 22, padding: 32 }}>
          {/* Icon + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <span style={{ width: 44, height: 44, borderRadius: '50%', background: '#FFF8E1', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="5" y="10" width="12" height="9" rx="2" stroke="#F59E0B" strokeWidth="1.7"/><path d="M8 10V7a3 3 0 1 1 6 0v3" stroke="#F59E0B" strokeWidth="1.7" strokeLinecap="round"/></svg>
            </span>
            <div>
              <h2 style={{ margin: 0, fontFamily: DISP, fontWeight: 700, fontSize: 18, color: B.ink }}>Changez votre mot de passe</h2>
              <p style={{ margin: '3px 0 0', fontSize: 13, color: B.muted }}>Requis à la première connexion.</p>
            </div>
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 24 }}>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: B.muted, display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '.04em' }}>Nouveau mot de passe</label>
              <input
                type="password" required value={pw} onChange={e => setPw(e.target.value)}
                placeholder="Min. 8 caractères"
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 12, border: '1px solid ' + B.line, background: B.bg, fontFamily: BODY, fontSize: 14.5, color: B.ink, outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: B.muted, display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '.04em' }}>Confirmer le mot de passe</label>
              <input
                type="password" required value={pw2} onChange={e => setPw2(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 12, border: '1px solid ' + B.line, background: B.bg, fontFamily: BODY, fontSize: 14.5, color: B.ink, outline: 'none' }}
              />
            </div>

            {error && (
              <div style={{ background: B.dangerSoft, color: B.danger, padding: '11px 14px', borderRadius: 10, fontSize: 13.5, fontWeight: 600 }}>{error}</div>
            )}

            {/* Password strength hint */}
            {pw && (
              <div style={{ display: 'flex', gap: 4 }}>
                {[pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].map((ok, i) => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: ok ? '#4CAF50' : 'rgba(43,42,38,.12)' }} />
                ))}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{ marginTop: 6, padding: '14px 0', borderRadius: 12, border: 'none', background: loading ? B.muted : B.brown, color: '#fff', fontFamily: DISP, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Enregistrement…' : 'Enregistrer le nouveau mot de passe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── App root ───────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#E7E3DB', fontFamily: BODY, display: 'grid', placeItems: 'center' }}>
        <div style={{ fontWeight: 600, fontSize: 16, color: '#837E74' }}>Chargement…</div>
      </div>
    )
  }

  if (!session) {
    return <LoginPage onLogin={() => {}} />
  }

  // Force password change on first login
  if (session.user.user_metadata?.must_change_password === true) {
    return (
      <ChangePasswordPage onDone={() => {
        // Refresh session to get updated metadata
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
      }} />
    )
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  return (
    <div style={{ height: '100vh', overflow: 'hidden', fontFamily: BODY }}>
      <AdminDashboard userEmail={session.user.email} onLogout={logout} />
    </div>
  )
}
