## Task

I want to produce a testing strategy document and then generate test files for 7 React dashboard components so that a developer running CI can confirm each component renders correctly and displays the exact data values it is supposed to show.

First, read this file completely before responding:
- `DashboardbuildingPrompts.md` — contains the full specification for all 7 React deliverables, including exact numeric values each component must display

Then ask the user to provide the paths to the component files before proceeding further.

---

## Context Files

- `DashboardbuildingPrompts.md`: 7 dashboard component specs (Transition Bottleneck Dashboard, Youth Handoff Failure Analysis, Prioritization Model, Cost-of-Instability Analysis, Use-of-Funds Model, Pilot KPI Framework, Renewal Case). Each spec contains the exact numbers that must appear in the rendered output. These are the ground truth for all test assertions.

Additional constraints:
- All components are single-file React with Recharts for charts and Tailwind for styling
- Test environment is jsdom — Recharts must be mocked so chart components don't crash
- Scope: renders + key assertions only (component mounts without error + critical metric values are present in the DOM)
- Do not write tests for scenarios that can't happen. Do not add error-handling tests, edge cases, or validation for inputs that the component never receives.

---

## Reference

No direct references — infer from React Testing Library best practices.

What makes RTL tests work here:
- Test names describe what the user sees, not the implementation
- Assertions use `getByText`, `findByText`, or `getByRole` to confirm visible values
- Recharts is mocked at the module level so tests don't require SVG rendering
- Each test file is independently runnable

---

## Success Brief

- Output: `strategy.md` (testing strategy document), then pause for approval, then 7 `.test.tsx` files
- Format: Markdown strategy doc + TypeScript test files (Vitest + RTL)
- Audience + effect: Developer running CI — green suite confirms components display correct numbers
- Tone: Technical, precise, no filler; test names read like specifications
- Artifacts: `strategy.md` first; after approval, one `.test.tsx` per deliverable
- Success looks like: Every critical metric from `DashboardbuildingPrompts.md` has a corresponding assertion that would fail if the component displayed a wrong number

---

## Rules

1. **No gold-plating.** Tests cover renders + key metric assertions only. Do not add edge cases, loading states, or error boundaries that the component specs don't require.
2. **No explanatory comments.** Test names are the documentation. No multi-line comment blocks. One short inline comment only if a mock setup is non-obvious.
3. **Every assertion uses an exact number from the spec.** No approximations, no `toBeGreaterThan`, no vague matchers where the source data is precise. If `DashboardbuildingPrompts.md` says 736, the test asserts `736`.

Clarification: Claude should write `strategy.md` and stop. Do not generate test files until the user explicitly approves the strategy.

---

## Plan

1. Read `DashboardbuildingPrompts.md` and extract the key numeric values per deliverable (these become expected values in test assertions)
2. Ask the user for paths to the component files; read each one
3. Write `strategy.md`: framework choice (Vitest + RTL), Recharts mock setup, per-component coverage scope with the specific values to assert, and rationale for scope decisions
4. Stop and wait for user approval of the strategy
5. (After approval) Generate one `.test.tsx` per deliverable: mount check + ≥3 key metric assertions using exact numbers from the spec

---

## Conversation

- Task scoped to "all three in sequence" (strategy → plan → tests) but gated at strategy approval
- Success criterion: reviewer/judge can see data integrity is substantiated; developer gets a runnable suite
- Component files don't exist locally yet — prompt defers file reading until user provides paths explicitly
- Recharts mocked in jsdom (not Playwright/browser-based)
- No reference examples; RTL best practices are the implicit standard
- Scope is renders + key assertions — not full interaction testing, not smoke-only

---

## Alignment

- Out of scope: snapshot tests, interaction/event tests, accessibility audits, loading/error state tests
- Assumed: Vitest is the test runner; React Testing Library for DOM assertions
- Assumed: component files will be provided by the user before test generation begins
- The prompt halts after `strategy.md` — test file generation requires explicit user go-ahead
- All expected values in assertions must trace to a specific line in `DashboardbuildingPrompts.md`
