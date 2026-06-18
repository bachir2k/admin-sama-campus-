import type { Palette } from '../../theme/palette';
import { Icon } from '../ui/Icon';
import { STUDENT } from '../../data/mockData';

const DISP = '"Quicksand", system-ui, sans-serif';

interface Props { p: Palette }

export function MiniCard({ p }: Props) {
  return (
    <div style={{
      position: 'relative', borderRadius: 22, background: p.cardGrad,
      color: p.cardInk, padding: '20px 22px 18px',
      boxShadow: '0 18px 36px rgba(43,42,38,.22)', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', right: -50, top: -50, width: 170, height: 170, borderRadius: '50%', background: 'radial-gradient(circle, rgba(226,189,124,.5), transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 16 }}>
          Sama<span style={{ color: p.goldSoft }}>Campus</span>
        </div>
        <Icon name="nfc" size={22} color={p.cardInk} strokeWidth={2} style={{ opacity: .85 }} />
      </div>
      <div style={{ marginTop: 16, width: 42, height: 32, borderRadius: 7, background: 'linear-gradient(135deg,#e6c98c,#c79a5d)', position: 'relative', zIndex: 1 }} />
      <div style={{ marginTop: 14, fontFamily: DISP, fontWeight: 600, letterSpacing: '.12em', fontSize: 14 }}>{STUDENT.num}</div>
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', opacity: .65 }}>Titulaire</div>
          <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14 }}>{STUDENT.name}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', opacity: .65 }}>Promo</div>
          <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14 }}>2026</div>
        </div>
      </div>
    </div>
  );
}
