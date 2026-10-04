  if(p){
    p.style.display="block";
    p.hidden=false;
    p.classList.add("active");
    window.scrollTo(0,0);
    ptLoadResearchUniverse();
  }
}
function ptOpenModelPortfoliosInternal(){
  ptOpenResearchUniverseDashboard();
  const host=document.getElementById("ptResearchRecord");
  if(host){
    host.innerHTML='<div class="pt-research-record"><div class="pt-admin-eyebrow">Portfolio Thesis Research · Internal</div><div class="pt-admin-title" style="font-size:28px">Model Portfolios</div><p class="pt-admin-sub">This is the next research module. It will preserve each paper portfolio version, evidence at entry, benchmark, methodology and forward results without hindsight rewriting.</p></div>';
    host.scrollIntoView({behavior:"smooth",block:"start"});
  }
}
window.ptOpenResearchUniverseDashboard=ptOpenResearchUniverseDashboard;
window.ptOpenModelPortfoliosInternal=ptOpenModelPortfoliosInternal;


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  function restoreHome(){
    const header=document.querySelector('body > header');
    if(header) header.style.display='';
    const home=document.getElementById('reportHome');
    if(home){home.style.display='block';home.hidden=false;}
    const main=document.querySelector('body > main');
    if(main) main.style.display='';
    const ids=['ptGeneratedReport','ptDVGeneratedReport','ptResearchGeneratedReport','ptSavedReportHost','researchUniverse'];
    ids.forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none';});
    document.querySelectorAll('main section').forEach(el=>el.style.display='none');
    if(home) home.style.display='block';
    window.scrollTo(0,0);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(restoreHome,0));
  else setTimeout(restoreHome,0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


/* V148 — Six Lenses Restored
   Adds look-through holdings, sector/country exposure, concentration and
   portfolio overlap/effective-exposure calculations. This is research
   infrastructure; V145 publication rendering is intentionally unchanged. */
(function(){
 const oldFetch=window.ptFetchETFEvidence;
 function n(v){if(v===null||v===undefined||v===''||v===false)return null;const x=Number(v);return Number.isFinite(x)?x:null}
 function normHolding(h){return {
   ticker:String(h.ticker||h.instrument_ticker||h.asset||'').toUpperCase()||null,
   name:h.name||h.instrument_name||h.issuer_name||null,
   weight:n(h.weightPct??h.weight_pct??h.weightPercentage??h.weight),
   sector:h.sector||null,country:h.country||h.country_name||null,
   assetClass:h.assetClass||h.asset_class||null
 }}
 function mergeRich(t,data){
   const e=window.PT_ETF_EVIDENCE?.[t]; if(!e||!data)return e;
   const holdings=(data.holdings||data.topHoldings||[]).map(normHolding).filter(x=>x.weight!=null);
   const rich={
     fundName:data.fundName||data.fund_name||e.fundName||null,
     asOf:data.asOf||data.as_of||data.reportPeriod||e.asOf||null,
     holdingsCount:n(data.holdingsCount??data.holdings_count)??e.holdingsCount??null,
     holdings:holdings.length?holdings:(e.holdings||[]),
     sectors:data.sectors||data.sectorExposure||e.sectors||[],
     countries:data.countries||data.countryExposure||e.countries||[],
     top10Weight:n(data.top10Weight)??e.top10Weight??null,
     source:data.source||e.source||null,
     stale:!!data.stale
   };
   Object.assign(e,rich);
   return e;
 }
 function derive(e){
   if(!e)return null; const hs=e.holdings||[];
   if(hs.length){
     e.top10Weight=hs.slice().sort((a,b)=>(b.weight||0)-(a.weight||0)).slice(0,10).reduce((a,h)=>a+(n(h.weight)||0),0);
     if(!e.holdingsCount)e.holdingsCount=hs.length;
     const agg=k=>Object.entries(hs.reduce((m,h)=>{const x=h[k]||'Other';m[x]=(m[x]||0)+(n(h.weight)||0);return m},{})).sort((a,b)=>b[1]-a[1]).map(([name,weight])=>({name,weight}));
     if(!e.sectors?.length)e.sectors=agg('sector');
     if(!e.countries?.length)e.countries=agg('country');
   }
   return e;
 }
 window.ptFundEvidence=function(t){return derive(window.PT_ETF_EVIDENCE?.[String(t||'').toUpperCase()]||null)};
 window.ptFundOverlap=function(a,b){
   const A=window.ptFundEvidence(a),B=window.ptFundEvidence(b); if(!A||!B)return null;
   const ma=new Map((A.holdings||[]).filter(x=>x.ticker).map(x=>[x.ticker,n(x.weight)||0]));
   const mb=new Map((B.holdings||[]).filter(x=>x.ticker).map(x=>[x.ticker,n(x.weight)||0]));
   if(!ma.size||!mb.size)return null;
   let overlap=0; const shared=[];
   for(const [t,wa] of ma){if(mb.has(t)){const wb=mb.get(t),w=Math.min(wa,wb);overlap+=w;shared.push({ticker:t,weightA:wa,weightB:wb,overlapWeight:w})}}
   shared.sort((x,y)=>y.overlapWeight-x.overlapWeight);
   return {fundA:String(a).toUpperCase(),fundB:String(b).toUpperCase(),overlapPct:overlap,sharedCount:shared.length,largestShared:shared.slice(0,15)};
 };
 window.ptPortfolioLookThrough=function(portfolio){
   const p=portfolio||[]; const exposure=new Map(); let coveredWeight=0;
   for(const pos of p){const t=String(pos.ticker||'').toUpperCase(),pw=n(pos.weight)||0,e=window.ptFundEvidence(t);
     if(e?.holdings?.length){coveredWeight+=pw;for(const h of e.holdings){if(!h.ticker||h.weight==null)continue; exposure.set(h.ticker,(exposure.get(h.ticker)||0)+pw*h.weight/100)}}
     else if(!window.ptETFIsEvidenceFund?.(t)){exposure.set(t,(exposure.get(t)||0)+pw)}
   }
   const rows=[...exposure].map(([ticker,weight])=>({ticker,weight})).sort((a,b)=>b.weight-a.weight);
   return {coveredPortfolioWeight:coveredWeight,positions:rows,top10:rows.slice(0,10),top10Weight:rows.slice(0,10).reduce((a,x)=>a+x.weight,0)};
 };
 window.ptEffectiveExposure=function(portfolio,ticker){const x=window.ptPortfolioLookThrough(portfolio);const t=String(ticker||'').toUpperCase();return x.positions.find(r=>r.ticker===t)?.weight??null};
 window.ptFetchETFEvidence=async function(symbol,{force=false}={}){
   const t=String(symbol||'').toUpperCase();
   let base=null;
   try{base=await oldFetch(t,{force})}catch(_){base=window.PT_ETF_EVIDENCE?.[t]||null}
   // V147 endpoint may return richer fields even when legacy fields are null.
   if(window.ptSupabase?.functions?.invoke){
    try{const {data,error}=await window.ptSupabase.functions.invoke('etf-evidence-data',{body:{symbol:t,mode:'fund-evidence-v2'}});if(!error&&data){
      mergeRich(t,data); derive(window.PT_ETF_EVIDENCE[t]);
      try{localStorage.setItem(`pt_etf_evidence_${t}`,JSON.stringify({savedAt:Date.now(),data:window.PT_ETF_EVIDENCE[t]}))}catch(_){ }
      try{window.ptCaptureETFUniverse?.(t,window.PT_ETF_EVIDENCE[t],'fund-evidence-v2')}catch(_){ }
    }}catch(e){console.warn('V147 fund evidence unavailable',t,e)}
   }
   return derive(window.PT_ETF_EVIDENCE?.[t]||base);
 };
 window.ptLoadPortfolioETFEvidence=async function(portfolio,{force=false}={}){const ts=[...new Set((portfolio||[]).map(x=>String(x.ticker||'').toUpperCase()).filter(t=>window.ptETFIsEvidenceFund?.(t)))];for(const t of ts)await window.ptFetchETFEvidence(t,{force});return ts};
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


/* V149 replaces the repetitive Issue-001 imitation with a four-part analyst report. */
ptGeneratePortfolioPublication=async function(){
 const E=ptEsc, p=getPortfolio().filter(x=>Number(x.weight)>0); if(!p.length)return;
 const portfolioName=String(window.ptActivePortfolioName||ptCurrentPortfolioName?.()||"My Portfolio"); window.ptActivePortfolioName=portfolioName;
 try{await ptLoadPortfolioAnalysis(p)}catch(_){}
 try{await ptLoadPortfolioCompanyEvidence(p)}catch(_){}
 try{ptLoadPortfolioETFEvidence(p).catch(()=>{})}catch(_){}
 const rows=p.map(x=>({t:String(x.ticker||'').toUpperCase(),w:Number(x.weight||0),role:ptReportRole(String(x.ticker||'').toUpperCase())}));
 const total=rows.reduce((a,x)=>a+x.w,0), intl=rows.filter(x=>['VXUS','AVDV'].includes(x.t)).reduce((a,x)=>a+x.w,0);
 const core=rows.filter(x=>x.role==='Core').reduce((a,x)=>a+x.w,0), tilt=rows.filter(x=>x.role==='Tilt').reduce((a,x)=>a+x.w,0);
 const smallValue=rows.filter(x=>['AVUV','AVDV'].includes(x.t)).reduce((a,x)=>a+x.w,0);
 const direct=rows.filter(x=>!['VTI','VOO','VXUS','AVUV','AVDV','QQQM','SCHD','BND','VNQ','GLD'].includes(x.t));
 const directW=direct.reduce((a,x)=>a+x.w,0);
 const lf=ptLookthroughFacts(), largest=lf.largest||null;
 const largestEff=largest&&Number.isFinite(Number(largest.effectiveWeight))?Number(largest.effectiveWeight):null;
 const overlaps=(lf.overlaps||[]).filter(x=>Number.isFinite(Number(x.weightedOverlapPct)));
 const lowOverlap=overlaps.length?[...overlaps].sort((a,b)=>Number(a.weightedOverlapPct)-Number(b.weightedOverlapPct))[0]:null;
 const highOverlap=overlaps.length?[...overlaps].sort((a,b)=>Number(b.weightedOverlapPct)-Number(a.weightedOverlapPct))[0]:null;
 const ce=Array.isArray(window.__ptLensCE)?window.__ptLensCE:[];
 const svNames=rows.filter(x=>['AVUV','AVDV'].includes(x.t)).map(x=>x.t).join(' + ');
 const intent=smallValue>0
  ? `Own a broad global equity base while deliberately shifting ${smallValue.toFixed(0)}% of the portfolio toward smaller value-oriented companies. The construction accepts tracking error against a pure market-cap portfolio in exchange for a meaningfully different source of exposure.`
  : intl>0 ? `Own a broad equity portfolio with ${intl.toFixed(0)}% explicitly allocated outside the U.S., reducing dependence on one country's earnings, sectors and valuation regime.`
  : `Own broad equity exposure with the portfolio's outcome driven primarily by the market-cap structure of its core holdings.`;
 const distinct=lowOverlap?`${E(lowOverlap.baseFund)} / ${E(lowOverlap.comparisonFund)} show only ${Number(lowOverlap.weightedOverlapPct).toFixed(1)}% weighted overlap despite ${Number(lowOverlap.sharedHoldingsCount||0).toLocaleString()} shared names.`:null;
 const concentration=largestEff!=null?`${E(String(largest.ticker||largest.name||'Largest company'))} is the largest measured underlying company exposure at ${largestEff.toFixed(1)}% of the portfolio.`:null;
 const roleText=t=>({VTI:'Broad U.S. market-cap foundation',VOO:'Large-cap U.S. foundation',VXUS:'Non-U.S. equity diversifier',AVUV:'U.S. small/value reweighting',AVDV:'Developed ex-U.S. small/value reweighting',QQQM:'Large-growth concentration tilt',SCHD:'Dividend/quality screen',BND:'Investment-grade bond ballast',VNQ:'Real-estate sleeve',GLD:'Gold diversifier'}[t]||'Direct security selection');
 const changeText=t=>({VTI:'Sets the U.S. market baseline; its largest companies receive the most influence.',VOO:'Concentrates the U.S. sleeve in large companies rather than the full market.',VXUS:'Changes geography, currencies, sectors and the valuation base outside the U.S.',AVUV:'Raises the weight of smaller, cheaper U.S. companies already underrepresented in a cap-weighted core.',AVDV:'Adds both non-U.S. geography and a small/value reweighting distinct from broad international exposure.',QQQM:'Raises dependence on a narrower set of large growth businesses.',SCHD:'Reweights toward dividend-screened mature cash generators.',BND:'Adds contractual income and reduces all-equity dependence.',VNQ:'Creates a dedicated real-estate exposure.',GLD:'Adds a non-earnings asset whose return driver differs from equities.'}[t]||'Creates a deliberate company-specific overweight that must be justified by company evidence.');
 const page=(body,n)=>`<section class="pti-page">${body}<div class="pti-foot">PORTFOLIO THESIS <b>${String(n).padStart(2,'0')}</b></div></section>`;
 let n=1, html='<div class="pti-report">';
 // PAGE 1 — intent and only the highest-value findings.
 const findings=[];
 if(concentration)findings.push(['Largest effective company',`${E(String(largest.ticker||largest.name||''))} ${largestEff.toFixed(1)}%`, 'Look-through exposure, not ETF ticker weight.']);
 if(distinct)findings.push(['Most distinct measured pairing',`${E(lowOverlap.baseFund)} / ${E(lowOverlap.comparisonFund)}`,`${Number(lowOverlap.weightedOverlapPct).toFixed(1)}% weighted overlap across ${Number(lowOverlap.sharedHoldingsCount||0).toLocaleString()} shared holdings.`]);
 if(smallValue>0)findings.push(['Deliberate factor departure',`${smallValue.toFixed(0)}% small/value`,`${svNames} make the portfolio materially different from a pure market-cap allocation.`]);
 if(intl>0)findings.push(['Explicit non-U.S. sleeve',`${intl.toFixed(0)}% international`,'The portfolio is not dependent on U.S. companies alone.']);
 html+=page(`<div class="pti-k">PORTFOLIO THESIS REPORT</div><h1>${E(portfolioName)}</h1><p class="pti-lead">${E(intent)}</p><div class="pti-jobbar">${rows.map(x=>`<div style="flex:${Math.max(x.w,5)}"><b>${E(x.t)}</b><small>${x.w.toFixed(0)}%</small></div>`).join('')}</div><div class="pt149-grid">${findings.slice(0,4).map(f=>`<div class="pt149-find"><small>${f[0]}</small><b>${f[1]}</b><p>${f[2]}</p></div>`).join('')}</div><div class="pti-bottom"><small>REPORT QUESTION</small><p>What portfolio did these securities actually create, and what evidence would make its thesis stronger or weaker?</p></div>`,n++);
 // PAGE 2 — securities as structure, not repeated essays.
 html+=page(`<div class="pti-k">PORTFOLIO X-RAY</div><h2>What the securities actually change.</h2><p class="pti-lead">Ticker count is not diversification. Each holding is shown once, only for the structural change it makes to the combined portfolio.</p><table class="pt149-table"><thead><tr><th>Holding</th><th>Weight</th><th>Role</th><th>Structural effect</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${E(x.t)}</td><td>${x.w.toFixed(0)}%</td><td>${E(roleText(x.t))}</td><td>${E(changeText(x.t))}</td></tr>`).join('')}</tbody></table>${concentration?`<div class="pt149-find"><small>LOOK-THROUGH FINDING</small><b>${concentration}</b><p>The largest ETF weight is not the same thing as the largest company exposure. This figure measures the company after looking through available fund holdings.</p></div>`:''}${highOverlap?`<div class="pt149-find"><small>OVERLAP FINDING</small><b>${E(highOverlap.baseFund)} / ${E(highOverlap.comparisonFund)}: ${Number(highOverlap.weightedOverlapPct).toFixed(1)}%</b><p>${Number(highOverlap.sharedHoldingsCount||0).toLocaleString()} shared holdings. Weighted overlap measures how much of the funds' actual position weights duplicate one another.</p></div>`:''}`,n++);
 // PAGE 3 — six lenses, compact and non-redundant.
 const valuationStrong=ce.length?ce.map(x=>`${E(x.t)} ${x.e.score??'—'}/100${x.e.price>0&&x.e.normalized>0?` · $${Number(x.e.price).toFixed(2)} market vs $${Number(x.e.normalized).toFixed(2)} normalized`:''}`).join(' | '):null;
 const thesisTest=[];
 if(core>0)thesisTest.push(`the ${core.toFixed(0)}% core must remain the intended broad foundation`);
 if(intl>0)thesisTest.push(`the ${intl.toFixed(0)}% non-U.S. sleeve must remain economically distinct`);
 if(smallValue>0)thesisTest.push(`the ${smallValue.toFixed(0)}% small/value sleeve must continue to create a genuine factor reweighting`);
 if(directW>0)thesisTest.push(`the ${directW.toFixed(0)}% direct-company sleeve must continue to earn its overweight through company evidence`);
 const lens=(num,name,head,body)=>`<div class="pt149-lens"><span class="n">${num}</span><h4>${name}</h4><strong>${head}</strong><p>${body}</p></div>`;
