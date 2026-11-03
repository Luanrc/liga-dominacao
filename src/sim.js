// ================= SIMULAÇÃO (independente da tela) =================
const ZW = 100, AL = 600, AW = 300, PR = 12, ROUND_TIME = 180, DT = 1 / 60;
const TB_R = 78, TB_TIME = 45;

const ELEM = {
  fire:  { id: 'fire',  name: 'Fogo',  cd: 0.55, speed: 440, kb: 150, r: 6, home: 0,   life: 1.5 },
  water: { id: 'water', name: 'Água',  cd: 0.85, speed: 330, kb: 230, r: 8, home: 1.8, life: 2.0 },
  earth: { id: 'earth', name: 'Terra', cd: 1.20, speed: 300, kb: 330, r: 9, home: 0,   life: 2.2 },
};
// Força do golpe conforme a distância percorrida pelo projétil:
// fogo cresce no caminho (fraco de perto, forte de longe); terra perde força (forte de perto, fraca de longe); água é constante.
const RANGE = { fire: [0.6, 1.4], water: [1, 1], earth: [1.4, 0.6] };
const RANGE_NEAR = 40, RANGE_SPAN = 200;
function rangeMul(elem, dist) {
  const [near, far] = RANGE[elem], t = clamp((dist - RANGE_NEAR) / RANGE_SPAN, 0, 1);
  return near + (far - near) * t;
}
// cada elemento se posiciona para aproveitar o próprio alcance: fogo recua, terra encosta na linha
const ELEM_DEPTH = { fire: 8, water: 0, earth: -8 };
const ELEM_DIST_PREF = { fire: 1 / 500, water: -1 / 700, earth: -1 / 350 };
const POSTURE = {
  agg: { name: 'Agressiva',   depth: 20, cd: 0.86, dodge: -0.05, block: -0.03, foul: 1.6 },
  bal: { name: 'Equilibrada', depth: 26, cd: 1.00, dodge: 0.00,  block: 0.00,  foul: 1.0 },
  def: { name: 'Defensiva',   depth: 32, cd: 1.15, dodge: 0.10,  block: 0.06,  foul: 0.5 },
};
// Temperamento (tmp 0 = calmo, 100 = explosivo) puxa a postura do jogador para o seu jeito natural:
// 65% vem da ordem do técnico e 35% do temperamento. Explosivos também cometem mais faltas.
const POSTURE_KEYS = ['depth', 'cd', 'dodge', 'block', 'foul'];
function lerpPosture(a, b, t) { const o = {}; for (const k of POSTURE_KEYS) o[k] = a[k] + (b[k] - a[k]) * t; return o; }
function playerPosture(team, p) {
  const tmp = p.st.tmp ?? 50;
  const nat = tmp < 50 ? lerpPosture(POSTURE.def, POSTURE.bal, tmp / 50) : lerpPosture(POSTURE.bal, POSTURE.agg, (tmp - 50) / 50);
  let order = POSTURE[team.posture];
  const ins = instrOf(p);
  if (ins === 'aggr') order = lerpPosture(order, POSTURE.agg, 0.6);
  if (ins === 'caut') order = lerpPosture(order, POSTURE.def, 0.6);
  const eff = lerpPosture(order, nat, 0.35);
  eff.foul *= 0.8 + tmp * 0.004;
  return eff;
}
const TARGETING = {
  free:    'IA decide',
  focus:   'Foco no mais vulnerável',
  mirror:  'Duelo de elementos',
  danger:  'Foco no mais perigoso',
  nearest: 'Foco no mais próximo',
  star:    'Caçar a estrela',
};
// Formação: como o time se espalha na arena
const FORMATION = {
  open:    'Aberta',
  compact: 'Compacta',
  stagger: 'Escalonada',
};
// Instruções individuais, dadas no intervalo e válidas para o round
const INSTR = {
  none:     'Sem instrução',
  press:    'Pressionar',
  distance: 'Manter distância',
  aggr:     'Mais agressivo',
  caut:     'Mais cauteloso',
  protect:  'Proteger',
};
// instruções que contrariam o temperamento: explosivos resistem a ordens de calma, calmos resistem a ordens de ataque
const CALM_ORDERS = new Set(['caut', 'distance', 'protect']), WILD_ORDERS = new Set(['aggr', 'press']);
function disobeyChance(p) {
  const ins = p.instr || 'none', tmp = p.st.tmp ?? 50, stress = p.st.stress || 0;
  if (ins === 'none') return 0;
  const clash = (tmp > 50 && CALM_ORDERS.has(ins)) || (tmp < 50 && WILD_ORDERS.has(ins));
  let c = clash ? clamp((Math.abs(tmp - 50) - 15) / 35, 0, 1) * 0.45 : 0;
  // estresse alto: o bender passa a ignorar ordens, mesmo as que combinam com ele
  if (stress > 60) c += (stress - 60) / 40 * 0.2;
  return Math.min(0.8, c);
}
// instrução que vale de fato: quem desobedece joga do próprio jeito
function instrOf(p) {
  if (p.obey === false) return (p.st.tmp ?? 50) > 50 ? 'aggr' : 'caut';
  return p.instr || 'none';
}
const starScore = (o) => o.st.pow + o.st.pre + o.st.agi + o.st.fir + o.st.dis + o.st.lei;
const SIM_TUNING = { kbMul: 0.48, friction: 6.5, foulMul: 1 };

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function gauss(r) { return (r() + r() + r() - 1.5) * 1.15; }
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const px = (team, d) => (team === 0 ? d : AL - d);
const dOf = (p) => (p.team === 0 ? p.x : AL - p.x);

