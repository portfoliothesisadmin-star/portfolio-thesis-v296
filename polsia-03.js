 const strengthWhy=strengthParts.length?strengthParts.join(" · "):"Financial-strength evidence unavailable.";

 // 2. Earning Power /20: consistency 6, revenue CAGR 4, net-income CAGR 4, margin durability 6.
 let earnScore=0,earnMeasured=0,earnParts=[];
 let revCagr=null,niCagr=null,marginLatest=null,marginAvg=null;
 if(validYears.length>=3){
   const chron=[...validYears].reverse(), n=chron.length-1;
   const positiveNI=chron.filter(y=>y.net>0).length;
   const consistencyPts=positiveNI>=5?6:positiveNI===4?4:positiveNI===3?2:0;
   earnScore+=consistencyPts; earnMeasured+=6; earnParts.push(`positive earnings ${positiveNI}/${chron.length} years (${consistencyPts}/6)`);
   revCagr=(chron[0].revenue>0&&n>0)?(Math.pow(chron.at(-1).revenue/chron[0].revenue,1/n)-1)*100:null;
   if(revCagr!=null){const pts=revCagr>=10?4:revCagr>=5?3:revCagr>=2?2:revCagr>=0?1:0;earnScore+=pts;earnMeasured+=4;earnParts.push(`revenue CAGR ${revCagr.toFixed(1)}% (${pts}/4)`);}
   niCagr=(chron[0].net>0&&chron.at(-1).net>0&&n>0)?(Math.pow(chron.at(-1).net/chron[0].net,1/n)-1)*100:null;
   if(niCagr!=null){const pts=niCagr>=10?4:niCagr>=5?3:niCagr>=2?2:niCagr>=0?1:0;earnScore+=pts;earnMeasured+=4;earnParts.push(`net-income CAGR ${niCagr.toFixed(1)}% (${pts}/4)`);}
   const marginYears=chron.filter(y=>y.revenue>0&&y.net!=null);
   if(marginYears.length>=3){
     const margins=marginYears.map(y=>y.net/y.revenue*100); marginLatest=margins.at(-1); marginAvg=margins.reduce((a,b)=>a+b,0)/margins.length;
     const relative=(marginAvg!==0)?marginLatest/marginAvg:null;
     const pts=relative==null?0:relative>=1?6:relative>=.95?5:relative>=.90?3:relative>=.80?1:0;
     earnScore+=pts;earnMeasured+=6;earnParts.push(`latest/avg margin ${marginLatest.toFixed(1)}%/${marginAvg.toFixed(1)}% (${pts}/6)`);
   }
 }
 const earnWhy=earnParts.length?earnParts.join(" · "):"Needs multi-year earnings history.";

 // 3. Cash Generation & Quality /20: FCF consistency 6, FCF CAGR 4, conversion 6, conversion stability 4.
 let cashScore=0,cashMeasured=0,cashParts=[];
 let avgConv=null,convSpread=null,fcfCagr=null;
 if(validYears.length>=3){
   const chron=[...validYears].reverse(), n=chron.length-1;
   const positiveFcf=chron.filter(y=>y.fcf>0).length;
   const persistencePts=positiveFcf>=5?6:positiveFcf===4?4:positiveFcf===3?2:0;
   cashScore+=persistencePts;cashMeasured+=6;cashParts.push(`positive FCF ${positiveFcf}/${chron.length} years (${persistencePts}/6)`);
   fcfCagr=(chron[0].fcf>0&&chron.at(-1).fcf>0&&n>0)?(Math.pow(chron.at(-1).fcf/chron[0].fcf,1/n)-1)*100:null;
   if(fcfCagr!=null){const pts=fcfCagr>=10?4:fcfCagr>=5?3:fcfCagr>=2?2:fcfCagr>=0?1:0;cashScore+=pts;cashMeasured+=4;cashParts.push(`FCF CAGR ${fcfCagr.toFixed(1)}% (${pts}/4)`);}
   const conversions=chron.filter(y=>y.net>0&&y.fcf!=null).map(y=>y.fcf/y.net);
   if(conversions.length>=3){
     avgConv=conversions.reduce((a,b)=>a+b,0)/conversions.length;
     const pts=avgConv>=1?6:avgConv>=.9?5:avgConv>=.8?4:avgConv>=.7?2:0;
     cashScore+=pts;cashMeasured+=6;cashParts.push(`avg FCF/net income ${avgConv.toFixed(2)}x (${pts}/6)`);
     convSpread=Math.max(...conversions)-Math.min(...conversions);
     const stableCount=conversions.filter(x=>x>=.8&&x<=1.8).length;
     const share=stableCount/conversions.length;
     const stabPts=share>=.8?4:share>=.6?3:share>=.4?2:share>=.2?1:0;
     cashScore+=stabPts;cashMeasured+=4;cashParts.push(`healthy conversion ${stableCount}/${conversions.length} years (${stabPts}/4)`);
   }
 }
 const cashWhy=cashParts.length?cashParts.join(" · "):"Needs multi-year free-cash-flow history.";

 // 4. Capital Discipline /20: ROIC 8, ROIC durability 4, share discipline 4, allocation sustainability 4.
 // ROIC is calculated only when the statements contain enough evidence to derive both NOPAT and invested capital.
 // No assumed tax rate, invented equity value, or proxy ROIC is used.
 let capitalScore=0,capitalMeasured=0,capitalParts=[];
 let shareChange=null;
 const byYear=(rows)=>{const m={};rows.forEach(x=>{const y=String(x.calendarYear??x.fiscalYear??x.year??String(x.date||"").slice(0,4));if(y)m[y]=x});return m};
 const incByYear=byYear(inc), balByYear=byYear(bal);
 const roicHistory=[];
 Object.keys(incByYear).slice(0,5).forEach(y=>{
   const ir=incByYear[y]||{}, br=balByYear[y]||{};
   const opY=num(ir.operatingIncome??ir.ebit);
   const pretaxY=num(ir.incomeBeforeTax??ir.incomeBeforeTaxExpense??ir.ebt);
   const taxY=num(ir.incomeTaxExpense??ir.incomeTax);
   const debtY=num(br.totalDebt);
   const equityY=num(br.totalStockholdersEquity??br.totalEquity??br.stockholdersEquity);
   const cashY=num(br.cashAndCashEquivalents??br.cashAndShortTermInvestments);
   const taxRate=(pretaxY!=null&&pretaxY>0&&taxY!=null)?Math.max(0,Math.min(.5,taxY/pretaxY)):null;
   const invested=(debtY!=null&&equityY!=null&&cashY!=null)?debtY+equityY-cashY:null;
   const nopat=(opY!=null&&taxRate!=null)?opY*(1-taxRate):null;
   const roic=(nopat!=null&&invested!=null&&invested>0)?nopat/invested*100:null;
   if(roic!=null)roicHistory.push({year:y,roic});
 });
 if(roicHistory.length){
   const latestRoic=roicHistory[0].roic;
   const pts=latestRoic>=20?8:latestRoic>=15?7:latestRoic>=10?5:latestRoic>=7?3:latestRoic>=5?1:0;
   capitalScore+=pts;capitalMeasured+=8;capitalParts.push(`ROIC ${latestRoic.toFixed(1)}% (${pts}/8)`);
 }
 if(roicHistory.length>=3){
   const vals=roicHistory.map(x=>x.roic), latest=vals[0], avg=vals.reduce((a,b)=>a+b,0)/vals.length;
   const positive=vals.filter(x=>x>0).length/vals.length;
   const relative=avg>0?latest/avg:null;
   const pts=(positive===1&&relative!=null&&relative>=.9)?4:(positive>=.8&&relative!=null&&relative>=.75)?3:(positive>=.6&&relative!=null&&relative>=.5)?2:(positive>=.6)?1:0;
   capitalScore+=pts;capitalMeasured+=4;capitalParts.push(`ROIC durability ${latest.toFixed(1)}% latest / ${avg.toFixed(1)}% avg (${pts}/4)`);
 }
 if(shares!=null&&oldestShares!=null&&oldestShares>0){
   shareChange=(shares/oldestShares-1)*100;
   const pts=shareChange<=-5?4:shareChange<=0?3:shareChange<=5?2:shareChange<=10?1:0;
   capitalScore+=pts;capitalMeasured+=4;capitalParts.push(`5-year diluted share-count change ${shareChange>=0?"+":""}${shareChange.toFixed(1)}% (${pts}/4)`);
 }
 // Sustainability is measured only with multi-year FCF, debt and share-count evidence.
 // It rewards capital return funded by durable FCF without a material increase in leverage.
 const debtSeries=bal.slice(0,5).map(x=>num(x.totalDebt)).filter(x=>x!=null);
 const fcfSeries=cf.slice(0,5).map(x=>{let z=num(x.freeCashFlow),o=num(x.operatingCashFlow??x.netCashProvidedByOperatingActivities),cx=num(x.capitalExpenditure??x.capitalExpenditures);if(z==null&&o!=null&&cx!=null)z=o+cx;return z}).filter(x=>x!=null);
 if(debtSeries.length>=3&&fcfSeries.length>=3&&shareChange!=null){
   const positiveShare=fcfSeries.filter(x=>x>0).length/fcfSeries.length;
   const debtChange=debtSeries.at(-1)>0?(debtSeries[0]/debtSeries.at(-1)-1)*100:null;
   let pts=0;
   if(positiveShare===1&&debtChange!=null&&debtChange<=10&&shareChange<=0)pts=4;
   else if(positiveShare>=.8&&debtChange!=null&&debtChange<=25&&shareChange<=5)pts=3;
   else if(positiveShare>=.6&&debtChange!=null&&debtChange<=50)pts=2;
   else if(positiveShare>=.6)pts=1;
   capitalScore+=pts;capitalMeasured+=4;capitalParts.push(`allocation sustainability: positive FCF ${Math.round(positiveShare*fcfSeries.length)}/${fcfSeries.length} years · debt change ${debtChange==null?"—":(debtChange>=0?"+":"")+debtChange.toFixed(1)+"%"} (${pts}/4)`);
 }
 const missingCapital=[];
 if(!roicHistory.length)missingCapital.push("ROIC");
 if(roicHistory.length<3)missingCapital.push("ROIC durability");
 if(capitalMeasured<16&&!(debtSeries.length>=3&&fcfSeries.length>=3&&shareChange!=null))missingCapital.push("capital-allocation sustainability");
 if(missingCapital.length)capitalParts.push(`${missingCapital.join(", ")} unscored until the required statement evidence is available`);
 const capitalWhy=capitalParts.join(" · ");

 // 5. Valuation /20: FCF yield 8, earnings yield 6, EV/EBIT 6.
 const earningsYield=(net!=null&&marketCap)?net/marketCap*100:null;
 const enterpriseValue=(marketCap!=null&&debt!=null&&cash!=null)?marketCap+debt-cash:null;
 const evEbit=(enterpriseValue!=null&&ebit>0)?enterpriseValue/ebit:null;
 let valScore=0,valMeasured=0,valParts=[];
 if(fcfYield!=null){const pts=fcfYield>=10?8:fcfYield>=8?7:fcfYield>=6?5:fcfYield>=4?3:fcfYield>=2?1:0;valScore+=pts;valMeasured+=8;valParts.push(`FCF yield ${ratioPct(fcfYield)} (${pts}/8)`);}
 if(earningsYield!=null){const pts=earningsYield>=10?6:earningsYield>=8?5:earningsYield>=6?4:earningsYield>=4?2:earningsYield>=2?1:0;valScore+=pts;valMeasured+=6;valParts.push(`earnings yield ${ratioPct(earningsYield)} (${pts}/6)`);}
 if(evEbit!=null){const pts=evEbit<=8?6:evEbit<=10?5:evEbit<=12?4:evEbit<=15?2:evEbit<=20?1:0;valScore+=pts;valMeasured+=6;valParts.push(`EV/EBIT ${evEbit.toFixed(1)}x (${pts}/6)`);}
 const valWhy=valParts.length?valParts.join(" · "):"Needs market value and earning-power evidence.";

 const measured=[strengthMeasured,earnMeasured,cashMeasured,capitalMeasured,valMeasured];
 const earned=[strengthScore,earnScore,cashScore,capitalScore,valScore];
 const measuredTotal=measured.reduce((a,b)=>a+b,0), earnedTotal=earned.reduce((a,b)=>a+b,0);
 const evidenceScore=measuredTotal?Math.round(earnedTotal/measuredTotal*100):null;
 const completeness=measuredTotal; // denominator is 100 possible evidence points.


 // V47 Margin of Safety: separate from the 100-point evidence score.
 // Uses only reported FCF, cash/investments, debt and diluted shares already supplied by the report.
 const fcfChron=[...years].filter(y=>y.fcf!=null).reverse();
 const recentFcf=fcfChron.slice(-3).map(y=>y.fcf).filter(x=>x>0);
 const latestFcf=fcfChron.length?fcfChron.at(-1).fcf:null;
 const avg3=recentFcf.length?recentFcf.reduce((a,b)=>a+b,0)/recentFcf.length:null;
 const weighted3=recentFcf.length===3?(recentFcf[0]*.2+recentFcf[1]*.3+recentFcf[2]*.5):avg3;
 let sustainableGrowth=null;
 if(revCagr!=null&&fcfCagr!=null)sustainableGrowth=Math.min(revCagr,fcfCagr,10);
 else if(fcfCagr!=null)sustainableGrowth=Math.min(fcfCagr,10);
 else if(revCagr!=null)sustainableGrowth=Math.min(revCagr,10);
 if(sustainableGrowth!=null)sustainableGrowth=Math.max(-10,sustainableGrowth);
 // V53: negative historical growth is evidence of contraction/cyclicality, not a
 // mechanically sustainable forecast. Normalize the starting FCF across recent
 // years and use 0% as the forward growth floor rather than extrapolating decline.
 const cyclicalNormalization=sustainableGrowth!=null&&sustainableGrowth<0;
 const dcfGrowthReference=cyclicalNormalization?0:sustainableGrowth;

 const dcfValue=(startFcf,g1,terminal,discount)=>{
   if(!(startFcf>0)||!(shares>0)||discount<=terminal)return null;
   let pv=0, prior=startFcf;
   for(let yr=1;yr<=10;yr++){
     let g;
     if(yr<=5) g=g1;
     else {
       const step=(yr-5)/5;
       g=g1+(terminal-g1)*step;
     }
     prior=prior*(1+g);
     pv+=prior/Math.pow(1+discount,yr);
   }
   const tv=prior*(1+terminal)/(discount-terminal);
   pv+=tv/Math.pow(1+discount,10);
   const cashInvest=num(b0.cashAndShortTermInvestments)??cash??0;
   const equity=pv+cashInvest-(debt??0);
   return equity/shares;
 };
 const mosPct=(value)=>value!=null&&value!==0&&price!=null?(value-price)/value*100:null;
 const fmtVal=(v)=>v==null?"—":"$"+v.toFixed(2);
 const fmtMos=(m)=>m==null?"—":(m>=0?`${m.toFixed(1)}% below estimated value`:`${Math.abs(m).toFixed(1)}% above estimated value`);

 let mosCases=null;
 // V125: retain the reverse-DCF result directly for the publication report.
 // This avoids reparsing display text and correctly preserves negative implied growth.
 let ptMarketImpliedGrowth=null;
 if(latestFcf>0&&avg3>0&&weighted3>0&&sustainableGrowth!=null&&shares>0&&price!=null){
   const normalizedStart=avg3;
   const conservativeStart=cyclicalNormalization?Math.min(latestFcf,avg3):Math.min(latestFcf,avg3);
   const baseStart=cyclicalNormalization?normalizedStart:weighted3;
   const favorableStart=cyclicalNormalization?Math.max(latestFcf,avg3):latestFcf;
   const sg=dcfGrowthReference/100;
   let cases=[
     {name:"Cautious scenario value",start:conservativeStart,g:sg*.50,t:.02,r:.11},
     {name:"Normalized scenario value",start:baseStart,g:sg*.75,t:.025,r:.10},
     {name:"Stronger-growth scenario",start:favorableStart,g:sg*.85,t:.0275,r:.095}
   ].map(c=>({...c,value:dcfValue(c.start,c.g,c.t,c.r)}));
   // Sanity guard: sensitivity scenarios must remain economically ordered.
   if(cases.every(c=>c.value!=null) && !(cases[0].value<=cases[1].value && cases[1].value<=cases[2].value)){
     const ordered=[...cases].map(c=>c.value).sort((a,b)=>a-b);
     cases[0].value=ordered[0]; cases[1].value=ordered[1]; cases[2].value=ordered[2];
   }
   cases.forEach(c=>c.mos=mosPct(c.value));
   mosCases=cases;
 }
 const mosGrid=document.getElementById("dvMosGrid"),mosSummary=document.getElementById("dvMosSummary"),mosAssumptions=document.getElementById("dvMosAssumptions");
 if(mosCases){
   mosGrid.innerHTML=mosCases.map(c=>`<div class="dv-mos-case"><span>${c.name}</span><b>${fmtVal(c.value)}</b><small>${fmtMos(c.mos)}</small></div>`).join("");
   const baseCase=mosCases[1], lo=Math.min(...mosCases.map(c=>c.value)), hi=Math.max(...mosCases.map(c=>c.value));
   // Solve for the first-five-year FCF growth rate that makes the base DCF equal the current market price.
   // Uses the same normalized starting FCF, 10% discount rate and 2.5% terminal growth as the base case.
   const impliedGrowthValue=(g)=>dcfValue(baseCase.start,g,.025,.10);
   let impliedGrowth=null, impliedGrowthNote="";
   let low=-.20, high=1.00, lowVal=impliedGrowthValue(low), highVal=impliedGrowthValue(high);
   if(lowVal!=null&&highVal!=null&&price!=null){
     if(price<lowVal){
       impliedGrowthNote=`Below the value produced even at -20% near-term FCF growth.`;
     } else if(price>highVal){
       impliedGrowthNote=`Requires more than 100% annualized FCF growth in years 1–5 under the base discount and terminal assumptions.`;
     } else {
       for(let i=0;i<80;i++){
         const mid=(low+high)/2, midVal=impliedGrowthValue(mid);
         if(midVal<price) low=mid; else high=mid;
       }
       impliedGrowth=(low+high)/2;
       ptMarketImpliedGrowth=impliedGrowth;
     }
   }
   const impliedLine=impliedGrowth!=null
     ? `<br><b>Market-implied FCF growth:</b> ${(impliedGrowth*100).toFixed(1)}% annualized in years 1–5 under the base DCF assumptions.`
     : (impliedGrowthNote?`<br><b>Market-implied FCF growth:</b> ${impliedGrowthNote}`:"");
   let growthGapLine="";
   if(impliedGrowth!=null){
     const impliedPct=impliedGrowth*100, gap=impliedPct-dcfGrowthReference;
     const direction=gap>1?"above":(gap<-1?"below":"near");
     const context=direction==="above"
       ? `The market-implied ${impliedPct.toFixed(1)}% annual FCF growth is substantially above the normalized ${dcfGrowthReference.toFixed(1)}% growth reference used by this model. The current price therefore depends on materially stronger growth than the normalized case assumes.`
       : direction==="below"
