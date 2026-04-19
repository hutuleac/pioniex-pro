// Shared UI primitives, icons, and tokens used by all three directions.
// Globals: all components, TOKENS, Spark, Score, TagPill, RegimeDot, Icon

const TOKENS = {
  // Themes: dark (default) and light
  themes: {
    dark: {
      bg:         '#0A0B0E',
      bg2:        '#111318',
      surface:    '#15181F',
      surface2:   '#1B1F28',
      surface3:   '#232833',
      border:     'rgba(255,255,255,0.07)',
      border2:    'rgba(255,255,255,0.12)',
      text:       '#F3F5F8',
      text2:      '#A7ADBB',
      text3:      '#6B7280',
      bull:       '#22C38E',   // green, accessible
      bear:       '#F05260',
      warn:       '#F2B740',
      neutral:    '#6B7280',
      accent:     '#7C8CFF',   // calm indigo (not cyan overload)
      accentSoft: 'rgba(124,140,255,0.14)',
      bullSoft:   'rgba(34,195,142,0.14)',
      bearSoft:   'rgba(240,82,96,0.14)',
      warnSoft:   'rgba(242,183,64,0.16)',
      neutralSoft:'rgba(107,114,128,0.16)',
      glass:      'rgba(21,24,31,0.72)',
    },
    light: {
      bg:         '#F7F8FA',
      bg2:        '#FFFFFF',
      surface:    '#FFFFFF',
      surface2:   '#F1F3F7',
      surface3:   '#E8ECF3',
      border:     'rgba(15,18,26,0.08)',
      border2:    'rgba(15,18,26,0.14)',
      text:       '#0F121A',
      text2:      '#4B5365',
      text3:      '#8B93A6',
      bull:       '#0EA968',
      bear:       '#DA2B40',
      warn:       '#C98A0A',
      neutral:    '#6B7280',
      accent:     '#3D53E0',
      accentSoft: 'rgba(61,83,224,0.10)',
      bullSoft:   'rgba(14,169,104,0.10)',
      bearSoft:   'rgba(218,43,64,0.10)',
      warnSoft:   'rgba(201,138,10,0.12)',
      neutralSoft:'rgba(107,114,128,0.12)',
      glass:      'rgba(255,255,255,0.78)',
    },
  },
  font: {
    display: '"Inter Tight", "Inter", -apple-system, system-ui, sans-serif',
    sans:    '"Inter", -apple-system, system-ui, sans-serif',
    mono:    '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 22, pill: 9999 },
};

const useTheme = (mode) => TOKENS.themes[mode] || TOKENS.themes.dark;

// ─── Score bar (segmented 10-tick) ────────────────────────────
function Score({ value = 0, theme, size = 'md', style = {} }) {
  const n = 10;
  const filled = Math.max(0, Math.min(n, Math.round(value)));
  const color = value >= 7.5 ? theme.bull : value >= 6 ? theme.warn : theme.bear;
  const H = size === 'sm' ? 4 : size === 'lg' ? 8 : 6;
  return (
    <div style={{ display: 'flex', gap: 2, ...style }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: H, borderRadius: 2,
          background: i < filled ? color : theme.surface3,
          opacity: i < filled ? 1 : 0.6,
          transition: 'background 0.2s',
        }} />
      ))}
    </div>
  );
}

// ─── Score gauge arc ───────────────────────────────────────────
function ScoreArc({ value, theme, size = 120 }) {
  const r = size / 2 - 10;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / 10));
  // 270° arc, starting from bottom-left
  const arc = 0.75;
  const dash = circ * arc;
  const color = value >= 7.5 ? theme.bull : value >= 6 ? theme.warn : theme.bear;
  const rot = 135;
  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={theme.surface3}
              strokeWidth="8" strokeDasharray={`${dash} ${circ}`}
              transform={`rotate(${rot} ${cx} ${cy})`} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color}
              strokeWidth="8" strokeDasharray={`${dash * pct} ${circ}`}
              transform={`rotate(${rot} ${cx} ${cy})`} strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.4s' }} />
    </svg>
  );
}

