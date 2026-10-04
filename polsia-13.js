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
