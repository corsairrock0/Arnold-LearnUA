// ============================================================================
// LANGO IDENTIFY — PHASE 1, BATCH 7:
// CURATION OF NEXT 200 EVERYDAY UKRAINIAN NOUNS (CANDIDATES 1201..1400),
// PROGRAMMATIC REFERENTIAL INTEGRITY PROTECTION, HEADWORD NORMALIZATION,
// INDEPENDENT PEDAGOGICAL PRIORITY TIERING & PRIOR-BATCH PRIORITY FLAGS
// ============================================================================
// IMPORTANT SAFETY BOUNDARY:
// - This module is development-only curriculum curation infrastructure.
// - It does NOT modify active learner-facing scenes (10 verified scenes,
//   49 approved active targets, 2,471 unverified associations excluded),
//   nor does it mutate IDENTIFY_MASTER_2000_NOUNS or Batches 1–6.
// - All canonical/comparison concept IDs and headwords are derived
//   programmatically from IDENTIFY_MASTER_2000_NOUNS via resolveMasterNounById
//   to guarantee 100% referential integrity.
// ============================================================================

import {
  IDENTIFY_MASTER_2000_NOUNS,
  type IdentifyMasterNounEntry,
} from './identifyMasterNouns.ts';
import type {
  IdentifyCurationRecommendation,
  IdentifyCurriculumPriorityLevel,
} from './identifyCurriculumCurationPhase1.ts';
import type {
  IdentifyCoverageDomainId,
  IdentifyVisualSceneFraming,
} from './identifyCurriculumCurationPhase1Batch2.ts';
import {
  IDENTIFY_BATCH_4_LEXICAL_GAP_AUDIT_RECORDS,
  getBatch4CorrectedVocabularyGapReport,
  type ExplicitBatch4Assessment,
} from './identifyCurriculumCurationPhase1Batch4.ts';

export type ExplicitBatch7Assessment = ExplicitBatch4Assessment;

const MASTER_NOUN_BY_VOCABULARY_ID = new Map<string, IdentifyMasterNounEntry>(
  IDENTIFY_MASTER_2000_NOUNS.map((entry) => [entry.vocabularyId, entry])
);

/**
 * Resolves an authoritative master noun entry by `vocabularyId` directly from
 * `IDENTIFY_MASTER_2000_NOUNS`. Throws immediately if the ID does not exist,
 * preventing hand-typed ID/headword/conceptId drift.
 */
export function resolveMasterNounById(
  vocabularyId: string
): IdentifyMasterNounEntry {
  const entry = MASTER_NOUN_BY_VOCABULARY_ID.get(vocabularyId);
  if (!entry) {
    throw new Error(
      `[Batch 7 Referential Integrity] Unknown master vocabularyId: ${vocabularyId}`
    );
  }
  return entry;
}

/**
 * Resolves the authoritative `conceptId` for a given `vocabularyId` from
 * `IDENTIFY_MASTER_2000_NOUNS`.
 */
export function resolveMasterConceptId(vocabularyId: string): string {
  return resolveMasterNounById(vocabularyId).conceptId;
}

// ----------------------------------------------------------------------------
// 1. Explicit Batch 7 Assessments (144 Explicit Records:
//    34 essential_everyday KEEP + 14 useful_extended KEEP + 36 REVIEW + 60 EXCLUDE;
//    plus 56 common_situational KEEP records handled in buildBatch7Reviews = 200)
// ----------------------------------------------------------------------------

export const EXPLICIT_BATCH_7_ASSESSMENTS: Record<
  string,
  ExplicitBatch7Assessment
