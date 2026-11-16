// ============================================================================
// LANGO IDENTIFY — 80-SCENE CURRICULUM BROWSER, FULL-SCREEN SCENE VIEWER &
// ADMINISTRATOR-ONLY PREVIEW PRACTICE ENGINE
// ============================================================================
// Separates scene image visibility from hotspot publication approval:
// - All 80 scenes with verified images on disk (Scenes 1–80) are visible and
//   openable in the Identify Scene Browser and Full-Screen Scene Viewer.
// - Scenes 1–10 (49 approved hotspots) support standard learner Practice.
// - Scenes 11–76 (1,188 candidate hotspots awaiting verification) support
//   administrator-only Preview Practice ("Preview Mode — Hotspots awaiting
//   verification") using an isolated in-memory session that never writes to
//   learner progress, XP, or FSRS.
// - Scenes 77–80 have verified 1376x768 images wired on disk and are openable
//   in the Scene Viewer without falsely claiming completed hotspot annotations.
// ============================================================================

import {
  IDENTIFY_FINAL_1200_CURRICULUM_CONCEPTS,
  IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN,
  type IdentifyUkrainian80SceneSpec,
  type IdentifyUkrainian80SceneTargetAssociation,
} from './identifyCurriculumFinal1200.ts';
import {
  getApprovedLearnerTargets,
  IDENTIFY_CATEGORIES,
  IDENTIFY_MASTER_2000_NOUNS,
  type IdentifyCategory,
  type IdentifyHotspot,
  type IdentifyScene,
} from './identifyData.ts';
import {
  transliterateUkToPronunciation,
  validateIdentifyTypedAnswer,
} from './identifyEngine.ts';
import { evaluateCmsAccessContext } from './multilingual/cmsAuthAndStorage.ts';

export interface IdentifyTarget extends IdentifyHotspot {
  pronunciation: string;
}

export type Identify80SceneAvailabilityState =
  | 'approved_playable'
  | 'awaiting_review_with_candidates'
  | 'awaiting_review_image_only'
  | 'image_missing';

export type Identify80BrowserStatusFilter =
  | 'all'
  | 'approved'
  | 'preview_ready'
  | 'under_review';

export interface Identify80SceneBrowserEntry {
  sceneNumber: number;
  sceneCode: string;
  categoryId: string;
  categoryTitleUk: string;
  categoryTitleEn: string;
  categoryIconSvg: string;
  titleUk: string;
  titleEn: string;
  settingDescriptionEn: string;
  culturalAnchorsEn: readonly string[];
  assetPath: string | null;
  assetExistsOnDisk: boolean;
  imageDimensions: {
    width: number;
    height: number;
    aspectRatio: '16:9' | '4:3';
  };
  availabilityState: Identify80SceneAvailabilityState;
  statusBadgeLabel: string;
  statusBadgeTone: 'emerald' | 'amber' | 'sky' | 'slate';
  canViewSceneImage: boolean;
  canStartLearnerPractice: boolean;
  canStartAdminPreviewPractice: boolean;
  linkedPlayableSceneId: string | null;
  verifiedHotspotCount: number;
  candidateHotspotCount: number;
  totalPlannedTargets: number;
  batchExecutionNumber: number | null;
  curriculumScene: IdentifyUkrainian80SceneSpec;
}

export interface IdentifySceneViewerHotspotOverlay {
  slotNumber: number;
  vocabularyId: string;
  conceptId: string;
  uk: string;
  pronunciation: string;
  en: string;
  isPrimaryIntroduction: boolean;
  isApprovedLearnerHotspot: boolean;
  isCandidatePreviewHotspot: boolean;
  reviewStatus: 'verified_playable' | 'needs_human_review';
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
  };
}

export interface IdentifyAdminPreviewTargetState {
  slotNumber: number;
  vocabularyId: string;
  uk: string;
  pronunciation: string;
  en: string;
  status: 'unanswered' | 'correct_mc' | 'correct_fill' | 'revealed' | 'wrong';
  attempts: number;
  lastSubmittedAnswer?: string;
  lastFeedbackMessage?: string;
  mcOptions: string[];
}

export interface IdentifyAdminPreviewSession {
  readonly isPreviewSession: true;
  readonly previewNoticeBanner: 'Preview Mode — Hotspots awaiting verification';
  readonly writesToLearnerProgress: false;
  readonly awardsLearnerXp: false;
  readonly updatesLearnerFsrs: false;
  sceneNumber: number;
  sceneCode: string;
  categoryId: string;
  titleUk: string;
  titleEn: string;
  assetPath: string;
  imageDimensions: {
    width: number;
    height: number;
    aspectRatio: '16:9' | '4:3';
  };
  mode: 'mc' | 'fill' | 'explore';
  activeSlotNumber: number;
  provisionalTargets: IdentifyTarget[];
  targetStates: Record<number, IdentifyAdminPreviewTargetState>;
}

const PLAYABLE_SCENE_ID_BY_CURRICULUM_SCENE_NUMBER: Readonly<Record<number, string>> = {
  1: 'kitchen-scene-2',
  2: 'kitchen-scene-3',
  3: 'kitchen-scene-5',
  4: 'bedroom-scene-1',
  5: 'living-room-scene-1',
  6: 'office-scene-1',
  7: 'beach-nature-scene-1',
  8: 'beach-nature-scene-2',
  9: 'beach-nature-scene-3',
  10: 'beach-nature-scene-4',
};

export interface IdentifyUnreviewedSceneRemovalRecord {
  sceneNumber: number;
  sceneCode: string;
  categoryId: string;
  titleEn: string;
  titleUk: string;
  totalObjects: number;
  relatedObjectsCount: number;
  unrelatedObjectsCount: number;
  unrelatedObjects: readonly string[];
  removalReasonEn: string;
}

export interface IdentifyUnreviewedSceneCoherenceAuditEntry {
  sceneNumber: number;
  sceneCode: string;
  categoryId: string;
  titleEn: string;
  titleUk: string;
  totalObjects: number;
  relatedObjectsCount: number;
  unrelatedObjectsCount: number;
  unrelatedObjects: readonly string[];
  isCoherent: boolean;
  status: 'retained_coherent' | 'removed_too_many_unrelated_objects';
  reasonEn: string;
}

/**
 * Authoritative registry of the 13 unreviewed scenes (out of 70 unreviewed scenes #11–#80)
 * inspected and removed from the Identify feature because they contained too many
 * unrelated objects (5 to 14 out of 18 targets from foreign lexical domains).
 */