// formato da plataforma: 'square' = retângulo; 'round' = arredondada, mais larga no meio e estreita nas bordas do fundo
const ARENA_R = 375;
function halfW(arena, x) {
  if (arena !== 'round') return AW / 2;
  const u = (x - AL / 2) / ARENA_R;
  return AW / 2 * Math.sqrt(Math.max(0, 1 - u * u));
}
// faixa (lane) de 0 a 1 convertida em y, respeitando a largura da arena naquele x
function laneToY(arena, f, x) { return AW / 2 + (f - 0.5) * 2 * (halfW(arena, x) - PR - 6); }

function createMatch(defs, seed, arena = 'round', coach = null) {
  const m = {
    seed, arena, rng: mulberry32(seed), clock: 0, time: ROUND_TIME, round: 1,
    mode: 'pre', modeT: 1.6, projs: [], events: [], winner: null, winReason: null,
    nextId: 1, tb: null, roundLog: [], coach,
  };
  m.teams = defs.map((d, ti) => ({
    name: d.name, short: d.short || d.name, color: d.color, posture: d.posture || 'bal',
    targeting: d.targeting || 'free', formation: d.formation || 'open', auto: !!d.auto, pop: d.pop ?? 45, style: d.style || 'bal', limit: AL / 2, roundWins: 0, advances: 0, idx: ti,
    players: d.players.map((pd, i) => ({
      id: ti * 10 + i, team: ti, slot: i, name: pd.name, elem: pd.elem, st: { lei: 50, tmp: 50, ...pd.st }, ref: pd.id, instr: pd.instr || 'none', obey: true,
      stats: { shots: 0, hits: 0, pushes: 0, falls: 0, dodges: 0, blocks: 0, fouls: 0, taken: 0 },
    })),
  }));
  resetRound(m);
  return m;
}

function allPlayers(m) { return m.teams[0].players.concat(m.teams[1].players); }

function emit(m, type, data) { m.events.push({ type, clock: m.clock, time: m.time, round: m.round, ...data }); }

function resetRound(m) {
  m.projs = [];
  m.time = ROUND_TIME;
  m.tb = null;
  // técnico automático escolhe a tática dos times controlados pela IA no começo de cada round
  if (m.coach) for (const t of m.teams) if (t.auto) {
    const c = m.coach(m, t.idx);
    for (const k of ['posture', 'targeting', 'formation']) if (c[k]) t[k] = c[k];
    for (const p of t.players) p.instr = (c.instr && c.instr[p.elem]) || 'none';
  }
  for (const t of m.teams) {
    t.limit = AL / 2;
    t.players.forEach((p, i) => {
      p.alive = true; p.active = true; p.fallT = 0;
      p.limitD = AL / 2; p.backEdge = AL / 2 - ZW;
      p.laneF = (i + 1) / 4;
      p.x = px(t.idx, AL / 2 - 22); p.y = laneToY(m.arena, p.laneF, p.x); p.laneY = p.y;
      p.vx = 0; p.vy = 0; p.cvx = 0; p.cvy = 0;
      p.stagger = 0; p.cd = 0.6 + m.rng() * 0.8; p.think = m.rng() * 0.2;
      p.dodgeT = 0; p.dodgeDir = 0; p.burst = 0; p.target = null; p.lastHit = null; p.lastHitT = -99;
      p.depthPref = m.rng() * 14;
      p.wf = 0.8 + m.rng() * 1.2; p.wp = m.rng() * 6.28; p.wa = 14 + p.st.agi * 0.28;
      p.goalX = p.x; p.goalY = p.y; p.flash = 0; p.post = playerPosture(t, p);
    });
  }
}

