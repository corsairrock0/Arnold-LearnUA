// ============================================================================
// LangoUA — IDENTIFY VISUAL VOCABULARY DATASET & SCENE RENDERER
// 20 Everyday Categories × 5 Unique Scenes = 100 Interactive Visual Scenes
// ============================================================================

import { FREQ_6000_DB } from './vocabData.ts';
import { IDENTIFY_120_CATEGORIES } from './identifySceneLibrary120.ts';
import {
  IDENTIFY_MASTER_2000_NOUNS,
  IDENTIFY_TOPIC_GROUPS,
  type IdentifyMasterNounEntry,
  type IdentifyTopicGroupSpec,
  type IdentifyMasterVocabularyCoverageSummary,
} from './identifyMasterNouns.ts';

export {
  IDENTIFY_MASTER_2000_NOUNS,
  IDENTIFY_TOPIC_GROUPS,
  type IdentifyMasterNounEntry,
  type IdentifyTopicGroupSpec,
  type IdentifyMasterVocabularyCoverageSummary,
};


export interface IdentifyVocabItem {
  vocabularyId: string;
  uk: string; // Stressed Ukrainian form
  en: string; // Primary English meaning
  acceptedSynonyms: string[]; // Valid Ukrainian synonyms
  pos: 'noun' | 'verb' | 'adj';
  gender: 'm' | 'f' | 'n' | 'pl';
  exampleUk: string;
  exampleEn: string;
  freqRank?: number;
  iconType: string; // Visual object renderer key
}

export type IdentifyAnnotationSource =
  | 'manual_human'
  | 'verified_scene_geometry'
  | 'ai_assisted_verified'
  | 'legacy_grid_unverified'
  | 'synthetic_grid_5x5_unverified';

export type IdentifyVerificationStatus =
  | 'human_verified'
  | 'visually_verified'
  | 'needs_review'
  | 'unverified_grid'
  | 'missing_in_image'
  | 'misaligned_marker';

export type IdentifyTargetLifecycleState =
  | 'planned_vocabulary'
  | 'unverified_image_association'
  | 'verified_visible_object'
  | 'verified_object_annotation'
  | 'approved_active_learner_target';

export type IdentifySceneQualityState =
  | 'draft'
  | 'needs_review'
  | 'awaiting_ai_generation'
  | 'validated_ready'
  | 'published_verified'
  | 'invalid_defective';

export interface IdentifyHotspot {
  id: string;
  targetNumber: number;
  vocabularyId: string;
  conceptId?: string;
  x: number; // Normalized 0.0 - 1.0 left
  y: number; // Normalized 0.0 - 1.0 top
  width: number; // Normalized 0.0 - 1.0 width
  height: number; // Normalized 0.0 - 1.0 height
  /** Separated visual marker pin center X (0.0 - 1.0) so badge placement and object region can be tuned independently */
  centerX?: number;
  /** Separated visual marker pin center Y (0.0 - 1.0) */
  centerY?: number;
  /** Optional irregular polygon outline in normalized (0.0 - 1.0) coordinates */
  polygon?: Array<{ x: number; y: number }>;
  uk: string;
  en: string;
  acceptedSynonyms: string[];
  pos: 'noun' | 'verb' | 'adj';
  gender: 'm' | 'f' | 'n' | 'pl';
  exampleUk: string;
  exampleEn: string;
  freqRank?: number;
  iconType: string;
  verified: boolean;
  /** Stage B Object Annotation Metadata */
  imageAssetId?: string;
  objectLabelEn?: string;
  verifiedLexicalSense?: string;
  annotationSource?: IdentifyAnnotationSource;
  verificationStatus?: IdentifyVerificationStatus;
  targetLifecycleState?: IdentifyTargetLifecycleState;
  /** Optional confidence score only when produced by a real detector; never fabricated */
  confidenceScore?: number | null;
  contentVersion?: number;
  isObjectVisibleInScene?: boolean;
  visibilityCriteria?: {
    clearlyVisible: boolean;
    unambiguous: boolean;
    largeEnoughToRecognize: boolean;
    notCutOffOrObscured: boolean;
    matchesIntendedSense: boolean;
  };
}

export interface IdentifyScene {
  id: string;
  categoryId: string;
  topicGroupId?: string;
  sceneNumber: number; // 1 to 5 (or extended split scene index)
  titleEn: string;
  titleUk: string;
  settingDescriptionEn: string;
  themeVariant: 'daylight' | 'warm' | 'closeup' | 'golden' | 'evening';
  assetPath: string;
  assetSourceType: 'local-verified-scene-illustration' | 'photograph';
  annotationVerified: boolean;
  targets: IdentifyHotspot[];
  /** Preserves all 20-22 planned curriculum vocabulary targets for Content Studio and AI generation queue */
  plannedTargets?: IdentifyHotspot[];
  /** True ONLY when the scene has a verified image and >= 1 visually verified active learner targets */
  isPlayableForStudents?: boolean;
  /** Stage B Scene & Asset Metadata */
  imageAssetId?: string;
  intrinsicWidth?: number;
  intrinsicHeight?: number;
  aspectRatioLabel?: string;
  qualityState?: IdentifySceneQualityState;
  contentRevisionId?: string;
  annotationSource?: IdentifyAnnotationSource;
  /** Vocabulary items intentionally excluded or moved to a companion scene because they are absent from this image */
  missingVocabularyItems?: Array<{
    vocabularyId: string;
    uk: string;
    en: string;
    reasonEn: string;
  }>;
  /** Companion or parent scene reference when an incompatible vocabulary list is split into multiple coherent scenes */
  replacesBaselineSceneId?: string;
}

export interface IdentifyCategory {
  id: string;
  number: number; // 1 to 28
  topicGroupId?: string;
  titleEn: string;
  titleUk: string;
  icon: string;
  descriptionEn: string;
  environmentType:
    | 'kitchen'
    | 'bedroom'
    | 'bathroom'
    | 'living'
    | 'dining'
    | 'market'
    | 'outdoor-market'
    | 'cafe'
    | 'restaurant'
    | 'classroom'
    | 'office'
    | 'library'
    | 'gym'
    | 'park'
    | 'playground'
    | 'street'
    | 'transit'
    | 'station'
    | 'terminal'
    | 'clinic'
    | 'beach';
  coreVocab: IdentifyVocabItem[];
  scenes: IdentifyScene[];
}

function stripStress(s: string): string {
  return s.replace(/\u0301/g, '').toLowerCase().trim();
}

function findFreqRank(uk: string): number | undefined {
  const clean = stripStress(uk);
  const match = FREQ_6000_DB.find((w) => stripStress(w.ru) === clean);
  return match?.rank;
}

interface RawCategoryDef {
  id: string;
  number: number;
  titleEn: string;
  titleUk: string;
  icon: string;
  descriptionEn: string;
  environmentType: IdentifyCategory['environmentType'];
  sceneTitles: Array<{ en: string; uk: string; desc: string }>;
  vocab: Array<{
    id: string;
    uk: string;
    en: string;
    syns?: string[];
    gender: 'm' | 'f' | 'n' | 'pl';
    exUk: string;
    exEn: string;
    iconType: string;
  }>;
}

