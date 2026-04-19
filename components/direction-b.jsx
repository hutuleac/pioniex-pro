// Direction B — Pro-trader Focused Segmented Board
// Denser, more data-forward. Segmented control at top (Signals / Grid / Regime).
// Pro typographic rhythm with mono numerics, compact rows,
// right-rail score column, expand-in-place accordion for details.

function DirectionB({ theme, mode, setMode, accent }) {
  const [seg, setSeg] = React.useState('signals'); // signals | grid | regime
  const [sort, setSort] = React.useState('score'); // score | change
  const [filter, setFilter] = React.useState('all'); // all | bull | bear | neutral
  const [expanded, setExpanded] = React.useState(null);
  const [scrolled, setScrolled] = React.useState(false);
  const d = window.CIM_DATA;

  const assets = React.useMemo(() => {
    let list = [...d.ASSETS];
    if (filter !== 'all') list = list.filter(a => a.bias === filter);
    if (sort === 'score') list.sort((a, b) => b.score - a.score);
    if (sort === 'change') list.sort((a, b) => b.change24h - a.change24h);
    return list;
  }, [sort, filter, d]);

  return (
    <div style={{
      width: '100%', height: '100%', background: theme.bg, color: theme.text,
      fontFamily: TOKENS.font.sans, display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      <TopB theme={theme} mode={mode} setMode={setMode} pulse={d.MARKET_PULSE} collapsed={scrolled} />
      <SegB theme={theme} seg={seg} setSeg={setSeg} accent={accent || theme.accent} />

      <div onScroll={e => setScrolled(e.target.scrollTop > 20)} style={{ flex: 1, overflow: 'auto', paddingBottom: 20 }}>
        {seg === 'signals' && (
          <SignalsB theme={theme} assets={assets} sort={sort} setSort={setSort}
                    filter={filter} setFilter={setFilter}
                    expanded={expanded} setExpanded={setExpanded} data={d} />
        )}
        {seg === 'grid'    && <GridB    theme={theme} data={d} expanded={expanded} setExpanded={setExpanded} />}
        {seg === 'regime'  && <RegimeB  theme={theme} data={d} />}
      </div>
    </div>
  );
}

function TopB({ theme, mode, setMode, pulse, collapsed }) {
  return (
    <div style={{
      background: theme.glass, backdropFilter: 'blur(14px)',
      borderBottom: `1px solid ${theme.border}`,
      padding: collapsed ? '58px 16px 8px' : '60px 16px 10px',
      transition: 'padding 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: collapsed ? 0 : 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            fontSize: 11, fontWeight: 800, letterSpacing: 2,
            padding: '3px 8px', borderRadius: 4,
            background: theme.accent, color: mode === 'dark' ? '#0A0B0E' : '#fff',
          }}>CIM</div>
          <div style={{ fontSize: 11, color: theme.text3, letterSpacing: 1, textTransform: 'uppercase' }}>v6.4 · 4H</div>
          <Dot color={theme.bull} size={6} pulse />
          <span style={{ fontSize: 11, color: theme.text2, fontFamily: TOKENS.font.mono }}>LIVE</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <IconBtnB theme={theme} onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
            {mode === 'dark' ? Icon.sun(theme.text2) : Icon.moon(theme.text2)}
          </IconBtnB>
          <IconBtnB theme={theme}>{Icon.refresh(theme.text2)}</IconBtnB>
          <IconBtnB theme={theme}>{Icon.settings(theme.text2)}</IconBtnB>
        </div>
      </div>
      {!collapsed && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1,
          background: theme.border, border: `1px solid ${theme.border}`, borderRadius: 8, overflow: 'hidden',
        }}>
          <PulseCellB theme={theme} label="F&G" value={pulse.fearGreed.value} sub={pulse.fearGreed.label}
                      tone={pulse.fearGreed.value >= 60 ? 'bull' : pulse.fearGreed.value <= 40 ? 'bear' : 'warn'} />
          <PulseCellB theme={theme} label="SMART$" value={`${pulse.smartMoney.ratio.toFixed(2)}×`} sub={pulse.smartMoney.bias.toUpperCase()}
                      tone={pulse.smartMoney.bias === 'long' ? 'bull' : 'bear'} />
          <PulseCellB theme={theme} label="VOL 24H" value={`${pulse.volume24h}B`} sub="USD" tone="neutral" />
          <PulseCellB theme={theme} label="BTC.D" value={`${pulse.btcDominance}%`} sub="DOM" tone="neutral" />
        </div>
      )}
    </div>
  );
}

