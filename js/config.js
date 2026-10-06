/* =============================================================================
 * js/config.js —— 唯一需要修改的配置文件
 * =============================================================================
 * 这是一个纯前端静态主页：
 *   - 不需要数据库、后台、登录或管理面板
 *   - 所有内容和功能都在这里配置
 *   - main.js / effects.js 只负责执行逻辑，请尽量不要修改
 *   - 修改后刷新网页即可生效
 * ============================================================================= */

const CONFIG = {

  /* =========================
   * ① 网站基本信息
   * ========================= */
  site: {
    title: "我的主页",
    description: "一个纯前端个人主页",
    keywords: "个人主页,Homepage,导航",
    author: "Your Name",
    language: "zh-CN",
    favicon: "assets/avatar/avatar.png"
  },

  /* =========================
   * ② 个人信息
   * ========================= */
  profile: {
    avatar: "assets/avatar/avatar.png",
    avatarSize: "116px",
    avatarRound: true,
    avatarGlow: true,

    bigTitle: "Ciallo～(∠・ω< )⌒★",
    subtitle: "记录生活 · 分享热爱 · 保持好奇",

    typewriter: {
      enabled: true,
      texts: [
        "记录生活 · 分享热爱 · 保持好奇",
        "前端开发 / 摄影 / 音乐 / 旅行",
        "愿你在这一方小天地里，找到属于自己的光"
      ],
      speed: 90,
      deleteSpeed: 42,
      pause: 1800,
      loop: true
    }
  },

  /* =========================
   * ③ 背景
   * ========================= */
  background: {
    mode: "random",
    images: [
      "assets/backgrounds/bg1.jpg",
      "assets/backgrounds/bg2.jpg",
      "assets/backgrounds/bg3.jpg"
    ],
    interval: 14000,
    fadeDuration: 1600,
    blur: "2px",
    brightness: 0.58,
    maskColor: "rgba(5, 8, 18, 0.42)",
    zoomAnimation: true,
    preload: true
  },

  /* =========================
   * ④ 自动壁纸
   * ========================= */
  wallpaper: {
    enabled: true,
    source: "picsum",
    width: 2560,
    height: 1440,
    interval: 10 * 60 * 1000,
    fadeDuration: 1800,
    randomize: true,
    fallbackToLocal: true
  },

  /* =========================
   * ④ 音乐
   * ========================= */
  bgm: {
    enabled: true,
    mode: "sequence",
    files: [
      { name: "示例音乐 · 晨光", src: "assets/bgm/bgm1.mp3" },
      { name: "示例音乐 · 星海", src: "assets/bgm/bgm2.mp3" },
      { name: "示例音乐 · 微风", src: "assets/bgm/bgm3.mp3" }
    ],
    volume: 0.4,
    showPlayer: true,
    showSpectrum: true,
    playlistExpanded: false,
    loopSingle: false,
    autoplayAfterInteraction: true
  },

  /* =========================
   * ⑤ 搜索
   * ========================= */
  search: {
    enabled: true,
    defaultEngine: "google",
    engines: [
      { key: "google",   name: "Google", url: "https://www.google.com/search?q={query}" },
      { key: "bing",     name: "Bing",   url: "https://www.bing.com/search?q={query}" },
      { key: "baidu",    name: "百度",   url: "https://www.baidu.com/s?wd={query}" },
      { key: "github",   name: "GitHub", url: "https://github.com/search?q={query}" },
      { key: "bilibili", name: "B站",    url: "https://search.bilibili.com/all?keyword={query}" },
      { key: "zhihu",    name: "知乎",   url: "https://www.zhihu.com/search?type=content&q={query}" }
    ],
    placeholder: "搜索任何你感兴趣的东西…",
    newTab: true,
    width: "620px"
  },

  /* =========================
   * ⑥ 鼠标特效
   * ========================= */
  cursor: {
    type: "orbit",
    colors: ["#7dd3fc", "#a78bfa", "#f472b6"],
    size: 12,
    count: 6,
    easing: 0.12,
    stagger: 0.11,
    idleAmplitude: 9,
    idleSpeed: 1.2,
    orbitRadius: 34,
    orbitSpeed: 0.024,
    blend: "lighter",
    hideCursor: false
  },

  /* =========================
   * ⑦ 环境粒子
   * ========================= */
  particles: {
    enabled: "star",
    count: 65,
    mobileCount: 18,
    size: 2.5,
    speed: 0.55,
    color: "#ffffff",
    opacity: 0.55
  },

  /* =========================
   * ⑧ 展示栏
   * ========================= */
  showcase: {
    enabled: false,
    title: "我的精选",
    position: "below",
    width: "860px",
    height: "auto",
    background: "#ffffff",
    opacity: 0.07,
    radius: "22px",
    shadow: "0 20px 60px rgba(0,0,0,0.35)",
    display: "carousel",
    interval: 5000,
    showArrows: true,
    showDots: true,
    items: [
      {
        text: "【项目一】响应式个人主页\n基于原生 HTML + CSS + JavaScript 打造。",
        image: "assets/showcase/1.jpg",
        imagePosition: "left",
        imageSize: "180px",
        show: true
      },
      {
        text: "【项目二】Canvas 鼠标跟随特效\n让页面在静止时也保持生命感。",
        image: "assets/showcase/2.jpg",
        imagePosition: "right",
        imageSize: "180px",
        show: true
      },
      {
        text: "【项目三】音乐与视觉\n播放器、频谱与背景视觉统一融合。",
        image: "assets/showcase/3.jpg",
        imagePosition: "left",
        imageSize: "180px",
        show: true
      }
    ],
    mobile: {
      enabled: true,
      width: "92%",
      height: "auto",
      imagePosition: "top",
      imageSize: "100%",
      display: "static"
    }
  },

  /* =========================
   * ⑨ 主题
   * ========================= */
  theme: {
    primaryColor: "#7dd3fc",
    secondaryColor: "#a78bfa",
    textColor: "#f8fafc",
    glassAlpha: 0.075,
    glassBlur: "20px",
    radius: "20px",
    fontFamily: "'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif"
  },

  /* =========================
   * ⑩ 时间 / 一言 / 天气 / 问候
   * ========================= */
  clock: {
    enabled: true,
    format24: true,
    showSeconds: true,
    showDate: true
  },

  hitokoto: {
    enabled: true,
    api: "https://v1.hitokoto.cn/",
    type: "",
    showFrom: true
  },

  weather: {
    enabled: false,
    provider: "qweather",
    apiKey: "",
    city: "",
    unit: "metric"
  },

  greeting: {
    enabled: true,
    suffix: ""
  },

  /* =========================
   * ⑪ 其他功能
   * ========================= */
  footer: {
    enabled: true,
    text: "© 2026 Your Name · Built with HTML / CSS / JavaScript",
    social: [
      { icon: "github", name: "GitHub", url: "https://github.com/" },
      { icon: "bilibili", name: "哔哩哔哩", url: "https://www.bilibili.com/" },
      { icon: "mail", name: "邮箱", url: "mailto:your@email.com" },
      { icon: "link", name: "主页", url: "https://example.com/" }
    ]
  },

  extra: {
    loading: {
      enabled: true,
      minDuration: 700
    },

    visitCount: {
      enabled: false,
      text: "你是第 {count} 次来到这里",
      storageKey: "homepage_visit_count"
    },

    dynamicTitle: {
      enabled: true,
      awayTitle: "回来看看吧 · ✦",
      backTitle: ""
    },

    clickEffect: {
      enabled: true,
      type: "ripple",
      color: "",
      particleCount: 12
    },

    contextMenu: {
      enabled: false,
      items: [
        { label: "刷新页面", action: "reload" },
        { label: "返回顶部", action: "top" },
        { label: "复制网址", action: "copyUrl" }
      ]
    },

    lazyLoad: true,
    visibilityEffect: true
  }
};

window.CONFIG = CONFIG;
