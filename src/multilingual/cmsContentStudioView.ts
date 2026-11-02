/**
 * ============================================================================
 * LANGO — CONTENT STUDIO (BEGINNER-FRIENDLY UX & INTERFACE CONTROLLER)
 * ============================================================================
 * Designed so a high school student (ages 14–18) with zero programming or JSON
 * experience can confidently create, organize, edit, preview, check, and
 * publish language courses while preserving all Phase 1, Phase 2, and Phase 3A
 * engines, guardrails, and 29 published Ukrainian modules.
 *
 * Primary Navigation:
 *   1. Home (`dashboard`) — Friendly welcome, 6-step workflow guide, primary
 *      actions (Edit a Course, Add a Lesson, Import Content, Preview a Course),
 *      real course summaries, and "Continue Editing" when a recent item exists.
 *   2. My Courses (`courses`) — Simplified cards for all 28 courses with plain
 *      language names, module counts ("29 Published Modules" vs "Not Started"),
 *      clear buttons (Open Course, Edit, Preview), and a "More Options" menu.
 *   3. Edit Content (`editor`) — 3-part layout on desktop (Course Outline |
 *      Lesson & Question Editor | Contextual Help & Properties) and single-panel
 *      switcher on mobile (iPhone 16 Pro Max). Raw JSON is hidden by default.
 *   4. Vocabulary (`vocabulary`) — Shared English dictionary & 14 native-language
 *      translations manager with plain-English instructions.
 *   5. Media (`media`) — Visual browser for all 100 Ukrainian Identify WebP
 *      photographs across 20 thematic categories.
 *   6. Review & Publish (`validation`) — Plain-English problem checker
 *      ("Must Fix", "Recommended", "Information") with "Go to Problem" navigation,
 *      change comparison, backup creation, and safe publishing confirmation.
 *
 * Additional Prominent & Utility Views:
 *   - Preview as Student (`preview`) — Uses the Phase 2 Universal Course Player
 *     with "Preview My Changes" and "See Published Course" modes.
 *   - Advanced Tools (`advanced`, plus backward-compatible `importer`,
 *     `versions`, and `export` routes) — Guided 5-step Import Course Content,
 *     Version History (Previous Versions) with confirmation before restore,
 *     View Course JSON (Raw UniversalCoursePackageV1), and Export tools.
 *   - Help & Guided Tour (`help`) — Optional 7-step interactive walkthrough
 *     and 8 step-by-step plain-English help guides.
 * ============================================================================
 */

import {
  getAllCourseTracks,
  getCourseTrackById,
  PUBLISHED_UKRAINIAN_TRACK_ID,
} from './courseTrackRegistry.ts';
import { getForeignLanguages, getLanguageByCode } from './languageRegistry.ts';
import {
  SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE,
  SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON,
  validateAndPreviewCourseImport,
} from './universalCourseImporter.ts';
import { SYNTHETIC_ENGLISH_TO_HINDI_TEST_FIXTURE_JSON } from './universalCoursePlayer.ts';
import {
  cmsStorageAdapter,
  evaluateCmsAccessContext,
} from './cmsAuthAndStorage.ts';
import {
  getAllCmsTrackSummaries,
  getCmsDashboardMetrics,
  getOrCreateCmsCourseDraft,
  getPublishedBaselineCoursePackage,
  discardCmsDraftOverlay,
  computeCmsDraftVsPublishedDiff,
  addOrUpdateCmsModuleInDraft,
  reorderCmsModulesInDraft,
  duplicateCmsModuleInDraft,
  updateCmsLessonInDraft,
  updateCmsActivityInDraft,
  analyzeCmsRemovalImpact,
  removeCmsContentItemInDraft,
  getCmsRemovedItemsInDraft,
  restoreRemovedCmsItemInDraft,
  undoLastCmsAction,
  redoLastCmsAction,
  getCmsUndoRedoState,
  computeCmsDetailedChangeSummary,
  addCmsSectionToModuleInDraft,
  addCmsLessonToSectionInDraft,
  duplicateCmsLessonInDraft,
  addCmsActivityToLessonInDraft,
  duplicateCmsActivityInDraft,
  addCmsAnswerOptionInDraft,
  addCmsLessonVocabularyRefInDraft,
  addCmsLessonMediaRefInDraft,
  importCourseJsonIntoCmsDraft,
  validateCmsCourseDraft,
  addCmsManualReviewNote,
  getCmsManualReviewNotes,
  getAllCanonicalEnglishLexemes,
  getAllNativeOverlaysForLexeme,
  upsertCanonicalEnglishLexemeInCms,
  upsertNativeLanguageOverlayInCms,
  validateCmsVocabularyRegistry,
  getCmsVersionHistory,
  createCmsVersionSnapshot,
  compareCmsVersionSnapshots,
  restoreCmsVersionSnapshot,
  transitionCmsDraftLifecycleState,
  getCmsMediaLibraryCatalog,
  renderIsolatedCmsDraftPreview,
  exportCmsCourseDraftToJson,
  runBulkCmsValidationAudit,
  searchCmsContentStudio,
  type CmsContentOriginStatus,
  type CmsLifecycleState,
  type CmsRemovalImpactAnalysis,
  type CmsRemovalTargetSpec,
  type CmsTrackSummary,
  type CmsValidationIssue,
  type CmsValidationReport,
} from './cmsContentStudioEngine.ts';

import {
  registerIdentifyStudioRerenderHook,
  renderCmsIdentifySceneManagerTab,
  selectCmsIdentifyScene,
  selectCmsIdentifyTarget,
  setCmsIdentifyFilter,
  toggleCmsIdentifyBulkAuditPanel,
  toggleCmsIdentifyScenePlannerPanel,
  handleCmsIdentifyCanvasClick,
  handleCmsIdentifySaveGeometryInputs,
  handleCmsIdentifyNudgeTarget,
  handleCmsIdentifyMarkTargetMissing,
  handleCmsIdentifyAddTarget,
  handleCmsIdentifyChangeAssetPath,
  handleCmsIdentifyUndoDraft,
  handleCmsIdentifyRestoreBaseline,
  handleCmsIdentifyCheckScene,
  handleCmsIdentifyPublishScene,
  handleCmsIdentifyPreviewInLearnerApp,
} from './cmsIdentifyStudioTab.ts';

export type CmsWorkspaceTab =
  | 'dashboard'
  | 'courses'
  | 'editor'
  | 'importer'
  | 'vocabulary'
  | 'validation'
  | 'versions'
  | 'media'
  | 'identify'
  | 'preview'
  | 'export'
  | 'advanced'
  | 'help';

export type CmsAdvancedSubTab =
  | 'importer'
  | 'versions'
  | 'json'
  | 'export'
  | 'security';

export type CmsMobileEditorPanel = 'outline' | 'lesson' | 'help';

interface CmsLastEditedRecord {
  trackId: string;
  moduleId: string;
  sectionId: string;
  lessonId: string;
  lessonTitle: string;
  courseTitle: string;
  timestamp: number;
}

interface CmsStudioUiState {
  isOpen: boolean;
  activeTab: CmsWorkspaceTab;
  advancedSubTab: CmsAdvancedSubTab;
  selectedTrackId: string;
  // Course Manager filters
  courseSearchQuery: string;
  courseDirectionFilter: 'all' | 'en_to_foreign' | 'foreign_to_en';
  courseStatusFilter: 'all' | CmsLifecycleState;
  courseSortBy: 'title' | 'modules' | 'updated';
  // Editor selection & mobile panel
  selectedModuleId: string;
  selectedSectionId: string;
  selectedLessonId: string;
  selectedActivityId: string;
  mobileEditorPanel: CmsMobileEditorPanel;
  collapsedSectionIds: Record<string, boolean>;
  showSourceJsonDrawer: boolean;
  showDraftVsPublishedDiffDrawer: boolean;
  showRemovedItemsDrawer: boolean;
  showUnpublishedChangesSummaryDrawer: boolean;
  pendingRemovalConfirmation: CmsRemovalImpactAnalysis | null;
  hasUnsavedEditorChanges: boolean;
  // Preview mode
  previewMode: 'draft' | 'published';
  // Importer 5-step state
  importMode: 'full_draft_import' | 'incremental_module_merge';
  importJsonText: string;
  importCheckSummaryHtml: string;
  lastImportBannerHtml: string;
  // Vocabulary state
  selectedLexemeId: string;
  selectedOverlayLang: string;
  vocabSearchQuery: string;
  // Validation state
  lastBulkAuditSummary: {
    auditedTrackCount: number;
    totalErrors: number;
    totalWarnings: number;
  } | null;
  // Version diff & confirmation state
  diffLeftVersionId: string;
  diffRightVersionId: string;
  pendingRestoreVersionId: string;
  pendingPublishConfirmation: boolean;
  // Media library state
  mediaSearchQuery: string;
  // Export round-trip state
  exportStatusMessage: string;
  // Global search
  globalSearchQuery: string;
  // Guided tour state
  tourActive: boolean;
  tourStepIndex: number;
  tourDismissed: boolean;
  // Continue editing tracking
  lastEditedItem: CmsLastEditedRecord | null;
  // Toast notification
  bannerNotification: {
    type: 'success' | 'warn' | 'danger';
    message: string;
    showUndoButton?: boolean;
  } | null;
}

const cmsUiState: CmsStudioUiState = {
  isOpen: false,
  activeTab: 'dashboard',
  advancedSubTab: 'importer',
  selectedTrackId: PUBLISHED_UKRAINIAN_TRACK_ID,
  courseSearchQuery: '',
  courseDirectionFilter: 'all',
  courseStatusFilter: 'all',
  courseSortBy: 'title',
  selectedModuleId: '',
  selectedSectionId: '',
  selectedLessonId: '',
  selectedActivityId: '',
  mobileEditorPanel: 'lesson',
  collapsedSectionIds: {},
  showSourceJsonDrawer: false,
  showDraftVsPublishedDiffDrawer: false,
  showRemovedItemsDrawer: false,
  showUnpublishedChangesSummaryDrawer: false,
  pendingRemovalConfirmation: null,
  hasUnsavedEditorChanges: false,
  previewMode: 'draft',
  importMode: 'full_draft_import',
  importJsonText: '',
  importCheckSummaryHtml: '',
  lastImportBannerHtml: '',
  selectedLexemeId: 'en_lex_0001',
  selectedOverlayLang: 'es',
  vocabSearchQuery: '',
  lastBulkAuditSummary: null,
  diffLeftVersionId: '',
  diffRightVersionId: '',
  pendingRestoreVersionId: '',
  pendingPublishConfirmation: false,
  mediaSearchQuery: '',
  exportStatusMessage: '',
  globalSearchQuery: '',
  tourActive: false,
  tourStepIndex: 0,
  tourDismissed: false,
  lastEditedItem: null,
  bannerNotification: null,
};

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setCmsBanner(
  type: 'success' | 'warn' | 'danger',
  message: string,
  showUndoButton = false
): void {
  cmsUiState.bannerNotification = { type, message, showUndoButton };
}

// ============================================================================
// 0. PLAIN-ENGLISH BEGINNER TERMINOLOGY & VALIDATION TRANSLATORS (EXPORTED)
// ============================================================================

export function getLanguagePlainName(code: string): string {
  const lang = getLanguageByCode(code);
  return lang ? lang.nameEn : code.toUpperCase();
}

/**
 * Formats a Course Track into a friendly human-readable course label without
 * requiring the user to understand internal `track:xx-to-yy` IDs.
 */
export function formatFriendlyCourseDisplayName(trackId: string): string {
  const track = getCourseTrackById(trackId);
  if (!track) return trackId;
  const nativeName = getLanguagePlainName(track.nativeLanguage);
  const targetName = getLanguagePlainName(track.targetLanguage);
  return `${track.courseTitle} (${nativeName} → ${targetName})`;
}

/**
 * Computes beginner-understandable publication & draft status labels that
 * accurately reflect actual system state.
 */
export function formatFriendlyCourseStatusSummary(summary: CmsTrackSummary): {
  badgeLabel: string;
  shortStatusLabel: string;
  description: string;
  moduleCountLabel: string;
  isStarted: boolean;
} {
  if (summary.publishedModuleCount > 0) {
    if (summary.hasDraft && summary.draftModuleCount > 0) {
      const changeWord =
        summary.draftModuleCount === 1
          ? '1 unpublished change'
          : `${summary.draftModuleCount} unpublished changes`;
      return {
        badgeLabel: `Draft — ${changeWord}`,
        shortStatusLabel: 'Published + Unpublished Edits',
        description:
          "Students currently see the published course. Your saved draft changes stay private until you publish them.",
        moduleCountLabel: `${summary.publishedModuleCount} Published Modules`,
        isStarted: true,
      };
    }
    return {
      badgeLabel: 'Published — No unpublished changes',
      shortStatusLabel: 'Published',
      description: 'What students currently see in the learning app.',
      moduleCountLabel: `${summary.publishedModuleCount} Published Modules`,
      isStarted: true,
    };
  }

  if (summary.draftModuleCount > 0) {
    const modWord =
      summary.draftModuleCount === 1
        ? '1 Draft Module'
        : `${summary.draftModuleCount} Draft Modules`;
    const statusPrefix =
      summary.lifecycleState === 'VALIDATED'
        ? 'Ready for Review'
        : `Draft — ${summary.draftModuleCount} unpublished module${summary.draftModuleCount === 1 ? '' : 's'}`;
    return {
      badgeLabel: statusPrefix,
      shortStatusLabel: 'In Progress (Draft)',
      description:
        "Changes you're still working on. Students cannot see this course until it is published.",
      moduleCountLabel: modWord,
      isStarted: true,
    };
  }

  return {
    badgeLabel: 'Not Started',
    shortStatusLabel: 'Not Started',
    description: "This course doesn't have any lessons yet.",
    moduleCountLabel: '0 Modules',
    isStarted: false,
  };
}

export interface FriendlyValidationMessage {
  categoryLabel: 'Must Fix' | 'Recommended' | 'Information';
  whatIsWrong: string;
  whereItIs: string;
  whyItMatters: string;
  howToFixIt: string;
  canJumpToEditor: boolean;
  targetModuleId?: string;
  targetLessonId?: string;
  targetActivityId?: string;
  technicalCode: string;
  technicalPath: string;
  rawMessage: string;
}

/**
 * Translates technical validation issues into plain, supportive American English
 * suitable for a high school student while preserving technical details in an
 * expandable disclosure.
 */
export function formatFriendlyValidationIssue(
  issue: CmsValidationIssue,
  trackId?: string
): FriendlyValidationMessage {
  const categoryLabel: FriendlyValidationMessage['categoryLabel'] =
    issue.severity === 'ERROR'
      ? 'Must Fix'
      : issue.severity === 'WARNING'
        ? 'Recommended'
        : 'Information';

  // Parse module/lesson/activity hints from locationPath if available
  let targetModuleId: string | undefined;
  let targetLessonId: string | undefined;
  let targetActivityId: string | undefined;

  if (trackId) {
    const draft = getOrCreateCmsCourseDraft(trackId);
    const modMatch = issue.locationPath.match(/modules\[(\d+)\]/);
    if (modMatch) {
      const mIdx = parseInt(modMatch[1], 10);
      const mod = draft.draftPackage.modules[mIdx];
      if (mod) {
        targetModuleId = mod.moduleId;
        const secMatch = issue.locationPath.match(/sections\[(\d+)\]/);
        const lesMatch = issue.locationPath.match(/lessons\[(\d+)\]/);
        if (secMatch && lesMatch && mod.sections) {
          const sec = mod.sections[parseInt(secMatch[1], 10)];
          const les = sec?.lessons?.[parseInt(lesMatch[1], 10)];
          if (les) {
            targetLessonId = les.lessonId;
            const actMatch = issue.locationPath.match(/activities\[(\d+)\]/);
            if (actMatch && les.activities) {
              const act = les.activities[parseInt(actMatch[1], 10)];
              if (act) targetActivityId = act.activityId;
            }
          }
        }
      }
    }
  }

  let whereItIs = 'Course Settings';
  if (targetModuleId && targetLessonId && targetActivityId) {
    whereItIs = `Module ${targetModuleId} → Lesson ${targetLessonId} → Question ${targetActivityId}`;
  } else if (targetModuleId && targetLessonId) {
    whereItIs = `Module ${targetModuleId} → Lesson ${targetLessonId}`;
  } else if (targetModuleId) {
    whereItIs = `Module ${targetModuleId}`;
  } else if (issue.locationPath && issue.locationPath !== 'modules') {
    whereItIs = issue.locationPath;
  }

  let whatIsWrong = issue.message;
  let whyItMatters =
    'Fixing this helps make sure students have a smooth learning experience.';
  let howToFixIt =
    'Open the lesson in Edit Content, update the field, and click Save Draft.';

  switch (issue.code) {
    case 'INVALID_ANSWER_KEY_INDEX':
    case 'MISSING_OR_INVALID_CORRECT_ANSWER':
      whatIsWrong =
        "This question doesn't have a valid correct answer selected.";
      whyItMatters =
        'This question needs a correct answer before it can be published. Without a valid correct answer choice, students cannot get credit when they answer this question.';
      howToFixIt =
        'Open this question in Edit Content and select one of the answer choices as the Correct Answer.';
      break;
    case 'MISSING_MC_OPTIONS':
    case 'INVALID_ANSWER_OPTIONS':
      whatIsWrong =
        'This multiple-choice question needs at least 2 answer choices.';
      whyItMatters =
        'Students need at least two choices to pick from in a multiple-choice question.';
      howToFixIt =
        'Open this question in Edit Content and type at least two answer choices.';
      break;
    case 'EMPTY_SECTION_IN_DRAFT':
      whatIsWrong = 'This section has no lessons.';
      whyItMatters =
        'An empty section appears blank to students unless you add a lesson or remove the empty section.';
      howToFixIt =
        'Add a lesson to this section in Edit Content, or remove the empty section from your draft.';
      break;
    case 'EMPTY_LESSON_CONTENT':
      whatIsWrong = 'This lesson has no content.';
      whyItMatters =
        'Students opening this lesson would see an empty page with no explanation or practice items.';
      howToFixIt =
        'Open this lesson in Edit Content to add explanation text or questions, or remove the empty lesson.';
      break;
    case 'BROKEN_INTERNAL_LINK':
      whatIsWrong =
        "This module links to a prerequisite module you've removed.";
      whyItMatters =
        'Prerequisite links tell the app which earlier module a student should complete first.';
      howToFixIt =
        'Restore the removed prerequisite module from Removed Items, or update this module in Edit Content.';
      break;
    case 'DUPLICATE_MODULE_ID':
      whatIsWrong =
        'Two modules are using the same ID. Each module needs a unique ID.';
      whyItMatters =
        'If two modules share the same ID, student progress and lessons can get mixed up.';
      howToFixIt =
        'Give each module a distinct ID or remove the duplicate module.';
      break;
    case 'DUPLICATE_LESSON_ID':
      whatIsWrong =
        'Two lessons are using the same ID. Each lesson needs a unique ID.';
      whyItMatters =
        'Unique lesson IDs make sure the app opens the right lesson when a student clicks it.';
      howToFixIt = 'Ensure every lesson has its own unique ID.';
      break;
    case 'DUPLICATE_ACTIVITY_ID':
      whatIsWrong =
        'Two practice questions or activities are using the same ID.';
      whyItMatters =
        'Each practice question needs a unique ID so student answers are graded accurately.';
      howToFixIt = 'Ensure each question in the lesson has a unique ID.';
      break;
    case 'MISSING_VOCABULARY_REFERENCE':
    case 'BROKEN_VOCABULARY_REFERENCE':
      whatIsWrong =
        "This lesson links to a vocabulary word that couldn't be found.";
      whyItMatters =
        'Students may see a missing word card if a linked vocabulary word is not in the Vocabulary dictionary.';
      howToFixIt =
        'Check the Vocabulary tab to make sure the word exists, or update the vocabulary link in the lesson.';
      break;
    case 'UNVERIFIED_MEDIA_ASSET_REFERENCE':
    case 'MISSING_REQUIRED_MEDIA':
      whatIsWrong =
        "This lesson links to an image or audio file that couldn't be found in the Media Library.";
      whyItMatters =
        'A missing image or audio file may not load when a student opens the lesson.';
      howToFixIt =
        'Open the Media tab to pick an existing photo or check the file name.';
      break;
    case 'HUMAN_PEDAGOGICAL_REVIEW_REQUIRED':
      whatIsWrong =
        'Automated checks ran cleanly — please review lesson explanations and examples before publishing.';
      whyItMatters =
        'A quick human read-through makes sure grammar tips and translations are natural and clear for students.';
      howToFixIt =
        'Click "Preview as Student" to read through your changes, or add a Reviewer Note below.';
      break;
    case 'EMPTY_COURSE_CANNOT_PUBLISH':
    case 'EMPTY_PUBLISHED_COURSE_CONFLICT':
      whatIsWrong = "This course doesn't have any modules or lessons yet.";
      whyItMatters =
        'A course needs at least one module and lesson before it can be published for students.';
      howToFixIt =
        'Click "Edit Content" and add your first module, or import a course file.';
      break;
    case 'ACCIDENTAL_MODULE_DELETION_DETECTED':
      whatIsWrong =
        'One or more published modules were removed from this draft.';
      whyItMatters =
        'Publishing with missing modules would remove existing lessons that students rely on.';
      howToFixIt =
        'Open "Removed Items" in Edit Content to restore the removed module(s), or click "Discard Unpublished Changes" to restore all 29 published modules.';
      break;
    case 'SYNTHETIC_FIXTURE_PUBLICATION_BLOCKED':
      whatIsWrong =
        'This course is marked as a sample test course and cannot be published to students.';
      whyItMatters =
        'Sample test courses are only for trying out the studio and should not replace real student courses.';
      howToFixIt =
        'Replace the sample content with real lessons before publishing.';
      break;
    default:
      break;
  }

  return {
    categoryLabel,
    whatIsWrong,
    whereItIs,
    whyItMatters,
    howToFixIt,
    canJumpToEditor: Boolean(targetModuleId),
    targetModuleId,
    targetLessonId,
    targetActivityId,
    technicalCode: issue.code,
    technicalPath: issue.locationPath,
    rawMessage: issue.message,
  };
}

export interface CmsGuidedTourStep {
  stepNumber: number;
  title: string;
  explanation: string;
  targetTab: CmsWorkspaceTab;
}

export function getCmsGuidedTourSteps(): CmsGuidedTourStep[] {
  return [
    {
      stepNumber: 1,
      title: '1. Choose a Course',
      explanation:
        'Use the course menu at the top or open "My Courses" to pick which language course you want to work on—like Learn Ukrainian (29 modules) or any of the other 27 courses.',
      targetTab: 'courses',
    },
    {
      stepNumber: 2,
      title: '2. Open a Module',
      explanation:
        'In "Edit Content", the left panel shows your Course Outline. Click any module (such as Module A0.1) to see its sections and lessons.',
      targetTab: 'editor',
    },
    {
      stepNumber: 3,
      title: '3. Edit a Lesson or Question',
      explanation:
        'Click any lesson in the outline to open it in the center editor. You can change the lesson title, explanation text, or multiple-choice practice questions using simple text boxes.',
      targetTab: 'editor',
    },
    {
      stepNumber: 4,
      title: '4. Save Your Draft Safely',
      explanation:
        'Click "Save Draft" whenever you make a change. Saving a draft keeps your edits in a private workspace—students will NOT see your changes until you publish them.',
      targetTab: 'editor',
    },
    {
      stepNumber: 5,
      title: '5. Preview as a Student',
      explanation:
        'Click "Preview as Student" at any time to test your lesson inside the real course player. You can switch between "Preview My Changes" and "See Published Course".',
      targetTab: 'preview',
    },
    {
      stepNumber: 6,
      title: '6. Review and Publish',
      explanation:
        'When your edits are ready, open "Review & Publish" to automatically check for missing answers or broken links, then publish your approved changes.',
      targetTab: 'validation',
    },
    {
      stepNumber: 7,
      title: '7. Undo Mistakes or Restore Earlier Versions',
      explanation:
        'Made a mistake? You can click "Discard Unpublished Changes" in the editor, or open "Advanced Tools → Previous Versions" to restore an earlier backup.',
      targetTab: 'advanced',
    },
  ];
}

export interface CmsCentralHelpTopic {
  id: string;
  title: string;
  summary: string;
  steps: string[];
}

export function getCmsCentralHelpTopics(): CmsCentralHelpTopic[] {
  return [
    {
      id: 'edit-lesson',
      title: 'How to edit a lesson',
      summary: 'Update lesson titles, summaries, and explanations safely.',
      steps: [
        'Click "Edit Content" in the top menu.',
        'Pick your course from the top course selector (for example, Learn Ukrainian).',
        'In the left Course Outline, click a module (like A0.1) and click a lesson.',
        'Type your changes in the "Lesson title", "Summary", or "Explanation" box.',
        'Click "Save Draft". Your edits are saved privately without changing what students currently see.',
      ],
    },
    {
      id: 'add-module',
      title: 'How to add a module',
      summary: 'Create a brand-new module with a starter section and lesson.',
      steps: [
        'Open "Edit Content" (or click "Add Your First Module" on an empty course card in "My Courses").',
        'Click "+ Add Module" at the top of the Course Outline on the left.',
        'A new draft module and starter lesson will appear immediately in the outline.',
        'Click the new lesson to customize its title, explanation, and practice questions.',
      ],
    },
    {
      id: 'add-questions',
      title: 'How to add or edit practice questions',
      summary: 'Create multiple-choice questions and select the right answer.',
      steps: [
        'Open a lesson in "Edit Content" and scroll to the "Practice Questions & Activities" card.',
        'Click an existing question tab (or click "+ Add Practice Question" to create a new one).',
        'Type the question in the "Question Prompt" box.',
        'Type the answer choices and click the circular button next to the choice that is the Correct Answer.',
        'Click "Save Question to Draft".',
      ],
    },
    {
      id: 'preview-course',
      title: 'How to preview a course',
      summary: 'Test how your course looks and works for students.',
      steps: [
        'Click the "Preview as Student" button in the top bar or inside the editor.',
        'Click "Preview My Changes" to test your saved draft edits.',
        'Click "See Published Course" to compare against what students currently see.',
        'Answering questions in Preview is 100% sandboxed—it never changes real student flashcards or XP.',
      ],
    },
    {
      id: 'import-file',
      title: 'How to import a course file',
      summary: 'Add modules and lessons from a course file (.json).',
      steps: [
        'Click "Import Content" on the Home screen (or open "Advanced Tools → Import Course Content").',
        'Choose whether to add new modules to your existing draft or replace the draft.',
        'Select a .json course file from your device (or load one of the built-in sample files).',
        'Click "Check File Contents" to see how many modules and lessons are inside.',
        'Click "Confirm Import into Draft" to bring the lessons into your private draft.',
      ],
    },
    {
      id: 'fix-errors',
      title: 'How to fix problems before publishing',
      summary: 'Use the automatic problem checker to find missing answers.',
      steps: [
        'Click "Review & Publish" in the top navigation bar.',
        'Look under "Must Fix" for any issues that would block publishing (such as a question missing a correct answer).',
        'Read "What is wrong" and "How to fix it", then click "Go to Problem" to jump straight to that lesson.',
      ],
    },
    {
      id: 'publish-changes',
      title: 'How to publish changes',
      summary: 'Make your reviewed draft edits live when ready.',
      steps: [
        'Save your edits in "Edit Content" and test them in "Preview as Student".',
        'Open "Review & Publish" and make sure there are 0 "Must Fix" problems.',
        'Review the summary of changes comparing your draft against the current published version.',
        'Click "Publish Approved Changes" and confirm.',
      ],
    },
    {
      id: 'restore-version',
      title: 'How to undo mistakes or restore an earlier version',
      summary:
        'Remove items safely in your draft, undo actions, restore removed items, or recover previous versions.',
      steps: [
        'When you click "Remove" on a module, section, lesson, question, paragraph, table, or answer choice, it is only removed from your private draft—never from the live published course.',
        'Click "↩ Undo" in the editor toolbar or notification banner to immediately undo your last removal or edit.',
        'Open "Removed Items" in the editor toolbar to see everything removed in your draft and click "Restore to Original Spot" on any item.',
        'To undo all unpublished edits on a published course (like Learn Ukrainian), click "Discard Unpublished Changes", or open "Advanced Tools → Previous Versions" to restore an earlier backup.',
      ],
    },
  ];
}

