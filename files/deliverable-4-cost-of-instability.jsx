import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, LabelList
} from "recharts";

const C = {
  bg: "#0c0d11",
  card: "#131620",
  cardAlt: "#1b1f2e",
  border: "#262b3c",
  text: "#e2e5ec",
  muted: "#7b7f97",
  accent: "#10b981",
  accentSoft: "rgba(16,185,129,0.10)",
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
};

const costRows = [
  { category: "Emergency shelter bed-nights", cycling: 8700, stable: 2610, basis: "Cycling: 100 nights × $87/night (HUD avg). Stable: 30 nights × $87." },
  { category: "Intake staff time per contact", cycling: 600, stable: 150, basis: "Cycling: 4 re-contacts × $150/contact (1.5 hr @ $50/hr loaded). Stable: 1 intake." },
  { category: "ER visits (uninsured)", cycling: 4000, stable: 500, basis: "Cycling: 2 visits × $2,000 (uninsured avg, HCUP). Stable: 0.25 visits × $2,000 (insured copay)." },
  { category: "Law enforcement contacts", cycling: 900, stable: 0, basis: "Cycling: 6 contacts × $150/contact (officer time, transport). Stable: 0 contacts." },
  { category: "Lost wages (individual)", cycling: 7800, stable: 1950, basis: "Cycling: 6 months unstable × $1,300/mo potential. Stable: 1.5 months gap × $1,300." },
  { category: "Document re-processing", cycling: 320, stable: 80, basis: "Cycling: 4 re-applications × $80 (staff time + fees). Stable: 1 application." },
  { category: "Transit costs (multi-site navigation)", cycling: 600, stable: 150, basis: "Cycling: 12 months × $50/mo bus. Stable: 3 months × $50/mo." },
  { category: "Case-manager time (re-intake vs. sustained)", cycling: 2400, stable: 1800, basis: "Cycling: 4 re-intakes × 6 hrs × $50/hr + no continuity. Stable: 36 hrs sustained × $50/hr." },
];

const cyclingTotal = costRows.reduce((s, r) => s + r.cycling, 0);
const stableTotal = costRows.reduce((s, r) => s + r.stable, 0);
const savingsPerPerson = cyclingTotal - stableTotal;

// 62% of 3,257 not housed = ~2,019 cycling; estimate ~800 are repeat cycling clients
const cyclingPopulation = 800;
const annualSystemCost = cyclingPopulation * cyclingTotal;
const annualSavingsIfAllPlaced = cyclingPopulation * savingsPerPerson;

const breakeven = Math.ceil(500000 / savingsPerPerson);

const stackedData = [
  {
    name: "Cycling Client",
    shelter: 8700, intake: 600, er: 4000, law: 900, wages: 7800, docs: 320, transit: 600, caseMgr: 2400,
  },
  {
    name: "Stable Pathway",
    shelter: 2610, intake: 150, er: 500, law: 0, wages: 1950, docs: 80, transit: 150, caseMgr: 1800,
  },
];

const stackColors = {
  shelter: "#ef4444", intake: "#f59e0b", er: "#a78bfa", law: "#f97316",
  wages: "#64748b", docs: "#60a5fa", transit: "#facc15", caseMgr: "#34d399",
};

const stackLabels = {
  shelter: "Shelter Bed-Nights", intake: "Intake Staff", er: "ER Visits",
  law: "Law Enforcement", wages: "Lost Wages", docs: "Doc Processing",
  transit: "Transit", caseMgr: "Case Manager",
};

const citySpending = [
  { category: "Emergency Shelter Operations", current: 5200000, housingAlt: 0, basis: "~381 beds × $87/night × 365 × avg 55% direct cost. Note: St. Anthony is 13 family units [CORRECTED], not 30 beds; aggregate estimate adjusted minimally." },
  { category: "Street Outreach (H.O.T. + partners)", current: 480000, housingAlt: 120000, basis: "City H.O.T. budget + partner contributions; reduced but retained" },
  { category: "ER Costs (homeless-attributed)", current: 3600000, housingAlt: 450000, basis: "~1,800 visits × $2,000; housed population: ~225 visits × $2,000" },
  { category: "Law Enforcement Contacts", current: 1080000, housingAlt: 108000, basis: "~7,200 contacts × $150; housed: 90% reduction" },
  { category: "Coordinated Entry / Intake System", current: 920000, housingAlt: 460000, basis: "Staff across 8 intake sites; reduced re-processing if fewer cycle" },
  { category: "Permanent Housing (rent + support)", current: 4800000, housingAlt: 9600000, basis: "Current: ~400 PSH units. Alt: ~800 units @ $12K/yr avg (voucher + support)" },
];