function step(m) {
  m.clock += DT;
  switch (m.mode) {
    case 'pre':
      if ((m.modeT -= DT) <= 0) {
        m.mode = 'play'; emit(m, 'start', { text: `Round ${m.round}: começou!` });
        // registra a tática de cada time neste round (para o relatório pós-partida)
        m.tacticLog = m.tacticLog || [];
        m.tacticLog[m.round - 1] = m.teams.map((t) => ({ posture: t.posture, targeting: t.targeting, formation: t.formation, instr: t.players.map((p) => p.instr) }));
        // obediência: quem recebeu uma ordem contra o próprio temperamento pode ignorá-la neste round
        for (const p of allPlayers(m)) {
          p.obey = !(m.rng() < disobeyChance(p));
          p.post = playerPosture(m.teams[p.team], p);
          if (!p.obey) { p.stats.disobey = (p.stats.disobey || 0) + 1; }
          if (!p.obey) emit(m, 'disobey', { pid: p.id, team: p.team, x: p.x, y: p.y,
            text: `${p.name} ignora a instrução (${INSTR[p.instr].toLowerCase()}) e joga do próprio jeito!` });
        }
      }
      break;
    case 'play':
      m.time -= DT;
      simTick(m);
      if (m.mode !== 'play') break;
      checkAdvance(m);
      checkKO(m);
      if (m.mode === 'play' && m.time <= 0) {
        m.time = 0;
        const a = m.teams[0].limit, half = AL / 2;
        const [s0, s1] = m.teams.map(teamDepth);
        if (a > half) finishRound(m, 0, 'territory');
        else if (a < half) finishRound(m, 1, 'territory');
        else if (s0 > s1) finishRound(m, 0, 'zones');
        else if (s1 > s0) finishRound(m, 1, 'zones');
        else startTiebreak(m);
      }
      break;
    case 'tbPre':
      if ((m.modeT -= DT) <= 0) { m.mode = 'tb'; emit(m, 'start', { text: 'Desempate: valendo!' }); }
      break;
    case 'tb':
      m.tb.time -= DT;
      simTick(m);
      if (m.mode === 'tb' && m.tb.time <= 0) {
        const [c0, c1] = m.tb.champs;
        const d0 = Math.hypot(c0.x - AL / 2, c0.y - AW / 2), d1 = Math.hypot(c1.x - AL / 2, c1.y - AW / 2);
        finishRound(m, d0 <= d1 ? 0 : 1, 'tbtime');
      }
      break;
    case 'roundEnd':
      if ((m.modeT -= DT) <= 0) {
        if (m.winner !== null) { m.mode = 'over'; emit(m, 'over', {}); }
        else { m.round++; resetRound(m); m.mode = 'pre'; m.modeT = 1.6; }
      }
      break;
  }
}

function simTick(m) {
  const ps = allPlayers(m);
  for (const p of ps) updatePlayer(m, p);
  updateProjs(m);
  for (const p of ps) if (p.flash > 0) p.flash -= DT;
}

function think(m, p) {
  const team = m.teams[p.team], opp = m.teams[1 - p.team];
  const foes = opp.players.filter((o) => o.alive && o.active);
  if (!foes.length) { p.target = null; return; }
  const inTb = m.mode === 'tb';

  if (!inTb) {
    // espalhar os companheiros vivos pela largura da arena
    const mates = team.players.filter((q) => q.alive && q.active).sort((a, b) => a.laneF - b.laneF);
    const spread = team.formation === 'compact' ? 0.55 : team.formation === 'open' ? 1.0 : 0.9;
    mates.forEach((q, i) => { q.laneF = clamp(0.5 + ((i + 1) / (mates.length + 1) - 0.5) * spread, 0.08, 0.92); });
  }

  p.post = playerPosture(team, p);
  const read = p.st.lei / 100; // Leitura de jogo
  let tgt = null;
  const ins = instrOf(p);
  const markId = p.obey !== false && p.instr && p.instr.startsWith('mark:') ? +p.instr.slice(5) : null;
  const markT = markId !== null ? foes.find((o) => o.id === markId) : null;
  if (inTb) tgt = foes[0];
  else if (markT) tgt = markT;
  else if (team.targeting === 'danger' || team.targeting === 'star' || team.targeting === 'nearest') {
    // critério do técnico pesa muito, mas o bender ainda enxerga quem está quase sendo empurrado
    let best = -1e9;
    for (const o of foes) {
      const dist = Math.hypot(o.x - p.x, o.y - p.y);
      let s = vulnerability(o) * 0.85 + m.rng() * (1.1 - read) * 0.7;
      if (team.targeting === 'danger') s += (o.st.pow - 50) / 28;
      if (team.targeting === 'star') s += (starScore(o) - 300) / 130;
      if (team.targeting === 'nearest') s -= dist / 160;
      if (p.target === o) s += 0.3;
      if (s > best) { best = s; tgt = o; }
    }
  } else if (team.targeting === 'focus') {
    // pouca leitura: às vezes não percebe quem é o mais vulnerável
    if (m.rng() < (1 - read) * 0.35) tgt = foes[Math.floor(m.rng() * foes.length)];
    else tgt = foes.reduce((b, o) => (vulnerability(o) > vulnerability(b) ? o : b), foes[0]);
  } else if (team.targeting === 'mirror') {
    const same = foes.find((o) => o.elem === p.elem);
    tgt = same && vulnerability(same) + 0.5 >= Math.max(...foes.map(vulnerability)) ? same : foes.reduce((b, o) => (vulnerability(o) > vulnerability(b) ? o : b), foes[0]);
  } else {
    let best = -1e9;
    for (const o of foes) {
      const dist = Math.hypot(o.x - p.x, o.y - p.y);
      let s = vulnerability(o) + dist * (ELEM_DIST_PREF[p.elem] + (ins === 'distance' ? 1 / 300 : ins === 'press' ? -1 / 300 : 0)) + m.rng() * (1.1 - read);
      if (o.target === p) s += 0.3;
      if (p.target === o) s += 0.35;
      // formação compacta: os companheiros se ajudam a concentrar no mesmo alvo
      if (team.formation === 'compact' && team.players.some((q) => q !== p && q.alive && q.target === o)) s += 0.04;
      if (s > best) { best = s; tgt = o; }
    }
  }
  p.target = tgt;

  let extra = 0;
  if (team.formation === 'stagger') extra += p === anchorOf(team) ? -8 : 6;
  if (ins === 'press') extra -= 8;
  else if (ins === 'distance') extra += 6;
  else if (ins === 'protect' && p.elem !== 'earth') extra += 8;
  const goalD = inTb ? p.limitD - 22 : p.limitD - Math.max(4, p.post.depth + ELEM_DEPTH[p.elem] + extra) - p.depthPref;
  p.goalX = px(p.team, goalD);

  // falta: pisar além da linha (afobação)
  if (!inTb && m.mode === 'play') {
    const pressing = ins === 'press' || (team.formation === 'stagger' && p === anchorOf(team));
    const pf = 0.0007 * (1.25 - p.st.dis / 100) * p.post.foul * SIM_TUNING.foulMul * (pressing ? 2.5 : 1);
    if (m.rng() < pf) foul(m, p, 'linha');
  }
}

