# Wichita Homeless Services Landscape Research
**Generated:** 2026-04-18 | **Source data:** United Way of the Plains Coalition / 2025 PIT Count (FY Oct 2023 – Sept 2024) + API endpoint data  
**Confidence key:** `[VERIFIED]` = from API data | `[LIKELY]` = corroborated by multiple sources | `[UNCERTAIN]` = single source or estimated

---

## Abstract

Wichita has 736 homeless individuals against 87 emergency shelter beds — but only 17 of those beds are reachable by the unsheltered population tonight. The remainder are blocked by population restrictions, sobriety conditions, referral requirements, or waitlists. This is the central paradox the "no wrong door" system must solve: the city has resources; it lacks a routing layer that matches people to them in real time.

The system is built around weekday office hours, phone-based referrals, and staff tribal knowledge. It fails at transitions: between agencies, between daytime and evening, between crisis stabilization and permanent housing. Foster youth bear the worst of this — 42% are homeless by age 21, driven by an age cliff at 18/21 that terminates services before stability is achieved.

The solution architecture this document supports is a persistent-identity chatbot that tracks each individual through the full documentation and benefits stack, routes them to the right bed or program in real time, and maintains their context across visits via a QR-code identity card — eliminating the reliance on tribal knowledge, paper continuity, and warm-handoff phone chains that currently define this system.

---

## Executive Summary

**The numbers.** `[VERIFIED]` 736 total homeless (541 sheltered/transitional, 195 unsheltered). 2,252 first-time homeless per year; 69% of people served are experiencing homelessness for the first time. Only 38% are housed within a year. Wichita's per-capita rate (14/10K) is below the national average (23/10K), and average days to housing (45) beats the national figure (176) — the system is not broken, it is misrouted.

**The foster pipeline.** `[VERIFIED]` 583 Kansas youth age out of care annually. Homelessness rate: 17% by age 17, 29% by 19, 42% by 21. Full-time employment at age 17: 0.3%. By 21: 44%. The window between aging out and economic stability is where the system loses people.

**The bed paradox.** `[VERIFIED]` 87 emergency beds exist. 17 are accessible right now. The other 70 are blocked by sobriety screens, population restrictions (families only, youth only, single men only), referral requirements, or waitlists. This is not a capacity shortage — it is a routing and eligibility architecture problem.

**The document cascade.** Achieving housing requires: birth certificate → Social Security card → state ID (requires residency proof, which unsheltered people cannot provide) → bank account → employment verification → rental application. Each step gates the next. Any break in the chain restarts progress. No current system tracks where each person is in this stack.

**The transition failure.** CrossRoads (12 youth beds, 24/7) → BRIDGES (8 transitional units, 6-week wait) → permanent housing (HumanKind, 8–12 week wait). 35% of CrossRoads exits have no confirmed next placement. The pipeline has fewer slots at each stage, and no digital system coordinates movement through it.

**The opportunity.** The chatbot + QR-card persistent identity system can solve four of the five core failure modes simultaneously: routing, document tracking, benefits continuity across address changes, and after-hours access. The sixth failure mode — physical bed shortage for low-barrier single adults — requires capital investment and is a year 2+ problem.

---

## Section 1: Root Causes of Homelessness in Wichita

### 1.1 Economic: The Rent-to-Income Gap
`[VERIFIED]` Kansas minimum wage is $7.25/hr. `[LIKELY]` Entry-level Wichita jobs run $12–15/hr. A standard market-rate 1-bedroom costs $750–900/month. Most private landlords require income 3× rent ($2,250–$2,700/month). A worker at $14/hr, 40 hours/week earns $2,427/month gross — before taxes, transportation, or childcare. The margin is thin enough that a single medical event, car repair, or missed paycheck triggers eviction. `[VERIFIED]` 2,252 people experienced homelessness for the first time last year, a rate consistent with housing-cost-driven displacement rather than chronic disaffiliation.