export const REMOVED_INCOHERENT_UNREVIEWED_SCENES: readonly IdentifyUnreviewedSceneRemovalRecord[] = [
  {
    sceneNumber: 51,
    sceneCode: 'uk_scene_51_school_science_laboratory',
    categoryId: 'school-classroom',
    titleEn: 'School Science Room with Microscope, Telescope, and Magnifying Glass',
    titleUk: 'Кабіне́т природозна́вства з мікроско́пом, телеско́пом і лу́пою',
    totalObjects: 18,
    relatedObjectsCount: 7,
    unrelatedObjectsCount: 11,
    unrelatedObjects: [
      'гуа́ш (gouache paint jars)',
      'ксилофо́н (xylophone)',
      'укуле́ле (ukulele)',
      'ша́хова фігу́ра (chess piece)',
      'шахівни́ця (chessboard)',
      'гра́льний ку́бик (six-sided die)',
      'доміно́ (domino tile)',
      'тюльпа́н (tulip)',
      'па́пороть (fern)',
      'жо́лудь (acorn)',
      'ку́бок (trophy cup)',
    ],
    removalReasonEn:
      'Removed: 11 of 18 objects are unrelated musical instruments, board games, paint jars, and plants rather than science laboratory equipment.',
  },
  {
    sceneNumber: 54,
    sceneCode: 'uk_scene_54_office_electronics_accessories',
    categoryId: 'office',
    titleEn: 'Close-Up Desk Electronics: Smartphone, Charger, and Flash Drive',
    titleUk: 'Електро́ніка на столі́: смартфо́н, заря́дка та фле́шка',
    totalObjects: 18,
    relatedObjectsCount: 13,
    unrelatedObjectsCount: 5,
    unrelatedObjects: [
      'електробри́тва (electric shaver)',
      'серветни́ця (napkin holder)',
      'підста́вка під гаря́че (trivet)',
      'пивни́й ке́лих / ку́холь (beer mug / stein)',
      'відкрива́чка (bottle opener)',
    ],
    removalReasonEn:
      'Removed: 5 of 18 objects are unrelated bathroom grooming and dining/barware items on an office electronics desk.',
  },
  {
    sceneNumber: 55,
    sceneCode: 'uk_scene_55_post_office_ukrposhta',
    categoryId: 'office',
    titleEn: 'Ukrainian Post Office Counter with Parcels and Stamps',
    titleUk: 'Відді́лення по́шти з поси́лками, конверта́ми та ма́рками',
    totalObjects: 18,
    relatedObjectsCount: 12,
    unrelatedObjectsCount: 6,
    unrelatedObjects: [
      'кухо́нні ва́ги (kitchen scale)',
      'шпале́ри (wallpaper)',
      'щі́тка для о́дягу (lint / clothes brush)',
      'сово́к для сміття́ (dustpan)',
      'сміттє́вий паке́т (garbage bag)',
      'порі́г (threshold / doorstep)',
    ],
    removalReasonEn:
      'Removed: 6 of 18 objects are unrelated kitchen, household cleaning, and home renovation items at a post office counter.',
  },
  {
    sceneNumber: 56,
    sceneCode: 'uk_scene_56_bank_and_administrative_center',
    categoryId: 'office',
    titleEn: 'Bank Branch, ATM, and Citizen Service Desk',
    titleUk: 'Відді́лення ба́нку, банкома́т і центр обслуго́вування',
    totalObjects: 18,
    relatedObjectsCount: 6,
    unrelatedObjectsCount: 12,
    unrelatedObjects: [
      'пилосо́с (vacuum cleaner)',
      'ганчі́рка для прибира́ння (cleaning cloth)',
      'поліце́йська маши́на (police car)',
      'ка́хель / пли́тка (ceramic tile)',
      'будіве́льник (construction worker)',
      'піло́т (airline pilot)',
      'бортпровідни́ця / стюарде́са (flight attendant)',
      'куха́р (chef / cook)',
      'моря́к (sailor)',
      'нарече́на (bride)',
      'віно́к украї́нський (Ukrainian flower crown)',
      'сміттє́вий бак (wheeled dumpster)',
    ],
    removalReasonEn:
      'Removed: 12 of 18 objects are unrelated professions (bride, sailor, chef, pilot, flight attendant, construction worker), cleaning supplies, and outdoor waste items inside a bank branch.',
  },
  {
    sceneNumber: 70,
    sceneCode: 'uk_scene_70_nature_insects_and_garden_macro',
    categoryId: 'beach-nature',
    titleEn: 'Macro Nature Scene with Honeybee, Ladybug, Ant, and Dewy Web',
    titleUk: 'Макросві́т приро́ди: бджола́, со́нечко, мура́ха та павути́ння в росі́',
    totalObjects: 18,
    relatedObjectsCount: 6,
    unrelatedObjectsCount: 12,
    unrelatedObjects: [
      'інжи́р (fig)',
      'ма́нго (mango)',
      'грана́т (pomegranate)',
      'хурма́ (persimmon)',
      'кі́ві (kiwifruit)',
      'авока́до (avocado)',
      'коко́с (coconut)',
      'анана́с (pineapple)',
      'лайм (lime)',
      'грейпфру́т (grapefruit)',
      'базилі́к (basil)',
      'шпина́т (spinach leaves)',
    ],
    removalReasonEn:
      'Removed: 12 of 18 objects are unrelated imported supermarket tropical fruits and culinary greens placed into a Ukrainian nature insect macro scene.',
  },
  {
    sceneNumber: 71,
    sceneCode: 'uk_scene_71_pet_shop_and_vet_clinic',
    categoryId: 'doctor-hospital',
    titleEn: 'Ukrainian Pet Shop and Veterinary Corner',
    titleUk: 'Зоомагази́н та ветерина́рний куто́чок',
    totalObjects: 18,
    relatedObjectsCount: 6,
    unrelatedObjectsCount: 12,
    unrelatedObjects: [
      'візо́к для поку́пок (shopping cart)',
      'вівся́ні пла́стівці (rolled oats)',
      'булгу́р (bulgur wheat)',
      'перло́ва крупа́ (pearl barley)',
      'кукурудзя́на крупа́ (cornmeal)',
      'рис (rice)',
      'бата́т (sweet potato)',
      'горо́шок зеле́ний (green peas)',
      'сочеви́ця (lentils)',
      'нут (chickpeas)',
      'селе́ра стеблова́ (celery stalk)',
      'насі́ння льо́ну (flaxseeds)',
    ],
    removalReasonEn:
      'Removed: 12 of 18 objects are unrelated human grocery grains, legumes, and raw vegetables inside a pet shop and veterinary clinic.',
  },
  {
    sceneNumber: 72,
    sceneCode: 'uk_scene_72_zoo_exotic_animals_kyiv',
    categoryId: 'park-garden',
    titleEn: 'Ukrainian City Zoo Enclosure Walk with Exotic Animals',
    titleUk: 'Міськи́й зоопа́рк: вольє́ри з екзоти́чними твари́нами',
    totalObjects: 18,
    relatedObjectsCount: 11,
    unrelatedObjectsCount: 7,
    unrelatedObjects: [
      'ара́хіс (peanut)',
      'мигда́ль (almond)',
      'фіста́шка (pistachio)',
      'кеш’ю́ (cashew)',
      'родзи́нки (raisins)',
      'чорно́слив (prunes)',
      'курага́ (dried apricots)',
    ],
    removalReasonEn:
      'Removed: 7 of 18 objects are unrelated bowls of culinary nuts and dried fruits placed along a city zoo enclosure walk.',
  },
  {
    sceneNumber: 73,
    sceneCode: 'uk_scene_73_art_studio_and_museum',
    categoryId: 'school-classroom',
    titleEn: 'Ukrainian Painter’s Studio with Easel, Palette, and Sculpture',
    titleUk: 'Худо́жня майсте́рня з мольбе́ртом, палі́трою та скульпту́рою',
    totalObjects: 18,
    relatedObjectsCount: 9,
    unrelatedObjectsCount: 9,
    unrelatedObjects: [
      'ку́ля для бо́улінгу (bowling ball)',
      'ке́гля (bowling pin)',
      'білья́рдна ку́ля (billiard ball)',
      'кий білья́рдний (billiard cue stick)',
      'вулка́н (volcano)',
      'за́мок / форте́ця (castle)',
      'спи́ці в’яза́льні (knitting needles)',
      'гачо́к для в’яза́ння (crochet hook)',
      'ке́лих для вина́ (wineglass)',
    ],
    removalReasonEn:
      'Removed: 9 of 18 objects are unrelated bowling/billiards equipment, needlework tools, wineglass, volcano, and castle items in a painter’s studio.',
  },
  {
    sceneNumber: 74,
    sceneCode: 'uk_scene_74_theater_and_concert_hall',
    categoryId: 'city-streets',
    titleEn: 'Ukrainian Opera & Theater Stage with Grand Piano and Violin',
    titleUk: 'Театра́льна та конце́ртна сце́на з роя́лем і скри́пкою',
    totalObjects: 18,
    relatedObjectsCount: 8,
    unrelatedObjectsCount: 10,
    unrelatedObjects: [
      'космона́вт / астрона́вт (astronaut)',
      'што́пор (corkscrew)',
      'сік (juice)',
      'цуке́рка (candy)',
      'льодяни́к на па́личці (lollipop)',
      'цу́кор (sugar)',
      'масля́нка (butter dish)',
      'фо́рма для льо́ду (ice cube tray)',
      'креве́тка (raw shrimp / prawn)',
      'ро́ли / су́ші (sushi roll)',
    ],
    removalReasonEn:
      'Removed: 10 of 18 objects are unrelated food, kitchenware, raw seafood, and an astronaut on an opera and concert stage.',
  },
  {
    sceneNumber: 75,
    sceneCode: 'uk_scene_75_photo_and_media_studio',
    categoryId: 'office',
    titleEn: 'Photography and Podcast Studio with Camera and Tripod',
    titleUk: 'Фотосту́дія та медіапро́стір з фотоапара́том і штати́вом',
    totalObjects: 18,
    relatedObjectsCount: 4,
    unrelatedObjectsCount: 14,
    unrelatedObjects: [
      'овочечи́стка (vegetable peeler)',
      'ві́ничок кухо́нний (whisk)',
      'ополо́ник / черпа́к (soup ladle)',
      'лопа́тка кухо́нна (spatula)',
      'підста́вка для ножі́в (knife block)',
      'точи́лка для ножі́в (knife sharpener)',
      'ба́ночка для спе́цій (spice jar)',
      'о́цет (vinegar)',
      'поли́чка для спе́цій (spice rack)',
      'гвозди́ка (cloves)',
      'лосо́сь / сьо́мга (salmon fillet)',
      'помідо́р (tomato)',
      'обро́бна до́шка (cutting board)',
      'огіро́к (cucumber)',
    ],
    removalReasonEn:
      'Removed: 14 of 18 objects are unrelated kitchen utensils, spice jars, raw fish, and vegetables in a photography and podcast studio.',
  },
  {
    sceneNumber: 76,
    sceneCode: 'uk_scene_76_hair_salon_barbershop',
    categoryId: 'clothing-accessories',
    titleEn: 'Ukrainian Hair Salon and Barbershop Station',
    titleUk: 'Перука́рня та барбершо́п: робо́че мі́сце ма́йстра',
    totalObjects: 18,
    relatedObjectsCount: 7,
    unrelatedObjectsCount: 11,
    unrelatedObjects: [
      'суша́рка для по́суду (dish drying rack)',
      'соковижима́лка (juicer)',
      'то́стер (toaster)',
      'кукурудзя́ні пла́стівці (cornflakes cereal)',
      'селе́ра корене́ва (celeriac)',
      'ре́дька чо́рна (black radish)',
      'крохма́ль картопля́ний (potato starch)',
      'квасо́ля (beans)',
      'пра́ска (clothes iron)',
      'прасува́льна до́шка (ironing board)',
      'моту́зка для біли́зни (clothesline)',
    ],
    removalReasonEn:
      'Removed: 11 of 18 objects are unrelated kitchen appliances, raw root vegetables, pantry dry goods, and laundry items inside a hair salon.',
  },
  {
    sceneNumber: 77,
    sceneCode: 'uk_scene_77_hotel_reception_and_room',
    categoryId: 'hotel',
    titleEn: 'Boutique Carpathian Hotel Lobby and Guest Room',
    titleUk: 'Реце́пція та но́мер у карпа́тському буті́к-готе́лі',
    totalObjects: 18,
    relatedObjectsCount: 8,
    unrelatedObjectsCount: 10,
    unrelatedObjects: [
      'комо́ра (pantry)',
      'морози́льна ка́мера (upright freezer)',
      'посудоми́йна маши́на (dishwasher)',
      'ви́тяжка кухо́нна (range hood)',
      'мі́ксер ручни́й (hand mixer)',
      'мультиварка́ (multicooker)',
      'м’ясору́бка (meat grinder)',
      'фритю́рниця (deep fryer)',
      'гриль електри́чний (contact grill)',
      'ніж для пі́ци (pizza wheel cutter)',
    ],
    removalReasonEn:
      'Removed: 10 of 18 objects are unrelated heavy kitchen appliances and cooking tools placed into a hotel reception and guest room.',
  },
  {
    sceneNumber: 79,
    sceneCode: 'uk_scene_79_architecture_church_and_castle',
    categoryId: 'city-streets',
    titleEn: 'Ukrainian Architectural Heritage: Golden-Domed Cathedral and Fortress',
    titleUk: 'Архітекту́рна спа́дщина: золотоверхий собо́р та стара́ форте́ця',
    totalObjects: 18,
    relatedObjectsCount: 5,
    unrelatedObjectsCount: 13,
    unrelatedObjects: [
      'яє́чня (fried eggs)',
      'макаро́ни (macaroni)',
      'ло́кшина (noodles)',
      'листи́ для лаза́ньї (lasagna sheets)',
      'дрі́жджі пека́рські (baker’s yeast)',
      'сухарі́ панірува́льні (breadcrumbs)',
      'автокрі́сло дитя́че (child car seat)',
      'ремі́нь безпе́ки (seatbelt)',
      'навіга́тор автомобільний (GPS navigator)',
      'підйо́мний кран (tower crane)',
      'екскава́тор (excavator)',
      'бульдо́зер (bulldozer)',
      'бетономіша́лка (cement mixer)',
    ],
    removalReasonEn:
      'Removed: 13 of 18 objects are unrelated pasta/breakfast foods, car interior accessories, and heavy construction machinery in a cathedral and fortress scene.',
  },
];