// formação escalonada: quem segura a linha na frente (a terra, se estiver em quadra; senão quem tem mais Firmeza)
function anchorOf(team) {
  const alive = team.players.filter((q) => q.alive && q.active);
  return alive.find((q) => q.elem === 'earth') || alive.reduce((b, q) => (q.st.fir > b.st.fir ? q : b), alive[0]);
}

// quão perto o jogador está de ser empurrado para a próxima zona (ou para a água)
function vulnerability(o) {
  const d = dOf(o);
  const margin = d - Math.floor(d / ZW) * ZW;
  let v = 1 + (ZW - margin) / ZW * 1.5;
  if (d < ZW) v += 0.8;
  return v;
}

function updatePlayer(m, p) {
  if (!p.alive) { p.fallT += DT; return; }
  if (!p.active) return;
  const team = m.teams[p.team];
  const inTb = m.mode === 'tb';
  p.stagger = Math.max(0, p.stagger - DT);
  p.cd -= DT; p.think -= DT; p.dodgeT = Math.max(0, p.dodgeT - DT);
  // quem lê melhor o jogo reage mais rápido
  if (p.think <= 0) { think(m, p); p.think = 0.12 + (1 - p.st.lei / 100) * 0.22 + m.rng() * 0.1; }

  if (!inTb) p.laneY = laneToY(m.arena, p.laneF, p.x);
  const cy = inTb ? AW / 2 : p.laneY;
  p.goalY = cy + Math.sin(m.clock * p.wf + p.wp) * (inTb ? 30 : p.wa * (instrOf(p) === 'distance' ? 1.4 : 1));

  let cvx = 0, cvy = 0;
  if (p.stagger <= 0) {
    const spd = 70 + p.st.agi * 0.6;
    const dx = p.goalX - p.x, dy = p.goalY - p.y;
    if (p.dodgeT > 0) {
      cvy = p.dodgeDir * 270;
      cvx = clamp(dx * 4, -spd, spd) * 0.5;
    } else {
      const L = Math.hypot(dx, dy);
      if (L > 1) { const s = Math.min(spd, L * 5); cvx = dx / L * s; cvy = dy / L * s; }
    }
  }
  p.cvx = cvx; p.cvy = cvy;
  p.x += (cvx + p.vx) * DT;
  p.y += (cvy + p.vy) * DT;
  const k = Math.exp(-SIM_TUNING.friction * DT);
  p.vx *= k; p.vy *= k;

  if (inTb) {
    // meia plataforma de cada um
    let d = dOf(p);
    if (d > p.limitD) { d = p.limitD; p.x = px(p.team, d); }
    if (Math.hypot(p.x - AL / 2, p.y - AW / 2) > TB_R) {
      p.alive = false; p.fallT = 0;
      p.stats.taken += 0;
      emit(m, 'water', { pid: p.id, team: p.team, x: p.x, y: p.y, text: `${p.name} cai da plataforma!` });
      finishRound(m, 1 - p.team, 'tiebreak');
      return;
    }
  } else {
    // cordas laterais
    const hw = halfW(m.arena, clamp(p.x, 0, AL));
    if (p.y < AW / 2 - hw + PR) { p.y = AW / 2 - hw + PR; if (p.vy < 0) p.vy *= -0.3; }
    if (p.y > AW / 2 + hw - PR) { p.y = AW / 2 + hw - PR; if (p.vy > 0) p.vy *= -0.3; }
    let d = dOf(p);
    if (d > p.limitD - 1) {
      d = p.limitD - 1; p.x = px(p.team, d);
      const fwd = p.team === 0 ? p.vx : -p.vx;
      if (fwd > 0) p.vx = 0;
    }
    if (d >= p.limitD - ZW) p.backEdge = p.limitD - ZW; // chegou à zona nova após um avanço
    if (d < p.backEdge && d >= 0) {
      p.limitD = (Math.floor(d / ZW) + 1) * ZW; p.backEdge = p.limitD - ZW;
      const credit = creditOf(m, p);
      if (credit) credit.stats.pushes++;
      emit(m, 'push', { pid: p.id, team: p.team, x: p.x, y: p.y, zone: zoneLabel(m, p),
        text: `${p.name} é empurrado para ${zoneLabel(m, p)}${credit ? ` por ${credit.name}` : ''}!` });
    }
    if (d < 0) {
      p.alive = false; p.fallT = 0;
      const credit = creditOf(m, p);
      if (credit) credit.stats.falls++;
      emit(m, 'water', { pid: p.id, team: p.team, x: p.x, y: p.y,
        text: `${p.name} cai na água${credit ? ` com golpe de ${credit.name}` : ''}! Fora do round.` });
      return;
    }
  }

  // ataque
  if (p.stagger <= 0 && p.target && p.target.alive) {
    if (p.burst > 0) { p.burst -= DT; if (p.burst <= 0) shoot(m, p, true); }
    if (p.cd <= 0) shoot(m, p, false);
  }
}

