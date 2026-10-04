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
 return m[x]||(role==="Individual position"?"A direct stock should be judged as an intentional company-specific exposure, including any indirect ownership already present through funds.":"The useful question is not whether the ticker is different, but whether its underlying exposure is different.");
}
function ptHoldingIntelligenceCard(x){
 const t=String(x.ticker||"").toUpperCase(), w=Number(x.weight||0), role=ptReportRole(t);
 const prof=(typeof RESEARCH_PROFILES!=="undefined"&&RESEARCH_PROFILES[t])?RESEARCH_PROFILES[t]:null;
 const l=ptTickerLesson(t,role,w);
 const job=role==="Individual position"?"Company-specific return driver; company-level evidence is required.":(prof?.why||l.adds||"Defined portfolio sleeve.");
 const relationship=prof?.relationships||l.relationship;
 const current=ptHoldingCurrentEvidence(t);
 const ce=ptCompanyEvidenceSummary(t);
 const watch=ce?(ce.weak?`${ce.weak[0]} is currently the weakest measured category at ${ce.weak[1]}/20. Re-test that category alongside cash generation and valuation as new financials arrive.`:`Re-test fundamentals, cash generation and valuation when new company evidence arrives.`):l.watch;
 const takeaway=ptHoldingLessonTakeaway(t,role);
 return `<div class="ptr-intel-card">
  <div class="ptr-intel-head"><b>${ptEsc(t)} <small>${w.toFixed(0)}%</small></b><span>${ptEsc(role)} · Holding intelligence</span></div>
  <div class="ptr-intel-grid">
   <div class="ptr-intel-cell"><em>Job in the portfolio</em><strong>${ptEsc(job)}</strong><p>${ptEsc(l.adds)}</p></div>
   <div class="ptr-intel-cell"><em>What it changes here</em><strong>Interaction / overlap</strong><p>${ptEsc(relationship)}</p></div>
   <div class="ptr-intel-cell ptr-intel-evidence"><em>Current evidence</em>${(()=>{const ev=ptETFEvidenceSummary(t),ce=ptCompanyEvidenceSummary(t);return ev?`<span class="status">${ptEsc(ev.status)} · ${ptEsc(ev.asOf)}</span>`:ce?`<span class="status">${ce.score??"—"}/100 · ${ce.completeness??"—"}% complete</span>`:`<span class="status">Company evidence unavailable</span>`})()}<p>${ptEsc(current)}</p>${(()=>{const ev=ptETFEvidenceSummary(t);return ev&&ev.signals?.length?`<p style="margin-top:6px"><b>Signals:</b> ${ev.signals.map(ptEsc).join(" · ")}</p>`:""})()}</div>
   <div class="ptr-intel-cell"><em>Evidence to watch</em><strong>What could change the interpretation</strong><p>${ptEsc(l.watch)}</p></div>
  </div>
  <div class="ptr-intel-lesson"><b>Learn from this holding</b><p>${ptEsc(takeaway)}</p></div>
 </div>`;
}


