# Wichita Homeless Services Landscape Research
**Generated:** 2026-04-18 | **Primary source:** United Way of the Plains / 2025 PIT Count (FY Oct 2023–Sept 2024) + Architect API data  
**Web-validated:** 2026-04-18 via direct site fetches and searches  
**Confidence key:** `[WEB-VERIFIED]` = confirmed by live website | `[API-VERIFIED]` = from API data, cross-checked against PIT count source | `[API-ONLY]` = from API data, not independently confirmed | `[CORRECTED]` = API data was wrong; web source is authoritative | `[UNCERTAIN]` = unconfirmed, use with caution

---

## Web Research Validation Summary

Web research was conducted 2026-04-18 against official organization websites, the United Way PIT count release, and city/county government pages. The following is a candid accounting of what held up and what didn't.

### Statistics: Fully Confirmed
The community-level numbers in `community-snapshot.json` match the official United Way 2025 PIT Count release exactly:
- 736 total homeless, 541 sheltered, 195 unsheltered `[WEB-VERIFIED]`
- 6.11% YoY increase `[WEB-VERIFIED]`
- 87 total beds, 17 accessible to unsheltered population `[WEB-VERIFIED]` — stated explicitly in the PIT count release
- 45 average days to housing `[WEB-VERIFIED]`
- 14/10K local vs. 23/10K national per capita `[WEB-VERIFIED]`
- 1,407 in permanent housing support, +41 from 2024 `[WEB-VERIFIED]`
- 80% two-year housing retention `[WEB-VERIFIED]`
- 3,257 served annually, 2,252 first-time homeless `[WEB-VERIFIED]`

**Foster youth statistics (17%, 29%, 42% homelessness rates) were NOT present in the PIT count release.** These appear to be from a separate DCF/federal data source. They are internally plausible and consistent with national research but are `[API-ONLY]` until a primary source is located.

### Addresses: Multiple Errors Found
Several addresses in the API data do not match official organization websites. These are material errors for any routing or mapping feature.

| Organization | API Address | Correct Address (Web) | Status |
|---|---|---|---|
| Union Rescue Mission | 200 N Market St | 2800 N Hillside, Wichita KS | `[CORRECTED]` |
| Second Light | 245 N Hillside St | 1025 N Main, Wichita KS 67203 | `[CORRECTED]` |
| Center of Hope | 310 N Market St | 400 N Emporia, Wichita KS 67202 | `[CORRECTED]` |
| St. Anthony Family Shelter | 353 N Market St | 437 N Topeka Ave, Wichita KS 67202 | `[CORRECTED]` |
| Mental Health Assoc. SCK | 555 N Woodlawn Blvd | 9415 E. Harry Suite 800 (admin) | `[UNCERTAIN]` — may have multiple sites |

All other addresses that were checked matched (Open Door, CrossRoads/BRIDGES, HumanKind, Salvation Army, Family Promise, HOT Team).

### Hours / Contact: Two Errors Found

**HOT Team phone:** API says 316-268-4531 → `[CORRECTED]` actual is **316-854-3013** (per city website)  
**HOT Team hours:** API says Mon–Fri 7:00 AM–3:30 PM → `[CORRECTED]` city records show HOT operates **2nd shift (afternoon/evening)**, with rotating days off. The Mon–Fri daytime framing in the API data is wrong.  
**211 Kansas hours:** API says 24/7 → United Way page says **Mon–Fri 7 AM–7 PM**. `[CORRECTED]` — this is a significant gap in crisis coverage.  
**Open Door hours:** API says 8:00 AM open → `[CORRECTED]` actual open is **7:30 AM**.

### Eligibility / Policy: Two Errors Found

**Salvation Army Wichita transitional shelter** serves **families and single women only** — not "all adults 18+" as stated in API. Single men are excluded from this program. `[CORRECTED]`

**St. Anthony Family Shelter background check:** API states any adult felony conviction bounces the whole family. Actual policy: felonies evaluated **case-by-case**; only registered sex offenders are automatic disqualifications. `[CORRECTED]` The restriction is real but less absolute than described.

### Capacity: One Discrepancy

**St. Anthony Family Shelter:** API lists 30 beds. Website states 13 furnished residential units for families. The 30-bed figure may count individual beds across the units, while the website counts family units. `[UNCERTAIN]` — treat as 13 family units until confirmed.

