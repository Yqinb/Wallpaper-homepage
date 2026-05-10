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

const res=
await fetch('./config.json?v='+Date.now());

cfg=
await res.json();

document.title=
cfg.siteName;

titleEl.innerText=
cfg.title;

subEl.innerText=
cfg.subtitle;

document.getElementById('favicon').href=
cfg.favicon;

setupBackgrounds();
setupTexts();
setupParticles();
setupClock();
setupMusic();
}

function setupBackgrounds(){

const imgs=cfg.images;

function setImage(index){

const next=
usingA?bgB:bgA;

const currentBg=
usingA?bgA:bgB;

next.src=
imgs[index%imgs.length];

next.classList.add('active');

currentBg.classList.remove('active');

usingA=!usingA;
}

if(cfg.changeMode==='daily'){

const day=
Math.floor(Date.now()/86400000);

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

const res=
await fetch('./texts.txt?v='+Date.now());

const raw=
await res.text();

lines=
raw.split('\n')
.map(v=>v.trim())
.filter(Boolean);

}catch{

lines=['Ciallo'];
}

function spawn(){

const div=
document.createElement('div');

div.className='floatingText';

const text=
lines[Math.floor(Math.random()*lines.length)];

div.innerText=text;

const size=Math.random()*22+12;
const duration=Math.random()*(cfg.textSpeedMax-cfg.textSpeedMin)+cfg.textSpeedMin;
const top=Math.random()*100;
const hue=Math.random()*360;

load();
