const bgA = document.getElementById('bgA'), bgB = document.getElementById('bgB');
const titleEl = document.getElementById('mainTitle'), subEl = document.getElementById('subTitle');
const clockEl = document.getElementById('clock'), dateEl = document.getElementById('date');
const canvas = document.getElementById('particleCanvas'), ctx = canvas.getContext('2d');
const bgm = document.getElementById('bgm'), musicBtn = document.getElementById('musicControl'), musicIcon = document.getElementById('musicIcon');
const mouseGlow = document.getElementById('mouseGlow');

let cfg = { title: "青昱", subtitle: "Ciallo~", changeInterval: 20, particleCount: 80, musicVolume: 0.4 };
let particles = [], usingA = true, activeTextCount = 0;
let validImages = [], validMusic = [];

async function init() {
    // 1. 尝试加载配置，失败则使用内置默认值
    try {
        const res = await fetch('./config.json');
        if (res.ok) cfg = Object.assign(cfg, await res.json());
    } catch (e) { console.warn("Config fail, using defaults."); }

    titleEl.innerText = cfg.title;
    subEl.innerText = cfg.subtitle;

    // 2. 自动化探测资源 (数字 1-20 循环)
    validImages = await autoDetect('./images/', '.jpg', 20);
    validMusic = await autoDetect('./music/', '.mp3', 20);

    // 3. 启动所有系统
    setupBackgrounds();
    setupMusic();
    setupClock();
    setupParticles();
    setupTexts();
    setupInteractions();
}

async function autoDetect(path, ext, max) {
    let list = [];
    for (let i = 1; i <= max; i++) {
        const url = `${path}${i}${ext}`;
        try {
            const exists = await new Promise(resolve => {
                if (ext === '.jpg') {
                    const img = new Image();
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(false);
                    img.src = url;
                } else {
                    const audio = new Audio();
                    audio.onloadedmetadata = () => resolve(true);
                    audio.onerror = () => resolve(false);
                    audio.src = url;
                }
            });
            if (exists) list.push(url); else break;
        } catch (e) { break; }
    }
    return list;
}

function setupBackgrounds() {
    if (validImages.length === 0) {
        // 如果没图，显示一个保底色，防止黑屏
        document.body.style.background = "#1a1a2e";
        return;
    }
    const change = (idx) => {
        const next = usingA ? bgB : bgA, curr = usingA ? bgA : bgB;
        next.src = validImages[idx % validImages.length];
        next.onload = () => {
            next.classList.add('active');
            curr.classList.remove('active');
            usingA = !usingA;
        };
    };
    change(0);
    let count = 1;
    setInterval(() => change(count++), cfg.changeInterval * 1000);
}

function setupMusic() {
    if (validMusic.length === 0) return;
    musicBtn.style.display = 'flex';
    bgm.volume = cfg.musicVolume;

    const playNext = () => {
        const track = validMusic[Math.floor(Math.random() * validMusic.length)];
        bgm.src = track;
        bgm.play().then(() => musicIcon.innerText = "🔊").catch(() => {
            musicIcon.innerText = "🔇";
        });
    };

    bgm.onended = playNext;
    musicBtn.addEventListener('click', () => {
        if (bgm.paused) {
            if (!bgm.src) playNext(); else bgm.play();
            musicIcon.innerText = "🔊";
        } else {
            bgm.pause();
            musicIcon.innerText = "🔇";
        }
    });
}

function setupClock() {
    const up = () => {
        const n = new Date();
        clockEl.innerText = n.toLocaleTimeString('zh-CN', { hour12: false });
        dateEl.innerText = n.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });
    };
    up(); setInterval(up, 1000);
}

function setupParticles() {
    const res = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', res); res();
    for (let i = 0; i < cfg.particleCount; i++) {
        particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, size: Math.random() * 2, opacity: Math.random() * 0.5 });
    }
    const anim = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        });
        requestAnimationFrame(anim);
    };
    anim();
}

async function setupTexts() {
    let lines = ["Ciallo~", "你好世界", "这里是青昱"];
    try {
        const r = await fetch('./texts.txt');
        if (r.ok) lines = (await r.text()).split('\n').filter(t => t.trim());
    } catch (e) {}

    setInterval(() => {
            up(); setInterval(up, 1000);
}

function setupParticles() {
    const res = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', res); res();
    for (let i = 0; i < (cfg.particleCount || 80); i++) {
        particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, size: Math.random() * 2, opacity: Math.random() * 0.5 });
    }
    const anim = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        });
        requestAnimationFrame(anim);
    };
    anim();
}