> = {
  // === A. 34 ESSENTIAL_EVERYDAY KEEP CANDIDATES (INDEPENDENT PEDAGOGICAL JUDGMENT) ===
  'id-v2-525': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'dining-room', 'supermarket', 'restaurant'],
    recommendation: 'keep',
    rationaleEn:
      'макаро́ни (pasta / macaroni) is an indispensable daily household and grocery staple in Ukrainian kitchens and supermarkets.',
  },
  'id-v2-1712': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living-room', 'office', 'supermarket', 'bedroom'],
    recommendation: 'keep',
    rationaleEn:
      'акумуля́торна батаре́йка (AA battery) represents the core everyday battery concept; keep and normalize preferred learner headword to батаре́йка.',
  },
  'id-v2-532': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'dining-room', 'supermarket', 'cafe'],
    recommendation: 'keep',
    rationaleEn:
      'ке́тчуп (ketchup) is a universal everyday table condiment in Ukrainian homes, cafés, and supermarkets.',
  },
  'id-v2-1077': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['gym-fitness', 'hotel', 'park-garden'],
    recommendation: 'keep',
    rationaleEn:
      'басе́йн пла́вальний (swimming pool, FREQ_6000_DB #1291 басе́йн) is a core everyday sport, hotel, and recreation venue; normalize preferred learner headword to басе́йн.',
  },
  'id-v2-709': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'public-transportation'],
    recommendation: 'keep',
    rationaleEn:
      'мотоци́кл (motorcycle, FREQ_6000_DB #1836, A2.2) is a primary everyday street vehicle with an unmistakable visual silhouette.',
  },
  'id-v2-548': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'dining-room', 'supermarket'],
    recommendation: 'keep',
    rationaleEn:
      'соси́ска (frankfurter / sausage link) is a high-frequency everyday Ukrainian breakfast and grocery item distinct from sliced ковбаса́ (id-v2-547).',
  },
  'id-v2-792': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['portrait-family', 'classroom', 'park-garden'],
    recommendation: 'keep',
    rationaleEn:
      'хло́пчик (boy, FREQ_6000_DB #771, A1.1) is a foundational A1 person and family noun required across home, school, and park scenes.',
  },
  'id-v2-793': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['portrait-family', 'classroom', 'park-garden'],
    recommendation: 'keep',
    rationaleEn:
      'ді́вчинка (girl, FREQ_6000_DB #772, A1.1) is a foundational A1 person and family noun paired with хло́пчик (id-v2-792).',
  },
  'id-v2-794': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['portrait-family', 'bedroom', 'hospital-pharmacy'],
    recommendation: 'keep',
    rationaleEn:
      'немовля́ (baby / infant) is an essential everyday life-stage and family noun alongside хло́пчик and ді́вчинка.',
  },
  'id-v2-805': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['supermarket', 'cafe', 'clothing-store'],
    recommendation: 'keep',
    rationaleEn:
      'каси́р (cashier) is an essential everyday service role encountered in every supermarket, shop, and ticket counter scene.',
  },
  'id-v2-807': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['city-streets', 'public-transportation', 'airport-station'],
    recommendation: 'keep',
    rationaleEn:
      'поліце́йський (police officer, FREQ_6000_DB #1851) is a core civic profession easily recognized in street and station scenes.',
  },
  'id-v2-573': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'dining-room', 'cafe', 'restaurant'],
    recommendation: 'keep',
    rationaleEn:
      'си́рники (cottage cheese pancakes) are one of the most iconic everyday Ukrainian breakfast and café dishes.',
  },
  'id-v2-579': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'dining-room', 'cafe'],
    recommendation: 'keep',
    rationaleEn:
      'бутербро́д (sandwich / open-faced sandwich, A1.1) is the standard everyday Ukrainian word for a breakfast or snack sandwich.',
  },
  'id-v2-581': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['restaurant', 'cafe', 'dining-room', 'kitchen'],
    recommendation: 'keep',
    rationaleEn:
      'пі́ца (pizza, A1.1) is an essential everyday dining and café food noun with immediate visual clarity.',
  },
  'id-v2-445': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market', 'supermarket', 'kitchen'],
    recommendation: 'keep',
    rationaleEn:
      'капу́ста білокача́нна (cabbage head) is a foundational Ukrainian borscht and market vegetable; keep and normalize preferred learner headword to капу́ста.',
  },
  'id-v2-448': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market', 'supermarket', 'kitchen'],
    recommendation: 'keep',
    rationaleEn:
      'соло́дкий пе́рець (bell pepper) is a core everyday market and kitchen vegetable; keep with preferred learner headword соло́дкий пе́рець / пе́рець.',
  },
  'id-v2-458': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market', 'supermarket', 'kitchen'],
    recommendation: 'keep',
    rationaleEn:
      'сала́т листови́й (lettuce) represents the core leafy lettuce / salad greens concept; keep and normalize preferred learner headword to сала́т.',
  },
  'id-v2-487': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'dining-room', 'supermarket'],
    recommendation: 'keep',
    rationaleEn:
      'вершко́ве ма́сло (butter, FREQ_6000_DB #217 ма́сло, A0.2) is a foundational A0 dairy staple; keep and normalize preferred learner headword to ма́сло.',
  },
  'id-v2-963': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'park-garden'],
    recommendation: 'keep',
    rationaleEn:
      'коро́ва (cow, FREQ_6000_DB #1299) is a foundational farm animal noun taught in elementary Ukrainian.',
  },
  'id-v2-966': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    recommendation: 'keep',
    rationaleEn:
      'свиня́ (pig, FREQ_6000_DB #1300) is a foundational domestic farm animal noun alongside коро́ва and кінь.',
  },
  'id-v2-978': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'park-garden'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'ми́ша (тварина) (mouse animal) is a core animal noun and an explicit polysemy sense contrast with ми́ша (комп’ю́терна) (noun-mysha-mouse).',
  },
  'id-v2-527': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket', 'farmers-market'],
    recommendation: 'keep',
    rationaleEn:
      'олі́я со́няшникова (sunflower cooking oil, FREQ_6000_DB #218 олі́я, A0.2) is the canonical Ukrainian vegetable oil concept; normalize preferred learner headword to олі́я.',
  },
  'id-v2-591': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'dining-room', 'cafe'],
    recommendation: 'keep',
    rationaleEn:
      'чайник зава́рювальний (teapot) represents the canonical ча́йник / зава́рник tea-brewing pot distinct from electric appliance електроча́йник (id-v2-154).',
  },
  'id-v2-207': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['kitchen', 'bathroom', 'supermarket'],
    recommendation: 'keep',
    rationaleEn:
      'паперо́вий рушни́к (paper towel roll) is an everyday kitchen and household hygiene item distinct from cloth bath towel рушни́к (ba-towel).',
  },
  'id-v2-594': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['restaurant', 'dining-room', 'cafe', 'kitchen'],
    recommendation: 'keep',
    rationaleEn:
      'ке́лих для вина́ (wineglass / stemmed goblet) represents the core Ukrainian dining noun ке́лих; normalize preferred learner headword to ке́лих.',
  },
  'id-v2-612': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'public-transportation'],
    recommendation: 'keep',
    rationaleEn:
      'пішохі́дний перехі́д (crosswalk / zebra crossing) is an essential urban navigation and pedestrian safety landmark in every street scene.',
  },
  'id-v2-614': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'public-transportation'],
    recommendation: 'keep',
    rationaleEn:
      'доро́жній знак (road sign) is a foundational urban street and driving object alongside світлофо́р (cs-traffic-light).',
  },
  'id-v2-615': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'park-garden'],
    recommendation: 'keep',
    rationaleEn:
      'ву́личний ліхта́р (streetlamp) is a ubiquitous urban and park fixture distinct from handheld flashlight ліхта́рик (id-v2-379).',
  },
  'id-v2-643': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'clothing-store'],
    recommendation: 'keep',
    rationaleEn:
      'ко́шик покупця́ (handheld supermarket shopping basket) is a core grocery-shopping object distinct from wheeled візо́к для покупо́к (sm-cart).',
  },
  'id-v2-646': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['supermarket', 'cafe', 'restaurant', 'clothing-store'],
    recommendation: 'keep',
    rationaleEn:
      'чек ка́совий (printed cash-register receipt) is an indispensable everyday shopping and café noun; normalize preferred learner headword to чек.',
  },
  'id-v2-649': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['supermarket', 'cafe', 'restaurant', 'city-streets'],
    recommendation: 'keep',
    rationaleEn:
      'платі́жна ка́ртка (bank / payment card) is an essential everyday payment item used in shops, cafés, and ATMs.',
  },
  'id-v2-659': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'hospital-pharmacy'],
    recommendation: 'keep',
    rationaleEn:
      'каре́та швидко́ї допомо́ги / швидка́ допомо́га (ambulance) is a core emergency vehicle pairing with поліце́йська маши́на (id-v2-658) and поже́жна маши́на (id-v2-660).',
  },
  'id-v2-681': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['airport-station', 'public-transportation'],
    recommendation: 'keep',
    rationaleEn:
      'посадко́вий тало́н (boarding pass) is a core travel document distinct from general transit ticket квито́к (pt-ticket).',
  },
  'id-v2-712': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'public-transportation'],
    recommendation: 'keep',
    rationaleEn:
      'кермо́ автомобі́льне (steering wheel) represents the canonical Ukrainian noun кермо́; normalize preferred learner headword to кермо́.',
  },

  // === B. 14 USEFUL_EXTENDED KEEP CANDIDATES (VALUABLE SECONDARY VOCABULARY) ===
  'id-v2-1068': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['gym-fitness', 'park-garden'],
    recommendation: 'keep',
    rationaleEn:
      'клю́чка хоке́йна (hockey stick) is a recognizable winter-sport item best placed in useful_extended rather than essential daily vocabulary.',
  },
  'id-v2-1069': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['gym-fitness'],
    recommendation: 'keep',
    rationaleEn:
      'ша́йба хоке́йна (hockey puck) is a visually distinct winter-sport object paired with клю́чка хоке́йна (id-v2-1068) at useful_extended priority.',
  },
  'id-v2-1081': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature'],
    recommendation: 'keep',
    rationaleEn:
      'до́шка для серфінгу (surfboard) is a visually unmistakable beach recreation object suited to useful_extended.',
  },
  'id-v2-565': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['beach-nature', 'farmers-market', 'restaurant'],
    recommendation: 'keep',
    rationaleEn:
      'краб (crab) is a recognizable marine creature and seafood noun suited to useful_extended.',
  },
  'id-v2-889': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['park-garden', 'countryside'],
    recommendation: 'keep',
    rationaleEn:
      'жо́лудь (acorn) is a culturally familiar woodland and autumn park object suited to useful_extended.',
  },
  'id-v2-897': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature', 'park-garden'],
    recommendation: 'keep',
    rationaleEn:
      'па́льма (palm tree) is a visually iconic resort and botanical-garden tree suited to useful_extended.',
  },
  'id-v2-898': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'countryside', 'living-room'],
    recommendation: 'keep',
    rationaleEn:
      'па́пороть (fern) is a recognizable forest and indoor plant with culturally significant Ukrainian folklore associations.',
  },
  'id-v2-929': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature'],
    recommendation: 'keep',
    rationaleEn:
      'мая́к (lighthouse) is an iconic coastal landmark for harbour and beach scenes at useful_extended priority.',
  },
  'id-v2-940': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    recommendation: 'keep',
    rationaleEn:
      'вітря́к / млин (windmill) is a classic Ukrainian countryside and open-air museum landmark suited to useful_extended.',
  },
  'id-v2-951': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['park-garden', 'beach-nature', 'cultural-music'],
    recommendation: 'keep',
    rationaleEn:
      'біно́кль (binoculars) is a distinct optical object for nature observation and theater scenes at useful_extended priority.',
  },
  'id-v2-989': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'park-garden'],
    recommendation: 'keep',
    rationaleEn:
      'оре́л (eagle) is a well-known bird of prey suited to useful_extended nature scenes.',
  },
  'id-v2-661': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'keep',
    rationaleEn:
      'будіве́льний кран (tower construction crane) is a prominent urban skyline structure distinct from sink faucet кран (водопрові́дний) (noun-kran-faucet).',
  },
  'id-v2-954': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature', 'countryside'],
    recommendation: 'keep',
    rationaleEn:
      'ву́дка риба́льська (fishing rod) is a clear riverside recreation object pairing with риба́лка (id-v2-1492) at useful_extended priority.',
  },
  'id-v2-1409': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature'],
    recommendation: 'keep',
    rationaleEn:
      'я́кір корабе́льний (ship anchor) represents the core maritime noun я́кір with an unmistakable visual shape.',
  },

  // === C. 36 REVIEW CANDIDATES (GRANULARITY, SCENE FIT, OR HEADWORD QUESTIONS) ===
  'id-v2-524': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    recommendation: 'review',
    issueFlags: ['hypernym_ambiguous'],
    rationaleEn:
      'ма́нка (semolina groats) is a familiar Ukrainian pantry grain, but dry fine semolina powder is visually hard to distinguish from бо́рошно (flour) without packaging.',
  },
  'id-v2-665': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'review',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'риштува́ння (building scaffolding) is visible on urban renovation facades; review whether a dedicated construction scene warrants its inclusion.',
  },
  'id-v2-666': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'countryside'],
    recommendation: 'review',
    rationaleEn:
      'цегли́на (brick) is a common building-material noun; review whether individual bricks vs brick wall fit planned urban/yard scenes.',
  },
  'id-v2-1074': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden'],
    recommendation: 'review',
    rationaleEn:
      'ли́жні па́лиці (ski poles) co-occur with ли́жі (skis, id-v2-1073, Batch 5 KEEP); review whether winter scenes need separate hotspots for skis and ski poles.',
  },
  'id-v2-1078': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['gym-fitness', 'beach-nature'],
    recommendation: 'review',
    rationaleEn:
      'окуля́ри для пла́вання (swim goggles) are distinct in a pool scene, but окуля́ри (cl-glasses) and сонцезахисні́ окуля́ри (id-v2-863) are already kept; review subtype granularity.',
  },
  'id-v2-536': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen', 'cafe'],
    recommendation: 'review',
    rationaleEn:
      'кори́ця (cinnamon stick) is a common baking spice; review whether close-up spice displays are included in the 80-scene blueprint.',
  },
  'id-v2-1084': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['playground', 'beach-nature'],
    recommendation: 'review',
    rationaleEn:
      'відерце дитя́че (child’s sand bucket) is a diminutive subtype of відро́ (id-v2-243, Batch 4 KEEP); review whether playground sandbox scenes need a separate target.',
  },
  'id-v2-553': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['kitchen', 'supermarket', 'farmers-market'],
    recommendation: 'review',
    issueFlags: ['hypernym_ambiguous'],
    rationaleEn:
      'фарш (minced / ground meat) is a very common Ukrainian cooking ingredient, but requires clear butcher-tray framing to be unmistakable.',
  },
  'id-v2-560': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'restaurant'],
    recommendation: 'review',
    issueFlags: ['hypernym_ambiguous'],
    rationaleEn:
      'туне́ць (tuna) is usually encountered canned or as sliced fillet, making it visually hard to distinguish from other fish without labels.',
  },
  'id-v2-564': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'restaurant'],
    recommendation: 'review',
    rationaleEn:
      'кальма́р (squid) is visually distinct at a seafood counter; review whether seafood subtype slots are needed alongside ри́ба, креве́тка, and краб.',
  },
  'id-v2-567': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['dining-room', 'restaurant', 'supermarket'],
    recommendation: 'review',
    rationaleEn:
      'ікра́ (red salmon roe / caviar) is a culturally recognizable festive table item in Ukraine; review priority vs core everyday foods.',
  },
  'id-v2-886': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'countryside'],
    recommendation: 'review',
    rationaleEn:
      'пеньо́к (tree stump) is a clear forest object; review whether forest/park scenes need both де́рево (pk-tree) and пеньо́к.',
  },
  'id-v2-887': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'park-garden'],
    recommendation: 'review',
    rationaleEn:
      'коло́да (fallen log) is visually distinct in forest/campfire scenes; review alongside пеньо́к (id-v2-886) and гі́лка (id-v2-884).',
  },
  'id-v2-589': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['cafe', 'restaurant'],
    recommendation: 'review',
    issueFlags: ['hypernym_ambiguous'],
    rationaleEn:
      'еспре́со (espresso shot) is a daily café order word, but visually overlaps with generic ка́ва (cf-coffee) unless framed specifically as a demitasse shot.',
  },
  'id-v2-590': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['cafe', 'restaurant'],
    recommendation: 'review',
    issueFlags: ['hypernym_ambiguous'],
    rationaleEn:
      'капучи́но (cappuccino with milk foam art) is a very common café order noun, but visually overlaps with ка́ва (cf-coffee); review whether café menu board framing is used.',
  },
  'id-v2-920': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature'],
    recommendation: 'review',
    rationaleEn:
      'га́лька (beach pebbles) is common on rocky beaches; review visual distinctiveness against камі́нь (bn-stone) and пісо́к (bn-sand).',
  },
  'id-v2-442': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market', 'kitchen', 'supermarket'],
    recommendation: 'review',
    rationaleEn:
      'зелена́ цибу́ля (green onion / scallion) is visually distinct from bulb цибу́ля (id-v2-441, Batch 2 KEEP) and very common in Ukrainian cooking; review whether to keep both or consolidate.',
  },
  'id-v2-939': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    recommendation: 'review',
    rationaleEn:
      'ферма / стайня (farm / stable) combines a whole venue (ферма) with a specific building (стайня); review headword normalization before scene assignment.',
  },
  'id-v2-470': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'farmers-market'],
    recommendation: 'review',
    rationaleEn:
      'бі́лий гриб (porcini mushroom) is culturally iconic in Ukraine, though печери́ця (button mushroom, id-v2-469) is already kept in Batch 5; review whether forest mushroom vs market mushroom are both kept.',
  },
  'id-v2-478': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen', 'supermarket', 'farmers-market'],
    recommendation: 'review',
    rationaleEn:
      'насі́ння со́няшнику (sunflower seeds / насі́ння) is a culturally ubiquitous Ukrainian snack and pantry item; review whether to normalize headword to насі́ння.',
  },
  'id-v2-489': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket', 'farmers-market'],
    recommendation: 'review',
    rationaleEn:
      'кисломоло́чний сир (cottage cheese / quark, standard Ukrainian сир) is a staple Ukrainian dairy food distinct from hard yellow cheese (сир, sm-cheese); review visual framing so learners distinguish the two.',
  },
  'id-v2-534': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['restaurant', 'kitchen', 'supermarket'],
    recommendation: 'review',
    issueFlags: ['hypernym_ambiguous'],
    rationaleEn:
      'со́євий со́ус (soy sauce) is common alongside су́ші (id-v2-582), but requires a characteristic dispenser bottle next to sushi to be visually unambiguous.',
  },
  'id-v2-206': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'review',
    issueFlags: ['hypernym_ambiguous'],
    rationaleEn:
      'харчова́ плі́вка (plastic cling wrap) is a common kitchen roll item, but transparent film is visually subtle compared to фольга́ (id-v2-205, Batch 4 REVIEW).',
  },
  'id-v2-227': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['cafe', 'kitchen', 'restaurant'],
    recommendation: 'review',
    rationaleEn:
      'ба́рний стіле́ць (high barstool) is visually distinct at a café or kitchen island counter, though стіле́ць (k-chair) and табуре́т (id-v2-226) are already kept.',
  },
  'id-v2-308': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom', 'bedroom'],
    recommendation: 'review',
    rationaleEn:
      'випрямля́ч для воло́сся (hair straightener flat iron) is a recognizable bathroom styling appliance; review priority relative to фен (id-v2-307, Batch 3 KEEP).',
  },
  'id-v2-311': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'review',
    rationaleEn:
      'пі́на для голі́ння (shaving foam can) pairs with бритва (id-v2-310, Batch 3 KEEP) in bathroom scenes; review whether aerosol can is distinct enough without text.',
  },
  'id-v2-396': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['cafe', 'beach-nature', 'park-garden'],
    recommendation: 'review',
    rationaleEn:
      'садо́ва парасо́ля (large patio/beach umbrella) is prominent on café terraces and beaches, though парасо́лька (id-v2-874, Batch 2 KEEP) is already accepted.',
  },
  'id-v2-613': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'public-transportation'],
    recommendation: 'review',
    rationaleEn:
      'підзе́мний перехі́д (pedestrian underpass) is a very common Ukrainian urban feature; review whether to keep alongside пішохі́дний перехі́д (id-v2-612).',
  },
  'id-v2-618': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'review',
    rationaleEn:
      'люк каналізаці́йний (manhole cover, люк) is a common street-surface object; review whether to normalize headword to люк.',
  },
  'id-v2-619': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'review',
    rationaleEn:
      'гідра́нт поже́жний (fire hydrant) is visually distinct on city sidewalks; review cultural prevalence in Ukrainian street scenes.',
  },
  'id-v2-880': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bedroom', 'bathroom', 'clothing-store'],
    recommendation: 'review',
    rationaleEn:
      'дзеркальце кишенько́ве (compact pocket mirror) is a diminutive subtype of дзе́ркало (bd-mirror, Batch 1 KEEP); review whether handbag/vanity close-ups need it.',
  },
  'id-v2-952': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['countryside', 'park-garden'],
    recommendation: 'review',
    rationaleEn:
      'склада́ний ніж (folding pocketknife) is a camping tool subtype of ніж (k-knife, Batch 1 KEEP); review whether camping scenes need a separate entry.',
  },
  'id-v2-1695': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'classroom', 'bedroom'],
    recommendation: 'review',
    rationaleEn:
      'трекпа́д / тачпа́д (laptop touchpad) is an everyday computer part on ноутбу́к (of-laptop); review part-vs-whole hotspot granularity.',
  },
  'id-v2-1809': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'review',
    rationaleEn:
      'ву́личний пока́жчик (street name plaque on a building wall) is common in city scenes; review overlap with доро́жній знак (id-v2-614) and ви́віска (id-v2-607).',
  },
  'id-v2-1697': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'creative-studio'],
    recommendation: 'review',
    rationaleEn:
      'сти́лус (digital stylus pen) pairs with планше́т (id-v2-1089, Batch 4 KEEP) and графі́чний планше́т (id-v2-1142); review priority.',
  },
  'id-v2-1811': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['public-transportation', 'city-streets'],
    recommendation: 'review',
    rationaleEn:
      'табло́ прибуття́ тра́нспорту (digital transit arrival board) is a common bus/tram stop fixture, but табло́ інформаці́йне (id-v2-676, Batch 4 KEEP) already covers the canonical табло́ concept.',
  },

  // === D. 60 EXCLUDE CANDIDATES (29 DUPLICATES/SUBTYPES + 31 LOW-NICHE/OBSCURE) ===
  // --- D1. 29 Duplicate, Modifier-Padded, or Overly Narrow Subtype Exclusions ---
  'id-v2-684': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['airport-station'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-1848',
    canonicalConceptId: resolveMasterConceptId('id-v2-1848'),
    rationaleEn:
      'ілюміна́тор (airplane cabin window) duplicates Batch 4 accepted id-v2-1848 (ілюміна́тор літака́, airplane window).',
  },
  'id-v2-695': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['public-transportation'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-694',
    canonicalConceptId: resolveMasterConceptId('id-v2-694'),
    rationaleEn:
      'рейка (individual steel rail) is a component sub-part of Batch 5 accepted id-v2-694 (ко́лія залізни́чна, railway track).',
  },
  'id-v2-696': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['public-transportation'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-694',
    canonicalConceptId: resolveMasterConceptId('id-v2-694'),
    rationaleEn:
      'шпа́ла (railroad tie / sleeper) is a technical trackbed sub-part of Batch 5 accepted id-v2-694 (ко́лія залізни́чна).',
  },
  'id-v2-580': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['cafe', 'kitchen'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-579',
    canonicalConceptId: resolveMasterConceptId('id-v2-579'),
    rationaleEn:
      'сендвіч (loanword sandwich) is visually and pedagogically redundant with Batch 7 accepted id-v2-579 (бутербро́д, the primary Ukrainian sandwich noun).',
  },
  'id-v2-488': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'duplicate_concept'],
    duplicateOfVocabularyId: 'sm-cheese',
    canonicalConceptId: resolveMasterConceptId('sm-cheese'),
    rationaleEn:
      'сир тверди́й (hard cheese) is a modifier-padded duplicate of Batch 1 accepted sm-cheese (сир).',
  },
  'id-v2-494': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-492',
    canonicalConceptId: resolveMasterConceptId('id-v2-492'),
    rationaleEn:
      'біло́к яє́чний (raw egg white) is a visually ambiguous sub-part of Batch 6 accepted id-v2-492 (яйце́, egg).',
  },
  'id-v2-496': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'duplicate_concept'],
    duplicateOfVocabularyId: 'sm-bread',
    canonicalConceptId: resolveMasterConceptId('sm-bread'),
    rationaleEn:
      'житні́й хліб (rye bread) is a compositional bread variety redundant as a separate visual target alongside sm-bread (хліб) and id-v2-495 (бато́н).',
  },
  'id-v2-528': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'supermarket'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-527',
    canonicalConceptId: resolveMasterConceptId('id-v2-527'),
    rationaleEn:
      'оли́вкова олі́я (olive oil) is visually indistinguishable in a bottle from Batch 7 accepted id-v2-527 (олі́я со́няшникова, normalized to олі́я).',
  },
  'id-v2-535': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-193',
    canonicalConceptId: resolveMasterConceptId('id-v2-193'),
    rationaleEn:
      'чорни́й пе́рець (loose black peppercorns) is tiny and visually ambiguous in scenes where Batch 5 accepted id-v2-193 (пере́чниця, pepper shaker) and Batch 7 id-v2-448 (соло́дкий пе́рець) are used.',
  },
  'id-v2-597': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['restaurant', 'cafe'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'duplicate_concept'],
    duplicateOfVocabularyId: 'cf-menu',
    canonicalConceptId: resolveMasterConceptId('cf-menu'),
    rationaleEn:
      'меню́ ресторанне (restaurant menu) is a modifier-padded duplicate of Batch 1 accepted active learner target cf-menu (меню́).',
  },
  'id-v2-598': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['restaurant', 'cafe'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'duplicate_concept'],
    duplicateOfVocabularyId: 'rs-bill',
    canonicalConceptId: resolveMasterConceptId('rs-bill'),
    rationaleEn:
      'раху́нок ресторанний (restaurant bill) is a modifier-padded duplicate of Batch 1 accepted active learner target rs-bill (раху́нок).',
  },
  'id-v2-290': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-288',
    canonicalConceptId: resolveMasterConceptId('id-v2-288'),
    rationaleEn:
      'зливни́й бачо́к (toilet flush tank) is an integral sub-part of Batch 5 accepted id-v2-288 (уніта́з, toilet bowl) and causes overlapping bounding boxes.',
  },
  'id-v2-375': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['creative-studio'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-1139',
    canonicalConceptId: resolveMasterConceptId('id-v2-1139'),
    rationaleEn:
      'пензель маля́рний (house-painting brush) overlaps with Batch 6 accepted id-v2-1139 (пензлик худо́жній, normalized to пе́нзлик / пе́нзель).',
  },
  'id-v2-616': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'city-streets'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'duplicate_concept'],
    duplicateOfVocabularyId: 'pk-bench',
    canonicalConceptId: resolveMasterConceptId('pk-bench'),
    rationaleEn:
      'ла́вка паркова (park bench) is a modifier-padded duplicate of Batch 1 accepted active learner target pk-bench (ла́вка).',
  },
  'id-v2-617': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'park-garden'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-245',
    canonicalConceptId: resolveMasterConceptId('id-v2-245'),
    rationaleEn:
      'у́рна ву́лична (street trash bin) is a modifier-padded duplicate of Batch 3 accepted id-v2-245 (смітни́к, trash can / bin).',
  },
  'id-v2-644': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'clothing-store'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'duplicate_concept'],
    duplicateOfVocabularyId: 'sm-bag',
    canonicalConceptId: resolveMasterConceptId('sm-bag'),
    rationaleEn:
      'паке́т паперо́вий (paper shopping bag) is a modifier-padded subtype of Batch 1 accepted active learner target sm-bag (паке́т, shopping bag).',
  },
  'id-v2-652': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['airport-station', 'supermarket'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-702',
    canonicalConceptId: resolveMasterConceptId('id-v2-702'),
    rationaleEn:
      'віко́нце ка́си (teller window) is a sub-part duplicate of Batch 5 accepted id-v2-702 (квиткова́ ка́са) and Batch 1 sm-cash-register (ка́са).',
  },
  'id-v2-683': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['airport-station'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-1841',
    canonicalConceptId: resolveMasterConceptId('id-v2-1841'),
    rationaleEn:
      'ми́тний контро́ль (glossed as security scanner archway) duplicates Batch 4 accepted id-v2-1841 (рамка металошукача́, security scanner arch) and conflates an abstract procedure with physical hardware.',
  },
  'id-v2-698': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['public-transportation'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-690',
    canonicalConceptId: resolveMasterConceptId('id-v2-690'),
    rationaleEn:
      'ваго́н метро́ (subway car) is a modifier-padded subtype of Batch 4 accepted id-v2-690 (ваго́н, train/subway car) and Batch 1 pt-subway (метро́).',
  },
  'id-v2-918': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'countryside'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'duplicate_concept'],
    duplicateOfVocabularyId: 'pk-path',
    canonicalConceptId: resolveMasterConceptId('pk-path'),
    rationaleEn:
      'сте́жка лісова́ (forest trail / footpath) is a modifier-padded duplicate of Batch 1 accepted pk-path (дорі́жка / сте́жка).',
  },
  'id-v2-953': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['gym-fitness', 'park-garden'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'gm-bottle',
    canonicalConceptId: resolveMasterConceptId('gm-bottle'),
    rationaleEn:
      'фля́га для води́ (water bottle / canteen) overlaps with Batch 1 accepted gm-bottle (пля́шка для води́) and sm-bottle (пля́шка).',
  },
  'id-v2-1406': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-955',
    canonicalConceptId: resolveMasterConceptId('id-v2-955'),
    rationaleEn:
      'ка́тер моторний (motorboat) is a boat subtype redundant alongside Batch 6 accepted id-v2-955 (чо́вен веслови́й -> чо́вен), id-v2-1403 (корабе́ль), and id-v2-956 (я́хта).',
  },
  'id-v2-1810': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-1809',
    canonicalConceptId: resolveMasterConceptId('id-v2-1809'),
    rationaleEn:
      'но́мер буди́нку (house number plaque) visually overlaps on building facades with Batch 7 id-v2-1809 (ву́личний пока́жчик, street name & house number sign).',
  },
  'id-v2-1408': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-955',
    canonicalConceptId: resolveMasterConceptId('id-v2-955'),
    rationaleEn:
      'катамара́н водний (pedal boat) is a niche resort watercraft subtype redundant with canonical чо́вен (id-v2-955).',
  },
  'id-v2-1520': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['beach-nature', 'clothing-store'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-847',
    canonicalConceptId: resolveMasterConceptId('id-v2-847'),
    rationaleEn:
      'солом’я́ний капелю́х (straw hat) is a material-modified duplicate of Batch 2 accepted id-v2-847 (капелю́х, hat).',
  },
  'id-v2-1522': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['hallway-entry', 'clothing-store', 'countryside'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-836',
    canonicalConceptId: resolveMasterConceptId('id-v2-836'),
    rationaleEn:
      'гумові чо́боти (rubber rain boots) is a material-modified duplicate of Batch 2 accepted id-v2-836 (чо́боти, boots).',
  },
  'id-v2-1813': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-1357',
    canonicalConceptId: resolveMasterConceptId('id-v2-1357'),
    rationaleEn:
      'стовпчик обмежувальний (street bollard post) is a word-order duplicate of Batch 5 accepted id-v2-1357 (обмежувальний стовпчик, street bollard).',
  },
  'id-v2-1411': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-1848',
    canonicalConceptId: resolveMasterConceptId('id-v2-1848'),
    rationaleEn:
      'ілюміна́тор корабе́льний (ship porthole) duplicates the canonical ілюміна́тор concept already accepted in Batch 4 (id-v2-1848).',
  },
  'id-v2-1575': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-1884',
    canonicalConceptId: resolveMasterConceptId('id-v2-1884'),
    rationaleEn:
      'льодови́к (glacier) is an exact duplicate of Batch 6 excluded id-v2-1884 (льодови́к гірськи́й, mountain glacier).',
  },

  // --- D2. 31 Low-Niche, Specialist, or Visually Subtle Exclusions ---
  'id-v2-668': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'ке́льма (bricklayer’s masonry trowel) is a specialized trade tool outside core everyday vocabulary.',
  },
  'id-v2-1079': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['gym-fitness'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'ша́почка для пла́вання (silicone swim cap) is a narrow pool-gear item redundant alongside ша́пка (id-v2-846) and басе́йн (id-v2-1077).',
  },
  'id-v2-538': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'overly_specialized'],
    rationaleEn:
      'вані́ль (vanilla pod) is a tiny dark bean pod that is visually difficult to identify in standard kitchen or bakery scenes.',
  },
  'id-v2-566': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['restaurant'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'ома́р (lobster) is a luxury seafood item rarely encountered in everyday Ukrainian life compared to ри́ба, креве́тка, and краб.',
  },
  'id-v2-899': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'park-garden'],
    recommendation: 'exclude',
    issueFlags: ['hypernym_ambiguous'],
    rationaleEn:
      'мох (moss) is a surface texture on rocks/bark that visually blurs with трава́ (pk-grass) in point-and-click scenes.',
  },
  'id-v2-537': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'exclude',
    issueFlags: ['hypernym_ambiguous', 'overly_specialized'],
    rationaleEn:
      'лавро́вий лист (dried bay leaf) is a small dried leaf visually confusable with generic листо́к (noun-lystok-leaf).',
  },
  'id-v2-593': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['cafe'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'пітчер для молока́ (barista milk-frothing pitcher) is specialized commercial coffee-bar equipment redundant with гле́чик (id-v2-194).',
  },
  'id-v2-651': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['office'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'сейф банківський (heavy bank vault door) is restricted back-vault infrastructure not visible in everyday customer scenes.',
  },
  'id-v2-667': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'мішо́к цеме́нту (cement bag) is a trade construction-supply sack that relies on printed label text for identification.',
  },
  'id-v2-1227': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'overly_specialized'],
    rationaleEn:
      'кольра́бі (kohlrabi) is a niche brassica cultivar rarely needed in core everyday Ukrainian vocabulary.',
  },
  'id-v2-1627': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'офтальмоско́п (ophthalmoscope) is a specialist clinical eye-exam instrument.',
  },
  'id-v2-1467': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'кле́ма / затиска́ч (electrical alligator clip) is a small physics-lab hardware connector.',
  },
  'id-v2-1556': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'нарци́с (daffodil) is a secondary flower species after кві́тка, троя́нда, со́няшник, тюльпа́н, ро́машка, мак, and кульба́ба.',
  },
  'id-v2-1184': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'hypernym_ambiguous'],
    rationaleEn:
      'хлібопі́чка (countertop bread maker) is a niche appliance visually confusable with мультиварка (id-v2-162).',
  },
  'id-v2-1228': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'hypernym_ambiguous'],
    rationaleEn:
      'рі́па (turnip) is a low-frequency root vegetable in modern everyday shopping that visually resembles реди́ска or буря́к.',
  },
  'id-v2-1629': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'пульсокси́метр (fingertip pulse oximeter) is a specialized medical monitoring clip.',
  },
  'id-v2-1473': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'спирті́вка (laboratory alcohol burner lamp) is specialized chemistry-classroom glassware.',
  },
  'id-v2-1557': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'піво́нія (peony) is a botanical flower species that visually overlaps with троя́нда (rose, id-v2-905) in general garden scenes.',
  },
  'id-v2-1229': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'hypernym_ambiguous'],
    rationaleEn:
      'пастерна́к (parsnip) is a niche root vegetable easily confused visually with бі́лий ко́рінь петру́шки or морква.',
  },
  'id-v2-1630': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'небула́йзер (medical nebulizer machine) is specialized respiratory therapy equipment beyond core everyday vocabulary.',
  },
  'id-v2-1701': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['creative-studio', 'office'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'мікрофо́н-петли́чка (clip-on lavalier lapel mic) is a tiny audio production subtype redundant alongside мікрофо́н (id-v2-1097, Batch 4 KEEP).',
  },
  'id-v2-1558': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'іри́с / півники (iris flower) is a secondary botanical species beyond the core flower set.',
  },
  'id-v2-1231': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'hypernym_ambiguous'],
    rationaleEn:
      'топінамбу́р (Jerusalem artichoke) is a niche tuber visually confusable with імби́р (ginger root) or карто́пля.',
  },
  'id-v2-1647': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['hospital-pharmacy'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'ростомі́р (clinic stadiometer height rod) is a niche medical-office fixture.',
  },
  'id-v2-1702': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['creative-studio'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'поп-фі́льтр (studio microphone pop filter screen) is specialist recording-studio hardware.',
  },
  'id-v2-1410': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'штурва́л корабе́льний (ship’s helm wheel) is a historical/nautical bridge fixture outside everyday learner scenes.',
  },
  'id-v2-1564': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside', 'beach-nature'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'очерети́на (single bulrush / reed stalk) is a narrow botanical derivative of очере́т.',
  },
  'id-v2-1330': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['countryside', 'city-streets'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'громовідві́д (rooftop lightning rod) is a thin metal rooftop rod visually indistinguishable from an antenna.',
  },
  'id-v2-1650': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['dining-room', 'kitchen'],
    recommendation: 'exclude',
    issueFlags: ['unnatural_scene_filler'],
    rationaleEn:
      'зубочи́стка (wooden toothpick) is too tiny to serve as a reliable visual hotspot in dining or kitchen scenes.',
  },
  'id-v2-1704': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['creative-studio', 'office'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'аудіоінтерфе́йс (external USB audio interface box) is specialist music-production hardware.',
  },
  'id-v2-1855': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['office', 'classroom'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'overly_specialized'],
    rationaleEn:
      'кульман (кресля́рська до́шка) (mechanical drafting board table) is obsolete 20th-century engineering drafting furniture.',
  },
};

