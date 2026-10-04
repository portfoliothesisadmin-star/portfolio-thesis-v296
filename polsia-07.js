// V58 — publication-style report opened by Analyze My Portfolio.
function ptEsc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function ptReportRole(t){
  const x=String(t||"").toUpperCase();
  if(["VTI","VOO"].includes(x)) return "Core";
  if(["VXUS","BND","VNQ","GLD"].includes(x)) return "Diversifier";
  if(["AVUV","AVDV","QQQM","SCHD"].includes(x)) return "Tilt";
  return "Individual position";
}
function ptTickerLesson(t,role,weight){
 const x=String(t||"").toUpperCase(),w=Number(weight||0);
 const map={
  VTI:["Broad U.S. market ownership","Adds thousands of U.S. companies across sizes; it is a foundation rather than a single-company bet.","Because many direct U.S. stocks are already inside VTI, adding one separately usually creates an overweight.","Market breadth, mega-cap concentration and whether the core still represents the intended U.S. exposure."],
  VOO:["Large-cap U.S. ownership","Adds exposure to leading U.S. large companies through the S&P 500.","A direct large-cap holding may already be inside VOO, so the direct position changes concentration more than diversification.","Large-company concentration, valuation and whether the sleeve still fits the intended core job."],
  VXUS:["Geographic diversification","Adds developed and emerging non-U.S. companies, changing geography, currency and valuation exposure.","Its value is not that it must beat U.S. stocks each year; it gives the portfolio a different earnings and market base.","International earnings breadth, valuation spreads, currency effects and whether diversification remains distinct."],
  AVUV:["Small-cap value factor exposure","Adds smaller, cheaper U.S. companies with profitability screens rather than simply adding more of the broad market.","This is a deliberate factor tilt and can behave very differently from a cap-weighted core for long periods.","Valuation spread, small-company profitability, credit conditions and tolerance for tracking error."],
  AVDV:["International small-value exposure","Combines geographic diversification with small-cap/value factor exposure outside the U.S.","It changes more than geography: size and value characteristics can create a return path unlike a broad international fund.","Factor valuation, profitability, currency and whether the added complexity remains intentional."],
  QQQM:["Growth / Nasdaq concentration","Adds a heavier emphasis on large growth-oriented Nasdaq companies.","Much of the exposure can overlap a U.S. core, so its main effect is usually a deliberate growth/technology overweight.","Overlap, valuation, sector concentration and whether the overweight remains intentional."],
  SCHD:["Dividend-quality tilt","Adds a rules-based emphasis on dividend-paying U.S. companies with quality characteristics.","It changes company weights and style exposure more than geography; diversification should be judged against the existing U.S. core.","Sector concentration, dividend durability, quality metrics and overlap with the core."],
  BND:["Bond diversification","Adds investment-grade fixed income, changing the portfolio's source of return and expected volatility.","Unlike another stock fund, bonds can provide a genuinely different risk exposure, though rate and credit sensitivity still matter.","Duration, yields, credit quality and the role bonds are expected to play during equity stress."],
  VNQ:["Real-estate sector exposure","Adds concentrated listed real-estate exposure and a different sensitivity to rates and property fundamentals.","REITs may already exist in broad equity funds; a dedicated sleeve is an intentional sector overweight.","Rates, property fundamentals, leverage and effective real-estate exposure across the whole portfolio."],
  GLD:["Gold exposure","Adds an asset whose drivers differ from corporate earnings and cash flow.","Its portfolio job is diversification rather than business compounding, so it should be judged by the role assigned to it.","Real rates, currency conditions, allocation size and whether the diversification objective remains relevant."]
 };
 let a=map[x];
 if(!a&&role==="Individual position") a=["Company-specific selection",`At ${w.toFixed(0)}%, ${x} adds a direct company outcome to the portfolio.`,"If the company is already held inside a broad ETF, the direct position is an intentional overweight—not an entirely new source of diversification.","Fundamentals, cash generation, valuation, capital discipline and total direct + indirect exposure."];
 if(!a) a=["Defined portfolio exposure",`${x} changes the portfolio only to the extent that its underlying holdings and risk drivers differ from what is already owned.`,"A new ticker is not automatically a new source of diversification; underlying exposure is what matters.","Role, overlap, concentration and whether the holding continues to do a distinct job."];
 return {lesson:a[0],adds:a[1],relationship:a[2],watch:a[3]};
}
function ptTickerLearningBlock(t,role,weight){const l=ptTickerLesson(t,role,weight);return `<div class="ptr-ticker-learning"><div class="ptr-ticker-learning-head"><b>${ptEsc(t)}</b><span>Learn from this holding · ${ptEsc(l.lesson)}</span></div><div class="ptr-ticker-learning-body"><div><em>What it truly adds</em><p>${ptEsc(l.adds)}</p></div><div><em>How it interacts</em><p>${ptEsc(l.relationship)}</p></div><div><em>Evidence to monitor</em><p>${ptEsc(watch)}</p></div></div></div>`;}


