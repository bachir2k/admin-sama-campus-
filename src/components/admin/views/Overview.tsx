import React from 'react';
import { type Palette, DISP } from '../../../theme/palette';
import { ALERTS, FEED } from '../../../data/mockData';
import { Icon } from '../../ui/Icon';
import { Panel, Bars, Donut, FeedRow, sevColor } from '../shared';

interface Props { p: Palette; goFraud: () => void; }

export function Overview({ p, goFraud }: Props) {
  const kpis = [
    { label: 'Transactions du jour', val: '3 482', delta: '+12%', up: true, ic: 'card' },
    { label: 'Volume (FCFA)', val: '2,84 M', delta: '+8%', up: true, ic: 'trend' },
    { label: 'Présences validées', val: '1 204', delta: '94%', up: true, ic: 'calendar' },
    { label: 'Alertes fraude', val: '7', delta: '3 critiques', up: false, ic: 'shield' },
  ];
  const hours = [['8h',180],['9h',320],['10h',280],['11h',410],['12h',540],['13h',470],['14h',300],['15h',360],['16h',250],['17h',190]].map(([l,v]) => ({ l: l as string, v: v as number }));
  const seg = [{ l: 'Cafétéria', v: 46, c: p.brown }, { l: 'Transport', v: 28, c: p.olive }, { l: 'Bibliothèque', v: 18, c: p.blue }, { l: 'Autres', v: 8, c: p.goldSoft }];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: p.surface, border: '1px solid ' + p.line, borderRadius: 16, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ width: 38, height: 38, borderRadius: 10, background: !k.up ? p.dangerSoft : p.surfaceAlt, display: 'grid', placeItems: 'center' }}>
                <Icon name={k.ic} size={20} color={!k.up ? p.danger : p.brown} />
              </span>
              <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 12, color: !k.up ? p.danger : p.ok, background: !k.up ? p.dangerSoft : p.okSoft, padding: '4px 9px', borderRadius: 999 }}>{k.delta}</span>
            </div>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 30, color: p.ink, marginTop: 14, whiteSpace: 'nowrap' }}>{k.val}</div>
            <div style={{ fontSize: 13, color: p.muted, fontWeight: 600, marginTop: 2 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18 }}>
        <Panel p={p} title="Usages par heure" action={<span style={{ fontSize: 12.5, color: p.muted, fontWeight: 600 }}>Aujourd'hui</span>}>
          <Bars p={p} data={hours} color="#D8CFBE" />
        </Panel>
        <Panel p={p} title="Répartition par service">
          <div style={{ paddingTop: 6 }}><Donut p={p} segments={seg} /></div>
        </Panel>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 18 }}>
        <Panel p={p} title="Alertes récentes" action={<button onClick={goFraud} style={{ background: 'none', border: 'none', color: p.brown, fontFamily: DISP, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Tout voir</button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ALERTS.slice(0, 3).map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
                <span style={{ width: 9, height: 9, borderRadius: 5, background: sevColor(p, a.sev), flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13.5, color: p.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.type}</div>
                  <div style={{ fontSize: 12, color: p.muted }}>{a.id} · {a.when}</div>
                </div>
                <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 11.5, color: sevColor(p, a.sev) }}>{a.sev}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel p={p} title="Flux temps réel">
          <div>{FEED.slice(0, 4).map((f, i) => <FeedRow key={i} p={p} f={f} last={i === 3} />)}</div>
        </Panel>
      </div>
    </div>
  );
}
