// ============================================================================
// LANGO IDENTIFY — PHASE 1, BATCH 4:
// CURATION OF NEXT 200 HIGH-UTILITY EVERYDAY UKRAINIAN NOUNS (CANDIDATES 601..800),
// MULTI-DOMAIN PEDAGOGICAL CANDIDATE SELECTOR & CORRECTED LEXICAL GAP AUDIT
// ============================================================================
// IMPORTANT SAFETY BOUNDARY:
// - This module is development-only curriculum curation infrastructure.
// - It does NOT modify active learner-facing scenes (10 verified scenes,
//   49 approved active targets, 2,471 unverified associations excluded),
//   nor does it mutate IDENTIFY_MASTER_2000_NOUNS or Batches 1–3.
// ============================================================================

import type { IdentifyMasterNounEntry } from './identifyMasterNouns.ts';
import type {
  IdentifyCandidateIssueFlag,
  IdentifyCurationRecommendation,
  IdentifyCurriculumPriorityLevel,
} from './identifyCurriculumCurationPhase1.ts';
import type {
  IdentifyCoverageDomainId,
  IdentifyVisualSceneFraming,
} from './identifyCurriculumCurationPhase1Batch2.ts';

// ----------------------------------------------------------------------------
// 1. Multi-Domain Pedagogical Priority Buckets for Deterministic Selection
// ----------------------------------------------------------------------------

export type IdentifyBatch4PedagogicalDomainBucket =
  | 'food_dining'
  | 'clothing_belongings'
  | 'body_health_sports'
  | 'tech_media'
  | 'school_office'
  | 'city_shopping'
  | 'travel_transport'
  | 'nature_animals'
  | 'home_household';

export const IDENTIFY_BATCH_4_DOMAIN_BUCKET_ORDER: readonly IdentifyBatch4PedagogicalDomainBucket[] = [
  'food_dining',
  'clothing_belongings',
  'body_health_sports',
  'tech_media',
  'school_office',
  'city_shopping',
  'travel_transport',
  'nature_animals',
  'home_household',
];

export function parseMasterVocabularyNumericId(vocabularyId: string): number {
  const match = vocabularyId.match(/^id-v2-(\d+)$/);
  return match ? Number(match[1]) : 99999;
}

export function classifyEntryIntoPedagogicalDomainBucket(
  entry: IdentifyMasterNounEntry
): IdentifyBatch4PedagogicalDomainBucket {
  const idNum = parseMasterVocabularyNumericId(entry.vocabularyId);
  if ((idNum >= 810 && idNum <= 879) || (idNum >= 1500 && idNum <= 1533)) {
    return 'clothing_belongings';
  }
  if ((idNum >= 1085 && idNum <= 1149) || (idNum >= 1695 && idNum <= 1735)) {
    return 'tech_media';
  }
  if (entry.topicGroupId === 'group-2-food') return 'food_dining';
  if (entry.topicGroupId === 'group-8-health') return 'body_health_sports';
  if (entry.topicGroupId === 'group-5-education') return 'school_office';
  if (entry.topicGroupId === 'group-3-city') return 'city_shopping';
  if (entry.topicGroupId === 'group-4-travel') return 'travel_transport';
  if (entry.topicGroupId === 'group-7-nature') return 'nature_animals';
  return 'home_household';
}

// ----------------------------------------------------------------------------
// 2. Explicit Batch 4 Assessments (28 EXCLUDE, 26 REVIEW, and Key KEEP Overrides)
//    Out of 200 Batch 4 candidates: 146 KEEP + 26 REVIEW + 28 EXCLUDE = 200
// ----------------------------------------------------------------------------

export interface ExplicitBatch4Assessment {
  everydayRelevance: 'high_daily' | 'moderate_situational' | 'low_niche';
  visualRecognizability:
    | 'clear_distinct_object'
    | 'context_dependent'
    | 'poor_or_ambiguous';
  recommendedPriority: IdentifyCurriculumPriorityLevel;
  recommendedVisualFraming: IdentifyVisualSceneFraming;
  candidateSceneCategories: string[];
  recommendation: IdentifyCurationRecommendation;
  issueFlags?: IdentifyCandidateIssueFlag[];
  duplicateOfVocabularyId?: string;
  canonicalConceptId?: string;
  rationaleEn: string;
}

export const EXPLICIT_BATCH_4_ASSESSMENTS: Record<
  string,
  ExplicitBatch4Assessment
