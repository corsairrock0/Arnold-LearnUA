// ============================================================================
// LANGO IDENTIFY — PHASE 1, BATCH 6:
// CURATION OF NEXT 200 EVERYDAY UKRAINIAN NOUNS (CANDIDATES 1001..1200),
// 9-CATEGORY SEMANTIC RELATIONSHIP VALIDATION, HEADWORD NORMALIZATION
// & MISSING-CONCEPT VISUAL SUITABILITY ASSESSMENT
// ============================================================================
// IMPORTANT SAFETY BOUNDARY:
// - This module is development-only curriculum curation infrastructure.
// - It does NOT modify active learner-facing scenes (10 verified scenes,
//   49 approved active targets, 2,471 unverified associations excluded),
//   nor does it mutate IDENTIFY_MASTER_2000_NOUNS or Batches 1–5.
// ============================================================================

import type {
  IdentifyCandidateIssueFlag,
  IdentifyCurationRecommendation,
  IdentifyCurriculumPriorityLevel,
} from './identifyCurriculumCurationPhase1.ts';
import type {
  IdentifyCoverageDomainId,
  IdentifyVisualSceneFraming,
} from './identifyCurriculumCurationPhase1Batch2.ts';
import {
  IDENTIFY_BATCH_4_LEXICAL_GAP_AUDIT_RECORDS,
  type ExplicitBatch4Assessment,
  type IdentifyLexicalGapAuditRecord,
} from './identifyCurriculumCurationPhase1Batch4.ts';

export type ExplicitBatch6Assessment = ExplicitBatch4Assessment;

// ----------------------------------------------------------------------------
// 1. Explicit Batch 6 Assessments (54 EXCLUDE, 38 REVIEW, and Key KEEP Overrides)
//    Out of 200 Batch 6 candidates: 108 KEEP + 38 REVIEW + 54 EXCLUDE = 200
// ----------------------------------------------------------------------------

export const EXPLICIT_BATCH_6_ASSESSMENTS: Record<
  string,
  ExplicitBatch6Assessment
