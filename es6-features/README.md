# ES6+ Features

ES6（ECMAScript 2015）及後續版本的語法特性範例。

## 涵蓋主題

- `let` / `const` 與 block scope
- 箭頭函式（Arrow Functions）
- 解構賦值（Destructuring）
- 展開運算子（Spread / Rest）
- 模板字串（Template Literals）
- 類別（Class）語法
- 可選鏈（Optional Chaining `?.`）與空值合併（`??`）
- Symbols 與 Iterators
- Generators
- 模組系統（ESM `import` / `export`）

## 檔案清單

| 檔案 | 說明 |
|---|---|
| [demo.js](demo.js) | 語法特性入門範例（let/const、箭頭函式、解構、展開/其餘、模板字串、類別、可選鏈、空值合併、Symbol/Iterator、Generator） |
| [esm-demo.mjs](esm-demo.mjs) | ESM 模組系統範例（named / default / namespace import、動態 import） |
| [lib.mjs](lib.mjs) | 供 esm-demo.mjs 匯入的模組（具名與預設匯出） |

## 執行方式

```bash
node demo.js        # 語法特性範例
node esm-demo.mjs   # ESM 模組範例
```

> 使用 `.mjs` 副檔名，無需 `package.json` 即可用 ESM `import` / `export`。
