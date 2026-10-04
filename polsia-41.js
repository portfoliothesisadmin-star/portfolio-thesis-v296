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
