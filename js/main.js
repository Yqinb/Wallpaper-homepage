/* =============================================================================
 * js/main.js —— 主逻辑
 * -----------------------------------------------------------------------------
 * 职责：读取 js/config.js 中的配置，渲染并驱动页面上的全部功能。
 *
 * 模块顺序：
 *   01 工具函数        02 主题与 SEO      03 加载动画      04 背景系统
 *   05 个人资料与打字机 06 问候语与时钟    07 一言          08 天气
 *   09 搜索栏          10 展示栏          11 页脚与访问计数 12 BGM 播放器
 *   13 动态标题与可见性 14 右键菜单        15 图片懒加载    16 特效启动与总入口
 *
 * 注意：本文件【不提供】任何前端设置面板，页面不存在修改配置的入口。
 * ========================================================================== */

(function () {
  'use strict';

  // 读取全局配置（兼容 window.CONFIG 与顶层 const CONFIG 两种写法）
  const C = window.CONFIG || (typeof CONFIG !== 'undefined' ? CONFIG : {});

  /* =========================================================================
   * 01 工具函数
   * ======================================================================= */
  const $ = function (id) { return document.getElementById(id); };

  /** 安全的取配置：路径不存在时回退默认值 */
  function get(path, def) {
    const keys = path.split('.');
    let cur = C;
    for (let i = 0; i < keys.length; i++) {
      if (cur == null || typeof cur !== 'object') return def;
      cur = cur[keys[i]];
    }
    return cur === undefined ? def : cur;
  }

  /** 秒 → mm:ss */
  function fmtTime(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  /** 数字补零 */
  const pad = function (n) { return (n < 10 ? '0' : '') + n; };

  /** #hex + 透明度 → rgba()，非 hex 则原样返回 */
  function withAlpha(color, alpha) {
    if (typeof color !== 'string') return color;
    const m = color.match(/^#([0-9a-f]{6})$/i) || color.match(/^#([0-9a-f]{3})$/i);
    if (!m) return color;                       // 已经是 rgba()/颜色名，原样使用
    let h = m[1];
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const a = alpha == null ? 1 : alpha;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  /** 更新滑块已填充部分的百分比（CSS 变量 --fill） */
  function setFill(el, pct) {
    if (el) el.style.setProperty('--fill', Math.max(0, Math.min(100, pct)) + '%');
  }

  /** 社交图标库：config 中 icon 字段填写下列 key 即可 */
  const ICONS = {
    github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3.1-.4 6.4-1.5 6.4-7A5.4 5.4 0 0 0 20 4.8 5.1 5.1 0 0 0 19.9 1S18.7.7 16 2.5a13.4 13.4 0 0 0-7 0C6.3.7 5.1 1 5.1 1A5.1 5.1 0 0 0 5 4.8a5.4 5.4 0 0 0-1.5 3.8c0 5.4 3.3 6.6 6.4 7a3.4 3.4 0 0 0-.9 2.6V22"></path>',
    twitter: '<path d="M23 3a10.9 10.9 0 0 1-3.1 1.5 4.5 4.5 0 0 0-7.9 3v1A10.7 10.7 0 0 1 3 4s-4 9 5 13a11.6 11.6 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.1-.8A7.7 7.7 0 0 0 23 3z"></path>',
    bilibili: '<rect x="2" y="7" width="20" height="13" rx="3"></rect><path d="M7 3l3 4M17 3l-3 4"></path><path d="M9 12v3M15 12v3"></path>',
    mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',
    weibo: '<circle cx="12" cy="12" r="9"></circle><path d="M8.5 12.5c0-2 1.8-3.5 3.5-3.5s3.5 1.5 3.5 3.5"></path>',
    zhihu: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',
    qq: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z"></path>',
    wechat: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z"></path><circle cx="9" cy="11" r="0.6"></circle><circle cx="15" cy="11" r="0.6"></circle>',
    juejin: '<path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path>',
    rss: '<path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle>',
    music: '<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>',
    camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>',
    code: '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3A5 5 0 0 0 13.5 3.4l-1.7 1.7"></path><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7"></path>'
  };

  /** 生成社交图标的 svg 字符串 */
  function iconSvg(name) {
    const path = ICONS[name] || ICONS.link;
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + path + '</svg>';
  }


  /* =========================================================================
   * 02 主题变量注入 与 SEO meta
   * ======================================================================= */
  function initTheme() {
    const root = document.documentElement;
    root.style.setProperty('--primary', get('theme.primaryColor', '#7dd3fc'));
    root.style.setProperty('--secondary', get('theme.secondaryColor', '#a78bfa'));
    root.style.setProperty('--text', get('theme.textColor', '#ffffff'));
    root.style.setProperty('--glass-alpha', String(get('theme.glassAlpha', 0.1)));
    root.style.setProperty('--glass-blur', get('theme.glassBlur', '16px'));
    root.style.setProperty('--radius', get('theme.radius', '16px'));
    root.style.setProperty('--font', get('theme.fontFamily', 'inherit'));
  }

  function initSEO() {
    document.title = get('site.title', '我的主页');
    document.documentElement.lang = get('site.language', 'zh-CN');

    const setMeta = function (name, value) {
      if (!value) return;
      let el = document.querySelector('meta[name="' + name + '"]');
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    setMeta('description', get('site.description', ''));
    setMeta('keywords', get('site.keywords', ''));
    setMeta('author', get('site.author', ''));

    const fav = get('site.favicon', '');
    if (fav) {
      const link = document.querySelector('link[rel="icon"]');
      if (link) link.href = fav;
    }
  }


  /* =========================================================================
   * 03 加载动画
   * ======================================================================= */
  function hideLoader() {
    const loader = $('loader');
    if (!loader) return;
    loader.classList.add('is-hidden');
    setTimeout(function () { loader.style.display = 'none'; }, 700);
  }

  /** 预加载背景图片（带超时保护，避免某张图卡死导致白屏） */
  function preloadImages(list) {
    return new Promise(function (resolve) {
      if (!list || !list.length) return resolve();
      let done = 0;
      let finished = false;
      const finish = function () {
        if (finished) return;
        finished = true;
        resolve();
      };
      list.forEach(function (src) {
        const img = new Image();
        img.onload = img.onerror = function () {
          done++;
          if (done >= list.length) finish();
        };
        img.src = src;
      });
      // 最多等待 8 秒
      setTimeout(finish, 8000);
    });
  }


  /* =========================================================================
   * 04 背景系统（固定 / 随机 / 顺序轮播 + 淡入淡出）
   * ======================================================================= */
  function initBackground() {
    const images = get('background.images', []);
    if (!images.length) return;

    const bgEl = $('bg');
    const imgA = $('bgA');
    const imgB = $('bgB');
    const mask = $('bgMask');
    const mode = get('background.mode', 'fixed');
    const fade = get('background.fadeDuration', 1400);

    // 模糊与亮度：作用在背景容器上，配合轻微放大隐藏模糊边缘
    bgEl.style.filter = 'blur(' + get('background.blur', '0px') + ') brightness(' + get('background.brightness', 1) + ')';
    bgEl.style.transform = 'scale(1.06)';
    mask.style.background = get('background.maskColor', 'rgba(8,12,24,0.35)');

    if (get('background.zoomAnimation', true)) bgEl.classList.add('has-zoom');

    imgA.style.transitionDuration = fade + 'ms';
    imgB.style.transitionDuration = fade + 'ms';

    let showingA = true;
    let curIdx = 0;

    /** 应用一张背景到隐藏层，然后交叉淡入 */
    function apply(url) {
      const next = showingA ? imgB : imgA;
      const cur = showingA ? imgA : imgB;
      next.style.backgroundImage = 'url("' + url + '")';
      // 强制重排，保证 transition 生效
      void next.offsetWidth;
      next.classList.add('is-active');
      cur.classList.remove('is-active');
      showingA = !showingA;
    }

    /** 按模式取出下一张图的下标 */
    function nextIndex() {
      if (mode === 'random') {
        if (images.length === 1) return 0;
        let i = curIdx;
        while (i === curIdx) i = Math.floor(Math.random() * images.length);
        return i;
      }
      if (mode === 'sequence') return (curIdx + 1) % images.length;
      return curIdx;   // fixed
    }

    function tick() {
      curIdx = nextIndex();
      apply(images[curIdx]);
    }

    // 首屏：fixed 用第一张；random 随机一张；sequence 用第一张
    if (mode === 'random') curIdx = Math.floor(Math.random() * images.length);
    imgA.style.backgroundImage = 'url("' + images[curIdx] + '")';

    // 轮播：多张图且非 fixed 模式时才启动定时器
    if (mode !== 'fixed' && images.length > 1) {
      setInterval(tick, Math.max(2000, get('background.interval', 12000)));
    }
  }


  /* =========================================================================
   * 05 个人资料（头像 / 大标题）与打字机
   * ======================================================================= */
  function initProfile() {
    const avatar = $('avatar');
    const wrap = avatar ? avatar.parentNode : null;

    if (avatar && get('profile.avatar', '')) avatar.src = get('profile.avatar', '');
    if (avatar) {
      avatar.style.width = get('profile.avatarSize', '118px');
      avatar.style.height = get('profile.avatarSize', '118px');
      avatar.classList.add(get('profile.avatarRound', true) ? 'is-round' : 'is-square');
    }
    if (wrap && get('profile.avatarGlow', true)) wrap.classList.add('has-glow');

    const t = $('bigTitle');
    if (t) t.textContent = get('profile.bigTitle', '');
  }

  /** 打字机：逐字打字 → 停留 → 逐字删除 → 下一句 */
  function initTypewriter() {
    const el = $('typewriter');
    const caret = $('caret');
    if (!el) return;

    const cfg = get('profile.typewriter', {});
    const subtitle = get('profile.subtitle', '');
    let texts = cfg.texts && cfg.texts.length ? cfg.texts.slice() : [subtitle];

    if (!cfg.enabled) {
      el.textContent = subtitle;
      if (caret) caret.style.display = 'none';
      return;
    }

    const speed = cfg.speed || 110;
    const delSpeed = cfg.deleteSpeed || 45;
    const pause = cfg.pause || 1600;
    const loop = cfg.loop !== false;

    let ti = 0;   // 当前句子下标
    let ci = 0;   // 当前字符下标
    let deleting = false;

    function step() {
      const text = texts[ti] || '';

      if (!deleting) {
        ci++;
        el.textContent = text.slice(0, ci);
        if (ci >= text.length) {
          // 打完一句：停留后开始删除（若只有一句且不循环则停止）
          if (!loop && ti >= texts.length - 1) return;
          deleting = true;
          setTimeout(step, pause);
          return;
        }
        setTimeout(step, speed);
      } else {
        ci--;
        el.textContent = text.slice(0, ci);
        if (ci <= 0) {
          deleting = false;
          ti = (ti + 1) % texts.length;
          setTimeout(step, 350);
          return;
        }
        setTimeout(step, delSpeed);
      }
    }
    setTimeout(step, 500);
  }


  /* =========================================================================
   * 06 时间问候语 与 时钟
   * ======================================================================= */
  function initGreeting() {
    const el = $('greeting');
    if (!el || !get('greeting.enabled', true)) return;

    const h = new Date().getHours();
    let word = '你好';
    if (h < 6) word = '夜深了';
    else if (h < 12) word = '早上好';
    else if (h < 14) word = '中午好';
    else if (h < 18) word = '下午好';
    else word = '晚上好';

    el.textContent = word + (get('greeting.suffix', '') || '');
  }

  function initClock() {
    const el = $('clock');
    if (!el || !get('clock.enabled', true)) return;

    const use24 = get('clock.format24', true);
    const showSec = get('clock.showSeconds', true);
    const showDate = get('clock.showDate', true);
    const WEEK = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

    function render() {
      const d = new Date();
      let h = d.getHours();
      let suffix = '';
      if (!use24) {
        suffix = h < 12 ? ' AM' : ' PM';
        h = h % 12;
        if (h === 0) h = 12;
      }
      let timeStr = pad(h) + ':' + pad(d.getMinutes());
      if (showSec) timeStr += ':' + pad(d.getSeconds());

      let out = timeStr + suffix;
      if (showDate) {
        out += ' · ' + d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + WEEK[d.getDay()];
      }
      el.textContent = out;
    }

    render();
    setInterval(render, 1000);
  }


  /* =========================================================================
   * 07 一言（https://v1.hitokoto.cn/）
   * ======================================================================= */
  function initHitokoto() {
    const el = $('hitokoto');
    if (!el) return;
    if (!get('hitokoto.enabled', true)) return;

    const api = get('hitokoto.api', 'https://v1.hitokoto.cn/');
    const type = get('hitokoto.type', '');
    const showFrom = get('hitokoto.showFrom', true);
    const url = api + (type ? (api.indexOf('?') > -1 ? '&' : '?') + 'c=' + encodeURIComponent(type) : '');

    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.hitokoto) return;
        el.textContent = data.hitokoto;
        if (showFrom && data.from) {
          const span = document.createElement('span');
          span.className = 'from';
          span.textContent = '—— ' + data.from;
          el.appendChild(span);
        }
      })
      .catch(function () {
        // 接口不可用（离线 / 被墙 / 跨域失败）时静默隐藏，不影响页面
        el.textContent = '';
      });
  }


  /* =========================================================================
   * 08 天气组件（未配置 API Key 时自动隐藏）
   * ======================================================================= */
  function initWeather() {
    const el = $('weather');
    if (!el) return;

    const enabled = get('weather.enabled', false);
    const key = get('weather.apiKey', '');
    if (!enabled || !key) return;   // 未配置 Key → 保持为空，CSS :empty 自动隐藏

    const provider = get('weather.provider', 'qweather');
    const city = get('weather.city', '');
    const unit = get('weather.unit', 'metric');

    let url;
    if (provider === 'openweather') {
      url = 'https://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(city) +
            '&appid=' + encodeURIComponent(key) + '&units=' + unit + '&lang=zh_cn';
    } else {
      url = 'https://devapi.qweather.com/v7/weather/now?location=' + encodeURIComponent(city) +
            '&key=' + encodeURIComponent(key);
    }

    function render() {
      fetch(url)
        .then(function (r) { return r.json(); })
        .then(function (d) {
          let text = '';
          if (provider === 'openweather') {
            if (d && d.main && d.weather && d.weather[0]) {
              text = d.weather[0].description + ' ' + Math.round(d.main.temp) + '°C';
            }
          } else {
            if (d && d.code === '200' && d.now) {
              text = d.now.text + ' ' + d.now.temp + '°C';
            }
          }
          el.textContent = text;
        })
        .catch(function () { el.textContent = ''; });
    }

    render();
    setInterval(render, 10 * 60 * 1000);   // 每 10 分钟刷新一次
  }


  /* =========================================================================
   * 09 搜索栏
   * ======================================================================= */
  function initSearch() {
    const form = $('searchForm');
    if (!form) return;
    if (!get('search.enabled', true)) { form.style.display = 'none'; return; }

    const engines = get('search.engines', []);
    if (!engines.length) { form.style.display = 'none'; return; }

    const wrap = $('engineWrap');
    const nameEl = $('engineName');
    const listEl = $('engineList');
    const input = $('searchInput');

    // 宽度处理：以父容器 100% 为基准，配置里的值作为 max-width。
    // 若直接写 style.width = "560px"，内联样式优先级高于媒体查询中的 width:100%，
    // 窄屏下会把搜索栏撑出屏幕并产生横向滚动条。
    form.style.width = '100%';
    form.style.maxWidth = get('search.width', '560px');
    input.placeholder = get('search.placeholder', '搜索…');

    // 默认引擎（找不到就退化为第一个）
    let currentKey = get('search.defaultEngine', engines[0].key);
    if (!engines.some(function (e) { return e.key === currentKey; })) currentKey = engines[0].key;

    function current() {
      for (let i = 0; i < engines.length; i++) if (engines[i].key === currentKey) return engines[i];
      return engines[0];
    }

    function renderList() {
      listEl.innerHTML = '';
      engines.forEach(function (e) {
        const li = document.createElement('li');
        li.textContent = e.name;
        if (e.key === currentKey) li.classList.add('is-active');
        li.addEventListener('click', function () {
          currentKey = e.key;
          nameEl.textContent = e.name;
          wrap.classList.remove('is-open');
          renderList();
          input.focus();
        });
        listEl.appendChild(li);
      });
      nameEl.textContent = current().name;
    }
    renderList();

    // 下拉开合
    $('engineCurrent').addEventListener('click', function (e) {
      e.stopPropagation();
      wrap.classList.toggle('is-open');
    });
    document.addEventListener('click', function () { wrap.classList.remove('is-open'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') wrap.classList.remove('is-open');
    });

    // 提交搜索
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const q = (input.value || '').trim();
      if (!q) { input.focus(); return; }
      const url = current().url.replace('{query}', encodeURIComponent(q));
      const newTab = get('search.newTab', true);
      if (newTab) window.open(url, '_blank', 'noopener');
      else window.location.href = url;
    });
  }


  /* =========================================================================
   * 10 展示栏（文字 + 图片组合，支持静态 / 横滑 / 轮播）
   * ======================================================================= */
  function initShowcase() {
    const cfg = get('showcase', {});
    if (!cfg.enabled) return;

    const items = (cfg.items || []).filter(function (it) { return it.show !== false && it; });
    if (!items.length) return;

    // 移动端独立布局参数
    const isM = window.FX && FX.isMobile && FX.isMobile();
    const m = cfg.mobile || {};
    const useMobile = isM && m.enabled;

    const width = useMobile ? (m.width || cfg.width) : cfg.width;
    const height = useMobile ? (m.height || cfg.height) : cfg.height;
    const display = useMobile ? (m.display || cfg.display) : cfg.display;

    /** 计算条目最终的图片位置与大小 */
    function posOf(it) {
      if (useMobile && m.imagePosition && m.imagePosition !== 'keep') return m.imagePosition;
      return it.imagePosition || 'left';
    }
    function sizeOf(it) {
      if (useMobile && m.imageSize) return m.imageSize;
      return it.imageSize || '160px';
    }

    // ---- 容器 ----
    const wrap = document.createElement('section');
    wrap.className = 'showcase';
    if (width) wrap.style.width = width;
    if (height && height !== 'auto') wrap.style.height = height;
    if (cfg.radius) wrap.style.borderRadius = cfg.radius;
    if (cfg.shadow) wrap.style.boxShadow = cfg.shadow === 'none' ? 'none' : cfg.shadow;
    wrap.style.background = withAlpha(cfg.background || '#ffffff', cfg.opacity == null ? 0.08 : cfg.opacity);

    // ---- 标题 ----
    if (cfg.title) {
      const head = document.createElement('div');
      head.className = 'sc-head';
      const h = document.createElement('div');
      h.className = 'sc-title';
      h.textContent = cfg.title;
      head.appendChild(h);
      wrap.appendChild(head);
    }

    // ---- 内容区 ----
    const body = document.createElement('div');
    body.className = 'sc-body';
    if (height && height !== 'auto') body.style.height = 'calc(100% - 40px)';

    const viewport = document.createElement('div');
    viewport.className = 'sc-' + (display || 'static');
    if (height && height !== 'auto') {
      viewport.style.height = '100%';
      if (display === 'static') viewport.style.overflowY = 'auto';
      else viewport.style.overflow = 'hidden';
    }

    // ---- 条目 ----
    items.forEach(function (it, i) {
      const pos = posOf(it);
      const size = sizeOf(it);

      const item = document.createElement('div');
      item.className = 'sc-item pos-' + pos;
      if (display === 'carousel' && i === 0) item.classList.add('is-active');

      // 图片（懒加载）
      if (it.image) {
        const img = document.createElement('img');
        img.className = 'sc-img lazy';
        img.alt = '';
        img.setAttribute('data-src', it.image);
        if (pos === 'top' || pos === 'bottom') {
          img.style.width = size;
          img.style.height = 'auto';
          img.style.maxHeight = '240px';
        } else {
          img.style.width = size;
          img.style.height = 'auto';
        }
        item.appendChild(img);
      }

      // 文字（\n 由 CSS 的 white-space: pre-line 渲染为换行）
      const text = document.createElement('div');
      text.className = 'sc-text';
      text.textContent = it.text || '';
      item.appendChild(text);

      viewport.appendChild(item);
    });

    body.appendChild(viewport);

    // ---- 左右箭头 ----
    const arrows = [];
    if (cfg.showArrows && display !== 'static' && items.length > 1) {
      ['prev', 'next'].forEach(function (dir) {
        const btn = document.createElement('button');
        btn.className = 'sc-arrow ' + dir;
        btn.type = 'button';
        btn.setAttribute('aria-label', dir === 'prev' ? '上一项' : '下一项');
        btn.innerHTML = dir === 'prev'
          ? '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>'
          : '<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>';
        body.appendChild(btn);
        arrows.push(btn);
      });
    }

    // ---- 指示圆点 ----
    let dots = [];
    if (cfg.showDots && display !== 'static' && items.length > 1) {
      const dotWrap = document.createElement('div');
      dotWrap.className = 'sc-dots';
      items.forEach(function (_, i) {
        const d = document.createElement('span');
        d.className = 'dot' + (i === 0 ? ' is-active' : '');
        dotWrap.appendChild(d);
        dots.push(d);
      });
      wrap.appendChild(dotWrap);
    }

    wrap.appendChild(body);

    // ---- 交互：轮播 / 横滑 ----
    const itemEls = viewport.querySelectorAll('.sc-item');
    let index = 0;
    let timer = null;

    function goto(i) {
      index = (i + items.length) % items.length;

      if (display === 'carousel') {
        for (let k = 0; k < itemEls.length; k++) itemEls[k].classList.remove('is-active');
        if (itemEls[index]) itemEls[index].classList.add('is-active');
      } else if (display === 'slider') {
        viewport.scrollTo({ left: index * viewport.clientWidth, behavior: 'smooth' });
      }
      dots.forEach(function (d, k) { d.classList.toggle('is-active', k === index); });
    }

    if (arrows.length === 2) {
      arrows[0].addEventListener('click', function () { goto(index - 1); restart(); });
      arrows[1].addEventListener('click', function () { goto(index + 1); restart(); });
    }
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { goto(i); restart(); });
    });

    function start() {
      if (display !== 'carousel') return;
      stop();
      timer = setInterval(function () { goto(index + 1); }, Math.max(1500, cfg.interval || 4000));
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { if (display === 'carousel') start(); }

    // 鼠标悬停时暂停轮播，方便阅读
    wrap.addEventListener('mouseenter', stop);
    wrap.addEventListener('mouseleave', start);
    start();

    // ---- 插入对应位置插槽 ----
    const pos = cfg.position || 'below';
    const slot = pos === 'above' ? $('slotAbove') : (pos === 'bottom' ? $('slotBottom') : $('slotBelow'));
    if (slot) slot.appendChild(wrap);
  }


  /* =========================================================================
   * 11 页脚、社交链接与访问计数
   * ======================================================================= */
  function initFooter() {
    const footer = $('footer');
    if (!footer) return;
    if (!get('footer.enabled', true)) { footer.style.display = 'none'; return; }

    const textEl = $('footerText');
    if (textEl) textEl.textContent = get('footer.text', '');

    const socialEl = $('social');
    const list = get('footer.social', []);
    if (socialEl && list.length) {
      list.forEach(function (s) {
        if (!s || !s.url) return;
        const a = document.createElement('a');
        a.href = s.url;
        a.title = s.name || '';
        a.setAttribute('aria-label', s.name || '');
        if (/^https?:/i.test(s.url)) { a.target = '_blank'; a.rel = 'noopener'; }
        a.innerHTML = iconSvg(s.icon);
        socialEl.appendChild(a);
      });
    }
  }

  /** 访问计数（localStorage，记录本机访问次数） */
  function initVisitCount() {
    const el = $('visitCount');
    if (!el) return;
    const cfg = get('extra.visitCount', {});
    if (!cfg.enabled) return;

    const key = cfg.storageKey || 'homepage_visit_count';
    let n = 1;
    try {
      n = (parseInt(localStorage.getItem(key), 10) || 0) + 1;
      localStorage.setItem(key, String(n));
    } catch (e) {
      n = 1;   // 隐私模式下 localStorage 不可用，退化为显示 1
    }
    el.textContent = (cfg.text || '你是第 {count} 次来到这里').replace('{count}', n);
  }


  /* =========================================================================
   * 12 BGM 播放器（播放列表 / 进度 / 音量 / 频谱 / 快捷键）
   * ======================================================================= */
  const Player = {
    audio: null, files: [], index: 0,
    els: {}, spectrum: null, analyser: null, audioCtx: null
  };

  function initPlayer() {
    const cfg = get('bgm', {});
    Player.files = cfg.files || [];
    Player.audio = $('audio');

    const playerEl = $('player');

    // 未开启或未配置文件 → 隐藏播放器
    if (!cfg.enabled || !Player.files.length || !Player.audio) {
      if (playerEl) playerEl.style.display = 'none';
      return;
    }
    if (!cfg.showPlayer && playerEl) playerEl.style.display = 'none';

    Player.els = {
      player: playerEl,
      play: $('btnPlay'), prev: $('btnPrev'), next: $('btnNext'),
      name: $('trackName'),
      progress: $('progress'), cur: $('timeCurrent'), dur: $('timeDuration'),
      volume: $('volume'), listBtn: $('btnList'), list: $('playlist'),
      spectrum: $('spectrum')
    };

    const audio = Player.audio;
    audio.volume = Math.max(0, Math.min(1, cfg.volume == null ? 0.5 : cfg.volume));
    if (Player.els.volume) {
      Player.els.volume.value = Math.round(audio.volume * 100);
      setFill(Player.els.volume, audio.volume * 100);
    }

    // 频谱：移动端 CSS 已隐藏，这里也跳过初始化以节省性能
    if (!cfg.showSpectrum || !Player.els.spectrum || (window.FX && FX.isMobile && FX.isMobile())) {
      if (Player.els.spectrum) Player.els.spectrum.classList.add('is-hidden');
    }

    buildPlaylist();
    load(0, false);

    // ---- 控制按钮 ----
    if (Player.els.play) Player.els.play.addEventListener('click', toggle);
    if (Player.els.prev) Player.els.prev.addEventListener('click', function () { jump(-1); });
    if (Player.els.next) Player.els.next.addEventListener('click', function () { jump(1); });

    // ---- 进度条 ----
    if (Player.els.progress) {
      Player.els.progress.addEventListener('input', function () {
        if (!audio.duration) return;
        const p = parseFloat(Player.els.progress.value) / 1000;
        audio.currentTime = p * audio.duration;
        setFill(Player.els.progress, p * 100);
      });
    }

    audio.addEventListener('timeupdate', function () {
      if (!audio.duration) return;
      const p = audio.currentTime / audio.duration;
      if (Player.els.progress && document.activeElement !== Player.els.progress) {
        Player.els.progress.value = Math.round(p * 1000);
        setFill(Player.els.progress, p * 100);
      }
      if (Player.els.cur) Player.els.cur.textContent = fmtTime(audio.currentTime);
      if (Player.els.dur) Player.els.dur.textContent = fmtTime(audio.duration);
    });

    audio.addEventListener('loadedmetadata', function () {
      if (Player.els.dur) Player.els.dur.textContent = fmtTime(audio.duration);
    });

    audio.addEventListener('play', function () {
      if (Player.els.player) Player.els.player.classList.add('is-playing');
      initSpectrum();
      if (Player.audioCtx && Player.audioCtx.state === 'suspended') Player.audioCtx.resume();
    });
    audio.addEventListener('pause', function () {
      if (Player.els.player) Player.els.player.classList.remove('is-playing');
    });
    audio.addEventListener('ended', function () {
      if (get('bgm.loopSingle', false)) { audio.currentTime = 0; audio.play().catch(function () {}); }
      else jump(1);
    });
    audio.addEventListener('error', function () {
      if (Player.els.name) Player.els.name.textContent = Player.files[Player.index].name + '（加载失败）';
    });

    // ---- 音量 ----
    if (Player.els.volume) {
      Player.els.volume.addEventListener('input', function () {
        const v = parseFloat(Player.els.volume.value) / 100;
        audio.volume = v;
        setFill(Player.els.volume, v * 100);
      });
    }

    // ---- 播放列表展开 ----
    if (Player.els.listBtn && Player.els.player) {
      Player.els.listBtn.addEventListener('click', function () {
        Player.els.player.classList.toggle('list-open');
      });
      if (get('bgm.playlistExpanded', false)) Player.els.player.classList.add('list-open');
    }

    // ---- 键盘快捷键 ----
    document.addEventListener('keydown', function (e) {
      const tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;

      if (e.code === 'Space') {
        e.preventDefault(); toggle();
      } else if (e.key === 'ArrowLeft') {
        jump(-1);
      } else if (e.key === 'ArrowRight') {
        jump(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault(); changeVolume(0.05);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault(); changeVolume(-0.05);
      }
    });

    // ---- 自动播放：浏览器禁止无交互自动播放，首次交互后再尝试 ----
    const tryAuto = function () {
      if (!get('bgm.autoplayAfterInteraction', true)) return;
      audio.play().catch(function () {});
      document.removeEventListener('pointerdown', tryAuto);
      document.removeEventListener('keydown', tryAuto);
      document.removeEventListener('touchstart', tryAuto);
    };
    document.addEventListener('pointerdown', tryAuto);
    document.addEventListener('keydown', tryAuto);
    document.addEventListener('touchstart', tryAuto);
    audio.play().catch(function () { /* 等待用户交互 */ });
  }

  /** 构建播放列表 */
  function buildPlaylist() {
    if (!Player.els.list) return;
    Player.els.list.innerHTML = '';
    Player.files.forEach(function (f, i) {
      const li = document.createElement('li');
      li.innerHTML = '<span class="idx">' + (i + 1) + '</span><span class="nm"></span>';
      li.querySelector('.nm').textContent = f.name || ('音轨 ' + (i + 1));
      li.addEventListener('click', function () { load(i, true); });
      Player.els.list.appendChild(li);
    });
    markPlaylist();
  }

  function markPlaylist() {
    if (!Player.els.list) return;
    const lis = Player.els.list.children;
    for (let i = 0; i < lis.length; i++) lis[i].classList.toggle('is-current', i === Player.index);
  }

  /** 载入指定音轨 */
  function load(i, autoplay) {
    if (!Player.files.length) return;
    Player.index = (i + Player.files.length) % Player.files.length;
    const f = Player.files[Player.index];
    Player.audio.src = f.src;
    if (Player.els.name) Player.els.name.textContent = f.name || ('音轨 ' + (Player.index + 1));
    if (Player.els.progress) { Player.els.progress.value = 0; setFill(Player.els.progress, 0); }
    if (Player.els.cur) Player.els.cur.textContent = '00:00';
    markPlaylist();
    if (autoplay) Player.audio.play().catch(function () {});
  }

  /** 上一首 / 下一首（受 bgm.mode 影响） */
  function jump(dir) {
    const mode = get('bgm.mode', 'sequence');
    const len = Player.files.length;
    if (!len) return;

    let next = Player.index;
    if (mode === 'fixed') {
      next = Player.index;                       // 固定模式：切歌无效（等于重播当前）
      load(next, true);
      return;
    } else if (mode === 'random') {
      if (len === 1) next = 0;
      else { do { next = Math.floor(Math.random() * len); } while (next === Player.index); }
    } else {
      next = (Player.index + dir + len) % len;
    }
    load(next, true);
  }

  function toggle() {
    if (!Player.audio) return;
    if (Player.audio.paused) Player.audio.play().catch(function () {});
    else Player.audio.pause();
  }

  function changeVolume(delta) {
    if (!Player.audio || !Player.els.volume) return;
    const v = Math.max(0, Math.min(1, Player.audio.volume + delta));
    Player.audio.volume = v;
    Player.els.volume.value = Math.round(v * 100);
    setFill(Player.els.volume, v * 100);
  }

  /** 频谱可视化（Web Audio，失败则自动隐藏） */
  function initSpectrum() {
    if (!get('bgm.showSpectrum', true)) return;
    if (Player.analyser || !Player.els.spectrum) return;
    if (Player.els.spectrum.classList.contains('is-hidden')) return;

    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) throw new Error('no AudioContext');
      const ac = new AC();
      const src = ac.createMediaElementSource(Player.audio);
      const an = ac.createAnalyser();
      an.fftSize = 128;
      an.smoothingTimeConstant = 0.8;
      src.connect(an);
      an.connect(ac.destination);

      Player.audioCtx = ac;
      Player.analyser = an;
      Player.spectrum = Player.els.spectrum;

      const ctx = Player.spectrum.getContext('2d');
      const data = new Uint8Array(an.frequencyBinCount);
      const color = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#7dd3fc';

      function draw() {
        requestAnimationFrame(draw);
        if (document.hidden) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Player.spectrum.clientWidth;
        const h = Player.spectrum.clientHeight;
        if (Player.spectrum.width !== Math.floor(w * dpr)) {
          Player.spectrum.width = Math.floor(w * dpr);
          Player.spectrum.height = Math.floor(h * dpr);
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        an.getByteFrequencyData(data);
        const bars = 40;
        const gap = 2;
        const bw = (w - gap * (bars - 1)) / bars;

        for (let i = 0; i < bars; i++) {
          const v = data[Math.floor(i * data.length / bars)] / 255;
          const bh = Math.max(2, v * h);
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.35 + v * 0.65;
          ctx.beginPath();
          const x = i * (bw + gap);
          const y = h - bh;
          const r = Math.min(bw / 2, 3);
          // 圆角柱形
          ctx.moveTo(x, h);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.lineTo(x + bw - r, y);
          ctx.quadraticCurveTo(x + bw, y, x + bw, y + r);
          ctx.lineTo(x + bw, h);
          ctx.closePath();
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      draw();
    } catch (e) {
      // Web Audio 不可用（如 file:// 协议下跨域限制）→ 静默隐藏频谱
      if (Player.els.spectrum) Player.els.spectrum.classList.add('is-hidden');
    }
  }


  /* =========================================================================
   * 13 动态标题 与 页面可见性变化
   * ======================================================================= */
  function initVisibility() {
    const dyn = get('extra.dynamicTitle', {});
    const origin = get('site.title', '我的主页');
    const back = dyn.backTitle || origin;
    let wasPlaying = false;

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        // 切到后台：改标题、暂停动画与音乐
        if (dyn.enabled) document.title = dyn.awayTitle || '快回来～';
        if (window.FX) FX.setPaused(true);
        if (Player.audio && !Player.audio.paused) { wasPlaying = true; Player.audio.pause(); }
      } else {
        if (dyn.enabled) document.title = back;
        if (window.FX) FX.setPaused(false);
        if (Player.audio && wasPlaying) { wasPlaying = false; Player.audio.play().catch(function () {}); }
      }
    });
  }


  /* =========================================================================
   * 14 自定义右键菜单
   * ======================================================================= */
  function initContextMenu() {
    const cfg = get('extra.contextMenu', {});
    const menu = $('ctxMenu');
    if (!menu) return;
    if (!cfg.enabled || !cfg.items || !cfg.items.length) return;

    // 渲染菜单项
    cfg.items.forEach(function (it) {
      const li = document.createElement('li');
      li.textContent = it.label;
      li.addEventListener('click', function () {
        hide();
        runAction(it);
      });
      menu.appendChild(li);
    });

    function show(x, y) {
      menu.classList.add('is-open');
      // 防止菜单超出视口
      const w = menu.offsetWidth;
      const h = menu.offsetHeight;
      const left = Math.min(x, window.innerWidth - w - 8);
      const top = Math.min(y, window.innerHeight - h - 8);
      menu.style.left = Math.max(8, left) + 'px';
      menu.style.top = Math.max(8, top) + 'px';
    }
    function hide() { menu.classList.remove('is-open'); }

    function runAction(it) {
      switch (it.action) {
        case 'reload': location.reload(); break;
        case 'top': window.scrollTo({ top: 0, behavior: 'smooth' }); break;
        case 'back': history.back(); break;
        case 'copyUrl':
          try {
            if (navigator.clipboard) navigator.clipboard.writeText(location.href);
            else {
              const ta = document.createElement('textarea');
              ta.value = location.href;
              document.body.appendChild(ta);
              ta.select();
              document.execCommand('copy');
              document.body.removeChild(ta);
            }
          } catch (e) { /* 忽略复制失败 */ }
          break;
        case 'link':
          if (it.url) window.open(it.url, '_blank', 'noopener');
          break;
      }
    }

    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      show(e.clientX, e.clientY);
    });
    document.addEventListener('click', hide);
    document.addEventListener('scroll', hide, true);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
  }


  /* =========================================================================
   * 15 图片懒加载
   * ======================================================================= */
  function initLazyLoad() {
    const imgs = document.querySelectorAll('img.lazy[data-src]');
    if (!imgs.length) return;

    function loadImg(img) {
      if (img.dataset.loaded) return;
      img.dataset.loaded = '1';
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    }

    if (!('IntersectionObserver' in window) || !get('extra.lazyLoad', true)) {
      imgs.forEach(loadImg);
      return;
    }

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { loadImg(en.target); io.unobserve(en.target); }
      });
    }, { rootMargin: '200px' });

    imgs.forEach(function (img) { io.observe(img); });
  }


  /* =========================================================================
   * 16 特效启动（环境粒子 / 鼠标跟随 / 点击特效）
   * ======================================================================= */
  function initEffects() {
    if (!window.FX) return;

    // 环境粒子
    FX.initParticles($('fxParticles'), get('particles', {}));

    // 鼠标跟随特效（移动端内部会自动跳过）
    FX.initCursor($('fxCursor'), get('cursor', {}));

    // 点击特效：颜色未配置时使用主题色
    const clickCfg = get('extra.clickEffect', {});
    const cfg = {
      enabled: clickCfg.enabled !== false,
      type: clickCfg.type || 'ripple',
      color: clickCfg.color || get('theme.primaryColor', '#7dd3fc'),
      particleCount: clickCfg.particleCount || 14
    };
    FX.initClick($('fxClick'), cfg);

    // 隐藏系统光标
    if (get('cursor.hideCursor', false) && !FX.isMobile()) {
      document.body.classList.add('hide-cursor');
    }
  }


  /* =========================================================================
   * 总入口
   * ======================================================================= */
  function boot() {
    initTheme();
    initSEO();

    const bgImages = get('background.images', []);
    const needPreload = get('background.preload', true);
    const minDur = get('extra.loading.minDuration', 800);
    const startedAt = Date.now();

    // 先渲染内容，再等背景预加载完成，最后关闭加载动画
    initProfile();
    initTypewriter();
    initGreeting();
    initClock();
    initHitokoto();
    initWeather();
    initSearch();
    initShowcase();
    initFooter();
    initVisitCount();
    initPlayer();
    initEffects();
    initContextMenu();
    initLazyLoad();
    initVisibility();
    initBackground();

    const done = function () {
      const wait = Math.max(0, minDur - (Date.now() - startedAt));
      setTimeout(hideLoader, wait);
    };

    if (needPreload && bgImages.length) preloadImages(bgImages).then(done);
    else if (get('extra.loading.enabled', true)) done();
    else hideLoader();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