// ─── Sparkline ────────────────────────────────────────────────
function Spark({ data = [], color, theme, width = 80, height = 28, fill = true }) {
  if (!data.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const pts = data.map((v, i) => [i * stepX, height - ((v - min) / range) * (height - 4) - 2]);
  const path = pts.map(([x, y], i) => (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)).join(' ');
  const fillPath = `${path} L ${width} ${height} L 0 ${height} Z`;
  const c = color || theme.accent;
  const gid = 'g' + Math.random().toString(36).slice(2, 8);
  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      {fill && (
        <>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity="0.25" />
              <stop offset="100%" stopColor={c} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={fillPath} fill={`url(#${gid})`} />
        </>
      )}
      <path d={path} fill="none" stroke={c} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─── Tag pill (Bullish / Bearish / Neutral / Regime) ──────────
function TagPill({ label, tone = 'neutral', theme, size = 'md', mono = false }) {
  const map = {
    bull:     { bg: theme.bullSoft,    fg: theme.bull    },
    bullish:  { bg: theme.bullSoft,    fg: theme.bull    },
    bear:     { bg: theme.bearSoft,    fg: theme.bear    },
    bearish:  { bg: theme.bearSoft,    fg: theme.bear    },
    warn:     { bg: theme.warnSoft,    fg: theme.warn    },
    neutral:  { bg: theme.neutralSoft, fg: theme.text2   },
    accent:   { bg: theme.accentSoft,  fg: theme.accent  },
  };
  const c = map[tone] || map.neutral;
  const pad = size === 'sm' ? '3px 8px' : '5px 10px';
  const fs = size === 'sm' ? 11 : 12;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: pad, borderRadius: 999, background: c.bg, color: c.fg,
      fontSize: fs, fontWeight: 600, letterSpacing: mono ? 0.4 : 0,
      fontFamily: mono ? TOKENS.font.mono : TOKENS.font.sans,
      whiteSpace: 'nowrap',
    }}>{label}</span>
  );
}

// ─── Status dot ───────────────────────────────────────────────
function Dot({ color, size = 6, pulse = false }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size, borderRadius: '50%',
      background: color, boxShadow: pulse ? `0 0 0 0 ${color}` : 'none',
      animation: pulse ? 'cim-pulse 1.6s infinite' : 'none',
    }} />
  );
}

// ─── Small delta arrow ────────────────────────────────────────
function Delta({ value, theme, fs = 13 }) {
  const pos = value >= 0;
  const c = pos ? theme.bull : theme.bear;
  const sign = pos ? '+' : '';
  return (
    <span style={{
      color: c, fontVariantNumeric: 'tabular-nums', fontWeight: 600,
      fontSize: fs, fontFamily: TOKENS.font.sans, whiteSpace: 'nowrap',
    }}>{sign}{value.toFixed(2)}%</span>
  );
}

// ─── Formatted price ──────────────────────────────────────────
function fmtPrice(n) {
  if (n >= 1000) return n.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (n >= 1)    return n.toFixed(2);
  return n.toFixed(4);
}

// ─── Icons ────────────────────────────────────────────────────
const Icon = {
  bolt:     (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  arrowUp:  (c) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 14l5-5 5 5"/></svg>,
  arrowDn:  (c) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10l5 5 5-5"/></svg>,
  chevR:    (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>,
  chevDn:   (c) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>,
  refresh:  (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>,
  settings: (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  grid:     (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  pulse:    (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  book:     (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  home:     (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>,
  search:   (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
  filter:   (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  close:    (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  sun:      (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>,
  moon:     (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
};

// ─── AssetGlyph: colored monogram for asset icon ───────────────
function AssetGlyph({ sym, theme, size = 32 }) {
  const colors = {
    BTC:  ['#F7931A', '#FFB84D'],
    ETH:  ['#627EEA', '#8FA2FF'],
    SOL:  ['#9945FF', '#14F195'],
    BNB:  ['#F3BA2F', '#FFD673'],
    XRP:  ['#00AAE4', '#4BD0FF'],
    DOGE: ['#C2A633', '#E8C947'],
    AVAX: ['#E84142', '#FF6A6A'],
    LINK: ['#2A5ADA', '#5A8EFF'],
  };
  const [a, b] = colors[sym] || [theme.accent, theme.accent];
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2,
      background: `linear-gradient(135deg, ${a}, ${b})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize: size * 0.38,
      fontFamily: TOKENS.font.display, letterSpacing: -0.4,
      boxShadow: `0 2px 10px ${a}33`,
      flexShrink: 0,
    }}>{sym.slice(0, 1)}</div>
  );
}

// ─── Card shell ───────────────────────────────────────────────
function Card({ children, theme, style = {}, onClick, pad = 14 }) {
  return (
    <div onClick={onClick} style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: TOKENS.radius.lg, padding: pad,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.15s, background 0.15s',
      ...style,
    }}>{children}</div>
  );
}

Object.assign(window, {
  TOKENS, useTheme, Score, ScoreArc, Spark, TagPill, Dot, Delta, fmtPrice,
  Icon, AssetGlyph, Card,
});
