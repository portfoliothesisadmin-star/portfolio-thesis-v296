 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){
   const r=await prior.apply(this,arguments);
   run(); setTimeout(run,450); setTimeout(run,1200); setTimeout(run,2600);
   return r;
 };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  /* 4. Library: show cached signed-in portfolio metadata immediately while sync refreshes. */
  const LIBCACHE='pt_v281_library_portfolio_cache';
  function readCache(){try{return JSON.parse(localStorage.getItem(LIBCACHE)||'[]')}catch(_){return []}}
  function writeCache(rows){try{localStorage.setItem(LIBCACHE,JSON.stringify(rows||[]))}catch(_){}}
  function quickLibrary(rows){
    const host=document.getElementById('ptLibraryPortfolios'); if(!host||!rows?.length)return;
    host.innerHTML=rows.map((p,i)=>{
      const h=p.holdings||p.portfolio||p.data||[];
      const desc=Array.isArray(h)?h.map(x=>`${esc(x.ticker||x.symbol||'')} ${N(x.weight??x.allocation)??''}%`).join(' · '):'Saved member portfolio';
      return `<div class="pt-library-card"><b>${esc(p.name||'Portfolio')}</b><p>${desc}</p><div class="pt-library-actions"><button class="btn" disabled>Syncing library…</button></div></div>`;
    }).join('');
  }
  const oldOpen=window.ptOpenLibrary;
  if(typeof oldOpen==='function')window.ptOpenLibrary=async function(){
    quickLibrary(readCache());
    const r=await oldOpen.apply(this,arguments);
    if(Array.isArray(window.ptLibraryPortfolioRows)&&window.ptLibraryPortfolioRows.length)writeCache(window.ptLibraryPortfolioRows);
    return r;
  };


})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const norm=v=>String(v||'').trim().toUpperCase();
 const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 function portfolio(){try{return (getPortfolio()||[]).map(x=>({ticker:norm(x.ticker),weight:Number(x.weight)||0})).filter(x=>x.ticker&&x.weight>0).sort((a,b)=>b.weight-a.weight)}catch(_){return []}}
 function isFund(t){return ['VTI','VOO','VXUS','AVUV','AVDV','QQQM','SCHD','BND','VNQ','GLD'].includes(norm(t))||!!window.PT_ETFS?.has?.(norm(t))}
 function failureCard(t,w,msg){
  return `<div class="pt284-head"><div><small>PORTFOLIO THESIS / DEEP VALUE RESEARCH</small><b>${esc(t)}</b><span>${w.toFixed(0)}% OF PORTFOLIO</span></div><div class="pt284-role"><small>CURRENT ROLE</small><strong>Direct company position</strong></div></div>
  <table><thead><tr><th>COMPONENT</th><th>CURRENT READING</th><th>READ</th></tr></thead><tbody>
  <tr><td>Financial strength</td><td>—</td><td>Unresolved</td></tr>
  <tr><td>Earning power</td><td>—</td><td>Unresolved</td></tr>
  <tr><td>Cash generation & quality</td><td>—</td><td>Unresolved</td></tr>
  <tr><td>Capital discipline</td><td>—</td><td>Unresolved</td></tr>
  <tr><td>Valuation</td><td>—</td><td>Unresolved</td></tr></tbody></table>
  <div class="pt284-section"><small>THE THESIS</small><h3>${esc(t)} must continue to justify its company-specific role and ${w.toFixed(0)}% portfolio weight.</h3></div>
  <div class="pt284-pair"><div><small>EVIDENCE FOR</small><p>Current Deep Value evidence is unavailable, so Portfolio Thesis does not invent support.</p></div><div><small>EVIDENCE AGAINST</small><p>The company thesis remains unresolved until current or cached company evidence is available.</p></div></div>
  <div class="pt284-section"><small>THESIS BREAKPOINT</small><p>A material deterioration in financial strength, earning power, cash generation, capital discipline, valuation, or the evidence supporting the company thesis.</p></div>
  <div class="pt284-section"><small>RESEARCH STATUS</small><p>${esc(msg||'Automatic Deep Value research is currently unavailable.')}</p></div>
  <button class="pt284-open" onclick="ptOpenCompanyFromPortfolio('${esc(t)}')">Open Deep Value Report</button>`;
 }
 function normalize(){
   const stocks=portfolio().filter(x=>!isFund(x.ticker));
   stocks.forEach(s=>{
     let el=document.getElementById('ptPDV-'+s.ticker);
     if(!el){
       el=[...document.querySelectorAll('.pt159-card,.ptr-individual-card')].find(x=>norm(x.querySelector('b')?.textContent)===s.ticker);
     }
     if(!el)return;
     // Preserve a completed V282/V283 table; normalize only the old asynchronous failure shell.
     if(/Automatic Deep Value research failed|Edge Function returned a non-2xx/i.test(el.textContent||'')){
       const msg=(el.textContent||'').match(/Automatic Deep Value research failed\.?\s*([^]*?)(?:The portfolio report|Open Deep Value)/i)?.[1]?.trim() || 'Automatic Deep Value research failed. The data service returned a non-2xx response.';
       el.className='pt284-dv-card'; el.id='ptPDV-'+s.ticker; el.innerHTML=failureCard(s.ticker,s.weight,msg);
     }
   });
 }
 function watch(){
   normalize();
   const report=document.querySelector('.pt150-report');
   if(!report)return;
   const mo=new MutationObserver(()=>normalize());
   mo.observe(report,{childList:true,subtree:true,characterData:true});
   setTimeout(()=>mo.disconnect(),12000);
 }
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){
   const r=await prior.apply(this,arguments); watch(); return r;
 };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 function convert(root=document){
   root.querySelectorAll('.pt284-dv-card').forEach(el=>{
     el.classList.add('pt159-card');
     const head=el.querySelector('.pt284-head'); if(head) head.className='pt159-head';
     const role=el.querySelector('.pt284-role'); if(role) role.className='pt159-role';
     const table=el.querySelector('table'); if(table) table.className='pt159-table';
     const secs=[...el.querySelectorAll('.pt284-section')];
     secs.forEach(sec=>{
       const label=(sec.querySelector('small')?.textContent||'').trim().toUpperCase();
       if(label==='THE THESIS'){
         sec.className='pt159-thesis pt159-section';
         const h=sec.querySelector('h3');
         if(h){const b=document.createElement('b');b.innerHTML=h.innerHTML;h.replaceWith(b)}
       } else {
         sec.className='pt159-bottom pt159-section';
       }
     });
     const pair=el.querySelector('.pt284-pair');
     if(pair){
       pair.className='pt159-two';
       [...pair.children].forEach(ch=>ch.classList.add('pt159-section'));
     }
   });
 }
 convert();
 const report=document.querySelector('.pt150-report');
 if(report){
   const mo=new MutationObserver(()=>convert(report));
   mo.observe(report,{childList:true,subtree:true});
   setTimeout(()=>mo.disconnect(),12000);
 }
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  const CACHE_KEY='pt_company_data_cache_v287';
  const MAX_AGE=24*60*60*1000;
  const inflight=new Map();

  function tickerFrom(body){
    return String(body?.ticker||body?.symbol||'').trim().toUpperCase();
  }
  function readCache(){
    try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'{}')||{}}catch(_){return{}}
  }
  function cached(t){
    const row=readCache()[t];
    if(!row||!row.data||!row.savedAt)return null;
    if(Date.now()-Number(row.savedAt)>MAX_AGE)return null;
    return row.data;
  }
  function save(t,data){
    if(!t||!data||data.error)return;
    try{
      const all=readCache();
      all[t]={savedAt:Date.now(),data};
      localStorage.setItem(CACHE_KEY,JSON.stringify(all));
    }catch(_){}
  }
  function errText(e){
    return String(e?.message||e?.context?.message||e?.context?.error||e||'').trim();
  }
  async function wait(ms){return new Promise(r=>setTimeout(r,ms))}

  function install(){
    const f=window.ptSupabase?.functions;
    if(!f?.invoke || f.invoke.__ptV287)return false;

    const raw=f.invoke.bind(f);

    async function companyInvoke(name,options={}){
      if(name!=='deep-value-data') return raw(name,options);

      const t=tickerFrom(options.body);
      if(!t) return raw(name,options);

      const hit=cached(t);
      if(hit) return {data:hit,error:null,__ptSource:'local-company-cache'};

      if(inflight.has(t)) return inflight.get(t);

      const job=(async()=>{
        let last=null;
        const bodies=[
          {...(options.body||{}),ticker:t},
          {...(options.body||{}),ticker:t,symbol:t},
          {symbol:t,ticker:t}
        ];
        for(let i=0;i<bodies.length;i++){
          try{
            const res=await raw(name,{...options,body:bodies[i]});
            if(!res?.error && res?.data && !res.data.error){
              save(t,res.data);
              return {...res,__ptSource:i===0?'deep-value-data':'deep-value-data-retry'};
            }
            last=res?.error||new Error(res?.data?.error||'No company data returned.');
          }catch(e){last=e}
          if(i<bodies.length-1) await wait(250*(i+1));
        }

        /* A failed refresh must not erase a previously captured company snapshot. */
        const stale=readCache()[t]?.data;
        if(stale) return {data:stale,error:null,__ptSource:'stale-company-cache'};

        return {data:null,error:last||new Error('Company research service did not return data.')};
      })().finally(()=>inflight.delete(t));

      inflight.set(t,job);
      return job;
    }
    companyInvoke.__ptV287=true;
    companyInvoke.__ptRaw=raw;
    f.invoke=companyInvoke;
    return true;
  }

  /* Supabase is created by the main application before this patch in normal use.
     Poll briefly as a safeguard for slower mobile parsing. */
  if(!install()){
    let n=0;
    const timer=setInterval(()=>{
      n++;
      if(install()||n>80)clearInterval(timer);
    },50);
  }

  window.ptCompanyResearchCache={
    get:t=>cached(String(t||'').toUpperCase()),
    clear:t=>{
      const all=readCache();
      if(t) delete all[String(t).toUpperCase()];
      else Object.keys(all).forEach(k=>delete all[k]);
      localStorage.setItem(CACHE_KEY,JSON.stringify(all));
    }
  };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const norm=t=>String(t||'').trim().toUpperCase();
 const N=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(String(v).replace(/[%+,]/g,''));return Number.isFinite(n)?n:null};
 const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
 const known=new Set(Object.keys(window.DB||{}));
 const state=new Map();
 const inflight=new Map();

 function statusEl(row){
   let s=row.querySelector('.pt291-ticker-status');
   if(!s){s=document.createElement('span');s.className='pt291-ticker-status';row.querySelector('.security-name')?.insertAdjacentElement('afterend',s)}
   return s;
 }
 function setState(row,t,kind,msg){
   if(!row)return; const s=statusEl(row); s.className='pt291-ticker-status '+kind;s.textContent=msg||'';
   row.classList.toggle('pt291-invalid',kind==='bad'); if(t)state.set(t,kind);
 }
 function hasTicker(root,t){
   let yes=false,seen=new Set();
   function rec(o){if(yes||!o||typeof o!=='object'||seen.has(o))return;seen.add(o);if(norm(o.ticker||o.symbol||o.security?.ticker||o.security?.symbol)===t){yes=true;return}Object.values(o).forEach(rec)}
   rec(root);return yes;
 }
 async function validateTicker(t){
   t=norm(t); if(!t)return false; if(known.has(t))return true;
   if(state.get(t)==='ok')return true;if(state.get(t)==='bad')return false;if(inflight.has(t))return inflight.get(t);
   const job=(async()=>{
     try{
       if(!window.ptSupabase?.functions?.invoke)return null;
       const r=await window.ptSupabase.functions.invoke('security-performance',{body:{tickers:[t],ticker:t,symbol:t}});
       if(!r?.error && r?.data && hasTicker(r.data,t))return true;
       return false;
     }catch(_){return null}
   })().finally(()=>inflight.delete(t));
   inflight.set(t,job);return job;
 }
 async function validateRow(row,force=false){
   const input=row?.querySelector('.ticker');const t=norm(input?.value);if(!t){setState(row,'','pending','Enter a ticker.');return false}
   if(known.has(t)){setState(row,t,'ok','Ticker recognized');return true}
   if(!force && state.get(t)==='ok'){setState(row,t,'ok','Ticker recognized');return true}
   setState(row,t,'pending','Checking ticker…');
   const ok=await validateTicker(t);
   if(ok===true){state.set(t,'ok');setState(row,t,'ok','Ticker recognized');return true}
   if(ok===false){state.set(t,'bad');setState(row,t,'bad','Ticker not recognized — check symbol');return false}
   setState(row,t,'pending','Ticker could not be verified — try again');return false;
 }
 async function validateAll(){
   const rows=[...document.querySelectorAll('#rows .holding')];
   const results=await Promise.all(rows.map(r=>validateRow(r,true)));
   const bad=results.some(x=>x!==true);
   let box=document.getElementById('pt291BuilderError');
   if(!box){box=document.createElement('div');box.id='pt291BuilderError';box.className='pt291-builder-error';document.querySelector('#builder .btn.analyze')?.insertAdjacentElement('beforebegin',box)}
   if(box){box.style.display=bad?'block':'none';box.textContent=bad?'Resolve the highlighted ticker before generating the portfolio report.':''}
   return !bad;
 }
 let timer=null;
 document.addEventListener('input',e=>{
   if(!e.target?.matches?.('#rows .ticker'))return;
   const row=e.target.closest('.holding'),t=norm(e.target.value);row?.classList.remove('pt291-invalid');
   const s=statusEl(row);s.textContent='';s.className='pt291-ticker-status';clearTimeout(timer);
   timer=setTimeout(()=>validateRow(row,false),450);
 },true);
 document.addEventListener('focusout',e=>{if(e.target?.matches?.('#rows .ticker'))validateRow(e.target.closest('.holding'),false)},true);

 // Gate the real Analyze button before its existing onclick/report listener can run.
 document.addEventListener('click',async e=>{
   const b=e.target?.closest?.('#builder .btn.analyze');if(!b)return;
   if(b.dataset.pt291Pass==='1'){b.dataset.pt291Pass='';return}
   e.preventDefault();e.stopImmediatePropagation();
   b.disabled=true;const old=b.textContent;b.textContent='Validating tickers…';
   const ok=await validateAll();b.disabled=false;b.textContent=old;
   if(ok){b.dataset.pt291Pass='1';b.click()}
 },true);

 function portfolio(){try{return (getPortfolio()||[]).map(x=>({ticker:norm(x.ticker),weight:Number(x.weight)||0})).filter(x=>x.ticker&&x.weight>0).sort((a,b)=>b.weight-a.weight)}catch(_){return []}}
 function isFund(t){return !!window.PT_ETF_EVIDENCE?.[t]||!!window.PT_ETFS?.has?.(t)||['VTI','VXUS','AVUV','AVDV','VOO','VT','VEA','VWO','SPY','QQQ','QQQM','IWM','SCHD','BND','VNQ','GLD'].includes(t)}

 function mergeDirectLookthrough(){
   const direct=portfolio().filter(x=>!isFund(x.ticker));if(!direct.length)return;
   const chart=[...document.querySelectorAll('.pt150-chart')].find(x=>/Largest effective companies/i.test(x.querySelector('h3')?.textContent||''));if(!chart)return;
   // V292: capture the fund-only look-through exactly once. Re-renders may run this patch
   // several times, so never use a previously augmented value as the new indirect base.
   let base={};
   try{base=JSON.parse(chart.dataset.pt292Indirect||'{}')}catch(_){base={}}
   if(!Object.keys(base).length){
     [...chart.querySelectorAll('.pt150-barrow')].forEach(r=>{
       const t=norm(r.children[0]?.textContent),v=N(r.querySelector('strong')?.textContent);
       if(t&&v!=null)base[t]=(base[t]||0)+v;
     });
     chart.dataset.pt292Indirect=JSON.stringify(base);
   }
   const values={...base};
   direct.forEach(d=>{values[d.ticker]=(base[d.ticker]||0)+d.weight});
   const live=Object.entries(values).map(([t,v])=>({t,v:Number(v)||0})).sort((a,b)=>b.v-a.v).slice(0,10);
   const max=Math.max(...live.map(x=>x.v),1);
   [...chart.querySelectorAll('.pt150-barrow')].forEach(r=>r.remove());
   live.forEach(x=>{
     const r=document.createElement('div');r.className='pt150-barrow';
     r.innerHTML=`<span>${esc(x.t)}</span><div class="pt150-bar"><i style="width:${Math.max(2,x.v/max*100)}%"></i></div><strong>${x.v.toFixed(2)}%</strong>`;
     chart.appendChild(r);
   });
   window.__pt291EffectiveCompanies=Object.fromEntries(live.map(x=>[x.t,x.v]));
 }

 function addDirectFinding(){
   const direct=portfolio().filter(x=>!isFund(x.ticker));if(!direct.length)return;
   const page=[...document.querySelectorAll('.pt150-page')].find(x=>/PORTFOLIO FINDINGS/i.test(x.textContent||''));if(!page)return;
   page.querySelectorAll('.pt291-direct-finding').forEach(x=>x.remove());
   const host=page.querySelector('.pt201-findings')||page.querySelector('.pt191-lenses')||page;
   direct.forEach(d=>{
     const eff=N(window.__pt291EffectiveCompanies?.[d.ticker]);const indirect=eff==null?null:Math.max(0,eff-d.weight);
     const box=document.createElement('div');box.className=page.querySelector('.pt201-finding')?'pt201-finding pt291-direct-finding':'pt149-find pt291-direct-finding';
     const count=page.querySelectorAll('.pt201-finding,.pt291-direct-finding').length+1;
     const exposure=eff!=null?`The ${d.weight.toFixed(1)}% direct position sits on top of about ${indirect.toFixed(2)}% of look-through ownership through the funds, producing roughly ${eff.toFixed(2)}% effective exposure.`:`The portfolio assigns ${d.weight.toFixed(1)}% directly to ${d.ticker}, in addition to any ownership already embedded inside its funds.`;
     box.innerHTML=`<small>FINDING ${String(count).padStart(2,'0')}</small><b>${esc(d.ticker)} is an intentional company-level concentration, not a separate source of diversification.</b><p>${esc(exposure)} The direct position should therefore be judged as an active increase in company-specific exposure and incorporated into the portfolio concentration thesis.</p>`;
     host.appendChild(box);
   });
 }

 function enrichCompanyCards(){
   portfolio().filter(x=>!isFund(x.ticker)).forEach(d=>{
     const c=document.getElementById('ptPDV-'+d.ticker);if(!c)return;
     const rows=[...c.querySelectorAll('tbody tr')],vals={};
     rows.forEach(r=>{vals[(r.children[0]?.textContent||'').trim()]=N(r.children[1]?.textContent)});
     const fs=vals['Financial strength'],ep=vals['Earning power'],cg=vals['Cash generation & quality'],cd=vals['Capital discipline'],va=vals['Valuation'];
     const sections=[...c.querySelectorAll('.pt159-section')];
     const section=label=>sections.find(s=>(s.querySelector('small')?.textContent||'').toUpperCase().includes(label));
     const snap=section('EVIDENCE SNAPSHOT'),snapText=snap?.querySelector('p')?.textContent||'';
     const price=N((snapText.match(/Market price\s*\$([\d,.]+)/i)||[])[1]);
     const value=N((snapText.match(/normalized value\s*\$([\d,.]+)/i)||[])[1]);
     const premium=price!=null&&value>0?(price/value-1)*100:null;
     const eff=N(window.__pt291EffectiveCompanies?.[d.ticker]);
     const indirect=eff==null?null:Math.max(0,eff-d.weight);

     const thesis=c.querySelector('.pt159-thesis b');
     if(thesis) thesis.textContent=`${d.ticker} is a deliberate ${d.weight.toFixed(0)}% company position${indirect!=null&&indirect>0?`, layered on about ${indirect.toFixed(2)}% of indirect fund ownership`:''}. The thesis depends on strong operating quality continuing to justify the valuation and the resulting company-level concentration.`;

     const yes=section('EVIDENCE FOR')||section('SUPPORTS');
     if(yes){
       const p=yes.querySelector('p');
       if(p){
         const strong=[]; if(ep>=16)strong.push('earning power'); if(cg>=16)strong.push('cash generation'); if(cd>=16)strong.push('capital discipline');
         p.textContent=strong.length>=2?`The measured company evidence is strongest across ${strong.join(', ')}. Those categories are simultaneously in the strong range, so the support is coming from operating and capital-allocation quality rather than from valuation.`:'Current company evidence does not show enough strong operating categories to establish a clear positive case.';
       }
     }
     const no=section('EVIDENCE AGAINST')||section('CHALLENGES');
     if(no){
       const p=no.querySelector('p');
       if(p){
         if(premium!=null&&premium>0)p.textContent=`Valuation is the central tension. The research snapshot uses a market price of $${price.toFixed(2)} versus normalized value of $${value.toFixed(2)}, a ${premium.toFixed(1)}% premium to that normalized-value estimate. That leaves little support from price and makes future execution carry more of the thesis.`;
         else if(va!=null)p.textContent=`Valuation is the main measured weakness (${va.toFixed(0)}/20). The position therefore depends more heavily on future business execution than on a current valuation cushion.`;
       }
     }
     const bp=section('THESIS BREAKPOINT')||section('WHAT WOULD CHANGE');
     if(bp){
       const p=bp.querySelector('p');
       if(p)p.textContent=`Re-test the thesis if earning power or cash-generation quality falls below the supportive range, capital discipline materially weakens, or the gap between market price and normalized value remains extreme without corresponding improvement in normalized value. Because this is a direct position layered on fund ownership, a rising effective ${d.ticker} concentration is also a portfolio-level breakpoint.`;
     }
   });
 }
 function run(){mergeDirectLookthrough();addDirectFinding();enrichCompanyCards()}
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);run();setTimeout(run,500);setTimeout(run,1400);return r};
})();
