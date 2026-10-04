     if(td[6]&&v.m1!=null)td[6].textContent=`${v.m1*w/100>=0?'+':''}${(v.m1*w/100).toFixed(2)} pts`;
     for(const k of ['m1','m3','ytd','y1'])if(v[k]!=null){sums[k]+=v[k]*w/100;weights[k]+=w}
   }
   const total=[...table.querySelectorAll('tbody tr')].find(tr=>(tr.children[0]?.textContent||'').trim().toUpperCase()==='PORTFOLIO');
   if(total){const td=[...total.children];for(const [i,k] of [[2,'m1'],[3,'m3'],[4,'ytd'],[5,'y1']])if(weights[k]>=99.5)td[i].textContent=fmt(sums[k]);if(td[6]&&weights.m1>=99.5)td[6].textContent=`${sums.m1>=0?'+':''}${sums.m1.toFixed(2)} pts`}
   const old=page.querySelector('.pt195-impact'); if(old)old.remove();
   /* Re-run the existing visual builder now that every available security row is populated. */
   const evt=new Event('pt-v288-performance-ready');document.dispatchEvent(evt);
 }
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){
   const r=await prior.apply(this,arguments);
   patchSummary();
   const {p,map}=await fetchMissingPerformance(); patchPerformance(p,map);
   /* Existing V195 wrapper may already have run before individual-security data arrived. Build its visual again by regenerating only through its public DOM logic on next frame. */
   requestAnimationFrame(()=>{patchSummary();});
   return r;
 };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const N=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(String(v).replace(/[%+,]/g,''));return Number.isFinite(n)?n:null};
 const signed=(v,suffix='%')=>v==null?'—':`${v>=0?'+':''}${v.toFixed(2)}${suffix}`;
 function build(){
   const page=[...document.querySelectorAll('.pt150-page')].find(x=>/What moved the portfolio\./i.test(x.textContent||''));
   const table=page?.querySelector('.pt150-table'); if(!page||!table)return;
   page.querySelectorAll('.pt195-impact,.pt289-impact').forEach(x=>x.remove());
   const port=(typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:String(x.ticker||'').toUpperCase(),weight:Number(x.weight)||0})).filter(x=>x.ticker&&x.weight>0).sort((a,b)=>b.weight-a.weight);
   const rows=[];
   for(const h of port){
     const tr=[...table.querySelectorAll('tbody tr')].find(r=>(r.children[0]?.textContent||'').trim().toUpperCase()===h.ticker);
     const m1=tr?N(tr.children[2]?.textContent):null;
     rows.push({...h,m1,impact:m1==null?null:m1*h.weight/100});
   }
   const known=rows.filter(x=>x.m1!=null), total=known.length?known.reduce((a,x)=>a+(x.impact||0),0):null;
   const maxW=Math.max(...rows.map(x=>x.weight),1), maxR=Math.max(...known.map(x=>Math.abs(x.m1)),1), maxI=Math.max(...known.map(x=>Math.abs(x.impact)),.01);
   const html=`<div class="pt289-impact">
    <div class="pt289-impact-head"><div><small>ALLOCATION × PERFORMANCE</small><b>Weight × Return → Portfolio Impact</b></div><div class="pt289-impact-total"><span>Portfolio 1M</span><strong>${signed(total)}</strong></div></div>
    <div class="pt289-impact-cols"><span>Weight</span><span>1M Return</span><span>Impact</span></div>
    ${rows.map(x=>`<div class="pt289-impact-row"><strong>${x.ticker}</strong><div class="pt289-cell"><b>${x.weight.toFixed(x.weight%1?1:0)}%</b><div class="pt289-track"><i style="width:${Math.max(2,x.weight/maxW*100)}%"></i></div></div><div class="pt289-op">×</div><div class="pt289-cell"><b>${signed(x.m1)}</b><div class="pt289-track"><i style="width:${x.m1==null?0:Math.max(2,Math.abs(x.m1)/maxR*100)}%"></i></div></div><div class="pt289-op">→</div><div class="pt289-cell"><b>${x.impact==null?'—':signed(x.impact,' pts')}</b><div class="pt289-track"><i style="width:${x.impact==null?0:Math.max(2,Math.abs(x.impact)/maxI*100)}%"></i></div></div></div>`).join('')}
    <div class="pt289-impact-note"><b>How to read this:</b> The left bar shows how much capital is assigned to each holding, the middle bar shows the holding's 1-month move, and the right bar shows the resulting effect on total portfolio return.${rows.some(x=>x.m1==null)?' Holdings without verified return data remain visible and unresolved rather than being omitted.':''}</div>
   </div>`;
   table.closest('.pt150-page').querySelector('.pt150-table').insertAdjacentHTML('afterend',html);
 }
 function tidyEvidence(){const pg=document.querySelector('.pt282-evidence-page');if(pg){const d=pg.querySelector(':scope > .pt150-deck');if(d)d.remove()}}
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);build();tidyEvidence();setTimeout(()=>{build();tidyEvidence()},500);setTimeout(()=>{build();tidyEvidence()},1400);return r};
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  const originalRefresh=window.ptRefreshLibrary;
  if(typeof originalRefresh!=='function') return;

  function savedTab(){try{return localStorage.getItem('pt_library_tab')||'portfolios'}catch(_){return 'portfolios'}}
  function land(){
    try{ if(typeof ptHideReportHome==='function') ptHideReportHome(); }catch(_){}
    try{ if(typeof showSection==='function') showSection('library'); }catch(_){}
    const el=document.getElementById('library');
    if(el){ el.style.display='block'; requestAnimationFrame(()=>{try{el.scrollIntoView({block:'start'})}catch(_){}}); }
    try{ if(typeof pt228ShowLibraryTab==='function') pt228ShowLibraryTab(savedTab()); }catch(_){}
  }
  function renderLocalNow(){
    /* ptRefreshLibrary only waits when ptUser is present. Temporarily suppress the
       cloud branch so its existing local-report/watch-list renderer can paint now. */
    const user=window.ptUser;
    try{
      window.ptUser=null;
      originalRefresh();
    }catch(_){} finally {
      window.ptUser=user;
    }
  }
  async function refreshCloudLater(){
    try{
      if(window.ptSupabase){
        const {data}=await window.ptSupabase.auth.getUser();
        window.ptUser=data?.user||window.ptUser||null;
      }
      await originalRefresh();
      try{
        if(Array.isArray(window.ptLibraryPortfolioRows)&&window.ptLibraryPortfolioRows.length){
          localStorage.setItem('pt_v281_library_portfolio_cache',JSON.stringify(window.ptLibraryPortfolioRows));
        }
      }catch(_){}
    }catch(_){}
  }

  /* Final definition deliberately returns immediately. Older navigation wrappers
     may await it, but there is no network promise left to block the Library view. */
  window.ptOpenLibrary=function(){
    land();
    renderLocalNow();
    setTimeout(refreshCloudLater,0);
  };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
 function sortedPortfolio(){
   return (typeof getPortfolio==='function'?getPortfolio():[])
     .map((x,i)=>({ticker:String(x.ticker||'').toUpperCase(),weight:Number(x.weight)||0,i}))
     .filter(x=>x.ticker&&x.weight>0)
     .sort((a,b)=>b.weight-a.weight||a.i-b.i);
 }
 function apply(){
   const p=sortedPortfolio(); if(!p.length)return;
   document.querySelectorAll('.pt150-alloc').forEach(bar=>{
     bar.innerHTML=p.map(x=>`<div style="width:${x.weight}%"><span class="pt169-alloc-ticker">${esc(x.ticker)}</span><span class="pt169-alloc-weight">${x.weight.toFixed(0)}%</span></div>`).join('');
   });
 }
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){
   const r=await prior.apply(this,arguments);
   apply(); requestAnimationFrame(apply); setTimeout(apply,250); setTimeout(apply,900);
   return r;
 };
 window.pt296ApplyAllocationOrder=apply;
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior!=='function')return;
 const E=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
 function holdings(){try{return (typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:String(x.ticker||'').toUpperCase(),weight:Number(x.weight)||0,role:String(x.role||'')})).filter(x=>x.ticker&&x.weight>0)}catch(_){return []}}
 function openingCopy(p){
   const tickers=p.map(x=>x.ticker);
   const has=t=>tickers.includes(t);
   if(has('VTI')&&has('VXUS')&&(has('AVUV')||has('AVDV'))){
     return {
       headline:'Broad-market ownership forms the core, while international diversification and small/value tilts meaningfully change the portfolio’s exposure.',
       body:'The evidence shows a broad U.S. foundation, a distinct non-U.S. sleeve and targeted small/value reweighting. The report below tests how those choices interact, where overlap exists and which exposures actually drive the portfolio.'
     };
   }
   const largest=[...p].sort((a,b)=>b.weight-a.weight)[0];
   if(largest){
     return {
       headline:`${largest.ticker} anchors the portfolio, while the remaining holdings determine how far the structure moves beyond that core exposure.`,
       body:'The report below measures the portfolio beneath the ticker labels—its roles, exposures, overlap, performance drivers and the evidence that would strengthen or weaken the construction.'
     };
   }
   return {headline:'The portfolio is more than a list of holdings.',body:'The report below measures how the holdings work together, what exposures they create and which evidence matters to the portfolio thesis.'};
 }
 function polishOpening(){
   const cover=document.querySelector('.pt150-page'); if(!cover)return;
   const p=holdings(), copy=openingCopy(p);
   const deck=cover.querySelector('.pt150-deck');
   if(deck) deck.textContent='A research view of what this portfolio owns, how its holdings work together and what the current evidence says about the construction.';
   const old=cover.querySelector('.pt191-cover-question'); if(old)old.remove();
   let box=cover.querySelector('.pt225-evidence-open');
   if(!box){box=document.createElement('div');box.className='pt225-evidence-open';const alloc=cover.querySelector('.pt150-alloc');(alloc||cover.lastElementChild)?.insertAdjacentElement('beforebegin',box)}
   box.innerHTML=`<small>WHAT THE EVIDENCE SAYS</small><strong>${E(copy.headline)}</strong><p>${E(copy.body)}</p>`;
 }
 window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);polishOpening();setTimeout(polishOpening,260);return r};
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const prior=window.pt175Open,key='pt_saved_worksheets_v1';
 const load=()=>{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch(e){return[]}};
 const save=x=>localStorage.setItem(key,JSON.stringify(x));
 const val=(r,k)=>r?.values?.[k]||'';
 const num=v=>{if(v==null||v==='')return null;let n=parseFloat(String(v).replace(/[$,%\s,]/g,''));return Number.isFinite(n)?n:null};
 const fmt=n=>n==null?'—':n.toLocaleString(undefined,{maximumFractionDigits:2});
 window.pt175Open=function(id,recordId){
   if(id!=='roic')return prior(id,recordId);
   const list=document.getElementById('pt175WorksheetList'),ed=document.getElementById('pt175WorksheetEditor');list.style.display='none';ed.style.display='block';
   const rows=load(),rec=recordId?rows.find(x=>x.id===recordId):null;
   ed.innerHTML=`<button class="pt175-btn" onclick="pt263Workspace('company')">← Company Analysis</button><div class="pt175-editor" data-type="roic" data-record="${rec?.id||''}"><div class="eyebrow">COMPANY ANALYSIS · STEP 2</div><h2>ROIC & Capital Quality</h2><p>Measure how effectively the business turns operating capital into after-tax operating profit, then compare that return with its estimated cost of capital.</p>
   <div class="pt265-companybar"><div class="pt175-field"><label>Company / ticker</label><input data-field="ticker" value="${val(rec,'ticker')}" placeholder="e.g. ADBE"></div></div>
   <div class="pt265-section"><h3>Operating & Capital Evidence</h3><p>Portfolio Thesis should supply reported figures where reliable. The member's job is to evaluate what the resulting economics mean.</p><div class="pt266-evidence">
   <div class="pt265-box"><h4>Operating Profit</h4><p>Start with profit generated by the operations, independent of financing.</p><div class="pt175-field"><label>NOPAT</label><input data-field="nopat" value="${val(rec,'nopat')}"></div><div class="pt265-why"><b>Why this matters</b><br>NOPAT approximates after-tax operating profit available from the business operations.</div></div>
   <div class="pt265-box"><h4>Capital Employed</h4><p>Measure the capital committed to producing those operating profits.</p><div class="pt175-field"><label>Invested capital</label><input data-field="invested" value="${val(rec,'invested')}"></div><div class="pt265-why"><b>Why this matters</b><br>Returns only become meaningful when compared with the capital required to generate them.</div></div></div></div>
   <div class="pt265-section"><h3>Capital Quality Analysis</h3><p>ROIC is calculated from operating evidence. WACC is an estimate and should remain visibly separate from reported financial data.</p><div class="pt175-field"><label>Estimated WACC %</label><input data-field="wacc" value="${val(rec,'wacc')}" placeholder="e.g. 9.0"><div class="pt266-source">Estimate — not a reported company figure.</div></div>
   <div class="pt266-result"><div><small>ROIC</small><b id="pt266Roic">—</b></div><div><small>Est. WACC</small><b id="pt266Wacc">—</b></div><div><small>ROIC spread</small><b id="pt266Spread">—</b></div></div>
   <div class="pt175-formula"><code>ROIC = NOPAT ÷ Invested Capital × 100 &nbsp; | &nbsp; ROIC Spread = ROIC − WACC</code></div><div class="pt266-callout"><b>Interpret the spread, not just the ROIC.</b> A positive spread means the measured return on invested capital exceeds the estimated cost of that capital. Persistence and the assumptions behind both measures still matter.</div></div>
   <div class="pt265-section"><h3>Guided Interpretation</h3><div class="pt175-field pt265-prompt"><label>Is ROIC improving, stable or deteriorating over time?</label><textarea data-field="trend">${val(rec,'trend')}</textarea></div><div class="pt175-field pt265-prompt"><label>How is management allocating excess cash?</label><textarea data-field="allocation">${val(rec,'allocation')}</textarea></div><div class="pt175-field pt265-prompt"><label>Are acquisitions, buybacks or reinvestment creating durable value?</label><textarea data-field="discipline">${val(rec,'discipline')}</textarea></div><div class="pt175-field pt265-prompt"><label>What could make the apparent ROIC misleading or unsustainable?</label><textarea data-field="risk">${val(rec,'risk')}</textarea></div></div>
   <div class="pt265-section"><h3>Capital Quality Summary</h3><p>Capture the evidence that should carry forward into Valuation and the Investment Thesis.</p><div class="pt175-field"><textarea data-field="conclusion" placeholder="Summarize ROIC, the estimated cost of capital, the spread, capital-allocation quality and the most important item to monitor.">${val(rec,'conclusion')}</textarea></div></div>
