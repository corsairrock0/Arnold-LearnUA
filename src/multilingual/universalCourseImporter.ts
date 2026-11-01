// ============================================================================
// LANGO PHASE 1 — UNIVERSAL VERSIONED COURSE JSON SCHEMA, VALIDATOR,
// PREVIEW ENGINE & DEVELOPER-ONLY SAFE IMPORT PILOT
// ============================================================================

import { getLanguageByCode } from './languageRegistry.ts';
import {
  getCourseTrackById,
  PUBLISHED_UKRAINIAN_TRACK_ID,
  resolveCourseTrack,
  updateDevPilotTrackState,
  type CourseTrack,
} from './courseTrackRegistry.ts';

export const SUPPORTED_SCHEMA_VERSIONS = ['1.0', '1.0.0'] as const;

export const SUPPORTED_ACTIVITY_TYPES = new Set<string>([
  'lesson_explanation',
  'grammar_pattern_table',
  'contextual_dialogue',
  'vocabulary_introduction',
  'knowledge_check_mc',
  'knowledge_check_text',
  'guided_practice_drill',
  'module_mastery_exam',
  'active_recall_prompt',
  'pronunciation_minimal_pair',
  'listening_comprehension',
  'reading_passage',
  'sentence_correction',
]);

export interface UniversalActivityItemV1 {
  activityId: string;
  activityType: string;
  title?: string;
  prompt?: string;
  vocabularyRefs?: string[];
  pronunciationRefs?: string[];
  payload?: Record<string, unknown>;
  [extKey: string]: unknown;
}

export interface UniversalLessonV1 {
  lessonId: string;
  title: string;
  summary?: string;
  instructionalText?: string;
  activities?: UniversalActivityItemV1[];
  vocabularyRefs?: string[];
  pronunciationRefs?: string[];
  [extKey: string]: unknown;
}

export interface UniversalSectionV1 {
  sectionId: string;
  title: string;
  lessons?: UniversalLessonV1[];
  activities?: UniversalActivityItemV1[];
  [extKey: string]: unknown;
}

export interface UniversalModuleV1 {
  moduleId: string;
  title: string;
  proficiencyLevel?: string; // Optional: CEFR, JLPT, HSK, ACTFL, or custom
  learningObjectives?: string[];
  sections?: UniversalSectionV1[];
  lessons?: UniversalLessonV1[];
  activities?: UniversalActivityItemV1[];
  vocabularyReferences?: string[];
  pronunciationReferences?: string[];
  prerequisites?: string[];
  sourceProvenance?: string | Record<string, unknown>;
  metadata?: Record<string, unknown>;
  [extKey: string]: unknown;
}

export interface UniversalCoursePackageV1 {
  schemaVersion: string;
  courseId: string;
  courseTrackId: string;
  targetLanguage: string;
  nativeLanguage: string;
  instructionalLanguage: string;
  targetVariety: string;
  nativeVariety?: string;
  courseTitle: string;
  courseStatus:
    | 'draft'
    | 'ready_for_review'
    | 'synthetic_test_fixture_do_not_publish'
    | string;
  modules: UniversalModuleV1[];
  vocabularyCatalogIds?: string[];
  pronunciationCatalogIds?: string[];
  sourceProvenance?: string | Record<string, unknown>;
  metadata: Record<string, unknown>;
  [extKey: string]: unknown;
}

export type ImportValidationStatus =
  | 'valid'
  | 'valid_with_warnings'
  | 'rejected';

export interface CourseImportPreviewReport {
  valid: boolean;
  validationStatus: ImportValidationStatus;
  courseTitle: string;
  courseId: string;
  courseTrackId: string;
  expectedCourseTrackId: string;
  targetLanguage: string;
  nativeLanguage: string;
  instructionalLanguage: string;
  targetVariety: string;
  schemaVersion: string;
  courseStatus: string;
  moduleCount: number;
  sectionCount: number;
  lessonCount: number;
  activityCount: number;
  vocabularyReferenceCount: number;
  pronunciationReferenceCount: number;
  includedActivityTypes: string[];
  unsupportedActivityTypes: string[];
  missingReferences: string[];
  duplicateIdentifiers: string[];
  potentialConflicts: string[];
  preservedUnknownFields: string[];
  errors: string[];
  warnings: string[];
  parsedPackage?: UniversalCoursePackageV1;
}