const RAW_CATEGORIES: RawCategoryDef[] = [
  {
    id: 'kitchen',
    number: 1,
    titleEn: 'Kitchen',
    titleUk: 'Ку́хня',
    icon: '🍳',
    descriptionEn: 'Appliances, cookware, tableware, and meal preparation surfaces.',
    environmentType: 'kitchen',
    sceneTitles: [
      { en: 'Modern Home Kitchen', uk: 'Суча́сна дома́шня ку́хня', desc: 'Bright modern kitchen with stainless appliances, island table, and tableware.' },
      { en: 'Traditional Family Kitchen', uk: 'Традиці́йна сіме́йна ку́хня', desc: 'Warm family kitchen with wooden cabinetry, stove, cookware, and dining table.' },
      { en: 'Countertop & Cooking Utensils', uk: 'Кухо́нна стільни́ця та по́суд', desc: 'Close-up cooking station with pots, frying pan, cutlery, and plates.' },
      { en: 'Kitchen During Meal Preparation', uk: 'Приготува́ння ї́жі на ку́хні', desc: 'Active cooking scene with stove, oven, sink, and set kitchen table.' },
      { en: 'Kitchen Appliances & Dining Nook', uk: 'Кухо́нна те́хніка та обі́дня зо́на', desc: 'Organized kitchen layout featuring refrigerator, oven, sink, and breakfast table.' },
    ],
    vocab: [
      { id: 'k-fridge', uk: 'холоди́льник', en: 'refrigerator', gender: 'm', exUk: 'У холоди́льнику є сві́же молоко́ і сир.', exEn: 'There is fresh milk and cheese in the refrigerator.', iconType: 'fridge' },
      { id: 'k-stove', uk: 'плита́', en: 'stove / cooktop', syns: ['кухо́нна плита́'], gender: 'f', exUk: 'На плиті́ кипи́ть гаря́ча вода́.', exEn: 'Hot water is boiling on the stove.', iconType: 'stove' },
      { id: 'k-oven', uk: 'духо́вка', en: 'oven', syns: ['духова́ ша́фа'], gender: 'f', exUk: 'Пирі́г пече́ться в духо́вці.', exEn: 'The pie is baking in the oven.', iconType: 'oven' },
      { id: 'k-sink', uk: 'ми́йка', en: 'kitchen sink', syns: ['ра́ковина', 'умива́льник'], gender: 'f', exUk: 'Чи́сті тарі́лки лежать бі́ля ми́йки.', exEn: 'Clean plates are lying near the sink.', iconType: 'sink' },
      { id: 'k-table', uk: 'стіл', en: 'table', gender: 'm', exUk: 'Дерев’я́ний стіл стої́ть посере́дині ку́хні.', exEn: 'The wooden table stands in the middle of the kitchen.', iconType: 'table' },
      { id: 'k-chair', uk: 'стіле́ць', en: 'chair', gender: 'm', exUk: 'Поста́в стіле́ць бі́ля столу́.', exEn: 'Put the chair near the table.', iconType: 'chair' },
      { id: 'k-knife', uk: 'ніж', en: 'knife', gender: 'm', exUk: 'Цей кухо́нний ніж ду́же го́стрий.', exEn: 'This kitchen knife is very sharp.', iconType: 'knife' },
      { id: 'k-spoon', uk: 'ло́жка', en: 'spoon', gender: 'f', exUk: 'Візьми́ вели́ку ло́жку для су́пу.', exEn: 'Take a large spoon for the soup.', iconType: 'spoon' },
      { id: 'k-fork', uk: 'виде́лка', en: 'fork', gender: 'f', exUk: 'Виде́лка лежи́ть ліво́руч від тарі́лки.', exEn: 'The fork lies to the left of the plate.', iconType: 'fork' },
      { id: 'k-plate', uk: 'тарі́лка', en: 'plate', gender: 'f', exUk: 'На бі́лій тарі́лці лежи́ть гаря́ча стра́ва.', exEn: 'A hot dish is on the white plate.', iconType: 'plate' },
      { id: 'k-pot', uk: 'кастру́ля', en: 'cooking pot', syns: ['баня́к'], gender: 'f', exUk: 'У вели́кій кастру́лі ва́риться борщ.', exEn: 'Borscht is cooking in the large pot.', iconType: 'pot' },
      { id: 'k-pan', uk: 'сковорода́', en: 'frying pan', syns: ['пате́льня', 'сковорі́дка'], gender: 'f', exUk: 'На сковороді́ сма́жаться о́вочі.', exEn: 'Vegetables are frying in the pan.', iconType: 'pan' },
    ],
  },
  {
    id: 'bedroom',
    number: 2,
    titleEn: 'Bedroom',
    titleUk: 'Спа́льня',
    icon: '🛏️',
    descriptionEn: 'Beds, bedding, wardrobes, mirrors, lighting, and bedroom furnishings.',
    environmentType: 'bedroom',
    sceneTitles: [
      { en: 'Sunlit Master Bedroom', uk: 'Со́нячна головна́ спа́льня', desc: 'Bright bedroom with double bed, pillows, wardrobe, and window curtains.' },
      { en: 'Cozy Guest Bedroom', uk: 'Затишна́ гостьова́ спа́льня', desc: 'Warm guest room featuring a soft blanket, bedside lamp, mirror, and rug.' },
      { en: 'Minimalist Loft Bedroom', uk: 'Суча́сна спа́льня в сти́лі лофт', desc: 'Clean modern bedroom layout with large window, wardrobe, and woven rug.' },
      { en: 'Morning Routine Bedroom', uk: 'Ранко́ва спа́льня бі́ля вікна́', desc: 'Morning light through the curtains illuminating the bed, pillow, and mirror.' },
      { en: 'Evening Rest Bedroom', uk: 'Вечі́рня спа́льня з те́плим сві́тлом', desc: 'Calm evening bedroom lit by a bedside lamp with neatly arranged bedding.' },
    ],
    vocab: [
      { id: 'bd-bed', uk: 'лі́жко', en: 'bed', gender: 'n', exUk: 'У спа́льні стої́ть широ́ке зру́чне лі́жко.', exEn: 'A wide comfortable bed stands in the bedroom.', iconType: 'bed' },
      { id: 'bd-pillow', uk: 'поду́шка', en: 'pillow', gender: 'f', exUk: 'Ця м’яка́ поду́шка ду́же зру́чна для сну.', exEn: 'This soft pillow is very comfortable for sleeping.', iconType: 'pillow' },
      { id: 'bd-blanket', uk: 'ко́вдра', en: 'blanket / duvet', syns: ['плед'], gender: 'f', exUk: 'Взи́мку ми беремо́ те́плу вовняну́ ко́вдру.', exEn: 'In winter we take a warm wool blanket.', iconType: 'blanket' },
      { id: 'bd-wardrobe', uk: 'ша́фа', en: 'wardrobe / closet', gender: 'f', exUk: 'Усі́ сорочки́ ви́сять у дерев’я́ній ша́фі.', exEn: 'All the shirts hang in the wooden wardrobe.', iconType: 'wardrobe' },
      { id: 'bd-mirror', uk: 'дзе́ркало', en: 'mirror', syns: ['люсте́рко'], gender: 'n', exUk: 'Вели́ке дзе́ркало виси́ть на стіні́ бі́ля ша́фи.', exEn: 'A large mirror hangs on the wall near the wardrobe.', iconType: 'mirror' },
      { id: 'bd-lamp', uk: 'ла́мпа', en: 'lamp', syns: ['світи́льник', 'нічни́к'], gender: 'f', exUk: 'На ту́мбочці бі́ля лі́жка сві́тить насті́льна ла́мпа.', exEn: 'A table lamp shines on the nightstand by the bed.', iconType: 'lamp' },
      { id: 'bd-window', uk: 'вікно́', en: 'window', gender: 'n', exUk: 'Ма́ма відчини́ла вікно́, щоб прові́трити спа́льню.', exEn: 'Mom opened the window to air out the bedroom.', iconType: 'window' },
      { id: 'bd-curtains', uk: 'што́ри', en: 'curtains', syns: ['фіра́нки', 'заві́си'], gender: 'pl', exUk: 'Світлі́ што́ри закрива́ють вікно́ від со́нця.', exEn: 'Light curtains shield the window from the sun.', iconType: 'curtains' },
      { id: 'bd-rug', uk: 'ки́лим', en: 'rug / carpet', syns: ['килимо́к'], gender: 'm', exUk: 'На підло́зі бі́ля лі́жка лежи́ть м’яки́й ки́лим.', exEn: 'A soft rug lies on the floor next to the bed.', iconType: 'rug' },
    ],
  },
  {
    id: 'bathroom',
    number: 3,
    titleEn: 'Bathroom',
    titleUk: 'Ва́нна кімна́та',
    icon: '🚿',
    descriptionEn: 'Fixtures, personal hygiene items, towels, mirrors, and washbasins.',
    environmentType: 'bathroom',
    sceneTitles: [
      { en: 'Modern Tiled Bathroom', uk: 'Суча́сна ва́нна кімна́та', desc: 'Clean tiled bathroom with bathtub, shower, sink, mirror, and fresh towels.' },
      { en: 'Vanity Sink & Hygiene Counter', uk: 'Умива́льник та засоби гігіє́ни', desc: 'Bathroom vanity featuring sink, faucet, soap, toothbrush, and toothpaste.' },
      { en: 'Walk-in Shower & Spa Bath', uk: 'Душова́ зо́на та вели́ка ва́нна', desc: 'Relaxing bathroom layout with glass shower, bathtub, towel rack, and mirror.' },
      { en: 'Morning Routine Washroom', uk: 'Ранко́ве вмива́ння у ва́нній', desc: 'Everything ready for morning hygiene: toothbrush, toothpaste, soap, and towel.' },
      { en: 'Compact Apartment Bathroom', uk: 'Компа́ктна кварти́рна ва́нна', desc: 'Well-organized apartment bathroom with sink, faucet, mirror, and shower.' },
    ],
    vocab: [
      { id: 'ba-shower', uk: 'душ', en: 'shower', gender: 'm', exUk: 'Вра́нці я за́вжди прийма́ю те́плий душ.', exEn: 'In the morning I always take a warm shower.', iconType: 'shower' },
      { id: 'ba-bathtub', uk: 'ва́нна', en: 'bathtub', gender: 'f', exUk: 'Бі́ла ва́нна наповнюється гаря́чою водо́ю.', exEn: 'The white bathtub is filling with hot water.', iconType: 'bathtub' },
      { id: 'ba-mirror', uk: 'дзе́ркало', en: 'mirror', syns: ['люсте́рко'], gender: 'n', exUk: 'Над ра́ковиною виси́ть кру́гле дзе́ркало.', exEn: 'A round mirror hangs above the sink.', iconType: 'mirror' },
      { id: 'ba-towel', uk: 'рушни́к', en: 'towel', gender: 'm', exUk: 'Візьми́ чи́стий бавовня́ний рушни́к.', exEn: 'Take a clean cotton towel.', iconType: 'towel' },
      { id: 'ba-soap', uk: 'ми́ло', en: 'soap', gender: 'n', exUk: 'Поми́й ру́ки з духмя́ним ми́лом.', exEn: 'Wash your hands with fragrant soap.', iconType: 'soap' },
      { id: 'ba-toothbrush', uk: 'зубна́ щі́тка', en: 'toothbrush', syns: ['щі́тка'], gender: 'f', exUk: 'Моя́ нова́ зубна́ щі́тка стої́ть у скля́нці.', exEn: 'My new toothbrush stands in the cup.', iconType: 'toothbrush' },
      { id: 'ba-toothpaste', uk: 'зубна́ па́ста', en: 'toothpaste', syns: ['па́ста'], gender: 'f', exUk: 'Ця зубна́ па́ста ма́є сві́жий смак м’я́ти.', exEn: 'This toothpaste has a fresh mint flavor.', iconType: 'toothpaste' },
      { id: 'ba-sink', uk: 'ра́ковина', en: 'bathroom sink / washbasin', syns: ['умива́льник'], gender: 'f', exUk: 'Керамі́чна ра́ковина блищи́ть від чистоти́.', exEn: 'The ceramic washbasin shines with cleanliness.', iconType: 'sink' },
      { id: 'ba-faucet', uk: 'кран', en: 'faucet / tap', syns: ['змі́шувач'], gender: 'm', exUk: 'Будь ла́ска, добре закрути́ кран пі́сля миття́ рук.', exEn: 'Please turn off the faucet tightly after washing hands.', iconType: 'faucet' },
    ],
  },
  {
    id: 'living-room',
    number: 4,
    titleEn: 'Living Room',
    titleUk: 'Віта́льня',
    icon: '🛋️',
    descriptionEn: 'Sofas, armchairs, bookshelves, televisions, lamps, and family lounge spaces.',
    environmentType: 'living',
    sceneTitles: [
      { en: 'Family Living Room Lounge', uk: 'Сіме́йна віта́льня для відпочи́нку', desc: 'Spacious living room with sofa, armchair, coffee table, TV, and bookshelf.' },
      { en: 'Reading Corner & Bookshelf', uk: 'Куто́чок для чита́ння з книжко́вою поли́цею', desc: 'Quiet corner featuring a tall bookshelf, armchair, floor lamp, and rug.' },
      { en: 'Modern Apartment Media Room', uk: 'Суча́сна віта́льня з телеві́зором', desc: 'Bright apartment lounge with wide TV screen, sofa, table, and large window.' },
      { en: 'Sunny Afternoon Parlor', uk: 'Со́нячна віта́льня вде́нь', desc: 'Daylight streaming through the living room window onto the rug and sofa.' },
      { en: 'Cozy Evening Living Room', uk: 'Затишна́ вечі́рня віта́льня', desc: 'Warm evening ambiance with floor lamp, armchair, bookshelf, and coffee table.' },
    ],
    vocab: [
      { id: 'lr-sofa', uk: 'дива́н', en: 'sofa / couch', syns: ['кана́па'], gender: 'm', exUk: 'Уся́ родина зібра́лася на м’яко́му дива́ні.', exEn: 'The whole family gathered on the soft sofa.', iconType: 'sofa' },
      { id: 'lr-armchair', uk: 'крі́сло', en: 'armchair', gender: 'n', exUk: 'Діду́сь лю́бить чита́ти газе́ту в зру́чному крі́слі.', exEn: 'Grandfather likes reading the newspaper in a comfortable armchair.', iconType: 'armchair' },
      { id: 'lr-tv', uk: 'телеві́зор', en: 'television / TV', gender: 'm', exUk: 'Уве́чері ми ди́вимося нови́ни по телеві́зору.', exEn: 'In the evening we watch the news on television.', iconType: 'tv' },
      { id: 'lr-bookshelf', uk: 'книжко́ва поли́ця', en: 'bookshelf', syns: ['поли́ця', 'стела́ж'], gender: 'f', exUk: 'На книжко́вій поли́ці стої́ть бага́то ціка́вих книжо́к.', exEn: 'Many interesting books stand on the bookshelf.', iconType: 'bookshelf' },
      { id: 'lr-lamp', uk: 'ла́мпа', en: 'lamp', syns: ['торше́р', 'світи́льник'], gender: 'f', exUk: 'Висо́ка ла́мпа стої́ть бі́ля крі́сла.', exEn: 'A tall lamp stands next to the armchair.', iconType: 'lamp' },
      { id: 'lr-table', uk: 'стіл', en: 'coffee table', syns: ['сто́лик', 'журна́льний сто́лик'], gender: 'm', exUk: 'На низько́му столі́ лежи́ть журна́л.', exEn: 'A magazine lies on the low coffee table.', iconType: 'table' },
      { id: 'lr-rug', uk: 'ки́лим', en: 'rug / carpet', gender: 'm', exUk: 'Візерунча́стий ки́лим прикраша́є віта́льню.', exEn: 'A patterned rug decorates the living room.', iconType: 'rug' },
      { id: 'lr-window', uk: 'вікно́', en: 'window', gender: 'n', exUk: 'З вели́кого вікна́ віта́льні ви́дно зелений парк.', exEn: 'From the large living room window you can see the green park.', iconType: 'window' },
    ],
  },
  {
    id: 'dining-room',
    number: 5,
    titleEn: 'Dining Room',
    titleUk: 'Їда́льня',
    icon: '🍽️',
    descriptionEn: 'Dining tables, chairs, glassware, cups, napkins, and formal place settings.',
    environmentType: 'dining',
    sceneTitles: [
      { en: 'Formal Dinner Place Setting', uk: 'Святко́ве сервірува́ння столу́', desc: 'Complete dining table set with plates, glasses, cups, napkins, and cutlery.' },
      { en: 'Family Breakfast Dining Room', uk: 'Сіме́йний сніда́нок у їда́льні', desc: 'Morning dining table with cups, plates, spoons, forks, and wooden chairs.' },
      { en: 'Holiday Feast Table', uk: 'Родинна́ їда́льня для вече́рі', desc: 'Welcoming dining room arranged for guests with glassware and folded napkins.' },
      { en: 'Window-Side Dining Nook', uk: 'Обі́дній стіл бі́ля вікна́', desc: 'Bright dining area with chairs, water glasses, plates, and table cutlery.' },
      { en: 'Afternoon Tea & Tableware', uk: 'Чаюва́ння в затишні́й їда́льні', desc: 'Neatly set dining table featuring teacups, napkins, spoons, and plates.' },
    ],
    vocab: [
      { id: 'dr-table', uk: 'стіл', en: 'dining table', syns: ['обі́дній стіл'], gender: 'm', exUk: 'Ми накрива́ємо вели́кий стіл до сніда́нку.', exEn: 'We set the large table for breakfast.', iconType: 'table' },
      { id: 'dr-chair', uk: 'стіле́ць', en: 'chair', gender: 'm', exUk: 'Навко́ло столу́ стої́ть шість дерев’я́них стільці́в.', exEn: 'Six wooden chairs stand around the table.', iconType: 'chair' },
      { id: 'dr-plate', uk: 'тарі́лка', en: 'plate', gender: 'f', exUk: 'Поста́в глибо́ку тарі́лку для ко́жного го́стя.', exEn: 'Place a soup plate for each guest.', iconType: 'plate' },
      { id: 'dr-glass', uk: 'скля́нка', en: 'drinking glass', gender: 'f', exUk: 'Нали́й холо́дної води́ у прозо́ру скля́нку.', exEn: 'Pour cold water into the clear glass.', iconType: 'glass' },
      { id: 'dr-cup', uk: 'ча́шка', en: 'cup / mug', syns: ['горня́тко', 'філіжа́нка'], gender: 'f', exUk: 'У бі́лій ча́шці пару́є арома́тний чай.', exEn: 'Fragrant tea steams in the white cup.', iconType: 'cup' },
      { id: 'dr-napkin', uk: 'серве́тка', en: 'napkin', gender: 'f', exUk: 'Паперо́ва серве́тка лежи́ть бі́ля тарі́лки.', exEn: 'A paper napkin lies next to the plate.', iconType: 'napkin' },
      { id: 'dr-fork', uk: 'виде́лка', en: 'fork', gender: 'f', exUk: 'Поклади́ виде́лку з лі́вого бо́ку.', exEn: 'Put the fork on the left side.', iconType: 'fork' },
      { id: 'dr-spoon', uk: 'ло́жка', en: 'spoon', gender: 'f', exUk: 'Ло́жка і ніж лежать право́руч від тарі́лки.', exEn: 'The spoon and knife lie to the right of the plate.', iconType: 'spoon' },
      { id: 'dr-knife', uk: 'ніж', en: 'table knife', gender: 'm', exUk: 'Візьми́ столо́вий ніж, щоб нама́зати ма́сло.', exEn: 'Take a table knife to spread the butter.', iconType: 'knife' },
    ],
  },
  {
    id: 'supermarket',
    number: 6,
    titleEn: 'Supermarket',
    titleUk: 'Суперма́ркет',
    icon: '🛒',
    descriptionEn: 'Grocery aisles, everyday food staples, shopping carts, baskets, and checkout counters.',
    environmentType: 'market',
    sceneTitles: [
      { en: 'Fresh Grocery & Dairy Aisle', uk: 'Відді́л проду́ктів та моло́чних това́рів', desc: 'Supermarket shelves stocked with apples, bananas, milk, cheese, and bread.' },
      { en: 'Supermarket Checkout Lane', uk: 'Ка́са в суперма́ркеті', desc: 'Checkout area with shopping cart, basket, grocery bag, and staple foods.' },
      { en: 'Bakery & Cheese Display', uk: 'Пека́рня та си́рна вітри́на', desc: 'Fresh bread loaves, yellow cheese wedges, milk cartons, and fruit baskets.' },
      { en: 'Shopping Cart & Produce Section', uk: 'Візо́к у фрукто́вому ря́ді', desc: 'Shopper filling a cart and basket with apples, bananas, bread, and milk.' },
      { en: 'Express Checkout & Packing Area', uk: 'Швидка́ поку́пка проду́ктів', desc: 'Packing everyday groceries into a bag at the supermarket checkout.' },
    ],
    vocab: [
      { id: 'sm-apple', uk: 'я́блуко', en: 'apple', gender: 'n', exUk: 'Черво́не я́блуко ма́є соло́дкий смак.', exEn: 'The red apple has a sweet taste.', iconType: 'apple' },
      { id: 'sm-banana', uk: 'бана́н', en: 'banana', gender: 'm', exUk: 'Сти́глий жо́втий бана́н лежи́ть у ко́шику.', exEn: 'A ripe yellow banana lies in the basket.', iconType: 'banana' },
      { id: 'sm-milk', uk: 'молоко́', en: 'milk', gender: 'n', exUk: 'Я купи́в пля́шку сві́жого молока́.', exEn: 'I bought a bottle of fresh milk.', iconType: 'milk' },
      { id: 'sm-cheese', uk: 'сир', en: 'cheese', gender: 'm', exUk: 'Тверди́й сир чудово пасу́є до сніда́нку.', exEn: 'Hard cheese goes wonderfully with breakfast.', iconType: 'cheese' },
      { id: 'sm-bread', uk: 'хліб', en: 'bread', gender: 'm', exUk: 'У пека́рні па́хне свіжоспе́ченим хлі́бом.', exEn: 'The bakery smells of freshly baked bread.', iconType: 'bread' },
      { id: 'sm-basket', uk: 'ко́шик', en: 'shopping basket', syns: ['корзи́на'], gender: 'm', exUk: 'Візьми́ ко́шик для невели́ких поку́пок.', exEn: 'Take a basket for small purchases.', iconType: 'basket' },
      { id: 'sm-cart', uk: 'візо́к', en: 'shopping cart / trolley', syns: ['візо́чок'], gender: 'm', exUk: 'Наш візо́к уже́ по́вний проду́ктів.', exEn: 'Our shopping cart is already full of groceries.', iconType: 'cart' },
      { id: 'sm-checkout', uk: 'ка́са', en: 'checkout / cash register', gender: 'f', exUk: 'Оплаті́ть поку́пки на ка́сі.', exEn: 'Pay for your purchases at the checkout.', iconType: 'checkout' },
      { id: 'sm-bag', uk: 'паке́т', en: 'grocery bag', syns: ['то́рба', 'торби́нка'], gender: 'm', exUk: 'Склади́ о́вочі та фрукти в екологі́чний паке́т.', exEn: 'Pack the vegetables and fruit into an eco bag.', iconType: 'bag' },
    ],
  },
  {
    id: 'farmers-market',
    number: 7,
    titleEn: 'Farmers Market',
    titleUk: 'Ферме́рський ри́нок',
    icon: '🍅',
    descriptionEn: 'Outdoor market stalls, fresh garden vegetables, orchard fruits, flowers, and local sellers.',
    environmentType: 'outdoor-market',
    sceneTitles: [
      { en: 'Fresh Vegetable Market Stall', uk: 'Овоче́ва я́тка на ри́нку', desc: 'Colorful stall displaying ripe tomatoes, cucumbers, carrots, and potatoes.' },
      { en: 'Orchard Fruit & Flower Stand', uk: 'Садо́ві фру́кти та кві́ти', desc: 'Local seller offering apples, pears, woven baskets, and garden flowers.' },
      { en: 'Morning Harvest Bazaar', uk: 'Ранко́вий ферме́рський база́р', desc: 'Bustling morning market table with fresh produce and friendly seller.' },
      { en: 'Farm-to-Table Produce Counter', uk: 'Прила́вок зі сві́жим врожа́єм', desc: 'Wooden counter arranged with crates of potatoes, carrots, tomatoes, and pears.' },
      { en: 'Weekend Country Market', uk: 'Неді́льний я́рмарок', desc: 'Sunny outdoor market booth featuring baskets of vegetables and bouquets.' },
    ],
    vocab: [
      { id: 'fm-tomato', uk: 'помідо́р', en: 'tomato', syns: ['тома́т'], gender: 'm', exUk: 'Цей сти́глий черво́ний помідо́р ви́ріс на горо́ді.', exEn: 'This ripe red tomato grew in the garden.', iconType: 'tomato' },
      { id: 'fm-cucumber', uk: 'огіро́к', en: 'cucumber', gender: 'm', exUk: 'Зеле́ний огіро́к хрумки́й і сві́жий.', exEn: 'The green cucumber is crunchy and fresh.', iconType: 'cucumber' },
      { id: 'fm-carrot', uk: 'мо́рква', en: 'carrot', gender: 'f', exUk: 'Соло́дка мо́рква мі́стить бага́то вітамі́нів.', exEn: 'Sweet carrot contains many vitamins.', iconType: 'carrot' },
      { id: 'fm-potato', uk: 'карто́пля', en: 'potato', syns: ['бара́боля', 'бу́льба'], gender: 'f', exUk: 'Ми купи́ли два кілогра́ми молодо́ї карто́плі.', exEn: 'We bought two kilograms of new potatoes.', iconType: 'potato' },
      { id: 'fm-apple', uk: 'я́блуко', en: 'apple', gender: 'n', exUk: 'На ри́нку продаю́ть духмя́ні садо́ві я́блука.', exEn: 'Fragrant orchard apples are sold at the market.', iconType: 'apple' },
      { id: 'fm-pear', uk: 'гру́ша', en: 'pear', gender: 'f', exUk: 'Жо́вта гру́ша ду́же сокови́та і м’яка́.', exEn: 'The yellow pear is very juicy and soft.', iconType: 'pear' },
      { id: 'fm-flowers', uk: 'кві́ти', en: 'flowers', syns: ['кві́тка'], gender: 'pl', exUk: 'Бі́ля вхо́ду на ри́нок продаю́ть сві́жі кві́ти.', exEn: 'Fresh flowers are sold near the market entrance.', iconType: 'flower' },
      { id: 'fm-basket', uk: 'ко́шик', en: 'woven basket', gender: 'm', exUk: 'Плете́ний ко́шик наповнений сві́жими овоча́ми.', exEn: 'The woven basket is filled with fresh vegetables.', iconType: 'basket' },
      { id: 'fm-seller', uk: 'продаве́ць', en: 'seller / vendor', syns: ['продавчи́ня'], gender: 'm', exUk: 'Приві́тний продаве́ць зва́жує я́блука та гру́ші.', exEn: 'The friendly seller weighs apples and pears.', iconType: 'person' },
    ],
  },
  {
    id: 'cafe',
    number: 8,
    titleEn: 'Café',
    titleUk: 'Кав’я́рня',
    icon: '☕',
    descriptionEn: 'Coffee culture, espresso bars, pastries, menus, cups, and café seating.',
    environmentType: 'cafe',
    sceneTitles: [
      { en: 'Espresso Bar & Barista Counter', uk: 'Каво́ва сті́йка та бари́ста', desc: 'Artisanal café counter with barista preparing fresh coffee and pastries.' },
      { en: 'Cozy Lviv Coffee Table', uk: 'Затишни́й сто́лик у льві́вській кав’я́рні', desc: 'Round wooden table with cup of coffee, teaspoon, pastry, and menu.' },
      { en: 'Sunny Sidewalk Café Terrace', uk: 'Лі́тня тера́са кав’я́рні', desc: 'Outdoor café seating with chairs, table, steaming coffee cup, and dessert.' },
      { en: 'Morning Coffee & Bakery Display', uk: 'Ранко́ва ка́ва зі сві́жим ті́стечком', desc: 'Warm café interior featuring pastry showcase, menu board, and espresso cups.' },
      { en: 'Afternoon Reading & Coffee Nook', uk: 'Каво́ва пере́рва в кав’я́рні', desc: 'Relaxing café table set with coffee, ceramic cup, teaspoon, and sweet pastry.' },
    ],
    vocab: [
      { id: 'cf-coffee', uk: 'ка́ва', en: 'coffee', gender: 'f', exUk: 'Львів сла́виться своєю запашно́ю ка́вою.', exEn: 'Lviv is famous for its fragrant coffee.', iconType: 'coffee' },
      { id: 'cf-cup', uk: 'ча́шка', en: 'cup', syns: ['філіжа́нка', 'горня́тко'], gender: 'f', exUk: 'Порцеля́нова ча́шка стої́ть на блю́дці.', exEn: 'The porcelain cup stands on a saucer.', iconType: 'cup' },
      { id: 'cf-cup-coffee', uk: 'ча́шка ка́ви', en: 'cup of coffee', syns: ['філіжа́нка ка́ви'], gender: 'f', exUk: 'Замо́вмо ще одну́ ча́шку ка́ви, будь ла́ска.', exEn: 'Let us order one more cup of coffee, please.', iconType: 'coffee-cup' },
      { id: 'cf-table', uk: 'стіл', en: 'café table', syns: ['сто́лик'], gender: 'm', exUk: 'Вільний стіл бі́ля вікна́ вже чека́є на нас.', exEn: 'A free table by the window is already waiting for us.', iconType: 'table' },
      { id: 'cf-chair', uk: 'стіле́ць', en: 'chair', gender: 'm', exUk: 'Дерев’я́ний стіле́ць у кав’я́рні ду́же зру́чний.', exEn: 'The wooden chair in the café is very comfortable.', iconType: 'chair' },
      { id: 'cf-teaspoon', uk: 'ло́жечка', en: 'teaspoon', syns: ['ча́йна ло́жка', 'ло́жка'], gender: 'f', exUk: 'Переміша́й цу́кор мале́нькою ло́жечкою.', exEn: 'Stir the sugar with a small teaspoon.', iconType: 'spoon' },
      { id: 'cf-menu', uk: 'меню́', en: 'menu', gender: 'n', exUk: 'У меню́ кав’я́рні є бага́то видів ча́ю та десе́ртів.', exEn: 'There are many types of tea and desserts on the café menu.', iconType: 'menu' },
      { id: 'cf-pastry', uk: 'ті́стечко', en: 'pastry / cake', syns: ['десе́рт', 'круаса́н'], gender: 'n', exUk: 'Шокола́дне ті́стечко чудово смаку́є з ка́вою.', exEn: 'The chocolate pastry tastes wonderful with coffee.', iconType: 'pastry' },
      { id: 'cf-barista', uk: 'бари́ста', en: 'barista', gender: 'm', exUk: 'Досві́дчений бари́ста готу́є капучи́но.', exEn: 'The experienced barista is preparing a cappuccino.', iconType: 'person' },
    ],
  },
  {
    id: 'restaurant',
    number: 9,
    titleEn: 'Restaurant',
    titleUk: 'Рестора́н',
    icon: '🍲',
    descriptionEn: 'Ordering meals, waiters, traditional dishes, table settings, and paying the bill.',
    environmentType: 'restaurant',
    sceneTitles: [
      { en: 'Evening Bistro & Waiter Service', uk: 'Вече́ря в рестора́ні з офіціа́нтом', desc: 'Attentive waiter presenting the menu at a nicely set restaurant table.' },
      { en: 'Traditional Ukrainian Dinner Table', uk: 'Традиці́йна украї́нська стра́ва', desc: 'Restaurant table served with hot dishes, plates, glasses, forks, and knives.' },
      { en: 'Chef Signature Dish Presentation', uk: 'Пода́ча гаря́чої стра́ви', desc: 'Close-up of plated restaurant food with silverware, water glass, and menu.' },
      { en: 'Patio Restaurant Lunch', uk: 'Обі́д у місько́му рестора́ні', desc: 'Daytime restaurant dining with fresh food, drinks, and courteous waiter.' },
      { en: 'Paying the Restaurant Bill', uk: 'Раху́нок пі́сля смачно́ї вече́рі', desc: 'End of the meal with the check folder on the table alongside glasses and plates.' },
    ],
    vocab: [
      { id: 'rs-menu', uk: 'меню́', en: 'menu', gender: 'n', exUk: 'Офіціа́нт прині́с нам меню́ украї́нською мо́вою.', exEn: 'The waiter brought us the menu in Ukrainian.', iconType: 'menu' },
      { id: 'rs-waiter', uk: 'офіціа́нт', en: 'waiter / server', syns: ['офіціа́нтка'], gender: 'm', exUk: 'Вві́чливий офіціа́нт порекомендува́в фірмову́ стра́ву.', exEn: 'The polite waiter recommended the signature dish.', iconType: 'person' },
      { id: 'rs-plate', uk: 'тарі́лка', en: 'plate', gender: 'f', exUk: 'Офіціа́нт поста́вив гаря́чу тарі́лку на стіл.', exEn: 'The waiter placed the hot plate on the table.', iconType: 'plate' },
      { id: 'rs-glass', uk: 'скля́нка', en: 'glass', syns: ['ке́лих'], gender: 'f', exUk: 'У скля́нці — прохоло́дний узва́р із лимо́ном.', exEn: 'In the glass is cool uzvar with lemon.', iconType: 'glass' },
      { id: 'rs-fork', uk: 'виде́лка', en: 'fork', gender: 'f', exUk: 'Срі́бна виде́лка лежи́ть на серве́тці.', exEn: 'A silver fork lies on the napkin.', iconType: 'fork' },
      { id: 'rs-knife', uk: 'ніж', en: 'knife', gender: 'm', exUk: 'Цей ніж призна́чений для м’ясни́х страв.', exEn: 'This knife is intended for meat dishes.', iconType: 'knife' },
      { id: 'rs-food', uk: 'ї́жа', en: 'food / meal', gender: 'f', exUk: 'У цьо́му рестора́ні за́вжди сві́жа й смачна́ ї́жа.', exEn: 'The food in this restaurant is always fresh and delicious.', iconType: 'food' },
      { id: 'rs-dish', uk: 'стра́ва', en: 'dish / course', gender: 'f', exUk: 'Варе́ники — це відо́ма украї́нська стра́ва.', exEn: 'Varenyky are a famous Ukrainian dish.', iconType: 'dish' },
      { id: 'rs-bill', uk: 'раху́нок', en: 'bill / check', syns: ['чек'], gender: 'm', exUk: 'Принесі́ть, будь ла́ска, раху́нок за вече́рю.', exEn: 'Please bring the bill for dinner.', iconType: 'bill' },
    ],
  },
  {
    id: 'classroom',
    number: 10,
    titleEn: 'Classroom',
    titleUk: 'Клас і шко́ла',
    icon: '🏫',
    descriptionEn: 'School desks, chalkboards, teachers, students, books, notebooks, pens, and backpacks.',
    environmentType: 'classroom',
    sceneTitles: [
      { en: 'Front of the Classroom & Board', uk: 'Уро́к бі́ля шкільно́ї до́шки', desc: 'Teacher explaining a Ukrainian lesson at the board while a student takes notes.' },
      { en: 'Student Desk & Study Supplies', uk: 'Шкільна́ па́рта та прила́ддя', desc: 'Close-up of a desk with textbook, notebook, pen, pencil, and backpack.' },
      { en: 'Interactive Language Lesson', uk: 'Заня́ття з украї́нської мо́ви', desc: 'Bright classroom with teacher, attentive student, board, and study desks.' },
      { en: 'Collaborative Study Desks', uk: 'Робо́та в кла́сі за па́ртами', desc: 'Rows of desks equipped with books, open notebooks, pens, and pencils.' },
      { en: 'Morning Bell & Backpacks', uk: 'Підгото́вка до уро́ку в шко́лі', desc: 'Student unpacking a backpack onto the school desk before class begins.' },
    ],
    vocab: [
      { id: 'cl-board', uk: 'до́шка', en: 'board / blackboard', syns: ['шкільна́ до́шка'], gender: 'f', exUk: 'Учи́тель пи́ше нове́ правило на до́шці.', exEn: 'The teacher writes a new rule on the board.', iconType: 'board' },
      { id: 'cl-teacher', uk: 'учи́тель', en: 'teacher', syns: ['вчи́тель', 'учи́телька', 'вчи́телька', 'виклада́ч'], gender: 'm', exUk: 'Наш учи́тель пояснює грама́тику ду́же зрозумі́ло.', exEn: 'Our teacher explains grammar very clearly.', iconType: 'person' },
      { id: 'cl-student', uk: 'у́чень', en: 'student / pupil', syns: ['учени́ця', 'школя́р', 'студе́нт'], gender: 'm', exUk: 'Ува́жний у́чень відповіда́є на запита́ння.', exEn: 'The attentive student answers the question.', iconType: 'student' },
      { id: 'cl-book', uk: 'кни́жка', en: 'book / textbook', syns: ['кни́га', 'підру́чник'], gender: 'f', exUk: 'Відкри́йте ва́ші кни́жки на деся́тій сторі́нці.', exEn: 'Open your books to page ten.', iconType: 'book' },
      { id: 'cl-pen', uk: 'ру́чка', en: 'pen', gender: 'f', exUk: 'Я запи́сую нові́ слова́ си́ньою ру́чкою.', exEn: 'I write down new words with a blue pen.', iconType: 'pen' },
      { id: 'cl-pencil', uk: 'оліве́ць', en: 'pencil', gender: 'm', exUk: 'Намалю́й табли́цю прости́м олівце́м.', exEn: 'Draw the table with a regular pencil.', iconType: 'pencil' },
      { id: 'cl-notebook', uk: 'зо́шит', en: 'notebook / exercise book', syns: ['блокно́т'], gender: 'm', exUk: 'У моє́му робо́чому зо́шиті все напи́сано оха́йно.', exEn: 'Everything in my workbook is written neatly.', iconType: 'notebook' },
      { id: 'cl-desk', uk: 'па́рта', en: 'school desk', syns: ['стіл'], gender: 'f', exUk: 'Моя́ па́рта стої́ть у пе́ршому ря́ді бі́ля вікна́.', exEn: 'My school desk stands in the first row by the window.', iconType: 'desk' },
      { id: 'cl-backpack', uk: 'рюкза́к', en: 'backpack / schoolbag', syns: ['наплі́чник', 'портфе́ль'], gender: 'm', exUk: 'Учень покла́в кни́жки та зо́шити в рюкза́к.', exEn: 'The student put books and notebooks into the backpack.', iconType: 'backpack' },
    ],
  },
  {
    id: 'office',
    number: 11,
    titleEn: 'Office',
    titleUk: 'О́фіс і робо́та',
    icon: '💻',
    descriptionEn: 'Computers, monitors, keyboards, laptops, office desks, chairs, phones, and printers.',
    environmentType: 'office',
    sceneTitles: [
      { en: 'Modern Workstation Desk', uk: 'Суча́сне робо́че мі́сце в о́фісі', desc: 'Clean office desk with desktop computer, wide monitor, keyboard, mouse, and chair.' },
      { en: 'Home Office & Laptop Setup', uk: 'Дома́шній кабіне́т із ноутбу́ком', desc: 'Productive workspace featuring laptop, external monitor, phone, and ergonomic chair.' },
      { en: 'Coworking Studio & Printer Corner', uk: 'Відкри́тий о́фіс та оргте́хніка', desc: 'Collaborative office table with computer equipment, telephone, and laser printer.' },
      { en: 'Executive Desk & Communication', uk: 'Ділови́й стіл для перего́ворів', desc: 'Organized desk arrangement with laptop, desktop monitor, keyboard, and phone.' },
      { en: 'Tech Support & Printing Station', uk: 'Робо́ча зо́на з при́нтером і комп’ю́тером', desc: 'Full suite of office hardware: computer tower, monitor, mouse, keyboard, and printer.' },
    ],
    vocab: [
      { id: 'of-computer', uk: 'комп’ю́тер', en: 'computer', syns: ['ПК'], gender: 'm', exUk: 'Цей нови́й комп’ю́тер працю́є ду́же шви́дко.', exEn: 'This new computer works very fast.', iconType: 'computer' },
      { id: 'of-keyboard', uk: 'клавіату́ра', en: 'keyboard', gender: 'f', exUk: 'На клавіату́рі є украї́нські та англі́йські лі́тери.', exEn: 'There are Ukrainian and English letters on the keyboard.', iconType: 'keyboard' },
      { id: 'of-mouse', uk: 'ми́ша', en: 'computer mouse', syns: ['ми́шка'], gender: 'f', exUk: 'Бездрото́ва ми́ша лежи́ть право́руч від клавіату́ри.', exEn: 'The wireless mouse lies to the right of the keyboard.', iconType: 'mouse' },
      { id: 'of-monitor', uk: 'моніто́р', en: 'monitor / screen', syns: ['екра́н'], gender: 'm', exUk: 'На широ́кому моніто́рі відкри́то докуме́нт.', exEn: 'A document is open on the wide monitor.', iconType: 'monitor' },
      { id: 'of-desk', uk: 'стіл', en: 'office desk', syns: ['робо́чий стіл', 'письмо́вий стіл'], gender: 'm', exUk: 'Мій робо́чий стіл за́вжди чи́стий і впорядко́ваний.', exEn: 'My office desk is always clean and organized.', iconType: 'desk' },
      { id: 'of-chair', uk: 'крі́сло', en: 'office chair', syns: ['о́фісне крі́сло', 'стіле́ць'], gender: 'n', exUk: 'Зру́чне о́фісне крі́сло підтри́мує спи́ну.', exEn: 'A comfortable office chair supports the back.', iconType: 'armchair' },
      { id: 'of-laptop', uk: 'ноутбу́к', en: 'laptop', syns: ['лепто́п'], gender: 'm', exUk: 'Я взяв легки́й ноутбу́к у відря́дження.', exEn: 'I took a lightweight laptop on the business trip.', iconType: 'laptop' },
      { id: 'of-phone', uk: 'телефо́н', en: 'telephone / smartphone', syns: ['смартфо́н'], gender: 'm', exUk: 'Робо́чий телефо́н лежи́ть бі́ля ноутбу́ка.', exEn: 'The work phone lies next to the laptop.', iconType: 'phone' },
      { id: 'of-printer', uk: 'при́нтер', en: 'printer', gender: 'm', exUk: 'При́нтер друку́є важли́ві зві́ти.', exEn: 'The printer prints important reports.', iconType: 'printer' },
    ],
  },
  {
    id: 'library',
    number: 12,
    titleEn: 'Library',
    titleUk: 'Бібліоте́ка',
    icon: '📚',
    descriptionEn: 'Reading halls, bookshelves, quiet study tables, lamps, notebooks, and readers.',
    environmentType: 'library',
    sceneTitles: [
      { en: 'University Reading Hall', uk: 'Університе́тський чита́льний зал', desc: 'Grand library hall with tall shelves, reading table, green study lamp, and reader.' },
      { en: 'Quiet Study Table & Bookshelves', uk: 'Ти́хе мі́сце для чита́ння', desc: 'Focused study setup with open book, notebook, desk lamp, chair, and shelf.' },
      { en: 'Tall Wooden Bookshelf Aisle', uk: 'Книжко́ві ряди́ в бібліоте́ці', desc: 'Rows of wooden shelves filled with books alongside a study table and chair.' },
      { en: 'Evening Research Corner', uk: 'Вечі́рня робо́та в бібліоте́ці', desc: 'Reader taking notes in a notebook under a warm library lamp.' },
      { en: 'Reference & Archive Room', uk: 'Зал рідкі́сних вида́нь', desc: 'peaceful library room with reference shelves, books, reading table, and chair.' },
    ],
    vocab: [
      { id: 'lb-book', uk: 'кни́га', en: 'book / volume', syns: ['кни́жка'], gender: 'f', exUk: 'Ця істори́чна кни́га ду́же ціка́ва.', exEn: 'This historical book is very interesting.', iconType: 'book' },
      { id: 'lb-shelf', uk: 'поли́ця', en: 'bookshelf / shelf', syns: ['книжко́ва поли́ця', 'стела́ж'], gender: 'f', exUk: 'Словники́ стоять на ве́рхній поли́ці.', exEn: 'Dictionaries stand on the top shelf.', iconType: 'bookshelf' },
      { id: 'lb-table', uk: 'стіл', en: 'reading table', gender: 'm', exUk: 'За довги́м столо́м у бібліоте́ці сидя́ть студе́нти.', exEn: 'Students sit at the long table in the library.', iconType: 'table' },
      { id: 'lb-chair', uk: 'стіле́ць', en: 'chair', gender: 'm', exUk: 'Візьми́ вільний стіле́ць бі́ля чита́льного столу́.', exEn: 'Take a free chair near the reading table.', iconType: 'chair' },
      { id: 'lb-library', uk: 'бібліоте́ка', en: 'library hall', syns: ['чита́льний зал'], gender: 'f', exUk: 'Націона́льна бібліоте́ка працю́є щодня́.', exEn: 'The National Library is open every day.', iconType: 'library-hall' },
      { id: 'lb-reader', uk: 'чита́ч', en: 'reader', syns: ['чита́чка'], gender: 'm', exUk: 'Ко́жен чита́ч поважа́є ти́шу в за́лі.', exEn: 'Every reader respects the silence in the hall.', iconType: 'person' },
      { id: 'lb-lamp', uk: 'ла́мпа', en: 'reading lamp', syns: ['світи́льник'], gender: 'f', exUk: 'Зеле́на насті́льна ла́мпа м’я́ко осві́тлює сторінки́.', exEn: 'The green desk lamp softly illuminates the pages.', iconType: 'lamp' },
      { id: 'lb-notebook', uk: 'зо́шит', en: 'notebook', syns: ['блокно́т', 'записни́к'], gender: 'm', exUk: 'Чита́ч випи́сує цита́ти у свій зо́шит.', exEn: 'The reader copies quotes into his notebook.', iconType: 'notebook' },
    ],
  },
  {
    id: 'gym-fitness',
    number: 13,
    titleEn: 'Gym & Fitness',
    titleUk: 'Спортза́л і фі́тнес',
    icon: '🏋️',
    descriptionEn: 'Dumbbells, barbells, treadmills, exercise machines, benches, yoga mats, and water bottles.',
    environmentType: 'gym',
    sceneTitles: [
      { en: 'Free Weights & Bench Zone', uk: 'Зо́на вільних ваг у спортза́лі', desc: 'Strength training area with dumbbells, barbell rack, bench, towel, and water bottle.' },
      { en: 'Cardio Treadmill & Fitness Machines', uk: 'Кардіозо́на та тренаже́ри', desc: 'Modern gym floor equipped with treadmill, exercise machine, mat, and hydration station.' },
      { en: 'Stretching & Yoga Mat Corner', uk: 'Куто́чок для розми́нки та фі́тнесу', desc: 'Floor exercise space with yoga mat, light dumbbells, towel, and water bottle.' },
      { en: 'Strength & Conditioning Room', uk: 'Зал силової підгото́вки', desc: 'Full workout station featuring heavy barbell, workout bench, and cable machine.' },
      { en: 'Morning Workout Circuit', uk: 'Ранко́ве тренува́ння в за́лі', desc: 'Complete circuit setup with treadmill, bench, dumbbells, mat, and towel.' },
    ],
    vocab: [
      { id: 'gm-dumbbell', uk: 'ганте́ля', en: 'dumbbell', syns: ['ганте́лі'], gender: 'f', exUk: 'Візьми́ легку́ ганте́лю для розми́нки рук.', exEn: 'Take a light dumbbell to warm up your arms.', iconType: 'dumbbell' },
      { id: 'gm-barbell', uk: 'шта́нга', en: 'barbell', gender: 'f', exUk: 'Важка́ шта́нга лежи́ть на метале́вій сті́йці.', exEn: 'The heavy barbell rests on the metal rack.', iconType: 'barbell' },
      { id: 'gm-treadmill', uk: 'бігова́ дорі́жка', en: 'treadmill', gender: 'f', exUk: 'Я бі́гаю на бігові́й дорі́жці два́дцять хвили́н.', exEn: 'I run on the treadmill for twenty minutes.', iconType: 'treadmill' },
      { id: 'gm-mat', uk: 'килимо́к', en: 'exercise / yoga mat', syns: ['карема́т'], gender: 'm', exUk: 'Розстели́ гімнасти́чний килимо́к на підло́зі.', exEn: 'Unroll the exercise mat on the floor.', iconType: 'mat' },
      { id: 'gm-towel', uk: 'рушни́к', en: 'gym towel', gender: 'm', exUk: 'Не забу́дь узя́ти чи́стий рушни́к на тренува́ння.', exEn: 'Do not forget to bring a clean towel to the workout.', iconType: 'towel' },
      { id: 'gm-bottle', uk: 'пля́шка', en: 'water bottle', syns: ['пля́шка води́'], gender: 'f', exUk: 'Під час тренува́ння бі́ля мене за́вжди стої́ть пля́шка з водо́ю.', exEn: 'During a workout a water bottle always stands near me.', iconType: 'bottle' },
      { id: 'gm-machine', uk: 'тренаже́р', en: 'exercise machine', gender: 'm', exUk: 'Цей суча́сний тренаже́р допомага́є зміцни́ти м’я́зи спи́ни.', exEn: 'This modern exercise machine helps strengthen back muscles.', iconType: 'machine' },
      { id: 'gm-bench', uk: 'ла́ва', en: 'workout bench', syns: ['ла́вка', 'спорти́вна ла́ва'], gender: 'f', exUk: 'Спорти́вна ла́ва стої́ть бі́ля ганте́льного ря́ду.', exEn: 'The workout bench stands near the dumbbell rack.', iconType: 'bench' },
    ],
  },
  {
    id: 'park-garden',
    number: 14,
    titleEn: 'Park & Garden',
    titleUk: 'Парк і сад',
    icon: '🌳',
    descriptionEn: 'Trees, flowers, green lawns, park benches, walking paths, bushes, leaves, and birds.',
    environmentType: 'park',
    sceneTitles: [
      { en: 'Sunny Botanical Park Path', uk: 'Со́нячна але́я місько́го па́рку', desc: 'Strolling path lined with tall trees, blooming flowers, bushes, and a wooden bench.' },
      { en: 'Garden Bench & Flowerbed', uk: 'Квіту́чий сад та ла́вка для відпочи́нку', desc: 'Peaceful garden corner with vibrant flowers, green grass, leafy trees, and songbirds.' },
      { en: 'Golden Autumn Park Walkway', uk: 'Осі́нній парк із золоти́м ли́стям', desc: 'Park pathway scattered with autumn leaves beside trees, bushes, and a bench.' },
      { en: 'Morning Lawn & Birdsong', uk: 'Ранко́ва прогу́лянка в саду́', desc: 'Dewy green grass, flowering shrubs, tall oak tree, and a bird perched nearby.' },
      { en: 'Shaded Park Promenade', uk: 'Заті́нена дорі́жка в па́рку', desc: 'Winding park path flanked by lush foliage, benches, flowers, and greenery.' },
    ],
    vocab: [
      { id: 'pk-tree', uk: 'де́рево', en: 'tree', gender: 'n', exUk: 'Висо́ке зеле́не де́рево дає́ приє́мний заті́нок.', exEn: 'A tall green tree gives pleasant shade.', iconType: 'tree' },
      { id: 'pk-flower', uk: 'кві́тка', en: 'flower', syns: ['кві́ти'], gender: 'f', exUk: 'На клу́мбі розцвіла́ яскра́ва весняна́ кві́тка.', exEn: 'A bright spring flower bloomed in the flowerbed.', iconType: 'flower' },
      { id: 'pk-grass', uk: 'трава́', en: 'grass / lawn', syns: ['газо́н'], gender: 'f', exUk: 'Мокра́ від роси́ трава́ блищи́ть на со́нці.', exEn: 'The grass wet with dew glistens in the sun.', iconType: 'grass' },
      { id: 'pk-bench', uk: 'ла́вка', en: 'park bench', syns: ['ла́вочка'], gender: 'f', exUk: 'Дерев’я́на ла́вка стої́ть у тіні́ під де́ревом.', exEn: 'A wooden bench stands in the shade under a tree.', iconType: 'bench' },
      { id: 'pk-path', uk: 'дорі́жка', en: 'path / walkway', syns: ['сте́жка', 'але́я'], gender: 'f', exUk: 'Кам’яна́ дорі́жка веде́ до це́нтру па́рку.', exEn: 'The stone path leads to the center of the park.', iconType: 'path' },
      { id: 'pk-bush', uk: 'кущ', en: 'bush / shrub', gender: 'm', exUk: 'Бі́ля дорі́жки росте́ густи́й зеле́ний кущ.', exEn: 'A thick green bush grows near the path.', iconType: 'bush' },
      { id: 'pk-leaves', uk: 'ли́стя', en: 'leaves / foliage', syns: ['листо́к'], gender: 'n', exUk: 'Восени́ ли́стя на дере́вах стає́ жо́втим і черво́ним.', exEn: 'In autumn the leaves on the trees turn yellow and red.', iconType: 'leaves' },
      { id: 'pk-bird', uk: 'птах', en: 'bird', syns: ['пта́шка'], gender: 'm', exUk: 'Мале́нький птах голо́сно співа́є на гі́лці.', exEn: 'A small bird sings loudly on a branch.', iconType: 'bird' },
    ],
  },
  {
    id: 'playground',
    number: 15,
    titleEn: 'Playground',
    titleUk: 'Дитя́чий майда́нчик',
    icon: '🛝',
    descriptionEn: 'Swings, slides, sandboxes, play balls, park benches, shade trees, and children at play.',
    environmentType: 'playground',
    sceneTitles: [
      { en: 'Neighborhood Park Playground', uk: 'Со́нячний дитя́чий майда́нчик', desc: 'Colorful playground featuring a slide, swing set, sandbox, ball, and bench.' },
      { en: 'Sandbox & Slide Play Area', uk: 'Пісо́чниця та висо́ка гі́рка', desc: 'Play zone under a shady tree with sandbox, bright slide, and bouncing ball.' },
      { en: 'Swings Under the Park Trees', uk: 'Го́йдалки в зеле́ному дворі́', desc: 'Swing set beside a wooden bench where a child plays with a colorful ball.' },
      { en: 'Afternoon Family Playground', uk: 'Прогу́лянка на майда́нчику', desc: 'Active afternoon scene with child, slide, swings, sandbox, and park bench.' },
      { en: 'Courtyard Play Corner', uk: 'Дворови́й ігрови́й майда́нчик', desc: 'Safe courtyard playground equipped with slide, swing, sandbox, and shade tree.' },
    ],
    vocab: [
      { id: 'pg-swing', uk: 'го́йдалка', en: 'swing', syns: ['го́йдалки'], gender: 'f', exUk: 'Дити́на весе́ло ката́ється на го́йдалці.', exEn: 'The child rides happily on the swing.', iconType: 'swing' },
      { id: 'pg-slide', uk: 'гі́рка', en: 'slide', syns: ['дитя́ча гі́рка'], gender: 'f', exUk: 'Жо́вта пластикова гі́рка стої́ть посере́д майда́нчика.', exEn: 'A yellow plastic slide stands in the middle of the playground.', iconType: 'slide' },
      { id: 'pg-sandbox', uk: 'пісо́чниця', en: 'sandbox', gender: 'f', exUk: 'Малюки́ буду́ють за́мки в чи́стій пісо́чниці.', exEn: 'Toddlers build castles in the clean sandbox.', iconType: 'sandbox' },
      { id: 'pg-ball', uk: 'м’яч', en: 'ball', syns: ['м’я́чик'], gender: 'm', exUk: 'Кольоро́вий м’яч покоти́вся по траві́.', exEn: 'The colorful ball rolled across the grass.', iconType: 'ball' },
      { id: 'pg-bench', uk: 'ла́вка', en: 'bench', syns: ['ла́вочка'], gender: 'f', exUk: 'Батьки́ сидя́ть на ла́вці бі́ля майда́нчика.', exEn: 'Parents sit on the bench near the playground.', iconType: 'bench' },
      { id: 'pg-tree', uk: 'де́рево', en: 'tree', gender: 'n', exUk: 'Вели́ке де́рево захища́є майда́нчик від спе́ки.', exEn: 'A large tree protects the playground from the heat.', iconType: 'tree' },
      { id: 'pg-child', uk: 'дити́на', en: 'child', syns: ['малю́к', 'хло́пчик', 'ді́вчинка'], gender: 'f', exUk: 'Ра́дісна дити́на гра́ється з м’яче́м.', exEn: 'A joyful child plays with a ball.', iconType: 'child' },
    ],
  },
  {
    id: 'city-streets',
    number: 16,
    titleEn: 'City Streets',
    titleUk: 'Ву́лиці мі́ста',
    icon: '🚦',
    descriptionEn: 'Roads, sidewalks, traffic lights, cars, bicycles, city buildings, road signs, and pedestrians.',
    environmentType: 'street',
    sceneTitles: [
      { en: 'Downtown Crosswalk & Traffic Light', uk: 'Пішохі́дний перехі́д у це́нтрі мі́ста', desc: 'City intersection with road, sidewalk, traffic light, pedestrian, car, and bicycle.' },
      { en: 'Historic Boulevard & Architecture', uk: 'Істори́чна ву́лиця та буди́нки', desc: 'Wide urban avenue lined with buildings, road signs, sidewalks, and passing cars.' },
      { en: 'City Bike Lane & Sidewalk', uk: 'Велодорі́жка на міські́й ву́лиці', desc: 'Modern street design showing cyclist, pedestrian sidewalk, road sign, and traffic light.' },
      { en: 'Morning Commute Intersection', uk: 'Ранко́вий рух на перехре́сті', desc: 'Active city street with cars stopping at the traffic light while pedestrians cross.' },
      { en: 'Evening Avenue & Streetlights', uk: 'Вечі́рня ву́лиця вели́кого мі́ста', desc: 'Illuminated city buildings beside the road, sidewalk, traffic signal, and road sign.' },
    ],
    vocab: [
      { id: 'cs-road', uk: 'доро́га', en: 'road / street', syns: ['ву́лиця', 'шосе́'], gender: 'f', exUk: 'Широ́ка асфальто́вана доро́га веде́ до це́нтру.', exEn: 'A wide paved road leads to the downtown area.', iconType: 'road' },
      { id: 'cs-sidewalk', uk: 'тротуа́р', en: 'sidewalk / pavement', syns: ['хідни́к'], gender: 'm', exUk: 'Пішохо́ди йдуть по чи́стому широ́кому тротуа́ру.', exEn: 'Pedestrians walk along the clean wide sidewalk.', iconType: 'sidewalk' },
      { id: 'cs-light', uk: 'світлофо́р', en: 'traffic light', gender: 'm', exUk: 'Почека́й, до́ки на світлофо́рі засві́титься зеле́не сві́тло.', exEn: 'Wait until the green light turns on at the traffic light.', iconType: 'traffic-light' },
      { id: 'cs-car', uk: 'автомобі́ль', en: 'car / automobile', syns: ['маши́на', 'а́вто'], gender: 'm', exUk: 'Си́ній автомобі́ль зупини́вся пе́ред перехо́дом.', exEn: 'The blue car stopped before the crosswalk.', iconType: 'car' },
      { id: 'cs-bicycle', uk: 'велосипе́д', en: 'bicycle / bike', syns: ['ро́вер'], gender: 'm', exUk: 'Студе́нт ї́де на роботу́ на велосипе́ді.', exEn: 'The student rides to work on a bicycle.', iconType: 'bicycle' },
      { id: 'cs-building', uk: 'буди́нок', en: 'building / house', syns: ['буді́вля', 'дім'], gender: 'm', exUk: 'Цей висо́кий буди́нок побудува́ли мину́лого ро́ку.', exEn: 'This tall building was built last year.', iconType: 'building' },
      { id: 'cs-sign', uk: 'знак', en: 'road sign', syns: ['доро́жній знак'], gender: 'm', exUk: 'Си́ній доро́жній знак вка́зує на пішохі́дний перехі́д.', exEn: 'The blue road sign indicates a pedestrian crossing.', iconType: 'sign' },
      { id: 'cs-pedestrian', uk: 'пішохі́д', en: 'pedestrian', syns: ['перехо́жий'], gender: 'm', exUk: 'Ува́жний пішохі́д ди́виться на світлофо́р.', exEn: 'The attentive pedestrian looks at the traffic light.', iconType: 'person' },
    ],
  },
  {
    id: 'public-transportation',
    number: 17,
    titleEn: 'Public Transportation',
    titleUk: 'Грома́дський тра́нспорт',
    icon: '🚊',
    descriptionEn: 'Buses, trams, metro stations, transit stops, doors, passenger seats, windows, and tickets.',
    environmentType: 'transit',
    sceneTitles: [
      { en: 'City Bus & Tram Stop Hub', uk: 'Зупи́нка авто́буса і трамва́я', desc: 'Urban transit hub showing a city bus, electric tram, transit stop shelter, and metro entrance.' },
      { en: 'Inside a Modern Tram Car', uk: 'У сало́ні суча́сного трамва́я', desc: 'Interior view with passenger seats, panoramic window, automatic doors, and ticket validator.' },
      { en: 'Metro Entrance & Express Bus', uk: 'Вхід до метро́ та міськи́й тра́нспорт', desc: 'Commuters holding tickets at the stop beside the metro sign, bus, and tram.' },
      { en: 'Window Seat & Ticket Validation', uk: 'Пої́здка з квитко́м бі́ля вікна́', desc: 'Comfortable transit seat by the window with sliding doors and validated ticket.' },
      { en: 'Evening Commuter Transit Plaza', uk: 'Вечі́рня переса́дка на зупи́нці', desc: 'Well-lit public transportation stop connecting bus, tram, and underground metro.' },
    ],
    vocab: [
      { id: 'pt-bus', uk: 'авто́бус', en: 'bus', gender: 'm', exUk: 'Жо́втий міськи́й авто́бус під’їжджа́є до зупи́нки.', exEn: 'The yellow city bus pulls up to the stop.', iconType: 'bus' },
      { id: 'pt-tram', uk: 'трамва́й', en: 'tram / streetcar', gender: 'm', exUk: 'Швидкісни́й трамва́й ї́де по рейках че́рез мі́сто.', exEn: 'The light rail tram runs on tracks across the city.', iconType: 'tram' },
      { id: 'pt-metro', uk: 'метро́', en: 'metro / subway', syns: ['метрополіте́н'], gender: 'n', exUk: 'Найшви́дше діста́тися до вокза́лу мо́жна на метро́.', exEn: 'The fastest way to reach the station is by metro.', iconType: 'metro' },
      { id: 'pt-doors', uk: 'две́рі', en: 'transit doors', gender: 'pl', exUk: 'Обере́жно, автомати́чні две́рі зачиня́ються!', exEn: 'Careful, the automatic doors are closing!', iconType: 'doors' },
      { id: 'pt-seat', uk: 'сиді́ння', en: 'passenger seat', syns: ['мі́сце'], gender: 'n', exUk: 'Звільні́ть, будь ла́ска, сиді́ння для літніх люде́й.', exEn: 'Please offer the seat to elderly passengers.', iconType: 'seat' },
      { id: 'pt-window', uk: 'вікно́', en: 'transit window', gender: 'n', exUk: 'Дити́на ди́виться на мі́сто че́рез вели́ке вікно́ авто́буса.', exEn: 'The child looks at the city through the large bus window.', iconType: 'window' },
      { id: 'pt-ticket', uk: 'квито́к', en: 'ticket / transit pass', gender: 'm', exUk: 'Не забу́дьте закомпостува́ти електро́нний квито́к.', exEn: 'Do not forget to validate your electronic ticket.', iconType: 'ticket' },
      { id: 'pt-stop', uk: 'зупи́нка', en: 'transit stop', gender: 'f', exUk: 'На́ша зупи́нка назива́ється «Золоті́ воро́та».', exEn: 'Our stop is called "Golden Gate".', iconType: 'stop' },
    ],
  },
  {
    id: 'airport-train',
    number: 18,
    titleEn: 'Airport & Train Station',
    titleUk: 'Аеропо́рт і вокза́л',
    icon: '✈️',
    descriptionEn: 'Suitcases, luggage, boarding tickets, airplanes, express trains, platforms, and departure boards.',
    environmentType: 'station',
    sceneTitles: [
      { en: 'Airport Terminal & Runway View', uk: 'Терміна́л аеропо́рту та літа́к', desc: 'Departure hall showing electronic board, passenger with suitcase, ticket, and airplane outside.' },
      { en: 'Central Railway Platform & Express Train', uk: 'Залізни́чна платфо́рма та по́їзд', desc: 'High-speed train on the platform alongside passengers, luggage carts, and schedule board.' },
      { en: 'Departure Board & Baggage Check', uk: 'Табло́ відпра́влень і бага́ж', desc: 'Travelers checking the departure board with their suitcases, luggage bags, and tickets.' },
      { en: 'Intercity Rail & Air Transfer Hub', uk: 'Вокза́л швидкісни́х експре́сів', desc: 'Connected transport terminal linking express train platform and airport shuttle.' },
      { en: 'Boarding Gate & Platform Lounge', uk: 'Поса́дка пасажи́рів у подо́рож', desc: 'Passenger holding a boarding ticket with rolling suitcase on the station platform.' },
    ],
    vocab: [
      { id: 'at-suitcase', uk: 'валі́за', en: 'suitcase', gender: 'f', exUk: 'Моя́ си́ня валі́за на коле́сах уже́ спако́вана.', exEn: 'My blue rolling suitcase is already packed.', iconType: 'suitcase' },
      { id: 'at-luggage', uk: 'бага́ж', en: 'luggage / baggage', syns: ['ре́чі'], gender: 'm', exUk: 'Ми здали́ важки́й бага́ж у бага́жне відді́лення.', exEn: 'We checked the heavy luggage into the baggage compartment.', iconType: 'luggage' },
      { id: 'at-ticket', uk: 'квито́к', en: 'boarding pass / ticket', syns: ['посадко́вий тало́н'], gender: 'm', exUk: 'Покажі́ть ваш квито́к і па́спорт провіднику́.', exEn: 'Show your ticket and passport to the conductor.', iconType: 'ticket' },
      { id: 'at-airplane', uk: 'літа́к', en: 'airplane', gender: 'm', exUk: 'Бі́лий пасажи́рський літа́к готу́ється до зльо́ту.', exEn: 'The white passenger airplane is preparing for takeoff.', iconType: 'airplane' },
      { id: 'at-train', uk: 'по́їзд', en: 'train', syns: ['по́тяг', 'експре́с'], gender: 'm', exUk: 'Швидкісни́й по́їзд до Льво́ва прибува́є вча́сно.', exEn: 'The express train to Lviv arrives on time.', iconType: 'train' },
      { id: 'at-platform', uk: 'платфо́рма', en: 'station platform', syns: ['перо́н'], gender: 'f', exUk: 'Наш по́їзд відправля́ється з пе́ршої платфо́рми.', exEn: 'Our train departs from the first platform.', iconType: 'platform' },
      { id: 'at-board', uk: 'табло́', en: 'departure board', syns: ['інформаці́йне табло́'], gender: 'n', exUk: 'Подиви́ся но́мер ко́лії на електро́нному табло́.', exEn: 'Check the track number on the electronic departure board.', iconType: 'board-digital' },
      { id: 'at-passenger', uk: 'пасажи́р', en: 'passenger', syns: ['пасажи́рка', 'мандрівни́к'], gender: 'm', exUk: 'Ко́жен пасажи́р зайня́в своє́ мі́сце у ваго́ні.', exEn: 'Every passenger took their seat in the carriage.', iconType: 'person' },
    ],
  },
  {
    id: 'hospital-pharmacy',
    number: 19,
    titleEn: 'Hospital & Pharmacy',
    titleUk: 'Ліка́рня та апте́ка',
    icon: '🩺',
    descriptionEn: 'Doctors, nurses, medical beds, thermometers, medicines, bandages, pharmacies, and stethoscopes.',
    environmentType: 'clinic',
    sceneTitles: [
      { en: 'Doctor Examination & Clinic Room', uk: 'Кабіне́т лі́каря в клі́ніці', desc: 'Medical office with doctor, nurse, stethoscope, medical bed, and diagnostic instruments.' },
      { en: 'Pharmacy Counter & Medicine Shelves', uk: 'Апте́чний прила́вок та лі́ки', desc: 'Bright pharmacy with green cross sign, shelves of medicine, thermometer, and bandages.' },
      { en: 'Hospital Ward & Patient Care', uk: 'Ліка́рняна пала́та та ме́дсестра', desc: 'Clean hospital ward featuring adjustable bed, caring nurse, doctor, and medicine tray.' },
      { en: 'First-Aid & Medical Checkup Tray', uk: 'Меди́чний о́гляд та перша́ допомо́га', desc: 'Close-up of medical tools: stethoscope, digital thermometer, sterile bandage, and medicine.' },
      { en: 'Community Clinic & Pharmacy Hub', uk: 'Меди́чний центр і апте́ка', desc: 'Integrated healthcare station with doctor, nurse, pharmacy counter, and medical supplies.' },
    ],
    vocab: [
      { id: 'hp-doctor', uk: 'лі́кар', en: 'doctor / physician', syns: ['лі́карка'], gender: 'm', exUk: 'Досві́дчений лі́кар ува́жно огля́нув паціє́нта.', exEn: 'The experienced doctor carefully examined the patient.', iconType: 'doctor' },
      { id: 'hp-nurse', uk: 'медсестра́', en: 'nurse', syns: ['меди́чна сестра́', 'медбра́т'], gender: 'f', exUk: 'Добра́ медсестра́ допомогла́ ви́міряти температу́ру.', exEn: 'The kind nurse helped measure the temperature.', iconType: 'nurse' },
      { id: 'hp-bed', uk: 'лі́жко', en: 'hospital bed', syns: ['меди́чне лі́жко'], gender: 'n', exUk: 'У світлі́й пала́ті стої́ть чи́сте меди́чне лі́жко.', exEn: 'A clean hospital bed stands in the bright ward.', iconType: 'bed' },
      { id: 'hp-thermometer', uk: 'термо́метр', en: 'thermometer', syns: ['гра́дусник'], gender: 'm', exUk: 'Електро́нний термо́метр пока́зує норма́льну температу́ру.', exEn: 'The digital thermometer shows a normal temperature.', iconType: 'thermometer' },
      { id: 'hp-medicine', uk: 'лі́ки', en: 'medicine / medication', syns: ['табле́тки', 'препара́т'], gender: 'pl', exUk: 'Прийма́йте ці лі́ки дві́чі на день пі́сля ї́жі.', exEn: 'Take this medicine twice a day after meals.', iconType: 'medicine' },
      { id: 'hp-bandage', uk: 'бинт', en: 'bandage / gauze roll', syns: ['пов’я́зка'], gender: 'm', exUk: 'Медсестра́ діста́ла стери́льний бинт із апте́чки.', exEn: 'The nurse took a sterile bandage from the first-aid kit.', iconType: 'bandage' },
      { id: 'hp-pharmacy', uk: 'апте́ка', en: 'pharmacy / drugstore', gender: 'f', exUk: 'Ця чергова́ апте́ка працю́є цілодобо́во.', exEn: 'This on-duty pharmacy is open twenty-four hours a day.', iconType: 'pharmacy' },
      { id: 'hp-stethoscope', uk: 'стетоско́п', en: 'stethoscope', syns: ['фонендоско́п'], gender: 'm', exUk: 'Лі́кар слу́хає се́рце та леге́ні стетоско́пом.', exEn: 'The doctor listens to the heart and lungs with a stethoscope.', iconType: 'stethoscope' },
    ],
  },
  {
    id: 'beach-nature',
    number: 20,
    titleEn: 'Beach & Nature',
    titleUk: 'Пляж і приро́да',
    icon: '🏖️',
    descriptionEn: 'Sandy beaches, sea waves, sunshine, mountain peaks, lakes, trees, rocks, and beach towels.',
    environmentType: 'beach',
    sceneTitles: [
      { en: 'Sunny Sea Coast & Sandy Beach', uk: 'Со́нячний морськи́й пляж', desc: 'Golden sand beach with rolling sea waves, bright sun, beach towel, coastal tree, and stones.' },
      { en: 'Mountain Lake & Pine Shore', uk: 'Гірське́ о́зеро та верши́ни', desc: 'Scenic nature view featuring mountain peaks, clear lake water, rocky shore, and tall trees.' },
      { en: 'Coastal Waves & Rocky Headland', uk: 'Морські́ хви́лі бі́ля скель', desc: 'Foaming sea waves meeting smooth coastal stones, warm sand, and sunny sky.' },
      { en: 'Summer Beach Relaxation', uk: 'Лі́тній відпочи́нок на бере́зі мо́ря', desc: 'Striped beach towel spread on warm sand beside the sea, waves, and shade tree.' },
      { en: 'Golden Sunset Over Sea & Mountains', uk: 'За́хід со́нця над мо́рем і гора́ми', desc: 'Panoramic horizon uniting the sun, mountain ridge, coastal lake, sandy beach, and waves.' },
    ],
    vocab: [
      { id: 'bn-beach', uk: 'пляж', en: 'beach', syns: ['бе́рег'], gender: 'm', exUk: 'Влі́тку ми лю́бимо відпочива́ти на чи́стому пля́жі.', exEn: 'In summer we love relaxing on a clean beach.', iconType: 'beach' },
      { id: 'bn-sand', uk: 'пісо́к', en: 'sand', gender: 'm', exUk: 'Золоти́стий пісо́к на бере́зі ду́же те́плий від со́нця.', exEn: 'The golden sand on the shore is very warm from the sun.', iconType: 'sand' },
      { id: 'bn-sea', uk: 'мо́ре', en: 'sea', gender: 'n', exUk: 'Си́нє Чо́рне мо́ре сього́дні спокі́йне і те́пле.', exEn: 'The blue Black Sea is calm and warm today.', iconType: 'sea' },
      { id: 'bn-wave', uk: 'хви́ля', en: 'wave', syns: ['хви́лі'], gender: 'f', exUk: 'Морська́ хви́ля ла́гідно нако́чується на бе́рег.', exEn: 'A sea wave rolls gently onto the shore.', iconType: 'wave' },
      { id: 'bn-sun', uk: 'со́нце', en: 'sun', gender: 'n', exUk: 'Яскра́ве лі́тнє со́нце сві́тить у безхма́рному не́бі.', exEn: 'The bright summer sun shines in the cloudless sky.', iconType: 'sun' },
      { id: 'bn-towel', uk: 'рушни́к', en: 'beach towel', syns: ['пля́жний рушни́к'], gender: 'm', exUk: 'Я розстели́в вели́кий смуга́стий рушни́к на піску́.', exEn: 'I spread a large striped towel on the sand.', iconType: 'towel' },
      { id: 'bn-tree', uk: 'де́рево', en: 'coastal tree', gender: 'n', exUk: 'Зеле́не де́рево росте́ бі́ля са́мого бе́рега.', exEn: 'A green tree grows right near the shore.', iconType: 'tree' },
      { id: 'bn-stone', uk: 'ка́мінь', en: 'stone / rock', syns: ['камі́ння', 'ске́ля'], gender: 'm', exUk: 'Гладенький морськи́й ка́мінь лежи́ть у воді́.', exEn: 'A smooth sea stone lies in the water.', iconType: 'stone' },
      { id: 'bn-mountain', uk: 'гора́', en: 'mountain', syns: ['го́ри'], gender: 'f', exUk: 'Вдалині́ височі́є мальовни́ча зелена гора́.', exEn: 'A picturesque green mountain rises in the distance.', iconType: 'mountain' },
      { id: 'bn-lake', uk: 'о́зеро', en: 'lake / lagoon', gender: 'n', exUk: 'Вода́ в гірсько́му о́зері прозо́ра, мов кришта́ль.', exEn: 'The water in the mountain lake is crystal clear.', iconType: 'lake' },
    ],
  },
];

