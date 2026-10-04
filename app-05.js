  if(type.includes("portfolio")){
    const live=document.getElementById("ptGeneratedReport");
    if(!live)return;
    const tmp=document.createElement("div");
    tmp.innerHTML=r.html||"";
    const saved=tmp.querySelector("#ptGeneratedReport");
    live.innerHTML=saved?saved.innerHTML:(r.html||"");
    if(!live.querySelector(".pt-report-sitehead")){live.insertAdjacentHTML("afterbegin",`<div class="pt-report-sitehead" data-pt-v208-nav="1"><div class="pt-report-headinner"><button class="pt-report-logo" onclick="ptReportGoHome()"><b>Portfolio Thesis</b><span>Global Ownership. Disciplined Balance.</span></button><div class="pt-report-navactions"><button class="pt-report-librarybtn" onclick="ptV207GoLibrary()">Library</button><button class="pt-report-homebtn" onclick="ptReportGoHome()">Home</button></div></div></div>`);}else if(!live.querySelector(".pt-report-librarybtn")){const head=live.querySelector(".pt-report-headinner");const home=live.querySelector(".pt-report-homebtn");if(head&&home){let actions=live.querySelector(".pt-report-navactions");if(!actions){actions=document.createElement("div");actions.className="pt-report-navactions";home.before(actions);actions.appendChild(home);}const lib=document.createElement("button");lib.className="pt-report-librarybtn";lib.textContent="Library";lib.onclick=()=>window.ptV207GoLibrary();actions.insertBefore(lib,home);}}
    ptNormalizeReportChrome(live);
    live.classList.add("active");
    document.body.classList.add("pt-report-open");
    live.scrollTop=0;
    window.scrollTo(0,0);
    return;
  }

  // Compatibility path for other saved report types. Force the restored
  // report root visible even if its saved markup originally had display:none.
  document.querySelectorAll("main section, body>section").forEach(x=>x.style.display="none");
  let host=document.getElementById("ptSavedReportHost");
  if(!host){
    host=document.createElement("div");
    host.id="ptSavedReportHost";
    document.body.appendChild(host);
  }
  host.innerHTML=r.html||"";
  host.style.display="block";
  const root=host.firstElementChild;
  if(root){root.style.display="block";root.classList.add("active");}
  window.scrollTo(0,0);
}
function ptDeleteSavedReport(i){const a=ptLibraryLocal("pt_saved_reports");a.splice(i,1);ptLibrarySet("pt_saved_reports",a);ptRefreshLibrary()}
function ptAddWatch(){
  const inp=document.getElementById("ptWatchTicker");
  const msg=document.getElementById("ptWatchMessage");
  const ticker=(inp?.value||"").trim().toUpperCase().replace(/[^A-Z0-9.\-]/g,"");
  if(!ticker){if(msg)msg.textContent="Enter a ticker first.";return}
  const a=ptLibraryLocal("pt_watchlist");
  if(a.some(w=>String(w.ticker||w).toUpperCase()===ticker)){
    if(msg)msg.textContent=ticker+" is already on your watchlist.";return;
  }
  const fundTickers=new Set(["VTI","VOO","VXUS","AVUV","AVDV","QQQM","SCHD","BND","VNQ","GLD"]);
  a.unshift({ticker,type:fundTickers.has(ticker)?"fund":"company",addedAt:new Date().toISOString()});
  ptLibrarySet("pt_watchlist",a);
  inp.value="";
  if(msg)msg.textContent=ticker+" added to your watchlist.";
  ptRefreshLibrary();
}
function ptRemoveWatch(i){const a=ptLibraryLocal("pt_watchlist");a.splice(i,1);ptLibrarySet("pt_watchlist",a);ptRefreshLibrary()}
async function ptAnalyzeWatch(t){
  t=String(t||"").trim().toUpperCase();
  if(!t)return;
  if(PT_ETFS.has(t)) return ptResearchWatch(t);
  const msg=document.getElementById("ptWatchMessage");
  const card=[...document.querySelectorAll("#ptLibraryWatchlist .pt-library-card")].find(c=>c.querySelector("b")?.textContent.trim().toUpperCase()===t);
  const btn=card?.querySelector("button"), oldLabel=btn?.textContent||"Analyze";
  if(btn){btn.disabled=true;btn.textContent="Analyzing…";}
  if(msg)msg.textContent="Building a fresh "+t+" Deep Value Report…";
  try{
    await openDeepValue(t);
    const report=document.getElementById("ptDVGeneratedReport");
    if(!report)throw new Error("Generated report container is unavailable.");
    if(typeof ptAutoSaveDeepValueReport==="function")ptAutoSaveDeepValueReport();
    if(msg)msg.textContent="";
  }catch(e){
    if(msg)msg.textContent="Could not analyze "+t+": "+(e?.message||e);
  }finally{
    if(btn){btn.disabled=false;btn.textContent=oldLabel;}
  }
}
function ptResearchWatch(t){
  t=String(t||"").trim().toUpperCase();
  if(!t)return;
  const fundTickers=new Set(["VTI","VOO","VXUS","AVUV","AVDV","QQQM","SCHD","BND","VNQ","GLD"]);
  const isFund=fundTickers.has(t) || (typeof RESEARCH_PROFILES!=="undefined" && RESEARCH_PROFILES[t]?.type==="ETF");

  if(isFund){
    // ETF/fund: create/open the finished research profile and save it to Saved Research.
    ptOpenFundResearchReport(t);
    return;
  }

  // Company: go straight through the existing Deep Value engine.
  // The publication report is the destination; the workspace is only infrastructure.
  return ptAnalyzeWatch(t);
}
document.addEventListener("keydown",e=>{
  if(e.key==="Enter" && e.target && e.target.id==="ptWatchTicker"){e.preventDefault();ptAddWatch()}
});
document.addEventListener("click",e=>{
  // Add Save Report button once to any visible generated Deep Value report.
  const r=document.getElementById("ptDVGeneratedReport");
  if(r && r.style.display!=="none" && !r.querySelector(".pt-save-report-btn")){
    const b=document.createElement("button");b.className="btn pt-save-report-btn";b.textContent="Save to My Library";b.onclick=ptSaveCurrentReport;
    r.insertBefore(b,r.firstChild);
  }
});


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  const KEY='pt_saved_research';

  window.ptGetSavedResearch=function(){
    try{return JSON.parse(localStorage.getItem(KEY)||'[]')||[];}catch(e){return [];}
  };
  window.ptSaveResearch=function(item){
    if(!item)return;
    const ticker=String(item.ticker||item.symbol||'').trim().toUpperCase();
    if(!ticker)return;
    const rows=window.ptGetSavedResearch();
    const record={
      ticker,
      name:item.name||ticker,
      savedAt:new Date().toISOString()
    };
    const next=[record,...rows.filter(x=>String(x.ticker||'').toUpperCase()!==ticker)];
    localStorage.setItem(KEY,JSON.stringify(next));
    window.ptRenderSavedResearch();
  };
  window.ptRemoveSavedResearch=function(ticker){
    const next=window.ptGetSavedResearch().filter(x=>String(x.ticker||'').toUpperCase()!==String(ticker||'').toUpperCase());
    localStorage.setItem(KEY,JSON.stringify(next));
    window.ptRenderSavedResearch();
  };
  window.ptRenderSavedResearch=function(){
    const el=document.getElementById('ptSavedResearchList');
    if(!el)return;
    const rows=window.ptGetSavedResearch();
    if(!rows.length){
      el.innerHTML='<div class="pt-library-empty">ETF and fund research you save will appear here.</div>';
      return;
    }
    el.innerHTML=rows.map(x=>`
      <div class="pt-library-card pt190-research-card">
        <div class="pt190-research-head"><b>${x.ticker}</b><p>${x.name||"ETF / Fund research"}</p></div>
        <div id="pt180ResearchPerf_${x.ticker}" class="pt180-perf-host pt190-research-perf"></div>
        <div class="pt-library-actions pt190-research-actions">
          <button class="btn primary" onclick="ptOpenSavedResearch('${x.ticker}')">Open Research</button>
          <button class="btn" onclick="ptRemoveSavedResearch('${x.ticker}')">Remove</button>
        </div>
      </div>`).join('');
    setTimeout(()=>window.pt180LoadResearchReturns?.(rows),0);
  };
  window.ptOpenSavedResearch=function(ticker){
    ticker=String(ticker||"").toUpperCase();
    const rec=window.ptGetSavedResearch().find(x=>String(x.ticker||"").toUpperCase()===ticker);
    if(rec?.html){
      let host=document.getElementById("ptSavedReportHost");
      if(!host){host=document.createElement("div");host.id="ptSavedReportHost";document.body.appendChild(host);}
      [...document.body.children].forEach(el=>{if(el!==host&&el.tagName!=="SCRIPT"){el.dataset.ptSavedDisplay=el.style.display;el.style.display="none";}});
      host.innerHTML=rec.html;host.style.display="block";window.scrollTo(0,0);
      return;
    }
    ptOpenFundResearchReport(ticker);
  };

  document.addEventListener('DOMContentLoaded',()=>window.ptRenderSavedResearch());
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  const target=document.getElementById("ptDVGeneratedReport");
  if(!target)return;
  let timer=null;
  const obs=new MutationObserver(()=>{
    clearTimeout(timer);
    timer=setTimeout(()=>{
      if(target.style.display!=="none" && target.textContent.trim().length>100){
        ptAutoSaveDeepValueReport();
      }
    },300);
  });
  obs.observe(target,{subtree:true,childList:true,attributes:true,attributeFilter:["style","class"]});
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


