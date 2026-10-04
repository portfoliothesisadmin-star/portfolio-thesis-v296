     const cells=[...el.querySelectorAll('.pt150-security-grid div')].map(d=>({k:(d.querySelector('small')?.textContent||'').trim(),v:(d.querySelector('strong')?.textContent||'').trim()}));
     const get=k=>cells.find(x=>x.k.toLowerCase().includes(k))?.v||'—';
     const live=perfFor(t); return {t,wt,m1:live.m1!=null?fmt(live.m1):get('1 month'),ytd:live.ytd!=null?fmt(live.ytd):get('ytd'),holdings:get('holdings'),top10:get('top 10'),asof:(el.querySelector('p')?.textContent||'').replace(/^Evidence (shown from available observations )?through\s*/i,'').replace(/\.$/,'')};
   }).filter(x=>x.t);
   if(!securities.length)return;
   const cards=securities.map(x=>{
     const ov=overlapFor(x.t), other=ov?(ov.a===x.t?ov.b:ov.a):null;
     const hc=numText(x.holdings), t10=numText(x.top10);
     const diversification=hc==null?'Unresolved':hc>1000?'Broad ownership':'More targeted';
     const conc=t10==null?'Unresolved':t10>25?'Top-heavy':'More distributed';
     return `<div class="pt159-card"><div class="pt159-head"><div><small>PORTFOLIO THESIS / FUND SCORECARD</small><b>${esc(x.t)}</b><span>${esc(x.wt)}</span></div><div class="pt159-role"><small>CURRENT ROLE</small><strong>${esc(role(x.t))}</strong></div></div><table class="pt159-table"><thead><tr><th>COMPONENT</th><th>CURRENT READING</th><th>READ</th></tr></thead><tbody><tr><td>Performance</td><td>1M ${esc(x.m1)} · YTD ${esc(x.ytd)}</td><td>${x.m1==='—'&&x.ytd==='—'?'Unresolved':'Observed'}</td></tr><tr><td>Underlying diversification</td><td>${esc(x.holdings)} holdings</td><td>${diversification}</td></tr><tr><td>10 largest holdings</td><td>${t10==null?'—':esc(x.top10)}</td><td>${conc}</td></tr><tr><td>Fund interaction</td><td>${ov?`${esc(ov.ov)} with ${esc(other)}`:'—'}</td><td>${ov?`${esc(ov.shared)} shared holdings`:'Unresolved'}</td></tr><tr><td>Portfolio role</td><td>${esc(role(x.t))}</td><td>${x.t==='VTI'||x.t==='VXUS'?'Foundation':'Deliberate tilt'}</td></tr></tbody></table><div class="pt159-thesis pt159-section"><small>THE THESIS</small><b>${esc(thesis(x.t))}</b></div><div class="pt159-two"><div class="pt159-section"><small>SUPPORTS THE THESIS</small><p>${supportText(x.t,hc,t10,ov,other)}</p></div><div class="pt159-section"><small>CHALLENGES THE THESIS</small><p>${esc(challenge(x.t))}</p></div></div><div class="pt159-bottom pt159-section"><small>WHAT WOULD CHANGE OUR VIEW</small><p>A material change in underlying diversification, largest-holding concentration, overlap, factor distinctness, or the evidence supporting this fund's assigned job.</p><small>EVIDENCE SNAPSHOT</small><p>${x.asof?`Constituent evidence through ${esc(x.asof)}. `:''}Missing measurements remain unresolved rather than estimated.</p></div></div>`;
   }).join('');
   const foot=page.querySelector('.pt150-foot')?.outerHTML||'';
   page.innerHTML=`<div class="pt150-k">FUND SCORECARDS</div><h2>Evidence by holding.</h2><p class="pt150-deck">Each fund is tested against the job it performs in the portfolio. The scorecard separates observed evidence from unresolved measurements.</p>${cards}${foot}`;
 }
 window.ptGeneratePortfolioPublication=async function(){
   const out=await prior.apply(this,arguments);
   patchPerformanceTable();
   replaceScorecardPage();
   return out;
 };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


