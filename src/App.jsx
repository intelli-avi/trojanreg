import { useState, useEffect, useRef } from "react";

const C        = "#990000";
const DARK_C   = "#6b0000";
const GOLD     = "#FFCC00";
const CREAM    = "#faf7f2";
const WHITE    = "#ffffff";
const NEAR_BLACK = "#111111";

function useFadeIn(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}
function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, visible] = useFadeIn();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      ...style
    }}>{children}</div>
  );
}

function Bar({ pct, color = C }) {
  return (
    <div style={{ background: "#e5e5e5", borderRadius: 4, height: 5, width: "100%" }}>
      <div style={{ width: `${pct}%`, background: color, height: 5, borderRadius: 4 }} />
    </div>
  );
}
function GradeChip({ g }) {
  const a = ["A","A+","A-"], b = ["B+","B","B-"];
  const col = a.includes(g) ? "#1a7a3a" : b.includes(g) ? "#7a5c00" : "#555";
  const bg  = a.includes(g) ? "#e6f4ea" : b.includes(g) ? "#fef9e7" : "#f0f0f0";
  return <span style={{ background: bg, color: col, fontWeight: 700, fontSize: 11, padding: "1px 7px", borderRadius: 4, fontFamily: "monospace" }}>{g}</span>;
}
function StatusBadge({ s }) {
  const m = {
    ok:      { bg: "#e6f4ea", color: "#1a7a3a", label: "Satisfied" },
    partial: { bg: "#fef9e7", color: "#7a5c00", label: "In Progress" },
    no:      { bg: "#fde8e8", color: C,          label: "Required" },
  };
  const { bg, color, label } = m[s];
  return <span style={{ background: bg, color, fontWeight: 700, fontSize: 11, padding: "2px 9px", borderRadius: 99, fontFamily: "monospace", whiteSpace: "nowrap" }}>{label}</span>;
}
function Divider() { return <div style={{ height: 1, background: "#e8e2d9" }} />; }

function DifficultyBadge({ level, phase }) {
  const styles = {
    "Very Easy": { bg: "#e6f4ea", color: "#1a7a3a", dot: "#22c55e" },
    "Easy":      { bg: "#e6f4ea", color: "#1a7a3a", dot: "#22c55e" },
    "Medium":    { bg: "#fef9e7", color: "#7a5c00", dot: "#f59e0b" },
    "Complex":   { bg: "#fde8e8", color: C,          dot: C          },
  };
  const s = styles[level];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: s.bg, borderRadius: 8, padding: "6px 14px" }}>
      <div style={{ width: 7, height: 7, borderRadius: 4, background: s.dot }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>Implementation: {level}</span>
      <span style={{ fontSize: 11, color: s.color, opacity: .7 }}>&mdash; {phase}</span>
    </div>
  );
}

