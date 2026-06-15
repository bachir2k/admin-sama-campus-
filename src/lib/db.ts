import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import type { StudentRecord, Alert, FeedItem, Zone } from '../data/mockData'

interface StudentRow {
  id: string
  full_name: string
  first_name: string
  student_number: string
  class: string | null
  promo: string | null
  email: string | null
  phone: string | null
  must_change_password: boolean
  cards: {
    card_number: string
    status: string
    balance: number
  } | {
    card_number: string
    status: string
    balance: number
  }[] | null
}

interface TransactionRow {
  service: string
  description: string | null
  amount: number
  created_at: string
  status: string
}

interface FeedTransactionRow extends TransactionRow {
  students: { full_name: string } | null
}

interface FraudAlertRow {
  severity: Alert['sev']
  type: string
  location: string | null
  detected_at: string
  note: string | null
  students: { full_name: string; student_number: string } | null
}

interface ZoneRow {
  name: string
  current_occupancy: number
  capacity: number
}

// ── Format relative time ──────────────────────────────────
function relTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "à l'instant"
  if (mins < 60) return `il y a ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `il y a ${hrs} h`
  return `il y a ${Math.floor(hrs / 24)} j`
}

const ICON_MAP: Record<string, string> = {
  Cafétéria: 'fork', Transport: 'bus', Bibliothèque: 'book',
  Rechargement: 'plus', Accès: 'home', Parking: 'home',
}
const TINT_MAP: Record<string, string> = {
  Cafétéria: 'brown', Transport: 'olive', Bibliothèque: 'blue',
  Rechargement: 'ok', Accès: 'olive', Parking: 'olive',
}
const STATUS_MAP: Record<string, string> = {
  active: 'Active', blocked: 'Bloquée', pending: 'En attente',
  lost: 'Bloquée', expired: 'Bloquée',
}

// ── Students ──────────────────────────────────────────────
export function useStudents() {
  const [data, setData] = useState<StudentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    supabase
      .from('students')
      .select('*, cards(card_number, status, balance)')
      .order('full_name')
      .then(({ data: rows }) => {
        if (rows) {
          setData(rows.map((s: StudentRow) => {
            const card = Array.isArray(s.cards) ? s.cards[0] : s.cards
            return {
              name: s.full_name,
              id: s.student_number,
              dbId: s.id,
              firstName: s.first_name,
              cls: s.class || s.promo || '—',
              promo: s.promo ?? undefined,
              class: s.class ?? undefined,
              email: s.email ?? undefined,
              phone: s.phone ?? undefined,
              cardNumber: card?.card_number,
              mustChangePassword: s.must_change_password,
              status: (STATUS_MAP[card?.status ?? ''] || 'En attente') as StudentRecord['status'],
              bal: card?.balance ?? 0,
            }
          }))
        }
        setLoading(false)
      })
  }, [tick])

  return { data, loading, refetch: () => { setLoading(true); setTick(t => t + 1) } }
}

// ── Student transactions ──────────────────────────────────
export function useStudentTransactions(studentDbId: string | null, limit = 5) {
  const [data, setData] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!studentDbId) return
    const fetch = async () => {
      setLoading(true)
      supabase
        .from('transactions')
        .select('*')
        .eq('student_id', studentDbId)
        .order('created_at', { ascending: false })
        .limit(limit)
        .then(({ data: rows }) => {
          if (rows) {
            setData(rows.map((t: TransactionRow) => ({
              svc: t.service,
              icon: ICON_MAP[t.service] || 'card',
              label: t.description || t.service,
              who: '',
              amount: t.amount,
              when: new Date(t.created_at).toLocaleString('fr-FR', {
                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
              }),
              tint: TINT_MAP[t.service] || 'brown',
              bad: t.status === 'refused',
            })))
          }
          setLoading(false)
        })
    }

    fetch();
  }, [studentDbId, limit])

  return { data: studentDbId ? data : [], loading }
}

// ── Fraud alerts ──────────────────────────────────────────
export function useAlerts() {
  const [data, setData] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('fraud_alerts')
      .select('*, students(full_name, student_number)')
      .eq('status', 'active')
      .order('detected_at', { ascending: false })
      .then(({ data: rows }) => {
        if (rows) {
          setData(rows.map((a: FraudAlertRow) => ({
            sev: a.severity,
            type: a.type,
            who: a.students?.full_name || '—',
            id: a.students?.student_number || '—',
            loc: a.location || '—',
            when: relTime(a.detected_at),
            note: a.note || '',
          })))
        }
        setLoading(false)
      })
  }, [])

  return { data, loading }
}

// ── Transaction feed ──────────────────────────────────────
export function useFeed(limit = 20) {
  const [data, setData] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('transactions')
      .select('*, students(full_name)')
      .order('created_at', { ascending: false })
      .limit(limit)
      .then(({ data: rows }) => {
        if (rows) {
          setData(rows.map((t: FeedTransactionRow) => {
            const parts = (t.students?.full_name || '—').split(' ')
            const who = parts.length > 1
              ? parts[0][0] + '. ' + parts.slice(1).join(' ')
              : parts[0]
            return {
              svc: t.service,
              icon: ICON_MAP[t.service] || 'card',
              label: t.description || t.service,
              who,
              amount: t.amount,
              when: new Date(t.created_at).toLocaleTimeString('fr-FR', {
                hour: '2-digit', minute: '2-digit', second: '2-digit',
              }),
              tint: TINT_MAP[t.service] || 'brown',
              bad: t.status === 'refused',
            }
          }))
        }
        setLoading(false)
      })
  }, [limit])

  return { data, loading }
}

// ── Zones ─────────────────────────────────────────────────
export function useZones() {
  const [data, setData] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('zones')
      .select('*')
      .eq('is_active', true)
      .order('name')
      .then(({ data: rows }) => {
        if (rows) {
          setData(rows.map((z: ZoneRow) => ({
            name: z.name,
            now: z.current_occupancy,
            cap: z.capacity,
          })))
        }
        setLoading(false)
      })
  }, [])

  return { data, loading }
}

// ── Overview stats ────────────────────────────────────────
export function useOverviewStats() {
  const [stats, setStats] = useState({ txnCount: 0, volume: 0, attendance: 0, alerts: 0 })

  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString()

    Promise.all([
      supabase.from('transactions').select('amount', { count: 'exact' }).gte('created_at', todayISO),
      supabase.from('attendance').select('id', { count: 'exact' }).gte('recorded_at', todayISO).eq('status', 'present'),
      supabase.from('fraud_alerts').select('id', { count: 'exact' }).eq('status', 'active'),
    ]).then(([txRes, attRes, fraudRes]) => {
      const txns = txRes.data || []
      const volume = txns.reduce((sum: number, t: { amount: number }) => sum + Math.abs(t.amount), 0)
      setStats({
        txnCount: txRes.count || 0,
        volume,
        attendance: attRes.count || 0,
        alerts: fraudRes.count || 0,
      })
    })
  }, [])

  return stats
}