// ----------------------------------------------------------------------------
// 2. Batch 7 Semantic Relationship Validation (Programmatically Verified Against
//    IDENTIFY_MASTER_2000_NOUNS — Zero Hand-Typed ID/Headword Drift)
// ----------------------------------------------------------------------------

export type IdentifyBatch7SemanticRelationshipType =
  | 'EXACT_SAME_CONCEPT'
  | 'SYNONYM_OR_ALTERNATE_HEADWORD'
  | 'INFLECTIONAL_VARIANT'
  | 'MODIFIER_PADDED_DUPLICATE'
  | 'MORE_SPECIFIC_SUBTYPE'
  | 'PART_VERSUS_WHOLE'
  | 'RELATED_BUT_DISTINCT_OBJECT'
  | 'DIFFERENT_LEXICAL_SENSE'
  | 'UNRELATED_SIMILAR_SPELLING';

export interface IdentifyBatch7SemanticRelationshipRecord {
  batchNumber: 7;
  candidateVocabularyId: string;
  candidateConceptId: string;
  candidateUk: string;
  candidateEn: string;
  comparedVocabularyId: string;
  comparedConceptId: string;
  comparedUk: string;
  comparedEn: string;
  relationshipType: IdentifyBatch7SemanticRelationshipType;
  countsAsDuplicateConcept: boolean;
  curationActionOnBatch7Candidate: IdentifyCurationRecommendation;
  preferredCanonicalHeadwordUk: string;
  reasonEn: string;
}

