import React, { useState } from 'react';
import { type Palette, DISP, BODY } from '../../../theme/palette';
import { useStudents, useStudentTransactions } from '../../../lib/db';
import type { StudentRecord } from '../../../data/mockData';
import { supabase } from '../../../lib/supabase';
import { supabaseAuth } from '../../../lib/supabaseAdmin';
import { Icon } from '../../ui/Icon';
import { Money } from '../../ui/Money';
import { Panel, StatusPill, FeedRow } from '../shared';

// ── Helpers ───────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11.5, fontWeight: 700, color: '#837E74', textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text', required, disabled }: {
  value: string; onChange?: (v: string) => void; placeholder?: string; type?: string; required?: boolean; disabled?: boolean
}) {
  return (
    <input
      type={type} value={value} onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder} required={required} disabled={disabled}
      style={{ padding: '10px 13px', borderRadius: 10, border: '1px solid rgba(43,42,38,.14)', background: '#F4F1EC', fontFamily: BODY, fontSize: 14, color: '#2B2A26', outline: 'none', width: '100%', boxSizing: 'border-box', cursor: disabled ? 'not-allowed' : 'text' }}
    />
  );
}

// ── Student number generator ──────────────────────────────
// Format: ETU-[A-Z][0-9]{2}[A-Z]  e.g. ETU-A42B
async function generateStudentNumber(): Promise<string> {
  const L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const D = '0123456789';

  for (let attempt = 0; attempt < 30; attempt++) {
    const num = `ETU-${L[Math.floor(Math.random() * 26)]}${D[Math.floor(Math.random() * 10)]}${D[Math.floor(Math.random() * 10)]}${L[Math.floor(Math.random() * 26)]}`;

    const { count } = await supabase
      .from('students')
      .select('id', { count: 'exact', head: true })
      .eq('student_number', num);

    if ((count ?? 0) === 0) return num;
  }
  throw new Error('Impossible de générer un numéro unique. Réessayez.');
}

