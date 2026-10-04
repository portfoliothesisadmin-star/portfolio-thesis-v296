 <article class="ptdv-page"><div class="ptdv-kicker">EVIDENCE DASHBOARD</div><h2 class="ptr-section-title">Quality, cash generation and valuation.</h2><div class="ptdv-grid"><div class="ptdv-metric"><span>Price</span><b>${esc(price)}</b></div><div class="ptdv-metric"><span>Market cap</span><b>${esc(marketCap)}</b></div><div class="ptdv-metric"><span>Free cash flow</span><b>${val("free cash flow")}</b></div><div class="ptdv-metric"><span>FCF yield</span><b>${val("fcf yield")}</b></div><div class="ptdv-metric"><span>Operating income</span><b>${val("operating income")}</b></div><div class="ptdv-metric"><span>Net income</span><b>${val("net income")}</b></div></div><div class="ptdv-bars">${catData.map(([n,v])=>`<div class="ptdv-bar"><b>${esc(n)}</b><div class="ptdv-track"><div class="ptdv-fill" style="width:${v==null?0:v*5}%"></div></div><span>${v==null?"—":v+"/20"}</span></div>`).join("")}</div><div class="ptdv-callout"><b>${score??"—"}/100 evidence score</b><br><small>${esc(completenessText||"Missing evidence remains unscored.")} Margin of Safety remains separate from this score.</small></div><div class="ptdv-num">02</div></article>
 <article class="ptdv-page"><div class="ptdv-kicker">MARGIN OF SAFETY</div><h2 class="ptr-section-title">What is the business worth under different assumptions?</h2><p class="ptdv-scenario-intro">Three valuation scenarios show how different growth and required-return assumptions change the estimated value. They are sensitivity cases—not price targets.</p>
 <div class="ptdv-marketstrip"><span>Current market price</span><b>${esc(price)}</b></div>
 <div class="ptdv-primarymos"><div><span>PRIMARY MARGIN OF SAFETY</span><b data-ptdv-primary-mos>—</b></div><p>Based on the <b>Normalized Scenario</b>: <span data-ptdv-market-price>${esc(price)}</span> market price vs. <b data-ptdv-base-value>—</b> normalized estimated value.</p></div>
 <div class="ptdv-cases-clear">
  <div class="ptdv-scenario"><div class="tag">Cautious</div><div class="label">Estimated value</div><div class="value">${esc(caseVal("conservative"))}</div><div class="assume">Slower cash-flow growth</div><div class="mos" data-ptdv-mos="cautious">Comparison to market</div></div>
  <div class="ptdv-scenario primary"><div class="tag">Normalized</div><div class="ptdv-primary-label">PRIMARY REFERENCE</div><div class="label">Estimated value</div><div class="value">${esc(caseVal("base"))}</div><div class="assume">Normalized cash-flow growth</div><div class="mos" data-ptdv-mos="base">Comparison to market</div></div>
  <div class="ptdv-scenario"><div class="tag">Strong Growth</div><div class="label">Estimated value</div><div class="value">${esc(caseVal("favorable"))}</div><div class="assume">Stronger cash-flow growth</div><div class="mos" data-ptdv-mos="strong">Comparison to market</div></div>
 </div>
 <div class="ptdv-howread"><b>How to read this:</b> The <b>Normalized</b> case is the primary reference. Cautious and Strong Growth show how estimated value changes if cash-flow growth develops weaker or stronger than the normalized case.</div>
 <div class="ptdv-lower-three"><div class="ptdv-box"><h4>Market-implied growth</h4><p><b style="font-size:21px">${esc(implied)}</b></p><p>Annualized FCF growth required under the base DCF assumptions. This is not the Margin of Safety.</p></div><div class="ptdv-box"><h4>Earnings-power cross-check</h4><p><b style="font-size:21px">${esc(ep)}</b></p><p>Separate normalized earnings reference used to cross-check the cash-flow valuation.</p></div><div class="ptdv-box"><h4>Method agreement</h4><p><b style="font-size:21px">${esc(agree)}</b></p><p class="ptdv-method-divergence">Method divergence: <b>${esc(divergence)}</b></p><p>Agreement is not a quality or return forecast.</p></div></div><div class="ptdv-num">03</div></article>
 <article class="ptdv-page"><div class="ptdv-kicker">RESEARCH SYNTHESIS</div><h2 class="ptr-section-title">What the evidence says to review.</h2><div class="ptdv-two"><div class="ptdv-box"><h4>Business evidence</h4><div>${catData.slice(0,4).map(([n,v])=>`<div class="ptdv-evidence-line"><b>${esc(n)}</b><span>${v==null?"Incomplete":v+"/20"}</span></div>`).join("")}</div></div><div class="ptdv-box"><h4>Valuation evidence</h4><div><div class="ptdv-evidence-line"><b>Valuation</b><span>${catData[4][1]==null?"Incomplete":catData[4][1]+"/20"}</span></div><div class="ptdv-evidence-line"><b>Normalized DCF</b><span>${esc(caseVal("base"))}</span></div><div class="ptdv-evidence-line"><b>Earnings power</b><span>${esc(ep)}</span></div><div class="ptdv-evidence-line"><b>Implied growth</b><span>${esc(implied)}</span></div></div></div></div><div class="ptdv-callout"><b>Research discipline</b><br><small>Separate business quality from price. Revisit the thesis when financial evidence, normalized earning power, capital structure or valuation assumptions materially change—not because the share price moved by itself.</small></div><p class="ptr-small">Portfolio Thesis is educational research, not individualized investment, tax or legal advice.</p><div class="ptdv-num">04</div></article>`;


 // Make scenario comparisons explicit. Standard MOS = (estimated value - market price) / estimated value.
 const parseMoney=(x)=>{const n=Number(String(x||"").replace(/[^0-9.-]/g,""));return Number.isFinite(n)?n:null};
 const directMarket=window.ptDVValuation?.marketPrice;
 const px=(directMarket!=null&&Number.isFinite(Number(directMarket)))?Number(directMarket):parseMoney(price);
 const baseEst=parseMoney(caseVal("base"));
 const primaryMos=(px!=null&&baseEst!=null&&baseEst!==0)?((baseEst-px)/baseEst*100):null;
 const primaryEl=document.querySelector("[data-ptdv-primary-mos]");
 const baseValueEl=document.querySelector("[data-ptdv-base-value]");
 if(primaryEl) primaryEl.textContent=primaryMos==null?"—":(primaryMos>=0?primaryMos.toFixed(1)+"%":Math.abs(primaryMos).toFixed(1)+"% above value");
 if(baseValueEl) baseValueEl.textContent=baseEst==null?"—":"$"+baseEst.toFixed(2);
 [["cautious",caseVal("conservative")],["base",caseVal("base")],["strong",caseVal("favorable")]].forEach(([key,v])=>{
   const el=document.querySelector(`[data-ptdv-mos="${key}"]`), est=parseMoney(v);
   if(!el||px==null||est==null||est===0)return;
   const pct=(est-px)/est*100;
   el.textContent=pct>=0?`${pct.toFixed(1)}% margin of safety`:`${Math.abs(pct).toFixed(1)}% above estimated value`;
 });
 document.getElementById("ptDVGeneratedReport").classList.add("active");
 setTimeout(ptAutoSaveDeepValueReport,0);
 [...document.body.children].forEach(el=>{if(el.id!=="ptDVGeneratedReport"&&el.tagName!=="SCRIPT"){el.dataset.ptDvDisplay=el.style.display;el.style.display="none"}});
 window.scrollTo(0,0);
};


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


function ptHideReportHome(){const h=document.getElementById("reportHome");if(h)h.style.display="none"}
function ptOpenExistingSection(id){
  ptHideReportHome();
  if(typeof showSection==="function"){
    try{ showSection(id); }catch(e){}
  }
  const target=document.getElementById(id);
  if(target){
    target.style.display="";
    target.scrollIntoView({behavior:"smooth",block:"start"});
  }
}
function ptGoPortfolio(){ptOpenExistingSection("builder")}
function ptGoCompany(){ptOpenExistingSection("deepvalue")}
function ptGoLearn(){
  ptOpenExistingSection("academy");
  const academy=document.getElementById("academy");
  if(academy){
    academy.scrollIntoView({behavior:"auto",block:"start"});
    requestAnimationFrame(()=>academy.scrollIntoView({behavior:"auto",block:"start"}));
    setTimeout(()=>academy.scrollIntoView({behavior:"auto",block:"start"}),80);
  }
}
function ptGoAccount(){
  ptOpenLibrary();
}
document.addEventListener("DOMContentLoaded",()=>{
  // Initial load should match the Home state: only the four starter choices.
  if(typeof ptReturnHome==="function") ptReturnHome();
  else {
    document.querySelectorAll("main section").forEach(x=>x.style.display="none");
    ["builder","analysisResults","sixLenses","lensLearning","research","deepvalue","academy","issues","library","join","ptDVGeneratedReport"]
      .forEach(id=>{const x=document.getElementById(id);if(x)x.style.display="none"});
    const h=document.getElementById("reportHome");
    if(h) h.style.display="block";
  }
});


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


function ptReturnHome(){
  const h=document.getElementById("reportHome");
  document.querySelectorAll("main section").forEach(x=>x.style.display="none");
  ["builder","analysisResults","sixLenses","lensLearning","research","deepvalue","academy","issues","library","join","ptDVGeneratedReport","researchUniverse"]
    .forEach(id=>{const x=document.getElementById(id);if(x){x.style.display="none";x.classList.remove("active")}});
  if(h){h.style.display="block";window.scrollTo({top:0,behavior:"smooth"})}
}
document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll("header a, header button, .brand, .logo").forEach(el=>{
    const t=(el.textContent||"").trim().toLowerCase();
    if(t.includes("portfolio thesis") || el.classList.contains("brand") || el.classList.contains("logo")){
      el.style.cursor="pointer";
      el.addEventListener("click",e=>{e.preventDefault();ptReturnHome()});
    }
  });
});


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


function ptLibEsc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function ptLibraryLocal(key){try{return JSON.parse(localStorage.getItem(key)||"[]")}catch(e){return []}}
function ptLibrarySet(key,v){localStorage.setItem(key,JSON.stringify(v))}
function pt228ShowLibraryTab(name){
  const map={portfolios:"pt228TabPortfolios",companies:"pt228TabCompanies",funds:"pt228TabFunds",watchlist:"pt228TabWatchlist"};
  document.querySelectorAll(".pt228-tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));
  document.querySelectorAll(".pt228-tab-panel").forEach(p=>p.classList.toggle("active",p.id===map[name]));
  try{localStorage.setItem("pt_library_tab",name)}catch(e){}
}
window.pt228ShowLibraryTab=pt228ShowLibraryTab;

async function ptOpenLibrary(){
  ptHideReportHome();
  if(typeof showSection==="function"){try{showSection("library")}catch(e){}}
  const el=document.getElementById("library");
  if(el){el.style.display="block";el.scrollIntoView({block:"start"})}
  if(window.ptSupabase){
    try{
      const {data}=await window.ptSupabase.auth.getUser();
      window.ptUser=data?.user||window.ptUser||null;
    }catch(e){}
  }
  await ptRefreshLibrary();
  let savedTab="portfolios";try{savedTab=localStorage.getItem("pt_library_tab")||"portfolios"}catch(e){}
  pt228ShowLibraryTab(savedTab);
}
async function ptRefreshLibrary(){
  const status=document.getElementById("ptLibraryStatus");
  const portfolios=document.getElementById("ptLibraryPortfolios");
  const portfolioReports=document.getElementById("ptLibraryPortfolioReports");
  const deepValueReports=document.getElementById("ptLibraryDeepValueReports");
  const watch=document.getElementById("ptLibraryWatchlist");
  if(!portfolios||!portfolioReports||!deepValueReports||!watch)return;

  let portfolioRows=[];
  const u=window.ptUser;
  if(u && window.ptSupabase){
    status.textContent="Signed in as "+(u.email||"member");
    try{
      const r=await window.ptSupabase.from("member_portfolios").select("*").eq("user_id",u.id).order("updated_at",{ascending:false});
      if(!r.error && Array.isArray(r.data)) portfolioRows=r.data;
    }catch(e){}
  } else {
    status.textContent="Local library on this device. Sign in to sync supported member data.";
  }

  const rr=ptLibraryLocal("pt_saved_reports");
  const portfolioRR=rr.map((r,i)=>({r,i})).filter(x=>(x.r.type||"").toLowerCase().includes("portfolio"));
  const deepRR=rr.map((r,i)=>({r,i})).filter(x=>(x.r.type||"").toLowerCase().includes("deep"));
  const cleanPortfolioName=v=>String(v||"").replace(/\s*[—-]\s*Portfolio Thesis Report\s*$/i,"").trim().toLowerCase();

  if(portfolioRows.length){
    portfolios.innerHTML=portfolioRows.map((p,i)=>{
      const holdings=p.holdings||p.portfolio||p.data||[];
      const desc=Array.isArray(holdings)?holdings.map(x=>(x.ticker||x.symbol||"")+" "+(x.weight??x.allocation??"")+"%").join(" · "):"Saved member portfolio";
      const pname=String(p.name||"Portfolio");
      const matches=portfolioRR.filter(x=>cleanPortfolioName(x.r.portfolioName||x.r.title)===cleanPortfolioName(pname));
      const latest=matches[0]||null;
      const reportState=latest?`<div class="pt228-report-state"><b>Latest Portfolio Thesis Report</b><span>${ptLibEsc(latest.r.savedAt||"Saved report")}</span></div>`:`<div class="pt228-report-state"><b>No report generated yet</b><span>Generate the first research report for this portfolio.</span></div>`;
      const reportActions=latest?`<button class="btn" onclick="ptOpenSavedReport(${latest.i})">Open Report</button><button class="btn" onclick="ptV210OpenReview('${ptLibEsc(pname)}')">Review History</button>`:`<button class="btn primary" onclick="ptGeneratePortfolioReport(${i})">Generate Report</button>`;
      return `<div class="pt-library-card"><b>${ptLibEsc(pname)}</b><p>${ptLibEsc(desc||"Saved member portfolio")}</p><div id="pt180PortfolioPerf${i}" class="pt180-perf-host"></div>${reportState}<div class="pt-library-actions pt228-portfolio-actions"><button class="btn" onclick="ptLoadLibraryPortfolio(${i})">Edit Portfolio</button>${reportActions}<button class="btn" onclick="ptRenameLibraryPortfolio(${i})">Rename</button>${latest?`<button class="btn primary" onclick="ptGeneratePortfolioReport(${i})">Update Report</button>`:""}</div></div>`;
    }).join("");
    window.ptLibraryPortfolioRows=portfolioRows; setTimeout(()=>window.pt180LoadPortfolioReturns?.(portfolioRows),0);
  } else portfolios.innerHTML='<div class="pt-library-empty">No saved portfolios yet. Analyze a portfolio to create your first saved member portfolio.</div>';
  const portfolioReportCard=x=>{
    const title=x.r.title||x.r.ticker||"Saved Report";
    const portfolioName=String(x.r.portfolioName||title).replace(/\s*[—-]\s*Portfolio Thesis Report\s*$/i,"").trim();
    return `<div class="pt-library-card"><b>${ptLibEsc(title)}</b><p>${ptLibEsc(x.r.savedAt||"")}</p><div class="pt-library-actions pt211-report-actions"><button class="btn" onclick="ptOpenSavedReport(${x.i})">Open Report</button><button class="btn" onclick="ptV210OpenReview('${ptLibEsc(portfolioName)}')">Review History</button><button class="btn" onclick="ptDeleteSavedReport(${x.i})">Remove</button></div></div>`;
  };
  const reportCard=x=>`<div class="pt-library-card"><b>${ptLibEsc(x.r.title||x.r.ticker||"Saved Report")}</b><p>${ptLibEsc(x.r.savedAt||"")}</p><div class="pt-library-actions"><button class="btn" onclick="ptOpenSavedReport(${x.i})">Open Report</button><button class="btn" onclick="ptDeleteSavedReport(${x.i})">Remove</button></div></div>`;
  portfolioReports.innerHTML="";
  deepValueReports.innerHTML=deepRR.length?deepRR.map(reportCard).join(""):'<div class="pt-library-empty">No saved company research yet. Analyze and save a company to add one here.</div>';

  const ww=ptLibraryLocal("pt_watchlist");
  const fundTickers=new Set(["VTI","VOO","VXUS","AVUV","AVDV","QQQM","SCHD","BND","VNQ","GLD"]);
  watch.innerHTML=ww.length?ww.map((w,i)=>{
