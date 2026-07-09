import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useGameState } from './hooks/useGameState';
import { tx } from './i18n/tx';
import { DOMAIN_ORDER, DOMAIN_NAMES, DOMAIN_DESCS, DOMAIN_DETAILS, ISLANDS, fmt } from './data/gameData';

/* ── locale ─────────────────────────────────────────── */
function useLocale() {
  const { i18n } = useTranslation();
  const locale = i18n.language?.startsWith('en') ? 'en' : 'tr';
  const setLocale = useCallback((l) => i18n.changeLanguage(l), [i18n]);
  return { locale, setLocale };
}

/* ── CO3 brand marks ────────────────────────────────── */
function CO3Mark({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="9" cy="9" r="6" fill="none" stroke="var(--co3-pink)" strokeWidth="2.5" />
      <circle cx="15" cy="15" r="6" fill="none" stroke="var(--co3-orange)" strokeWidth="2.5" />
    </svg>
  );
}

function EUFlag({ className }) {
  const { t } = useTranslation();
  const stars = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 - 90) * Math.PI / 180;
    return { x: 12 + 7 * Math.cos(a), y: 8 + 7 * Math.sin(a) };
  });
  return (
    <svg viewBox="0 0 24 16" className={className} role="img" aria-label={t('app.euFlagAlt')}>
      <rect width="24" height="16" fill="#003399" />
      {stars.map((s, i) => (
        <text key={i} x={s.x} y={s.y} fontSize="3" fill="#FFCC00" textAnchor="middle" dominantBaseline="middle">★</text>
      ))}
    </svg>
  );
}

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
  const { t } = useTranslation();
  const { locale } = useLocale();
  const detail = DOMAIN_DETAILS[code];
  const name = tx(DOMAIN_NAMES[code], locale);
  return (
    <button
      className={`domain-chip${flipped ? ' flipped' : ''}`}
      onClick={() => setFlipped(f => !f)}
      aria-label={t('domainCard.ariaLabel', { name })}
    >
      <div className="flip-inner">
        {/* Front */}
        <div className="flip-face flip-front">
          <span className="code">{code}</span>
          <h4>{name}</h4>
          <p>{tx(DOMAIN_DESCS[code], locale)}</p>
          <span className="flip-hint">{t('domainCard.flipHint')}</span>
        </div>
        {/* Back */}
        <div className="flip-face flip-back">
          <p className="fb-theory">{tx(detail.theory, locale)}</p>
          <p className="fb-desc">{tx(detail.deep, locale)}</p>
          <span className="fb-sub">{t('domainCard.subdomainsLabel')}</span>
          <ul>{tx(detail.subdomains, locale).map(s => <li key={s}>{s}</li>)}</ul>
          <p className="fb-game">{tx(detail.gameNote, locale)}</p>
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
  const { t } = useTranslation();
  return (
    <div>
      <p className="onboard-prose">
        <Trans i18nKey="onboard.intro" components={{ b: <b /> }} />
      </p>

      <div className="domain-grid">
        {DOMAIN_ORDER.map(k => <DomainFlipCard key={k} code={k} />)}
      </div>

      <p className="onboard-prose" style={{ fontSize: 13, marginBottom: 0 }}>
        <Trans i18nKey="onboard.goal" components={{ b: <b /> }} />
      </p>

      <div className="center mt-8">
        <button className="btn btn-primary" onClick={onNext}>{t('onboard.next')}</button>
      </div>
    </div>
  );
}

/* ── Difficulty Stars ──────────────────────────────────── */
function DifficultyStars({ n }) {
  const { t } = useTranslation();
  return (
    <span className="difficulty-stars" title={t('difficulty.title', { n })}>
      {'★'.repeat(n)}<span className="empty">{'★'.repeat(5 - n)}</span>
    </span>
  );
}