// ── Success card ──────────────────────────────────────────
function SuccessCard({ studentName, studentNumber, email, onClose }: {
  studentName: string; studentNumber: string; email: string; onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const info = `Nom : ${studentName}\nN° étudiant : ${studentNumber}\nEmail : ${email}\nMot de passe initial : passer123`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '4px 0' }}>
      {/* Success banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 44, height: 44, borderRadius: '50%', background: '#E8F5E9', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 11l5 5 9-9" stroke="#2E7D32" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
        <div>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 16, color: '#1B4332' }}>Étudiant créé avec succès</div>
          <div style={{ fontSize: 13, color: '#4A7C59', marginTop: 2 }}>{studentName}</div>
        </div>
      </div>

      {/* Credentials box */}
      <div style={{ background: '#F4F1EC', borderRadius: 14, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 11.5, color: '#837E74', letterSpacing: '.08em', textTransform: 'uppercase' }}>
          Identifiants de connexion
        </div>

        <CredRow label="N° étudiant" value={studentNumber} mono />
        <CredRow label="Email" value={email || '—'} />
        <CredRow label="Mot de passe initial" value="passer123" mono secret />
      </div>

      {/* Warning */}
      <div style={{ display: 'flex', gap: 10, background: '#FFF8E1', borderRadius: 10, padding: '12px 14px', alignItems: 'flex-start' }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><path d="M9 1L1 16h16L9 1z" stroke="#F59E0B" strokeWidth="1.6" fill="none" strokeLinejoin="round"/><path d="M9 7v4M9 13h.01" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round"/></svg>
        <div style={{ fontSize: 12.5, color: '#92400E', lineHeight: 1.5 }}>
          L'étudiant devra <strong>changer son mot de passe</strong> à la première connexion. Communiquez-lui ces identifiants de façon sécurisée.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => { navigator.clipboard.writeText(info); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: '1px solid rgba(43,42,38,.14)', background: 'transparent', fontFamily: DISP, fontWeight: 600, fontSize: 13.5, color: '#2B2A26', cursor: 'pointer' }}
        >
          {copied ? '✓ Copié !' : 'Copier les infos'}
        </button>
        <button
          onClick={onClose}
          style={{ flex: 2, padding: '12px 0', borderRadius: 12, border: 'none', background: '#2B2A26', color: '#EDE7DB', fontFamily: DISP, fontWeight: 700, fontSize: 13.5, cursor: 'pointer' }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

function CredRow({ label, value, mono, secret }: { label: string; value: string; mono?: boolean; secret?: boolean }) {
  const [revealed, setRevealed] = useState(!secret);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <span style={{ fontSize: 12.5, color: '#837E74', flexShrink: 0 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontFamily: mono ? 'monospace' : DISP, fontWeight: 700, fontSize: 13.5, color: '#2B2A26', letterSpacing: mono ? '.04em' : undefined }}>
          {revealed ? value : '••••••••'}
        </span>
        {secret && (
          <button onClick={() => setRevealed(r => !r)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#837E74', padding: 2, lineHeight: 1 }}>
            {revealed
              ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/><line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
            }
          </button>
        )}
      </div>
    </div>
  );
}

// ── Grouping helpers ────────────────────────────────────────
// "Master 1" → niveau "Master", classe "Master 1"
function parseClass(cls?: string): { niveau: string; classe: string } {
  const c = (cls || '').trim();
  if (!c) return { niveau: 'Sans classe', classe: 'Sans classe' };
  const parts = c.split(' ');
  if (parts.length > 1 && /^\d+$/.test(parts[parts.length - 1])) {
    return { niveau: parts.slice(0, -1).join(' '), classe: c };
  }
  return { niveau: c, classe: c };
}

const NIVEAU_ORDER = ['Licence', 'Master', 'Doctorat'];

function groupStudents(list: StudentRecord[]) {
  const map = new Map<string, Map<string, StudentRecord[]>>();
  for (const s of list) {
    const { niveau, classe } = parseClass(s.cls);
    if (!map.has(niveau)) map.set(niveau, new Map());
    const classes = map.get(niveau)!;
    if (!classes.has(classe)) classes.set(classe, []);
    classes.get(classe)!.push(s);
  }
  const niveaux = Array.from(map.keys()).sort((a, b) => {
    if (a === 'Sans classe') return 1;
    if (b === 'Sans classe') return -1;
    const ia = NIVEAU_ORDER.indexOf(a), ib = NIVEAU_ORDER.indexOf(b);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    return a.localeCompare(b);
  });
  return niveaux.map(niveau => ({
    niveau,
    count: Array.from(map.get(niveau)!.values()).reduce((n, a) => n + a.length, 0),
    classes: Array.from(map.get(niveau)!.entries())
      .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))
      .map(([classe, students]) => ({ classe, students })),
  }));
}

// ── Detail modal ──────────────────────────────────────────
function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 14px', background: '#FBF9F5', fontSize: 13.5 }}>
      <span style={{ color: '#837E74', fontWeight: 600 }}>{label}</span>
      <span style={{ color: '#2B2A26', fontWeight: 700, fontFamily: mono ? 'monospace' : DISP, textAlign: 'right', maxWidth: '60%', wordBreak: 'break-word' }}>{value}</span>
    </div>
  );
}

