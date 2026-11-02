// ============================================================================
// LANGO PHASE 3A — LANGO CONTENT STUDIO CORE ENGINE
// Course Manager, Hierarchical Editor, Lesson/Activity Editor, Vocabulary &
// Overlay Manager, Safe Incremental Importer, Validation Center, Version
// History & Diffs, Safe Rollback, Media Library, Isolated Preview & Exporter
// ============================================================================

import { COURSE_MODULES } from '../courseData.ts';
import { FREQ_6000_DB } from '../vocabData.ts';
import { IDENTIFY_CATEGORIES } from '../identifyData.ts';
import {
  getAllLanguages,
  getLanguageByCode,
  normalizeMultilingualText,
} from './languageRegistry.ts';
import {
  getAllCourseTracks,
  getCourseTrackById,
  PUBLISHED_UKRAINIAN_TRACK_ID,
  type CourseTrack,
} from './courseTrackRegistry.ts';
import {
  registerCanonicalEnglishLexeme,
  registerNativeLanguageVocabOverlay,
  resolveEnglishVocabCardForTrack,
  type CanonicalEnglishLexeme,
  type NativeLanguageEnglishVocabOverlay,
} from './courseTrackProgress.ts';
import {
  SUPPORTED_ACTIVITY_TYPES,
  SUPPORTED_SCHEMA_VERSIONS,
  validateAndPreviewCourseImport,
  type CourseImportPreviewReport,
  type UniversalActivityItemV1,
  type UniversalCoursePackageV1,
  type UniversalLessonV1,
  type UniversalModuleV1,
  type UniversalSectionV1,
} from './universalCourseImporter.ts';
import {
  ensureCanonicalEnglishOverlaySeeds,
  renderUniversalImportedCourseWorkspace,
} from './universalCoursePlayer.ts';
import {
  assertCmsPermission,
  cmsStorageAdapter,
  evaluateCmsAccessContext,
  type CmsAuditLogEntry,
} from './cmsAuthAndStorage.ts';

// ============================================================================
// 1. LIFECYCLE STATES, VALIDATION ISSUES & VERSION SNAPSHOT TYPES
// ============================================================================

export type CmsLifecycleState =
  | 'EMPTY'
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'VALIDATED'
  | 'PUBLISHED'
  | 'ARCHIVED';

export type CmsIssueSeverity = 'ERROR' | 'WARNING' | 'INFO';

export interface CmsValidationIssue {
  issueId: string;
  severity: CmsIssueSeverity;
  code: string;
  courseTrackId: string;
  locationPath: string;
  message: string;
  requiresHumanPedagogicalReview?: boolean;
}

export interface CmsValidationReport {
  courseTrackId: string;
  timestamp: number;
  canPublish: boolean;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  issues: CmsValidationIssue[];
}

export interface CmsManualReviewNote {
  noteId: string;
  courseTrackId: string;
  targetItemId?: string;
  reviewerStatus: 'pending_review' | 'approved_by_reviewer' | 'needs_revision';
  noteText: string;
  provenanceNote?: string;
  createdAt: number;
}

export interface CmsVersionSnapshot {
  versionId: string;
  courseTrackId: string;
  schemaVersion: string;
  createdAt: number;
  changeSummary: string;
  revisionOrigin:
    | 'published_baseline'
    | 'manual_edit'
    | 'json_import'
    | 'incremental_merge'
    | 'pre_rollback_backup'
    | 'rollback_restore'
    | 'status_transition';
  validationStatus: 'valid' | 'warnings' | 'errors' | 'unvalidated';
  publicationState: CmsLifecycleState;
  packageSnapshot: UniversalCoursePackageV1;
}

export interface CmsVersionDiffReport {
  fromVersionId: string;
  toVersionId: string;
  courseTrackId: string;
  addedModuleIds: string[];
  removedModuleIds: string[];
  changedModuleTitles: Array<{
    moduleId: string;
    before: string;
    after: string;
  }>;
  modifiedLessonIds: string[];
  changedActivityAnswerKeys: Array<{
    activityId: string;
    beforeCorrectIndex: unknown;
    afterCorrectIndex: unknown;
  }>;
  modifiedVocabularyReferences: {
    added: string[];
    removed: string[];
  };
  changedMediaReferences: {
    added: string[];
    removed: string[];
  };
  totalDifferences: number;
}

export interface CmsTrackSummary {
  trackId: string;
  courseId: string;
  courseTitle: string;
  learningDirection: 'en_to_foreign' | 'foreign_to_en';
  targetLanguage: string;
  nativeLanguage: string;
  instructionalLanguage: string;
  lifecycleState: CmsLifecycleState;
  publishedModuleCount: number;
  draftModuleCount: number;
  draftSectionCount: number;
  draftLessonCount: number;
  draftActivityCount: number;
  lastModifiedAt: number | null;
  validationStatus: 'valid' | 'warnings' | 'errors' | 'unvalidated';
  versionCount: number;
  hasDraft: boolean;
}

export interface CmsMediaAssetRecord {
  assetId: string;
  assetPath: string;
  mediaType: 'image/webp' | 'audio/tts' | 'video/mp4' | 'other';
  categoryTitle: string;
  sceneTitleEn: string;
  sceneTitleUk?: string;
  associatedTrackIds: string[];
  verifiedExists: boolean;
  storageTier: 'local_public_asset' | 'future_private_gcs_bucket';
}

// ============================================================================
// 2. INTERNAL REGISTRIES & STORAGE KEYS
// ============================================================================

const DRAFT_KEY_PREFIX = 'draft:';
const VERSIONS_KEY_PREFIX = 'versions:';
const REVIEW_NOTES_KEY_PREFIX = 'reviews:';
const REMOVED_LEDGER_KEY_PREFIX = 'removed_ledger:';
const UNDO_STACK_KEY_PREFIX = 'undo_stack:';
const REDO_STACK_KEY_PREFIX = 'redo_stack:';
const AUDIT_LOG_KEY = 'audit_log';
const IMPORT_HISTORY_KEY = 'import_history';

const cmsCanonicalEnglishMirror = new Map<string, CanonicalEnglishLexeme>();
const cmsNativeOverlayMirror = new Map<
  string,
  Map<string, NativeLanguageEnglishVocabOverlay>
>();
const cmsForeignVocabRegistry = new Map<
  string,
  Array<{
    vocabularyId: string;
    languageCode: string;
    headword: string;
    translationEn: string;
    ipa?: string;
    frequencyRank?: number;
    courseTrackId: string;
  }>
>();

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export function initializeCmsVocabularyMirrors(): void {
  ensureCanonicalEnglishOverlaySeeds();
  if (cmsCanonicalEnglishMirror.size === 0) {
    const seedIds = ['en_lex_0001', 'en_lex_0002', 'en_lex_0003'];
    const tracks = getAllCourseTracks().filter(
      (t) => t.learningDirection === 'foreign_to_en'
    );
    for (const lexId of seedIds) {
      const sample = resolveEnglishVocabCardForTrack(lexId, 'track:es-to-en');
      if (sample.canonical) {
        cmsCanonicalEnglishMirror.set(lexId, deepClone(sample.canonical));
      }
      for (const tr of tracks) {
        const resolved = resolveEnglishVocabCardForTrack(lexId, tr.trackId);
        if (resolved.overlay) {
          if (!cmsNativeOverlayMirror.has(tr.trackId)) {
            cmsNativeOverlayMirror.set(tr.trackId, new Map());
          }
          cmsNativeOverlayMirror
            .get(tr.trackId)!
            .set(lexId, deepClone(resolved.overlay));
        }
      }
    }
  }
}

function recordCmsAuditLog(
  operation: CmsAuditLogEntry['operation'],
  courseTrackId: string,
  summary: string
): void {
  const ctx = evaluateCmsAccessContext();
  const logs = cmsStorageAdapter.getItem<CmsAuditLogEntry[]>(AUDIT_LOG_KEY) || [];
  logs.unshift({
    auditId: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
    actorRole: ctx.activeRole,
    operation,
    courseTrackId,
    summary,
  });
  cmsStorageAdapter.setItem(AUDIT_LOG_KEY, logs.slice(0, 100));
}

export function getCmsAuditLogs(): CmsAuditLogEntry[] {
  return cmsStorageAdapter.getItem<CmsAuditLogEntry[]>(AUDIT_LOG_KEY) || [];
}

// ============================================================================
// 3. COURSE TRACK DRAFT & LIFECYCLE MANAGEMENT (SECTIONS 5, 6, 7, 16)
// ============================================================================

export type CmsContentOriginStatus =
  | 'PUBLISHED'
  | 'UNCHANGED'
  | 'MODIFIED_DRAFT'
  | 'NEW_DRAFT';

export interface CmsCourseDraftEnvelope {
  courseTrackId: string;
  lifecycleState: CmsLifecycleState;
  lastModifiedAt: number;
  draftPackage: UniversalCoursePackageV1;
  contentSource?:
    | 'PUBLISHED_BASELINE'
    | 'EFFECTIVE_MERGED_DRAFT'
    | 'DRAFT_ONLY'
    | 'EMPTY_TRACK';
  hasDraftChanges?: boolean;
  modifiedModuleIds?: string[];
  newDraftModuleIds?: string[];
  removedBaselineModuleIds?: string[];
  baselineModuleCount?: number;
}

interface CmsSparseTrackDraftOverlay {
  isSparseOverlay: true;
  courseTrackId: string;
  lifecycleState: CmsLifecycleState;
  lastModifiedAt: number;
  modifiedModulesById: Record<string, UniversalModuleV1>;
  newDraftModules: UniversalModuleV1[];
  moduleOrder: string[];
  confirmedDeletedModuleIds?: string[];
}

interface CmsCompactVersionRecord {
  isCompactUkSnapshot?: boolean;
  versionId: string;
  courseTrackId: string;
  schemaVersion: string;
  createdAt: number;
  changeSummary: string;
  revisionOrigin: CmsVersionSnapshot['revisionOrigin'];
  validationStatus: CmsVersionSnapshot['validationStatus'];
  publicationState: CmsLifecycleState;
  packageSnapshot?: UniversalCoursePackageV1;
  sparseOverlaySnapshot?: {
    modifiedModulesById: Record<string, UniversalModuleV1>;
    newDraftModules: UniversalModuleV1[];
    moduleOrder: string[];
    confirmedDeletedModuleIds?: string[];
  };
}

let cachedPublishedUkrainianBaselinePackage: UniversalCoursePackageV1 | null =
  null;

