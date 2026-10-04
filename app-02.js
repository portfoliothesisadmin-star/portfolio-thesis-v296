function refresh(el){let t=el.value.trim().toUpperCase(),r=el.closest(".holding");r.querySelector(".security-name").innerHTML=(DB[t]?.[0]||"Production security lookup")+`<br><span class="tag">${DB[t]?.[1]||"Unclassified"}</span>`;total()}
function total(){let n=[...document.querySelectorAll(".weight")].reduce((a,e)=>a+(+e.value||0),0),e=document.getElementById("total");e.textContent=n+"% total";e.style.color=n===100?"#0d5a43":"#a42b2b"}
function quickAdd(){let e=document.getElementById("quickTicker"),t=e.value.trim().toUpperCase();if(t){addRow(t,0);e.value=""}}
function sample(){document.getElementById("rows").innerHTML="";addRow("VOO",60);addRow("QQQM",20);addRow("AAPL",10);addRow("SCHD",10)}
function analyze(){let a=[...document.querySelectorAll(".holding")].map(r=>({t:r.querySelector(".ticker").value.trim().toUpperCase(),w:+r.querySelector(".weight").value||0})).filter(x=>x.t),sum=a.reduce((s,x)=>s+x.w,0);document.getElementById("result").style.display="block";document.getElementById("resultTitle").textContent=sum===100?"A portfolio with identifiable roles":"Complete the allocation first";document.getElementById("summary").textContent=sum===100?`${a.length} holdings form this portfolio. Portfolio Thesis separates their intended jobs from the number of ticker symbols.`:`Your allocation totals ${sum}%. Bring it to 100% for a complete portfolio-level interpretation.`;document.getElementById("roles").innerHTML=a.map(x=>{let q=DB[x.t]||["Live security data required","Unclassified"];return `<div class="role"><b>${x.t} — ${x.w}%</b><span class="tag">${q[1]}</span><div class="muted">${q[0]}</div></div>`}).join("")}
addRow("VTI",60);addRow("VXUS",20);addRow("AVUV",10);addRow("AVDV",10);

function getPortfolio(){
  return [...document.querySelectorAll(".holding")].map(r=>{
    const ticker=(r.querySelector(".ticker")?.value||"").trim().toUpperCase();
    const input=r.querySelector(".weightbox input");
    const weight=parseFloat(input?.value||0)||0;
    const d=DB[ticker]||["Unknown security","Unclassified"];
    return {ticker,name:d[0],role:d[1],weight};
  }).filter(x=>x.ticker && x.weight>0);
}
function pct(n){return Math.round(n*10)/10+"%"}

/* V15: invisible persistence foundation — no visible Builder/UI changes */
const PT_PORTFOLIO_KEY="pt_working_portfolio_v1";
function saveWorkingPortfolioLocal(){
  const p=getPortfolio();
  localStorage.setItem(PT_PORTFOLIO_KEY,JSON.stringify(p));
  return p;
}
function loadWorkingPortfolioLocal(){
  try{return JSON.parse(localStorage.getItem(PT_PORTFOLIO_KEY)||"[]")}catch(e){return []}
}
function ptCurrentPortfolioName(){
  const el=document.getElementById("ptPortfolioName");
  const name=String(el?.value||"My Portfolio").trim().slice(0,60);
  return name||"My Portfolio";
}
async function syncWorkingPortfolio(){
  const p=saveWorkingPortfolioLocal();
  const name=ptCurrentPortfolioName();
  localStorage.setItem("pt_working_portfolio_name",name);
  window.ptActivePortfolioName=name;
  if(!window.ptSupabase||!window.ptUser)return;
  const payload={user_id:window.ptUser.id,name,portfolio:p,updated_at:new Date().toISOString()};
  const {error}=await window.ptSupabase.from("member_portfolios").upsert(payload,{onConflict:"user_id,name"});
  if(error) console.warn("Portfolio cloud sync pending:",error.message);
}

