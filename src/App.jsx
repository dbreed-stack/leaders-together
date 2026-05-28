import { useState, useEffect, useRef } from "react";

// ─── Brand ────────────────────────────────────────────────────────────────────
const B = {
  navy:"#1C2B3A", slate:"#2E4057", teal:"#3D7A6E", tealLt:"#5FA899",
  stone:"#8B8378", cream:"#F5F2EE", charcoal:"#3A3530", mist:"#E8E4DF",
  white:"#FFFFFF", error:"#C0574A", warn:"#C8843A", bronze:"#C17F3A",
};

const S = {
  app:{ minHeight:"100vh", background:B.cream, fontFamily:"'DM Sans',sans-serif", color:B.charcoal },
  header:{ background:B.navy, padding:"1rem 2rem", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 12px rgba(28,43,58,0.18)" },
  wordmark:{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:B.white, letterSpacing:"0.05em", lineHeight:1 },
  tagline:{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.45)", fontWeight:300, marginTop:3 },
  badge:(c=B.teal)=>({ background:c, color:B.white, fontSize:11, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", padding:"4px 12px", borderRadius:100 }),
  card:{ background:B.white, borderRadius:12, border:`0.5px solid ${B.mist}`, boxShadow:"0 2px 16px rgba(28,43,58,0.07)", padding:"2rem", marginBottom:"1.25rem" },
  container:{ maxWidth:680, margin:"0 auto", padding:"2rem 1.25rem 4rem" },
  containerWide:{ maxWidth:980, margin:"0 auto", padding:"2rem 1.25rem 4rem" },
  h1:{ fontFamily:"'Cormorant Garamond',serif", fontSize:34, fontWeight:600, color:B.navy, lineHeight:1.15, marginBottom:"0.5rem" },
  h2:{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:400, fontStyle:"italic", color:B.navy, marginBottom:"0.75rem" },
  h3:{ fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:500, letterSpacing:"0.18em", textTransform:"uppercase", color:B.stone, marginBottom:"0.5rem" },
  body:{ fontSize:15, lineHeight:1.75, color:B.slate, fontWeight:300 },
  label:{ fontSize:13, fontWeight:500, color:B.charcoal, display:"block", marginBottom:6 },
  input:{ width:"100%", padding:"10px 14px", borderRadius:6, border:`1.5px solid ${B.mist}`, fontSize:14, fontFamily:"'DM Sans',sans-serif", background:B.white, color:B.charcoal, outline:"none", boxSizing:"border-box" },
  textarea:{ width:"100%", padding:"12px 14px", borderRadius:6, border:`1.5px solid ${B.mist}`, fontSize:14, fontFamily:"'DM Sans',sans-serif", background:B.white, color:B.charcoal, outline:"none", boxSizing:"border-box", resize:"vertical", minHeight:130, lineHeight:1.65 },
  btnPrimary:{ background:B.navy, color:B.white, border:"none", padding:"11px 24px", borderRadius:5, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer" },
  btnTeal:{ background:B.teal, color:B.white, border:"none", padding:"11px 24px", borderRadius:5, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer" },
  btnBronze:{ background:B.bronze, color:B.white, border:"none", padding:"11px 24px", borderRadius:5, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer" },
  btnOutline:{ background:"transparent", color:B.navy, border:`1.5px solid ${B.navy}`, padding:"10px 24px", borderRadius:5, fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", cursor:"pointer" },
  btnSmall:{ background:B.navy, color:B.white, border:"none", padding:"7px 14px", borderRadius:4, fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer" },
  divider:{ borderTop:`1px solid ${B.mist}`, margin:"1.25rem 0" },
  errTxt:{ fontSize:12, color:B.error, marginTop:4 },
  warnBox:{ background:"#FDF6EC", border:`1.5px solid ${B.warn}`, borderRadius:8, padding:"0.85rem 1rem", marginBottom:"1rem" },
  pill:(c)=>({ display:"inline-block", padding:"3px 11px", borderRadius:100, fontSize:11, fontWeight:500, background:c, color:B.white, letterSpacing:"0.06em" }),
};

const MIN_QUAL_LENGTH = 120;
const WARN_QUAL_LENGTH = 150;

// ─── Assessment Categories ────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id:"self", label:"Personal Leadership & Self-Awareness", color:B.navy,
    likert:[
      "I can clearly identify which parts of my role energize me and which parts drain me.",
      "I intentionally structure my schedule to spend the majority of my time doing work that aligns with my natural strengths.",
      "When I have been spending too much time on draining tasks, I notice the effect on my leadership before it starts to impact my team.",
      "I have an honest, clear picture of how balanced and healthy I currently feel across the major areas of my life (work, relationships, purpose, finances, etc.).",
      "When I am feeling stressed or depleted, I address the root cause rather than pushing through and hoping it resolves on its own.",
      "I regularly reflect on my own behavior and tendencies to understand how they affect the people I lead.",
      "I can identify specific patterns in my thinking and actions that consistently produce negative outcomes for me or my team.",
      "I lead with the same level of intentionality at home and in the community as I do at work.",
      "I have enough self-awareness to recognize when my blind spots are affecting my decision making.",
      "I actively work to improve my emotional intelligence and how I connect with and impact the people around me.",
      "I am able to mentally disconnect from work when I am in personal or family contexts so that I can be fully present.",
      "When I face a significant challenge or growth opportunity, I use a structured approach to process it rather than reacting impulsively.",
    ],
    qualitative:[
      { question:"How are you actively managing your workload so that you spend a proper balance of time on the responsibilities you are good at and that energize you, versus the responsibilities that are harder and drain you? Are you able to see the difference and lead yourself through it? Please use an example of what this currently looks like within your leadership.", rubric:"Ability to name specific tasks in each category. Awareness that challenging tasks are necessary for growth. Recognition that avoiding all difficulty is unhealthy. A candid, self-aware answer with a real example rather than a polished performance." },
      { question:"Walk through a recent period when you felt off balance or under significant personal stress. How did it affect your leadership, and what did you do — or what could you have done differently — to protect your team from that impact?", rubric:"Honest identification of the source of stress. A clear link between personal health and leadership behavior. Ownership of impact on others. A practical corrective response." },
    ],
  },
  {
    id:"voice", label:"Leadership Style, Communication & Leadership Awareness", color:B.slate,
    likert:[
      "I know my personality style and understand how it influences the way I communicate and process information within my leadership.",
      "I am aware of how people on my team actually experience me when I communicate, not just how I intend to come across.",
      "I can clearly articulate the natural strengths my personality and communication style bring to a team setting.",
      "I am aware of the negative patterns or reactions I default to when I am under stress or feel threatened.",
      "I know what specific situations or behaviors tend to push me toward my worst communication tendencies, and I have strategies to manage them.",
      "I adjust how I communicate based on the personality and communication preferences of the person I am speaking with.",
      "I actively create space in meetings and conversations for quieter or less assertive team members to contribute.",
      "I use active listening consistently — giving full attention, asking clarifying questions, and reflecting back what I hear before responding.",
      "I am skilled at delivering difficult messages clearly without it coming across as a personal attack.",
      "I understand which communication styles I default to (direct, relational, visionary, detailed) and which ones I avoid or struggle with.",
      "When conflict arises, I can usually trace it back to a communication issue and address the root cause rather than just the surface tension.",
      "I have been transparent with my team about my communication tendencies and how they can best work with me.",
    ],
    qualitative:[
      { question:"Describe your natural communication and leadership style at its best, and then describe what it looks like when it is working against you. What kinds of situations bring out your worst tendencies, and what do you do to manage them?", rubric:"Accurate and specific self-description. Named triggers and behavioral examples. A demonstrated strategy for interrupting negative patterns. Openness to how others experience them." },
      { question:"Think of a recent communication breakdown with a team member. What happened, what was your role in it, and what would you do differently?", rubric:"Ownership of their part in the breakdown. Application of self-awareness to explain the dynamic. A concrete and specific alternative approach. Recognition that different people require different communication strategies." },
    ],
  },
  {
    id:"culture", label:"Support, Challenge & Team Culture", color:B.teal,
    likert:[
      "I consistently provide both strong support and clear challenge to the people I lead, rather than defaulting to one or the other.",
      "I can identify which team members I tend to go too easy on and which I tend to push too hard, and I actively work to recalibrate.",
      "I hold people accountable in a way that is firm and clear without being demeaning or damaging the relationship.",
      "My team would say that I am genuinely invested in their success — they trust that my feedback and expectations come from care for their growth.",
      "I address problems and underperformance directly rather than avoiding conflict or hoping issues resolve on their own.",
      "I create an environment where team members feel safe to share honest feedback, ask hard questions, and admit mistakes without fear.",
      "When gossip or unproductive conflict surfaces on my team, I address it quickly and directly rather than allowing it to spread.",
      "I tailor my level of encouragement and accountability based on the individual needs and experience of each team member.",
      "I recognize when my own fear of losing control or status is influencing my behavior, and I correct it before it damages trust.",
      "My default tendency leans toward empowering my team rather than micromanaging or leaving them without direction.",
      "I consistently model the standard I expect from my team rather than asking them to do things I am unwilling to do myself.",
      "I am appropriately transparent and vulnerable with my team, which builds psychological safety and genuine trust.",
    ],
    qualitative:[
      { question:"Where do you naturally fall on the spectrum between giving too much support (avoiding hard conversations) and giving too much challenge (pushing without enough encouragement)? How does your natural tendency show up in real situations with your team, and what does it look like when you get the balance right?", rubric:"Honest self-assessment. A named real tendency with specific examples. Understanding the right balance looks different for each team member. Practical language about how they recalibrate." },
      { question:"Describe a time when gossip, drama, or unproductive conflict affected your team. How did you handle it, and looking back, is there anything you would have done differently?", rubric:"Ownership if they contributed to or allowed the problem. Recognition that the leader models direct resolution. Practical description of redirecting people to the source. Understanding that unaddressed conflict is a leadership failure." },
    ],
  },
  {
    id:"coaching", label:"Coaching & Developing Others", color:B.tealLt,
    likert:[
      "I have a clear and intentional plan for developing each person on my team toward their next level of growth.",
      "I invest regular, dedicated time in development conversations with my team members, separate from operational check-ins.",
      "I delegate tasks and responsibilities in a way that intentionally stretches and develops my team members.",
      "Before handing off work, I set clear expectations around standards, timelines, and scope so the person knows what success looks like.",
      "I adapt my coaching approach based on the experience level and readiness of each individual.",
      "I give feedback that is timely, specific, and actionable rather than vague or delayed.",
      "When a team member resists feedback or pushes back on development, I have strategies to address the resistance.",
      "I use a consistent framework or approach when having development conversations.",
      "I can distinguish between underperformance caused by a lack of skill, motivation, or clarity, and I respond to each differently.",
      "I actively identify team members who are ready for more responsibility and take steps to advance their growth.",
      "I develop my team toward independence and good judgment rather than creating reliance on my involvement.",
      "My team would describe our development conversations as encouraging and forward-focused rather than critical or discouraging.",
    ],
    qualitative:[
      { question:"Walk me through how you currently develop the people on your team. What does a development conversation look like — how do you prepare, what approach do you use, and how do you follow up? Be honest about what is working and where you see gaps.", rubric:"Evidence of intentionality and structure. A repeatable approach. Awareness of each team member as an individual. Honest acknowledgment of where the current approach falls short." },
      { question:"Think of a team member who has been difficult to develop or who has not responded to your coaching. What do you believe was the root cause of the difficulty, and how would you approach it differently if you could do it again?", rubric:"A coaching mindset rather than blame. Diagnostic thinking about skill, motivation, clarity, or fit. Evidence of the leader taking partial responsibility. A realistic and specific alternative approach." },
    ],
  },
  {
    id:"influence", label:"Influence, Trust & Organizational Health", color:B.charcoal,
    likert:[
      "I am intentional about building trust with each team member through consistent character, demonstrated competence, genuine care, and reliable follow-through.",
      "I can identify which trust-building behaviors I do well naturally and which ones I tend to undermine without realizing it.",
      "My team would describe me as consistent — my values are visible in my decisions and my behavior is predictable under pressure.",
      "I invest in relationships with my team members before focusing on performance, understanding that people perform better for leaders they trust.",
      "I am aware of when I am acting out of self-interest or insecurity and I actively resist letting those impulses damage my team relationships.",
      "When team performance is struggling, I can identify the organizational or cultural root causes rather than only addressing individual behaviors.",
      "I communicate proactively when plans, priorities, or expectations change so my team is never left uncertain about direction.",
      "I share information with my team in a way that is honest and transparent while being thoughtful about timing and context.",
      "When leading my team through change, I address the reasons people resist rather than forcing compliance.",
      "I regularly assess the overall health of our team culture and take deliberate steps to improve it.",
      "My team has shared language and agreed-upon norms for how we communicate, give feedback, and hold one another accountable.",
      "I measure success not only by outcomes and productivity but also by whether my team is growing, healthy, and operating near their full potential.",
    ],
    qualitative:[
      { question:"Describe the current state of trust on your team. Where is it strong, and where is it fractured or underdeveloped? What specific behaviors or decisions — including your own — have contributed to either outcome, and what are you actively doing to strengthen it?", rubric:"Honest and specific assessment. Willingness to name their own role in any trust deficits. Reference to multiple dimensions of trust. A concrete action plan." },
      { question:"Describe how you would address a performance issue with a team member in a way that is corrective but not punitive. Walk through the process from identifying the problem through to resolution.", rubric:"A diagnostic approach. A genuine 'I am for this person' mindset. A structured conversation process with preparation, clear communication, and a defined path forward. Understanding of when coaching vs. harder accountability is required." },
    ],
  },
];

// ─── Training principles embedded per category (from workbook, no brand names) ─
const CATEGORY_PRINCIPLES = {
  self: `Key training principles for this category: Leaders must know their natural strengths and their draining tasks, aiming for roughly 70% of time on energizing work while accepting that 30% on harder tasks is necessary for growth. A leader who avoids all challenge stops growing. True self-awareness requires a repeatable process: name the tendency, trace its effect on your team, intercept it, and build a new pattern. We never graduate from this work. Personal health (physical, emotional, relational) directly drives leadership quality. When a leader is depleted, their team suffers before the leader notices. The goal is not to eliminate stress but to address its root rather than push through indefinitely.`,
  voice: `Key training principles for this category: Every leader has a foundational communication style that is their default under both normal and stressful conditions. Under pressure, most leaders either over-communicate dominance or withdraw. Knowing which you do — and why — is the beginning of behavioral change. Tendencies don't change on their own; they must be intercepted deliberately. The question is not how you intend to come across but how others actually experience you. Leaders who understand their natural style can extend genuine empathy to those who communicate differently, rather than labeling them as difficult. The most dangerous communication blind spot is believing your intent protects you from your impact.`,
  culture: `Key training principles for this category: Every leader sits somewhere on a spectrum between providing too much support (avoiding hard conversations to preserve relationships) and too much challenge (pushing people without enough care or affirmation). The healthiest leaders calibrate this balance to the individual, not to their own comfort. Over-support is often driven by fear of conflict or loss of approval. Over-challenge is often driven by fear that people are incompetent or won't deliver. Both are failures of leadership disguised as strengths. A psychologically safe team is not a conflict-free team — it is a team where honest conversations happen early, directly, and without retaliation.`,
  coaching: `Key training principles for this category: Development is not an event — it is a consistent practice. Effective leaders distinguish between underperformance caused by lack of skill, lack of clarity, and lack of motivation, because each requires a different response. Delegating work in a way that intentionally stretches a person is one of the most powerful development tools available. Setting clear expectations before handing off work is not micromanagement — it is respect. The goal of development is to build a team that exercises good judgment independently, not a team that executes what they are told. A leader who creates dependency has not succeeded at coaching.`,
  influence: `Key training principles for this category: Trust is built through four consistent behaviors: character (doing what is right), competence (doing what works), care (genuine investment in the person), and follow-through (doing what you said). Most leaders undermine trust in one of these four areas without realizing it. Influence cannot be demanded — it is earned over time through consistency and granted by the people you lead. Organizational health is a leadership responsibility, not an HR function. A leader who measures only results and ignores the health of their team is building on an unstable foundation. The most effective leaders communicate proactively, especially when plans change or uncertainty rises.`,
};

const ADMIN_EMAIL = "admin@waymarklc.com";
const ADMIN_PASS  = "WaymarkAdmin2025!";
const COHORT_CODES = ["LEADERS2025","TRIANGLE25","COHORT1"];

// ─── Storage ──────────────────────────────────────────────────────────────────
async function dbGet(key){ try{ const r=await fetch(`/api/db?key=${encodeURIComponent(key)}`); return r.ok?await r.json():null; }catch{ return null; } }
async function dbSet(key,val){ try{ await fetch('/api/db',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key,val})}); }catch{} }
async function dbDel(key){ try{ await fetch(`/api/db?key=${encodeURIComponent(key)}`,{method:'DELETE'}); }catch{} }

function sanitizeHTML(str){ if(!str) return ""; return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }

// ─── Role shortener ───────────────────────────────────────────────────────────
function shortenRole(role){
  if(!role) return "manager";
  const r = role.toLowerCase().trim();
  const map = [
    [/director/,"director"],[/manager/,"manager"],[/coordinator/,"coordinator"],
    [/supervisor/,"supervisor"],[/lead\b/,"lead"],[/owner/,"owner"],
    [/administrator/,"administrator"],[/officer/,"officer"],[/specialist/,"specialist"],
    [/president/,"president"],[/partner/,"partner"],[/associate/,"associate"],
  ];
  for(const [pat,short] of map){ if(pat.test(r)) return short; }
  const words = role.trim().split(/\s+/);
  return words.length > 2 ? words[words.length-1].toLowerCase() : role.toLowerCase();
}

// ─── API call with timeout ────────────────────────────────────────────────────
async function callClaudeWithTimeout(prompt, system, timeoutMs=28000){
  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(), timeoutMs);
  try {
    const r = await fetch("/api/score",{
      method:"POST", signal:controller.signal,
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ model:"claude-sonnet-4-5", max_tokens:1000, system, messages:[{role:"user",content:prompt}] }),
    });
    clearTimeout(timer);
    const d = await r.json();
    return d.content?.[0]?.text || "";
  } catch(e){
    clearTimeout(timer);
    if(e.name==="AbortError") throw new Error("API_TIMEOUT");
    throw e;
  }
}

