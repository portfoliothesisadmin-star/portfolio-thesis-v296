   if(top10==null&&ten.length===10&&ten.every(x=>x.weight!=null))top10=ten.reduce((a,x)=>a+x.weight,0);
   if(top&&top10!=null){
    top.children[1].textContent=`${top10.toFixed(2)}%`;
    top.children[2].textContent=top10>25?'Top-heavy':'More distributed';
    if(ten.length){const d=document.createElement('span');d.className='pt270-topnames';d.innerHTML=ten.map(x=>`${esc(x.ticker||x.name)}${x.weight!=null?` ${x.weight.toFixed(2)}%`:''}`).join(' · ');top.children[1].appendChild(d)}
   }
   const sections=[...card.querySelectorAll('.pt159-section')];
   const ev=sections.find(x=>/EVIDENCE FOR|SUPPORTS/i.test(clean(x.querySelector('small')?.textContent)));
   const ag=sections.find(x=>/EVIDENCE AGAINST|CHALLENGES/i.test(clean(x.querySelector('small')?.textContent)));
   if(ev){const p=ev.querySelector('p');if(p&&f.count!=null){
     if(t==='VTI')p.textContent=`VTI spreads the U.S. core across ${Number(f.count).toLocaleString()} measured underlying holdings. That breadth of underlying ownership directly supports its job as the domestic market foundation.`;
     else if(t==='VOO')p.textContent=`VOO contains ${Number(f.count).toLocaleString()} measured underlying holdings and is designed to represent the large-cap U.S. market through the S&P 500. That directly supports its assigned role as a transparent source of large-company U.S. exposure.`;
   }}
   if(ag&&top10!=null){const p=ag.querySelector('p');if(p){
     if(t==='VTI')p.textContent=`The strongest structural tension is weighting concentration: the 10 largest holdings account for ${top10.toFixed(2)}%. A broad security count therefore does not guarantee evenly distributed economic exposure.`;
     else if(t==='VOO')p.textContent=`VOO is not a total-market fund. With ${top10.toFixed(2)}% in its 10 largest holdings, market-cap weighting can make results unusually dependent on the largest U.S. companies. If another broad U.S. fund is already owned, overlap can also make the sleeve additive in ticker count without adding much new economic exposure.`;
   }}
   const snap=sections.find(x=>/EVIDENCE SNAPSHOT/i.test(clean(x.querySelector('small')?.textContent)));
   if(snap&&f.period){const p=snap.querySelector('p');if(p)p.textContent=`Constituent evidence through ${f.period}. Structural measurements are populated only from verified stored constituent data; unavailable measurements remain unresolved.`}
  });
 }
 window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);patch();setTimeout(patch,500);return r};
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior!=='function')return;
 const N=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(String(v).replace('%','').replace(/,/g,''));return Number.isFinite(n)?n:null};
 const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
 function walk(o,fn,seen=new Set()){if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);fn(o);if(Array.isArray(o))o.forEach(x=>walk(x,fn,seen));else Object.values(o).forEach(x=>walk(x,fn,seen))}
 function backendFunds(){
   const out=new Map(),root=window.__ptVerifiedPortfolioLookthrough;
   walk(root,o=>{
     const t=String(o.ticker||o.symbol||'').trim().toUpperCase();
     if(!/^[A-Z][A-Z0-9.-]{0,9}$/.test(t))return;
     const count=N(o.usableTickerCount??o.holdingsCount??o.holdings_count??o.rawHoldingCount??o.raw_holdings_count);
     const top10=N(o.top10Weight??o.top10_weight??o.top10WeightPct??o.topTenWeight??o.topTenWeightPct);
     const period=o.reportPeriod||o.report_period||o.asOf||o.as_of||null;
     const old=out.get(t)||{};
     if(count!=null||top10!=null||period)out.set(t,{...old,count:count??old.count,top10:top10??old.top10,period:period||old.period});
   });
   // The ETF evidence cache is a verified snapshot source too. Use it only to
   // complete structural fields not returned by portfolio-lookthrough.
   Object.entries(window.PT_ETF_EVIDENCE||{}).forEach(([k,e])=>{
     const t=String(k).toUpperCase(),old=out.get(t)||{};
     const count=N(e?.usableTickerCount??e?.holdingsCount??e?.rawHoldingCount);
     const top10=N(e?.top10Weight??e?.top10WeightPct??e?.topTenWeightPct);
     const period=e?.reportPeriod||e?.asOf||null;
     if(count!=null||top10!=null||period)out.set(t,{...old,count:old.count??count,top10:old.top10??top10,period:old.period||period});
   });
   return out;
 }
 function row(card,label){return [...card.querySelectorAll('tbody tr')].find(r=>clean(r.children[0]?.textContent).toLowerCase()===label)}
 function patch(){
   const fm=backendFunds(); if(!fm.size)return;
   document.querySelectorAll('.pt159-card').forEach(card=>{
     const t=clean(card.querySelector('.pt159-head b')?.textContent).toUpperCase(),f=fm.get(t);if(!f)return;
     const div=row(card,'underlying diversification'),top=row(card,'10 largest holdings');
     if(div&&f.count!=null){div.children[1].textContent=`${Number(f.count).toLocaleString()} holdings`;div.children[2].textContent=f.count>1000?'Broad ownership':f.count>=400?'Broad large-cap set':'More targeted'}
     if(top&&f.top10!=null){top.children[1].textContent=`${f.top10.toFixed(2)}%`;top.children[2].textContent=f.top10>25?'Top-heavy':'More distributed'}
     card.querySelectorAll('.pt159-section').forEach(sec=>{
       const lab=clean(sec.querySelector('small')?.textContent).toUpperCase(),p=sec.querySelector('p');if(!p)return;
       if((lab.includes('EVIDENCE FOR')||lab.includes('SUPPORTS'))&&f.count!=null){
         if(t==='VTI')p.textContent=`VTI spreads the U.S. core across ${Number(f.count).toLocaleString()} measured underlying holdings. That breadth of underlying ownership directly supports its job as the domestic market foundation.`;
         else if(t==='VOO')p.textContent=`VOO contains ${Number(f.count).toLocaleString()} measured underlying holdings and is designed to represent the large-cap U.S. market through the S&P 500. That directly supports its assigned role as a transparent source of large-company U.S. exposure.`;
       }
       if((lab.includes('EVIDENCE AGAINST')||lab.includes('CHALLENGES'))&&f.top10!=null){
         if(t==='VTI')p.textContent=`The strongest structural tension is weighting concentration: the 10 largest holdings account for ${f.top10.toFixed(2)}%. A broad security count therefore does not guarantee evenly distributed economic exposure.`;
         else if(t==='VOO')p.textContent=`VOO is not a total-market fund. With ${f.top10.toFixed(2)}% in its 10 largest holdings, market-cap weighting can make results unusually dependent on the largest U.S. companies. If another broad U.S. fund is already owned, overlap can also make the sleeve additive in ticker count without adding much new economic exposure.`;
       }
     });
   });
 }
 function schedule(){patch();setTimeout(patch,100);setTimeout(patch,600);setTimeout(patch,1400)}
 window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);schedule();return r};
 const mo=new MutationObserver(()=>{if(window.__ptVerifiedPortfolioLookthrough)patch()});
 setTimeout(()=>{const h=document.getElementById('ptGeneratedReport')||document.getElementById('ptrReportOverlay')||document.getElementById('reportOverlay');if(h)mo.observe(h,{childList:true,subtree:true})},0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const norm=v=>String(v||'').trim().toUpperCase();
 const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
 function isFund(t){
   t=norm(t);
   try{if(typeof window.ptETFIsEvidenceFund==='function')return !!window.ptETFIsEvidenceFund(t)}catch(_){}
   try{if(window.PT_ETFS?.has?.(t))return true}catch(_){}
   return ['VTI','VOO','VXUS','AVUV','AVDV','QQQM','SCHD','BND','VNQ','GLD'].includes(t);
 }
 function holdings(){
   try{return (typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:norm(x.ticker),weight:Number(x.weight)||0})).filter(x=>x.ticker&&x.weight>0)}catch(_){return []}
 }
 function removeStockFundCards(stocks){
   const set=new Set(stocks.map(x=>x.ticker));
   document.querySelectorAll('.pt159-card').forEach(card=>{
     const t=norm(card.querySelector('.pt159-head b')?.textContent);
     if(set.has(t))card.remove();
   });
   // Remove a Fund Evidence page only when no actual fund card remains on it.
   document.querySelectorAll('.pt150-page').forEach(pg=>{
     if(!/FUND EVIDENCE/i.test(pg.textContent||''))return;
     if(!pg.querySelector('.pt159-card') && !pg.querySelector('.pt158-card'))pg.remove();
   });
 }
 function buildDeepValuePage(stocks){
   if(!stocks.length)return;
   const host=document.querySelector('.pt150-report'); if(!host)return;
   host.querySelectorAll('.pt280-dv-page').forEach(x=>x.remove());
   const pg=document.createElement('section');
   pg.className='pt150-page pt280-dv-page';
   pg.innerHTML=`<div class="pt150-k">DEEP VALUE RESEARCH</div><h2>Company evidence behind the portfolio weight.</h2><p class="pt150-deck">Individual securities are evaluated as companies, not as funds. Portfolio Thesis uses the Deep Value research framework to test financial quality, valuation and the company thesis, then brings that evidence back into the portfolio.</p><div class="ptr-security-intro"><div><div class="ey">DIRECT COMPANY EXPOSURE</div><b>${stocks.reduce((a,x)=>a+x.weight,0).toFixed(0)}% of the portfolio</b><p>These positions add company-specific outcomes and can increase exposure to businesses already owned indirectly through broad funds.</p></div><div><div class="ey">HOW TO READ IT</div><b>Evidence first. Weight second.</b><p>Deep Value evaluates the company. Portfolio weight determines how much that company-specific thesis can affect the total portfolio.</p></div></div><div id="ptPortfolioDVGrid" class="ptr-individual-grid">${stocks.map(x=>`<div class="ptr-individual-card" id="ptPDV-${esc(x.ticker)}"><div class="ptr-security-head"><div class="ptr-individual-top"><b>${esc(x.ticker)}</b><span class="ptr-individual-weight">${x.weight.toFixed(0)}%</span></div></div><div class="ptr-dv-unavailable">Loading Deep Value evidence…</div></div>`).join('')}</div><div class="pt150-foot"><span>PORTFOLIO THESIS · GLOBAL OWNERSHIP. DISCIPLINED BALANCE.</span><b></b></div>`;
   const evidence=[...host.querySelectorAll('.pt150-page')].filter(x=>/FUND EVIDENCE/i.test(x.textContent||''));
   if(evidence.length)evidence[evidence.length-1].insertAdjacentElement('afterend',pg);
   else {const perf=[...host.querySelectorAll('.pt150-page')].find(x=>/What moved the portfolio\./i.test(x.textContent||'')); if(perf)perf.insertAdjacentElement('afterend',pg); else host.appendChild(pg)}
 }
 function renumber(){
   document.querySelectorAll('.pt150-page').forEach((pg,i)=>{
     const b=pg.querySelector('.pt150-foot b,.pti-foot b'); if(b)b.textContent=String(i+1).padStart(2,'0');
   });
 }
 function route(){
   const p=holdings(),stocks=p.filter(x=>!isFund(x.ticker));
   removeStockFundCards(stocks);
   buildDeepValuePage(stocks);
   renumber();
   if(stocks.length && typeof window.ptHydratePortfolioDeepValue==='function'){
     try{Promise.resolve(window.ptHydratePortfolioDeepValue(p)).finally(()=>renumber())}catch(e){console.warn('V280 Deep Value hydration',e)}
   }
 }
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){
   const r=await prior.apply(this,arguments);
   route();
   setTimeout(route,350);
   setTimeout(route,1000);
   return r;
 };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const N=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(String(v).replace(/[%+,]/g,''));return Number.isFinite(n)?n:null};
 const fmt=(v,d=2)=>v==null?'—':`${v>=0?'+':''}${v.toFixed(d)}%`;
 const ticker=o=>String(o?.ticker||o?.symbol||o?.security?.ticker||o?.security?.symbol||'').toUpperCase();
 function deepPeriod(root,aliases){let found=null,seen=new Set();function rec(o){if(found!=null||!o||typeof o!=='object'||seen.has(o))return;seen.add(o);for(const a of aliases){const x=o[a];if(x!==undefined){for(const v of [x?.returnPct,x?.pct,o[a+'Pct'],x?.return,x]){const n=N(v);if(n!=null){found=n;return}}}}for(const v of Object.values(o))rec(v)}rec(root);return found}
 function extract(root){const out={},seen=new Set();function rec(o){if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);if(!Array.isArray(o)){const t=ticker(o);if(t){const v={m1:deepPeriod(o,['oneMonth','1m','month1']),m3:deepPeriod(o,['threeMonth','3m','month3']),ytd:deepPeriod(o,['ytd','YTD']),y1:deepPeriod(o,['oneYear','1y','year1'])};if(Object.values(v).some(x=>x!=null))out[t]=Object.assign(out[t]||{},v)}}for(const v of Object.values(o))rec(v)}rec(root);return out}
 function isFund(t){return !!window.PT_ETF_EVIDENCE?.[t] || ['VTI','VXUS','AVUV','AVDV','VOO','VT','VEA','VWO','SPY','QQQ','IWM'].includes(t)}
 function patchSummary(){
   const report=document.querySelector('.pt150-report'); if(!report)return;
   const p=(typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:String(x.ticker||'').toUpperCase(),weight:N(x.weight)||0})).filter(x=>x.ticker&&x.weight>0);
   const direct=p.filter(x=>!isFund(x.ticker)); if(!direct.length)return;
   const first=report.querySelector('.pt150-page'); const metrics=first?.querySelector('.pt150-metrics'); if(!metrics)return;
   const cards=[...metrics.querySelectorAll('.pt150-metric')];
   const target=cards.find(c=>/largest fund overlap/i.test(c.querySelector('small')?.textContent||'')); if(!target)return;
   const w=direct.reduce((a,x)=>a+x.weight,0);
   target.querySelector('small').textContent='Direct securities';
   target.querySelector('b').textContent=`${w.toFixed(w%1?1:0)}%`;
   target.querySelector('em').textContent=`${direct.length} direct ${direct.length===1?'position':'positions'}`;
 }
 async function fetchMissingPerformance(){
   const p=(typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:String(x.ticker||'').toUpperCase(),weight:N(x.weight)||0})).filter(x=>x.ticker&&x.weight>0);
   let map=extract(window.__pt151?.securityPerf);
   const missing=p.filter(x=>!map[x.ticker]);
   if(missing.length&&window.ptSupabase?.functions?.invoke){
     for(const h of missing){
       try{const r=await window.ptSupabase.functions.invoke('security-performance',{body:{tickers:[h.ticker],ticker:h.ticker,symbol:h.ticker}});if(!r?.error)map=Object.assign(map,extract(r?.data))}catch(_){}
     }
   }
   return {p,map};
 }
 function patchPerformance(p,map){
   const page=[...document.querySelectorAll('.pt150-page')].find(x=>/What moved the portfolio\./i.test(x.textContent||'')); const table=page?.querySelector('.pt150-table'); if(!table)return;
   let sums={m1:0,m3:0,ytd:0,y1:0},weights={m1:0,m3:0,ytd:0,y1:0};
   for(const tr of table.querySelectorAll('tbody tr')){
     const td=[...tr.children]; if(td.length<6)continue; const t=(td[0].textContent||'').trim().toUpperCase(); if(t==='PORTFOLIO')continue;
     const h=p.find(x=>x.ticker===t),v=map[t]||{},w=h?.weight||0;
     if(v.m1!=null)td[2].textContent=fmt(v.m1); if(v.m3!=null)td[3].textContent=fmt(v.m3); if(v.ytd!=null)td[4].textContent=fmt(v.ytd); if(v.y1!=null)td[5].textContent=fmt(v.y1);
