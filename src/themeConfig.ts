export interface ThemeStyleConfig {
  id: string;
  name: string;
  primaryBg: string;
  cardBg: string;
  accentColor: string;
  accentGlow: string;
  secondaryAccent: string;
  textColor: string;
  borderColor: string;
  fontClass: string;
  patternType: 'grid' | 'dots' | 'scanlines' | 'radial' | 'comic';
}

export const THEME_PRESETS: Record<string, ThemeStyleConfig> = {
  'Cyberpunk Pixel Art': {
    id: 'cyberpunk',
    name: 'Cyberpunk Pixel',
    primaryBg: '#08090c',
    cardBg: '#101218',
    accentColor: '#00f5ff',
    accentGlow: 'rgba(0, 245, 255, 0.25)',
    secondaryAccent: '#ccff00',
    textColor: '#e0e0e0',
    borderColor: '#1e2430',
    fontClass: 'font-mono',
    patternType: 'scanlines',
  },
  'Vaporwave Low-Poly': {
    id: 'vaporwave',
    name: 'Vaporwave Twilight',
    primaryBg: '#0f051d',
    cardBg: '#190a32',
    accentColor: '#ff007f',
    accentGlow: 'rgba(255, 0, 127, 0.3)',
    secondaryAccent: '#00f5ff',
    textColor: '#f1e8ff',
    borderColor: '#381666',
    fontClass: 'font-sans',
    patternType: 'grid',
  },
  '3D Volumetric Clay': {
    id: 'clay',
    name: '3D Clay Volumetric',
    primaryBg: '#0f141c',
    cardBg: '#18212e',
    accentColor: '#38bdf8',
    accentGlow: 'rgba(56, 189, 248, 0.25)',
    secondaryAccent: '#f59e0b',
    textColor: '#f8fafc',
    borderColor: '#2d3b4e',
    fontClass: 'font-sans',
    patternType: 'dots',
  },
  '90s Retro Anime': {
    id: 'anime',
    name: '90s Retro Anime',
    primaryBg: '#0b0c10',
    cardBg: '#1f2833',
    accentColor: '#66fcf1',
    accentGlow: 'rgba(102, 252, 241, 0.3)',
    secondaryAccent: '#ff0055',
    textColor: '#ffffff',
    borderColor: '#45a29e',
    fontClass: 'font-sans',
    patternType: 'radial',
  },
  'Vintage Comic Book Pop-Art': {
    id: 'comic',
    name: 'Vintage Pop-Art',
    primaryBg: '#121214',
    cardBg: '#1c1c22',
    accentColor: '#ffdd00',
    accentGlow: 'rgba(255, 221, 0, 0.3)',
    secondaryAccent: '#ff3366',
    textColor: '#ffffff',
    borderColor: '#ffdd00',
    fontClass: 'font-mono',
    patternType: 'comic',
  },
  'Hand-drawn Crayon Satire': {
    id: 'crayon',
    name: 'Crayon Degen',
    primaryBg: '#0e1117',
    cardBg: '#161b22',
    accentColor: '#ccff00',
    accentGlow: 'rgba(204, 255, 0, 0.25)',
    secondaryAccent: '#39ff14',
    textColor: '#e6edf3',
    borderColor: '#30363d',
    fontClass: 'font-mono',
    patternType: 'grid',
  },
  'Vector Sticker': {
    id: 'vector',
    name: 'Vector Sticker',
    primaryBg: '#0a0b0d',
    cardBg: '#12141a',
    accentColor: '#ccff00',
    accentGlow: 'rgba(204, 255, 0, 0.25)',
    secondaryAccent: '#00f5ff',
    textColor: '#e0e0e0',
    borderColor: '#2d3139',
    fontClass: 'font-mono',
    patternType: 'grid',
  },
};

export function getThemeByStyleName(styleName?: string): ThemeStyleConfig {
  if (!styleName) return THEME_PRESETS['Vector Sticker'];
  return THEME_PRESETS[styleName] || THEME_PRESETS['Vector Sticker'];
}
