import { type Palette, DISP } from '../../../theme/palette';
import { useZones, useFeed } from '../../../lib/db';
import { Panel, FeedRow } from '../shared';

export function AccessView({ p }: { p: Palette }) {
  const { data: zones, loading: zonesLoading } = useZones();
  const { data: feed, loading: feedLoading } = useFeed(12);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 18, alignItems: 'start' }}>
      <Panel p={p} title="Occupation des zones">
        {zonesLoading ? (
          <div style={{ padding: '32px 0', textAlign: 'center', color: p.muted, fontFamily: DISP, fontWeight: 600 }}>Chargement…</div>
        ) : zones.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center', color: p.muted, fontSize: 14 }}>Aucune zone configurée</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {zones.map(z => {
              const pct = z.cap > 0 ? Math.round(z.now / z.cap * 100) : 0;
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
        )}
      </Panel>

      <Panel p={p} title="Flux en direct" action={
        <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: p.ok, fontWeight: 700, fontFamily: DISP }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: p.ok }} />En direct
        </span>
      }>
        {feedLoading ? (
          <div style={{ padding: '32px 0', textAlign: 'center', color: p.muted, fontFamily: DISP, fontWeight: 600 }}>Chargement…</div>
        ) : feed.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center', color: p.muted, fontSize: 14 }}>Aucune transaction</div>
        ) : (
          <div>{feed.map((f, i) => <FeedRow key={i} p={p} f={f} last={i === feed.length - 1} />)}</div>
        )}
      </Panel>
    </div>
  );
}
