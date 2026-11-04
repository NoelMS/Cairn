(function(){

var DATA=window.DASHBOARD_DATA;
if(!DATA)return;
var SVG_NS='http:'+'/'+'/www.w3.org/2000/svg';
function $(s,c){return (c||document).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
function fmt(n){return Math.round(n).toLocaleString('en-US')}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

var TYPES={
D:{name:'Diesel',cap:16,perKm:1.9,fixed:180,co2:1.085,range:Infinity},
E:{name:'Electric',cap:12,perKm:1.5,fixed:380,co2:0.611,range:250},
H:{name:'Hired diesel',cap:16,perKm:2.4,fixed:450,co2:1.085,range:Infinity}
};
var SPEED=60,UNLOAD=0.75,SHIFT=8,MAX_SHIFT=10,ROAD=1.3;
var BASE_FLEET=[{id:'D1',type:'D'},{id:'D2',type:'D'},{id:'E1',type:'E'},{id:'E2',type:'E'}];
var TRUCKS=BASE_FLEET.slice();
function port(name){return (DATA.telemetry||[]).find(function(p){return p.port===name})||{}}
function site(id,name,lat,lon,loads){return {id:id,name:name,lat:lat,lon:lon,demand_units:loads*1000}}
var JA=port('Jebel Ali Port'),RTM=port('Port of Rotterdam'),SHA=port('Shanghai Port');
var REGIONS=[
{name:'UAE',where:'UAE',grid:467.51,gridName:'UAE',bounds:[53.95,56.25,23.85,25.7],step:0.5,
depots:[{id:'JA',name:'Jebel Ali Port',short:'Jebel Ali, Dubai',lat:JA.lat,lon:JA.lon,fixed:400},{id:'HAM',name:'Hamriyah Maritime Port',short:'Hamriyah, Sharjah',lat:25.47,lon:55.50,fixed:260}],
sites:[site('DEM_MBR_SOLAR','MBR Solar Park Phase 5/6',24.75,55.37,8.2),site('DEM_EMIRATES_SUST','Emirates Sustainable City',25.33,55.54,4.5),site('DEM_SRTIP','National Technology Research Park',25.31,55.49,3.1),site('DEM_MASDAR','Masdar City Clean Cluster',24.43,54.61,5.6),site('DEM_AL_DHAFRA','Al Dhafra Solar Complex',24.12,54.55,9.4)],
urban:{HAM:1,DEM_EMIRATES_SUST:1,DEM_SRTIP:1,DEM_MASDAR:1},urbanText:'Hamriyah, the Sharjah sites and Masdar City',
labels:{DEM_SRTIP:{dx:-12,dy:18,a:'end'},DEM_EMIRATES_SUST:{dx:12,dy:16,a:'start'}},
note:'Schematic chart of Dubai, Sharjah and Abu Dhabi: true positions on a half degree grid, coastline omitted.',
source:'Site positions are real UAE renewable and clean-tech sites; daily loads are illustrative last-mile volumes for the exercise.'},
{name:'Benelux',where:'Dutch and Belgian North Sea',grid:253.56,gridName:'Netherlands',bounds:[2.75,5.8,50.95,52.6],step:0.5,
depots:[{id:'RTM',name:'Port of Rotterdam',short:'Rotterdam',lat:RTM.lat,lon:RTM.lon,fixed:420},{id:'ANR',name:'Port of Antwerp',short:'Antwerp',lat:51.27,lon:4.36,fixed:380}],
sites:[site('NL_IJM','IJmuiden',52.46,4.61,8),site('NL_MVL','Maasvlakte',51.96,4.03,7),site('NL_VLI','Vlissingen',51.45,3.60,6),site('BE_ZEE','Zeebrugge',51.33,3.20,9),site('BE_GNT','Ghent',51.07,3.73,5)],
urban:{NL_IJM:1,NL_VLI:1,BE_GNT:1},urbanText:'IJmuiden, Vlissingen and Ghent',
labels:{BE_GNT:{dx:12,dy:18,a:'start'}},
note:'Schematic chart of the Dutch and Belgian North Sea coast: true positions on a half degree grid, coastline omitted.',
source:'Rotterdam is in the games dataset. Antwerp and the five sites are real ports and towns at their true positions, added for this region; their loads are scenario values, not dataset figures.'},
{name:'Yangtze Delta',where:'Yangtze River Delta',grid:525.34,gridName:'China',bounds:[119.2,123.2,29.6,32.6],step:1,
depots:[{id:'SHA',name:'Shanghai Port',short:'Shanghai',lat:SHA.lat,lon:SHA.lon,fixed:350},{id:'NGB',name:'Ningbo-Zhoushan Port',short:'Ningbo',lat:29.94,lon:121.84,fixed:300}],
sites:[site('CN_RUD','Rudong',32.31,121.19,7),site('CN_NTG','Nantong',31.98,120.89,5),site('CN_SUZ','Suzhou',31.30,120.62,6),site('CN_JXG','Jiaxing',30.75,120.76,4),site('CN_KSN','Kunshan',31.38,120.98,6)],
urban:{CN_NTG:1,CN_SUZ:1,CN_KSN:1},urbanText:'Nantong, Suzhou and Kunshan',
labels:{CN_SUZ:{dx:-12,dy:-9,a:'end'}},
note:'Schematic chart of the Yangtze River Delta: true positions on a one degree grid, coastline omitted.',
source:'Shanghai is in the games dataset. Ningbo and the five sites are real ports and cities at their true positions, added for this region; their loads are scenario values, not dataset figures.'}
];
var R=REGIONS[0],DEPOTS=R.depots,SITES=R.sites,URBAN=R.urban,LABEL_POS=R.labels;
var SCENARIOS=[
{name:'Standard day',brief:'Deliver this week\'s loads of cable drums and panels to the five project sites. Open the depots you need, then give each truck a route.',mult:1,evShare:0},
{name:'Peak week',brief:'Commissioning is due, so every site needs 30 percent more. Capacity is tight, and a contractor truck (H1) is available at a premium.',mult:1.3,evShare:0,extra:[{id:'H1',type:'H'}]},
{name:'Low-emission mandate',brief:'The client now requires at least half of the routes you run to use electric trucks. Range and shift length decide what is possible.',mult:1,evShare:0.5}
];

function loadW(){try{var w=JSON.parse(localStorage.getItem('nexus.weights'));if(w&&w.eco+w.env+w.soc>0)return w}catch(e){}return {eco:34,env:33,soc:33}}
var RT={reg:0,scn:0,weights:loadW(),open:{},plan:{},active:'D1',stops:[],opt:null,showOpt:false,ready:false};

function km(a,b){
var r=Math.PI/180,dLat=(b.lat-a.lat)*r,dLon=(b.lon-a.lon)*r;
var h=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dLon/2)*Math.sin(dLon/2);
return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h))*ROAD;
}
function depotById(id){return DEPOTS.find(function(d){return d.id===id})}
function stopById(id){return RT.stops.find(function(s){return s.id===id})}
function shortName(n){var w=n.split(' ');return w[0].length<=3?w.slice(0,2).join(' '):w[0]}

