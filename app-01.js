

/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */



const LENS_CONTENT={
 structure:{
  eyebrow:"01 · STRUCTURE",title:"What job does each holding have?",
  intro:"Portfolio structure is the architecture of the portfolio: what anchors it, what diversifies it, and what represents a deliberate tilt or satellite position.",
  asks:"If every holding had to justify its place, what role would it play? A strong structure makes the purpose of each position visible rather than treating every ticker as interchangeable.",
  look:["A broad core that carries most of the portfolio","Diversifiers that add genuinely different exposure","Tilts or satellites sized intentionally","Holdings whose role is unclear or duplicated"],
  interpret:"A portfolio does not need one universal structure. The useful question is whether its structure matches the investor's stated objective and whether each position has a defensible role.",
  mistake:"Assuming that owning more tickers automatically creates a better structure. Several funds can perform essentially the same job.",
  example:"A broad U.S. market fund might serve as a core, an international fund as a diversifier, and a small-value fund as a deliberate factor tilt.",
  apply:"The Builder classifies holdings by role so you can see the structure created by your actual allocation.",target:"aStructure"
 },
 overlap:{
  eyebrow:"02 · OVERLAP & CONCENTRATION",title:"How much of the same exposure do you really own?",
  intro:"Different ticker symbols can hide the same companies, sectors, countries or risk factors. This lens looks beneath the labels.",
  asks:"Are multiple holdings actually diversifying the portfolio, or are they stacking exposure to the same underlying sources of return and risk?",
  look:["Repeated top holdings across funds","Sector or industry weight that dominates the portfolio","Single-company exposure held directly and again through funds","Factor, geography or style bets that overlap"],
  interpret:"Overlap is not automatically bad. It becomes important when it creates a larger exposure than the investor intended or understood.",
  mistake:"Counting the number of funds instead of examining what those funds own.",
  example:"Holding a total-market ETF, an S&P 500 ETF and a large-cap growth ETF can create substantial repeated exposure to the same mega-cap companies.",
  apply:"Use your portfolio analysis to identify where multiple positions may be doing the same job or increasing concentration.",target:"aDiversification"
 },
 durability:{
  eyebrow:"03 · THESIS DURABILITY",title:"Did the investment thesis change—or only the price?",
  intro:"Durability separates evidence about the investment from the emotional impact of market movement.",
  asks:"What facts originally supported the position, and which new facts would be meaningful enough to weaken, strengthen or replace that argument?",
  look:["Changes in business or fund fundamentals","Changes in the reason the holding was purchased","Structural changes to an asset's exposure","Evidence that contradicts the original assumptions"],
  interpret:"Price movement can prompt a review, but it is not itself proof that the thesis changed. The evidence behind the thesis is what matters.",
  mistake:"Rewriting the thesis after every rally or decline so that the story always matches the latest price.",
  example:"A 15% decline with unchanged fundamentals is different from a decline accompanied by deteriorating cash generation, leverage and competitive position.",
  apply:"Save a thesis snapshot and compare later information against the reasoning you recorded—not merely against the old price.",target:"aBehavior"
 },
 risk:{
  eyebrow:"04 · RISK & VOLATILITY",title:"What could hurt the portfolio—and how much would it matter?",
  intro:"Risk is broader than day-to-day price movement. This lens considers the size, source and consequence of the portfolio's exposures.",
  asks:"Which positions or shared exposures could create a meaningful loss, and is that risk intentional, diversified and tolerable over the intended holding period?",
  look:["Large single-security or sector weights","Highly correlated holdings","Leverage, credit or business-specific risks","Drawdowns that could conflict with the investor's time horizon"],
  interpret:"Volatility describes movement; risk asks what can permanently impair the plan or force an investor to abandon it at the wrong time.",
  mistake:"Treating the least volatile asset as automatically the safest without considering inflation, duration, credit, concentration or opportunity risk.",
  example:"A 10% satellite position can be volatile without dominating the portfolio; the same exposure at 45% can change the portfolio's entire risk profile.",
  apply:"The Builder shows concentration and diversification in the context of the whole allocation rather than judging positions in isolation.",target:"aConcentration"
 },
 horizon:{
  eyebrow:"05 · TIME HORIZON",title:"Does the portfolio fit the time available?",
  intro:"An investment can be reasonable for one horizon and poorly matched to another. Time changes which risks matter most.",
  asks:"When might this money be needed, and does each major holding have enough time for its investment case to play out?",
  look:["Near-term spending needs versus long-term capital","Volatile assets tied to short deadlines","Long-duration theses that require patience","Whether the allocation can survive a prolonged drawdown"],
  interpret:"A longer horizon can improve the ability to tolerate volatility, but it does not make valuation, concentration or a weak thesis irrelevant.",
  mistake:"Using 'long term' as a reason to ignore evidence or assuming every risky asset becomes safe if held long enough.",
  example:"Equity volatility may be tolerable for money intended for retirement decades away but inappropriate for money required for a known purchase next year.",
  apply:"Use the Builder's portfolio interpretation together with your own goal date to judge whether the allocation and thesis are aligned.",target:"aThesis"
 },
 takeaways:{
  eyebrow:"06 · ACTIONABLE TAKEAWAYS",title:"Turn analysis into a disciplined review process.",
  intro:"The final lens converts observations into a short list of things worth monitoring, investigating or deliberately leaving alone.",
  asks:"What deserves attention now, what should be monitored over time, and what is simply normal market noise that does not require a portfolio change?",
  look:["Exposures outside intended ranges","A thesis assumption that needs new evidence","Concentration that deserves deliberate review","Specific conditions that would trigger another review"],
  interpret:"An actionable takeaway does not have to mean buy or sell. Often the disciplined action is to research, rebalance, monitor a defined variable, or make no change.",
  mistake:"Feeling that every analysis must end with a transaction.",
  example:"A useful takeaway might be: 'No allocation change; review international weight at the next scheduled rebalance and monitor whether the small-value tilt remains intentional.'",
  apply:"Run the six-part analysis, then save a snapshot so future reviews can compare what changed in the portfolio and in your reasoning.",target:"thesisReview"
 }
};
let activeLens="structure";
function openLens(which){
 activeLens=which;
 const d=LENS_CONTENT[which]; if(!d)return;
 document.getElementById("lensEyebrow").textContent=d.eyebrow;
 document.getElementById("lensTitle").textContent=d.title;
 document.getElementById("lensIntro").textContent=d.intro;
 document.getElementById("lensAsks").textContent=d.asks;
 document.getElementById("lensLook").innerHTML=d.look.map(x=>`<li>${x}</li>`).join("");
 document.getElementById("lensInterpret").textContent=d.interpret;
 document.getElementById("lensMistake").textContent=d.mistake;
 document.getElementById("lensExample").textContent=d.example;
 document.getElementById("lensApply").textContent=d.apply;
 const s=document.getElementById("lensLearning"); s.classList.add("active");
 s.scrollIntoView({behavior:"smooth",block:"start"});
}
function closeLens(){
 document.getElementById("lensLearning").classList.remove("active");
 document.getElementById("sixLenses").scrollIntoView({behavior:"smooth",block:"start"});
}
function applyLens(){
 const d=LENS_CONTENT[activeLens], target=document.getElementById(d.target);
 if(target && target.textContent.trim()) target.scrollIntoView({behavior:"smooth",block:"center"});
 else document.getElementById("builder").scrollIntoView({behavior:"smooth",block:"start"});
}

