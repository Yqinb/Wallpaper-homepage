const bgA=document.getElementById('bgA');
const bgB=document.getElementById('bgB');
const titleEl=document.getElementById('mainTitle');
const subEl=document.getElementById('subTitle');
const textRain=document.getElementById('textRain');
const clockEl=document.getElementById('clock');
const dateEl=document.getElementById('date');
const mouseGlow=document.getElementById('mouseGlow');
const canvas=document.getElementById('particleCanvas');
const ctx=canvas.getContext('2d');
const bgm=document.getElementById('bgm');

let cfg;
let current=0;
let usingA=true;
let particles=[];

async function load(){
  const res=await fetch('./config.json?v='+Date.now());
  cfg=await res.json();
  
  document.title=cfg.siteName;
  titleEl.innerText=cfg.title;
  subEl.innerText=cfg.subtitle;
  document.getElementById('favicon').href=cfg.favicon;
  
  setupBackgrounds();
  setupTexts();
  setupParticles();
  setupClock();
  setupMusic();
}

function setupBackgrounds(){
  const imgs=cfg.images;
  
  function setImage(index){
    const next=usingA?bgB:bgA;
    const currentBg=usingA?bgA:bgB;
    next.src=imgs[index%imgs.length];
    next.classList.add('active');
    currentBg.classList.remove('active');
    usingA=!usingA;
  }
  
  if(cfg.changeMode==='daily'){
    const day=Math.floor(Date.now()/86400000);
    setImage(day);
  }else{
    setImage(0);
    setInterval(()=>{
      current++;
      setImage(current);
    },cfg.changeInterval*1000);
  }
}

async function setupTexts(){
  let lines=[];
  
  try{
    const res=await fetch('./texts.txt?v='+Date.now());
    const raw=await res.text();
    lines=raw.split('\n').map(v=>v.trim()).filter(Boolean);
  }catch{
    lines=['Ciallo'];
  }
  
  function spawn(){
    const div=document.createElement('div');
    div.className='floatingText';
    const text=lines[Math.floor(Math.random()*lines.length)];
    div.innerText=text;
    const size=Math.random()*22+12;
    const duration=Math.random()*(cfg.textSpeedMax-cfg.textSpeedMin)+cfg.textSpeedMin;
    const top=Math.random()*100;
    const hue=Math.random()*360;
    
    div.style.cssText=`
      position:absolute;
      top:${top}%;
      left:${Math.random()*100}%;
      font-size:${size}px;
      opacity:0.6;
      white-space:nowrap;
      color:hsl(${hue},80%,60%);
      text-shadow:0 0 10px hsl(${hue},80%,60%);
      animation:textFall ${duration}s linear forwards;
    `;
    
    textRain.appendChild(div);
    setTimeout(()=>div.remove(),duration*1000);
  }
  
  setInterval(spawn,Math.random()*1000+500);
}

function setupParticles(){
  canvas.width=window.innerWidth;
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