// ============================================================================
// 1. EDITOR SELECTION & STATE HELPERS
// ============================================================================

function ensureEditorSelectionForDraft(trackId: string): void {
  const draft = getOrCreateCmsCourseDraft(trackId);
  const pkg = draft.draftPackage;
  if (!pkg.modules || pkg.modules.length === 0) {
    cmsUiState.selectedModuleId = '';
    cmsUiState.selectedSectionId = '';
    cmsUiState.selectedLessonId = '';
    cmsUiState.selectedActivityId = '';
    return;
  }
  let mod = pkg.modules.find((m) => m.moduleId === cmsUiState.selectedModuleId);
  if (!mod) {
    mod = pkg.modules[0];
    cmsUiState.selectedModuleId = mod.moduleId;
  }
  const sections = mod.sections || [];
  let sec = sections.find((s) => s.sectionId === cmsUiState.selectedSectionId);
  if (
    cmsUiState.selectedLessonId &&
    (!sec ||
      !(sec.lessons || []).some(
        (l) => l.lessonId === cmsUiState.selectedLessonId
      ))
  ) {
    const matchingSec = sections.find((s) =>
      (s.lessons || []).some((l) => l.lessonId === cmsUiState.selectedLessonId)
    );
    if (matchingSec) {
      sec = matchingSec;
      cmsUiState.selectedSectionId = matchingSec.sectionId;
    }
  }
  if (!sec && sections.length > 0) {
    sec = sections[0];
    cmsUiState.selectedSectionId = sec.sectionId;
  }
  const lessons = sec?.lessons || mod.lessons || [];
  let les = lessons.find((l) => l.lessonId === cmsUiState.selectedLessonId);
  if (!les && lessons.length > 0) {
    les = lessons[0];
    cmsUiState.selectedLessonId = les.lessonId;
  }
  const activities = les?.activities || [];
  let act = activities.find(
    (a) => a.activityId === cmsUiState.selectedActivityId
  );
  if (!act && activities.length > 0) {
    act = activities[0];
    cmsUiState.selectedActivityId = act.activityId;
  } else if (activities.length === 0) {
    cmsUiState.selectedActivityId = '';
  }
}

function recordLastEditedLesson(): void {
  const draft = getOrCreateCmsCourseDraft(cmsUiState.selectedTrackId);
  const pkg = draft.draftPackage;
  const mod = pkg.modules.find(
    (m) => m.moduleId === cmsUiState.selectedModuleId
  );
  const sec = (mod?.sections || []).find(
    (s) => s.sectionId === cmsUiState.selectedSectionId
  );
  const les = (sec?.lessons || mod?.lessons || []).find(
    (l) => l.lessonId === cmsUiState.selectedLessonId
  );
  if (mod && les) {
    cmsUiState.lastEditedItem = {
      trackId: cmsUiState.selectedTrackId,
      moduleId: mod.moduleId,
      sectionId: sec?.sectionId || '',
      lessonId: les.lessonId,
      lessonTitle: les.title,
      courseTitle: pkg.courseTitle,
      timestamp: Date.now(),
    };
  }
}

// ============================================================================
// 2. OPEN / CLOSE & ROUTE DETECTION
// ============================================================================

export function openLangoContentStudio(
  initialTab?: CmsWorkspaceTab,
  trackId?: string
): void {
  const rootEl = document.getElementById('lango-cms-studio-root');
  const appShellEl = document.querySelector('.app-shell') as HTMLElement | null;
  if (!rootEl) return;

  const access = evaluateCmsAccessContext();
  if (!access.isAllowed) {
    rootEl.classList.remove('hidden');
    rootEl.style.display = 'block';
    rootEl.innerHTML = `
      <div style="max-width:720px; margin:48px auto; padding:28px; background:var(--surface-1); border:1px solid var(--danger); border-radius:var(--radius-lg);">
        <h2 style="margin:0 0 10px 0; color:var(--danger);">🔒 Content Studio — Restricted Access</h2>
        <p style="margin:0 0 16px 0; color:var(--text-secondary); font-size:14px; line-height:1.5;">
          ${escapeHtml(access.denialReason || 'Course editing is restricted to the trusted development environment so public visitors cannot modify published lessons.')}
        </p>
        <button type="button" class="btn" onclick="closeLangoContentStudio()">← Return to Learning App</button>
      </div>
    `;
    return;
  }

  cmsUiState.isOpen = true;
  if (initialTab) {
    cmsUiState.activeTab = initialTab;
    if (
      initialTab === 'importer' ||
      initialTab === 'versions' ||
      initialTab === 'export'
    ) {
      cmsUiState.advancedSubTab = initialTab;
    }
  }
  if (trackId) cmsUiState.selectedTrackId = trackId;
  ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);

  if (appShellEl) appShellEl.classList.add('hidden');
  rootEl.classList.remove('hidden');
  rootEl.style.display = 'block';
  renderLangoContentStudio();
}

export function closeLangoContentStudio(): void {
  cmsUiState.isOpen = false;
  const rootEl = document.getElementById('lango-cms-studio-root');
  const appShellEl = document.querySelector('.app-shell') as HTMLElement | null;
  if (rootEl) {
    rootEl.classList.add('hidden');
    rootEl.style.display = 'none';
  }
  if (appShellEl) {
    appShellEl.classList.remove('hidden');
  }
  if (
    typeof window !== 'undefined' &&
    (window.location.pathname === '/studio' ||
      window.location.search.includes('studio=1'))
  ) {
    window.history.replaceState({}, '', '/');
  }
}

export function switchCmsWorkspaceTab(
  tab: CmsWorkspaceTab,
  trackId?: string
): void {
  if (
    cmsUiState.hasUnsavedEditorChanges &&
    cmsUiState.activeTab === 'editor' &&
    tab !== 'editor'
  ) {
    setCmsBanner(
      'warn',
      'Note: You had unsaved typing in the editor. Click "Edit Content" and press "Save Draft" whenever you want to keep your changes.'
    );
    cmsUiState.hasUnsavedEditorChanges = false;
  }
  cmsUiState.activeTab = tab;
  if (tab === 'importer' || tab === 'versions' || tab === 'export') {
    cmsUiState.advancedSubTab = tab;
  }
  if (trackId) {
    cmsUiState.selectedTrackId = trackId;
    ensureEditorSelectionForDraft(trackId);
  }
  renderLangoContentStudio();
}

export function openCmsAdvancedSubTab(
  subTab: CmsAdvancedSubTab,
  trackId?: string
): void {
  cmsUiState.activeTab = 'advanced';
  cmsUiState.advancedSubTab = subTab;
  if (trackId) {
    cmsUiState.selectedTrackId = trackId;
    ensureEditorSelectionForDraft(trackId);
  }
  renderLangoContentStudio();
}

export function selectCmsActiveTrack(trackId: string): void {
  cmsUiState.selectedTrackId = trackId;
  cmsUiState.hasUnsavedEditorChanges = false;
  cmsUiState.pendingPublishConfirmation = false;
  cmsUiState.pendingRestoreVersionId = '';
  ensureEditorSelectionForDraft(trackId);
  renderLangoContentStudio();
}

// ============================================================================
// 3. MAIN STUDIO SHELL RENDERER
// ============================================================================

export function renderLangoContentStudio(): void {
  const rootEl = document.getElementById('lango-cms-studio-root');
  if (!rootEl || !cmsUiState.isOpen) return;

  const summaries = getAllCmsTrackSummaries();
  const currentSummary =
    summaries.find((s) => s.trackId === cmsUiState.selectedTrackId) ||
    summaries[0];
  const friendlyStatus = currentSummary
    ? formatFriendlyCourseStatusSummary(currentSummary)
    : null;

  const trackOptionsHtml = getAllCourseTracks()
    .map((t) => {
      const sum = summaries.find((s) => s.trackId === t.trackId);
      const statusSuffix =
        sum && sum.publishedModuleCount > 0
          ? ` — ${sum.publishedModuleCount} Published Modules`
          : sum && sum.draftModuleCount > 0
            ? ` — ${sum.draftModuleCount} Draft Module(s)`
            : ' — Not Started';
      return `<option value="${t.trackId}" ${t.trackId === cmsUiState.selectedTrackId ? 'selected' : ''}>${escapeHtml(formatFriendlyCourseDisplayName(t.trackId))}${escapeHtml(statusSuffix)}</option>`;
    })
    .join('');

  const isAdvancedActive =
    cmsUiState.activeTab === 'advanced' ||
    cmsUiState.activeTab === 'importer' ||
    cmsUiState.activeTab === 'versions' ||
    cmsUiState.activeTab === 'export';

  const primaryNavItems: Array<{
    id: CmsWorkspaceTab;
    label: string;
    isActive: boolean;
  }> = [
    {
      id: 'dashboard',
      label: 'Home',
      isActive: cmsUiState.activeTab === 'dashboard',
    },
    {
      id: 'courses',
      label: 'My Courses',
      isActive: cmsUiState.activeTab === 'courses',
    },
    {
      id: 'editor',
      label: 'Edit Content',
      isActive: cmsUiState.activeTab === 'editor',
    },
    {
      id: 'vocabulary',
      label: 'Vocabulary',
      isActive: cmsUiState.activeTab === 'vocabulary',
    },
    {
      id: 'media',
      label: 'Media',
      isActive: cmsUiState.activeTab === 'media',
    },
    {
      id: 'identify',
      label: 'Identify Scenes',
      isActive: cmsUiState.activeTab === 'identify',
    },
    {
      id: 'validation',
      label: 'Review & Publish',
      isActive: cmsUiState.activeTab === 'validation',
    },
  ];

  const bannerHtml = cmsUiState.bannerNotification
    ? `<div data-testid="cms-status-banner" style="margin-bottom:14px; padding:12px 16px; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; background:${
        cmsUiState.bannerNotification.type === 'success'
          ? 'var(--success-container)'
          : cmsUiState.bannerNotification.type === 'warn'
            ? 'var(--warn-container)'
            : 'var(--danger-container)'
      }; color:${
        cmsUiState.bannerNotification.type === 'success'
          ? 'var(--success-on-container)'
          : cmsUiState.bannerNotification.type === 'warn'
            ? 'var(--warn-on-container)'
            : 'var(--danger-on-container)'
      }; font-size:13.5px; font-weight:700;">
        <span>${escapeHtml(cmsUiState.bannerNotification.message)}</span>
        <div style="display:flex; gap:8px; align-items:center;">
          ${
            cmsUiState.bannerNotification.showUndoButton
              ? `<button type="button" class="btn" data-testid="cms-banner-btn-undo" style="min-height:28px; padding:3px 12px; font-size:11.5px; font-weight:800;" onclick="handleUndoCmsEditorAction()">↩ Undo</button>`
              : ''
          }
          <button type="button" class="btn btn-sec" style="min-height:28px; padding:3px 10px; font-size:11.5px;" onclick="dismissCmsBanner()">Dismiss</button>
        </div>
      </div>`
    : '';

  const tourHtml = cmsUiState.tourActive ? renderCmsGuidedTourBanner() : '';

  let workspaceBodyHtml = '';
  switch (cmsUiState.activeTab) {
    case 'dashboard':
      workspaceBodyHtml = renderCmsDashboardTab();
      break;
    case 'courses':
      workspaceBodyHtml = renderCmsCoursesTab();
      break;
    case 'editor':
      workspaceBodyHtml = renderCmsEditorTab();
      break;
    case 'vocabulary':
      workspaceBodyHtml = renderCmsVocabularyTab();
      break;
    case 'media':
      workspaceBodyHtml = renderCmsMediaTab();
      break;
    case 'identify':
      registerIdentifyStudioRerenderHook(renderLangoContentStudio);
      workspaceBodyHtml = renderCmsIdentifySceneManagerTab();
      break;
    case 'validation':
      workspaceBodyHtml = renderCmsValidationTab();
      break;
    case 'preview':
      workspaceBodyHtml = renderCmsPreviewTab();
      break;
    case 'importer':
      workspaceBodyHtml = renderCmsAdvancedTab('importer');
      break;
    case 'versions':
      workspaceBodyHtml = renderCmsAdvancedTab('versions');
      break;
    case 'export':
      workspaceBodyHtml = renderCmsAdvancedTab('export');
      break;
    case 'advanced':
      workspaceBodyHtml = renderCmsAdvancedTab(cmsUiState.advancedSubTab);
      break;
    case 'help':
      workspaceBodyHtml = renderCmsHelpTab();
      break;
  }

  const globalSearchHtml = cmsUiState.globalSearchQuery.trim()
    ? renderGlobalSearchResultsOverlay(cmsUiState.globalSearchQuery)
    : '';

  rootEl.innerHTML = `
    <div data-testid="lango-cms-studio-shell" class="cms-studio-shell">
      <!-- Studio Top Header -->
      <div class="card" style="margin-bottom:14px; padding:16px 20px; background:var(--surface-1); border:1px solid var(--border-strong);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
          <div>
            <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
              <h1 style="margin:0; font-size:21px; font-weight:900; color:var(--text);">Content Studio</h1>
              <span style="font-size:12.5px; color:var(--text-secondary);">·</span>
              <span style="font-size:12.5px; color:var(--text-secondary); font-weight:600;">
                Create, organize, and improve your language courses in one place.
              </span>
            </div>
          </div>

          <div class="cms-header-controls">
            <label for="cms-active-track-select" style="font-size:12px; font-weight:800; color:var(--text-secondary); white-space:nowrap;">
              Current Course:
            </label>
            <select
              id="cms-active-track-select"
              data-testid="cms-active-track-select"
              aria-label="Choose a course to edit"
              class="input-box"
              style="width:310px; min-height:38px; padding:6px 10px; font-size:13px; font-weight:700;"
              onchange="selectCmsActiveTrack(this.value)"
            >
              ${trackOptionsHtml}
            </select>
            <input
              id="cms-global-search-input"
              data-testid="cms-global-search-input"
              type="search"
              aria-label="Search courses, lessons, or vocabulary"
              class="input-box"
              style="width:210px; min-height:38px; padding:6px 10px; font-size:12.5px;"
              placeholder="Search lessons or words..."
              value="${escapeHtml(cmsUiState.globalSearchQuery)}"
              oninput="handleCmsGlobalSearchInput(this.value)"
            />
            <button
              type="button"
              class="btn btn-sec"
              data-testid="btn-open-cms-tour"
              style="min-height:38px; padding:6px 12px; font-size:12.5px; font-weight:700;"
              onclick="startCmsGuidedTour()"
              title="Take a quick 7-step tour of Content Studio"
            >
              Guided Tour
            </button>
            <button
              type="button"
              class="btn btn-sec"
              data-testid="btn-close-cms-studio"
              style="min-height:38px; padding:6px 14px; font-size:12.5px; font-weight:800;"
              onclick="closeLangoContentStudio()"
            >
              ← Back to Learning App
            </button>
          </div>
        </div>

        <!-- Simplified Primary Navigation Bar -->
        <div class="cms-nav-bar" role="navigation" aria-label="Content Studio sections">
          ${primaryNavItems
            .map(
              (item) => `
              <button
                type="button"
                data-testid="cms-tab-${item.id}"
                class="stage-pill ${item.isActive ? 'active' : ''}"
                style="min-height:36px; padding:6px 14px; font-size:12.5px; font-weight:800;"
                onclick="switchCmsWorkspaceTab('${item.id}')"
              >
                ${escapeHtml(item.label)}
              </button>
            `
            )
            .join('')}

          <button
            type="button"
            data-testid="cms-tab-preview"
            class="stage-pill ${cmsUiState.activeTab === 'preview' ? 'active' : ''}"
            style="min-height:36px; padding:6px 14px; font-size:12.5px; font-weight:800;"
            onclick="switchCmsWorkspaceTab('preview')"
            title="See exactly how your lesson will look to students"
          >
            Preview as Student
          </button>

          <button
            type="button"
            data-testid="cms-tab-advanced"
            class="stage-pill ${isAdvancedActive ? 'active' : ''}"
            style="min-height:36px; padding:6px 14px; font-size:12.5px; font-weight:700;"
            onclick="switchCmsWorkspaceTab('advanced')"
            title="Import files, view version history, inspect JSON, or export"
          >
            Advanced Tools
          </button>

          <button
            type="button"
            data-testid="cms-tab-help"
            class="stage-pill ${cmsUiState.activeTab === 'help' ? 'active' : ''}"
            style="min-height:36px; padding:6px 12px; font-size:12.5px; font-weight:700;"
            onclick="switchCmsWorkspaceTab('help')"
          >
            Help
          </button>

          <!-- Hidden compatibility tab triggers so existing automated scripts targeting legacy tab testids continue to work -->
          <button type="button" data-testid="cms-tab-importer" class="hidden" onclick="switchCmsWorkspaceTab('importer')">Import Course Content</button>
          <button type="button" data-testid="cms-tab-versions" class="hidden" onclick="switchCmsWorkspaceTab('versions')">Version History</button>
          <button type="button" data-testid="cms-tab-export" class="hidden" onclick="switchCmsWorkspaceTab('export')">Export Course File</button>
        </div>
      </div>

      ${bannerHtml}
      ${tourHtml}
      ${globalSearchHtml}

      <!-- Plain-English Current Course Status Bar -->
      <div data-testid="cms-active-course-context-bar" style="margin-bottom:14px; padding:10px 16px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; font-size:12.5px;">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span>Editing Course: <b style="color:var(--text);">${escapeHtml(formatFriendlyCourseDisplayName(cmsUiState.selectedTrackId))}</b></span>
          <span aria-hidden="true">·</span>
          <span>Status: <b data-testid="cms-context-status-label" style="color:${currentSummary?.hasDraft ? 'var(--warn)' : 'var(--success)'};">${escapeHtml(friendlyStatus?.badgeLabel || 'Published')}</b></span>
          <span aria-hidden="true">·</span>
          <span style="color:var(--text-secondary);">${escapeHtml(friendlyStatus?.moduleCountLabel || '')}</span>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button type="button" class="btn btn-sec" style="min-height:32px; padding:4px 12px; font-size:12px;" onclick="switchCmsWorkspaceTab('editor')">Edit Lessons</button>
          <button type="button" class="btn btn-sec" style="min-height:32px; padding:4px 12px; font-size:12px;" onclick="switchCmsWorkspaceTab('preview')">Preview as Student</button>
          <button type="button" class="btn btn-sec" style="min-height:32px; padding:4px 12px; font-size:12px;" onclick="switchCmsWorkspaceTab('validation')">Check for Problems</button>
        </div>
      </div>

      <!-- Workspace Body -->
      <div id="cms-workspace-body">
        ${workspaceBodyHtml}
      </div>
    </div>
  `;
}

// ============================================================================
// 4. OPTIONAL FIRST-TIME GUIDED TOUR BANNER
// ============================================================================