function IconBtnB({ theme, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      width: 32, height: 32, borderRadius: 6, border: 'none',
      background: theme.surface2, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{children}</button>
  );
}

function PulseCellB({ theme, label, value, sub, tone }) {
  const map = { bull: theme.bull, bear: theme.bear, warn: theme.warn, neutral: theme.text };
  return (
    <div style={{ background: theme.surface, padding: '6px 8px' }}>
      <div style={{ fontSize: 9, color: theme.text3, letterSpacing: 0.6, fontFamily: TOKENS.font.mono }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
        <span style={{
          fontSize: 13, fontWeight: 700, color: map[tone],
          fontFamily: TOKENS.font.mono, fontVariantNumeric: 'tabular-nums', lineHeight: 1,
        }}>{value}</span>
        <span style={{ fontSize: 9, color: theme.text3, fontFamily: TOKENS.font.mono }}>{sub}</span>
      </div>
    </div>
  );
}

function SegB({ theme, seg, setSeg, accent }) {
  const items = [
    ['signals', 'Signals'],
    ['grid',    'Grid Bots'],
    ['regime',  'Regime'],
  ];
  return (
    <div style={{
      display: 'flex', padding: '10px 16px 6px',
      borderBottom: `1px solid ${theme.border}`, background: theme.bg,
      gap: 4,
    }}>
      <div style={{
        display: 'flex', flex: 1, padding: 3, borderRadius: 10,
        background: theme.surface2, border: `1px solid ${theme.border}`,
      }}>
        {items.map(([k, label]) => {
          const active = seg === k;
          return (
            <button key={k} onClick={() => setSeg(k)} style={{
              flex: 1, padding: '8px 10px', border: 'none', borderRadius: 7,
              background: active ? theme.surface : 'transparent',
              color: active ? theme.text : theme.text2,
              fontSize: 13, fontWeight: active ? 700 : 500, cursor: 'pointer',
              boxShadow: active ? `0 1px 2px rgba(0,0,0,0.1), inset 0 0 0 1px ${theme.border2}` : 'none',
              transition: 'all 0.15s',
            }}>{label}</button>
          );
        })}
      </div>
    </div>
  );
}

function SignalsB({ theme, assets, sort, setSort, filter, setFilter, expanded, setExpanded, data }) {
  return (
    <>
      {/* Filter / sort rail */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px 8px',
        overflowX: 'auto',
      }}>
        {[
          ['all', 'All'],
          ['bullish', 'Bull', theme.bull],
          ['bearish', 'Bear', theme.bear],
          ['neutral', 'Neutral'],
        ].map(([k, l, c]) => {
          const active = filter === k;
          return (
            <button key={k} onClick={() => setFilter(k)} style={{
              padding: '6px 12px', borderRadius: 999, border: `1px solid ${active ? (c || theme.text2) : theme.border}`,
              background: active ? (c ? c + '22' : theme.surface2) : 'transparent',
              color: active ? (c || theme.text) : theme.text2,
              fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
            }}>{l}</button>
          );
        })}
        <div style={{ flex: 1 }} />
        <button onClick={() => setSort(sort === 'score' ? 'change' : 'score')} style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '6px 10px', borderRadius: 8, border: `1px solid ${theme.border}`,
          background: theme.surface2, color: theme.text2,
          fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
          fontFamily: TOKENS.font.mono, textTransform: 'uppercase', letterSpacing: 0.5,
        }}>
          {Icon.filter(theme.text2)}
          {sort === 'score' ? 'Score' : '24h'}
        </button>
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 60px 52px',
        padding: '6px 16px',
        fontSize: 10, color: theme.text3, letterSpacing: 0.6,
        textTransform: 'uppercase', fontFamily: TOKENS.font.mono,
        borderBottom: `1px solid ${theme.border}`,
      }}>
        <div>Asset · Setup</div>
        <div style={{ textAlign: 'right' }}>24h</div>
        <div style={{ textAlign: 'right' }}>Score</div>
      </div>

      {/* Rows */}
      <div>
        {assets.map(a => (
          <AssetRowB key={a.sym} theme={theme} a={a}
                     open={expanded === a.sym}
                     onClick={() => setExpanded(expanded === a.sym ? null : a.sym)} />
        ))}
      </div>
    </>
  );
}

