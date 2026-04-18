How to use it in competition:
When you get the challenge brief, start a new conversation inside the project and say something like: "New challenge. Here's the brief: [paste it]. Which domain set is closest? Build me the prompt sequence."
The project Claude already knows your template, your workflow, your failure modes, and has all three domain prompt libraries. It'll map the challenge to the closest set and adapt the prompts for you — or generate new ones using your research prompt if nothing fits.
Each domain set also includes a glossary of key terms at the top so you're not blindsided by jargon during the competition. You don't need to memorize them — just recognize them when the AI uses them in its output.
----------
The Challenge
The Problem

Wichita doesn't lack caring organizations. It has coordinated entry, Housing First, rapid rehousing, day shelter services, youth shelter, supportive housing, City ID, landlord matching, and Second Light. The deeper problem: the system is fragmented, referral-heavy, and hard to navigate at the moment people are least able to navigate it.

The Scenario
You are designing a 90-day Wichita pilot. The city is offering $500,000. $100,000 is reserved for marketing, trust-building, and adoption.

Teams must work with existing assets: Second Light, Open Door, H.O.T., CrossRoads, BRIDGES, DCF IL, City ID, NEXTenant, Housing First and rapid rehousing pathways.

Known current pain point examples:
"I can maybe find somewhere to sleep this week, but I still don't know how I'm supposed to get my ID, keep my health coverage, and start school."

"Most of my job is still phone calls, spreadsheets, and tribal knowledge. The system works best if you already know all the doors."

"I don't know whether I should call 211, the city, Family Promise, or somebody else. By the time I figure it out, I'm already behind."

"We can get someone to safety for the night, but the next steps break down on documents, benefits, transportation, and follow-through."

"People keep telling me there are beds somewhere, but that doesn't help if none of them fit my situation tonight."

I'm not against renting to someone in transition. I need one clear contact, reduced risk, and confidence that the support won't disappear."


Base URL: https://aipromptchamp.com

Endpoint	Description	Records
/api/challenge/wich/community-snapshot	Core community indicators and 2025 PIT data	1 snapshot
/api/challenge/wich/shelter-inventory	Shelter and program fit data by provider	~10 providers
/api/challenge/wich/intake-network	Front-door entry pathways and intake points	~8 intake sites
/api/challenge/wich/transition-programs	Transition-age youth supports and programs	~8 programs
/api/challenge/wich/stabilization-docs	Friction-heavy stabilization steps	~10 documents
/api/challenge/wich/rehousing-options	Rehousing and landlord placement options	~10 properties
/api/challenge/wich/system-status	System status and live alerts ⚡	Live status
All endpoints return JSON. CORS enabled. Append ?zip=true for compressed responses.

The Oracle
Build the Dashboard and Intervention Model
Build a dashboard, operating model, and business case showing how Wichita should spend the $500K, how the 90-day pilot works, the $100K marketing allocation, and what outcomes prove renewal.

Strong Deliverables:
Transition bottleneck dashboard
Use-of-funds model
Prioritization model
Youth handoff failure analysis
Cost-of-instability analysis
Pilot KPI framework
Renewal case


The Standard
What Winning Looks Like
A strong Wichita solution should:
Reduce confusion about where to start
Reduce failed handoffs between systems
Make bed and program matching more precise
Make documents and benefits part of the housing workflow
Help youth move toward stable adulthood
Use Wichita's existing assets instead of pretending the city is starting from zero
----------
Prompt 1 — Transition Bottleneck Dashboard
Role: You are a frontend developer building an executive dashboard.

Situation: Wichita, KS is running a $500,000 90-day pilot to reduce homelessness system fragmentation. The system serves 736 people experiencing homelessness (541 sheltered, 195 unsheltered, 6.1% YoY increase). There are 87 emergency beds but only 17 are currently reachable — the rest are blocked by referral rules, sobriety conditions, or population-specific restrictions. The coordinated-entry hub (Second Light) is not yet running automated bed-matching; referrals are still phone-based between partner staff. The system houses 38% of people within a year at an average of 45 days to housing (vs. 176 days nationally), and 69% of people served are newly homeless.

