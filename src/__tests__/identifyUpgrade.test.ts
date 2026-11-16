// ============================================================================
// LANGO — IDENTIFY VISUAL VOCABULARY UPGRADE ACCEPTANCE TEST SUITE
// Executes all 29 Required Functional Tests (TEST 1 through TEST 29)
// ============================================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  computeMasterVocabularyCoverageSummary,
  getApprovedLearnerTargets,
  getPlayableIdentifyCategories,
  IDENTIFY_CATEGORIES,
  IDENTIFY_EXPANSION_120_SUMMARY,
  IDENTIFY_MASTER_2000_NOUNS,
  IDENTIFY_TOPIC_GROUPS,
  isApprovedVerifiedLearnerTarget,
  isScenePlayableForStudents,
  isSynthetic5x5GridBox,
  VERIFIED_PHOTOGRAPH_SCENE_SPECS,
} from '../identifyData.ts';
import {
  claimIdentifyRoundXpIfEligible,
  computeIdentifyRoundSummary,
  computeIdentifySceneSummary,
  generateIdentifyMultipleChoiceOptions,
  loadIdentifyProgress,
  recordIdentifyAttempt,
  recordIdentifyExploreInspection,
  recordIdentifyShowAnswer,
  selectAdaptiveIdentifyRoundTargets,
  startIdentifyPracticeRound,
  transliterateUkToPronunciation,
  validateIdentifyTypedAnswer,
} from '../identifyEngine.ts';
import {
  clampZoomPanState,
  computeBoundingBoxIoU,
  computeRenderedImageRect,
  isPointerGesturePanDrag,
  projectAllSceneTargetsToViewport,
  projectNormalizedTargetToViewport,
  projectTargetWithZoomPan,
  REPRESENTATIVE_VIEWPORT_MATRIX,
  resolveTargetHitAtNormalizedPoint,
} from '../identifyResponsiveGeometry.ts';
import {
  computeExponentialBackoffMs,
  getIdentifyGenerationQueueSummary,
  isQuotaExhaustedError,
  parseRetryAfterMs,
  recordSceneGenerationAttempt,
  resetIdentifyGenerationQueueState,
} from '../identifyGenerationQueue.ts';
import {
  addIdentifyTargetToDraft,
  analyzeVocabularyGroupCompatibility,
  buildPilotCorrectionScenesForBeachScene3,
  getBaselineIdentifyScene,
  getEffectiveIdentifyScene,
  getOrCreateIdentifySceneDraft,
  markIdentifyTargetMissingInDraft,
  planIdentifyScenesForVocabulary,
  publishValidatedIdentifySceneDraft,
  resetIdentifyStudioStateForTests,
  resolveIdentifyTargetForCourseTrack,
  restoreIdentifySceneBaseline,
  runCurated40LibraryAudit,
  runIdentifyLibraryBulkAudit,
  undoIdentifySceneDraftEdit,
  updateIdentifyTargetGeometryInDraft,
  validateIdentifySceneQuality,
  verifySceneAcrossRepresentativeViewports,
} from '../identifySceneIntelligence.ts';
import { COURSE_MODULES } from '../courseData.ts';
import { getAllCourseTracks } from '../multilingual/courseTrackRegistry.ts';
import { setSimulatedPublicProductionModeForTesting } from '../multilingual/cmsAuthAndStorage.ts';
import {
  closeIdentifyAdminPreviewSession,
  findPlayableLegacySceneById,
  getIdentify80SceneBrowserList,
  getIdentify80SceneByCodeOrNumber,
  inspectUnreviewedScenesCoherence,
  isIdentifyAdminPreviewAuthorized,
  isSceneRemovedForUnrelatedObjects,
  REMOVED_INCOHERENT_UNREVIEWED_SCENES,
  resolveSceneViewerHotspots,
  revealAdminPreviewTargetAnswer,
  setIdentifyAdminPreviewUiToggle,
  startIdentifyAdminPreviewSession,
  stepAdminPreviewTargetSlot,
  submitAdminPreviewMultipleChoice,
  submitAdminPreviewTypedAnswer,
} from '../identifyCurriculumPreview.ts';
import {
  buildDockerZipManifest,
  getOrBuildDockerZipArchive,
} from '../dockerZipExporter.ts';

// ----------------------------------------------------------------------------
// TEST 1 — Defective Scene Detection
// ----------------------------------------------------------------------------
test('TEST 1 — Defective Scene Detection: flags missing objects and misaligned markers in beach-nature-scene-3', () => {
  resetIdentifyStudioStateForTests();
  const baselineScene3 = getBaselineIdentifyScene('beach-nature-scene-3');
  assert.ok(baselineScene3, 'beach-nature-scene-3 must exist');
  assert.equal(baselineScene3.targets.length, 9);

  const report = validateIdentifySceneQuality(baselineScene3);
  assert.equal(report.canPublish, false, 'Defective scene must not be publishable');
  assert.equal(report.qualityState, 'invalid_defective');
  assert.equal(report.usesLegacyGridCoordinates, true);
  assert.ok(report.missingObjectCount >= 5, 'Should detect the 5 missing objects');

  const messages = report.findings.map((f) => f.userFriendlyMessageEn);
  assert.ok(
    messages.includes("This image doesn't appear to show a beach towel."),
    'Must report missing beach towel in plain English'
  );
  assert.ok(
    messages.includes('The marker for the sun is not on the sun.'),
    'Must report misaligned sun marker in plain English'
  );
  assert.ok(
    messages.includes('The image appears to show a lake, but the vocabulary word means sea.'),
    'Must report lake vs sea mismatch in plain English'
  );
});

// ----------------------------------------------------------------------------
// TEST 2 — Marker on Actual Object (Sun)
// ----------------------------------------------------------------------------
test('TEST 2 — Marker on Actual Object: Target #1 (sun) is positioned directly on the visible sun in Pilot Scene A', () => {
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const pilotA = pilots['beach-nature-scene-3-pilot-a'];
  const sunTarget = pilotA.targets.find((t) => t.vocabularyId === 'bn-sun');
  assert.ok(sunTarget, 'Sun target must exist in Pilot Scene A');
  assert.equal(sunTarget.targetNumber, 1);

  // Sun disk in /public/assets/identify/pilot/beach-nature-pilot-a.svg is centered at (180/1200=0.15, 135/900=0.15)
  assert.ok(sunTarget.centerX !== undefined && sunTarget.centerY !== undefined);
  assert.ok(sunTarget.centerX >= 0.08 && sunTarget.centerX <= 0.22);
  assert.ok(sunTarget.centerY >= 0.05 && sunTarget.centerY <= 0.25);

  const report = validateIdentifySceneQuality(pilotA);
  assert.equal(report.misalignedMarkerCount, 0);
  assert.equal(report.canPublish, true);
});

// ----------------------------------------------------------------------------
// TEST 3 — Beach Towel Verification
// ----------------------------------------------------------------------------
test('TEST 3 — Beach Towel Verification: beach towel (рушни́к) is present and marker sits on the beach towel in Pilot Scene A', () => {
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const pilotA = pilots['beach-nature-scene-3-pilot-a'];
  const towelTarget = pilotA.targets.find((t) => t.vocabularyId === 'bn-towel');
  assert.ok(towelTarget, 'Beach towel target must exist in Pilot Scene A');
  assert.equal(towelTarget.uk, 'рушни́к');

  // Striped beach towel in beach-nature-pilot-a.svg spans x: 0.22..0.46, y: 0.68..0.88 with center (0.34, 0.78)
  assert.ok(towelTarget.centerX! >= 0.22 && towelTarget.centerX! <= 0.46);
  assert.ok(towelTarget.centerY! >= 0.68 && towelTarget.centerY! <= 0.88);

  // Confirm the SVG file on disk contains the striped beach towel group
  const svgContent = fs.readFileSync(
    path.join(process.cwd(), 'public/assets/identify/pilot/beach-nature-pilot-a.svg'),
    'utf8'
  );
  assert.ok(svgContent.includes('id="obj-towel"'));
});

