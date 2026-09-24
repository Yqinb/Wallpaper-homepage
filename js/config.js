/* =============================================================================
 * js/config.js —— 站点全局配置文件（本项目的【唯一】自定义入口）
 * -----------------------------------------------------------------------------
 * 重要说明：
 *   1. 修改本文件即可改变页面的全部内容与行为，无需改动其他代码。
 *   2. 页面【不提供】任何前端设置面板 / 齿轮按钮 / 导入导出 / 重置功能，
 *      访客打开后只能查看，无法通过界面修改任何配置。
 *   3. 每一项配置都有默认值，直接打开 index.html 即可预览效果。
 *   4. 修改后刷新页面生效（若浏览器缓存，请 Ctrl + F5 强制刷新）。
 *   5. 文件路径均相对于项目根目录，例如 "assets/backgrounds/bg1.jpg"。
 * ========================================================================== */

const CONFIG = {

  /* =========================================================================
   * 一、站点信息（浏览器标签页标题与 SEO）
   * ======================================================================= */
  site: {
    // 浏览器标签页标题（同时也是页面加载完成后显示的标题）
    title: "我的主页",

    // 网页描述，用于 SEO，显示在搜索结果摘要中
    description: "一个简洁美观的纯前端个人主页，支持背景轮播、背景音乐、鼠标特效与响应式布局。",

    // 网页关键词，用于 SEO，多个词用英文逗号分隔
    keywords: "个人主页,前端,作品集,导航,Homepage",

    // 网页作者，用于 SEO
    author: "Your Name",

    // 网页语言，例如 "zh-CN"（简体中文）、"en-US"（英文）
    language: "zh-CN",

    // 网站图标（favicon），一般直接用头像即可
    favicon: "assets/avatar/avatar.png"
  },


  /* =========================================================================
   * 二、个人资料（头像、大标题、小标题、打字机）
   * ======================================================================= */
  profile: {
    // 头像图片路径（放在 assets/avatar/ 目录下）
    avatar: "assets/avatar/avatar.png",

    // 头像尺寸，支持 px 或 rem，例如 "120px"、"7rem"
    avatarSize: "118px",

    // 头像是否显示为圆形（true=圆形，false=方形圆角）
    avatarRound: true,

    // 头像是否显示一圈发光描边
    avatarGlow: true,

    // 大标题（主标题），显示在头像下方
    bigTitle: "你好，欢迎来到我的主页",

    // 小标题（副标题）。开启打字机后，这里作为"第一句"展示
    subtitle: "记录生活 · 分享热爱 · 保持好奇",

    // 打字机效果配置
    typewriter: {
      // 是否开启打字机效果：true=开启，false=直接静态显示 subtitle
      enabled: true,

      // 打字机循环播放的文本数组（可写多句，会依次打字、删除、切换）
      // 注意：数组为空时，自动使用上面的 profile.subtitle
      texts: [
        "记录生活 · 分享热爱 · 保持好奇",
        "前端开发 / 摄影 / 音乐 / 旅行",
        "愿你在这一方小天地里，找到属于自己的光"
      ],

      // 打字速度：每个字出现的间隔（毫秒），越小越快，建议 60~200
      speed: 110,

      // 删除速度：每个字消失的间隔（毫秒），建议 30~80
      deleteSpeed: 45,

      // 一句话打完后停留多久再开始删除（毫秒），建议 1200~3000
      pause: 1800,

      // 是否循环播放：true=无限循环切换，false=播完最后一句后停在最后一句
      loop: true
    }
  },


  /* =========================================================================
   * 三、页脚与社交链接
   * ======================================================================= */
  footer: {
    // 页脚文字，支持纯文本；留空则不显示文字行
    text: "© 2026 Your Name · 用 ❤ 搭建的个人主页",

    // 是否显示页脚区域（文字 + 社交链接一起控制）
    enabled: true,

    // 社交链接列表：图标 + 名称 + 链接
    // icon 可选值（内置图标，直接写名字即可）：
    //   github / twitter / bilibili / mail / weibo / zhihu /
    //   qq / wechat / juejin / rss / link / music / camera / code
    // 若填写的值不在上表中，会自动回退为 "link" 通用链接图标
    social: [
      { icon: "github",   name: "GitHub",   url: "https://github.com/" },
      { icon: "bilibili", name: "哔哩哔哩", url: "https://www.bilibili.com/" },
      { icon: "mail",     name: "邮箱",     url: "mailto:your@email.com" },
      { icon: "rss",      name: "博客",     url: "https://example.com/" }
      // 需要更多就按上面的格式继续添加，例如：
      // { icon: "zhihu", name: "知乎", url: "https://www.zhihu.com/" },
    ]
  },


  /* =========================================================================
   * 四、背景系统
   * ======================================================================= */
  background: {
    // 背景模式：
    //   "fixed"    = 固定一张（固定使用下面列表中的第一张）
    //   "random"   = 随机切换（每次随机抽一张，且不会连续抽到同一张）
    //   "sequence" = 顺序轮播（按列表顺序一张张往下播，播完回到第一张）
    mode: "random",

    // 背景图片列表（放在 assets/backgrounds/ 目录下，建议 1920x1080 以上）
    images: [
      "assets/backgrounds/bg1.jpg",
      "assets/backgrounds/bg2.jpg",
      "assets/backgrounds/bg3.jpg"
    ],

    // 自动切换间隔（毫秒），仅 random / sequence 模式生效，建议 8000~20000
    interval: 12000,

    // 淡入淡出过渡时长（毫秒），建议 800~2000
    fadeDuration: 1400,

    // 背景模糊度，单位 px，例如 "0px" 不模糊，"6px" 轻微模糊，"12px" 强模糊
    blur: "2px",

    // 背景亮度，1 = 原图，小于 1 变暗（推荐 0.5~0.8 让文字更清晰），大于 1 变亮
    brightness: 0.62,

    // 背景遮罩颜色（叠在图片上的半透明色，用于压暗背景突出文字）
    // 写成 rgba 形式更直观；设为 "transparent" 则不加遮罩
    maskColor: "rgba(8, 12, 24, 0.35)",

    // 是否开启缓慢的背景缩放动画（Ken Burns 效果），true=开启，false=关闭
    zoomAnimation: true,

    // 页面加载时是否预加载全部背景图片（true=预加载，首屏更稳；图片很多时可设 false）
    preload: true
  },


  /* =========================================================================
   * 五、背景音乐 BGM 播放器
   * ======================================================================= */
  bgm: {
    // 是否开启背景音乐功能：false 时播放器整体隐藏
    enabled: true,

    // 播放模式（决定"下一首 / 自动切歌"的顺序）：
    //   "fixed"    = 固定播放（固定播放列表中的第一首，循环单曲）
    //   "random"   = 随机播放
    //   "sequence" = 顺序播放（播完自动下一首，最后一首后回到第一首）
    mode: "sequence",

    // 音乐文件列表（放在 assets/bgm/ 目录下）
    // name = 显示歌名，src = 文件路径；支持 mp3 / wav / ogg / flac（视浏览器而定）
    files: [
      { name: "示例音乐 · 晨光", src: "assets/bgm/bgm1.mp3" },
      { name: "示例音乐 · 星海", src: "assets/bgm/bgm2.mp3" },
      { name: "示例音乐 · 微风", src: "assets/bgm/bgm3.mp3" }
    ],

    // 默认音量，范围 0 ~ 1（0 = 静音，1 = 最大），建议 0.3~0.6
    volume: 0.45,

    // 是否显示播放器界面（false 时隐藏播放器，但仍可按快捷键控制）
    showPlayer: true,

    // 是否显示频谱可视化（需要浏览器支持 Web Audio，且音频同域）
    showSpectrum: true,

    // 是否默认展开播放列表（true=展开，false=折叠，可点击按钮切换）
    playlistExpanded: false,

    // 是否单曲循环（true=单曲循环；false=按 mode 决定下一首）
    loopSingle: false,

    // 首次交互后是否自动开始播放（浏览器禁止无交互自动播放，
    // 这里的意思是：用户第一次点击/按键后自动播放。true=自动播放，false=需手动点播放键）
    autoplayAfterInteraction: true
  },


  /* =========================================================================
   * 六、搜索栏
   * ======================================================================= */
  search: {
    // 是否开启搜索栏：false 时隐藏
    enabled: true,

    // 默认搜索引擎（填写下面 engines 中的 key，必须能在列表里找到）
    defaultEngine: "baidu",

    // 搜索引擎列表
    // key  = 引擎标识（唯一）
    // name = 下拉框中显示的名字
    // url  = 搜索地址模板，必须用 {query} 表示关键词占位符
    engines: [
      { key: "baidu",   name: "百度",   url: "https://www.baidu.com/s?wd={query}" },
      { key: "google",  name: "Google", url: "https://www.google.com/search?q={query}" },
      { key: "bing",    name: "Bing",   url: "https://www.bing.com/search?q={query}" },
      { key: "github",  name: "GitHub", url: "https://github.com/search?q={query}" },
      { key: "bilibili",name: "B站",    url: "https://search.bilibili.com/all?keyword={query}" },
      { key: "zhihu",   name: "知乎",   url: "https://www.zhihu.com/search?type=content&q={query}" }
    ],

    // 输入框提示文字
    placeholder: "搜索你想找的东西…",

    // 是否在新标签页打开搜索结果：true=新标签页，false=当前页跳转
    newTab: true,

    // 搜索框宽度，支持 px 或 %，例如 "520px"、"80%"
    width: "560px"
  },


  /* =========================================================================
   * 七、鼠标跟随特效（重点）
   * -------------------------------------------------------------------------
   * 核心特性：鼠标【静止】时，特效自身仍在持续运动（呼吸 / 浮动 / 旋转 / 律动）；
   *           鼠标【移动】时，特效平滑跟随鼠标位置（缓动跟随，非硬跟随）。
   *           支持多点特效（count），每个点独立动画，可形成拖尾或群组效果。
   *           移动端不启用本特效，自动改用"点击特效"代替。
   * ======================================================================= */
  cursor: {
    // 特效类型：
    //   "dot"   = 光点：静止时缓慢呼吸缩放，移动时跟随
    //   "glow"  = 光晕：静止时明暗变化，移动时拖出柔和光尾
    //   "trail" = 粒子拖尾：静止时原地漂浮，移动时留下粒子轨迹
    //   "star"  = 星光：静止时闪烁旋转，移动时散落星光
    //   "orbit" = 环绕小点：多个小点绕鼠标位置公转，鼠标移动时整体跟随
    //   "none"  = 关闭鼠标跟随特效
    type: "orbit",

    // 特效颜色：写一个 = 单色；写多个 = 在多点之间形成渐变色
    // 例如 ["#7dd3fc"] 单色，或 ["#7dd3fc", "#a78bfa", "#f472b6"] 渐变
    colors: ["#7dd3fc", "#a78bfa", "#f472b6"],

    // 特效基础大小（px），建议 6~24
    size: 13,

    // 特效点数量（多点模式）：例如 1=单点，3/5/8=多点拖尾
    // 注意：orbit 类型下该值表示"环绕小点的个数"
    count: 6,

    // 跟随平滑度（缓动系数），范围 0.02 ~ 0.5
    // 越小 = 越慢越飘（拖尾长），越大 = 越紧跟鼠标（接近硬跟随）
    easing: 0.14,

    // 多点之间的延迟衰减（0~0.3）：越大，后面的点越滞后，拖尾越长越明显
    stagger: 0.12,

    // 静止时的自身运动幅度（px）：控制呼吸 / 浮动 / 律动的幅度，0 = 完全静止
    idleAmplitude: 10,

    // 静止时自身运动的快慢，建议 0.5~3
    idleSpeed: 1.4,

    // 仅 orbit 类型生效：环绕半径（px）
    orbitRadius: 38,

    // 仅 orbit 类型生效：公转角速度，建议 0.01~0.06
    orbitSpeed: 0.028,

    // 混合模式："lighter"=发光叠加（推荐，暗色背景更炫）；"source-over"=普通绘制
    blend: "lighter",

    // 是否隐藏系统光标：true=隐藏（用特效当光标），false=保留系统光标
    // 提示：隐藏后点击精度依赖特效中心点，建议配合 dot / orbit 使用
    hideCursor: false
  },


  /* =========================================================================
   * 八、环境粒子特效（独立 Canvas 层，飘在背景之上、内容之下）
   * ======================================================================= */
  particles: {
    // 粒子类型：
    //   "none"   = 关闭
    //   "snow"   = 雪花（向下飘落 + 左右摇摆）
    //   "sakura" = 樱花（旋转飘落的花瓣）
    //   "star"   = 星空（缓慢闪烁的星点）
    //   "bubble" = 气泡（向上漂浮的半透明泡泡）
    enabled: "snow",

    // 粒子数量（PC 端），建议 30~120；数量越多越耗性能
    count: 70,

    // 粒子数量（移动端），移动端性能有限，建议比 PC 少很多
    mobileCount: 22,

    // 粒子基础大小（px），建议 2~6
    size: 3,

    // 粒子运动速度倍率，1=正常，0.5=慢速，2=快速
    speed: 1,

    // 粒子颜色，一般白色即可；星空/樱花可用自带配色，也可自定义
    color: "#ffffff",

    // 粒子不透明度，范围 0~1
    opacity: 0.75
  },


  /* =========================================================================
   * 九、展示栏（重点：文字 + 图片的组合展示区）
   * ======================================================================= */
  showcase: {
    // 是否开启展示栏：false 时整个区域隐藏
    enabled: true,

    // 展示栏标题（显示在展示栏顶部，留空则不显示标题）
    title: "我的精选",

    // 展示栏位置：
    //   "above"  = 主内容上方（头像/标题之上）
    //   "below"  = 主内容下方 / 搜索栏下方（推荐）
    //   "bottom" = 页面最底部（页脚之上）
    position: "below",

    // 展示栏宽度：支持 px 或 %，例如 "80%"、"900px"
    width: "860px",

    // 展示栏高度：支持 px 或 %，例如 "300px"、"auto"（auto = 随内容自适应）
    height: "auto",

    // 背景色：支持 #hex（会自动套用下面的 opacity）或 rgba(...)（此时 opacity 无效）
    background: "#ffffff",

    // 背景透明度，范围 0~1（仅当 background 为 #hex 时生效）
    opacity: 0.08,

    // 圆角大小，例如 "16px"、"24px"
    radius: "18px",

    // 阴影：写 CSS 阴影语法即可，例如 "0 10px 30px rgba(0,0,0,0.35)"；"none" = 无阴影
    shadow: "0 10px 30px rgba(0, 0, 0, 0.3)",

    // 展示方式：
    //   "static"   = 静态排列（所有条目纵向依次排列）
    //   "slider"   = 横向滑动（可左右拖动 / 点箭头切换）
    //   "carousel" = 自动轮播（一次显示一条，自动切换）
    display: "carousel",

    // 自动轮播间隔（毫秒），仅 display = "carousel" 时生效
    interval: 4000,

    // 是否显示左右切换箭头（slider / carousel 生效）
    showArrows: true,

    // 是否显示底部指示圆点（slider / carousel 生效）
    showDots: true,

    // 内容条目列表
    // text      = 文字内容，支持 \n 换行（用 \n 即可，无需写 <br>）
    // image     = 图片路径（放在 assets/showcase/ 目录下），留空则只显示文字
    // imagePosition = 图片位置：
    //     "left"   = 左图右文
    //     "right"  = 右图左文
    //     "top"    = 上图下文
    //     "bottom" = 下图上文
    // imageSize = 图片大小，支持 px 或 %，例如 "160px"、"40%"
    // show      = 是否显示该条目（false 则跳过，方便临时隐藏）
    items: [
      {
        text: "【项目一】响应式个人主页\n基于原生 HTML + CSS + JavaScript 打造，零依赖、可直接部署到 GitHub Pages。",
        image: "assets/showcase/1.jpg",
        imagePosition: "left",
        imageSize: "180px",
        show: true
      },
      {
        text: "【项目二】Canvas 鼠标跟随特效\n支持光点 / 光晕 / 拖尾 / 星光 / 环绕五种形态，静止时依然持续呼吸律动。",
        image: "assets/showcase/2.jpg",
        imagePosition: "right",
        imageSize: "180px",
        show: true
      },
      {
        text: "【项目三】音乐与视觉的结合\n内置 BGM 播放器，支持播放列表、进度条、音量调节与实时频谱可视化。",
        image: "assets/showcase/3.jpg",
        imagePosition: "left",
        imageSize: "180px",
        show: true
      }
    ],

    // 移动端是否单独调整布局
    mobile: {
      // true = 移动端启用下面这套独立参数；false = 与 PC 完全一致
      enabled: true,

      // 移动端宽度，建议 "92%"
      width: "92%",

      // 移动端高度，"auto" = 随内容自适应
      height: "auto",

      // 移动端强制的图片位置：
      //   "top"/"bottom"/"left"/"right" = 强制统一为该位置
      //   "keep" = 保持与 PC 端配置一致
      imagePosition: "top",

      // 移动端图片大小，建议 "100%"
      imageSize: "100%",

      // 移动端展示方式，建议 "static"（上下滑动最顺手）
      display: "static"
    }
  },


  /* =========================================================================
   * 十、主题与外观
   * ======================================================================= */
  theme: {
    // 主题色（影响按钮、链接高亮、进度条、频谱、部分特效），例如 "#7dd3fc"
    primaryColor: "#7dd3fc",

    // 辅助色（渐变的另一端，用于标题渐变、按钮渐变等）
    secondaryColor: "#a78bfa",

    // 页面文字主色，例如 "#ffffff"（深色背景）或 "#1f2937"（浅色背景）
    textColor: "#ffffff",

    // 毛玻璃卡片背景透明度，范围 0~1（越大越实）
    glassAlpha: 0.1,

    // 毛玻璃模糊强度，例如 "14px"
    glassBlur: "16px",

    // 全局圆角，例如 "16px"
    radius: "16px",

    // 页面字体，建议保留系统字体以保证加载速度
    fontFamily: "'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif"
  },


  /* =========================================================================
   * 十一、时钟 / 一言 / 天气 / 问候语
   * ======================================================================= */
  clock: {
    // 是否显示时钟：true=显示，false=隐藏
    enabled: true,

    // 时间格式：true=24 小时制（14:30），false=12 小时制（2:30 PM）
    format24: true,

    // 是否显示秒
    showSeconds: true,

    // 是否显示日期（例如 2026年9月25日 星期五）
    showDate: true
  },

  hitokoto: {
    // 是否开启"一言"（随机名句）：true=开启，false=隐藏
    enabled: true,

    // 接口地址（默认官方接口，一般无需修改）
    api: "https://v1.hitokoto.cn/",

    // 句子类型，可多选，用英文逗号分隔：
    // a=动画 b=漫画 c=游戏 d=文学 e=原创 f=来自网络 g=其他
    // h=影视 i=诗词 j=网易云 k=哲学 l=抖机灵
    // 例如 "a,b,c" 或留空 "" 表示全部类型
    type: "",

    // 是否显示句子出处（例如「出自：xxx」）
    showFrom: true
  },

  weather: {
    // 是否开启天气组件
    // 注意：若开启但 apiKey 留空，组件会自动隐藏（不会报错）
    enabled: false,

    // 天气服务商：
    //   "qweather"     = 和风天气（国内推荐）
    //   "openweather"  = OpenWeatherMap（国外）
    provider: "qweather",

    // API Key，请自行到官网申请后填入；【留空则自动隐藏天气组件】
    apiKey: "",

    // 城市：
    //   和风天气       = 填 LocationID（如北京 "101010100"）或 经纬度（如 "116.41,39.92"）
    //   OpenWeatherMap = 填城市名拼音（如 "Beijing"）
    city: "101010100",

    // 温度单位（主要对 OpenWeatherMap 生效）："metric"=摄氏度，"imperial"=华氏度
    unit: "metric"
  },

  greeting: {
    // 是否显示时间问候语（早上好 / 下午好 / 晚上好 …）
    enabled: true,

    // 是否附带用户称呼，例如 "，朋友"；留空则只显示问候语本身
    suffix: ""
  },


  /* =========================================================================
   * 十二、额外功能（加载动画 / 计数 / 动态标题 / 点击特效 / 右键菜单 …）
   * ======================================================================= */
  extra: {
    // 页面加载动画
    loading: {
      // 是否开启加载动画
      enabled: true,
      // 最短显示时长（毫秒），避免一闪而过，建议 600~1200
      minDuration: 800
    },

    // 访问计数：用 localStorage 记录【本机】访问次数（换浏览器/清缓存会重新计数）
    visitCount: {
      // 是否开启
      enabled: true,
      // 显示的文字模板，{count} 会被替换为访问次数
      text: "你是第 {count} 次来到这里",
      // localStorage 中保存的键名（一般无需修改）
      storageKey: "homepage_visit_count"
    },

    // 动态网页标题：切到后台标签页时改变标题，回来恢复
    dynamicTitle: {
      // 是否开启
      enabled: true,
      // 切到后台时显示的标题
      awayTitle: "你在哪儿？快回来看看～",
      // 回到页面时恢复的标题（留空则自动使用 site.title）
      backTitle: ""
    },

    // 鼠标点击特效（移动端也会启用，作为鼠标跟随特效的替代）
    clickEffect: {
      // 是否开启
      enabled: true,
      // 特效类型："ripple"=波纹扩散，"particle"=粒子迸发
      type: "ripple",
      // 特效颜色，留空则自动使用主题色
      color: "",
      // 单次点击生成的粒子数量（仅 particle 类型生效）
      particleCount: 14
    },

    // 自定义右键菜单
    contextMenu: {
      // 是否开启（true=屏蔽浏览器默认右键菜单并使用自定义菜单）
      enabled: true,
      // 菜单项列表
      // label  = 显示的文字
      // action = 点击后执行的动作，可选值：
      //          "reload"  = 刷新页面
      //          "top"     = 返回顶部
      //          "back"    = 浏览器后退
      //          "copyUrl" = 复制当前网址
      //          "link"    = 打开链接（需要同时填写 url）
      items: [
        { label: "刷新页面",   action: "reload" },
        { label: "返回顶部",   action: "top" },
        { label: "浏览器后退", action: "back" },
        { label: "复制网址",   action: "copyUrl" }
        // 例如添加一个外链：
        // { label: "访问我的 GitHub", action: "link", url: "https://github.com/" }
      ]
    },

    // 图片懒加载：图片滚动到可见区域时才真正加载，节省流量
    lazyLoad: true,

    // 页面可见性变化效果：切到后台时自动暂停动画与音乐，回来恢复
    visibilityEffect: true
  }
};

/* -----------------------------------------------------------------------------
 * 将配置挂载到 window 上。
 * 说明：用 const 声明的顶层变量不会自动成为 window 的属性，
 *       而 js/main.js 是通过 window.CONFIG 读取配置的，因此这里必须显式挂载。
 *       挂载之后，在浏览器控制台输入 CONFIG 也可以直接查看当前配置。
 * -------------------------------------------------------------------------- */
window.CONFIG = CONFIG;
