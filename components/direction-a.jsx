// Direction A — Calm Minimalist Fintech
// Robinhood/Revolut-grade. Big hero regime card, quiet typography,
// generous whitespace, glanceable score bars. Density target: ~7/10.

function DirectionA({ theme, mode, setMode, accent }) {
  const [tab, setTab] = React.useState('home'); // home | grid | book
  const [openSym, setOpenSym] = React.useState(null);
  const [pulseOpen, setPulseOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const scrollRef = React.useRef(null);
  const d = window.CIM_DATA;

  // collapsible pulse header that hides on scroll
  const onScroll = (e) => setScrolled(e.target.scrollTop > 40);

  return (
    <div style={{
      width: '100%', height: '100%', background: theme.bg, color: theme.text,
      fontFamily: TOKENS.font.sans, display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Top: brand + pulse collapse */}
      <TopStripA theme={theme} mode={mode} setMode={setMode} pulse={d.MARKET_PULSE}
                 collapsed={scrolled} />

      {/* Scrollable content */}
      <div ref={scrollRef} onScroll={onScroll} style={{
        flex: 1, overflow: 'auto', paddingBottom: 100,
      }}>
        {tab === 'home' && <HomeA theme={theme} data={d} onOpen={setOpenSym} />}
        {tab === 'grid' && <GridA theme={theme} data={d} onOpen={setOpenSym} />}
        {tab === 'book' && <BookA theme={theme} data={d} />}
      </div>

      {/* Bottom nav */}
      <BottomNavA theme={theme} tab={tab} setTab={setTab} accent={accent || theme.accent} />

      {/* Detail sheet */}
      {openSym && (
        <DetailSheetA theme={theme} asset={d.ASSETS.find(a => a.sym === openSym)}
                      onClose={() => setOpenSym(null)} />
      )}
    </div>
  );
}

// ─── Top strip: brand + collapsible market pulse ──────────────
function TopStripA({ theme, mode, setMode, pulse, collapsed }) {
  return (
    <div style={{
      position: 'relative', zIndex: 5,
      padding: collapsed ? '60px 20px 8px' : '62px 20px 10px',
      background: theme.glass, backdropFilter: 'blur(14px)',
      borderBottom: `1px solid ${theme.border}`,
      transition: 'padding 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: collapsed ? 0 : 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.bull})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 12, letterSpacing: 0.3,
          }}>C</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.2 }}>CIM</div>
            <div style={{ fontSize: 10, color: theme.text3, letterSpacing: 0.6, textTransform: 'uppercase' }}>
              Intelligence Matrix
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <IconBtnA theme={theme} onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
            {mode === 'dark' ? Icon.sun(theme.text2) : Icon.moon(theme.text2)}
          </IconBtnA>
          <IconBtnA theme={theme}>{Icon.refresh(theme.text2)}</IconBtnA>
        </div>
      </div>

      {!collapsed && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          <PulsePill theme={theme} label="F&G" value={pulse.fearGreed.value}
                     sub={pulse.fearGreed.label} tone={pulse.fearGreed.value >= 60 ? 'bull' : pulse.fearGreed.value <= 40 ? 'bear' : 'warn'} />
          <PulsePill theme={theme} label="Smart $" value={`${pulse.smartMoney.ratio.toFixed(2)}×`}
                     sub={pulse.smartMoney.bias === 'long' ? 'Long' : 'Short'} tone={pulse.smartMoney.bias === 'long' ? 'bull' : 'bear'} />
          <PulsePill theme={theme} label="24h Vol" value={`$${pulse.volume24h}B`} sub="spot+perp" tone="neutral" />
          <PulsePill theme={theme} label="BTC.D" value={`${pulse.btcDominance}%`} sub="dominance" tone="neutral" />
        </div>
      )}
    </div>
  );
}

