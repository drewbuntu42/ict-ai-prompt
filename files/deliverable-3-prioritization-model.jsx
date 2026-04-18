import { useState } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, BarChart, Bar, LabelList, ReferenceLine
} from "recharts";

const C = {
  bg: "#0b0d12",
  card: "#12151e",
  cardAlt: "#1a1e2c",
  border: "#252a3a",
  text: "#e3e5ec",
  muted: "#7a7f96",
  accent: "#6366f1",
  accentSoft: "rgba(99,102,241,0.10)",
  red: "#ef4444",
  redSoft: "rgba(239,68,68,0.10)",
  orange: "#f59e0b",
  orangeSoft: "rgba(245,158,11,0.10)",
  yellow: "#facc15",
  yellowSoft: "rgba(250,204,21,0.08)",
  green: "#34d399",
  greenSoft: "rgba(52,211,153,0.10)",
  blue: "#60a5fa",
  blueSoft: "rgba(96,165,250,0.10)",
};

const interventions = [
  { id: 1, name: "Document Navigator Staffing", bottleneck: "ID/doc circular barrier (Del. 1)", affected: 85, feasibility: 5, cost: 72000, impact: 5, dependency: "None — standalone", costBasis: "2 FTE navigators × $20/hr × 90 days × benefits", peopleReached: 210 },
  { id: 2, name: "After-Hours & Weekend Routing", bottleneck: "No adult routing after 7 PM or weekends (Del. 1)", affected: 115, feasibility: 4, cost: 54000, impact: 4, dependency: "None — standalone", costBasis: "4 part-time staff × overnight/weekend shifts at Open Door + Second Light", peopleReached: 185 },
  { id: 3, name: "Transit Pass Fund", bottleneck: "$50/mo bus pass at zero income (Del. 1)", affected: 50, feasibility: 5, cost: 30000, impact: 3, dependency: "None — standalone", costBasis: "200 passes × $50/mo × 3 months", peopleReached: 200 },
  { id: 4, name: "Youth Age-21 Bridge", bottleneck: "DCF IL hard-stop at 21 (Del. 2)", affected: 20, feasibility: 4, cost: 63000, impact: 5, dependency: "None — extends existing DCF IL", costBasis: "~42 youth × $500/mo case mgmt × 3 months", peopleReached: 42 },
  { id: 5, name: "NEXTenant Landlord Incentives", bottleneck: "Private market screens out all (Del. 1)", affected: 70, feasibility: 4, cost: 80000, impact: 5, dependency: "Requires docs/ID first", costBasis: "$2,000 deposit + $500 risk mitigation × 40 placements", peopleReached: 40 },
  { id: 6, name: "SNAP Expedited Processing Training", bottleneck: "7-day SNAP not flagged (Del. 1)", affected: 60, feasibility: 5, cost: 8000, impact: 2, dependency: "None — training only", costBasis: "Half-day training for 40 intake staff + materials", peopleReached: 180 },
  { id: 7, name: "Emergency Bridge Beds Fund", bottleneck: "CrossRoads/BRIDGES full (Del. 1 & 2)", affected: 40, feasibility: 3, cost: 65000, impact: 4, dependency: "Requires partner MOUs", costBasis: "Flex fund for 10 beds × $72/night × 90 days", peopleReached: 45 },
  { id: 8, name: "KanCare Re-enrollment Navigator", bottleneck: "KanCare auto-disenrolls (Del. 1 & 2)", affected: 80, feasibility: 4, cost: 36000, impact: 3, dependency: "None — standalone", costBasis: "1 FTE benefits specialist embedded at Second Light", peopleReached: 160 },
  { id: 9, name: "Second Light Bed-Matching Acceleration", bottleneck: "Phone-based referrals (Del. 1)", affected: 130, feasibility: 2, cost: 95000, impact: 4, dependency: "Requires HMIS integration + partner buy-in", costBasis: "Dev contractor + HMIS config + partner training", peopleReached: 300 },
  { id: 10, name: "SOUL Family Custodian Recruitment", bottleneck: "13 open custodian slots (Del. 2)", affected: 20, feasibility: 3, cost: 18000, impact: 3, dependency: "None — standalone", costBasis: "Recruitment campaign + custodian training for 13 matches", peopleReached: 13 },
];

