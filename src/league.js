// ================= LIGA (gestão, independente da tela) =================
// Regras em design/bender-manager-design.md (projeto Bender Manager).
const ATTRS = [
  ['pow', 'POD', 'Poder'], ['pre', 'PRE', 'Precisão'], ['agi', 'AGI', 'Agilidade'],
  ['fir', 'FIR', 'Firmeza'], ['dis', 'DIS', 'Disciplina'], ['lei', 'LEI', 'Leitura de jogo'],
];
const TRAINABLE = ATTRS.map((a) => a[0]);
const ELEMS = ['water', 'earth', 'fire'];
// 24 cores, uma por time, para não repetir quando times trocam de divisão
const LEAGUE_COLORS = ['#ff5a7a', '#f2ead6', '#3fd0b6', '#e45fd6', '#b48cff', '#f2c94c', '#8fa8d6', '#ff9a6b',
  '#d9434f', '#9be7c4', '#ffa3c8', '#d4b3ff', '#e0a030', '#b9bec9', '#4dd0e1', '#c9e265',
  '#6fa8ff', '#e8c39e', '#7fd36b', '#ff7fb0', '#a3866a', '#9ad0ff', '#ffd27a', '#c08bd9'];
const STYLES = { agg: 'Agressivo', bal: 'Equilibrado', def: 'Defensivo' };
// elenco de 6 a 9 benders: 3 titulares (um de cada elemento) e o resto no banco, que pode entrar no intervalo dos rounds
const MAX_ROSTER = 9, MIN_ROSTER = 6, WEEKS = 14;
// lesão fora da partida: treinar cansado pode machucar; duração sorteada em semanas (rodadas)
const INJURY = { trainBase: 0.005, trainPerEnergy: 0.0015, trainEnergy: 60, weeks: [[1, 0.45], [2, 0.30], [3, 0.15], [4, 0.07], [5, 0.03]] };
function injuryWeeks(r) { let x = r(); for (const [w, pr] of INJURY.weeks) { if ((x -= pr) <= 0) return w; } return 1; }
const isInjured = (p) => (p.inj || 0) > 0;
// turno e returno: 14 rodadas. Ganhos que são "por temporada" (treino, popularidade, fama) valem metade por partida,
// para a temporada inteira render o mesmo que antes com 7 rodadas.
const PER_MATCH = 7 / WEEKS;
const ENERGY = { match: 15, train: 10, rest: 35, bench: 8, natural: 10 }; // modelo semanal antigo (até a v0.15.1), mantido como referência
// ---- calendário da semana (v0.16) ----
// segunda: o técnico decide; quarta: treino (ou descanso); eventos na terça, quinta, sexta ou sábado; domingo: jogo.
// Dia livre recupera 12% do que falta para 100, mais 2 (quanto mais cansado, mais recupera). Treino na quarta custa 22;
// descansar na quarta é um dia livre com 10 a mais. Evento ocupa o dia (não recupera) e custa a energia dele. Jogo custa 15.
const DAYS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
const DAY_NAME = { seg: 'Segunda', ter: 'Terça', qua: 'Quarta', qui: 'Quinta', sex: 'Sexta', sab: 'Sábado', dom: 'Domingo' };
const EVENT_DAYS = ['ter', 'qui', 'sex', 'sab'];
const DAY = { k: 0.12, b: 2, train: 22, restBonus: 10, match: 15 };
// estresse por dia: dia livre −0,8; descanso na quarta −14 a mais; treino +2; evento +1; reserva que não joga no domingo −3 a mais
const DAY_STRESS = { free: -0.8, rest: -14, train: 2, event: 1, bench: -3 };
function dayRecover(p) { p.energy = Math.min(100, p.energy + DAY.k * (100 - p.energy) + DAY.b); }

const DIVS = [
  // faBase: nível dos agentes livres; fame: [início, base de referência, por ponto] e média para onde a popularidade volta;
  // rep: reputação inicial do técnico, teto e peso dos ganhos naquela divisão, bônus pelo título; need: [mínimo, nota de referência, por ponto]
  { name: 'Primeira Divisão', short: '1ª', mult: 1, cash: 20000, aiIncome: 5300, bases: [72, 70, 69, 67, 66, 65, 63, 62],
    faBase: 57, fame: [40, 62, 3], fameMean: 55, repStart: 30, repCap: 100, repMul: 1, champRep: 12, need: [38, 62, 3] },
  { name: 'Segunda Divisão', short: '2ª', mult: 0.6, cash: 12000, aiIncome: 3100, bases: [62, 60, 59, 57, 56, 54, 52, 50],
    faBase: 49, fame: [12, 50, 2.2], fameMean: 28, repStart: 20, repCap: 70, repMul: 0.6, champRep: 8, need: [8, 50, 2] },
  { name: 'Terceira Divisão', short: '3ª', mult: 0.45, cash: 7000, aiIncome: 1850, bases: [52, 50, 49, 47, 46, 44, 42, 40],
    faBase: 41, fame: [4, 40, 1.6], fameMean: 14, repStart: 8, repCap: 45, repMul: 0.45, champRep: 6, need: [0, 40, 1] },
];
const TEAM_LIST = [
  [['Lótus Carmesim', 'LÓT'], ['Lanternas de Prata', 'LAN'], ['Corvos de Jade', 'COR'], ['Raposas do Deserto', 'RAP'],
   ['Dragões de Ba Sing Se', 'DRA'], ['Tigres da Ilha', 'TIG'], ['Ondas do Polo Norte', 'OND'], ['Martelos de Yu Dao', 'MAR']],
  [['Gaivotas do Porto', 'GAI'], ['Tartarugas de Ferro', 'TAR'], ['Garças da Neve', 'GAR'], ['Ventos de Omashu', 'VEN'],
   ['Faróis do Polo Sul', 'FAR'], ['Ursos de Gaoling', 'URS'], ['Leques de Kyoshi', 'LEQ'], ['Lâminas de Zaofu', 'LÂM']],
  [['Pumas de Taku', 'PUM'], ['Lontras do Rio Jang', 'LON'], ['Falcões de Chin', 'FAL'], ['Coalas da Baía', 'COA'],
   ['Serpentes do Pântano', 'SER'], ['Cometas de Hira\'a', 'CMT'], ['Lagartas de Makapu', 'LAG'], ['Javalis da Montanha', 'JAV']],
];
const PRIZES = { win: 1000, semi: 5000, vice: 12000, champ: 25000, promotion: 15000 };

// marcas inventadas da Cidade República
const SPONSOR_NAMES = ['Chá Jasmim Dourado', 'Bolinhos da Tia Mei', 'Lanternas Wu & Filhos', 'Estaleiro Baía Yue', 'Fogos Dragão Vermelho',
  'Alfaiataria Lótus Branca', 'Seguros Rocha Firme', 'Ferrovia Pico Norte', 'Pomar de Lichias Ho', 'Gráfica Pena de Tinta',
  'Rádio Onda Alta', 'Sabonetes Brisa do Porto', 'Mercearia Três Luas', 'Relojoaria Engrenagem', 'Peixaria Polo Sul'];
const META_TYPES = {
  wins3:  { tier: 'easy',   label: 'Vencer 6 partidas',                   need: 6 },
  ko1:    { tier: 'easy',   label: 'Conseguir 2 nocautes',                need: 2 },
  wins5:  { tier: 'medium', label: 'Vencer 9 partidas',                   need: 9 },
  top4:   { tier: 'medium', label: 'Terminar a fase de pontos entre os 4 primeiros' },
  ko3:    { tier: 'medium', label: 'Conseguir 5 nocautes',                need: 5 },
  final:  { tier: 'hard',   label: 'Chegar à final' },
  first:  { tier: 'hard',   label: 'Terminar a fase de pontos em 1º' },
  streak3:{ tier: 'hard',   label: 'Vencer 4 partidas seguidas',         need: 4 },
  champ:  { tier: 'hard',   label: 'Ser campeão da divisão' },
  home:   { tier: 'hard',   label: 'Perder no máximo 1 vez em casa na fase de pontos', need: 1 },
  promo:  { tier: 'hard',   label: 'Conseguir o acesso', div: 'lower' },
};
const TIER_VALUES = { easy: [1100, 1500, 4000, 6500], medium: [1600, 2100, 7000, 11000], hard: [2200, 3000, 13000, 20000] };
const TIER_LABEL = { easy: 'Fácil', medium: 'Média', hard: 'Difícil' };

// ---- popularidade e eventos ----
// Eventos da semana: a Exibição na praça está sempre disponível; outros 2 aparecem a cada rodada.
// renda = (base + porPop × popularidade) × multiplicador da divisão; custa energia; dá popularidade.
const EVENTS = {
  // v0.15: 2 vagas (com elenco de até 9, vagas livres viravam renda fácil com os reservas)
  praca:      { name: 'Exibição na praça',              req: 0,  slots: 2,  base: 200, perPop: 6, energy: 8,  pop: 2, always: true, phys: true },
  radio:      { name: 'Comercial de rádio',             req: 40, slots: 1,  base: 600, perPop: 20, energy: 6,  pop: 3 },
  autografos: { name: 'Sessão de autógrafos',           req: 25, slots: 2,  base: 300, perPop: 14, energy: 8,  pop: 2 },
  beneficente:{ name: 'Evento beneficente',             req: 0,  slots: 2,  base: 0,   perPop: 0,  energy: 10, pop: 6 },
  festival:   { name: 'Festival da Cidade República',   req: 50, slots: 3,  base: 500, perPop: 18, energy: 14, pop: 4, phys: true },
  jornal:     { name: 'Entrevista ao jornal',           req: 30, slots: 1,  base: 200, perPop: 8,  energy: 3,  pop: 3 },
  escola:     { name: 'Aula numa escola de dominação',  req: 0,  slots: 1,  base: 400, perPop: 4,  energy: 10, pop: 3, phys: true },
};
const POP_GAIN = { played: 0.6, win: 1, push: 0.4, fall: 1, bench: -1 };

// ---- popularidade do time (fama) ----
const FAME = { win: 1.5, ko: 0.8, loss: -1.2, event: 0.3, semi: 3, final: 4, champ: 8, promotion: 10, relegation: -10 };
function initialFame(div, base, r) { const [f0, b0, k] = DIVS[div].fame; return Math.max(1, Math.round(f0 + (base - b0) * k + r() * 10)); }
function addFame(t, v) { t.fame = Math.max(0, Math.min(100, Math.round((t.fame + v) * 10) / 10)); }

