window.ptCaptureResearchUniverse=ptCaptureResearchUniverse;

window.ptUniverseCandidate=ptUniverseCandidate;

/* V138 — ETFs are first-class Research Universe securities.
   Static fund identity/role can be stored immediately; dated market evidence is
   snapshotted only when it actually exists. Provider failure does not erase the
   last stored ETF evidence. */
function ptETFUniverseSnapshot(symbol,evidence,reason="portfolio"){
 const t=String(symbol||"").toUpperCase(), e=evidence||ptETFEvidence(t);
 if(!t||!e)return null;
 const hasMarket=ptETFEvidenceHasMarketData(e);
 return {
   symbol:t,
   securityType:"ETF",
   assetType:"fund",
   source:e.source||"Portfolio Thesis ETF Evidence",
   asOf:e.asOf||null,
   workflowState:"research",
   captureReason:reason,
   evidence:{
     performance:{...(e.performance||{})},
     trend:{...(e.trend||{})},
     fundamentals:{...(e.fundamentals||{})},
     signals:[...(e.signals||[])],
     evidenceQuestion:e.evidenceQuestion||null,
     stale:!!e.stale,
     hasDatedMarketEvidence:hasMarket
   }
 };
}
async function ptCaptureETFUniverse(symbol,evidence,reason="portfolio"){
 const snap=ptETFUniverseSnapshot(symbol,evidence,reason);
 if(!snap)return null;
 return ptCaptureResearchUniverse(snap);
}
async function ptHydrateETFUniverse(symbol){
 const t=String(symbol||"").toUpperCase();
 if(!ptETFIsEvidenceFund(t))return null;
 try{
   const d=await ptUniverseCandidate(t);
   const latest=(d?.history||[])[0]||null;
   const payload=latest?.payload||latest?.evidence||d?.security?.latest_payload||null;
   const e=payload?.evidence||payload;
   if(e&&typeof e==="object"){
     const clean={
       asOf:e.asOf||latest?.as_of||null,
       performance:{...PT_ETF_EVIDENCE[t].performance,...(e.performance||{})},
       trend:{...PT_ETF_EVIDENCE[t].trend,...(e.trend||{})},
       fundamentals:{...PT_ETF_EVIDENCE[t].fundamentals,...(e.fundamentals||{})},
       signals:Array.isArray(e.signals)&&e.signals.length?e.signals:PT_ETF_EVIDENCE[t].signals,
       evidenceQuestion:e.evidenceQuestion||PT_ETF_EVIDENCE[t].evidenceQuestion,
       source:latest?.source||d?.security?.source||"Research Universe",
       stale:true
     };
     Object.assign(PT_ETF_EVIDENCE[t],clean);
     return PT_ETF_EVIDENCE[t];
   }
 }catch(_){}
 return null;
}


// V134 — evidence-dense portfolio report cache. This is populated from the
// Research Universe before the publication is rendered so company evidence can
// inform Holding Intelligence and the Portfolio Analysis, not only the later company card.
window.PT_PORTFOLIO_COMPANY_EVIDENCE=window.PT_PORTFOLIO_COMPANY_EVIDENCE||{};
async function ptLoadPortfolioCompanyEvidence(portfolio){
 const inds=(portfolio||[]).filter(x=>ptReportRole(x.ticker)==="Individual position");
 await Promise.all(inds.map(async x=>{
  const t=String(x.ticker||"").toUpperCase();
  try{
   const d=await ptUniverseCandidate(t), sec=d?.security||null, latest=(d?.history||[])[0]||null;
   if(!sec&&!latest)return;
   const pe=latest?.payload?.evidence||latest?.payload||{}, pc=pe?.categories||latest?.payload?.categories||{};
   const val=(...a)=>{for(const v of a)if(v!==null&&v!==undefined&&v!==""&&Number.isFinite(Number(v)))return Number(v);return null};
   const cats={
    financial:val(latest?.financial_strength,pc?.financialStrength,pc?.financial_strength),
    earning:val(latest?.earning_power,pc?.earningPower,pc?.earning_power),
    cash:val(latest?.cash_generation,pc?.cashGeneration,pc?.cash_generation),
    capital:val(latest?.capital_discipline,pc?.capitalDiscipline,pc?.capital_discipline),
    valuation:val(latest?.valuation_score,pc?.valuation,pc?.valuation_score)
   };
   const price=val(sec?.latest_price,latest?.market_price), normalized=val(sec?.latest_normalized_value,latest?.normalized_value);
   const mos=val(sec?.latest_margin_of_safety,latest?.margin_of_safety,(price>0&&normalized>0)?((normalized-price)/normalized*100):null);
   window.PT_PORTFOLIO_COMPANY_EVIDENCE[t]={ticker:t,score:val(sec?.latest_evidence_score,latest?.evidence_score,pe?.evidenceScore,pe?.evidence_score),completeness:val(sec?.latest_completeness,latest?.completeness,pe?.completeness),price,normalized,mos,cats};
  }catch(_){ }
 }));
}