function renderCmsGuidedTourBanner(): string {
  const steps = getCmsGuidedTourSteps();
  const idx = Math.max(0, Math.min(steps.length - 1, cmsUiState.tourStepIndex));
  const step = steps[idx];

  return `
    <div class="card" data-testid="cms-guided-tour-banner" style="margin-bottom:14px; padding:16px 18px; background:var(--surface-1); border:2px solid var(--accent);">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap;">
        <div style="max-width:780px;">
          <div style="font-size:11.5px; font-weight:800; color:var(--accent); margin-bottom:4px;">
            Quick Guided Tour · Step ${step.stepNumber} of ${steps.length}
          </div>
          <h3 style="margin:0 0 6px 0; font-size:16px; font-weight:800; color:var(--text);">
            ${escapeHtml(step.title)}
          </h3>
          <p style="margin:0; font-size:13.5px; color:var(--text-secondary); line-height:1.5;">
            ${escapeHtml(step.explanation)}
          </p>
        </div>
        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <button
            type="button"
            class="btn btn-sec"
            style="min-height:34px; padding:5px 12px; font-size:12px;"
            ${idx === 0 ? 'disabled' : ''}
            onclick="stepCmsGuidedTour(-1)"
          >
            ← Back
          </button>
          ${
            idx < steps.length - 1
              ? `<button
                  type="button"
                  class="btn"
                  data-testid="cms-tour-next-btn"
                  style="min-height:34px; padding:5px 14px; font-size:12px;"
                  onclick="stepCmsGuidedTour(1)"
                >
                  Next Step →
                </button>`
              : `<button
                  type="button"
                  class="btn"
                  data-testid="cms-tour-finish-btn"
                  style="min-height:34px; padding:5px 14px; font-size:12px;"
                  onclick="closeCmsGuidedTour()"
                >
                  Finish Tour
                </button>`
          }
          <button
            type="button"
            class="btn btn-sec"
            data-testid="cms-tour-close-btn"
            style="min-height:34px; padding:5px 12px; font-size:12px;"
            onclick="closeCmsGuidedTour()"
          >
            Skip / Close Tour
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderGlobalSearchResultsOverlay(query: string): string {
  const results = searchCmsContentStudio(query);
  return `
    <div class="card" data-testid="cms-global-search-results" style="margin-bottom:14px; padding:14px 16px; border:1px solid var(--accent);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <div style="font-size:13.5px; font-weight:800;">
          Search Results for "${escapeHtml(query)}" (${results.length} found)
        </div>
        <button type="button" class="btn btn-sec" style="min-height:28px; padding:3px 10px; font-size:11.5px;" onclick="handleCmsGlobalSearchInput('')">Clear Search</button>
      </div>
      <div style="display:flex; flex-direction:column; gap:6px; font-size:12.5px;">
        ${
          results
            .slice(0, 10)
            .map(
              (r) =>
                `<div style="padding:6px 0; border-bottom:1px solid var(--border-subtle);">
                  <span style="font-weight:700; color:var(--text-secondary);">${escapeHtml(r.resultType.replace('_', ' '))}:</span>
                  <a href="javascript:void(0)" style="color:var(--accent); font-weight:700; margin-left:4px;" onclick="handleSearchResultClick('${r.resultType}', '${r.courseTrackId}', '${r.itemId}')">${escapeHtml(r.title)}</a>
                  <span style="color:var(--text-secondary);"> — ${escapeHtml(r.subtitle)}</span>
                </div>`
            )
            .join('') || '<div style="color:var(--text-secondary);">No matching lessons, courses, or vocabulary words found.</div>'
        }
      </div>
    </div>
  `;
}

// ============================================================================
// 5. TAB 1: FRIENDLY CMS HOME SCREEN (`dashboard`)
// ============================================================================

function renderCmsDashboardTab(): string {
  const m = getCmsDashboardMetrics();
  const summaries = getAllCmsTrackSummaries();
  const coursesWithUnpublishedEdits = summaries.filter((s) => s.hasDraft).length;
  const coursesInProgress = summaries.filter(
    (s) => s.lifecycleState === 'DRAFT' || s.hasDraft
  ).length;
  const contentNeedingAttention =
    m.totalValidationErrors + m.totalValidationWarnings;

  const continueEditingHtml = cmsUiState.lastEditedItem
    ? `
      <div class="card" data-testid="cms-continue-editing-card" style="padding:16px 18px; margin-bottom:16px; background:var(--surface-2); border:1px solid var(--border-strong); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <div style="font-size:11.5px; font-weight:800; color:var(--accent);">Continue Editing</div>
          <div style="font-size:15px; font-weight:800; color:var(--text); margin-top:2px;">
            ${escapeHtml(cmsUiState.lastEditedItem.lessonTitle)}
          </div>
          <div style="font-size:12.5px; color:var(--text-secondary); margin-top:2px;">
            ${escapeHtml(cmsUiState.lastEditedItem.courseTitle)} · Module ${escapeHtml(cmsUiState.lastEditedItem.moduleId)}
          </div>
        </div>
        <button
          type="button"
          class="btn"
          onclick="resumeLastEditedCmsLesson()"
        >
          Continue Editing Lesson →
        </button>
      </div>
    `
    : '';

  return `
    <div data-testid="cms-dashboard-view">
      <!-- Welcome Hero Card -->
      <div class="card" style="padding:20px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:14px;">
          <div style="max-width:740px;">
            <h2 style="margin:0 0 6px 0; font-size:20px; font-weight:900; color:var(--text);">
              Welcome to Content Studio
            </h2>
            <p style="margin:0; font-size:14px; color:var(--text-secondary); line-height:1.55;">
              Create, organize, and improve your language courses in one place. Every edit you make is saved safely in a private draft first—students won't see your changes until you review and publish them.
            </p>
          </div>
          ${
            !cmsUiState.tourActive && !cmsUiState.tourDismissed
              ? `<button type="button" class="btn btn-sec" onclick="startCmsGuidedTour()">New here? Start 1-Minute Tour</button>`
              : ''
          }
        </div>

        <!-- 4 Clear Primary Actions -->
        <div class="cms-quick-actions-grid" style="margin-top:16px;">
          <div style="padding:14px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-md); display:flex; flex-direction:column; justify-content:space-between; gap:10px;">
            <div>
              <div style="font-size:14.5px; font-weight:800; color:var(--text);">Edit a Course</div>
              <div style="font-size:12.5px; color:var(--text-secondary); margin-top:3px; line-height:1.45;">
                Open Learn Ukrainian (29 modules) or any other course to edit lessons and practice questions.
              </div>
            </div>
            <button type="button" class="btn" data-testid="cms-home-btn-edit-course" onclick="switchCmsWorkspaceTab('editor')">
              Edit a Course
            </button>
          </div>

          <div style="padding:14px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-md); display:flex; flex-direction:column; justify-content:space-between; gap:10px;">
            <div>
              <div style="font-size:14.5px; font-weight:800; color:var(--text);">Add a Lesson</div>
              <div style="font-size:12.5px; color:var(--text-secondary); margin-top:3px; line-height:1.45;">
                Add a new module or lesson to your currently selected course in one click.
              </div>
            </div>
            <button type="button" class="btn btn-sec" data-testid="cms-home-btn-add-lesson" onclick="handleQuickAddLessonFromHome()">
              Add a Lesson
            </button>
          </div>

          <div style="padding:14px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-md); display:flex; flex-direction:column; justify-content:space-between; gap:10px;">
            <div>
              <div style="font-size:14.5px; font-weight:800; color:var(--text);">Import Content</div>
              <div style="font-size:12.5px; color:var(--text-secondary); margin-top:3px; line-height:1.45;">
                Upload a course file to add modules, lessons, and practice questions into a draft.
              </div>
            </div>
            <button type="button" class="btn btn-sec" data-testid="cms-home-btn-import-content" onclick="openCmsAdvancedSubTab('importer')">
              Import Content
            </button>
          </div>

          <div style="padding:14px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-md); display:flex; flex-direction:column; justify-content:space-between; gap:10px;">
            <div>
              <div style="font-size:14.5px; font-weight:800; color:var(--text);">Preview a Course</div>
              <div style="font-size:12.5px; color:var(--text-secondary); margin-top:3px; line-height:1.45;">
                See how your course looks to students using the interactive course player.
              </div>
            </div>
            <button type="button" class="btn btn-sec" data-testid="cms-home-btn-preview-course" onclick="switchCmsWorkspaceTab('preview')">
              Preview a Course
            </button>
          </div>
        </div>
      </div>

      ${continueEditingHtml}

      <!-- 6-Step Guided Workflow Overview -->
      <div class="card" style="padding:16px 18px; margin-bottom:16px;">
        <div style="font-size:14px; font-weight:800; color:var(--text); margin-bottom:10px;">
          How Course Editing Works (6 Simple Steps)
        </div>
        <div class="cms-workflow-stepper">
          <button type="button" class="btn btn-sec" style="flex-direction:column; align-items:flex-start; text-align:left; padding:10px; height:auto;" onclick="switchCmsWorkspaceTab('courses')">
            <span style="font-size:11px; color:var(--accent); font-weight:800;">STEP 1</span>
            <span style="font-size:12.5px; font-weight:800; margin-top:2px;">Choose a Course</span>
          </button>
          <button type="button" class="btn btn-sec" style="flex-direction:column; align-items:flex-start; text-align:left; padding:10px; height:auto;" onclick="switchCmsWorkspaceTab('editor')">
            <span style="font-size:11px; color:var(--accent); font-weight:800;">STEP 2</span>
            <span style="font-size:12.5px; font-weight:800; margin-top:2px;">Choose a Module</span>
          </button>
          <button type="button" class="btn btn-sec" style="flex-direction:column; align-items:flex-start; text-align:left; padding:10px; height:auto;" onclick="switchCmsWorkspaceTab('editor')">
            <span style="font-size:11px; color:var(--accent); font-weight:800;">STEP 3</span>
            <span style="font-size:12.5px; font-weight:800; margin-top:2px;">Choose a Lesson</span>
          </button>
          <button type="button" class="btn btn-sec" style="flex-direction:column; align-items:flex-start; text-align:left; padding:10px; height:auto;" onclick="switchCmsWorkspaceTab('editor')">
            <span style="font-size:11px; color:var(--accent); font-weight:800;">STEP 4</span>
            <span style="font-size:12.5px; font-weight:800; margin-top:2px;">Make Changes</span>
          </button>
          <button type="button" class="btn btn-sec" style="flex-direction:column; align-items:flex-start; text-align:left; padding:10px; height:auto;" onclick="switchCmsWorkspaceTab('preview')">
            <span style="font-size:11px; color:var(--accent); font-weight:800;">STEP 5</span>
            <span style="font-size:12.5px; font-weight:800; margin-top:2px;">Preview Changes</span>
          </button>
          <button type="button" class="btn btn-sec" style="flex-direction:column; align-items:flex-start; text-align:left; padding:10px; height:auto;" onclick="switchCmsWorkspaceTab('validation')">
            <span style="font-size:11px; color:var(--accent); font-weight:800;">STEP 6</span>
            <span style="font-size:12.5px; font-weight:800; margin-top:2px;">Review & Publish</span>
          </button>
        </div>
      </div>

      <!-- Real Course Summary Cards -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:12px; margin-bottom:16px;">
        <div class="card" style="padding:14px;">
          <div style="font-size:12px; color:var(--text-secondary); font-weight:700;">Courses Available</div>
          <div style="font-size:26px; font-weight:900; color:var(--accent); margin-top:4px; font-variant-numeric:tabular-nums;" data-testid="cms-metric-total-tracks">${m.totalRegisteredTracks}</div>
          <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">14 Foreign Languages · 14 English Courses</div>
        </div>
        <div class="card" style="padding:14px;">
          <div style="font-size:12px; color:var(--text-secondary); font-weight:700;">Published Courses</div>
          <div style="font-size:24px; font-weight:900; color:var(--success); margin-top:4px; font-variant-numeric:tabular-nums;" data-testid="cms-metric-uk-summary">
            ${m.publishedCoursesCount} Course (${m.ukrainianPublishedModules} Modules)
          </div>
          <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">Learn Ukrainian · ${m.ukrainianCourseVocabCount} Words</div>
        </div>
        <div class="card" style="padding:14px;">
          <div style="font-size:12px; color:var(--text-secondary); font-weight:700;">Courses in Progress</div>
          <div style="font-size:24px; font-weight:900; color:var(--text); margin-top:4px; font-variant-numeric:tabular-nums;">
            ${coursesInProgress}
          </div>
          <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">${coursesWithUnpublishedEdits} with unpublished changes</div>
        </div>
        <div class="card" style="padding:14px;">
          <div style="font-size:12px; color:var(--text-secondary); font-weight:700;">Content Needing Attention</div>
          <div style="font-size:24px; font-weight:900; color:${contentNeedingAttention > 0 ? 'var(--warn)' : 'var(--success)'}; margin-top:4px; font-variant-numeric:tabular-nums;">
            ${contentNeedingAttention === 0 ? '0 Issues' : `${contentNeedingAttention} Item(s)`}
          </div>
          <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">${m.mediaAssetsCount} Photos · ${m.canonicalEnglishLexemesCount} Dictionary Words</div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// 6. TAB 2: MY COURSES (`courses` — ALL 28 COURSES)
// ============================================================================

function renderCmsCoursesTab(): string {
  let tracks = getAllCmsTrackSummaries();

  if (cmsUiState.courseDirectionFilter !== 'all') {
    tracks = tracks.filter(
      (t) => t.learningDirection === cmsUiState.courseDirectionFilter
    );
  }
  if (cmsUiState.courseStatusFilter !== 'all') {
    tracks = tracks.filter(
      (t) => t.lifecycleState === cmsUiState.courseStatusFilter
    );
  }
  if (cmsUiState.courseSearchQuery.trim()) {
    const q = cmsUiState.courseSearchQuery.trim().toLowerCase();
    tracks = tracks.filter(
      (t) =>
        t.trackId.toLowerCase().includes(q) ||
        t.courseTitle.toLowerCase().includes(q) ||
        getLanguagePlainName(t.nativeLanguage).toLowerCase().includes(q) ||
        getLanguagePlainName(t.targetLanguage).toLowerCase().includes(q)
    );
  }

  tracks.sort((a, b) => {
    // Keep Published courses (Learn Ukrainian) at the top when sorting by modules or default if equal
    if (cmsUiState.courseSortBy === 'modules')
      return (
        b.publishedModuleCount +
        b.draftModuleCount -
        (a.publishedModuleCount + a.draftModuleCount)
      );
    if (cmsUiState.courseSortBy === 'updated')
      return (b.lastModifiedAt || 0) - (a.lastModifiedAt || 0);
    if (a.publishedModuleCount !== b.publishedModuleCount) {
      return b.publishedModuleCount - a.publishedModuleCount;
    }
    return a.courseTitle.localeCompare(b.courseTitle);
  });

  return `
    <div data-testid="cms-courses-view">
      <div class="card" style="margin-bottom:14px; padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <div style="font-size:11.5px; font-weight:800; color:var(--accent);">Step 1 of 3: Choose a Course</div>
            <h2 style="margin:2px 0 4px 0; font-size:18px; font-weight:800;">My Courses (${tracks.length} of 28 Shown)</h2>
            <div style="font-size:12.5px; color:var(--text-secondary);">
              Pick a course below to open its lessons, make edits in a private draft, or preview how it looks to students.
            </div>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <input
              type="search"
              data-testid="cms-course-filter-search"
              aria-label="Search courses by name or language"
              class="input-box"
              style="width:210px; min-height:36px; font-size:12.5px;"
              placeholder="Search by language..."
              value="${escapeHtml(cmsUiState.courseSearchQuery)}"
              oninput="setCmsCourseManagerFilter('search', this.value)"
            />
            <select aria-label="Filter courses by direction" class="input-box" style="width:210px; min-height:36px; font-size:12.5px;" onchange="setCmsCourseManagerFilter('direction', this.value)">
              <option value="all" ${cmsUiState.courseDirectionFilter === 'all' ? 'selected' : ''}>All Courses (28)</option>
              <option value="en_to_foreign" ${cmsUiState.courseDirectionFilter === 'en_to_foreign' ? 'selected' : ''}>For English Speakers (14)</option>
              <option value="foreign_to_en" ${cmsUiState.courseDirectionFilter === 'foreign_to_en' ? 'selected' : ''}>Learn English Courses (14)</option>
            </select>
            <select aria-label="Filter courses by status" class="input-box" style="width:165px; min-height:36px; font-size:12.5px;" onchange="setCmsCourseManagerFilter('status', this.value)">
              <option value="all" ${cmsUiState.courseStatusFilter === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="PUBLISHED" ${cmsUiState.courseStatusFilter === 'PUBLISHED' ? 'selected' : ''}>Published</option>
              <option value="DRAFT" ${cmsUiState.courseStatusFilter === 'DRAFT' ? 'selected' : ''}>In Progress (Draft)</option>
              <option value="EMPTY" ${cmsUiState.courseStatusFilter === 'EMPTY' ? 'selected' : ''}>Not Started</option>
            </select>
            <select aria-label="Sort courses" class="input-box" style="width:155px; min-height:36px; font-size:12.5px;" onchange="setCmsCourseManagerFilter('sort', this.value)">
              <option value="title" ${cmsUiState.courseSortBy === 'title' ? 'selected' : ''}>Sort: Featured & Name</option>
              <option value="modules" ${cmsUiState.courseSortBy === 'modules' ? 'selected' : ''}>Sort: Most Modules</option>
              <option value="updated" ${cmsUiState.courseSortBy === 'updated' ? 'selected' : ''}>Sort: Recently Edited</option>
            </select>
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:14px;">
        ${tracks.map((t) => renderCmsCourseTrackCard(t)).join('')}
      </div>
    </div>
  `;
}

function renderCmsCourseTrackCard(t: CmsTrackSummary): string {
  const friendly = formatFriendlyCourseStatusSummary(t);
  const nativeName = getLanguagePlainName(t.nativeLanguage);
  const targetName = getLanguagePlainName(t.targetLanguage);
  const lastEditedText = t.lastModifiedAt
    ? `Last edited ${new Date(t.lastModifiedAt).toLocaleDateString()}`
    : '';

  return `
    <div class="card" data-testid="cms-track-card-${t.trackId}" style="padding:16px; display:flex; flex-direction:column; justify-content:space-between; gap:12px;">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
          <div>
            <div style="font-size:16px; font-weight:800; color:var(--text);">${escapeHtml(t.courseTitle)}</div>
            <div style="font-size:12.5px; color:var(--text-secondary); margin-top:2px;">
              For <b>${escapeHtml(nativeName)}</b> speakers learning <b>${escapeHtml(targetName)}</b>
            </div>
          </div>
        </div>

        <div style="margin-top:10px; padding:10px 12px; background:var(--surface-2); border-radius:var(--radius-xs); font-size:12.5px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
            <span style="font-weight:800; color:var(--text);">${escapeHtml(friendly.moduleCountLabel)}</span>
            <span style="font-weight:700; color:${t.publishedModuleCount > 0 ? 'var(--success)' : t.draftModuleCount > 0 ? 'var(--accent)' : 'var(--text-secondary)'};">
              ${escapeHtml(friendly.badgeLabel)}
            </span>
          </div>
          <div style="color:var(--text-secondary); font-size:12px; margin-top:4px; line-height:1.4;">
            ${escapeHtml(friendly.description)}
          </div>
          ${
            lastEditedText
              ? `<div style="color:var(--text-secondary); font-size:11.5px; margin-top:4px;">${escapeHtml(lastEditedText)}</div>`
              : ''
          }
        </div>
      </div>

      <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
        ${
          friendly.isStarted
            ? `
              <button
                type="button"
                class="btn"
                data-testid="cms-card-btn-editor-${t.trackId}"
                style="flex:1; min-height:36px; padding:6px 12px; font-size:12.5px;"
                onclick="switchCmsWorkspaceTab('editor', '${t.trackId}')"
              >
                Edit
              </button>
              <button
                type="button"
                class="btn btn-sec"
                data-testid="cms-card-btn-preview-${t.trackId}"
                style="min-height:36px; padding:6px 12px; font-size:12.5px;"
                onclick="switchCmsWorkspaceTab('preview', '${t.trackId}')"
              >
                Preview
              </button>
            `
            : `
              <button
                type="button"
                class="btn"
                data-testid="cms-card-btn-editor-${t.trackId}"
                style="flex:1; min-height:36px; padding:6px 12px; font-size:12.5px;"
                onclick="handleStartFirstModuleForTrack('${t.trackId}')"
              >
                Add Your First Module
              </button>
              <button
                type="button"
                class="btn btn-sec"
                data-testid="cms-card-btn-preview-${t.trackId}"
                style="min-height:36px; padding:6px 10px; font-size:12px;"
                onclick="switchCmsWorkspaceTab('editor', '${t.trackId}')"
              >
                Open Course
              </button>
            `
        }

        <details class="cms-more-menu">
          <summary class="btn btn-sec" style="min-height:36px; padding:6px 10px; font-size:12px;">
            More Options ▾
          </summary>
          <div style="position:absolute; right:0; bottom:42px; min-width:195px; padding:8px; background:var(--surface-1); border:1px solid var(--border-strong); border-radius:var(--radius-sm); box-shadow:var(--shadow-card); z-index:30; display:flex; flex-direction:column; gap:4px;">
            <button type="button" class="btn btn-sec" style="justify-content:flex-start; min-height:32px; font-size:12px;" onclick="switchCmsWorkspaceTab('editor', '${t.trackId}')">Open Course Outline</button>
            <button type="button" class="btn btn-sec" style="justify-content:flex-start; min-height:32px; font-size:12px;" onclick="switchCmsWorkspaceTab('validation', '${t.trackId}')">Check for Problems</button>
            <button type="button" class="btn btn-sec" style="justify-content:flex-start; min-height:32px; font-size:12px;" onclick="openCmsAdvancedSubTab('importer', '${t.trackId}')">Import Course Content</button>
            <button type="button" class="btn btn-sec" style="justify-content:flex-start; min-height:32px; font-size:12px;" onclick="openCmsAdvancedSubTab('versions', '${t.trackId}')">Previous Versions</button>
            <button type="button" class="btn btn-sec" style="justify-content:flex-start; min-height:32px; font-size:12px;" onclick="openCmsAdvancedSubTab('export', '${t.trackId}')">Export Course File</button>
            <div style="padding-top:4px; margin-top:4px; border-top:1px solid var(--border-subtle); font-size:10.5px; color:var(--text-secondary);">
              Course ID: <code>${escapeHtml(t.trackId)}</code>
            </div>
          </div>
        </details>
      </div>
    </div>
  `;
}

// ============================================================================
// 7. TAB 3: COURSE & LESSON EDITOR (`editor` — 3-COLUMN DESKTOP / 1-PANEL MOBILE)
// ============================================================================

function renderCmsOriginStatusBadge(
  status?: CmsContentOriginStatus | unknown,
  testId?: string
): string {
  const s = (status as CmsContentOriginStatus | undefined) || 'PUBLISHED';
  const styleMap: Record<
    CmsContentOriginStatus,
    { bg: string; fg: string; label: string; friendlyLabel: string }
  > = {
    PUBLISHED: {
      bg: 'var(--success-container)',
      fg: 'var(--success-on-container)',
      label: 'PUBLISHED',
      friendlyLabel: 'Published',
    },
    UNCHANGED: {
      bg: 'var(--surface-2)',
      fg: 'var(--text-secondary)',
      label: 'UNCHANGED',
      friendlyLabel: 'Unchanged',
    },
    MODIFIED_DRAFT: {
      bg: 'var(--warn-container)',
      fg: 'var(--warn-on-container)',
      label: 'MODIFIED DRAFT',
      friendlyLabel: 'Unpublished Edit',
    },
    NEW_DRAFT: {
      bg: 'var(--accent-container)',
      fg: 'var(--accent-on-container)',
      label: 'NEW DRAFT',
      friendlyLabel: 'New Draft',
    },
  };
  const cfg = styleMap[s] || styleMap.PUBLISHED;
  return `<span ${testId ? `data-testid="${escapeHtml(testId)}"` : ''} data-origin-status="${cfg.label}" class="tag" style="background:${cfg.bg}; color:${cfg.fg}; font-size:10px; padding:2px 7px; font-weight:800;">${cfg.label}</span>`;
}

function renderCmsEditorTab(): string {
  ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);
  const draft = getOrCreateCmsCourseDraft(cmsUiState.selectedTrackId);
  const pkg = draft.draftPackage;
  const baselinePkg = getPublishedBaselineCoursePackage(
    cmsUiState.selectedTrackId
  );
  const hasPublishedBaseline = Boolean(
    baselinePkg && baselinePkg.modules.length > 0
  );
  const activeMod = pkg.modules.find(
    (m) => m.moduleId === cmsUiState.selectedModuleId
  );
  const activeSec = (activeMod?.sections || []).find(
    (s) => s.sectionId === cmsUiState.selectedSectionId
  );
  const activeLesson = (activeSec?.lessons || activeMod?.lessons || []).find(
    (l) => l.lessonId === cmsUiState.selectedLessonId
  );
  const activeActivity = (activeLesson?.activities || []).find(
    (a) => a.activityId === cmsUiState.selectedActivityId
  );

  const undoState = getCmsUndoRedoState(cmsUiState.selectedTrackId);
  const removedItems = getCmsRemovedItemsInDraft(
    cmsUiState.selectedTrackId,
    false
  );
  const detailedSummary = computeCmsDetailedChangeSummary(
    cmsUiState.selectedTrackId
  );

  const modifiedCount = draft.modifiedModuleIds?.length || 0;
  const newDraftCount = draft.newDraftModuleIds?.length || 0;
  const removedModCount = draft.removedBaselineModuleIds?.length || 0;
  const hasDraftEdits =
    Boolean(draft.hasDraftChanges) || removedItems.length > 0;
  const totalUnpublishedChanges =
    modifiedCount + newDraftCount + removedModCount + removedItems.length;

  const pubVsDraftDiff =
    cmsUiState.showDraftVsPublishedDiffDrawer && hasPublishedBaseline
      ? computeCmsDraftVsPublishedDiff(cmsUiState.selectedTrackId)
      : null;

  const statusHeadline = cmsUiState.hasUnsavedEditorChanges
    ? 'Unsaved typing on this page — Click "Save Draft" to save your changes'
    : hasPublishedBaseline
      ? hasDraftEdits
        ? `Draft — ${totalUnpublishedChanges} unpublished change${totalUnpublishedChanges === 1 ? '' : 's'} saved in your private draft`
        : 'Published — No unpublished changes (Showing the 29 published modules students see)'
      : pkg.modules.length > 0
        ? `Draft — ${pkg.modules.length} draft module${pkg.modules.length === 1 ? '' : 's'} in progress`
        : 'Not Started — No lessons yet';

  const sourceOverlayBannerHtml = hasPublishedBaseline
    ? `
      <div data-testid="cms-editor-source-banner" style="margin-top:12px; padding:12px 14px; border-radius:var(--radius-sm); background:${hasDraftEdits ? 'var(--warn-container)' : 'var(--surface-2)'}; color:${hasDraftEdits ? 'var(--warn-on-container)' : 'var(--text)'}; border:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; font-size:12.5px;">
        <div>
          <div style="font-weight:800;">
            ${
              hasDraftEdits
                ? `Unpublished Changes Saved: ${detailedSummary.plainEnglishBullets.join(' · ') || `${modifiedCount} modified module(s)`}`
                : `Current Published Version: All ${baselinePkg?.modules.length || 29} published modules are loaded · No unpublished changes yet`
            }
          </div>
          <div style="font-size:12px; opacity:0.9; margin-top:2px;">
            What students see is protected. Any edits or removals you make here stay in your private draft until you review and publish them.
          </div>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button
            type="button"
            class="btn btn-sec"
            data-testid="cms-btn-compare-published"
            style="min-height:32px; padding:4px 10px; font-size:12px;"
            onclick="toggleCmsDraftVsPublishedDiffDrawer()"
          >
            ${cmsUiState.showDraftVsPublishedDiffDrawer ? 'Hide Change Comparison' : 'Compare Changes'}
          </button>
          <button
            type="button"
            class="btn btn-sec"
            data-testid="cms-editor-btn-preview-published"
            style="min-height:32px; padding:4px 10px; font-size:12px;"
            onclick="openCmsPreviewWithMode('published')"
          >
            See Published Course
          </button>
          <button
            type="button"
            class="btn btn-sec"
            data-testid="cms-editor-btn-preview-draft"
            style="min-height:32px; padding:4px 10px; font-size:12px;"
            onclick="openCmsPreviewWithMode('draft')"
          >
            Preview My Changes
          </button>
          ${
            hasDraftEdits
              ? `<button
                  type="button"
                  class="btn btn-sec"
                  data-testid="cms-btn-discard-draft"
                  style="min-height:32px; padding:4px 10px; font-size:12px; border-color:var(--danger); color:var(--danger);"
                  onclick="handleDiscardCmsDraftOverlay()"
                  title="Undo all unpublished draft edits and return to the current published course"
                >
                  Discard Unpublished Changes
                </button>`
              : ''
          }
        </div>
      </div>
    `
    : '';

  const pendingConfirmationHtml = cmsUiState.pendingRemovalConfirmation
    ? (() => {
        const imp = cmsUiState.pendingRemovalConfirmation!;
        const counts = imp.affectedCounts;
        const countBadges: string[] = [];
        if (counts.sections > 0)
          countBadges.push(`${counts.sections} Section(s)`);
        if (counts.lessons > 0) countBadges.push(`${counts.lessons} Lesson(s)`);
        if (counts.questions > 0)
          countBadges.push(`${counts.questions} Practice / Exam Question(s)`);
        if (counts.vocabularyRefs > 0)
          countBadges.push(`${counts.vocabularyRefs} Linked Vocabulary Word(s)`);
        if (counts.mediaRefs > 0)
          countBadges.push(`${counts.mediaRefs} Linked Photo(s)`);

        return `
          <div data-testid="cms-removal-confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="cms-removal-modal-title" class="card" style="margin-bottom:14px; padding:18px 20px; background:var(--surface-1); border:2px solid var(--danger); box-shadow:var(--shadow-card);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap;">
              <div style="max-width:760px;">
                <div style="font-size:11.5px; font-weight:800; color:var(--danger); text-transform:uppercase; letter-spacing:0.04em;">
                  Confirm Draft Removal
                </div>
                <h3 id="cms-removal-modal-title" style="margin:4px 0 6px 0; font-size:17px; font-weight:900; color:var(--text);">
                  Remove ${escapeHtml(imp.itemTypeLabel)} from Your Draft?
                </h3>
                <div style="font-size:13.5px; font-weight:700; color:var(--text); margin-bottom:4px;">
                  ${escapeHtml(imp.itemTitle)}
                </div>
                <div style="font-size:12px; color:var(--text-secondary); margin-bottom:10px;">
                  Location: ${escapeHtml(imp.locationBreadcrumb)}
                </div>

                ${
                  countBadges.length > 0
                    ? `<div data-testid="cms-removal-impact-counts" style="padding:10px 12px; background:var(--surface-2); border-radius:var(--radius-xs); font-size:12.5px; margin-bottom:10px;">
                        <div style="font-weight:800; color:var(--text); margin-bottom:4px;">What is inside this ${escapeHtml(imp.itemTypeLabel.toLowerCase())}:</div>
                        <div style="color:var(--text-secondary);">${escapeHtml(countBadges.join(' · '))}</div>
                      </div>`
                    : ''
                }

                ${
                  imp.dependencyWarning
                    ? `<div data-testid="cms-removal-dependency-warning" style="padding:10px 12px; background:var(--warn-container); color:var(--warn-on-container); border-radius:var(--radius-xs); font-size:12.5px; font-weight:700; margin-bottom:10px;">
                        ⚠️ ${escapeHtml(imp.dependencyWarning)}
                      </div>`
                    : ''
                }

                ${
                  imp.sharedAssetPreservedNote
                    ? `<div style="font-size:12px; color:var(--text-secondary); margin-bottom:8px;">
                        🔒 <b>Shared Assets Protected:</b> ${escapeHtml(imp.sharedAssetPreservedNote)}
                      </div>`
                    : ''
                }

                <div style="font-size:12.5px; color:var(--text-secondary); line-height:1.5;">
                  ✅ <b>Safe & Reversible:</b> This only changes your unpublished draft. The published course students see will not change until you publish, and you can restore this ${escapeHtml(imp.itemTypeLabel.toLowerCase())} anytime from <b>Removed Items</b> or click <b>Undo</b>.
                </div>
              </div>

              <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-top:6px;">
                <button
                  type="button"
                  class="btn btn-sec"
                  data-testid="cms-btn-cancel-removal"
                  style="min-height:38px; padding:6px 14px; font-size:13px; font-weight:800;"
                  onclick="cancelPendingCmsRemoval()"
                >
                  Keep ${escapeHtml(imp.itemTypeLabel)}
                </button>
                <button
                  type="button"
                  class="btn"
                  data-testid="cms-btn-confirm-removal"
                  style="min-height:38px; padding:6px 16px; font-size:13px; font-weight:800; background:var(--danger); border-color:var(--danger); color:#fff;"
                  onclick="confirmPendingCmsRemoval()"
                >
                  🗑️ Remove from Draft
                </button>
              </div>
            </div>
          </div>
        `;
      })()
    : '';

  const removedItemsDrawerHtml = cmsUiState.showRemovedItemsDrawer
    ? `
      <div data-testid="cms-removed-items-drawer" class="card" style="margin-bottom:14px; padding:16px 18px; background:var(--surface-1); border:1px solid var(--border-strong);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
          <div>
            <h3 style="margin:0; font-size:15.5px; font-weight:800; color:var(--text);">
              🗑️ Removed Items in Your Draft (${removedItems.length})
            </h3>
            <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">
              Items you remove stay safely here while you edit. Click <b>Restore</b> on any item to put it right back where it was.
            </div>
          </div>
          <button type="button" class="btn btn-sec" style="min-height:30px; padding:4px 10px; font-size:12px;" onclick="toggleCmsRemovedItemsDrawer()">Close Removed Items</button>
        </div>
        ${
          removedItems.length === 0
            ? `<div data-testid="cms-removed-items-empty" style="padding:14px; background:var(--surface-2); border-radius:var(--radius-xs); font-size:12.5px; color:var(--text-secondary);">
                No removed items in this course draft. Any module, section, lesson, paragraph, example, table row, or question you remove will appear here so you can restore it anytime.
              </div>`
            : `<div style="display:flex; flex-direction:column; gap:8px; max-height:320px; overflow-y:auto;">
                ${removedItems
                  .map(
                    (rec) => `
                  <div data-testid="cms-removed-item-row-${rec.removalId}" style="padding:10px 12px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-xs); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                    <div>
                      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                        <span class="tag" style="background:var(--danger-container); color:var(--danger-on-container); font-size:10.5px; font-weight:800;">${escapeHtml(rec.itemTypeLabel)}</span>
                        <span style="font-size:13px; font-weight:800; color:var(--text);">${escapeHtml(rec.itemTitle)}</span>
                      </div>
                      <div style="font-size:11.5px; color:var(--text-secondary); margin-top:3px;">
                        Original Location: <b>${escapeHtml(rec.locationBreadcrumb)}</b> · Removed at ${new Date(rec.removedAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <button
                      type="button"
                      class="btn btn-sec"
                      data-testid="cms-btn-restore-item-${rec.removalId}"
                      style="min-height:32px; padding:4px 12px; font-size:12px; font-weight:800;"
                      onclick="handleRestoreRemovedCmsItem('${rec.removalId}')"
                    >
                      ↩ Restore
                    </button>
                  </div>
                `
                  )
                  .join('')}
              </div>`
        }
      </div>
    `
    : '';

  const unpublishedChangesDrawerHtml = cmsUiState.showUnpublishedChangesSummaryDrawer
    ? `
      <div data-testid="cms-unpublished-changes-drawer" class="card" style="margin-bottom:14px; padding:16px 18px; background:var(--surface-1); border:1px solid var(--border-strong);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:10px;">
          <div>
            <h3 style="margin:0; font-size:15.5px; font-weight:800; color:var(--text);">
              📋 Your Unpublished Changes
            </h3>
            <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">
              A plain-English summary of everything added, edited, or removed in your private draft compared to the published course.
            </div>
          </div>
          <button type="button" class="btn btn-sec" style="min-height:30px; padding:4px 10px; font-size:12px;" onclick="toggleCmsUnpublishedChangesDrawer()">Close Summary</button>
        </div>
        ${
          detailedSummary.plainEnglishBullets.length === 0
            ? `<div style="padding:12px; background:var(--surface-2); border-radius:var(--radius-xs); font-size:12.5px; color:var(--text-secondary);">
                No unpublished changes yet. Your draft matches the published course.
              </div>`
            : `<ul data-testid="cms-unpublished-changes-bullets" style="margin:0; padding-left:20px; font-size:13px; color:var(--text); line-height:1.7;">
                ${detailedSummary.plainEnglishBullets.map((b) => `<li><b>${escapeHtml(b)}</b></li>`).join('')}
              </ul>`
        }
      </div>
    `
    : '';

  return `
    <div data-testid="cms-editor-view">
      ${pendingConfirmationHtml}
      ${removedItemsDrawerHtml}
      ${unpublishedChangesDrawerHtml}

      <!-- Top Guided Editor Bar -->
      <div class="card" style="margin-bottom:14px; padding:16px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
          <div>
            <div style="font-size:11.5px; font-weight:800; color:var(--accent);">
              Step 2 & 3: Choose a Module and Edit Your Lesson
            </div>
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:2px;">
              <h2 style="margin:0; font-size:18px; font-weight:800;">${escapeHtml(pkg.courseTitle)}</h2>
              <span class="tag" data-testid="cms-editor-lifecycle-tag" style="background:var(--accent-container); color:var(--accent-on-container); font-size:11px; font-weight:800;">State: ${escapeHtml(draft.lifecycleState)}</span>
              <span class="tag" data-testid="cms-editor-module-count-tag" style="background:var(--surface-2); color:var(--text); font-size:11px; font-weight:800;">${pkg.modules.length} Module(s)</span>
            </div>
            <div data-testid="cms-editor-plain-status-line" style="font-size:12.5px; color:var(--text-secondary); margin-top:4px; font-weight:600;">
              ${escapeHtml(statusHeadline)}
            </div>
          </div>

          <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
            <button
              type="button"
              class="btn btn-sec"
              data-testid="cms-btn-undo-action"
              style="min-height:36px; padding:6px 10px; font-size:12px;"
              ${undoState.canUndo ? '' : 'disabled'}
              onclick="handleUndoCmsEditorAction()"
              title="${undoState.lastUndoLabel ? `Undo: ${escapeHtml(undoState.lastUndoLabel)}` : 'Nothing to undo yet'}"
            >
              ↩ Undo
            </button>
            <button
              type="button"
              class="btn btn-sec"
              data-testid="cms-btn-redo-action"
              style="min-height:36px; padding:6px 10px; font-size:12px;"
              ${undoState.canRedo ? '' : 'disabled'}
              onclick="handleRedoCmsEditorAction()"
              title="${undoState.lastRedoLabel ? `Redo: ${escapeHtml(undoState.lastRedoLabel)}` : 'Nothing to redo yet'}"
            >
              ↪ Redo
            </button>
            <button
              type="button"
              class="btn btn-sec"
              data-testid="cms-btn-toggle-removed-items"
              style="min-height:36px; padding:6px 11px; font-size:12px;"
              onclick="toggleCmsRemovedItemsDrawer()"
              title="View and restore items removed from your draft"
            >
              🗑️ Removed Items (${removedItems.length})
            </button>
            <button
              type="button"
              class="btn btn-sec"
              data-testid="cms-btn-toggle-change-summary"
              style="min-height:36px; padding:6px 11px; font-size:12px;"
              onclick="toggleCmsUnpublishedChangesDrawer()"
              title="See a plain-English summary of your unpublished changes"
            >
              📋 Changes (${detailedSummary.plainEnglishBullets.length})
            </button>
            <button
              type="button"
              class="btn btn-sec"
              style="min-height:36px; padding:6px 12px; font-size:12.5px;"
              onclick="handleAddCmsModulePrompt()"
              title="Add a new module to this course draft"
            >
              + Add Module
            </button>
            <button
              type="button"
              class="btn btn-sec"
              style="min-height:36px; padding:6px 12px; font-size:12.5px;"
              onclick="openCmsPreviewWithMode('draft')"
              title="See exactly how your lesson will look to students"
            >
              Preview as Student
            </button>
            <button
              type="button"
              class="btn btn-sec"
              style="min-height:36px; padding:6px 12px; font-size:12.5px;"
              onclick="handleCreateManualSnapshot()"
              title="Save a backup version so you can restore it anytime"
            >
              Save a Backup Version
            </button>
            <button
              type="button"
              class="btn btn-success"
              data-testid="cms-btn-publish-draft"
              style="min-height:36px; padding:6px 14px; font-size:12.5px; font-weight:800;"
              onclick="switchCmsWorkspaceTab('validation')"
              title="Check for problems and publish your approved changes"
            >
              Review & Publish
            </button>
          </div>
        </div>

        ${sourceOverlayBannerHtml}

        ${
          pubVsDraftDiff
            ? `<div data-testid="cms-published-vs-draft-diff-drawer" style="margin-top:12px; padding:12px 14px; background:var(--surface-2); border:1px solid var(--border-strong); border-radius:var(--radius-xs); font-size:12.5px;">
                <div style="font-weight:800; margin-bottom:6px;">Compare Changes: Current Published Version vs. Your Draft</div>
                <div><b>Total Changes:</b> ${pubVsDraftDiff.totalDifferences}</div>
                <div style="margin-top:3px;"><b>New Modules Added:</b> ${pubVsDraftDiff.addedModuleIds.join(', ') || 'None'} · <b>Removed Modules:</b> ${pubVsDraftDiff.removedModuleIds.join(', ') || 'None'}</div>
                <div style="margin-top:3px;"><b>Changed Module Titles:</b> ${pubVsDraftDiff.changedModuleTitles.map((c) => `${c.moduleId} ("${escapeHtml(c.before)}" → "${escapeHtml(c.after)}")`).join(' | ') || 'None'}</div>
                <div style="margin-top:3px;"><b>Modified Lessons:</b> ${pubVsDraftDiff.modifiedLessonIds.join(', ') || 'None (Matches Current Published Version)'}</div>
                <div style="margin-top:3px;"><b>Modified Practice Answer Keys:</b> ${pubVsDraftDiff.changedActivityAnswerKeys.map((a) => a.activityId).join(', ') || 'None'}</div>
              </div>`
            : ''
        }

        ${
          cmsUiState.showSourceJsonDrawer
            ? `<div style="margin-top:12px; padding-top:12px; border-top:1px solid var(--border-subtle);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <span style="font-size:12px; font-weight:800;">Technical Course Data (Read-Only JSON Inspector — ${pkg.modules.length} Modules):</span>
                  <button type="button" class="btn btn-sec" style="min-height:26px; padding:2px 8px; font-size:11px;" onclick="toggleCmsSourceJsonDrawer()">Close JSON View</button>
                </div>
                <textarea data-testid="cms-editor-source-json-textarea" readonly class="input-box" style="width:100%; min-height:200px; font-family:monospace; font-size:11.5px;">${escapeHtml(JSON.stringify(pkg, null, 2))}</textarea>
              </div>`
            : ''
        }
      </div>

      ${
        pkg.modules.length === 0
          ? `<div class="card" data-testid="cms-editor-empty-state" style="padding:32px 24px; text-align:center;">
              <h3 style="margin:0 0 8px 0; font-size:18px;">No lessons yet</h3>
              <p style="margin:0 0 18px 0; color:var(--text-secondary); font-size:13.5px; max-width:520px; margin-left:auto; margin-right:auto; line-height:1.5;">
                Start by adding your first module, restoring a removed module, or importing a course file.
              </p>
              <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
                <button type="button" class="btn" data-testid="cms-btn-create-first-module" onclick="handleAddCmsModulePrompt()">Create a Module</button>
                ${
                  removedItems.length > 0
                    ? `<button type="button" class="btn btn-sec" onclick="toggleCmsRemovedItemsDrawer()">View Removed Items (${removedItems.length})</button>`
                    : ''
                }
                <button type="button" class="btn btn-sec" onclick="openCmsAdvancedSubTab('importer')">Import Course Content</button>
              </div>
            </div>`
          : `
          <!-- Mobile Panel Switcher (Visible on Phone / Narrow Screens <= 960px) -->
          <div class="cms-mobile-panel-tabs" role="tablist" aria-label="Editor panels on mobile">
            <button
              type="button"
              data-testid="cms-mobile-panel-btn-outline"
              class="btn ${cmsUiState.mobileEditorPanel === 'outline' ? '' : 'btn-sec'}"
              style="font-size:12px; padding:8px 6px;"
              onclick="setCmsMobileEditorPanel('outline')"
            >
              1. Outline (${pkg.modules.length})
            </button>
            <button
              type="button"
              data-testid="cms-mobile-panel-btn-lesson"
              class="btn ${cmsUiState.mobileEditorPanel === 'lesson' ? '' : 'btn-sec'}"
              style="font-size:12px; padding:8px 6px;"
              onclick="setCmsMobileEditorPanel('lesson')"
            >
              2. Edit Lesson
            </button>
            <button
              type="button"
              data-testid="cms-mobile-panel-btn-help"
              class="btn ${cmsUiState.mobileEditorPanel === 'help' ? '' : 'btn-sec'}"
              style="font-size:12px; padding:8px 6px;"
              onclick="setCmsMobileEditorPanel('help')"
            >
              3. Help & Info
            </button>
          </div>

          <!-- 3-Part Editor Layout: LEFT Outline | CENTER Lesson & Questions | RIGHT Help & Properties -->
          <div class="cms-three-col-grid">
            <!-- LEFT COLUMN: Course Outline (Course -> Module -> Section -> Lesson) -->
            <div class="card ${cmsUiState.mobileEditorPanel !== 'outline' ? 'cms-mobile-hidden-panel' : ''}" style="padding:14px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <span style="font-size:13.5px; font-weight:800;" data-testid="cms-editor-tree-header">📚 Modules (${pkg.modules.length})</span>
                <button type="button" class="btn btn-sec" style="min-height:28px; padding:3px 9px; font-size:11.5px;" onclick="handleAddCmsModulePrompt()">+ Add Module</button>
              </div>
              <div style="font-size:11.5px; color:var(--text-secondary); margin-bottom:10px;">
                Click a module and lesson below to edit, reorder, duplicate, or remove it from your draft.
              </div>
              <div data-testid="cms-editor-module-tree-list" style="max-height:640px; overflow-y:auto; display:flex; flex-direction:column; gap:8px;">
                ${pkg.modules
                  .map((m, mIdx) => {
                    const isSelectedMod =
                      m.moduleId === cmsUiState.selectedModuleId;
                    const modOrigin =
                      (m.metadata?.cmsOriginStatus as
                        | CmsContentOriginStatus
                        | undefined) ||
                      (hasPublishedBaseline
                        ? hasDraftEdits
                          ? 'UNCHANGED'
                          : 'PUBLISHED'
                        : 'NEW_DRAFT');
                    const displayModPrefix = m.moduleId.match(/^[A-C][0-2]\.\d+$/)
                      ? `${m.moduleId}: `
                      : `Module ${mIdx + 1}: `;
                    return `
                      <div data-testid="cms-tree-module-${m.moduleId}" style="padding:10px; border-radius:var(--radius-xs); border:1px solid ${isSelectedMod ? 'var(--accent)' : 'var(--border-subtle)'}; background:${isSelectedMod ? 'var(--surface-2)' : 'var(--surface-1)'};">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:6px;">
                          <button
                            type="button"
                            style="background:none; border:none; padding:0; text-align:left; cursor:pointer; font-size:13px; font-weight:800; color:var(--text); line-height:1.35;"
                            onclick="selectCmsEditorModule('${m.moduleId}')"
                          >
                            ${escapeHtml(displayModPrefix)}${escapeHtml(m.title)}
                          </button>
                          <div style="display:flex; gap:3px; flex-shrink:0; flex-wrap:wrap; justify-content:flex-end;">
                            <button type="button" class="btn btn-sec" aria-label="Move module ${escapeHtml(m.title)} up" title="Move Up" style="min-height:24px; padding:1px 6px; font-size:10.5px;" ${mIdx === 0 ? 'disabled' : ''} onclick="handleMoveCmsModule(${mIdx}, ${mIdx - 1})">↑</button>
                            <button type="button" class="btn btn-sec" aria-label="Move module ${escapeHtml(m.title)} down" title="Move Down" style="min-height:24px; padding:1px 6px; font-size:10.5px;" ${mIdx === pkg.modules.length - 1 ? 'disabled' : ''} onclick="handleMoveCmsModule(${mIdx}, ${mIdx + 1})">↓</button>
                            <button type="button" class="btn btn-sec" aria-label="Duplicate module ${escapeHtml(m.title)}" title="Duplicate Module" style="min-height:24px; padding:1px 6px; font-size:10.5px;" onclick="handleDuplicateCmsModule('${m.moduleId}')">Copy</button>
                            <button type="button" class="btn btn-sec" data-testid="cms-btn-remove-module-${m.moduleId}" aria-label="Remove module ${escapeHtml(m.title)} from draft" title="Remove Module from Draft" style="min-height:24px; padding:1px 6px; font-size:10.5px; color:var(--danger); border-color:var(--border-subtle);" onclick="handleRequestRemoveModule('${m.moduleId}')">Remove</button>
                          </div>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; margin-top:6px;">
                          <span style="font-size:11px; color:var(--text-secondary);">Level ${escapeHtml(m.proficiencyLevel || 'A1')} · ${(m.sections || []).length} Sections</span>
                          ${renderCmsOriginStatusBadge(modOrigin, `cms-module-origin-badge-${m.moduleId}`)}
                        </div>
                        ${
                          isSelectedMod
                            ? `<div style="margin-top:10px; padding-left:8px; border-left:2px solid var(--accent); display:flex; flex-direction:column; gap:8px;">
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                  <span style="font-size:10.5px; font-weight:800; color:var(--text-secondary);">SECTIONS IN MODULE</span>
                                  <button type="button" class="btn btn-sec" data-testid="cms-btn-add-section-${m.moduleId}" style="min-height:22px; padding:1px 7px; font-size:10.5px;" onclick="handleAddCmsSection('${m.moduleId}')">+ Add Section</button>
                                </div>
                                ${(m.sections || [])
                                  .map((sec) => {
                                    const isCollapsed = Boolean(
                                      cmsUiState.collapsedSectionIds[
                                        sec.sectionId
                                      ]
                                    );
                                    return `
                                    <div data-testid="cms-tree-section-${sec.sectionId}" style="padding:6px; background:var(--surface-1); border:1px solid var(--border-subtle); border-radius:var(--radius-xs);">
                                      <div style="display:flex; justify-content:space-between; align-items:center; gap:4px;">
                                        <button
                                          type="button"
                                          style="background:none; border:none; padding:2px 0; flex:1; display:flex; justify-content:space-between; align-items:center; cursor:pointer; font-size:11px; font-weight:800; color:var(--text-secondary); text-align:left;"
                                          onclick="toggleCmsOutlineSection('${sec.sectionId}')"
                                        >
                                          <span>📂 ${escapeHtml(sec.title)}</span>
                                          <span>${isCollapsed ? '▸' : '▾'}</span>
                                        </button>
                                        <button type="button" class="btn btn-sec" data-testid="cms-btn-add-lesson-${sec.sectionId}" title="Add Lesson to Section" style="min-height:22px; padding:1px 5px; font-size:10px;" onclick="handleAddCmsLesson('${m.moduleId}', '${sec.sectionId}')">+ Lesson</button>
                                        <button type="button" class="btn btn-sec" data-testid="cms-btn-remove-section-${sec.sectionId}" title="Remove Section from Draft" style="min-height:22px; padding:1px 5px; font-size:10px; color:var(--danger);" onclick="handleRequestRemoveSection('${m.moduleId}', '${sec.sectionId}')">Remove</button>
                                      </div>
                                      ${
                                        isCollapsed
                                          ? ''
                                          : `<div style="display:flex; flex-direction:column; gap:4px; margin-top:6px;">
                                              ${(sec.lessons || [])
                                                .map((les) => {
                                                  const isLesSel =
                                                    les.lessonId ===
                                                    cmsUiState.selectedLessonId;
                                                  return `
                                                    <div style="display:flex; gap:4px; align-items:center;">
                                                      <button
                                                        type="button"
                                                        data-testid="cms-tree-lesson-${les.lessonId}"
                                                        class="btn ${isLesSel ? '' : 'btn-sec'}"
                                                        style="flex:1; text-align:left; justify-content:space-between; min-height:30px; padding:4px 8px; font-size:11.5px;"
                                                        onclick="selectCmsEditorLesson('${m.moduleId}', '${sec.sectionId}', '${les.lessonId}')"
                                                      >
                                                        <span>📄 ${escapeHtml(les.title)}</span>
                                                      </button>
                                                      <button type="button" class="btn btn-sec" data-testid="cms-btn-duplicate-lesson-${les.lessonId}" title="Duplicate Lesson" style="min-height:28px; padding:2px 6px; font-size:10px;" onclick="handleDuplicateCmsLesson('${m.moduleId}', '${les.lessonId}')">Copy</button>
                                                      <button type="button" class="btn btn-sec" data-testid="cms-btn-remove-lesson-${les.lessonId}" title="Remove Lesson from Draft" style="min-height:28px; padding:2px 6px; font-size:10px; color:var(--danger);" onclick="handleRequestRemoveLesson('${m.moduleId}', '${sec.sectionId}', '${les.lessonId}')">✕</button>
                                                    </div>
                                                  `;
                                                })
                                                .join('')}
                                            </div>`
                                      }
                                    </div>
                                  `;
                                  })
                                  .join('')}
                              </div>`
                            : ''
                        }
                      </div>
                    `;
                  })
                  .join('')}
              </div>
            </div>

            <!-- CENTER COLUMN: Beginner-Friendly Lesson & Practice Question Editor -->
            <div class="card ${cmsUiState.mobileEditorPanel !== 'lesson' ? 'cms-mobile-hidden-panel' : ''}" style="padding:16px;">
              ${
                activeLesson
                  ? (() => {
                      const lesOrigin =
                        (activeLesson.metadata?.cmsOriginStatus as
                          | CmsContentOriginStatus
                          | undefined) ||
                        (activeMod?.metadata?.cmsOriginStatus as
                          | CmsContentOriginStatus
                          | undefined) ||
                        'PUBLISHED';
                      const ukExt = activeMod?.metadata
                        ?.legacyUkrainianModuleExtension as
                        | {
                            topicTag?: string;
                            reviewSummary?: string;
                            stepByStepCount?: number;
                            moreExamplesCount?: number;
                            importantExceptionsCount?: number;
                            commonMistakesCount?: number;
                            whatToRemember?: string[];
                          }
                        | undefined;

                      const lessonParagraphs = String(
                        activeLesson.instructionalText || ''
                      )
                        .split(/\n\s*\n/)
                        .map((p) => p.trim())
                        .filter(Boolean);

                      const lessonVocabRefs = activeLesson.vocabularyRefs || [];
                      const lessonMediaRefs =
                        (activeLesson.mediaRefs as string[]) || [];

                      return `
                        <!-- Lesson Header -->
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:12px; padding-bottom:10px; border-bottom:1px solid var(--border-subtle); flex-wrap:wrap;">
                          <div>
                            <div style="font-size:11.5px; font-weight:800; color:var(--accent);">
                              Step 4: Make Changes to Your Lesson
                            </div>
                            <h3 style="margin:2px 0 0 0; font-size:16.5px; font-weight:800;">
                              ${escapeHtml(activeLesson.title)}
                            </h3>
                            <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">
                              In <b>${escapeHtml(activeMod?.title || '')}</b> · ${escapeHtml(activeSec?.title || 'Lesson Section')}
                            </div>
                          </div>
                          <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
                            ${renderCmsOriginStatusBadge(lesOrigin, 'cms-active-lesson-origin-badge')}
                            <button
                              type="button"
                              class="btn btn-sec"
                              data-testid="cms-btn-remove-active-lesson"
                              style="min-height:28px; padding:3px 9px; font-size:11px; color:var(--danger); border-color:var(--border-subtle);"
                              onclick="handleRequestRemoveLesson('${activeMod?.moduleId || ''}', '${activeSec?.sectionId || ''}', '${activeLesson.lessonId}')"
                            >
                              🗑️ Remove Lesson
                            </button>
                          </div>
                        </div>

                        <!-- Part 1: Lesson Title, Summary & Explanation Form -->
                        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
                          <div>
                            <label for="cms-edit-lesson-title" style="font-size:12.5px; font-weight:800; color:var(--text); display:block; margin-bottom:2px;">
                              Lesson title
                            </label>
                            <div style="font-size:11.5px; color:var(--text-secondary); margin-bottom:5px;">
                              Enter the name students will see at the top of this lesson.
                            </div>
                            <input
                              id="cms-edit-lesson-title"
                              data-testid="cms-edit-lesson-title"
                              type="text"
                              class="input-box"
                              placeholder="Enter the name students will see."
                              style="width:100%; font-size:13.5px; font-weight:700;"
                              value="${escapeHtml(activeLesson.title)}"
                              oninput="markCmsEditorUnsavedChanges()"
                            />
                          </div>

                          <div>
                            <label for="cms-edit-lesson-summary" style="font-size:12.5px; font-weight:800; color:var(--text); display:block; margin-bottom:2px;">
                              Short Summary
                            </label>
                            <div style="font-size:11.5px; color:var(--text-secondary); margin-bottom:5px;">
                              A short 1-sentence description shown under the lesson title.
                            </div>
                            <input
                              id="cms-edit-lesson-summary"
                              data-testid="cms-edit-lesson-summary"
                              type="text"
                              class="input-box"
                              placeholder="Briefly describe what students will learn in this lesson."
                              style="width:100%; font-size:13px;"
                              value="${escapeHtml(activeLesson.summary || '')}"
                              oninput="markCmsEditorUnsavedChanges()"
                            />
                          </div>

                          <div>
                            <label for="cms-edit-lesson-text" style="font-size:12.5px; font-weight:800; color:var(--text); display:block; margin-bottom:2px;">
                              Explanation
                            </label>
                            <div style="font-size:11.5px; color:var(--text-secondary); margin-bottom:5px;">
                              Explain the concept in a way students can understand. Separate paragraphs with a blank line.
                            </div>
                            <textarea
                              id="cms-edit-lesson-text"
                              data-testid="cms-edit-lesson-text"
                              class="input-box"
                              placeholder="Explain the grammar rule, examples, or cultural notes in plain language..."
                              style="width:100%; min-height:155px; font-size:13px; line-height:1.55;"
                              oninput="markCmsEditorUnsavedChanges()"
                            >${escapeHtml(activeLesson.instructionalText || '')}</textarea>

                            ${
                              lessonParagraphs.length > 0
                                ? `<div data-testid="cms-lesson-paragraphs-list" style="margin-top:8px; padding:10px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-xs);">
                                    <div style="font-size:11.5px; font-weight:800; color:var(--text-secondary); margin-bottom:6px;">
                                      Individual Explanation Paragraphs (${lessonParagraphs.length}) — Remove any paragraph in 1 click:
                                    </div>
                                    <div style="display:flex; flex-direction:column; gap:6px;">
                                      ${lessonParagraphs
                                        .map(
                                          (para, pIdx) => `
                                          <div data-testid="cms-lesson-paragraph-item-${pIdx}" style="display:flex; justify-content:space-between; align-items:center; gap:8px; padding:6px 8px; background:var(--surface-1); border-radius:var(--radius-xs); font-size:12px;">
                                            <span style="color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:460px;">
                                              <b>#${pIdx + 1}:</b> ${escapeHtml(para.slice(0, 95))}${para.length > 95 ? '…' : ''}
                                            </span>
                                            <button
                                              type="button"
                                              class="btn btn-sec"
                                              data-testid="cms-btn-remove-paragraph-${pIdx}"
                                              style="min-height:24px; padding:2px 8px; font-size:11px; color:var(--danger); flex-shrink:0;"
                                              onclick="handleRemoveLessonParagraph(${pIdx})"
                                            >
                                              Remove Paragraph
                                            </button>
                                          </div>
                                        `
                                        )
                                        .join('')}
                                    </div>
                                  </div>`
                                : ''
                            }
                          </div>

                          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding:10px 12px; background:var(--surface-2); border-radius:var(--radius-sm);">
                            <span style="font-size:12px; color:var(--text-secondary);">
                              💡 <b>Save Draft:</b> Save your changes without showing them to students.
                            </span>
                            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                              <button
                                type="button"
                                class="btn"
                                data-testid="cms-btn-save-lesson"
                                onclick="handleSaveCmsLessonEdits()"
                              >
                                💾 Save Draft
                              </button>
                              <button
                                type="button"
                                class="btn btn-sec"
                                onclick="openCmsPreviewWithMode('draft')"
                              >
                                Preview as Student
                              </button>
                            </div>
                          </div>
                        </div>

                        <!-- Part 1B: Lesson Vocabulary & Photo Links Manager -->
                        <div data-testid="cms-lesson-links-manager" style="padding:12px; margin-bottom:18px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); display:flex; flex-direction:column; gap:12px;">
                          <div>
                            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:6px;">
                              <span style="font-size:12.5px; font-weight:800; color:var(--text);">
                                🔤 Linked Vocabulary Words in This Lesson (${lessonVocabRefs.length})
                              </span>
                              <span style="font-size:11px; color:var(--text-secondary);">
                                Removing a word link here keeps the word safely in the shared Vocabulary Bank.
                              </span>
                            </div>
                            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px;">
                              ${
                                lessonVocabRefs.length === 0
                                  ? `<span style="font-size:12px; color:var(--text-secondary);">No vocabulary words linked to this lesson.</span>`
                                  : lessonVocabRefs
                                      .slice(0, 24)
                                      .map(
                                        (vRef) => `
                                        <span data-testid="cms-lesson-vocab-chip-${vRef}" style="display:inline-flex; align-items:center; gap:6px; padding:4px 8px; background:var(--surface-1); border:1px solid var(--border-subtle); border-radius:var(--radius-xs); font-size:11.5px; font-weight:700;">
                                          <span>${escapeHtml(vRef)}</span>
                                          <button
                                            type="button"
                                            data-testid="cms-btn-remove-vocab-ref-${vRef}"
                                            aria-label="Remove vocabulary link ${escapeHtml(vRef)} from lesson"
                                            title="Remove word from this lesson only (keeps word in dictionary)"
                                            style="background:none; border:none; color:var(--danger); cursor:pointer; font-weight:900; padding:0 2px;"
                                            onclick="handleRemoveLessonVocabRef('${vRef}')"
                                          >
                                            ✕
                                          </button>
                                        </span>
                                      `
                                      )
                                      .join('')
                              }
                            </div>
                            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                              <input
                                id="cms-add-lesson-vocab-input"
                                data-testid="cms-add-lesson-vocab-input"
                                type="text"
                                class="input-box"
                                style="flex:1; min-width:160px; min-height:32px; font-size:12px;"
                                placeholder="Vocabulary ID (e.g., en_lex_0001)"
                              />
                              <button type="button" class="btn btn-sec" data-testid="cms-btn-add-vocab-ref" style="min-height:32px; padding:4px 10px; font-size:11.5px;" onclick="handleAddLessonVocabRefFromInput()">+ Link Word to Lesson</button>
                            </div>
                          </div>

                          <div style="padding-top:10px; border-top:1px solid var(--border-subtle);">
                            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:6px;">
                              <span style="font-size:12.5px; font-weight:800; color:var(--text);">
                                🖼️ Linked Lesson Photos (${lessonMediaRefs.length})
                              </span>
                              <span style="font-size:11px; color:var(--text-secondary);">
                                Removing a photo link here keeps the image file safely in the Media Library.
                              </span>
                            </div>
                            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px;">
                              ${
                                lessonMediaRefs.length === 0
                                  ? `<span style="font-size:12px; color:var(--text-secondary);">No photos linked to this lesson.</span>`
                                  : lessonMediaRefs
                                      .map(
                                        (mRef, mIdx) => `
                                        <span data-testid="cms-lesson-media-chip-${mIdx}" style="display:inline-flex; align-items:center; gap:6px; padding:4px 8px; background:var(--surface-1); border:1px solid var(--border-subtle); border-radius:var(--radius-xs); font-size:11.5px; font-weight:700;">
                                          <span>🖼️ ${escapeHtml(mRef.split('/').pop() || mRef)}</span>
                                          <button
                                            type="button"
                                            data-testid="cms-btn-remove-media-ref-${mIdx}"
                                            aria-label="Remove photo link ${escapeHtml(mRef)} from lesson"
                                            title="Remove photo from this lesson only (keeps file in Media Library)"
                                            style="background:none; border:none; color:var(--danger); cursor:pointer; font-weight:900; padding:0 2px;"
                                            onclick="handleRemoveLessonMediaRef('${mRef}')"
                                          >
                                            ✕
                                          </button>
                                        </span>
                                      `
                                      )
                                      .join('')
                              }
                            </div>
                            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                              <input
                                id="cms-add-lesson-media-input"
                                data-testid="cms-add-lesson-media-input"
                                type="text"
                                class="input-box"
                                style="flex:1; min-width:180px; min-height:32px; font-size:12px;"
                                placeholder="/identify-media/home-and-living-room/cozy-living-room.webp"
                              />
                              <button type="button" class="btn btn-sec" data-testid="cms-btn-add-media-ref" style="min-height:32px; padding:4px 10px; font-size:11.5px;" onclick="handleAddLessonMediaRefFromInput()">+ Link Photo to Lesson</button>
                            </div>
                          </div>
                        </div>

                        <!-- Part 2: Practice Questions & Lesson Activities -->
                        <div style="padding-top:16px; border-top:1px solid var(--border-subtle);">
                          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
                            <div>
                              <h4 style="margin:0; font-size:15px; font-weight:800;">
                                Practice Questions & Lesson Items (${activeLesson.activities?.length || 0})
                              </h4>
                              <div style="font-size:12px; color:var(--text-secondary);">
                                Select an item below to edit, duplicate, or remove its question, answer choices, or grammar examples.
                              </div>
                            </div>
                            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                              <button
                                type="button"
                                class="btn btn-sec"
                                data-testid="cms-btn-add-question"
                                style="min-height:30px; padding:4px 10px; font-size:11.5px;"
                                onclick="handleAddCmsActivityToLesson()"
                              >
                                + Add Practice Question
                              </button>
                              ${
                                activeActivity
                                  ? `
                                    <button
                                      type="button"
                                      class="btn btn-sec"
                                      data-testid="cms-btn-duplicate-activity-${activeActivity.activityId}"
                                      style="min-height:30px; padding:4px 10px; font-size:11.5px;"
                                      onclick="handleDuplicateActiveCmsActivity()"
                                    >
                                      Copy Question
                                    </button>
                                    <button
                                      type="button"
                                      class="btn btn-sec"
                                      data-testid="cms-btn-remove-activity-${activeActivity.activityId}"
                                      style="min-height:30px; padding:4px 10px; font-size:11.5px; color:var(--danger);"
                                      onclick="handleRequestRemoveActiveActivity()"
                                    >
                                      🗑️ Remove Question
                                    </button>
                                  `
                                  : ''
                              }
                            </div>
                          </div>

                          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px; max-height:115px; overflow-y:auto;">
                            ${(activeLesson.activities || [])
                              .map((act, idx) => {
                                const friendlyActLabel =
                                  act.activityType === 'knowledge_check_mc'
                                    ? `Question #${idx + 1}`
                                    : act.activityType ===
                                        'guided_practice_drill'
                                      ? `Practice #${idx + 1}`
                                      : act.activityType ===
                                          'module_mastery_exam'
                                        ? `Exam Q${idx + 1}`
                                        : act.title || `Item #${idx + 1}`;
                                return `
                                  <button
                                    type="button"
                                    data-testid="cms-activity-pill-${act.activityId}"
                                    class="stage-pill ${act.activityId === cmsUiState.selectedActivityId ? 'active' : ''}"
                                    style="min-height:30px; padding:4px 10px; font-size:11.5px;"
                                    onclick="selectCmsEditorActivity('${act.activityId}')"
                                  >
                                    ${escapeHtml(friendlyActLabel)}
                                  </button>
                                `;
                              })
                              .join('')}
                          </div>

                          ${
                            activeActivity
                              ? renderBeginnerFriendlyActivityEditor(
                                  activeActivity
                                )
                              : '<div style="font-size:12.5px; color:var(--text-secondary);">No questions or activities in this lesson yet. Click "+ Add Practice Question" above to add one.</div>'
                          }
                        </div>

                        ${
                          ukExt
                            ? `<div data-testid="cms-ukrainian-extension-inspector" style="margin-top:16px; padding:12px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-xs); font-size:12px;">
                                <div style="font-weight:800; margin-bottom:4px;">Included Ukrainian Course Content in Module ${escapeHtml(activeMod?.moduleId || '')}</div>
                                <div style="color:var(--text-secondary); line-height:1.5;">
                                  <b>Topic:</b> ${escapeHtml(ukExt.topicTag || activeMod?.title || '')}<br/>
                                  <b>Summary:</b> ${escapeHtml(ukExt.reviewSummary || '')}<br/>
                                  <b>Interactive Elements Preserved:</b> ${activeMod?.metadata?.vocabCount || 0} Vocabulary Words · ${activeMod?.metadata?.cfuCount || 0} Knowledge Checks · ${activeMod?.metadata?.practiceCount || 0} Practice Drills · ${activeMod?.metadata?.examCount || 0} Mastery Exam Questions
                                </div>
                              </div>`
                            : ''
                        }
                      `;
                    })()
                  : '<div style="font-size:13.5px; color:var(--text-secondary);">Select a lesson from the Course Outline on the left to start editing.</div>'
              }
            </div>

            <!-- RIGHT COLUMN: Contextual Help, Student Visibility & Optional Technical Details -->
            <div class="card ${cmsUiState.mobileEditorPanel !== 'help' ? 'cms-mobile-hidden-panel' : ''}" style="padding:14px; display:flex; flex-direction:column; gap:12px;">
              <div>
                <h3 style="margin:0 0 6px 0; font-size:14.5px; font-weight:800;">💡 Quick Guide & Lesson Info</h3>
                <div style="font-size:12px; color:var(--text-secondary); line-height:1.5;">
                  Answers to common questions while you edit:
                </div>
              </div>

              <div style="padding:10px 12px; background:var(--surface-2); border-radius:var(--radius-xs); font-size:12px; line-height:1.45;">
                <div style="font-weight:800; color:var(--text);">What course am I editing?</div>
                <div style="color:var(--text-secondary); margin-top:2px;">
                  <b>${escapeHtml(pkg.courseTitle)}</b> (${escapeHtml(getLanguagePlainName(pkg.nativeLanguage))} → ${escapeHtml(getLanguagePlainName(pkg.targetLanguage))})
                </div>
              </div>

              <div style="padding:10px 12px; background:var(--surface-2); border-radius:var(--radius-xs); font-size:12px; line-height:1.45;">
                <div style="font-weight:800; color:var(--text);">Will students see my changes right away?</div>
                <div style="color:var(--text-secondary); margin-top:2px;">
                  <b>No.</b> Pressing <b>Save Draft</b> or removing an item only updates your private draft. Students continue to see the current published course until you approve and publish in <b>Review & Publish</b>.
                </div>
              </div>

              <div style="padding:10px 12px; background:var(--surface-2); border-radius:var(--radius-xs); font-size:12px; line-height:1.45;">
                <div style="font-weight:800; color:var(--text);">How do I undo or restore something I removed?</div>
                <div style="color:var(--text-secondary); margin-top:2px;">
                  Click <b>↩ Undo</b> at the top of the editor, or open <b>🗑️ Removed Items (${removedItems.length})</b> to restore any individual item without losing your other edits.
                </div>
              </div>

              ${
                activeLesson
                  ? `<div style="padding:10px 12px; background:var(--surface-2); border-radius:var(--radius-xs); font-size:12px;">
                      <div style="font-weight:800; margin-bottom:6px;">Linked Lesson Resources</div>
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                        <span style="color:var(--text-secondary);">Vocabulary Words:</span>
                        <b>${(activeLesson.vocabularyRefs || []).length}</b>
                      </div>
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="color:var(--text-secondary);">Linked Photos:</span>
                        <b>${(activeLesson.mediaRefs || []).length}</b>
                      </div>
                      <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <button type="button" class="btn btn-sec" style="flex:1; min-height:28px; font-size:11px; padding:3px 8px;" onclick="switchCmsWorkspaceTab('vocabulary')">Open Vocabulary</button>
                        <button type="button" class="btn btn-sec" style="flex:1; min-height:28px; font-size:11px; padding:3px 8px;" onclick="switchCmsWorkspaceTab('media')">Open Media</button>
                      </div>
                    </div>`
                  : ''
              }

              <!-- Optional Technical Details (Hidden by default so beginners aren't overwhelmed) -->
              <details style="padding:10px 12px; background:var(--surface-2); border-radius:var(--radius-xs); font-size:11.5px;">
                <summary style="cursor:pointer; font-weight:800; color:var(--text-secondary);">
                  Show Technical Details
                </summary>
                <div style="margin-top:8px; color:var(--text-secondary); line-height:1.6;">
                  <div>Course ID: <code>${escapeHtml(cmsUiState.selectedTrackId)}</code></div>
                  <div>Content Format: <code>v${escapeHtml(pkg.schemaVersion)}</code></div>
                  <div>Module ID: <code>${escapeHtml(activeMod?.moduleId || 'none')}</code></div>
                  <div>Section ID: <code>${escapeHtml(activeSec?.sectionId || 'none')}</code></div>
                  <div>Lesson ID: <code>${escapeHtml(activeLesson?.lessonId || 'none')}</code></div>
                  <div>Activity ID: <code>${escapeHtml(activeActivity?.activityId || 'none')}</code></div>
                  <div style="margin-top:8px;">
                    <button
                      type="button"
                      class="btn btn-sec"
                      data-testid="cms-btn-inspect-json"
                      style="width:100%; min-height:28px; font-size:11px;"
                      onclick="openCmsAdvancedSubTab('json')"
                    >
                      View Course JSON in Advanced Tools
                    </button>
                  </div>
                </div>
              </details>
            </div>
          </div>
        `
      }
    </div>
  `;
}

function renderBeginnerFriendlyActivityEditor(activeActivity: {
  activityId: string;
  activityType: string;
  title?: string;
  prompt?: string;
  payload?: Record<string, unknown>;
}): string {
  const payload = (activeActivity.payload || {}) as {
    options?: string[];
    correctIndex?: number;
    explanation?: string;
    rules?: string[];
    examples?: Array<{ uk?: string; en?: string }>;
    lines?: Array<{ speaker?: string; uk?: string; en?: string }>;
    prompts?: Array<{ front?: string; back?: string }>;
    tables?: Array<{ title?: string; headers?: string[]; rows?: string[][] }>;
    vocabItems?: Array<{ uk: string; en: string }>;
    dialogueLines?: Array<{ speaker?: string; uk?: string; en?: string }>;
    patternTables?: Array<{ title?: string }>;
  };

  const isMultipleChoice =
    Array.isArray(payload.options) ||
    activeActivity.activityType === 'knowledge_check_mc' ||
    activeActivity.activityType === 'guided_practice_drill' ||
    activeActivity.activityType === 'module_mastery_exam';

  if (!isMultipleChoice) {
    const rulesList = Array.isArray(payload.rules) ? payload.rules : [];
    const examplesList = Array.isArray(payload.examples)
      ? payload.examples
      : Array.isArray(payload.lines)
        ? payload.lines
        : Array.isArray(payload.prompts)
          ? payload.prompts
          : [];
    const tablesList = Array.isArray(payload.tables) ? payload.tables : [];

    const itemSummary = Array.isArray(payload.vocabItems)
      ? `Displays ${payload.vocabItems.length} vocabulary words with Ukrainian audio and English translations.`
      : examplesList.length > 0 || rulesList.length > 0
        ? `Contains ${rulesList.length} grammar note(s) and ${examplesList.length} example sentence(s) / dialogue line(s).`
        : tablesList.length > 0
          ? `Displays ${tablesList.length} structured grammar reference table(s) and rows.`
          : 'Displays structured lesson reference content in the student course player.';

    return `
      <div style="padding:14px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); display:flex; flex-direction:column; gap:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
          <span style="font-size:12.5px; font-weight:800; color:var(--text);">
            Structured Lesson Item: ${escapeHtml(activeActivity.title || activeActivity.activityId)}
          </span>
          <span style="font-size:11.5px; color:var(--text-secondary);">Editable & Reversible</span>
        </div>
        <div style="font-size:12.5px; color:var(--text-secondary); line-height:1.45;">
          ${escapeHtml(itemSummary)} You can update its heading below or remove individual grammar notes, example sentences, tables, or table rows from your draft.
        </div>
        <div>
          <label for="cms-edit-activity-title" style="font-size:12px; font-weight:800; color:var(--text); display:block; margin-bottom:4px;">Item Heading</label>
          <input
            id="cms-edit-activity-title"
            type="text"
            class="input-box"
            style="width:100%; font-size:12.5px; font-weight:700;"
            value="${escapeHtml(activeActivity.title || '')}"
            oninput="markCmsEditorUnsavedChanges()"
          />
        </div>
        <div>
          <label for="cms-edit-activity-prompt" style="font-size:12px; font-weight:800; color:var(--text); display:block; margin-bottom:4px;">Description / Instructions</label>
          <input
            id="cms-edit-activity-prompt"
            data-testid="cms-edit-activity-prompt"
            type="text"
            class="input-box"
            style="width:100%; font-size:12.5px;"
            value="${escapeHtml(activeActivity.prompt || '')}"
            oninput="markCmsEditorUnsavedChanges()"
          />
        </div>

        ${
          rulesList.length > 0
            ? `<div data-testid="cms-structured-rules-list" style="padding:10px; background:var(--surface-1); border:1px solid var(--border-subtle); border-radius:var(--radius-xs);">
                <div style="font-size:12px; font-weight:800; margin-bottom:6px;">Grammar Notes & Headings (${rulesList.length})</div>
                <div style="display:flex; flex-direction:column; gap:6px;">
                  ${rulesList
                    .map(
                      (rText, rIdx) => `
                      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; padding:6px 8px; background:var(--surface-2); border-radius:var(--radius-xs); font-size:12px;">
                        <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:440px;">${escapeHtml(String(rText).replace(/<[^>]+>/g, '').slice(0, 85))}</span>
                        <button type="button" class="btn btn-sec" data-testid="cms-btn-remove-grammar-rule-${rIdx}" style="min-height:24px; padding:2px 8px; font-size:11px; color:var(--danger);" onclick="handleRemoveGrammarRule(${rIdx})">Remove Note</button>
                      </div>
                    `
                    )
                    .join('')}
                </div>
              </div>`
            : ''
        }

        ${
          examplesList.length > 0
            ? `<div data-testid="cms-structured-examples-list" style="padding:10px; background:var(--surface-1); border:1px solid var(--border-subtle); border-radius:var(--radius-xs);">
                <div style="font-size:12px; font-weight:800; margin-bottom:6px;">Example Sentences & Translations (${examplesList.length})</div>
                <div style="display:flex; flex-direction:column; gap:6px;">
                  ${examplesList
                    .map((exItem: any, exIdx: number) => {
                      const primary =
                        exItem.uk || exItem.front || exItem.text || '';
                      const secondary = exItem.en || exItem.back || '';
                      return `
                        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; padding:6px 8px; background:var(--surface-2); border-radius:var(--radius-xs); font-size:12px;">
                          <span><b>${escapeHtml(primary)}</b> ${secondary ? `— ${escapeHtml(secondary)}` : ''}</span>
                          <button type="button" class="btn btn-sec" data-testid="cms-btn-remove-example-${exIdx}" style="min-height:24px; padding:2px 8px; font-size:11px; color:var(--danger);" onclick="handleRemoveExampleSentence(${exIdx})">Remove Example</button>
                        </div>
                      `;
                    })
                    .join('')}
                </div>
              </div>`
            : ''
        }

        ${
          tablesList.length > 0
            ? `<div data-testid="cms-structured-tables-list" style="padding:10px; background:var(--surface-1); border:1px solid var(--border-subtle); border-radius:var(--radius-xs); display:flex; flex-direction:column; gap:10px;">
                <div style="font-size:12px; font-weight:800;">Grammar Tables (${tablesList.length})</div>
                ${tablesList
                  .map(
                    (tbl, tIdx) => `
                    <div data-testid="cms-editor-grammar-table-${tIdx}" style="padding:8px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-xs);">
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                        <span style="font-size:12px; font-weight:800;">📊 ${escapeHtml(tbl.title || `Table #${tIdx + 1}`)} (${(tbl.rows || []).length} rows)</span>
                        <button type="button" class="btn btn-sec" data-testid="cms-btn-remove-table-${tIdx}" style="min-height:24px; padding:2px 8px; font-size:11px; color:var(--danger);" onclick="handleRequestRemoveGrammarTable(${tIdx})">Remove Table</button>
                      </div>
                      <div style="display:flex; flex-direction:column; gap:4px;">
                        ${(tbl.rows || [])
                          .map(
                            (row, rIdx) => `
                            <div data-testid="cms-editor-table-row-${tIdx}-${rIdx}" style="display:flex; justify-content:space-between; align-items:center; gap:8px; padding:4px 6px; background:var(--surface-1); border-radius:var(--radius-xs); font-size:11.5px;">
                              <span>${escapeHtml((row || []).join(' | '))}</span>
                              <button type="button" class="btn btn-sec" data-testid="cms-btn-remove-table-row-${tIdx}-${rIdx}" style="min-height:22px; padding:1px 6px; font-size:10.5px; color:var(--danger);" onclick="handleRemoveGrammarTableRow(${tIdx}, ${rIdx})">Remove Row</button>
                            </div>
                          `
                          )
                          .join('')}
                      </div>
                    </div>
                  `
                  )
                  .join('')}
              </div>`
            : ''
        }

        <button
          type="button"
          class="btn"
          data-testid="cms-btn-save-activity"
          onclick="handleSaveCmsActivityEdits()"
        >
          💾 Save Item Heading to Draft
        </button>
      </div>
    `;
  }

  const options =
    Array.isArray(payload.options) && payload.options.length > 0
      ? payload.options
      : [];
  const correctIdx =
    typeof payload.correctIndex === 'number' ? payload.correctIndex : 0;
  const hasValidCorrectChoice =
    correctIdx >= 0 && correctIdx < options.length && options.length >= 2;

  return `
    <div style="padding:14px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); display:flex; flex-direction:column; gap:12px;">
      ${
        !hasValidCorrectChoice
          ? `<div data-testid="cms-missing-correct-answer-warning" style="padding:10px 12px; background:var(--danger-container); color:var(--danger-on-container); border-radius:var(--radius-xs); font-size:12.5px; font-weight:700;">
              ⚠️ ${
                options.length < 2
                  ? 'This multiple-choice question needs at least 2 answer choices before it can be published.'
                  : 'This question needs a correct answer before it can be published. Select the circle next to the correct choice below and click Save Question to Draft.'
              }
            </div>`
          : ''
      }

      <div>
        <label for="cms-edit-activity-title" style="font-size:12px; font-weight:800; color:var(--text); display:block; margin-bottom:3px;">
          Question Label
        </label>
        <input
          id="cms-edit-activity-title"
          type="text"
          class="input-box"
          placeholder="e.g., Check #1"
          style="width:100%; font-size:12.5px; font-weight:700;"
          value="${escapeHtml(activeActivity.title || '')}"
          oninput="markCmsEditorUnsavedChanges()"
        />
      </div>

      <div>
        <label for="cms-edit-activity-prompt" style="font-size:12px; font-weight:800; color:var(--text); display:block; margin-bottom:3px;">
          Question Prompt
        </label>
        <div style="font-size:11.5px; color:var(--text-secondary); margin-bottom:4px;">
          Enter the question students will answer.
        </div>
        <input
          id="cms-edit-activity-prompt"
          data-testid="cms-edit-activity-prompt"
          type="text"
          class="input-box"
          placeholder="Enter the question students will answer."
          style="width:100%; font-size:13px;"
          value="${escapeHtml(activeActivity.prompt || '')}"
          oninput="markCmsEditorUnsavedChanges()"
        />
      </div>

      <!-- Beginner-Friendly Answer Choices with Radio Button Selection & Per-Choice Removal -->
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:2px;">
          <span style="font-size:12px; font-weight:800; color:var(--text);">
            Answer Choices (Select the circle next to the Correct Answer)
          </span>
          <button
            type="button"
            class="btn btn-sec"
            data-testid="cms-btn-add-option"
            style="min-height:26px; padding:2px 8px; font-size:11px;"
            onclick="handleAddCmsAnswerOption()"
          >
            + Add Answer Choice
          </button>
        </div>
        <div style="font-size:11.5px; color:var(--text-secondary); margin-bottom:8px;">
          Students will see these choices and earn points when they pick the one marked "Correct".
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${options
            .map(
              (opt, oIdx) => `
              <div style="display:flex; align-items:center; gap:8px;">
                <label style="display:flex; align-items:center; gap:5px; font-size:11.5px; font-weight:800; color:${oIdx === correctIdx ? 'var(--success)' : 'var(--text-secondary)'}; cursor:pointer; min-width:82px;">
                  <input
                    type="radio"
                    name="cms-friendly-correct-choice"
                    value="${oIdx}"
                    ${oIdx === correctIdx ? 'checked' : ''}
                    onchange="syncFriendlyMcChoicesToUnderlyingInputs()"
                  />
                  ${oIdx === correctIdx ? 'Correct' : `Choice ${oIdx + 1}`}
                </label>
                <input
                  type="text"
                  class="input-box cms-friendly-option-input"
                  data-option-index="${oIdx}"
                  aria-label="Answer choice ${oIdx + 1}"
                  style="flex:1; min-height:36px; font-size:12.5px;"
                  value="${escapeHtml(opt)}"
                  oninput="syncFriendlyMcChoicesToUnderlyingInputs()"
                />
                <button
                  type="button"
                  class="btn btn-sec"
                  data-testid="cms-btn-remove-option-${oIdx}"
                  aria-label="Remove answer choice ${oIdx + 1}"
                  title="Remove this answer choice from draft"
                  style="min-height:32px; padding:4px 8px; font-size:11px; color:var(--danger);"
                  onclick="handleRequestRemoveAnswerOption(${oIdx})"
                >
                  Remove
                </button>
              </div>
            `
            )
            .join('')}
        </div>

        <!-- Synchronized underlying fields for power users and programmatic compatibility -->
        <details style="margin-top:8px; font-size:11px; color:var(--text-secondary);">
          <summary style="cursor:pointer;">Edit all choices as plain lines (Optional)</summary>
          <div style="margin-top:6px; display:flex; flex-direction:column; gap:6px;">
            <label for="cms-edit-activity-options" style="font-weight:700;">Options (One per line)</label>
            <textarea
              id="cms-edit-activity-options"
              class="input-box"
              style="width:100%; min-height:75px; font-size:12px;"
              oninput="markCmsEditorUnsavedChanges()"
            >${escapeHtml(options.join('\n'))}</textarea>
            <label for="cms-edit-activity-correct-idx" style="font-weight:700;">Correct Answer Choice Number (0 = first choice)</label>
            <input
              id="cms-edit-activity-correct-idx"
              type="number"
              class="input-box"
              style="width:100%; font-size:12px;"
              value="${correctIdx}"
              oninput="markCmsEditorUnsavedChanges()"
            />
          </div>
        </details>
      </div>

      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
          <label for="cms-edit-activity-explanation" style="font-size:12px; font-weight:800; color:var(--text);">
            Why is this answer correct? (Explanation shown to students)
          </label>
          ${
            payload.explanation
              ? `<button type="button" class="btn btn-sec" data-testid="cms-btn-remove-explanation" style="min-height:24px; padding:1px 8px; font-size:11px; color:var(--danger);" onclick="handleRemoveQuestionExplanation()">Remove Explanation</button>`
              : ''
          }
        </div>
        <textarea
          id="cms-edit-activity-explanation"
          class="input-box"
          placeholder="Explain why the correct answer is right so students learn from mistakes."
          style="width:100%; min-height:65px; font-size:12.5px;"
          oninput="markCmsEditorUnsavedChanges()"
        >${escapeHtml(payload.explanation || '')}</textarea>
      </div>

      <button
        type="button"
        class="btn"
        data-testid="cms-btn-save-activity"
        onclick="handleSaveCmsActivityEdits()"
      >
        💾 Save Question to Draft
      </button>
    </div>
  `;
}

// ============================================================================
// 8. TAB 4: VOCABULARY & TRANSLATIONS (`vocabulary`)
// ============================================================================

function renderCmsVocabularyTab(): string {
  const allLexemes = getAllCanonicalEnglishLexemes();
  const filteredLexemes = cmsUiState.vocabSearchQuery.trim()
    ? allLexemes.filter(
        (l) =>
          l.headwordEn
            .toLowerCase()
            .includes(cmsUiState.vocabSearchQuery.toLowerCase()) ||
          l.lexemeId
            .toLowerCase()
            .includes(cmsUiState.vocabSearchQuery.toLowerCase()) ||
          l.coreMeaningEn
            .toLowerCase()
            .includes(cmsUiState.vocabSearchQuery.toLowerCase())
      )
    : allLexemes;

  const activeLexeme =
    allLexemes.find((l) => l.lexemeId === cmsUiState.selectedLexemeId) ||
    allLexemes[0];
  const overlaysForLexeme = activeLexeme
    ? getAllNativeOverlaysForLexeme(activeLexeme.lexemeId)
    : [];
  const activeOverlay = overlaysForLexeme.find(
    (ov) => ov.nativeLanguage === cmsUiState.selectedOverlayLang
  );
  const vocabIssues = validateCmsVocabularyRegistry();
  const foreignLanguages = getForeignLanguages();
  const activeLangName = getLanguagePlainName(cmsUiState.selectedOverlayLang);

  return `
    <div data-testid="cms-vocabulary-view">
      <div class="card" style="padding:16px; margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <h2 style="margin:0; font-size:18px; font-weight:800;">🔤 Shared English Dictionary & Language Translations</h2>
            <div style="font-size:12.5px; color:var(--text-secondary); margin-top:3px;">
              Each English word is stored once in the shared dictionary, and each of the 14 student languages has its own separate translation card—so editing Spanish translations never changes Japanese or Hindi.
            </div>
          </div>
          <span class="tag" style="background:${vocabIssues.length === 0 ? 'var(--success-container)' : 'var(--warn-container)'}; color:${vocabIssues.length === 0 ? 'var(--success-on-container)' : 'var(--warn-on-container)'}; font-size:11.5px; font-weight:800;">
            Dictionary Check: ${vocabIssues.length === 0 ? 'All Words Complete' : `${vocabIssues.length} Item(s) to Review`}
          </span>
        </div>
      </div>

      <div class="cms-three-col-grid">
        <!-- Column 1: English Word List -->
        <div class="card" style="padding:14px;">
          <div style="font-size:13px; font-weight:800; margin-bottom:8px;">1. Pick an English Word (${filteredLexemes.length})</div>
          <input
            type="search"
            aria-label="Search English dictionary words"
            class="input-box"
            style="width:100%; min-height:34px; font-size:12.5px; margin-bottom:8px;"
            placeholder="Search English word..."
            value="${escapeHtml(cmsUiState.vocabSearchQuery)}"
            oninput="setCmsVocabSearch(this.value)"
          />
          <div style="max-height:420px; overflow-y:auto; display:flex; flex-direction:column; gap:6px;">
            ${filteredLexemes
              .map(
                (lex) => `
                <button
                  type="button"
                  data-testid="cms-lexeme-item-${lex.lexemeId}"
                  class="btn ${lex.lexemeId === activeLexeme?.lexemeId ? '' : 'btn-sec'}"
                  style="justify-content:space-between; text-align:left; min-height:36px; padding:6px 10px; font-size:12.5px;"
                  onclick="selectCmsVocabLexeme('${lex.lexemeId}')"
                >
                  <span><b>${escapeHtml(lex.headwordEn)}</b> <span style="opacity:0.75;">(${escapeHtml(lex.pos)})</span></span>
                </button>
              `
              )
              .join('')}
          </div>
        </div>

        <!-- Column 2: Shared English Definition -->
        <div class="card" style="padding:14px;">
          ${
            activeLexeme
              ? `
              <h3 style="margin:0 0 4px 0; font-size:15px; font-weight:800;">2. Shared English Definition</h3>
              <div style="font-size:12px; color:var(--text-secondary); margin-bottom:10px;">
                Used across all "Learn English" courses.
              </div>
              <div style="display:flex; flex-direction:column; gap:10px;">
                <div>
                  <label for="cms-lex-headword" style="font-size:11.5px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:3px;">English Word</label>
                  <input id="cms-lex-headword" type="text" class="input-box" style="width:100%; font-size:13.5px; font-weight:700;" value="${escapeHtml(activeLexeme.headwordEn)}" />
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                  <div>
                    <label for="cms-lex-pos" style="font-size:11.5px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:3px;">Part of Speech</label>
                    <input id="cms-lex-pos" type="text" class="input-box" style="width:100%; font-size:12.5px;" value="${escapeHtml(activeLexeme.pos)}" />
                  </div>
                  <div>
                    <label for="cms-lex-ipa" style="font-size:11.5px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:3px;">Pronunciation Guide (IPA)</label>
                    <input id="cms-lex-ipa" type="text" class="input-box" style="width:100%; font-size:12.5px;" value="${escapeHtml(activeLexeme.ipaUs)}" />
                  </div>
                </div>
                <div>
                  <label for="cms-lex-meaning" style="font-size:11.5px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:3px;">English Meaning</label>
                  <textarea id="cms-lex-meaning" class="input-box" style="width:100%; min-height:65px; font-size:12.5px;">${escapeHtml(activeLexeme.coreMeaningEn)}</textarea>
                </div>
                <button type="button" class="btn" onclick="handleSaveCanonicalLexeme('${activeLexeme.lexemeId}')">
                  💾 Save English Word
                </button>
              </div>
            `
              : ''
          }
        </div>

        <!-- Column 3: Language-Specific Translation -->
        <div class="card" style="padding:14px;">
          ${
            activeLexeme
              ? `
              <h3 style="margin:0 0 4px 0; font-size:15px; font-weight:800;">3. Translation for ${escapeHtml(activeLangName)} Speakers</h3>
              <div style="font-size:12px; color:var(--text-secondary); margin-bottom:10px;">
                Shown only to ${escapeHtml(activeLangName)} speakers learning English.
              </div>

              <div style="display:flex; gap:5px; flex-wrap:wrap; margin-bottom:12px;">
                ${foreignLanguages
                  .map(
                    (lang) => `
                    <button
                      type="button"
                      data-testid="cms-overlay-lang-${lang.code}"
                      class="stage-pill ${lang.code === cmsUiState.selectedOverlayLang ? 'active' : ''}"
                      style="min-height:28px; padding:3px 9px; font-size:11.5px;"
                      onclick="selectCmsOverlayLanguage('${lang.code}')"
                    >
                      ${escapeHtml(lang.nameEn)}
                    </button>
                  `
                  )
                  .join('')}
              </div>

              <div style="display:flex; flex-direction:column; gap:10px;">
                <div>
                  <label for="cms-overlay-translation" style="font-size:11.5px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:3px;">Translation in ${escapeHtml(activeLangName)}</label>
                  <input
                    id="cms-overlay-translation"
                    data-testid="cms-overlay-translation"
                    type="text"
                    class="input-box"
                    style="width:100%; font-size:13.5px; font-weight:700;"
                    value="${escapeHtml(activeOverlay?.translationNative || '')}"
                  />
                </div>
                <div>
                  <label for="cms-overlay-explanation" style="font-size:11.5px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:3px;">Helpful Note in ${escapeHtml(activeLangName)}</label>
                  <textarea
                    id="cms-overlay-explanation"
                    data-testid="cms-overlay-explanation"
                    class="input-box"
                    style="width:100%; min-height:65px; font-size:12.5px;"
                  >${escapeHtml(activeOverlay?.explanationNative || '')}</textarea>
                </div>
                <div>
                  <label for="cms-overlay-tip" style="font-size:11.5px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:3px;">Pronunciation Tip for ${escapeHtml(activeLangName)} Speakers</label>
                  <input
                    id="cms-overlay-tip"
                    type="text"
                    class="input-box"
                    style="width:100%; font-size:12.5px;"
                    value="${escapeHtml(activeOverlay?.pronunciationTipForNativeSpeaker || '')}"
                  />
                </div>
                <button
                  type="button"
                  class="btn"
                  data-testid="cms-btn-save-overlay"
                  onclick="handleSaveNativeOverlay('${activeLexeme.lexemeId}', '${cmsUiState.selectedOverlayLang}')"
                >
                  💾 Save ${escapeHtml(activeLangName)} Translation
                </button>
              </div>
            `
              : ''
          }
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// 9. TAB 5: MEDIA LIBRARY (`media` — 100 PHOTOGRAPHS)
// ============================================================================

