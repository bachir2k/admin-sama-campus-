export type Variant = 'light' | 'dark';

export interface Palette {
  name: string;
  appBg: string;
  appBg2: string;
  surface: string;
  surfaceAlt: string;
  line: string;
  line2: string;
  ink: string;
  ink2: string;
  muted: string;
  brown: string;
  brownD: string;
  olive: string;
  oliveD: string;
  gold: string;
  goldSoft: string;
  blue: string;
  blueSoft: string;
  danger: string;
  dangerSoft: string;
  ok: string;
  okSoft: string;
  cardGrad: string;
  cardInk: string;
  tabBg: string;
  nav: string;
}

export const SC_PALETTES: Record<Variant, Palette> = {
  light: {
    name: 'Crème',
    appBg: '#ECE8E0',
    appBg2: '#F4F1EB',
    surface: '#FBF9F5',
    surfaceAlt: '#F1EDE4',
    line: 'rgba(43,42,38,0.12)',
    line2: 'rgba(43,42,38,0.06)',
    ink: '#2B2A26',
    ink2: '#54514A',
    muted: '#837E74',
    brown: '#8B6B4A',
    brownD: '#6E5436',
    olive: '#7C8458',
    oliveD: '#626A44',
    gold: '#C99B5B',
    goldSoft: '#E7CF9E',
    blue: '#5E84A8',
    blueSoft: '#BFD4E8',
    danger: '#B4533B',
    dangerSoft: '#F0D9CF',
    ok: '#5E7B49',
    okSoft: '#DDE6CF',
    cardGrad: 'radial-gradient(130% 130% at 12% 8%, #9a7850 0%, #7d5f3f 46%, #5f4730 100%)',
    cardInk: '#F5ECDD',
    tabBg: 'rgba(251,249,245,0.92)',
    nav: '#2B2A26',
  },
  dark: {
    name: 'Nuit',
    appBg: '#1C1A16',
    appBg2: '#232019',
    surface: '#2A2620',
    surfaceAlt: '#322D25',
    line: 'rgba(245,236,221,0.12)',
    line2: 'rgba(245,236,221,0.06)',
    ink: '#F3EEE3',
    ink2: 'rgba(243,238,227,0.74)',
    muted: 'rgba(243,238,227,0.5)',
    brown: '#B98C57',
    brownD: '#9A7244',
    olive: '#9AA36C',
    oliveD: '#7E8857',
    gold: '#E2BD7C',
    goldSoft: '#3a3322',
    blue: '#8FB4D6',
    blueSoft: '#27313a',
    danger: '#E08766',
    dangerSoft: '#3a2620',
    ok: '#9DBE79',
    okSoft: '#28311d',
    cardGrad: 'radial-gradient(130% 130% at 12% 8%, #b08a57 0%, #8a6a44 44%, #4f3d28 100%)',
    cardInk: '#FBF3E4',
    tabBg: 'rgba(34,31,25,0.92)',
    nav: '#16140F',
  },
};

export function scPalette(variant: Variant): Palette {
  return SC_PALETTES[variant];
}

export const DISP = '"Quicksand", system-ui, sans-serif';
export const BODY = '"Mulish", system-ui, sans-serif';