// ---- estresse do bender (0 a 100) ----
// ganhos são multiplicados pelo temperamento (calmo 20 ≈ ×0,78; explosivo 90 ≈ ×1,41); descanso alivia bastante
const STRESS = { match: 4, loss: 4, win: -3, crowd: 6, meta: 1.5, train: 2, event: 1, rest: -15, bench: -4, natural: -4 };
function addStress(p, v) {
  const m = v > 0 ? 0.6 + p.st.tmp / 100 * 0.9 : 1;
  p.stress = Math.max(0, Math.min(100, Math.round(((p.stress || 0) + v * m) * 10) / 10));
}
function stressLabel(s) { return s < 25 ? 'Tranquilo' : s < 50 ? 'Tenso' : s < 75 ? 'Estressado' : 'No limite'; }
function eventIncome(L, p, key) { const E = EVENTS[key], t = teamOf(L, p); return Math.round((E.base + E.perPop * p.st.pop) * DIVS[t ? t.div : 0].mult / 10) * 10; }
// renda simplificada da IA: cobre a folha (Primeira com 10% de sobra, Segunda com 5% a menos), com piso por divisão
// times já ricos (acima de ¥40 mil) recebem menos que a folha, para não acumularem sem limite
// teto da renda da IA por divisão: um time de baixo não sustenta folha de time de cima (vende ou não contrata)
function aiIncomeCap(t) { return DIVS[t.div].aiIncome * 1.35; }
function aiIncome(t) { return Math.max(DIVS[t.div].aiIncome * 0.6, Math.min(aiIncomeCap(t), Math.round(payroll(t) * (t.cash > 80000 ? 0.55 : t.cash > 40000 ? 0.8 : t.div === 0 ? 1.05 : 0.95)))); }
function teamOf(L, p) { return L.teams.find((t) => t.roster.includes(p)) || null; }
// popularidade do time: média dos 3 benders mais populares
function teamPop(t) { const v = t.roster.map((p) => p.st.pop).sort((a, b) => b - a).slice(0, 3); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : 0; }
// explosivos são o show do time: ganham popularidade mais rápido
function popGain(p, v) { return v > 0 ? v * (1 + Math.max(0, p.st.tmp - 50) / 100) : v; }
function addPop(p, v) { p.st.pop = Math.max(0, Math.min(100, Math.round((p.st.pop + popGain(p, v)) * 10) / 10)); }
function makeEvents(L, r) {
  const extra = Object.keys(EVENTS).filter((k) => !EVENTS[k].always).sort(() => r() - 0.5).slice(0, 2);
  const list = ['praca', ...extra], days = EVENT_DAYS.slice().sort(() => r() - 0.5);
  L.evDay = {}; list.forEach((k, i) => { L.evDay[k] = days[i]; });
  return list;
}
const evDayOf = (L, key) => (L.evDay && L.evDay[key]) || 'sab';
function eventTaken(L, key, exceptId) {
  const me = L.teams[L.user];
  return me.roster.filter((p) => p.id !== exceptId && p.ev === key).length;
}
function canDoEvent(L, p, key) {
  const E = EVENTS[key];
  return !!E && L.events.includes(key) && p.st.pop >= E.req && eventTaken(L, key, p.id) < E.slots && !(E.phys && isInjured(p));
}

// nota geral: média ponderada pelo impacto medido de cada atributo nas partidas
function ovr(st) {
  return Math.round((st.pow * 1.25 + st.pre * 1.0 + st.agi * 1.1 + st.fir * 1.2 + st.dis * 0.6 + st.lei * 0.85) / 6.0);
}
function tmpLabel(t) { return t < 35 ? 'Calmo' : t > 65 ? 'Explosivo' : 'Equilibrado'; }
// salário por rodada: cresce mais rápido que a nota (nota 70 = ¥1.400, nota 56 ≈ ¥730, nota 80 ≈ ¥1.960)
// com elenco de 6 a 9, cada salário vale 75% da tabela antiga: a folha de um elenco médio (7 a 8) fica cerca de 15% acima da de antes (4)
const WAGE_K = 0.75;
function rawSalary(p) { return 1400 * Math.pow(Math.max(0.15, (ovr(p.st) - 30) / 40), 1.5); }
function salary(p) { return Math.round(rawSalary(p) * WAGE_K / 10) * 10; }
// benders populares valem mais e pedem luvas maiores
// valor de mercado: jovens com potencial valem mais, veteranos menos
function ageFactor(age) { return age <= 21 ? 1.35 : age <= 25 ? 1.15 : age <= 29 ? 1 : age <= 31 ? 0.75 : 0.5; }
function marketValue(p, starter) {
  const potBonus = 1 + Math.max(0, (p.pot || 0) - ovr(p.st)) * 0.02;
  return Math.round(rawSalary(p) * 10 * (starter ? 1.25 : 1) * (1 + (p.st.pop || 0) / 150) * ageFactor(p.age || 26) * potBonus / 100) * 100;
}
// salário pedido numa renovação: benders populares pedem mais
function askWage(p) { return Math.round(salary(p) * (1 + (p.st.pop || 0) / 250) / 10) * 10; }
function signingFee(p) { return Math.round(rawSalary(p) * 2 * (1 + (p.st.pop || 0) / 200) / 10) * 10; }
// folha: cada bender recebe o salário fixado no contrato (wage); sem contrato, o salário pedido hoje
function wageOf(p) { return p.wage || salary(p); }
function payroll(t) { return t.roster.reduce((a, p) => a + wageOf(p), 0); }

function rngOf(L) { const r = mulberry32(L.rngState); return () => { const v = r(); L.rngState = (L.rngState + 0x9E3779B1) | 0; return v; }; }

// idade: maioria entre 21 e 29; jovens começam mais fracos, mas com mais potencial
function randomAge(r) { return Math.round(18 + (r() + r() + r()) / 3 * 15); }
function potGap(age, r) { return age <= 20 ? 8 + r() * 12 : age <= 23 ? 4 + r() * 9 : age <= 26 ? 1 + r() * 5 : r() * 2; }
function makePlayer(L, r, elem, base, age) {
  age = age || randomAge(r);
  base += age <= 20 ? -6 : age <= 23 ? -3 : 0;
  let n, tries = 0;
  do { n = NAMES[Math.floor(r() * NAMES.length)]; if (++tries > 60) n += ' ' + 'IVX'[tries % 3]; } while (L.usedNames.has(n));
  L.usedNames.add(n);
  const st = {};
  for (const k of TRAINABLE) st[k] = randStat(r, base);
  st.tmp = Math.round(15 + r() * 75);
  if (elem === 'earth') { st.fir = Math.min(95, st.fir + 8); st.agi = Math.max(35, st.agi - 6); }
  if (elem === 'fire') { st.agi = Math.min(95, st.agi + 6); st.fir = Math.max(35, st.fir - 6); }
  st.pop = Math.max(0, initialPop(st, r) - (age <= 20 ? 10 : 0));
  const p = { id: L.nextId++, name: n, elem, st, age, inj: 0, energy: 100, stress: Math.round(r() * 15), plan: 'rest', season: { games: 0, hits: 0, pushes: 0, falls: 0 } };
  p.pot = Math.min(95, Math.round(ovr(st) + potGap(age, r)));
  p.contract = 1 + Math.floor(r() * 3); p.wage = salary(p);
  return p;
}
// contrato novo: salário pedido hoje; jovens assinam por 3 temporadas, os demais por 2
function hire(p) { p.wage = salary(p); p.contract = p.age <= 21 ? 3 : 2; p.expiring = false; p.plan = 'rest'; }

function initialPop(st, r) { return Math.round(Math.max(2, Math.min(85, (ovr(st) - 45) * 1.6 + r() * 18 + Math.max(0, st.tmp - 50) * 0.2))); }

function roundRobin(n) {
  const ids = [...Array(n).keys()], weeks = [];
  for (let w = 0; w < n - 1; w++) {
    const games = [];
    for (let i = 0; i < n / 2; i++) { const a = ids[i], b = ids[n - 1 - i]; games.push(w % 2 ? [b, a] : [a, b]); }
    weeks.push(games);
    ids.splice(1, 0, ids.pop());
  }
  return weeks;
}

// turno (7 rodadas) e returno (as mesmas 7, com o mando invertido)
function doubleRoundRobin(ids) {
  const first = roundRobin(ids.length).map((wk) => wk.map(([a, b]) => [ids[a], ids[b]]));
  return first.concat(first.map((wk) => wk.map(([h, a]) => [a, h])));
}
function addDivisionTeams(L, r, di) {
  const D = DIVS[di], bases = D.bases.slice().sort(() => r() - 0.5), ids = [];
  // a Terceira tem elencos mais jovens: mais promessas
  const age = () => di === 2 && r() < 0.25 ? 17 + Math.floor(r() * 4) : undefined;
  TEAM_LIST[di].forEach(([name, short], i) => {
    const base = bases[i], idx = L.teams.length;
    // 3 titulares, 1 reserva de cada elemento e de 0 a 3 benders a mais (mais fracos, muitas vezes jovens): elenco de 6 a 9
    const roster = ELEMS.map((e) => makePlayer(L, r, e, base, age()));
    for (const e of ELEMS) roster.push(makePlayer(L, r, e, base - 5 - Math.floor(r() * 4), age()));
    const extra = Math.floor(r() * 4);
    for (let k = 0; k < extra; k++) roster.push(makePlayer(L, r, ELEMS[Math.floor(r() * 3)], base - 9 - Math.floor(r() * 5), r() < 0.5 ? 17 + Math.floor(r() * 4) : age()));
    L.teams.push({ idx, div: di, name, short, color: LEAGUE_COLORS[di * 8 + i], arena: r() < 0.5 ? 'round' : 'square', fame: initialFame(di, base, r),
      style: Object.keys(STYLES)[Math.floor(r() * 3)], targeting: ['free', 'focus', 'free'][Math.floor(r() * 3)], posture: 'bal',
      roster, starters: {}, cash: D.cash, rec: { w: 0, l: 0, rf: 0, ra: 0, ko: 0, homeL: 0 }, streak: 0, bestStreak: 0, wins: 0, kos: 0 });
    ids.push(idx);
  });
  return ids;
}
function newLeague(seed) {
  const r = mulberry32(seed);
  const L = { v: 2, seed, rngState: seed, nextId: 1, usedNames: new Set(), season: 1, week: 0, phase: 'preseason', user: null,
    teams: [], divs: [], results: [], freeAgents: [], sponsorOffers: [], sponsors: [], trainMode: 'ind', teamPlan: 'rest',
    lastReport: null, movement: null, events: [] };
  DIVS.forEach((D, di) => {
    const ids = addDivisionTeams(L, r, di);
    L.divs.push({ teams: ids, schedule: doubleRoundRobin(ids), playoffs: null, champion: null });
  });
  for (const t of L.teams) autoStarters(t);
  return L;
}