interface Batch7SemanticRelationshipSeed {
  candidateVocabularyId: string;
  comparedVocabularyId: string;
  relationshipType: IdentifyBatch7SemanticRelationshipType;
  countsAsDuplicateConcept: boolean;
  curationActionOnBatch7Candidate: IdentifyCurationRecommendation;
  preferredCanonicalHeadwordUk: string;
  reasonEn: string;
}

function buildVerifiedBatch7SemanticRelationshipRecord(
  seed: Batch7SemanticRelationshipSeed
): IdentifyBatch7SemanticRelationshipRecord {
  const cand = resolveMasterNounById(seed.candidateVocabularyId);
  const comp = resolveMasterNounById(seed.comparedVocabularyId);
  return {
    batchNumber: 7,
    candidateVocabularyId: cand.vocabularyId,
    candidateConceptId: cand.conceptId,
    candidateUk: cand.uk,
    candidateEn: cand.en,
    comparedVocabularyId: comp.vocabularyId,
    comparedConceptId: comp.conceptId,
    comparedUk: comp.uk,
    comparedEn: comp.en,
    relationshipType: seed.relationshipType,
    countsAsDuplicateConcept: seed.countsAsDuplicateConcept,
    curationActionOnBatch7Candidate: seed.curationActionOnBatch7Candidate,
    preferredCanonicalHeadwordUk: seed.preferredCanonicalHeadwordUk,
    reasonEn: seed.reasonEn,
  };
}