async function loadMyPortfolio(){
  if(!window.ptSupabase||!window.ptUser){authMsg("Sign in first.",true);return;}
  authMsg("Loading your saved portfolio…");
  const {data,error}=await window.ptSupabase.from("member_portfolios")
    .select("portfolio,updated_at").eq("user_id",window.ptUser.id).eq("name","My Portfolio").maybeSingle();
  if(error){authMsg("Could not load the saved portfolio: "+error.message,true);return;}
  if(!data?.portfolio?.length){authMsg("No saved portfolio was found for this account.",true);return;}
  const rows=document.getElementById("rows");
  rows.innerHTML="";
  data.portfolio.forEach(x=>addRow(x.ticker||"",Number(x.weight)||0));
  total();
  document.getElementById("ptAccountPanel")?.remove();
  document.getElementById("builder").scrollIntoView({behavior:"smooth",block:"start"});
}
function analyzePortfolio(){
  const p=getPortfolio(), panel=document.getElementById("analysisPanel");
  if(!p.length){alert("Add at least one security and allocation first.");return}
  const total=p.reduce((a,x)=>a+x.weight,0);
  const roles={}; p.forEach(x=>roles[x.role]=(roles[x.role]||0)+x.weight);
  const sorted=[...p].sort((a,b)=>b.weight-a.weight), top=sorted[0];
  const cores=p.filter(x=>x.role==="Core"), divs=p.filter(x=>x.role==="Diversifier");
  const tilts=p.filter(x=>x.role==="Tilt"), income=p.filter(x=>/Income|Bond/i.test(x.role));
  const unknown=p.filter(x=>x.role==="Unclassified");
  const maxRole=Object.entries(roles).sort((a,b)=>b[1]-a[1])[0];

  document.getElementById("allocationStatus").textContent=pct(total)+" allocated";
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
marketcap:{level:"INVESTING 101",title:"Market Cap & Portfolio Weight",body:`<p><b>Market capitalization</b> is a company's share price multiplied by shares outstanding. In a market-cap-weighted index, larger companies receive larger weights.</p><h4>Why this matters inside an ETF</h4><p>A fund can own thousands of companies and still have a meaningful share of its assets concentrated in its largest holdings. Holdings count measures breadth; top-holdings weight measures how evenly that breadth is distributed.</p><h4>Effective exposure</h4><p>If an ETF is 60% of your portfolio and a company is 6% of that ETF, the ETF contributes about 3.6 percentage points of portfolio exposure to that company before considering any other funds that also own it.</p><h4>Portfolio Thesis takeaway</h4><p>Broad ownership and equal ownership are different things. Always pair holdings count with concentration.</p>`},
factors:{level:"PORTFOLIO CONSTRUCTION",title:"Factor Tilts",body:`<p>A factor tilt deliberately changes the weights the broad market would otherwise assign. Common examples include <b>size</b>, <b>value</b>, <b>profitability</b>, momentum and investment.</p><h4>What a tilt actually does</h4><p>Adding a small/value fund does not simply add more stocks. It gives selected smaller and cheaper companies more influence than they receive in a market-cap-weighted portfolio.</p><h4>The cost of being different</h4><p>A distinct tilt creates <b>tracking error</b>: the portfolio can behave differently from the broad market, sometimes for years. That difference is not automatically a failure; it is the consequence of owning a different exposure.</p><h4>Portfolio Thesis takeaway</h4><p>Judge a tilt by whether it remains distinct and intentional—not by whether it recently beat the core.</p>`},
multiples:{level:"VALUATION",title:"Valuation Multiples",body:`<p>Valuation multiples compress a relationship between market price and a business measure into a ratio. <b>P/E</b> compares price with earnings, <b>P/B</b> compares price with book value, and <b>EV/EBITDA</b> compares enterprise value with an operating earnings proxy.</p><h4>Useful, but incomplete</h4><p>A lower multiple can mean an asset is inexpensive, or it can reflect weaker growth, lower quality, higher leverage or greater risk. A higher multiple can reflect strong economics—or excessive expectations.</p><h4>Compare like with like</h4><p>Multiples are most informative when compared with the same company's history, a relevant peer group, or a fund's own historical characteristics.</p><h4>Portfolio Thesis takeaway</h4><p>A multiple is evidence about price relative to a financial measure. It is not an intrinsic-value estimate by itself.</p>`},
fcf:{level:"BUSINESS QUALITY",title:"Free Cash Flow",body:`<p><b>Free cash flow (FCF)</b> is the cash generated by operations after capital expenditures. It helps show how much cash remains after the business funds the assets needed to operate and grow.</p><h4>Why cash matters</h4><p>Accounting earnings include non-cash items and estimates. Comparing earnings with cash generation can reveal whether reported profits are translating into cash over time.</p><h4>What companies can do with FCF</h4><p>Free cash flow can be reinvested, used to reduce debt, returned through dividends or repurchases, or accumulated as cash. Capital allocation determines whether those choices create value.</p><h4>Portfolio Thesis takeaway</h4><p>Do not judge FCF from one year alone. Look for durability, conversion from earnings, reinvestment needs and how management deploys the cash.</p>`},
mos:{level:"VALUATION",title:"Margin of Safety",body:`<p>Valuation is an estimate, not a precise fact. A <b>margin of safety</b> compares the current price with an estimated value and shows how much room exists between them.</p><h4>Simple relationship</h4><p><b>Margin of Safety % = (Estimated Value − Price) ÷ Estimated Value × 100</b>.</p><p>If estimated value is $100 and price is $75, the margin of safety is 25%. If price is above estimated value, the result is negative.</p><h4>Scenario discipline</h4><p>Portfolio Thesis separates cautious, normalized and stronger-growth valuation scenarios because changing assumptions can materially change estimated value.</p><h4>Portfolio Thesis takeaway</h4><p>Margin of safety does not eliminate valuation error. It makes the relationship between your assumptions and the market price explicit.</p>`},
volatility:{level:"RISK",title:"Volatility, Drawdowns & Risk",body:`<p><b>Volatility</b> describes how widely returns vary. A <b>drawdown</b> measures the decline from a previous peak to a subsequent trough. Neither measure alone tells you whether an investment thesis is broken.</p><h4>Different kinds of risk</h4><p>Price volatility can be uncomfortable without permanently impairing value. Permanent loss can arise when fundamentals deteriorate, leverage becomes unmanageable, valuation was extreme, or an investor is forced to sell.</p><h4>Portfolio context</h4><p>A volatile 5% sleeve and a volatile 60% core do not create the same portfolio-level risk. Weight and correlation matter alongside the security's own behavior.</p><h4>Portfolio Thesis takeaway</h4><p>Use risk measures to understand the range and source of outcomes, then test whether the underlying thesis changed.</p>`},
rebalancing:{level:"PORTFOLIO MANAGEMENT",title:"Rebalancing",body:`<p>Rebalancing restores a portfolio toward its intended allocation after market movements or contributions change the weights.</p><h4>Maintenance, not prediction</h4><p>A rules-based rebalance does not require forecasting which asset will perform best next. It is a way to keep actual exposures aligned with the portfolio design.</p><h4>Trade-offs</h4><p>Rebalancing too frequently can create unnecessary taxes, spreads or trading. Rebalancing too rarely can allow a winning sleeve to become an unintended concentration. New contributions can sometimes move weights toward target without selling.</p><h4>Portfolio Thesis takeaway</h4><p>Start with the target role and weight. Rebalance because the portfolio drifted from its design—not because recent price movement feels uncomfortable.</p>`},
contribution:{level:"PERFORMANCE",title:"Return vs. Portfolio Contribution",body:`<p>A holding's return tells you how that holding performed. <b>Portfolio contribution</b> estimates how much that performance affected the entire portfolio after accounting for allocation.</p><h4>The basic calculation</h4><p><b>Contribution ≈ Holding Weight × Holding Return.</b> A 60% holding returning −1% contributes about −0.60 percentage points. A 10% holding returning −5% contributes about −0.50 points.</p><h4>Why this changes the story</h4><p>The smaller holding had the much worse return, yet its effect on the portfolio was similar because its allocation was much smaller. This is why Portfolio Thesis shows both security performance and portfolio impact.</p><h4>Portfolio Thesis takeaway</h4><p>Ask two questions: “How did the holding perform?” and “How much did that matter to my portfolio?” They are not the same question.</p>`}
};
let PT_ACADEMY_CACHE=JSON.parse(localStorage.getItem("pt_academy_progress")||"{}");
function academyDone(){return PT_ACADEMY_CACHE;}
function paintAcademy(){const d=academyDone();document.querySelectorAll(".lesson[data-lesson]").forEach(x=>x.classList.toggle("lesson-done",!!d[x.dataset.lesson]));}
function openLesson(id){const l=ACADEMY_LESSONS[id];if(!l)return;document.querySelector("#academy .library").style.display="none";const nav=document.getElementById("lessonNav");if(nav)nav.classList.add("show");const v=document.getElementById("lessonView");v.classList.add("show");document.getElementById("lessonContent").innerHTML=`<h3>${l.title}</h3><div class="lessonbody">${l.body}</div><button class="btn" style="margin-top:18px" onclick="completeLesson('${id}')">${academyDone()[id]?"Completed ✓":"Complete Lesson"}</button>`;if(nav)nav.scrollIntoView({behavior:"smooth",block:"start"});else v.scrollIntoView({behavior:"smooth",block:"start"});}
function closeLesson(){document.getElementById("lessonView").classList.remove("show");const nav=document.getElementById("lessonNav");if(nav)nav.classList.remove("show");document.querySelector("#academy .library").style.display="grid";document.getElementById("academy").scrollIntoView({behavior:"smooth",block:"start"});paintAcademy();}
async function completeLesson(id){
  const now=new Date().toISOString();
  PT_ACADEMY_CACHE[id]={completed:true,completedAt:now};
  localStorage.setItem("pt_academy_progress",JSON.stringify(PT_ACADEMY_CACHE));
  paintAcademy(); openLesson(id);
  if(!window.ptSupabase||!window.ptUser){return;}
  const {error}=await window.ptSupabase.from("academy_progress").upsert(
    {user_id:window.ptUser.id,lesson_slug:id,completed:true,completed_at:now},
    {onConflict:"user_id,lesson_slug"}
  );
  if(error) console.error("Academy sync failed:",error.message);
}
async function loadAcademyProgress(){
  if(!window.ptSupabase||!window.ptUser){paintAcademy();return;}
  const {data,error}=await window.ptSupabase.from("academy_progress").select("lesson_slug,completed,completed_at").eq("user_id",window.ptUser.id);
  if(error){console.error(error.message);return;}
  PT_ACADEMY_CACHE={};
  (data||[]).forEach(r=>{if(r.completed)PT_ACADEMY_CACHE[r.lesson_slug]={completed:true,completedAt:r.completed_at};});
  localStorage.setItem("pt_academy_progress",JSON.stringify(PT_ACADEMY_CACHE)); paintAcademy();
}
document.addEventListener("DOMContentLoaded",paintAcademy);