function StudentDetailModal({ student, p, onClose }: { student: StudentRecord; p: Palette; onClose: () => void }) {
  const { data: txns, loading: txnsLoading } = useStudentTransactions(student.dbId ?? null);
  const initials = student.name.split(' ').map((x: string) => x[0]).join('');

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(27,24,19,.45)', backdropFilter: 'blur(3px)' }} />
      <div style={{ position: 'relative', width: 520, background: '#FBF9F5', borderRadius: 20, boxShadow: '0 24px 60px rgba(27,24,19,.22)', padding: 30, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontFamily: DISP, fontWeight: 700, fontSize: 20, color: '#2B2A26' }}>Détails de l'étudiant</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#837E74', padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Profile header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <span style={{ width: 52, height: 52, borderRadius: '50%', background: p.cardGrad, color: p.cardInk, display: 'grid', placeItems: 'center', fontFamily: DISP, fontWeight: 700, fontSize: 18, flexShrink: 0 }}>
            {initials}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 18, color: p.ink }}>{student.name}</div>
            <div style={{ fontSize: 13, color: p.muted, marginTop: 2, fontFamily: 'monospace', letterSpacing: '.04em' }}>{student.id}</div>
          </div>
          <StatusPill p={p} s={student.status} />
        </div>

        {/* Identity */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 11.5, color: '#837E74', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>Identité</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: '#F4F1EC', borderRadius: 12, overflow: 'hidden' }}>
            <DetailRow label="Prénom" value={student.firstName || '—'} />
            <DetailRow label="Email" value={student.email || '—'} />
            <DetailRow label="Téléphone" value={student.phone || '—'} />
            <DetailRow label="Mot de passe à changer" value={student.mustChangePassword ? 'Oui' : 'Non'} />
          </div>
        </div>

        {/* Scolarité */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 11.5, color: '#837E74', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>Scolarité</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: '#F4F1EC', borderRadius: 12, overflow: 'hidden' }}>
            <DetailRow label="Promo" value={student.promo || '—'} />
            <DetailRow label="Classe" value={student.class || student.cls || '—'} />
          </div>
        </div>

        {/* Carte */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 11.5, color: '#837E74', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>Carte NFC</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: '#F4F1EC', borderRadius: 12, overflow: 'hidden' }}>
            <DetailRow label="N° carte" value={student.cardNumber || '—'} mono />
            <DetailRow label="Statut" value={student.status} />
            <DetailRow label="Solde" value={`${student.bal.toLocaleString('fr-FR')} FCFA`} />
          </div>
        </div>

        {/* Recent transactions */}
        <div>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 11.5, color: '#837E74', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>Dernières transactions</div>
          <div style={{ background: p.surface, border: '1px solid ' + p.line, borderRadius: 12, padding: '4px 14px' }}>
            {txnsLoading ? (
              <div style={{ padding: '20px 0', textAlign: 'center', color: p.muted, fontSize: 13 }}>Chargement…</div>
            ) : txns.length === 0 ? (
              <div style={{ padding: '20px 0', textAlign: 'center', color: p.muted, fontSize: 13 }}>Aucune transaction</div>
            ) : (
              txns.map((t, i) => <FeedRow key={i} p={p} f={t} last={i === txns.length - 1} />)
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          style={{ width: '100%', marginTop: 20, padding: '13px 0', borderRadius: 12, border: 'none', background: '#2B2A26', color: '#EDE7DB', fontFamily: DISP, fontWeight: 700, fontSize: 14.5, cursor: 'pointer' }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

function StudentRow({ s, p, last, onDetail }: { s: StudentRecord; p: Palette; last: boolean; onDetail: () => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) 110px', alignItems: 'center', padding: '13px 8px', borderBottom: last ? 'none' : '1px solid ' + p.line2 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 36, height: 36, borderRadius: '50%', background: p.cardGrad, color: p.cardInk, display: 'grid', placeItems: 'center', fontFamily: DISP, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
          {s.name.split(' ').map((x: string) => x[0]).join('')}
        </span>
        <div>
          <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 14, color: p.ink }}>{s.name}</div>
          <div style={{ fontSize: 12, color: p.muted }}>{s.id}</div>
        </div>
      </div>
      <span style={{ fontSize: 13.5, color: p.ink2 }}>{s.cls || '—'}</span>
      <span><StatusPill p={p} s={s.status} /></span>
      <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 14, color: p.ink }}><Money value={s.bal} /></span>
      <button
        onClick={onDetail}
        style={{ display: 'flex', alignItems: 'center', gap: 5, background: p.surfaceAlt, color: p.ink, border: '1px solid ' + p.line, borderRadius: 8, padding: '6px 11px', fontFamily: DISP, fontWeight: 600, fontSize: 12.5, cursor: 'pointer', whiteSpace: 'nowrap' }}
      >
        <Icon name="user" size={14} color={p.ink} />
        Détails
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────
export function Students({ p }: { p: Palette }) {
  const [q, setQ] = useState('');
  const [niveauFilter, setNiveauFilter] = useState('');
  const [classeFilter, setClasseFilter] = useState('');
  const { data, loading, refetch } = useStudents();
  const list = data.filter(s => (s.name + s.id).toLowerCase().includes(q.toLowerCase()));

  // Available niveaux / classes (computed from all students, not the search-filtered list)
  const allGroups = groupStudents(data);
  const classesForNiveau = niveauFilter ? (allGroups.find(g => g.niveau === niveauFilter)?.classes.map(c => c.classe) ?? []) : [];

  const filteredList = list.filter(s => {
    const { niveau, classe } = parseClass(s.cls);
    if (niveauFilter && niveau !== niveauFilter) return false;
    if (classeFilter && classe !== classeFilter) return false;
    return true;
  });

  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState<{ name: string; number: string; email: string } | null>(null);
  const [detail, setDetail] = useState<StudentRecord | null>(null);

  // Auto-generated student number (set when modal opens)
  const [generatedNumber, setGeneratedNumber] = useState('');
  const [generatingNumber, setGeneratingNumber] = useState(false);

  const blank = { full_name: '', first_name: '', promo: '', class: '', email: '', phone: '', balance: '0' };
  const [form, setForm] = useState(blank);
  const set = (k: keyof typeof blank) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  async function openModal() {
    setErr('');
    setForm(blank);
    setGeneratedNumber('');
    setModal(true);
    setGeneratingNumber(true);
    try {
      const num = await generateStudentNumber();
      setGeneratedNumber(num);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setGeneratingNumber(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!generatedNumber) { setErr('Numéro étudiant non généré. Fermez et réessayez.'); return; }
    setErr('');
    setSaving(true);

    const email = form.email.trim();

    // 1. Create Supabase Auth account for the student (separate non-persistent client)
    if (email) {
      const { error: authErr } = await supabaseAuth.auth.signUp({
        email,
        password: 'passer123', // default password
        options: {
          data: {
            must_change_password: true,
            role: 'student',
            student_number: generatedNumber,
          },
        },
      });
      // Don't block on auth error — maybe email already exists, etc.
      if (authErr && !authErr.message.includes('already registered')) {
        setErr(`Auth: ${authErr.message}`);
        setSaving(false);
        return;
      }
    }

    // 2. Insert student record
    const { data: student, error: sErr } = await supabase
      .from('students')
      .insert({
        full_name: form.full_name.trim(),
        first_name: form.first_name.trim() || form.full_name.split(' ')[0],
        student_number: generatedNumber,
        promo: form.promo.trim() || null,
        class: form.class.trim() || null,
        email: email || null,
        phone: form.phone.trim() || null,
        must_change_password: true,
      })
      .select()
      .single();

    if (sErr) { setErr(sErr.message); setSaving(false); return; }

    // 3. Create NFC card
    const cardNum = 'SC-' + Date.now().toString().slice(-8);
    const { error: cErr } = await supabase.from('cards').insert({
      student_id: student.id,
      card_number: cardNum,
      status: 'active',
      balance: parseInt(form.balance) || 0,
    });

    if (cErr) { setErr(cErr.message); setSaving(false); return; }

    setSaving(false);
    setModal(false);
    setSuccess({ name: form.full_name.trim(), number: generatedNumber, email });
    refetch();
  }

  return (
    <>
      <Panel p={p} title="Étudiants & cartes" action={
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: p.surfaceAlt, borderRadius: 999, padding: '7px 13px', width: 210 }}>
            <Icon name="search" size={16} color={p.muted} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher…" style={{ border: 'none', background: 'none', outline: 'none', fontFamily: BODY, fontSize: 13.5, color: p.ink, width: '100%' }} />
          </div>
          <select
            value={niveauFilter}
            onChange={e => { setNiveauFilter(e.target.value); setClasseFilter(''); }}
            style={{ background: p.surfaceAlt, color: p.ink, border: '1px solid ' + p.line, borderRadius: 10, padding: '9px 12px', fontFamily: DISP, fontWeight: 600, fontSize: 13, cursor: 'pointer', outline: 'none' }}
          >
            <option value="">Tous niveaux</option>
            {allGroups.map(g => <option key={g.niveau} value={g.niveau}>{g.niveau}</option>)}
          </select>
          {niveauFilter && (
            <select
              value={classeFilter}
              onChange={e => setClasseFilter(e.target.value)}
              style={{ background: p.surfaceAlt, color: p.ink, border: '1px solid ' + p.line, borderRadius: 10, padding: '9px 12px', fontFamily: DISP, fontWeight: 600, fontSize: 13, cursor: 'pointer', outline: 'none' }}
            >
              <option value="">Toutes classes</option>
              {classesForNiveau.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
          <button
            onClick={openModal}
            style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#2B2A26', color: '#EDE7DB', border: 'none', borderRadius: 10, padding: '9px 15px', fontFamily: DISP, fontWeight: 700, fontSize: 13.5, cursor: 'pointer' }}
          >
            <Icon name="plus" size={16} color="#EDE7DB" />
            Nouvel étudiant
          </button>
        </div>
      }>
        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: p.muted, fontFamily: DISP, fontWeight: 600 }}>Chargement…</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) 110px', alignItems: 'center', padding: '0 8px 10px', fontSize: 12, color: p.muted, fontWeight: 700, letterSpacing: '.03em', textTransform: 'uppercase', borderBottom: '1px solid ' + p.line }}>
              <span>Étudiant</span><span>Classe</span><span>Carte</span><span>Solde</span><span />
            </div>
            {filteredList.length === 0 && (
              <div style={{ padding: '40px 0', textAlign: 'center', color: p.muted, fontSize: 14 }}>
                {q || niveauFilter || classeFilter ? 'Aucun résultat' : 'Aucun étudiant — cliquez sur "Nouvel étudiant" pour commencer'}
              </div>
            )}
            {filteredList.map((s, i) => (
              <StudentRow key={s.id} s={s} p={p} last={i === filteredList.length - 1} onDetail={() => setDetail(s)} />
            ))}
          </>
        )}
      </Panel>

      {/* ── Creation modal ── */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={() => setModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(27,24,19,.45)', backdropFilter: 'blur(3px)' }} />
          <div style={{ position: 'relative', width: 540, background: '#FBF9F5', borderRadius: 20, boxShadow: '0 24px 60px rgba(27,24,19,.22)', padding: 30, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <h2 style={{ margin: 0, fontFamily: DISP, fontWeight: 700, fontSize: 20, color: '#2B2A26' }}>Nouvel étudiant</h2>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#837E74', padding: 4 }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>

            {/* Auto-generated student number badge */}
            <div style={{ background: '#F0EBE3', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#837E74', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>N° étudiant (auto-généré)</div>
                {generatingNumber
                  ? <div style={{ fontFamily: 'monospace', fontSize: 16, color: '#B0A99E' }}>Génération…</div>
                  : <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 18, color: '#2B2A26', letterSpacing: '.06em' }}>{generatedNumber}</div>
                }
              </div>
              <button
                type="button"
                onClick={async () => {
                  setGeneratingNumber(true);
                  try { setGeneratedNumber(await generateStudentNumber()); }
                  catch (e) { setErr(e instanceof Error ? e.message : String(e)); }
                  finally { setGeneratingNumber(false); }
                }}
                disabled={generatingNumber}
                title="Régénérer"
                style={{ background: 'none', border: '1px solid rgba(43,42,38,.14)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: '#837E74' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8a6 6 0 1 1 1.5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M2 12V8h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Identité */}
              <div style={{ background: '#F4F1EC', borderRadius: 14, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 12, color: '#837E74', letterSpacing: '.08em', textTransform: 'uppercase' }}>Identité</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="Prénom">
                    <Input value={form.first_name} onChange={set('first_name')} placeholder="Awa" />
                  </Field>
                  <Field label="Nom complet *">
                    <Input value={form.full_name} onChange={set('full_name')} placeholder="Awa Ndiaye" required />
                  </Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="Email">
                    <Input value={form.email} onChange={set('email')} placeholder="awa@campus.sn" type="email" />
                  </Field>
                  <Field label="Téléphone">
                    <Input value={form.phone} onChange={set('phone')} placeholder="+221 77 000 00 00" />
                  </Field>
                </div>
                {form.email && (
                  <div style={{ fontSize: 12, color: '#5C7A6E', background: '#EBF5F1', borderRadius: 8, padding: '8px 12px' }}>
                    Un compte de connexion sera créé pour cet email.<br/>
                    <strong>Mot de passe initial :</strong> <code style={{ fontFamily: 'monospace' }}>passer123</code>
                  </div>
                )}
              </div>

              {/* Scolarité */}
              <div style={{ background: '#F4F1EC', borderRadius: 14, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 12, color: '#837E74', letterSpacing: '.08em', textTransform: 'uppercase' }}>Scolarité</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Field label="Promo">
                    <Input value={form.promo} onChange={set('promo')} placeholder="2026" />
                  </Field>
                  <Field label="Classe">
                    <Input value={form.class} onChange={set('class')} placeholder="Master 1" />
                  </Field>
                </div>
              </div>

              {/* Carte */}
              <div style={{ background: '#F4F1EC', borderRadius: 14, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 12, color: '#837E74', letterSpacing: '.08em', textTransform: 'uppercase' }}>Carte NFC</div>
                <Field label="Solde initial (FCFA)">
                  <Input value={form.balance} disabled />
                </Field>
                <div style={{ fontSize: 12.5, color: '#837E74' }}>Le numéro de carte sera généré automatiquement.</div>
              </div>

              {err && (
                <div style={{ background: '#FDF0EE', color: '#C0392B', padding: '11px 14px', borderRadius: 10, fontSize: 13.5, fontWeight: 600 }}>{err}</div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setModal(false)} style={{ flex: 1, padding: '13px 0', borderRadius: 12, border: '1px solid rgba(43,42,38,.14)', background: 'transparent', fontFamily: DISP, fontWeight: 600, fontSize: 14.5, color: '#2B2A26', cursor: 'pointer' }}>
                  Annuler
                </button>
                <button type="submit" disabled={saving || !form.full_name || generatingNumber} style={{ flex: 2, padding: '13px 0', borderRadius: 12, border: 'none', background: saving || !form.full_name || generatingNumber ? '#B0A99E' : '#2B2A26', color: '#EDE7DB', fontFamily: DISP, fontWeight: 700, fontSize: 14.5, cursor: saving ? 'wait' : 'pointer' }}>
                  {saving ? 'Création…' : 'Créer l\'étudiant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Detail modal ── */}
      {detail && (
        <StudentDetailModal student={detail} p={p} onClose={() => setDetail(null)} />
      )}

      {/* ── Success modal ── */}
      {success && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={() => setSuccess(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(27,24,19,.45)', backdropFilter: 'blur(3px)' }} />
          <div style={{ position: 'relative', width: 480, background: '#FBF9F5', borderRadius: 20, boxShadow: '0 24px 60px rgba(27,24,19,.22)', padding: 30 }}>
            <SuccessCard
              studentName={success.name}
              studentNumber={success.number}
              email={success.email}
              onClose={() => setSuccess(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}