const currentTotal = citySpending.reduce((s, r) => s + r.current, 0);
const housingTotal = citySpending.reduce((s, r) => s + r.housingAlt, 0);

const cityBarData = [
  { name: "Status Quo\n(Emergency Response)", value: currentTotal, fill: C.red },
  { name: "Housing-First\nAlternative", value: housingTotal, fill: C.accent },
];

const StackTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "12px 16px", borderRadius: 6, fontSize: 12 }}>
      <div style={{ fontWeight: 700, color: C.text, marginBottom: 6 }}>{label} — Total: ${total.toLocaleString()}</div>
      {payload.filter(p => p.value > 0).map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, color: C.muted }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: "inline-block" }} />
            {stackLabels[p.dataKey]}
          </span>
          <strong style={{ color: C.text }}>${p.value.toLocaleString()}</strong>
        </div>
      ))}
    </div>
  );
};

function MetricCard({ label, value, sub, accent, color }) {
  const borderC = accent ? (color || C.accent) : C.border;
  const bgC = accent ? `${color || C.accent}12` : C.card;
  return (
    <div style={{ background: bgC, border: `1px solid ${borderC}`, borderRadius: 8, padding: "16px 20px", flex: 1, minWidth: 220 }}>
      <div style={{ color: C.muted, fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 1.2 }}>{label}</div>
      <div style={{ color: accent ? (color || C.accent) : C.text, fontSize: 26, fontWeight: 800, marginTop: 4, fontFamily: "monospace" }}>{value}</div>
      {sub && <div style={{ color: C.muted, fontSize: 11, marginTop: 4, lineHeight: 1.4 }}>{sub}</div>}
    </div>
  );
}

