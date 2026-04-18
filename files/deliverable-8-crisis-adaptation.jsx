import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";

const C = {
  bg: "#0c0a0a",
  card: "#181414",
  cardAlt: "#221c1c",
  border: "#3a2828",
  text: "#f0e8e8",
  muted: "#9a8888",
  red: "#ef4444",
  redSoft: "rgba(239,68,68,0.12)",
  redHot: "#dc2626",
  orange: "#f59e0b",
  orangeSoft: "rgba(245,158,11,0.10)",
  yellow: "#facc15",
  yellowSoft: "rgba(250,204,21,0.08)",
  green: "#34d399",
  greenSoft: "rgba(52,211,153,0.10)",
  blue: "#60a5fa",
  blueSoft: "rgba(96,165,250,0.10)",
  purple: "#a78bfa",
  emergency: "#dc2626",
  emergencySoft: "rgba(220,38,38,0.08)",
  amber: "#f59e0b",
};

// --- CRISIS DATA ---

const crisisEvents = [
  {
    id: 1, severity: "CRITICAL", icon: "⛈",
    title: "Severe Weather — 60 Displaced Residents",
    detail: "Red Cross activation. 60 displaced residents entering the shelter network. 211 Kansas is overloaded — call queue exceeding capacity during Mon–Fri 7 AM–7 PM window.",
    systemImpact: "Absorbs remaining 17 reachable beds + requires overflow. 211 queue backs up behind emergency caseload.",
  },
  {
    id: 2, severity: "CRITICAL", icon: "🏚",
    title: "Open Door Offline — Emergency Roof Repair",
    detail: "Highest-volume walk-in hub (80-120 daily contacts) closed 48-72 hours. Center of Hope (400 N Emporia) absorbing overflow at reduced hours (9 AM–3 PM).",
    systemImpact: "~100 daily contacts have no primary walk-in site. Document navigators deployed at Open Door must relocate. VI-SPDAT assessments shift to Second Light and Center of Hope.",
  },
  {
    id: 3, severity: "HIGH", icon: "🏠",
    title: "CrossRoads at 1/12 Beds — 4 Foster Youth Incoming",
    detail: "DCF flagged 4 transition-age youth whose placements were disrupted by the weather. Expected to present within 72 hours. BRIDGES has zero vacancy.",
    systemImpact: "1 CrossRoads bed serves 1 youth. 3 youth need emergency placement. Adult shelters are the default — youth typically refuse. Bridge Beds Fund must activate.",
  },
];

// Bed allocation during crisis
const bedAllocation = [
  { site: "Union Rescue Mission", normal: 10, crisis: 0, note: "Full — absorbing displaced single men. Sobriety policy still applies.", pop: "Single men" },
  { site: "CrossRoads", normal: 2, crisis: 1, note: "1 bed holds for first youth arrival. 3 remaining youth need bridge beds.", pop: "Youth 18-24" },
  { site: "St. Anthony (13 units)", normal: 1, crisis: 0, note: "Absorbing displaced families. Case-by-case felony screening applies.", pop: "Families" },
  { site: "Salvation Army", normal: 4, crisis: 0, note: "Absorbing displaced families + single women. Full.", pop: "Families + single women" },
  { site: "Family Promise", normal: 2, crisis: 0, note: "Phone intake queue backed up 3+ weeks. Absorbing displaced families.", pop: "Families w/ children" },
  { site: "HumanKind Villas", normal: 31, crisis: 20, note: "Waitlist 8-12 wks. Some units redirected to emergency placements.", pop: "Adults 18+" },
  { site: "MHA", normal: 2, crisis: 2, note: "Unaffected — SMI population, COMCARE referral still required.", pop: "Adults w/ SMI" },
  { site: "Bridge Beds (PILOT)", normal: 0, crisis: 10, note: "ACTIVATED — hotel/flex vouchers for 4 youth + 6 displaced adults. $62K fund.", pop: "Youth + overflow" },
];

const normalTotal = bedAllocation.reduce((s, b) => s + b.normal, 0);
const crisisTotal = bedAllocation.reduce((s, b) => s + b.crisis, 0);