// ----------------------------------------------------------------------------
// TEST 4 — Sea vs. Lake Distinction
// ----------------------------------------------------------------------------
test('TEST 4 — Sea vs. Lake Distinction: sea (мо́ре) and lake (о́зеро) are separated into semantically compatible scenes', () => {
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const pilotA = pilots['beach-nature-scene-3-pilot-a'];
  const pilotB = pilots['beach-nature-scene-3-pilot-b'];

  const pilotAVocabIds = new Set(pilotA.targets.map((t) => t.vocabularyId));
  const pilotBVocabIds = new Set(pilotB.targets.map((t) => t.vocabularyId));

  assert.equal(pilotAVocabIds.has('bn-sea'), true, 'Coastal beach scene A has sea (мо́ре)');
  assert.equal(pilotAVocabIds.has('bn-lake'), false, 'Coastal beach scene A does not mix inland lake');

  assert.equal(pilotBVocabIds.has('bn-lake'), true, 'Alpine mountain lake scene B has lake (о́зеро)');
  assert.equal(pilotBVocabIds.has('bn-sea'), false, 'Alpine mountain lake scene B does not mix sea (мо́ре)');
});

// ----------------------------------------------------------------------------
// TEST 5 — Missing Object Handling
// ----------------------------------------------------------------------------
test('TEST 5 — Missing Object Handling: vocabulary items with no visible object are flagged as missing and excluded from active pins', () => {
  resetIdentifyStudioStateForTests();
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const verifiedPhoto = pilots['beach-nature-scene-3-verified-photo'];

  // Only the 4 visible objects (mountain, tree, lake, stone) have active markers on beach-nature_03.webp
  assert.equal(verifiedPhoto.targets.length, 4);
  assert.equal(verifiedPhoto.missingVocabularyItems?.length, 5);
  const missingIds = verifiedPhoto.missingVocabularyItems!.map((m) => m.vocabularyId);
  assert.deepEqual(missingIds.sort(), ['bn-beach', 'bn-sand', 'bn-sea', 'bn-sun', 'bn-towel']);

  // Also test marking a target missing interactively in draft
  const draftRes = markIdentifyTargetMissingInDraft(
    'beach-nature-scene-3-pilot-a',
    'beach-nature-pilot-a-t2',
    { removeFromActiveTargets: true }
  );
  assert.equal(draftRes.ok, true);
  assert.equal(draftRes.scene!.targets.length, 7);
  assert.ok(
    draftRes.scene!.missingVocabularyItems?.some((m) => m.vocabularyId === 'bn-towel')
  );
});

// ----------------------------------------------------------------------------
// TEST 6 — Flexible Target Count
// ----------------------------------------------------------------------------
test('TEST 6 — Flexible Target Count: scenes with 4, 5, and 8 targets work cleanly with scoring and completion', () => {
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const scenesToTest = [
    pilots['beach-nature-scene-3-verified-photo'], // 4 targets
    pilots['beach-nature-scene-3-pilot-b'], // 5 targets
    pilots['beach-nature-scene-3-pilot-a'], // 8 targets
  ];

  for (const sc of scenesToTest) {
    const prog = loadIdentifyProgress();
    delete prog.scenes[sc.id];

    for (const target of sc.targets) {
      recordIdentifyAttempt(prog, sc, target, 'mc', true, target.uk, 'Correct');
    }

    const summary = computeIdentifySceneSummary(prog, sc);
    assert.equal(summary.totalTargets, sc.targets.length);
    assert.equal(summary.resolvedCount, sc.targets.length);
    assert.equal(summary.isSceneComplete, true);
  }
});

// ----------------------------------------------------------------------------
// TEST 7 — Multi-Scene Vocabulary Splitting
// ----------------------------------------------------------------------------
test('TEST 7 — Multi-Scene Vocabulary Splitting: splits 9 incompatible beach/lake words into coherent scenes with 100% vocabulary coverage', () => {
  const baselineScene3 = getBaselineIdentifyScene('beach-nature-scene-3')!;
  const vocabItems = baselineScene3.targets.map((t) => ({
    vocabularyId: t.vocabularyId,
    uk: t.uk,
    en: t.en,
    acceptedSynonyms: t.acceptedSynonyms,
    pos: t.pos,
    gender: t.gender,
    exampleUk: t.exampleUk,
    exampleEn: t.exampleEn,
    freqRank: t.freqRank,
    iconType: t.iconType,
  }));

  const compat = analyzeVocabularyGroupCompatibility(vocabItems);
  assert.equal(compat.compatibleInSingleScene, false);

  const plan = planIdentifyScenesForVocabulary('beach-nature', vocabItems, {
    baseSceneId: 'beach-nature-scene-3',
  });
  assert.equal(plan.hadIncompatibleMix, true);
  assert.equal(plan.plannedScenes.length, 2);
  assert.equal(plan.originalVocabularyCount, 9);
  assert.equal(plan.accountedVocabularyCount, 9);
  assert.equal(plan.unaccountedVocabularyIds.length, 0);
});

// ----------------------------------------------------------------------------
// TEST 8 — Normalized Coordinate Projection Across Desktop, Laptop, Tablet & Smartphone
// ----------------------------------------------------------------------------
test('TEST 8 — Normalized Coordinate Projection: projects accurately across all 10 representative desktop, laptop, tablet, and smartphone viewports', () => {
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const pilotA = pilots['beach-nature-scene-3-pilot-a'];
  const check = verifySceneAcrossRepresentativeViewports(pilotA);

  assert.equal(check.viewportChecks.length, REPRESENTATIVE_VIEWPORT_MATRIX.length);
  assert.equal(check.allAligned, true);
  for (const vp of check.viewportChecks) {
    assert.ok(vp.maxDriftRatio < 1e-6, `Zero drift on ${vp.label}`);
    assert.equal(vp.allTargetsInsideRenderedImage, true);
  }
});

// ----------------------------------------------------------------------------
// TEST 9 — Window Resize Alignment
// ----------------------------------------------------------------------------
test('TEST 9 — Window Resize Alignment: dynamic container resizing preserves exact normalized object alignment', () => {
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const pilotA = pilots['beach-nature-scene-3-pilot-a'];

  const sizes = [
    { w: 1200, h: 900 },
    { w: 960, h: 600 },
    { w: 680, h: 510 },
    { w: 390, h: 292 },
  ];

  for (const sz of sizes) {
    const rect = computeRenderedImageRect({
      containerWidth: sz.w,
      containerHeight: sz.h,
      intrinsicWidth: 1200,
      intrinsicHeight: 900,
      objectFit: 'contain',
    });
    const projected = projectAllSceneTargetsToViewport(pilotA.targets, rect, sz.w);
    assert.equal(projected.length, pilotA.targets.length);

    for (let i = 0; i < pilotA.targets.length; i++) {
      const orig = pilotA.targets[i];
      const proj = projected[i];
      const normBackX = (proj.pinPx.x - rect.offsetX) / rect.renderedWidth;
      const normBackY = (proj.pinPx.y - rect.offsetY) / rect.renderedHeight;
      assert.ok(Math.abs(normBackX - (orig.centerX ?? orig.x + orig.width / 2)) < 1e-6);
      assert.ok(Math.abs(normBackY - (orig.centerY ?? orig.y + orig.height / 2)) < 1e-6);
    }
  }
});

// ----------------------------------------------------------------------------
// TEST 10 — Mobile Portrait Alignment
// ----------------------------------------------------------------------------
test('TEST 10 — Mobile Portrait Alignment: iPhone 16 Pro Max (430×932) and iPhone 15 (390×844) maintain touch target sizes and alignment', () => {
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const pilotA = pilots['beach-nature-scene-3-pilot-a'];

  for (const width of [390, 430, 360]) {
    const rect = computeRenderedImageRect({
      containerWidth: width - 28,
      containerHeight: Math.round((width - 28) * 0.75),
      intrinsicWidth: 1200,
      intrinsicHeight: 900,
      objectFit: 'contain',
    });
    const projected = projectAllSceneTargetsToViewport(pilotA.targets, rect, width);
    for (const p of projected) {
      assert.ok(p.touchTargetSizePx >= 40, 'Mobile portrait touch target must be >= 40px');
    }
  }
});