> = {
  // === KEY VERIFIED KEEP OVERRIDES (CANONICAL HEADWORD NORMALIZATION & POLYSEMY) ===
  'id-v2-520': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'dining-room', 'supermarket'],
    recommendation: 'keep',
    rationaleEn:
      'рі́с (rice, FREQ_6000_DB #223, COURSE_MODULES A0.2) is a foundational A0 food staple; keep concept and normalize orthographic typo рі́с to standard Ukrainian headword рис.',
  },
  'id-v2-1103': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living-room', 'bedroom', 'hotel-room'],
    recommendation: 'keep',
    rationaleEn:
      'пульт дистанці́йного керува́ння (TV/AC remote control) is an essential everyday household device; keep concept and normalize preferred learner headword to пульт.',
  },
  'id-v2-1102': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'bedroom', 'living-room'],
    recommendation: 'keep',
    rationaleEn:
      'ка́бель USB (charging/data cable) represents the core everyday cable concept; keep and normalize preferred learner headword to ка́бель.',
  },
  'id-v2-1100': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bedroom', 'office', 'hotel-room'],
    recommendation: 'keep',
    rationaleEn:
      'заря́дний при́стрій (phone/laptop wall charger adapter) is an indispensable daily technology object; pair with conversational synonym заря́дка.',
  },
  'id-v2-1119': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living-room', 'bedroom', 'cultural-music', 'classroom'],
    recommendation: 'keep',
    rationaleEn:
      'гіта́ра акусти́чна (acoustic guitar) represents the canonical guitar concept (FREQ_6000_DB #1331); normalize preferred learner headword to гіта́ра.',
  },
  'id-v2-955': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature', 'park-garden', 'countryside'],
    recommendation: 'keep',
    rationaleEn:
      'чо́вен веслови́й (rowboat) represents the canonical boat concept (чо́вен, FREQ_6000_DB #866, A2.2); normalize preferred learner headword to чо́вен.',
  },
  'id-v2-946': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature', 'countryside', 'park-garden'],
    recommendation: 'keep',
    rationaleEn:
      'наме́т туристи́чний (camping tent) represents the canonical tent concept (наме́т); normalize preferred learner headword to наме́т.',
  },
  'id-v2-878': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom', 'bedroom', 'clothing-store'],
    recommendation: 'keep',
    rationaleEn:
      'пома́да губна́ (lipstick) is a common everyday personal-care item; normalize preferred learner headword to пома́да / губна́ пома́да.',
  },
  'id-v2-492': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket', 'farmers-market', 'dining-room'],
    recommendation: 'keep',
    rationaleEn:
      'яйце́ (egg, FREQ_6000_DB #214, A0.2) is a foundational A0 food noun; distinct from cooked dish яє́шня (fried eggs, id-v2-578).',
  },
  'id-v2-486': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket', 'dining-room'],
    recommendation: 'keep',
    rationaleEn:
      'йо́гурт (yogurt, A1.1) is a core everyday breakfast and supermarket dairy item.',
  },
  'id-v2-645': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'clothing-store', 'farmers-market'],
    recommendation: 'keep',
    rationaleEn:
      'цінни́к (price tag) is a high-utility everyday shopping noun visible across supermarkets, stores, and markets.',
  },
  'id-v2-647': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['supermarket', 'cafe', 'city-streets'],
    recommendation: 'keep',
    rationaleEn:
      'купю́ра (paper banknote / bill) is a high-utility everyday money noun alongside моне́та (coin, id-v2-648).',
  },
  'id-v2-648': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['supermarket', 'cafe', 'city-streets'],
    recommendation: 'keep',
    rationaleEn:
      'моне́та (coin) is an essential everyday shopping and payment noun.',
  },
  'id-v2-632': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'supermarket', 'hallway-entry'],
    recommendation: 'keep',
    rationaleEn:
      'поштома́т (automated parcel locker) is an iconic, ubiquitous everyday object in contemporary Ukrainian cities and apartment lobbies.',
  },
  'id-v2-1052': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['gym-fitness'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'боксерська гру́ша (heavy punching bag) is a distinct lexical sense from fm-pear (гру́ша, pear fruit) and a signature gym object.',
  },
  'id-v2-1128': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['cultural-music', 'classroom'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'труба́ музи́чна (brass trumpet) is a distinct musical sense of Ukrainian труба́ (vs plumbing pipe/chimney); normalize label to труба́ (музи́чна).',
  },
  'id-v2-1552': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'countryside'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'дзвіно́чок (квітка) (bellflower) is a distinct botanical sense of дзвіно́чок alongside mechanical bell велодзвіно́к (id-v2-1420).',
  },

  // === EXPLICIT REVIEW CANDIDATES IN BATCH 6 (38 ITEMS) ===
  'id-v2-884': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['park-garden', 'countryside'],
    recommendation: 'review',
    rationaleEn:
      'кора́ де́рева (tree bark) is a part-of-whole surface texture on стовбу́р (tree trunk, id-v2-881, kept in Batch 4); requires close-up framing to avoid hotspot collision.',
  },
  'id-v2-1020': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy', 'bathroom'],
    recommendation: 'review',
    rationaleEn:
      'кра́плі очні́ (eye drops bottle) is a small pharmacy bottle held for review alongside лі́ки (hp-medicine) and сиро́п від ка́шлю (id-v2-1018).',
  },
  'id-v2-1098': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    recommendation: 'review',
    rationaleEn:
      'зовнішній жорстки́й диск (external hard drive) visually resembles паверба́нк (power bank, id-v2-1101, kept in Batch 4) in static desk scenes.',
  },
  'id-v2-1099': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'creative-studio'],
    recommendation: 'review',
    rationaleEn:
      'ка́рта па́м’яті (SD memory card) is tiny in room scenes and held for close-up tech review alongside фле́шка (id-v2-1097).',
  },
  'id-v2-1357': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden'],
    recommendation: 'review',
    rationaleEn:
      'місто́к парковий (park footbridge) is a diminutive/subtype of міст (bridge, id-v2-931, kept in Batch 2); hold for park scene review.',
  },
  'id-v2-1359': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['park-garden', 'classroom'],
    recommendation: 'review',
    rationaleEn:
      'питни́й фонта́нчик (drinking fountain) is held for review alongside фонта́н (id-v2-607) and ку́лер для води́ (id-v2-773).',
  },
  'id-v2-921': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature'],
    recommendation: 'review',
    rationaleEn:
      'дю́на піща́на (sand dune) visually overlaps with пісо́к (bn-sand) and пляж (bn-beach) unless depicted as coastal hills.',
  },
  'id-v2-1507': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['clothing-store', 'hallway-entry'],
    recommendation: 'review',
    rationaleEn:
      'дубля́нка (shearling coat) is a winter coat subtype held for review alongside пальто́ (id-v2-824), шу́ба (id-v2-826), and пухови́к (id-v2-827).',
  },
  'id-v2-1042': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['gym-fitness'],
    recommendation: 'review',
    rationaleEn:
      'гребни́й тренаже́р (rowing machine) is a specialized gym machine held for fitness-equipment quota review.',
  },
  'id-v2-1046': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['gym-fitness'],
    recommendation: 'review',
    rationaleEn:
      'ла́ва для жи́му (weight bench) overlaps with Batch 1 REVIEW gm-bench (ла́ва); held for unified gym-bench reconciliation.',
  },
  'id-v2-1048': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['gym-fitness', 'living-room'],
    recommendation: 'review',
    rationaleEn:
      'килимо́к для йо́ги (yoga mat) overlaps with Batch 1 REVIEW gm-mat (килимо́к); held for unified reconciliation so the yoga/exercise mat concept is counted once.',
  },
  'id-v2-1106': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living-room', 'bedroom'],
    recommendation: 'review',
    rationaleEn:
      'окуля́ри віртуа́льної реа́льності (VR headset) is a secondary entertainment device held for tech quota review.',
  },
  'id-v2-1111': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['creative-studio'],
    recommendation: 'review',
    rationaleEn:
      'спа́лах фотографі́чний (camera flash / speedlight) is a part/accessory mounted on фотоапара́т (id-v2-1108).',
  },
  'id-v2-1365': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['supermarket', 'airport-station'],
    recommendation: 'review',
    rationaleEn:
      'стійка для пре́си (magazine rack) is a secondary commercial display fixture held for review.',
  },
  'id-v2-1412': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature'],
    recommendation: 'review',
    rationaleEn:
      'що́гла (ship mast) is a part-of-whole vertical pole on вітри́льник (sailboat, id-v2-957) supporting вітри́ло / па́рус (id-v2-1413).',
  },
  'id-v2-1510': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['clothing-store', 'bedroom'],
    recommendation: 'review',
    rationaleEn:
      'підтя́жки (suspenders / braces) is a lower-frequency clothing accessory compared to ремі́нь / па́сок (id-v2-854).',
  },
  'id-v2-1437': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom'],
    recommendation: 'review',
    rationaleEn:
      'ука́зка (classroom pointer stick) is a secondary classroom object held for review.',
  },
  'id-v2-1518': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['clothing-store'],
    recommendation: 'review',
    rationaleEn:
      'кашке́т (flat cap) is a headwear subtype held for review alongside ке́пка / бейсбо́лка (id-v2-848) and капелю́х (id-v2-847).',
  },
  'id-v2-1131': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['cultural-music'],
    recommendation: 'review',
    rationaleEn:
      'бараба́нні па́лички (drumsticks) is an instrument accessory paired with бараба́н (drum, id-v2-1130, kept in Batch 5).',
  },
  'id-v2-949': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'beach-nature'],
    recommendation: 'review',
    rationaleEn:
      'казано́к похі́дний (camp kettle) is a camping cookware subtype held for review alongside каза́н (id-v2-165, Batch 4 REVIEW).',
  },
  'id-v2-1133': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['cultural-music', 'classroom'],
    recommendation: 'review',
    rationaleEn:
      'но́тний зо́шит (sheet music book) is a specialized music subtype of зо́шит (notebook, cl-notebook).',
  },
  'id-v2-1448': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    recommendation: 'review',
    rationaleEn:
      'діркопробива́ч / діркоко́л (office hole punch) is a secondary office stationery tool held for review alongside сте́плер (id-v2-764).',
  },
  'id-v2-1137': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['creative-studio', 'classroom'],
    recommendation: 'review',
    rationaleEn:
      'полотно́ на підра́мнику (stretched painting canvas) sits on мольбе́рт (easel, id-v2-1136, kept in Batch 5) and requires non-overlapping pin placement.',
  },
  'id-v2-501': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'cafe'],
    recommendation: 'review',
    rationaleEn:
      'суха́р (rusk / twice-baked bread slice) is a secondary baked-good item held for review alongside бато́н (id-v2-495) and бу́блик (id-v2-500).',
  },
  'id-v2-1523': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['clothing-store', 'hallway-entry'],
    recommendation: 'review',
    rationaleEn:
      'мокаси́ни / ло́фери (loafers) is a footwear subtype visually similar to ту́флі (dress shoes, id-v2-842, kept in Batch 4).',
  },
  'id-v2-1454': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    recommendation: 'review',
    rationaleEn:
      'бі́ндер (затискач) (binder clip) is a small stationery clip held for review alongside скрі́пка (paperclip, id-v2-765, kept in Batch 4).',
  },
  'id-v2-1374': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'review',
    rationaleEn:
      'ра́ція портати́вна (walkie-talkie radio) is a situational two-way radio held for review.',
  },
  'id-v2-1426': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['city-streets', 'park-garden'],
    recommendation: 'review',
    rationaleEn:
      'катафо́т / світловідбива́ч (bicycle reflector) is a small part-of-whole safety detail on a bicycle wheel.',
  },
  'id-v2-1843': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['airport-station'],
    recommendation: 'review',
    rationaleEn:
      'телетра́п (рука́в посадкóвий) (airport jet bridge walkway) is held for airport scene review while duplicate id-v2-1384 is excluded.',
  },
  'id-v2-1526': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['clothing-store', 'bedroom'],
    recommendation: 'review',
    rationaleEn:
      'підбо́р / каблу́к (shoe heel) is a part-of-whole footwear component on ту́флі (id-v2-842) requiring close-up framing.',
  },
  'id-v2-1527': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'bedroom'],
    recommendation: 'review',
    rationaleEn:
      'візитниця (cardholder wallet) visually overlaps with гамане́ць (wallet, id-v2-867, kept in Batch 2).',
  },
  'id-v2-1142': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['creative-studio'],
    recommendation: 'review',
    rationaleEn:
      'ву́гілля для малюва́ння (drawing charcoal stick) is a specialist art supply held for review.',
  },
  'id-v2-1144': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['creative-studio', 'classroom'],
    recommendation: 'review',
    rationaleEn:
      'гли́на для лі́плення (sculpting clay) is an amorphous material mass noun held for review.',
  },
  'id-v2-1395': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['public-transportation'],
    recommendation: 'review',
    rationaleEn:
      'семафо́р залізни́чний (railway signal light) is a rail-specific counterpart to urban світлофо́р (traffic light, cs-light); held for review.',
  },
  'id-v2-1511': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['clothing-store', 'bedroom'],
    recommendation: 'review',
    rationaleEn:
      'манже́т соро́чки (shirt cuff) is a part-of-whole sub-part of соро́чка (id-v2-815) and рука́в (id-v2-861).',
  },
  'id-v2-1808': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'review',
    rationaleEn:
      'ливне́ва реші́тка (storm drain grate) is a secondary street-surface detail held for review.',
  },
  'id-v2-491': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    recommendation: 'review',
    rationaleEn:
      'моцаре́ла (mozzarella cheese) is a specific cheese variety held for review alongside canonical сир (sm-cheese) and кисломоло́чний сир (id-v2-484).',
  },
  'id-v2-1545': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'countryside'],
    recommendation: 'review',
    rationaleEn:
      'плющ (climbing ivy vine) is a botanical vine species held for review alongside core trees and flowers.',
  },

  // === EXPLICIT EXCLUDE CANDIDATES IN BATCH 6 (54 ITEMS) ===
  // 17 Cross-Batch & Within-Batch Semantic Duplicates, Modifier-Padded Variants & Subtypes
  'id-v2-876': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hallway-entry', 'bedroom'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'noun-klyuch-door',
    canonicalConceptId: 'noun-concept-0007',
    rationaleEn:
      'ключ дверни́й (house key) is an exact duplicate of Batch 1 accepted noun-klyuch-door (ключ (дверни́й), noun-concept-0007).',
  },
  'id-v2-885': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'noun-lystok-leaf',
    canonicalConceptId: 'noun-concept-0009',
    rationaleEn:
      'листо́к де́рева (tree leaf) is an exact duplicate of Batch 1 accepted noun-lystok-leaf (листо́к (де́рева), noun-concept-0009).',
  },
  'id-v2-926': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature', 'countryside'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'noun-bereh-riverbank',
    canonicalConceptId: 'noun-concept-0002',
    rationaleEn:
      'бе́рег рі́чки (riverbank / shore) is a modifier-padded duplicate of Batch 1 accepted noun-bereh-riverbank (бе́рег, noun-concept-0002).',
  },
  'id-v2-927': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'bn-wave',
    canonicalConceptId: 'noun-concept-1556',
    rationaleEn:
      'хви́ля морська́ (sea wave) is a modifier-padded duplicate of Batch 1 accepted bn-wave (хви́ля, noun-concept-1556).',
  },
  'id-v2-1043': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['gym-fitness'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'gm-barbell',
    canonicalConceptId: 'noun-concept-1698',
    rationaleEn:
      'шта́нга спортивна (barbell) is a modifier-padded duplicate of Batch 1 accepted gm-barbell (шта́нга, noun-concept-1698).',
  },
  'id-v2-1366': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['library', 'living-room'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-223',
    canonicalConceptId: 'noun-concept-0314',
    rationaleEn:
      'книжко́вий стела́ж (bookstore bookcase) is a modifier-padded duplicate of Batch 4 accepted id-v2-223 (стела́ж, noun-concept-0314) and Batch 1 lb-shelf (поли́ця).',
  },
  'id-v2-1509': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['garage-workshop', 'kitchen'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-189',
    canonicalConceptId: 'noun-concept-0073',
    rationaleEn:
      'фарту́х робо́чий (workshop apron) is a modifier-padded subtype of Batch 1 accepted id-v2-189 (фарту́х, noun-concept-0073).',
  },
  'id-v2-1806': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-609',
    canonicalConceptId: 'noun-concept-0818',
    rationaleEn:
      'бруківка кам’яна́ (cobblestone pavement) is a modifier-padded duplicate of Batch 4 reviewed id-v2-609 (брукі́вка, noun-concept-0818).',
  },
  'id-v2-1807': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-611',
    canonicalConceptId: 'noun-concept-0847',
    rationaleEn:
      'бордю́р тротуа́рний (curbstone) is a within-batch modifier-padded duplicate of Batch 6 kept id-v2-611 (бордю́р, noun-concept-0847).',
  },
  'id-v2-1384': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['airport-station'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-1843',
    canonicalConceptId: 'noun-concept-0954',
    rationaleEn:
      'рука́в посадко́вий (телетрап) (aerobridge / jet bridge) is an exact within-batch duplicate of id-v2-1843 (телетра́п (рука́в посадкóвий), noun-concept-0954).',
  },
  'id-v2-1367': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['library'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'overly_specialized'],
    duplicateOfVocabularyId: 'id-v2-374',
    canonicalConceptId: 'noun-concept-0384',
    rationaleEn:
      'драби́нка бібліоте́чна (rolling library ladder) is a narrow subtype of Batch 6 kept id-v2-374 (драби́на — stepladder / ladder, noun-concept-0384).',
  },
  'id-v2-1370': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['post-office'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'overly_specialized'],
    duplicateOfVocabularyId: 'id-v2-319',
    canonicalConceptId: 'noun-concept-0158',
    rationaleEn:
      'ваги́ пошто́ві (postal scale) is a specialized scale subtype redundant alongside Batch 3 accepted id-v2-319 (підло́гові ваги́ / ваги́).',
  },
  'id-v2-789': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['classroom', 'hospital-pharmacy'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'overly_specialized'],
    duplicateOfVocabularyId: 'id-v2-295',
    canonicalConceptId: 'noun-concept-0097',
    rationaleEn:
      'лаборато́рний хала́т (lab coat) is a specialized subtype of Batch 3 accepted id-v2-295 (хала́т, noun-concept-0097).',
  },
  'id-v2-1058': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'playground'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'compositional_phrase'],
    duplicateOfVocabularyId: 'pg-ball',
    canonicalConceptId: 'noun-concept-1677',
    rationaleEn:
      'футбо́льний м’яч (soccer ball) is a sport-specific subtype of Batch 1 accepted pg-ball (м’яч, noun-concept-1677); excluded to prevent inflating the 1,200 core with multiple adjective+м’яч entries.',
  },
  'id-v2-1059': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'playground'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'compositional_phrase'],
    duplicateOfVocabularyId: 'pg-ball',
    canonicalConceptId: 'noun-concept-1677',
    rationaleEn:
      'баскетбо́льний м’яч (basketball) is a sport-specific subtype of Batch 1 accepted pg-ball (м’яч, noun-concept-1677).',
  },
  'id-v2-1060': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature', 'park-garden'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'compositional_phrase'],
    duplicateOfVocabularyId: 'pg-ball',
    canonicalConceptId: 'noun-concept-1677',
    rationaleEn:
      'волейбо́льний м’яч (volleyball) is a sport-specific subtype of Batch 1 accepted pg-ball (м’яч, noun-concept-1677).',
  },
  'id-v2-1062': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'compositional_phrase'],
    duplicateOfVocabularyId: 'pg-ball',
    canonicalConceptId: 'noun-concept-1677',
    rationaleEn:
      'те́нісний м’яч (tennis ball) is a sport-specific subtype of Batch 1 accepted pg-ball (м’яч, noun-concept-1677).',
  },

  // 37 Specialist, Lab, Drafting, Industrial & Obscure Exclusions (Excluded for low everyday priority, NOT labeled as duplicates)
  'id-v2-1039': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'скеле́т навча́льний (anatomical skeleton model) is a specialist biology classroom prop outside the 1,200 everyday vocabulary core.',
  },
  'id-v2-783': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'па́льник Бу́нзена (Bunsen burner) is specialized chemistry-laboratory equipment.',
  },
  'id-v2-784': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'ча́шка Пе́трі (Petri dish) is specialized microbiology laboratory glassware.',
  },
  'id-v2-785': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'предме́тне ске́льце (microscope glass slide) is a tiny laboratory accessory.',
  },
  'id-v2-1441': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'рахі́вниця (wooden counting abacus) is an archaic calculating tool superseded in everyday life by калькуля́тор (id-v2-769, kept in Batch 5).',
  },
  'id-v2-1449': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'антисте́плер (staple remover claw) is a minor office tool outside the 1,200 everyday vocabulary core.',
  },
  'id-v2-1458': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['office'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'кульман / креслярська до́шка (mechanical drafting board) is specialist engineering/architectural drafting equipment.',
  },
  'id-v2-1459': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'рейсши́на (T-square drafting ruler) is a specialist technical drafting tool.',
  },
  'id-v2-1460': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'tailor-workshop'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'лека́ло (French curve drafting template) is a niche drafting/pattern-making tool.',
  },
  'id-v2-1461': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['garage-workshop'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'штангенци́ркуль (vernier caliper) is a precision machinist measuring instrument.',
  },
  'id-v2-1462': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['garage-workshop'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'мікро́метр (micrometer screw gauge) is a specialist mechanical engineering gauge.',
  },
  'id-v2-1464': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['garage-workshop'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'overly_specialized'],
    rationaleEn:
      'кова́дло (blacksmith anvil) is a traditional forge tool with minimal modern everyday utility.',
  },
  'id-v2-1465': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['garage-workshop'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'пая́льник (electronics soldering iron) is a specialist electronics repair tool.',
  },
  'id-v2-1466': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['garage-workshop'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'мульти́метр (digital multimeter) is a specialist electrical diagnostic meter.',
  },
  'id-v2-1502': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['museum-culture'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'overly_specialized'],
    rationaleEn:
      'жупа́н / сви́та (historical Cossack/folk outer coat) is an ethnographic historical garment outside everyday contemporary clothing.',
  },
  'id-v2-1503': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['museum-culture'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'overly_specialized'],
    rationaleEn:
      'кра́йка (пояс) (traditional woven folk sash) is a regional ethnographic costume term, whereas вишива́нка (id-v2-816) and віно́к український (id-v2-1500) cover core Ukrainian traditional dress.',
  },
  'id-v2-1512': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['clothing-store'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'overly_specialized'],
    rationaleEn:
      'за́понки (formal shirt cufflinks) is a tiny formalwear accessory with low general utility.',
  },
  'id-v2-1513': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['clothing-store'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'overly_specialized'],
    rationaleEn:
      'шпи́лька для крава́тки (tie clip) is a tiny formalwear accessory outside the 1,200 everyday vocabulary core.',
  },
  'id-v2-1517': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['clothing-store'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'вуа́ль / фата́ (bridal veil) is a ceremonial wedding garment outside core everyday clothing.',
  },
  'id-v2-1358': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'unnatural_scene_filler'],
    rationaleEn:
      'со́нячний годинни́к (sundial) is a rare park ornament with low everyday communicative utility.',
  },
  'id-v2-1368': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['post-office'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'пошто́вий мішо́к (canvas mailbag) is back-office postal sorting equipment, whereas поси́лка (id-v2-635) and конве́рт (id-v2-634) cover everyday mail.',
  },
  'id-v2-1369': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['post-office'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'overly_specialized'],
    rationaleEn:
      'сургу́чна печа́тка (archaic wax seal stamp) is a historical postal tool.',
  },
  'id-v2-1371': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['supermarket'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'детектор банкно́т (UV banknote verifier) is specialist cashier hardware.',
  },
  'id-v2-1372': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['office'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'лічи́льник купю́р (cash bill counter machine) is specialized bank-teller equipment.',
  },
  'id-v2-1375': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'жезл регулюва́льника (traffic police baton) is a specialized law-enforcement signaling rod.',
  },
  'id-v2-1377': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'поже́жний топіре́ць (fire axe) is specialized emergency-board firefighting gear.',
  },
  'id-v2-1379': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'відбі́йний молото́к (pneumatic jackhammer) is heavy road-demolition machinery.',
  },
  'id-v2-1380': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'кото́к доро́жній (asphalt steamroller) is specialized road-paving machinery.',
  },
  'id-v2-1382': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['supermarket'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'наванта́жувач вилкови́й (warehouse forklift) is industrial warehouse machinery.',
  },
  'id-v2-1385': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['airport-station'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'тяга́ч аеродро́мний (aircraft pushback tug) is specialized airport tarmac ground-handling machinery.',
  },
  'id-v2-1394': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['airport-station'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'overly_specialized'],
    rationaleEn:
      'пла́нер (sailplane / unpowered glider) is a niche aviation aircraft visually similar to літа́к (at-airplane).',
  },
  'id-v2-1396': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['public-transportation'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'стрі́лка залізни́чна (railroad track switch mechanism) is a technical rail-infrastructure sub-part of ко́лія залізни́чна (id-v2-694).',
  },
  'id-v2-1398': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['public-transportation'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'панто́граф (overhead electric current collector on a tram/train roof) is a technical transit engineering term.',
  },
  'id-v2-1399': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['public-transportation'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'бу́фер ваго́нний (railcar shock-absorbing coupling buffer) is a technical rolling-stock sub-part.',
  },
  'id-v2-1400': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['public-transportation'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'стоп-кра́н (train emergency brake lever) is a niche rail-cabin fixture.',
  },
  'id-v2-1405': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'букси́р (harbor tugboat) is a specialized industrial vessel subtype redundant alongside корабе́ль (id-v2-1403), чо́вен (id-v2-955), and поро́м (id-v2-1404).',
  },
  'id-v2-1145': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['creative-studio'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'гонча́рний круг (potter’s wheel) is specialist ceramics workshop equipment.',
  },
};