const BATCH_7_SEMANTIC_RELATIONSHIP_SEEDS: readonly Batch7SemanticRelationshipSeed[] = [
  // === 29 EXCLUDED DUPLICATES, MODIFIER-PADDED VARIANTS, SUBTYPES & PART-WHOLE ITEMS ===
  {
    candidateVocabularyId: 'id-v2-684',
    comparedVocabularyId: 'id-v2-1848',
    relationshipType: 'EXACT_SAME_CONCEPT',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'ілюміна́тор',
    reasonEn:
      'Exact same airplane-window concept as Batch 4 accepted id-v2-1848 (ілюміна́тор літака́).',
  },
  {
    candidateVocabularyId: 'id-v2-683',
    comparedVocabularyId: 'id-v2-1841',
    relationshipType: 'EXACT_SAME_CONCEPT',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'металошука́ч',
    reasonEn:
      'Glossed as "security scanner archway", duplicating Batch 4 accepted id-v2-1841 (рамка металошукача́).',
  },
  {
    candidateVocabularyId: 'id-v2-1813',
    comparedVocabularyId: 'id-v2-1357',
    relationshipType: 'EXACT_SAME_CONCEPT',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'обмежувальний стовпчик',
    reasonEn:
      'Word-order variant of Batch 5 accepted id-v2-1357 (обмежувальний стовпчик, street bollard).',
  },
  {
    candidateVocabularyId: 'id-v2-1575',
    comparedVocabularyId: 'id-v2-1884',
    relationshipType: 'EXACT_SAME_CONCEPT',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'льодови́к',
    reasonEn:
      'Same glacier concept as Batch 6 excluded id-v2-1884 (льодови́к гірськи́й).',
  },
  {
    candidateVocabularyId: 'id-v2-580',
    comparedVocabularyId: 'id-v2-579',
    relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'бутербро́д',
    reasonEn:
      'Loanword сендвіч overlaps with the primary everyday Ukrainian sandwich noun бутербро́д (id-v2-579, Batch 7 KEEP).',
  },
  {
    candidateVocabularyId: 'id-v2-953',
    comparedVocabularyId: 'gm-bottle',
    relationshipType: 'SYNONYM_OR_ALTERNATE_HEADWORD',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'пля́шка',
    reasonEn:
      'фля́га для води́ (water bottle / canteen) overlaps with Batch 1 accepted gm-bottle (пля́шка для води́) and sm-bottle (пля́шка).',
  },
  {
    candidateVocabularyId: 'id-v2-488',
    comparedVocabularyId: 'sm-cheese',
    relationshipType: 'MODIFIER_PADDED_DUPLICATE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'сир',
    reasonEn:
      'Modifier-padded duplicate of Batch 1 accepted active learner target sm-cheese (сир).',
  },
  {
    candidateVocabularyId: 'id-v2-597',
    comparedVocabularyId: 'cf-menu',
    relationshipType: 'MODIFIER_PADDED_DUPLICATE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'меню́',
    reasonEn:
      'Modifier-padded duplicate of Batch 1 accepted active learner target cf-menu (меню́).',
  },
  {
    candidateVocabularyId: 'id-v2-598',
    comparedVocabularyId: 'rs-bill',
    relationshipType: 'MODIFIER_PADDED_DUPLICATE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'раху́нок',
    reasonEn:
      'Modifier-padded duplicate of Batch 1 accepted active learner target rs-bill (раху́нок).',
  },
  {
    candidateVocabularyId: 'id-v2-616',
    comparedVocabularyId: 'pk-bench',
    relationshipType: 'MODIFIER_PADDED_DUPLICATE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'ла́вка',
    reasonEn:
      'Modifier-padded duplicate of Batch 1 accepted active learner target pk-bench (ла́вка).',
  },
  {
    candidateVocabularyId: 'id-v2-617',
    comparedVocabularyId: 'id-v2-245',
    relationshipType: 'MODIFIER_PADDED_DUPLICATE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'смітни́к',
    reasonEn:
      'Modifier-padded duplicate of Batch 3 accepted id-v2-245 (смітни́к, trash can / bin).',
  },
  {
    candidateVocabularyId: 'id-v2-644',
    comparedVocabularyId: 'sm-bag',
    relationshipType: 'MODIFIER_PADDED_DUPLICATE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'паке́т',
    reasonEn:
      'Modifier-padded duplicate of Batch 1 accepted active learner target sm-bag (паке́т).',
  },
  {
    candidateVocabularyId: 'id-v2-698',
    comparedVocabularyId: 'id-v2-690',
    relationshipType: 'MODIFIER_PADDED_DUPLICATE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'ваго́н',
    reasonEn:
      'Modifier-padded duplicate of Batch 4 accepted id-v2-690 (ваго́н).',
  },
  {
    candidateVocabularyId: 'id-v2-918',
    comparedVocabularyId: 'pk-path',
    relationshipType: 'MODIFIER_PADDED_DUPLICATE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'сте́жка',
    reasonEn:
      'Modifier-padded duplicate of Batch 1 accepted pk-path (дорі́жка / сте́жка).',
  },
  {
    candidateVocabularyId: 'id-v2-1520',
    comparedVocabularyId: 'id-v2-847',
    relationshipType: 'MODIFIER_PADDED_DUPLICATE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'капелю́х',
    reasonEn:
      'Material-modified duplicate of Batch 2 accepted id-v2-847 (капелю́х, hat).',
  },
  {
    candidateVocabularyId: 'id-v2-1522',
    comparedVocabularyId: 'id-v2-836',
    relationshipType: 'MODIFIER_PADDED_DUPLICATE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'чо́боти',
    reasonEn:
      'Material-modified duplicate of Batch 2 accepted id-v2-836 (чо́боти, boots).',
  },
  {
    candidateVocabularyId: 'id-v2-1411',
    comparedVocabularyId: 'id-v2-1848',
    relationshipType: 'MODIFIER_PADDED_DUPLICATE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'ілюміна́тор',
    reasonEn:
      'Modifier-padded duplicate of canonical ілюміна́тор (id-v2-1848).',
  },
  {
    candidateVocabularyId: 'id-v2-496',
    comparedVocabularyId: 'sm-bread',
    relationshipType: 'MORE_SPECIFIC_SUBTYPE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'хліб',
    reasonEn:
      'Specific bread variety (rye bread) redundant as a visual hotspot alongside sm-bread (хліб) and id-v2-495 (бато́н).',
  },
  {
    candidateVocabularyId: 'id-v2-528',
    comparedVocabularyId: 'id-v2-527',
    relationshipType: 'MORE_SPECIFIC_SUBTYPE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'олі́я',
    reasonEn:
      'Olive oil bottle is visually indistinguishable without text from Batch 7 accepted id-v2-527 (олі́я со́няшникова -> олі́я).',
  },
  {
    candidateVocabularyId: 'id-v2-375',
    comparedVocabularyId: 'id-v2-1139',
    relationshipType: 'MORE_SPECIFIC_SUBTYPE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'пе́нзель / пе́нзлик',
    reasonEn:
      'House paintbrush overlaps with Batch 6 accepted id-v2-1139 (пензлик худо́жній -> пе́нзлик / пе́нзель).',
  },
  {
    candidateVocabularyId: 'id-v2-1406',
    comparedVocabularyId: 'id-v2-955',
    relationshipType: 'MORE_SPECIFIC_SUBTYPE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'чо́вен',
    reasonEn:
      'Motorboat subtype redundant alongside Batch 6 accepted id-v2-955 (чо́вен веслови́й -> чо́вен).',
  },
  {
    candidateVocabularyId: 'id-v2-1408',
    comparedVocabularyId: 'id-v2-955',
    relationshipType: 'MORE_SPECIFIC_SUBTYPE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'чо́вен',
    reasonEn:
      'Pedal-boat watercraft subtype redundant alongside canonical чо́вен (id-v2-955).',
  },
  {
    candidateVocabularyId: 'id-v2-695',
    comparedVocabularyId: 'id-v2-694',
    relationshipType: 'PART_VERSUS_WHOLE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'ко́лія',
    reasonEn:
      'Individual steel rail (рейка) is an inseparable sub-part of Batch 5 accepted id-v2-694 (ко́лія залізни́чна).',
  },
  {
    candidateVocabularyId: 'id-v2-696',
    comparedVocabularyId: 'id-v2-694',
    relationshipType: 'PART_VERSUS_WHOLE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'ко́лія',
    reasonEn:
      'Railroad sleeper tie (шпа́ла) is an inseparable sub-part of Batch 5 accepted id-v2-694 (ко́лія залізни́чна).',
  },
  {
    candidateVocabularyId: 'id-v2-494',
    comparedVocabularyId: 'id-v2-492',
    relationshipType: 'PART_VERSUS_WHOLE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'яйце́',
    reasonEn:
      'Raw egg white (біло́к яє́чний) is a sub-part of Batch 6 accepted id-v2-492 (яйце́).',
  },
  {
    candidateVocabularyId: 'id-v2-535',
    comparedVocabularyId: 'id-v2-193',
    relationshipType: 'PART_VERSUS_WHOLE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'пере́чниця',
    reasonEn:
      'Loose peppercorns (чорни́й пе́рець) are inside Batch 5 accepted id-v2-193 (пере́чниця, pepper shaker).',
  },
  {
    candidateVocabularyId: 'id-v2-290',
    comparedVocabularyId: 'id-v2-288',
    relationshipType: 'PART_VERSUS_WHOLE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'уніта́з',
    reasonEn:
      'Toilet flush tank (зливни́й бачо́к) is an attached part of Batch 5 accepted id-v2-288 (уніта́з).',
  },
  {
    candidateVocabularyId: 'id-v2-652',
    comparedVocabularyId: 'id-v2-702',
    relationshipType: 'PART_VERSUS_WHOLE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'ка́са',
    reasonEn:
      'Teller window opening (віко́нце ка́си) is a sub-part of Batch 5 accepted id-v2-702 (квиткова́ ка́са).',
  },
  {
    candidateVocabularyId: 'id-v2-1810',
    comparedVocabularyId: 'id-v2-1809',
    relationshipType: 'PART_VERSUS_WHOLE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch7Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'ву́личний пока́жчик',
    reasonEn:
      'House number plate (но́мер буди́нку) is part of the same facade signage as Batch 7 id-v2-1809 (ву́личний пока́жчик).',
  },

  // === 10 KEPT DISTINCT SENSES & RELATED-BUT-DISTINCT EVERYDAY OBJECTS ===
  {
    candidateVocabularyId: 'id-v2-978',
    comparedVocabularyId: 'noun-mysha-computer',
    relationshipType: 'DIFFERENT_LEXICAL_SENSE',
    countsAsDuplicateConcept: false,
    curationActionOnBatch7Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'ми́ша',
    reasonEn:
      'Distinct lexical sense: ми́ша (тварина) (mouse animal) vs Batch 1 accepted noun-mysha-computer (ми́ша (комп’ю́терна), computer mouse). Both are kept.',
  },
  {
    candidateVocabularyId: 'id-v2-661',
    comparedVocabularyId: 'ba-faucet',
    relationshipType: 'DIFFERENT_LEXICAL_SENSE',
    countsAsDuplicateConcept: false,
    curationActionOnBatch7Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'будіве́льний кран',
    reasonEn:
      'Distinct lexical sense: будіве́льний кран (tower construction crane) vs Batch 1 accepted ba-faucet (кран, water faucet / tap).',
  },
  {
    candidateVocabularyId: 'id-v2-615',
    comparedVocabularyId: 'id-v2-379',
    relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
    countsAsDuplicateConcept: false,
    curationActionOnBatch7Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'ліхта́р',
    reasonEn:
      'ву́личний ліхта́р (tall outdoor streetlamp post, normalized to ліхта́р) is a distinct object from Batch 3 accepted id-v2-379 (ліхта́рик, handheld flashlight).',
  },
  {
    candidateVocabularyId: 'id-v2-591',
    comparedVocabularyId: 'id-v2-154',
    relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
    countsAsDuplicateConcept: false,
    curationActionOnBatch7Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'ча́йник',
    reasonEn:
      'чайник зава́рювальний (ceramic tea-brewing pot, normalized to ча́йник / зава́рник) is distinct from electric water-boiling appliance електроча́йник (id-v2-154, Batch 3 KEEP).',
  },
  {
    candidateVocabularyId: 'id-v2-594',
    comparedVocabularyId: 'dr-glass',
    relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
    countsAsDuplicateConcept: false,
    curationActionOnBatch7Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'ке́лих',
    reasonEn:
      'ке́лих для вина́ (stemmed wineglass, normalized to ке́лих) is a distinct dining object from flat tumbler скля́нка (dr-glass, Batch 1 KEEP).',
  },
  {
    candidateVocabularyId: 'id-v2-207',
    comparedVocabularyId: 'ba-towel',
    relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
    countsAsDuplicateConcept: false,
    curationActionOnBatch7Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'паперо́вий рушни́к',
    reasonEn:
      'паперо́вий рушни́к (kitchen paper towel roll) is a distinct kitchen object from cloth bath towel рушни́к (ba-towel, Batch 1 KEEP).',
  },
  {
    candidateVocabularyId: 'id-v2-643',
    comparedVocabularyId: 'sm-cart',
    relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
    countsAsDuplicateConcept: false,
    curationActionOnBatch7Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'ко́шик',
    reasonEn:
      'ко́шик покупця́ (handheld shopping basket) is a distinct object from wheeled supermarket trolley візо́к для покупо́к (sm-cart, Batch 1 KEEP).',
  },
  {
    candidateVocabularyId: 'id-v2-548',
    comparedVocabularyId: 'id-v2-547',
    relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
    countsAsDuplicateConcept: false,
    curationActionOnBatch7Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'соси́ска',
    reasonEn:
      'соси́ска (boiled frankfurter / wiener) is a distinct everyday Ukrainian food noun from cured/sliced sausage ковбаса́ (id-v2-547, Batch 2 KEEP).',
  },
  {
    candidateVocabularyId: 'id-v2-646',
    comparedVocabularyId: 'rs-bill',
    relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
    countsAsDuplicateConcept: false,
    curationActionOnBatch7Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'чек',
    reasonEn:
      'чек ка́совий (printed cash-register receipt, normalized to чек) is a distinct everyday shopping noun from restaurant bill folder раху́нок (rs-bill, Batch 1 KEEP).',
  },
  {
    candidateVocabularyId: 'id-v2-1071',
    comparedVocabularyId: 'id-v2-1070',
    relationshipType: 'RELATED_BUT_DISTINCT_OBJECT',
    countsAsDuplicateConcept: false,
    curationActionOnBatch7Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'ро́ликові ко́взани / ро́лики',
    reasonEn:
      'ро́ликові ко́взани (wheeled inline rollerblades for summer park paths) are visually and seasonally distinct from ice skates ко́взани (id-v2-1070, Batch 5 KEEP).',
  },
];