function renderCmsMediaTab(): string {
  const fullCatalog = getCmsMediaLibraryCatalog();
  const q = cmsUiState.mediaSearchQuery.trim().toLowerCase();
  const catalog = q
    ? fullCatalog.filter(
        (m) =>
          m.assetId.toLowerCase().includes(q) ||
          m.sceneTitleEn.toLowerCase().includes(q) ||
          (m.sceneTitleUk || '').toLowerCase().includes(q) ||
          m.categoryTitle.toLowerCase().includes(q)
      )
    : fullCatalog;

  return `
    <div data-testid="cms-media-view">
      <div class="card" style="padding:16px; margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <h2 style="margin:0; font-size:18px; font-weight:800;">🖼️ Course Photo & Media Library (${catalog.length} of 100 Photos)</h2>
            <div style="font-size:12.5px; color:var(--text-secondary); margin-top:2px;">
              Browse all 100 Ukrainian Identify photographs across 20 everyday themes.
            </div>
          </div>
          <input
            type="search"
            data-testid="cms-media-search-input"
            aria-label="Search 100 photos by theme or title"
            class="input-box"
            style="width:260px; min-height:36px; font-size:12.5px;"
            placeholder="Search photos (e.g., Kitchen, City)..."
            value="${escapeHtml(cmsUiState.mediaSearchQuery)}"
            oninput="setCmsMediaSearch(this.value)"
          />
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(230px, 1fr)); gap:12px;">
        ${catalog
          .slice(0, 24)
          .map(
            (asset) => `
            <div class="card" data-testid="cms-media-card-${asset.assetId}" style="padding:12px;">
              <img
                src="${escapeHtml(asset.assetPath)}"
                alt="${escapeHtml(asset.sceneTitleEn)}"
                referrerpolicy="no-referrer"
                loading="lazy"
                style="width:100%; height:135px; object-fit:cover; border-radius:var(--radius-xs); background:var(--surface-2);"
              />
              <div style="font-size:13px; font-weight:800; margin-top:8px;">${escapeHtml(asset.sceneTitleEn)}</div>
              <div style="font-size:12px; color:var(--text-secondary);">${escapeHtml(asset.sceneTitleUk || '')} · ${escapeHtml(asset.categoryTitle)}</div>
            </div>
          `
          )
          .join('')}
      </div>
    </div>
  `;
}