// o técnico assume um time: gera as propostas de patrocínio e o mercado da pré-temporada
// ---- carreira do técnico ----
// expectativa da diretoria: posição do time no ranking de notas da divisão
function expectedPos(L, idx) {
  const t = L.teams[idx];
  return L.teams.filter((o) => o.div === t.div).sort((a, b) => teamOVR(b) - teamOVR(a)).indexOf(t) + 1;
}
const BOARD_GOAL = (div, pos) => div > 0 ? (pos <= 2 ? 'Conseguir o acesso' : pos <= 4 ? 'Chegar às semifinais' : 'Terminar no meio da tabela')
  : (pos <= 2 ? 'Ser campeão' : pos <= 4 ? 'Chegar às semifinais' : pos <= 6 ? 'Terminar no meio da tabela' : 'Evitar o rebaixamento');
// reputação mínima para um time se interessar pelo técnico
function repNeeded(t) { const [n0, b0, k] = DIVS[t.div].need; return Math.max(0, n0 + (teamOVR(t) - b0) * k); }
function seasonRepDelta(L) {
  const me = userTeam(L), D = L.divs[me.div], pos = D.table.indexOf(me.idx) + 1, exp = L.coach.expect || expectedPos(L, me.idx);
  let d = (exp - pos) * 2.5, why = [`${pos}º lugar com expectativa de ${exp}º`];
  if (D.playoffs && D.playoffs.semis.flat().includes(me.idx)) { d += 3; why.push('playoffs'); }
  if (D.champion === me.idx) { d += DIVS[me.div].champRep; why.push('título'); }
  if (L.movement.up.includes(me.idx)) { d += 8; why.push('acesso'); }
  if (L.movement.down.includes(me.idx)) { d -= 10; why.push('rebaixamento'); }
  // nas divisões de baixo a fama do técnico cresce mais devagar e tem teto
  const DV = DIVS[me.div];
  if (me.div > 0 && d > 0) { d = Math.min(d * DV.repMul, Math.max(0, DV.repCap - L.coach.rep)); why.push(`${DV.short} divisão rende menos fama`); }
  return { d: Math.round(d * 10) / 10, why };
}
// divisão de cada time na próxima temporada (já com acesso e rebaixamento)
function nextDiv(L, idx) {
  const mv = L.movement; if (!mv) return L.teams[idx].div;
  if (mv.dest) return mv.dest[idx] !== undefined ? mv.dest[idx] : L.teams[idx].div;
  return mv.up.includes(idx) ? 0 : mv.down.includes(idx) ? 1 : L.teams[idx].div; // saves antigos
}
function makeCoachOffers(L, r) {
  const rep = L.coach.rep, myDiv = nextDiv(L, L.user), myOvr = teamOVR(userTeam(L));
  // só interessa uma proposta que não seja um passo atrás: divisão melhor, ou mesma divisão com elenco parecido ou melhor
  const worthIt = (t) => { const d = nextDiv(L, t.idx); return d < myDiv || (d === myDiv && teamOVR(t) >= myOvr - 2); };
  return L.teams.filter((t) => t.idx !== L.user && worthIt(t) && rep >= repNeeded(t) - 5 && r() < 0.5)
    .sort((a, b) => repNeeded(b) - repNeeded(a)).slice(0, 3)
    .map((t) => ({ team: t.idx, goal: BOARD_GOAL(t.div, expectedPos(L, t.idx)) }));
}
// ---- confiança da diretoria e demissão ----
// com 14 rodadas, cada resultado mexe menos na confiança
const CONF_MATCH = PER_MATCH;
const CONF = { win: 5, loss: -6, perPos: 1, debt: -3, badStreak: -4, start: 55, takeover: 60, fireMid: 0, fireEnd: 20, repLoss: 6 };
function confLabel(c) { return c >= 60 ? 'Firme' : c >= 35 ? 'Atenção' : c >= 15 ? 'Pressão' : 'Por um fio'; }
// propostas para quem foi demitido: times de nível menor, sempre pelo menos 2
function rescueOffers(L, exclude) {
  const rep = L.coach.rep, pool = L.teams.filter((t) => t.idx !== L.user && t.idx !== exclude).sort((a, b) => repNeeded(a) - repNeeded(b));
  let list = pool.filter((t) => repNeeded(t) <= rep + 10).slice(-3);
  if (list.length < 2) list = pool.slice(0, 2);
  return list.map((t) => ({ team: t.idx, goal: BOARD_GOAL(t.div, expectedPos(L, t.idx)) }));
}
function fireCoach(L, when, reason) {
  const me = userTeam(L);
  L.coach.rep = Math.max(0, Math.round((L.coach.rep - CONF.repLoss) * 10) / 10);
  L.coach.fired = { when, reason, team: me.idx, season: L.season, week: L.week };
  L.coach.firedLog = (L.coach.firedLog || []).concat([{ season: L.season, team: me.name, when, week: L.week }]);
  L.coach.accepted = null;
  L.coach.offers = rescueOffers(L, me.idx);
}
// depois de uma demissão no meio da temporada: assume o novo time na hora
function takeJob(L, idx) {
  const f = L.coach.fired;
  if (!f || f.when !== 'mid' || !L.coach.offers.some((o) => o.team === idx)) return false;
  for (const p of userTeam(L).roster) p.plan = 'rest';
  L.user = idx; L.sponsors = []; L.trainMode = 'ind'; L.teamPlan = 'rest';
  for (const p of userTeam(L).roster) p.plan = 'rest';
  L.coach.expect = expectedPos(L, idx); L.coach.conf = CONF.takeover;
  L.coach.fired = null; L.coach.offers = [];
  return true;
}
function updateConfidence(L, res, phase) {
  const me = userTeam(L), mine = res.find((r) => r.h === me.idx || r.a === me.idx);
  if (!mine || L.coach.conf === undefined) return 0;
  const before = L.coach.conf;
  // vencer um time mais forte vale mais; perder para um mais forte pesa menos
  const opp = mine.h === me.idx ? mine.a : mine.h, gap = expectedPos(L, me.idx) - expectedPos(L, opp);
  let d = (mine.winner === me.idx ? Math.max(2, Math.min(8, CONF.win + gap * 0.5)) : Math.max(-9, Math.min(-2, CONF.loss + gap * 0.6))) * CONF_MATCH;
  if (phase === 'season' && L.week >= 2) {
    const pos = standings(L, me.div).indexOf(me) + 1;
    d += (L.coach.expect - pos) * CONF.perPos * CONF_MATCH; // posição atual contra a expectativa
  }
  if (me.cash < 0) d += CONF.debt * CONF_MATCH;
  if (me.streak === 0 && formOf(L, me.idx, 3).join('') === 'DDD') d += CONF.badStreak * CONF_MATCH;
  L.coach.conf = Math.max(0, Math.min(100, Math.round((before + d) * 10) / 10));
  return L.coach.conf - before;
}

function chooseCoachOffer(L, idx) {
  if (L.phase !== 'done') return false;
  L.coach.accepted = L.coach.accepted === idx ? null : idx; // clicar de novo desfaz
  return true;
}

function setUser(L, idx) {
  L.user = idx;
  L.coach = L.coach || { rep: DIVS[L.teams[idx].div].repStart, offers: [], expect: null, accepted: null, last: null };
  const r = rngOf(L), div = L.teams[idx].div;
  L.sponsorOffers = makeOffers(L, r, div, L.teams[idx].fame);
  L.events = makeEvents(L, r);
  L.freeAgents = [];
  for (let i = 0; i < 10; i++) L.freeAgents.push(makePlayer(L, r, ELEMS[i % 3], DIVS[div].faBase + (i < 2 ? 10 : 0), i >= 8 ? 17 + i - 8 : undefined));
  for (const p of L.freeAgents) { p.contract = 0; p.wage = 0; }
  L.window = newWindow(L, r);
}

// um time mais popular recebe propostas maiores (popularidade 20 ≈ ×0,93, 60 ≈ ×1,09)
function popFactor(pop) { return 0.85 + pop / 100 * 0.4; }
// a popularidade do time define a expectativa dos patrocinadores: time famoso recebe mais dinheiro, mas metas mais difíceis
function offerTiers(fame) { return fame < 35 ? ['easy', 'easy', 'medium', 'hard'] : fame <= 65 ? ['easy', 'medium', 'medium', 'hard'] : ['medium', 'medium', 'hard', 'hard']; }
function makeOffers(L, r, div, pop = 30) {
  const tiers = offerTiers(pop), used = new Set(), names = SPONSOR_NAMES.slice().sort(() => r() - 0.5);
  return tiers.map((tier, i) => {
    const opts = Object.keys(META_TYPES).filter((k) => META_TYPES[k].tier === tier && !used.has(k) && (META_TYPES[k].div === undefined || (META_TYPES[k].div === 'lower' ? div > 0 : META_TYPES[k].div === div)));
    const meta = opts[Math.floor(r() * opts.length)]; used.add(meta);
    const [b0, b1, x0, x1] = TIER_VALUES[tier], mult = DIVS[div].mult * popFactor(pop);
    return { id: `sp${L.season}-${i}-${Math.floor(r() * 1e6)}`, name: names[i], tier, meta,
      base: Math.round((b0 + r() * (b1 - b0)) * mult / 50) * 50, bonus: Math.round((x0 + r() * (x1 - x0)) * mult / 500) * 500 };
  });
}
function signSponsor(L, id) {
  if (L.phase !== 'preseason' || L.sponsors.length >= 2) return false;
  const o = L.sponsorOffers.find((s) => s.id === id); if (!o) return false;
  L.sponsorOffers = L.sponsorOffers.filter((s) => s !== o);
  L.sponsors.push({ ...o, status: 'pending' });
  return true;
}
function dropSponsor(L, id) {
  if (L.phase !== 'preseason') return false;
  const s = L.sponsors.find((x) => x.id === id); if (!s) return false;
  L.sponsors = L.sponsors.filter((x) => x !== s);
  delete s.status; L.sponsorOffers.push(s);
  return true;
}
function metaProgress(L, s) {
  const me = L.teams[L.user], M = META_TYPES[s.meta];
  if (s.meta.startsWith('wins')) return `${Math.min(me.wins, M.need)} de ${M.need}`;
  if (s.meta.startsWith('ko')) return `${Math.min(me.kos, M.need)} de ${M.need}`;
  if (s.meta === 'streak3') return `melhor sequência: ${me.bestStreak}`;
  if (s.meta === 'home') return `${me.rec.homeL} derrota(s) em casa`;
  return '';
}

