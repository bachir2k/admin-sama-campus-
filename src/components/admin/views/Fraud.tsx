import React, { useState } from 'react';
import { type Palette, DISP } from '../../../theme/palette';
import { useAlerts } from '../../../lib/db';
import { Icon } from '../../ui/Icon';
import { Panel, sevColor } from '../shared';

export function Fraud({ p }: { p: Palette }) {
  const [sel, setSel] = useState(0);
  const { data: ALERTS, loading } = useAlerts();
  const a = ALERTS[sel];

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: p.muted, fontFamily: DISP, fontWeight: 600 }}>Chargement…</div>;
  }

  if (ALERTS.length === 0) {
    return (
      <Panel p={p} title="File d'alertes — détection IA">
        <div style={{ padding: '40px 0', textAlign: 'center', color: p.ok, fontFamily: DISP, fontWeight: 700, fontSize: 15 }}>
          ✓ Aucune alerte active
        </div>
      </Panel>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18, alignItems: 'start' }}>
      <Panel p={p} title="File d'alertes — détection IA" action={
        <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 12, color: p.danger, background: p.dangerSoft, padding: '5px 11px', borderRadius: 999 }}>{ALERTS.length} actives</span>
      }>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ALERTS.map((al, i) => (
            <button key={i} onClick={() => setSel(i)} style={{ textAlign: 'left', display: 'flex', gap: 13, alignItems: 'center', background: i === sel ? p.surfaceAlt : 'transparent', border: '1px solid ' + (i === sel ? p.line : 'transparent'), borderRadius: 14, padding: '13px 14px', cursor: 'pointer' }}>
              <span style={{ width: 42, height: 42, borderRadius: 11, background: sevColor(p, al.sev), display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon name="alert" size={21} color="#fff" />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 14.5, color: p.ink }}>{al.type}</div>
                <div style={{ fontSize: 12.5, color: p.muted }}>{al.who} · {al.id} · {al.loc}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 11.5, color: sevColor(p, al.sev) }}>{al.sev}</div>
                <div style={{ fontSize: 11.5, color: p.muted }}>{al.when}</div>
              </div>
            </button>
          ))}
        </div>
      </Panel>

      {a && (
        <Panel p={p} title="Détail de l'alerte">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: p.dangerSoft, color: p.danger, padding: '6px 12px', borderRadius: 999, fontFamily: DISP, fontWeight: 700, fontSize: 12.5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: sevColor(p, a.sev) }} /> {a.sev}
          </div>
          <h3 style={{ fontFamily: DISP, fontWeight: 700, fontSize: 20, color: p.ink, margin: '14px 0 4px' }}>{a.type}</h3>
          <p style={{ margin: 0, color: p.ink2, fontSize: 14, lineHeight: 1.5 }}>{a.note}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 18, background: p.surfaceAlt, borderRadius: 12, overflow: 'hidden' }}>
            {[['Étudiant', a.who], ['Identifiant', a.id], ['Localisation', a.loc], ['Détecté', a.when], ['Modèle IA', 'TF-Lite · score 0.92']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 14px', background: p.surface, fontSize: 13.5 }}>
                <span style={{ color: p.muted, fontWeight: 600 }}>{k}</span>
                <span style={{ color: p.ink, fontWeight: 700, fontFamily: DISP }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button style={{ flex: 1, background: p.danger, color: '#fff', border: 'none', borderRadius: 12, padding: '13px 0', fontFamily: DISP, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Bloquer la carte</button>
            <button style={{ flex: 1, background: 'transparent', color: p.ink, border: '1px solid ' + p.line, borderRadius: 12, padding: '13px 0', fontFamily: DISP, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Ignorer</button>
          </div>
        </Panel>
      )}
    </div>
  );
}
