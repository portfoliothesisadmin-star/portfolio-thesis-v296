    let answer=null;
    walk(root,o=>{
      if(answer!=null)return;
      for(const k of ["latestAdjustedClose","price","currentPrice","lastPrice","latestPrice","marketPrice","close","last","lastClose","previousClose","regularMarketPrice","nav","market_price","current_price","last_price","adjustedClose","adjClose","endPrice","endingPrice","endClose"]){
        const n=N(o?.[k]); if(n!=null && n>0){answer=n;return;}
      }
      for(const k of ["end","ending","latest","current"]){
        const q=o?.[k];
        if(q && typeof q==="object"){
          for(const p of ["latestAdjustedClose","price","close","value","adjustedClose","adjClose"]){
            const n=N(q?.[p]); if(n!=null && n>0){answer=n;return;}
          }
        }
      }
    });
    return answer;
  }
  function tickerOf(o){
    return String(o?.ticker || o?.symbol || o?.security?.ticker || o?.security?.symbol || "").toUpperCase();
  }
  function extract(root, wanted){
    const out={};
    const wantedSet=new Set(wanted);
    walk(root,o=>{
      if(Array.isArray(o))return;
      const t=tickerOf(o);
      if(!t || !wantedSet.has(t))return;
      const m1=period(o,["oneMonth","1m","month1"]);
      const ytd=period(o,["ytd","YTD"]);
      const price=currentPrice(o);
      if(m1!=null || ytd!=null || price!=null){
        const old=out[t]||{};
        out[t]={
          m1: m1!=null?m1:old.m1??null,
          ytd: ytd!=null?ytd:old.ytd??null,
          price: price!=null?price:old.price??null
        };
      }
    });
    return out;
  }
  async function invoke(body, ms=12000){
    if(!window.ptSupabase?.functions?.invoke) return {ok:false,error:"Performance service unavailable"};
    let timer;
    try{
      const timeout=new Promise((_,rej)=>timer=setTimeout(()=>rej(new Error("timeout")),ms));
      const r=await Promise.race([
        window.ptSupabase.functions.invoke("security-performance",{body}),
        timeout
      ]);
      if(r?.error) throw r.error;
      return {ok:true,data:r?.data};
    }catch(e){
      return {ok:false,error:e?.message==="timeout"?"Performance request timed out":(e?.message||"Performance request failed")};
    }finally{ clearTimeout(timer); }
  }
  async function freshPerformance(holdings){
    const tickers=holdings.map(x=>x.ticker);
    let map={};

    // Prefer a single batch request so every holding is measured from the same refresh.
    for(const body of [
      {holdings},
      {tickers},
      {symbols:tickers}
    ]){
      const r=await invoke(body);
      if(r.ok) Object.assign(map,extract(r.data,tickers));
      if(tickers.every(t=>map[t]?.m1!=null)) break;
    }

    // Fill only genuinely missing tickers. Never manufacture 0.00%.
    for(const t of tickers){
      if(map[t]?.m1!=null) continue;
      const r=await invoke({ticker:t});
      if(r.ok) Object.assign(map,extract(r.data,[t]));
    }

    const rows=holdings.map(h=>{
      const v=map[h.ticker]||{};
      const oneMonth=N(v.m1), ytd=N(v.ytd), price=N(v.price);
      return {
        ticker:h.ticker,
        weight:h.weight,
        price,
        oneMonth,
        ytd,
        contribution: oneMonth==null ? null : oneMonth*h.weight/100
      };
    });
    const known1=rows.filter(x=>x.oneMonth!=null);
    const knownY=rows.filter(x=>x.ytd!=null);
    return {
      capturedAt:Date.now(),
      portfolioOneMonth:known1.length ? known1.reduce((a,x)=>a+x.oneMonth*x.weight/100,0) : null,
      portfolioYtd:knownY.length ? knownY.reduce((a,x)=>a+x.ytd*x.weight/100,0) : null,
      holdings:rows,
      available:known1.length===rows.length,
      missing:rows.filter(x=>x.oneMonth==null).map(x=>x.ticker)
    };
  }
  function replaceLatestPerformance(name, perf){
    const rows=loadReviews();
    const matches=rows.map((x,i)=>({x,i}))
      .filter(z=>norm(z.x.portfolioKey||z.x.portfolioName)===norm(name))
      .sort((a,b)=>(b.x.savedAt||0)-(a.x.savedAt||0));
    if(!matches.length)return false;
    rows[matches[0].i].performance=perf;
    rows[matches[0].i].performanceStatus=perf.available ? "fresh" : "unavailable";
    rows[matches[0].i].performanceMissing=perf.missing||[];
    saveReviews(rows);
    return true;
  }
  function showLoading(name){
    const body=document.getElementById("ptV210ReviewBody");
    const host=document.getElementById("ptV210Review");
    if(!body||!host)return;
    body.innerHTML=`<div class="pt210-kicker">Portfolio Review History · ${String(name||"")}</div>
      <h1 class="pt210-title">Since Your Last Review</h1>
      <div class="pt210-baseline"><b>Refreshing current performance…</b>
      <p>Updating price, return and weighted contribution before comparing with the prior review.</p></div>`;
    host.classList.add("active"); host.setAttribute("aria-hidden","false"); host.scrollTop=0;
    document.body.style.overflow="hidden";
  }

  window.ptV210OpenReview = async function(name){
    const rec=savedPortfolio(name);
    const holdings=holdingsOf(rec);
    if(!rec || !holdings.length) return previousOpen(name);

    showLoading(name);

    // V213 creates the new review/evidence snapshot. Wait for that entire pipeline.
    await previousOpen(name);

    // Then obtain one coherent fresh security-performance dataset and attach it
    // to that newly-created review before rendering the comparison.
    const perf=await freshPerformance(holdings);
    replaceLatestPerformance(name,perf);

    // Re-render only after the fresh dataset has either completed or failed.
    // Missing values stay unavailable rather than being displayed as 0.00%.
    const renderer = (function(){
      // V213 captured V212's renderer in its closure, so calling previousOpen again
      // would create another review. Use the current V212 renderer snapshot if exposed;
      // otherwise temporarily bypass V213 by rendering after suppressing generation.
      return null;
    })();

    // The previous call already opened Review History. Rebuild its visible performance
    // fields from the just-saved coherent snapshot without advancing review history again.
    const rows=loadReviews().filter(x=>norm(x.portfolioKey||x.portfolioName)===norm(name))
      .sort((a,b)=>(b.savedAt||0)-(a.savedAt||0));
    const cur=rows[0];
    if(!cur) return;

    // Patch the currently visible V212 performance section. Structural/timeline content
    // remains from the same newly-created review.
    const body=document.getElementById("ptV210ReviewBody");
    if(!body)return;
    const hs=cur.performance?.holdings||[];
    const fmt=(v,suffix="%")=>v==null?"—":`${v>=0?"+":""}${Number(v).toFixed(2)}${suffix}`;
    const cls=v=>v==null?"":v>=0?"pt212-pos":"pt212-neg";
    const ranked=[...hs].filter(x=>x.contribution!=null).sort((a,b)=>Math.abs(b.contribution)-Math.abs(a.contribution));
    const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

    const summary=body.querySelector(".pt212-summary");
    if(summary){
      const leader=ranked[0];
      summary.innerHTML=`<div class="pt212-stat"><small>Portfolio return · 1M</small><b class="${cls(cur.performance.portfolioOneMonth)}">${fmt(cur.performance.portfolioOneMonth)}</b><span>Current-weight portfolio estimate</span></div>
      <div class="pt212-stat"><small>Portfolio return · YTD</small><b class="${cls(cur.performance.portfolioYtd)}">${fmt(cur.performance.portfolioYtd)}</b><span>Current-weight portfolio estimate</span></div>
      <div class="pt212-stat"><small>Largest weighted driver · 1M</small><b>${leader?esc(leader.ticker):"—"}</b><span>${leader?`${fmt(leader.contribution," pts")} contribution`:"Performance data unavailable"}</span></div>`;
    }
    const section=body.querySelector(".pt212-section");
    if(section){
      const max=Math.max(.01,...ranked.map(x=>Math.abs(x.contribution)));
      const missing=cur.performance?.missing||[];
      section.innerHTML=`<h2>Price, Return & Weighted Contribution</h2>
      <p>Contribution connects each holding's return with the weight it carries in the portfolio.</p>
      ${missing.length?`<div class="pt210-baseline"><b>Performance data unavailable</b><p>Fresh 1M return data could not be loaded for ${missing.map(esc).join(", ")}. Missing values are left blank rather than mixed with an older snapshot.</p></div>`:""}
      <table class="pt212-table"><thead><tr><th>Holding</th><th>Weight</th><th>Price</th><th>1M Return</th><th>Contribution</th></tr></thead><tbody>
      ${hs.map(x=>`<tr><td><b>${esc(x.ticker)}</b></td><td>${Number(x.weight).toFixed(0)}%</td><td>${x.price!=null?"$"+Number(x.price).toFixed(2):"—"}</td><td class="${cls(x.oneMonth)}">${fmt(x.oneMonth)}</td><td class="${cls(x.contribution)}">${fmt(x.contribution," pts")}</td></tr>`).join("")}
      </tbody></table>
      <div class="pt212-bars">${ranked.map(x=>`<div class="pt212-barrow"><b>${esc(x.ticker)}</b><div class="pt212-track"><div class="pt212-fill ${x.contribution<0?"neg":""}" style="width:${Math.max(3,Math.abs(x.contribution)/max*100).toFixed(1)}%"></div></div><span class="${cls(x.contribution)}">${fmt(x.contribution," pts")}</span></div>`).join("")}</div>`;
    }
  };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const priorOpen=window.ptV210OpenReview;
 if(typeof priorOpen!=="function")return;
 const KEY="pt_portfolio_review_history_v2";
 const norm=s=>String(s||"").trim().toLowerCase();
 const N=v=>{if(v===null||v===undefined||v==="")return null;const n=Number(v);return Number.isFinite(n)?n:null};
 const esc=s=>String(s??"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;"}[c]));
 const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(_){return[]}};
 const cls=v=>v==null?"pt217-flat":Math.abs(v)<0.005?"pt217-flat":v>0?"pt217-pos":"pt217-neg";
 const signed=(v,suffix="")=>v==null?"—":`${v>0?"+":""}${v.toFixed(2)}${suffix}`;
 const money=v=>v==null?"—":"$"+Number(v).toFixed(2);
 function perfMap(review){return Object.fromEntries((review?.performance?.holdings||[]).map(x=>[String(x.ticker||"").toUpperCase(),x]));}
 function build(name){
   const body=document.getElementById("ptV210ReviewBody");if(!body)return;
   body.querySelectorAll(".pt217-compare").forEach(x=>x.remove());
   const rows=load().filter(x=>norm(x.portfolioKey||x.portfolioName)===norm(name)).sort((a,b)=>(b.savedAt||0)-(a.savedAt||0));
   const cur=rows[0],old=rows[1];
   const anchor=body.querySelector(".pt212-structural");
   if(!cur||!anchor)return;
   const section=document.createElement("section");section.className="pt217-compare";
   if(!old?.performance?.holdings?.length||!cur?.performance?.holdings?.length){
     section.innerHTML=`<h2>Change Since Prior Review</h2><div class="pt217-note"><b>Comparison baseline pending.</b> A prior performance snapshot is needed before price, return and weighted-contribution changes can be measured.</div>`;
     anchor.before(section);return;
   }
   const cm=perfMap(cur),om=perfMap(old),tickers=[...new Set([...Object.keys(cm),...Object.keys(om)])];
   const d1=N(cur.performance?.portfolioOneMonth)!=null&&N(old.performance?.portfolioOneMonth)!=null?N(cur.performance.portfolioOneMonth)-N(old.performance.portfolioOneMonth):null;
   const dy=N(cur.performance?.portfolioYtd)!=null&&N(old.performance?.portfolioYtd)!=null?N(cur.performance.portfolioYtd)-N(old.performance.portfolioYtd):null;
   const shifts=tickers.map(t=>{const c=N(cm[t]?.contribution),o=N(om[t]?.contribution);return {t,d:c!=null&&o!=null?c-o:null}}).filter(x=>x.d!=null).sort((a,b)=>Math.abs(b.d)-Math.abs(a.d));
   const driver=shifts[0]||null;
   const table=tickers.map(t=>{
     const c=cm[t]||{},o=om[t]||{};
     const cp=N(c.price),op=N(o.price),cr=N(c.oneMonth),or=N(o.oneMonth),cc=N(c.contribution),oc=N(o.contribution);
     const pd=cp!=null&&op!=null?cp-op:null, rd=cr!=null&&or!=null?cr-or:null, cd=cc!=null&&oc!=null?cc-oc:null;
     return `<tr><td><b>${esc(t)}</b></td><td>${N(c.weight)!=null?Number(c.weight).toFixed(0)+"%":"—"}</td><td><span class="pt217-main">${money(cp)}</span><span class="pt217-delta ${cls(pd)}">${signed(pd,"$").replace(/([+-])([0-9.]+)\$/,'$1$$$2')}</span></td><td><span class="pt217-main">${cr==null?"—":signed(cr,"%")}</span><span class="pt217-delta ${cls(rd)}">${signed(rd," pts")}</span></td><td><span class="pt217-main">${cc==null?"—":signed(cc," pts")}</span><span class="pt217-delta ${cls(cd)}">${signed(cd," pts")}</span></td></tr>`;
   }).join("");
   section.innerHTML=`<h2>Change Since Prior Review</h2><p>Current performance is compared with the review saved ${esc(new Date(old.savedAt).toLocaleString())}. Small text shows the change from that prior snapshot.</p>
   <div class="pt217-summary">
    <div class="pt217-stat"><small>Portfolio 1M return · change</small><b class="${cls(d1)}">${signed(d1," pts")}</b><span>Current 1M return: ${signed(N(cur.performance?.portfolioOneMonth),"%")}</span></div>
    <div class="pt217-stat"><small>Portfolio YTD return · change</small><b class="${cls(dy)}">${signed(dy," pts")}</b><span>Current YTD return: ${signed(N(cur.performance?.portfolioYtd),"%")}</span></div>
    <div class="pt217-stat"><small>Largest contribution shift</small><b>${driver?esc(driver.t):"—"}</b><span class="${cls(driver?.d)}">${driver?signed(driver.d," pts"):"No comparable contribution"}</span></div>
   </div>
   <table class="pt217-table"><thead><tr><th>Holding</th><th>Weight</th><th>Price<br>Δ since prior</th><th>1M Return<br>Δ since prior</th><th>Contribution<br>Δ since prior</th></tr></thead><tbody>${table}</tbody></table>`;
   anchor.before(section);
 }
 window.ptV210OpenReview=async function(name){const r=await priorOpen.apply(this,arguments);build(name);return r};
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  function nearZero(v){ return v == null || Math.abs(Number(v)) < 0.005; }

  function cleanComparison(){
    const body=document.getElementById("ptV210ReviewBody");
    if(!body) return;

    const headings=[...body.querySelectorAll("h1,h2")];
    const heading=headings.find(h=>/change since prior review/i.test(h.textContent||""));
    if(!heading) return;

    // Find the comparison region generated by V217, ending before Structural Check/Review History.
    const nodes=[];
    let n=heading.nextElementSibling;
    while(n && !/structural check|review history/i.test(n.textContent||"")){
      nodes.push(n); n=n.nextElementSibling;
    }

    // Read visible delta values only from this comparison region.
    const txt=nodes.map(x=>x.innerText||"").join("");
    const deltaMatches=[...txt.matchAll(/([+-]?\d+(?:\.\d+)?)\s*(?:pts|\$)/gi)]
      .map(m=>Number(m[1])).filter(Number.isFinite);

    // Same-day/no-change reviews should not be dominated by a table of zeros.
    if(deltaMatches.length && deltaMatches.every(nearZero)){
      nodes.forEach(x=>{
        // Keep the explanatory intro directly below the heading; collapse cards/table.
        if(x.tagName==="P" && /compared with|prior snapshot/i.test(x.textContent||"")) return;
        x.style.display="none";
      });
      const box=document.createElement("div");
      box.className="pt218-nochange";
      box.innerHTML="<b>No material performance change since the prior review.</b>Price, return and weighted contribution are effectively unchanged from the previous saved snapshot.";