INTAKE NETWORK (8 sites):
- 211 Kansas: 24/7 phone, ~1/3 of callers loop because downstream beds unavailable
- H.O.T. Team: Mon-Fri 7AM-3:30PM street outreach, no evening/weekend coverage
- Open Door: Mon-Fri 8AM-4PM walk-in, 80-120 daily contacts, highest-volume intake
- CrossRoads Youth: 24/7 walk-in, only round-the-clock youth intake, when full fallback is adult shelters
- Second Light: Mon-Fri 9AM-5PM walk-in, coordinated entry, bed-matching not yet automated
- Family Promise: Mon-Fri 9AM-4PM phone, families only, 2-4 week queue
- DCF Service Center: Mon-Fri 8AM-5PM walk-in, 2-4 hour wait, no warm handoff
- Center of Hope: Mon-Fri 9AM-3PM walk-in, same-day emergency funds, 6-hour window

SHELTER INVENTORY (beds online / in use / utilization):
- Union Rescue Mission: 120/110/92%, single men only, breathalyzer + chapel required
- CrossRoads Youth: 12/10/83%, ages 18-24, low-barrier, 1/3 exits lack confirmed next placement
- BRIDGES: 8/7/88%, ages 16-22, transitional, referral required, 6-week waitlist
- St. Anthony Family: 30/27/90%, families only, referral required, felony blocks whole family
- Family Promise: 14/12/86%, families with children, employment readiness evaluated
- Salvation Army: 24/20/83%, referral through coordinated entry
- HumanKind Villas: 155/124/80%, permanent supportive housing, Housing First, 8-12 week waitlist
- MHA: 18/16/89%, serious mental illness only, COMCARE assessment adds 2-4 weeks

STABILIZATION DOCUMENTS (processing days / key blocker):
- City ID: 1 day / requires proving residency unsheltered people can't document
- Birth Certificate: 14 days / foster-care name/DOB discrepancies invalidate requests
- Social Security Card: 10 days / requires birth cert first, SSA office hours 9-3 weekdays only
- Kansas State ID: 7 days / requires birth cert + SSN + residency proof (circular barrier)
- KanCare (Medicaid): 21 days / address change triggers auto-disenrollment
- SNAP: 30 days standard / 7-day expedited exists but staff rarely flag it
- Bus Pass: 1 day / $50/month prohibitive at zero income
- Bank Account: 1 day / requires state ID, ChexSystems blocks many
- Employment Verification: 5 days / gig work doesn't generate standard letters
- GED: 7 days to register / $120/attempt, unstable housing disrupts study

Deliverable: Deliverable 1 of 7 — Transition Bottleneck Dashboard. An interactive dashboard mapping where people get stuck moving through the system from first contact to stable housing.

Format: React component.

Top section: A horizontal pipeline diagram with 5 stages as labeled nodes connected by arrows: INTAKE → SHELTER → DOCUMENTS → BENEFITS → HOUSING. Each node shows: volume entering that stage, volume successfully passing to next stage, and drop-off percentage between stages. Color-code drop-off severity (green <15%, yellow 15-30%, red >30%).

Below: A bottleneck detail table with columns: Stage, Specific Bottleneck, Root Cause, Population Most Affected, Estimated People Stuck per Month, and Current Workaround (if any). Include at least 10 rows covering the worst bottlenecks from the data above — examples: "Only 17 of 87 beds reachable," "ID requires residency proof unsheltered can't produce," "KanCare disenrolls on address change," "No intake site open after 5 PM except CrossRoads and 211."

Below: A circular-dependency diagram (can be a styled callout or simple SVG) showing the ID → residency → housing → ID loop that traps unsheltered people.

