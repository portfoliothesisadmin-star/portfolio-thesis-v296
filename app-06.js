   h+=page(`<div class="pt150-k">FUND SCORECARDS</div><h2>Evidence by holding.</h2><p class="pt150-deck">Each fund is tested against the job it performs in the portfolio. Missing measurements remain unresolved rather than being estimated.</p>${p.map(x=>{const t=x.ticker,s=pm[t]||{},e=window.PT_ETF_EVIDENCE?.[t]||{};const hc=N(e.holdingsCount),t10=N(e.top10Weight),m1=perfVal(s,'oneMonth'),ytd=perfVal(s,'ytd'),asof=e.asOf||e.reportPeriod||s.asOf||'';const role=t==='VTI'?'U.S. core':t==='VXUS'?'International diversifier':t==='AVUV'?'U.S. small/value tilt':t==='AVDV'?'International small/value tilt':'Portfolio holding';const rel=overlapRows.filter(r=>r.a===t||r.b===t).sort((a,b)=>(b.overlap??-1)-(a.overlap??-1))[0];const thesis=t==='VTI'?'Broad U.S. ownership remains the portfolio foundation; underlying concentration is the main structural condition to watch.':t==='VXUS'?'Broad international ownership diversifies the portfolio beyond U.S. earnings, valuations and market leadership.':t==='AVUV'?'The sleeve deliberately reweights U.S. exposure toward smaller value-oriented companies rather than duplicating the broad-market core.':t==='AVDV'?'The sleeve deliberately reweights international exposure toward smaller value-oriented companies while remaining distinct from the broad international core.':`${t} is evaluated against its assigned portfolio role.`;const challenge=t==='VTI'?'Mega-cap concentration can make broad-market ownership less evenly distributed than the ticker suggests.':t==='VXUS'?'International diversification can lag U.S. equities for extended periods and introduces currency and regional dispersion.':t==='AVUV'?'Small/value exposure can diverge sharply from the broad U.S. market for long periods.':t==='AVDV'?'International small/value can experience prolonged tracking error versus broad international equities.':'The holding should be retested if its measured role or exposures materially change.';return `<div class="pt158-card"><div class="pt158-head"><div><small>PORTFOLIO THESIS / FUND SCORECARD</small><b>${E(t)}</b><span>${E(role)} · ${pct(x.weight,0)} of portfolio</span></div><div><small>CURRENT ROLE</small><strong>${E(role)}</strong></div></div><table class="pt158-table"><thead><tr><th>Evidence</th><th>Current reading</th><th>Read</th></tr></thead><tbody><tr><td>Performance</td><td>1M ${sg(m1)} · YTD ${sg(ytd)}</td><td>${m1==null&&ytd==null?'Pending':'Observed'}</td></tr><tr><td>Breadth</td><td>${hc==null?'—':hc.toLocaleString()} holdings</td><td>${hc==null?'Unresolved':hc>1000?'Very broad':'Targeted'}</td></tr><tr><td>Concentration</td><td>Top 10 ${pct(t10,1)}</td><td>${t10==null?'Unresolved':t10>25?'Concentrated top end':'Distributed'}</td></tr><tr><td>Fund interaction</td><td>${rel?`${pct(rel.overlap,2)} with ${E(rel.a===t?rel.b:rel.a)}`:'—'}</td><td>${rel&&rel.shared!=null?`${rel.shared.toLocaleString()} shared holdings`:'Unresolved'}</td></tr><tr><td>Portfolio role</td><td>${E(role)}</td><td>${t==='VTI'||t==='VXUS'?'Foundation':'Deliberate tilt'}</td></tr></tbody></table><div class="pt158-thesis"><small>THE THESIS</small><b>${E(thesis)}</b></div><div class="pt158-two"><div><small>SUPPORTS THE THESIS</small><p>${hc!=null?`• ${hc.toLocaleString()} underlying holdings<br>`:''}${t10!=null?`• Top 10 represent ${pct(t10,1)} of the fund<br>`:''}${rel?`• ${pct(rel.overlap,2)} measured overlap with ${E(rel.a===t?rel.b:rel.a)}`:'• Interaction evidence remains unresolved'}</p></div><div><small>CHALLENGES THE THESIS</small><p>${E(challenge)}</p></div></div><div class="pt158-bottom"><small>WHAT WOULD CHANGE OUR VIEW</small><p>A material change in underlying diversification, largest-holding concentration, overlap, factor distinctness, or the evidence supporting this fund's assigned job.</p><small>EVIDENCE SNAPSHOT</small><p>${asof?`Constituent evidence through ${E(asof)}. `:''}Performance uses the latest available adjusted-price observations when available.</p></div></div>`}).join('')}`,n++);
   const mf=market?.reportFindings||[];h+=page(`<div class="pt150-k">CURRENT MARKET ENVIRONMENT</div><h2>The conditions that matter to this portfolio.</h2>${mf.length?mf.slice(0,6).map(f=>`<div class="pt150-market"><div><span class="tag">${E(f.materiality||'Relevant')}</span><b>${E(f.title||'Market factor')}</b></div><div><p><strong>Evidence:</strong> ${E(f.evidence||'')}</p><p><strong>Portfolio connection:</strong> ${E(f.portfolioConnection||'')}</p><p><strong>Implication:</strong> ${E(f.implication||'')}</p></div></div>`).join(''):'<div class="pt150-empty">Current portfolio-specific market evidence unavailable.</div>'}`,n++);
   const rw=findArray(reweight,x=>N(x.reweightingPctPoints)!=null).filter(x=>N(x.reweightingPctPoints)!=null).sort((a,b)=>Math.abs(N(b.reweightingPctPoints))-Math.abs(N(a.reweightingPctPoints))).slice(0,5);
   h+=page(`<div class="pt150-k">PORTFOLIO ANALYSIS</div><h2>What the evidence says.</h2><div class="pt150-analysis"><div><small>Diversification</small><b>${us?`${pct(us.value,1)} U.S. / ${pct(intl,1)} non-U.S.`:'Geography unresolved'}</b><p>Measured from underlying holdings rather than ticker labels.</p></div><div><small>Concentration</small><b>${largestName&&largestW!=null?`${E(largestName)} ${pct(largestW,2)}`:'Concentration unresolved'}</b><p>${top10!=null?`Top ten underlying companies total ${pct(top10,1)}.`:''}</p></div><div><small>Fund interaction</small><b>${ov?`${E(ov.baseFund||ov.fundA)} / ${E(ov.comparisonFund||ov.fundB)} overlap ${pct(ov.weightedOverlapPct,2)}`:'Overlap unresolved'}</b><p>${ov?`${Number(ov.sharedHoldingsCount||ov.sharedCount||0).toLocaleString()} shared holdings.`:''}</p></div><div><small>Reweighting</small><b>${rw.length?'The tilts change company-level weights.':'Reweighting unresolved'}</b><p>${rw.map(x=>`${E(x.ticker||x.name)} ${N(x.reweightingPctPoints)>=0?'+':''}${N(x.reweightingPctPoints).toFixed(2)} pts`).join(' · ')}</p></div></div>`,n++);
   const mon=[];if(largestName&&largestW!=null)mon.push(['Largest company exposure',`${E(largestName)} ${pct(largestW,2)}`,'Tracks dependence on a single underlying business.']);if(top10!=null)mon.push(['Top-10 concentration',pct(top10,1),'Shows whether broad ownership is becoming more concentrated.']);if(us)mon.push(['Geographic balance',`${pct(us.value,1)} U.S. / ${pct(intl,1)} non-U.S.`,'Changes the regional earnings, currency and valuation mix.']);if(ov)mon.push(['Fund overlap',`${E(ov.baseFund||ov.fundA)} / ${E(ov.comparisonFund||ov.fundB)} ${pct(ov.weightedOverlapPct,2)}`,'Shows whether a sleeve remains distinct.']);if(py!=null)mon.push(['Portfolio YTD',sg(py),'Performance is evidence to explain, not a thesis by itself.']);for(const f of mf.slice(0,2))mon.push([f.title,f.evidence,f.portfolioConnection||f.implication]);
   h+=page(`<div class="pt150-k">THESIS MONITOR</div><h2>Evidence worth watching next.</h2><table class="pt150-monitor"><thead><tr><th>Evidence</th><th>Current reading</th><th>Why it matters</th></tr></thead><tbody>${mon.map(x=>`<tr><td><b>${x[0]}</b></td><td>${x[1]}</td><td>${x[2]}</td></tr>`).join('')}</tbody></table><div class="pt150-disc">Portfolio Thesis is educational research, not individualized investment, tax or legal advice. Observation dates vary by source; missing evidence is not estimated.</div>`,n++);h+='</div>';
   const host=document.getElementById('ptrReportOverlay')||document.getElementById('reportOverlay')||document.getElementById('ptGeneratedReport')||document.body;host.innerHTML=h;host.style.display='block';document.body.classList.add('ptr-report-open');window.scrollTo(0,0);
 };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


