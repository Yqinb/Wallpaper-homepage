# 纯前端个人主页

一个**零依赖、纯静态**的个人主页项目：HTML + CSS + 原生 JavaScript，无需后端、无需构建工具，可直接部署到 GitHub Pages / Vercel / Netlify 等免费静态托管。

> 页面**不提供任何前端设置面板**，没有齿轮按钮、导入导出或重置功能。访客打开后只能查看。
> 所有自定义项**只通过修改 `js/config.js` 完成**。

---

## 一、目录结构

```
.
├── index.html              # 主页面（结构骨架，一般无需修改）
├── css/
│   └── style.css           # 全部样式（响应式 + CSS 变量主题）
├── js/
│   ├── config.js           # ★ 配置文件：所有自定义项集中在这里，带详细中文注释
│   ├── effects.js          # Canvas 视觉特效（环境粒子 / 鼠标跟随 / 点击特效）
│   └── main.js             # 主逻辑：读取 config 并渲染各个功能模块
├── assets/
│   ├── backgrounds/        # 背景图片（bg1.jpg / bg2.jpg / bg3.jpg）
│   ├── bgm/                # 背景音乐（bgm1.mp3 / bgm2.mp3 / bgm3.mp3）
│   ├── avatar/             # 头像（avatar.png）
│   └── showcase/           # 展示栏图片（1.jpg / 2.jpg / 3.jpg）
└── README.md               # 本说明文件
```

> 关于 `js/effects.js`：需求中的目录规范只列出 `config.js` 与 `main.js`，但特效代码量较大，
> 按「代码过长可分文件」的约定拆出本文件，保持 `main.js` 可读。三个文件均为普通脚本（非 ES Module），
> 在 `index.html` 中按 **config → effects → main** 的顺序引入，顺序不可调换。

---

## 二、快速开始

**本地预览**（推荐用本地服务器，避免 `file://` 协议下部分特性受限）：

```bash
# 方式一：Python
cd 项目目录
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000

# 方式二：Node
npx serve .
```

也可以直接双击 `index.html` 打开，但 `file://` 协议下**音频频谱、一言接口**可能被浏览器安全策略拦截（页面其余功能不受影响）。

---

## 三、如何修改配置

所有配置都在 **`js/config.js`**，每个选项都带中文注释，说明「作用 / 可选值 / 示例」。改完保存并刷新页面即可（若被缓存，按 `Ctrl + F5` 强制刷新）。

### 常用修改示例

**1. 改标题、头像、副标题**

```js
site:    { title: "小林的主页", ... }
profile: { avatar: "assets/avatar/avatar.png", bigTitle: "你好，我是小林", subtitle: "……" }
```

**2. 打字机文案**

```js
profile.typewriter.texts: [
  "第一句话",
  "第二句话",
  "第三句话"
]
// enabled: false  → 关闭打字机，直接显示 subtitle
// loop: false     → 播完最后一句就停住
```

**3. 背景切换方式**

```js
background.mode: "random"     // fixed=固定一张 / random=随机 / sequence=顺序轮播
background.images: ["assets/backgrounds/bg1.jpg", ...]
background.interval: 12000    // 切换间隔（毫秒）
background.blur: "2px"        // 模糊度
background.brightness: 0.62   // 亮度（1=原图，越小越暗）
```

**4. 背景音乐**

```js
bgm.enabled: true
bgm.mode: "sequence"          // fixed=单曲 / random=随机 / sequence=顺序
bgm.files: [{ name: "歌名", src: "assets/bgm/xxx.mp3" }]
bgm.volume: 0.45              // 默认音量 0~1
bgm.showSpectrum: true        // 频谱可视化
```

**5. 搜索引擎**

```js
search.engines: [
  { key: "baidu", name: "百度", url: "https://www.baidu.com/s?wd={query}" },
  ...
]
// {query} 是关键词占位符，必须保留
search.defaultEngine: "baidu" // 必须是上面列表里的某个 key
```

**6. 鼠标跟随特效**

```js
cursor.type: "orbit"          // dot/glow/trail/star/orbit/none
cursor.count: 6               // 特效点数量（多点拖尾或环绕小点个数）
cursor.colors: ["#7dd3fc", "#a78bfa", "#f472b6"]  // 单色或渐变
cursor.easing: 0.14           // 跟随平滑度，越小越飘
cursor.hideCursor: false      // 是否隐藏系统光标
```

**7. 环境粒子**

```js
particles.enabled: "snow"     // none/snow/sakura/star/bubble
particles.count: 70           // PC 端数量
particles.mobileCount: 22     // 移动端自动降低数量
```

**8. 展示栏**

```js
showcase.enabled: true
showcase.position: "below"    // above=主内容上方 / below=搜索栏下方 / bottom=页面底部
showcase.display: "carousel"  // static=静态排列 / slider=横向滑动 / carousel=自动轮播
showcase.items: [
  {
    text: "第一行\n第二行",     // \n 会渲染为换行
    image: "assets/showcase/1.jpg",
    imagePosition: "left",    // left/right/top/bottom
    imageSize: "180px",
    show: true                // false 可临时隐藏该条目
  }
]
showcase.mobile.enabled: true // 移动端单独布局（宽度、图片位置、展示方式）
```

