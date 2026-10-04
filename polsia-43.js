     const eff=N(window.__pt291EffectiveCompanies?.[d.ticker]);
     const indirect=eff==null?null:Math.max(0,eff-d.weight);

     const thesis=c.querySelector('.pt159-thesis b');
     if(thesis) thesis.textContent=`${d.ticker} is a deliberate ${d.weight.toFixed(0)}% company position${indirect!=null&&indirect>0?`, layered on about ${indirect.toFixed(2)}% of indirect fund ownership`:''}. The thesis depends on strong operating quality continuing to justify the valuation and the resulting company-level concentration.`;

     const yes=section('EVIDENCE FOR')||section('SUPPORTS');
     if(yes){
       const p=yes.querySelector('p');
       if(p){
         const strong=[]; if(ep>=16)strong.push('earning power'); if(cg>=16)strong.push('cash generation'); if(cd>=16)strong.push('capital discipline');
         p.textContent=strong.length>=2?`The measured company evidence is strongest across ${strong.join(', ')}. Those categories are simultaneously in the strong range, so the support is coming from operating and capital-allocation quality rather than from valuation.`:'Current company evidence does not show enough strong operating categories to establish a clear positive case.';
       }
     }
     const no=section('EVIDENCE AGAINST')||section('CHALLENGES');
     if(no){
       const p=no.querySelector('p');
       if(p){
         if(premium!=null&&premium>0)p.textContent=`Valuation is the central tension. The research snapshot uses a market price of $${price.toFixed(2)} versus normalized value of $${value.toFixed(2)}, a ${premium.toFixed(1)}% premium to that normalized-value estimate. That leaves little support from price and makes future execution carry more of the thesis.`;
         else if(va!=null)p.textContent=`Valuation is the main measured weakness (${va.toFixed(0)}/20). The position therefore depends more heavily on future business execution than on a current valuation cushion.`;
       }
     }
     const bp=section('THESIS BREAKPOINT')||section('WHAT WOULD CHANGE');
     if(bp){
       const p=bp.querySelector('p');
       if(p)p.textContent=`Re-test the thesis if earning power or cash-generation quality falls below the supportive range, capital discipline materially weakens, or the gap between market price and normalized value remains extreme without corresponding improvement in normalized value. Because this is a direct position layered on fund ownership, a rising effective ${d.ticker} concentration is also a portfolio-level breakpoint.`;
     }
   });
 }
 function run(){mergeDirectLookthrough();addDirectFinding();enrichCompanyCards()}
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);run();setTimeout(run,500);setTimeout(run,1400);return r};
})();
