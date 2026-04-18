# Testing Strategy — Wichita Dashboard Components

**Scope:** D1–D5 (files present). D6 and D7 stubs included — fill when files arrive.

---

## Framework

| Tool | Choice | Reason |
|---|---|---|
| Test runner | **Vitest** | Vite-native, fast, Jest-compatible API |
| DOM assertions | **@testing-library/react** | Renders components, queries visible text |
| DOM environment | **jsdom** | No real browser needed for text assertions |
| Recharts mock | Module-level vi.mock | Charts crash in jsdom; mock returns `null` for all Recharts exports |

### Recharts Mock (shared setup)

```js
// vitest.setup.js
vi.mock('recharts', () => {
  const Null = () => null;
  return {
    BarChart: Null, Bar: Null, XAxis: Null, YAxis: Null,
    CartesianGrid: Null, Tooltip: Null, Legend: Null,
    ResponsiveContainer: Null, Cell: Null, LabelList: Null,
    ScatterChart: Null, Scatter: Null, ZAxis: Null, ReferenceLine: Null,
    PieChart: Null, Pie: Null,
  };
});
```

Add to `vite.config.js`:
```js
test: {
  environment: 'jsdom',
  setupFiles: ['./vitest.setup.js'],
  globals: true,
}
```

---

## Scope Decision

**Renders + key assertions only.** Each test file does two things:

1. Confirms the component mounts without throwing (`render()` succeeds)
2. Asserts that critical metric values from the spec appear in the DOM as visible text

No snapshot tests. No interaction tests. No accessibility audits. No error-state tests.

**Why this scope for competition context:** The claim being validated is "the dashboard shows the right numbers." A reviewer who runs the suite and sees green can conclude the data wiring is correct. Wider scope adds cost without adding to that claim.

---

## Per-Component Assertions

### D1 — TransitionBottleneckDashboard

File: `deliverable-1-transition-bottleneck-dashboard.jsx`
Export: `TransitionBottleneckDashboard`

Values hardcoded in component data (exact strings to assert):

| Assert | Source in component |
|---|---|
| `"736"` | MetricCard "Total Experiencing Homelessness" |
| `"17 / 87"` | MetricCard "Reachable Beds" |
| `"45"` | MetricCard "Avg Days to Housing" |
| `"38%"` | MetricCard "Housed Within 1 Year" |
| `"130"` | bottlenecks[0].stuck — highest blockage (shelter bed reachability) |
| `"3,257"` | pipelineStages[0].entering (displayed via `.toLocaleString()`) |
| `"195"` | MetricCard sub "541 sheltered · 195 unsheltered" |
| `"Deliverable 1 of 7"` | Header label |

**3 minimum assertions:** `"736"`, `"17 / 87"`, `"Deliverable 1 of 7"`

---

### D2 — YouthHandoffDashboard

File: `deliverable-2-youth-handoff-failure.jsx`
Export: `YouthHandoffDashboard`

| Assert | Source in component |
|---|---|
| `"583"` | MetricCard "Youth Aging Out Annually" |
| `"42%"` | MetricCard "Homeless by Age 21" |
| `"3"` | MetricCard "Programs Hard-Capped at 21" |
| `"12%"` | dropoutData SOUL Family rate (rendered as bar label `12%↓`) |
| `"42%"` | dropoutData KanCare rate (same format) — note: same value as metric card, different source |
| `"245"` | handoffFailures affected count (rendered in table) |
| `"Deliverable 2 of 7"` | Header label |

**Note:** `"42%"` appears twice (metric card + KanCare bar). Both should be present. Assert both with `getAllByText` if needed.

**3 minimum assertions:** `"583"`, `"3"`, `"Deliverable 2 of 7"`

---

### D3 — PrioritizationModel

File: `deliverable-3-prioritization-model.jsx`
Export: `PrioritizationModel`