/* V167 — FINAL override. Must load after V159/V152, which were replacing the generator after earlier performance fixes. */
(function(){
 const prior=window.ptGeneratePortfolioPublication;
 const N=v=>{if(v===null||v===undefined||v===''||v===false)return null;const n=Number(v);return Number.isFinite(n)?n:null};
 const fmt=v=>v==null?'—':`${v>=0?'+':''}${v.toFixed(2)}%`;
 function deepPeriod(root,aliases){let found=null,seen=new Set();function rec(o){if(found!=null||!o||typeof o!=='object'||seen.has(o))return;seen.add(o);for(const a of aliases){const x=o[a];if(x!==undefined){for(const v of [x?.returnPct,x?.pct,o[a+'Pct'],x?.return,x]){const n=N(v);if(n!=null){found=n;return}}}}for(const v of Object.values(o))rec(v)}rec(root);return found}
 function tickerOf(o){return String(o?.ticker||o?.symbol||o?.security?.ticker||o?.security?.symbol||'').toUpperCase()}
 function extract(root){const out={},seen=new Set();function rec(o){if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);if(!Array.isArray(o)){const t=tickerOf(o);if(t){const v={m1:deepPeriod(o,['oneMonth','1m','month1']),m3:deepPeriod(o,['threeMonth','3m','month3']),ytd:deepPeriod(o,['ytd','YTD']),y1:deepPeriod(o,['oneYear','1y','year1'])};if(Object.values(v).some(x=>x!=null))out[t]=Object.assign(out[t]||{},v)}}for(const v of Object.values(o))rec(v)}rec(root);return out}
 async function fetchPerf(tickers){try{const r=await window.ptSupabase.functions.invoke('security-performance',{body:{tickers}});if(r?.error)throw r.error;return r?.data||null}catch(e){console.warn('V167 security-performance',e);return null}}
 function patch(map,p){
  const page=[...document.querySelectorAll('.pt150-page')].find(x=>/What moved the portfolio\./i.test(x.textContent||''));
  const table=page?.querySelector('.pt150-table');let sums={m1:0,m3:0,ytd:0,y1:0},counts={m1:0,m3:0,ytd:0,y1:0};
  if(table){for(const tr of table.querySelectorAll('tbody tr')){const td=[...tr.children];if(td.length<7)continue;const t=(td[0].textContent||'').trim().toUpperCase();if(t==='PORTFOLIO')continue;const h=p.find(x=>x.ticker===t),v=map[t]||{},w=h?.weight||0;td[2].textContent=fmt(v.m1);td[3].textContent=fmt(v.m3);td[4].textContent=fmt(v.ytd);td[5].textContent=fmt(v.y1);td[6].textContent=v.m1==null?'—':`${v.m1*w/100>=0?'+':''}${(v.m1*w/100).toFixed(2)} pts`;for(const k of ['m1','m3','ytd','y1'])if(v[k]!=null){sums[k]+=v[k]*w/100;counts[k]++}}
   const total=[...table.querySelectorAll('tbody tr')].find(tr=>(tr.children[0]?.textContent||'').trim().toUpperCase()==='PORTFOLIO');if(total){const td=[...total.children];for(const [i,k] of [[2,'m1'],[3,'m3'],[4,'ytd'],[5,'y1']])td[i].textContent=counts[k]?fmt(sums[k]):'—';td[6].textContent=counts.m1?`${sums.m1>=0?'+':''}${sums.m1.toFixed(2)} pts`:'—'}
  }
  for(const card of document.querySelectorAll('.pt159-card')){const t=(card.querySelector('.pt159-head b')?.textContent||'').trim().toUpperCase(),v=map[t];if(!v)continue;const row=[...card.querySelectorAll('.pt159-table tbody tr')].find(r=>(r.children[0]?.textContent||'').trim()==='Performance');if(row){row.children[1].textContent=`1M ${fmt(v.m1)} · YTD ${fmt(v.ytd)}`;row.children[2].textContent=(v.m1!=null||v.ytd!=null)?'Observed':'Unresolved'}}
 }
 window.ptGeneratePortfolioPublication=async function(){
   const result=await prior.apply(this,arguments);
   const p=(typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:String(x.ticker||'').toUpperCase(),weight:N(x.weight)||0})).filter(x=>x.ticker&&x.weight>0);
   if(!p.length)return result;
   let map=extract(window.__pt151?.securityPerf);
   if(p.some(x=>!map[x.ticker])){const raw=await fetchPerf(p.map(x=>x.ticker));window.__pt166RawPerformance=raw;map=Object.assign(map,extract(raw))}
   window.__pt166Performance=map;patch(map,p);return result;
 };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 function apply(){
   /* Shorter header so the contribution column remains visible on mobile. */
   const page=[...document.querySelectorAll('.pt150-page')].find(x=>/What moved the portfolio\./i.test(x.textContent||''));
   const table=page?.querySelector('.pt150-table');
   if(table){
     const h=table.querySelector('thead tr th:nth-child(7)');
     if(h)h.innerHTML='1M<br>CONTRIB.';
   }
   /* Put scorecard performance periods on separate lines. */
   for(const card of document.querySelectorAll('.pt159-card')){
     const row=[...card.querySelectorAll('.pt159-table tbody tr')].find(r=>(r.children[0]?.textContent||'').trim()==='Performance');
     if(!row||!row.children[1])continue;
     const txt=(row.children[1].textContent||'').trim();
     const m=txt.match(/1M\s+([^·]+)\s*·\s*YTD\s+(.+)/i);
     if(m)row.children[1].innerHTML=`<span class="pt159-perf-reading"><span>1M ${m[1].trim()}</span><span>YTD ${m[2].trim()}</span></span>`;
   }
 }
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);apply();return r};
 setTimeout(apply,0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const num=t=>{const m=String(t||'').replace(/,/g,'').match(/[-+]?\d+(?:\.\d+)?/);return m?Number(m[0]):null};
 function allocation(){
   const p=(typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:String(x.ticker||'').toUpperCase(),weight:Number(x.weight)||0})).filter(x=>x.ticker&&x.weight>0);
   document.querySelectorAll('.pt150-alloc').forEach(bar=>{
     const kids=[...bar.children]; kids.forEach((d,i)=>{const x=p[i];if(!x)return;d.innerHTML=`<span class="pt169-alloc-ticker">${x.ticker}</span><span class="pt169-alloc-weight">${x.weight.toFixed(0)}%</span>`});
   });
   document.querySelectorAll('.pt150-legend').forEach(x=>x.remove());
 }
 function contribution(){
   const page=[...document.querySelectorAll('.pt150-page')].find(x=>/What moved the portfolio\./i.test(x.textContent||''));
   const table=page?.querySelector('.pt150-table'); if(!table)return;
   if(page.querySelector('.pt169-impact'))return;
   const rows=[...table.querySelectorAll('tbody tr')]; const data=[]; let total=null;
   rows.forEach(tr=>{const td=[...tr.children];if(td.length<7)return;const t=(td[0].textContent||'').trim();const v=num(td[6].textContent);if(t.toUpperCase()==='PORTFOLIO')total=v;else if(v!=null)data.push({t,v})});
   /* Remove contribution column from the dense performance table. */
   table.querySelectorAll('tr').forEach(tr=>{if(tr.children.length>=7)tr.children[6].remove()});
   if(!data.length)return;
   const max=Math.max(...data.map(x=>Math.abs(x.v)),.01);
   const impact=document.createElement('div');impact.className='pt169-impact';
   impact.innerHTML=`<div class="pt169-impact-head"><div><small>ALLOCATION × PERFORMANCE</small><b>1-Month Portfolio Impact</b></div><div class="pt169-impact-total"><span>Portfolio</span><strong>${total==null?'—':`${total>=0?'+':''}${total.toFixed(2)}%`}</strong></div></div>
   <div>${data.map(x=>`<div class="pt169-impact-row"><span>${x.t}</span><div class="pt169-impact-track"><div class="pt169-impact-bar" style="width:${Math.max(4,Math.abs(x.v)/max*100).toFixed(1)}%"></div></div><span class="pt169-impact-value">${x.v>=0?'+':''}${x.v.toFixed(2)} pts</span></div>`).join('')}</div>
   <p class="pt169-impact-note"><b>How to read this:</b> Portfolio impact combines each fund's return with its allocation. A larger move in a smaller sleeve can affect the portfolio about as much as a smaller move in a larger holding.</p>`;
   table.insertAdjacentElement('afterend',impact);
 }
 function apply(){allocation();contribution()}
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);apply();return r};
 setTimeout(apply,0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
const TERMS=[
