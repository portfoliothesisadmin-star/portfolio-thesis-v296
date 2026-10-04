

/* ===== ORIGINAL SCRIPT BLOCK SEPARATOR ===== */



const LENS_CONTENT={
 structure:{
  eyebrow:"01 · STRUCTURE",title:"What job does each holding have?",
  intro:"Portfolio structure is the architecture of the portfolio: what anchors it, what diversifies it, and what represents a deliberate tilt or satellite position.",
  asks:"If every holding had to justify its place, what role would it play? A strong structure makes the purpose of each position visible rather than treating every ticker as interchangeable.",
  look:["A broad core that carries most of the portfolio","Diversifiers that add genuinely different exposure","Tilts or satellites sized intentionally","Holdings whose role is unclear or duplicated"],
  interpret:"A portfolio does not need one universal structure. The useful question is whether its structure matches the investor's stated objective and whether each position has a defensible role.",
  mistake:"Assuming that owning more tickers automatically creates a better structure. Several funds can perform essentially the same job.",
  example:"A broad U.S. market fund might serve as a core, an international fund as a diversifier, and a small-value fund as a deliberate factor tilt.",
  apply:"The Builder classifies holdings by role so you can see the structure created by your actual allocation.",target:"aStructure"
 },
 overlap:{
  eyebrow:"02 · OVERLAP & CONCENTRATION",title:"How much of the same exposure do you really own?",
  intro:"Different ticker symbols can hide the same companies, sectors, countries or risk factors. This lens looks beneath the labels.",
  asks:"Are multiple holdings actually diversifying the portfolio, or are they stacking exposure to the same underlying sources of return and risk?",
  look:["Repeated top holdings across funds","Sector or industry weight that dominates the portfolio","Single-company exposure held directly and again through funds","Factor, geography or style bets that overlap"],
  interpret:"Overlap is not automatically bad. It becomes important when it creates a larger exposure than the investor intended or understood.",
  mistake:"Counting the number of funds instead of examining what those funds own.",
  example:"Holding a total-market ETF, an S&P 500 ETF and a large-cap growth ETF can create substantial repeated exposure to the same mega-cap companies.",
  apply:"Use your portfolio analysis to identify where multiple positions may be doing the same job or increasing concentration.",target:"aDiversification"
 },
 durability:{
  eyebrow:"03 · THESIS DURABILITY",title:"Did the investment thesis change—or only the price?",
  intro:"Durability separates evidence about the investment from the emotional impact of market movement.",
  asks:"What facts originally supported the position, and which new facts would be meaningful enough to weaken, strengthen or replace that argument?",
  look:["Changes in business or fund fundamentals","Changes in the reason the holding was purchased","Structural changes to an asset's exposure","Evidence that contradicts the original assumptions"],
  interpret:"Price movement can prompt a review, but it is not itself proof that the thesis changed. The evidence behind the thesis is what matters.",
  mistake:"Rewriting the thesis after every rally or decline so that the story always matches the latest price.",
  example:"A 15% decline with unchanged fundamentals is different from a decline accompanied by deteriorating cash generation, leverage and competitive position.",
  apply:"Save a thesis snapshot and compare later information against the reasoning you recorded—not merely against the old price.",target:"aBehavior"
 },
 risk:{
  eyebrow:"04 · RISK & VOLATILITY",title:"What could hurt the portfolio—and how much would it matter?",
  intro:"Risk is broader than day-to-day price movement. This lens considers the size, source and consequence of the portfolio's exposures.",
  asks:"Which positions or shared exposures could create a meaningful loss, and is that risk intentional, diversified and tolerable over the intended holding period?",
  look:["Large single-security or sector weights","Highly correlated holdings","Leverage, credit or business-specific risks","Drawdowns that could conflict with the investor's time horizon"],
  interpret:"Volatility describes movement; risk asks what can permanently impair the plan or force an investor to abandon it at the wrong time.",
  mistake:"Treating the least volatile asset as automatically the safest without considering inflation, duration, credit, concentration or opportunity risk.",
  example:"A 10% satellite position can be volatile without dominating the portfolio; the same exposure at 45% can change the portfolio's entire risk profile.",
  apply:"The Builder shows concentration and diversification in the context of the whole allocation rather than judging positions in isolation.",target:"aConcentration"
 },
 horizon:{
  eyebrow:"05 · TIME HORIZON",title:"Does the portfolio fit the time available?",
  intro:"An investment can be reasonable for one horizon and poorly matched to another. Time changes which risks matter most.",
  asks:"When might this money be needed, and does each major holding have enough time for its investment case to play out?",
  look:["Near-term spending needs versus long-term capital","Volatile assets tied to short deadlines","Long-duration theses that require patience","Whether the allocation can survive a prolonged drawdown"],
  interpret:"A longer horizon can improve the ability to tolerate volatility, but it does not make valuation, concentration or a weak thesis irrelevant.",
  mistake:"Using 'long term' as a reason to ignore evidence or assuming every risky asset becomes safe if held long enough.",
  example:"Equity volatility may be tolerable for money intended for retirement decades away but inappropriate for money required for a known purchase next year.",
  apply:"Use the Builder's portfolio interpretation together with your own goal date to judge whether the allocation and thesis are aligned.",target:"aThesis"
 },
 takeaways:{
  eyebrow:"06 · ACTIONABLE TAKEAWAYS",title:"Turn analysis into a disciplined review process.",
  intro:"The final lens converts observations into a short list of things worth monitoring, investigating or deliberately leaving alone.",
  asks:"What deserves attention now, what should be monitored over time, and what is simply normal market noise that does not require a portfolio change?",
  look:["Exposures outside intended ranges","A thesis assumption that needs new evidence","Concentration that deserves deliberate review","Specific conditions that would trigger another review"],
  interpret:"An actionable takeaway does not have to mean buy or sell. Often the disciplined action is to research, rebalance, monitor a defined variable, or make no change.",
  mistake:"Feeling that every analysis must end with a transaction.",
  example:"A useful takeaway might be: 'No allocation change; review international weight at the next scheduled rebalance and monitor whether the small-value tilt remains intentional.'",
  apply:"Run the six-part analysis, then save a snapshot so future reviews can compare what changed in the portfolio and in your reasoning.",target:"thesisReview"
 }
};
let activeLens="structure";
function openLens(which){
 activeLens=which;
 const d=LENS_CONTENT[which]; if(!d)return;
 document.getElementById("lensEyebrow").textContent=d.eyebrow;
 document.getElementById("lensTitle").textContent=d.title;
 document.getElementById("lensIntro").textContent=d.intro;
 document.getElementById("lensAsks").textContent=d.asks;
 document.getElementById("lensLook").innerHTML=d.look.map(x=>`<li>${x}</li>`).join("");
 document.getElementById("lensInterpret").textContent=d.interpret;
 document.getElementById("lensMistake").textContent=d.mistake;
 document.getElementById("lensExample").textContent=d.example;
 document.getElementById("lensApply").textContent=d.apply;
 const s=document.getElementById("lensLearning"); s.classList.add("active");
 s.scrollIntoView({behavior:"smooth",block:"start"});
}
function closeLens(){
 document.getElementById("lensLearning").classList.remove("active");
 document.getElementById("sixLenses").scrollIntoView({behavior:"smooth",block:"start"});
}
function applyLens(){
 const d=LENS_CONTENT[activeLens], target=document.getElementById(d.target);
 if(target && target.textContent.trim()) target.scrollIntoView({behavior:"smooth",block:"center"});
 else document.getElementById("builder").scrollIntoView({behavior:"smooth",block:"start"});
}

