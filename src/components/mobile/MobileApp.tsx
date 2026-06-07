import React, { useState } from 'react';
import { scPalette } from '../../theme/palette';
import { Icon } from '../ui/Icon';
import { HomeScreen } from './screens/HomeScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { PayScreen } from './screens/PayScreen';
import { AccessScreen } from './screens/AccessScreen';
import { PresencesScreen } from './screens/PresencesScreen';
import { ProfileScreen } from './screens/ProfileScreen';

type Screen = 'home' | 'history' | 'pay' | 'pay-pay' | 'pay-recharge' | 'access' | 'presences' | 'profile';
type Variant = 'light' | 'dark';

const DISP = '"Quicksand", system-ui, sans-serif';
const TABS = [
  { key: 'home' as Screen,    ic: 'home',    label: 'Carte' },
  { key: 'history' as Screen, ic: 'history', label: 'Activité' },
  { key: 'pay' as Screen,     ic: 'pay',     label: 'Payer',   center: true },
  { key: 'access' as Screen,  ic: 'qr',      label: 'Accès' },
  { key: 'profile' as Screen, ic: 'user',    label: 'Profil' },
];

interface Props {
  variant?: Variant;
  /** Afficher dans un cadre téléphone (pour l'aperçu admin) */
  inFrame?: boolean;
}

export function MobileApp({ variant = 'light', inFrame = false }: Props) {
  const p = scPalette(variant);
  const [screen, setScreen] = useState<Screen>('home');

  const go = (s: string) => setScreen(s as Screen);
  const baseTab: Screen | null = screen.startsWith('pay') ? 'pay' : screen === 'presences' ? null : screen as Screen;
  const showBack = screen === 'presences';

  let content: React.ReactNode;
  switch (screen) {
    case 'home':         content = <HomeScreen p={p} go={go} />; break;
    case 'history':      content = <HistoryScreen p={p} />; break;
    case 'pay':
    case 'pay-pay':      content = <PayScreen p={p} mode="pay" />; break;
    case 'pay-recharge': content = <PayScreen p={p} mode="recharge" />; break;
    case 'access':       content = <AccessScreen p={p} />; break;
    case 'presences':    content = <PresencesScreen p={p} />; break;
    case 'profile':      content = <ProfileScreen p={p} />; break;
    default:             content = <HomeScreen p={p} go={go} />;
  }

  const app = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: p.appBg, fontFamily: '"Mulish", system-ui, sans-serif', color: p.ink, overflow: 'hidden' }}>
      <div style={{ height: 20, flexShrink: 0, background: p.appBg }} />
      {showBack && (
        <div style={{ padding: '0 20px 6px', flexShrink: 0 }}>
          <button onClick={() => go('home')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: p.brown, fontFamily: DISP, fontWeight: 600, fontSize: 14.5, background: 'none', border: 'none' }}>
            <Icon name="chevL" size={18} color={p.brown} /> Accueil
          </button>
        </div>
      )}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '6px 20px 16px' }}>{content}</div>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '8px 10px 20px', background: p.tabBg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderTop: `1px solid ${p.line}` }}>
        {TABS.map(t => {
          const active = baseTab === t.key;
          if (t.center) {
            return (
              <button key={t.key} onClick={() => go('pay')} style={{ background: p.ink, border: 'none', width: 52, height: 52, borderRadius: 17, display: 'grid', placeItems: 'center', marginTop: -18, boxShadow: '0 8px 18px rgba(43,42,38,.28)', flexShrink: 0 }}>
                <Icon name="pay" size={24} color={p.surface} strokeWidth={2} />
              </button>
            );
          }
          return (
            <button key={t.key} onClick={() => go(t.key)} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '4px 8px', flex: 1 }}>
              <Icon name={t.ic} size={23} color={active ? p.brown : p.muted} strokeWidth={active ? 2.2 : 1.8} />
              <span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 10.5, color: active ? p.brown : p.muted }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  if (!inFrame) return app;

  /* Cadre téléphone pour l'aperçu dans l'admin */
  return (
    <div style={{ width: 360, height: 720, borderRadius: 40, overflow: 'hidden', position: 'relative', boxShadow: '0 40px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.1)', flexShrink: 0 }}>
      {/* dynamic island */}
      <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 100, height: 30, borderRadius: 20, background: '#000', zIndex: 50 }} />
      {app}
    </div>
  );
}