// Intervention adaptations
const adaptations = [
  {
    intervention: "Document Navigators (2 FTE)",
    normalOp: "Embedded at Open Door + Second Light + Center of Hope",
    crisisOp: "RELOCATED: Both navigators to Center of Hope (primary) + Second Light (secondary). Open Door is offline.",
    status: "adapted", urgency: "immediate",
    budgetImpact: "$0 — same staff, different location",
  },
  {
    intervention: "After-Hours & Weekend Routing (4 PT staff)",
    normalOp: "Overnight + weekend coverage at Open Door + Second Light",
    crisisOp: "REDEPLOYED: 2 of 4 staff shifted to daytime surge at Center of Hope to handle Open Door overflow. Remaining 2 hold overnight/weekend. 211 overload makes after-hours routing critical.",
    status: "critical", urgency: "immediate",
    budgetImpact: "$0 — reallocation, not additional spend",
  },
  {
    intervention: "Transit Pass Fund ($30K)",
    normalOp: "200 passes distributed at intake sites",
    crisisOp: "SURGE DISTRIBUTION: Emergency batch of 30 passes to Center of Hope + Second Light. Displaced residents and redirected Open Door clients need transit to reach alternate sites. Open Door clients may not know where Center of Hope is.",
    status: "adapted", urgency: "24hr",
    budgetImpact: "$1,500 from existing fund (30 × $50)",
  },
  {
    intervention: "Emergency Bridge Beds ($62K)",
    normalOp: "Flex fund for when CrossRoads/BRIDGES full",
    crisisOp: "FULLY ACTIVATED: 4 hotel vouchers for youth (CrossRoads overflow) + 6 vouchers for displaced adults who don't meet shelter eligibility (single men w/ substance use — no low-barrier option). This is exactly the scenario this fund was designed for.",
    status: "critical", urgency: "immediate",
    budgetImpact: "$8,600 — 10 beds × $86/night × 10 nights (est. surge duration)",
  },
  {
    intervention: "Youth Age-21 Bridge ($60K)",
    normalOp: "Extended case management past 21 for 42 youth",
    crisisOp: "PRIORITY ESCALATION: 4 disrupted youth get immediate case-manager assignment from the bridge pool. Age-21 bridge clients are not displaced — they maintain priority but do not consume crisis resources.",
    status: "adapted", urgency: "24hr",
    budgetImpact: "$0 — existing case managers, reprioritized caseload",
  },
  {
    intervention: "NEXTenant Landlord Incentives ($78K)",
    normalOp: "30 placements × $2,600/placement",
    crisisOp: "UNCHANGED in crisis window. Housing placements continue as pipeline allows. Weather-displaced residents are temporary — they return home after repairs. Landlord incentives target long-term homeless, not disaster displacement.",
    status: "unchanged", urgency: "none",
    budgetImpact: "$0",
  },
  {
    intervention: "KanCare Navigator (1 FTE)",
    normalOp: "Re-enrollment support at Second Light",
    crisisOp: "EXPANDED SCOPE: Navigator proactively contacts displaced residents to prevent KanCare auto-disenrollment from address change. Same failure mode as chronic homelessness — weather displacement triggers the same administrative cliff.",
    status: "adapted", urgency: "48hr",
    budgetImpact: "$0 — same staff, expanded client list",
  },
  {
    intervention: "SNAP Training ($8K)",
    normalOp: "Train 40 intake staff on expedited processing",
    crisisOp: "ACCELERATED: Displaced residents qualify for 7-day expedited SNAP. Training investment pays off NOW — intake staff at Center of Hope and Second Light should be flagging every displaced contact for expedited processing.",
    status: "critical", urgency: "immediate",
    budgetImpact: "$0 — training already delivered",
  },
];

