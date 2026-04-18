import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList
} from "recharts";

const C = {
  bg: "#0b0e14",
  card: "#141820",
  cardAlt: "#1b2030",
  border: "#252b3a",
  text: "#e4e6ed",
  muted: "#7c8298",
  orange: "#f59e0b",
  orangeSoft: "rgba(245,158,11,0.10)",
  red: "#ef4444",
  redSoft: "rgba(239,68,68,0.10)",
  yellow: "#facc15",
  yellowSoft: "rgba(250,204,21,0.10)",
  green: "#34d399",
  greenSoft: "rgba(52,211,153,0.10)",
  blue: "#60a5fa",
  blueSoft: "rgba(96,165,250,0.12)",
  purple: "#a78bfa",
  purpleSoft: "rgba(167,139,250,0.10)",
  healthOrange: "#fb923c",
  healthOrangeSoft: "rgba(251,146,60,0.10)",
  belongYellow: "#fbbf24",
  belongYellowSoft: "rgba(251,191,36,0.12)",
  cliff: "#ef4444",
};

const programs = [
  { name: "EmberHope", type: "case-management", ageStart: 12, ageEnd: 21, slots: 40, active: 28, dropout: 0.28, color: C.green },
  { name: "DCF Indep. Living", type: "case-management", ageStart: 16, ageEnd: 21, slots: 50, active: 34, dropout: 0.38, color: C.green },
  { name: "TRAIL", type: "case-management", ageStart: 16, ageEnd: 21, slots: 25, active: 15, dropout: 0.30, color: C.green },
  { name: "ETV (Education)", type: "education", ageStart: 16, ageEnd: 26, slots: 40, active: 18, dropout: 0.25, color: C.purple },
  { name: "BRIDGES Housing", type: "housing", ageStart: 16, ageEnd: 22, slots: 8, active: 7, dropout: 0.22, color: C.blue },
  { name: "CrossRoads Shelter", type: "housing", ageStart: 18, ageEnd: 24, slots: 12, active: 10, dropout: 0.35, color: C.blue },
  { name: "KanCare Extension", type: "healthcare", ageStart: 18, ageEnd: 26, slots: 999, active: 142, dropout: 0.42, color: C.healthOrange },
  { name: "SOUL Family", type: "belonging", ageStart: 16, ageEnd: 26, slots: 35, active: 22, dropout: 0.12, color: C.belongYellow },
];

const handoffFailures = [
  { transition: "DCF custody ends → youth self-navigates adult systems", sending: "DCF", receiving: "None (self-directed)", trigger: "Age cap: 18", affected: 583, outcome: "29% homeless by age 19. Youth lose case manager, must independently locate housing, benefits, and documents." },
  { transition: "DCF IL + TRAIL hard-stop → no case management", sending: "DCF IL / TRAIL", receiving: "None", trigger: "Age cap: 21", affected: 245, outcome: "42% homeless by age 21. Benefits, coaching, and stipend vanish regardless of housing or income stability." },
  { transition: "BRIDGES age-out → no transitional housing", sending: "BRIDGES", receiving: "None (adult shelter or street)", trigger: "Age cap: 22", affected: 8, outcome: "Youth exit to adult shelters, private rental (if voucher-ready), or unsheltered. Only 8 units — each loss is acute." },
  { transition: "CrossRoads full → fallback is adult shelters", sending: "CrossRoads", receiving: "Adult shelters", trigger: "Capacity (12 beds)", affected: 40, outcome: "Youth refuse adult shelters (sobriety rules, population mix). Many choose unsheltered over Union Rescue Mission." },
  { transition: "KanCare recert notice → old address → coverage lost", sending: "KanCare", receiving: "Uninsured", trigger: "Address change", affected: 245, outcome: "42% dropout. Re-enrollment requires in-person DCF visit (2-4 hr wait). Most disenrolled youth give up." },
  { transition: "ETV enrollment verification fails → funding lost", sending: "ETV", receiving: "None", trigger: "Semester verification", affected: 72, outcome: "Housing instability → missed classes → can't verify enrollment → loses $5K/yr funding → can't afford to re-enroll." },
  { transition: "EmberHope ages out → TRAIL or DCF IL", sending: "EmberHope", receiving: "TRAIL / DCF IL", trigger: "Age cap: 21", affected: 28, outcome: "Functional handoff exists but receiving programs also cap at 21 — the bridge leads to another cliff." },
];

