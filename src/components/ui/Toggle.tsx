import React from 'react';
import type { Palette } from '../../theme/palette';

interface ToggleProps {
  on: boolean;
  onToggle: () => void;
  p: Palette;
}

export function Toggle({ on, onToggle, p }: ToggleProps) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 46, height: 28, borderRadius: 999, border: 'none', cursor: 'pointer',
        background: on ? p.ok : p.line, position: 'relative', transition: '.2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: on ? 21 : 3,
        width: 22, height: 22, borderRadius: '50%',
        background: '#fff', transition: '.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,.3)',
      }} />
    </button>
  );
}
