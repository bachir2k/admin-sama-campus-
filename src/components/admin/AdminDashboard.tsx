import React, { useState } from 'react';
import { scPalette, DISP, BODY } from '../../theme/palette';
import { Icon } from '../ui/Icon';
import { Overview } from './views/Overview';
import { Fraud } from './views/Fraud';
import { Students } from './views/Students';
import { Transactions } from './views/Transactions';
import { AccessView } from './views/AccessView';
import { Stats } from './views/Stats';

type AdminView = 'overview' | 'fraud' | 'students' | 'txns' | 'access' | 'stats';

const NAV: { key: AdminView; ic: string; label: string; badge?: number }[] = [
  { key: 'overview', ic: 'grid', label: "Vue d'ensemble" },
  { key: 'fraud', ic: 'shield', label: 'Alertes fraude', badge: 7 },
  { key: 'students', ic: 'users', label: 'Étudiants' },
  { key: 'txns', ic: 'card', label: 'Transactions' },
  { key: 'access', ic: 'scan', label: 'Accès temps réel' },
  { key: 'stats', ic: 'chart', label: 'Statistiques' },
];

interface Props {
  userEmail?: string;
  onLogout?: () => void;
}

export function AdminDashboard({ userEmail, onLogout }: Props) {
  const p = scPalette('light');
  const [view, setView] = useState<AdminView>('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const cur = NAV.find(n => n.key === view)!;

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : 'SA';

  const renderView = () => {
    switch (view) {
      case 'overview': return <Overview p={p} goFraud={() => setView('fraud')} />;
      case 'fraud': return <Fraud p={p} />;
      case 'students': return <Students p={p} />;
      case 'txns': return <Transactions p={p} />;
      case 'access': return <AccessView p={p} />;
      case 'stats': return <Stats p={p} />;
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', background: p.appBg2, fontFamily: BODY, color: p.ink }}>

      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside style={{ width: 232, flexShrink: 0, background: p.nav, color: '#EDE7DB', display: 'flex', flexDirection: 'column', height: '100vh' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '22px 24px 18px' }}>
          <span style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#D7B477,#8B6B4A)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <span style={{ width: 15, height: 10, borderRadius: 3, background: '#1b1813' }} />
          </span>
          <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 18 }}>Sama<span style={{ color: p.gold }}>Campus</span></span>
        </div>

        {/* Section label */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', color: 'rgba(237,231,219,.4)', padding: '0 24px 10px' }}>ADMINISTRATION</div>

        {/* Nav items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '0 12px', flex: 1 }}>
          {NAV.map(n => {
            const active = view === n.key;
            return (
              <button key={n.key} onClick={() => setView(n.key)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: 11, border: 'none', cursor: 'pointer', background: active ? 'rgba(215,180,119,.16)' : 'transparent', color: active ? p.gold : 'rgba(237,231,219,.78)', fontFamily: DISP, fontWeight: 600, fontSize: 14.5, textAlign: 'left', width: '100%' }}>
                <Icon name={n.ic} size={20} color={active ? p.gold : 'rgba(237,231,219,.7)'} />
                <span style={{ flex: 1 }}>{n.label}</span>
                {n.badge && <span style={{ background: p.danger, color: '#fff', fontFamily: DISP, fontWeight: 700, fontSize: 11, padding: '2px 7px', borderRadius: 999 }}>{n.badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* ── User section (bottom) ── */}
        <div style={{ padding: '0 12px 16px', position: 'relative' }}>
          <div style={{ borderTop: '1px solid rgba(237,231,219,.12)', paddingTop: 12 }}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', borderRadius: 12, border: 'none', cursor: 'pointer', background: menuOpen ? 'rgba(237,231,219,.08)' : 'transparent', width: '100%', textAlign: 'left' }}
            >
              <span style={{ width: 36, height: 36, borderRadius: '50%', background: '#3a342a', display: 'grid', placeItems: 'center', fontFamily: DISP, fontWeight: 700, fontSize: 13, color: p.gold, flexShrink: 0 }}>
                {initials}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 13.5, color: '#EDE7DB', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {userEmail ? userEmail.split('@')[0] : 'Admin'}
                </div>
                <div style={{ fontSize: 11.5, color: 'rgba(237,231,219,.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {userEmail || 'Campus central'}
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: 'rgba(237,231,219,.5)', flexShrink: 0, transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>
                <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <>
                <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9 }} />
                <div style={{
                  position: 'absolute', bottom: 'calc(100% + 8px)', left: 12, right: 12, zIndex: 10,
                  background: '#FBF9F5', border: '1px solid rgba(43,42,38,.12)',
                  borderRadius: 14, boxShadow: '0 -8px 28px rgba(43,42,38,.14)', overflow: 'hidden',
                }}>
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(43,42,38,.08)' }}>
                    <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 13, color: '#2B2A26' }}>
                      {userEmail ? userEmail.split('@')[0] : 'Admin'}
                    </div>
                    <div style={{ fontSize: 12, color: '#837E74', marginTop: 2 }}>{userEmail}</div>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); onLogout?.() }}
                    style={{ width: '100%', textAlign: 'left', padding: '11px 14px', background: 'none', border: 'none', fontFamily: DISP, fontWeight: 600, fontSize: 13.5, color: '#C0392B', cursor: 'pointer' }}
                  >
                    Déconnexion
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid ' + p.line, background: p.surface, flexShrink: 0 }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: DISP, fontWeight: 700, fontSize: 23, color: p.ink }}>{cur.label}</h1>
            <div style={{ fontSize: 13, color: p.muted, marginTop: 2 }}>Vendredi 1 juin 2026 · 12:42</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ width: 42, height: 42, borderRadius: 12, border: '1px solid ' + p.line, background: p.surface, display: 'grid', placeItems: 'center', cursor: 'pointer', position: 'relative' }}>
              <Icon name="bell" size={20} color={p.ink} />
              <span style={{ position: 'absolute', top: 9, right: 10, width: 8, height: 8, borderRadius: 4, background: p.danger, border: '2px solid ' + p.surface }} />
            </button>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: 'auto', padding: 28 }}>{renderView()}</main>
      </div>
    </div>
  );
}
