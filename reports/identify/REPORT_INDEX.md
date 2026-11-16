# Lango Identify — Persistent Execution Report Index

This file indexes all persisted plain-text execution, audit, and recovery reports stored under `reports/identify/` in accordance with [`docs/LANGO_REPORTING_STANDARD.md`](../../docs/LANGO_REPORTING_STANDARD.md).

## Latest Report Pointer

- **Latest Report File:** [`reports/identify/LATEST_REPORT.txt`](./LATEST_REPORT.txt)
- **Current Latest Source Report:** [`reports/identify/ux-restructure-phase-002.txt`](./ux-restructure-phase-002.txt)
- **Authoritative Batch Checkpoint:** [`src/identifyVisualBatchProgress.json`](../../src/identifyVisualBatchProgress.json)

---

## Persisted Reports Archive

| Order | Report File | Execution / Batch ID | Type | Status | Summary |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | [`batch-004-audit.txt`](./batch-004-audit.txt) | `batch-004-audit` | Semantic & Hotspot Audit | `COMPLETE` | Semantic integrity audit of Batch 4 (Scenes 21–26); replaced 6 compound phrases with single-word Ukrainian nouns and re-verified 108 candidate hotspots. |
| 2 | [`batch-005-audit.txt`](./batch-005-audit.txt) | `batch-005-audit` | Pre-Batch Vocabulary Audit | `COMPLETE` | Pre-Batch 5 vocabulary & source-identity audit across Scenes 27–36 (180 primary/secondary slots); 0 mismatches found. |
| 3 | [`batch-005-report.txt`](./batch-005-report.txt) | `batch-005` | Batch Execution | `COMPLETE` | Batch 5 visual generation & candidate hotspot placement for Scenes 27–36 (10 PNG assets, 180 candidate hotspots). |
| 4 | [`batch-006-report.txt`](./batch-006-report.txt) | `batch-006` | Batch Execution | `COMPLETE` | Batch 6 visual generation & candidate hotspot placement for Scenes 37–46 (10 PNG assets, 180 candidate hotspots). |
| 5 | [`recovery-report.txt`](./recovery-report.txt) | `recovery-report` | Read-Only Recovery Inspection | `COMPLETE` | Read-only inspection confirming all Batch 6 images (Scenes 37–46), 180 candidate hotspots, checkpoint state, and tests were completely saved to disk. |
| 6 | [`reporting-standard-setup-001.txt`](./reporting-standard-setup-001.txt) | `reporting-standard-setup-001` | Reporting Configuration | `COMPLETE` | Established permanent reporting format (`docs/LANGO_REPORTING_STANDARD.md`), `AGENTS.md`, `reports/identify/` archive, `LATEST_REPORT.txt`, and checkpoint metadata linkage. |
| 7 | [`unreviewed-scene-coherence-removal-001.txt`](./unreviewed-scene-coherence-removal-001.txt) | `unreviewed-scene-coherence-removal-001` | Coherence Audit & Scene Removal | `COMPLETE` | Inspected all 70 unreviewed scenes (#11–#80) for related objects; retained 57 coherent scenes (1,026 candidate hotspots) and removed 13 scenes (#51, #54, #55, #56, #70–#77, #79) containing 5–14 unrelated objects. |
| 8 | [`coherent-scene-approval-001.txt`](./coherent-scene-approval-001.txt) | `coherent-scene-approval-001` | Coherent Scene Approval & Publication | `COMPLETE` | Removed human hotspot review requirement; approved all 57 coherent preview-ready scenes (1,026 hotspots) alongside the 10 original scenes (49 hotspots) for 67 total Approved & Playable scenes (1,075 hotspots), while keeping the 13 incoherent scenes removed. |
| 9 | [`docker-port-4000-export-001.txt`](./docker-port-4000-export-001.txt) | `docker-port-4000-export-001` | Docker Export (Port 4000) | `COMPLETE` | Packaged full project as `public/downloads/lango-ukrainian-docker-port-4000.zip` with `Dockerfile`, `docker-compose.yml`, `.dockerignore`, and Windows Port 4000 instructions. |
| 10 | [`docker-port-4000-export-002.txt`](./docker-port-4000-export-002.txt) | `docker-port-4000-export-002` | Dynamic Chunked Docker .ZIP Exporter Fix | `COMPLETE` | Replaced static 72 MB file with dynamic on-demand PKZIP exporter (`src/dockerZipExporter.ts`, `16.27 MB` full / `7.55 MB` lightweight) + 4 MB chunked downloader modal to bypass Cloud Run's 32 MB limit and container restarts. |
| 11 | [`ui-ux-redesign-recovery-001.txt`](./ui-ux-redesign-recovery-001.txt) | `ui-ux-redesign-recovery-001` | Post-Restart Evaluation & Full UI/UX Redesign | `COMPLETE` | Evaluated post-restart state, completed end-to-end UI/UX redesign across `index.html`, `src/main.ts`, `src/identifyView.ts`, and `src/multilingual/multilingualSelectorView.ts`, and verified 0 errors across build, lint, 100 tests, and desktop/mobile Chromium. |
| 12 | [`vocabbuilder-ui-ux-redesign-001.txt`](./vocabbuilder-ui-ux-redesign-001.txt) | `vocabbuilder-ui-ux-redesign-001` | Post-Restart Validation & VocabBuilder Gold-Standard UI/UX Redesign | `COMPLETE` | Validated saved work after container restart, completed `corsairrock0/vocabbuilder` UI/UX redesign across `index.html`, `src/main.ts`, `src/identifyView.ts`, `src/morphologyAndPhonetics.ts`, and `src/multilingual/multilingualSelectorView.ts` (OKLCH tokens, `Lora` Cyrillic `.word` typography, 7-case `.case-head` bars, sidebar/mobile shell, Settings dialog, keyboard shortcuts), and verified 100/100 tests, build, lint, and desktop/mobile Chromium. |
| 13 | [`ux-restructure-phase-001.txt`](./ux-restructure-phase-001.txt) | `ux-restructure-phase-001` | UX Restructure Phase 1 of 6 (Tokens, Components & Shell) | `COMPLETE` | Established warm editorial OKLCH token system (Ukrainian blue + Lango crest gold + spacing/type/elevation/motion scales), reusable layout/component classes, zero inline styles in `index.html`, and restyled desktop/mobile shell & modals without changing behavior; verified 100/100 tests, build, lint, and 375px/1280px light & dark QA. |
| 14 | [`ux-restructure-phase-002.txt`](./ux-restructure-phase-002.txt) | `ux-restructure-phase-002` | UX Restructure Phase 2 of 6 (5-Destination IA, Hash Router, Today Home, Onboarding & Speak) | `COMPLETE` | Implemented 5-destination navigation (`Today`, `Learn`, `Review`, `Explore`, `Speak`), URL hash router with `switchTab()` compatibility, Today study home with SVG daily goal ring & section-level Continue hero, 3-step inline onboarding (`slovo_ua_onboarding_v1`), end-to-end AI Ukrainian Conversation Studio under `Speak`, and `"Word forms"` inspector rename; verified 100/100 tests, build, lint, and desktop/mobile light & dark Playwright QA. |

---

## Naming & Persistence Rules

1. **Never Overwrite Historical Reports:** Each new execution, audit, or recovery check must be written to a unique plain-text file (e.g., `batch-007-audit.txt`, `batch-007-report.txt`, `recovery-report-002.txt`).
2. **Update `LATEST_REPORT.txt` Last:** Update `reports/identify/LATEST_REPORT.txt` only after the new report file has been saved and verified on disk.
3. **Update This Index:** Append a new row to the table above and update the **Current Latest Source Report** pointer whenever a new report is persisted.