**9. 天气组件（需自备 API Key）**

```js
weather.enabled: true
weather.provider: "qweather"  // qweather=和风天气 / openweather=OpenWeatherMap
weather.apiKey: "在这里填你的 Key"
weather.city: "101010100"     // 和风填 LocationID，OpenWeatherMap 填城市拼音
```

> **未填 `apiKey` 时天气组件会自动隐藏**，不会报错、不会影响页面。

**10. 主题色**

```js
theme.primaryColor: "#7dd3fc"    // 主题色（按钮、进度条、频谱、特效）
theme.secondaryColor: "#a78bfa"  // 渐变辅助色
theme.textColor: "#ffffff"       // 文字颜色
```

主题色通过 **CSS 变量**注入，改 `config.js` 即可全局生效，无需改 CSS。

---

## 四、如何替换素材

把同名文件放进对应目录即可，**无需改代码**；若要用不同文件名，记得同步修改 `js/config.js` 里的路径。

| 目录 | 用途 | 配置位置 | 建议规格 |
|---|---|---|---|
| `assets/backgrounds/` | 背景图 | `background.images` | 1600×900 以上 JPG，单张 < 500KB |
| `assets/avatar/` | 头像 | `profile.avatar` | 400×400 PNG，正方形 |
| `assets/showcase/` | 展示栏图片 | `showcase.items[].image` | 800×500 左右 |
| `assets/bgm/` | 背景音乐 | `bgm.files` | MP3（兼容性最好），192kbps 以内 |

> 目录内当前的文件为**占位素材**（自动生成的渐变图与合成音乐），仅供预览，请替换成你自己的内容。

---

## 五、部署到 GitHub Pages

1. 在 GitHub 新建一个仓库，例如 `homepage`。
2. 把本项目**全部文件**推上去（注意 `index.html` 必须在仓库根目录）：

```bash
git init
git add .
git commit -m "feat: init homepage"
git branch -M main
git remote add origin https://github.com/<你的用户名>/homepage.git
git push -u origin main
```

3. 打开仓库 → **Settings** → **Pages**。
4. **Source** 选择 `Deploy from a branch`，**Branch** 选 `main`、目录选 `/ (root)`，点 Save。
5. 等待 1～2 分钟，访问 `https://<你的用户名>.github.io/homepage/` 即可。

> 如果仓库名是 `<用户名>.github.io`（同名仓库），访问地址就是 `https://<用户名>.github.io/`。

**其他静态托管**：Vercel / Netlify / Cloudflare Pages 都支持直接拖拽整个文件夹，或连接仓库后保持默认构建命令（无需构建）即可。

---

## 六、功能清单

| 分类 | 功能 |
|---|---|
| 背景 | 固定 / 随机 / 顺序轮播、淡入淡出、模糊与亮度调节、缓慢缩放、图片预加载 |
| 音乐 | 上一首 / 播放暂停 / 下一首、进度条、音量、歌名、可展开播放列表、频谱可视化、快捷键 |
| 搜索 | 多引擎下拉切换、自定义 URL 模板、新标签页打开 |
| 特效 | 鼠标跟随（5 种类型、多点、静止时持续律动）、环境粒子（4 种）、点击特效（波纹 / 粒子） |
| 展示栏 | 图文混排、四种图片位置、静态 / 横滑 / 自动轮播、移动端独立布局 |
| 其他 | 加载动画、时钟、一言、天气、访问计数、动态标题、时间问候语、自定义右键菜单、图片懒加载、可见性变化处理 |

**键盘快捷键**：`空格` 播放/暂停 · `←` `→` 切歌 · `↑` `↓` 调音量（在输入框内不触发）

---

## 七、常见问题

**Q：音乐没有自动播放？**
A：浏览器禁止无交互自动播放。首次点击页面任意位置或按任意键后即会开始播放（由 `bgm.autoplayAfterInteraction` 控制）。

**Q：频谱不显示？**
A：频谱依赖 Web Audio，在 `file://` 协议或跨域音频下会被安全策略拦截，此时会自动隐藏频谱、音乐照常播放。用本地服务器或部署到线上即可正常显示。

**Q：一言不显示？**
A：一言来自 `https://v1.hitokoto.cn/`，需要联网。接口不可用时会自动隐藏该行，不影响其他功能。

**Q：改了 config 没生效？**
A：浏览器缓存导致，按 `Ctrl + F5` 强制刷新；部署到线上后可等几分钟或清理缓存。

**Q：访问计数不准？**
A：计数保存在浏览器 `localStorage`，只记录**本机**访问次数，换浏览器、换设备或清缓存都会重新开始计数。它并不等同于网站真实访客数。

---

## 八、技术说明

- 原生 JavaScript，无任何框架与构建依赖；CSS 使用 CSS 变量实现主题化。
- Canvas + `requestAnimationFrame` 驱动特效；移动端自动降低粒子数量、关闭鼠标跟随特效，改用点击特效。
- 响应式断点：`1024px` / `768px` / `480px`，PC 端布局优先，移动端自动调整间距、字号与排列方式。
- 页面切到后台时自动暂停动画与音乐，回到前台恢复，节省资源。
