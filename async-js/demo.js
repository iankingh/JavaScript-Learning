// Async JavaScript 入門範例
// 執行方式：node demo.js

'use strict';

// ─────────────────────────────────────────────
// 1. Callback 與 Callback Hell
// ─────────────────────────────────────────────
function fetchDataCallback(cb) {
  setTimeout(() => cb(null, '資料 A'), 100);
}
fetchDataCallback((err, data) => {
  if (err) return console.error(err);
  console.log('Callback 結果：', data);
});

// Callback hell：層層巢狀難以維護
function step1(cb) {
  setTimeout(() => cb('步驟 1 完成'), 100);
}
function step2(prev, cb) {
  setTimeout(() => cb(`${prev} → 步驟 2 完成`), 100);
}
step1((r1) => {
  step2(r1, (r2) => {
    console.log('Callback Hell 結果：', r2);
  });
});

// ─────────────────────────────────────────────
// 2. Promise：then / catch / finally
// ─────────────────────────────────────────────
function fetchUserData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const ok = true;
      ok ? resolve({ name: 'Ian', age: 30 }) : reject(new Error('取得失敗'));
    }, 150);
  });
}

fetchUserData()
  .then((user) => console.log('Promise then：', user))
  .catch((err) => console.error('Promise catch：', err.message))
  .finally(() => console.log('Promise finally：不論成功失敗都會執行'));

// ─────────────────────────────────────────────
// 3. Promise.all / race / allSettled
// ─────────────────────────────────────────────
const p1 = Promise.resolve('任務 1');
const p2 = Promise.resolve('任務 2');
const p3 = Promise.reject(new Error('任務 3 失敗'));

// all：全部成功才 resolve，任一失敗就 reject
Promise.all([p1, p2])
  .then((results) => console.log('Promise.all：', results));

// race：最先完成的（不論成功失敗）
Promise.race([p1, p2, p3])
  .then((r) => console.log('Promise.race 最快：', r))
  .catch((e) => console.log('Promise.race 最快（失敗）：', e.message));

// allSettled：等全部完成，回傳每個結果狀態
Promise.allSettled([p1, p2, p3]).then((results) => {
  console.log('Promise.allSettled：');
  results.forEach((r) =>
    console.log(r.status === 'fulfilled' ? `  ✓ ${r.value}` : `  ✗ ${r.reason.message}`)
  );
});

// ─────────────────────────────────────────────
// 4. async / await
// ─────────────────────────────────────────────
async function getUser() {
  try {
    const user = await fetchUserData(); // 等待 Promise 完成
    console.log('async/await：', user);
    return user;
  } catch (err) {
    console.error('async/await 錯誤：', err.message);
  }
}
getUser();

// ─────────────────────────────────────────────
// 5. 微任務（Microtask）vs 巨集任務（Macrotask）
// ─────────────────────────────────────────────
console.log('--- 事件迴圈順序示範 ---');
console.log('1. 同步 console.log');

setTimeout(() => console.log('4. setTimeout（巨集任務）'), 0);

Promise.resolve().then(() => console.log('3. Promise.then（微任務，先於 setTimeout）'));

console.log('2. 同步 console.log');

// 順期輸出：1 → 2 → 3 → 4
// 微任務（Promise）會在目前同步程式碼結束後、下一個巨集任務前執行

console.log('\n（範例含非同步輸出，請等候全部完成）');