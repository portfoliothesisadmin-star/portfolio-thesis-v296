    const ticker=String(w.ticker||w).toUpperCase();
    const isFund=(w.type==="fund"||w.type==="etf"||fundTickers.has(ticker));
    const actionLabel=isFund?"Research":"Analyze";
    const actionFn=isFund?`ptResearchWatch('${ptLibEsc(ticker)}')`:`ptAnalyzeWatch('${ptLibEsc(ticker)}')`;
    return `<div class="pt-library-card pt-watch-security"><div class="pt-watch-name"><b>${ptLibEsc(ticker)}</b><p>${isFund?"ETF / Fund":"Individual company"}</p></div><div class="pt-library-actions"><button class="btn primary" onclick="${actionFn}">${actionLabel}</button><button class="btn" onclick="ptRemoveWatch(${i})">Remove</button></div></div>`;
  }).join(""):'<div class="pt-library-empty">No securities on your watchlist yet. Add a ticker above to start following it.</div>';
}
function ptGeneratePortfolioReport(i){
  const rec=(window.ptLibraryPortfolioRows||[])[i]; if(!rec)return;
  window.ptActivePortfolioName=String(rec.name||"My Portfolio");
  const nameInput=document.getElementById("ptPortfolioName"); if(nameInput)nameInput.value=window.ptActivePortfolioName;
  const holdings=rec.holdings||rec.portfolio||rec.data||[];
  if(!Array.isArray(holdings)||!holdings.length)return;

  // Populate the existing calculation model silently; do not route to Builder.
  const rows=document.getElementById("rows");
  if(!rows)return;
  rows.innerHTML="";
  holdings.forEach(x=>addRow(x.ticker||x.symbol||"",Number(x.weight??x.allocation??0)||0));
  total();

  // Run the existing six-lens analysis while preventing its scroll from exposing Builder.
  const panel=document.getElementById("analysisPanel");
  const oldScroll=panel?.scrollIntoView;
  if(panel)panel.scrollIntoView=function(){};
  try{ if(typeof analyzePortfolio==="function") analyzePortfolio(); }catch(e){}
  if(panel && oldScroll)panel.scrollIntoView=oldScroll;

  // Open the finished publication directly. ptGeneratePortfolioReport() auto-saves it.
  setTimeout(async()=>{
    try{
      if(typeof window.ptGeneratePortfolioPublication!=="function") throw new Error("Portfolio report generator unavailable");
      await window.ptGeneratePortfolioPublication();
    }catch(e){
      console.error("Portfolio report generation failed",e);
      const live=document.getElementById("ptGeneratedReport");
      if(live){
        live.innerHTML=`<div class="ptr-wrap"><div class="ptr-page"><div class="ptr-kicker">PORTFOLIO THESIS</div><h2 class="ptr-section-title">Report could not be generated.</h2><p class="lead">The portfolio was preserved. A report component encountered an error instead of opening a blank page.</p><div class="ptr-implication"><b>Technical detail</b><span>${ptEsc(String(e?.message||e))}</span></div><button class="btn" onclick="closePortfolioReport()">Back</button></div></div>`;
        live.classList.add("active");
        document.body.classList.add("pt-report-open");
      }
    }
  },30);
}
function ptAnalyzeFromLibrary(){
  const inp=document.getElementById("ptDeepTicker");
  const msg=document.getElementById("ptDeepMessage");
  const ticker=(inp?.value||"").trim().toUpperCase().replace(/[^A-Z0-9.\-]/g,"");
  if(!ticker){if(msg)msg.textContent="Enter a company ticker first.";return}
  if(msg)msg.textContent="Opening "+ticker+" for analysis…";
  ptGoCompany();
  setTimeout(()=>{
    const target=document.querySelector('#deepvalue input[type="text"],#deepvalue input');
    if(target){target.value=ticker;target.dispatchEvent(new Event("input",{bubbles:true}));target.focus()}
  },50);
}
document.addEventListener("keydown",e=>{
  if(e.key==="Enter" && e.target && e.target.id==="ptDeepTicker"){e.preventDefault();ptAnalyzeFromLibrary()}
});
function ptLoadLibraryPortfolio(i){
  const rec=(window.ptLibraryPortfolioRows||[])[i]; if(!rec)return;
  const holdings=rec.holdings||rec.portfolio||rec.data||[];
  const name=String(rec.name||"My Portfolio");
  window.ptActivePortfolioName=name;
  localStorage.setItem("pt_working_portfolio_name",name);
  ptGoPortfolio();
  const nameInput=document.getElementById("ptPortfolioName"); if(nameInput)nameInput.value=name;
  const rows=document.getElementById("rows");
  if(rows && Array.isArray(holdings)){rows.innerHTML="";holdings.forEach(x=>addRow(x.ticker||x.symbol||"",Number(x.weight??x.allocation??0)||0));total();}
}
async function ptRenameLibraryPortfolio(i){
  const rec=(window.ptLibraryPortfolioRows||[])[i]; if(!rec)return;
  const oldName=String(rec.name||"My Portfolio");
  const entered=prompt("Portfolio name",oldName);
  if(entered===null)return;
  const name=String(entered).trim().slice(0,60);
  if(!name||name===oldName)return;
  if(!window.ptSupabase||!window.ptUser){alert("Sign in to rename a saved portfolio.");return;}
  const q=window.ptSupabase.from("member_portfolios").update({name,updated_at:new Date().toISOString()}).eq("user_id",window.ptUser.id);
  const {error}=rec.id?await q.eq("id",rec.id):await q.eq("name",oldName);
  if(error){alert("Could not rename portfolio: "+error.message);return;}
  if(window.ptActivePortfolioName===oldName)window.ptActivePortfolioName=name;
  const nameInput=document.getElementById("ptPortfolioName"); if(nameInput&&nameInput.value===oldName)nameInput.value=name;
  await ptRefreshLibrary();
}

