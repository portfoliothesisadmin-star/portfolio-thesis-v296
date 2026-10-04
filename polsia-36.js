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