> = {
  // === KEY VERIFIED KEEP OVERRIDES WITH SLASH-COMPOUND OR SENSE NOTES ===
  'id-v2-1033': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['body-health', 'hospital-pharmacy', 'portrait-family'],
    recommendation: 'keep',
    rationaleEn:
      'рука́ / кисть (hand / arm, FREQ_6000_DB #70, COURSE_MODULES A2.3) is a foundational A0/A1 body-part noun; normalize primary learner label to рука́.',
  },
  'id-v2-960': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'city-streets', 'countryside'],
    recommendation: 'keep',
    rationaleEn:
      'соба́ка / пес (dog, FREQ_6000_DB #317, COURSE_MODULES A0.1) is a core A0 animal noun; normalize primary headword to соба́ка with пес preserved as a synonym.',
  },
  'id-v2-961': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living-room', 'bedroom', 'kitchen', 'park-garden'],
    recommendation: 'keep',
    rationaleEn:
      'кіт / кі́шка (cat, FREQ_6000_DB #318, COURSE_MODULES A0.1) is a core A0 domestic animal noun; normalize primary headword to кіт.',
  },
  'id-v2-828': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['bedroom', 'clothing-store', 'hallway-entry'],
    recommendation: 'keep',
    rationaleEn:
      'штани́ / брю́ки (trousers / pants, FREQ_6000_DB #571, COURSE_MODULES A2.3) is an essential everyday clothing noun; normalize primary headword to штани́.',
  },
  'id-v2-721': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'garage-workshop', 'public-transportation'],
    recommendation: 'keep',
    rationaleEn:
      'ши́на / покри́шка (rubber tire, FREQ_6000_DB #726, COURSE_MODULES B1.10) is a clear, high-utility vehicle/bicycle part; normalize primary headword to ши́на.',
  },
  'id-v2-700': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['public-transportation'],
    recommendation: 'keep',
    rationaleEn:
      'компо́стер / валіда́тор (ticket validator, FREQ_6000_DB #777) is a signature everyday object inside Ukrainian trams, trolleybuses, and buses.',
  },
  'id-v2-1403': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature', 'public-transportation'],
    recommendation: 'keep',
    rationaleEn:
      'корабе́ль / теплохі́д (ship, FREQ_6000_DB #865, COURSE_MODULES B1.1) is a core A1/A2 watercraft noun; normalize primary headword to корабе́ль.',
  },
  'id-v2-941': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'park-garden'],
    recommendation: 'keep',
    rationaleEn:
      'крини́ця / коло́дязь (water well, FREQ_6000_DB #921) is a culturally and visually recognizable Ukrainian village/courtyard structure.',
  },
  'id-v2-786': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom', 'office'],
    recommendation: 'keep',
    rationaleEn:
      'лі́нза / лу́па (magnifying glass, FREQ_6000_DB #1378, COURSE_MODULES B1.10) is a visually distinct optical tool; normalize label to лу́па.',
  },
  'id-v2-1015': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy', 'bathroom'],
    recommendation: 'keep',
    rationaleEn:
      'пігу́лка / табле́тка (pill / tablet, FREQ_6000_DB #1714, COURSE_MODULES A2.3) is an essential pharmacy/health noun clearly shown in a blister pack.',
  },
  'id-v2-776': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'post-office'],
    recommendation: 'keep',
    rationaleEn:
      'печа́тка / штамп (rubber stamp, FREQ_6000_DB #2005, COURSE_MODULES B1.6) is a common administrative/office desk object.',
  },
  'id-v2-892': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'countryside', 'beach-nature'],
    recommendation: 'keep',
    rationaleEn:
      'яли́на / смере́ка (spruce / fir tree, FREQ_6000_DB #2069, COURSE_MODULES B1.8) is an iconic Carpathian and winter conifer.',
  },
  'id-v2-1076': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'playground'],
    recommendation: 'keep',
    rationaleEn:
      'санка́ / са́ни (sled / toboggan, FREQ_6000_DB #578) is a classic winter recreation object; normalize headword to plural са́ни / санки́.',
  },

  // === EXPLICIT REVIEW CANDIDATES IN BATCH 4 (26 ITEMS) ===
  'id-v2-738': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['classroom', 'university-lecture-hall'],
    recommendation: 'review',
    rationaleEn:
      'ка́федра / трибу́на (lectern / podium, FREQ_6000_DB #2101) combines academic lectern and speaker podium; hold for headword normalization and lecture-hall scene planning.',
  },
  'id-v2-1732': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom', 'cultural-music'],
    recommendation: 'review',
    rationaleEn:
      'бубон / тамбури́н (tambourine, FREQ_6000_DB #1335) is visually distinct with metal jingles, but held for review on musical-instrument quota.',
  },
  'id-v2-1576': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature', 'countryside'],
    recommendation: 'review',
    rationaleEn:
      'уще́лина / каньйо́н (gorge / canyon, FREQ_6000_DB #1361) requires wide landscape framing that does not collide with доли́на (id-v2-917) or ске́ля (id-v2-920).',
  },
  'id-v2-1571': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature'],
    recommendation: 'review',
    rationaleEn:
      'бу́хта / зато́ка (bay / cove, FREQ_6000_DB #2065) is a coastal landform requiring a curved shoreline panorama to distinguish from open мо́ре (bn-sea).',
  },
  'id-v2-1493': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'museum-culture'],
    recommendation: 'review',
    rationaleEn:
      'екскурсово́д / гід (tour guide, FREQ_6000_DB #861) requires explicit visual cues (raised guide flag, badge, group at monument) to distinguish from a bystander.',
  },
  'id-v2-1155': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['clothing-store', 'tailor-workshop'],
    recommendation: 'review',
    rationaleEn:
      'ткани́на / полотно́ (bolt of fabric, FREQ_6000_DB #1272) is a material/mass noun best taught as rolled fabric bolts in a tailor shop alongside краве́ць (id-v2-1486).',
  },
  'id-v2-999': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy', 'bedroom'],
    recommendation: 'review',
    rationaleEn:
      'тоно́метр (blood pressure cuff) is widely used in Ukrainian households and clinics; held for medical close-up scene allocation.',
  },
  'id-v2-165': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen', 'countryside'],
    recommendation: 'review',
    rationaleEn:
      'каза́н (cauldron / cast-iron Dutch oven) is culturally familiar in Ukraine, but requires rounded cast-iron cauldron framing to distinguish from кастру́ля (k-pot).',
  },
  'id-v2-609': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'review',
    rationaleEn:
      'брукі́вка (cobblestone pavement) is a signature feature of historic Ukrainian streets, but requires a distinct stone-block surface box separate from доро́га (cs-road).',
  },
  'id-v2-610': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'review',
    issueFlags: ['hypernym_ambiguous'],
    rationaleEn:
      'асфа́льт (asphalt roadway) is a surface material whose bounding box in a street scene is nearly identical to доро́га (road, cs-road).',
  },
  'id-v2-820': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['bedroom', 'clothing-store'],
    recommendation: 'review',
    rationaleEn:
      'кардига́н (cardigan) requires an open front with buttons to be visually distinct from све́тр (pullover sweater, id-v2-819).',
  },
  'id-v2-750': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'classroom'],
    recommendation: 'review',
    rationaleEn:
      'швидкозшива́ч (ring binder) requires an open view of the metal ring mechanism so it is not confused with a regular па́пка (folder).',
  },
  'id-v2-902': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['park-garden', 'classroom'],
    recommendation: 'review',
    rationaleEn:
      'стебло́ (plant stem) is a botanical part-of-whole noun requiring a close-up flower diagram alongside пелю́стка (id-v2-901) and буто́н (id-v2-903).',
  },
  'id-v2-186': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'review',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'лі́йка (kitchen pouring funnel) is polysemous in Ukrainian with garden watering can (лі́йка садо́ва) and showerhead (душова́ лі́йка); requires explicit kitchen sense disambiguation.',
  },
  'id-v2-1021': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy'],
    recommendation: 'review',
    rationaleEn:
      'інгаля́тор (pocket asthma inhaler) is a recognizable L-shaped medical device; held for pharmacy/clinic close-up scene planning.',
  },
  'id-v2-903': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['park-garden'],
    recommendation: 'review',
    rationaleEn:
      'буто́н (unopened flower bud) requires close-up floral framing next to an open кві́тка (pk-flower) to be unmistakable.',
  },
  'id-v2-205': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'review',
    rationaleEn:
      'фо́льга (aluminum foil) is a common kitchen supply, but requires an open box showing reflective silver foil to distinguish from plastic wrap or baking paper.',
  },
  'id-v2-732': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['hotel-room'],
    recommendation: 'review',
    rationaleEn:
      'міні-ба́р (hotel minibar) visually resembles a compact холоди́льник (k-fridge) unless shown open in a hotel room scene.',
  },
  'id-v2-224': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['dining-room', 'living-room'],
    recommendation: 'review',
    rationaleEn:
      'серва́нт (glass-front china sideboard/buffet) requires visible dishware behind glass doors to distinguish from ша́фа (bd-wardrobe) and комо́д (id-v2-216).',
  },
  'id-v2-1109': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'creative-studio'],
    recommendation: 'review',
    rationaleEn:
      'об’єкти́в (camera lens) requires a detached lens or close-up camera framing so its bounding box does not duplicate фотоапара́т (id-v2-1108).',
  },
  'id-v2-1038': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['body-health'],
    recommendation: 'review',
    rationaleEn:
      'стопа́ (anatomical foot below ankle) requires a dedicated close-up body illustration so learners can distinguish it from full нога́ (leg/foot, id-v2-1036, kept in Batch 2).',
  },
  'id-v2-1113': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'creative-studio'],
    recommendation: 'review',
    rationaleEn:
      'відеока́мера (camcorder / cinema camera) is held for review alongside фотоапара́т (id-v2-1108) and вебка́мера (id-v2-1095) to avoid camera-device saturation.',
  },
  'id-v2-1041': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['gym-fitness'],
    recommendation: 'review',
    rationaleEn:
      'орбітре́к (elliptical trainer) is a recognizable gym machine, held for review on fitness equipment allocation alongside велотренаже́р (id-v2-1040).',
  },
  'id-v2-249': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['bedroom', 'living-room', 'hallway-entry'],
    recommendation: 'review',
    rationaleEn:
      'бра (wall sconce lamp) is held for review alongside ла́мпа (bd-lamp), лю́стра (id-v2-247), and торше́р (id-v2-248).',
  },
  'id-v2-679': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['airport-station'],
    recommendation: 'review',
    rationaleEn:
      'бирка бага́жна (luggage tag) is a small detail attached to a suitcase handle; requires close-up framing in an airport check-in scene.',
  },
  'id-v2-900': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature', 'countryside'],
    recommendation: 'review',
    rationaleEn:
      'очере́т (riverbank reeds / cattails) is visually recognizable by brown cylindrical spikes near a pond or river; held for outdoor nature scene allocation.',
  },

  // === EXPLICIT EXCLUDE CANDIDATES IN BATCH 4 (28 ITEMS) ===
  'id-v2-689': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['public-transportation'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'at-train',
    canonicalConceptId: 'noun-concept-1071',
    rationaleEn:
      'по́їзд / по́тяг (train) duplicates Batch 1 accepted at-train (по́їзд, noun-concept-1071); по́тяг is recorded as a standard synonym on the canonical train concept.',
  },
  'id-v2-693': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['public-transportation'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'at-platform',
    canonicalConceptId: 'noun-concept-1072',
    rationaleEn:
      'перо́н / платфо́рма (station platform) duplicates Batch 1 accepted at-platform (платфо́рма, noun-concept-1072); перо́н is preserved as a synonym.',
  },
  'id-v2-871': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['classroom', 'bedroom'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'cl-backpack',
    canonicalConceptId: 'noun-concept-1240',
    rationaleEn:
      'рюкза́к / наплі́чник (backpack) duplicates Batch 1 accepted cl-backpack (рюкза́к, noun-concept-1240); наплі́чник is recorded as a standard Ukrainian synonym.',
  },
  'id-v2-919': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature', 'park-garden'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'bn-stone',
    canonicalConceptId: 'noun-concept-1558',
    rationaleEn:
      'ка́мінь / валу́н (boulder / rock) duplicates Batch 1 accepted bn-stone (ка́мінь, noun-concept-1558).',
  },
  'id-v2-983': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'beach-nature'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'pk-bird',
    canonicalConceptId: 'noun-concept-1430',
    rationaleEn:
      'птах / пта́шка (bird) duplicates Batch 1 accepted pk-bird (птах, noun-concept-1430); пта́шка is recorded as a common synonym/diminutive.',
  },
  'id-v2-1730': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['cultural-music'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'duplicate_concept'],
    rationaleEn:
      'домра / кобза (kobza lute) is visually difficult for general learners to distinguish from бандýра (id-v2-1121), which represents the core Ukrainian folk lute-harp family.',
  },
  'id-v2-1945': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'зубни́й проте́з / коро́нка (dental model cast / crown) is a clinical prosthodontic term outside the 1,200 everyday vocabulary target.',
  },
  'id-v2-998': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'hp-stethoscope',
    canonicalConceptId: 'noun-concept-1839',
    rationaleEn:
      'фонендоско́п / стетоско́п (stethoscope) duplicates Batch 1 accepted hp-stethoscope (стетоско́п, noun-concept-1839).',
  },
  'id-v2-164': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept', 'overly_specialized'],
    duplicateOfVocabularyId: 'k-pan',
    canonicalConceptId: 'noun-concept-0037',
    rationaleEn:
      'соте́йник (sauté pan) is a specialized cookware subtype visually overlapping with сковорода́ / сковорі́дка (frying pan, k-pan, noun-concept-0037, kept in Batch 1).',
  },
  'id-v2-1090': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'living-room'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'of-phone',
    canonicalConceptId: 'noun-concept-1167',
    rationaleEn:
      'смартфо́н (smartphone) duplicates Batch 1 accepted of-phone (телефо́н, noun-concept-1167, defined as "telephone / smartphone" in modern scenes).',
  },
  'id-v2-1002': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['hospital-pharmacy'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'кра́пельниця (IV drip stand) is inpatient clinical hospital equipment outside the 1,200 everyday vocabulary target.',
  },
  'id-v2-184': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'overly_specialized'],
    rationaleEn:
      'ступка́ (spice mortar) is a low-frequency culinary/apothecary vessel outside core everyday needs.',
  },
  'id-v2-1010': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['hospital-pharmacy'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'бормаши́на (dental drill handpiece) is a specialized clinical dental instrument with low general conversational utility.',
  },
  'id-v2-185': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'overly_specialized'],
    rationaleEn:
      'товка́ч (pestle / masher) is a low-utility kitchen/apothecary sub-part accompanying ступка́ (id-v2-184).',
  },
  'id-v2-1016': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-1015',
    canonicalConceptId: 'noun-concept-1803',
    rationaleEn:
      'ка́псула (medicine capsule) visually and functionally overlaps with пігу́лка / табле́тка (pill / tablet, id-v2-1015, kept in Batch 4) and лі́ки (hp-medicine).',
  },
  'id-v2-225': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living-room'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept', 'unnatural_scene_filler'],
    duplicateOfVocabularyId: 'id-v2-223',
    canonicalConceptId: 'noun-concept-0314',
    rationaleEn:
      'етажерка (tiered open stand) is visually redundant alongside стела́ж (shelving unit, id-v2-223, kept in Batch 4) and поли́ця (lb-shelf).',
  },
  'id-v2-626': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'pt-doors',
    canonicalConceptId: 'noun-concept-0998',
    rationaleEn:
      'вхі́дні две́рі (entrance doors) is a modifier-padded contextual variant sharing the general Ukrainian headword две́рі (pt-doors, noun-concept-0998, kept in Batch 1; note that building entrance doors and transit doors are distinct contextual settings of general две́рі).',
  },
  'id-v2-760': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'коси́нець (set square / drafting triangle) is a specialized geometry drafting tool redundant alongside ліні́йка (ruler, id-v2-759).',
  },
  'id-v2-639': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['supermarket'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'sm-checkout',
    canonicalConceptId: 'noun-concept-0571',
    rationaleEn:
      'ка́совий апара́т (cash register) duplicates Batch 1 accepted sm-checkout (ка́са — checkout / cash register, noun-concept-0571).',
  },
  'id-v2-675': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['airport-station'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'at-board',
    canonicalConceptId: 'noun-concept-1080',
    rationaleEn:
      'табло́ ви́льотів (departure board) is a modifier-padded duplicate of Batch 1 accepted at-board (табло́ — departure board, noun-concept-1080).',
  },
  'id-v2-1112': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['creative-studio'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'софтбо́кс (studio softbox light) is specialist commercial photography studio lighting equipment.',
  },
  'id-v2-761': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'транспорти́р (protractor) is a niche geometry angle-measuring tool with low everyday communicative utility.',
  },
  'id-v2-762': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'ци́ркуль (drawing compass) is a niche school geometry tool outside the 1,200 everyday vocabulary core.',
  },
  'id-v2-642': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['supermarket'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'sm-cart',
    canonicalConceptId: 'noun-concept-0551',
    rationaleEn:
      'візо́к покупця́ (shopping cart) is a modifier-padded duplicate of Batch 1 accepted sm-cart (візо́к — shopping cart / trolley, noun-concept-0551).',
  },
  'id-v2-1115': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['beach-nature'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept', 'overly_specialized'],
    duplicateOfVocabularyId: 'id-v2-1108',
    canonicalConceptId: 'noun-concept-1982',
    rationaleEn:
      'екшн-ка́мера (action camera) is a narrow camera subtype redundant alongside фотоапара́т (id-v2-1108) and відеока́мера (id-v2-1113).',
  },
  'id-v2-1045': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['gym-fitness'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'polysemy_sense_preserved'],
    rationaleEn:
      'млине́ць (диск для штанги) (barbell weight plate) is gym slang that creates unnecessary lexical confusion with the everyday food noun млине́ць (pancake/crepe) while ганте́ля (gm-dumbbell) and шта́нга already cover gym weights.',
  },
  'id-v2-266': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living-room'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept', 'unnatural_scene_filler'],
    duplicateOfVocabularyId: 'id-v2-265',
    canonicalConceptId: 'noun-concept-0316',
    rationaleEn:
      'кашпо́ (decorative planter pot) occupies the same visual bounding box as вазо́н (potted houseplant, id-v2-265, kept in Batch 4) and echoes Batch 1 excluded id-v2-1781.',
  },
  'id-v2-844': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['clothing-store', 'bedroom'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-843',
    canonicalConceptId: 'noun-concept-1341',
    rationaleEn:
      'ке́ди (canvas sneakers) is a narrow footwear subtype visually overlapping with кросі́вки (sneakers / running shoes, id-v2-843, kept in Batch 4).',
  },
};