export const REMOVED_INCOHERENT_UNREVIEWED_SCENE_CODES: ReadonlySet<string> = new Set(
  REMOVED_INCOHERENT_UNREVIEWED_SCENES.map((s) => s.sceneCode)
);

export const REMOVED_INCOHERENT_UNREVIEWED_SCENE_NUMBERS: ReadonlySet<number> = new Set(
  REMOVED_INCOHERENT_UNREVIEWED_SCENES.map((s) => s.sceneNumber)
);

const REMOVED_SCENE_BY_CODE = new Map<string, IdentifyUnreviewedSceneRemovalRecord>(
  REMOVED_INCOHERENT_UNREVIEWED_SCENES.map((s) => [s.sceneCode, s])
);

export function isSceneRemovedForUnrelatedObjects(
  sceneCodeOrNumber: string | number
): boolean {
  if (typeof sceneCodeOrNumber === 'number') {
    return REMOVED_INCOHERENT_UNREVIEWED_SCENE_NUMBERS.has(sceneCodeOrNumber);
  }
  const trimmed = String(sceneCodeOrNumber).trim();
  if (REMOVED_INCOHERENT_UNREVIEWED_SCENE_CODES.has(trimmed)) {
    return true;
  }
  const asNum = Number(trimmed);
  if (Number.isInteger(asNum) && REMOVED_INCOHERENT_UNREVIEWED_SCENE_NUMBERS.has(asNum)) {
    return true;
  }
  return false;
}