function buildStops(){
var m=SCENARIOS[RT.scn].mult;
RT.stops=SITES.map(function(h){return {id:h.id,name:h.name,lat:h.lat,lon:h.lon,load:Math.ceil(h.demand_units/1000*m)}});
}

function routeKm(depot,ids){
if(!ids.length)return 0;
var pts=[depot].concat(ids.map(stopById)).concat([depot]);
var t=0;for(var i=1;i<pts.length;i++)t+=km(pts[i-1],pts[i]);
return t;
}
function urbanKm(depot,ids){
if(!ids.length)return 0;
var pts=[depot].concat(ids.map(stopById)).concat([depot]);
var u=0;for(var i=1;i<pts.length;i++){var w=((URBAN[pts[i-1].id]?1:0)+(URBAN[pts[i].id]?1:0))/2;u+=w*km(pts[i-1],pts[i])}
return u;
}
function evalRoute(type,depotId,ids){
var T=TYPES[type],d=depotById(depotId);
var load=ids.reduce(function(a,id){return a+stopById(id).load},0);
var dist=d?routeKm(d,ids):0;
var hours=ids.length?dist/SPEED+UNLOAD*ids.length:0;
var urban=type==='E'?0:(d?urbanKm(d,ids):0);
var errs=[];
if(load>T.cap)errs.push('over capacity');
if(dist>T.range)errs.push('beyond '+T.range+' km range');
if(hours>MAX_SHIFT)errs.push('shift over '+MAX_SHIFT+' h');
return {load:load,km:dist,hours:hours,ot:urban,cost:ids.length?T.fixed+T.perKm*dist:0,co2:dist*T.co2,errs:errs,used:ids.length>0};
}

