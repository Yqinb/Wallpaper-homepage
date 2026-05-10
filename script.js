const bgA = document.getElementById('bgA');
const bgB = document.getElementById('bgB');

const titleEl = document.getElementById('mainTitle');
const subEl = document.getElementById('subTitle');

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

const bgm = document.getElementById('bgm');
const musicBtn = document.getElementById('musicControl');
const musicIcon = document.getElementById('musicIcon');

const mouseGlow = document.getElementById('mouseGlow');

let particles = [];

let usingA = true;

let validImages = [];
let validMusic = [];

let cfg = {
    title: '青昱',
    subtitle: 'Ciallo~',
    changeInterval: 20,
    transitionSpeed: 1.8,

    particleCount: 80,
    particleColor: '255,255,255',
    particleSizeMax: 2,

    musicVolume: 0.4,

    defaultBgColor: '#1a1a2e',

    titleSize: 'clamp(30px, 15vw, 90px)',
    subtitleSize: 'clamp(16px, 4vw, 24px)',

    titleShadow: '0 0 15px rgba(255,120,220,0.4)',

    textOpacity: 0.5,
    textSpawnRate: 1500,

    textFontSizeMin: 14,
    textFontSizeMax: 26,

    textFallSpeedMin: 10,
    textFallSpeedMax: 20
};

init();

async function init() {

    try {
        const configRes = await fetch('./config.json?v=' + Date.now());

        if (configRes.ok) {
            Object.assign(cfg, await configRes.json());
        }

    } catch (e) {
        console.warn('config.json 读取失败');
    }

    renderUI();

    await loadManifest();

    setupClock();

    setupParticles();

    setupTexts();

    setupInteractions();

    if (validImages.length > 0) {
        setupBackgrounds();
    }

    if (validMusic.length > 0) {
        setupMusic();
    }
}

function renderUI() {

    titleEl.innerText = cfg.title;

    subEl.innerText = cfg.subtitle;

    titleEl.style.fontSize = cfg.titleSize;
    subEl.style.fontSize = cfg.subtitleSize;

    titleEl.style.filter = `drop-shadow(${cfg.titleShadow})`;

    document.title = cfg.siteName || cfg.title;

    document.body.style.backgroundColor = cfg.defaultBgColor;

    document.documentElement.style.setProperty(
        '--bg-transition-time',
        cfg.transitionSpeed + 's'
    );

    document.documentElement.style.setProperty(
        '--text-op',
        cfg.textOpacity
    );
}

async function loadManifest() {

    try {

        const res = await fetch('./manifest.json?v=' + Date.now());

        if (!res.ok) return;

        const data = await res.json();

        validImages = (data.images || []).map(v => './images/' + v);

        validMusic = (data.music || []).map(v => './music/' + v);

    } catch (e) {
        console.warn('manifest.json 读取失败');
    }
}

function setupBackgrounds() {

    const switchBg = (index) => {

        const next = usingA ? bgB : bgA;
        const curr = usingA ? bgA : bgB;

        const img = new Image();

        img.src = validImages[index % validImages.length];

        img.onload = async () => {

            next.src = img.src;

            try {
                await next.decode();
            } catch (e) {}

            next.classList.add('active');
            curr.classList.remove('active');

            usingA = !usingA;
        };
    };

    switchBg(0);

    setInterval(() => {

        const randomIndex = Math.floor(Math.random() * validImages.length);

        switchBg(randomIndex);

    }, cfg.changeInterval * 1000);
}

function setupMusic() {

    musicBtn.style.display = 'flex';

    bgm.volume = cfg.musicVolume || 0.4;

    const playRandom = async () => {

        try {

            bgm.src = validMusic[
                Math.floor(Math.random() * validMusic.length)
            ];

            await bgm.play();

            musicIcon.innerText = '🔊';

        } catch (e) {

            console.error('音乐播放失败:', e);

            musicIcon.innerText = '❌';
        }
    };

    // 自动下一首
    bgm.onended = playRandom;

    // 点击按钮控制播放
    musicBtn.addEventListener('click', async () => {

        try {

            // 第一次播放
            if (!bgm.src) {

                await playRandom();

                return;
            }

            // 暂停状态
            if (bgm.paused) {

                await bgm.play();

                musicIcon.innerText = '🔊';

            } else {

                bgm.pause();

                musicIcon.innerText = '🔇';
            }

        } catch (e) {

            console.error('按钮播放失败:', e);

            musicIcon.innerText = '❌';
        }
    });
}

async function setupTexts() {

    let lines = ['Ciallo~'];

    try {

        const res = await fetch('./texts.txt?v=' + Date.now());

        if (res.ok) {

            lines = (await res.text())
                .split('\n')
                .filter(v => v.trim());
        }

    } catch (e) {}

    setInterval(() => {

        if (document.hidden) return;

        const div = document.createElement('div');

        const minSize = cfg.textFontSizeMin || 14;
        const maxSize = cfg.textFontSizeMax || 26;

        const minSpeed = cfg.textFallSpeedMin || 10;
        const maxSpeed = cfg.textFallSpeedMax || 20;

        const duration = Math.random() * (maxSpeed - minSpeed) + minSpeed;

        const fontSize = Math.random() * (maxSize - minSize) + minSize;

        div.innerText = lines[
            Math.floor(Math.random() * lines.length)
        ];

        div.style.cssText = `
            position:absolute;
            top:-100px;
            left:${Math.random() * 90}%;
            font-size:${fontSize}px;
            color:hsla(${Math.random() * 360},70%,80%,${cfg.textOpacity});
            animation:textFall ${duration}s linear forwards;
            pointer-events:none;
            z-index:3;
            white-space:nowrap;
        `;

        document.getElementById('textRain').appendChild(div);

        setTimeout(() => {
            div.remove();
        }, duration * 1000);

    }, cfg.textSpawnRate);
}

function setupParticles() {

    particles = [];

    const resize = () => {

        const dpr = window.devicePixelRatio || 1;

        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;

        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.scale(dpr, dpr);
    };

    resize();

    window.addEventListener('resize', resize);

    for (let i = 0; i < cfg.particleCount; i++) {

        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,

            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,

            size: Math.random() * cfg.particleSizeMax,

            opacity: Math.random() * 0.5
        });
    }

    const animate = () => {

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        ctx.fillStyle = `rgba(${cfg.particleColor},0.5)`;

        particles.forEach(p => {

            p.x += p.vx;
            p.y += p.vy;

            if (p.x <= 0 || p.x >= window.innerWidth) {
                p.vx *= -1;
            }

            if (p.y <= 0 || p.y >= window.innerHeight) {
                p.vy *= -1;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    };

    animate();
}

function setupClock() {

    const clock = document.getElementById('clock');
    const date = document.getElementById('date');

    const update = () => {

        const now = new Date();

        clock.innerText = now.toLocaleTimeString('zh-CN', {
            hour12: false
        });

        date.innerText = now.toLocaleDateString('zh-CN', {
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    };

    update();

    setInterval(update, 1000);
}

function setupInteractions() {

    window.addEventListener('mousemove', e => {

        mouseGlow.style.left = e.clientX + 'px';
        mouseGlow.style.top = e.clientY + 'px';

        mouseGlow.style.opacity = '1';
    });

    window.addEventListener('mouseleave', () => {
        mouseGlow.style.opacity = '0';
    });
}