function ptHoldingTradeoff(ticker,role,weight){
 const t=String(ticker||"").toUpperCase(), w=Number(weight||0);
 const known={
  VTI:{owns:"Broad U.S. stocks weighted by market capitalization.",changes:"Establishes the U.S. market as the portfolio's default exposure; larger companies have the greatest influence.",gain:"Very broad U.S. ownership in one holding with little need to choose individual winners.",give:"Market-cap weighting does not deliberately emphasize smaller, cheaper, dividend-paying or other selected groups; whatever becomes largest in the market becomes more influential.",test:"The core should remain the exposure the investor actually wants as the portfolio's default U.S. allocation."},
  VOO:{owns:"Large U.S. companies represented by the S&P 500.",changes:"Makes large-cap U.S. businesses the portfolio's primary market exposure.",gain:"Broad exposure to established large U.S. companies.",give:"Less direct exposure to mid- and small-cap companies than a total-market core.",test:"The thesis depends on large-cap U.S. exposure remaining an intentional substitute for a broader total-market core."},
  VXUS:{owns:"Broad developed- and emerging-market stocks outside the U.S.",changes:"Adds a separate geographic earnings base, currencies and market valuations instead of relying only on U.S. companies.",gain:"Meaningful non-U.S. diversification and access to companies/economies not represented by a U.S.-only core.",give:"Adds currency, country and geopolitical risks and can trail U.S. stocks for long periods.",test:"The sleeve should remain meaningfully distinct from the U.S. core and the investor must be willing to hold it through long periods of relative underperformance."},
  AVUV:{owns:"U.S. small-cap value companies selected with value and profitability considerations.",changes:"Reweights U.S. exposure toward smaller and cheaper companies beyond their relatively small weights in a market-cap index such as VTI.",gain:"A deliberate small/value tilt and a return driver that can differ from large-cap-dominated market exposure.",give:"More tracking error, smaller-company risk and potentially long periods of underperformance versus the broad U.S. market.",test:"The thesis requires the small/value exposure to remain intentional even when large growth companies lead the market."},
  AVDV:{owns:"Developed ex-U.S. small-cap value companies with value/profitability characteristics.",changes:"Reweights international exposure toward smaller and cheaper companies rather than simply adding more broad international market weight.",gain:"Combines non-U.S. diversification with a deliberate small/value factor tilt.",give:"Adds small-company, currency and factor-cycle risk and can materially lag broad international or U.S. markets.",test:"The thesis requires both the international allocation and the small/value tilt to remain intentional through extended relative underperformance."},
  SCHD:{owns:"U.S. companies selected through a dividend-oriented methodology.",changes:"Reweights the U.S. market toward companies meeting dividend and related quality/sustainability screens rather than accepting market-cap weights.",gain:"Greater emphasis on shareholder distributions and the company characteristics produced by the dividend screen.",give:"Relatively less exposure to companies that do not fit the dividend methodology, including businesses that retain more capital for reinvestment and growth.",test:"The dividend tilt should be kept because its income/selection characteristics are wanted—not simply because its recent return or yield is attractive."},
  QQQM:{owns:"Large non-financial companies listed on Nasdaq through the Nasdaq-100.",changes:"Concentrates more capital in a narrower group of large growth-oriented businesses than a broad-market core.",gain:"Greater participation when those growth-heavy businesses lead.",give:"Less breadth and greater sensitivity to concentration and valuation compression in dominant growth companies.",test:"The added concentration must remain intentional even when the broad market or value-oriented companies lead."},
  BND:{owns:"A broad portfolio of U.S. investment-grade bonds.",changes:"Introduces a return driver based on interest income, rates and credit rather than company earnings alone.",gain:"Income and reduced dependence on equity-market outcomes.",give:"Lower long-run equity participation plus interest-rate and reinvestment risk.",test:"The bond allocation should match the portfolio's need for stability/income rather than being judged by whether it beats stocks."},
  VNQ:{owns:"Publicly traded U.S. real-estate investment trusts.",changes:"Creates a dedicated real-estate sleeve rather than relying on the smaller real-estate weight inside the broad equity market.",gain:"More direct exposure to real-estate cash flows and income characteristics.",give:"Sector concentration and sensitivity to rates, financing conditions and property cycles.",test:"Dedicated real-estate exposure must remain worth the added sector concentration."},
  GLD:{owns:"Gold exposure rather than operating-company cash flows.",changes:"Adds a non-equity asset whose return does not depend on corporate earnings in the same way stocks do.",gain:"A potentially different response to inflation, real rates, currency stress and risk-off environments.",give:"No operating earnings or dividend stream and potentially long periods of weak real returns.",test:"Gold should remain because the portfolio intentionally wants a non-earnings-based diversifier."}
 };
 if(known[t]) return known[t];
 if(String(role||"").toLowerCase().includes("income")) return {owns:"An income-oriented security or fund.",changes:"Shifts part of the portfolio away from pure market-cap weighting toward current distributions.",gain:"More emphasis on current income.",give:"Potentially less exposure to securities that reinvest rather than distribute cash.",test:"The income objective must remain more important than simply matching broad-market weights."};
 return {owns:"A distinct portfolio holding.",changes:`Adds a ${w.toFixed(0)}% allocation whose economic exposure should be evaluated against the rest of the portfolio.`,gain:"Potential diversification or intentional overweight if its underlying exposure is genuinely distinct.",give:"Additional complexity and possible overlap if it does not change the portfolio's underlying exposures.",test:"It should remain only if it performs a portfolio job that the other holdings do not already provide."};
}
function ptCompanyEvidenceSummary(t){
 const e=window.PT_PORTFOLIO_COMPANY_EVIDENCE?.[String(t||"").toUpperCase()]; if(!e)return null;
 const pairs=[["Financial Strength",e.cats?.financial],["Earning Power",e.cats?.earning],["Cash Generation & Quality",e.cats?.cash],["Capital Discipline",e.cats?.capital],["Valuation",e.cats?.valuation]].filter(x=>Number.isFinite(x[1]));
 const best=pairs.length?[...pairs].sort((a,b)=>b[1]-a[1])[0]:null, weak=pairs.length?[...pairs].sort((a,b)=>a[1]-b[1])[0]:null;
 return {...e,best,weak};
}