/* V164 — final performance transport + DOM binding repair.
   The earlier build assumed one request/response shape. This adapter accepts the
   supported shapes and only patches the report after verified ticker returns exist. */
(function(){
 const prior=window.ptGeneratePortfolioPublication;
 const N=v=>{if(v===null||v===undefined||v===''||v===false)return null;const n=Number(v);return Number.isFinite(n)?n:null};
 const fmt=v=>v==null?'—':`${v>=0?'+':''}${v.toFixed(2)}%`;
 function walk(o,fn,seen=new Set()){if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);fn(o);if(Array.isArray(o))o.forEach(x=>walk(x,fn,seen));else Object.values(o).forEach(x=>walk(x,fn,seen));}
 function pval(o,names){for(const a of names){for(const v of [o?.[a]?.returnPct,o?.[a]?.pct,o?.[a+'Pct'],o?.[a]?.return,o?.[a]]){const n=N(v);if(n!=null)return n}}return null}
 function extract(root){
   const out={};
   walk(root,o=>{if(Array.isArray(o))return;const t=String(o.ticker||o.symbol||'').toUpperCase();if(!t)return;
     const vals={m1:pval(o,['oneMonth','1m','month1']),m3:pval(o,['threeMonth','3m','month3']),ytd:pval(o,['ytd','YTD']),y1:pval(o,['oneYear','1y','year1'])};
     if(Object.values(vals).some(v=>v!=null))out[t]=Object.assign(out[t]||{},vals,{asOf:o.asOf||o.latestAsOf||o.endDate||null});
   }); return out;
 }
 async function call(body){try{const r=await window.ptSupabase.functions.invoke('security-performance',{body});if(r?.error)throw r.error;return r?.data||null}catch(e){console.warn('V164 security-performance',body,e);return null}}
 async function loadPerf(p){
   // First reuse anything already returned by the report pipeline.
   let map=extract({a:window.__pt151?.securityPerf,b:window.__pt151?.perf});
   const need=()=>p.some(x=>!map[x.ticker]);
   // The Edge Function has existed in more than one request contract during development.
   // Try the current portfolio-shaped contract first, then compatibility contracts.
   const bodies=[
     {holdings:p.map(x=>({ticker:x.ticker,weight:x.weight}))},
     {tickers:p.map(x=>x.ticker)},
     {symbols:p.map(x=>x.ticker)}
   ];
   for(const b of bodies){if(!need())break;const d=await call(b);map=Object.assign(map,extract(d));}
   // Last-resort single-symbol contract. Cached symbols do not consume a fresh provider call.
   if(need())for(const x of p){if(map[x.ticker])continue;const d=await call({ticker:x.ticker});Object.assign(map,extract(d));}
   return map;
 }
 function patchPerformance(map,p){
   const page=[...document.querySelectorAll('.pt150-page')].find(x=>/What moved the portfolio\./i.test(x.textContent||''));
   const table=page?.querySelector('.pt150-table');if(!table)return;
   let sums={m1:0,m3:0,ytd:0,y1:0}, cnt={m1:0,m3:0,ytd:0,y1:0};
   for(const tr of table.querySelectorAll('tbody tr')){
     const td=[...tr.children];if(td.length<7)continue;const t=(td[0].textContent||'').trim().toUpperCase();if(t==='PORTFOLIO')continue;
     const item=p.find(x=>x.ticker===t), w=item?.weight||0, v=map[t]||{};
     td[2].textContent=fmt(v.m1);td[3].textContent=fmt(v.m3);td[4].textContent=fmt(v.ytd);td[5].textContent=fmt(v.y1);
     td[6].textContent=v.m1==null?'—':`${v.m1*w/100>=0?'+':''}${(v.m1*w/100).toFixed(2)} pts`;
     for(const k of ['m1','m3','ytd','y1'])if(v[k]!=null){sums[k]+=v[k]*w/100;cnt[k]++}
   }
   const total=[...table.querySelectorAll('tbody tr')].find(tr=>(tr.children[0]?.textContent||'').trim().toUpperCase()==='PORTFOLIO');
   if(total){const td=[...total.children];td[2].textContent=cnt.m1?fmt(sums.m1):'—';td[3].textContent=cnt.m3?fmt(sums.m3):'—';td[4].textContent=cnt.ytd?fmt(sums.ytd):'—';td[5].textContent=cnt.y1?fmt(sums.y1):'—';td[6].textContent=cnt.m1?`${sums.m1>=0?'+':''}${sums.m1.toFixed(2)} pts`:'—';}
 }
 function patchScorecards(map){
   for(const card of document.querySelectorAll('.pt159-card')){
     const t=(card.querySelector('.pt159-head b')?.textContent||'').trim().toUpperCase(),v=map[t];if(!v)continue;
     const rows=[...card.querySelectorAll('.pt159-table tbody tr')];const row=rows.find(r=>(r.children[0]?.textContent||'').trim()==='Performance');if(!row)continue;
     row.children[1].textContent=`1M ${fmt(v.m1)} · YTD ${fmt(v.ytd)}`;row.children[2].textContent=(v.m1!=null||v.ytd!=null)?'Observed':'Unresolved';
   }
 }
 window.ptGeneratePortfolioPublication=async function(){
   const out=await prior.apply(this,arguments);
   const p=(typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:String(x.ticker||'').toUpperCase(),weight:N(x.weight)||0})).filter(x=>x.ticker&&x.weight>0);
   if(!p.length)return out;
   const map=await loadPerf(p);window.__pt164Performance=map;
   patchPerformance(map,p);patchScorecards(map);return out;
 };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */

/* V165: security-performance returns ticker metadata and period data at different nesting levels.   Bind by ticker, then search inside that ticker record for the actual period objects. */(function(){ const prior=window.ptGeneratePortfolioPublication; const N=v=>{if(v===null||v===undefined||v===''||v===false)return null;const n=Number(v);return Number.isFinite(n)?n:null}; const fmt=v=>v==null?'—':`${v>=0?'+':''}${v.toFixed(2)}%`; function deepPeriod(root,aliases){let found=null,seen=new Set();function rec(o){if(found!=null||!o||typeof o!=='object'||seen.has(o))return;seen.add(o);for(const a of aliases){const x=o[a];if(x!==undefined){for(const v of [x?.returnPct,x?.pct,o[a+'Pct'],x?.return,x]){const n=N(v);if(n!=null){found=n;return}}}}for(const v of Object.values(o))rec(v)}rec(root);return found} function tickerOf(o){return String(o?.ticker||o?.symbol||o?.security?.ticker||o?.security?.symbol||'').toUpperCase()} function extract(root){const out={},seen=new Set();function rec(o){if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);if(!Array.isArray(o)){const t=tickerOf(o);if(t){const v={m1:deepPeriod(o,['oneMonth','1m','month1']),m3:deepPeriod(o,['threeMonth','3m','month3']),ytd:deepPeriod(o,['ytd','YTD']),y1:deepPeriod(o,['oneYear','1y','year1'])};if(Object.values(v).some(x=>x!=null))out[t]=Object.assign(out[t]||{},v)}}for(const v of Object.values(o))rec(v)}rec(root);return out} async function invoke(body){try{const r=await window.ptSupabase.functions.invoke('security-performance',{body});if(r?.error)throw r.error;return r?.data}catch(e){console.warn('V165 security-performance',e);return null}} function patch(map,p){const page=[...document.querySelectorAll('.pt150-page')].find(x=>/What moved the portfolio\./i.test(x.textContent||''));const table=page?.querySelector('.pt150-table');let sums={m1:0,m3:0,ytd:0,y1:0},counts={m1:0,m3:0,ytd:0,y1:0};if(table){for(const tr of table.querySelectorAll('tbody tr')){const td=[...tr.children];if(td.length<7)continue;const t=(td[0].textContent||'').trim().toUpperCase();if(t==='PORTFOLIO')continue;const h=p.find(x=>x.ticker===t),v=map[t]||{},w=h?.weight||0;td[2].textContent=fmt(v.m1);td[3].textContent=fmt(v.m3);td[4].textContent=fmt(v.ytd);td[5].textContent=fmt(v.y1);td[6].textContent=v.m1==null?'—':`${v.m1*w/100>=0?'+':''}${(v.m1*w/100).toFixed(2)} pts`;for(const k of ['m1','m3','ytd','y1'])if(v[k]!=null){sums[k]+=v[k]*w/100;counts[k]++}}const total=[...table.querySelectorAll('tbody tr')].find(tr=>(tr.children[0]?.textContent||'').trim().toUpperCase()==='PORTFOLIO');if(total){const td=[...total.children];for(const [i,k] of [[2,'m1'],[3,'m3'],[4,'ytd'],[5,'y1']])td[i].textContent=counts[k]?fmt(sums[k]):'—';td[6].textContent=counts.m1?`${sums.m1>=0?'+':''}${sums.m1.toFixed(2)} pts`:'—'}} for(const card of document.querySelectorAll('.pt159-card')){const t=(card.querySelector('.pt159-head b')?.textContent||'').trim().toUpperCase(),v=map[t];if(!v)continue;const row=[...card.querySelectorAll('.pt159-table tbody tr')].find(r=>(r.children[0]?.textContent||'').trim()==='Performance');if(row){row.children[1].textContent=`1M ${fmt(v.m1)} · YTD ${fmt(v.ytd)}`;row.children[2].textContent='Observed'}}} window.ptGeneratePortfolioPublication=async function(){const result=await prior.apply(this,arguments);const p=(typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:String(x.ticker||'').toUpperCase(),weight:N(x.weight)||0})).filter(x=>x.ticker&&x.weight>0);if(!p.length)return result;let map=extract(window.__pt151?.securityPerf);if(p.some(x=>!map[x.ticker])){const data=await invoke({tickers:p.map(x=>x.ticker)});map=Object.assign(map,extract(data));window.__pt165RawPerformance=data}patch(map,p);window.__pt165Performance=map;return result}})();