// ============================================================================
// 10. TAB 6: REVIEW & PUBLISH (`validation` — FRIENDLY PROBLEM CHECKER)
// ============================================================================

function renderCmsValidationTab(): string {
  const report: CmsValidationReport = validateCmsCourseDraft(
    cmsUiState.selectedTrackId
  );
  const notes = getCmsManualReviewNotes(cmsUiState.selectedTrackId);
  const draft = getOrCreateCmsCourseDraft(cmsUiState.selectedTrackId);
  const friendlyIssues = report.issues.map((iss) =>
    formatFriendlyValidationIssue(iss, cmsUiState.selectedTrackId)
  );
  const pubDiff = computeCmsDraftVsPublishedDiff(cmsUiState.selectedTrackId);

  return `
    <div data-testid="cms-validation-view">
      <!-- Top Readiness Summary Card -->
      <div class="card" style="padding:18px; margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
          <div>
            <div style="font-size:11.5px; font-weight:800; color:var(--accent);">Step 6: Check for Problems & Publish When Ready</div>
            <h2 style="margin:2px 0 4px 0; font-size:18px; font-weight:800;">
              Review & Publish: ${escapeHtml(draft.draftPackage.courseTitle)}
            </h2>
            <div style="font-size:13px; color:var(--text-secondary);">
              Ready to Publish: <b style="color:${report.canPublish ? 'var(--success)' : 'var(--danger)'};">${report.canPublish ? 'Yes — No blocking problems found' : `Not yet — We found ${report.errorCount} item(s) under "Must Fix"`}</b>
            </div>
          </div>

          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" class="btn btn-sec" onclick="openCmsPreviewWithMode('draft')">
              Preview as Student
            </button>
            <button type="button" class="btn btn-sec" data-testid="cms-btn-run-bulk-audit" onclick="handleRunCmsBulkAudit()">
              Check All 28 Courses
            </button>
            ${
              cmsUiState.pendingPublishConfirmation
                ? `
                  <button type="button" class="btn btn-success" data-testid="cms-btn-confirm-publish-now" onclick="handleCmsLifecycleTransition('PUBLISHED')">
                    ✅ Confirm & Publish Now
                  </button>
                  <button type="button" class="btn btn-sec" onclick="togglePendingPublishConfirmation(false)">
                    Cancel
                  </button>
                `
                : `
                  <button
                    type="button"
                    class="btn btn-success"
                    data-testid="cms-validation-btn-publish"
                    onclick="handleCmsLifecycleTransition('PUBLISHED')"
                  >
                    🚀 Publish Approved Changes
                  </button>
                `
            }
          </div>
        </div>

        <!-- Plain-English Category Counts: Must Fix / Recommended / Information -->
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:14px;">
          <span class="tag" style="background:var(--danger-container); color:var(--danger-on-container); font-weight:800;">
            Must Fix (${report.errorCount})
          </span>
          <span class="tag" style="background:var(--warn-container); color:var(--warn-on-container); font-weight:800;">
            Recommended (${report.warningCount})
          </span>
          <span class="tag" style="background:var(--accent-container); color:var(--accent-on-container); font-weight:800;">
            Information (${report.infoCount})
          </span>
        </div>

        ${
          pubDiff && pubDiff.totalDifferences > 0
            ? `<div style="margin-top:12px; padding:10px 14px; background:var(--surface-2); border-radius:var(--radius-xs); font-size:12.5px;">
                <b>Unpublished Changes Waiting in Your Draft:</b> ${pubDiff.totalDifferences} change(s) (${pubDiff.modifiedLessonIds.length} modified lesson(s), ${pubDiff.addedModuleIds.length} new module(s)).
              </div>`
            : ''
        }

        <!-- Friendly Problem Cards -->
        <div style="margin-top:14px; display:flex; flex-direction:column; gap:10px;">
          ${
            friendlyIssues.length === 0
              ? `<div style="padding:14px; background:var(--surface-2); border-radius:var(--radius-sm); font-size:13px; color:var(--success); font-weight:700;">
                  ✅ Everything looks great! We didn't find any missing answers, duplicate IDs, or broken links in this course.
                </div>`
              : friendlyIssues
                  .map((f, idx) => {
                    const badgeBg =
                      f.categoryLabel === 'Must Fix'
                        ? 'var(--danger-container)'
                        : f.categoryLabel === 'Recommended'
                          ? 'var(--warn-container)'
                          : 'var(--accent-container)';
                    const badgeFg =
                      f.categoryLabel === 'Must Fix'
                        ? 'var(--danger-on-container)'
                        : f.categoryLabel === 'Recommended'
                          ? 'var(--warn-on-container)'
                          : 'var(--accent-on-container)';
                    return `
                      <div data-testid="cms-validation-issue-card-${idx}" style="padding:14px; background:var(--surface-2); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); font-size:12.5px;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px;">
                          <div>
                            <span class="tag" style="background:${badgeBg}; color:${badgeFg}; font-weight:800; font-size:11px;">
                              ${escapeHtml(f.categoryLabel)}
                            </span>
                            <span style="font-size:14px; font-weight:800; color:var(--text); margin-left:4px;">
                              ${escapeHtml(f.whatIsWrong)}
                            </span>
                          </div>
                          ${
                            f.canJumpToEditor
                              ? `<button
                                  type="button"
                                  class="btn btn-sec"
                                  data-testid="cms-btn-go-to-problem-${idx}"
                                  style="min-height:30px; padding:4px 10px; font-size:11.5px;"
                                  onclick="jumpToCmsValidationProblem('${f.targetModuleId || ''}', '${f.targetLessonId || ''}', '${f.targetActivityId || ''}')"
                                >
                                  Go to Problem →
                                </button>`
                              : ''
                          }
                        </div>

                        <div style="margin-top:8px; color:var(--text-secondary); line-height:1.5;">
                          <div><b>Where:</b> ${escapeHtml(f.whereItIs)}</div>
                          <div><b>Why it matters:</b> ${escapeHtml(f.whyItMatters)}</div>
                          <div><b>How to fix it:</b> ${escapeHtml(f.howToFixIt)}</div>
                        </div>

                        <details style="margin-top:8px; font-size:11px; color:var(--text-secondary);">
                          <summary style="cursor:pointer;">Show Technical Details</summary>
                          <div style="margin-top:4px; font-family:monospace;">
                            Code: ${escapeHtml(f.technicalCode)} · Path: ${escapeHtml(f.technicalPath)} · Detail: ${escapeHtml(f.rawMessage)}
                          </div>
                        </details>
                      </div>
                    `;
                  })
                  .join('')
          }
        </div>
      </div>

      <!-- Reviewer Notes -->
      <div class="card" style="padding:16px; margin-bottom:14px;">
        <h3 style="margin:0 0 6px 0; font-size:15px; font-weight:800;">📝 Review Notes & Checklist Comments (${notes.length})</h3>
        <div style="font-size:12px; color:var(--text-secondary); margin-bottom:10px;">
          Leave a note for yourself or a teacher/reviewer about what was updated in this draft.
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
          <input id="cms-review-note-input" aria-label="Review note text" type="text" class="input-box" style="flex:1; min-width:240px; font-size:12.5px;" placeholder="Write a short review note (e.g., Checked all Module 1 questions)..." />
          <select id="cms-review-status-select" aria-label="Review note status" class="input-box" style="width:190px; font-size:12.5px;">
            <option value="approved_by_reviewer">Ready to Publish</option>
            <option value="needs_revision">Needs More Work</option>
            <option value="pending_review">Waiting for Review</option>
          </select>
          <button type="button" class="btn btn-sec" onclick="handleAddCmsReviewerNote()">+ Add Note</button>
        </div>
        ${
          notes.length === 0
            ? '<div style="font-size:12px; color:var(--text-secondary);">No review notes added yet.</div>'
            : notes
                .map(
                  (n) => `
                  <div style="padding:8px 10px; background:var(--surface-2); border-radius:var(--radius-xs); margin-bottom:6px; font-size:12.5px;">
                    <b>[${escapeHtml(n.reviewerStatus)}]</b> ${escapeHtml(n.noteText)} — <span style="color:var(--text-secondary);">(${new Date(n.createdAt).toLocaleTimeString()})</span>
                  </div>
                `
                )
                .join('')
        }
      </div>

      ${
        cmsUiState.lastBulkAuditSummary
          ? `
          <div class="card" data-testid="cms-bulk-audit-results" style="padding:16px;">
            <h3 style="margin:0; font-size:15px; font-weight:800;">
              📊 All 28 Courses Checked: ${cmsUiState.lastBulkAuditSummary.auditedTrackCount} Courses · ${cmsUiState.lastBulkAuditSummary.totalErrors} Must-Fix Issues · ${cmsUiState.lastBulkAuditSummary.totalWarnings} Recommendations
            </h3>
          </div>
        `
          : ''
      }
    </div>
  `;
}

