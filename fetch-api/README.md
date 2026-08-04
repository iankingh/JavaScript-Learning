# Fetch API

使用 Fetch API 進行 HTTP 請求的範例。

## 涵蓋主題

- 基本 GET / POST 請求
- 請求標頭（Headers）設定
- JSON 資料處理
- 錯誤處理（HTTP 狀態碼判斷、`res.ok`）
- `AbortController` 取消請求
- 與 `async/await` 搭配使用
- CORS 概念

## 檔案清單

| 檔案 | 說明 |
|---|---|
| [index.html](index.html) | 互動式範例，使用 JSONPlaceholder 公開 API 示範 |

## 執行方式

直接用瀏覽器開啟 `index.html` 即可。範例會對 `https://jsonplaceholder.typicode.com` 發送真實請求。

> fetch 只在網路層錯誤時 `reject`，HTTP 4xx/5xx 不會自動 reject，需以 `res.ok` 判斷並手動拋出錯誤。

> PUT / DELETE 等方法可仿照 POST 範例，調整 `method` 與 `body`。CORS 屬於瀏覽器安全機制，跨網域請求需伺服器回傳正確的 CORS 標頭才會成功。
