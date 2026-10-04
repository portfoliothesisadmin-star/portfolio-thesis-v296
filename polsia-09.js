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