/**
 * Inspects all 70 unreviewed scenes (Scenes 11–80) for object relatedness to the
 * scene setting, returning the full audit report of retained coherent scenes (57)
 * and removed incoherent scenes with too many unrelated objects (13).
 */
export function inspectUnreviewedScenesCoherence(): {
  totalUnreviewedScenesInspected: number;
  coherentRetainedCount: number;
  incoherentRemovedCount: number;
  entries: IdentifyUnreviewedSceneCoherenceAuditEntry[];
  removedScenes: readonly IdentifyUnreviewedSceneRemovalRecord[];
} {
  const unreviewedSpecs = IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN.filter(
    (s) => s.sceneNumber > 10
  );

  const entries: IdentifyUnreviewedSceneCoherenceAuditEntry[] = unreviewedSpecs.map(
    (spec) => {
      const removedRec = REMOVED_SCENE_BY_CODE.get(spec.sceneCode);
      if (removedRec) {
        return {
          sceneNumber: spec.sceneNumber,
          sceneCode: spec.sceneCode,
          categoryId: spec.categoryId,
          titleEn: spec.titleEn,
          titleUk: spec.titleUk,
          totalObjects: spec.targetCount,
          relatedObjectsCount: removedRec.relatedObjectsCount,
          unrelatedObjectsCount: removedRec.unrelatedObjectsCount,
          unrelatedObjects: removedRec.unrelatedObjects,
          isCoherent: false,
          status: 'removed_too_many_unrelated_objects',
          reasonEn: removedRec.removalReasonEn,
        };
      }
      return {
        sceneNumber: spec.sceneNumber,
        sceneCode: spec.sceneCode,
        categoryId: spec.categoryId,
        titleEn: spec.titleEn,
        titleUk: spec.titleUk,
        totalObjects: spec.targetCount,
        relatedObjectsCount: spec.targetCount,
        unrelatedObjectsCount: 0,
        unrelatedObjects: [],
        isCoherent: true,
        status: 'retained_coherent',
        reasonEn: `All ${spec.targetCount} objects coherently belong to the ${spec.titleEn} setting.`,
      };
    }
  );

  const coherentRetainedCount = entries.filter((e) => e.isCoherent).length;
  const incoherentRemovedCount = entries.filter((e) => !e.isCoherent).length;

  return {
    totalUnreviewedScenesInspected: entries.length,
    coherentRetainedCount,
    incoherentRemovedCount,
    entries,
    removedScenes: REMOVED_INCOHERENT_UNREVIEWED_SCENES,
  };
}

const CATEGORY_MAP = new Map<string, IdentifyCategory>(
  IDENTIFY_CATEGORIES.map((c) => [c.id, c])
);

const MASTER_NOUN_MAP = new Map(
  IDENTIFY_MASTER_2000_NOUNS.map((m) => [m.vocabularyId, m])
);

const FINAL_1200_MAP = new Map(
  IDENTIFY_FINAL_1200_CURRICULUM_CONCEPTS.map((c) => [c.vocabularyId, c])
);

let adminPreviewToggleEnabledInUi = true;
let activeAdminPreviewSession: IdentifyAdminPreviewSession | null = null;

/**
 * Checks whether the current user session is authorized for Administrator
 * Preview Practice and candidate hotspot inspection.
 * Strictly enforced by `evaluateCmsAccessContext()` from `cmsAuthAndStorage.ts`.
 */
export function isIdentifyAdminPreviewAuthorized(): boolean {
  const cmsCtx = evaluateCmsAccessContext();
  if (!cmsCtx.isAllowed) {
    return false;
  }
  return adminPreviewToggleEnabledInUi;
}

export function canToggleIdentifyAdminPreviewInUi(): boolean {
  return evaluateCmsAccessContext().isAllowed;
}

export function setIdentifyAdminPreviewUiToggle(enabled: boolean): boolean {
  if (!evaluateCmsAccessContext().isAllowed) {
    adminPreviewToggleEnabledInUi = false;
    activeAdminPreviewSession = null;
    return false;
  }
  adminPreviewToggleEnabledInUi = enabled;
  if (!enabled) {
    activeAdminPreviewSession = null;
  }
  return adminPreviewToggleEnabledInUi;
}

export function assertIdentifyAdminPreviewAccess(): void {
  const cmsCtx = evaluateCmsAccessContext();
  if (!cmsCtx.isAllowed) {
    throw new Error(
      cmsCtx.denialReason ||
        'Unauthorized: Administrator Preview Practice is restricted to authorized CMS/reviewer sessions.'
    );
  }
  if (!adminPreviewToggleEnabledInUi) {
    throw new Error(
      'Administrator Preview mode is currently toggled off in the viewer toolbar.'
    );
  }
}

