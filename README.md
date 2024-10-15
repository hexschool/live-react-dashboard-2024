# 六角學院課程範例（React）

> 使用 React + Vite 開發的課程範例。

課程內容詳情可見 [六角學院](https://www.hexschool.com/)。

## 範例說明

此專案是使用 Vite 並搭配 React 開發的課程範例，使用 Bootstrap 作為 CSS 框架，並使用 Redux Toolkit 作為狀態管理工具，為了運行於 GitHub Pages，所以使用 createHashRouter 作為路由。

> **Note**
> createHashRouter 意思是指 URL 中會有 `#` 符號，例如：`https://example.com/#/about`。

## 要求環境

- Node.js v20 以上
- npm v10 以上

## Scripts

> 使用 npm 指令操作。

### 還原套件

```bash
# 安裝套件
npm install
```

### 啟動開發伺服器

```bash
# 啟動開發伺服器
npm start
```

### 佈署 GitHub Pages

```bash
# 佈署到 GitHub Pages
npm run deploy
```

### 檢查程式碼

```bash
# 檢查程式碼
npm run lint
```

### 打包程式碼

```bash
# 打包程式碼
npm run build
```

## 使用套件

- [React DOM](https://www.npmjs.com/package/react-dom)
- [React Router](https://reactrouter.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Hook Form](https://www.react-hook-form.com/)
- [React Loading](https://www.npmjs.com/package/react-loading)
- [React Router DOM](https://www.npmjs.com/package/react-router-dom)
- [Prop Types](https://www.npmjs.com/package/prop-types)
- [CkEditor5](https://ckeditor.com/ckeditor-5/)
- [ESLint](https://eslint.org/)（風格：Airbnb）
- [Axios](https://axios-http.com/docs/intro)
- [Bootstrap5](https://getbootstrap.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Sass](https://sass-lang.com/)
- [DotEnv](https://www.npmjs.com/package/dotenv)
- [gh-pages](https://israynotarray.com/git/20230530/3386912069/)

## ESlint

- 使用 Airbnb 風格
- 設定檔：`.eslintrc.js`
- 忽略檔案：`.eslintignore`