const KNOWN_TOP_LEVEL_KEYS = new Set([
  'schemaVersion',
  'courseId',
  'courseTrackId',
  'targetLanguage',
  'nativeLanguage',
  'instructionalLanguage',
  'targetVariety',
  'nativeVariety',
  'courseTitle',
  'courseStatus',
  'modules',
  'vocabularyCatalogIds',
  'pronunciationCatalogIds',
  'sourceProvenance',
  'metadata',
]);

const KNOWN_MODULE_KEYS = new Set([
  'moduleId',
  'title',
  'proficiencyLevel',
  'learningObjectives',
  'sections',
  'lessons',
  'activities',
  'vocabularyReferences',
  'pronunciationReferences',
  'prerequisites',
  'sourceProvenance',
  'metadata',
]);

/**
 * Validates and previews a Universal Course JSON package against a specific target CourseTrack.
 * Never assumes targetLanguage alone identifies a course; strictly checks both targetLanguage
 * and nativeLanguage as well as courseTrackId, and blocks any overwrite of Ukrainian ('track:en-to-uk').
 */
export function validateAndPreviewCourseImport(
  rawJsonInput: string,
  expectedTrackId?: string
): CourseImportPreviewReport {
  const emptyReport = (
    errorMsg: string,
    conflicts: string[] = []
  ): CourseImportPreviewReport => ({
    valid: false,
    validationStatus: 'rejected',
    courseTitle: '',
    courseId: '',
    courseTrackId: '',
    expectedCourseTrackId: expectedTrackId || '',
    targetLanguage: '',
    nativeLanguage: '',
    instructionalLanguage: '',
    targetVariety: '',
    schemaVersion: '',
    courseStatus: '',
    moduleCount: 0,
    sectionCount: 0,
    lessonCount: 0,
    activityCount: 0,
    vocabularyReferenceCount: 0,
    pronunciationReferenceCount: 0,
    includedActivityTypes: [],
    unsupportedActivityTypes: [],
    missingReferences: [],
    duplicateIdentifiers: [],
    potentialConflicts: conflicts,
    preservedUnknownFields: [],
    errors: [errorMsg],
    warnings: [],
  });

  if (!rawJsonInput || typeof rawJsonInput !== 'string' || !rawJsonInput.trim()) {
    return emptyReport('Course JSON input is empty.');
  }

  let parsedRaw: unknown;
  try {
    parsedRaw = JSON.parse(rawJsonInput);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Malformed JSON';
    return emptyReport(`Invalid JSON syntax: ${msg}`);
  }

  if (!parsedRaw || typeof parsedRaw !== 'object' || Array.isArray(parsedRaw)) {
    return emptyReport('Root JSON value must be an object.');
  }

  const pkg = parsedRaw as Record<string, unknown>;
  const errors: string[] = [];
  const warnings: string[] = [];
  const potentialConflicts: string[] = [];
  const duplicateIdentifiers: string[] = [];
  const missingReferences: string[] = [];
  const preservedUnknownFields: string[] = [];

  for (const key of Object.keys(pkg)) {
    if (!KNOWN_TOP_LEVEL_KEYS.has(key)) {
      preservedUnknownFields.push(`root.${key}`);
    }
  }

  const schemaVersion =
    typeof pkg.schemaVersion === 'string' ? pkg.schemaVersion.trim() : '';
  const courseId = typeof pkg.courseId === 'string' ? pkg.courseId.trim() : '';
  const courseTrackId =
    typeof pkg.courseTrackId === 'string' ? pkg.courseTrackId.trim() : '';
  const targetLanguage =
    typeof pkg.targetLanguage === 'string'
      ? pkg.targetLanguage.toLowerCase().trim()
      : '';
  const nativeLanguage =
    typeof pkg.nativeLanguage === 'string'
      ? pkg.nativeLanguage.toLowerCase().trim()
      : '';
  const instructionalLanguage =
    typeof pkg.instructionalLanguage === 'string'
      ? pkg.instructionalLanguage.toLowerCase().trim()
      : '';
  const targetVariety =
    typeof pkg.targetVariety === 'string' ? pkg.targetVariety.trim() : '';
  const courseTitle =
    typeof pkg.courseTitle === 'string' ? pkg.courseTitle.trim() : '';
  const courseStatus =
    typeof pkg.courseStatus === 'string' ? pkg.courseStatus.trim() : '';

  if (!schemaVersion) {
    errors.push('Missing required field: schemaVersion');
  } else if (
    !SUPPORTED_SCHEMA_VERSIONS.includes(
      schemaVersion as (typeof SUPPORTED_SCHEMA_VERSIONS)[number]
    )
  ) {
    errors.push(
      `Unsupported schemaVersion "${schemaVersion}". Supported versions: ${SUPPORTED_SCHEMA_VERSIONS.join(', ')}`
    );
  }

  if (!courseId) errors.push('Missing required field: courseId');
  if (!courseTrackId) errors.push('Missing required field: courseTrackId');
  if (!targetLanguage) errors.push('Missing required field: targetLanguage');
  if (!nativeLanguage) errors.push('Missing required field: nativeLanguage');
  if (!instructionalLanguage) {
    errors.push('Missing required field: instructionalLanguage');
  }
  if (!targetVariety) errors.push('Missing required field: targetVariety');
  if (!courseTitle) errors.push('Missing required field: courseTitle');
  if (!courseStatus) errors.push('Missing required field: courseStatus');
  if (
    !pkg.metadata ||
    typeof pkg.metadata !== 'object' ||
    Array.isArray(pkg.metadata)
  ) {
    errors.push('Missing or invalid required field: metadata (must be an object)');
  }
  if (!Array.isArray(pkg.modules)) {
    errors.push('Missing or invalid required field: modules (must be an array)');
  }

  // Validate languages against Language Registry
  const targetLangDef = getLanguageByCode(targetLanguage);
  const nativeLangDef = getLanguageByCode(nativeLanguage);
  const instrLangDef = getLanguageByCode(instructionalLanguage);

  if (targetLanguage && !targetLangDef) {
    errors.push(`Unrecognized targetLanguage code: "${targetLanguage}"`);
  }
  if (nativeLanguage && !nativeLangDef) {
    errors.push(`Unrecognized nativeLanguage code: "${nativeLanguage}"`);
  }
  if (instructionalLanguage && !instrLangDef) {
    errors.push(
      `Unrecognized instructionalLanguage code: "${instructionalLanguage}"`
    );
  }

  if (targetLanguage && nativeLanguage && targetLanguage === nativeLanguage) {
    errors.push(
      `targetLanguage ("${targetLanguage}") and nativeLanguage ("${nativeLanguage}") cannot be identical.`
    );
  }

  // Hard guard: Never allow importing over the published Ukrainian course
  if (
    courseTrackId === PUBLISHED_UKRAINIAN_TRACK_ID ||
    expectedTrackId === PUBLISHED_UKRAINIAN_TRACK_ID ||
    (targetLanguage === 'uk' && nativeLanguage === 'en')
  ) {
    const conflictMsg =
      'CRITICAL PROTECTION: Importing into or overwriting the published English-to-Ukrainian course (track:en-to-uk) is strictly prohibited.';
    potentialConflicts.push(conflictMsg);
    errors.push(conflictMsg);
  }

  // Verify Course Track mapping consistency
  const resolvedTrack =
    targetLanguage && nativeLanguage
      ? resolveCourseTrack(targetLanguage, nativeLanguage)
      : undefined;
  const declaredTrack = courseTrackId
    ? getCourseTrackById(courseTrackId)
    : undefined;

  if (courseTrackId && !declaredTrack) {
    potentialConflicts.push(
      `courseTrackId "${courseTrackId}" is not registered in COURSE_TRACK_REGISTRY.`
    );
    errors.push(`Unknown courseTrackId "${courseTrackId}".`);
  }

  if (declaredTrack && resolvedTrack && declaredTrack.trackId !== resolvedTrack.trackId) {
    const msg = `Course track mismatch: JSON declares courseTrackId "${courseTrackId}", but targetLanguage="${targetLanguage}" + nativeLanguage="${nativeLanguage}" resolves to "${resolvedTrack.trackId}".`;
    potentialConflicts.push(msg);
    errors.push(msg);
  }

  if (expectedTrackId) {
    const expectedTrack = getCourseTrackById(expectedTrackId);
    if (!expectedTrack) {
      errors.push(`Destination course track "${expectedTrackId}" does not exist.`);
    } else {
      if (courseTrackId && courseTrackId !== expectedTrack.trackId) {
        const msg = `Destination conflict: Package is for "${courseTrackId}" (${nativeLanguage} → ${targetLanguage}), which cannot be imported into selected track "${expectedTrack.trackId}" (${expectedTrack.nativeLanguage} → ${expectedTrack.targetLanguage}).`;
        potentialConflicts.push(msg);
        errors.push(msg);
      }
      if (
        targetLanguage &&
        targetLanguage !== expectedTrack.targetLanguage
      ) {
        const msg = `Target language conflict: Package targetLanguage is "${targetLanguage}", but destination track "${expectedTrack.trackId}" targets "${expectedTrack.targetLanguage}".`;
        potentialConflicts.push(msg);
        errors.push(msg);
      }
      if (
        nativeLanguage &&
        nativeLanguage !== expectedTrack.nativeLanguage
      ) {
        const msg = `Native language conflict: Package nativeLanguage is "${nativeLanguage}", but destination track "${expectedTrack.trackId}" is designed for native "${expectedTrack.nativeLanguage}" speakers.`;
        potentialConflicts.push(msg);
        errors.push(msg);
      }
    }
  }

  // Traverse modules, sections, lessons, activities, and references
  const modulesArray = Array.isArray(pkg.modules)
    ? (pkg.modules as UniversalModuleV1[])
    : [];

  let sectionCount = 0;
  let lessonCount = 0;
  let activityCount = 0;
  const allVocabRefs = new Set<string>();
  const allPronRefs = new Set<string>();
  const includedActivityTypesSet = new Set<string>();
  const unsupportedActivityTypesSet = new Set<string>();

  const seenModuleIds = new Set<string>();
  const seenSectionIds = new Set<string>();
  const seenLessonIds = new Set<string>();
  const seenActivityIds = new Set<string>();

  const declaredVocabCatalog = Array.isArray(pkg.vocabularyCatalogIds)
    ? new Set<string>(
        pkg.vocabularyCatalogIds.filter((x): x is string => typeof x === 'string')
      )
    : null;
  const declaredPronCatalog = Array.isArray(pkg.pronunciationCatalogIds)
    ? new Set<string>(
        pkg.pronunciationCatalogIds.filter(
          (x): x is string => typeof x === 'string'
        )
      )
    : null;

  const inspectActivity = (
    act: UniversalActivityItemV1,
    pathPrefix: string
  ) => {
    activityCount++;
    const actId =
      typeof act.activityId === 'string' ? act.activityId.trim() : '';
    const actType =
      typeof act.activityType === 'string' ? act.activityType.trim() : '';

    if (!actId) {
      errors.push(`Missing activityId at ${pathPrefix}`);
    } else if (seenActivityIds.has(actId)) {
      duplicateIdentifiers.push(`activityId:${actId}`);
      errors.push(`Duplicate activityId "${actId}" found at ${pathPrefix}`);
    } else {
      seenActivityIds.add(actId);
    }

    if (!actType) {
      errors.push(`Missing activityType at ${pathPrefix}`);
    } else {
      includedActivityTypesSet.add(actType);
      if (!SUPPORTED_ACTIVITY_TYPES.has(actType)) {
        unsupportedActivityTypesSet.add(actType);
      }
    }

    if (Array.isArray(act.vocabularyRefs)) {
      for (const vRef of act.vocabularyRefs) {
        if (typeof vRef === 'string' && vRef.trim()) {
          allVocabRefs.add(vRef.trim());
          if (declaredVocabCatalog && !declaredVocabCatalog.has(vRef.trim())) {
            missingReferences.push(`vocabularyRef:${vRef.trim()} (at ${pathPrefix})`);
          }
        }
      }
    }

    if (Array.isArray(act.pronunciationRefs)) {
      for (const pRef of act.pronunciationRefs) {
        if (typeof pRef === 'string' && pRef.trim()) {
          allPronRefs.add(pRef.trim());
          if (declaredPronCatalog && !declaredPronCatalog.has(pRef.trim())) {
            missingReferences.push(
              `pronunciationRef:${pRef.trim()} (at ${pathPrefix})`
            );
          }
        }
      }
    }
  };

  const inspectLesson = (les: UniversalLessonV1, pathPrefix: string) => {
    lessonCount++;
    const lesId = typeof les.lessonId === 'string' ? les.lessonId.trim() : '';
    if (!lesId) {
      errors.push(`Missing lessonId at ${pathPrefix}`);
    } else if (seenLessonIds.has(lesId)) {
      duplicateIdentifiers.push(`lessonId:${lesId}`);
      errors.push(`Duplicate lessonId "${lesId}" found at ${pathPrefix}`);
    } else {
      seenLessonIds.add(lesId);
    }

    if (!les.title || typeof les.title !== 'string' || !les.title.trim()) {
      errors.push(`Missing lesson title at ${pathPrefix}`);
    }

    if (Array.isArray(les.vocabularyRefs)) {
      for (const vRef of les.vocabularyRefs) {
        if (typeof vRef === 'string' && vRef.trim()) {
          allVocabRefs.add(vRef.trim());
          if (declaredVocabCatalog && !declaredVocabCatalog.has(vRef.trim())) {
            missingReferences.push(`vocabularyRef:${vRef.trim()} (at ${pathPrefix})`);
          }
        }
      }
    }

    if (Array.isArray(les.pronunciationRefs)) {
      for (const pRef of les.pronunciationRefs) {
        if (typeof pRef === 'string' && pRef.trim()) {
          allPronRefs.add(pRef.trim());
          if (declaredPronCatalog && !declaredPronCatalog.has(pRef.trim())) {
            missingReferences.push(
              `pronunciationRef:${pRef.trim()} (at ${pathPrefix})`
            );
          }
        }
      }
    }

    if (Array.isArray(les.activities)) {
      les.activities.forEach((act, aIdx) =>
        inspectActivity(act, `${pathPrefix}.activities[${aIdx}]`)
      );
    }
  };

  // First pass: collect module IDs
  for (let mIdx = 0; mIdx < modulesArray.length; mIdx++) {
    const mod = modulesArray[mIdx];
    if (!mod || typeof mod !== 'object') {
      errors.push(`modules[${mIdx}] must be an object`);
      continue;
    }
    const modId = typeof mod.moduleId === 'string' ? mod.moduleId.trim() : '';
    if (!modId) {
      errors.push(`Missing moduleId at modules[${mIdx}]`);
    } else if (seenModuleIds.has(modId)) {
      duplicateIdentifiers.push(`moduleId:${modId}`);
      errors.push(`Duplicate moduleId "${modId}" at modules[${mIdx}]`);
    } else {
      seenModuleIds.add(modId);
    }
  }

  // Second pass: inspect module contents & check prerequisite module references
  for (let mIdx = 0; mIdx < modulesArray.length; mIdx++) {
    const mod = modulesArray[mIdx];
    if (!mod || typeof mod !== 'object') continue;
    const modPath = `modules[${mIdx}](${mod.moduleId || 'unnamed'})`;

    for (const key of Object.keys(mod)) {
      if (!KNOWN_MODULE_KEYS.has(key)) {
        preservedUnknownFields.push(`${modPath}.${key}`);
      }
    }

    if (!mod.title || typeof mod.title !== 'string' || !mod.title.trim()) {
      errors.push(`Missing module title at ${modPath}`);
    }

    if (Array.isArray(mod.prerequisites)) {
      for (const prereqId of mod.prerequisites) {
        if (typeof prereqId === 'string' && !seenModuleIds.has(prereqId.trim())) {
          missingReferences.push(
            `prerequisiteModule:${prereqId.trim()} (referenced by ${modPath})`
          );
        }
      }
    }

    if (Array.isArray(mod.vocabularyReferences)) {
      for (const vRef of mod.vocabularyReferences) {
        if (typeof vRef === 'string' && vRef.trim()) {
          allVocabRefs.add(vRef.trim());
          if (declaredVocabCatalog && !declaredVocabCatalog.has(vRef.trim())) {
            missingReferences.push(`vocabularyRef:${vRef.trim()} (at ${modPath})`);
          }
        }
      }
    }

    if (Array.isArray(mod.pronunciationReferences)) {
      for (const pRef of mod.pronunciationReferences) {
        if (typeof pRef === 'string' && pRef.trim()) {
          allPronRefs.add(pRef.trim());
          if (declaredPronCatalog && !declaredPronCatalog.has(pRef.trim())) {
            missingReferences.push(
              `pronunciationRef:${pRef.trim()} (at ${modPath})`
            );
          }
        }
      }
    }

    if (Array.isArray(mod.sections)) {
      mod.sections.forEach((sec, sIdx) => {
        sectionCount++;
        const secPath = `${modPath}.sections[${sIdx}]`;
        const secId =
          typeof sec.sectionId === 'string' ? sec.sectionId.trim() : '';
        if (!secId) {
          errors.push(`Missing sectionId at ${secPath}`);
        } else if (seenSectionIds.has(secId)) {
          duplicateIdentifiers.push(`sectionId:${secId}`);
          errors.push(`Duplicate sectionId "${secId}" at ${secPath}`);
        } else {
          seenSectionIds.add(secId);
        }

        if (Array.isArray(sec.lessons)) {
          sec.lessons.forEach((les, lIdx) =>
            inspectLesson(les, `${secPath}.lessons[${lIdx}]`)
          );
        }
        if (Array.isArray(sec.activities)) {
          sec.activities.forEach((act, aIdx) =>
            inspectActivity(act, `${secPath}.activities[${aIdx}]`)
          );
        }
      });
    }

    if (Array.isArray(mod.lessons)) {
      mod.lessons.forEach((les, lIdx) =>
        inspectLesson(les, `${modPath}.lessons[${lIdx}]`)
      );
    }

    if (Array.isArray(mod.activities)) {
      mod.activities.forEach((act, aIdx) =>
        inspectActivity(act, `${modPath}.activities[${aIdx}]`)
      );
    }
  }

  if (missingReferences.length > 0) {
    errors.push(
      `Detected ${missingReferences.length} missing reference(s): ${missingReferences.join(', ')}`
    );
  }

  const unsupportedActivityTypes = Array.from(unsupportedActivityTypesSet);
  if (unsupportedActivityTypes.length > 0) {
    warnings.push(
      `Package contains ${unsupportedActivityTypes.length} activity type(s) not yet rendered by the current UI (${unsupportedActivityTypes.join(', ')}). Their metadata will be preserved lossless in the course package, and a renderer notice will be shown.`
    );
  }

  if (preservedUnknownFields.length > 0) {
    warnings.push(
      `Preserved ${preservedUnknownFields.length} custom extension field(s): ${preservedUnknownFields.join(', ')}`
    );
  }

  const valid = errors.length === 0;
  const validationStatus: ImportValidationStatus = !valid
    ? 'rejected'
    : warnings.length > 0
      ? 'valid_with_warnings'
      : 'valid';

  return {
    valid,
    validationStatus,
    courseTitle,
    courseId,
    courseTrackId,
    expectedCourseTrackId: expectedTrackId || courseTrackId,
    targetLanguage,
    nativeLanguage,
    instructionalLanguage,
    targetVariety,
    schemaVersion,
    courseStatus,
    moduleCount: modulesArray.length,
    sectionCount,
    lessonCount,
    activityCount,
    vocabularyReferenceCount: allVocabRefs.size,
    pronunciationReferenceCount: allPronRefs.size,
    includedActivityTypes: Array.from(includedActivityTypesSet),
    unsupportedActivityTypes,
    missingReferences,
    duplicateIdentifiers,
    potentialConflicts,
    preservedUnknownFields,
    errors,
    warnings,
    parsedPackage: valid
      ? (pkg as unknown as UniversalCoursePackageV1)
      : undefined,
  };
}

