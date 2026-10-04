   cards.forEach(card=>{if(card.querySelector('.pt210-review-btn'))return;const title=card.querySelector('b')?.textContent||'';const name=title.replace(/\s*[—-]\s*Portfolio Thesis Report\s*$/i,'').trim();const actions=card.querySelector('.pt-library-actions');if(!actions||!name)return;const b=document.createElement('button');b.className='btn pt210-review-btn';b.textContent='Review History';b.onclick=()=>window.ptV210OpenReview(name);const open=actions.querySelector('button');if(open)open.after(b);else actions.appendChild(b);});
 }
 const mo=new MutationObserver(()=>enhanceLibrary());mo.observe(document.body,{childList:true,subtree:true});setTimeout(enhanceLibrary,100);
 // V210: the review is standalone, never a page inside the full report.
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){
   const r=await prior.apply(this,arguments);
   const host=document.getElementById('ptGeneratedReport');
   if(host)host.querySelectorAll('[data-pt205="review"]').forEach(x=>x.remove());
   try{window.ptSaveCurrentPortfolioReview?.()}catch(_){}
   try{window.ptAutoSavePortfolioReport?.(typeof getPortfolio==='function'?getPortfolio():[])}catch(_){}
   setTimeout(()=>{if(host)host.querySelectorAll('[data-pt205="review"]').forEach(x=>x.remove())},700);
   return r;
 };
 // Strip legacy embedded review pages when opening an older saved report too.
 const oldOpen=window.ptOpenSavedReport;
 if(typeof oldOpen==='function')window.ptOpenSavedReport=function(){const r=oldOpen.apply(this,arguments);setTimeout(()=>document.getElementById('ptGeneratedReport')?.querySelectorAll('[data-pt205="review"]').forEach(x=>x.remove()),0);return r};
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const KEY='pt_portfolio_review_history_v2';
 const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
 const num=v=>{const n=Number(v);return Number.isFinite(n)?n:null};
 const key=n=>String(n||'My Portfolio').trim().toLowerCase();
 const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(_){return[]}};
 const save=rows=>{try{localStorage.setItem(KEY,JSON.stringify(rows.slice(-80)))}catch(_){}};
 function walk(o,fn,seen=new Set()){if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);fn(o);if(Array.isArray(o))o.forEach(x=>walk(x,fn,seen));else Object.values(o).forEach(x=>walk(x,fn,seen))}
 function priceFor(root,t){let out=null;walk(root,o=>{if(out!=null)return;const ot=String(o.ticker||o.symbol||'').toUpperCase();if(ot!==t)return;for(const k of ['price','currentPrice','lastPrice','latestPrice','marketPrice','close','last','lastClose','previousClose','regularMarketPrice','nav','market_price','current_price','last_price','adjustedClose','adjClose','endPrice','endingPrice','endClose']){const n=num(o[k]);if(n!=null&&n>0){out=n;break}}});return out}
 function capturePerformance(){
   const D=window.__pt151;if(!D)return null;
   const p=(D.p||[]).map(x=>({ticker:String(x.ticker||'').toUpperCase(),weight:num(x.weight)||0}));
   const sec=D.perf?.securities||[];
   const rows=p.map(h=>{const s=sec.find(x=>String(x.ticker||'').toUpperCase()===h.ticker)||{};const r1=num(s?.oneMonth?.returnPct),ytd=num(s?.ytd?.returnPct),c=num(s?.oneMonth?.contributionPctPoints);return {ticker:h.ticker,weight:h.weight,price:priceFor(D.market||D.securityPerf||D.perf,h.ticker),oneMonth:r1,ytd,contribution:c!=null?c:(r1!=null?r1*h.weight/100:null)}});
   const known1=rows.filter(x=>x.oneMonth!=null),knownY=rows.filter(x=>x.ytd!=null);
   const portfolio1=known1.length?known1.reduce((a,x)=>a+(x.oneMonth*x.weight/100),0):null;
   const portfolioY=knownY.length?knownY.reduce((a,x)=>a+(x.ytd*x.weight/100),0):null;
   return {capturedAt:Date.now(),portfolioOneMonth:portfolio1,portfolioYtd:portfolioY,holdings:rows};
 }
 function enrichLatest(name){const perf=capturePerformance();if(!perf)return;const rows=load(),matches=rows.map((x,i)=>({x,i})).filter(z=>key(z.x.portfolioKey||z.x.portfolioName)===key(name)).sort((a,b)=>b.x.savedAt-a.x.savedAt);if(!matches.length)return;rows[matches[0].i].performance=perf;save(rows)}
 function sign(v,suffix='%'){return v==null?'—':`${v>=0?'+':''}${v.toFixed(2)}${suffix}`}
 function cls(v){return v==null?'':v>=0?'pt212-pos':'pt212-neg'}
 function structural(cur,old){
   const ca=Object.fromEntries((cur?.portfolio||[]).map(x=>[String(x.ticker||'').toUpperCase(),num(x.weight)||0])),oa=Object.fromEntries((old?.portfolio||[]).map(x=>[String(x.ticker||'').toUpperCase(),num(x.weight)||0]));
   const ts=[...new Set([...Object.keys(ca),...Object.keys(oa)])];const changes=ts.map(t=>({t,d:(ca[t]||0)-(oa[t]||0)})).filter(x=>Math.abs(x.d)>=.1);const roles=ts.filter(t=>(cur?.evidence?.[t]?.role||'')!==(old?.evidence?.[t]?.role||'')&&(cur?.evidence?.[t]?.role||old?.evidence?.[t]?.role));
   let ctot=0,ct=0,otot=0,ot=0;for(const x of cur?.portfolio||[]){const v=num(cur?.evidence?.[x.ticker]?.top10Weight);if(v!=null){ctot+=v*x.weight/100;ct+=x.weight}}for(const x of old?.portfolio||[]){const v=num(old?.evidence?.[x.ticker]?.top10Weight);if(v!=null){otot+=v*x.weight/100;ot+=x.weight}}const delta=ct&&ot?ctot-otot:null;
   return {changes,roles,delta};
 }
 window.ptV210OpenReview=function(name){
   const rows=load().filter(x=>key(x.portfolioKey||x.portfolioName)===key(name)).sort((a,b)=>b.savedAt-a.savedAt),cur=rows[0],old=rows[1];
   const body=document.getElementById('ptV210ReviewBody');if(!body)return;
   let html=`<div class="pt210-kicker">Portfolio Review History · ${esc(name)}</div><h1 class="pt210-title">Since Your Last Review</h1>`;
   if(!cur){html+=`<div class="pt210-sub">No review saved yet</div><div class="pt210-baseline"><b>Baseline review</b><p>Generate a report for ${esc(name)} to establish its first comparison point.</p></div>`}
   else{
     const perf=cur.performance||null, hs=perf?.holdings||[], ranked=[...hs].filter(x=>x.contribution!=null).sort((a,b)=>Math.abs(b.contribution)-Math.abs(a.contribution));
     html+=`<div class="pt210-sub">${old?`Compared with review saved ${esc(new Date(old.savedAt).toLocaleDateString())}`:'Baseline saved '+esc(new Date(cur.savedAt).toLocaleDateString())}</div>`;
     if(perf&&hs.length){
       const leader=ranked[0];html+=`<div class="pt212-summary"><div class="pt212-stat"><small>Portfolio return · 1M</small><b class="${cls(perf.portfolioOneMonth)}">${sign(perf.portfolioOneMonth)}</b><span>Current-weight portfolio estimate</span></div><div class="pt212-stat"><small>Portfolio return · YTD</small><b class="${cls(perf.portfolioYtd)}">${sign(perf.portfolioYtd)}</b><span>Current-weight portfolio estimate</span></div><div class="pt212-stat"><small>Largest weighted driver · 1M</small><b>${leader?esc(leader.ticker):'—'}</b><span>${leader?`${sign(leader.contribution,' pts')} contribution`:'Contribution unavailable'}</span></div></div>`;
       html+=`<div class="pt212-section"><h2>Price, Return & Weighted Contribution</h2><p>Contribution connects each holding's return with the weight it carries in the portfolio.</p><table class="pt212-table"><thead><tr><th>Holding</th><th>Weight</th><th>Price</th><th>1M Return</th><th>Contribution</th></tr></thead><tbody>${hs.map(x=>`<tr><td><b>${esc(x.ticker)}</b></td><td>${x.weight.toFixed(0)}%</td><td>${x.price!=null?'$'+x.price.toFixed(2):'—'}</td><td class="${cls(x.oneMonth)}">${sign(x.oneMonth)}</td><td class="${cls(x.contribution)}">${sign(x.contribution,' pts')}</td></tr>`).join('')}</tbody></table>`;
       const max=Math.max(.01,...ranked.map(x=>Math.abs(x.contribution)));html+=`<div class="pt212-bars">${ranked.map(x=>`<div class="pt212-barrow"><b>${esc(x.ticker)}</b><div class="pt212-track"><div class="pt212-fill ${x.contribution<0?'neg':''}" style="width:${Math.max(3,Math.abs(x.contribution)/max*100).toFixed(1)}%"></div></div><span class="${cls(x.contribution)}">${sign(x.contribution,' pts')}</span></div>`).join('')}</div></div>`;
     }else html+=`<div class="pt210-baseline"><b>Performance snapshot pending</b><p>Generate the portfolio report once in this version to capture price, return and weighted-contribution evidence for Review History.</p></div>`;
     if(old){const s=structural(cur,old);const material=s.changes.length||s.roles.length||(s.delta!=null&&Math.abs(s.delta)>=.5);html+=`<div class="pt212-structural"><h3>Structural Check</h3>${material?`<div class="pt212-check"><b>Structural change detected.</b><br>Allocation, portfolio roles or concentration changed materially from the prior saved review.</div><div class="pt212-material">${s.changes.length?`<div class="pt210-finding"><small>Allocation change</small><b>Portfolio weights changed.</b><p>${s.changes.map(x=>`${esc(x.t)} ${x.d>=0?'+':''}${x.d.toFixed(1)} pts`).join(' · ')}</p></div>`:''}${s.roles.length?`<div class="pt210-finding"><small>Role change</small><b>Portfolio roles changed.</b><p>${esc(s.roles.join(', '))}</p></div>`:''}${s.delta!=null&&Math.abs(s.delta)>=.5?`<div class="pt210-finding"><small>Concentration change</small><b>${s.delta>0?'Increased':'Decreased'}.</b><p>Weighted Top-10 concentration changed ${s.delta>=0?'+':''}${s.delta.toFixed(1)} percentage points.</p></div>`:''}</div>`:`<div class="pt212-check"><b>No structural change.</b><br>Allocation, portfolio roles and concentration remain materially unchanged.</div>`}</div>`}
     else html+=`<div class="pt212-structural"><h3>Structural Check</h3><div class="pt212-check">Baseline established · Structural changes will appear here after the next review.</div></div>`;
   }
   if(rows.length)html+=`<div class="pt210-timeline"><h3>Review History</h3>${rows.slice(0,8).map((r,i)=>`<div class="pt210-row"><b>${i===0?'Current review':'Prior review'}</b><span>${esc(new Date(r.savedAt).toLocaleString())}</span></div>`).join('')}</div>`;
   body.innerHTML=html;const host=document.getElementById('ptV210Review');host.classList.add('active');host.setAttribute('aria-hidden','false');host.scrollTop=0;document.body.style.overflow='hidden';
 };
 // Enrich the portfolio-specific review snapshot after every completed report.
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);setTimeout(()=>enrichLatest(String(window.ptActivePortfolioName||window.ptCurrentPortfolioName?.()||'My Portfolio')),50);return r};
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  const renderReview = window.ptV210OpenReview;
  if (typeof renderReview !== "function") return;

  const norm = s => String(s || "").trim().toLowerCase();

  function findSavedPortfolio(name){
    const rows = Array.isArray(window.ptLibraryPortfolioRows) ? window.ptLibraryPortfolioRows : [];
    return rows.find(r => norm(r?.name) === norm(name)) || null;
  }

  async function refreshReview(name){
    const rec = findSavedPortfolio(name);

    // If the portfolio is not currently in the saved-portfolio collection,
    // preserve the existing Review History behavior rather than guessing.
    if (!rec) return renderReview(name);

    const holdings = rec.holdings || rec.portfolio || rec.data || [];
    if (!Array.isArray(holdings) || !holdings.length) return renderReview(name);

    window.ptActivePortfolioName = String(rec.name || name || "My Portfolio");
    const nameInput = document.getElementById("ptPortfolioName");
    if (nameInput) nameInput.value = window.ptActivePortfolioName;

    // Load the saved portfolio into the existing analysis model silently.
    const rowsHost = document.getElementById("rows");
    if (!rowsHost || typeof addRow !== "function") return renderReview(name);
    rowsHost.innerHTML = "";
    holdings.forEach(x => addRow(x.ticker || x.symbol || "", Number(x.weight ?? x.allocation ?? 0) || 0));
    if (typeof total === "function") total();

    // Refresh the six-lens/current evidence model without routing the member to Builder.
    const panel = document.getElementById("analysisPanel");
    const oldScroll = panel?.scrollIntoView;
    if (panel) panel.scrollIntoView = function(){};
    try {
      if (typeof analyzePortfolio === "function") analyzePortfolio();
    } catch(e) {
      console.warn("V213 portfolio analysis refresh", e);
    }
    if (panel && oldScroll) panel.scrollIntoView = oldScroll;

    // Generate the current evidence snapshot in the background.
    // Existing V210/V212 hooks save the review snapshot and enrich it with
    // current price/return/contribution data. The current report card is
    // updated in place rather than creating a second report card.
    try {
      if (typeof window.ptGeneratePortfolioPublication === "function") {
        await window.ptGeneratePortfolioPublication();
        await new Promise(resolve => setTimeout(resolve, 180));
      }
    } catch(e) {
      console.warn("V213 review refresh", e);
    }

    // The member asked for Review History, not the full report.
    const report = document.getElementById("ptGeneratedReport");
    if (report) report.classList.remove("active");
    document.body.classList.remove("pt-report-open");

    // Render the comparison using the newly captured review as "current"
    // and the prior saved review as the comparison baseline.
    renderReview(window.ptActivePortfolioName || name);
  }

  window.ptV210OpenReview = function(name){
    return refreshReview(name);
  };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  const previousOpen = window.ptV210OpenReview;
  if (typeof previousOpen !== "function") return;

  const REVIEW_KEY = "pt_portfolio_review_history_v2";
  const norm = s => String(s || "").trim().toLowerCase();
  const N = v => {
    if (v === null || v === undefined || v === "" || v === false) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  function loadReviews(){
    try { return JSON.parse(localStorage.getItem(REVIEW_KEY) || "[]"); }
    catch(_) { return []; }
  }
  function saveReviews(rows){
    try { localStorage.setItem(REVIEW_KEY, JSON.stringify(rows.slice(-80))); }
    catch(_) {}
  }
  function savedPortfolio(name){
    const rows = Array.isArray(window.ptLibraryPortfolioRows) ? window.ptLibraryPortfolioRows : [];
    return rows.find(r => norm(r?.name) === norm(name)) || null;
  }
  function holdingsOf(rec){
    return (rec?.holdings || rec?.portfolio || rec?.positions || rec?.data || [])
      .map(x => ({
        ticker: String(x?.ticker || x?.symbol || "").toUpperCase(),
        weight: N(x?.weight ?? x?.weightPct ?? x?.allocation) || 0
      }))
      .filter(x => x.ticker && x.weight > 0);
  }
  function walk(root, fn, seen=new Set()){
    if (!root || typeof root !== "object" || seen.has(root)) return;
    seen.add(root); fn(root);
    if (Array.isArray(root)) root.forEach(v => walk(v,fn,seen));
    else Object.values(root).forEach(v => walk(v,fn,seen));
  }
  function period(root, aliases){
    let answer = null;
    walk(root, o => {
      if (answer != null) return;
      for (const a of aliases){
        const q = o?.[a];
        for (const v of [q?.returnPct,q?.pct,o?.[a+"Pct"],q?.return,q]){
          const n=N(v); if(n!=null){answer=n;return;}
        }
      }
    });
    return answer;
  }
  function currentPrice(root){