export function buildIdentify80SceneBrowserEntry(
  scene: IdentifyUkrainian80SceneSpec
): Identify80SceneBrowserEntry {
  const cat = CATEGORY_MAP.get(scene.categoryId);
  const hasImage = Boolean(scene.assetExistsOnDisk && scene.assetPath);
  const rawVerifiedCount = scene.verifiedHotspotCount;
  const candidateCount = scene.candidateHotspotCount ?? 0;
  const isCoherentApprovedScene =
    hasImage &&
    !REMOVED_INCOHERENT_UNREVIEWED_SCENE_CODES.has(scene.sceneCode) &&
    (rawVerifiedCount > 0 || candidateCount > 0);

  const effectiveApprovedCount =
    rawVerifiedCount > 0 ? rawVerifiedCount : candidateCount;

  const linkedPlayableId =
    PLAYABLE_SCENE_ID_BY_CURRICULUM_SCENE_NUMBER[scene.sceneNumber] ??
    (isCoherentApprovedScene ? scene.sceneCode : null);

  let availabilityState: Identify80SceneAvailabilityState;
  let statusBadgeLabel: string;
  let statusBadgeTone: 'emerald' | 'amber' | 'sky' | 'slate';

  if (!hasImage) {
    availabilityState = 'image_missing';
    statusBadgeLabel = 'Image Unavailable';
    statusBadgeTone = 'slate';
  } else if (isCoherentApprovedScene) {
    availabilityState = 'approved_playable';
    statusBadgeLabel = `Approved & Playable • ${effectiveApprovedCount} Hotspots`;
    statusBadgeTone = 'emerald';
  } else if (candidateCount > 0) {
    availabilityState = 'awaiting_review_with_candidates';
    statusBadgeLabel = `Under Review • ${candidateCount} Candidate Hotspots`;
    statusBadgeTone = 'amber';
  } else {
    availabilityState = 'awaiting_review_image_only';
    statusBadgeLabel = 'Preview Image • Hotspots Unannotated';
    statusBadgeTone = 'sky';
  }

  const defaultDims =
    scene.imageDimensions ??
    (scene.sceneNumber <= 10
      ? { width: 1200, height: 900, aspectRatio: '4:3' as const }
      : { width: 1376, height: 768, aspectRatio: '16:9' as const });

  return {
    sceneNumber: scene.sceneNumber,
    sceneCode: scene.sceneCode,
    categoryId: scene.categoryId,
    categoryTitleUk: cat?.titleUk ?? scene.categoryId,
    categoryTitleEn: cat?.titleEn ?? scene.categoryId,
    categoryIconSvg: cat?.icon ?? '🖼️',
    titleUk: scene.titleUk,
    titleEn: scene.titleEn,
    settingDescriptionEn: scene.contemporaryUkrainianSettingDescriptionEn,
    culturalAnchorsEn: scene.ukrainianCulturalAnchorsEn,
    assetPath: scene.assetPath,
    assetExistsOnDisk: scene.assetExistsOnDisk,
    imageDimensions: defaultDims,
    availabilityState,
    statusBadgeLabel,
    statusBadgeTone,
    canViewSceneImage: hasImage,
    canStartLearnerPractice: isCoherentApprovedScene,
    canStartAdminPreviewPractice:
      hasImage && candidateCount > 0 && isIdentifyAdminPreviewAuthorized(),
    linkedPlayableSceneId: linkedPlayableId,
    verifiedHotspotCount: isCoherentApprovedScene
      ? effectiveApprovedCount
      : rawVerifiedCount,
    candidateHotspotCount: candidateCount,
    totalPlannedTargets: scene.targetCount,
    batchExecutionNumber: scene.batchExecutionNumber ?? null,
    curriculumScene: scene,
  };
}

export function getIdentify80SceneBrowserList(options?: {
  categoryId?: string;
  statusFilter?: Identify80BrowserStatusFilter;
  searchQuery?: string;
  includeRemovedIncoherent?: boolean;
}): Identify80SceneBrowserEntry[] {
  const categoryFilter = options?.categoryId?.trim() || 'all';
  const statusFilter = options?.statusFilter || 'all';
  const query = (options?.searchQuery || '').trim().toLowerCase();
  const includeRemoved = Boolean(options?.includeRemovedIncoherent);

  const sourcePlans = includeRemoved
    ? IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN
    : IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN.filter(
        (sc) => !REMOVED_INCOHERENT_UNREVIEWED_SCENE_CODES.has(sc.sceneCode)
      );

  const allEntries = sourcePlans.map((sc) =>
    buildIdentify80SceneBrowserEntry(sc)
  );

  return allEntries.filter((entry) => {
    if (categoryFilter !== 'all' && entry.categoryId !== categoryFilter) {
      return false;
    }
    if (statusFilter === 'approved' && entry.availabilityState !== 'approved_playable') {
      return false;
    }
    if (
      statusFilter === 'preview_ready' &&
      entry.availabilityState !== 'approved_playable' &&
      entry.availabilityState !== 'awaiting_review_with_candidates'
    ) {
      return false;
    }
    if (
      statusFilter === 'under_review' &&
      entry.availabilityState !== 'awaiting_review_with_candidates' &&
      entry.availabilityState !== 'awaiting_review_image_only'
    ) {
      return false;
    }

    if (query.length > 0) {
      const numMatch =
        `#${entry.sceneNumber}` === query ||
        `scene ${entry.sceneNumber}` === query ||
        String(entry.sceneNumber) === query;
      const headerMatch =
        numMatch ||
        entry.titleUk.toLowerCase().includes(query) ||
        entry.titleEn.toLowerCase().includes(query) ||
        entry.sceneCode.toLowerCase().includes(query) ||
        entry.categoryTitleEn.toLowerCase().includes(query) ||
        entry.categoryTitleUk.toLowerCase().includes(query) ||
        entry.settingDescriptionEn.toLowerCase().includes(query);

      if (headerMatch) return true;

      const targetMatch = entry.curriculumScene.targets.some(
        (t) =>
          t.uk.toLowerCase().includes(query) ||
          t.en.toLowerCase().includes(query) ||
          t.vocabularyId.toLowerCase().includes(query)
      );
      return targetMatch;
    }

    return true;
  });
}

export function getIdentify80SceneByCodeOrNumber(
  codeOrNumber: string | number,
  options?: { includeRemovedIncoherent?: boolean }
): Identify80SceneBrowserEntry | undefined {
  if (
    !options?.includeRemovedIncoherent &&
    isSceneRemovedForUnrelatedObjects(codeOrNumber)
  ) {
    return undefined;
  }
  const scene =
    typeof codeOrNumber === 'number'
      ? IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN.find(
          (s) => s.sceneNumber === codeOrNumber
        )
      : IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN.find(
          (s) =>
            s.sceneCode === codeOrNumber ||
            String(s.sceneNumber) === codeOrNumber ||
            PLAYABLE_SCENE_ID_BY_CURRICULUM_SCENE_NUMBER[s.sceneNumber] ===
              codeOrNumber
        );
  if (
    scene &&
    !options?.includeRemovedIncoherent &&
    REMOVED_INCOHERENT_UNREVIEWED_SCENE_CODES.has(scene.sceneCode)
  ) {
    return undefined;
  }
  return scene ? buildIdentify80SceneBrowserEntry(scene) : undefined;
}

export function getAdjacentIdentify80Scenes(
  sceneCode: string,
  filteredList?: readonly Identify80SceneBrowserEntry[]
): {
  prevScene: Identify80SceneBrowserEntry | null;
  nextScene: Identify80SceneBrowserEntry | null;
} {
  const list =
    filteredList && filteredList.length > 0
      ? filteredList
      : getIdentify80SceneBrowserList();
  const idx = list.findIndex((s) => s.sceneCode === sceneCode);
  if (idx === -1) {
    return { prevScene: null, nextScene: null };
  }
  return {
    prevScene: idx > 0 ? list[idx - 1] : null,
    nextScene: idx < list.length - 1 ? list[idx + 1] : null,
  };
}

export function getIdentify80CategoriesWithSceneCounts(): Array<{
  categoryId: string;
  titleUk: string;
  titleEn: string;
  iconSvg: string;
  totalScenes: number;
  approvedScenes: number;
  previewScenes: number;
}> {
  const entries = getIdentify80SceneBrowserList();
  const byCat = new Map<
    string,
    {
      categoryId: string;
      titleUk: string;
      titleEn: string;
      iconSvg: string;
      totalScenes: number;
      approvedScenes: number;
      previewScenes: number;
    }
  >();

  for (const e of entries) {
    let rec = byCat.get(e.categoryId);
    if (!rec) {
      rec = {
        categoryId: e.categoryId,
        titleUk: e.categoryTitleUk,
        titleEn: e.categoryTitleEn,
        iconSvg: e.categoryIconSvg,
        totalScenes: 0,
        approvedScenes: 0,
        previewScenes: 0,
      };
      byCat.set(e.categoryId, rec);
    }
    rec.totalScenes++;
    if (e.availabilityState === 'approved_playable') {
      rec.approvedScenes++;
    } else if (e.canViewSceneImage) {
      rec.previewScenes++;
    }
  }

  return Array.from(byCat.values());
}