| Assert | Source in component |
|---|---|
| `"$400K"` | MetricCard "Operating Budget" |
| `"10"` | MetricCard "Bottlenecks Scored" |
| `"30%"` | Scoring weight chip "People Affected" |
| `"25%"` | Scoring weight chip "Feasibility" (appears twice — two chips) |
| `"20%"` | Scoring weight chip "Cost Efficiency" |
| `"Deliverable 3 of 7"` | Header label |

**Note:** The top 3 interventions are computed at render time from `scored.slice(0,3)`. Do not hardcode intervention names — assert the structure (3 numbered items) rather than specific names, since scoring is deterministic but fragile to assert by name.

**3 minimum assertions:** `"$400K"`, `"10"`, `"Deliverable 3 of 7"`

---

### D4 — CostOfInstability

File: `deliverable-4-cost-of-instability.jsx`
Export: `CostOfInstability`

Values derived from constants + computed totals:

| Assert | Value | Source |
|---|---|---|
| `"$87"` | HUD bed-night | Cost basis footnotes section |
| `"$2,000"` | ER visit | costRows[2].basis text |
| `"$150"` | Law enforcement | costRows[3].basis text |
| `"$500,000"` | Pilot investment | Breakeven panel metric card |
| `"309"` | Quarterly housing rate | Breakeven panel metric card |
| `"28"` | Breakeven placements | `Math.ceil(500000/18080)` = 28; rendered as large number in breakeven panel |
| `"Deliverable 4 of 7"` | Header label | |

**Verify computed value:** `cyclingTotal` = 8700+600+4000+900+7800+320+600+2400 = **25,320**. `stableTotal` = 2610+150+500+0+1950+80+150+1800 = **7,240**. `savingsPerPerson` = **18,080**. `breakeven` = `Math.ceil(500000/18080)` = **28**.

**3 minimum assertions:** `"28"` (breakeven), `"309"` (quarterly rate), `"Deliverable 4 of 7"`

---

### D5 — UseOfFunds

File: `deliverable-5-use-of-funds.jsx`
Export: `UseOfFunds`

| Assert | Value | Source |
|---|---|---|
| `"$500,000"` | Total budget | MetricCard + budget verification row |
| `"$400,000"` | Operating budget | MetricCard |
| `"$100,000"` | Marketing | MetricCard |
| `"1,052"` | Projected people served | `totalReached` = 210+185+200+42+30+45+160+180 = 1052, rendered via `.toLocaleString()` |
| `"$500,000 ✓"` | Budget verification row | `Budget verification: $500,000 = $500,000 ✓` |
| `"Deliverable 5 of 7"` | Header label | |

**Note:** `"$500,000"` appears in multiple places. `getByText` will fail if ambiguous — use `getAllByText` or target by label context.

**3 minimum assertions:** `"$500,000"`, `"1,052"`, `"Deliverable 5 of 7"`

---

### D6 — KPI Framework (STUB)

File: not yet available.
Export: expected `KPIFramework` or similar.

When file arrives, assert:
- `"Deliverable 6 of 7"` renders
- `"20%"` (reachable bed baseline: 17/87)
- `"45"` (baseline days to housing)
- `"67%"` (CrossRoads confirmed next placement baseline)
- 10 KPI rows present in the table (assert count)

---

### D7 — Renewal Case (STUB)

File: not yet available.
Export: expected `RenewalCase` or similar.

When file arrives, assert:
- `"Deliverable 7 of 7"` renders
- `"$500K"` or `"$500,000"` investment figure
- 3 scenario lines in projection chart (assert 3 legend entries or 3 scenario labels)
- Before/after table rows present

---

## Package Requirements

```json
{
  "devDependencies": {
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jsdom": "^25.0.0"
  }
}
```

---

## Running Tests

```bash
npx vitest run
```

All tests should be runnable independently. No shared state between files.

---

## What This Strategy Does Not Cover

- Snapshot tests — fragile, don't add signal about data correctness
- Chart rendering — Recharts is mocked; chart pixels are not tested
- Interactive state (expandedRow toggle in D1, showMarketing toggle in D5) — out of scope
- Accessibility — out of scope for this pilot
- D6 and D7 — files not yet available; stubs above define the assertion targets