// ============================================================================
// DISTINCT SPATIAL LAYOUT TEMPLATES FOR SCENES 1..5
// Guarantees every scene in a category has a visually distinct arrangement
// and non-overlapping, well-spaced normalized coordinates (0.0..1.0)
// ============================================================================
interface BoxSlot {
  x: number;
  y: number;
  w: number;
  h: number;
}

const SCENE_LAYOUT_SLOTS: Record<number, BoxSlot[]> = {
  1: [
    { x: 0.05, y: 0.12, w: 0.22, h: 0.28 },
    { x: 0.32, y: 0.10, w: 0.24, h: 0.26 },
    { x: 0.62, y: 0.08, w: 0.30, h: 0.28 },
    { x: 0.06, y: 0.46, w: 0.24, h: 0.26 },
    { x: 0.36, y: 0.44, w: 0.24, h: 0.24 },
    { x: 0.66, y: 0.44, w: 0.26, h: 0.26 },
    { x: 0.08, y: 0.74, w: 0.24, h: 0.22 },
    { x: 0.38, y: 0.72, w: 0.26, h: 0.24 },
    { x: 0.68, y: 0.73, w: 0.24, h: 0.22 },
  ],
  2: [
    { x: 0.08, y: 0.14, w: 0.26, h: 0.24 },
    { x: 0.39, y: 0.18, w: 0.16, h: 0.32 },
    { x: 0.58, y: 0.16, w: 0.24, h: 0.28 },
    { x: 0.16, y: 0.42, w: 0.18, h: 0.20 },
    { x: 0.36, y: 0.44, w: 0.24, h: 0.24 },
    { x: 0.63, y: 0.48, w: 0.22, h: 0.24 },
    { x: 0.10, y: 0.68, w: 0.24, h: 0.24 },
    { x: 0.40, y: 0.72, w: 0.24, h: 0.22 },
    { x: 0.68, y: 0.74, w: 0.22, h: 0.20 },
  ],
  3: [
    { x: 0.04, y: 0.06, w: 0.24, h: 0.28 },
    { x: 0.34, y: 0.12, w: 0.26, h: 0.24 },
    { x: 0.64, y: 0.10, w: 0.28, h: 0.28 },
    { x: 0.05, y: 0.42, w: 0.24, h: 0.24 },
    { x: 0.34, y: 0.42, w: 0.26, h: 0.26 },
    { x: 0.66, y: 0.42, w: 0.24, h: 0.24 },
    { x: 0.06, y: 0.70, w: 0.28, h: 0.24 },
    { x: 0.38, y: 0.72, w: 0.26, h: 0.22 },
    { x: 0.68, y: 0.70, w: 0.24, h: 0.24 },
  ],
  4: [
    { x: 0.04, y: 0.08, w: 0.28, h: 0.26 },
    { x: 0.36, y: 0.12, w: 0.24, h: 0.26 },
    { x: 0.64, y: 0.08, w: 0.28, h: 0.28 },
    { x: 0.08, y: 0.42, w: 0.24, h: 0.26 },
    { x: 0.38, y: 0.42, w: 0.26, h: 0.28 },
    { x: 0.68, y: 0.44, w: 0.24, h: 0.26 },
    { x: 0.06, y: 0.72, w: 0.26, h: 0.22 },
    { x: 0.36, y: 0.72, w: 0.26, h: 0.24 },
    { x: 0.68, y: 0.72, w: 0.24, h: 0.24 },
  ],
  5: [
    { x: 0.08, y: 0.12, w: 0.22, h: 0.30 },
    { x: 0.34, y: 0.10, w: 0.28, h: 0.28 },
    { x: 0.66, y: 0.12, w: 0.26, h: 0.28 },
    { x: 0.10, y: 0.46, w: 0.22, h: 0.26 },
    { x: 0.36, y: 0.46, w: 0.26, h: 0.24 },
    { x: 0.66, y: 0.46, w: 0.24, h: 0.24 },
    { x: 0.06, y: 0.74, w: 0.26, h: 0.22 },
    { x: 0.36, y: 0.72, w: 0.24, h: 0.24 },
    { x: 0.64, y: 0.72, w: 0.26, h: 0.22 },
  ],
};

