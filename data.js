// Mock data shaped like the CIM project (4H timeframe, 0-10 scoring)
// Consumed by all three design directions.

const MARKET_PULSE = {
  volume24h: 187.4, // billions USD
  fearGreed: { value: 64, label: 'Greed' },
  smartMoney: { bias: 'long', ratio: 1.42 },
  socialHype: { bias: 'buy', pct: 58 },
  btcDominance: 52.1,
  timestamp: 'Updated 2m ago',
  nextRefreshSec: 1140,
};

// Regime is the headline signal for Direction A's "what to do now".
const REGIME = {
  label: 'EXPANSION',       // RANGING | TRENDING_UP | TRENDING_DOWN | SQUEEZE | EXPANSION | MIXED
  confidence: 78,           // 0-100
  direction: 'bullish',     // bullish | bearish | neutral
  headline: 'Breakout in progress',
  sub: 'BTC + majors broke DC20; flow turned buy-dominant 4h ago. Grid bots off, trend setups on.',
  since: '4h 12m',
};

const ASSETS = [
  {
    sym: 'BTC', name: 'Bitcoin',    price: 87_420.50, change24h: +2.81,
    score: 8.7, bias: 'bullish', setup: 'Macro bull + sweep',
    regime: 'TRENDING_UP', gridFit: 'AVOID',
    rsi: 62, flow: +7.2, oi: +4.1, cvd: 'ACC', structure: 'Bullish',
    avwap: { d5: 'above', d14: 'above', d30: 'above' },
    poc: { d5: 86_900, d14: 85_120, confluence: true },
    fvg: { near: true, confirmed: true, side: 'bull' },
    ema: 'BULL', atr: 1.92,
    sparkline: [74,76,73,78,82,79,84,86,83,88,91,87,92,95,93,97,100],
  },
  {
    sym: 'ETH', name: 'Ethereum',   price: 3_184.22,  change24h: +1.94,
    score: 7.9, bias: 'bullish', setup: 'EMA pullback long',
    regime: 'TRENDING_UP', gridFit: 'CAUTION',
    rsi: 58, flow: +5.4, oi: +2.8, cvd: 'ACC', structure: 'Bullish',
    avwap: { d5: 'above', d14: 'above', d30: 'above' },
    poc: { d5: 3150, d14: 3080, confluence: false },
    fvg: { near: true, confirmed: false, side: 'bull' },
    ema: 'BULL/PULLBACK', atr: 82.4,
    sparkline: [62,65,63,68,71,69,73,76,72,77,80,76,82,85,83,88,92],
  },
  {
    sym: 'SOL', name: 'Solana',     price: 184.73,    change24h: -0.62,
    score: 7.2, bias: 'neutral', setup: 'POC confluence hold',
    regime: 'RANGING', gridFit: 'RECOMMENDED',
    rsi: 51, flow: +1.1, oi: -0.3, cvd: 'LAT', structure: 'Range',
    avwap: { d5: 'above', d14: 'below', d30: 'above' },
    poc: { d5: 185, d14: 184, confluence: true },
    fvg: { near: false, confirmed: false, side: null },
    ema: 'BULL', atr: 6.1,
    sparkline: [50,52,54,51,53,56,54,52,55,57,54,56,53,55,57,54,56],
  },
  {
    sym: 'BNB', name: 'BNB',        price: 612.88,    change24h: +0.34,
    score: 6.4, bias: 'neutral', setup: 'Lateral / watch',
    regime: 'RANGING', gridFit: 'RECOMMENDED',
    rsi: 54, flow: +0.8, oi: +0.2, cvd: 'LAT', structure: 'Range',
    avwap: { d5: 'above', d14: 'above', d30: 'below' },
    poc: { d5: 610, d14: 608, confluence: true },
    fvg: { near: false, confirmed: false, side: null },
    ema: 'BULL', atr: 9.8,
    sparkline: [70,71,69,72,70,71,73,71,72,70,71,72,70,71,72,73,72],
  },
  {
    sym: 'XRP', name: 'XRP',        price: 2.412,     change24h: -2.14,
    score: 4.8, bias: 'bearish', setup: 'Distribution',
    regime: 'TRENDING_DOWN', gridFit: 'AVOID',
    rsi: 38, flow: -4.6, oi: +1.9, cvd: 'DIS', structure: 'Bearish',
    avwap: { d5: 'below', d14: 'below', d30: 'below' },
    poc: { d5: 2.48, d14: 2.55, confluence: false },
    fvg: { near: true, confirmed: true, side: 'bear' },
    ema: 'BEAR', atr: 0.082,
    sparkline: [90,88,85,82,84,80,76,78,72,70,68,66,64,62,60,58,55],
  },
  {
    sym: 'DOGE', name: 'Dogecoin',  price: 0.3822,    change24h: +4.22,
    score: 5.9, bias: 'bullish', setup: 'Momentum / risky',
    regime: 'EXPANSION', gridFit: 'AVOID',
    rsi: 71, flow: +8.8, oi: +9.4, cvd: 'ACC', structure: 'Bullish',
    avwap: { d5: 'above', d14: 'above', d30: 'below' },
    poc: { d5: 0.36, d14: 0.35, confluence: false },
    fvg: { near: false, confirmed: false, side: null },
    ema: 'BULL', atr: 0.018,
    sparkline: [40,38,42,45,48,52,58,62,68,72,78,82,79,85,88,86,92],
  },
  {
    sym: 'AVAX', name: 'Avalanche', price: 38.14,     change24h: +0.88,
    score: 5.2, bias: 'neutral', setup: 'No clear signal',
    regime: 'MIXED', gridFit: 'CAUTION',
    rsi: 49, flow: +0.2, oi: -1.1, cvd: 'LAT', structure: 'Range',
    avwap: { d5: 'above', d14: 'below', d30: 'below' },
    poc: { d5: 37.8, d14: 39.2, confluence: false },
    fvg: { near: false, confirmed: false, side: null },
    ema: 'NEUTRAL', atr: 1.42,
    sparkline: [60,58,62,61,59,63,65,62,60,64,63,65,62,64,63,65,64],
  },
  {
    sym: 'LINK', name: 'Chainlink', price: 18.92,     change24h: +3.11,
    score: 7.5, bias: 'bullish', setup: 'Breakout retest',
    regime: 'TRENDING_UP', gridFit: 'CAUTION',
    rsi: 61, flow: +6.1, oi: +3.2, cvd: 'ACC', structure: 'Bullish',
    avwap: { d5: 'above', d14: 'above', d30: 'above' },
    poc: { d5: 18.4, d14: 17.9, confluence: true },
    fvg: { near: true, confirmed: true, side: 'bull' },
    ema: 'BULL', atr: 0.62,
    sparkline: [55,58,56,62,65,63,68,71,68,74,78,75,82,85,82,88,91],
  },
];

