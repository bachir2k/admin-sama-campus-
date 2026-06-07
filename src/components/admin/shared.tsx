import React from 'react';
import { type Palette, DISP } from '../../theme/palette';
import { Icon } from '../ui/Icon';
import { Money } from '../ui/Money';
import type { FeedItem } from '../../data/mockData';

// ── Panel card ────────────────────────────────────────────
interface PanelProps {
  p: Palette;
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}
export function Panel({ p, title, action, children, style }: PanelProps) {
  return (
    <div style={{ background: p.surface, border: '1px solid ' + p.line, borderRadius: 18, padding: 22, ...style }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontFamily: DISP, fontWeight: 700, fontSize: 16.5, color: p.ink }}>{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

// ── Tint helper ───────────────────────────────────────────
export function tintColor(p: Palette, name: string): string {
  const map: Record<string, string> = { brown: p.brown, olive: p.olive, blue: p.blue, gold: p.gold, ok: p.ok, danger: p.danger };
  return map[name] || p.brown;
}

// ── Severity color ────────────────────────────────────────
export function sevColor(p: Palette, s: string): string {
  const map: Record<string, string> = { Critique: p.danger, Élevée: '#C98A2B', Moyenne: p.blue, Faible: p.muted };
  return map[s] || p.muted;
}

// ── Feed row ──────────────────────────────────────────────
export function FeedRow({ p, f, last }: { p: Palette; f: FeedItem; last: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: last ? 'none' : '1px solid ' + p.line2 }}>
      <span style={{ width: 36, height: 36, borderRadius: 10, background: tintColor(p, f.tint), display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <Icon name={f.icon} size={18} color="#fff" strokeWidth={2} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: DISP, fontWeight: 600, fontSize: 13.5, color: p.ink }}>{f.label}</div>
        <div style={{ fontSize: 12, color: p.muted }}>{f.svc} · {f.who}</div>
      </div>
      {f.amount !== 0
        ? <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 13.5, color: f.amount > 0 ? p.ok : p.ink }}><Money value={f.amount} sign /></span>
        : <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 11.5, color: f.bad ? p.danger : p.ok }}>{f.bad ? 'Refusé' : 'OK'}</span>
      }
      <span style={{ fontSize: 11.5, color: p.muted, fontVariantNumeric: 'tabular-nums', minWidth: 56, textAlign: 'right' }}>{f.when}</span>
    </div>
  );
}

// ── Bar chart ─────────────────────────────────────────────
export function Bars({ p, data, color }: { p: Palette; data: { l: string; v: number }[]; color: string }) {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160, paddingTop: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: 30, height: (d.v / max * 100) + '%', background: i === data.length - 2 ? p.brown : color, borderRadius: '6px 6px 0 0' }} />
          <span style={{ fontSize: 11, color: p.muted, fontWeight: 600 }}>{d.l}</span>
        </div>
      ))}
    </div>
  );
}

// ── Donut chart ───────────────────────────────────────────
export function Donut({ p, segments, size = 150 }: { p: Palette; segments: { l: string; v: number; c: string }[]; size?: number }) {
  let acc = 0;
  const stops = segments.map(s => { const from = acc; acc += s.v; return `${s.c} ${from}% ${acc}%`; }).join(', ');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
      <div style={{ width: size, height: size, borderRadius: '50%', background: `conic-gradient(${stops})`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <div style={{ width: size * 0.62, height: size * 0.62, borderRadius: '50%', background: p.surface, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          <div>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 22, color: p.ink, lineHeight: 1 }}>3 482</div>
            <div style={{ fontSize: 10.5, color: p.muted, fontWeight: 600 }}>usages</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {segments.map(s => (
          <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 11, height: 11, borderRadius: 3, background: s.c, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: p.ink2, fontWeight: 600, flex: 1 }}>{s.l}</span>
            <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 13, color: p.ink }}>{s.v}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Status pill ───────────────────────────────────────────
export function StatusPill({ p, s }: { p: Palette; s: string }) {
  const map: Record<string, [string, string]> = {
    Active: [p.ok, p.okSoft],
    Bloquée: [p.danger, p.dangerSoft],
    'En attente': ['#C98A2B', p.goldSoft],
  };
  const [c, bg] = map[s] || [p.muted, p.surfaceAlt];
  return <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 11.5, color: c, background: bg, padding: '4px 10px', borderRadius: 999 }}>{s}</span>;
}