const dropoutData = [
  { name: "SOUL Family", rate: 12, fill: C.green },
  { name: "BRIDGES", rate: 22, fill: C.green },
  { name: "ETV", rate: 25, fill: C.yellow },
  { name: "EmberHope", rate: 28, fill: C.yellow },
  { name: "TRAIL", rate: 30, fill: C.orange },
  { name: "CrossRoads", rate: 35, fill: C.orange },
  { name: "DCF IL", rate: 38, fill: C.red },
  { name: "KanCare", rate: 42, fill: C.red },
];

function MetricCard({ label, value, sub, accent }) {
  const border = accent ? C.orange : C.border;
  const bg = accent ? C.orangeSoft : C.card;
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "18px 22px", flex: 1, minWidth: 200 }}>
      <div style={{ color: C.muted, fontSize: 11, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 1.2 }}>{label}</div>
      <div style={{ color: accent ? C.orange : C.text, fontSize: 30, fontWeight: 800, marginTop: 4, fontFamily: "monospace" }}>{value}</div>
      {sub && <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

const DropoutTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "10px 14px", borderRadius: 6, fontSize: 13 }}>
      <div style={{ fontWeight: 700, color: C.text }}>{payload[0].payload.name}</div>
      <div style={{ color: C.orange }}>{payload[0].value}% dropout rate</div>
    </div>
  );
};

