/* =============================================================================
 * js/effects.js —— Canvas 视觉特效模块
 * -----------------------------------------------------------------------------
 * 包含三个相互独立的特效系统，全部由 requestAnimationFrame 驱动：
 *   1. FX.initParticles()  环境粒子（雪花 / 樱花 / 星空 / 气泡）
 *   2. FX.initCursor()     鼠标跟随特效（光点 / 光晕 / 拖尾 / 星光 / 环绕）
 *   3. FX.initClick()      点击特效（波纹 / 粒子迸发）——PC 与移动端都可用
 *
 * 设计原则：
 *   · 性能优先：限制粒子数量、限制历史轨迹长度、devicePixelRatio 上限为 2。
 *   · 页面切到后台时可通过 FX.setPaused(true) 完全停止 rAF，避免空耗 CPU。
 *   · 移动端不启用鼠标跟随特效，改用点击特效代替。
 * 本模块不读取 CONFIG，全部参数由 main.js 传入，方便复用。
 * ========================================================================== */

window.FX = (function () {
  'use strict';

  const FX = {};
  const loops = [];   // 统一管理所有动画循环，便于整体暂停/恢复

  /* ============================ 通用工具 ============================ */

  /** 是否为移动端（用于区分特效强度与是否启用鼠标特效） */
  function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches ||
           (window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 1024);
  }

  /** 创建并维护一个可暂停的 rAF 循环 */
  function makeLoop(draw) {
    let id = null;
    let running = false;

    function frame(now) {
      if (!running) return;
      draw(now);
      id = requestAnimationFrame(frame);
    }

    const loop = {
      start() {
        if (running) return;
        running = true;
        id = requestAnimationFrame(frame);
      },
      stop() {
        running = false;
        if (id) cancelAnimationFrame(id);
        id = null;
      }
    };
    loops.push(loop);
    return loop;
  }

  /**
   * 初始化画布：处理高清屏缩放与窗口尺寸变化
   * @returns {{ctx: CanvasRenderingContext2D, w: number, h: number}}
   */
  function setupCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    const state = { ctx: ctx, w: 0, h: 0 };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.w = window.innerWidth;
      state.h = window.innerHeight;
      canvas.width = Math.floor(state.w * dpr);
      canvas.height = Math.floor(state.h * dpr);
      canvas.style.width = state.w + 'px';
      canvas.style.height = state.h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);
    return state;
  }

  /** 颜色解析：支持 #rgb / #rrggbb / rgb(...) */
  function toRgb(color) {
    if (typeof color !== 'string') return [125, 211, 252];
    let m;
    if ((m = color.match(/^#([0-9a-f]{3})$/i))) {
      const h = m[1];
      return [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)];
    }
    if ((m = color.match(/^#([0-9a-f]{6})$/i))) {
      const h = m[1];
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
    if ((m = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i))) {
      return [+m[1], +m[2], +m[3]];
    }
    return [125, 211, 252];
  }

  /**
   * 生成取色函数：单色直接返回；多色则在节点之间做渐变插值
   * @param {string[]} colors
   * @returns {(t:number)=>string} 传入 0~1 的位置，返回颜色字符串
   */
  function makeColorFn(colors) {
    const list = (colors || []).filter(function (c) { return !!c; });
    if (!list.length) return function () { return '#7dd3fc'; };
    if (list.length === 1) return function () { return list[0]; };

    const rgbs = list.map(toRgb);
    const seg = rgbs.length - 1;

    return function (t) {
      const x = Math.max(0, Math.min(1, t)) * seg;
      const i = Math.min(seg - 1, Math.floor(x));
      const f = x - i;
      const a = rgbs[i];
      const b = rgbs[i + 1];
      return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * f) + ',' +
                      Math.round(a[1] + (b[1] - a[1]) * f) + ',' +
                      Math.round(a[2] + (b[2] - a[2]) * f) + ')';
    };
  }

  const rand = function (min, max) { return min + Math.random() * (max - min); };


  /* =========================================================================
   * 一、环境粒子：snow / sakura / star / bubble
   * ======================================================================= */
  FX.initParticles = function (canvas, cfg) {
    if (!canvas || !cfg) return;
    const type = cfg.enabled;
    if (!type || type === 'none') { canvas.style.display = 'none'; return; }

    const s = setupCanvas(canvas);
    const ctx = s.ctx;

    // 移动端自动降低粒子数量，保证流畅
    const count = isMobile() ? (cfg.mobileCount || 20) : (cfg.count || 60);
    const baseSize = cfg.size || 3;
    const speed = cfg.speed || 1;
    const alpha = cfg.opacity == null ? 0.75 : cfg.opacity;
    const color = cfg.color || '#ffffff';

    /** 生成一个粒子（按类型带上各自需要的随机属性） */
    function spawn(initial) {
      const p = {
        x: rand(0, s.w),
        y: initial ? rand(0, s.h) : (type === 'bubble' ? s.h + rand(10, 120) : -rand(10, 120)),
        r: rand(baseSize * 0.5, baseSize * 1.5),
        vy: 0, vx: 0,
        sway: rand(0.4, 1.6),
        phase: rand(0, Math.PI * 2),
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.02, 0.02),
        life: rand(0, Math.PI * 2)
      };

      if (type === 'snow') {
        p.vy = rand(0.35, 1.1) * speed;
        p.vx = rand(-0.25, 0.25);
      } else if (type === 'sakura') {
        p.vy = rand(0.5, 1.3) * speed;
        p.vx = rand(-0.35, 0.35);
        p.r = rand(baseSize * 1.2, baseSize * 2.4);
        p.vr = rand(-0.03, 0.03);
      } else if (type === 'star') {
        p.vy = rand(-0.06, 0.06) * speed;
        p.vx = rand(-0.05, 0.05) * speed;
        p.r = rand(baseSize * 0.3, baseSize * 0.9);
      } else if (type === 'bubble') {
        p.vy = -rand(0.3, 1.0) * speed;
        p.vx = rand(-0.2, 0.2);
        p.r = rand(baseSize * 1.0, baseSize * 2.6);
      }
      return p;
    }

    let particles = [];
    function refill() {
      particles = [];
      for (let i = 0; i < count; i++) particles.push(spawn(true));
    }
    refill();

    // 窗口尺寸变化后重新铺满
    window.addEventListener('resize', function () {
      clearTimeout(refill._t);
      refill._t = setTimeout(refill, 220);
    });

    /** 绘制单个粒子 */
    function drawOne(p, t) {
      if (type === 'snow') {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

      } else if (type === 'sakura') {
        // 花瓣：椭圆 + 旋转
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

      } else if (type === 'star') {
        // 星点：闪烁（透明度随时间正弦变化）
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.002 + p.phase));
        ctx.globalAlpha = alpha * tw;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

      } else if (type === 'bubble') {
        // 气泡：半透明圆 + 高光描边
        ctx.globalAlpha = alpha * 0.5;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = alpha * 0.8;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    makeLoop(function (t) {
      ctx.clearRect(0, 0, s.w, s.h);
      ctx.globalCompositeOperation = 'source-over';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 自身运动：横向摇摆（正弦），纵向按各自速度
        p.x += p.vx + Math.sin(t * 0.001 * p.sway + p.phase) * 0.35;
        p.y += p.vy;
        p.rot += p.vr;

        // 出界回收
        if (type === 'bubble') {
          if (p.y + p.r < -20) particles[i] = spawn(false);
        } else if (type === 'star') {
          if (p.y < -10) p.y = s.h + 10;
          if (p.y > s.h + 10) p.y = -10;
          if (p.x < -10) p.x = s.w + 10;
          if (p.x > s.w + 10) p.x = -10;
        } else {
          if (p.y - p.r > s.h + 20 || p.x < -60 || p.x > s.w + 60) particles[i] = spawn(false);
        }

        drawOne(p, t);
      }
      ctx.globalAlpha = 1;
    }).start();
  };


  /* =========================================================================
   * 二、鼠标跟随特效：dot / glow / trail / star / orbit
   * -------------------------------------------------------------------------
   * 关键点：
   *   · 鼠标静止时，特效靠 sin/cos 与自转持续呼吸、浮动、旋转、律动；
   *   · 鼠标移动时，节点位置通过缓动系数平滑逼近鼠标；
   *   · 支持 count 个节点，后一个节点比前一个更滞后，形成拖尾/群组。
   * ======================================================================= */
  FX.initCursor = function (canvas, cfg) {
    if (!canvas || !cfg) return;

    // 移动端不启用鼠标跟随特效（改用点击特效代替）
    if (isMobile() || cfg.type === 'none') {
      canvas.style.display = 'none';
      return;
    }

    const s = setupCanvas(canvas);
    const ctx = s.ctx;

    const type = cfg.type || 'dot';
    const size = cfg.size || 12;
    const n = Math.max(1, cfg.count || 1);
    const easing = cfg.easing || 0.14;
    const stagger = cfg.stagger == null ? 0.12 : cfg.stagger;
    const idleAmp = cfg.idleAmplitude == null ? 8 : cfg.idleAmplitude;
    const idleSpeed = cfg.idleSpeed || 1.2;
    const orbitR = cfg.orbitRadius || 38;
    const orbitSpeed = cfg.orbitSpeed || 0.028;
    const blend = cfg.blend || 'lighter';
    const colorAt = makeColorFn(cfg.colors);

    // 鼠标位置与平滑后的中心点
    const mouse = { x: s.w / 2, y: s.h / 2 };
    const center = { x: mouse.x, y: mouse.y };
    let lastX = mouse.x, lastY = mouse.y;

    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    // 节点：每个点有独立的相位，保证各自的"呼吸"不同步
    const nodes = [];
    for (let i = 0; i < n; i++) {
      nodes.push({
        x: mouse.x, y: mouse.y,
        phase: (i / n) * Math.PI * 2,
        spin: Math.random() * Math.PI,
        history: []
      });
    }

    // trail 类型使用的自由粒子池
    const bits = [];

    /** 星光：绘制一个四角星 */
    function drawStar(x, y, r, rot, color, a) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = a;
      ctx.fillStyle = color;
      ctx.beginPath();
      const spikes = 4;
      for (let i = 0; i < spikes * 2; i++) {
        const rad = i % 2 === 0 ? r : r * 0.36;
        const ang = (Math.PI / spikes) * i;
        const px = Math.cos(ang) * rad;
        const py = Math.sin(ang) * rad;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    makeLoop(function (t) {
      ctx.clearRect(0, 0, s.w, s.h);
      ctx.globalCompositeOperation = blend;

      const sec = t / 1000;
      const moving = Math.abs(mouse.x - lastX) + Math.abs(mouse.y - lastY) > 0.6;
      lastX = mouse.x; lastY = mouse.y;

      // 中心点平滑跟随鼠标（整体跟随的"锚"）
      center.x += (mouse.x - center.x) * easing;
      center.y += (mouse.y - center.y) * easing;

      for (let i = 0; i < n; i++) {
        const node = nodes[i];
        const k = Math.max(0.02, easing * (1 - i * stagger)); // 越靠后的点越滞后
        let tx, ty;

        if (type === 'orbit') {
          // 环绕：多个小点绕中心公转；半径带呼吸，静止时也在动
          const ang = sec * orbitSpeed * Math.PI * 2 + node.phase;
          const breathe = 1 + Math.sin(sec * idleSpeed + node.phase) * 0.22;
          const r = orbitR * breathe;
          tx = center.x + Math.cos(ang) * r;
          ty = center.y + Math.sin(ang) * r;
          node.x += (tx - node.x) * 0.35;
          node.y += (ty - node.y) * 0.35;
        } else {
          // 其余类型：节点缓动跟随鼠标，并叠加静止时的浮动偏移
          const ox = Math.sin(sec * idleSpeed + node.phase) * idleAmp;
          const oy = Math.cos(sec * idleSpeed * 1.3 + node.phase) * idleAmp * 0.7;
          node.x += (mouse.x + ox - node.x) * k;
          node.y += (mouse.y + oy - node.y) * k;
          tx = node.x; ty = node.y;
        }

        const color = colorAt(n > 1 ? i / (n - 1) : 0);
        const fade = 1 - i / (n + 1);           // 拖尾越远越淡
        const breathe = 0.75 + 0.25 * Math.sin(sec * idleSpeed * 1.6 + node.phase); // 呼吸缩放

        if (type === 'dot') {
          const r = size * breathe * fade * 0.5;
          ctx.globalAlpha = 0.9 * fade;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
          ctx.fill();
          // 外圈柔光
          ctx.globalAlpha = 0.18 * fade;
          ctx.beginPath();
          ctx.arc(node.x, node.y, r * 2.4, 0, Math.PI * 2);
          ctx.fill();

        } else if (type === 'glow') {
          // 光晕：明暗变化 + 柔和光尾（保留历史位置）
          node.history.push({ x: node.x, y: node.y });
          if (node.history.length > 12) node.history.shift();

          for (let h = 0; h < node.history.length; h++) {
            const p = node.history[h];
            const hr = (h / node.history.length);
            ctx.globalAlpha = 0.05 * hr * fade;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size * hr * 1.1, 0, Math.PI * 2);
            ctx.fill();
          }
          const r = size * (1 + 0.35 * Math.sin(sec * idleSpeed * 2 + node.phase));
          const g = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 1.8);
          g.addColorStop(0, color);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.globalAlpha = (0.55 + 0.35 * Math.sin(sec * idleSpeed * 2.2 + node.phase)) * fade;
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(node.x, node.y, r * 1.8, 0, Math.PI * 2);
          ctx.fill();

        } else if (type === 'trail') {
          // 拖尾：移动时喷发粒子；静止时已有粒子继续漂浮
          if (moving && i === 0) {
            bits.push({
              x: node.x, y: node.y,
              vx: rand(-0.5, 0.5), vy: rand(-0.5, 0.5),
              r: rand(size * 0.18, size * 0.42),
              life: 1, decay: rand(0.008, 0.022),
              color: color
            });
          }
          ctx.globalAlpha = 0.85 * fade;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, size * 0.3 * breathe, 0, Math.PI * 2);
          ctx.fill();

        } else if (type === 'star') {
          // 星光：闪烁 + 自转
          const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(sec * 3 + node.phase));
          node.spin += 0.02 + i * 0.004;
          drawStar(node.x, node.y, size * breathe * fade * 0.9, node.spin, color, tw * fade);

        } else if (type === 'orbit') {
          ctx.globalAlpha = 0.9;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, size * 0.34 * breathe, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 0.16;
          ctx.beginPath();
          ctx.arc(node.x, node.y, size * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }

        // orbit 类型额外画一条淡淡的中心光点，指明鼠标位置
        if (type === 'orbit' && i === n - 1) {
          ctx.globalAlpha = 0.5;
          ctx.fillStyle = colorAt(0.5);
          ctx.beginPath();
          ctx.arc(center.x, center.y, size * 0.18, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 统一更新并绘制 trail 粒子
      if (type === 'trail') {
        for (let i = bits.length - 1; i >= 0; i--) {
          const b = bits[i];
          b.x += b.vx;
          b.y += b.vy;
          b.vx *= 0.98;
          b.vy *= 0.98;
          b.life -= b.decay;
          if (b.life <= 0) { bits.splice(i, 1); continue; }
          ctx.globalAlpha = b.life * 0.8;
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r * b.life, 0, Math.PI * 2);
          ctx.fill();
        }
        // 安全阀：避免极端情况下粒子过多
        if (bits.length > 260) bits.splice(0, bits.length - 260);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }).start();
  };


  /* =========================================================================
   * 三、点击特效：ripple（波纹）/ particle（粒子迸发）
   * 使用 pointerdown 监听，因此在移动端触摸同样有效
   * ======================================================================= */
  FX.initClick = function (canvas, cfg) {
    if (!canvas || !cfg || !cfg.enabled) { if (canvas) canvas.style.display = 'none'; return; }

    const s = setupCanvas(canvas);
    const ctx = s.ctx;
    const type = cfg.type || 'ripple';
    const color = cfg.color || '#7dd3fc';
    const pCount = cfg.particleCount || 14;
    const items = [];

    window.addEventListener('pointerdown', function (e) {
      if (type === 'ripple') {
        items.push({ kind: 'ripple', x: e.clientX, y: e.clientY, r: 0, max: 70, life: 1 });
        items.push({ kind: 'ripple', x: e.clientX, y: e.clientY, r: 0, max: 46, life: 1, delay: 6 });
      } else {
        for (let i = 0; i < pCount; i++) {
          const ang = (Math.PI * 2 * i) / pCount + rand(-0.2, 0.2);
          const sp = rand(1.6, 4.6);
          items.push({
            kind: 'p',
            x: e.clientX, y: e.clientY,
            vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
            r: rand(1.6, 3.6), life: 1, decay: rand(0.014, 0.03)
          });
        }
      }
    });

    makeLoop(function () {
      ctx.clearRect(0, 0, s.w, s.h);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];

        if (it.kind === 'ripple') {
          if (it.delay > 0) { it.delay--; continue; }
          it.r += (it.max - it.r) * 0.12 + 0.6;
          it.life -= 0.026;
          if (it.life <= 0) { items.splice(i, 1); continue; }
          ctx.globalAlpha = Math.max(0, it.life) * 0.75;
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(it.x, it.y, it.r, 0, Math.PI * 2);
          ctx.stroke();

        } else {
          it.x += it.vx;
          it.y += it.vy;
          it.vy += 0.06;          // 轻微重力
          it.vx *= 0.985;
          it.vy *= 0.985;
          it.life -= it.decay;
          if (it.life <= 0) { items.splice(i, 1); continue; }
          ctx.globalAlpha = Math.max(0, it.life);
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(it.x, it.y, it.r * it.life, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }).start();
  };


  /* ============================ 全局暂停 / 恢复 ============================ */
  /** 页面切到后台时停止所有动画，回到前台时恢复 */
  FX.setPaused = function (paused) {
    for (let i = 0; i < loops.length; i++) {
      if (paused) loops[i].stop(); else loops[i].start();
    }
  };

  FX.isMobile = isMobile;

  return FX;
})();
