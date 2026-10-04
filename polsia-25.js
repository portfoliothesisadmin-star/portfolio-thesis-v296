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