function computeScore(i) {
  const maxAffected = 130;
  const maxCost = 95000;
  const normAffected = i.affected / maxAffected;
  const normFeasibility = i.feasibility / 5;
  const normImpact = i.impact / 5;
  const costEff = (i.peopleReached / i.cost) * 10000;
  const maxCostEff = 6.25; // transit passes
  const normCostEff = Math.min(costEff / maxCostEff, 1);
  return Math.round((normAffected * 0.30 + normFeasibility * 0.25 + normImpact * 0.25 + normCostEff * 0.20) * 100);
}

const scored = interventions.map(i => ({ ...i, score: computeScore(i) })).sort((a, b) => b.score - a.score);

const budgetStack = [];
let running = 0;
scored.forEach(i => {
  running += i.cost;
  budgetStack.push({ ...i, cumulative: running, funded: running <= 400000 });
});

const fundedItems = budgetStack.filter(b => b.funded);
const unfundedItems = budgetStack.filter(b => !b.funded);
const totalFunded = fundedItems.reduce((s, i) => s + i.cost, 0);
const remaining = 400000 - totalFunded;

const top3 = scored.slice(0, 3);

const scatterData = scored.map(i => ({
  x: i.feasibility,
  y: i.impact,
  z: i.affected,
  name: i.name.length > 22 ? i.name.slice(0, 20) + "…" : i.name,
  fullName: i.name,
  cost: i.cost,
  color: i.cost < 50000 ? C.green : i.cost <= 100000 ? C.yellow : C.red,
}));

const deps = [
  { type: "sequential", items: ["Document Navigator", "→", "NEXTenant Landlord Placement"], reason: "Clients need ID + docs before landlord applications" },
  { type: "sequential", items: ["Emergency Bridge Beds", "→", "Partner MOUs"], reason: "Flex beds require signed agreements with shelter operators" },
  { type: "sequential", items: ["Second Light Bed-Matching", "→", "HMIS Integration + Partner Training"], reason: "Tech build depends on data infrastructure + staff adoption" },
  { type: "parallel", items: ["Transit Pass Fund", "||", "SNAP Training", "||", "KanCare Navigator"], reason: "All standalone — deploy simultaneously from Day 1" },
  { type: "parallel", items: ["After-Hours & Weekend Routing", "||", "Youth Age-21 Bridge"], reason: "Independent staffing hires — run in parallel" },
];

function MetricCard({ label, value, sub, accent }) {
  return (
    <div style={{ background: accent ? C.accentSoft : C.card, border: `1px solid ${accent ? C.accent : C.border}`, borderRadius: 8, padding: "16px 20px", flex: 1, minWidth: 200 }}>
      <div style={{ color: C.muted, fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 1.2 }}>{label}</div>
      <div style={{ color: accent ? C.accent : C.text, fontSize: 28, fontWeight: 800, marginTop: 4, fontFamily: "monospace" }}>{value}</div>
      {sub && <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

const ScatterTooltipContent = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "10px 14px", borderRadius: 6, fontSize: 12, maxWidth: 240 }}>
      <div style={{ fontWeight: 700, color: C.text, marginBottom: 4 }}>{d.fullName}</div>
      <div style={{ color: C.muted }}>Feasibility: <strong style={{ color: C.text }}>{d.x}/5</strong></div>
      <div style={{ color: C.muted }}>Impact: <strong style={{ color: C.text }}>{d.y}/5</strong></div>
      <div style={{ color: C.muted }}>People/mo: <strong style={{ color: C.text }}>{d.z}</strong></div>
      <div style={{ color: C.muted }}>Cost: <strong style={{ color: C.text }}>${(d.cost / 1000).toFixed(0)}K</strong></div>
    </div>
  );
};