// ----------------------------------------------------------------------------
// 2. Batch 6 Semantic Relationship Validation (9 Distinct Relationship Types)
//    Explicitly distinguishes:
//    - EXACT_SAME_CONCEPT
//    - SYNONYM_OR_ALTERNATE_HEADWORD
//    - INFLECTIONAL_VARIANT
//    - MODIFIER_PADDED_DUPLICATE
//    - MORE_SPECIFIC_SUBTYPE
//    - PART_VERSUS_WHOLE
//    - RELATED_BUT_DISTINCT_OBJECT
//    - DIFFERENT_LEXICAL_SENSE
//    - UNRELATED_SIMILAR_SPELLING
// ----------------------------------------------------------------------------

export type IdentifyBatch6SemanticRelationshipType =
  | 'EXACT_SAME_CONCEPT'
  | 'SYNONYM_OR_ALTERNATE_HEADWORD'
  | 'INFLECTIONAL_VARIANT'
  | 'MODIFIER_PADDED_DUPLICATE'
  | 'MORE_SPECIFIC_SUBTYPE'
  | 'PART_VERSUS_WHOLE'
  | 'RELATED_BUT_DISTINCT_OBJECT'
  | 'DIFFERENT_LEXICAL_SENSE'
  | 'UNRELATED_SIMILAR_SPELLING';