function ptAutoSavePortfolioReport(portfolio){
  const host=document.getElementById("ptGeneratedReport");
  if(!host)return;
  const rows=ptLibraryLocal("pt_saved_reports");
  const sig=(portfolio||[]).map(x=>String(x.ticker||"").toUpperCase()+":"+Number(x.weight||0)).join("|");
  const portfolioName=String(window.ptActivePortfolioName||ptCurrentPortfolioName?.()||"My Portfolio");
  const title=portfolioName+" — Portfolio Thesis Report";
  const rec={type:"portfolio",title,portfolioName,signature:sig,savedAt:new Date().toLocaleString(),html:host.outerHTML};
  const ix=rows.findIndex(x=>(x.type||"").toLowerCase()==="portfolio" && x.signature===sig);
  if(ix>=0)rows[ix]=rec;else rows.unshift(rec);
  ptLibrarySet("pt_saved_reports",rows.slice(0,50));
}

function ptOpenFundResearchReport(ticker){
  ticker=String(ticker||"").trim().toUpperCase();
  const p=(typeof RESEARCH_PROFILES!=="undefined"&&RESEARCH_PROFILES[ticker])?RESEARCH_PROFILES[ticker]:null;
  const d=(typeof DB!=="undefined"&&DB[ticker])?DB[ticker]:null;
  if(!p||!d)return;
  const esc=ptLibEsc;
  const date=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",year:"numeric"}).format(new Date());
  const questions=(p.questions||[]).map(q=>`<li>${esc(q)}</li>`).join("");
  const body=document.getElementById("ptResearchReportBody");
  body.innerHTML=`
    <article class="ptdv-page ptdv-cover"><div class="ptdv-kicker">ETF / FUND RESEARCH REPORT</div><h1>${esc(ticker)}</h1><div style="font-size:18px;font-weight:750;margin:-2px 0 10px">${esc(d[0]||ticker)}</div><div class="ptdv-sub">Portfolio role, exposure and thesis questions organized into a compact Portfolio Thesis research report.</div><div class="ptdv-scorehero"><div><div class="ptdv-kicker">PORTFOLIO ROLE</div><b style="font-size:27px">${esc(p.role||"Research")}</b><p class="ptr-small">${date}</p></div></div><div class="ptdv-num">01</div></article>
    <article class="ptdv-page"><div class="ptdv-kicker">EXPOSURE</div><h2 class="ptr-section-title">What this fund adds.</h2><div class="ptdv-two"><div class="ptdv-box"><h4>Primary exposure</h4><p>${esc(p.exposure||"—")}</p></div><div class="ptdv-box"><h4>Why it may belong</h4><p>${esc(p.why||"—")}</p></div></div><div class="ptdv-callout"><b>Portfolio relationship</b><br><small>${esc(p.relationships||"—")}</small></div><div class="ptdv-num">02</div></article>
    <article class="ptdv-page"><div class="ptdv-kicker">THESIS REVIEW</div><h2 class="ptr-section-title">Questions worth answering before sizing the position.</h2><div class="ptdv-box"><ul>${questions}</ul></div><div class="ptdv-callout"><b>Research discipline</b><br><small>ETF and fund research focuses on exposure, role, overlap and portfolio construction rather than company-style intrinsic value.</small></div><p class="ptr-small">Portfolio Thesis is educational research, not individualized investment, tax or legal advice.</p><div class="ptdv-num">03</div></article>`;
  const host=document.getElementById("ptResearchGeneratedReport");
  host.style.display="block";
  [...document.body.children].forEach(el=>{if(el.id!=="ptResearchGeneratedReport"&&el.tagName!=="SCRIPT"){el.dataset.ptResearchDisplay=el.style.display;el.style.display="none";}});
  window.scrollTo(0,0);

  // Save/update the exact finished report under Saved Research.
  const rows=window.ptGetSavedResearch?window.ptGetSavedResearch():[];
  const rec={ticker,name:d[0]||ticker,savedAt:new Date().toISOString(),html:host.outerHTML};
  const next=[rec,...rows.filter(x=>String(x.ticker||"").toUpperCase()!==ticker)];
  localStorage.setItem("pt_saved_research",JSON.stringify(next));
}
function closeResearchReport(){
  const host=document.getElementById("ptResearchGeneratedReport");
  host.style.display="none";
  [...document.body.children].forEach(el=>{if(el.id!=="ptResearchGeneratedReport"&&el.tagName!=="SCRIPT"){el.style.display=el.dataset.ptResearchDisplay||"";delete el.dataset.ptResearchDisplay;}});
  if(typeof ptOpenLibrary==="function")ptOpenLibrary();
}

