# Fetch API

使用 Fetch API 進行 HTTP 請求的範例。

## 涵蓋主題

- 基本 GET / POST / PUT / DELETE 請求
- 請求標頭（Headers）設定
- JSON 資料處理
- 錯誤處理（HTTP 狀態碼判斷、`res.ok`）
- `AbortController` 取消請求
- CORS 概念（實際示範跨網域被擋下）
- 與 `async/await` 搭配使用
- 離線模式（內嵌假資料，不需網路）

## 檔案清單

| 檔案 | 說明 |
|---|---|
| [index.html](index.html) | 互動式範例（7 個區塊），使用 JSONPlaceholder 公開 API 示範 |

## 執行方式

直接用瀏覽器開啟 `index.html` 即可。預設對 `https://jsonplaceholder.typicode.com` 發送真實請求；勾選頁面頂部的「離線模式」可改用內嵌假資料，不需網路。

> fetch 只在網路層錯誤時 `reject`，HTTP 4xx/5xx 不會自動 reject，需以 `res.ok` 判斷並手動拋出錯誤。
>
> CORS 屬於瀏覽器安全機制，跨網域請求需伺服器回傳正確的 CORS 標頭才會成功。第 7 區塊故意觸發 CORS 錯誤，請同時開啟 DevTools Console 觀察。