export interface CommitDevCourseImportOptions {
  confirmedByDeveloper: boolean;
  isDevelopmentEnvironment?: boolean;
}

export interface CommitDevCourseImportResult {
  committed: boolean;
  preview: CourseImportPreviewReport;
  updatedTrack?: CourseTrack;
  message: string;
}

/**
 * Commits a validated course package into an empty Course Track in the local/development
 * environment ONLY after explicit developer confirmation.
 * Never overwrites Ukrainian ('track:en-to-uk') and never exposes a public production write endpoint.
 */
export function commitDevPilotCourseImport(
  rawJsonInput: string,
  destinationTrackId: string,
  options: CommitDevCourseImportOptions
): CommitDevCourseImportResult {
  if (options.isDevelopmentEnvironment === false) {
    const preview = validateAndPreviewCourseImport(
      rawJsonInput,
      destinationTrackId
    );
    return {
      committed: false,
      preview,
      message:
        'Import blocked: Public/production course-import writes are disabled in Phase 1.',
    };
  }

  const preview = validateAndPreviewCourseImport(
    rawJsonInput,
    destinationTrackId
  );

  if (!preview.valid || !preview.parsedPackage) {
    return {
      committed: false,
      preview,
      message: `Import rejected due to validation errors: ${preview.errors.join(' | ')}`,
    };
  }

  if (!options.confirmedByDeveloper) {
    return {
      committed: false,
      preview,
      message:
        'Import requires explicit confirmation (confirmedByDeveloper: true) after reviewing the Import Preview.',
    };
  }

  if (destinationTrackId === PUBLISHED_UKRAINIAN_TRACK_ID) {
    return {
      committed: false,
      preview,
      message:
        'Security Guardrail: Cannot overwrite the published Ukrainian course (track:en-to-uk).',
    };
  }

  const updatedTrack = updateDevPilotTrackState(
    destinationTrackId,
    preview.parsedPackage,
    []
  );

  return {
    committed: true,
    preview,
    updatedTrack,
    message: `Successfully imported developer test package "${preview.courseTitle}" into track "${destinationTrackId}" (Ukrainian track:en-to-uk remains untouched).`,
  };
}

