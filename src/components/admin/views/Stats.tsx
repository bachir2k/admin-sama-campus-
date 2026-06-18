import { type Palette, DISP } from '../../../theme/palette';
import { Panel, Bars, Donut } from '../shared';

export function Stats({ p }: { p: Palette }) {
  const weeks = [['S-5',60],['S-4',72],['S-3',68],['S-2',85],['S-1',92],['Cette s.',100]].map(([l,v]) => ({ l: l as string, v: v as number }));
  const seg = [{ l: 'Cafétéria', v: 46, c: p.brown }, { l: 'Transport', v: 28, c: p.olive }, { l: 'Bibliothèque', v: 18, c: p.blue }, { l: 'Autres', v: 8, c: p.goldSoft }];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18 }}>
        <Panel p={p} title="Évolution des usages (6 semaines)"><Bars p={p} data={weeks} color={p.olive} /></Panel>
        <Panel p={p} title="Mix des services"><div style={{ paddingTop: 6 }}><Donut p={p} segments={seg} /></div></Panel>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {[["Taux de présence moyen", "94%"], ["Fraudes évitées (mois)", "38"], ["Temps moyen d'accès", "0,4 s"]].map(([l, v]) => (
          <div key={l} style={{ background: p.surface, border: '1px solid ' + p.line, borderRadius: 16, padding: 20 }}>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 32, color: p.ink }}>{v}</div>
            <div style={{ fontSize: 13.5, color: p.muted, fontWeight: 600, marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