/* ── Island Flip Card ──────────────────────────────────── */
function IslandFlipCard({ isl, index, onSelect }) {
  const [flipped, setFlipped] = useState(false);
  const { t } = useTranslation();
  const { locale } = useLocale();
  const name = tx(isl.name, locale);
  return (
    <div
      className={`island-card${flipped ? ' flipped' : ''}`}
      role="button"
      tabIndex={0}
      onClick={() => setFlipped(f => !f)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped(f => !f); } }}
      style={{ '--accent-color': isl.accent, animationDelay: `${index * 60}ms` }}
      aria-label={t('island.ariaLabel', { name })}
    >
      <div className="flip-inner">
        {/* Front */}
        <div className="flip-face flip-front">
          <div className="accent-line" style={{ background: isl.accent }} />
          <div className="island-card-head">
            <h3>{name}</h3>
            <DifficultyStars n={isl.difficulty} />
          </div>
          <p className="tag">{tx(isl.tag, locale)}</p>
          <div className="island-radar-wrap">
            <RadarSVG values={isl.domains} color={isl.accent} size={132} />
          </div>
          <div className="island-values">
            {DOMAIN_ORDER.map(k => (
              <span key={k} className="iv-chip"><b>{k}</b> {fmt(isl.domains[k] ?? 0)}</span>
            ))}
          </div>
          <span className="flip-hint">{t('island.flipHint')}</span>
        </div>

        {/* Back */}
        <div className="flip-face flip-back">
          <h3>{name}</h3>
          <p className="ib-detail">{tx(isl.detail, locale)}</p>
          <span className="ib-label">{t('island.strengths')}</span>
          <ul className="ib-list strengths">{tx(isl.strengths, locale).map(s => <li key={s}>{s}</li>)}</ul>
          <span className="ib-label">{t('island.risks')}</span>
          <ul className="ib-list risks">{tx(isl.risks, locale).map(s => <li key={s}>{s}</li>)}</ul>
          <button
            className="btn btn-primary island-select-btn"
            onClick={e => { e.stopPropagation(); onSelect(isl); }}
          >
            {t('island.select')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Island Select ───────────────────────────────────── */
function SelectScreen({ onSelect }) {
  const { t } = useTranslation();
  return (
    <div>
      <p className="select-intro">{t('select.intro')}</p>
      <div className="island-grid">
        {ISLANDS.map((isl, i) => (
          <IslandFlipCard key={isl.id} isl={isl} index={i} onSelect={onSelect} />
        ))}
      </div>
      <div className="center">
        <button className="btn btn-ghost" onClick={() => onSelect(ISLANDS[Math.floor(Math.random() * ISLANDS.length)])}>
          {t('select.random')}
        </button>
      </div>
    </div>
  );
}

/* ── Crisis Screen ───────────────────────────────────── */
function CrisisScreen({ state, onChoose, onContinue, onUndo, canUndo }) {
  const crisis = state.crises[state.turn];
  const { t } = useTranslation();
  const { locale } = useLocale();
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
          <div className="label">{t('crisis.islandLabel')}</div>
          <div className="value">{tx(state.island?.name, locale)}</div>
          {state.island?.difficulty && <DifficultyStars n={state.island.difficulty} />}
        </div>
        <div className="topbar-right">
          <div className="label" style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-3)', textAlign: 'right' }}>{t('crisis.progress', { n: state.turn + 1, total: state.crises.length })}</div>
          <div className="progress-dots" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
            {state.crises.map((_, i) => (
              <div key={i} className={`progress-dot${i < state.turn ? ' done' : ''}`} />
            ))}
          </div>
          <button className="btn btn-ghost undo-btn" onClick={onUndo} disabled={!canUndo}>
            {t('crisis.undo')}
          </button>
        </div>
      </div>

      {/* Echoes */}
      {state.pendingEchoes?.length > 0 && (
        <div className="echo-banner">
          <span className="echo-label">{t('crisis.echoLabel')}</span>
          {state.pendingEchoes.map((e, i) => <div key={i}>{tx(e.text, locale)}</div>)}
        </div>
      )}

      {/* Fragility */}
      {fragile.length > 0 && (
        <div className="frag-banner">
          <span className="fb-label">{t('crisis.fragilityWarning')}</span>
          {fragile.map(k => `${tx(DOMAIN_NAMES[k], locale)} (${k}: ${fmt(state.domains[k])})`).join(' · ')} — {t('crisis.fragilityBelow')}
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
                    <span className="lname">{tx(DOMAIN_NAMES[k], locale)}</span>
                    <span className="lval">{fmt(state.domains[k] ?? 0)}</span>
                  </div>
                  {openDesc === k && <div className="legend-desc">{tx(DOMAIN_DESCS[k], locale)}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — crisis + options */}
        <div className="crisis-right">
          <div className="crisis-card">
            <div className="eyebrow">{t('crisis.eyebrowPrefix')}{tx(crisis.eyebrow, locale)}</div>
            <div className="body">{tx(crisis.text, locale)}</div>
          </div>

          {!state.showFeedback && (
            <>
              <div className="options-list">
                {crisis.options.map((opt, i) => (
                  <button key={i} className="opt-btn" onClick={() => onChoose(crisis, opt)}>
                    <span className="opt-label">{tx(opt.label, locale)}</span>
                    <span className="opt-hint">{tx(opt.hint, locale)}</span>
                    {opt.csrGate && (
                      <span className={`opt-gate ${(state.domains.CSR ?? 0) >= opt.csrGate.threshold ? 'met' : 'unmet'}`}>
                        {(state.domains.CSR ?? 0) >= opt.csrGate.threshold ? t('crisis.gateMet') : t('crisis.gateUnmet')}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <p className="kb-hint">{t('crisis.keyboardHint')}</p>
            </>
          )}

          {state.showFeedback && (
            <div className="feedback-panel">
              <p className="fb-main">{tx(state.lastFeedback, locale)}</p>
              {state.lastWhy && (
                <p className="fb-why">
                  <b>{t('crisis.whyLabel')}</b>{' '}{tx(state.lastWhy.why, locale)}
                  {state.lastWhy.csrGate && <><br /><span style={{ color: 'var(--teal)' }}>+ {tx(state.lastWhy.csrGate, locale)}</span></>}
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
              {state.lastLessonKey && (
                <div className={`lesson-flag ${state.lastLessonClass ?? ''}`}>{t(`lesson.${state.lastLessonKey}`)}</div>
              )}
              <button className="btn btn-ghost" onClick={onContinue} style={{ display: 'block', width: '100%' }}>
                {t('crisis.continue')}
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
  const { t } = useTranslation();
  const { locale } = useLocale();
  const exclusion = ((state.domains?.CR ?? 0) + (state.domains?.JUS ?? 0)) / 2;
  const topArchetype = state.archetypeProbs?.[0];
  const islandName = tx(state.island?.name, locale);
  const archetypeName = tx(state.archetype?.name, locale);
  const archetypeDesc = tx(state.archetype?.desc, locale);

  const learningItems = useMemo(() => {
    const L = state.lessons;
    const items = [];
    items.push(<p key="a"><Trans i18nKey="learning.a" components={{ b: <b /> }} /></p>);
    if (L.contextual?.length) items.push(<p key="b"><Trans i18nKey="learning.b" values={{ count: L.contextual.length }} components={{ b: <b /> }} /></p>);
    if (L.coRaise?.length) items.push(<p key="c"><Trans i18nKey="learning.c" values={{ count: L.coRaise.length }} components={{ b: <b /> }} /></p>);
    else items.push(<p key="c2">{t('learning.c2')}</p>);
    if (L.tradeoff?.length) items.push(<p key="d"><Trans i18nKey="learning.d" values={{ count: L.tradeoff.length }} components={{ b: <b /> }} /></p>);
    if (L.echo?.length) items.push(<p key="e"><Trans i18nKey="learning.e" values={{ count: L.echo.length }} components={{ b: <b /> }} /></p>);
    if (state.history?.length) {
      const last = state.history[state.history.length - 1];
      items.push(<p key="f"><Trans i18nKey="learning.f" values={{ choice: tx(last.choice, locale) }} components={{ b: <b /> }} /></p>);
    }
    return items;
  }, [state.lessons, state.history, locale, t]);

  const exportJSON = () => {
    const d = {
      island: islandName,
      score: state.resilience,
      archetype: archetypeName,
      decisions: state.history?.map(h => ({ turn: h.turn, crisis: tx(h.crisis, locale), choice: tx(h.choice, locale), deltas: h.deltas })),
      finalValues: state.domains
    };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' }));
    a.download = `archipelago-${state.island?.id}.json`;
    a.click();
  };

  const copyText = () => {
    const lines = [
      `ARCHIPELAGO — ${islandName}`,
      `${t('final.exportScoreLabel')} ${state.resilience}`,
      `${t('final.exportArchetypeLabel')} ${archetypeName}`,
      '',
      ...(state.history?.map(h => `  #${h.turn} ${tx(h.crisis, locale)}: ${tx(h.choice, locale)}`) ?? [])
    ];
    navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
  };

  return (
    <div>
      {/* Hero */}
      <div className="final-hero">
        <div className="score-label">{t('final.scoreLabel')}</div>
        <div className="score">{state.resilience}</div>
        {state.island?.difficulty && (
          <div className="score-context">
            <DifficultyStars n={state.island.difficulty} /> <Trans i18nKey="final.scoreContext" values={{ name: islandName }} components={{ b: <b /> }} />
          </div>
        )}
      </div>

      {/* Radar */}
      <div className="radar-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'var(--s5)' }}>
        <RadarSVG values={state.domains ?? {}} prev={state.startDomains} color={state.island?.accent ?? '#7B6BB8'} size={200} />
        <p className="radar-legend-note">{t('final.radarNote')}</p>
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
          <b>{t('final.criticalNoteLabel')}</b> {t('final.criticalNote')}
        </div>
      )}

      {/* Two-col body */}
      <div className="final-body">
        <div>
          <div className="archetype-card">
            <div className="arch-split">{t('final.dominantArchetype', { pct: topArchetype?.pct })}</div>
            <h3>{archetypeName}</h3>
            <p>{archetypeDesc}</p>
            <div className="prob-bars">
              {state.archetypeProbs?.map((p, i) => (
                <div key={i} className="prob-row">
                  <span className="prob-name">{tx(p.name, locale)}</span>
                  <div className="prob-track"><div className="prob-fill" style={{ width: `${p.pct}%` }} /></div>
                  <span className="prob-pct">{t('common.percent', { n: p.pct })}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="history-card" style={{ marginTop: 'var(--s4)' }}>
            <h4>{t('final.decisionsTitle')}</h4>
            {state.history?.map(h => (
              <div key={h.turn} className="h-item">
                <span className="h-turn">#{h.turn}</span>
                <div className="h-main">
                  <strong>{tx(h.crisis, locale)}</strong>
                  {tx(h.choice, locale)}
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
            <h4>{t('final.learningTitle')}</h4>
            {learningItems}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="export-row">
        <button className="btn btn-secondary" onClick={copyText}>{t('final.copy')}</button>
        <button className="btn btn-secondary" onClick={exportJSON}>{t('final.download')}</button>
      </div>
      <div className="center">
        <button className="btn btn-primary" onClick={onReplay}>{t('final.replay')}</button>
      </div>
    </div>
  );
}

/* ── App ─────────────────────────────────────────────── */
export default function App() {
  const { state, startGame, choosePolicy, continueTurn, undo, replay } = useGameState();
  const { theme, toggle } = useTheme();
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
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

      {/* Theme + language toggle */}
      <div className="top-controls">
        <button className="lang-toggle" onClick={() => setLocale(locale === 'tr' ? 'en' : 'tr')}>
          {locale === 'tr' ? 'EN' : 'TR'}
        </button>
        <button className="theme-toggle" onClick={toggle}>
          {theme === 'dark' ? t('app.themeLight') : t('app.themeDark')}
        </button>
      </div>

      {/* Restart to start */}
      {screen !== 'onboard' && (
        <button className="restart-toggle" onClick={restart}>{t('app.restart')}</button>
      )}

      {/* Header */}
      <header className="app-header">
        <h1>{t('app.title')}</h1>
        <div className="divider" />
        <div className="subtitle">{t('app.subtitle')}</div>
        <a className="co3-badge" href="https://www.co3socialcontract.eu/" target="_blank" rel="noopener noreferrer">
          <CO3Mark className="co3-mark" /> {t('app.co3Badge')}
        </a>
      </header>

      {/* Screens */}
      {screen === 'onboard' && <OnboardScreen onNext={() => setScreen('select')} />}
      {screen === 'select'  && <SelectScreen onSelect={(isl) => startGame(isl)} />}
      {screen === 'crisis'  && <CrisisScreen state={state} onChoose={choosePolicy} onContinue={continueTurn} onUndo={undo} canUndo={state.past.length > 0} />}
      {screen === 'final'   && <FinalScreen state={state} onReplay={restart} />}

      {/* Footer */}
      <footer className="site-footer">
        <EUFlag className="eu-flag" />
        <p>
          <Trans i18nKey="app.footer" components={{ a: <a href="https://www.co3socialcontract.eu/" target="_blank" rel="noopener noreferrer" /> }} />
        </p>
      </footer>
    </>
  );
}