// ----------------------------------------------------------------------------
// 3. Batch 4 Duplicate, Synonym & Sense Resolution Records
// ----------------------------------------------------------------------------

export interface IdentifyBatch4DuplicateAndSenseRecord {
  batchNumber: 4;
  candidateVocabularyId: string;
  candidateConceptId: string;
  candidateUk: string;
  candidateEn: string;
  canonicalConceptId: string;
  canonicalVocabularyId: string;
  canonicalUk: string;
  canonicalEn: string;
  relationshipType:
    | 'DUPLICATE'
    | 'SYNONYM'
    | 'PREFERRED_HEADWORD'
    | 'MORE_SPECIFIC_SUBTYPE'
    | 'POLYSEMY';
  recommendedCanonicalEntry: string;
  curationActionOnBatch4Candidate: 'exclude' | 'keep' | 'review';
  reasonEn: string;
}

export const IDENTIFY_BATCH_4_DUPLICATE_AND_SENSE_RECORDS: readonly IdentifyBatch4DuplicateAndSenseRecord[] = [
  {
    batchNumber: 4,
    candidateVocabularyId: 'id-v2-689',
    candidateConceptId: 'noun-concept-1015',
    candidateUk: 'по́їзд / по́тяг',
    candidateEn: 'train',
    canonicalConceptId: 'noun-concept-1071',
    canonicalVocabularyId: 'at-train',
    canonicalUk: 'по́їзд',
    canonicalEn: 'train',
    relationshipType: 'SYNONYM',
    recommendedCanonicalEntry: 'at-train (по́їзд / по́тяг)',
    curationActionOnBatch4Candidate: 'exclude',
    reasonEn:
      'Slash-compound entry id-v2-689 duplicates Batch 1 accepted at-train (по́їзд); по́тяг is recorded as an accepted standard Ukrainian synonym on at-train rather than a second concept.',
  },
  {
    batchNumber: 4,
    candidateVocabularyId: 'id-v2-693',
    candidateConceptId: 'noun-concept-1064',
    candidateUk: 'перо́н / платфо́рма',
    candidateEn: 'station platform',
    canonicalConceptId: 'noun-concept-1072',
    canonicalVocabularyId: 'at-platform',
    canonicalUk: 'платфо́рма',
    canonicalEn: 'station platform',
    relationshipType: 'SYNONYM',
    recommendedCanonicalEntry: 'at-platform (платфо́рма / перо́н)',
    curationActionOnBatch4Candidate: 'exclude',
    reasonEn:
      'Duplicates Batch 1 accepted at-platform (платфо́рма); перо́н is preserved as a synonym on the existing station-platform concept.',
  },
  {
    batchNumber: 4,
    candidateVocabularyId: 'id-v2-871',
    candidateConceptId: 'noun-concept-1305',
    candidateUk: 'рюкза́к / наплі́чник',
    candidateEn: 'backpack',
    canonicalConceptId: 'noun-concept-1240',
    canonicalVocabularyId: 'cl-backpack',
    canonicalUk: 'рюкза́к',
    canonicalEn: 'backpack / schoolbag',
    relationshipType: 'SYNONYM',
    recommendedCanonicalEntry: 'cl-backpack (рюкза́к / наплі́чник)',
    curationActionOnBatch4Candidate: 'exclude',
    reasonEn:
      'Duplicates Batch 1 accepted cl-backpack (рюкза́к); наплі́чник is preserved as a standard Ukrainian synonym on cl-backpack.',
  },
  {
    batchNumber: 4,
    candidateVocabularyId: 'id-v2-919',
    candidateConceptId: 'noun-concept-1639',
    candidateUk: 'ка́мінь / валу́н',
    candidateEn: 'boulder / rock',
    canonicalConceptId: 'noun-concept-1558',
    canonicalVocabularyId: 'bn-stone',
    canonicalUk: 'ка́мінь',
    canonicalEn: 'stone / rock',
    relationshipType: 'DUPLICATE',
    recommendedCanonicalEntry: 'bn-stone (ка́мінь)',
    curationActionOnBatch4Candidate: 'exclude',
    reasonEn:
      'Duplicates Batch 1 accepted bn-stone (ка́мінь).',
  },
  {
    batchNumber: 4,
    candidateVocabularyId: 'id-v2-983',
    candidateConceptId: 'noun-concept-1522',
    candidateUk: 'птах / пта́шка',
    candidateEn: 'bird',
    canonicalConceptId: 'noun-concept-1430',
    canonicalVocabularyId: 'pk-bird',
    canonicalUk: 'птах',
    canonicalEn: 'bird',
    relationshipType: 'SYNONYM',
    recommendedCanonicalEntry: 'pk-bird (птах / пта́шка)',
    curationActionOnBatch4Candidate: 'exclude',
    reasonEn:
      'Duplicates Batch 1 accepted pk-bird (птах); пта́шка is preserved as the common everyday synonym.',
  },
  {
    batchNumber: 4,
    candidateVocabularyId: 'id-v2-998',
    candidateConceptId: 'noun-concept-1858',
    candidateUk: 'фонендоско́п / стетоско́п',
    candidateEn: 'stethoscope',
    canonicalConceptId: 'noun-concept-1839',
    canonicalVocabularyId: 'hp-stethoscope',
    canonicalUk: 'стетоско́п',
    canonicalEn: 'stethoscope',
    relationshipType: 'DUPLICATE',
    recommendedCanonicalEntry: 'hp-stethoscope (стетоско́п)',
    curationActionOnBatch4Candidate: 'exclude',
    reasonEn:
      'Duplicates Batch 1 accepted hp-stethoscope (стетоско́п).',
  },
  {
    batchNumber: 4,
    candidateVocabularyId: 'id-v2-1090',
    candidateConceptId: 'noun-concept-1979',
    candidateUk: 'смартфо́н',
    candidateEn: 'smartphone',
    canonicalConceptId: 'noun-concept-1167',
    canonicalVocabularyId: 'of-phone',
    canonicalUk: 'телефо́н',
    canonicalEn: 'telephone / smartphone',
    relationshipType: 'MORE_SPECIFIC_SUBTYPE',
    recommendedCanonicalEntry: 'of-phone (телефо́н / смартфо́н)',
    curationActionOnBatch4Candidate: 'exclude',
    reasonEn:
      'Batch 1 accepted of-phone (телефо́н) already defines its intended meaning as "telephone / smartphone"; смартфо́н is linked as a synonym/subtype rather than a separate visual pin.',
  },
  {
    batchNumber: 4,
    candidateVocabularyId: 'id-v2-639',
    candidateConceptId: 'noun-concept-0787',
    candidateUk: 'ка́совий апара́т',
    candidateEn: 'cash register',
    canonicalConceptId: 'noun-concept-0571',
    canonicalVocabularyId: 'sm-checkout',
    canonicalUk: 'ка́са',
    canonicalEn: 'checkout / cash register',
    relationshipType: 'DUPLICATE',
    recommendedCanonicalEntry: 'sm-checkout (ка́са)',
    curationActionOnBatch4Candidate: 'exclude',
    reasonEn:
      'Duplicates Batch 1 accepted sm-checkout (ка́са).',
  },
  {
    batchNumber: 4,
    candidateVocabularyId: 'id-v2-675',
    candidateConceptId: 'noun-concept-1014',
    candidateUk: 'табло́ ви́льотів',
    candidateEn: 'departure board',
    canonicalConceptId: 'noun-concept-1080',
    canonicalVocabularyId: 'at-board',
    canonicalUk: 'табло́',
    canonicalEn: 'departure board',
    relationshipType: 'PREFERRED_HEADWORD',
    recommendedCanonicalEntry: 'at-board (табло́)',
    curationActionOnBatch4Candidate: 'exclude',
    reasonEn:
      'Modifier-padded duplicate of Batch 1 accepted at-board (табло́).',
  },
  {
    batchNumber: 4,
    candidateVocabularyId: 'id-v2-642',
    candidateConceptId: 'noun-concept-0836',
    candidateUk: 'візо́к покупця́',
    candidateEn: 'shopping cart',
    canonicalConceptId: 'noun-concept-0551',
    canonicalVocabularyId: 'sm-cart',
    canonicalUk: 'візо́к',
    canonicalEn: 'shopping cart / trolley',
    relationshipType: 'PREFERRED_HEADWORD',
    recommendedCanonicalEntry: 'sm-cart (візо́к)',
    curationActionOnBatch4Candidate: 'exclude',
    reasonEn:
      'Modifier-padded duplicate of Batch 1 accepted sm-cart (візо́к).',
  },
  {
    batchNumber: 4,
    candidateVocabularyId: 'id-v2-626',
    candidateConceptId: 'noun-concept-0835',
    candidateUk: 'вхі́дні две́рі',
    candidateEn: 'entrance doors',
    canonicalConceptId: 'noun-concept-0998',
    canonicalVocabularyId: 'pt-doors',
    canonicalUk: 'две́рі',
    canonicalEn: 'transit doors',
    relationshipType: 'PREFERRED_HEADWORD',
    recommendedCanonicalEntry: 'pt-doors (две́рі)',
    curationActionOnBatch4Candidate: 'exclude',
    reasonEn:
      'Modifier-padded contextual variant (building entrance doors) sharing the general Ukrainian headword две́рі with Batch 1 accepted pt-doors (noun-concept-0998; originally glossed as "transit doors", flagged as a shared general-door headword across building and transit contexts rather than an identical physical subtype).',
  },
  {
    batchNumber: 4,
    candidateVocabularyId: 'id-v2-164',
    candidateConceptId: 'noun-concept-0374',
    candidateUk: 'соте́йник',
    candidateEn: 'sauté pan',
    canonicalConceptId: 'noun-concept-0037',
    canonicalVocabularyId: 'k-pan',
    canonicalUk: 'сковорода́',
    canonicalEn: 'frying pan',
    relationshipType: 'MORE_SPECIFIC_SUBTYPE',
    recommendedCanonicalEntry: 'k-pan (сковорода́ / сковорі́дка / пате́льня)',
    curationActionOnBatch4Candidate: 'exclude',
    reasonEn:
      'Sauté pan subtype visually overlaps with Batch 1 accepted k-pan (сковорода́, noun-concept-0037).',
  },
  {
    batchNumber: 4,
    candidateVocabularyId: 'id-v2-266',
    candidateConceptId: 'noun-concept-0329',
    candidateUk: 'кашпо́',
    candidateEn: 'decorative planter',
    canonicalConceptId: 'noun-concept-0316',
    canonicalVocabularyId: 'id-v2-265',
    canonicalUk: 'вазо́н',
    canonicalEn: 'potted houseplant',
    relationshipType: 'DUPLICATE',
    recommendedCanonicalEntry: 'id-v2-265 (вазо́н)',
    curationActionOnBatch4Candidate: 'exclude',
    reasonEn:
      'Occupies the same visual object boundary as вазо́н (id-v2-265, kept in Batch 4).',
  },
  {
    batchNumber: 4,
    candidateVocabularyId: 'id-v2-844',
    candidateConceptId: 'noun-concept-1357',
    candidateUk: 'ке́ди',
    candidateEn: 'canvas sneakers',
    canonicalConceptId: 'noun-concept-1341',
    canonicalVocabularyId: 'id-v2-843',
    canonicalUk: 'кросі́вки',
    canonicalEn: 'sneakers / running shoes',
    relationshipType: 'MORE_SPECIFIC_SUBTYPE',
    recommendedCanonicalEntry: 'id-v2-843 (кросі́вки)',
    curationActionOnBatch4Candidate: 'exclude',
    reasonEn:
      'Canvas sneaker subtype visually overlapping with canonical кросі́вки (id-v2-843, kept in Batch 4).',
  },
];