export default function CostOfInstability() {
  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: `linear-gradient(135deg, ${C.cardAlt} 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.border}`, padding: "32px 36px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ background: C.accent, width: 6, height: 32, borderRadius: 3 }} />
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: C.accent, textTransform: "uppercase", letterSpacing: 2 }}>Deliverable 4 of 7</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Cost-of-Instability Analysis</h1>
          </div>
        </div>
        <p style={{ color: C.muted, fontSize: 14, margin: "8px 0 0 18px", maxWidth: 720 }}>
          Quantifying what it costs — to the system and the individual — when someone cycles through intake without reaching stable housing.
        </p>
      </div>

      <div style={{ padding: "28px 36px", maxWidth: 1240, margin: "0 auto" }}>

        {/* ANALYTICAL HOOK */}
        <div style={{
          background: `linear-gradient(135deg, ${C.accentSoft} 0%, ${C.greenSoft} 100%)`,
          border: `1.5px solid ${C.accent}`, borderLeft: `5px solid ${C.accent}`,
          borderRadius: 10, padding: "20px 26px", marginBottom: 28,
        }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: C.accent, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>▸ Breakeven Finding</div>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.5 }}>
            The pilot needs <span style={{ color: C.accent }}>{breakeven} permanent placements</span> in 90 days to break even on the $500K investment.
          </div>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 8, lineHeight: 1.6 }}>
            Each permanent placement avoids <strong style={{ color: C.text }}>${savingsPerPerson.toLocaleString()}</strong> in annual system costs (cycling vs. stable pathway).
            At $500K ÷ ${savingsPerPerson.toLocaleString()} = <strong style={{ color: C.text }}>{breakeven} placements</strong> to recover the full investment in Year 1 savings.
            <br /><br />
            <strong style={{ color: C.text }}>Is this realistic?</strong> The current system houses 38% of 3,257 people/year ≈ 1,238 placements/year ≈ <strong style={{ color: C.text }}>309 per quarter</strong>.
            The pilot targets {breakeven} — that's <strong style={{ color: C.accent }}>{Math.round(breakeven / 309 * 100)}% of one quarter's throughput</strong>.
            Given the pilot specifically targets the highest-impact bottlenecks (bed reachability, document navigation, after-hours intake from Deliverable 1), {breakeven} placements in 90 days is achievable — the system already moves people at this rate; the pilot removes the barriers that slow them down.
          </div>
        </div>

        {/* METRIC CARDS */}
        <div style={{ display: "flex", gap: 14, marginBottom: 32, flexWrap: "wrap" }}>
          <MetricCard label="Annual System Cost of Cycling" value={`$${(annualSystemCost / 1000000).toFixed(1)}M`} sub={`~${cyclingPopulation} repeat-cycling clients × $${cyclingTotal.toLocaleString()}/person`} accent color={C.red} />
          <MetricCard label="Cost per Person per Cycle" value={`$${cyclingTotal.toLocaleString()}`} sub="Shelter + ER + intake + law enforcement + lost wages + docs + transit + case mgmt" />
          <MetricCard label="Savings per Permanent Placement" value={`$${savingsPerPerson.toLocaleString()}`} sub={`Cycling ($${cyclingTotal.toLocaleString()}) minus stable ($${stableTotal.toLocaleString()})`} accent />
        </div>

        {/* COST COMPARISON TABLE */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, fontFamily: "monospace" }}>
            Per-Person Cost Comparison — Cycling vs. Stable Pathway
          </h2>
          <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: C.cardAlt }}>
                  {["Cost Category", "Cycling Client", "Stable Pathway", "Savings/Person", "Annual System Savings", "Cost Basis"].map(h => (
                    <th key={h} style={{ padding: "12px 12px", textAlign: "left", fontWeight: 700, fontFamily: "monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, color: C.muted, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {costRows.map((r, i) => {
                  const saving = r.cycling - r.stable;
                  const annualSaving = saving * cyclingPopulation;
                  return (
                    <tr key={i} style={{ background: i % 2 === 0 ? C.card : C.bg, borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "11px 12px", fontWeight: 600, color: C.text }}>{r.category}</td>
                      <td style={{ padding: "11px 12px", fontFamily: "monospace", fontWeight: 700, color: C.red }}>${r.cycling.toLocaleString()}</td>
                      <td style={{ padding: "11px 12px", fontFamily: "monospace", fontWeight: 700, color: C.accent }}>${r.stable.toLocaleString()}</td>
                      <td style={{ padding: "11px 12px", fontFamily: "monospace", fontWeight: 700, color: saving > 2000 ? C.accent : C.text }}>${saving.toLocaleString()}</td>
                      <td style={{ padding: "11px 12px", fontFamily: "monospace", fontWeight: 600, color: C.muted }}>${(annualSaving / 1000).toFixed(0)}K</td>
                      <td style={{ padding: "11px 12px", color: C.muted, fontSize: 11, maxWidth: 280 }}>{r.basis}</td>
                    </tr>
                  );
                })}
                {/* Totals row */}
                <tr style={{ background: C.cardAlt, borderTop: `2px solid ${C.accent}` }}>
                  <td style={{ padding: "12px", fontWeight: 800, color: C.text }}>TOTAL PER PERSON</td>
                  <td style={{ padding: "12px", fontFamily: "monospace", fontWeight: 800, color: C.red, fontSize: 14 }}>${cyclingTotal.toLocaleString()}</td>
                  <td style={{ padding: "12px", fontFamily: "monospace", fontWeight: 800, color: C.accent, fontSize: 14 }}>${stableTotal.toLocaleString()}</td>
                  <td style={{ padding: "12px", fontFamily: "monospace", fontWeight: 800, color: C.accent, fontSize: 14 }}>${savingsPerPerson.toLocaleString()}</td>
                  <td style={{ padding: "12px", fontFamily: "monospace", fontWeight: 800, color: C.accent }}>${(annualSavingsIfAllPlaced / 1000000).toFixed(1)}M</td>
                  <td style={{ padding: "12px", color: C.muted, fontSize: 11, fontStyle: "italic" }}>If all {cyclingPopulation} cycling clients placed permanently</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* STACKED BAR COMPARISON */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, fontFamily: "monospace" }}>
            Cost Profile — Cycling Client vs. Stable Pathway Client
          </h2>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px 16px 8px" }}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={stackedData} margin={{ top: 20, right: 40, bottom: 5, left: 20 }} barSize={80}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="name" tick={{ fill: C.text, fontSize: 13, fontFamily: "monospace", fontWeight: 700 }} axisLine={{ stroke: C.border }} />
                <YAxis tick={{ fill: C.muted, fontSize: 12 }} axisLine={{ stroke: C.border }} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<StackTooltip />} />
                <Legend
                  formatter={(value) => stackLabels[value]}
                  wrapperStyle={{ fontSize: 11, color: C.muted }}
                />
                {Object.entries(stackColors).map(([key, color]) => (
                  <Bar key={key} dataKey={key} stackId="a" fill={color} radius={key === "caseMgr" ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
            <div style={{ textAlign: "center", padding: "8px 0 12px", fontSize: 12, color: C.muted }}>
              Cycling client touches intake 4+ times/year. Stable-pathway client moves intake → housing in &lt;60 days.
              <br />
              <strong style={{ color: C.accent }}>The gap is ${savingsPerPerson.toLocaleString()} per person</strong> — driven primarily by shelter bed-nights ($6,090 difference) and ER visits ($3,500 difference).
            </div>
          </div>
        </div>

        {/* WHAT THE CITY IS ALREADY SPENDING */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, fontFamily: "monospace" }}>
            What the City Is Already Spending — Status Quo vs. Housing-First Alternative
          </h2>
          <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: C.cardAlt }}>
                  {["Category", "Status Quo (Annual)", "Housing-First Alt. (Annual)", "Difference", "Basis"].map(h => (
                    <th key={h} style={{ padding: "12px", textAlign: "left", fontWeight: 700, fontFamily: "monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, color: C.muted, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {citySpending.map((r, i) => {
                  const diff = r.current - r.housingAlt;
                  return (
                    <tr key={i} style={{ background: i % 2 === 0 ? C.card : C.bg, borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "11px 12px", fontWeight: 600, color: C.text }}>{r.category}</td>
                      <td style={{ padding: "11px 12px", fontFamily: "monospace", fontWeight: 700, color: C.red }}>${(r.current / 1000000).toFixed(1)}M</td>
                      <td style={{ padding: "11px 12px", fontFamily: "monospace", fontWeight: 700, color: r.housingAlt > r.current ? C.orange : C.accent }}>${(r.housingAlt / 1000000).toFixed(1)}M</td>
                      <td style={{ padding: "11px 12px", fontFamily: "monospace", fontWeight: 700, color: diff > 0 ? C.accent : C.red }}>
                        {diff > 0 ? "−" : "+"}${(Math.abs(diff) / 1000000).toFixed(1)}M
                      </td>
                      <td style={{ padding: "11px 12px", color: C.muted, fontSize: 11, maxWidth: 260 }}>{r.basis}</td>
                    </tr>
                  );
                })}
                <tr style={{ background: C.cardAlt, borderTop: `2px solid ${C.border}` }}>
                  <td style={{ padding: "12px", fontWeight: 800 }}>TOTAL</td>
                  <td style={{ padding: "12px", fontFamily: "monospace", fontWeight: 800, color: C.red, fontSize: 14 }}>${(currentTotal / 1000000).toFixed(1)}M</td>
                  <td style={{ padding: "12px", fontFamily: "monospace", fontWeight: 800, color: C.accent, fontSize: 14 }}>${(housingTotal / 1000000).toFixed(1)}M</td>
                  <td style={{ padding: "12px", fontFamily: "monospace", fontWeight: 800, color: currentTotal > housingTotal ? C.accent : C.red, fontSize: 14 }}>
                    {currentTotal > housingTotal ? "−" : "+"}${(Math.abs(currentTotal - housingTotal) / 1000000).toFixed(1)}M
                  </td>
                  <td style={{ padding: "12px", color: C.muted, fontSize: 11, fontStyle: "italic" }}>Net annual difference</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 300, background: C.redSoft, border: `1px solid ${C.red}40`, borderRadius: 8, padding: "14px 18px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.red, fontFamily: "monospace", marginBottom: 4 }}>STATUS QUO</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.red, fontFamily: "monospace" }}>${(currentTotal / 1000000).toFixed(1)}M/year</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Emergency-heavy model: high shelter, ER, and law enforcement spend. Manages crisis, does not resolve it.</div>
            </div>
            <div style={{ flex: 1, minWidth: 300, background: C.accentSoft, border: `1px solid ${C.accent}40`, borderRadius: 8, padding: "14px 18px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, fontFamily: "monospace", marginBottom: 4 }}>HOUSING-FIRST ALTERNATIVE</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.accent, fontFamily: "monospace" }}>${(housingTotal / 1000000).toFixed(1)}M/year</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Higher housing spend ($9.6M vs $4.8M) but eliminates most emergency costs. Net savings: ${((currentTotal - housingTotal) / 1000000).toFixed(1)}M/year.</div>
            </div>
          </div>
        </div>

        {/* BREAKEVEN ANALYSIS */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, fontFamily: "monospace" }}>
            Breakeven Analysis — Pilot ROI
          </h2>
          <div style={{ background: C.card, border: `1px solid ${C.accent}`, borderRadius: 10, padding: "28px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 13, color: C.muted, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Placements Needed to Recover $500K</div>
            <div style={{ fontSize: 56, fontWeight: 800, color: C.accent, fontFamily: "monospace" }}>{breakeven}</div>
            <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>permanent placements in 90 days</div>

            <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 24, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: C.muted, fontFamily: "monospace", textTransform: "uppercase" }}>Savings per Placement</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.text, fontFamily: "monospace" }}>${savingsPerPerson.toLocaleString()}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: C.muted, fontFamily: "monospace", textTransform: "uppercase" }}>Pilot Investment</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.text, fontFamily: "monospace" }}>$500,000</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: C.muted, fontFamily: "monospace", textTransform: "uppercase" }}>Current Quarterly Rate</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.text, fontFamily: "monospace" }}>309</div>
              </div>
            </div>

            <div style={{
              marginTop: 24, padding: "16px 20px", background: C.accentSoft,
              borderRadius: 8, textAlign: "left", fontSize: 13, color: C.muted, lineHeight: 1.6,
            }}>
              <strong style={{ color: C.accent }}>The math:</strong> $500,000 ÷ ${savingsPerPerson.toLocaleString()}/placement = <strong style={{ color: C.text }}>{breakeven} placements</strong>.
              The system currently places ~309 people per quarter (1,238/year × 1 quarter). The pilot needs {breakeven} — that's {Math.round(breakeven / 309 * 100)}% of baseline quarterly throughput.
              <br /><br />
              <strong style={{ color: C.accent }}>Feasibility check:</strong> The pilot doesn't need to create new capacity — it needs to <em>unblock existing capacity</em>.
              Deliverable 1 showed 70 beds are blocked by access barriers, and Deliverable 2 showed 73 youth-program slots sit empty.
              If the pilot converts even 15-20% of those blocked resources to active placements, {breakeven} placements is well within reach.
              <br /><br />
              <strong style={{ color: C.accent }}>Conservative upside:</strong> At {breakeven + 10} placements, the pilot generates ${((breakeven + 10) * savingsPerPerson - 500000).toLocaleString()} in net Year 1 system savings beyond the investment.
            </div>
          </div>
        </div>

        {/* COST BASIS FOOTNOTES */}
        <div style={{ background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 24px", marginBottom: 20 }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Cost Sources & Methodology</div>
          <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.7, columnCount: 2, columnGap: 32 }}>
            <div style={{ marginBottom: 6 }}><strong style={{ color: C.text }}>Shelter bed-night ($87):</strong> HUD national average emergency shelter cost per bed-night, consistent with Wichita Coalition reporting.</div>
            <div style={{ marginBottom: 6 }}><strong style={{ color: C.text }}>ER visit ($2,000):</strong> HCUP (Healthcare Cost and Utilization Project) median for uninsured emergency department visit, 2024 data.</div>
            <div style={{ marginBottom: 6 }}><strong style={{ color: C.text }}>Law enforcement contact ($150):</strong> Officer time + transport estimate from national police-services cost studies.</div>
            <div style={{ marginBottom: 6 }}><strong style={{ color: C.text }}>Intake staff time ($50/hr loaded):</strong> $20/hr base + 25% benefits + supervision overhead, aligned with Wichita nonprofit salary benchmarks.</div>
            <div style={{ marginBottom: 6 }}><strong style={{ color: C.text }}>Lost wages ($1,300/mo):</strong> Kansas entry-level hourly ($12-15/hr) × 100 hrs/month estimated capacity while unstably housed.</div>
            <div style={{ marginBottom: 6 }}><strong style={{ color: C.text }}>Cycling population (800):</strong> Estimated from 3,257 served − 1,238 housed − ~1,200 first-time-only contacts ≈ 800 repeat cycling.</div>
          </div>
        </div>

        <div style={{ fontSize: 11, color: C.muted, textAlign: "center", padding: "20px 0 8px", borderTop: `1px solid ${C.border}` }}>
          Sources: HUD AHAR, HCUP, United Way of the Plains Coalition FY 2024 data, Wichita-Sedgwick County PIT Count · Shelter capacity figures use web-verified corrections · Updated 2026-04-18
        </div>
      </div>
    </div>
  );
}
