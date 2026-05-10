const bgA = document.getElementById('bgA'), bgB = document.getElementById('bgB');
const titleEl = document.getElementById('mainTitle'), subEl = document.getElementById('subTitle');
const clockEl = document.getElementById('clock'), dateEl = document.getElementById('date');
const canvas = document.getElementById('particleCanvas'), ctx = canvas.getContext('2d');
const bgm = document.getElementById('bgm'), musicBtn = document.getElementById('musicControl'), musicIcon = document.getElementById('musicIcon');
const mouseGlow = document.getElementById('mouseGlow');

const IMAGE_EXTS = ['.jpg', '.JPG', '.png', '.PNG', '.webp', '.WEBP', '.jpeg', '.JPEG'];
const MUSIC_EXTS = ['.mp3', '.MP3', '.m4a', '.M4A', '.ogg', '.OGG'];

let cfg = { title: "青昱", subtitle: "Ciallo~", changeInterval: 20, particleCount: 80, musicVolume: 0.4 };
let particles = [], usingA = true, activeTextCount = 0;
let validImages = [], validMusic = [];

async function init() {
    try {
        const res = await fetch('./config.json?v=' + Date.now());
        if (res.ok) Object.assign(cfg, await res.json());
    } catch (e) { console.warn("Default config used"); }

    titleEl.innerText = cfg.title;
    subEl.innerText = cfg.subtitle;
    document.title = cfg.siteName || cfg.title;

    // 探测资源
    validImages = await smartDetect('./images/', 'image', 30);
    validMusic = await smartDetect('./music/', 'audio', 15);

    setupBackgrounds();
    setupMusic();
    setupClock();
    setupParticles();
    setupTexts();
    setupInteractions();
}

async function smartDetect(path, type, max) {
    let results = [];
    const exts = type === 'image' ? IMAGE_EXTS : MUSIC_EXTS;
    for (let i = 1; i <= max; i++) {
        let found = false;
        for (const ext of exts) {
            const url = `${path}${i}${ext}`;
            const isExist = await new Promise(resolve => {
                if (type === 'image') {
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
            if (isExist) { results.push(url); found = true; break; }
        }
        if (!found) break;
    }
    return results;
}

function setupBackgrounds() {
    if (validImages.length === 0) return;
    const change = (idx) => {
        const next = usingA ? bgB : bgA, curr = usingA ? bgA : bgB;
        const temp = new Image();
        temp.src = validImages[idx % validImages.length];
        temp.onload = () => {
            next.src = temp.src;
            next.classList.add('active');
            curr.classList.remove('active');
            usingA = !usingA;
        };
    };
    change(0);
    setInterval(() => change(Math.floor(Math.random() * validImages.length)), cfg.changeInterval * 1000);
}

function setupMusic() {
    if (validMusic.length === 0) return;
    musicBtn.style.display = 'flex';
    bgm.volume = cfg.musicVolume;

    const playRandom = () => {
        const track = validMusic[Math.floor(Math.random() * validMusic.length)];
        bgm.src = track;
        bgm.play().then(() => musicIcon.innerText = "🔊").catch(() => {
            musicIcon.innerText = "🔇";
        });
    };

    bgm.onended = playRandom;
    musicBtn.addEventListener('click', () => {
        if (bgm.paused) {
            if (!bgm.src) playRandom(); else bgm.play();
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
        particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, size: Math.random() * 2, opacity: Math.random() * 0.5 });
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
    let lines = ["Ciallo~", "✨"];
    try {
        const r = await fetch('./texts.txt?v=' + Date.now());
        if (r.ok) lines = (await r.text()).split('\n').filter(t => t.trim());
    } catch (e) {}

    setInterval(() => {
        if (activeTextCount > 15) return;
        const div = document.createElement('div');
        div.innerText = lines[Math.floor(Math.random() * lines.length)];
        const dur = Math.random() * 8 + 10;
        div.style.cssText = `position:absolute; top:-50px; left:${Math.random()*90}%; font-size:${Math.random()*12+14}px; color:hsla(${Math.random()*360},70%,80%,0.4); animation:textFall ${dur}s linear forwards; pointer-events:none; z-index:3;`;
        document.getElementById('textRain').appendChild(div);
        activeTextCount++;
        setTimeout(() => { div.remove(); activeTextCount--; }, dur * 1000);
    }, 2000);
}

function setupInteractions() {
    const move = (e) => {
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        mouseGlow.style.left = x + 'px'; mouseGlow.style.top = y + 'px';
        mouseGlow.style.opacity = "1";
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: true });
}

init();