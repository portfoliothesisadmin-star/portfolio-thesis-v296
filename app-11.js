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
   <div class="pt265-actions"><button class="pt175-btn primary" onclick="pt266Save(true)">Save & Continue to Valuation →</button><button class="pt175-btn" onclick="pt266Save(false)">Save worksheet</button><button class="pt175-btn" onclick="pt263Workspace('company')">Close</button></div><div id="pt175SaveMsg" class="pt175-saved">${rec?'Last saved '+new Date(rec.savedAt).toLocaleString():''}</div></div>`;
   const priorFinancial=rows.find(x=>x.type==='financials');if(!val(rec,'ticker')&&priorFinancial?.values?.ticker){ed.querySelector('[data-field="ticker"]').value=priorFinancial.values.ticker}
   const calc=()=>{const get=k=>num(ed.querySelector(`[data-field="${k}"]`)?.value),n=get('nopat'),i=get('invested'),w=get('wacc'),r=n!==null&&i?100*n/i:null,s=r!==null&&w!==null?r-w:null;document.getElementById('pt266Roic').textContent=r===null?'—':r.toFixed(1)+'%';document.getElementById('pt266Wacc').textContent=w===null?'—':w.toFixed(1)+'%';document.getElementById('pt266Spread').textContent=s===null?'—':(s>=0?'+':'')+s.toFixed(1)+' pp'};ed.querySelectorAll('input').forEach(x=>x.addEventListener('input',calc));calc();window.scrollTo(0,0);
 };
 window.pt266Save=function(next){const ed=document.querySelector('#pt175WorksheetEditor .pt175-editor');if(!ed)return;const values={};ed.querySelectorAll('[data-field]').forEach(x=>values[x.dataset.field]=x.value);let rows=load(),id=ed.dataset.record||('ws_'+Date.now()),row={id,type:'roic',values,savedAt:new Date().toISOString()};const i=rows.findIndex(x=>x.id===id);if(i>=0)rows[i]=row;else rows.unshift(row);save(rows);ed.dataset.record=id;const m=document.getElementById('pt175SaveMsg');if(m)m.textContent='Saved to My Worksheets · '+new Date().toLocaleString();if(next)setTimeout(()=>window.pt175Open('valuation'),120)};
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const prior=window.pt175Open,key='pt_saved_worksheets_v1';
 const load=()=>{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch(e){return[]}}, save=x=>localStorage.setItem(key,JSON.stringify(x));
 const E=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
 const val=(r,k)=>E(r?.values?.[k]||''), num=v=>{if(v==null||v==='')return null;let n=parseFloat(String(v).replace(/[$,%\s,]/g,''));return Number.isFinite(n)?n:null};
 function latest(type){return load().find(x=>x.type===type)}
 function ticker(rec){return val(rec,'ticker')||E(latest('financials')?.values?.ticker||latest('etf')?.values?.ticker||'')}
 function shell(id,rec,step,title,desc,body,workspace='company'){const list=document.getElementById('pt175WorksheetList'),ed=document.getElementById('pt175WorksheetEditor');list.style.display='none';ed.style.display='block';ed.innerHTML=`<button class="pt175-btn" onclick="pt263Workspace('${workspace}')">← ${workspace==='company'?'Company Analysis':workspace==='fund'?'Fund & ETF Analysis':'Portfolio Analysis'}</button><div class="pt175-editor" data-type="${id}" data-record="${rec?.id||''}"><div class="eyebrow">${step}</div><h2>${title}</h2><p>${desc}</p>${body}<div id="pt175SaveMsg" class="pt175-saved">${rec?'Last saved '+new Date(rec.savedAt).toLocaleString():''}</div></div>`;window.scrollTo(0,0);return ed}
 function persist(next,nextId,workspace){const ed=document.querySelector('#pt175WorksheetEditor .pt175-editor');if(!ed)return;const values={};ed.querySelectorAll('[data-field]').forEach(x=>values[x.dataset.field]=x.value);let rows=load(),id=ed.dataset.record||('ws_'+Date.now()),row={id,type:ed.dataset.type,values,savedAt:new Date().toISOString()};const i=rows.findIndex(x=>x.id===id);if(i>=0)rows[i]=row;else rows.unshift(row);save(rows);ed.dataset.record=id;const m=document.getElementById('pt175SaveMsg');if(m)m.textContent='Saved to My Worksheets · '+new Date().toLocaleString();if(next&&nextId)setTimeout(()=>window.pt175Open(nextId),100);else if(next&&workspace)setTimeout(()=>window.pt263Workspace(workspace),100)}
 window.pt267Save=persist;
 window.pt175Open=function(id,recordId){
  if(['financials','roic'].includes(id))return prior(id,recordId);
  const rec=recordId?load().find(x=>x.id===recordId):null;
  if(id==='valuation') return valuation(rec); if(id==='dcf')return dcf(rec); if(id==='mos')return mos(rec); if(id==='thesis')return thesis(rec); if(id==='etf')return etf(rec); if(id==='role')return role(rec); if(id==='overlap')return overlap(rec); if(id==='review')return review(rec); return prior(id,recordId);
 };
 function field(k,l,v='',ta=false,ph=''){return `<div class="pt175-field"><label>${l}</label>${ta?`<textarea data-field="${k}" placeholder="${ph}">${v}</textarea>`:`<input data-field="${k}" value="${v}" placeholder="${ph}">`}</div>`}
 function valuation(r){let body=`<div class="pt265-companybar">${field('ticker','Company / ticker',ticker(r),false,'e.g. ADBE')}</div><div class="pt267-section"><h3>Current Valuation Evidence</h3><p>Use market multiples to understand what investors are paying today. Reported and market data should ultimately populate automatically.</p><div class="pt267-cards"><div class="pt267-card"><h4>Price & Earnings</h4>${field('price','Share price',val(r,'price'))}${field('eps','EPS',val(r,'eps'))}</div><div class="pt267-card"><h4>Cash Flow</h4>${field('fcfps','FCF per share',val(r,'fcfps'))}${field('evEbitda','EV / EBITDA',val(r,'evEbitda'))}</div><div class="pt267-card"><h4>Context</h4>${field('histPE','Historical P/E range',val(r,'histPE'))}${field('peerPE','Peer / sector P/E',val(r,'peerPE'))}</div></div></div><div class="pt267-section"><h3>Calculated Context</h3><div class="pt267-metrics"><div><small>P/E</small><b id="vPE">—</b></div><div><small>FCF yield</small><b id="vFCF">—</b></div><div><small>Earnings yield</small><b id="vEY">—</b></div></div><div class="pt175-formula"><code>P/E = Price ÷ EPS &nbsp; | &nbsp; FCF Yield = FCF/share ÷ Price</code></div></div><div class="pt267-section"><h3>Guided Interpretation</h3>${field('history','How does today’s valuation compare with the company’s own history?',val(r,'history'),true)}${field('deserve','What could justify a higher or lower multiple?',val(r,'deserve'),true)}${field('normalized','Are earnings or FCF unusually high or low right now?',val(r,'normalized'),true)}</div><div class="pt267-section"><h3>Valuation Context Summary</h3>${field('conclusion','What does the market appear to be pricing in?',val(r,'conclusion'),true,'Summarize the valuation evidence without assigning a single fair value.')}</div><div class="pt267-actions"><button class="pt175-btn primary" onclick="pt267Save(true,'dcf')">Save & Continue to DCF →</button><button class="pt175-btn" onclick="pt267Save(false)">Save worksheet</button></div>`;let ed=shell('valuation',r,'COMPANY ANALYSIS · STEP 3','Valuation Worksheet','Put today’s market price in context before estimating intrinsic value.',body);let calc=()=>{let p=num(ed.querySelector('[data-field=price]').value),e=num(ed.querySelector('[data-field=eps]').value),f=num(ed.querySelector('[data-field=fcfps]').value);document.getElementById('vPE').textContent=p&&e?(p/e).toFixed(1)+'×':'—';document.getElementById('vFCF').textContent=p&&f?(100*f/p).toFixed(1)+'%':'—';document.getElementById('vEY').textContent=p&&e?(100*e/p).toFixed(1)+'%':'—'};ed.querySelectorAll('input').forEach(x=>x.oninput=calc);calc()}
 function dcf(r){let body=`<div class="pt265-companybar">${field('ticker','Company / ticker',ticker(r))}</div><div class="pt267-section"><h3>Starting Evidence</h3><p>Start with normalized cash flow and capital structure. These are factual inputs; growth and discount rates below are assumptions.</p><div class="pt267-cards"><div class="pt267-card">${field('fcf','Normalized starting FCF',val(r,'fcf'))}</div><div class="pt267-card">${field('netDebt','Net debt',val(r,'netDebt'))}</div><div class="pt267-card">${field('shares','Diluted shares',val(r,'shares'))}</div></div></div><div class="pt267-section"><h3>Base Assumptions</h3><div class="pt267-cards"><div class="pt267-card">${field('growth','5-year FCF growth %',val(r,'growth'),false,'8')}</div><div class="pt267-card">${field('discount','Discount rate %',val(r,'discount'),false,'10')}</div><div class="pt267-card">${field('terminal','Terminal growth %',val(r,'terminal'),false,'2.5')}</div></div><div class="pt267-callout">Assumptions are intentionally editable. A DCF is most useful as a range and sensitivity test, not as a precise prediction.</div></div><div class="pt267-section"><h3>DCF Valuation Range</h3><div class="pt267-metrics"><div><small>Conservative</small><b id="dLow">—</b></div><div><small>Base</small><b id="dBase">—</b></div><div><small>Favorable</small><b id="dHigh">—</b></div></div><table class="pt267-sensitivity"><tr><th>Scenario</th><th>Growth</th><th>Discount</th><th>Value/share</th></tr><tr><td>Conservative</td><td id="dg1">—</td><td id="dd1">—</td><td id="dv1">—</td></tr><tr><td>Base</td><td id="dg2">—</td><td id="dd2">—</td><td id="dv2">—</td></tr><tr><td>Favorable</td><td id="dg3">—</td><td id="dd3">—</td><td id="dv3">—</td></tr></table></div><div class="pt267-section"><h3>Interpretation</h3>${field('assumptions','Which assumptions matter most to the result?',val(r,'assumptions'),true)}${field('evidence','What evidence supports or challenges those assumptions?',val(r,'evidence'),true)}</div><div class="pt267-section"><h3>DCF Summary</h3>${field('conclusion','Valuation range and key uncertainty',val(r,'conclusion'),true)}</div><div class="pt267-actions"><button class="pt175-btn primary" onclick="pt267Save(true,'mos')">Save & Continue to Margin of Safety →</button><button class="pt175-btn" onclick="pt267Save(false)">Save worksheet</button></div>`;let ed=shell('dcf',r,'COMPANY ANALYSIS · STEP 4','DCF Worksheet','Estimate a valuation range and make the assumptions visible.',body);function value(g,d){let f=num(ed.querySelector('[data-field=fcf]').value),nd=num(ed.querySelector('[data-field=netDebt]').value)||0,sh=num(ed.querySelector('[data-field=shares]').value),tg=num(ed.querySelector('[data-field=terminal]').value);if(f==null||sh==null||!sh||g==null||d==null||tg==null||d<=tg)return null;g/=100;d/=100;tg/=100;let pv=0,c=f;for(let i=1;i<=5;i++){c*=1+g;pv+=c/Math.pow(1+d,i)}let tv=c*(1+tg)/(d-tg);return (pv+tv/Math.pow(1+d,5)-nd)/sh}function calc(){let g=num(ed.querySelector('[data-field=growth]').value),d=num(ed.querySelector('[data-field=discount]').value);[[g-2,d+1,'dLow','dg1','dd1','dv1'],[g,d,'dBase','dg2','dd2','dv2'],[g+2,d-1,'dHigh','dg3','dd3','dv3']].forEach(a=>{let v=value(a[0],a[1]);document.getElementById(a[2]).textContent=v==null?'—':'$'+v.toFixed(2);document.getElementById(a[3]).textContent=a[0]==null?'—':a[0].toFixed(1)+'%';document.getElementById(a[4]).textContent=a[1]==null?'—':a[1].toFixed(1)+'%';document.getElementById(a[5]).textContent=v==null?'—':'$'+v.toFixed(2)})}ed.querySelectorAll('input').forEach(x=>x.oninput=calc);calc()}
 function mos(r){let d=latest('dcf'),pref=val(r,'value')||'',body=`<div class="pt265-companybar">${field('ticker','Company / ticker',ticker(r))}</div><div class="pt267-section"><h3>Valuation Basis</h3><p>Use an estimate from DCF or another documented valuation method. Margin of safety does not replace the valuation work.</p>${field('value','Estimated value per share',pref,false,'e.g. 300')}${field('price','Current market price',val(r,'price'))}</div><div class="pt267-section"><h3>Required Cushion</h3>${field('required','Required margin of safety %',val(r,'required'),false,'25')}<div class="pt267-pills"><button type="button" onclick="pt267MosPreset(10)">10%</button><button type="button" onclick="pt267MosPreset(20)">20%</button><button type="button" onclick="pt267MosPreset(25)">25%</button><button type="button" onclick="pt267MosPreset(30)">30%</button></div><div class="pt267-metrics" style="margin-top:12px"><div><small>Current cushion</small><b id="mCur">—</b></div><div><small>Required cushion</small><b id="mReq">—</b></div><div><small>Corresponding price</small><b id="mTarget">—</b></div></div></div><div class="pt267-section"><h3>Valuation Uncertainty</h3>${field('risk','What could make the value estimate wrong?',val(r,'risk'),true)}${field('monitor','What evidence should be monitored before relying on this estimate?',val(r,'monitor'),true)}</div><div class="pt267-section"><h3>Margin of Safety Summary</h3>${field('conclusion','Document the valuation basis, current cushion and required cushion.',val(r,'conclusion'),true)}</div><div class="pt267-actions"><button class="pt175-btn primary" onclick="pt267Save(true,'thesis')">Save & Continue to Thesis →</button><button class="pt175-btn" onclick="pt267Save(false)">Save worksheet</button></div>`;let ed=shell('mos',r,'COMPANY ANALYSIS · STEP 5','Margin of Safety Worksheet','Apply a deliberate valuation cushion without repeating the DCF.',body);let calc=()=>{let v=num(ed.querySelector('[data-field=value]').value),p=num(ed.querySelector('[data-field=price]').value),q=num(ed.querySelector('[data-field=required]').value);document.getElementById('mCur').textContent=v&&p?((v-p)/v*100).toFixed(1)+'%':'—';document.getElementById('mReq').textContent=q==null?'—':q.toFixed(1)+'%';document.getElementById('mTarget').textContent=v&&q!=null?'$'+(v*(1-q/100)).toFixed(2):'—'};window.pt267MosPreset=x=>{ed.querySelector('[data-field=required]').value=x;calc()};ed.querySelectorAll('input').forEach(x=>x.oninput=calc);calc()}
 function thesis(r){let body=`<div class="pt265-companybar">${field('ticker','Company / ticker',ticker(r))}</div><div class="pt267-section"><h3>Core Argument</h3>${field('business','What does the business do and what matters economically?',val(r,'business'),true)}${field('mispriced','Why might the market be mispricing it?',val(r,'mispriced'),true)}</div><div class="pt267-section"><h3>Evidence</h3>${field('supports','Strongest evidence supporting the thesis',val(r,'supports'),true)}${field('challenges','Strongest evidence against the thesis',val(r,'challenges'),true)}${field('valuation','What does the valuation work imply?',val(r,'valuation'),true)}</div><div class="pt267-section"><h3>Falsification & Monitoring</h3>${field('breakers','What specific evidence would break the thesis?',val(r,'breakers'),true)}${field('monitor','What needs to be monitored?',val(r,'monitor'),true)}</div><div class="pt267-section"><h3>Investment Thesis Summary</h3>${field('conclusion','Write the thesis in a concise, falsifiable form.',val(r,'conclusion'),true)}</div><div class="pt267-actions"><button class="pt175-btn primary" onclick="pt267Save(true,null,'company')">Save Thesis & Finish</button><button class="pt175-btn" onclick="pt267Save(false)">Save worksheet</button></div>`;shell('thesis',r,'COMPANY ANALYSIS · STEP 6','Investment Thesis Worksheet','Synthesize the evidence into an argument that can be revisited and tested.',body)}
 function etf(r){let body=`<div class="pt265-companybar">${field('ticker','ETF ticker',ticker(r),false,'e.g. AVUV')}</div><div class="pt267-section"><h3>Fund Evidence</h3><p>Portfolio Thesis should supply factual fund data. The worksheet focuses on what those facts mean for the portfolio.</p><div class="pt267-cards"><div class="pt267-card"><h4>Structure</h4>${field('expense','Expense ratio %',val(r,'expense'))}${field('holdings','Holdings count',val(r,'holdings'))}</div><div class="pt267-card"><h4>Concentration</h4>${field('top10','Top-10 weight %',val(r,'top10'))}${field('benchmark','Benchmark',val(r,'benchmark'))}</div><div class="pt267-card"><h4>Exposure</h4>${field('factor','Factor / style exposure',val(r,'factor'))}${field('overlap','Portfolio overlap %',val(r,'overlap'))}</div></div></div><div class="pt267-section"><h3>Portfolio Impact</h3>${field('objective','What exposure are you trying to add?',val(r,'objective'),true)}${field('change','What changes at the portfolio level if this fund is added?',val(r,'change'),true)}${field('tradeoff','What is the main trade-off versus adding more to the core?',val(r,'tradeoff'),true)}</div><div class="pt267-section"><h3>ETF Role Assessment</h3>${field('allocation','Allocation being tested %',val(r,'allocation'))}<div class="pt175-field"><label>Proposed role</label><select class="pt267-select" data-field="role"><option></option><option ${val(r,'role')==='Core'?'selected':''}>Core</option><option ${val(r,'role')==='Diversifier'?'selected':''}>Diversifier</option><option ${val(r,'role')==='Tilt'?'selected':''}>Tilt</option></select></div>${field('conclusion','Why does this fund deserve a place in the portfolio?',val(r,'conclusion'),true)}</div><div class="pt267-actions"><button class="pt175-btn primary" onclick="pt267Save(true,'role')">Save & Continue to Portfolio Role →</button><button class="pt175-btn" onclick="pt267Save(false)">Save worksheet</button></div>`;shell('etf',r,'FUND & ETF ANALYSIS · STEP 1','ETF Analysis Worksheet','Understand what the fund adds and what changes if you use it.',body,'fund')}
 function role(r){let e=latest('etf'),body=`<div class="pt265-companybar">${field('ticker','Holding / ticker',val(r,'ticker')||E(e?.values?.ticker||''))}</div><div class="pt267-section"><h3>Define the Job</h3><div class="pt175-field"><label>Portfolio role</label><select class="pt267-select" data-field="role"><option></option><option ${val(r,'role')==='Core'?'selected':''}>Core</option><option ${val(r,'role')==='Diversifier'?'selected':''}>Diversifier</option><option ${val(r,'role')==='Tilt'?'selected':''}>Tilt</option></select></div>${field('weight','Portfolio weight %',val(r,'weight'))}${field('adds','What distinct exposure or function does this holding add?',val(r,'adds'),true)}</div><div class="pt267-section"><h3>Duplication Test</h3>${field('overlap','Where does it overlap with existing holdings?',val(r,'overlap'),true)}${field('distinct','Despite that overlap, what remains meaningfully distinct?',val(r,'distinct'),true)}</div><div class="pt267-section"><h3>Role Assessment</h3>${field('evidence','Evidence supporting this role',val(r,'evidence'),true)}${field('conclusion','Is the holding’s job clear, distinct and worth its allocation?',val(r,'conclusion'),true)}</div><div class="pt267-actions"><button class="pt175-btn primary" onclick="pt267Save(true,null,'fund')">Save Role & Finish</button><button class="pt175-btn" onclick="pt267Save(false)">Save worksheet</button></div>`;shell('role',r,'FUND & ETF ANALYSIS · STEP 2','Portfolio Role Worksheet','Define why the holding exists instead of measuring performance contribution.',body,'fund')}
 function overlap(r){let body=`<div class="pt267-section"><h3>Look-Through Evidence</h3><p>This worksheet is designed for portfolio-level look-through data. Until the structural pipeline is connected, the evidence fields remain editable.</p><div class="pt267-cards"><div class="pt267-card">${field('concentration','Largest underlying exposures',val(r,'concentration'),true)}</div><div class="pt267-card">${field('overlap','Major holding overlap',val(r,'overlap'),true)}</div><div class="pt267-card">${field('gaps','Potential diversification gaps',val(r,'gaps'),true)}</div></div></div><div class="pt267-section"><h3>Intentional vs. Accidental Exposure</h3>${field('intentional','Which concentrations or overlaps are intentional?',val(r,'intentional'),true)}${field('accidental','Which exposures appear accidental or redundant?',val(r,'accidental'),true)}${field('distinct','What genuinely distinct exposures are present?',val(r,'distinct'),true)}</div><div class="pt267-section"><h3>Diversification Assessment</h3>${field('conclusion','Summarize concentration, overlap, distinct exposures and gaps.',val(r,'conclusion'),true)}</div><div class="pt267-actions"><button class="pt175-btn primary" onclick="pt267Save(true,'review')">Save & Continue to Portfolio Review →</button><button class="pt175-btn" onclick="pt267Save(false)">Save worksheet</button></div>`;shell('overlap',r,'PORTFOLIO ANALYSIS · STEP 1','Diversification & Overlap Worksheet','Look beneath ticker count to see what the portfolio actually owns.',body,'portfolio')}
 function review(r){let body=`<div class="pt267-section"><h3>Review Period</h3>${field('period','Review date / period',val(r,'period'),false,'e.g. Q4 2026')}<div class="pt267-callout">The purpose is to identify meaningful change—not to manufacture a reason to trade. “No change” is a valid review outcome.</div></div><div class="pt267-section"><h3>Since the Last Review</h3>${field('allocation','Meaningful allocation drift or holdings added/removed',val(r,'allocation'),true)}${field('thesis','Have any holding theses materially changed?',val(r,'thesis'),true)}${field('portfolio','Has portfolio-level concentration or diversification changed?',val(r,'portfolio'),true)}</div><div class="pt267-section"><h3>Decision</h3><div class="pt175-field"><label>Review outcome</label><select class="pt267-select" data-field="outcome"><option></option>${['No change','Monitor','Research further','Rebalance','Review a holding'].map(x=>`<option ${val(r,'outcome')===x?'selected':''}>${x}</option>`).join('')}</select></div>${field('reason','Why is this the appropriate action?',val(r,'reason'),true)}${field('monitor','What should be checked at the next review?',val(r,'monitor'),true)}</div><div class="pt267-section"><h3>Portfolio Review Record</h3>${field('conclusion','Document what changed, what did not, and why.',val(r,'conclusion'),true)}</div><div class="pt267-actions"><button class="pt175-btn primary" onclick="pt267Save(true,null,'portfolio')">Save Review & Finish</button><button class="pt175-btn" onclick="pt267Save(false)">Save worksheet</button></div>`;shell('review',r,'PORTFOLIO ANALYSIS · STEP 2','Portfolio Review Worksheet','Document whether anything changed enough to deserve attention.',body,'portfolio')}
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior!=='function')return;
 const N=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(v);return Number.isFinite(n)?n:null};
 const E=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
 async function invoke(name,body){
  try{
   if(!window.ptSupabase?.functions?.invoke)return null;
   const r=await window.ptSupabase.functions.invoke(name,{body});
   if(r?.error)throw r.error;
   return r?.data||null;
  }catch(e){console.warn('V269 '+name,e?.message||e);return null}
 }
 function holdings(){
  try{return (typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:String(x.ticker||x.symbol||'').trim().toUpperCase(),weight:N(x.weight)||0})).filter(x=>x.ticker&&x.weight>0)}catch(_){return []}
 }
 function walk(o,fn,seen=new Set()){
  if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);fn(o);
  if(Array.isArray(o))o.forEach(x=>walk(x,fn,seen));else Object.values(o).forEach(x=>walk(x,fn,seen));
 }
 function fundRows(root){
  const out=new Map();
  walk(root,o=>{
   const t=String(o.ticker||o.symbol||'').toUpperCase();
   if(!/^[A-Z][A-Z0-9.-]{0,9}$/.test(t))return;
   const count=N(o.usableTickerCount??o.holdingsCount??o.holdings_count??o.rawHoldingCount);
   const period=o.reportPeriod||o.report_period||o.asOf||o.as_of||null;
   const provider=o.provider||o.source||null;
   if(count!=null||period||provider){const old=out.get(t)||{};out.set(t,{...old,...o,ticker:t,count:count??old.count,period:period||old.period,provider:provider||old.provider})}
  });
  return out;
 }
 function coverage(expo){
  const s=N(expo?.coverage?.sector?.coveragePct??expo?.coverage?.sector?.classifiedPortfolioWeightPct);
  const g=N(expo?.coverage?.geography?.coveragePct??expo?.coverage?.geography?.classifiedPortfolioWeightPct);
  return {sector:s,geography:g};
 }
 function host(){return document.getElementById('ptGeneratedReport')||document.getElementById('ptrReportOverlay')||document.getElementById('reportOverlay')}
 function patch(look,expo,p){
  const h=host();if(!h)return;
  h.querySelectorAll('.pt269-source').forEach(x=>x.remove());
  const funds=fundRows(look),cov=coverage(expo);
  const research=[...h.querySelectorAll('.pt150-page,.ptr-page')].find(x=>/FUND\s*&\s*SECURITY RESEARCH/i.test(x.textContent||''));
  if(research){
   const rows=p.map(x=>funds.get(x.ticker)).filter(Boolean);
   if(rows.length){
    const periods=[...new Set(rows.map(x=>x.period).filter(Boolean))];
    const providers=[...new Set(rows.map(x=>String(x.provider||'').replace(/\s+/g,' ').trim()).filter(Boolean))];
    const box=document.createElement('div');box.className='pt269-source';
    box.innerHTML=`<b>Constituent look-through verified</b> · ${rows.length}/${p.length} portfolio funds matched to stored constituent snapshots.${periods.length?` Reporting period${periods.length>1?'s':''}: ${periods.map(E).join(', ')}.`:''}${providers.length?` Source: ${E(providers[0])}.`:''}<div class="pt269-coverage">${rows.map(x=>`<span class="pt269-chip">${E(x.ticker)} · ${Number(x.count).toLocaleString()} usable holdings</span>`).join('')}</div>`;
    const lead=research.querySelector('h2');(lead||research.firstElementChild)?.insertAdjacentElement('afterend',box);
   }
  }
  // Exposure classification coverage remains available in the exposure payload
  // for internal validation, but is intentionally not rendered in the report.
  h.querySelectorAll('.pt274-coverage-line').forEach(x=>x.remove());
 }
 window.ptGeneratePortfolioPublication=async function(){
  const p=holdings();
  const body={holdings:p};
  const [look,expo]=p.length?await Promise.all([invoke('portfolio-lookthrough',body),invoke('portfolio-exposures',body)]):[null,null];
  window.__ptVerifiedPortfolioLookthrough=look;
  window.__ptVerifiedPortfolioExposures=expo;
  const r=await prior.apply(this,arguments);
  patch(look,expo,p);setTimeout(()=>patch(look,expo,p),450);
  return r;
 };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const oldFetch=window.ptFetchETFEvidence;
 const oldGenerate=window.ptGeneratePortfolioPublication;
 const N=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(String(v).replace('%','').replace(/,/g,''));return Number.isFinite(n)?n:null};
 const norm=t=>String(t||'').trim().toUpperCase();
 const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
 function walk(o,fn,seen=new Set()){if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);fn(o);if(Array.isArray(o))o.forEach(x=>walk(x,fn,seen));else Object.values(o).forEach(x=>walk(x,fn,seen))}
 function structural(root,t){
   let best=null,score=-1;
   walk(root,o=>{
     const ot=norm(o.ticker||o.symbol||o.fundTicker||o.fund_ticker||t);
     if(ot&&ot!==t)return;
     const count=N(o.usableTickerCount??o.usable_ticker_count??o.holdingsCount??o.holdings_count??o.rawHoldingCount??o.raw_holdings_count??o.totalHoldings??o.total_holdings);
     const top10=N(o.top10Weight??o.top10_weight??o.top10WeightPct??o.top10_weight_pct??o.topTenWeight??o.topTenWeightPct);
     let items=null;
     for(const k of ['holdings','topHoldings','top_holdings','constituents','positions'])if(Array.isArray(o[k])&&o[k].length){items=o[k];break}
     const period=o.reportPeriod||o.report_period||o.asOf||o.as_of||o.holdingsAsOf||o.holdings_as_of||null;
     const sc=(count!=null?4:0)+(top10!=null?4:0)+(items?.length?3:0)+(period?1:0);
     if(sc>score){best={count,top10,items,period,source:o.structuralSource||o.structural_source||o.source||null};score=sc}
   });
   return best;
 }
 function item(h){return {ticker:norm(h?.ticker||h?.symbol||h?.instrument_ticker),name:h?.name||h?.companyName||h?.securityName||h?.instrument_name||null,weight:N(h?.weightPct??h?.weight_pct??h?.weightPercentage??h?.percentWeight??h?.portfolioWeightPct??h?.fundWeightPct??h?.weight)}}
 function merge(t,s){
   if(!s)return null;
   const e=window.PT_ETF_EVIDENCE?.[t]; if(!e)return s;
   const hs=(s.items||[]).map(item).filter(x=>x.ticker||x.name);
   if(s.count!=null)e.holdingsCount=s.count;
   if(s.top10!=null)e.top10Weight=s.top10;
   if(s.period)e.asOf=s.period;
   if(hs.length)e.holdings=hs;
   if(e.top10Weight==null&&hs.length>=10&&hs.slice(0,10).every(x=>x.weight!=null))e.top10Weight=hs.slice(0,10).reduce((a,x)=>a+x.weight,0);
   if(e.holdingsCount==null&&hs.length)e.holdingsCount=hs.length;
   e.structuralSource=s.source||e.structuralSource||'stored structural snapshot';
   try{localStorage.setItem(`pt_etf_evidence_${t}`,JSON.stringify({savedAt:Date.now(),data:e}))}catch(_){}
   return e;
 }
 async function capture(t){
   if(!window.ptSupabase?.functions?.invoke)return null;
   try{
     const {data,error}=await window.ptSupabase.functions.invoke('capture-etf-research',{body:{ticker:t,symbol:t}});
     if(error)throw error;
     const s=structural(data,t); merge(t,s); return s;
   }catch(e){console.warn('V272 structural snapshot unavailable',t,e);return null}
 }
 if(typeof oldFetch==='function')window.ptFetchETFEvidence=async function(symbol,opts={}){
   const t=norm(symbol),base=await oldFetch.call(this,t,opts);
   await capture(t);
   return window.PT_ETF_EVIDENCE?.[t]||base;
 };
 window.ptLoadPortfolioETFEvidence=async function(portfolio,{force=false}={}){
   const ts=[...new Set((portfolio||[]).map(x=>norm(x.ticker)).filter(t=>window.ptETFIsEvidenceFund?.(t)))];
   for(const t of ts)await window.ptFetchETFEvidence(t,{force});
   return ts;
 };
 function row(card,label){return [...card.querySelectorAll('tbody tr')].find(r=>clean(r.children[0]?.textContent).toLowerCase()===label)}
 function patchCards(){
   document.querySelectorAll('.pt159-card').forEach(card=>{
     const t=norm(card.querySelector('.pt159-head b')?.textContent),e=window.PT_ETF_EVIDENCE?.[t];if(!e)return;
     const count=N(e.holdingsCount??e.usableTickerCount),top10=N(e.top10Weight??e.top10WeightPct);
     const div=row(card,'underlying diversification'),top=row(card,'10 largest holdings');
     if(div&&count!=null){div.children[1].textContent=`${count.toLocaleString()} holdings`;div.children[2].textContent=count>1000?'Broad ownership':count>=400?'Broad large-cap set':'More targeted'}
     if(top&&top10!=null){top.children[1].textContent=`${top10.toFixed(2)}%`;top.children[2].textContent=top10>25?'Top-heavy':'More distributed'}
     card.querySelectorAll('.pt159-section').forEach(sec=>{
       const lab=clean(sec.querySelector('small')?.textContent).toUpperCase(),p=sec.querySelector('p');if(!p)return;
       if((lab.includes('EVIDENCE FOR')||lab.includes('SUPPORTS'))&&count!=null){
         if(t==='VTI')p.textContent=`VTI spreads the U.S. core across ${count.toLocaleString()} measured underlying holdings. That breadth of underlying ownership directly supports its job as the domestic market foundation.`;
         if(t==='VOO')p.textContent=`VOO contains ${count.toLocaleString()} measured underlying holdings and is designed to represent the large-cap U.S. market through the S&P 500. That directly supports its assigned role as a transparent source of large-company U.S. exposure.`;
       }
       if((lab.includes('EVIDENCE AGAINST')||lab.includes('CHALLENGES'))&&top10!=null){
         if(t==='VTI')p.textContent=`The strongest structural tension is weighting concentration: the 10 largest holdings account for ${top10.toFixed(2)}%. A broad security count therefore does not guarantee evenly distributed economic exposure.`;
         if(t==='VOO')p.textContent=`VOO is not a total-market fund. With ${top10.toFixed(2)}% in its 10 largest holdings, market-cap weighting can make results unusually dependent on the largest U.S. companies. If another broad U.S. fund is already owned, overlap can also make the sleeve additive in ticker count without adding much new economic exposure.`;
       }
     });
   });
 }
 if(typeof oldGenerate==='function')window.ptGeneratePortfolioPublication=async function(){const r=await oldGenerate.apply(this,arguments);patchCards();setTimeout(patchCards,250);setTimeout(patchCards,900);return r};
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const norm=v=>String(v||'').trim().toUpperCase();
 const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const N=v=>{const n=Number(String(v??'').replace('%','').replace(/,/g,''));return Number.isFinite(n)?n:null};
 function isFund(t){t=norm(t);return ['VTI','VOO','VXUS','AVUV','AVDV','QQQM','SCHD','BND','VNQ','GLD'].includes(t) || !!window.PT_ETFS?.has?.(t)}
 function p(){try{return (getPortfolio()||[]).map(x=>({ticker:norm(x.ticker),weight:Number(x.weight)||0})).filter(x=>x.ticker&&x.weight>0).sort((a,b)=>b.weight-a.weight)}catch(_){return []}}

 function dvShell(t,w,body){
   return `<div class="pt159-head"><div><small>PORTFOLIO THESIS / DEEP VALUE RESEARCH</small><b>${esc(t)}</b><span>${w.toFixed(0)}% OF PORTFOLIO</span></div><div class="pt159-role"><small>CURRENT ROLE</small><strong>Direct company position</strong></div></div>${body}`;
 }
 function dvFailure(t,w,msg){
   return dvShell(t,w,`<table class="pt159-table"><thead><tr><th>COMPONENT</th><th>CURRENT READING</th><th>READ</th></tr></thead><tbody>
   <tr><td>Financial strength</td><td>—</td><td>Unresolved</td></tr>
   <tr><td>Earning power</td><td>—</td><td>Unresolved</td></tr>
   <tr><td>Cash generation & quality</td><td>—</td><td>Unresolved</td></tr>
   <tr><td>Capital discipline</td><td>—</td><td>Unresolved</td></tr>
   <tr><td>Valuation</td><td>—</td><td>Unresolved</td></tr></tbody></table>
   <div class="pt159-thesis pt159-section"><small>THE THESIS</small><b>${esc(t)} must continue to justify its company-specific role and ${w.toFixed(0)}% portfolio weight.</b></div>
   <div class="pt159-two"><div class="pt159-section"><small>EVIDENCE FOR</small><p>Current Deep Value evidence is unavailable, so Portfolio Thesis does not invent support.</p></div><div class="pt159-section"><small>EVIDENCE AGAINST</small><p>Company research remains unresolved until current or cached evidence is available.</p></div></div>
   <div class="pt159-bottom pt159-section"><small>THESIS BREAKPOINT</small><p>A material deterioration in financial strength, earning power, cash generation, capital discipline, valuation, or the company thesis.</p><small>EVIDENCE SNAPSHOT</small><p>${esc(msg||'Automatic Deep Value research is currently unavailable.')}</p></div>
   <button class="ptr-dv-open" onclick="ptOpenCompanyFromPortfolio('${esc(t)}')">Open Deep Value Report</button>`);
 }
 function dvLoading(t,w){
   return dvShell(t,w,`<table class="pt159-table"><thead><tr><th>COMPONENT</th><th>CURRENT READING</th><th>READ</th></tr></thead><tbody>
   <tr><td>Company evidence</td><td>Loading Deep Value research…</td><td>Pending</td></tr>
   <tr><td>Portfolio role</td><td>Direct company position</td><td>Deliberate tilt</td></tr></tbody></table>
   <div class="pt159-thesis pt159-section"><small>THE THESIS</small><b>${esc(t)} must justify both its company evidence and its ${w.toFixed(0)}% portfolio weight.</b></div>`);
 }

 // Override the successful Deep Value renderer so stock and fund evidence share one visual grammar.
 window.ptRenderPortfolioDVCard=function(ticker,weight,snap,error){
   const t=norm(ticker),w=Number(weight)||0,el=document.getElementById('ptPDV-'+t);if(!el)return;
   el.className='pt159-card'; el.dataset.ticker=t; el.dataset.weight=w;
   if(error||!snap){el.innerHTML=dvFailure(t,w,error?.message||String(error||''));return}
   const cats=new Map((snap.cats||[]).map(x=>[String(x[0]),N(x[1])]));
   const read=v=>v==null?'Unresolved':v>=16?'Strong':v>=12?'Supportive':'Watch';
   const row=(label,key)=>{const v=cats.get(key);return `<tr><td>${label}</td><td>${v==null?'—':v.toFixed(0)+'/20'}</td><td>${read(v)}</td></tr>`};
   const measured=[...cats].filter(x=>x[1]!=null),strong=[...measured].sort((a,b)=>b[1]-a[1])[0],weak=[...measured].sort((a,b)=>a[1]-b[1])[0];
   const score=N(snap.score),price=N(snap.price),val=N(snap.normalized),mos=N(snap.mos);
   el.innerHTML=dvShell(t,w,`<table class="pt159-table"><thead><tr><th>COMPONENT</th><th>CURRENT READING</th><th>READ</th></tr></thead><tbody>
   ${row('Financial strength','Financial Strength')}${row('Earning power','Earning Power')}${row('Cash generation & quality','Cash Generation & Quality')}${row('Capital discipline','Capital Discipline')}${row('Valuation','Valuation')}
   <tr><td>Evidence score</td><td>${score==null?'—':score.toFixed(0)+'/100'}</td><td>${score==null?'Unresolved':score>=80?'Strong':score>=65?'Supportive':'Mixed'}</td></tr></tbody></table>
   <div class="pt159-thesis pt159-section"><small>THE THESIS</small><b>${esc(t)} must continue to justify its company-specific role and ${w.toFixed(0)}% portfolio weight.</b></div>
   <div class="pt159-two"><div class="pt159-section"><small>EVIDENCE FOR</small><p>${strong?`${esc(strong[0])} is the strongest measured category at ${strong[1].toFixed(0)}/20.`:'Measured company evidence remains incomplete.'}</p></div><div class="pt159-section"><small>EVIDENCE AGAINST</small><p>${weak?`${esc(weak[0])} is the weakest measured category at ${weak[1].toFixed(0)}/20.`:'The primary company risk remains unresolved.'}</p></div></div>
   <div class="pt159-bottom pt159-section"><small>THESIS BREAKPOINT</small><p>A material deterioration in financial strength, earning power, cash generation, capital discipline, valuation, or the company thesis.</p><small>EVIDENCE SNAPSHOT</small><p>${price==null?'Market price unresolved':`Market price $${price.toFixed(2)}`}${val==null?'':' · normalized value $'+val.toFixed(2)}${mos==null?'':' · '+(mos>=0?mos.toFixed(1)+'% margin of safety':Math.abs(mos).toFixed(1)+'% above normalized value')}.</p></div>
   <button class="ptr-dv-open" onclick="ptOpenCompanyFromPortfolio('${esc(t)}')">Open Deep Value Report</button>`);
 };

 function unifyEvidence(){
   const port=p(),host=document.querySelector('.pt150-report');if(!host||!port.length)return;
   const cards={};
   document.querySelectorAll('.pt159-card').forEach(c=>{const t=norm(c.querySelector('.pt159-head b')?.textContent||c.dataset.ticker);if(t)cards[t]=c});
   // Convert V280 stock placeholder into the same card shell.
   port.filter(x=>!isFund(x.ticker)).forEach(x=>{
     let c=document.getElementById('ptPDV-'+x.ticker);
     if(!c){c=document.createElement('div');c.id='ptPDV-'+x.ticker}
     c.className='pt159-card';c.dataset.ticker=x.ticker;c.dataset.weight=x.weight;
     if(!/PORTFOLIO THESIS \/ DEEP VALUE RESEARCH/i.test(c.textContent||''))c.innerHTML=dvLoading(x.ticker,x.weight);
     cards[x.ticker]=c;
   });
   if(!Object.keys(cards).length)return;

   let page=host.querySelector('.pt282-evidence-page');
   if(!page){page=document.createElement('section');page.className='pt150-page pt282-evidence-page'}
   const foot=`<div class="pt150-foot"><span>PORTFOLIO THESIS · GLOBAL OWNERSHIP. DISCIPLINED BALANCE.</span><b></b></div>`;
   page.innerHTML=`<div class="pt150-k">HOLDING EVIDENCE</div><h2>Evidence by holding.</h2><p class="pt150-deck">Holdings are shown by portfolio allocation, largest first. Funds use Fund Evidence; individual securities use Deep Value Research in the same report format.</p><div class="pt282-cardhost"></div>${foot}`;
   const cardhost=page.querySelector('.pt282-cardhost');
   port.forEach(x=>{if(cards[x.ticker])cardhost.appendChild(cards[x.ticker])});

   // Remove old evidence/deep-value pages after their cards have been moved.
   [...host.querySelectorAll('.pt150-page')].forEach(pg=>{
     if(pg===page)return;
     if(pg.classList.contains('pt280-dv-page') || /FUND SCORECARDS|FUND EVIDENCE/i.test(pg.textContent||''))pg.remove();
   });
   const perf=[...host.querySelectorAll('.pt150-page')].find(x=>/What moved the portfolio\./i.test(x.textContent||''));
   if(!page.isConnected){if(perf)perf.insertAdjacentElement('afterend',page);else host.prepend(page)}
   else if(perf && perf.nextElementSibling!==page)perf.insertAdjacentElement('afterend',page);
 }

 // Merge direct company weight with the same company's indirect fund look-through.
 function mergeEffectiveCompanies(){
   const port=p(),direct=new Map(port.filter(x=>!isFund(x.ticker)).map(x=>[x.ticker,x.weight]));
   if(!direct.size)return;
   const chart=[...document.querySelectorAll('.pt150-chart')].find(x=>/Largest effective companies/i.test(x.querySelector('h3')?.textContent||''));if(!chart)return;
   const rows=[...chart.querySelectorAll('.pt150-barrow')].map(r=>({el:r,t: norm(r.children[0]?.textContent),v:N(r.querySelector('strong')?.textContent)||0}));
   direct.forEach((w,t)=>{
     const matches=rows.filter(r=>r.t===t);
     if(!matches.length)return;
     const total=matches.reduce((a,r)=>a+r.v,0);
     matches[0].v=total;matches.slice(1).forEach(r=>r.el.remove());
   });
   const kept=[...chart.querySelectorAll('.pt150-barrow')].map(r=>{
     const t=norm(r.children[0]?.textContent);const prior=rows.find(x=>x.el===r);return {el:r,t,v:prior?.v??(N(r.querySelector('strong')?.textContent)||0)}
   }).sort((a,b)=>b.v-a.v);
   const max=Math.max(...kept.map(x=>x.v),1);
   kept.forEach(x=>{x.el.querySelector('strong').textContent=x.v.toFixed(2)+'%';const bar=x.el.querySelector('.pt150-bar i');if(bar)bar.style.width=Math.max(2,x.v/max*100)+'%';chart.appendChild(x.el)});
 }

 function normalizeFailureCards(){
   p().filter(x=>!isFund(x.ticker)).forEach(x=>{
     const el=document.getElementById('ptPDV-'+x.ticker);if(!el)return;
     if(/Automatic Deep Value research failed/i.test(el.textContent||'') && !el.querySelector('.pt159-table')){
       const msg=(el.querySelector('.ptr-dv-unavailable')?.textContent||'Automatic Deep Value research is currently unavailable.').replace(/\s+/g,' ').trim();
       el.className='pt159-card';el.innerHTML=dvFailure(x.ticker,x.weight,msg);
     }
   });
 }

 function run(){unifyEvidence();mergeEffectiveCompanies();normalizeFailureCards();renumber()}
 function renumber(){document.querySelectorAll('.pt150-page').forEach((pg,i)=>{const b=pg.querySelector('.pt150-foot b');if(b)b.textContent=String(i+1).padStart(2,'0')})}

 const prior=window.ptGeneratePortfolioPublication;
