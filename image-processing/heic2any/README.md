# HEIC → JPG 轉換範例

使用 [heic2any](https://github.com/alexcorvi/heic2any) 函式庫，在瀏覽器端將 HEIC/HEIF 格式的圖片轉換為 JPEG。

## 執行方式

直接用瀏覽器開啟 `index.html`，選擇一張 `.heic` 圖片即可自動轉換並預覽。

> 注意：部分瀏覽器不支援從 `file://` 開啟含 Web Worker 的頁面，建議使用本地伺服器（例如 VS Code 的 Live Server 擴充套件）。

## 目錄結構

```
heic2any/
├── index.html       # 主要 demo 頁面
├── vendor/
│   └── heic2any.js  # heic2any 函式庫（本地端 vendor）
└── README.md
```

## 功能說明

- 上傳 `.heic` 格式圖片
- 自動驗證檔案類型（非 HEIC 會顯示錯誤提示）
- 轉換中顯示 loading 狀態
- 轉換成功後顯示圖片預覽
- 轉換失敗時顯示錯誤訊息

## Vendor 來源

`vendor/heic2any.js` 來自 [heic2any v0.0.4](https://github.com/alexcorvi/heic2any)，MIT License。