function showJoinStatus(){
  alert("Membership checkout is not live yet. Account creation and member progress are working; payment checkout will be connected before launch.");
}
const PT_STORAGE_VERSION="v24";
const PT_SUPABASE_URL="https://ngsdgtglfpsnylduivzz.supabase.co";
const PT_SUPABASE_KEY="sb_publishable_SajMQCfHAgR3gpnXXH57SQ_DhmNJUex";
window.ptSupabase=window.supabase.createClient(PT_SUPABASE_URL,PT_SUPABASE_KEY);
window.ptUser=null;

function accountPanel(){
  let p=document.getElementById("ptAccountPanel");
  if(!p){
    p=document.createElement("div");p.id="ptAccountPanel";
    p.style.cssText="position:fixed;inset:0;background:#0009;z-index:9999;display:flex;align-items:center;justify-content:center;padding:18px";
    p.innerHTML=`<div style="background:white;color:#101914;max-width:430px;width:100%;padding:24px;border-radius:16px">
      <div style="display:flex;justify-content:space-between;align-items:center"><h3 style="margin:0">Portfolio Thesis Account</h3><button onclick="document.getElementById('ptAccountPanel').remove()" style="border:0;background:none;font-size:24px">×</button></div>
      <p id="ptAuthStatus" class="muted">Sign in to sync Academy progress across devices.</p>
      <input id="ptEmail" type="email" placeholder="Email" style="width:100%;padding:12px;margin:6px 0;border:1px solid #ccd4cf;border-radius:8px">
      <input id="ptPassword" type="password" placeholder="Password" style="width:100%;padding:12px;margin:6px 0 12px;border:1px solid #ccd4cf;border-radius:8px">
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" onclick="ptSignIn()">Sign In</button><button class="btn outline" onclick="ptSignUp()">Create Account</button><button id="ptLoadPortfolioBtn" class="btn outline" style="display:none" onclick="loadMyPortfolio()">Load My Portfolio</button><button id="ptSignOutBtn" class="btn outline" style="display:none" onclick="ptSignOut()">Sign Out</button></div>
      <div id="ptAuthMsg" style="font-size:13px;margin-top:12px"></div>
    </div>`;
    document.body.appendChild(p);
  }
  refreshAuthPanel();
}
function showAccountInfo(){accountPanel();}
function authMsg(t,bad=false){const e=document.getElementById("ptAuthMsg");if(e){e.textContent=t;e.style.color=bad?"#a22":"#176b4b";}}
async function ensureProfile(user){
  if(!user)return;
  const {error}=await window.ptSupabase.from("profiles").upsert({id:user.id,email:user.email},{onConflict:"id"});
  if(error)console.error("Profile sync:",error.message);
}
async function ptSignUp(){
  const email=document.getElementById("ptEmail").value.trim(), password=document.getElementById("ptPassword").value;
  if(!email||password.length<6){authMsg("Enter an email and a password of at least 6 characters.",true);return;}
  const {data,error}=await window.ptSupabase.auth.signUp({email,password});
  if(error){authMsg(error.message,true);return;}
  if(data.user)await ensureProfile(data.user);
  authMsg(data.session?"Account created and signed in.":"Account created. Check your email if confirmation is required.");
  await syncAuthState();
}
async function ptSignIn(){
  const email=document.getElementById("ptEmail").value.trim(), password=document.getElementById("ptPassword").value;
  const {data,error}=await window.ptSupabase.auth.signInWithPassword({email,password});
  if(error){authMsg(error.message,true);return;}
  await ensureProfile(data.user); authMsg("Signed in. Academy progress is syncing."); await syncAuthState();
}
async function ptSignOut(){await window.ptSupabase.auth.signOut();window.ptUser=null;await syncAuthState();authMsg("Signed out.");}
async function syncAuthState(){
  const {data}=await window.ptSupabase.auth.getUser();window.ptUser=data?.user||null;
  const txt=document.getElementById("accountText");
  if(txt)txt.textContent=window.ptUser?("Signed in • "+window.ptUser.email):"Local prototype mode • sign in to sync";
  const ah=document.getElementById("headerAccount");if(ah){ah.classList.toggle("signed",!!window.ptUser);ah.title=window.ptUser?("Signed in as "+window.ptUser.email):"Sign in or create account";}
  refreshAuthPanel(); await loadAcademyProgress();
  const lib=document.getElementById("library");
  if(lib && getComputedStyle(lib).display!=="none" && typeof ptRefreshLibrary==="function"){
    await ptRefreshLibrary();
  }
}
function refreshAuthPanel(){
  const s=document.getElementById("ptAuthStatus"),o=document.getElementById("ptSignOutBtn"),l=document.getElementById("ptLoadPortfolioBtn");
  if(s)s.textContent=window.ptUser?("Signed in as "+window.ptUser.email):"Sign in to sync Academy progress across devices.";
  if(o)o.style.display=window.ptUser?"inline-block":"none";
  if(l)l.style.display=window.ptUser?"inline-block":"none";
}
document.addEventListener("DOMContentLoaded",async()=>{
  const b=document.getElementById("accountBar");if(b)b.classList.add("show");
  await syncAuthState();
  window.ptSupabase.auth.onAuthStateChange(()=>setTimeout(syncAuthState,0));
});

function ptAuditNavigation(){
  const report=[];
  document.querySelectorAll("a").forEach(a=>{
    const href=a.getAttribute("href")||"";
    if(href.startsWith("#") && href.length>1 && !document.querySelector(href)){
      report.push({text:a.textContent.trim(),href,status:"missing target"});
    }
  });
  if(report.length) console.warn("Portfolio Thesis navigation audit",report);
  else console.info("Portfolio Thesis navigation audit: all internal anchor targets resolve.");
  return report;
}
document.addEventListener("DOMContentLoaded",ptAuditNavigation);
document.addEventListener("DOMContentLoaded",()=>{renderWatchlist();renderDVRanking();});


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


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