/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const num=v=>{const n=Number(v);return Number.isFinite(n)?n:null};
 const pct=(v,d=1)=>num(v)==null?'—':`${num(v).toFixed(d)}%`;
 const signed=(v,d=2)=>num(v)==null?'—':`${num(v)>=0?'+':''}${num(v).toFixed(d)}%`;
 const get=(o,...paths)=>{for(const p of paths){let v=o;for(const k of p.split('.'))v=v?.[k];if(v!==undefined&&v!==null)return v}return null};
 async function invoke(name,body){try{const r=await window.ptSupabase?.functions?.invoke?.(name,{body});if(r?.error)throw r.error;return r?.data||null}catch(e){console.warn('V150',name,e);return null}}
 const page=(body,n)=>`<section class="pt150-page">${body}<div class="pt150-foot"><span>PORTFOLIO THESIS · GLOBAL OWNERSHIP. DISCIPLINED BALANCE.</span><b>${String(n).padStart(2,'0')}</b></div></section>`;
 const bars=(rows,labelKey='name',valueKey='value',limit=8)=>{const a=(rows||[]).filter(x=>num(x[valueKey])!=null).slice(0,limit),m=Math.max(...a.map(x=>Math.abs(num(x[valueKey]))),1);return a.map(x=>`<div class="pt150-barrow"><span>${esc(x[labelKey]||x.ticker||'')}</span><div class="pt150-bar"><i style="width:${Math.max(2,Math.abs(num(x[valueKey]))/m*100)}%"></i></div><strong>${pct(x[valueKey],2)}</strong></div>`).join('')||'<div class="pt150-empty">No measured data available.</div>'};
 function perfMap(data){const out={};const arr=data?.securities||data?.results||data?.holdings||[];for(const x of arr){const t=String(x.ticker||x.symbol||'').toUpperCase();if(t)out[t]=x}return out}
 function period(x,key){return num(get(x,`${key}.returnPct`,`${key}Pct`,`${key}.pct`,key))}
 function exposuresRows(d,key){const a=get(d,key,`exposures.${key}`,`portfolio.${key}`)||[];return Array.isArray(a)?a.map(x=>({name:x.name||x.region||x.sector||x.country||'Other',value:num(x.portfolioWeightPct??x.shareOfPortfolioPct??x.weightPct??x.weight)})).filter(x=>x.value!=null).sort((a,b)=>b.value-a.value):[]}
 function effectiveRows(a){const arr=get(a,'effectiveExposure','effectiveExposures','lookthrough.effectiveExposure','concentration.effectiveExposure')||[];return Array.isArray(arr)?arr.map(x=>({name:x.ticker||x.name,value:num(x.effectiveWeight??x.effectiveWeightPct??x.portfolioWeightPct??x.weight)})).filter(x=>x.value!=null).sort((a,b)=>b.value-a.value):[]}
 window.ptGeneratePortfolioPublication=async function(){
   const p=(typeof getPortfolio==='function'?getPortfolio():[]).filter(x=>num(x.weight)>0).map(x=>({ticker:String(x.ticker||'').toUpperCase(),weight:num(x.weight)})); if(!p.length)return;
   const name=String(window.ptActivePortfolioName||window.ptCurrentPortfolioName?.()||'My Portfolio'); window.ptActivePortfolioName=name;
   const host=document.getElementById('ptrReportOverlay')||document.getElementById('reportOverlay')||document.getElementById('ptGeneratedReport')||document.body;
   host.innerHTML='';host.style.display='none';
   const body={holdings:p};
   const [analysis,expo,perf,market,reweight]=await Promise.all([
     invoke('portfolio-analysis',body),invoke('portfolio-exposures',body),invoke('portfolio-performance',body),invoke('portfolio-market-analysis',body),invoke('portfolio-reweighting',body)
   ]);
   const pm=perfMap(perf); const eff=effectiveRows(analysis); const geo=exposuresRows(expo,'geography').concat(exposuresRows(expo,'regions')).filter((x,i,a)=>a.findIndex(y=>y.name===x.name)===i); const sectors=exposuresRows(expo,'sectors');
   const largest=get(analysis,'concentration.largestEffectiveCompany')||eff[0]||null; const largestName=largest?.ticker||largest?.name||eff[0]?.name; const largestW=num(largest?.effectiveWeight??largest?.effectiveWeightPct??largest?.value??eff[0]?.value);
   const top10=num(get(analysis,'concentration.top10EffectiveWeightPct','top10EffectiveWeightPct'));
   const overlaps=get(analysis,'overlap.pairs','overlaps','lookthrough.pairwiseOverlap')||[]; const ov=Array.isArray(overlaps)?[...overlaps].filter(x=>num(x.weightedOverlapPct)!=null).sort((a,b)=>num(b.weightedOverlapPct)-num(a.weightedOverlapPct))[0]:null;
   const us=geo.find(x=>/united states|u\.s\.|usa/i.test(x.name)); const intl=us?100-us.value:null;
   const p1=num(get(perf,'portfolio.oneMonth.returnPct','oneMonth.portfolioReturnEstimatePct','oneMonthPortfolioEstimatePct','portfolio.oneMonthPortfolioEstimatePct'))??num(get(market,'performance.oneMonthPortfolioEstimatePct'));
   const pytd=num(get(perf,'portfolio.ytd.returnPct','ytd.portfolioReturnEstimatePct','ytdPortfolioEstimatePct'))??num(get(market,'performance.ytdPortfolioEstimatePct'));
   const p3=num(get(perf,'portfolio.threeMonth.returnPct','threeMonth.portfolioReturnEstimatePct','threeMonthPortfolioEstimatePct'));
   const findings=[];
   if(us)findings.push(['Measured U.S. exposure',pct(us.value,1),`Look-through geography from available fund holdings; international exposure is approximately ${pct(intl,1)}.`]);
   if(largestName&&largestW!=null)findings.push(['Largest underlying company',`${esc(largestName)} · ${pct(largestW,2)}`,'Effective company weight after looking through available fund holdings.']);
   if(top10!=null)findings.push(['Top 10 effective companies',pct(top10,1),'Combined portfolio weight represented by the ten largest measured underlying companies.']);
   if(ov)findings.push(['Largest measured overlap',`${esc(ov.baseFund||ov.fundA||'')} / ${esc(ov.comparisonFund||ov.fundB||'')} · ${pct(ov.weightedOverlapPct,1)}`,`${Number(ov.sharedHoldingsCount||ov.sharedCount||0).toLocaleString()} shared holdings in the measured pair.`]);
   let n=1,html='<div class="pt150-report">';
   html+=page(`<div class="pt150-k">PORTFOLIO THESIS REPORT</div><h1>${esc(name)}</h1><p class="pt150-deck">A research view of what this portfolio actually owns, what has driven its results, and which current conditions matter most to its thesis.</p><div class="pt150-alloc">${p.map(x=>`<div style="width:${x.weight}%">${esc(x.ticker)}</div>`).join('')}</div><div class="pt150-legend">${p.map(x=>`<span><b>${esc(x.ticker)}</b> ${pct(x.weight,0)}</span>`).join('')}</div><div class="pt150-metrics"><div class="pt150-metric"><small>1 month</small><b>${signed(p1)}</b><em>portfolio estimate</em></div><div class="pt150-metric"><small>YTD</small><b>${signed(pytd)}</b><em>portfolio estimate</em></div><div class="pt150-metric"><small>Largest company</small><b>${largestName?esc(largestName):'—'}</b><em>${largestW!=null?pct(largestW,2):'look-through'}</em></div><div class="pt150-metric"><small>Top 10 companies</small><b>${pct(top10,1)}</b><em>effective exposure</em></div></div><div class="pt150-findings">${findings.slice(0,4).map(f=>`<div class="pt150-finding"><small>${f[0]}</small><b>${f[1]}</b><p>${f[2]}</p></div>`).join('')}</div>`,n++);
   html+=page(`<div class="pt150-k">WHAT YOU ACTUALLY OWN</div><h2>Exposure beneath the tickers.</h2><p class="pt150-deck">Fund labels are only the wrapper. These measurements show the companies, regions and sectors carrying the portfolio's economic exposure.</p><div class="pt150-grid2"><div class="pt150-chart"><h3>Largest effective companies</h3>${bars(eff,'name','value',10)}</div><div><div class="pt150-chart"><h3>Geographic exposure</h3>${bars(geo,'name','value',8)}</div><div class="pt150-chart" style="margin-top:24px"><h3>Sector exposure</h3>${bars(sectors,'name','value',8)}</div></div></div>${ov?`<div class="pt150-callout"><b>${esc(ov.baseFund||ov.fundA)} / ${esc(ov.comparisonFund||ov.fundB)} overlap: ${pct(ov.weightedOverlapPct,2)}</b><p>${Number(ov.sharedHoldingsCount||ov.sharedCount||0).toLocaleString()} shared holdings. The useful question is not whether two funds share names, but how much portfolio weight those shared positions actually duplicate.</p></div>`:''}`,n++);
   const rows=p.map(x=>{const s=pm[x.ticker]||{};return {t:x.ticker,w:x.weight,m1:period(s,'oneMonth'),m3:period(s,'threeMonth'),ytd:period(s,'ytd'),y1:period(s,'oneYear'),c:num(get(s,'oneMonth.contributionPctPoints','oneMonthContributionPctPoints','contribution.oneMonthPctPoints'))}});
   html+=page(`<div class="pt150-k">PERFORMANCE & DRIVERS</div><h2>What moved the portfolio.</h2><p class="pt150-deck">Returns show what each security did. Contribution shows how much that movement mattered after portfolio weight is considered.</p><table class="pt150-table"><thead><tr><th>Holding</th><th>Weight</th><th>1M</th><th>3M</th><th>YTD</th><th>1Y</th><th>1M contrib.</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${esc(r.t)}</b></td><td>${pct(r.w,0)}</td><td>${signed(r.m1)}</td><td>${signed(r.m3)}</td><td>${signed(r.ytd)}</td><td>${signed(r.y1)}</td><td>${r.c==null?'—':`${r.c>=0?'+':''}${r.c.toFixed(2)} pts`}</td></tr>`).join('')}<tr class="total"><td>Portfolio</td><td>100%</td><td>${signed(p1)}</td><td>${signed(p3)}</td><td>${signed(pytd)}</td><td>—</td><td>${p1==null?'—':`${p1>=0?'+':''}${p1.toFixed(2)} pts`}</td></tr></tbody></table><p class="pt150-note">Portfolio-period figures are static-current-weight estimates using available adjusted-price history, not the investor's realized account return. Security and macro observation dates may differ and should be shown from source data when available.</p><div class="pt150-callout"><b>Read contribution, not just return.</b><p>A smaller sleeve can post the strongest return without being the portfolio's largest driver. Contribution keeps performance in the context of actual portfolio weight.</p></div>`,n++);
   html+=page(`<div class="pt150-k">FUND & SECURITY RESEARCH</div><h2>Evidence by holding.</h2><p class="pt150-deck">Each security appears once. The emphasis is the evidence that changes the combined portfolio—not a repeated description of its label.</p>${p.map(x=>{const s=pm[x.ticker]||{},e=window.PT_ETF_EVIDENCE?.[x.ticker]||null;const hc=num(e?.holdingsCount),t10=num(e?.top10Weight),asof=e?.asOf||e?.reportPeriod||get(s,'asOf');return `<div class="pt150-security"><div class="pt150-security-head"><b>${esc(x.ticker)}</b><span>${pct(x.weight,0)} OF PORTFOLIO</span></div><div class="pt150-security-grid"><div><small>1 month</small><strong>${signed(period(s,'oneMonth'))}</strong></div><div><small>YTD</small><strong>${signed(period(s,'ytd'))}</strong></div><div><small>Holdings</small><strong>${hc==null?'—':hc.toLocaleString()}</strong></div><div><small>Top 10 weight</small><strong>${pct(t10,1)}</strong></div></div><p>${asof?`Evidence shown from available observations through ${esc(asof)}.`:'Only verified evidence available to the report is shown; missing measurements are left unresolved.'}</p></div>`}).join('')}`,n++);
   const mf=get(market,'reportFindings')||[];
   html+=page(`<div class="pt150-k">CURRENT MARKET ENVIRONMENT</div><h2>The conditions that matter to this portfolio.</h2><p class="pt150-deck">Macro data belongs here only when it has a plausible connection to the portfolio's actual exposures. Evidence is separated from implication; the report does not turn current conditions into a market-timing call.</p>${Array.isArray(mf)&&mf.length?mf.slice(0,6).map(f=>`<div class="pt150-market"><div><span class="tag">${esc(f.materiality||'Relevant')}</span><b>${esc(f.title||'Market factor')}</b></div><div><p><strong>Evidence:</strong> ${esc(f.evidence||'')}</p><p><strong>Portfolio connection:</strong> ${esc(f.portfolioConnection||'')}</p><p><strong>Implication:</strong> ${esc(f.implication||'')}</p></div></div>`).join(''):'<div class="pt150-empty">No current portfolio-specific market findings were available. The report leaves this section unresolved rather than substituting generic market commentary.</div>'}`,n++);
   const rw=get(reweight,'reweighting','companyReweighting','results')||[]; const rwTop=Array.isArray(rw)?rw.filter(x=>num(x.reweightingPctPoints)!=null).sort((a,b)=>Math.abs(num(b.reweightingPctPoints))-Math.abs(num(a.reweightingPctPoints))).slice(0,4):[];
   html+=page(`<div class="pt150-k">PORTFOLIO ANALYSIS</div><h2>What the evidence says about the structure.</h2><p class="pt150-deck">The analytical framework stays behind the report. What matters here are the conclusions supported by measured portfolio evidence.</p><div class="pt150-analysis"><div><small>Structure</small><b>${p.length} holdings create a ${p.map(x=>`${pct(x.weight,0)} ${esc(x.ticker)}`).join(' / ')} allocation.</b><p>The allocation is the starting instruction; the pages above show the resulting economic exposure.</p></div><div><small>Diversification</small><b>${us?`${pct(us.value,1)} U.S. / ${pct(intl,1)} non-U.S. measured exposure`:'Geographic measurement unresolved'}</b><p>Diversification is assessed from underlying exposure rather than ticker count alone.</p></div><div><small>Concentration</small><b>${largestName&&largestW!=null?`${esc(largestName)} is the largest measured company at ${pct(largestW,2)}.`:'Underlying concentration unresolved.'}</b><p>${top10!=null?`The ten largest measured companies represent ${pct(top10,1)} of the portfolio.`:'Top-ten effective concentration was not available.'}</p></div><div><small>Fund interaction</small><b>${ov?`${esc(ov.baseFund||ov.fundA)} / ${esc(ov.comparisonFund||ov.fundB)} measured overlap is ${pct(ov.weightedOverlapPct,2)}.`:'No measured overlap result available.'}</b><p>${ov?`${Number(ov.sharedHoldingsCount||ov.sharedCount||0).toLocaleString()} shared holdings are weighted by actual fund position size.`:'No generic overlap conclusion is substituted.'}</p></div><div><small>Reweighting</small><b>${rwTop.length?'The tilt sleeves measurably change company weights.':'Company-level reweighting unresolved.'}</b><p>${rwTop.length?rwTop.map(x=>`${esc(x.ticker||x.name)} ${num(x.reweightingPctPoints)>=0?'+':''}${num(x.reweightingPctPoints).toFixed(2)} pts`).join(' · '):'This section remains compact until constituent-level reweighting evidence is available.'}</p></div><div><small>Thesis test</small><b>The thesis should change when the evidence changes—not because prices moved alone.</b><p>Monitor concentration, overlap, factor distinctness, valuation evidence, performance drivers and the market conditions directly connected to those exposures.</p></div></div>`,n++);
   const monitors=[]; if(largestName&&largestW!=null)monitors.push(['Largest company exposure',`${esc(largestName)} ${pct(largestW,2)}`,'A material rise would increase dependence on one underlying business.']); if(top10!=null)monitors.push(['Top-10 concentration',pct(top10,1),'Track whether broad fund ownership is becoming more concentrated underneath the wrappers.']); if(us)monitors.push(['Geographic balance',`${pct(us.value,1)} U.S. / ${pct(intl,1)} non-U.S.`,'A material shift changes the portfolio’s regional earnings, currency and valuation mix.']); if(ov)monitors.push(['Fund overlap',`${esc(ov.baseFund||ov.fundA)} / ${esc(ov.comparisonFund||ov.fundB)} ${pct(ov.weightedOverlapPct,2)}`,'Rising overlap can reduce the distinct job of a sleeve.']); if(pytd!=null)monitors.push(['Portfolio YTD',signed(pytd),'Performance is evidence to explain, not by itself a reason to abandon the allocation.']); for(const f of (Array.isArray(mf)?mf.slice(0,2):[]))monitors.push([f.title||'Market factor',f.evidence||'Current evidence available',f.portfolioConnection||f.implication||'Monitor for a material change in portfolio relevance.']);
   html+=page(`<div class="pt150-k">THESIS MONITOR</div><h2>Evidence worth watching next.</h2><p class="pt150-deck">A short monitoring list is more useful than a long checklist. These are the current measurements most capable of changing how the portfolio should be understood.</p><table class="pt150-monitor"><thead><tr><th>Evidence</th><th>Current reading</th><th>Why it matters</th></tr></thead><tbody>${monitors.map(x=>`<tr><td><b>${x[0]}</b></td><td>${x[1]}</td><td>${x[2]}</td></tr>`).join('')}</tbody></table><div class="pt150-disc">Portfolio Thesis is educational research, not individualized investment, tax or legal advice. Data availability and observation dates vary by source. Missing evidence is left unresolved rather than estimated.</div>`,n++);
   html+='</div>'; host.innerHTML=html;host.style.display='block';document.body.classList.add('ptr-report-open');window.scrollTo(0,0);
 };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


