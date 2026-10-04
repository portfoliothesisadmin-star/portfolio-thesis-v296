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
      if(el)el.innerHTML=`<div class="ptr-security-head"><div class="ptr-individual-top"><b>${ptEsc(t)}</b><span class="ptr-individual-weight">${Number(x.weight).toFixed(0)}%</span></div></div><div class="ptr-dv-unavailable"><b>Automatic Deep Value research failed.</b><br>${ptEsc(reason)}<br><br>The portfolio report will not invent missing company evidence.</div><button class="ptr-dv-open" onclick="ptOpenCompanyFromPortfolio('${ptEsc(t)}')">Open Deep Value Report</button>`;
    }
  }
}
async function ptOpenCompanyFromPortfolio(t){
  closePortfolioReport();
  try{await openDeepValue(String(t||"").toUpperCase());}catch(e){if(typeof ptGoCompany==="function")ptGoCompany();}
}
function closePortfolioReport(){
  document.getElementById("ptGeneratedReport").classList.remove("active");
  document.body.classList.remove("pt-report-open");
  const b=document.getElementById("builder"); if(b)b.scrollIntoView({behavior:"smooth",block:"start"});
}
// Hook existing Analyze button without replacing its existing analysis/sync behavior.
document.addEventListener("DOMContentLoaded",()=>{
 const candidates=[...document.querySelectorAll("button")].filter(b=>/analyze my portfolio/i.test(b.textContent||""));
 candidates.forEach(btn=>btn.addEventListener("click",()=>setTimeout(ptGeneratePortfolioPublication,80)));
});


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