// soma das posições de zona dos jogadores (quem caiu na água conta como -1 zona)
function teamDepth(t) { return t.players.reduce((a, p) => a + (p.alive ? p.limitD : -ZW), 0); }

function creditOf(m, p) { return p.lastHit && m.clock - p.lastHitT < 3 ? p.lastHit : null; }

// rótulo de zona do ponto de vista do lado onde o jogador está pisando
function zoneLabel(m, p) {
  const d = dOf(p);
  if (d < 0) return 'a água';
  const z = Math.floor(d / ZW);
  if (z <= 2) return `a Zona ${3 - z}`;
  return `a Zona ${z - 2} rival`;
}

function shoot(m, p, isBurst) {
  const E = ELEM[p.elem], t = p.target, team = m.teams[p.team];
  const dx = t.x - p.x, dy = t.y - p.y;
  const dist = Math.hypot(dx, dy);
  const tt = dist / E.speed, lead = 0.45 + p.st.pre * 0.005;
  const ax = t.x + t.cvx * tt * lead, ay = t.y + t.cvy * tt * lead;
  const ang = Math.atan2(ay - p.y, ax - p.x) + gauss(m.rng) * (0.015 + (1 - p.st.pre / 100) * 0.48);
  const c = Math.cos(ang), s = Math.sin(ang);
  m.projs.push({
    id: m.nextId++, elem: p.elem, owner: p, team: p.team, target: t,
    x: p.x + c * (PR + 2), y: p.y + s * (PR + 2), vx: c * E.speed, vy: s * E.speed,
    r: E.r, kb: E.kb, life: E.life, dist: 0, dead: false, seen: new Set(), spin: m.rng() * 6,
  });
  p.stats.shots++;
  if (!isBurst) {
    p.cd = E.cd * (1.15 - p.st.agi * 0.003) * p.post.cd * (instrOf(p) === 'press' ? 0.9 : 1) * (0.85 + m.rng() * 0.3);
    if (p.elem === 'fire' && m.rng() < 0.35) p.burst = 0.12;
  }
}

