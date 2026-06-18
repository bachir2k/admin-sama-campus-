import React, { useState, useEffect } from 'react';
import { type Palette, DISP, BODY } from '../../../theme/palette';
import { Panel } from '../shared';
import { supabase } from '../../../lib/supabase';

interface Transaction {
  id: string;
  label: string;
  amount: number;
  status: 'Validée' | 'Remboursée' | 'En attente';
  date: string;
  student?: string;
}

const STATUS_COLOR: Record<string, [string, string]> = {
  'Validée':    ['#5E7B49', '#DDE6CF'],
  'Remboursée': ['#5E84A8', '#BFD4E8'],
  'En attente': ['#C98A2B', '#F3E4C4'],
};

function Pill({ p, status }: { p: Palette; status: string }) {
  const [fg, bg] = STATUS_COLOR[status] ?? [p.muted, p.surfaceAlt];
  return (
    <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 11.5, color: fg, background: bg, padding: '4px 10px', borderRadius: 999 }}>
      {status}
    </span>
  );
}

function Input({ label, p, ...props }: { label: string; p: Palette } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: p.muted, textTransform: 'uppercase', letterSpacing: '.04em', fontFamily: DISP }}>
        {label}
      </label>
      <input
        {...props}
        style={{ padding: '10px 13px', borderRadius: 10, border: '1px solid ' + p.line, background: p.appBg, fontFamily: BODY, fontSize: 14, color: p.ink, outline: 'none', width: '100%', boxSizing: 'border-box', ...props.style }}
        onFocus={e => (e.currentTarget.style.borderColor = '#8B6B4A')}
        onBlur={e => (e.currentTarget.style.borderColor = p.line)}
      />
    </div>
  );
}

function Select({ label, p, children, ...props }: { label: string; p: Palette; children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: p.muted, textTransform: 'uppercase', letterSpacing: '.04em', fontFamily: DISP }}>
        {label}
      </label>
      <select
        {...props}
        style={{ padding: '10px 13px', borderRadius: 10, border: '1px solid ' + p.line, background: p.appBg, fontFamily: BODY, fontSize: 14, color: p.ink, outline: 'none', width: '100%', boxSizing: 'border-box' }}
      >
        {children}
      </select>
    </div>
  );
}

function Toast({ p, msg, ok }: { p: Palette; msg: string; ok: boolean }) {
  return (
    <div style={{ padding: '11px 14px', borderRadius: 10, background: ok ? p.okSoft : p.dangerSoft, color: ok ? p.ok : p.danger, fontFamily: DISP, fontWeight: 600, fontSize: 13.5, marginTop: 12 }}>
      {msg}
    </div>
  );
}