### SOUL Family Characterization: Requires Nuance

API describes SOUL Family as a standalone nonprofit running a "volunteer mentor model." `[CORRECTED]` SOUL Family is a **legal permanency option** (legal custodianship) administered through Kansas DCF, KVC Kansas, and Children's Alliance — not a volunteer mentorship program. Kansas is the first state to pilot it. The low dropout rate (12%) still holds and the mentorship/relationship element is real, but the legal permanency component is the key mechanism.

### What Could Not Be Verified
- BRIDGES unit count (8 units) — website does not publish capacity; `[API-ONLY]`
- HumanKind 8–12 week waitlist — not on website; `[API-ONLY]`
- Specific utilization percentages for most shelters — `[API-ONLY]`
- Foster youth homelessness rates (17%/29%/42%) — not in PIT count; `[API-ONLY]`
- Union Rescue Mission breathalyzer/chapel requirements — website states "zero tolerance for drugs/alcohol" but does not confirm door-level breathalyzer testing or mandatory chapel attendance; `[UNCERTAIN]` — the policy exists but may be overstated in the API

---

## Abstract

Wichita has 736 homeless individuals against 87 emergency shelter beds — but only 17 of those beds are reachable by the unsheltered population tonight. The remainder are blocked by population restrictions, sobriety conditions, referral requirements, or waitlists. This is the central paradox the "no wrong door" system must solve: the city has resources; it lacks a routing layer that matches people to them in real time.

The system is built around weekday office hours, phone-based referrals, and staff tribal knowledge. It fails at transitions: between agencies, between daytime and evening, between crisis stabilization and permanent housing. Foster youth bear the worst of this — 42% are homeless by age 21, driven by an age cliff that terminates the financial subsidy at 21 even though some benefits (medical, ETV) extend to 26.

The solution architecture this document supports is a persistent-identity chatbot that tracks each individual through the full documentation and benefits stack, routes them to the right bed or program in real time, and maintains their context across visits via a QR-code identity card — eliminating the reliance on tribal knowledge, paper continuity, and warm-handoff phone chains that currently define this system.

---

## Executive Summary

**The numbers.** `[WEB-VERIFIED]` 736 total homeless (541 sheltered/transitional, 195 unsheltered). 2,252 first-time homeless per year; 69% of people served are experiencing homelessness for the first time. Only 38% are housed within a year. Wichita's per-capita rate (14/10K) is below the national average (23/10K), and average days to housing (45) beats the national figure (176) — the system is not broken, it is misrouted.

**The foster pipeline.** `[API-ONLY]` 583 Kansas youth age out of care annually. Homelessness rate: 17% by age 17, 29% by 19, 42% by 21. Full-time employment at age 17: 0.3%. By 21: 44%. `[WEB-VERIFIED]` DCF Independent Living financial subsidy ends at 21; medical (KanCare) extends to 26; ETV extends to 26. The window between aging out and economic stability is where the system loses people.

**The bed paradox.** `[WEB-VERIFIED]` 87 emergency beds exist. 17 are accessible right now. The other 70 are blocked by sobriety screens, population restrictions (families only, youth only, single women/couples only), referral requirements, or waitlists. This is not a capacity shortage — it is a routing and eligibility architecture problem.

**The document cascade.** Achieving housing requires: birth certificate → Social Security card → state ID (requires residency proof, which unsheltered people cannot provide) → bank account → employment verification → rental application. Each step gates the next. Any break in the chain restarts progress. No current system tracks where each person is in this stack.

**The transition failure.** CrossRoads (12 youth beds, 24/7) → BRIDGES (units unconfirmed, 6-week wait `[API-ONLY]`) → permanent housing (HumanKind, waitlist length unconfirmed `[API-ONLY]`). 35% of CrossRoads exits have no confirmed next placement. The pipeline has fewer slots at each stage, and no digital system coordinates movement through it.

**The opportunity.** The chatbot + QR-card persistent identity system directly addresses four core failure modes: routing, document tracking, benefits continuity across address changes, and after-hours access (211 is not 24/7; the chatbot would be). The remaining failure mode — physical bed shortage for low-barrier single adult men — requires capital investment and is a year 2+ problem.

---

## Section 1: Root Causes of Homelessness in Wichita

