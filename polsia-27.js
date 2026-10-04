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