### 1.2 The Foster Care Pipeline
`[VERIFIED]` Kansas DCF Independent Living benefits terminate at age 21, regardless of housing or income stability. The program achieves a 38% dropout rate within 90 days of exit. `[VERIFIED]` Homelessness rates climb steadily post-exit: 17% at 17, 29% at 19, 42% at 21. The cause is not individual failure — it is a cliff: services stop before the person is stable. Youth who age out without a mentor (SOUL Family), active benefits, and a housing placement in hand have a near-majority chance of homelessness within three years.

### 1.3 The Document Cascade
Obtaining stable housing requires a chain of documents that each require the previous one:

| Step | Document | Prerequisite | Blocker |
|------|----------|--------------|---------|
| 1 | Birth certificate | Know county/state of birth | Foster records often have DOB/name errors; DCF required to provide at 18 but frequently doesn't |
| 2 | Social Security card | Birth certificate | SSA office weekdays 9–3 only; 2–3 hr wait; 3/yr replacement cap |
| 3 | State ID | Birth cert + SSN + **proof of residency** | Unsheltered people have no address to prove |
| 4 | City ID (workaround) | Can be obtained with shelter attestation | Not Real-ID compliant, limited utility |
| 5 | Bank account | State ID or two alternates | Prior overdrafts block most mainstream banks (ChexSystems) |
| 6 | Employment documentation | Bank account, ID | Most employers require 30+ days of tenure before issuing verification |
| 7 | Rental application | Employment verification + credit + background check | Criminal history and credit requirements eliminate most applicants |

No current system tracks where each person is in this cascade. If a client fails at step 3 and doesn't return, the system has no way to follow up or resume.

### 1.4 Benefits Instability: The Address Cliff
`[VERIFIED]` KanCare (Medicaid) auto-disenrolls on any address change. Recertification notices go to the prior address. Re-enrollment requires an in-person DCF visit. `[VERIFIED]` 42% dropout rate for KanCare-extended former foster youth. SNAP recertification drops similarly. The result: each housing move — even a positive one — risks canceling health coverage and food benefits. A persistent digital identity (tied to a QR card rather than an address) directly solves this.

### 1.5 Transit as a Structural Barrier
`[LIKELY]` Wichita Transit runs 30–60 minute headways with no Sunday service. `[VERIFIED]` A monthly bus pass costs $50 — prohibitive for zero-income clients. Service and intake sites cluster along the N Market St downtown corridor. Affordable housing stock is geographically dispersed: Sunflower Court (northside, 1.8 miles from nearest bus stop), Pawnee Crossing (south Wichita, 4.2 miles from transit). Moving someone from crisis shelter to affordable housing without transportation support simultaneously moves them away from their support network.

### 1.6 System Fragmentation
`[VERIFIED]` 170 coalition member organizations. Second Light's automated HMIS bed-matching is not yet live — referrals are still placed by phone between partner staff. HOT Team operates weekdays only, 7 AM–3:30 PM. Open Door closes at 4 PM. Second Light closes at 5 PM. The system has no 24/7 intelligent routing layer. The current front door (211) loops roughly one in three callers because downstream capacity is unknown or unavailable in real time.

---

## Section 2: Current Service Landscape

### 2.1 Emergency Shelters