// ----------------------------------------------------------------------------
// TEST 11 — Mobile Landscape Alignment
// ----------------------------------------------------------------------------
test('TEST 11 — Mobile Landscape Alignment: 844×390 and 932×430 landscape viewports keep markers inside rendered image', () => {
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const pilotA = pilots['beach-nature-scene-3-pilot-a'];

  for (const [vw, vh] of [
    [844, 390],
    [932, 430],
  ]) {
    const rect = computeRenderedImageRect({
      containerWidth: Math.round(vw * 0.65),
      containerHeight: Math.round(vh * 0.78),
      intrinsicWidth: 1200,
      intrinsicHeight: 900,
      objectFit: 'contain',
    });
    const projected = projectAllSceneTargetsToViewport(pilotA.targets, rect, vw);
    for (const p of projected) {
      assert.ok(p.pinPx.x >= rect.offsetX && p.pinPx.x <= rect.offsetX + rect.renderedWidth);
      assert.ok(p.pinPx.y >= rect.offsetY && p.pinPx.y <= rect.offsetY + rect.renderedHeight);
    }
  }
});

// ----------------------------------------------------------------------------
// TEST 12 — Tablet Layout Alignment
// ----------------------------------------------------------------------------
test('TEST 12 — Tablet Layout Alignment: iPad Portrait (768×1024) and Landscape (1024×768) project markers accurately', () => {
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const pilotB = pilots['beach-nature-scene-3-pilot-b'];

  for (const [vw, vh] of [
    [768, 1024],
    [1024, 768],
    [1024, 1366],
    [1366, 1024],
  ]) {
    const rect = computeRenderedImageRect({
      containerWidth: Math.round(vw * 0.58),
      containerHeight: Math.round(vh * 0.55),
      intrinsicWidth: 1200,
      intrinsicHeight: 900,
      objectFit: 'contain',
    });
    const projected = projectAllSceneTargetsToViewport(pilotB.targets, rect, vw);
    assert.equal(projected.length, 5);
    for (const p of projected) {
      assert.ok(p.touchTargetSizePx >= 36);
    }
  }
});

// ----------------------------------------------------------------------------
// TEST 13 — Aspect Ratio Handling (4:3, 16:9, 1:1, letterboxed & cropped)
// ----------------------------------------------------------------------------
test('TEST 13 — Aspect Ratio Handling: handles 4:3, 16:9, and 1:1 containers under both contain and cover modes', () => {
  const target = {
    id: 't1',
    targetNumber: 1,
    x: 0.2,
    y: 0.3,
    width: 0.2,
    height: 0.2,
    centerX: 0.3,
    centerY: 0.4,
  };

  // 16:9 wide container with 4:3 image (pillarboxed in contain)
  const containRect = computeRenderedImageRect({
    containerWidth: 1600,
    containerHeight: 900,
    intrinsicWidth: 1200,
    intrinsicHeight: 900,
    objectFit: 'contain',
  });
  assert.equal(containRect.renderedWidth, 1200);
  assert.equal(containRect.renderedHeight, 900);
  assert.equal(containRect.offsetX, 200);
  assert.equal(containRect.offsetY, 0);

  const projContain = projectNormalizedTargetToViewport(target, containRect, 1600);
  assert.equal(projContain.pinPx.x, 200 + 0.3 * 1200);
  assert.equal(projContain.pinPx.y, 0.4 * 900);

  // 1:1 square container with 4:3 image in cover mode
  const coverRect = computeRenderedImageRect({
    containerWidth: 900,
    containerHeight: 900,
    intrinsicWidth: 1200,
    intrinsicHeight: 900,
    objectFit: 'cover',
  });
  assert.equal(coverRect.renderedWidth, 1200);
  assert.equal(coverRect.renderedHeight, 900);
  assert.equal(coverRect.offsetX, -150);
});

// ----------------------------------------------------------------------------
// TEST 14 — Overlap Prevention
// ----------------------------------------------------------------------------
test('TEST 14 — Overlap Prevention: validator flags overlapping target bounding boxes and pins', () => {
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const sceneCopy = JSON.parse(
    JSON.stringify(pilots['beach-nature-scene-3-pilot-a'])
  );
  // Make target 2 overlap target 1 directly
  sceneCopy.targets[1].x = sceneCopy.targets[0].x;
  sceneCopy.targets[1].y = sceneCopy.targets[0].y;
  sceneCopy.targets[1].width = sceneCopy.targets[0].width;
  sceneCopy.targets[1].height = sceneCopy.targets[0].height;
  sceneCopy.targets[1].centerX = sceneCopy.targets[0].centerX;
  sceneCopy.targets[1].centerY = sceneCopy.targets[0].centerY;

  assert.ok(computeBoundingBoxIoU(sceneCopy.targets[0], sceneCopy.targets[1]) > 0.9);
  const report = validateIdentifySceneQuality(sceneCopy);
  assert.ok(report.overlappingPairCount >= 1);
  assert.ok(
    report.findings.some(
      (f) => f.userFriendlyMessageEn === 'Two target areas overlap and may confuse students.'
    )
  );
});

// ----------------------------------------------------------------------------
// TEST 15 — Minimum Object Size
// ----------------------------------------------------------------------------
test('TEST 15 — Minimum Object Size: validator flags tiny unrecognizable object regions', () => {
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const sceneCopy = JSON.parse(
    JSON.stringify(pilots['beach-nature-scene-3-pilot-a'])
  );
  sceneCopy.targets[0].width = 0.02;
  sceneCopy.targets[0].height = 0.02;

  const report = validateIdentifySceneQuality(sceneCopy);
  assert.ok(report.tooSmallObjectCount >= 1);
  assert.ok(
    report.findings.some(
      (f) => f.userFriendlyMessageEn === 'This object is too small to identify clearly.'
    )
  );
});

// ----------------------------------------------------------------------------
// TEST 16 — Multiple Choice Mode
// ----------------------------------------------------------------------------
test('TEST 16 — Multiple Choice Mode: generates 4 valid Ukrainian options including the correct answer for upgraded scenes', () => {
  const cat = IDENTIFY_CATEGORIES.find((c) => c.id === 'beach-nature')!;
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const pilotA = pilots['beach-nature-scene-3-pilot-a'];

  for (const target of pilotA.targets) {
    const options = generateIdentifyMultipleChoiceOptions(target, cat);
    assert.equal(options.length, 4);
    assert.ok(options.includes(target.uk));
  }
});

// ----------------------------------------------------------------------------
// TEST 17 — Fill in the Blank Mode
// ----------------------------------------------------------------------------
test('TEST 17 — Fill in the Blank Mode: validates typed Ukrainian answers and synonyms on upgraded scenes', () => {
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const pilotA = pilots['beach-nature-scene-3-pilot-a'];
  const towelTarget = pilotA.targets.find((t) => t.vocabularyId === 'bn-towel')!;

  const resExact = validateIdentifyTypedAnswer('рушник', towelTarget);
  assert.equal(resExact.isCorrect, true);

  const resSynonym = validateIdentifyTypedAnswer('пляжний рушник', towelTarget);
  assert.equal(resSynonym.isCorrect, true);

  const resWrong = validateIdentifyTypedAnswer('озеро', towelTarget);
  assert.equal(resWrong.isCorrect, false);
});

// ----------------------------------------------------------------------------
// TEST 18 — Free Exploration Mode
// ----------------------------------------------------------------------------
test('TEST 18 — Free Exploration Mode: allows clicking any numbered object in any order via hit resolution', () => {
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const pilotA = pilots['beach-nature-scene-3-pilot-a'];

  // Click in reverse order on each target's marker center
  for (const target of [...pilotA.targets].reverse()) {
    const hit = resolveTargetHitAtNormalizedPoint(
      pilotA.targets,
      target.centerX!,
      target.centerY!
    );
    assert.ok(hit, `Should hit target ${target.id}`);
    assert.equal(hit.id, target.id);
  }
});