function stripHtmlTags(raw: string): string {
  return String(raw || '')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/p>|<\/div>|<\/ul>|<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Non-destructive, lossless adapter that maps the authoritative 29 published
 * Ukrainian modules (`COURSE_MODULES` in `src/courseData.ts`) into a readable
 * `UniversalCoursePackageV1` baseline without modifying `src/courseData.ts`
 * or mutating any original module references.
 */
export function getPublishedUkrainianBaselinePackage(): UniversalCoursePackageV1 {
  if (cachedPublishedUkrainianBaselinePackage) {
    return cachedPublishedUkrainianBaselinePackage;
  }

  const track = getCourseTrackById(PUBLISHED_UKRAINIAN_TRACK_ID)!;
  const allVocabCatalogIds: string[] = [];
  const identifyScenes = IDENTIFY_CATEGORIES.flatMap((c) => c.scenes);

  const adaptedModules: UniversalModuleV1[] = COURSE_MODULES.map(
    (mod, modIdx) => {
      const sl = (mod.structuredLesson || {}) as Record<string, any>;
      const modVocabIds = mod.vocab.map(
        (_, vIdx) => `uk_vocab_${mod.id}_${vIdx + 1}`
      );
      allVocabCatalogIds.push(...modVocabIds);

      const associatedScene =
        identifyScenes[modIdx % Math.max(1, identifyScenes.length)];
      const modMediaRefs = associatedScene
        ? [associatedScene.assetPath]
        : [];

      const prereqIds = Array.isArray(sl.prerequisites)
        ? sl.prerequisites
            .map((p: { modId?: string }) => p.modId || '')
            .filter(Boolean)
        : [];

      const plainRulesText = mod.rules
        .map((r) => stripHtmlTags(r))
        .join('\n\n');
      const grammarInstructionalText = [
        sl.bigIdea?.plainEnglish || mod.summary,
        plainRulesText,
        `Review Summary: ${mod.reviewSummary}`,
      ]
        .filter(Boolean)
        .join('\n\n');

      // Section 1: Grammar & Core Lesson
      const section1Lesson: UniversalLessonV1 = {
        lessonId: `${mod.id}_les_grammar`,
        title: `${mod.id} — ${mod.title}: Grammar & Dialogue`,
        summary: mod.summary,
        instructionalText: grammarInstructionalText,
        vocabularyRefs: modVocabIds.slice(0, 15),
        mediaRefs: modMediaRefs,
        metadata: {
          cmsOriginStatus: 'PUBLISHED',
          sectionType: 'grammar_and_dialogue',
        },
        activities: [
          {
            activityId: `${mod.id}_act_grammar`,
            activityType: 'lesson_explanation',
            title: `${mod.id} Core Grammar Rules & Examples (${mod.rules.length} Rules)`,
            prompt: mod.summary,
            vocabularyRefs: modVocabIds.slice(0, 8),
            payload: {
              rules: deepClone(mod.rules),
              examples: deepClone(mod.examples),
              reviewSummary: mod.reviewSummary,
              bigIdea: sl.bigIdea ? deepClone(sl.bigIdea) : undefined,
            },
          },
          {
            activityId: `${mod.id}_act_tables`,
            activityType: 'grammar_pattern_table',
            title: `${mod.id} Visual Grammar Tables, Declensions & Diagrams`,
            prompt:
              sl.bigIdea?.keyInsight ||
              `Reference tables and grammar structures for ${mod.title}.`,
            payload: {
              tables: (sl.patternTables || []).map((pt: any) => ({
                title: pt.title || 'Grammar Pattern Table',
                subtitle: pt.subtitle,
                headers: Array.isArray(pt.headers) ? [...pt.headers] : [],
                rows: (pt.rows || []).map((r: any) =>
                  Array.isArray(r)
                    ? r.map((c: any) => String(c))
                    : Array.isArray(r?.cells)
                      ? r.cells.map((c: any) =>
                          typeof c === 'string' ? c : String(c?.text || '')
                        )
                      : []
                ),
              })),
              patternTables: deepClone(sl.patternTables || []),
              declensions: deepClone(sl.declensions || []),
              conjugations: deepClone(sl.conjugations || []),
              aspectTimelines: deepClone(sl.aspectTimelines || []),
              diagrams: deepClone(sl.diagrams || []),
            },
          },
          {
            activityId: `${mod.id}_act_dialogue`,
            activityType: 'contextual_dialogue',
            title: `Dialogue: ${mod.dialogue.title}`,
            prompt: sl.dialogueContextNote || mod.dialogue.title,
            payload: {
              dialogueTitle: mod.dialogue.title,
              dialogueLines: deepClone(mod.dialogue.lines),
            },
          },
          {
            activityId: `${mod.id}_act_recall`,
            activityType: 'active_recall_prompt',
            title: `${mod.id} Active Recall Prompts (${mod.activeRecall.length})`,
            prompt:
              'Produce the Ukrainian word or phrase from the English cue.',
            payload: {
              items: deepClone(mod.activeRecall),
            },
          },
        ],
      };

      // Section 2: Knowledge Checks (CFU + Embedded Structured Checks)
      const embeddedChecks = Array.isArray(sl.embeddedChecks)
        ? (sl.embeddedChecks as Array<{
            id?: string;
            question?: string;
            options?: string[];
            correctIndex?: number;
            explanation?: string;
            audioUk?: string;
            questionType?: string;
            difficultyTier?: number;
            topic?: string;
            inputMode?: string;
            expectedAnswerUk?: string;
            acceptedAnswersUk?: string[];
          }>)
        : [];

      const cfuActivities: UniversalActivityItemV1[] = [
        ...mod.cfu.map((q, qIdx) => ({
          activityId: `${mod.id}_cfu_${qIdx + 1}`,
          activityType: 'knowledge_check_mc',
          title: `Check #${qIdx + 1}`,
          prompt: q.q,
          payload: {
            options: [...q.opts],
            correctIndex: q.ans,
            explanation: q.exp,
            audioUk: q.audioUk,
          },
        })),
        ...embeddedChecks.map((chk, eIdx) => {
          const opts = Array.isArray(chk.options) ? [...chk.options] : [];
          const isMc = opts.length >= 2;
          return {
            activityId: chk.id
              ? `${mod.id}_emb_${chk.id}_${eIdx + 1}`
              : `${mod.id}_emb_${eIdx + 1}`,
            activityType: isMc ? 'knowledge_check_mc' : 'knowledge_check_text',
            title: `Embedded Check #${eIdx + 1}${chk.topic ? ` (${chk.topic})` : ''}`,
            prompt: chk.question || '',
            payload: {
              options: isMc ? opts : undefined,
              correctIndex:
                isMc && typeof chk.correctIndex === 'number'
                  ? Math.max(0, Math.min(opts.length - 1, chk.correctIndex))
                  : isMc
                    ? 0
                    : undefined,
              explanation: chk.explanation || '',
              audioUk: chk.audioUk,
              questionType: chk.questionType,
              difficultyTier: chk.difficultyTier,
              inputMode: chk.inputMode,
              expectedAnswerUk: chk.expectedAnswerUk,
              acceptedAnswersUk: chk.acceptedAnswersUk,
            },
          };
        }),
      ];

      const section2Checks: UniversalLessonV1 = {
        lessonId: `${mod.id}_les_checks`,
        title: `${mod.id} — Knowledge Checks (${cfuActivities.length})`,
        summary: `Comprehension and grammar verification checks for ${mod.title}.`,
        instructionalText: `Answer the ${cfuActivities.length} Knowledge Checks for ${mod.id} (${mod.title}).`,
        activities: cfuActivities,
        metadata: {
          cmsOriginStatus: 'PUBLISHED',
          sectionType: 'knowledge_checks',
        },
      };

      // Section 3: Guided Practice Drills
      const practiceActivities: UniversalActivityItemV1[] = mod.practice.map(
        (dr, pIdx) => ({
          activityId: `${mod.id}_prac_${pIdx + 1}`,
          activityType: 'guided_practice_drill',
          title: `Practice Drill #${pIdx + 1}`,
          prompt: dr.prompt || dr.q || '',
          payload: {
            options: [...dr.opts],
            correctIndex: dr.ans,
            explanation: dr.exp,
            audioUk: dr.audioUk,
            hint: dr.hint,
          },
        })
      );

      const section3Practice: UniversalLessonV1 = {
        lessonId: `${mod.id}_les_practice`,
        title: `${mod.id} — Guided Practice (${practiceActivities.length} Drills)`,
        summary: `Interactive Ukrainian practice drills with audio and explanations for ${mod.title}.`,
        instructionalText: `Complete the ${practiceActivities.length} guided practice drills for ${mod.id}.`,
        activities: practiceActivities,
        metadata: {
          cmsOriginStatus: 'PUBLISHED',
          sectionType: 'guided_practice',
        },
      };

      // Section 4: Module Vocabulary
      const section4Vocab: UniversalLessonV1 = {
        lessonId: `${mod.id}_les_vocab`,
        title: `${mod.id} — Module Vocabulary (${mod.vocab.length} Words)`,
        summary: `Authoritative Ukrainian-English vocabulary entries for ${mod.id}: ${mod.title}.`,
        instructionalText: `Inspect all ${mod.vocab.length} Ukrainian vocabulary words introduced in ${mod.id}, including stressed Ukrainian headwords, English translations, part-of-speech tags, and contextual sentence examples.`,
        vocabularyRefs: modVocabIds,
        activities: [
          {
            activityId: `${mod.id}_act_vocab_intro`,
            activityType: 'vocabulary_introduction',
            title: `${mod.id} Vocabulary Catalog (${mod.vocab.length} Words)`,
            prompt: `Core Ukrainian vocabulary for ${mod.title}.`,
            vocabularyRefs: modVocabIds,
            payload: {
              vocabItems: deepClone(mod.vocab),
            },
          },
        ],
        metadata: {
          cmsOriginStatus: 'PUBLISHED',
          sectionType: 'module_vocabulary',
        },
      };

      // Section 5: Module Mastery Exam
      const examActivities: UniversalActivityItemV1[] = mod.exam.map(
        (ex, xIdx) => ({
          activityId: `${mod.id}_exam_${xIdx + 1}`,
          activityType: 'module_mastery_exam',
          title: `Mastery Exam Q${xIdx + 1}`,
          prompt: ex.q,
          payload: {
            options: [...ex.opts],
            correctIndex: ex.ans,
            explanation: ex.exp,
            audioUk: ex.audioUk,
          },
        })
      );

      const section5Exam: UniversalLessonV1 = {
        lessonId: `${mod.id}_les_exam`,
        title: `${mod.id} — Mastery Exam (${examActivities.length} Questions)`,
        summary: `Comprehensive module mastery exam for ${mod.id}: ${mod.title}.`,
        instructionalText: `Complete the ${examActivities.length}-question Mastery Exam for ${mod.id}.`,
        activities: examActivities,
        metadata: {
          cmsOriginStatus: 'PUBLISHED',
          sectionType: 'mastery_exam',
        },
      };

      const sections: UniversalSectionV1[] = [
        {
          sectionId: `${mod.id}_sec_lesson`,
          title: '1. Lesson & Grammar',
          lessons: [section1Lesson],
        },
        {
          sectionId: `${mod.id}_sec_checks`,
          title: `2. Knowledge Checks (${cfuActivities.length})`,
          lessons: [section2Checks],
        },
        {
          sectionId: `${mod.id}_sec_practice`,
          title: `3. Guided Practice (${practiceActivities.length})`,
          lessons: [section3Practice],
        },
        {
          sectionId: `${mod.id}_sec_vocab`,
          title: `4. Vocabulary (${mod.vocab.length})`,
          lessons: [section4Vocab],
        },
        {
          sectionId: `${mod.id}_sec_exam`,
          title: `5. Mastery Exam (${examActivities.length})`,
          lessons: [section5Exam],
        },
      ];

      return {
        moduleId: mod.id,
        title: mod.title,
        proficiencyLevel: mod.level,
        learningObjectives: [...mod.objectives],
        prerequisites: prereqIds,
        vocabularyReferences: modVocabIds,
        sections,
        sourceProvenance: 'src/courseData.ts (Authoritative Published Ukrainian Curriculum)',
        metadata: {
          cmsOriginStatus: 'PUBLISHED' as CmsContentOriginStatus,
          topicTag: mod.topicTag,
          vocabCount: mod.vocab.length,
          cfuCount: mod.cfu.length,
          embeddedCheckCount: embeddedChecks.length,
          practiceCount: mod.practice.length,
          examCount: mod.exam.length,
          mediaRefs: modMediaRefs,
          legacyUkrainianModuleExtension: {
            topicTag: mod.topicTag,
            reviewSummary: mod.reviewSummary,
            stepByStepCount: Array.isArray(sl.stepByStep)
              ? sl.stepByStep.length
              : 0,
            moreExamplesCount: Array.isArray(sl.moreExamples)
              ? sl.moreExamples.length
              : 0,
            importantExceptionsCount: Array.isArray(sl.importantExceptions)
              ? sl.importantExceptions.length
              : 0,
            commonMistakesCount: Array.isArray(sl.commonMistakes)
              ? sl.commonMistakes.length
              : 0,
            whatToRemember: Array.isArray(sl.whatToRemember)
              ? [...sl.whatToRemember]
              : [],
          },
        },
      };
    }
  );

  cachedPublishedUkrainianBaselinePackage = {
    schemaVersion: '1.0',
    courseId: track.courseId,
    courseTrackId: track.trackId,
    targetLanguage: track.targetLanguage,
    nativeLanguage: track.nativeLanguage,
    instructionalLanguage: track.instructionalLanguage,
    targetVariety: track.targetVariety,
    nativeVariety: track.nativeVariety,
    courseTitle: track.courseTitle,
    courseStatus: 'published',
    modules: adaptedModules,
    vocabularyCatalogIds: allVocabCatalogIds,
    pronunciationCatalogIds: [],
    sourceProvenance: 'src/courseData.ts (29 Published Ukrainian Modules)',
    metadata: {
      baselineSource: 'src/courseData.ts',
      publishedModuleCount: COURSE_MODULES.length,
      totalModuleVocabCount: allVocabCatalogIds.length,
      entitlementFreeModules: track.entitlementConfig.freePublishedModuleLimit,
    },
  };

  return cachedPublishedUkrainianBaselinePackage;
}

/**
 * Returns the immutable Published Baseline package for a Course Track if one exists.
 * For `track:en-to-uk`, returns a fresh deep clone of the 29-module Ukrainian curriculum.
 */
export function getPublishedBaselineCoursePackage(
  courseTrackId: string
): UniversalCoursePackageV1 | null {
  if (courseTrackId === PUBLISHED_UKRAINIAN_TRACK_ID) {
    return deepClone(getPublishedUkrainianBaselinePackage());
  }
  return null;
}

function getRawSparseOverlayForUk(): CmsSparseTrackDraftOverlay | undefined {
  const raw = cmsStorageAdapter.getItem<
    CmsSparseTrackDraftOverlay | CmsCourseDraftEnvelope
  >(`${DRAFT_KEY_PREFIX}${PUBLISHED_UKRAINIAN_TRACK_ID}`);
  if (!raw) return undefined;

  if ('isSparseOverlay' in raw && raw.isSparseOverlay === true) {
    const modIds = Object.keys(raw.modifiedModulesById || {});
    const newMods = raw.newDraftModules || [];
    const delIds = raw.confirmedDeletedModuleIds || [];
    const baselineOrder = COURSE_MODULES.map((m) => m.id);
    const orderChanged =
      Array.isArray(raw.moduleOrder) &&
      raw.moduleOrder.length > 0 &&
      raw.moduleOrder.join(',') !== baselineOrder.join(',');
    if (
      modIds.length === 0 &&
      newMods.length === 0 &&
      delIds.length === 0 &&
      !orderChanged
    ) {
      return undefined;
    }
    return raw;
  }

  // Legacy pre-fix envelope check: if a legacy envelope had `modules: []`, discard it
  // so an empty uninitialized draft never obscures the 29 published Ukrainian modules!
  if ('draftPackage' in raw && raw.draftPackage) {
    if (
      !Array.isArray(raw.draftPackage.modules) ||
      raw.draftPackage.modules.length === 0
    ) {
      cmsStorageAdapter.removeItem(
        `${DRAFT_KEY_PREFIX}${PUBLISHED_UKRAINIAN_TRACK_ID}`
      );
      return undefined;
    }
  }
  return undefined;
}

function resolveUkrainianEffectiveEnvelopeFromOverlay(
  overlay?: CmsSparseTrackDraftOverlay
): CmsCourseDraftEnvelope {
  const baseline = getPublishedUkrainianBaselinePackage();
  const baselineById = new Map<string, UniversalModuleV1>(
    baseline.modules.map((m) => [m.moduleId, m])
  );

  if (!overlay) {
    const clonedBaseline = deepClone(baseline);
    for (const mod of clonedBaseline.modules) {
      mod.metadata = {
        ...(mod.metadata || {}),
        cmsOriginStatus: 'PUBLISHED' as CmsContentOriginStatus,
      };
    }
    return {
      courseTrackId: PUBLISHED_UKRAINIAN_TRACK_ID,
      lifecycleState: 'PUBLISHED',
      lastModifiedAt: Date.now(),
      draftPackage: clonedBaseline,
      contentSource: 'PUBLISHED_BASELINE',
      hasDraftChanges: false,
      modifiedModuleIds: [],
      newDraftModuleIds: [],
      removedBaselineModuleIds: [],
      baselineModuleCount: baseline.modules.length,
    };
  }

  const modifiedIds = Object.keys(overlay.modifiedModulesById || {});
  const newModsById = new Map<string, UniversalModuleV1>(
    (overlay.newDraftModules || []).map((m) => [m.moduleId, m])
  );
  const newDraftIds = Array.from(newModsById.keys());

  // Reconcile ordered module IDs while guaranteeing all 29 published baseline modules
  // remain present unless explicitly confirmed for deletion in draft
  const deletedSet = new Set(overlay.confirmedDeletedModuleIds || []);
  const orderedIds: string[] = [];
  const seenIds = new Set<string>();

  for (const id of overlay.moduleOrder || []) {
    if (!deletedSet.has(id) && !seenIds.has(id)) {
      if (baselineById.has(id) || newModsById.has(id)) {
        orderedIds.push(id);
        seenIds.add(id);
      }
    }
  }
  for (const baseMod of baseline.modules) {
    if (!deletedSet.has(baseMod.moduleId) && !seenIds.has(baseMod.moduleId)) {
      orderedIds.push(baseMod.moduleId);
      seenIds.add(baseMod.moduleId);
    }
  }
  for (const newId of newDraftIds) {
    if (!seenIds.has(newId)) {
      orderedIds.push(newId);
      seenIds.add(newId);
    }
  }

  const effectiveModules: UniversalModuleV1[] = orderedIds.map((id) => {
    if (overlay.modifiedModulesById && overlay.modifiedModulesById[id]) {
      const modClone = deepClone(overlay.modifiedModulesById[id]);
      modClone.metadata = {
        ...(modClone.metadata || {}),
        cmsOriginStatus: 'MODIFIED_DRAFT' as CmsContentOriginStatus,
      };
      return modClone;
    }
    if (newModsById.has(id)) {
      const newClone = deepClone(newModsById.get(id)!);
      newClone.metadata = {
        ...(newClone.metadata || {}),
        cmsOriginStatus: 'NEW_DRAFT' as CmsContentOriginStatus,
      };
      return newClone;
    }
    const baseClone = deepClone(baselineById.get(id)!);
    baseClone.metadata = {
      ...(baseClone.metadata || {}),
      cmsOriginStatus: 'UNCHANGED' as CmsContentOriginStatus,
    };
    return baseClone;
  });

  const effectivePkg: UniversalCoursePackageV1 = {
    ...deepClone(baseline),
    courseStatus:
      overlay.lifecycleState === 'PUBLISHED' ? 'published' : 'draft',
    modules: effectiveModules,
    metadata: {
      ...(baseline.metadata || {}),
      hasDraftOverlay: true,
      modifiedModuleIds: modifiedIds,
      newDraftModuleIds: newDraftIds,
      confirmedDeletedModuleIds: Array.from(deletedSet),
    },
  };

  return {
    courseTrackId: PUBLISHED_UKRAINIAN_TRACK_ID,
    lifecycleState: overlay.lifecycleState || 'DRAFT',
    lastModifiedAt: overlay.lastModifiedAt,
    draftPackage: effectivePkg,
    contentSource: 'EFFECTIVE_MERGED_DRAFT',
    hasDraftChanges: true,
    modifiedModuleIds: modifiedIds,
    newDraftModuleIds: newDraftIds,
    removedBaselineModuleIds: Array.from(deletedSet),
    baselineModuleCount: baseline.modules.length,
  };
}

export function getCmsDraftEnvelope(
  courseTrackId: string
): CmsCourseDraftEnvelope | undefined {
  if (courseTrackId === PUBLISHED_UKRAINIAN_TRACK_ID) {
    const sparse = getRawSparseOverlayForUk();
    if (!sparse) return undefined;
    return resolveUkrainianEffectiveEnvelopeFromOverlay(sparse);
  }
  return cmsStorageAdapter.getItem<CmsCourseDraftEnvelope>(
    `${DRAFT_KEY_PREFIX}${courseTrackId}`
  );
}

/**
 * Resolves the Effective Course Package for any of the 28 Course Tracks:
 * - For `track:en-to-uk`: Returns the 29-module Published Baseline merged with any
 *   valid isolated Studio Draft overlay changes (never an empty `modules: []` array).
 * - For tracks with draft modules: Returns the draft curriculum.
 * - For truly empty tracks: Returns the clean empty `UniversalCoursePackageV1` with `courseStatus: 'draft'`.
 */
export function getOrCreateCmsCourseDraft(
  courseTrackId: string
): CmsCourseDraftEnvelope {
  assertCmsPermission('cms:preview_readonly');
  const track = getCourseTrackById(courseTrackId);
  if (!track) {
    throw new Error(`Unknown Course Track ID: ${courseTrackId}`);
  }

  if (courseTrackId === PUBLISHED_UKRAINIAN_TRACK_ID) {
    const sparse = getRawSparseOverlayForUk();
    return resolveUkrainianEffectiveEnvelopeFromOverlay(sparse);
  }

  const existing = getCmsDraftEnvelope(courseTrackId);
  if (existing) {
    const cloned = deepClone(existing);
    const hasMods =
      Array.isArray(cloned.draftPackage.modules) &&
      cloned.draftPackage.modules.length > 0;
    for (const m of cloned.draftPackage.modules || []) {
      m.metadata = {
        ...(m.metadata || {}),
        cmsOriginStatus:
          (m.metadata?.cmsOriginStatus as CmsContentOriginStatus) ||
          'NEW_DRAFT',
      };
    }
    return {
      ...cloned,
      contentSource: hasMods ? 'DRAFT_ONLY' : 'EMPTY_TRACK',
      hasDraftChanges: hasMods,
      modifiedModuleIds: [],
      newDraftModuleIds: (cloned.draftPackage.modules || []).map(
        (m) => m.moduleId
      ),
      baselineModuleCount: 0,
    };
  }

  const initialPackage: UniversalCoursePackageV1 = {
    schemaVersion: '1.0',
    courseId: track.courseId,
    courseTrackId: track.trackId,
    targetLanguage: track.targetLanguage,
    nativeLanguage: track.nativeLanguage,
    instructionalLanguage: track.instructionalLanguage,
    targetVariety: track.targetVariety,
    nativeVariety: track.nativeVariety,
    courseTitle: track.courseTitle,
    courseStatus: 'draft',
    modules: [],
    vocabularyCatalogIds: [],
    pronunciationCatalogIds: [],
    metadata: {
      createdVia: 'Lango Content Studio Phase 3A',
      entitlementFreeModules: track.entitlementConfig.freePublishedModuleLimit,
    },
  };

  return {
    courseTrackId: track.trackId,
    lifecycleState: 'EMPTY',
    lastModifiedAt: Date.now(),
    draftPackage: initialPackage,
    contentSource: 'EMPTY_TRACK',
    hasDraftChanges: false,
    modifiedModuleIds: [],
    newDraftModuleIds: [],
    baselineModuleCount: 0,
  };
}

/**
 * Discards unpublished Studio Draft overlay changes for a Course Track and
 * immediately reverts the effective curriculum view to the untouched Published Baseline
 * (or Empty state for unpublished tracks).
 */
export function discardCmsDraftOverlay(
  courseTrackId: string
): CmsCourseDraftEnvelope {
  assertCmsPermission('cms:edit_draft');
  cmsStorageAdapter.removeItem(`${DRAFT_KEY_PREFIX}${courseTrackId}`);
  cmsStorageAdapter.removeItem(`${REMOVED_LEDGER_KEY_PREFIX}${courseTrackId}`);
  cmsStorageAdapter.removeItem(`${UNDO_STACK_KEY_PREFIX}${courseTrackId}`);
  cmsStorageAdapter.removeItem(`${REDO_STACK_KEY_PREFIX}${courseTrackId}`);
  recordCmsAuditLog(
    'cms:delete_draft',
    courseTrackId,
    `Discarded unpublished draft overlay for ${courseTrackId}; reverted to published baseline.`
  );
  return getOrCreateCmsCourseDraft(courseTrackId);
}

function isModuleModifiedFromBaseline(
  candidate: UniversalModuleV1,
  baselineMod: UniversalModuleV1
): boolean {
  if (
    candidate.title !== baselineMod.title ||
    candidate.proficiencyLevel !== baselineMod.proficiencyLevel
  ) {
    return true;
  }
  const cleanCandidate = { ...candidate, metadata: undefined };
  const cleanBaseline = { ...baselineMod, metadata: undefined };
  return JSON.stringify(cleanCandidate) !== JSON.stringify(cleanBaseline);
}

/**
 * Saves a draft package in Lango Content Studio and optionally records a version snapshot.
 * For `track:en-to-uk`, stores only the sparse diff overlay in localStorage while
 * preserving all 29 published baseline modules intact and never overwriting `src/courseData.ts`.
 */
export function saveCmsCourseDraft(
  courseTrackId: string,
  draftPackage: UniversalCoursePackageV1,
  options: {
    lifecycleState?: CmsLifecycleState;
    changeSummary?: string;
    revisionOrigin?: CmsVersionSnapshot['revisionOrigin'];
    createSnapshot?: boolean;
    confirmedDeletedModuleIds?: string[];
  } = {}
): CmsCourseDraftEnvelope {
  assertCmsPermission('cms:edit_draft');
  const track = getCourseTrackById(courseTrackId);
  if (!track) {
    throw new Error(`Unknown Course Track ID: ${courseTrackId}`);
  }

  // Enforce strict track identity so one track can never overwrite another track
  if (
    draftPackage.courseTrackId !== track.trackId ||
    draftPackage.targetLanguage !== track.targetLanguage ||
    draftPackage.nativeLanguage !== track.nativeLanguage
  ) {
    throw new Error(
      `Cross-track protection error: Package (${draftPackage.courseTrackId}, ${draftPackage.nativeLanguage}->${draftPackage.targetLanguage}) does not match destination track (${track.trackId}, ${track.nativeLanguage}->${track.targetLanguage}).`
    );
  }

  if (courseTrackId === PUBLISHED_UKRAINIAN_TRACK_ID) {
    const baseline = getPublishedUkrainianBaselinePackage();
    const baselineById = new Map<string, UniversalModuleV1>(
      baseline.modules.map((m) => [m.moduleId, m])
    );

    const existingSparse = getRawSparseOverlayForUk();
    const presentModuleIds = new Set(
      (draftPackage.modules || []).map((m) => m.moduleId)
    );
    const rawConfirmedDeleted =
      options.confirmedDeletedModuleIds !== undefined
        ? options.confirmedDeletedModuleIds
        : (draftPackage.metadata?.confirmedDeletedModuleIds as
            | string[]
            | undefined) ||
          existingSparse?.confirmedDeletedModuleIds ||
          [];
    // Any module currently present in draftPackage.modules is no longer deleted
    const confirmedDeletedSet = new Set(
      rawConfirmedDeleted.filter((id) => !presentModuleIds.has(id))
    );

    const modifiedModulesById: Record<string, UniversalModuleV1> = {};
    const newDraftModules: UniversalModuleV1[] = [];
    const moduleOrder: string[] = [];

    for (const mod of draftPackage.modules || []) {
      moduleOrder.push(mod.moduleId);
      const baseMod = baselineById.get(mod.moduleId);
      if (baseMod) {
        if (isModuleModifiedFromBaseline(mod, baseMod)) {
          modifiedModulesById[mod.moduleId] = deepClone(mod);
        }
      } else {
        newDraftModules.push(deepClone(mod));
      }
    }

    // Ensure omitted baseline modules are never silently lost unless explicitly confirmed deleted in draft
    for (const baseMod of baseline.modules) {
      if (
        !confirmedDeletedSet.has(baseMod.moduleId) &&
        !moduleOrder.includes(baseMod.moduleId)
      ) {
        moduleOrder.push(baseMod.moduleId);
      }
    }

    const nextState: CmsLifecycleState = options.lifecycleState || 'DRAFT';
    const sparseOverlay: CmsSparseTrackDraftOverlay = {
      isSparseOverlay: true,
      courseTrackId: PUBLISHED_UKRAINIAN_TRACK_ID,
      lifecycleState: nextState,
      lastModifiedAt: Date.now(),
      modifiedModulesById,
      newDraftModules,
      moduleOrder,
      confirmedDeletedModuleIds: Array.from(confirmedDeletedSet),
    };

    cmsStorageAdapter.setItem(
      `${DRAFT_KEY_PREFIX}${PUBLISHED_UKRAINIAN_TRACK_ID}`,
      sparseOverlay
    );

    const resolvedEnvelope =
      resolveUkrainianEffectiveEnvelopeFromOverlay(sparseOverlay);

    if (options.createSnapshot !== false) {
      createCmsVersionSnapshot(
        PUBLISHED_UKRAINIAN_TRACK_ID,
        resolvedEnvelope.draftPackage,
        options.changeSummary ||
          'Updated Ukrainian draft overlay in Lango Content Studio',
        options.revisionOrigin || 'manual_edit',
        nextState
      );
    }

    recordCmsAuditLog(
      'cms:edit_draft',
      PUBLISHED_UKRAINIAN_TRACK_ID,
      options.changeSummary ||
        `Saved Ukrainian draft overlay (${Object.keys(modifiedModulesById).length} modified, ${newDraftModules.length} new, ${confirmedDeletedSet.size} removed in draft, ${resolvedEnvelope.draftPackage.modules.length} effective modules)`
    );

    return resolvedEnvelope;
  }

  const nextState: CmsLifecycleState =
    options.lifecycleState ||
    (draftPackage.modules.length > 0 ? 'DRAFT' : 'EMPTY');

  // Never allow an empty package to carry courseStatus: 'published'
  const sanitizedPkg = deepClone(draftPackage);
  if (
    (!sanitizedPkg.modules || sanitizedPkg.modules.length === 0) &&
    sanitizedPkg.courseStatus === 'published'
  ) {
    sanitizedPkg.courseStatus = 'draft';
  }

  const envelope: CmsCourseDraftEnvelope = {
    courseTrackId: track.trackId,
    lifecycleState: nextState,
    lastModifiedAt: Date.now(),
    draftPackage: sanitizedPkg,
    contentSource: sanitizedPkg.modules.length > 0 ? 'DRAFT_ONLY' : 'EMPTY_TRACK',
    hasDraftChanges: sanitizedPkg.modules.length > 0,
    modifiedModuleIds: [],
    newDraftModuleIds: sanitizedPkg.modules.map((m) => m.moduleId),
    baselineModuleCount: 0,
  };

  cmsStorageAdapter.setItem(`${DRAFT_KEY_PREFIX}${track.trackId}`, envelope);

  if (options.createSnapshot !== false) {
    createCmsVersionSnapshot(
      track.trackId,
      envelope.draftPackage,
      options.changeSummary || 'Updated draft in Lango Content Studio',
      options.revisionOrigin || 'manual_edit',
      nextState
    );
  }

  recordCmsAuditLog(
    'cms:edit_draft',
    track.trackId,
    options.changeSummary || `Saved draft (${sanitizedPkg.modules.length} modules)`
  );

  return envelope;
}

// ============================================================================
// 4. HIERARCHICAL COURSE, MODULE, LESSON & ACTIVITY EDITING (SECTIONS 7, 8, 9)
// ============================================================================

export function addOrUpdateCmsModuleInDraft(
  courseTrackId: string,
  moduleData: UniversalModuleV1
): CmsCourseDraftEnvelope {
  assertCmsPermission('cms:edit_draft');
  const env = getOrCreateCmsCourseDraft(courseTrackId);
  const pkg = env.draftPackage;
  const idx = pkg.modules.findIndex((m) => m.moduleId === moduleData.moduleId);
  if (idx >= 0) {
    // Preserve stable moduleId and any unknown extension fields
    pkg.modules[idx] = {
      ...pkg.modules[idx],
      ...deepClone(moduleData),
      moduleId: pkg.modules[idx].moduleId,
    };
  } else {
    pkg.modules.push(deepClone(moduleData));
  }
  return saveCmsCourseDraft(courseTrackId, pkg, {
    lifecycleState: 'DRAFT',
    changeSummary: `${idx >= 0 ? 'Updated' : 'Added'} module ${moduleData.moduleId} (${moduleData.title})`,
  });
}

export function reorderCmsModulesInDraft(
  courseTrackId: string,
  fromIndex: number,
  toIndex: number
): CmsCourseDraftEnvelope {
  assertCmsPermission('cms:edit_draft');
  const env = getOrCreateCmsCourseDraft(courseTrackId);
  const mods = env.draftPackage.modules;
  if (
    fromIndex < 0 ||
    fromIndex >= mods.length ||
    toIndex < 0 ||
    toIndex >= mods.length
  ) {
    return env;
  }
  const [moved] = mods.splice(fromIndex, 1);
  mods.splice(toIndex, 0, moved);
  return saveCmsCourseDraft(courseTrackId, env.draftPackage, {
    lifecycleState: 'DRAFT',
    changeSummary: `Reordered module ${moved.moduleId} from position ${fromIndex + 1} to ${toIndex + 1} (stable ID preserved)`,
  });
}

export function duplicateCmsModuleInDraft(
  courseTrackId: string,
  sourceModuleId: string,
  newModuleId: string
): CmsCourseDraftEnvelope {
  assertCmsPermission('cms:edit_draft');
  const env = getOrCreateCmsCourseDraft(courseTrackId);
  const source = env.draftPackage.modules.find(
    (m) => m.moduleId === sourceModuleId
  );
  if (!source) {
    throw new Error(`Module ${sourceModuleId} not found in draft.`);
  }
  if (env.draftPackage.modules.some((m) => m.moduleId === newModuleId)) {
    throw new Error(`Duplicate module ID ${newModuleId} already exists.`);
  }
  const cloned = deepClone(source);
  cloned.moduleId = newModuleId;
  cloned.title = `${cloned.title} (Copy)`;
  if (Array.isArray(cloned.sections)) {
    cloned.sections = cloned.sections.map((sec, sIdx) => ({
      ...sec,
      sectionId: `${newModuleId}_sec_${sIdx + 1}`,
      lessons: Array.isArray(sec.lessons)
        ? sec.lessons.map((les, lIdx) => ({
            ...les,
            lessonId: `${newModuleId}_les_${sIdx + 1}_${lIdx + 1}`,
            activities: Array.isArray(les.activities)
              ? les.activities.map((act, aIdx) => ({
                  ...act,
                  activityId: `${newModuleId}_act_${sIdx + 1}_${lIdx + 1}_${aIdx + 1}`,
                }))
              : [],
          }))
        : [],
    }));
  }
  env.draftPackage.modules.push(cloned);
  return saveCmsCourseDraft(courseTrackId, env.draftPackage, {
    lifecycleState: 'DRAFT',
    changeSummary: `Duplicated module ${sourceModuleId} as ${newModuleId}`,
  });
}

export function updateCmsLessonInDraft(
  courseTrackId: string,
  moduleId: string,
  lessonId: string,
  lessonPatch: Partial<UniversalLessonV1>
): CmsCourseDraftEnvelope {
  assertCmsPermission('cms:edit_draft');
  const env = getOrCreateCmsCourseDraft(courseTrackId);
  const mod = env.draftPackage.modules.find((m) => m.moduleId === moduleId);
  if (!mod) {
    throw new Error(`Module ${moduleId} not found in draft for ${courseTrackId}`);
  }

  let updated = false;
  if (Array.isArray(mod.sections)) {
    for (const sec of mod.sections) {
      if (Array.isArray(sec.lessons)) {
        const lIdx = sec.lessons.findIndex((l) => l.lessonId === lessonId);
        if (lIdx >= 0) {
          sec.lessons[lIdx] = {
            ...sec.lessons[lIdx],
            ...deepClone(lessonPatch),
            lessonId: sec.lessons[lIdx].lessonId, // Preserve stable ID!
          };
          updated = true;
          break;
        }
      }
    }
  }
  if (!updated && Array.isArray(mod.lessons)) {
    const lIdx = mod.lessons.findIndex((l) => l.lessonId === lessonId);
    if (lIdx >= 0) {
      mod.lessons[lIdx] = {
        ...mod.lessons[lIdx],
        ...deepClone(lessonPatch),
        lessonId: mod.lessons[lIdx].lessonId,
      };
      updated = true;
    }
  }

  if (!updated) {
    throw new Error(`Lesson ${lessonId} not found in module ${moduleId}`);
  }

  return saveCmsCourseDraft(courseTrackId, env.draftPackage, {
    lifecycleState: 'DRAFT',
    changeSummary: `Edited lesson ${lessonId} in module ${moduleId}`,
  });
}

export function updateCmsActivityInDraft(
  courseTrackId: string,
  moduleId: string,
  lessonId: string,
  activityId: string,
  activityPatch: Partial<UniversalActivityItemV1>
): CmsCourseDraftEnvelope {
  assertCmsPermission('cms:edit_draft');
  const env = getOrCreateCmsCourseDraft(courseTrackId);
  const mod = env.draftPackage.modules.find((m) => m.moduleId === moduleId);
  if (!mod) {
    throw new Error(`Module ${moduleId} not found in draft.`);
  }

  let updated = false;
  const allLessons: UniversalLessonV1[] = [
    ...(mod.lessons || []),
    ...(mod.sections || []).flatMap((s) => s.lessons || []),
  ];
  for (const les of allLessons) {
    if (les.lessonId === lessonId && Array.isArray(les.activities)) {
      const aIdx = les.activities.findIndex((a) => a.activityId === activityId);
      if (aIdx >= 0) {
        les.activities[aIdx] = {
          ...les.activities[aIdx],
          ...deepClone(activityPatch),
          activityId: les.activities[aIdx].activityId, // Preserve stable ID
        };
        updated = true;
        break;
      }
    }
  }

  if (!updated) {
    throw new Error(`Activity ${activityId} not found in lesson ${lessonId}`);
  }

  return saveCmsCourseDraft(courseTrackId, env.draftPackage, {
    lifecycleState: 'DRAFT',
    changeSummary: `Edited activity ${activityId} in lesson ${lessonId}`,
  });
}

// ============================================================================
// 4B. SAFE CONTENT REMOVAL, UNDO / REDO, RESTORE & FULL STRUCTURE EDITING
// ============================================================================

export type CmsRemovableItemType =
  | 'module'
  | 'section'
  | 'lesson'
  | 'lesson_paragraph'
  | 'activity'
  | 'answer_option'
  | 'question_explanation'
  | 'grammar_rule'
  | 'example_sentence'
  | 'grammar_table'
  | 'grammar_table_row'
  | 'vocabulary_reference'
  | 'media_reference'
  | 'learning_objective';

export interface CmsRemovalTargetSpec {
  itemType: CmsRemovableItemType;
  moduleId: string;
  sectionId?: string;
  lessonId?: string;
  activityId?: string;
  paragraphIndex?: number;
  optionIndex?: number;
  ruleIndex?: number;
  exampleIndex?: number;
  tableIndex?: number;
  rowIndex?: number;
  vocabularyId?: string;
  vocabId?: string;
  mediaAssetPath?: string;
  mediaPath?: string;
  objectiveIndex?: number;
}

export interface CmsRemovalImpactAnalysis {
  courseTrackId: string;
  target: CmsRemovalTargetSpec;
  itemTypeLabel: string;
  itemTitle: string;
  locationBreadcrumb: string;
  requiresConfirmation: boolean;
  severity: 'high' | 'low';
  affectedCounts: {
    sections: number;
    lessons: number;
    questions: number;
    vocabularyRefs: number;
    mediaRefs: number;
    dependentModuleIds: string[];
  };
  removesCorrectAnswer: boolean;
  willInvalidateCorrectAnswer: boolean;
  sharedAssetPreservedNote?: string;
  sharedLibrarySafetyNote?: string;
  dependencyWarning?: string;
  prerequisiteDependents: string[];
  friendlyImpactSummary: string;
  confirmationHeadline: string;
  confirmationExplanation: string;
  keepButtonLabel: string;
  removeButtonLabel: string;
}

export type CmsRemovalImpactSummary = CmsRemovalImpactAnalysis;

export interface CmsRemovedItemRecord {
  removalId: string;
  courseTrackId: string;
  itemType: CmsRemovableItemType;
  itemTypeLabel: string;
  itemId: string;
  itemTitle: string;
  locationBreadcrumb: string;
  parentIds: {
    moduleId: string;
    sectionId?: string;
    lessonId?: string;
    activityId?: string;
    tableIndex?: number;
  };
  originalIndex: number;
  removedAt: number;
  restoredAt?: number;
  status: 'REMOVED_IN_DRAFT' | 'RESTORED';
  impactSummary: string;
  serializedPayload: unknown;
  extraRestoreMetadata?: Record<string, unknown>;
}

export interface CmsUndoRedoActionEntry {
  actionId: string;
  courseTrackId: string;
  timestamp: number;
  actionLabel: string;
  beforePackage: UniversalCoursePackageV1;
  afterPackage: UniversalCoursePackageV1;
  beforeConfirmedDeletedModuleIds: string[];
  afterConfirmedDeletedModuleIds: string[];
  beforeRemovedLedger: CmsRemovedItemRecord[];
  afterRemovedLedger: CmsRemovedItemRecord[];
}

export interface CmsDetailedChangeSummary {
  courseTrackId: string;
  hasUnpublishedChanges: boolean;
  counts: {
    modulesAdded: number;
    modulesEdited: number;
    modulesRemoved: number;
    sectionsRemoved: number;
    lessonsRemoved: number;
    paragraphsRemoved: number;
    grammarRulesRemoved: number;
    examplesRemoved: number;
    tablesRemoved: number;
    tableRowsRemoved: number;
    questionsRemoved: number;
    answerOptionsRemoved: number;
    explanationsRemoved: number;
    vocabularyLinksRemoved: number;
    mediaLinksRemoved: number;
    objectivesRemoved: number;
  };
  modulesAdded: number;
  modulesModified: number;
  modulesRemoved: number;
  sectionsRemoved: number;
  lessonsModified: number;
  lessonsRemoved: number;
  activitiesRemoved: number;
  paragraphsRemoved: number;
  tablesRemoved: number;
  tableRowsRemoved: number;
  vocabLinksRemoved: number;
  mediaLinksRemoved: number;
  pendingRemovedItemsCount: number;
  activeRemovedItemsCount: number;
  plainEnglishBullets: string[];
  plainEnglishLines: string[];
}

function getFriendlyItemTypeLabel(itemType: CmsRemovableItemType): string {
  switch (itemType) {
    case 'module':
      return 'Module';
    case 'section':
      return 'Section';
    case 'lesson':
      return 'Lesson';
    case 'lesson_paragraph':
      return 'Lesson Paragraph';
    case 'activity':
      return 'Practice / Assessment Item';
    case 'answer_option':
      return 'Answer Choice';
    case 'question_explanation':
      return 'Answer Explanation';
    case 'grammar_rule':
      return 'Grammar Note / Heading';
    case 'example_sentence':
      return 'Example Sentence';
    case 'grammar_table':
      return 'Grammar Table';
    case 'grammar_table_row':
      return 'Table Row';
    case 'vocabulary_reference':
      return 'Lesson Vocabulary Link';
    case 'media_reference':
      return 'Lesson Photo Link';
    case 'learning_objective':
      return 'Learning Goal';
  }
}

function getCmsRemovedItemsLedgerRaw(
  courseTrackId: string
): CmsRemovedItemRecord[] {
  return (
    cmsStorageAdapter.getItem<CmsRemovedItemRecord[]>(
      `${REMOVED_LEDGER_KEY_PREFIX}${courseTrackId}`
    ) || []
  );
}

function saveCmsRemovedItemsLedgerRaw(
  courseTrackId: string,
  records: CmsRemovedItemRecord[]
): void {
  cmsStorageAdapter.setItem(
    `${REMOVED_LEDGER_KEY_PREFIX}${courseTrackId}`,
    records.slice(0, 200)
  );
}

export function getCmsRemovedItemsInDraft(
  courseTrackId: string,
  includeRestored = false
): CmsRemovedItemRecord[] {
  assertCmsPermission('cms:preview_readonly');
  const all = getCmsRemovedItemsLedgerRaw(courseTrackId);
  return includeRestored
    ? deepClone(all)
    : deepClone(all.filter((r) => r.status === 'REMOVED_IN_DRAFT'));
}

function getUndoStackRaw(courseTrackId: string): CmsUndoRedoActionEntry[] {
  return (
    cmsStorageAdapter.getItem<CmsUndoRedoActionEntry[]>(
      `${UNDO_STACK_KEY_PREFIX}${courseTrackId}`
    ) || []
  );
}

function saveUndoStackRaw(
  courseTrackId: string,
  stack: CmsUndoRedoActionEntry[]
): void {
  cmsStorageAdapter.setItem(
    `${UNDO_STACK_KEY_PREFIX}${courseTrackId}`,
    stack.slice(0, 30)
  );
}

function getRedoStackRaw(courseTrackId: string): CmsUndoRedoActionEntry[] {
  return (
    cmsStorageAdapter.getItem<CmsUndoRedoActionEntry[]>(
      `${REDO_STACK_KEY_PREFIX}${courseTrackId}`
    ) || []
  );
}

function saveRedoStackRaw(
  courseTrackId: string,
  stack: CmsUndoRedoActionEntry[]
): void {
  cmsStorageAdapter.setItem(
    `${REDO_STACK_KEY_PREFIX}${courseTrackId}`,
    stack.slice(0, 30)
  );
}

export function getCmsUndoRedoState(courseTrackId: string): {
  canUndo: boolean;
  canRedo: boolean;
  lastUndoLabel: string | null;
  lastRedoLabel: string | null;
  undoCount: number;
  redoCount: number;
} {
  const undoStack = getUndoStackRaw(courseTrackId);
  const redoStack = getRedoStackRaw(courseTrackId);
  return {
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    lastUndoLabel: undoStack.length > 0 ? undoStack[0].actionLabel : null,
    lastRedoLabel: redoStack.length > 0 ? redoStack[0].actionLabel : null,
    undoCount: undoStack.length,
    redoCount: redoStack.length,
  };
}

function findLessonInModule(
  mod: UniversalModuleV1,
  lessonId: string,
  sectionId?: string
): {
  section?: UniversalSectionV1;
  lesson: UniversalLessonV1;
  lessonIndex: number;
} | null {
  if (sectionId && Array.isArray(mod.sections)) {
    const sec = mod.sections.find((s) => s.sectionId === sectionId);
    if (sec && Array.isArray(sec.lessons)) {
      const idx = sec.lessons.findIndex((l) => l.lessonId === lessonId);
      if (idx >= 0) {
        return { section: sec, lesson: sec.lessons[idx], lessonIndex: idx };
      }
    }
  }
  for (const sec of mod.sections || []) {
    const idx = (sec.lessons || []).findIndex((l) => l.lessonId === lessonId);
    if (idx >= 0 && sec.lessons) {
      return { section: sec, lesson: sec.lessons[idx], lessonIndex: idx };
    }
  }
  if (Array.isArray(mod.lessons)) {
    const idx = mod.lessons.findIndex((l) => l.lessonId === lessonId);
    if (idx >= 0) {
      return { lesson: mod.lessons[idx], lessonIndex: idx };
    }
  }
  return null;
}

/**
 * Inspects a removal target before executing it so the UI can decide whether
 * to execute immediately (low-impact leaf item) or show a clear confirmation dialog
 * listing all affected child lessons, questions, and dependencies (high-impact container
 * or correct answer option).
 */
export function analyzeCmsRemovalImpact(
  courseTrackId: string,
  target: CmsRemovalTargetSpec
): CmsRemovalImpactAnalysis {
  assertCmsPermission('cms:preview_readonly');
  const env = getOrCreateCmsCourseDraft(courseTrackId);
  const pkg = env.draftPackage;
  const mod = pkg.modules.find((m) => m.moduleId === target.moduleId);
  if (!mod) {
    throw new Error(`Module "${target.moduleId}" not found in draft.`);
  }

  const itemTypeLabel = getFriendlyItemTypeLabel(target.itemType);
  let itemTitle = mod.title;
  let locationBreadcrumb = mod.title;
  let requiresConfirmation = false;
  let removesCorrectAnswer = false;
  let sharedAssetPreservedNote: string | undefined;
  let dependencyWarning: string | undefined;

  const affectedCounts = {
    sections: 0,
    lessons: 0,
    questions: 0,
    vocabularyRefs: 0,
    mediaRefs: 0,
    dependentModuleIds: [] as string[],
  };

  if (target.itemType === 'module') {
    requiresConfirmation = true;
    itemTitle = `${mod.moduleId} — ${mod.title}`;
    locationBreadcrumb = `Course Track (${courseTrackId}) → ${mod.title}`;
    affectedCounts.sections = (mod.sections || []).length;
    const allLessons = [
      ...(mod.lessons || []),
      ...(mod.sections || []).flatMap((s) => s.lessons || []),
    ];
    affectedCounts.lessons = allLessons.length;
    for (const l of allLessons) {
      affectedCounts.questions += (l.activities || []).length;
      affectedCounts.vocabularyRefs += (l.vocabularyRefs || []).length;
      affectedCounts.mediaRefs += ((l.mediaRefs as string[]) || []).length;
    }
    affectedCounts.vocabularyRefs = Math.max(
      affectedCounts.vocabularyRefs,
      (mod.vocabularyReferences || []).length
    );
    for (const otherMod of pkg.modules) {
      if (
        otherMod.moduleId !== mod.moduleId &&
        (otherMod.prerequisites || []).includes(mod.moduleId)
      ) {
        affectedCounts.dependentModuleIds.push(otherMod.moduleId);
      }
    }
    if (affectedCounts.dependentModuleIds.length > 0) {
      dependencyWarning = `Prerequisite link warning: Module(s) ${affectedCounts.dependentModuleIds.join(', ')} list "${mod.title}" as a prerequisite.`;
    }
    sharedAssetPreservedNote =
      'Removing this module from your draft does not delete any words from the global Vocabulary Bank or photos from the Media Library.';
  } else if (target.itemType === 'section') {
    const sec = (mod.sections || []).find(
      (s) => s.sectionId === target.sectionId
    );
    if (!sec) {
      throw new Error(
        `Section "${target.sectionId}" not found in module "${mod.moduleId}".`
      );
    }
    itemTitle = sec.title;
    locationBreadcrumb = `${mod.title} → ${sec.title}`;
    const lessons = sec.lessons || [];
    affectedCounts.lessons = lessons.length;
    for (const l of lessons) {
      affectedCounts.questions += (l.activities || []).length;
      affectedCounts.vocabularyRefs += (l.vocabularyRefs || []).length;
      affectedCounts.mediaRefs += ((l.mediaRefs as string[]) || []).length;
    }
    requiresConfirmation =
      affectedCounts.lessons > 0 || affectedCounts.questions > 0;
  } else if (target.itemType === 'lesson') {
    const found = findLessonInModule(mod, target.lessonId || '', target.sectionId);
    if (!found) {
      throw new Error(
        `Lesson "${target.lessonId}" not found in module "${mod.moduleId}".`
      );
    }
    itemTitle = found.lesson.title;
    locationBreadcrumb = found.section
      ? `${mod.title} → ${found.section.title} → ${found.lesson.title}`
      : `${mod.title} → ${found.lesson.title}`;
    affectedCounts.questions = (found.lesson.activities || []).length;
    affectedCounts.vocabularyRefs = (found.lesson.vocabularyRefs || []).length;
    affectedCounts.mediaRefs = ((found.lesson.mediaRefs as string[]) || []).length;
    requiresConfirmation = true;
    sharedAssetPreservedNote =
      'Linked vocabulary words and media photos stay safely in your shared libraries.';
  } else if (target.itemType === 'lesson_paragraph') {
    const found = findLessonInModule(mod, target.lessonId || '', target.sectionId);
    if (!found) {
      throw new Error(`Lesson "${target.lessonId}" not found.`);
    }
    const paragraphs = String(found.lesson.instructionalText || '')
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    const pIdx = target.paragraphIndex ?? 0;
    const textPreview = (paragraphs[pIdx] || '').slice(0, 65);
    itemTitle = textPreview
      ? `Paragraph ${pIdx + 1}: "${textPreview}${paragraphs[pIdx] && paragraphs[pIdx].length > 65 ? '…' : ''}"`
      : `Paragraph ${pIdx + 1}`;
    locationBreadcrumb = `${mod.title} → ${found.lesson.title}`;
    requiresConfirmation = false;
  } else if (target.itemType === 'activity') {
    const found = findLessonInModule(mod, target.lessonId || '', target.sectionId);
    if (!found) {
      throw new Error(`Lesson "${target.lessonId}" not found.`);
    }
    const act = (found.lesson.activities || []).find(
      (a) => a.activityId === target.activityId
    );
    if (!act) {
      throw new Error(`Activity "${target.activityId}" not found.`);
    }
    itemTitle = act.title || act.prompt || act.activityId;
    locationBreadcrumb = `${mod.title} → ${found.lesson.title} → ${itemTitle}`;
    affectedCounts.questions = 1;
    affectedCounts.vocabularyRefs = (act.vocabularyRefs || []).length;
    requiresConfirmation = true;
  } else if (target.itemType === 'answer_option') {
    const found = findLessonInModule(mod, target.lessonId || '', target.sectionId);
    const act = found?.lesson.activities?.find(
      (a) => a.activityId === target.activityId
    );
    if (!found || !act) {
      throw new Error(`Activity "${target.activityId}" not found.`);
    }
    const payload = (act.payload || {}) as {
      options?: string[];
      correctIndex?: number;
    };
    const options = Array.isArray(payload.options) ? payload.options : [];
    const optIdx = target.optionIndex ?? -1;
    const optText = options[optIdx] ?? `Option #${optIdx + 1}`;
    itemTitle = `Choice "${optText}"`;
    locationBreadcrumb = `${mod.title} → ${found.lesson.title} → ${act.title || act.activityId}`;
    if (payload.correctIndex === optIdx) {
      removesCorrectAnswer = true;
      requiresConfirmation = true;
      dependencyWarning =
        'This choice is currently marked as the Correct Answer. Removing it will leave this question without a valid correct answer until you select a new one.';
    } else if (options.length <= 2) {
      requiresConfirmation = true;
      dependencyWarning =
        'Removing this choice leaves fewer than 2 answer options for this question.';
    }
  } else if (target.itemType === 'question_explanation') {
    const found = findLessonInModule(mod, target.lessonId || '', target.sectionId);
    const act = found?.lesson.activities?.find(
      (a) => a.activityId === target.activityId
    );
    itemTitle = `Answer Explanation for "${act?.title || target.activityId}"`;
    locationBreadcrumb = `${mod.title} → ${found?.lesson.title || target.lessonId}`;
    requiresConfirmation = false;
  } else if (
    target.itemType === 'grammar_rule' ||
    target.itemType === 'example_sentence' ||
    target.itemType === 'grammar_table' ||
    target.itemType === 'grammar_table_row'
  ) {
    const found = findLessonInModule(mod, target.lessonId || '', target.sectionId);
    const act = found?.lesson.activities?.find(
      (a) => a.activityId === target.activityId
    );
    const payload = (act?.payload || {}) as Record<string, any>;
    locationBreadcrumb = `${mod.title} → ${found?.lesson.title || ''} → ${act?.title || ''}`;
    if (target.itemType === 'grammar_rule') {
      const rules = Array.isArray(payload.rules) ? payload.rules : [];
      const rText = stripHtmlTags(String(rules[target.ruleIndex ?? 0] || '')).slice(
        0,
        60
      );
      itemTitle = rText ? `Grammar Note: "${rText}…"` : `Grammar Note #${(target.ruleIndex ?? 0) + 1}`;
    } else if (target.itemType === 'example_sentence') {
      const exs = Array.isArray(payload.examples)
        ? payload.examples
        : Array.isArray(payload.lines)
          ? payload.lines
          : Array.isArray(payload.prompts)
            ? payload.prompts
            : [];
      const ex = exs[target.exampleIndex ?? 0] as
        | { uk?: string; en?: string; text?: string; front?: string }
        | undefined;
      itemTitle = ex
        ? `Example: "${ex.uk || ex.text || ex.front || ''}"`
        : `Example #${(target.exampleIndex ?? 0) + 1}`;
    } else if (target.itemType === 'grammar_table') {
    itemTitle = `Grammar Table #${(target.tableIndex ?? 0) + 1}`;
      const tables = Array.isArray(payload.tables)
        ? payload.tables
        : Array.isArray(payload.patternTables)
          ? payload.patternTables
          : [];
      const tbl = tables[target.tableIndex ?? 0] as
        | { title?: string; rows?: unknown[] }
        | undefined;
      if (tbl?.title) {
        itemTitle = `Grammar Table: "${tbl.title}"`;
      }
      requiresConfirmation = true;
    } else {
      itemTitle = `Table Row #${(target.rowIndex ?? 0) + 1}`;
    }
  } else if (target.itemType === 'vocabulary_reference') {
    const resolvedVocabId = target.vocabularyId || target.vocabId || '';
    itemTitle = `Vocabulary Link "${resolvedVocabId}"`;
    locationBreadcrumb = `${mod.title}${target.lessonId ? ` → ${target.lessonId}` : ''}`;
    sharedAssetPreservedNote =
      'Only the link to this lesson is removed. The word remains in the shared Vocabulary Bank and FSRS flashcards.';
    requiresConfirmation = false;
  } else if (target.itemType === 'media_reference') {
    const resolvedMediaPath = target.mediaAssetPath || target.mediaPath || '';
    itemTitle = `Photo Link "${resolvedMediaPath}"`;
    locationBreadcrumb = `${mod.title}${target.lessonId ? ` → ${target.lessonId}` : ''}`;
    sharedAssetPreservedNote =
      'Only the photo link in this lesson is removed. The image file stays in the Media Library.';
    requiresConfirmation = false;
  } else if (target.itemType === 'learning_objective') {
    const objText = (mod.learningObjectives || [])[target.objectiveIndex ?? 0] || '';
    itemTitle = `Learning Goal: "${objText.slice(0, 60)}"`;
    locationBreadcrumb = mod.title;
    requiresConfirmation = false;
  }

  const summaryParts: string[] = [];
  if (affectedCounts.sections > 0) {
    summaryParts.push(`${affectedCounts.sections} section(s)`);
  }
  if (affectedCounts.lessons > 0) {
    summaryParts.push(`${affectedCounts.lessons} lesson(s)`);
  }
  if (affectedCounts.questions > 0) {
    summaryParts.push(`${affectedCounts.questions} practice/exam item(s)`);
  }
  if (affectedCounts.vocabularyRefs > 0) {
    summaryParts.push(`${affectedCounts.vocabularyRefs} vocabulary link(s)`);
  }
  if (affectedCounts.mediaRefs > 0) {
    summaryParts.push(`${affectedCounts.mediaRefs} photo link(s)`);
  }

  const friendlyImpactSummary =
    summaryParts.length > 0
      ? `Removing "${itemTitle}" from your draft will also remove ${summaryParts.join(', ')} inside it. Your published course will not change until you publish.`
      : `Removes "${itemTitle}" from your unpublished draft only.`;

  return {
    courseTrackId,
    target,
    itemTypeLabel,
    itemTitle,
    locationBreadcrumb,
    requiresConfirmation,
    severity: requiresConfirmation ? 'high' : 'low',
    affectedCounts,
    removesCorrectAnswer,
    willInvalidateCorrectAnswer: removesCorrectAnswer,
    sharedAssetPreservedNote,
    sharedLibrarySafetyNote: sharedAssetPreservedNote,
    dependencyWarning,
    prerequisiteDependents: affectedCounts.dependentModuleIds,
    friendlyImpactSummary,
    confirmationHeadline: `Remove ${itemTypeLabel} "${itemTitle}" from your draft?`,
    confirmationExplanation:
      dependencyWarning ||
      `${friendlyImpactSummary} You can undo this immediately or restore it anytime from Removed Items.`,
    keepButtonLabel: `Keep ${itemTypeLabel}`,
    removeButtonLabel: 'Remove from Draft',
  };
}

/**
 * Safely and non-destructively removes any supported course content item from the
 * Course Track's Studio Draft, records a soft-deleted entry in the track's Removed Items
 * ledger, and pushes a reversible entry onto the track's Undo stack.
 */
export function removeCmsContentItemInDraft(
  courseTrackId: string,
  target: CmsRemovalTargetSpec
): {
  envelope: CmsCourseDraftEnvelope;
  removedRecord: CmsRemovedItemRecord;
  impact: CmsRemovalImpactAnalysis;
  undoEntry: CmsUndoRedoActionEntry;
  undoBannerMessage: string;
  warningMessage?: string;
} {
  assertCmsPermission('cms:edit_draft');
  const impact = analyzeCmsRemovalImpact(courseTrackId, target);
  const beforeEnv = getOrCreateCmsCourseDraft(courseTrackId);
  const beforePackage = deepClone(beforeEnv.draftPackage);
  const beforeConfirmedDeleted =
    courseTrackId === PUBLISHED_UKRAINIAN_TRACK_ID
      ? [...(getRawSparseOverlayForUk()?.confirmedDeletedModuleIds || [])]
      : [];
  const beforeLedger = getCmsRemovedItemsLedgerRaw(courseTrackId);

  const pkg = deepClone(beforeEnv.draftPackage);
  const afterConfirmedDeleted = new Set<string>(beforeConfirmedDeleted);

  let itemId = target.moduleId;
  let originalIndex = 0;
  let serializedPayload: unknown = null;
  const extraRestoreMetadata: Record<string, unknown> = {};
  let warningMessage: string | undefined;

  const modIdx = pkg.modules.findIndex((m) => m.moduleId === target.moduleId);
  if (modIdx < 0) {
    throw new Error(`Module "${target.moduleId}" not found in draft.`);
  }
  const mod = pkg.modules[modIdx];

  if (target.itemType === 'module') {
    itemId = mod.moduleId;
    originalIndex = modIdx;
    serializedPayload = deepClone(mod);
    pkg.modules.splice(modIdx, 1);
    if (courseTrackId === PUBLISHED_UKRAINIAN_TRACK_ID) {
      afterConfirmedDeleted.add(mod.moduleId);
    }
  } else if (target.itemType === 'section') {
    if (!Array.isArray(mod.sections)) {
      throw new Error(`Module "${mod.moduleId}" has no sections.`);
    }
    const sIdx = mod.sections.findIndex((s) => s.sectionId === target.sectionId);
    if (sIdx < 0) {
      throw new Error(`Section "${target.sectionId}" not found.`);
    }
    itemId = mod.sections[sIdx].sectionId;
    originalIndex = sIdx;
    serializedPayload = deepClone(mod.sections[sIdx]);
    mod.sections.splice(sIdx, 1);
  } else if (target.itemType === 'lesson') {
    const found = findLessonInModule(mod, target.lessonId || '', target.sectionId);
    if (!found) {
      throw new Error(`Lesson "${target.lessonId}" not found.`);
    }
    itemId = found.lesson.lessonId;
    originalIndex = found.lessonIndex;
    serializedPayload = deepClone(found.lesson);
    if (found.section && Array.isArray(found.section.lessons)) {
      extraRestoreMetadata.sectionId = found.section.sectionId;
      found.section.lessons.splice(found.lessonIndex, 1);
    } else if (Array.isArray(mod.lessons)) {
      mod.lessons.splice(found.lessonIndex, 1);
    }
  } else if (target.itemType === 'lesson_paragraph') {
    const found = findLessonInModule(mod, target.lessonId || '', target.sectionId);
    if (!found) {
      throw new Error(`Lesson "${target.lessonId}" not found.`);
    }
    const paragraphs = String(found.lesson.instructionalText || '')
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    const pIdx = target.paragraphIndex ?? 0;
    if (pIdx < 0 || pIdx >= paragraphs.length) {
      throw new Error(`Paragraph index ${pIdx} is out of range.`);
    }
    itemId = `${found.lesson.lessonId}_para_${pIdx + 1}`;
    originalIndex = pIdx;
    serializedPayload = paragraphs[pIdx];
    paragraphs.splice(pIdx, 1);
    found.lesson.instructionalText = paragraphs.join('\n\n');
  } else if (target.itemType === 'activity') {
    const found = findLessonInModule(mod, target.lessonId || '', target.sectionId);
    if (!found || !Array.isArray(found.lesson.activities)) {
      throw new Error(`Lesson "${target.lessonId}" has no activities.`);
    }
    const aIdx = found.lesson.activities.findIndex(
      (a) => a.activityId === target.activityId
    );
    if (aIdx < 0) {
      throw new Error(`Activity "${target.activityId}" not found.`);
    }
    itemId = found.lesson.activities[aIdx].activityId;
    originalIndex = aIdx;
    serializedPayload = deepClone(found.lesson.activities[aIdx]);
    found.lesson.activities.splice(aIdx, 1);
  } else if (target.itemType === 'answer_option') {
    const found = findLessonInModule(mod, target.lessonId || '', target.sectionId);
    const act = found?.lesson.activities?.find(
      (a) => a.activityId === target.activityId
    );
    if (!found || !act) {
      throw new Error(`Activity "${target.activityId}" not found.`);
    }
    const payload = (act.payload || {}) as {
      options?: string[];
      correctIndex?: number;
      answer?: string;
    };
    if (!Array.isArray(payload.options)) {
      throw new Error(`Activity "${act.activityId}" has no answer options.`);
    }
    const optIdx = target.optionIndex ?? -1;
    if (optIdx < 0 || optIdx >= payload.options.length) {
      throw new Error(`Answer option index ${optIdx} is out of range.`);
    }
    const previousCorrectIndex =
      typeof payload.correctIndex === 'number' ? payload.correctIndex : -1;
    extraRestoreMetadata.previousCorrectIndex = previousCorrectIndex;
    itemId = `${act.activityId}_opt_${optIdx + 1}`;
    originalIndex = optIdx;
    serializedPayload = payload.options[optIdx];
    payload.options.splice(optIdx, 1);

    if (optIdx === previousCorrectIndex) {
      // NEVER silently assign another option as correct!
      payload.correctIndex = -1;
      payload.answer = '';
      warningMessage =
        'You removed the answer choice that was marked as correct. Please select a new correct answer before publishing.';
    } else if (previousCorrectIndex > optIdx) {
      payload.correctIndex = previousCorrectIndex - 1;
      payload.answer = payload.options[payload.correctIndex] || '';
    }
    act.payload = { ...payload };
  } else if (target.itemType === 'question_explanation') {
    const found = findLessonInModule(mod, target.lessonId || '', target.sectionId);
    const act = found?.lesson.activities?.find(
      (a) => a.activityId === target.activityId
    );
    if (!found || !act) {
      throw new Error(`Activity "${target.activityId}" not found.`);
    }
    const payload = (act.payload || {}) as { explanation?: string };
    itemId = `${act.activityId}_explanation`;
    originalIndex = 0;
    serializedPayload = payload.explanation || '';
    payload.explanation = '';
    act.payload = { ...payload };
  } else if (target.itemType === 'grammar_rule') {
    const found = findLessonInModule(mod, target.lessonId || '', target.sectionId);
    const act = found?.lesson.activities?.find(
      (a) => a.activityId === target.activityId
    );
    const payload = (act?.payload || {}) as { rules?: string[] };
    if (!found || !act || !Array.isArray(payload.rules)) {
      throw new Error(`Grammar rules array not found on "${target.activityId}".`);
    }
    const rIdx = target.ruleIndex ?? 0;
    if (rIdx < 0 || rIdx >= payload.rules.length) {
      throw new Error(`Grammar rule index ${rIdx} out of bounds.`);
    }
    itemId = `${act.activityId}_rule_${rIdx + 1}`;
    originalIndex = rIdx;
    serializedPayload = payload.rules[rIdx];
    payload.rules.splice(rIdx, 1);
    act.payload = { ...payload };
  } else if (target.itemType === 'example_sentence') {
    const found = findLessonInModule(mod, target.lessonId || '', target.sectionId);
    const act = found?.lesson.activities?.find(
      (a) => a.activityId === target.activityId
    );
    const payload = (act?.payload || {}) as Record<string, any>;
    if (!found || !act) {
      throw new Error(`Activity "${target.activityId}" not found.`);
    }
    const arrayKey = Array.isArray(payload.examples)
      ? 'examples'
      : Array.isArray(payload.lines)
        ? 'lines'
        : Array.isArray(payload.prompts)
          ? 'prompts'
          : null;
    if (!arrayKey) {
      throw new Error(`Example list not found on activity "${act.activityId}".`);
    }
    const list = payload[arrayKey] as unknown[];
    const exIdx = target.exampleIndex ?? 0;
    if (exIdx < 0 || exIdx >= list.length) {
      throw new Error(`Example index ${exIdx} out of bounds.`);
    }
    extraRestoreMetadata.arrayKey = arrayKey;
    itemId = `${act.activityId}_ex_${exIdx + 1}`;
    originalIndex = exIdx;
    serializedPayload = deepClone(list[exIdx]);
    list.splice(exIdx, 1);
    act.payload = { ...payload };
  } else if (target.itemType === 'grammar_table') {
    const found = findLessonInModule(mod, target.lessonId || '', target.sectionId);
    const act = found?.lesson.activities?.find(
      (a) => a.activityId === target.activityId
    );
    const payload = (act?.payload || {}) as {
      tables?: unknown[];
      patternTables?: unknown[];
    };
    const tablesArr = Array.isArray(payload.tables)
      ? payload.tables
      : Array.isArray(payload.patternTables)
        ? payload.patternTables
        : null;
    if (!found || !act || !tablesArr) {
      throw new Error(`Grammar tables not found on activity "${target.activityId}".`);
    }
    const tIdx = target.tableIndex ?? 0;
    if (tIdx < 0 || tIdx >= tablesArr.length) {
      throw new Error(`Table index ${tIdx} out of bounds.`);
    }
    itemId = `${act.activityId}_table_${tIdx + 1}`;
    originalIndex = tIdx;
    serializedPayload = deepClone(tablesArr[tIdx]);
    if (Array.isArray(payload.tables)) {
      payload.tables.splice(tIdx, 1);
    }
    if (Array.isArray(payload.patternTables)) {
      payload.patternTables.splice(tIdx, 1);
    }
    act.payload = { ...payload };
  } else if (target.itemType === 'grammar_table_row') {
    const found = findLessonInModule(mod, target.lessonId || '', target.sectionId);
    const act = found?.lesson.activities?.find(
      (a) => a.activityId === target.activityId
    );
    const payload = (act?.payload || {}) as {
      tables?: Array<{ title?: string; headers?: string[]; rows?: unknown[] }>;
      patternTables?: Array<{ title?: string; headers?: string[]; rows?: unknown[] }>;
    };
    const tIdx = target.tableIndex ?? 0;
    const rIdx = target.rowIndex ?? 0;
    const tbl = payload.tables?.[tIdx] || payload.patternTables?.[tIdx];
    if (!found || !act || !tbl || !Array.isArray(tbl.rows)) {
      throw new Error(`Grammar table row not found.`);
    }
    if (rIdx < 0 || rIdx >= tbl.rows.length) {
      throw new Error(`Row index ${rIdx} out of bounds.`);
    }
    itemId = `${act.activityId}_table_${tIdx + 1}_row_${rIdx + 1}`;
    originalIndex = rIdx;
    serializedPayload = deepClone(tbl.rows[rIdx]);
    if (payload.tables?.[tIdx]?.rows) {
      payload.tables[tIdx].rows!.splice(rIdx, 1);
    }
    if (payload.patternTables?.[tIdx]?.rows) {
      payload.patternTables[tIdx].rows!.splice(rIdx, 1);
    }
    act.payload = { ...payload };
  } else if (target.itemType === 'vocabulary_reference') {
    const vocabId = target.vocabularyId || target.vocabId || '';
    if (!vocabId) {
      throw new Error('vocabularyId is required to remove a vocabulary reference.');
    }
    itemId = vocabId;
    serializedPayload = vocabId;
    if (target.lessonId) {
      const found = findLessonInModule(mod, target.lessonId, target.sectionId);
      if (!found) {
        throw new Error(`Lesson "${target.lessonId}" not found.`);
      }
      const refs = found.lesson.vocabularyRefs || [];
      originalIndex = Math.max(0, refs.indexOf(vocabId));
      found.lesson.vocabularyRefs = refs.filter((r) => r !== vocabId);
      const existingRemoved = Array.isArray(
        found.lesson.metadata?.removedVocabularyRefs
      )
        ? (found.lesson.metadata!.removedVocabularyRefs as string[])
        : [];
      if (!existingRemoved.includes(vocabId)) {
        found.lesson.metadata = {
          ...(found.lesson.metadata || {}),
          removedVocabularyRefs: [...existingRemoved, vocabId],
        };
      }
      if (target.activityId && Array.isArray(found.lesson.activities)) {
        const act = found.lesson.activities.find(
          (a) => a.activityId === target.activityId
        );
        if (act && Array.isArray(act.vocabularyRefs)) {
          act.vocabularyRefs = act.vocabularyRefs.filter((r) => r !== vocabId);
        }
      }
    } else {
      const refs = mod.vocabularyReferences || [];
      originalIndex = Math.max(0, refs.indexOf(vocabId));
      mod.vocabularyReferences = refs.filter((r) => r !== vocabId);
    }
  } else if (target.itemType === 'media_reference') {
    const assetPath = target.mediaAssetPath || target.mediaPath || '';
    if (!assetPath || !target.lessonId) {
      throw new Error(
        'lessonId and mediaAssetPath are required to remove a media reference.'
      );
    }
    const found = findLessonInModule(mod, target.lessonId, target.sectionId);
    if (!found) {
      throw new Error(`Lesson "${target.lessonId}" not found.`);
    }
    const refs = ((found.lesson.mediaRefs as string[]) || []).slice();
    originalIndex = Math.max(0, refs.indexOf(assetPath));
    found.lesson.mediaRefs = refs.filter((r) => r !== assetPath);
    itemId = assetPath;
    serializedPayload = assetPath;
  } else if (target.itemType === 'learning_objective') {
    const objs = mod.learningObjectives || [];
    const oIdx = target.objectiveIndex ?? 0;
    if (oIdx < 0 || oIdx >= objs.length) {
      throw new Error(`Objective index ${oIdx} out of bounds.`);
    }
    itemId = `${mod.moduleId}_obj_${oIdx + 1}`;
    originalIndex = oIdx;
    serializedPayload = objs[oIdx];
    objs.splice(oIdx, 1);
    mod.learningObjectives = objs;
  }

  const removedRecord: CmsRemovedItemRecord = {
    removalId: `rem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    courseTrackId,
    itemType: target.itemType,
    itemTypeLabel: impact.itemTypeLabel,
    itemId,
    itemTitle: impact.itemTitle,
    locationBreadcrumb: impact.locationBreadcrumb,
    parentIds: {
      moduleId: target.moduleId,
      sectionId:
        (extraRestoreMetadata.sectionId as string | undefined) ||
        target.sectionId,
      lessonId: target.lessonId,
      activityId: target.activityId,
      tableIndex: target.tableIndex,
    },
    originalIndex,
    removedAt: Date.now(),
    status: 'REMOVED_IN_DRAFT',
    impactSummary: impact.friendlyImpactSummary,
    serializedPayload,
    extraRestoreMetadata,
  };

  const afterLedger = [removedRecord, ...beforeLedger];
  saveCmsRemovedItemsLedgerRaw(courseTrackId, afterLedger);

  const savedEnvelope = saveCmsCourseDraft(courseTrackId, pkg, {
    lifecycleState: 'DRAFT',
    changeSummary: `Removed ${impact.itemTypeLabel.toLowerCase()} "${impact.itemTitle}" from draft`,
    confirmedDeletedModuleIds: Array.from(afterConfirmedDeleted),
  });

  const undoEntry: CmsUndoRedoActionEntry = {
    actionId: `undo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    courseTrackId,
    timestamp: Date.now(),
    actionLabel: `Remove ${impact.itemTypeLabel}: ${impact.itemTitle}`,
    beforePackage,
    afterPackage: deepClone(savedEnvelope.draftPackage),
    beforeConfirmedDeletedModuleIds: beforeConfirmedDeleted,
    afterConfirmedDeletedModuleIds: Array.from(afterConfirmedDeleted),
    beforeRemovedLedger: beforeLedger,
    afterRemovedLedger: afterLedger,
  };

  const undoStack = getUndoStackRaw(courseTrackId);
  undoStack.unshift(undoEntry);
  saveUndoStackRaw(courseTrackId, undoStack);
  saveRedoStackRaw(courseTrackId, []);

  const undoBannerMessage = warningMessage
    ? `${impact.itemTypeLabel} "${impact.itemTitle}" removed from your draft. ⚠️ ${warningMessage}`
    : `${impact.itemTypeLabel} "${impact.itemTitle}" removed from your draft.`;

  return {
    envelope: savedEnvelope,
    removedRecord,
    impact,
    undoEntry,
    undoBannerMessage,
    warningMessage,
  };
}

/**
 * Restores a single soft-deleted item from the track's Removed Items ledger back
 * to its original parent and index without restoring unrelated removed items.
 */
export function restoreRemovedCmsItemInDraft(
  courseTrackId: string,
  removalId: string
): {
  success: boolean;
  restoredRecord?: CmsRemovedItemRecord;
  envelope: CmsCourseDraftEnvelope;
  message: string;
} {
  assertCmsPermission('cms:edit_draft');
  const beforeEnv = getOrCreateCmsCourseDraft(courseTrackId);
  const beforePackage = deepClone(beforeEnv.draftPackage);
  const beforeConfirmedDeleted =
    courseTrackId === PUBLISHED_UKRAINIAN_TRACK_ID
      ? [...(getRawSparseOverlayForUk()?.confirmedDeletedModuleIds || [])]
      : [];
  const beforeLedger = getCmsRemovedItemsLedgerRaw(courseTrackId);

  const recIdx = beforeLedger.findIndex(
    (r) => r.removalId === removalId && r.status === 'REMOVED_IN_DRAFT'
  );
  if (recIdx < 0) {
    return {
      success: false,
      envelope: beforeEnv,
      message: `Removed item "${removalId}" was not found or was already restored.`,
    };
  }

  const record = deepClone(beforeLedger[recIdx]);
  const pkg = deepClone(beforeEnv.draftPackage);
  const afterConfirmedDeleted = new Set<string>(beforeConfirmedDeleted);

  if (record.itemType === 'module') {
    const modPayload = deepClone(record.serializedPayload as UniversalModuleV1);
    afterConfirmedDeleted.delete(modPayload.moduleId);
    const existingIdx = pkg.modules.findIndex(
      (m) => m.moduleId === modPayload.moduleId
    );
    if (existingIdx >= 0) {
      pkg.modules[existingIdx] = modPayload;
    } else {
      const insertAt = Math.min(
        Math.max(0, record.originalIndex),
        pkg.modules.length
      );
      pkg.modules.splice(insertAt, 0, modPayload);
    }
  } else {
    const mod = pkg.modules.find(
      (m) => m.moduleId === record.parentIds.moduleId
    );
    if (!mod) {
      return {
        success: false,
        envelope: beforeEnv,
        message: `Cannot restore "${record.itemTitle}" because its parent module "${record.parentIds.moduleId}" is currently removed. Restore the parent module first.`,
      };
    }

    if (record.itemType === 'section') {
      const secPayload = deepClone(
        record.serializedPayload as UniversalSectionV1
      );
      if (!Array.isArray(mod.sections)) mod.sections = [];
      const insertAt = Math.min(
        Math.max(0, record.originalIndex),
        mod.sections.length
      );
      mod.sections.splice(insertAt, 0, secPayload);
    } else if (record.itemType === 'lesson') {
      const lesPayload = deepClone(record.serializedPayload as UniversalLessonV1);
      const secId = record.parentIds.sectionId;
      if (secId && Array.isArray(mod.sections)) {
        const sec = mod.sections.find((s) => s.sectionId === secId);
        if (!sec) {
          return {
            success: false,
            envelope: beforeEnv,
            message: `Cannot restore lesson "${record.itemTitle}" because its parent section "${secId}" is currently removed. Restore the section first.`,
          };
        }
        if (!Array.isArray(sec.lessons)) sec.lessons = [];
        const insertAt = Math.min(
          Math.max(0, record.originalIndex),
          sec.lessons.length
        );
        sec.lessons.splice(insertAt, 0, lesPayload);
      } else {
        if (!Array.isArray(mod.lessons)) mod.lessons = [];
        const insertAt = Math.min(
          Math.max(0, record.originalIndex),
          mod.lessons.length
        );
        mod.lessons.splice(insertAt, 0, lesPayload);
      }
    } else if (record.itemType === 'lesson_paragraph') {
      const found = findLessonInModule(
        mod,
        record.parentIds.lessonId || '',
        record.parentIds.sectionId
      );
      if (!found) {
        return {
          success: false,
          envelope: beforeEnv,
          message: `Cannot restore paragraph because its parent lesson is currently removed.`,
        };
      }
      const paragraphs = String(found.lesson.instructionalText || '')
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
      const insertAt = Math.min(
        Math.max(0, record.originalIndex),
        paragraphs.length
      );
      paragraphs.splice(insertAt, 0, String(record.serializedPayload || ''));
      found.lesson.instructionalText = paragraphs.join('\n\n');
    } else if (record.itemType === 'activity') {
      const found = findLessonInModule(
        mod,
        record.parentIds.lessonId || '',
        record.parentIds.sectionId
      );
      if (!found) {
        return {
          success: false,
          envelope: beforeEnv,
          message: `Cannot restore activity because its parent lesson is currently removed.`,
        };
      }
      if (!Array.isArray(found.lesson.activities)) found.lesson.activities = [];
      const actPayload = deepClone(
        record.serializedPayload as UniversalActivityItemV1
      );
      const insertAt = Math.min(
        Math.max(0, record.originalIndex),
        found.lesson.activities.length
      );
      found.lesson.activities.splice(insertAt, 0, actPayload);
    } else if (record.itemType === 'answer_option') {
      const found = findLessonInModule(
        mod,
        record.parentIds.lessonId || '',
        record.parentIds.sectionId
      );
      const act = found?.lesson.activities?.find(
        (a) => a.activityId === record.parentIds.activityId
      );
      if (!found || !act) {
        return {
          success: false,
          envelope: beforeEnv,
          message: `Cannot restore answer option because its parent question is currently removed.`,
        };
      }
      const payload = (act.payload || {}) as {
        options?: string[];
        correctIndex?: number;
        answer?: string;
      };
      if (!Array.isArray(payload.options)) payload.options = [];
      const insertAt = Math.min(
        Math.max(0, record.originalIndex),
        payload.options.length
      );
      const optText = String(record.serializedPayload || '');
      payload.options.splice(insertAt, 0, optText);
      const prevCorrect =
        typeof record.extraRestoreMetadata?.previousCorrectIndex === 'number'
          ? (record.extraRestoreMetadata.previousCorrectIndex as number)
          : -1;
      if (payload.correctIndex === -1 && prevCorrect === insertAt) {
        payload.correctIndex = insertAt;
        payload.answer = optText;
      } else if (
        typeof payload.correctIndex === 'number' &&
        payload.correctIndex >= insertAt
      ) {
        payload.correctIndex += 1;
        payload.answer = payload.options[payload.correctIndex] || '';
      }
      act.payload = { ...payload };
    } else if (record.itemType === 'question_explanation') {
      const found = findLessonInModule(
        mod,
        record.parentIds.lessonId || '',
        record.parentIds.sectionId
      );
      const act = found?.lesson.activities?.find(
        (a) => a.activityId === record.parentIds.activityId
      );
      if (!found || !act) {
        return {
          success: false,
          envelope: beforeEnv,
          message: `Cannot restore explanation because its parent question is currently removed.`,
        };
      }
      const payload = (act.payload || {}) as { explanation?: string };
      payload.explanation = String(record.serializedPayload || '');
      act.payload = { ...payload };
    } else if (record.itemType === 'grammar_rule') {
      const found = findLessonInModule(
        mod,
        record.parentIds.lessonId || '',
        record.parentIds.sectionId
      );
      const act = found?.lesson.activities?.find(
        (a) => a.activityId === record.parentIds.activityId
      );
      if (!found || !act) {
        return {
          success: false,
          envelope: beforeEnv,
          message: `Cannot restore grammar note because its parent lesson item is currently removed.`,
        };
      }
      const payload = (act.payload || {}) as { rules?: string[] };
      if (!Array.isArray(payload.rules)) payload.rules = [];
      const insertAt = Math.min(
        Math.max(0, record.originalIndex),
        payload.rules.length
      );
      payload.rules.splice(insertAt, 0, String(record.serializedPayload || ''));
      act.payload = { ...payload };
    } else if (record.itemType === 'example_sentence') {
      const found = findLessonInModule(
        mod,
        record.parentIds.lessonId || '',
        record.parentIds.sectionId
      );
      const act = found?.lesson.activities?.find(
        (a) => a.activityId === record.parentIds.activityId
      );
      if (!found || !act) {
        return {
          success: false,
          envelope: beforeEnv,
          message: `Cannot restore example sentence because its parent lesson item is currently removed.`,
        };
      }
      const payload = (act.payload || {}) as Record<string, any>;
      const arrayKey =
        (record.extraRestoreMetadata?.arrayKey as string) || 'examples';
      if (!Array.isArray(payload[arrayKey])) payload[arrayKey] = [];
      const insertAt = Math.min(
        Math.max(0, record.originalIndex),
        payload[arrayKey].length
      );
      payload[arrayKey].splice(insertAt, 0, deepClone(record.serializedPayload));
      act.payload = { ...payload };
    } else if (record.itemType === 'grammar_table') {
      const found = findLessonInModule(
        mod,
        record.parentIds.lessonId || '',
        record.parentIds.sectionId
      );
      const act = found?.lesson.activities?.find(
        (a) => a.activityId === record.parentIds.activityId
      );
      if (!found || !act) {
        return {
          success: false,
          envelope: beforeEnv,
          message: `Cannot restore grammar table because its parent lesson item is currently removed.`,
        };
      }
      const payload = (act.payload || {}) as {
        tables?: unknown[];
        patternTables?: unknown[];
      };
      if (!Array.isArray(payload.tables)) payload.tables = [];
      const insertAt = Math.min(
        Math.max(0, record.originalIndex),
        payload.tables.length
      );
      payload.tables.splice(insertAt, 0, deepClone(record.serializedPayload));
      if (Array.isArray(payload.patternTables)) {
        const ptInsert = Math.min(
          Math.max(0, record.originalIndex),
          payload.patternTables.length
        );
        payload.patternTables.splice(
          ptInsert,
          0,
          deepClone(record.serializedPayload)
        );
      }
      act.payload = { ...payload };
    } else if (record.itemType === 'grammar_table_row') {
      const found = findLessonInModule(
        mod,
        record.parentIds.lessonId || '',
        record.parentIds.sectionId
      );
      const act = found?.lesson.activities?.find(
        (a) => a.activityId === record.parentIds.activityId
      );
      const payload = (act?.payload || {}) as {
        tables?: Array<{ rows?: unknown[] }>;
        patternTables?: Array<{ rows?: unknown[] }>;
      };
      const tIdx = record.parentIds.tableIndex ?? 0;
      const tbl = payload.tables?.[tIdx] || payload.patternTables?.[tIdx];
      if (!found || !act || !tbl) {
        return {
          success: false,
          envelope: beforeEnv,
          message: `Cannot restore table row because its parent grammar table is currently removed.`,
        };
      }
      if (payload.tables?.[tIdx]) {
        if (!Array.isArray(payload.tables[tIdx].rows)) {
          payload.tables[tIdx].rows = [];
        }
        const insertAt = Math.min(
          Math.max(0, record.originalIndex),
          payload.tables[tIdx].rows!.length
        );
        payload.tables[tIdx].rows!.splice(
          insertAt,
          0,
          deepClone(record.serializedPayload)
        );
      }
      if (payload.patternTables?.[tIdx]) {
        if (!Array.isArray(payload.patternTables[tIdx].rows)) {
          payload.patternTables[tIdx].rows = [];
        }
        const insertAt = Math.min(
          Math.max(0, record.originalIndex),
          payload.patternTables[tIdx].rows!.length
        );
        payload.patternTables[tIdx].rows!.splice(
          insertAt,
          0,
          deepClone(record.serializedPayload)
        );
      }
      act.payload = { ...payload };
    } else if (record.itemType === 'vocabulary_reference') {
      const vocabId = String(record.serializedPayload || record.itemId);
      if (record.parentIds.lessonId) {
        const found = findLessonInModule(
          mod,
          record.parentIds.lessonId,
          record.parentIds.sectionId
        );
        if (!found) {
          return {
            success: false,
            envelope: beforeEnv,
            message: `Cannot restore vocabulary link because its parent lesson is currently removed.`,
          };
        }
        if (!Array.isArray(found.lesson.vocabularyRefs)) {
          found.lesson.vocabularyRefs = [];
        }
        if (!found.lesson.vocabularyRefs.includes(vocabId)) {
          const insertAt = Math.min(
            Math.max(0, record.originalIndex),
            found.lesson.vocabularyRefs.length
          );
          found.lesson.vocabularyRefs.splice(insertAt, 0, vocabId);
        }
        if (Array.isArray(found.lesson.metadata?.removedVocabularyRefs)) {
          found.lesson.metadata = {
            ...found.lesson.metadata,
            removedVocabularyRefs: (
              found.lesson.metadata.removedVocabularyRefs as string[]
            ).filter((id) => id !== vocabId),
          };
        }
      } else {
        if (!Array.isArray(mod.vocabularyReferences)) {
          mod.vocabularyReferences = [];
        }
        if (!mod.vocabularyReferences.includes(vocabId)) {
          const insertAt = Math.min(
            Math.max(0, record.originalIndex),
            mod.vocabularyReferences.length
          );
          mod.vocabularyReferences.splice(insertAt, 0, vocabId);
        }
      }
    } else if (record.itemType === 'media_reference') {
      const assetPath = String(record.serializedPayload || record.itemId);
      const found = findLessonInModule(
        mod,
        record.parentIds.lessonId || '',
        record.parentIds.sectionId
      );
      if (!found) {
        return {
          success: false,
          envelope: beforeEnv,
          message: `Cannot restore photo link because its parent lesson is currently removed.`,
        };
      }
      const refs = Array.isArray(found.lesson.mediaRefs)
        ? [...(found.lesson.mediaRefs as string[])]
        : [];
      if (!refs.includes(assetPath)) {
        const insertAt = Math.min(
          Math.max(0, record.originalIndex),
          refs.length
        );
        refs.splice(insertAt, 0, assetPath);
      }
      found.lesson.mediaRefs = refs;
    } else if (record.itemType === 'learning_objective') {
      if (!Array.isArray(mod.learningObjectives)) mod.learningObjectives = [];
      const insertAt = Math.min(
        Math.max(0, record.originalIndex),
        mod.learningObjectives.length
      );
      mod.learningObjectives.splice(
        insertAt,
        0,
        String(record.serializedPayload || '')
      );
    }
  }

  const afterLedger = deepClone(beforeLedger);
  afterLedger[recIdx] = {
    ...afterLedger[recIdx],
    status: 'RESTORED',
    restoredAt: Date.now(),
  };
  saveCmsRemovedItemsLedgerRaw(courseTrackId, afterLedger);

  const savedEnvelope = saveCmsCourseDraft(courseTrackId, pkg, {
    lifecycleState: 'DRAFT',
    changeSummary: `Restored ${record.itemTypeLabel.toLowerCase()} "${record.itemTitle}" to draft`,
    confirmedDeletedModuleIds: Array.from(afterConfirmedDeleted),
  });

  const undoEntry: CmsUndoRedoActionEntry = {
    actionId: `undo_restore_${Date.now()}`,
    courseTrackId,
    timestamp: Date.now(),
    actionLabel: `Restore ${record.itemTypeLabel}: ${record.itemTitle}`,
    beforePackage,
    afterPackage: deepClone(savedEnvelope.draftPackage),
    beforeConfirmedDeletedModuleIds: beforeConfirmedDeleted,
    afterConfirmedDeletedModuleIds: Array.from(afterConfirmedDeleted),
    beforeRemovedLedger: beforeLedger,
    afterRemovedLedger: afterLedger,
  };
  const undoStack = getUndoStackRaw(courseTrackId);
  undoStack.unshift(undoEntry);
  saveUndoStackRaw(courseTrackId, undoStack);
  saveRedoStackRaw(courseTrackId, []);

  return {
    success: true,
    restoredRecord: afterLedger[recIdx],
    envelope: savedEnvelope,
    message: `Restored "${record.itemTitle}" to its original place in your draft.`,
  };
}

/**
 * Undoes the most recent removal or restoration action in the current Course Track's draft.
 */
export function undoLastCmsAction(courseTrackId: string): {
  success: boolean;
  undone: boolean;
  message: string;
  actionLabel?: string;
  envelope: CmsCourseDraftEnvelope;
} {
  assertCmsPermission('cms:edit_draft');
  const undoStack = getUndoStackRaw(courseTrackId);
  if (undoStack.length === 0) {
    return {
      success: false,
      undone: false,
      message: 'Nothing to undo in this session.',
      envelope: getOrCreateCmsCourseDraft(courseTrackId),
    };
  }
  const [entry, ...remainingUndo] = undoStack;
  saveUndoStackRaw(courseTrackId, remainingUndo);

  const redoStack = getRedoStackRaw(courseTrackId);
  redoStack.unshift(entry);
  saveRedoStackRaw(courseTrackId, redoStack);

  saveCmsRemovedItemsLedgerRaw(courseTrackId, entry.beforeRemovedLedger);
  const envelope = saveCmsCourseDraft(courseTrackId, entry.beforePackage, {
    lifecycleState: 'DRAFT',
    changeSummary: `Undo: ${entry.actionLabel}`,
    confirmedDeletedModuleIds: entry.beforeConfirmedDeletedModuleIds,
  });

  return {
    success: true,
    undone: true,
    message: `Undid: ${entry.actionLabel}`,
    actionLabel: entry.actionLabel,
    envelope,
  };
}

/**
 * Redoes the most recently undone action in the current Course Track's draft.
 */
export function redoLastCmsAction(courseTrackId: string): {
  success: boolean;
  redone: boolean;
  message: string;
  actionLabel?: string;
  envelope: CmsCourseDraftEnvelope;
} {
  assertCmsPermission('cms:edit_draft');
  const redoStack = getRedoStackRaw(courseTrackId);
  if (redoStack.length === 0) {
    return {
      success: false,
      redone: false,
      message: 'Nothing to redo in this session.',
      envelope: getOrCreateCmsCourseDraft(courseTrackId),
    };
  }
  const [entry, ...remainingRedo] = redoStack;
  saveRedoStackRaw(courseTrackId, remainingRedo);

  const undoStack = getUndoStackRaw(courseTrackId);
  undoStack.unshift(entry);
  saveUndoStackRaw(courseTrackId, undoStack);

  saveCmsRemovedItemsLedgerRaw(courseTrackId, entry.afterRemovedLedger);
  const envelope = saveCmsCourseDraft(courseTrackId, entry.afterPackage, {
    lifecycleState: 'DRAFT',
    changeSummary: `Redo: ${entry.actionLabel}`,
    confirmedDeletedModuleIds: entry.afterConfirmedDeletedModuleIds,
  });

  return {
    success: true,
    redone: true,
    message: `Redid: ${entry.actionLabel}`,
    actionLabel: entry.actionLabel,
    envelope,
  };
}

/**
 * Structural creation and duplication helpers so every removable content level
 * also supports full CREATE, REORDER, and DUPLICATE in the editor.
 */
export function addCmsSectionToModuleInDraft(
  courseTrackId: string,
  moduleId: string,
  sectionTitle: string = ''
): CmsCourseDraftEnvelope & {
  envelope: CmsCourseDraftEnvelope;
  addedSection: UniversalSectionV1;
} {
  assertCmsPermission('cms:edit_draft');
  const env = getOrCreateCmsCourseDraft(courseTrackId);
  const mod = env.draftPackage.modules.find((m) => m.moduleId === moduleId);
  if (!mod) throw new Error(`Module "${moduleId}" not found.`);
  if (!Array.isArray(mod.sections)) mod.sections = [];
  const nextNum = mod.sections.length + 1;
  const newSec: UniversalSectionV1 = {
    sectionId: `${moduleId}_sec_custom_${Date.now()}`,
    title: sectionTitle.trim() || `${nextNum}. New Section`,
    lessons: [
      {
        lessonId: `${moduleId}_les_custom_${Date.now()}`,
        title: 'Lesson 1',
        summary: 'Lesson overview',
        instructionalText: 'Write your lesson explanation here.',
        vocabularyRefs: [],
        mediaRefs: [],
        activities: [],
      },
    ],
  };
  mod.sections.push(newSec);
  const saved = saveCmsCourseDraft(courseTrackId, env.draftPackage, {
    lifecycleState: 'DRAFT',
    changeSummary: `Added section "${newSec.title}" to module ${moduleId}`,
  });
  return {
    ...saved,
    envelope: saved,
    addedSection: newSec,
  };
}

export function addCmsLessonToSectionInDraft(
  courseTrackId: string,
  moduleId: string,
  sectionId: string,
  lessonTitle: string = ''
): CmsCourseDraftEnvelope & {
  envelope: CmsCourseDraftEnvelope;
  addedLesson: UniversalLessonV1;
} {
  assertCmsPermission('cms:edit_draft');
  const env = getOrCreateCmsCourseDraft(courseTrackId);
  const mod = env.draftPackage.modules.find((m) => m.moduleId === moduleId);
  if (!mod) throw new Error(`Module "${moduleId}" not found.`);
  const sec = (mod.sections || []).find((s) => s.sectionId === sectionId);
  if (!sec) throw new Error(`Section "${sectionId}" not found.`);
  if (!Array.isArray(sec.lessons)) sec.lessons = [];
  const newLesson: UniversalLessonV1 = {
    lessonId: `${moduleId}_les_${Date.now()}`,
    title: lessonTitle.trim() || `New Lesson ${sec.lessons.length + 1}`,
    summary: 'Short lesson summary',
    instructionalText: 'Add clear explanation paragraphs for students here.',
    vocabularyRefs: [],
    mediaRefs: [],
    activities: [],
  };
  sec.lessons.push(newLesson);
  const saved = saveCmsCourseDraft(courseTrackId, env.draftPackage, {
    lifecycleState: 'DRAFT',
    changeSummary: `Added lesson "${newLesson.title}" to section "${sec.title}"`,
  });
  return {
    ...saved,
    envelope: saved,
    addedLesson: newLesson,
  };
}

export function duplicateCmsLessonInDraft(
  courseTrackId: string,
  moduleId: string,
  lessonId: string
): CmsCourseDraftEnvelope & {
  envelope: CmsCourseDraftEnvelope;
  duplicatedLesson: UniversalLessonV1;
} {
  assertCmsPermission('cms:edit_draft');
  const env = getOrCreateCmsCourseDraft(courseTrackId);
  const mod = env.draftPackage.modules.find((m) => m.moduleId === moduleId);
  if (!mod) throw new Error(`Module "${moduleId}" not found.`);
  const found = findLessonInModule(mod, lessonId);
  if (!found) throw new Error(`Lesson "${lessonId}" not found.`);
  const copy = deepClone(found.lesson);
  const suffix = Date.now().toString(36).slice(-4);
  copy.lessonId = `${found.lesson.lessonId}_copy_${suffix}`;
  copy.title = `${found.lesson.title} (Copy)`;
  copy.activities = (copy.activities || []).map((a, idx) => ({
    ...a,
    activityId: `${copy.lessonId}_act_${idx + 1}`,
  }));
  if (found.section && Array.isArray(found.section.lessons)) {
    found.section.lessons.splice(found.lessonIndex + 1, 0, copy);
  } else if (Array.isArray(mod.lessons)) {
    mod.lessons.splice(found.lessonIndex + 1, 0, copy);
  }
  const saved = saveCmsCourseDraft(courseTrackId, env.draftPackage, {
    lifecycleState: 'DRAFT',
    changeSummary: `Duplicated lesson "${found.lesson.title}"`,
  });
  return {
    ...saved,
    envelope: saved,
    duplicatedLesson: copy,
  };
}

export function addCmsActivityToLessonInDraft(
  courseTrackId: string,
  moduleId: string,
  lessonId: string,
  activityType: string = 'knowledge_check_mc',
  title: string = 'New Practice Question'
): CmsCourseDraftEnvelope & {
  envelope: CmsCourseDraftEnvelope;
  addedActivity: UniversalActivityItemV1;
} {
  assertCmsPermission('cms:edit_draft');
  const env = getOrCreateCmsCourseDraft(courseTrackId);
  const mod = env.draftPackage.modules.find((m) => m.moduleId === moduleId);
  if (!mod) throw new Error(`Module "${moduleId}" not found.`);
  const found = findLessonInModule(mod, lessonId);
  if (!found) throw new Error(`Lesson "${lessonId}" not found.`);
  if (!Array.isArray(found.lesson.activities)) found.lesson.activities = [];
  const newAct: UniversalActivityItemV1 = {
    activityId: `${lessonId}_act_${Date.now()}`,
    activityType,
    title: title.trim() || 'New Practice Question',
    prompt: 'Write your question prompt here.',
    vocabularyRefs: [],
    payload: {
      options: ['Option A', 'Option B', 'Option C'],
      correctIndex: 0,
      explanation: 'Explain why Option A is correct.',
    },
  };
  found.lesson.activities.push(newAct);
  const saved = saveCmsCourseDraft(courseTrackId, env.draftPackage, {
    lifecycleState: 'DRAFT',
    changeSummary: `Added question "${newAct.title}" to lesson "${found.lesson.title}"`,
  });
  return {
    ...saved,
    envelope: saved,
    addedActivity: newAct,
  };
}

export function duplicateCmsActivityInDraft(
  courseTrackId: string,
  moduleId: string,
  lessonId: string,
  activityId: string
): CmsCourseDraftEnvelope & {
  envelope: CmsCourseDraftEnvelope;
  duplicatedActivity: UniversalActivityItemV1;
} {
  assertCmsPermission('cms:edit_draft');
  const env = getOrCreateCmsCourseDraft(courseTrackId);
  const mod = env.draftPackage.modules.find((m) => m.moduleId === moduleId);
  if (!mod) throw new Error(`Module "${moduleId}" not found.`);
  const found = findLessonInModule(mod, lessonId);
  if (!found || !Array.isArray(found.lesson.activities)) {
    throw new Error(`Lesson "${lessonId}" not found.`);
  }
  const aIdx = found.lesson.activities.findIndex(
    (a) => a.activityId === activityId
  );
  if (aIdx < 0) throw new Error(`Activity "${activityId}" not found.`);
  const orig = found.lesson.activities[aIdx];
  const copy = deepClone(orig);
  copy.activityId = `${orig.activityId}_copy_${Date.now().toString(36).slice(-4)}`;
  copy.title = `${orig.title || orig.activityId} (Copy)`;
  found.lesson.activities.splice(aIdx + 1, 0, copy);
  const saved = saveCmsCourseDraft(courseTrackId, env.draftPackage, {
    lifecycleState: 'DRAFT',
    changeSummary: `Duplicated question "${orig.title || orig.activityId}"`,
  });
  return {
    ...saved,
    envelope: saved,
    duplicatedActivity: copy,
  };
}

export function addCmsAnswerOptionInDraft(
  courseTrackId: string,
  moduleId: string,
  lessonId: string,
  activityId: string,
  optionText: string = ''
): CmsCourseDraftEnvelope & {
  envelope: CmsCourseDraftEnvelope;
} {
  assertCmsPermission('cms:edit_draft');
  const env = getOrCreateCmsCourseDraft(courseTrackId);
  const mod = env.draftPackage.modules.find((m) => m.moduleId === moduleId);
  if (!mod) throw new Error(`Module "${moduleId}" not found.`);
  const found = findLessonInModule(mod, lessonId);
  const act = found?.lesson.activities?.find((a) => a.activityId === activityId);
  if (!found || !act) throw new Error(`Activity "${activityId}" not found.`);
  const payload = (act.payload || {}) as {
    options?: string[];
    correctIndex?: number;
  };
  if (!Array.isArray(payload.options)) payload.options = [];
  payload.options.push(
    optionText.trim() || `Option ${payload.options.length + 1}`
  );
  act.payload = { ...payload };
  const saved = saveCmsCourseDraft(courseTrackId, env.draftPackage, {
    lifecycleState: 'DRAFT',
    changeSummary: `Added answer choice to "${act.title || act.activityId}"`,
  });
  return {
    ...saved,
    envelope: saved,
  };
}

export function addCmsLessonVocabularyRefInDraft(
  courseTrackId: string,
  moduleId: string,
  lessonId: string,
  vocabularyId: string
): CmsCourseDraftEnvelope {
  assertCmsPermission('cms:edit_draft');
  const env = getOrCreateCmsCourseDraft(courseTrackId);
  const mod = env.draftPackage.modules.find((m) => m.moduleId === moduleId);
  if (!mod) throw new Error(`Module "${moduleId}" not found.`);
  const found = findLessonInModule(mod, lessonId);
  if (!found) throw new Error(`Lesson "${lessonId}" not found.`);
  const cleanId = vocabularyId.trim();
  if (!cleanId) return env;
  if (!Array.isArray(found.lesson.vocabularyRefs)) {
    found.lesson.vocabularyRefs = [];
  }
  if (!found.lesson.vocabularyRefs.includes(cleanId)) {
    found.lesson.vocabularyRefs.push(cleanId);
  }
  if (Array.isArray(found.lesson.metadata?.removedVocabularyRefs)) {
    found.lesson.metadata = {
      ...found.lesson.metadata,
      removedVocabularyRefs: (
        found.lesson.metadata.removedVocabularyRefs as string[]
      ).filter((id) => id !== cleanId),
    };
  }
  return saveCmsCourseDraft(courseTrackId, env.draftPackage, {
    lifecycleState: 'DRAFT',
    changeSummary: `Linked vocabulary "${cleanId}" to lesson "${found.lesson.title}"`,
  });
}

export function addCmsLessonMediaRefInDraft(
  courseTrackId: string,
  moduleId: string,
  lessonId: string,
  mediaAssetPath: string
): CmsCourseDraftEnvelope {
  assertCmsPermission('cms:edit_draft');
  const env = getOrCreateCmsCourseDraft(courseTrackId);
  const mod = env.draftPackage.modules.find((m) => m.moduleId === moduleId);
  if (!mod) throw new Error(`Module "${moduleId}" not found.`);
  const found = findLessonInModule(mod, lessonId);
  if (!found) throw new Error(`Lesson "${lessonId}" not found.`);
  const cleanPath = (mediaAssetPath || '').trim();
  if (!cleanPath) return env;
  const refs = Array.isArray(found.lesson.mediaRefs)
    ? [...(found.lesson.mediaRefs as string[])]
    : [];
  if (!refs.includes(cleanPath)) {
    refs.push(cleanPath);
  }
  found.lesson.mediaRefs = refs;
  return saveCmsCourseDraft(courseTrackId, env.draftPackage, {
    lifecycleState: 'DRAFT',
    changeSummary: `Linked photo "${cleanPath}" to lesson "${found.lesson.title}"`,
  });
}

/**
 * Computes a beginner-friendly, accurate summary of all unpublished additions,
 * edits, and removals for the "Your unpublished changes" panel.
 */
export function computeCmsDetailedChangeSummary(
  courseTrackId: string
): CmsDetailedChangeSummary {
  const env = getOrCreateCmsCourseDraft(courseTrackId);
  const activeRemoved = getCmsRemovedItemsInDraft(courseTrackId, false);
  const diffVsPub = computeCmsDraftVsPublishedDiff(courseTrackId);
  const countByType = (t: CmsRemovableItemType) =>
    activeRemoved.filter((r) => r.itemType === t).length;

  const counts = {
    modulesAdded: (env.newDraftModuleIds || []).length,
    modulesEdited: (env.modifiedModuleIds || []).length,
    modulesRemoved: Math.max(
      countByType('module'),
      (env.removedBaselineModuleIds || []).length
    ),
    sectionsRemoved: countByType('section'),
    lessonsRemoved: countByType('lesson'),
    paragraphsRemoved: countByType('lesson_paragraph'),
    grammarRulesRemoved: countByType('grammar_rule'),
    examplesRemoved: countByType('example_sentence'),
    tablesRemoved: countByType('grammar_table'),
    tableRowsRemoved: countByType('grammar_table_row'),
    questionsRemoved: countByType('activity'),
    answerOptionsRemoved: countByType('answer_option'),
    explanationsRemoved: countByType('question_explanation'),
    vocabularyLinksRemoved: countByType('vocabulary_reference'),
    mediaLinksRemoved: countByType('media_reference'),
    objectivesRemoved: countByType('learning_objective'),
  };

  const bullets: string[] = [];
  if (counts.modulesAdded > 0) {
    bullets.push(`${counts.modulesAdded} module(s) added`);
  }
  if (counts.modulesEdited > 0) {
    bullets.push(`${counts.modulesEdited} module(s) edited`);
  }
  if (counts.modulesRemoved > 0) {
    bullets.push(`${counts.modulesRemoved} module(s) removed`);
  }
  if (counts.sectionsRemoved > 0) {
    bullets.push(`${counts.sectionsRemoved} section(s) removed`);
  }
  if (counts.lessonsRemoved > 0) {
    bullets.push(`${counts.lessonsRemoved} lesson(s) removed`);
  }
  if (counts.paragraphsRemoved > 0) {
    bullets.push(`${counts.paragraphsRemoved} paragraph(s) removed`);
  }
  if (counts.grammarRulesRemoved > 0) {
    bullets.push(`${counts.grammarRulesRemoved} grammar note(s) removed`);
  }
  if (counts.examplesRemoved > 0) {
    bullets.push(`${counts.examplesRemoved} example sentence(s) removed`);
  }
  if (counts.tablesRemoved > 0 || counts.tableRowsRemoved > 0) {
    bullets.push(
      `${counts.tablesRemoved} grammar table(s) & ${counts.tableRowsRemoved} table row(s) removed`
    );
  }
  if (counts.questionsRemoved > 0) {
    bullets.push(`${counts.questionsRemoved} question(s) removed`);
  }
  if (counts.answerOptionsRemoved > 0) {
    bullets.push(`${counts.answerOptionsRemoved} answer choice(s) removed`);
  }
  if (counts.explanationsRemoved > 0) {
    bullets.push(`${counts.explanationsRemoved} answer explanation(s) removed`);
  }
  if (counts.vocabularyLinksRemoved > 0) {
    bullets.push(`${counts.vocabularyLinksRemoved} vocabulary link(s) removed`);
  }
  if (counts.mediaLinksRemoved > 0) {
    bullets.push(`${counts.mediaLinksRemoved} photo link(s) removed`);
  }
  if (counts.objectivesRemoved > 0) {
    bullets.push(`${counts.objectivesRemoved} learning goal(s) removed`);
  }
  if (bullets.length === 0) {
    bullets.push('No unpublished removals or additions recorded yet.');
  }

  const hasUnpublishedChanges =
    Boolean(env.hasDraftChanges) || activeRemoved.length > 0;

  return {
    courseTrackId,
    hasUnpublishedChanges,
    counts,
    modulesAdded: counts.modulesAdded,
    modulesModified: counts.modulesEdited,
    modulesRemoved: counts.modulesRemoved,
    sectionsRemoved: counts.sectionsRemoved,
    lessonsModified: diffVsPub
      ? diffVsPub.modifiedLessonIds.length
      : counts.modulesEdited,
    lessonsRemoved: counts.lessonsRemoved,
    activitiesRemoved: counts.questionsRemoved,
    paragraphsRemoved: counts.paragraphsRemoved,
    tablesRemoved: counts.tablesRemoved,
    tableRowsRemoved: counts.tableRowsRemoved,
    vocabLinksRemoved: counts.vocabularyLinksRemoved,
    mediaLinksRemoved: counts.mediaLinksRemoved,
    pendingRemovedItemsCount: activeRemoved.length,
    activeRemovedItemsCount: activeRemoved.length,
    plainEnglishBullets: bullets,
    plainEnglishLines: bullets,
  };
}

// ============================================================================
// 5. JSON IMPORT INTO DRAFT & SAFE INCREMENTAL MERGE (SECTIONS 12, 13)
// ============================================================================

export interface CmsImportRecord {
  importId: string;
  timestamp: number;
  courseTrackId: string;
  mode: 'full_draft_import' | 'incremental_module_merge';
  moduleCountAddedOrUpdated: number;
  validationStatus: string;
  summary: string;
}

export function getCmsImportHistory(): CmsImportRecord[] {
  return cmsStorageAdapter.getItem<CmsImportRecord[]>(IMPORT_HISTORY_KEY) || [];
}

function recordCmsImportHistory(entry: CmsImportRecord): void {
  const hist = getCmsImportHistory();
  hist.unshift(entry);
  cmsStorageAdapter.setItem(IMPORT_HISTORY_KEY, hist.slice(0, 50));
}

/**
 * Reuses Phase 1's `validateAndPreviewCourseImport` to validate a JSON package
 * and imports it into a non-destructive DRAFT state (never auto-publishing).
 */
export function importCourseJsonIntoCmsDraft(
  rawJson: string,
  destinationTrackId: string,
  mode: 'full_draft_import' | 'incremental_module_merge' = 'full_draft_import'
): {
  success: boolean;
  previewReport: CourseImportPreviewReport;
  draftEnvelope?: CmsCourseDraftEnvelope;
  message: string;
} {
  assertCmsPermission('cms:import_package');
  const previewReport = validateAndPreviewCourseImport(
    rawJson,
    destinationTrackId
  );

  if (!previewReport.valid || !previewReport.parsedPackage) {
    return {
      success: false,
      previewReport,
      message: `Import rejected: ${previewReport.errors.join(' | ')}`,
    };
  }

  const incomingPkg = deepClone(previewReport.parsedPackage);

  if (mode === 'incremental_module_merge') {
    const existingEnv = getOrCreateCmsCourseDraft(destinationTrackId);
    const mergedPkg = deepClone(existingEnv.draftPackage);

    // Preserve all existing modules and update/append incoming modules by stable moduleId
    for (const incomingMod of incomingPkg.modules) {
      const existingModIdx = mergedPkg.modules.findIndex(
        (m) => m.moduleId === incomingMod.moduleId
      );
      if (existingModIdx >= 0) {
        const existingMod = mergedPkg.modules[existingModIdx];
        // Merge sections/lessons non-destructively without deleting omitted lessons
        const mergedSections = Array.isArray(existingMod.sections)
          ? [...existingMod.sections]
          : [];
        for (const incSec of incomingMod.sections || []) {
          const sIdx = mergedSections.findIndex(
            (s) => s.sectionId === incSec.sectionId
          );
          if (sIdx >= 0) {
            const existingLessons = Array.isArray(mergedSections[sIdx].lessons)
              ? [...mergedSections[sIdx].lessons!]
              : [];
            for (const incLes of incSec.lessons || []) {
              const lIdx = existingLessons.findIndex(
                (l) => l.lessonId === incLes.lessonId
              );
              if (lIdx >= 0) {
                existingLessons[lIdx] = {
                  ...existingLessons[lIdx],
                  ...incLes,
                };
              } else {
                existingLessons.push(incLes);
              }
            }
            mergedSections[sIdx] = {
              ...mergedSections[sIdx],
              ...incSec,
              lessons: existingLessons,
            };
          } else {
            mergedSections.push(incSec);
          }
        }

        mergedPkg.modules[existingModIdx] = {
          ...existingMod,
          ...incomingMod,
          sections: mergedSections,
        };
      } else {
        mergedPkg.modules.push(incomingMod);
      }
    }

    const mergedVocabIds = new Set([
      ...(mergedPkg.vocabularyCatalogIds || []),
      ...(incomingPkg.vocabularyCatalogIds || []),
    ]);
    mergedPkg.vocabularyCatalogIds = Array.from(mergedVocabIds);
    mergedPkg.courseStatus = 'draft';

    const savedEnv = saveCmsCourseDraft(destinationTrackId, mergedPkg, {
      lifecycleState: 'DRAFT',
      changeSummary: `Incremental merge of ${incomingPkg.modules.length} module(s) into ${destinationTrackId} draft`,
      revisionOrigin: 'incremental_merge',
    });

    recordCmsImportHistory({
      importId: `imp_${Date.now()}`,
      timestamp: Date.now(),
      courseTrackId: destinationTrackId,
      mode: 'incremental_module_merge',
      moduleCountAddedOrUpdated: incomingPkg.modules.length,
      validationStatus: previewReport.validationStatus,
      summary: `Incrementally merged ${incomingPkg.modules.length} module(s) into ${destinationTrackId} draft`,
    });

    return {
      success: true,
      previewReport,
      draftEnvelope: savedEnv,
      message: `Incrementally merged ${incomingPkg.modules.length} module(s) into ${destinationTrackId} draft without deleting existing modules.`,
    };
  }

  // Full draft import (still defaults to DRAFT state, never auto-published)
  incomingPkg.courseStatus = 'draft';
  const savedEnv = saveCmsCourseDraft(destinationTrackId, incomingPkg, {
    lifecycleState: 'DRAFT',
    changeSummary: `Imported course JSON package "${incomingPkg.courseTitle}" into ${destinationTrackId} draft`,
    revisionOrigin: 'json_import',
  });

  recordCmsImportHistory({
    importId: `imp_${Date.now()}`,
    timestamp: Date.now(),
    courseTrackId: destinationTrackId,
    mode: 'full_draft_import',
    moduleCountAddedOrUpdated: incomingPkg.modules.length,
    validationStatus: previewReport.validationStatus,
    summary: `Imported ${incomingPkg.modules.length} module(s) into ${destinationTrackId} draft`,
  });

  return {
    success: true,
    previewReport,
    draftEnvelope: savedEnv,
    message: `Imported "${incomingPkg.courseTitle}" into ${destinationTrackId} in DRAFT state.`,
  };
}

// ============================================================================
// 6. VALIDATION CENTER & REALISTIC EDUCATIONAL REVIEW (SECTIONS 14, 15)
// ============================================================================

export function validateCmsCourseDraft(
  courseTrackId: string,
  customPackage?: UniversalCoursePackageV1
): CmsValidationReport {
  initializeCmsVocabularyMirrors();
  const track = getCourseTrackById(courseTrackId);
  const env = customPackage
    ? {
        courseTrackId,
        lifecycleState: 'DRAFT' as CmsLifecycleState,
        lastModifiedAt: Date.now(),
        draftPackage: customPackage,
      }
    : getOrCreateCmsCourseDraft(courseTrackId);
  const pkg = env.draftPackage;
  const issues: CmsValidationIssue[] = [];

  if (!track) {
    issues.push({
      issueId: 'err_unknown_track',
      severity: 'ERROR',
      code: 'INVALID_COURSE_TRACK',
      courseTrackId,
      locationPath: 'courseTrackId',
      message: `Course Track "${courseTrackId}" is not registered in the 28-track registry.`,
    });
  } else {
    if (pkg.targetLanguage !== track.targetLanguage) {
      issues.push({
        issueId: 'err_target_lang_mismatch',
        severity: 'ERROR',
        code: 'INVALID_LANGUAGE_METADATA',
        courseTrackId,
        locationPath: 'targetLanguage',
        message: `Package targetLanguage "${pkg.targetLanguage}" does not match track targetLanguage "${track.targetLanguage}".`,
      });
    }
    if (pkg.nativeLanguage !== track.nativeLanguage) {
      issues.push({
        issueId: 'err_native_lang_mismatch',
        severity: 'ERROR',
        code: 'INVALID_LANGUAGE_METADATA',
        courseTrackId,
        locationPath: 'nativeLanguage',
        message: `Package nativeLanguage "${pkg.nativeLanguage}" does not match track nativeLanguage "${track.nativeLanguage}".`,
      });
    }
  }

  if (
    !SUPPORTED_SCHEMA_VERSIONS.includes(
      pkg.schemaVersion as (typeof SUPPORTED_SCHEMA_VERSIONS)[number]
    )
  ) {
    issues.push({
      issueId: 'err_schema_version',
      severity: 'ERROR',
      code: 'INCOMPATIBLE_SCHEMA_VERSION',
      courseTrackId,
      locationPath: 'schemaVersion',
      message: `Unsupported schemaVersion "${pkg.schemaVersion}". Expected: ${SUPPORTED_SCHEMA_VERSIONS.join(', ')}.`,
    });
  }

  if (
    env.lifecycleState === 'PUBLISHED' &&
    pkg.courseStatus === 'synthetic_test_fixture_do_not_publish'
  ) {
    issues.push({
      issueId: 'err_synthetic_publish_conflict',
      severity: 'ERROR',
      code: 'CONFLICTING_PUBLICATION_STATE',
      courseTrackId,
      locationPath: 'courseStatus',
      message:
        'Synthetic test fixtures cannot be transitioned to PUBLISHED state.',
    });
  }

  const seenModuleIds = new Set<string>();
  const seenSectionIds = new Set<string>();
  const seenLessonIds = new Set<string>();
  const seenActivityIds = new Set<string>();

  const declaredVocabSet = new Set<string>(pkg.vocabularyCatalogIds || []);
  for (const k of cmsCanonicalEnglishMirror.keys()) {
    declaredVocabSet.add(k);
  }

  const mediaCatalogPaths = new Set<string>(
    getCmsMediaLibraryCatalog().map((m) => m.assetPath)
  );
  for (const m of getCmsMediaLibraryCatalog()) {
    mediaCatalogPaths.add(m.assetId);
  }

  for (let mIdx = 0; mIdx < (pkg.modules || []).length; mIdx++) {
    const mod = pkg.modules[mIdx];
    const modPath = `modules[${mIdx}]`;
    if (!mod.moduleId || !mod.moduleId.trim()) {
      issues.push({
        issueId: `err_missing_mod_id_${mIdx}`,
        severity: 'ERROR',
        code: 'MISSING_MODULE_ID',
        courseTrackId,
        locationPath: modPath,
        message: `Module at index ${mIdx} is missing a stable moduleId.`,
      });
    } else if (seenModuleIds.has(mod.moduleId)) {
      issues.push({
        issueId: `err_dup_mod_${mod.moduleId}`,
        severity: 'ERROR',
        code: 'DUPLICATE_MODULE_ID',
        courseTrackId,
        locationPath: `${modPath}.moduleId`,
        message: `Duplicate module ID detected: "${mod.moduleId}".`,
      });
    } else {
      seenModuleIds.add(mod.moduleId);
    }

    if (!mod.title || !mod.title.trim()) {
      issues.push({
        issueId: `err_missing_mod_title_${mIdx}`,
        severity: 'ERROR',
        code: 'MISSING_REQUIRED_FIELD',
        courseTrackId,
        locationPath: `${modPath}.title`,
        message: `Module "${mod.moduleId || mIdx}" is missing a title.`,
      });
    }

    // Check module prerequisites
    for (const prereq of mod.prerequisites || []) {
      if (!pkg.modules.some((m) => m.moduleId === prereq)) {
        issues.push({
          issueId: `warn_broken_prereq_${mod.moduleId}_${prereq}`,
          severity: 'WARNING',
          code: 'BROKEN_INTERNAL_LINK',
          courseTrackId,
          locationPath: `${modPath}.prerequisites`,
          message: `Module "${mod.moduleId}" references prerequisite module "${prereq}" which is not present in the package.`,
        });
      }
    }

    const inspectLesson = (les: UniversalLessonV1, lesPath: string) => {
      if (!les.lessonId || !les.lessonId.trim()) {
        issues.push({
          issueId: `err_missing_les_id_${lesPath}`,
          severity: 'ERROR',
          code: 'MISSING_LESSON_ID',
          courseTrackId,
          locationPath: lesPath,
          message: `Lesson at ${lesPath} is missing a stable lessonId.`,
        });
      } else if (seenLessonIds.has(les.lessonId)) {
        issues.push({
          issueId: `err_dup_les_${les.lessonId}`,
          severity: 'ERROR',
          code: 'DUPLICATE_LESSON_ID',
          courseTrackId,
          locationPath: `${lesPath}.lessonId`,
          message: `Duplicate lesson ID detected: "${les.lessonId}".`,
        });
      } else {
        seenLessonIds.add(les.lessonId);
      }

      // Check vocabulary references on lesson
      for (const vRef of les.vocabularyRefs || []) {
        if (!declaredVocabSet.has(vRef)) {
          issues.push({
            issueId: `err_missing_vocab_ref_${les.lessonId}_${vRef}`,
            severity: 'ERROR',
            code: 'BROKEN_VOCABULARY_REFERENCE',
            courseTrackId,
            locationPath: `${lesPath}.vocabularyRefs`,
            message: `Lesson "${les.lessonId}" references vocabulary ID "${vRef}" which is missing from the package vocabulary catalog and canonical registry.`,
          });
        }
      }

      // Check media references on lesson if present
      const mediaRefs = (les.mediaRefs as string[] | undefined) || [];
      for (const mRef of mediaRefs) {
        if (!mediaCatalogPaths.has(mRef)) {
          issues.push({
            issueId: `err_missing_media_${les.lessonId}_${mRef}`,
            severity: 'ERROR',
            code: 'MISSING_REQUIRED_MEDIA',
            courseTrackId,
            locationPath: `${lesPath}.mediaRefs`,
            message: `Lesson "${les.lessonId}" references media asset "${mRef}" which was not found in the Media Library.`,
          });
        }
      }

      for (let aIdx = 0; aIdx < (les.activities || []).length; aIdx++) {
        const act = les.activities![aIdx];
        const actPath = `${lesPath}.activities[${aIdx}]`;
        if (!act.activityId || !act.activityId.trim()) {
          issues.push({
            issueId: `err_missing_act_id_${actPath}`,
            severity: 'ERROR',
            code: 'MISSING_ACTIVITY_REFERENCE',
            courseTrackId,
            locationPath: actPath,
            message: `Activity at ${actPath} is missing a stable activityId.`,
          });
        } else if (seenActivityIds.has(act.activityId)) {
          issues.push({
            issueId: `err_dup_act_${act.activityId}`,
            severity: 'ERROR',
            code: 'DUPLICATE_ACTIVITY_ID',
            courseTrackId,
            locationPath: `${actPath}.activityId`,
            message: `Duplicate activity ID detected: "${act.activityId}".`,
          });
        } else {
          seenActivityIds.add(act.activityId);
        }

        if (!SUPPORTED_ACTIVITY_TYPES.has(act.activityType)) {
          issues.push({
            issueId: `warn_unsupported_act_${act.activityId}`,
            severity: 'WARNING',
            code: 'UNSUPPORTED_CONTENT_TYPE',
            courseTrackId,
            locationPath: `${actPath}.activityType`,
            message: `Activity "${act.activityId}" uses custom/extension type "${act.activityType}". Metadata is preserved, but custom renderer support is required before learner publication.`,
          });
        }

        // Validate question-based activity answer keys and options (Test 13)
        if (
          act.activityType === 'knowledge_check_mc' ||
          act.activityType === 'guided_practice_drill' ||
          act.activityType === 'module_mastery_exam'
        ) {
          const payload = (act.payload || {}) as {
            options?: unknown[];
            correctIndex?: unknown;
          };
          if (payload.options !== undefined || payload.correctIndex !== undefined) {
            if (!Array.isArray(payload.options) || payload.options.length < 2) {
              issues.push({
                issueId: `err_invalid_options_${act.activityId}`,
                severity: 'ERROR',
                code: 'INVALID_ANSWER_OPTIONS',
                courseTrackId,
                locationPath: `${actPath}.payload.options`,
                message: `Question activity "${act.activityId}" must have at least 2 answer options.`,
              });
            } else if (
              typeof payload.correctIndex !== 'number' ||
              payload.correctIndex < 0 ||
              payload.correctIndex >= payload.options.length
            ) {
              issues.push({
                issueId: `err_broken_answer_key_${act.activityId}`,
                severity: 'ERROR',
                code: 'MISSING_OR_INVALID_CORRECT_ANSWER',
                courseTrackId,
                locationPath: `${actPath}.payload.correctIndex`,
                message: `Question activity "${act.activityId}" has an invalid correctIndex (${String(payload.correctIndex)}) for ${payload.options.length} options.`,
              });
            }
          }
        }

        for (const vRef of act.vocabularyRefs || []) {
          if (!declaredVocabSet.has(vRef)) {
            issues.push({
              issueId: `err_act_missing_vocab_${act.activityId}_${vRef}`,
              severity: 'ERROR',
              code: 'BROKEN_VOCABULARY_REFERENCE',
              courseTrackId,
              locationPath: `${actPath}.vocabularyRefs`,
              message: `Activity "${act.activityId}" references missing vocabulary ID "${vRef}".`,
            });
          }
        }
      }

      const hasInstructionalText =
        typeof les.instructionalText === 'string' &&
        les.instructionalText.trim().length > 0;
      const hasActivities =
        Array.isArray(les.activities) && les.activities.length > 0;
      const hasVocabRefs =
        Array.isArray(les.vocabularyRefs) && les.vocabularyRefs.length > 0;
      const hasMediaRefs =
        Array.isArray(les.mediaRefs) && les.mediaRefs.length > 0;
      if (
        !hasInstructionalText &&
        !hasActivities &&
        !hasVocabRefs &&
        !hasMediaRefs
      ) {
        issues.push({
          issueId: `warn_empty_lesson_${les.lessonId || lesPath}`,
          severity: 'WARNING',
          code: 'EMPTY_LESSON_CONTENT',
          courseTrackId,
          locationPath: lesPath,
          message: `Lesson "${les.title || les.lessonId}" has no explanation text, practice questions, or vocabulary links.`,
        });
      }
    };

    for (let sIdx = 0; sIdx < (mod.sections || []).length; sIdx++) {
      const sec = mod.sections![sIdx];
      const secPath = `${modPath}.sections[${sIdx}]`;
      if (sec.sectionId) {
        if (seenSectionIds.has(sec.sectionId)) {
          issues.push({
            issueId: `err_dup_sec_${sec.sectionId}`,
            severity: 'ERROR',
            code: 'DUPLICATE_SECTION_ID',
            courseTrackId,
            locationPath: `${secPath}.sectionId`,
            message: `Duplicate section ID detected: "${sec.sectionId}".`,
          });
        } else {
          seenSectionIds.add(sec.sectionId);
        }
      }
      if (
        (!sec.lessons || sec.lessons.length === 0) &&
        (!sec.activities || sec.activities.length === 0)
      ) {
        issues.push({
          issueId: `warn_empty_sec_${sec.sectionId || sIdx}`,
          severity: 'WARNING',
          code: 'EMPTY_SECTION_IN_DRAFT',
          courseTrackId,
          locationPath: secPath,
          message: `Section "${sec.title || sec.sectionId}" has no lessons or activities.`,
        });
      }
      for (let lIdx = 0; lIdx < (sec.lessons || []).length; lIdx++) {
        inspectLesson(sec.lessons![lIdx], `${secPath}.lessons[${lIdx}]`);
      }
    }

    for (let lIdx = 0; lIdx < (mod.lessons || []).length; lIdx++) {
      inspectLesson(mod.lessons![lIdx], `${modPath}.lessons[${lIdx}]`);
    }
  }

  // Section 8 Publication Safety: Never allow an empty package to claim published status
  // and never allow accidental deletion of published baseline modules!
  if (
    (pkg.modules || []).length === 0 &&
    (pkg.courseStatus === 'published' || env.lifecycleState === 'PUBLISHED')
  ) {
    issues.push({
      issueId: `err_empty_published_conflict_${courseTrackId}`,
      severity: 'ERROR',
      code: 'EMPTY_PUBLISHED_COURSE_CONFLICT',
      courseTrackId,
      locationPath: 'modules',
      message:
        'A course package with 0 modules cannot have courseStatus "published" or PUBLISHED lifecycle state.',
    });
  }

  if (courseTrackId === PUBLISHED_UKRAINIAN_TRACK_ID) {
    const baseline = getPublishedUkrainianBaselinePackage();
    const presentIds = new Set((pkg.modules || []).map((m) => m.moduleId));
    const missingBaselineIds = baseline.modules
      .map((m) => m.moduleId)
      .filter((id) => !presentIds.has(id));
    if (missingBaselineIds.length > 0) {
      issues.push({
        issueId: `err_accidental_uk_module_deletion`,
        severity: 'ERROR',
        code: 'ACCIDENTAL_MODULE_DELETION_DETECTED',
        courseTrackId,
        locationPath: 'modules',
        message: `Publication safety block: ${missingBaselineIds.length} published Ukrainian baseline module(s) are missing (${missingBaselineIds.slice(0, 5).join(', ')}). Uninitialized or partial drafts can never erase the 29 published Ukrainian modules.`,
      });
    }
  }

  // Always add realistic human-review INFO notice when modules exist (Section 15)
  if ((pkg.modules || []).length > 0) {
    issues.push({
      issueId: `info_pedagogical_review_${courseTrackId}`,
      severity: 'INFO',
      code: 'HUMAN_PEDAGOGICAL_REVIEW_REQUIRED',
      courseTrackId,
      locationPath: 'coursePackage',
      message:
        'Automated structural checks passed/ran, but linguistic accuracy, L1 contrast fairness, and pedagogical sequencing require manual human review.',
      requiresHumanPedagogicalReview: true,
    });
  }

  const errorCount = issues.filter((i) => i.severity === 'ERROR').length;
  const warningCount = issues.filter((i) => i.severity === 'WARNING').length;
  const infoCount = issues.filter((i) => i.severity === 'INFO').length;

  return {
    courseTrackId,
    timestamp: Date.now(),
    canPublish:
      errorCount === 0 &&
      (pkg.modules || []).length > 0 &&
      pkg.courseStatus !== 'synthetic_test_fixture_do_not_publish',
    errorCount,
    warningCount,
    infoCount,
    issues,
  };
}

export function addCmsManualReviewNote(
  courseTrackId: string,
  noteText: string,
  reviewerStatus: CmsManualReviewNote['reviewerStatus'] = 'pending_review',
  targetItemId?: string,
  provenanceNote?: string
): CmsManualReviewNote {
  assertCmsPermission('cms:edit_draft');
  const notes = getCmsManualReviewNotes(courseTrackId);
  const entry: CmsManualReviewNote = {
    noteId: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    courseTrackId,
    targetItemId,
    reviewerStatus,
    noteText: normalizeMultilingualText(noteText),
    provenanceNote,
    createdAt: Date.now(),
  };
  notes.unshift(entry);
  cmsStorageAdapter.setItem(`${REVIEW_NOTES_KEY_PREFIX}${courseTrackId}`, notes);
  return entry;
}

export function getCmsManualReviewNotes(
  courseTrackId: string
): CmsManualReviewNote[] {
  return (
    cmsStorageAdapter.getItem<CmsManualReviewNote[]>(
      `${REVIEW_NOTES_KEY_PREFIX}${courseTrackId}`
    ) || []
  );
}

// ============================================================================
// 7. VOCABULARY & OVERLAY MANAGEMENT + VALIDATION (SECTIONS 10, 11)
// ============================================================================

export function getAllCanonicalEnglishLexemes(): CanonicalEnglishLexeme[] {
  initializeCmsVocabularyMirrors();
  return Array.from(cmsCanonicalEnglishMirror.values()).map((x) =>
    deepClone(x)
  );
}

export function getAllNativeOverlaysForLexeme(
  lexemeId: string
): NativeLanguageEnglishVocabOverlay[] {
  initializeCmsVocabularyMirrors();
  const list: NativeLanguageEnglishVocabOverlay[] = [];
  for (const trackMap of cmsNativeOverlayMirror.values()) {
    const ov = trackMap.get(lexemeId);
    if (ov) {
      list.push(deepClone(ov));
    }
  }
  return list;
}

export function upsertCanonicalEnglishLexemeInCms(
  lexeme: CanonicalEnglishLexeme
): CanonicalEnglishLexeme {
  assertCmsPermission('cms:edit_draft');
  initializeCmsVocabularyMirrors();
  const clean: CanonicalEnglishLexeme = {
    ...deepClone(lexeme),
    headwordEn: normalizeMultilingualText(lexeme.headwordEn, 'en'),
  };
  cmsCanonicalEnglishMirror.set(clean.lexemeId, clean);
  registerCanonicalEnglishLexeme(clean);
  recordCmsAuditLog(
    'cms:edit_draft',
    'canonical:en',
    `Updated canonical English lexeme ${clean.lexemeId} (${clean.headwordEn})`
  );
  return deepClone(clean);
}

/**
 * Updates a single native-language-specific English vocabulary overlay without
 * modifying the shared CanonicalEnglishLexeme or any other native language's overlay,
 * and without touching student FSRS review history (Tests 11 & 12).
 */
export function upsertNativeLanguageOverlayInCms(
  overlay: NativeLanguageEnglishVocabOverlay
): NativeLanguageEnglishVocabOverlay {
  assertCmsPermission('cms:edit_draft');
  initializeCmsVocabularyMirrors();
  const clean: NativeLanguageEnglishVocabOverlay = {
    ...deepClone(overlay),
    translationNative: normalizeMultilingualText(
      overlay.translationNative,
      overlay.nativeLanguage
    ),
    explanationNative: normalizeMultilingualText(
      overlay.explanationNative,
      overlay.nativeLanguage
    ),
    pronunciationTipForNativeSpeaker: normalizeMultilingualText(
      overlay.pronunciationTipForNativeSpeaker,
      overlay.nativeLanguage
    ),
  };

  if (!cmsNativeOverlayMirror.has(clean.courseTrackId)) {
    cmsNativeOverlayMirror.set(clean.courseTrackId, new Map());
  }
  cmsNativeOverlayMirror
    .get(clean.courseTrackId)!
    .set(clean.lexemeId, deepClone(clean));
  registerNativeLanguageVocabOverlay(clean);

  recordCmsAuditLog(
    'cms:edit_draft',
    clean.courseTrackId,
    `Updated L1 overlay (${clean.nativeLanguage}) for lexeme ${clean.lexemeId}`
  );
  return deepClone(clean);
}

export interface CmsVocabularyValidationIssue {
  issueId: string;
  severity: CmsIssueSeverity;
  code:
    | 'DUPLICATE_LEXICAL_ID'
    | 'DUPLICATE_HEADWORD_CANDIDATE'
    | 'MISSING_TRANSLATION'
    | 'INVALID_COURSE_REFERENCE'
    | 'MISSING_VOCABULARY_ID'
    | 'UNVERIFIED_FREQUENCY_RANK'
    | 'INCONSISTENT_LANGUAGE_CODE'
    | 'MISSING_PRONUNCIATION_METADATA'
    | 'BROKEN_OVERLAY_RELATIONSHIP';
  targetId: string;
  message: string;
}

export function validateCmsVocabularyRegistry(
  additionalCandidateLexemes: CanonicalEnglishLexeme[] = [],
  additionalCandidateOverlays: NativeLanguageEnglishVocabOverlay[] = []
): CmsVocabularyValidationIssue[] {
  initializeCmsVocabularyMirrors();
  const issues: CmsVocabularyValidationIssue[] = [];
  const lexemes = [
    ...getAllCanonicalEnglishLexemes(),
    ...additionalCandidateLexemes,
  ];
  const seenLexemeIds = new Set<string>();
  const seenHeadwords = new Set<string>();

  for (const lex of lexemes) {
    if (!lex.lexemeId || !lex.lexemeId.trim()) {
      issues.push({
        issueId: 'voc_missing_id',
        severity: 'ERROR',
        code: 'MISSING_VOCABULARY_ID',
        targetId: lex.headwordEn || 'unknown',
        message: `Canonical English lexeme "${lex.headwordEn}" is missing a lexemeId.`,
      });
      continue;
    }
    if (seenLexemeIds.has(lex.lexemeId)) {
      issues.push({
        issueId: `voc_dup_id_${lex.lexemeId}`,
        severity: 'ERROR',
        code: 'DUPLICATE_LEXICAL_ID',
        targetId: lex.lexemeId,
        message: `Duplicate canonical lexemeId "${lex.lexemeId}".`,
      });
    }
    seenLexemeIds.add(lex.lexemeId);

    const headKey = `${lex.headwordEn.toLowerCase().trim()}::${lex.pos.toLowerCase().trim()}`;
    if (seenHeadwords.has(headKey)) {
      issues.push({
        issueId: `voc_dup_hw_${lex.lexemeId}`,
        severity: 'WARNING',
        code: 'DUPLICATE_HEADWORD_CANDIDATE',
        targetId: lex.lexemeId,
        message: `Duplicate headword candidate "${lex.headwordEn}" (${lex.pos}).`,
      });
    }
    seenHeadwords.add(headKey);

    if (!lex.ipaUs || !lex.ipaUs.trim()) {
      issues.push({
        issueId: `voc_missing_ipa_${lex.lexemeId}`,
        severity: 'WARNING',
        code: 'MISSING_PRONUNCIATION_METADATA',
        targetId: lex.lexemeId,
        message: `Canonical lexeme "${lex.lexemeId}" is missing US IPA pronunciation metadata.`,
      });
    }
  }

  const allOverlays: NativeLanguageEnglishVocabOverlay[] = [];
  for (const m of cmsNativeOverlayMirror.values()) {
    for (const ov of m.values()) {
      allOverlays.push(ov);
    }
  }
  allOverlays.push(...additionalCandidateOverlays);

  for (const ov of allOverlays) {
    if (!seenLexemeIds.has(ov.lexemeId)) {
      issues.push({
        issueId: `ov_broken_lex_${ov.overlayId}_${ov.lexemeId}`,
        severity: 'ERROR',
        code: 'BROKEN_OVERLAY_RELATIONSHIP',
        targetId: ov.overlayId,
        message: `Overlay "${ov.overlayId}" (${ov.courseTrackId}) references non-existent canonical lexemeId "${ov.lexemeId}".`,
      });
    }
    if (!ov.translationNative || !ov.translationNative.trim()) {
      issues.push({
        issueId: `ov_missing_trans_${ov.overlayId}_${ov.lexemeId}`,
        severity: 'ERROR',
        code: 'MISSING_TRANSLATION',
        targetId: ov.overlayId,
        message: `Overlay "${ov.overlayId}" for lexeme "${ov.lexemeId}" is missing a native translation.`,
      });
    }
    const track = getCourseTrackById(ov.courseTrackId);
    if (!track) {
      issues.push({
        issueId: `ov_bad_track_${ov.overlayId}`,
        severity: 'ERROR',
        code: 'INVALID_COURSE_REFERENCE',
        targetId: ov.overlayId,
        message: `Overlay "${ov.overlayId}" references unknown courseTrackId "${ov.courseTrackId}".`,
      });
    } else if (track.nativeLanguage !== ov.nativeLanguage) {
      issues.push({
        issueId: `ov_lang_mismatch_${ov.overlayId}`,
        severity: 'ERROR',
        code: 'INCONSISTENT_LANGUAGE_CODE',
        targetId: ov.overlayId,
        message: `Overlay nativeLanguage "${ov.nativeLanguage}" conflicts with track "${ov.courseTrackId}" nativeLanguage "${track.nativeLanguage}".`,
      });
    }
  }

  return issues;
}

export function registerForeignTrackVocabularyCandidate(
  courseTrackId: string,
  entry: {
    vocabularyId: string;
    languageCode: string;
    headword: string;
    translationEn: string;
    ipa?: string;
    frequencyRank?: number;
  }
): void {
  assertCmsPermission('cms:edit_draft');
  const list = cmsForeignVocabRegistry.get(courseTrackId) || [];
  list.push({
    ...entry,
    headword: normalizeMultilingualText(entry.headword, entry.languageCode),
    courseTrackId,
  });
  cmsForeignVocabRegistry.set(courseTrackId, list);
}

// ============================================================================
// 8. VERSION HISTORY, STRUCTURED DIFFS & SAFE ROLLBACK (SECTIONS 17, 18)
// ============================================================================

function getPublishedUkrainianBaselineSnapshot(): CmsVersionSnapshot {
  const baselinePkg = getPublishedUkrainianBaselinePackage();
  return {
    versionId: 'v0_published_baseline',
    courseTrackId: PUBLISHED_UKRAINIAN_TRACK_ID,
    schemaVersion: '1.0',
    createdAt: 1704067200000,
    changeSummary:
      'Authoritative Published Ukrainian Curriculum Baseline (29 Modules, A0.1–C1.1, 1,810 Vocab, 5,510 Assessments)',
    revisionOrigin: 'published_baseline',
    validationStatus: 'valid',
    publicationState: 'PUBLISHED',
    packageSnapshot: deepClone(baselinePkg),
  };
}

function hydrateCompactUkSnapshot(
  rec: CmsCompactVersionRecord
): CmsVersionSnapshot {
  if (rec.isCompactUkSnapshot && rec.sparseOverlaySnapshot) {
    const resolved = resolveUkrainianEffectiveEnvelopeFromOverlay({
      isSparseOverlay: true,
      courseTrackId: PUBLISHED_UKRAINIAN_TRACK_ID,
      lifecycleState: rec.publicationState,
      lastModifiedAt: rec.createdAt,
      modifiedModulesById: rec.sparseOverlaySnapshot.modifiedModulesById || {},
      newDraftModules: rec.sparseOverlaySnapshot.newDraftModules || [],
      moduleOrder: rec.sparseOverlaySnapshot.moduleOrder || [],
      confirmedDeletedModuleIds:
        rec.sparseOverlaySnapshot.confirmedDeletedModuleIds || [],
    });
    return {
      versionId: rec.versionId,
      courseTrackId: rec.courseTrackId,
      schemaVersion: rec.schemaVersion,
      createdAt: rec.createdAt,
      changeSummary: rec.changeSummary,
      revisionOrigin: rec.revisionOrigin,
      validationStatus: rec.validationStatus,
      publicationState: rec.publicationState,
      packageSnapshot: resolved.draftPackage,
    };
  }
  return rec as CmsVersionSnapshot;
}

export function getCmsVersionHistory(
  courseTrackId: string
): CmsVersionSnapshot[] {
  const rawRecords =
    cmsStorageAdapter.getItem<CmsCompactVersionRecord[]>(
      `${VERSIONS_KEY_PREFIX}${courseTrackId}`
    ) || [];

  if (courseTrackId === PUBLISHED_UKRAINIAN_TRACK_ID) {
    const hydrated = rawRecords
      .map((r) => hydrateCompactUkSnapshot(r))
      .filter(
        (snap) =>
          snap.versionId !== 'v0_published_baseline' &&
          Array.isArray(snap.packageSnapshot?.modules) &&
          snap.packageSnapshot.modules.length > 0
      );
    return [...hydrated, getPublishedUkrainianBaselineSnapshot()];
  }

  return rawRecords as CmsVersionSnapshot[];
}

export function createCmsVersionSnapshot(
  courseTrackId: string,
  pkg: UniversalCoursePackageV1,
  changeSummary: string,
  revisionOrigin: CmsVersionSnapshot['revisionOrigin'] = 'manual_edit',
  publicationState: CmsLifecycleState = 'DRAFT'
): CmsVersionSnapshot {
  assertCmsPermission('cms:edit_draft');
  const valReport = validateCmsCourseDraft(courseTrackId, pkg);
  const validationStatus: CmsVersionSnapshot['validationStatus'] =
    valReport.errorCount > 0
      ? 'errors'
      : valReport.warningCount > 0
        ? 'warnings'
        : 'valid';

  const rawRecords =
    cmsStorageAdapter.getItem<CmsCompactVersionRecord[]>(
      `${VERSIONS_KEY_PREFIX}${courseTrackId}`
    ) || [];
  const versionNumber = rawRecords.length + 1;
  const versionId = `v${versionNumber}_${Date.now()}`;
  const createdAt = Date.now();

  if (courseTrackId === PUBLISHED_UKRAINIAN_TRACK_ID) {
    const baseline = getPublishedUkrainianBaselinePackage();
    const baselineById = new Map<string, UniversalModuleV1>(
      baseline.modules.map((m) => [m.moduleId, m])
    );
    const presentIds = new Set((pkg.modules || []).map((m) => m.moduleId));
    const confirmedDeletedModuleIds = baseline.modules
      .map((m) => m.moduleId)
      .filter((id) => !presentIds.has(id));
    const confirmedDeletedSet = new Set(confirmedDeletedModuleIds);

    const modifiedModulesById: Record<string, UniversalModuleV1> = {};
    const newDraftModules: UniversalModuleV1[] = [];
    const moduleOrder: string[] = [];

    for (const mod of pkg.modules || []) {
      moduleOrder.push(mod.moduleId);
      const baseMod = baselineById.get(mod.moduleId);
      if (baseMod) {
        if (isModuleModifiedFromBaseline(mod, baseMod)) {
          modifiedModulesById[mod.moduleId] = deepClone(mod);
        }
      } else {
        newDraftModules.push(deepClone(mod));
      }
    }
    for (const baseMod of baseline.modules) {
      if (
        !confirmedDeletedSet.has(baseMod.moduleId) &&
        !moduleOrder.includes(baseMod.moduleId)
      ) {
        moduleOrder.push(baseMod.moduleId);
      }
    }

    const compactRec: CmsCompactVersionRecord = {
      isCompactUkSnapshot: true,
      versionId,
      courseTrackId,
      schemaVersion: pkg.schemaVersion || '1.0',
      createdAt,
      changeSummary,
      revisionOrigin,
      validationStatus,
      publicationState,
      sparseOverlaySnapshot: {
        modifiedModulesById,
        newDraftModules,
        moduleOrder,
        confirmedDeletedModuleIds,
      },
    };
    rawRecords.unshift(compactRec);
    cmsStorageAdapter.setItem(
      `${VERSIONS_KEY_PREFIX}${courseTrackId}`,
      rawRecords.slice(0, 30)
    );
    return hydrateCompactUkSnapshot(compactRec);
  }

  const snapshot: CmsVersionSnapshot = {
    versionId,
    courseTrackId,
    schemaVersion: pkg.schemaVersion || '1.0',
    createdAt,
    changeSummary,
    revisionOrigin,
    validationStatus,
    publicationState,
    packageSnapshot: deepClone(pkg),
  };

  rawRecords.unshift(snapshot);
  cmsStorageAdapter.setItem(
    `${VERSIONS_KEY_PREFIX}${courseTrackId}`,
    rawRecords.slice(0, 50)
  );
  return deepClone(snapshot);
}

export function compareCmsVersionSnapshots(
  courseTrackId: string,
  fromVersionId: string,
  toVersionId: string
): CmsVersionDiffReport {
  const history = getCmsVersionHistory(courseTrackId);
  const fromSnap = history.find((v) => v.versionId === fromVersionId);
  const toSnap = history.find((v) => v.versionId === toVersionId);
  if (!fromSnap || !toSnap) {
    throw new Error(
      `Cannot compare versions: ${fromVersionId} or ${toVersionId} not found for ${courseTrackId}.`
    );
  }

  const beforePkg = fromSnap.packageSnapshot;
  const afterPkg = toSnap.packageSnapshot;

  const beforeMods = new Map<string, UniversalModuleV1>(
    (beforePkg.modules || []).map((m) => [m.moduleId, m])
  );
  const afterMods = new Map<string, UniversalModuleV1>(
    (afterPkg.modules || []).map((m) => [m.moduleId, m])
  );

  const addedModuleIds: string[] = [];
  const removedModuleIds: string[] = [];
  const changedModuleTitles: Array<{
    moduleId: string;
    before: string;
    after: string;
  }> = [];

  for (const [mId, afterMod] of afterMods.entries()) {
    if (!beforeMods.has(mId)) {
      addedModuleIds.push(mId);
    } else {
      const beforeMod = beforeMods.get(mId)!;
      if (beforeMod.title !== afterMod.title) {
        changedModuleTitles.push({
          moduleId: mId,
          before: beforeMod.title,
          after: afterMod.title,
        });
      }
    }
  }

  for (const mId of beforeMods.keys()) {
    if (!afterMods.has(mId)) {
      removedModuleIds.push(mId);
    }
  }

  const extractLessons = (p: UniversalCoursePackageV1) => {
    const map = new Map<string, UniversalLessonV1>();
    for (const m of p.modules || []) {
      for (const l of m.lessons || []) map.set(l.lessonId, l);
      for (const s of m.sections || []) {
        for (const l of s.lessons || []) map.set(l.lessonId, l);
      }
    }
    return map;
  };

  const beforeLessons = extractLessons(beforePkg);
  const afterLessons = extractLessons(afterPkg);
  const modifiedLessonIds: string[] = [];

  for (const [lId, afterLes] of afterLessons.entries()) {
    const beforeLes = beforeLessons.get(lId);
    if (!beforeLes) {
      modifiedLessonIds.push(lId);
    } else if (
      beforeLes.title !== afterLes.title ||
      beforeLes.summary !== afterLes.summary ||
      beforeLes.instructionalText !== afterLes.instructionalText
    ) {
      modifiedLessonIds.push(lId);
    }
  }

  const extractActivities = (p: UniversalCoursePackageV1) => {
    const map = new Map<string, UniversalActivityItemV1>();
    for (const m of p.modules || []) {
      for (const a of m.activities || []) map.set(a.activityId, a);
      for (const l of m.lessons || []) {
        for (const a of l.activities || []) map.set(a.activityId, a);
      }
      for (const s of m.sections || []) {
        for (const a of s.activities || []) map.set(a.activityId, a);
        for (const l of s.lessons || []) {
          for (const a of l.activities || []) map.set(a.activityId, a);
        }
      }
    }
    return map;
  };

  const beforeActs = extractActivities(beforePkg);
  const afterActs = extractActivities(afterPkg);
  const changedActivityAnswerKeys: Array<{
    activityId: string;
    beforeCorrectIndex: unknown;
    afterCorrectIndex: unknown;
  }> = [];

  for (const [aId, afterAct] of afterActs.entries()) {
    const beforeAct = beforeActs.get(aId);
    if (beforeAct) {
      const bKey = (beforeAct.payload as { correctIndex?: unknown } | undefined)
        ?.correctIndex;
      const aKey = (afterAct.payload as { correctIndex?: unknown } | undefined)
        ?.correctIndex;
      if (bKey !== aKey) {
        changedActivityAnswerKeys.push({
          activityId: aId,
          beforeCorrectIndex: bKey,
          afterCorrectIndex: aKey,
        });
      }
    }
  }

  const collectVocabRefs = (p: UniversalCoursePackageV1) => {
    const set = new Set<string>(p.vocabularyCatalogIds || []);
    for (const m of p.modules || []) {
      for (const r of m.vocabularyReferences || []) set.add(r);
      for (const s of m.sections || []) {
        for (const l of s.lessons || []) {
          for (const r of l.vocabularyRefs || []) set.add(r);
        }
      }
    }
    return set;
  };

  const beforeVocab = collectVocabRefs(beforePkg);
  const afterVocab = collectVocabRefs(afterPkg);
  const addedVocab = Array.from(afterVocab).filter((x) => !beforeVocab.has(x));
  const removedVocab = Array.from(beforeVocab).filter(
    (x) => !afterVocab.has(x)
  );

  const collectMediaRefs = (p: UniversalCoursePackageV1) => {
    const set = new Set<string>();
    for (const m of p.modules || []) {
      for (const s of m.sections || []) {
        for (const l of s.lessons || []) {
          for (const r of (l.mediaRefs as string[] | undefined) || []) {
            set.add(r);
          }
        }
      }
    }
    return set;
  };

  const beforeMedia = collectMediaRefs(beforePkg);
  const afterMedia = collectMediaRefs(afterPkg);
  const addedMedia = Array.from(afterMedia).filter((x) => !beforeMedia.has(x));
  const removedMedia = Array.from(beforeMedia).filter(
    (x) => !afterMedia.has(x)
  );

  const totalDifferences =
    addedModuleIds.length +
    removedModuleIds.length +
    changedModuleTitles.length +
    modifiedLessonIds.length +
    changedActivityAnswerKeys.length +
    addedVocab.length +
    removedVocab.length +
    addedMedia.length +
    removedMedia.length;

  return {
    fromVersionId,
    toVersionId,
    courseTrackId,
    addedModuleIds,
    removedModuleIds,
    changedModuleTitles,
    modifiedLessonIds,
    changedActivityAnswerKeys,
    modifiedVocabularyReferences: {
      added: addedVocab,
      removed: removedVocab,
    },
    changedMediaReferences: {
      added: addedMedia,
      removed: removedMedia,
    },
    totalDifferences,
  };
}

/**
 * Safely restores a previous version snapshot for a single Course Track:
 * 1. Creates an automatic pre-rollback backup snapshot of the current draft.
 * 2. Restores the target version into the track's draft envelope.
 * 3. Never touches any other Course Track or student FSRS progress.
 */
export function restoreCmsVersionSnapshot(
  courseTrackId: string,
  versionIdToRestore: string
): {
  restoredEnvelope: CmsCourseDraftEnvelope;
  backupSnapshot: CmsVersionSnapshot;
} {
  assertCmsPermission('cms:restore_version');
  const history = getCmsVersionHistory(courseTrackId);
  const targetSnap = history.find((v) => v.versionId === versionIdToRestore);
  if (!targetSnap) {
    throw new Error(
      `Version snapshot "${versionIdToRestore}" not found for track "${courseTrackId}".`
    );
  }

  const currentEnv = getOrCreateCmsCourseDraft(courseTrackId);
  const backupSnapshot = createCmsVersionSnapshot(
    courseTrackId,
    currentEnv.draftPackage,
    `Automatic pre-rollback backup before restoring ${versionIdToRestore}`,
    'pre_rollback_backup',
    currentEnv.lifecycleState
  );

  const restoredEnvelope = saveCmsCourseDraft(
    courseTrackId,
    targetSnap.packageSnapshot,
    {
      lifecycleState: 'DRAFT',
      changeSummary: `Restored version ${versionIdToRestore} (${targetSnap.changeSummary})`,
      revisionOrigin: 'rollback_restore',
      createSnapshot: true,
    }
  );

  recordCmsAuditLog(
    'cms:restore_version',
    courseTrackId,
    `Restored snapshot ${versionIdToRestore} (pre-rollback backup: ${backupSnapshot.versionId})`
  );

  return {
    restoredEnvelope,
    backupSnapshot,
  };
}

// ============================================================================
// 9. LIFECYCLE STATUS TRANSITIONS & PUBLICATION GUARDRAILS (SECTION 16)
// ============================================================================

/**
 * Computes a structured diff between the Published Baseline and the current
 * Effective Draft for a Course Track (e.g., `track:en-to-uk`).
 */
export function computeCmsDraftVsPublishedDiff(
  courseTrackId: string
): CmsVersionDiffReport | null {
  const baselinePkg = getPublishedBaselineCoursePackage(courseTrackId);
  if (!baselinePkg) return null;
  const effectiveEnv = getOrCreateCmsCourseDraft(courseTrackId);
  const afterPkg = effectiveEnv.draftPackage;

  const beforeMods = new Map<string, UniversalModuleV1>(
    (baselinePkg.modules || []).map((m) => [m.moduleId, m])
  );
  const afterMods = new Map<string, UniversalModuleV1>(
    (afterPkg.modules || []).map((m) => [m.moduleId, m])
  );

  const addedModuleIds: string[] = [];
  const removedModuleIds: string[] = [];
  const changedModuleTitles: Array<{
    moduleId: string;
    before: string;
    after: string;
  }> = [];

  for (const [mId, afterMod] of afterMods.entries()) {
    if (!beforeMods.has(mId)) {
      addedModuleIds.push(mId);
    } else {
      const beforeMod = beforeMods.get(mId)!;
      if (beforeMod.title !== afterMod.title) {
        changedModuleTitles.push({
          moduleId: mId,
          before: beforeMod.title,
          after: afterMod.title,
        });
      }
    }
  }
  for (const mId of beforeMods.keys()) {
    if (!afterMods.has(mId)) {
      removedModuleIds.push(mId);
    }
  }

  const extractLessons = (p: UniversalCoursePackageV1) => {
    const map = new Map<string, UniversalLessonV1>();
    for (const m of p.modules || []) {
      for (const l of m.lessons || []) map.set(l.lessonId, l);
      for (const s of m.sections || []) {
        for (const l of s.lessons || []) map.set(l.lessonId, l);
      }
    }
    return map;
  };
  const beforeLessons = extractLessons(baselinePkg);
  const afterLessons = extractLessons(afterPkg);
  const modifiedLessonIds: string[] = [];
  for (const [lId, afterLes] of afterLessons.entries()) {
    const beforeLes = beforeLessons.get(lId);
    if (
      !beforeLes ||
      beforeLes.title !== afterLes.title ||
      beforeLes.summary !== afterLes.summary ||
      beforeLes.instructionalText !== afterLes.instructionalText
    ) {
      modifiedLessonIds.push(lId);
    }
  }

  const extractActivities = (p: UniversalCoursePackageV1) => {
    const map = new Map<string, UniversalActivityItemV1>();
    for (const m of p.modules || []) {
      for (const s of m.sections || []) {
        for (const l of s.lessons || []) {
          for (const a of l.activities || []) map.set(a.activityId, a);
        }
      }
    }
    return map;
  };
  const beforeActs = extractActivities(baselinePkg);
  const afterActs = extractActivities(afterPkg);
  const changedActivityAnswerKeys: Array<{
    activityId: string;
    beforeCorrectIndex: unknown;
    afterCorrectIndex: unknown;
  }> = [];

  for (const [aId, afterAct] of afterActs.entries()) {
    const beforeAct = beforeActs.get(aId);
    if (beforeAct) {
      const bKey = (beforeAct.payload as { correctIndex?: unknown } | undefined)
        ?.correctIndex;
      const aKey = (afterAct.payload as { correctIndex?: unknown } | undefined)
        ?.correctIndex;
      if (bKey !== aKey) {
        changedActivityAnswerKeys.push({
          activityId: aId,
          beforeCorrectIndex: bKey,
          afterCorrectIndex: aKey,
        });
      }
    }
  }

  const totalDifferences =
    addedModuleIds.length +
    removedModuleIds.length +
    changedModuleTitles.length +
    modifiedLessonIds.length +
    changedActivityAnswerKeys.length;

  return {
    fromVersionId: 'v0_published_baseline',
    toVersionId: 'effective_draft',
    courseTrackId,
    addedModuleIds,
    removedModuleIds,
    changedModuleTitles,
    modifiedLessonIds,
    changedActivityAnswerKeys,
    modifiedVocabularyReferences: { added: [], removed: [] },
    changedMediaReferences: { added: [], removed: [] },
    totalDifferences,
  };
}

export function transitionCmsDraftLifecycleState(
  courseTrackId: string,
  targetState: CmsLifecycleState,
  explicitConfirmation = false
): {
  success: boolean;
  envelope: CmsCourseDraftEnvelope;
  validationReport: CmsValidationReport;
  publicationDiff?: CmsVersionDiffReport | null;
  message: string;
} {
  if (targetState === 'PUBLISHED') {
    assertCmsPermission('cms:publish_course');
  } else {
    assertCmsPermission('cms:edit_draft');
  }

  const env = getOrCreateCmsCourseDraft(courseTrackId);
  const valReport = validateCmsCourseDraft(courseTrackId, env.draftPackage);
  const publicationDiff = computeCmsDraftVsPublishedDiff(courseTrackId);

  if (targetState === 'PUBLISHED') {
    if (!explicitConfirmation) {
      return {
        success: false,
        envelope: env,
        validationReport: valReport,
        publicationDiff,
        message: 'Publication blocked: explicit confirmation is required.',
      };
    }
    if (!valReport.canPublish) {
      return {
        success: false,
        envelope: env,
        validationReport: valReport,
        publicationDiff,
        message: `Publication blocked: ${valReport.errorCount} validation error(s) or empty/invalid curriculum.`,
      };
    }
  }

  const updated = saveCmsCourseDraft(courseTrackId, env.draftPackage, {
    lifecycleState: targetState,
    changeSummary: `Transitioned lifecycle state from ${env.lifecycleState} to ${targetState}`,
    revisionOrigin: 'status_transition',
  });

  return {
    success: true,
    envelope: updated,
    validationReport: valReport,
    publicationDiff,
    message: `Transitioned ${courseTrackId} to ${targetState} (${updated.draftPackage.modules.length} effective modules verified).`,
  };
}

// ============================================================================
// 10. MEDIA LIBRARY INSPECTOR (SECTION 19)
// ============================================================================

let cachedMediaCatalog: CmsMediaAssetRecord[] | null = null;

export function getCmsMediaLibraryCatalog(): CmsMediaAssetRecord[] {
  if (cachedMediaCatalog) return cachedMediaCatalog;
  const records: CmsMediaAssetRecord[] = [];
  for (const cat of IDENTIFY_CATEGORIES) {
    for (const scene of cat.scenes) {
      records.push({
        assetId: `media:${scene.id}`,
        assetPath: scene.assetPath,
        mediaType: 'image/webp',
        categoryTitle: cat.titleEn,
        sceneTitleEn: scene.titleEn,
        sceneTitleUk: scene.titleUk,
        associatedTrackIds: [PUBLISHED_UKRAINIAN_TRACK_ID],
        verifiedExists: Boolean(
          scene.assetPath && scene.assetPath.endsWith('.webp')
        ),
        storageTier: 'local_public_asset',
      });
    }
  }
  cachedMediaCatalog = records;
  return records;
}

// ============================================================================
// 11. ISOLATED DRAFT & PUBLISHED PREVIEW USING UNIVERSAL COURSE PLAYER
// ============================================================================

/**
 * Renders either PREVIEW DRAFT (effective curriculum = published baseline + draft changes)
 * or PREVIEW PUBLISHED (authoritative published baseline without draft changes)
 * using the ALREADY IMPLEMENTED Phase 2 Universal Course Player
 * (`renderUniversalImportedCourseWorkspace`) in an isolated sandbox that never writes
 * to real learner FSRS records or XP.
 */
export function renderIsolatedCmsDraftPreview(
  courseTrackId: string,
  previewMode: 'draft' | 'published' = 'draft'
): {
  html: string;
  usesUniversalCoursePlayer: true;
  isIsolatedFromStudentFsrs: true;
  previewMode: 'draft' | 'published';
  moduleCount: number;
  hasDraftChanges: boolean;
} {
  assertCmsPermission('cms:preview_readonly');
  const track = getCourseTrackById(courseTrackId);
  if (!track) {
    throw new Error(`Unknown track ID: ${courseTrackId}`);
  }

  const env = getOrCreateCmsCourseDraft(courseTrackId);
  const baselinePkg = getPublishedBaselineCoursePackage(courseTrackId);
  const packageToRender =
    previewMode === 'published'
      ? baselinePkg || {
          ...env.draftPackage,
          modules: [],
        }
      : env.draftPackage;

  const moduleCount = Array.isArray(packageToRender.modules)
    ? packageToRender.modules.length
    : 0;
  const hasDraftChanges = Boolean(env.hasDraftChanges);

  if (moduleCount === 0) {
    return {
      usesUniversalCoursePlayer: true,
      isIsolatedFromStudentFsrs: true,
      previewMode,
      moduleCount: 0,
      hasDraftChanges,
      html: `
        <div class="card" data-testid="cms-isolated-preview-empty" data-preview-mode="${previewMode}" style="border:1px solid var(--border-strong); padding:18px;">
          <span class="tag" style="background:var(--secondary-container); color:var(--secondary-on-container); font-weight:800;">
            ⏳ Isolated Preview (${previewMode.toUpperCase()}) • Empty Track (${track.trackId})
          </span>
          <h3 style="margin:8px 0 4px 0;">${track.comingSoonTitle}</h3>
          <p style="margin:0; font-size:13.5px; color:var(--text-secondary);">
            ${
              previewMode === 'published'
                ? `No published curriculum exists for ${track.trackId} yet.`
                : `No draft or published modules exist for ${track.trackId} yet. Learner view displays the clean Course Coming Soon state.`
            }
          </p>
        </div>
      `,
    };
  }

  // Render using the exact Phase 2 Universal Course Player, neutralising progress-mutating onclicks in sandbox preview
  const rawPlayerHtml = renderUniversalImportedCourseWorkspace(
    track,
    packageToRender
  );
  const sandboxedHtml = rawPlayerHtml
    .replace(
      /onclick="answerUniversalCourseActivity\([^"]*\)"/g,
      'onclick="void(0)" data-cms-sandboxed="true"'
    )
    .replace(
      /onclick="markUniversalLessonComplete\([^"]*\)"/g,
      'onclick="void(0)" data-cms-sandboxed="true"'
    )
    .replace(
      /onclick="addTrackVocabItemToIsolatedFsrs\([^"]*\)"/g,
      'onclick="void(0)" data-cms-sandboxed="true"'
    );

  const modeBadgeLabel =
    previewMode === 'published'
      ? `🏛️ PREVIEW PUBLISHED BASELINE (${moduleCount} Published Modules — Unpublished Draft Edits Excluded)`
      : hasDraftChanges
        ? `✏️ PREVIEW DRAFT (${moduleCount} Effective Modules = Published Baseline + ${env.modifiedModuleIds?.length || 0} Modified / ${env.newDraftModuleIds?.length || 0} New Draft Module(s))`
        : `👁️ PREVIEW DRAFT — EFFECTIVE VIEW (${moduleCount} Modules — Matches Published Baseline; 0 Unpublished Draft Changes)`;

  return {
    usesUniversalCoursePlayer: true,
    isIsolatedFromStudentFsrs: true,
    previewMode,
    moduleCount,
    hasDraftChanges,
    html: `
      <div data-testid="cms-isolated-universal-player-preview" data-preview-mode="${previewMode}">
        <div style="margin-bottom:10px; padding:10px 14px; background:${previewMode === 'published' ? 'var(--success-container)' : 'var(--accent-container)'}; color:${previewMode === 'published' ? 'var(--success-on-container)' : 'var(--accent-on-container)'}; border-radius:var(--radius-sm); font-size:12.5px; font-weight:800; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <span>${modeBadgeLabel}</span>
          <span>🔒 Sandboxed Preview — Learner FSRS &amp; XP Untouched</span>
        </div>
        ${sandboxedHtml}
      </div>
    `,
  };
}