function playerById(L, id) {
  for (const t of L.teams) { const p = t.roster.find((q) => q.id === id); if (p) return p; }
  return L.freeAgents.find((q) => q.id === id) || null;
}
function teamOVR(t) { const s = starters(t); return s.length ? Math.round(s.reduce((a, p) => a + ovr(p.st), 0) / s.length) : 0; }
function starters(t) { return ELEMS.map((e) => t.roster.find((p) => p.id === t.starters[e])).filter(Boolean); }
function autoStarters(t) {
  for (const e of ELEMS) {
    const all = t.roster.filter((p) => p.elem === e), fit = all.filter((p) => !isInjured(p));
    if (!all.length) { delete t.starters[e]; continue; }
    const opts = fit.length ? fit : [all.reduce((b, p) => (p.inj < b.inj ? p : b))];
    t.starters[e] = opts.reduce((b, p) => (ovr(p.st) * (0.7 + 0.3 * p.energy / 100) > ovr(b.st) * (0.7 + 0.3 * b.energy / 100) ? p : b)).id;
  }
}
// titular lesionado do técnico: entra o melhor reserva sadio do elemento (se houver)
function fixInjuredStarters(t) {
  const out = [];
  for (const e of ELEMS) {
    const s = t.roster.find((p) => p.id === t.starters[e]);
    if (!s || !isInjured(s)) continue;
    const fit = t.roster.filter((p) => p.elem === e && !isInjured(p));
    if (!fit.length) continue;
    const b = fit.reduce((a, p) => (ovr(p.st) > ovr(a.st) ? p : a));
    t.starters[e] = b.id; out.push({ out: s.name, in: b.name });
  }
  return out;
}
function isStarter(L, p) { return L.teams.some((t) => t.starters[p.elem] === p.id); }

// atributos em quadra: cansaço reduz o rendimento (energia 100 = 100%, energia 0 = 78%)
// estresse pesa mais nos atributos mentais (Precisão, Disciplina, Leitura): até −25% com estresse 100; nos físicos, até −8%
const MENTAL = new Set(['pre', 'dis', 'lei']);
function matchStats(p) {
  const f = 0.78 + 0.22 * p.energy / 100, s = (p.stress || 0) / 100, st = {};
  for (const k of TRAINABLE) st[k] = Math.round(p.st[k] * f * (1 - (MENTAL.has(k) ? 0.25 : 0.08) * s));
  st.tmp = p.st.tmp; st.stress = p.stress || 0; st.energy = Math.round(p.energy ?? 100); st.ovr = ovr(p.st); // energia e nota só para a tela
  return st;
}
function matchDef(L, t, auto) {
  return { name: t.name, short: t.short, color: t.color, pop: t.fame, posture: auto ? t.style : t.posture, targeting: t.targeting, formation: t.formation || 'open',
    style: t.style, auto, players: starters(t).map((p) => ({ id: p.id, name: p.name, elem: p.elem, st: matchStats(p), injured: isInjured(p) })),
    // banco: reservas sadios, que podem entrar no intervalo entre os rounds
    bench: t.roster.filter((p) => !starters(t).includes(p) && !isInjured(p)).map((p) => ({ id: p.id, name: p.name, elem: p.elem, st: matchStats(p) })) };
}
// técnico da IA: escolhe a postura no início de cada round conforme o placar e o estilo do time
// também escolhe a formação e dá instruções individuais de acordo com o estilo
function aiCoach(m, ti) {
  const me = m.teams[ti], op = m.teams[1 - ti], st = me.style;
  let posture = st;
  const losing = me.roundWins < op.roundWins;
  if (m.round > 1) {
    if (losing) posture = 'agg';
    else if (me.roundWins > op.roundWins) posture = st === 'agg' ? 'bal' : 'def';
  }
  let formation = { agg: 'stagger', bal: 'compact', def: 'open' }[st];
  // depois de perder um round, o técnico da IA lê a formação do rival na arena e costuma trocar para a que a vence
  const last = m.roundLog && m.roundLog[m.roundLog.length - 1];
  if (m.round > 1 && last && last.winner !== ti && m.rng() < 0.7) formation = Object.keys(FORM_BEATS).find((k) => FORM_BEATS[k] === op.formation) || formation;
  // o técnico defensivo segura o placar com o Duelo de elementos quando está ganhando
  const targeting = st === 'def' && me.roundWins > op.roundWins ? 'mirror' : me.baseTargeting;
  const instr = {};
  if (st === 'agg' || losing) instr.earth = 'press';
  else if (st === 'def') instr.earth = 'protect';
  if (st !== 'agg') instr.fire = 'distance';
  return { posture, formation, instr, targeting };
}

const STAGE = { season: (L) => `Rodada ${L.week + 1}`, semis: () => 'Semifinal', final: () => 'Final' };
function currentFixtures(L) {
  const out = [];
  L.divs.forEach((D, di) => {
    let games = [];
    if (L.phase === 'season') games = D.schedule[L.week];
    else if (L.phase === 'semis') games = D.playoffs.semis;
    else if (L.phase === 'final') games = [D.playoffs.final];
    for (const [h, a] of games) out.push({ h, a, div: di, stage: STAGE[L.phase](L) });
  });
  return out;
}
function userFixture(L) { return currentFixtures(L).find((f) => f.h === L.user || f.a === L.user) || null; }

function simFixture(L, f) {
  const r = rngOf(L), H = L.teams[f.h], A = L.teams[f.a];
  const m = createMatch([matchDef(L, H, true), matchDef(L, A, true)], Math.floor(r() * 1e9), H.arena, aiCoach);
  let n = 0;
  while (m.mode !== 'over' && n++ < 200000) { step(m); if (m.events.length > 400) m.events.length = 0; }
  return m;
}
function resultOf(m, f, detail) {
  const r = { h: f.h, a: f.a, div: f.div, stage: f.stage, winner: m.winner === 0 ? f.h : f.a, score: [m.teams[0].roundWins, m.teams[1].roundWins], ko: m.winReason === 'ko',
    stats: m.teams.map((t) => (t.played || t.players).map((p) => ({ ref: p.ref, hits: p.stats.hits, pushes: p.stats.pushes, falls: p.stats.falls, injured: p.injured === 'match' }))) };
  // relatório completo só para a partida do técnico
  if (detail) {
    // destaque: empurrões e quedas decidem partidas; acertos, bloqueios e esquivas contam pouco (são muito numerosos)
    const score = (s) => s.pushes * 5 + s.falls * 10 + s.hits * 0.03 + s.blocks * 0.02 + s.dodges * 0.01 - s.fouls * 2;
    let mvp = null, best = -1e9;
    r.detail = {
      rounds: m.roundLog.map((x, i) => ({ round: x.round, winner: x.winner === 0 ? f.h : f.a, reason: x.reason, tactics: (m.tacticLog || [])[i] || null })),
      players: m.teams.map((t) => (t.played || t.players).map((p) => {
        const s = p.stats, sc = score(s);
        if (sc > best) { best = sc; mvp = p.ref; }
        return { ref: p.ref, name: p.name, elem: p.elem, injured: p.injured === 'match', shots: s.shots, hits: s.hits, pushes: s.pushes, falls: s.falls, dodges: s.dodges, blocks: s.blocks, fouls: s.fouls, disobey: s.disobey || 0, stress: p.st.stress || 0 };
      })),
    };
    r.detail.mvp = mvp;
  }
  return r;
}
// últimos resultados de um time na temporada ('V' ou 'D'), do mais antigo ao mais recente
function formOf(L, idx, n = 5) {
  return L.results.flat().filter((r) => r.h === idx || r.a === idx).slice(-n).map((r) => (r.winner === idx ? 'V' : 'D'));
}
// o que se sabe do técnico rival: tendências do estilo dele (as mesmas regras do técnico da IA)
const STYLE_TENDENCY = {
  agg: { posture: 'agg', formation: 'stagger', instr: 'a terra pressiona na linha' }, // depois de perder um round, costuma trocar para a formação que vence a do rival
  bal: { posture: 'bal', formation: 'compact', instr: 'o fogo mantém distância' },
  def: { posture: 'def', formation: 'open', instr: 'a terra protege os companheiros e o fogo mantém distância' },
};

// histórico de atributos dos benders do técnico ao longo da temporada (para o gráfico de evolução)
function snapHistory(L, reset) {
  for (const p of userTeam(L).roster) {
    if (reset || !p.hist) p.hist = [];
    const snap = { w: reset ? 0 : p.hist.length ? p.hist[p.hist.length - 1].w + 1 : 0 };
    for (const k of TRAINABLE) snap[k] = Math.round(p.st[k] * 10) / 10;
    p.hist.push(snap);
  }
}
function startSeason(L) {
  const me = L.teams[L.user];
  if (L.phase !== 'preseason' || seasonBlockers(L).length || rosterShort(L)) return false;
  // quem ficou sem renovação vai embora de graça
  for (const p of me.roster.filter((q) => q.expiring)) {
    me.roster = me.roster.filter((q) => q !== p); p.expiring = false; p.contract = 0; p.wage = 0; L.freeAgents.push(p);
    news(L, `${p.name} deixa ${me.name} ao fim do contrato.`);
  }
  autoStarters(me);
  if (!ELEMS.every((e) => me.starters[e])) return false;
  // última rodada de negócios da IA antes de fechar a janela
  aiWindowMoves(L, rngOf(L));
  for (const t of L.teams) if (t.idx !== L.user) autoStarters(t);
  snapHistory(L, true);
  L.window.offers = [];
  L.coach.expect = expectedPos(L, L.user);
  L.coach.conf = Math.max(40, Math.min(70, Math.round(CONF.start + (L.coach.rep - 30) * 0.3)));
  L.phase = 'season'; L.day = 'mon'; L.weekLog = null;
  return true;
}

