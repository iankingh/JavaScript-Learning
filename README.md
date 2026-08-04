# JavaScript Learning

個人 JavaScript 學習記錄，每個資料夾對應一個主題，包含範例與練習。

## 主題目錄

| 資料夾 | 說明 | 執行環境 |
|---|---|---|
| [es6-features/](es6-features/) | ES6+ 語法特性（解構、箭頭函式、類別等） | Node.js |
| [async-js/](async-js/) | 非同步程式設計（Promise、async/await、事件迴圈） | Node.js |
| [dom-manipulation/](dom-manipulation/) | DOM 操作與事件處理 | 瀏覽器 |
| [fetch-api/](fetch-api/) | Fetch API 與 HTTP 請求 | 瀏覽器 |
| [image-processing/](image-processing/) | 圖片處理相關範例 | 瀏覽器 |

## 範例清單

### ES6+ Features
- [demo.js](es6-features/demo.js) — let/const、箭頭函式、解構、展開/其餘、模板字串、類別、可選鏈、空值合併、Symbol/Iterator、Generator
- [esm-demo.mjs](es6-features/esm-demo.mjs) — ESM 模組系統（named / default / namespace / 動態 import）

### Async JavaScript
- [demo.js](async-js/demo.js) — Callback 與 Callback Hell、Promise（then/catch/finally）、Promise.all/race/allSettled、async/await、錯誤處理、微任務 vs 巨集任務

### DOM Manipulation
- [index.html](dom-manipulation/index.html) — 選取元素、增修改刪節點、事件監聽與委派、冒泡/捕獲、classList、表單驗證、IntersectionObserver、MutationObserver

### Fetch API
- [index.html](fetch-api/index.html) — GET/POST/PUT/DELETE、headers、JSON、HTTP 狀態碼錯誤處理、AbortController、CORS 示範、離線模式

### Image Processing
- [HEIC → JPG 轉換](image-processing/heic2any/) — 使用 heic2any 函式庫在瀏覽器端轉換 HEIC 圖片格式