export const IDENTIFY_BATCH_7_SEMANTIC_RELATIONSHIP_RECORDS: readonly IdentifyBatch7SemanticRelationshipRecord[] =
  BATCH_7_SEMANTIC_RELATIONSHIP_SEEDS.map(
    buildVerifiedBatch7SemanticRelationshipRecord
  );

// ----------------------------------------------------------------------------
// 3. Batch 7 Headword Normalization Records (Completing Pending Normalizations
//    id-v2-487 вершко́ве ма́сло -> ма́сло, id-v2-646 чек ка́совий -> чек, plus 8
//    Additional Batch 7 Padded Headwords)
// ----------------------------------------------------------------------------

export interface IdentifyBatch7HeadwordNormalizationRecord {
  vocabularyId: string;
  conceptId: string;
  originalMasterHeadwordUk: string;
  preferredLearnerHeadwordUk: string;
  acceptedConversationalSynonymsUk: readonly string[];
  englishGlossEn: string;
  gender: 'm' | 'f' | 'n' | 'pl';
  reviewedInBatchNumber: 7;
  curationDecision: 'keep';
  recommendedPriority: IdentifyCurriculumPriorityLevel;
  normalizationRationaleEn: string;
}

interface Batch7HeadwordNormalizationSeed {
  vocabularyId: string;
  preferredLearnerHeadwordUk: string;
  acceptedConversationalSynonymsUk: readonly string[];
  recommendedPriority: IdentifyCurriculumPriorityLevel;
  normalizationRationaleEn: string;
}

function buildVerifiedBatch7HeadwordNormalizationRecord(
  seed: Batch7HeadwordNormalizationSeed
): IdentifyBatch7HeadwordNormalizationRecord {
  const master = resolveMasterNounById(seed.vocabularyId);
  return {
    vocabularyId: master.vocabularyId,
    conceptId: master.conceptId,
    originalMasterHeadwordUk: master.uk,
    preferredLearnerHeadwordUk: seed.preferredLearnerHeadwordUk,
    acceptedConversationalSynonymsUk: seed.acceptedConversationalSynonymsUk,
    englishGlossEn: master.en,
    gender: master.gender,
    reviewedInBatchNumber: 7,
    curationDecision: 'keep',
    recommendedPriority: seed.recommendedPriority,
    normalizationRationaleEn: seed.normalizationRationaleEn,
  };
}