// ── Mini tech block shown at the bottom of each section ───────────────────────
function MiniTech({ items }) {
  return (
    <div style={{ marginTop: 28, borderTop: "1px solid #e8e2d9", paddingTop: 24 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Technical Architecture</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map(({ label, tech, note }) => (
          <div key={label} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#f9f7f4", border: "1px solid #ede8e0", borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ minWidth: 130, fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: .5, paddingTop: 1 }}>{label}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: C, fontWeight: 700, marginBottom: 3 }}>{tech}</div>
              <div style={{ fontSize: 12, color: "#777", lineHeight: 1.6 }}>{note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionBlock({ number, title, difficulty, phase, problem, approach, integration, miniTech, children, bg = WHITE }) {
  return (
    <section style={{ background: bg, padding: "80px 0" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 28px" }}>

        <FadeIn>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 14 }}>
            <div style={{
              background: C, color: "#fff",
              fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 18,
              width: 50, height: 50, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{number}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 28, color: NEAR_BLACK, lineHeight: 1.1 }}>{title}</div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <DifficultyBadge level={difficulty} phase={phase} />
          </div>
        </FadeIn>

        <FadeIn delay={80}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div style={{ background: "#fdf3f3", borderLeft: `3px solid ${C}`, borderRadius: 10, padding: "16px 18px" }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: C, letterSpacing: 1.8, textTransform: "uppercase", marginBottom: 6 }}>The Problem</div>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.65 }}>{problem}</div>
            </div>
            <div style={{ background: "#f3faf3", borderLeft: "3px solid #2a7a3a", borderRadius: 10, padding: "16px 18px" }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#2a7a3a", letterSpacing: 1.8, textTransform: "uppercase", marginBottom: 6 }}>Our Approach</div>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.65 }}>{approach}</div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={140}>
          <div style={{ background: WHITE, border: "1px solid #e0dbd2", borderRadius: 8, padding: "10px 16px", marginBottom: 36, display: "inline-flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: C }} />
            <span style={{ fontSize: 12, color: "#555" }}><strong style={{ color: NEAR_BLACK }}>Integration: </strong>{integration}</span>
          </div>
        </FadeIn>

        <FadeIn delay={180}>
          <div style={{ borderTop: "1px solid #e8e2d9", paddingTop: 28 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>Working Prototype</div>
            {children}
          </div>
        </FadeIn>

        <FadeIn delay={220}>
          <MiniTech items={miniTech} />
        </FadeIn>

      </div>
    </section>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const STUDENT = {
  name: "Avi Chopra", id: "6072838601",
  degree: "BS – Artificial Intelligence for Business",
  level: "Junior", graduation: "May 14, 2027",
  gpa: "3.740", majorGpa: "3.838",
  unitsEarned: 83, unitsInProgress: 31, unitsNeeded: 14, unitsTotal: 128,
};
const COMPLETED = [
  { term:"Fall 2023",  code:"BUAD312", units:4, grade:"B+", title:"Statistics and Data Science" },
  { term:"Fall 2023",  code:"MATH125", units:4, grade:"A",  title:"Calculus I" },
  { term:"Fall 2023",  code:"WRIT150", units:4, grade:"A",  title:"Writing and Critical Reasoning" },
  { term:"Spr 2024",   code:"BUAD304", units:4, grade:"B+", title:"Organizational Behavior and Leadership" },
  { term:"Spr 2024",   code:"CSCI103", units:4, grade:"B+", title:"Introduction to Programming" },
  { term:"Spr 2024",   code:"ECON351", units:4, grade:"A",  title:"Microeconomics for Business" },
  { term:"Spr 2024",   code:"GESM120", units:4, grade:"A-", title:"Seminar in Humanistic Inquiry" },
  { term:"Fall 2024",  code:"BUAD280", units:3, grade:"A",  title:"Introduction to Financial Accounting" },
  { term:"Fall 2024",  code:"BUAD302", units:4, grade:"A-", title:"Communication Strategy in Business" },
  { term:"Fall 2024",  code:"CSCI170", units:4, grade:"B",  title:"Discrete Methods in Computer Science" },
  { term:"Fall 2024",  code:"ITP 449", units:4, grade:"A",  title:"Applications of Machine Learning" },
  { term:"Spr 2025",   code:"BUAD307", units:4, grade:"A",  title:"Marketing Fundamentals" },
  { term:"Spr 2025",   code:"BUAD308", units:4, grade:"A",  title:"Advanced Business Finance" },
  { term:"Spr 2025",   code:"BUAD313", units:4, grade:"A",  title:"Advanced Operations Management" },
  { term:"Spr 2025",   code:"CSCI104", units:4, grade:"B-", title:"Data Structures and Object-Oriented Design" },
  { term:"Fall 2025",  code:"CSCI360", units:4, grade:"A",  title:"Artificial Intelligence: Principles" },
  { term:"Fall 2025",  code:"DSO 429", units:4, grade:"A",  title:"Digital Transformation of Business" },
  { term:"Fall 2025",  code:"MOR 458", units:2, grade:"A",  title:"AI Technology Strategic Management" },
  { term:"Fall 2025",  code:"MUSC320", units:4, grade:"A",  title:"Hip-hop Music and Culture" },
];
const REQUIREMENTS = [
  { label:"128-Unit Minimum",                   status:"partial", detail:"114 / 128 (earned + in-progress)", pct:89 },
  { label:"64-Unit Residency",                  status:"ok",      detail:"64 USC units earned" },
  { label:"32-Unit Upper Division",             status:"ok",      detail:"32+ upper division units earned" },
  { label:"Cumulative GPA 2.0+",               status:"ok",      detail:"3.740" },
  { label:"Major Core Requirements",            status:"partial", detail:"BUAD497, EIS 370 in progress", pct:87 },
  { label:"Upper Division Writing (WRIT340)",   status:"no",      detail:"Not yet enrolled — required before graduation" },
  { label:"GE Category B – Humanistic Inquiry", status:"partial", detail:"1 of 2 courses satisfied", pct:50 },
  { label:"GE Category C – Social Analysis",    status:"partial", detail:"SSCI214 in progress; 1 more needed", pct:50 },
  { label:"GE Category D – Life Sciences",      status:"partial", detail:"DANC305 in progress (Fall 2026)", pct:75 },
  { label:"GE Category E – Physical Sciences",  status:"no",      detail:"Not started — 1 course required" },
  { label:"GE Category H – Global Perspectives",status:"no",      detail:"Not started — 1 course required" },
  { label:"Accounting Requirement",             status:"partial", detail:"BUAD280 complete; BUAD281 in progress", pct:75 },
];
const EXAMS = [
  { code:"ECON352", title:"Macroeconomics for Business",       days:"MWF · 10:00 AM", examDay:"Mon, May 11", examTime:"8:00–10:00 AM", rule:"10 AM MWF rule" },
  { code:"TAC 259", title:"Basics of Artificial Intelligence", days:"TTh · 2:00 PM",  examDay:"Thu, May 7",  examTime:"2:00–4:00 PM",  rule:"1:30–2:30 PM TTh rule" },
  { code:"BUAD281", title:"Intro to Managerial Accounting",    days:"—",              examDay:"Sat, May 9",  examTime:"11 AM–1:00 PM", rule:"Published exception", exception: true },
  { code:"DSO 488", title:"Hands-on AI for Business",         days:"TTh · 11:00 AM", examDay:"Tue, May 12", examTime:"11 AM–1:00 PM", rule:"11 AM TTh rule" },
  { code:"BUAD104", title:"Intl. Business (once-weekly)",      days:"W · 4:00 PM+",   examDay:"—",           examTime:"First class period during finals week", rule:"Once-weekly after 4 PM", noExam: true },
];

// ── Prototypes ────────────────────────────────────────────────────────────────
function StarsPrototype() {
  const pct = Math.round(((STUDENT.unitsEarned + STUDENT.unitsInProgress) / STUDENT.unitsTotal) * 100);
  return (
    <div>
      <div style={{ background:`linear-gradient(135deg,${C},${DARK_C})`, borderRadius:14, padding:"22px 28px", color:"#fff", marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 }}>
        <div>
          <div style={{ fontSize:10, opacity:.55, letterSpacing:2, textTransform:"uppercase", marginBottom:5 }}>Parsed from STARS · April 13, 2026</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:22 }}>{STUDENT.name}</div>
          <div style={{ fontSize:13, opacity:.8, marginTop:2 }}>{STUDENT.degree}</div>
          <div style={{ fontSize:11, opacity:.5, marginTop:2 }}>ID {STUDENT.id} · {STUDENT.level} · Expected May 2027</div>
        </div>
        <div style={{ display:"flex", gap:22 }}>
          {[["GPA",STUDENT.gpa],["Major GPA",STUDENT.majorGpa],["Semesters Left",3]].map(([l,v]) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:24, fontWeight:800, color:GOLD }}>{v}</div>
              <div style={{ fontSize:9, opacity:.5, textTransform:"uppercase", letterSpacing:1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:"#f9f7f4", borderRadius:12, padding:"16px 20px", marginBottom:12, border:"1px solid #ede8e0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontWeight:700, fontSize:14 }}>Unit Progress</span>
          <span style={{ fontSize:12, color:"#999" }}>{STUDENT.unitsEarned+STUDENT.unitsInProgress} / {STUDENT.unitsTotal}</span>
        </div>
        <Bar pct={pct} />
        <div style={{ display:"flex", gap:16, marginTop:10, flexWrap:"wrap" }}>
          {[["Earned",STUDENT.unitsEarned,C],["In Progress",STUDENT.unitsInProgress,"#e6a817"],["Still Needed",STUDENT.unitsNeeded,"#bbb"]].map(([l,v,col]) => (
            <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:8, height:8, borderRadius:2, background:col }}/>
              <span style={{ fontSize:12, color:"#555" }}><strong>{v}</strong> {l}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:"#f9f7f4", borderRadius:12, padding:"16px 20px", marginBottom:12, border:"1px solid #ede8e0" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:15, marginBottom:12 }}>Graduation Requirements</div>
        {REQUIREMENTS.map(r => (
          <div key={r.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, paddingBottom:9, marginBottom:9, borderBottom:"1px solid #ede8e0" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600, color:NEAR_BLACK, marginBottom:2 }}>{r.label}</div>
              <div style={{ fontSize:11, color:"#aaa" }}>{r.detail}</div>
              {r.pct && <div style={{ marginTop:5 }}><Bar pct={r.pct} color={r.status==="partial"?"#e6a817":C}/></div>}
            </div>
            <StatusBadge s={r.status}/>
          </div>
        ))}
      </div>
      <div style={{ background:"#f9f7f4", borderRadius:12, padding:"16px 20px", border:"1px solid #ede8e0", overflowX:"auto" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:15, marginBottom:12 }}>Completed Coursework</div>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead><tr>
            {["Term","Code","Title","Units","Grade"].map(h => (
              <th key={h} style={{ textAlign:"left", padding:"6px 10px", color:"#bbb", fontWeight:600, fontSize:10, textTransform:"uppercase", borderBottom:"1px solid #ede8e0" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {COMPLETED.map((c,i) => (
              <tr key={i}>
                <td style={{ padding:"7px 10px", color:"#bbb", whiteSpace:"nowrap" }}>{c.term}</td>
                <td style={{ padding:"7px 10px", fontFamily:"monospace", fontWeight:700, color:C, whiteSpace:"nowrap" }}>{c.code}</td>
                <td style={{ padding:"7px 10px", color:"#444" }}>{c.title}</td>
                <td style={{ padding:"7px 10px", textAlign:"center", color:"#888" }}>{c.units}</td>
                <td style={{ padding:"7px 10px" }}><GradeChip g={c.grade}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExamPrototype() {
  const calDays = [
    {label:"Wed",date:"May 6"},{label:"Thu",date:"May 7"},{label:"Fri",date:"May 8"},
    {label:"Sat",date:"May 9"},{label:"Mon",date:"May 11"},{label:"Tue",date:"May 12"},{label:"Wed",date:"May 13"},
  ];
  return (
    <div>
      <div style={{ background:"#fef9e7", border:"1px solid #e6d77a", borderRadius:8, padding:"10px 16px", marginBottom:16, fontSize:12, color:"#6b5000" }}>
        <strong>Source:</strong> USC Office of Academic Records &amp; Registrar — <em>arr.usc.edu/final-exam-schedule</em> &middot; Finals Week: May 6–13, 2026.
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
        {EXAMS.map(e => (
          <div key={e.code} style={{ background:"#f9f7f4", border:"1px solid #ede8e0", borderRadius:10, padding:"13px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:3 }}>
                <span style={{ fontFamily:"monospace", fontWeight:800, color:C, fontSize:13 }}>{e.code}</span>
                <span style={{ fontSize:13, color:"#444" }}>{e.title}</span>
                {e.exception && <span style={{ background:"#ede9fe", color:"#6d28d9", fontSize:10, fontWeight:700, padding:"1px 7px", borderRadius:99 }}>Published Exception</span>}
              </div>
              <div style={{ fontSize:11, color:"#bbb" }}>Meets {e.days} &nbsp;&middot;&nbsp; Rule: {e.rule}</div>
            </div>
            {e.noExam
              ? <span style={{ color:"#1a7a3a", fontWeight:700, fontSize:12 }}>No standard final</span>
              : <div style={{ textAlign:"right" }}>
                  <div style={{ fontWeight:700, color:NEAR_BLACK, fontSize:13 }}>{e.examDay}</div>
                  <div style={{ fontSize:12, color:"#888" }}>{e.examTime}</div>
                </div>
            }
          </div>
        ))}
      </div>
      <div style={{ background:"#f9f7f4", borderRadius:12, border:"1px solid #ede8e0", padding:"18px 20px" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:15, color:NEAR_BLACK, marginBottom:14 }}>Finals Week Visual</div>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {calDays.map(({label,date}) => {
            const num  = date.split(" ")[1];
            const hits = EXAMS.filter(e => !e.noExam && e.examDay.includes(date));
            const has  = hits.length > 0;
            return (
              <div key={date} style={{ flex:1, minWidth:70, borderRadius:10, overflow:"hidden", border:`1px solid ${has?"#ccc":"#eee"}` }}>
                <div style={{ background:has?C:"#f0ede8", color:has?"#fff":"#ccc", textAlign:"center", padding:"8px 4px" }}>
                  <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>{label}</div>
                  <div style={{ fontSize:16, fontWeight:800 }}>{num}</div>
                </div>
                <div style={{ padding:5, minHeight:36, background:has?"#fef2f2":"#fafaf8" }}>
                  {hits.map(e => <div key={e.code} style={{ background:C, color:"#fff", borderRadius:4, padding:"2px 4px", fontSize:9, fontWeight:700, marginBottom:2, textAlign:"center" }}>{e.code}</div>)}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop:12, padding:"10px 14px", background:"#edf7ed", borderRadius:8, fontSize:12, color:"#2a6a2a" }}>
          No final exam conflicts detected across this course load.
        </div>
      </div>
    </div>
  );
}

function ValidatorPrototype() {
  const [raw,setRaw] = useState("CSCI310\nBUAD425\nITP 460\nWRIT340\nCHEM105a");
  const results = [
    { code:"CSCI310",  title:"Software Engineering",    status:"warn",  items:["Prereq CSCI104 — satisfied (B-)","D-clearance required — contact Viterbi advising"] },
    { code:"BUAD425",  title:"Business Analytics",      status:"error", items:["Prereq BUAD313 — satisfied","Section is full — consider waitlist or alternate section","Removing this course will not affect your other submissions"] },
    { code:"ITP 460",  title:"Web Technologies & Apps", status:"ok",    items:["All prerequisites satisfied","No D-clearance required","Seats available — eligible to register"] },
    { code:"WRIT340",  title:"Advanced Writing",        status:"ok",    items:["Prereq WRIT150 — satisfied (A)","Fulfills outstanding Upper Division Writing requirement — strongly recommended"] },
    { code:"CHEM105a", title:"General Chemistry I",     status:"error", items:["Restricted to Science/Engineering degree programs","Would not apply toward BUAI degree requirements"] },
  ];
  const cm = { ok:["#f3faf3","#2a7a3a","Eligible"], warn:["#fef9e7","#7a5c00","Review needed"], error:["#fdf3f3",C,"Not eligible"] };
  return (
    <div>
      <div style={{ background:"#141e2b", borderRadius:12, overflow:"hidden", marginBottom:16 }}>
        <div style={{ background:"#0f1821", padding:"8px 16px", display:"flex", alignItems:"center", gap:6 }}>
          {["#ff5f56","#ffbd2e","#27c93f"].map(col => <div key={col} style={{ width:9, height:9, borderRadius:5, background:col }}/>)}
          <span style={{ fontSize:10, color:"#4b5563", marginLeft:8, fontFamily:"monospace" }}>my.usc.edu/portal/oasis/webreg — Shopping Cart</span>
        </div>
        <div style={{ padding:"14px 18px" }}>
          <div style={{ fontSize:9, color:"#4b5563", letterSpacing:1.2, textTransform:"uppercase", marginBottom:10 }}>Spring 2026 — Course Validation Active</div>
          {[
            {code:"ITP 460",  title:"Web Technologies & Apps",  ok:true,  msg:null},
            {code:"WRIT340",  title:"Advanced Writing",          ok:true,  msg:null},
            {code:"BUAD425",  title:"Business Analytics",        ok:false, msg:"Section full"},
            {code:"CSCI310",  title:"Software Engineering",      ok:null,  msg:"D-clearance required"},
            {code:"CHEM105a", title:"General Chemistry I",       ok:false, msg:"Program restriction"},
          ].map(c => {
            const bg  = c.ok===true?"#182b18":c.ok===false?"#2b1818":"#261e10";
            const bdr = c.ok===true?"#2a7a3a":c.ok===false?C:"#c09000";
            const dot = c.ok===true?"#4ade80":c.ok===false?"#f87171":"#fbbf24";
            const tc  = c.ok===true?"#86efac":c.ok===false?"#fca5a5":"#fde68a";
            return (
              <div key={c.code} style={{ background:bg, border:`1px solid ${bdr}44`, borderRadius:8, padding:"10px 14px", marginBottom:5, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <span style={{ fontFamily:"monospace", fontWeight:700, color:tc, fontSize:13 }}>{c.code}</span>
                  <span style={{ color:"#6b7280", fontSize:12, marginLeft:10 }}>{c.title}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  {c.msg && <span style={{ fontSize:11, color:tc, fontStyle:"italic" }}>{c.msg}</span>}
                  <div style={{ width:7, height:7, borderRadius:4, background:dot }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ background:"#f9f7f4", borderRadius:12, border:"1px solid #ede8e0", padding:"16px 20px", marginBottom:12 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:15, color:NEAR_BLACK, marginBottom:10 }}>Validation Detail</div>
        <textarea value={raw} onChange={e=>setRaw(e.target.value)}
          style={{ width:"100%", height:80, fontFamily:"monospace", fontSize:12, border:"1px solid #ddd", borderRadius:8, padding:10, resize:"vertical", outline:"none", boxSizing:"border-box", background:WHITE }}/>
        <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}>
          <button style={{ background:C, color:"#fff", border:"none", borderRadius:8, padding:"9px 20px", fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>Validate</button>
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {results.map(r => {
          const [bg,col,lbl] = cm[r.status];
          return (
            <div key={r.code} style={{ background:WHITE, borderRadius:10, border:"1px solid #ede8e0", overflow:"hidden" }}>
              <div style={{ background:bg, padding:"10px 18px", display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontFamily:"monospace", fontWeight:800, color:col, fontSize:13 }}>{r.code}</span>
                <span style={{ fontSize:13, color:"#555" }}>{r.title}</span>
                <span style={{ marginLeft:"auto", fontSize:11, fontWeight:700, color:col }}>{lbl}</span>
              </div>
              <div style={{ padding:"10px 18px" }}>
                {r.items.map((it,i) => (
                  <div key={i} style={{ fontSize:12, color:"#666", padding:"4px 0", borderBottom:i<r.items.length-1?"1px solid #f5f5f5":"none" }}>&mdash; {it}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WhatIfPrototype() {
  const [scenario,setScenario] = useState("base");
  const plans = {
    base: [
      {term:"Spring 2026 (Current)", courses:["BUAD281","DSO 488","ECON352","TAC 259"], units:15, color:C, flag:null},
      {term:"Fall 2026",             courses:["BUAD497","EIS 370","SSCI214","DANC305"], units:16, color:"#e6a817", flag:null},
      {term:"Spring 2027",           courses:["WRIT340","GE-E (Physical Sci.)","GE-H (Global Persp.)","Elective"], units:14, color:"#bbb", flag:null},
    ],
    minor: [
      {term:"Spring 2026 (Current)", courses:["BUAD281","DSO 488","ECON352","TAC 259"], units:15, color:C, flag:null},
      {term:"Fall 2026",             courses:["BUAD497","EIS 370","SSCI214","DANC305","CS Minor: CSCI401"], units:20, color:"#e6a817", flag:"Heavy load — 20 units. Consider dropping an elective."},
      {term:"Spring 2027",           courses:["WRIT340","GE-E Course","GE-H Course","CS Minor: CSCI499"], units:16, color:"#bbb", flag:"Minor complete at graduation."},
    ],
    abroad: [
      {term:"Spring 2026 (Current)",  courses:["BUAD281","DSO 488","ECON352","TAC 259"], units:15, color:C, flag:null},
      {term:"Fall 2026 (Abroad)",     courses:["GE-B abroad","GE-C abroad","Free Elective abroad"], units:12, color:"#7c3aed", flag:"Verify transfer credit approval before enrolling."},
      {term:"Spring 2027",            courses:["BUAD497","EIS 370","WRIT340","GE-E","GE-H"], units:18, color:"#e6a817", flag:"Heavier semester — 18 units to stay on track."},
      {term:"Fall 2027 (additional)", courses:["Any outstanding requirements"], units:4, color:"#ddd", flag:"Graduation delayed to December 2027."},
    ],
  };
  const roadmap = plans[scenario];
  const delayed = scenario==="abroad";
  return (
    <div>
      <div style={{ background:"#f9f7f4", borderRadius:12, border:"1px solid #ede8e0", padding:"16px 20px", marginBottom:16 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:15, color:NEAR_BLACK, marginBottom:12 }}>Scenario</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
          {[["base","Current Plan"],["minor","Add CS Minor"],["abroad","Study Abroad (Fall 2026)"]].map(([k,l]) => (
            <button key={k} onClick={()=>setScenario(k)} style={{
              padding:"8px 18px", borderRadius:8, fontWeight:600, fontSize:13, cursor:"pointer",
              border:scenario===k?`2px solid ${C}`:"1px solid #ddd",
              background:scenario===k?"#fdf3f3":WHITE, color:scenario===k?C:"#666",
              fontFamily:"'DM Sans',sans-serif"
            }}>{l}</button>
          ))}
        </div>
        {scenario==="minor"  && <div style={{ fontSize:12, color:"#2a7a3a", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:8, padding:"9px 13px" }}>CS Minor adds approximately 2 required courses. Feasible given your CSCI background — system flags the unit overload in Fall 2026 automatically.</div>}
        {scenario==="abroad" && <div style={{ fontSize:12, color:"#6d28d9", background:"#f5f3ff", border:"1px solid #ddd6fe", borderRadius:8, padding:"9px 13px" }}>One semester abroad pushes graduation to December 2027 under a standard load. System flags this and suggests unit adjustments.</div>}
      </div>
      <div style={{ background:"#f9f7f4", borderRadius:12, border:"1px solid #ede8e0", padding:"18px 20px", marginBottom:14 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:15, color:NEAR_BLACK, marginBottom:18 }}>Generated Path to Graduation</div>
        {roadmap.map((t,i) => (
          <div key={t.term} style={{ display:"flex", gap:14 }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:18, flexShrink:0 }}>
              <div style={{ width:12, height:12, borderRadius:6, background:t.color, marginTop:2, flexShrink:0 }}/>
              {i<roadmap.length-1 && <div style={{ width:2, flex:1, background:"#ddd", margin:"4px 0" }}/>}
            </div>
            <div style={{ flex:1, paddingBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                <span style={{ fontWeight:700, fontSize:13, color:NEAR_BLACK }}>{t.term}</span>
                <span style={{ fontSize:12, color:"#bbb" }}>{t.units} units</span>
              </div>
              {t.flag && (
                <div style={{ fontSize:11, color:t.flag.includes("December")?"#991b1b":"#7a5c00", background:t.flag.includes("December")?"#fde8e8":"#fef9e7", borderRadius:5, padding:"2px 9px", marginBottom:5, display:"inline-block", fontWeight:600 }}>{t.flag}</div>
              )}
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {t.courses.map(c => <span key={c} style={{ background:WHITE, border:"1px solid #e0dbd2", borderRadius:6, padding:"4px 9px", fontFamily:"monospace", fontSize:11, color:"#555" }}>{c}</span>)}
              </div>
            </div>
          </div>
        ))}
        <div style={{ marginTop:8, padding:"12px 16px", background:delayed?"#fef9e7":"#edf7ed", borderRadius:10, fontSize:12, color:delayed?"#7a5c00":"#2a6a2a" }}>
          {delayed
            ? "Graduation delayed to December 2027. Carrying additional units in Spring 2027 could restore the May timeline."
            : "On track to graduate May 2027. No requirement conflicts detected."}
        </div>
      </div>
    </div>
  );
}

// ── Per-section tech data ─────────────────────────────────────────────────────
const TECH_STARS = [
  { label:"PDF Extraction",  tech:"PyMuPDF",                       note:"Handles layout-aware text extraction from the STARS PDF, preserving the structure of requirement blocks and course rows." },
  { label:"Parsing / NLP",   tech:"GPT-4o with structured outputs",note:"Interprets semi-structured STARS text semantically — maps requirement status codes, course flags, and GPA fields to a typed Pydantic schema." },
  { label:"Backend",         tech:"FastAPI (Python)",               note:"Exposes a /parse endpoint that accepts a PDF upload and returns a validated JSON object consumed by the frontend dashboard." },
  { label:"Frontend",        tech:"React",                         note:"Renders the requirement dashboard, unit progress bars, and course history table. State is derived entirely from the parsed STARS JSON." },
];
const TECH_EXAM = [
  { label:"Data Source",     tech:"arr.usc.edu/final-exam-schedule", note:"The Registrar publishes a deterministic mapping of class meeting time + day to exam slot each semester. Parsed once per term and stored as a lookup table." },
  { label:"Lookup Logic",    tech:"Python rule engine",             note:"Given a course's meeting days and start time, the engine applies the standard grid rules and then checks the exceptions table — no ML required, pure logic." },
  { label:"Schedule Source", tech:"classes.usc.edu scrape",        note:"Meeting days and times are pulled from the Schedule of Classes for each course in the student's cart and fed into the lookup engine." },
  { label:"Frontend",        tech:"React (inline in WebReg)",      note:"The finals calendar re-renders live as courses are added or removed from the shopping cart. No page reload required." },
];
const TECH_VALIDATOR = [
  { label:"Prereq Data",     tech:"catalogue.usc.edu scrape",      note:"USC Course Catalogue is publicly available. Nightly scrape keeps prerequisite trees, co-requisite rules, and D-clearance flags current." },
  { label:"Seat Availability",tech:"classes.usc.edu scrape",       note:"Real-time section data including enrollment counts and capacity. Refreshed frequently during registration periods." },
  { label:"Eligibility Rules",tech:"Rule-based engine (Python)",   note:"Checks each course independently against the student's completed units, passed prerequisites, degree program, and D-clearance status. Returns a structured result per course." },
  { label:"Frontend",        tech:"React overlay on WebReg grid",  note:"Ineligible courses rendered in a muted state with inline tooltip — no separate page or tool to open." },
];
const TECH_WHATIF = [
  { label:"Requirement Graph",tech:"Python graph traversal",        note:"BUAI degree requirements encoded as a directed graph. Traversal identifies which nodes are satisfied, in-progress, or outstanding for a given student." },
  { label:"Course Options",   tech:"catalogue.usc.edu",            note:"For each unsatisfied requirement node, the Catalogue is queried to find valid courses the student is eligible to take." },
  { label:"Solver",           tech:"OR-Tools CSP (Phase 3)",       note:"Constraint-satisfaction solver sequences eligible courses across available semesters, respecting unit limits and prerequisites. Re-solves on any scenario change." },
  { label:"Scenario Engine",  tech:"FastAPI + React state",        note:"Each scenario (major change, minor addition, abroad gap) modifies the constraint set and triggers a re-solve. Results stream back to the frontend in real time." },
];

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled,setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll",fn);
    return () => window.removeEventListener("scroll",fn);
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:CREAM, fontFamily:"'DM Sans',sans-serif", color:NEAR_BLACK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box} body{margin:0}
        ::selection{background:${GOLD};color:${DARK_C}}
        button{font-family:'DM Sans',sans-serif}
      `}</style>

      {/* Nav */}
      <div style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        background:scrolled?"rgba(153,0,0,0.97)":"transparent",
        backdropFilter:scrolled?"blur(8px)":"none",
        transition:"background 0.3s ease, box-shadow 0.3s ease",
        boxShadow:scrolled?"0 1px 12px rgba(0,0,0,0.2)":"none",
        height:56, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px"
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ background:GOLD, color:C, fontWeight:900, fontSize:13, padding:"3px 8px", borderRadius:5 }}>USC</div>
          <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:16, color:"#fff" }}>TrojanReg</span>
        </div>
        <span style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>BUAI Builder Hub &mdash; Profs. Gupta &amp; Javanmard</span>
      </div>

      {/* Hero */}
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:`linear-gradient(160deg,${DARK_C} 0%,${C} 60%,#c41a1a 100%)`, padding:"100px 28px 80px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", border:"1px solid rgba(255,204,0,0.07)", top:"50%", left:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", width:1000, height:1000, borderRadius:"50%", border:"1px solid rgba(255,204,0,0.03)", top:"50%", left:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none" }}/>
        <div style={{ maxWidth:680, position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-block", background:"rgba(255,204,0,0.12)", border:"1px solid rgba(255,204,0,0.25)", borderRadius:99, padding:"5px 18px", fontSize:11, color:GOLD, letterSpacing:2, textTransform:"uppercase", marginBottom:28 }}>Thank you for shortlisting me</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:800, fontSize:52, lineHeight:1.1, color:"#fff", marginBottom:20 }}>Hi, Profs. Vishal<br />&amp; Javanmard.</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:22, color:"rgba(255,255,255,0.6)", marginBottom:32 }}>Let's get into this.</div>
          <div style={{ fontSize:15, color:"rgba(255,255,255,0.68)", lineHeight:1.85, marginBottom:52, maxWidth:520, margin:"0 auto 52px" }}>
            I reviewed the project brief, thought through the registration experience from a student's perspective, and put together a working proposal for TrojanReg — covering all four pain points you identified, with working prototypes where possible and a clear technical plan throughout.
          </div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)", letterSpacing:1, textTransform:"uppercase" }}>Scroll to explore</div>
          <div style={{ width:1, height:40, background:"rgba(255,255,255,0.12)", margin:"10px auto 0" }}/>
        </div>
      </div>

      {/* Overview */}
      <div style={{ background:NEAR_BLACK, padding:"80px 28px" }}>
        <div style={{ maxWidth:820, margin:"0 auto" }}>
          <FadeIn>
            <div style={{ fontSize:10, letterSpacing:2.5, textTransform:"uppercase", color:GOLD, marginBottom:16 }}>The Finding</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:32, color:"#fff", lineHeight:1.3, marginBottom:16 }}>Four distinct pain points. Each solvable with a targeted intervention.</div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.8, marginBottom:48, maxWidth:560 }}>
              Each solution slots into a system students already use — STARS, WebReg, and Advise USC. Implementation is sequenced by complexity: the first two are shippable in weeks; the last arrives once the foundation is solid.
            </div>
          </FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[
              ["01","STARS Analysis",    "Parsing a degree report shouldn't need a decoder ring.",            "Sits inside Advise USC",  "Very Easy",  "#22c55e"],
              ["02","Exam Preview",      "Finals conflicts are invisible at the moment you register.",        "New tab in WebReg",       "Easy",       "#22c55e"],
              ["03","Course Validator",  "One invalid course rejecting an entire batch costs students seats.","Inline in WebReg grid",   "Medium",     "#f59e0b"],
              ["04","What-If Planner",   "Scenario planning shouldn't require a human appointment.",          "Sits inside Advise USC",  "Complex",    C        ],
            ].map(([num,title,desc,tag,diff,dotCol],i) => (
              <FadeIn key={num} delay={80*i}>
                <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"20px 22px", height:"100%" }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:800, fontSize:26, color:C, marginBottom:8 }}>{num}</div>
                  <div style={{ fontWeight:700, fontSize:14, color:"#fff", marginBottom:6 }}>{title}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.65, marginBottom:14 }}>{desc}</div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    <div style={{ fontSize:10, background:"rgba(255,204,0,0.08)", border:"1px solid rgba(255,204,0,0.15)", borderRadius:99, padding:"3px 10px", color:GOLD }}>{tag}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(255,255,255,0.06)", borderRadius:99, padding:"3px 10px" }}>
                      <div style={{ width:6, height:6, borderRadius:3, background:dotCol }}/>
                      <span style={{ fontSize:10, color:"rgba(255,255,255,0.5)" }}>{diff}</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      <Divider/>

      <SectionBlock number="01" title="STARS Analysis" difficulty="Very Easy" phase="Ship in Phase 1"
        problem="Students manually interpret a dense, color-coded STARS PDF to understand their degree progress — often missing sub-requirements, GPA thresholds, or the distinction between 'in progress' and 'satisfied.' Advising appointments are frequently spent just establishing shared ground on where the student stands."
        approach="Parse the uploaded STARS PDF using an LLM-assisted extraction pipeline, then render a clean interactive dashboard: unit progress, GPA, every graduation requirement color-coded by status, and a plain-English summary of what still needs to be done."
        integration="Advise USC — this view lives inside the Advise USC portal so advisors and students see identical, real-time data during appointments, turning discovery time into decision-making time"
        miniTech={TECH_STARS}
        bg={WHITE}>
        <StarsPrototype/>
      </SectionBlock>

      <Divider/>

      <SectionBlock number="02" title="Exam Preview" difficulty="Easy" phase="Ship in Phase 1"
        problem="Students who strategically stack classes on two days often create a grueling finals schedule without realizing it. This conflict is invisible during registration — by the time they discover it, adjusting is difficult."
        approach="For any proposed course list, automatically derive each course's final exam slot from the Registrar's published grid: meeting days + class start time map deterministically to an exam slot, with the published exception table applied where relevant."
        integration="WebReg — an 'Exam Preview' tab inside WebReg refreshes the finals calendar live as courses are added to or removed from the shopping cart"
        miniTech={TECH_EXAM}
        bg={CREAM}>
        <ExamPrototype/>
      </SectionBlock>

      <Divider/>

      <SectionBlock number="03" title="Course Validator" difficulty="Medium" phase="Phase 2 — after core is stable"
        problem="WebReg's all-or-nothing batch rejection means a single invalid course can cause a student to lose seats in every course they were trying to register for simultaneously. Students often don't know which course caused the failure or why."
        approach="Validate each course independently against the student's profile before they submit: prerequisites, co-requisites, D-clearance requirements, seat availability, and degree-program eligibility — flagged per course, not per batch."
        integration="WebReg — ineligible or flagged courses appear in a visually distinct, muted state directly in the registration grid, with an inline tooltip explaining the specific issue"
        miniTech={TECH_VALIDATOR}
        bg={WHITE}>
        <ValidatorPrototype/>
      </SectionBlock>

      <Divider/>

      <SectionBlock number="04" title="What-If Planner" difficulty="Complex" phase="Phase 3 — once foundation is complete"
        problem="Exploring a major change, adding a minor, or planning around a study abroad semester requires scheduling a human advising appointment. Advisor capacity is a real constraint — students can't easily run through scenarios before they're ready to commit."
        approach="Let students simulate any academic scenario against their parsed STARS data. The system maps remaining requirements, layers in new constraints, and generates a revised semester-by-semester graduation path using a constraint-satisfaction solver that re-runs on any change."
        integration="Advise USC — students arrive at appointments with a pre-generated scenario plan, allowing advisors to focus on refining and approving rather than building from scratch"
        miniTech={TECH_WHATIF}
        bg={CREAM}>
        <WhatIfPrototype/>
      </SectionBlock>

      <Divider/>

      {/* Best Qualified */}
      <section style={{ background:NEAR_BLACK, padding:"80px 28px" }}>
        <div style={{ maxWidth:820, margin:"0 auto" }}>
          <FadeIn>
            <div style={{ fontSize:10, letterSpacing:2.5, textTransform:"uppercase", color:GOLD, marginBottom:14 }}>Where I fit</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:32, color:"#fff", lineHeight:1.3, marginBottom:16 }}>I'm happy to contribute across all of it.</div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.8, marginBottom:36, maxWidth:600 }}>
              I have production-level experience across the full stack — from LLM-based document extraction and backend API design through to deployed, user-facing web applications. I'd rather go wherever is most useful to the team.
            </div>
          </FadeIn>
          <FadeIn delay={80}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
              {[
                ["AI & Extraction Layer","Built DocExtract — an AI document extraction platform with 15+ pilots across 8 industries. The STARS parser is this exact problem: semi-structured PDF in, typed structured data out."],
                ["Backend Development","Production Python services using FastAPI and Django, deployed on AWS. Built and maintained agentic backend systems at Refundly and across my own ventures."],
                ["Frontend & Product","Build user-facing interfaces and think in terms of the full user experience. The prototypes on this page are a working example of that approach."],
                ["Deployment & Infrastructure","AWS deployment, environment management, CI/CD pipelines. Know how to take something from a working prototype to a running, maintained service."],
              ].map(([title,body]) => (
                <div key={title} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"20px 22px" }}>
                  <div style={{ fontWeight:700, fontSize:13, color:"#fff", marginBottom:8 }}>{title}</div>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)", lineHeight:1.65 }}>{body}</div>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={140}>
            <div style={{ background:"rgba(255,204,0,0.06)", border:"1px solid rgba(255,204,0,0.15)", borderRadius:12, padding:"18px 22px", fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:1.75 }}>
              If a starting point is needed: the STARS extraction layer is where I have the most directly applicable prior work, and getting that right is what makes everything else possible — but I'm genuinely glad to work wherever the team needs coverage.
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Closing */}
      <section style={{ background:`linear-gradient(160deg,${DARK_C},${C})`, padding:"80px 28px", textAlign:"center" }}>
        <div style={{ maxWidth:560, margin:"0 auto" }}>
          <FadeIn>
            <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:800, fontSize:38, color:"#fff", lineHeight:1.2, marginBottom:16 }}>Looking forward to hopefully working with you.</div>
            <div style={{ fontSize:15, color:"rgba(255,255,255,0.6)", lineHeight:1.8, marginBottom:44 }}>
              If you have any questions about this proposal or would like to discuss any section before the interview, please don't hesitate to reach out.
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              <a href="mailto:avichopr@usc.edu" style={{ background:WHITE, color:C, textDecoration:"none", fontWeight:700, fontSize:14, padding:"14px 28px", borderRadius:10, display:"inline-block" }}>avichopr@usc.edu</a>
              <a href="tel:+12136568616" style={{ background:"rgba(255,255,255,0.12)", color:"#fff", textDecoration:"none", fontWeight:700, fontSize:14, padding:"14px 28px", borderRadius:10, border:"1px solid rgba(255,255,255,0.2)", display:"inline-block" }}>+1 (213) 656-8616</a>
            </div>
          </FadeIn>
          <FadeIn delay={180}>
            <div style={{ marginTop:48, fontSize:11, color:"rgba(255,255,255,0.28)" }}>
              Avi Chopra &nbsp;&middot;&nbsp; USC Class of 2027 &nbsp;&middot;&nbsp; BUAI Builder Hub
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