// 72-hour timeline
const timeline = [
  { hour: "0-6", phase: "TRIAGE", actions: [
    "Activate Bridge Beds Fund — authorize 10 hotel vouchers",
    "Relocate both document navigators from Open Door to Center of Hope",
    "Shift 2 after-hours staff to daytime surge at Center of Hope",
    "Emergency transit pass batch to Center of Hope + Second Light (30 passes)",
  ]},
  { hour: "6-24", phase: "STABILIZE", actions: [
    "Assign 1 CrossRoads bed to first arriving foster youth",
    "Place remaining 3 youth in hotel voucher beds with case-manager check-in",
    "KanCare navigator begins proactive outreach to displaced residents",
    "Intake staff at Center of Hope + Second Light flag all displaced for expedited SNAP",
  ]},
  { hour: "24-48", phase: "REROUTE", actions: [
    "Assess Open Door repair timeline — if >48 hrs, extend Center of Hope hours",
    "211 queue monitoring — if wait exceeds 30 min, route walkers directly to Second Light",
    "SOUL Family custodian contacted for 4 foster youth (legal permanency pipeline)",
    "Begin housing search for 3 hotel-voucher youth via NEXTenant before voucher expires",
  ]},
  { hour: "48-72", phase: "RECOVER", actions: [
    "Open Door reopens (projected) — navigators return, intake resumes",
    "Displaced residents begin returning to repaired housing — beds free up",
    "4 foster youth have confirmed 30-day plan (CrossRoads or extended voucher)",
    "After-action review — document what worked, what broke, update KPI tracking",
  ]},
];

// Youth priority queue
const youthQueue = [
  { id: "Y1", status: "Arriving", placement: "CrossRoads — Bed 12 (last available)", caseMgr: "Assigned from bridge pool", nextStep: "VI-SPDAT + document intake within 6 hrs" },
  { id: "Y2", status: "Expected <24 hrs", placement: "Hotel voucher (Bridge Beds Fund)", caseMgr: "Assigned from bridge pool", nextStep: "CrossRoads waitlist + BRIDGES waitlist + NEXTenant referral" },
  { id: "Y3", status: "Expected <48 hrs", placement: "Hotel voucher (Bridge Beds Fund)", caseMgr: "Assigned from bridge pool", nextStep: "CrossRoads waitlist + SOUL Family custodian referral" },
  { id: "Y4", status: "Expected <72 hrs", placement: "Hotel voucher (Bridge Beds Fund)", caseMgr: "Assigned from bridge pool", nextStep: "CrossRoads waitlist + DCF IL enrollment verification" },
];

function StatusBadge({ status }) {
  const config = {
    critical: { bg: C.redSoft, color: C.red, label: "CRITICAL" },
    adapted: { bg: C.orangeSoft, color: C.orange, label: "ADAPTED" },
    unchanged: { bg: C.greenSoft, color: C.green, label: "UNCHANGED" },
  };
  const s = config[status] || config.adapted;
  return (
    <span style={{ background: s.bg, color: s.color, padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: "monospace", letterSpacing: 0.5 }}>{s.label}</span>
  );
}

