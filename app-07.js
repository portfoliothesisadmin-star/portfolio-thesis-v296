     td[6].textContent=vals.m1==null?'—':`${vals.m1*w/100>=0?'+':''}${(vals.m1*w/100).toFixed(2)} pts`;
     for(const k of Object.keys(vals)){if(vals[k]!=null){sums[k]+=vals[k]*w/100;counts[k]++}}
   }
   const total=rows.find(tr=>(tr.children[0]?.textContent||'').trim().toUpperCase()==='PORTFOLIO');
   if(total){const td=[...total.children];td[2].textContent=counts.m1?fmt(sums.m1):'—';td[3].textContent=counts.m3?fmt(sums.m3):'—';td[4].textContent=counts.ytd?fmt(sums.ytd):'—';td[5].textContent=counts.y1?fmt(sums.y1):'—';td[6].textContent=counts.m1?`${sums.m1>=0?'+':''}${sums.m1.toFixed(2)} pts`:'—';}
 }
 function replaceScorecardPage(){
   const page=findPage(); if(!page)return;
   const securities=[...page.querySelectorAll('.pt150-security')].map(el=>{
     const t=(el.querySelector('.pt150-security-head b')?.textContent||'').trim().toUpperCase();
     const wt=(el.querySelector('.pt150-security-head span')?.textContent||'').trim();
     const cells=[...el.querySelectorAll('.pt150-security-grid div')].map(d=>({k:(d.querySelector('small')?.textContent||'').trim(),v:(d.querySelector('strong')?.textContent||'').trim()}));
     const get=k=>cells.find(x=>x.k.toLowerCase().includes(k))?.v||'—';
     const live=perfFor(t); return {t,wt,m1:live.m1!=null?fmt(live.m1):get('1 month'),ytd:live.ytd!=null?fmt(live.ytd):get('ytd'),holdings:get('holdings'),top10:get('top 10'),asof:(el.querySelector('p')?.textContent||'').replace(/^Evidence (shown from available observations )?through\s*/i,'').replace(/\.$/,'')};
   }).filter(x=>x.t);
   if(!securities.length)return;
   const cards=securities.map(x=>{
     const ov=overlapFor(x.t), other=ov?(ov.a===x.t?ov.b:ov.a):null;
     const hc=numText(x.holdings), t10=numText(x.top10);
     const diversification=hc==null?'Unresolved':hc>1000?'Broad ownership':'More targeted';
     const conc=t10==null?'Unresolved':t10>25?'Top-heavy':'More distributed';
     return `<div class="pt159-card"><div class="pt159-head"><div><small>PORTFOLIO THESIS / FUND SCORECARD</small><b>${esc(x.t)}</b><span>${esc(x.wt)}</span></div><div class="pt159-role"><small>CURRENT ROLE</small><strong>${esc(role(x.t))}</strong></div></div><table class="pt159-table"><thead><tr><th>COMPONENT</th><th>CURRENT READING</th><th>READ</th></tr></thead><tbody><tr><td>Performance</td><td>1M ${esc(x.m1)} · YTD ${esc(x.ytd)}</td><td>${x.m1==='—'&&x.ytd==='—'?'Unresolved':'Observed'}</td></tr><tr><td>Underlying diversification</td><td>${esc(x.holdings)} holdings</td><td>${diversification}</td></tr><tr><td>10 largest holdings</td><td>${t10==null?'—':esc(x.top10)}</td><td>${conc}</td></tr><tr><td>Fund interaction</td><td>${ov?`${esc(ov.ov)} with ${esc(other)}`:'—'}</td><td>${ov?`${esc(ov.shared)} shared holdings`:'Unresolved'}</td></tr><tr><td>Portfolio role</td><td>${esc(role(x.t))}</td><td>${x.t==='VTI'||x.t==='VXUS'?'Foundation':'Deliberate tilt'}</td></tr></tbody></table><div class="pt159-thesis pt159-section"><small>THE THESIS</small><b>${esc(thesis(x.t))}</b></div><div class="pt159-two"><div class="pt159-section"><small>SUPPORTS THE THESIS</small><p>${supportText(x.t,hc,t10,ov,other)}</p></div><div class="pt159-section"><small>CHALLENGES THE THESIS</small><p>${esc(challenge(x.t))}</p></div></div><div class="pt159-bottom pt159-section"><small>WHAT WOULD CHANGE OUR VIEW</small><p>A material change in underlying diversification, largest-holding concentration, overlap, factor distinctness, or the evidence supporting this fund's assigned job.</p><small>EVIDENCE SNAPSHOT</small><p>${x.asof?`Constituent evidence through ${esc(x.asof)}. `:''}Missing measurements remain unresolved rather than estimated.</p></div></div>`;
   }).join('');
   const foot=page.querySelector('.pt150-foot')?.outerHTML||'';
   page.innerHTML=`<div class="pt150-k">FUND SCORECARDS</div><h2>Evidence by holding.</h2><p class="pt150-deck">Each fund is tested against the job it performs in the portfolio. The scorecard separates observed evidence from unresolved measurements.</p>${cards}${foot}`;
 }
 window.ptGeneratePortfolioPublication=async function(){
   const out=await prior.apply(this,arguments);
   patchPerformanceTable();
   replaceScorecardPage();
   return out;
 };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


