     } else {
       thesis='Developed international small/value should add a distinct factor tilt inside the non-U.S. allocation rather than duplicate VXUS.';
       forTxt=`AVDV is a deliberate developed-market small/value sleeve. Its ${inter} interaction with VXUS indicates that the allocation can reweight the international portfolio toward a different set of companies rather than merely repeat the broad fund.`;
       against='The separate allocation only earns its place if that factor exposure remains meaningfully distinct. If overlap rises or the small/value characteristics weaken, the sleeve adds complexity without adding enough differentiated exposure.';
       breakTxt='The thesis weakens if AVDV becomes materially more duplicative of VXUS, loses its developed small/value characteristics, or no longer changes the international portfolio enough to justify a separate allocation.';
     }
     const th=card.querySelector('.pt159-thesis b,.pt158-thesis b'); if(th)th.textContent=thesis;
     const blocks=[...card.querySelectorAll('.pt159-section,.pt158-two>div,.pt158-bottom')];
     blocks.forEach(b=>{const sm=b.querySelector('small');if(!sm)return;const lab=clean(sm.textContent).toUpperCase();const p=b.querySelector('p');
       if(lab.includes('SUPPORTS')){sm.textContent='EVIDENCE FOR';if(p)p.textContent=forTxt}
       else if(lab.includes('CHALLENGES')){sm.textContent='EVIDENCE AGAINST';if(p)p.textContent=against}
       else if(lab.includes('WHAT WOULD CHANGE')){sm.textContent='THESIS BREAKPOINT';if(p)p.textContent=breakTxt}
     });
   });
 }
 function upgradeMonitor(){
   const pages=[...document.querySelectorAll('.pt150-page')];
   const pg=pages.find(p=>/THESIS MONITOR|Evidence worth watching next/i.test(p.textContent||'')); if(!pg)return;
   const k=pg.querySelector('.pt150-k'); if(k)k.textContent='WHAT WE’RE WATCHING';
   const h=pg.querySelector('h2'); if(h)h.textContent='The signals most capable of changing the portfolio thesis.';
   const deck=pg.querySelector('.pt150-deck'); if(deck)deck.textContent='These are forward-looking thesis tests—not a repeat of the performance pages.';
   const table=pg.querySelector('table'); if(!table)return;
   const hs=table.querySelectorAll('th'); if(hs.length>=3){hs[0].textContent='Signal';hs[1].textContent='Current state';hs[2].textContent='What would change the thesis'}
   [...table.querySelectorAll('tbody tr')].forEach(tr=>{const c=tr.querySelectorAll('td');if(c.length<3)return;const name=clean(c[0].textContent);const reading=clean(c[1].textContent);
     if(/Geographic balance|Portfolio YTD/i.test(name)){tr.remove();return}
     if(/Largest company/i.test(name))c[2].textContent='A sustained rise would increase dependence on a single underlying business despite broad fund ownership.';
     else if(/Top-10/i.test(name))c[2].textContent='A sustained increase would make the broad U.S. core more economically dependent on a smaller group of companies.';
     else if(/Fund overlap/i.test(name))c[2].textContent='A meaningful increase would weaken the case that the paired sleeve provides genuinely distinct exposure.';
     else if(/Interest-rate/i.test(name))c[2].textContent='A material change in financing and discount-rate conditions can alter the environment for smaller and valuation-sensitive companies.';
     else if(/small\/value/i.test(name))c[2].textContent='Persistent relative weakness matters most if it is accompanied by deterioration in the underlying small/value evidence—not because of underperformance alone.';
   });
   if(!pg.querySelector('.pt200-thesis-watch')){
     const box=document.createElement('div');box.className='pt200-thesis-watch';box.innerHTML='<small>THESIS WATCH</small><b>No structural thesis change.</b><p>Current performance differences remain consistent with the distinct roles assigned to each sleeve. The evidence to watch is whether concentration, diversification, overlap, small/value fundamentals, or financing conditions change enough to challenge those roles.</p>';
     const disc=pg.querySelector('.pt150-disc'); (disc||table).insertAdjacentElement(disc?'beforebegin':'afterend',box);
   }
 }
 function renumber(){[...document.querySelectorAll('.pt150-page')].forEach((pg,i)=>{let f=pg.querySelector('.pti-foot,.pt150-foot');if(f)f.innerHTML=`PORTFOLIO THESIS · GLOBAL OWNERSHIP. DISCIPLINED BALANCE. <b>${String(i+1).padStart(2,'0')}</b>`})}
 function apply(){upgradeFunds();upgradeMonitor();renumber()}
 const prior=window.ptGeneratePortfolioPublication;if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);apply();setTimeout(apply,450);return r};
 setTimeout(apply,0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const clean=s=>(s||'').replace(/\s+/g,' ').trim();
 function mapRows(card){const m={};card.querySelectorAll('tbody tr').forEach(tr=>{const c=tr.querySelectorAll('td');if(c.length>=3)m[clean(c[0].textContent).toLowerCase()]={reading:clean(c[1].textContent),read:clean(c[2].textContent)}});return m}
 function upgradeFunds(){
  document.querySelectorAll('.pt159-card').forEach(card=>{
   const t=clean(card.querySelector('.pt159-head b')?.textContent).toUpperCase(); if(!['VTI','VXUS','AVUV','AVDV'].includes(t))return;
   const m=mapRows(card), div=m['underlying diversification']?.reading||'—', top=m['10 largest holdings']?.reading||'—', inter=m['fund interaction']?.reading||'—';
   let thesis,yes,no,bp;
   if(t==='VTI'){
    thesis='Broad U.S. ownership is the portfolio foundation; the structural test is whether that breadth remains economically broad after weighting.';
    yes=`VTI holds ${div} across the U.S. equity market, giving the portfolio broad exposure across company sizes, sectors and industries without relying on individual security selection. As the portfolio’s U.S. core, that breadth provides the foundation for market-wide domestic equity exposure.`;
    no=`The strongest tension is concentration: the 10 largest holdings account for ${top}. Thousands of underlying companies therefore do not mean that portfolio influence is evenly distributed; a relatively small group of mega-cap businesses can still drive a large share of the core’s behavior.`;
    bp='The core thesis weakens if concentration rises far enough that VTI no longer functions as sufficiently broad economic exposure to the U.S. market, rather than simply broad ownership by security count.';
   }else if(t==='VXUS'){
    thesis='International ownership should diversify the U.S. core through different companies, regions, currencies and economic exposures.';
    yes=`VXUS provides ${div} outside the U.S. market, creating broad ownership across developed and emerging-market companies, regions and currencies. That breadth gives the portfolio a dedicated source of non-U.S. economic exposure rather than simply extending the domestic core.`;
    no='A large non-U.S. holding count is not sufficient by itself. The sleeve earns its role only if those companies continue to provide meaningfully different regional, currency, earnings and valuation exposure from the U.S. core.';
    bp='The diversification thesis weakens if the economic behavior and underlying exposures of VXUS become materially less distinct from the U.S. core, reducing the benefit of maintaining a dedicated international sleeve.';
   }else if(t==='AVUV'){
    thesis='The U.S. small/value sleeve should deliberately reweight the portfolio toward smaller, value-oriented companies that the broad-market core holds at lower weights.';
    yes=`AVUV targets the U.S. small/value role across ${div}. Its 10 largest holdings account for only ${top}, so the sleeve can emphasize smaller, value-oriented companies without making the tilt dependent on a handful of names. That targeted construction is the primary evidence that AVUV is performing a different job from a broad-market core.`;
    no='The tilt adds complexity and can lag the broad market for long periods. Its case therefore depends on preserving genuine small/value characteristics; different performance alone is not enough to prove that the sleeve is doing useful work.';
    bp='The thesis weakens if AVUV loses meaningful small/value exposure, becomes substantially more similar to the broad U.S. core, or its underlying construction stops producing the targeted reweighting the sleeve was selected to provide.';
   }else{
    thesis='Developed international small/value should add a targeted factor exposure inside the non-U.S. allocation rather than function as a smaller copy of broad international ownership.';
    yes=`AVDV targets developed international small/value across ${div}, giving the portfolio direct exposure to smaller, value-oriented companies outside the U.S. That targeted construction is the primary evidence for the sleeve: it intentionally emphasizes a segment that broad international ownership does not emphasize to the same degree.`;
    no='A separate international tilt only earns its complexity if the small/value characteristics remain strong enough to create meaningfully different exposure from broad international ownership.';
    bp='The thesis weakens if AVDV loses its developed-market small/value characteristics or becomes sufficiently duplicative of broad international exposure that the separate sleeve no longer changes the portfolio in a meaningful way.';
   }
   const th=card.querySelector('.pt159-thesis b');if(th)th.textContent=thesis;
   card.querySelectorAll('.pt159-section').forEach(b=>{const sm=b.querySelector('small'),p=b.querySelector('p');if(!sm||!p)return;const lab=clean(sm.textContent).toUpperCase();if(lab.includes('EVIDENCE FOR')||lab.includes('SUPPORTS')){sm.textContent='EVIDENCE FOR';p.textContent=yes}else if(lab.includes('EVIDENCE AGAINST')||lab.includes('CHALLENGES')){sm.textContent='EVIDENCE AGAINST';p.textContent=no}else if(lab.includes('THESIS BREAKPOINT')||lab.includes('WHAT WOULD CHANGE')){sm.textContent='THESIS BREAKPOINT';p.textContent=bp}});
  });
 }
 function synthesis(){
  const pages=[...document.querySelectorAll('.pt150-page')]; const pg=pages.find(p=>/WHAT WE.RE WATCHING|THESIS MONITOR|signals most capable|Evidence worth watching next/i.test(p.textContent||'')); if(!pg)return;
  const cards=[...document.querySelectorAll('.pt159-card')]; const data={}; cards.forEach(c=>{const t=clean(c.querySelector('.pt159-head b')?.textContent).toUpperCase();data[t]=mapRows(c)});
  const vtiTop=data.VTI?.['10 largest holdings']?.reading||'the measured top-10 concentration';
  const avuvPerf=data.AVUV?.performance?.reading||'the measured period';
  const vxusDiv=data.VXUS?.['underlying diversification']?.reading||'broad non-U.S. holdings';
  const avuvDiv=data.AVUV?.['underlying diversification']?.reading||'a targeted U.S. small/value sleeve';
  const avdvDiv=data.AVDV?.['underlying diversification']?.reading||'a targeted developed international small/value sleeve';
  const k=pg.querySelector('.pt150-k');if(k)k.textContent='WHAT THE EVIDENCE SAYS NOW';
  const h=pg.querySelector('h2');if(h)h.textContent='The portfolio’s structure is doing more than simply adding holdings.';
  const d=pg.querySelector('.pt150-deck');if(d)d.textContent='The conclusion below synthesizes the evidence in this report rather than repeating the underlying measurements.';
  const table=pg.querySelector('table');if(table)table.remove(); const old=pg.querySelector('.pt200-thesis-watch');if(old)old.remove(); const prior=pg.querySelector('.pt201-findings');if(prior)prior.remove();
  const box=document.createElement('div');box.className='pt201-findings';box.innerHTML=`
   <div class="pt201-finding"><small>FINDING 01</small><b>Diversification is coming from different sources, not simply a larger security count.</b><p>VTI and VXUS provide broad market ownership, while AVUV and AVDV deliberately change the kinds of companies emphasized. VXUS contributes ${vxusDiv}; the two factor sleeves add more targeted exposures (${avuvDiv} in AVUV and ${avdvDiv} in AVDV). The useful question is therefore what each sleeve changes, not how many total securities the portfolio can count.</p></div>
   <div class="pt201-finding"><small>FINDING 02</small><b>Small/value can be a performance drag without invalidating the reason it is owned.</b><p>AVUV’s current performance reading is ${avuvPerf}. Because the sleeve is intentionally different from the broad U.S. core, relative underperformance can occur precisely because the exposures are different. The stronger test is whether the underlying small/value characteristics remain intact.</p></div>
   <div class="pt201-finding"><small>FINDING 03</small><b>Concentration is the clearest structural tension inside the U.S. core.</b><p>VTI can own thousands of companies while its 10 largest holdings still represent ${vtiTop}. That means security count alone overstates practical diversification if weighting is ignored. Concentration deserves attention because the U.S. core carries the largest portfolio weight.</p></div>
   <div class="pt201-finding"><small>FINDING 04</small><b>The two tilts need to earn their additional complexity through distinct exposure.</b><p>VTI and VXUS already provide broad U.S. and international ownership. AVUV and AVDV therefore are not justified merely by adding more holdings; their value comes from maintaining targeted small/value exposures that materially reweight the portfolio. Distinctness—not short-term outperformance—is the central test.</p></div>
   <div class="pt201-current"><small>CURRENT THESIS</small><b>The evidence currently supports the intended portfolio structure.</b><p>Broad U.S. and international ownership form the foundation, while the two small/value sleeves deliberately alter the portfolio’s exposure. The main structural tensions are whether core concentration continues to rise and whether the tilts remain sufficiently distinct to justify their added complexity.</p></div>`;
  const disc=pg.querySelector('.pt150-disc');(disc||pg).insertAdjacentElement(disc?'beforebegin':'beforeend',box);
 }
 function apply(){upgradeFunds();synthesis()}
 const prior=window.ptGeneratePortfolioPublication;if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);apply();setTimeout(apply,500);return r};setTimeout(apply,0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
 const profiles={
  VTI:{role:'U.S. total-market core',kind:'core',thesis:'Broad U.S. ownership should remain economically broad after weighting, not merely broad by security count.'},
  VOO:{role:'U.S. large-cap core',kind:'core',thesis:'Large-cap U.S. exposure should provide efficient participation in the S&P 500 while the portfolio remains comfortable with the concentration created by market-cap weighting.'},
  VXUS:{role:'International diversifier',kind:'core',thesis:'International ownership should diversify the U.S. core through different companies, regions, currencies and economic exposures.'},
  AVUV:{role:'U.S. small/value tilt',kind:'tilt',thesis:'The U.S. small/value sleeve should deliberately reweight the portfolio toward smaller, value-oriented companies that the broad-market core holds at lower weights.'},
