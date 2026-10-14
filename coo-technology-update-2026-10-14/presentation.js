'use strict';
const slides = [...document.querySelectorAll('.slide')];
const stage = document.querySelector('#stage');
const controls = document.querySelector('.controls');
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const fullscreen = document.querySelector('#fullscreen');
const reflow = matchMedia('(max-width:767px), (max-width:1199px) and (orientation:portrait)');
let current = 0;
let navigatingUntil = 0;
function hashIndex() { const n = Number(location.hash.slice(1)); return Number.isInteger(n) && n >= 1 && n <= slides.length ? n - 1 : 0; }
function show(index, scroll = true) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === current);
    slide.inert = !reflow.matches && i !== current;
    slide.setAttribute('aria-hidden', String(!reflow.matches && i !== current));
  });
  previous.disabled = current === 0; next.disabled = current === slides.length - 1;
  document.querySelector('#counter').textContent = `${current + 1} / ${slides.length}`;
  document.querySelector('#progress').value = current + 1;
  history.replaceState(null, '', `#${current + 1}`);
  if (reflow.matches && scroll) { navigatingUntil = Date.now() + 350; slides[current].scrollIntoView({behavior:'instant',block:'start'}); }
}
function resize() {
  document.body.style.setProperty('--bar-height', `${controls.offsetHeight}px`);
  stage.style.setProperty('--scale', Math.min(innerWidth / 1920, (innerHeight - controls.offsetHeight) / 1080));
  show(current, false);
}
async function toggleFullscreen() {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen(); }
  catch { fullscreen.textContent = 'Fullscreen unavailable'; }
}
previous.addEventListener('click', () => show(current - 1));
next.addEventListener('click', () => show(current + 1));
fullscreen.addEventListener('click', toggleFullscreen);
if (!document.fullscreenEnabled) { fullscreen.disabled = true; fullscreen.title = 'Fullscreen is unavailable in this browser'; }
document.addEventListener('fullscreenchange', () => { fullscreen.textContent = document.fullscreenElement ? 'Exit fullscreen' : 'Fullscreen'; fullscreen.setAttribute('aria-label', fullscreen.textContent); resize(); });
addEventListener('keydown', e => {
  if (e.altKey || e.ctrlKey || e.metaKey || e.target.closest('input,textarea,select,[contenteditable]')) return;
  if (e.target.closest('button,a') && (e.key === ' ' || e.key === 'Enter')) return;
  const actions = {ArrowRight:()=>show(current+1),PageDown:()=>show(current+1),' ':()=>show(current+1),ArrowLeft:()=>show(current-1),PageUp:()=>show(current-1),Home:()=>show(0),End:()=>show(slides.length-1),f:toggleFullscreen,F:toggleFullscreen};
  if (actions[e.key]) { e.preventDefault(); actions[e.key](); }
});
let touch;
stage.addEventListener('touchstart', e => { if (!reflow.matches && !e.target.closest('a,button')) touch = {x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY}; }, {passive:true});
stage.addEventListener('touchend', e => { if (!touch) return; const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y; if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.5) show(current+(dx<0?1:-1)); touch=null; }, {passive:true});
addEventListener('hashchange', () => show(hashIndex()));
addEventListener('resize', resize);
new ResizeObserver(resize).observe(controls);
let queued=false;
addEventListener('scroll', () => { if (!reflow.matches || queued || Date.now()<navigatingUntil) return; queued=true; requestAnimationFrame(()=> { queued=false; const target=slides.reduce((best,slide,i)=>Math.abs(slide.getBoundingClientRect().top)<Math.abs(slides[best].getBoundingClientRect().top)?i:best,0); if(target!==current) show(target,false); }); }, {passive:true});
current=hashIndex(); resize(); if(reflow.matches && current) requestAnimationFrame(()=>show(current));