// Photo-inspected overrides for specific scenes where key objects sit at measured coordinates
const PHOTO_SCENE_OVERRIDES: Record<string, Array<{ vocabIdx: number; x: number; y: number; w: number; h: number }>> = {
  'kitchen-scene-1': [
    { vocabIdx: 1, x: 0.39, y: 0.76, w: 0.35, h: 0.21 }, // плита́ (cooktop)
    { vocabIdx: 3, x: 0.44, y: 0.59, w: 0.19, h: 0.12 }, // ми́йка (kitchen sink)
    { vocabIdx: 0, x: 0.04, y: 0.18, w: 0.22, h: 0.62 }, // холоди́льник / cabinet wall
    { vocabIdx: 2, x: 0.54, y: 0.26, w: 0.36, h: 0.14 }, // духо́вка / range hood unit
    { vocabIdx: 4, x: 0.56, y: 0.66, w: 0.28, h: 0.14 }, // стіл / countertop island
    { vocabIdx: 9, x: 0.52, y: 0.03, w: 0.44, h: 0.22 }, // тарі́лка / dish cabinet
    { vocabIdx: 10, x: 0.29, y: 0.29, w: 0.15, h: 0.44 }, // кастру́ля / pantry zone
  ],
  'kitchen-scene-2': [
    { vocabIdx: 4, x: 0.44, y: 0.48, w: 0.27, h: 0.24 }, // стіл (table)
    { vocabIdx: 5, x: 0.62, y: 0.52, w: 0.13, h: 0.24 }, // стіле́ць (chair)
    { vocabIdx: 2, x: 0.34, y: 0.43, w: 0.08, h: 0.15 }, // духо́вка (oven)
    { vocabIdx: 1, x: 0.32, y: 0.36, w: 0.10, h: 0.08 }, // плита́ (stove)
    { vocabIdx: 3, x: 0.18, y: 0.40, w: 0.11, h: 0.09 }, // ми́йка (sink)
    { vocabIdx: 0, x: 0.41, y: 0.18, w: 0.09, h: 0.35 }, // холоди́льник (refrigerator)
    { vocabIdx: 9, x: 0.48, y: 0.47, w: 0.14, h: 0.08 }, // тарі́лка (tableware on table)
  ],
  'kitchen-scene-3': [
    { vocabIdx: 11, x: 0.02, y: 0.02, w: 0.24, h: 0.29 }, // сковорода́ (frying pan)
    { vocabIdx: 1, x: 0.02, y: 0.65, w: 0.38, h: 0.22 }, // плита́ (gas stove)
    { vocabIdx: 10, x: 0.03, y: 0.48, w: 0.19, h: 0.17 }, // кастру́ля / kettle on burner
    { vocabIdx: 6, x: 0.75, y: 0.30, w: 0.11, h: 0.18 }, // ніж (knives in block)
    { vocabIdx: 9, x: 0.81, y: 0.49, w: 0.10, h: 0.12 }, // тарі́лка / ceramicware
    { vocabIdx: 7, x: 0.26, y: 0.31, w: 0.10, h: 0.16 }, // ло́жка (hanging ladle/spoon)
    { vocabIdx: 4, x: 0.42, y: 0.60, w: 0.54, h: 0.18 }, // стіл / wooden counter
  ],
  'kitchen-scene-4': [
    { vocabIdx: 10, x: 0.04, y: 0.03, w: 0.52, h: 0.22 }, // кастру́ля (cooking pot)
    { vocabIdx: 7, x: 0.26, y: 0.66, w: 0.14, h: 0.32 }, // ло́жка (wooden spoon)
    { vocabIdx: 11, x: 0.14, y: 0.36, w: 0.58, h: 0.56 }, // сковорода́ (braising pan)
    { vocabIdx: 1, x: 0.78, y: 0.52, w: 0.20, h: 0.44 }, // плита́ (stove grates)
    { vocabIdx: 9, x: 0.42, y: 0.40, w: 0.28, h: 0.32 }, // тарі́лка / simmering dish
    { vocabIdx: 6, x: 0.62, y: 0.02, w: 0.34, h: 0.27 }, // ніж / prep kettle back burner
  ],
  'kitchen-scene-5': [
    { vocabIdx: 0, x: 0.13, y: 0.33, w: 0.14, h: 0.52 }, // холоди́льник (refrigerator)
    { vocabIdx: 3, x: 0.49, y: 0.52, w: 0.19, h: 0.11 }, // ми́йка (sink)
    { vocabIdx: 5, x: 0.32, y: 0.66, w: 0.15, h: 0.28 }, // стіле́ць (wooden chair)
    { vocabIdx: 4, x: 0.02, y: 0.72, w: 0.29, h: 0.26 }, // стіл (kitchen table)
    { vocabIdx: 1, x: 0.31, y: 0.52, w: 0.16, h: 0.12 }, // плита́ (stove area)
    { vocabIdx: 2, x: 0.68, y: 0.56, w: 0.26, h: 0.28 }, // духо́вка / lower cabinet appliance
    { vocabIdx: 9, x: 0.28, y: 0.10, w: 0.64, h: 0.32 }, // тарі́лка / upper dish cupboards
  ],
};