export interface IdentifyBatch6SemanticRelationshipRecord {
  batchNumber: 6;
  candidateVocabularyId: string;
  candidateConceptId: string;
  candidateUk: string;
  candidateEn: string;
  comparedVocabularyId: string;
  comparedConceptId: string;
  comparedUk: string;
  comparedEn: string;
  relationshipType: IdentifyBatch6SemanticRelationshipType;
  countsAsDuplicateConcept: boolean;
  curationActionOnBatch6Candidate: IdentifyCurationRecommendation;
  preferredCanonicalHeadwordUk: string;
  reasonEn: string;
}

export const IDENTIFY_BATCH_6_SEMANTIC_RELATIONSHIP_RECORDS: readonly IdentifyBatch6SemanticRelationshipRecord[] = [
  // === 17 EXCLUDED DUPLICATES, MODIFIER-PADDED VARIANTS & SPORT/OBJECT SUBTYPES ===
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-876',
    candidateConceptId: 'noun-concept-1335',
    candidateUk: 'ключ дверни́й',
    candidateEn: 'house key',
    comparedVocabularyId: 'noun-klyuch-door',
    comparedConceptId: 'noun-concept-0007',
    comparedUk: 'ключ (дверни́й)',
    comparedEn: 'door key',
    relationshipType: 'EXACT_SAME_CONCEPT',
    countsAsDuplicateConcept: true,
    curationActionOnBatch6Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'ключ',
    reasonEn:
      'Exact same concept as Batch 1 accepted noun-klyuch-door (ключ (дверни́й), noun-concept-0007).',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-885',
    candidateConceptId: 'noun-concept-1533',
    candidateUk: 'листо́к де́рева',
    candidateEn: 'tree leaf',
    comparedVocabularyId: 'noun-lystok-leaf',
    comparedConceptId: 'noun-concept-0009',
    comparedUk: 'листо́к (де́рева)',
    comparedEn: 'tree leaf',
    relationshipType: 'EXACT_SAME_CONCEPT',
    countsAsDuplicateConcept: true,
    curationActionOnBatch6Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'листо́к',
    reasonEn:
      'Exact same concept as Batch 1 accepted noun-lystok-leaf (листо́к (де́рева), noun-concept-0009).',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-1384',
    candidateConceptId: 'noun-concept-1058',
    candidateUk: 'рука́в посадко́вий (телетрап)',
    candidateEn: 'aerobridge / jet bridge',
    comparedVocabularyId: 'id-v2-1843',
    comparedConceptId: 'noun-concept-0954',
    comparedUk: 'телетра́п (рука́в посадкóвий)',
    comparedEn: 'jet bridge walkway',
    relationshipType: 'EXACT_SAME_CONCEPT',
    countsAsDuplicateConcept: true,
    curationActionOnBatch6Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'телетра́п',
    reasonEn:
      'Exact within-batch duplicate of id-v2-1843 (телетра́п (рука́в посадкóвий), noun-concept-0954).',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-926',
    candidateConceptId: 'noun-concept-1537',
    candidateUk: 'бе́рег рі́чки',
    candidateEn: 'riverbank / shore',
    comparedVocabularyId: 'noun-bereh-riverbank',
    comparedConceptId: 'noun-concept-0002',
    comparedUk: 'бе́рег',
    comparedEn: 'riverbank / shore',
    relationshipType: 'MODIFIER_PADDED_DUPLICATE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch6Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'бе́рег',
    reasonEn:
      'Modifier-padded duplicate of Batch 1 accepted noun-bereh-riverbank (бе́рег, noun-concept-0002).',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-927',
    candidateConceptId: 'noun-concept-1577',
    candidateUk: 'хви́ля морська́',
    candidateEn: 'sea wave',
    comparedVocabularyId: 'bn-wave',
    comparedConceptId: 'noun-concept-1556',
    comparedUk: 'хви́ля',
    comparedEn: 'wave',
    relationshipType: 'MODIFIER_PADDED_DUPLICATE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch6Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'хви́ля',
    reasonEn:
      'Modifier-padded duplicate of Batch 1 accepted bn-wave (хви́ля, noun-concept-1556).',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-1043',
    candidateConceptId: 'noun-concept-1767',
    candidateUk: 'шта́нга спортивна',
    candidateEn: 'barbell',
    comparedVocabularyId: 'gm-barbell',
    comparedConceptId: 'noun-concept-1698',
    comparedUk: 'шта́нга',
    comparedEn: 'barbell',
    relationshipType: 'MODIFIER_PADDED_DUPLICATE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch6Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'шта́нга',
    reasonEn:
      'Modifier-padded duplicate of Batch 1 accepted gm-barbell (шта́нга, noun-concept-1698).',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-1366',
    candidateConceptId: 'noun-concept-0758',
    candidateUk: 'книжко́вий стела́ж',
    candidateEn: 'bookstore bookcase',
    comparedVocabularyId: 'id-v2-223',
    comparedConceptId: 'noun-concept-0314',
    comparedUk: 'стела́ж',
    comparedEn: 'shelving unit',
    relationshipType: 'MODIFIER_PADDED_DUPLICATE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch6Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'стела́ж',
    reasonEn:
      'Modifier-padded duplicate of Batch 4 accepted id-v2-223 (стела́ж, noun-concept-0314).',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-1509',
    candidateConceptId: 'noun-concept-1269',
    candidateUk: 'фарту́х робо́чий',
    candidateEn: 'workshop apron',
    comparedVocabularyId: 'id-v2-189',
    comparedConceptId: 'noun-concept-0073',
    comparedUk: 'фарту́х',
    comparedEn: 'kitchen apron',
    relationshipType: 'MODIFIER_PADDED_DUPLICATE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch6Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'фарту́х',
    reasonEn:
      'Modifier-padded duplicate of Batch 1 accepted id-v2-189 (фарту́х, noun-concept-0073).',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-1806',
    candidateConceptId: 'noun-concept-0753',
    candidateUk: 'бруківка кам’яна́',
    candidateEn: 'cobblestone pavement',
    comparedVocabularyId: 'id-v2-609',
    comparedConceptId: 'noun-concept-0818',
    comparedUk: 'брукі́вка',
    comparedEn: 'cobblestone pavement',
    relationshipType: 'MODIFIER_PADDED_DUPLICATE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch6Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'брукі́вка',
    reasonEn:
      'Modifier-padded duplicate of Batch 4 reviewed id-v2-609 (брукі́вка, noun-concept-0818).',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-1807',
    candidateConceptId: 'noun-concept-0772',
    candidateUk: 'бордю́р тротуа́рний',
    candidateEn: 'curbstone',
    comparedVocabularyId: 'id-v2-611',
    comparedConceptId: 'noun-concept-0847',
    comparedUk: 'бордю́р',
    comparedEn: 'curbstone',
    relationshipType: 'MODIFIER_PADDED_DUPLICATE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch6Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'бордю́р',
    reasonEn:
      'Within-batch modifier-padded duplicate of Batch 6 kept id-v2-611 (бордю́р, noun-concept-0847).',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-1367',
    candidateConceptId: 'noun-concept-0759',
    candidateUk: 'драби́нка бібліоте́чна',
    candidateEn: 'rolling library ladder',
    comparedVocabularyId: 'id-v2-374',
    comparedConceptId: 'noun-concept-0384',
    comparedUk: 'драби́на',
    comparedEn: 'stepladder',
    relationshipType: 'MORE_SPECIFIC_SUBTYPE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch6Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'драби́на',
    reasonEn:
      'Specific library subtype of Batch 6 kept id-v2-374 (драби́на, noun-concept-0384).',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-1370',
    candidateConceptId: 'noun-concept-0762',
    candidateUk: 'ваги́ пошто́ві',
    candidateEn: 'postal scale',
    comparedVocabularyId: 'id-v2-319',
    comparedConceptId: 'noun-concept-0158',
    comparedUk: 'підло́гові ваги́',
    comparedEn: 'bathroom scale',
    relationshipType: 'MORE_SPECIFIC_SUBTYPE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch6Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'ваги́',
    reasonEn:
      'Specialized postal scale subtype redundant alongside Batch 3 accepted id-v2-319 (підло́гові ваги́ / ваги́).',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-789',
    candidateConceptId: 'noun-concept-1164',
    candidateUk: 'лаборато́рний хала́т',
    candidateEn: 'lab coat',
    comparedVocabularyId: 'id-v2-295',
    comparedConceptId: 'noun-concept-0097',
    comparedUk: 'хала́т',
    comparedEn: 'bathrobe / coat',
    relationshipType: 'MORE_SPECIFIC_SUBTYPE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch6Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'хала́т',
    reasonEn:
      'Specialized laboratory subtype of Batch 3 accepted id-v2-295 (хала́т, noun-concept-0097).',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-1058',
    candidateConceptId: 'noun-concept-1864',
    candidateUk: 'футбо́льний м’яч',
    candidateEn: 'soccer ball',
    comparedVocabularyId: 'pg-ball',
    comparedConceptId: 'noun-concept-1677',
    comparedUk: 'м’яч',
    comparedEn: 'ball',
    relationshipType: 'MORE_SPECIFIC_SUBTYPE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch6Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'м’яч',
    reasonEn:
      'Sport-specific subtype of Batch 1 accepted pg-ball (м’яч, noun-concept-1677).',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-1059',
    candidateConceptId: 'noun-concept-1684',
    candidateUk: 'баскетбо́льний м’яч',
    candidateEn: 'basketball',
    comparedVocabularyId: 'pg-ball',
    comparedConceptId: 'noun-concept-1677',
    comparedUk: 'м’яч',
    comparedEn: 'ball',
    relationshipType: 'MORE_SPECIFIC_SUBTYPE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch6Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'м’яч',
    reasonEn:
      'Sport-specific subtype of Batch 1 accepted pg-ball (м’яч, noun-concept-1677).',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-1060',
    candidateConceptId: 'noun-concept-1706',
    candidateUk: 'волейбо́льний м’яч',
    candidateEn: 'volleyball',
    comparedVocabularyId: 'pg-ball',
    comparedConceptId: 'noun-concept-1677',
    comparedUk: 'м’яч',
    comparedEn: 'ball',
    relationshipType: 'MORE_SPECIFIC_SUBTYPE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch6Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'м’яч',
    reasonEn:
      'Sport-specific subtype of Batch 1 accepted pg-ball (м’яч, noun-concept-1677).',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-1062',
    candidateConceptId: 'noun-concept-1747',
    candidateUk: 'те́нісний м’яч',
    candidateEn: 'tennis ball',
    comparedVocabularyId: 'pg-ball',
    comparedConceptId: 'noun-concept-1677',
    comparedUk: 'м’яч',
    comparedEn: 'ball',
    relationshipType: 'MORE_SPECIFIC_SUBTYPE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch6Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'м’яч',
    reasonEn:
      'Sport-specific subtype of Batch 1 accepted pg-ball (м’яч, noun-concept-1677).',
  },

  // === CANONICAL HEADWORD NORMALIZATION ON ACCEPTED BATCH 6 CONCEPTS ===
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-520',
    candidateConceptId: 'noun-concept-0578',
    candidateUk: 'рі́с',
    candidateEn: 'rice',
    comparedVocabularyId: 'id-v2-520',
    comparedConceptId: 'noun-concept-0578',
    comparedUk: 'рис',
    comparedEn: 'rice',
    relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
    countsAsDuplicateConcept: false,
    curationActionOnBatch6Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'рис',
    reasonEn:
      'Accepted in Batch 6 as the canonical rice concept (FREQ_6000_DB #223), with orthographic typo рі́с normalized to standard Ukrainian рис.',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-1103',
    candidateConceptId: 'noun-concept-1878',
    candidateUk: 'пульт дистанці́йного керува́ння',
    candidateEn: 'remote control',
    comparedVocabularyId: 'id-v2-1103',
    comparedConceptId: 'noun-concept-1878',
    comparedUk: 'пульт',
    comparedEn: 'remote control',
    relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
    countsAsDuplicateConcept: false,
    curationActionOnBatch6Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'пульт',
    reasonEn:
      'Accepted in Batch 6 as the canonical remote-control concept, normalized to natural single-word headword пульт.',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-1102',
    candidateConceptId: 'noun-concept-1981',
    candidateUk: 'ка́бель USB',
    candidateEn: 'USB cable',
    comparedVocabularyId: 'id-v2-1102',
    comparedConceptId: 'noun-concept-1981',
    comparedUk: 'ка́бель',
    comparedEn: 'cable / charging cord',
    relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
    countsAsDuplicateConcept: false,
    curationActionOnBatch6Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'ка́бель',
    reasonEn:
      'Accepted in Batch 6 as the canonical cable concept, normalized to natural single-word headword ка́бель.',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-1119',
    candidateConceptId: 'noun-concept-1963',
    candidateUk: 'гіта́ра акусти́чна',
    candidateEn: 'acoustic guitar',
    comparedVocabularyId: 'id-v2-1119',
    comparedConceptId: 'noun-concept-1963',
    comparedUk: 'гіта́ра',
    comparedEn: 'guitar',
    relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
    countsAsDuplicateConcept: false,
    curationActionOnBatch6Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'гіта́ра',
    reasonEn:
      'Accepted in Batch 6 as the canonical guitar concept (FREQ_6000_DB #1331), normalized to natural headword гіта́ра.',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-955',
    candidateConceptId: 'noun-concept-1437',
    candidateUk: 'чо́вен веслови́й',
    candidateEn: 'rowboat',
    comparedVocabularyId: 'id-v2-955',
    comparedConceptId: 'noun-concept-1437',
    comparedUk: 'чо́вен',
    comparedEn: 'boat',
    relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
    countsAsDuplicateConcept: false,
    curationActionOnBatch6Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'чо́вен',
    reasonEn:
      'Accepted in Batch 6 as the canonical boat concept (FREQ_6000_DB #866), normalized to natural headword чо́вен.',
  },

  // === PART VERSUS WHOLE, RELATED DISTINCT OBJECTS, DIFFERENT LEXICAL SENSES & UNRELATED SPELLINGS ===
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-884',
    candidateConceptId: 'noun-concept-1513',
    candidateUk: 'кора́ де́рева',
    candidateEn: 'tree bark',
    comparedVocabularyId: 'id-v2-881',
    comparedConceptId: 'noun-concept-1451',
    comparedUk: 'стовбу́р',
    comparedEn: 'tree trunk',
    relationshipType: 'PART_VERSUS_WHOLE',
    countsAsDuplicateConcept: false,
    curationActionOnBatch6Candidate: 'review',
    preferredCanonicalHeadwordUk: 'кора́',
    reasonEn:
      'Tree bark (кора́) is the outer surface of tree trunk (стовбу́р, id-v2-881); held for review as a part-versus-whole relationship.',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-492',
    candidateConceptId: 'noun-concept-0720',
    candidateUk: 'яйце́',
    candidateEn: 'egg',
    comparedVocabularyId: 'id-v2-578',
    comparedConceptId: 'noun-concept-0656',
    comparedUk: 'яє́шня',
    comparedEn: 'fried eggs',
    relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
    countsAsDuplicateConcept: false,
    curationActionOnBatch6Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'яйце́',
    reasonEn:
      'Whole shell egg (яйце́) and cooked pan dish fried eggs (яє́шня) are related but distinct culinary objects; both are kept.',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-647',
    candidateConceptId: 'noun-concept-0895',
    candidateUk: 'купю́ра',
    candidateEn: 'banknote',
    comparedVocabularyId: 'id-v2-648',
    comparedConceptId: 'noun-concept-0906',
    comparedUk: 'моне́та',
    comparedEn: 'coin',
    relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
    countsAsDuplicateConcept: false,
    curationActionOnBatch6Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'купю́ра',
    reasonEn:
      'Paper banknote (купю́ра) and metal coin (моне́та) are complementary, visually distinct everyday money objects; both are kept.',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-1052',
    candidateConceptId: 'noun-concept-1746',
    candidateUk: 'боксерська гру́ша',
    candidateEn: 'punching bag',
    comparedVocabularyId: 'fm-pear',
    comparedConceptId: 'noun-concept-0608',
    comparedUk: 'гру́ша',
    comparedEn: 'pear',
    relationshipType: 'DIFFERENT_LEXICAL_SENSE',
    countsAsDuplicateConcept: false,
    curationActionOnBatch6Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'боксерська гру́ша',
    reasonEn:
      'Gym punching bag (боксерська гру́ша) and pear fruit (гру́ша, fm-pear) represent different lexical senses; both are kept.',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-1552',
    candidateConceptId: 'noun-concept-1463',
    candidateUk: 'дзвіно́чок (квітка)',
    candidateEn: 'bellflower / harebell',
    comparedVocabularyId: 'id-v2-1420',
    comparedConceptId: 'noun-concept-0973',
    comparedUk: 'велодзвіно́к',
    comparedEn: 'bicycle bell',
    relationshipType: 'DIFFERENT_LEXICAL_SENSE',
    countsAsDuplicateConcept: false,
    curationActionOnBatch6Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'дзвіно́чок',
    reasonEn:
      'Wildflower bellflower (дзвіно́чок) and mechanical bicycle bell (велодзвіно́к) are distinct lexical senses in nature vs transport.',
  },
  {
    batchNumber: 6,
    candidateVocabularyId: 'id-v2-599',
    candidateConceptId: 'noun-concept-0870',
    candidateUk: 'хмарочо́с',
    candidateEn: 'skyscraper',
    comparedVocabularyId: 'id-v2-934',
    comparedConceptId: 'noun-concept-1475',
    comparedUk: 'хма́ра',
    comparedEn: 'cloud',
    relationshipType: 'UNRELATED_SIMILAR_SPELLING',
    countsAsDuplicateConcept: false,
    curationActionOnBatch6Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'хмарочо́с',
    reasonEn:
      'Tall building skyscraper (хмарочо́с) shares the morphological root хмар- with cloud (хма́ра, id-v2-934) but denotes an urban building.',
  },
];