function ptHoldingCurrentEvidence(t){
 const x=String(t||"").toUpperCase();
 const live=ptETFEvidenceSummary(x);
 if(live)return live.text;
 const ce=ptCompanyEvidenceSummary(x);
 if(ce){
  const score=ce.score==null?"Evidence score unavailable":`${ce.score}/100 evidence`;
  const comp=ce.completeness==null?"":` · ${ce.completeness}% complete`;
  const best=ce.best?`${ce.best[0]} leads at ${ce.best[1]}/20.`:"";
  const weak=ce.weak?`${ce.weak[0]} is the lowest measured category at ${ce.weak[1]}/20.`:"";
  const val=ce.price>0&&ce.normalized>0?` Market $${ce.price.toFixed(2)} vs. $${ce.normalized.toFixed(2)} normalized value${Number.isFinite(ce.mos)?` (${ce.mos>=0?ce.mos.toFixed(1)+"% MOS":Math.abs(ce.mos).toFixed(1)+"% above normalized"})`:""}.`:"";
  return `${score}${comp}. ${best} ${weak}${val}`.trim();
 }
 const evidence={
  VTI:"Current performance and trend data should test whether broad U.S. market strength is supported by earnings breadth, not just a narrow group of mega-cap leaders.",
  VOO:"Current performance and trend data should be read alongside S&P 500 earnings breadth, valuation and mega-cap concentration.",
  VXUS:"Current evidence should compare non-U.S. performance, earnings breadth, valuation spreads and currency effects with the U.S. market.",
  AVUV:"Current evidence should track small-value relative performance, valuation spreads, profitability and credit conditions rather than price momentum alone.",
  AVDV:"Current evidence should track developed ex-U.S. small-value performance, valuation, profitability and currency effects.",
  QQQM:"Current evidence should separate earnings-driven strength from valuation expansion and monitor concentration in the largest growth companies.",
  SCHD:"Current evidence should combine total return, dividend growth, quality fundamentals and sector leadership rather than focusing on yield alone.",
  BND:"Current evidence should focus on yield, duration, rate changes, credit conditions and total-return behavior versus equities.",
  VNQ:"Current evidence should combine REIT earnings/cash-flow conditions, financing costs, occupancy fundamentals and interest-rate sensitivity.",
  GLD:"Current evidence should focus on real yields, currency conditions, inflation expectations and gold's diversification behavior."
 };
 return evidence[x]||"Current market evidence should be evaluated against the holding's assigned portfolio role. Price movement alone does not establish that the thesis strengthened or weakened.";
}
function ptHoldingLessonTakeaway(t,role){
 const x=String(t||"").toUpperCase();
 const m={
  VTI:"Broad ownership is not the same as equal exposure. Market-cap weighting means the largest companies can still drive a diversified fund.",
  VOO:"Two broad U.S. funds can own many of the same companies. More tickers do not necessarily create more diversification.",
  VXUS:"Geographic diversification can lag for long periods and still remain structurally distinct because the underlying countries, currencies and valuations differ.",
  AVUV:"A factor tilt is expected to behave differently from the market. Tracking error is part of the exposure, not automatically evidence that it failed.",
  AVDV:"This sleeve combines two decisions—international diversification and a small/value tilt—so both sources of difference should be understood.",
  QQQM:"A growth-heavy fund beside a broad U.S. core is usually an overweight to exposures already owned, not a separate core.",
  SCHD:"Dividend yield is only one part of return. Quality, dividend durability and sector concentration determine what an income tilt actually adds.",
  BND:"Bonds can add stability and rebalancing capacity even when their expected return is lower than equities; their job differs from an equity sleeve.",
  VNQ:"Owning a sector separately from a total-market fund deliberately increases that sector's effective portfolio weight.",
  GLD:"An asset without business cash flows needs a clearly defined portfolio job because its evidence differs from stock and bond fundamentals."
 };