/* V151 — data-binding repair. Missing values stay missing; live research is normalized across backend response shapes. */
(function(){
 const old=window.ptGeneratePortfolioPublication;
 const N=v=>{if(v===null||v===undefined||v===''||v===false)return null;const n=Number(v);return Number.isFinite(n)?n:null};
 function walk(o,fn,seen=new Set()){if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);fn(o);if(Array.isArray(o)){for(const x of o)walk(x,fn,seen)}else{for(const v of Object.values(o))walk(v,fn,seen)}}
 function tickerMap(root){const m={};walk(root,o=>{const t=String(o.ticker||o.symbol||'').toUpperCase();if(t&&/^[A-Z][A-Z0-9.-]{0,9}$/.test(t)){m[t]=Object.assign(m[t]||{},o)}});return m}
 function findArray(root,pred){let best=[];walk(root,o=>{if(Array.isArray(o)&&o.length&&o.filter(x=>x&&typeof x==='object'&&pred(x)).length>=Math.max(1,Math.ceil(o.length*.4))&&o.length>best.length)best=o});return best}
 function firstNum(o,keys){for(const k of keys){const parts=k.split('.');let v=o;for(const p of parts)v=v?.[p];const n=N(v);if(n!==null)return n}return null}
 function perfVal(o,period){const aliases={oneMonth:['oneMonth','1m','month1'],threeMonth:['threeMonth','3m','month3'],ytd:['ytd','YTD'],oneYear:['oneYear','1y','year1']}[period]||[period];for(const a of aliases){const n=firstNum(o,[`${a}.returnPct`,`${a}.pct`,`${a}Pct`,`${a}.return`,a]);if(n!==null)return n}return null}
 async function inv(name,body){try{const r=await window.ptSupabase.functions.invoke(name,{body});if(r.error)throw r.error;return r.data}catch(e){console.warn('V151 '+name,e);return null}}
 window.ptGeneratePortfolioPublication=async function(){
  const p=(typeof getPortfolio==='function'?getPortfolio():[]).filter(x=>N(x.weight)>0).map(x=>({ticker:String(x.ticker||'').toUpperCase(),weight:N(x.weight)}));if(!p.length)return;
  const name=String(window.ptActivePortfolioName||window.ptCurrentPortfolioName?.()||'My Portfolio');window.ptActivePortfolioName=name;
  const host=document.getElementById('ptrReportOverlay')||document.getElementById('reportOverlay')||document.getElementById('ptGeneratedReport')||document.body;
  host.innerHTML='';host.style.display='none';
  try{if(typeof window.ptLoadPortfolioETFEvidence==='function')await window.ptLoadPortfolioETFEvidence(p,{force:false})}catch(e){console.warn('V151 ETF evidence preload',e)}
  const body={holdings:p};
  const [analysis,expo,perf,market,reweight,look,securityPerf]=await Promise.all([
    ...['portfolio-analysis','portfolio-exposures','portfolio-performance','portfolio-market-analysis','portfolio-reweighting','portfolio-lookthrough'].map(x=>inv(x,body)),
    inv('security-performance',{tickers:p.map(x=>x.ticker)})
  ]);
  // Security-level return history comes from security-performance, while portfolio-performance supplies portfolio estimates.
  // Preserve both payloads so the renderer can bind fund rows without inventing missing values.
  if(perf&&typeof perf==='object') perf.securityPerformance=securityPerf;
  // Seed compatibility objects so the V150 renderer can consume richer response shapes.
  const pm=Object.assign({},tickerMap(perf),tickerMap(securityPerf),tickerMap(market));
  const securities=p.map(h=>{const x=pm[h.ticker]||{};return {ticker:h.ticker,asOf:x.asOf||x.latestAsOf||x.endDate||null,oneMonth:{returnPct:perfVal(x,'oneMonth'),contributionPctPoints:firstNum(x,['oneMonth.contributionPctPoints','contributionPctPoints','contribution.oneMonthPctPoints'])},threeMonth:{returnPct:perfVal(x,'threeMonth')},ytd:{returnPct:perfVal(x,'ytd')},oneYear:{returnPct:perfVal(x,'oneYear')}}});
  if(perf&&typeof perf==='object')perf.securities=securities;
  // Normalize look-through concentration and overlaps from either analysis or portfolio-lookthrough.
  const effArr=findArray(look||analysis,x=>N(x.effectiveWeight??x.effectiveWeightPct??x.portfolioWeightPct)!=null&&(x.ticker||x.name));
  const normalizedEff=effArr.map(x=>({ticker:x.ticker||x.name,name:x.name||x.ticker,effectiveWeight:N(x.effectiveWeight??x.effectiveWeightPct??x.portfolioWeightPct)})).filter(x=>x.effectiveWeight!=null).sort((a,b)=>b.effectiveWeight-a.effectiveWeight);
  const pairArr=findArray(look||analysis,x=>N(x.weightedOverlapPct)!=null&&(x.baseFund||x.fundA));
  if(analysis&&typeof analysis==='object'){
    analysis.effectiveExposure=normalizedEff.length?normalizedEff:(analysis.effectiveExposure||[]);
    analysis.overlaps=pairArr.length?pairArr:(analysis.overlaps||[]);
    analysis.concentration=analysis.concentration||{};
    if(!analysis.concentration.largestEffectiveCompany&&normalizedEff[0])analysis.concentration.largestEffectiveCompany=normalizedEff[0];
    if(N(analysis.concentration.top10EffectiveWeightPct)==null&&normalizedEff.length)analysis.concentration.top10EffectiveWeightPct=normalizedEff.slice(0,10).reduce((a,x)=>a+(N(x.effectiveWeight)||0),0);
  }
  // Cache exact payloads for the renderer override below.
  window.__pt151={analysis,expo,perf,market,reweight,look,securityPerf,p,name};
  return window.__ptRender151();
 };
 window.__ptRender151=function(){
   const D=window.__pt151;if(!D)return old?.();
   const {analysis,expo,perf,market,reweight,look,p,name}=D;
   const E=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
   const pct=(v,d=1)=>N(v)==null?'—':`${N(v).toFixed(d)}%`, sg=(v,d=2)=>N(v)==null?'—':`${N(v)>=0?'+':''}${N(v).toFixed(d)}%`;
   const page=(b,n)=>`<section class="pt150-page">${b}<div class="pt150-foot"><span>PORTFOLIO THESIS · GLOBAL OWNERSHIP. DISCIPLINED BALANCE.</span><b>${String(n).padStart(2,'0')}</b></div></section>`;
   const bars=(a,l=10)=>{const z=(a||[]).filter(x=>N(x.value)!=null).slice(0,l),m=Math.max(...z.map(x=>Math.abs(N(x.value))),1);return z.length?z.map(x=>`<div class="pt150-barrow"><span>${E(x.name)}</span><div class="pt150-bar"><i style="width:${Math.max(2,Math.abs(N(x.value))/m*100)}%"></i></div><strong>${pct(x.value,2)}</strong></div>`).join(''):'<div class="pt150-empty">No measured data available.</div>'};
   const eff=(analysis?.effectiveExposure||[]).map(x=>({name:x.ticker||x.name,value:N(x.effectiveWeight??x.effectiveWeightPct??x.portfolioWeightPct)})).filter(x=>x.value!=null).sort((a,b)=>b.value-a.value);
   const expA=findArray(expo,x=>(x.name||x.region||x.country||x.sector)&&N(x.portfolioWeightPct??x.shareOfPortfolioPct??x.weightPct)!=null);
   const allExp=expA.map(x=>({name:x.name||x.region||x.country||x.sector,value:N(x.portfolioWeightPct??x.shareOfPortfolioPct??x.weightPct)}));
   let geo=(expo?.geography||expo?.regions||expo?.exposures?.geography||[]).map(x=>({name:x.name||x.region||x.country,value:N(x.portfolioWeightPct??x.shareOfPortfolioPct??x.weightPct)})).filter(x=>x.value!=null);
   let sectors=(expo?.sectors||expo?.exposures?.sectors||[]).map(x=>({name:x.name||x.sector,value:N(x.portfolioWeightPct??x.shareOfPortfolioPct??x.weightPct)})).filter(x=>x.value!=null);
   if(!geo.length)geo=allExp.filter(x=>/United States|U\.S\.|USA|Europe|Japan|Canada|Emerging|Pacific|Asia|International|Other/i.test(x.name));
   if(!sectors.length)sectors=allExp.filter(x=>/Technology|Financial|Industrial|Health|Consumer|Energy|Communication|Utilities|Materials|Real Estate/i.test(x.name));
   geo.sort((a,b)=>b.value-a.value);sectors.sort((a,b)=>b.value-a.value);
   const largest=analysis?.concentration?.largestEffectiveCompany||eff[0]||{}, largestName=largest.ticker||largest.name||eff[0]?.name, largestW=N(largest.effectiveWeight??largest.effectiveWeightPct??largest.value??eff[0]?.value);
   const top10=N(analysis?.concentration?.top10EffectiveWeightPct)??(eff.length?eff.slice(0,10).reduce((a,x)=>a+x.value,0):null);
   let ovs=(analysis?.overlaps||analysis?.overlap?.pairs||look?.overlaps||look?.pairwiseOverlap||look?.pairwise||[]).filter(x=>N(x.weightedOverlapPct)!=null).sort((a,b)=>N(b.weightedOverlapPct)-N(a.weightedOverlapPct));
   const pairName=x=>[String(x.baseFund||x.fundA||x.baseTicker||x.tickerA||'').toUpperCase(),String(x.comparisonFund||x.fundB||x.comparisonTicker||x.tickerB||'').toUpperCase()].filter(Boolean);
   const pairKey=x=>pairName(x).sort().join('|');
   const wanted=[];for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++)wanted.push([p[i].ticker,p[j].ticker]);
   const byPair=new Map(ovs.map(x=>[pairKey(x),x]));
   ovs=wanted.map(([a,b])=>byPair.get([a,b].sort().join('|'))).filter(Boolean);
   const ov=ovs.slice().sort((a,b)=>N(b.weightedOverlapPct)-N(a.weightedOverlapPct))[0]||null;
   const overlapRows=ovs.map(x=>{const q=pairName(x),shared=N(x.sharedHoldingsCount??x.sharedCount);return {a:q[0]||'—',b:q[1]||'—',overlap:N(x.weightedOverlapPct),shared}});
   const rwAll=findArray(reweight,x=>N(x.reweightingPctPoints)!=null).filter(x=>N(x.reweightingPctPoints)!=null);
   const rwFor=(a,b)=>rwAll.filter(x=>{const f=String(x.baseFund||x.baseTicker||x.sourceFund||'').toUpperCase(),t=String(x.tiltFund||x.comparisonFund||x.comparisonTicker||x.targetFund||'').toUpperCase();return (!f&&!t)||((f===a&&t===b)||(f===b&&t===a))}).sort((x,y)=>Math.abs(N(y.reweightingPctPoints))-Math.abs(N(x.reweightingPctPoints))).slice(0,3);
   const us=geo.find(x=>/United States|U\.S\.|USA/i.test(x.name)),intl=us?100-us.value:null;
   const pm=tickerMap(perf);
   const p1=N(perf?.oneMonth?.portfolioReturnEstimatePct??perf?.oneMonthPortfolioEstimatePct??market?.performance?.oneMonthPortfolioEstimatePct),p3=N(perf?.threeMonth?.portfolioReturnEstimatePct??perf?.threeMonthPortfolioEstimatePct),py=N(perf?.ytd?.portfolioReturnEstimatePct??perf?.ytdPortfolioEstimatePct??market?.performance?.ytdPortfolioEstimatePct);
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
