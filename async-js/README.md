# Async JavaScript

非同步程式設計的概念與範例。

## 涵蓋主題

- 事件迴圈（Event Loop）與 Call Stack
- Callback 與 Callback Hell
- Promise：`then` / `catch` / `finally`
- `Promise.all` / `Promise.race` / `Promise.allSettled`
- `async` / `await` 語法
- 錯誤處理（try/catch with async/await）
- 微任務（Microtask）vs 巨集任務（Macrotask）

## 檔案清單

| 檔案 | 說明 |
|---|---|
| [demo.js](demo.js) | 入門範例，涵蓋上述所有主題 |

## 執行方式

```bash
node demo.js
```

> 範例含非同步輸出（`setTimeout`、`Promise`），請等候全部完成。觀察「事件迴圈順序示範」可對照「微任務先於巨集任務」的執行結果。