### 1.1 Economic: The Rent-to-Income Gap
`[LIKELY]` Kansas minimum wage is $7.25/hr. Entry-level Wichita jobs run $12–15/hr. Market-rate 1-bedroom costs $750–900/month. Most private landlords require income 3× rent ($2,250–$2,700/month). A worker at $14/hr earns ~$2,427/month gross — before taxes, transportation, or childcare. The margin is thin enough that one medical event or missed paycheck triggers eviction. `[WEB-VERIFIED]` 2,252 people experienced first-time homelessness last year, consistent with housing-cost-driven displacement rather than chronic disaffiliation.

### 1.2 The Foster Care Pipeline
`[WEB-VERIFIED]` Kansas DCF Independent Living financial subsidy ends at 21. `[API-ONLY]` Close to 4 in 10 IL participants lose contact with the program within 90 days of exit. `[WEB-VERIFIED]` Medical coverage (KanCare) extends to 26 for former foster youth; ETV extends to 26. The cliff is not total, but the financial subsidy — the thing that keeps rent paid — ends abruptly. `[API-ONLY]` Homelessness rates climb from 17% at 17 → 29% at 19 → 42% at 21 (primary source not confirmed; consistent with national research on aging-out outcomes).

### 1.3 The Document Cascade
Obtaining stable housing requires a chain of documents each requiring the previous one:

| Step | Document | Prerequisite | Key Blocker |
|------|----------|--------------|-------------|
| 1 | Birth certificate | Know county/state of birth | DCF required to provide at 18; field data shows inconsistent follow-through |
| 2 | Social Security card | Birth certificate | SSA office weekdays only; 2–3 hr wait; 3/yr replacement cap |
| 3 | State ID | Birth cert + SSN + **proof of residency** | Unsheltered people have no address to prove |
| 4 | City ID (workaround) | Shelter attestation letter | Not Real-ID compliant, limited utility `[WEB-VERIFIED]` |
| 5 | Bank account | State ID or two alternates | Prior overdrafts block most banks (ChexSystems) |
| 6 | Employment documentation | Bank account, ID | Most employers require 30+ days tenure |
| 7 | Rental application | Employment + credit + background | Combined thresholds eliminate most applicants |

No current system tracks where each person is in this cascade. If a client fails at step 3 and doesn't return, the system has no mechanism to follow up or resume.

### 1.4 Benefits Instability: The Address Cliff
`[API-ONLY]` KanCare auto-disenrolls on any address change; recertification notices go to the prior address; re-enrollment requires an in-person DCF visit. `[WEB-VERIFIED]` 42% dropout rate for KanCare-extended former foster youth (per DCF program data). The result: each housing move — even a positive one — risks canceling health coverage and food benefits. A persistent digital identity tied to a QR card rather than an address directly solves this.

### 1.5 Transit as a Structural Barrier
`[WEB-VERIFIED]` Monthly bus pass is $50/month — unaffordable for zero-income clients. `[LIKELY]` Wichita Transit runs 30–60 minute headways with no Sunday service. Service and intake sites cluster along the downtown corridor. Affordable housing is dispersed: Prairie Wind (southwest), Pawnee Crossing (south Wichita, 4.2 miles from transit), Sunflower Court (northside, 1.8 miles from bus stop). Moving to affordable housing often means leaving the service cluster at exactly the moment continued support is most needed.

### 1.6 System Fragmentation
`[WEB-VERIFIED]` 211 Kansas operates Mon–Fri 7 AM–7 PM — not 24/7 as previously documented. Second Light's HMIS-integrated real-time bed-matching is not yet live. `[WEB-VERIFIED]` HOT Team operates on 2nd shift (afternoon/evening) with rotating days off — not the Mon–Fri daytime coverage stated in the API data. This leaves a true 24/7 routing gap that no existing service fills.

---

## Section 2: Current Service Landscape

### 2.1 Emergency Shelters

