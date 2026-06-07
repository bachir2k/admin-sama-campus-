import React, { useState } from 'react';
import { Palette } from '../../../theme/palette';
import { TXNS } from '../../../data/mockData';
import { Money } from '../../ui/Money';
import { TxnRow } from '../TxnRow';

const DISP = '"Quicksand", system-ui, sans-serif';
const CATS = ['Tout', 'Cafétéria', 'Transport', 'Bibliothèque', 'Rechargement'];

export function HistoryScreen({ p }: { p: Palette }) {
  const [filter, setFilter] = useState('Tout');
  const list = TXNS.filter(t => filter === 'Tout' || t.cat === filter);
  const days = [...new Set(list.map(t => t.day))];
  const spentToday = TXNS.filter(t => t.day === "Aujourd'hui" && t.amount < 0).reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontFamily: DISP, fontWeight: 700, fontSize: 26, color: p.ink }}>Historique</h2>
      <p style={{ margin: 0, color: p.muted, fontSize: 14 }}>Dépensé aujourd'hui · <b style={{ color: p.ink }}><Money value={-spentToday} /></b></p>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '16px 0 6px', scrollbarWidth: 'none' }}>
        {CATS.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ border: `1px solid ${filter === c ? 'transparent' : p.line}`, background: filter === c ? p.ink : p.surface, color: filter === c ? p.surface : p.ink2, fontFamily: DISP, fontWeight: 600, fontSize: 13.5, padding: '8px 15px', borderRadius: 999, whiteSpace: 'nowrap' }}>
            {c}
          </button>
        ))}
      </div>

      {days.map(d => (
        <div key={d}>
          <h3 style={{ margin: '24px 0 12px', fontFamily: DISP, fontWeight: 700, fontSize: 18, color: p.ink }}>{d}</h3>
          <div style={{ background: p.surface, border: `1px solid ${p.line}`, borderRadius: 18, padding: '4px 16px' }}>
            {list.filter(t => t.day === d).map((t, i, a) => <TxnRow key={t.id} t={t} p={p} last={i === a.length - 1} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
