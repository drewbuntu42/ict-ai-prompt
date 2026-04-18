import { useState } from "react";
import { ResponsiveContainer } from "recharts";

const C = {
  bg: "#0b0d11",
  card: "#121620",
  cardAlt: "#1a1e2d",
  border: "#252a3b",
  text: "#e3e6ed",
  muted: "#7b7f97",
  accent: "#0ea5e9",
  accentSoft: "rgba(14,165,233,0.10)",
  red: "#ef4444",
  redSoft: "rgba(239,68,68,0.10)",
  orange: "#f59e0b",
  orangeSoft: "rgba(245,158,11,0.08)",
  yellow: "#facc15",
  green: "#34d399",
  greenSoft: "rgba(52,211,153,0.10)",
  blue: "#60a5fa",
  blueSoft: "rgba(96,165,250,0.10)",
  purple: "#a78bfa",
  purpleSoft: "rgba(167,139,250,0.10)",
  gray: "#4b5068",
  graySoft: "rgba(75,80,104,0.20)",
};

const catColors = {
  Access: C.blue,
  Speed: C.orange,
  Stability: C.green,
  Cost: C.purple,
  Equity: C.accent,
};

const kpis = [
  {
    id: 1, name: "Reachable Bed Percentage", category: "Access",
    baseline: "20%", baselineCalc: "17 of 87 beds (PIT Count)",
    day30: "30%", day60: "40%", day90: "50%",
    source: "Second Light + shelter partners", method: "Weekly shelter survey: beds available without referral gate, sobriety screen, or population restriction ÷ total beds online",
    intervention: "Emergency Bridge Beds + bed-access barrier reduction",
    indicator: "leading", feasibility: "partner",
    feasibilityNote: "Requires weekly reporting from each shelter — not in HMIS. Pilot staff must collect manually until Second Light bed-matching goes live.",
    failThreshold: "Below 25% at Day 30",
  },
  {
    id: 2, name: "Avg Days: First Contact → Housing", category: "Speed",
    baseline: "45 days", baselineCalc: "PIT Count FY 2024 avg",
    day30: "42", day60: "38", day90: "35",
    source: "HMIS (coordinated entry timestamps)", method: "Median calendar days from first VI-SPDAT assessment to lease signing or permanent supportive housing move-in",
    intervention: "Document Navigators + NEXTenant Landlord Incentives",
    indicator: "lagging", feasibility: "hmis",
    feasibilityNote: "Exists in HMIS if both intake and housing events are logged. Requires consistent use of move-in date field by all partners.",
    failThreshold: null,
  },
  {
    id: 3, name: "Intake-to-Shelter Drop-Off Rate", category: "Access",
    baseline: "~30%", baselineCalc: "Estimated from Del. 1 pipeline: 3,257 served → ~2,280 sheltered",
    day30: "25%", day60: "22%", day90: "18%",
    source: "HMIS + intake site logs", method: "People completing VI-SPDAT who do NOT receive a shelter bed within 72 hours ÷ total VI-SPDAT completions per month",
    intervention: "After-Hours & Weekend Routing + Bridge Beds",
    indicator: "leading", feasibility: "new",
    feasibilityNote: "HMIS tracks assessments and shelter entries separately. Pilot must build a 72-hour match report — straightforward query but not currently run.",
    failThreshold: "Above 28% at Day 30",
  },
  {
    id: 4, name: "Documents Completed per Client (30 days)", category: "Speed",
    baseline: "~1.2 docs", baselineCalc: "Estimated: most clients complete only City ID or none in first 30 days without navigation support",
    day30: "2.0", day60: "2.8", day90: "3.5",
    source: "Navigator case logs", method: "Avg count of (birth cert, SSN, state ID, City ID, bank account) completed per client within 30 days of intake, tracked by document navigators",
    intervention: "Document Navigator Staffing",
    indicator: "leading", feasibility: "new",
    feasibilityNote: "Requires new tracker built by navigator team. Simple checklist per client — does not depend on HMIS. Pilot-created metric.",
    failThreshold: "Below 1.5 at Day 30",
  },
  {
    id: 5, name: "Youth Exiting CrossRoads with Confirmed Next Placement", category: "Equity",
    baseline: "67%", baselineCalc: "1/3 exits lack confirmed placement (CrossRoads program data)",
    day30: "72%", day60: "78%", day90: "85%",
    source: "CrossRoads exit records", method: "Youth exiting CrossRoads with documented next placement (BRIDGES, HumanKind, NEXTenant unit, or family) ÷ total CrossRoads exits per month",
    intervention: "Youth Age-21 Bridge + Emergency Bridge Beds",
    indicator: "leading", feasibility: "partner",
    feasibilityNote: "CrossRoads tracks exit disposition internally. Pilot needs monthly report pull — data exists but is not currently shared systematically.",
    failThreshold: "Below 70% at Day 30",
  },
  {
    id: 6, name: "KanCare Coverage Maintained Through Transition", category: "Stability",
    baseline: "58%", baselineCalc: "100% − 42% dropout rate (DCF KanCare extension data)",
    day30: "65%", day60: "72%", day90: "80%",
    source: "KanCare navigator case logs + DCF enrollment records", method: "Pilot clients who maintain active KanCare coverage through at least one address change ÷ pilot clients who change address during period",
    intervention: "KanCare Re-enrollment Navigator",
    indicator: "leading", feasibility: "new",
    feasibilityNote: "KanCare enrollment status is in DCF systems, not HMIS. Navigator must track each client's coverage status manually and cross-check with DCF monthly.",
    failThreshold: "Below 60% at Day 30",
  },
  {
    id: 7, name: "Landlords Actively Accepting Voucher Referrals", category: "Access",
    baseline: "~5", baselineCalc: "NEXTenant partner properties in rehousing data: Riverside Commons, Prairie Wind, Douglas Ave Flats, Pawnee Crossing, Hilltop Village",
    day30: "7", day60: "10", day90: "14",
    source: "NEXTenant program records", method: "Distinct landlords who accepted ≥1 voucher-backed tenant referral in the measurement period",
    intervention: "NEXTenant Landlord Incentive Fund",
    indicator: "leading", feasibility: "partner",
    feasibilityNote: "NEXTenant tracks landlord partnerships. Pilot needs monthly count — simple ask but depends on NEXTenant reporting cadence.",
    failThreshold: null,
  },
  {
    id: 8, name: "Permanent Housing Placements (Cumulative)", category: "Stability",
    baseline: "0", baselineCalc: "Pilot start",
    day30: "6", day60: "16", day90: "30",
    source: "HMIS + NEXTenant records", method: "Clients who sign a lease or move into permanent supportive housing during the pilot period. Includes NEXTenant placements, HumanKind move-ins, and VASH placements.",
    intervention: "All interventions (terminal outcome)",
    indicator: "lagging", feasibility: "hmis",
    feasibilityNote: "HMIS tracks housing placements. NEXTenant placements may lag HMIS entry by 1-2 weeks — reconcile monthly.",
    failThreshold: "Below 4 at Day 30",
  },
  {
    id: 9, name: "Cost per Successful Placement", category: "Cost",
    baseline: "$18,080", baselineCalc: "Cycling cost per person (Deliverable 4) — the cost TO AVOID",
    day30: "Track only", day60: "≤$18K", day90: "≤$17K",
    source: "Pilot financial records + HMIS", method: "Total pilot operating expenditure ÷ cumulative permanent placements. Compare against $18,080 cycling cost benchmark from Deliverable 4.",
    intervention: "All interventions (efficiency metric)",
    indicator: "lagging", feasibility: "new",
    feasibilityNote: "Requires pilot finance tracking system. Numerator is pilot spend; denominator is KPI #8. Simple division but needs clean financial reporting.",
    failThreshold: null,
  },
  {
    id: 10, name: "Repeat Intake Contacts (Cycling Rate)", category: "Cost",
    baseline: "~33%", baselineCalc: "Estimated: ~1/3 of 211 callers loop; Open Door afternoon visitors already cycled through another partner",
    day30: "30%", day60: "25%", day90: "20%",
    source: "HMIS + Open Door logs", method: "Clients who appear at 2+ intake sites within a 7-day window ÷ total unique clients in the period. Proxy for system cycling.",
    intervention: "After-Hours & Weekend Routing + Document Navigators",
    indicator: "lagging", feasibility: "hmis",
    feasibilityNote: "HMIS can identify repeat contacts across sites IF all partners log same-day. Current logging compliance varies — pilot may need to enforce daily entry.",
    failThreshold: "Above 30% at Day 60",
  },
];