function IconBtnA({ children, onClick, theme }) {
  return (
    <button onClick={onClick} style={{
      width: 36, height: 36, borderRadius: 10,
      background: theme.surface2, border: `1px solid ${theme.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
    }}>{children}</button>
  );
}

function PulsePill({ theme, label, value, sub, tone }) {
  const map = {
    bull: theme.bull, bear: theme.bear, warn: theme.warn, neutral: theme.text2,
  };
  return (
    <div style={{
      padding: '8px 12px', borderRadius: 12,
      background: theme.surface, border: `1px solid ${theme.border}`,
      display: 'flex', flexDirection: 'column', gap: 1, flexShrink: 0, minWidth: 82,
    }}>
      <div style={{ fontSize: 9.5, color: theme.text3, letterSpacing: 0.6, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: map[tone], fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        <span style={{ fontSize: 10, color: theme.text3 }}>{sub}</span>
      </div>
    </div>
  );
}

// ─── HOME tab ───────────────────────────────────────────────────
function HomeA({ theme, data, onOpen }) {
  const topGrid = data.GRID_CANDIDATES[0];
  const topSignal = [...data.ASSETS].sort((a, b) => b.score - a.score)[0];
  const rest = [...data.ASSETS].sort((a, b) => b.score - a.score);
  return (
    <div style={{ padding: '14px 16px 0' }}>
      {/* HERO: Market regime */}
      <RegimeHero theme={theme} regime={data.REGIME} />

      {/* Best grid bot candidate */}
      <SectionTitle theme={theme} title="Best grid bot candidate" action="Configure" />
      <GridHeroCard theme={theme} grid={topGrid} onOpen={() => onOpen(topGrid.sym)} />

      {/* Top signal */}
      <SectionTitle theme={theme} title="Top directional signal" action="See all" />
      <SignalHeroCard theme={theme} a={topSignal} onOpen={() => onOpen(topSignal.sym)} />

      {/* Watchlist */}
      <SectionTitle theme={theme} title="All assets" action={null} count={rest.length} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rest.map(a => (
          <AssetRowA key={a.sym} theme={theme} a={a} onClick={() => onOpen(a.sym)} />
        ))}
      </div>
    </div>
  );
}

function SectionTitle({ theme, title, action, count }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      padding: '22px 2px 10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: theme.text, letterSpacing: -0.2 }}>{title}</span>
        {count != null && <span style={{ fontSize: 12, color: theme.text3, fontVariantNumeric: 'tabular-nums' }}>{count}</span>}
      </div>
      {action && <span style={{ fontSize: 12, fontWeight: 600, color: theme.accent }}>{action}</span>}
    </div>
  );
}

function RegimeHero({ theme, regime }) {
  const tone = regime.direction === 'bullish' ? 'bull' : regime.direction === 'bearish' ? 'bear' : 'neutral';
  const accent = tone === 'bull' ? theme.bull : tone === 'bear' ? theme.bear : theme.text2;
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: 22, padding: '18px 18px 16px',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(800px 200px at 0% 0%, ${accent}18, transparent 60%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Dot color={accent} size={8} pulse />
          <span style={{ fontSize: 11, color: theme.text3, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600 }}>
            Market Regime · 4H
          </span>
        </div>
        <div style={{
          fontSize: 32, fontWeight: 700, letterSpacing: -1, color: theme.text,
          fontFamily: TOKENS.font.display, lineHeight: 1.05, marginBottom: 4,
        }}>{regime.headline}</div>
        <div style={{ fontSize: 13, color: theme.text2, lineHeight: 1.45, marginBottom: 14, textWrap: 'pretty' }}>
          {regime.sub}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <TagPill theme={theme} tone={tone} label={regime.label.replace('_', ' ')} mono />
          <span style={{ fontSize: 11, color: theme.text3 }}>
            Confidence <span style={{ color: theme.text, fontWeight: 600 }}>{regime.confidence}/100</span>
          </span>
          <span style={{ fontSize: 11, color: theme.text3 }}>·</span>
          <span style={{ fontSize: 11, color: theme.text3 }}>
            for <span style={{ color: theme.text }}>{regime.since}</span>
          </span>
        </div>
        {/* confidence bar */}
        <div style={{ marginTop: 12, height: 4, borderRadius: 2, background: theme.surface3, overflow: 'hidden' }}>
          <div style={{
            width: `${regime.confidence}%`, height: '100%',
            background: `linear-gradient(90deg, ${accent}, ${accent}cc)`,
            transition: 'width 0.5s',
          }} />
        </div>
      </div>
    </div>
  );
}

function GridHeroCard({ theme, grid, onOpen }) {
  return (
    <div onClick={onOpen} style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: 18, padding: 14, cursor: 'pointer',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <AssetGlyph sym={grid.sym} theme={theme} size={34} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{grid.sym}</span>
            <span style={{ fontSize: 11, color: theme.text3 }}>{grid.name}</span>
          </div>
          <div style={{ fontSize: 11, color: theme.text2, marginTop: 2 }}>
            Grid fit <span style={{ color: theme.bull, fontWeight: 700 }}>RECOMMENDED</span>
          </div>
        </div>
        <TagPill theme={theme} tone="accent" label={`${grid.score.toFixed(1)}`} mono size="sm" />
      </div>

      {/* range visualization */}
      <div style={{ padding: '6px 2px 4px' }}>
        <GridRangeVis theme={theme} grid={grid} />
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 10,
        paddingTop: 10, borderTop: `1px solid ${theme.border}`,
      }}>
        <KV theme={theme} k="Range" v={`±${((grid.upper - grid.price) / grid.price * 100).toFixed(1)}%`} />
        <KV theme={theme} k="Grids" v={grid.grids} />
        <KV theme={theme} k="Est / day" v={`+${grid.expectedDailyPct.toFixed(1)}%`} color={theme.bull} />
      </div>
    </div>
  );
}

function GridRangeVis({ theme, grid }) {
  const pct = (grid.price - grid.lower) / (grid.upper - grid.lower);
  return (
    <div style={{ paddingTop: 22 }}>
      <div style={{
        position: 'relative', height: 28,
        background: `linear-gradient(90deg, ${theme.bearSoft}, ${theme.surface2} 50%, ${theme.bullSoft})`,
        borderRadius: 10, overflow: 'visible',
      }}>
        {/* grid lines */}
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: 4, bottom: 4, left: `${(i / 10) * 100}%`,
            width: 1, background: theme.border2,
          }} />
        ))}
        {/* current price marker */}
        <div style={{
          position: 'absolute', top: -4, bottom: -4, left: `${pct * 100}%`,
          width: 2, background: theme.text, transform: 'translateX(-1px)',
          borderRadius: 1,
        }} />
        <div style={{
          position: 'absolute', top: -22, left: `${pct * 100}%`, transform: 'translateX(-50%)',
          fontSize: 10, fontWeight: 700, fontFamily: TOKENS.font.mono,
          color: theme.text, whiteSpace: 'nowrap',
        }}>${fmtPrice(grid.price)}</div>
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', marginTop: 6,
        fontSize: 10, color: theme.text3, fontFamily: TOKENS.font.mono,
      }}>
        <span>${fmtPrice(grid.lower)}</span>
        <span>${fmtPrice(grid.upper)}</span>
      </div>
    </div>
  );
}

function KV({ theme, k, v, color }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: theme.text3, letterSpacing: 0.4, textTransform: 'uppercase' }}>{k}</div>
      <div style={{
        fontSize: 14, fontWeight: 700, color: color || theme.text,
        fontFamily: TOKENS.font.mono, fontVariantNumeric: 'tabular-nums', marginTop: 2,
      }}>{v}</div>
    </div>
  );
}

function SignalHeroCard({ theme, a, onOpen }) {
  const tone = a.bias === 'bullish' ? 'bull' : a.bias === 'bearish' ? 'bear' : 'neutral';
  const color = tone === 'bull' ? theme.bull : tone === 'bear' ? theme.bear : theme.text2;
  return (
    <div onClick={onOpen} style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: 18, padding: 14, cursor: 'pointer',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <AssetGlyph sym={a.sym} theme={theme} size={34} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{a.sym}</span>
            <span style={{ fontSize: 11, color: theme.text3 }}>{a.name}</span>
          </div>
          <div style={{ fontSize: 11, color: theme.text2, marginTop: 2 }}>{a.setup}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: TOKENS.font.mono }}>${fmtPrice(a.price)}</div>
          <Delta value={a.change24h} theme={theme} fs={12} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          fontSize: 42, fontWeight: 700, fontFamily: TOKENS.font.display,
          letterSpacing: -1.5, color, lineHeight: 1,
        }}>{a.score.toFixed(1)}</div>
        <div style={{ flex: 1 }}>
          <Score value={a.score} theme={theme} size="lg" />
          <div style={{ fontSize: 10, color: theme.text3, marginTop: 6, textTransform: 'uppercase', letterSpacing: 0.6 }}>
            Confidence · 0–10
          </div>
        </div>
        <Spark data={a.sparkline} theme={theme} color={color} width={72} height={42} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <TagPill theme={theme} tone={tone} label={a.bias.toUpperCase()} size="sm" />
        <TagPill theme={theme} tone="neutral" label={`RSI ${a.rsi}`} size="sm" mono />
        <TagPill theme={theme} tone={a.flow > 0 ? 'bull' : 'bear'} label={`Flow ${a.flow >= 0 ? '+' : ''}${a.flow}%`} size="sm" mono />
        <TagPill theme={theme} tone="neutral" label={`CVD ${a.cvd}`} size="sm" mono />
      </div>
    </div>
  );
}

function AssetRowA({ theme, a, onClick }) {
  const tone = a.bias === 'bullish' ? 'bull' : a.bias === 'bearish' ? 'bear' : 'neutral';
  const color = tone === 'bull' ? theme.bull : tone === 'bear' ? theme.bear : theme.text2;
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px', background: theme.surface,
      border: `1px solid ${theme.border}`, borderRadius: 14, cursor: 'pointer',
    }}>
      <AssetGlyph sym={a.sym} theme={theme} size={32} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{a.sym}</span>
          <span style={{ fontSize: 10, color: theme.text3, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {a.regime.replace('_', ' ')}
          </span>
        </div>
        <div style={{ fontSize: 11, color: theme.text2, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {a.setup}
        </div>
      </div>
      <Spark data={a.sparkline} theme={theme} color={color} width={54} height={22} fill={false} />
      <div style={{ textAlign: 'right', minWidth: 70 }}>
        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: TOKENS.font.mono }}>${fmtPrice(a.price)}</div>
        <Delta value={a.change24h} theme={theme} fs={11} />
      </div>
      <div style={{
        minWidth: 36, textAlign: 'center',
        padding: '6px 0', borderRadius: 8,
        background: color + '18', color,
        fontWeight: 700, fontSize: 14, fontFamily: TOKENS.font.mono,
      }}>{a.score.toFixed(1)}</div>
    </div>
  );
}

// ─── GRID tab ──────────────────────────────────────────────────
function GridA({ theme, data, onOpen }) {
  return (
    <div style={{ padding: '14px 16px 0' }}>
      <div style={{
        fontSize: 11, color: theme.text3, letterSpacing: 0.6,
        textTransform: 'uppercase', fontWeight: 600, padding: '2px 2px 10px',
      }}>Grid bot candidates · {data.GRID_CANDIDATES.length} active</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.GRID_CANDIDATES.map(g => (
          <GridHeroCard key={g.sym} theme={theme} grid={g} onOpen={() => onOpen(g.sym)} />
        ))}
      </div>
      <SectionTitle theme={theme} title="Not suitable right now" count={data.ASSETS.filter(a => a.gridFit === 'AVOID').length} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.ASSETS.filter(a => a.gridFit === 'AVOID').map(a => (
          <AssetRowA key={a.sym} theme={theme} a={a} onClick={() => onOpen(a.sym)} />
        ))}
      </div>
    </div>
  );
}

// ─── BOOK tab (reference) ──────────────────────────────────────
function BookA({ theme, data }) {
  const [open, setOpen] = React.useState(null);
  return (
    <div style={{ padding: '14px 16px 0' }}>
      <SectionTitle theme={theme} title="Color guide" />
      <Card theme={theme}>
        {[
          ['bull', 'Green', 'Bullish · Accumulation · Oversold entry'],
          ['bear', 'Red',   'Bearish · Distribution · Overbought exit'],
          ['warn', 'Yellow','Caution · Divergence · Watch'],
          ['neutral','Gray','Neutral · No clear signal'],
        ].map(([t, n, desc], i) => (
          <div key={t} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 0', borderTop: i ? `1px solid ${theme.border}` : 'none',
          }}>
            <TagPill theme={theme} tone={t} label={n} size="sm" />
            <span style={{ fontSize: 12, color: theme.text2 }}>{desc}</span>
          </div>
        ))}
      </Card>

      <SectionTitle theme={theme} title="Quick reference" />
      <Card theme={theme}>
        {[
          'RSI <30 = Oversold entry · >70 = Overbought exit',
          'Flow >+5% = Buy dominant · <−5% = Sell dominant',
          'OI↑ + Price↑ = Real bull · OI↑ + Price↓ = Squeeze risk',
          'CVD all ACC = Full Accumulation (high-confidence)',
          'Score ≥ 7.5 → Bot parameters activated',
        ].map((t, i) => (
          <div key={i} style={{
            padding: '10px 0', fontSize: 13, color: theme.text2, lineHeight: 1.5,
            borderTop: i ? `1px solid ${theme.border}` : 'none',
          }}>{t}</div>
        ))}
      </Card>

      <SectionTitle theme={theme} title="Indicator glossary" />
      <Card theme={theme} pad={0}>
        {data.INDICATOR_GLOSSARY.map(([term, desc], i) => (
          <div key={term}>
            <div onClick={() => setOpen(open === i ? null : i)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 14px', cursor: 'pointer',
              borderTop: i ? `1px solid ${theme.border}` : 'none',
            }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{term}</span>
              <div style={{ transform: `rotate(${open === i ? 180 : 0}deg)`, transition: 'transform 0.2s' }}>
                {Icon.chevDn(theme.text3)}
              </div>
            </div>
            {open === i && (
              <div style={{ padding: '0 14px 14px', fontSize: 12, color: theme.text2, lineHeight: 1.5 }}>
                {desc}
              </div>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Bottom navigation ─────────────────────────────────────────
function BottomNavA({ theme, tab, setTab, accent }) {
  const items = [
    { k: 'home', label: 'Signals', I: Icon.pulse },
    { k: 'grid', label: 'Grid Bot', I: Icon.grid },
    { k: 'book', label: 'Reference', I: Icon.book },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
      background: theme.glass, backdropFilter: 'blur(18px)',
      borderTop: `1px solid ${theme.border}`,
      padding: '8px 12px 22px',
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4,
    }}>
      {items.map(it => {
        const active = tab === it.k;
        const c = active ? accent : theme.text3;
        return (
          <button key={it.k} onClick={() => setTab(it.k)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '8px 0', border: 'none', background: 'transparent',
            cursor: 'pointer', borderRadius: 10,
          }}>
            {it.I(c)}
            <span style={{
              fontSize: 10.5, fontWeight: active ? 700 : 500, color: c,
              letterSpacing: 0.2,
            }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Detail sheet ──────────────────────────────────────────────
function DetailSheetA({ theme, asset, onClose }) {
  if (!asset) return null;
  const tone = asset.bias === 'bullish' ? 'bull' : asset.bias === 'bearish' ? 'bear' : 'neutral';
  const color = tone === 'bull' ? theme.bull : tone === 'bear' ? theme.bear : theme.text2;
  const [entered, setEntered] = React.useState(false);
  React.useEffect(() => { requestAnimationFrame(() => setEntered(true)); }, []);
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 60,
      background: entered ? 'rgba(0,0,0,0.5)' : 'transparent',
      transition: 'background 0.25s',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: theme.bg2, borderRadius: '22px 22px 0 0',
        maxHeight: '90%', overflow: 'auto',
        transform: entered ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s cubic-bezier(.2,.8,.3,1)',
        padding: '10px 16px 24px',
      }}>
        <div style={{
          width: 36, height: 4, background: theme.border2,
          borderRadius: 4, margin: '4px auto 14px',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <AssetGlyph sym={asset.sym} theme={theme} size={44} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3 }}>{asset.sym} <span style={{ fontSize: 13, color: theme.text3, fontWeight: 500 }}>{asset.name}</span></div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 700, fontFamily: TOKENS.font.mono }}>${fmtPrice(asset.price)}</span>
              <Delta value={asset.change24h} theme={theme} />
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 15, border: 'none',
            background: theme.surface2, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icon.close(theme.text2)}</button>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px', background: theme.surface, borderRadius: 14,
          border: `1px solid ${theme.border}`,
        }}>
          <ScoreArc value={asset.score} theme={{ ...theme }} size={88} />
          <div style={{ marginLeft: -92, width: 88, height: 88, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: TOKENS.font.display, letterSpacing: -0.5 }}>{asset.score.toFixed(1)}</div>
            <div style={{ fontSize: 9, color: theme.text3, textTransform: 'uppercase', letterSpacing: 0.6 }}>of 10</div>
          </div>
          <div style={{ flex: 1, marginLeft: 12 }}>
            <TagPill theme={theme} tone={tone} label={asset.bias.toUpperCase()} />
            <div style={{ fontSize: 12, color: theme.text2, marginTop: 8, lineHeight: 1.4 }}>{asset.setup}</div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          <MetricTile theme={theme} k="RSI (14)" v={asset.rsi} tone={asset.rsi > 70 ? 'bear' : asset.rsi < 30 ? 'bull' : 'neutral'} />
          <MetricTile theme={theme} k="Flow 24h" v={`${asset.flow >= 0 ? '+' : ''}${asset.flow}%`} tone={asset.flow > 5 ? 'bull' : asset.flow < -5 ? 'bear' : 'neutral'} />
          <MetricTile theme={theme} k="OI 7d" v={`${asset.oi >= 0 ? '+' : ''}${asset.oi}%`} tone={asset.oi > 0 ? 'bull' : 'bear'} />
          <MetricTile theme={theme} k="CVD" v={asset.cvd} tone={asset.cvd === 'ACC' ? 'bull' : asset.cvd === 'DIS' ? 'bear' : 'neutral'} />
          <MetricTile theme={theme} k="EMA 50/200" v={asset.ema} tone={asset.ema.includes('BULL') ? 'bull' : asset.ema.includes('BEAR') ? 'bear' : 'neutral'} />
          <MetricTile theme={theme} k="Structure" v={asset.structure} tone={asset.structure === 'Bullish' ? 'bull' : asset.structure === 'Bearish' ? 'bear' : 'neutral'} />
        </div>

        <div style={{
          marginTop: 12, padding: 12, background: theme.surface, borderRadius: 14,
          border: `1px solid ${theme.border}`,
        }}>
          <div style={{ fontSize: 11, color: theme.text3, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>
            AVWAP position
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['d5', 'd14', 'd30'].map(k => (
              <div key={k} style={{
                flex: 1, padding: '10px 0', borderRadius: 10, textAlign: 'center',
                background: asset.avwap[k] === 'above' ? theme.bullSoft : theme.bearSoft,
                color: asset.avwap[k] === 'above' ? theme.bull : theme.bear,
                fontWeight: 700, fontSize: 12,
              }}>
                <div style={{ fontSize: 10, opacity: 0.8, textTransform: 'uppercase' }}>{k.toUpperCase()}</div>
                <div>{asset.avwap[k] === 'above' ? '▲ Above' : '▼ Below'}</div>
              </div>
            ))}
          </div>
        </div>

        <button style={{
          marginTop: 16, width: '100%', padding: '14px',
          background: color, color: '#fff', border: 'none', borderRadius: 12,
          fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}>
          {asset.gridFit === 'RECOMMENDED' ? 'Configure grid bot' : 'Set price alert'}
        </button>
      </div>
    </div>
  );
}

function MetricTile({ theme, k, v, tone }) {
  const map = { bull: theme.bull, bear: theme.bear, warn: theme.warn, neutral: theme.text };
  return (
    <div style={{
      padding: 12, background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: 12,
    }}>
      <div style={{ fontSize: 10, color: theme.text3, textTransform: 'uppercase', letterSpacing: 0.6 }}>{k}</div>
      <div style={{
        fontSize: 16, fontWeight: 700, fontFamily: TOKENS.font.mono, marginTop: 4,
        color: map[tone] || theme.text, fontVariantNumeric: 'tabular-nums',
      }}>{v}</div>
    </div>
  );
}

Object.assign(window, { DirectionA });