// encerra a rodada: recebe a partida do técnico (ou null para simular) e simula o resto
function finishWeek(L, userMatch) {
  const week = runWeekDays(L) || { gains: [], events: [], injuries: [], subs: [], cashBefore: L.teams[L.user].cash };
  const fixtures = currentFixtures(L), res = [], money = { salaries: 0, sponsors: 0, prizes: 0, bonuses: [] };
  const me = L.teams[L.user], cashBefore = week.cashBefore, phase = L.phase;
  for (const f of fixtures) {
    const isUser = f.h === L.user || f.a === L.user;
    res.push(resultOf(isUser && userMatch ? userMatch : simFixture(L, f), f, isUser));
  }
  const played = new Set(), result = {}, newInj = [];
  money.events = week.events;
  const fameBefore = me.fame;
  for (const rs of res) {
    const W = L.teams[rs.winner], Lo = L.teams[rs.winner === rs.h ? rs.a : rs.h], H = L.teams[rs.h], A = L.teams[rs.a];
    W.wins++; W.streak++; W.bestStreak = Math.max(W.bestStreak, W.streak); Lo.streak = 0;
    result[W.idx] = 'w'; result[Lo.idx] = 'l';
    addFame(W, (FAME.win + (rs.ko ? FAME.ko : 0)) * PER_MATCH); addFame(Lo, FAME.loss * PER_MATCH);
    if (rs.ko) W.kos++;
    if (phase === 'season') {
      W.rec.w++; Lo.rec.l++;
      if (Lo === H) H.rec.homeL++;
      H.rec.rf += rs.score[0]; H.rec.ra += rs.score[1]; A.rec.rf += rs.score[1]; A.rec.ra += rs.score[0];
      if (rs.ko) W.rec.ko++;
      const pz = PRIZES.win * DIVS[W.div].mult; W.cash += pz;
      if (W === me) money.prizes += pz;
    }
    rs.stats.forEach((side, si) => side.forEach((s) => {
      const p = playerById(L, s.ref); if (!p) return;
      p.season.games++; p.season.hits += s.hits; p.season.pushes += s.pushes; p.season.falls += s.falls;
      played.add(p.id);
      if (s.injured) newInj.push(p);
      const won = (si === 0 ? rs.h : rs.a) === rs.winner;
      addPop(p, (POP_GAIN.played + (won ? POP_GAIN.win : 0) + s.pushes * POP_GAIN.push + s.falls * POP_GAIN.fall) * PER_MATCH);
    }));
  }
  // salários e receitas fixas da rodada
  for (const t of L.teams) {
    const pay = payroll(t); t.cash -= pay;
    if (t === me) {
      money.salaries = pay;
      for (const s of L.sponsors) { t.cash += s.base; money.sponsors += s.base; }
    } else t.cash += aiIncome(t);
  }
  const injuries = applyInjuries(L, newInj, rngOf(L));
  applySunday(L, played, result);
  injuries.mine = week.injuries.concat(injuries.mine);
  injuries.subs = (week.subs || []).concat(fixInjuredStarters(me));
  const gains = week.gains;
  snapHistory(L, false);
  L.events = makeEvents(L, rngOf(L));
  // nova segunda-feira: eventos da semana passada saem do plano
  for (const p of me.roster) if (p.ev && !L.events.includes(p.ev)) p.ev = null;
  L.day = 'mon'; L.weekLog = null;
  L.results.push(res);
  const confBefore = L.coach.conf;
  if (!L.coach.fired) updateConfidence(L, res, phase);
  advancePhase(L, res, money);
  // demissão no meio da temporada: confiança zerada a partir da 4ª rodada
  if (!L.coach.fired && L.phase === 'season' && L.week >= WEEKS / 2 && L.coach.conf <= CONF.fireMid) fireCoach(L, 'mid', 'A diretoria perdeu a confiança depois da sequência de resultados ruins.');
  checkMetas(L, money);
  L.lastReport = { stage: fixtures[0] ? fixtures[0].stage : '', results: res, gains, money, injuries, cashBefore, cashAfter: me.cash, fameBefore, fameAfter: me.fame, confBefore, confAfter: L.coach.conf };
  return L.lastReport;
}

// lesões: quem já estava lesionado cumpre mais uma semana; quem se machucou na partida ganha a duração sorteada
function applyInjuries(L, newInj, r) {
  const mine = [], fresh = new Set(newInj.map((p) => p.id)), me = L.teams[L.user];
  for (const t of L.teams) for (const p of t.roster) if (!fresh.has(p.id) && p.inj > 0) { p.inj--; if (!p.inj && t === me) mine.push({ name: p.name, healed: true }); }
  for (const p of newInj) {
    const w = injuryWeeks(r); p.inj = Math.max(p.inj || 0, w);
    if (me.roster.includes(p)) mine.push({ name: p.name, weeks: p.inj, where: 'partida' });
  }
  return { mine, count: newInj.length };
}
// segunda a sábado: descanso, treino de quarta e eventos de cada dia, para todos os times.
// Roda uma vez por semana, antes do jogo de domingo (o técnico vê o resultado no domingo e ainda pode mexer na escalação).
function runWeekDays(L) {
  if (L.day === 'sun' || !['season', 'semis', 'final'].includes(L.phase)) return L.weekLog || null;
  const r = rngOf(L), me = L.teams[L.user], log = { gains: [], events: [], injuries: [], cashBefore: me.cash, days: {} };
  const taken = {};
  for (const t of L.teams) {
    const isUser = t.idx === L.user;
    for (const p of t.roster) {
      // plano de quarta: treino ou descanso; a IA descansa quem está cansado ou estressado
      let plan = isUser ? (L.trainMode === 'team' ? L.teamPlan : p.plan) : (p.energy < 55 || (p.stress || 0) > 60 ? 'rest' : TRAINABLE[Math.floor(r() * TRAINABLE.length)]);
      if (!TRAINABLE.includes(plan)) plan = 'rest';
      const ev = isUser ? p.ev : null;
      for (const d of DAYS.slice(0, 6)) {
        if (d === 'qua') {
          if (TRAINABLE.includes(plan) && !isInjured(p)) {
            const k = plan, before = p.st[k], e0 = p.energy;
            // quanto mais alto o atributo, mais difícil evoluir; cansado treina pior; jovens evoluem mais rápido; perto do potencial quase não rende
            const ageM = p.age <= 20 ? 1.5 : p.age <= 23 ? 1.25 : p.age <= 27 ? 1 : p.age <= 30 ? 0.6 : 0.3;
            const o = ovr(p.st), pt = p.pot || 99, potM = o >= pt + 2 ? 0 : o >= pt ? 0.15 : 1;
            const g = (0.6 + r() * 1.6) * Math.max(0.15, 1 - (before - 35) / 75) * (0.6 + 0.4 * Math.max(0, e0) / 100) * ageM * potM * PER_MATCH;
            p.st[k] = Math.min(99, Math.round((before + g) * 10) / 10);
            p.energy = Math.max(0, e0 - DAY.train); addStress(p, DAY_STRESS.train);
            if (isUser) log.gains.push({ id: p.id, name: p.name, k, d: Math.round((p.st[k] - before) * 10) / 10 });
            // treinar cansado pode machucar (e a lesão já vale para o domingo)
            const ch = INJURY.trainBase + Math.max(0, INJURY.trainEnergy - e0) * INJURY.trainPerEnergy;
            if (r() < ch) { p.inj = injuryWeeks(r) ; p.injWed = true; if (isUser) log.injuries.push({ name: p.name, weeks: p.inj, where: 'treino de quarta' }); }
          } else { dayRecover(p); p.energy = Math.min(100, p.energy + DAY.restBonus); addStress(p, DAY_STRESS.free + DAY_STRESS.rest); }
          continue;
        }
        if (ev && evDayOf(L, ev) === d) {
          // evento do dia: só vale se ainda está na semana, cumpre o requisito, tem vaga e (se exige o físico) não está lesionado
          const E = EVENTS[ev]; taken[ev] = taken[ev] || 0;
          if (E && L.events.includes(ev) && p.st.pop >= E.req && taken[ev] < E.slots && !(E.phys && isInjured(p))) {
            taken[ev]++;
            const inc = eventIncome(L, p, ev);
            t.cash += inc; p.energy = Math.max(0, p.energy - E.energy); addPop(p, E.pop * PER_MATCH); addStress(p, DAY_STRESS.event); addFame(t, FAME.event * PER_MATCH);
            log.events.push({ name: p.name, event: E.name, amount: inc, day: d });
            continue;
          }
        }
        dayRecover(p); addStress(p, DAY_STRESS.free);
      }
      p.energy = Math.max(0, Math.min(100, p.energy));
    }
    if (!isUser) autoStarters(t);
  }
  log.subs = fixInjuredStarters(me);
  L.weekLog = log; L.day = 'sun';
  return log;
}
// domingo, depois do jogo: quem jogou gasta energia e acumula estresse conforme o resultado; quem ficou no banco tem o dia livre
function applySunday(L, played, result) {
  const pendingMetas = L.phase !== 'done' ? L.sponsors.filter((s) => s.status === 'pending').length : 0;
  for (const t of L.teams) {
    const isUser = t.idx === L.user;
    for (const p of t.roster) {
      if (played.has(p.id)) {
        p.energy = Math.max(0, p.energy - DAY.match);
        // estresse da partida: derrota pesa mais, e a cobrança da torcida cresce com a popularidade do time
        const res = result[t.idx];
        addStress(p, STRESS.match + (res === 'l' ? STRESS.loss + STRESS.crowd * t.fame / 100 : res === 'w' ? STRESS.win : 0));
        if (isUser) addStress(p, STRESS.meta * pendingMetas); // metas de patrocínio ainda em aberto
      } else { dayRecover(p); addPop(p, POP_GAIN.bench * PER_MATCH); addStress(p, DAY_STRESS.free + DAY_STRESS.bench); }
      p.injWed = false;
    }
    if (!isUser) autoStarters(t);
  }
}

function standings(L, div) {
  return L.divs[div].teams.map((i) => L.teams[i]).sort((a, b) =>
    b.rec.w - a.rec.w || (b.rec.rf - b.rec.ra) - (a.rec.rf - a.rec.ra) || b.rec.ko - a.rec.ko || a.name.localeCompare(b.name));
}

function advancePhase(L, res, money) {
  const me = L.teams[L.user];
  const pay = (t, v, label) => { t.cash += v; if (t === me) { money.prizes += v; money.bonuses.push({ label, amount: v, prize: true }); } };
  if (L.phase === 'season') {
    L.week++;
    if (L.week >= WEEKS) {
      L.divs.forEach((D, di) => {
        const s = standings(L, di).map((t) => t.idx);
        D.table = s; D.playoffs = { semis: [[s[0], s[3]], [s[1], s[2]]], final: null };
      });
      L.phase = 'semis';
    }
  } else if (L.phase === 'semis') {
    L.divs.forEach((D, di) => {
      const mine = res.filter((r) => r.div === di);
      D.playoffs.final = mine.map((r) => r.winner);
      mine.forEach((r) => { const lo = r.winner === r.h ? r.a : r.h; pay(L.teams[lo], PRIZES.semi * DIVS[di].mult, 'Premiação: semifinal'); addFame(L.teams[lo], FAME.semi); });
      D.playoffs.final.forEach((i) => addFame(L.teams[i], FAME.final));
    });
    L.phase = 'final';
  } else if (L.phase === 'final') {
    L.divs.forEach((D, di) => {
      const r = res.find((x) => x.div === di), lo = r.winner === r.h ? r.a : r.h;
      D.champion = r.winner; addFame(L.teams[r.winner], FAME.champ);
      pay(L.teams[r.winner], PRIZES.champ * DIVS[di].mult, 'Premiação: campeão');
      pay(L.teams[lo], PRIZES.vice * DIVS[di].mult, 'Premiação: vice-campeão');
    });
    // acesso e rebaixamento entre cada par de divisões: caem os 2 últimos de cima;
    // sobem o campeão de baixo e o melhor colocado da fase de pontos entre os demais
    const up = [], down = [], dest = {};
    for (let k = 1; k < L.divs.length; k++) {
      const hi = L.divs[k - 1].table, lo = L.divs[k].table, ch = L.divs[k].champion;
      for (const i of [ch, lo.find((i) => i !== ch)]) { up.push(i); dest[i] = k - 1; }
      for (const i of hi.slice(-2)) { down.push(i); dest[i] = k; }
    }
    L.movement = { down, up, dest };
    up.forEach((i) => { pay(L.teams[i], PRIZES.promotion * DIVS[dest[i]].mult, 'Bônus de acesso'); addFame(L.teams[i], FAME.promotion); });
    L.movement.down.forEach((i) => addFame(L.teams[i], FAME.relegation));
    L.phase = 'done';
    const rd = seasonRepDelta(L);
    L.coach.rep = Math.max(0, Math.min(100, Math.round((L.coach.rep + rd.d) * 10) / 10));
    L.coach.last = rd; L.coach.accepted = null;
    L.coach.offers = makeCoachOffers(L, rngOf(L));
    const meT = userTeam(L);
    if (!L.coach.fired) {
      if (L.coach.conf < CONF.fireEnd && L.divs[meT.div].table.indexOf(meT.idx) + 1 > (L.coach.expect || 0)) fireCoach(L, 'end', 'A diretoria terminou a temporada sem confiança no seu trabalho.');
      else if (L.movement.down.includes(meT.idx) && (L.coach.expect || 9) <= 4) fireCoach(L, 'end', 'Rebaixado com um elenco montado para brigar em cima.');
    }
  }
}

