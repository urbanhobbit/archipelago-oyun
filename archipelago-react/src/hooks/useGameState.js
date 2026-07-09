import { useReducer, useCallback } from 'react';
import { IDEAL, DOMAIN_ORDER, CRISES, shuffle, ARCHETYPES } from '../data/gameData';

function calcResilience(domains, startDomains) {
  const startAvg = DOMAIN_ORDER.reduce((s,k)=>s+Math.abs(startDomains[k]-IDEAL[k]),0)/6;
  const finalAvg = DOMAIN_ORDER.reduce((s,k)=>s+Math.abs(domains[k]-IDEAL[k]),0)/6;
  const absolute = Math.max(0, 100*(1-finalAvg/7));
  const improvement = startAvg>0 ? (startAvg-finalAvg)/startAvg : 0;
  const capped = Math.max(0, Math.min(1, improvement));
  return Math.max(0, Math.min(100, Math.round(0.65*absolute + 0.35*capped*100)));
}

const initialState = {
  screen: 'onboard',
  island: null,
  domains: null,
  startDomains: null,
  turn: 0,
  crises: [],
  axis: {p:0,i:0,j:0},
  pendingEchoes: [],
  lessons: {contextual:[],coRaise:[],tradeoff:[],echo:[]},
  history: [],
  showFeedback: false,
  lastFeedback: null,
  lastDeltas: null,
  lastWhy: null,
  lastCsrGate: null,
  lastLesson: null,
  lastLessonClass: '',
  resilience: 0,
  archetype: null,
  archetypeSplit: '',
  past: []
};

function reducer(state, action) {
  switch (action.type) {
    case 'START_GAME': {
      const crises = shuffle(CRISES).slice(0, 4);
      return {
        ...initialState,
        screen: 'crisis',
        island: action.island,
        domains: {...action.island.domains},
        startDomains: {...action.island.domains},
        crises,
        turn: 0,
        axis: {p:0,i:0,j:0}
      };
    }

    case 'CHOOSE_POLICY': {
      const { crisis, opt } = action;
      const domains = {...state.domains};
      const allDeltas = {};

      Object.keys(opt.deltas||{}).forEach(k => {
        domains[k] = (domains[k]||0) + opt.deltas[k];
        allDeltas[k] = opt.deltas[k];
      });

      let whyText = '';
      if (opt.conditional) {
        const c = opt.conditional;
        const above = (state.domains[c.domain]||0) >= c.threshold;
        const applied = above ? c.above : c.below;
        domains[applied.domain] = (domains[applied.domain]||0) + applied.delta;
        allDeltas[applied.domain] = (allDeltas[applied.domain]||0) + applied.delta;
        whyText = applied.why;
      }

      let csrGateNote = '';
      if (opt.csrGate && (domains.CSR||0) >= opt.csrGate.threshold) {
        const g = opt.csrGate;
        domains[g.bonus.domain] = (domains[g.bonus.domain]||0) + g.bonus.delta;
        allDeltas[g.bonus.domain] = (allDeltas[g.bonus.domain]||0) + g.bonus.delta;
        csrGateNote = g.bonus.msg;
      }

      DOMAIN_ORDER.forEach(k => { domains[k] = Math.max(0, Math.min(10, domains[k]||0)); });

      const ups = Object.keys(allDeltas).filter(k=>allDeltas[k]>0);
      const downs = Object.keys(allDeltas).filter(k=>allDeltas[k]<0);
      let lessonFlag = '', lessonClass = '';
      if (ups.length>=2 && downs.length===0) {
        lessonFlag = '✦ sıfır toplamlı değil: iki boyut birlikte yükseldi';
        lessonClass = 'win';
      } else if (ups.length>=1 && downs.length>=1) {
        lessonFlag = 'ödünleşim: bir boyutu güçlendirmek bir başkasına dokundu';
      }

      const newAxis = {...state.axis};
      newAxis.p += opt.axis?.p || 0;
      newAxis.i += opt.axis?.i || 0;
      newAxis.j += opt.axis?.j || 0;

      const newEchoes = [...state.pendingEchoes];
      if (opt.echo) newEchoes.push(opt.echo);

      return {
        ...state,
        domains,
        axis: newAxis,
        pendingEchoes: newEchoes,
        history: [...state.history, {turn:state.turn+1, crisis:crisis.eyebrow, choice:opt.label, deltas:{...allDeltas}}],
        showFeedback: true,
        lastFeedback: opt.feedback,
        lastDeltas: allDeltas,
        lastWhy: whyText || csrGateNote ? {why:whyText, csrGate:csrGateNote} : null,
        lastLesson: lessonFlag || null,
        lastLessonClass: lessonClass,
        past: [...state.past, state]
      };
    }

    case 'CONTINUE': {
      // process echoes
      let domains = {...state.domains};
      const echoes = [...state.pendingEchoes];
      if (echoes.length) {
        const combinedDeltas = {};
        const texts = [];
        while (echoes.length) {
          const echo = echoes.shift();
          Object.keys(echo.deltas).forEach(k => {
            if (combinedDeltas[k] !== undefined) {
              combinedDeltas[k] = Math.abs(echo.deltas[k]) > Math.abs(combinedDeltas[k]) ? echo.deltas[k] : combinedDeltas[k];
            } else {
              combinedDeltas[k] = echo.deltas[k];
            }
          });
          texts.push(echo.text);
        }
        Object.keys(combinedDeltas).forEach(k => { domains[k] = Math.max(0, Math.min(10, (domains[k]||0) + combinedDeltas[k])); });
      }

      const nextTurn = state.turn + 1;
      if (nextTurn >= state.crises.length) {
        const n = state.crises.length;
        const avg = {p:state.axis.p/n, i:state.axis.i/n, j:state.axis.j/n};
        const dist = ARCHETYPES.map(a=>({a, d:Math.sqrt((a.vec?.p||0-avg.p)**2+(a.vec?.i||0-avg.i)**2+(a.vec?.j||0-avg.j)**2)})).sort((x,y)=>x.d-y.d);
        const t = dist.slice(0,2);
        const w0 = 1/(t[0].d+0.15), w1 = 1/(t[1].d+0.15);
        const pct0 = Math.round(100*w0/(w0+w1));
        const resilience = calcResilience(domains, state.startDomains);
        return {
          ...state,
          screen: 'final',
          domains,
          resilience,
          archetype: t[0].a,
          archetypeSplit: `%${pct0} ${t[0].a.name} · %${100-pct0} ${t[1].a.name}`,
          showFeedback: false,
          past: [...state.past, state]
        };
      }
      return {
        ...state,
        domains,
        turn: nextTurn,
        pendingEchoes: [],
        showFeedback: false,
        lastFeedback: null,
        lastDeltas: null,
        lastWhy: null,
        lastCsrGate: null,
        lastLesson: null,
        past: [...state.past, state]
      };
    }

    case 'UNDO':
      return state.past.length ? state.past[state.past.length - 1] : state;

    case 'REPLAY':
      return {...initialState, screen: 'onboard'};

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startGame = useCallback((island) => dispatch({type:'START_GAME', island}), []);
  const choosePolicy = useCallback((crisis, opt) => dispatch({type:'CHOOSE_POLICY', crisis, opt}), []);
  const continueTurn = useCallback(() => dispatch({type:'CONTINUE'}), []);
  const undo = useCallback(() => dispatch({type:'UNDO'}), []);
  const replay = useCallback(() => dispatch({type:'REPLAY'}), []);

  return { state, startGame, choosePolicy, continueTurn, undo, replay };
}
