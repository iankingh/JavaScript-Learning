// ESM 模組系統範例 — 被匯入的模組
// 執行：node esm-demo.mjs（會 import 此檔案）

// ── Named exports ─────────────────────────
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

// ── Default export（一個模組只能有一個）────
export default function greet(name) {
  return `Hello, ${name}!`;
}