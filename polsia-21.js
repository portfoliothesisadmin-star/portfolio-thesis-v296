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