// ============================================================================
// 11. TAB 7: PREVIEW AS STUDENT (`preview` — UNIVERSAL COURSE PLAYER)
// ============================================================================

function renderCmsPreviewTab(): string {
  const preview = renderIsolatedCmsDraftPreview(
    cmsUiState.selectedTrackId,
    cmsUiState.previewMode
  );
  const baselinePkg = getPublishedBaselineCoursePackage(
    cmsUiState.selectedTrackId
  );
  const hasPublishedBaseline = Boolean(
    baselinePkg && baselinePkg.modules.length > 0
  );

  return `
    <div data-testid="cms-preview-view">
      <div class="card" style="padding:16px; margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <div style="font-size:11.5px; font-weight:800; color:var(--accent);">Step 5: Preview Your Changes as a Student</div>
            <h2 style="margin:2px 0 4px 0; font-size:18px; font-weight:800;">👁️ Preview as Student</h2>
            <div style="font-size:12.5px; color:var(--text-secondary);">
              See exactly how your lesson will look to students. Trying questions here is 100% safe and never changes real student flashcards or XP.
            </div>
          </div>
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <button
              type="button"
              data-testid="cms-btn-preview-draft"
              class="stage-pill ${cmsUiState.previewMode === 'draft' ? 'active' : ''}"
              style="min-height:34px; padding:5px 12px; font-size:12px; font-weight:800;"
              onclick="setCmsPreviewMode('draft')"
            >
              ✏️ Preview My Changes (${preview.moduleCount} Modules)
            </button>
            <button
              type="button"
              data-testid="cms-btn-preview-published"
              class="stage-pill ${cmsUiState.previewMode === 'published' ? 'active' : ''}"
              style="min-height:34px; padding:5px 12px; font-size:12px; font-weight:800;"
              onclick="setCmsPreviewMode('published')"
            >
              🏛️ See Published Course (${hasPublishedBaseline ? `${baselinePkg?.modules.length} Modules` : 'Published Only'})
            </button>
            <button
              type="button"
              class="btn btn-sec"
              style="min-height:34px; padding:5px 12px; font-size:12px;"
              onclick="switchCmsWorkspaceTab('editor')"
            >
              ← Back to Editing
            </button>
          </div>
        </div>
      </div>

      <div id="cms-isolated-player-preview-container" data-testid="cms-isolated-player-preview-container">
        ${preview.html}
      </div>
    </div>
  `;
}

// ============================================================================
// 12. TAB 8: ADVANCED TOOLS (`advanced` — IMPORT, VERSIONS, JSON, EXPORT)
// ============================================================================

function renderCmsAdvancedTab(activeSub: CmsAdvancedSubTab): string {
  const subTabs: Array<{ id: CmsAdvancedSubTab; label: string }> = [
    { id: 'importer', label: '📥 Import Course Content' },
    { id: 'versions', label: '🕒 Version History (Previous Versions)' },
    { id: 'json', label: '{ } View Course JSON' },
    { id: 'export', label: '📤 Export Course File' },
    { id: 'security', label: '🔒 Security & Technical Info' },
  ];

  let subBody = '';
  switch (activeSub) {
    case 'importer':
      subBody = renderCmsImporterTab();
      break;
    case 'versions':
      subBody = renderCmsVersionsTab();
      break;
    case 'json':
      subBody = renderCmsRawJsonInspectorTab();
      break;
    case 'export':
      subBody = renderCmsExportTab();
      break;
    case 'security':
      subBody = renderCmsSecurityAndTechInfoTab();
      break;
  }

  return `
    <div data-testid="cms-advanced-tools-view">
      <div class="card" style="padding:14px 16px; margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <h2 style="margin:0; font-size:17px; font-weight:800;">⚙️ Advanced Tools</h2>
            <div style="font-size:12.5px; color:var(--text-secondary);">
              Import course files, restore previous backup versions, inspect raw JSON, or download a course backup file.
            </div>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            ${subTabs
              .map(
                (st) => `
                <button
                  type="button"
                  data-testid="cms-adv-subtab-${st.id}"
                  class="stage-pill ${activeSub === st.id ? 'active' : ''}"
                  style="min-height:32px; padding:4px 11px; font-size:12px;"
                  onclick="openCmsAdvancedSubTab('${st.id}')"
                >
                  ${escapeHtml(st.label)}
                </button>
              `
              )
              .join('')}
          </div>
        </div>
      </div>

      ${subBody}
    </div>
  `;
}