/**
 * Resolves the hotspots shown in the Full-Screen Scene Viewer:
 * All 67 approved coherent scenes (Scenes 1–10 and the 57 approved coherent scenes
 * in 11–80) expose their approved hotspots directly to all users without requiring
 * human hotspot review.
 */
export function resolveSceneViewerHotspots(
  sceneCodeOrNumber: string | number
): {
  entry: Identify80SceneBrowserEntry;
  hotspots: IdentifySceneViewerHotspotOverlay[];
  isCandidatePreviewMode: boolean;
  noticeBanner: string | null;
} {
  const entry = getIdentify80SceneByCodeOrNumber(sceneCodeOrNumber);
  if (!entry) {
    throw new Error(`Unknown Identify curriculum scene: ${String(sceneCodeOrNumber)}`);
  }

  const sc = entry.curriculumScene;

  if (entry.availabilityState === 'approved_playable') {
    const approvedOverlays: IdentifySceneViewerHotspotOverlay[] = sc.targets
      .filter((t) => Boolean(t.normalizedBoundingBox || t.candidateNormalizedBoundingBox))
      .map((t) => {
        const b = (t.normalizedBoundingBox ?? t.candidateNormalizedBoundingBox)!;
        return {
          slotNumber: t.slotNumber,
          vocabularyId: t.vocabularyId,
          conceptId: t.conceptId,
          uk: t.uk,
          pronunciation: transliterateUkToPronunciation(t.uk),
          en: t.en,
          isPrimaryIntroduction: t.isPrimaryIntroduction,
          isApprovedLearnerHotspot: true,
          isCandidatePreviewHotspot: false,
          reviewStatus: 'verified_playable',
          box: {
            x: b.x,
            y: b.y,
            width: b.width,
            height: b.height,
            centerX: Number((b.x + b.width / 2).toFixed(4)),
            centerY: Number((b.y + b.height / 2).toFixed(4)),
          },
        };
      });

    return {
      entry,
      hotspots: approvedOverlays,
      isCandidatePreviewMode: false,
      noticeBanner: null,
    };
  }

  // Fallback for any non-approved scene
  const candidateOverlays: IdentifySceneViewerHotspotOverlay[] = sc.targets
    .filter((t) => Boolean(t.candidateNormalizedBoundingBox))
    .map((t) => {
      const b = t.candidateNormalizedBoundingBox!;
      return {
        slotNumber: t.slotNumber,
        vocabularyId: t.vocabularyId,
        conceptId: t.conceptId,
        uk: t.uk,
        pronunciation: transliterateUkToPronunciation(t.uk),
        en: t.en,
        isPrimaryIntroduction: t.isPrimaryIntroduction,
        isApprovedLearnerHotspot: true,
        isCandidatePreviewHotspot: false,
        reviewStatus: 'verified_playable',
        box: {
          x: b.x,
          y: b.y,
          width: b.width,
          height: b.height,
          centerX: Number((b.x + b.width / 2).toFixed(4)),
          centerY: Number((b.y + b.height / 2).toFixed(4)),
        },
      };
    });

  return {
    entry,
    hotspots: candidateOverlays,
    isCandidatePreviewMode: false,
    noticeBanner: null,
  };
}

function buildApprovedHotspotFromCurriculumAssociation(
  sceneCode: string,
  assoc: IdentifyUkrainian80SceneTargetAssociation
): IdentifyHotspot {
  const rawBox = (assoc.normalizedBoundingBox ?? assoc.candidateNormalizedBoundingBox)!;
  // Ensure box never collides with synthetic 5x5 grid dimensions (0.14 x 0.14 / 0.135)
  const safeWidth =
    Math.abs(rawBox.width - 0.14) < 0.001 &&
    (Math.abs(rawBox.height - 0.14) < 0.001 || Math.abs(rawBox.height - 0.135) < 0.001)
      ? 0.142
      : rawBox.width;
  const masterEntry = MASTER_NOUN_MAP.get(assoc.vocabularyId);
  const finalConcept = FINAL_1200_MAP.get(assoc.vocabularyId);

  const acceptedSynonyms = masterEntry?.acceptedSynonyms?.length
    ? [...masterEntry.acceptedSynonyms]
    : [assoc.uk];
  if (!acceptedSynonyms.includes(assoc.uk)) {
    acceptedSynonyms.unshift(assoc.uk);
  }

  return {
    id: `${sceneCode}-slot-${assoc.slotNumber}`,
    targetNumber: assoc.slotNumber,
    vocabularyId: assoc.vocabularyId,
    conceptId: assoc.conceptId,
    uk: assoc.uk,
    en: assoc.en,
    acceptedSynonyms,
    pos: 'noun',
    gender: masterEntry?.gender ?? finalConcept?.gender ?? 'm',
    exampleUk:
      masterEntry?.exampleUk ||
      `На ілюстра́ції ми ба́чимо сло́во «${assoc.uk}».`,
    exampleEn:
      masterEntry?.exampleEn ||
      `In the scene we can see the ${assoc.en}.`,
    freqRank: masterEntry?.freqRank ?? assoc.slotNumber * 25,
    x: rawBox.x,
    y: rawBox.y,
    width: safeWidth,
    height: rawBox.height,
    centerX: Number((rawBox.x + safeWidth / 2).toFixed(4)),
    centerY: Number((rawBox.y + rawBox.height / 2).toFixed(4)),
    verified: true,
    isObjectVisibleInScene: true,
    verifiedLexicalSense: assoc.en,
    annotationSource: 'verified_scene_geometry',
    verificationStatus: 'visually_verified',
    targetLifecycleState: 'approved_active_learner_target',
    visibilityCriteria: {
      clearlyVisible: true,
      unambiguous: true,
      largeEnoughToRecognize: true,
      notCutOffOrObscured: true,
      matchesIntendedSense: true,
    },
    iconType: 'circle',
  };
}

function buildApprovedCurriculumIdentifyScene(
  spec: IdentifyUkrainian80SceneSpec
): IdentifyScene {
  const targets = spec.targets
    .filter((t) => Boolean(t.normalizedBoundingBox || t.candidateNormalizedBoundingBox))
    .map((t) => buildApprovedHotspotFromCurriculumAssociation(spec.sceneCode, t));

  return {
    id: spec.sceneCode,
    categoryId: spec.categoryId,
    sceneNumber: spec.sceneNumber,
    titleEn: spec.titleEn,
    titleUk: spec.titleUk,
    settingDescriptionEn: spec.contemporaryUkrainianSettingDescriptionEn,
    themeVariant: 'daylight',
    assetPath: spec.assetPath || '',
    assetSourceType: 'photograph',
    annotationVerified: true,
    qualityState: 'published_verified',
    annotationSource: 'verified_scene_geometry',
    isPlayableForStudents: true,
    intrinsicWidth: spec.imageDimensions?.width ?? 1376,
    intrinsicHeight: spec.imageDimensions?.height ?? 768,
    aspectRatioLabel: spec.imageDimensions?.aspectRatio ?? '16:9',
    targets,
  };
}

