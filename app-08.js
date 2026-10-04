   return `<div class="pt180-perf"><div class="pt180-grid">${periods.map(([k,l])=>`<div class="pt180-cell"><small>${l}</small><b class="${cls(p[k])}">${fmt(p[k])}</b></div>`).join('')}</div><div class="pt180-caption">${caption}</div></div>`;
 }
 async function call(fn,body){
   try{
    const headers={'Content-Type':'application/json'};
    if(window.ptSupabase?.auth){const {data}=await window.ptSupabase.auth.getSession();const token=data?.session?.access_token;if(token)headers.Authorization='Bearer '+token}
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),12000);
    let r;
    try{
      r=await fetch(`${BASE}/${fn}`,{method:'POST',headers,body:JSON.stringify(body),signal:controller.signal});
    } finally { clearTimeout(timeout); }
    let data=null; try{data=await r.json()}catch{}
    if(!r.ok)return {ok:false,error:`HTTP ${r.status}`,detail:data};
    return data||{ok:false,error:'Empty response'};
   }catch(e){return {ok:false,error:e?.name==='AbortError'?'Request timed out after 12 seconds':(e?.message||'Network request failed')}}
 }
 window.pt180LoadPortfolioReturns=async function(rows){
   await Promise.all((rows||[]).map(async(p,i)=>{
     const host=document.getElementById(`pt180PortfolioPerf${i}`);if(!host||host.dataset.loaded)return;
     host.innerHTML='<div class="pt180-caption">Loading portfolio returns…</div>';
     let holdings=(p?.holdings||p?.positions||[]).map(h=>({ticker:String(h?.ticker||h?.symbol||'').toUpperCase(),weight:Number(h?.weight??h?.weightPct??h?.allocation??0)})).filter(h=>h.ticker&&h.weight>0);
     if(!holdings.length){
       const card=host.closest('.card,.library-card,.pt-card,article')||host.parentElement;
       const text=(card?.innerText||'').replace(//g,' ');
       const matches=[...text.matchAll(/\b([A-Z]{1,6})\s+(\d+(?:\.\d+)?)%/g)];
       holdings=matches.map(m=>({ticker:m[1],weight:Number(m[2])})).filter(h=>h.ticker&&h.weight>0);
     }
     if(!holdings.length){host.innerHTML='<div class="pt180-caption pt183-error">Performance unavailable · portfolio allocation could not be read.</div>';host.dataset.loaded='error';return}
     const raw=await call('portfolio-performance',{holdings});
     if(raw?.ok){
       const normalized=normalize(raw);
       host.innerHTML=render(normalized,'Current-weight portfolio return · not personal account performance');
       host.dataset.loaded='1';
       if(Object.values(normalized).every(v=>v===null)){
         const debug=document.createElement('div');
         debug.className='pt185-debug';
         debug.textContent='Performance periods returned, but no supported period values were found.';
         host.appendChild(debug);
       }
     }else{
       const detail=raw?.error||raw?.message||'Edge Function request failed';
       host.innerHTML=`<div class="pt180-caption pt183-error">Performance unavailable · ${String(detail).replace(/[<>]/g,'')}</div>`;
       host.dataset.loaded='error';
     }
   }));
 };
 window.pt180LoadResearchReturns=async function(rows){
   for(const rec of rows||[]){
     const ticker=String(rec.ticker||'').toUpperCase(),host=document.getElementById(`pt180ResearchPerf_${ticker}`);if(!host||host.dataset.loaded||!ticker)continue;
     host.innerHTML='<div class="pt180-caption">Loading market returns…</div>';
     const raw=await call('security-performance',{ticker});
     if(raw){host.innerHTML=render(normalize(raw),'Security market return');host.dataset.loaded='1'}
     else host.innerHTML='<div class="pt180-caption">Performance temporarily unavailable.</div>';
   }
 };

 // Library can render before this late script is parsed. Hydrate any rows that
 // already exist instead of relying only on the earlier optional call.
 const pt184Hydrate=()=>{
   if(Array.isArray(window.ptLibraryPortfolioRows)) window.pt180LoadPortfolioReturns(window.ptLibraryPortfolioRows);
   if(Array.isArray(window.ptLibraryResearchRows)) window.pt180LoadResearchReturns(window.ptLibraryResearchRows);
 };
 if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',pt184Hydrate,{once:true});
 else setTimeout(pt184Hydrate,0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const CACHE_PREFIX='pt_perf_v189_';
 const TTL=6*60*60*1000;
 const periods=[['w1','1W'],['m1','1M'],['m3','3M'],['m6','6M'],['ytd','YTD'],['y1','1Y']];
 const N=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(v);return Number.isFinite(n)?n:null};
 const fmt=v=>v==null?'—':`${v>=0?'+':''}${Number(v).toFixed(2)}%`;
 const cls=v=>v==null?'pt180-na':v>=0?'pt180-up':'pt180-down';
 function normalizePortfolio(x){
   const out={w1:null,m1:null,m3:null,m6:null,ytd:null,y1:null};
   const names={w1:/oneweek|1week|1w/i,m1:/onemonth|1month|1m/i,m3:/threemonth|3month|3m/i,m6:/sixmonth|6month|6m/i,ytd:/yeartodate|ytd/i,y1:/oneyear|1year|1y/i};
   const seen=new Set();
   function walk(o,path='',d=0){if(!o||typeof o!=='object'||d>8||seen.has(o))return;seen.add(o);const v=N(o.portfolioReturnEstimatePct);if(v!=null){for(const [k,re] of Object.entries(names))if(re.test(path.replace(/[^a-z0-9]/gi,'')))out[k]=v}for(const [k,v2] of Object.entries(o))if(v2&&typeof v2==='object')walk(v2,path+'.'+k,d+1)}
   walk(x);return out;
 }
 function normalizeSecurity(x,ticker){
   const out={w1:null,m1:null,m3:null,m6:null,ytd:null,y1:null};
   const aliases={w1:['oneWeek','1w','week1'],m1:['oneMonth','1m','month1'],m3:['threeMonth','3m','month3'],m6:['sixMonth','6m','month6'],ytd:['ytd','YTD'],y1:['oneYear','1y','year1']};
   let root=x; const T=String(ticker||'').toUpperCase();
   const seen=new Set();
   function findTicker(o){if(!o||typeof o!=='object'||seen.has(o))return null;seen.add(o);if(String(o.ticker||o.symbol||'').toUpperCase()===T)return o;for(const v of Object.values(o)){const z=findTicker(v);if(z)return z}return null}
   root=findTicker(x)||x;
   function deep(o,names){let ans=null,ss=new Set();function w(v){if(ans!=null||!v||typeof v!=='object'||ss.has(v))return;ss.add(v);for(const a of names){const q=v[a];for(const z of [q?.returnPct,q?.pct,v[a+'Pct'],q?.return,q]){const n=N(z);if(n!=null){ans=n;return}}}for(const z of Object.values(v))w(z)}w(o);return ans}
   for(const [k,a] of Object.entries(aliases))out[k]=deep(root,a);return out;
 }
 function render(p,caption,stale=false,retry=''){
   return `<div class="pt180-perf"><div class="pt180-grid">${periods.map(([k,l])=>`<div class="pt180-cell"><small>${l}</small><b class="${cls(p[k])}">${fmt(p[k])}</b></div>`).join('')}</div><div class="pt180-caption">${caption}${stale?' · cached':''}${retry?` · <button class="pt189-refresh" type="button" data-pt189-retry="${retry}">Update performance</button>`:''}</div></div>`;
 }
 function cacheGet(key){try{const x=JSON.parse(localStorage.getItem(CACHE_PREFIX+key)||'null');return x&&x.data?x:null}catch{return null}}
 function cacheSet(key,data){try{localStorage.setItem(CACHE_PREFIX+key,JSON.stringify({at:Date.now(),data}))}catch{}}
 async function invoke(fn,body,ms=6500){
   if(!window.ptSupabase?.functions?.invoke) return {ok:false,error:'Performance service unavailable'};
   let timer; try{
     const timeout=new Promise((_,rej)=>timer=setTimeout(()=>rej(new Error('timeout')),ms));
     const result=await Promise.race([window.ptSupabase.functions.invoke(fn,{body}),timeout]);
     if(result?.error)throw result.error; return {ok:true,data:result?.data};
   }catch(e){return {ok:false,error:e?.message==='timeout'?'Request timed out':(e?.message||'Request failed')}}finally{clearTimeout(timer)}
 }
 function holdingsFor(p,host){
   let h=(p?.holdings||p?.positions||[]).map(x=>({ticker:String(x?.ticker||x?.symbol||'').toUpperCase(),weight:Number(x?.weight??x?.weightPct??x?.allocation??0)})).filter(x=>x.ticker&&x.weight>0);
   if(!h.length){const card=host.closest('.card,.library-card,.pt-card,article')||host.parentElement;const matches=[...(card?.innerText||'').replace(//g,' ').matchAll(/\b([A-Z]{1,6})\s+(\d+(?:\.\d+)?)%/g)];h=matches.map(m=>({ticker:m[1],weight:Number(m[2])})).filter(x=>x.weight>0)}
   return h;
 }
 async function loadPortfolio(p,i,force=false){
   const host=document.getElementById(`pt180PortfolioPerf${i}`);if(!host)return;
   const h=holdingsFor(p,host);if(!h.length){host.innerHTML='<div class="pt180-caption pt183-error">Performance unavailable · portfolio allocation could not be read.</div>';return}
   const key='portfolio_'+h.map(x=>x.ticker+':'+x.weight).join('|');const cached=cacheGet(key);
   if(cached&&!force){host.innerHTML=render(cached.data,'Current-weight portfolio return · not personal account performance',Date.now()-cached.at>TTL,`p:${i}`);if(Date.now()-cached.at<TTL)return}
   else if(!cached)host.innerHTML='<div class="pt180-caption">Loading portfolio returns…</div>';
   const r=await invoke('portfolio-performance',{holdings:h});
   if(r.ok){const n=normalizePortfolio(r.data);if(Object.values(n).some(v=>v!=null)){cacheSet(key,n);host.innerHTML=render(n,'Current-weight portfolio return · not personal account performance',false,`p:${i}`);return}}
   if(cached)host.innerHTML=render(cached.data,'Current-weight portfolio return · not personal account performance',true,`p:${i}`);
   else host.innerHTML='<div class="pt180-caption">Performance unavailable · <button class="pt189-refresh" type="button" data-pt189-retry="p:'+i+'">Update performance</button></div>';
 }
 async function loadResearch(rec,force=false){
   const t=String(rec?.ticker||'').toUpperCase(),host=document.getElementById(`pt180ResearchPerf_${t}`);if(!host||!t)return;const key='security_'+t,cached=cacheGet(key);
   if(cached&&!force){host.innerHTML=render(cached.data,'',Date.now()-cached.at>TTL,`r:${t}`);if(Date.now()-cached.at<TTL)return}else if(!cached)host.innerHTML='<div class="pt180-caption">Loading market returns…</div>';
   const r=await invoke('security-performance',{ticker:t,tickers:[t]});
   if(r.ok){const n=normalizeSecurity(r.data,t);if(Object.values(n).some(v=>v!=null)){cacheSet(key,n);host.innerHTML=render(n,'',false,`r:${t}`);return}}
   if(cached)host.innerHTML=render(cached.data,'',true,`r:${t}`);else host.innerHTML='<div class="pt180-caption">Performance unavailable · <button class="pt189-refresh" type="button" data-pt189-retry="r:'+t+'">Update performance</button></div>';
 }
 window.pt180LoadPortfolioReturns=async rows=>{window.ptLibraryPortfolioRows=rows||window.ptLibraryPortfolioRows||[];await Promise.all(window.ptLibraryPortfolioRows.map((p,i)=>loadPortfolio(p,i,false)))};
 window.pt180LoadResearchReturns=async rows=>{window.ptLibraryResearchRows=rows||window.ptLibraryResearchRows||[];for(const r of window.ptLibraryResearchRows)await loadResearch(r,false)};
 document.addEventListener('click',e=>{const b=e.target.closest('[data-pt189-retry]');if(!b)return;const [kind,id]=b.dataset.pt189Retry.split(':');if(kind==='p'){const i=Number(id),p=window.ptLibraryPortfolioRows?.[i];if(p)loadPortfolio(p,i,true)}else{const r=(window.ptLibraryResearchRows||[]).find(x=>String(x.ticker||'').toUpperCase()===id);if(r)loadResearch(r,true)}});
 const hydrate=()=>{if(Array.isArray(window.ptLibraryPortfolioRows))window.pt180LoadPortfolioReturns(window.ptLibraryPortfolioRows);if(Array.isArray(window.ptLibraryResearchRows))window.pt180LoadResearchReturns(window.ptLibraryResearchRows)};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(hydrate,50),{once:true});else setTimeout(hydrate,50);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior!=='function')return;
 const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
 const num=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(v);return Number.isFinite(n)?n:null};
 function portfolio(){return (typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:String(x.ticker||'').toUpperCase(),weight:num(x.weight)||0})).filter(x=>x.ticker&&x.weight>0)}
 function perf(){return window.__pt165Performance||window.__pt164Performance||{} }
 function facts(){try{return typeof window.ptLookthroughFacts==='function'?(window.ptLookthroughFacts()||{}):{}}catch(_){return {}}}
 function makeLensPage(){
   const p=portfolio(), f=facts(), pm=perf();
   const rows=p.map(x=>({ticker:x.ticker,weight:num(x.weight)||0}));
   const w=t=>rows.find(x=>x.ticker===t)?.weight||0;
   const ovs=(f.overlaps||[]).filter(x=>num(x.weightedOverlapPct)!=null).sort((a,b)=>num(b.weightedOverlapPct)-num(a.weightedOverlapPct));
   const largest=f.largest||null, lw=num(largest?.effectiveWeight), ln=largest?.ticker||largest?.name||null;
   const top10=num(f.top10EffectiveWeightPct);
   const cards=[];
   const card=(name,head,body)=>{const n=String(cards.length+1).padStart(2,'0');cards.push(`<div class="pt191-lens"><small>${n} · ${esc(name)}</small><b>${esc(head)}</b><p>${esc(body)}</p></div>`)};

   // Only render findings supported by evidence already loaded into this report.
   const vtiAvuv=ovs.find(x=>[x.baseFund,x.comparisonFund].includes('VTI')&&[x.baseFund,x.comparisonFund].includes('AVUV'));
   const vxusAvdv=ovs.find(x=>[x.baseFund,x.comparisonFund].includes('VXUS')&&[x.baseFund,x.comparisonFund].includes('AVDV'));
   if(vtiAvuv || vxusAvdv){
     const a=vtiAvuv||vxusAvdv;
     const pair=`${a.baseFund} / ${a.comparisonFund}`;
     card('Diversification',`${pair} is not just a second label`,`${num(a.weightedOverlapPct).toFixed(1)}% weighted overlap across ${Number(a.sharedHoldingsCount||0).toLocaleString()} shared holdings indicates that the added sleeve materially reweights underlying companies instead of simply duplicating the companion fund.`);
   }
   if(ln&&lw!=null){
     card('Concentration',`${ln} is the largest measured company exposure`,`${lw.toFixed(1)}% of the portfolio is effectively exposed to ${ln}${top10!=null?`, while the ten largest effective company exposures account for ${top10.toFixed(1)}%`:''}. The fund wrappers therefore leave the portfolio less top-heavy at the company level than the headline ETF weights might suggest.`);
   }
   if(w('VTI')>0&&w('AVUV')>0){
     card('Structure','AVUV changes the U.S. sleeve rather than replacing it',`VTI remains the broad U.S. foundation while AVUV is a targeted reweighting inside that same market. The useful question is therefore whether AVUV keeps producing a measurably different company mix—not whether it adds another geographic sleeve.`);
   }
   const one=t=>num(pm[t]?.oneMonth??pm[t]?.oneMonthReturnPct??pm[t]?.returns?.oneMonth??pm[t]?.returns?.['1M']);
   const av=one('AVUV'), vt=one('VTI');
   if(av!=null&&vt!=null&&w('AVUV')>0&&w('VTI')>0){
     const avImpact=av*w('AVUV')/100, vtImpact=vt*w('VTI')/100;
     card('Risk Durability','The small-value tilt can move sharply without taking over the portfolio',`AVUV moved ${Math.abs(av).toFixed(1)}% ${av<0?'lower':'higher'} over the latest month versus ${Math.abs(vt).toFixed(1)}% for VTI. At their portfolio weights, the estimated impacts were ${avImpact.toFixed(2)} and ${vtImpact.toFixed(2)} percentage points respectively. The sizing is containing the tilt even when its behavior diverges materially from the core.`);
   }
   if(cards.length){
     const specifics=[];
     if(vtiAvuv) specifics.push('VTI/AVUV stops producing a distinct underlying-company reweighting');
     if(vxusAvdv) specifics.push('VXUS/AVDV overlap rises enough that AVDV no longer adds a distinct international value sleeve');
     if(ln&&lw!=null) specifics.push(`${ln} or another company becomes a materially larger effective driver`);
     if(specifics.length) card('Thesis Test','What would actually change the portfolio story?',`Re-examine the construction if ${specifics.join('; or if ')}. Those are changes in the evidence behind the design; ordinary price movement by itself is not.`);
   }
   // Valuation is omitted until dated fund-level valuation/fundamental evidence exists.
   if(!cards.length) return '';
   return `<section class="pt150-page pt191-six-lens"><div class="pt150-k">PORTFOLIO FINDINGS</div><h2>What the evidence says about this portfolio.</h2><p class="pt150-deck">Only findings supported by portfolio-specific evidence appear here. Missing evidence does not create a placeholder lens.</p><div class="pt191-lenses">${cards.join('')}</div><div class="pti-foot">PORTFOLIO THESIS · GLOBAL OWNERSHIP. DISCIPLINED BALANCE. <b>06</b></div></section>`;
 }
 function polish(){
   const pages=[...document.querySelectorAll('.pt150-page')]; if(!pages.length)return;
   const cover=pages[0];
   if(cover&&!cover.querySelector('.pt191-cover-question')){
     const q=document.createElement('div');q.className='pt191-cover-question';q.innerHTML='THE QUESTION WE CARE ABOUT<strong>What changed — and does it change the portfolio thesis?</strong>';
     const alloc=cover.querySelector('.pt150-alloc'); (alloc||cover.lastElementChild)?.insertAdjacentElement('beforebegin',q);
   }
   pages.forEach(pg=>{
     const k=pg.querySelector('.pt150-k'); const h=pg.querySelector('h2');
     if(/FUND & SECURITY RESEARCH/i.test(k?.textContent||'')){k.textContent='FUND SCORECARDS';if(h)h.textContent='Evidence by holding and assigned job.'}
     if(/CURRENT MARKET ENVIRONMENT/i.test(k?.textContent||'')){k.textContent='CURRENT MARKET FACTORS & TRENDS';if(h)h.textContent='The conditions that matter to this portfolio.'}
   });
   document.querySelectorAll('.pt158-bottom,.pt159-bottom').forEach(box=>{
     const kids=[...box.children];
     kids.forEach((el,i)=>{if(/EVIDENCE SNAPSHOT/i.test(el.textContent||'')){el.remove();const next=kids[i+1];if(next&&next.tagName==='P')next.remove();}})
   });
   // Remove an older V191 lens page before inserting the revised interpretation page.
   document.querySelectorAll('.pt191-six-lens').forEach(x=>x.remove());
   const market=[...document.querySelectorAll('.pt150-page')].find(pg=>/CURRENT MARKET (ENVIRONMENT|FACTORS)/i.test(pg.textContent||''));
   if(market)market.insertAdjacentHTML('beforebegin',makeLensPage());
   [...document.querySelectorAll('.pt150-page')].forEach((pg,i)=>{
     let foot=pg.querySelector('.pti-foot,.pt150-foot');
     if(!foot){foot=document.createElement('div');foot.className='pti-foot';pg.appendChild(foot)}
     foot.innerHTML=`PORTFOLIO THESIS · GLOBAL OWNERSHIP. DISCIPLINED BALANCE. <b>${String(i+1).padStart(2,'0')}</b>`;
   });
 }
 window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);polish();setTimeout(polish,250);return r};
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const num=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(String(v).replace(/[%+,]/g,''));return Number.isFinite(n)?n:null};
 const signed=(v,suffix='')=>v==null?'—':`${v>0?'+':''}${v.toFixed(2)}${suffix}`;
 function cleanFindings(){
   document.querySelectorAll('.pt191-six-lens').forEach(x=>x.remove());
 }
 function upgradeImpact(){
   const page=[...document.querySelectorAll('.pt150-page')].find(x=>/What moved the portfolio\./i.test(x.textContent||''));
   if(!page)return;
   const table=page.querySelector('.pt150-table'); if(!table)return;
   const old=page.querySelector('.pt169-impact,.pt195-impact');
   if(old?.classList.contains('pt195-impact'))return;
   const rows=[...table.querySelectorAll('tbody tr')];
   const portfolio=(typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:String(x.ticker||'').toUpperCase(),weight:num(x.weight)||0}));
   const weight=t=>portfolio.find(x=>x.ticker===t)?.weight||0;
   const data=[]; let total=null;
   rows.forEach(tr=>{
     const td=[...tr.children], ticker=(td[0]?.textContent||'').trim().toUpperCase();
     if(!ticker)return;
     const oneMonth=num(td[2]?.textContent);
     if(ticker==='PORTFOLIO'){total=oneMonth;return}
     const w=weight(ticker);
     if(w>0&&oneMonth!=null)data.push({ticker,weight:w,ret:oneMonth,impact:w*oneMonth/100});
   });
   if(!data.length)return;
   const maxW=Math.max(...data.map(x=>Math.abs(x.weight)),1);
   const maxR=Math.max(...data.map(x=>Math.abs(x.ret)),.01);
   const maxI=Math.max(...data.map(x=>Math.abs(x.impact)),.01);
   const box=document.createElement('div');box.className='pt195-impact';
   box.innerHTML=`<div class="pt195-impact-head"><div><small>ALLOCATION × PERFORMANCE</small><b>Weight × Return → Portfolio Impact</b></div><div class="pt195-impact-total"><span>Portfolio 1M</span><strong>${signed(total,'%')}</strong></div></div>
   <div class="pt195-cols"><span></span><span>Weight</span><span></span><span>1M return</span><span></span><span>Impact</span></div>
   ${data.map(x=>`<div class="pt195-row"><span class="pt195-ticker">${x.ticker}</span>
      <div class="pt195-metric"><b>${x.weight.toFixed(x.weight%1?1:0)}%</b><div class="pt195-track"><div class="pt195-fill" style="width:${(Math.abs(x.weight)/maxW*100).toFixed(1)}%"></div></div></div>
      <span class="pt195-op">×</span>
      <div class="pt195-metric pt195-return"><b>${signed(x.ret,'%')}</b><div class="pt195-track"><div class="pt195-fill" style="width:${(Math.abs(x.ret)/maxR*100).toFixed(1)}%"></div></div></div>
      <span class="pt195-op">→</span>
      <div class="pt195-metric pt195-result"><b>${signed(x.impact,' pts')}</b><div class="pt195-track"><div class="pt195-fill" style="width:${(Math.abs(x.impact)/maxI*100).toFixed(1)}%"></div></div></div>
   </div>`).join('')}
   <p class="pt195-note"><b>How to read this:</b> The left bar shows how much capital is assigned to each holding, the middle bar shows the holding's 1-month move, and the right bar shows the resulting effect on total portfolio return. A sharp move in a small sleeve can therefore have a similar portfolio effect to a modest move in a much larger core holding.</p>`;
   if(old)old.replaceWith(box); else table.insertAdjacentElement('afterend',box);
 }
 function renumber(){
   [...document.querySelectorAll('.pt150-page')].forEach((pg,i)=>{
     const foot=pg.querySelector('.pti-foot,.pt150-foot');
     if(foot)foot.innerHTML=`PORTFOLIO THESIS · GLOBAL OWNERSHIP. DISCIPLINED BALANCE. <b>${String(i+1).padStart(2,'0')}</b>`;
   });
 }
 function apply(){cleanFindings();upgradeImpact();renumber()}
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);apply();setTimeout(apply,300);return r};
 setTimeout(apply,0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 function rearrange(){
   const pages=[...document.querySelectorAll('.pt150-page')];
   if(!pages.length)return;

   // Rename the non-scoring research section.
   pages.forEach(pg=>{
     const k=pg.querySelector('.pt150-k');
     const h=pg.querySelector('h2');
     if(/FUND SCORECARDS|FUND & SECURITY RESEARCH/i.test(k?.textContent||'')){
       k.textContent='FUND EVIDENCE';
       if(h) h.textContent='Evidence by holding and assigned job.';
     }
   });

   // Identify the original page 2 / portfolio summary.
   const summary=pages.find((pg,i)=>{
     if(i===0)return false;
     const txt=(pg.textContent||'').toUpperCase();
     return /PORTFOLIO SUMMARY|EXECUTIVE (BRIEF|SUMMARY)|PORTFOLIO THESIS/.test(txt)
       && !/FUND EVIDENCE|FUND SCORECARDS|CURRENT MARKET/.test(txt);
   }) || pages[1];

   // Fund evidence can span multiple consecutive pages. Put summary after the last one.
   const current=[...document.querySelectorAll('.pt150-page')];
   const evidence=current.filter(pg=>/FUND EVIDENCE|FUND SCORECARDS|FUND & SECURITY RESEARCH/i.test(pg.textContent||''));
   if(summary && evidence.length && !evidence.includes(summary)){
     evidence[evidence.length-1].insertAdjacentElement('afterend',summary);
   }

   // Renumber after physical reordering.
   [...document.querySelectorAll('.pt150-page')].forEach((pg,i)=>{
     let foot=pg.querySelector('.pti-foot,.pt150-foot');
     if(!foot){foot=document.createElement('div');foot.className='pti-foot';pg.appendChild(foot)}
     foot.innerHTML=`PORTFOLIO THESIS · GLOBAL OWNERSHIP. DISCIPLINED BALANCE. <b>${String(i+1).padStart(2,'0')}</b>`;
   });
 }
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){
   const r=await prior.apply(this,arguments);
   rearrange(); setTimeout(rearrange,350);
   return r;
 };
 setTimeout(rearrange,0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 function apply(){
   let pages=[...document.querySelectorAll('.pt150-page')];
   if(!pages.length)return;

   // 1) Performance & Drivers immediately after cover.
   const perf=pages.find(pg=>/What moved the portfolio\./i.test(pg.textContent||''));
   if(perf && pages[0] && perf!==pages[1]) pages[0].insertAdjacentElement('afterend',perf);

   // 2) Rename scorecard language everywhere in the generated report.
   document.querySelectorAll('.pt150-page *').forEach(el=>{
     if(el.children.length===0 && /scorecard/i.test(el.textContent||'')){
       el.textContent=(el.textContent||'').replace(/FUND SCORECARD/gi,'FUND EVIDENCE').replace(/SCORECARD/gi,'EVIDENCE');
     }
   });

   // 3) Remove the obsolete intro paragraph under "Evidence by holding and assigned job."
   pages=[...document.querySelectorAll('.pt150-page')];
   pages.forEach(pg=>{
     const h=pg.querySelector('h2');
     if(/Evidence by holding and assigned job/i.test(h?.textContent||'')){
       let el=h.nextElementSibling;
       while(el && !/^(DIV|SECTION|TABLE)$/.test(el.tagName)){
         const next=el.nextElementSibling;
         if(/Each fund is tested against the job it performs|scorecard separates observed evidence/i.test(el.textContent||'')) el.remove();
         el=next;
       }
       // Catch deck-class intro even if wrapped differently.
       pg.querySelectorAll('p,.pt150-deck').forEach(p=>{
         if(/Each fund is tested against the job it performs|scorecard separates observed evidence/i.test(p.textContent||''))p.remove();
       });
     }
   });

   // 4) Keep portfolio summary after all Fund Evidence pages.
   pages=[...document.querySelectorAll('.pt150-page')];
   const evidence=pages.filter(pg=>/FUND EVIDENCE/i.test(pg.textContent||'') && !/What moved the portfolio/i.test(pg.textContent||''));
   const summary=pages.find((pg,i)=>{
     if(i===0 || pg===perf || evidence.includes(pg))return false;
     return /PORTFOLIO SUMMARY|EXECUTIVE (BRIEF|SUMMARY)/i.test(pg.textContent||'');
   });
   if(summary && evidence.length) evidence[evidence.length-1].insertAdjacentElement('afterend',summary);

   // 5) Renumber physical page order.
   [...document.querySelectorAll('.pt150-page')].forEach((pg,i)=>{
     let foot=pg.querySelector('.pti-foot,.pt150-foot');
     if(!foot){foot=document.createElement('div');foot.className='pti-foot';pg.appendChild(foot)}
     foot.innerHTML=`PORTFOLIO THESIS · GLOBAL OWNERSHIP. DISCIPLINED BALANCE. <b>${String(i+1).padStart(2,'0')}</b>`;
   });
 }
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){
   const r=await prior.apply(this,arguments);
   apply(); setTimeout(apply,400);
   return r;
 };
 setTimeout(apply,0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const clean=s=>(s||'').replace(/\s+/g,' ').trim();
 function cellMap(card){const m={};card.querySelectorAll('tr').forEach(tr=>{const c=tr.querySelectorAll('td');if(c.length>=2)m[clean(c[0].textContent).toLowerCase()]=clean(c[1].textContent)});return m}
 function tickerOf(card){const txt=clean(card.textContent);for(const t of ['VTI','VXUS','AVUV','AVDV'])if(new RegExp('\\b'+t+'\\b').test(txt))return t;return ''}
 function upgradeFunds(){
   document.querySelectorAll('.pt159-card,.pt158-card').forEach(card=>{
     const t=tickerOf(card); if(!t)return; const m=cellMap(card);
     const div=m['underlying diversification']||'the measured underlying holdings';
     const top=m['10 largest holdings']||'the measured top holdings';
     const inter=m['fund interaction']||'the measured interaction with the paired sleeve';
     let thesis='',forTxt='',against='',breakTxt='';
     if(t==='VTI'){
       thesis='Broad U.S. ownership is the portfolio foundation; the key structural test is whether underlying concentration remains acceptable.';
       forTxt=`VTI still delivers the intended broad U.S. core: ${div}. Its ${inter} interaction shows the small/value sleeve can materially alter company-level exposure rather than simply duplicate the core.`;
       against=`The 10 largest holdings represent ${top}. VTI therefore owns thousands of companies, but a meaningful share of its economic exposure is still determined by a relatively small group of mega-cap businesses.`;
       breakTxt='The core thesis weakens if rising mega-cap concentration causes VTI to stop behaving like sufficiently broad U.S. market exposure, or if its interaction with the portfolio tilts becomes duplicative enough that those sleeves no longer provide meaningfully distinct exposure.';
     } else if(t==='VXUS'){
       thesis='International ownership should diversify the U.S. core through different companies, regions, currencies and valuation exposures.';
       forTxt=`VXUS provides ${div} and remains a separate international sleeve. Its ${inter} interaction with the developed small/value tilt leaves room for that tilt to change the portfolio’s underlying company weights.`;
       against=`A large holding count does not guarantee useful diversification. The thesis depends on VXUS continuing to produce meaningfully different regional, earnings and valuation exposure from the U.S. core—not simply adding another broad index.`;
       breakTxt='The diversification thesis weakens if VXUS becomes materially less distinct from the U.S. core, or if overlap with the portfolio’s other international sleeve rises enough that the separate allocations stop performing different jobs.';
     } else if(t==='AVUV'){
       thesis='The U.S. small/value sleeve should deliberately reweight the portfolio away from the broad-market core toward smaller, cheaper companies.';
       forTxt=`AVUV is intentionally separate from VTI rather than another core fund. Its ${inter} interaction shows that the sleeve can meaningfully change company-level weights and therefore create a genuine small/value tilt.`;
       against='A distinct tilt can lag the broad market for long periods and add volatility. Short-term underperformance alone is not evidence that the thesis failed, but the sleeve must continue to deliver the factor exposure it was selected to provide.';
       breakTxt='The thesis weakens if AVUV loses meaningful small/value distinctness, begins substantially duplicating VTI, or the underlying evidence shows that the sleeve is no longer delivering the factor exposure that justifies its separate allocation.';
     } else {
       thesis='Developed international small/value should add a distinct factor tilt inside the non-U.S. allocation rather than duplicate VXUS.';
       forTxt=`AVDV is a deliberate developed-market small/value sleeve. Its ${inter} interaction with VXUS indicates that the allocation can reweight the international portfolio toward a different set of companies rather than merely repeat the broad fund.`;
       against='The separate allocation only earns its place if that factor exposure remains meaningfully distinct. If overlap rises or the small/value characteristics weaken, the sleeve adds complexity without adding enough differentiated exposure.';
       breakTxt='The thesis weakens if AVDV becomes materially more duplicative of VXUS, loses its developed small/value characteristics, or no longer changes the international portfolio enough to justify a separate allocation.';
     }
     const th=card.querySelector('.pt159-thesis b,.pt158-thesis b'); if(th)th.textContent=thesis;
     const blocks=[...card.querySelectorAll('.pt159-section,.pt158-two>div,.pt158-bottom')];
     blocks.forEach(b=>{const sm=b.querySelector('small');if(!sm)return;const lab=clean(sm.textContent).toUpperCase();const p=b.querySelector('p');
       if(lab.includes('SUPPORTS')){sm.textContent='EVIDENCE FOR';if(p)p.textContent=forTxt}
       else if(lab.includes('CHALLENGES')){sm.textContent='EVIDENCE AGAINST';if(p)p.textContent=against}
       else if(lab.includes('WHAT WOULD CHANGE')){sm.textContent='THESIS BREAKPOINT';if(p)p.textContent=breakTxt}
     });
   });
 }
 function upgradeMonitor(){
   const pages=[...document.querySelectorAll('.pt150-page')];
   const pg=pages.find(p=>/THESIS MONITOR|Evidence worth watching next/i.test(p.textContent||'')); if(!pg)return;
   const k=pg.querySelector('.pt150-k'); if(k)k.textContent='WHAT WE’RE WATCHING';
   const h=pg.querySelector('h2'); if(h)h.textContent='The signals most capable of changing the portfolio thesis.';
   const deck=pg.querySelector('.pt150-deck'); if(deck)deck.textContent='These are forward-looking thesis tests—not a repeat of the performance pages.';
   const table=pg.querySelector('table'); if(!table)return;
   const hs=table.querySelectorAll('th'); if(hs.length>=3){hs[0].textContent='Signal';hs[1].textContent='Current state';hs[2].textContent='What would change the thesis'}
   [...table.querySelectorAll('tbody tr')].forEach(tr=>{const c=tr.querySelectorAll('td');if(c.length<3)return;const name=clean(c[0].textContent);const reading=clean(c[1].textContent);
     if(/Geographic balance|Portfolio YTD/i.test(name)){tr.remove();return}
     if(/Largest company/i.test(name))c[2].textContent='A sustained rise would increase dependence on a single underlying business despite broad fund ownership.';
     else if(/Top-10/i.test(name))c[2].textContent='A sustained increase would make the broad U.S. core more economically dependent on a smaller group of companies.';
     else if(/Fund overlap/i.test(name))c[2].textContent='A meaningful increase would weaken the case that the paired sleeve provides genuinely distinct exposure.';
     else if(/Interest-rate/i.test(name))c[2].textContent='A material change in financing and discount-rate conditions can alter the environment for smaller and valuation-sensitive companies.';
     else if(/small\/value/i.test(name))c[2].textContent='Persistent relative weakness matters most if it is accompanied by deterioration in the underlying small/value evidence—not because of underperformance alone.';
   });
   if(!pg.querySelector('.pt200-thesis-watch')){
     const box=document.createElement('div');box.className='pt200-thesis-watch';box.innerHTML='<small>THESIS WATCH</small><b>No structural thesis change.</b><p>Current performance differences remain consistent with the distinct roles assigned to each sleeve. The evidence to watch is whether concentration, diversification, overlap, small/value fundamentals, or financing conditions change enough to challenge those roles.</p>';
     const disc=pg.querySelector('.pt150-disc'); (disc||table).insertAdjacentElement(disc?'beforebegin':'afterend',box);
   }
 }
 function renumber(){[...document.querySelectorAll('.pt150-page')].forEach((pg,i)=>{let f=pg.querySelector('.pti-foot,.pt150-foot');if(f)f.innerHTML=`PORTFOLIO THESIS · GLOBAL OWNERSHIP. DISCIPLINED BALANCE. <b>${String(i+1).padStart(2,'0')}</b>`})}
 function apply(){upgradeFunds();upgradeMonitor();renumber()}
 const prior=window.ptGeneratePortfolioPublication;if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);apply();setTimeout(apply,450);return r};
 setTimeout(apply,0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const clean=s=>(s||'').replace(/\s+/g,' ').trim();
 function mapRows(card){const m={};card.querySelectorAll('tbody tr').forEach(tr=>{const c=tr.querySelectorAll('td');if(c.length>=3)m[clean(c[0].textContent).toLowerCase()]={reading:clean(c[1].textContent),read:clean(c[2].textContent)}});return m}
 function upgradeFunds(){
  document.querySelectorAll('.pt159-card').forEach(card=>{
   const t=clean(card.querySelector('.pt159-head b')?.textContent).toUpperCase(); if(!['VTI','VXUS','AVUV','AVDV'].includes(t))return;
   const m=mapRows(card), div=m['underlying diversification']?.reading||'—', top=m['10 largest holdings']?.reading||'—', inter=m['fund interaction']?.reading||'—';
   let thesis,yes,no,bp;
   if(t==='VTI'){
    thesis='Broad U.S. ownership is the portfolio foundation; the structural test is whether that breadth remains economically broad after weighting.';
    yes=`VTI holds ${div} across the U.S. equity market, giving the portfolio broad exposure across company sizes, sectors and industries without relying on individual security selection. As the portfolio’s U.S. core, that breadth provides the foundation for market-wide domestic equity exposure.`;
    no=`The strongest tension is concentration: the 10 largest holdings account for ${top}. Thousands of underlying companies therefore do not mean that portfolio influence is evenly distributed; a relatively small group of mega-cap businesses can still drive a large share of the core’s behavior.`;
    bp='The core thesis weakens if concentration rises far enough that VTI no longer functions as sufficiently broad economic exposure to the U.S. market, rather than simply broad ownership by security count.';
   }else if(t==='VXUS'){
    thesis='International ownership should diversify the U.S. core through different companies, regions, currencies and economic exposures.';
    yes=`VXUS provides ${div} outside the U.S. market, creating broad ownership across developed and emerging-market companies, regions and currencies. That breadth gives the portfolio a dedicated source of non-U.S. economic exposure rather than simply extending the domestic core.`;
    no='A large non-U.S. holding count is not sufficient by itself. The sleeve earns its role only if those companies continue to provide meaningfully different regional, currency, earnings and valuation exposure from the U.S. core.';
    bp='The diversification thesis weakens if the economic behavior and underlying exposures of VXUS become materially less distinct from the U.S. core, reducing the benefit of maintaining a dedicated international sleeve.';
   }else if(t==='AVUV'){
    thesis='The U.S. small/value sleeve should deliberately reweight the portfolio toward smaller, value-oriented companies that the broad-market core holds at lower weights.';
    yes=`AVUV targets the U.S. small/value role across ${div}. Its 10 largest holdings account for only ${top}, so the sleeve can emphasize smaller, value-oriented companies without making the tilt dependent on a handful of names. That targeted construction is the primary evidence that AVUV is performing a different job from a broad-market core.`;
    no='The tilt adds complexity and can lag the broad market for long periods. Its case therefore depends on preserving genuine small/value characteristics; different performance alone is not enough to prove that the sleeve is doing useful work.';
    bp='The thesis weakens if AVUV loses meaningful small/value exposure, becomes substantially more similar to the broad U.S. core, or its underlying construction stops producing the targeted reweighting the sleeve was selected to provide.';
   }else{
    thesis='Developed international small/value should add a targeted factor exposure inside the non-U.S. allocation rather than function as a smaller copy of broad international ownership.';
    yes=`AVDV targets developed international small/value across ${div}, giving the portfolio direct exposure to smaller, value-oriented companies outside the U.S. That targeted construction is the primary evidence for the sleeve: it intentionally emphasizes a segment that broad international ownership does not emphasize to the same degree.`;
    no='A separate international tilt only earns its complexity if the small/value characteristics remain strong enough to create meaningfully different exposure from broad international ownership.';
    bp='The thesis weakens if AVDV loses its developed-market small/value characteristics or becomes sufficiently duplicative of broad international exposure that the separate sleeve no longer changes the portfolio in a meaningful way.';
   }
   const th=card.querySelector('.pt159-thesis b');if(th)th.textContent=thesis;
   card.querySelectorAll('.pt159-section').forEach(b=>{const sm=b.querySelector('small'),p=b.querySelector('p');if(!sm||!p)return;const lab=clean(sm.textContent).toUpperCase();if(lab.includes('EVIDENCE FOR')||lab.includes('SUPPORTS')){sm.textContent='EVIDENCE FOR';p.textContent=yes}else if(lab.includes('EVIDENCE AGAINST')||lab.includes('CHALLENGES')){sm.textContent='EVIDENCE AGAINST';p.textContent=no}else if(lab.includes('THESIS BREAKPOINT')||lab.includes('WHAT WOULD CHANGE')){sm.textContent='THESIS BREAKPOINT';p.textContent=bp}});
  });
 }
 function synthesis(){
  const pages=[...document.querySelectorAll('.pt150-page')]; const pg=pages.find(p=>/WHAT WE.RE WATCHING|THESIS MONITOR|signals most capable|Evidence worth watching next/i.test(p.textContent||'')); if(!pg)return;
  const cards=[...document.querySelectorAll('.pt159-card')]; const data={}; cards.forEach(c=>{const t=clean(c.querySelector('.pt159-head b')?.textContent).toUpperCase();data[t]=mapRows(c)});
  const vtiTop=data.VTI?.['10 largest holdings']?.reading||'the measured top-10 concentration';
  const avuvPerf=data.AVUV?.performance?.reading||'the measured period';
  const vxusDiv=data.VXUS?.['underlying diversification']?.reading||'broad non-U.S. holdings';
  const avuvDiv=data.AVUV?.['underlying diversification']?.reading||'a targeted U.S. small/value sleeve';
  const avdvDiv=data.AVDV?.['underlying diversification']?.reading||'a targeted developed international small/value sleeve';
  const k=pg.querySelector('.pt150-k');if(k)k.textContent='WHAT THE EVIDENCE SAYS NOW';
  const h=pg.querySelector('h2');if(h)h.textContent='The portfolio’s structure is doing more than simply adding holdings.';
  const d=pg.querySelector('.pt150-deck');if(d)d.textContent='The conclusion below synthesizes the evidence in this report rather than repeating the underlying measurements.';
  const table=pg.querySelector('table');if(table)table.remove(); const old=pg.querySelector('.pt200-thesis-watch');if(old)old.remove(); const prior=pg.querySelector('.pt201-findings');if(prior)prior.remove();
  const box=document.createElement('div');box.className='pt201-findings';box.innerHTML=`
   <div class="pt201-finding"><small>FINDING 01</small><b>Diversification is coming from different sources, not simply a larger security count.</b><p>VTI and VXUS provide broad market ownership, while AVUV and AVDV deliberately change the kinds of companies emphasized. VXUS contributes ${vxusDiv}; the two factor sleeves add more targeted exposures (${avuvDiv} in AVUV and ${avdvDiv} in AVDV). The useful question is therefore what each sleeve changes, not how many total securities the portfolio can count.</p></div>
   <div class="pt201-finding"><small>FINDING 02</small><b>Small/value can be a performance drag without invalidating the reason it is owned.</b><p>AVUV’s current performance reading is ${avuvPerf}. Because the sleeve is intentionally different from the broad U.S. core, relative underperformance can occur precisely because the exposures are different. The stronger test is whether the underlying small/value characteristics remain intact.</p></div>
   <div class="pt201-finding"><small>FINDING 03</small><b>Concentration is the clearest structural tension inside the U.S. core.</b><p>VTI can own thousands of companies while its 10 largest holdings still represent ${vtiTop}. That means security count alone overstates practical diversification if weighting is ignored. Concentration deserves attention because the U.S. core carries the largest portfolio weight.</p></div>
   <div class="pt201-finding"><small>FINDING 04</small><b>The two tilts need to earn their additional complexity through distinct exposure.</b><p>VTI and VXUS already provide broad U.S. and international ownership. AVUV and AVDV therefore are not justified merely by adding more holdings; their value comes from maintaining targeted small/value exposures that materially reweight the portfolio. Distinctness—not short-term outperformance—is the central test.</p></div>
   <div class="pt201-current"><small>CURRENT THESIS</small><b>The evidence currently supports the intended portfolio structure.</b><p>Broad U.S. and international ownership form the foundation, while the two small/value sleeves deliberately alter the portfolio’s exposure. The main structural tensions are whether core concentration continues to rise and whether the tilts remain sufficiently distinct to justify their added complexity.</p></div>`;
  const disc=pg.querySelector('.pt150-disc');(disc||pg).insertAdjacentElement(disc?'beforebegin':'beforeend',box);
 }
 function apply(){upgradeFunds();synthesis()}
 const prior=window.ptGeneratePortfolioPublication;if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);apply();setTimeout(apply,500);return r};setTimeout(apply,0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
 const profiles={
  VTI:{role:'U.S. total-market core',kind:'core',thesis:'Broad U.S. ownership should remain economically broad after weighting, not merely broad by security count.'},
  VOO:{role:'U.S. large-cap core',kind:'core',thesis:'Large-cap U.S. exposure should provide efficient participation in the S&P 500 while the portfolio remains comfortable with the concentration created by market-cap weighting.'},
  VXUS:{role:'International diversifier',kind:'core',thesis:'International ownership should diversify the U.S. core through different companies, regions, currencies and economic exposures.'},
  AVUV:{role:'U.S. small/value tilt',kind:'tilt',thesis:'The U.S. small/value sleeve should deliberately reweight the portfolio toward smaller, value-oriented companies that the broad-market core holds at lower weights.'},
  AVDV:{role:'International small/value tilt',kind:'tilt',thesis:'Developed international small/value should add a targeted factor exposure inside the non-U.S. allocation rather than function as a smaller copy of broad international ownership.'},
  QQQM:{role:'U.S. growth tilt',kind:'tilt',thesis:'The growth sleeve should create a deliberate growth and innovation tilt while earning the added concentration and valuation risk it introduces.'},
  SCHD:{role:'Dividend / quality tilt',kind:'tilt',thesis:'The dividend sleeve should add durable income and quality characteristics rather than merely reshuffle companies already dominant in the U.S. core.'},
  BND:{role:'Core bond diversifier',kind:'diversifier',thesis:'The bond sleeve should provide income and portfolio stabilization through broad investment-grade fixed-income exposure.'},
  VNQ:{role:'Real-estate tilt',kind:'tilt',thesis:'The real-estate sleeve should provide a distinct property and REIT exposure large enough to change the portfolio rather than simply add another equity ticker.'},
  GLD:{role:'Gold diversifier',kind:'diversifier',thesis:'Gold should earn its place by behaving differently enough from equity risk to provide a useful source of portfolio diversification.'}
 };
 function rows(card){const m={};card.querySelectorAll('tbody tr').forEach(tr=>{const c=tr.querySelectorAll('td');if(c.length>=3)m[clean(c[0].textContent).toLowerCase()]={reading:clean(c[1].textContent),read:clean(c[2].textContent)}});return m}
 function num(s){const m=String(s||'').match(/[\d,.]+/);return m?Number(m[0].replace(/,/g,'')):null}
 function interaction(m){const s=m['fund interaction']?.reading||'';const mt=s.match(/^(.+?)\s+with\s+([A-Z0-9.\-]+)$/i);return mt?{value:mt[1],other:mt[2].toUpperCase()}:null}
 function copy(t,m){
  const p=profiles[t]; if(!p)return null;
  const div=m['underlying diversification']?.reading||'—'; const top=m['10 largest holdings']?.reading||'—'; const topN=num(top); const ix=interaction(m);
  let yes='',no='',bp='';
  if(t==='VTI'){yes=`VTI spreads the U.S. core across ${div}, so the portfolio is not dependent on selecting individual companies or sectors. That broad underlying ownership is direct evidence for its job as the domestic market foundation.`;no=`The strongest structural tension is weighting concentration: the 10 largest holdings account for ${top}. A broad security count therefore does not guarantee evenly distributed economic exposure.`;bp='The thesis weakens if market-cap concentration rises far enough that the core becomes economically dependent on a narrow group of companies despite retaining thousands of holdings.'}
  else if(t==='VOO'){yes=`VOO owns ${div} and is designed to represent the large-cap U.S. market through the S&P 500. That makes it a direct, transparent source of large-company U.S. exposure rather than an undefined portfolio holding.${topN!=null?` Its current top-10 weight of ${top} also makes the degree of concentration explicit rather than hidden.`:''}`;no=`VOO is not a total-market fund. ${topN!=null?`With ${top} in its 10 largest holdings, `:''}market-cap weighting can make portfolio results unusually dependent on the largest U.S. companies. If another broad U.S. fund is already owned, overlap can also make the sleeve additive in ticker count without adding much new economic exposure.`;bp='The thesis weakens if the portfolio no longer wants a dedicated large-cap U.S. exposure, if concentration becomes inconsistent with the intended core role, or if overlap with another U.S. core makes VOO redundant rather than purposeful.'}
  else if(t==='VXUS'){yes=`VXUS provides ${div} outside the U.S. market, creating a dedicated source of non-U.S. company, regional and currency exposure. That is direct evidence for its role as the portfolio’s international diversifier.`;no='Holding many non-U.S. securities is not enough by itself: the sleeve must continue to deliver economic exposures that are meaningfully different from the U.S. core, including regional earnings, currency and valuation differences.';bp='The thesis weakens if its underlying economic exposures become materially less distinct from the U.S. core or the portfolio no longer seeks a dedicated non-U.S. allocation.'}
  else if(t==='AVUV'){yes=`AVUV targets U.S. small/value across ${div}.${topN!=null?` Its top 10 represent ${top}, helping show that the tilt is not dependent on only a few companies.`:''} The relevant evidence is the deliberate reweighting toward smaller, value-oriented businesses rather than short-term relative performance.`;no='The sleeve adds complexity and can lag the broad market for long periods. Its case depends on preserving genuine small/value characteristics; different returns alone do not prove useful diversification.';bp='The thesis weakens if AVUV loses meaningful small/value exposure, becomes substantially more similar to the broad U.S. core, or stops producing the targeted reweighting it was selected to provide.'}
  else if(t==='AVDV'){yes=`AVDV targets developed international small/value across ${div}, giving the portfolio direct exposure to smaller, value-oriented companies outside the U.S. The evidence for the sleeve is the segment it emphasizes, not simply the number of additional holdings.`;no='A separate international factor sleeve only earns its complexity if its small/value characteristics remain strong enough to create meaningfully different exposure from broad international ownership.';bp='The thesis weakens if AVDV loses its developed-market small/value characteristics or becomes sufficiently duplicative of broad international exposure that the separate sleeve no longer changes the portfolio meaningfully.'}
  else {const q=window.PT_ETF_EVIDENCE?.[t]?.evidenceQuestion||'';yes=`The measured fund structure is consistent with its assigned role as ${p.role.toLowerCase()}. ${div!=='— holdings'?`The current evidence shows ${div}.`:''}${ix?` Its measured interaction with ${ix.other} is ${ix.value}, which should be judged by whether that relationship is intentional for this portfolio.`:''}`;no=`The sleeve should not be justified by ticker count alone. Its underlying exposures, concentration and interaction with the other holdings must remain distinct enough to earn a separate allocation.${q?` The next research test is: ${q}`:''}`;bp=`The thesis weakens if the fund stops delivering the ${p.role.toLowerCase()} exposure it was selected for, or if overlap and concentration make that role redundant or materially different from the portfolio’s intent.`}
  return {yes,no,bp};
 }
 function apply(){document.querySelectorAll('.pt159-card').forEach(card=>{const t=clean(card.querySelector('.pt159-head b')?.textContent).toUpperCase(),p=profiles[t];if(!p)return;const m=rows(card),c=copy(t,m);const role=card.querySelector('.pt159-role strong');if(role)role.textContent=p.role;const pr=[...card.querySelectorAll('tbody tr')].find(r=>clean(r.children[0]?.textContent).toLowerCase()==='portfolio role');if(pr){pr.children[1].textContent=p.role;pr.children[2].textContent=p.kind==='core'?'Foundation':p.kind==='diversifier'?'Diversifier':'Deliberate tilt'}const th=card.querySelector('.pt159-thesis b');if(th)th.textContent=p.thesis;card.querySelectorAll('.pt159-section').forEach(sec=>{const lab=clean(sec.querySelector('small')?.textContent).toUpperCase(),el=sec.querySelector('p');if(!el)return;if(lab.includes('EVIDENCE FOR')||lab.includes('SUPPORTS')){sec.querySelector('small').textContent='EVIDENCE FOR';el.textContent=c.yes}else if(lab.includes('EVIDENCE AGAINST')||lab.includes('CHALLENGES')){sec.querySelector('small').textContent='EVIDENCE AGAINST';el.textContent=c.no}else if(lab.includes('THESIS BREAKPOINT')||lab.includes('WHAT WOULD CHANGE')){sec.querySelector('small').textContent='THESIS BREAKPOINT';el.textContent=c.bp}})})}
 const prior=window.ptGeneratePortfolioPublication;if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);apply();setTimeout(apply,500);return r};setTimeout(apply,0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  const baseFetch = window.ptFetchETFEvidence;
  const baseGenerate = window.ptGeneratePortfolioPublication;
  const ATTEMPT_TTL = 5 * 60 * 1000;
  const attempts = new Map();
  const inflight = new Map();

  function ticker(x){ return String(x||'').trim().toUpperCase(); }
  function hasStructural(e){
    return !!(e && (
      Number.isFinite(Number(e.holdingsCount)) ||
      Number.isFinite(Number(e.top10Weight)) ||
      (Array.isArray(e.holdings) && e.holdings.length)
    ));
  }

  window.ptFetchETFEvidence = async function(symbol,{force=false}={}){
    const t=ticker(symbol);
    if(!t) return null;

    if(inflight.has(t)) return inflight.get(t);

    const e=window.PT_ETF_EVIDENCE?.[t];
    const last=attempts.get(t)||0;

    // If structural evidence is already loaded, keep it for the normal cache
    // window. If the provider just returned no structural evidence, do not
    // immediately retry during the same report workflow.
    if(!force){
      if(hasStructural(e)) return e;
      if(Date.now()-last < ATTEMPT_TTL) return e||null;
    }

    attempts.set(t,Date.now());
    const job=(async()=>{
      try{
        return await baseFetch(t,{force});
      } finally {
        inflight.delete(t);
      }
    })();
    inflight.set(t,job);
    return job;
  };

  window.ptLoadPortfolioETFEvidence = async function(portfolio,{force=false}={}){
    const ts=[...new Set((portfolio||[])
      .map(x=>ticker(x.ticker))
      .filter(t=>window.ptETFIsEvidenceFund?.(t)))];

    // Sequential by design: richer evidence is more valuable than bursty
    // requests that increase provider-rate-limit risk.
    for(const t of ts){
      try{ await window.ptFetchETFEvidence(t,{force}); }catch(_){}
    }
    return ts;
  };

