 function etf(r){let body=`<div class="pt265-companybar">${field('ticker','ETF ticker',ticker(r),false,'e.g. AVUV')}</div><div class="pt267-section"><h3>Fund Evidence</h3><p>Portfolio Thesis should supply factual fund data. The worksheet focuses on what those facts mean for the portfolio.</p><div class="pt267-cards"><div class="pt267-card"><h4>Structure</h4>${field('expense','Expense ratio %',val(r,'expense'))}${field('holdings','Holdings count',val(r,'holdings'))}</div><div class="pt267-card"><h4>Concentration</h4>${field('top10','Top-10 weight %',val(r,'top10'))}${field('benchmark','Benchmark',val(r,'benchmark'))}</div><div class="pt267-card"><h4>Exposure</h4>${field('factor','Factor / style exposure',val(r,'factor'))}${field('overlap','Portfolio overlap %',val(r,'overlap'))}</div></div></div><div class="pt267-section"><h3>Portfolio Impact</h3>${field('objective','What exposure are you trying to add?',val(r,'objective'),true)}${field('change','What changes at the portfolio level if this fund is added?',val(r,'change'),true)}${field('tradeoff','What is the main trade-off versus adding more to the core?',val(r,'tradeoff'),true)}</div><div class="pt267-section"><h3>ETF Role Assessment</h3>${field('allocation','Allocation being tested %',val(r,'allocation'))}<div class="pt175-field"><label>Proposed role</label><select class="pt267-select" data-field="role"><option></option><option ${val(r,'role')==='Core'?'selected':''}>Core</option><option ${val(r,'role')==='Diversifier'?'selected':''}>Diversifier</option><option ${val(r,'role')==='Tilt'?'selected':''}>Tilt</option></select></div>${field('conclusion','Why does this fund deserve a place in the portfolio?',val(r,'conclusion'),true)}</div><div class="pt267-actions"><button class="pt175-btn primary" onclick="pt267Save(true,'role')">Save & Continue to Portfolio Role →</button><button class="pt175-btn" onclick="pt267Save(false)">Save worksheet</button></div>`;shell('etf',r,'FUND & ETF ANALYSIS · STEP 1','ETF Analysis Worksheet','Understand what the fund adds and what changes if you use it.',body,'fund')}
 function role(r){let e=latest('etf'),body=`<div class="pt265-companybar">${field('ticker','Holding / ticker',val(r,'ticker')||E(e?.values?.ticker||''))}</div><div class="pt267-section"><h3>Define the Job</h3><div class="pt175-field"><label>Portfolio role</label><select class="pt267-select" data-field="role"><option></option><option ${val(r,'role')==='Core'?'selected':''}>Core</option><option ${val(r,'role')==='Diversifier'?'selected':''}>Diversifier</option><option ${val(r,'role')==='Tilt'?'selected':''}>Tilt</option></select></div>${field('weight','Portfolio weight %',val(r,'weight'))}${field('adds','What distinct exposure or function does this holding add?',val(r,'adds'),true)}</div><div class="pt267-section"><h3>Duplication Test</h3>${field('overlap','Where does it overlap with existing holdings?',val(r,'overlap'),true)}${field('distinct','Despite that overlap, what remains meaningfully distinct?',val(r,'distinct'),true)}</div><div class="pt267-section"><h3>Role Assessment</h3>${field('evidence','Evidence supporting this role',val(r,'evidence'),true)}${field('conclusion','Is the holding’s job clear, distinct and worth its allocation?',val(r,'conclusion'),true)}</div><div class="pt267-actions"><button class="pt175-btn primary" onclick="pt267Save(true,null,'fund')">Save Role & Finish</button><button class="pt175-btn" onclick="pt267Save(false)">Save worksheet</button></div>`;shell('role',r,'FUND & ETF ANALYSIS · STEP 2','Portfolio Role Worksheet','Define why the holding exists instead of measuring performance contribution.',body,'fund')}
 function overlap(r){let body=`<div class="pt267-section"><h3>Look-Through Evidence</h3><p>This worksheet is designed for portfolio-level look-through data. Until the structural pipeline is connected, the evidence fields remain editable.</p><div class="pt267-cards"><div class="pt267-card">${field('concentration','Largest underlying exposures',val(r,'concentration'),true)}</div><div class="pt267-card">${field('overlap','Major holding overlap',val(r,'overlap'),true)}</div><div class="pt267-card">${field('gaps','Potential diversification gaps',val(r,'gaps'),true)}</div></div></div><div class="pt267-section"><h3>Intentional vs. Accidental Exposure</h3>${field('intentional','Which concentrations or overlaps are intentional?',val(r,'intentional'),true)}${field('accidental','Which exposures appear accidental or redundant?',val(r,'accidental'),true)}${field('distinct','What genuinely distinct exposures are present?',val(r,'distinct'),true)}</div><div class="pt267-section"><h3>Diversification Assessment</h3>${field('conclusion','Summarize concentration, overlap, distinct exposures and gaps.',val(r,'conclusion'),true)}</div><div class="pt267-actions"><button class="pt175-btn primary" onclick="pt267Save(true,'review')">Save & Continue to Portfolio Review →</button><button class="pt175-btn" onclick="pt267Save(false)">Save worksheet</button></div>`;shell('overlap',r,'PORTFOLIO ANALYSIS · STEP 1','Diversification & Overlap Worksheet','Look beneath ticker count to see what the portfolio actually owns.',body,'portfolio')}
 function review(r){let body=`<div class="pt267-section"><h3>Review Period</h3>${field('period','Review date / period',val(r,'period'),false,'e.g. Q4 2026')}<div class="pt267-callout">The purpose is to identify meaningful change—not to manufacture a reason to trade. “No change” is a valid review outcome.</div></div><div class="pt267-section"><h3>Since the Last Review</h3>${field('allocation','Meaningful allocation drift or holdings added/removed',val(r,'allocation'),true)}${field('thesis','Have any holding theses materially changed?',val(r,'thesis'),true)}${field('portfolio','Has portfolio-level concentration or diversification changed?',val(r,'portfolio'),true)}</div><div class="pt267-section"><h3>Decision</h3><div class="pt175-field"><label>Review outcome</label><select class="pt267-select" data-field="outcome"><option></option>${['No change','Monitor','Research further','Rebalance','Review a holding'].map(x=>`<option ${val(r,'outcome')===x?'selected':''}>${x}</option>`).join('')}</select></div>${field('reason','Why is this the appropriate action?',val(r,'reason'),true)}${field('monitor','What should be checked at the next review?',val(r,'monitor'),true)}</div><div class="pt267-section"><h3>Portfolio Review Record</h3>${field('conclusion','Document what changed, what did not, and why.',val(r,'conclusion'),true)}</div><div class="pt267-actions"><button class="pt175-btn primary" onclick="pt267Save(true,null,'portfolio')">Save Review & Finish</button><button class="pt175-btn" onclick="pt267Save(false)">Save worksheet</button></div>`;shell('review',r,'PORTFOLIO ANALYSIS · STEP 2','Portfolio Review Worksheet','Document whether anything changed enough to deserve attention.',body,'portfolio')}
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior!=='function')return;
 const N=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(v);return Number.isFinite(n)?n:null};
 const E=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
 async function invoke(name,body){
  try{
   if(!window.ptSupabase?.functions?.invoke)return null;
   const r=await window.ptSupabase.functions.invoke(name,{body});
   if(r?.error)throw r.error;
   return r?.data||null;
  }catch(e){console.warn('V269 '+name,e?.message||e);return null}
 }
 function holdings(){
  try{return (typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:String(x.ticker||x.symbol||'').trim().toUpperCase(),weight:N(x.weight)||0})).filter(x=>x.ticker&&x.weight>0)}catch(_){return []}
 }
 function walk(o,fn,seen=new Set()){
  if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);fn(o);
  if(Array.isArray(o))o.forEach(x=>walk(x,fn,seen));else Object.values(o).forEach(x=>walk(x,fn,seen));
 }
 function fundRows(root){
  const out=new Map();
  walk(root,o=>{
   const t=String(o.ticker||o.symbol||'').toUpperCase();
   if(!/^[A-Z][A-Z0-9.-]{0,9}$/.test(t))return;
   const count=N(o.usableTickerCount??o.holdingsCount??o.holdings_count??o.rawHoldingCount);
   const period=o.reportPeriod||o.report_period||o.asOf||o.as_of||null;
   const provider=o.provider||o.source||null;
   if(count!=null||period||provider){const old=out.get(t)||{};out.set(t,{...old,...o,ticker:t,count:count??old.count,period:period||old.period,provider:provider||old.provider})}
  });
  return out;
 }
 function coverage(expo){
  const s=N(expo?.coverage?.sector?.coveragePct??expo?.coverage?.sector?.classifiedPortfolioWeightPct);
  const g=N(expo?.coverage?.geography?.coveragePct??expo?.coverage?.geography?.classifiedPortfolioWeightPct);
  return {sector:s,geography:g};
 }
 function host(){return document.getElementById('ptGeneratedReport')||document.getElementById('ptrReportOverlay')||document.getElementById('reportOverlay')}
 function patch(look,expo,p){
  const h=host();if(!h)return;
  h.querySelectorAll('.pt269-source').forEach(x=>x.remove());
  const funds=fundRows(look),cov=coverage(expo);
  const research=[...h.querySelectorAll('.pt150-page,.ptr-page')].find(x=>/FUND\s*&\s*SECURITY RESEARCH/i.test(x.textContent||''));
  if(research){
   const rows=p.map(x=>funds.get(x.ticker)).filter(Boolean);
   if(rows.length){
    const periods=[...new Set(rows.map(x=>x.period).filter(Boolean))];
    const providers=[...new Set(rows.map(x=>String(x.provider||'').replace(/\s+/g,' ').trim()).filter(Boolean))];
    const box=document.createElement('div');box.className='pt269-source';
    box.innerHTML=`<b>Constituent look-through verified</b> · ${rows.length}/${p.length} portfolio funds matched to stored constituent snapshots.${periods.length?` Reporting period${periods.length>1?'s':''}: ${periods.map(E).join(', ')}.`:''}${providers.length?` Source: ${E(providers[0])}.`:''}<div class="pt269-coverage">${rows.map(x=>`<span class="pt269-chip">${E(x.ticker)} · ${Number(x.count).toLocaleString()} usable holdings</span>`).join('')}</div>`;
    const lead=research.querySelector('h2');(lead||research.firstElementChild)?.insertAdjacentElement('afterend',box);
   }
  }
  // Exposure classification coverage remains available in the exposure payload
  // for internal validation, but is intentionally not rendered in the report.
  h.querySelectorAll('.pt274-coverage-line').forEach(x=>x.remove());
 }
 window.ptGeneratePortfolioPublication=async function(){
  const p=holdings();
  const body={holdings:p};
  const [look,expo]=p.length?await Promise.all([invoke('portfolio-lookthrough',body),invoke('portfolio-exposures',body)]):[null,null];
  window.__ptVerifiedPortfolioLookthrough=look;
  window.__ptVerifiedPortfolioExposures=expo;
  const r=await prior.apply(this,arguments);
  patch(look,expo,p);setTimeout(()=>patch(look,expo,p),450);
  return r;
 };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const oldFetch=window.ptFetchETFEvidence;
 const oldGenerate=window.ptGeneratePortfolioPublication;
 const N=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(String(v).replace('%','').replace(/,/g,''));return Number.isFinite(n)?n:null};
 const norm=t=>String(t||'').trim().toUpperCase();
 const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
 function walk(o,fn,seen=new Set()){if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);fn(o);if(Array.isArray(o))o.forEach(x=>walk(x,fn,seen));else Object.values(o).forEach(x=>walk(x,fn,seen))}
 function structural(root,t){
   let best=null,score=-1;
   walk(root,o=>{
     const ot=norm(o.ticker||o.symbol||o.fundTicker||o.fund_ticker||t);
     if(ot&&ot!==t)return;
     const count=N(o.usableTickerCount??o.usable_ticker_count??o.holdingsCount??o.holdings_count??o.rawHoldingCount??o.raw_holdings_count??o.totalHoldings??o.total_holdings);
     const top10=N(o.top10Weight??o.top10_weight??o.top10WeightPct??o.top10_weight_pct??o.topTenWeight??o.topTenWeightPct);
     let items=null;
     for(const k of ['holdings','topHoldings','top_holdings','constituents','positions'])if(Array.isArray(o[k])&&o[k].length){items=o[k];break}
     const period=o.reportPeriod||o.report_period||o.asOf||o.as_of||o.holdingsAsOf||o.holdings_as_of||null;
     const sc=(count!=null?4:0)+(top10!=null?4:0)+(items?.length?3:0)+(period?1:0);
     if(sc>score){best={count,top10,items,period,source:o.structuralSource||o.structural_source||o.source||null};score=sc}
   });
   return best;
 }
 function item(h){return {ticker:norm(h?.ticker||h?.symbol||h?.instrument_ticker),name:h?.name||h?.companyName||h?.securityName||h?.instrument_name||null,weight:N(h?.weightPct??h?.weight_pct??h?.weightPercentage??h?.percentWeight??h?.portfolioWeightPct??h?.fundWeightPct??h?.weight)}}
 function merge(t,s){
   if(!s)return null;
   const e=window.PT_ETF_EVIDENCE?.[t]; if(!e)return s;
   const hs=(s.items||[]).map(item).filter(x=>x.ticker||x.name);
   if(s.count!=null)e.holdingsCount=s.count;
   if(s.top10!=null)e.top10Weight=s.top10;
   if(s.period)e.asOf=s.period;
   if(hs.length)e.holdings=hs;
   if(e.top10Weight==null&&hs.length>=10&&hs.slice(0,10).every(x=>x.weight!=null))e.top10Weight=hs.slice(0,10).reduce((a,x)=>a+x.weight,0);
   if(e.holdingsCount==null&&hs.length)e.holdingsCount=hs.length;
   e.structuralSource=s.source||e.structuralSource||'stored structural snapshot';
   try{localStorage.setItem(`pt_etf_evidence_${t}`,JSON.stringify({savedAt:Date.now(),data:e}))}catch(_){}
   return e;
 }
 async function capture(t){
   if(!window.ptSupabase?.functions?.invoke)return null;
   try{
     const {data,error}=await window.ptSupabase.functions.invoke('capture-etf-research',{body:{ticker:t,symbol:t}});
     if(error)throw error;
     const s=structural(data,t); merge(t,s); return s;
   }catch(e){console.warn('V272 structural snapshot unavailable',t,e);return null}
 }
 if(typeof oldFetch==='function')window.ptFetchETFEvidence=async function(symbol,opts={}){
   const t=norm(symbol),base=await oldFetch.call(this,t,opts);
   await capture(t);
   return window.PT_ETF_EVIDENCE?.[t]||base;
 };
 window.ptLoadPortfolioETFEvidence=async function(portfolio,{force=false}={}){
   const ts=[...new Set((portfolio||[]).map(x=>norm(x.ticker)).filter(t=>window.ptETFIsEvidenceFund?.(t)))];
   for(const t of ts)await window.ptFetchETFEvidence(t,{force});
   return ts;
 };
 function row(card,label){return [...card.querySelectorAll('tbody tr')].find(r=>clean(r.children[0]?.textContent).toLowerCase()===label)}
 function patchCards(){
   document.querySelectorAll('.pt159-card').forEach(card=>{
     const t=norm(card.querySelector('.pt159-head b')?.textContent),e=window.PT_ETF_EVIDENCE?.[t];if(!e)return;
     const count=N(e.holdingsCount??e.usableTickerCount),top10=N(e.top10Weight??e.top10WeightPct);
     const div=row(card,'underlying diversification'),top=row(card,'10 largest holdings');
     if(div&&count!=null){div.children[1].textContent=`${count.toLocaleString()} holdings`;div.children[2].textContent=count>1000?'Broad ownership':count>=400?'Broad large-cap set':'More targeted'}
     if(top&&top10!=null){top.children[1].textContent=`${top10.toFixed(2)}%`;top.children[2].textContent=top10>25?'Top-heavy':'More distributed'}