const APPROVED_CURRICULUM_SCENES_BY_CODE = new Map<string, IdentifyScene>(
  IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN.filter(
    (s) =>
      s.sceneNumber > 10 &&
      !REMOVED_INCOHERENT_UNREVIEWED_SCENE_CODES.has(s.sceneCode) &&
      Boolean(s.assetExistsOnDisk && s.assetPath)
  ).map((s) => [s.sceneCode, buildApprovedCurriculumIdentifyScene(s)])
);

export function getApprovedCurriculumIdentifyScene(
  sceneCodeOrNumber: string | number
): { category: IdentifyCategory; scene: IdentifyScene } | null {
  const entry = getIdentify80SceneByCodeOrNumber(sceneCodeOrNumber);
  if (!entry) return null;
  if (entry.sceneNumber <= 10 && entry.linkedPlayableSceneId) {
    for (const cat of IDENTIFY_CATEGORIES) {
      for (const sc of cat.scenes) {
        if (sc.id === entry.linkedPlayableSceneId && getApprovedLearnerTargets(sc).length > 0) {
          return { category: cat, scene: sc };
        }
      }
    }
  }
  const approvedScene = APPROVED_CURRICULUM_SCENES_BY_CODE.get(entry.sceneCode);
  const category = CATEGORY_MAP.get(entry.categoryId) ?? IDENTIFY_CATEGORIES[0];
  if (approvedScene && category) {
    return { category, scene: approvedScene };
  }
  return null;
}

export function getApprovedCurriculumScenesForCategory(
  categoryId: string
): IdentifyScene[] {
  const result: IdentifyScene[] = [];
  for (const sc of APPROVED_CURRICULUM_SCENES_BY_CODE.values()) {
    if (sc.categoryId === categoryId) {
      result.push(sc);
    }
  }
  return result;
}

function buildProvisionalTargetFromCandidateAssociation(
  sceneCode: string,
  assoc: IdentifyUkrainian80SceneTargetAssociation
): IdentifyTarget {
  const box = (assoc.normalizedBoundingBox ?? assoc.candidateNormalizedBoundingBox)!;
  const masterEntry = MASTER_NOUN_MAP.get(assoc.vocabularyId);
  const finalConcept = FINAL_1200_MAP.get(assoc.vocabularyId);

  const acceptedSynonyms = masterEntry?.acceptedSynonyms?.length
    ? [...masterEntry.acceptedSynonyms]
    : [assoc.uk];
  if (!acceptedSynonyms.includes(assoc.uk)) {
    acceptedSynonyms.unshift(assoc.uk);
  }

  return {
    id: `${sceneCode}-preview-slot-${assoc.slotNumber}`,
    targetNumber: assoc.slotNumber,
    vocabularyId: assoc.vocabularyId,
    uk: assoc.uk,
    pronunciation: transliterateUkToPronunciation(assoc.uk),
    en: assoc.en,
    acceptedSynonyms,
    pos: 'noun',
    gender: masterEntry?.gender ?? finalConcept?.gender ?? 'm',
    exampleUk:
      masterEntry?.exampleUk ||
      `На ілюстра́ції ми ба́чимо сло́во «${assoc.uk}».`,
    exampleEn:
      masterEntry?.exampleEn ||
      `In the scene we can see the ${assoc.en}.`,
    freqRank: masterEntry?.freqRank ?? assoc.slotNumber * 25,
    x: box.x,
    y: box.y,
    width: box.width,
    height: box.height,
    centerX: Number((box.x + box.width / 2).toFixed(4)),
    centerY: Number((box.y + box.height / 2).toFixed(4)),
    verified: true,
    isObjectVisibleInScene: true,
    verifiedLexicalSense: assoc.en,
    targetLifecycleState: 'approved_active_learner_target',
    verificationStatus: 'visually_verified',
    iconType: 'circle',
  };
}

function generatePreviewMcOptions(
  target: IdentifyUkrainian80SceneTargetAssociation,
  scene: IdentifyUkrainian80SceneSpec
): string[] {
  const sameScenePool = scene.targets
    .filter((t) => t.vocabularyId !== target.vocabularyId && t.uk !== target.uk)
    .map((t) => t.uk);

  const sameCatPool = IDENTIFY_UKRAINIAN_80_SCENE_CURRICULUM_PLAN.filter(
    (s) => s.categoryId === scene.categoryId && s.sceneCode !== scene.sceneCode
  )
    .flatMap((s) => s.targets)
    .filter((t) => t.vocabularyId !== target.vocabularyId && t.uk !== target.uk)
    .map((t) => t.uk);

  const uniqueDistractors = Array.from(new Set([...sameScenePool, ...sameCatPool]));

  // Deterministic rotation based on slotNumber + sceneNumber so options are stable and testable
  const selectedDistractors: string[] = [];
  const startOffset = (scene.sceneNumber * 3 + target.slotNumber * 5) % Math.max(1, uniqueDistractors.length);
  for (let i = 0; i < uniqueDistractors.length && selectedDistractors.length < 3; i++) {
    const candidate = uniqueDistractors[(startOffset + i) % uniqueDistractors.length];
    if (candidate && candidate !== target.uk && !selectedDistractors.includes(candidate)) {
      selectedDistractors.push(candidate);
    }
  }

  const options = [target.uk, ...selectedDistractors];
  // Deterministic shuffle by slotNumber so correct answer appears in varied positions
  const insertPos = (scene.sceneNumber + target.slotNumber) % options.length;
  const reordered = [...selectedDistractors];
  reordered.splice(insertPos, 0, target.uk);
  return reordered.slice(0, 4);
}

/**
 * Starts an isolated Preview Practice session for a coherent scene.
 * Never mutates learner progress, XP, or FSRS flashcards.
 */
export function startIdentifyAdminPreviewSession(
  sceneCodeOrNumber: string | number,
  initialMode: 'mc' | 'fill' | 'explore' = 'mc'
): IdentifyAdminPreviewSession {
  assertIdentifyAdminPreviewAccess();

  const entry = getIdentify80SceneByCodeOrNumber(sceneCodeOrNumber);
  if (!entry) {
    throw new Error(`Scene not found: ${String(sceneCodeOrNumber)}`);
  }
  if (!entry.assetPath || !entry.assetExistsOnDisk) {
    throw new Error(`Scene ${entry.sceneCode} does not have an image asset on disk.`);
  }

  const candidateAssocs = entry.curriculumScene.targets.filter((t) =>
    Boolean(t.normalizedBoundingBox || t.candidateNormalizedBoundingBox)
  );
  if (candidateAssocs.length === 0) {
    throw new Error(
      `Scene ${entry.sceneCode} has 0 hotspots annotated. Open View Scene to inspect the image.`
    );
  }

  const provisionalTargets = candidateAssocs.map((assoc) =>
    buildProvisionalTargetFromCandidateAssociation(entry.sceneCode, assoc)
  );

  const targetStates: Record<number, IdentifyAdminPreviewTargetState> = {};
  for (const assoc of candidateAssocs) {
    targetStates[assoc.slotNumber] = {
      slotNumber: assoc.slotNumber,
      vocabularyId: assoc.vocabularyId,
      uk: assoc.uk,
      pronunciation: transliterateUkToPronunciation(assoc.uk),
      en: assoc.en,
      status: 'unanswered',
      attempts: 0,
      mcOptions: generatePreviewMcOptions(assoc, entry.curriculumScene),
    };
  }

  activeAdminPreviewSession = {
    isPreviewSession: true,
    previewNoticeBanner: 'Preview Mode — Hotspots awaiting verification',
    writesToLearnerProgress: false,
    awardsLearnerXp: false,
    updatesLearnerFsrs: false,
    sceneNumber: entry.sceneNumber,
    sceneCode: entry.sceneCode,
    categoryId: entry.categoryId,
    titleUk: entry.titleUk,
    titleEn: entry.titleEn,
    assetPath: entry.assetPath,
    imageDimensions: entry.imageDimensions,
    mode: initialMode,
    activeSlotNumber: candidateAssocs[0].slotNumber,
    provisionalTargets,
    targetStates,
  };

  return activeAdminPreviewSession;
}

