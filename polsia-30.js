  AVDV:{role:'International small/value tilt',kind:'tilt',thesis:'Developed international small/value should add a targeted factor exposure inside the non-U.S. allocation rather than function as a smaller copy of broad international ownership.'},
  QQQM:{role:'U.S. growth tilt',kind:'tilt',thesis:'The growth sleeve should create a deliberate growth and innovation tilt while earning the added concentration and valuation risk it introduces.'},
  SCHD:{role:'Dividend / quality tilt',kind:'tilt',thesis:'The dividend sleeve should add durable income and quality characteristics rather than merely reshuffle companies already dominant in the U.S. core.'},
  BND:{role:'Core bond diversifier',kind:'diversifier',thesis:'The bond sleeve should provide income and portfolio stabilization through broad investment-grade fixed-income exposure.'},
  VNQ:{role:'Real-estate tilt',kind:'tilt',thesis:'The real-estate sleeve should provide a distinct property and REIT exposure large enough to change the portfolio rather than simply add another equity ticker.'},
  GLD:{role:'Gold diversifier',kind:'diversifier',thesis:'Gold should earn its place by behaving differently enough from equity risk to provide a useful source of portfolio diversification.'}
 };
 function rows(card){const m={};card.querySelectorAll('tbody tr').forEach(tr=>{const c=tr.querySelectorAll('td');if(c.length>=3)m[clean(c[0].textContent).toLowerCase()]={reading:clean(c[1].textContent),read:clean(c[2].textContent)}});return m}
 function num(s){const m=String(s||'').match(/[\d,.]+/);return m?Number(m[0].replace(/,/g,'')):null}
 function interaction(m){const s=m['fund interaction']?.reading||'';const mt=s.match(/^(.+?)\s+with\s+([A-Z0-9.\-]+)$/i);return mt?{value:mt[1],other:mt[2].toUpperCase()}:null}
 function copy(t,m){
  const p=profiles[t]; if(!p)return null;
  const div=m['underlying diversification']?.reading||'—'; const top=m['10 largest holdings']?.reading||'—'; const topN=num(top); const ix=interaction(m);
  let yes='',no='',bp='';
  if(t==='VTI'){yes=`VTI spreads the U.S. core across ${div}, so the portfolio is not dependent on selecting individual companies or sectors. That broad underlying ownership is direct evidence for its job as the domestic market foundation.`;no=`The strongest structural tension is weighting concentration: the 10 largest holdings account for ${top}. A broad security count therefore does not guarantee evenly distributed economic exposure.`;bp='The thesis weakens if market-cap concentration rises far enough that the core becomes economically dependent on a narrow group of companies despite retaining thousands of holdings.'}
  else if(t==='VOO'){yes=`VOO owns ${div} and is designed to represent the large-cap U.S. market through the S&P 500. That makes it a direct, transparent source of large-company U.S. exposure rather than an undefined portfolio holding.${topN!=null?` Its current top-10 weight of ${top} also makes the degree of concentration explicit rather than hidden.`:''}`;no=`VOO is not a total-market fund. ${topN!=null?`With ${top} in its 10 largest holdings, `:''}market-cap weighting can make portfolio results unusually dependent on the largest U.S. companies. If another broad U.S. fund is already owned, overlap can also make the sleeve additive in ticker count without adding much new economic exposure.`;bp='The thesis weakens if the portfolio no longer wants a dedicated large-cap U.S. exposure, if concentration becomes inconsistent with the intended core role, or if overlap with another U.S. core makes VOO redundant rather than purposeful.'}
  else if(t==='VXUS'){yes=`VXUS provides ${div} outside the U.S. market, creating a dedicated source of non-U.S. company, regional and currency exposure. That is direct evidence for its role as the portfolio’s international diversifier.`;no='Holding many non-U.S. securities is not enough by itself: the sleeve must continue to deliver economic exposures that are meaningfully different from the U.S. core, including regional earnings, currency and valuation differences.';bp='The thesis weakens if its underlying economic exposures become materially less distinct from the U.S. core or the portfolio no longer seeks a dedicated non-U.S. allocation.'}
  else if(t==='AVUV'){yes=`AVUV targets U.S. small/value across ${div}.${topN!=null?` Its top 10 represent ${top}, helping show that the tilt is not dependent on only a few companies.`:''} The relevant evidence is the deliberate reweighting toward smaller, value-oriented businesses rather than short-term relative performance.`;no='The sleeve adds complexity and can lag the broad market for long periods. Its case depends on preserving genuine small/value characteristics; different returns alone do not prove useful diversification.';bp='The thesis weakens if AVUV loses meaningful small/value exposure, becomes substantially more similar to the broad U.S. core, or stops producing the targeted reweighting it was selected to provide.'}
  else if(t==='AVDV'){yes=`AVDV targets developed international small/value across ${div}, giving the portfolio direct exposure to smaller, value-oriented companies outside the U.S. The evidence for the sleeve is the segment it emphasizes, not simply the number of additional holdings.`;no='A separate international factor sleeve only earns its complexity if its small/value characteristics remain strong enough to create meaningfully different exposure from broad international ownership.';bp='The thesis weakens if AVDV loses its developed-market small/value characteristics or becomes sufficiently duplicative of broad international exposure that the separate sleeve no longer changes the portfolio meaningfully.'}
  else {const q=window.PT_ETF_EVIDENCE?.[t]?.evidenceQuestion||'';yes=`The measured fund structure is consistent with its assigned role as ${p.role.toLowerCase()}. ${div!=='— holdings'?`The current evidence shows ${div}.`:''}${ix?` Its measured interaction with ${ix.other} is ${ix.value}, which should be judged by whether that relationship is intentional for this portfolio.`:''}`;no=`The sleeve should not be justified by ticker count alone. Its underlying exposures, concentration and interaction with the other holdings must remain distinct enough to earn a separate allocation.${q?` The next research test is: ${q}`:''}`;bp=`The thesis weakens if the fund stops delivering the ${p.role.toLowerCase()} exposure it was selected for, or if overlap and concentration make that role redundant or materially different from the portfolio’s intent.`}
  return {yes,no,bp};
 }
 function apply(){document.querySelectorAll('.pt159-card').forEach(card=>{const t=clean(card.querySelector('.pt159-head b')?.textContent).toUpperCase(),p=profiles[t];if(!p)return;const m=rows(card),c=copy(t,m);const role=card.querySelector('.pt159-role strong');if(role)role.textContent=p.role;const pr=[...card.querySelectorAll('tbody tr')].find(r=>clean(r.children[0]?.textContent).toLowerCase()==='portfolio role');if(pr){pr.children[1].textContent=p.role;pr.children[2].textContent=p.kind==='core'?'Foundation':p.kind==='diversifier'?'Diversifier':'Deliberate tilt'}const th=card.querySelector('.pt159-thesis b');if(th)th.textContent=p.thesis;card.querySelectorAll('.pt159-section').forEach(sec=>{const lab=clean(sec.querySelector('small')?.textContent).toUpperCase(),el=sec.querySelector('p');if(!el)return;if(lab.includes('EVIDENCE FOR')||lab.includes('SUPPORTS')){sec.querySelector('small').textContent='EVIDENCE FOR';el.textContent=c.yes}else if(lab.includes('EVIDENCE AGAINST')||lab.includes('CHALLENGES')){sec.querySelector('small').textContent='EVIDENCE AGAINST';el.textContent=c.no}else if(lab.includes('THESIS BREAKPOINT')||lab.includes('WHAT WOULD CHANGE')){sec.querySelector('small').textContent='THESIS BREAKPOINT';el.textContent=c.bp}})})}
 const prior=window.ptGeneratePortfolioPublication;if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);apply();setTimeout(apply,500);return r};setTimeout(apply,0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  const baseFetch = window.ptFetchETFEvidence;
  const baseGenerate = window.ptGeneratePortfolioPublication;
  const ATTEMPT_TTL = 5 * 60 * 1000;
  const attempts = new Map();
  const inflight = new Map();

  function ticker(x){ return String(x||'').trim().toUpperCase(); }
  function hasStructural(e){
    return !!(e && (
      Number.isFinite(Number(e.holdingsCount)) ||
      Number.isFinite(Number(e.top10Weight)) ||
      (Array.isArray(e.holdings) && e.holdings.length)
    ));
  }

  window.ptFetchETFEvidence = async function(symbol,{force=false}={}){
    const t=ticker(symbol);
    if(!t) return null;

    if(inflight.has(t)) return inflight.get(t);

    const e=window.PT_ETF_EVIDENCE?.[t];
    const last=attempts.get(t)||0;

    // If structural evidence is already loaded, keep it for the normal cache
    // window. If the provider just returned no structural evidence, do not
    // immediately retry during the same report workflow.
    if(!force){
      if(hasStructural(e)) return e;
      if(Date.now()-last < ATTEMPT_TTL) return e||null;
    }

    attempts.set(t,Date.now());
    const job=(async()=>{
      try{
        return await baseFetch(t,{force});
      } finally {
        inflight.delete(t);
      }
    })();
    inflight.set(t,job);
    return job;
  };

  window.ptLoadPortfolioETFEvidence = async function(portfolio,{force=false}={}){
    const ts=[...new Set((portfolio||[])
      .map(x=>ticker(x.ticker))
      .filter(t=>window.ptETFIsEvidenceFund?.(t)))];

    // Sequential by design: richer evidence is more valuable than bursty
    // requests that increase provider-rate-limit risk.
    for(const t of ts){
      try{ await window.ptFetchETFEvidence(t,{force}); }catch(_){}
    }
    return ts;
  };

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