// ----------------------------------------------------------------------------
// 4. Corrected Vocabulary Gap Detection & Lexical Relationship Classification
//    Distinguishes:
//    - GENUINELY_MISSING_CONCEPT
//    - SYNONYM
//    - PREFERRED_HEADWORD
//    - MORE_SPECIFIC_SUBTYPE
//    - POLYSEMY
//    - DUPLICATE
// ----------------------------------------------------------------------------

export type IdentifyLexicalGapRelationshipType =
  | 'GENUINELY_MISSING_CONCEPT'
  | 'SYNONYM'
  | 'PREFERRED_HEADWORD'
  | 'MORE_SPECIFIC_SUBTYPE'
  | 'POLYSEMY'
  | 'DUPLICATE';

export interface IdentifyLexicalGapAuditRecord {
  proposedUk: string;
  proposedEn: string;
  domain: IdentifyCoverageDomainId;
  relationshipType: IdentifyLexicalGapRelationshipType;
  countsAsMissingConcept: boolean;
  existingMasterVocabularyIds: readonly string[];
  existingMasterUkForms: readonly string[];
  canonicalStatusInCuration:
    | 'missing_from_2000_registry'
    | 'already_accepted_in_batches_1_to_4'
    | 'present_in_2000_registry_unreviewed_or_review';
  recommendedVisualFraming: IdentifyVisualSceneFraming;
  linguisticAndPedagogicalExplanationEn: string;
}

