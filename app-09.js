  // Critical V204 change: structural ETF evidence is loaded BEFORE the
  // publication builds its fund cards, overlap calculations and look-through.
  if(typeof baseGenerate==="function"){
    window.ptGeneratePortfolioPublication = async function(){
      try{
        const p=(typeof getPortfolio==="function"?getPortfolio():[])
          .filter(x=>Number(x.weight)>0);
        await window.ptLoadPortfolioETFEvidence(p);
      }catch(_){}
      return await baseGenerate.apply(this,arguments);
    };
  }
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const KEY='pt_portfolio_review_history_v2';
 const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
 const num=v=>{const n=Number(v);return Number.isFinite(n)?n:null};
 const pct=v=>v==null?'—':`${Number(v).toFixed(1)}%`;
 const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
 function portfolio(){return (typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:String(x.ticker||'').trim().toUpperCase(),weight:num(x.weight)||0})).filter(x=>x.ticker&&x.weight>0)}
 function portfolioName(){return String(window.ptActivePortfolioName||(typeof ptCurrentPortfolioName==='function'?ptCurrentPortfolioName():'My Portfolio')||'My Portfolio').trim()||'My Portfolio'}
 function keyFor(){return portfolioName().toLowerCase()}
 function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}}
 function save(rows){try{localStorage.setItem(KEY,JSON.stringify(rows.slice(-50)))}catch{}}
 function evidence(t){return window.PT_ETF_EVIDENCE?.[t]||{}}
 function roleFor(t){const card=[...document.querySelectorAll('.pt159-card')].find(c=>clean(c.querySelector('.pt159-head b')?.textContent).toUpperCase()===t);return clean(card?.querySelector('.pt159-role strong')?.textContent)||null}
 function snapshot(){
  const p=portfolio(), ev={};
  p.forEach(x=>{const e=evidence(x.ticker);ev[x.ticker]={role:roleFor(x.ticker),holdingsCount:num(e.holdingsCount??e.holdings_count),top10Weight:num(e.top10Weight??e.top10_weight),sectors:Array.isArray(e.sectors)?e.sectors.slice(0,8):[],countries:Array.isArray(e.countries)?e.countries.slice(0,8):[]}});
  return {id:`r${Date.now()}`,savedAt:Date.now(),portfolioKey:keyFor(),portfolioName:portfolioName(),portfolio:p,evidence:ev};
 }
 function priorFor(cur){return load().filter(x=>String(x.portfolioKey||'')===String(cur.portfolioKey||'')).sort((a,b)=>b.savedAt-a.savedAt)[0]||null}
 function allocMap(s){return Object.fromEntries((s?.portfolio||[]).map(x=>[x.ticker,num(x.weight)||0]))}
 function structuralWeighted(s,field){let total=0,known=0;for(const x of s?.portfolio||[]){const v=num(s?.evidence?.[x.ticker]?.[field]);if(v!=null){total+=v*(x.weight/100);known+=x.weight}}return known?total:null}
 function compare(cur,old){
  if(!old)return {baseline:true,items:[]};
  const ca=allocMap(cur),oa=allocMap(old),tickers=[...new Set([...Object.keys(ca),...Object.keys(oa)])];
  const allocChanges=tickers.map(t=>({t,d:(ca[t]||0)-(oa[t]||0)})).filter(x=>Math.abs(x.d)>=0.1);
  const roleChanges=tickers.filter(t=>(cur.evidence?.[t]?.role||'')!==(old.evidence?.[t]?.role||'') && (cur.evidence?.[t]?.role||old.evidence?.[t]?.role));
  const ct=structuralWeighted(cur,'top10Weight'),ot=structuralWeighted(old,'top10Weight');
  const concentrationDelta=(ct!=null&&ot!=null)?ct-ot:null;
  const structuralChanged=tickers.some(t=>{const a=cur.evidence?.[t],b=old.evidence?.[t];return a&&b&&((num(a.holdingsCount)!=null&&num(b.holdingsCount)!=null&&a.holdingsCount!==b.holdingsCount)||(num(a.top10Weight)!=null&&num(b.top10Weight)!=null&&Math.abs(a.top10Weight-b.top10Weight)>=0.5))});
  return {baseline:false,allocChanges,roleChanges,concentrationDelta,structuralChanged};
 }
 function mapCell(label,state,detail,changed){return `<div class="${changed?'changed':''}"><b>${esc(label)}</b><span>${esc(state)}${detail?` · ${esc(detail)}`:''}</span></div>`}
 function buildPage(cur,old){
  const c=compare(cur,old);let body='';
  if(c.baseline){body=`<div class="pt205-baseline"><b>Baseline review</b><p>This is the first saved review for ${esc(cur.portfolioName)}. Save the current analysis to establish the comparison point. The next review can then identify allocation, role and structural evidence changes instead of simply generating another static report.</p></div>`}
  else{
   const allocState=c.allocChanges.length?'Changed':'Stable';
   const roleState=c.roleChanges.length?'Changed':'Stable';
   const concState=c.concentrationDelta==null?'Not yet measured':Math.abs(c.concentrationDelta)<0.5?'Stable':c.concentrationDelta>0?'Increased':'Decreased';
   const structureState=c.structuralChanged?'Changed':'Stable';
   const material=c.allocChanges.length||c.roleChanges.length||c.structuralChanged||(c.concentrationDelta!=null&&Math.abs(c.concentrationDelta)>=0.5);
   const maps=[mapCell('Structure',allocState,c.allocChanges.length?`${c.allocChanges.length} allocation change${c.allocChanges.length===1?'':'s'}`:'No material allocation change',!!c.allocChanges.length),mapCell('Portfolio Roles',roleState,c.roleChanges.length?`${c.roleChanges.length} role change${c.roleChanges.length===1?'':'s'}`:'Assignments unchanged',!!c.roleChanges.length),mapCell('Concentration',concState,c.concentrationDelta==null?'Awaiting comparable evidence':`${c.concentrationDelta>=0?'+':''}${c.concentrationDelta.toFixed(1)} pts`,c.concentrationDelta!=null&&Math.abs(c.concentrationDelta)>=0.5),mapCell('Fund Structure',structureState,c.structuralChanged?'Underlying evidence moved':'No material measured change',c.structuralChanged),mapCell('Thesis Evidence',material?'Review':'Stable','Based on measured structural changes',!!material)].join('');
   const findings=[];
   if(c.allocChanges.length)findings.push(`<div class="pt205-finding"><small>Allocation</small><b>Portfolio weights changed.</b><p>${c.allocChanges.map(x=>`${x.t} ${x.d>=0?'+':''}${x.d.toFixed(1)} pts`).join(' · ')}</p></div>`);else findings.push(`<div class="pt205-finding"><small>Allocation</small><b>No material allocation change.</b><p>The portfolio's intended weighting structure is unchanged from the prior saved review.</p></div>`);
   if(c.concentrationDelta!=null)findings.push(`<div class="pt205-finding"><small>Concentration</small><b>${concState}.</b><p>Weighted Top-10 concentration changed by ${c.concentrationDelta>=0?'+':''}${c.concentrationDelta.toFixed(1)} percentage points across funds with comparable evidence.</p></div>`);else findings.push(`<div class="pt205-finding"><small>Concentration</small><b>Comparison pending.</b><p>A comparable structural snapshot is not yet available for enough of the portfolio to measure the change reliably.</p></div>`);
   findings.push(`<div class="pt205-finding"><small>Portfolio Roles</small><b>${roleState}.</b><p>${c.roleChanges.length?`Role assignments changed for ${c.roleChanges.join(', ')}.`:'Core, diversifier and tilt assignments are unchanged from the prior review.'}</p></div>`);
   findings.push(`<div class="pt205-finding"><small>Research Read</small><b>${material?'Measured evidence deserves review.':'No material structural change detected.'}</b><p>This status describes changes in the evidence; it is not a buy, sell or performance judgment.</p></div>`);
   body=`<div class="pt205-map">${maps}</div><div class="pt205-findings">${findings.join('')}</div>`;
  }
  return `<section class="pt150-page ptr-page pt205-page" data-pt205="review"><div class="pt205-head"><div><div class="ptr-kicker">Portfolio Review History · ${esc(cur.portfolioName)}</div><h2 class="ptr-section-title">Since Your Last Review</h2></div><div class="pt205-date">${old?`Compared with ${new Date(old.savedAt).toLocaleDateString()}`:'No prior saved review'}</div></div>${body}<div class="ptr-page-num">Review</div></section>`;
 }
 function reportHost(){return document.getElementById('ptGeneratedReport')||document.getElementById('ptrReportOverlay')||document.getElementById('reportOverlay')}
 function inject(){
  const host=reportHost();if(!host)return;host.querySelectorAll('[data-pt205="review"]').forEach(x=>x.remove());
  const cur=snapshot(),old=priorFor(cur),pages=host.querySelectorAll('.pt150-page,.ptr-page');if(!pages.length)return;
  pages[pages.length-1].insertAdjacentHTML('beforebegin',buildPage(cur,old));
  let toolbar=host.querySelector('.ptr-toolbar,.pt150-toolbar');if(toolbar&&!toolbar.querySelector('.pt205-save')){const b=document.createElement('button');b.className='pt205-save';b.textContent='Save Review';b.onclick=()=>{const now=snapshot(),rows=load();rows.push(now);save(rows);b.textContent='Review Saved ✓';b.classList.add('saved');setTimeout(inject,50)};toolbar.appendChild(b)}
 }
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);inject();setTimeout(inject,600);return r};
 window.ptSaveCurrentPortfolioReview=function(){const s=snapshot(),rows=load();rows.push(s);save(rows);return s};
 window.ptGetPortfolioReviewHistory=function(name){const rows=load();if(!name)return rows;const k=String(name).trim().toLowerCase();return rows.filter(x=>String(x.portfolioKey||'')===k)};
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  async function savePortfolioBeforeReport(){
    try{
      const portfolio=(typeof getPortfolio==='function'?getPortfolio():[]);
      if(!portfolio.length)return;
      const name=(typeof ptCurrentPortfolioName==='function'?ptCurrentPortfolioName():String(window.ptActivePortfolioName||'My Portfolio'));
      window.ptActivePortfolioName=name;
      try{localStorage.setItem('pt_working_portfolio_name',name)}catch(_){}
      if(typeof saveWorkingPortfolioLocal==='function')saveWorkingPortfolioLocal();
      if(window.ptSupabase&&window.ptUser){
        const payload={user_id:window.ptUser.id,name,portfolio,updated_at:new Date().toISOString()};
        const {error}=await window.ptSupabase.from('member_portfolios').upsert(payload,{onConflict:'user_id,name'});
        if(error)throw error;
      }
    }catch(e){
      console.warn('V206 portfolio auto-save pending:',e?.message||e);
    }
  }

  const prior=window.ptGeneratePortfolioPublication;
  if(typeof prior==='function'){
    window.ptGeneratePortfolioPublication=async function(){
      await savePortfolioBeforeReport();
      const result=await prior.apply(this,arguments);
      try{
        if(typeof ptAutoSavePortfolioReport==='function')ptAutoSavePortfolioReport(typeof getPortfolio==='function'?getPortfolio():[]);
      }catch(e){console.warn('V206 report auto-save pending:',e)}
      return result;
    };
  }

  // Also expose this for any alternate Generate Report control added later.
  window.ptAutoSaveCurrentPortfolio=savePortfolioBeforeReport;
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 function navMarkup(){return `<div class="pt-report-sitehead" data-pt-v207-nav="1"><div class="pt-report-headinner"><button class="pt-report-logo" onclick="ptReportGoHome()"><b>Portfolio Thesis</b><span>Global Ownership. Disciplined Balance.</span></button><div class="pt-report-navactions"><button class="pt-report-librarybtn" onclick="ptV207GoLibrary()">Library</button><button class="pt-report-homebtn" onclick="ptReportGoHome()">Home</button></div></div></div>`}
 function ensureNav(){
   const host=document.getElementById('ptGeneratedReport'); if(!host)return;
   const old=host.querySelector(':scope > .pt-report-sitehead');
   if(!old) host.insertAdjacentHTML('afterbegin',navMarkup());
   else if(!old.querySelector('.pt-report-librarybtn')){
     const inner=old.querySelector('.pt-report-headinner');
     const home=old.querySelector('.pt-report-homebtn');
     if(inner&&home){
       const actions=document.createElement('div');actions.className='pt-report-navactions';
       const lib=document.createElement('button');lib.className='pt-report-librarybtn';lib.textContent='Library';lib.onclick=()=>window.ptV207GoLibrary();
       home.before(actions);actions.append(lib,home);
     }
   }
 }
 window.ptV207GoLibrary=function(){
   const host=document.getElementById('ptGeneratedReport');
   if(host){host.classList.remove('active','pt-v153-open');host.style.display='none'}
   document.body.classList.remove('pt-report-open','ptr-report-open');
   if(typeof ptOpenLibrary==='function')ptOpenLibrary();
   window.scrollTo(0,0);
 };

 // Make the navigation survive the V153 loading screen and every fresh generation path.
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){
   const result=await prior.apply(this,arguments);
   ensureNav();
   requestAnimationFrame(ensureNav);
   setTimeout(ensureNav,250);
   return result;
 };
 window.ptEnsurePortfolioReportNavigation=ensureNav;

 // A saved portfolio owns one current report card. Re-generating updates that card;
 // review-history snapshots preserve the historical comparison separately.
 window.ptAutoSavePortfolioReport=function(portfolio){
   const host=document.getElementById('ptGeneratedReport'); if(!host)return;
   ensureNav();
   const rows=typeof ptLibraryLocal==='function'?ptLibraryLocal('pt_saved_reports'):[];
   const sig=(portfolio||[]).map(x=>String(x.ticker||'').toUpperCase()+':'+Number(x.weight||0)).join('|');
   const portfolioName=String(window.ptActivePortfolioName||(typeof ptCurrentPortfolioName==='function'?ptCurrentPortfolioName():'My Portfolio')||'My Portfolio');
   const title=portfolioName+' — Portfolio Thesis Report';
   const rec={type:'portfolio',title,portfolioName,signature:sig,savedAt:new Date().toLocaleString(),html:host.outerHTML};
   const sameName=x=>(x.type||'').toLowerCase()==='portfolio' && String(x.portfolioName||'').trim().toLowerCase()===portfolioName.trim().toLowerCase();
   const legacyTitle=x=>(x.type||'').toLowerCase()==='portfolio' && String(x.title||'').trim().toLowerCase()===title.trim().toLowerCase();
   const ix=rows.findIndex(x=>sameName(x)||legacyTitle(x));
   if(ix>=0)rows[ix]=rec;else rows.unshift(rec);
   if(typeof ptLibrarySet==='function')ptLibrarySet('pt_saved_reports',rows.slice(0,50));
   else localStorage.setItem('pt_saved_reports',JSON.stringify(rows.slice(0,50)));
 };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const KEY='pt_portfolio_review_history_v2';
 const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
 const num=v=>{const n=Number(v);return Number.isFinite(n)?n:null};
 const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(_){return[]}};
 const key=n=>String(n||'My Portfolio').trim().toLowerCase();
 const alloc=s=>Object.fromEntries((s?.portfolio||[]).map(x=>[String(x.ticker||'').toUpperCase(),num(x.weight)||0]));
 function weighted(s,field){let total=0,known=0;for(const x of s?.portfolio||[]){const v=num(s?.evidence?.[x.ticker]?.[field]);if(v!=null){total+=v*(x.weight/100);known+=x.weight}}return known?total:null}
 function comparison(cur,old){
   const ca=alloc(cur),oa=alloc(old),ts=[...new Set([...Object.keys(ca),...Object.keys(oa)])];
   const changes=ts.map(t=>({t,d:(ca[t]||0)-(oa[t]||0)})).filter(x=>Math.abs(x.d)>=.1);
   const roles=ts.filter(t=>(cur?.evidence?.[t]?.role||'')!==(old?.evidence?.[t]?.role||'')&&(cur?.evidence?.[t]?.role||old?.evidence?.[t]?.role));
   const c=weighted(cur,'top10Weight'),o=weighted(old,'top10Weight'),delta=c!=null&&o!=null?c-o:null;
   const structural=ts.some(t=>{const a=cur?.evidence?.[t],b=old?.evidence?.[t];return a&&b&&((num(a.holdingsCount)!=null&&num(b.holdingsCount)!=null&&a.holdingsCount!==b.holdingsCount)||(num(a.top10Weight)!=null&&num(b.top10Weight)!=null&&Math.abs(a.top10Weight-b.top10Weight)>=.5))});
   return {changes,roles,delta,structural};
 }
 function cell(a,b,c,ch){return `<div class="pt210-cell ${ch?'changed':''}"><b>${esc(a)}</b><span>${esc(b)}${c?' · '+esc(c):''}</span></div>`}
 window.ptV210OpenReview=function(name){
   const rows=load().filter(x=>key(x.portfolioKey||x.portfolioName)===key(name)).sort((a,b)=>b.savedAt-a.savedAt),cur=rows[0],old=rows[1];
   const body=document.getElementById('ptV210ReviewBody'); if(!body)return;
   let html=`<div class="pt210-kicker">Portfolio Review History · ${esc(name)}</div><h1 class="pt210-title">Since Your Last Review</h1>`;
   if(!cur||!old){
     const date=cur?new Date(cur.savedAt).toLocaleDateString():'No review saved yet';
     html+=`<div class="pt210-sub">${esc(date)}</div><div class="pt210-baseline"><b>Baseline review</b><p>${cur?`The first review for ${esc(name)} is saved. The next generated analysis will create the first comparison and show what changed.`:`Generate a report for ${esc(name)} to establish its first comparison point.`}</p></div>`;
   }else{
     const c=comparison(cur,old),conc=c.delta==null?'Not yet measured':Math.abs(c.delta)<.5?'Stable':c.delta>0?'Increased':'Decreased',material=c.changes.length||c.roles.length||c.structural||(c.delta!=null&&Math.abs(c.delta)>=.5);
     html+=`<div class="pt210-sub">Compared with ${esc(new Date(old.savedAt).toLocaleDateString())}</div><div class="pt210-map">${cell('Allocation',c.changes.length?'Changed':'Stable',c.changes.length?`${c.changes.length} change${c.changes.length===1?'':'s'}`:'No material change',!!c.changes.length)}${cell('Portfolio Roles',c.roles.length?'Changed':'Stable',c.roles.length?c.roles.join(', '):'Assignments unchanged',!!c.roles.length)}${cell('Concentration',conc,c.delta==null?'Awaiting comparable evidence':`${c.delta>=0?'+':''}${c.delta.toFixed(1)} pts`,c.delta!=null&&Math.abs(c.delta)>=.5)}${cell('Thesis Evidence',material?'Review':'Stable','Measured structural evidence',!!material)}</div>`;
     html+=`<div class="pt210-findings"><div class="pt210-finding"><small>Allocation</small><b>${c.changes.length?'Portfolio weights changed.':'No material allocation change.'}</b><p>${c.changes.length?c.changes.map(x=>`${x.t} ${x.d>=0?'+':''}${x.d.toFixed(1)} pts`).join(' · '):'The portfolio weighting structure is unchanged from the prior review.'}</p></div><div class="pt210-finding"><small>Concentration</small><b>${conc}.</b><p>${c.delta==null?'Comparable structural evidence is not yet available.':`Weighted Top-10 concentration changed ${c.delta>=0?'+':''}${c.delta.toFixed(1)} percentage points.`}</p></div><div class="pt210-finding"><small>Portfolio Roles</small><b>${c.roles.length?'Changed.':'Stable.'}</b><p>${c.roles.length?`Role assignments changed for ${c.roles.join(', ')}.`:'Core, diversifier and tilt assignments are unchanged.'}</p></div><div class="pt210-finding"><small>Research Read</small><b>${material?'Measured evidence deserves review.':'No material structural change detected.'}</b><p>This describes changes in the evidence, not a buy or sell judgment.</p></div></div>`;
   }
   if(rows.length){html+=`<div class="pt210-timeline"><h3>Review History</h3>${rows.slice(0,8).map((r,i)=>`<div class="pt210-row"><b>${i===0?'Current review':'Prior review'}</b><span>${esc(new Date(r.savedAt).toLocaleString())}</span></div>`).join('')}</div>`}
   body.innerHTML=html; const host=document.getElementById('ptV210Review');host.classList.add('active');host.setAttribute('aria-hidden','false');host.scrollTop=0;document.body.style.overflow='hidden';
 };
 window.ptV210CloseReview=function(toLibrary){const host=document.getElementById('ptV210Review');host.classList.remove('active');host.setAttribute('aria-hidden','true');document.body.style.overflow='';if(toLibrary&&typeof ptOpenLibrary==='function')ptOpenLibrary();else if(!toLibrary&&typeof ptReportGoHome==='function')ptReportGoHome();window.scrollTo(0,0)};
 function enhanceLibrary(){
   const cards=[...document.querySelectorAll('#portfolioReports .pt-library-card, #ptPortfolioReports .pt-library-card')];
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
      heading.insertAdjacentElement("afterend",box);
    }
  }

  const obs=new MutationObserver(()=>requestAnimationFrame(cleanComparison));
  obs.observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener("DOMContentLoaded",()=>requestAnimationFrame(cleanComparison));
  setTimeout(cleanComparison,250);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 function nearZero(v){return v!=null && Number.isFinite(Number(v)) && Math.abs(Number(v))<0.005}
 function refine(){
   const body=document.getElementById("ptV210ReviewBody"); if(!body)return;
   const sec=body.querySelector(".pt217-compare"); if(!sec)return;
   sec.querySelectorAll(".pt219-status").forEach(x=>x.remove());
   const deltas=[...sec.querySelectorAll(".pt217-delta")].map(x=>{const m=(x.textContent||'').match(/[+-]?\d+(?:\.\d+)?/);return m?Number(m[0]):null}).filter(v=>v!=null);
   const summary=[...sec.querySelectorAll(".pt217-summary b")].map(x=>{const m=(x.textContent||'').match(/[+-]?\d+(?:\.\d+)?/);return m?Number(m[0]):null}).filter(v=>v!=null);
   if(!(deltas.length && deltas.every(nearZero) && summary.every(nearZero)))return;
   const intro=sec.querySelector(':scope > p'); if(intro)intro.style.display='none';
   const cards=sec.querySelector('.pt217-summary'); if(cards)cards.style.display='none';
   const table=sec.querySelector('.pt217-table'); if(table)table.style.display='none';
   const old=sec.querySelector('.pt218-nochange'); if(old)old.remove();
   const status=document.createElement('div'); status.className='pt219-status';
   status.innerHTML='<small>Performance comparison</small><b>No meaningful change.</b><p>Price, 1-month return and weighted contribution are effectively unchanged from the prior saved review.</p>';
   const h=sec.querySelector('h2'); if(h)h.insertAdjacentElement('afterend',status); else sec.prepend(status);
 }
 const obs=new MutationObserver(()=>requestAnimationFrame(refine));
 obs.observe(document.documentElement,{subtree:true,childList:true});
 document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(refine));
 setTimeout(refine,300);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const core=window.analyzePortfolio;
 if(typeof core!=="function") return;
 function showStep(n){
   document.querySelectorAll('#ptResearchTransition .pt-research-step').forEach(el=>{
     const k=Number(el.dataset.step); el.classList.toggle('done',k<n); el.classList.toggle('active',k===n);
   });
 }
 function openResearch(){const el=document.getElementById('ptResearchTransition');el.classList.add('pt-open');el.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';showStep(1)}
 function closeResearch(){const el=document.getElementById('ptResearchTransition');el.classList.remove('pt-open');el.setAttribute('aria-hidden','true');document.body.style.overflow=''}
 const frame=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 window.analyzePortfolio=async function(){
   const p=(typeof getPortfolio==='function'?getPortfolio():[]);
   if(!p.length){alert('Add at least one security and allocation first.');return}
   openResearch();
   try{
     await frame(); showStep(2); await frame();
     // Existing portfolio analysis performs classification, allocation and concentration work.
     core();
     showStep(3); await frame();
     // Relationship/evidence layers used by the publication are allowed to resolve before rendering.
     if(typeof window.ptLoadPortfolioETFEvidence==='function'){
       try{await window.ptLoadPortfolioETFEvidence(p)}catch(e){console.warn('ETF evidence load:',e)}
     }
     showStep(4); await frame();
     showStep(5); await frame();
     if(typeof window.ptGeneratePortfolioPublication==='function'){
       await window.ptGeneratePortfolioPublication();
       closeResearch();
     }else{
       closeResearch();
       document.getElementById('analysisPanel')?.scrollIntoView({behavior:'smooth',block:'start'});
     }
   }catch(e){
     console.error('Portfolio analysis transition failed',e); closeResearch();
     alert('The portfolio was preserved, but the report could not finish generating. Please try again.');
   }
 };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  const HEADER_GAP = 18;

  function headerBottom(){
    const h=document.querySelector('header');
    return h ? Math.ceil(h.getBoundingClientRect().bottom) : 0;
  }

  function pt232LandOn(el){
    if(!el) return;
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        const y = window.scrollY + el.getBoundingClientRect().top - headerBottom() - HEADER_GAP;
        window.scrollTo({top:Math.max(0,y),behavior:'auto'});
      });
    });
  }
  window.pt232LandOn = pt232LandOn;

  /* Catch all section navigation, including older showSection callers. */
  const oldShow = window.showSection;
  if(typeof oldShow === 'function'){
    window.showSection = function(id){
      const r=oldShow.apply(this,arguments);
      const el=document.getElementById(id);
      if(el) pt232LandOn(el);
      return r;
    };
  }

  /* Library has its own opener. Preserve its data refresh, then correct landing. */
  const oldLib=window.ptOpenLibrary;
  if(typeof oldLib === 'function'){
    window.ptOpenLibrary=async function(){
      const r=await oldLib.apply(this,arguments);
      pt232LandOn(document.getElementById('library'));
      return r;
    };
  }

  /* Any in-page navigation link/button aimed at a section gets the same correction. */
  document.addEventListener('click',function(e){
    const a=e.target.closest('a[href^="#"]');
    if(!a) return;
