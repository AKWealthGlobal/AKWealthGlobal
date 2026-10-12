/* Codex independent engine QA; no product changes or existing guide generation. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {stripTypeScriptTypes} = require('node:module');
process.chdir(path.resolve(__dirname, '..'));
function load(file, names, imports = {}) {
  const source = fs.readFileSync(file, 'utf8').replace(/^import .*;$/m, '').replace(/export /g, '');
  return new Function(...Object.keys(imports), stripTypeScriptTypes(source) + ';return {' + names.join(',') + '};')(...Object.values(imports));
}
const {quizzes} = load('lib/urban-quiz.ts', ['quizzes']);
const g = load('lib/urban-game.ts', ['configs', 'startCity', 'moveCity', 'actCity', 'answerCity', 'finishQuiz', 'nextCity', 'canAct', 'wonCity'], {quizzes});
const modes = ['little', 'junior', 'advanced'];
const results = [];
let checkedTurns = 0;
function test(name, run) { run(); results.push(name); console.log('PASS: ' + name); }
function invariant(s) {
  assert(Number.isInteger(s.cash) && s.cash >= 0);
  assert(Number.isInteger(s.savings) && s.savings >= 0);
  assert(s.positions.length === s.players && s.positions.every(p => Number.isInteger(p) && p >= 0 && p < 24));
  assert.equal(s.seen.length, new Set(s.seen).size);
  assert.equal(s.knowledge, s.seen.length);
  assert.equal(s.projects.length, new Set(s.projects).size);
  assert(s.projects.every(p => [4, 10, 16, 22].includes(p)));
  assert(s.round >= 1 && s.round <= g.configs[s.mode].rounds);
  assert(s.turn >= 0 && s.turn < s.players);
}
function answer(s, wrongFirst = false) {
  const before = s;
  if (wrongFirst) {
    s = g.answerCity(s, (s.quiz.answer + 1) % s.quiz.options.length);
    assert.equal(s.phase, 'quiz'); assert(s.hint);
    assert.equal(s.cash, before.cash); assert.equal(s.savings, before.savings);
    assert.equal(s.knowledge, before.knowledge); assert.deepEqual(s.seen, before.seen);
  }
  s = g.answerCity(s, s.quiz.answer);
  assert.equal(s.knowledge, before.knowledge + 1);
  assert.equal(g.answerCity(s, s.quiz.answer), s);
  return g.finishQuiz(s);
}
function runGame(mode, players, choose) {
  let s = g.startCity(mode, players), turns = 0;
  while (s.phase !== 'done') {
    assert(++turns <= g.configs[mode].rounds * players);
    s = g.moveCity(s, 1 + turns % 6);
    s = g.actCity(s, choose(s, turns));
    if (s.phase === 'quiz') s = answer(s, true);
    assert.equal(s.phase, 'next'); invariant(s);
    s = g.nextCity(s); invariant(s); checkedTurns++;
  }
  assert.equal(turns, g.configs[mode].rounds * players);
  assert.equal(s.log.filter(l => l.includes('輪結算')).length, g.configs[mode].rounds);
  return s;
}
test('9 mode/player combinations: resting to the end is a non-win with exact round settlement', () => {
  for (const mode of modes) for (const players of [2, 3, 4]) {
    const s = runGame(mode, players, s => s.choices.findIndex(c => c.action === 'rest'));
    const cfg = g.configs[mode];
    assert.equal(g.wonCity(s), false);
    assert(s.message.includes('還有目標可以改進'));
    assert.equal(s.cash, cfg.cash + cfg.rounds * (cfg.income - cfg.expense));
    assert.equal(s.savings, 0); assert.equal(s.knowledge, 0); assert.equal(s.projects.length, 0);
    assert.equal(g.nextCity(s), s); assert.equal(g.moveCity(s, 1), s);
    assert.equal(g.actCity(s, 0), s); assert.equal(g.finishQuiz(s), s); assert.equal(g.answerCity(s, 0), s);
  }
});
test('9 mode/player combinations: ordinary legal actions achieve all three goals', () => {
  for (const mode of modes) for (const players of [2, 3, 4]) {
    const s = runGame(mode, players, s => {
      const cfg = g.configs[mode];
      const action = s.knowledge < cfg.knowledge ? 'quiz' : s.savings < cfg.reserve ? 'save' : s.projects.length < 2 ? 'project' : 'rest';
      const i = s.choices.findIndex(c => c.action === action && g.canAct(s, c));
      return i >= 0 ? i : s.choices.findIndex(c => c.action === 'rest');
    });
    assert(g.wonCity(s)); assert(s.message.includes('共同計畫完成'));
  }
});
test('All modes: 12 distinct questions, retry without loss, exhausted pool consumes a turn safely', () => {
  for (const mode of modes) {
    let exhausted = 0;
    const s = runGame(mode, 3, s => {
      const i = s.choices.findIndex(c => c.action === 'quiz');
      if (s.seen.length === 12) {
        const next = g.actCity(s, i);
        assert.equal(next.phase, 'next'); assert.equal(next.quiz, null);
        assert(next.message.includes('全部討論過'));
        assert.equal(next.cash, s.cash); assert.equal(next.knowledge, 12);
        exhausted++;
      }
      return i;
    });
    assert.equal(s.knowledge, 12); assert.equal(s.seen.length, 12);
    assert.equal(exhausted, g.configs[mode].rounds * 3 - 12);
  }
});
test('Unaffordable choices, duplicate builds/actions, invalid dice/indexes, and wrong phases are safe', () => {
  const start = g.startCity('advanced', 2);
  for (const dice of [-1, 0, 7, 1.5, NaN, Infinity, undefined, null, '2']) assert.equal(g.moveCity(start, dice), start);
  for (const fn of [g.actCity, g.answerCity, g.finishQuiz, g.nextCity]) assert.equal(fn(start, 0), start);
  const choosing = g.moveCity(start, 4);
  for (const i of [-1, 999, 0.5, NaN, Infinity, undefined, null]) assert.equal(g.actCity(choosing, i), choosing);
  const project = choosing.choices.findIndex(c => c.action === 'project');
  const built = g.actCity(choosing, project);
  assert.equal(g.actCity(built, project), built);
  const duplicate = {...choosing, projects: [4]};
  assert.equal(g.canAct(duplicate, duplicate.choices[project]), false);
  assert.equal(g.actCity(duplicate, project), duplicate);
  for (const action of ['project', 'save']) {
    const poor = {...choosing, cash: 0};
    const i = poor.choices.findIndex(c => c.action === action);
    assert.equal(g.canAct(poor, poor.choices[i]), false); assert.equal(g.actCity(poor, i), poor);
  }
  let bank = g.moveCity({...start, positions: [12, 0]}, 1);
  const withdrawal = bank.choices.findIndex(c => c.action === 'withdraw');
  assert.equal(g.actCity(bank, withdrawal), bank);
  bank = {...bank, savings: 4};
  const withdrawn = g.actCity(bank, withdrawal);
  assert.equal(withdrawn.cash + withdrawn.savings, bank.cash + bank.savings);
  assert.equal(withdrawn.savings, 0);
  const risk = g.moveCity({...start, positions: [10, 0]}, 1);
  const ri = risk.choices.findIndex(c => c.action === 'risk');
  assert.equal(g.actCity(risk, ri, true).cash, risk.cash + 2);
  assert.equal(g.actCity(risk, ri, false).cash, risk.cash - 4);
  assert.equal(g.actCity({...risk, cash: 3}, ri, true).cash, 3);
});
test('Wrapping the start tile gives no extra income; settlement occurs only after the last player', () => {
  for (const players of [2, 3, 4]) {
    let s = {...g.startCity('little', players), positions: Array(players).fill(23)};
    const cash = s.cash;
    for (let player = 0; player < players; player++) {
      s = g.moveCity(s, 2); assert.equal(s.positions[player], 1); assert.equal(s.cash, cash);
      s = g.actCity(s, s.choices.findIndex(c => c.action === 'rest'));
      s = g.nextCity(s);
      assert.equal(s.cash, cash + (player === players - 1 ? 4 : 0));
    }
  }
});
test('900 reproducible randomized complete games preserve funds, unique progress, and valid turn order', () => {
  let seed = 0x0ac2026;
  function random(max) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % max; }
  for (const mode of modes) for (const players of [2, 3, 4]) for (let trial = 0; trial < 100; trial++) {
    let s = g.startCity(mode, players), turns = 0;
    let expectedFunds = s.cash;
    while (s.phase !== 'done') {
      assert(++turns <= g.configs[mode].rounds * players);
      const snapshot = JSON.stringify(s);
      const moved = g.moveCity(s, random(6) + 1);
      assert.equal(JSON.stringify(s), snapshot, 'move mutates its input');
      s = moved;
      const legal = s.choices.map((c, i) => g.canAct(s, c) ? i : -1).filter(i => i >= 0);
      const i = legal[random(legal.length)], choice = s.choices[i], riskWin = Boolean(random(2));
      const beforeAction = JSON.stringify(s);
      const next = g.actCity(s, i, riskWin);
      assert.equal(JSON.stringify(s), beforeAction, 'action mutates its input');
      if (choice.action === 'work') expectedFunds += 6;
      if (choice.action === 'project') expectedFunds -= g.configs[mode].project;
      if (choice.action === 'risk') expectedFunds += riskWin ? 2 : -4;
      s = next;
      if (s.phase === 'quiz') s = answer(s, Boolean(random(2)));
      invariant(s); assert.equal(s.cash + s.savings, expectedFunds);
      if (s.turn === players - 1) expectedFunds += g.configs[mode].income - g.configs[mode].expense;
      s = g.nextCity(s); invariant(s); assert.equal(s.cash + s.savings, expectedFunds); checkedTurns++;
    }
    assert.equal(s.log.filter(l => l.includes('輪結算')).length, g.configs[mode].rounds);
  }
});

// These are runtime API hardening observations, not bugs reachable through current UI controls.
const observations = [];
let qstate = g.moveCity(g.startCity('little', 2), 1);
qstate = g.actCity(qstate, qstate.choices.findIndex(c => c.action === 'quiz'));
for (const i of [NaN, 0.5, undefined]) {
  const value = g.answerCity(qstate, i);
  if (value !== qstate) observations.push('answerCity(' + String(i) + ') 會當作錯答顯示提示；目前 UI 只傳整數選項索引，未影響資金或學習星。');
}
for (const players of [0, 1, 5]) {
  const state = g.startCity('little', players);
  if (state.players === players) observations.push('startCity 的 players=' + players + ' 未被 API 擋下；目前 UI 下拉選單只提供 2–4 人。');
}
const reportLabels = [
  '三種模式 × 2／3／4 人共九種組合：全程休息可正常結束，顯示未達標，結算金額正確。',
  '九種模式／人數組合均可透過正常合法選擇完成三項共同目標。',
  '每個模式的 12 題不重複，答錯不扣資金；題庫耗盡後可正常換下一位。',
  '資金不足、重複建設與行動、非法骰值／行動索引、不適當階段呼叫均不破壞遊戲狀態。',
  '跨越起點不額外領錢，每輪僅在最後一位家人行動後結算。',
  '900 局固定種子隨機遊戲：逐次核對資金總額、非負餘額、唯一進度與回合順序。',
];
const report = '# AK 動物都市｜Codex 獨立邊界測試\n\n' +
  '測試日期：2026-10-07。執行者：Codex QA 子代理；不是 Claude Code。\n\n' +
  '來源：AK-Wealth-Global-live/site/lib/urban-game.ts 與 urban-quiz.ts。本次只新增測試與報告，未修改產品程式、未部署。\n\n' +
  '## 已確認\n\n' + reportLabels.map(r => '- 通過：' + r).join('\n') + '\n\n' +
  '- 完整遊戲：921 局（9 局未達標、9 局獲勝、3 局題庫耗盡、900 局隨機合法行動）。\n' +
  '- 已驗證回合行動：' + checkedTurns + ' 次。所有斷言通過，未發現目前 UI 可觸發的引擎錯誤。\n' +
  '- 未達標結局正確，不會誤報獲勝；遊戲不淘汰家人。\n' +
  '- 隨機測試核對每次資金總額，不只檢查非負數；每輪只結算一次。\n\n' +
  '## 非 UI 可達問題：可選的 API 防禦補強\n\n' + observations.map(o => '- ' + o).join('\n') + '\n\n' +
  '以上只透過直接呼叫函式傳入非法值得到，不列為玩家操作缺陷。若未來引入雲端存檔、網址參數或第三方呼叫，再加入執行期驗證較重要。\n\n' +
  '## 範圍界線\n\n本次是引擎測試，不代表已完成真實手機效能、觸控、音量、3D 美術或 Claude Code 審查。\n\n重跑：在網站目錄執行 `node scripts/qa-city-edge.cjs`。\n';
fs.writeFileSync('C:/Users/user/Desktop/3D亲子财商游戏/AK_Codex_邊界測試結果.md', report);
console.log(JSON.stringify({completeGames: 921, checkedTurns, groups: results.length, reachableDefects: 0, runtimeHardeningObservations: observations.length}, null, 2));