// metas de patrocínio: pagas assim que cumpridas; as que dependem do fim de uma fase são avaliadas nela
function checkMetas(L, money) {
  const me = L.teams[L.user], D = L.divs[me.div];
  const pos = D.table ? D.table.indexOf(me.idx) + 1 : 0;
  for (const s of L.sponsors) {
    if (s.status !== 'pending') continue;
    const M = META_TYPES[s.meta];
    let done = null; // true cumprida, false falhou, null ainda em aberto
    switch (s.meta) {
      case 'wins3': case 'wins5': if (me.wins >= M.need) done = true; break;
      case 'ko1': case 'ko3': if (me.kos >= M.need) done = true; break;
      case 'streak3': if (me.bestStreak >= M.need) done = true; break;
      case 'top4': if (D.table) done = pos <= 4; break;
      case 'first': if (D.table) done = pos === 1; break;
      case 'home': if (D.table) done = me.rec.homeL <= M.need; break;
      case 'final': if (D.playoffs && D.playoffs.final) done = D.playoffs.final.includes(me.idx); else if (D.table && pos > 4) done = false; break;
      case 'champ': if (D.champion !== null) done = D.champion === me.idx; else if (D.table && pos > 4) done = false; break;
      case 'promo': if (L.movement) done = L.movement.up.includes(me.idx); break;
    }
    if (done === null && L.phase === 'done') done = false;
    if (done === true) { s.status = 'done'; me.cash += s.bonus; money.bonuses.push({ label: `Meta cumprida: ${s.name}`, amount: s.bonus }); }
    else if (done === false) s.status = 'failed';
  }
}

// ================= JANELA DE TRANSFERÊNCIAS =================
// Acontece na pré-temporada, em 2 etapas. A cada etapa a IA negocia, o mercado se renova e chegam ofertas pelos seus benders.
const WINDOW_STEPS = 2;
function newWindow(L, r) {
  const w = { step: 1, steps: WINDOW_STEPS, offers: [], news: [] };
  L.window = w;
  w.offers = makeAIOffers(L, r);
  return w;
}
const userTeam = (L) => L.teams[L.user];
const elemCount = (t, elem) => t.roster.filter((q) => q.elem === elem).length;
function ownerOf(L, pid) { return L.teams.find((t) => t.roster.some((q) => q.id === pid)) || null; }
function valueOf(L, p) { const t = ownerOf(L, p.id); return Math.round(marketValue(p, !!t && t.starters[p.elem] === p.id) * Math.max(0.6, 1 - 0.08 * (p.inj || 0)) / 100) * 100; }
function news(L, text) { L.window.news.unshift({ step: L.window.step, text }); L.window.news = L.window.news.slice(0, 40); }
function moveTo(L, p, from, to) {
  from.roster = from.roster.filter((q) => q !== p);
  if (from.starters[p.elem] === p.id) delete from.starters[p.elem];
  to.roster.push(p); p.plan = 'rest';
  autoStarters(from);
  if (!to.starters[p.elem]) to.starters[p.elem] = p.id;
  if (to.idx !== L.user) autoStarters(to);
}

// o time vendedor só aceita se continuar com 1 bender do elemento e pelo menos 3 no elenco
function canBuy(L, pid) {
  const me = userTeam(L), seller = ownerOf(L, pid);
  if (L.phase !== 'preseason' || !seller || seller === me || me.roster.length >= MAX_ROSTER) return { ok: false, why: me.roster.length >= MAX_ROSTER ? 'Elenco cheio' : '' };
  const p = seller.roster.find((q) => q.id === pid), price = valueOf(L, p);
  if (elemCount(seller, p.elem) < 2 || seller.roster.length <= MIN_ROSTER) return { ok: false, why: 'Não está à venda', price };
  if (me.cash < price) return { ok: false, why: 'Caixa insuficiente', price };
  return { ok: true, price };
}
function buyPlayer(L, pid) {
  const c = canBuy(L, pid); if (!c.ok) return false;
  const me = userTeam(L), seller = ownerOf(L, pid), p = seller.roster.find((q) => q.id === pid);
  me.cash -= c.price; seller.cash += c.price;
  moveTo(L, p, seller, me);
  news(L, `${me.name} compra ${p.name} de ${seller.name} por ¥${c.price.toLocaleString('pt-BR')}.`);
  return true;
}

// venda direta: o melhor comprador com vaga e caixa paga 80% do valor
function bestBuyer(L, p, price) {
  const cands = L.teams.filter((t) => t.idx !== L.user && t.roster.length < MAX_ROSTER && t.cash >= price);
  if (!cands.length) return null;
  const gain = (t) => { const s = t.roster.find((q) => q.id === t.starters[p.elem]); return ovr(p.st) - (s ? ovr(s.st) : 0); };
  return cands.sort((a, b) => gain(b) - gain(a) || b.cash - a.cash)[0];
}
function sellQuote(L, pid) {
  const me = userTeam(L), p = me.roster.find((q) => q.id === pid);
  if (L.phase !== 'preseason' || !p) return null;
  if (elemCount(me, p.elem) < 2) return { ok: false, why: 'Único bender deste elemento' };
  const price = Math.round(valueOf(L, p) * 0.8 / 100) * 100, buyer = bestBuyer(L, p, price);
  return buyer ? { ok: true, price, buyer } : { ok: false, why: 'Nenhum time com vaga e caixa', price };
}
function sellPlayer(L, pid) {
  const q = sellQuote(L, pid); if (!q || !q.ok) return false;
  const me = userTeam(L), p = me.roster.find((x) => x.id === pid);
  me.cash += q.price; q.buyer.cash -= q.price;
  moveTo(L, p, me, q.buyer);
  L.window.offers = L.window.offers.filter((o) => o.pid !== pid);
  news(L, `${me.name} vende ${p.name} para ${q.buyer.name} por ¥${q.price.toLocaleString('pt-BR')}.`);
  return true;
}

// ofertas da IA pelos benders do técnico: aparecem quando o bender seria titular no time interessado; podem passar do valor
function makeAIOffers(L, r) {
  const me = userTeam(L), out = [];
  for (const p of me.roster) {
    const value = valueOf(L, p);
    const buyers = L.teams.filter((t) => t.idx !== L.user && t.roster.length < MAX_ROSTER);
    for (const t of buyers) {
      // interesse: muito se ele viraria titular lá; um pouco se seria um bom reserva
      const s = t.roster.find((q) => q.id === t.starters[p.elem]);
      const chance = !s || ovr(p.st) >= ovr(s.st) + 1 ? 0.45 : ovr(p.st) >= ovr(s.st) - 4 ? 0.12 : 0;
      if (r() > chance) continue;
      const amount = Math.round(value * (0.95 + r() * 0.35) / 100) * 100;
      if (t.cash >= amount) out.push({ id: `of${L.season}-${L.window ? L.window.step : 1}-${p.id}-${t.idx}`, pid: p.id, team: t.idx, amount });
    }
  }
  return out.sort((a, b) => b.amount - a.amount).slice(0, 3);
}
function acceptOffer(L, oid) {
  const o = L.window.offers.find((x) => x.id === oid); if (!o || L.phase !== 'preseason') return false;
  const me = userTeam(L), p = me.roster.find((q) => q.id === o.pid), buyer = L.teams[o.team];
  if (!p || elemCount(me, p.elem) < 2 || buyer.roster.length >= MAX_ROSTER || buyer.cash < o.amount) return false;
  me.cash += o.amount; buyer.cash -= o.amount;
  moveTo(L, p, me, buyer);
  L.window.offers = L.window.offers.filter((x) => x.pid !== o.pid);
  news(L, `${buyer.name} compra ${p.name} de ${me.name} por ¥${o.amount.toLocaleString('pt-BR')}.`);
  return true;
}
function declineOffer(L, oid) { L.window.offers = L.window.offers.filter((x) => x.id !== oid); return true; }