// ----------------------------------------------------------------------------
// 3. Missing-Concept Visual Suitability & Canonical Headword Status Report
//    Preserves all 34 genuinely missing concepts from Batch 4 without
//    modifying IDENTIFY_MASTER_2000_NOUNS or inflating Batch 6 counts.
// ----------------------------------------------------------------------------

export type IdentifyMissingConceptReconciliationCategory =
  | 'A_GENUINELY_MISSING_EVERYDAY_CONCEPT'
  | 'B_EXISTING_CONCEPT_WITH_LESS_NATURAL_HEADWORD'
  | 'C_SYNONYM_OF_EXISTING_CONCEPT'
  | 'D_VISUALLY_AMBIGUOUS_BETTER_TAUGHT_ELSEWHERE';

export interface IdentifyMissingConceptVisualSuitabilityAssessment {
  uk: string;
  en: string;
  domain: IdentifyCoverageDomainId;
  reconciliationCategory: IdentifyMissingConceptReconciliationCategory;
  imageHotspotSuitability:
    | 'high_direct_object_or_region'
    | 'requires_contextual_framing_or_container'
    | 'visually_ambiguous_role_or_institution';
  visualTeachingNotesEn: string;
}

export const IDENTIFY_BATCH_6_MISSING_CONCEPT_VISUAL_SUITABILITY_RECORDS: readonly IdentifyMissingConceptVisualSuitabilityAssessment[] = [
  {
    uk: 'вода́',
    en: 'water',
    domain: 'food_and_drinks',
    reconciliationCategory: 'A_GENUINELY_MISSING_EVERYDAY_CONCEPT',
    imageHotspotSuitability: 'requires_contextual_framing_or_container',
    visualTeachingNotesEn:
      'Essential A0 noun; best targeted as a clear glass/pitcher of water on a dining table (with non-overlapping pin from скля́нка).',
  },
  {
    uk: 'чай',
    en: 'tea',
    domain: 'food_and_drinks',
    reconciliationCategory: 'A_GENUINELY_MISSING_EVERYDAY_CONCEPT',
    imageHotspotSuitability: 'requires_contextual_framing_or_container',
    visualTeachingNotesEn:
      'Essential A0 beverage noun; clearly identifiable when depicted as amber tea with a lemon slice or tea bag tag in a transparent mug/teapot.',
  },
  {
    uk: 'м’я́со',
    en: 'meat',
    domain: 'food_and_drinks',
    reconciliationCategory: 'A_GENUINELY_MISSING_EVERYDAY_CONCEPT',
    imageHotspotSuitability: 'high_direct_object_or_region',
    visualTeachingNotesEn:
      'Essential A1 food noun; much more teachable as a single canonical butcher/market counter hotspot than separate raw cuts (свини́на, ялови́чина, теля́тина).',
  },
  {
    uk: 'суп',
    en: 'soup',
    domain: 'food_and_drinks',
    reconciliationCategory: 'A_GENUINELY_MISSING_EVERYDAY_CONCEPT',
    imageHotspotSuitability: 'high_direct_object_or_region',
    visualTeachingNotesEn:
      'Essential A0 dish noun; clearly recognizable as broth with vegetables in a soup bowl alongside борщ (id-v2-568).',
  },
  {
    uk: 'живі́т',
    en: 'stomach / belly',
    domain: 'body_parts',
    reconciliationCategory: 'A_GENUINELY_MISSING_EVERYDAY_CONCEPT',
    imageHotspotSuitability: 'high_direct_object_or_region',
    visualTeachingNotesEn:
      'Essential A2 body/medical region; unambiguous in a human body anatomy/health illustration.',
  },
  {
    uk: 'лі́коть',
    en: 'elbow',
    domain: 'body_parts',
    reconciliationCategory: 'A_GENUINELY_MISSING_EVERYDAY_CONCEPT',
    imageHotspotSuitability: 'high_direct_object_or_region',
    visualTeachingNotesEn:
      'Core arm joint; clearly targetable on a bent arm in a human body portrait illustration.',
  },
  {
    uk: 'ма́ма',
    en: 'mother / mom',
    domain: 'family_and_people',
    reconciliationCategory: 'A_GENUINELY_MISSING_EVERYDAY_CONCEPT',
    imageHotspotSuitability: 'requires_contextual_framing_or_container',
    visualTeachingNotesEn:
      'Foundational A0 family noun; requires a multi-generation family portrait scene (mother, father, child, grandparents) to distinguish from general жі́нка (woman).',
  },
  {
    uk: 'ба́тько / та́то',
    en: 'father / dad',
    domain: 'family_and_people',
    reconciliationCategory: 'A_GENUINELY_MISSING_EVERYDAY_CONCEPT',
    imageHotspotSuitability: 'requires_contextual_framing_or_container',
    visualTeachingNotesEn:
      'Foundational A0 family noun; requires a family scene with children to distinguish from general чолові́к (man).',
  },
  {
    uk: 'стіна́',
    en: 'wall',
    domain: 'home_and_furniture',
    reconciliationCategory: 'A_GENUINELY_MISSING_EVERYDAY_CONCEPT',
    imageHotspotSuitability: 'high_direct_object_or_region',
    visualTeachingNotesEn:
      'Essential A1 architectural surface; unambiguous when pinned on an open wall section away from framed paintings or shelves.',
  },
  {
    uk: 'підло́га',
    en: 'floor',
    domain: 'home_and_furniture',
    reconciliationCategory: 'A_GENUINELY_MISSING_EVERYDAY_CONCEPT',
    imageHotspotSuitability: 'high_direct_object_or_region',
    visualTeachingNotesEn:
      'Essential A1 architectural surface; clearly targetable on exposed parquet/tile flooring away from bd-rug (ки́лим).',
  },
  {
    uk: 'сте́ля',
    en: 'ceiling',
    domain: 'home_and_furniture',
    reconciliationCategory: 'A_GENUINELY_MISSING_EVERYDAY_CONCEPT',
    imageHotspotSuitability: 'high_direct_object_or_region',
    visualTeachingNotesEn:
      'Essential A1 room boundary; clearly targetable at the top plane of an interior room away from лю́стра (chandelier).',
  },
  {
    uk: 'магази́н',
    en: 'store / shop',
    domain: 'shopping',
    reconciliationCategory: 'A_GENUINELY_MISSING_EVERYDAY_CONCEPT',
    imageHotspotSuitability: 'requires_contextual_framing_or_container',
    visualTeachingNotesEn:
      'Essential A1 place noun; best targeted as a street-level shopfront exterior in an urban street scene.',
  },
  {
    uk: 'ву́лиця',
    en: 'street',
    domain: 'city_infrastructure',
    reconciliationCategory: 'A_GENUINELY_MISSING_EVERYDAY_CONCEPT',
    imageHotspotSuitability: 'requires_contextual_framing_or_container',
    visualTeachingNotesEn:
      'Foundational A0 urban noun; requires careful distinction from доро́га (roadway) and тротуа́р (sidewalk), or serves as the scene title itself.',
  },
  {
    uk: 'ліка́рня',
    en: 'hospital',
    domain: 'health',
    reconciliationCategory: 'A_GENUINELY_MISSING_EVERYDAY_CONCEPT',
    imageHotspotSuitability: 'requires_contextual_framing_or_container',
    visualTeachingNotesEn:
      'Essential A1 building noun; identifiable in an exterior medical-center scene with red cross signage and ambulance bay.',
  },
  {
    uk: 'дощ',
    en: 'rain',
    domain: 'everyday_nature',
    reconciliationCategory: 'A_GENUINELY_MISSING_EVERYDAY_CONCEPT',
    imageHotspotSuitability: 'high_direct_object_or_region',
    visualTeachingNotesEn:
      'Essential A1 weather noun; clearly visible as falling rain streaks above an umbrella and wet street puddles.',
  },
  {
    uk: 'сніг',
    en: 'snow',
    domain: 'everyday_nature',
    reconciliationCategory: 'A_GENUINELY_MISSING_EVERYDAY_CONCEPT',
    imageHotspotSuitability: 'high_direct_object_or_region',
    visualTeachingNotesEn:
      'Essential A1 weather noun; clearly visible as snowdrifts in a winter park scene alongside снігови́к (snowman) and са́ни (sled).',
  },
  {
    uk: 'інжене́р / програмі́ст',
    en: 'engineer / software developer',
    domain: 'work',
    reconciliationCategory: 'D_VISUALLY_AMBIGUOUS_BETTER_TAUGHT_ELSEWHERE',
    imageHotspotSuitability: 'visually_ambiguous_role_or_institution',
    visualTeachingNotesEn:
      'High conversational value, but in a static office image a person at a laptop is visually indistinguishable from an office worker or student without heavy role props.',
  },
];

