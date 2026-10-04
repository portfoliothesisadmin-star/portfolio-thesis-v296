  <div class="research-grid">
   <div class="research-card"><h4>Primary exposure</h4><p>${p.exposure}</p></div>
   <div class="research-card"><h4>Why it may belong</h4><p>${p.why}</p></div>
   <div class="research-card"><h4>Portfolio relationships</h4><p>${p.relationships}</p></div>
   <div class="research-card"><h4>Questions for the thesis</h4><ul class="research-questions">${p.questions.map(q=>`<li>${q}</li>`).join("")}</ul></div>
  </div>
  <div class="lens-example"><b>Research discipline</b><p style="margin:6px 0 0">This profile describes portfolio role and relationships. Current valuation, holdings and fundamentals require the production data layer and are not inferred from stale figures.</p></div>
  <div class="research-next"><b>Next research step</b><span>${p.type==="Stock"?"Review the company-specific financial evidence in Deep Value, then decide whether the thesis belongs in the portfolio.":"Use Portfolio Builder to test the fund's weight, overlap and role alongside the rest of the portfolio."}</span></div>
  <div class="research-foot"><button class="smallbtn" onclick="addWatch('${t}')">＋ Add to Watchlist</button><button class="smallbtn" onclick="document.getElementById('builder').scrollIntoView({behavior:'smooth'})">Analyze in Portfolio</button>${p.type==="Stock"?`<button class="smallbtn" onclick="researchToDeepValue('${t}')">Open Deep Value →</button>`:""}</div>
  <div class="research-type-note">${p.type==="Stock"?"Individual company: eligible for company-level Deep Value analysis.":"ETF/fund: keep analysis focused on exposure, portfolio role, overlap and construction rather than company-style valuation."}</div>`;
}
function researchToDeepValue(t){
 document.getElementById("dvTicker").value=t;
 document.getElementById("deepvalue").scrollIntoView({behavior:"smooth",block:"start"});
 setTimeout(()=>startDeepValue(),350);
}
function watchData(){try{return JSON.parse(localStorage.getItem("pt_watchlist")||"[]")}catch(e){return []}}
function saveWatchData(a){localStorage.setItem("pt_watchlist",JSON.stringify(a));renderWatchlist();renderDVRanking();}
function addWatch(t){t=(t||"").trim().toUpperCase();if(!t)return;let a=watchData();if(!a.includes(t))a.push(t);saveWatchData(a);}
function addWatchTicker(){const e=document.getElementById("watchTicker");addWatch(e.value);e.value="";}
function removeWatch(t){saveWatchData(watchData().filter(x=>x!==t));}
function watchResearch(t){document.getElementById("researchTicker").value=t;runResearch();document.getElementById("research").scrollIntoView({behavior:"smooth"});}
function renderWatchlist(){
 const out=document.getElementById("watchList");if(!out)return;const a=watchData();
 out.innerHTML=a.length?a.map(t=>`<div class="watch-row"><b>${t}</b><span class="muted">${DB[t]?.[0]||"Saved security"}</span><div class="watch-actions"><button class="smallbtn" onclick="watchResearch('${t}')">View Research</button>${!PT_ETFS.has(t)?`<button class="smallbtn" onclick="researchToDeepValue('${t}')">Deep Value</button>`:""}<button class="smallbtn" onclick="removeWatch('${t}')">Remove</button></div></div>`).join(""):'<p class="muted">No securities saved yet.</p>';
}
function dvQueue(){try{return JSON.parse(localStorage.getItem("pt_deep_value_queue")||"[]")}catch(e){return []}}
function saveDVQueue(a){localStorage.setItem("pt_deep_value_queue",JSON.stringify(a));renderDVRanking();}
const PT_ETFS=new Set(["VTI","VOO","VXUS","AVUV","AVDV","QQQM","SCHD","BND","VNQ","GLD"]);
function money(v){if(v==null||!isFinite(Number(v)))return"—";const n=Number(v),a=Math.abs(n);if(a>=1e12)return"$"+(n/1e12).toFixed(2)+"T";if(a>=1e9)return"$"+(n/1e9).toFixed(2)+"B";if(a>=1e6)return"$"+(n/1e6).toFixed(1)+"M";return"$"+n.toLocaleString();}
function ratioPct(v){return v==null||!isFinite(Number(v))?"—":Number(v).toFixed(1)+"%";}
function arr(x){return Array.isArray(x)?x:[]}
function first(x){return arr(x)[0]||{}}
function num(v){const x=Number(v);return Number.isFinite(x)?x:null}

/* V121 — successful Deep Value analyses automatically become dated Research Universe snapshots.
   This reads the already-calculated Deep Value output; it does not change scoring or DCF logic. */
function ptNumberFromText(v){
 const n=Number(String(v??"").replace(/[^0-9.-]/g,""));
 return Number.isFinite(n)?n:null;
}
function ptDeepValueResearchSnapshot(t,d){
 const raw=(document.querySelector("#deepValue")?.innerText||"");
 const scoreEl=(document.getElementById("dvTotalScore")?.textContent||"").trim();
 const compText=(document.getElementById("dvCompleteness")?.textContent||"").trim();
 const scoreMatch=scoreEl.match(/(\d+)/)||raw.match(/Evidence score[:\s]+(\d+)\s*\/\s*100/i)||raw.match(/(\d+)\s*\/\s*100/);
 const compMatch=compText.match(/(\d+)%/)||raw.match(/(\d+)%\s*(?:evidence\s*)?complete/i);
 const cats={};
 document.querySelectorAll("#dvScoreRows .dv-score-row").forEach(row=>{
   const name=(row.querySelector("b")?.textContent||"").trim().toLowerCase();
   const pts=(row.querySelector(".dv-score-points")?.textContent||"").match(/(\d+)/);
   if(!pts)return;
   if(name.includes("financial strength"))cats.financialStrength=Number(pts[1]);
   else if(name.includes("earning power"))cats.earningPower=Number(pts[1]);
   else if(name.includes("cash generation"))cats.cashGeneration=Number(pts[1]);
   else if(name.includes("capital discipline"))cats.capitalDiscipline=Number(pts[1]);
   else if(name==="valuation"||name.includes("valuation"))cats.valuation=Number(pts[1]);
 });
 const profile=Array.isArray(d?.profile)?d.profile[0]:(d?.profile||{});
 const price=Number.isFinite(Number(window.ptDVValuation?.marketPrice))?Number(window.ptDVValuation.marketPrice):ptNumberFromText(document.getElementById("dvPrice")?.textContent);
 const normalized=Number.isFinite(Number(window.ptDVValuation?.normalized))?Number(window.ptDVValuation.normalized):null;
 const mos=(price!=null&&normalized!=null&&normalized!==0)?((normalized-price)/normalized*100):null;
 return {
   symbol:String(t||"").toUpperCase(),
   securityType:"stock",
   companyName:profile?.companyName||d?.companyName||document.getElementById("dvCompanyName")?.textContent||null,
   sector:profile?.sector||null,
   industry:profile?.industry||null,
   source:"Deep Value Engine",
   asOf:new Date().toISOString(),
   evidenceScore:scoreMatch?Number(scoreMatch[1]):null,
   completeness:compMatch?Number(compMatch[1]):null,
   marketPrice:price,
   normalizedValue:normalized,
   marginOfSafety:mos,
   categories:cats,
   evidence:{
     evidenceScore:scoreMatch?Number(scoreMatch[1]):null,
     completeness:compMatch?Number(compMatch[1]):null,
     marketPrice:price,
     normalizedValue:normalized,
     marginOfSafety:mos,
     categories:cats,
     valuation:window.ptDVValuation||null,
     providerData:d
   }
 };
}
async function ptCaptureDeepValueSuccess(t,d){
 const snap=ptDeepValueResearchSnapshot(t,d);
 return await ptCaptureResearchUniverse(snap);
}
window.ptCaptureDeepValueSuccess=ptCaptureDeepValueSuccess;

async function startDeepValue(){
 const el=document.getElementById("dvTicker"),msg=document.getElementById("dvStartMsg"),t=el.value.trim().toUpperCase();
 if(!t){msg.textContent="Enter a company ticker first.";return;}
 if(PT_ETFS.has(t)){msg.textContent=t+" is better suited to Portfolio Research. Deep Value is designed for individual-company fundamental analysis.";return;}
 let q=dvQueue();if(!q.includes(t))q.push(t);saveDVQueue(q);el.value="";msg.textContent="";
 await openDeepValue(t);
}
function renderDVRanking(){
 const out=document.getElementById("dvRanking");if(!out)return;const q=dvQueue();
 if(!q.length){out.innerHTML='<div class="dv-empty">Enter a company above to begin your Deep Value research queue.</div>';return;}
 out.innerHTML=q.map(t=>`<div class="dv-rankrow dv-queue-row"><div class="dv-ranknum">—</div><b>${t}</b><div><div class="dv-score">Analysis available</div><div class="dv-evidence">Automated financial review · evidence score available</div></div><button class="dv-open" onclick="openDeepValue('${t}')">View Analysis</button></div>`).join("");
} 
async function openDeepValue(t){
 const title=document.getElementById("dvTitle"),intro=document.getElementById("dvIntro"),loading=document.getElementById("dvLoading"),report=document.getElementById("dvReport"),err=document.getElementById("dvError");
 title.textContent=t+" Deep Value Report";intro.textContent="Building the report from current company data.";loading.style.display="block";report.style.display="none";err.style.display="none";
 const ws=document.querySelector(".dv-workspace");
 if(ws && ws.offsetParent!==null) ws.scrollIntoView({behavior:"smooth",block:"start"});
 try{
   if(!window.ptSupabase)throw new Error("Portfolio Thesis data connection is not available.");
   const {data,error}=await window.ptSupabase.functions.invoke("deep-value-data",{body:{ticker:t}});
   if(error)throw error;if(!data||data.error)throw new Error(data?.error||"No company data returned.");
   buildDVReport(t,data);
   loading.style.display="none";report.style.display="block";intro.textContent="Current financial evidence organized into the Portfolio Thesis Deep Value framework.";
   // V124: render/open the finished report BEFORE any optional research-memory write.
   // A Research Universe capture failure must never block or blank the reader-facing report.
   await new Promise(resolve=>setTimeout(resolve,60));
   openDVReport(t);
   Promise.resolve(ptCaptureDeepValueSuccess(t,data)).catch(e=>{
     console.warn("Research Universe capture deferred:",e);
   });
   return true;
 }catch(e){loading.style.display="none";err.style.display="block";err.textContent="Could not build the report: "+(e?.message||e);
    throw e;}
}
function buildDVReport(t,d){
 const profileRows=arr(d.profile);
 const p=profileRows.length ? first(d.profile) : {
   companyName:d.companyName??null,
   price:d.price??null,
   marketCap:d.marketCap??null
 };
 const inc=arr(d.income).map(x=>({
   ...x,
   calendarYear:x.calendarYear??x.year,
   weightedAverageShsOutDil:x.weightedAverageShsOutDil??x.dilutedShares,
   incomeBeforeTax:x.incomeBeforeTax??x.ebt??x.pretaxIncome,
   incomeTaxExpense:x.incomeTaxExpense??x.incomeTax,
   operatingIncome:x.operatingIncome??x.ebit
 }));
 const bal=arr(d.balance).length?arr(d.balance):arr(d.balanceSheet).map(x=>({
   ...x,
   calendarYear:x.calendarYear??x.year,
   cashAndCashEquivalents:x.cashAndCashEquivalents??x.cash,
   cashAndShortTermInvestments:x.cashAndShortTermInvestments??
     ((num(x.cash)!=null||num(x.shortTermInvestments)!=null)
       ? (num(x.cash)||0)+(num(x.shortTermInvestments)||0)
       : null),
   totalStockholdersEquity:x.totalStockholdersEquity??x.totalEquity??x.stockholdersEquity
 }));
 const cf=arr(d.cashflow).length?arr(d.cashflow):arr(d.cashFlow).map(x=>({
   ...x,
   calendarYear:x.calendarYear??x.year,
   capitalExpenditure:x.capitalExpenditure??x.capitalExpenditures
 }));
 const i0=inc[0]||{},b0=bal[0]||{},c0=cf[0]||{};
 const revenue=num(i0.revenue),net=num(i0.netIncome),op=num(i0.operatingIncome),cash=num(b0.cashAndCashEquivalents??b0.cashAndShortTermInvestments),debt=num(b0.totalDebt),ocf=num(c0.operatingCashFlow??c0.netCashProvidedByOperatingActivities),capex=num(c0.capitalExpenditure);
 let fcf=num(c0.freeCashFlow);if(fcf==null&&ocf!=null&&capex!=null)fcf=ocf+capex;
 const fcfMargin=(fcf!=null&&revenue)?(fcf/revenue*100):null,netMargin=(net!=null&&revenue)?(net/revenue*100):null;
 const marketCap=num(p.marketCap),price=num(p.price),fcfYield=(fcf!=null&&marketCap)?(fcf/marketCap*100):null;
 document.getElementById("dvCompanySymbol").textContent=t;
 document.getElementById("dvCompanyName").textContent=p.companyName||t;
 document.getElementById("dvPrice").textContent=price!=null?"$"+price.toFixed(2):"—";
 document.getElementById("dvMarketCap").textContent="Market cap "+money(marketCap);
 const metrics=[["Revenue",money(revenue)],["Free cash flow",money(fcf)],["FCF margin",ratioPct(fcfMargin)],["Net margin",ratioPct(netMargin)],["Cash",money(cash)],["Total debt",money(debt)],["FCF yield",ratioPct(fcfYield)],["Operating income",money(op)],["Net income",money(net)]];
 
 document.getElementById("dvMetrics").innerHTML=metrics.map(x=>`<div class="dv-metric"><span>${x[0]}</span><b>${x[1]}</b></div>`).join("");
 const years=inc.slice(0,5).map((row,idx)=>{
   const cashRow=cf[idx]||{},rev=num(row.revenue),ni=num(row.netIncome);
   let fyFcf=num(cashRow.freeCashFlow),fyOcf=num(cashRow.operatingCashFlow??cashRow.netCashProvidedByOperatingActivities),fyCapex=num(cashRow.capitalExpenditure);
   if(fyFcf==null&&fyOcf!=null&&fyCapex!=null)fyFcf=fyOcf+fyCapex;
   return {year:row.calendarYear||row.fiscalYear||String(row.date||"").slice(0,4)||"—",revenue:rev,net:ni,fcf:fyFcf};
 });
 document.getElementById("dvTrendRows").innerHTML='<div class="dv-trendrow head"><span>Year</span><span>Revenue</span><span>Net income</span><span>FCF</span></div>'+years.map(y=>`<div class="dv-trendrow"><b>${y.year}</b><span>${money(y.revenue)}</span><span>${money(y.net)}</span><span>${money(y.fcf)}</span></div>`).join("");
 const validYears=years.filter(y=>y.revenue!=null&&y.net!=null&&y.fcf!=null);
 const latestIncome=inc[0]||{}, latestCash=cf[0]||{};
 const interestExpense=Math.abs(num(latestIncome.interestExpense)||0);
 const ebit=num(latestIncome.operatingIncome??latestIncome.ebit);
 const shares=num(latestIncome.weightedAverageShsOutDil??latestIncome.weightedAverageShsOut);
 const oldestIncome=inc[Math.min(4,inc.length-1)]||{};
 const oldestShares=num(oldestIncome.weightedAverageShsOutDil??oldestIncome.weightedAverageShsOut);
 const debtFcf=(debt!=null&&fcf>0)?debt/fcf:null;
 const coverage=(ebit!=null&&interestExpense>0)?ebit/interestExpense:null;

 // V44 calibrated scoring model. Missing evidence is unscored, not treated as failure.
 // Each category tracks earned points and measured points separately.
 const currentAssets=num(b0.totalCurrentAssets), currentLiabilities=num(b0.totalCurrentLiabilities);
 const currentRatio=(currentAssets!=null&&currentLiabilities>0)?currentAssets/currentLiabilities:null;
 const netDebt=(debt!=null&&cash!=null)?debt-cash:null;
 const netDebtFcf=(netDebt!=null&&fcf>0)?netDebt/fcf:null;

 // 1. Financial Strength /20: debt burden 6, coverage 5, liquidity 4, net debt/FCF 5.
 let strengthScore=0,strengthMeasured=0,strengthParts=[];
 if(debtFcf!=null){
   const pts=debtFcf<=1?6:debtFcf<=2?5:debtFcf<=3?3:debtFcf<=4?1:0;
   strengthScore+=pts; strengthMeasured+=6; strengthParts.push(`Debt/FCF ${debtFcf.toFixed(2)}x (${pts}/6)`);
 }
 if(coverage!=null){
   const pts=coverage>=10?5:coverage>=6?4:coverage>=3?3:coverage>=2?1:0;
   strengthScore+=pts; strengthMeasured+=5; strengthParts.push(`EBIT/interest ${coverage.toFixed(1)}x (${pts}/5)`);
 }
 if(currentRatio!=null){
   const pts=currentRatio>=2?4:currentRatio>=1.5?3:currentRatio>=1.2?2:currentRatio>=1?1:0;
   strengthScore+=pts; strengthMeasured+=4; strengthParts.push(`current ratio ${currentRatio.toFixed(2)}x (${pts}/4)`);
 }
 if(netDebtFcf!=null){
   const pts=netDebt<=0?5:netDebtFcf<=0.5?4:netDebtFcf<=1?3:netDebtFcf<=2?2:netDebtFcf<=3?1:0;
   strengthScore+=pts; strengthMeasured+=5; strengthParts.push(`${netDebt<=0?"net cash":"net debt/FCF "+netDebtFcf.toFixed(2)+"x"} (${pts}/5)`);
 }
