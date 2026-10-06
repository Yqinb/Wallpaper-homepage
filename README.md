# 纯前端个人主页

一个**零依赖、纯静态、配置驱动**的个人主页：HTML + CSS + 原生 JavaScript。

它没有后台、数据库、登录系统或网页设置面板。**你拥有源码，就拥有全部配置权；访客只能查看。**

## 目录

```
.
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── config.js       # ★ 唯一需要经常修改的文件
│   ├── effects.js      # Canvas 特效
│   └── main.js         # 页面逻辑
├── assets/
│   ├── backgrounds/
│   ├── bgm/
│   ├── avatar/
│   └── showcase/
└── README.md
```

## 核心设计

```
修改 js/config.js
       ↓
    main.js
       ↓
     页面
```

日常换头像、背景、音乐、搜索引擎、主题色、文案、特效、天气等内容时，只需要修改 **`js/config.js`**。

## 快速开始

推荐使用本地静态服务器预览：

```bash
python3 -m http.server 8000
```

然后打开 `http://localhost:8000`。

也可以直接打开 `index.html`，但部分浏览器会限制 `file://` 下的音频频谱和跨域请求。

## 最常改的配置

### 1. 个人信息

```js
profile: {
  avatar: "assets/avatar/avatar.png",
  bigTitle: "你好，我是 XXX",
  subtitle: "记录生活 · 分享热爱 · 保持好奇",

  typewriter: {
    enabled: true,
    texts: [
      "第一句话",
      "第二句话",
      "第三句话"
    ]
  }
}
```

### 2. 背景

```js
background: {
  mode: "random", // fixed / random / sequence
  images: [
    "assets/backgrounds/bg1.jpg",
    "assets/backgrounds/bg2.jpg",
    "assets/backgrounds/bg3.jpg"
  ],
  interval: 14000,
  blur: "2px",
  brightness: 0.58
}
```

### 3. 音乐

```js
bgm: {
  enabled: true,
  mode: "sequence",
  files: [
    { name: "第一首", src: "assets/bgm/01.mp3" },
    { name: "第二首", src: "assets/bgm/02.mp3" }
  ],
  volume: 0.4
}
```

### 4. 搜索

```js
search: {
  enabled: true,
  defaultEngine: "google",
  engines: [
    { key: "google", name: "Google", url: "https://www.google.com/search?q={query}" }
  ]
}
```

其中 `{query}` 是搜索关键词占位符，不能删除。

### 5. 主题

```js
theme: {
  primaryColor: "#7dd3fc",
  secondaryColor: "#a78bfa",
  textColor: "#f8fafc",
  glassAlpha: 0.075,
  glassBlur: "20px",
  radius: "20px"
}
```

改这里即可改变整个网站的主要视觉风格，不需要改 CSS。

### 6. 特效

```js
cursor: {
  type: "orbit", // dot / glow / trail / star / orbit / none
  count: 6,
  colors: ["#7dd3fc", "#a78bfa", "#f472b6"]
}

particles: {
  enabled: "star", // none / snow / sakura / star / bubble
  count: 65
}
```

### 7. 天气

天气属于第三方 API 功能。

如果不需要天气：

```js
weather: {
  enabled: false
}
```

如果需要天气：

```js
weather: {
  enabled: true,
  provider: "qweather",
  apiKey: "你的 API Key",
  city: "你的城市 ID"
}
```

注意：纯前端项目无法真正隐藏写在 `config.js` 中的 API Key。如果某个服务的 Key 属于真正的秘密凭证，就不应该放在静态网页里。

## 替换素材

| 目录 | 用途 |
|---|---|
| `assets/avatar/` | 头像 |
| `assets/backgrounds/` | 背景图片 |
| `assets/bgm/` | 音乐 |
| `assets/showcase/` | 展示栏图片 |

使用自己的文件后，在 `config.js` 修改对应路径即可。

## 部署

这是静态网站，不需要构建，可以直接部署到 GitHub Pages、Cloudflare Pages、Netlify、Vercel 或任意静态文件空间。

## 功能

- 背景固定 / 随机 / 顺序轮播
- 背景淡入淡出 / Ken Burns 缓慢缩放
- BGM 播放器 / 播放列表 / 进度 / 音量 / 频谱
- 多搜索引擎
- 一言
- 可选天气
- 时钟与时间问候
- 鼠标跟随特效
- 环境粒子
- 点击特效
- 图文展示栏
- 社交链接
- 动态网页标题
- 加载动画
- 图片懒加载
- 响应式移动端布局
- 深色玻璃拟态视觉

## 原则

**没有后台、没有数据库、没有登录、没有前端设置面板。**

修改网站 = 修改源码。

日常修改入口只有 **`js/config.js`**；其它文件除非要开发新功能，否则不需要动。