function renderCmsImporterTab(): string {
  return `
    <div data-testid="cms-importer-view">
      <div class="card" style="padding:18px; margin-bottom:14px;">
        <h3 style="margin:0 0 4px 0; font-size:17px; font-weight:800;">📥 Import Course Content</h3>
        <p style="margin:0 0 14px 0; font-size:13px; color:var(--text-secondary); line-height:1.5;">
          Upload a course file to add modules, lessons, and activities into your private draft. Importing never overwrites a published course automatically.
        </p>

        <!-- 5-Step Plain-Language Import Guide -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(170px, 1fr)); gap:8px; margin-bottom:16px; padding:12px; background:var(--surface-2); border-radius:var(--radius-sm); font-size:12px;">
          <div><b>1. Select File</b><br/><span style="color:var(--text-secondary);">Pick a .json course file or load a sample below.</span></div>
          <div><b>2. Check Contents</b><br/><span style="color:var(--text-secondary);">Verify how many modules and lessons are inside.</span></div>
          <div><b>3. Choose Destination</b><br/><span style="color:var(--text-secondary);">Selected: ${escapeHtml(formatFriendlyCourseDisplayName(cmsUiState.selectedTrackId))}</span></div>
          <div><b>4. Review Changes</b><br/><span style="color:var(--text-secondary);">Choose whether to add modules or replace draft.</span></div>
          <div><b>5. Confirm Import</b><br/><span style="color:var(--text-secondary);">Saves into your private draft with a backup.</span></div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:12px;">
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <label for="cms-import-mode-select" style="font-size:12.5px; font-weight:800;">How should we add this content?</label>
            <select
              id="cms-import-mode-select"
              data-testid="cms-import-mode-select"
              class="input-box"
              style="width:310px; min-height:36px; font-size:12.5px; font-weight:700;"
              onchange="setCmsImportMode(this.value)"
            >
              <option value="full_draft_import" ${cmsUiState.importMode === 'full_draft_import' ? 'selected' : ''}>Replace current draft with this file</option>
              <option value="incremental_module_merge" ${cmsUiState.importMode === 'incremental_module_merge' ? 'selected' : ''}>Add new modules (keep existing modules)</option>
            </select>
          </div>

          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <label class="btn btn-sec" style="min-height:34px; padding:5px 12px; font-size:12px; cursor:pointer;">
              📂 Choose .json File from Device
              <input type="file" accept=".json,application/json" style="display:none;" onchange="handleCmsImportFileSelected(this)" />
            </label>
            <button type="button" class="btn btn-sec" data-testid="cms-btn-load-fixture-es" style="min-height:34px; padding:5px 10px; font-size:11.5px;" onclick="loadCmsSampleFixture('es-to-en')">Load Sample: Spanish → English</button>
            <button type="button" class="btn btn-sec" data-testid="cms-btn-load-fixture-hi" style="min-height:34px; padding:5px 10px; font-size:11.5px;" onclick="loadCmsSampleFixture('en-to-hi')">Load Sample: English → Hindi</button>
            <button type="button" class="btn btn-sec" data-testid="cms-btn-load-fixture-inc" style="min-height:34px; padding:5px 10px; font-size:11.5px;" onclick="loadCmsSampleFixture('es-incremental-mod3')">Load Sample: Add Module 3</button>
          </div>
        </div>

        <label for="cms-importer-json-textarea" style="font-size:12px; font-weight:800; color:var(--text-secondary); display:block; margin-bottom:4px;">
          Course File Contents (Paste or upload a course file below):
        </label>
        <textarea
          id="cms-importer-json-textarea"
          data-testid="cms-importer-json-textarea"
          class="input-box"
          style="width:100%; min-height:200px; font-family:monospace; font-size:12px; margin-bottom:12px;"
          placeholder="Select a file above, click one of the sample buttons, or paste course data here..."
        >${escapeHtml(cmsUiState.importJsonText)}</textarea>

        ${cmsUiState.importCheckSummaryHtml ? `<div style="margin-bottom:12px;">${cmsUiState.importCheckSummaryHtml}</div>` : ''}

        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button type="button" class="btn btn-sec" data-testid="cms-btn-check-import-contents" onclick="handleCheckCmsImportContents()">
            🔍 Step 2: Check File Contents
          </button>
          <button type="button" class="btn" data-testid="cms-btn-execute-import" onclick="handleExecuteCmsDraftImport()">
            📥 Step 5: Confirm Import into Draft (${escapeHtml(formatFriendlyCourseDisplayName(cmsUiState.selectedTrackId))})
          </button>
        </div>

        ${cmsUiState.lastImportBannerHtml ? `<div style="margin-top:12px;">${cmsUiState.lastImportBannerHtml}</div>` : ''}
      </div>
    </div>
  `;
}

function renderCmsVersionsTab(): string {
  const history = getCmsVersionHistory(cmsUiState.selectedTrackId);
  const track = getCourseTrackById(cmsUiState.selectedTrackId);
  const leftId =
    cmsUiState.diffLeftVersionId ||
    history[1]?.versionId ||
    history[0]?.versionId ||
    '';
  const rightId = cmsUiState.diffRightVersionId || history[0]?.versionId || '';
  const diff =
    leftId &&
    rightId &&
    history.some((h) => h.versionId === leftId) &&
    history.some((h) => h.versionId === rightId)
      ? compareCmsVersionSnapshots(cmsUiState.selectedTrackId, leftId, rightId)
      : null;

  return `
    <div data-testid="cms-versions-view">
      <div class="card" style="padding:18px; margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <div>
            <h3 style="margin:0; font-size:17px; font-weight:800;">🕒 Version History (${history.length} Saved Versions)</h3>
            <div style="font-size:12.5px; color:var(--text-secondary);">
              See earlier versions of <b>${escapeHtml(track?.courseTitle || cmsUiState.selectedTrackId)}</b> and recover previous changes.
            </div>
          </div>
          <button type="button" class="btn btn-sec" onclick="handleCreateManualSnapshot()">📸 Save a Backup Version Now</button>
        </div>

        ${
          history.length === 0
            ? '<div style="font-size:12.5px; color:var(--text-secondary);">No saved versions yet for this course. Click "Save a Backup Version Now" above or save an edit in the editor.</div>'
            : `<div style="display:flex; flex-direction:column; gap:8px;">
                ${history
                  .map(
                    (snap, idx) => `
                    <div data-testid="cms-version-row-${idx}" style="padding:12px; background:var(--surface-2); border-radius:var(--radius-xs); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; font-size:12.5px;">
                      <div>
                        <div style="font-weight:800; color:var(--text);">
                          ${escapeHtml(snap.changeSummary)}
                        </div>
                        <div style="color:var(--text-secondary); font-size:11.5px; margin-top:2px;">
                          Course: <b>${escapeHtml(track?.courseTitle || snap.courseTrackId)}</b> · Status: <b>${escapeHtml(snap.publicationState)}</b> · ${snap.packageSnapshot.modules.length} Module(s) · Saved ${new Date(snap.createdAt).toLocaleString()}
                        </div>
                        <details style="margin-top:3px; font-size:10.5px; color:var(--text-secondary);">
                          <summary style="cursor:pointer;">Show Technical Version ID</summary>
                          <code>${escapeHtml(snap.versionId)}</code> (${escapeHtml(snap.revisionOrigin)})
                        </details>
                      </div>
                      <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
                        <button
                          type="button"
                          class="btn btn-sec"
                          style="min-height:30px; padding:4px 10px; font-size:11.5px;"
                          onclick="switchCmsWorkspaceTab('preview', '${snap.courseTrackId}')"
                        >
                          Preview Course
                        </button>
                        <button
                          type="button"
                          class="btn btn-sec"
                          data-testid="cms-btn-restore-version-${idx}"
                          style="min-height:30px; padding:4px 10px; font-size:11.5px;"
                          onclick="handleRestoreCmsSnapshot('${snap.versionId}')"
                        >
                          ⏪ Restore Version
                        </button>
                      </div>
                    </div>
                  `
                  )
                  .join('')}
              </div>`
        }
      </div>

      ${
        history.length >= 1
          ? `
          <div class="card" style="padding:16px;">
            <h4 style="margin:0 0 10px 0; font-size:15px; font-weight:800;">🔍 Compare Changes Between Two Versions</h4>
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:12px;">
              <select aria-label="Compare from version" class="input-box" style="flex:1; min-width:220px; font-size:12.5px;" onchange="setCmsDiffSelection('left', this.value)">
                ${history
                  .map(
                    (h) =>
                      `<option value="${h.versionId}" ${h.versionId === leftId ? 'selected' : ''}>Older Version: ${escapeHtml(h.changeSummary)} (${escapeHtml(h.versionId)})</option>`
                  )
                  .join('')}
              </select>
              <select aria-label="Compare to version" class="input-box" style="flex:1; min-width:220px; font-size:12.5px;" onchange="setCmsDiffSelection('right', this.value)">
                ${history
                  .map(
                    (h) =>
                      `<option value="${h.versionId}" ${h.versionId === rightId ? 'selected' : ''}>Newer Version: ${escapeHtml(h.changeSummary)} (${escapeHtml(h.versionId)})</option>`
                  )
                  .join('')}
              </select>
            </div>
            ${
              diff
                ? `<div data-testid="cms-diff-summary-box" style="padding:12px; background:var(--surface-2); border-radius:var(--radius-xs); font-size:12.5px;">
                    <div><b>Total Differences Found:</b> ${diff.totalDifferences}</div>
                    <div style="margin-top:4px;"><b>Modules Added:</b> ${diff.addedModuleIds.join(', ') || 'None'} · <b>Modules Removed:</b> ${diff.removedModuleIds.join(', ') || 'None'}</div>
                    <div style="margin-top:4px;"><b>Lessons Changed:</b> ${diff.modifiedLessonIds.join(', ') || 'None'}</div>
                    <div style="margin-top:4px;"><b>Answer Keys Changed:</b> ${diff.changedActivityAnswerKeys.map((k) => k.activityId).join(', ') || 'None'}</div>
                  </div>`
                : ''
            }
          </div>
        `
          : ''
      }
    </div>
  `;
}

function renderCmsRawJsonInspectorTab(): string {
  const draft = getOrCreateCmsCourseDraft(cmsUiState.selectedTrackId);
  const pkg = draft.draftPackage;

  return `
    <div data-testid="cms-raw-json-inspector-view">
      <div class="card" style="padding:18px;">
        <h3 style="margin:0 0 6px 0; font-size:17px; font-weight:800;">{ } Technical Course Data (View Course JSON)</h3>
        <p style="margin:0 0 12px 0; font-size:12.5px; color:var(--text-secondary); line-height:1.5;">
          This read-only view displays the underlying <code>UniversalCoursePackageV1</code> data structure for <b>${escapeHtml(pkg.courseTitle)}</b> (${pkg.modules.length} modules). You never need to edit this raw JSON to use Content Studio.
        </p>
        <textarea
          data-testid="cms-editor-source-json-textarea"
          readonly
          class="input-box"
          style="width:100%; min-height:360px; font-family:monospace; font-size:12px;"
        >${escapeHtml(JSON.stringify(pkg, null, 2))}</textarea>
      </div>
    </div>
  `;
}

function renderCmsExportTab(): string {
  const exported = exportCmsCourseDraftToJson(cmsUiState.selectedTrackId);
  return `
    <div data-testid="cms-export-view">
      <div class="card" style="padding:18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <div>
            <h3 style="margin:0; font-size:17px; font-weight:800;">📤 Export Course File (${escapeHtml(formatFriendlyCourseDisplayName(cmsUiState.selectedTrackId))})</h3>
            <div style="font-size:12.5px; color:var(--text-secondary);">
              Download a clean backup file of this course or verify that it can be re-imported cleanly.
            </div>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" class="btn" data-testid="cms-btn-verify-roundtrip" onclick="handleVerifyCmsExportRoundTrip()">
              ✅ Check Export File
            </button>
            <button type="button" class="btn btn-sec" onclick="handleDownloadCmsExportJson()">
              ⬇️ Download Course File (.json)
            </button>
          </div>
        </div>

        ${
          cmsUiState.exportStatusMessage
            ? `<div data-testid="cms-export-roundtrip-banner" style="margin-bottom:12px; padding:10px 12px; background:var(--success-container); color:var(--success-on-container); border-radius:var(--radius-xs); font-size:12.5px; font-weight:700;">
                ${escapeHtml(cmsUiState.exportStatusMessage)}
              </div>`
            : ''
        }

        <textarea
          id="cms-export-json-textarea"
          data-testid="cms-export-json-textarea"
          readonly
          class="input-box"
          style="width:100%; min-height:300px; font-family:monospace; font-size:12px;"
        >${escapeHtml(exported.jsonString)}</textarea>
      </div>
    </div>
  `;
}

function renderCmsSecurityAndTechInfoTab(): string {
  const access = evaluateCmsAccessContext();
  const m = getCmsDashboardMetrics();

  return `
    <div class="card" style="padding:18px;">
      <h3 style="margin:0 0 8px 0; font-size:17px; font-weight:800;">🔒 Security & Storage Information</h3>
      <div style="font-size:13px; color:var(--text-secondary); line-height:1.6;">
        <p style="margin:0 0 10px 0;">
          <b>Public Application Safety:</b> On the public learner site (<code>slovo-ua-app.ai.studio</code>), Content Studio editing, importing, and publishing are restricted so anonymous visitors cannot alter your courses.
        </p>
        <p style="margin:0 0 10px 0;">
          <b>Current Environment Role:</b> <code>${escapeHtml(access.activeRole)}</code> (${escapeHtml(access.persistenceMode)})
        </p>
        <p style="margin:0;">
          <b>Storage Adapter:</b> <code>${escapeHtml(m.storageAdapterName)}</code> — Draft edits are stored in an isolated overlay and never overwrite <code>src/courseData.ts</code>.
        </p>
      </div>
    </div>
  `;
}

// ============================================================================
// 13. TAB 9: CENTRAL HELP & GUIDED TOUR (`help`)
// ============================================================================

function renderCmsHelpTab(): string {
  const topics = getCmsCentralHelpTopics();

  return `
    <div data-testid="cms-help-view">
      <div class="card" style="padding:18px; margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h2 style="margin:0 0 4px 0; font-size:18px; font-weight:800;">❓ Content Studio Help Center</h2>
            <div style="font-size:13px; color:var(--text-secondary);">
              Short, step-by-step instructions for every task in Content Studio.
            </div>
          </div>
          <button type="button" class="btn" onclick="startCmsGuidedTour()">
            ▶ Start 7-Step Interactive Tour
          </button>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:14px;">
        ${topics
          .map(
            (t) => `
            <div class="card" data-testid="cms-help-topic-${t.id}" style="padding:16px;">
              <h3 style="margin:0 0 4px 0; font-size:15.5px; font-weight:800; color:var(--text);">
                ${escapeHtml(t.title)}
              </h3>
              <div style="font-size:12.5px; color:var(--text-secondary); margin-bottom:10px;">
                ${escapeHtml(t.summary)}
              </div>
              <ol style="margin:0; padding-left:18px; font-size:12.5px; color:var(--text); line-height:1.6;">
                ${t.steps.map((s) => `<li style="margin-bottom:4px;">${escapeHtml(s)}</li>`).join('')}
              </ol>
            </div>
          `
          )
          .join('')}
      </div>
    </div>
  `;
}

// ============================================================================
// 14. INTERACTIVE HANDLERS EXPOSED TO WINDOW
// ============================================================================

export function dismissCmsBanner(): void {
  cmsUiState.bannerNotification = null;
  renderLangoContentStudio();
}

export function startCmsGuidedTour(): void {
  cmsUiState.tourActive = true;
  cmsUiState.tourDismissed = false;
  cmsUiState.tourStepIndex = 0;
  renderLangoContentStudio();
}

export function stepCmsGuidedTour(delta: number): void {
  const steps = getCmsGuidedTourSteps();
  const nextIdx = Math.max(
    0,
    Math.min(steps.length - 1, cmsUiState.tourStepIndex + delta)
  );
  cmsUiState.tourStepIndex = nextIdx;
  const targetTab = steps[nextIdx].targetTab;
  if (targetTab) {
    cmsUiState.activeTab = targetTab;
  }
  renderLangoContentStudio();
}

export function closeCmsGuidedTour(): void {
  cmsUiState.tourActive = false;
  cmsUiState.tourDismissed = true;
  renderLangoContentStudio();
}

export function setCmsMobileEditorPanel(panel: CmsMobileEditorPanel): void {
  cmsUiState.mobileEditorPanel = panel;
  renderLangoContentStudio();
}

export function toggleCmsOutlineSection(sectionId: string): void {
  cmsUiState.collapsedSectionIds[sectionId] =
    !cmsUiState.collapsedSectionIds[sectionId];
  renderLangoContentStudio();
}

export function markCmsEditorUnsavedChanges(): void {
  cmsUiState.hasUnsavedEditorChanges = true;
  const statusEl = document.querySelector(
    '[data-testid="cms-editor-plain-status-line"]'
  ) as HTMLElement | null;
  if (statusEl) {
    statusEl.textContent =
      'Unsaved typing on this page — Click "Save Draft" to save your changes';
    statusEl.style.color = 'var(--warn)';
  }
}

export function syncFriendlyMcChoicesToUnderlyingInputs(): void {
  cmsUiState.hasUnsavedEditorChanges = true;
  const optionInputs = Array.from(
    document.querySelectorAll('.cms-friendly-option-input')
  ) as HTMLInputElement[];
  const optionsText = optionInputs.map((el) => el.value.trim()).join('\n');
  const optsTextarea = document.getElementById(
    'cms-edit-activity-options'
  ) as HTMLTextAreaElement | null;
  if (optsTextarea) {
    optsTextarea.value = optionsText;
  }

  const checkedRadio = document.querySelector(
    'input[name="cms-friendly-correct-choice"]:checked'
  ) as HTMLInputElement | null;
  const idxInput = document.getElementById(
    'cms-edit-activity-correct-idx'
  ) as HTMLInputElement | null;
  if (checkedRadio && idxInput) {
    idxInput.value = checkedRadio.value;
  }
}

export function handleQuickAddLessonFromHome(): void {
  cmsUiState.activeTab = 'editor';
  handleAddCmsModulePrompt();
}

export function handleStartFirstModuleForTrack(trackId: string): void {
  cmsUiState.selectedTrackId = trackId;
  cmsUiState.activeTab = 'editor';
  handleAddCmsModulePrompt();
}

export function resumeLastEditedCmsLesson(): void {
  if (!cmsUiState.lastEditedItem) return;
  cmsUiState.selectedTrackId = cmsUiState.lastEditedItem.trackId;
  cmsUiState.selectedModuleId = cmsUiState.lastEditedItem.moduleId;
  cmsUiState.selectedSectionId = cmsUiState.lastEditedItem.sectionId;
  cmsUiState.selectedLessonId = cmsUiState.lastEditedItem.lessonId;
  cmsUiState.activeTab = 'editor';
  cmsUiState.mobileEditorPanel = 'lesson';
  renderLangoContentStudio();
}

export function jumpToCmsValidationProblem(
  moduleId: string,
  lessonId?: string,
  activityId?: string
): void {
  if (moduleId) cmsUiState.selectedModuleId = moduleId;
  if (lessonId) cmsUiState.selectedLessonId = lessonId;
  if (activityId) cmsUiState.selectedActivityId = activityId;
  cmsUiState.activeTab = 'editor';
  cmsUiState.mobileEditorPanel = 'lesson';
  ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);
  renderLangoContentStudio();
}

export function handleCmsGlobalSearchInput(query: string): void {
  cmsUiState.globalSearchQuery = query;
  renderLangoContentStudio();
}

export function handleSearchResultClick(
  resultType: string,
  courseTrackId: string,
  itemId: string
): void {
  cmsUiState.globalSearchQuery = '';
  if (resultType === 'vocabulary') {
    cmsUiState.selectedLexemeId = itemId;
    cmsUiState.activeTab = 'vocabulary';
  } else {
    cmsUiState.selectedTrackId = courseTrackId;
    cmsUiState.activeTab = 'editor';
    ensureEditorSelectionForDraft(courseTrackId);
  }
  renderLangoContentStudio();
}

export function setCmsCourseManagerFilter(
  kind: 'search' | 'direction' | 'status' | 'sort',
  value: string
): void {
  if (kind === 'search') cmsUiState.courseSearchQuery = value;
  if (kind === 'direction')
    cmsUiState.courseDirectionFilter =
      value as CmsStudioUiState['courseDirectionFilter'];
  if (kind === 'status')
    cmsUiState.courseStatusFilter =
      value as CmsStudioUiState['courseStatusFilter'];
  if (kind === 'sort')
    cmsUiState.courseSortBy = value as CmsStudioUiState['courseSortBy'];
  renderLangoContentStudio();
}

export function selectCmsEditorModule(moduleId: string): void {
  cmsUiState.selectedModuleId = moduleId;
  cmsUiState.selectedSectionId = '';
  cmsUiState.selectedLessonId = '';
  cmsUiState.selectedActivityId = '';
  cmsUiState.hasUnsavedEditorChanges = false;
  ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);
  renderLangoContentStudio();
}

export function selectCmsEditorLesson(
  moduleId: string,
  sectionId: string,
  lessonId: string
): void {
  cmsUiState.selectedModuleId = moduleId;
  cmsUiState.selectedSectionId = sectionId;
  cmsUiState.selectedLessonId = lessonId;
  cmsUiState.selectedActivityId = '';
  cmsUiState.mobileEditorPanel = 'lesson';
  cmsUiState.hasUnsavedEditorChanges = false;
  ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);
  renderLangoContentStudio();
}

export function selectCmsEditorActivity(activityId: string): void {
  cmsUiState.selectedActivityId = activityId;
  cmsUiState.hasUnsavedEditorChanges = false;
  renderLangoContentStudio();
}

export function toggleCmsSourceJsonDrawer(): void {
  cmsUiState.showSourceJsonDrawer = !cmsUiState.showSourceJsonDrawer;
  renderLangoContentStudio();
}

export function toggleCmsDraftVsPublishedDiffDrawer(): void {
  cmsUiState.showDraftVsPublishedDiffDrawer =
    !cmsUiState.showDraftVsPublishedDiffDrawer;
  renderLangoContentStudio();
}

export function toggleCmsRemovedItemsDrawer(): void {
  cmsUiState.showRemovedItemsDrawer = !cmsUiState.showRemovedItemsDrawer;
  renderLangoContentStudio();
}

export function toggleCmsUnpublishedChangesDrawer(): void {
  cmsUiState.showUnpublishedChangesSummaryDrawer =
    !cmsUiState.showUnpublishedChangesSummaryDrawer;
  renderLangoContentStudio();
}

export function requestCmsItemRemoval(target: CmsRemovalTargetSpec): void {
  const impact = analyzeCmsRemovalImpact(cmsUiState.selectedTrackId, target);
  if (impact.requiresConfirmation) {
    cmsUiState.pendingRemovalConfirmation = impact;
    renderLangoContentStudio();
    return;
  }
  const res = removeCmsContentItemInDraft(cmsUiState.selectedTrackId, target);
  ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);
  setCmsBanner('success', res.undoBannerMessage, true);
  renderLangoContentStudio();
}

export function confirmPendingCmsRemoval(): void {
  const pending = cmsUiState.pendingRemovalConfirmation;
  if (!pending) return;
  cmsUiState.pendingRemovalConfirmation = null;
  const res = removeCmsContentItemInDraft(
    cmsUiState.selectedTrackId,
    pending.target
  );
  ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);
  setCmsBanner('success', res.undoBannerMessage, true);
  renderLangoContentStudio();
}

export function cancelPendingCmsRemoval(): void {
  cmsUiState.pendingRemovalConfirmation = null;
  renderLangoContentStudio();
}

export function handleUndoCmsEditorAction(): void {
  const res = undoLastCmsAction(cmsUiState.selectedTrackId);
  ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);
  if (res.success) {
    setCmsBanner('success', res.message, false);
  } else {
    setCmsBanner('warn', res.message, false);
  }
  renderLangoContentStudio();
}

export function handleRedoCmsEditorAction(): void {
  const res = redoLastCmsAction(cmsUiState.selectedTrackId);
  ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);
  if (res.success) {
    setCmsBanner('success', res.message, false);
  } else {
    setCmsBanner('warn', res.message, false);
  }
  renderLangoContentStudio();
}

export function handleRestoreRemovedCmsItem(removalId: string): void {
  const res = restoreRemovedCmsItemInDraft(
    cmsUiState.selectedTrackId,
    removalId
  );
  ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);
  if (res.success) {
    setCmsBanner('success', res.message, false);
  } else {
    setCmsBanner('danger', res.message, false);
  }
  renderLangoContentStudio();
}

export function handleRequestRemoveModule(moduleId: string): void {
  requestCmsItemRemoval({
    itemType: 'module',
    moduleId,
  });
}

export function handleAddCmsSection(moduleId: string): void {
  const res = addCmsSectionToModuleInDraft(
    cmsUiState.selectedTrackId,
    moduleId
  );
  cmsUiState.selectedModuleId = moduleId;
  cmsUiState.selectedSectionId = res.addedSection.sectionId;
  const firstLesson = res.addedSection.lessons?.[0];
  if (firstLesson) {
    cmsUiState.selectedLessonId = firstLesson.lessonId;
    cmsUiState.selectedActivityId = firstLesson.activities?.[0]?.activityId || '';
  }
  recordLastEditedLesson();
  setCmsBanner(
    'success',
    `Added "${res.addedSection.title}" to Module ${moduleId} in your draft.`,
    true
  );
  renderLangoContentStudio();
}

export function handleRequestRemoveSection(
  moduleId: string,
  sectionId: string
): void {
  requestCmsItemRemoval({
    itemType: 'section',
    moduleId,
    sectionId,
  });
}

export function handleAddCmsLesson(
  moduleId: string,
  sectionId: string
): void {
  const res = addCmsLessonToSectionInDraft(
    cmsUiState.selectedTrackId,
    moduleId,
    sectionId
  );
  cmsUiState.selectedModuleId = moduleId;
  cmsUiState.selectedSectionId = sectionId;
  cmsUiState.selectedLessonId = res.addedLesson.lessonId;
  cmsUiState.selectedActivityId =
    res.addedLesson.activities?.[0]?.activityId || '';
  cmsUiState.mobileEditorPanel = 'lesson';
  recordLastEditedLesson();
  setCmsBanner(
    'success',
    `Added "${res.addedLesson.title}" to your draft.`,
    true
  );
  renderLangoContentStudio();
}

export function handleDuplicateCmsLesson(
  moduleId: string,
  lessonId: string
): void {
  const res = duplicateCmsLessonInDraft(
    cmsUiState.selectedTrackId,
    moduleId,
    lessonId
  );
  cmsUiState.selectedModuleId = moduleId;
  cmsUiState.selectedLessonId = res.duplicatedLesson.lessonId;
  cmsUiState.selectedActivityId =
    res.duplicatedLesson.activities?.[0]?.activityId || '';
  recordLastEditedLesson();
  setCmsBanner(
    'success',
    `Duplicated lesson as "${res.duplicatedLesson.title}" in your draft.`,
    true
  );
  renderLangoContentStudio();
}

export function handleRequestRemoveLesson(
  moduleId: string,
  sectionId: string,
  lessonId: string
): void {
  requestCmsItemRemoval({
    itemType: 'lesson',
    moduleId,
    sectionId,
    lessonId,
  });
}

export function handleRemoveLessonParagraph(paragraphIndex: number): void {
  if (!cmsUiState.selectedModuleId || !cmsUiState.selectedLessonId) return;
  requestCmsItemRemoval({
    itemType: 'lesson_paragraph',
    moduleId: cmsUiState.selectedModuleId,
    sectionId: cmsUiState.selectedSectionId,
    lessonId: cmsUiState.selectedLessonId,
    paragraphIndex,
  });
}

export function handleRemoveLessonVocabRef(vocabId: string): void {
  if (!cmsUiState.selectedModuleId || !cmsUiState.selectedLessonId) return;
  requestCmsItemRemoval({
    itemType: 'vocabulary_reference',
    moduleId: cmsUiState.selectedModuleId,
    sectionId: cmsUiState.selectedSectionId,
    lessonId: cmsUiState.selectedLessonId,
    vocabId,
  });
}

export function handleAddLessonVocabRefFromInput(): void {
  const input = document.getElementById(
    'cms-add-lesson-vocab-input'
  ) as HTMLInputElement | null;
  const vocabId = input?.value.trim() || '';
  if (
    !vocabId ||
    !cmsUiState.selectedModuleId ||
    !cmsUiState.selectedLessonId
  ) {
    return;
  }
  addCmsLessonVocabularyRefInDraft(
    cmsUiState.selectedTrackId,
    cmsUiState.selectedModuleId,
    cmsUiState.selectedLessonId,
    vocabId
  );
  if (input) input.value = '';
  recordLastEditedLesson();
  setCmsBanner(
    'success',
    `Linked vocabulary word "${vocabId}" to this lesson draft.`,
    true
  );
  renderLangoContentStudio();
}