Bottom: A time-to-housing waterfall chart showing cumulative days at each stage: intake processing (1-3 days), shelter wait (varies by population), document assembly (estimated 30-45 days if starting from zero), benefits enrollment (21-30 days overlapping), housing search + application (varies). Show best case, typical case, and worst case as three bars.

Analytical hook: Callout at top answering: "Which single bottleneck, if removed, would move the most people from stuck to housed within 90 days?" Name it, quantify the people affected, and state why it beats the next-worst bottleneck.

Constraints: Single file. Use Recharts for charts. Use Tailwind for styling. Use the exact numbers from the data above — do not invent statistics.

Prompt 2 — Youth Handoff Failure Analysis
Role: You are a frontend developer building an executive dashboard.

Situation: Same Wichita pilot as Deliverable 1. This deliverable zooms into foster youth aging out of care.

Key youth data:
- Kansas: 583 youth age out of foster care annually
- At age 17: 17% experiencing homelessness, 0.3% employed full-time
- At age 19: 29% experiencing homelessness
- At age 21: 42% experiencing homelessness, 44% employed full-time
- Homelessness rate MORE THAN DOUBLES from 17 to 21 — the transition itself is the risk

YOUTH-SERVING PROGRAMS (slots available / active / dropout rate / age cap):
- DCF Independent Living: 50/34/38% dropout/ages 16-21, benefits stop at 21 regardless of stability
- ETV (education voucher): 40/18/25% dropout/ages 16-23, underutilized, paperwork burden
- KanCare Extension: 999/142/42% dropout/ages 18-26, address changes cause disenrollment
- SOUL Family (mentoring): 35/22/12% dropout/ages 16-26, lowest dropout, mentor recruitment is constraint
- TRAIL (life skills): 25/15/30% dropout/ages 16-21, age-capped at 21
- CrossRoads Shelter: 12/10/35% dropout/ages 18-24, 1/3 exits lack next placement
- BRIDGES Transitional: 8/7/22% dropout/ages 16-22, 6-week waitlist, only 8 units exist
- EmberHope: 40/28/28% dropout/ages 12-21, feeds into TRAIL/DCF IL

CRITICAL HANDOFF FAILURES TO MAP:
- Age 18: DCF custody ends → youth must self-navigate adult systems
- Age 21: DCF IL + TRAIL benefits hard-stop → no replacement
- Age 22: BRIDGES age cap → exits to what?
- CrossRoads full → fallback is adult shelters youth refuse
- KanCare recertification notices sent to old addresses → coverage lost
- ETV requires enrollment verification each semester → housing instability breaks enrollment → loses funding → can't stabilize

Deliverable: Deliverable 2 of 7 — Youth Handoff Failure Analysis. An interactive dashboard tracing how foster youth fall through gaps between programs.

Format: React component.

Top: 3 metric cards — Youth Aging Out Annually in Kansas (583), Homelessness Rate by Age 21 (42%), Programs with Hard Age Caps at 21 (count them from the data).

Below: A timeline visualization (horizontal swim-lane or Gantt-style chart) showing each program's age coverage as a horizontal bar. X-axis: age 12 to 26. Y-axis: one row per program. Color bars by program type (housing=blue, case-management=green, education=purple, healthcare=orange, belonging=yellow). Mark the age-18 and age-21 cliff lines vertically. Visually highlight the gap zones where coverage drops.

Below: A handoff failure table with columns: Handoff Transition (e.g., "DCF IL → nothing at age 21"), Sending Program, Receiving Program (or "none"), Trigger (age cap / funding end / capacity), Annual Youth Affected (estimate), and What Happens Next (actual observed outcome). Include at least 6 rows.

Below: A dropout rate comparison — horizontal bar chart ranking all 8 programs by dropout rate, with SOUL Family (12%) on one end and KanCare (42%) on the other. Annotate what distinguishes the lowest-dropout program from the highest.

Bottom: A "cascade of loss" flowchart showing: loses housing → address changes → KanCare disenrolls → can't access mental health → employment destabilizes → cycles back to intake. Style as a circular flow with exit ramps labeled "intervention points."