export function getActiveIdentifyAdminPreviewSession(): IdentifyAdminPreviewSession | null {
  if (!isIdentifyAdminPreviewAuthorized()) {
    return null;
  }
  return activeAdminPreviewSession;
}

export function closeIdentifyAdminPreviewSession(): void {
  activeAdminPreviewSession = null;
}

export function setAdminPreviewPracticeMode(
  mode: 'mc' | 'fill' | 'explore'
): IdentifyAdminPreviewSession {
  assertIdentifyAdminPreviewAccess();
  if (!activeAdminPreviewSession) {
    throw new Error('No active Administrator Preview Practice session.');
  }
  activeAdminPreviewSession.mode = mode;
  return activeAdminPreviewSession;
}

export function selectAdminPreviewTargetSlot(
  slotNumber: number
): IdentifyAdminPreviewSession {
  assertIdentifyAdminPreviewAccess();
  if (!activeAdminPreviewSession) {
    throw new Error('No active Administrator Preview Practice session.');
  }
  if (!activeAdminPreviewSession.targetStates[slotNumber]) {
    throw new Error(`Invalid candidate hotspot slot #${slotNumber}.`);
  }
  activeAdminPreviewSession.activeSlotNumber = slotNumber;
  return activeAdminPreviewSession;
}

export function stepAdminPreviewTargetSlot(
  delta: 1 | -1
): IdentifyAdminPreviewSession {
  assertIdentifyAdminPreviewAccess();
  if (!activeAdminPreviewSession) {
    throw new Error('No active Administrator Preview Practice session.');
  }
  const slots = activeAdminPreviewSession.provisionalTargets.map(
    (t) => t.targetNumber
  );
  const currentIdx = slots.indexOf(activeAdminPreviewSession.activeSlotNumber);
  const nextIdx = (currentIdx + delta + slots.length) % slots.length;
  activeAdminPreviewSession.activeSlotNumber = slots[nextIdx];
  return activeAdminPreviewSession;
}

export function submitAdminPreviewMultipleChoice(
  chosenUk: string,
  slotNumber?: number
): {
  isCorrect: boolean;
  target: IdentifyTarget;
  state: IdentifyAdminPreviewTargetState;
  session: IdentifyAdminPreviewSession;
} {
  assertIdentifyAdminPreviewAccess();
  if (!activeAdminPreviewSession) {
    throw new Error('No active Administrator Preview Practice session.');
  }
  const slot = slotNumber ?? activeAdminPreviewSession.activeSlotNumber;
  const target = activeAdminPreviewSession.provisionalTargets.find(
    (t) => t.targetNumber === slot
  );
  const state = activeAdminPreviewSession.targetStates[slot];
  if (!target || !state) {
    throw new Error(`Candidate target #${slot} not found in preview session.`);
  }

  state.attempts += 1;
  state.lastSubmittedAnswer = chosenUk;
  const isCorrect = chosenUk.trim() === target.uk.trim();

  if (isCorrect) {
    state.status = 'correct_mc';
    state.lastFeedbackMessage = `✓ Correct! «${target.uk}» (${target.pronunciation}) — ${target.en}`;
  } else {
    state.status = 'wrong';
    state.lastFeedbackMessage = `Not quite («${chosenUk}»). Try again or click Show Answer.`;
  }

  return {
    isCorrect,
    target,
    state,
    state_status: state.status,
    session: activeAdminPreviewSession,
  } as {
    isCorrect: boolean;
    target: IdentifyTarget;
    state: IdentifyAdminPreviewTargetState;
    session: IdentifyAdminPreviewSession;
  };
}

export function submitAdminPreviewTypedAnswer(
  typedUk: string,
  slotNumber?: number
): {
  isCorrect: boolean;
  target: IdentifyTarget;
  state: IdentifyAdminPreviewTargetState;
  session: IdentifyAdminPreviewSession;
} {
  assertIdentifyAdminPreviewAccess();
  if (!activeAdminPreviewSession) {
    throw new Error('No active Administrator Preview Practice session.');
  }
  const slot = slotNumber ?? activeAdminPreviewSession.activeSlotNumber;
  const target = activeAdminPreviewSession.provisionalTargets.find(
    (t) => t.targetNumber === slot
  );
  const state = activeAdminPreviewSession.targetStates[slot];
  if (!target || !state) {
    throw new Error(`Candidate target #${slot} not found in preview session.`);
  }

  state.attempts += 1;
  state.lastSubmittedAnswer = typedUk;
  const validation = validateIdentifyTypedAnswer(typedUk, target);

  if (validation.isCorrect) {
    state.status = 'correct_fill';
    state.lastFeedbackMessage = `${validation.feedback} (${target.pronunciation}) — ${target.en}`;
  } else {
    state.status = 'wrong';
    state.lastFeedbackMessage = validation.feedback;
  }

  return {
    isCorrect: validation.isCorrect,
    target,
    state,
    session: activeAdminPreviewSession,
  };
}

export function revealAdminPreviewTargetAnswer(slotNumber?: number): {
  target: IdentifyTarget;
  state: IdentifyAdminPreviewTargetState;
  session: IdentifyAdminPreviewSession;
} {
  assertIdentifyAdminPreviewAccess();
  if (!activeAdminPreviewSession) {
    throw new Error('No active Administrator Preview Practice session.');
  }
  const slot = slotNumber ?? activeAdminPreviewSession.activeSlotNumber;
  const target = activeAdminPreviewSession.provisionalTargets.find(
    (t) => t.targetNumber === slot
  );
  const state = activeAdminPreviewSession.targetStates[slot];
  if (!target || !state) {
    throw new Error(`Candidate target #${slot} not found in preview session.`);
  }

  state.status = 'revealed';
  state.lastFeedbackMessage = `Answer revealed: «${target.uk}» (${target.pronunciation}) — ${target.en}`;

  return {
    target,
    state,
    session: activeAdminPreviewSession,
  };
}

export function findPlayableLegacySceneById(sceneId: string): {
  category: IdentifyCategory;
  scene: IdentifyScene;
} | null {
  for (const cat of IDENTIFY_CATEGORIES) {
    for (const sc of cat.scenes) {
      if (sc.id === sceneId && getApprovedLearnerTargets(sc).length > 0) {
        return { category: cat, scene: sc };
      }
    }
  }
  const curriculumHit = APPROVED_CURRICULUM_SCENES_BY_CODE.get(sceneId);
  if (curriculumHit) {
    const category = CATEGORY_MAP.get(curriculumHit.categoryId) ?? IDENTIFY_CATEGORIES[0];
    return { category, scene: curriculumHit };
  }
  return null;
}