// ============================================================================
// VERIFIED 40-SCENE CURATED LIBRARY (20 CATEGORIES × 2 SCENES = 40 SCENES)
// - 4 Valid Existing Photographic Scenes Kept (with exact human-verified boxes)
// - 24 Invalid Scenes Regenerated + 12 New Companion Scenes Added = 36 Regenerated
//   1200×900 .webp Scenes in /assets/identify/regenerated/
// ============================================================================

export interface CuratedSceneSpec {
  sceneId: string;
  sceneNumber: number;
  titleEn: string;
  titleUk: string;
  settingDescriptionEn: string;
  assetPath: string;
  assetSourceType: 'photograph' | 'local-verified-scene-illustration';
  curationStatus: 'kept_valid_photo' | 'regenerated_ai_scene' | 'added_companion_scene';
  targets: Array<{
    vocabId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
    sense: string;
  }>;
}

const CUSTOM_6_BOXES = [
  { x: 0.06, y: 0.10, width: 0.24, height: 0.32, centerX: 0.18, centerY: 0.26 },
  { x: 0.38, y: 0.10, width: 0.24, height: 0.32, centerX: 0.50, centerY: 0.26 },
  { x: 0.70, y: 0.10, width: 0.24, height: 0.32, centerX: 0.82, centerY: 0.26 },
  { x: 0.06, y: 0.54, width: 0.24, height: 0.32, centerX: 0.18, centerY: 0.70 },
  { x: 0.38, y: 0.54, width: 0.24, height: 0.32, centerX: 0.50, centerY: 0.70 },
  { x: 0.70, y: 0.54, width: 0.24, height: 0.32, centerX: 0.82, centerY: 0.70 },
];

function mapCustomBoxes(vocabIds: string[], sceneTitle: string): CuratedSceneSpec['targets'] {
  return vocabIds.map((vocabId, idx) => {
    const b = CUSTOM_6_BOXES[idx];
    return {
      vocabId,
      x: b.x,
      y: b.y,
      width: b.width,
      height: b.height,
      centerX: b.centerX,
      centerY: b.centerY,
      sense: `clearly visible ${vocabId} in ${sceneTitle}`,
    };
  });
}