export interface IdentifyCanonicalHeadwordNormalizationStatus {
  preferredHeadwordUk: string;
  englishMeaning: string;
  legacyVocabularyId: string;
  legacyUkInMasterRegistry: string;
  statusAfterBatch6: 'accepted_and_normalized_in_batch_6' | 'accepted_and_normalized_in_batches_4_or_5' | 'pending_in_batch_7';
  notesEn: string;
}

export const IDENTIFY_BATCH_6_HEADWORD_NORMALIZATION_TRACKER: readonly IdentifyCanonicalHeadwordNormalizationStatus[] = [
  {
    preferredHeadwordUk: 'рис',
    englishMeaning: 'rice',
    legacyVocabularyId: 'id-v2-520',
    legacyUkInMasterRegistry: 'рі́с',
    statusAfterBatch6: 'accepted_and_normalized_in_batch_6',
    notesEn:
      'Reviewed and marked KEEP in Batch 6; orthographic typo рі́с is normalized to standard Ukrainian рис.',
  },
  {
    preferredHeadwordUk: 'пульт',
    englishMeaning: 'remote control',
    legacyVocabularyId: 'id-v2-1103',
    legacyUkInMasterRegistry: 'пульт дистанці́йного керува́ння',
    statusAfterBatch6: 'accepted_and_normalized_in_batch_6',
    notesEn:
      'Reviewed and marked KEEP in Batch 6; bureaucratic three-word phrase normalized to natural everyday headword пульт.',
  },
  {
    preferredHeadwordUk: 'ка́бель',
    englishMeaning: 'cable / charging cord',
    legacyVocabularyId: 'id-v2-1102',
    legacyUkInMasterRegistry: 'ка́бель USB',
    statusAfterBatch6: 'accepted_and_normalized_in_batch_6',
    notesEn:
      'Reviewed and marked KEEP in Batch 6; subtype modifier stripped so ка́бель serves as the canonical cable headword.',
  },
  {
    preferredHeadwordUk: 'ма́сло',
    englishMeaning: 'butter',
    legacyVocabularyId: 'id-v2-487',
    legacyUkInMasterRegistry: 'вершко́ве ма́сло',
    statusAfterBatch6: 'pending_in_batch_7',
    notesEn:
      'Scheduled for review in Batch 7 (id-v2-487); will normalize primary conversational headword to ма́сло (with вершко́ве ма́сло retained as disambiguating gloss).',
  },
  {
    preferredHeadwordUk: 'чек',
    englishMeaning: 'receipt',
    legacyVocabularyId: 'id-v2-646',
    legacyUkInMasterRegistry: 'чек ка́совий',
    statusAfterBatch6: 'pending_in_batch_7',
    notesEn:
      'Scheduled for review in Batch 7 (id-v2-646); will normalize modifier-padded чек ка́совий to concise headword чек.',
  },
];