const BATCH_7_HEADWORD_NORMALIZATION_SEEDS: readonly Batch7HeadwordNormalizationSeed[] = [
  {
    vocabularyId: 'id-v2-487',
    preferredLearnerHeadwordUk: 'ма́сло',
    acceptedConversationalSynonymsUk: ['вершко́ве ма́сло'],
    recommendedPriority: 'essential_everyday',
    normalizationRationaleEn:
      'Completes pending Batch 6 normalization: standard everyday Ukrainian uses ма́сло (FREQ_6000_DB #217, A0.2) for butter, while вершко́ве ма́сло is preserved as an accepted full synonym.',
  },
  {
    vocabularyId: 'id-v2-646',
    preferredLearnerHeadwordUk: 'чек',
    acceptedConversationalSynonymsUk: ['ка́совий чек', 'чек ка́совий'],
    recommendedPriority: 'essential_everyday',
    normalizationRationaleEn:
      'Completes pending Batch 6 normalization: standard everyday Ukrainian uses чек for a cash-register or card-terminal receipt; removes inverted adjective padding ка́совий.',
  },
  {
    vocabularyId: 'id-v2-1712',
    preferredLearnerHeadwordUk: 'батаре́йка',
    acceptedConversationalSynonymsUk: ['акумуля́торна батаре́йка'],
    recommendedPriority: 'essential_everyday',
    normalizationRationaleEn:
      'Learners need the natural everyday noun батаре́йка (AA/AAA battery) rather than the technical phrase акумуля́торна батаре́йка; distinct from heating radiator батаре́я (опа́лення) (id-v2-274).',
  },
  {
    vocabularyId: 'id-v2-527',
    preferredLearnerHeadwordUk: 'олі́я',
    acceptedConversationalSynonymsUk: ['со́няшникова олі́я', 'олі́я со́няшникова'],
    recommendedPriority: 'essential_everyday',
    normalizationRationaleEn:
      'In Ukrainian, олі́я (FREQ_6000_DB #218, A0.2) is the standard base noun for liquid cooking/vegetable oil (contrasting with solid butter ма́сло).',
  },
  {
    vocabularyId: 'id-v2-445',
    preferredLearnerHeadwordUk: 'капу́ста',
    acceptedConversationalSynonymsUk: ['білокача́нна капу́ста', 'капу́ста білокача́нна'],
    recommendedPriority: 'essential_everyday',
    normalizationRationaleEn:
      'Replaces botanical cultivar label капу́ста білокача́нна with the natural everyday Ukrainian headword капу́ста.',
  },
  {
    vocabularyId: 'id-v2-448',
    preferredLearnerHeadwordUk: 'соло́дкий пе́рець / пе́рець',
    acceptedConversationalSynonymsUk: ['болга́рський пе́рець', 'пе́рець'],
    recommendedPriority: 'essential_everyday',
    normalizationRationaleEn:
      'Provides both соло́дкий пе́рець and base пе́рець (plus conversational болга́рський пе́рець) for bell pepper.',
  },
  {
    vocabularyId: 'id-v2-458',
    preferredLearnerHeadwordUk: 'сала́т',
    acceptedConversationalSynonymsUk: ['листови́й сала́т', 'сала́т листови́й'],
    recommendedPriority: 'essential_everyday',
    normalizationRationaleEn:
      'Normalizes inverted botanical phrase сала́т листови́й to natural everyday Ukrainian сала́т (lettuce / salad greens).',
  },
  {
    vocabularyId: 'id-v2-591',
    preferredLearnerHeadwordUk: 'ча́йник / зава́рник',
    acceptedConversationalSynonymsUk: ['зава́рювальний ча́йник', 'чайник зава́рювальний'],
    recommendedPriority: 'essential_everyday',
    normalizationRationaleEn:
      'Normalizes inverted catalog label чайник зава́рювальний to natural everyday ча́йник / зава́рник.',
  },
  {
    vocabularyId: 'id-v2-594',
    preferredLearnerHeadwordUk: 'ке́лих',
    acceptedConversationalSynonymsUk: ['ке́лих для вина́', 'бока́л'],
    recommendedPriority: 'essential_everyday',
    normalizationRationaleEn:
      'Normalizes prepositional phrase ке́лих для вина́ to the concise canonical Ukrainian headword ке́лих.',
  },
  {
    vocabularyId: 'id-v2-712',
    preferredLearnerHeadwordUk: 'кермо́',
    acceptedConversationalSynonymsUk: ['автомобі́льне кермо́', 'кермо́ автомобі́льне'],
    recommendedPriority: 'essential_everyday',
    normalizationRationaleEn:
      'Normalizes inverted adjective phrase кермо́ автомобі́льне to the concise canonical Ukrainian noun кермо́ (steering wheel).',
  },
];

export const IDENTIFY_BATCH_7_HEADWORD_NORMALIZATION_RECORDS: readonly IdentifyBatch7HeadwordNormalizationRecord[] =
  BATCH_7_HEADWORD_NORMALIZATION_SEEDS.map(
    buildVerifiedBatch7HeadwordNormalizationRecord
  );

// ----------------------------------------------------------------------------
// 4. Independent Pedagogical Justifications for All 34 essential_everyday Items
//    in Batch 7 & Reconciliation Flags for Questionable Prior-Batch Tiers
// ----------------------------------------------------------------------------

export interface IdentifyBatch7EssentialEverydayPedagogicalReason {
  vocabularyId: string;
  conceptId: string;
  uk: string;
  en: string;
  domainId: IdentifyCoverageDomainId;
  educationalReasonEn: string;
}

interface Batch7EssentialEverydayReasonSeed {
  vocabularyId: string;
  domainId: IdentifyCoverageDomainId;
  educationalReasonEn: string;
}

const BATCH_7_ESSENTIAL_EVERYDAY_REASON_SEEDS: readonly Batch7EssentialEverydayReasonSeed[] = [
  {
    vocabularyId: 'id-v2-525',
    domainId: 'food_and_drinks',
    educationalReasonEn: 'Core daily pasta/macaroni staple in Ukrainian home cooking and grocery shopping.',
  },
  {
    vocabularyId: 'id-v2-1712',
    domainId: 'personal_belongings',
    educationalReasonEn: 'Essential household battery concept (normalized to батаре́йка) used for everyday electronics.',
  },
  {
    vocabularyId: 'id-v2-532',
    domainId: 'food_and_drinks',
    educationalReasonEn: 'Universal table condiment in homes, cafés, and supermarkets.',
  },
  {
    vocabularyId: 'id-v2-1077',
    domainId: 'city_infrastructure',
    educationalReasonEn: 'Primary sport, fitness, and hotel recreation venue (normalized to басе́йн).',
  },
  {
    vocabularyId: 'id-v2-709',
    domainId: 'transportation',
    educationalReasonEn: 'Core A2 street transport vehicle with high visual salience.',
  },
  {
    vocabularyId: 'id-v2-548',
    domainId: 'food_and_drinks',
    educationalReasonEn: 'Everyday Ukrainian breakfast and grocery meat item distinct from ковбаса́.',
  },
  {
    vocabularyId: 'id-v2-792',
    domainId: 'family_and_people',
    educationalReasonEn: 'Foundational A1 person/family noun (boy) required across school, park, and home scenes.',
  },
  {
    vocabularyId: 'id-v2-793',
    domainId: 'family_and_people',
    educationalReasonEn: 'Foundational A1 person/family noun (girl) required across school, park, and home scenes.',
  },
  {
    vocabularyId: 'id-v2-794',
    domainId: 'family_and_people',
    educationalReasonEn: 'Essential life-stage and family noun (baby / infant).',
  },
  {
    vocabularyId: 'id-v2-805',
    domainId: 'work',
    educationalReasonEn: 'Indispensable everyday service role encountered at every supermarket and store checkout.',
  },
  {
    vocabularyId: 'id-v2-807',
    domainId: 'work',
    educationalReasonEn: 'Core civic emergency and street safety profession (police officer).',
  },
  {
    vocabularyId: 'id-v2-573',
    domainId: 'food_and_drinks',
    educationalReasonEn: 'Signature everyday Ukrainian breakfast dish (cottage cheese pancakes) taught in A1/A2 dining units.',
  },
  {
    vocabularyId: 'id-v2-579',
    domainId: 'food_and_drinks',
    educationalReasonEn: 'Primary everyday Ukrainian noun for a breakfast or snack sandwich (бутербро́д).',
  },
  {
    vocabularyId: 'id-v2-581',
    domainId: 'food_and_drinks',
    educationalReasonEn: 'Universal A1 café and restaurant food item (pizza).',
  },
  {
    vocabularyId: 'id-v2-445',
    domainId: 'food_and_drinks',
    educationalReasonEn: 'Foundational Ukrainian market and borscht vegetable (normalized to капу́ста).',
  },
  {
    vocabularyId: 'id-v2-448',
    domainId: 'food_and_drinks',
    educationalReasonEn: 'Core everyday salad and cooking vegetable (bell pepper, соло́дкий пе́рець / пе́рець).',
  },
  {
    vocabularyId: 'id-v2-458',
    domainId: 'food_and_drinks',
    educationalReasonEn: 'Essential everyday leafy greens / salad noun (normalized to сала́т).',
  },
  {
    vocabularyId: 'id-v2-487',
    domainId: 'food_and_drinks',
    educationalReasonEn: 'Foundational A0 dairy staple (normalized from вершко́ве ма́сло to ма́сло).',
  },
  {
    vocabularyId: 'id-v2-963',
    domainId: 'everyday_nature',
    educationalReasonEn: 'Foundational domestic farm animal noun (cow).',
  },
  {
    vocabularyId: 'id-v2-966',
    domainId: 'everyday_nature',
    educationalReasonEn: 'Foundational domestic farm animal noun (pig).',
  },
  {
    vocabularyId: 'id-v2-978',
    domainId: 'everyday_nature',
    educationalReasonEn: 'Core animal noun (mouse) and essential polysemy contrast with computer mouse.',
  },
  {
    vocabularyId: 'id-v2-527',
    domainId: 'food_and_drinks',
    educationalReasonEn: 'Foundational A0 Ukrainian cooking oil noun (normalized from олі́я со́няшникова to олі́я).',
  },
  {
    vocabularyId: 'id-v2-591',
    domainId: 'home_and_furniture',
    educationalReasonEn: 'Core kitchen and café tea-brewing vessel (normalized to ча́йник / зава́рник).',
  },
  {
    vocabularyId: 'id-v2-207',
    domainId: 'home_and_furniture',
    educationalReasonEn: 'Everyday household and kitchen hygiene staple (paper towel roll).',
  },
  {
    vocabularyId: 'id-v2-594',
    domainId: 'home_and_furniture',
    educationalReasonEn: 'Essential dining and restaurant glassware noun (normalized from ке́лих для вина́ to ке́лих).',
  },
  {
    vocabularyId: 'id-v2-612',
    domainId: 'city_infrastructure',
    educationalReasonEn: 'Indispensable urban pedestrian navigation target (crosswalk / zebra crossing).',
  },
  {
    vocabularyId: 'id-v2-614',
    domainId: 'city_infrastructure',
    educationalReasonEn: 'Core street and traffic navigation object (road sign).',
  },
  {
    vocabularyId: 'id-v2-615',
    domainId: 'city_infrastructure',
    educationalReasonEn: 'Ubiquitous city street and park fixture (streetlamp, ліхта́р).',
  },
  {
    vocabularyId: 'id-v2-643',
    domainId: 'shopping',
    educationalReasonEn: 'Everyday supermarket and retail shopping basket (ко́шик покупця́ / ко́шик).',
  },
  {
    vocabularyId: 'id-v2-646',
    domainId: 'shopping',
    educationalReasonEn: 'Indispensable daily retail and café checkout noun (normalized from чек ка́совий to чек).',
  },
  {
    vocabularyId: 'id-v2-649',
    domainId: 'shopping',
    educationalReasonEn: 'Essential everyday payment method (bank / payment card) across shops, cafés, and transit.',
  },
  {
    vocabularyId: 'id-v2-659',
    domainId: 'transportation',
    educationalReasonEn: 'Core civic emergency vehicle (ambulance, швидка́ допомо́га).',
  },
  {
    vocabularyId: 'id-v2-681',
    domainId: 'transportation',
    educationalReasonEn: 'Essential airport and travel document (boarding pass).',
  },
  {
    vocabularyId: 'id-v2-712',
    domainId: 'transportation',
    educationalReasonEn: 'Foundational vehicle interior part (normalized from кермо́ автомобі́льне to кермо́).',
  },
];