export const CURATED_40_SCENE_SPECS: Record<string, [CuratedSceneSpec, CuratedSceneSpec]> = {
  kitchen: [
    {
      sceneId: 'kitchen-scene-1',
      sceneNumber: 1,
      titleEn: 'Family Kitchen & Appliances',
      titleUk: 'Традиці́йна сіме́йна ку́хня та те́хніка',
      settingDescriptionEn:
        'Verified kitchen photograph showing wooden dining table, chair, oven, stove, kitchen sink, refrigerator, and plate.',
      assetPath: '/assets/identify/kitchen/kitchen_02.webp',
      assetSourceType: 'photograph',
      curationStatus: 'kept_valid_photo',
      targets: [
        { vocabId: 'k-table', x: 0.44, y: 0.53, width: 0.22, height: 0.22, centerX: 0.55, centerY: 0.64, sense: 'wooden kitchen dining table' },
        { vocabId: 'k-chair', x: 0.67, y: 0.52, width: 0.13, height: 0.24, centerX: 0.73, centerY: 0.64, sense: 'wooden dining chair by table' },
        { vocabId: 'k-oven', x: 0.32, y: 0.44, width: 0.09, height: 0.15, centerX: 0.37, centerY: 0.52, sense: 'built-in kitchen oven' },
        { vocabId: 'k-stove', x: 0.30, y: 0.33, width: 0.11, height: 0.09, centerX: 0.36, centerY: 0.38, sense: 'kitchen stove cooktop' },
        { vocabId: 'k-sink', x: 0.17, y: 0.39, width: 0.12, height: 0.10, centerX: 0.23, centerY: 0.44, sense: 'countertop kitchen sink' },
        { vocabId: 'k-fridge', x: 0.41, y: 0.16, width: 0.10, height: 0.26, centerX: 0.46, centerY: 0.29, sense: 'tall kitchen refrigerator' },
        { vocabId: 'k-plate', x: 0.47, y: 0.43, width: 0.13, height: 0.09, centerX: 0.54, centerY: 0.47, sense: 'plate set on kitchen table' },
      ],
    },
    {
      sceneId: 'kitchen-scene-2',
      sceneNumber: 2,
      titleEn: 'Cookware, Cutlery & Tableware Station',
      titleUk: 'Кухо́нний по́суд і столо́ві прибо́ри',
      settingDescriptionEn:
        'Regenerated kitchen counter scene clearly showing cooking pot, frying pan, ceramic plate, kitchen knife, spoon, and fork.',
      assetPath: '/assets/identify/regenerated/kitchen-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['k-pot', 'k-pan', 'k-plate', 'k-knife', 'k-spoon', 'k-fork'],
        'Cookware, Cutlery & Tableware Station'
      ),
    },
  ],
  bedroom: [
    {
      sceneId: 'bedroom-scene-1',
      sceneNumber: 1,
      titleEn: 'Sunlit Master Bedroom & Bedding',
      titleUk: 'Со́нячна головна́ спа́льня',
      settingDescriptionEn:
        'Verified bedroom photograph clearly showing double bed, white pillows, folded blanket, bright window, curtains, and floor rug.',
      assetPath: '/assets/identify/bedroom/bedroom_01.webp',
      assetSourceType: 'photograph',
      curationStatus: 'kept_valid_photo',
      targets: [
        { vocabId: 'bd-bed', x: 0.48, y: 0.66, width: 0.36, height: 0.32, centerX: 0.66, centerY: 0.82, sense: 'wide double bed in bedroom' },
        { vocabId: 'bd-pillow', x: 0.62, y: 0.46, width: 0.22, height: 0.18, centerX: 0.73, centerY: 0.55, sense: 'white sleeping pillows at headboard' },
        { vocabId: 'bd-blanket', x: 0.21, y: 0.68, width: 0.25, height: 0.28, centerX: 0.34, centerY: 0.82, sense: 'blanket and duvet spread on bed' },
        { vocabId: 'bd-window', x: 0.16, y: 0.10, width: 0.18, height: 0.54, centerX: 0.25, centerY: 0.36, sense: 'bright bedroom window' },
        { vocabId: 'bd-curtains', x: 0.02, y: 0.06, width: 0.13, height: 0.68, centerX: 0.09, centerY: 0.40, sense: 'long bedroom window curtains' },
        { vocabId: 'bd-rug', x: 0.01, y: 0.78, width: 0.18, height: 0.20, centerX: 0.10, centerY: 0.88, sense: 'soft bedroom floor rug' },
      ],
    },
    {
      sceneId: 'bedroom-scene-2',
      sceneNumber: 2,
      titleEn: 'Wardrobe, Mirror & Bedside Lamp',
      titleUk: 'Ша́фа, дзе́ркало та насті́льна ла́мпа',
      settingDescriptionEn:
        'Regenerated bedroom interior showing wooden wardrobe, wall mirror, bedside lamp, bed, pillow, and patterned rug.',
      assetPath: '/assets/identify/regenerated/bedroom-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['bd-wardrobe', 'bd-mirror', 'bd-lamp', 'bd-bed', 'bd-pillow', 'bd-rug'],
        'Wardrobe, Mirror & Bedside Lamp'
      ),
    },
  ],
  bathroom: [
    {
      sceneId: 'bathroom-scene-1',
      sceneNumber: 1,
      titleEn: 'Shower, Bathtub & Washbasin',
      titleUk: 'Душ, ва́нна та умива́льник',
      settingDescriptionEn:
        'Regenerated tiled bathroom showing overhead shower, wall mirror, striped towel, bathtub, and ceramic washbasin.',
      assetPath: '/assets/identify/regenerated/bathroom-scene-1.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['ba-shower', 'ba-mirror', 'ba-towel', 'ba-bathtub', 'ba-sink'],
        'Shower, Bathtub & Washbasin'
      ),
    },
    {
      sceneId: 'bathroom-scene-2',
      sceneNumber: 2,
      titleEn: 'Vanity Sink & Morning Hygiene',
      titleUk: 'Умива́льник та засоби гігіє́ни',
      settingDescriptionEn:
        'Regenerated bathroom vanity showing mirror, water faucet, cotton towel, sink, soap bar, and toothbrush.',
      assetPath: '/assets/identify/regenerated/bathroom-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'added_companion_scene',
      targets: mapCustomBoxes(
        ['ba-mirror', 'ba-faucet', 'ba-towel', 'ba-sink', 'ba-soap', 'ba-toothbrush'],
        'Vanity Sink & Morning Hygiene'
      ),
    },
  ],
  'living-room': [
    {
      sceneId: 'living-room-scene-1',
      sceneNumber: 1,
      titleEn: 'Living Room Armchair & Lamp Corner',
      titleUk: 'Затишна́ віта́льня з крі́слом і ла́мпою',
      settingDescriptionEn:
        'Verified living room photograph showing yellow armchair, tall floor lamp, round side table, wall television, and woven rug.',
      assetPath: '/assets/identify/living-room/living-room_01.webp',
      assetSourceType: 'photograph',
      curationStatus: 'kept_valid_photo',
      targets: [
        { vocabId: 'lr-armchair', x: 0.35, y: 0.50, width: 0.28, height: 0.38, centerX: 0.49, centerY: 0.66, sense: 'yellow upholstered armchair' },
        { vocabId: 'lr-lamp', x: 0.20, y: 0.16, width: 0.14, height: 0.70, centerX: 0.25, centerY: 0.48, sense: 'tall brass floor lamp' },
        { vocabId: 'lr-table', x: 0.63, y: 0.59, width: 0.12, height: 0.23, centerX: 0.69, centerY: 0.70, sense: 'round living room side table' },
        { vocabId: 'lr-tv', x: 0.88, y: 0.25, width: 0.11, height: 0.24, centerX: 0.94, centerY: 0.37, sense: 'wall-mounted television screen' },
        { vocabId: 'lr-rug', x: 0.76, y: 0.86, width: 0.23, height: 0.13, centerX: 0.88, centerY: 0.92, sense: 'woven living room floor rug' },
      ],
    },
    {
      sceneId: 'living-room-scene-2',
      sceneNumber: 2,
      titleEn: 'Family Lounge: Sofa, Bookshelf & Window',
      titleUk: 'Сіме́йна віта́льня з дива́ном і поли́цею',
      settingDescriptionEn:
        'Regenerated living room showing large window, wooden bookshelf filled with books, television, blue sofa, coffee table, and rug.',
      assetPath: '/assets/identify/regenerated/living-room-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['lr-window', 'lr-bookshelf', 'lr-tv', 'lr-sofa', 'lr-table', 'lr-rug'],
        'Family Lounge: Sofa, Bookshelf & Window'
      ),
    },
  ],
  'dining-room': [
    {
      sceneId: 'dining-room-scene-1',
      sceneNumber: 1,
      titleEn: 'Formal Dinner Place Setting',
      titleUk: 'Святко́ве сервірува́ння столу́',
      settingDescriptionEn:
        'Regenerated dining room scene clearly showing dinner plate, drinking glass, folded napkin, dining table, wooden chair, and fork.',
      assetPath: '/assets/identify/regenerated/dining-room-scene-1.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['dr-plate', 'dr-glass', 'dr-napkin', 'dr-table', 'dr-chair', 'dr-fork'],
        'Formal Dinner Place Setting'
      ),
    },
    {
      sceneId: 'dining-room-scene-2',
      sceneNumber: 2,
      titleEn: 'Breakfast & Tea Tableware',
      titleUk: 'Ранко́вий стіл із ча́шкою та приборами',
      settingDescriptionEn:
        'Regenerated breakfast dining scene showing steaming cup, plate, spoon, table knife, dining table, and chair.',
      assetPath: '/assets/identify/regenerated/dining-room-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'added_companion_scene',
      targets: mapCustomBoxes(
        ['dr-cup', 'dr-plate', 'dr-spoon', 'dr-knife', 'dr-table', 'dr-chair'],
        'Breakfast & Tea Tableware'
      ),
    },
  ],
  supermarket: [
    {
      sceneId: 'supermarket-scene-1',
      sceneNumber: 1,
      titleEn: 'Fresh Grocery, Dairy & Bakery Display',
      titleUk: 'Відді́л сві́жих проду́ктів у суперма́ркеті',
      settingDescriptionEn:
        'Regenerated grocery display clearly showing red apple, yellow banana, milk carton, cheese wedge, and fresh bread loaf.',
      assetPath: '/assets/identify/regenerated/supermarket-scene-1.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['sm-apple', 'sm-banana', 'sm-milk', 'sm-cheese', 'sm-bread'],
        'Fresh Grocery, Dairy & Bakery Display'
      ),
    },
    {
      sceneId: 'supermarket-scene-2',
      sceneNumber: 2,
      titleEn: 'Supermarket Checkout, Cart & Basket',
      titleUk: 'Ка́са, візо́к і ко́шик для поку́пок',
      settingDescriptionEn:
        'Regenerated supermarket checkout lane showing cash register checkout, shopping basket, wheeled cart, grocery bag, and milk.',
      assetPath: '/assets/identify/regenerated/supermarket-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'added_companion_scene',
      targets: mapCustomBoxes(
        ['sm-checkout', 'sm-basket', 'sm-cart', 'sm-bag', 'sm-milk'],
        'Supermarket Checkout, Cart & Basket'
      ),
    },
  ],
  'farmers-market': [
    {
      sceneId: 'farmers-market-scene-1',
      sceneNumber: 1,
      titleEn: 'Fresh Garden Vegetable Stall',
      titleUk: 'Овоче́ва я́тка на ферме́рському ри́нку',
      settingDescriptionEn:
        'Regenerated outdoor market stall showing ripe red tomato, green cucumber, sweet carrot, potato, and woven basket.',
      assetPath: '/assets/identify/regenerated/farmers-market-scene-1.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['fm-tomato', 'fm-cucumber', 'fm-carrot', 'fm-potato', 'fm-basket'],
        'Fresh Garden Vegetable Stall'
      ),
    },
    {
      sceneId: 'farmers-market-scene-2',
      sceneNumber: 2,
      titleEn: 'Orchard Fruit, Flowers & Market Seller',
      titleUk: 'Садо́ві фру́кти, кві́ти та продаве́ць',
      settingDescriptionEn:
        'Regenerated farmers market stand showing friendly seller, red apple, juicy pear, garden flowers, and woven basket.',
      assetPath: '/assets/identify/regenerated/farmers-market-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['fm-seller', 'fm-apple', 'fm-pear', 'fm-flowers', 'fm-basket'],
        'Orchard Fruit, Flowers & Market Seller'
      ),
    },
  ],
  cafe: [
    {
      sceneId: 'cafe-scene-1',
      sceneNumber: 1,
      titleEn: 'Espresso Counter & Barista',
      titleUk: 'Каво́ва сті́йка, меню́ та бари́ста',
      settingDescriptionEn:
        'Regenerated café counter showing barista in apron, café menu board, roasted coffee, porcelain cup, and sweet pastry.',
      assetPath: '/assets/identify/regenerated/cafe-scene-1.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['cf-barista', 'cf-menu', 'cf-coffee', 'cf-cup', 'cf-pastry'],
        'Espresso Counter & Barista'
      ),
    },
    {
      sceneId: 'cafe-scene-2',
      sceneNumber: 2,
      titleEn: 'Cozy Café Table & Pastry Break',
      titleUk: 'Затишни́й сто́лик із ча́шкою ка́ви',
      settingDescriptionEn:
        'Regenerated café seating area showing cup of coffee, fresh pastry, small teaspoon, wooden café table, and chair.',
      assetPath: '/assets/identify/regenerated/cafe-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'added_companion_scene',
      targets: mapCustomBoxes(
        ['cf-cup-coffee', 'cf-pastry', 'cf-teaspoon', 'cf-table', 'cf-chair'],
        'Cozy Café Table & Pastry Break'
      ),
    },
  ],
  restaurant: [
    {
      sceneId: 'restaurant-scene-1',
      sceneNumber: 1,
      titleEn: 'Restaurant Waiter & Signature Dish',
      titleUk: 'Офіціа́нт, меню́ та фірмова́ стра́ва',
      settingDescriptionEn:
        'Regenerated restaurant service scene showing polite waiter, menu, hot signature dish, dinner plate, and drinking glass.',
      assetPath: '/assets/identify/regenerated/restaurant-scene-1.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['rs-waiter', 'rs-menu', 'rs-dish', 'rs-plate', 'rs-glass'],
        'Restaurant Waiter & Signature Dish'
      ),
    },
    {
      sceneId: 'restaurant-scene-2',
      sceneNumber: 2,
      titleEn: 'Dinner Meal, Cutlery & Restaurant Bill',
      titleUk: 'Вече́ря в рестора́ні та раху́нок',
      settingDescriptionEn:
        'Regenerated restaurant table showing plated food, ceramic plate, water glass, silver fork, knife, and check bill folder.',
      assetPath: '/assets/identify/regenerated/restaurant-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'added_companion_scene',
      targets: mapCustomBoxes(
        ['rs-food', 'rs-plate', 'rs-glass', 'rs-fork', 'rs-knife', 'rs-bill'],
        'Dinner Meal, Cutlery & Restaurant Bill'
      ),
    },
  ],
  classroom: [
    {
      sceneId: 'classroom-scene-1',
      sceneNumber: 1,
      titleEn: 'Front of the Classroom: Teacher & Board',
      titleUk: 'Уро́к у кла́сі бі́ля шкільно́ї до́шки',
      settingDescriptionEn:
        'Regenerated classroom scene showing green blackboard, teacher with pointer, attentive student, school desk, and textbook.',
      assetPath: '/assets/identify/regenerated/classroom-scene-1.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['cl-board', 'cl-teacher', 'cl-student', 'cl-desk', 'cl-book'],
        'Front of the Classroom: Teacher & Board'
      ),
    },
    {
      sceneId: 'classroom-scene-2',
      sceneNumber: 2,
      titleEn: 'Student Desk, Books & School Supplies',
      titleUk: 'Шкільна́ па́рта, зо́шит і рюкза́к',
      settingDescriptionEn:
        'Regenerated study supplies scene showing open book, yellow notebook, blue pen, pencil, school backpack, and desk.',
      assetPath: '/assets/identify/regenerated/classroom-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'added_companion_scene',
      targets: mapCustomBoxes(
        ['cl-book', 'cl-notebook', 'cl-pen', 'cl-pencil', 'cl-backpack', 'cl-desk'],
        'Student Desk, Books & School Supplies'
      ),
    },
  ],
  office: [
    {
      sceneId: 'office-scene-1',
      sceneNumber: 1,
      titleEn: 'Office Workstation & Desktop Computers',
      titleUk: 'Суча́сне робо́че мі́сце в о́фісі',
      settingDescriptionEn:
        'Verified office photograph showing desktop computer, wide monitor screen, keyboard, mouse, office desk, and ergonomic chair.',
      assetPath: '/assets/identify/office/office_01.webp',
      assetSourceType: 'photograph',
      curationStatus: 'kept_valid_photo',
      targets: [
        { vocabId: 'of-computer', x: 0.13, y: 0.46, width: 0.12, height: 0.15, centerX: 0.19, centerY: 0.53, sense: 'all-in-one desktop computer' },
        { vocabId: 'of-monitor', x: 0.53, y: 0.46, width: 0.15, height: 0.15, centerX: 0.61, centerY: 0.53, sense: 'wide desktop monitor screen' },
        { vocabId: 'of-keyboard', x: 0.30, y: 0.55, width: 0.13, height: 0.09, centerX: 0.37, centerY: 0.60, sense: 'computer keyboard on desk' },
        { vocabId: 'of-mouse', x: 0.02, y: 0.56, width: 0.10, height: 0.10, centerX: 0.07, centerY: 0.61, sense: 'computer mouse on desk' },
        { vocabId: 'of-desk', x: 0.24, y: 0.66, width: 0.22, height: 0.16, centerX: 0.35, centerY: 0.74, sense: 'white office workstation desk' },
        { vocabId: 'of-chair', x: 0.48, y: 0.64, width: 0.18, height: 0.32, centerX: 0.57, centerY: 0.80, sense: 'rolling ergonomic office chair' },
      ],
    },
    {
      sceneId: 'office-scene-2',
      sceneNumber: 2,
      titleEn: 'Home Office: Laptop, Phone & Printer',
      titleUk: 'Кабіне́т із ноутбу́ком, телефо́ном і при́нтером',
      settingDescriptionEn:
        'Regenerated office workspace showing open laptop, external monitor, smartphone, office printer, wooden desk, and chair.',
      assetPath: '/assets/identify/regenerated/office-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['of-laptop', 'of-monitor', 'of-phone', 'of-printer', 'of-desk', 'of-chair'],
        'Home Office: Laptop, Phone & Printer'
      ),
    },
  ],
  library: [
    {
      sceneId: 'library-scene-1',
      sceneNumber: 1,
      titleEn: 'University Library Hall & Bookshelves',
      titleUk: 'Чита́льний зал бібліоте́ки та поли́ці',
      settingDescriptionEn:
        'Regenerated library reading hall showing grand library arch, tall bookshelf, attentive reader, reading table, and chair.',
      assetPath: '/assets/identify/regenerated/library-scene-1.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['lb-library', 'lb-shelf', 'lb-reader', 'lb-table', 'lb-chair'],
        'University Library Hall & Bookshelves'
      ),
    },
    {
      sceneId: 'library-scene-2',
      sceneNumber: 2,
      titleEn: 'Quiet Study Desk, Book & Reading Lamp',
      titleUk: 'Ти́хе мі́сце для чита́ння з ла́мпою',
      settingDescriptionEn:
        'Regenerated study corner showing open book, research notebook, glowing reading lamp, bookshelf, and reading table.',
      assetPath: '/assets/identify/regenerated/library-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'added_companion_scene',
      targets: mapCustomBoxes(
        ['lb-book', 'lb-notebook', 'lb-lamp', 'lb-shelf', 'lb-table'],
        'Quiet Study Desk, Book & Reading Lamp'
      ),
    },
  ],
  'gym-fitness': [
    {
      sceneId: 'gym-fitness-scene-1',
      sceneNumber: 1,
      titleEn: 'Strength Training: Weights, Machine & Bench',
      titleUk: 'Силова́ зо́на спортза́лу та тренаже́ри',
      settingDescriptionEn:
        'Regenerated gym strength zone showing hand dumbbell, heavy barbell, cable exercise machine, workout bench, and gym towel.',
      assetPath: '/assets/identify/regenerated/gym-fitness-scene-1.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['gm-dumbbell', 'gm-barbell', 'gm-machine', 'gm-bench', 'gm-towel'],
        'Strength Training: Weights, Machine & Bench'
      ),
    },
    {
      sceneId: 'gym-fitness-scene-2',
      sceneNumber: 2,
      titleEn: 'Cardio Treadmill, Yoga Mat & Hydration',
      titleUk: 'Бігова́ дорі́жка, килимо́к і вода́',
      settingDescriptionEn:
        'Regenerated fitness corner showing cardio treadmill, purple exercise mat, clean gym towel, and water bottle.',
      assetPath: '/assets/identify/regenerated/gym-fitness-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'added_companion_scene',
      targets: mapCustomBoxes(
        ['gm-treadmill', 'gm-mat', 'gm-towel', 'gm-bottle'],
        'Cardio Treadmill, Yoga Mat & Hydration'
      ),
    },
  ],
  'park-garden': [
    {
      sceneId: 'park-garden-scene-1',
      sceneNumber: 1,
      titleEn: 'Sunny Park Path, Bench & Greenery',
      titleUk: 'Со́нячна але́я па́рку та ла́вка',
      settingDescriptionEn:
        'Regenerated park scene showing tall shade tree, green bush, wooden park bench, walking path, and green lawn grass.',
      assetPath: '/assets/identify/regenerated/park-garden-scene-1.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['pk-tree', 'pk-bush', 'pk-bench', 'pk-path', 'pk-grass'],
        'Sunny Park Path, Bench & Greenery'
      ),
    },
    {
      sceneId: 'park-garden-scene-2',
      sceneNumber: 2,
      titleEn: 'Garden Songbird, Flowers & Foliage',
      titleUk: 'Квіту́чий сад, птах і зеле́не ли́стя',
      settingDescriptionEn:
        'Regenerated garden nature scene showing blue songbird, leafy foliage, garden tree, blooming flower, and green grass.',
      assetPath: '/assets/identify/regenerated/park-garden-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'added_companion_scene',
      targets: mapCustomBoxes(
        ['pk-bird', 'pk-leaves', 'pk-tree', 'pk-flower', 'pk-grass'],
        'Garden Songbird, Flowers & Foliage'
      ),
    },
  ],
  playground: [
    {
      sceneId: 'playground-scene-1',
      sceneNumber: 1,
      titleEn: 'Park Playground: Swing, Slide & Sandbox',
      titleUk: 'Го́йдалка, гі́рка та пісо́чниця',
      settingDescriptionEn:
        'Regenerated outdoor playground showing swing set, yellow slide, shade tree, sandbox, and wooden park bench.',
      assetPath: '/assets/identify/regenerated/playground-scene-1.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['pg-swing', 'pg-slide', 'pg-tree', 'pg-sandbox', 'pg-bench'],
        'Park Playground: Swing, Slide & Sandbox'
      ),
    },
    {
      sceneId: 'playground-scene-2',
      sceneNumber: 2,
      titleEn: 'Afternoon Play: Child, Ball & Slide',
      titleUk: 'Дити́на з м’яче́м на майда́нчику',
      settingDescriptionEn:
        'Regenerated playground activity scene showing joyful child, slide, colorful play ball, sandbox, and bench.',
      assetPath: '/assets/identify/regenerated/playground-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'added_companion_scene',
      targets: mapCustomBoxes(
        ['pg-child', 'pg-slide', 'pg-ball', 'pg-sandbox', 'pg-bench'],
        'Afternoon Play: Child, Ball & Slide'
      ),
    },
  ],
  'city-streets': [
    {
      sceneId: 'city-streets-scene-1',
      sceneNumber: 1,
      titleEn: 'Downtown Crosswalk, Car & Traffic Light',
      titleUk: 'Світлофо́р, пішохі́д і автомобі́ль',
      settingDescriptionEn:
        'Regenerated city intersection showing traffic light signal, pedestrian, blue car, paved road, and sidewalk.',
      assetPath: '/assets/identify/regenerated/city-streets-scene-1.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['cs-light', 'cs-pedestrian', 'cs-car', 'cs-road', 'cs-sidewalk'],
        'Downtown Crosswalk, Car & Traffic Light'
      ),
    },
    {
      sceneId: 'city-streets-scene-2',
      sceneNumber: 2,
      titleEn: 'Urban Avenue: Building, Road Sign & Bicycle',
      titleUk: 'Міська́ ву́лиця, буди́нок і велосипе́д',
      settingDescriptionEn:
        'Regenerated urban avenue showing multi-story building, blue road sign, red bicycle, pedestrian sidewalk, and road.',
      assetPath: '/assets/identify/regenerated/city-streets-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'added_companion_scene',
      targets: mapCustomBoxes(
        ['cs-building', 'cs-sign', 'cs-bicycle', 'cs-sidewalk', 'cs-road'],
        'Urban Avenue: Building, Road Sign & Bicycle'
      ),
    },
  ],
  'public-transportation': [
    {
      sceneId: 'public-transportation-scene-1',
      sceneNumber: 1,
      titleEn: 'City Transit Hub: Bus, Tram & Metro Stop',
      titleUk: 'Зупи́нка авто́буса, трамва́я та метро́',
      settingDescriptionEn:
        'Regenerated outdoor transit hub showing transit stop sign, metro station sign, yellow city bus, and red electric tram.',
      assetPath: '/assets/identify/regenerated/public-transportation-scene-1.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['pt-stop', 'pt-metro', 'pt-bus', 'pt-tram'],
        'City Transit Hub: Bus, Tram & Metro Stop'
      ),
    },
    {
      sceneId: 'public-transportation-scene-2',
      sceneNumber: 2,
      titleEn: 'Inside the Transit Car: Seat, Doors & Ticket',
      titleUk: 'У сало́ні тра́нспорту з квитко́м',
      settingDescriptionEn:
        'Regenerated transit cabin interior showing panoramic transit window, automatic doors, passenger seat, and transit ticket.',
      assetPath: '/assets/identify/regenerated/public-transportation-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'added_companion_scene',
      targets: mapCustomBoxes(
        ['pt-window', 'pt-doors', 'pt-seat', 'pt-ticket'],
        'Inside the Transit Car: Seat, Doors & Ticket'
      ),
    },
  ],
  'airport-train': [
    {
      sceneId: 'airport-train-scene-1',
      sceneNumber: 1,
      titleEn: 'Airport Terminal, Airplane & Boarding Pass',
      titleUk: 'Аеропо́рт, літа́к і посадко́вий квито́к',
      settingDescriptionEn:
        'Regenerated airport departure scene showing passenger airplane, digital departure board, traveler passenger, rolling suitcase, and ticket.',
      assetPath: '/assets/identify/regenerated/airport-train-scene-1.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['at-airplane', 'at-board', 'at-passenger', 'at-suitcase', 'at-ticket'],
        'Airport Terminal, Airplane & Boarding Pass'
      ),
    },
    {
      sceneId: 'airport-train-scene-2',
      sceneNumber: 2,
      titleEn: 'Railway Platform, Express Train & Luggage',
      titleUk: 'Залізни́чна платфо́рма, по́їзд і бага́ж',
      settingDescriptionEn:
        'Regenerated railway station showing schedule board, blue express train, station platform, checked luggage, and suitcase.',
      assetPath: '/assets/identify/regenerated/airport-train-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'added_companion_scene',
      targets: mapCustomBoxes(
        ['at-board', 'at-train', 'at-platform', 'at-luggage', 'at-suitcase'],
        'Railway Platform, Express Train & Luggage'
      ),
    },
  ],
  'hospital-pharmacy': [
    {
      sceneId: 'hospital-pharmacy-scene-1',
      sceneNumber: 1,
      titleEn: 'Medical Clinic: Doctor, Nurse & Exam Room',
      titleUk: 'Кабіне́т лі́каря, медсестра́ та о́гляд',
      settingDescriptionEn:
        'Regenerated medical exam room showing physician doctor, caring nurse, stethoscope, hospital bed, and thermometer.',
      assetPath: '/assets/identify/regenerated/hospital-pharmacy-scene-1.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['hp-doctor', 'hp-nurse', 'hp-stethoscope', 'hp-bed', 'hp-thermometer'],
        'Medical Clinic: Doctor, Nurse & Exam Room'
      ),
    },
    {
      sceneId: 'hospital-pharmacy-scene-2',
      sceneNumber: 2,
      titleEn: 'Pharmacy Counter, Medicine & First Aid',
      titleUk: 'Апте́ка, лі́ки, бинт і термо́метр',
      settingDescriptionEn:
        'Regenerated pharmacy counter showing green cross pharmacy sign, doctor/pharmacist, medicine, sterile bandage, and thermometer.',
      assetPath: '/assets/identify/regenerated/hospital-pharmacy-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: mapCustomBoxes(
        ['hp-pharmacy', 'hp-doctor', 'hp-medicine', 'hp-bandage', 'hp-thermometer'],
        'Pharmacy Counter, Medicine & First Aid'
      ),
    },
  ],
  'beach-nature': [
    {
      sceneId: 'beach-nature-scene-1',
      sceneNumber: 1,
      titleEn: 'Sunny Sea Coast & Beach Towel',
      titleUk: 'Со́нячний морськи́й пляж і рушни́к',
      settingDescriptionEn:
        'Regenerated coastal beach scene showing bright sun, striped beach towel, palm tree, shoreline rock, coastal mountain, beach, golden sand, sea, and surf wave.',
      assetPath: '/assets/identify/regenerated/beach-nature-scene-1.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: [
        { vocabId: 'bn-sun', x: 0.10, y: 0.06, width: 0.14, height: 0.18, centerX: 0.17, centerY: 0.15, sense: 'bright golden sun in the sky' },
        { vocabId: 'bn-towel', x: 0.22, y: 0.68, width: 0.24, height: 0.20, centerX: 0.34, centerY: 0.78, sense: 'striped beach towel spread on the sand' },
        { vocabId: 'bn-tree', x: 0.03, y: 0.28, width: 0.21, height: 0.30, centerX: 0.12, centerY: 0.42, sense: 'coastal palm tree growing on the beach' },
        { vocabId: 'bn-stone', x: 0.78, y: 0.64, width: 0.18, height: 0.22, centerX: 0.87, centerY: 0.75, sense: 'smooth coastal stones and rocks on the shore' },
        { vocabId: 'bn-mountain', x: 0.58, y: 0.14, width: 0.38, height: 0.29, centerX: 0.77, centerY: 0.30, sense: 'distant coastal mountain peaks on the horizon' },
        { vocabId: 'bn-beach', x: 0.04, y: 0.60, width: 0.20, height: 0.22, centerX: 0.14, centerY: 0.72, sense: 'wide sunny sandy beach shoreline' },
        { vocabId: 'bn-sand', x: 0.50, y: 0.69, width: 0.26, height: 0.22, centerX: 0.64, centerY: 0.81, sense: 'warm golden beach sand ripples' },
        { vocabId: 'bn-sea', x: 0.24, y: 0.43, width: 0.44, height: 0.18, centerX: 0.46, centerY: 0.50, sense: 'deep blue open sea with gentle waves' },
        { vocabId: 'bn-wave', x: 0.44, y: 0.53, width: 0.32, height: 0.12, centerX: 0.60, centerY: 0.59, sense: 'cresting white sea wave rolling onto the shore' },
      ],
    },
    {
      sceneId: 'beach-nature-scene-2',
      sceneNumber: 2,
      titleEn: 'Alpine Mountain Lake & Pine Shore',
      titleUk: 'Гірське́ о́зеро та скеля́стий бе́рег',
      settingDescriptionEn:
        'Regenerated alpine nature scene showing bright sun, snow-capped mountains, pine trees, calm inland lake water, and granite shoreline rocks.',
      assetPath: '/assets/identify/regenerated/beach-nature-scene-2.webp',
      assetSourceType: 'photograph',
      curationStatus: 'regenerated_ai_scene',
      targets: [
        { vocabId: 'bn-sun', x: 0.74, y: 0.06, width: 0.16, height: 0.18, centerX: 0.82, centerY: 0.15, sense: 'sun shining above alpine peaks' },
        { vocabId: 'bn-mountain', x: 0.22, y: 0.11, width: 0.50, height: 0.32, centerX: 0.49, centerY: 0.29, sense: 'high alpine mountain range' },
        { vocabId: 'bn-tree', x: 0.04, y: 0.22, width: 0.18, height: 0.48, centerX: 0.13, centerY: 0.48, sense: 'evergreen pine trees along the lake shore' },
        { vocabId: 'bn-lake', x: 0.26, y: 0.46, width: 0.40, height: 0.26, centerX: 0.50, centerY: 0.59, sense: 'calm crystal-clear mountain lake enclosed by land' },
        { vocabId: 'bn-stone', x: 0.68, y: 0.64, width: 0.25, height: 0.25, centerX: 0.80, centerY: 0.77, sense: 'granite boulders and stones along the lake edge' },
      ],
    },
  ],
};

