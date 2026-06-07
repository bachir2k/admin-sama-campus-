import React, { useState } from 'react';
import { type Palette, DISP } from '../../../theme/palette';
import { FEED } from '../../../data/mockData';
import { Panel, FeedRow } from '../shared';

export function Transactions({ p }: { p: Palette }) {
  const [filter, setFilter] = useState('Tout');
  const cats = ['Tout', 'Cafétéria', 'Transport', 'Bibliothèque', 'Rechargement', 'Accès'];
  const list = FEED.filter(t => filter === 'Tout' || t.svc === filter);

  return (
    <Panel p={p} title="Transactions du campus" action={<span style={{ fontSize: 12.5, color: p.muted, fontWeight: 600 }}>3 482 aujourd'hui</span>}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ border: '1px solid ' + (filter === c ? 'transparent' : p.line), background: filter === c ? p.ink : 'transparent', color: filter === c ? p.surface : p.ink2, fontFamily: DISP, fontWeight: 600, fontSize: 13, padding: '7px 14px', borderRadius: 999, cursor: 'pointer' }}>{c}</button>
        ))}
      </div>
      <div>{list.map((f, i) => <FeedRow key={i} p={p} f={f} last={i === list.length - 1} />)}</div>
    </Panel>
  );
}