export const IDENTIFY_BATCH_4_LEXICAL_GAP_AUDIT_RECORDS: readonly IdentifyLexicalGapAuditRecord[] = [
  // === 1. RECLASSIFIED BATCH 2 & BATCH 3 ITEMS (NOT GENUINELY MISSING CONCEPTS) ===
  {
    proposedUk: 'сковорі́дка / пате́льня',
    proposedEn: 'frying pan / skillet',
    domain: 'food_and_drinks',
    relationshipType: 'SYNONYM',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['k-pan'],
    existingMasterUkForms: ['сковорода́'],
    canonicalStatusInCuration: 'already_accepted_in_batches_1_to_4',
    recommendedVisualFraming: 'full_room_scene',
    linguisticAndPedagogicalExplanationEn:
      'Not a missing concept: the frying-pan concept is already accepted in Batch 1 as k-pan (сковорода́, noun-concept-0008). сковорі́дка and пате́льня are everyday Ukrainian synonyms that should be attached to k-pan rather than counted as a new concept.',
  },
  {
    proposedUk: 'батаре́йка',
    proposedEn: 'AA/AAA battery cell',
    domain: 'personal_belongings',
    relationshipType: 'PREFERRED_HEADWORD',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['id-v2-1712'],
    existingMasterUkForms: ['акумуля́торна батаре́йка'],
    canonicalStatusInCuration: 'present_in_2000_registry_unreviewed_or_review',
    recommendedVisualFraming: 'close_up_detail',
    linguisticAndPedagogicalExplanationEn:
      'Not a missing concept: already represented in IDENTIFY_MASTER_2000_NOUNS under the modifier-padded phrase "акумуля́торна батаре́йка" (id-v2-1712). батаре́йка is the preferred natural headword for id-v2-1712.',
  },
  {
    proposedUk: 'пульт',
    proposedEn: 'remote control',
    domain: 'home_and_furniture',
    relationshipType: 'PREFERRED_HEADWORD',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['id-v2-1103', 'id-v2-1703', 'id-v2-1981'],
    existingMasterUkForms: [
      'пульт дистанці́йного керува́ння',
      'мікше́рний пульт',
      'пульт ді-дже́я (контро́лер)',
    ],
    canonicalStatusInCuration: 'present_in_2000_registry_unreviewed_or_review',
    recommendedVisualFraming: 'close_up_detail',
    linguisticAndPedagogicalExplanationEn:
      'Not a missing concept: пульт is the preferred everyday headword for id-v2-1103 ("пульт дистанці́йного керува́ння"), while id-v2-1703 (audio mixing console) and id-v2-1981 (DJ controller) represent specialized POLYSEMY / MORE_SPECIFIC_SUBTYPE senses.',
  },
  {
    proposedUk: 'ро́утер',
    proposedEn: 'Wi-Fi router',
    domain: 'home_and_furniture',
    relationshipType: 'PREFERRED_HEADWORD',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['id-v2-1096'],
    existingMasterUkForms: ['ро́утер / маршрутиза́тор'],
    canonicalStatusInCuration: 'already_accepted_in_batches_1_to_4',
    recommendedVisualFraming: 'full_room_scene',
    linguisticAndPedagogicalExplanationEn:
      'Not a missing concept: accepted in Batch 4 via id-v2-1096 ("ро́утер / маршрутиза́тор"), where ро́утер is the preferred conversational headword and маршрутиза́тор is the formal technical synonym.',
  },
  {
    proposedUk: 'коло́нка',
    proposedEn: 'audio speaker / pump column',
    domain: 'personal_belongings',
    relationshipType: 'POLYSEMY',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['id-v2-1093', 'id-v2-726', 'id-v2-1834', 'id-v2-1340'],
    existingMasterUkForms: [
      'коло́нка аудіо',
      'бензоколо́нка',
      'запра́вна коло́нка',
      'коло́нка водопро́відна',
    ],
    canonicalStatusInCuration: 'present_in_2000_registry_unreviewed_or_review',
    recommendedVisualFraming: 'close_up_detail',
    linguisticAndPedagogicalExplanationEn:
      'Not a missing concept: коло́нка is polysemous in Ukrainian across audio speaker (id-v2-1093 "коло́нка аудіо", where коло́нка is the preferred headword), fuel dispenser (id-v2-726 "бензоколо́нка"), and street water pump (id-v2-1340 "коло́нка водопро́відна").',
  },
  {
    proposedUk: 'ка́бель',
    proposedEn: 'cable / charging cord',
    domain: 'personal_belongings',
    relationshipType: 'PREFERRED_HEADWORD',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['id-v2-1102', 'id-v2-1965'],
    existingMasterUkForms: ['ка́бель USB', 'ка́бель HDMI'],
    canonicalStatusInCuration: 'present_in_2000_registry_unreviewed_or_review',
    recommendedVisualFraming: 'close_up_detail',
    linguisticAndPedagogicalExplanationEn:
      'Not a missing concept: represented in IDENTIFY_MASTER_2000_NOUNS by MORE_SPECIFIC_SUBTYPE entries id-v2-1102 ("ка́бель USB") and id-v2-1965 ("ка́бель HDMI"), for which ка́бель is the broader preferred headword.',
  },
  {
    proposedUk: 'ма́сло',
    proposedEn: 'butter',
    domain: 'food_and_drinks',
    relationshipType: 'PREFERRED_HEADWORD',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['id-v2-487', 'id-v2-1282'],
    existingMasterUkForms: ['вершко́ве ма́сло', 'топлене ма́сло'],
    canonicalStatusInCuration: 'present_in_2000_registry_unreviewed_or_review',
    recommendedVisualFraming: 'food_table_display',
    linguisticAndPedagogicalExplanationEn:
      'Previously misclassified as a genuine omission in Batch 2: butter is already present in IDENTIFY_MASTER_2000_NOUNS as id-v2-487 ("вершко́ве ма́сло"), where ма́сло is the preferred everyday short headword.',
  },
  {
    proposedUk: 'рис',
    proposedEn: 'rice',
    domain: 'food_and_drinks',
    relationshipType: 'PREFERRED_HEADWORD',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['id-v2-520'],
    existingMasterUkForms: ['рі́с'],
    canonicalStatusInCuration: 'present_in_2000_registry_unreviewed_or_review',
    recommendedVisualFraming: 'food_table_display',
    linguisticAndPedagogicalExplanationEn:
      'Previously misclassified as a genuine omission in Batch 2 because id-v2-520 was spelled with a Russian-influenced orthographic typo ("рі́с" instead of Ukrainian "рис"). рис is the corrected headword for id-v2-520, not a missing concept.',
  },
  {
    proposedUk: 'рука́',
    proposedEn: 'hand / arm',
    domain: 'body_parts',
    relationshipType: 'PREFERRED_HEADWORD',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['id-v2-1033'],
    existingMasterUkForms: ['рука́ / кисть'],
    canonicalStatusInCuration: 'already_accepted_in_batches_1_to_4',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    linguisticAndPedagogicalExplanationEn:
      'Accepted in Batch 4 via id-v2-1033 ("рука́ / кисть"); рука́ is the preferred primary headword.',
  },
  {
    proposedUk: 'штани́',
    proposedEn: 'trousers / pants',
    domain: 'clothing',
    relationshipType: 'PREFERRED_HEADWORD',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['id-v2-828'],
    existingMasterUkForms: ['штани́ / брю́ки'],
    canonicalStatusInCuration: 'already_accepted_in_batches_1_to_4',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    linguisticAndPedagogicalExplanationEn:
      'Accepted in Batch 4 via id-v2-828 ("штани́ / брю́ки"); штани́ is the preferred everyday headword and брю́ки is a synonym.',
  },
  {
    proposedUk: 'соба́ка',
    proposedEn: 'dog',
    domain: 'everyday_nature',
    relationshipType: 'PREFERRED_HEADWORD',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['id-v2-960'],
    existingMasterUkForms: ['соба́ка / пес'],
    canonicalStatusInCuration: 'already_accepted_in_batches_1_to_4',
    recommendedVisualFraming: 'outdoor_nature_scene',
    linguisticAndPedagogicalExplanationEn:
      'Accepted in Batch 4 via id-v2-960 ("соба́ка / пес"); соба́ка and пес are synonyms for the same concept.',
  },
  {
    proposedUk: 'кіт',
    proposedEn: 'cat',
    domain: 'everyday_nature',
    relationshipType: 'PREFERRED_HEADWORD',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['id-v2-961'],
    existingMasterUkForms: ['кіт / кі́шка'],
    canonicalStatusInCuration: 'already_accepted_in_batches_1_to_4',
    recommendedVisualFraming: 'full_room_scene',
    linguisticAndPedagogicalExplanationEn:
      'Accepted in Batch 4 via id-v2-961 ("кіт / кі́шка"); кіт is the preferred primary headword.',
  },
  {
    proposedUk: 'табле́тка / пігу́лка',
    proposedEn: 'pill / tablet',
    domain: 'health',
    relationshipType: 'SYNONYM',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['id-v2-1015'],
    existingMasterUkForms: ['пігу́лка / табле́тка'],
    canonicalStatusInCuration: 'already_accepted_in_batches_1_to_4',
    recommendedVisualFraming: 'close_up_detail',
    linguisticAndPedagogicalExplanationEn:
      'Accepted in Batch 4 via id-v2-1015 ("пігу́лка / табле́тка"); пігу́лка and табле́тка are synonyms of the same accepted concept.',
  },
  {
    proposedUk: 'корабе́ль',
    proposedEn: 'ship',
    domain: 'transportation',
    relationshipType: 'PREFERRED_HEADWORD',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['id-v2-1403'],
    existingMasterUkForms: ['корабе́ль / теплохі́д'],
    canonicalStatusInCuration: 'already_accepted_in_batches_1_to_4',
    recommendedVisualFraming: 'outdoor_nature_scene',
    linguisticAndPedagogicalExplanationEn:
      'Accepted in Batch 4 via id-v2-1403 ("корабе́ль / теплохі́д"); корабе́ль is the preferred general headword.',
  },
  {
    proposedUk: 'су́мка',
    proposedEn: 'bag / handbag',
    domain: 'personal_belongings',
    relationshipType: 'PREFERRED_HEADWORD',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['id-v2-870', 'id-v2-1528', 'id-v2-1529'],
    existingMasterUkForms: ['су́мка жіно́ча', 'поясна́ су́мка', 'екосу́мка / шо́пер'],
    canonicalStatusInCuration: 'present_in_2000_registry_unreviewed_or_review',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    linguisticAndPedagogicalExplanationEn:
      'Represented in IDENTIFY_MASTER_2000_NOUNS under MORE_SPECIFIC_SUBTYPE / modifier-padded entries id-v2-870 ("су́мка жіно́ча") and id-v2-1528 ("поясна́ су́мка"); су́мка is the preferred headword for id-v2-870.',
  },
  {
    proposedUk: 'окуля́ри',
    proposedEn: 'glasses / eyeglasses',
    domain: 'personal_belongings',
    relationshipType: 'PREFERRED_HEADWORD',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['id-v2-862', 'id-v2-863', 'id-v2-1078'],
    existingMasterUkForms: ['окуля́ри для зо́ру', 'со́нцезахисні́ окуля́ри', 'окуля́ри для пла́вання'],
    canonicalStatusInCuration: 'present_in_2000_registry_unreviewed_or_review',
    recommendedVisualFraming: 'close_up_detail',
    linguisticAndPedagogicalExplanationEn:
      'Represented in IDENTIFY_MASTER_2000_NOUNS by id-v2-862 ("окуля́ри для зо́ру", preferred headword окуля́ри) and distinct subtype id-v2-863 ("со́нцезахисні́ окуля́ри", sunglasses).',
  },
  {
    proposedUk: 'чек',
    proposedEn: 'receipt',
    domain: 'shopping',
    relationshipType: 'PREFERRED_HEADWORD',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['id-v2-646'],
    existingMasterUkForms: ['чек ка́совий'],
    canonicalStatusInCuration: 'present_in_2000_registry_unreviewed_or_review',
    recommendedVisualFraming: 'close_up_detail',
    linguisticAndPedagogicalExplanationEn:
      'Represented in IDENTIFY_MASTER_2000_NOUNS as modifier-padded id-v2-646 ("чек ка́совий"); чек is the preferred concise headword.',
  },
  {
    proposedUk: 'папі́р',
    proposedEn: 'paper',
    domain: 'work',
    relationshipType: 'PREFERRED_HEADWORD',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['noun-arkush-sheet', 'id-v2-748', 'id-v2-1996'],
    existingMasterUkForms: ['а́ркуш (папе́ру)', 'а́ркуш папе́ру', 'папі́р акваре́льний факту́рний'],
    canonicalStatusInCuration: 'already_accepted_in_batches_1_to_4',
    recommendedVisualFraming: 'close_up_detail',
    linguisticAndPedagogicalExplanationEn:
      'Sheet of paper is already accepted in Batch 1 as noun-arkush-sheet ("а́ркуш (папе́ру)"), while id-v2-1996 ("папі́р акваре́льний факту́рний") is a specialized subtype.',
  },
  {
    proposedUk: 'костю́м',
    proposedEn: 'suit',
    domain: 'clothing',
    relationshipType: 'PREFERRED_HEADWORD',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['id-v2-833', 'id-v2-834'],
    existingMasterUkForms: ['костю́м ділови́й', 'спортивний костю́м'],
    canonicalStatusInCuration: 'present_in_2000_registry_unreviewed_or_review',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    linguisticAndPedagogicalExplanationEn:
      'Represented in IDENTIFY_MASTER_2000_NOUNS by id-v2-833 ("костю́м ділови́й", business suit) and id-v2-834 ("спортивний костю́м", tracksuit).',
  },
  {
    proposedUk: 'хло́пець / ді́вчина',
    proposedEn: 'young man / young woman (teenager/youth)',
    domain: 'family_and_people',
    relationshipType: 'MORE_SPECIFIC_SUBTYPE',
    countsAsMissingConcept: false,
    existingMasterVocabularyIds: ['id-v2-792', 'id-v2-793', 'id-v2-790', 'id-v2-791'],
    existingMasterUkForms: ['хло́пчик', 'ді́вчинка', 'чолові́к', 'жі́нка'],
    canonicalStatusInCuration: 'already_accepted_in_batches_1_to_4',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    linguisticAndPedagogicalExplanationEn:
      'Batch 2 already accepted хло́пчик (id-v2-792, boy), ді́вчинка (id-v2-793, girl), чолові́к (id-v2-790, man), and жі́нка (id-v2-791, woman); хло́пець and ді́вчина are age/register neighbours that would be visually ambiguous against those four in static pins.',
  },

  // === 2. VERIFIED GENUINELY MISSING HIGH-VALUE CONCEPTS (ABSENT FROM ALL 2,000 ENTRIES) ===
  {
    proposedUk: 'дріт',
    proposedEn: 'electrical wire / cord',
    domain: 'home_and_furniture',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'close_up_detail',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from all 2,000 entries in IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #1648). High-utility everyday Ukrainian noun for a wire/cord.',
  },
  {
    proposedUk: 'вода́',
    proposedEn: 'water (glass/pitcher of water)',
    domain: 'food_and_drinks',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'food_table_display',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent as a standalone target concept in IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #111, A0.1).',
  },
  {
    proposedUk: 'чай',
    proposedEn: 'tea (cup/pot of tea)',
    domain: 'food_and_drinks',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'food_table_display',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #209, A0.2), whereas ка́ва (cf-coffee) is included.',
  },
  {
    proposedUk: 'сік',
    proposedEn: 'juice (glass/carton of juice)',
    domain: 'food_and_drinks',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'food_table_display',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #1406, A0.2), while niche kissel (кисі́ль) was included.',
  },
  {
    proposedUk: 'суп',
    proposedEn: 'soup',
    domain: 'food_and_drinks',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'food_table_display',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #217, A0.2), while regional капусня́к and холодник were included.',
  },
  {
    proposedUk: 'м’я́со',
    proposedEn: 'meat',
    domain: 'food_and_drinks',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'market_counter_display',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #215, A1.1), while visually ambiguous raw cuts (свини́на, ялови́чина, теля́тина) were included.',
  },
  {
    proposedUk: 'живі́т',
    proposedEn: 'stomach / belly',
    domain: 'body_parts',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #1727, A2.1); essential for medical/symptom scenes.',
  },
  {
    proposedUk: 'брова́',
    proposedEn: 'eyebrow',
    domain: 'body_parts',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #2107) despite "щи́пчики для брів" (id-v2-1902) being included.',
  },
  {
    proposedUk: 'губа́ / гу́би',
    proposedEn: 'lip / lips',
    domain: 'body_parts',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    linguisticAndPedagogicalExplanationEn:
      'Newly identified in Batch 4: core facial body part completely omitted from IDENTIFY_MASTER_2000_NOUNS despite губна́ пома́да (id-v2-312, lipstick) being included.',
  },
  {
    proposedUk: 'щока́',
    proposedEn: 'cheek',
    domain: 'body_parts',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    linguisticAndPedagogicalExplanationEn:
      'Newly identified in Batch 4: core facial body part completely omitted from IDENTIFY_MASTER_2000_NOUNS.',
  },
  {
    proposedUk: 'лі́коть',
    proposedEn: 'elbow',
    domain: 'body_parts',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    linguisticAndPedagogicalExplanationEn:
      'Newly identified in Batch 4: core upper-body joint omitted from IDENTIFY_MASTER_2000_NOUNS even though колі́но (knee, id-v2-1037) and плече́ (shoulder, id-v2-1032) are present.',
  },
  {
    proposedUk: 'ма́ма',
    proposedEn: 'mother / mom',
    domain: 'family_and_people',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #135, A0.1), whereas бабу́ся (id-v2-796) and діду́сь (id-v2-795) are present.',
  },
  {
    proposedUk: 'ба́тько / та́то',
    proposedEn: 'father / dad',
    domain: 'family_and_people',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #134, A0.1).',
  },
  {
    proposedUk: 'підло́га',
    proposedEn: 'floor',
    domain: 'home_and_furniture',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'full_room_scene',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #700, A1.1).',
  },
  {
    proposedUk: 'сте́ля',
    proposedEn: 'ceiling',
    domain: 'home_and_furniture',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'full_room_scene',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #701, A1.1).',
  },
  {
    proposedUk: 'стіна́',
    proposedEn: 'wall',
    domain: 'home_and_furniture',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'full_room_scene',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #1596, A1.1).',
  },
  {
    proposedUk: 'гро́ші',
    proposedEn: 'money / cash',
    domain: 'personal_belongings',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'close_up_detail',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #139, A0.2).',
  },
  {
    proposedUk: 'вокза́л',
    proposedEn: 'train station building',
    domain: 'transportation',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'street_urban_scene',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #286, A1.2).',
  },
  {
    proposedUk: 'аеропо́рт',
    proposedEn: 'airport terminal',
    domain: 'transportation',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'public_service_environment',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #287, A1.2).',
  },
  {
    proposedUk: 'ву́лиця',
    proposedEn: 'street',
    domain: 'city_infrastructure',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'street_urban_scene',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #146, A0.2).',
  },
  {
    proposedUk: 'пло́ща',
    proposedEn: 'city square / plaza',
    domain: 'city_infrastructure',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'street_urban_scene',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #290, A1.2).',
  },
  {
    proposedUk: 'по́шта',
    proposedEn: 'post office',
    domain: 'city_infrastructure',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'public_service_environment',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #1605, A1.2).',
  },
  {
    proposedUk: 'магази́н',
    proposedEn: 'store / shop',
    domain: 'shopping',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'street_urban_scene',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #236, A1.1).',
  },
  {
    proposedUk: 'ри́нок',
    proposedEn: 'farmers market / bazaar',
    domain: 'shopping',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'market_counter_display',
    linguisticAndPedagogicalExplanationEn:
      'Newly identified in Batch 4: core everyday shopping setting (ри́нок / база́р) omitted from IDENTIFY_MASTER_2000_NOUNS.',
  },
  {
    proposedUk: 'шко́ла',
    proposedEn: 'school building',
    domain: 'education',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'street_urban_scene',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #130, A0.2).',
  },
  {
    proposedUk: 'університе́т',
    proposedEn: 'university building',
    domain: 'education',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'street_urban_scene',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #258, A1.1).',
  },
  {
    proposedUk: 'інжене́р',
    proposedEn: 'engineer',
    domain: 'work',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'public_service_environment',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #1451, A1.2).',
  },
  {
    proposedUk: 'програмі́ст',
    proposedEn: 'software developer / programmer',
    domain: 'work',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'public_service_environment',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #1452, A1.2).',
  },
  {
    proposedUk: 'ліка́рня',
    proposedEn: 'hospital',
    domain: 'health',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'street_urban_scene',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #262, A1.1).',
  },
  {
    proposedUk: 'паціє́нт',
    proposedEn: 'patient',
    domain: 'health',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'public_service_environment',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #2092, A2.1).',
  },
  {
    proposedUk: 'не́бо',
    proposedEn: 'sky',
    domain: 'everyday_nature',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'outdoor_nature_scene',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #304, A1.1).',
  },
  {
    proposedUk: 'ліс',
    proposedEn: 'forest / woods',
    domain: 'everyday_nature',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'outdoor_nature_scene',
    linguisticAndPedagogicalExplanationEn:
      'Verified absent from IDENTIFY_MASTER_2000_NOUNS (FREQ_6000_DB #310, A1.1).',
  },
  {
    proposedUk: 'дощ',
    proposedEn: 'rain',
    domain: 'everyday_nature',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'outdoor_nature_scene',
    linguisticAndPedagogicalExplanationEn:
      'Newly identified in Batch 4: foundational A1 weather noun (FREQ_6000_DB #306) omitted from IDENTIFY_MASTER_2000_NOUNS even though калю́жа (puddle) and парасо́лька (umbrella) are included.',
  },
  {
    proposedUk: 'сніг',
    proposedEn: 'snow',
    domain: 'everyday_nature',
    relationshipType: 'GENUINELY_MISSING_CONCEPT',
    countsAsMissingConcept: true,
    existingMasterVocabularyIds: [],
    existingMasterUkForms: [],
    canonicalStatusInCuration: 'missing_from_2000_registry',
    recommendedVisualFraming: 'outdoor_nature_scene',
    linguisticAndPedagogicalExplanationEn:
      'Newly identified in Batch 4: foundational A1 weather noun (FREQ_6000_DB #307) omitted from IDENTIFY_MASTER_2000_NOUNS even though сніжи́нка (id-v2-937) and снігови́к (id-v2-938) are included.',
  },
];

