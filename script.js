const bgA = document.getElementById('bgA');
const bgB = document.getElementById('bgB');
const titleEl = document.getElementById('mainTitle');
const subEl = document.getElementById('subTitle');
const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('date');
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const bgm = document.getElementById('bgm');
const musicBtn = document.getElementById('musicControl');
const musicIcon = document.getElementById('musicIcon');
const mouseGlow = document.getElementById('mouseGlow');

let cfg, particles = [], usingA = true, activeTextCount = 0;

async function init() {
    try {
        const res = await fetch('./config.json?v=' + Date.now());
        cfg = await res.json();

        // 基础信息应用
        document.title = cfg.siteName;
        titleEl.innerText = cfg.title;
        subEl.innerText = cfg.subtitle;
        document.getElementById('favicon').href = cfg.favicon;
        document.documentElement.style.setProperty('--bg-transition-time', (cfg.transitionSpeed || 1.5) + 's');

        // 初始化各个模块
        setupBackgrounds();
        setupClock();
        setupParticles();
        setupTexts();
        setupMusic();
        setupInteractions();
    } catch (e) {
        console.error("配置文件加载失败，请检查路径和格式", e);
    }
}

function setupBackgrounds() {
    const imgs = cfg.images;
    if (!imgs || imgs.length === 0) return;

    function change(idx) {
        const url = imgs[idx % imgs.length];
        const next = usingA ? bgB : bgA;
        const curr = usingA ? bgA : bgB;
        next.src = url;
        next.onload = () => {
            next.classList.add('active');
            curr.classList.remove('active');
            usingA = !usingA;
        };
    }

    if (cfg.changeMode === 'daily') {
        change(new Date().getDate());
    } else {
        change(0);
        let i = 1;
        setInterval(() => change(i++), (cfg.changeInterval || 30) * 1000);
    }
}

function setupMusic() {
    if (!cfg.enableMusic || !cfg.musicPath) return;

    bgm.src = cfg.musicPath;
    bgm.volume = cfg.musicVolume || 0.4;
    musicBtn.style.display = 'flex';

    // 点击切换播放/暂停
    musicBtn.addEventListener('click', () => {
        if (bgm.paused) {
            bgm.play().then(() => {
                musicIcon.innerText = "🔊";
            }).catch(err => console.log("播放被拦截"));
        } else {
            bgm.pause();
            musicIcon.innerText = "🔇";
        }
    });
}

function setupInteractions() {
    const handleMove = (e) => {
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        mouseGlow.style.left = x + 'px';
        mouseGlow.style.top = y + 'px';
        mouseGlow.style.opacity = '1';
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: true });
}

async function setupTexts() {
    let lines = [];
    try {
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