export default function YouthHandoffDashboard() {
  const ageRange = Array.from({ length: 15 }, (_, i) => i + 12);
  const barH = 30;
  const rowH = 42;
  const leftW = 160;
  const chartW = 600;
  const ageW = chartW / 14;

  const typeLabels = {
    "case-management": { label: "Case Mgmt", color: C.green },
    "education": { label: "Education", color: C.purple },
    "housing": { label: "Housing", color: C.blue },
    "healthcare": { label: "Healthcare", color: C.healthOrange },
    "belonging": { label: "Belonging", color: C.belongYellow },
  };

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", padding: 0 }}>

      {/* HEADER */}
      <div style={{ background: `linear-gradient(135deg, ${C.cardAlt} 0%, ${C.bg} 100%)`, borderBottom: `1px solid ${C.border}`, padding: "32px 36px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ background: C.orange, width: 6, height: 32, borderRadius: 3 }} />
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: C.orange, textTransform: "uppercase", letterSpacing: 2 }}>Deliverable 2 of 7</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Youth Handoff Failure Analysis</h1>
          </div>
        </div>
        <p style={{ color: C.muted, fontSize: 14, margin: "8px 0 0 18px", maxWidth: 720 }}>
          Tracing how foster youth aging out of care fall through gaps between DCF, CrossRoads, BRIDGES, and adult systems — and where the pilot can intervene.
        </p>
      </div>

      <div style={{ padding: "28px 36px", maxWidth: 1200, margin: "0 auto" }}>

        {/* ANALYTICAL HOOK */}
        <div style={{
          background: `linear-gradient(135deg, ${C.orangeSoft} 0%, ${C.redSoft} 100%)`,
          border: `1.5px solid ${C.orange}`, borderLeft: `5px solid ${C.orange}`,
          borderRadius: 10, padding: "20px 26px", marginBottom: 28,
        }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: C.orange, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>▸ Key Finding</div>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.5 }}>
            Bridge the <span style={{ color: C.orange }}>age-21 DCF IL cliff</span>. It affects the most youth and costs the least to extend.
          </div>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 8, lineHeight: 1.6 }}>
            <strong style={{ color: C.text }}>~245 youth/year</strong> lose DCF Independent Living benefits at 21 regardless of stability — and 42% are homeless at that age. Extending case management 12 months past 21 would cost an estimated <strong style={{ color: C.text }}>$350-500/person/month</strong> (based on DCF IL's existing per-capita spending across 34 active enrollees).
            This beats bridging the BRIDGES age-22 cliff (only 8 youth affected) and the CrossRoads capacity gap (40 youth, but the fix requires new beds, not just extended services). The age-21 cliff is the highest-volume, lowest-cost intervention point.
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 8, fontStyle: "italic" }}>
            Cross-reference: Deliverable 1 showed document assembly takes 30-45 days from zero. Youth hitting the age-21 cliff mid-documentation lose progress and restart the ID → residency → housing cycle.
          </div>
        </div>

        {/* METRIC CARDS */}
        <div style={{ display: "flex", gap: 14, marginBottom: 32, flexWrap: "wrap" }}>
          <MetricCard label="Youth Aging Out Annually (KS)" value="583" sub="Each must self-navigate at 18" />
          <MetricCard label="Homeless by Age 21" value="42%" sub="Up from 17% at age 17" accent />
          <MetricCard label="Programs Hard-Capped at 21" value="3" sub="DCF IL · TRAIL · EmberHope" />
        </div>

        {/* SWIM LANE TIMELINE */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, fontFamily: "monospace", letterSpacing: 0.5 }}>
            Program Coverage by Age — Swim Lane Timeline
          </h2>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "24px 20px", overflowX: "auto" }}>
            <div style={{ display: "flex", minWidth: leftW + chartW + 20 }}>
              {/* Left labels */}
              <div style={{ width: leftW, flexShrink: 0 }}>
                <div style={{ height: 28 }} />
                {programs.map((p, i) => (
                  <div key={i} style={{ height: rowH, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      background: `${typeLabels[p.type].color}20`, color: typeLabels[p.type].color,
                      fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, fontFamily: "monospace",
                      textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap",
                    }}>{typeLabels[p.type].label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.text, whiteSpace: "nowrap" }}>{p.name}</span>
                  </div>
                ))}
              </div>

              {/* Chart area */}
              <div style={{ flex: 1, position: "relative", minWidth: chartW }}>
                {/* Age axis */}
                <div style={{ display: "flex", height: 28 }}>
                  {ageRange.map(age => (
                    <div key={age} style={{
                      width: ageW, textAlign: "center", fontSize: 11, fontFamily: "monospace",
                      color: age === 18 || age === 21 ? C.cliff : C.muted,
                      fontWeight: age === 18 || age === 21 ? 800 : 400,
                    }}>{age}</div>
                  ))}
                </div>

                {/* Cliff lines */}
                {[18, 21].map(age => (
                  <div key={age} style={{
                    position: "absolute", top: 28, bottom: 0,
                    left: (age - 12) * ageW + ageW / 2,
                    width: 2, background: C.cliff, opacity: 0.6, zIndex: 2,
                  }}>
                    <div style={{
                      position: "absolute", top: -2, left: -28, width: 58,
                      textAlign: "center", fontSize: 9, fontWeight: 800, color: C.cliff,
                      fontFamily: "monospace", background: C.card, padding: "0 4px", borderRadius: 3,
                    }}>AGE {age}</div>
                  </div>
                ))}

                {/* Gap zone highlighting (21-26 area) */}
                <div style={{
                  position: "absolute", top: 28, bottom: 0,
                  left: (21 - 12) * ageW + ageW / 2,
                  width: (26 - 21) * ageW,
                  background: `${C.red}08`, borderLeft: `1px dashed ${C.red}30`,
                  zIndex: 0,
                }} />

                {/* Program bars */}
                {programs.map((p, i) => {
                  const startX = (p.ageStart - 12) * ageW;
                  const barWidth = (p.ageEnd - p.ageStart) * ageW;
                  return (
                    <div key={i} style={{ height: rowH, display: "flex", alignItems: "center", position: "relative", zIndex: 1 }}>
                      <div style={{
                        position: "absolute", left: startX, width: barWidth, height: barH,
                        background: `${p.color}30`, border: `1.5px solid ${p.color}80`,
                        borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "0 8px",
                      }}>
                        <span style={{ fontSize: 10, color: p.color, fontWeight: 700, fontFamily: "monospace" }}>
                          {p.active}/{p.slots}
                        </span>
                        <span style={{ fontSize: 10, color: p.dropout > 0.35 ? C.red : p.dropout > 0.25 ? C.orange : C.muted, fontWeight: 600 }}>
                          {Math.round(p.dropout * 100)}%↓
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap", paddingLeft: leftW }}>
              {Object.entries(typeLabels).map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.muted }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: `${v.color}40`, border: `1.5px solid ${v.color}` }} />
                  {v.label}
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.red }}>
                <div style={{ width: 12, height: 2, background: C.red }} /> Age cliff
              </div>
              <div style={{ fontSize: 11, color: C.muted, marginLeft: 8 }}>
                Bar labels: active enrollment / slots available · dropout rate
              </div>
            </div>
          </div>
        </div>

        {/* HANDOFF FAILURE TABLE */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, fontFamily: "monospace", letterSpacing: 0.5 }}>
            Handoff Failure Map — 7 Critical Breakpoints
          </h2>
          <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${C.border}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: C.cardAlt }}>
                  {["Handoff Transition", "Sending", "Receiving", "Trigger", "Youth/Yr", "What Happens Next"].map(h => (
                    <th key={h} style={{
                      padding: "12px 12px", textAlign: "left", fontWeight: 700,
                      fontFamily: "monospace", fontSize: 10, textTransform: "uppercase",
                      letterSpacing: 1, color: C.muted, borderBottom: `1px solid ${C.border}`,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {handoffFailures.map((h, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? C.card : C.bg, borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "11px 12px", fontWeight: 600, color: C.text, maxWidth: 240 }}>{h.transition}</td>
                    <td style={{ padding: "11px 12px", color: C.muted, fontSize: 12 }}>{h.sending}</td>
                    <td style={{ padding: "11px 12px", color: h.receiving === "None" || h.receiving === "Uninsured" ? C.red : C.muted, fontWeight: h.receiving === "None" || h.receiving === "Uninsured" ? 700 : 400, fontSize: 12 }}>{h.receiving}</td>
                    <td style={{ padding: "11px 12px", fontSize: 12 }}>
                      <span style={{
                        background: h.trigger.startsWith("Age") ? C.redSoft : h.trigger.startsWith("Capacity") ? C.orangeSoft : C.yellowSoft,
                        color: h.trigger.startsWith("Age") ? C.red : h.trigger.startsWith("Capacity") ? C.orange : C.yellow,
                        padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700,
                      }}>{h.trigger}</span>
                    </td>
                    <td style={{ padding: "11px 12px", fontWeight: 800, fontFamily: "monospace", color: h.affected >= 200 ? C.red : h.affected >= 40 ? C.orange : C.text }}>{h.affected}</td>
                    <td style={{ padding: "11px 12px", color: C.muted, fontSize: 12, maxWidth: 300 }}>{h.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DROPOUT RATE BAR CHART */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, fontFamily: "monospace", letterSpacing: 0.5 }}>
            Program Dropout Rates — Ranked
          </h2>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px 16px 8px" }}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={dropoutData} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
                <XAxis type="number" domain={[0, 50]} tick={{ fill: C.muted, fontSize: 12 }} axisLine={{ stroke: C.border }} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fill: C.text, fontSize: 12, fontFamily: "monospace" }} axisLine={{ stroke: C.border }} />
                <Tooltip content={<DropoutTooltip />} />
                <Bar dataKey="rate" radius={[0, 5, 5, 0]} barSize={24}>
                  {dropoutData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  <LabelList dataKey="rate" position="right" formatter={v => `${v}%`} style={{ fill: C.muted, fontSize: 12, fontFamily: "monospace" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div style={{ display: "flex", gap: 16, marginTop: 8, padding: "0 10px 12px", flexWrap: "wrap" }}>
              <div style={{ background: C.greenSoft, border: `1px solid ${C.green}`, borderRadius: 6, padding: "8px 14px", fontSize: 12, flex: 1, minWidth: 280 }}>
                <strong style={{ color: C.green }}>Lowest: SOUL Family (12%)</strong>
                <span style={{ color: C.muted, marginLeft: 8 }}>— Legal permanency (custodianship) via DCF/KVC/Children's Alliance. Legal relationships are durable — not age-capped, not funding-capped.</span>
              </div>
              <div style={{ background: C.redSoft, border: `1px solid ${C.red}`, borderRadius: 6, padding: "8px 14px", fontSize: 12, flex: 1, minWidth: 280 }}>
                <strong style={{ color: C.red }}>Highest: KanCare (42%)</strong>
                <span style={{ color: C.muted, marginLeft: 8 }}>— Administrative: address changes auto-disenroll, recert notices go to old address, re-enrollment requires in-person DCF visit.</span>
              </div>
            </div>
          </div>
        </div>

        {/* CASCADE OF LOSS FLOWCHART */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, fontFamily: "monospace", letterSpacing: 0.5 }}>
            Cascade of Loss — How One Disruption Compounds
          </h2>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "28px 16px", display: "flex", justifyContent: "center" }}>
            <svg viewBox="0 0 700 420" style={{ width: "100%", maxWidth: 700 }}>
              <defs>
                <marker id="aR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill={C.red} /></marker>
                <marker id="aG" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill={C.green} /></marker>
              </defs>

              {/* Main cycle nodes */}
              {[
                { x: 350, y: 40, label: "LOSES HOUSING", sub: "Age cliff / capacity / eviction", color: C.red },
                { x: 590, y: 130, label: "ADDRESS CHANGES", sub: "Mail lost, no stable contact", color: C.orange },
                { x: 590, y: 250, label: "KANCARE DISENROLLS", sub: "42% dropout rate", color: C.red },
                { x: 350, y: 340, label: "LOSES MENTAL HEALTH", sub: "No Medicaid = no treatment", color: C.healthOrange },
                { x: 110, y: 250, label: "EMPLOYMENT DESTABILIZES", sub: "Can't sustain work untreated", color: C.yellow },
                { x: 110, y: 130, label: "CYCLES BACK TO INTAKE", sub: "Restarts from zero", color: C.red },
              ].map((n, i) => (
                <g key={i}>
                  <rect x={n.x - 100} y={n.y - 22} width={200} height={50} rx={8}
                    fill={`${n.color}15`} stroke={n.color} strokeWidth={1.5} />
                  <text x={n.x} y={n.y} textAnchor="middle" fill={n.color}
                    fontSize={11} fontWeight={800} fontFamily="monospace">{n.label}</text>
                  <text x={n.x} y={n.y + 16} textAnchor="middle" fill={C.muted} fontSize={9}>{n.sub}</text>
                </g>
              ))}

              {/* Arrows connecting the cycle */}
              <line x1="450" y1="52" x2="490" y2="115" stroke={C.red} strokeWidth={2} markerEnd="url(#aR)" />
              <line x1="590" y1="180" x2="590" y2="225" stroke={C.red} strokeWidth={2} markerEnd="url(#aR)" />
              <line x1="490" y1="265" x2="450" y2="328" stroke={C.red} strokeWidth={2} markerEnd="url(#aR)" />
              <line x1="250" y1="328" x2="210" y2="268" stroke={C.red} strokeWidth={2} markerEnd="url(#aR)" />
              <line x1="110" y1="225" x2="110" y2="180" stroke={C.red} strokeWidth={2} markerEnd="url(#aR)" />
              <line x1="210" y1="118" x2="250" y2="55" stroke={C.red} strokeWidth={2} markerEnd="url(#aR)" />

              {/* Intervention exit ramps */}
              {[
                { x: 540, y: 85, label: "→ Address forwarding", anchor: "start" },
                { x: 642, y: 200, label: "→ Auto-recert waiver", anchor: "start" },
                { x: 452, y: 300, label: "→ Bridge coverage fund", anchor: "start" },
                { x: 28, y: 200, label: "Document navigator ←", anchor: "start" },
                { x: 45, y: 95, label: "SOUL Family custodian ←", anchor: "start" },
              ].map((r, i) => (
                <g key={i}>
                  <text x={r.x} y={r.y} textAnchor={r.anchor} fill={C.green} fontSize={10} fontWeight={700} fontFamily="monospace">{r.label}</text>
                  <text x={r.x} y={r.y + 13} textAnchor={r.anchor} fill={C.muted} fontSize={8}>INTERVENTION POINT</text>
                </g>
              ))}

              <text x={350} y={405} textAnchor="middle" fill={C.muted} fontSize={10} fontStyle="italic">
                Each full cycle costs the system ~$15,000+ per person (Deliverable 4) and takes 45+ days
              </text>
            </svg>
          </div>
        </div>

        {/* UTILIZATION GAP SUMMARY */}
        <div style={{
          background: C.cardAlt, border: `1px solid ${C.border}`, borderRadius: 10,
          padding: "20px 26px", marginBottom: 20,
        }}>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>
            Capacity Underutilization — Slots Open But Unfilled
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", fontSize: 13, color: C.muted }}>
            <div>DCF IL: <strong style={{ color: C.orange }}>16 open</strong> of 50 slots (paperwork/awareness barrier)</div>
            <div>ETV: <strong style={{ color: C.orange }}>22 open</strong> of 40 slots (not widely advertised)</div>
            <div>SOUL Family: <strong style={{ color: C.orange }}>13 open</strong> of 35 slots (custodian recruitment bottleneck)</div>
            <div>TRAIL: <strong style={{ color: C.orange }}>10 open</strong> of 25 slots</div>
            <div>EmberHope: <strong style={{ color: C.orange }}>12 open</strong> of 40 slots</div>
            <div style={{ width: "100%", fontSize: 12, fontStyle: "italic", marginTop: 4 }}>
              Total: <strong style={{ color: C.text }}>73 youth-program slots sit empty</strong> while 245 youth/year hit the age-21 cliff with no support.
            </div>
          </div>
        </div>

        <div style={{ fontSize: 11, color: C.muted, textAlign: "center", padding: "20px 0 8px", borderTop: `1px solid ${C.border}` }}>
          Source: United Way of the Plains Coalition / Kansas DCF / Wichita Children's Home / SOUL Family (DCF/KVC/Children's Alliance) · FY 2024 data · Web-verified 2026-04-18
          <br />Note: Foster youth homelessness rates (17%/29%/42%) are [API-ONLY] — consistent with national research but not present in the 2025 PIT count. SOUL Family corrected to legal permanency model per DCF website. ETV extends to age 26 per DCF.
        </div>
      </div>
    </div>
  );
}