Analytical hook: Callout answering: "If the pilot could extend or bridge exactly one age-cap cliff, which one saves the most youth from homelessness and what would it cost per person per month?" Use the program data to justify.

Context: Reference the circular-dependency and document-assembly findings from Deliverable 1.

Constraints: Single file. Use Recharts for charts. Use Tailwind for styling. Use exact numbers from the data.

Prompt 3 — Prioritization Model
Role: You are a frontend developer building an executive dashboard.

Situation: Same Wichita pilot. Using findings from Deliverables 1 and 2, this deliverable scores and ranks which bottlenecks the pilot should fix first.

Deliverable: Deliverable 3 of 7 — Prioritization Model. An interactive dashboard that scores bottlenecks and recommends the top 3-5 interventions for a 90-day, $400K operating budget (after $100K reserved for marketing/trust-building).

Format: React component.

Top: A summary callout showing the top 3 recommended interventions in rank order with estimated cost and estimated people reached per intervention.

Below: A scoring matrix table with columns: Bottleneck (from Deliverables 1 and 2), People Affected per Month, Feasibility in 90 Days (1-5), Estimated Cost to Address, Impact if Solved (1-5, based on how many downstream steps it unblocks), Dependency (does solving this require solving something else first?), and Weighted Priority Score. Include at least 10 rows. Sort by priority score descending.

Scoring weights (show these in the UI as an adjustable legend):
- People Affected: 30%
- Feasibility in 90 Days: 25%
- Impact if Solved: 25%
- Cost Efficiency (people per dollar): 20%

Below: A scatter plot with X-axis = Feasibility, Y-axis = Impact, bubble size = People Affected, bubble color = cost bucket (green <$50K, yellow $50-100K, red >$100K). Label each bubble with the bottleneck name.

Below: A dependency chain panel showing which interventions must happen in sequence (e.g., "ID assistance must precede housing applications") vs. which can run in parallel.

Bottom: A "what fits in $400K" stacking exercise — show a running total as interventions are added in priority order until budget is exhausted. Display remaining budget and uncovered bottlenecks.

Analytical hook: Callout answering: "What combination of 3 interventions maximizes people moved to stable housing within 90 days without exceeding $400K? What is the single most impactful bottleneck you had to leave unfunded and why?"

Context: Reference specific bottlenecks identified in Deliverables 1 and 2.

Constraints: Single file. Use Recharts for charts. Use Tailwind for styling. Costs should be realistic estimates grounded in the program and staffing data — do not use placeholder numbers without justification.

Prompt 4 — Cost-of-Instability Analysis
Role: You are a frontend developer building an executive dashboard.

Situation: Same Wichita pilot. This deliverable quantifies what it costs — to the system and to the individual — when someone cycles through intake repeatedly without reaching stable housing.

Key data points:
- 3,257 people served annually, 69% newly homeless (2,252 first-time)
- 38% housed within a year, meaning 62% are NOT housed within a year
- Average 45 days to housing locally vs. 176 nationally
- 87 emergency beds, only 17 reachable at any time
- Open Door sees 80-120 contacts/day; most afternoon visitors already cycled through another partner
- 211 callers: ~1/3 loop because downstream beds unavailable
- CrossRoads youth: 1/3 exits lack confirmed next placement
- KanCare disenrollment from address change → re-enrollment requires in-person DCF visit (2-4 hour wait)
- Document assembly from zero takes 30-45 days minimum across 4+ offices

Deliverable: Deliverable 4 of 7 — Cost-of-Instability Analysis. An interactive dashboard quantifying the cost of system cycling vs. stable placement.

Format: React component.

Top: 3 metric cards — Estimated Annual System Cost of Cycling (aggregate), Cost per Person per Cycle Through Intake, and Cost Avoided per Successful Permanent Placement.

