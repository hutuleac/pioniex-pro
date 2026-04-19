// Direction C — Premium dark with hero stack + swipeable cards
// Editorial, high-contrast, distinctive. Full-screen hero regime header with
// atmospheric gradient. Swipeable asset cards deck. Bottom dock.

function DirectionC({ theme, mode, setMode, accent }) {
  const [tab, setTab] = React.useState('feed');
  const [idx, setIdx] = React.useState(0);
  const [detail, setDetail] = React.useState(null);
  const d = window.CIM_DATA;
  const ranked = [...d.ASSETS].sort((a, b) => b.score - a.score);

  return (
    <div style={{
      width: '100%', height: '100%', background: theme.bg, color: theme.text,
      fontFamily: TOKENS.font.sans, display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      {tab === 'feed'   && <FeedC   theme={theme} data={d} ranked={ranked} idx={idx} setIdx={setIdx} setDetail={setDetail} mode={mode} setMode={setMode} />}
      {tab === 'grid'   && <GridC   theme={theme} data={d} />}
      {tab === 'reference' && <RefC theme={theme} data={d} />}

      <DockC theme={theme} tab={tab} setTab={setTab} accent={accent || theme.accent} />

      {detail && <DetailC theme={theme} asset={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

function FeedC({ theme, data, ranked, idx, setIdx, setDetail, mode, setMode }) {
  const r = data.REGIME;
  const color = r.direction === 'bullish' ? theme.bull : r.direction === 'bearish' ? theme.bear : theme.text2;
  return (
    <div style={{ flex: 1, overflow: 'auto', paddingBottom: 100 }}>
      {/* Hero regime section — editorial treatment */}
      <div style={{
        position: 'relative', padding: '60px 20px 22px',
        background: `linear-gradient(180deg, ${color}20, transparent 70%)`,
        overflow: 'hidden',
      }}>
        {/* brand bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 3,
              padding: '4px 10px', borderRadius: 99,
              border: `1px solid ${color}55`, color,
              fontFamily: TOKENS.font.mono,
            }}>CIM · 04H</span>
            <Dot color={color} size={6} pulse />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} style={{
              width: 34, height: 34, borderRadius: 17, border: `1px solid ${theme.border}`,
              background: theme.surface, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{mode === 'dark' ? Icon.sun(theme.text2) : Icon.moon(theme.text2)}</button>
          </div>
        </div>

        {/* atmospheric orb */}
        <div style={{
          position: 'absolute', top: -80, right: -60,
          width: 240, height: 240, borderRadius: '50%',
          background: `radial-gradient(circle, ${color}40, transparent 70%)`,
          filter: 'blur(30px)', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, color: theme.text3, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 8, fontFamily: TOKENS.font.mono }}>
            Market · {r.label.replace('_', ' ')}
          </div>
          <div style={{
            fontSize: 44, fontWeight: 700, lineHeight: 1, letterSpacing: -1.8,
            fontFamily: TOKENS.font.display, marginBottom: 10,
            color: theme.text, textWrap: 'balance',
          }}>{r.headline}.</div>
          <div style={{ fontSize: 14, color: theme.text2, lineHeight: 1.5, marginBottom: 16, textWrap: 'pretty' }}>
            {r.sub}
          </div>

          {/* Pulse strip — inline, editorial */}
          <div style={{
            display: 'flex', gap: 2, background: theme.surface, border: `1px solid ${theme.border}`,
            borderRadius: 14, overflow: 'hidden',
          }}>
            <PulseCardC theme={theme} label="F&G" value={data.MARKET_PULSE.fearGreed.value} sub={data.MARKET_PULSE.fearGreed.label}
                        tone={data.MARKET_PULSE.fearGreed.value >= 60 ? 'bull' : 'warn'} />
            <PulseCardC theme={theme} label="Smart $" value={`${data.MARKET_PULSE.smartMoney.ratio.toFixed(2)}×`}
                        sub={data.MARKET_PULSE.smartMoney.bias} tone="bull" />
            <PulseCardC theme={theme} label="24h Vol" value={`$${data.MARKET_PULSE.volume24h}B`} sub="+12%" tone="neutral" />
          </div>
        </div>
      </div>

      {/* Section: Top setup, as swipeable deck */}
      <div style={{
        padding: '6px 20px 6px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <div>
          <div style={{ fontSize: 11, color: theme.text3, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: TOKENS.font.mono }}>
            Top setups · {ranked.length}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, fontFamily: TOKENS.font.display, marginTop: 3 }}>
            Swipe to review
          </div>
        </div>
        <span style={{ fontSize: 12, color: theme.text3, fontFamily: TOKENS.font.mono }}>
          {String(idx + 1).padStart(2, '0')} / {String(ranked.length).padStart(2, '0')}
        </span>
      </div>

      <SwipeableDeck theme={theme} items={ranked} idx={idx} setIdx={setIdx} onOpen={setDetail} />

      {/* Grid bot callout */}
      <div style={{ padding: '18px 20px 0' }}>
        <GridCalloutC theme={theme} data={data} />
      </div>
    </div>
  );
}

function PulseCardC({ theme, label, value, sub, tone }) {
  const map = { bull: theme.bull, bear: theme.bear, warn: theme.warn, neutral: theme.text };
  return (
    <div style={{
      flex: 1, padding: '12px 14px',
      borderRight: `1px solid ${theme.border}`,
      background: theme.surface,
    }}>
      <div style={{ fontSize: 10, color: theme.text3, letterSpacing: 0.6, textTransform: 'uppercase', fontFamily: TOKENS.font.mono }}>
        {label}
      </div>
      <div style={{
        fontSize: 17, fontWeight: 700, color: map[tone],
        fontFamily: TOKENS.font.display, letterSpacing: -0.4,
        marginTop: 4, lineHeight: 1,
      }}>{value}</div>
      <div style={{ fontSize: 10, color: theme.text3, marginTop: 3, textTransform: 'capitalize' }}>{sub}</div>
    </div>
  );
}

function SwipeableDeck({ theme, items, idx, setIdx, onOpen }) {
  const startX = React.useRef(null);
  const [drag, setDrag] = React.useState(0);

  const onStart = (e) => { startX.current = (e.touches ? e.touches[0] : e).clientX; setDrag(0); };
  const onMove = (e) => {
    if (startX.current == null) return;
    const x = (e.touches ? e.touches[0] : e).clientX;
    setDrag(x - startX.current);
  };
  const onEnd = () => {
    if (Math.abs(drag) > 60) {
      if (drag < 0 && idx < items.length - 1) setIdx(idx + 1);
      if (drag > 0 && idx > 0) setIdx(idx - 1);
    }
    startX.current = null;
    setDrag(0);
  };

  return (
    <div style={{
      padding: '28px 20px 4px', position: 'relative',
      height: 280, overflow: 'visible',
    }}
      onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
      onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
    >
      <div style={{ position: 'relative', height: '100%' }}>
        {items.map((a, i) => {
          const offset = i - idx;
          if (Math.abs(offset) > 2) return null;
          const tone = a.bias === 'bullish' ? 'bull' : a.bias === 'bearish' ? 'bear' : 'neutral';
          const color = tone === 'bull' ? theme.bull : tone === 'bear' ? theme.bear : theme.text2;
          const isActive = offset === 0;
          const tx = offset * 30 + (isActive ? drag * 0.6 : 0);
          const scale = 1 - Math.min(0.12, Math.abs(offset) * 0.06);
          return (
            <div key={a.sym} onClick={() => isActive && onOpen(a)} style={{
              position: 'absolute', inset: 0,
              transform: `translateX(${tx}px) scale(${scale})`,
              transformOrigin: 'center',
              transition: startX.current ? 'none' : 'transform 0.3s cubic-bezier(.2,.9,.3,1.2)',
              zIndex: 20 - Math.abs(offset),
              opacity: Math.abs(offset) > 1 ? 0 : 1,
              cursor: isActive ? 'pointer' : 'default',
            }}>
              <div style={{
                width: '100%', height: '100%',
                background: theme.surface, border: `1px solid ${theme.border}`,
                borderRadius: 20, padding: 20,
                boxShadow: isActive ? `0 20px 40px -20px ${color}40, 0 4px 20px rgba(0,0,0,0.2)` : 'none',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `radial-gradient(600px 160px at 0% 0%, ${color}14, transparent 60%)`,
                  pointerEvents: 'none',
                }} />
                <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <AssetGlyph sym={a.sym} theme={theme} size={40} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>{a.sym}</div>
                      <div style={{ fontSize: 11, color: theme.text3 }}>{a.name} · perp</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 15, fontWeight: 700, fontFamily: TOKENS.font.mono }}>${fmtPrice(a.price)}</div>
                      <Delta value={a.change24h} theme={theme} fs={11} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '4px 0 12px' }}>
                    <div style={{
                      fontSize: 62, fontWeight: 700, color,
                      fontFamily: TOKENS.font.display, letterSpacing: -3,
                      lineHeight: 0.85,
                    }}>{a.score.toFixed(1)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 10, color: theme.text3, letterSpacing: 0.8,
                        textTransform: 'uppercase', fontFamily: TOKENS.font.mono, marginBottom: 4,
                      }}>Signal · {a.setup}</div>
                      <Score value={a.score} theme={theme} size="lg" />
                      <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                        <TagPill theme={theme} tone={tone} label={a.bias.toUpperCase()} size="sm" mono />
                        <TagPill theme={theme} tone="neutral" label={a.regime.replace('_', ' ')} size="sm" mono />
                      </div>
                    </div>
                  </div>

                  <div style={{
                    marginTop: 'auto',
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4,
                    paddingTop: 10, borderTop: `1px solid ${theme.border}`,
                  }}>
                    <MiniKV theme={theme} k="RSI" v={a.rsi} />
                    <MiniKV theme={theme} k="Flow" v={`${a.flow >= 0 ? '+' : ''}${a.flow}`} tone={a.flow > 0 ? 'bull' : 'bear'} />
                    <MiniKV theme={theme} k="OI" v={`${a.oi >= 0 ? '+' : ''}${a.oi}`} tone={a.oi > 0 ? 'bull' : 'bear'} />
                    <MiniKV theme={theme} k="CVD" v={a.cvd} tone={a.cvd === 'ACC' ? 'bull' : a.cvd === 'DIS' ? 'bear' : 'neutral'} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 12 }}>
        {items.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{
            width: i === idx ? 18 : 5, height: 5, borderRadius: 3,
            background: i === idx ? theme.text : theme.border2,
            cursor: 'pointer', transition: 'width 0.2s',
          }} />
        ))}
      </div>
    </div>
  );
}

