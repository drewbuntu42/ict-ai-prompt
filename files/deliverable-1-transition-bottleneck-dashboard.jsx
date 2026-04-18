import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis
} from "recharts";

const COLORS = {
  bg: "#0f1117",
  card: "#1a1d27",
  cardAlt: "#222636",
  border: "#2a2e3d",
  text: "#e2e4ea",
  textMuted: "#8b8fa3",
  accent: "#f97316",
  accentSoft: "rgba(249,115,22,0.12)",
  red: "#ef4444",
  redSoft: "rgba(239,68,68,0.12)",
  yellow: "#eab308",
  yellowSoft: "rgba(234,179,8,0.12)",
  green: "#22c55e",
  greenSoft: "rgba(34,197,94,0.12)",
  blue: "#3b82f6",
  blueSoft: "rgba(59,130,246,0.12)",
  purple: "#a855f7",
};

const pipelineStages = [
  { stage: "INTAKE", entering: 3257, passing: 2280, dropPct: 30, note: "3,257 served annually" },
  { stage: "SHELTER", entering: 2280, passing: 1238, dropPct: 46, note: "Only 17 of 87 beds reachable" },
  { stage: "DOCUMENTS", entering: 1238, passing: 868, dropPct: 30, note: "30-45 day assembly from zero" },
  { stage: "BENEFITS", entering: 868, passing: 694, dropPct: 20, note: "KanCare/SNAP enrollment lag" },
  { stage: "HOUSING", entering: 694, passing: 1238, dropPct: 0, note: "38% housed within a year" },
];

const bottlenecks = [
  { stage: "Shelter", bottleneck: "Only 17 of 87 beds reachable right now", rootCause: "Referral rules, sobriety conditions, and population-specific restrictions block 70 beds. Salvation Army serves families + single women only [CORRECTED].", population: "Single men with substance use; unsheltered adults", stuck: 130, workaround: "211 loops callers (Mon–Fri 7 AM–7 PM only); H.O.T. transports (2nd shift only)" },
  { stage: "Intake", bottleneck: "No adult routing after 7 PM or on weekends — 211 closes at 7 PM, H.O.T. is 2nd shift only with rotating days off", rootCause: "211 is Mon–Fri 7 AM–7 PM (not 24/7). H.O.T. covers afternoons/evenings but not overnight. CrossRoads is 24/7 but youth-only. Zero adult walk-in or phone routing after 7 PM or weekends.", population: "All unsheltered adults in crisis after 7 PM or weekends", stuck: 115, workaround: "None confirmed — gap is unserved" },
  { stage: "Documents", bottleneck: "State ID requires residency proof unsheltered people can't produce", rootCause: "Circular: need housing to prove residency, need ID to get housing", population: "All unsheltered (195 people)", stuck: 85, workaround: "Shelter-address letter from Open Door or partner" },
  { stage: "Benefits", bottleneck: "KanCare auto-disenrolls on address change", rootCause: "Re-verification notices go to old address; re-enrollment requires in-person DCF visit (2-4 hr wait)", population: "Anyone transitioning housing; aged-out foster youth", stuck: 80, workaround: "Benefits navigators at Open Door re-apply manually" },
  { stage: "Shelter", bottleneck: "HumanKind Villas waitlist runs 8-12 weeks", rootCause: "155 permanent supportive units at 80% utilization; demand exceeds turnover", population: "Chronically homeless; high-vulnerability individuals", stuck: 75, workaround: "Interim shelter cycling while waiting" },
  { stage: "Documents", bottleneck: "Birth certificate takes 14+ days; foster-care discrepancies invalidate requests", rootCause: "Out-of-state orders take 2-4 weeks; name/DOB mismatches in foster records", population: "Aged-out foster youth; anyone born out of state", stuck: 65, workaround: "DCF orders for current foster youth (not former)" },
  { stage: "Benefits", bottleneck: "SNAP expedited 7-day processing exists but staff rarely flag eligibility", rootCause: "Front-line intake staff not trained to identify homeless-qualifying applicants", population: "All newly homeless applicants", stuck: 60, workaround: "Standard 30-day processing used instead" },
  { stage: "Intake", bottleneck: "Open Door afternoon visitors already cycled through another partner that day", rootCause: "No shared intake status; each site re-assesses from scratch", population: "All walk-in clients", stuck: 55, workaround: "Clients self-navigate between sites" },
  { stage: "Shelter", bottleneck: "CrossRoads youth shelter at 83% — when full, fallback is adult shelters youth refuse", rootCause: "Only 12 youth beds in the system; BRIDGES has 8 transitional with 6-week wait", population: "Homeless youth ages 18-24", stuck: 40, workaround: "Adult shelters (high refusal rate)" },
  { stage: "Documents", bottleneck: "SSA office hours limited to weekdays 9 AM - 3 PM; 2-3 hour wait", rootCause: "Single downtown SSA office; no weekend/evening hours; requires birth cert first", population: "Anyone needing SS card replacement", stuck: 35, workaround: "Breakthrough Wichita accompaniment" },
  { stage: "Housing", bottleneck: "Private landlords require credit ≥600, income 3x rent, no criminal history", rootCause: "Mainstream rental stock (e.g., Maple Ridge, Central Park Towers) screens out anyone exiting homelessness", population: "All exiting homelessness without vouchers", stuck: 70, workaround: "NEXTenant landlord partnerships (limited supply)" },
  { stage: "Documents", bottleneck: "Bus pass costs $50/month — prohibitive at zero income", rootCause: "No universal transit subsidy; reduced-fare requires separate application + documentation", population: "Zero-income clients navigating multi-site system", stuck: 50, workaround: "Limited pass allotments from Center of Hope, Salvation Army" },
];