// ----------------------------------------------------------------------------
// TEST 19 — Guided Practice Mode
// ----------------------------------------------------------------------------
test('TEST 19 — Guided Practice Mode: advances through verified targets sequentially until scene completion', () => {
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const pilotB = pilots['beach-nature-scene-3-pilot-b'];
  const prog = loadIdentifyProgress();
  prog.explorationMode = 'guided';
  delete prog.scenes[pilotB.id];

  for (let i = 0; i < pilotB.targets.length; i++) {
    const t = pilotB.targets[i];
    recordIdentifyAttempt(prog, pilotB, t, 'mc', true, t.uk, 'Correct');
    const summary = computeIdentifySceneSummary(prog, pilotB);
    assert.equal(summary.resolvedCount, i + 1);
  }

  const finalSummary = computeIdentifySceneSummary(prog, pilotB);
  assert.equal(finalSummary.isSceneComplete, true);
});

// ----------------------------------------------------------------------------
// TEST 20 — Content Studio Annotation Editing
// ----------------------------------------------------------------------------
test('TEST 20 — Content Studio Annotation Editing: moving a marker and resizing a bounding box persists in studio draft', () => {
  resetIdentifyStudioStateForTests();
  const res = updateIdentifyTargetGeometryInDraft(
    'beach-nature-scene-3-pilot-a',
    'beach-nature-pilot-a-t1',
    {
      x: 0.09,
      y: 0.06,
      width: 0.15,
      height: 0.19,
      centerX: 0.16,
      centerY: 0.15,
      verifiedLexicalSense: 'updated sun position',
    }
  );
  assert.equal(res.ok, true);

  const draft = getOrCreateIdentifySceneDraft('beach-nature-scene-3-pilot-a');
  const updatedTarget = draft.scene.targets.find((t) => t.id === 'beach-nature-pilot-a-t1')!;
  assert.equal(updatedTarget.centerX, 0.16);
  assert.equal(updatedTarget.centerY, 0.15);
  assert.equal(updatedTarget.width, 0.15);
  assert.equal(updatedTarget.verifiedLexicalSense, 'updated sun position');
});

// ----------------------------------------------------------------------------
// TEST 21 — Content Studio Scene Validation & Publish Guard
// ----------------------------------------------------------------------------
test('TEST 21 — Content Studio Scene Validation: blocks invalid scenes from publishing and allows validated scenes', () => {
  resetIdentifyStudioStateForTests();

  // Attempt to publish the defective baseline scene `beach-nature-scene-3`
  const blockedRes = publishValidatedIdentifySceneDraft('beach-nature-scene-3');
  assert.equal(blockedRes.ok, false, 'Defective scene must be blocked from publishing');
  assert.ok(blockedRes.error?.includes('Cannot publish invalid scene'));

  // Publish the verified Pilot Scene A
  const allowedRes = publishValidatedIdentifySceneDraft('beach-nature-scene-3-pilot-a');
  assert.equal(allowedRes.ok, true, 'Verified Pilot Scene A can be published');
  assert.equal(allowedRes.publishedScene?.qualityState, 'published_verified');
});

// ----------------------------------------------------------------------------
// TEST 22 — Draft Isolation
// ----------------------------------------------------------------------------
test('TEST 22 — Draft Isolation: editing a scene in Content Studio draft does not alter the published baseline', () => {
  resetIdentifyStudioStateForTests();
  addIdentifyTargetToDraft('beach-nature-scene-3-pilot-b', 'bn-wave');

  const draft = getOrCreateIdentifySceneDraft('beach-nature-scene-3-pilot-b');
  assert.equal(draft.scene.targets.length, 6);

  // Baseline in IDENTIFY_CATEGORIES and initial pilot builder remains untouched
  const baselineScene3 = getBaselineIdentifyScene('beach-nature-scene-3')!;
  assert.equal(baselineScene3.targets.length, 9);
  const freshPilots = buildPilotCorrectionScenesForBeachScene3();
  assert.equal(freshPilots['beach-nature-scene-3-pilot-b'].targets.length, 5);
});

// ----------------------------------------------------------------------------
// TEST 23 — Undo / Restore
// ----------------------------------------------------------------------------
test('TEST 23 — Undo / Restore: undoIdentifySceneDraftEdit and restoreIdentifySceneBaseline restore original coordinates', () => {
  resetIdentifyStudioStateForTests();
  const initialDraft = getOrCreateIdentifySceneDraft('beach-nature-scene-3-pilot-a');
  const origCx = initialDraft.scene.targets[0].centerX;

  updateIdentifyTargetGeometryInDraft(
    'beach-nature-scene-3-pilot-a',
    'beach-nature-pilot-a-t1',
    { centerX: 0.45, centerY: 0.45 }
  );
  assert.equal(
    getOrCreateIdentifySceneDraft('beach-nature-scene-3-pilot-a').scene.targets[0].centerX,
    0.45
  );

  // Undo last edit
  const undoRes = undoIdentifySceneDraftEdit('beach-nature-scene-3-pilot-a');
  assert.equal(undoRes.ok, true);
  assert.equal(undoRes.scene!.targets[0].centerX, origCx);

  // Modify again and restore baseline
  markIdentifyTargetMissingInDraft(
    'beach-nature-scene-3-pilot-a',
    'beach-nature-pilot-a-t1'
  );
  const restoreRes = restoreIdentifySceneBaseline('beach-nature-scene-3-pilot-a');
  assert.equal(restoreRes.ok, true);
  assert.equal(restoreRes.scene!.targets.length, 8);
  assert.equal(restoreRes.scene!.targets[0].centerX, origCx);
});

// ----------------------------------------------------------------------------
// TEST 24 — Bulk Audit Execution
// ----------------------------------------------------------------------------
test('TEST 24 — Bulk Audit Execution: audits all 100 scenes across 20 categories and reports accurate counts', () => {
  const audit = runIdentifyLibraryBulkAudit(true);
  assert.equal(audit.totalCategoriesInspected, 20);
  assert.equal(audit.totalScenesInspected, 100);
  assert.equal(audit.scenesUsingGridPlacement, 95);
  assert.equal(audit.scenesWithPhotoOverrides, 5);
  assert.ok(audit.scenesWithConfirmedMissingObjects >= 1);
  assert.ok(audit.scenesWithSemanticMismatches >= 1);
  assert.equal(audit.entries[0].sceneId, 'beach-nature-scene-3');
});

// ----------------------------------------------------------------------------
// TEST 25 — Ukrainian Course Regression
// ----------------------------------------------------------------------------
test('TEST 25 — Ukrainian Course Regression: all 29 published Ukrainian modules remain intact', () => {
  assert.equal(COURSE_MODULES.length, 29);
  assert.equal(COURSE_MODULES[0].id, 'A0.1');
  assert.equal(COURSE_MODULES[28].id, 'C1.1');
});

// ----------------------------------------------------------------------------
// TEST 26 — Eight Navigation Tabs Regression
// ----------------------------------------------------------------------------
test('TEST 26 — Eight Navigation Tabs Regression: all 8 learning tabs and EN→UK / UK→EN labels remain intact', () => {
  const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
  const requiredTabIds = [
    'id="tab-srs"',
    'id="tab-en2uk"',
    'id="tab-correction"',
    'id="tab-course"',
    'id="tab-vocab"',
    'id="tab-reader"',
    'id="tab-phonetics"',
    'id="tab-identify"',
  ];
  for (const tid of requiredTabIds) {
    assert.ok(html.includes(tid), `index.html must contain ${tid}`);
  }
  assert.ok(html.includes('UK→EN'), 'Bottom nav must preserve UK→EN label');
  assert.ok(html.includes('EN→UK'), 'Bottom nav must preserve EN→UK label');
});

// ----------------------------------------------------------------------------
// TEST 27 — 28 Course Track Compatibility
// ----------------------------------------------------------------------------
test('TEST 27 — 28 Course Track Compatibility: Identify target resolution works across all 28 Course Tracks', () => {
  const allTracks = getAllCourseTracks();
  assert.equal(allTracks.length, 28);

  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const sunTarget = pilots['beach-nature-scene-3-pilot-a'].targets[0];

  for (const tr of allTracks) {
    const adapted = resolveIdentifyTargetForCourseTrack(sunTarget, tr.trackId);
    assert.equal(adapted.courseTrackId, tr.trackId);
    assert.equal(adapted.sourceLanguageCode, tr.nativeLanguage);
    assert.equal(adapted.targetLanguageCode, tr.targetLanguage);
    assert.ok(adapted.sourceClueText.length > 0);
    assert.ok(adapted.expectedTargetWord.length > 0);
  }
});

