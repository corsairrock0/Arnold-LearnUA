# LANGO — PERMANENT REPORTING FORMAT AND PERSISTENCE STANDARD

**Standard Version:** `1.0.0`
**Scope:** Entire Learn Ukrainian (Слово / Lango) project, including all Identify visual-generation batches, image/hotspot audits, vocabulary integrity repairs, curriculum development, application architecture, feature implementation, bug fixing, testing, compilation, recovery checks, and deployments.
**Authoritative Checkpoint:** `src/identifyVisualBatchProgress.json`
**Persistent Identify Reports Directory:** `reports/identify/`

---

## 1. Mandatory Single-Code-Block Copy-and-Paste Output Format

Every future execution, inspection, recovery, audit, implementation, validation, and batch-completion response returned in chat **MUST** appear inside **exactly ONE fenced Markdown code block** labeled `text` (` ```text ... ``` `).

### Required 7-Section Structure

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

### Formatting & Content Rules
1. **Single Block Only:** The entire assistant response must be one copyable `text` fenced code block. Do not split reports across multiple code blocks.
2. **Zero Text Outside the Block:** Do not place conversational introductions, explanations, or postscripts before or after the fenced code block.
3. **No Markdown Tables Outside the Block:** All structured data must live inside the single plain-text code block.
4. **No Decorative UI Components:** Use clean, scannable plain-text headers and bullet points.
5. **No Raw JSON Dumps as Entire Report:** Do not output a raw JSON object as the entire report unless explicitly requested by the user.
6. **Evidence-Based & Self-Contained:** Every count, file path, scene ID, hotspot count, and test result must be derived from actual saved source files and verified tool outputs.
7. **Concise Source-Derived Summaries for Large Batches:** Include all essential evidence, affected files, scene IDs, error details, and next steps without unnecessarily repeating hundreds of individual records when a verified source-derived summary suffices.

---

## 2. Persistent Project Rules & AI Studio Session Recovery

1. **Authoritative Standard File:** `docs/LANGO_REPORTING_STANDARD.md` stores the complete reporting specification.
2. **Root Agent Instructions:** `AGENTS.md` at the repository root references `docs/LANGO_REPORTING_STANDARD.md`, `reports/identify/REPORT_INDEX.md`, `reports/identify/LATEST_REPORT.txt`, and `src/identifyVisualBatchProgress.json`.
3. **Platform Limitation Disclosure:** Google AI Studio does not automatically preload arbitrary repository documentation files into a new session's system prompt unless inspected or referenced. Therefore:
   - Future prompts should explicitly reference `docs/LANGO_REPORTING_STANDARD.md` (or `AGENTS.md`).
   - At the start of any Lango or Identify task, the agent must inspect `docs/LANGO_REPORTING_STANDARD.md`, `src/identifyVisualBatchProgress.json`, and `reports/identify/LATEST_REPORT.txt`.

---

## 3. Persistent Execution Report Archive (`reports/identify/`)

All Identify execution, audit, and recovery reports must be saved as plain-text files in `reports/identify/` (and in appropriately named subdirectories under `reports/` for non-Identify Lango work).

### Naming Conventions
- **Batch execution reports:** `reports/identify/batch-005-report.txt`, `reports/identify/batch-006-report.txt`, etc.
- **Batch or semantic audits:** `reports/identify/batch-004-audit.txt`, `reports/identify/batch-005-audit.txt`, etc.
- **Recovery inspections:** `reports/identify/recovery-report.txt` (or `reports/identify/recovery-report-002.txt` if repeated).
- **Infrastructure / configuration reports:** `reports/identify/reporting-standard-setup-001.txt`, etc.
- **Latest report mirror:** `reports/identify/LATEST_REPORT.txt`
- **Master report index:** `reports/identify/REPORT_INDEX.md`

### Persistence & Non-Destructive Archiving Rules
1. **Never Overwrite Historical Reports:** Historical report files (`batch-005-report.txt`, `batch-006-report.txt`, `recovery-report.txt`, etc.) are immutable once written. If a batch, audit, or recovery check is re-run, create a new uniquely named file (e.g., `batch-006-report-r2.txt` or `recovery-report-002.txt`).
2. **Required Fields in Every Persisted Report:**
   - Batch number or execution identifier
   - Execution status (`COMPLETE`, `PARTIAL`, or `BLOCKED`)
   - Actual completed work
   - Files created or modified
   - Source-derived counts
   - Test and build validation results
   - Saved checkpoint state
   - Errors encountered (or `None`)
   - Remaining work
   - Exact next action
3. **Update Order:** Write the specific execution report file first, update `reports/identify/REPORT_INDEX.md`, and update `reports/identify/LATEST_REPORT.txt` **only after** the current report has been saved and verified.

---

## 4. Checkpoint Linking & Truthfulness Rules (`src/identifyVisualBatchProgress.json`)

1. **Authoritative Source of Truth:** `src/identifyVisualBatchProgress.json` and the actual image files on disk under `public/assets/identify/` remain authoritative for batch and scene progress.
2. **Non-Destructive Checkpoint Metadata:** `src/identifyVisualBatchProgress.json` preserves all existing fields (`manifestVersion`, `lastBatchNumber`, `protectedBaseline`, `cumulativeProgress`, `scenes`, `batch4SemanticAudit`, `batch5PreBatchAudit`) and includes a `reportingStandard` metadata block pointing to:
   - `standardVersion`: `"1.0.0"`
   - `standardDocPath`: `"docs/LANGO_REPORTING_STANDARD.md"`
   - `agentInstructionsPath`: `"AGENTS.md"`
   - `reportsDirectoryPath`: `"reports/identify"`
   - `reportIndexPath`: `"reports/identify/REPORT_INDEX.md"`
   - `latestReportPath`: `"reports/identify/LATEST_REPORT.txt"`
   - `lastPersistedReportFile`: path to the most recently saved report
3. **Strict Status Integrity:**
   - A report must **never** falsely advance `lastBatchNumber` or `batchesCompleted`.
   - Any canceled, interrupted, or quota-halted execution must be reported as `PARTIAL` or `BLOCKED`, never `COMPLETE`.
   - Learner-safety gating (`learnerExposureAllowed: false` and `hotspotReviewStatus: "needs_human_review"` on unverified candidate hotspots) must remain strictly enforced until human review is completed.
