      heading.insertAdjacentElement("afterend",box);
    }
  }

  const obs=new MutationObserver(()=>requestAnimationFrame(cleanComparison));
  obs.observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener("DOMContentLoaded",()=>requestAnimationFrame(cleanComparison));
  setTimeout(cleanComparison,250);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 function nearZero(v){return v!=null && Number.isFinite(Number(v)) && Math.abs(Number(v))<0.005}
 function refine(){
   const body=document.getElementById("ptV210ReviewBody"); if(!body)return;
   const sec=body.querySelector(".pt217-compare"); if(!sec)return;
   sec.querySelectorAll(".pt219-status").forEach(x=>x.remove());
   const deltas=[...sec.querySelectorAll(".pt217-delta")].map(x=>{const m=(x.textContent||'').match(/[+-]?\d+(?:\.\d+)?/);return m?Number(m[0]):null}).filter(v=>v!=null);
   const summary=[...sec.querySelectorAll(".pt217-summary b")].map(x=>{const m=(x.textContent||'').match(/[+-]?\d+(?:\.\d+)?/);return m?Number(m[0]):null}).filter(v=>v!=null);
   if(!(deltas.length && deltas.every(nearZero) && summary.every(nearZero)))return;
   const intro=sec.querySelector(':scope > p'); if(intro)intro.style.display='none';
   const cards=sec.querySelector('.pt217-summary'); if(cards)cards.style.display='none';
   const table=sec.querySelector('.pt217-table'); if(table)table.style.display='none';
   const old=sec.querySelector('.pt218-nochange'); if(old)old.remove();
   const status=document.createElement('div'); status.className='pt219-status';
   status.innerHTML='<small>Performance comparison</small><b>No meaningful change.</b><p>Price, 1-month return and weighted contribution are effectively unchanged from the prior saved review.</p>';
   const h=sec.querySelector('h2'); if(h)h.insertAdjacentElement('afterend',status); else sec.prepend(status);
 }
 const obs=new MutationObserver(()=>requestAnimationFrame(refine));
 obs.observe(document.documentElement,{subtree:true,childList:true});
 document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(refine));
 setTimeout(refine,300);
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
 const core=window.analyzePortfolio;
 if(typeof core!=="function") return;
 function showStep(n){
   document.querySelectorAll('#ptResearchTransition .pt-research-step').forEach(el=>{
     const k=Number(el.dataset.step); el.classList.toggle('done',k<n); el.classList.toggle('active',k===n);
   });
 }
 function openResearch(){const el=document.getElementById('ptResearchTransition');el.classList.add('pt-open');el.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';showStep(1)}
 function closeResearch(){const el=document.getElementById('ptResearchTransition');el.classList.remove('pt-open');el.setAttribute('aria-hidden','true');document.body.style.overflow=''}
 const frame=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 window.analyzePortfolio=async function(){
   const p=(typeof getPortfolio==='function'?getPortfolio():[]);
   if(!p.length){alert('Add at least one security and allocation first.');return}
   openResearch();
   try{
     await frame(); showStep(2); await frame();
     // Existing portfolio analysis performs classification, allocation and concentration work.
     core();
     showStep(3); await frame();
     // Relationship/evidence layers used by the publication are allowed to resolve before rendering.
     if(typeof window.ptLoadPortfolioETFEvidence==='function'){
       try{await window.ptLoadPortfolioETFEvidence(p)}catch(e){console.warn('ETF evidence load:',e)}
     }
     showStep(4); await frame();
     showStep(5); await frame();
     if(typeof window.ptGeneratePortfolioPublication==='function'){
       await window.ptGeneratePortfolioPublication();
       closeResearch();
     }else{
       closeResearch();
       document.getElementById('analysisPanel')?.scrollIntoView({behavior:'smooth',block:'start'});
     }
   }catch(e){
     console.error('Portfolio analysis transition failed',e); closeResearch();
     alert('The portfolio was preserved, but the report could not finish generating. Please try again.');
   }
 };
})();


/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */


(function(){
  const HEADER_GAP = 18;

  function headerBottom(){
    const h=document.querySelector('header');
    return h ? Math.ceil(h.getBoundingClientRect().bottom) : 0;
  }

  function pt232LandOn(el){
    if(!el) return;
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        const y = window.scrollY + el.getBoundingClientRect().top - headerBottom() - HEADER_GAP;
        window.scrollTo({top:Math.max(0,y),behavior:'auto'});
      });
    });
  }
  window.pt232LandOn = pt232LandOn;

  /* Catch all section navigation, including older showSection callers. */
  const oldShow = window.showSection;
  if(typeof oldShow === 'function'){
    window.showSection = function(id){
      const r=oldShow.apply(this,arguments);
      const el=document.getElementById(id);
      if(el) pt232LandOn(el);
      return r;
    };
  }

  /* Library has its own opener. Preserve its data refresh, then correct landing. */
  const oldLib=window.ptOpenLibrary;
  if(typeof oldLib === 'function'){
    window.ptOpenLibrary=async function(){
      const r=await oldLib.apply(this,arguments);
      pt232LandOn(document.getElementById('library'));
      return r;
    };
  }

  /* Any in-page navigation link/button aimed at a section gets the same correction. */
  document.addEventListener('click',function(e){
    const a=e.target.closest('a[href^="#"]');
    if(!a) return;
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
