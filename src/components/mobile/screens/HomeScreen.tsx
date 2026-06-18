import type { Palette } from '../../../theme/palette';
import { STUDENT, TXNS } from '../../../data/mockData';
import { Icon } from '../../ui/Icon';
import { Money } from '../../ui/Money';
import { MiniCard } from '../MiniCard';
import { TxnRow } from '../TxnRow';

const DISP = '"Quicksand", system-ui, sans-serif';

interface Props { p: Palette; go: (s: string) => void }

export function HomeScreen({ p, go }: Props) {
  const quick = [
    { ic: 'plus', label: 'Recharger', to: 'pay-recharge' },
    { ic: 'pay',  label: 'Payer',     to: 'pay-pay' },
    { ic: 'qr',   label: 'Accès',     to: 'access' },
    { ic: 'calendar', label: 'Présences', to: 'presences' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 13.5, color: p.muted, fontWeight: 600 }}>Bonjour,</div>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 23, color: p.ink, letterSpacing: '-.01em' }}>{STUDENT.first} 👋</div>
        </div>
        <button style={{ position: 'relative', width: 44, height: 44, borderRadius: 13, border: `1px solid ${p.line}`, background: p.surface, display: 'grid', placeItems: 'center' }}>
          <Icon name="bell" size={21} color={p.ink} />
          <span style={{ position: 'absolute', top: 10, right: 11, width: 8, height: 8, borderRadius: 4, background: p.danger, border: `2px solid ${p.surface}` }} />
        </button>
      </div>

      <MiniCard p={p} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: p.surface, border: `1px solid ${p.line}`, borderRadius: 16, padding: '14px 18px', marginTop: 14 }}>
        <div>
          <div style={{ fontSize: 12.5, color: p.muted, fontWeight: 600 }}>Solde disponible</div>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 26, color: p.ink }}><Money value={STUDENT.balance} /></div>
        </div>
        <button onClick={() => go('pay-recharge')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: p.ink, color: p.surface, border: 'none', borderRadius: 999, padding: '11px 16px', fontFamily: DISP, fontWeight: 600, fontSize: 14 }}>
          <Icon name="plus" size={17} color={p.surface} strokeWidth={2.4} /> Recharger
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginTop: 14 }}>
        {quick.map(q => (
          <button key={q.label} onClick={() => go(q.to)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: p.surface, border: `1px solid ${p.line}`, borderRadius: 16, padding: '14px 4px' }}>
            <span style={{ width: 38, height: 38, borderRadius: 11, background: p.surfaceAlt, display: 'grid', placeItems: 'center' }}><Icon name={q.ic} size={20} color={p.brown} /></span>
            <span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 11.5, color: p.ink2 }}>{q.label}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '24px 0 12px' }}>
        <h3 style={{ margin: 0, fontFamily: DISP, fontWeight: 700, fontSize: 18, color: p.ink }}>Activité récente</h3>
        <button onClick={() => go('history')} style={{ background: 'none', border: 'none', color: p.brown, fontFamily: DISP, fontWeight: 600, fontSize: 13.5 }}>Tout voir</button>
      </div>
      <div style={{ background: p.surface, border: `1px solid ${p.line}`, borderRadius: 18, padding: '4px 16px' }}>
        {TXNS.slice(0, 4).map((t, i) => <TxnRow key={t.id} t={t} p={p} last={i === 3} />)}
      </div>
    </div>
  );
}
