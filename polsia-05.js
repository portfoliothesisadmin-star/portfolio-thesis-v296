  document.getElementById("analysisStamp").textContent=p.length+" securities • generated "+new Date().toLocaleString();
  document.getElementById("aStructure").textContent =
    `${top.ticker} is the largest position at ${pct(top.weight)}. ${maxRole[0]} exposures represent about ${pct(maxRole[1])} of the portfolio. `+
    (cores.length?`The core is anchored by ${cores.map(x=>x.ticker).join(", ")}.`:"No holding is currently classified as a broad core.");
  document.getElementById("aDiversification").textContent =
    divs.length ? `${divs.map(x=>x.ticker).join(", ")} add classified diversifying exposure. The next production layer will test underlying holdings, geography and sector overlap rather than assuming different tickers equal diversification.`
                : `There is no separately classified diversifier in this portfolio. Different securities may still overlap substantially, so ticker count alone should not be treated as diversification.`;
  document.getElementById("aConcentration").textContent =
    top.weight>=40 ? `${top.ticker} is ${pct(top.weight)} of the portfolio, so results will be meaningfully influenced by that single allocation. Production analysis will also measure company, sector, geography and factor stacking.`
                   : `No single entered position exceeds 40%. Production analysis will look beneath fund names for company, sector, geography and factor concentration.`;
  document.getElementById("aValuation").textContent =
    tilts.length ? `${tilts.map(x=>x.ticker).join(", ")} are classified as tilts, so valuation and factor exposure deserve separate review from the broad-market core. Live valuation conclusions are intentionally withheld until current licensed data is connected.`
                 : `Live valuation conclusions require current fundamentals and fund data. This prototype will not invent valuation figures.`;
  document.getElementById("aBehavior").textContent =
    tilts.length ? `The portfolio contains deliberate tilts (${tilts.map(x=>x.ticker).join(", ")}). Those can lag broad markets for long periods; the behavioral test is whether the investor understands the reason for the tilt before that underperformance occurs.`
                 : `The main behavioral risk is changing the allocation because of short-term performance rather than a change in the underlying thesis.`;
  document.getElementById("aThesis").textContent =
    `Current structure: ${p.map(x=>`${x.ticker} ${pct(x.weight)}`).join(" • ")}. A thesis review should focus on whether the intended roles, diversification and assumptions changed—not merely whether prices moved.`+
    (unknown.length?` ${unknown.map(x=>x.ticker).join(", ")} still need full production classification.`:"");
  document.getElementById("analysisResults").classList.add("show");
  panel.scrollIntoView({behavior:"smooth",block:"start"});
  window.currentPTAnalysis={createdAt:new Date().toISOString(),portfolio:p,total,roles,
    summary:{
      structure:document.getElementById("aStructure").textContent,
      diversification:document.getElementById("aDiversification").textContent,
      concentration:document.getElementById("aConcentration").textContent,
      valuation:document.getElementById("aValuation").textContent,
      behavior:document.getElementById("aBehavior").textContent,
      thesis:document.getElementById("aThesis").textContent
    }};
  syncWorkingPortfolio();
}
function saveThesisSnapshot(){
  if(!window.currentPTAnalysis){analyzePortfolio(); if(!window.currentPTAnalysis)return;}
  const h=JSON.parse(localStorage.getItem("pt_thesis_history")||"[]");
  h.unshift(window.currentPTAnalysis); localStorage.setItem("pt_thesis_history",JSON.stringify(h.slice(0,20)));
  renderHistory(); alert("Thesis snapshot saved on this device.");
}
function renderHistory(){
  const el=document.getElementById("snapshotHistory");
  const h=JSON.parse(localStorage.getItem("pt_thesis_history")||"[]");
  el.innerHTML="<b>Saved Thesis History</b>"+(h.length?h.map((x,i)=>`<div class="history-row"><span>${new Date(x.createdAt).toLocaleString()}<br><small>${x.portfolio.map(y=>y.ticker+" "+pct(y.weight)).join(" • ")}</small></span><span>#${h.length-i}</span></div>`).join(""):`<p class="muted">No snapshots saved yet.</p>`);
}
function toggleHistory(){
  const el=document.getElementById("snapshotHistory"); renderHistory();
  el.style.display=el.style.display==="none"?"block":"none";
}


