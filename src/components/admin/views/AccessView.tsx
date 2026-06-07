import React from 'react';
import { type Palette, DISP } from '../../../theme/palette';
import { ZONES, FEED } from '../../../data/mockData';
import { Panel, FeedRow } from '../shared';

export function AccessView({ p }: { p: Palette }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 18, alignItems: 'start' }}>
      <Panel p={p} title="Occupation des zones">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ZONES.map(z => {
            const pct = Math.round(z.now / z.cap * 100);
            const c = pct > 85 ? p.danger : pct > 60 ? '#C98A2B' : p.ok;
            return (
              <div key={z.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                  <span style={{ fontFamily: DISP, fontWeight: 600, fontSize: 14, color: p.ink }}>{z.name}</span>
                  <span style={{ fontSize: 13, color: p.muted, fontWeight: 600 }}>{z.now}/{z.cap}</span>
                </div>
                <div style={{ height: 9, borderRadius: 6, background: p.surfaceAlt, overflow: 'hidden' }}>
                  <div style={{ width: pct + '%', height: '100%', background: c, borderRadius: 6 }} />
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel p={p} title="Flux d'accès en direct" action={
        <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: p.ok, fontWeight: 700, fontFamily: DISP }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: p.ok }} />En direct
        </span>
      }>
        <div>{FEED.map((f, i) => <FeedRow key={i} p={p} f={f} last={i === FEED.length - 1} />)}</div>
      </Panel>
    </div>
  );
}