function MiniKV({ theme, k, v, tone }) {
  const map = { bull: theme.bull, bear: theme.bear, warn: theme.warn, neutral: theme.text };
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 9, color: theme.text3, letterSpacing: 0.5, fontFamily: TOKENS.font.mono, textTransform: 'uppercase' }}>{k}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: map[tone] || theme.text, fontFamily: TOKENS.font.mono, marginTop: 2 }}>{v}</div>
    </div>
  );
}

function GridCalloutC({ theme, data }) {
  const g = data.GRID_CANDIDATES[0];
  if (!g) return null;
  return (
    <div style={{
      padding: 16, background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        {Icon.grid(theme.accent)}
        <span style={{ fontSize: 11, color: theme.text3, letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: TOKENS.font.mono }}>
          Grid bot · top candidate
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <AssetGlyph sym={g.sym} theme={theme} size={32} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{g.sym}/USDT</div>
          <div style={{ fontSize: 11, color: theme.text2 }}>Ranging regime · {g.grids} grids · est +{g.expectedDailyPct}%/day</div>
        </div>
      </div>
      <GridRangeVis theme={theme} grid={g} />
    </div>
  );
}

function GridC({ theme, data }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '18px 20px 100px' }}>
      <div style={{ fontSize: 11, color: theme.text3, letterSpacing: 2, textTransform: 'uppercase', fontFamily: TOKENS.font.mono }}>Grid</div>
      <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -1, fontFamily: TOKENS.font.display, marginTop: 2, marginBottom: 16 }}>
        Bot candidates
      </div>
      {data.GRID_CANDIDATES.map(g => (
        <div key={g.sym} style={{
          marginBottom: 12, padding: 16,
          background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <AssetGlyph sym={g.sym} theme={theme} size={34} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{g.sym}/USDT</div>
              <div style={{ fontSize: 11, color: theme.text3 }}>{g.mode} · {g.grids} grids</div>
            </div>
            <TagPill theme={theme} tone="bull" label="READY" size="sm" mono />
          </div>
          <GridRangeVis theme={theme} grid={g} />
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
            marginTop: 12, paddingTop: 12, borderTop: `1px solid ${theme.border}`,
          }}>
            <KV theme={theme} k="Capital" v={`$${g.capital}`} />
            <KV theme={theme} k="Per grid" v={`+${g.netPerGridPct}%`} color={theme.bull} />
            <KV theme={theme} k="Est/day" v={`+${g.expectedDailyPct}%`} color={theme.bull} />
          </div>
        </div>
      ))}
    </div>
  );
}