// ============================================================================
// SYNTHETIC TEST FIXTURES FOR CHECKPOINT G & AUTOMATED TESTING (SECTION 24)
// Explicitly marked as synthetic test data — NOT published courses!
// ============================================================================

export const SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE: UniversalCoursePackageV1 =
  {
    schemaVersion: '1.0',
    courseId: 'test-fixture:en:for-es:pilot-v1',
    courseTrackId: 'track:es-to-en',
    targetLanguage: 'en',
    nativeLanguage: 'es',
    instructionalLanguage: 'es',
    targetVariety: 'en-US',
    nativeVariety: 'es-419',
    courseTitle:
      '[SYNTHETIC TEST FIXTURE] Inglés para Hablantes de Español (Pilot Test Data Only)',
    courseStatus: 'synthetic_test_fixture_do_not_publish',
    vocabularyCatalogIds: ['en_lex_0001', 'en_lex_0002', 'en_lex_0003'],
    pronunciationCatalogIds: ['pron_en_es_s_clusters', 'pron_en_es_short_i'],
    sourceProvenance: {
      fixtureType: 'synthetic_unit_test_fixture',
      notice: 'DO NOT PUBLISH — used strictly to test the Universal Course JSON Importer',
    },
    metadata: {
      isSyntheticTestFixture: true,
      doNotPublish: true,
      l1TransferFocus: [
        'Mandatory English subject pronouns (I/you/it) vs Spanish pro-drop',
        'Word-initial /sp/, /st/, /sk/ clusters without prosthetic /e/',
      ],
    },
    customPedagogicalStrategy: 'contrastive_es_to_en_modular',
    modules: [
      {
        moduleId: 'es_en_test_m1',
        title: '[TEST] Pronombres Sujeto Obligatorios y Sonidos Iniciales /s/+Consonante',
        proficiencyLevel: 'Foundational-1',
        learningObjectives: [
          'Usar siempre los pronombres sujeto en inglés (It is raining vs Llueve)',
          'Pronunciar speak, school y student sin añadir una /e/ inicial',
        ],
        vocabularyReferences: ['en_lex_0001', 'en_lex_0002'],
        pronunciationReferences: ['pron_en_es_s_clusters'],
        prerequisites: [],
        customL1TransferTag: 'pro-drop-contrast',
        sections: [
          {
            sectionId: 'es_en_test_sec_1',
            title: '1. Por qué el inglés necesita "It" y "You"',
            lessons: [
              {
                lessonId: 'es_en_test_les_1',
                title: 'El sujeto explícito en inglés',
                summary:
                  'En español decimos "Es importante", pero en inglés es obligatorio decir "It is important".',
                vocabularyRefs: ['en_lex_0001'],
                activities: [
                  {
                    activityId: 'es_en_test_act_1',
                    activityType: 'lesson_explanation',
                    title: 'Contraste Español vs Inglés',
                  },
                  {
                    activityId: 'es_en_test_act_2',
                    activityType: 'knowledge_check_mc',
                    title: 'Verificación rápida',
                    vocabularyRefs: ['en_lex_0001'],
                  },
                  {
                    activityId: 'es_en_test_act_3',
                    activityType: 'acoustic_spectrogram_cluster_trainer',
                    title: 'Entrenador acústico /sp/ vs /esp/ (Custom Extension Activity)',
                    pronunciationRefs: ['pron_en_es_s_clusters'],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        moduleId: 'es_en_test_m2',
        title: '[TEST] Contraste vocálico /ɪ/ (ship) vs /iː/ (sheep)',
        proficiencyLevel: 'Foundational-2',
        learningObjectives: [
          'Distinguir auditiva y articulatoriamente /ɪ/ y /iː/',
        ],
        vocabularyReferences: ['en_lex_0003'],
        pronunciationReferences: ['pron_en_es_short_i'],
        prerequisites: ['es_en_test_m1'],
        sections: [
          {
            sectionId: 'es_en_test_sec_2',
            title: '2. Pares mínimos en contexto',
            lessons: [
              {
                lessonId: 'es_en_test_les_2',
                title: 'Live vs Leave / Ship vs Sheep',
                activities: [
                  {
                    activityId: 'es_en_test_act_4',
                    activityType: 'pronunciation_minimal_pair',
                    pronunciationRefs: ['pron_en_es_short_i'],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

export const SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON = JSON.stringify(
  SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE,
  null,
  2
);