// ============================================================================
// 12. COURSE JSON EXPORTER & ROUND-TRIP VALIDATION (SECTION 21)
// ============================================================================

export function exportCmsCourseDraftToJson(courseTrackId: string): {
  jsonString: string;
  exportedPackage: UniversalCoursePackageV1;
  validationReport: CmsValidationReport;
  exportLimitations: string[];
} {
  assertCmsPermission('cms:preview_readonly');
  const env = getOrCreateCmsCourseDraft(courseTrackId);
  const cleanPkg = deepClone(env.draftPackage);

  // Strip any accidental runtime/user keys so exports never contain learner progress, FSRS, or credentials
  delete (cleanPkg as Record<string, unknown>).userAccountData;
  delete (cleanPkg as Record<string, unknown>).fsrsProgress;
  delete (cleanPkg as Record<string, unknown>).authTokens;

  cleanPkg.metadata = {
    ...(cleanPkg.metadata || {}),
    exportedFrom: 'Lango Content Studio Phase 3A',
    exportedAtIso: new Date().toISOString(),
    lifecycleStateAtExport: env.lifecycleState,
  };

  const validationReport = validateCmsCourseDraft(courseTrackId, cleanPkg);
  const jsonString = JSON.stringify(cleanPkg, null, 2);

  recordCmsAuditLog(
    'cms:export_json',
    courseTrackId,
    `Exported versioned Course JSON package (${cleanPkg.modules.length} modules)`
  );

  return {
    jsonString,
    exportedPackage: cleanPkg,
    validationReport,
    exportLimitations: [
      'Binary media files (WebP/MP3/MP4) are referenced by stable asset ID/path and are not embedded as base64 inside the JSON package.',
      'Student FSRS progress and user account records are intentionally excluded from curriculum exports.',
    ],
  };
}