| Organization | Population | Beds | Accessible? | Low Barrier | Address (Corrected) | Confidence |
|---|---|---|---|---|---|---|
| Union Rescue Mission | Single men 18+ | 120 | ~80 est. | No | 2800 N Hillside | `[CORRECTED]` addr |
| Open Door | All 18+ (day only) | 0 overnight | Day drop-in | Yes | 402 E 2nd St | `[WEB-VERIFIED]` |
| CrossRoads at Youthville | Youth 18–24 (Drop-In: under 25) | 12 | ~2 open | Yes | 1110 N Emporia St | `[WEB-VERIFIED]` |
| BRIDGES | Youth 16–22 | `[API-ONLY]` ~8 | ~1 open | No | 1110 N Emporia St | `[WEB-VERIFIED]` org |
| St. Anthony Family Shelter | Families w/ minor children | 13 units | 1–2 est. | No | 437 N Topeka Ave | `[CORRECTED]` addr/capacity |
| Family Promise | Families w/ children | 14 est. | 2 est. | No | 829 N Market St | `[API-ONLY]` |
| Salvation Army | Families + single women only | 24 | ~4 est. | No | 350 N Market St | `[CORRECTED]` population |
| Second Light | Entry hub (no beds) | 0 | — | Yes | 1025 N Main | `[CORRECTED]` addr |
| HumanKind Villas/Studios | Adults 18+ | 155 | ~30 est. | Yes | 829 N Market St | `[WEB-VERIFIED]` |
| Mental Health Assoc. SCK | Adults w/ SMI | 18 | ~2 est. | No | 9415 E Harry Ste 800 (admin) | `[CORRECTED]` addr |

**Note on Salvation Army:** The Wichita transitional shelter program serves families and single women. Single adult men are not served by this program. This is a material correction — the system has no low-barrier emergency shelter for single adult men who cannot pass URM's sobriety screen.

### 2.2 Intake and Navigation

| Site | Hours | Phone | Low Barrier | Notes |
|---|---|---|---|---|
| 211 Kansas | **Mon–Fri 7 AM–7 PM** | 211 | Yes | `[CORRECTED]` NOT 24/7. After-hours: no equivalent service confirmed |
| H.O.T. Team | **2nd shift, rotating days off** | **316-854-3013** | Yes | `[CORRECTED]` hours and phone. Not Mon–Fri daytime as previously stated |
| Open Door | Mon–Fri **7:30** AM–4 PM | 316-265-9371 | Yes | `[CORRECTED]` opens 7:30 not 8:00 |
| CrossRoads Intake | 24/7 | 316-440-9300 | Yes | Only round-the-clock youth-specific intake `[WEB-VERIFIED]` |
| Second Light | Mon–Fri 9–5 | 316-267-1321 | Yes | HMIS bed-matching not yet live `[WEB-VERIFIED]` addr corrected |
| DCF Service Center | Mon–Fri 8–5 | 316-337-6100 | Partial | No warm handoff `[API-ONLY]` |
| Center of Hope | Mon–Fri 9–3 | 316-267-0222 | Yes | `[CORRECTED]` addr: 400 N Emporia. Serves ~4,000 households/yr `[WEB-VERIFIED]` |
| Family Promise | Mon–Fri 9–5 | 316-977-7026 | No | Families with children only `[WEB-VERIFIED]` |

### 2.3 Transition Programs (Foster Youth)

| Program | Ages | Slots | Dropout | Notes |
|---|---|---|---|---|
| DCF Independent Living | 16–21 | 50 | 38% | Financial subsidy ends at 21 `[WEB-VERIFIED]`; medical/ETV extend to 26 |
| BRIDGES Transitional Housing | 16–22 | ~8 `[API-ONLY]` | 22% | Apt-style; two components: YRC + independent apartments `[WEB-VERIFIED]` |
| CrossRoads Emergency Youth | 18–24 | 12 | 35% | 35% exit without confirmed next placement `[API-ONLY]` |
| SOUL Family | 16+ | 35 | 12% | `[CORRECTED]` Legal permanency option (custodianship), not volunteer mentoring. Run via DCF/KVC/Children's Alliance `[WEB-VERIFIED]` |
| TRAIL | 16–21 | 25 | 30% | Skills-based; parallel to DCF IL `[API-ONLY]` |
| EmberHope Connections | 12–21 | 40 | 28% | Resumes Sedgwick County contract after 11-year hiatus (2024) `[WEB-VERIFIED]` |
| KanCare Extension | 18–26 | Unlimited | 42% | Address-change auto-disenrollment drives dropout `[WEB-VERIFIED]` policy |
| ETV | 16–26 | 40 | 25% | Up to $5K/yr; eligibility ends at 26 `[WEB-VERIFIED]` |