/* V167 — FINAL override. Must load after V159/V152, which were replacing the generator after earlier performance fixes. */
(function(){
 const prior=window.ptGeneratePortfolioPublication;
 const N=v=>{if(v===null||v===undefined||v===''||v===false)return null;const n=Number(v);return Number.isFinite(n)?n:null};
 const fmt=v=>v==null?'—':`${v>=0?'+':''}${v.toFixed(2)}%`;
 function deepPeriod(root,aliases){let found=null,seen=new Set();function rec(o){if(found!=null||!o||typeof o!=='object'||seen.has(o))return;seen.add(o);for(const a of aliases){const x=o[a];if(x!==undefined){for(const v of [x?.returnPct,x?.pct,o[a+'Pct'],x?.return,x]){const n=N(v);if(n!=null){found=n;return}}}}for(const v of Object.values(o))rec(v)}rec(root);return found}
 function tickerOf(o){return String(o?.ticker||o?.symbol||o?.security?.ticker||o?.security?.symbol||'').toUpperCase()}
 function extract(root){const out={},seen=new Set();function rec(o){if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);if(!Array.isArray(o)){const t=tickerOf(o);if(t){const v={m1:deepPeriod(o,['oneMonth','1m','month1']),m3:deepPeriod(o,['threeMonth','3m','month3']),ytd:deepPeriod(o,['ytd','YTD']),y1:deepPeriod(o,['oneYear','1y','year1'])};if(Object.values(v).some(x=>x!=null))out[t]=Object.assign(out[t]||{},v)}}for(const v of Object.values(o))rec(v)}rec(root);return out}
 async function fetchPerf(tickers){try{const r=await window.ptSupabase.functions.invoke('security-performance',{body:{tickers}});if(r?.error)throw r.error;return r?.data||null}catch(e){console.warn('V167 security-performance',e);return null}}
 function patch(map,p){
  const page=[...document.querySelectorAll('.pt150-page')].find(x=>/What moved the portfolio\./i.test(x.textContent||''));
  const table=page?.querySelector('.pt150-table');let sums={m1:0,m3:0,ytd:0,y1:0},counts={m1:0,m3:0,ytd:0,y1:0};
  if(table){for(const tr of table.querySelectorAll('tbody tr')){const td=[...tr.children];if(td.length<7)continue;const t=(td[0].textContent||'').trim().toUpperCase();if(t==='PORTFOLIO')continue;const h=p.find(x=>x.ticker===t),v=map[t]||{},w=h?.weight||0;td[2].textContent=fmt(v.m1);td[3].textContent=fmt(v.m3);td[4].textContent=fmt(v.ytd);td[5].textContent=fmt(v.y1);td[6].textContent=v.m1==null?'—':`${v.m1*w/100>=0?'+':''}${(v.m1*w/100).toFixed(2)} pts`;for(const k of ['m1','m3','ytd','y1'])if(v[k]!=null){sums[k]+=v[k]*w/100;counts[k]++}}
   const total=[...table.querySelectorAll('tbody tr')].find(tr=>(tr.children[0]?.textContent||'').trim().toUpperCase()==='PORTFOLIO');if(total){const td=[...total.children];for(const [i,k] of [[2,'m1'],[3,'m3'],[4,'ytd'],[5,'y1']])td[i].textContent=counts[k]?fmt(sums[k]):'—';td[6].textContent=counts.m1?`${sums.m1>=0?'+':''}${sums.m1.toFixed(2)} pts`:'—'}
  }
  for(const card of document.querySelectorAll('.pt159-card')){const t=(card.querySelector('.pt159-head b')?.textContent||'').trim().toUpperCase(),v=map[t];if(!v)continue;const row=[...card.querySelectorAll('.pt159-table tbody tr')].find(r=>(r.children[0]?.textContent||'').trim()==='Performance');if(row){row.children[1].textContent=`1M ${fmt(v.m1)} · YTD ${fmt(v.ytd)}`;row.children[2].textContent=(v.m1!=null||v.ytd!=null)?'Observed':'Unresolved'}}
 }
 window.ptGeneratePortfolioPublication=async function(){
   const result=await prior.apply(this,arguments);
   const p=(typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:String(x.ticker||'').toUpperCase(),weight:N(x.weight)||0})).filter(x=>x.ticker&&x.weight>0);
   if(!p.length)return result;
   let map=extract(window.__pt151?.securityPerf);
   if(p.some(x=>!map[x.ticker])){const raw=await fetchPerf(p.map(x=>x.ticker));window.__pt166RawPerformance=raw;map=Object.assign(map,extract(raw))}
   window.__pt166Performance=map;patch(map,p);return result;
 };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 function apply(){
   /* Shorter header so the contribution column remains visible on mobile. */
   const page=[...document.querySelectorAll('.pt150-page')].find(x=>/What moved the portfolio\./i.test(x.textContent||''));
   const table=page?.querySelector('.pt150-table');
   if(table){
     const h=table.querySelector('thead tr th:nth-child(7)');
     if(h)h.innerHTML='1M<br>CONTRIB.';
   }
   /* Put scorecard performance periods on separate lines. */
   for(const card of document.querySelectorAll('.pt159-card')){
     const row=[...card.querySelectorAll('.pt159-table tbody tr')].find(r=>(r.children[0]?.textContent||'').trim()==='Performance');
     if(!row||!row.children[1])continue;
     const txt=(row.children[1].textContent||'').trim();
     const m=txt.match(/1M\s+([^·]+)\s*·\s*YTD\s+(.+)/i);
     if(m)row.children[1].innerHTML=`<span class="pt159-perf-reading"><span>1M ${m[1].trim()}</span><span>YTD ${m[2].trim()}</span></span>`;
   }
 }
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);apply();return r};
 setTimeout(apply,0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const num=t=>{const m=String(t||'').replace(/,/g,'').match(/[-+]?\d+(?:\.\d+)?/);return m?Number(m[0]):null};
 function allocation(){
   const p=(typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:String(x.ticker||'').toUpperCase(),weight:Number(x.weight)||0})).filter(x=>x.ticker&&x.weight>0);
   document.querySelectorAll('.pt150-alloc').forEach(bar=>{
     const kids=[...bar.children]; kids.forEach((d,i)=>{const x=p[i];if(!x)return;d.innerHTML=`<span class="pt169-alloc-ticker">${x.ticker}</span><span class="pt169-alloc-weight">${x.weight.toFixed(0)}%</span>`});
   });
   document.querySelectorAll('.pt150-legend').forEach(x=>x.remove());
 }
 function contribution(){
   const page=[...document.querySelectorAll('.pt150-page')].find(x=>/What moved the portfolio\./i.test(x.textContent||''));
   const table=page?.querySelector('.pt150-table'); if(!table)return;
   if(page.querySelector('.pt169-impact'))return;
   const rows=[...table.querySelectorAll('tbody tr')]; const data=[]; let total=null;
   rows.forEach(tr=>{const td=[...tr.children];if(td.length<7)return;const t=(td[0].textContent||'').trim();const v=num(td[6].textContent);if(t.toUpperCase()==='PORTFOLIO')total=v;else if(v!=null)data.push({t,v})});
   /* Remove contribution column from the dense performance table. */
   table.querySelectorAll('tr').forEach(tr=>{if(tr.children.length>=7)tr.children[6].remove()});
   if(!data.length)return;
   const max=Math.max(...data.map(x=>Math.abs(x.v)),.01);
   const impact=document.createElement('div');impact.className='pt169-impact';
   impact.innerHTML=`<div class="pt169-impact-head"><div><small>ALLOCATION × PERFORMANCE</small><b>1-Month Portfolio Impact</b></div><div class="pt169-impact-total"><span>Portfolio</span><strong>${total==null?'—':`${total>=0?'+':''}${total.toFixed(2)}%`}</strong></div></div>
   <div>${data.map(x=>`<div class="pt169-impact-row"><span>${x.t}</span><div class="pt169-impact-track"><div class="pt169-impact-bar" style="width:${Math.max(4,Math.abs(x.v)/max*100).toFixed(1)}%"></div></div><span class="pt169-impact-value">${x.v>=0?'+':''}${x.v.toFixed(2)} pts</span></div>`).join('')}</div>
   <p class="pt169-impact-note"><b>How to read this:</b> Portfolio impact combines each fund's return with its allocation. A larger move in a smaller sleeve can affect the portfolio about as much as a smaller move in a larger holding.</p>`;
   table.insertAdjacentElement('afterend',impact);
 }
 function apply(){allocation();contribution()}
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);apply();return r};
 setTimeout(apply,0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
const TERMS=[
['Alpha','Return above or below a benchmark after adjusting for the model used to estimate expected return.'],['Asset allocation','How a portfolio is divided among asset classes, regions, strategies or other exposures.'],['Beta','A measure of how strongly a security has historically moved relative to a benchmark.'],['Bond','A debt security representing money lent to an issuer under stated repayment terms.'],['Book value','Accounting value of a company’s net assets: assets minus liabilities.'],['Capital expenditure (CapEx)','Cash spent to acquire or maintain long-lived operating assets.'],['Contribution to return','The approximate effect a holding had on total portfolio return after considering its weight.'],['Core holding','A broad, durable exposure intended to form a portfolio’s foundation.'],['Correlation','The degree to which two return series have historically moved together.'],['Diversifier','A holding intended to add an economically different exposure from the portfolio core.'],['Drawdown','The percentage decline from a prior peak to a later trough.'],['Earnings yield','Earnings divided by price; the inverse of the P/E ratio when the same earnings measure is used.'],['Enterprise value (EV)','A company value measure that incorporates equity value, debt and cash.'],['ETF','An exchange-traded fund: a pooled investment vehicle whose shares trade on an exchange.'],['EV/EBITDA','Enterprise value divided by EBITDA; a valuation multiple useful for some operating comparisons.'],['Expense ratio','Annual fund operating expenses expressed as a percentage of fund assets.'],['Factor','A measurable characteristic used to describe or systematically weight securities, such as size or value.'],['Free cash flow (FCF)','Operating cash flow minus capital expenditures.'],['Market capitalization','Share price multiplied by shares outstanding.'],['Margin of safety','The percentage gap between an estimated value and market price, measured relative to estimated value.'],['Max drawdown','The largest observed peak-to-trough decline over a specified period.'],['Overlap','The degree to which multiple funds own the same underlying securities or exposures.'],['P/B ratio','Market price relative to book value per share.'],['P/E ratio','Market price relative to earnings per share.'],['Portfolio weight','The percentage of the portfolio represented by a holding or exposure.'],['Rebalancing','Adjusting portfolio weights back toward an intended allocation.'],['Return on invested capital (ROIC)','A measure comparing operating profit after tax with capital invested in the business.'],['Sharpe ratio','Excess return per unit of total return volatility over a stated period.'],['Sortino ratio','Return relative to downside volatility rather than total volatility.'],['Standard deviation','A statistical measure commonly used to describe the dispersion of returns.'],['Stock','An ownership interest in a company.'],['Tilt','A deliberate overweight toward a characteristic, segment or factor relative to a broad baseline.'],['Tracking error','The variability of the difference between a portfolio’s returns and its benchmark’s returns.'],['Turnover','The rate at which a fund replaces holdings over a period, usually expressed as a percentage.'],['Valuation','The process of relating price to earnings, cash flows, assets, growth, risk and other economic evidence.'],['Volatility','The degree to which returns fluctuate over time.'],['Yield curve','The relationship between interest rates and maturities for comparable debt securities.'],['Benchmark','A reference index or portfolio used to compare investment performance or characteristics.'],['Holding weight','The percentage of a portfolio invested in a particular holding.'],['Weighted average cost of capital (WACC)','An estimate of a company’s blended required return across debt and equity financing.'],['Discounted cash flow (DCF)','A valuation method that estimates present value from expected future cash flows discounted for time and risk.'],['Normalized earnings','An estimate of sustainable earnings after adjusting for unusual, temporary or nonrecurring effects.'],['Liquidity','The ability to meet near-term obligations using available cash and assets that can readily become cash.'],['Net debt','Debt minus cash and cash equivalents; a simplified measure of debt remaining after available cash.'],['Thesis breakpoint','A predefined piece of evidence or condition that would materially weaken or invalidate an investment thesis.'],['Valuation multiple','A ratio that compares market value with a financial measure such as earnings, book value or EBITDA.'],['Portfolio contribution','The portion of portfolio return attributable to a holding after considering both its return and portfolio weight.']];
const FORMULAS=[
['PORTFOLIO','Portfolio contribution','Holding weight × holding return','60% × −0.83% ≈ −0.50 percentage points','Explains how a holding’s return translates into portfolio-level impact.'],
['PORTFOLIO','Weighted portfolio return','Σ (holding weight × holding return)','60%×5% + 40%×2% = 3.8%','A static-weight estimate when returns for the same period are available for all holdings.'],
['VALUATION','Margin of safety','(Estimated value − price) ÷ estimated value × 100','$100 value and $75 price = 25%','Shows the gap between market price and an estimated value; the estimate itself remains uncertain.'],
['VALUATION','P/E ratio','Price per share ÷ earnings per share','$50 ÷ $5 EPS = 10×','Relates price to accounting earnings. Compare with appropriate history and peers.'],
['VALUATION','Earnings yield','Earnings per share ÷ price per share × 100','$5 ÷ $50 = 10%','The inverse of P/E when the same earnings basis is used.'],
['VALUATION','Price-to-book','Price per share ÷ book value per share','$30 ÷ $20 = 1.5×','Relates market price to accounting net assets. Relevance varies greatly by business model.'],
['BUSINESS','Free cash flow','Operating cash flow − capital expenditures','$500m − $150m = $350m','Approximates cash remaining after funding capital expenditures.'],
['BUSINESS','FCF margin','Free cash flow ÷ revenue × 100','$350m ÷ $2.0b = 17.5%','Shows how much revenue converts to free cash flow.'],
['QUALITY','ROIC','NOPAT ÷ invested capital × 100','$120m ÷ $800m = 15%','Evaluates operating profit generated relative to capital committed to the business.'],
['RISK','Drawdown','(Trough value − peak value) ÷ peak value × 100','100 → 72 = −28%','Measures a decline from a prior peak.'],
['PORTFOLIO','Effective company exposure','Direct weight + Σ(ETF weight × company weight inside ETF)','60% VTI × 6% company weight = 3.6% exposure','Reveals company exposure hidden inside funds; requires real constituent weights.'],
['PORTFOLIO','Weighted overlap','Σ minimum(weight in Fund A, weight in Fund B) across shared holdings','Calculated from actual constituent weights','Measures how much of two funds is economically shared rather than merely counting duplicate names.'],
['FIXED INCOME','Current yield','Annual coupon income ÷ bond market price × 100','$40 coupon ÷ $950 price ≈ 4.21%','A simple income yield; it is not the same as yield to maturity.'],
['GROWTH','Compound annual growth rate (CAGR)','(Ending value ÷ beginning value)^(1 ÷ years) − 1','$150 ÷ $100 over 5 years ≈ 8.45%/yr','Converts multi-year growth into a compounded annual rate.']
,['VALUATION','EV/EBITDA','Enterprise value ÷ EBITDA','$1.2b EV ÷ $150m EBITDA = 8.0×','Compares enterprise value with operating earnings before interest, taxes, depreciation and amortization.']
,['VALUATION','Discounted cash flow present value','Future cash flow ÷ (1 + discount rate)^period','$110 in one year ÷ 1.10 = $100 present value','Discounts an expected future cash flow into today’s dollars; results depend heavily on cash-flow and discount-rate assumptions.']
,['BUSINESS','Net debt','Total debt − cash and cash equivalents','$600m debt − $200m cash = $400m net debt','Shows debt remaining after available cash is netted against borrowings.']
,['QUALITY','ROIC spread','ROIC − WACC','15% ROIC − 9% WACC = 6 percentage points','A positive spread indicates returns on invested capital exceed the estimated cost of capital.']
,['QUALITY','Interest coverage','EBIT ÷ interest expense','$180m EBIT ÷ $30m interest = 6.0×','Indicates how many times operating earnings cover interest expense.']
,['RISK','Standard deviation','√[Σ(return − average return)² ÷ observations]','Used across a series of periodic returns','Measures dispersion of returns around their average; it describes variability, not the full range of investment risk.']
,['RISK','Sharpe ratio','(Portfolio return − risk-free rate) ÷ return standard deviation','10% − 4% ÷ 12% = 0.50','Relates excess return to total return variability.']
,['PORTFOLIO','Rebalancing drift','Current weight − target weight','27% current − 20% target = +7 percentage points','Shows how far a holding has moved from its target allocation.']
];
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function renderGlossary(q=''){const host=document.getElementById('pt170Glossary');if(!host)return;const z=q.trim().toLowerCase(),rows=TERMS.filter(x=>!z||x.join(' ').toLowerCase().includes(z));host.innerHTML=`<input id="pt170GlossarySearch" class="pt170-search" placeholder="Search terms — e.g. overlap, valuation, drawdown" value="${esc(q)}" oninput="pt170FilterGlossary(this.value)"><div class="pt170-count">${rows.length} of ${TERMS.length} terms</div><div class="pt170-glossary">${rows.map(x=>`<article class="pt170-term"><b>${esc(x[0])}</b><p>${esc(x[1])}</p></article>`).join('')}</div>`}
window.pt170FilterGlossary=renderGlossary;
function renderFormulas(){const host=document.getElementById('pt170Formulas');if(!host)return;host.innerHTML=`<p class="pt170-formula-intro">A working reference for the calculations used throughout Portfolio Thesis. Formulas explain how a measurement is produced; they do not turn an estimate into a certainty.</p><div class="pt170-formulas">${FORMULAS.map(x=>`<article class="pt170-formula"><div class="cat">${esc(x[0])}</div><h3>${esc(x[1])}</h3><div class="pt170-eq">${esc(x[2])}</div><p>${esc(x[4])}</p><p class="pt170-example"><b>Example:</b> ${esc(x[3])}</p></article>`).join('')}</div>`}
window.pt170LearnPage=function(page,btn){document.querySelectorAll('.pt170-learnpage').forEach(x=>x.classList.remove('active'));const map={lessons:'pt170Lessons',glossary:'pt170Glossary',formulas:'pt170Formulas'};document.getElementById(map[page])?.classList.add('active');document.querySelectorAll('.pt170-learnnav button').forEach(x=>x.classList.remove('active'));btn?.classList.add('active');if(page==='glossary'&&!document.querySelector('#pt170Glossary .pt170-term'))renderGlossary();if(page==='formulas'&&!document.querySelector('#pt170Formulas .pt170-formula'))renderFormulas();closeLesson?.()};
const oldOpen=window.openLesson;window.openLesson=function(id){document.querySelectorAll('.pt170-learnpage').forEach(x=>x.classList.remove('active'));document.getElementById('pt170Lessons')?.classList.add('active');document.querySelectorAll('.pt170-learnnav button').forEach((x,i)=>x.classList.toggle('active',i===0));return oldOpen(id)};
renderGlossary();renderFormulas();
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const extra={
 statements:{level:'FINANCIAL STATEMENTS',title:'Reading the Three Financial Statements',body:`<p>A business is easier to understand when the income statement, balance sheet and cash-flow statement are read as one connected system rather than three separate reports.</p><div class="pt171-grid"><div><b>Income statement</b>Shows revenue, expenses and accounting profit over a period.</div><div><b>Balance sheet</b>Shows what the company owns, owes and the equity remaining at a point in time.</div><div><b>Cash-flow statement</b>Reconciles accounting profit with actual cash moving through operations, investing and financing.</div><div><b>The connection</b>Profit changes retained earnings; working-capital and non-cash items help explain why profit and operating cash flow differ.</div></div><h4>What to trace</h4><ul><li>Revenue growth → operating profit → net income.</li><li>Net income → operating cash flow.</li><li>Operating cash flow → capital expenditures → free cash flow.</li><li>Debt, cash and share count → what ultimately belongs to each shareholder.</li></ul><div class="pt171-callout"><b>Example:</b> A company can report rising net income while cash flow weakens because receivables or inventory absorb cash. That does not automatically mean the earnings are poor, but it is evidence worth investigating.</div><div class="pt171-check"><b>Portfolio Thesis takeaway</b><br>Do not stop at EPS. Follow the economic story across all three statements.</div>`},
 quality:{level:'BUSINESS QUALITY',title:'ROIC, WACC & Value Creation',body:`<p>Growth creates value only when the return earned on incremental capital is attractive relative to the cost of financing that capital.</p><h4>ROIC</h4><div class="pt170-eq">ROIC ≈ NOPAT ÷ Invested Capital</div><p>ROIC asks how effectively the operating business turns invested capital into after-tax operating profit.</p><h4>WACC</h4><p>The weighted average cost of capital is an estimate of the return required by the providers of debt and equity capital. It is not directly observable and changes with assumptions.</p><div class="pt171-callout"><b>Economic spread:</b> ROIC above the relevant cost of capital can indicate value creation; ROIC below it can indicate that growth is consuming capital without adequate economic return.</div><h4>What to examine</h4><ul><li>ROIC across several years, not one unusually strong period.</li><li>Whether acquisitions or heavy reinvestment are improving future economics.</li><li>Leverage: high returns on equity can be amplified by debt.</li><li>Whether margins and capital efficiency support each other.</li></ul><div class="pt171-check"><b>Portfolio Thesis takeaway</b><br>Growth rate alone is incomplete. Ask how much capital the growth requires and what return that capital earns.</div>`},
 dcf:{level:'VALUATION',title:'DCF: Turning Cash Flow Into Estimated Value',body:`<p>A discounted cash-flow model estimates value by projecting future cash flows and discounting them back to today. The arithmetic is straightforward; the difficult part is choosing defensible assumptions.</p><div class="pt170-eq">Present Value = Future Cash Flow ÷ (1 + discount rate)^years</div><h4>The major assumptions</h4><div class="pt171-grid"><div><b>Starting cash flow</b>Use a normalized base rather than blindly extending an unusually high or low year.</div><div><b>Growth</b>Separate near-term assumptions from mature long-run growth.</div><div><b>Discount rate</b>Represents required return/risk in the model. Small changes can materially affect value.</div><div><b>Terminal value</b>Often represents a large portion of DCF value, so unrealistic perpetual assumptions can dominate the model.</div></div><h4>Why scenarios matter</h4><p>Portfolio Thesis uses multiple scenarios because a single DCF output can create false precision. Cautious, normalized and stronger-growth assumptions show how sensitive estimated value is to the thesis.</p><div class="pt171-check"><b>Portfolio Thesis takeaway</b><br>A DCF is a structured argument about future cash generation—not a machine that discovers one true price.</div>`},
 normalization:{level:'VALUATION',title:'Normalized Earnings & Cash Flow',body:`<p>Valuation should reflect sustainable earning power rather than assuming the latest year is automatically representative.</p><h4>Why normalization is needed</h4><p>Cycles, restructuring charges, temporary margins, commodity prices, acquisitions, working-capital swings and unusual capital spending can make a single period misleading.</p><h4>A disciplined approach</h4><ul><li>Review several years of revenue, margins, earnings and free cash flow.</li><li>Identify unusual gains, losses or temporary operating conditions.</li><li>Compare cash generation with accounting earnings.</li><li>Use a level that the business evidence can reasonably support rather than simply choosing the most favorable year.</li></ul><div class="pt171-callout"><b>Important:</b> Normalization is an estimate. The assumptions should be visible so another reader can understand why the chosen base differs from reported results.</div><div class="pt171-check"><b>Portfolio Thesis takeaway</b><br>Before applying a multiple or DCF, decide what level of earnings or cash flow you are actually valuing.</div>`},
 etfresearch:{level:'ETF RESEARCH',title:'How to Analyze an ETF',body:`<p>An ETF ticker is only a wrapper. Research starts with what the fund owns, how it weights those holdings and what exposure it is designed to deliver.</p><h4>Five questions</h4><ol><li><b>What is the mandate?</b> Understand the index, strategy or selection rules.</li><li><b>What is underneath?</b> Review holdings count, top holdings, sectors, geography and market-cap/style exposure.</li><li><b>What is concentrated?</b> Broad holdings counts can coexist with heavy top-company concentration.</li><li><b>What does it cost?</b> Review expense ratio, turnover and implementation characteristics.</li><li><b>What does it add?</b> Compare overlap and effective exposure against the rest of the portfolio.</li></ol><div class="pt171-callout"><b>Look-through principle:</b> If 60% of a portfolio is in an ETF and a company is 6% of that ETF, the fund contributes about 3.6% effective exposure to that company before other holdings are considered.</div><h4>Then add valuation and behavior</h4><p>Look-through valuation, risk and relative performance can help explain the environment around the fund, but they should be interpreted in the context of its assigned portfolio role.</p><div class="pt171-check"><b>Portfolio Thesis takeaway</b><br>Do not ask whether an ETF is “good.” Ask what it owns, what it changes, what it costs and whether it is still doing its assigned job.</div>`},
 reportreading:{level:'PORTFOLIO THESIS',title:'How to Read a Portfolio Thesis Report',body:`<p>A Portfolio Thesis report is designed to move from <b>ownership → evidence → interpretation → implication</b>. It is not intended to turn every data point into a trade.</p><h4>1. Portfolio summary</h4><p>Start with the intended structure and jobs assigned to the holdings.</p><h4>2. What you actually own</h4><p>Look through fund labels to effective company, geographic, sector and factor exposures. This is where hidden concentration and overlap become visible.</p><h4>3. Performance and drivers</h4><p>Separate each holding's return from its contribution to the total portfolio. Weight determines how much a move mattered.</p><h4>4. Fund/security evidence</h4><p>Review performance, concentration, valuation, fundamentals, risk and implementation evidence according to the type of security. A company and an ETF require different research frameworks.</p><h4>5. Market factors</h4><p>Read macro and market evidence only where it connects materially to the portfolio. Rates, inflation, leadership or currency moves are context—not automatic trading signals.</p><h4>6. Thesis monitor</h4><p>Finish with the evidence that would actually change the portfolio thesis. Price movement alone is not the same as evidence deterioration.</p><div class="pt171-callout"><b>The core question:</b> Prices changed. Did the evidence change enough to alter the thesis?</div><div class="pt171-check"><b>Portfolio Thesis takeaway</b><br>The report organizes a decision process. Its purpose is to make the reasoning visible and testable over time.</div>`},
 debt:{level:'FINANCIAL STRENGTH',title:'Debt, Liquidity & Interest Coverage',body:`<p>Debt can improve capital efficiency, fund acquisitions or amplify shareholder returns, but it also creates fixed obligations that reduce flexibility when business conditions weaken.</p><h4>Start with the balance sheet</h4><p>Compare cash and liquid assets with short- and long-term debt. Then examine when obligations mature rather than treating all debt as if it were due today.</p><h4>Coverage matters</h4><div class="pt170-eq">Interest Coverage ≈ Operating Earnings ÷ Interest Expense</div><p>Coverage helps show how much operating earnings exceed interest obligations. The appropriate level depends on the stability and capital intensity of the business.</p><h4>Cash flow is the final test</h4><p>A company ultimately services debt with cash. Review free cash flow, cyclicality and refinancing needs alongside accounting coverage ratios.</p><div class="pt171-check"><b>Portfolio Thesis takeaway</b><br>Leverage is not just a debt number. Evaluate debt relative to liquidity, earning power, cash generation and the timing of obligations.</div>`},
 capitalallocation:{level:'BUSINESS QUALITY',title:'Capital Allocation',body:`<p>Once a business generates cash, management decides where that capital goes. Those decisions can materially change long-term per-share value.</p><div class="pt171-grid"><div><b>Reinvestment</b>Fund organic growth when expected returns justify the capital.</div><div><b>Acquisitions</b>Buy businesses or assets when expected value exceeds the price and integration risk.</div><div><b>Debt reduction</b>Strengthen the balance sheet and reduce fixed claims on future cash.</div><div><b>Dividends & buybacks</b>Return excess capital when reinvestment opportunities are less attractive.</div></div><h4>Buybacks require context</h4><p>Repurchasing shares below a defensible estimate of value can increase remaining owners' claim on the business. Repurchasing aggressively at excessive valuations can destroy value even while reducing share count.</p><div class="pt171-check"><b>Portfolio Thesis takeaway</b><br>Follow the cash after it is earned. Business quality and capital-allocation quality are related but not identical.</div>`}
 };
 Object.assign(ACADEMY_LESSONS,extra);
 const library=document.querySelector('#pt170Lessons .library');
 if(library){
   const path=document.createElement('div');path.className='pt171-path';path.style.gridColumn='1 / -1';path.innerHTML=`<div class="eyebrow">DEEPER LEARNING PATH</div><h3>From financial statements to portfolio decisions.</h3><p>These lessons build on the foundations above and follow the same evidence process used inside Portfolio Thesis reports.</p><div class="pt171-pathline"><span>Statements</span><i>→</i><span>Cash Flow</span><i>→</i><span>Quality</span><i>→</i><span>Valuation</span><i>→</i><span>Portfolio Evidence</span></div>`;
   library.appendChild(path);
   const cards=[
    ['statements','FINANCIAL STATEMENTS','Reading the Three Financial Statements','Connect earnings, the balance sheet and cash flow instead of reading each statement in isolation.'],
    ['debt','FINANCIAL STRENGTH','Debt, Liquidity & Interest Coverage','Evaluate leverage through obligations, liquidity, coverage and cash generation.'],
    ['quality','BUSINESS QUALITY','ROIC, WACC & Value Creation','Understand why growth creates value only when the economics of reinvestment support it.'],
    ['capitalallocation','BUSINESS QUALITY','Capital Allocation','Follow how management reinvests, acquires, repays debt and returns cash to owners.'],
    ['normalization','VALUATION','Normalized Earnings & Cash Flow','Build a sustainable earnings base before applying valuation assumptions.'],
    ['dcf','VALUATION','DCF: Turning Cash Flow Into Estimated Value','Learn what actually drives a discounted cash-flow estimate and why scenarios matter.'],
    ['etfresearch','ETF RESEARCH','How to Analyze an ETF','Move beyond the ticker into holdings, concentration, overlap, costs, valuation and role.'],
    ['reportreading','PORTFOLIO THESIS','How to Read a Portfolio Thesis Report','Use ownership, evidence, interpretation and thesis monitoring as one decision process.']
   ];
   for(const [id,level,title,desc] of cards){const d=document.createElement('div');d.className='lesson';d.dataset.lesson=id;d.dataset.pt174Cat=['statements','debt','quality','capitalallocation','normalization','dcf','etfresearch','reportreading'].includes(id)?'analysis':'101';d.onclick=()=>openLesson(id);d.innerHTML=`<div class="level">${level}</div><h3>${title}</h3><p class="muted">${desc}</p>`;library.appendChild(d)}
 }
 paintAcademy();
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const Q={
  '101':[
   ['Diversification is primarily intended to reduce:', ['Every market decline','Dependence on one holding or exposure','Inflation','Fund expenses'],1],
   ['Portfolio contribution depends on a holding’s return and its:', ['Ticker length','Allocation weight','Share price','Dividend date'],1],
   ['A portfolio tilt is:', ['A deliberate emphasis away from broad-market weights','A guaranteed return','A cash account','A bond maturity'],0]
  ],
  analysis:[
   ['Free cash flow is commonly approximated as:', ['Operating cash flow minus capital expenditures','Revenue minus debt','Net income plus dividends','Assets minus liabilities'],0],
   ['ROIC versus WACC helps assess:', ['Whether invested capital is creating economic value','Daily trading volume','ETF expense ratios only','Dividend dates'],0],
   ['Margin of safety compares market price with:', ['Estimated intrinsic value','The 52-week high','Trading volume','Revenue'],0]
  ]
 };
 function quizHTML(cat){
   return `<div class="pt174-quiz" data-quiz="${cat}"><div class="eyebrow">KNOWLEDGE CHECK</div><h3>${cat==='101'?'Investing 101':'Analysis'} Quiz</h3><p>Complete the track, then test the core ideas.</p>${Q[cat].map((q,n)=>`<div class="pt174-q" data-a="${q[2]}"><b>${n+1}. ${q[0]}</b><div class="pt174-options">${q[1].map((a,i)=>`<button type="button" class="pt174-option" data-i="${i}">${a}</button>`).join('')}</div></div>`).join('')}<div class="pt174-score"></div></div>`;
 }
 function bindQuiz(host){
   host.querySelectorAll('.pt174-option').forEach(btn=>btn.onclick=function(e){
     e.stopPropagation(); const row=this.closest('.pt174-q'); if(row.dataset.done)return;
     row.dataset.done='1'; const ans=Number(row.dataset.a), chosen=Number(this.dataset.i);
     row.querySelectorAll('.pt174-option').forEach(x=>{if(Number(x.dataset.i)===ans)x.classList.add('good')});
     if(chosen!==ans)this.classList.add('bad');
     const quiz=this.closest('.pt174-quiz'), rows=[...quiz.querySelectorAll('.pt174-q')];
     if(rows.every(x=>x.dataset.done)){const score=rows.filter(x=>!x.querySelector('.bad')).length;quiz.querySelector('.pt174-score').textContent=`${score}/${rows.length} correct`;}
   });
 }
 window.pt174LessonCategory=function(cat,btn){
   const page=document.getElementById('pt170Lessons'), lib=page?.querySelector('.library'); if(!page||!lib)return;
   page.dataset.category=cat;
   page.querySelectorAll('.pt174-subnav button').forEach(x=>x.classList.toggle('active',x===btn || x.textContent.trim()===(cat==='101'?'Investing 101':'Analysis')));
   const intro=document.getElementById('pt174TrackIntro');
   intro.innerHTML=cat==='101'
    ?`<div class="pt245-foundations-path">
       <div class="eyebrow">FOUNDATIONS PATH</div>
       <div class="pt245-path-flow"><span>Markets</span><i>→</i><span>Diversification</span><i>→</i><span>Portfolio Design</span><i>→</i><span>Discipline</span></div>
       <p>Build the concepts needed to construct and maintain a long-term portfolio.</p>
     </div>`
    :`
<div class="pt244-analysis-path" aria-label="Analysis curriculum path">
  <div class="pt244-path-label">ANALYSIS PATH</div>
  <div class="pt244-path-flow" aria-label="Financials to Quality to Valuation to Thesis">
    <span>Financials</span><b>→</b><span>Quality</span><b>→</b><span>Valuation</span><b>→</b><span>Thesis</span>
  </div>
  <div class="pt244-path-copy">A structured path from reading the numbers to forming an investment thesis.</div>
</div>
`;
   lib.querySelectorAll('.lesson[data-lesson]').forEach(c=>c.style.display=(c.dataset.pt174Cat||'101')===cat?'':'none');
   lib.querySelectorAll('.pt174-quiz').forEach(x=>x.remove());
   lib.insertAdjacentHTML('beforeend',quizHTML(cat)); bindQuiz(lib);
   lib.style.display='grid';
 };
 const prior=window.pt170LearnPage;
 window.pt170LearnPage=function(page,btn){
   prior(page,btn);
   if(page==='lessons')setTimeout(()=>pt174LessonCategory(document.getElementById('pt170Lessons')?.dataset.category||'101'),0);
 };
 function init(){
   const lib=document.querySelector('#pt170Lessons .library'); if(!lib)return;
   // V171 appends advanced cards at script execution; ensure all are categorized.
   const adv=/Reading the Three Financial Statements|Debt, Liquidity|ROIC|WACC|Capital Allocation|Normalized Earnings|DCF:|How to Analyze an ETF|How to Read a Portfolio Thesis Report|Free Cash Flow|Valuation Multiples|Margin of Safety/i;
   lib.querySelectorAll('.lesson[data-lesson]').forEach(c=>{if(!c.dataset.pt174Cat)c.dataset.pt174Cat=adv.test(c.textContent||'')?'analysis':'101'});
   pt174LessonCategory('101');
 }
 setTimeout(init,20);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const defs=[
  {id:'role',tag:'PORTFOLIO',title:'Portfolio Role Worksheet',desc:'Define the job of each holding and test whether it adds a distinct exposure.',fields:[['ticker','Ticker / Fund'],['weight','Portfolio Weight %'],['role','Role: Core / Diversifier / Tilt'],['adds','What does it add?'],['overlap','Known overlap / duplication'],['notes','Evidence & notes','textarea']],formula:'Holding contribution = Allocation weight × Holding return',legend:[['w','portfolio allocation as a decimal'],['r','holding return as a decimal'],['C','contribution to portfolio return; C = w × r']]},
  {id:'financials',tag:'COMPANY ANALYSIS',title:'Financial Statement Worksheet',desc:'Connect income, balance sheet and cash-flow evidence.',fields:[['ticker','Ticker'],['revenue','Revenue'],['netIncome','Net income'],['ocf','Operating cash flow'],['capex','Capital expenditures'],['cash','Cash'],['debt','Total debt'],['notes','What changed and why?','textarea']],formula:'FCF = Operating Cash Flow − Capital Expenditures',legend:[['FCF','free cash flow'],['OCF','cash generated by operations'],['CapEx','cash spent on long-lived productive assets']]},
  {id:'roic',tag:'QUALITY',title:'ROIC & Capital Quality Worksheet',desc:'Estimate returns on invested capital and compare them with the cost of capital.',fields:[['nopat','NOPAT'],['invested','Invested Capital'],['roic','ROIC %'],['wacc','Estimated WACC %'],['notes','Interpretation / evidence','textarea']],formula:'ROIC = NOPAT ÷ Invested Capital',legend:[['NOPAT','net operating profit after tax'],['Invested Capital','capital committed to operations'],['WACC','weighted average cost of capital'],['Spread','ROIC − WACC; a positive spread indicates returns above the estimated capital cost']]},
  {id:'valuation',tag:'VALUATION',title:'Valuation Worksheet',desc:'Organize earnings, cash flow and price-based valuation evidence.',fields:[['price','Share price'],['eps','Earnings per share'],['fcfps','FCF per share'],['normalized','Normalized EPS'],['notes','Valuation evidence / comparison','textarea']],formula:'P/E = Price ÷ EPS    |    FCF Yield = FCF per Share ÷ Price',legend:[['P/E','price-to-earnings multiple'],['EPS','earnings per share'],['FCF Yield','free cash flow generated per dollar of market price']]},
  {id:'dcf',tag:'INTRINSIC VALUE',title:'DCF Worksheet',desc:'Estimate present value from cash-flow assumptions and document every assumption.',fields:[['fcf','Starting FCF'],['growth','Growth rate %'],['discount','Discount rate %'],['terminal','Terminal growth %'],['years','Forecast years'],['netDebt','Net debt'],['shares','Diluted shares'],['notes','Assumptions / evidence','textarea']],formula:'PV = FCFₜ ÷ (1 + r)ᵗ    |    Terminal Value = FCFₙ₊₁ ÷ (r − g)',legend:[['FCFₜ','free cash flow in year t'],['r','discount rate'],['t','forecast year'],['g','terminal growth rate'],['Terminal Value','estimated value of cash flows beyond the explicit forecast'],['Equity Value','enterprise value less net debt'],['Per Share Value','equity value ÷ diluted shares']]},
  {id:'mos',tag:'VALUATION',title:'Margin of Safety Worksheet',desc:'Compare estimated value with market price without hiding the assumptions behind the estimate.',fields:[['value','Estimated intrinsic value'],['price','Current market price'],['mos','Margin of Safety %'],['notes','What could make the value estimate wrong?','textarea']],formula:'Margin of Safety = (Estimated Value − Price) ÷ Estimated Value',legend:[['Estimated Value','value produced by the chosen valuation method and assumptions'],['Price','current market price'],['MOS','percentage discount of price to the estimate; it does not guarantee against loss']]},
  {id:'thesis',tag:'THESIS',title:'Investment Thesis Worksheet',desc:'Turn research into a falsifiable investment argument.',fields:[['ticker','Ticker / Security'],['thesis','Core thesis','textarea'],['supports','Evidence supporting the thesis','textarea'],['challenges','Evidence challenging the thesis','textarea'],['risks','Material risks','textarea'],['change','What would change my view?','textarea']],formula:'Thesis test = Evidence → Interpretation → Implication',legend:[['Evidence','observable financial, market or fund data'],['Interpretation','what the evidence suggests'],['Implication','why that matters to the investment thesis']]},
  {id:'etf',tag:'FUND ANALYSIS',title:'ETF Analysis Worksheet',desc:'Evaluate what a fund owns, how it behaves and what job it performs.',fields:[['ticker','ETF ticker'],['expense','Expense ratio %'],['holdings','Holdings count'],['top10','Top-10 weight %'],['benchmark','Benchmark'],['factor','Factor / style exposure'],['overlap','Portfolio overlap %'],['role','Portfolio role'],['notes','Evidence & interpretation','textarea']],formula:'Weighted overlap = Σ min(Fund A weightᵢ, Fund B weightᵢ)',legend:[['i','a security held by both funds'],['weightᵢ','security weight within each fund'],['Weighted overlap','shared portfolio weight based on actual underlying holdings']]},
  {id:'review',tag:'PORTFOLIO REVIEW',title:'Portfolio Review Worksheet',desc:'Review performance, contribution, market evidence and whether the thesis changed.',fields:[['period','Review period'],['return','Portfolio return %'],['driver','Largest performance driver'],['macro','Relevant macro evidence','textarea'],['micro','Relevant security / fund evidence','textarea'],['changed','Did the thesis change? Why?','textarea'],['actions','Monitoring items','textarea']],formula:'Portfolio return ≈ Σ (Holding weight × Holding return)',legend:[['Holding weight','portfolio allocation during the measured period'],['Holding return','security or fund return during the period'],['Contribution','the portion of total portfolio return associated with that holding']]},
  {id:'overlap',tag:'PORTFOLIO',title:'Diversification & Overlap Worksheet',desc:'Separate ticker count from true underlying diversification.',fields:[['fundA','Fund A'],['fundB','Fund B'],['shared','Shared holdings'],['weighted','Weighted overlap %'],['distinct','What distinct exposure does each add?','textarea'],['notes','Interpretation','textarea']],formula:'Weighted overlap = Σ min(wAᵢ, wBᵢ)',legend:[['wAᵢ','weight of shared security i in Fund A'],['wBᵢ','weight of shared security i in Fund B'],['Σ','sum across securities held by both funds']]}
 ];
 const key='pt_saved_worksheets_v1';
 const load=()=>{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return[]}};
 const save=x=>localStorage.setItem(key,JSON.stringify(x));
 window.pt175LearnPage=function(page,btn){
   if(page!=='worksheets')return;
   document.querySelectorAll('.pt170-learnpage').forEach(x=>x.classList.remove('active'));
   document.getElementById('pt175Worksheets')?.classList.add('active');
   document.querySelectorAll('.pt170-tabs>button').forEach(x=>x.classList.remove('active'));btn?.classList.add('active');
   renderList();
 };
 function renderList(){
   const list=document.getElementById('pt175WorksheetList'), editor=document.getElementById('pt175WorksheetEditor'); if(!list)return;
   const head=document.querySelector('#pt175Worksheets .pt175-head'); if(head) head.style.display='';
   editor.style.display='none'; list.style.display='';
   const saved=load();
   const workspaces=[
    {id:'company',tag:'COMPANY ANALYSIS',title:'Analyze a Company',desc:'Move from financial evidence to business quality, valuation and a documented investment thesis.',flow:'Financial Statements → ROIC & Capital Quality → Valuation → DCF → Margin of Safety → Investment Thesis',ids:['financials','roic','valuation','dcf','mos','thesis']},
    {id:'fund',tag:'FUND & ETF ANALYSIS',title:'Analyze a Fund',desc:'Understand what a fund owns, what exposure it adds and the role it should play in a portfolio.',flow:'ETF Analysis → Portfolio Role',ids:['etf','role']},
    {id:'portfolio',tag:'PORTFOLIO ANALYSIS',title:'Review a Portfolio',desc:'Look through the holdings, identify overlap and concentration, then document what actually needs attention.',flow:'Diversification & Overlap → Portfolio Review',ids:['overlap','review']}
   ];
   list.innerHTML=`<div class="pt263-workspaces">${workspaces.map(w=>`<button class="pt263-workspace" type="button" onclick="pt263Workspace('${w.id}')"><small>${w.tag}</small><h3>${w.title}</h3><p>${w.desc}</p><span>Open workspace →</span></button>`).join('')}</div>`;
 }
 window.pt263Workspace=function(id){
   const groups={
    company:{tag:'COMPANY ANALYSIS',title:'Analyze a Company',flow:'Financial Evidence → Quality → Valuation → Thesis',ids:['financials','roic','valuation','dcf','mos','thesis']},
    fund:{tag:'FUND & ETF ANALYSIS',title:'Analyze a Fund',flow:'Fund Evidence → Exposure → Portfolio Role',ids:['etf','role']},
    portfolio:{tag:'PORTFOLIO ANALYSIS',title:'Review a Portfolio',flow:'Look-Through → Diversification → Review',ids:['overlap','review']}
   };
   const g=groups[id], list=document.getElementById('pt175WorksheetList'); if(!g||!list)return;
   const head=document.querySelector('#pt175Worksheets .pt175-head'); if(head) head.style.display='none';
   const saved=load();
   list.innerHTML=`<div class="pt263-workspace-head"><button class="pt263-back" type="button" onclick="pt175Back()">← All workspaces</button><div class="eyebrow">${g.tag}</div><h2>${g.title}</h2><div class="pt263-flow">${g.flow}</div></div>${g.ids.map(id=>{const d=defs.find(x=>x.id===id),n=saved.filter(x=>x.type===id).length;return `<div class="pt175-card" onclick="pt175Open('${id}')"><small>${d.tag}</small><h3>${d.title}</h3><p>${d.desc}</p><span class="pt175-open">Open worksheet →</span>${n?`<div class="pt175-saved">${n} saved ${n===1?'worksheet':'worksheets'}</div>`:''}</div>`}).join('')}`;
 };
 window.pt175Open=function(id,recordId){
   const d=defs.find(x=>x.id===id);if(!d)return;const list=document.getElementById('pt175WorksheetList'), ed=document.getElementById('pt175WorksheetEditor');
   const rec=recordId?load().find(x=>x.id===recordId):null;list.style.display='none';ed.style.display='block';
   ed.innerHTML=`<button class="pt175-btn" onclick="pt175Back()">← Worksheets</button><div class="pt175-editor" data-type="${id}" data-record="${rec?.id||''}"><div class="eyebrow">${d.tag}</div><h2>${d.title}</h2><p>${d.desc}</p><h3>Inputs & Evidence</h3><div class="pt175-grid">${d.fields.map(f=>`<div class="pt175-field"><label>${f[1]}</label>${f[2]==='textarea'?`<textarea data-field="${f[0]}">${rec?.values?.[f[0]]||''}</textarea>`:`<input data-field="${f[0]}" value="${rec?.values?.[f[0]]||''}">`}</div>`).join('')}</div><h3>Formula Reference</h3><div class="pt175-formula"><code>${d.formula}</code><div class="pt175-legend">${d.legend.map(x=>`<b>${x[0]}</b><span>${x[1]}</span>`).join('')}</div></div><h3>Interpretation</h3><div class="pt175-field"><textarea data-field="interpretation" placeholder="What does the evidence mean?">${rec?.values?.interpretation||''}</textarea></div><h3>Conclusion</h3><div class="pt175-field"><textarea data-field="conclusion" placeholder="Summarize what you learned and what should be monitored.">${rec?.values?.conclusion||''}</textarea></div><div class="pt175-actions"><button class="pt175-btn primary" onclick="pt175Save()">Save worksheet</button><button class="pt175-btn" onclick="pt175Back()">Close</button></div><div id="pt175SaveMsg" class="pt175-saved">${rec?`Last saved ${new Date(rec.savedAt).toLocaleString()}`:''}</div></div>`;
 }
 window.pt175Save=function(){
   const ed=document.querySelector('#pt175WorksheetEditor .pt175-editor');if(!ed)return;const values={};ed.querySelectorAll('[data-field]').forEach(x=>values[x.dataset.field]=x.value);
   let rows=load(), id=ed.dataset.record||('ws_'+Date.now()), row={id,type:ed.dataset.type,values,savedAt:new Date().toISOString()};
   const i=rows.findIndex(x=>x.id===id);if(i>=0)rows[i]=row;else rows.unshift(row);save(rows);ed.dataset.record=id;
   document.getElementById('pt175SaveMsg').textContent='Saved to My Worksheets · '+new Date().toLocaleString();
 };
 window.pt175Back=function(){document.getElementById('pt175WorksheetEditor').style.display='none';renderList()};
 // Make worksheet tab work even though original top-level function only knows 3 views.
 document.addEventListener('click',e=>{const b=e.target.closest('.pt170-tab');if(b&&(b.textContent||'').trim()==='Worksheets'){e.preventDefault();pt175LearnPage('worksheets',b)}});
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  function wire(){
    const tabs=[...document.querySelectorAll('.pt170-tabs>button')];
    const ws=tabs.find(b=>(b.textContent||'').trim()==='Worksheets');
    if(!ws)return;
    ws.onclick=function(e){
      e.preventDefault();
      document.querySelectorAll('.pt170-learnpage').forEach(x=>x.classList.remove('active'));
      const page=document.getElementById('pt175Worksheets');
      if(page)page.classList.add('active');
      tabs.forEach(x=>x.classList.remove('active'));
      ws.classList.add('active');
      if(typeof renderList==='function')renderList();
      else if(typeof window.pt175LearnPage==='function')window.pt175LearnPage('worksheets',ws);
      window.scrollTo({top:document.querySelector('.pt170-tabs')?.getBoundingClientRect().top + window.scrollY - 110 || 0,behavior:'auto'});
    };
  }
  setTimeout(wire,30);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const BASE='https://ngsdgtglfpsnylduivzz.supabase.co/functions/v1';
 const periods=[['w1','1W'],['m1','1M'],['m3','3M'],['m6','6M'],['ytd','YTD'],['y1','1Y']];
 const numberOrNull=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(v);return Number.isFinite(n)?n:null};
 function normalize(x){
   const numberOrNull=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(v);return Number.isFinite(n)?n:null};
   const out={w1:null,m1:null,m3:null,m6:null,ytd:null,y1:null};
   const assign=(path,obj)=>{
     const v=numberOrNull(obj?.portfolioReturnEstimatePct);
     if(v===null)return;
     const p=path.toLowerCase().replace(/[^a-z0-9]/g,'');
     if(/oneweek|1week|1w/.test(p))out.w1=v;
     else if(/onemonth|1month|1m/.test(p))out.m1=v;
     else if(/threemonth|3month|3m/.test(p))out.m3=v;
     else if(/sixmonth|6month|6m/.test(p))out.m6=v;
     else if(/yeartodate|ytd/.test(p))out.ytd=v;
     else if(/oneyear|1year|1y/.test(p))out.y1=v;
   };
   const walk=(node,path='',depth=0)=>{
     if(!node||typeof node!=='object'||depth>7)return;
     assign(path,node);
     if(Array.isArray(node))node.forEach((v,i)=>walk(v,`${path}.${i}`,depth+1));
     else for(const [k,v] of Object.entries(node))if(v&&typeof v==='object')walk(v,path?`${path}.${k}`:k,depth+1);
   };
   walk(x);
   return out;
 }
 function render(p,caption){
