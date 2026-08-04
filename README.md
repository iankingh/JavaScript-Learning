# JavaScript Learning

個人 JavaScript 學習範例集。各資料夾皆為獨立主題：Node.js 範例可直接執行，瀏覽器範例則是無建置流程的 HTML 頁面。

## 學習主題

| 資料夾 | 內容 | 執行環境 |
|---|---|---|
| [es6-features/](es6-features/) | `let`／`const`、箭頭函式、解構、展開與其餘、template literals、class、optional chaining、iterator、generator、ES modules | Node.js |
| [async-js/](async-js/) | callback、Promise、`async`／`await`、錯誤處理、event loop、microtask 與 macrotask | Node.js |
| [dom-manipulation/](dom-manipulation/) | DOM 查找與增刪改、事件、表單驗證、IntersectionObserver、MutationObserver | 瀏覽器 |
| [fetch-api/](fetch-api/) | GET／POST／PUT／DELETE、headers、錯誤處理、AbortController、CORS 與離線 mock | 瀏覽器 |
| [image-processing/](image-processing/) | 使用 vendored `heic2any` 在瀏覽器將 HEIC／HEIF 轉為 JPEG | 瀏覽器 |

各主題的檔案與操作方式請見資料夾內 README。

## 環境需求

- Node.js：執行 `async-js/` 與 `es6-features/`；倉庫未鎖定版本，建議使用目前受支援的 LTS 版本。
- 現代瀏覽器：執行 DOM、Fetch 與圖片處理範例。
- Fetch 真實請求需網路連線；HEIC 轉換建議透過本地 HTTP server 開啟，避免瀏覽器限制 `file://` 下的 Web Worker。

本倉庫沒有 `package.json`，不需安裝 npm 套件，也沒有 build、test 或 lint script。

## 執行方式

Node.js 範例：

```bash
node async-js/demo.js
node es6-features/demo.js
node es6-features/esm-demo.mjs
```

瀏覽器範例可直接開啟對應的 `index.html`：

- `dom-manipulation/index.html`
- `fetch-api/index.html`
- `image-processing/heic2any/index.html`

## 專案結構

```text
JavaScript-Learning/
├── async-js/              # 非同步 JavaScript
├── dom-manipulation/      # DOM 與事件
├── es6-features/          # ES6+ 與 ESM
├── fetch-api/             # Fetch API
└── image-processing/
    └── heic2any/          # HEIC → JPEG 頁面與本地 vendor
```

## 設定與限制

- 不需環境變數或秘密設定。
- `fetch-api/` 預設呼叫 JSONPlaceholder，另有一個刻意觸發 CORS 的 httpbin 範例；可切換頁面內的離線模式。
- `image-processing/heic2any/vendor/heic2any.js` 已存放於倉庫，不會由 npm 安裝。
- 這是可手動操作的學習範例集，目前沒有自動化測試或統一開發伺服器。