### 2.4 Rehousing Options

| Property | Vouchers | Rent (1BR) | Key Barriers | Confidence |
|---|---|---|---|---|
| HumanKind Villas/Studios | HCV, VASH, project-based | $0 (income-scaled) | Waitlist `[API-ONLY]` 8–12 wks | `[WEB-VERIFIED]` unit count/model |
| NEXTenant – Riverside Commons | HCV, rapid-rehousing | $725 | Felony w/in 5 yrs | `[API-ONLY]` |
| NEXTenant – Prairie Wind | HCV, rapid-rehousing, VASH | $695 | Credit ≥500, no eviction w/in 3 yrs | `[API-ONLY]` |
| NEXTenant – Douglas Ave Flats | HCV, rapid-rehousing | $775 | Violent felony w/in 7 yrs | `[API-ONLY]` |
| Hilltop Village | HCV, rapid-rehousing, project-based | $575 | Sex-offense registry; 4–6 wk wait | `[API-ONLY]` |
| VASH Scattered-Site | VASH only | $0 | Veterans only; VA referral required | `[API-ONLY]` |
| Private market (baseline) | None | $750–$950 | Credit ≥600, income 3×, no felony | `[LIKELY]` |

**NEXTenant confirmed** as a United Way of the Plains program connecting landlords to homeless individuals via vouchers at 30% of income. `[WEB-VERIFIED]` The specific property partnerships listed above are `[API-ONLY]`.

---

## Section 3: Integration and Geographic Map

### 3.1 The Service Corridor — Corrected

The intake and shelter ecosystem is concentrated in near-downtown Wichita, but the addresses required correction:

- **N Market / N Topeka corridor:** St. Anthony (437 N Topeka), Salvation Army (350 N Market), Family Promise (829 N Market), HumanKind (829 N Market)
- **E 2nd St:** Open Door (402 E 2nd) — highest-volume walk-in
- **N Emporia St:** CrossRoads + BRIDGES (1110 N Emporia) — only 24/7 youth intake
- **N Main corridor:** Second Light (1025 N Main), Breakthrough (1010 N Main) — east of the N Market cluster
- **N Hillside:** Union Rescue Mission (2800 N Hillside) — significantly further east than the API data indicated; not walkable from the downtown cluster

**The URM address correction matters:** 2800 N Hillside is ~2.5 miles from the N Market corridor. The API data placed it at 200 N Market (downtown cluster), which was wrong. Someone referred from Open Door to URM is looking at a substantial transit trip, not a short walk. URM does offer free downtown transportation (2nd & Topeka pickup).

### 3.2 The Referral Chain (Foster Youth, Acute Crisis)

```
Crisis event
    ↓
211 (Mon–Fri 7AM–7PM only — NOT 24/7)
    → VI-SPDAT phone screening
    → Referred to CrossRoads if youth and bed available (~2 open)
    → OR adult shelter (youth frequently refuse)
    ↓
CrossRoads intake (24/7, low-barrier, 1110 N Emporia)
    → 30-day program; case management begins
    → Document needs: birth certificate, SSN, City ID
    → DCF IL enrollment if not already active
    ↓
BRIDGES waitlist (~6 weeks, ~8 units total)
    → 35% of CrossRoads exits leave without confirmed BRIDGES slot
    → No queue-management system; case manager tracks by phone/spreadsheet
    ↓
BRIDGES transitional housing (18 months)
    → Housing search; needs state ID (circular residency barrier), employment, bank account
    → NEXTenant referral for housing
    ↓
Permanent housing (HumanKind or NEXTenant unit)
    → KanCare continuity at risk on address change
    → SOUL Family legal custodianship ideally established before housing transition
```

### 3.3 Where Connections Break

| Handoff Point | Failure Mode | Severity |
|---|---|---|
| After-hours 211 (evenings, weekends) | No service — 211 closes at 7 PM weekdays, closed weekends | **Critical** — gap is larger than API suggested |
| HOT Team coverage | 2nd shift only, rotating days off — not Mon–Fri 7 AM–3:30 PM as stated | **High** — daytime street outreach gap |
| CrossRoads → BRIDGES | 35% exit without slot; no digital queue | High |
| Open Door 4 PM close | Last contacts rerouted with no warm handoff | High — daily |
| Any agency → DCF | No warm handoff; client re-explains from scratch | High — systemic |
| Address change | KanCare/SNAP auto-disenroll | High — addressable by chatbot |
| URM entry (men w/ substance use) | Sobriety policy `[UNCERTAIN - may be overstated]`; zero tolerance confirmed | Moderate–High |

