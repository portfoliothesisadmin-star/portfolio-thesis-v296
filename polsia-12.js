<article class="ptr-page"><div class="ptr-kicker">PORTFOLIO THESIS</div><h2 class="ptr-section-title">The thesis—and the evidence that could change it.</h2><div class="ptr-thesis-strip"><div class="ptr-kicker" style="color:#b9d4c2">CURRENT THESIS</div><div style="font-size:15px;line-height:1.5">${thesis}</div></div><div class="ptr-decision-grid"><div class="ptr-decision-panel"><div class="ey">SUPPORTS THE THESIS</div><h4>What the measured evidence supports now.</h4><p>${core>=50?`${core.toFixed(0)}% remains in the identified core. `:``}${intl>0?`${intl.toFixed(0)}% is explicitly separated into international exposure. `:``}${(()=>{const ce=window.__ptLensCE||[];const a=ce.filter(x=>Number.isFinite(x.e.score)&&x.e.score>=70);return a.length?`${a.map(x=>`${ptEsc(x.t)} carries ${x.e.score}/100 evidence${x.e.completeness!=null?` at ${x.e.completeness}% completeness`:``}`).join("; ")}. `:individualWeight>0?`No direct company currently has a measured 70+/100 evidence reading in the available record. `:``})()}${roleTiltWeight>0?`${roleTiltWeight.toFixed(0)}% is deliberately assigned to tilt exposure rather than being mistaken for core.`:``}</p></div><div class="ptr-decision-panel"><div class="ey">CHALLENGES TO WATCH</div><h4>Where the current evidence is weakest.</h4><p>${(()=>{const ce=window.__ptLensCE||[];const z=[];if(max)z.push(`${ptEsc(max.ticker)} is ${Number(max.weight).toFixed(0)}% of capital`);ce.forEach(x=>{if(Number.isFinite(x.e.mos)&&x.e.mos<0)z.push(`${ptEsc(x.t)} is ${Math.abs(x.e.mos).toFixed(1)}% above normalized value`);if(x.e.weak)z.push(`${ptEsc(x.t)}'s weakest measured category is ${x.e.weak[0]} at ${x.e.weak[1]}/20`)});if(individualWeight>0&&!ce.length)z.push(`${individualWeight.toFixed(0)}% is in direct companies without completed company evidence`);return z.length?z.join(" · ")+".":"No company-specific challenge is measurable from the current evidence set; fund overlap and valuation remain unresolved until dated fund data is available."})()}</p></div></div><div class="ptr-visual-title">Measured review triggers</div><div class="ptr-monitor-list">
<div class="ptr-monitor-line"><div class="n">01</div><b>Core weight</b><span>${max?`${ptEsc(max.ticker)} is currently ${Number(max.weight).toFixed(0)}% of the portfolio; review if allocation changes make a different sleeve the dominant driver.`:`Recalculate when allocation weights change.`}</span></div>
<div class="ptr-monitor-line"><div class="n">02</div><b>International allocation</b><span>${intl>0?`${intl.toFixed(0)}% is explicitly international; review whether future allocation changes materially alter that geographic split.`:`No dedicated international sleeve is present; review if one is added.`}</span></div>
<div class="ptr-monitor-line"><div class="n">03</div><b>Direct-company evidence</b><span>${individualWeight>0?`${individualWeight.toFixed(0)}% is in direct companies. Re-run company evidence when new financial statements materially change score, completeness or normalized value.`:`No direct-company sleeve is present.`}</span></div>
<div class="ptr-monitor-line"><div class="n">04</div><b>Valuation</b><span>${(()=>{const ce=window.__ptLensCE||[];return ce.length?ce.map(x=>Number.isFinite(x.e.mos)?`${ptEsc(x.t)}: ${x.e.mos>=0?x.e.mos.toFixed(1)+"% MOS":Math.abs(x.e.mos).toFixed(1)+"% above normalized"}`:`${ptEsc(x.t)}: valuation incomplete`).join(" · "):"No measured company valuation is currently available."})()}</span></div>
<div class="ptr-monitor-line"><div class="n">05</div><b>Weakest company evidence</b><span>${(()=>{const ce=window.__ptLensCE||[];const z=ce.filter(x=>x.e.weak);return z.length?z.map(x=>`${ptEsc(x.t)}: ${x.e.weak[0]} ${x.e.weak[1]}/20`).join(" · "):"No measured company category is currently available."})()}</span></div>
<div class="ptr-monitor-line"><div class="n">06</div><b>Fund evidence</b><span>${(()=>{const z=ptLensMeasuredETF(p);return z.length?z.join(" · "):"No dated ETF evidence is currently available; no trend claim is inserted."})()}</span></div></div><div class="ptr-review-rule"><b>Prices change. The thesis changes only when the evidence does.</b><p>Review the portfolio when new evidence changes the investment argument. Price can alter valuation and concentration, but movement alone does not establish that the underlying thesis strengthened or failed.</p></div><p class="ptr-small" style="margin-top:14px">Portfolio Thesis is educational research, not individualized investment, tax or legal advice.</p><div class="ptr-page-num">${p.some(x=>ptReportRole(x.ticker)==="Individual position")?"05":"04"}</div></article>`;
ptHydratePortfolioDeepValue(p).finally(()=>ptAutoSavePortfolioReport(p));
ptNormalizeReportChrome(document.getElementById("ptGeneratedReport"));
const ptReportHost=document.getElementById("ptGeneratedReport");
ptReportHost.classList.add("active");
document.body.classList.add("pt-report-open");
ptReportHost.scrollTop=0;
window.scrollTo(0,0);
}
function ptReportGoHome(){
  const pr=document.getElementById("ptGeneratedReport"),dv=document.getElementById("ptDVGeneratedReport");
  if(pr?.classList.contains("active")) closePortfolioReport();
  if(dv?.classList.contains("active")) closeDVReport();
  if(typeof ptReturnHome==="function")ptReturnHome();
  window.scrollTo(0,0);
}
function ptPortfolioDVSnapshot(ticker){
  const dv=document.querySelector("#deepValue")||document, raw=dv.innerText||"";
  const scoreText=(document.getElementById("dvTotalScore")?.textContent||"").trim();
  const compText=(document.getElementById("dvCompleteness")?.textContent||"").trim();
  const score=(scoreText.match(/(\d+)/)||raw.match(/Evidence score[:\s]+(\d+)\s*\/\s*100/i)||raw.match(/(\d+)\s*\/\s*100/))?.[1]||"—";
  const comp=(compText.match(/(\d+)%/)||raw.match(/(\d+)%\s*(?:evidence\s*)?complete/i)||[])[1]||"—";
  const cats=["Financial Strength","Earning Power","Cash Generation & Quality","Capital Discipline","Valuation"].map(n=>{const esc=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");const m=raw.match(new RegExp(esc+"[\\s\\S]{0,100}?(\\d+)\\s*\\/\\s*20","i"));return [n,m?m[1]:"—"]});
  const v=window.ptDVValuation||{};
  const price=Number(v.marketPrice), normalized=Number(v.normalized);
  const mos=(price>0&&normalized>0)?((normalized-price)/normalized*100):null;
  return {ticker,score,comp,cats,price:Number.isFinite(price)?price:null,normalized:Number.isFinite(normalized)?normalized:null,mos};
}
function ptRenderPortfolioDVCard(ticker,weight,snap,error){
  const el=document.getElementById("ptPDV-"+ticker);if(!el)return;
  if(error||!snap){el.innerHTML=`<div class="ptr-individual-top"><b>${ptEsc(ticker)}</b><span class="ptr-individual-weight">${Number(weight).toFixed(0)}%</span></div><div class="ptr-dv-unavailable"><b>Deep Value analysis currently unavailable.</b><br>The portfolio report will not invent missing company evidence. Re-run the report when current or cached financial data is available.</div><button class="ptr-dv-open" onclick="ptOpenCompanyFromPortfolio('${ptEsc(ticker)}')">View / refresh Deep Value Report</button>`;return;}
  const money=x=>x==null?"—":"$"+Number(x).toFixed(2);
  const mos=snap.mos==null?"—":(snap.mos>=0?snap.mos.toFixed(1)+"% margin of safety":Math.abs(snap.mos).toFixed(1)+"% above normalized value");
  const measured=snap.cats.filter(x=>Number.isFinite(Number(x[1])));const strongest=measured.length?[...measured].sort((a,b)=>Number(b[1])-Number(a[1]))[0]:null;const weakest=measured.length?[...measured].sort((a,b)=>Number(a[1])-Number(b[1]))[0]:null;const scoreNum=Number(snap.score);const evidenceRead=Number.isFinite(scoreNum)?(scoreNum>=80?"Evidence is broadly strong across the measured framework.":scoreNum>=65?"Evidence is supportive overall, with meaningful areas that still deserve monitoring.":"The measured evidence is mixed; the position depends more heavily on improvement or a favorable valuation."):"Evidence is incomplete.";const valueRead=snap.mos==null?"Valuation comparison is unavailable; no conclusion is inferred.":(snap.mos>=20?"Normalized value sits materially above the current price under the frozen DCF framework.":snap.mos>=0?"Price is below normalized value, but the valuation cushion is narrower.":"Price is above normalized value, increasing the importance of future execution.");
  el.innerHTML=`<div class="ptr-security-head"><div class="ptr-individual-top"><div><b>${ptEsc(ticker)}</b><div class="ptr-role">${Number(weight).toFixed(0)}% OF PORTFOLIO · DIRECT COMPANY EXPOSURE</div></div><span class="ptr-individual-weight">${snap.score}<small style="font-size:9px">/100</small></span></div></div><div class="ptr-security-summary"><div class="ptr-security-scorebox"><div class="ptr-dv-score">${snap.score}<small>/100</small></div><div class="label">Evidence score</div><div class="ptr-dv-meta">${snap.comp}% complete</div></div><div class="ptr-security-thesis"><b>Research read</b>${ptEsc(evidenceRead)} At ${Number(weight).toFixed(0)}% of the portfolio, this is a company-specific thesis whose impact should be judged alongside any indirect ownership through broad funds.</div></div><div class="ptr-security-bars">${snap.cats.map(x=>{const n=Number(x[1]);const w=Number.isFinite(n)?Math.max(0,Math.min(100,n/20*100)):0;return `<div class="ptr-security-bar"><span>${ptEsc(x[0])}</span><div class="ptr-security-track"><div class="ptr-security-fill" style="width:${w}%"></div></div><strong>${x[1]}/20</strong></div>`}).join("")}</div><div class="ptr-security-evidence"><div><h4>Supports the company thesis</h4><p>${strongest?`${ptEsc(strongest[0])} is the strongest measured category at ${strongest[1]}/20. ${ptEsc(evidenceRead)}`:`Current evidence is not complete enough to identify a strongest category.`}</p></div><div><h4>Evidence to watch</h4><p>${weakest?`${ptEsc(weakest[0])} is the lowest measured category at ${weakest[1]}/20. ${ptEsc(valueRead)}`:`Current evidence is not complete enough to identify the primary watch area.`}</p></div></div><div class="ptr-security-value"><strong>${money(snap.price)} market price · ${money(snap.normalized)} normalized value</strong><br>${ptEsc(mos)}. ${ptEsc(valueRead)}</div><button class="ptr-dv-open" onclick="ptOpenCompanyFromPortfolio('${ptEsc(ticker)}')">View Full Deep Value Report</button>`;
}
async function ptHydratePortfolioDeepValue(p){
  // V130: Research Universe first. If no completed record exists, automatically
  // run the same Deep Value data pipeline used by standalone company research,
  // capture the completed evidence, then render the portfolio card.
  const individuals=p.filter(x=>ptReportRole(x.ticker)==="Individual position");
  if(!individuals.length)return;

  async function universeSnapshot(t){
    if(!window.ptSupabase?.functions?.invoke)throw new Error("Research memory unavailable");
    const {data,error}=await window.ptSupabase.functions.invoke("research-universe",{body:{action:"get",symbol:t}});
    if(error)throw error;
    const security=data?.security||null;
    const latest=(data?.history||[])[0]||null;
    if(!security&&!latest)return null;
    const payloadEvidence=latest?.payload?.evidence||latest?.payload||{};
    const payloadCats=payloadEvidence?.categories||latest?.payload?.categories||{};
    const cats=[
      ["Financial Strength",latest?.financial_strength ?? payloadCats?.financialStrength ?? payloadCats?.financial_strength],
      ["Earning Power",latest?.earning_power ?? payloadCats?.earningPower ?? payloadCats?.earning_power],
      ["Cash Generation & Quality",latest?.cash_generation ?? payloadCats?.cashGeneration ?? payloadCats?.cash_generation],
      ["Capital Discipline",latest?.capital_discipline ?? payloadCats?.capitalDiscipline ?? payloadCats?.capital_discipline],
      ["Valuation",latest?.valuation_score ?? payloadCats?.valuation ?? payloadCats?.valuation_score]
    ].map(([n,v])=>[n,v==null?"—":String(Number(v))]);
    const price=security?.latest_price ?? latest?.market_price ?? null;
    const normalized=security?.latest_normalized_value ?? latest?.normalized_value ?? null;
    const mos=security?.latest_margin_of_safety ?? latest?.margin_of_safety ?? ((Number(price)>0&&Number(normalized)>0)?((Number(normalized)-Number(price))/Number(normalized)*100):null);
    const storedScore=security?.latest_evidence_score ?? latest?.evidence_score ?? payloadEvidence?.evidenceScore ?? payloadEvidence?.evidence_score ?? null;
    const storedComp=security?.latest_completeness ?? latest?.completeness ?? payloadEvidence?.completeness ?? null;
    return {
      ticker:t,
      score:storedScore ?? "—",
      comp:storedComp ?? "—",
      cats,
      price:price==null?null:Number(price),
      normalized:normalized==null?null:Number(normalized),
      mos:mos==null?null:Number(mos)
    };
  }

  for(const x of individuals){
    const t=String(x.ticker||"").toUpperCase();
    try{
      let snap=await universeSnapshot(t);
      const hasCompleteResearch=snap && Number.isFinite(Number(snap.score)) && Number.isFinite(Number(snap.comp));
      if(!hasCompleteResearch){
        const card=document.getElementById("ptPDV-"+t);
        if(card) card.innerHTML=`<div class="ptr-security-head"><div class="ptr-individual-top"><b>${ptEsc(t)}</b><span class="ptr-individual-weight">${Number(x.weight).toFixed(0)}%</span></div></div><div class="ptr-dv-unavailable"><b>Researching ${ptEsc(t)}…</b><br>No completed Research Universe record was found. Portfolio Thesis is running Deep Value automatically.</div>`;
        const {data,error}=await window.ptSupabase.functions.invoke("deep-value-data",{body:{ticker:t}});
        if(error)throw error;
        if(!data||data.error)throw new Error(data?.error||"No company data returned.");
        // Build the existing frozen Deep Value analysis without navigating away.
        buildDVReport(t,data);
        // Every completed company analysis is also a member-facing Deep Value Report.
        // Save/update it in My Library even when research was triggered behind a Portfolio Report.
        ptAutoSaveDeepValueReport(t);
        const researchSnap=ptDeepValueResearchSnapshot(t,data);
        const rc=researchSnap?.categories||{};
        const fresh={
          ticker:t,
          score:researchSnap?.evidenceScore ?? "—",
          comp:researchSnap?.completeness ?? "—",
          cats:[
            ["Financial Strength",rc.financialStrength ?? "—"],
            ["Earning Power",rc.earningPower ?? "—"],
            ["Cash Generation & Quality",rc.cashGeneration ?? "—"],
            ["Capital Discipline",rc.capitalDiscipline ?? "—"],
            ["Valuation",rc.valuation ?? "—"]
          ],
          price:researchSnap?.marketPrice ?? null,
          normalized:researchSnap?.normalizedValue ?? null,
          mos:researchSnap?.marginOfSafety ?? null
        };
        // Save institutional memory in the background; the portfolio report does not depend on the write succeeding.
        Promise.resolve(ptCaptureDeepValueSuccess(t,data)).catch(e=>console.warn("Research Universe capture deferred:",t,e));
        snap=fresh;
      }
      ptRenderPortfolioDVCard(t,x.weight,snap,null);
    }catch(e){
      console.warn("Automatic portfolio company research failed:",t,e);
      const reason=e?.message||String(e||"Unknown data-provider error");
      const el=document.getElementById("ptPDV-"+t);
