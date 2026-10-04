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