function portfolioMap(p){const m={};(p||[]).forEach(x=>m[x.ticker]=x.weight);return m}
function buildChangeNarrative(old,cur,added,removed,changed){
  const parts=[];
  if(added.length) parts.push(`Added ${added.join(", ")}.`);
  if(removed.length) parts.push(`Removed ${removed.join(", ")}.`);
  if(changed.length){
    const inc=changed.filter(x=>x.delta>0).sort((a,b)=>b.delta-a.delta);
    const dec=changed.filter(x=>x.delta<0).sort((a,b)=>a.delta-b.delta);
    if(inc.length && dec.length){
      parts.push(`The largest reallocation increased ${inc[0].ticker} by ${pct(inc[0].delta)} while reducing ${dec[0].ticker} by ${pct(Math.abs(dec[0].delta))}.`);
    } else {
      parts.push(`Allocations changed in ${changed.map(x=>x.ticker).join(", ")}.`);
    }
  }
  const oldRoles=old.roles||{}, newRoles=cur.roles||{};
  const roleChanges=[...new Set([...Object.keys(oldRoles),...Object.keys(newRoles)])]
    .map(r=>({r,delta:(newRoles[r]||0)-(oldRoles[r]||0)})).filter(x=>Math.abs(x.delta)>.001)
    .sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta));
  if(roleChanges.length){
    parts.push(`At the role level, ${roleChanges.slice(0,2).map(x=>`${x.r} ${x.delta>0?"increased":"decreased"} by ${pct(Math.abs(x.delta))}`).join(" and ")}.`);
  }
  parts.push("Use Thesis Review to record whether this was a rebalance or a genuine change in your investment thesis.");
  return parts.join(" ");
}
function compareLatest(){
  if(!window.currentPTAnalysis){analyzePortfolio(); if(!window.currentPTAnalysis)return}
  const history=JSON.parse(localStorage.getItem("pt_thesis_history")||"[]");
  const box=document.getElementById("changeBox"); box.style.display="block";
  if(!history.length){
    box.innerHTML='<b>What Changed?</b><p class="change-none">No earlier thesis snapshot exists yet. Save this analysis first. On a later review, Portfolio Thesis will compare the new portfolio with this baseline.</p>';
    return;
  }
  const old=history[0], cur=window.currentPTAnalysis, a=portfolioMap(old.portfolio), b=portfolioMap(cur.portfolio);
  const added=Object.keys(b).filter(k=>!(k in a));
  const removed=Object.keys(a).filter(k=>!(k in b));
  const changed=Object.keys(b).filter(k=>k in a && Math.abs(b[k]-a[k])>.001)
    .map(k=>({ticker:k,from:a[k],to:b[k],delta:b[k]-a[k]}));
  const oldTop=[...(old.portfolio||[])].sort((x,y)=>y.weight-x.weight)[0];
  const newTop=[...(cur.portfolio||[])].sort((x,y)=>y.weight-x.weight)[0];
  let cards=[];
  cards.push(`<div class="changeitem"><b>Holdings added</b>${added.length?added.join(", "):"None"}</div>`);
  cards.push(`<div class="changeitem"><b>Holdings removed</b>${removed.length?removed.join(", "):"None"}</div>`);
  cards.push(`<div class="changeitem"><b>Allocation changes</b>${changed.length?changed.map(x=>`${x.ticker}: ${pct(x.from)} → ${pct(x.to)} (${x.delta>0?"+":""}${pct(x.delta)})`).join("<br>"):"No allocation changes"}</div>`);
  const topText=oldTop&&newTop ? ((oldTop.ticker===newTop.ticker && Math.abs(oldTop.weight-newTop.weight)<.001) ? `${newTop.ticker} remains the largest position at ${pct(newTop.weight)}.` : `${oldTop.ticker} ${pct(oldTop.weight)} → ${newTop.ticker} ${pct(newTop.weight)}`) : "Not available";
  cards.push(`<div class="changeitem"><b>Largest position</b>${topText}</div>`);
  const noChange=!added.length&&!removed.length&&!changed.length;
  box.innerHTML=`<div class="eyebrow">THESIS REVIEW</div><h3 style="margin:4px 0">What Changed?</h3>
    <p class="muted">Compared with your most recent saved thesis from ${new Date(old.createdAt).toLocaleString()}.</p>
    <div class="changegrid">${cards.join("")}</div>
    <div class="thesislog"><b>${noChange?"Portfolio structure is unchanged.":"Portfolio structure changed."}</b>
    <p class="muted">${noChange?"The holdings and allocations match the saved baseline. A production review would next test whether fundamentals, valuation, fund exposures or thesis assumptions changed.":buildChangeNarrative(old,cur,added,removed,changed)}</p></div>
    ${noChange?"":'<button class="btn watchbtn" onclick="openThesisReview()">Review This Change →</button>'}`;
}


function openThesisReview(){
  const el=document.getElementById("thesisReview"); el.classList.add("show");
  const h=JSON.parse(localStorage.getItem("pt_thesis_history")||"[]");
  if(h.length && window.currentPTAnalysis){
    const a=portfolioMap(h[0].portfolio), b=portfolioMap(window.currentPTAnalysis.portfolio);
    const c=Object.keys(b).filter(k=>k in a && Math.abs(b[k]-a[k])>.001)
      .map(k=>`${k} ${pct(a[k])} → ${pct(b[k])}`);
    document.getElementById("reviewPrompt").textContent=c.length?`You changed ${c.join(" • ")}. Record why so a future review preserves the context.`:"Record why you changed the portfolio so the next review has context.";
  }
  el.scrollIntoView({behavior:"smooth",block:"start"});
}
function saveThesisReview(){
  const reason=document.querySelector('input[name="reason"]:checked')?.value;
  const status=document.querySelector('input[name="thesisStatus"]:checked')?.value;
  const note=document.getElementById("reviewNote").value.trim();
  if(!reason || !status){alert("Choose a reason and thesis status before saving.");return}
  const review={createdAt:new Date().toISOString(),reason,status,note,analysis:window.currentPTAnalysis||null};
  const reviews=JSON.parse(localStorage.getItem("pt_thesis_reviews")||"[]");
  reviews.unshift(review); localStorage.setItem("pt_thesis_reviews",JSON.stringify(reviews.slice(0,20)));
  document.getElementById("reviewSaved").innerHTML=`<div class="savedreview"><b>Review saved</b><br>Thesis: ${status} • Reason: ${reason}${note?`<br>${note}`:""}</div>`;
}



