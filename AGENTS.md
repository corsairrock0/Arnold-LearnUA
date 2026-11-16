# AGENTS.md — Learn Ukrainian (Lango) Project Instructions

## 1. Mandatory Reporting Standard (`docs/LANGO_REPORTING_STANDARD.md`)

All tasks in this repository follow the permanent reporting and persistence rules defined in:
- **`docs/LANGO_REPORTING_STANDARD.md`** (Authoritative Reporting Standard v1.0.0)
- **`reports/identify/REPORT_INDEX.md`** (Index of persisted Identify execution, audit, and recovery reports)
- **`reports/identify/LATEST_REPORT.txt`** (Copy of the latest persisted execution report)
- **`src/identifyVisualBatchProgress.json`** (Authoritative Identify visual batch checkpoint)

### Required Chat Output Format
Every final response for any execution, inspection, recovery, audit, implementation, validation, or batch-completion task **MUST** be returned inside **exactly ONE fenced Markdown code block** labeled `text`:

```text
LANGO — EXECUTION REPORT
==================================================
STATUS: COMPLETE / PARTIAL / BLOCKED
1. EXECUTION SUMMARY
...
2. CHANGES COMPLETED
...
3. FILES CREATED OR MODIFIED
...
4. VALIDATION RESULTS
...
5. PERSISTENT CHECKPOINT
...
6. REMAINING WORK
...
7. NEXT EXECUTION
...
```

- Do **not** output any text, explanations, or Markdown tables before or after the single `text` code block.
- Do **not** split the report into multiple code blocks.
- Do **not** output a raw JSON object as the entire report unless explicitly requested.

## 2. Persistent Report Archiving
- Save every Identify batch, audit, or recovery report as a separate plain-text file in `reports/identify/` without overwriting historical reports (use unique filenames if an execution or audit is repeated).
- After saving the new report file, update `reports/identify/REPORT_INDEX.md` and `reports/identify/LATEST_REPORT.txt`, and update the `reportingStandard` reference in `src/identifyVisualBatchProgress.json`.
- Never falsely advance a batch checkpoint; report interrupted or quota-blocked runs as `PARTIAL` or `BLOCKED`.

## 3. Session Recovery Note
Because Google AI Studio sessions do not automatically preload arbitrary repository markdown files unless referenced or read via tools, future prompts should explicitly reference `docs/LANGO_REPORTING_STANDARD.md` or `AGENTS.md`, and agents beginning a turn should read `docs/LANGO_REPORTING_STANDARD.md` and `src/identifyVisualBatchProgress.json`.