const waterfallData = [
  { stage: "Intake", best: 1, typical: 3, worst: 7 },
  { stage: "Shelter Wait", best: 1, typical: 14, worst: 56 },
  { stage: "Documents", best: 10, typical: 35, worst: 60 },
  { stage: "Benefits", best: 7, typical: 25, worst: 45 },
  { stage: "Housing Search", best: 7, typical: 30, worst: 90 },
  { stage: "TOTAL", best: 26, typical: 107, worst: 258 },
];

function SeverityBadge({ pct }) {
  const color = pct > 30 ? "red" : pct > 15 ? "yellow" : "green";
  const bg = color === "red" ? COLORS.redSoft : color === "yellow" ? COLORS.yellowSoft : COLORS.greenSoft;
  const fg = color === "red" ? COLORS.red : color === "yellow" ? COLORS.yellow : COLORS.green;
  return (
    <span style={{ background: bg, color: fg, padding: "2px 10px", borderRadius: 4, fontSize: 13, fontWeight: 700 }}>
      {pct}% drop
    </span>
  );
}

function MetricCard({ label, value, sub, accent = false }) {
  return (
    <div style={{
      background: accent ? COLORS.accentSoft : COLORS.card,
      border: `1px solid ${accent ? COLORS.accent : COLORS.border}`,
      borderRadius: 8, padding: "18px 22px", flex: 1, minWidth: 180,
    }}>
      <div style={{ color: COLORS.textMuted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 1.2 }}>{label}</div>
      <div style={{ color: accent ? COLORS.accent : COLORS.text, fontSize: 28, fontWeight: 800, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
      {sub && <div style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function PipelineNode({ data, isLast }) {
  const sevColor = data.dropPct > 30 ? COLORS.red : data.dropPct > 15 ? COLORS.yellow : COLORS.green;
  return (
    <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
      <div style={{
        background: COLORS.card, border: `2px solid ${sevColor}`, borderRadius: 10,
        padding: "14px 12px", textAlign: "center", flex: 1, position: "relative",
      }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 14, color: COLORS.text, letterSpacing: 1 }}>{data.stage}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: sevColor, marginTop: 4 }}>{data.entering.toLocaleString()}</div>
        <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{data.note}</div>
        {data.stage !== "HOUSING" && (
          <div style={{
            position: "absolute", bottom: -22, left: "50%", transform: "translateX(-50%)",
            background: data.dropPct > 30 ? COLORS.redSoft : data.dropPct > 15 ? COLORS.yellowSoft : COLORS.greenSoft,
            color: sevColor, fontSize: 11, fontWeight: 700, padding: "1px 8px", borderRadius: 4,
          }}>
            −{data.dropPct}%
          </div>
        )}
        {data.stage === "HOUSING" && (
          <div style={{
            position: "absolute", bottom: -22, left: "50%", transform: "translateX(-50%)",
            background: COLORS.greenSoft, color: COLORS.green,
            fontSize: 11, fontWeight: 700, padding: "1px 8px", borderRadius: 4,
          }}>
            38% housed/yr
          </div>
        )}
      </div>
      {!isLast && (
        <div style={{ width: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="32" height="20"><polygon points="0,2 24,10 0,18" fill={COLORS.textMuted} /></svg>
        </div>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, padding: "10px 14px", borderRadius: 6, fontSize: 13 }}>
      <div style={{ fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || COLORS.text }}>
          {p.name}: <strong>{p.value} days</strong>
        </div>
      ))}
    </div>
  );
};

export default function TransitionBottleneckDashboard() {
  const [expandedRow, setExpandedRow] = useState(null);

  return (
    <div style={{
      background: COLORS.bg, color: COLORS.text, minHeight: "100vh",
      fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif",
      padding: "0",
    }}>
      {/* --- HEADER --- */}
      <div style={{ background: "linear-gradient(135deg, #1a1d27 0%, #0f1117 100%)", borderBottom: `1px solid ${COLORS.border}`, padding: "32px 36px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ background: COLORS.accent, width: 6, height: 32, borderRadius: 3 }} />
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.accent, textTransform: "uppercase", letterSpacing: 2 }}>Deliverable 1 of 7</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Transition Bottleneck Dashboard</h1>
          </div>
        </div>
        <p style={{ color: COLORS.textMuted, fontSize: 14, margin: "8px 0 0 18px", maxWidth: 700 }}>
          Mapping where people get stuck moving through Wichita's homelessness system — from first contact to stable housing.
        </p>
      </div>

      <div style={{ padding: "28px 36px", maxWidth: 1200, margin: "0 auto" }}>

        {/* --- ANALYTICAL HOOK --- */}
        <div style={{
          background: "linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(239,68,68,0.06) 100%)",
          border: `1.5px solid ${COLORS.accent}`,
          borderRadius: 10, padding: "20px 26px", marginBottom: 28,
          borderLeft: `5px solid ${COLORS.accent}`,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.accent, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>
            ▸ Key Finding
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.5 }}>
            The single highest-impact bottleneck is <span style={{ color: COLORS.accent }}>bed reachability</span>: only 17 of 87 emergency beds (20%) are accessible to the unsheltered population right now.
          </div>
          <div style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 8, lineHeight: 1.6 }}>
            An estimated <strong style={{ color: COLORS.text }}>130 people per month</strong> are stuck at the intake-to-shelter transition because 70 beds are blocked by referral gates, sobriety requirements, or population restrictions.
            This beats the next-worst bottleneck (the after-hours routing void, ~115/month — worse than initially understood because 211 closes at 7 PM weekdays and is not available weekends) because shelter placement is the prerequisite for documents, benefits, and housing — nothing downstream moves until someone has a bed.
            Removing bed-access barriers unblocks the entire downstream pipeline; extending routing hours only increases the flow into an already-blocked stage.
          </div>
        </div>

        {/* --- METRIC CARDS --- */}
        <div style={{ display: "flex", gap: 14, marginBottom: 32, flexWrap: "wrap" }}>
          <MetricCard label="Total Experiencing Homelessness" value="736" sub="541 sheltered · 195 unsheltered" />
          <MetricCard label="Reachable Beds" value="17 / 87" sub="80% blocked by conditions" accent />
          <MetricCard label="Avg Days to Housing" value="45" sub="vs. 176 days nationally" />
          <MetricCard label="Housed Within 1 Year" value="38%" sub="62% remain in system" />
        </div>

        {/* --- PIPELINE DIAGRAM --- */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.5 }}>
            System Pipeline — Annual Flow
          </h2>
          <div style={{
            display: "flex", alignItems: "center", padding: "20px 12px 36px",
            background: COLORS.card, borderRadius: 10, border: `1px solid ${COLORS.border}`,
            overflowX: "auto",
          }}>
            {pipelineStages.map((s, i) => (
              <PipelineNode key={s.stage} data={s} isLast={i === pipelineStages.length - 1} />
            ))}
          </div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 8, fontStyle: "italic" }}>
            Volumes estimated from 3,257 people served annually. Drop-off rates derived from system data: 38% housed/year, 69% newly homeless, bed utilization, and document processing barriers.
          </div>
        </div>

        {/* --- BOTTLENECK TABLE --- */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.5 }}>
            Bottleneck Detail — Top 12 System Blockages
          </h2>
          <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${COLORS.border}` }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: COLORS.cardAlt }}>
                  {["Stage", "Specific Bottleneck", "Root Cause", "Population Most Affected", "Est. Stuck/Mo", "Current Workaround"].map(h => (
                    <th key={h} style={{
                      padding: "12px 14px", textAlign: "left", fontWeight: 700,
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                      textTransform: "uppercase", letterSpacing: 1, color: COLORS.textMuted,
                      borderBottom: `1px solid ${COLORS.border}`,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bottlenecks.map((b, i) => {
                  const stageColor =
                    b.stage === "Shelter" ? COLORS.red :
                    b.stage === "Intake" ? COLORS.yellow :
                    b.stage === "Documents" ? COLORS.blue :
                    b.stage === "Benefits" ? COLORS.purple :
                    COLORS.accent;
                  return (
                    <tr key={i} style={{
                      background: i % 2 === 0 ? COLORS.card : COLORS.bg,
                      borderBottom: `1px solid ${COLORS.border}`,
                      cursor: "pointer",
                    }}
                    onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                    >
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{
                          background: `${stageColor}22`, color: stageColor,
                          padding: "2px 10px", borderRadius: 4, fontSize: 12, fontWeight: 700,
                        }}>{b.stage}</span>
                      </td>
                      <td style={{ padding: "11px 14px", fontWeight: 600, color: COLORS.text, maxWidth: 260 }}>{b.bottleneck}</td>
                      <td style={{ padding: "11px 14px", color: COLORS.textMuted, maxWidth: 280, fontSize: 12 }}>{b.rootCause}</td>
                      <td style={{ padding: "11px 14px", color: COLORS.textMuted, fontSize: 12 }}>{b.population}</td>
                      <td style={{ padding: "11px 14px", fontWeight: 800, color: b.stuck >= 80 ? COLORS.red : b.stuck >= 50 ? COLORS.yellow : COLORS.text, fontFamily: "'JetBrains Mono', monospace" }}>{b.stuck}</td>
                      <td style={{ padding: "11px 14px", color: COLORS.textMuted, fontSize: 12 }}>{b.workaround}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- CIRCULAR DEPENDENCY DIAGRAM --- */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.5 }}>
            The Identity Trap — Circular Dependency
          </h2>
          <div style={{
            background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10,
            padding: "32px", display: "flex", justifyContent: "center",
          }}>
            <svg viewBox="0 0 600 280" style={{ width: "100%", maxWidth: 600 }}>
              {/* Circular arrow path */}
              <defs>
                <marker id="arrowRed" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.red} />
                </marker>
              </defs>

              {/* Boxes */}
              <rect x="30" y="50" width="150" height="60" rx="8" fill={COLORS.redSoft} stroke={COLORS.red} strokeWidth="2" />
              <text x="105" y="75" textAnchor="middle" fill={COLORS.red} fontWeight="800" fontSize="13" fontFamily="monospace">NEED STATE ID</text>
              <text x="105" y="95" textAnchor="middle" fill={COLORS.textMuted} fontSize="11">Requires residency proof</text>

              <rect x="225" y="0" width="150" height="60" rx="8" fill={COLORS.yellowSoft} stroke={COLORS.yellow} strokeWidth="2" />
              <text x="300" y="25" textAnchor="middle" fill={COLORS.yellow} fontWeight="800" fontSize="13" fontFamily="monospace">NEED RESIDENCY</text>
              <text x="300" y="45" textAnchor="middle" fill={COLORS.textMuted} fontSize="11">Requires stable address</text>

              <rect x="420" y="50" width="150" height="60" rx="8" fill={COLORS.blueSoft} stroke={COLORS.blue} strokeWidth="2" />
              <text x="495" y="75" textAnchor="middle" fill={COLORS.blue} fontWeight="800" fontSize="13" fontFamily="monospace">NEED HOUSING</text>
              <text x="495" y="95" textAnchor="middle" fill={COLORS.textMuted} fontSize="11">Requires ID + income</text>

              <rect x="225" y="130" width="150" height="60" rx="8" fill={COLORS.redSoft} stroke={COLORS.red} strokeWidth="2" />
              <text x="300" y="155" textAnchor="middle" fill={COLORS.red} fontWeight="800" fontSize="13" fontFamily="monospace">NEED INCOME</text>
              <text x="300" y="175" textAnchor="middle" fill={COLORS.textMuted} fontSize="11">Requires ID + bank acct</text>

              {/* Arrows */}
              <line x1="180" y1="62" x2="225" y2="40" stroke={COLORS.red} strokeWidth="2" markerEnd="url(#arrowRed)" />
              <line x1="375" y1="40" x2="420" y2="62" stroke={COLORS.red} strokeWidth="2" markerEnd="url(#arrowRed)" />
              <line x1="495" y1="110" x2="375" y2="145" stroke={COLORS.red} strokeWidth="2" markerEnd="url(#arrowRed)" />
              <line x1="225" y1="145" x2="105" y2="110" stroke={COLORS.red} strokeWidth="2" markerEnd="url(#arrowRed)" />

              {/* Break-the-cycle callout */}
              <rect x="150" y="215" width="300" height="50" rx="8" fill={COLORS.greenSoft} stroke={COLORS.green} strokeWidth="2" />
              <text x="300" y="237" textAnchor="middle" fill={COLORS.green} fontWeight="800" fontSize="12" fontFamily="monospace">WORKAROUND: SHELTER-ADDRESS LETTER</text>
              <text x="300" y="255" textAnchor="middle" fill={COLORS.textMuted} fontSize="11">Open Door / partner issues residency attestation</text>
              <line x1="300" y1="190" x2="300" y2="215" stroke={COLORS.green} strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowRed)" />
            </svg>
          </div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 10, fontStyle: "italic", textAlign: "center" }}>
            195 unsheltered people are trapped in this loop. The shelter-address letter breaks the cycle — but only if the person can reach an intake site during business hours and be matched to a bed.
          </div>
        </div>

        {/* --- TIME TO HOUSING WATERFALL --- */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.5 }}>
            Time-to-Housing Waterfall — Cumulative Days by Stage
          </h2>
          <div style={{ background: COLORS.card, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: "20px 16px 8px" }}>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={waterfallData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }} barCategoryGap="22%">
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis dataKey="stage" tick={{ fill: COLORS.textMuted, fontSize: 12, fontFamily: "monospace" }} axisLine={{ stroke: COLORS.border }} />
                <YAxis tick={{ fill: COLORS.textMuted, fontSize: 12 }} axisLine={{ stroke: COLORS.border }} label={{ value: "Days", angle: -90, position: "insideLeft", fill: COLORS.textMuted, fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: COLORS.textMuted }} />
                <Bar dataKey="best" name="Best Case" fill={COLORS.green} radius={[4, 4, 0, 0]} barSize={22} />
                <Bar dataKey="typical" name="Typical Case" fill={COLORS.yellow} radius={[4, 4, 0, 0]} barSize={22} />
                <Bar dataKey="worst" name="Worst Case" fill={COLORS.red} radius={[4, 4, 0, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
            <div style={{ background: COLORS.greenSoft, border: `1px solid ${COLORS.green}`, borderRadius: 6, padding: "8px 16px", fontSize: 13 }}>
              <span style={{ fontWeight: 700, color: COLORS.green }}>Best case: 26 days</span>
              <span style={{ color: COLORS.textMuted, marginLeft: 8 }}>— has documents, matched immediately, voucher-ready</span>
            </div>
            <div style={{ background: COLORS.yellowSoft, border: `1px solid ${COLORS.yellow}`, borderRadius: 6, padding: "8px 16px", fontSize: 13 }}>
              <span style={{ fontWeight: 700, color: COLORS.yellow }}>Typical: 107 days</span>
              <span style={{ color: COLORS.textMuted, marginLeft: 8 }}>— needs documents + benefits + housing search</span>
            </div>
            <div style={{ background: COLORS.redSoft, border: `1px solid ${COLORS.red}`, borderRadius: 6, padding: "8px 16px", fontSize: 13 }}>
              <span style={{ fontWeight: 700, color: COLORS.red }}>Worst case: 258 days</span>
              <span style={{ color: COLORS.textMuted, marginLeft: 8 }}>— zero documents, no voucher, private market</span>
            </div>
          </div>
        </div>

        {/* --- SYSTEM SNAPSHOT --- */}
        <div style={{
          background: COLORS.cardAlt, border: `1px solid ${COLORS.border}`, borderRadius: 10,
          padding: "20px 26px", marginBottom: 20,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>
            System Context
          </div>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", fontSize: 13, color: COLORS.textMuted }}>
            <div><strong style={{ color: COLORS.text }}>170</strong> coalition member organizations</div>
            <div><strong style={{ color: COLORS.text }}>8</strong> intake sites (211 closes 7 PM; no adult routing overnight or weekends)</div>
            <div><strong style={{ color: COLORS.text }}>80%</strong> 2-year permanent housing retention</div>
            <div><strong style={{ color: COLORS.text }}>69%</strong> of people served are newly homeless</div>
            <div><strong style={{ color: COLORS.text }}>14</strong> per 10K local rate vs. <strong style={{ color: COLORS.text }}>23</strong> national</div>
            <div>Second Light bed-matching: <strong style={{ color: COLORS.yellow }}>not yet live</strong></div>
          </div>
        </div>

        <div style={{ fontSize: 11, color: COLORS.textMuted, textAlign: "center", padding: "20px 0 8px", borderTop: `1px solid ${COLORS.border}` }}>
          Source: United Way of the Plains Coalition / 2025 Wichita-Sedgwick County Point-in-Time Count (FY Oct 2023 – Sept 2024 service data) · Web-verified 2026-04-18 · Hours, addresses, and eligibility corrected per official org websites
        </div>
      </div>
    </div>
  );
}