const ACADEMY_LESSONS={
assets:{level:"INVESTING 101",title:"Stocks, ETFs & Bonds",body:`<p>These are three different building blocks. A <b>stock</b> is ownership in one company. An <b>ETF</b> is a fund that can hold many securities and trades like a stock. A <b>bond</b> is primarily a lending relationship: the issuer borrows money and promises interest and repayment.</p><h4>Why the distinction matters</h4><p>A portfolio can contain several tickers while still being concentrated in the same underlying companies or risk factors. Start with what each holding actually owns and what job it is meant to do.</p><h4>Portfolio Thesis takeaway</h4><p>Do not classify a holding by its ticker alone. Identify the asset, its exposures, and its intended role before deciding whether it improves the portfolio.</p>`},
roles:{level:"BUILDING A PORTFOLIO",title:"Core, Diversifier & Tilt",body:`<p>A <b>core</b> holding supplies broad exposure you intend to keep for the long term. A <b>diversifier</b> adds meaningful exposure that the core lacks. A <b>tilt</b> deliberately overweights a characteristic, segment, or factor because you want more of that exposure.</p><h4>Why roles help</h4><p>Giving every holding a job makes additions easier to evaluate. Instead of asking “Do I like this fund?” ask “What does this add that my portfolio does not already have?”</p><h4>Portfolio Thesis takeaway</h4><p>A good role is specific enough that you can later test whether the holding is still doing the job you bought it to do.</p>`},
overlap:{level:"BUILDING A PORTFOLIO",title:"Portfolio Overlap",body:`<p>Two funds can have different names and still own many of the same securities. Adding a second fund therefore does not automatically create meaningful diversification.</p><h4>What to review</h4><p>Look at underlying holdings, geographic exposure, sectors, company size, and factor exposure. Then ask whether the new fund changes the portfolio or mostly repackages what is already there.</p><h4>Portfolio Thesis takeaway</h4><p>Count exposures, not ticker symbols.</p>`},
value:{level:"VALUATION",title:"Price vs. Value",body:`<p>A strong business or fund can still be a poor purchase at an extreme price. Price is what the market asks today; value is an estimate based on the cash flows, assets, durability, and risks behind the investment.</p><h4>Margin of safety</h4><p>Because valuation is uncertain, disciplined investors often look for room between estimated value and purchase price rather than treating an estimate as exact.</p><h4>Portfolio Thesis takeaway</h4><p>Separate the question “Is this a good asset?” from “Is this an attractive price?”</p>`},
thesis:{level:"BEHAVIOR",title:"Staying With a Thesis",body:`<p>Price declines and uncomfortable periods do not automatically mean an investment thesis failed. The useful question is whether the evidence supporting the original decision materially changed.</p><h4>Review the evidence</h4><p>Compare current fundamentals, valuation, exposures, balance-sheet strength, and the holding's portfolio role with the assumptions you recorded earlier.</p><h4>Portfolio Thesis takeaway</h4><p>Write the thesis before emotions are tested. Later, compare evidence with that record rather than rewriting the story from memory.</p>`},
concentration:{level:"RISK",title:"Concentration Risk",body:`<p>Concentration occurs when one company, sector, country, strategy, or factor can dominate portfolio outcomes. It can happen directly through a large position or indirectly through overlapping funds.</p><h4>Intentional vs. accidental</h4><p>A deliberate concentration can be part of a strategy, but it should be recognized and sized consciously. Accidental concentration is harder to manage because the investor may not know it exists.</p><h4>Portfolio Thesis takeaway</h4><p>Measure the exposure underneath the holdings, then decide whether that concentration matches the thesis.</p>`},
diversification:{level:"BUILDING A PORTFOLIO",title:"What Diversification Really Means",body:`<p>Diversification is not a ticker count. It is the degree to which a portfolio owns <b>different economic exposures</b> whose outcomes are not driven by exactly the same forces.</p><h4>Three layers to inspect</h4><p><b>Security diversification</b> asks how many underlying companies or bonds you own. <b>Exposure diversification</b> asks whether those holdings differ by geography, sector, size, style or asset class. <b>Driver diversification</b> asks whether the sources of return are genuinely different.</p><h4>Why look-through matters</h4><p>Two ETFs can each own hundreds of securities while sharing many of the same companies. Portfolio Thesis therefore measures underlying overlap and effective company exposure whenever constituent data is available.</p><h4>Portfolio Thesis takeaway</h4><p>A diversified-looking portfolio can still depend on the same companies, market regime or factor. Measure what is underneath.</p>`},