// Grid bot recommendations — score ≥ 7.5 or RANGING regime qualify
const GRID_CANDIDATES = ASSETS
  .filter(a => a.gridFit === 'RECOMMENDED')
  .map(a => ({
    sym: a.sym, name: a.name, price: a.price,
    lower: a.price * 0.96, upper: a.price * 1.04,
    grids: 24, capital: 500,
    netPerGridPct: 0.82, expectedDailyPct: 1.4,
    atrMult: 2.5, mode: 'Arithmetic',
    score: a.score,
  }));

const INDICATOR_GLOSSARY = [
  ['RSI (14)', 'Momentum on 4H. >70 overbought, <30 oversold.'],
  ['ATR (14)', '4H Average True Range. SL = 1.5–2× ATR.'],
  ['Flow% 24h', 'Buy vs sell pressure on 1H ×24. ±5% = strong.'],
  ['POC 5d/14d', 'Max-volume price zone. Confluence = strong S/R.'],
  ['AVWAP', 'Volume-weighted avg price across 5/14/30 days.'],
  ['CVD', 'Cumulative Volume Delta. ACC/DIS/LAT labels.'],
  ['EMA 50/200', 'Standard trend filter (golden/death cross).'],
  ['FVG', 'Fair Value Gap — institutional imbalance. ★ = confirmed.'],
  ['Donchian 20/55', 'Range regime marker. Breakout = trend start.'],
  ['Regime', 'Composite: ADX + BB + DC20.'],
];

window.CIM_DATA = {
  MARKET_PULSE, REGIME, ASSETS, GRID_CANDIDATES, INDICATOR_GLOSSARY,
};