// negócios da IA: completa elenco, procura reforço para o elemento mais fraco, dispensa quem sobra
function aiWindowMoves(L, r) {
  const ai = L.teams.filter((t) => t.idx !== L.user).sort(() => r() - 0.5);
  for (const t of ai) {
    autoStarters(t);
    // no vermelho: vende o reserva mais caro (ou dispensa) para cortar a folha
    if (t.cash < 0 && t.roster.length > MIN_ROSTER) {
      const out = t.roster.filter((q) => !Object.values(t.starters).includes(q.id) && elemCount(t, q.elem) > 1).sort((a, b) => wageOf(b) - wageOf(a))[0];
      if (out) {
        const price = Math.round(valueOf(L, out) * 0.8 / 100) * 100, buyer = L.teams.filter((o) => o !== t && o.idx !== L.user && o.roster.length < MAX_ROSTER && o.cash > price + 5000)[0];
        if (buyer) { buyer.cash -= price; t.cash += price; moveTo(L, out, t, buyer); news(L, `${t.name}, no vermelho, vende ${out.name} para ${buyer.name} por ¥${price.toLocaleString('pt-BR')}.`); }
        else { t.roster = t.roster.filter((q) => q !== out); L.freeAgents.push(out); news(L, `${t.name}, no vermelho, dispensa ${out.name}.`); }
        continue;
      }
    }
    // completa o elenco com agente livre
    if (t.roster.length < MIN_ROSTER) {
      const fa = L.freeAgents.filter((p) => signingFee(p) <= Math.max(0, t.cash - 2000) || t.roster.length < MIN_ROSTER - 1).sort((a, b) => ovr(b.st) - ovr(a.st))[0];
      if (fa) { L.freeAgents = L.freeAgents.filter((p) => p !== fa); t.cash -= signingFee(fa); hire(fa); t.roster.push(fa); autoStarters(t); news(L, `${t.name} contrata o agente livre ${fa.name}.`); }
      continue;
    }
    // de vez em quando a IA aposta numa promessa jovem
    if (t.roster.length < MAX_ROSTER && r() < 0.3) {
      const kid = L.freeAgents.filter((p) => p.age <= 21 && p.pot >= teamOVR(t) - 2 && signingFee(p) <= t.cash - 3000).sort((a, b) => b.pot - a.pot)[0];
      if (kid) { L.freeAgents = L.freeAgents.filter((p) => p !== kid); t.cash -= signingFee(kid); hire(kid); t.roster.push(kid); autoStarters(t); news(L, `${t.name} aposta na promessa ${kid.name} (${kid.age} anos).`); continue; }
    }
    if (r() > 0.45) continue;
    const weak = ELEMS.map((e) => ({ e, s: t.roster.find((q) => q.id === t.starters[e]) })).filter((x) => x.s).sort((a, b) => ovr(a.s.st) - ovr(b.s.st))[0];
    if (!weak) continue;
    const need = ovr(weak.s.st) + (t.cash > 80000 ? 2 : 4), budget = t.cash - 3000;
    const fromFA = L.freeAgents.filter((p) => p.elem === weak.e && ovr(p.st) >= need && signingFee(p) <= budget).map((p) => ({ p, price: signingFee(p), from: null }));
    const fromTeams = L.teams.filter((o) => o !== t && o.idx !== L.user && o.roster.length > MIN_ROSTER).flatMap((o) =>
      o.roster.filter((p) => p.elem === weak.e && elemCount(o, p.elem) > 1 && ovr(p.st) >= need).map((p) => ({ p, price: valueOf(L, p), from: o })))
      .filter((c) => c.price <= budget);
    // só contrata quem cabe na folha que a divisão sustenta
    const wageRoom = aiIncomeCap(t) * 1.05 - payroll(t);
    const best = fromFA.concat(fromTeams).filter((c) => salary(c.p) <= wageRoom + (t.roster.length >= MAX_ROSTER ? 300 : 0)).sort((a, b) => ovr(b.p.st) - ovr(a.p.st))[0];
    if (!best) continue;
    if (t.roster.length >= MAX_ROSTER) {
      // abre vaga dispensando o reserva mais fraco (sem deixar o elemento vazio)
      const out = t.roster.filter((q) => !Object.values(t.starters).includes(q.id) && elemCount(t, q.elem) > 1).sort((a, b) => ovr(a.st) - ovr(b.st))[0];
      if (!out) continue;
      t.roster = t.roster.filter((q) => q !== out); L.freeAgents.push(out); news(L, `${t.name} dispensa ${out.name}.`);
    }
    t.cash -= best.price;
    if (best.from) { best.from.cash += best.price; moveTo(L, best.p, best.from, t); news(L, `${t.name} compra ${best.p.name} de ${best.from.name} por ¥${best.price.toLocaleString('pt-BR')}.`); }
    else { L.freeAgents = L.freeAgents.filter((p) => p !== best.p); hire(best.p); t.roster.push(best.p); autoStarters(t); news(L, `${t.name} contrata o agente livre ${best.p.name}.`); }
  }
}
function refreshFreeAgents(L, r) {
  const div = userTeam(L).div, base = DIVS[div].faBase - 1;
  L.freeAgents = L.freeAgents.filter((p) => r() > 0.3 && (p.age || 25) < 35);
  // sempre pelo menos 2 jovens promessas e 2 de cada elemento
  while (L.freeAgents.filter((p) => p.age <= 19).length < 2) L.freeAgents.push(makePlayer(L, r, ELEMS[Math.floor(r() * 3)], base, 17 + Math.floor(r() * 3)));
  for (const e of ELEMS) while (L.freeAgents.filter((p) => p.elem === e).length < 2) L.freeAgents.push(makePlayer(L, r, e, base + (r() < 0.15 ? 10 : 0)));
  // o mercado tem benders de todos os níveis: pelo menos 1 por elemento perto do nível de cada divisão
  DIVS.forEach((D, di) => { if (di === div) return; for (const e of ELEMS) {
    if (!L.freeAgents.some((p) => p.elem === e && Math.abs(ovr(p.st) - D.faBase) <= 4)) L.freeAgents.push(makePlayer(L, r, e, D.faBase));
  } });
  while (L.freeAgents.length < 12) L.freeAgents.push(makePlayer(L, r, ELEMS[Math.floor(r() * 3)], base + (r() < 0.15 ? 10 : 0)));
  for (const p of L.freeAgents) { p.contract = 0; p.wage = 0; }
}
// encerra a etapa atual da janela
function advanceWindow(L) {
  if (L.phase !== 'preseason' || L.window.step >= L.window.steps) return false;
  const r = rngOf(L);
  aiWindowMoves(L, r);
  refreshFreeAgents(L, r);
  L.window.step++;
  L.window.offers = makeAIOffers(L, r);
  return true;
}

// ================= VIRADA DE TEMPORADA =================
// avaliação de cada patrocínio para a renovação: cumpriu → renova pagando mais; ficou perto → renova pagando menos; longe → não renova
function sponsorVerdict(L, s, pos) {
  if (s.status === 'done') return 'up';
  const me = userTeam(L), M = META_TYPES[s.meta];
  let ratio = 0;
  if (s.meta.startsWith('wins')) ratio = me.wins / M.need;
  else if (s.meta.startsWith('ko')) ratio = me.kos / M.need;
  else if (s.meta === 'streak3') ratio = me.bestStreak / M.need;
  else if (s.meta === 'top4') ratio = pos <= 6 ? 0.7 : 0.3;
  else if (s.meta === 'first') ratio = pos <= 3 ? 0.7 : 0.3;
  else if (s.meta === 'home') ratio = me.rec.homeL <= M.need + 1 ? 0.7 : 0.3;
  else if (s.meta === 'final' || s.meta === 'champ') ratio = pos <= 4 ? 0.7 : 0.3;
  else if (s.meta === 'promo') ratio = pos <= 4 ? 0.7 : 0.3;
  return ratio >= 0.6 ? 'down' : 'no';
}
function newSeason(L) {
  if (L.phase !== 'done') return false;
  if (L.coach.fired && L.coach.fired.when === 'end' && (L.coach.accepted === null || L.coach.accepted === undefined)) return false; // demitido: precisa escolher um time
  const r = rngOf(L), me = userTeam(L), mv = L.movement;
  const posOld = L.divs[me.div].table.indexOf(me.idx) + 1;
  // histórico da temporada que terminou
  L.history = L.history || [];
  L.history.push({ season: L.season, div: me.div, pos: posOld, w: me.rec.w, l: me.rec.l, champ: L.divs[me.div].champion === me.idx,
    moved: mv.up.includes(me.idx) ? 'up' : mv.down.includes(me.idx) ? 'down' : null, cash: me.cash, fame: me.fame,
    champions: L.divs.map((D) => L.teams[D.champion].name), team: me.name, rep: L.coach.rep, fired: !!(L.coach.fired && L.coach.fired.when === 'end') });
  // renovações de patrocínio
  const renewals = [], refused = [];
  for (const s of L.sponsors) {
    const v = sponsorVerdict(L, s, posOld);
    if (v === 'no') { refused.push(s.name); continue; }
    const f = v === 'up' ? 1.15 : 0.8;
    // renovação melhorada tem teto: no máximo 25% acima do topo da faixa daquele nível
    const T = TIER_VALUES[s.tier] || TIER_VALUES.medium, dm = DIVS[nextDiv(L, L.user)].mult * 1.25;
    renewals.push({ ...s, id: `sp${L.season + 1}-r${renewals.length}`, base: Math.round(Math.min(s.base * f, T[1] * dm) / 50) * 50, bonus: Math.round(Math.min(s.bonus * f, T[3] * dm) / 500) * 500, renewal: v, status: undefined });
  }
  // acesso e rebaixamento
  if (mv.dest) for (const k of Object.keys(mv.dest)) L.teams[+k].div = mv.dest[k];
  else { for (const i of mv.down) L.teams[i].div = 1; for (const i of mv.up) L.teams[i].div = 0; }
  // saves de antes da Terceira Divisão: ela entra na virada de temporada
  for (let di = L.divs.length; di < DIVS.length; di++) addDivisionTeams(L, r, di);
  L.season++; L.week = 0; L.phase = 'preseason'; L.results = []; L.lastReport = null; L.movement = null;
  L.divs = DIVS.map((_, di) => {
    const ids = L.teams.filter((t) => t.div === di).map((t) => t.idx).sort(() => r() - 0.5);
    return { teams: ids, schedule: doubleRoundRobin(ids), playoffs: null, champion: null };
  });
  // ---- envelhecimento, aposentadorias e contratos ----
  const aging = ageAndContracts(L, r);
  for (const t of L.teams) {
    // a popularidade volta um pouco para a média da divisão a cada temporada (evita times presos em 0 ou 100)
    t.fame = Math.round((t.fame * 0.7 + DIVS[t.div].fameMean * 0.3) * 10) / 10;
    t.rec = { w: 0, l: 0, rf: 0, ra: 0, ko: 0, homeL: 0 }; t.streak = 0; t.bestStreak = 0; t.wins = 0; t.kos = 0;
    for (const p of t.roster) {
      p.energy = 100; p.stress = Math.round((p.stress || 0) * 0.4); p.plan = 'rest';
      p.season = { games: 0, hits: 0, pushes: 0, falls: 0 };
    }
    autoStarters(t);
  }
  // o técnico aceitou outro time: assume o novo elenco; os patrocínios do time antigo ficam para trás
  let team = me, keep = renewals, refusedList = refused;
  if (L.coach.accepted !== null && L.coach.accepted !== undefined) {
    for (const p of me.roster) p.plan = 'rest';
    L.user = L.coach.accepted; team = userTeam(L); keep = []; refusedList = [];
    L.lastReport = null; L.trainMode = 'ind'; L.teamPlan = 'rest';
    for (const p of team.roster) p.plan = 'rest';
  }
  L.coach.accepted = null; L.coach.offers = []; L.coach.expect = null; L.coach.fired = null;
  // novas propostas para completar 4, conforme a divisão e a popularidade do time
  const fresh = makeOffers(L, r, team.div, team.fame).filter((o) => !keep.some((x) => x.name === o.name));
  L.sponsorOffers = keep.concat(fresh).slice(0, Math.max(4, keep.length));
  L.sponsors = []; L.refusedSponsors = refusedList;
  L.events = makeEvents(L, r);
  refreshFreeAgents(L, r);
  L.window = newWindow(L, r);
  L.aging = aging;
  for (const n of aging.news) news(L, n);
  return true;
}