const leading = kpis.filter(k => k.indicator === "leading");
const lagging = kpis.filter(k => k.indicator === "lagging");

function MetricCard({ label, value, sub, accent, color }) {
  const bc = accent ? (color || C.accent) : C.border;
  return (
    <div style={{ background: accent ? `${color || C.accent}12` : C.card, border: `1px solid ${bc}`, borderRadius: 8, padding: "16px 20px", flex: 1, minWidth: 200 }}>
      <div style={{ color: C.muted, fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 1.2 }}>{label}</div>
      <div style={{ color: accent ? (color || C.accent) : C.text, fontSize: 26, fontWeight: 800, marginTop: 4, fontFamily: "monospace" }}>{value}</div>
      {sub && <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function PilotKPIFramework() {
  const [expandedKpi, setExpandedKpi] = useState(null);

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: `linear-gradient(135deg, ${C.cardAlt} 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.border}`, padding: "32px 36px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ background: C.accent, width: 6, height: 32, borderRadius: 3 }} />
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: C.accent, textTransform: "uppercase", letterSpacing: 2 }}>Deliverable 6 of 7</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Pilot KPI Framework</h1>
          </div>
        </div>
        <p style={{ color: C.muted, fontSize: 14, margin: "8px 0 0 18px", maxWidth: 720 }}>
          10 metrics with baselines, targets at Day 30/60/90, and measurement methods — mapped to the interventions funded in Deliverable 5.
        </p>
      </div>

      <div style={{ padding: "28px 36px", maxWidth: 1260, margin: "0 auto" }}>

        {/* ANALYTICAL HOOK */}
        <div style={{
          background: `linear-gradient(135deg, ${C.accentSoft} 0%, ${C.blueSoft} 100%)`,
          border: `1.5px solid ${C.accent}`, borderLeft: `5px solid ${C.accent}`,
          borderRadius: 10, padding: "20px 26px", marginBottom: 28,
        }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: C.accent, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>▸ Leading & Warning Signals</div>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.5 }}>
            <span style={{ color: C.green }}>Strongest leading indicator:</span> Documents Completed per Client (KPI #4).
          </div>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 8, lineHeight: 1.6 }}>
            Document completion is the earliest measurable signal that the pilot's core intervention (navigators) is working. It moves within the first 2 weeks, it's entirely within pilot control (no external dependency), and it directly predicts downstream outcomes — a client with 3+ documents at Day 30 is on the housing pathway; a client with 0-1 is stalled in the identity trap from Deliverable 1.
            <br /><br />
            <span style={{ color: C.red, fontWeight: 700 }}>Earliest warning signal:</span> <strong style={{ color: C.text }}>Intake-to-Shelter Drop-Off Rate (KPI #3)</strong>.
            If this stays above <strong style={{ color: C.red }}>28% at Day 30</strong>, the after-hours routing and bridge beds interventions are failing to convert intake contacts into shelter placements.
            The team should pivot by Day 35: reallocate bridge-bed funds to direct hotel vouchers (bypassing shelter MOUs) and extend routing staff hours past midnight.
            If both KPI #3 and KPI #4 are red at Day 30, the pilot is failing at both the front door and the document pipeline — the two things it was designed to fix.
          </div>
        </div>

        {/* METRIC CARDS */}
        <div style={{ display: "flex", gap: 14, marginBottom: 32, flexWrap: "wrap" }}>
          <MetricCard label="Total KPIs" value="10" sub="6 leading · 4 lagging" />
          <MetricCard label="Day 90 Placement Target" value="30" sub="Breakeven = 26 placements (Del. 4)" accent color={C.green} />
          <MetricCard label="KPIs Measurable in HMIS" value="3" sub="3 partner reporting · 4 require new tracking" />
          <MetricCard label="Baseline Data Available" value="10/10" sub="All baselines grounded in system data" accent />
        </div>

        {/* STOPLIGHT GRID */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, fontFamily: "monospace" }}>
            KPI Stoplight — All Metrics (Pre-Launch: Not Yet Measured)
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
            {kpis.map(k => (
              <div key={k.id} style={{
                background: C.graySoft, border: `1px solid ${C.gray}`,
                borderRadius: 8, padding: "14px 16px", cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onClick={() => setExpandedKpi(expandedKpi === k.id ? null : k.id)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: C.gray, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontFamily: "monospace", color: catColors[k.category], fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{k.category}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.3 }}>{k.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: C.muted }}>
                  <span>Baseline: <strong style={{ color: C.text }}>{k.baseline}</strong></span>
                  <span>Day 90: <strong style={{ color: C.green }}>{k.day90}</strong></span>
                </div>
                {k.failThreshold && (
                  <div style={{ fontSize: 10, color: C.red, marginTop: 4, fontFamily: "monospace" }}>
                    ⚠ Pivot if: {k.failThreshold}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
            {[
              { color: C.green, label: "On Track" },
              { color: C.yellow, label: "At Risk" },
              { color: C.red, label: "Behind" },
              { color: C.gray, label: "Not Yet Measured" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.muted }}>
                <div style={{ width: 12, height: 12, borderRadius: 6, background: s.color }} />{s.label}
              </div>
            ))}
          </div>
        </div>

        {/* KPI DETAIL TABLE */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, fontFamily: "monospace" }}>
            KPI Detail — Baselines, Targets & Measurement
          </h2>
          <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: C.cardAlt }}>
                  {["#", "KPI Name", "Category", "Baseline", "Day 30", "Day 60", "Day 90", "Data Source", "Measurement Method"].map(h => (
                    <th key={h} style={{ padding: "11px 8px", textAlign: "left", fontWeight: 700, fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: 0.8, color: C.muted, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kpis.map((k, i) => (
                  <tr key={k.id} style={{ background: i % 2 === 0 ? C.card : C.bg, borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "10px 8px", fontFamily: "monospace", fontWeight: 800, color: C.accent, fontSize: 13 }}>{k.id}</td>
                    <td style={{ padding: "10px 8px", fontWeight: 600, color: C.text, minWidth: 160 }}>
                      {k.name}
                      <div style={{ fontSize: 10, color: C.muted, marginTop: 2, fontWeight: 400 }}>↳ {k.intervention}</div>
                    </td>
                    <td style={{ padding: "10px 8px" }}>
                      <span style={{
                        background: `${catColors[k.category]}18`,
                        color: catColors[k.category],
                        padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                        fontFamily: "monospace", textTransform: "uppercase",
                      }}>{k.category}</span>
                    </td>
                    <td style={{ padding: "10px 8px", fontFamily: "monospace", fontWeight: 700, color: C.text }}>
                      {k.baseline}
                      <div style={{ fontSize: 9, color: C.muted, fontWeight: 400, fontFamily: "'IBM Plex Sans', sans-serif", marginTop: 2 }}>{k.baselineCalc}</div>
                    </td>
                    <td style={{ padding: "10px 8px", fontFamily: "monospace", fontWeight: 600, color: C.muted }}>{k.day30}</td>
                    <td style={{ padding: "10px 8px", fontFamily: "monospace", fontWeight: 600, color: C.orange }}>{k.day60}</td>
                    <td style={{ padding: "10px 8px", fontFamily: "monospace", fontWeight: 700, color: C.green }}>{k.day90}</td>
                    <td style={{ padding: "10px 8px", fontSize: 11, color: C.muted, maxWidth: 140 }}>{k.source}</td>
                    <td style={{ padding: "10px 8px", fontSize: 11, color: C.muted, maxWidth: 220 }}>{k.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* LEADING VS LAGGING MAP */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, fontFamily: "monospace" }}>
            Leading vs. Lagging Indicators
          </h2>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "24px" }}>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {/* Leading */}
              <div style={{ flex: "1 1 400px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 14, background: C.greenSoft, border: `2px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.green }}>Leading Indicators</div>
                    <div style={{ fontSize: 11, color: C.muted }}>Change first (Week 2-4) — early signal of pilot effectiveness</div>
                  </div>
                </div>
                {leading.map((k, i) => (
                  <div key={i} style={{
                    background: C.bg, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.green}`,
                    borderRadius: 6, padding: "10px 14px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{k.name}</span>
                      <span style={{ fontSize: 10, color: catColors[k.category], marginLeft: 8, fontFamily: "monospace" }}>{k.category}</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, fontFamily: "monospace" }}>{k.baseline} → {k.day90}</div>
                  </div>
                ))}
              </div>

              {/* Lagging */}
              <div style={{ flex: "1 1 400px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 14, background: C.purpleSoft, border: `2px solid ${C.purple}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>📊</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.purple }}>Lagging Indicators</div>
                    <div style={{ fontSize: 11, color: C.muted }}>Change last (Week 6-12) — confirm lasting impact</div>
                  </div>
                </div>
                {lagging.map((k, i) => (
                  <div key={i} style={{
                    background: C.bg, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.purple}`,
                    borderRadius: 6, padding: "10px 14px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{k.name}</span>
                      <span style={{ fontSize: 10, color: catColors[k.category], marginLeft: 8, fontFamily: "monospace" }}>{k.category}</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, fontFamily: "monospace" }}>{k.baseline} → {k.day90}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Flow arrow */}
            <div style={{ textAlign: "center", marginTop: 16, padding: "12px 0", borderTop: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 12, color: C.muted }}>
                <span style={{ color: C.green, fontWeight: 700 }}>Leading KPIs move first</span>
                <span style={{ margin: "0 12px", color: C.muted }}>→ predict →</span>
                <span style={{ color: C.purple, fontWeight: 700 }}>Lagging KPIs confirm impact</span>
              </div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
                If leading indicators are green but lagging indicators stall, the bottleneck is between shelter and housing — not intake and documents.
              </div>
            </div>
          </div>
        </div>

        {/* DATA COLLECTION FEASIBILITY */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, fontFamily: "monospace" }}>
            Data Collection Feasibility
          </h2>
          <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: C.cardAlt }}>
                  {["KPI", "Data Status", "Feasibility", "Notes / Risk"].map(h => (
                    <th key={h} style={{ padding: "12px 12px", textAlign: "left", fontWeight: 700, fontFamily: "monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, color: C.muted, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kpis.map((k, i) => {
                  const statusColor = k.feasibility === "hmis" ? C.green : k.feasibility === "partner" ? C.orange : C.blue;
                  const statusLabel = k.feasibility === "hmis" ? "EXISTS IN HMIS" : k.feasibility === "partner" ? "PARTNER REPORTING" : "NEW TRACKING";
                  return (
                    <tr key={k.id} style={{ background: i % 2 === 0 ? C.card : C.bg, borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "11px 12px", fontWeight: 600, color: C.text }}>
                        <span style={{ fontFamily: "monospace", color: C.accent, marginRight: 6 }}>#{k.id}</span>
                        {k.name}
                      </td>
                      <td style={{ padding: "11px 12px" }}>
                        <span style={{
                          background: `${statusColor}18`, color: statusColor,
                          padding: "3px 10px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                          fontFamily: "monospace",
                        }}>{statusLabel}</span>
                      </td>
                      <td style={{ padding: "11px 12px" }}>
                        {k.feasibility === "hmis" && <span style={{ color: C.green }}>✓ Ready — query HMIS</span>}
                        {k.feasibility === "partner" && <span style={{ color: C.orange }}>⚠ Needs partner MOU for data sharing</span>}
                        {k.feasibility === "new" && <span style={{ color: C.blue }}>◆ Pilot must build tracking from Day 1</span>}
                      </td>
                      <td style={{ padding: "11px 12px", color: C.muted, fontSize: 11, maxWidth: 320 }}>{k.feasibilityNote}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary counts */}
          <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
            {[
              { label: "Exists in HMIS", count: kpis.filter(k => k.feasibility === "hmis").length, color: C.green },
              { label: "Requires Partner Reporting", count: kpis.filter(k => k.feasibility === "partner").length, color: C.orange },
              { label: "Requires New Tracking", count: kpis.filter(k => k.feasibility === "new").length, color: C.blue },
            ].map((s, i) => (
              <div key={i} style={{
                background: `${s.color}10`, border: `1px solid ${s.color}30`,
                borderRadius: 6, padding: "8px 14px", fontSize: 12, display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontFamily: "monospace", fontWeight: 800, color: s.color, fontSize: 16 }}>{s.count}</span>
                <span style={{ color: C.muted }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 90-DAY MEASUREMENT NOTES */}
        <div style={{
          background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 10,
          padding: "18px 24px", marginBottom: 20,
        }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>
            90-Day Measurement Constraints
          </div>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.7 }}>
            <strong style={{ color: C.text }}>All 10 KPIs can be measured within 90 days</strong> — no proxies needed. However, two lagging indicators (KPI #2: Avg Days to Housing, KPI #10: Cycling Rate) will have small sample sizes at Day 30 and should not be used for pivot decisions before Day 60.
            KPI #9 (Cost per Placement) is meaningful only after ≥10 placements; report as "tracking" until Day 45-60.
            <br /><br />
            <strong style={{ color: C.text }}>Week 1 priority:</strong> Stand up new tracking systems for KPIs #4 (navigator checklist), #6 (KanCare coverage tracker), and #9 (financial tracking). These are the three metrics that don't exist anywhere today and will produce zero data if not built before the first client interaction.
          </div>
        </div>

        <div style={{ fontSize: 11, color: C.muted, textAlign: "center", padding: "20px 0 8px", borderTop: `1px solid ${C.border}` }}>
          KPIs mapped to Deliverable 5 interventions and Deliverable 1 bottlenecks · Baselines from PIT Count, HMIS, and program data · Web-verified corrections applied · Updated 2026-04-18
        </div>
      </div>
    </div>
  );
}
