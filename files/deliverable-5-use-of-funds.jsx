import { useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const C = {
  bg: "#0b0d12",
  card: "#131620",
  cardAlt: "#1b1f2e",
  border: "#252b3c",
  text: "#e3e5ec",
  muted: "#7a7f96",
  accent: "#8b5cf6",
  accentSoft: "rgba(139,92,246,0.10)",
  red: "#ef4444",
  redSoft: "rgba(239,68,68,0.10)",
  orange: "#f59e0b",
  orangeSoft: "rgba(245,158,11,0.08)",
  green: "#34d399",
  greenSoft: "rgba(52,211,153,0.10)",
  blue: "#60a5fa",
  blueSoft: "rgba(96,165,250,0.10)",
  yellow: "#facc15",
  pink: "#ec4899",
  teal: "#14b8a6",
};

const fundRows = [
  {
    id: 1, name: "Document Navigator Staffing",
    partner: "Open Door + Second Light + Center of Hope",
    budget: 72000, unitCost: 25, unitLabel: "$/hr loaded", units: "2 FTE × 40 hrs/wk × 12 wks + benefits",
    reached: 210, category: "Staffing",
    weekStart: 2, weekRamp: 4, weekSteady: 12,
    notes: "2 navigators embedded at intake sites. Each handles ~8 clients/wk across ID, birth cert, SSN, state ID. Breakthrough Wichita available for SMI-specific cases. Priority #1 from Deliverable 3.",
  },
  {
    id: 2, name: "After-Hours & Weekend Routing",
    partner: "Open Door + Second Light",
    budget: 54000, unitCost: 22, unitLabel: "$/hr loaded", units: "4 PT staff × 25 hrs/wk × 12 wks + benefits",
    reached: 185, category: "Staffing",
    weekStart: 3, weekRamp: 5, weekSteady: 12,
    notes: "Overnight (post-7 PM) + weekend coverage at Open Door and Second Light. 211 closes at 7 PM weekdays; H.O.T. covers 2nd shift only. Fills the adult routing void identified in Deliverable 1.",
  },
  {
    id: 3, name: "Transit Pass Fund",
    partner: "Center of Hope + Open Door + CrossRoads",
    budget: 30000, unitCost: 50, unitLabel: "$/pass/month", units: "200 passes × 3 months",
    reached: 200, category: "Direct Client Assistance",
    weekStart: 1, weekRamp: 2, weekSteady: 12,
    notes: "Monthly bus passes distributed at intake sites. Removes the $50/mo barrier for zero-income clients navigating multi-site system.",
  },
  {
    id: 4, name: "Youth Age-21 Bridge Support",
    partner: "DCF IL + TRAIL + SOUL Family",
    budget: 60000, unitCost: 476, unitLabel: "$/youth/month", units: "42 youth × $476/mo × 3 months",
    reached: 42, category: "Staffing",
    weekStart: 2, weekRamp: 5, weekSteady: 12,
    notes: "Extends case management past 21 for active DCF IL/TRAIL clients. $476/mo covers case-manager time + stipend. Bridges the age-21 cliff from Deliverable 2.",
  },
  {
    id: 5, name: "NEXTenant Landlord Incentive Fund",
    partner: "NEXTenant + HCV/Rapid Rehousing partners",
    budget: 78000, unitCost: 2600, unitLabel: "$/placement", units: "30 placements × ($2,000 deposit + $600 risk fund)",
    reached: 30, category: "Landlord Incentives",
    weekStart: 3, weekRamp: 6, weekSteady: 12,
    notes: "Deposit assistance + landlord risk mitigation per placement. Targets NEXTenant partner properties (Riverside Commons, Prairie Wind, Douglas Ave Flats).",
  },
  {
    id: 6, name: "Emergency Bridge Beds Flex Fund",
    partner: "CrossRoads + HumanKind + hotel flex partners",
    budget: 62000, unitCost: 86, unitLabel: "$/bed-night", units: "~10 flex beds × 72 nights avg",
    reached: 45, category: "Direct Client Assistance",
    weekStart: 1, weekRamp: 3, weekSteady: 12,
    notes: "Hotel/flex-bed vouchers when CrossRoads and BRIDGES are full. Salvation Army serves families + single women only [CORRECTED] — not a youth fallback.",
  },
  {
    id: 7, name: "KanCare Re-enrollment Navigator",
    partner: "Second Light + DCF Service Center",
    budget: 36000, unitCost: 25, unitLabel: "$/hr loaded", units: "1 FTE × 40 hrs/wk × 12 wks + benefits",
    reached: 160, category: "Staffing",
    weekStart: 2, weekRamp: 4, weekSteady: 12,
    notes: "Benefits specialist embedded at Second Light. Intercepts KanCare disenrollment and proactively re-certifies before coverage lapses (42% dropout from Deliverable 2).",
  },
  {
    id: 8, name: "SNAP Expedited Processing Training",
    partner: "Open Door + Center of Hope + 211 Kansas",
    budget: 8000, unitCost: 200, unitLabel: "$/staff trained", units: "40 intake staff × half-day training",
    reached: 180, category: "Staffing",
    weekStart: 1, weekRamp: 3, weekSteady: 12,
    notes: "Train front-line staff to flag 7-day expedited SNAP eligibility for homeless applicants. Currently underused per Deliverable 1.",
  },
  {
    id: 9, name: "Marketing, Trust-Building & Adoption",
    partner: "United Way Coalition + City of Wichita",
    budget: 100000, unitCost: null, unitLabel: "", units: "See breakdown below",
    reached: null, category: "Marketing/Adoption",
    weekStart: 1, weekRamp: 4, weekSteady: 12,
    notes: "Community awareness, landlord recruitment, client trust campaigns, pilot brand, feedback loops.",
  },
];

const grandTotal = fundRows.reduce((s, r) => s + r.budget, 0);
const opTotal = fundRows.filter(r => r.category !== "Marketing/Adoption").reduce((s, r) => s + r.budget, 0);
const totalReached = fundRows.filter(r => r.reached).reduce((s, r) => s + r.reached, 0);

const marketingBreakdown = [
  { item: "Community awareness campaign (print, radio, social)", cost: 35000 },
  { item: "Landlord recruitment events + materials", cost: 20000 },
  { item: "Client-facing trust & wayfinding materials (multilingual)", cost: 15000 },
  { item: "Pilot brand identity + signage at intake sites", cost: 12000 },
  { item: "Feedback collection platform + community listening sessions", cost: 10000 },
  { item: "Contingency / rapid-response communications", cost: 8000 },
];

const categoryData = [
  { name: "Staffing", value: fundRows.filter(r => r.category === "Staffing").reduce((s, r) => s + r.budget, 0), color: C.blue },
  { name: "Direct Client Assistance", value: fundRows.filter(r => r.category === "Direct Client Assistance").reduce((s, r) => s + r.budget, 0), color: C.green },
  { name: "Landlord Incentives", value: fundRows.filter(r => r.category === "Landlord Incentives").reduce((s, r) => s + r.budget, 0), color: C.orange },
  { name: "Marketing/Adoption", value: 100000, color: C.pink },
];

const directServices = categoryData[0].value + categoryData[1].value;
const directPct = Math.round(directServices / opTotal * 100);
const infraPct = 100 - directPct;

// highest cost per person
const costPerPerson = fundRows.filter(r => r.reached).map(r => ({ name: r.name, cpp: Math.round(r.budget / r.reached) })).sort((a, b) => b.cpp - a.cpp);

const phases = [
  { label: "PHASE 1: Setup & Hiring", weeks: "Weeks 1-4", color: C.orange },
  { label: "PHASE 2: Launch & Iterate", weeks: "Weeks 5-8", color: C.blue },
  { label: "PHASE 3: Scale & Measure", weeks: "Weeks 9-12", color: C.green },
];

// Sensitivity at 75%
const cutBudget = 375000;
const cutMarketing = 75000; // reduce marketing by $25K
const cutOps = cutBudget - cutMarketing; // $300K for ops vs $400K
const cutItem = "NEXTenant Landlord Incentive Fund";
const cutSavings = 78000;
const cutPlacementLoss = 30;

function MetricCard({ label, value, sub, accent, color }) {
  const bc = accent ? (color || C.accent) : C.border;
  return (
    <div style={{ background: accent ? `${color || C.accent}12` : C.card, border: `1px solid ${bc}`, borderRadius: 8, padding: "16px 20px", flex: 1, minWidth: 180 }}>
      <div style={{ color: C.muted, fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 1.2 }}>{label}</div>
      <div style={{ color: accent ? (color || C.accent) : C.text, fontSize: 26, fontWeight: 800, marginTop: 4, fontFamily: "monospace" }}>{value}</div>
      {sub && <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

const DonutTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "10px 14px", borderRadius: 6, fontSize: 12 }}>
      <div style={{ fontWeight: 700, color: C.text }}>{d.name}</div>
      <div style={{ color: C.muted }}>${(d.value / 1000).toFixed(0)}K — {Math.round(d.value / grandTotal * 100)}%</div>
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return percent > 0.08 ? (
    <text x={x} y={y} fill={C.muted} textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={11} fontFamily="monospace">
      {name} ({Math.round(percent * 100)}%)
    </text>
  ) : null;
};

export default function UseOfFunds() {
  const [showMarketing, setShowMarketing] = useState(false);

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: `linear-gradient(135deg, ${C.cardAlt} 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.border}`, padding: "32px 36px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ background: C.accent, width: 6, height: 32, borderRadius: 3 }} />
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: C.accent, textTransform: "uppercase", letterSpacing: 2 }}>Deliverable 5 of 7</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Use-of-Funds Model</h1>
          </div>
        </div>
        <p style={{ color: C.muted, fontSize: 14, margin: "8px 0 0 18px", maxWidth: 720 }}>
          Allocating $500,000 across 8 interventions — what each dollar buys, who it reaches, and when it launches.
        </p>
      </div>

      <div style={{ padding: "28px 36px", maxWidth: 1260, margin: "0 auto" }}>

        {/* ANALYTICAL HOOK */}
        <div style={{
          background: `linear-gradient(135deg, ${C.accentSoft} 0%, ${C.blueSoft} 100%)`,
          border: `1.5px solid ${C.accent}`, borderLeft: `5px solid ${C.accent}`,
          borderRadius: 10, padding: "20px 26px", marginBottom: 28,
        }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: C.accent, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>▸ Budget Analysis</div>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.5 }}>
            <span style={{ color: C.accent }}>{directPct}%</span> of the $400K operating budget goes to direct client services (staffing + client assistance). {infraPct}% goes to system infrastructure (landlord incentives).
          </div>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 8, lineHeight: 1.6 }}>
            <strong style={{ color: C.text }}>Is this ratio right for a 90-day pilot?</strong> Yes. A short-duration pilot should prioritize immediately deployable, people-facing interventions over long-build infrastructure. 
            The {directPct}/{infraPct} split reflects this — staffing and direct assistance can launch within weeks, while system-level changes (like Second Light automation, left unfunded per Deliverable 3) take longer than 90 days to prove out.
            <br /><br />
            <strong style={{ color: C.text }}>Highest cost-per-person:</strong> {costPerPerson[0].name} at <strong style={{ color: C.orange }}>${costPerPerson[0].cpp.toLocaleString()}/person</strong>.
            This is justified because each landlord placement is a <em>permanent housing outcome</em> — the terminal goal of the entire system. 
            Per Deliverable 4, each placement avoids $18,080 in annual cycling costs, making the $2,600 investment a 7:1 return.
          </div>
        </div>

        {/* METRIC CARDS */}
        <div style={{ display: "flex", gap: 14, marginBottom: 32, flexWrap: "wrap" }}>
          <MetricCard label="Total Budget" value="$500,000" sub="City pilot grant" />
          <MetricCard label="Operating Budget" value="$400,000" sub="8 interventions" accent />
          <MetricCard label="Marketing / Adoption" value="$100,000" sub="Trust-building + awareness" />
          <MetricCard label="Projected People Served" value={totalReached.toLocaleString()} sub="Across all interventions (some overlap)" accent color={C.green} />
        </div>

        {/* USES TABLE */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, fontFamily: "monospace" }}>
            Budget Allocation — Unit Economics
          </h2>
          <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: C.cardAlt }}>
                  {["Intervention", "Partner", "Budget", "Unit Cost", "Units / Quantity", "People Reached", "Timeline"].map(h => (
                    <th key={h} style={{ padding: "12px 10px", textAlign: "left", fontWeight: 700, fontFamily: "monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, color: C.muted, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fundRows.map((r, i) => (
                  <tr key={r.id} style={{ background: i % 2 === 0 ? C.card : C.bg, borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "11px 10px" }}>
                      <div style={{ fontWeight: 600, color: C.text }}>{r.name}</div>
                      <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{r.notes.slice(0, 80)}…</div>
                    </td>
                    <td style={{ padding: "11px 10px", color: C.muted, fontSize: 11, maxWidth: 160 }}>{r.partner}</td>
                    <td style={{ padding: "11px 10px", fontFamily: "monospace", fontWeight: 700, color: r.budget >= 70000 ? C.orange : C.text }}>
                      ${(r.budget / 1000).toFixed(0)}K
                    </td>
                    <td style={{ padding: "11px 10px", fontFamily: "monospace", fontSize: 11, color: C.muted }}>
                      {r.unitCost ? `$${r.unitCost.toLocaleString()} ${r.unitLabel}` : "—"}
                    </td>
                    <td style={{ padding: "11px 10px", fontSize: 11, color: C.muted, maxWidth: 180 }}>{r.units}</td>
                    <td style={{ padding: "11px 10px", fontFamily: "monospace", fontWeight: 700, color: C.green }}>
                      {r.reached ? r.reached.toLocaleString() : "—"}
                    </td>
                    <td style={{ padding: "11px 10px", fontSize: 11 }}>
                      <span style={{ color: C.muted }}>Wk {r.weekStart}</span>
                      <span style={{ color: C.accent, margin: "0 3px" }}>→</span>
                      <span style={{ color: C.text, fontWeight: 600 }}>Wk {r.weekSteady}</span>
                    </td>
                  </tr>
                ))}
                <tr style={{ background: C.cardAlt, borderTop: `2px solid ${C.accent}` }}>
                  <td style={{ padding: "12px 10px", fontWeight: 800 }}>TOTAL</td>
                  <td />
                  <td style={{ padding: "12px 10px", fontFamily: "monospace", fontWeight: 800, color: C.accent, fontSize: 15 }}>
                    ${(grandTotal / 1000).toFixed(0)}K
                  </td>
                  <td colSpan={2} style={{ padding: "12px 10px", color: C.muted, fontStyle: "italic", fontSize: 11 }}>
                    Budget verification: ${grandTotal.toLocaleString()} = $500,000 ✓
                  </td>
                  <td style={{ padding: "12px 10px", fontFamily: "monospace", fontWeight: 700, color: C.green }}>
                    {totalReached.toLocaleString()}
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>

          {/* Marketing breakdown toggle */}
          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => setShowMarketing(!showMarketing)}
              style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 6,
                padding: "8px 16px", color: C.accent, fontSize: 12, fontFamily: "monospace",
                cursor: "pointer", fontWeight: 600,
              }}
            >
              {showMarketing ? "▾" : "▸"} Marketing $100K Breakdown
            </button>
            {showMarketing && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, marginTop: 8, padding: "14px 18px" }}>
                {marketingBreakdown.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < marketingBreakdown.length - 1 ? `1px solid ${C.border}` : "none", fontSize: 12 }}>
                    <span style={{ color: C.muted }}>{m.item}</span>
                    <span style={{ fontFamily: "monospace", fontWeight: 600, color: C.text }}>${(m.cost / 1000).toFixed(0)}K</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", fontSize: 12, fontWeight: 800 }}>
                  <span>Total</span>
                  <span style={{ fontFamily: "monospace", color: C.accent }}>$100K</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DONUT CHART */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, fontFamily: "monospace" }}>
            Budget by Category
          </h2>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px", flex: "1 1 400px", minWidth: 340 }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%" cy="50%"
                    innerRadius={70} outerRadius={110}
                    dataKey="value"
                    label={renderLabel}
                    labelLine={{ stroke: C.muted, strokeWidth: 1 }}
                  >
                    {categoryData.map((d, i) => <Cell key={i} fill={d.color} stroke={C.bg} strokeWidth={2} />)}
                  </Pie>
                  <Tooltip content={<DonutTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: 8 }}>
              {categoryData.map((d, i) => (
                <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{Math.round(d.value / grandTotal * 100)}% of total</div>
                  </div>
                  <div style={{ fontFamily: "monospace", fontWeight: 700, color: d.color, fontSize: 14 }}>${(d.value / 1000).toFixed(0)}K</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GANTT TIMELINE */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, fontFamily: "monospace" }}>
            90-Day Gantt Timeline
          </h2>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px", overflowX: "auto" }}>
            {/* Phase headers */}
            <div style={{ display: "flex", marginBottom: 16, marginLeft: 220 }}>
              {phases.map((p, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", padding: "6px 0", borderBottom: `3px solid ${p.color}` }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: p.color, fontFamily: "monospace", letterSpacing: 1 }}>{p.label}</div>
                  <div style={{ fontSize: 10, color: C.muted }}>{p.weeks}</div>
                </div>
              ))}
            </div>

            {/* Week columns header */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <div style={{ width: 220, flexShrink: 0 }} />
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, fontFamily: "monospace", color: C.muted, minWidth: 40 }}>
                  W{i + 1}
                </div>
              ))}
            </div>

            {/* Intervention rows */}
            {fundRows.map((r, i) => {
              const barStart = r.weekStart - 1;
              const rampEnd = r.weekRamp - 1;
              const steadyEnd = r.weekSteady - 1;
              const catColor = r.category === "Staffing" ? C.blue :
                r.category === "Direct Client Assistance" ? C.green :
                r.category === "Landlord Incentives" ? C.orange :
                C.pink;

              return (
                <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ width: 220, flexShrink: 0, fontSize: 11, fontWeight: 600, color: C.text, paddingRight: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: catColor, flexShrink: 0 }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
                  </div>
                  <div style={{ display: "flex", flex: 1 }}>
                    {Array.from({ length: 12 }, (_, w) => {
                      const isSetup = w >= barStart && w < rampEnd;
                      const isSteady = w >= rampEnd && w <= steadyEnd;
                      const isActive = isSetup || isSteady;
                      return (
                        <div key={w} style={{
                          flex: 1, height: 22, minWidth: 40,
                          background: isSteady ? `${catColor}50` : isSetup ? `${catColor}25` : "transparent",
                          borderLeft: isActive ? `1px solid ${C.bg}` : "none",
                          borderRadius: w === barStart ? "4px 0 0 4px" : w === steadyEnd ? "0 4px 4px 0" : 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {w === rampEnd && <span style={{ fontSize: 8, color: catColor, fontWeight: 700 }}>▸ LIVE</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div style={{ display: "flex", gap: 14, marginTop: 14, marginLeft: 220, flexWrap: "wrap" }}>
              <div style={{ fontSize: 10, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 20, height: 10, background: `${C.blue}25`, borderRadius: 2 }} /> Setup / Hiring
              </div>
              <div style={{ fontSize: 10, color: C.muted, display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 20, height: 10, background: `${C.blue}50`, borderRadius: 2 }} /> Active / Steady State
              </div>
            </div>
          </div>
        </div>

        {/* SENSITIVITY PANEL */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, fontFamily: "monospace" }}>
            Sensitivity — What if Funding Drops to 75% ($375K)?
          </h2>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 350px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.orange, marginBottom: 12, fontFamily: "monospace" }}>REDUCED SCENARIO: $375K</div>

              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1, background: C.orangeSoft, borderRadius: 6, padding: "10px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace" }}>OPS BUDGET</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.orange, fontFamily: "monospace" }}>$300K</div>
                  <div style={{ fontSize: 10, color: C.muted }}>−$100K from ops</div>
                </div>
                <div style={{ flex: 1, background: C.orangeSoft, borderRadius: 6, padding: "10px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: C.muted, fontFamily: "monospace" }}>MARKETING</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.orange, fontFamily: "monospace" }}>$75K</div>
                  <div style={{ fontSize: 10, color: C.muted }}>−$25K from marketing</div>
                </div>
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, color: C.red, marginBottom: 8 }}>First intervention cut:</div>
              <div style={{ background: C.redSoft, border: `1px solid ${C.red}40`, borderRadius: 8, padding: "12px 16px", marginBottom: 12 }}>
                <div style={{ fontWeight: 700, color: C.text }}>{cutItem}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                  Saves ${(cutSavings / 1000).toFixed(0)}K but eliminates {cutPlacementLoss} permanent housing placements.
                  NEXTenant deposit assistance is the highest cost-per-person intervention ($2,600) and the most cuttable without breaking dependencies.
                </div>
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, color: C.red, marginBottom: 8 }}>Second cut (if needed):</div>
              <div style={{ background: C.redSoft, border: `1px solid ${C.red}40`, borderRadius: 8, padding: "12px 16px" }}>
                <div style={{ fontWeight: 700, color: C.text }}>Emergency Bridge Beds Flex Fund</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                  Saves $62K but loses 45 bridge-bed placements for youth when CrossRoads is full.
                </div>
              </div>
            </div>

            <div style={{ flex: "1 1 350px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12, fontFamily: "monospace" }}>IMPACT COMPARISON</div>

              {[
                { label: "Full Funding ($500K)", placements: "~30 permanent + 45 bridge", reach: totalReached, color: C.green },
                { label: "75% Funding ($375K)", placements: "~0 permanent + 45 bridge", reach: totalReached - cutPlacementLoss, color: C.orange },
                { label: "75% − Bridge Beds ($313K)", placements: "~0 permanent + 0 bridge", reach: totalReached - cutPlacementLoss - 45, color: C.red },
              ].map((s, i) => (
                <div key={i} style={{ background: `${s.color}10`, border: `1px solid ${s.color}30`, borderRadius: 8, padding: "12px 16px", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, color: s.color, fontSize: 13 }}>{s.label}</span>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: C.text }}>{s.reach} people</span>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Housing outcomes: {s.placements}</div>
                </div>
              ))}

              <div style={{ marginTop: 12, padding: "12px 16px", background: C.cardAlt, borderRadius: 8, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                <strong style={{ color: C.text }}>Key tradeoff:</strong> Cutting landlord incentives eliminates the only intervention that produces <em>permanent</em> housing placements.
                All remaining interventions improve system flow but still depend on existing housing stock.
                Per Deliverable 4, each lost placement = $18,080 in avoided savings forgone.
                Cutting 30 placements costs <strong style={{ color: C.red }}>${(30 * 18080).toLocaleString()}</strong> in Year 1 system savings — more than the $78K saved.
              </div>
            </div>
          </div>
        </div>

        {/* BUDGET VERIFICATION */}
        <div style={{ background: C.greenSoft, border: `1px solid ${C.green}40`, borderRadius: 10, padding: "16px 24px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 13, color: C.green, fontWeight: 700, fontFamily: "monospace" }}>
            ✓ BUDGET VERIFIED: ${grandTotal.toLocaleString()} = $500,000
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>
            Operations: ${(opTotal).toLocaleString()} · Marketing: $100,000 · Unallocated: $0
          </div>
        </div>

        <div style={{ fontSize: 11, color: C.muted, textAlign: "center", padding: "20px 0 8px", borderTop: `1px solid ${C.border}` }}>
          Budget grounded in Deliverable 3 priority rankings and Deliverable 4 cost benchmarks · Wichita labor rates ($15-22/hr + 25% benefits) · HUD bed-night costs · Web-verified corrections applied 2026-04-18
        </div>
      </div>
    </div>
  );
}
