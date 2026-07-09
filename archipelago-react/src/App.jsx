import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useGameState } from './hooks/useGameState';
import { DOMAIN_ORDER, DOMAIN_NAMES, DOMAIN_DESCS, DOMAIN_DETAILS, ISLANDS, fmt } from './data/gameData';

/* ── theme ──────────────────────────────────────────── */
function useTheme() {
  const [theme, setTheme] = useState('dark');
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  const toggle = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), []);
  return { theme, toggle };
}

/* ── Domain Flip Card ───────────────────────────────── */
function DomainFlipCard({ code }) {
  const [flipped, setFlipped] = useState(false);
  const detail = DOMAIN_DETAILS[code];
  return (
    <button
      className={`domain-chip${flipped ? ' flipped' : ''}`}
      onClick={() => setFlipped(f => !f)}
      aria-label={`${DOMAIN_NAMES[code]} — detay için tıkla`}
    >
      <div className="flip-inner">
        {/* Front */}
        <div className="flip-face flip-front">
          <span className="code">{code}</span>
          <h4>{DOMAIN_NAMES[code]}</h4>
          <p>{DOMAIN_DESCS[code]}</p>
          <span className="flip-hint">tıkla ↺</span>
        </div>
        {/* Back */}
        <div className="flip-face flip-back">
          <p className="fb-theory">{detail.theory}</p>
          <p className="fb-desc">{detail.deep}</p>
          <span className="fb-sub">alt-alanlar</span>
          <ul>{detail.subdomains.map(s => <li key={s}>{s}</li>)}</ul>
          <p className="fb-game">{detail.gameNote}</p>
        </div>
      </div>
    </button>
  );
}

/* ── SVG Radar ──────────────────────────────────────── */
function labelPos(i, cx, cy, maxR, size) {
  const a = (-90 + i * 60) * Math.PI / 180;
  const cos = Math.cos(a), sin = Math.sin(a);
  const rx = maxR + size * 0.09, ry = maxR + size * 0.075;
  const anchor = cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle';
  return { x: cx + rx * cos, y: cy + ry * sin, a: anchor };
}

