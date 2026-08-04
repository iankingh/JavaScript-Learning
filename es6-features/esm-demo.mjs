// ESM 模組系統範例 — 主程式
// 執行方式：node esm-demo.mjs
// 使用 .mjs 副檔名，無需 package.json 即可用 ESM。

// ─────────────────────────────────────────────
// 1. Named import（具名匯入）
// ─────────────────────────────────────────────
import { PI, add, multiply } from './lib.mjs';

console.log('PI =', PI);
console.log('add(2, 3) =', add(2, 3));
console.log('multiply(4, 5) =', multiply(4, 5));

// ─────────────────────────────────────────────
// 2. Default import（預設匯入，可任意命名）
// ─────────────────────────────────────────────
import greet from './lib.mjs';
console.log('default import：', greet('Ian'));

// ─────────────────────────────────────────────
// 3. Namespace import（一次匯入整個模組）
// ─────────────────────────────────────────────
import * as lib from './lib.mjs';
console.log('namespace：', lib.PI, lib.multiply(6, 7), lib.default('World'));

// ─────────────────────────────────────────────
// 4. 重新命名匯入（as）
// ─────────────────────────────────────────────
import { add as plus } from './lib.mjs';
console.log('renamed add → plus(10, 20) =', plus(10, 20));

// ─────────────────────────────────────────────
// 5. 動態 import（回傳 Promise，適用按需載入）
// ─────────────────────────────────────────────
const mod = await import('./lib.mjs');
console.log('dynamic import：', mod.add(100, 1));

console.log('\n✅ ESM 模組範例執行完畢');