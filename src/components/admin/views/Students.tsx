import React, { useState } from 'react';
import { type Palette, DISP, BODY } from '../../../theme/palette';
import { STUDENTS_DATA } from '../../../data/mockData';
import { Icon } from '../../ui/Icon';
import { Money } from '../../ui/Money';
import { Panel, StatusPill } from '../shared';

export function Students({ p }: { p: Palette }) {
  const [q, setQ] = useState('');
  const list = STUDENTS_DATA.filter(s => (s.name + s.id).toLowerCase().includes(q.toLowerCase()));

  return (
    <Panel p={p} title="Étudiants & cartes" action={
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: p.surfaceAlt, borderRadius: 999, padding: '7px 13px', width: 230 }}>
        <Icon name="search" size={16} color={p.muted} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher…" style={{ border: 'none', background: 'none', outline: 'none', fontFamily: BODY, fontSize: 13.5, color: p.ink, width: '100%' }} />
      </div>
    }>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '0 8px 10px', fontSize: 12, color: p.muted, fontWeight: 700, letterSpacing: '.03em', textTransform: 'uppercase', borderBottom: '1px solid ' + p.line }}>
        <span>Étudiant</span><span>Classe</span><span>Carte</span><span>Solde</span><span style={{ textAlign: 'right' }}>Dernière activité</span>
      </div>
      {list.map((s, i) => (
        <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', alignItems: 'center', padding: '13px 8px', borderBottom: i === list.length - 1 ? 'none' : '1px solid ' + p.line2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 36, height: 36, borderRadius: '50%', background: p.cardGrad, color: p.cardInk, display: 'grid', placeItems: 'center', fontFamily: DISP, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              {s.name.split(' ').map(x => x[0]).join('')}
            </span>
            <div>
              <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 14, color: p.ink }}>{s.name}</div>
              <div style={{ fontSize: 12, color: p.muted }}>{s.id}</div>
            </div>
          </div>
          <span style={{ fontSize: 13.5, color: p.ink2 }}>{s.cls}</span>
          <span><StatusPill p={p} s={s.status} /></span>
          <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 14, color: p.ink }}><Money value={s.bal} /></span>
          <span style={{ fontSize: 13, color: p.muted, textAlign: 'right' }}>{s.last}</span>
        </div>
      ))}
    </Panel>
  );
}