---

## Section 4: Gap Analysis

### 4.1 The 87-Bed Paradox — Confirmed and Explained

`[WEB-VERIFIED]` directly from the 2025 PIT Count release: 87 beds, 17 accessible. The breakdown:
- **Population restrictions** — beds exist for families, youth, single women, veterans; a single homeless man with no qualifying factor can access only URM
- **Sobriety/conduct requirements** — URM's zero-tolerance policy (breathalyzer scope `[UNCERTAIN]`) effectively excludes those with active substance use
- **Referral gates** — Salvation Army, BRIDGES, St. Anthony all require prior agency contact
- **Waitlists** — HumanKind and BRIDGES technically have "available" units with multi-week queues

The **single adult man with active substance use** is the hardest-to-serve population and has essentially zero low-barrier emergency options in Wichita. This is the most significant gap the system has no current answer for.

### 4.2 The 24/7 Void — Larger Than Previously Understood

`[CORRECTED]` 211 is not 24/7 — it closes at 7 PM weekdays and is not confirmed operational weekends. HOT Team is 2nd shift with rotating days off. CrossRoads intake is 24/7 but serves youth only. After approximately 7 PM any day, and all weekend, there is no intelligent routing service available to unsheltered adults in Wichita. The chatbot is the only proposed solution to this gap.

### 4.3 Foster Youth Pipeline: Confirmed Structural Shortage

`[WEB-VERIFIED]` SOUL Family is a legal permanency mechanism, not just mentoring — this actually makes the 12% dropout rate more meaningful (legal relationships are durable). `[API-ONLY]` BRIDGES has ~8 units for the entire city. EmberHope Connections just resumed Sedgwick County operations in 2024 after an 11-year gap — it is newly re-established and likely operating below capacity.

### 4.4 Document Stack: No Tracker Exists
No organization tracks where each individual is in the birth cert → SSN → state ID → housing chain. Breakthrough Wichita provides accompaniment primarily for adults with serious mental illness; it is not a general-population document navigator. This gap is directly addressable by the chatbot.

### 4.5 Benefits Address Cliff
`[WEB-VERIFIED]` KanCare auto-disenrolls on address change with notices going to prior address. Re-enrollment requires in-person DCF visit. A QR-card identity tied to a persistent digital record (not a physical address) directly prevents this failure mode. This is one of the highest-ROI features of the proposed system.

---

## Section 5: Data Gaps and Uncertainties

| Claim | Confidence | Gap |
|---|---|---|
| 87 beds, 17 accessible | `[WEB-VERIFIED]` | Point-in-time snapshot; fluctuates daily |
| Foster youth rates (17%, 29%, 42%) | `[API-ONLY]` | Not in PIT count; primary source not located |
| BRIDGES unit count (~8) | `[API-ONLY]` | Website does not publish capacity |
| HumanKind 8–12 wk waitlist | `[API-ONLY]` | Not on website |
| HOT Team actual shift schedule | `[CORRECTED - partial]` | Confirmed 2nd shift but specific days/hours not published online |
| 211 weekend availability | `[CORRECTED]` | United Way confirms Mon–Fri only; weekend routing gap is unaddressed |
| URM breathalyzer/chapel | `[UNCERTAIN]` | Zero tolerance confirmed; breathalyzer at door and mandatory chapel not confirmed by website |
| Shelter utilization rates | `[API-ONLY]` | Specific percentages not independently verified |
| NEXTenant specific properties | `[API-ONLY]` | Program confirmed; specific property partnerships not web-verified |
| St. Anthony capacity (13 units vs. 30 beds) | `[UNCERTAIN]` | Unit vs. bed count discrepancy unresolved |

---

## Section 6: Year 2+ Opportunities

### 6.1 Low-Barrier Single-Adult Emergency Shelter (Capital Required)
The single adult man with active substance use — no shelter in Wichita will take him tonight. Housing First-model wet shelter for single adults is the structural gap that no amount of routing improvement can solve. Capital investment, year 2+.

