    const id=(a.getAttribute('href')||'').slice(1);
    const el=id && document.getElementById(id);
    if(el) setTimeout(()=>pt232LandOn(el),0);
  },true);

  /* Correct direct hash landings too. */
  function fixHash(){
    const id=(location.hash||'').slice(1);
    if(id) pt232LandOn(document.getElementById(id));
  }
  window.addEventListener('hashchange',fixHash);
  window.addEventListener('load',()=>setTimeout(fixHash,0));
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  const GAP = 22;

  function visibleHeaderBottom(){
    const header = document.querySelector('header');
    if(!header) return 0;
    const r = header.getBoundingClientRect();
    return Math.max(0, Math.ceil(r.bottom));
  }

  function sectionTop(el){
    if(!el) return;
    /* Navigation should land at the true beginning of the page/section,
       with its eyebrow/title visible below the header. */
    const top = window.scrollY + el.getBoundingClientRect().top;
    window.scrollTo(0, Math.max(0, top - visibleHeaderBottom() - GAP));
  }

  function targetFromMenuControl(control){
    if(!control) return null;

    const href = control.getAttribute && control.getAttribute('href');
    if(href && href.charAt(0)==='#'){
      return document.getElementById(href.slice(1));
    }

    const onclick = control.getAttribute && (control.getAttribute('onclick') || '');
    let m = onclick.match(/showSection\s*\(\s*['"]([^'"]+)['"]/i);
    if(m) return document.getElementById(m[1]);

    m = onclick.match(/ptOpenLibrary\s*\(/i);
    if(m) return document.getElementById('library');

    /* Common menu text fallback. */
    const t=(control.textContent||'').trim().toLowerCase();
    const map={
      'home':'home',
      'build':'builder',
      'builder':'builder',
      'analyze':'deepvalue',
      'deep value':'deepvalue',
      'academy':'academy',
      'learn':'academy',
      'library':'library',
      'issues':'issues'
    };
    return map[t] ? document.getElementById(map[t]) : null;
  }

  /* Run AFTER the existing menu handler has switched sections.
     This avoids wrapping unknown legacy navigation functions. */
  document.addEventListener('click', function(e){
    const menu = e.target.closest('nav, .menu, .nav-menu, .mobile-menu, .drawer, [class*="menu"]');
    if(!menu) return;

    const control=e.target.closest('a,button');
    if(!control) return;

    const target=targetFromMenuControl(control);
    if(!target) return;

    setTimeout(function(){
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){ sectionTop(target); });
      });
    }, 35);
  }, false);

  /* Also normalize direct calls to the central section navigator. */
  if(typeof window.showSection==='function'){
    const previousShow=window.showSection;
    window.showSection=function(id){
      const result=previousShow.apply(this,arguments);
      const target=document.getElementById(id);
      setTimeout(()=>sectionTop(target),35);
      return result;
    };
  }

  /* Library opener is async in some builds. */
  if(typeof window.ptOpenLibrary==='function'){
    const previousLibrary=window.ptOpenLibrary;
    window.ptOpenLibrary=async function(){
      const result=await previousLibrary.apply(this,arguments);
      setTimeout(()=>sectionTop(document.getElementById('library')),35);
      return result;
    };
  }
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  const GAP = 22;

  function headerBottom(){
    const h=document.querySelector('header');
    return h ? Math.max(0,Math.ceil(h.getBoundingClientRect().bottom)) : 0;
  }

  function scrollPageStart(section){
    if(!section) return;
    /*
      Menu navigation must land at the page introduction, not the first
      functional card inside that page. Find the earliest visible child
      belonging to the destination section and use the section itself
      whenever possible.
    */
    let anchor=section;

    // Some legacy sections are large wrappers whose intro is in a preceding
    // sibling. Prefer a page hero/title found inside the section.
    const hero=section.querySelector(
      ':scope > .hero, :scope > .section-hero, :scope > .page-hero, ' +
      ':scope > .intro, :scope > .section-intro, :scope > [class*="hero"]'
    );
    if(hero) anchor=hero;

    const y=window.scrollY + anchor.getBoundingClientRect().top - headerBottom() - GAP;
    window.scrollTo(0,Math.max(0,y));
  }

  function destination(control){
    const txt=(control.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    const ids={
      'home':['home'],
      'build a portfolio':['builder','build'],
      'analyze a company':['deepvalue','deep-value','analyze'],
      'academy':['academy'],
      'reports, portfolios & watchlists':['library'],
      'library':['library']
    };
    const choices=ids[txt];
    if(!choices) return null;
    for(const id of choices){
      const el=document.getElementById(id);
      if(el) return el;
    }
    return null;
  }

  document.addEventListener('click',function(e){
    const c=e.target.closest('a,button');
    if(!c) return;
    const d=destination(c);
    if(!d) return;

    // Let the existing router reveal/render the page first.
    setTimeout(function(){
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){ scrollPageStart(d); });
      });
    },90);
  },true);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  const labels = {
    'home': ['home'],
    'build a portfolio': ['builder','build'],
    'analyze a company': ['deepvalue','deep-value','analyze'],
    'academy': ['academy'],
    'library': ['library']
  };

  function destination(control){
    const txt=(control.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    const ids=labels[txt];
    if(!ids) return null;
    for(const id of ids){
      const el=document.getElementById(id);
      if(el) return el;
    }
    return null;
  }

  function topOffset(){
    const h=document.querySelector('header');
    return h ? Math.ceil(h.getBoundingClientRect().bottom) + 22 : 22;
  }

  function placeAtPageTop(section){
    if(!section) return;
    const y=window.scrollY + section.getBoundingClientRect().top - topOffset();
    window.scrollTo({top:Math.max(0,y), left:0, behavior:'instant'});
  }

  // Override only the menu transition. Existing page rendering and
  // destination content remain intact.
  document.addEventListener('click', function(e){
    const control=e.target.closest('a,button');
    if(!control) return;
    const dest=destination(control);
    if(!dest) return;

    // Disable any smooth scrolling for this navigation cycle.
    const root=document.documentElement;
    const old=root.style.scrollBehavior;
    root.style.scrollBehavior='auto';

    // Existing handlers can switch the visible section first.
    setTimeout(function(){
      placeAtPageTop(dest);
      requestAnimationFrame(function(){
        placeAtPageTop(dest);
        root.style.scrollBehavior=old;
      });
    },0);
  },true);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  function cleanCompanyEmptyState(){
    const headings=[...document.querySelectorAll('h1,h2,h3,h4')];
    const selectHeading=headings.find(h =>
      (h.textContent||'').trim().toLowerCase()==='select a company'
    );
    if(!selectHeading) return;

    // Remove the entire redundant empty-state card containing
    // "AUTOMATED DEEP VALUE REPORT / Select a company".
    let card=selectHeading.closest(
      '.card, .panel, .research-card, .report-card, article'
    );

    if(!card){
      let p=selectHeading.parentElement;
      while(p && p!==document.body){
        const txt=(p.textContent||'').toLowerCase();
        if(txt.includes('automated deep value report') &&
           txt.includes('select a company') &&
           txt.includes('enter a ticker above')){
          card=p;
          break;
        }
        p=p.parentElement;
      }
    }

    if(card) card.style.display='none';
  }

  document.addEventListener('DOMContentLoaded', cleanCompanyEmptyState);
  window.addEventListener('load', cleanCompanyEmptyState);

  // Re-apply after page/view switches without affecting navigation.
  document.addEventListener('click', function(){
    setTimeout(cleanCompanyEmptyState, 30);
  });
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  const original = window.ptOpenExistingSection;

  window.ptOpenExistingSection = function(id){
    const target=document.getElementById(id);
    if(!target) return;

    // Hide all major app pages immediately before revealing destination.
    document.querySelectorAll("main section").forEach(s=>{
      s.style.display="none";
      s.classList.remove("active");
    });

    const home=document.getElementById("reportHome");
    if(home) home.style.display="none";

    target.style.display="block";
    target.classList.add("active");

    // Close menu using the site's actual menu element.
    const mobile=document.getElementById("mobile");
    if(mobile) mobile.style.display="none";

    // Critical fix: no smooth travel through hidden/previous sections.
    window.scrollTo(0,0);
    requestAnimationFrame(()=>window.scrollTo(0,0));
  };

  // Academy had extra scrollIntoView calls. Replace with the same instant router.
  window.ptGoPortfolio=function(){ window.ptOpenExistingSection("builder"); };
  window.ptGoCompany=function(){ window.ptOpenExistingSection("deepvalue"); };
  window.ptGoLearn=function(){ window.ptOpenExistingSection("academy"); };
  window.ptGoAccount=function(){
    window.ptOpenExistingSection("library");
    try{
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
   <div class="pt265-box"><h4>Income Statement</h4><p>Follow sales through accounting profit.</p><div class="pt175-field"><label>Revenue</label><input data-field="revenue" value="${val(rec,'revenue')}"></div><div class="pt175-field"><label>Net income</label><input data-field="netIncome" value="${val(rec,'netIncome')}"></div><div class="pt265-why"><b>Why this matters</b><br>Shows whether growth is translating into profit.</div></div>
   <div class="pt265-box"><h4>Cash Flow</h4><p>Test whether reported earnings are becoming cash.</p><div class="pt175-field"><label>Operating cash flow</label><input data-field="ocf" value="${val(rec,'ocf')}"></div><div class="pt175-field"><label>Capital expenditures</label><input data-field="capex" value="${val(rec,'capex')}"></div><div class="pt265-why"><b>Why this matters</b><br>OCF less CapEx provides a practical view of free cash generation.</div></div>
   <div class="pt265-box"><h4>Balance Sheet</h4><p>See the financial resources and obligations behind the business.</p><div class="pt175-field"><label>Cash</label><input data-field="cash" value="${val(rec,'cash')}"></div><div class="pt175-field"><label>Total debt</label><input data-field="debt" value="${val(rec,'debt')}"></div><div class="pt265-why"><b>Why this matters</b><br>Cash and debt help frame financial flexibility and enterprise value.</div></div></div></div>
   <div class="pt265-section"><h3>Trends & Relationships</h3><p>Use the statements together instead of reading each number in isolation.</p><div class="pt265-derived"><div><small>Free cash flow</small><b id="pt265Fcf">—</b></div><div><small>Cash less debt</small><b id="pt265NetCash">—</b></div><div><small>Cash conversion</small><b id="pt265Conversion">—</b></div></div><div class="pt175-formula"><code>FCF = Operating Cash Flow − Capital Expenditures</code></div></div>
   <div class="pt265-section"><h3>Guided Interpretation</h3><div class="pt175-field pt265-prompt"><label>What changed most, and what appears to explain it?</label><textarea data-field="change">${val(rec,'change')}</textarea></div><div class="pt175-field pt265-prompt"><label>Is cash generation supporting the reported earnings?</label><textarea data-field="cashQuality">${val(rec,'cashQuality')}</textarea></div><div class="pt175-field pt265-prompt"><label>Does the balance sheet strengthen or weaken the case?</label><textarea data-field="balanceView">${val(rec,'balanceView')}</textarea></div></div>
   <div class="pt265-section"><h3>Financial Evidence Summary</h3><p>Capture the evidence that should carry forward into Capital Quality and the Investment Thesis.</p><div class="pt175-field"><textarea data-field="conclusion" placeholder="Summarize profitability, cash generation, balance-sheet position and the most important item to monitor.">${val(rec,'conclusion')}</textarea></div></div>
   <div class="pt265-actions"><button class="pt175-btn primary" onclick="pt265SaveFinancials(true)">Save & Continue to ROIC →</button><button class="pt175-btn" onclick="pt265SaveFinancials(false)">Save worksheet</button><button class="pt175-btn" onclick="pt263Workspace('company')">Close</button></div><div id="pt175SaveMsg" class="pt175-saved">${rec?'Last saved '+new Date(rec.savedAt).toLocaleString():''}</div></div>`;
   const inputs=ed.querySelectorAll('input[data-field]');inputs.forEach(x=>x.addEventListener('input',calc));calc();
 }
 function calc(){const ed=document.querySelector('#pt175WorksheetEditor .pt175-editor');if(!ed)return;const get=k=>num(ed.querySelector(`[data-field="${k}"]`)?.value);const ocf=get('ocf'),capex=get('capex'),cash=get('cash'),debt=get('debt'),net=get('netIncome');const fcf=ocf!==null&&capex!==null?ocf-capex:null;document.getElementById('pt265Fcf').textContent=fmt(fcf);document.getElementById('pt265NetCash').textContent=fmt(cash!==null&&debt!==null?cash-debt:null);document.getElementById('pt265Conversion').textContent=fcf!==null&&net?((fcf/net)*100).toFixed(1)+'%':'—'}
 window.pt265SaveFinancials=function(next){const ed=document.querySelector('#pt175WorksheetEditor .pt175-editor');if(!ed)return;const values={};ed.querySelectorAll('[data-field]').forEach(x=>values[x.dataset.field]=x.value);let rows=load(),id=ed.dataset.record||('ws_'+Date.now()),row={id,type:'financials',values,savedAt:new Date().toISOString()};const i=rows.findIndex(x=>x.id===id);if(i>=0)rows[i]=row;else rows.unshift(row);save(rows);ed.dataset.record=id;const m=document.getElementById('pt175SaveMsg');if(m)m.textContent='Saved to My Worksheets · '+new Date().toLocaleString();if(next)setTimeout(()=>window.pt175Open('roic'),120)};
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const WKEY='pt_saved_worksheets_v1', SKEY='pt_company_research_sessions_v1', ACTIVE='pt_company_research_active_v1';
 const companyTypes=['financials','roic','valuation','dcf','mos','thesis'];
 const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
 const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch(e){return d}};
 const rows=()=>read(WKEY,[]), sessions=()=>read(SKEY,{});
 const norm=t=>String(t||'').trim().toUpperCase();
 function active(){return read(ACTIVE,null)}
 function setActive(t){t=norm(t); if(t)localStorage.setItem(ACTIVE,JSON.stringify(t)); return t}
 function rowTicker(r){return norm(r?.companyTicker||r?.values?.ticker)}
 function session(t){t=norm(t);return sessions()[t]||null}
 function ensureSession(t){t=setActive(t);if(!t)return null;let s=sessions();if(!s[t])s[t]={ticker:t,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),steps:{}};localStorage.setItem(SKEY,JSON.stringify(s));return s[t]}
 function findStep(type,t){t=norm(t||active());if(!t)return null;let s=session(t),id=s?.steps?.[type];return rows().find(r=>r.id===id)||rows().find(r=>r.type===type&&rowTicker(r)===t)||null}
 function derived(type,t){let r=findStep(type,t);return r?.derived||{}}
 function sessionBar(t){let s=session(t),done=companyTypes.filter(x=>s?.steps?.[x]).length;return `<div class="pt268-session"><b>${esc(t)} research session</b><span>${done} of 6 steps saved · work is carried forward automatically</span></div>`}
 function syncTickerInput(ed,t){let x=ed?.querySelector('[data-field="ticker"]');if(x){x.value=t;x.addEventListener('change',()=>{let n=norm(x.value);if(n&&n!==t){setActive(n);ensureSession(n)}})}}
 function decorate(type,t){let ed=document.querySelector('#pt175WorksheetEditor .pt175-editor');if(!ed||!companyTypes.includes(type)||!t)return;ed.dataset.companyTicker=t;let p=ed.querySelector(':scope > p');if(p&&!ed.querySelector('.pt268-session'))p.insertAdjacentHTML('afterend',sessionBar(t));syncTickerInput(ed,t)}
 function collectDerived(type,ed){let d={};if(type==='financials'){
   let n=k=>{let v=parseFloat(String(ed.querySelector(`[data-field="${k}"]`)?.value||'').replace(/[$,%\s,]/g,''));return Number.isFinite(v)?v:null},ocf=n('ocf'),capex=n('capex'),cash=n('cash'),debt=n('debt'),ni=n('netIncome');d.fcf=ocf!=null&&capex!=null?ocf-capex:null;d.netCash=cash!=null&&debt!=null?cash-debt:null;d.netDebt=cash!=null&&debt!=null?debt-cash:null;d.cashConversion=d.fcf!=null&&ni?100*d.fcf/ni:null;
 } else if(type==='roic'){
   let n=k=>{let v=parseFloat(String(ed.querySelector(`[data-field="${k}"]`)?.value||'').replace(/[$,%\s,]/g,''));return Number.isFinite(v)?v:null},nop=n('nopat'),inv=n('invested'),w=n('wacc');d.roic=nop!=null&&inv?100*nop/inv:null;d.wacc=w;d.spread=d.roic!=null&&w!=null?d.roic-w:null;
 } else if(type==='valuation'){
   let n=k=>{let v=parseFloat(String(ed.querySelector(`[data-field="${k}"]`)?.value||'').replace(/[$,%\s,]/g,''));return Number.isFinite(v)?v:null},p=n('price'),e=n('eps'),f=n('fcfps');d.pe=p&&e?p/e:null;d.fcfYield=p&&f?100*f/p:null;d.earningsYield=p&&e?100*e/p:null;
 } else if(type==='dcf'){
   let txt=id=>document.getElementById(id)?.textContent||'',money=id=>{let v=parseFloat(txt(id).replace(/[$,]/g,''));return Number.isFinite(v)?v:null};d.low=money('dLow');d.base=money('dBase');d.high=money('dHigh');
 } else if(type==='mos'){
   let pct=id=>{let v=parseFloat((document.getElementById(id)?.textContent||'').replace('%',''));return Number.isFinite(v)?v:null},money=id=>{let v=parseFloat((document.getElementById(id)?.textContent||'').replace(/[$,]/g,''));return Number.isFinite(v)?v:null};d.currentCushion=pct('mCur');d.targetPrice=money('mTarget');
 }return d}
 function saveCompany(type,next,nextId,workspace){let ed=document.querySelector('#pt175WorksheetEditor .pt175-editor');if(!ed)return false;let t=norm(ed.querySelector('[data-field="ticker"]')?.value||ed.dataset.companyTicker||active());if(!t)return false;setActive(t);let values={};ed.querySelectorAll('[data-field]').forEach(x=>values[x.dataset.field]=x.value);values.ticker=t;let rs=rows(),existing=findStep(type,t),id=ed.dataset.record||existing?.id||('ws_'+Date.now()),row={id,type,companyTicker:t,values,derived:collectDerived(type,ed),savedAt:new Date().toISOString()};let i=rs.findIndex(x=>x.id===id);if(i>=0)rs[i]=row;else rs.unshift(row);localStorage.setItem(WKEY,JSON.stringify(rs));let ss=sessions(),s=ss[t]||{ticker:t,createdAt:new Date().toISOString(),steps:{}};s.steps=s.steps||{};s.steps[type]=id;s.updatedAt=row.savedAt;ss[t]=s;localStorage.setItem(SKEY,JSON.stringify(ss));ed.dataset.record=id;let m=document.getElementById('pt175SaveMsg');if(m)m.textContent='Saved to '+t+' research · '+new Date().toLocaleString();if(next&&nextId)setTimeout(()=>window.pt175Open(nextId,null,t),80);else if(next&&workspace)setTimeout(()=>window.pt263Workspace(workspace),80);return true}
 window.pt268SaveCompany=saveCompany;
 const old267=window.pt267Save;window.pt267Save=function(next,nextId,workspace){let ed=document.querySelector('#pt175WorksheetEditor .pt175-editor');if(ed&&companyTypes.includes(ed.dataset.type))return saveCompany(ed.dataset.type,next,nextId,workspace);return old267(next,nextId,workspace)};
 const old265=window.pt265SaveFinancials;window.pt265SaveFinancials=function(next){return saveCompany('financials',next,next?'roic':null,null)};
 const old266=window.pt266Save;window.pt266Save=function(next){return saveCompany('roic',next,next?'valuation':null,null)};
 const oldOpen=window.pt175Open;
 window.pt175Open=function(id,recordId,forcedTicker){
   if(!companyTypes.includes(id))return oldOpen(id,recordId);
   let t=norm(forcedTicker||active());
   if(recordId){let r=rows().find(x=>x.id===recordId);t=rowTicker(r)||t}
   if(!t){let recent=rows().find(r=>companyTypes.includes(r.type)&&rowTicker(r));t=rowTicker(recent)}
   if(t){setActive(t);ensureSession(t);let r=findStep(id,t);recordId=r?.id||null}
   let result=oldOpen(id,recordId);
   setTimeout(()=>{let ed=document.querySelector('#pt175WorksheetEditor .pt175-editor');if(!ed)return;let ti=norm(ed.querySelector('[data-field="ticker"]')?.value||t);if(ti){setActive(ti);ensureSession(ti);decorate(id,ti);prefill(id,ti,ed)}},0);
   return result
 };
 function prefill(id,t,ed){let f=findStep('financials',t),v=findStep('valuation',t),d=findStep('dcf',t),m=findStep('mos',t),r=findStep('roic',t);let set=(k,x)=>{let el=ed.querySelector(`[data-field="${k}"]`);if(el&&(el.value===''||el.value==null)&&x!==undefined&&x!==null&&x!=='')el.value=x};
   set('ticker',t);
   if(id==='roic'){} 
   if(id==='valuation'){}
   if(id==='dcf'){if(f?.derived?.fcf!=null)set('fcf',f.derived.fcf);if(f?.derived?.netDebt!=null)set('netDebt',f.derived.netDebt)}
   if(id==='mos'){if(d?.derived?.base!=null)set('value',d.derived.base);if(v?.values?.price)set('price',v.values.price)}
   if(id==='thesis'){
     let parts=[];if(f?.values?.conclusion)parts.push('Financial evidence: '+f.values.conclusion);if(r?.values?.conclusion)parts.push('Capital quality: '+r.values.conclusion);set('supports',parts.join('\n\n'));
     let vals=[];if(v?.values?.conclusion)vals.push(v.values.conclusion);if(d?.values?.conclusion)vals.push('DCF: '+d.values.conclusion);if(m?.values?.conclusion)vals.push('Margin of safety: '+m.values.conclusion);set('valuation',vals.join('\n\n'));
     let risks=[];if(r?.values?.risk)risks.push(r.values.risk);if(m?.values?.risk)risks.push(m.values.risk);set('challenges',risks.join('\n\n'));if(m?.values?.monitor)set('monitor',m.values.monitor)
   }
   ed.querySelectorAll('input').forEach(x=>x.dispatchEvent(new Event('input',{bubbles:true})))
 }
 // Capture a ticker typed in Step 1 as the active research subject before the first save.
 document.addEventListener('input',e=>{let ed=e.target.closest?.('#pt175WorksheetEditor .pt175-editor');if(!ed||ed.dataset.type!=='financials'||e.target.dataset.field!=='ticker')return;let t=norm(e.target.value);if(t.length>=1)setActive(t)},true);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior!=='function')return;
 const N=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(String(v).replace('%','').replace(/,/g,''));return Number.isFinite(n)?n:null};
 const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
 const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
 function walk(o,fn,seen=new Set()){if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);fn(o);(Array.isArray(o)?o:Object.values(o)).forEach(x=>walk(x,fn,seen))}
 function fundMap(root){
  const out=new Map();
  walk(root,o=>{
   const t=String(o.ticker||o.symbol||'').trim().toUpperCase();
   if(!/^[A-Z][A-Z0-9.-]{0,9}$/.test(t))return;
   const count=N(o.usableTickerCount??o.holdingsCount??o.holdings_count??o.rawHoldingCount);
   const top10=N(o.top10Weight??o.top10_weight??o.topTenWeight??o.topTenWeightPct);
   const period=o.reportPeriod||o.report_period||o.asOf||o.as_of||null;
   let arr=null;
   for(const k of ['holdings','topHoldings','top_holdings','constituents','positions']) if(Array.isArray(o[k])&&o[k].length){arr=o[k];break}
   const old=out.get(t)||{};
   if(count!=null||top10!=null||period||arr)out.set(t,{...old,...o,ticker:t,count:count??old.count,top10:top10??old.top10,period:period||old.period,items:arr||old.items});
  });
  return out;
 }
 function normalizeItems(arr){
  if(!Array.isArray(arr))return [];
  return arr.map(x=>({name:clean(x.name||x.companyName||x.securityName||x.ticker||x.symbol),ticker:clean(x.ticker||x.symbol),weight:N(x.weightPct??x.weight??x.percentWeight??x.portfolioWeightPct??x.fundWeightPct)})).filter(x=>x.name||x.ticker).sort((a,b)=>(b.weight??-1)-(a.weight??-1));
 }
 function row(card,label){return [...card.querySelectorAll('tbody tr')].find(r=>clean(r.children[0]?.textContent).toLowerCase()===label)}
 function patch(){
  const root=window.__ptVerifiedPortfolioLookthrough;if(!root)return;
  const fm=fundMap(root);
  document.querySelectorAll('.pt159-card').forEach(card=>{
   const t=clean(card.querySelector('.pt159-head b')?.textContent).toUpperCase(),f=fm.get(t);if(!f)return;
   const div=row(card,'underlying diversification'),top=row(card,'10 largest holdings');
   if(div&&f.count!=null){div.children[1].textContent=`${Number(f.count).toLocaleString()} holdings`;div.children[2].textContent=f.count>1000?'Broad ownership':f.count>=400?'Broad large-cap set':'More targeted'}
   const items=normalizeItems(f.items),ten=items.slice(0,10);
   let top10=f.top10;
   if(top10==null&&ten.length===10&&ten.every(x=>x.weight!=null))top10=ten.reduce((a,x)=>a+x.weight,0);
   if(top&&top10!=null){
    top.children[1].textContent=`${top10.toFixed(2)}%`;
    top.children[2].textContent=top10>25?'Top-heavy':'More distributed';
    if(ten.length){const d=document.createElement('span');d.className='pt270-topnames';d.innerHTML=ten.map(x=>`${esc(x.ticker||x.name)}${x.weight!=null?` ${x.weight.toFixed(2)}%`:''}`).join(' · ');top.children[1].appendChild(d)}
   }
   const sections=[...card.querySelectorAll('.pt159-section')];
   const ev=sections.find(x=>/EVIDENCE FOR|SUPPORTS/i.test(clean(x.querySelector('small')?.textContent)));
   const ag=sections.find(x=>/EVIDENCE AGAINST|CHALLENGES/i.test(clean(x.querySelector('small')?.textContent)));
   if(ev){const p=ev.querySelector('p');if(p&&f.count!=null){
     if(t==='VTI')p.textContent=`VTI spreads the U.S. core across ${Number(f.count).toLocaleString()} measured underlying holdings. That breadth of underlying ownership directly supports its job as the domestic market foundation.`;
     else if(t==='VOO')p.textContent=`VOO contains ${Number(f.count).toLocaleString()} measured underlying holdings and is designed to represent the large-cap U.S. market through the S&P 500. That directly supports its assigned role as a transparent source of large-company U.S. exposure.`;
   }}
   if(ag&&top10!=null){const p=ag.querySelector('p');if(p){
     if(t==='VTI')p.textContent=`The strongest structural tension is weighting concentration: the 10 largest holdings account for ${top10.toFixed(2)}%. A broad security count therefore does not guarantee evenly distributed economic exposure.`;
     else if(t==='VOO')p.textContent=`VOO is not a total-market fund. With ${top10.toFixed(2)}% in its 10 largest holdings, market-cap weighting can make results unusually dependent on the largest U.S. companies. If another broad U.S. fund is already owned, overlap can also make the sleeve additive in ticker count without adding much new economic exposure.`;
   }}
   const snap=sections.find(x=>/EVIDENCE SNAPSHOT/i.test(clean(x.querySelector('small')?.textContent)));
   if(snap&&f.period){const p=snap.querySelector('p');if(p)p.textContent=`Constituent evidence through ${f.period}. Structural measurements are populated only from verified stored constituent data; unavailable measurements remain unresolved.`}
  });
 }
 window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);patch();setTimeout(patch,500);return r};
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior!=='function')return;
 const N=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(String(v).replace('%','').replace(/,/g,''));return Number.isFinite(n)?n:null};
 const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
 function walk(o,fn,seen=new Set()){if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);fn(o);if(Array.isArray(o))o.forEach(x=>walk(x,fn,seen));else Object.values(o).forEach(x=>walk(x,fn,seen))}
 function backendFunds(){
   const out=new Map(),root=window.__ptVerifiedPortfolioLookthrough;
   walk(root,o=>{
     const t=String(o.ticker||o.symbol||'').trim().toUpperCase();
     if(!/^[A-Z][A-Z0-9.-]{0,9}$/.test(t))return;
     const count=N(o.usableTickerCount??o.holdingsCount??o.holdings_count??o.rawHoldingCount??o.raw_holdings_count);
     const top10=N(o.top10Weight??o.top10_weight??o.top10WeightPct??o.topTenWeight??o.topTenWeightPct);
     const period=o.reportPeriod||o.report_period||o.asOf||o.as_of||null;
     const old=out.get(t)||{};
     if(count!=null||top10!=null||period)out.set(t,{...old,count:count??old.count,top10:top10??old.top10,period:period||old.period});
   });
   // The ETF evidence cache is a verified snapshot source too. Use it only to
   // complete structural fields not returned by portfolio-lookthrough.
   Object.entries(window.PT_ETF_EVIDENCE||{}).forEach(([k,e])=>{
     const t=String(k).toUpperCase(),old=out.get(t)||{};
     const count=N(e?.usableTickerCount??e?.holdingsCount??e?.rawHoldingCount);
     const top10=N(e?.top10Weight??e?.top10WeightPct??e?.topTenWeightPct);
     const period=e?.reportPeriod||e?.asOf||null;
     if(count!=null||top10!=null||period)out.set(t,{...old,count:old.count??count,top10:old.top10??top10,period:old.period||period});
   });
   return out;
 }
 function row(card,label){return [...card.querySelectorAll('tbody tr')].find(r=>clean(r.children[0]?.textContent).toLowerCase()===label)}
 function patch(){
   const fm=backendFunds(); if(!fm.size)return;
   document.querySelectorAll('.pt159-card').forEach(card=>{
     const t=clean(card.querySelector('.pt159-head b')?.textContent).toUpperCase(),f=fm.get(t);if(!f)return;
     const div=row(card,'underlying diversification'),top=row(card,'10 largest holdings');
     if(div&&f.count!=null){div.children[1].textContent=`${Number(f.count).toLocaleString()} holdings`;div.children[2].textContent=f.count>1000?'Broad ownership':f.count>=400?'Broad large-cap set':'More targeted'}
     if(top&&f.top10!=null){top.children[1].textContent=`${f.top10.toFixed(2)}%`;top.children[2].textContent=f.top10>25?'Top-heavy':'More distributed'}
     card.querySelectorAll('.pt159-section').forEach(sec=>{
       const lab=clean(sec.querySelector('small')?.textContent).toUpperCase(),p=sec.querySelector('p');if(!p)return;
       if((lab.includes('EVIDENCE FOR')||lab.includes('SUPPORTS'))&&f.count!=null){
         if(t==='VTI')p.textContent=`VTI spreads the U.S. core across ${Number(f.count).toLocaleString()} measured underlying holdings. That breadth of underlying ownership directly supports its job as the domestic market foundation.`;
         else if(t==='VOO')p.textContent=`VOO contains ${Number(f.count).toLocaleString()} measured underlying holdings and is designed to represent the large-cap U.S. market through the S&P 500. That directly supports its assigned role as a transparent source of large-company U.S. exposure.`;
       }
       if((lab.includes('EVIDENCE AGAINST')||lab.includes('CHALLENGES'))&&f.top10!=null){
         if(t==='VTI')p.textContent=`The strongest structural tension is weighting concentration: the 10 largest holdings account for ${f.top10.toFixed(2)}%. A broad security count therefore does not guarantee evenly distributed economic exposure.`;
         else if(t==='VOO')p.textContent=`VOO is not a total-market fund. With ${f.top10.toFixed(2)}% in its 10 largest holdings, market-cap weighting can make results unusually dependent on the largest U.S. companies. If another broad U.S. fund is already owned, overlap can also make the sleeve additive in ticker count without adding much new economic exposure.`;
       }
     });
   });
 }
 function schedule(){patch();setTimeout(patch,100);setTimeout(patch,600);setTimeout(patch,1400)}
 window.ptGeneratePortfolioPublication=async function(){const r=await prior.apply(this,arguments);schedule();return r};
 const mo=new MutationObserver(()=>{if(window.__ptVerifiedPortfolioLookthrough)patch()});
 setTimeout(()=>{const h=document.getElementById('ptGeneratedReport')||document.getElementById('ptrReportOverlay')||document.getElementById('reportOverlay');if(h)mo.observe(h,{childList:true,subtree:true})},0);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const norm=v=>String(v||'').trim().toUpperCase();
 const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
 function isFund(t){
   t=norm(t);
   try{if(typeof window.ptETFIsEvidenceFund==='function')return !!window.ptETFIsEvidenceFund(t)}catch(_){}
   try{if(window.PT_ETFS?.has?.(t))return true}catch(_){}
   return ['VTI','VOO','VXUS','AVUV','AVDV','QQQM','SCHD','BND','VNQ','GLD'].includes(t);
 }
 function holdings(){
   try{return (typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:norm(x.ticker),weight:Number(x.weight)||0})).filter(x=>x.ticker&&x.weight>0)}catch(_){return []}
 }
 function removeStockFundCards(stocks){
   const set=new Set(stocks.map(x=>x.ticker));
   document.querySelectorAll('.pt159-card').forEach(card=>{
     const t=norm(card.querySelector('.pt159-head b')?.textContent);
     if(set.has(t))card.remove();
   });
   // Remove a Fund Evidence page only when no actual fund card remains on it.
   document.querySelectorAll('.pt150-page').forEach(pg=>{
     if(!/FUND EVIDENCE/i.test(pg.textContent||''))return;
     if(!pg.querySelector('.pt159-card') && !pg.querySelector('.pt158-card'))pg.remove();
   });
 }
 function buildDeepValuePage(stocks){
   if(!stocks.length)return;
   const host=document.querySelector('.pt150-report'); if(!host)return;
   host.querySelectorAll('.pt280-dv-page').forEach(x=>x.remove());
   const pg=document.createElement('section');
   pg.className='pt150-page pt280-dv-page';
   pg.innerHTML=`<div class="pt150-k">DEEP VALUE RESEARCH</div><h2>Company evidence behind the portfolio weight.</h2><p class="pt150-deck">Individual securities are evaluated as companies, not as funds. Portfolio Thesis uses the Deep Value research framework to test financial quality, valuation and the company thesis, then brings that evidence back into the portfolio.</p><div class="ptr-security-intro"><div><div class="ey">DIRECT COMPANY EXPOSURE</div><b>${stocks.reduce((a,x)=>a+x.weight,0).toFixed(0)}% of the portfolio</b><p>These positions add company-specific outcomes and can increase exposure to businesses already owned indirectly through broad funds.</p></div><div><div class="ey">HOW TO READ IT</div><b>Evidence first. Weight second.</b><p>Deep Value evaluates the company. Portfolio weight determines how much that company-specific thesis can affect the total portfolio.</p></div></div><div id="ptPortfolioDVGrid" class="ptr-individual-grid">${stocks.map(x=>`<div class="ptr-individual-card" id="ptPDV-${esc(x.ticker)}"><div class="ptr-security-head"><div class="ptr-individual-top"><b>${esc(x.ticker)}</b><span class="ptr-individual-weight">${x.weight.toFixed(0)}%</span></div></div><div class="ptr-dv-unavailable">Loading Deep Value evidence…</div></div>`).join('')}</div><div class="pt150-foot"><span>PORTFOLIO THESIS · GLOBAL OWNERSHIP. DISCIPLINED BALANCE.</span><b></b></div>`;
   const evidence=[...host.querySelectorAll('.pt150-page')].filter(x=>/FUND EVIDENCE/i.test(x.textContent||''));
   if(evidence.length)evidence[evidence.length-1].insertAdjacentElement('afterend',pg);
   else {const perf=[...host.querySelectorAll('.pt150-page')].find(x=>/What moved the portfolio\./i.test(x.textContent||'')); if(perf)perf.insertAdjacentElement('afterend',pg); else host.appendChild(pg)}
 }
 function renumber(){
   document.querySelectorAll('.pt150-page').forEach((pg,i)=>{
     const b=pg.querySelector('.pt150-foot b,.pti-foot b'); if(b)b.textContent=String(i+1).padStart(2,'0');
   });
 }
 function route(){
   const p=holdings(),stocks=p.filter(x=>!isFund(x.ticker));
   removeStockFundCards(stocks);
   buildDeepValuePage(stocks);
   renumber();
   if(stocks.length && typeof window.ptHydratePortfolioDeepValue==='function'){
     try{Promise.resolve(window.ptHydratePortfolioDeepValue(p)).finally(()=>renumber())}catch(e){console.warn('V280 Deep Value hydration',e)}
   }
 }
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){
   const r=await prior.apply(this,arguments);
   route();
   setTimeout(route,350);
   setTimeout(route,1000);
   return r;
 };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const N=v=>{if(v===null||v===undefined||v==='')return null;const n=Number(String(v).replace(/[%+,]/g,''));return Number.isFinite(n)?n:null};
 const fmt=(v,d=2)=>v==null?'—':`${v>=0?'+':''}${v.toFixed(d)}%`;
 const ticker=o=>String(o?.ticker||o?.symbol||o?.security?.ticker||o?.security?.symbol||'').toUpperCase();
 function deepPeriod(root,aliases){let found=null,seen=new Set();function rec(o){if(found!=null||!o||typeof o!=='object'||seen.has(o))return;seen.add(o);for(const a of aliases){const x=o[a];if(x!==undefined){for(const v of [x?.returnPct,x?.pct,o[a+'Pct'],x?.return,x]){const n=N(v);if(n!=null){found=n;return}}}}for(const v of Object.values(o))rec(v)}rec(root);return found}
 function extract(root){const out={},seen=new Set();function rec(o){if(!o||typeof o!=='object'||seen.has(o))return;seen.add(o);if(!Array.isArray(o)){const t=ticker(o);if(t){const v={m1:deepPeriod(o,['oneMonth','1m','month1']),m3:deepPeriod(o,['threeMonth','3m','month3']),ytd:deepPeriod(o,['ytd','YTD']),y1:deepPeriod(o,['oneYear','1y','year1'])};if(Object.values(v).some(x=>x!=null))out[t]=Object.assign(out[t]||{},v)}}for(const v of Object.values(o))rec(v)}rec(root);return out}
 function isFund(t){return !!window.PT_ETF_EVIDENCE?.[t] || ['VTI','VXUS','AVUV','AVDV','VOO','VT','VEA','VWO','SPY','QQQ','IWM'].includes(t)}
 function patchSummary(){
   const report=document.querySelector('.pt150-report'); if(!report)return;
   const p=(typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:String(x.ticker||'').toUpperCase(),weight:N(x.weight)||0})).filter(x=>x.ticker&&x.weight>0);
   const direct=p.filter(x=>!isFund(x.ticker)); if(!direct.length)return;
   const first=report.querySelector('.pt150-page'); const metrics=first?.querySelector('.pt150-metrics'); if(!metrics)return;
   const cards=[...metrics.querySelectorAll('.pt150-metric')];
   const target=cards.find(c=>/largest fund overlap/i.test(c.querySelector('small')?.textContent||'')); if(!target)return;
   const w=direct.reduce((a,x)=>a+x.weight,0);
   target.querySelector('small').textContent='Direct securities';
   target.querySelector('b').textContent=`${w.toFixed(w%1?1:0)}%`;
   target.querySelector('em').textContent=`${direct.length} direct ${direct.length===1?'position':'positions'}`;
 }
 async function fetchMissingPerformance(){
   const p=(typeof getPortfolio==='function'?getPortfolio():[]).map(x=>({ticker:String(x.ticker||'').toUpperCase(),weight:N(x.weight)||0})).filter(x=>x.ticker&&x.weight>0);
   let map=extract(window.__pt151?.securityPerf);
   const missing=p.filter(x=>!map[x.ticker]);
   if(missing.length&&window.ptSupabase?.functions?.invoke){
     for(const h of missing){
       try{const r=await window.ptSupabase.functions.invoke('security-performance',{body:{tickers:[h.ticker],ticker:h.ticker,symbol:h.ticker}});if(!r?.error)map=Object.assign(map,extract(r?.data))}catch(_){}
     }
   }
   return {p,map};
 }
 function patchPerformance(p,map){
   const page=[...document.querySelectorAll('.pt150-page')].find(x=>/What moved the portfolio\./i.test(x.textContent||'')); const table=page?.querySelector('.pt150-table'); if(!table)return;
   let sums={m1:0,m3:0,ytd:0,y1:0},weights={m1:0,m3:0,ytd:0,y1:0};
   for(const tr of table.querySelectorAll('tbody tr')){
     const td=[...tr.children]; if(td.length<6)continue; const t=(td[0].textContent||'').trim().toUpperCase(); if(t==='PORTFOLIO')continue;
     const h=p.find(x=>x.ticker===t),v=map[t]||{},w=h?.weight||0;
     if(v.m1!=null)td[2].textContent=fmt(v.m1); if(v.m3!=null)td[3].textContent=fmt(v.m3); if(v.ytd!=null)td[4].textContent=fmt(v.ytd); if(v.y1!=null)td[5].textContent=fmt(v.y1);
     if(td[6]&&v.m1!=null)td[6].textContent=`${v.m1*w/100>=0?'+':''}${(v.m1*w/100).toFixed(2)} pts`;
     for(const k of ['m1','m3','ytd','y1'])if(v[k]!=null){sums[k]+=v[k]*w/100;weights[k]+=w}
   }
   const total=[...table.querySelectorAll('tbody tr')].find(tr=>(tr.children[0]?.textContent||'').trim().toUpperCase()==='PORTFOLIO');
   if(total){const td=[...total.children];for(const [i,k] of [[2,'m1'],[3,'m3'],[4,'ytd'],[5,'y1']])if(weights[k]>=99.5)td[i].textContent=fmt(sums[k]);if(td[6]&&weights.m1>=99.5)td[6].textContent=`${sums.m1>=0?'+':''}${sums.m1.toFixed(2)} pts`}
   const old=page.querySelector('.pt195-impact'); if(old)old.remove();
   /* Re-run the existing visual builder now that every available security row is populated. */
   const evt=new Event('pt-v288-performance-ready');document.dispatchEvent(evt);
 }
 const prior=window.ptGeneratePortfolioPublication;
 if(typeof prior==='function')window.ptGeneratePortfolioPublication=async function(){
   const r=await prior.apply(this,arguments);
   patchSummary();