const RESEARCH_PROFILES={
 VTI:{type:"ETF",role:"Core",exposure:"Broad U.S. equity market",why:"A single-fund way to own large, mid and small U.S. public companies across sectors.",relationships:"Often overlaps heavily with S&P 500 and U.S. large-cap funds because the largest companies dominate market-cap weighting.",questions:["Is this intended to be the U.S. core?","Are other U.S. funds adding a distinct exposure or mostly repeating VTI?","Is the U.S. weight consistent with the portfolio thesis?"]},
 VOO:{type:"ETF",role:"Core",exposure:"U.S. large-cap equities / S&P 500",why:"Tracks the large-company segment of the U.S. market and can serve as a simple U.S. equity core.",relationships:"Substantial overlap with total-market funds such as VTI; adding both changes weights more than it adds new companies.",questions:["Why use large-cap only instead of the total market?","Does another U.S. fund duplicate the same mega-cap exposure?","Is the concentration intentional?"]},
 VXUS:{type:"ETF",role:"Diversifier",exposure:"Developed and emerging markets outside the U.S.",why:"Adds broad non-U.S. equity exposure across countries, currencies and companies.",relationships:"Complements a U.S.-only core; may overlap with other international or global funds.",questions:["What role should international equities play?","Is there additional international exposure elsewhere?","Can the thesis tolerate long periods when U.S. and non-U.S. markets diverge?"]},
 AVUV:{type:"ETF",role:"Tilt",exposure:"U.S. small-cap value",why:"Adds a deliberate small-company/value-oriented factor tilt rather than simply expanding ticker count.",relationships:"Some companies can overlap with broad U.S. funds, but the weighting and selection create a distinct factor exposure.",questions:["Is the factor tilt intentional?","What allocation is large enough to matter but small enough to hold through underperformance?","What evidence would actually change the factor thesis?"]},
 AVDV:{type:"ETF",role:"Tilt",exposure:"International developed small-cap value",why:"Adds small/value exposure outside the U.S., combining geography and factor tilts.",relationships:"Can complement VXUS while deliberately overweighting a narrower segment already represented within broad international markets.",questions:["Is the portfolio intentionally tilting both U.S. and international small value?","How does this interact with VXUS?","Can the allocation withstand extended factor underperformance?"]},
 QQQM:{type:"ETF",role:"Tilt",exposure:"Nasdaq-100 large-cap growth-heavy exposure",why:"Creates a concentrated tilt toward large non-financial Nasdaq-listed companies.",relationships:"Often overlaps materially with broad U.S. funds through mega-cap technology and growth companies.",questions:["Is the added growth/technology concentration intentional?","Which top holdings are already owned through the core?","What portfolio role does this serve beyond recent performance?"]},
 SCHD:{type:"ETF",role:"Income / Tilt",exposure:"U.S. dividend-oriented equities",why:"Targets dividend-paying U.S. companies using quality and dividend screens.",relationships:"Can overlap a broad U.S. core while changing sector, style and income characteristics.",questions:["Is income the objective or is total return the objective?","How much overlaps the U.S. core?","Are dividend screens creating unintended sector tilts?"]},
 BND:{type:"ETF",role:"Bond / Diversifier",exposure:"Broad U.S. investment-grade bonds",why:"Adds fixed-income exposure with a different return and volatility profile from equities.",relationships:"Typically diversifies equity-heavy portfolios, though interest-rate and credit risks remain.",questions:["What job should bonds perform: stability, income, liquidity or rebalancing capital?","Does duration fit the time horizon?","Is the bond allocation large enough to affect portfolio behavior?"]},
 VNQ:{type:"ETF",role:"Tilt",exposure:"U.S. listed real estate / REITs",why:"Overweights listed real estate relative to a broad equity market allocation.",relationships:"REITs already appear inside broad U.S. market funds, so a separate position is an intentional sector overweight.",questions:["Why overweight real estate?","How much REIT exposure already exists in the core?","How would rate sensitivity and sector concentration affect the thesis?"]},
 GLD:{type:"ETF",role:"Diversifier",exposure:"Gold bullion exposure",why:"Provides commodity exposure whose drivers differ from operating companies and bonds.",relationships:"Does not produce business earnings or cash flow like equities; its portfolio role should therefore be explicit.",questions:["Is gold intended as diversification, inflation sensitivity or crisis insurance?","What allocation is meaningful?","What would cause the strategic role to change?"]},
 AAPL:{type:"Stock",role:"Individual stock",exposure:"Single-company equity",why:"A direct company position creates company-specific upside and downside beyond broad-market ownership.",relationships:"Commonly held inside broad U.S. and large-cap index funds, so a direct position increases existing exposure.",questions:["How much AAPL is already owned indirectly through funds?","What company fundamentals support the thesis?","What evidence would invalidate the thesis?"]},
 MSFT:{type:"Stock",role:"Individual stock",exposure:"Single-company equity",why:"A direct company position creates concentrated company-specific exposure.",relationships:"Commonly a major holding of broad U.S., S&P 500 and growth-oriented funds.",questions:["How large is total direct plus indirect exposure?","What assumptions are embedded in the thesis?","Which fundamental developments deserve monitoring?"]}
};
function researchTicker(t){document.getElementById("researchTicker").value=t;runResearch();}
function runResearch(){
  const el=document.getElementById("researchTicker"),t=el.value.trim().toUpperCase(),out=document.getElementById("researchResult");
  out.classList.add("show");
  if(!t){out.innerHTML="<b>Enter a ticker to begin.</b>";return;}
  const d=DB[t],p=RESEARCH_PROFILES[t];
  if(!d||!p){
    out.innerHTML=`<div class="eyebrow">${t}</div><h3 style="margin:5px 0">Research profile not yet available</h3><p class="muted">The prototype does not have a verified local profile for this security. Production search will resolve the security and current data rather than inventing an analysis.</p><div class="research-foot"><button class="smallbtn" onclick="addWatch('${t}')">＋ Add to Watchlist</button></div>`;
    return;
  }
  out.innerHTML=`<div class="research-head"><div><div class="eyebrow">${p.type} RESEARCH PROFILE</div><div class="research-ticker">${t}</div><div>${d[0]}</div><span class="research-role">${p.role}</span></div></div>
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
 const strengthWhy=strengthParts.length?strengthParts.join(" · "):"Financial-strength evidence unavailable.";

 // 2. Earning Power /20: consistency 6, revenue CAGR 4, net-income CAGR 4, margin durability 6.
 let earnScore=0,earnMeasured=0,earnParts=[];
 let revCagr=null,niCagr=null,marginLatest=null,marginAvg=null;
 if(validYears.length>=3){
   const chron=[...validYears].reverse(), n=chron.length-1;
   const positiveNI=chron.filter(y=>y.net>0).length;
   const consistencyPts=positiveNI>=5?6:positiveNI===4?4:positiveNI===3?2:0;
   earnScore+=consistencyPts; earnMeasured+=6; earnParts.push(`positive earnings ${positiveNI}/${chron.length} years (${consistencyPts}/6)`);
   revCagr=(chron[0].revenue>0&&n>0)?(Math.pow(chron.at(-1).revenue/chron[0].revenue,1/n)-1)*100:null;
   if(revCagr!=null){const pts=revCagr>=10?4:revCagr>=5?3:revCagr>=2?2:revCagr>=0?1:0;earnScore+=pts;earnMeasured+=4;earnParts.push(`revenue CAGR ${revCagr.toFixed(1)}% (${pts}/4)`);}
   niCagr=(chron[0].net>0&&chron.at(-1).net>0&&n>0)?(Math.pow(chron.at(-1).net/chron[0].net,1/n)-1)*100:null;
   if(niCagr!=null){const pts=niCagr>=10?4:niCagr>=5?3:niCagr>=2?2:niCagr>=0?1:0;earnScore+=pts;earnMeasured+=4;earnParts.push(`net-income CAGR ${niCagr.toFixed(1)}% (${pts}/4)`);}
   const marginYears=chron.filter(y=>y.revenue>0&&y.net!=null);
   if(marginYears.length>=3){
     const margins=marginYears.map(y=>y.net/y.revenue*100); marginLatest=margins.at(-1); marginAvg=margins.reduce((a,b)=>a+b,0)/margins.length;
     const relative=(marginAvg!==0)?marginLatest/marginAvg:null;
     const pts=relative==null?0:relative>=1?6:relative>=.95?5:relative>=.90?3:relative>=.80?1:0;
     earnScore+=pts;earnMeasured+=6;earnParts.push(`latest/avg margin ${marginLatest.toFixed(1)}%/${marginAvg.toFixed(1)}% (${pts}/6)`);
   }
 }
 const earnWhy=earnParts.length?earnParts.join(" · "):"Needs multi-year earnings history.";

 // 3. Cash Generation & Quality /20: FCF consistency 6, FCF CAGR 4, conversion 6, conversion stability 4.
 let cashScore=0,cashMeasured=0,cashParts=[];
 let avgConv=null,convSpread=null,fcfCagr=null;
 if(validYears.length>=3){
   const chron=[...validYears].reverse(), n=chron.length-1;
   const positiveFcf=chron.filter(y=>y.fcf>0).length;
   const persistencePts=positiveFcf>=5?6:positiveFcf===4?4:positiveFcf===3?2:0;
   cashScore+=persistencePts;cashMeasured+=6;cashParts.push(`positive FCF ${positiveFcf}/${chron.length} years (${persistencePts}/6)`);
   fcfCagr=(chron[0].fcf>0&&chron.at(-1).fcf>0&&n>0)?(Math.pow(chron.at(-1).fcf/chron[0].fcf,1/n)-1)*100:null;
   if(fcfCagr!=null){const pts=fcfCagr>=10?4:fcfCagr>=5?3:fcfCagr>=2?2:fcfCagr>=0?1:0;cashScore+=pts;cashMeasured+=4;cashParts.push(`FCF CAGR ${fcfCagr.toFixed(1)}% (${pts}/4)`);}
   const conversions=chron.filter(y=>y.net>0&&y.fcf!=null).map(y=>y.fcf/y.net);
   if(conversions.length>=3){
     avgConv=conversions.reduce((a,b)=>a+b,0)/conversions.length;
     const pts=avgConv>=1?6:avgConv>=.9?5:avgConv>=.8?4:avgConv>=.7?2:0;
     cashScore+=pts;cashMeasured+=6;cashParts.push(`avg FCF/net income ${avgConv.toFixed(2)}x (${pts}/6)`);
     convSpread=Math.max(...conversions)-Math.min(...conversions);
     const stableCount=conversions.filter(x=>x>=.8&&x<=1.8).length;
     const share=stableCount/conversions.length;
     const stabPts=share>=.8?4:share>=.6?3:share>=.4?2:share>=.2?1:0;
     cashScore+=stabPts;cashMeasured+=4;cashParts.push(`healthy conversion ${stableCount}/${conversions.length} years (${stabPts}/4)`);
   }
 }
 const cashWhy=cashParts.length?cashParts.join(" · "):"Needs multi-year free-cash-flow history.";

 // 4. Capital Discipline /20: ROIC 8, ROIC durability 4, share discipline 4, allocation sustainability 4.
 // ROIC is calculated only when the statements contain enough evidence to derive both NOPAT and invested capital.
 // No assumed tax rate, invented equity value, or proxy ROIC is used.
 let capitalScore=0,capitalMeasured=0,capitalParts=[];
 let shareChange=null;
 const byYear=(rows)=>{const m={};rows.forEach(x=>{const y=String(x.calendarYear??x.fiscalYear??x.year??String(x.date||"").slice(0,4));if(y)m[y]=x});return m};
 const incByYear=byYear(inc), balByYear=byYear(bal);
 const roicHistory=[];
 Object.keys(incByYear).slice(0,5).forEach(y=>{
   const ir=incByYear[y]||{}, br=balByYear[y]||{};
   const opY=num(ir.operatingIncome??ir.ebit);
   const pretaxY=num(ir.incomeBeforeTax??ir.incomeBeforeTaxExpense??ir.ebt);
   const taxY=num(ir.incomeTaxExpense??ir.incomeTax);
   const debtY=num(br.totalDebt);
   const equityY=num(br.totalStockholdersEquity??br.totalEquity??br.stockholdersEquity);
   const cashY=num(br.cashAndCashEquivalents??br.cashAndShortTermInvestments);
   const taxRate=(pretaxY!=null&&pretaxY>0&&taxY!=null)?Math.max(0,Math.min(.5,taxY/pretaxY)):null;
   const invested=(debtY!=null&&equityY!=null&&cashY!=null)?debtY+equityY-cashY:null;
   const nopat=(opY!=null&&taxRate!=null)?opY*(1-taxRate):null;
   const roic=(nopat!=null&&invested!=null&&invested>0)?nopat/invested*100:null;
   if(roic!=null)roicHistory.push({year:y,roic});
 });
 if(roicHistory.length){
   const latestRoic=roicHistory[0].roic;
   const pts=latestRoic>=20?8:latestRoic>=15?7:latestRoic>=10?5:latestRoic>=7?3:latestRoic>=5?1:0;
   capitalScore+=pts;capitalMeasured+=8;capitalParts.push(`ROIC ${latestRoic.toFixed(1)}% (${pts}/8)`);
 }
 if(roicHistory.length>=3){
   const vals=roicHistory.map(x=>x.roic), latest=vals[0], avg=vals.reduce((a,b)=>a+b,0)/vals.length;
   const positive=vals.filter(x=>x>0).length/vals.length;
   const relative=avg>0?latest/avg:null;
   const pts=(positive===1&&relative!=null&&relative>=.9)?4:(positive>=.8&&relative!=null&&relative>=.75)?3:(positive>=.6&&relative!=null&&relative>=.5)?2:(positive>=.6)?1:0;
   capitalScore+=pts;capitalMeasured+=4;capitalParts.push(`ROIC durability ${latest.toFixed(1)}% latest / ${avg.toFixed(1)}% avg (${pts}/4)`);
 }
 if(shares!=null&&oldestShares!=null&&oldestShares>0){
   shareChange=(shares/oldestShares-1)*100;
   const pts=shareChange<=-5?4:shareChange<=0?3:shareChange<=5?2:shareChange<=10?1:0;
   capitalScore+=pts;capitalMeasured+=4;capitalParts.push(`5-year diluted share-count change ${shareChange>=0?"+":""}${shareChange.toFixed(1)}% (${pts}/4)`);
 }
 // Sustainability is measured only with multi-year FCF, debt and share-count evidence.
 // It rewards capital return funded by durable FCF without a material increase in leverage.
 const debtSeries=bal.slice(0,5).map(x=>num(x.totalDebt)).filter(x=>x!=null);
 const fcfSeries=cf.slice(0,5).map(x=>{let z=num(x.freeCashFlow),o=num(x.operatingCashFlow??x.netCashProvidedByOperatingActivities),cx=num(x.capitalExpenditure??x.capitalExpenditures);if(z==null&&o!=null&&cx!=null)z=o+cx;return z}).filter(x=>x!=null);
 if(debtSeries.length>=3&&fcfSeries.length>=3&&shareChange!=null){
   const positiveShare=fcfSeries.filter(x=>x>0).length/fcfSeries.length;
   const debtChange=debtSeries.at(-1)>0?(debtSeries[0]/debtSeries.at(-1)-1)*100:null;
   let pts=0;
   if(positiveShare===1&&debtChange!=null&&debtChange<=10&&shareChange<=0)pts=4;
   else if(positiveShare>=.8&&debtChange!=null&&debtChange<=25&&shareChange<=5)pts=3;
   else if(positiveShare>=.6&&debtChange!=null&&debtChange<=50)pts=2;
   else if(positiveShare>=.6)pts=1;
   capitalScore+=pts;capitalMeasured+=4;capitalParts.push(`allocation sustainability: positive FCF ${Math.round(positiveShare*fcfSeries.length)}/${fcfSeries.length} years · debt change ${debtChange==null?"—":(debtChange>=0?"+":"")+debtChange.toFixed(1)+"%"} (${pts}/4)`);
 }
 const missingCapital=[];
 if(!roicHistory.length)missingCapital.push("ROIC");
 if(roicHistory.length<3)missingCapital.push("ROIC durability");
 if(capitalMeasured<16&&!(debtSeries.length>=3&&fcfSeries.length>=3&&shareChange!=null))missingCapital.push("capital-allocation sustainability");
 if(missingCapital.length)capitalParts.push(`${missingCapital.join(", ")} unscored until the required statement evidence is available`);
 const capitalWhy=capitalParts.join(" · ");

 // 5. Valuation /20: FCF yield 8, earnings yield 6, EV/EBIT 6.
 const earningsYield=(net!=null&&marketCap)?net/marketCap*100:null;
 const enterpriseValue=(marketCap!=null&&debt!=null&&cash!=null)?marketCap+debt-cash:null;
 const evEbit=(enterpriseValue!=null&&ebit>0)?enterpriseValue/ebit:null;
 let valScore=0,valMeasured=0,valParts=[];
 if(fcfYield!=null){const pts=fcfYield>=10?8:fcfYield>=8?7:fcfYield>=6?5:fcfYield>=4?3:fcfYield>=2?1:0;valScore+=pts;valMeasured+=8;valParts.push(`FCF yield ${ratioPct(fcfYield)} (${pts}/8)`);}
 if(earningsYield!=null){const pts=earningsYield>=10?6:earningsYield>=8?5:earningsYield>=6?4:earningsYield>=4?2:earningsYield>=2?1:0;valScore+=pts;valMeasured+=6;valParts.push(`earnings yield ${ratioPct(earningsYield)} (${pts}/6)`);}
 if(evEbit!=null){const pts=evEbit<=8?6:evEbit<=10?5:evEbit<=12?4:evEbit<=15?2:evEbit<=20?1:0;valScore+=pts;valMeasured+=6;valParts.push(`EV/EBIT ${evEbit.toFixed(1)}x (${pts}/6)`);}
 const valWhy=valParts.length?valParts.join(" · "):"Needs market value and earning-power evidence.";

 const measured=[strengthMeasured,earnMeasured,cashMeasured,capitalMeasured,valMeasured];
 const earned=[strengthScore,earnScore,cashScore,capitalScore,valScore];
 const measuredTotal=measured.reduce((a,b)=>a+b,0), earnedTotal=earned.reduce((a,b)=>a+b,0);
 const evidenceScore=measuredTotal?Math.round(earnedTotal/measuredTotal*100):null;
 const completeness=measuredTotal; // denominator is 100 possible evidence points.


 // V47 Margin of Safety: separate from the 100-point evidence score.
 // Uses only reported FCF, cash/investments, debt and diluted shares already supplied by the report.
 const fcfChron=[...years].filter(y=>y.fcf!=null).reverse();
 const recentFcf=fcfChron.slice(-3).map(y=>y.fcf).filter(x=>x>0);
 const latestFcf=fcfChron.length?fcfChron.at(-1).fcf:null;
 const avg3=recentFcf.length?recentFcf.reduce((a,b)=>a+b,0)/recentFcf.length:null;
 const weighted3=recentFcf.length===3?(recentFcf[0]*.2+recentFcf[1]*.3+recentFcf[2]*.5):avg3;
 let sustainableGrowth=null;
 if(revCagr!=null&&fcfCagr!=null)sustainableGrowth=Math.min(revCagr,fcfCagr,10);
 else if(fcfCagr!=null)sustainableGrowth=Math.min(fcfCagr,10);
 else if(revCagr!=null)sustainableGrowth=Math.min(revCagr,10);
 if(sustainableGrowth!=null)sustainableGrowth=Math.max(-10,sustainableGrowth);
 // V53: negative historical growth is evidence of contraction/cyclicality, not a
 // mechanically sustainable forecast. Normalize the starting FCF across recent
 // years and use 0% as the forward growth floor rather than extrapolating decline.
 const cyclicalNormalization=sustainableGrowth!=null&&sustainableGrowth<0;
 const dcfGrowthReference=cyclicalNormalization?0:sustainableGrowth;

 const dcfValue=(startFcf,g1,terminal,discount)=>{
   if(!(startFcf>0)||!(shares>0)||discount<=terminal)return null;
   let pv=0, prior=startFcf;
   for(let yr=1;yr<=10;yr++){
     let g;
     if(yr<=5) g=g1;
     else {
       const step=(yr-5)/5;
       g=g1+(terminal-g1)*step;
     }
     prior=prior*(1+g);
     pv+=prior/Math.pow(1+discount,yr);
   }
   const tv=prior*(1+terminal)/(discount-terminal);
   pv+=tv/Math.pow(1+discount,10);
   const cashInvest=num(b0.cashAndShortTermInvestments)??cash??0;
   const equity=pv+cashInvest-(debt??0);
   return equity/shares;
 };
 const mosPct=(value)=>value!=null&&value!==0&&price!=null?(value-price)/value*100:null;
 const fmtVal=(v)=>v==null?"—":"$"+v.toFixed(2);
 const fmtMos=(m)=>m==null?"—":(m>=0?`${m.toFixed(1)}% below estimated value`:`${Math.abs(m).toFixed(1)}% above estimated value`);

 let mosCases=null;
 // V125: retain the reverse-DCF result directly for the publication report.
 // This avoids reparsing display text and correctly preserves negative implied growth.
 let ptMarketImpliedGrowth=null;
 if(latestFcf>0&&avg3>0&&weighted3>0&&sustainableGrowth!=null&&shares>0&&price!=null){
   const normalizedStart=avg3;
   const conservativeStart=cyclicalNormalization?Math.min(latestFcf,avg3):Math.min(latestFcf,avg3);
   const baseStart=cyclicalNormalization?normalizedStart:weighted3;
   const favorableStart=cyclicalNormalization?Math.max(latestFcf,avg3):latestFcf;
   const sg=dcfGrowthReference/100;
   let cases=[
     {name:"Cautious scenario value",start:conservativeStart,g:sg*.50,t:.02,r:.11},
     {name:"Normalized scenario value",start:baseStart,g:sg*.75,t:.025,r:.10},
     {name:"Stronger-growth scenario",start:favorableStart,g:sg*.85,t:.0275,r:.095}
   ].map(c=>({...c,value:dcfValue(c.start,c.g,c.t,c.r)}));
   // Sanity guard: sensitivity scenarios must remain economically ordered.
   if(cases.every(c=>c.value!=null) && !(cases[0].value<=cases[1].value && cases[1].value<=cases[2].value)){
     const ordered=[...cases].map(c=>c.value).sort((a,b)=>a-b);
     cases[0].value=ordered[0]; cases[1].value=ordered[1]; cases[2].value=ordered[2];
   }
   cases.forEach(c=>c.mos=mosPct(c.value));
   mosCases=cases;
 }
 const mosGrid=document.getElementById("dvMosGrid"),mosSummary=document.getElementById("dvMosSummary"),mosAssumptions=document.getElementById("dvMosAssumptions");
 if(mosCases){
   mosGrid.innerHTML=mosCases.map(c=>`<div class="dv-mos-case"><span>${c.name}</span><b>${fmtVal(c.value)}</b><small>${fmtMos(c.mos)}</small></div>`).join("");
   const baseCase=mosCases[1], lo=Math.min(...mosCases.map(c=>c.value)), hi=Math.max(...mosCases.map(c=>c.value));
   // Solve for the first-five-year FCF growth rate that makes the base DCF equal the current market price.
   // Uses the same normalized starting FCF, 10% discount rate and 2.5% terminal growth as the base case.
   const impliedGrowthValue=(g)=>dcfValue(baseCase.start,g,.025,.10);
   let impliedGrowth=null, impliedGrowthNote="";
   let low=-.20, high=1.00, lowVal=impliedGrowthValue(low), highVal=impliedGrowthValue(high);
   if(lowVal!=null&&highVal!=null&&price!=null){
     if(price<lowVal){
       impliedGrowthNote=`Below the value produced even at -20% near-term FCF growth.`;
     } else if(price>highVal){
       impliedGrowthNote=`Requires more than 100% annualized FCF growth in years 1–5 under the base discount and terminal assumptions.`;
     } else {
       for(let i=0;i<80;i++){
         const mid=(low+high)/2, midVal=impliedGrowthValue(mid);
         if(midVal<price) low=mid; else high=mid;
       }
       impliedGrowth=(low+high)/2;
       ptMarketImpliedGrowth=impliedGrowth;
     }
   }
   const impliedLine=impliedGrowth!=null
     ? `<br><b>Market-implied FCF growth:</b> ${(impliedGrowth*100).toFixed(1)}% annualized in years 1–5 under the base DCF assumptions.`
     : (impliedGrowthNote?`<br><b>Market-implied FCF growth:</b> ${impliedGrowthNote}`:"");
   let growthGapLine="";
   if(impliedGrowth!=null){
     const impliedPct=impliedGrowth*100, gap=impliedPct-dcfGrowthReference;
     const direction=gap>1?"above":(gap<-1?"below":"near");
     const context=direction==="above"
       ? `The market-implied ${impliedPct.toFixed(1)}% annual FCF growth is substantially above the normalized ${dcfGrowthReference.toFixed(1)}% growth reference used by this model. The current price therefore depends on materially stronger growth than the normalized case assumes.`
       : direction==="below"
         ? `The market-implied ${impliedPct.toFixed(1)}% annual FCF growth is below the normalized ${dcfGrowthReference.toFixed(1)}% growth reference used by this model. The current price therefore requires less growth than the normalized case assumes.`
         : `The market-implied ${impliedPct.toFixed(1)}% annual FCF growth is close to the normalized ${dcfGrowthReference.toFixed(1)}% growth reference used by this model.`;
     growthGapLine=`<br><b>Growth expectation gap:</b> ${context}`;
   }
   mosSummary.innerHTML=`<b>Current price: ${fmtVal(price)}</b><br>Normalized scenario value: <b>${fmtVal(baseCase.value)}</b><br>Base-case comparison: <b>${fmtMos(baseCase.mos)}</b>.${impliedLine}${growthGapLine}<br><span style="color:var(--muted)">The implied-growth figure is not a forecast. It shows the near-term FCF growth required for the base DCF to reconcile with the current market price. Conservative and favorable values are sensitivity scenarios, not equally weighted endpoints of a fair-value range.</span>`;
   const normalizationNote=cyclicalNormalization
     ? `<br><b>Normalization flag:</b> Historical FCF growth is negative (${sustainableGrowth.toFixed(1)}%). The DCF does not extrapolate that decline. It uses a 3-year normalized FCF base and a 0% forward-growth floor before fading toward terminal growth.`
     : "";
   mosAssumptions.innerHTML=`Starting FCF: conservative ${money(mosCases[0].start)} · base ${money(mosCases[1].start)} · favorable ${money(mosCases[2].start)}<br>Sustainable historical growth reference: ${sustainableGrowth.toFixed(1)}%. DCF forward-growth reference: ${dcfGrowthReference.toFixed(1)}%. Years 1–5 use 50% / 75% / 85% of the DCF growth reference, capped at 10%; years 6–10 fade toward terminal growth.${normalizationNote}<br>Discount rates: 11% / 10% / 9.5% · terminal growth: 2.0% / 2.5% / 2.75%. Equity value adds cash and short-term investments, subtracts debt, then divides by diluted shares.`;
 } else {
   mosGrid.innerHTML="";
   mosSummary.innerHTML="<b>Margin-of-safety estimate unavailable.</b> The report does not yet contain enough positive multi-year FCF, share-count, market-price and growth evidence to run the normalized valuation.";
   mosAssumptions.innerHTML="No missing inputs are estimated or substituted.";
 }


 // V49 earnings-power cross-check. This does not alter the DCF or evidence score.
 const niChron=[...years].filter(y=>y.net!=null&&y.net>0).reverse();
 const niRecent=niChron.slice(-3).map(y=>y.net);
 const latestNI=niChron.length?niChron.at(-1).net:null;
 const avgNI3=niRecent.length?niRecent.reduce((a,b)=>a+b,0)/niRecent.length:null;
 const weightedNI3=niRecent.length===3?(niRecent[0]*.2+niRecent[1]*.3+niRecent[2]*.5):avgNI3;
 const epxBox=document.getElementById("dvEpxBox");
 if(epxBox && weightedNI3>0 && shares>0 && mosCases){
   // Translate normalized earnings into a deliberately broad earnings-power value band.
   // 20x is the central cross-check multiple; 17x/23x are sensitivity markers.
   const epCon=(weightedNI3*17)/shares;
   const epBase=(weightedNI3*20)/shares;
   const epFav=(weightedNI3*23)/shares;
   const dcfBase=mosCases[1].value;
 window.ptDVValuation = {
   cautious: mosCases[0]?.value ?? null,
   normalized: mosCases[1]?.value ?? null,
   stronger: mosCases[2]?.value ?? null,
   marketPrice: price ?? null,
   marketImpliedGrowth: ptMarketImpliedGrowth,
   marketImpliedGrowthPct: ptMarketImpliedGrowth!=null ? ptMarketImpliedGrowth*100 : null
 };
   const gap=(dcfBase-epBase)/epBase*100;
   const absGap=Math.abs(gap);
   const confidence=absGap<=15?"Higher":(absGap<=30?"Moderate":"Low");
   const agreement=absGap<=15
      ?"The normalized earnings cross-check broadly supports the base DCF."
      : (gap>15
          ?"The base DCF is materially above the normalized earnings cross-check; review growth and terminal assumptions."
          :"The base DCF is materially below the normalized earnings cross-check; review cash-flow normalization.");
   const divergence=`${absGap.toFixed(1)}%`;
   epxBox.innerHTML=`<div class="dv-epx-title">Normalized earnings reference</div>
     Recency-weighted 3-year net income: <b>${money(weightedNI3)}</b><br>
     Earnings-power sensitivity: <b>${fmtVal(epCon)} / ${fmtVal(epBase)} / ${fmtVal(epFav)}</b> per share at 17× / 20× / 23× normalized earnings.<br>
     Base earnings-power reference: <b>${fmtVal(epBase)}</b> vs. base DCF <b>${fmtVal(dcfBase)}</b>.<br>
     <div style="margin-top:12px;padding:12px;border-radius:10px;background:var(--soft,#f4f7f5)">
       <b>Method agreement: ${confidence}</b><br>
       Method divergence: <b>${divergence}</b><br>
       <span style="color:var(--muted)">Method agreement describes how closely the normalized FCF and earnings-power estimates align; it does not measure business quality or predict returns.</span>
     </div>
     <div style="margin-top:10px"><b>${agreement}</b></div>
     <span style="color:var(--muted)">This is a valuation cross-check, not an additional score and not a buy/sell recommendation.</span>`;
 } else if(epxBox){
   epxBox.innerHTML=`<b>Cross-check unavailable.</b> The report does not contain enough positive multi-year net-income and share-count evidence.`;
 }

 const scoreRows=[
   ["Financial Strength",strengthScore,strengthMeasured,strengthWhy],
   ["Earning Power",earnScore,earnMeasured,earnWhy],
   ["Cash Generation & Quality",cashScore,cashMeasured,cashWhy],
   ["Capital Discipline",capitalScore,capitalMeasured,capitalWhy],
   ["Valuation",valScore,valMeasured,valWhy],
   // Margin of Safety is intentionally separate from the 100-point evidence score.
 ];
 document.getElementById("dvTotalScore").textContent=evidenceScore==null?"—":evidenceScore;
 const compEl=document.getElementById("dvCompleteness"); if(compEl) compEl.textContent=evidenceScore==null?"No evidence measured":`${completeness}% evidence complete · ${earnedTotal}/${measuredTotal} measured points earned`;
 document.getElementById("dvScoreRows").innerHTML=scoreRows.map(x=>{
   if(x[0]==="Margin of Safety") return `<div class="dv-score-row"><div><b>${x[0]}</b><small>${x[3]}</small></div><div class="dv-score-points dv-score-pending">Pending</div></div>`;
   const missing=20-x[2], lost=x[2]-x[1];
   const detail=lost>0?`${lost} measured point${lost===1?"":"s"} not earned under the category thresholds.`:"";
   const unavailable=missing>0?`${missing} point${missing===1?"":"s"} unscored because the required evidence is unavailable.`:"";
   const notes=[detail,unavailable].filter(Boolean).join(" ");
   return `<div class="dv-score-row"><div><b>${x[0]}</b><small>${x[3]}</small>${notes?`<small class="dv-deduction"><b>${missing?"Evidence note":"Why not 20/20"}:</b> ${notes}</small>`:""}</div><div class="dv-score-points ${x[2]===0?"dv-score-pending":""}">${x[2]===20?x[1]+"/20":x[1]+"/"+x[2]+" measured"}</div></div>`;
 }).join("");
 const gapEl=document.getElementById("dvScoreGaps"); if(gapEl) gapEl.innerHTML="";


 let strength="Balance-sheet evidence is incomplete in this response.";
 if(cash!=null&&debt!=null)strength=cash>=debt?`Cash of ${money(cash)} exceeds total debt of ${money(debt)}, providing a strong liquidity starting point.`:`Total debt of ${money(debt)} exceeds cash of ${money(cash)}. The next review should examine leverage, maturities and coverage.`;
 const cashText=fcf!=null?`Latest reported free cash flow is ${money(fcf)}${fcfMargin!=null?`, or about ${ratioPct(fcfMargin)} of revenue`:""}.`:"Free-cash-flow data was not available in the returned statement.";
 const earningsText=(net!=null&&revenue!=null)?`Latest reported net income is ${money(net)}, a net margin of about ${ratioPct(netMargin)}. Multi-year normalization is the next calculation layer.`:"Reported earnings data is incomplete.";
 const valText=(fcfYield!=null)?`At the returned market capitalization, latest reported free cash flow implies an FCF yield of about ${ratioPct(fcfYield)}. This is context, not yet a margin-of-safety estimate.`:"Valuation context needs additional market and cash-flow data.";
 document.getElementById("dvStrengthText").textContent=strength;document.getElementById("dvCashText").textContent=cashText;document.getElementById("dvEarningsText").textContent=earningsText;document.getElementById("dvValuationText").textContent=valText;
}
function openIssue(n){
  const titles={"001":"Global Ownership. Disciplined Balance.","002":"When diversification feels like it's failing"};
  alert(`Issue ${n}: ${titles[n]}The issue library entry is connected. Full publication content will be added before launch.`);
}

const DB={VTI:["Vanguard Total Stock Market ETF","Core"],VOO:["Vanguard S&P 500 ETF","Core"],VXUS:["Vanguard Total International Stock ETF","Diversifier"],AVUV:["Avantis U.S. Small Cap Value ETF","Tilt"],AVDV:["Avantis International Small Cap Value ETF","Tilt"],QQQM:["Invesco NASDAQ 100 ETF","Tilt"],SCHD:["Schwab U.S. Dividend Equity ETF","Income / Tilt"],AAPL:["Apple Inc.","Concentration"],MSFT:["Microsoft Corp.","Concentration"],BND:["Vanguard Total Bond Market ETF","Diversifier"],VNQ:["Vanguard Real Estate ETF","Diversifier / Tilt"],GLD:["SPDR Gold Shares","Diversifier"]};
let c=0;function saveWatch(){localStorage.setItem("pt_deep_value_watch","Example A");alert("Saved to your local Deep Value watchlist. Member accounts will sync this across devices.");}
function menu(){let x=document.getElementById("mobile");x.style.display=x.style.display==="block"?"none":"block"}
function closeMobileMenu(){const x=document.getElementById("mobile");if(x)x.style.display="none";}
document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll("#mobile a").forEach(a=>a.addEventListener("click",()=>closeMobileMenu()));
});
function addRow(t="",w=0){c++;let d=document.createElement("div");d.className="holding";d.innerHTML=`<span class="drag">⠿</span><input class="ticker" value="${t}" placeholder="Ticker" oninput="refresh(this)"><span class="security-name">${DB[t]?.[0]||"Search supported security"}<br><span class="tag">${DB[t]?.[1]||"Unclassified"}</span></span><div class="weightbox"><input class="weight" type="number" min="0" max="100" value="${w}" oninput="total()"><span class="pct">%</span></div><button class="remove" onclick="this.parentElement.remove();total()">×</button>`;document.getElementById("rows").appendChild(d);total()}