// V62 Deep Value publication renderer. Reads the already-rendered Deep Value evidence; no scoring/DCF logic is changed.
function dvTxt(sel,root=document){const e=root.querySelector(sel);return e?e.textContent.trim():"";}
function dvFindText(label){
 const all=[...document.querySelectorAll("body *")];
 const e=all.find(x=>x.children.length===0 && (x.textContent||"").trim().toLowerCase().startsWith(label.toLowerCase()));
 return e?(e.textContent||"").trim():"";
}
function openDVReport(requestedTicker){
 const dv=document.querySelector("#deepValue")||document;
 const raw=dv.innerText||"";
 const ticker=String(requestedTicker||document.getElementById("dvCompanySymbol")?.textContent||"COMPANY").trim().toUpperCase();
 const companyName=(document.getElementById("dvCompanyName")?.textContent||ticker).trim();
 const scoreMatch=raw.match(/Evidence score[:\s]+(\d+)\s*\/\s*100/i)||raw.match(/(\d+)\s*\/\s*100/);
 const score=scoreMatch?Number(scoreMatch[1]):null;
 const comp=(raw.match(/(\d+)%\s*complete/i)||[])[1]||"—";
 const price=(raw.match(/Price[:\s]+\$?([\d,.]+)/i)||[])[1];
 const mcap=(raw.match(/Market cap[:\s]+\$?([\d,.]+[TBMK]?)/i)||[])[1];
 const fcf=(raw.match(/FCF[:\s]+\$?([\d,.]+[TBMK]?)/i)||[])[1];
 const fcfy=(raw.match(/FCF yield[:\s]+([\d.]+%)/i)||[])[1];
 const op=(raw.match(/Operating income[:\s]+\$?([\d,.]+[TBMK]?)/i)||[])[1];
 const ni=(raw.match(/Net income[:\s]+\$?([\d,.]+[TBMK]?)/i)||[])[1];
 const cats=["Financial Strength","Earning Power","Cash Generation & Quality","Capital Discipline","Valuation"];
 const catData=cats.map(n=>{const esc=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");const m=raw.match(new RegExp(esc+"[\\s\\S]{0,90}?(\\d+)\\s*\\/\\s*20","i"));return [n,m?Number(m[1]):null]});
 const con=(raw.match(/Conservative(?: value)?[:\s]+\$([\d,.]+)/i)||[])[1];
 const base=(raw.match(/Base(?: normalized value)?[:\s]+\$([\d,.]+)/i)||[])[1];
 const fav=(raw.match(/Favorable(?: scenario)?[:\s]+\$([\d,.]+)/i)||[])[1];
 const implied=(raw.match(/market-implied FCF growth[:\s]+(-?[\d.]+%)/i)||raw.match(/(-?[\d.]+%)\s*annualized in years 1[–-]5/i)||[])[1];
 const ep=(raw.match(/Base earnings-power reference[:\s]+\$([\d,.]+)/i)||[])[1];
 const agree=(raw.match(/Method agreement[:\s]+([A-Za-z]+)/i)||[])[1];
 const fmt=x=>x?("$"+x):"—";
 const date=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",year:"numeric"}).format(new Date());
 document.getElementById("ptDVReportBody").innerHTML=`
 <article class="ptdv-page ptdv-cover"><div class="ptdv-kicker">AUTOMATED DEEP VALUE REPORT</div><h1>${ticker}</h1><div style="font-size:18px;font-weight:750;margin:-2px 0 10px">${ptEsc(companyName)}</div><div class="ptdv-sub">Financial evidence, normalized valuation and market expectations organized into one compact research report.</div><div class="ptdv-scorehero"><div class="ptdv-ring" style="--score:${score||0}%"><div><b>${score??"—"}</b><span>EVIDENCE SCORE / 100</span></div></div><div><div class="ptdv-kicker">EVIDENCE COMPLETE</div><b style="font-size:26px">${comp}%</b><p class="ptr-small">${date}${price?" · $"+price:""}</p></div></div><div class="ptdv-num">01</div></article>
 <article class="ptdv-page"><div class="ptdv-kicker">EVIDENCE DASHBOARD</div><h2 class="ptr-section-title">Quality, cash generation and valuation.</h2><div class="ptdv-grid"><div class="ptdv-metric"><span>Price</span><b>${fmt(price)}</b></div><div class="ptdv-metric"><span>Market cap</span><b>${fmt(mcap)}</b></div><div class="ptdv-metric"><span>Free cash flow</span><b>${fmt(fcf)}</b></div><div class="ptdv-metric"><span>FCF yield</span><b>${fcfy||"—"}</b></div><div class="ptdv-metric"><span>Operating income</span><b>${fmt(op)}</b></div><div class="ptdv-metric"><span>Net income</span><b>${fmt(ni)}</b></div></div><div class="ptdv-bars">${catData.map(([n,v])=>`<div class="ptdv-bar"><b>${n}</b><div class="ptdv-track"><div class="ptdv-fill" style="width:${v==null?0:v*5}%"></div></div><span>${v==null?"—":v+"/20"}</span></div>`).join("")}</div><div class="ptdv-callout"><b>${score??"—"}/100 evidence score</b><br><small>Missing evidence remains unscored and is reflected separately through completeness. Margin of Safety is not part of this score.</small></div><div class="ptdv-num">02</div></article>
 <article class="ptdv-page"><div class="ptdv-kicker">MARGIN OF SAFETY</div><h2 class="ptr-section-title">Normalized value versus market price.</h2><div class="ptdv-cases"><div class="ptdv-case"><span>Cautious Scenario</span><b>${fmt(con)}</b></div><div class="ptdv-case"><span>Normalized Scenario</span><b>${fmt(base)}</b></div><div class="ptdv-case"><span>Stronger-Growth Scenario</span><b>${fmt(fav)}</b></div></div><div class="ptdv-two"><div class="ptdv-box"><h4>Current market</h4><p><b style="font-size:21px">${fmt(price)}</b></p><p>Compare price with the normalized base case and sensitivity scenarios rather than treating the full range as a single fair value.</p></div><div class="ptdv-box"><h4>Market-implied growth</h4><p><b style="font-size:21px">${implied||"—"}</b></p><p>Annualized FCF growth implied by the market under the base DCF assumptions when available.</p></div><div class="ptdv-box"><h4>Earnings-power cross-check</h4><p><b style="font-size:21px">${fmt(ep)}</b></p><p>Separate normalized earnings reference used to cross-check the cash-flow valuation.</p></div><div class="ptdv-box"><h4>Method agreement</h4><p><b style="font-size:21px">${agree||"—"}</b></p><p>Describes how closely the DCF and earnings-power estimates align; it is not a quality or return forecast.</p></div></div><div class="ptdv-num">03</div></article>
 <article class="ptdv-page"><div class="ptdv-kicker">RESEARCH SYNTHESIS</div><h2 class="ptr-section-title">What the evidence says to review.</h2><div class="ptdv-two"><div class="ptdv-box"><h4>Business evidence</h4><ul>${catData.slice(0,4).map(([n,v])=>`<li><b>${n}</b> — ${v==null?"evidence incomplete":v+"/20 measured evidence"}</li>`).join("")}</ul></div><div class="ptdv-box"><h4>Valuation evidence</h4><ul><li><b>Valuation</b> — ${catData[4][1]==null?"evidence incomplete":catData[4][1]+"/20 measured evidence"}</li><li><b>Base DCF</b> — ${fmt(base)}</li><li><b>Earnings power</b> — ${fmt(ep)}</li><li><b>Implied growth</b> — ${implied||"—"}</li></ul></div></div><div class="ptdv-callout"><b>Research discipline</b><br><small>Separate business quality from price. Revisit the thesis when financial evidence, normalized earning power, capital structure or valuation assumptions materially change—not because the share price moved by itself.</small></div><p class="ptr-small">Portfolio Thesis is educational research, not individualized investment, tax or legal advice.</p><div class="ptdv-num">04</div></article>`;
 document.getElementById("ptDVGeneratedReport").classList.add("active");
 setTimeout(()=>ptAutoSaveDeepValueReport(ticker),0);
 [...document.body.children].forEach(el=>{if(el.id!=="ptDVGeneratedReport"&&el.tagName!=="SCRIPT"){el.dataset.ptDvDisplay=el.style.display;el.style.display="none"}});
 window.scrollTo(0,0);
}
function closeDVReport(){document.getElementById("ptDVGeneratedReport").classList.remove("active");[...document.body.children].forEach(el=>{if(el.id!=="ptDVGeneratedReport"&&el.tagName!=="SCRIPT"){el.style.display=el.dataset.ptDvDisplay||"";delete el.dataset.ptDvDisplay}});const d=document.querySelector("#deepValue");if(d)d.scrollIntoView({behavior:"smooth",block:"start"})}
document.addEventListener("DOMContentLoaded",()=>{
 const observer=new MutationObserver(()=>{
  const dv=document.querySelector("#deepValue"); if(!dv)return;
  [...dv.querySelectorAll("button")].forEach(btn=>{
   if(/view analysis/i.test(btn.textContent||"")&&!btn.dataset.ptReportHook){btn.dataset.ptReportHook="1";btn.addEventListener("click",()=>setTimeout(()=>{const txt=dv.innerText||"";if(/evidence score/i.test(txt)&&!document.querySelector("#ptOpenDVReport")){const b=document.createElement("button");b.id="ptOpenDVReport";b.className=btn.className;b.textContent="Open Deep Value Report";b.onclick=openDVReport;btn.parentElement?.appendChild(b)}},700))}
  })
 });
 observer.observe(document.body,{childList:true,subtree:true});
});


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


// V63: View Analysis now opens the publication report automatically after live evidence renders.
(function(){
  function readyForDVReport(){
    const dv=document.querySelector("#deepValue");
    if(!dv) return false;
    const t=dv.innerText||"";
    return /Evidence score/i.test(t) && /\d+\s*\/\s*100/.test(t);
  }
  document.addEventListener("click",function(e){
    const btn=e.target.closest&&e.target.closest("button");
    if(!btn || !/view analysis/i.test(btn.textContent||"")) return;
    let tries=0;
    const wait=setInterval(function(){
      tries++;
      if(readyForDVReport()){
        clearInterval(wait);
        // remove redundant generated-report launch button from V62 if observer created it
        const extra=document.getElementById("ptOpenDVReport");
        if(extra) extra.remove();
        openDVReport();
      } else if(tries>=30){ clearInterval(wait); }
    },250);
  },true);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


// V65 — populate publication directly from the completed Deep Value DOM.
// This avoids reparsing the entire section as free-form text.
window.openDVReport=function(requestedTicker){
 const ticker=String(requestedTicker||document.getElementById("dvCompanySymbol")?.textContent||"COMPANY").trim().toUpperCase();
 const companyName=(document.getElementById("dvCompanyName")?.textContent||ticker).trim();
 const scoreText=(document.getElementById("dvTotalScore")?.textContent||"—").trim();
 const score=/^\d+$/.test(scoreText)?Number(scoreText):null;
 const completenessText=(document.getElementById("dvCompleteness")?.textContent||"").trim();
 const compMatch=completenessText.match(/(\d+)%/);
 const comp=compMatch?compMatch[1]:"—";
 const price=(document.getElementById("dvPrice")?.textContent||"—").trim();
 const marketCap=(document.getElementById("dvMarketCap")?.textContent||"—").replace(/^Market cap\s*/i,"").trim();

 const metricMap={};
 document.querySelectorAll("#dvMetrics .dv-metric").forEach(el=>{
   const k=(el.querySelector("span")?.textContent||"").trim().toLowerCase();
   const v=(el.querySelector("b")?.textContent||"—").trim();
   if(k) metricMap[k]=v;
 });
 const cats=[];
 document.querySelectorAll("#dvScoreRows .dv-score-row").forEach(row=>{
   const name=(row.querySelector("b")?.textContent||"").trim();
   const pts=(row.querySelector(".dv-score-points")?.textContent||"").trim();
   const m=pts.match(/(\d+)\s*\/\s*(?:20|\d+\s*measured)/i)||pts.match(/^(\d+)/);
   if(name) cats.push([name,m?Number(m[1]):null]);
 });
 const wanted=["Financial Strength","Earning Power","Cash Generation & Quality","Capital Discipline","Valuation"];
 const catData=wanted.map(n=>cats.find(x=>x[0]===n)||[n,null]);

 const cases=[...document.querySelectorAll("#dvMosGrid .dv-mos-case")].map(el=>({
   name:(el.querySelector("span")?.textContent||"").trim(),
   value:(el.querySelector("b")?.textContent||"—").trim(),
   compare:(el.querySelector("small")?.textContent||"").trim()
 }));
 const caseVal=(needle)=>{
   const direct=window.ptDVValuation||{};
   const key=needle==="conservative"?"cautious":needle==="base"?"normalized":needle==="favorable"?"stronger":null;
   if(key && direct[key]!=null && Number.isFinite(Number(direct[key]))) return "$"+Number(direct[key]).toFixed(2);
   return cases.find(x=>x.name.toLowerCase().includes(needle))?.value||"—";
 };
 const mosSummary=(document.getElementById("dvMosSummary")?.innerText||"").trim();
 const directImplied=window.ptDVValuation?.marketImpliedGrowthPct;
 const implied=(directImplied!=null&&Number.isFinite(Number(directImplied)))
   ? `${Number(directImplied).toFixed(1)}%`
   : ((mosSummary.match(/Market-implied FCF growth:\s*(-?[\d.]+%)/i)||[])[1]||"—");
 const baseCompare=(mosSummary.match(/Base-case comparison:\s*([^.]+(?:estimated value)?)/i)||[])[1]||"—";

 const epx=(document.getElementById("dvEpxBox")?.innerText||"").trim();
 const ep=(epx.match(/Base earnings-power reference:\s*(\$[\d,.]+)/i)||[])[1]||"—";
 const agree=(epx.match(/Method agreement:\s*([A-Za-z]+)/i)||[])[1]||"—";
 const divergence=(epx.match(/Method divergence:\s*([\d.]+%)/i)||[])[1]||"—";
 const date=new Intl.DateTimeFormat("en-US",{month:"long",day:"numeric",year:"numeric"}).format(new Date());
 const esc=(x)=>ptEsc(String(x??"—"));
 const val=(key)=>esc(metricMap[key]||"—");

 document.getElementById("ptDVReportBody").innerHTML=`
 <article class="ptdv-page ptdv-cover"><div class="ptdv-kicker">AUTOMATED DEEP VALUE REPORT</div><h1>${esc(ticker)}</h1><div style="font-size:18px;font-weight:750;margin:-2px 0 10px">${esc(companyName)}</div><div class="ptdv-sub">Financial evidence, normalized valuation and market expectations organized into one compact research report.</div><div class="ptdv-scorehero"><div class="ptdv-ring" style="--score:${score||0}%"><div><b>${score??"—"}</b><span>EVIDENCE / 100</span></div></div><div><div class="ptdv-kicker">EVIDENCE COMPLETENESS</div><b style="font-size:26px">${esc(comp)}${comp!=="—"?"%":""}</b><p class="ptr-small">${date} · ${esc(price)}</p></div></div><div class="ptdv-num">01</div></article>
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