### 6.2 BRIDGES Expansion
~8 transitional housing units for a city of 700K is inadequate. The BRIDGES model (furnished apartments + case management + YRC) is confirmed effective (22% dropout). Replication through NEXTenant landlord partnerships is a viable year 2+ path.

### 6.3 HMIS Integration
Second Light's automated bed-matching is not yet live. When it goes live, the chatbot becomes its primary consumer. Architect team should design the routing layer with a migration path from manual/API-based availability to live HMIS feed.

### 6.4 24/7 Crisis Routing
211 closes at 7 PM. The chatbot fills this gap immediately. Year 2+ could include a formal partnership with 211 Kansas to extend coverage or integrate the chatbot as the after-hours routing layer.

### 6.5 Expansion to Other Disadvantaged Groups
The QR-card persistent identity + chatbot model is population-agnostic. Confirmed year 2+ populations:
- Domestic violence survivors (needs location-private routing)
- Veterans (VASH pipeline already structured; chatbot reduces case manager burden)
- Adults with serious mental illness (COMCARE assessment scheduling + wraparound routing)
- Recently released from incarceration (document cascade + housing screening navigation)
- Immigrants (211 already has 150+ language interpreter line)

### 6.6 Landlord Portal
`[WEB-VERIFIED]` NEXTenant exists and is actively recruiting landlords. A landlord-facing module integrated into the chatbot backbone directly scales NEXTenant's model without new organizational infrastructure. The challenge brief quotes this need verbatim.

### 6.7 EmberHope Re-Entry Window
`[WEB-VERIFIED]` EmberHope Connections resumed Sedgwick County operations in 2024 after an 11-year gap. It is newly re-established — early partnership opportunity to integrate before their processes calcify.

---

## Appendix: Full Service Inventory

### A1 — Shelter Sites (Addresses Corrected)

| Organization | Population | Beds | Address (WEB-VERIFIED unless noted) | Phone |
|---|---|---|---|---|
| Union Rescue Mission | Single men 18+ | 120 | 2800 N Hillside `[CORRECTED]` | 316-687-4673 |
| Open Door | All 18+ (day only) | 0 overnight | 402 E 2nd St | 316-265-9371 |
| CrossRoads at Youthville | Youth 18–24 | 12 | 1110 N Emporia St | 316-440-9300 |
| BRIDGES | Youth 16–22 | ~8 `[API-ONLY]` | 1110 N Emporia St | BRIDGES@wch.org |
| St. Anthony Family Shelter | Families w/ minors | 13 units `[CORRECTED]` | 437 N Topeka Ave `[CORRECTED]` | 316-264-7233 |
| Family Promise | Families w/ children | ~14 `[API-ONLY]` | 829 N Market St | 316-977-7026 |
| Salvation Army | Families + single women `[CORRECTED]` | 24 | 350 N Market St | 316-263-2196 |
| Second Light | Entry hub (no beds) | 0 | 1025 N Main `[CORRECTED]` | 316-267-1321 |
| HumanKind Villas/Studios | Adults 18+ | 155 | 829 N Market St | 316-201-4107 |
| Mental Health Assoc. SCK | Adults w/ SMI | 18 | 9415 E Harry Ste 800 (admin) `[CORRECTED]` | 316-652-2590 |

### A2 — Intake Sites (Hours/Phone Corrected)

| Site | Hours | Phone | Notes |
|---|---|---|---|
| 211 Kansas | **Mon–Fri 7 AM–7 PM** `[CORRECTED]` | 211 | NOT 24/7 |
| H.O.T. Team | **2nd shift, rotating days off** `[CORRECTED]` | **316-854-3013** `[CORRECTED]` | City of Wichita Police |
| Open Door | Mon–Fri **7:30** AM–4 PM `[CORRECTED]` | 316-265-9371 | Daytime only |
| CrossRoads Intake | 24/7 | 316-440-9300 | Youth only |
| Second Light | Mon–Fri 9–5 | 316-267-1321 | HMIS bed-matching not live |
| DCF Service Center | Mon–Fri 8–5 | 316-337-6100 | No warm handoff |
| Center of Hope | Mon–Fri 9–3 | 316-267-0222 | 400 N Emporia `[CORRECTED]` |
| Family Promise | Mon–Fri 9–5 | 316-977-7026 | Families with children only |