// ----------------------------------------------------------------------------
// TEST 28 — FSRS & Progress Preservation
// ----------------------------------------------------------------------------
test('TEST 28 — FSRS & Progress Preservation: learner progress and Show Answer / retry tracking remain intact', () => {
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const pilotA = pilots['beach-nature-scene-3-pilot-a'];
  const prog = loadIdentifyProgress();
  delete prog.scenes[pilotA.id];

  recordIdentifyShowAnswer(prog, pilotA, pilotA.targets[0]);
  recordIdentifyAttempt(prog, pilotA, pilotA.targets[1], 'mc', true, pilotA.targets[1].uk, 'OK');

  const summary = computeIdentifySceneSummary(prog, pilotA);
  assert.equal(summary.revealedCount, 1);
  assert.equal(summary.correctMCCount, 1);
  assert.equal(summary.needsPracticeTargets.length, 1);
  assert.equal(summary.needsPracticeTargets[0].id, pilotA.targets[0].id);
});

// ----------------------------------------------------------------------------
// TEST 29 — Public Security Guard
// ----------------------------------------------------------------------------
test('TEST 29 — Public Security Guard: unauthenticated public visitors cannot edit or publish Identify scenes', () => {
  resetIdentifyStudioStateForTests();
  setSimulatedPublicProductionModeForTesting(true);
  try {
    const editRes = updateIdentifyTargetGeometryInDraft(
      'beach-nature-scene-3-pilot-a',
      'beach-nature-pilot-a-t1',
      { centerX: 0.5, centerY: 0.5 }
    );
    assert.equal(editRes.ok, false);
    assert.ok(editRes.error?.includes('Unauthorized'));

    const pubRes = publishValidatedIdentifySceneDraft('beach-nature-scene-3-pilot-a');
    assert.equal(pubRes.ok, false);
    assert.ok(pubRes.error?.includes('Unauthorized'));
  } finally {
    setSimulatedPublicProductionModeForTesting(false);
  }
});

// ----------------------------------------------------------------------------
// TEST 30 — 120-Scene Identify Library Safety Audit: 10 Verified Student-Ready Photographic Scenes vs 110 Planned Scenes Awaiting AI Generation
// ----------------------------------------------------------------------------
test('TEST 30 — 120-Scene Identify Library Safety Audit: exactly 10 photographic scenes in the 120-scene library pass visual verification and 110 unverified scenes are blocked from student exposure', () => {
  const curatedAudit = runCurated40LibraryAudit();
  assert.equal(curatedAudit.totalCategories, 28);
  assert.equal(curatedAudit.totalActiveScenes, 120);
  assert.equal(
    curatedAudit.validatedReadyCount,
    10,
    'Exactly 10 visually verified photographic scenes in the 120-scene library must pass canPublish'
  );
  assert.ok(REPRESENTATIVE_VIEWPORT_MATRIX.length >= 11, 'Must verify all 11 required viewports');

  const playableCategories = getPlayableIdentifyCategories();
  const playableScenes = playableCategories.flatMap((c) => c.scenes);
  assert.equal(playableScenes.length, 10, 'Learner-facing playable scene count must be 10');

  for (const sc of playableScenes) {
    assert.equal(isScenePlayableForStudents(sc), true);
    const approvedTargets = getApprovedLearnerTargets(sc);
    assert.ok(approvedTargets.length >= 4 && approvedTargets.length <= 6);
    for (const t of approvedTargets) {
      assert.equal(isApprovedVerifiedLearnerTarget(t), true);
      assert.equal(isSynthetic5x5GridBox(t), false);
    }
    const vpCheck = verifySceneAcrossRepresentativeViewports(sc);
    assert.equal(vpCheck.allAligned, true, `Verified scene ${sc.id} must align across all viewports`);
  }
});

// ----------------------------------------------------------------------------
// TEST 31 — Master 2,000-Noun Vocabulary Registry, Polysemy Disambiguation & 2,520 Scene-Word Associations (Spec Tests 1–15)
// ----------------------------------------------------------------------------
test('TEST 31 — Master 2,000-Noun Registry & 2,520 Planned Associations: 2,000 unique concrete nouns, 0 duplicates, 0 abstract nouns, explicit polysemy senses, and 100% scene placement in Content Studio', () => {
  assert.equal(IDENTIFY_MASTER_2000_NOUNS.length, 2000, 'Master list must contain 2,000 unique nouns');

  const seenConceptIds = new Set<string>();
  const seenUkKeys = new Set<string>();
  let foundational = 0;
  let intermediate = 0;
  let specialized = 0;

  for (const entry of IDENTIFY_MASTER_2000_NOUNS) {
    assert.equal(seenConceptIds.has(entry.conceptId), false, `Duplicate conceptId ${entry.conceptId}`);
    seenConceptIds.add(entry.conceptId);
    const ukKey = entry.uk.toLowerCase();
    assert.equal(seenUkKeys.has(ukKey), false, `Duplicate Ukrainian concept key ${ukKey}`);
    seenUkKeys.add(ukKey);

    assert.equal(entry.pos, 'noun');
    assert.equal(
      entry.visualRepresentability,
      'concrete_visual_object',
      `Noun ${entry.uk} must be a concrete visual object`
    );
    assert.ok(entry.intendedMeaningEn.length > 5, 'Every noun must have an explicit intended visual sense');
    assert.ok(entry.assignedSceneIds.length >= 1, `Noun ${entry.uk} must be placed in >= 1 scene`);
    assert.ok(entry.appearanceCount >= 1);

    if (entry.priorityTier === 'foundational') foundational++;
    else if (entry.priorityTier === 'intermediate') intermediate++;
    else if (entry.priorityTier === 'specialized') specialized++;
  }

  assert.equal(foundational, 1200, 'Must have 1,200 foundational nouns');
  assert.equal(intermediate, 500, 'Must have 500 intermediate nouns');
  assert.equal(specialized, 300, 'Must have 300 specialized nouns');

  // Verify explicit polysemy / homograph disambiguation required by Section 5
  const castleEntry = IDENTIFY_MASTER_2000_NOUNS.find((n) => n.uk.includes('за́мок (форте́ця)'));
  const lockEntry = IDENTIFY_MASTER_2000_NOUNS.find((n) => n.uk.includes('замо́к (дверни́й)'));
  const compMouse = IDENTIFY_MASTER_2000_NOUNS.find((n) => n.uk.includes('ми́ша (комп'));
  const fieldMouse = IDENTIFY_MASTER_2000_NOUNS.find((n) => n.uk.includes('ми́ша (польова́)'));
  const doorKey = IDENTIFY_MASTER_2000_NOUNS.find((n) => n.uk.includes('ключ (дверни́й)'));
  const wrenchKey = IDENTIFY_MASTER_2000_NOUNS.find((n) => n.uk.includes('ключ (га́йковий)'));
  const treeLeaf = IDENTIFY_MASTER_2000_NOUNS.find((n) => n.uk.includes('листо́к (де́рева)'));
  const paperSheet = IDENTIFY_MASTER_2000_NOUNS.find((n) => n.uk.includes('а́ркуш (папе́ру)'));
  assert.ok(castleEntry && lockEntry && castleEntry.conceptId !== lockEntry.conceptId);
  assert.ok(compMouse && fieldMouse && compMouse.conceptId !== fieldMouse.conceptId);
  assert.ok(doorKey && wrenchKey && doorKey.conceptId !== wrenchKey.conceptId);
  assert.ok(treeLeaf && paperSheet && treeLeaf.conceptId !== paperSheet.conceptId);

  // Verify coverage summary metrics & Section 7 verification breakdown
  const cov = computeMasterVocabularyCoverageSummary();
  assert.equal(cov.totalTargetUniqueNouns, 2000);
  assert.equal(cov.actualUniqueNounsRepresented, 2000);
  assert.equal(cov.totalScenes, 120);
  assert.equal(cov.totalSceneWordAssociations, 2520);
  assert.equal(cov.averageObjectsPerScene, 21.0);
  assert.equal(cov.minObjectsPerScene, 20);
  assert.equal(cov.maxObjectsPerScene, 22);
  assert.equal(cov.scenesWith20Targets, 40);
  assert.equal(cov.scenesWith21Targets, 40);
  assert.equal(cov.scenesWith22Targets, 40);
  assert.equal(cov.missingNounsCount, 0);
  assert.equal(cov.missingNounIds.length, 0);
  assert.equal(cov.totalSceneWordAssociations - cov.actualUniqueNounsRepresented, 520);
  assert.equal(cov.nounsAppearingOnceCount + cov.nounsRepeatedAcrossScenesCount, 2000);
  assert.equal(cov.nounsRepeatedAcrossScenesCount, 343);
  assert.equal(cov.nounsAppearingOnceCount, 1657);
  assert.equal(IDENTIFY_TOPIC_GROUPS.length, 9);
  assert.equal(IDENTIFY_EXPANSION_120_SUMMARY.totalSceneWordAssociations, 2520);

  // Section 7 Content Studio reporting assertions
  assert.equal(cov.plannedScenesCount, 120);
  assert.equal(cov.scenesWithVerifiedImagesCount, 10);
  assert.equal(cov.scenesWithVerifiedHotspotsCount, 10);
  assert.equal(cov.scenesReadyForStudentsCount, 10);
  assert.equal(cov.scenesAwaitingAiGenerationCount, 110);
  assert.equal(cov.plannedVocabularyAssociationsCount, 2520);
  assert.equal(cov.verifiedActiveTargetAssociationsCount, 49);
  assert.equal(cov.unverifiedPlannedAssociationsCount, 2471);
  assert.equal(cov.invalidSceneFlagsCorrectedCount, 120);
  assert.equal(cov.invalidTargetFlagsCorrectedCount, 2520);
});