document.addEventListener("DOMContentLoaded",()=>{
  const el=document.getElementById("ptPortfolioName");
  const saved=localStorage.getItem("pt_working_portfolio_name");
  if(el&&saved)el.value=saved;
  window.ptActivePortfolioName=el?.value||saved||"My Portfolio";
});


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


function ptNormalizeReportChrome(root=document){
  root.querySelectorAll('.ptr-toolbar,.ptdv-toolbar').forEach(tb=>{
    [...tb.children].forEach(el=>{if(!el.classList.contains('ptr-back'))el.remove();});
    const b=tb.querySelector('.ptr-back'); if(b)b.textContent='← Back';
  });
}
document.addEventListener('DOMContentLoaded',()=>ptNormalizeReportChrome());


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


/* V122 — owner/admin research interface. Not linked into subscriber Library. */
let ptUniverseRows=[];
async function ptLoadResearchUniverse(){
 const host=document.getElementById("ptResearchUniverseList");
 if(!host)return;
 host.innerHTML='<div class="pt-admin-empty">Loading Portfolio Thesis research memory…</div>';
 if(!window.ptSupabase?.functions?.invoke){host.innerHTML='<div class="pt-admin-empty">Research backend is not connected in this build.</div>';return}
 try{
  const {data,error}=await window.ptSupabase.functions.invoke("research-universe",{body:{action:"list"}});
  if(error)throw error;
  ptUniverseRows=data?.securities||[];
  ptRenderResearchUniverse();
 }catch(e){host.innerHTML='<div class="pt-admin-empty">Research Universe could not be loaded. Deploy the V122 research-universe backend update first.</div>'}
}
function ptRenderResearchUniverse(){
 const q=(document.getElementById("ptUniverseSearch")?.value||"").toLowerCase();
 const status=document.getElementById("ptUniverseStatus")?.value||"all";
 const rows=ptUniverseRows.filter(x=>(!q||`${x.symbol} ${x.company_name||""} ${x.sector||""}`.toLowerCase().includes(q))&&(status==="all"||x.status===status));
 const host=document.getElementById("ptResearchUniverseList");
 const stocks=ptUniverseRows.filter(x=>x.security_type==="stock").length, funds=ptUniverseRows.length-stocks;
 document.getElementById("ptUniverseCount").textContent=ptUniverseRows.length;
 document.getElementById("ptUniverseStocks").textContent=stocks;
 document.getElementById("ptUniverseFunds").textContent=funds;
 document.getElementById("ptUniverseSnapshots").textContent=ptUniverseRows.reduce((a,x)=>a+Number(x.snapshot_count||0),0);
 if(!rows.length){host.innerHTML='<div class="pt-admin-empty">No securities match this view yet. Successful ETF and Deep Value research will begin filling it automatically.</div>';return}
 host.innerHTML='<div class="pt-universe-row head"><div>Security</div><div>Status</div><div>Evidence</div><div>Price</div><div>Value / Fund data</div><div>Last researched</div><div></div></div>'+rows.map(x=>`<div class="pt-universe-row">
  <div class="pt-universe-symbol"><b>${ptEsc(x.symbol)}</b><small>${ptEsc(x.company_name||x.security_type||"Security")}</small></div>
  <div><span class="pt-admin-pill">${ptEsc((x.status||"discovered").replaceAll("_"," "))}</span></div>
  <div>${String(x.security_type||"").toLowerCase()==="etf"?`Fund evidence${Number(x.snapshot_count||0)>0?`<small style="display:block">${Number(x.snapshot_count)} snapshot${Number(x.snapshot_count)===1?"":"s"}</small>`:""}`:(x.latest_evidence_score!=null?`${Number(x.latest_evidence_score).toFixed(0)}/100${x.latest_completeness!=null?`<small style="display:block">${Number(x.latest_completeness).toFixed(0)}% complete</small>`:""}`:"—")}</div>
  <div>${String(x.security_type||"").toLowerCase()==="etf"?"—":(x.latest_price!=null?`$${Number(x.latest_price).toFixed(2)}`:"—")}</div>
  <div>${String(x.security_type||"").toLowerCase()==="etf"?`ETF record`:(x.latest_normalized_value!=null?`$${Number(x.latest_normalized_value).toFixed(2)}`:"—")}</div>
  <div>${x.last_researched_at?new Date(x.last_researched_at).toLocaleDateString():"—"}</div>
  <button class="pt-admin-btn" onclick="ptOpenResearchRecord('${ptEsc(x.symbol)}')">Open record</button>
 </div>`).join("");
}
async function ptOpenResearchRecord(symbol){
 const host=document.getElementById("ptResearchRecord");
 host.innerHTML='<div class="pt-admin-empty">Loading research history…</div>';host.scrollIntoView({behavior:"smooth"});
 const data=await ptUniverseCandidate(symbol);
 if(!data?.security){host.innerHTML='<div class="pt-admin-empty">No research record available.</div>';return}
 const x=data.security,h=data.history||[];
 const isETF=String(x.security_type||"").toLowerCase()==="etf"||ptETFIsEvidenceFund(x.symbol);
 if(isETF){
   const latest=h[0]||null;
   const payload=latest?.payload?.evidence||latest?.payload||{};
   const perf=payload.performance||{}, trend=payload.trend||{}, fund=payload.fundamentals||{};
   const fmtPct=v=>Number.isFinite(Number(v))?Number(v).toFixed(1)+"%":"—";
   const fmtNum=v=>Number.isFinite(Number(v))?Number(v).toFixed(2):"—";
   const dated=ptETFEvidenceHasMarketData(payload);
   const asOf=payload.asOf||latest?.as_of||latest?.observed_at||null;
   const signals=Array.isArray(payload.signals)?payload.signals:[];
   host.innerHTML=`<div class="pt-research-record">
    <div class="pt-admin-eyebrow">Fund research record</div>
    <div class="pt-admin-title" style="font-size:28px">${ptEsc(x.symbol)}${x.company_name?` · ${ptEsc(x.company_name)}`:""}</div>
    <div class="pt-admin-sub">ETF · First seen ${x.first_seen_at?new Date(x.first_seen_at).toLocaleDateString():"—"}${asOf?` · Evidence ${new Date(asOf).toLocaleDateString()}`:""}</div>
    <div class="pt-record-grid">
      <div class="pt-record-metric"><b>${dated?"DATED":"PENDING"}</b><span>Evidence status</span></div>
      <div class="pt-record-metric"><b>${fmtPct(perf.ytd)}</b><span>YTD return</span></div>
      <div class="pt-record-metric"><b>${fmtPct(perf.oneYear)}</b><span>1Y return</span></div>
      <div class="pt-record-metric"><b>${fmtPct(perf.threeYear)}</b><span>3Y annualized</span></div>
      <div class="pt-record-metric"><b>${fmtPct(perf.fiveYear)}</b><span>5Y annualized</span></div>
      ${trend.price!=null?`<div class="pt-record-metric"><b>$${fmtNum(trend.price)}</b><span>Reference price</span></div>`:""}
    </div>
    <div class="ptr-evidence-grid" style="margin-top:18px">
      <div class="ptr-evidence-card"><h4>Valuation evidence</h4><b>${fund.valuation!=null?ptEsc(String(fund.valuation)):"Not populated"}</b><p>No company-style normalized value or Margin of Safety is assigned to an ETF.</p></div>
      <div class="ptr-evidence-card"><h4>Earnings evidence</h4><b>${fund.earnings!=null?ptEsc(String(fund.earnings)):"Not populated"}</b><p>Stored at the fund/portfolio level when the provider supplies it.</p></div>
      <div class="ptr-evidence-card"><h4>Profitability evidence</h4><b>${fund.profitability!=null?ptEsc(String(fund.profitability)):"Not populated"}</b><p>Used as aggregate fund evidence, not a Deep Value company score.</p></div>
      <div class="ptr-evidence-card"><h4>Signals monitored</h4><b>${signals.length?signals.map(ptEsc).join(" · "):"No dated signals stored"}</b><p>${payload.evidenceQuestion?ptEsc(payload.evidenceQuestion):"The next snapshot should add only measured fund evidence."}</p></div>
    </div>
    <h3 style="font-family:Georgia,serif;color:#153c2e">Fund evidence history</h3>
    ${h.length?`<table class="pt-history"><thead><tr><th>Date</th><th>YTD</th><th>1Y</th><th>3Y</th><th>5Y</th><th>Status</th></tr></thead><tbody>${h.map(r=>{const e=r?.payload?.evidence||r?.payload||{},p=e.performance||{};return `<tr><td>${new Date(r.observed_at).toLocaleDateString()}</td><td>${fmtPct(p.ytd)}</td><td>${fmtPct(p.oneYear)}</td><td>${fmtPct(p.threeYear)}</td><td>${fmtPct(p.fiveYear)}</td><td>${ptETFEvidenceHasMarketData(e)?"Dated":"Pending"}</td></tr>`}).join("")}</tbody></table>`:'<div class="pt-admin-empty">No historical fund snapshots yet.</div>'}
   </div>`;
   return;
 }
 const prev=h[1],latest=h[0];
 const scoreDelta=latest?.evidence_score!=null&&prev?.evidence_score!=null?Number(latest.evidence_score)-Number(prev.evidence_score):null;
 host.innerHTML=`<div class="pt-research-record">
  <div class="pt-admin-eyebrow">Research record</div><div class="pt-admin-title" style="font-size:28px">${ptEsc(x.symbol)}${x.company_name?` · ${ptEsc(x.company_name)}`:""}</div>
  <div class="pt-admin-sub">${ptEsc(x.sector||"")} ${x.industry?`· ${ptEsc(x.industry)}`:""} · First seen ${new Date(x.first_seen_at).toLocaleDateString()}</div>
  <div class="pt-record-grid">
   <div class="pt-record-metric"><b>${x.latest_evidence_score!=null?Number(x.latest_evidence_score).toFixed(0)+"/100":"—"}</b><span>Current evidence</span></div>
   <div class="pt-record-metric"><b>${scoreDelta==null?"—":`${scoreDelta>0?"+":""}${scoreDelta.toFixed(0)}`}</b><span>Score change</span></div>
   <div class="pt-record-metric"><b>${x.latest_price!=null?"$"+Number(x.latest_price).toFixed(2):"—"}</b><span>Last price</span></div>
   <div class="pt-record-metric"><b>${x.latest_normalized_value!=null?"$"+Number(x.latest_normalized_value).toFixed(2):"—"}</b><span>Normalized value</span></div>
   <div class="pt-record-metric"><b>${x.latest_margin_of_safety!=null?Number(x.latest_margin_of_safety).toFixed(1)+"%":"—"}</b><span>Margin of safety</span></div>
  </div>
  <h3 style="font-family:Georgia,serif;color:#153c2e">Research history</h3>
  ${h.length?`<table class="pt-history"><thead><tr><th>Date</th><th>Evidence</th><th>Complete</th><th>Price</th><th>Normalized</th><th>MOS</th></tr></thead><tbody>${h.map(r=>`<tr><td>${new Date(r.observed_at).toLocaleDateString()}</td><td>${r.evidence_score!=null?Number(r.evidence_score).toFixed(0)+"/100":"—"}</td><td>${r.completeness!=null?Number(r.completeness).toFixed(0)+"%":"—"}</td><td>${r.market_price!=null?"$"+Number(r.market_price).toFixed(2):"—"}</td><td>${r.normalized_value!=null?"$"+Number(r.normalized_value).toFixed(2):"—"}</td><td>${r.margin_of_safety!=null?Number(r.margin_of_safety).toFixed(1)+"%":"—"}</td></tr>`).join("")}</tbody></table>`:'<div class="pt-admin-empty">No historical snapshots yet.</div>'}
 </div>`;
}
function ptOpenResearchUniverseDashboard(){
  // Internal research is intentionally separate from the subscriber Library.
  const home=document.getElementById("reportHome");
  if(home) home.style.display="none";
  document.querySelectorAll("main section").forEach(x=>x.style.display="none");
  ["builder","analysisResults","sixLenses","lensLearning","research","deepvalue","academy","issues","library","join","ptGeneratedReport","ptDVGeneratedReport","ptResearchGeneratedReport","ptSavedReportHost"]
    .forEach(id=>{const el=document.getElementById(id);if(el){el.classList.remove("active");el.style.display="none";}});
  document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
  const p=document.getElementById("researchUniverse");
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
   const findings=[];if(us)findings.push(['Measured U.S. exposure',pct(us.value,1),`International exposure is approximately ${pct(intl,1)} from measured underlying holdings.`]);if(largestName&&largestW!=null)findings.push(['Largest underlying company',`${E(largestName)} · ${pct(largestW,2)}`,'Effective weight after looking through available fund holdings.']);if(top10!=null)findings.push(['Top 10 effective companies',pct(top10,1),'Combined weight of the ten largest measured underlying companies.']);if(ov)findings.push(['Largest measured overlap',`${E(ov.baseFund||ov.fundA)} / ${E(ov.comparisonFund||ov.fundB)} · ${pct(ov.weightedOverlapPct,1)}`,`${Number(ov.sharedHoldingsCount||ov.sharedCount||0).toLocaleString()} shared holdings.`]);
   let n=1,h='<div class="pt150-report">';
   h+=page(`<div class="pt150-k">PORTFOLIO THESIS REPORT</div><h1>${E(name)}</h1><p class="pt150-deck">A research view of what this portfolio actually owns, what has driven its results, and which current conditions matter most to its thesis.</p><div class="pt150-alloc">${p.map(x=>`<div style="width:${x.weight}%">${E(x.ticker)}</div>`).join('')}</div><div class="pt150-legend">${p.map(x=>`<span><b>${E(x.ticker)}</b> ${pct(x.weight,0)}</span>`).join('')}</div><div class="pt150-metrics"><div class="pt150-metric"><small>1 month</small><b>${sg(p1)}</b><em>portfolio estimate</em></div><div class="pt150-metric"><small>YTD</small><b>${sg(py)}</b><em>portfolio estimate</em></div><div class="pt150-metric"><small>Largest company</small><b>${largestName?E(largestName):'—'}</b><em>${pct(largestW,2)}</em></div><div class="pt150-metric"><small>Top 10 companies</small><b>${pct(top10,1)}</b><em>effective exposure</em></div></div><div class="pt150-findings">${findings.slice(0,4).map(f=>`<div class="pt150-finding"><small>${f[0]}</small><b>${f[1]}</b><p>${f[2]}</p></div>`).join('')}</div>`,n++);
   h+=page(`<div class="pt150-k">WHAT YOU ACTUALLY OWN</div><h2>Exposure beneath the tickers.</h2><div class="pt150-grid2"><div class="pt150-chart"><h3>Largest effective companies</h3>${bars(eff,10)}</div><div><div class="pt150-chart"><h3>Geographic exposure</h3>${bars(geo,8)}</div><div class="pt150-chart" style="margin-top:24px"><h3>Sector exposure</h3>${bars(sectors,8)}</div></div></div>${ov?`<div class="pt150-callout"><b>${E(ov.baseFund||ov.fundA)} / ${E(ov.comparisonFund||ov.fundB)} overlap: ${pct(ov.weightedOverlapPct,2)}</b><p>${Number(ov.sharedHoldingsCount||ov.sharedCount||0).toLocaleString()} shared holdings, weighted by actual constituent positions.</p></div>`:''}`,n++);
   h+=page(`<div class="pt150-k">PERFORMANCE & DRIVERS</div><h2>What moved the portfolio.</h2><table class="pt150-table"><thead><tr><th>Holding</th><th>Weight</th><th>1M</th><th>3M</th><th>YTD</th><th>1Y</th><th>1M contrib.</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${E(r.t)}</b></td><td>${pct(r.w,0)}</td><td>${sg(r.m1)}</td><td>${sg(r.m3)}</td><td>${sg(r.ytd)}</td><td>${sg(r.y1)}</td><td>${r.c==null?'—':`${r.c>=0?'+':''}${r.c.toFixed(2)} pts`}</td></tr>`).join('')}<tr class="total"><td>Portfolio</td><td>100%</td><td>${sg(p1)}</td><td>${sg(p3)}</td><td>${sg(py)}</td><td>—</td><td>${p1==null?'—':`${p1>=0?'+':''}${p1.toFixed(2)} pts`}</td></tr></tbody></table><p class="pt150-note">Portfolio returns are static-current-weight estimates from available adjusted-price history, not realized account returns.</p>`,n++);
