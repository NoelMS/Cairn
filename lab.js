(function(){

var DATA=window.DASHBOARD_DATA;
if(!DATA)return;
var SVG_NS='http:'+'/'+'/www.w3.org/2000/svg';
function $(s,c){return (c||document).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
function fmt(n){return Math.round(n).toLocaleString('en-US')}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function musd(v){return '$'+fmt(v/1e6)+'M'}
function kt(v){return fmt(v/1000)+' kt'}
function signed(v,f){return (v>0?'+':v<0?'-':'')+f(Math.abs(v))}

var MODES=[['road_diesel','Diesel HGV'],['road_bev','Battery electric HGV'],['rail','Freight rail'],['sea_container','Container ship']];
var REGIONS=['UAE','Middle East','Europe','Asia Pacific','Americas','Africa'];
var PRESETS=[
{name:'Red Sea closure',s:{red_sea_closed:true}},
{name:'Hormuz closure',s:{hormuz_closed:true}},
{name:'Asian module shock',s:{disabled_suppliers:['SUP_JINKO','SUP_LONGI','SUP_TRINA','SUP_ADANI']}},
{name:'Forced-labour screen',s:{disabled_suppliers:['SUP_JINKO','SUP_LONGI','SUP_TRINA']}},
{name:'Carbon price $100/t',s:{carbon_price:100}},
{name:'Gulf demand +30%',s:{demand_scale:{'UAE':1.3,'Middle East':1.3}}},
{name:'No electric trucks',s:{disabled_modes:['road_bev']}}
];
function blank(){return {disabled_suppliers:[],disabled_modes:[],demand_scale:{},carbon_price:0,red_sea_closed:false,hormuz_closed:false}}
function loadW(){try{var w=JSON.parse(localStorage.getItem('nexus.weights'));if(w&&w.eco+w.env+w.soc>0)return w}catch(e){}return {eco:34,env:33,soc:33}}
function loadSaved(){try{return JSON.parse(localStorage.getItem('nexus.lab.saved'))||[]}catch(e){return []}}
function storeSaved(){try{localStorage.setItem('nexus.lab.saved',JSON.stringify(L.saved))}catch(e){}}
var L={sc:blank(),weights:loadW(),view:'cheapest',res:null,busy:false,name:'Baseline',saved:loadSaved(),stoch:false};
var live=/^https?:$/.test(location.protocol);

function status(msg){$('#lab-status').textContent=msg}
function changed(name){L.name=name||'Custom scenario';$('#lab-scn-name').textContent=L.name;status('Scenario changed. Press Solve to re-run the model.')}

function controls(){
$('#lab-presets').innerHTML=PRESETS.map(function(p,i){return '<button class="rt-chip" data-p="'+i+'">'+esc(p.name)+'</button>'}).join('');
$('#lab-demand').innerHTML=REGIONS.map(function(r,i){return '<label for="lab-d-'+i+'">'+esc(r)+'</label><input type="range" id="lab-d-'+i+'" data-r="'+esc(r)+'" min="50" max="200" step="5"><span class="mono" id="lab-d-'+i+'-v"></span>'}).join('');
$('#lab-modes').innerHTML=MODES.map(function(m){return '<label class="rt-dep"><input type="checkbox" data-m="'+m[0]+'"> <span>'+m[1]+'</span></label>'}).join('');
var cats=DATA.categories||[];
$('#lab-sups').innerHTML=cats.map(function(c){
var rows=DATA.suppliers.filter(function(s){return s.category===c});
return '<p class="lab-cat">'+esc(c)+'</p>'+rows.map(function(s){return '<label class="rt-dep"><input type="checkbox" data-s="'+esc(s.id)+'"> <span>'+esc(s.name)+'</span> <span class="mono muted">'+esc(s.country)+'</span></label>'}).join('');
}).join('');
}

function sync(){
var sc=L.sc;
['eco','env','soc'].forEach(function(k){$('#lab-w-'+k).value=L.weights[k];$('#lab-w-'+k+'-v').textContent=L.weights[k]});
$('#lab-carbon').value=sc.carbon_price;$('#lab-carbon-v').textContent='$'+sc.carbon_price+'/t';
$$('#lab-demand input').forEach(function(el){var v=Math.round(100*(sc.demand_scale[el.getAttribute('data-r')]||1));el.value=v;$('#'+el.id+'-v').textContent=v+'%'});
$$('#lab-modes input').forEach(function(el){el.checked=sc.disabled_modes.indexOf(el.getAttribute('data-m'))<0});
$$('#lab-sups input').forEach(function(el){el.checked=sc.disabled_suppliers.indexOf(el.getAttribute('data-s'))<0});
$('#lab-red').checked=sc.red_sea_closed;$('#lab-hormuz').checked=sc.hormuz_closed;
$('#lab-stoch').checked=L.stoch;
}

function wire(){
controls();
$$('#lab-presets .rt-chip').forEach(function(b){b.addEventListener('click',function(){
var p=PRESETS[+b.getAttribute('data-p')];
L.sc=Object.assign(blank(),JSON.parse(JSON.stringify(p.s)));
sync();changed(p.name);solve();
})});
['eco','env','soc'].forEach(function(k){$('#lab-w-'+k).addEventListener('input',function(e){
L.weights[k]=+e.target.value;$('#lab-w-'+k+'-v').textContent=L.weights[k];
try{localStorage.setItem('nexus.weights',JSON.stringify(L.weights))}catch(err){}
status('Weights changed. Press Solve to pick the balanced plan again.');
})});
$('#lab-carbon').addEventListener('input',function(e){L.sc.carbon_price=+e.target.value;$('#lab-carbon-v').textContent='$'+L.sc.carbon_price+'/t';changed()});
$$('#lab-demand input').forEach(function(el){el.addEventListener('input',function(){
var r=el.getAttribute('data-r'),v=+el.value;$('#'+el.id+'-v').textContent=v+'%';
if(v===100)delete L.sc.demand_scale[r];else L.sc.demand_scale[r]=v/100;changed();
})});
$$('#lab-modes input').forEach(function(el){el.addEventListener('change',function(){
var m=el.getAttribute('data-m');L.sc.disabled_modes=L.sc.disabled_modes.filter(function(x){return x!==m});if(!el.checked)L.sc.disabled_modes.push(m);changed();
})});
$$('#lab-sups input').forEach(function(el){el.addEventListener('change',function(){
var s=el.getAttribute('data-s');L.sc.disabled_suppliers=L.sc.disabled_suppliers.filter(function(x){return x!==s});if(!el.checked)L.sc.disabled_suppliers.push(s);changed();
})});
$('#lab-red').addEventListener('change',function(e){L.sc.red_sea_closed=e.target.checked;changed()});
$('#lab-hormuz').addEventListener('change',function(e){L.sc.hormuz_closed=e.target.checked;changed()});
$('#lab-stoch').addEventListener('change',function(e){L.stoch=e.target.checked;status(L.stoch?'Plan under uncertainty is on: the next solve adds a 20 scenario stochastic run.':'Plan under uncertainty is off.')});
$('#lab-solve').addEventListener('click',solve);
$('#lab-reset').addEventListener('click',function(){L.sc=blank();sync();L.name='Baseline';$('#lab-scn-name').textContent=L.name;solve()});
$$('.lab-view-btn').forEach(function(b){b.addEventListener('click',function(){L.view=b.getAttribute('data-v');render()})});
$('#lab-save').addEventListener('click',save);
$('#lab-csv').addEventListener('click',csv);
$('#lab-back').addEventListener('click',function(){var b=$('.top-nav [data-go=hub]');if(b)b.click()});
$('#lab-help').addEventListener('click',function(){$('#lab-tutorial').classList.remove('hidden')});
['#lab-tut-close','#lab-tut-start'].forEach(function(id){$(id).addEventListener('click',function(){$('#lab-tutorial').classList.add('hidden');try{localStorage.setItem('nexus_lab_tutorial_seen','1')}catch(e){}})});
$('#lab-saved').addEventListener('click',function(e){var b=e.target.closest('[data-del]');if(!b)return;L.saved.splice(+b.getAttribute('data-del'),1);storeSaved();renderSaved()});
}

function solve(){
if(!live||L.busy)return;
L.busy=true;
var btn=$('#lab-solve');btn.disabled=true;btn.textContent='Solving';
$('#lab-results').setAttribute('aria-busy','true');
status(L.stoch?'Solving the trade-off front and the stochastic model, about 10 seconds.':'Solving the trade-off front, about 2 seconds.');
var w=L.weights,tot=w.eco+w.env+w.soc||1;
fetch('api/solve',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({scenario:L.sc,weights:{cost:w.eco/tot,co2:w.env/tot,social:w.soc/tot},stochastic:L.stoch})})
.then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j.error||('HTTP '+r.status));return j})})
.then(function(j){
L.res=j;render();
var n=(j.front||[]).length;status('Solved: '+n+' efficient plans on the front.');
var st;try{st=JSON.parse(localStorage.getItem('nexus_stats'))||{}}catch(e){st={}}
st.lab=(st.lab||0)+1;try{localStorage.setItem('nexus_stats',JSON.stringify(st))}catch(e){}
})
.catch(function(e){status('The model could not be solved: '+e.message)})
.then(function(){L.busy=false;btn.disabled=false;btn.textContent='Solve';$('#lab-results').removeAttribute('aria-busy')});
}