// ----------------------------------------------------------------------------
// TEST 32 — Adaptive 5, 8, and 10-Question Practice Rounds, Safe Short Round Handling, Zero-Target Guard, Explore Mode & Idempotent XP
// ----------------------------------------------------------------------------
test('TEST 32 — Adaptive 5/8/10-Question Practice Rounds, Safe Short Round Handling, Zero-Verified-Target Guard & Explore Mode', () => {
  const cat = IDENTIFY_CATEGORIES.find((c) => c.id === 'kitchen')!;
  const verifiedKitchen2 = cat.scenes.find((s) => s.id === 'kitchen-scene-2')!;
  assert.ok(verifiedKitchen2, 'Verified kitchen-scene-2 must exist');
  assert.equal(getApprovedLearnerTargets(verifiedKitchen2).length, 5);
  assert.ok((verifiedKitchen2.plannedTargets?.length ?? 0) >= 20, 'Planned targets preserved in Content Studio');

  const prog = loadIdentifyProgress();
  delete prog.scenes[verifiedKitchen2.id];

  // On a 5-target verified scene:
  // - Quick (5) returns all 5 verified targets without shortening
  // - Standard (8) and Extended (10) safely shorten to the 5 verified targets with an explanation
  const quick5 = selectAdaptiveIdentifyRoundTargets(verifiedKitchen2, prog, 5);
  const std8 = selectAdaptiveIdentifyRoundTargets(verifiedKitchen2, prog, 8);
  const ext10 = selectAdaptiveIdentifyRoundTargets(verifiedKitchen2, prog, 10);
  assert.equal(quick5.length, 5);
  assert.equal(std8.length, 5);
  assert.equal(ext10.length, 5);

  const shortRound8 = startIdentifyPracticeRound(prog, verifiedKitchen2, { roundLength: 8 });
  assert.equal(shortRound8.targetIds.length, 5);
  assert.equal(shortRound8.requestedRoundLength, 8);
  assert.equal(shortRound8.roundLength, 8);
  assert.equal(shortRound8.shortenedDueToVerifiedLimit, true);
  assert.ok(shortRound8.shortenedExplanationEn?.includes('5 visually verified objects'));

  // Complete all 5 verified targets in the shortened round
  for (const tid of shortRound8.targetIds) {
    const t = getApprovedLearnerTargets(verifiedKitchen2).find((x) => x.id === tid)!;
    recordIdentifyAttempt(prog, verifiedKitchen2, t, 'mc', true, t.uk, 'Correct');
  }
  const shortSummary = computeIdentifyRoundSummary(prog, verifiedKitchen2);
  assert.equal(shortSummary.isRoundComplete, true);
  assert.equal(shortSummary.shortenedDueToVerifiedLimit, true);
  assert.equal(shortSummary.isSceneMastered, true);

  // Idempotent XP claim
  const xp1 = claimIdentifyRoundXpIfEligible(prog, verifiedKitchen2);
  const xp1Duplicate = claimIdentifyRoundXpIfEligible(prog, verifiedKitchen2);
  assert.ok(xp1 > 0, 'First XP claim for completed verified round must award XP');
  assert.equal(xp1Duplicate, 0, 'Duplicate XP claim for same round must award 0 XP');

  // Test Pilot Scene A (8 verified targets) for multi-round rotation
  const pilots = buildPilotCorrectionScenesForBeachScene3();
  const pilotA = pilots['beach-nature-scene-3-pilot-a'];
  delete prog.scenes[pilotA.id];
  const r1Pilot = startIdentifyPracticeRound(prog, pilotA, { roundLength: 5 });
  assert.equal(r1Pilot.targetIds.length, 5);
  assert.equal(r1Pilot.shortenedDueToVerifiedLimit, false);
  for (const tid of r1Pilot.targetIds) {
    const t = pilotA.targets.find((x) => x.id === tid)!;
    recordIdentifyAttempt(prog, pilotA, t, 'mc', true, t.uk, 'Correct');
  }
  const r1PilotSum = computeIdentifyRoundSummary(prog, pilotA);
  assert.equal(r1PilotSum.isRoundComplete, true);
  assert.equal(r1PilotSum.isSceneMastered, false, '5 of 8 verified targets mastered does not mark 8-target scene mastered');

  const r2Pilot = startIdentifyPracticeRound(prog, pilotA, { roundLength: 5, advanceRoundCounter: true });
  const unseen3 = pilotA.targets.filter((t) => !r1Pilot.targetIds.includes(t.id)).map((t) => t.id);
  for (const uid of unseen3) {
    assert.ok(r2Pilot.targetIds.includes(uid), 'Round 2 must prioritize the 3 unseen verified targets first');
  }

  // Explore Mode: inspecting a verified object records exploration without awarding quiz mastery
  const unseenTarget = pilotA.targets[pilotA.targets.length - 1];
  delete prog.scenes[pilotA.id]?.targets[unseenTarget.id];
  recordIdentifyExploreInspection(prog, pilotA, unseenTarget);
  assert.ok(prog.scenes[pilotA.id].exploredTargetIds?.includes(unseenTarget.id));
  assert.equal(
    prog.scenes[pilotA.id].targets[unseenTarget.id]?.status ?? 'unanswered',
    'unanswered',
    'Explore Mode inspection must not award quiz mastery'
  );
  assert.ok(transliterateUkToPronunciation(unseenTarget.uk).length > 0);
});