function extractJSON(raw){
  if(!raw) throw new Error("Empty response");
  let cleaned = raw.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
  const start = cleaned.indexOf("{");
  const end   = cleaned.lastIndexOf("}");
  if(start===-1||end===-1) throw new Error("No JSON object found");
  return JSON.parse(cleaned.slice(start, end+1));
}

// ─── UPDATED: scoreQual — 3 labeled feedback sections, new rubric, generous grading ──
async function scoreQual(question, answer, rubric, category, industry, role){
  if(!answer||answer.trim().length<20) return{
    score:1,
    whyScore:"This answer was too brief to evaluate meaningfully.",
    howToImprove:"Revisit this question with a specific real-world example from your leadership experience. Name an actual situation, describe your actions, and reflect honestly on what worked and what did not.",
    leadershipReflection:"Depth matters more than polish. A shorter honest answer beats a longer generic one every time."
  };

  const principles = CATEGORY_PRINCIPLES[category] || "";
  const shortRole = shortenRole(role);

  const system = `You are a direct, principle-based leadership coach evaluating a ${shortenRole(role||"manager")} in the ${industry||"general business"} industry. Your voice is candid, warm, and behaviorally specific — never vague or patronizing. You call things exactly as they are while remaining constructive.

${principles}

Scoring rubric (be generous — give benefit of the doubt where intent is clear):
Score 1: Minimum characters met but answer is generic, surface-level, or only addresses part of the question with no real scenario.
Score 2: Shows awareness and intellectual understanding of the concept, but no specific scenario is named — the answer reads like theory rather than lived experience.
Score 3: Solid answer with at least one real, named example and genuine self-awareness. Some self-examination even if imperfect.
Score 4: Exceptional depth — specific scenario described, honest reflection on what worked AND what did not, ownership taken, concrete next step identified, behavioral change insight present.

Return ONLY a raw JSON object (no markdown, no preamble):
{"score":<1|2|3|4>,"whyScore":"<1-2 sentences explaining the score directly to the leader, naming what was strong and what was missing>","howToImprove":"<2-3 sentences of specific, actionable coaching tied to the principles above and their ${shortRole} role>","leadershipReflection":"<1-2 sentences of a direct principle or insight the leader should sit with — speak to them personally, not generically>"}`;

  const prompt = `Question: ${question}\nRubric criteria: ${rubric}\nAnswer: ${answer}`;

  try{
    const raw = await callClaudeWithTimeout(prompt, system);
    const parsed = extractJSON(raw);
    // Ensure all three fields exist
    return {
      score: parsed.score || 2,
      whyScore: parsed.whyScore || parsed.feedback || "Score assessed.",
      howToImprove: parsed.howToImprove || "Continue building specificity in your responses.",
      leadershipReflection: parsed.leadershipReflection || "Honest reflection is the beginning of real change.",
    };
 } catch(e){
    if(e.message==="API_TIMEOUT") throw e;
    console.error("scoreQual error:", e.message, e.stack);
    return{score:2,whyScore:"Your answer showed some self-awareness.",howToImprove:"Adding specific, named examples from your experience would significantly strengthen this response.",leadershipReflection:"The gap between knowing and doing is closed one honest conversation at a time."};
  }
}

// ─── UPDATED: generateSummary — behavioral language for strengths/growth ──────
async function generateSummary(categoryScores, qualResults, userName, industry, role, isSup=false, empEmail="", supEmpName=""){
  const shortRole = shortenRole(role);
  const displayName = isSup ? (supEmpName || empEmail) : userName;

  const system = `You are a direct, principle-based leadership development coach. ${isSup ? `A supervisor has assessed ${displayName}` : `You are evaluating ${displayName}`} who works as a ${shortRole} in the ${industry||"general business"} industry.

Your feedback voice: candid, warm, specific, and behavioral. Never use general category names as strengths or growth areas. Instead, describe specific behaviors, patterns, or tendencies using plain leadership language. For example, instead of "Strong in Self-Awareness," write "Demonstrates consistent self-reflection habits and names their impact on the team before being asked." Instead of "Growth needed in Coaching," write "Tends to delegate tasks without setting clear expectations, which creates confusion about what success looks like."

Return ONLY a raw JSON object (no markdown, no preamble):
{"narrative":"<2-3 paragraph overview, warm but honest, grounded in ${industry} context>","strengths":["<behavioral strength 1 — specific, 1 sentence>","<behavioral strength 2 — specific, 1 sentence>","<behavioral strength 3 — specific, 1 sentence>"],"growth":["<behavioral growth area 1 — specific, 1 sentence>","<behavioral growth area 2 — specific, 1 sentence>","<behavioral growth area 3 — specific, 1 sentence>"]}`;

  const scoreLines = CATEGORIES.map((c,i)=>`${c.label}: ${categoryScores[i].toFixed(1)}/5`).join("\n");
  const qualLines  = qualResults.map((q,i)=>`Q${i+1} depth: ${q.score}/4`).join("\n");

  const prompt = `${isSup?`Supervisor assessment of: ${displayName}`:`Leader: ${displayName}`}\nRole: ${shortRole} in ${industry||"general business"}\nScores:\n${scoreLines}\nQualitative depth:\n${qualLines}\n\nWrite a warm but honest 2-3 paragraph narrative. Identify top 3 behavioral strengths and top 3 specific behavioral growth opportunities. Ground all feedback in the ${industry||"industry"} context and ${shortRole} role.`;

  try{
    const raw = await callClaudeWithTimeout(prompt, system, 30000);
    return extractJSON(raw);
  } catch(e){
    const sorted = categoryScores.map((s,i)=>({s,i})).sort((a,b)=>b.s-a.s);
    return{
      narrative:`${isSup?`This supervisor assessment of ${displayName}`:`${displayName}, your assessment`} reveals a leader with meaningful investment in growth. The highest-scoring areas indicate genuine capability, while the lower-scoring areas represent the clearest opportunities for development.`,
      strengths: sorted.slice(0,3).map(x=>`Shows consistent investment in ${CATEGORIES[x.i].label.toLowerCase()}`),
      growth: sorted.slice(-3).map(x=>`Has opportunity to deepen practice in ${CATEGORIES[x.i].label.toLowerCase()}`),
    };
  }
}

function moderatedScore(avg, qualScore){
  if(qualScore<=1) return Math.min(avg,3.2);
  if(qualScore<=2) return Math.min(avg,4.2);
  return avg;
}

function genCode(len=8){
  const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({length:len},()=>chars[Math.floor(Math.random()*chars.length)]).join("");
}

