     if(specifics.length) card('Thesis Test','What would actually change the portfolio story?',`Re-examine the construction if ${specifics.join('; or if ')}. Those are changes in the evidence behind the design; ordinary price movement by itself is not.`);
   }
   // Valuation is omitted until dated fund-level valuation/fundamental evidence exists.
   if(!cards.length) return '';
   return `<section class="pt150-page pt191-six-lens"><div class="pt150-k">PORTFOLIO FINDINGS</div><h2>What the evidence says about this portfolio.</h2><p class="pt150-deck">Only findings supported by portfolio-specific evidence appear here. Missing evidence does not create a placeholder lens.</p><div class="pt191-lenses">${cards.join('')}</div><div class="pti-foot">PORTFOLIO THESIS · GLOBAL OWNERSHIP. DISCIPLINED BALANCE. <b>06</b></div></section>`;
 }
 function polish(){
   const pages=[...document.querySelectorAll('.pt150-page')]; if(!pages.length)return;
   const cover=pages[0];
   if(cover&&!cover.querySelector('.pt191-cover-question')){
     const q=document.createElement('div');q.className='pt191-cover-question';q.innerHTML='THE QUESTION WE CARE ABOUT<strong>What changed — and does it change the portfolio thesis?</strong>';
     const alloc=cover.querySelector('.pt150-alloc'); (alloc||cover.lastElementChild)?.insertAdjacentElement('beforebegin',q);
   }
   pages.forEach(pg=>{
     const k=pg.querySelector('.pt150-k'); const h=pg.querySelector('h2');
     if(/FUND & SECURITY RESEARCH/i.test(k?.textContent||'')){k.textContent='FUND SCORECARDS';if(h)h.textContent='Evidence by holding and assigned job.'}
     if(/CURRENT MARKET ENVIRONMENT/i.test(k?.textContent||'')){k.textContent='CURRENT MARKET FACTORS & TRENDS';if(h)h.textContent='The conditions that matter to this portfolio.'}
   });
   document.querySelectorAll('.pt158-bottom,.pt159-bottom').forEach(box=>{
     const kids=[...box.children];
     kids.forEach((el,i)=>{if(/EVIDENCE SNAPSHOT/i.test(el.textContent||'')){el.remove();const next=kids[i+1];if(next&&next.tagName==='P')next.remove();}})
   });
   // Remove an older V191 lens page before inserting the revised interpretation page.
   document.querySelectorAll('.pt191-six-lens').forEach(x=>x.remove());
   const market=[...document.querySelectorAll('.pt150-page')].find(pg=>/CURRENT MARKET (ENVIRONMENT|FACTORS)/i.test(pg.textContent||''));
   if(market)market.insertAdjacentHTML('beforebegin',makeLensPage());
   [...document.querySelectorAll('.pt150-page')].forEach((pg,i)=>{
     let foot=pg.querySelector('.pti-foot,.pt150-foot');
     if(!foot){foot=document.createElement('div');foot.className='pti-foot';pg.appendChild(foot)}
     foot.innerHTML=`PORTFOLIO THESIS · GLOBAL OWNERSHIP. DISCIPLINED BALANCE. <b>${String(i+1).padStart(2,'0')}</b>`;
   });
 }
 window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);polish();setTimeout(polish,250);return r};
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const num=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(String(v).replace(/[%+,]/g,''));return Number.isFinite(n)?n:null};
 const signed=(v,suffix='')=>v==null?'—':`${v>0?'+':''}${v.toFixed(2)}${suffix}`;
 function cleanFindings(){
   document.querySelectorAll('.pt191-six-lens').forEach(x=>x.remove());
 }
 function upgradeImpact(){
   const page=[...document.querySelectorAll('.pt150-page')].find(x=>/What moved the portfolio\./i.test(x.textContent||''));
   if(!page)return;
   const table=page.querySelector('.pt150-table'); if(!table)return;
   const old=page.querySelector('.pt169-impact,.pt195-impact');
   if(old?.classList.contains('pt195-impact'))return;
   const rows=[...table.querySelectorAll('tbody tr')];
   const portfolio=(typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:String(x.ticker||'').toUpperCase(),weight:num(x.weight)||0}));
   const weight=t=>portfolio.find(x=>x.ticker===t)?.weight||0;
   const data=[]; let total=null;
   rows.forEach(tr=>{
     const td=[...tr.children], ticker=(td[0]?.textContent||'').trim().toUpperCase();
     if(!ticker)return;
     const oneMonth=num(td[2]?.textContent);
     if(ticker==='PORTFOLIO'){total=oneMonth;return}
     const w=weight(ticker);
     if(w>0&&oneMonth!=null)data.push({ticker,weight:w,ret:oneMonth,impact:w*oneMonth/100});
   });
   if(!data.length)return;
   const maxW=Math.max(...data.map(x=>Math.abs(x.weight)),1);
   const maxR=Math.max(...data.map(x=>Math.abs(x.ret)),.01);
   const maxI=Math.max(...data.map(x=>Math.abs(x.impact)),.01);
   const box=document.createElement('div');box.className='pt195-impact';
   box.innerHTML=`<div class="pt195-impact-head"><div><small>ALLOCATION × PERFORMANCE</small><b>Weight × Return → Portfolio Impact</b></div><div class="pt195-impact-total"><span>Portfolio 1M</span><strong>${signed(total,'%')}</strong></div></div>
   <div class="pt195-cols"><span></span><span>Weight</span><span></span><span>1M return</span><span></span><span>Impact</span></div>
   ${data.map(x=>`<div class="pt195-row"><span class="pt195-ticker">${x.ticker}</span>
      <div class="pt195-metric"><b>${x.weight.toFixed(x.weight%1?1:0)}%</b><div class="pt195-track"><div class="pt195-fill" style="width:${(Math.abs(x.weight)/maxW*100).toFixed(1)}%"></div></div></div>
      <span class="pt195-op">×</span>
      <div class="pt195-metric pt195-return"><b>${signed(x.ret,'%')}</b><div class="pt195-track"><div class="pt195-fill" style="width:${(Math.abs(x.ret)/maxR*100).toFixed(1)}%"></div></div></div>
      <span class="pt195-op">→</span>
      <div class="pt195-metric pt195-result"><b>${signed(x.impact,' pts')}</b><div class="pt195-track"><div class="pt195-fill" style="width:${(Math.abs(x.impact)/maxI*100).toFixed(1)}%"></div></div></div>
   </div>`).join('')}
   <p class="pt195-note"><b>How to read this:</b> The left bar shows how much capital is assigned to each holding, the middle bar shows the holding's 1-month move, and the right bar shows the resulting effect on total portfolio return. A sharp move in a small sleeve can therefore have a similar portfolio effect to a modest move in a much larger core holding.</p>`;
   if(old)old.replaceWith(box); else table.insertAdjacentElement('afterend',box);
 }
 function renumber(){
   [...document.querySelectorAll('.pt150-page')].forEach((pg,i)=>{
     const foot=pg.querySelector('.pti-foot,.pt150-foot');
     if(foot)foot.innerHTML=`PORTFOLIO THESIS · GLOBAL OWNERSHIP. DISCIPLINED BALANCE. <b>${String(i+1).padStart(2,'0')}</b>`;
   });
 }
 function apply(){cleanFindings();upgradeImpact();renumber()}
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);apply();setTimeout(apply,300);return r};
 setTimeout(apply,0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 function rearrange(){
   const pages=[...document.querySelectorAll('.pt150-page')];
   if(!pages.length)return;

   // Rename the non-scoring research section.
   pages.forEach(pg=>{
     const k=pg.querySelector('.pt150-k');
     const h=pg.querySelector('h2');
     if(/FUND SCORECARDS|FUND & SECURITY RESEARCH/i.test(k?.textContent||'')){
       k.textContent='FUND EVIDENCE';
       if(h) h.textContent='Evidence by holding and assigned job.';
     }
   });

   // Identify the original page 2 / portfolio summary.
   const summary=pages.find((pg,i)=>{
     if(i===0)return false;
     const txt=(pg.textContent||'').toUpperCase();
     return /PORTFOLIO SUMMARY|EXECUTIVE (BRIEF|SUMMARY)|PORTFOLIO THESIS/.test(txt)
       && !/FUND EVIDENCE|FUND SCORECARDS|CURRENT MARKET/.test(txt);
   }) || pages[1];

   // Fund evidence can span multiple consecutive pages. Put summary after the last one.
   const current=[...document.querySelectorAll('.pt150-page')];
   const evidence=current.filter(pg=>/FUND EVIDENCE|FUND SCORECARDS|FUND & SECURITY RESEARCH/i.test(pg.textContent||''));
   if(summary && evidence.length && !evidence.includes(summary)){
     evidence[evidence.length-1].insertAdjacentElement('afterend',summary);
   }

   // Renumber after physical reordering.
   [...document.querySelectorAll('.pt150-page')].forEach((pg,i)=>{
     let foot=pg.querySelector('.pti-foot,.pt150-foot');
     if(!foot){foot=document.createElement('div');foot.className='pti-foot';pg.appendChild(foot)}
     foot.innerHTML=`PORTFOLIO THESIS · GLOBAL OWNERSHIP. DISCIPLINED BALANCE. <b>${String(i+1).padStart(2,'0')}</b>`;
   });
 }
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){
   const r=await prior.apply(this,arguments);
   rearrange(); setTimeout(rearrange,350);
   return r;
 };
 setTimeout(rearrange,0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 function apply(){
   let pages=[...document.querySelectorAll('.pt150-page')];
   if(!pages.length)return;

   // 1) Performance & Drivers immediately after cover.
   const perf=pages.find(pg=>/What moved the portfolio\./i.test(pg.textContent||''));
   if(perf && pages[0] && perf!==pages[1]) pages[0].insertAdjacentElement('afterend',perf);

   // 2) Rename scorecard language everywhere in the generated report.
   document.querySelectorAll('.pt150-page *').forEach(el=>{
     if(el.children.length===0 && /scorecard/i.test(el.textContent||'')){
       el.textContent=(el.textContent||'').replace(/FUND SCORECARD/gi,'FUND EVIDENCE').replace(/SCORECARD/gi,'EVIDENCE');
     }
   });

   // 3) Remove the obsolete intro paragraph under "Evidence by holding and assigned job."
   pages=[...document.querySelectorAll('.pt150-page')];
   pages.forEach(pg=>{
     const h=pg.querySelector('h2');
     if(/Evidence by holding and assigned job/i.test(h?.textContent||'')){
       let el=h.nextElementSibling;
       while(el && !/^(DIV|SECTION|TABLE)$/.test(el.tagName)){
         const next=el.nextElementSibling;
         if(/Each fund is tested against the job it performs|scorecard separates observed evidence/i.test(el.textContent||'')) el.remove();
         el=next;
       }
       // Catch deck-class intro even if wrapped differently.
       pg.querySelectorAll('p,.pt150-deck').forEach(p=>{
         if(/Each fund is tested against the job it performs|scorecard separates observed evidence/i.test(p.textContent||''))p.remove();
       });
     }
   });

   // 4) Keep portfolio summary after all Fund Evidence pages.
   pages=[...document.querySelectorAll('.pt150-page')];
   const evidence=pages.filter(pg=>/FUND EVIDENCE/i.test(pg.textContent||'') && !/What moved the portfolio/i.test(pg.textContent||''));
   const summary=pages.find((pg,i)=>{
     if(i===0 || pg===perf || evidence.includes(pg))return false;
     return /PORTFOLIO SUMMARY|EXECUTIVE (BRIEF|SUMMARY)/i.test(pg.textContent||'');
   });
   if(summary && evidence.length) evidence[evidence.length-1].insertAdjacentElement('afterend',summary);

   // 5) Renumber physical page order.
   [...document.querySelectorAll('.pt150-page')].forEach((pg,i)=>{
     let foot=pg.querySelector('.pti-foot,.pt150-foot');
     if(!foot){foot=document.createElement('div');foot.className='pti-foot';pg.appendChild(foot)}
     foot.innerHTML=`PORTFOLIO THESIS · GLOBAL OWNERSHIP. DISCIPLINED BALANCE. <b>${String(i+1).padStart(2,'0')}</b>`;
   });
 }
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){
   const r=await prior.apply(this,arguments);
   apply(); setTimeout(apply,400);
   return r;
 };
 setTimeout(apply,0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const clean=s=>(s||'').replace(/\s+/g,' ').trim();
 function cellMap(card){const m={};card.querySelectorAll('tr').forEach(tr=>{const c=tr.querySelectorAll('td');if(c.length>=2)m[clean(c[0].textContent).toLowerCase()]=clean(c[1].textContent)});return m}
 function tickerOf(card){const txt=clean(card.textContent);for(const t of ['VTI','VXUS','AVUV','AVDV'])if(new RegExp('\\b'+t+'\\b').test(txt))return t;return ''}
 function upgradeFunds(){
   document.querySelectorAll('.pt159-card,.pt158-card').forEach(card=>{
     const t=tickerOf(card); if(!t)return; const m=cellMap(card);
     const div=m['underlying diversification']||'the measured underlying holdings';
     const top=m['10 largest holdings']||'the measured top holdings';
     const inter=m['fund interaction']||'the measured interaction with the paired sleeve';
     let thesis='',forTxt='',against='',breakTxt='';
     if(t==='VTI'){
       thesis='Broad U.S. ownership is the portfolio foundation; the key structural test is whether underlying concentration remains acceptable.';
       forTxt=`VTI still delivers the intended broad U.S. core: ${div}. Its ${inter} interaction shows the small/value sleeve can materially alter company-level exposure rather than simply duplicate the core.`;
       against=`The 10 largest holdings represent ${top}. VTI therefore owns thousands of companies, but a meaningful share of its economic exposure is still determined by a relatively small group of mega-cap businesses.`;
       breakTxt='The core thesis weakens if rising mega-cap concentration causes VTI to stop behaving like sufficiently broad U.S. market exposure, or if its interaction with the portfolio tilts becomes duplicative enough that those sleeves no longer provide meaningfully distinct exposure.';
     } else if(t==='VXUS'){
       thesis='International ownership should diversify the U.S. core through different companies, regions, currencies and valuation exposures.';
       forTxt=`VXUS provides ${div} and remains a separate international sleeve. Its ${inter} interaction with the developed small/value tilt leaves room for that tilt to change the portfolio’s underlying company weights.`;
       against=`A large holding count does not guarantee useful diversification. The thesis depends on VXUS continuing to produce meaningfully different regional, earnings and valuation exposure from the U.S. core—not simply adding another broad index.`;
       breakTxt='The diversification thesis weakens if VXUS becomes materially less distinct from the U.S. core, or if overlap with the portfolio’s other international sleeve rises enough that the separate allocations stop performing different jobs.';
     } else if(t==='AVUV'){
       thesis='The U.S. small/value sleeve should deliberately reweight the portfolio away from the broad-market core toward smaller, cheaper companies.';
       forTxt=`AVUV is intentionally separate from VTI rather than another core fund. Its ${inter} interaction shows that the sleeve can meaningfully change company-level weights and therefore create a genuine small/value tilt.`;
       against='A distinct tilt can lag the broad market for long periods and add volatility. Short-term underperformance alone is not evidence that the thesis failed, but the sleeve must continue to deliver the factor exposure it was selected to provide.';
       breakTxt='The thesis weakens if AVUV loses meaningful small/value distinctness, begins substantially duplicating VTI, or the underlying evidence shows that the sleeve is no longer delivering the factor exposure that justifies its separate allocation.';