/* V118 — reusable ETF Evidence Engine
   One evidence object can feed Holding Intelligence, Portfolio Analysis,
   Fund Research and future Issues. Unknown/current market values
   stay null until a real dated data source populates them. */
const PT_ETF_EVIDENCE = {
 VTI:{asOf:null,performance:{ytd:null,oneYear:null,threeYear:null,fiveYear:null},trend:{price:null,relative:null,breadth:null},
  fundamentals:{valuation:null,earnings:null,profitability:null},
  signals:["U.S. earnings breadth","Mega-cap concentration","Valuation","Rate / discount-rate conditions"],
  evidenceQuestion:"Is broad U.S. market strength being confirmed by earnings breadth, or increasingly driven by a narrow group of large companies?"},
 VOO:{asOf:null,performance:{ytd:null,oneYear:null,threeYear:null,fiveYear:null},trend:{price:null,relative:null,breadth:null},
  fundamentals:{valuation:null,earnings:null,profitability:null},
  signals:["S&P 500 earnings breadth","Mega-cap concentration","Valuation","Rate / discount-rate conditions"],
  evidenceQuestion:"Are S&P 500 gains being supported by broad earnings growth, or becoming more dependent on valuation and the largest constituents?"},
 VXUS:{asOf:null,performance:{ytd:null,oneYear:null,threeYear:null,fiveYear:null},trend:{price:null,relative:null,breadth:null},
  fundamentals:{valuation:null,earnings:null,profitability:null},
  signals:["International earnings breadth","U.S. vs ex-U.S. valuation spread","Currency","Regional leadership"],
  evidenceQuestion:"Is the diversification and valuation case gaining fundamental confirmation through broader non-U.S. earnings and market participation?"},
 AVUV:{asOf:null,performance:{ytd:null,oneYear:null,threeYear:null,fiveYear:null},trend:{price:null,relative:null,breadth:null},
  fundamentals:{valuation:null,earnings:null,profitability:null},
  signals:["Small-value relative performance","Profitability","Credit conditions","Value spread"],
  evidenceQuestion:"Is small-value performance being supported by profitability and healthy credit conditions rather than only a liquidity-driven rerating?"},
 AVDV:{asOf:null,performance:{ytd:null,oneYear:null,threeYear:null,fiveYear:null},trend:{price:null,relative:null,breadth:null},
  fundamentals:{valuation:null,earnings:null,profitability:null},
  signals:["Developed ex-U.S. small-value breadth","Profitability","Value spread","Currency"],
  evidenceQuestion:"Are international small-value fundamentals confirming the factor and geographic diversification case?"},
 QQQM:{asOf:null,performance:{ytd:null,oneYear:null,threeYear:null,fiveYear:null},trend:{price:null,relative:null,breadth:null},
  fundamentals:{valuation:null,earnings:null,profitability:null},
  signals:["Growth earnings revisions","Valuation","Top-holding concentration","Market breadth"],
  evidenceQuestion:"Is growth leadership being driven by durable earnings evidence or increasingly by multiple expansion and concentration?"},
 SCHD:{asOf:null,performance:{ytd:null,oneYear:null,threeYear:null,fiveYear:null},trend:{price:null,relative:null,breadth:null},
  fundamentals:{valuation:null,earnings:null,profitability:null},
  signals:["Dividend growth","Dividend coverage / quality","Sector leadership","Valuation"],
  evidenceQuestion:"Are dividend growth and quality fundamentals supporting the income thesis beyond the headline yield?"},
 BND:{asOf:null,performance:{ytd:null,oneYear:null,threeYear:null,fiveYear:null},trend:{price:null,relative:null,breadth:null},
  fundamentals:{valuation:null,earnings:null,profitability:null},
  signals:["Yield level","Duration","Fed / rate path","Credit spreads"],
  evidenceQuestion:"Are yield and duration conditions improving or weakening the bond sleeve's stabilizing and income role?"},
 VNQ:{asOf:null,performance:{ytd:null,oneYear:null,threeYear:null,fiveYear:null},trend:{price:null,relative:null,breadth:null},
  fundamentals:{valuation:null,earnings:null,profitability:null},
  signals:["REIT cash-flow trends","Financing costs","Occupancy / property fundamentals","Rates"],
  evidenceQuestion:"Are property fundamentals strong enough to offset financing-cost and rate sensitivity?"},
 GLD:{asOf:null,performance:{ytd:null,oneYear:null,threeYear:null,fiveYear:null},trend:{price:null,relative:null,breadth:null},
  fundamentals:{valuation:null,earnings:null,profitability:null},
  signals:["Real yields","U.S. dollar","Inflation expectations","Diversification behavior"],
  evidenceQuestion:"Are macro conditions supporting gold's diversification role, and is it behaving differently enough from risk assets to justify that role?"}
};
function ptETFIsEvidenceFund(t){return !!PT_ETF_EVIDENCE[String(t||"").toUpperCase()]}
function ptETFEvidence(t){return PT_ETF_EVIDENCE[String(t||"").toUpperCase()]||null}
function ptFmtEvidencePct(v){return Number.isFinite(Number(v))?`${Number(v).toFixed(1)}%`:"—"}
function ptETFEvidenceHasMarketData(e){
 if(!e)return false;
 const vals=[...(Object.values(e.performance||{})),...(Object.values(e.trend||{})),...(Object.values(e.fundamentals||{}))];
 return vals.some(v=>v!==null&&v!==undefined&&v!=="");
}
function ptETFEvidenceSummary(t){
 const e=ptETFEvidence(t);
 if(!e)return null;
 const has=ptETFEvidenceHasMarketData(e);
 if(!has)return {status:"Awaiting dated market data",asOf:"Not populated",text:e.evidenceQuestion,signals:e.signals};
 const p=e.performance||{};
 const bits=[];
 if(p.ytd!=null)bits.push(`YTD ${ptFmtEvidencePct(p.ytd)}`);
 if(p.oneYear!=null)bits.push(`1Y ${ptFmtEvidencePct(p.oneYear)}`);
 if(p.threeYear!=null)bits.push(`3Y ann. ${ptFmtEvidencePct(p.threeYear)}`);
 return {status:e.stale?"Cached evidence":"Current evidence",asOf:e.asOf||"Date unavailable",text:bits.length?`${bits.join(" · ")}. ${e.evidenceQuestion}`:e.evidenceQuestion,signals:e.signals};
}
window.PT_ETF_EVIDENCE=PT_ETF_EVIDENCE;