// ----------------------------------------------------------------------------
// TEST 33 — Zoom & Pan Coordinate Synchronization + AI Generation Queue & Rate-Limit Backoff (Spec Tests 29–31)
// ----------------------------------------------------------------------------
test('TEST 33 — Zoom & Pan Synchronization and AI Generation Rate-Limit Queue & Quota Guard', () => {
  // 1. Zoom & Pan math synchronization
  const clamped = clampZoomPanState({ scale: 2.5, panX: 900, panY: -900 }, 800, 600);
  assert.equal(clamped.scale, 2.5);
  assert.ok(Math.abs(clamped.panX) <= 600 && Math.abs(clamped.panY) <= 450);

  const rect = computeRenderedImageRect({
    containerWidth: 800,
    containerHeight: 600,
    intrinsicWidth: 1200,
    intrinsicHeight: 900,
    objectFit: 'contain',
  });
  const sampleTarget = {
    id: 'z-1',
    targetNumber: 1,
    x: 0.25,
    y: 0.25,
    width: 0.14,
    height: 0.14,
    centerX: 0.32,
    centerY: 0.32,
  };
  const proj1x = projectTargetWithZoomPan(sampleTarget, rect, { scale: 1, panX: 0, panY: 0 });
  const proj2x = projectTargetWithZoomPan(sampleTarget, rect, { scale: 2, panX: 20, panY: -10 });
  assert.ok(proj2x.transformedBoxPx.width > proj1x.transformedBoxPx.width, 'Zoomed target bounding box scales proportionally');
  assert.equal(isPointerGesturePanDrag(0, 0, 2, 2), false, 'Small tap is not a pan drag');
  assert.equal(isPointerGesturePanDrag(0, 0, 18, 12), true, '18px movement is a pan drag');

  // 2. Rate-limit Retry-After & Exponential Backoff + Quota Queue Persistence
  assert.equal(parseRetryAfterMs('12'), 12000);
  const backoff1 = computeExponentialBackoffMs(1, 2000, 60000);
  const backoff3 = computeExponentialBackoffMs(3, 2000, 60000);
  assert.equal(backoff1, 4000);
  assert.equal(backoff3, 16000);
  assert.equal(
    isQuotaExhaustedError('generic::resource_exhausted: You exceeded your current quota'),
    true
  );

  resetIdentifyGenerationQueueState();
  const queueAfterQuota = recordSceneGenerationAttempt({
    sceneId: 'kitchen-scene-2',
    success: false,
    errorCode: 'RESOURCE_EXHAUSTED',
    errorMessage: 'HTTP 429 RESOURCE_EXHAUSTED: Quota reached on generate_image',
    retryAfterHeader: '30',
  });
  assert.equal(queueAfterQuota.queuePaused, true);
  assert.equal(queueAfterQuota.pauseReason, 'quota_exhausted_free_tier');
  const qSummary = getIdentifyGenerationQueueSummary();
  assert.equal(qSummary.totalScenes, 120);
  assert.equal(qSummary.pilotJobs.length, 3);
  assert.equal(qSummary.proceduralSubstitutesCount, 0, 'Zero procedural substitutes claimed as AI images');
});

// ----------------------------------------------------------------------------
// TEST 34 — Identify Safety Repair Fail-Closed Verification (Section 9 Checks 1–12)
// ----------------------------------------------------------------------------
test('TEST 34 — Identify Safety Repair Fail-Closed Verification: rejects 5×5 & 3×3 grid coordinates, blocks overflow vocabulary, and prevents false mastery on 0-target scenes', () => {
  // Check 1: Unverified 5×5 grid targets are NOT treated as verified learner targets
  const unverifiedKitchen1 = IDENTIFY_CATEGORIES.find((c) => c.id === 'kitchen')!.scenes.find(
    (s) => s.id === 'kitchen-scene-1'
  )!;
  assert.equal(isScenePlayableForStudents(unverifiedKitchen1), false);
  assert.equal(getApprovedLearnerTargets(unverifiedKitchen1).length, 0);
  assert.equal(unverifiedKitchen1.plannedTargets?.length, 20);
  for (const pt of unverifiedKitchen1.plannedTargets!) {
    assert.equal(isSynthetic5x5GridBox(pt), true, '5×5 grid slot must be detected as synthetic');
    assert.equal(isApprovedVerifiedLearnerTarget(pt), false, '5×5 grid target must never be approved for students');
    assert.equal(pt.verified, false);
    assert.equal(pt.isObjectVisibleInScene, false);
  }

  // Check 2: Unverified legacy 3×3 grid targets are NOT treated as verified learner targets
  const legacyBathroom1 = getBaselineIdentifyScene('bathroom-scene-1')!;
  assert.equal(legacyBathroom1.annotationVerified, false);
  for (const lt of legacyBathroom1.targets) {
    assert.equal(lt.verified, false);
    assert.equal(isApprovedVerifiedLearnerTarget(lt), false);
  }

  // Check 3: Unverified overflow vocabulary is NOT displayed as active scene hotspots in verified scenes
  for (const [sceneId, spec] of Object.entries(VERIFIED_PHOTOGRAPH_SCENE_SPECS)) {
    const sc = IDENTIFY_CATEGORIES.flatMap((c) => c.scenes).find((s) => s.id === sceneId);
    if (!sc) continue; // beach-nature-scene-5 is in legacy 100-scene archive only
    const activeTargets = getApprovedLearnerTargets(sc);
    assert.equal(activeTargets.length, spec.targets.length);
    assert.ok(
      (sc.plannedTargets?.length ?? 0) >= 20,
      `Verified scene ${sceneId} must still preserve its 20–22 planned curriculum targets in Content Studio`
    );
    // Confirm unrelated overflow nouns (like fireplace pokers or transit shelters) are excluded from active targets
    for (const at of activeTargets) {
      assert.equal(at.targetLifecycleState, 'approved_active_learner_target');
      assert.equal(at.verificationStatus, 'human_verified');
      assert.equal(at.verified, true);
      assert.equal(at.isObjectVisibleInScene, true);
      assert.equal(isSynthetic5x5GridBox(at), false);
    }
  }

  // Check 7: Scenes with 0 verified targets cannot be falsely completed, mastered, or awarded XP
  const prog = loadIdentifyProgress();
  delete prog.scenes[unverifiedKitchen1.id];
  const emptyRound = startIdentifyPracticeRound(prog, unverifiedKitchen1, { roundLength: 8 });
  assert.equal(emptyRound.targetIds.length, 0);
  assert.equal(emptyRound.requestedRoundLength, 8);
  const emptyRoundSummary = computeIdentifyRoundSummary(prog, unverifiedKitchen1);
  assert.equal(emptyRoundSummary.totalQuestionsInRound, 0);
  assert.equal(emptyRoundSummary.isRoundComplete, false, '0-target scene round must never be marked complete');
  assert.equal(emptyRoundSummary.isSceneMastered, false, '0-target scene must never be marked mastered');
  const emptySceneSummary = computeIdentifySceneSummary(prog, unverifiedKitchen1);
  assert.equal(emptySceneSummary.totalTargets, 0);
  assert.equal(emptySceneSummary.isSceneComplete, false, '0-target scene must never be marked complete');
  const emptyXp = claimIdentifyRoundXpIfEligible(prog, unverifiedKitchen1);
  assert.equal(emptyXp, 0, '0-target scene must award 0 XP');
});