function AssetRowB({ theme, a, open, onClick }) {
  const tone = a.bias === 'bullish' ? 'bull' : a.bias === 'bearish' ? 'bear' : 'neutral';
  const color = tone === 'bull' ? theme.bull : tone === 'bear' ? theme.bear : theme.text2;
  return (
    <>
      <div onClick={onClick} style={{
        display: 'grid', gridTemplateColumns: '1fr 60px 52px',
        alignItems: 'center', gap: 10,
        padding: '12px 16px',
        borderBottom: open ? 'none' : `1px solid ${theme.border}`,
        cursor: 'pointer', background: open ? theme.surface : 'transparent',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <AssetGlyph sym={a.sym} theme={theme} size={30} />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{a.sym}</span>
              <span style={{ fontSize: 10, color: theme.text3, fontFamily: TOKENS.font.mono, letterSpacing: 0.4 }}>
                ${fmtPrice(a.price)}
              </span>
            </div>
            <div style={{ fontSize: 11, color: theme.text2, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {a.setup} · <span style={{ color: theme.text3 }}>{a.regime.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Delta value={a.change24h} theme={theme} fs={12} />
          <Spark data={a.sparkline} theme={theme} color={color} width={56} height={16} fill={false} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: 18, fontWeight: 700, color, letterSpacing: -0.5,
            fontFamily: TOKENS.font.display, fontVariantNumeric: 'tabular-nums',
          }}>{a.score.toFixed(1)}</div>
          <Score value={a.score} theme={theme} size="sm" style={{ marginTop: 2 }} />
        </div>
      </div>
      {open && <ExpandedRow theme={theme} a={a} />}
    </>
  );
}

function ExpandedRow({ theme, a }) {
  return (
    <div style={{
      background: theme.surface, borderBottom: `1px solid ${theme.border}`,
      padding: '4px 16px 16px',
    }}>
      {/* indicator grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 10,
      }}>
        <Chip theme={theme} k="RSI" v={a.rsi} tone={a.rsi > 70 ? 'bear' : a.rsi < 30 ? 'bull' : 'neutral'} />
        <Chip theme={theme} k="Flow" v={`${a.flow >= 0 ? '+' : ''}${a.flow}%`} tone={a.flow > 5 ? 'bull' : a.flow < -5 ? 'bear' : 'neutral'} />
        <Chip theme={theme} k="OI" v={`${a.oi >= 0 ? '+' : ''}${a.oi}%`} tone={a.oi > 0 ? 'bull' : 'bear'} />
        <Chip theme={theme} k="CVD" v={a.cvd} tone={a.cvd === 'ACC' ? 'bull' : a.cvd === 'DIS' ? 'bear' : 'neutral'} />
        <Chip theme={theme} k="EMA" v={a.ema.split('/')[0]} tone={a.ema.includes('BULL') ? 'bull' : a.ema.includes('BEAR') ? 'bear' : 'neutral'} />
        <Chip theme={theme} k="STRUCT" v={a.structure.slice(0, 4)} tone={a.structure === 'Bullish' ? 'bull' : a.structure === 'Bearish' ? 'bear' : 'neutral'} />
        <Chip theme={theme} k="FVG" v={a.fvg.near ? (a.fvg.confirmed ? '★' : '•') : '—'} tone={a.fvg.side || 'neutral'} />
        <Chip theme={theme} k="ATR" v={a.atr.toFixed(2)} tone="neutral" />
      </div>
      {/* AVWAP row */}
      <div style={{ fontSize: 10, color: theme.text3, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>
        AVWAP position
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {['d5', 'd14', 'd30'].map(k => (
          <div key={k} style={{
            flex: 1, padding: '6px 0', textAlign: 'center', borderRadius: 6,
            background: a.avwap[k] === 'above' ? theme.bullSoft : theme.bearSoft,
            color: a.avwap[k] === 'above' ? theme.bull : theme.bear,
            fontSize: 11, fontWeight: 700, fontFamily: TOKENS.font.mono, letterSpacing: 0.5,
          }}>
            {k.toUpperCase()} {a.avwap[k] === 'above' ? '▲' : '▼'}
          </div>
        ))}
      </div>
      {/* Actions */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button style={{
          flex: 1, padding: '10px', border: `1px solid ${theme.border2}`,
          background: theme.surface2, borderRadius: 8, color: theme.text,
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>View chart</button>
        <button style={{
          flex: 1, padding: '10px', border: 'none', borderRadius: 8,
          background: a.gridFit === 'RECOMMENDED' ? theme.bull : theme.accent, color: '#fff',
          fontSize: 12, fontWeight: 700, cursor: 'pointer',
        }}>{a.gridFit === 'RECOMMENDED' ? 'Run grid bot' : 'Trade setup'}</button>
      </div>
    </div>
  );
}

function Chip({ theme, k, v, tone }) {
  const map = {
    bull: { bg: theme.bullSoft, fg: theme.bull },
    bear: { bg: theme.bearSoft, fg: theme.bear },
    warn: { bg: theme.warnSoft, fg: theme.warn },
    neutral: { bg: theme.surface2, fg: theme.text2 },
  };
  const c = map[tone] || map.neutral;
  return (
    <div style={{
      padding: '6px 8px', background: c.bg, borderRadius: 6,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
    }}>
      <div style={{ fontSize: 8.5, color: theme.text3, letterSpacing: 0.5, fontFamily: TOKENS.font.mono }}>{k}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: c.fg, fontFamily: TOKENS.font.mono, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
    </div>
  );
}

function GridB({ theme, data, expanded, setExpanded }) {
  return (
    <div style={{ padding: '14px 16px 0' }}>
      <div style={{
        fontSize: 10, color: theme.text3, letterSpacing: 0.8, textTransform: 'uppercase',
        fontFamily: TOKENS.font.mono, marginBottom: 10,
      }}>Active candidates · score ≥ 7.5 or ranging regime</div>

      {data.GRID_CANDIDATES.map(g => (
        <div key={g.sym} style={{
          background: theme.surface, border: `1px solid ${theme.border}`,
          borderRadius: 12, padding: 14, marginBottom: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <AssetGlyph sym={g.sym} theme={theme} size={32} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{g.sym}/USDT</div>
              <div style={{ fontSize: 10, color: theme.text3, fontFamily: TOKENS.font.mono, letterSpacing: 0.4 }}>
                GRID · {g.mode.toUpperCase()} · {g.grids} LEVELS
              </div>
            </div>
            <TagPill theme={theme} tone="bull" label="RECOMMENDED" size="sm" mono />
          </div>
          <GridRangeVis theme={theme} grid={g} />
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10,
            marginTop: 12, paddingTop: 10, borderTop: `1px solid ${theme.border}`,
          }}>
            <KV theme={theme} k="Capital" v={`$${g.capital}`} />
            <KV theme={theme} k="Per grid" v={`+${g.netPerGridPct}%`} color={theme.bull} />
            <KV theme={theme} k="Est/day" v={`+${g.expectedDailyPct}%`} color={theme.bull} />
            <KV theme={theme} k="Score" v={g.score.toFixed(1)} color={theme.bull} />
          </div>
        </div>
      ))}

      {data.GRID_CANDIDATES.length === 0 && (
        <div style={{
          padding: '40px 20px', textAlign: 'center',
          background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12,
          color: theme.text2,
        }}>
          No candidates right now. Market is trending — wait for a ranging regime.
        </div>
      )}
    </div>
  );
}

function RegimeB({ theme, data }) {
  const r = data.REGIME;
  const tone = r.direction === 'bullish' ? 'bull' : r.direction === 'bearish' ? 'bear' : 'neutral';
  const color = tone === 'bull' ? theme.bull : tone === 'bear' ? theme.bear : theme.text2;
  // group regime distribution
  const dist = data.ASSETS.reduce((m, a) => { m[a.regime] = (m[a.regime] || 0) + 1; return m; }, {});
  return (
    <div style={{ padding: '14px 16px 0' }}>
      <div style={{
        background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: 14, padding: 16, marginBottom: 14,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(500px 160px at 100% 0%, ${color}22, transparent 60%)`, pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 10, color: theme.text3, letterSpacing: 0.8, fontFamily: TOKENS.font.mono, marginBottom: 6 }}>
            MARKET REGIME · 4H · BTC-LED
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color, fontFamily: TOKENS.font.display, letterSpacing: -0.6 }}>
              {r.label.replace('_', ' ')}
            </span>
            <span style={{ fontSize: 12, color: theme.text3 }}>since {r.since}</span>
          </div>
          <div style={{ fontSize: 13, color: theme.text2, marginBottom: 12, lineHeight: 1.4 }}>{r.headline}. {r.sub}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: theme.text3 }}>Confidence</span>
            <div style={{ flex: 1, height: 6, borderRadius: 3, background: theme.surface3, overflow: 'hidden' }}>
              <div style={{ width: `${r.confidence}%`, height: '100%', background: color }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: TOKENS.font.mono }}>{r.confidence}</span>
          </div>
        </div>
      </div>

      <div style={{
        fontSize: 10, color: theme.text3, letterSpacing: 0.8, textTransform: 'uppercase',
        fontFamily: TOKENS.font.mono, margin: '10px 0 8px',
      }}>Regime distribution · {data.ASSETS.length} assets</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {Object.entries(dist).sort((a, b) => b[1] - a[1]).map(([reg, cnt]) => {
          const frac = cnt / data.ASSETS.length;
          const regColor = reg === 'TRENDING_UP' ? theme.bull
                         : reg === 'TRENDING_DOWN' ? theme.bear
                         : reg === 'SQUEEZE' ? theme.warn
                         : reg === 'EXPANSION' ? theme.accent
                         : theme.text2;
          return (
            <div key={reg} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 96, fontSize: 11, fontWeight: 600, color: regColor, fontFamily: TOKENS.font.mono, letterSpacing: 0.4 }}>
                {reg.replace('_', ' ')}
              </div>
              <div style={{ flex: 1, height: 16, background: theme.surface2, borderRadius: 4, overflow: 'hidden', border: `1px solid ${theme.border}` }}>
                <div style={{
                  width: `${frac * 100}%`, height: '100%',
                  background: `linear-gradient(90deg, ${regColor}88, ${regColor})`,
                }} />
              </div>
              <div style={{ width: 28, textAlign: 'right', fontSize: 11, fontWeight: 700, fontFamily: TOKENS.font.mono, color: theme.text }}>
                {cnt}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: 20,
        padding: 14, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 12,
      }}>
        <div style={{ fontSize: 10, color: theme.text3, letterSpacing: 0.8, fontFamily: TOKENS.font.mono, marginBottom: 8 }}>
          TRADING RULES FOR THIS REGIME
        </div>
        {[
          'Grid bots: OFF — lateral CVD required, regime is directional',
          'Trend setups: ACTIVE — long EMA pullbacks only',
          'Short setups: AVOID until RSI >75 on majors',
          'Position size: normal; expansion regime carries squeeze risk',
        ].map((t, i) => (
          <div key={i} style={{
            display: 'flex', gap: 8, padding: '6px 0', fontSize: 12, color: theme.text2,
            borderTop: i ? `1px solid ${theme.border}` : 'none',
          }}>
            <Dot color={theme.accent} size={5} />
            <span style={{ flex: 1, lineHeight: 1.45 }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { DirectionB });