window.ptETFEvidence=ptETFEvidence;

/* V119 — live ETF evidence adapter.
   Expected Supabase Edge Function: etf-evidence-data
   Request:  POST {symbol}
   Response: {symbol,asOf,performance:{ytd,oneYear,threeYear,fiveYear},
              trend:{price,relative,breadth},
              fundamentals:{valuation,earnings,profitability},
              signals:[],evidenceQuestion:""}
   The browser never receives the FMP key. */
const PT_ETF_EVIDENCE_FUNCTION="etf-evidence-data";
const PT_ETF_EVIDENCE_CACHE_MS=6*60*60*1000;
async function ptFetchETFEvidence(symbol,{force=false}={}){
 const t=String(symbol||"").trim().toUpperCase();
 if(!ptETFIsEvidenceFund(t))return null;
 const key=`pt_etf_evidence_${t}`;
 if(!force){
  try{
   const cached=JSON.parse(localStorage.getItem(key)||"null");
   if(cached&&cached.savedAt&&(Date.now()-cached.savedAt)<PT_ETF_EVIDENCE_CACHE_MS&&cached.data){
    Object.assign(PT_ETF_EVIDENCE[t],cached.data);
    try{ptCaptureETFUniverse(t,PT_ETF_EVIDENCE[t],"cache").catch(()=>{});}catch(_){}
    return PT_ETF_EVIDENCE[t];
   }
  }catch(_){}
 }
 if(!window.ptSupabase?.functions?.invoke)return PT_ETF_EVIDENCE[t];
 try{
  const {data,error}=await window.ptSupabase.functions.invoke(PT_ETF_EVIDENCE_FUNCTION,{body:{symbol:t}});
  if(error||!data)throw error||new Error("No ETF evidence returned");
  const clean={
   asOf:data.asOf||data.as_of||null,
   performance:{...PT_ETF_EVIDENCE[t].performance,...(data.performance||{})},
   trend:{...PT_ETF_EVIDENCE[t].trend,...(data.trend||{})},
   fundamentals:{...PT_ETF_EVIDENCE[t].fundamentals,...(data.fundamentals||{})},
   signals:Array.isArray(data.signals)&&data.signals.length?data.signals:PT_ETF_EVIDENCE[t].signals,
   evidenceQuestion:data.evidenceQuestion||data.evidence_question||PT_ETF_EVIDENCE[t].evidenceQuestion,
   source:data.source||"FMP",
   stale:!!data.stale
  };
  Object.assign(PT_ETF_EVIDENCE[t],clean);
  try{localStorage.setItem(key,JSON.stringify({savedAt:Date.now(),data:clean}))}catch(_){}
  ptCaptureETFUniverse(t,clean,"live-evidence").catch(()=>{});
  return PT_ETF_EVIDENCE[t];
 }catch(err){
  console.warn("ETF evidence unavailable",t,err);
  try{
    const stored=await ptHydrateETFUniverse(t);
    if(stored)return stored;
    // Store the fund as an ETF research record even when the live provider is
    // unavailable. Null market fields remain null; no evidence is fabricated.
    ptCaptureETFUniverse(t,PT_ETF_EVIDENCE[t],"discovered").catch(()=>{});
  }catch(_){}
  return PT_ETF_EVIDENCE[t];
 }
}
async function ptLoadPortfolioETFEvidence(portfolio,{force=false}={}){
 const tickers=[...new Set((portfolio||[]).map(x=>String(x.ticker||"").toUpperCase()).filter(ptETFIsEvidenceFund))];
 // First hydrate institutional memory, then refresh sequentially to protect provider limits.
 for(const t of tickers){
   try{await ptHydrateETFUniverse(t);}catch(_){}
   await ptFetchETFEvidence(t,{force});
 }
 return tickers;
}
window.ptFetchETFEvidence=ptFetchETFEvidence;

window.ptLoadPortfolioETFEvidence=ptLoadPortfolioETFEvidence;

/* V120 — Portfolio Thesis Research Universe
   Internal, non-personal security memory. Member identity/watchlist membership
   is never written into this research record. */
const PT_RESEARCH_UNIVERSE_FUNCTION="research-universe";
async function ptCaptureResearchUniverse(snapshot){
 if(!snapshot?.symbol||!window.ptSupabase?.functions?.invoke)return null;
 try{
  const {data,error}=await window.ptSupabase.functions.invoke(PT_RESEARCH_UNIVERSE_FUNCTION,{
   body:{action:"capture",snapshot}
  });
  if(error)throw error;
  return data;
 }catch(e){console.warn("Research Universe capture unavailable",e);return null}
}
async function ptUniverseCandidate(symbol){
 if(!symbol||!window.ptSupabase?.functions?.invoke)return null;
 try{
  const {data,error}=await window.ptSupabase.functions.invoke(PT_RESEARCH_UNIVERSE_FUNCTION,{
   body:{action:"get",symbol:String(symbol).toUpperCase()}
  });
  if(error)throw error; return data;
 }catch(e){return null}
}
