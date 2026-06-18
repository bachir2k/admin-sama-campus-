import type { Palette } from '../../theme/palette';
import type { Transaction } from '../../data/mockData';
import { Icon } from '../ui/Icon';
import { Money } from '../ui/Money';

const DISP = '"Quicksand", system-ui, sans-serif';

const CAT_COLOR: Record<string, string> = {
  'Cafétéria': '#8B6B4A', 'Transport': '#7C8458',
  'Bibliothèque': '#5E84A8', 'Rechargement': '#5E7B49',
};

interface Props { t: Transaction; last: boolean; p: Palette }

export function TxnRow({ t, last, p }: Props) {
  const pos = t.amount > 0;
  const zero = t.amount === 0;
  const bg = CAT_COLOR[t.cat] ?? p.brown;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 0', borderBottom: last ? 'none' : `1px solid ${p.line2}` }}>
      <div style={{ width: 42, height: 42, borderRadius: 13, background: bg, color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <Icon name={t.icon} size={19} color="#fff" strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 15, color: p.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.label}</div>
        <div style={{ fontSize: 12.5, color: p.muted, marginTop: 2 }}>{t.when}</div>
      </div>
      <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 15.5, color: zero ? p.muted : pos ? p.ok : p.ink, flexShrink: 0 }}>
        {zero ? 'Accès' : <Money value={t.amount} sign />}
      </div>
    </div>
  );
}