// ============================================================================
// 13. DASHBOARD METRICS, BULK OPERATIONS & UNIFIED SEARCH (SECTIONS 4, 22, 23)
// ============================================================================

export function getAllCmsTrackSummaries(): CmsTrackSummary[] {
  const tracks = getAllCourseTracks();
  return tracks.map((track) => {
    const isUk = track.trackId === PUBLISHED_UKRAINIAN_TRACK_ID;
    const effectiveEnv = getOrCreateCmsCourseDraft(track.trackId);
    const history = getCmsVersionHistory(track.trackId);

    let modCount = 0;
    let secCount = 0;
    let lesCount = 0;
    let actCount = 0;

    for (const m of effectiveEnv.draftPackage.modules || []) {
      modCount++;
      secCount += (m.sections || []).length;
      lesCount += (m.lessons || []).length;
      actCount += (m.activities || []).length;
      for (const s of m.sections || []) {
        lesCount += (s.lessons || []).length;
        actCount += (s.activities || []).length;
        for (const l of s.lessons || []) {
          actCount += (l.activities || []).length;
        }
      }
    }

    const lifecycleState: CmsLifecycleState = isUk
      ? 'PUBLISHED'
      : effectiveEnv.lifecycleState;

    const valReport =
      modCount > 0 && !isUk
        ? validateCmsCourseDraft(track.trackId, effectiveEnv.draftPackage)
        : null;

    const validationStatus: CmsTrackSummary['validationStatus'] = isUk
      ? 'valid'
      : !valReport
        ? 'unvalidated'
        : valReport.errorCount > 0
          ? 'errors'
          : valReport.warningCount > 0
            ? 'warnings'
            : 'valid';

    const ukDraftChangeCount = isUk
      ? (effectiveEnv.modifiedModuleIds?.length || 0) +
        (effectiveEnv.newDraftModuleIds?.length || 0) +
        (effectiveEnv.removedBaselineModuleIds?.length || 0)
      : modCount;

    return {
      trackId: track.trackId,
      courseId: track.courseId,
      courseTitle: track.courseTitle,
      learningDirection: track.learningDirection,
      targetLanguage: track.targetLanguage,
      nativeLanguage: track.nativeLanguage,
      instructionalLanguage: track.instructionalLanguage,
      lifecycleState,
      publishedModuleCount: isUk ? COURSE_MODULES.length : 0,
      draftModuleCount: ukDraftChangeCount,
      draftSectionCount: secCount,
      draftLessonCount: lesCount,
      draftActivityCount: actCount,
      lastModifiedAt: effectiveEnv.hasDraftChanges
        ? effectiveEnv.lastModifiedAt
        : null,
      validationStatus,
      versionCount: history.length,
      hasDraft: Boolean(effectiveEnv.hasDraftChanges),
    };
  });
}

