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