function radarPts(values, cx, cy, r) {
  return DOMAIN_ORDER.map((k, i) => {
    const a = (-90 + i * 60) * Math.PI / 180;
    const v = Math.max(0, Math.min(10, values[k] ?? 0));
    return `${(cx + r * (v / 10) * Math.cos(a)).toFixed(1)},${(cy + r * (v / 10) * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
}
function hexPts(r, cx, cy) {
  return DOMAIN_ORDER.map((_, i) => {
    const a = (-90 + i * 60) * Math.PI / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
}

function RadarSVG({ values, color, prev = null, size = 300 }) {
  const cx = size / 2, cy = size / 2, maxR = size * .38;
  const strokeColor = 'var(--border-hi)';
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img">
      <g fill="none">
        {[.2,.4,.6,.8,1].map(f => (
          <polygon key={f} points={hexPts(maxR * f, cx, cy)}
            stroke={strokeColor} strokeWidth={f === 1 ? 1 : .5}
            strokeDasharray={f === 1 ? '0' : '3,4'} />
        ))}
        {DOMAIN_ORDER.map((_, i) => {
          const a = (-90 + i * 60) * Math.PI / 180;
          return <line key={i} x1={cx} y1={cy}
            x2={(cx + maxR * Math.cos(a)).toFixed(1)}
            y2={(cy + maxR * Math.sin(a)).toFixed(1)}
            stroke={strokeColor} strokeWidth=".5" />;
        })}
      </g>

      {prev && (
        <polygon points={radarPts(prev, cx, cy, maxR)}
          fill="none" stroke="var(--text-3)" strokeWidth="1.5"
          strokeDasharray="3,4" opacity=".5" />
      )}

      <polygon points={radarPts(values, cx, cy, maxR)}
        fill={color} fillOpacity=".18"
        stroke={color} strokeWidth="2" strokeLinejoin="round" />

      {DOMAIN_ORDER.map((k, i) => {
        const p = labelPos(i, cx, cy, maxR, size);
        return (
          <text key={k} x={p.x.toFixed(1)} y={p.y.toFixed(1)} textAnchor={p.a}
            fontFamily="SFMono-Regular,Consolas,monospace"
            fontSize={size >= 250 ? 11 : 8} fontWeight="700" fill="var(--text-2)">
            {k}
          </text>
        );
      })}

      <circle cx={cx} cy={cy} r="4" fill={color} opacity=".7" />
    </svg>
  );
}

/* ── Onboard ─────────────────────────────────────────── */
function OnboardScreen({ onNext }) {
  return (
    <div>
      <p className="onboard-prose">
        Her toplum <b>altı boyutlu kırılgan bir denge</b> üzerinde durur.
        Bu denge sabit değildir — krizler altında kayar, kararlarla şekillenir.
        Her karta tıkla, boyutu tanı. Sonra bir ada seç.
      </p>

      <div className="domain-grid">
        {DOMAIN_ORDER.map(k => <DomainFlipCard key={k} code={k} />)}
      </div>

      <p className="onboard-prose" style={{ fontSize: 13, marginBottom: 0 }}>
        Amaç hiçbir boyutu maksimuma çıkarmak değil — <b>dengeli ve dirençli</b> bir bütün kurmak.
      </p>

      <div className="center mt-8">
        <button className="btn btn-primary" onClick={onNext}>Adaları Gör</button>
      </div>
    </div>
  );
}

/* ── Difficulty Stars ──────────────────────────────────── */
function DifficultyStars({ n }) {
  return (
    <span className="difficulty-stars" title={`Zorluk: ${n}/5`}>
      {'★'.repeat(n)}<span className="empty">{'★'.repeat(5 - n)}</span>
    </span>
  );
}

/* ── Island Flip Card ──────────────────────────────────── */
function IslandFlipCard({ isl, index, onSelect }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className={`island-card${flipped ? ' flipped' : ''}`}
      role="button"
      tabIndex={0}
      onClick={() => setFlipped(f => !f)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped(f => !f); } }}
      style={{ '--accent-color': isl.accent, animationDelay: `${index * 60}ms` }}
      aria-label={`${isl.name} — detay için tıkla`}
    >
      <div className="flip-inner">
        {/* Front */}
        <div className="flip-face flip-front">
          <div className="accent-line" style={{ background: isl.accent }} />
          <div className="island-card-head">
            <h3>{isl.name}</h3>
            <DifficultyStars n={isl.difficulty} />
          </div>
          <p className="tag">{isl.tag}</p>
          <div className="island-radar-wrap">
            <RadarSVG values={isl.domains} color={isl.accent} size={132} />
          </div>
          <div className="island-values">
            {DOMAIN_ORDER.map(k => (
              <span key={k} className="iv-chip"><b>{k}</b> {fmt(isl.domains[k] ?? 0)}</span>
            ))}
          </div>
          <span className="flip-hint">detay için tıkla ↺</span>
        </div>

        {/* Back */}
        <div className="flip-face flip-back">
          <h3>{isl.name}</h3>
          <p className="ib-detail">{isl.detail}</p>
          <span className="ib-label">güçlü yanlar</span>
          <ul className="ib-list strengths">{isl.strengths.map(s => <li key={s}>{s}</li>)}</ul>
          <span className="ib-label">kırılganlıklar</span>
          <ul className="ib-list risks">{isl.risks.map(s => <li key={s}>{s}</li>)}</ul>
          <button
            className="btn btn-primary island-select-btn"
            onClick={e => { e.stopPropagation(); onSelect(isl); }}
          >
            Bu Adayı Seç →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Island Select ───────────────────────────────────── */
function SelectScreen({ onSelect }) {
  return (
    <div>
      <p className="select-intro">
        Her adanın kendi güçlü ve kırılgan yanları var — aynı politika her adada aynı sonucu vermez.
      </p>
      <div className="island-grid">
        {ISLANDS.map((isl, i) => (
          <IslandFlipCard key={isl.id} isl={isl} index={i} onSelect={onSelect} />
        ))}
      </div>
      <div className="center">
        <button className="btn btn-ghost" onClick={() => onSelect(ISLANDS[Math.floor(Math.random() * ISLANDS.length)])}>
          Rastgele Ada
        </button>
      </div>
    </div>
  );
}

/* ── Crisis Screen ───────────────────────────────────── */
function CrisisScreen({ state, onChoose, onContinue, onUndo, canUndo }) {
  const crisis = state.crises[state.turn];
  const fragile = DOMAIN_ORDER.filter(k => (state.domains[k] ?? 0) < 3);
  const [openDesc, setOpenDesc] = useState(null);
  const [prevDomains, setPrevDomains] = useState(null);

  useEffect(() => { if (state.showFeedback) setPrevDomains({ ...state.domains }); }, [state.showFeedback]);
  useEffect(() => { if (!state.showFeedback) setPrevDomains(null); }, [state.showFeedback]);

  if (!crisis) return null;

  return (
    <div className="crisis-layout">
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-left">
          <div className="label">ada</div>
          <div className="value">{state.island?.name}</div>
          {state.island?.difficulty && <DifficultyStars n={state.island.difficulty} />}
        </div>
        <div className="topbar-right">
          <div className="label" style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-3)', textAlign: 'right' }}>kriz {state.turn + 1} / {state.crises.length}</div>
          <div className="progress-dots" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
            {state.crises.map((_, i) => (
              <div key={i} className={`progress-dot${i < state.turn ? ' done' : ''}`} />
            ))}
          </div>
          <button className="btn btn-ghost undo-btn" onClick={onUndo} disabled={!canUndo}>
            ↺ Geri Al
          </button>
        </div>
      </div>

      {/* Echoes */}
      {state.pendingEchoes?.length > 0 && (
        <div className="echo-banner">
          <span className="echo-label">geçmişin yankısı</span>
          {state.pendingEchoes.map((e, i) => <div key={i}>{e.text}</div>)}
        </div>
      )}

      {/* Fragility */}
      {fragile.length > 0 && (
        <div className="frag-banner">
          <span className="fb-label">⚠ kırılganlık uyarısı</span>
          {fragile.map(k => `${DOMAIN_NAMES[k]} (${k}: ${fmt(state.domains[k])})`).join(' · ')} — kritik eşiğin altında.
        </div>
      )}

      {/* Two-col layout */}
      <div className="crisis-body">
        {/* Left — radar */}
        <div className="crisis-left">
          <div className="radar-container">
            <div className="radar-svg-wrap">
              <RadarSVG values={state.domains} color={state.island?.accent ?? '#7B6BB8'} />
            </div>
            <div className="radar-legend">
              {DOMAIN_ORDER.map(k => (
                <div key={k}>
                  <div
                    className={`legend-row${(state.domains[k] ?? 0) < 3 ? ' fragile' : ''}${openDesc === k ? ' open' : ''}`}
                    onClick={() => setOpenDesc(openDesc === k ? null : k)}
                  >
                    <span className="lk">{k}</span>
                    <span className="lname">{DOMAIN_NAMES[k]}</span>
                    <span className="lval">{fmt(state.domains[k] ?? 0)}</span>
                  </div>
                  {openDesc === k && <div className="legend-desc">{DOMAIN_DESCS[k]}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — crisis + options */}
        <div className="crisis-right">
          <div className="crisis-card">
            <div className="eyebrow">KRİZ · {crisis.eyebrow}</div>
            <div className="body">{crisis.text}</div>
          </div>

          {!state.showFeedback && (
            <>
              <div className="options-list">
                {crisis.options.map((opt, i) => (
                  <button key={i} className="opt-btn" onClick={() => onChoose(crisis, opt)}>
                    <span className="opt-label">{opt.label}</span>
                    <span className="opt-hint">{opt.hint}</span>
                    {opt.csrGate && (
                      <span className={`opt-gate ${(state.domains.CSR ?? 0) >= opt.csrGate.threshold ? 'met' : 'unmet'}`}>
                        {(state.domains.CSR ?? 0) >= opt.csrGate.threshold ? '✓ devlet güveni yeterli' : '⊙ devlet güveni düşük'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <p className="kb-hint">1 / 2 / 3 seç · Enter devam</p>
            </>
          )}

          {state.showFeedback && (
            <div className="feedback-panel">
              <p className="fb-main">{state.lastFeedback}</p>
              {state.lastWhy && (
                <p className="fb-why">
                  <b>Neden böyle oldu?</b>{' '}{state.lastWhy.why}
                  {state.lastWhy.csrGate && <><br /><span style={{ color: 'var(--teal)' }}>+ {state.lastWhy.csrGate}</span></>}
                </p>
              )}
              {state.lastDeltas && (
                <div className="delta-row">
                  {Object.entries(state.lastDeltas).filter(([, v]) => v !== 0).map(([k, v]) => (
                    <span key={k} className={`delta-chip ${v > 0 ? 'up' : 'down'}`}>
                      {k} {v > 0 ? '+' : ''}{fmt(v)}
                    </span>
                  ))}
                </div>
              )}
              {state.lastLesson && (
                <div className={`lesson-flag ${state.lastLessonClass ?? ''}`}>{state.lastLesson}</div>
              )}
              <button className="btn btn-ghost" onClick={onContinue} style={{ display: 'block', width: '100%' }}>
                Devam Et
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Final Screen ────────────────────────────────────── */
function FinalScreen({ state, onReplay }) {
  const exclusion = ((state.domains?.CR ?? 0) + (state.domains?.JUS ?? 0)) / 2;
  const topArchetype = state.archetypeProbs?.[0];

  const learningItems = useMemo(() => {
    const L = state.lessons;
    const items = [];
    items.push(<p key="a"><b>Sosyal sözleşme tek bir şey değil.</b> Altı boyutu ayrı ayrı izledin — birini yönetmek diğerini yönetmek anlamına gelmedi.</p>);
    if (L.contextual?.length) items.push(<p key="b"><b>Bağlam belirleyici.</b> {L.contextual.length} kararında aynı politika, adanın koşulları yüzünden farklı sonuç verdi.</p>);
    if (L.coRaise?.length) items.push(<p key="c"><b>Sıfır toplamlı değil.</b> {L.coRaise.length} kez iki boyutu birden yükselttin — kimse bedel ödemeden.</p>);
    else items.push(<p key="c2">Sıfır toplamlı değil — ama bu oyunda o anı yakalayamadın. Başka bir adayla dene.</p>);
    if (L.tradeoff?.length) items.push(<p key="d"><b>Ödünleşimler gerçek.</b> {L.tradeoff.length} kararında bir boyutu güçlendirmek diğerine dokundu.</p>);
    if (L.echo?.length) items.push(<p key="e"><b>Kararların yankısı var.</b> {L.echo.length} kez ertelediğin mesele karşına çıktı.</p>);
    if (state.history?.length) {
      const last = state.history[state.history.length - 1];
      items.push(<p key="f"><b>Döngü kapanmadı.</b> Son kararın "{last.choice}". Her karar bir sonraki için zemin hazırlar.</p>);
    }
    return items;
  }, [state.lessons, state.history]);

  const exportJSON = () => {
    const d = { ada: state.island?.name, puan: state.resilience, arketip: state.archetype?.name, kararlar: state.history, finalDegerleri: state.domains };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' }));
    a.download = `archipelago-${state.island?.id}.json`;
    a.click();
  };

  const copyText = () => {
    const lines = [
      `ARCHIPELAGO — ${state.island?.name}`,
      `Direnç Puanı: ${state.resilience}`,
      `Arketip: ${state.archetype?.name}`,
      '',
      ...( state.history?.map(h => `  #${h.turn} ${h.crisis}: ${h.choice}`) ?? [])
    ];
    navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
  };

  return (
    <div>
      {/* Hero */}
      <div className="final-hero">
        <div className="score-label">Direnç Puanı</div>
        <div className="score">{state.resilience}</div>
        {state.island?.difficulty && (
          <div className="score-context">
            <DifficultyStars n={state.island.difficulty} /> zorluktaki <b>{state.island.name}</b>'nda
          </div>
        )}
      </div>

      {/* Radar */}
      <div className="radar-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'var(--s5)' }}>
        <RadarSVG values={state.domains ?? {}} prev={state.startDomains} color={state.island?.accent ?? '#7B6BB8'} size={200} />
        <p className="radar-legend-note">kesikli çizgi — başlangıç durumu</p>
        <div className="domain-shift-row">
          {DOMAIN_ORDER.map(k => {
            const from = state.startDomains?.[k] ?? 0, to = state.domains?.[k] ?? 0;
            const d = Math.round((to - from) * 10) / 10;
            return (
              <span key={k} className={`shift-chip ${d > 0 ? 'up' : d < 0 ? 'down' : ''}`}>
                {k} {fmt(from)}→{fmt(to)}{d !== 0 ? ` (${d > 0 ? '+' : ''}${fmt(d)})` : ''}
              </span>
            );
          })}
        </div>
      </div>

      {exclusion < 4 && (
        <div className="critical-note">
          <b>Eleştirel Not:</b> Uyum ve istikrar, dışlanan kesimlerin hakları ve adalet algısı pahasına inşa edildi. Görünürde sağlam bir sözleşme içeriden çürüyebilir.
        </div>
      )}

      {/* Two-col body */}
      <div className="final-body">
        <div>
          <div className="archetype-card">
            <div className="arch-split">baskın arketip · %{topArchetype?.pct}</div>
            <h3>{state.archetype?.name}</h3>
            <p>{state.archetype?.desc}</p>
            <div className="prob-bars">
              {state.archetypeProbs?.map(p => (
                <div key={p.name} className="prob-row">
                  <span className="prob-name">{p.name}</span>
                  <div className="prob-track"><div className="prob-fill" style={{ width: `${p.pct}%` }} /></div>
                  <span className="prob-pct">%{p.pct}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="history-card" style={{ marginTop: 'var(--s4)' }}>
            <h4>Kararların</h4>
            {state.history?.map(h => (
              <div key={h.turn} className="h-item">
                <span className="h-turn">#{h.turn}</span>
                <div className="h-main">
                  <strong>{h.crisis}</strong>
                  {h.choice}
                  <div className="h-deltas">
                    {Object.entries(h.deltas || {}).filter(([, v]) => v !== 0).map(([k, v]) => (
                      <span key={k} className={`delta-chip ${v > 0 ? 'up' : 'down'}`}>{k} {v > 0 ? '+' : ''}{fmt(v)}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="learning-card">
            <h4>Bu Oyunda Ne Yaşadın</h4>
            {learningItems}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="export-row">
        <button className="btn btn-secondary" onClick={copyText}>Panoya Kopyala</button>
        <button className="btn btn-secondary" onClick={exportJSON}>JSON İndir</button>
      </div>
      <div className="center">
        <button className="btn btn-primary" onClick={onReplay}>Yeniden Oyna</button>
      </div>
    </div>
  );
}

/* ── App ─────────────────────────────────────────────── */
export default function App() {
  const { state, startGame, choosePolicy, continueTurn, undo, replay } = useGameState();
  const { theme, toggle } = useTheme();
  const [screen, setScreen] = useState('onboard');

  useEffect(() => { setScreen(state.screen); }, [state.screen]);

  const restart = () => { replay(); setScreen('onboard'); };

  // keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (screen !== 'crisis') return;
      if (state.showFeedback) {
        if (e.key === 'Enter') continueTurn();
        return;
      }
      const crisis = state.crises?.[state.turn];
      if (!crisis) return;
      const i = parseInt(e.key) - 1;
      if (i >= 0 && i < crisis.options.length) choosePolicy(crisis, crisis.options[i]);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [screen, state.showFeedback, state.turn, state.crises, choosePolicy, continueTurn]);

  return (
    <>
      {/* Ambient background */}
      <div className="bg-ambient">
        <span /><span /><span />
      </div>

      {/* Theme toggle */}
      <button className="theme-toggle" onClick={toggle}>
        {theme === 'dark' ? '☀ Açık' : '☾ Koyu'}
      </button>

      {/* Restart to start */}
      {screen !== 'onboard' && (
        <button className="restart-toggle" onClick={restart}>⟲ Başa Dön</button>
      )}

      {/* Header */}
      <header className="app-header">
        <h1>ARCHIPELAGO</h1>
        <div className="divider" />
        <div className="subtitle">Sosyal Sözleşme Yönetim Oyunu</div>
      </header>

      {/* Screens */}
      {screen === 'onboard' && <OnboardScreen onNext={() => setScreen('select')} />}
      {screen === 'select'  && <SelectScreen onSelect={(isl) => startGame(isl)} />}
      {screen === 'crisis'  && <CrisisScreen state={state} onChoose={choosePolicy} onContinue={continueTurn} onUndo={undo} canUndo={state.past.length > 0} />}
      {screen === 'final'   && <FinalScreen state={state} onReplay={restart} />}
    </>
  );
}