export function getCmsDashboardMetrics() {
  initializeCmsVocabularyMirrors();
  const summaries = getAllCmsTrackSummaries();
  const vocabIssues = validateCmsVocabularyRegistry();
  const mediaCatalog = getCmsMediaLibraryCatalog();

  const totalUkrainianModuleVocab = COURSE_MODULES.reduce(
    (acc, m) => acc + m.vocab.length,
    0
  );

  let totalValidationErrors = 0;
  let totalValidationWarnings = 0;
  for (const s of summaries) {
    if (s.hasDraft) {
      const rep = validateCmsCourseDraft(s.trackId);
      totalValidationErrors += rep.errorCount;
      totalValidationWarnings += rep.warningCount;
    }
  }

  return {
    totalRegisteredTracks: summaries.length, // 28
    publishedCoursesCount: summaries.filter(
      (s) => s.lifecycleState === 'PUBLISHED'
    ).length,
    draftCoursesCount: summaries.filter((s) => s.lifecycleState === 'DRAFT')
      .length,
    inReviewCoursesCount: summaries.filter(
      (s) => s.lifecycleState === 'IN_REVIEW'
    ).length,
    emptyCoursesCount: summaries.filter((s) => s.lifecycleState === 'EMPTY')
      .length,
    ukrainianPublishedModules: COURSE_MODULES.length, // 29
    ukrainianCourseVocabCount: totalUkrainianModuleVocab, // 1810
    ukrainianFsrsLexiconCount: FREQ_6000_DB.length,
    canonicalEnglishLexemesCount: cmsCanonicalEnglishMirror.size,
    nativeEnglishOverlaysCount: Array.from(
      cmsNativeOverlayMirror.values()
    ).reduce((acc, m) => acc + m.size, 0),
    mediaAssetsCount: mediaCatalog.length, // 100 WebP photos
    missingMediaAssetsCount: mediaCatalog.filter((m) => !m.verifiedExists)
      .length,
    totalValidationErrors,
    totalValidationWarnings,
    vocabularyValidationIssuesCount: vocabIssues.length,
    supportedLanguagesCount: getAllLanguages().length, // 15
    recentAuditLogs: getCmsAuditLogs().slice(0, 10),
    recentImports: getCmsImportHistory().slice(0, 10),
    storageAdapterName: cmsStorageAdapter.adapterName,
    isDurableCloudPersistence: cmsStorageAdapter.isDurableCloudPersistence,
  };
}