function evalPlan(){
var tot={cost:0,co2:0,ot:0,errs:[],routes:{}};
var assigned={};
DEPOTS.forEach(function(d){if(RT.open[d.id])tot.cost+=d.fixed});
var used=0,ev=0;
TRUCKS.forEach(function(t){
var p=RT.plan[t.id];
var r=evalRoute(t.type,p.depot,p.stops);
tot.routes[t.id]=r;
if(r.used){
used++;if(t.type==='E')ev++;
if(!RT.open[p.depot])r.errs.push('depot closed');
tot.cost+=r.cost;tot.co2+=r.co2;tot.ot+=r.ot;
r.errs.forEach(function(e){tot.errs.push(t.id+': '+e)});
}
p.stops.forEach(function(id){assigned[id]=t.id});
});
var missing=RT.stops.filter(function(s){return !assigned[s.id]});
if(missing.length)tot.errs.push(missing.length+' site'+(missing.length>1?'s':'')+' not on a route');
var need=SCENARIOS[RT.scn].evShare;
if(need&&used&&ev<Math.ceil(used*need))tot.errs.push('mandate: '+ev+' of '+used+' routes electric, need '+Math.ceil(used*need));
if(RT.weights.eco+RT.weights.env+RT.weights.soc<=0)tot.errs.push('set at least one weight above zero');
tot.assigned=assigned;
return tot;
}

function permutations(a){
if(a.length<=1)return [a.slice()];
var out=[];
a.forEach(function(x,i){permutations(a.slice(0,i).concat(a.slice(i+1))).forEach(function(p){out.push([x].concat(p))})});
return out;
}
function partitions(a){
if(!a.length)return [[]];
var first=a[0],out=[];
partitions(a.slice(1)).forEach(function(p){
for(var i=0;i<p.length;i++){var c=p.map(function(b){return b.slice()});c[i].unshift(first);out.push(c)}
out.push([[first]].concat(p));
});
return out;
}

function enumeratePlans(){
var ids=RT.stops.map(function(s){return s.id});
var best={};
function bestOrder(block,depotId){
var k=depotId+'|'+block.join(',');
if(!best[k]){
var d=depotById(depotId),bo=null,bk=Infinity;
permutations(block).forEach(function(p){var v=routeKm(d,p);if(v<bk){bk=v;bo=p}});
best[k]=bo;
}
return best[k];
}
var plans=[];
var need=SCENARIOS[RT.scn].evShare;
partitions(ids).forEach(function(part){
var avail={};TRUCKS.forEach(function(t){avail[t.type]=(avail[t.type]||0)+1});
if(part.length>TRUCKS.length)return;
(function assign(i,routes,used){
if(i===part.length){
var cost=0,co2=0,ot=0,deps={};
routes.forEach(function(r){cost+=r.ev.cost;co2+=r.ev.co2;ot+=r.ev.ot;deps[r.depot]=1});
Object.keys(deps).forEach(function(d){cost+=depotById(d).fixed});
if(need&&(used.E||0)<Math.ceil(routes.length*need))return;
plans.push({cost:cost,co2:co2,ot:ot,routes:routes.slice()});
return;
}
DEPOTS.forEach(function(d){
Object.keys(avail).forEach(function(type){
if((used[type]||0)>=avail[type])return;
var order=bestOrder(part[i],d.id);
var ev=evalRoute(type,d.id,order);
if(ev.errs.length)return;
routes.push({type:type,depot:d.id,stops:order,ev:ev});
used[type]=(used[type]||0)+1;
assign(i+1,routes,used);
used[type]--;
routes.pop();
});
});
})(0,[],{});
});
return plans;
}

function ranges(plans){
var r={};
['cost','co2','ot'].forEach(function(k){
var v=plans.map(function(p){return p[k]});
r[k]=[Math.min.apply(null,v),Math.max.apply(null,v)];
});
return r;
}
function utility(m,r,w){
var tw=w.eco+w.env+w.soc||1;
function n(k){var a=r[k][0],b=r[k][1];return b-a<1e-9?1:Math.max(0,Math.min(1,(b-m[k])/(b-a)))}
return (w.eco*n('cost')+w.env*n('co2')+w.soc*n('ot'))/tw;
}
function pareto(plans){
return plans.filter(function(p){
return !plans.some(function(q){return q!==p&&q.cost<=p.cost&&q.co2<=p.co2&&q.ot<=p.ot&&(q.cost<p.cost||q.co2<p.co2||q.ot<p.ot)});
});
}

