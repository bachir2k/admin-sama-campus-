import React from 'react';
import { DISP, BODY } from './theme/palette';
import { AdminDashboard } from './components/admin/AdminDashboard';

const B = {
  bg: '#E7E3DB', panel: '#FBF9F5', ink: '#2B2A26',
  muted: '#837E74', line: 'rgba(43,42,38,0.12)', brown: '#8B6B4A',
};

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: B.bg, fontFamily: BODY }}>
      <header style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid ' + B.line, background: B.panel }}>
        <span style={{ width: 32, height: 32, borderRadius: 8, background: B.ink, display: 'grid', placeItems: 'center' }}>
          <span style={{ width: 14, height: 9, borderRadius: 2, background: 'linear-gradient(135deg,#D7B477,#8B6B4A)' }} />
        </span>
        <span style={{ fontFamily: DISP, fontWeight: 700, fontSize: 18, color: B.ink }}>
          Sama<span style={{ color: B.brown }}>Campus</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: B.muted, marginLeft: 10 }}>Administration</span>
        </span>
      </header>
      <main style={{ height: 'calc(100vh - 73px)' }}>
        <AdminDashboard />
      </main>
    </div>
  );
}
