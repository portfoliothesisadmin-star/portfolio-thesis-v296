   const rows=p.map(h=>{const s=pm[h.ticker]||{};return {t:h.ticker,w:h.weight,m1:perfVal(s,'oneMonth'),m3:perfVal(s,'threeMonth'),ytd:perfVal(s,'ytd'),y1:perfVal(s,'oneYear'),c:firstNum(s,['oneMonth.contributionPctPoints','contributionPctPoints'])}});
   const findings=[];
   let n=1,h='<div class="pt150-report">';
   h+=page(`<div class="pt150-k">PORTFOLIO THESIS REPORT</div><h1>${E(name)}</h1><p class="pt150-deck">A broad-market portfolio with explicit international diversification and deliberate small/value tilts. The report below tests what those choices actually created beneath the fund labels.</p><div class="pt150-alloc">${p.map(x=>`<div style="width:${x.weight}%">${E(x.ticker)}</div>`).join('')}</div><div class="pt150-legend">${p.map(x=>`<span><b>${E(x.ticker)}</b> ${pct(x.weight,0)}</span>`).join('')}</div><div class="pt150-metrics"><div class="pt150-metric"><small>1 month</small><b>${sg(p1)}</b><em>portfolio estimate</em></div><div class="pt150-metric"><small>YTD</small><b>${sg(py)}</b><em>portfolio estimate</em></div><div class="pt150-metric"><small>Measured U.S.</small><b>${us?pct(us.value,1):'—'}</b><em>${us?`${pct(intl,1)} non-U.S.`:'underlying exposure'}</em></div><div class="pt150-metric"><small>Largest fund overlap</small><b>${ov?`${E(ov.baseFund||ov.fundA)} / ${E(ov.comparisonFund||ov.fundB)}`:'—'}</b><em>${ov?`${pct(ov.weightedOverlapPct,1)} · ${Number(ov.sharedHoldingsCount||ov.sharedCount||0).toLocaleString()} shared`:'measured constituent overlap'}</em></div></div>`,n++);
   const overlapTable=overlapRows.length?`<div class="pt155-interactions"><h3>Fund interaction</h3><p class="intro">Weighted overlap measures how much portfolio weight the funds share in the same underlying companies. Shared holdings shows the breadth of that intersection.</p><table class="pt155-overlap"><thead><tr><th>Fund pair</th><th>Weighted overlap</th><th>Shared holdings</th></tr></thead><tbody>${overlapRows.map(r=>`<tr class="${((r.a==='VTI'&&r.b==='AVUV')||(r.a==='AVUV'&&r.b==='VTI')||(r.a==='VXUS'&&r.b==='AVDV')||(r.a==='AVDV'&&r.b==='VXUS'))?'focus':''}"><td>${E(r.a)} / ${E(r.b)}</td><td>${pct(r.overlap,2)}</td><td>${r.shared==null?'—':r.shared.toLocaleString()}</td></tr>`).join('')}</tbody></table>${(()=>{const usrw=rwFor('VTI','AVUV'),intrw=rwFor('VXUS','AVDV');if(!usrw.length&&!intrw.length)return '';const fmtRw=a=>a.length?a.map(x=>`${E(x.ticker||x.name||'Company')} ${N(x.reweightingPctPoints)>=0?'+':''}${N(x.reweightingPctPoints).toFixed(2)} pts`).join(' · '):'No pair-specific reweighting rows returned.';return `<div class="pt155-reweight"><div><small>U.S. tilt · VTI → AVUV</small><b>Shared companies can still be materially reweighted.</b><p>${fmtRw(usrw)}</p></div><div><small>International tilt · VXUS → AVDV</small><b>Overlap does not mean identical exposure.</b><p>${fmtRw(intrw)}</p></div></div>`})()}</div>`:'';
   h+=page(`<div class="pt150-k">WHAT YOU ACTUALLY OWN</div><h2>Exposure beneath the tickers.</h2><div class="pt150-grid2"><div class="pt150-chart"><h3>Largest effective companies</h3>${bars(eff,10)}</div><div><div class="pt150-chart"><h3>Geographic exposure</h3>${bars(geo,8)}</div><div class="pt150-chart" style="margin-top:24px"><h3>Sector exposure</h3>${bars(sectors,8)}</div></div></div>${overlapTable}`,n++);
   h+=page(`<div class="pt150-k">PERFORMANCE & DRIVERS</div><h2>What moved the portfolio.</h2><table class="pt150-table"><thead><tr><th>Holding</th><th>Weight</th><th>1M</th><th>3M</th><th>YTD</th><th>1Y</th><th>1M contrib.</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${E(r.t)}</b></td><td>${pct(r.w,0)}</td><td>${sg(r.m1)}</td><td>${sg(r.m3)}</td><td>${sg(r.ytd)}</td><td>${sg(r.y1)}</td><td>${r.c==null?'—':`${r.c>=0?'+':''}${r.c.toFixed(2)} pts`}</td></tr>`).join('')}<tr class="total"><td>Portfolio</td><td>100%</td><td>${sg(p1)}</td><td>${sg(p3)}</td><td>${sg(py)}</td><td>—</td><td>${p1==null?'—':`${p1>=0?'+':''}${p1.toFixed(2)} pts`}</td></tr></tbody></table><p class="pt150-note">Portfolio returns are static-current-weight estimates from available adjusted-price history, not realized account returns.</p>`,n++);
   h+=page(`<div class="pt150-k">FUND & SECURITY RESEARCH</div><h2>Evidence by holding.</h2>${p.map(x=>{const s=pm[x.ticker]||{},e=window.PT_ETF_EVIDENCE?.[x.ticker]||{};const hc=N(e.holdingsCount),t10=N(e.top10Weight),asof=e.asOf||e.reportPeriod||s.asOf||'';return `<div class="pt150-security"><div class="pt150-security-head"><b>${E(x.ticker)}</b><span>${pct(x.weight,0)} OF PORTFOLIO</span></div><div class="pt150-security-grid"><div><small>1 month</small><strong>${sg(perfVal(s,'oneMonth'))}</strong></div><div><small>YTD</small><strong>${sg(perfVal(s,'ytd'))}</strong></div><div><small>Holdings</small><strong>${hc==null?'—':hc.toLocaleString()}</strong></div><div><small>Top 10 weight</small><strong>${pct(t10,1)}</strong></div></div>${asof?`<p>Evidence through ${E(asof)}.</p>`:''}</div>`}).join('')}`,n++);
   const mf=market?.reportFindings||[];h+=page(`<div class="pt150-k">CURRENT MARKET ENVIRONMENT</div><h2>The conditions that matter to this portfolio.</h2>${mf.length?mf.slice(0,6).map(f=>`<div class="pt150-market"><div><span class="tag">${E(f.materiality||'Relevant')}</span><b>${E(f.title||'Market factor')}</b></div><div><p><strong>Evidence:</strong> ${E(f.evidence||'')}</p><p><strong>Portfolio connection:</strong> ${E(f.portfolioConnection||'')}</p><p><strong>Implication:</strong> ${E(f.implication||'')}</p></div></div>`).join(''):'<div class="pt150-empty">Current portfolio-specific market evidence unavailable.</div>'}`,n++);

   const mon=[];if(largestName&&largestW!=null)mon.push(['Largest company exposure',`${E(largestName)} ${pct(largestW,2)}`,'Tracks dependence on a single underlying business.']);if(top10!=null)mon.push(['Top-10 concentration',pct(top10,1),'Shows whether broad ownership is becoming more concentrated.']);if(us)mon.push(['Geographic balance',`${pct(us.value,1)} U.S. / ${pct(intl,1)} non-U.S.`,'Changes the regional earnings, currency and valuation mix.']);if(ov)mon.push(['Fund overlap',`${E(ov.baseFund||ov.fundA)} / ${E(ov.comparisonFund||ov.fundB)} ${pct(ov.weightedOverlapPct,2)}`,'Shows whether a sleeve remains distinct.']);if(py!=null)mon.push(['Portfolio YTD',sg(py),'Performance is evidence to explain, not a thesis by itself.']);for(const f of mf.slice(0,2))mon.push([f.title,f.evidence,f.portfolioConnection||f.implication]);
   h+=page(`<div class="pt150-k">THESIS MONITOR</div><h2>Evidence worth watching next.</h2><table class="pt150-monitor"><thead><tr><th>Evidence</th><th>Current reading</th><th>Why it matters</th></tr></thead><tbody>${mon.map(x=>`<tr><td><b>${x[0]}</b></td><td>${x[1]}</td><td>${x[2]}</td></tr>`).join('')}</tbody></table><div class="pt150-disc">Portfolio Thesis is educational research, not individualized investment, tax or legal advice. Observation dates vary by source; missing evidence is not estimated.</div>`,n++);h+='</div>';
   const host=document.getElementById('ptrReportOverlay')||document.getElementById('reportOverlay')||document.getElementById('ptGeneratedReport')||document.body;host.innerHTML=h;host.style.display='block';document.body.classList.add('ptr-report-open');window.scrollTo(0,0);
 };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 function reportHost(){return document.getElementById('ptGeneratedReport')||document.getElementById('ptrReportOverlay')||document.getElementById('reportOverlay')}
 function openReportHost(){
   const h=reportHost(); if(!h)return null;
   h.style.display='block';
   h.classList.add('active','pt-v153-open');
   document.body.classList.add('pt-report-open','ptr-report-open');
   try{h.scrollTop=0}catch(_){}
   return h;
 }
 window.ptOpenGeneratedPortfolioReport=openReportHost;
 const previous=window.ptGeneratePortfolioPublication;
 if(typeof previous==='function'){
   window.ptGeneratePortfolioPublication=async function(){
     // Open the report surface before awaiting network work, so Builder never remains the visible destination.
     const h=openReportHost();
     if(h){h.innerHTML='';h.style.display='none';}
     try{
       const result=await previous.apply(this,arguments);
       openReportHost();
       requestAnimationFrame(()=>{const x=reportHost();if(x)x.scrollTop=0});
       return result;
     }catch(e){openReportHost();throw e}
   };
 }
 // Keep the existing close function, but guarantee V153 classes are cleared.
 const priorClose=window.closePortfolioReport;
 window.closePortfolioReport=function(){
   const h=reportHost();
   if(h){h.classList.remove('active','pt-v153-open');h.style.display='none'}
   document.body.classList.remove('pt-report-open','ptr-report-open');
   if(typeof priorClose==='function')return priorClose.apply(this,arguments);
 };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior!=='function') return;
 const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
 const role=t=>({VTI:'U.S. core',VXUS:'International diversifier',AVUV:'U.S. small/value tilt',AVDV:'International small/value tilt'}[t]||'Portfolio holding');
 const thesis=t=>({
  VTI:'Broad U.S. ownership is the portfolio foundation; the key structural test is whether underlying concentration remains acceptable.',
  VXUS:'International ownership broadens the portfolio beyond U.S. earnings, valuations and market leadership.',
  AVUV:'This sleeve must create a genuine U.S. small/value reweighting rather than simply duplicate the broad-market core.',
  AVDV:'This sleeve must create a genuine international small/value reweighting while remaining economically distinct from the broad international core.'
 }[t]||`${t} must continue to perform the job assigned to it in the portfolio.`);
 const challenge=t=>({
  VTI:'Mega-cap concentration can make broad-market ownership less evenly distributed than the ticker label suggests.',
  VXUS:'International diversification can lag U.S. equities for extended periods and adds currency and regional dispersion.',
  AVUV:'Small/value exposure can diverge sharply from the broad U.S. market for long periods.',
  AVDV:'International small/value can experience prolonged tracking error versus broad international equities.'
 }[t]||'Its measured exposures or role could change materially over time.');
 function numText(s){const m=String(s||'').match(/[\d,.]+/);return m?Number(m[0].replace(/,/g,'')):null}
 function findPage(){return [...document.querySelectorAll('.pt150-page')].find(p=>/Evidence by holding\./i.test(p.textContent||''))}
 function overlapFor(t){
   const rows=[...document.querySelectorAll('.pt155-overlap tbody tr')].map(tr=>[...tr.children].map(td=>td.textContent.trim()));
   return rows.map(r=>{const pair=(r[0]||'').split('/').map(x=>x.trim());return {a:pair[0],b:pair[1],ov:r[1],shared:r[2]}}).filter(x=>x.a===t||x.b===t).sort((a,b)=>(numText(b.ov)||-1)-(numText(a.ov)||-1))[0];
 }
 function deepTickerMap(root){
   const out={},seen=new Set();
   function walk(o){if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);if(!Array.isArray(o)){const t=String(o.ticker||o.symbol||'').toUpperCase();if(t)out[t]=Object.assign(out[t]||{},o);Object.values(o).forEach(walk)}else o.forEach(walk)}
   walk(root);return out;
 }
 function n(v){if(v===null||v===undefined||v===''||v===false)return null;const x=Number(v);return Number.isFinite(x)?x:null}
 function periodVal(o,names){for(const a of names){for(const v of [o?.[a]?.returnPct,o?.[a]?.pct,o?.[a+'Pct'],o?.[a]?.return,o?.[a]]){const x=n(v);if(x!=null)return x}}return null}
 function fmt(v){return v==null?'—':`${v>=0?'+':''}${v.toFixed(2)}%`}
 function perfFor(t){const m=deepTickerMap({portfolio:window.__pt151?.perf||{},securities:window.__pt151?.securityPerf||{}});const o=m[t]||{};return {m1:periodVal(o,['oneMonth','1m','month1']),ytd:periodVal(o,['ytd','YTD'])}}
 function supportText(t,hc,t10,ov,other){
   if(t==='VTI') return `The fund still provides very broad U.S. ownership across ${hc?.toLocaleString()||'thousands of'} companies. Its measured overlap with ${esc(other||'the tilt sleeve')} is ${ov?esc(ov.ov):'limited'}, so the separate tilt can still materially change company-level weights.`;
   if(t==='VXUS') return `The fund supplies broad non-U.S. ownership rather than relying on a small group of foreign companies. ${ov?`Its ${esc(ov.ov)} weighted overlap with ${esc(other)} shows some shared names without making the two sleeves identical.`:'Its role remains distinct from the U.S. core.'}`;
   if(t==='AVUV') return `The sleeve is sufficiently targeted to alter the U.S. core rather than behave like another total-market fund. ${ov?`Measured interaction with ${esc(other)} confirms shared companies are being held at materially different weights.`:''}`;
   if(t==='AVDV') return `The sleeve adds a targeted international small/value reweighting. ${ov?`Its measured interaction with ${esc(other)} reflects shared companies, but the constituent weights remain meaningfully different.`:''}`;
   return `The measured evidence remains consistent with the holding's assigned portfolio job.`;
 }
 function patchPerformanceTable(){
   const page=[...document.querySelectorAll('.pt150-page')].find(p=>/What moved the portfolio\./i.test(p.textContent||''));
   const table=page?.querySelector('.pt150-table'); if(!table)return;
   const map=deepTickerMap({portfolio:window.__pt151?.perf||{},securities:window.__pt151?.securityPerf||{}});
   const rows=[...table.querySelectorAll('tbody tr')];
   let sums={m1:0,m3:0,ytd:0,y1:0}, counts={m1:0,m3:0,ytd:0,y1:0};
   for(const tr of rows){
     const td=[...tr.children]; if(td.length<7)continue;
     const t=(td[0].textContent||'').trim().toUpperCase(); if(t==='PORTFOLIO')continue;
     const w=parseFloat(td[1].textContent)||0, o=map[t]||{};
     const vals={
       m1:periodVal(o,['oneMonth','1m','month1']),
       m3:periodVal(o,['threeMonth','3m','month3']),
       ytd:periodVal(o,['ytd','YTD']),
       y1:periodVal(o,['oneYear','1y','year1'])
     };
     td[2].textContent=fmt(vals.m1); td[3].textContent=fmt(vals.m3); td[4].textContent=fmt(vals.ytd); td[5].textContent=fmt(vals.y1);
     td[6].textContent=vals.m1==null?'—':`${vals.m1*w/100>=0?'+':''}${(vals.m1*w/100).toFixed(2)} pts`;
     for(const k of Object.keys(vals)){if(vals[k]!=null){sums[k]+=vals[k]*w/100;counts[k]++}}
   }
   const total=rows.find(tr=>(tr.children[0]?.textContent||'').trim().toUpperCase()==='PORTFOLIO');
   if(total){const td=[...total.children];td[2].textContent=counts.m1?fmt(sums.m1):'—';td[3].textContent=counts.m3?fmt(sums.m3):'—';td[4].textContent=counts.ytd?fmt(sums.ytd):'—';td[5].textContent=counts.y1?fmt(sums.y1):'—';td[6].textContent=counts.m1?`${sums.m1>=0?'+':''}${sums.m1.toFixed(2)} pts`:'—';}
 }
 function replaceScorecardPage(){
   const page=findPage(); if(!page)return;
   const securities=[...page.querySelectorAll('.pt150-security')].map(el=>{
     const t=(el.querySelector('.pt150-security-head b')?.textContent||'').trim().toUpperCase();
     const wt=(el.querySelector('.pt150-security-head span')?.textContent||'').trim();
