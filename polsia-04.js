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