function el(tag,attrs,parent,text){var e=document.createElementNS(SVG_NS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(text!=null)e.textContent=text;if(parent)parent.appendChild(e);return e}

function chart(){
var svg=$('#lab-front');svg.innerHTML='';
var r=L.res,v=r.views[L.view],W=560,H=300,P={l:64,r:16,t:16,b:44};
var all=r.baseline_front.concat(r.front);
var xs=all.map(function(p){return p.co2}),ys=all.map(function(p){return p.cost});
var x0=Math.min.apply(null,xs),x1=Math.max.apply(null,xs),y0=Math.min.apply(null,ys),y1=Math.max.apply(null,ys);
var dx=(x1-x0)||x1*0.01||1,dy=(y1-y0)||y1*0.01||1;x0-=dx*0.06;x1+=dx*0.06;y0-=dy*0.08;y1+=dy*0.08;
function X(v){return P.l+(v-x0)/(x1-x0)*(W-P.l-P.r)}
function Y(v){return H-P.b-(v-y0)/(y1-y0)*(H-P.t-P.b)}
for(var i=0;i<=4;i++){
var yv=y0+(y1-y0)*i/4,xv=x0+(x1-x0)*i/4;
el('line',{x1:P.l,x2:W-P.r,y1:Y(yv),y2:Y(yv),class:'grid-line'},svg);
el('text',{x:P.l-8,y:Y(yv)+4,'text-anchor':'end',class:'axis-text'},svg,'$'+(yv/1e9).toFixed(2)+'bn');
el('text',{x:X(xv),y:H-P.b+18,'text-anchor':'middle',class:'axis-text'},svg,(xv/1e6).toFixed(2));
}
el('text',{x:(P.l+W-P.r)/2,y:H-6,'text-anchor':'middle',class:'axis-text'},svg,'CO2e, million tonnes a year');
function series(pts,cls,pick){
el('polyline',{points:pts.map(function(p){return X(p.co2)+','+Y(p.cost)}).join(' '),class:'lab-line '+cls},svg);
pts.forEach(function(p,i){
var c=el('circle',{cx:X(p.co2),cy:Y(p.cost),r:i===pick?6:3.5,class:'lab-dot '+cls+(i===pick?' is-pick':'')},svg);
el('title',{},c,p.strategy+': '+musd(p.cost)+', '+kt(p.co2)+' CO2e, social '+p.social.toFixed(3));
});
}
series(r.baseline_front,'base',v.baseline_index);
series(r.front,'scn',v.result_index);
}

function kpis(){
var v=L.res.views[L.view],k=v.result.kpi,d=v.delta;
$('#lab-hud-cost').textContent=musd(k.cost);$('#lab-hud-co2').textContent=kt(k.co2);$('#lab-hud-soc').textContent=k.social.toFixed(3);
function item(label,val,delta,good){return '<div><dt>'+label+'</dt><dd class="mono">'+val+(delta!=null?' <span class="lab-d '+(good===null?'':good?'is-good':'is-bad')+'">'+delta+'</span>':'')+'</dd></div>'}
var html=item('Cost a year',musd(k.cost),signed(d.cost,musd),d.cost===0?null:d.cost<0)
+item('CO2e a year',kt(k.co2),signed(d.co2,kt),Math.abs(d.co2)<1?null:d.co2<0)
+item('Social score',k.social.toFixed(3),(d.social>=0?'+':'')+d.social.toFixed(3),Math.abs(d.social)<0.0005?null:d.social>0)
+item('Cost of CO2e avoided',d.usd_per_t_avoided!=null?'$'+fmt(d.usd_per_t_avoided)+'/t':'n/a',null)
+item('Unmet demand',fmt(k.unmet_t)+' t',null);
if(k.carbon_cost)html+=item('Carbon charge',musd(k.carbon_cost),null);
$('#lab-kpis').innerHTML=html;
var warn='';
if(!d.like_for_like)warn='<p class="lab-warn" role="note">'+fmt(d.unmet_t)+' t a year of demand cannot be met in this scenario, so cost and CO2e are not like for like with the baseline. Most affected: '+Object.keys(k.unmet_by_hub).slice(0,3).map(esc).join(', ')+'.</p>';
$('#lab-changes').innerHTML=warn+'<ul>'+d.changes.map(function(c){return '<li>'+esc(c)+'</li>'}).join('')+'</ul>';
$('#lab-pillars').innerHTML='<thead><tr><th scope="col">Pillar</th><th scope="col" class="num">Scenario</th><th scope="col" class="num">Baseline</th></tr></thead><tbody>'+v.result.pillars.map(function(p,i){return '<tr><th scope="row">'+p.pillar+'</th><td class="num">'+p.score.toFixed(0)+'</td><td class="num">'+v.baseline.pillars[i].score.toFixed(0)+'</td></tr>'}).join('')+'</tbody>';
var rows=v.result.allocation;
$('#lab-alloc').innerHTML='<thead><tr><th scope="col">Corridor</th><th scope="col">Product</th><th scope="col">Mode</th><th scope="col" class="num">t a year</th><th scope="col" class="num">Freight kg CO2e/t</th></tr></thead><tbody>'+rows.map(function(a){return '<tr><th scope="row">'+esc(a.corridor)+'</th><td>'+esc(a.commodity)+'</td><td>'+esc(a.mode.split(' with ')[0])+'</td><td class="num">'+fmt(a.flow_tons)+'</td><td class="num">'+fmt(a.co2_kg_per_t)+'</td></tr>'}).join('')+'</tbody>';
$('#lab-alloc-n').textContent=rows.length+' corridors';
}

function risk(){
var box=$('#lab-risk'),r=L.res.risk;
if(!r){box.hidden=true;return}
box.hidden=false;
$('#lab-risk-kpis').innerHTML=[['Expected cost, robust plan',musd(r.rp_expected_cost)],['Expected cost, mean-demand plan',musd(r.eev_expected_cost)],['Value of the stochastic solution',musd(r.vss)],['Worst 10% average cost (CVaR 90)',musd(r.rp_cvar90)]].map(function(k){return '<div><dt>'+k[0]+'</dt><dd class="mono">'+k[1]+'</dd></div>'}).join('');
var svg=$('#lab-hist');svg.innerHTML='';
var all=r.rp_costs.concat(r.ev_costs),lo=Math.min.apply(null,all),hi=Math.max.apply(null,all),B=10,W=560,H=160,step=(hi-lo)/B||1;
function bins(a){var b=new Array(B).fill(0);a.forEach(function(c){b[Math.min(B-1,Math.floor((c-lo)/step))]++});return b}
var br=bins(r.rp_costs),be=bins(r.ev_costs),top=Math.max.apply(null,br.concat(be))||1,bw=(W-20)/B;
for(var i=0;i<B;i++){
el('rect',{x:10+i*bw+2,y:H-24-be[i]/top*(H-40),width:bw/2-3,height:be[i]/top*(H-40),class:'lab-bar ev'},svg);
el('rect',{x:10+i*bw+bw/2,y:H-24-br[i]/top*(H-40),width:bw/2-3,height:br[i]/top*(H-40),class:'lab-bar rp'},svg);
}
var cx=10+(r.rp_cvar90-lo)/step*bw;
el('line',{x1:cx,x2:cx,y1:8,y2:H-24,class:'lab-cvar'},svg);
el('text',{x:Math.min(cx+4,W-90),y:16,class:'axis-text'},svg,'CVaR 90');
el('text',{x:10,y:H-6,class:'axis-text'},svg,'$'+(lo/1e9).toFixed(1)+'bn');
el('text',{x:W-10,y:H-6,'text-anchor':'end',class:'axis-text'},svg,'$'+(hi/1e9).toFixed(1)+'bn');
var hubs=Object.keys(r.rp_unmet_prob_by_hub).slice(0,5);
$('#lab-risk-hubs').innerHTML=hubs.length?hubs.map(function(h){return '<li>'+esc(h)+' <span class="mono">'+Math.round(100*r.rp_unmet_prob_by_hub[h])+'% of scenarios short</span></li>'}).join(''):'<li>No project is short in any sampled scenario.</li>';
}

function render(){
if(!L.res)return;
$$('.lab-view-btn').forEach(function(b){b.classList.toggle('is-on',b.getAttribute('data-v')===L.view);b.setAttribute('aria-pressed',b.getAttribute('data-v')===L.view?'true':'false')});
$('#lab-empty').hidden=true;$('#lab-out').hidden=false;
chart();kpis();risk();renderSaved();
}

function save(){
if(!L.res)return;
var name=($('#lab-save-name').value||L.name).trim().slice(0,40)||'Scenario';
var k=L.res.views[L.view].result.kpi;
L.saved.unshift({name:name,view:L.view,cost:k.cost,co2:k.co2,social:k.social,unmet:k.unmet_t,suppliers:k.suppliers.length});
L.saved=L.saved.slice(0,12);storeSaved();renderSaved();$('#lab-save-name').value='';
status('Saved "'+name+'".');
}

function renderSaved(){
var t=$('#lab-saved');
if(!L.saved.length){t.innerHTML='<tbody><tr><td>No saved scenarios yet. Solve one and press Save.</td></tr></tbody>';return}
var b=L.res?L.res.views.cheapest.baseline.kpi:null;
t.innerHTML='<thead><tr><th scope="col">Scenario</th><th scope="col">Plan</th><th scope="col" class="num">Cost</th><th scope="col" class="num">CO2e</th><th scope="col" class="num">Social</th><th scope="col" class="num">Unmet t</th><th scope="col" class="num">Suppliers</th><th scope="col"><span class="sr-only">Delete</span></th></tr></thead><tbody>'
+(b?'<tr class="is-current"><th scope="row">Baseline</th><td>Cheapest</td><td class="num">'+musd(b.cost)+'</td><td class="num">'+kt(b.co2)+'</td><td class="num">'+b.social.toFixed(3)+'</td><td class="num">'+fmt(b.unmet_t)+'</td><td class="num">'+b.suppliers.length+'</td><td></td></tr>':'')
+L.saved.map(function(s,i){return '<tr><th scope="row">'+esc(s.name)+'</th><td>'+(s.view==='cheapest'?'Cheapest':'Balanced')+'</td><td class="num">'+musd(s.cost)+'</td><td class="num">'+kt(s.co2)+'</td><td class="num">'+s.social.toFixed(3)+'</td><td class="num">'+fmt(s.unmet)+'</td><td class="num">'+s.suppliers+'</td><td><button class="btn-secondary" data-del="'+i+'" aria-label="Delete '+esc(s.name)+'">Delete</button></td></tr>'}).join('')+'</tbody>';
}

function csv(){
if(!L.res)return;
var rows=[['corridor','product','mode','tonnes_per_year','freight_kg_co2e_per_t','transport_usd_per_t']].concat(L.res.views[L.view].result.allocation.map(function(a){return [a.corridor,a.commodity,a.mode,a.flow_tons,a.co2_kg_per_t,a.transport_usd_per_t]}));
var text=rows.map(function(r){return r.map(function(c){c=String(c);return /[",\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c}).join(',')}).join('\n');
var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/csv'}));a.download='cairn-'+L.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.csv';
document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},0);
}

var wired=false;
window.NexusLab={
open:function(){
if(!wired){wired=true;wire()}
L.weights=loadW();sync();renderSaved();
if(!live){$('#lab-offline').hidden=false;$('#lab-solve').disabled=true;status('');}
else if(!L.res)solve();
var seen=false;try{seen=localStorage.getItem('nexus_lab_tutorial_seen')}catch(e){}
if(!seen)$('#lab-tutorial').classList.remove('hidden');
}
};

})();