export default function PrioritizationModel() {
  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: `linear-gradient(135deg, ${C.cardAlt} 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.border}`, padding: "32px 36px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ background: C.accent, width: 6, height: 32, borderRadius: 3 }} />
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: C.accent, textTransform: "uppercase", letterSpacing: 2 }}>Deliverable 3 of 7</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Prioritization Model</h1>
          </div>
        </div>
        <p style={{ color: C.muted, fontSize: 14, margin: "8px 0 0 18px", maxWidth: 700 }}>
          Scoring bottlenecks from Deliverables 1 &amp; 2 to recommend the highest-impact interventions for 90 days and $400K.
        </p>
      </div>

      <div style={{ padding: "28px 36px", maxWidth: 1240, margin: "0 auto" }}>

        {/* ANALYTICAL HOOK */}
        <div style={{
          background: `linear-gradient(135deg, ${C.accentSoft} 0%, ${C.blueSoft} 100%)`,
          border: `1.5px solid ${C.accent}`, borderLeft: `5px solid ${C.accent}`,
          borderRadius: 10, padding: "20px 26px", marginBottom: 28,
        }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: C.accent, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>▸ Recommended Combination</div>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.5 }}>
            Three interventions maximize people moved to housing within 90 days for under $400K:
          </div>
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {top3.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14 }}>
                <span style={{ background: C.accent, color: "#fff", width: 24, height: 24, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontWeight: 700, color: C.text }}>{t.name}</span>
                <span style={{ color: C.muted }}>— ${(t.cost / 1000).toFixed(0)}K · {t.peopleReached} people reached</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 12, lineHeight: 1.6, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
            Combined cost: <strong style={{ color: C.text }}>${((top3[0].cost + top3[1].cost + top3[2].cost) / 1000).toFixed(0)}K of $400K</strong>, leaving ${((400000 - top3[0].cost - top3[1].cost - top3[2].cost) / 1000).toFixed(0)}K for additional interventions.
            <br /><br />
            <strong style={{ color: C.orange }}>Left unfunded at $400K:</strong> Second Light Bed-Matching Acceleration ($95K, score {scored.find(s => s.id === 9).score}/100). Despite affecting the most people (130/month), its feasibility score of 2/5 drops it below the line — the HMIS integration and partner adoption required cannot reliably complete in 90 days.
          </div>
        </div>

        {/* METRIC CARDS */}
        <div style={{ display: "flex", gap: 14, marginBottom: 32, flexWrap: "wrap" }}>
          <MetricCard label="Operating Budget" value="$400K" sub="$100K reserved for marketing/adoption" />
          <MetricCard label="Bottlenecks Scored" value="10" sub="From Deliverables 1 & 2" />
          <MetricCard label="Interventions Funded" value={fundedItems.length.toString()} sub={`$${(totalFunded / 1000).toFixed(0)}K allocated · $${(remaining / 1000).toFixed(0)}K remaining`} accent />
          <MetricCard label="Total People Reached" value={fundedItems.reduce((s, i) => s + i.peopleReached, 0).toString()} sub="Across funded interventions" />
        </div>

        {/* SCORING WEIGHTS */}
        <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
          {[
            { label: "People Affected", weight: "30%", color: C.red },
            { label: "Feasibility (90 days)", weight: "25%", color: C.green },
            { label: "Impact if Solved", weight: "25%", color: C.blue },
            { label: "Cost Efficiency", weight: "20%", color: C.orange },
          ].map((w, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted, background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 12px" }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: w.color }} />
              {w.label}: <strong style={{ color: C.text }}>{w.weight}</strong>
            </div>
          ))}
        </div>

        {/* SCORING MATRIX TABLE */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, fontFamily: "monospace" }}>
            Scoring Matrix — All Interventions Ranked
          </h2>
          <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: C.cardAlt }}>
                  {["#", "Intervention", "Bottleneck", "Affected/Mo", "Feasibility", "Cost", "Impact", "Dependency", "Score"].map(h => (
                    <th key={h} style={{ padding: "11px 10px", textAlign: "left", fontWeight: 700, fontFamily: "monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, color: C.muted, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scored.map((s, i) => {
                  const isFunded = budgetStack.find(b => b.id === s.id)?.funded;
                  return (
                    <tr key={s.id} style={{ background: i % 2 === 0 ? C.card : C.bg, borderBottom: `1px solid ${C.border}`, opacity: isFunded ? 1 : 0.55 }}>
                      <td style={{ padding: "10px", fontFamily: "monospace", fontWeight: 800, color: isFunded ? C.accent : C.muted }}>{i + 1}</td>
                      <td style={{ padding: "10px", fontWeight: 600, color: C.text, whiteSpace: "nowrap" }}>
                        {s.name}
                        {!isFunded && <span style={{ fontSize: 9, color: C.red, marginLeft: 6, fontWeight: 700 }}>UNFUNDED</span>}
                      </td>
                      <td style={{ padding: "10px", color: C.muted, fontSize: 11, maxWidth: 200 }}>{s.bottleneck}</td>
                      <td style={{ padding: "10px", fontFamily: "monospace", fontWeight: 700, color: s.affected >= 80 ? C.red : s.affected >= 50 ? C.orange : C.text }}>{s.affected}</td>
                      <td style={{ padding: "10px" }}>
                        <div style={{ display: "flex", gap: 2 }}>
                          {[1,2,3,4,5].map(n => (
                            <div key={n} style={{ width: 14, height: 14, borderRadius: 3, background: n <= s.feasibility ? C.green : `${C.green}20` }} />
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: "10px", fontFamily: "monospace", fontWeight: 600, color: s.cost > 80000 ? C.red : s.cost > 50000 ? C.orange : C.green }}>${(s.cost / 1000).toFixed(0)}K</td>
                      <td style={{ padding: "10px" }}>
                        <div style={{ display: "flex", gap: 2 }}>
                          {[1,2,3,4,5].map(n => (
                            <div key={n} style={{ width: 14, height: 14, borderRadius: 3, background: n <= s.impact ? C.blue : `${C.blue}20` }} />
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: "10px", color: s.dependency === "None — standalone" || s.dependency.startsWith("None") ? C.green : C.orange, fontSize: 11 }}>{s.dependency}</td>
                      <td style={{ padding: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 40, height: 8, borderRadius: 4, background: `${C.accent}30`, overflow: "hidden" }}>
                            <div style={{ width: `${s.score}%`, height: "100%", background: C.accent, borderRadius: 4 }} />
                          </div>
                          <span style={{ fontFamily: "monospace", fontWeight: 800, color: C.accent, fontSize: 13 }}>{s.score}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 8, fontStyle: "italic" }}>
            Cost basis for each line item shown in the detail column. All staffing costs include benefits loading. Unfunded rows are dimmed.
          </div>
        </div>

        {/* SCATTER PLOT */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, fontFamily: "monospace" }}>
            Feasibility vs. Impact — Bubble Size = People Affected
          </h2>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px 16px 8px" }}>
            <ResponsiveContainer width="100%" height={360}>
              <ScatterChart margin={{ top: 20, right: 40, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis type="number" dataKey="x" domain={[1, 5.5]} name="Feasibility" tick={{ fill: C.muted, fontSize: 12 }} axisLine={{ stroke: C.border }} label={{ value: "Feasibility in 90 Days →", position: "bottom", fill: C.muted, fontSize: 12, offset: 0 }} ticks={[1,2,3,4,5]} />
                <YAxis type="number" dataKey="y" domain={[1, 5.5]} name="Impact" tick={{ fill: C.muted, fontSize: 12 }} axisLine={{ stroke: C.border }} label={{ value: "Impact if Solved →", angle: -90, position: "insideLeft", fill: C.muted, fontSize: 12 }} ticks={[1,2,3,4,5]} />
                <ZAxis type="number" dataKey="z" range={[200, 1200]} />
                <Tooltip content={<ScatterTooltipContent />} />
                {/* Quadrant labels */}
                <ReferenceLine x={3} stroke={C.border} strokeDasharray="6 4" />
                <ReferenceLine y={3} stroke={C.border} strokeDasharray="6 4" />
                <Scatter data={scatterData}>
                  {scatterData.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.7} stroke={d.color} strokeWidth={1.5} />)}
                  <LabelList dataKey="name" position="top" style={{ fill: C.muted, fontSize: 9, fontFamily: "monospace" }} offset={10} />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 14, padding: "6px 10px 10px", flexWrap: "wrap", justifyContent: "center" }}>
              {[
                { label: "Cost < $50K", color: C.green },
                { label: "Cost $50-100K", color: C.yellow },
                { label: "Cost > $100K", color: C.red },
              ].map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.muted }}>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: l.color, opacity: 0.7 }} />{l.label}
                </div>
              ))}
              <div style={{ fontSize: 11, color: C.muted }}>Top-right quadrant = high impact + high feasibility (prioritize)</div>
            </div>
          </div>
        </div>

        {/* DEPENDENCY CHAIN PANEL */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, fontFamily: "monospace" }}>
            Dependency Chains — Sequential vs. Parallel
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {deps.map((d, i) => (
              <div key={i} style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 8,
                padding: "14px 20px", display: "flex", alignItems: "center", gap: 16,
                borderLeft: `4px solid ${d.type === "sequential" ? C.orange : C.green}`,
              }}>
                <span style={{
                  fontSize: 9, fontWeight: 800, fontFamily: "monospace", textTransform: "uppercase",
                  letterSpacing: 1.5, color: d.type === "sequential" ? C.orange : C.green,
                  background: d.type === "sequential" ? C.orangeSoft : C.greenSoft,
                  padding: "3px 8px", borderRadius: 4, flexShrink: 0,
                }}>{d.type === "sequential" ? "SEQUENTIAL" : "PARALLEL"}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {d.items.map((item, j) => (
                    item === "→" || item === "||" ?
                      <span key={j} style={{ color: d.type === "sequential" ? C.orange : C.green, fontWeight: 800, fontSize: 16 }}>{item}</span> :
                      <span key={j} style={{ background: C.cardAlt, padding: "4px 10px", borderRadius: 5, fontSize: 12, fontWeight: 600, border: `1px solid ${C.border}` }}>{item}</span>
                  ))}
                </div>
                <span style={{ fontSize: 11, color: C.muted, marginLeft: "auto", maxWidth: 280, textAlign: "right" }}>{d.reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BUDGET STACKING */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, fontFamily: "monospace" }}>
            What Fits in $400K — Priority-Ordered Budget Stack
          </h2>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px" }}>
            {budgetStack.map((b, i) => {
              const pct = (b.cost / 400000) * 100;
              const cumPct = (b.cumulative / 400000) * 100;
              return (
                <div key={i} style={{ marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 12, color: b.funded ? C.accent : C.muted, width: 20 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: b.funded ? C.text : C.muted, flex: 1, textDecoration: b.funded ? "none" : "line-through" }}>{b.name}</span>
                    <span style={{ fontFamily: "monospace", fontSize: 12, color: b.funded ? C.text : C.muted }}>${(b.cost / 1000).toFixed(0)}K</span>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: b.funded ? (cumPct > 90 ? C.orange : C.green) : C.red, width: 80, textAlign: "right" }}>
                      {b.funded ? `$${(b.cumulative / 1000).toFixed(0)}K` : "OVER"}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 30 }}>
                    <div style={{ flex: 1, height: 10, borderRadius: 5, background: `${C.accent}15`, overflow: "hidden", position: "relative" }}>
                      <div style={{
                        width: `${Math.min(cumPct, 100)}%`, height: "100%", borderRadius: 5,
                        background: b.funded ? (cumPct > 90 ? `linear-gradient(90deg, ${C.accent}, ${C.orange})` : C.accent) : C.red,
                        opacity: b.funded ? 0.8 : 0.3,
                        transition: "width 0.3s",
                      }} />
                      {/* Budget line marker */}
                      <div style={{ position: "absolute", top: -2, left: "100%", width: 2, height: 14, background: C.red, borderRadius: 1 }} />
                    </div>
                  </div>
                  {i === fundedItems.length - 1 && (
                    <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: 30, marginTop: 8, paddingTop: 8, borderTop: `1px dashed ${C.green}` }}>
                      <span style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>
                        ✓ {fundedItems.length} interventions funded — {fundedItems.reduce((s, f) => s + f.peopleReached, 0)} people reached
                      </span>
                      <span style={{ fontSize: 12, fontFamily: "monospace", color: C.green, fontWeight: 700 }}>
                        ${(remaining / 1000).toFixed(0)}K remaining
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Unfunded summary */}
            <div style={{ marginTop: 16, padding: "14px 16px", background: C.redSoft, border: `1px solid ${C.red}40`, borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 6, fontFamily: "monospace" }}>
                UNFUNDED — {unfundedItems.length} intervention{unfundedItems.length > 1 ? "s" : ""} beyond $400K
              </div>
              {unfundedItems.map((u, i) => (
                <div key={i} style={{ fontSize: 12, color: C.muted, marginBottom: 2 }}>
                  • {u.name} — ${(u.cost / 1000).toFixed(0)}K — {u.peopleReached} people — Score: {u.score}/100
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COST BASIS REFERENCE */}
        <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 24px", marginBottom: 20 }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Cost Basis Reference</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12, color: C.muted }}>
            {scored.slice(0, 8).map((s, i) => (
              <div key={i}>
                <strong style={{ color: C.text }}>{s.name}:</strong> {s.costBasis}
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 11, color: C.muted, textAlign: "center", padding: "20px 0 8px", borderTop: `1px solid ${C.border}` }}>
          Scoring model built on bottleneck data from Deliverables 1 &amp; 2 · Costs based on Wichita labor market ($15-22/hr + 25% benefits) and program data · Web-verified corrections applied 2026-04-18
        </div>
      </div>
    </div>
  );
}