export interface IdentifyBatch6CoverageGapAndHeadwordSummary {
  reportVersion: '6.0.0-batch6';
  preservedGapAuditRecordsCount: 54;
  preservedGenuineMissingConceptsCount: 34;
  preservedReclassifiedNonMissingCount: 20;
  headwordNormalizationsCompletedInBatch6Count: number;
  headwordNormalizationsPendingInBatch7Count: number;
  headwordNormalizationTracker: readonly IdentifyCanonicalHeadwordNormalizationStatus[];
  missingConceptVisualSuitabilityAssessments: readonly IdentifyMissingConceptVisualSuitabilityAssessment[];
  preservedGapAuditRecords: readonly IdentifyLexicalGapAuditRecord[];
}

export function getBatch6CoverageGapAndHeadwordReport(): IdentifyBatch6CoverageGapAndHeadwordSummary {
  const completedInBatch6 = IDENTIFY_BATCH_6_HEADWORD_NORMALIZATION_TRACKER.filter(
    (item) => item.statusAfterBatch6 === 'accepted_and_normalized_in_batch_6'
  ).length;
  const pendingInBatch7 = IDENTIFY_BATCH_6_HEADWORD_NORMALIZATION_TRACKER.filter(
    (item) => item.statusAfterBatch6 === 'pending_in_batch_7'
  ).length;

  return {
    reportVersion: '6.0.0-batch6',
    preservedGapAuditRecordsCount: 54,
    preservedGenuineMissingConceptsCount: 34,
    preservedReclassifiedNonMissingCount: 20,
    headwordNormalizationsCompletedInBatch6Count: completedInBatch6,
    headwordNormalizationsPendingInBatch7Count: pendingInBatch7,
    headwordNormalizationTracker: IDENTIFY_BATCH_6_HEADWORD_NORMALIZATION_TRACKER,
    missingConceptVisualSuitabilityAssessments:
      IDENTIFY_BATCH_6_MISSING_CONCEPT_VISUAL_SUITABILITY_RECORDS,
    preservedGapAuditRecords: IDENTIFY_BATCH_4_LEXICAL_GAP_AUDIT_RECORDS,
  };
}
