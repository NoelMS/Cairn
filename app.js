(function(){

var DATA = window.DASHBOARD_DATA;
if(!DATA){
var hv = document.querySelector('#hub-view .hero-l');
if(hv) hv.insertAdjacentHTML('afterbegin', '<p class="load-error" role="alert">The network data (data.js) did not load, so the games cannot start. Keep data.js next to index.html, serve the folder over HTTP and reload.</p>');
document.querySelectorAll('.btn-play[data-game], .top-nav button').forEach(function(b){ if(b.getAttribute('data-go') !== 'hub') b.disabled = true; });
return;
}

function $(sel,ctx){return (ctx||document).querySelector(sel)}
function $$(sel,ctx){return Array.from((ctx||document).querySelectorAll(sel))}
function show(el){if(el)el.classList.remove('hidden')}
function hide(el){if(el)el.classList.add('hidden')}

function switchView(id){
var views = $$('.view');
views.forEach(function(v){
v.classList.remove('active');
v.style.display='none';
v.style.opacity='0';
v.style.pointerEvents='none';
});
var target=$('#'+id);
if(target){
target.classList.add('active');
target.style.display='flex';
target.style.opacity='1';
target.style.pointerEvents='auto';
}
}

function loadStats(){
try{return JSON.parse(localStorage.getItem('nexus_stats'))||{played:0,lab:0}}
catch(e){return{played:0,lab:0}}
}

function updateHubStats(){
var s=loadStats();
$('#stat-played').textContent=s.played;
$('#stat-lab').textContent=s.lab||0;
var sr=$('#stat-routing');if(sr)sr.textContent=s.routing?s.routing+'%':'--';
}


$$('.btn-play[data-game]').forEach(function(btn){
btn.addEventListener('click',function(){
var game=btn.getAttribute('data-game');
if(game==='lab'){
switchView('lab-view');
if(window.NexusLab)window.NexusLab.open();
}else if(game==='routing'){
switchView('routing-view');
if(window.NexusRouting)window.NexusRouting.open();
}else if(game==='dashboard'){
switchView('dashboard-view');
var dfr=$('#dashboard-frame');
if(dfr&&!dfr.getAttribute('src'))dfr.setAttribute('src',dfr.getAttribute('data-src'));
}
});
});

updateHubStats();

var NAV_ORDER = ['hub', 'lab', 'routing', 'dashboard', 'methods'];
var VIEW_OF = { hub: 'hub-view', lab: 'lab-view', routing: 'routing-view', dashboard: 'dashboard-view', methods: 'methods-view' };
function calmMotion(){ return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
function currentNav(){
var active = $('.view.active');
var id = active ? active.id : 'hub-view';
for(var k in VIEW_OF){ if(VIEW_OF[k] === id) return k; }
return 'hub';
}
function markNav(key){
$$('.top-nav button').forEach(function(b){
if(b.getAttribute('data-go') === key) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
});
}
function goTo(key){
var from = currentNav();
var run = function(){
if(key === 'hub'){ switchView('hub-view'); updateHubStats(); }
else if(key === 'methods'){ switchView('methods-view'); loadMethods(); }
else { var b = $('.btn-play[data-game="' + key + '"]'); if(b) b.click(); }
markNav(key);
};
if(key === from || !document.startViewTransition || calmMotion()){ run(); return; }
var root = document.documentElement;
root.style.setProperty('--vt-dir', NAV_ORDER.indexOf(key) < NAV_ORDER.indexOf(from) ? -1 : 1);
root.classList.add('vt-nav');
document.startViewTransition(run).finished.then(function(){ root.classList.remove('vt-nav'); }, function(){ root.classList.remove('vt-nav'); });
}
$$('.top-nav button').forEach(function(b){
b.addEventListener('click', function(){ goTo(b.getAttribute('data-go')); });
});
var navHome = $('#nav-home');
if(navHome) navHome.addEventListener('click', function(){ goTo('hub'); });
$$('.btn-play[data-game]').forEach(function(b){
b.addEventListener('click', function(){ markNav(b.getAttribute('data-game')); });
});
$$('.hud-back').forEach(function(b){
b.addEventListener('click', function(){ markNav('hub'); });
});

var THEME_ICONS = {
system: '<circle cx="8" cy="8" r="6"/><path d="M8 2v12"/><path d="M8 2a6 6 0 0 1 0 12z" fill="currentColor" stroke="none"/>',
light: '<circle cx="8" cy="8" r="3"/><path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3 3l1.1 1.1M11.9 11.9 13 13M3 13l1.1-1.1M11.9 4.1 13 3"/>',
dark: '<path d="M13.5 9.6A5.8 5.8 0 0 1 6.4 2.5 5.8 5.8 0 1 0 13.5 9.6z"/>'
};
var THEME_ORDER = ['system', 'light', 'dark'];
function themeNow(){ return document.documentElement.dataset.theme || 'system'; }
function paintThemeButton(){
var btn = $('#btn-theme');
if(!btn) return;
var t = themeNow();
btn.innerHTML = '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + THEME_ICONS[t] + '</svg>';
btn.setAttribute('aria-label', 'Theme: ' + t);
btn.setAttribute('title', 'Theme: ' + t);
}
var themeBtn = $('#btn-theme');
if(themeBtn){
themeBtn.addEventListener('click', function(){
var next = THEME_ORDER[(THEME_ORDER.indexOf(themeNow()) + 1) % THEME_ORDER.length];
if(next === 'system') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = next;
try{ if(next === 'system') localStorage.removeItem('nexus.theme'); else localStorage.setItem('nexus.theme', next); }catch(e){}
paintThemeButton();
if(window.nexusPickIntro) window.nexusPickIntro();
try{ var sd = $('#dashboard-frame').contentDocument; if(sd && sd.documentElement){ if(next === 'system') delete sd.documentElement.dataset.theme; else sd.documentElement.dataset.theme = next; } }catch(e){}
});
}
paintThemeButton();
(function(){
var v=$('#intro-video'),b=$('#intro-toggle');
if(!v||!b)return;
var userPaused=calmMotion();
function effectiveLight(){var t=document.documentElement.dataset.theme;if(t)return t==='light';return !!(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches)}
function pickSource(){
var want=effectiveLight()?'intro-light':'intro';
if(v.dataset.want===want)return;
v.dataset.want=want;
v.setAttribute('poster',want+'.jpg');
if(!v.currentTime){if(v.getAttribute('src')!==want+'.mp4')v.setAttribute('src',want+'.mp4');return}
function swap(url){
if(v.dataset.want!==want)return;
var at=v.currentTime||0,play=!v.paused&&!userPaused,old=v.src;
v.src=url;
if(old.indexOf('blob:')===0)URL.revokeObjectURL(old);
v.addEventListener('loadedmetadata',function(){try{v.currentTime=Math.min(at,(v.duration||at)-0.05)}catch(e){}if(play)tryPlay()},{once:true});
}
fetch(want+'.mp4').then(function(r){if(!r.ok)throw r.status;return r.blob()}).then(function(bl){swap(URL.createObjectURL(bl))}).catch(function(){swap(want+'.mp4')});
}
window.nexusPickIntro=pickSource;
if(window.matchMedia)window.matchMedia('(prefers-color-scheme: light)').addEventListener('change',pickSource);
function sync(){b.textContent=v.paused?'Play':'Pause';b.setAttribute('aria-pressed',v.paused?'true':'false')}
function tryPlay(){var p=v.play();if(p&&p.catch)p.catch(function(){sync()})}
if(userPaused){v.removeAttribute('autoplay');v.pause()}
b.addEventListener('click',function(){userPaused=!v.paused;if(userPaused)v.pause();else tryPlay()});
v.addEventListener('play',sync);v.addEventListener('pause',sync);
if('IntersectionObserver' in window){new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)v.pause();else if(!userPaused)tryPlay()})}).observe(v)}
pickSource();
sync();
})();
(function(){
var o=$('#demo-overlay'),v=$('#demo-video'),c=$('#demo-close'),back=null;
if(!o||!v||!c)return;
function light(){var t=document.documentElement.dataset.theme;if(t)return t==='light';return !!(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches)}
var pb=$('#dv-play'),sk=$('#dv-seek'),tm=$('#dv-time'),fs=$('#dv-full'),box=$('#dv');
var ICON={play:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4l10 6-10 6z" fill="currentColor"/></svg>',pause:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4h3v12H6zM11 4h3v12h-3z" fill="currentColor"/></svg>',replay:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10a5.5 5.5 0 1 0 1.7-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M5 2.5v4h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'};
function mmss(s){s=Math.max(0,Math.floor(s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function paint(){
var d=v.duration||0,p=d?v.currentTime/d:0;
var st=v.ended?'replay':v.paused?'play':'pause';
pb.innerHTML=ICON[st];pb.setAttribute('aria-label',st==='pause'?'Pause':st==='replay'?'Replay':'Play');
if(document.activeElement!==sk)sk.value=Math.round(p*1000);
sk.style.setProperty('--p',(sk.value/10)+'%');
tm.textContent=mmss(v.currentTime)+' / '+mmss(d);
}
function toggle(){if(v.ended){v.currentTime=0}if(v.paused||v.ended){var p=v.play();if(p&&p.catch)p.catch(paint)}else v.pause()}
['play','pause','ended','timeupdate','loadedmetadata','seeked'].forEach(function(ev){v.addEventListener(ev,paint)});
pb.addEventListener('click',toggle);
v.addEventListener('click',toggle);
sk.addEventListener('input',function(){if(v.duration)v.currentTime=sk.value/1000*v.duration;paint()});
fs.addEventListener('click',function(){if(document.fullscreenElement)document.exitFullscreen();else if(box.requestFullscreen)box.requestFullscreen()});
o.addEventListener('keydown',function(e){if((e.key===' '||e.key==='k')&&e.target.tagName!=='BUTTON'&&e.target!==sk){e.preventDefault();toggle()}});
function open(name,label,btn){
back=btn;$('#demo-title').textContent=label;
var f='demos/'+name+(light()?'-light':'');
o.setAttribute('data-cur',f);v.poster=f+'.jpg';
show(o);paint();pb.focus({preventScroll:true});
function go(url){if(o.classList.contains('hidden')||o.getAttribute('data-cur')!==f){if(url.indexOf('blob:')===0)URL.revokeObjectURL(url);return}v.src=url;var p=v.play();if(p&&p.catch)p.catch(paint)}
fetch(f+'.mp4').then(function(r){if(!r.ok)throw r.status;return r.blob()}).then(function(bl){go(URL.createObjectURL(bl))}).catch(function(){go(f+'.mp4')});
}
function close(){if(document.fullscreenElement)document.exitFullscreen();v.pause();if(v.src.indexOf('blob:')===0)URL.revokeObjectURL(v.src);v.removeAttribute('src');v.load();o.removeAttribute('data-cur');hide(o);if(back)back.focus({preventScroll:true})}
c.addEventListener('click',close);
o.addEventListener('click',function(e){if(e.target===o)close()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!o.classList.contains('hidden')){e.stopImmediatePropagation();close()}},true);
[['lab-tut-demo','lab','Scenario lab'],['rt-tut-demo','routing','Fleet routing']].forEach(function(d){
var b=$('#'+d[0]);if(b)b.addEventListener('click',function(){open(d[1],d[2]+' demo',b)});
});
})();
if('MutationObserver' in window){
var ovObs=new MutationObserver(function(ms){ms.forEach(function(m){
var o=m.target;
if(o.classList.contains('hidden')||!o.closest('.view.active'))return;
setTimeout(function(){if(o.contains(document.activeElement))return;var f=o.querySelector('button:not([disabled]),[href],input,select,[tabindex="0"]');if(f)f.focus({preventScroll:true})},60);
})});
$$('.overlay').forEach(function(o){ovObs.observe(o,{attributes:true,attributeFilter:['class']})});
}
var sysStatus = $('#sys-status');
if(sysStatus) sysStatus.textContent = DATA.suppliers.length + ' suppliers, ' + DATA.demand_hubs.length + ' hubs';

document.addEventListener('keydown',function(e){
if(e.key!=='Escape')return;
var b=$$('.view.active .overlay:not(.hidden) .panel-close, .view.active .overlay:not(.hidden) #rt-again').pop();
if(b)b.click();
});

function mdInline(t){
t=t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
return t.replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/(https?:\/\/[^\s<)]+)/g,'<a href="$1" target="_blank" rel="noopener">$1</a>');
}
function mdToHtml(md){
var lines=md.replace(/\r/g,'').split('\n'),out=[],para=[],list=null,toc=[],i=0,first=true;
function flush(){
if(para.length){out.push('<p'+(first?' class="doc-lede"':'')+'>'+mdInline(para.join(' '))+'</p>');first=false;para=[]}
if(list){out.push('<'+list.tag+'>'+list.items.map(function(x){return '<li>'+mdInline(x)+'</li>'}).join('')+'</'+list.tag+'>');list=null}
}
function cells(l){return l.trim().replace(/^\||\|$/g,'').split('|').map(function(c){return c.trim()})}
while(i<lines.length){
var l=lines[i],m;
if(/^\s*$/.test(l)){flush();i++;continue}
if((m=l.match(/^(#{1,3}) (.*)$/))){
flush();var lv=m[1].length,id='m-'+m[2].toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
if(lv===2)toc.push({id:id,t:m[2]});
out.push('<h'+lv+' id="'+id+'"'+(lv===2?' tabindex="-1"':'')+'>'+mdInline(m[2])+'</h'+lv+'>');i++;continue}
if(/^\|/.test(l)){
flush();var hd=cells(l),rows=[];i+=2;
while(i<lines.length&&/^\|/.test(lines[i])){rows.push(cells(lines[i]));i++}
out.push('<div class="doc-table"><table><thead><tr>'+hd.map(function(h){return '<th scope="col">'+mdInline(h)+'</th>'}).join('')+'</tr></thead><tbody>'+rows.map(function(r){return '<tr>'+r.map(function(c){return '<td>'+mdInline(c)+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>');
continue}
if((m=l.match(/^(?:- |\d+\. )(.*)$/))){
var tag=/^- /.test(l)?'ul':'ol';
if(para.length||(list&&list.tag!==tag))flush();
if(!list)list={tag:tag,items:[]};
list.items.push(m[1]);i++;continue}
if(list){list.items[list.items.length-1]+=' '+l.trim();i++;continue}
para.push(l.trim());i++;
}
flush();
return {html:out.join('\n'),toc:toc};
}
var methodsLoaded=false;
function loadMethods(){
if(methodsLoaded)return;
var body=$('#doc-body'),nav=$('#doc-toc'),view=$('#methods-view');
function render(md){
methodsLoaded=true;
var doc=mdToHtml(md);
body.innerHTML=doc.html;
nav.innerHTML=doc.toc.map(function(s){return '<a href="#'+s.id+'">'+mdInline(s.t.replace(/^\d+\.\s*/,''))+'</a>'}).join('');
$$('a',nav).forEach(function(a){a.addEventListener('click',function(e){
e.preventDefault();var h=$(a.getAttribute('href'));
if(h){h.scrollIntoView({behavior:calmMotion()?'auto':'smooth',block:'start'});h.focus({preventScroll:true})}
})});
function mark(){
var hs=$$('h2',body),cur=hs[0],top=view.getBoundingClientRect().top+120;
hs.forEach(function(h){if(h.getBoundingClientRect().top<=top)cur=h});
$$('a',nav).forEach(function(a){if(cur&&a.getAttribute('href')==='#'+cur.id)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')});
}
view.addEventListener('scroll',mark,{passive:true});
mark();
}
function fail(){body.innerHTML='<p>The report file is missing. Run <code>python model/build_data.py</code> to rebuild it, or read <a href="docs/METHODS.md">docs/METHODS.md</a>.</p>'}
if(typeof window.NEXUS_METHODS==='string'){render(window.NEXUS_METHODS);return}
var sc=document.createElement('script');
sc.src='docs/methods.js';
sc.onload=function(){if(typeof window.NEXUS_METHODS==='string')render(window.NEXUS_METHODS);else fail()};
sc.onerror=fail;
document.head.appendChild(sc);
}
var methodsOpen=$('#methods-open');
if(methodsOpen)methodsOpen.addEventListener('click',function(e){e.preventDefault();goTo('methods')});
if(location.hash==='#methods')goTo('methods');

if(/^https?:$/.test(location.protocol)){var beat=function(){fetch('__nexus/heartbeat',{cache:'no-store'}).catch(function(){})};beat();setInterval(beat,20000);}

$('#dashboard-back').addEventListener('click',function(){
switchView('hub-view'); updateHubStats();
});

})();