export const IDENTIFY_BATCH_7_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS: readonly IdentifyBatch7EssentialEverydayPedagogicalReason[] =
  BATCH_7_ESSENTIAL_EVERYDAY_REASON_SEEDS.map((seed) => {
    const master = resolveMasterNounById(seed.vocabularyId);
    return {
      vocabularyId: master.vocabularyId,
      conceptId: master.conceptId,
      uk: master.uk,
      en: master.en,
      domainId: seed.domainId,
      educationalReasonEn: seed.educationalReasonEn,
    };
  });

export interface IdentifyPriorBatchPriorityReconciliationFlag {
  vocabularyId: string;
  conceptId: string;
  uk: string;
  en: string;
  batchNumber: 1 | 2 | 3 | 4 | 5 | 6;
  currentPriority: IdentifyCurriculumPriorityLevel;
  recommendedReconciledPriority: IdentifyCurriculumPriorityLevel;
  reconciliationReasonEn: string;
}

interface PriorBatchPriorityFlagSeed {
  vocabularyId: string;
  batchNumber: 1 | 2 | 3 | 4 | 5 | 6;
  currentPriority: IdentifyCurriculumPriorityLevel;
  recommendedReconciledPriority: IdentifyCurriculumPriorityLevel;
  reconciliationReasonEn: string;
}

const PRIOR_BATCH_PRIORITY_FLAG_SEEDS: readonly PriorBatchPriorityFlagSeed[] = [
  {
    vocabularyId: 'id-v2-571',
    batchNumber: 2,
    currentPriority: 'essential_everyday',
    recommendedReconciledPriority: 'useful_extended',
    reconciliationReasonEn:
      'холоде́ць (aspic / meat jelly) is a traditional festive dish rather than a frequent daily essential object.',
  },
  {
    vocabularyId: 'id-v2-575',
    batchNumber: 2,
    currentPriority: 'common_situational',
    recommendedReconciledPriority: 'useful_extended',
    reconciliationReasonEn:
      'узва́р (dried fruit compote) is a traditional Ukrainian holiday beverage better suited to useful_extended.',
  },
  {
    vocabularyId: 'id-v2-826',
    batchNumber: 2,
    currentPriority: 'common_situational',
    recommendedReconciledPriority: 'useful_extended',
    reconciliationReasonEn:
      'пончо (poncho) is a low-frequency outer garment compared to ку́ртка, пальто́, and плащ.',
  },
  {
    vocabularyId: 'id-v2-974',
    batchNumber: 5,
    currentPriority: 'essential_everyday',
    recommendedReconciledPriority: 'common_situational',
    reconciliationReasonEn:
      'оле́нь (deer) was promoted to essential_everyday in Batch 5; better calibrated as common_situational wildlife.',
  },
  {
    vocabularyId: 'id-v2-980',
    batchNumber: 5,
    currentPriority: 'essential_everyday',
    recommendedReconciledPriority: 'common_situational',
    reconciliationReasonEn:
      'черепа́ха (turtle) is a familiar animal but belongs in common_situational rather than essential_everyday.',
  },
  {
    vocabularyId: 'id-v2-981',
    batchNumber: 5,
    currentPriority: 'essential_everyday',
    recommendedReconciledPriority: 'common_situational',
    reconciliationReasonEn:
      'змія́ (snake) is a familiar reptile but belongs in common_situational rather than essential_everyday.',
  },
  {
    vocabularyId: 'id-v2-1122',
    batchNumber: 5,
    currentPriority: 'essential_everyday',
    recommendedReconciledPriority: 'common_situational',
    reconciliationReasonEn:
      'скри́пка (violin) is a well-known orchestral instrument better placed in common_situational alongside бараба́н.',
  },
  {
    vocabularyId: 'id-v2-1130',
    batchNumber: 5,
    currentPriority: 'essential_everyday',
    recommendedReconciledPriority: 'common_situational',
    reconciliationReasonEn:
      'бараба́н (drum) is a well-known musical instrument better placed in common_situational than essential_everyday.',
  },
  {
    vocabularyId: 'id-v2-1070',
    batchNumber: 5,
    currentPriority: 'essential_everyday',
    recommendedReconciledPriority: 'common_situational',
    reconciliationReasonEn:
      'ко́взани (ice skates) are seasonal winter-sport gear better aligned with common_situational.',
  },
  {
    vocabularyId: 'id-v2-1073',
    batchNumber: 5,
    currentPriority: 'essential_everyday',
    recommendedReconciledPriority: 'common_situational',
    reconciliationReasonEn:
      'ли́жі (skis) are seasonal winter-sport gear better aligned with common_situational.',
  },
  {
    vocabularyId: 'id-v2-1138',
    batchNumber: 6,
    currentPriority: 'essential_everyday',
    recommendedReconciledPriority: 'common_situational',
    reconciliationReasonEn:
      'палі́тра худо́жня (artist’s palette) is studio art equipment better calibrated as common_situational.',
  },
  {
    vocabularyId: 'id-v2-1392',
    batchNumber: 6,
    currentPriority: 'essential_everyday',
    recommendedReconciledPriority: 'common_situational',
    reconciliationReasonEn:
      'гелікопте́р / вертолі́т (helicopter) is a recognizable aircraft better calibrated as common_situational than daily essential.',
  },
];

export const IDENTIFY_PRIOR_BATCH_PRIORITY_RECONCILIATION_FLAGS: readonly IdentifyPriorBatchPriorityReconciliationFlag[] =
  PRIOR_BATCH_PRIORITY_FLAG_SEEDS.map((seed) => {
    const master = resolveMasterNounById(seed.vocabularyId);
    return {
      vocabularyId: master.vocabularyId,
      conceptId: master.conceptId,
      uk: master.uk,
      en: master.en,
      batchNumber: seed.batchNumber,
      currentPriority: seed.currentPriority,
      recommendedReconciledPriority: seed.recommendedReconciledPriority,
      reconciliationReasonEn: seed.reconciliationReasonEn,
    };
  });

// ----------------------------------------------------------------------------
// 5. Batch 7 Curation, Headword Normalization & Coverage-Gap Protection Report
// ----------------------------------------------------------------------------

export interface IdentifyBatch7CurationAndHeadwordSummary {
  reportVersion: '7.0.0-batch7';
  preservedGapAuditRecordsCount: number;
  preservedGenuineMissingConceptsCount: number;
  preservedReclassifiedNonMissingCount: number;
  headwordNormalizationsCompletedInBatch7Count: number;
  essentialEverydayWithIndependentJustificationCount: number;
  priorBatchPriorityReconciliationFlagsCount: number;
  semanticRelationshipRecordsCount: number;
  headwordNormalizationRecords: readonly IdentifyBatch7HeadwordNormalizationRecord[];
  essentialEverydayPedagogicalReasons: readonly IdentifyBatch7EssentialEverydayPedagogicalReason[];
  priorBatchPriorityReconciliationFlags: readonly IdentifyPriorBatchPriorityReconciliationFlag[];
}

export function getBatch7CurationAndHeadwordReport(): IdentifyBatch7CurationAndHeadwordSummary {
  const correctedGapSummary = getBatch4CorrectedVocabularyGapReport();

  return {
    reportVersion: '7.0.0-batch7',
    preservedGapAuditRecordsCount:
      IDENTIFY_BATCH_4_LEXICAL_GAP_AUDIT_RECORDS.length,
    preservedGenuineMissingConceptsCount:
      correctedGapSummary.genuinelyMissingConceptsCount,
    preservedReclassifiedNonMissingCount:
      correctedGapSummary.reclassifiedNonMissingCount,
    headwordNormalizationsCompletedInBatch7Count:
      IDENTIFY_BATCH_7_HEADWORD_NORMALIZATION_RECORDS.length,
    essentialEverydayWithIndependentJustificationCount:
      IDENTIFY_BATCH_7_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS.length,
    priorBatchPriorityReconciliationFlagsCount:
      IDENTIFY_PRIOR_BATCH_PRIORITY_RECONCILIATION_FLAGS.length,
    semanticRelationshipRecordsCount:
      IDENTIFY_BATCH_7_SEMANTIC_RELATIONSHIP_RECORDS.length,
    headwordNormalizationRecords:
      IDENTIFY_BATCH_7_HEADWORD_NORMALIZATION_RECORDS,
    essentialEverydayPedagogicalReasons:
      IDENTIFY_BATCH_7_ESSENTIAL_EVERYDAY_PEDAGOGICAL_REASONS,
    priorBatchPriorityReconciliationFlags:
      IDENTIFY_PRIOR_BATCH_PRIORITY_RECONCILIATION_FLAGS,
  };
}