var VW=640,VH=560;
function mx(lon){var b=R.bounds;return (lon-b[0])/(b[1]-b[0])*VW}
function my(lat){var b=R.bounds;return (b[3]-lat)/(b[3]-b[2])*VH}
function deg(v){return (Math.round(v*10)/10).toFixed(R.step<1?1:0)}
function el(tag,attrs,parent){var e=document.createElementNS(SVG_NS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}

function drawBase(){
var g=$('#rt-base');if(!g||g.getAttribute('data-reg')===String(RT.reg))return;
g.innerHTML='';g.setAttribute('data-reg',RT.reg);
var b=R.bounds,st=R.step;
for(var lon=Math.ceil(b[0]/st)*st;lon<=b[1];lon+=st){el('line',{x1:mx(lon),y1:0,x2:mx(lon),y2:VH,'class':'rt-grat'},g);el('text',{x:mx(lon)+3,y:VH-6,'class':'rt-grat-l'},g).textContent=deg(lon)+'E'}
for(var lat=Math.ceil(b[2]/st)*st;lat<=b[3];lat+=st){el('line',{x1:0,y1:my(lat),x2:VW,y2:my(lat),'class':'rt-grat'},g);el('text',{x:4,y:my(lat)-4,'class':'rt-grat-l'},g).textContent=deg(lat)+'N'}
}

function draw(){
drawBase();
var gR=$('#rt-routes'),gN=$('#rt-nodes');
gR.innerHTML='';gN.innerHTML='';
var ev=evalPlan();
if(RT.showOpt&&RT.opt){
RT.opt.best.routes.forEach(function(r){
var d=depotById(r.depot);var pts=[d].concat(r.stops.map(stopById)).concat([d]);
el('polyline',{points:pts.map(function(p){return mx(p.lon).toFixed(1)+','+my(p.lat).toFixed(1)}).join(' '),'class':'rt-opt'},gR);
});
}
TRUCKS.forEach(function(t){
var p=RT.plan[t.id];if(!p.stops.length)return;
var d=depotById(p.depot);if(!d)return;
var pts=[d].concat(p.stops.map(stopById)).concat([d]);
var bad=ev.routes[t.id].errs.length>0;
el('polyline',{points:pts.map(function(q){return mx(q.lon).toFixed(1)+','+my(q.lat).toFixed(1)}).join(' '),'class':'rt-route rt-'+t.type+(t.id===RT.active?' rt-active':'')+(bad?' rt-bad':'')},gR);
});
DEPOTS.forEach(function(d){
var x=mx(d.lon),y=my(d.lat);
var g=el('g',{'class':'rt-depot'+(RT.open[d.id]?' is-open':'')},gN);
el('polygon',{points:x+','+(y-9)+' '+(x+9)+','+y+' '+x+','+(y+9)+' '+(x-9)+','+y},g);
el('text',{x:x+13,y:y+4,'class':'rt-node-l'},g).textContent=d.short;
});
RT.stops.forEach(function(s){
var x=mx(s.lon),y=my(s.lat),on=ev.assigned[s.id];
var g=el('g',{'class':'rt-stop'+(on?' is-served':'')+(on&&on===RT.active?' is-mine':''),'data-id':s.id},gN);
el('circle',{cx:x,cy:y,r:14,'class':'rt-hit'},g);
el('circle',{cx:x,cy:y,r:6.5},g);
var lp=LABEL_POS[s.id]||{dx:11,dy:-9,a:'start'};var t=el('text',{x:x+lp.dx,y:y+lp.dy,'class':'rt-node-l','text-anchor':lp.a},g);t.textContent=s.name.replace(/ Phase.*| Complex| Cluster| Research.*| City.*/,'')+' \u00b7 '+s.load+(on?' \u00b7 '+on:'');
g.addEventListener('click',function(){toggleStop(s.id)});
});
}

function toggleStop(id){
if(!RT.ready)return;
var mine=RT.plan[RT.active].stops;
var i=mine.indexOf(id);
if(i>=0){mine.splice(i,1)}
else{
TRUCKS.forEach(function(t){var a=RT.plan[t.id].stops,j=a.indexOf(id);if(j>=0)a.splice(j,1)});
mine.push(id);
}
refresh();
}

function panel(){
var ev=evalPlan();
var w=RT.weights,tw=w.eco+w.env+w.soc||1;
$('#rt-scn-name').textContent=R.name+', '+SCENARIOS[RT.scn].name;
$$('.rt-reg-btn').forEach(function(b){var on=+b.getAttribute('data-reg')===RT.reg;b.classList.toggle('is-on',on);b.setAttribute('aria-pressed',on?'true':'false')});
$$('.rt-scn-btn').forEach(function(b){var on=+b.getAttribute('data-scn')===RT.scn;b.classList.toggle('is-on',on);b.setAttribute('aria-pressed',on?'true':'false')});
$('#rt-brief').textContent=SCENARIOS[RT.scn].brief.replace('five project sites','five '+R.where+' project sites');
$('#rt-hud-cost').textContent='$'+fmt(ev.cost);
$('#rt-hud-co2').textContent=fmt(ev.co2)+' kg';
$('#rt-hud-ot').textContent=fmt(ev.ot)+' km';
['eco','env','soc'].forEach(function(k){$('#rt-w-'+k+'-v').textContent=Math.round(w[k]/tw*100)+'%'});
DEPOTS.forEach(function(d){var c=$('#rt-dep-'+d.id);if(c)c.checked=!!RT.open[d.id]});
var fl=$('#rt-fleet');fl.innerHTML='';
TRUCKS.forEach(function(t){
var T=TYPES[t.type],p=RT.plan[t.id],r=ev.routes[t.id];
var row=document.createElement('div');
row.className='rt-truck'+(t.id===RT.active?' is-active':'');
var opts=DEPOTS.map(function(d){return '<option value="'+d.id+'"'+(p.depot===d.id?' selected':'')+'>'+esc(d.short)+'</option>'}).join('');
var seq=p.stops.length?p.stops.map(function(id){return esc(shortName(stopById(id).name))}).join(' \u2192 '):'No stops yet';
row.innerHTML='<button class="rt-truck-btn" aria-pressed="'+(t.id===RT.active)+'"><span class="mono">'+t.id+'</span> '+T.name+' <span class="muted">'+T.cap+' loads'+(T.range<Infinity?', '+T.range+' km':'')+', $'+T.perKm+'/km + $'+T.fixed+'</span></button>'+
'<label class="rt-dep-sel"><span class="visually-hidden">Depot for '+t.id+'</span><select data-truck="'+t.id+'">'+opts+'</select></label>'+
'<p class="rt-seq">'+seq+'</p>'+
(p.stops.length?'<p class="rt-metrics mono'+(r.errs.length?' loss':'')+'">'+r.load+'/'+T.cap+' loads \u00b7 '+fmt(r.km)+' km \u00b7 '+r.hours.toFixed(1)+' h'+(r.ot?' \u00b7 '+fmt(r.ot)+' urban diesel km':'')+(r.errs.length?' \u00b7 '+r.errs.join(', '):'')+'</p>':'');
$('.rt-truck-btn',row).addEventListener('click',function(){RT.active=t.id;refresh()});
$('select',row).addEventListener('change',function(e){p.depot=e.target.value;refresh()});
fl.appendChild(row);
});
var chips=$('#rt-chips');chips.innerHTML='';
RT.stops.forEach(function(s){
var on=ev.assigned[s.id];
var b=document.createElement('button');
b.className='rt-chip'+(on===RT.active?' is-mine':on?' is-other':'');
b.setAttribute('aria-pressed',on===RT.active?'true':'false');
b.innerHTML=esc(s.name)+' <span class="mono">'+s.load+(on&&on!==RT.active?' \u00b7 on '+on:'')+'</span>';
b.addEventListener('click',function(){toggleStop(s.id)});
chips.appendChild(b);
});
$('#rt-active-label').textContent=RT.active;
var errs=$('#rt-errs');
errs.innerHTML=ev.errs.length?ev.errs.map(function(e){return '<li>'+esc(e)+'</li>'}).join(''):'<li class="gain">Plan is feasible. Score it against the optimizer.</li>';
$('#rt-score').disabled=ev.errs.length>0;
}

function refresh(){panel();draw()}

function newScenario(i){
RT.scn=i;
TRUCKS=BASE_FLEET.concat(SCENARIOS[i].extra||[]);
buildStops();
RT.open={};RT.open[DEPOTS[0].id]=true;
RT.plan={};TRUCKS.forEach(function(t){RT.plan[t.id]={depot:DEPOTS[0].id,stops:[]}});
RT.active='D1';RT.showOpt=false;
var plans=enumeratePlans();
RT.opt={plans:plans,front:pareto(plans),r:ranges(plans)};
RT.ready=true;
$('#rt-hud-score').textContent='--';
refresh();
}

function bestFor(){
var w=RT.weights,o=RT.opt,b=null,bu=-1;
o.plans.forEach(function(p){var u=utility(p,o.r,w);if(u>bu){bu=u;b=p}});
o.best=b;o.bestU=bu;
return b;
}

function scorePlan(){
var ev=evalPlan();if(ev.errs.length)return;
var o=RT.opt,best=bestFor();
var mine={cost:ev.cost,co2:ev.co2,ot:ev.ot};
var u=utility(mine,o.r,RT.weights);
var pct=Math.round(Math.min(1,u/(o.bestU||1))*100);
var grade=pct>=97?'A':pct>=88?'B':pct>=75?'C':pct>=60?'D':'F';
$('#rt-hud-score').textContent=pct+'%';
var stats;try{stats=JSON.parse(localStorage.getItem('nexus_stats'))||{}}catch(e){stats={}}
stats.played=(stats.played||0)+1;
if(!stats.routing||pct>stats.routing)stats.routing=pct;
try{localStorage.setItem('nexus_stats',JSON.stringify(stats))}catch(e){}
function row(lbl,a,b,unit,dec){return '<tr><th scope="row">'+lbl+'</th><td>'+(unit==='$'?'$'+fmt(a):a.toFixed(dec)+unit)+'</td><td>'+(unit==='$'?'$'+fmt(b):b.toFixed(dec)+unit)+'</td></tr>'}
var exact=u>=o.bestU-1e-9;
var html='<h2>'+(exact?'You matched the optimizer':pct>=90?'Close to the optimizer':'Plan scored')+'</h2>';
html+='<div class="outcome-grade grade-'+grade+'">'+pct+'%</div>';
html+='<p class="outcome-label">of the best plan for your weights</p>';
html+='<table class="rt-compare"><thead><tr><th></th><th scope="col">Yours</th><th scope="col">Optimizer</th></tr></thead><tbody>'+
row('Economic: cost',mine.cost,best.cost,'$',0)+row('Environmental: CO2',mine.co2,best.co2,' kg',0)+row('Social: diesel km in residential areas',mine.ot,best.ot,' km',0)+'</tbody></table>';
html+='<p class="end-summary">The optimizer checked all '+fmt(o.plans.length)+' feasible plans for this scenario; '+o.front.length+' of them are Pareto-optimal (no other plan is better on every pillar). Weights: economic '+Math.round(RT.weights.eco)+', environmental '+Math.round(RT.weights.env)+', social '+Math.round(RT.weights.soc)+'.</p>';
html+='<div class="rt-charts">'+paretoSvg(mine)+sensSvg(sensitivity(mine))+'</div>';
html+='<div class="end-actions"><button class="btn-play" id="rt-show-opt">Show optimizer plan</button>'+(RT.scn<SCENARIOS.length-1?'<button class="btn-secondary" id="rt-next">Next: '+esc(SCENARIOS[RT.scn+1].name)+'</button>':'')+'<button class="btn-secondary" id="rt-csv">Export CSV</button><button class="btn-secondary" id="rt-again">Keep editing</button></div>';
$('#rt-result-content').innerHTML=html;
$('#rt-result').classList.remove('hidden');
$('#rt-show-opt').addEventListener('click',function(){$('#rt-result').classList.add('hidden');RT.showOpt=true;refresh()});
$('#rt-again').addEventListener('click',function(){$('#rt-result').classList.add('hidden')});
$('#rt-csv').addEventListener('click',function(){exportCsv(mine,ev)});
var n=$('#rt-next');if(n)n.addEventListener('click',function(){$('#rt-result').classList.add('hidden');newScenario(RT.scn+1)});
$('#rt-show-opt').focus();
}

function sensitivity(mine){
var o=RT.opt,pts=[],hits=0,mineMatch=null;
for(var a=0;a<=10;a++)for(var b=0;b<=10-a;b++){
var w={eco:a,env:b,soc:10-a-b};
var bu=-1;o.plans.forEach(function(q){var u=utility(q,o.r,w);if(u>bu)bu=u});
var ok=utility(mine,o.r,w)>=bu-1e-9;
if(ok)hits++;
pts.push({w:w,ok:ok});
}
return {pts:pts,hits:hits,n:pts.length};
}
function sensSvg(sn){
var W=260,H=230,P=22;
function xy(w){var x=P+(W-2*P)*(w.env/10+w.soc/20),y=H-P-(H-2*P)*(w.soc/10);return [x,y]}
var s='<figure class="rt-sens"><svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Weight sensitivity: filled dots are weightings where your plan is the best choice">';
var A=xy({eco:10,env:0,soc:0}),B=xy({eco:0,env:10,soc:0}),C=xy({eco:0,env:0,soc:10});
s+='<polygon points="'+A.join(',')+' '+B.join(',')+' '+C.join(',')+'" fill="none" stroke="var(--line-strong)"/>';
sn.pts.forEach(function(p){var c=xy(p.w);s+='<circle cx="'+c[0].toFixed(1)+'" cy="'+c[1].toFixed(1)+'" r="4.2" fill="'+(p.ok?'var(--accent)':'none')+'" stroke="'+(p.ok?'var(--accent)':'var(--line-strong)')+'"/>'});
var me=xy({eco:RT.weights.eco/((RT.weights.eco+RT.weights.env+RT.weights.soc)||1)*10,env:RT.weights.env/((RT.weights.eco+RT.weights.env+RT.weights.soc)||1)*10,soc:RT.weights.soc/((RT.weights.eco+RT.weights.env+RT.weights.soc)||1)*10});
s+='<circle cx="'+me[0].toFixed(1)+'" cy="'+me[1].toFixed(1)+'" r="7.5" fill="none" stroke="var(--text)" stroke-width="1.5"/>';
s+='<text x="'+A[0]+'" y="'+(A[1]+16)+'" class="axis-text" text-anchor="start">Economic</text><text x="'+B[0]+'" y="'+(B[1]+16)+'" class="axis-text" text-anchor="end">Environmental</text><text x="'+C[0]+'" y="'+(C[1]-8)+'" class="axis-text" text-anchor="middle">Social</text>';
s+='</svg><figcaption>Your plan is the best choice for <strong>'+sn.hits+' of '+sn.n+'</strong> weightings (filled). The ring marks your weights; corners put all weight on one pillar.</figcaption></figure>';
return s;
}
function exportCsv(mine,ev){
var rows=[['plan','truck','type','depot','stops','loads','km','hours','cost_usd','co2_kg','urban_diesel_km']];
TRUCKS.forEach(function(t){var p=RT.plan[t.id],r=ev.routes[t.id];if(!p.stops.length)return;rows.push(['yours',t.id,TYPES[t.type].name,p.depot,p.stops.map(function(id){return stopById(id).name}).join(' > '),r.load,r.km.toFixed(1),r.hours.toFixed(2),r.cost.toFixed(0),r.co2.toFixed(1),r.ot.toFixed(2)])});
RT.opt.best.routes.forEach(function(r,i){rows.push(['optimizer','R'+(i+1),TYPES[r.type].name,r.depot,r.stops.map(function(id){return stopById(id).name}).join(' > '),r.ev.load,r.ev.km.toFixed(1),r.ev.hours.toFixed(2),r.ev.cost.toFixed(0),r.ev.co2.toFixed(1),r.ev.ot.toFixed(2)])});
RT.opt.front.forEach(function(q,i){rows.push(['pareto_'+(i+1),'','','','',q.routes.map(function(r){return r.type+'@'+r.depot}).join(' '),'','',q.cost.toFixed(0),q.co2.toFixed(1),q.ot.toFixed(2)])});
var csv=rows.map(function(r){return r.map(function(v){v=String(v);return /[",]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}).join(',')}).join('\n');
var a=document.createElement('a');
a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
a.download='cairn-routing-'+SCENARIOS[RT.scn].name.toLowerCase().replace(/[^a-z]+/g,'-')+'.csv';
document.body.appendChild(a);a.click();
setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500);
}

function paretoSvg(mine){
var o=RT.opt,W=420,H=220,L=48,B=30;
var xs=o.plans.map(function(p){return p.cost}).concat([mine.cost]),ys=o.plans.map(function(p){return p.co2}).concat([mine.co2]);
var x0=Math.min.apply(null,xs),x1=Math.max.apply(null,xs),y0=Math.min.apply(null,ys),y1=Math.max.apply(null,ys);
function X(v){return L+(v-x0)/((x1-x0)||1)*(W-L-12)}
function Y(v){return H-B-(v-y0)/((y1-y0)||1)*(H-B-12)}
var s='<figure class="rt-pareto"><svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Cost against CO2 for every feasible plan, with the Pareto-optimal plans, the optimizer pick and your plan marked">';
s+='<line x1="'+L+'" y1="'+(H-B)+'" x2="'+(W-6)+'" y2="'+(H-B)+'" class="axis-line"/><line x1="'+L+'" y1="8" x2="'+L+'" y2="'+(H-B)+'" class="axis-line"/>';
s+='<text x="'+((W+L)/2)+'" y="'+(H-6)+'" class="axis-text" text-anchor="middle">Cost per day ($'+fmt(x0)+' to $'+fmt(x1)+')</text>';
s+='<text x="12" y="'+((H-B)/2)+'" class="axis-text" text-anchor="middle" transform="rotate(-90,12,'+((H-B)/2)+')">CO2 kg ('+fmt(y0)+' to '+fmt(y1)+')</text>';
o.plans.forEach(function(p){s+='<circle cx="'+X(p.cost).toFixed(1)+'" cy="'+Y(p.co2).toFixed(1)+'" r="2" fill="var(--line-strong)"/>'});
o.front.forEach(function(p){s+='<circle cx="'+X(p.cost).toFixed(1)+'" cy="'+Y(p.co2).toFixed(1)+'" r="3" fill="var(--text-2)"/>'});
s+='<circle cx="'+X(o.best.cost).toFixed(1)+'" cy="'+Y(o.best.co2).toFixed(1)+'" r="6" fill="none" stroke="var(--ok)" stroke-width="2"/>';
s+='<circle cx="'+X(mine.cost).toFixed(1)+'" cy="'+Y(mine.co2).toFixed(1)+'" r="5" fill="var(--accent)" stroke="var(--bg)" stroke-width="1.5"/>';
s+='</svg><figcaption><span><i class="rt-key rt-key-all"></i>feasible plan</span><span><i class="rt-key rt-key-front"></i>Pareto-optimal</span><span><i class="rt-key rt-key-best"></i>optimizer pick</span><span><i class="rt-key rt-key-you"></i>you</span></figcaption></figure>';
return s;
}

function setRegion(i){
RT.reg=i;R=REGIONS[i];DEPOTS=R.depots;SITES=R.sites;URBAN=R.urban;LABEL_POS=R.labels;
TYPES.E.co2=Math.round(1.2*R.grid*(1+0.0183/0.20705))/1000;
var dl=$('#rt-depots');
dl.innerHTML=DEPOTS.map(function(d){return '<label class="rt-dep"><input type="checkbox" id="rt-dep-'+d.id+'"> <span>'+esc(d.short)+'</span> <span class="mono muted">$'+d.fixed+'/day</span></label>'}).join('');
DEPOTS.forEach(function(d){$('#rt-dep-'+d.id).addEventListener('change',function(e){RT.open[d.id]=e.target.checked;refresh()})});
$('#rt-assump').innerHTML='<li>Diesel truck: '+TYPES.D.cap+' loads, $'+TYPES.D.perKm+'/km plus $'+TYPES.D.fixed+'/day, '+TYPES.D.co2+' kg CO2e/km well-to-wheel (DESNZ 2024, HGV all diesel, average laden: 0.873 tank-to-wheel plus 0.212 well-to-tank).</li><li>Electric truck: '+TYPES.E.cap+' loads, '+TYPES.E.range+' km range, $'+TYPES.E.perKm+'/km plus $'+TYPES.E.fixed+'/day, '+TYPES.E.co2+' kg CO2e/km: 1.2 kWh/km (ICCT 2023) at the '+R.gridName+' grid average of '+R.grid+' g CO2e/kWh (Ember 2024) plus 8.8% transmission and distribution losses (DESNZ 2024).</li><li>Road distance is '+ROAD+' times the great-circle distance; '+SPEED+' km/h; '+UNLOAD+' h to unload at each site.</li><li>Shift limit '+MAX_SHIFT+' h. Social score is diesel truck-km in residential areas ('+R.urbanText+'): a leg counts in full between two residential points and half when one end is residential. Electric trucks count zero.</li><li>'+R.source+'</li><li>Site loads are truckloads per day.</li>';
$('#rt-map').setAttribute('aria-label',R.where+' chart with depots, project sites and your truck routes');
$('#rt-map-note').textContent=R.note+' Click a site to add it to the selected truck.';
}

var wired=false;
function wire(){
if(wired)return;wired=true;
['eco','env','soc'].forEach(function(k){
var s=$('#rt-w-'+k);s.value=RT.weights[k];
s.addEventListener('input',function(){RT.weights[k]=+s.value;try{localStorage.setItem('nexus.weights',JSON.stringify(RT.weights))}catch(e){}panel()});
});
$('#rt-score').addEventListener('click',scorePlan);
$('#rt-clear').addEventListener('click',function(){TRUCKS.forEach(function(t){RT.plan[t.id].stops=[]});RT.showOpt=false;refresh()});
$('#rt-back').addEventListener('click',function(){var b=$('.top-nav [data-go=hub]');if(b)b.click()});
$('#rt-help').addEventListener('click',function(){$('#rt-tutorial').classList.remove('hidden')});
$('#rt-tut-close').addEventListener('click',function(){$('#rt-tutorial').classList.add('hidden');try{localStorage.setItem('nexus_routing_tutorial_seen','1')}catch(e){}});
$('#rt-tut-start').addEventListener('click',function(){$('#rt-tutorial').classList.add('hidden');try{localStorage.setItem('nexus_routing_tutorial_seen','1')}catch(e){}});
$$('.rt-scn-btn').forEach(function(b){b.addEventListener('click',function(){newScenario(+b.getAttribute('data-scn'))})});
$$('.rt-reg-btn').forEach(function(b){b.addEventListener('click',function(){setRegion(+b.getAttribute('data-reg'));newScenario(RT.scn)})});
}

window.NexusRouting={
open:function(){
RT.weights=loadW();
wire();
if(!RT.ready)setRegion(RT.reg);
['eco','env','soc'].forEach(function(k){$('#rt-w-'+k).value=RT.weights[k]});
newScenario(RT.ready?RT.scn:0);
var seen=false;try{seen=localStorage.getItem('nexus_routing_tutorial_seen')}catch(e){}
if(!seen)$('#rt-tutorial').classList.remove('hidden');
},
stats:function(i){var keep={scn:RT.scn,trucks:TRUCKS,stops:RT.stops};RT.scn=i;TRUCKS=BASE_FLEET.concat(SCENARIOS[i].extra||[]);buildStops();var pl=enumeratePlans();var out={plans:pl.length,front:pareto(pl).length};RT.scn=keep.scn;TRUCKS=keep.trucks;RT.stops=keep.stops;return out}
};

})();