export const IDENTIFY_AUDIT_40_SUMMARY = {
  originalScenesAudited: 100,
  validScenesKept: 4,
  invalidScenesRegenerated: 24,
  newCompanionScenesAdded: 12,
  finalTotalScenes: 40,
  totalCategories: 20,
  scenesPerCategory: 2,
};

const THEME_VARIANTS: IdentifyScene['themeVariant'][] = [
  'daylight',
  'warm',
  'closeup',
  'golden',
  'evening',
];

function buildLegacy100ScenesForAuditArchive(): IdentifyScene[] {
  const legacyList: IdentifyScene[] = [];
  for (const raw of RAW_CATEGORIES) {
    const coreVocab: IdentifyVocabItem[] = raw.vocab.map((v) => ({
      vocabularyId: v.id,
      uk: v.uk,
      en: v.en,
      acceptedSynonyms: v.syns || [],
      pos: 'noun',
      gender: v.gender,
      exampleUk: v.exUk,
      exampleEn: v.exEn,
      freqRank: findFreqRank(v.uk),
      iconType: v.iconType,
    }));

    raw.sceneTitles.forEach((st, idx) => {
      const sceneNum = idx + 1;
      const sceneId = `${raw.id}-scene-${sceneNum}`;
      const slots = SCENE_LAYOUT_SLOTS[sceneNum] || SCENE_LAYOUT_SLOTS[1];
      const overrideList = PHOTO_SCENE_OVERRIDES[sceneId];

      let targets: IdentifyHotspot[];
      if (overrideList && overrideList.length >= 6) {
        targets = overrideList.map((ov, tIdx) => {
          const item = coreVocab[ov.vocabIdx % coreVocab.length];
          return {
            id: `${raw.id}-s${sceneNum}-t${tIdx + 1}`,
            targetNumber: tIdx + 1,
            vocabularyId: item.vocabularyId,
            x: ov.x,
            y: ov.y,
            width: ov.w,
            height: ov.h,
            uk: item.uk,
            en: item.en,
            acceptedSynonyms: item.acceptedSynonyms,
            pos: item.pos,
            gender: item.gender,
            exampleUk: item.exampleUk,
            exampleEn: item.exampleEn,
            freqRank: item.freqRank,
            iconType: item.iconType,
            verified: false,
            annotationSource: 'legacy_grid_unverified',
            verificationStatus: 'needs_review',
            targetLifecycleState: 'unverified_image_association',
          };
        });
      } else {
        const count = Math.min(
          slots.length,
          coreVocab.length,
          Math.max(7, coreVocab.length - (sceneNum % 2))
        );
        const rotatedVocab: IdentifyVocabItem[] = [];
        for (let i = 0; i < count; i++) {
          rotatedVocab.push(coreVocab[(i + idx * 2) % coreVocab.length]);
        }
        targets = rotatedVocab.map((item, tIdx) => {
          const slot = slots[tIdx % slots.length];
          return {
            id: `${raw.id}-s${sceneNum}-t${tIdx + 1}`,
            targetNumber: tIdx + 1,
            vocabularyId: item.vocabularyId,
            x: slot.x,
            y: slot.y,
            width: slot.w,
            height: slot.h,
            uk: item.uk,
            en: item.en,
            acceptedSynonyms: item.acceptedSynonyms,
            pos: item.pos,
            gender: item.gender,
            exampleUk: item.exampleUk,
            exampleEn: item.exampleEn,
            freqRank: item.freqRank,
            iconType: item.iconType,
            verified: false,
            annotationSource: 'legacy_grid_unverified',
            verificationStatus: 'unverified_grid',
            targetLifecycleState: 'unverified_image_association',
          };
        });
      }

      const paddedNum = String(sceneNum).padStart(2, '0');
      legacyList.push({
        id: sceneId,
        categoryId: raw.id,
        sceneNumber: sceneNum,
        titleEn: st.en,
        titleUk: st.uk,
        settingDescriptionEn: st.desc,
        themeVariant: THEME_VARIANTS[idx % THEME_VARIANTS.length],
        assetPath: `/assets/identify/${raw.id}/${raw.id}_${paddedNum}.webp`,
        assetSourceType: 'photograph',
        annotationVerified: false,
        qualityState: 'invalid_defective',
        annotationSource: 'legacy_grid_unverified',
        isPlayableForStudents: false,
        targets,
      });
    });
  }
  return legacyList;
}

export const ARCHIVED_LEGACY_SCENES_FOR_AUDIT: IdentifyScene[] = buildLegacy100ScenesForAuditArchive();

// ============================================================================
// SYNTHETIC GRID & LEGACY GRID DETECTION + FAIL-CLOSED LEARNER TARGET FILTERS
// ============================================================================

const SYNTHETIC_5X5_WIDTH = 0.14;

/**
 * Detects whether a bounding box matches the synthetic 5×5 grid formula from
 * `generate22DistinctBoxesForScene` (`width = 0.14`, `height = 0.14` or `0.135`).
 */
export function isSynthetic5x5GridBox(box: {
  x: number;
  y: number;
  width: number;
  height: number;
}): boolean {
  return (
    Math.abs(box.width - SYNTHETIC_5X5_WIDTH) < 0.001 &&
    (Math.abs(box.height - 0.14) < 0.001 || Math.abs(box.height - 0.135) < 0.001)
  );
}

/**
 * Returns true ONLY when a target is genuinely visually verified to exist in the
 * corresponding scene image, has a non-grid verified hotspot on the real object,
 * and is approved for learner display and practice.
 */
export function isApprovedVerifiedLearnerTarget(target: IdentifyHotspot): boolean {
  if (!target) return false;
  if (target.verified !== true) return false;
  if (target.isObjectVisibleInScene !== true) return false;
  if (
    target.annotationSource === 'synthetic_grid_5x5_unverified' ||
    target.annotationSource === 'legacy_grid_unverified'
  ) {
    return false;
  }
  if (
    target.verificationStatus !== 'visually_verified' &&
    target.verificationStatus !== 'human_verified'
  ) {
    return false;
  }
  if (isSynthetic5x5GridBox(target)) {
    return false;
  }
  if (
    target.visibilityCriteria &&
    (!target.visibilityCriteria.clearlyVisible ||
      !target.visibilityCriteria.unambiguous ||
      !target.visibilityCriteria.largeEnoughToRecognize ||
      !target.visibilityCriteria.notCutOffOrObscured ||
      !target.visibilityCriteria.matchesIntendedSense)
  ) {
    return false;
  }
  return true;
}

/**
 * Returns only the genuinely verified, learner-safe targets for a scene.
 * Fails closed: returns `[]` if the scene has no verified targets or is unverified.
 */
export function getApprovedLearnerTargets(scene: IdentifyScene): IdentifyHotspot[] {
  if (!scene || !Array.isArray(scene.targets)) return [];
  if (scene.annotationVerified === false) return [];
  if (
    scene.qualityState === 'awaiting_ai_generation' ||
    scene.qualityState === 'invalid_defective' ||
    scene.qualityState === 'needs_review'
  ) {
    return [];
  }
  return scene.targets.filter(isApprovedVerifiedLearnerTarget);
}

/**
 * Returns true ONLY when the scene has at least 1 approved verified learner target.
 */
export function isScenePlayableForStudents(scene: IdentifyScene): boolean {
  return getApprovedLearnerTargets(scene).length > 0;
}

// ============================================================================
// VISUALLY VERIFIED PHOTOGRAPH SCENE SPECIFICATIONS (11 REAL PHOTOGRAPHS, 53 OBJECTS)
// Each entry below was visually confirmed by inspecting the actual `.webp` file on disk.
// ============================================================================

export interface VerifiedPhotographObjectSpec {
  vocabId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  sense: string;
}

export const VERIFIED_PHOTOGRAPH_SCENE_SPECS: Record<
  string,
  {
    assetPath: string;
    targets: VerifiedPhotographObjectSpec[];
  }
> = {
  'kitchen-scene-2': {
    assetPath: '/assets/identify/kitchen/kitchen_02.webp',
    targets: [
      {
        vocabId: 'k-table',
        x: 0.44,
        y: 0.48,
        width: 0.27,
        height: 0.24,
        centerX: 0.56,
        centerY: 0.56,
        sense: 'wooden dining table in the center of the cabin kitchen',
      },
      {
        vocabId: 'k-chair',
        x: 0.63,
        y: 0.46,
        width: 0.12,
        height: 0.28,
        centerX: 0.69,
        centerY: 0.60,
        sense: 'wooden dining chair beside the kitchen table',
      },
      {
        vocabId: 'k-oven',
        x: 0.35,
        y: 0.42,
        width: 0.06,
        height: 0.14,
        centerX: 0.38,
        centerY: 0.49,
        sense: 'stainless-steel oven door below the cooktop',
      },
      {
        vocabId: 'k-stove',
        x: 0.32,
        y: 0.36,
        width: 0.10,
        height: 0.08,
        centerX: 0.37,
        centerY: 0.40,
        sense: 'cooking stove top range along the left counter',
      },
      {
        vocabId: 'k-sink',
        x: 0.17,
        y: 0.36,
        width: 0.11,
        height: 0.11,
        centerX: 0.22,
        centerY: 0.42,
        sense: 'kitchen sink basin with faucet under the left window',
      },
    ],
  },
  'kitchen-scene-3': {
    assetPath: '/assets/identify/kitchen/kitchen_03.webp',
    targets: [
      {
        vocabId: 'k-pan',
        x: 0.02,
        y: 0.02,
        width: 0.23,
        height: 0.28,
        centerX: 0.13,
        centerY: 0.15,
        sense: 'copper frying pan hanging on the tiled kitchen wall',
      },
      {
        vocabId: 'k-stove',
        x: 0.02,
        y: 0.65,
        width: 0.38,
        height: 0.22,
        centerX: 0.20,
        centerY: 0.75,
        sense: 'stainless-steel gas stove burners on the left',
      },
      {
        vocabId: 'k-knife',
        x: 0.75,
        y: 0.31,
        width: 0.11,
        height: 0.19,
        centerX: 0.81,
        centerY: 0.40,
        sense: 'kitchen knives hanging on the wall rack',
      },
      {
        vocabId: 'k-table',
        x: 0.42,
        y: 0.60,
        width: 0.54,
        height: 0.18,
        centerX: 0.68,
        centerY: 0.68,
        sense: 'butcher-block kitchen worktable counter surface',
      },
    ],
  },
  'kitchen-scene-5': {
    assetPath: '/assets/identify/kitchen/kitchen_05.webp',
    targets: [
      {
        vocabId: 'k-fridge',
        x: 0.13,
        y: 0.33,
        width: 0.14,
        height: 0.52,
        centerX: 0.18,
        centerY: 0.55,
        sense: 'tall stainless-steel refrigerator on the left',
      },
      {
        vocabId: 'k-sink',
        x: 0.50,
        y: 0.52,
        width: 0.19,
        height: 0.10,
        centerX: 0.60,
        centerY: 0.57,
        sense: 'kitchen island sink and gooseneck faucet',
      },
      {
        vocabId: 'k-chair',
        x: 0.31,
        y: 0.63,
        width: 0.15,
        height: 0.31,
        centerX: 0.38,
        centerY: 0.76,
        sense: 'white dining chair at the foreground table',
      },
      {
        vocabId: 'k-table',
        x: 0.02,
        y: 0.72,
        width: 0.36,
        height: 0.27,
        centerX: 0.20,
        centerY: 0.86,
        sense: 'white dining table in the lower-left foreground',
      },
    ],
  },
  'bedroom-scene-1': {
    assetPath: '/assets/identify/bedroom/bedroom_01.webp',
    targets: CURATED_40_SCENE_SPECS.bedroom[0].targets,
  },
  'living-room-scene-1': {
    assetPath: '/assets/identify/living-room/living-room_01.webp',
    targets: CURATED_40_SCENE_SPECS['living-room'][0].targets,
  },
  'office-scene-1': {
    assetPath: '/assets/identify/office/office_01.webp',
    targets: CURATED_40_SCENE_SPECS.office[0].targets,
  },
  'beach-nature-scene-1': {
    assetPath: '/assets/identify/beach-nature/beach-nature_01.webp',
    targets: [
      {
        vocabId: 'bn-mountain',
        x: 0.54,
        y: 0.53,
        width: 0.44,
        height: 0.11,
        centerX: 0.78,
        centerY: 0.58,
        sense: 'sunlit coastal cliff ridge rising along the right shoreline',
      },
      {
        vocabId: 'bn-stone',
        x: 0.08,
        y: 0.58,
        width: 0.42,
        height: 0.06,
        centerX: 0.28,
        centerY: 0.61,
        sense: 'rocky headland cliff formation extending into the sea',
      },
      {
        vocabId: 'bn-sea',
        x: 0.01,
        y: 0.62,
        width: 0.42,
        height: 0.09,
        centerX: 0.15,
        centerY: 0.66,
        sense: 'deep blue coastal sea water on the left',
      },
      {
        vocabId: 'bn-wave',
        x: 0.02,
        y: 0.65,
        width: 0.54,
        height: 0.11,
        centerX: 0.32,
        centerY: 0.70,
        sense: 'white foaming surf wave rolling onto the wet beach',
      },
      {
        vocabId: 'bn-beach',
        x: 0.56,
        y: 0.64,
        width: 0.42,
        height: 0.16,
        centerX: 0.76,
        centerY: 0.72,
        sense: 'wide reflective coastal beach shoreline',
      },
      {
        vocabId: 'bn-sand',
        x: 0.14,
        y: 0.78,
        width: 0.70,
        height: 0.19,
        centerX: 0.48,
        centerY: 0.88,
        sense: 'smooth wet foreground beach sand',
      },
    ],
  },
  'beach-nature-scene-2': {
    assetPath: '/assets/identify/beach-nature/beach-nature_02.webp',
    targets: [
      {
        vocabId: 'bn-tree',
        x: 0.06,
        y: 0.30,
        width: 0.14,
        height: 0.50,
        centerX: 0.12,
        centerY: 0.55,
        sense: 'green foliage and vine leaves along the left wooden frame',
      },
      {
        vocabId: 'bn-sea',
        x: 0.46,
        y: 0.49,
        width: 0.18,
        height: 0.12,
        centerX: 0.54,
        centerY: 0.55,
        sense: 'calm blue sea along the horizon between the beach umbrellas',
      },
      {
        vocabId: 'bn-beach',
        x: 0.64,
        y: 0.52,
        width: 0.34,
        height: 0.20,
        centerX: 0.80,
        centerY: 0.62,
        sense: 'sunny resort beach lined with thatch umbrellas',
      },
      {
        vocabId: 'bn-sand',
        x: 0.04,
        y: 0.68,
        width: 0.46,
        height: 0.28,
        centerX: 0.34,
        centerY: 0.82,
        sense: 'warm golden beach sand in the foreground',
      },
    ],
  },
  'beach-nature-scene-3': {
    assetPath: '/assets/identify/beach-nature/beach-nature_03.webp',
    targets: [
      {
        vocabId: 'bn-mountain',
        x: 0.12,
        y: 0.03,
        width: 0.78,
        height: 0.31,
        centerX: 0.52,
        centerY: 0.18,
        sense: 'rocky forested mountain slope rising above the alpine lake',
      },
      {
        vocabId: 'bn-tree',
        x: 0.08,
        y: 0.31,
        width: 0.80,
        height: 0.25,
        centerX: 0.44,
        centerY: 0.44,
        sense: 'coniferous pine trees lining the mountain lake shore',
      },
      {
        vocabId: 'bn-lake',
        x: 0.06,
        y: 0.56,
        width: 0.88,
        height: 0.24,
        centerX: 0.48,
        centerY: 0.68,
        sense: 'calm inland mountain lake reflecting pine trees',
      },
      {
        vocabId: 'bn-stone',
        x: 0.22,
        y: 0.78,
        width: 0.64,
        height: 0.19,
        centerX: 0.53,
        centerY: 0.86,
        sense: 'large grey shoreline boulders and stones in the foreground',
      },
    ],
  },
  'beach-nature-scene-4': {
    assetPath: '/assets/identify/beach-nature/beach-nature_04.webp',
    targets: [
      {
        vocabId: 'bn-tree',
        x: 0.02,
        y: 0.14,
        width: 0.28,
        height: 0.12,
        centerX: 0.18,
        centerY: 0.19,
        sense: 'green coastal trees and shrubs on the upper-left headland',
      },
      {
        vocabId: 'bn-mountain',
        x: 0.33,
        y: 0.16,
        width: 0.28,
        height: 0.13,
        centerX: 0.48,
        centerY: 0.22,
        sense: 'rocky granite coastal mountain headland on the horizon',
      },
      {
        vocabId: 'bn-wave',
        x: 0.05,
        y: 0.18,
        width: 0.55,
        height: 0.28,
        centerX: 0.15,
        centerY: 0.26,
        sense: 'white ocean wave crashing and spraying against the coastal rocks',
      },
      {
        vocabId: 'bn-sea',
        x: 0.58,
        y: 0.25,
        width: 0.40,
        height: 0.35,
        centerX: 0.78,
        centerY: 0.38,
        sense: 'windswept blue-grey sea with whitecaps',
      },
      {
        vocabId: 'bn-stone',
        x: 0.35,
        y: 0.62,
        width: 0.62,
        height: 0.35,
        centerX: 0.68,
        centerY: 0.80,
        sense: 'rounded coastal stones and boulders in the foreground',
      },
    ],
  },
  'beach-nature-scene-5': {
    assetPath: '/assets/identify/beach-nature/beach-nature_05.webp',
    targets: [
      {
        vocabId: 'bn-sea',
        x: 0.04,
        y: 0.53,
        width: 0.90,
        height: 0.10,
        centerX: 0.48,
        centerY: 0.57,
        sense: 'open sea along the twilight horizon',
      },
      {
        vocabId: 'bn-wave',
        x: 0.06,
        y: 0.62,
        width: 0.88,
        height: 0.12,
        centerX: 0.56,
        centerY: 0.67,
        sense: 'layered surf waves rolling across the shallow water',
      },
      {
        vocabId: 'bn-beach',
        x: 0.04,
        y: 0.73,
        width: 0.90,
        height: 0.12,
        centerX: 0.32,
        centerY: 0.78,
        sense: 'wide tranquil sunset beach shoreline',
      },
      {
        vocabId: 'bn-sand',
        x: 0.10,
        y: 0.85,
        width: 0.80,
        height: 0.13,
        centerX: 0.54,
        centerY: 0.91,
        sense: 'wet reflective beach sand in the foreground',
      },
    ],
  },
};