async function setupTexts() {
    let lines = [];
    try {
        const r = await fetch('./texts.txt?v=' + Date.now());
        lines = (await r.text()).split('\n').map(v => v.trim()).filter(Boolean);
    } catch { lines = ['Ciallo']; }

    setInterval(() => {
        if (activeTextCount >= 20) return;
        const div = document.createElement('div');
        div.innerText = lines[Math.floor(Math.random() * lines.length)];
        const dur = Math.random() * 15 + 10;
        div.style.cssText = `position    try {
        const res = await fetch('./texts.txt?v=' + Date.now());
        const t = await res.text();
        lines = t.split('\n').map(v => v.trim()).filter(Boolean);
    } catch { lines = ['Ciallo～']; }

    setInterval(() => {
        if (activeTextCount >= (cfg.textAmount || 20)) return;
        const div = document.createElement('div');
        div.className = 'floatingText';
        div.innerText = lines[Math.floor(Math.random() * lines.length)];
        const dur = Math.random() * (cfg.textSpeedMax - cfg.textSpeedMin) + (cfg.textSpeedMin || 10);
        div.style.cssText = `
            position:absolute; top:-50px; left:${Math.random()*90}%;
            font-size:${Math.random()*16 + 14}px; color:hsla(${Math.random()*360},80%,70%,0.6);
            animation:textFall ${dur}s linear forwards; pointer-events:none; z-index:3;
        `;
        document.getElementById('textRain').appendChild(div);
        activeTextCount++;
        setTimeout(() => { div.remove(); activeTextCount--; }, dur * 1000);
    }, cfg.textSpawnRate || 1000);
}

function setupParticles() {
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        const count = window.innerWidth < 768 ? cfg.particleCount / 2 : cfg.particleCount;
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2, opacity: Math.random() * 0.5
            });
        }
    };
    window.addEventListener('resize', resize);
    resize();

    const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y =
    setInterval(() => {
        if (activeTextCount >= (cfg.textAmount || 20)) return;
        const div = document.createElement('div');
        div.innerText = lines[Math.floor(Math.random() * lines.length)];
        const dur = Math.random() * (cfg.textSpeedMax - cfg.textSpeedMin) + (cfg.textSpeedMin || 10);
        const hue = Math.random() * 360;
        div.style.cssText = `
            position:absolute; top:-60px; left:${Math.random()*85}%;
            font-size:${Math.random()*15 + 14}px; color:hsl(${hue},80%,70%);
            text-shadow:0 0 8px hsl(${hue},80%,70%);
            animation:textFall ${dur}s linear forwards;
        `;
        textRain.appendChild(div);
        activeTextCount++;
        setTimeout(() => { div.remove(); activeTextCount--; }, dur * 1000);
    }, cfg.textSpawnRate || 1000);
}

function setupParticles() {
    const resize = () => { 
        canvas.width = window.innerWidth; 
        canvas.height = window.innerHeight; 
        // 手机端粒子减半以保持流畅
        const count = window.innerWidth < 768 ? (cfg.particleCount / 2) : cfg.particleCount;
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
                size: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.4 + 0.2
            });
        }
    };
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  
  for(let i=0;i<cfg.particleCount;i++){
    particles.push({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      vx:(Math.random()-0.5)*2,
      vy:(Math.random()-0.5)*2,
      size:Math.random()*2+1,
      opacity:Math.random()*0.5+0.3
    });
  }
  
  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.x+=p.vx;
      p.y+=p.vy;
      if(p.x<0)p.x=canvas.width;
      if(p.x>canvas.width)p.x=0;
      if(p.y<0)p.y=canvas.height;
      if(p.y>canvas.height)p.y=0;
      ctx.fillStyle=`rgba(255,255,255,${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
  
  window.addEventListener('resize',()=>{
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
  });
}

function setupClock(){
  function update(){
    const now=new Date();
    clockEl.innerText=now.toLocaleTimeString('zh-CN');
    dateEl.innerText=now.toLocaleDateString('zh-CN');
  }
  update();
  setInterval(update,1000);
}

function setupMusic(){
  if(!cfg.enableMusic)return;
  bgm.src=cfg.music;
  bgm.volume=cfg.musicVolume;
  bgm.play().catch(()=>{});
}

document.addEventListener('mousemove',(e)=>{
  mouseGlow.style.left=e.clientX+'px';
  mouseGlow.style.top=e.clientY+'px';
});

load();
