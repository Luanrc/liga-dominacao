// técnico automático "razoável" jogando várias temporadas; imprime indicadores de equilíbrio
const fs = require('fs'), vm = require('vm');
const ctx = { console, Math, JSON, Set, Map, Object, Array, String };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/../src/sim.js', 'utf8').replace(/if \(typeof module[^\n]*/, '') + '\n' + fs.readFileSync(__dirname + '/../src/league.js', 'utf8').replace(/if \(typeof module[^\n]*/, '') + '\nthis.X={newLeague,setUser,startSeason,finishWeek,newSeason,advanceWindow,signSponsor,teamOVR,ovr,renewContract,seasonBlockers,signPlayer,starters,payroll,expectedPos,serialize,deserialize,ELEMS,signingFee,chooseCoachOffer,takeJob};', ctx);
const X = ctx.X;
const seed = +process.argv[2] || 1, startDiv = +process.argv[3] || 0, SEASONS = +process.argv[4] || 8;
let L = X.newLeague(seed);
const pick = L.divs[startDiv].teams.slice().sort((a, b) => X.teamOVR(L.teams[b]) - X.teamOVR(L.teams[a]))[3 + seed % 3];
X.setUser(L, pick);
const avg = (a) => a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length * 10) / 10 : 0;
const out = [];
for (let s = 0; s < SEASONS; s++) {
  const me = () => L.teams[L.user];
  // pré-temporada: renova contratos de quem presta, assina 2 patrocínios (prefere os que combinam com a expectativa), repõe elementos
  for (const p of me().roster.filter(p => p.expiring)) if (p.age <= 31 || X.seasonBlockers(L).length) X.renewContract(L, p.id, 2);
  for (const e of X.ELEMS) if (!me().roster.some(p => p.elem === e && !p.expiring)) {
    const fa = L.freeAgents.filter(p => p.elem === e).sort((a, b) => X.ovr(b.st) - X.ovr(a.st))[0]; if (fa) X.signPlayer(L, fa.id);
  }
  const exp = X.expectedPos(L, L.user);
  const offers = L.sponsorOffers.slice().sort((a, b) => (a.tier === 'hard' && exp > 3 ? 1 : 0) - (b.tier === 'hard' && exp > 3 ? 1 : 0) || b.base - a.base);
  offers.slice(0, 2).forEach(o => X.signSponsor(L, o.id));
  X.advanceWindow(L);
  if (!X.startSeason(L)) { out.push('não começou'); break; }
  let w = 0, midFired = 0; const acc={sal:0,sp:0,pz:0,ev:0,bn:0};
  while (L.phase !== 'done') {
    const st = X.starters(me());
    for (const p of me().roster) p.plan = st.includes(p) ? ((w % 3 === 2 || p.stress > 55 || p.energy < 45) ? 'rest' : ['pow', 'fir', 'agi', 'pre'][w % 4]) : 'ev:praca';
    const rep=X.finishWeek(L, null); w++; const mo=rep.money; acc.sal+=mo.salaries; acc.sp+=mo.sponsors; acc.pz+=mo.prizes; acc.ev+=(mo.events||[]).reduce((a,e)=>a+e.amount,0); acc.bn+=(mo.bonuses||[]).filter(b=>!b.prize).reduce((a,b)=>a+b.amount,0);
    if (L.coach.fired && L.coach.fired.when === 'mid') { midFired++; X.takeJob(L, L.coach.offers[0].team); }
  }
  const m = me(), pos = L.divs[m.div].table.indexOf(m.idx) + 1;
  const d0 = L.teams.filter(t => t.div === 0), d1 = L.teams.filter(t => t.div === 1), all = L.teams.flatMap(t => t.roster);
  const ai = L.teams.filter(t => t.idx !== L.user);
  out.push(`T${L.season} ${m.short} ${['1ª','2ª','3ª'][m.div]} ${pos}º (esp ${L.coach.expect}º) ${m.rec.w}V | caixa ¥${Math.round(m.cash)} folha ${X.payroll(m)} | rep ${L.coach.rep} conf ${L.coach.conf}${L.coach.fired ? ' DEMITIDO(' + L.coach.fired.when + ')' : ''}${midFired ? ' demitido-meio' : ''}`
    + ` [sal ${acc.sal} pat ${acc.sp} pr ${acc.pz} ev ${acc.ev} metas ${acc.bn}]` + ` || notas ${[0,1,2].map(d=>avg(L.teams.filter(t=>t.div===d).map(X.teamOVR))).join('/')} | idade ${avg(all.map(p => p.age))} | caixa IA ${Math.round(Math.min(...ai.map(t => t.cash)))}..${Math.round(Math.max(...ai.map(t => t.cash)))} | fama ${Math.round(Math.min(...L.teams.map(t => t.fame)))}..${Math.round(Math.max(...L.teams.map(t => t.fame)))} | estresse IA ${avg(ai.flatMap(t => t.roster).map(p => p.stress))}`);
  if (L.coach.fired) L.coach.accepted = L.coach.offers[0].team;
  else if (L.coach.offers.length) L.coach.accepted = null;
  if (!X.newSeason(L)) { out.push('newSeason falhou'); break; }
  L = X.deserialize(X.serialize(L));
}
console.log(`== semente ${seed}, começa na ${['1ª','2ª','3ª'][startDiv]} ==\n` + out.join('\n'));
