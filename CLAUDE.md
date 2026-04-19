# CIM Mobile · Project Guide

## Project Overview

Real-time crypto market intelligence dashboard. Single-file HTML app (React 18 + Babel via CDN) fetching live market data from Binance Futures and Bybit APIs. No build step, no backend, no ES modules — pure HTML + in-browser JSX transpilation. Deployed on Vercel, auto-refreshes every 20 min.

## Running the Project

**Local browser:**
```bash
python -m http.server 8000
# Open http://localhost:8000
```

**Live on Vercel:** https://pioniex-pro.vercel.app

Auto-deploys when you `git push` to `main`.

## Architecture

### Single File Structure: `index.html` (69KB)

| Section | Lines | Responsibility |
|---------|-------|-----------------|
| HTML head, CSS | 1–36 | Meta tags (PWA, viewport), global styles, animations |
| CDN scripts | 41–43 | React, ReactDOM, Babel CDN imports |
| Plain JS block | 48–606 | Config, API calls (Binance/Bybit), indicator functions, data fetch orchestration |
| Babel JSX block | 611–1217 | React components (SwipeableDeck, Card, Grid, DirectionC layout), App root |

### Key Objects & Functions

**CFG** (line 52)
- `REFRESH_INTERVAL_SEC: 1200` (20 min)
- `RSI_PERIOD, ATR_PERIOD, EMA_FAST, EMA_SLOW`
- `KLINES_*` (candle bar counts for different timeframes)

**API Callers** (lines ~100–250)
- `tryFetch(url)` — generic error-safe fetch wrapper
- `Binance` object: `fetchPriceFunding()`, `fetchKlines(sym, tf, limit)`, `fetchOpenInterest(sym)`, `fetchAggTrades(sym)`
- `Bybit` object: parallel API calls (fallback if Binance slow)

**Indicators** (lines ~250–450)
- `calcRSI(closes, period)`, `calcATR(h,l,c,period)`, `calcEMA(prices, period)`
- `calcPOC(bars)`, `calcAVWAP(bars, periods)`, `calcFVG(bars)`, `calcMarketStructure(bars)`
- `calcRegime(bars, assets)` — composite: ADX + Bollinger Bands + Donchian 20

**App Logic**
- `fetchAllData()` (line ~480) — orchestrates all API calls, calculates scores, returns `CIM_DATA` shape
- `calcScore(asset, regime)` (line ~300) — 0–10 based on RSI, momentum, bias, structure alignment
- `App()` component (line ~950) — state: `data`, `loading`, `refreshing`, `error`; auto-refresh on timer

### Data Flow

```
User opens → App() mounts
    ↓
doRefresh(true) fires → fetchAllData()
    ↓
Binance.fetchPriceFunding(symbols) → get latest prices, funding
    ↓
Binance.fetchKlines(sym, '4h', 210) → OHLCV for indicators
    ↓
Calc: RSI, ATR, EMA, POC, FVG, Market Structure
    ↓
calcScore() + regime → sort assets by score
    ↓
setData() → renders DirectionC (swipeable deck layout)
    ↓
Auto-refresh interval fires every 20 min
```

### Theme & Style Tokens

**TOKENS** (line ~620)
- `font.base`, `font.display`, `font.mono`
- `DARK_THEME` and `LIGHT_THEME` objects: colors for bg, text, accent, grid lines, etc.
- Hook: `useTheme()` reads `localStorage.cim_mode` ('dark' or 'light')

### React Components

| Component | Purpose |
|-----------|---------|
| `SwipeableDeck` | Horizontal swipe through asset cards. Native touch listeners (passive: false) to prevent page scroll. |
| `Card` | Single asset mini-view: price, 24h delta, score arc, sparkline. |
| `DetailSheetA` | Expanded asset sheet: all indicators, regime, grid recommendation. |
| `GridC` | Grid bot candidates table (RANGING assets). |
| `DirectionC` | Main layout: regime header, swipeable deck, grid callout, dock with theme toggle. |
| `LoadingScreen` | Spinner on initial load. |
| `ErrorScreen` | Error message + retry button. |

## Common Change Patterns

### Change symbols (default list)
**File:** `index.html`  
**Line:** ~70 (in `CFG.DEFAULT_SYMBOLS`)  
Edit array:
```js
const DEFAULT_SYMBOLS=['BTC','ETH','SOL','BNB','XRP','DOGE','AVAX','LINK'];
```

### Change refresh interval
**File:** `index.html`  
**Line:** 54  
Edit `CFG.REFRESH_INTERVAL_SEC` (in seconds). 1200 = 20 min.

### Change indicator periods (RSI, ATR, EMA)
**File:** `index.html`  
**Lines:** 59–61  
Edit `CFG.RSI_PERIOD`, `CFG.ATR_PERIOD`, `CFG.EMA_FAST`, `CFG.EMA_SLOW`

### Add a new indicator
1. Write calculation function (lines ~250–450)
2. Call it in `fetchAllData()` loop (line ~480)
3. Store result in asset object
4. Render in `DetailSheetA` component (line ~800)

### Fix API rate-limit or CORS issue
**File:** `index.html`  
**Lines:** ~180 (Binance), ~200 (Bybit)  
Swap API endpoint or add proxy. Bybit fallback auto-triggers if Binance fails.

### Change grid bot filter criteria
**File:** `index.html`  
**Line:** ~470 (in `fetchAllData()`)  
Edit filter: `a.gridFit === 'RECOMMENDED'` logic. Adjust `lower` / `upper` range multipliers (currently 0.96 × price to 1.04 × price).

### Deploy to Vercel
```bash
git add .
git commit -m "..."
git push origin main
# Vercel auto-deploys in ~30 sec
```

### Test locally before pushing
```bash
python -m http.server 8000
# Open browser → http://localhost:8000
# Check console for API errors, indicator calculations
```

## Notes

- **No environment variables needed.** All API endpoints are public; no auth required.
- **CORS:** Browser may block Binance/Bybit from localhost. Use a simple HTTP server or Vercel deployment to test live APIs.
- **PWA:** Install on home screen (iOS: Share → Add to Home Screen; Android: menu → Install app).
- **Storage:** Persists theme mode in `localStorage.cim_mode`. Symbols can be set via `localStorage.cim_mobile_symbols = JSON.stringify([...])`.
- **Mobile swipe fix:** `overflow-x: hidden` on html/body + native non-passive touch listeners prevent sideways page drift.

---

Questions? Check README.md for deployment, API notes, and feature list.
