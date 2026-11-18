---
name: e2e-coverage
description: End-to-end test coverage pipeline for a feature - plan, generate, review, heal - using the Playwright test agents.
argument-hint: <feature or area, e.g. "movie search">
disable-model-invocation: true
---

# E2E coverage: $ARGUMENTS

Run the Playwright test agents in sequence for the feature above. Run subagents one at a time, never in parallel
(they share one browser server and one database).

## 0. Preflight

- Read `BASE_URL` and `BASE_API` from `.env` and check both respond (`curl -s -o /dev/null -w "%{http_code}"`).
  If either is down, stop and tell the user to start the app.
- Derive a kebab-case slug from the feature, e.g. `movie-search`. Plan file: `specs/<slug>.plan.md`.

## 1. Plan

Call the `playwright-test-planner` subagent:

```
<plan>
  <task-text>Create a test plan for: $ARGUMENTS. Plan only scenarios not already covered in tests/TEST_PLAN.md and tests/e2e/.</task-text>
  <seed-file>tests/seed.spec.ts</seed-file>
  <plan-file>specs/<slug>.plan.md</plan-file>
</plan>
```

Then show the user the scenario list (number, title, one line each) and ask which to generate (default: all).
Wait for the answer.

## 2. Generate

For each chosen scenario, one after another, call the `playwright-test-generator` subagent:

```
<generate>
  <test-suite><!-- verbatim suite name from the plan, without ordinal --></test-suite>
  <test-name><!-- scenario name without ordinal --></test-name>
  <test-file>tests/e2e/<fs-friendly-scenario-name>.spec.ts</test-file>
  <seed-file>tests/seed.spec.ts</seed-file>
  <plan-file>specs/<slug>.plan.md</plan-file>
  <body><!-- scenario steps and expected results, verbatim from the plan --></body>
</generate>
```

## 3. Review

Call the `playwright-test-reviewer` subagent with the list of generated files and the plan path. Fix every P0 and P1
finding yourself (follow the `zombieplus-conventions` skill), then re-run the reviewer on the same files until it
returns no P0/P1 findings (max 2 rounds; report anything left).

## 4. Heal

Call the `playwright-test-healer` subagent:

```
<heal>Run these tests and fix the failing ones one after another: <generated files></heal>
```

If the healer changed any file, run the reviewer once more on those files and fix P0/P1 findings.

## 5. Report

Finish with one table: scenario | file | result (passing / `fixme` + reason / reported) | open reviewer findings.
List any app regressions the healer reported separately: those are bugs for a human, not test fixes.
Do not commit.