export interface IdentifyBatch4CorrectedGapSummary {
  auditVersion: '4.0.0-batch4';
  totalRecordsAudited: number;
  genuinelyMissingConceptsCount: number;
  reclassifiedNonMissingCount: number;
  breakdownByRelationshipType: Record<IdentifyLexicalGapRelationshipType, number>;
  records: readonly IdentifyLexicalGapAuditRecord[];
}

export function getBatch4CorrectedVocabularyGapReport(): IdentifyBatch4CorrectedGapSummary {
  const breakdown: Record<IdentifyLexicalGapRelationshipType, number> = {
    GENUINELY_MISSING_CONCEPT: 0,
    SYNONYM: 0,
    PREFERRED_HEADWORD: 0,
    MORE_SPECIFIC_SUBTYPE: 0,
    POLYSEMY: 0,
    DUPLICATE: 0,
  };

  let genuinelyMissingConceptsCount = 0;
  let reclassifiedNonMissingCount = 0;

  for (const rec of IDENTIFY_BATCH_4_LEXICAL_GAP_AUDIT_RECORDS) {
    breakdown[rec.relationshipType]++;
    if (rec.countsAsMissingConcept) {
      genuinelyMissingConceptsCount++;
    } else {
      reclassifiedNonMissingCount++;
    }
  }

  return {
    auditVersion: '4.0.0-batch4',
    totalRecordsAudited: IDENTIFY_BATCH_4_LEXICAL_GAP_AUDIT_RECORDS.length,
    genuinelyMissingConceptsCount,
    reclassifiedNonMissingCount,
    breakdownByRelationshipType: breakdown,
    records: IDENTIFY_BATCH_4_LEXICAL_GAP_AUDIT_RECORDS,
  };
}
