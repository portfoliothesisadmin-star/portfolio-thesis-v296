 // V193: evidence-gated lenses. A lens only appears when it adds a portfolio-specific finding
 // that is not simply a restatement of allocation, X-Ray, or performance data.
 const lensCards=[];
 if(lowOverlap){
   lensCards.push(lens('01','DIVERSIFICATION',`${E(lowOverlap.baseFund)} / ${E(lowOverlap.comparisonFund)} are meaningfully distinct`,`${Number(lowOverlap.weightedOverlapPct).toFixed(1)}% weighted overlap across ${Number(lowOverlap.sharedHoldingsCount||0).toLocaleString()} shared holdings means the second sleeve changes which companies receive portfolio weight rather than merely adding another ticker.`));
 }
 if(largestEff!=null){
   const top10=N(lf.top10EffectiveWeightPct);
   lensCards.push(lens(String(lensCards.length+1).padStart(2,'0'),'CONCENTRATION',`${E(String(largest.ticker||largest.name||'Largest company'))} is the largest measured company driver`,`${largestEff.toFixed(1)}% effective exposure${top10!=null?`; the ten largest effective company exposures together represent ${top10.toFixed(1)}% of the portfolio`:''}. This is the concentration that matters underneath the fund wrappers.`));
 }
 if(smallValue>0 && core>0){
   lensCards.push(lens(String(lensCards.length+1).padStart(2,'0'),'STRUCTURE',`The tilt changes composition without replacing the core`,`The ${smallValue.toFixed(0)}% small/value sleeve is sized as a reweighting around a ${core.toFixed(0)}% core. Its job is therefore to change which companies receive emphasis while leaving the broad-market foundation responsible for most portfolio behavior.`));
 }
 // Valuation is intentionally omitted until dated fund-level valuation evidence exists.
 // Risk durability only earns a card when the report has measured cross-sleeve performance divergence.
 let perfRoot=window.__ptPortfolioPerformance||window.__ptPortfolioPerf||window.ptPortfolioPerformance||null;
 let perfMap={};
 if(perfRoot){ try{ perfMap=tickerMap(perfRoot); }catch(_){} }
 const avuv1=N(perfMap.AVUV?.oneMonth??perfMap.AVUV?.oneMonthReturnPct??perfMap.AVUV?.returns?.oneMonth??perfMap.AVUV?.returns?.['1M']);
 const vti1=N(perfMap.VTI?.oneMonth??perfMap.VTI?.oneMonthReturnPct??perfMap.VTI?.returns?.oneMonth??perfMap.VTI?.returns?.['1M']);
 if(avuv1!=null && vti1!=null && rows.some(x=>x.t==='AVUV') && rows.some(x=>x.t==='VTI')){
   const aw=rows.find(x=>x.t==='AVUV')?.w||0, vw=rows.find(x=>x.t==='VTI')?.w||0;
   lensCards.push(lens(String(lensCards.length+1).padStart(2,'0'),'RISK DURABILITY',`The tilt can diverge sharply without dominating the portfolio`,`Over the measured month AVUV returned ${avuv1.toFixed(1)}% versus VTI ${vti1.toFixed(1)}%. At ${aw.toFixed(0)}% versus ${vw.toFixed(0)}% portfolio weights, the construction limits how much that sleeve can control total results while preserving the intended differentiated exposure.`));
 }
 if(thesisTest.length){
   lensCards.push(lens(String(lensCards.length+1).padStart(2,'0'),'THESIS TEST','What would make this construction materially different?',`${E(thesisTest.join('; '))}. This is a test of the portfolio's intended exposures—not a reaction to price movement by itself.`));
 }
 if(lensCards.length){
   html+=page(`<div class="pti-k">PORTFOLIO LENSES</div><h2>Only findings that add something new.</h2><p class="pti-lead">These lenses interpret the combined portfolio. Missing evidence removes a lens instead of creating a generic placeholder.</p><div class="pt149-lenses">${lensCards.join('')}</div>`,n++);
 }
 // PAGE 4 — what can affect it. No duplicate holding breakdown. Direct companies only get evidence cards.
 const signals=[];
 if(largestEff!=null)signals.push([`Underlying concentration`,`Watch whether ${E(String(largest.ticker||largest.name||''))} or another company becomes a materially larger effective portfolio exposure than the current ${largestEff.toFixed(1)}%.`]);
 if(highOverlap)signals.push([`Fund overlap`,`Recalculate if ${E(highOverlap.baseFund)} / ${E(highOverlap.comparisonFund)} weighted overlap materially changes from the measured ${Number(highOverlap.weightedOverlapPct).toFixed(1)}%.`]);
 if(smallValue>0)signals.push([`Small/value distinctness`,`The ${smallValue.toFixed(0)}% tilt must continue to alter size/value exposure rather than becoming an expensive duplicate of the core.`]);
 if(intl>0)signals.push([`International distinctness`,`The ${intl.toFixed(0)}% non-U.S. sleeve should continue to provide a different earnings, sector, currency and valuation base from the U.S. core.`]);
 if(!valuationStrong)signals.push([`Valuation evidence`,`Fund-level valuation is currently incomplete. Do not infer cheap or expensive from recent performance; populate dated fund valuation evidence before making that claim.`]);
 const companyCards=ce.map(x=>{const e=x.e||{};const vg=e.price>0&&e.normalized>0?`${e.price>e.normalized?`${((e.price/e.normalized-1)*100).toFixed(1)}% above`:`${((1-e.price/e.normalized)*100).toFixed(1)}% below`} normalized value`:'valuation incomplete';return `<div class="pt149-company"><div class="pt149-company-head"><strong>${E(x.t)}</strong><span>${e.score??'—'}/100 · ${e.completeness??'—'}% complete</span></div><p>${E(vg)}${e.best?` · strongest evidence: ${E(e.best[0])} ${e.best[1]}/20`:''}${e.weak?` · weakest evidence: ${E(e.weak[0])} ${e.weak[1]}/20`:''}.</p></div>`}).join('');
 html+=page(`<div class="pti-k">THESIS & MONITORING</div><h2>What could actually affect this portfolio.</h2><p class="pti-lead">These are construction-specific review triggers—not a list of generic market risks.</p><div>${signals.map(s=>`<div class="pt149-signal"><b>${s[0]}</b><p>${s[1]}</p></div>`).join('')}</div>${companyCards?`<div style="margin-top:24px"><div class="pt149-label">DIRECT COMPANY EVIDENCE</div>${companyCards}</div>`:''}<div class="pti-bottom"><small>DECISION RULE</small><p>Prices change continuously. Revisit the portfolio thesis when the evidence supporting its structure, diversification, concentration, valuation or intended tilts materially changes.</p></div><div class="pti-disc">Portfolio Thesis is educational research, not individualized investment, tax or legal advice.</div>`,n++);
 html+='</div>';
 const host=document.getElementById('ptrReportOverlay')||document.getElementById('reportOverlay')||document.body; host.innerHTML=html; host.style.display='block'; document.body.classList.add('ptr-report-open'); window.scrollTo(0,0);
};


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
   const ovs=(analysis?.overlaps||analysis?.overlap?.pairs||[]).filter(x=>N(x.weightedOverlapPct)!=null).sort((a,b)=>N(b.weightedOverlapPct)-N(a.weightedOverlapPct)),ov=ovs[0]||null;
   const us=geo.find(x=>/United States|U\.S\.|USA/i.test(x.name)),intl=us?100-us.value:null;
   const pm={};for(const x of perf?.securities||[])pm[String(x.ticker||'').toUpperCase()]=x;
   const p1=N(perf?.oneMonth?.portfolioReturnEstimatePct??perf?.oneMonthPortfolioEstimatePct??market?.performance?.oneMonthPortfolioEstimatePct),p3=N(perf?.threeMonth?.portfolioReturnEstimatePct??perf?.threeMonthPortfolioEstimatePct),py=N(perf?.ytd?.portfolioReturnEstimatePct??perf?.ytdPortfolioEstimatePct??market?.performance?.ytdPortfolioEstimatePct);
   const rows=p.map(h=>{const s=pm[h.ticker]||{};return {t:h.ticker,w:h.weight,m1:perfVal(s,'oneMonth'),m3:perfVal(s,'threeMonth'),ytd:perfVal(s,'ytd'),y1:perfVal(s,'oneYear'),c:firstNum(s,['oneMonth.contributionPctPoints','contributionPctPoints'])}});