export function handleRemoveLessonMediaRef(mediaPath: string): void {
  if (!cmsUiState.selectedModuleId || !cmsUiState.selectedLessonId) return;
  requestCmsItemRemoval({
    itemType: 'media_reference',
    moduleId: cmsUiState.selectedModuleId,
    sectionId: cmsUiState.selectedSectionId,
    lessonId: cmsUiState.selectedLessonId,
    mediaPath,
  });
}

export function handleAddLessonMediaRefFromInput(): void {
  const select = document.getElementById(
    'cms-add-lesson-media-select'
  ) as HTMLSelectElement | null;
  const mediaPath = select?.value.trim() || '';
  if (
    !mediaPath ||
    !cmsUiState.selectedModuleId ||
    !cmsUiState.selectedLessonId
  ) {
    return;
  }
  addCmsLessonMediaRefInDraft(
    cmsUiState.selectedTrackId,
    cmsUiState.selectedModuleId,
    cmsUiState.selectedLessonId,
    mediaPath
  );
  if (select) select.value = '';
  recordLastEditedLesson();
  setCmsBanner(
    'success',
    `Linked photo "${mediaPath}" to this lesson draft.`,
    true
  );
  renderLangoContentStudio();
}

export function handleDuplicateActiveCmsActivity(): void {
  if (
    !cmsUiState.selectedModuleId ||
    !cmsUiState.selectedLessonId ||
    !cmsUiState.selectedActivityId
  ) {
    return;
  }
  const res = duplicateCmsActivityInDraft(
    cmsUiState.selectedTrackId,
    cmsUiState.selectedModuleId,
    cmsUiState.selectedLessonId,
    cmsUiState.selectedActivityId
  );
  cmsUiState.selectedActivityId = res.duplicatedActivity.activityId;
  recordLastEditedLesson();
  setCmsBanner(
    'success',
    `Duplicated activity as "${res.duplicatedActivity.title}" in your draft.`,
    true
  );
  renderLangoContentStudio();
}

export function handleRequestRemoveActiveActivity(): void {
  if (
    !cmsUiState.selectedModuleId ||
    !cmsUiState.selectedLessonId ||
    !cmsUiState.selectedActivityId
  ) {
    return;
  }
  requestCmsItemRemoval({
    itemType: 'activity',
    moduleId: cmsUiState.selectedModuleId,
    sectionId: cmsUiState.selectedSectionId,
    lessonId: cmsUiState.selectedLessonId,
    activityId: cmsUiState.selectedActivityId,
  });
}

export function handleAddCmsAnswerOption(): void {
  if (
    !cmsUiState.selectedModuleId ||
    !cmsUiState.selectedLessonId ||
    !cmsUiState.selectedActivityId
  ) {
    return;
  }
  addCmsAnswerOptionInDraft(
    cmsUiState.selectedTrackId,
    cmsUiState.selectedModuleId,
    cmsUiState.selectedLessonId,
    cmsUiState.selectedActivityId
  );
  recordLastEditedLesson();
  setCmsBanner('success', 'Added a new answer choice to this question.', true);
  renderLangoContentStudio();
}

export function handleRequestRemoveAnswerOption(optionIndex: number): void {
  if (
    !cmsUiState.selectedModuleId ||
    !cmsUiState.selectedLessonId ||
    !cmsUiState.selectedActivityId
  ) {
    return;
  }
  requestCmsItemRemoval({
    itemType: 'answer_option',
    moduleId: cmsUiState.selectedModuleId,
    sectionId: cmsUiState.selectedSectionId,
    lessonId: cmsUiState.selectedLessonId,
    activityId: cmsUiState.selectedActivityId,
    optionIndex,
  });
}

export function handleRemoveQuestionExplanation(): void {
  if (
    !cmsUiState.selectedModuleId ||
    !cmsUiState.selectedLessonId ||
    !cmsUiState.selectedActivityId
  ) {
    return;
  }
  requestCmsItemRemoval({
    itemType: 'question_explanation',
    moduleId: cmsUiState.selectedModuleId,
    sectionId: cmsUiState.selectedSectionId,
    lessonId: cmsUiState.selectedLessonId,
    activityId: cmsUiState.selectedActivityId,
  });
}

export function handleRemoveGrammarRule(ruleIndex: number): void {
  if (
    !cmsUiState.selectedModuleId ||
    !cmsUiState.selectedLessonId ||
    !cmsUiState.selectedActivityId
  ) {
    return;
  }
  requestCmsItemRemoval({
    itemType: 'grammar_rule',
    moduleId: cmsUiState.selectedModuleId,
    sectionId: cmsUiState.selectedSectionId,
    lessonId: cmsUiState.selectedLessonId,
    activityId: cmsUiState.selectedActivityId,
    ruleIndex,
  });
}

export function handleRemoveExampleSentence(exampleIndex: number): void {
  if (
    !cmsUiState.selectedModuleId ||
    !cmsUiState.selectedLessonId ||
    !cmsUiState.selectedActivityId
  ) {
    return;
  }
  requestCmsItemRemoval({
    itemType: 'example_sentence',
    moduleId: cmsUiState.selectedModuleId,
    sectionId: cmsUiState.selectedSectionId,
    lessonId: cmsUiState.selectedLessonId,
    activityId: cmsUiState.selectedActivityId,
    exampleIndex,
  });
}

export function handleRequestRemoveGrammarTable(tableIndex: number): void {
  if (
    !cmsUiState.selectedModuleId ||
    !cmsUiState.selectedLessonId ||
    !cmsUiState.selectedActivityId
  ) {
    return;
  }
  requestCmsItemRemoval({
    itemType: 'grammar_table',
    moduleId: cmsUiState.selectedModuleId,
    sectionId: cmsUiState.selectedSectionId,
    lessonId: cmsUiState.selectedLessonId,
    activityId: cmsUiState.selectedActivityId,
    tableIndex,
  });
}

export function handleRemoveGrammarTableRow(
  tableIndex: number,
  rowIndex: number
): void {
  if (
    !cmsUiState.selectedModuleId ||
    !cmsUiState.selectedLessonId ||
    !cmsUiState.selectedActivityId
  ) {
    return;
  }
  requestCmsItemRemoval({
    itemType: 'grammar_table_row',
    moduleId: cmsUiState.selectedModuleId,
    sectionId: cmsUiState.selectedSectionId,
    lessonId: cmsUiState.selectedLessonId,
    activityId: cmsUiState.selectedActivityId,
    tableIndex,
    rowIndex,
  });
}

export function setCmsPreviewMode(mode: 'draft' | 'published'): void {
  cmsUiState.previewMode = mode;
  renderLangoContentStudio();
}

export function openCmsPreviewWithMode(mode: 'draft' | 'published'): void {
  cmsUiState.previewMode = mode;
  cmsUiState.activeTab = 'preview';
  renderLangoContentStudio();
}

export function handleDiscardCmsDraftOverlay(): void {
  const restored = discardCmsDraftOverlay(cmsUiState.selectedTrackId);
  cmsUiState.hasUnsavedEditorChanges = false;
  cmsUiState.pendingRemovalConfirmation = null;
  ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);
  setCmsBanner(
    'success',
    `Discarded unpublished draft changes. Restored all ${restored.draftPackage.modules.length} published module(s).`
  );
  renderLangoContentStudio();
}

export function handleAddCmsModulePrompt(): void {
  const draft = getOrCreateCmsCourseDraft(cmsUiState.selectedTrackId);
  const nextNum = draft.draftPackage.modules.length + 1;
  const newModId = `${cmsUiState.selectedTrackId.replace('track:', '').replace(/-/g, '_')}_mod_${nextNum}`;
  const newSecId = `${newModId}_sec_1`;
  const newLesId = `${newModId}_les_1`;
  const newActId = `${newModId}_act_1`;

  addOrUpdateCmsModuleInDraft(cmsUiState.selectedTrackId, {
    moduleId: newModId,
    proficiencyLevel: 'A1',
    title: `Module ${nextNum}: Foundations & Core Expressions`,
    learningObjectives: [
      `Master core communicative patterns in Module ${nextNum}`,
    ],
    sections: [
      {
        sectionId: newSecId,
        title: 'Section 1: Core Concepts & Practice',
        lessons: [
          {
            lessonId: newLesId,
            title: `Lesson ${nextNum}.1: Essential Communication`,
            summary: 'Core patterns and guided practice',
            instructionalText:
              'Welcome to this draft lesson created in Lango Content Studio. Review the key patterns and complete the interactive check below.',
            vocabularyRefs: ['en_lex_0001'],
            activities: [
              {
                activityId: newActId,
                activityType: 'knowledge_check_mc',
                title: 'Quick Check',
                prompt: 'Which expression is a polite greeting?',
                payload: {
                  options: ['Hello!', 'Goodbye', 'Never'],
                  correctIndex: 0,
                  explanation: '"Hello!" is the standard polite greeting.',
                },
              },
            ],
          },
        ],
      },
    ],
  });

  cmsUiState.selectedModuleId = newModId;
  cmsUiState.selectedSectionId = newSecId;
  cmsUiState.selectedLessonId = newLesId;
  cmsUiState.selectedActivityId = newActId;
  cmsUiState.mobileEditorPanel = 'lesson';
  cmsUiState.hasUnsavedEditorChanges = false;
  recordLastEditedLesson();
  setCmsBanner(
    'success',
    `Added Module ${nextNum} to your private draft. Your changes are ready to edit and preview.`,
    true
  );
  renderLangoContentStudio();
}

export function handleAddCmsActivityToLesson(): void {
  if (!cmsUiState.selectedModuleId || !cmsUiState.selectedLessonId) return;
  const res = addCmsActivityToLessonInDraft(
    cmsUiState.selectedTrackId,
    cmsUiState.selectedModuleId,
    cmsUiState.selectedLessonId
  );
  cmsUiState.selectedActivityId = res.addedActivity.activityId;
  recordLastEditedLesson();
  setCmsBanner(
    'success',
    `Added "${res.addedActivity.title}" to your lesson draft.`,
    true
  );
  renderLangoContentStudio();
}

export function handleMoveCmsModule(fromIndex: number, toIndex: number): void {
  reorderCmsModulesInDraft(cmsUiState.selectedTrackId, fromIndex, toIndex);
  setCmsBanner(
    'success',
    `Moved module from position ${fromIndex + 1} to ${toIndex + 1} in your draft.`,
    true
  );
  renderLangoContentStudio();
}

export function handleDuplicateCmsModule(moduleId: string): void {
  const newId = `${moduleId}_copy_${Date.now().toString().slice(-4)}`;
  duplicateCmsModuleInDraft(cmsUiState.selectedTrackId, moduleId, newId);
  setCmsBanner(
    'success',
    `Created a copy of module "${moduleId}" in your draft.`,
    true
  );
  renderLangoContentStudio();
}

export function handleSaveCmsLessonEdits(): void {
  const titleEl = document.getElementById(
    'cms-edit-lesson-title'
  ) as HTMLInputElement | null;
  const subEl = document.getElementById(
    'cms-edit-lesson-summary'
  ) as HTMLInputElement | null;
  const textEl = document.getElementById(
    'cms-edit-lesson-text'
  ) as HTMLTextAreaElement | null;
  if (!titleEl || !cmsUiState.selectedLessonId) return;

  updateCmsLessonInDraft(
    cmsUiState.selectedTrackId,
    cmsUiState.selectedModuleId,
    cmsUiState.selectedLessonId,
    {
      title: titleEl.value.trim(),
      summary: subEl ? subEl.value.trim() : undefined,
      instructionalText: textEl ? textEl.value.trim() : undefined,
    }
  );

  cmsUiState.hasUnsavedEditorChanges = false;
  recordLastEditedLesson();
  setCmsBanner(
    'success',
    'Your draft has been saved. Your changes are ready to preview.'
  );
  renderLangoContentStudio();
}

export function handleSaveCmsActivityEdits(): void {
  const titleEl = document.getElementById(
    'cms-edit-activity-title'
  ) as HTMLInputElement | null;
  const promptEl = document.getElementById(
    'cms-edit-activity-prompt'
  ) as HTMLInputElement | null;
  const optsEl = document.getElementById(
    'cms-edit-activity-options'
  ) as HTMLTextAreaElement | null;
  const idxEl = document.getElementById(
    'cms-edit-activity-correct-idx'
  ) as HTMLInputElement | null;
  const expEl = document.getElementById(
    'cms-edit-activity-explanation'
  ) as HTMLTextAreaElement | null;

  if (!cmsUiState.selectedActivityId) return;

  const opts = optsEl
    ? optsEl.value
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const correctIndex = idxEl ? parseInt(idxEl.value, 10) : 0;

  updateCmsActivityInDraft(
    cmsUiState.selectedTrackId,
    cmsUiState.selectedModuleId,
    cmsUiState.selectedLessonId,
    cmsUiState.selectedActivityId,
    {
      title: titleEl ? titleEl.value.trim() : undefined,
      prompt: promptEl ? promptEl.value.trim() : undefined,
      payload: {
        options: opts.length > 0 ? opts : undefined,
        correctIndex: Number.isNaN(correctIndex) ? 0 : correctIndex,
        explanation: expEl ? expEl.value.trim() : '',
      },
    }
  );

  cmsUiState.hasUnsavedEditorChanges = false;
  recordLastEditedLesson();
  setCmsBanner(
    'success',
    'Your draft has been saved. Your question updates are ready to preview.'
  );
  renderLangoContentStudio();
}

export function handleCreateManualSnapshot(): void {
  const draft = getOrCreateCmsCourseDraft(cmsUiState.selectedTrackId);
  const snap = createCmsVersionSnapshot(
    cmsUiState.selectedTrackId,
    draft.draftPackage,
    'Manual Backup Version Saved in Content Studio',
    'manual_edit',
    draft.lifecycleState
  );
  setCmsBanner(
    'success',
    `Saved a backup version (${snap.versionId}). You can restore it anytime in Previous Versions.`
  );
  renderLangoContentStudio();
}

export function togglePendingPublishConfirmation(show: boolean): void {
  cmsUiState.pendingPublishConfirmation = show;
  renderLangoContentStudio();
}

export function handleCmsLifecycleTransition(
  targetState: CmsLifecycleState
): void {
  const res = transitionCmsDraftLifecycleState(
    cmsUiState.selectedTrackId,
    targetState,
    true
  );
  cmsUiState.pendingPublishConfirmation = false;
  if (res.success) {
    setCmsBanner(
      'success',
      `Your course was published successfully (${res.envelope.draftPackage.modules.length} modules verified).`
    );
  } else {
    setCmsBanner(
      'danger',
      `We found ${res.validationReport.errorCount} thing(s) to fix before publishing. Open "Review & Publish" to see how to fix them.`
    );
  }
  renderLangoContentStudio();
}

export function setCmsImportMode(
  mode: 'full_draft_import' | 'incremental_module_merge'
): void {
  cmsUiState.importMode = mode;
}

export function handleCmsImportFileSelected(input: HTMLInputElement): void {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    cmsUiState.importJsonText = String(reader.result || '');
    handleCheckCmsImportContents();
  };
  reader.readAsText(file);
}

export function handleCheckCmsImportContents(): void {
  const textarea = document.getElementById(
    'cms-importer-json-textarea'
  ) as HTMLTextAreaElement | null;
  if (textarea) cmsUiState.importJsonText = textarea.value;

  const preview = validateAndPreviewCourseImport(
    cmsUiState.importJsonText,
    cmsUiState.selectedTrackId
  );

  if (preview.valid) {
    cmsUiState.importCheckSummaryHtml = `
      <div data-testid="cms-import-check-summary" style="padding:12px 14px; background:var(--success-container); color:var(--success-on-container); border-radius:var(--radius-xs); font-size:13px; font-weight:700;">
        ✅ File Checked: This file contains <b>${preview.moduleCount} module(s)</b>, <b>${preview.lessonCount} lesson(s)</b>, and <b>${preview.activityCount} activity item(s)</b>. This content will be added to <b>${escapeHtml(formatFriendlyCourseDisplayName(cmsUiState.selectedTrackId))}</b>.
      </div>
    `;
  } else {
    cmsUiState.importCheckSummaryHtml = `
      <div data-testid="cms-import-check-summary" style="padding:12px 14px; background:var(--danger-container); color:var(--danger-on-container); border-radius:var(--radius-xs); font-size:13px;">
        <div style="font-weight:800;">⚠️ Please check this file before importing:</div>
        <div style="margin-top:4px;">${escapeHtml(preview.errors.join(' | '))}</div>
      </div>
    `;
  }
  renderLangoContentStudio();
}

export function loadCmsSampleFixture(
  kind: 'es-to-en' | 'en-to-hi' | 'es-incremental-mod3'
): void {
  if (kind === 'es-to-en') {
    cmsUiState.selectedTrackId = 'track:es-to-en';
    cmsUiState.importMode = 'full_draft_import';
    cmsUiState.importJsonText = SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE_JSON;
  } else if (kind === 'en-to-hi') {
    cmsUiState.selectedTrackId = 'track:en-to-hi';
    cmsUiState.importMode = 'full_draft_import';
    cmsUiState.importJsonText = SYNTHETIC_ENGLISH_TO_HINDI_TEST_FIXTURE_JSON;
  } else if (kind === 'es-incremental-mod3') {
    cmsUiState.selectedTrackId = 'track:es-to-en';
    cmsUiState.importMode = 'incremental_module_merge';
    const patch = {
      ...SYNTHETIC_SPANISH_TO_ENGLISH_TEST_FIXTURE,
      courseStatus: 'draft',
      modules: [
        {
          moduleId: 'es_en_test_m3',
          title:
            'Módulo 3 (Incremental Merge): Phrasal Verbs Cotidianos vs Verbos Latinos',
          proficiencyLevel: 'Foundational-3',
          learningObjectives: [
            'Dominar put off, look into y figure out en conversación diaria',
          ],
          vocabularyReferences: ['en_lex_0001'],
          sections: [
            {
              sectionId: 'es_en_test_sec_3',
              title: '1. Verbos Frasales de Alta Frecuencia',
              lessons: [
                {
                  lessonId: 'es_en_test_les_3',
                  title: 'Look into vs Investigar',
                  summary:
                    'El inglés hablado prefiere verbos frasales como "look into" o "figure out".',
                  instructionalText:
                    'Use "Let us look into this schedule" in everyday professional English.',
                  vocabularyRefs: ['en_lex_0002'],
                  activities: [
                    {
                      activityId: 'es_en_test_act_5',
                      activityType: 'knowledge_check_mc',
                      title: 'Phrasal Verb Check',
                      prompt:
                        'Which phrasal verb means "to investigate or examine"?',
                      payload: {
                        options: ['look into', 'give up', 'turn off'],
                        correctIndex: 0,
                        explanation: '"Look into" means to investigate.',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    cmsUiState.importJsonText = JSON.stringify(patch, null, 2);
  }
  handleCheckCmsImportContents();
}

export function handleExecuteCmsDraftImport(): void {
  const textarea = document.getElementById(
    'cms-importer-json-textarea'
  ) as HTMLTextAreaElement | null;
  if (textarea) cmsUiState.importJsonText = textarea.value;

  const res = importCourseJsonIntoCmsDraft(
    cmsUiState.importJsonText,
    cmsUiState.selectedTrackId,
    cmsUiState.importMode
  );

  if (res.success) {
    ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);
    cmsUiState.lastImportBannerHtml = `
      <div data-testid="cms-import-success-box" style="padding:12px 14px; background:var(--success-container); color:var(--success-on-container); border-radius:var(--radius-xs); font-size:13px; font-weight:700;">
        ✅ Imported into your private draft! Your course now has ${res.draftEnvelope?.draftPackage.modules.length || 0} module(s) ready to edit and preview.
      </div>
    `;
    setCmsBanner('success', 'Your course file was imported into your draft.');
  } else {
    cmsUiState.lastImportBannerHtml = `
      <div data-testid="cms-import-error-box" style="padding:12px 14px; background:var(--danger-container); color:var(--danger-on-container); border-radius:var(--radius-xs); font-size:13px;">
        <div style="font-weight:800;">❌ Could not import this file: ${escapeHtml(res.message)}</div>
      </div>
    `;
    setCmsBanner(
      'danger',
      'We found a problem with this course file. Check the message below for details.'
    );
  }
  renderLangoContentStudio();
}

export function setCmsVocabSearch(query: string): void {
  cmsUiState.vocabSearchQuery = query;
  renderLangoContentStudio();
}

export function selectCmsVocabLexeme(lexemeId: string): void {
  cmsUiState.selectedLexemeId = lexemeId;
  renderLangoContentStudio();
}

export function selectCmsOverlayLanguage(lang: string): void {
  cmsUiState.selectedOverlayLang = lang;
  renderLangoContentStudio();
}

export function handleSaveCanonicalLexeme(lexemeId: string): void {
  const hw =
    (document.getElementById('cms-lex-headword') as HTMLInputElement | null)
      ?.value || '';
  const pos =
    (document.getElementById('cms-lex-pos') as HTMLInputElement | null)
      ?.value || '';
  const ipa =
    (document.getElementById('cms-lex-ipa') as HTMLInputElement | null)
      ?.value || '';
  const meaning =
    (document.getElementById('cms-lex-meaning') as HTMLTextAreaElement | null)
      ?.value || '';

  const existing = getAllCanonicalEnglishLexemes().find(
    (l) => l.lexemeId === lexemeId
  );

  upsertCanonicalEnglishLexemeInCms({
    lexemeId,
    headwordEn: hw.trim(),
    pos: pos.trim(),
    ipaUs: ipa.trim(),
    ipaGb: existing?.ipaGb || ipa.trim(),
    coreMeaningEn: meaning.trim(),
    canonicalExamplesEn: existing?.canonicalExamplesEn || [],
  });
  setCmsBanner('success', `Saved shared English word "${hw.trim()}".`);
  renderLangoContentStudio();
}

export function handleSaveNativeOverlay(
  lexemeId: string,
  lang: string
): void {
  const trans =
    (
      document.getElementById(
        'cms-overlay-translation'
      ) as HTMLInputElement | null
    )?.value || '';
  const exp =
    (
      document.getElementById(
        'cms-overlay-explanation'
      ) as HTMLTextAreaElement | null
    )?.value || '';
  const tip =
    (document.getElementById('cms-overlay-tip') as HTMLInputElement | null)
      ?.value || '';

  const existing = getAllNativeOverlaysForLexeme(lexemeId).find(
    (o) => o.nativeLanguage === lang
  );

  upsertNativeLanguageOverlayInCms({
    overlayId: existing?.overlayId || `vocab-overlay:en:for-${lang}`,
    courseTrackId: `track:${lang}-to-en`,
    nativeLanguage: lang,
    lexemeId,
    translationNative: trans.trim(),
    explanationNative: exp.trim(),
    pronunciationTipForNativeSpeaker: tip.trim(),
    bilingualExamples: existing?.bilingualExamples || [],
    pedagogicalSequenceOrder: existing?.pedagogicalSequenceOrder || 1,
  });

  setCmsBanner(
    'success',
    `Saved ${getLanguagePlainName(lang)} translation without changing any other language.`
  );
  renderLangoContentStudio();
}

export function handleRunCmsBulkAudit(): void {
  const res = runBulkCmsValidationAudit();
  cmsUiState.lastBulkAuditSummary = {
    auditedTrackCount: res.auditedTrackCount,
    totalErrors: res.totalErrors,
    totalWarnings: res.totalWarnings,
  };
  setCmsBanner(
    'success',
    `Checked all ${res.auditedTrackCount} courses (${res.totalErrors} must-fix issue(s) found).`
  );
  renderLangoContentStudio();
}

export function handleAddCmsReviewerNote(): void {
  const noteInput = document.getElementById(
    'cms-review-note-input'
  ) as HTMLInputElement | null;
  const statusSelect = document.getElementById(
    'cms-review-status-select'
  ) as HTMLSelectElement | null;
  if (!noteInput || !noteInput.value.trim()) return;

  addCmsManualReviewNote(
    cmsUiState.selectedTrackId,
    noteInput.value.trim(),
    (statusSelect?.value as any) || 'pending_review'
  );
  setCmsBanner('success', 'Saved your review note.');
  renderLangoContentStudio();
}

export function handleRestoreCmsSnapshot(versionId: string): void {
  const res = restoreCmsVersionSnapshot(cmsUiState.selectedTrackId, versionId);
  cmsUiState.hasUnsavedEditorChanges = false;
  ensureEditorSelectionForDraft(cmsUiState.selectedTrackId);
  setCmsBanner(
    'success',
    `Restored earlier version "${versionId}" (automatic backup saved as ${res.backupSnapshot.versionId}).`
  );
  renderLangoContentStudio();
}

export function setCmsDiffSelection(
  side: 'left' | 'right',
  versionId: string
): void {
  if (side === 'left') cmsUiState.diffLeftVersionId = versionId;
  if (side === 'right') cmsUiState.diffRightVersionId = versionId;
  renderLangoContentStudio();
}

export function setCmsMediaSearch(query: string): void {
  cmsUiState.mediaSearchQuery = query;
  renderLangoContentStudio();
}

export function handleVerifyCmsExportRoundTrip(): void {
  const exported = exportCmsCourseDraftToJson(cmsUiState.selectedTrackId);
  const reimportCheck = validateAndPreviewCourseImport(
    exported.jsonString,
    cmsUiState.selectedTrackId
  );
  if (reimportCheck.valid) {
    cmsUiState.exportStatusMessage = `✅ Export File Verified: Contains ${reimportCheck.moduleCount} module(s), ${reimportCheck.lessonCount} lesson(s), and ${reimportCheck.activityCount} question/activity item(s) with 0 errors.`;
  } else {
    cmsUiState.exportStatusMessage = `⚠️ Export Notice: ${reimportCheck.errors.join(' | ')}`;
  }
  renderLangoContentStudio();
}

export function handleDownloadCmsExportJson(): void {
  const exported = exportCmsCourseDraftToJson(cmsUiState.selectedTrackId);
  const blob = new Blob([exported.jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${cmsUiState.selectedTrackId.replace(':', '-')}-${exported.exportedPackage.schemaVersion}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function bootCmsStudioRouteIfRequested(): void {
  if (typeof window === 'undefined') return;
  if (
    window.location.pathname === '/studio' ||
    window.location.search.includes('studio=1')
  ) {
    openLangoContentStudio('dashboard');
  }
}

export {
  cmsStorageAdapter,
  selectCmsIdentifyScene,
  selectCmsIdentifyTarget,
  setCmsIdentifyFilter,
  toggleCmsIdentifyBulkAuditPanel,
  toggleCmsIdentifyScenePlannerPanel,
  handleCmsIdentifyCanvasClick,
  handleCmsIdentifySaveGeometryInputs,
  handleCmsIdentifyNudgeTarget,
  handleCmsIdentifyMarkTargetMissing,
  handleCmsIdentifyAddTarget,
  handleCmsIdentifyChangeAssetPath,
  handleCmsIdentifyUndoDraft,
  handleCmsIdentifyRestoreBaseline,
  handleCmsIdentifyCheckScene,
  handleCmsIdentifyPublishScene,
  handleCmsIdentifyPreviewInLearnerApp,
};