function ptLensETFLine(t){
 const ev=ptETFEvidenceSummary(String(t||"").toUpperCase());
 if(!ev)return null;
 const bits=[];
 if(ev.asOf)bits.push(`as of ${ptEsc(ev.asOf)}`);
 if(ev.signals?.length)bits.push(ev.signals.slice(0,2).map(ptEsc).join(" · "));
 return `${ptEsc(String(t).toUpperCase())}${bits.length?` — ${bits.join(" · ")}`:""}`;
}
function ptLensMeasuredETF(p){
 return (p||[]).map(x=>ptLensETFLine(x.ticker)).filter(Boolean);
}
function ptLensCompanyFacts(){
 const ce=window.__ptLensCE||[];
 return ce.map(x=>{
   const e=x.e, facts=[];
   if(Number.isFinite(e.score))facts.push(`${e.score}/100`);
   if(Number.isFinite(e.completeness))facts.push(`${e.completeness}% complete`);
   if(e.price>0&&e.normalized>0){
     facts.push(`$${e.price.toFixed(2)} market / $${e.normalized.toFixed(2)} normalized`);
     if(Number.isFinite(e.mos))facts.push(e.mos>=0?`${e.mos.toFixed(1)}% MOS`:`${Math.abs(e.mos).toFixed(1)}% above normalized`);
   }
   if(e.best)facts.push(`strongest: ${e.best[0]} ${e.best[1]}/20`);
   if(e.weak)facts.push(`weakest: ${e.weak[0]} ${e.weak[1]}/20`);
   return `${ptEsc(x.t)} — ${facts.join(" · ")}`;
 });
}
async function ptLoadPortfolioAnalysis(p){
  try{
    if(!window.ptSupabase?.functions?.invoke) return null;
    const holdings=(p||[]).map(x=>({ticker:String(x.ticker||"").toUpperCase(),weight:Number(x.weight||0)})).filter(x=>x.ticker&&x.weight>0);
    const {data,error}=await window.ptSupabase.functions.invoke("portfolio-analysis",{body:{holdings}});
    if(error) throw error;
    window.__ptPortfolioAnalysis=data||null; return data||null;
  }catch(e){console.warn("Portfolio look-through unavailable",e);window.__ptPortfolioAnalysis=null;return null;}
}
function ptLookthroughFacts(){
 const a=window.__ptPortfolioAnalysis||{}, c=a.concentration||{};
 const largest=c.largestEffectiveCompany||a.largestEffectiveCompany||null;
 const overlaps=Array.isArray(a.overlap)?a.overlap:(Array.isArray(a.overlaps)?a.overlaps:[]);
 const largestOverlap=overlaps.filter(x=>Number.isFinite(Number(x.weightedOverlapPct))).sort((x,y)=>Number(y.weightedOverlapPct)-Number(x.weightedOverlapPct))[0]||null;
 return {largest,overlaps,largestOverlap};
}
function ptFmtLookthroughConcentration(){
 const f=ptLookthroughFacts(),z=[];
 if(f.largest&&Number.isFinite(Number(f.largest.effectiveWeight)))z.push(`${ptEsc(String(f.largest.ticker||f.largest.name||"Largest company"))} is the largest measured underlying company exposure at ${Number(f.largest.effectiveWeight).toFixed(1)}%`);
 if(f.largestOverlap)z.push(`${ptEsc(String(f.largestOverlap.baseFund||"Fund"))} / ${ptEsc(String(f.largestOverlap.comparisonFund||"fund"))} weighted overlap is ${Number(f.largestOverlap.weightedOverlapPct).toFixed(1)}% across ${Number(f.largestOverlap.sharedHoldingsCount||0).toLocaleString()} shared holdings`);
 return z.length?z.join(". ")+".":null;
}
function ptFmtLookthroughDiversification(){
 const m=ptLookthroughFacts().overlaps.filter(x=>Number.isFinite(Number(x.weightedOverlapPct))); if(!m.length)return null;
 const lo=[...m].sort((a,b)=>Number(a.weightedOverlapPct)-Number(b.weightedOverlapPct))[0];
 return `${ptEsc(String(lo.baseFund||"Fund"))} / ${ptEsc(String(lo.comparisonFund||"fund"))} share ${Number(lo.sharedHoldingsCount||0).toLocaleString()} measured holdings with ${Number(lo.weightedOverlapPct).toFixed(1)}% weighted overlap.`;
}
async function ptGeneratePortfolioPublication(){
  // V145 — Issue 001 report architecture. The publication is the product;
  // diagnostics remain behind the scenes.
  try{
    const portfolioName=String(window.ptActivePortfolioName||ptCurrentPortfolioName?.()||"My Portfolio");
    window.ptActivePortfolioName=portfolioName;
    const p=getPortfolio().filter(x=>Number(x.weight)>0);
    if(!p.length) return;
    try{await ptLoadPortfolioAnalysis(p);}catch(_){}
    try{await ptLoadPortfolioCompanyEvidence(p);}catch(_){}
    try{ptLoadPortfolioETFEvidence(p).catch(()=>{});}catch(_){}
    const E=ptEsc;
    const info={
      VTI:{name:"Vanguard Total Stock Market ETF",job:"Broad U.S. core",thesis:"Broad U.S. ownership is the portfolio's default equity engine. Market-cap weighting gives the largest companies the greatest influence, so the core is broad without being equal-weighted.",adds:"Broad U.S. ownership and a simple market-cap foundation.",trade:"It accepts the market's weights rather than deliberately emphasizing small, value, dividend or other characteristics.",work:["U.S. earnings breadth","Profitability of the broad market","Simple broad-market implementation"],watch:["Broad U.S. valuation","Mega-cap concentration","Earnings revisions"]},
      VXUS:{name:"Vanguard Total International Stock ETF",job:"Global diversifier",thesis:"VXUS changes the portfolio's earnings, currency, sector and valuation base by owning companies outside the U.S. Its thesis does not require international stocks to beat the U.S. every year.",adds:"A separate non-U.S. economic and valuation base.",trade:"Currency, country and geopolitical risks, plus the possibility of trailing U.S. stocks for long periods.",work:["Geographic diversification","Developed + emerging breadth","Different sector/currency mix"],watch:["International earnings breadth","U.S. vs ex-U.S. valuation spread","Currency/geopolitical risk"]},
      AVUV:{name:"Avantis U.S. Small Cap Value ETF",job:"U.S. small-value tilt",thesis:"AVUV deliberately raises the influence of smaller, cheaper U.S. companies with profitability considerations. VTI already owns many of these companies; AVUV matters because it changes their weight.",adds:"A deliberate small/value return driver beyond the market-cap baseline.",trade:"More tracking error, smaller-company risk and potentially years of underperformance when large growth leads.",work:["Small/value reweighting","Profitability-aware selection","Less dependence on large-growth leadership"],watch:["Small-company profitability","Credit/financing conditions","Small-value valuation spread"]},
      AVDV:{name:"Avantis International Small Cap Value ETF",job:"International small-value tilt",thesis:"AVDV changes both geography and style. It gives smaller, value-oriented developed-market companies more influence than they receive in a broad international market-cap portfolio.",adds:"Non-U.S. diversification plus a deliberate small/value factor tilt.",trade:"Currency, small-company and factor-cycle risk with potentially long relative underperformance.",work:["Developed ex-U.S. small/value exposure","Profitability-aware selection","Different geography + factor mix"],watch:["International small-company profitability","Currency/financing conditions","International small-value valuation spread"]},
      SCHD:{name:"Schwab U.S. Dividend Equity ETF",job:"Dividend / income tilt",thesis:"SCHD changes the thesis by reweighting toward companies that pass dividend-oriented selection screens. The important effect is which businesses receive more capital—not simply the cash distribution.",adds:"More income orientation and the quality/value characteristics produced by the screen.",trade:"Relatively less exposure to businesses that retain more capital for reinvestment and growth, plus possible sector concentration.",work:["Dividend sustainability","Cash-generating mature businesses","Income-oriented selection"],watch:["Dividend quality","Sector concentration","Relative valuation"]},
      QQQM:{name:"Invesco NASDAQ 100 ETF",job:"Growth tilt",thesis:"QQQM deliberately increases exposure to a narrower group of large growth-oriented businesses relative to a broad-market core.",adds:"More participation when dominant growth companies lead.",trade:"Greater concentration and greater sensitivity to the valuation paid for future growth.",work:["Growth leadership","Earnings expectations","Intentional overweight"],watch:["Top-holding concentration","Growth valuation","Earnings revisions"]}
    };
    const rows=p.map(x=>{const t=String(x.ticker).toUpperCase();const role=ptReportRole(t);const z=info[t]||{name:t,job:role,thesis:`${t} is a ${Number(x.weight).toFixed(0)}% holding. Its value to the portfolio depends on whether it adds an exposure that is economically distinct from the other holdings.`,adds:"Potentially distinct exposure.",trade:"Additional complexity or overlap if its portfolio job is not distinct.",work:["Underlying exposure"],watch:["Valuation","Overlap","Fundamental evidence"]};return {t,w:Number(x.weight),z}});
    const core=rows.filter(x=>/core/i.test(x.z.job)).reduce((a,x)=>a+x.w,0);
    const intl=rows.filter(x=>["VXUS","AVDV"].includes(x.t)).reduce((a,x)=>a+x.w,0);
    const tilts=rows.filter(x=>/tilt|dividend|income|growth/i.test(x.z.job)).reduce((a,x)=>a+x.w,0);
    const sv=rows.some(x=>["AVUV","AVDV"].includes(x.t)), div=rows.some(x=>x.t==="SCHD"), growth=rows.some(x=>x.t==="QQQM");
    const lesson=sv?"This portfolio deliberately combines market-cap ownership with small/value reweighting. VTI and VXUS let market prices determine company weights; AVUV and AVDV deliberately give smaller, cheaper companies more influence. The potential benefit is a different source of return and less dependence on large-growth leadership. The cost is tracking error and the possibility of lagging the broad market for years.":div?"The dividend sleeve changes which companies receive more of the portfolio. That can increase income and mature cash-generating exposure, while relatively reducing exposure to companies that retain more capital for reinvestment and growth.":growth?"The growth sleeve increases dependence on companies whose valuations rely more heavily on future growth expectations. That can increase upside participation when growth leads and increase sensitivity when valuations compress.":"Each holding should earn its place by adding a distinct economic exposure, not merely another ticker.";
    const page=(body,n,cls="")=>`<section class="pti-page ${cls}">${body}<div class="pti-foot">PORTFOLIO THESIS <b>${String(n).padStart(2,"0")}</b></div></section>`;
    let n=1;
    let html=`<div class="pti-report">`;
    html+=page(`<div class="pti-k">GENERATED PORTFOLIO REPORT</div><h1>${E(portfolioName)}</h1><h3>Prices changed. Did the thesis?</h3><div class="pti-alloc">${rows.map(x=>`<span>${E(x.t)} ${x.w.toFixed(0)}%</span>`).join("")}</div><div class="pti-hero"><small>CURRENT PORTFOLIO THESIS</small><p>${core?`${core.toFixed(0)}% is assigned to the identified broad core. `:""}${intl?`${intl.toFixed(0)}% is explicitly non-U.S. exposure. `:""}${tilts?`${tilts.toFixed(0)}% deliberately changes the market-cap baseline through factor, style, income or growth exposure. `:""}The report tests whether each holding is still doing a distinct job and whether the evidence supporting that job has changed.</p></div><div class="pti-flow"><b>PRICE MOVES</b><i>→</i><b>EVIDENCE CHANGES</b><i>→</i><b>THESIS</b></div>`,n++,"pti-cover");
    html+=page(`<div class="pti-k">EXECUTIVE BRIEF</div><h2>What this portfolio is really asking you to believe.</h2><p class="pti-lead">${E(lesson)}</p><div class="pti-brief">${rows.map(x=>`<div><b>${E(x.t)}</b><span>${E(x.z.job)}</span><p>${E(x.z.thesis)}</p></div>`).join("")}</div><div class="pti-bottom"><small>BOTTOM LINE</small><p>${sv?"The portfolio is not simply diversified by geography. It deliberately reweights part of the market toward small/value companies. That creates a different return pattern from a pure market-cap portfolio and requires patience when large growth leads.":div?"The income orientation is a structural choice and should be judged by the characteristics it creates, not by yield alone.":growth?"The growth overweight can improve participation in growth-led markets while increasing concentration and valuation risk.":"The portfolio should retain a holding only when its economic job remains distinct and intentional."}</p></div>`,n++);
    html+=page(`<div class="pti-k">PORTFOLIO STRATEGY</div><h2>One portfolio. Different jobs.</h2><div class="pti-jobbar">${rows.map(x=>`<div style="flex:${Math.max(x.w,5)}"><b>${E(x.t)}</b><small>${x.w.toFixed(0)}%</small></div>`).join("")}</div><div class="pti-jobs">${rows.map(x=>`<div><b>${E(x.t)} — ${E(x.z.job)}</b><p>${E(x.z.thesis)}</p></div>`).join("")}</div><div class="pti-lesson"><small>THE IMPORTANT DISTINCTION</small><p>${E(lesson)}</p></div>`,n++);
    for(const x of rows){
      html+=page(`<div class="pti-k">HOLDING RESEARCH</div><div class="pti-fundhead"><div><h2>${E(x.t)}</h2><p>${E(x.z.name)}</p></div><div><b>${x.w.toFixed(0)}%</b><small>${E(x.z.job)}</small></div></div><div class="pti-thesis"><small>THE THESIS</small><p>${E(x.z.thesis)}</p></div><div class="pti-cols"><div><h4>WHAT'S WORKING / WHAT IT ADDS</h4><ul>${x.z.work.map(v=>`<li>${E(v)}</li>`).join("")}</ul></div><div><h4>WHAT WE'RE WATCHING</h4><ul>${x.z.watch.map(v=>`<li>${E(v)}</li>`).join("")}</ul></div></div><div class="pti-trade"><div><small>YOU GET</small><p>${E(x.z.adds)}</p></div><div><small>YOU GIVE UP / ACCEPT</small><p>${E(x.z.trade)}</p></div></div><div class="pti-change"><small>WHAT WOULD CHANGE OUR VIEW</small><p>${E(x.z.watch.join(", "))} should be monitored for evidence that the holding is no longer performing its intended portfolio job. Relative performance alone is not enough.</p></div>`,n++);
    }
    const lf=ptLookthroughFacts();
    const concentrationEvidence=ptFmtLookthroughConcentration();
    const diversificationEvidence=ptFmtLookthroughDiversification();
    const largestTicker=lf.largest?String(lf.largest.ticker||lf.largest.name||""):"";
    const largestEff=lf.largest&&Number.isFinite(Number(lf.largest.effectiveWeight))?Number(lf.largest.effectiveWeight):null;
    const companyEvidence=Array.isArray(window.__ptLensCE)?window.__ptLensCE:[];
    const companyValuation=companyEvidence.length?companyEvidence.map(x=>`${E(x.t)} ${x.e.score??"—"}/100${x.e.price>0&&x.e.normalized>0?`; $${Number(x.e.price).toFixed(2)} vs $${Number(x.e.normalized).toFixed(2)} normalized`:``}`).join(" · "):"No dated company valuation evidence is required for this fund-only portfolio.";
    html+=page(`<div class="pti-k">SIX LENSES</div><h2>Six tests of the portfolio thesis.</h2><p class="pti-lead">Each lens answers a different question. The evidence is portfolio-specific; when a measurement is unavailable, the report leaves it unresolved rather than filling the page with a generic conclusion.</p><div class="pti-six">
      <div><span>01</span><h4>STRUCTURE</h4><b>${core.toFixed(0)}% core${tilts?` · ${tilts.toFixed(0)}% deliberate tilt`:``}</b><p>${tilts?`The portfolio does more than own the market. ${E(lesson)}`:`The portfolio is primarily a market-ownership structure without a separate factor sleeve.`}</p></div>
      <div><span>02</span><h4>DIVERSIFICATION</h4><b>${intl.toFixed(0)}% identified non-U.S.</b><p>${diversificationEvidence?E(diversificationEvidence):intl?`The international sleeve changes the earnings, currency, sector and valuation base relative to the U.S. core.`:`No dedicated non-U.S. sleeve is identified.`}</p></div>
      <div><span>03</span><h4>CONCENTRATION</h4><b>${largestEff!=null?`${E(largestTicker)} ${largestEff.toFixed(1)}% effective exposure`:`Look-through concentration unresolved`}</b><p>${concentrationEvidence?E(concentrationEvidence):`Ticker weights alone do not establish underlying-company concentration. No effective-exposure figure is invented without constituent evidence.`}</p></div>
      <div><span>04</span><h4>VALUATION</h4><b>${companyEvidence.length?`Measured company evidence available`:`Fund valuation evidence not yet populated`}</b><p>${E(companyValuation)}</p></div>
      <div><span>05</span><h4>RISK DURABILITY</h4><b>${sv?`Small/value tracking error is intentional`:growth?`Growth concentration is intentional`:div?`Dividend-screen risk is intentional`:`Broad equity risk remains dominant`}</b><p>${sv?`AVUV and AVDV can lag market-cap indexes for long periods. The portfolio only earns that tracking error if the small/value exposure remains deliberate and distinct.`:growth?`The growth sleeve raises sensitivity to earnings expectations and valuation compression.`:div?`The dividend sleeve can create sector and style concentrations that differ from the broad market.`:`Broad diversification reduces single-security risk but does not remove equity-market drawdown risk.`}</p></div>
      <div><span>06</span><h4>THESIS TEST</h4><b>What must remain true?</b><p>${core?`The core must continue to provide the intended broad foundation. `:``}${intl?`The international sleeve must remain economically distinct from the U.S. core. `:``}${tilts?`The tilt must continue to create the factor exposure it was added for. `:``}Price movement alone is not a thesis change.</p></div>
    </div><div class="pti-bottom"><small>SYNTHESIS</small><p>${largestEff!=null?`${E(largestTicker)} is the largest measured underlying company exposure at ${largestEff.toFixed(1)}%. `:``}${intl?`${intl.toFixed(0)}% of the portfolio is explicitly non-U.S. `:``}${tilts?`${tilts.toFixed(0)}% deliberately departs from the market-cap baseline. `:``}The portfolio should be reviewed when those measured exposures or the evidence supporting their jobs materially change.</p></div>`,n++);
    const watches=rows.flatMap(x=>x.z.watch.slice(0,2).map(v=>({v,t:x.t}))).slice(0,8);
    html+=page(`<div class="pti-k">WHAT WE'RE WATCHING</div><h2>The evidence that could actually change the thesis.</h2><div class="pti-watch">${watches.map((x,i)=>`<div><b>${String(i+1).padStart(2,"0")}</b><strong>${E(x.v)}</strong><span>${E(x.t)}</span><p>Tests whether the evidence supporting ${E(x.t)}'s portfolio role is strengthening or weakening.</p></div>`).join("")}</div><div class="pti-bottom"><small>RESEARCH PRINCIPLE</small><p>Price can change valuation and concentration, but price movement alone does not establish that the underlying investment case strengthened or failed. Track the evidence. Test the thesis.</p></div><div class="pti-disc">Portfolio Thesis is educational research, not individualized investment, tax or legal advice.</div>`,n++);
    html+=`</div>`;
    const host=document.getElementById("ptrReportOverlay")||document.getElementById("reportOverlay")||document.body;
    host.innerHTML=html;
    host.style.display="block";
    document.body.classList.add("ptr-report-open");
    window.scrollTo(0,0);
    return;
  }catch(v145err){ console.error("V145 publication fallback",v145err); }

  if(typeof getPortfolio!=="function") return;
  const portfolioName=String(window.ptActivePortfolioName||ptCurrentPortfolioName?.()||"My Portfolio");
  window.ptActivePortfolioName=portfolioName;
  const p=getPortfolio().filter(x=>Number(x.weight)>0);
  if(!p.length) return;
  // V134: load existing company research before composing evidence-dense pages.
  try{await ptLoadPortfolioCompanyEvidence(p);}catch(_){}
  // V128: render first. ETF evidence refresh is non-blocking and can never prevent the report from opening.
  try{ ptLoadPortfolioETFEvidence(p).catch(()=>{}); }catch(_){}
  const total=p.reduce((a,x)=>a+Number(x.weight||0),0);
  const core=p.filter(x=>ptReportRole(x.ticker)==="Core").reduce((a,x)=>a+Number(x.weight||0),0);
  const intl=p.filter(x=>["VXUS","AVDV"].includes(String(x.ticker).toUpperCase())).reduce((a,x)=>a+Number(x.weight||0),0);
  const tilt=p.filter(x=>ptReportRole(x.ticker)==="Tilt").reduce((a,x)=>a+Number(x.weight||0),0);
  const max=[...p].sort((a,b)=>Number(b.weight)-Number(a.weight))[0];
  const date=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",year:"numeric"}).format(new Date());
  const holdings=p.map(x=>{
    const t=String(x.ticker||"").toUpperCase(), role=ptReportRole(t);
    const prof=(typeof RESEARCH_PROFILES!=="undefined"&&RESEARCH_PROFILES[t])?RESEARCH_PROFILES[t]:null;
    const name=prof?.name||t;
    const exposure=prof?.exposure||"Research profile will add current exposure detail when available.";
    return `<div class="ptr-holding"><div class="ptr-ticker">${ptEsc(t)}</div><div><div class="ptr-role">${ptEsc(role)}</div><div><b>${ptEsc(name)}</b></div><div class="ptr-small">${ptEsc(exposure)}</div></div><div class="ptr-weight">${Number(x.weight).toFixed(0)}%</div></div>`;
  }).join("");
  const structure=core>=50?`The portfolio has a clear core: ${core.toFixed(0)}% is assigned to broad-market anchor exposure.`:`No single broad-market core dominates the allocation; the portfolio relies more heavily on satellites and individual positions.`;
  const diversification=intl>0?`${intl.toFixed(0)}% of the portfolio provides identified non-U.S. exposure, adding geographic diversification to the thesis.`:`No dedicated international sleeve is identified in the current allocation.`;
  const concentration=max?`${ptEsc(max.ticker)} is the largest position at ${Number(max.weight).toFixed(0)}%. The key question is whether that concentration is intentional and durable.`:"";
  const valuation=`Valuation should be interpreted at the holding level. ETFs are evaluated through role, exposure and portfolio relationships; individual companies can be sent to Deep Value for evidence-based company analysis.`;
  const behavior=`The portfolio is easiest to hold when every sleeve has a defined job. Temporary underperformance alone is not evidence that the thesis changed.`;

  const individualHoldings=p.filter(x=>ptReportRole(x.ticker)==="Individual position");
  const individualWeight=individualHoldings.reduce((a,x)=>a+Number(x.weight||0),0);
  const holdingLine=p.slice().sort((a,b)=>Number(b.weight||0)-Number(a.weight||0)).map(x=>`${ptEsc(String(x.ticker).toUpperCase())} ${Number(x.weight||0).toFixed(0)}%`).join(" · ");
  const thesis=`${holdingLine}. ${core>=50?`${core.toFixed(0)}% is classified as core, so the portfolio's result is primarily anchored to that broad-market exposure.`:`Only ${core.toFixed(0)}% is classified as core, so non-core sleeves have greater influence on results.`}${intl>0?` ${intl.toFixed(0)}% is explicitly international, creating a separate geographic earnings and valuation exposure.`:``}${individualWeight>0?` ${individualWeight.toFixed(0)}% is allocated directly to companies; those positions must justify their added concentration with company-level evidence.`:` The implementation is fund-driven, so the main thesis tests are exposure, overlap, valuation and whether each fund remains distinct.`}`;
  const fundWeight=total-individualWeight;
  const diversifierWeight=p.filter(x=>ptReportRole(x.ticker)==="Diversifier").reduce((a,x)=>a+Number(x.weight||0),0);
  const roleTiltWeight=p.filter(x=>ptReportRole(x.ticker)==="Tilt").reduce((a,x)=>a+Number(x.weight||0),0);
  const tiltHoldings=p.filter(x=>ptReportRole(x.ticker)==="Tilt");
  const diversifierHoldings=p.filter(x=>ptReportRole(x.ticker)==="Diversifier");
  const coreHoldings=p.filter(x=>ptReportRole(x.ticker)==="Core");
  const tiltNames=tiltHoldings.map(x=>String(x.ticker||"").toUpperCase());
  const tiltPurpose=tiltHoldings.map(x=>{const t=String(x.ticker||"").toUpperCase(),l=ptTickerLesson(t,"Tilt",x.weight);return `${ptEsc(t)}: ${ptEsc(l.adds)}`}).join(" ");
  const diversifierPurpose=diversifierHoldings.map(x=>{const t=String(x.ticker||"").toUpperCase(),l=ptTickerLesson(t,"Diversifier",x.weight);return `${ptEsc(t)} adds ${ptEsc(l.lesson.toLowerCase())}`}).join("; ");
  const hasBond=p.some(x=>String(x.ticker||"").toUpperCase()==="BND");
  const hasGold=p.some(x=>String(x.ticker||"").toUpperCase()==="GLD");
  const hasRealEstate=p.some(x=>String(x.ticker||"").toUpperCase()==="VNQ");
  const equityOnly=!hasBond&&!hasGold;
  const knownProfiles=p.map(x=>({x,t:String(x.ticker||"").toUpperCase(),prof:(typeof RESEARCH_PROFILES!=="undefined"?RESEARCH_PROFILES[String(x.ticker||"").toUpperCase()]:null)}));
  const overlapMessage=individualWeight>0
    ?`${individualWeight.toFixed(0)}% is held in individual companies. If those companies also sit inside broad funds, the direct positions increase effective company exposure rather than creating a new diversification sleeve.`
    :`No direct company positions are identified. Overlap risk comes primarily from funds owning the same underlying securities or market segments.`;
  const architectureMessage=core>=50
    ?`The portfolio is anchored by a broad core, while the remaining ${Math.max(0,total-core).toFixed(0)}% changes geography, factor exposure or company concentration. The analytical question is whether those additions are genuinely different from the foundation.`
    :`No single broad core dominates the allocation. Portfolio behavior therefore depends more heavily on how the sleeves interact and whether their exposures are genuinely distinct.`;
  const diversificationMessage=intl>0
    ?`${intl.toFixed(0)}% is explicitly identified outside the U.S. Geographic diversification can change the portfolio's earnings, currency and valuation exposure even when it temporarily trails the U.S.`
    :`No dedicated international sleeve is identified, so geographic diversification depends on whatever foreign revenue or holdings exist inside the current securities.`;
  const selectionMessage=individualWeight>0
    ?`Direct stock selection represents ${individualWeight.toFixed(0)}% of the portfolio. That portion deserves company-level evidence because security-specific outcomes can matter even when the broader portfolio thesis remains intact.`
    :`The portfolio currently expresses its thesis through funds rather than direct company selection.`;
  document.getElementById("ptReportBody").innerHTML=`
<article class="ptr-page ptr-cover"><div class="ptr-hero-grid"><div><div class="ptr-portfolio-name">${ptEsc(portfolioName)}</div><h1>Your Portfolio Thesis</h1><div class="ptr-deck">Your allocation translated into evidence, portfolio consequences and review triggers.</div><div class="ptr-date">${date} · ${p.length} holdings · ${total.toFixed(0)}% allocated</div></div><div class="ptr-donut" style="background:conic-gradient(#356f50 0 ${core}%,#78947f ${core}% ${Math.min(100,core+intl)}%,#afbeae ${Math.min(100,core+intl)}% 100%)"><div class="ptr-donut-center"><b>${p.length}</b><span>HOLDINGS</span></div></div></div><div class="ptr-thesis-strip"><div class="ptr-kicker" style="color:#b9d4c2">THE THESIS</div><div style="font-size:14px;line-height:1.5">${thesis}</div></div><div class="ptr-page-num">01</div></article>
<article class="ptr-page ptr-xray"><div class="ptr-kicker">PORTFOLIO ARCHITECTURE</div><h2 class="ptr-section-title">One portfolio. Different jobs.</h2>
<div class="ptr-architecture-hero">
 <div class="ptr-architecture-story"><h3>Structure before performance.</h3><p>${architectureMessage}</p><div class="ptr-rolebar"><span class="core" style="width:${Math.max(0,Math.min(100,core/total*100))}%"></span><span class="div" style="width:${Math.max(0,Math.min(100,diversifierWeight/total*100))}%"></span><span class="tilt" style="width:${Math.max(0,Math.min(100,roleTiltWeight/total*100))}%"></span><span class="single" style="width:${Math.max(0,Math.min(100,individualWeight/total*100))}%"></span></div><div class="ptr-rolelegend"><div><b>${core.toFixed(0)}%</b>Core</div><div><b>${diversifierWeight.toFixed(0)}%</b>Diversifiers</div>${roleTiltWeight>0?`<div><b>${roleTiltWeight.toFixed(0)}%</b>Tilts</div>`:``}${individualWeight>0?`<div><b>${individualWeight.toFixed(0)}%</b>Individual</div>`:``}</div></div>
 <div class="ptr-architecture-graphic"><div><div class="ey">${individualWeight>0?"PORTFOLIO CONSTRUCTION":"GEOGRAPHIC SPLIT"}</div><div class="big">${individualWeight>0?`${fundWeight.toFixed(0)} / ${individualWeight.toFixed(0)}`:`${Math.max(0,100-intl).toFixed(0)} / ${intl.toFixed(0)}`}</div><p>${individualWeight>0?"Fund exposure / direct security selection":"U.S. / International exposure"}</p></div><div><div class="ey">PRIMARY QUESTION</div><p>${individualWeight>0?"What is genuinely diversifying the core—and what is simply increasing an exposure already owned?":"How much of the portfolio depends on the U.S. market—and how much is supported by a distinct international earnings base?"}</p></div></div>
</div>
<div class="ptr-evidence-grid">
 <div class="ptr-evidence-card"><h4>Geographic breadth</h4><b>${intl>0?`${intl.toFixed(0)}% explicit international exposure`:`No dedicated international sleeve`}</b><p>${diversificationMessage}</p></div>
 <div class="ptr-evidence-card"><h4>Concentration</h4><b>${max?`${ptEsc(max.ticker)} is ${Number(max.weight).toFixed(0)}% of the portfolio`:`No dominant position identified`}</b><p>${max&&Number(max.weight)>=50?`A large broad-market core can be structurally appropriate, but the underlying companies and sectors still determine much of the portfolio's behavior.`:`No single holding exceeds half the portfolio, so concentration should be evaluated across overlapping underlying exposures as well as ticker weights.`}</p></div>
 <div class="ptr-evidence-card"><h4>Overlap & effective exposure</h4><b>${individualWeight>0?`Direct stocks can amplify fund holdings`:`Ticker count is not diversification`}</b><p>${overlapMessage}</p></div>
 <div class="ptr-evidence-card"><h4>Security-selection risk</h4><b>${individualWeight>0?`${individualWeight.toFixed(0)}% requires company evidence`:`Fund-driven thesis`}</b><p>${selectionMessage}</p></div>
</div>
<div class="ptr-implication"><b>What the next page tests</b><span>${core.toFixed(0)}% core, ${intl.toFixed(0)}% explicit international exposure and ${individualWeight.toFixed(0)}% direct-company exposure are the measurable starting conditions. The next section explains what those exposures add, what they overlap with, and what tradeoffs they introduce.</span><small style="display:block;margin-top:7px;font-size:8px;letter-spacing:.1em;color:#2f7650;font-weight:850">NEXT → UNDERSTAND THE PORTFOLIO'S EXPOSURE DECISIONS</small></div>
<div class="ptr-page-num">02</div></article>
${(()=>{const ce=individualHoldings.map(x=>({w:Number(x.weight||0),e:ptCompanyEvidenceSummary(x.ticker),t:String(x.ticker).toUpperCase()})).filter(x=>x.e);window.__ptLensCE=ce;return ""})()}<article class="ptr-page ptr-lenses"><div class="ptr-kicker">PORTFOLIO ANALYSIS</div><h2 class="ptr-section-title">What this portfolio is actually built to do.</h2>
<div class="ptr-lens-intro" style="display:block"><div><div class="ey">WHAT YOUR HOLDINGS ARE DOING</div><b>The portfolio is a set of exposure decisions—not just four ticker weights.</b><p>The broad funds establish the default market exposure. Tilts matter when they deliberately reweight that exposure toward a different geography, size, style, income profile or company thesis.</p></div></div>
<div class="ptr-holding-decisions">${p.map(x=>{const t=String(x.ticker).toUpperCase(),r=DB[t]?.[1]||x.role||"",d=ptHoldingTradeoff(t,r,x.weight);return `<div class="ptr-holding-decision"><div class="ptr-hd-head"><b>${ptEsc(t)}</b><span>${Number(x.weight).toFixed(0)}% · ${ptEsc(r||"Holding")}</span></div><p><strong>What it owns:</strong> ${ptEsc(d.owns)}</p><p><strong>What it changes:</strong> ${ptEsc(d.changes)}</p><div class="ptr-trade"><div><em>YOU GET</em>${ptEsc(d.gain)}</div><div><em>YOU GIVE UP / ACCEPT</em>${ptEsc(d.give)}</div></div><p class="ptr-hd-test"><strong>Thesis test:</strong> ${ptEsc(d.test)}</p></div>`}).join("")}</div>
<div class="ptr-factor-lesson">${(()=>{const ts=p.map(x=>String(x.ticker).toUpperCase());const hasSV=ts.some(t=>["AVUV","AVDV"].includes(t)),hasDiv=ts.includes("SCHD"),hasGrowth=ts.includes("QQQM");if(hasSV)return `<div class="ey">WHY THE TILT MATTERS</div><b>Market-cap ownership and value tilting answer different questions.</b><p>A market-cap fund such as VTI or VXUS lets market prices determine each company's weight. AVUV and AVDV deliberately change those weights toward smaller, value-oriented companies. The portfolio is therefore not merely adding more funds—it is choosing to own more small/value exposure than the broad market assigns by default. That can diversify the source of returns, but it also creates tracking error: large growth can lead for years while a small/value tilt trails.</p>`;if(hasDiv)return `<div class="ey">WHY THE TILT MATTERS</div><b>A dividend tilt changes which companies receive more of the portfolio.</b><p>The important distinction is not the dividend payment itself. The selection methodology reweights the broad market toward companies that meet the fund's dividend-oriented screens. That can emphasize mature cash-generating businesses, while relatively reducing exposure to companies that retain more capital for reinvestment and growth.</p>`;if(hasGrowth)return `<div class="ey">WHY THE TILT MATTERS</div><b>A growth-heavy tilt increases dependence on future expectations.</b><p>Adding a concentrated growth-oriented fund changes the portfolio from broad market ownership toward companies whose valuations often depend more heavily on future growth. That can increase upside participation when growth leads and increase sensitivity when valuations compress.</p>`;return ""})()}</div>
<div class="ptr-lensstack">
<div class="ptr-lensrow"><div class="num">01</div><div class="lname">Structure</div><div class="ptr-lenscell"><em>Evidence</em><p>${coreHoldings.map(x=>`${ptEsc(String(x.ticker).toUpperCase())} ${Number(x.weight).toFixed(0)}% core`).join(" · ")}${diversifierHoldings.length?` · ${diversifierHoldings.map(x=>`${ptEsc(String(x.ticker).toUpperCase())} ${Number(x.weight).toFixed(0)}% diversifier`).join(" · ")}`:``}${tiltHoldings.length?` · ${tiltHoldings.map(x=>`${ptEsc(String(x.ticker).toUpperCase())} ${Number(x.weight).toFixed(0)}% tilt`).join(" · ")}`:``}${individualHoldings.length?` · ${individualHoldings.map(x=>`${ptEsc(String(x.ticker).toUpperCase())} ${Number(x.weight).toFixed(0)}% direct`).join(" · ")}`:``}.</p></div><div class="ptr-lenscell imp"><em>Finding</em><p>${roleTiltWeight>0?`The tilt is not spare allocation. ${tiltPurpose} The portfolio therefore makes an explicit bet that this exposure is worth deviating from the broad core.`:individualWeight>0?`The direct-company sleeve deliberately departs from fund weights. Its job is security selection, so it must earn its place through company evidence rather than simply adding another ticker.`:`The design is built from core and diversifier sleeves without a separate factor or company-selection bet.`}</p></div></div>
<div class="ptr-lensrow"><div class="num">02</div><div class="lname">Diversification</div><div class="ptr-lenscell"><em>Evidence</em><p>${ptFmtLookthroughDiversification()?`${ptFmtLookthroughDiversification()} `:``}${intl>0?`${ptEsc(p.filter(x=>["VXUS","AVDV"].includes(String(x.ticker).toUpperCase())).map(x=>String(x.ticker).toUpperCase()).join(" + "))} creates an intentional non-U.S. earnings, currency and valuation sleeve.`:`No dedicated non-U.S. sleeve is identified.`}${diversifierPurpose?` ${diversifierPurpose}.`:``}</p></div><div class="ptr-lenscell imp"><em>Finding</em><p>${intl>0?`The diversification benefit comes from owning a different geographic earnings base—not from the number of fund tickers. ${tiltNames.includes("AVDV")?`AVDV broadens this further by changing both geography and the size/value mix.`:`Its success should therefore be judged by whether it remains distinct from the U.S. core, not whether it wins each year.`}`:`Geographic diversification is not an explicit portfolio decision here; any foreign exposure is incidental inside other holdings.`}</p></div></div>
<div class="ptr-lensrow"><div class="num">03</div><div class="lname">Concentration</div><div class="ptr-lenscell"><em>Evidence</em><p>${ptFmtLookthroughConcentration()||`${max?`${ptEsc(max.ticker)} is the largest visible position at ${Number(max.weight).toFixed(0)}%. `:``}${individualWeight>0?`Direct companies add ${individualWeight.toFixed(0)}% of known company-specific exposure before fund overlap is counted.`:`There are no direct-company positions.`}${roleTiltWeight>0?` The tilt is concentrated in ${tiltNames.map(ptEsc).join(" + ")}.`:``}`}</p></div><div class="ptr-lenscell imp"><em>Finding</em><p>${ptFmtLookthroughConcentration()?`The look-through engine measures concentration from the companies actually held inside the funds. This is more informative than ticker count because it shows which businesses ultimately drive the portfolio.`:(individualWeight>0?`Visible ticker weights understate true company concentration because broad funds may own the same companies. Constituent evidence was unavailable for this run, so no effective-exposure number is invented.`:roleTiltWeight>0?`The main concentration question is whether the tilt duplicates risks already dominant inside the core. Constituent evidence was unavailable for this run.`:`Concentration remains unresolved until constituent evidence is available.`)}</p></div></div>
<div class="ptr-lensrow ${!(window.__ptLensCE||[]).length?"ptr-lensrow-unresolved":""}"><div class="num">04</div><div class="lname">Valuation</div><div class="ptr-lenscell"><em>Measured evidence</em><p>${(()=>{const ce=window.__ptLensCE||[];if(!ce.length)return `No dated fund-level valuation evidence is stored for the holdings in this report.`;return ce.map(x=>`${ptEsc(x.t)} ${x.e.score??"—"}/100${x.e.price>0&&x.e.normalized>0?`; $${x.e.price.toFixed(2)} vs. $${x.e.normalized.toFixed(2)} normalized`:``}`).join(" · ")})()}</p></div><div class="ptr-lenscell imp"><em>Finding</em><p>${(()=>{const ce=window.__ptLensCE||[];if(!ce.length)return `Valuation is unresolved rather than assumed. No cheap/expensive conclusion is made until fund valuation evidence is dated and stored.`;const over=ce.filter(x=>Number.isFinite(x.e.mos)&&x.e.mos<0),under=ce.filter(x=>Number.isFinite(x.e.mos)&&x.e.mos>=0);return `${under.length?under.map(x=>`${ptEsc(x.t)} has a positive normalized-value cushion`).join("; ")+". ":""}${over.length?over.map(x=>`${ptEsc(x.t)} is above normalized value`).join("; ")+". ":""}These company valuations affect the direct sleeve; they do not substitute for missing fund-level valuation evidence.`})()}</p></div></div>
<div class="ptr-lensrow"><div class="num">05</div><div class="lname">Risk durability</div><div class="ptr-lenscell"><em>Risk map</em><p>${equityOnly?`The identified sleeves are equity-driven, so broad equity drawdowns remain a shared portfolio risk.`:`The portfolio includes a non-equity sleeve that can introduce a different return driver.`} ${intl>0?`International exposure adds currency and non-U.S. economic risk.`:``}${roleTiltWeight>0?` ${tiltNames.map(t=>`${ptEsc(t)} adds ${ptEsc(ptTickerLesson(t,"Tilt",tiltHoldings.find(x=>String(x.ticker).toUpperCase()===t)?.weight||0).lesson.toLowerCase())}`).join("; ")}.`:``}</p></div><div class="ptr-lenscell imp"><em>Finding</em><p>${equityOnly?`The sleeves can diversify geography, size or style without eliminating equity-market risk. A simultaneous equity selloff would still pressure most of the portfolio.`:`The non-equity sleeve can diversify the source of return, but its actual protection depends on the risk environment.`}${roleTiltWeight>0?` The tilt should be retained only if its distinct exposure remains intentional through periods when it trails the core.`:``}</p></div></div>
<div class="ptr-lensrow"><div class="num">06</div><div class="lname">Thesis test</div><div class="ptr-lenscell"><em>What must remain true</em><p>${coreHoldings.length?`The core must continue to provide the intended broad foundation. `:``}${intl>0?`The international sleeve must remain meaningfully distinct from the U.S. core. `:``}${roleTiltWeight>0?`${tiltNames.map(ptEsc).join(" + ")} must continue to deliver the factor/exposure change they were added for. `:``}${individualWeight>0?`Direct companies must continue to justify their overweight with company evidence.`:``}</p></div><div class="ptr-lenscell imp"><em>What would change the thesis</em><p>${roleTiltWeight>0?`A tilt that no longer changes the portfolio's underlying exposure, or whose intended factor thesis is no longer wanted, would remove its reason for being. `:``}${intl>0?`Loss of meaningful geographic distinction would weaken the diversification case. `:``}${individualWeight>0?`Deteriorating company evidence or valuation without a compensating thesis would challenge the direct sleeve. `:``}Price movement alone is not a thesis change.</p></div></div>
</div>
<div style="margin-top:9px;font-size:8px;letter-spacing:.1em;color:#2f7650;font-weight:850">NEXT → ${individualWeight>0?"TEST DIRECT STOCKS AGAINST COMPANY EVIDENCE":"MONITOR THE EVIDENCE THAT COULD CHANGE THE THESIS"}</div>
<div class="ptr-page-num">03</div></article>
${p.some(x=>ptReportRole(x.ticker)==="Individual position")?`<article class="ptr-page"><div class="ptr-kicker">INDIVIDUAL SECURITIES</div><h2 class="ptr-section-title">Company evidence behind the portfolio weight.</h2><div class="ptr-security-intro"><div><div class="ey">WHY THIS PAGE EXISTS</div><b>Direct stocks change the portfolio differently than funds.</b><p>${individualWeight.toFixed(0)}% of this portfolio is allocated to individual companies. Those positions add company-specific outcomes and may amplify companies already owned indirectly through broad funds.</p></div><div><div class="ey">HOW TO READ IT</div><b>Evidence first. Weight second.</b><p>Evidence describes the company. Weight describes its importance to the portfolio. Read the two together; neither is a buy/sell instruction.</p></div></div><div id="ptPortfolioDVGrid" class="ptr-individual-grid">${p.filter(x=>ptReportRole(x.ticker)==="Individual position").map(x=>`<div class="ptr-individual-card" id="ptPDV-${ptEsc(String(x.ticker).toUpperCase())}"><div class="ptr-security-head"><div class="ptr-individual-top"><b>${ptEsc(String(x.ticker).toUpperCase())}</b><span class="ptr-individual-weight">${Number(x.weight).toFixed(0)}%</span></div></div><div class="ptr-dv-unavailable">Loading Deep Value evidence…</div></div>`).join("")}</div><div class="ptr-page-num">04</div></article>`:""}