const RESEARCH_PROFILES={
 VTI:{type:"ETF",role:"Core",exposure:"Broad U.S. equity market",why:"A single-fund way to own large, mid and small U.S. public companies across sectors.",relationships:"Often overlaps heavily with S&P 500 and U.S. large-cap funds because the largest companies dominate market-cap weighting.",questions:["Is this intended to be the U.S. core?","Are other U.S. funds adding a distinct exposure or mostly repeating VTI?","Is the U.S. weight consistent with the portfolio thesis?"]},
 VOO:{type:"ETF",role:"Core",exposure:"U.S. large-cap equities / S&P 500",why:"Tracks the large-company segment of the U.S. market and can serve as a simple U.S. equity core.",relationships:"Substantial overlap with total-market funds such as VTI; adding both changes weights more than it adds new companies.",questions:["Why use large-cap only instead of the total market?","Does another U.S. fund duplicate the same mega-cap exposure?","Is the concentration intentional?"]},
 VXUS:{type:"ETF",role:"Diversifier",exposure:"Developed and emerging markets outside the U.S.",why:"Adds broad non-U.S. equity exposure across countries, currencies and companies.",relationships:"Complements a U.S.-only core; may overlap with other international or global funds.",questions:["What role should international equities play?","Is there additional international exposure elsewhere?","Can the thesis tolerate long periods when U.S. and non-U.S. markets diverge?"]},
 AVUV:{type:"ETF",role:"Tilt",exposure:"U.S. small-cap value",why:"Adds a deliberate small-company/value-oriented factor tilt rather than simply expanding ticker count.",relationships:"Some companies can overlap with broad U.S. funds, but the weighting and selection create a distinct factor exposure.",questions:["Is the factor tilt intentional?","What allocation is large enough to matter but small enough to hold through underperformance?","What evidence would actually change the factor thesis?"]},
 AVDV:{type:"ETF",role:"Tilt",exposure:"International developed small-cap value",why:"Adds small/value exposure outside the U.S., combining geography and factor tilts.",relationships:"Can complement VXUS while deliberately overweighting a narrower segment already represented within broad international markets.",questions:["Is the portfolio intentionally tilting both U.S. and international small value?","How does this interact with VXUS?","Can the allocation withstand extended factor underperformance?"]},
 QQQM:{type:"ETF",role:"Tilt",exposure:"Nasdaq-100 large-cap growth-heavy exposure",why:"Creates a concentrated tilt toward large non-financial Nasdaq-listed companies.",relationships:"Often overlaps materially with broad U.S. funds through mega-cap technology and growth companies.",questions:["Is the added growth/technology concentration intentional?","Which top holdings are already owned through the core?","What portfolio role does this serve beyond recent performance?"]},
 SCHD:{type:"ETF",role:"Income / Tilt",exposure:"U.S. dividend-oriented equities",why:"Targets dividend-paying U.S. companies using quality and dividend screens.",relationships:"Can overlap a broad U.S. core while changing sector, style and income characteristics.",questions:["Is income the objective or is total return the objective?","How much overlaps the U.S. core?","Are dividend screens creating unintended sector tilts?"]},
 BND:{type:"ETF",role:"Bond / Diversifier",exposure:"Broad U.S. investment-grade bonds",why:"Adds fixed-income exposure with a different return and volatility profile from equities.",relationships:"Typically diversifies equity-heavy portfolios, though interest-rate and credit risks remain.",questions:["What job should bonds perform: stability, income, liquidity or rebalancing capital?","Does duration fit the time horizon?","Is the bond allocation large enough to affect portfolio behavior?"]},
 VNQ:{type:"ETF",role:"Tilt",exposure:"U.S. listed real estate / REITs",why:"Overweights listed real estate relative to a broad equity market allocation.",relationships:"REITs already appear inside broad U.S. market funds, so a separate position is an intentional sector overweight.",questions:["Why overweight real estate?","How much REIT exposure already exists in the core?","How would rate sensitivity and sector concentration affect the thesis?"]},
 GLD:{type:"ETF",role:"Diversifier",exposure:"Gold bullion exposure",why:"Provides commodity exposure whose drivers differ from operating companies and bonds.",relationships:"Does not produce business earnings or cash flow like equities; its portfolio role should therefore be explicit.",questions:["Is gold intended as diversification, inflation sensitivity or crisis insurance?","What allocation is meaningful?","What would cause the strategic role to change?"]},
 AAPL:{type:"Stock",role:"Individual stock",exposure:"Single-company equity",why:"A direct company position creates company-specific upside and downside beyond broad-market ownership.",relationships:"Commonly held inside broad U.S. and large-cap index funds, so a direct position increases existing exposure.",questions:["How much AAPL is already owned indirectly through funds?","What company fundamentals support the thesis?","What evidence would invalidate the thesis?"]},
 MSFT:{type:"Stock",role:"Individual stock",exposure:"Single-company equity",why:"A direct company position creates concentrated company-specific exposure.",relationships:"Commonly a major holding of broad U.S., S&P 500 and growth-oriented funds.",questions:["How large is total direct plus indirect exposure?","What assumptions are embedded in the thesis?","Which fundamental developments deserve monitoring?"]}
};
function researchTicker(t){document.getElementById("researchTicker").value=t;runResearch();}
function runResearch(){
  const el=document.getElementById("researchTicker"),t=el.value.trim().toUpperCase(),out=document.getElementById("researchResult");
  out.classList.add("show");
  if(!t){out.innerHTML="<b>Enter a ticker to begin.</b>";return;}
  const d=DB[t],p=RESEARCH_PROFILES[t];
  if(!d||!p){
    out.innerHTML=`<div class="eyebrow">${t}</div><h3 style="margin:5px 0">Research profile not yet available</h3><p class="muted">The prototype does not have a verified local profile for this security. Production search will resolve the security and current data rather than inventing an analysis.</p><div class="research-foot"><button class="smallbtn" onclick="addWatch('${t}')">＋ Add to Watchlist</button></div>`;
    return;
  }
  out.innerHTML=`<div class="research-head"><div><div class="eyebrow">${p.type} RESEARCH PROFILE</div><div class="research-ticker">${t}</div><div>${d[0]}</div><span class="research-role">${p.role}</span></div></div>