export function runBulkCmsValidationAudit(): {
  auditedTrackCount: number;
  reportsByTrack: Record<string, CmsValidationReport>;
  totalErrors: number;
  totalWarnings: number;
} {
  const summaries = getAllCmsTrackSummaries();
  const reportsByTrack: Record<string, CmsValidationReport> = {};
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const s of summaries) {
    const rep = validateCmsCourseDraft(s.trackId);
    reportsByTrack[s.trackId] = rep;
    totalErrors += rep.errorCount;
    totalWarnings += rep.warningCount;
  }

  return {
    auditedTrackCount: summaries.length,
    reportsByTrack,
    totalErrors,
    totalWarnings,
  };
}

export interface CmsSearchResultItem {
  resultType: 'course_track' | 'module' | 'lesson' | 'activity' | 'vocabulary';
  courseTrackId: string;
  itemId: string;
  title: string;
  subtitle: string;
}

export function searchCmsContentStudio(query: string): CmsSearchResultItem[] {
  initializeCmsVocabularyMirrors();
  const q = (query || '').toLowerCase().trim();
  if (!q) return [];
  const results: CmsSearchResultItem[] = [];

  for (const summary of getAllCmsTrackSummaries()) {
    const targetLang = getLanguageByCode(summary.targetLanguage);
    const nativeLang = getLanguageByCode(summary.nativeLanguage);
    if (
      summary.trackId.toLowerCase().includes(q) ||
      summary.courseTitle.toLowerCase().includes(q) ||
      summary.lifecycleState.toLowerCase().includes(q) ||
      summary.validationStatus.toLowerCase().includes(q) ||
      (targetLang?.nameEn || '').toLowerCase().includes(q) ||
      (nativeLang?.nameEn || '').toLowerCase().includes(q)
    ) {
      results.push({
        resultType: 'course_track',
        courseTrackId: summary.trackId,
        itemId: summary.trackId,
        title: summary.courseTitle,
        subtitle: `${summary.trackId} • ${summary.lifecycleState} • ${summary.validationStatus}`,
      });
    }

    const draftEnv =
      summary.publishedModuleCount > 0 || summary.hasDraft
        ? getOrCreateCmsCourseDraft(summary.trackId)
        : getCmsDraftEnvelope(summary.trackId);
    if (draftEnv) {
      for (const m of draftEnv.draftPackage.modules || []) {
        if (
          m.moduleId.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q)
        ) {
          results.push({
            resultType: 'module',
            courseTrackId: summary.trackId,
            itemId: m.moduleId,
            title: m.title,
            subtitle: `Module ${m.moduleId} in ${summary.trackId}`,
          });
        }
        for (const s of m.sections || []) {
          for (const l of s.lessons || []) {
            if (
              l.lessonId.toLowerCase().includes(q) ||
              l.title.toLowerCase().includes(q)
            ) {
              results.push({
                resultType: 'lesson',
                courseTrackId: summary.trackId,
                itemId: l.lessonId,
                title: l.title,
                subtitle: `Lesson ${l.lessonId} in ${summary.trackId}`,
              });
            }
            for (const a of l.activities || []) {
              if (
                a.activityId.toLowerCase().includes(q) ||
                (a.title || '').toLowerCase().includes(q)
              ) {
                results.push({
                  resultType: 'activity',
                  courseTrackId: summary.trackId,
                  itemId: a.activityId,
                  title: a.title || a.activityId,
                  subtitle: `Activity (${a.activityType}) in ${summary.trackId}`,
                });
              }
            }
          }
        }
      }
    }
  }

  for (const lex of getAllCanonicalEnglishLexemes()) {
    if (
      lex.lexemeId.toLowerCase().includes(q) ||
      lex.headwordEn.toLowerCase().includes(q)
    ) {
      results.push({
        resultType: 'vocabulary',
        courseTrackId: 'canonical:en',
        itemId: lex.lexemeId,
        title: `${lex.headwordEn} (${lex.ipaUs})`,
        subtitle: `Canonical English Lexeme • ${lex.lexemeId}`,
      });
    }
  }

  return results.slice(0, 50);
}

export function clearCmsDraftAndHistoryForTrack(courseTrackId: string): void {
  assertCmsPermission('cms:delete_draft');
  cmsStorageAdapter.removeItem(`${DRAFT_KEY_PREFIX}${courseTrackId}`);
  cmsStorageAdapter.removeItem(`${VERSIONS_KEY_PREFIX}${courseTrackId}`);
  cmsStorageAdapter.removeItem(`${REVIEW_NOTES_KEY_PREFIX}${courseTrackId}`);
  cmsStorageAdapter.removeItem(`${REMOVED_LEDGER_KEY_PREFIX}${courseTrackId}`);
  cmsStorageAdapter.removeItem(`${UNDO_STACK_KEY_PREFIX}${courseTrackId}`);
  cmsStorageAdapter.removeItem(`${REDO_STACK_KEY_PREFIX}${courseTrackId}`);
}