Below: A cost comparison table with columns: Cost Category, Cost per Episode (Cycling), Cost per Episode (Stable Pathway), Savings per Person, and Annual System Savings if Applied to All. Rows: emergency shelter bed-nights, intake staff time per re-contact, ER visits (uninsured cycling population), law enforcement contacts, lost wages (individual), document re-processing, transit costs for multi-site navigation, and case-manager time on re-intake vs. sustained follow-up. Use published per-unit costs: shelter bed-night ~$87/night (HUD), ER visit ~$2,000+ uninsured, law enforcement contact ~$150.

Below: A dual-bar chart comparing cost profile of a "cycling client" (touches intake 4+ times/year without reaching housing) vs. a "stable-pathway client" (moves intake → housing in under 60 days). Stacked by cost category.

Below: A "what the city is already spending" summary — estimate Wichita's current annual expenditure on emergency response to homelessness (shelter operations, outreach, ER, law enforcement) vs. cost to permanently house the same number of people.

Bottom: A breakeven analysis — at what number of successful permanent placements does the pilot's $500K pay for itself in avoided system costs? Show as a single metric with supporting math.

Analytical hook: Callout answering: "How many permanent placements does the pilot need in 90 days to break even on the $500K investment, and is that number realistic given current system throughput (38% housed/year, 45 days average)?"

Context: Use bottleneck data from Deliverable 1 and youth cycling data from Deliverable 2.

Constraints: Single file. Use Recharts for charts. Use Tailwind for styling. Cite the basis for every cost estimate. No vague terms like "significant savings" — always show a number.

Prompt 5 — Use-of-Funds Model
Role: You are a frontend developer building an executive dashboard.

Situation: Same Wichita pilot. $500,000 total budget. $100,000 reserved for marketing, trust-building, and adoption. $400,000 for interventions. 90-day timeline. Must work with existing Wichita assets (Second Light, Open Door, H.O.T., CrossRoads, BRIDGES, DCF IL, City ID, NEXTenant, Housing First and rapid rehousing pathways).

Deliverable: Deliverable 5 of 7 — Use-of-Funds Model. An interactive dashboard showing how the $500K is allocated, what each dollar buys, and who it reaches.

Format: React component.

Top: 4 metric cards — Total Budget ($500K), Operating Budget ($400K), Marketing/Adoption Budget ($100K), Projected People Served.

Below: A uses table with columns: Intervention Name, Partner Organization, Budget Allocation, Unit Cost, Units Purchased, People Reached, and Timeline (which weeks of the 90 days). Rows at minimum:
- Document navigator staffing (ID, birth cert, SSN assistance at intake sites)
- Extended-hours intake coverage (evening/weekend at Second Light or Open Door)
- Transit pass fund (bus passes distributed through intake sites)
- Emergency bridge housing flex fund (when CrossRoads/BRIDGES are full)
- Digital case-coordination layer (accelerate Second Light bed-matching)
- Youth age-cliff bridge support (extend case management past 21)
- NEXTenant landlord incentive fund (deposit assistance + risk mitigation)
- Marketing, trust-building, and community adoption ($100K reserved)

Below: A donut chart — budget by category: Staffing, Direct Client Assistance, Technology, Landlord Incentives, Marketing/Adoption.

Below: A 90-day Gantt timeline — Phase 1 (Weeks 1-4: setup + hiring), Phase 2 (Weeks 5-8: launch + iterate), Phase 3 (Weeks 9-12: scale + measure). Show when each intervention launches, ramps, and reaches steady state.

Bottom: A sensitivity panel — what happens at 75% funding ($375K)? Show which intervention gets cut first and impact on projected placements.

Analytical hook: Callout answering: "What percentage of the $400K goes to direct client services vs. system infrastructure, and is that ratio right for a 90-day pilot? What is the single intervention with the highest cost-per-person and is it justified?"

Context: Reference priority rankings from Deliverable 3 and cost benchmarks from Deliverable 4.

Constraints: Single file. Use Recharts for charts. Use Tailwind for styling. Every budget line must show a unit cost and quantity — no lump sums without breakdown. Budget must total exactly $500,000.