function updateProjs(m) {
  const ps = allPlayers(m);
  for (const pr of m.projs) {
    if (pr.dead) continue;
    const E = ELEM[pr.elem];
    if (E.home > 0 && pr.target && pr.target.alive) {
      const want = Math.atan2(pr.target.y - pr.y, pr.target.x - pr.x);
      const cur = Math.atan2(pr.vy, pr.vx);
      let da = want - cur;
      while (da > Math.PI) da -= 2 * Math.PI;
      while (da < -Math.PI) da += 2 * Math.PI;
      const turn = clamp(da, -E.home * DT, E.home * DT);
      const sp = Math.hypot(pr.vx, pr.vy), na = cur + turn;
      pr.vx = Math.cos(na) * sp; pr.vy = Math.sin(na) * sp;
    }
    pr.x += pr.vx * DT; pr.y += pr.vy * DT; pr.life -= DT; pr.spin += DT * 9; pr.dist += E.speed * DT;
    // instrução Proteger na terra: tenta interceptar com um disco o ataque que vai num companheiro próximo
    if (!pr.guarded && pr.target && pr.target.alive) {
      const t = pr.target, tt = Math.hypot(t.x - pr.x, t.y - pr.y) / E.speed;
      if (tt < 0.35) {
        pr.guarded = true;
        const g = m.teams[t.team].players.find((q) => q !== t && q.alive && q.active && q.elem === 'earth' && q.stagger <= 0 &&
          instrOf(q) === 'protect' && Math.hypot(q.x - t.x, q.y - t.y) < 80);
        if (g && m.rng() < 0.1 + g.st.fir * 0.002) {
          pr.dead = true; g.stats.blocks++;
          emit(m, 'block', { pid: g.id, team: g.team, x: pr.x, y: pr.y, text: `${g.name} protege ${t.name} com um disco!` });
          continue;
        }
      }
    }
    if (pr.life <= 0 || pr.x < -40 || pr.x > AL + 40 || pr.y < -40 || pr.y > AW + 40) { pr.dead = true; continue; }

    for (const o of ps) {
      if (o.team === pr.team || !o.alive || !o.active) continue;
      const rx = o.x - pr.x, ry = o.y - pr.y;
      if (rx * rx + ry * ry < (PR + pr.r) ** 2) { hit(m, pr, o); pr.dead = true; break; }
      // reação: esquiva ou bloqueio
      if (o.stagger > 0 || pr.seen.has(o.id)) continue;
      const v2 = pr.vx * pr.vx + pr.vy * pr.vy;
      const tc = (rx * pr.vx + ry * pr.vy) / v2;
      if (tc <= 0 || tc > 0.6) continue;
      const cx = rx - pr.vx * tc, cy = ry - pr.vy * tc;
      if (cx * cx + cy * cy > (PR + pr.r + 4) ** 2) continue;
      pr.seen.add(o.id);
      const post = o.post;
      // Leitura de jogo também ajuda a antecipar o golpe (esquiva e bloqueio)
      const readB = (o.st.lei - 50) * 0.006;
      if (o.elem === 'earth' && m.rng() < 0.08 + o.st.fir * 0.0025 + post.block + readB * 0.4) {
        pr.dead = true; o.stats.blocks++;
        emit(m, 'block', { pid: o.id, team: o.team, x: pr.x, y: pr.y, text: `${o.name} ergue um disco e bloqueia!` });
        break;
      }
      const oi = instrOf(o), backline = m.teams[o.team].formation === 'stagger' && o !== anchorOf(m.teams[o.team]);
      const prot = (oi === 'protect' ? 0.1 : oi === 'distance' ? 0.08 : 0) + (backline ? 0.05 : 0);
      const ch = (0.1 + o.st.agi * 0.0045 + post.dodge + readB + prot - (pr.owner.st.pre - 60) * 0.004) * Math.min(1, tc / 0.4);
      if (m.rng() < ch) {
        const side = rx * pr.vy - ry * pr.vx; // lado do projétil
        let dir = side > 0 ? -1 : 1;
        if (m.mode !== 'tb') {
          const hw = halfW(m.arena, clamp(o.x, 0, AL));
          if (o.y < AW / 2 - hw + PR + 30) dir = 1; else if (o.y > AW / 2 + hw - PR - 30) dir = -1;
        }
        o.dodgeT = 0.22; o.dodgeDir = dir; o.stats.dodges++;
        emit(m, 'dodge', { pid: o.id, team: o.team, x: o.x, y: o.y });
      }
    }
  }
  // choque entre ataques de times opostos
  const live = m.projs.filter((p) => !p.dead);
  for (let i = 0; i < live.length; i++) {
    const a = live[i]; if (a.dead) continue;
    for (let j = i + 1; j < live.length; j++) {
      const b = live[j]; if (b.dead || b.team === a.team) continue;
      if ((a.x - b.x) ** 2 + (a.y - b.y) ** 2 < (a.r + b.r) ** 2) {
        const diff = a.kb * rangeMul(a.elem, a.dist) - b.kb * rangeMul(b.elem, b.dist);
        if (Math.abs(diff) < 60) { a.dead = b.dead = true; }
        else if (diff > 0) { b.dead = true; a.kb *= 0.6; }
        else { a.dead = true; b.kb *= 0.6; }
        emit(m, 'clash', { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, elems: [a.elem, b.elem] });
        if (a.dead) break;
      }
    }
  }
  m.projs = m.projs.filter((p) => !p.dead);
}

