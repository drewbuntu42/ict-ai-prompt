## Task

I want to research and map Wichita's homelessness and foster youth service landscape — 
answering why homelessness is an issue, how it's currently addressed, and where services 
fall short — so that a competition team can build their solution on accurate, verified 
knowledge of the existing system with no fictional or generic placeholders.

First, read these files completely before responding:
- [API endpoint data from Architect team — PENDING, to be added when available. Note 
  wherever this data would enhance or verify a finding.]

---

## Context Files

Challenge context (internalize before researching):

- **Scope:** Wichita, KS. Primary solution = 90-day pilot. Secondary = year 2+ possibilities 
  (open research, not constrained to pilot budget).
- **Budget:** $500K total pilot, $100K reserved for marketing/adoption.
- **Populations:** Homeless adults + foster youth aging out of care.
- **Known stats:** 736 homeless individuals, 87 unused shelter beds, foster youth 
  homelessness rising from 17% → 42% by age 18.
- **Known system state:** Coordinated entry exists. Housing First programs exist. Shelters 
  exist. Despite this, system is "fragmented, referral-heavy, and hard to navigate."
- **Critical anomaly to investigate:** 87 unused shelter beds while 736 people are 
  homeless. Do not assume this away — explain it.

---

## Reference

Structure output as a policy/landscape brief:
- Abstract (human-readable, ~200 words — for human teammates)
- Executive Summary (~400 words — team decision brief)
- Section 1: Root Causes
- Section 2: Current Service Landscape (named orgs + confidence ratings)
- Section 3: Integration and Geographic Map
- Section 4: Gap Analysis
- Section 5: Data Gaps and Uncertainties
- Section 6: Year 2+ Opportunities
- Appendix: Service Inventory Table

---

## Success Brief

- **Output:** Structured markdown document (~2,500–4,000 words + tables)
- **Format:** Markdown — clear headers, tables for service inventory, inline confidence 
  flags on all named organizations and statistics
- **Audience + effect:** Architect, Oracle, and Muse track leads — they read this and 
  immediately know what real services to integrate, where gaps exist, and what narrative 
  the Muse must address. A future AI agent will also use this as context for solution design.
- **Tone:** Technical team briefing — precise, dense, factual. No filler. Causal 
  explanations required, not just inventory.
- **Artifacts:** `wichita-landscape-research.md`
- **Success looks like:** Every named service has a confidence rating, every gap has a 
  causal explanation, all data uncertainties are flagged explicitly, and the 87 unused 
  beds anomaly is explained.

---

## Rules

1. **Challenge assumptions.** Cross-check official service descriptions against utilization 
   data, local reporting, and known outcomes. The unused beds paradox is an example — find 
   the real explanation (barrier type, eligibility restrictions, location, population mismatch).
2. **Explain causation, not just inventory.** For each gap or failure, explain *why* it 
   exists — systemic, economic, policy-driven, or behavioral. The team needs the "why" to 
   design the solution.
3. **Flag all uncertainty explicitly.** Use inline confidence markers on every named 
   organization and statistic: `[VERIFIED]`, `[LIKELY]`, or `[UNCERTAIN — verify before use]`. 
   The output feeds a future AI agent; confident-sounding fabrications are worse than 
   acknowledged gaps.

Clarification: Competition window is active. Prioritize speed + accuracy over exhaustiveness. 
If a section would require excessive research time, produce a solid framework with flagged 
gaps rather than delaying the whole output.

---

## Plan

1. **Root causes research** — Search for Wichita homelessness statistics, demographics, 
   economic drivers (housing costs, wage gaps, eviction rates), and systemic factors 
   (mental health, substance use, foster care pipeline). Cite HUD CoC reports, city data, 
   and local journalism.

2. **Service inventory** — Catalog named Wichita organizations: shelters, coordinated 
   entry operators, Housing First programs, foster youth support services, transitional 
   housing, outreach teams. For each: name, service type, capacity (if known), populations 
   served, confidence rating.

3. **Integration and geography map** — Trace the referral chain a newly homeless foster 
   youth would navigate. Identify where connections break (handoff gaps, eligibility 
   cliffs, geographic deserts). Note which organizations share data vs. operate in silos.

4. **Gap analysis** — Quantify and explain: capacity vs. demand, the 87 unused beds 
   anomaly, populations not reached by current services, failure modes of coordinated 
   entry. Distinguish addressable gaps (fixable in 90 days) from structural gaps 
   (year 2+ work).

5. **Structured output assembly** — Produce the full document: abstract + exec summary + 
   6 sections + appendix table. Mark all data gaps. Close with a year 2+ section covering 
   what a mature version of this system could include beyond the pilot scope.

---

## Conversation

- User is on a competition team; competition window is actively running — speed matters.
- Role is research lead, feeding findings to Architect, Oracle, and Muse track teammates.
- API endpoint data from Architect is pending — prompt notes where it would plug in.
- Output must serve both human teammates (abstract/summary) and a future AI agent 
  (dense, structured reference sections).
- Org naming: name real organizations but flag confidence level on each.
- Scope: Wichita-primary for pilot; open research for year 2+ possibilities.
- The 87 unused beds / 736 homeless anomaly was surfaced as a critical investigation 
  point — do not paper over it.

---

## Alignment

- Do NOT generalize to "cities like Wichita" or use national statistics as Wichita proxies 
  without flagging them as such.
- Do NOT invent organization names or fabricate capacity numbers — flag as `[UNCERTAIN]` 
  instead.
- Year 2+ section is exploratory and clearly labeled as such — not part of the pilot scope.
- The 90-day pilot constraint ($400K available after marketing) should inform which gaps 
  are flagged as "addressable now" vs. "future state."
- If API data arrives mid-session, it supersedes any estimate made without it.