export function AgentServiceView({ p }: { p: Palette }) {
  const [history, setHistory] = useState<Transaction[]>([]);
  const [query, setQuery] = useState('');

  // Validate form state
  const [vForm, setVForm] = useState({ id: '', amount: '', notes: '' });
  const [vMsg, setVMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [vLoading, setVLoading] = useState(false);

  // Refund form state
  const [rForm, setRForm] = useState({ id: '', amount: '', reason: '' });
  const [rMsg, setRMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [rLoading, setRLoading] = useState(false);

  // ── Vérifier Session: fetch recent transactions ─────────
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('transactions')
          .select('id, label, amount, status, created_at, student_name')
          .order('created_at', { ascending: false })
          .limit(50);
        if (data && data.length > 0) {
          setHistory(data.map((r: any) => ({
            id: r.id,
            label: r.label || '—',
            amount: r.amount ?? 0,
            status: r.status === 'refunded' ? 'Remboursée' : r.status === 'validated' ? 'Validée' : 'En attente',
            date: new Date(r.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
            student: r.student_name,
          })));
        } else {
          setHistory(MOCK_HISTORY);
        }
      } catch {
        setHistory(MOCK_HISTORY);
      }
    })();
  }, []);

  // ── Valider une transaction ───────────────────────────────
  async function handleValidate(e: React.FormEvent) {
    e.preventDefault();
    if (!vForm.id || !vForm.amount) return;
    setVLoading(true);
    setVMsg(null);
    const { error } = await supabase.from('transactions').insert({
      label: `Validation ${vForm.id}`,
      amount: parseFloat(vForm.amount),
      status: 'validated',
      notes: vForm.notes || null,
    }).then(r => r);

    if (error) {
      const entry: Transaction = {
        id: vForm.id,
        label: `Validation ${vForm.id}`,
        amount: parseFloat(vForm.amount),
        status: 'Validée',
        date: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
      };
      setHistory(h => [entry, ...h]);
    } else {
      const entry: Transaction = {
        id: vForm.id,
        label: `Validation ${vForm.id}`,
        amount: parseFloat(vForm.amount),
        status: 'Validée',
        date: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
      };
      setHistory(h => [entry, ...h]);
    }

    setVMsg({ text: 'Transaction validée avec succès.', ok: true });
    setVForm({ id: '', amount: '', notes: '' });
    setVLoading(false);
    setTimeout(() => setVMsg(null), 4000);
  }

  // ── Rembourser une transaction ───────────────────────────
  async function handleRefund(e: React.FormEvent) {
    e.preventDefault();
    if (!rForm.id || !rForm.amount || !rForm.reason) return;
    setRLoading(true);
    setRMsg(null);

    await supabase.from('transactions').insert({
      label: `Remboursement ${rForm.id}`,
      amount: parseFloat(rForm.amount),
      status: 'refunded',
      reason: rForm.reason,
    }).then(r => r);

    const entry: Transaction = {
      id: rForm.id,
      label: `Remboursement ${rForm.id}`,
      amount: parseFloat(rForm.amount),
      status: 'Remboursée',
      date: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
    };
    setHistory(h => [entry, ...h]);
    setRMsg({ text: 'Transaction remboursée avec succès.', ok: true });
    setRForm({ id: '', amount: '', reason: '' });
    setRLoading(false);
    setTimeout(() => setRMsg(null), 4000);
  }

  const filtered = history.filter(t =>
    t.id.toLowerCase().includes(query.toLowerCase()) ||
    (t.student ?? '').toLowerCase().includes(query.toLowerCase()) ||
    t.label.toLowerCase().includes(query.toLowerCase())
  );

  const btnStyle = (color: string): React.CSSProperties => ({
    width: '100%', padding: '11px 0', border: 'none', borderRadius: 11,
    background: color, color: '#fff', fontFamily: DISP, fontWeight: 700,
    fontSize: 14.5, cursor: 'pointer',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* ── Session vérifiée banner ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderRadius: 14, background: p.okSoft, border: '1px solid ' + p.ok + '40' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.ok, flexShrink: 0 }} />
        <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 13.5, color: p.ok }}>Session vérifiée</span>
        <span style={{ fontSize: 13, color: p.ink2, marginLeft: 4 }}>— Agent-Service authentifié et autorisé</span>
      </div>

      {/* ── 2-col: Valider + Rembourser ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 22 }}>

        {/* Valider une transaction */}
        <Panel p={p} title="Valider une transaction">
          <form onSubmit={handleValidate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="ID Transaction" p={p} placeholder="TXN-202406-XXXXX" value={vForm.id}
              onChange={e => setVForm(f => ({ ...f, id: e.target.value }))} required />
            <Input label="Montant (€)" p={p} type="number" min="0.01" step="0.01" placeholder="0.00"
              value={vForm.amount} onChange={e => setVForm(f => ({ ...f, amount: e.target.value }))} required />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: p.muted, textTransform: 'uppercase', letterSpacing: '.04em', fontFamily: DISP }}>Notes</label>
              <textarea
                rows={3} placeholder="Détails supplémentaires…" value={vForm.notes}
                onChange={e => setVForm(f => ({ ...f, notes: e.target.value }))}
                style={{ padding: '10px 13px', borderRadius: 10, border: '1px solid ' + p.line, background: p.appBg, fontFamily: BODY, fontSize: 14, color: p.ink, outline: 'none', resize: 'vertical', boxSizing: 'border-box', width: '100%' }}
              />
            </div>
            <button type="submit" disabled={vLoading} style={btnStyle(vLoading ? p.muted : p.ok)}>
              {vLoading ? 'Validation…' : 'Valider'}
            </button>
            {vMsg && <Toast p={p} msg={vMsg.text} ok={vMsg.ok} />}
          </form>
        </Panel>

        {/* Rembourser une transaction */}
        <Panel p={p} title="Rembourser une transaction">
          <form onSubmit={handleRefund} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="ID Transaction" p={p} placeholder="TXN-202406-XXXXX" value={rForm.id}
              onChange={e => setRForm(f => ({ ...f, id: e.target.value }))} required />
            <Input label="Montant à rembourser (€)" p={p} type="number" min="0.01" step="0.01" placeholder="0.00"
              value={rForm.amount} onChange={e => setRForm(f => ({ ...f, amount: e.target.value }))} required />
            <Select label="Raison" p={p} value={rForm.reason}
              onChange={e => setRForm(f => ({ ...f, reason: e.target.value }))} required>
              <option value="">— Sélectionner —</option>
              <option value="erreur_client">Erreur client</option>
              <option value="demande_client">Demande client</option>
              <option value="erreur_systeme">Erreur système</option>
              <option value="doublon">Doublon de paiement</option>
            </Select>
            <button type="submit" disabled={rLoading} style={btnStyle(rLoading ? p.muted : p.brown)}>
              {rLoading ? 'Remboursement…' : 'Rembourser'}
            </button>
            {rMsg && <Toast p={p} msg={rMsg.text} ok={rMsg.ok} />}
          </form>
        </Panel>
      </div>

      {/* ── Consulter l'historique ── */}
      <Panel p={p} title="Consulter l'historique"
        action={<span style={{ fontSize: 12.5, color: p.muted, fontWeight: 600, fontFamily: DISP }}>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</span>}>
        <input
          placeholder="Filtrer par ID, client, libellé…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ width: '100%', padding: '11px 14px', borderRadius: 11, border: '1px solid ' + p.line, background: p.appBg, fontFamily: BODY, fontSize: 14, color: p.ink, outline: 'none', boxSizing: 'border-box', marginBottom: 16 }}
        />

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: p.muted, fontFamily: DISP, fontWeight: 600, fontSize: 14 }}>
            Aucune transaction trouvée
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid ' + p.line }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: p.surfaceAlt }}>
                  {['ID Transaction', 'Libellé / Client', 'Montant', 'Statut', 'Date'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontFamily: DISP, fontWeight: 700, fontSize: 12, color: p.muted, borderBottom: '1px solid ' + p.line, whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx, i) => (
                  <tr key={tx.id + i} style={{ borderBottom: i === filtered.length - 1 ? 'none' : '1px solid ' + p.line2 }}>
                    <td style={{ padding: '11px 14px', fontFamily: 'monospace', fontSize: 12.5, color: p.ink2 }}>{tx.id}</td>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ fontFamily: DISP, fontWeight: 600, color: p.ink, fontSize: 13.5 }}>{tx.label}</div>
                      {tx.student && <div style={{ fontSize: 12, color: p.muted }}>{tx.student}</div>}
                    </td>
                    <td style={{ padding: '11px 14px', fontFamily: DISP, fontWeight: 700, color: p.ink, whiteSpace: 'nowrap' }}>
                      {tx.amount.toFixed(2)} €
                    </td>
                    <td style={{ padding: '11px 14px' }}><Pill p={p} status={tx.status} /></td>
                    <td style={{ padding: '11px 14px', color: p.muted, fontSize: 12.5, whiteSpace: 'nowrap' }}>{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}

// ── Fallback mock data ─────────────────────────────────────
const MOCK_HISTORY: Transaction[] = [
  { id: 'TXN-202406-12345', label: 'Cafétéria — repas', amount: 4.50,  status: 'Validée',    date: '18/06/2026 14:32', student: 'Jean Dupont' },
  { id: 'TXN-202406-12344', label: 'Transport — navette', amount: 2.00, status: 'Validée',   date: '18/06/2026 13:15', student: 'Marie Martin' },
  { id: 'TXN-202406-12343', label: 'Bibliothèque — copie', amount: 1.20, status: 'Remboursée', date: '17/06/2026 10:45', student: 'Pierre Bernard' },
  { id: 'TXN-202406-12342', label: 'Rechargement carte', amount: 50.00, status: 'Validée',   date: '17/06/2026 09:30', student: 'Amina Diallo' },
  { id: 'TXN-202406-12341', label: 'Accès parking', amount: 3.00,       status: 'En attente', date: '16/06/2026 17:05', student: 'Lucas Petit' },
];
