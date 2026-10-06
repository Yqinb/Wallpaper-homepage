# Wallpaper-homepage

纯前端个人主页。

- HTML + CSS + JavaScript
- 无后端、无数据库、无登录
- 所有自定义项集中在 `js/config.js`
- 支持本地壁纸与免费自动壁纸
- 支持音乐、搜索、时钟、特效等
- 可直接部署到 GitHub Pages、Vercel、Netlify 等静态托管

## 配置

修改：

`js/config.js`

保存后刷新页面即可。

## 自动壁纸

默认使用 Lorem Picsum 免费随机图片服务，无需 API Key。

相关配置：

```js
wallpaper: {
  enabled: true,
  source: "picsum",
  interval: 10 * 60 * 1000
}
```

## 本地运行

```bash
python3 -m http.server 8000
```

然后打开：

`http://localhost:8000`

## 目录

```
.
├── index.html
├── css/
├── js/
└── assets/
```
