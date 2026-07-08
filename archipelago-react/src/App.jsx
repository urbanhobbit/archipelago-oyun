import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useGameState } from './hooks/useGameState';
import { DOMAIN_ORDER, DOMAIN_NAMES, DOMAIN_DESCS, ISLANDS, fmt } from './data/gameData';
import { Application, Graphics, Text } from 'pixi.js';

/* ===== PIXI STARFIELD ===== */
function Starfield() {
  const ref = useRef(null);
  useEffect(() => {
    let alive = true;
    const app = new Application();
    const init = async () => {
      await app.init({ background: 'transparent', width: window.innerWidth, height: window.innerHeight, antialias: true });
      if (!alive || !ref.current) { app.destroy(); return; }
      ref.current.appendChild(app.canvas);
      const stars = [];
      for (let i = 0; i < 150; i++) {
        const g = new Graphics();
        const r = .3 + Math.random() * 1.5;
        g.circle(0, 0, r);
        g.fill({ color: 0xc8bbdc, alpha: .3 + Math.random() * .5 });
        g.x = Math.random() * app.screen.width; g.y = Math.random() * app.screen.height;
        g.vx = -.3 + Math.random() * .6; g.vy = -.2 + Math.random() * .4;
        app.stage.addChild(g);
        stars.push(g);
      }
      const W = app.screen.width, H = app.screen.height;
      app.ticker.add(() => {
        stars.forEach(s => {
          s.x += s.vx; s.y += s.vy;
          if (s.x < -10) s.x = W + 10; if (s.x > W + 10) s.x = -10;
          if (s.y < -10) s.y = H + 10; if (s.y > H + 10) s.y = -10;
        });
      });
    };
    init();
    return () => { alive = false; try { app.destroy(false, { children: true }); } catch(e) {} };
  }, []);
  return <div ref={ref} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

/* ===== RADAR CHART (PIXI) ===== */
function RadarChart({ values, color, size = 240, labelColor = '#12202E' }) {
  const ref = useRef(null);
  const cx = size / 2, cy = size / 2, maxR = size * .42;

  useEffect(() => {
    let alive = true;
    const app = new Application();
    const init = async () => {
      await app.init({ width: size, height: size, background: 'transparent', antialias: true });
      if (!alive || !ref.current) { app.destroy(); return; }
      ref.current.innerHTML = '';
      ref.current.appendChild(app.canvas);
      const g = new Graphics();

      // grid
      [.2, .4, .6, .8, 1].forEach(f => {
        const pts = [];
        DOMAIN_ORDER.forEach((_, i) => {
          const a = (-90 + i * 60) * Math.PI / 180;
          pts.push({ x: cx + maxR * f * Math.cos(a), y: cy + maxR * f * Math.sin(a) });
        });
        g.poly(pts.map(p => [p.x, p.y]).flat());
        g.stroke({ width: .5, color: 0x12202E, alpha: f === 1 ? .15 : .08 });
      });

      // axes
      DOMAIN_ORDER.forEach((_, i) => {
        const a = (-90 + i * 60) * Math.PI / 180;
        g.moveTo(cx, cy);
        g.lineTo(cx + maxR * Math.cos(a), cy + maxR * Math.sin(a));
        g.stroke({ width: .5, color: 0x12202E, alpha: .08 });
      });

      // data polygon
      const hex = parseInt(color.replace('#', ''), 16);
      const dpts = [];
      DOMAIN_ORDER.forEach((_, i) => {
        const a = (-90 + i * 60) * Math.PI / 180;
        const v = Math.max(0, Math.min(10, values[DOMAIN_ORDER[i]] || 0));
        dpts.push({ x: cx + maxR * (v / 10) * Math.cos(a), y: cy + maxR * (v / 10) * Math.sin(a) });
      });
      g.poly(dpts.map(p => [p.x, p.y]).flat());
      g.fill({ color: hex, alpha: .2 });
      g.stroke({ width: 2, color: hex, alpha: .7 });

      // labels
      const labelStyle = { fontSize: 10, fontFamily: 'SFMono-Regular, Consolas, monospace', fill: labelColor, fontWeight: '700' };
      const labelPos = [
        { x: cx, y: 10, anchor: .5 }, { x: cx + maxR + 18, y: cy - 4, anchor: 0 },
        { x: cx + maxR + 18, y: cy + 8, anchor: 0 }, { x: cx, y: cy + maxR + 22, anchor: .5 },
        { x: cx - maxR - 18, y: cy + 8, anchor: 1 }, { x: cx - maxR - 18, y: cy - 4, anchor: 1 }
      ];
      DOMAIN_ORDER.forEach((k, i) => {
        const lp = labelPos[i];
        const t = new Text({ text: k, style: labelStyle });
        t.anchor = { x: typeof lp.anchor === 'number' ? lp.anchor : .5, y: .5 };
        t.x = lp.x; t.y = lp.y;
        app.stage.addChild(t);
      });

      // center dot
      g.circle(cx, cy, 3);
      g.fill({ color: hex, alpha: .8 });

      app.stage.addChild(g);
    };
    init();
    return () => { alive = false; try { app.destroy(false, { children: true }); } catch(e) {} };
  }, [values, color, size, labelColor]);

  return <div ref={ref} style={{ width: size, height: size }} />;
}

/* ===== ONBOARD SCREEN ===== */
function OnboardScreen({ onStart }) {
  return (
    <div>
      <header className="title">
        <h1>ARCHIPELAGO</h1>
        <div className="rule" />
        <p>bir sosyal sözleşme yönetim oyunu</p>
        <div className="comic-divider">§ o o o §</div>
      </header>
      <div className="domain-grid">
        {DOMAIN_ORDER.map(k => (
          <div className="domain-chip" key={k}>
            <span className="code">{k}</span>
            <h4>{DOMAIN_NAMES[k]}</h4>
            <p>{DOMAIN_DESCS[k]}</p>
          </div>
        ))}
      </div>
      <p className="prose">Her toplum altı boyutlu kırılgan bir denge üzerinde durur. <b>Bir ada seç, dört krizi yönet, sözleşmeni inşa et.</b></p>
      <div className="center mt-24">
        <button className="btn-ghost" onClick={onStart}>ADALARI GÖR</button>
      </div>
    </div>
  );
}

/* ===== SELECT SCREEN ===== */
function SelectScreen({ onSelect }) {
  return (
    <div>
      <header className="title">
        <h1>ARCHIPELAGO</h1>
        <p style={{ marginBottom: 4 }}>bir ada seç</p>
        <div className="comic-divider">§ o o o §</div>
      </header>
      <div className="island-grid">
        {ISLANDS.map(isl => (
          <div className="island-card" key={isl.id} onClick={() => onSelect(isl)}>
            <div className="accent-bar" style={{ background: isl.accent }} />
            <h3>{isl.name}</h3>
            <p className="tag">{isl.tag}</p>
            {DOMAIN_ORDER.map(k => (
              <div className="bar-row" key={k}>
                <span className="k">{k}</span>
                <span className="track"><span className="fill" style={{ width: (isl.domains[k] || 0) * 10 + '%', background: isl.accent }} /></span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="center mt-16">
        <button className="btn-ghost" onClick={() => onSelect(ISLANDS[Math.floor(Math.random() * ISLANDS.length)])}>rastgele bir ada seç</button>
      </div>
    </div>
  );
}

/* ===== CRISIS SCREEN ===== */
function CrisisScreen({ state, onChoose, onContinue }) {
  const crisis = state.crises[state.turn];
  const fragile = DOMAIN_ORDER.filter(k => (state.domains[k] || 0) < 3);

  return (
    <div>
      <div className="topbar">
        <div>
          <p className="label">ada</p>
          <p className="value">{state.island?.name}</p>
        </div>
        <div className="right">
          <p className="label">kriz</p>
          <p className="value">{state.turn + 1} / {state.crises.length}</p>
        </div>
      </div>

      {/* Echo */}
      {state.pendingEchoes.length > 0 && (
        <div className="echo-banner">
          <span className="eyebrow" style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>geçmişin yankısı</span>
          {state.pendingEchoes.map((e, i) => <div key={i}>{e.text}</div>)}
        </div>
      )}

      {/* Fragility */}
      {fragile.length > 0 && (
        <div className="frag-banner">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--terracotta)', display: 'block', marginBottom: 4 }}>⚠ kırılganlık uyarısı</span>
          {fragile.map(k => `${DOMAIN_NAMES[k]} (${k}: ${fmt(state.domains[k])})`).join(', ')} — kritik eşiğin altında.
        </div>
      )}

      {/* Radar + Legend */}
      <div className="radar-wrap">
        <RadarChart values={state.domains} color={state.island?.accent || '#5B4B8A'} />
        <div className="legend">
          {DOMAIN_ORDER.map(k => (
            <div key={k}>
              <div className={`row${(state.domains[k] || 0) < 3 ? ' fragile' : ''}`} onClick={e => e.currentTarget.classList.toggle('open')}>
                <span><b>{k}</b> · {DOMAIN_NAMES[k]}</span>
                <span className="val">{fmt(state.domains[k] || 0)}</span>
              </div>
              <div className="desc">{DOMAIN_DESCS[k]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Crisis text */}
      <div className="crisis-card">
        <div className="eyebrow">KRİZ · {crisis.eyebrow}</div>
        <div className="body">{crisis.text}</div>
      </div>

      {/* Options */}
      {!state.showFeedback && (
        <>
          <div className="options">
            {crisis.options.map((opt, i) => (
              <button className="opt-btn" key={i} onClick={() => onChoose(crisis, opt)}>
                <span>{opt.label}</span>
                <span className="hint">{opt.hint}</span>
                {opt.csrGate && (
                  <span className={`csr-gate ${(state.domains.CSR || 0) >= opt.csrGate.threshold ? 'met' : 'unmet'}`}>
                    {(state.domains.CSR || 0) >= opt.csrGate.threshold ? '✓ devlet güveni yeterli' : '⊙ devlet güveni düşük'}
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="kb-hint">kısayol: 1 2 3 seç · Enter devam</p>
        </>
      )}

      {/* Feedback */}
      {state.showFeedback && (
        <div className="feedback-box">
          <p className="main">{state.lastFeedback}</p>
          {state.lastWhy && (
            <p className="why">
              <b>Neden böyle oldu?</b> {state.lastWhy.why}
              {state.lastWhy.csrGate && <br />}
              {state.lastWhy.csrGate && <span style={{ color: 'var(--teal)' }}>+ {state.lastWhy.csrGate}</span>}
            </p>
          )}
          {state.lastDeltas && (
            <div className="deltas">
              {Object.keys(state.lastDeltas).filter(k => state.lastDeltas[k] !== 0).map(k => (
                <span key={k} className={state.lastDeltas[k] > 0 ? 'up' : 'down'}>
                  {k} {state.lastDeltas[k] > 0 ? '+' : ''}{fmt(state.lastDeltas[k])}
                </span>
              ))}
            </div>
          )}
          {state.lastLesson && (
            <span className={`lesson-flag${state.lastLessonClass ? ' ' + state.lastLessonClass : ''}`}>{state.lastLesson}</span>
          )}
          <div className="center">
            <button className="btn-ghost" onClick={onContinue}>devam et</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== FINAL SCREEN ===== */
function FinalScreen({ state, onReplay, onExport }) {
  const exclusion = ((state.domains?.CR || 0) + (state.domains?.JUS || 0)) / 2;
  const parts = useMemo(() => {
    const p = [];
    p.push(<p key="a"><b>Sosyal sözleşme tek bir şey değil.</b> Altı boyutu ayrı ayrı izledin — birini yönetmek diğerini yönetmek anlamına gelmedi.</p>);
    if (state.lessons.contextual.length) p.push(<p key="b"><b>Bağlam belirleyici.</b> {state.lessons.contextual.length} kararında aynı politika adanın koşulları yüzünden farklı sonuç verdi.</p>);
    if (state.lessons.coRaise.length) p.push(<p key="c"><b>Sıfır toplamlı değil.</b> {state.lessons.coRaise.length} kez iki boyutu birden yükselttin.</p>);
    if (state.lessons.tradeoff.length) p.push(<p key="d"><b>Ödünleşimler gerçek.</b> {state.lessons.tradeoff.length} kararında bir boyutu güçlendirmek bir başkasına dokundu.</p>);
    if (state.lessons.echo.length) p.push(<p key="e"><b>Kararların yankısı var.</b> {state.lessons.echo.length} kez ertelediğin mesele karşına çıktı.</p>);
    if (state.history.length) {
      const last = state.history[state.history.length - 1];
      p.push(<p key="f"><b>Döngü kapanmadı.</b> Son kararın "{last.choice}" — her karar bir sonraki için zemin hazırlar.</p>);
    }
    return p;
  }, [state]);

  const exportData = () => {
    const d = {
      ada: state.island?.name,
      direncPuani: state.resilience,
      arketip: state.archetype?.name,
      arketipOrani: state.archetypeSplit,
      finalDegerleri: state.domains,
      kararlar: state.history
    };
    const blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `archipelago-${state.island?.id}-${Date.now()}.json`;
    a.click();
  };

  return (
    <div>
      <div className="final-hero">
        <p className="score-label">— direnç puanı —</p>
        <p className="score">{state.resilience}</p>
      </div>

      <div className="radar-wrap" style={{ justifyContent: 'center' }}>
        <RadarChart values={state.domains} color={state.island?.accent || '#5B4B8A'} size={300} />
      </div>

      <div className="final-legend">
        <span><i style={{ background: state.island?.accent }} />final</span>
        <span><i style={{ background: '#DEAE53' }} />ideal (7)</span>
      </div>

      {exclusion < 4 && (
        <div className="critical-note">
          <b>Eleştirel not:</b> Uyum ve istikrar, dışlanan kesimlerin hakları pahasına inşa edildi. Görünürde sağlam bir sözleşme içeriden çürüyebilir.
        </div>
      )}

      <div className="archetype-card">
        <div className="split">{state.archetypeSplit}</div>
        <h3>{state.archetype?.name}</h3>
        <p>{state.archetype?.desc}</p>
      </div>

      <div className="history-panel">
        <div className="h-label">kararların</div>
        {state.history.map(h => (
          <div className="h-item" key={h.turn}>
            <span className="h-turn">#{h.turn}</span>
            <span><strong>{h.crisis}</strong><br />{h.choice}</span>
          </div>
        ))}
      </div>

      <div className="learning-card">
        <h4>bu oyunda ne yaşadın</h4>
        {parts}
      </div>

      <div className="center" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
        <button className="btn-small" onClick={exportData}>⬇ özeti indir (JSON)</button>
      </div>
      <div className="center">
        <button className="btn-ghost" onClick={onReplay}>yeniden oyna</button>
      </div>
    </div>
  );
}

/* ===== APP ===== */
export default function App() {
  const { state, startGame, choosePolicy, continueTurn, replay } = useGameState();
  const [screen, setScreen] = useState('onboard');

  useEffect(() => { setScreen(state.screen); }, [state.screen]);

  useEffect(() => {
    const onKey = (e) => {
      if (screen === 'crisis') {
        if (e.key === 'Enter' && state.showFeedback) continueTurn();
        if (!state.showFeedback) {
          const crisis = state.crises[state.turn];
          const idx = parseInt(e.key) - 1;
          if (idx >= 0 && idx < crisis.options.length) choosePolicy(crisis, crisis.options[idx]);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, state.showFeedback, state.turn, state.crises, choosePolicy, continueTurn]);

  return (
    <>
      {createPortal(<Starfield />, document.body)}
      {screen === 'onboard' && <OnboardScreen onStart={() => { setScreen('select'); }} />}
      {screen === 'select' && <SelectScreen onSelect={(isl) => { startGame(isl); }} />}
      {screen === 'crisis' && <CrisisScreen state={state} onChoose={choosePolicy} onContinue={continueTurn} />}
      {screen === 'final' && <FinalScreen state={state} onReplay={() => { replay(); }} />}
    </>
  );
}