function ptSaveCurrentReport(){
  const report=document.getElementById("ptDVGeneratedReport")||document.querySelector(".pt-generated-report");
  if(!report)return;
  const title=(report.querySelector("h1,h2")?.textContent||"Portfolio Thesis Report").trim();
  const arr=ptLibraryLocal("pt_saved_reports");
  arr.unshift({title,type:title.toLowerCase().includes("deep")?"Deep Value Report":"Portfolio Thesis Report",savedAt:new Date().toLocaleDateString(),html:report.outerHTML});
  ptLibrarySet("pt_saved_reports",arr.slice(0,30));
  alert("Report saved to My Library.");
}
function ptAutoSaveDeepValueReport(forcedTicker){
  const r=document.getElementById("ptDVGeneratedReport");
  if(!r)return false;
  const body=document.getElementById("ptDVReportBody");
  const h1=body?.querySelector("h1")?.textContent||"";
  const ticker=String(forcedTicker||h1||document.getElementById("dvCompanySymbol")?.textContent||"").trim().toUpperCase().split(/\s+/)[0];
  if(!ticker)return false;
  const rows=ptLibraryLocal("pt_saved_reports");
  const title=ticker+" Deep Value Report";
  const rec={type:"deep-value",ticker,title,savedAt:new Date().toLocaleString(),html:r.outerHTML};
  const next=[rec,...rows.filter(x=>!((x.type||"").toLowerCase().includes("deep")&&String(x.ticker||"").toUpperCase()===ticker))];
  ptLibrarySet("pt_saved_reports",next.slice(0,50));
  return true;
}

function ptOpenSavedReport(i){
  const r=ptLibraryLocal("pt_saved_reports")[i];
  if(!r)return;

  const type=String(r.type||"").toLowerCase();

  // Saved portfolio reports were stored as the full #ptGeneratedReport element
  // before its .active class was added. Restore the saved contents into the
  // live report container so the existing report CSS and Back button work.
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