function hit(m, pr, o) {
  const a = pr.owner, team = m.teams[a.team];
  a.stats.hits++;
  const pf = 0.012 * (1.25 - a.st.dis / 100) * a.post.foul * SIM_TUNING.foulMul;
  if (m.mode !== 'tb' && m.rng() < pf) { foul(m, a, 'cabeca', o); return; }
  const brace = m.teams[o.team].formation === 'stagger' && o === anchorOf(m.teams[o.team]) ? 14 : 0; // quem segura a linha finca o pé
  const imp = pr.kb * rangeMul(pr.elem, pr.dist) * SIM_TUNING.kbMul * (0.6 + a.st.pow * 0.008) / (0.6 + (o.st.fir + brace) * 0.008);
  const L = Math.hypot(pr.vx, pr.vy);
  o.vx += pr.vx / L * imp; o.vy += pr.vy / L * imp * 0.5;
  o.stagger = Math.max(o.stagger, 0.22 + imp / 1200);
  o.lastHit = a; o.lastHitT = m.clock; o.flash = 0.12; o.stats.taken++;
  // respingo: quem está colado no alvo também é empurrado (o preço de jogar compacto)
  for (const q of m.teams[o.team].players) {
    if (q === o || !q.alive || !q.active) continue;
    if (Math.hypot(q.x - o.x, q.y - o.y) < 34) {
      q.vx += pr.vx / L * imp * 0.4; q.vy += pr.vy / L * imp * 0.2;
      q.stagger = Math.max(q.stagger, 0.12); q.lastHit = a; q.lastHitT = m.clock;
    }
  }
  emit(m, 'hit', { pid: o.id, by: a.id, team: o.team, elem: pr.elem, x: o.x, y: o.y, imp });
}

function foul(m, p, kind, victim) {
  p.stats.fouls++;
  const why = kind === 'linha' ? 'passou da linha da zona' : `acertou ${victim ? victim.name : 'o rival'} acima dos ombros`;
  if (p.limitD > ZW) {
    p.limitD -= ZW; p.backEdge = Math.min(p.backEdge, p.limitD - ZW);
    const d = dOf(p);
    if (d > p.limitD - 1) p.x = px(p.team, p.limitD - 12);
    emit(m, 'foul', { pid: p.id, team: p.team, x: p.x, y: p.y, text: `Falta! ${p.name} ${why}. Recua uma zona.` });
  } else {
    emit(m, 'foul', { pid: p.id, team: p.team, x: p.x, y: p.y, text: `Falta! ${p.name} ${why}. Advertência.` });
  }
}

function checkAdvance(m) {
  for (let ti = 0; ti < 2; ti++) {
    const T = m.teams[ti], O = m.teams[1 - ti];
    const alive = O.players.filter((p) => p.alive);
    if (!alive.length || T.limit >= AL - ZW) continue;
    if (alive.every((p) => p.limitD <= O.limit - ZW)) {
      T.limit += ZW; O.limit -= ZW; T.advances++;
      T.players.forEach((p) => { if (p.alive) p.limitD = Math.min(p.limitD + ZW, T.limit); });
      emit(m, 'advance', { team: ti, text: `${T.name} avança uma zona!` });
    }
  }
}

function checkKO(m) {
  for (let ti = 0; ti < 2; ti++) {
    if (m.teams[ti].players.every((p) => !p.alive)) { finishRound(m, 1 - ti, 'ko'); return; }
  }
}

function startTiebreak(m) {
  m.projs = [];
  const champs = m.teams.map((t) => t.players.reduce((b, p) =>
    (p.st.pow + p.st.agi + p.st.pre > b.st.pow + b.st.agi + b.st.pre ? p : b), t.players[0]));
  for (const p of allPlayers(m)) {
    p.alive = true; p.active = champs.includes(p);
    p.vx = p.vy = 0; p.stagger = 0; p.burst = 0; p.dodgeT = 0; p.target = null;
  }
  champs.forEach((c) => {
    c.limitD = AL / 2 - 8; c.x = px(c.team, AL / 2 - 45); c.y = AW / 2;
    c.goalX = c.x; c.goalY = c.y; c.cd = 0.8 + m.rng() * 0.5; c.lastHit = null;
  });
  m.tb = { champs, time: TB_TIME };
  m.mode = 'tbPre'; m.modeT = 2.2;
  emit(m, 'tiebreak', { text: `Empate no território! Desempate: ${champs[0].name} contra ${champs[1].name}.` });
}

function finishRound(m, wi, reason) {
  const W = m.teams[wi];
  m.projs = [];
  m.roundLog.push({ round: m.round, winner: wi, reason });
  if (reason === 'ko') {
    m.winner = wi; m.winReason = 'ko'; W.roundWins++;
    emit(m, 'roundEnd', { team: wi, reason, text: `NOCAUTE! ${W.name} derruba o time rival inteiro e vence a partida!` });
  } else {
    W.roundWins++;
    const why = { territory: 'por território', zones: 'com jogadores mais à frente', tiebreak: 'no desempate', tbtime: 'no desempate (tempo)' }[reason];
    emit(m, 'roundEnd', { team: wi, reason, text: `${W.name} vence o round ${m.round} ${why}.` });
    if (W.roundWins >= 2) { m.winner = wi; m.winReason = 'points'; }
  }
  m.mode = 'roundEnd'; m.modeT = 2.6;
}