// ================= IDADE, POTENCIAL E CONTRATOS =================
function addAttr(p, k, v) { p.st[k] = Math.max(35, Math.min(99, Math.round((p.st[k] + v) * 10) / 10)); }
function agePlayer(p, r) {
  const before = ovr(p.st);
  p.age = (p.age || 25) + 1;
  if (p.age <= 24 && before < p.pot) {
    // amadurecimento natural dos jovens: anda parte do caminho até o potencial
    const target = Math.min(p.pot, before + Math.round((p.pot - before) * (0.2 + 0.25 * r())));
    for (let i = 0; i < 40 && ovr(p.st) < target; i++) addAttr(p, TRAINABLE[Math.floor(r() * TRAINABLE.length)], 1);
  } else if (p.age >= 30) {
    // declínio físico; a experiência compensa um pouco na leitura e na disciplina
    const d = (p.age - 29) * 0.9 * (0.7 + r() * 0.6);
    addAttr(p, 'agi', -d); addAttr(p, 'pow', -d * 0.8); addAttr(p, 'fir', -d * 0.5); addAttr(p, 'pre', -d * 0.3);
    addAttr(p, 'lei', 0.5); addAttr(p, 'dis', 0.5);
    p.pot = Math.min(p.pot, ovr(p.st));
  }
  return ovr(p.st) - before;
}
function retires(p, r) { return p.age >= 37 || (p.age >= 33 && r() < 0.25 + (p.age - 33) * 0.25); }
function ageAndContracts(L, r) {
  const rep = { retired: [], mine: { changes: [], retired: [], expiring: [] }, news: [] };
  const userIdx = L.coach && L.coach.accepted !== null && L.coach.accepted !== undefined ? L.coach.accepted : L.user;
  for (const t of L.teams) {
    for (const p of t.roster.slice()) {
      const d = agePlayer(p, r);
      if (retires(p, r)) {
        t.roster = t.roster.filter((q) => q !== p);
        rep.retired.push({ name: p.name, team: t.name, age: p.age });
        rep.news.push(`${p.name} (${t.name}) se aposenta aos ${p.age} anos.`);
        L.usedNames.delete(p.name); // o nome volta a ficar disponível para novos benders
        if (t.idx === L.user) rep.mine.retired.push(p.name);
        continue;
      }
      if (t.idx === L.user && Math.abs(d) >= 1) rep.mine.changes.push({ name: p.name, d, age: p.age });
      p.contract = (p.contract || 1) - 1;
      if (p.contract <= 0) {
        if (t.idx === L.user) { p.expiring = true; p.contract = 0; rep.mine.expiring.push(p.name); }
        else {
          // IA: renova quem ainda é útil e não está velho; libera o resto
          const worst = Math.min(...starters(t).map((q) => ovr(q.st)));
          const keep = elemCount(t, p.elem) < 2 || (p.age <= 30 && ovr(p.st) >= worst - 6) || (p.age <= 32 && ovr(p.st) >= worst);
          if (keep) { p.wage = salary(p); p.contract = 1 + Math.floor(r() * 3); }
          else { t.roster = t.roster.filter((q) => q !== p); p.contract = 0; p.wage = 0; L.freeAgents.push(p); rep.news.push(`${t.name} não renova com ${p.name}, que vira agente livre.`); }
        }
      }
    }
  }
  for (const p of L.freeAgents) agePlayer(p, r);
  for (const p of L.freeAgents) if (p.age >= 35) L.usedNames.delete(p.name);
  L.freeAgents = L.freeAgents.filter((p) => p.age < 35);
  refreshFreeAgents(L, r);
  // times da IA sem algum elemento contratam um agente livre daquele elemento
  for (const t of L.teams) {
    if (t.idx === L.user) continue;
    for (const e of ELEMS) {
      if (elemCount(t, e) > 0) continue;
      const base = DIVS[t.div].faBase + 3;
      let fa = L.freeAgents.filter((p) => p.elem === e).sort((a, b) => ovr(b.st) - ovr(a.st))[0];
      // sem agente livre à altura da divisão: surge um bender novo do nível dela
      if (!fa || ovr(fa.st) < base - 8) { fa = makePlayer(L, r, e, base); L.freeAgents.push(fa); }
      L.freeAgents = L.freeAgents.filter((p) => p !== fa); hire(fa); t.roster.push(fa);
      rep.news.push(`${t.name} contrata ${fa.name} para repor a saída.`);
    }
    while (t.roster.length < MIN_ROSTER) {
      let fa = L.freeAgents.sort((a, b) => ovr(b.st) - ovr(a.st))[0];
      if (!fa) { fa = makePlayer(L, r, ELEMS[Math.floor(r() * 3)], DIVS[t.div].faBase); L.freeAgents.push(fa); }
      L.freeAgents = L.freeAgents.filter((p) => p !== fa); hire(fa); t.roster.push(fa);
    }
    autoStarters(t);
  }
  return rep;
}
// renovação de contrato na pré-temporada (para contratos encerrados)
function renewContract(L, pid, years) {
  const me = userTeam(L), p = me.roster.find((q) => q.id === pid);
  if (L.phase !== 'preseason' || !p || !p.expiring || ![1, 2, 3].includes(years)) return false;
  p.wage = askWage(p); p.contract = years; p.expiring = false;
  return true;
}
// elenco abaixo do mínimo (sem contar quem está com contrato encerrado)
function rosterShort(L) { const me = userTeam(L); return Math.max(0, MIN_ROSTER - me.roster.filter((p) => !p.expiring).length); }
// o que impede de começar a temporada (contratos encerrados saem e podem deixar um elemento vazio)
function seasonBlockers(L) {
  const me = userTeam(L), out = [];
  for (const e of ELEMS) {
    const left = me.roster.filter((p) => p.elem === e && !p.expiring);
    if (!left.length) out.push(e);
  }
  return out;
}

// mercado da pré-temporada: agentes livres
function signPlayer(L, id) {
  const t = L.teams[L.user], i = L.freeAgents.findIndex((p) => p.id === id);
  if (L.phase !== 'preseason' || i < 0 || t.roster.length >= MAX_ROSTER) return false;
  const p = L.freeAgents[i], fee = signingFee(p);
  if (t.cash < fee && !seasonBlockers(L).includes(p.elem) && !(rosterShort(L) && fee <= 1500)) return false;
  L.freeAgents.splice(i, 1);
  t.cash -= fee; hire(p); t.roster.push(p);
  if (!t.starters[p.elem]) t.starters[p.elem] = p.id;
  return true;
}
function canRelease(L, id) {
  const t = L.teams[L.user], p = t.roster.find((q) => q.id === id);
  return L.phase === 'preseason' && !!p && t.roster.filter((q) => q.elem === p.elem).length > 1;
}
function releasePlayer(L, id) {
  if (!canRelease(L, id)) return false;
  const t = L.teams[L.user], p = t.roster.find((q) => q.id === id);
  t.roster = t.roster.filter((q) => q !== p);
  L.freeAgents.unshift(p);
  if (t.starters[p.elem] === p.id) t.starters[p.elem] = t.roster.find((q) => q.elem === p.elem).id;
  return true;
}

function serialize(L) { return JSON.stringify({ ...L, usedNames: [...L.usedNames] }); }
function deserialize(s) {
  const o = JSON.parse(s); if (o.v !== 2) return null; o.usedNames = new Set(o.usedNames);
  // saves antigos: cria popularidade e eventos que ainda não existiam
  const r = mulberry32(o.rngState || 1);
  for (const p of o.teams.flatMap((t) => t.roster).concat(o.freeAgents)) if (p.st.pop === undefined) p.st.pop = initialPop(p.st, r);
  if (!o.events || !o.events.length) o.events = makeEvents(o, r);
  // saves de antes do turno e returno: acrescenta o returno (as mesmas rodadas com o mando invertido)
  for (const D of o.divs) if (D.schedule && D.schedule.length < WEEKS) D.schedule = D.schedule.concat(D.schedule.map((wk) => wk.map(([h, a]) => [a, h])));
  if (!o.coach) o.coach = { rep: 25, offers: [], expect: null, accepted: null, last: null };
  for (const t of o.teams) for (const p of t.roster) {
    if (p.age === undefined) { p.age = randomAge(r); p.pot = Math.min(95, Math.round(ovr(p.st) + potGap(p.age, r))); }
    if (p.contract === undefined) { p.contract = 1 + Math.floor(r() * 3); p.wage = salary(p); }
  }
  for (const p of o.freeAgents) if (p.age === undefined) { p.age = randomAge(r); p.pot = Math.min(95, Math.round(ovr(p.st) + potGap(p.age, r))); p.contract = 0; p.wage = 0; }
  for (const t of o.teams) {
    if (t.fame === undefined) t.fame = initialFame(t.div, teamOVR(t), r);
    for (const p of t.roster) if (p.stress === undefined) p.stress = Math.round(r() * 15);
  }
  for (const p of o.freeAgents) if (p.stress === undefined) p.stress = 0;
  // saves de antes do elenco de 6 a 9: todos começam sem lesão e cada time ganha jovens da base até ter 6
  for (const p of o.teams.flatMap((t) => t.roster).concat(o.freeAgents)) if (p.inj === undefined) p.inj = 0;
  // saves de antes do calendário: plano de evento vira evento da semana; treino em equipe não tem mais evento
  for (const p of o.teams.flatMap((t) => t.roster)) if (p.plan && p.plan.startsWith('ev:')) { p.ev = p.plan.slice(3); p.plan = 'rest'; }
  if (o.teamPlan && o.teamPlan.startsWith('ev:')) o.teamPlan = 'rest';
  if (!o.evDay) { const days = EVENT_DAYS.slice(); o.evDay = {}; (o.events || []).forEach((k, i) => { o.evDay[k] = days[i % 4]; }); }
  if (!o.day) o.day = 'mon';
  for (const t of o.teams) while (t.roster.length < MIN_ROSTER) {
    const need = ELEMS.slice().sort((a, b) => elemCount(t, a) - elemCount(t, b))[0];
    const kid = makePlayer(o, r, need, Math.max(38, teamOVR(t) - 10), 17 + Math.floor(r() * 3)); hire(kid); t.roster.push(kid);
  }
  return o;
}

if (typeof module !== 'undefined') module.exports = { runWeekDays, applySunday, DAY, DAYS, DAY_NAME, EVENT_DAYS, evDayOf, rosterShort, fixInjuredStarters, isInjured, MIN_ROSTER, MAX_ROSTER, INJURY, renewContract, seasonBlockers, wageOf, takeJob, chooseCoachOffer, expectedPos, repNeeded, formOf, newSeason, advanceWindow, buyPlayer, sellPlayer, sellQuote, canBuy, acceptOffer, declineOffer, valueOf, offerTiers, EVENTS, teamPop, eventIncome, newLeague, setUser, startSeason, finishWeek, standings, userFixture, currentFixtures, ovr, salary, payroll, teamOVR, starters, matchDef, aiCoach, signSponsor, signPlayer, releasePlayer, serialize, deserialize, DIVS };