function RefC({ theme, data }) {
  const [open, setOpen] = React.useState(null);
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '18px 20px 100px' }}>
      <div style={{ fontSize: 11, color: theme.text3, letterSpacing: 2, textTransform: 'uppercase', fontFamily: TOKENS.font.mono }}>
        Reference
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -1, fontFamily: TOKENS.font.display, marginTop: 2, marginBottom: 16 }}>
        Color & glossary
      </div>

      <div style={{
        padding: 14, background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: 14, marginBottom: 14,
      }}>
        {[
          ['bull', 'Bullish', 'Accumulation · oversold entry'],
          ['bear', 'Bearish', 'Distribution · overbought exit'],
          ['warn', 'Caution', 'Divergence · watch'],
          ['neutral', 'Neutral', 'No clear signal'],
        ].map(([t, n, desc], i) => (
          <div key={t} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 0', borderTop: i ? `1px solid ${theme.border}` : 'none',
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: 5,
              background: t === 'bull' ? theme.bull : t === 'bear' ? theme.bear : t === 'warn' ? theme.warn : theme.text2,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{n}</div>
              <div style={{ fontSize: 11, color: theme.text2 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: 0, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14,
      }}>
        {data.INDICATOR_GLOSSARY.map(([term, desc], i) => (
          <div key={term}>
            <div onClick={() => setOpen(open === i ? null : i)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', cursor: 'pointer',
              borderTop: i ? `1px solid ${theme.border}` : 'none',
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, fontFamily: TOKENS.font.mono, letterSpacing: 0.3 }}>{term}</span>
              <div style={{ transform: `rotate(${open === i ? 180 : 0}deg)`, transition: 'transform 0.2s' }}>
                {Icon.chevDn(theme.text3)}
              </div>
            </div>
            {open === i && (
              <div style={{ padding: '0 16px 14px', fontSize: 12, color: theme.text2, lineHeight: 1.5 }}>
                {desc}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DockC({ theme, tab, setTab, accent }) {
  const items = [
    { k: 'feed', label: 'Feed', I: Icon.pulse },
    { k: 'grid', label: 'Grid', I: Icon.grid },
    { k: 'reference', label: 'Ref', I: Icon.book },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 14, left: 20, right: 20, zIndex: 30,
      padding: 4, borderRadius: 999,
      background: theme.glass, backdropFilter: 'blur(20px)',
      border: `1px solid ${theme.border2}`,
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2,
    }}>
      {items.map(it => {
        const active = tab === it.k;
        return (
          <button key={it.k} onClick={() => setTab(it.k)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '10px 0', border: 'none', borderRadius: 999,
            background: active ? accent : 'transparent',
            color: active ? '#fff' : theme.text2,
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            {it.I(active ? '#fff' : theme.text2)}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

function DetailC({ theme, asset, onClose }) {
  return <DetailSheetA theme={theme} asset={asset} onClose={onClose} />;
}

Object.assign(window, { DirectionC });