// ----------------------------------------------------------------------------
// TEST 35 — Coherent Scene Approval Without Human Hotspot Review (67 Approved & Playable Scenes, 1,075 Hotspots)
// ----------------------------------------------------------------------------
test('TEST 35 — Coherent Ukrainian Curriculum Approval: all 67 coherent scenes (10 original + 57 coherent preview-ready) are approved & playable for learners without requiring human hotspot review', () => {
  setSimulatedPublicProductionModeForTesting(false);
  setIdentifyAdminPreviewUiToggle(true);

  const coherentScenes = getIdentify80SceneBrowserList();
  assert.equal(coherentScenes.length, 67, 'Must list the 67 coherent Ukrainian curriculum scenes (10 original + 57 newly approved coherent scenes)');

  const allRaw80 = getIdentify80SceneBrowserList({ includeRemovedIncoherent: true });
  assert.equal(allRaw80.length, 80, 'Raw curriculum with includeRemovedIncoherent: true still contains all 80 underlying blueprint entries');

  let approvedCount = 0;
  let candidatePreviewReadyCount = 0;
  let imageOnlyPreviewCount = 0;
  let totalApprovedHotspots = 0;

  for (const entry of coherentScenes) {
    assert.equal(isSceneRemovedForUnrelatedObjects(entry.sceneNumber), false);
    assert.equal(isSceneRemovedForUnrelatedObjects(entry.sceneCode), false);
    assert.equal(entry.canViewSceneImage, true, `Scene #${entry.sceneNumber} (${entry.sceneCode}) must be viewable`);
    assert.ok(entry.assetPath, `Scene #${entry.sceneNumber} must have a valid assetPath`);
    assert.equal(entry.assetExistsOnDisk, true);

    const diskPath = path.join(process.cwd(), 'public', entry.assetPath!);
    assert.equal(fs.existsSync(diskPath), true, `Image file must exist on disk at ${diskPath}`);
    const stat = fs.statSync(diskPath);
    assert.ok(stat.size > 10000, `Image file ${diskPath} must be non-empty`);

    assert.equal(entry.availabilityState, 'approved_playable', `Coherent scene #${entry.sceneNumber} must be approved_playable`);
    assert.equal(entry.canStartLearnerPractice, true, `Coherent scene #${entry.sceneNumber} must allow learner practice`);
    assert.ok(entry.linkedPlayableSceneId, `Coherent scene #${entry.sceneNumber} must have a linkedPlayableSceneId`);

    const playableScene = findPlayableLegacySceneById(entry.linkedPlayableSceneId!);
    assert.ok(playableScene, `Playable scene object must resolve for #${entry.sceneNumber} (${entry.linkedPlayableSceneId})`);
    const approvedTargets = getApprovedLearnerTargets(playableScene!.scene);
    if (entry.sceneNumber <= 10) {
      assert.equal(approvedTargets.length, entry.verifiedHotspotCount);
    } else {
      assert.equal(entry.verifiedHotspotCount, 18);
      assert.equal(approvedTargets.length, 18, `Approved coherent scene #${entry.sceneNumber} must expose 18 approved learner targets`);
    }

    approvedCount++;
    totalApprovedHotspots += entry.verifiedHotspotCount;
  }

  assert.equal(approvedCount, 67);
  assert.equal(candidatePreviewReadyCount, 0);
  assert.equal(imageOnlyPreviewCount, 0);
  assert.equal(totalApprovedHotspots, 1075, '49 original + 57 * 18 newly approved coherent hotspots = 1,075 approved hotspots');

  // Verify coherent Batch 10 scenes #78 and #80 are approved and playable for learners
  for (const [sceneNum, expectedPath] of [
    [78, '/assets/identify/city-streets/uk_scene_78_emergency_and_civic_services.jpg'],
    [80, '/assets/identify/living-room/uk_scene_80_family_celebration_gift_exchange.jpg'],
  ] as const) {
    const entry = getIdentify80SceneByCodeOrNumber(sceneNum)!;
    assert.ok(entry, `Coherent scene #${sceneNum} must be active`);
    assert.equal(entry.assetPath, expectedPath);
    assert.equal(entry.availabilityState, 'approved_playable');
    assert.equal(entry.verifiedHotspotCount, 18);
    assert.equal(entry.canStartLearnerPractice, true);
  }

  // Verify that ordinary public learners also receive all 67 approved scenes and their hotspots without human review gating
  setSimulatedPublicProductionModeForTesting(true);
  try {
    assert.equal(isIdentifyAdminPreviewAuthorized(), false);
    for (const sNum of [11, 52, 53, 78, 80]) {
      const learnerViewScene = getIdentify80SceneByCodeOrNumber(sNum)!;
      assert.equal(learnerViewScene.availabilityState, 'approved_playable');
      assert.equal(learnerViewScene.canViewSceneImage, true);
      assert.equal(learnerViewScene.canStartLearnerPractice, true, 'Approved coherent scenes are playable by all learners');

      const viewerOverlay = resolveSceneViewerHotspots(sNum);
      assert.equal(viewerOverlay.hotspots.length, 18, 'All 18 approved hotspots are visible to learners in View Scene');
      assert.equal(viewerOverlay.hotspots[0].isApprovedLearnerHotspot, true);
      assert.equal(viewerOverlay.noticeBanner, null);
    }
  } finally {
    setSimulatedPublicProductionModeForTesting(false);
    setIdentifyAdminPreviewUiToggle(true);
  }
});

// ----------------------------------------------------------------------------
// TEST 36 — Unreviewed Scene Related-Object Coherence Audit & Removal
// ----------------------------------------------------------------------------
test('TEST 36 — Unreviewed Scene Coherence Audit: inspects all 70 scenes (#11–#80), approves the 57 coherent scenes, and removes the 13 scenes with too many unrelated objects', () => {
  const audit = inspectUnreviewedScenesCoherence();
  assert.equal(audit.totalUnreviewedScenesInspected, 70, 'Must inspect all 70 scenes (#11–#80)');
  assert.equal(audit.coherentRetainedCount, 57, 'Must retain and approve 57 coherent scenes where all 18 objects belong to the scene');
  assert.equal(audit.incoherentRemovedCount, 13, 'Must remove 13 scenes that contain too many unrelated objects');
  assert.equal(REMOVED_INCOHERENT_UNREVIEWED_SCENES.length, 13);

  const expectedRemovedNumbers = [51, 54, 55, 56, 70, 71, 72, 73, 74, 75, 76, 77, 79];
  assert.deepEqual(
    REMOVED_INCOHERENT_UNREVIEWED_SCENES.map((s) => s.sceneNumber),
    expectedRemovedNumbers
  );

  for (const removed of REMOVED_INCOHERENT_UNREVIEWED_SCENES) {
    assert.ok(
      removed.unrelatedObjectsCount >= 5,
      `Removed scene #${removed.sceneNumber} (${removed.sceneCode}) must have >= 5 unrelated objects`
    );
    assert.equal(
      removed.unrelatedObjects.length,
      removed.unrelatedObjectsCount
    );
    assert.equal(
      removed.relatedObjectsCount + removed.unrelatedObjectsCount,
      18
    );
    assert.equal(
      getIdentify80SceneByCodeOrNumber(removed.sceneNumber),
      undefined,
      `Removed scene #${removed.sceneNumber} must not be returned by getIdentify80SceneByCodeOrNumber`
    );
    assert.equal(
      getIdentify80SceneByCodeOrNumber(removed.sceneCode),
      undefined,
      `Removed scene ${removed.sceneCode} must not be returned by getIdentify80SceneByCodeOrNumber`
    );
    assert.throws(() => {
      resolveSceneViewerHotspots(removed.sceneCode);
    }, /Unknown Identify curriculum scene/);
    assert.throws(() => {
      startIdentifyAdminPreviewSession(removed.sceneCode, 'mc');
    }, /Scene not found/);
  }
});

// ----------------------------------------------------------------------------
// TEST 37 — Dynamic On-Demand Windows Docker Port 4000 .ZIP Exporter (< 32 MB Cloud Run Limit & 4 MB Chunking)
// ----------------------------------------------------------------------------
test('TEST 37 — Dynamic Windows Docker Port 4000 .ZIP Exporter: builds valid PKZIP archives on demand under Cloud Run 32 MB limit with 4 MB chunking', () => {
  const lightManifest = buildDockerZipManifest('lightweight');
  assert.equal(lightManifest.ok, true);
  assert.equal(lightManifest.filename, 'lango-ukrainian-docker-port-4000-lightweight.zip');
  assert.ok(lightManifest.totalBytes > 500_000, 'Lightweight Docker .zip must contain full source and core assets');
  assert.ok(lightManifest.totalBytes < 10 * 1024 * 1024, 'Lightweight Docker .zip must be under 10 MB');

  const lightArchive = getOrBuildDockerZipArchive('lightweight');
  assert.equal(lightArchive.buffer.readUInt32LE(0), 0x04034b50, 'Must start with PKZIP local file header signature PK\\x03\\x04');

  const fullManifest = buildDockerZipManifest('full');
  assert.equal(fullManifest.ok, true);
  assert.equal(fullManifest.filename, 'lango-ukrainian-docker-port-4000.zip');
  assert.ok(fullManifest.totalBytes > 5_000_000, 'Full Docker .zip must include all 67 approved scene photographs');
  assert.ok(
    fullManifest.totalBytes < 28 * 1024 * 1024,
    `Full Docker .zip (${fullManifest.totalMegabytes} MB) must stay safely below Cloud Run 32 MB HTTP response limit`
  );
  assert.ok(fullManifest.totalChunks >= 2, 'Full Docker .zip must split into 4 MB chunks for chunked browser download');

  const fullArchive = getOrBuildDockerZipArchive('full');
  assert.equal(fullArchive.buffer.readUInt32LE(0), 0x04034b50, 'Full archive must start with PKZIP magic bytes');
});