// ================= GERAÇÃO DE TIMES =================
const NAMES = ['Tano', 'Kiyo', 'Ahnah', 'Bao', 'Sura', 'Jin-Ho', 'Meiling', 'Daiki', 'Nuka', 'Ryo', 'Lian', 'Taka',
  'Yuna', 'Oyuun', 'Shen', 'Ari', 'Nanuq', 'Tuya', 'Kenji', 'Ming', 'Rin', 'Toshi', 'Amak', 'Kaya', 'Wen', 'Jae',
  'Hana', 'Sedna', 'Lu Ten', 'Pakku-Ro', 'Iluk', 'Mei', 'Goro', 'Sayo', 'Akna', 'Huan', 'Tsuro', 'Qilak',
  'Anuk', 'Bai Lun', 'Chiyo', 'Dorje', 'Eska-Ri', 'Fen', 'Gyatso-Lin', 'Hiro-Ta', 'Ikaika', 'Jun', 'Kallik', 'Lao Bei', 'Miki',
  'Noriko', 'Oki', 'Pasang', 'Qiu', 'Renji', 'Siku', 'Tenzi', 'Ulu', 'Vesna', 'Wei', 'Xiu', 'Yaro', 'Zhen', 'Aput', 'Bolat',
  'Cheng', 'Dawa', 'Enkhe', 'Fumi', 'Gan', 'Hei', 'Itzel', 'Jinpa', 'Koda', 'Lhamo', 'Misu', 'Nima', 'Orla', 'Pema-Lu', 'Sora', 'Tashi',
  'Aiyana', 'Bodhi', 'Chen-Li', 'Desna', 'Eiko', 'Feng', 'Gyalt', 'Hoshi', 'Inuk', 'Jiro', 'Kenta', 'Lumi', 'Maru', 'Nao', 'Odi',
  'Pakka', 'Rei', 'Saiko', 'Tamsin', 'Uki', 'Vito-Li', 'Wan', 'Xin', 'Yori', 'Zhu', 'Akio', 'Botan', 'Chiaki', 'Dai', 'Emiko',
  'Fuyu', 'Genji', 'Hira', 'Isamu', 'Jia', 'Kaede', 'Lio', 'Mikka', 'Nori', 'Oren', 'Pim', 'Ruki', 'Suzu', 'Tobi', 'Umi', 'Yuki'];
const TEAM_NAMES = [
  ['Lótus Carmesim', 'LÓT'], ['Lanternas de Prata', 'LAN'], ['Gaivotas do Porto', 'GAI'], ['Tigres da Ilha', 'TIG'],
  ['Corvos de Jade', 'COR'], ['Raposas do Deserto', 'RAP'], ['Tartarugas de Ferro', 'TAR'], ['Garças da Neve', 'GAR'],
];
function randStat(r, base) { return Math.round(clamp(base + gauss(r) * 14, 35, 95)); }
function makeTeam(r, used, color) {
  let tn;
  do { tn = TEAM_NAMES[Math.floor(r() * TEAM_NAMES.length)]; } while (used.has(tn[0]));
  used.add(tn[0]);
  const players = ['water', 'earth', 'fire'].map((elem) => {
    let n; do { n = NAMES[Math.floor(r() * NAMES.length)]; } while (used.has(n));
    used.add(n);
    const b = 64;
    const st = { pow: randStat(r, b), pre: randStat(r, b), agi: randStat(r, b), fir: randStat(r, b), dis: randStat(r, b), lei: randStat(r, b), tmp: Math.round(15 + r() * 75) };
    if (elem === 'earth') { st.fir = Math.min(95, st.fir + 8); st.agi = Math.max(35, st.agi - 6); }
    if (elem === 'fire') { st.agi = Math.min(95, st.agi + 6); st.fir = Math.max(35, st.fir - 6); }
    return { name: n, elem, st };
  });
  return { name: tn[0], short: tn[1], color, posture: 'bal', targeting: 'free', players };
}
function makeTeams(seed) {
  const r = mulberry32(seed * 7919 + 13), used = new Set();
  return [makeTeam(r, used, '#ff5a7a'), makeTeam(r, used, '#f2ead6')];
}

function runHeadless(defs, seed, arena = 'round', maxSteps = 200000) {
  const m = createMatch(defs, seed, arena);
  let n = 0;
  while (m.mode !== 'over' && n++ < maxSteps) { step(m); if (m.events.length > 500) m.events.length = 0; }
  return m;
}

if (typeof module !== 'undefined') module.exports = { TARGETING, FORMATION, INSTR, disobeyChance, rangeMul, mulberry32, gauss, clamp, randStat, NAMES, TEAM_NAMES, playerPosture, halfW, createMatch, step, makeTeams, runHeadless, SIM_TUNING, ELEM, POSTURE };