// ─── PDF generation — updated for v4 ─────────────────────────────────────────
function generatePDF(attempt, userName, industry, role, isSup=false, empEmail="", supEmpName=""){
  const scores  = attempt.categoryScores;
  const overall = (scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1);
  const summary = attempt.summary||{};
  const safe    = (s)=>sanitizeHTML(s||"");
  const shortRole = shortenRole(role);
  const displayName = isSup ? (supEmpName || empEmail) : userName;

  const headerBg = isSup ? B.slate : B.navy;
  const badgeBar = isSup
    ? `<div style="background:#5FA899;color:#fff;font-size:10px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;padding:5px 14px;border-radius:100px;display:inline-block;margin-top:8px;">Supervisor Assessment</div>`
    : "";

  const titleRow = isSup
    ? `<div style="font-size:12px;color:#8B8378;margin-bottom:2px;">${safe(displayName)} &middot; ${safe(empEmail)}</div>`
    : `<div style="font-size:12px;color:#8B8378;">${safe(userName)}${industry?` · ${safe(industry)}`:""}${role?` · ${safe(shortRole)}`:""} · ${safe(attempt.date)}</div>`;

  const confNote = isSup
    ? `<div style="font-size:10px;color:#8B8378;margin-top:10px;font-style:italic;">This assessment is confidential and intended for supervisor and program facilitator review only.</div>`
    : "";

  const strLabel = isSup ? "Observed Strengths" : "Top 3 Strengths";
  const grtLabel = isSup ? "Coaching Opportunities" : "Top 3 Growth Opportunities";

  const barHTML = CATEGORIES.map((cat,i)=>{
    const pct=Math.round((scores[i]/5)*100);
    return `<div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;margin-bottom:3px;"><span style="font-size:11px;">${safe(cat.label)}</span><span style="font-size:11px;font-weight:600;color:${cat.color};">${scores[i].toFixed(1)}</span></div><div style="height:7px;background:#E8E4DF;border-radius:100px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:${cat.color};border-radius:100px;"></div></div></div>`;
  }).join("");

  const strHTML=(summary.strengths||[]).map((s,i)=>`<div style="display:flex;gap:8px;margin-bottom:7px;align-items:flex-start;"><div style="min-width:18px;height:18px;border-radius:50%;background:#3D7A6E;color:#fff;font-size:10px;font-weight:600;display:flex;align-items:center;justify-content:center;">${i+1}</div><span style="font-size:12px;line-height:1.5;">${safe(s)}</span></div>`).join("");
  const groHTML=(summary.growth||[]).map((g,i)=>`<div style="display:flex;gap:8px;margin-bottom:7px;align-items:flex-start;"><div style="min-width:18px;height:18px;border-radius:50%;background:${isSup?B.slate:B.navy};color:#fff;font-size:10px;font-weight:600;display:flex;align-items:center;justify-content:center;">${i+1}</div><span style="font-size:12px;line-height:1.5;">${safe(g)}</span></div>`).join("");

  // CTA block in PDF (self only)
  const ctaPDF = !isSup ? `
  <div style="border:1px solid #C17F3A;border-left:4px solid #C17F3A;border-radius:8px;padding:14px 16px;margin-top:14px;background:#FDFAF5;">
    <div style="font-size:10px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:#C17F3A;margin-bottom:6px;">Continue Your Growth</div>
    <p style="font-size:12px;line-height:1.65;color:#3A3530;margin:0 0 8px;">Leaders Together is a leadership cohort for managers in the Raleigh and Triangle area of North Carolina. Join a peer group of leaders working through real challenges together.</p>
    <div style="font-size:12px;font-weight:600;color:#1C2B3A;">waymarklc.com/leaders-together</div>
    <div style="font-size:11px;color:#8B8378;margin-top:4px;">Waymark online courses — coming soon. As a registered participant, your email is on file.</div>
  </div>` : "";

  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'DM Sans',sans-serif;background:#fff;color:#3A3530;padding:36px 44px;max-width:720px;margin:0 auto;}
    .header{background:${headerBg};color:#fff;padding:22px 26px;border-radius:10px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:flex-start;}
    .wordmark{font-family:'Cormorant Garamond',serif;font-size:21px;font-weight:600;letter-spacing:0.05em;}
    .tagline{font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.45);margin-top:3px;}
    .overall{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:600;color:#5FA899;}
    .card{border:0.5px solid #E8E4DF;border-radius:8px;padding:16px 18px;margin-bottom:14px;}
    .section-label{font-size:10px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:#8B8378;margin-bottom:8px;}
    .narrative{font-size:13px;line-height:1.75;color:#2E4057;font-weight:300;}
    .two-col{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;}
    .col-green{background:#F0F7F5;border-radius:8px;padding:12px 14px;}
    .col-navy{background:#F4F6F8;border-radius:8px;padding:12px 14px;}
    .col-title{font-size:10px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:8px;}
    .green-title{color:#3D7A6E;} .navy-title{color:${isSup?B.slate:B.navy};}
    .footer{border-top:1px solid #E8E4DF;margin-top:20px;padding-top:12px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;}
    .footer-text{font-size:10px;color:#8B8378;}
    @media print{body{padding:0;max-width:100%;}@page{margin:1.5cm;}button{display:none!important;}}
  </style>
  <script>window.onload=function(){window.print();}<\/script>
  </head><body>
  <div class="header">
    <div><div class="wordmark">WAYMARK</div><div class="tagline">Leadership Consulting · Leaders Together</div>${badgeBar}</div>
    <div style="text-align:right;"><div class="overall">${overall}<span style="font-size:14px;color:rgba(255,255,255,0.35);font-weight:300;">/5</span></div><div style="font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:0.12em;text-transform:uppercase;">Overall Score</div></div>
  </div>
  <div style="margin-bottom:14px;">
    <div style="font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:#1C2B3A;margin-bottom:4px;">${isSup?"Supervisor Assessment Results":"Leadership Assessment Results"}</div>
    ${titleRow}
    <div style="font-size:12px;color:#8B8378;">${isSup?`${industry?safe(industry)+' · ':""}${safe(attempt.date)}`:`${safe(attempt.date)}`}</div>
  </div>
  <div class="card"><div class="section-label">Personalized Summary</div><div class="narrative">${safe(summary.narrative||"")}</div></div>
  <div class="two-col">
    <div class="col-green"><div class="col-title green-title">${strLabel}</div>${strHTML}</div>
    <div class="col-navy"><div class="col-title navy-title">${grtLabel}</div>${groHTML}</div>
  </div>
  <div class="card"><div class="section-label">Category Scores</div>${barHTML}</div>
  ${ctaPDF}
  ${confNote}
  <div class="footer">
    <div class="footer-text">${safe(attempt.date)} · Leaders Together Assessment</div>
    <div class="footer-text">For additional consulting: dbreed@waymarklc.com</div>
  </div>
  </body></html>`;

  const w = window.open("","_blank","width=800,height=900");
  if(w){ w.document.write(html); w.document.close(); }
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function ScoreBar({score,color,label}){
  const pct=(score/5)*100;
  return(
    <div style={{marginBottom:"0.9rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span style={{fontSize:13,fontWeight:500,color:B.charcoal}}>{label}</span>
        <span style={{fontSize:13,fontWeight:600,color}}>{score.toFixed(1)}</span>
      </div>
      <div style={{height:8,background:B.mist,borderRadius:100,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:100,transition:"width 0.8s ease"}}/>
      </div>
    </div>
  );
}

function Stepper({current,total}){
  return(
    <div style={{display:"flex",gap:6,marginBottom:"1.5rem"}}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{flex:1,height:4,borderRadius:100,background:i<current?B.teal:i===current?B.tealLt:B.mist}}/>
      ))}
    </div>
  );
}

function LikertRow({text,value,onChange,index,disabled}){
  const labels=["1\nStrongly\nDisagree","2\nDisagree","3\nNeutral","4\nAgree","5\nStrongly\nAgree"];
  return(
    <div style={{marginBottom:"1.5rem",paddingBottom:"1.5rem",borderBottom:`1px solid ${B.mist}`}}>
      <p style={{fontSize:14,lineHeight:1.65,color:B.charcoal,marginBottom:"0.85rem"}}>
        <span style={{fontWeight:600,color:B.stone,marginRight:8}}>{index+1}.</span>{text}
      </p>
      <div style={{display:"flex",gap:8}}>
        {[1,2,3,4,5].map(v=>(
          <button key={v} disabled={disabled} onClick={()=>onChange(v)} style={{flex:1,padding:"10px 4px",borderRadius:6,cursor:disabled?"not-allowed":"pointer",border:value===v?`2px solid ${B.teal}`:`1.5px solid ${B.mist}`,background:value===v?B.teal:B.white,color:value===v?B.white:B.stone,fontSize:11,fontWeight:500,fontFamily:"'DM Sans',sans-serif",lineHeight:1.3,whiteSpace:"pre-line",textAlign:"center",transition:"all 0.15s",opacity:disabled?0.7:1}}>
            {labels[v-1]}
          </button>
        ))}
      </div>
    </div>
  );
}

function Modal({title,message,confirmLabel,confirmColor,onConfirm,onCancel}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(28,43,58,0.55)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
      <div style={{background:B.white,borderRadius:12,padding:"2rem",maxWidth:420,width:"100%",boxShadow:"0 8px 40px rgba(0,0,0,0.2)"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:B.navy,marginBottom:"0.75rem"}}>{title}</div>
        <p style={{fontSize:14,lineHeight:1.7,color:B.slate,marginBottom:"1.5rem"}}>{message}</p>
        <div style={{display:"flex",gap:12,justifyContent:"flex-end"}}>
          <button style={S.btnOutline} onClick={onCancel}>Cancel</button>
          <button style={{...S.btnPrimary,background:confirmColor||B.navy}} onClick={onConfirm}>{confirmLabel||"Confirm"}</button>
        </div>
      </div>
    </div>
  );
}

const SESSION_KEY = "lt_session";
function saveSession(data){ try{ sessionStorage.setItem(SESSION_KEY,JSON.stringify(data)); }catch{} }
function loadSession(){ try{ const d=sessionStorage.getItem(SESSION_KEY); return d?JSON.parse(d):null; }catch{ return null; } }
function clearSession(){ try{ sessionStorage.removeItem(SESSION_KEY); }catch{} }

const DRAFT_KEY = "lt_survey_draft";
function saveDraft(data){ try{ sessionStorage.setItem(DRAFT_KEY,JSON.stringify(data)); }catch{} }
function loadDraft(){ try{ const d=sessionStorage.getItem(DRAFT_KEY); return d?JSON.parse(d):null; }catch{ return null; } }
function clearDraft(){ try{ sessionStorage.removeItem(DRAFT_KEY); }catch{} }

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App(){
  const [screen,setScreen]     = useState("splash");
  const [user,setUser]         = useState(null);
  const [isAdmin,setIsAdmin]   = useState(false);
  const [err,setErr]           = useState("");
  const [loading,setLoading]   = useState(true);

  // Auth
  const [aName,setAName]       = useState("");
  const [aEmail,setAEmail]     = useState("");
  const [aPass,setAPass]       = useState("");
  const [aCode,setACode]       = useState("");
  const [aIndustry,setAIndustry] = useState("");
  const [aRole,setARole]       = useState("");
  const [authMode,setAuthMode] = useState("login");

  // Profile
  const [editIndustry,setEditIndustry] = useState("");
const [editRole,setEditRole]         = useState("");
const [showProfile,setShowProfile]   = useState(false);
const [editPassword,setEditPassword] = useState("");
const [editNewPass,setEditNewPass]   = useState("");
const [editConfirmPass,setEditConfirmPass] = useState("");
const [adminResetEmail,setAdminResetEmail] = useState("");
const [adminResetPass,setAdminResetPass]   = useState("");
const [adminResetMsg,setAdminResetMsg]     = useState("");

  // Survey
  const [catIndex,setCatIndex]   = useState(0);
  const [likertAns,setLikertAns] = useState(CATEGORIES.map(c=>Array(c.likert.length).fill(0)));
  const [qualAns,setQualAns]     = useState(CATEGORIES.map(c=>Array(c.qualitative.length).fill("")));
  const [surveyMode,setSurveyMode]         = useState("self");
  const [supEmpEmail,setSupEmpEmail]       = useState("");
  const [supEmpEmailInput,setSupEmpEmailInput] = useState("");
  const [supEmpNameInput,setSupEmpNameInput]   = useState("");  // v4 #7: name field
  const [supEmpName,setSupEmpName]         = useState("");
  const [submitting,setSubmitting]         = useState(false);
  const [scoringMsg,setScoringMsg]         = useState("Analyzing your responses…");
  const [scoringStep,setScoringStep]       = useState(0);
  const [scoringTotal,setScoringTotal]     = useState(1);
  const [scoringError,setScoringError]     = useState("");

  // Dashboard
  const [attempts,setAttempts]     = useState([]);
  const [supAttempts,setSupAttempts] = useState({});
  const [selectedSupEmp,setSelectedSupEmp] = useState(null);

  // Admin
  const [allUsers,setAllUsers]     = useState([]);
  const [adminView,setAdminView]   = useState("users");
  const [adminTarget,setAdminTarget] = useState(null);
  const [supCodes,setSupCodes]     = useState([]);
  const [modal,setModal]           = useState(null);
  const [adminLoading,setAdminLoading] = useState(false);

  // Leave guard
  const [showLeaveWarning,setShowLeaveWarning] = useState(false);
  const [pendingNav,setPendingNav]             = useState(null);

  const topRef = useRef(null);
  // v4 #4: scroll to top properly — section title and first question visible
  const scrollTop = () => {
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 100);
};

  // Restore session
  useEffect(()=>{
    (async()=>{
      const sess = loadSession();
      if(sess?.email){
        if(sess.isAdmin){
          setUser({name:"Admin",email:ADMIN_EMAIL}); setIsAdmin(true);
          await loadAdminData(); setScreen("admin");
        } else {
          const users = await dbGet("users")||{};
          const u = users[sess.email];
          if(u&&!u.suspended){ setUser(u); await loadUserData(u); setScreen("dashboard"); }
          else if(u?.suspended){ setUser(u); setScreen("suspended"); }
          else clearSession();
        }
      }
      setLoading(false);
    })();
  },[]);

  function guardedNav(targetScreen, action){
    if((screen==="survey"||screen==="intro")&&surveyMode!==null){
      setShowLeaveWarning(true);
      setPendingNav(()=>()=>{ action&&action(); setScreen(targetScreen); clearDraft(); });
    } else {
      action&&action(); setScreen(targetScreen);
    }
  }

  async function handleAuth(){
    setErr("");
    if(authMode==="login"){
      if(aEmail===ADMIN_EMAIL&&aPass===ADMIN_PASS){
        setIsAdmin(true); setUser({name:"Admin",email:ADMIN_EMAIL});
        saveSession({email:ADMIN_EMAIL,isAdmin:true});
        await loadAdminData(); setScreen("admin"); return;
      }
      const users=await dbGet("users")||{};
      const u=users[aEmail];
      if(!u||u.password!==aPass){setErr("Invalid email or password."); return;}
      if(u.suspended){ setUser(u); setScreen("suspended"); return; }
      saveSession({email:u.email,isAdmin:false});
      setUser(u); await loadUserData(u); setScreen("dashboard");
    } else {
      if(!aName||!aEmail||!aPass||!aIndustry||!aRole){setErr("All fields are required."); return;}
      const users=await dbGet("users")||{};
      if(users[aEmail]){setErr("An account with this email already exists."); return;}
      const codes=await dbGet("supCodes")||{};
      const codeUpper=aCode.trim().toUpperCase();
      let tier="trial", isSupervisor=false;
      const isSupCode = codes[codeUpper]&&!codes[codeUpper].used;
      const isCohortCode = COHORT_CODES.includes(codeUpper);
      if(isSupCode){ tier="cohort"; isSupervisor=true; codes[codeUpper].used=true; codes[codeUpper].usedBy=aEmail; await dbSet("supCodes",codes); }
      else if(isCohortCode){ tier="cohort"; }
      const u={name:aName,email:aEmail,password:aPass,tier,isSupervisor,industry:aIndustry,role:aRole,cohortCode:aCode||null,createdAt:Date.now(),suspended:false,cohort:false};
      users[aEmail]=u; await dbSet("users",users);
      saveSession({email:u.email,isAdmin:false});
      setUser(u); await loadUserData(u); setScreen("dashboard");
    }
  }

  async function loadUserData(u){
    const a=await dbGet(`attempts:${u.email}`)||[]; setAttempts(a);
    if(u.isSupervisor){ const sa=await dbGet(`supAttempts:${u.email}`)||{}; setSupAttempts(sa); }
  }

  function startSelf(){
    if(user.tier==="trial"&&attempts.length>=1) return;
    if(submitting) return;
    setSurveyMode("self"); setSupEmpEmail(""); setSupEmpName("");
    const draft = loadDraft();
    if(draft&&draft.mode==="self"&&draft.user===user.email){
      setLikertAns(draft.likertAns); setQualAns(draft.qualAns); setCatIndex(draft.catIndex);
      setScreen("survey"); scrollTop(); return;
    }
    setLikertAns(CATEGORIES.map(c=>Array(c.likert.length).fill(0)));
    setQualAns(CATEGORIES.map(c=>Array(c.qualitative.length).fill("")));
    setCatIndex(0); setErr(""); clearDraft(); setScreen("intro"); scrollTop();
  }

  function startSupervisorAssess(){
    if(submitting) return;
    if(!supEmpEmailInput.trim()||!/\S+@\S+\.\S+/.test(supEmpEmailInput)){setErr("Please enter a valid employee email."); return;}
    const email = supEmpEmailInput.trim().toLowerCase();
    const name  = supEmpNameInput.trim();
    setSupEmpEmail(email);
    setSupEmpName(name);
    setSurveyMode("supervisor");
    setLikertAns(CATEGORIES.map(c=>Array(c.likert.length).fill(0)));
    setQualAns(CATEGORIES.map(c=>Array(c.qualitative.length).fill("")));
    setCatIndex(0); setErr(""); clearDraft(); setScreen("intro"); scrollTop();
  }

  function updateLikert(ci, qi, v){
    const updated = likertAns.map((r,i)=>i===ci?r.map((val,j)=>j===qi?v:val):r);
    setLikertAns(updated);
    saveDraft({mode:surveyMode,user:user?.email,catIndex,likertAns:updated,qualAns});
  }

  function updateQual(ci, qi, v){
    const updated = qualAns.map((r,i)=>i===ci?r.map((val,j)=>j===qi?v:val):r);
    setQualAns(updated);
    saveDraft({mode:surveyMode,user:user?.email,catIndex,likertAns,qualAns:updated});
  }

  function nextSection(){
    if(submitting) return;
    const likes=likertAns[catIndex];
    if(likes.some(v=>v===0)){setErr("Please answer all rating questions before continuing."); return;}
    if(surveyMode==="self"){
      const quals=qualAns[catIndex];
      const shortIdx = quals.findIndex(q=>q.trim().length<MIN_QUAL_LENGTH);
      if(shortIdx!==-1){setErr(`Your answer to reflection question ${shortIdx+1} needs more depth (at least ${MIN_QUAL_LENGTH} characters). The AI analysis requires substantive responses to provide accurate feedback.`); return;}
    }
    setErr("");
    saveDraft({mode:surveyMode,user:user?.email,catIndex:catIndex+1,likertAns,qualAns});
    if(catIndex<CATEGORIES.length-1){
      setCatIndex(catIndex+1);
      // v4 #4: scroll to top of page so section title is fully visible
      scrollTop();
    } else {
      submitSurvey();
    }
  }

  async function submitSurvey(){
    if(submitting) return;

    const users = await dbGet("users")||{};
    const freshUser = users[user?.email];
    if(freshUser?.suspended){ setUser(freshUser); clearDraft(); setScreen("suspended"); return; }

    if(surveyMode==="self"&&user.tier==="trial"){
      const existing = await dbGet(`attempts:${user.email}`)||[];
      if(existing.length>=1){ setErr("Free trial is limited to one assessment."); setScreen("dashboard"); return; }
    }

    setSubmitting(true); setScoringError(""); setScreen("scoring");
    const totalSteps = surveyMode==="self" ? CATEGORIES.length*2+1 : 1;
    setScoringTotal(totalSteps); setScoringStep(0);

    let step=0;
    const advance=(msg)=>{ step++; setScoringStep(step); setScoringMsg(msg); };

    try{
      const ind=user.industry||"general business";
      const rol=user.role||"manager";
      let qualResults=[];
      let categoryScores=[];

      console.log("DEBUG surveyMode:", surveyMode);
      if(surveyMode==="self"){
        for(let ci=0;ci<CATEGORIES.length;ci++){
          const cat=CATEGORIES[ci];
          advance(`Scoring ${cat.label}…`);
          for(let qi=0;qi<cat.qualitative.length;qi++){
            try{
              const r=await scoreQual(cat.qualitative[qi].question,qualAns[ci][qi],cat.qualitative[qi].rubric,cat.id,ind,rol);
              qualResults.push(r);
            } catch(e){
              if(e.message==="API_TIMEOUT"){
                setScoringError("One of the scoring calls timed out. Retrying…");
                await new Promise(r=>setTimeout(r,2000));
                try{
                  const r=await scoreQual(cat.qualitative[qi].question,qualAns[ci][qi],cat.qualitative[qi].rubric,cat.id,ind,rol);
                  qualResults.push(r); setScoringError("");
                } catch{
                  qualResults.push({score:2,whyScore:"Scoring timed out.",howToImprove:"This response has been given a neutral score — revisit in your next assessment.",leadershipReflection:"Consistency over time reveals more than any single answer."});
                  setScoringError("");
                }
              } else {
                qualResults.push({score:2,whyScore:"Scoring encountered an error.",howToImprove:"This response has been given a neutral score.",leadershipReflection:"Keep reflecting — the value is in the process."});
              }
            }
          }
        }
        categoryScores=CATEGORIES.map((cat,ci)=>{
          const avg=likertAns[ci].reduce((a,b)=>a+b,0)/cat.likert.length;
          const q1=qualResults[ci*2]?.score||2;
          const q2=qualResults[ci*2+1]?.score||2;
          return moderatedScore(avg,(q1+q2)/2);
        });
      } else {
        qualResults=CATEGORIES.flatMap(()=>[
          {score:3,whyScore:"Supervisor assessment.",howToImprove:"",leadershipReflection:""},
          {score:3,whyScore:"Supervisor assessment.",howToImprove:"",leadershipReflection:""},
        ]);
        categoryScores=CATEGORIES.map((_,ci)=>likertAns[ci].reduce((a,b)=>a+b,0)/CATEGORIES[ci].likert.length);
      }

      advance("Generating your personalized summary…");
      const summary=await generateSummary(categoryScores,qualResults,user.name,ind,rol,surveyMode==="supervisor",supEmpEmail,supEmpName);

      const attempt={
        date:new Date().toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),
        timestamp:Date.now(),
        categoryScores,qualResults,
        qualAnswers:surveyMode==="self"?qualAns:null,
        summary,mode:surveyMode,
        empEmail:surveyMode==="supervisor"?supEmpEmail:null,
        empName:surveyMode==="supervisor"?supEmpName:null,
      };

      if(surveyMode==="self"){
        const key=`attempts:${user.email}`;
        const existing=await dbGet(key)||[];
        existing.push(attempt); await dbSet(key,existing); setAttempts([...existing]);
      } else {
        const sa=await dbGet(`supAttempts:${user.email}`)||{};
        if(!sa[supEmpEmail]) sa[supEmpEmail]=[];
        sa[supEmpEmail].push(attempt);
        await dbSet(`supAttempts:${user.email}`,sa); setSupAttempts({...sa});
      }

      clearDraft();
      setSubmitting(false);
      window.__lt_results = attempt;
      setScreen("results");
    } catch(e){
      setSubmitting(false);
      setScoringError(`Something went wrong: ${e.message||"unknown error"}. Please go back and try again.`);
    }
  }

  // ── Admin ──────────────────────────────────────────────────────────────────
  async function loadAdminData(){
    setAdminLoading(true);
    const users=await dbGet("users")||{};
    const list=Object.values(users).filter(u=>u.email!==ADMIN_EMAIL);
    const enriched=await Promise.all(list.map(async u=>{
      const att=await dbGet(`attempts:${u.email}`)||[];
      const sa=u.isSupervisor?(await dbGet(`supAttempts:${u.email}`)||{}):null;
      return{...u,attempts:att,supAttempts:sa};
    }));
    setAllUsers(enriched);
    const codes=await dbGet("supCodes")||{};
    setSupCodes(Object.entries(codes).map(([k,v])=>({code:k,...v})));
    setAdminLoading(false);
  }

  async function genSupCode(){
    const codes=await dbGet("supCodes")||{};
    let newCode=genCode();
    while(codes[newCode]) newCode=genCode();
    codes[newCode]={created:Date.now(),used:false,usedBy:null};
    await dbSet("supCodes",codes);
    setSupCodes(Object.entries(codes).map(([k,v])=>({code:k,...v})));
  }

  async function toggleSuspend(email){
    const users=await dbGet("users")||{};
    if(!users[email]) return;
    users[email].suspended=!users[email].suspended;
    await dbSet("users",users);
    await loadAdminData();
  }

  // v4 #11: toggle cohort flag (manual only)
  async function toggleCohort(email){
    const users=await dbGet("users")||{};
    if(!users[email]) return;
    users[email].cohort=!users[email].cohort;
    await dbSet("users",users);
    await loadAdminData();
  }

  async function deleteUser(email){
    setAdminTarget(null); setAdminView("users");
    const users=await dbGet("users")||{};
    const u=users[email];
    delete users[email];
    await dbSet("users",users);
    await dbDel(`attempts:${email}`);
    if(u?.isSupervisor) await dbDel(`supAttempts:${email}`);
    setModal(null);
    await loadAdminData();
  }

  // v4 #11: CSV export
  function exportCSV(){
    const headers = ["Name","Email","Industry","Role","Type","Attempts","Cohort"];
    const rows = allUsers.map(u=>[
      `"${(u.name||"").replace(/"/g,'""')}"`,
      `"${u.email||""}"`,
      `"${(u.industry||"").replace(/"/g,'""')}"`,
      `"${(u.role||"").replace(/"/g,'""')}"`,
      u.isSupervisor?"Supervisor":u.tier,
      u.attempts.length,
      u.cohort?"Yes":"No",
    ]);
    const csv = [headers.join(","), ...rows.map(r=>r.join(","))].join("\n");
    const blob = new Blob([csv], {type:"text/csv"});
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download="leaders_together_participants.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  async function saveProfile(){
  if(!editIndustry.trim()||!editRole.trim()){setErr("Both fields are required."); return;}
  if(editNewPass){
    if(editNewPass.length<6){setErr("New password must be at least 6 characters."); return;}
    if(editNewPass!==editConfirmPass){setErr("Passwords do not match."); return;}
    if(editPassword!==user.password){setErr("Current password is incorrect."); return;}
  }
  const users=await dbGet("users")||{};
  users[user.email].industry=editIndustry;
  users[user.email].role=editRole;
  if(editNewPass) users[user.email].password=editNewPass;
  await dbSet("users",users);
  setUser({...user,industry:editIndustry,role:editRole,...(editNewPass?{password:editNewPass}:{})});
  setEditPassword(""); setEditNewPass(""); setEditConfirmPass("");
  setShowProfile(false); setErr("");
}

  function signOut(){
    clearSession(); clearDraft();
    setUser(null); setIsAdmin(false); setAttempts([]);
    setSubmitting(false); setScreen("splash");
  }

  const currentResults = screen==="results" ? (window.__lt_results||attempts[attempts.length-1]) : null;

  if(loading){
    return(
      <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
        <div style={{textAlign:"center"}}>
          <div style={{width:44,height:44,borderRadius:"50%",border:`3px solid ${B.mist}`,borderTopColor:B.teal,margin:"0 auto 1rem",animation:"spin 1s linear infinite"}}/>
          <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:B.navy}}>Leaders Together</div>
        </div>
      </div>
    );
  }

  // Compute lowest-scoring category for CTA card
  function getLowestCategoryLabel(r){
    if(!r||!r.categoryScores) return "";
    let minIdx=0, minScore=9999;
    r.categoryScores.forEach((s,i)=>{ if(s<minScore){ minScore=s; minIdx=i; } });
    return CATEGORIES[minIdx].label;
  }

  return(
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
      <div ref={topRef}/>
      {modal&&<Modal {...modal}/>}

      {showLeaveWarning&&(
        <Modal title="Leave Assessment?" message="You have an assessment in progress. Your answers so far have been saved as a draft. If you leave now, you can resume from where you left off next time you begin." confirmLabel="Leave" confirmColor={B.warn}
          onConfirm={()=>{ setShowLeaveWarning(false); pendingNav&&pendingNav(); setPendingNav(null); }}
          onCancel={()=>{ setShowLeaveWarning(false); setPendingNav(null); }}
        />
      )}

      {/* Header */}
      <header style={S.header}>
        <div style={{cursor:"pointer"}} onClick={()=>user?guardedNav("dashboard"):setScreen("splash")}>
          <div style={S.wordmark}>WAYMARK</div>
          <div style={S.tagline}>Leadership Consulting</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <span style={S.badge(B.teal)}>Leaders Together</span>
          {user&&!isAdmin&&(
            <>
              {user.isSupervisor&&<span style={S.badge(B.slate)}>Supervisor</span>}
              <button onClick={()=>guardedNav("profile",()=>{ setShowProfile(true); setEditIndustry(user.industry||""); setEditRole(user.role||""); })} style={{...S.btnOutline,padding:"5px 12px",fontSize:11,color:"rgba(255,255,255,0.6)",borderColor:"rgba(255,255,255,0.25)",background:"transparent"}}>Profile</button>
              <button onClick={()=>guardedNav("splash",signOut)} style={{...S.btnOutline,padding:"5px 12px",fontSize:11,color:"rgba(255,255,255,0.5)",borderColor:"rgba(255,255,255,0.2)",background:"transparent"}}>Sign Out</button>
            </>
          )}
          {isAdmin&&<button onClick={()=>{clearSession();setUser(null);setIsAdmin(false);setScreen("splash");}} style={{...S.btnOutline,padding:"5px 12px",fontSize:11,color:B.error,borderColor:B.error,background:"transparent"}}>Exit Admin</button>}
        </div>
      </header>

      {/* Profile modal */}
      {showProfile&&user&&(
        <div style={{position:"fixed",inset:0,background:"rgba(28,43,58,0.55)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
          <div style={{background:B.white,borderRadius:12,padding:"2rem",maxWidth:440,width:"100%"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:B.navy,marginBottom:"0.5rem"}}>Update Your Profile</div>
            <p style={{fontSize:13,color:B.stone,marginBottom:"1.25rem",lineHeight:1.6}}>Changes apply to future assessments only.</p>
            <div style={{marginBottom:"1rem"}}>
              <label style={S.label}>Industry</label>
              <input style={S.input} value={editIndustry} onChange={e=>setEditIndustry(e.target.value)} placeholder="e.g. Dental, Physical Therapy, Optometry…"/>
            </div>
            <div style={{marginBottom:"1.25rem"}}>
  <label style={S.label}>Your Role</label>
  <input style={S.input} value={editRole} onChange={e=>setEditRole(e.target.value)} placeholder="e.g. Practice Manager, Office Director…"/>
</div>
<div style={{...S.divider}}/>
<div style={{fontSize:12,color:B.stone,marginBottom:"0.75rem",lineHeight:1.6}}>To change your password, enter your current password and a new one below. Leave blank to keep your current password.</div>
<div style={{marginBottom:"1rem"}}>
  <label style={S.label}>Current Password</label>
  <input style={S.input} type="password" value={editPassword} onChange={e=>setEditPassword(e.target.value)} placeholder="Your current password"/>
</div>
<div style={{marginBottom:"1rem"}}>
  <label style={S.label}>New Password</label>
  <input style={S.input} type="password" value={editNewPass} onChange={e=>setEditNewPass(e.target.value)} placeholder="New password (min 6 characters)"/>
</div>
<div style={{marginBottom:"1.25rem"}}>
  <label style={S.label}>Confirm New Password</label>
  <input style={S.input} type="password" value={editConfirmPass} onChange={e=>setEditConfirmPass(e.target.value)} placeholder="Confirm new password"/>
</div>
            {err&&<p style={S.errTxt}>{err}</p>}
            <div style={{display:"flex",gap:10}}>
              <button style={S.btnPrimary} onClick={saveProfile}>Save Changes</button>
              <button style={S.btnOutline} onClick={()=>{setShowProfile(false);setErr("");}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* SPLASH */}
      {screen==="splash"&&(
        <div style={S.container}>
          <div style={{textAlign:"center",padding:"3rem 0 2rem"}}>
            <div style={{...S.h3,textAlign:"center",marginBottom:"1.5rem"}}>Leaders Together · Assessment</div>
            <h1 style={{...S.h1,fontSize:42,textAlign:"center"}}>Where Are You<br/>as a Leader?</h1>
            <p style={{...S.body,maxWidth:480,margin:"1.25rem auto 2.5rem",textAlign:"center"}}>An honest, AI-powered baseline of your leadership proficiency across five core competencies. Take it once, then again over time to track real growth.</p>
            <div style={{display:"flex",gap:12,justifyContent:"center"}}>
              <button style={S.btnPrimary} onClick={()=>{setAuthMode("login");setScreen("auth");}}>Sign In</button>
              <button style={S.btnTeal} onClick={()=>{setAuthMode("register");setScreen("auth");}}>Get Started Free</button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.85rem",marginTop:"1.5rem"}}>
            {CATEGORIES.map((cat,i)=>(
              <div key={i} style={{...S.card,padding:"1rem 1.25rem",margin:0,display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:cat.color,flexShrink:0}}/>
                <span style={{fontSize:13,fontWeight:500,color:B.charcoal}}>{cat.label}</span>
              </div>
            ))}
            <div style={{...S.card,padding:"1rem 1.25rem",margin:0,display:"flex",alignItems:"center",gap:10,gridColumn:"1/-1",background:B.navy}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:B.tealLt,flexShrink:0}}/>
              <span style={{fontSize:13,fontWeight:500,color:"rgba(255,255,255,0.85)"}}>AI-powered analysis tailored to your industry and role</span>
            </div>
          </div>
        </div>
      )}

      {/* AUTH */}
      {screen==="auth"&&(
        <div style={S.container}>
          <div style={S.card}>
          <div style={{background:"#FDF6EC",border:`1.5px solid ${B.warn}`,borderRadius:8,padding:"0.75rem 1rem",marginBottom:"1rem"}}>
  <p style={{fontSize:13,color:B.charcoal,lineHeight:1.6}}>⚠ This assessment is optimized for Chrome or Firefox. Safari is not fully supported and may affect your results.</p>
</div>
            <div style={S.h3}>{authMode==="login"?"Welcome Back":"Create Your Account"}</div>
            <h2 style={S.h2}>{authMode==="login"?"Sign in to continue your journey":"Begin your leadership baseline"}</h2>
            <div style={S.divider}/>
            {authMode==="register"&&<div style={{marginBottom:"1rem"}}><label style={S.label}>Full Name</label><input style={S.input} value={aName} onChange={e=>setAName(e.target.value)} placeholder="Your name"/></div>}
            <div style={{marginBottom:"1rem"}}><label style={S.label}>Email Address</label><input style={S.input} type="email" value={aEmail} onChange={e=>setAEmail(e.target.value)} placeholder="your@email.com"/></div>
            <div style={{marginBottom:"1rem"}}><label style={S.label}>Password</label><input style={S.input} type="password" value={aPass} onChange={e=>setAPass(e.target.value)} placeholder="••••••••"/></div>
            {authMode==="register"&&(
              <>
                {/* v4 #5: updated industry placeholder text */}
                <div style={{marginBottom:"1rem"}}><label style={S.label}>Industry <span style={{color:B.error}}>*</span></label><input style={S.input} value={aIndustry} onChange={e=>setAIndustry(e.target.value)} placeholder="Dental, Physical Therapy, Tech, Hospitality…"/></div>
                <div style={{marginBottom:"1rem"}}><label style={S.label}>Your Role <span style={{color:B.error}}>*</span></label><input style={S.input} value={aRole} onChange={e=>setARole(e.target.value)} placeholder="e.g. Office Manager, Director of Operations…"/></div>
                <div style={{marginBottom:"1.25rem"}}><label style={S.label}>Access Code <span style={{color:B.stone,fontWeight:300}}>(cohort or supervisor)</span></label><input style={S.input} value={aCode} onChange={e=>setACode(e.target.value)} placeholder="Provided by your facilitator"/><p style={{fontSize:12,color:B.stone,marginTop:5,lineHeight:1.5}}>No code? You can take the assessment once as a free trial.</p></div>
              </>
            )}
            {err&&<p style={S.errTxt}>{err}</p>}
            <button style={{...S.btnPrimary,width:"100%",marginTop:"0.5rem"}} onClick={handleAuth}>{authMode==="login"?"Sign In":"Create Account"}</button>
            <p style={{fontSize:13,color:B.stone,marginTop:"1rem",textAlign:"center"}}>
              {authMode==="login"?"New here?":"Already have an account?"}{" "}
              <span style={{color:B.teal,cursor:"pointer",fontWeight:500}} onClick={()=>{setAuthMode(authMode==="login"?"register":"login");setErr("");}}>
                {authMode==="login"?"Create an account":"Sign in"}
              </span>
            </p>
            {authMode==="login"&&(
  <p style={{fontSize:12,color:B.stone,marginTop:"0.75rem",textAlign:"center",lineHeight:1.6}}>
    Forgot your password? Email <a href="mailto:dbreed@waymarklc.com" style={{color:B.teal}}>dbreed@waymarklc.com</a> and we will reset it for you.
  </p>
)}
          </div>
        </div>
      )}

      {/* SUSPENDED */}
      {screen==="suspended"&&(
        <div style={{...S.container,textAlign:"center",paddingTop:"4rem"}}>
          <div style={S.card}>
            <div style={{fontSize:32,marginBottom:"1rem"}}>⚠️</div>
            <h2 style={S.h2}>Account Suspended</h2>
            <p style={{...S.body,textAlign:"center",maxWidth:400,margin:"0 auto 1.5rem"}}>Your account has been temporarily suspended. Please contact your program facilitator to restore access.</p>
            <p style={{fontSize:14,fontWeight:500,color:B.teal}}>dbreed@waymarklc.com</p>
            <button style={{...S.btnOutline,marginTop:"1.5rem"}} onClick={()=>{clearSession();setUser(null);setScreen("splash");}}>Back to Sign In</button>
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      {screen==="dashboard"&&user&&(
        <div style={S.containerWide}>
          <div style={{marginBottom:"1.75rem"}}>
            <div style={S.h3}>Welcome back</div>
            <h1 style={S.h1}>{user.name}</h1>
            <div style={{display:"flex",alignItems:"center",gap:10,marginTop:6,flexWrap:"wrap"}}>
              <span style={S.pill(user.tier==="cohort"?B.teal:B.stone)}>{user.tier==="cohort"?"Cohort Member":"Free Trial"}</span>
              {user.isSupervisor&&<span style={S.pill(B.slate)}>Supervisor</span>}
              <span style={{fontSize:13,color:B.stone}}>{user.industry} · {user.role}</span>
            </div>
          </div>

          {/* Self-assessment CTA */}
          <div style={{...S.card,background:B.navy,marginBottom:"1.25rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
              <div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:B.white,marginBottom:6}}>
                  {attempts.length===0?"Take Your Baseline Assessment":"Take the Assessment Again"}
                </div>
                <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",maxWidth:420,lineHeight:1.65}}>
                  {attempts.length===0?"Establish your starting point across five leadership competencies.":"Track your growth since your last attempt."}
                </p>
              </div>
              {(user.tier==="cohort"||attempts.length===0)
                ?<button style={S.btnTeal} onClick={startSelf}>Begin Self-Assessment →</button>
                :<div style={{fontSize:12,color:"rgba(255,255,255,0.4)",maxWidth:220,lineHeight:1.55}}>Free trial is limited to one assessment. Join a cohort to track your growth over time.</div>}
            </div>
          </div>

          {/* Supervisor panel */}
          {user.isSupervisor&&(
            <div style={{...S.card,border:`1.5px solid ${B.slate}`,marginBottom:"1.5rem"}}>
              <div style={S.h3}>Supervisor Assessment</div>
              <h2 style={{...S.h2,fontSize:20}}>Assess a Team Member</h2>
              <p style={{fontSize:13,color:B.stone,marginBottom:"1.25rem",lineHeight:1.65}}>Enter a team member's name and email, then complete the rating questions on their behalf. Your observations are private and stored under your supervisor profile only.</p>
              {/* v4 #7: name + email fields */}
              <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:10}}>
                <input style={{...S.input,maxWidth:240}} value={supEmpNameInput} onChange={e=>{setSupEmpNameInput(e.target.value);setErr("");}} placeholder="Employee name (display only)"/>
                <input style={{...S.input,maxWidth:280}} value={supEmpEmailInput} onChange={e=>{setSupEmpEmailInput(e.target.value);setErr("");}} placeholder="employee@theirpractice.com"/>
                <button style={{...S.btnPrimary,opacity:submitting?0.5:1}} disabled={submitting} onClick={startSupervisorAssess}>Start Assessment →</button>
              </div>
              {err&&<p style={S.errTxt}>{err}</p>}
              {Object.keys(supAttempts).length>0&&(
                <div style={{marginTop:"1.5rem"}}>
                  <div style={{...S.h3,marginBottom:"0.75rem"}}>Your Supervisor Assessments by Employee</div>
                  {Object.entries(supAttempts).map(([empEmail,atts])=>(
                    <div key={empEmail} style={{background:B.mist,borderRadius:8,padding:"0.85rem 1rem",marginBottom:"0.75rem"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setSelectedSupEmp(selectedSupEmp===empEmail?null:empEmail)}>
                        <div>
                          <div style={{fontSize:13,fontWeight:600,color:B.navy}}>{atts[atts.length-1]?.empName||empEmail}</div>
                          <div style={{fontSize:11,color:B.stone}}>{empEmail} · {atts.length} assessment{atts.length!==1?"s":""}</div>
                        </div>
                        <span style={{fontSize:12,color:B.teal}}>{selectedSupEmp===empEmail?"▲ Hide":"▼ Show"}</span>
                      </div>
                      {selectedSupEmp===empEmail&&(
                        <div style={{marginTop:"1rem"}}>
                          {atts.map((att,i)=>(
                            <div key={i} style={{background:B.white,borderRadius:6,padding:"0.85rem",marginBottom:"0.5rem"}}>
                              <div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.75rem"}}>
                                <span style={{fontSize:12,fontWeight:600,color:B.navy}}>Assessment {i+1} — {att.date}</span>
                                <span style={{fontSize:12,fontWeight:600,color:B.teal}}>{(att.categoryScores.reduce((a,b)=>a+b,0)/att.categoryScores.length).toFixed(1)}/5</span>
                              </div>
                              {CATEGORIES.map((cat,ci)=><ScoreBar key={ci} label={cat.label} score={att.categoryScores[ci]} color={cat.color}/>)}
                              <button style={{...S.btnSmall,marginTop:"0.5rem",background:B.slate}} onClick={e=>{e.stopPropagation();generatePDF(att,user.name,user.industry,user.role,true,empEmail,att.empName||"");}}>Download PDF</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Self-assessment history */}
          {attempts.length>0&&(
            <>
              <div style={{...S.h3,marginBottom:"1rem"}}>Your Self-Assessment Progress</div>
              <div style={S.card}>
                <div style={S.h3}>Score History by Category</div>
                {CATEGORIES.map((cat,ci)=>(
                  <div key={ci} style={{marginBottom:"1.25rem"}}>
                    <div style={{fontSize:12,fontWeight:500,color:B.stone,marginBottom:8}}>{cat.label}</div>
                    <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                      {attempts.map((att,ai)=>{
                        const score=att.categoryScores[ci];
                        const pct=(score/5)*100;
                        return(
                          <div key={ai} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:1,maxWidth:80}}>
                            <div style={{fontSize:11,fontWeight:600,color:cat.color}}>{score.toFixed(1)}</div>
                            <div style={{width:"100%",height:48,background:B.mist,borderRadius:4,overflow:"hidden",display:"flex",alignItems:"flex-end"}}>
                              <div style={{width:"100%",height:`${pct}%`,background:cat.color}}/>
                            </div>
                            <div style={{fontSize:10,color:B.stone,textAlign:"center"}}>{att.date}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {[...attempts].reverse().map((att,ai)=>(
                <div key={ai} style={S.card}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
                    <div><div style={{fontSize:14,fontWeight:600,color:B.navy}}>Assessment {attempts.length-ai}</div><div style={{fontSize:12,color:B.stone}}>{att.date}</div></div>
                    <div style={{fontSize:18,fontWeight:600,color:B.teal}}>{(att.categoryScores.reduce((a,b)=>a+b,0)/att.categoryScores.length).toFixed(1)}<span style={{fontSize:12,color:B.stone}}>/5</span></div>
                  </div>
                  {CATEGORIES.map((cat,ci)=><ScoreBar key={ci} label={cat.label} score={att.categoryScores[ci]} color={cat.color}/>)}
                  <div style={{display:"flex",gap:10,marginTop:"0.75rem"}}>
                    <button style={S.btnSmall} onClick={()=>{window.__lt_results=att; setScreen("results");}}>View Full Results</button>
                    <button style={{...S.btnSmall,background:B.teal}} onClick={()=>generatePDF(att,user.name,user.industry,user.role)}>Download PDF</button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* INTRO */}
      {screen==="intro"&&(
        <div style={S.container}>
          <div style={S.card}>
            {surveyMode==="supervisor"&&<div style={{background:B.slate,borderRadius:8,padding:"0.85rem 1rem",marginBottom:"1.25rem"}}><span style={{fontSize:13,color:B.white}}>Supervisor assessment for: <strong>{supEmpName||supEmpEmail}</strong> {supEmpName?<span style={{opacity:0.6,fontSize:11}}>({supEmpEmail})</span>:""}</span></div>}
            {loadDraft()&&loadDraft().mode===surveyMode&&loadDraft().catIndex>0&&(
              <div style={S.warnBox}><p style={{fontSize:13,color:B.charcoal}}>📋 A saved draft was found. Your previous answers have been restored.</p></div>
            )}
            <div style={S.h3}>Before You Begin</div>
            <h2 style={S.h2}>Instructions & How to Get the Most from This Assessment</h2>
            <div style={S.divider}/>
            <div style={{...S.body,marginBottom:"1.25rem"}}>
              <p style={{marginBottom:"1rem"}}>This assessment gives you an <strong style={{color:B.navy}}>honest baseline</strong> of where you are today as a leader. It is not a test — it is a mirror. The more honest you are, the more useful your results will be.</p>
              <p style={{marginBottom:"1rem"}}>Five sections, each with 12 rating questions{surveyMode==="self"?" and 2 open-ended reflection questions":""}. {surveyMode==="self"?"Allow 25–40 minutes and complete it in one sitting.":"Rating questions only — approximately 10–15 minutes."}</p>
            </div>
            <div style={{background:B.mist,borderRadius:10,padding:"1.25rem 1.5rem",marginBottom:"1.25rem"}}>
              <div style={{...S.h3,color:B.teal,marginBottom:"0.75rem"}}>For the Rating Questions</div>
              <p style={{fontSize:14,lineHeight:1.7,color:B.charcoal}}>Trust your first instinct. Use a 1–5 scale. Answer based on how {surveyMode==="supervisor"?"this leader typically operates":"you actually lead on a typical day, not your best day"}.</p>
            </div>
            {surveyMode==="self"&&(
              <div style={{background:"#FDF9F3",border:`1.5px solid ${B.tealLt}`,borderRadius:10,padding:"1.25rem 1.5rem",marginBottom:"1.25rem"}}>
                <div style={{...S.h3,color:B.navy,marginBottom:"0.75rem"}}>⚠ For the Open-Ended Questions — Please Slow Down</div>
                <p style={{fontSize:14,lineHeight:1.7,color:B.charcoal,marginBottom:"0.75rem"}}>The AI evaluates the depth and specificity of your written answers. Thin or generic answers will lower your overall scores. There is a minimum length requirement — but aim well beyond it.</p>
                <p style={{fontSize:14,lineHeight:1.7,color:B.charcoal}}><strong>Before typing, pause and actually think.</strong> Name a real scenario. Describe what you did and why. Reflect honestly on what worked and what did not.</p>
              </div>
            )}
            <div style={{background:B.mist,borderRadius:10,padding:"1.25rem 1.5rem",marginBottom:"1.5rem"}}>
              <div style={{...S.h3,color:B.stone,marginBottom:"0.75rem"}}>Your Progress is Saved</div>
              <p style={{fontSize:14,lineHeight:1.7,color:B.charcoal}}>Your answers are saved as you go. If you accidentally close the browser, your draft will be waiting when you return.</p>
            </div>
            <button style={{...S.btnPrimary,width:"100%"}} onClick={()=>{setScreen("survey");scrollTop();}}>I'm Ready — Begin Assessment →</button>
          </div>
        </div>
      )}

      {/* SURVEY */}
      {screen==="survey"&&(
        <div style={S.container}>
          {/* v4 #4: stepper at very top so section title visible after scroll */}
          <Stepper current={catIndex} total={CATEGORIES.length}/>
          {surveyMode==="supervisor"&&<div style={{background:B.slate,borderRadius:6,padding:"0.6rem 1rem",marginBottom:"1rem"}}><span style={{fontSize:12,color:B.white}}>Assessing: <strong>{supEmpName||supEmpEmail}</strong></span></div>}
          <div style={S.h3}>Section {catIndex+1} of {CATEGORIES.length}</div>
          <h2 style={{...S.h2,color:CATEGORIES[catIndex].color,fontSize:26,marginBottom:"1rem"}}>{CATEGORIES[catIndex].label}</h2>
          <div style={S.divider}/>
          <div style={S.card}>
            <div style={S.h3}>Rating Questions</div>
            <p style={{fontSize:13,color:B.stone,marginBottom:"1.5rem",lineHeight:1.6}}>Rate each statement 1–5 based on {surveyMode==="supervisor"?"how this leader typically operates":"how you currently lead — not how you aspire to lead"}.</p>
            {CATEGORIES[catIndex].likert.map((q,qi)=>(
              <LikertRow key={qi} index={qi} text={q} value={likertAns[catIndex][qi]} disabled={submitting}
                onChange={v=>updateLikert(catIndex,qi,v)}/>
            ))}
          </div>
          {surveyMode==="self"&&(
            <div style={S.card}>
              <div style={S.h3}>Reflection Questions</div>
              <div style={{background:"#FDF9F3",border:`1px solid ${B.tealLt}`,borderRadius:8,padding:"0.85rem 1rem",marginBottom:"1.5rem"}}>
                <p style={{fontSize:13,color:B.charcoal,lineHeight:1.65}}><strong>Slow down here.</strong> Your written answers are scored for depth and specificity. A minimum of {MIN_QUAL_LENGTH} characters is required, but aim for at least {WARN_QUAL_LENGTH}+ with a real example.</p>
              </div>
              {CATEGORIES[catIndex].qualitative.map((q,qi)=>{
                const len = qualAns[catIndex][qi].length;
                const tooShort = len < MIN_QUAL_LENGTH;
                const borderColor = len===0?B.mist:tooShort?B.error:len<WARN_QUAL_LENGTH?B.warn:B.teal;
                return(
                  <div key={qi} style={{marginBottom:"1.5rem"}}>
                    <label style={{...S.label,marginBottom:8,lineHeight:1.6,fontSize:14}}>
                      <span style={{color:B.stone,marginRight:6}}>{qi+1}.</span>{q.question}
                    </label>
                    <textarea style={{...S.textarea,border:`1.5px solid ${borderColor}`}} value={qualAns[catIndex][qi]}
                      onChange={e=>updateQual(catIndex,qi,e.target.value)}
                      disabled={submitting}
                      placeholder={`Take your time. Include a specific example from your real leadership experience. Minimum ${MIN_QUAL_LENGTH} characters required.`}/>
                    <div style={{fontSize:11,color:tooShort?B.error:len<WARN_QUAL_LENGTH?B.warn:B.teal,marginTop:4}}>
                      {len} / {MIN_QUAL_LENGTH} minimum {len>=MIN_QUAL_LENGTH?"✓":`(${MIN_QUAL_LENGTH-len} more needed)`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {err&&<p style={{...S.errTxt,marginBottom:"1rem",fontSize:13}}>{err}</p>}
          <div style={{display:"flex",justifyContent:"flex-end"}}>
            <button style={{...S.btnPrimary,opacity:submitting?0.5:1}} disabled={submitting} onClick={nextSection}>
              {catIndex<CATEGORIES.length-1?`Next: Section ${catIndex+2} →`:"Submit Assessment →"}
            </button>
          </div>
        </div>
      )}

      {/* SCORING */}
      {screen==="scoring"&&(
        <div style={{...S.container,textAlign:"center",paddingTop:"5rem"}}>
          <div style={{width:52,height:52,borderRadius:"50%",border:`3px solid ${B.mist}`,borderTopColor:B.teal,margin:"0 auto 2rem",animation:"spin 1s linear infinite"}}/>
          <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
          <h2 style={{...S.h2,textAlign:"center"}}>Analyzing Your Results</h2>
          <p style={{...S.body,textAlign:"center",maxWidth:360,margin:"0.75rem auto"}}>{scoringMsg}</p>
          <div style={{maxWidth:320,margin:"1.5rem auto 0"}}>
            <div style={{height:4,background:B.mist,borderRadius:100,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${scoringTotal>0?(scoringStep/scoringTotal)*100:0}%`,background:B.teal,borderRadius:100,transition:"width 0.4s ease"}}/>
            </div>
            <div style={{fontSize:11,color:B.stone,marginTop:6}}>{scoringStep} of {scoringTotal} steps complete</div>
          </div>
          {scoringError&&(
            <div style={{...S.warnBox,maxWidth:400,margin:"1.5rem auto 0",textAlign:"left"}}>
              <p style={{fontSize:13,color:B.charcoal}}>{scoringError}</p>
            </div>
          )}
        </div>
      )}

      {/* RESULTS */}
      {screen==="results"&&(()=>{
        const r = window.__lt_results || attempts[attempts.length-1];
        if(!r) return <div style={S.container}><p>No results found. <span style={{color:B.teal,cursor:"pointer"}} onClick={()=>setScreen("dashboard")}>Back to dashboard</span></p></div>;
        const isSup = r.mode==="supervisor";
        const lowestCat = getLowestCategoryLabel(r);
        return(
          <div style={S.containerWide}>
            <div style={{...S.card,background:isSup?B.slate:B.navy,marginBottom:"2rem"}}>
              {isSup&&<div style={{display:"inline-block",background:B.tealLt,color:B.white,fontSize:10,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",padding:"4px 12px",borderRadius:100,marginBottom:10}}>Supervisor Assessment</div>}
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600,color:B.white,marginBottom:"0.5rem"}}>
                {isSup?`Assessment of ${r.empName||r.empEmail}`:"Your Leadership Assessment Results"}
              </div>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:"1.25rem"}}>{r.date}{user?.industry?` · ${user.industry}`:""}{ user?.role?` · ${shortenRole(user.role)}`:""}</p>
              <div style={{fontSize:36,fontWeight:600,fontFamily:"'Cormorant Garamond',serif",color:B.tealLt}}>
                {(r.categoryScores.reduce((a,b)=>a+b,0)/r.categoryScores.length).toFixed(1)}
                <span style={{fontSize:16,color:"rgba(255,255,255,0.4)",fontWeight:300}}> / 5.0 overall</span>
              </div>
            </div>

            {/* Summary + strengths/growth — IDENTICAL wording used for PDF */}
            <div style={S.card}>
              <div style={S.h3}>Personalized Summary</div>
              <p style={{...S.body,marginBottom:"1.5rem"}}>{r.summary?.narrative}</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
                <div style={{background:"#F0F7F5",borderRadius:10,padding:"1.25rem"}}>
                  <div style={{...S.h3,color:B.teal,marginBottom:"0.85rem"}}>{isSup?"Observed Strengths":"Top 3 Strengths"}</div>
                  {r.summary?.strengths?.map((s,i)=>(
                    <div key={i} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:B.teal,color:B.white,fontSize:11,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div>
                      <p style={{fontSize:14,color:B.charcoal,lineHeight:1.55}}>{s}</p>
                    </div>
                  ))}
                </div>
                <div style={{background:"#F4F6F8",borderRadius:10,padding:"1.25rem"}}>
                  <div style={{...S.h3,color:isSup?B.slate:B.navy,marginBottom:"0.85rem"}}>{isSup?"Coaching Opportunities":"Top 3 Growth Opportunities"}</div>
                  {r.summary?.growth?.map((g,i)=>(
                    <div key={i} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:isSup?B.slate:B.navy,color:B.white,fontSize:11,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div>
                      <p style={{fontSize:14,color:B.charcoal,lineHeight:1.55}}>{g}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={S.card}>
              <div style={S.h3}>Category Scores</div>
              <p style={{fontSize:13,color:B.stone,marginBottom:"1.25rem",lineHeight:1.6}}>
                {isSup?"Scores reflect supervisor ratings across all five leadership categories.":"Scores reflect your self-ratings moderated by the depth of your open-ended responses."}
              </p>
              {CATEGORIES.map((cat,ci)=><ScoreBar key={ci} label={cat.label} score={r.categoryScores[ci]} color={cat.color}/>)}
            </div>

            {/* v4 #1: Three-section qualitative feedback */}
            {!isSup&&r.qualAnswers&&(
              <div style={S.card}>
                <div style={S.h3}>Open-Ended Response Feedback</div>
                {CATEGORIES.map((cat,ci)=>(
                  <div key={ci} style={{marginBottom:"1.75rem"}}>
                    <div style={{fontSize:11,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:cat.color,marginBottom:"0.85rem"}}>{cat.label}</div>
                    {cat.qualitative.map((q,qi)=>{
                      const res=r.qualResults[ci*2+qi];
                      return(
                        <div key={qi} style={{background:B.mist,borderRadius:8,padding:"1rem 1.25rem",marginBottom:"0.85rem"}}>
                          <p style={{fontSize:13,fontWeight:500,color:B.charcoal,marginBottom:6,lineHeight:1.55}}>{q.question}</p>
                          <p style={{fontSize:13,color:B.slate,fontStyle:"italic",marginBottom:"1rem",lineHeight:1.65,borderLeft:`3px solid ${B.mist}`,paddingLeft:10}}>"{r.qualAnswers[ci]?.[qi]}"</p>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"0.75rem"}}>
                            <span style={S.pill(res?.score>=3?B.teal:res?.score>=2?B.stone:B.error)}>Depth Score: {res?.score}/4</span>
                          </div>
                          {/* Three labeled sections */}
                          <div style={{display:"grid",gap:"0.65rem"}}>
                            <div style={{background:B.white,borderRadius:6,padding:"0.75rem 1rem",borderLeft:`3px solid ${B.stone}`}}>
                              <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:B.stone,marginBottom:4}}>Why This Score</div>
                              <p style={{fontSize:13,color:B.charcoal,lineHeight:1.65}}>{res?.whyScore||res?.feedback||""}</p>
                            </div>
                            <div style={{background:B.white,borderRadius:6,padding:"0.75rem 1rem",borderLeft:`3px solid ${B.teal}`}}>
                              <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:B.teal,marginBottom:4}}>How to Improve</div>
                              <p style={{fontSize:13,color:B.charcoal,lineHeight:1.65}}>{res?.howToImprove||""}</p>
                            </div>
                            <div style={{background:B.white,borderRadius:6,padding:"0.75rem 1rem",borderLeft:`3px solid ${B.navy}`}}>
                              <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:B.navy,marginBottom:4}}>Leadership Reflection</div>
                              <p style={{fontSize:13,color:B.charcoal,lineHeight:1.65,fontStyle:"italic"}}>{res?.leadershipReflection||""}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* v4 #9: CTA card — self only, bronze accent, dynamic lowest category */}
            {!isSup&&(
              <div style={{...S.card,borderLeft:`4px solid ${B.bronze}`,background:"#FDFAF5",marginBottom:"1.25rem"}}>
                <div style={{...S.h3,color:B.bronze,marginBottom:"0.75rem"}}>Continue Your Growth</div>
                <h2 style={{...S.h2,fontSize:20,marginBottom:"0.5rem"}}>Leaders Together Cohort</h2>
                <p style={{fontSize:14,color:B.slate,lineHeight:1.7,marginBottom:"0.5rem"}}>
                  Based on your results, <strong style={{color:B.charcoal}}>{lowestCat}</strong> is your highest opportunity area. Leaders Together is a leadership cohort serving the Raleigh and Triangle area of North Carolina, designed specifically for managers like you — working through real challenges alongside a peer group with structured training and facilitated discussion.
                </p>
                <div style={{display:"flex",gap:12,marginTop:"1.25rem",flexWrap:"wrap",alignItems:"center"}}>
                  <a href="https://www.waymarklc.com/leaders-together" target="_blank" rel="noopener noreferrer"
                    style={{...S.btnBronze,textDecoration:"none",display:"inline-block"}}>
                    Learn About Leaders Together
                  </a>
                </div>
                <p style={{fontSize:12,color:B.stone,marginTop:"0.85rem",lineHeight:1.6}}>Waymark online courses — coming soon. As a registered participant, your email is on file and we will notify you when they launch.</p>
              </div>
            )}

            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <button style={S.btnPrimary} onClick={()=>setScreen("dashboard")}>Back to Dashboard</button>
              <button style={S.btnTeal} onClick={()=>generatePDF(r,user?.name,user?.industry,user?.role,isSup,r.empEmail||"",r.empName||"")}>Download PDF</button>
            </div>
          </div>
        );
      })()}

      {/* ADMIN */}
      {screen==="admin"&&isAdmin&&(
        <div style={S.containerWide}>
          <div style={{display:"flex",gap:10,marginBottom:"1.5rem",flexWrap:"wrap"}}>
            {["users","codes"].map(v=>(
              <button key={v} style={{...(adminView===v&&!adminTarget?S.btnPrimary:S.btnOutline),padding:"8px 18px",fontSize:11}} onClick={()=>{setAdminView(v);setAdminTarget(null);}}>
                {v==="users"?"Participants":"Supervisor Codes"}
              </button>
            ))}
            <button style={{...S.btnOutline,padding:"8px 18px",fontSize:11,marginLeft:"auto"}} onClick={loadAdminData}>↻ Refresh</button>
          </div>

          {adminLoading&&<div style={{textAlign:"center",padding:"2rem",color:B.stone}}>Loading…</div>}

          {/* Participant table — v4 #11: cohort checkbox + industry/role columns + CSV export */}
          {adminView==="users"&&!adminTarget&&!adminLoading&&(
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"1rem",flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={S.h3}>Admin Console</div>
                  <h1 style={{...S.h1,marginBottom:0}}>All Participants</h1>
                </div>
                <button style={{...S.btnTeal,fontSize:11,padding:"8px 16px"}} onClick={exportCSV}>↓ Export CSV</button>
              </div>
              <div style={{...S.card,overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead>
                    <tr style={{borderBottom:`2px solid ${B.mist}`}}>
                      {["Name","Email","Type","Industry","Role","Attempts","Avg Score","Cohort","Suspended","Actions"].map(h=>(
                        <th key={h} style={{padding:"8px 10px",textAlign:"left",fontSize:10,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",color:B.stone,whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.length===0&&<tr><td colSpan={10} style={{padding:"2rem",textAlign:"center",color:B.stone,fontStyle:"italic"}}>No participants yet.</td></tr>}
                    {allUsers.map((u,i)=>{
                      const last=u.attempts[u.attempts.length-1];
                      const avg=last?(last.categoryScores.reduce((a,b)=>a+b,0)/last.categoryScores.length).toFixed(1):"—";
                      return(
                        <tr key={i} style={{borderBottom:`1px solid ${B.mist}`,opacity:u.suspended?0.55:1,background:u.suspended?"#FFF8F7":"transparent"}}>
                          <td style={{padding:"10px 10px",fontWeight:500,color:B.navy,whiteSpace:"nowrap"}}>{u.name}</td>
                          <td style={{padding:"10px 10px",color:B.slate,fontSize:12}}>{u.email}</td>
                          <td style={{padding:"10px 10px",whiteSpace:"nowrap"}}><span style={S.pill(u.isSupervisor?B.slate:u.tier==="cohort"?B.teal:B.stone)}>{u.isSupervisor?"Supervisor":u.tier}</span></td>
                          <td style={{padding:"10px 10px",fontSize:12,color:B.stone}}>{u.industry||"—"}</td>
                          <td style={{padding:"10px 10px",fontSize:12,color:B.stone}}>{u.role||"—"}</td>
                          <td style={{padding:"10px 10px",textAlign:"center"}}>{u.attempts.length}</td>
                          <td style={{padding:"10px 10px",fontWeight:600,color:B.teal}}>{avg}</td>
                          {/* v4 #11: cohort checkbox */}
                          <td style={{padding:"10px 10px",textAlign:"center"}}>
                            <input type="checkbox" checked={!!u.cohort} onChange={()=>toggleCohort(u.email)} style={{cursor:"pointer",width:16,height:16}} title={u.cohort?"Remove from cohort":"Mark as cohort member"}/>
                          </td>
                          <td style={{padding:"10px 10px",textAlign:"center"}}>
                            <input type="checkbox" checked={!!u.suspended} onChange={()=>toggleSuspend(u.email)} style={{cursor:"pointer",width:16,height:16}}/>
                          </td>
                          <td style={{padding:"10px 10px"}}>
                            <div style={{display:"flex",gap:6,whiteSpace:"nowrap"}}>
                              {(u.attempts.length>0||(u.supAttempts&&Object.keys(u.supAttempts).length>0))&&(
                                <button style={S.btnSmall} onClick={()=>setAdminTarget(u)}>View →</button>
                              )}
                              <button style={{...S.btnSmall,background:B.error}} onClick={()=>setModal({
                                title:"Delete Participant",
                                message:`This will permanently delete ${u.name} (${u.email}) and all their assessment history. This cannot be undone.`,
                                confirmLabel:"Delete Permanently",confirmColor:B.error,
                                onConfirm:()=>deleteUser(u.email),
                                onCancel:()=>setModal(null),
                              })}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Participant detail */}
          {adminView==="users"&&adminTarget&&(
            <>
              <button style={{...S.btnOutline,marginBottom:"1.5rem"}} onClick={()=>setAdminTarget(null)}>← All Participants</button>
              <div style={{...S.card,background:B.navy,marginBottom:"1.5rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                  <div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:B.white,marginBottom:4}}>{adminTarget.name}</div>
                    <div style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>{adminTarget.email} · {adminTarget.isSupervisor?"Supervisor":adminTarget.tier} · {adminTarget.industry} · {adminTarget.role}</div>
                  </div>
                  {adminTarget.suspended&&<span style={S.pill(B.error)}>Suspended</span>}
                </div>
              </div>

              {adminTarget.attempts.length>0&&(
                <>
                  <div style={{...S.h3,color:B.navy,marginBottom:"1rem",borderBottom:`2px solid ${B.navy}`,paddingBottom:8}}>Self-Assessments ({adminTarget.attempts.length})</div>
                  <div style={S.card}>
                    <div style={S.h3}>Score History</div>
                    {CATEGORIES.map((cat,ci)=>(
                      <div key={ci} style={{marginBottom:"1.25rem"}}>
                        <div style={{fontSize:12,fontWeight:500,color:B.stone,marginBottom:8}}>{cat.label}</div>
                        <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                          {adminTarget.attempts.map((att,ai)=>{
                            const score=att.categoryScores[ci];
                            const pct=(score/5)*100;
                            return(
                              <div key={ai} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:1,maxWidth:80}}>
                                <div style={{fontSize:11,fontWeight:600,color:cat.color}}>{score.toFixed(1)}</div>
                                <div style={{width:"100%",height:48,background:B.mist,borderRadius:4,overflow:"hidden",display:"flex",alignItems:"flex-end"}}>
                                  <div style={{width:"100%",height:`${pct}%`,background:cat.color}}/>
                                </div>
                                <div style={{fontSize:10,color:B.stone}}>{att.date}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  {[...adminTarget.attempts].reverse().map((att,ai)=>(
                    <div key={ai} style={S.card}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"1rem"}}>
                        <div style={{fontWeight:600,color:B.navy}}>Self-Assessment {adminTarget.attempts.length-ai} — {att.date}</div>
                        <div style={{fontWeight:600,color:B.teal}}>{(att.categoryScores.reduce((a,b)=>a+b,0)/att.categoryScores.length).toFixed(1)} / 5</div>
                      </div>
                      {CATEGORIES.map((cat,ci)=><ScoreBar key={ci} label={cat.label} score={att.categoryScores[ci]} color={cat.color}/>)}
                      {att.summary&&<div style={{background:B.mist,borderRadius:8,padding:"1rem",marginTop:"1rem"}}><div style={{...S.h3,marginBottom:6}}>AI Summary</div><p style={{fontSize:13,color:B.slate,lineHeight:1.7}}>{att.summary.narrative}</p></div>}
                      <button style={{...S.btnSmall,background:B.teal,marginTop:"0.75rem"}} onClick={()=>generatePDF(att,adminTarget.name,adminTarget.industry,adminTarget.role)}>Download PDF</button>
                      <div style={{marginTop:"1.25rem",background:B.mist,borderRadius:8,padding:"1rem"}}>
  <div style={{...S.h3,marginBottom:"0.5rem"}}>Reset Password</div>
  <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
    <input style={{...S.input,maxWidth:220}} type="password" value={adminResetEmail===adminTarget.email?adminResetPass:""} onChange={e=>{setAdminResetEmail(adminTarget.email);setAdminResetPass(e.target.value);setAdminResetMsg("");}} placeholder="Set new password"/>
    <button style={S.btnSmall} onClick={async()=>{
      if(!adminResetPass||adminResetPass.length<6){setAdminResetMsg("Min 6 characters."); return;}
      const users=await dbGet("users")||{};
      if(!users[adminTarget.email]){setAdminResetMsg("User not found."); return;}
      users[adminTarget.email].password=adminResetPass;
      await dbSet("users",users);
      setAdminResetPass(""); setAdminResetMsg("Password reset successfully.");
    }}>Reset</button>
  </div>
  {adminResetMsg&&<p style={{fontSize:12,color:adminResetMsg.includes("success")?B.teal:B.error,marginTop:6}}>{adminResetMsg}</p>}
</div>
                    </div>
                  ))}
                </>
              )}

              {/* Supervisor assessments */}
              {(()=>{
                const sups=allUsers.filter(u=>u.isSupervisor&&u.supAttempts&&u.supAttempts[adminTarget.email]);
                if(sups.length===0) return null;
                return(
                  <>
                    <div style={{...S.divider,margin:"2rem 0"}}/>
                    <div style={{...S.h3,color:B.slate,marginBottom:"1rem",borderBottom:`2px solid ${B.slate}`,paddingBottom:8}}>Supervisor Assessments of {adminTarget.name}</div>
                    {sups.map((sup,si)=>(
                      <div key={si} style={{marginBottom:"1.5rem"}}>
                        <div style={{background:B.mist,borderRadius:8,padding:"0.75rem 1rem",marginBottom:"0.75rem",display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                          <span style={S.pill(B.slate)}>Supervisor</span>
                          <span style={{fontSize:13,fontWeight:500,color:B.navy}}>{sup.name}</span>
                          <span style={{fontSize:12,color:B.stone}}>{sup.email}</span>
                          {sup.suspended&&<span style={S.pill(B.error)}>Suspended</span>}
                        </div>
                        {sup.supAttempts[adminTarget.email].map((att,ai)=>(
                          <div key={ai} style={{...S.card,borderLeft:`3px solid ${B.slate}`}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"1rem"}}>
                              <div style={{fontWeight:600,color:B.navy}}>Supervisor Assessment {ai+1} — {att.date}</div>
                              <div style={{fontWeight:600,color:B.teal}}>{(att.categoryScores.reduce((a,b)=>a+b,0)/att.categoryScores.length).toFixed(1)} / 5</div>
                            </div>
                            {CATEGORIES.map((cat,ci)=><ScoreBar key={ci} label={cat.label} score={att.categoryScores[ci]} color={cat.color}/>)}
                            {att.summary&&<div style={{background:B.mist,borderRadius:8,padding:"1rem",marginTop:"1rem"}}><div style={{...S.h3,marginBottom:6}}>Supervisor Summary</div><p style={{fontSize:13,color:B.slate,lineHeight:1.7}}>{att.summary.narrative}</p></div>}
                            <button style={{...S.btnSmall,background:B.slate,marginTop:"0.75rem"}} onClick={()=>generatePDF(att,adminTarget.name,adminTarget.industry,adminTarget.role,true,adminTarget.email,att.empName||adminTarget.name)}>Download PDF</button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </>
                );
              })()}
            </>
          )}

          {/* Supervisor codes */}
          {adminView==="codes"&&(
            <>
              <div style={S.h3}>Admin Console</div>
              <h1 style={{...S.h1,marginBottom:"0.5rem"}}>Supervisor Access Codes</h1>
              <p style={{...S.body,marginBottom:"1.5rem",maxWidth:540}}>Generate single-use codes to give to supervisors. Each code can only be used by one person. Once registered, the code is permanently consumed.</p>
              <button style={S.btnTeal} onClick={genSupCode}>+ Generate New Code</button>
              <div style={{...S.card,marginTop:"1.5rem",overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead>
                    <tr style={{borderBottom:`2px solid ${B.mist}`}}>
                      {["Code","Status","Used By","Created"].map(h=>(
                        <th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",color:B.stone}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {supCodes.length===0&&<tr><td colSpan={4} style={{padding:"2rem",textAlign:"center",color:B.stone,fontStyle:"italic"}}>No codes generated yet.</td></tr>}
                    {[...supCodes].reverse().map((c,i)=>(
                      <tr key={i} style={{borderBottom:`1px solid ${B.mist}`,opacity:c.used?0.6:1}}>
                        <td style={{padding:"10px 12px",fontFamily:"monospace",fontWeight:700,color:B.navy,letterSpacing:"0.12em",fontSize:14}}>{c.code}</td>
                        <td style={{padding:"10px 12px"}}><span style={S.pill(c.used?B.stone:B.teal)}>{c.used?"Used":"Available"}</span></td>
                        <td style={{padding:"10px 12px",fontSize:12,color:B.slate}}>{c.usedBy||"—"}</td>
                        <td style={{padding:"10px 12px",fontSize:12,color:B.stone}}>{c.created?new Date(c.created).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
