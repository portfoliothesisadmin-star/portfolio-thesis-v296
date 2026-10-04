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