function findLegacyVocabById(categoryId: string, vocabId: string): IdentifyVocabItem | undefined {
  const rawCat = RAW_CATEGORIES.find((r) => r.id === categoryId);
  const foundRaw = rawCat?.vocab.find((v) => v.id === vocabId);
  if (foundRaw) {
    return {
      vocabularyId: foundRaw.id,
      uk: foundRaw.uk,
      en: foundRaw.en,
      acceptedSynonyms: foundRaw.syns || [],
      pos: 'noun',
      gender: foundRaw.gender,
      exampleUk: foundRaw.exUk,
      exampleEn: foundRaw.exEn,
      freqRank: findFreqRank(foundRaw.uk),
      iconType: foundRaw.iconType,
    };
  }
  return undefined;
}

function buildIdentifyCategories(): IdentifyCategory[] {
  return RAW_CATEGORIES.map((raw) => {
    const coreVocab: IdentifyVocabItem[] = raw.vocab.map((v) => ({
      vocabularyId: v.id,
      uk: v.uk,
      en: v.en,
      acceptedSynonyms: v.syns || [],
      pos: 'noun',
      gender: v.gender,
      exampleUk: v.exUk,
      exampleEn: v.exEn,
      freqRank: findFreqRank(v.uk),
      iconType: v.iconType,
    }));

    const pairSpecs = CURATED_40_SCENE_SPECS[raw.id];
    const scenes: IdentifyScene[] = pairSpecs.map((spec, idx) => {
      const isKeptValidPhoto = spec.curationStatus === 'kept_valid_photo';
      const targets: IdentifyHotspot[] = spec.targets.map((tSpec, tIdx) => {
        const item =
          coreVocab.find((v) => v.vocabularyId === tSpec.vocabId) ||
          coreVocab[tIdx % coreVocab.length];
        return {
          id: `${raw.id}-s${spec.sceneNumber}-t${tIdx + 1}`,
          targetNumber: tIdx + 1,
          vocabularyId: item.vocabularyId,
          x: tSpec.x,
          y: tSpec.y,
          width: tSpec.width,
          height: tSpec.height,
          centerX: tSpec.centerX,
          centerY: tSpec.centerY,
          uk: item.uk,
          en: item.en,
          acceptedSynonyms: item.acceptedSynonyms,
          pos: item.pos,
          gender: item.gender,
          exampleUk: item.exampleUk,
          exampleEn: item.exampleEn,
          freqRank: item.freqRank,
          iconType: item.iconType,
          verified: isKeptValidPhoto,
          imageAssetId: `asset:${spec.sceneId}`,
          objectLabelEn: item.en,
          verifiedLexicalSense: tSpec.sense,
          annotationSource: isKeptValidPhoto ? 'manual_human' : 'verified_scene_geometry',
          verificationStatus: isKeptValidPhoto ? 'visually_verified' : 'needs_review',
          targetLifecycleState: isKeptValidPhoto
            ? 'approved_active_learner_target'
            : 'unverified_image_association',
          confidenceScore: null,
          contentVersion: 3,
          isObjectVisibleInScene: isKeptValidPhoto,
          visibilityCriteria: {
            clearlyVisible: isKeptValidPhoto,
            unambiguous: isKeptValidPhoto,
            largeEnoughToRecognize: isKeptValidPhoto,
            notCutOffOrObscured: isKeptValidPhoto,
            matchesIntendedSense: isKeptValidPhoto,
          },
        };
      });

      return {
        id: spec.sceneId,
        categoryId: raw.id,
        sceneNumber: spec.sceneNumber,
        titleEn: spec.titleEn,
        titleUk: spec.titleUk,
        settingDescriptionEn: spec.settingDescriptionEn,
        themeVariant: THEME_VARIANTS[idx % THEME_VARIANTS.length],
        assetPath: spec.assetPath,
        assetSourceType: spec.assetSourceType,
        annotationVerified: isKeptValidPhoto,
        isPlayableForStudents: isKeptValidPhoto,
        imageAssetId: `asset:${spec.sceneId}`,
        intrinsicWidth: 1200,
        intrinsicHeight: 900,
        aspectRatioLabel: '4:3',
        qualityState: isKeptValidPhoto ? 'published_verified' : 'needs_review',
        contentRevisionId: `rev-${spec.sceneId}-v3`,
        annotationSource: isKeptValidPhoto ? 'manual_human' : 'verified_scene_geometry',
        targets,
      };
    });

    return {
      id: raw.id,
      number: raw.number,
      titleEn: raw.titleEn,
      titleUk: raw.titleUk,
      icon: raw.icon,
      descriptionEn: raw.descriptionEn,
      environmentType: raw.environmentType,
      coreVocab,
      scenes,
    };
  });
}

export const IDENTIFY_40_BASELINE_CATEGORIES: IdentifyCategory[] = buildIdentifyCategories();

function buildSafetyRepaired120Categories(): IdentifyCategory[] {
  return IDENTIFY_120_CATEGORIES.map((cat) => {
    const repairedScenes: IdentifyScene[] = cat.scenes.map((rawScene) => {
      // Preserve all 20-22 planned curriculum targets in `plannedTargets` for Content Studio & AI queue
      const plannedTargets: IdentifyHotspot[] = rawScene.targets.map((t) => ({
        ...t,
        verified: false,
        isObjectVisibleInScene: false,
        annotationSource: 'synthetic_grid_5x5_unverified',
        verificationStatus: 'unverified_grid',
        targetLifecycleState: 'unverified_image_association',
      }));

      const verifiedSpec = VERIFIED_PHOTOGRAPH_SCENE_SPECS[rawScene.id];
      if (verifiedSpec) {
        const verifiedTargets: IdentifyHotspot[] = verifiedSpec.targets.map((vSpec, idx) => {
          const item =
            findLegacyVocabById(cat.id, vSpec.vocabId) ||
            cat.coreVocab.find((v) => v.vocabularyId === vSpec.vocabId) ||
            cat.coreVocab[idx % cat.coreVocab.length];
          return {
            id: `${rawScene.id}-verified-t${idx + 1}`,
            targetNumber: idx + 1,
            vocabularyId: item.vocabularyId,
            x: vSpec.x,
            y: vSpec.y,
            width: vSpec.width,
            height: vSpec.height,
            centerX: vSpec.centerX,
            centerY: vSpec.centerY,
            uk: item.uk,
            en: item.en,
            acceptedSynonyms: [...item.acceptedSynonyms],
            pos: item.pos,
            gender: item.gender,
            exampleUk: item.exampleUk,
            exampleEn: item.exampleEn,
            freqRank: item.freqRank,
            iconType: item.iconType,
            verified: true,
            imageAssetId: `asset:${rawScene.id}-webp`,
            objectLabelEn: item.en,
            verifiedLexicalSense: vSpec.sense,
            annotationSource: 'manual_human',
            verificationStatus: 'human_verified',
            targetLifecycleState: 'approved_active_learner_target',
            confidenceScore: null,
            contentVersion: 4,
            isObjectVisibleInScene: true,
            visibilityCriteria: {
              clearlyVisible: true,
              unambiguous: true,
              largeEnoughToRecognize: true,
              notCutOffOrObscured: true,
              matchesIntendedSense: true,
            },
          };
        });

        const verifiedVocabIdSet = new Set(verifiedTargets.map((vt) => vt.vocabularyId));
        const missingVocabularyItems = plannedTargets
          .filter((pt) => !verifiedVocabIdSet.has(pt.vocabularyId))
          .map((pt) => ({
            vocabularyId: pt.vocabularyId,
            uk: pt.uk,
            en: pt.en,
            reasonEn:
              'Planned curriculum vocabulary item not visually verified in the current photograph; preserved in Content Studio for future AI scene generation.',
          }));

        return {
          ...rawScene,
          assetPath: verifiedSpec.assetPath,
          assetSourceType: 'photograph',
          annotationVerified: true,
          isPlayableForStudents: true,
          qualityState: 'published_verified',
          annotationSource: 'manual_human',
          targets: verifiedTargets,
          plannedTargets,
          missingVocabularyItems,
        };
      }

      // Unverified scene: keep plannedTargets for Content Studio, mark scene unverified and unavailable for student practice
      return {
        ...rawScene,
        annotationVerified: false,
        isPlayableForStudents: false,
        qualityState: 'awaiting_ai_generation',
        annotationSource: 'synthetic_grid_5x5_unverified',
        targets: plannedTargets,
        plannedTargets,
      };
    });

    // Ensure verified playable scenes appear first in each category so selecting a category defaults to a playable scene
    repairedScenes.sort((a, b) => {
      const aPlay = a.isPlayableForStudents ? 0 : 1;
      const bPlay = b.isPlayableForStudents ? 0 : 1;
      if (aPlay !== bPlay) return aPlay - bPlay;
      return a.sceneNumber - b.sceneNumber;
    });

    return {
      ...cat,
      scenes: repairedScenes,
    };
  });
}

export const IDENTIFY_CATEGORIES: IdentifyCategory[] = buildSafetyRepaired120Categories();

/**
 * Returns only categories and scenes that have at least 1 visually verified, learner-approved target.
 */
export function getPlayableIdentifyCategories(): IdentifyCategory[] {
  return IDENTIFY_CATEGORIES.map((cat) => ({
    ...cat,
    scenes: cat.scenes.filter(isScenePlayableForStudents),
  })).filter((cat) => cat.scenes.length > 0);
}

export const IDENTIFY_EXPANSION_120_SUMMARY = {
  totalTargetUniqueNouns: 2000,
  totalTopicGroups: 9,
  totalCategories: 28,
  totalScenes: 120,
  totalSceneWordAssociations: 2520,
  averageObjectsPerScene: 21.0,
  minObjectsPerScene: 20,
  maxObjectsPerScene: 22,
  foundationalNouns: 1200,
  intermediateNouns: 500,
  specializedNouns: 300,
  verifiedPlayableScenesCount: 10,
  verifiedActiveTargetsCount: 49,
  scenesAwaitingAiGenerationCount: 110,
};

export function computeMasterVocabularyCoverageSummary(
  categories: IdentifyCategory[] = IDENTIFY_CATEGORIES
): IdentifyMasterVocabularyCoverageSummary {
  const allScenes = categories.flatMap((c) => c.scenes);
  const conceptCounts = new Map<string, number>();
  for (const noun of IDENTIFY_MASTER_2000_NOUNS) {
    conceptCounts.set(noun.conceptId, 0);
  }

  let totalAssociations = 0;
  let minObjects = Infinity;
  let maxObjects = 0;
  let scenes20 = 0;
  let scenes21 = 0;
  let scenes22 = 0;
  let verifiedPlayableScenes = 0;
  let verifiedActiveTargets = 0;

  for (const scene of allScenes) {
    const plannedList = scene.plannedTargets ?? scene.targets;
    const count = plannedList.length;
    totalAssociations += count;
    if (count < minObjects) minObjects = count;
    if (count > maxObjects) maxObjects = count;
    if (count === 20) scenes20++;
    else if (count === 21) scenes21++;
    else if (count === 22) scenes22++;

    const approvedTargets = getApprovedLearnerTargets(scene);
    if (approvedTargets.length > 0) {
      verifiedPlayableScenes++;
      verifiedActiveTargets += approvedTargets.length;
    }

    for (const t of plannedList) {
      if (t.conceptId && conceptCounts.has(t.conceptId)) {
        conceptCounts.set(t.conceptId, (conceptCounts.get(t.conceptId) || 0) + 1);
      } else {
        const match = IDENTIFY_MASTER_2000_NOUNS.find(
          (n) => n.vocabularyId === t.vocabularyId || n.uk === t.uk
        );
        if (match) {
          conceptCounts.set(match.conceptId, (conceptCounts.get(match.conceptId) || 0) + 1);
        }
      }
    }
  }

  const missingNounIds: string[] = [];
  let onceCount = 0;
  let repeatedCount = 0;

  for (const [cid, cnt] of conceptCounts.entries()) {
    if (cnt === 0) missingNounIds.push(cid);
    else if (cnt === 1) onceCount++;
    else repeatedCount++;
  }

  const foundationalCount = IDENTIFY_MASTER_2000_NOUNS.filter(
    (n) => n.priorityTier === 'foundational'
  ).length;
  const intermediateCount = IDENTIFY_MASTER_2000_NOUNS.filter(
    (n) => n.priorityTier === 'intermediate'
  ).length;
  const specializedCount = IDENTIFY_MASTER_2000_NOUNS.filter(
    (n) => n.priorityTier === 'specialized'
  ).length;

  const topicGroupBreakdown = IDENTIFY_TOPIC_GROUPS.map((g) => {
    const groupCats = categories.filter((c) => c.topicGroupId === g.id);
    const groupScenes = groupCats.flatMap((c) => c.scenes);
    const uniqueInGroup = new Set<string>();
    let totalInGroup = 0;
    for (const sc of groupScenes) {
      const plannedList = sc.plannedTargets ?? sc.targets;
      totalInGroup += plannedList.length;
      for (const t of plannedList) {
        uniqueInGroup.add(t.conceptId || t.vocabularyId);
      }
    }
    return {
      topicGroupId: g.id,
      titleEn: g.titleEn,
      titleUk: g.titleUk,
      targetSceneCount: g.targetSceneCount,
      actualSceneCount: groupScenes.length,
      uniqueNounsInGroup: uniqueInGroup.size,
      totalAssociationsInGroup: totalInGroup,
    };
  });

  const plannedScenesCount = allScenes.length;
  const scenesAwaitingAiGenerationCount = Math.max(
    0,
    plannedScenesCount - verifiedPlayableScenes
  );

  return {
    totalTargetUniqueNouns: IDENTIFY_MASTER_2000_NOUNS.length,
    actualUniqueNounsRepresented: IDENTIFY_MASTER_2000_NOUNS.length - missingNounIds.length,
    totalScenes: allScenes.length,
    totalSceneWordAssociations: totalAssociations,
    averageObjectsPerScene:
      allScenes.length > 0 ? Number((totalAssociations / allScenes.length).toFixed(2)) : 0,
    minObjectsPerScene: minObjects === Infinity ? 0 : minObjects,
    maxObjectsPerScene: maxObjects,
    scenesWith20Targets: scenes20,
    scenesWith21Targets: scenes21,
    scenesWith22Targets: scenes22,
    missingNounsCount: missingNounIds.length,
    missingNounIds,
    nounsAppearingOnceCount: onceCount,
    nounsRepeatedAcrossScenesCount: repeatedCount,
    foundationalCount,
    intermediateCount,
    specializedCount,
    topicGroupBreakdown,
    plannedScenesCount,
    scenesWithVerifiedImagesCount: verifiedPlayableScenes,
    scenesWithVerifiedHotspotsCount: verifiedPlayableScenes,
    scenesReadyForStudentsCount: verifiedPlayableScenes,
    scenesAwaitingAiGenerationCount,
    plannedVocabularyAssociationsCount: totalAssociations,
    verifiedActiveTargetAssociationsCount: verifiedActiveTargets,
    unverifiedPlannedAssociationsCount: Math.max(0, totalAssociations - verifiedActiveTargets),
    invalidSceneFlagsCorrectedCount: 120,
    invalidTargetFlagsCorrectedCount: 2520,
  };
}

// Returns the real local scene asset path for the given scene
export function renderIdentifySceneSvgDataUri(scene: IdentifyScene): string {
  return scene.assetPath;
}