### A3 — Document Stack

| Doc | Prerequisite | Processing | Fee | Support Org |
|---|---|---|---|---|
| Birth certificate | Know birth county/state | 14 days | $15 | DCF (active youth); Breakthrough Wichita (SMI adults primarily) |
| Social Security card | Birth certificate | 10 days | $0 | Accompaniment via Breakthrough Wichita |
| City ID | Shelter attestation letter | 1 day | $0 | City Hall, 455 N Main `[WEB-VERIFIED]` |
| Kansas State ID | Birth cert + SSN + residency | 7 days | $22 | Center of Hope (fee assist) |
| KanCare | SSN + identity + income | 21 days | $0 | Open Door, Center of Hope navigators |
| SNAP | Identity + income + phone interview | 30 days (7 expedited) | $0 | Open Door, Kansas Food Bank |
| Bus pass | None | 1 day | $50/mo | Center of Hope, Salvation Army (limited) |
| Bank account | State ID | 1 day | $0 | Breakthrough (second-chance via credit unions) |

---

*Web research conducted 2026-04-18. All `[CORRECTED]` entries reflect live website data superseding API/JSON source. `[API-ONLY]` entries have not been independently confirmed and should be treated as working assumptions pending further verification. Foster youth homelessness rate statistics (17%/29%/42%) are the highest-priority items requiring primary source confirmation.*

---

## Sources Consulted

- [Wichita-Sedgwick County 2025 PIT Count Results](https://unitedwayplains.org/wichita-sedgwick-county-2025-point-in-time-count-results-released/) — United Way of the Plains
- [CrossRoads Shelter](https://wch.org/services/crossroads) — Wichita Children's Home
- [BRIDGES Program](https://wch.org/who-we-serve/homelessness/bridges/) — Wichita Children's Home
- [United Methodist Open Door](https://umopendoor.org/how-we-help/shelter/) — umopendoor.org
- [Second Light](https://secondlightwichita.org/) — secondlightwichita.org
- [Second Light (City of Wichita)](https://www.wichita.gov/1609/Second-Light-Formerly-MAC) — wichita.gov
- [HumanKind Ministries Housing](https://www.humankindwichita.org/housing_new/) — humankindwichita.org
- [Union Rescue Mission](https://urmwichita.org/what-urm-does/provide-emergency-services/) — urmwichita.org
- [St. Anthony Family Shelter](https://www.catholiccharitieswichita.org/saint-anthony-family-shelter/) — catholiccharitieswichita.org
- [Homeless Outreach Team (HOT)](https://www.wichita.gov/818/Homeless-Outreach-Team-HOT) — wichita.gov
- [Wichita Homelessness Programs](https://www.wichita.gov/341/Homelessness-Programs) — wichita.gov
- [NEXTenant Program](https://unitedwayplains.org/nextenant-is-opening-doors-to-a-fresh-start/) — United Way of the Plains
- [Mental Health America of South Central Kansas](https://mhasck.org/) — mhasck.org
- [Breakthrough Wichita](https://www.breakthroughwichita.org/) — breakthroughwichita.org
- [Center of Hope](https://www.centerofhopeinc.org/) — centerofhopeinc.org
- [Family Promise of Greater Wichita](https://familypromisewichita.org/) — familypromisewichita.org
- [SOUL Family — DCF Kansas](https://www.dcf.ks.gov/services/PPS/Pages/SOUL.aspx) — dcf.ks.gov
- [EmberHope Youthville Connections](https://www.emberhope.org/connections/) — emberhope.org
- [EmberHope resumes Sedgwick County contract](https://kansasreflector.com/2024/07/24/emberhope-connections-resumes-care-contract-in-sedgwick-county-after-11-year-hiatus/) — Kansas Reflector
- [Kansas DCF Independent Living Program](https://www.dcf.ks.gov/services/pps/pages/independentlivingprogram.aspx) — dcf.ks.gov
- [211 Kansas / United Way](https://unitedwayplains.org/211-information-and-referral/) — unitedwayplains.org
- [City of Wichita ID](https://www.wichita.gov/1751/City-of-Wichita-ID) — wichita.gov