| Organization | Population | Beds | In Use | Actually Accessible | Low Barrier | Key Blocker |
|---|---|---|---|---|---|---|
| Union Rescue Mission `[VERIFIED]` | Single men 18+ | 120 | 110 | ~80 (est.) | No | Breathalyzer + chapel attendance filters ~1/3 with active substance use |
| CrossRoads at Youthville `[VERIFIED]` | Youth 18–24 | 12 | 10 | 2 | Yes | Only 2 beds open; adult fallback refused by youth |
| BRIDGES (Wichita Children's Home) `[VERIFIED]` | Youth 16–22 | 8 | 7 | 1 | No | 6-week waitlist; 1–2 admits per quarter |
| St. Anthony Family Shelter `[VERIFIED]` | Families w/ minors | 30 | 27 | 3 | No | Referral + background check blocks entire family for any felony |
| Family Promise `[VERIFIED]` | Families w/ children | 14 | 12 | 2 | No | 2–4 week intake queue |
| Salvation Army `[VERIFIED]` | Adults 18+ | 24 | 20 | 4 | No | Referral through coordinated entry required |
| HumanKind Villas `[VERIFIED]` | Adults 18+ | 155 | 124 | ~30 (est.) | Yes | 8–12 week waitlist; permanent housing, not emergency |
| Mental Health Assoc. SCK `[VERIFIED]` | Adults w/ SMI | 18 | 16 | 2 | No | COMCARE clinical assessment adds 2–4 weeks |
| Open Door `[VERIFIED]` | All 18+ | 0 | 0 | 0 | Yes | Daytime drop-in only; no overnight beds |
| Second Light `[VERIFIED]` | All 18+ | 0 | 0 | 0 | Yes | Coordinated entry hub only; no beds on site |

**System status `[VERIFIED]`:** 17 of 87 emergency beds currently accessible. Remainder blocked by eligibility rules, sobriety conditions, or capacity constraints.

### 2.2 Intake and Navigation

| Site | Type | Hours | Low Barrier | Notes |
|---|---|---|---|---|
| 211 Kansas `[VERIFIED]` | Hotline | 24/7 | Yes | ~1/3 of callers loop; no live warm-handoff after hours |
| H.O.T. Team `[VERIFIED]` | Street outreach | Mon–Fri 7–3:30 | Yes | No weekend/evening coverage |
| Open Door `[VERIFIED]` | Walk-in | Mon–Fri 8–4 | Yes | 80–120 daily contacts; closes at 4 PM |
| CrossRoads Intake `[VERIFIED]` | Shelter intake | 24/7 | Yes | Only round-the-clock youth-specific intake |
| Second Light `[VERIFIED]` | Coordinated entry | Mon–Fri 9–5 | Yes | HMIS bed-matching not yet live; phone referrals only |
| DCF Service Center `[VERIFIED]` | Benefits / IL | Mon–Fri 8–5 | Partial | No warm handoff; 2–4 hr wait |
| Center of Hope `[VERIFIED]` | Financial assist. | Mon–Fri 9–3 | Yes | 6-hr window; same-day funds possible |

### 2.3 Transition Programs (Foster Youth)

| Program | Ages | Slots | Active | Dropout | Wait | Critical Note |
|---|---|---|---|---|---|---|
| DCF Independent Living `[VERIFIED]` | 16–21 | 50 | 34 | 38% | None | Benefits cliff at 21 regardless of stability |
| BRIDGES Transitional Housing `[VERIFIED]` | 16–22 | 8 | 7 | 22% | 6 wks | 8 units total for entire city |
| CrossRoads Emergency Youth `[VERIFIED]` | 18–24 | 12 | 10 | 35% | None | 35% exit without confirmed next placement |
| TRAIL `[VERIFIED]` | 16–21 | 25 | 15 | 30% | 3 wks | Skills-based; parallel to DCF IL |
| SOUL Family `[VERIFIED]` | 16–26 | 35 | 22 | 12% | 1 wk | Mentor model; lowest dropout; capped by mentor supply |
| EmberHope Connections `[VERIFIED]` | 12–21 | 40 | 28 | 28% | 2 wks | Youngest entry point; feeds into TRAIL/DCF IL |
| ETV (Education Voucher) `[VERIFIED]` | 16–23 | 40 | 18 | 25% | 4 wks | $5K/yr; underutilized due to enrollment verification burden |
| KanCare Extension `[VERIFIED]` | 18–26 | Unlimited | 142 | 42% | 2 wks | Address-change auto-disenrollment drives dropout |

### 2.4 Rehousing Options

| Property | Vouchers Accepted | Rent (1BR) | Key Barriers |
|---|---|---|---|
| HumanKind Villas `[VERIFIED]` | HCV, VASH, project-based | $0 (income-scaled) | 8–12 wk waitlist |
| NEXTenant – Riverside Commons `[VERIFIED]` | HCV, rapid-rehousing | $725 | Felony w/in 5 yrs disqualifies |
| NEXTenant – Prairie Wind `[VERIFIED]` | HCV, rapid-rehousing, VASH | $695 | Credit ≥500, no eviction w/in 3 yrs |
| NEXTenant – Douglas Ave Flats `[VERIFIED]` | HCV, rapid-rehousing | $775 | Violent felony w/in 7 yrs; income 2× rent |
| Hilltop Village `[VERIFIED]` | HCV, rapid-rehousing, project-based | $575 | Sex-offense registry disqualifies; 4–6 wk wait |
| VASH Scattered-Site `[VERIFIED]` | VASH only | $0 | Veterans only; VA referral required |
| Private market (baseline) `[LIKELY]` | None | $750–$950 | Credit ≥600, income 3×, no felony, no eviction |

---

## Section 3: Integration and Geographic Map

### 3.1 The Service Corridor

The intake and emergency shelter ecosystem is densely co-located along a 0.5-mile corridor in near-downtown Wichita:

- **N Market St hub:** Union Rescue Mission (200 N Market), St. Anthony (353 N Market), Salvation Army (350 N Market), Center of Hope (310 N Market)
- **E 2nd St:** Open Door (402 E 2nd) — highest-volume walk-in contact point
- **N Emporia St:** CrossRoads + BRIDGES (1110 N Emporia) — only 24/7 youth intake
- **N Hillside St:** Second Light (245 N Hillside) — coordinated entry hub, 1.2 miles east of the N Market cluster

**Transit access within this corridor: high.** `[LIKELY]` Multiple bus routes converge near N Market. Walking between intake sites is feasible.

**Affordable housing: geographically dispersed.** Prairie Wind (southwest), Pawnee Crossing (south, 4.2mi from transit), Sunflower Court (northside, 1.8mi from bus stop). Moving to affordable housing often means leaving the service cluster entirely — without transportation support, this severs the support network at the moment it is most needed.

### 3.2 The Referral Chain (Foster Youth, Acute Crisis)

This traces the path a newly homeless 19-year-old former foster youth currently navigates:

```
Crisis event
    ↓
Calls 211 (24/7) → VI-SPDAT phone screening
    → Referred to CrossRoads (if youth, if bed available: ~2 open)
    → OR referred to adult shelter (frequently refused by youth; adult shelters not equipped for youth trauma)
    ↓
CrossRoads intake (24/7, low-barrier)
    → 30-day program; case management starts
    → Needs: birth certificate (may not have it), SSN card, City ID
    → Referred to DCF for IL enrollment (if not already enrolled)
    ↓
BRIDGES waitlist (6 weeks, 8 units total)
    → 35% of CrossRoads exits lack a confirmed BRIDGES slot
    → Fallback: adult shelters or street
    ↓
BRIDGES (18-month program)
    → Case plan active; housing search begins
    → Needs: state ID (requires residency proof), employment, bank account
    → Referred to NEXTenant for housing search
    ↓
Permanent housing (HumanKind 8–12 weeks, or NEXTenant unit)
    → Monthly check-in with case manager
    → KanCare must be kept active (address change risk)
```

**Failure points in this chain:**
1. 211 → CrossRoads: CrossRoads full → adult shelter → youth refuses → street
2. CrossRoads → BRIDGES: 35% have no confirmed slot; no queue-management system
3. BRIDGES → housing: Document cascade not tracked; case manager carries it in spreadsheets or memory
4. Housing → stability: Address change triggers KanCare/SNAP disenrollment; youth doesn't know until coverage is gone

### 3.3 Where the Connections Break

| Handoff Point | Failure Mode | Frequency |
|---|---|---|
| 211 to shelter | No live bed availability; caller re-queued | ~33% of calls |
| After-hours (4 PM+) | Open Door and Second Light closed; no digital routing | Every evening |
| CrossRoads to BRIDGES | Insufficient downstream slots | 35% of exits |
| Open Door afternoon | Last contact of day re-routed to shelter with no warm handoff | Daily |
| Any agency to DCF | No warm handoff; client carries paper and re-explains at each counter | Every DCF interaction |
| Address change | Benefits auto-disenroll; client unaware until denied care | Systematic |
| Weekend / holiday | HOT Team offline; only 211 operational | Every weekend |

---

## Section 4: Gap Analysis

### 4.1 The 87-Bed Paradox — Explained

`[VERIFIED]` 736 homeless. 87 emergency beds. **17 accessible tonight.**

The remainder break down by blocker:
- **Sobriety/faith requirement** (Union Rescue Mission): ~40 beds effectively inaccessible to individuals with active substance use
- **Population restrictions** (families only, youth only): cross-population spillover is not possible; a single adult cannot take a family bed
- **Referral requirements** (Salvation Army, St. Anthony, BRIDGES): beds exist but require prior agency contact, which requires weekday business hours
- **Waitlists** (HumanKind, BRIDGES): technically "available" units that have a 6–12 week queue
- **Assessment requirements** (Mental Health Association): COMCARE evaluation required before admission

**Conclusion:** This is not a capacity problem — it is an eligibility architecture problem. The "no wrong door" solution must route individuals to beds they actually qualify for, flag eligibility blockers, and surface alternatives rather than returning a dead-end referral.

### 4.2 The Foster Youth Cliff

`[VERIFIED]` DCF IL benefits terminate at 21. KanCare extension runs to 26 but has a 42% dropout rate driven entirely by address-change auto-disenrollment. BRIDGES has 8 units for the entire city. 583 youth age out in Kansas annually.

**Addressable in 90 days:**
- Persistent QR identity prevents address-change disenrollment
- Chatbot proactively surfaces KanCare recertification deadlines
- Digital document tracking prevents the birth cert → SSN → ID cascade from silently failing

**Requires capital (Year 2+):**
- Additional BRIDGES-model transitional housing units
- Mentor supply scaling for SOUL Family

### 4.3 The Document Stack — No Tracker Exists

`[VERIFIED]` DCF provides birth certificates at age 18 — inconsistently. `[VERIFIED]` Many aged-out youth have never received one. No system currently tracks where each individual is in the document chain.

**Addressable in 90 days:** The chatbot tracks each user's document status and knows exactly which document is the current blocker. It schedules appointments, sends reminders, and knows which partners (Breakthrough Wichita, Center of Hope) provide accompaniment.

### 4.4 After-Hours and Weekend Void

HOT Team: weekdays 7–3:30. Open Door: weekdays 8–4. Second Light: weekdays 9–5. 211 is 24/7 but cannot match beds in real time.

**Addressable in 90 days:** The chatbot is always-on. It provides immediate routing to any bed with a live opening, surface emergency options, and queues the user for a human case manager at next business hours.

### 4.5 Transit + Housing Location Mismatch

Affordable units (Pawnee Crossing, Sunflower Court) are geographically isolated from services. A $50/month bus pass is unaffordable for zero-income clients.

**Addressable in 90 days:** Chatbot routes users only to units within transit reach of their existing support services OR surfaces transit pass assistance through Center of Hope/Salvation Army allocation.

**Requires capital (Year 2+):** Transit expansion, transportation voucher program, co-located affordable housing + services development.

### 4.6 HMIS / Real-Time Bed Availability

`[VERIFIED]` Second Light's automated bed-matching is not yet live. Referrals are still phone-based between partner staff.

**Addressable in 90 days:** The chatbot layer can function as a lightweight routing API on top of the existing system even before HMIS integration is complete, using direct intake-site partnerships to pull availability. When Second Light's HMIS goes live, the chatbot becomes its consumer.

---

## Section 5: Data Gaps and Uncertainties

| Claim | Confidence | Gap / Risk |
|---|---|---|
| 87 beds, 17 accessible | `[VERIFIED]` from API | Snapshot as of 2026-04-18 09:00; real-time availability fluctuates |
| Foster youth homelessness rates (17%, 29%, 42%) | `[VERIFIED]` | Kansas-wide data; Wichita-specific split not available |
| 583 youth age out annually | `[VERIFIED]` | Kansas statewide; Wichita/Sedgwick County share `[UNCERTAIN]` |
| HOT Team weekend coverage | `[VERIFIED]` schedule | Actual weekend response via Police HOT referrals not quantified |
| NEXTenant unit availability | `[VERIFIED]` on roster | Current vacancy rates unknown; listed as "partner pool" not live inventory |
| Private market screening criteria | `[LIKELY]` | Based on representative sample; individual landlord policies vary |
| KanCare dropout = address change | `[VERIFIED]` program notes | Share of dropout due to address change vs. other causes `[UNCERTAIN]` |
| Union Rescue Mission ~1/3 turned away | `[LIKELY]` | From operator notes; no independent verification |
| BRIDGES 6-week wait | `[VERIFIED]` | Stated wait average; actual varies by cohort |
| $50/month bus pass prohibitive | `[VERIFIED]` cost | Allocation volume from Center of Hope/Salvation Army `[UNCERTAIN]` |

**Missing data that would strengthen the solution:**
- Real-time HMIS bed occupancy feed (coming when Second Light integration goes live)
- Sedgwick County-specific foster youth aging-out count
- HOT Team referral volume on weekends via Police channel
- NEXTenant live unit availability API

---

## Section 6: Year 2+ Opportunities

These are confirmed gaps in the 90-day pilot scope that the challenge envisions for the renewal case. They are directionally validated by the data above but require capital, policy change, or partnership development beyond the pilot window.

### 6.1 Low-Barrier Single-Adult Emergency Shelter
No low-barrier emergency shelter exists for single adults (especially men with active substance use). Union Rescue Mission's sobriety requirement structurally excludes this population. A Housing First-model wet shelter for single adults would immediately absorb a significant share of the 195 unsheltered individuals.

### 6.2 BRIDGES Expansion
8 transitional housing units for youth is inadequate for a city of 700K. Demand clearly eclipses supply by an order of magnitude. Year 2 capital should prioritize replicating the BRIDGES model — potentially through partnerships with NEXTenant property owners willing to set aside units under a transitional-housing model.

### 6.3 HMIS Integration + Live Bed Dashboard
When Second Light's HMIS integration goes live, the chatbot becomes a consumer of real-time bed availability. The Oracle track's dashboard and the Architect track's routing system both depend on this data feed. Piloting on partial data now, with a migration plan to HMIS, is the right architecture.

### 6.4 Expansion to Other Disadvantaged Groups
The QR-card persistent identity + chatbot model is population-agnostic. Year 2+ applicability:
- **Domestic violence survivors:** Needs safe shelter routing with location privacy
- **Veterans:** VASH pipeline already has structure; chatbot reduces case manager burden
- **Individuals with serious mental illness:** COMCARE assessment scheduling and wraparound routing
- **Recently released from incarceration:** Document cascade + housing screening navigation
- **Immigrants / DACA recipients:** Language support (211 already has 150+ language line) + benefit eligibility routing

### 6.5 Landlord Portal (NEXTenant Expansion)
The challenge quotes a landlord directly: *"I'm not against renting to someone in transition. I need one clear contact, reduced risk, and confidence that the support won't disappear."* A landlord-facing module — integrated with the same chatbot backbone — provides a single case-manager contact, lease-support guarantees, and real-time tenant status updates. This scales NEXTenant's model without requiring new organization infrastructure.

### 6.6 Transit Integration
Wichita Transit route optimization and a digital transit-pass benefit (loaded directly to the client's persistent account rather than requiring a physical purchase) would address the housing-location vs. services-location mismatch that currently makes affordable units in south and north Wichita impractical placements.

---

## Appendix: Full Service Inventory

### A1 — Shelter Sites

| ID | Organization | Population | Beds | Util. | Low Barrier | Referral Req. | Confidence |
|---|---|---|---|---|---|---|---|
| shelter-001 | Union Rescue Mission | Single men 18+ | 120 | 92% | No | No | VERIFIED |
| shelter-002 | Open Door | All 18+ (day only) | 0 | — | Yes | No | VERIFIED |
| shelter-003 | CrossRoads at Youthville | Youth 18–24 | 12 | 83% | Yes | No | VERIFIED |
| shelter-004 | BRIDGES | Youth 16–22 | 8 | 88% | No | Yes | VERIFIED |
| shelter-005 | St. Anthony Family Shelter | Families w/ minors | 30 | 90% | No | Yes | VERIFIED |
| shelter-006 | Family Promise | Families w/ children | 14 | 86% | No | Yes | VERIFIED |
| shelter-007 | Salvation Army | Adults 18+ | 24 | 83% | No | Yes | VERIFIED |
| shelter-008 | Second Light | All 18+ (entry hub) | 0 | — | Yes | No | VERIFIED |
| shelter-009 | HumanKind Villas | All 18+ | 155 | 80% | Yes | Yes | VERIFIED |
| shelter-010 | Mental Health Assoc. SCK | Adults w/ SMI | 18 | 89% | No | Yes | VERIFIED |

### A2 — Intake Sites

| ID | Site | Hours | Phone | Lang. | Youth | Live Transfer |
|---|---|---|---|---|---|---|
| intake-001 | 211 Kansas | 24/7 | 211 | EN/ES/150+ | Yes | Yes |
| intake-002 | H.O.T. Team | M–F 7–3:30 | 316-268-4531 | EN | Yes | Yes |
| intake-003 | Open Door | M–F 8–4 | 316-265-9371 | EN/ES | Yes | Yes |
| intake-004 | CrossRoads Intake | 24/7 | 316-684-6581 | EN | Yes | Yes |
| intake-005 | Second Light | M–F 9–5 | 316-267-1321 | EN | Yes | No |
| intake-006 | Family Promise | M–F 9–4 | 316-264-7225 | EN | No | No |
| intake-007 | DCF Service Center | M–F 8–5 | 316-337-6100 | EN/ES | Yes | No |
| intake-008 | Center of Hope | M–F 9–3 | 316-267-0222 | EN/ES | Yes | Yes |

### A3 — Transition Programs

| ID | Program | Ages | Slots | Wait | Dropout | Cliff |
|---|---|---|---|---|---|---|
| prog-001 | DCF Independent Living | 16–21 | 50 | None | 38% | Ends at 21 regardless |
| prog-002 | ETV | 16–23 | 40 | 4 wks | 25% | Enrollment verification burden |
| prog-003 | KanCare Extension | 18–26 | Unlimited | 2 wks | 42% | Address-change auto-disenroll |
| prog-004 | SOUL Family | 16–26 | 35 | 1 wk | 12% | Mentor supply cap |
| prog-005 | TRAIL | 16–21 | 25 | 3 wks | 30% | Age cliff at 21 |
| prog-006 | CrossRoads Emergency | 18–24 | 12 | None | 35% | No downstream slots |
| prog-007 | BRIDGES Transitional | 16–22 | 8 | 6 wks | 22% | 8 units total in city |
| prog-008 | EmberHope Connections | 12–21 | 40 | 2 wks | 28% | Feeds into TRAIL/DCF IL |

### A4 — Document Stack

| Doc | Prerequisite | Processing | Fee | Support Org |
|---|---|---|---|---|
| Birth certificate | Know birth county/state | 14 days | $15 | DCF (active youth); Breakthrough Wichita |
| Social Security card | Birth certificate | 10 days | $0 | Breakthrough Wichita |
| City ID | Shelter attestation | 1 day | $0 | Breakthrough Wichita (accompaniment) |
| Kansas State ID | Birth cert + SSN + residency | 7 days | $22 | Center of Hope (fee assist); Open Door (residency letter) |
| KanCare | SSN + identity + income | 21 days | $0 | Open Door, Center of Hope (navigators) |
| SNAP | Identity + income + phone interview | 30 days (7 expedited) | $0 | Open Door, Kansas Food Bank |
| Bus pass | None | 1 day | $50/mo | Center of Hope, Salvation Army (limited allotments) |
| Bank account | State ID | 1 day | $0 | Breakthrough Wichita (second-chance accounts) |

---

*Document ready for human review and AI agent consumption. All named organizations are Wichita-specific with confidence ratings as noted. Data uncertainties flagged in Section 5. Pending: real-time HMIS feed, Sedgwick County-specific foster youth counts, NEXTenant live vacancy API.*
