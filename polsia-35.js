      if(typeof pt228ShowLibraryTab==="function") pt228ShowLibraryTab("portfolios");
    }catch(e){}
  };

  // Home must also switch instantly rather than visibly scrolling through the site.
  window.ptReturnHome=function(){
    document.querySelectorAll("main section").forEach(s=>{
      s.style.display="none";
      s.classList.remove("active");
    });
    const h=document.getElementById("reportHome");
    if(h){ h.style.display="block"; h.classList.add("active"); }
    const mobile=document.getElementById("mobile");
    if(mobile) mobile.style.display="none";
    window.scrollTo(0,0);
    requestAnimationFrame(()=>window.scrollTo(0,0));
  };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  const foundationOrder=[
    'Stocks, ETFs & Bonds',
    'Core, Diversifier & Tilt',
    'Portfolio Overlap',
    'Diversification',
    'Risk',
    'Behavior',
    'Rebalancing'
  ];
  const analysisOrder=[
    'Reading the Three Financial Statements',
    'Free Cash Flow',
    'Debt, Liquidity',
    'ROIC',
    'WACC',
    'Capital Allocation',
    'Normalized Earnings',
    'Valuation Multiples',
    'DCF:',
    'Margin of Safety',
    'How to Analyze an ETF',
    'How to Read a Portfolio Thesis Report'
  ];

  function titleOf(card){
    const h=card.querySelector('h1,h2,h3,h4');
    return (h?h.textContent:card.textContent||'').replace(/\s+/g,' ').trim();
  }
  function rank(title,order){
    const t=title.toLowerCase();
    const i=order.findIndex(x=>t.includes(x.toLowerCase()));
    return i<0?999:i;
  }
  function reorder(cat){
    const lib=document.querySelector('#pt170Lessons .library');
    if(!lib)return;
    const order=cat==='analysis'?analysisOrder:foundationOrder;
    const cards=[...lib.querySelectorAll('.lesson[data-lesson]')]
      .filter(c=>(c.dataset.pt174Cat||'101')===cat);
    cards.sort((a,b)=>rank(titleOf(a),order)-rank(titleOf(b),order));
    cards.forEach(c=>lib.appendChild(c));
  }

  const old=window.pt174LessonCategory;
  window.pt174LessonCategory=function(cat,btn){
    old(cat,btn);
    const intro=document.getElementById('pt174TrackIntro');
    if(cat==='101'){
      intro.innerHTML=`<div class="pt245-foundations-path">
        <div class="eyebrow">FOUNDATIONS PATH</div>
        <div class="pt247-path-flow"><span>Building Blocks</span><i>→</i><span>Portfolio Construction</span><i>→</i><span>Diversification & Risk</span><i>→</i><span>Discipline</span></div>
        <p>Build the concepts in the same sequence used by the lessons below.</p>
      </div>`;
    }else{
      intro.innerHTML=`<div class="pt244-analysis-path">
        <div class="pt244-path-label">ANALYSIS PATH</div>
        <div class="pt247-path-flow"><span>Financial Statements</span><i>→</i><span>Cash Flow & Quality</span><i>→</i><span>Capital & Returns</span><i>→</i><span>Valuation</span><i>→</i><span>Thesis</span></div>
        <div class="pt244-path-copy">Move from understanding the financial evidence to judging quality, value and the investment thesis.</div>
      </div>`;
    }
    reorder(cat);
  };

  // Re-run current category after all existing Academy scripts initialize.
  setTimeout(function(){
    const page=document.getElementById('pt170Lessons');
    if(page && typeof window.pt174LessonCategory==='function'){
      window.pt174LessonCategory(page.dataset.category||'101');
    }
  },120);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  function putQuizLast(){
    const lib=document.querySelector('#pt170Lessons .library');
    if(!lib)return;
    const quizzes=[...lib.querySelectorAll('.pt174-quiz')];
    quizzes.forEach(q=>lib.appendChild(q));
  }

  const prior=window.pt174LessonCategory;
  window.pt174LessonCategory=function(cat,btn){
    prior(cat,btn);
    putQuizLast();
    requestAnimationFrame(putQuizLast);
  };

  setTimeout(putQuizLast,160);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 function enhance(){
   const page=document.getElementById('pt170Glossary'); if(!page)return;
   const grid=page.querySelector('.pt170-glossary'); if(!grid)return;
   let nav=page.querySelector('.pt249-az');
   if(!nav){
     nav=document.createElement('div'); nav.className='pt249-az';
     grid.parentNode.insertBefore(nav,grid);
   }
   const cards=[...grid.querySelectorAll('.pt170-term')];
   const map={};
   cards.forEach(c=>{
     const h=c.querySelector('h3'); if(!h)return;
     const letter=h.textContent.trim().charAt(0).toUpperCase();
     if(!map[letter]) map[letter]=c;
   });
   nav.innerHTML='';
   'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter=>{
     const b=document.createElement('button'); b.type='button'; b.textContent=letter;
     if(map[letter]){
       b.className='has';
       b.onclick=()=>map[letter].scrollIntoView({behavior:'auto',block:'start'});
     } else b.disabled=true;
     nav.appendChild(b);
   });
 }
 setTimeout(enhance,180);
 const old=window.pt170LearnPage;
 if(typeof old==='function'){
   window.pt170LearnPage=function(page,btn){ old(page,btn); if(page==='glossary')setTimeout(enhance,20); };
 }
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  function addPrintLink(){
    const page=document.getElementById('pt170Formulas'); if(!page)return;
    if(page.querySelector('.pt253-print-formulas'))return;
    const intro=page.querySelector('p');
    const holder=document.createElement('div');
    holder.innerHTML='\n<div class="pt253-print-formulas">\n  <a href="data:application/pdf;base64,JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUiAvRjMgNCAwIFIgL0Y0IDUgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GMSAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL0Jhc2VGb250IC9UaW1lcy1Cb2xkIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GMiAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EtQm9sZCAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjMgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iago1IDAgb2JqCjw8Ci9CYXNlRm9udCAvU3ltYm9sIC9OYW1lIC9GNCAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjYgMCBvYmoKPDwKL0NvbnRlbnRzIDEwIDAgUiAvTWVkaWFCb3ggWyAwIDAgNzkyIDYxMiBdIC9QYXJlbnQgOSAwIFIgL1Jlc291cmNlcyA8PAovRm9udCAxIDAgUiAvUHJvY1NldCBbIC9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUkgXQo+PiAvUm90YXRlIDAgL1RyYW5zIDw8Cgo+PiAKICAvVHlwZSAvUGFnZQo+PgplbmRvYmoKNyAwIG9iago8PAovUGFnZU1vZGUgL1VzZU5vbmUgL1BhZ2VzIDkgMCBSIC9UeXBlIC9DYXRhbG9nCj4+CmVuZG9iago4IDAgb2JqCjw8Ci9BdXRob3IgKFwoYW5vbnltb3VzXCkpIC9DcmVhdGlvbkRhdGUgKEQ6MjAyNjA5MzAxNTEzMDkrMDAnMDAnKSAvQ3JlYXRvciAoXCh1bnNwZWNpZmllZFwpKSAvS2V5d29yZHMgKCkgL01vZERhdGUgKEQ6MjAyNjA5MzAxNTEzMDkrMDAnMDAnKSAvUHJvZHVjZXIgKFJlcG9ydExhYiBQREYgTGlicmFyeSAtIFwob3BlbnNvdXJjZVwpKSAKICAvU3ViamVjdCAoXCh1bnNwZWNpZmllZFwpKSAvVGl0bGUgKFwoYW5vbnltb3VzXCkpIC9UcmFwcGVkIC9GYWxzZQo+PgplbmRvYmoKOSAwIG9iago8PAovQ291bnQgMSAvS2lkcyBbIDYgMCBSIF0gL1R5cGUgL1BhZ2VzCj4+CmVuZG9iagoxMCAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAyMzAwCj4+CnN0cmVhbQpHYXVgVj8kRyFeJjpNbS5RcSxSP2E1OGRmVDRlOVhdNGpnT0QwTz0zNGlbUmhlLzZyKkQ6N2RTaGlWXm0jVG5mXEZxOkxpUCUmMmBdIjJycVlRY1MrMiJDVGolZS8mJU1sbThRJWMubVY7X2MsI0w1cEtPbTddJjBkU0xcLSJqPT1oZj5MbTQ2ckAwZ2YhN1RoJHFJY1hyNzJrQkZGX1ddbjhWVmxLKkwwUFQ8PGgvTVBtcllaUSRAYzk7YldQLE9jYUY2NSskITJlKUEwbkRRIXBqJHNySi46RkpBUEI2Ni1LKGsubEYsLUBzUEg1TF9cMFlfcCdHQ3BTPnUxdC1FbmpCUSdLbkJJIjIoJStqVS5kWitfZXNxTidQVSNSLzZPWCFASCZmVWpXUkVOJ0tfbUVCcEZkOV0uQC9PIzNAbSlGWnNfKXBnOmFkYzpsNGopTDw7LjNGdD4uMUt1YFVDXz5SLWY/QEQyTlJIUVAwdEonXFkjYVAuNkguXWdQVGoiaU9GYkpYQW91W3E5JFk0V1BaOkRgbTEhRmlOQUdpL1VfLiIlR1VCM0Bjc21LSkRaJEBGUm9DcSYlbGZbXSU+aFJVJ1t1VklNTD4pM1ZeRVxMSCtBJVlaaiUrSHVgLmpVXGdwbCVVVDM+aWxWS0okOUdeKSpWY2FhSywrK2FtYCYrazE0I1NfRDpsQkk5bStlakciWFJccSk9SCcuKUo5XF9dMWtqREIjOz40cGlWViZQbikqKmA8Z21cY1dJMyshWUw+RysycWBlOCcqQUIvKUo3Ml9NZEAwbVcwbDRESiVPSV5uVTFudW1ySilGSDdSYjNhM0w3WkUwcVlEcGolcHMlPC1oPVojcTFTJ1xLOGYlV2gxUVZNKCk5RFAzOGkhaUVWSzE5K2prM2IqYVE4PUIoLjs1Z1RiNV1sWUcoSUBpQFotLjNhUiRcUydxKGQ+WkVMSl9oOmJqWSxUJWJfMFRDYlpOT21JKz4hJEIkRSVYKWpMKDJCSDUlUmRhUUUpMTUmLT0iSm82PVVoTDtlUT5qNS1Abm9mLDghSipaRycpaSFRTyw6ZW5aSG9ZXFovMSNkcWdmaUw3NS8xbVJUPytebyVmRW9JYCMwUCk4a1pAQF5RTkFjWG9TUltvaS9ecnFoIz1cPGJqYykhKmZZam1tPktsRGI+SEdAdWVOXzM1LVRbTE1nUFhQZFhpNmRdXTZcN0Y4RylLTmJNYidxIWZdcGFNRFA1Vip1OCg9aEsnbig6cW5aTE47b2o1XCNnXC9QJFtiTFxjRXM5N0hiUG06QlNwNSRiJylsXDo8YnBab01nLWJUTyxnXGVEMSFmLHMtXSRYOz84aGw1KSptL0BISWc5ZDkuSENHU2xSbyNTTl1xXmpVbTZFVUwvJztQTEBHQzJaZjpXMXA5VjhZRS1oTlRvU3BbYmJmLDowKSZzIzV1bSlxYFNuJFpLMyEwb01WNEQ1OVM0MmpzW3NqKkVeLzEnNjE+TW9BLG5Aa1VDcC5HRFosRURHb04jckdKaGUpIStSTENQclFfPGVgcVMvR3BXUys8aVRbTDFUUTNyNiklNE00ckFPQkIkNiM4XFlTYzpCbSZcRFpXUD88KDN1XHBeX1xnNUJgcU5gQjowLiJddVB0bDJrL0txSWppaVpWZ2w7PnF1QG4majk1RGduZHVPIiQlRVxaSXFUclMwbDFtSiE+YzJKXSluLWFATGpLVW5SQSdcW11rMGdiTVBYKzgrOmk7cSkhRCVuTUVIXGk+Im9pNTI+Rl0vOC1zNTlQIjxlLFVOWFVSTDdYXiElM1xcdWkuWGZCPkNBQ2BzZFtyM09IOm9nUWtEYi5uaWdpY0crMV5jNUxoSjRvVmpSUU5MK04hTzJrQ3AlRShOVDpZSCo2cj06bjxXb0YxZUwzZj4jQjc1RU10JzNmazxhPCdkRzxqNm8pRlBmWTZkIUlvWiR0JVVnXU09Vi49OzUhSV1PR09jIjtoSVJHaT1wVicxYXJXTT9nVTxIZE1NO00lbi5dZy1hIyhhaElmU0ZaUHROXlBMKlVCTFlFR1pMWFcxSl5mcClcczNMZk5LSUNcK21GXzYhNjBJNy11Tjs+SVxeLWY2PztuJz0vW1REbTtAMDY2R1A7KFslXztTWG1vLnFlVV4xYSUuXWJNbztXdT5wMF1XYlhyR15CNyxmWHBBVkxWJFEzMHBoJD8vWS9AKFo/LlMhTyhPPl5oPEFIUEZhOFdXcW9KcTZLQlQ6bDQtIXBRLCtgWDM1US11PTBTc2heUy9tWWhfJm02PSZrSktnJHNJMUs7NUhgN2whQU9ZLlFPOChVMW0xRlZrMS1jNGNrNUA2LEVfaEByNVZgK1hubWxxZDNBcG5mZiwqcGwmXEpkL2owIydRSEZRQUpETy4kLkViZ3JyOkQ/SCtwQzRWNHFFbVs4L0NsSTszLD1DaldrcDlibCVtZ1poNS1bVWJmPUVBWXFJZUNwI1c2KEI/WlZOQ1JPUCEycWliVl5abmU8OSxGLkBwP0BTczJlYzArTFFKOV1ZXjU4WGxMK2BdTFhHU1YtSjs4I3FQa0RGSzZmQmZOOyYoWERMZllDUnRCcmRET2UzT0ptYCxOaDRjVy8rbHIyTCc9JSgwa0Q/KXI9YG43OmVcNSUmWjlnRSVAQWtlQF5qOmEhdDg5SWshNGAiaVVMJyI8NHBUKyNaO2dFIlJFSFkqKC81RDQ2ZUE+c3BxRTxcJmg8N2F0VSNdcVVALmRzdCtNZVFEdTFTVi5nO0tsK1QtQz4tcUIlWFkwU0dhN25ZOUY/LXUuX0RKSTAqaToyRCotKCFMTiQ9ISQvcVUlIjE8Qi1UX3VMRT5tXUk2ImNzdCc7PnQkOFhrWS0+RV5YOi5sVVFqNjw9NDtEajdzJzdMMTpyT0gjKz9jYj9JS05sbHAjSyMkMWArJFEjU3RYQSNxKS4tLiYqLlVSN0otaylbXlw7QyEhUWtSJyhQS1hSJF5QSyFTRU0iSkNoRV5AVUxQUzVdQXBDTEQ9V2RzXkkhNWI+clc+JFU6Vzx+PmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDExCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDA2MSAwMDAwMCBuIAowMDAwMDAwMTIyIDAwMDAwIG4gCjAwMDAwMDAyMjkgMDAwMDAgbiAKMDAwMDAwMDMzNyAwMDAwMCBuIAowMDAwMDAwNDQ5IDAwMDAwIG4gCjAwMDAwMDA1MjYgMDAwMDAgbiAKMDAwMDAwMDcyMCAwMDAwMCBuIAowMDAwMDAwNzg4IDAwMDAwIG4gCjAwMDAwMDEwNjggMDAwMDAgbiAKMDAwMDAwMTEyNyAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9JRCAKWzxmODA4ODRmZDExMjA1YzBjYzk0MTFjNzYzZWY5ZTU1ND48ZjgwODg0ZmQxMTIwNWMwY2M5NDExYzc2M2VmOWU1NTQ+XQolIFJlcG9ydExhYiBnZW5lcmF0ZWQgUERGIGRvY3VtZW50IC0tIGRpZ2VzdCAob3BlbnNvdXJjZSkKCi9JbmZvIDggMCBSCi9Sb290IDcgMCBSCi9TaXplIDExCj4+CnN0YXJ0eHJlZgozNTE5CiUlRU9GCg==" download="Portfolio_Thesis_Formula_Quick_Reference.pdf">\n    Printable 1-Page Formula Sheet (PDF)\n  </a>\n  <span>22 formulas - landscape letter</span>\n</div>\n';
    const node=holder.firstElementChild;
    if(intro && intro.parentNode) intro.insertAdjacentElement('afterend',node);
    else page.insertBefore(node,page.firstChild);
  }
  setTimeout(addPrintLink,180);
  const prior=window.pt170LearnPage;
  if(typeof prior==='function'){
    window.pt170LearnPage=function(page,btn){prior(page,btn);if(page==='formulas')setTimeout(addPrintLink,30);};
  }
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  const pages=['lessons','glossary','formulas','worksheets'];

  function academyButtons(){
    const academy=document.getElementById('academy');
    if(!academy)return [];
    return [...academy.querySelectorAll('button')].filter(b=>
      pages.includes((b.textContent||'').replace(/\s+/g,' ').trim().toLowerCase())
    );
  }

  function setActive(page){
    academyButtons().forEach(b=>{
      const name=(b.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
      b.dataset.pt256Active=(name===page)?'true':'false';
      // Remove legacy state classes so they cannot visually leak.
      if(name!==page) b.classList.remove('active','selected','on','current');
    });
  }

  document.addEventListener('click',function(e){
    const b=e.target.closest('#academy button');
    if(!b)return;
    const page=(b.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(pages.includes(page)) setTimeout(()=>setActive(page),0);
  },true);

  const prior=window.pt170LearnPage;
  if(typeof prior==='function'){
    window.pt170LearnPage=function(page,btn){
      prior(page,btn);
      setActive(page);
    };
  }

  setTimeout(function(){
    // Infer whichever Academy content panel is currently visible.
    const ids={lessons:'pt170Lessons',glossary:'pt170Glossary',formulas:'pt170Formulas',worksheets:'pt170Worksheets'};
    let page='lessons';
    Object.keys(ids).forEach(k=>{
      const el=document.getElementById(ids[k]);
      if(el && getComputedStyle(el).display!=='none') page=k;
    });
    setActive(page);
  },120);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const priorOpen=window.pt175Open, key='pt_saved_worksheets_v1';
 const load=()=>{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return[]}};
 const save=x=>localStorage.setItem(key,JSON.stringify(x));
 function val(rec,k){return rec?.values?.[k]||''}
 function num(v){const n=Number(String(v||'').replace(/[$,% ,]/g,''));return Number.isFinite(n)?n:null}
 function fmt(n){if(n===null||!Number.isFinite(n))return '—'; const a=Math.abs(n); if(a>=1e9)return '$'+(n/1e9).toFixed(2)+'B';if(a>=1e6)return '$'+(n/1e6).toFixed(1)+'M';if(a>=1e3)return '$'+(n/1e3).toFixed(1)+'K';return '$'+n.toLocaleString(undefined,{maximumFractionDigits:2})}
 window.pt175Open=function(id,recordId){
   if(id!=='financials')return priorOpen(id,recordId);
   const list=document.getElementById('pt175WorksheetList'),ed=document.getElementById('pt175WorksheetEditor');
   const rec=recordId?load().find(x=>x.id===recordId):null; list.style.display='none';ed.style.display='block';
   ed.innerHTML=`<button class="pt175-btn" onclick="pt263Workspace('company')">← Company Analysis</button><div class="pt175-editor" data-type="financials" data-record="${rec?.id||''}"><div class="eyebrow">COMPANY ANALYSIS · STEP 1</div><h2>Financial Statement Worksheet</h2><p>Connect the income statement, cash-flow statement and balance sheet before deciding what the numbers mean.</p>
   <div class="pt265-companybar"><div class="pt175-field"><label>Company / ticker</label><input data-field="ticker" value="${val(rec,'ticker')}" placeholder="e.g. ADBE"></div><div class="pt265-autofill">Financial data will populate here when the company-data connection is enabled.</div></div>
   <div class="pt265-section"><h3>Financial Evidence</h3><p>Portfolio Thesis should supply reported figures. These fields remain editable while the live data connection is being built.</p><div class="pt265-evidence">