Prompt 6 — Pilot KPI Framework
Role: You are a frontend developer building an executive dashboard.

Situation: Same Wichita pilot. The city needs to know whether the $500K worked. Metrics must be measurable within 90 days and map to the interventions funded in Deliverable 5.

Deliverable: Deliverable 6 of 7 — Pilot KPI Framework. An interactive dashboard defining 8-12 metrics with baselines, targets, and measurement methods.

Format: React component.

Top: A stoplight grid showing all KPIs — green/yellow/red/gray (not yet measured). Default all to gray since this is the framework.

Below: A KPI detail table with columns: KPI Name, Category (Access / Speed / Stability / Cost / Equity), Baseline (from the data), Day 30 Target, Day 60 Target, Day 90 Target, Data Source, and Measurement Method.

KPIs must include:
1. Reachable bed percentage (baseline: 17/87 = 20%)
2. Average days from first contact to housing (baseline: 45)
3. Intake-to-shelter drop-off rate
4. Documents completed per client within 30 days of intake
5. Youth exiting CrossRoads with confirmed next placement (baseline: 67%)
6. KanCare coverage maintained through transition (baseline: 58%)
7. Landlords actively accepting voucher referrals via NEXTenant
8. Permanent housing placements during pilot
9. Cost per successful placement
10. Repeat intake contacts (cycling rate reduction)

Below: A leading vs. lagging indicator map showing which KPIs change first vs. last.

Bottom: A data-collection feasibility panel — for each KPI, flag: exists in HMIS, requires new tracking, or depends on partner reporting. Flag any KPI that can't be measured in 90 days and suggest a proxy.

Analytical hook: Callout answering: "Which single KPI is the strongest leading indicator the pilot is working? Which KPI is the earliest warning it's failing — what is its threshold and at what day should the team pivot?"

Context: KPIs must map to interventions in Deliverable 5 and bottlenecks in Deliverable 1.

Constraints: Single file. Use Recharts for charts. Use Tailwind for styling. Baselines must use exact numbers from the data — no "TBD" for anything calculable.

Prompt 7 — Renewal Case
Role: You are a frontend developer building an executive dashboard.

Situation: Same Wichita pilot. This is the final deliverable — a single-page visual argument for why the city should renew funding. Audience: city council members who will see this for 5 minutes.

Deliverable: Deliverable 7 of 7 — Renewal Case. A single-page dashboard making the case for continued funding.

Format: React component.

Top: Hero banner with the single most compelling projected outcome (e.g., "X people housed in 90 days at $Y per person — Z% below national cost benchmark").

Below: 4 metric cards — Pilot Investment ($500K), Projected People Housed, Projected Year 1 System Cost Savings if Continued, ROI Ratio (savings ÷ investment).

Below: Before/after comparison table — two columns "Before Pilot" and "After Pilot (Projected)" with rows: reachable bed %, average days to housing, intake-to-housing drop-off rate, youth with confirmed next placement, documents completed within 30 days, cycling rate. Show change as arrow with % improvement.

Below: 12-month projection line chart — 3 scenarios: (1) funding ends after 90 days (gains decay), (2) renewed at $2M/year, (3) renewed at $1M/year with efficiency gains. Y-axis = cumulative permanent placements.

Below: Annual cost comparison bars — pilot model cost vs. status quo cost (cycling, ER, shelter, re-intake from Deliverable 4). Label the delta as "net savings."

Bottom: 3 numbered insight cards — each with a metric and one-sentence explanation. End with specific funding ask and timeline.

Analytical hook: Callout answering: "At what funding level does the model become self-sustaining through system cost savings alone, and how many years would that take? If the answer is 'never,' state the permanent subsidy required and compare it to the cost of inaction."

Context: Reference specific numbers from ALL prior deliverables (1-6). This is the capstone.

Constraints: Single file. Use Recharts for charts. Use Tailwind for styling. No vague language — every claim needs a number. Designed for a 5-minute non-technical read.