export default function CrisisAdaptation() {
  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>

      {/* EMERGENCY HEADER */}
      <div style={{
        background: `linear-gradient(135deg, #1a0505 0%, ${C.bg} 100%)`,
        borderBottom: `3px solid ${C.emergency}`,
        padding: "28px 36px 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{
            background: C.emergency, color: "#fff", padding: "4px 14px", borderRadius: 5,
            fontFamily: "monospace", fontSize: 12, fontWeight: 800, letterSpacing: 2,
            animation: "pulse 2s infinite",
          }}>
            ⚠ EMERGENCY MODE
          </div>
          <span style={{ color: C.muted, fontSize: 12, fontFamily: "monospace" }}>System status: STRAINED → CRISIS · 1:00 PM update</span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: -0.3 }}>
          Crisis Adaptation Dashboard
        </h1>
        <p style={{ color: C.muted, fontSize: 14, marginTop: 6, maxWidth: 800 }}>
          Severe weather + Open Door offline + CrossRoads near-full — how the pilot reroutes without collapsing the system.
        </p>
      </div>

      <div style={{ padding: "24px 36px", maxWidth: 1260, margin: "0 auto" }}>

        {/* ANALYTICAL HOOK */}
        <div style={{
          background: `linear-gradient(135deg, ${C.emergencySoft} 0%, ${C.orangeSoft} 100%)`,
          border: `1.5px solid ${C.emergency}`, borderLeft: `5px solid ${C.emergency}`,
          borderRadius: 10, padding: "20px 26px", marginBottom: 24,
        }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: C.emergency, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>▸ Adaptation Principle</div>
          <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.5 }}>
            The pilot's funded interventions are <span style={{ color: C.amber }}>the crisis response</span> — not a separate emergency plan.
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 8, lineHeight: 1.6 }}>
            Bridge Beds Fund ($62K) was designed for exactly this scenario. After-Hours staffing (4 PT staff) can be redeployed to daytime surge. Document navigators are mobile — they move to whichever site is open. Transit passes get people to alternate locations. The $500K pilot budget absorbs this crisis with <strong style={{ color: C.text }}>$8,600 in incremental cost</strong> (10 hotel-voucher bed-nights) and <strong style={{ color: C.text }}>zero new hires</strong>.
            <br /><br />
            Foster youth are prioritized through the existing bridge pool — <strong style={{ color: C.text }}>not</strong> by converting the system to youth-only. The 60 displaced adults are served through the same rerouted pipeline. The system flexes; it doesn't fragment.
          </div>
        </div>

        {/* 3 CRISIS EVENTS */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
          {crisisEvents.map(e => (
            <div key={e.id} style={{
              flex: "1 1 300px", background: C.card,
              border: `1px solid ${e.severity === "CRITICAL" ? C.red : C.orange}40`,
              borderTop: `3px solid ${e.severity === "CRITICAL" ? C.red : C.orange}`,
              borderRadius: 8, padding: "16px 20px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{e.icon}</span>
                <span style={{
                  background: e.severity === "CRITICAL" ? C.redSoft : C.orangeSoft,
                  color: e.severity === "CRITICAL" ? C.red : C.orange,
                  padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 800, fontFamily: "monospace",
                }}>{e.severity}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>{e.title}</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, marginBottom: 8 }}>{e.detail}</div>
              <div style={{ fontSize: 11, color: C.red, fontStyle: "italic" }}>Impact: {e.systemImpact}</div>
            </div>
          ))}
        </div>

        {/* BED ALLOCATION TABLE */}
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, fontFamily: "monospace" }}>
            Bed Reallocation — Normal vs. Crisis
          </h2>
          <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: C.cardAlt }}>
                  {["Site", "Population", "Open (Pre-Crisis)", "Open (Crisis)", "Status"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, fontFamily: "monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, color: C.muted, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bedAllocation.map((b, i) => (
                  <tr key={i} style={{ background: b.site.includes("PILOT") ? C.greenSoft : i % 2 === 0 ? C.card : C.bg, borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: b.site.includes("PILOT") ? C.green : C.text }}>{b.site}</td>
                    <td style={{ padding: "10px 12px", fontSize: 11, color: C.muted }}>{b.pop}</td>
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", fontWeight: 700, color: C.muted }}>{b.normal}</td>
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", fontWeight: 700, color: b.crisis === 0 ? C.red : b.crisis >= 10 ? C.green : C.orange }}>{b.crisis}</td>
                    <td style={{ padding: "10px 12px", color: C.muted, fontSize: 11, maxWidth: 300 }}>{b.note}</td>
                  </tr>
                ))}
                <tr style={{ background: C.cardAlt, borderTop: `2px solid ${C.border}` }}>
                  <td style={{ padding: "10px 12px", fontWeight: 800 }}>TOTAL</td>
                  <td />
                  <td style={{ padding: "10px 12px", fontFamily: "monospace", fontWeight: 800, color: C.orange }}>{normalTotal}</td>
                  <td style={{ padding: "10px 12px", fontFamily: "monospace", fontWeight: 800, color: C.red }}>{crisisTotal}</td>
                  <td style={{ padding: "10px 12px", color: C.red, fontSize: 11, fontWeight: 700 }}>
                    {crisisTotal - normalTotal < 0 ? `${normalTotal - crisisTotal} beds lost` : ""} — Bridge Beds Fund adds 10 flex beds
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 8, fontStyle: "italic", padding: "8px 12px", background: C.cardAlt, borderRadius: 6 }}>
            Note: "Open" = beds not currently occupied. Del. 1 reported 17 "reachable" beds (no referral gate, sobriety screen, or population restriction). This table shows all open beds regardless of access barriers because the crisis forces the system to use every available slot, barriers included.
          </div>
        </div>
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, fontFamily: "monospace" }}>
            Foster Youth Priority Queue — 4 Incoming
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
            {youthQueue.map((y, i) => (
              <div key={i} style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderLeft: `4px solid ${i === 0 ? C.red : C.orange}`,
                borderRadius: 8, padding: "14px 18px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: "monospace", fontWeight: 800, color: C.text, fontSize: 16 }}>{y.id}</span>
                  <span style={{
                    background: i === 0 ? C.redSoft : C.orangeSoft,
                    color: i === 0 ? C.red : C.orange,
                    padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: "monospace",
                  }}>{y.status}</span>
                </div>
                <div style={{ fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: C.muted }}>Placement:</span> <strong style={{ color: C.text }}>{y.placement}</strong>
                </div>
                <div style={{ fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: C.muted }}>Case manager:</span> <span style={{ color: C.green }}>{y.caseMgr}</span>
                </div>
                <div style={{ fontSize: 11, color: C.muted }}>Next: {y.nextStep}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 10, fontStyle: "italic", padding: "10px 14px", background: C.cardAlt, borderRadius: 6 }}>
            Youth are prioritized through the existing age-21 bridge pool — not by converting the system to youth-only.
            The 60 displaced adults are served through the same rerouted pipeline via 211, Center of Hope, and Second Light.
            SOUL Family legal permanency referrals initiated for all 4 youth within 48 hours (Del. 2: 12% dropout, lowest in the system).
          </div>
        </div>

        {/* INTERVENTION ADAPTATION TABLE */}
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, fontFamily: "monospace" }}>
            Pilot Intervention Adaptations — All 8 Lines
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {adaptations.map((a, i) => (
              <div key={i} style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 8, padding: "14px 20px",
                borderLeft: `4px solid ${a.status === "critical" ? C.red : a.status === "adapted" ? C.orange : C.green}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{a.intervention}</span>
                    <StatusBadge status={a.status} />
                  </div>
                  <span style={{ fontSize: 11, color: a.budgetImpact.includes("$0") ? C.green : C.orange, fontFamily: "monospace" }}>{a.budgetImpact}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12 }}>
                  <div>
                    <span style={{ color: C.muted, fontSize: 10, fontFamily: "monospace", textTransform: "uppercase" }}>Normal Operation</span>
                    <div style={{ color: C.muted, marginTop: 2, lineHeight: 1.5 }}>{a.normalOp}</div>
                  </div>
                  <div>
                    <span style={{ color: a.status === "critical" ? C.red : C.orange, fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", fontWeight: 700 }}>Crisis Operation</span>
                    <div style={{ color: C.text, marginTop: 2, lineHeight: 1.5, fontWeight: 500 }}>{a.crisisOp}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Budget impact summary */}
          <div style={{ display: "flex", gap: 14, marginTop: 14, flexWrap: "wrap" }}>
            <div style={{ background: C.greenSoft, border: `1px solid ${C.green}40`, borderRadius: 6, padding: "10px 16px", flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 10, fontFamily: "monospace", color: C.green, fontWeight: 700 }}>TOTAL CRISIS BUDGET IMPACT</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.green, fontFamily: "monospace" }}>$8,600</div>
              <div style={{ fontSize: 11, color: C.muted }}>1.7% of $500K pilot budget — absorbed from existing Bridge Beds fund</div>
            </div>
            <div style={{ background: C.greenSoft, border: `1px solid ${C.green}40`, borderRadius: 6, padding: "10px 16px", flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 10, fontFamily: "monospace", color: C.green, fontWeight: 700 }}>NEW HIRES REQUIRED</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.green, fontFamily: "monospace" }}>0</div>
              <div style={{ fontSize: 11, color: C.muted }}>All adaptations use existing pilot staff — redeployed, not added</div>
            </div>
            <div style={{ background: C.greenSoft, border: `1px solid ${C.green}40`, borderRadius: 6, padding: "10px 16px", flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 10, fontFamily: "monospace", color: C.green, fontWeight: 700 }}>INTERVENTIONS UNCHANGED</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.green, fontFamily: "monospace" }}>1 of 8</div>
              <div style={{ fontSize: 11, color: C.muted }}>NEXTenant landlord placements — disaster displacement ≠ chronic homelessness</div>
            </div>
          </div>
        </div>

        {/* 72-HOUR TIMELINE */}
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, fontFamily: "monospace" }}>
            72-Hour Action Timeline
          </h2>
          <div style={{ position: "relative" }}>
            {timeline.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                {/* Timeline dot + line */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24, flexShrink: 0 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 8,
                    background: i === 0 ? C.red : i === 1 ? C.orange : i === 2 ? C.amber : C.green,
                    border: `2px solid ${C.bg}`,
                    flexShrink: 0,
                  }} />
                  {i < timeline.length - 1 && <div style={{ width: 2, flex: 1, background: C.border, marginTop: 4 }} />}
                </div>
                {/* Content */}
                <div style={{
                  background: C.card, border: `1px solid ${C.border}`, borderRadius: 8,
                  padding: "14px 20px", flex: 1,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{
                      fontFamily: "monospace", fontSize: 12, fontWeight: 800,
                      color: i === 0 ? C.red : i === 1 ? C.orange : i === 2 ? C.amber : C.green,
                    }}>HR {t.hour}</span>
                    <span style={{
                      background: `${i === 0 ? C.red : i === 1 ? C.orange : i === 2 ? C.amber : C.green}18`,
                      color: i === 0 ? C.red : i === 1 ? C.orange : i === 2 ? C.amber : C.green,
                      padding: "2px 10px", borderRadius: 4, fontSize: 10, fontWeight: 700, fontFamily: "monospace",
                    }}>{t.phase}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 6 }}>
                    {t.actions.map((a, j) => (
                      <div key={j} style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, display: "flex", gap: 6, alignItems: "flex-start" }}>
                        <span style={{ color: i === 0 ? C.red : i === 1 ? C.orange : i === 2 ? C.amber : C.green, fontWeight: 700, flexShrink: 0 }}>▸</span>
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WHAT THIS PROVES */}
        <div style={{
          background: `linear-gradient(135deg, ${C.greenSoft} 0%, ${C.card} 100%)`,
          border: `1.5px solid ${C.green}`, borderRadius: 10,
          padding: "20px 26px", marginBottom: 20,
        }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: C.green, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>▸ What This Crisis Proves About the Pilot</div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
            <strong style={{ color: C.text }}>1. The interventions are the emergency plan.</strong> Bridge Beds, After-Hours Routing, Transit Passes, and Document Navigators were designed for chronic system failures — they absorb acute crises without new budget or staff.
            <br /><br />
            <strong style={{ color: C.text }}>2. The pilot handles compound failure.</strong> Three simultaneous disruptions (site offline + capacity surge + youth pipeline full) are absorbed by redeploying existing resources — $8,600 incremental cost, zero new hires, 72-hour recovery.
            <br /><br />
            <strong style={{ color: C.text }}>3. Youth are prioritized without fragmenting the system.</strong> The 4 foster youth get immediate case-manager assignment and bridge-bed placement. The 60 displaced adults are served through the same rerouted pipeline. One system, two priority tiers, zero population lockouts.
          </div>
        </div>

        <div style={{ fontSize: 11, color: C.muted, textAlign: "center", padding: "16px 0 8px", borderTop: `1px solid ${C.border}` }}>
          Crisis Adaptation Dashboard · References Deliverables 1-7 · Web-verified corrections applied (211 hours, H.O.T. shift, Salvation Army eligibility, SOUL Family permanency model) · 2026-04-18
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
