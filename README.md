# CIM Mobile · Crypto Dashboard

Real-time crypto market signals + grid bot intelligence. Built for mobile.

**Live:** https://pioniex-pro.vercel.app

## Tech Stack

- **Frontend:** React 18.3.1 + Babel 7.29.0 (CDN, in-browser JSX transpilation)
- **Data:** Binance Futures API (primary), Bybit V5 (fallback)
- **Hosting:** Vercel (auto-deploys from GitHub `main`)
- **Format:** Single HTML file, no build step, no backend

## Features

- **Real-time Market Pulse:** Volume, Fear/Greed, Smart Money bias, social sentiment
- **Asset Scoring:** 0–10 scale based on RSI, ATR, Flow, structure, regime
- **Regime Detection:** EXPANSION, TRENDING_UP/DOWN, RANGING, SQUEEZE, MIXED
- **Grid Bot Candidates:** Auto-filtered RANGING assets with recommended range
- **Responsive Design:** Mobile-first, PWA-ready (install on home screen)
- **Live Indicators:** RSI, ATR, EMA, POC, AVWAP, CVD, FVG, Donchian, ADX, Bollinger Bands

## Running Locally

1. Clone: `git clone https://github.com/hutuleac/pioniex-pro.git`
2. Open: Drag `index.html` to browser, or `python -m http.server 8000` then visit `localhost:8000`
3. Auto-refreshes every 20 minutes (configurable in code)

## Symbols

Default: BTC, ETH, SOL, BNB, XRP, DOGE, AVAX, LINK

Change via browser DevTools console:
```js
localStorage.setItem('cim_mobile_symbols', JSON.stringify(['BTC', 'ETH', 'ARB']));
location.reload();
```

## API Notes

- **Binance fapi:** Futures data, Open Interest, funding rates
- **Bybit:** Fallback if Binance rate-limited
- **No auth required:** All endpoints are public market data
- **CORS:** Proxied via cors-anywhere or native CORS on public endpoints

## Deployment

On `git push` to `main`:
1. GitHub webhook triggers Vercel
2. Vercel detects static HTML, serves `index.html` at `/`
3. Live in ~30 seconds

---

v6.5 · Last updated: April 2026