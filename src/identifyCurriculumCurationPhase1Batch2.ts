/**
 * LANGO IDENTIFY — PHASE 1, BATCH 2 CURATION DATA & COVERAGE GAP AUDIT
 *
 * Contains:
 * 1. Explicit per-candidate assessments and visual framing recommendations for all 200 Batch 2 candidates.
 * 2. Structured Duplicate & Lexical-Sense Resolution records comparing Batch 2 against Batch 1 and the 2,000-noun registry.
 * 3. Separate 13-Category Vocabulary Coverage Gap Report auditing `IDENTIFY_MASTER_2000_NOUNS` against
 *    `FREQ_6000_DB` and `COURSE_MODULES` without mutating the 2,000-noun master registry.
 */

import type {
  IdentifyCurriculumPriorityLevel,
  IdentifyCurationRecommendation,
  IdentifyCandidateIssueFlag,
} from './identifyCurriculumCurationPhase1.ts';

export type IdentifyVisualSceneFraming =
  | 'full_room_scene'
  | 'close_up_detail'
  | 'food_table_display'
  | 'market_counter_display'
  | 'clothing_wardrobe_display'
  | 'human_body_portrait_illustration'
  | 'street_urban_scene'
  | 'public_service_environment'
  | 'outdoor_nature_scene';

export interface Batch2ManualAssessment {
  everydayRelevance: 'high_daily' | 'moderate_situational' | 'low_niche';
  visualRecognizability: 'clear_distinct_object' | 'context_dependent' | 'poor_or_ambiguous';
  recommendedPriority: IdentifyCurriculumPriorityLevel;
  recommendedVisualFraming: IdentifyVisualSceneFraming;
  candidateSceneCategories: string[];
  recommendation: IdentifyCurationRecommendation;
  issueFlags?: IdentifyCandidateIssueFlag[];
  duplicateOfVocabularyId?: string;
  canonicalConceptId?: string;
  rationaleEn: string;
}

export interface IdentifyDuplicateAndSenseResolutionRecord {
  batchNumber: 2;
  candidateVocabularyId: string;
  candidateConceptId: string;
  candidateUk: string;
  candidateEn: string;
  canonicalConceptId: string;
  canonicalVocabularyId: string;
  canonicalUk: string;
  canonicalEn: string;
  relationshipType:
    | 'exact_orthographic_variant'
    | 'canonical_base_superseding_later_modifier_duplicate'
    | 'distinct_lexical_sense_preserved'
    | 'polysemy_sense_disambiguated'
    | 'hypernym_or_species_overlap';
  recommendedCanonicalEntry: string;
  curationActionOnBatch2Candidate: IdentifyCurationRecommendation;
  reasonEn: string;
}

export type IdentifyCoverageDomainId =
  | 'body_parts'
  | 'family_and_people'
  | 'clothing'
  | 'food_and_drinks'
  | 'home_and_furniture'
  | 'personal_belongings'
  | 'transportation'
  | 'city_infrastructure'
  | 'shopping'
  | 'education'
  | 'work'
  | 'health'
  | 'everyday_nature';

export interface IdentifyMissingVocabularyGapEntry {
  uk: string;
  en: string;
  domain: IdentifyCoverageDomainId;
  gapClassification:
    | 'genuine_omission_from_2000_registry'
    | 'present_only_as_modifier_padded_or_slash_compound'
    | 'present_under_synonym_or_different_id';
  instructionalSeqRankInFreq6000Db: number | null;
  courseModuleId: string | null;
  existingMasterVocabularyIdIfPresent: string | null;
  existingMasterUkIfPresent: string | null;
  recommendedVisualFraming: IdentifyVisualSceneFraming;
  pedagogicalNotesEn: string;
}

export interface IdentifyVocabularyCoverageGapReport {
  auditVersion: '2.0.0-batch2';
  totalDomainsAudited: 13;
  genuineOmissionsCount: number;
  modifierOrCompoundOnlyMatchesCount: number;
  synonymOrDifferentIdMatchesCount: number;
  entries: readonly IdentifyMissingVocabularyGapEntry[];
  summaryFindingsEn: readonly string[];
}

// ----------------------------------------------------------------------------
// 1. Explicit Assessments for Batch 2 Candidates (28 EXCLUDE, 22 REVIEW, and high-value KEEP overrides)
// ----------------------------------------------------------------------------

export const EXPLICIT_BATCH_2_ASSESSMENTS: Record<string, Batch2ManualAssessment> = {
  // === TOP HIGH-UTILITY EVERYDAY NOUNS EXPLICITLY HIGHLIGHTED IN BATCH 2 ===
  'id-v2-1024': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['body-health', 'bathroom', 'portrait-family'],
    recommendation: 'keep',
    rationaleEn:
      'обли́ччя (face, FREQ_6000_DB #80) is an essential A1 body-part noun; best taught in a clear human portrait or bathroom mirror framing.',
  },
  'id-v2-1026': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['body-health', 'optometry-clinic', 'portrait-family'],
    recommendation: 'keep',
    rationaleEn:
      'о́ко (eye, FREQ_6000_DB #99) is a foundational A1 body part; unmistakable in a close-up facial portrait or eye-exam chart scene.',
  },
  'id-v2-1023': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['body-health', 'portrait-family', 'hospital-pharmacy'],
    recommendation: 'keep',
    rationaleEn:
      'голова́ (head, FREQ_6000_DB #115) is a core A1 body noun with high daily communication utility.',
  },
  'id-v2-932': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['night-sky-nature', 'city-streets', 'beach-nature'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'мі́сяць (небесне тіло) (moon, FREQ_6000_DB #148) explicitly disambiguates the visible celestial moon from the calendar month sense of мі́сяць.',
  },
  'id-v2-518': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'cafe', 'dining-room', 'supermarket'],
    recommendation: 'keep',
    rationaleEn:
      'цу́кор (sugar, FREQ_6000_DB #211) is an essential everyday grocery and café table noun; visually clear as sugar cubes or an open sugar bowl with spoon.',
  },
  'id-v2-519': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'dining-room', 'restaurant', 'cafe'],
    recommendation: 'keep',
    rationaleEn:
      'сіль (salt, FREQ_6000_DB #212) is an essential everyday kitchen and dining noun; best framed as a glass salt shaker or salt cellar on a dining table.',
  },
  'id-v2-554': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['supermarket', 'farmers-market', 'restaurant', 'kitchen'],
    recommendation: 'keep',
    rationaleEn:
      'ри́ба (fish, FREQ_6000_DB #216) is the primary canonical fish noun for food, market, and nature scenes (superseding overly specific species like короп or ску́мбрія).',
  },
  'id-v2-568': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['restaurant', 'dining-room', 'kitchen', 'cafe'],
    recommendation: 'keep',
    rationaleEn:
      'борщ (borscht, FREQ_6000_DB #218) is the signature Ukrainian national dish and an unmistakable deep-crimson soup served with sour cream and dill.',
  },
  'id-v2-569': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['restaurant', 'dining-room', 'kitchen'],
    recommendation: 'keep',
    rationaleEn:
      'варе́ники (varenyky dumplings, FREQ_6000_DB #219) are an essential Ukrainian culinary noun with a distinctive crescent dumpling shape.',
  },
  'id-v2-800': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['classroom', 'library', 'cafe'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'студе́нт (university student, FREQ_6000_DB #259) is lexically distinct in Ukrainian from у́чень (school pupil, cl-student); essential A1 education noun.',
  },
  'id-v2-799': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['classroom'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'cl-teacher',
    canonicalConceptId: 'noun-concept-1151',
    rationaleEn:
      'вчи́тель (id-v2-799) is an orthographic/euphonic (у/в) variant of учи́тель (cl-teacher, noun-concept-1151), which was already approved as KEEP in Batch 1. Excluded as a separate concept ID so "teacher" is not double-counted in the 1,200-noun curriculum.',
  },
  'id-v2-790': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['living-room', 'city-streets', 'office', 'dining-room'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'чолові́к (man / husband, FREQ_6000_DB #268) is a core A1 person/family noun; in visual Identify scenes it targets an adult man.',
  },
  'id-v2-791': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['living-room', 'city-streets', 'office', 'cafe'],
    recommendation: 'keep',
    rationaleEn:
      'жі́нка (woman, FREQ_6000_DB #269) is a foundational A1 person noun reusable across household, street, workplace, and café scenes.',
  },
  'id-v2-795': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['living-room', 'dining-room', 'park-garden'],
    recommendation: 'keep',
    rationaleEn:
      'діду́сь (grandfather, FREQ_6000_DB #276) is a core A1 family noun easily depicted as an older man in multi-generational family scenes.',
  },
  'id-v2-796': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['living-room', 'dining-room', 'kitchen'],
    recommendation: 'keep',
    rationaleEn:
      'бабу́ся (grandmother, FREQ_6000_DB #277) is a core A1 family noun easily depicted in multi-generational family and kitchen scenes.',
  },
  'id-v2-704': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'airport-train', 'hotel'],
    recommendation: 'keep',
    rationaleEn:
      'таксі́ (taxi cab, FREQ_6000_DB #285) is an essential A1 urban transit noun with a distinctive checkered roof sign.',
  },
  'id-v2-931': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'park-garden', 'beach-nature'],
    recommendation: 'keep',
    rationaleEn:
      'міст (bridge, FREQ_6000_DB #291) is an essential A1 city infrastructure and river-crossing landmark.',
  },
  'id-v2-922': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'beach-nature', 'city-streets'],
    recommendation: 'keep',
    rationaleEn:
      'рі́чка (river, FREQ_6000_DB #313) is a foundational A1 geography and nature noun.',
  },
  'id-v2-815': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['bedroom', 'clothing-store', 'office'],
    recommendation: 'keep',
    rationaleEn:
      'соро́чка (button-down shirt, FREQ_6000_DB #350) is an essential A1 clothing item distinct from футбо́лка (T-shirt, bd-shirt).',
  },
  'id-v2-832': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['bedroom', 'clothing-store', 'living-room'],
    recommendation: 'keep',
    rationaleEn:
      'су́кня (dress, FREQ_6000_DB #351) is an essential A1 garment with an unmistakable silhouette on a hanger, mannequin, or person.',
  },
  'id-v2-824': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['hallway-entry', 'bedroom', 'clothing-store', 'city-streets'],
    recommendation: 'keep',
    rationaleEn:
      'пальто́ (overcoat, FREQ_6000_DB #352) is an essential A1 outerwear noun in Ukrainian.',
  },
  'id-v2-846': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['hallway-entry', 'clothing-store', 'city-streets'],
    recommendation: 'keep',
    rationaleEn:
      'ша́пка (knitted winter beanie hat, FREQ_6000_DB #353) is an essential everyday cold-weather garment in Ukraine, distinct from brimmed капелю́х (id-v2-847).',
  },
  'id-v2-874': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['hallway-entry', 'city-streets', 'cafe'],
    recommendation: 'keep',
    rationaleEn:
      'парасо́лька (umbrella, FREQ_6000_DB #355) is a high-utility everyday personal belonging with an unmistakable shape.',
  },
  'id-v2-680': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['airport-train', 'hotel', 'office'],
    recommendation: 'keep',
    rationaleEn:
      'па́спорт (passport, FREQ_6000_DB #358) is an essential travel and civic identity document with a recognizable dark-blue Ukrainian trident cover.',
  },
  'id-v2-441': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market', 'supermarket', 'kitchen'],
    recommendation: 'keep',
    rationaleEn:
      'цибу́ля (onion, FREQ_6000_DB #565) is a staple everyday vegetable in Ukrainian cooking with golden papery skin.',
  },
  'id-v2-552': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['dining-room', 'restaurant', 'cafe', 'kitchen'],
    recommendation: 'keep',
    rationaleEn:
      'котле́та (minced meat cutlet, FREQ_6000_DB #678) is a staple Ukrainian everyday meal item; canonical base noun superseding specialized котле́та по-ки́ївськи (id-v2-1322).',
  },
  'id-v2-547': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'farmers-market', 'kitchen', 'dining-room'],
    recommendation: 'keep',
    rationaleEn:
      'ковбаса́ (sausage, FREQ_6000_DB #679) is a core everyday food item in Ukrainian supermarkets and breakfast spreads.',
  },
  'id-v2-483': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['dining-room', 'restaurant', 'kitchen', 'supermarket'],
    recommendation: 'keep',
    rationaleEn:
      'смета́на (sour cream, FREQ_6000_DB #680) is an essential Ukrainian dairy staple served in a ceramic bowl with spoon alongside borscht and varenyky.',
  },

  // === EXPLICIT REVIEW CANDIDATES IN BATCH 2 (22 ITEMS) ===
  'id-v2-482': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['cafe', 'kitchen', 'supermarket'],
    recommendation: 'review',
    rationaleEn:
      'вершки́ (cream, FREQ_6000_DB #574) is a common dairy noun, but liquid cream is visually similar to молоко́ or смета́на unless framed as a small coffee creamer pitcher or whipped cream.',
  },
  'id-v2-888': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'beach-nature'],
    recommendation: 'review',
    rationaleEn:
      'дуб (oak tree, FREQ_6000_DB #737) is culturally iconic, but requires visible lobed oak leaves/acorns so learners can distinguish it from generic де́рево (pk-tree).',
  },
  'id-v2-894': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'beach-nature'],
    recommendation: 'review',
    rationaleEn:
      'ве́рба (willow tree, FREQ_6000_DB #738) has a distinct weeping silhouette over water, but requires review against the botanical-species budget alongside generic де́рево.',
  },
  'id-v2-895': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['city-streets', 'park-garden'],
    recommendation: 'review',
    rationaleEn:
      'кашта́н (chestnut tree, FREQ_6000_DB #739) is the signature tree of Kyiv; requires visible upright blossom candles or spiky chestnut burs for unambiguous visual identification.',
  },
  'id-v2-909': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['park-garden', 'farmers-market'],
    recommendation: 'review',
    rationaleEn:
      'воло́шка (cornflower, FREQ_6000_DB #742) is a beloved Ukrainian wildflower (and canonical base superseding id-v2-1551 and id-v2-1910), but requires close-up floral detail to distinguish from generic кві́тка.',
  },
  'id-v2-484': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['supermarket', 'kitchen', 'dining-room'],
    recommendation: 'review',
    rationaleEn:
      'кефі́р (kefir, FREQ_6000_DB #846) is a daily Ukrainian dairy staple, but requires a recognizable dairy bottle/carton design to distinguish visually from молоко́ (sm-milk).',
  },
  'id-v2-1614': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'beach-nature'],
    recommendation: 'review',
    rationaleEn:
      'ла́стівка (swallow, FREQ_6000_DB #901) is recognizable by its forked tail, but requires review on how many specific bird species should coexist with generic птах (pk-bird).',
  },
  'id-v2-890': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'beach-nature'],
    recommendation: 'review',
    rationaleEn:
      'бере́за (birch tree, FREQ_6000_DB #924) has unmistakable white-and-black bark, but is held in review while balancing specific tree species against generic де́рево (pk-tree).',
  },
  'id-v2-682': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['airport-train', 'civic-services'],
    recommendation: 'review',
    rationaleEn:
      'ві́за (passport visa stamp, FREQ_6000_DB #930) is an interior page detail inside па́спорт (id-v2-680); only visually teachable in a close-up document view.',
  },
  'id-v2-1623': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['park-garden', 'beach-nature'],
    recommendation: 'review',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'ба́бка (комаха) (dragonfly, FREQ_6000_DB #946) preserves explicit sense disambiguation, but is a lower-priority insect compared to everyday household and urban nouns.',
  },
  'id-v2-1542': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden'],
    recommendation: 'review',
    rationaleEn:
      'бузок (lilac bush, FREQ_6000_DB #1020) is visually recognizable by purple spring flower clusters, but overlaps with generic кущ (pk-bush) unless framed in close-up.',
  },
  'id-v2-493': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen', 'dining-room'],
    recommendation: 'review',
    rationaleEn:
      'жовто́к (egg yolk, FREQ_6000_DB #1057) is a sub-part of яйце́ (sm-egg) and яє́шня (id-v2-578); requires non-overlapping pin placement on an open egg.',
  },
  'id-v2-1568': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature'],
    recommendation: 'review',
    rationaleEn:
      'меду́за (jellyfish, FREQ_6000_DB #1094) is visually distinct in Black Sea beach/aquarium scenes, but has lower daily utility than core everyday objects.',
  },
  'id-v2-584': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['dining-room', 'cafe', 'kitchen'],
    recommendation: 'review',
    rationaleEn:
      'компо́т (berry compote drink, FREQ_6000_DB #682) is an everyday Ukrainian beverage, but requires a clear glass pitcher with visible whole berries to distinguish from сік or узва́р.',
  },
  'id-v2-583': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['dining-room', 'restaurant'],
    recommendation: 'review',
    rationaleEn:
      'узва́р (uzvar dried-fruit compote, FREQ_6000_DB #1149) is a traditional Ukrainian beverage visually very close to компо́т (id-v2-584); review whether both should be separate visual pins.',
  },
  'id-v2-1483': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['family-celebration', 'city-streets'],
    recommendation: 'review',
    rationaleEn:
      'нарече́ний (groom, FREQ_6000_DB #1214) requires an explicit wedding scene with boutonniere and bride to distinguish from a man in a business suit (чолові́к).',
  },
  'id-v2-1126': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom', 'cultural-music'],
    recommendation: 'review',
    rationaleEn:
      'сопі́лка (sopilka wooden flute, FREQ_6000_DB #1332) is a recognizable Ukrainian musical instrument (and canonical base superseding id-v2-1988), held for review on cultural-instrument scene allocation.',
  },
  'id-v2-463': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['cafe', 'kitchen', 'farmers-market'],
    recommendation: 'review',
    rationaleEn:
      'м’я́та (mint, FREQ_6000_DB #1435) requires close-up serrated herb-leaf framing (e.g., garnishing tea or lemonade) to distinguish from generic green leaves.',
  },
  'id-v2-1481': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    candidateSceneCategories: ['playground', 'park-garden', 'living-room'],
    recommendation: 'review',
    rationaleEn:
      'близнюки́ (twins, FREQ_6000_DB #1591) is a relational plural noun that requires a single bounding box around two visibly identical siblings.',
  },
  'id-v2-917': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature', 'park-garden'],
    recommendation: 'review',
    rationaleEn:
      'доли́на (valley, FREQ_6000_DB #2061) is a wide topographic region between mountains; requires careful non-overlapping region geometry in a mountain landscape scene.',
  },
  'id-v2-914': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'beach-nature'],
    recommendation: 'review',
    rationaleEn:
      'па́горб (hill, FREQ_6000_DB #2067) requires visual contrast with гора́ (mountain, bn-mountain) so learners can distinguish a gentle grassy hill from a rocky peak.',
  },
  'id-v2-896': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['park-garden', 'kitchen'],
    recommendation: 'review',
    rationaleEn:
      'калина (viburnum / guelder-rose, FREQ_6000_DB #2070) is a deeply symbolic Ukrainian berry plant; best shown as bright red berry clusters in close-up detail.',
  },

  // === EXPLICIT EXCLUDE CANDIDATES IN BATCH 2 (28 ITEMS TOTAL, INCLUDING id-v2-799 ABOVE) ===
  'id-v2-485': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['supermarket', 'kitchen'],
    recommendation: 'exclude',
    issueFlags: ['hypernym_ambiguous'],
    rationaleEn:
      'ря́жанка (baked fermented milk, FREQ_6000_DB #847) is visually indistinguishable in a glass or cup from milk, kefir, or beige yogurt without reading package text.',
  },
  'id-v2-574': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['dining-room'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'холоде́ць (aspic / meat jelly, FREQ_6000_DB #848) is a seasonal holiday dish with an ambiguous visual silhouette in general food scenes.',
  },
  'id-v2-1536': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['beach-nature'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'hypernym_ambiguous'],
    rationaleEn:
      'дібро́ва (oak grove, FREQ_6000_DB #925) is a poetic/literary term for an oak woods that cannot be visually distinguished from a general forest (ліс) or oak tree (дуб).',
  },
  'id-v2-540': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'farmers-market'],
    recommendation: 'exclude',
    issueFlags: ['hypernym_ambiguous'],
    rationaleEn:
      'свини́на (raw pork meat, FREQ_6000_DB #986) cannot be reliably distinguished by visual appearance alone from beef (ялови́чина), veal (теля́тина), or lamb (бара́нина) without butcher labels.',
  },
  'id-v2-539': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'farmers-market'],
    recommendation: 'exclude',
    issueFlags: ['hypernym_ambiguous'],
    rationaleEn:
      'ялови́чина (raw beef, FREQ_6000_DB #987) is visually ambiguous against pork, veal, and mutton cuts in an unlabeled visual identification quiz.',
  },
  'id-v2-541': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'farmers-market'],
    recommendation: 'exclude',
    issueFlags: ['hypernym_ambiguous', 'obscure_or_rare'],
    rationaleEn:
      'теля́тина (veal, FREQ_6000_DB #988) is visually indistinguishable from raw pork or beef cuts in a visual scene.',
  },
  'id-v2-542': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'farmers-market'],
    recommendation: 'exclude',
    issueFlags: ['hypernym_ambiguous'],
    rationaleEn:
      'бара́нина (lamb / mutton, FREQ_6000_DB #989) is visually indistinguishable from other raw red meat cuts without text labels.',
  },
  'id-v2-558': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['supermarket', 'dining-room'],
    recommendation: 'exclude',
    issueFlags: ['hypernym_ambiguous'],
    duplicateOfVocabularyId: 'id-v2-554',
    rationaleEn:
      'оселе́дець (herring, FREQ_6000_DB #1026) is an overly specific fish species for a 1,200-noun visual curriculum; superseded by canonical ри́ба (id-v2-554).',
  },
  'id-v2-557': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'hypernym_ambiguous'],
    duplicateOfVocabularyId: 'id-v2-554',
    rationaleEn:
      'короп (carp, FREQ_6000_DB #1027) requires ichthyological species recognition and duplicates the visual slot of canonical ри́ба (id-v2-554).',
  },
  'id-v2-556': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['restaurant', 'supermarket'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'hypernym_ambiguous'],
    duplicateOfVocabularyId: 'id-v2-554',
    rationaleEn:
      'форе́ль (trout, FREQ_6000_DB #1028) is an overly specific fish species visually overlapping with canonical ри́ба (id-v2-554).',
  },
  'id-v2-1319': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['restaurant'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'hypernym_ambiguous'],
    rationaleEn:
      'бану́ш (Carpathian cornmeal dish, FREQ_6000_DB #1060) is visually indistinguishable in a bowl from generic porridge (ка́ша, id-v2-576) or mashed potatoes.',
  },
  'id-v2-490': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['farmers-market', 'supermarket'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'hypernym_ambiguous'],
    duplicateOfVocabularyId: 'sm-cheese',
    rationaleEn:
      'бри́нза (Carpathian sheep cheese, FREQ_6000_DB #1062) is visually indistinguishable from white feta/cottage cheese and is superseded by core сир (sm-cheese).',
  },
  'id-v2-559': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'hypernym_ambiguous'],
    duplicateOfVocabularyId: 'id-v2-554',
    rationaleEn:
      'ску́мбрія (mackerel, FREQ_6000_DB #1087) is an overly specific fish species superseded by canonical ри́ба (id-v2-554).',
  },
  'id-v2-562': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['restaurant'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'мі́дія (mussel, FREQ_6000_DB #1095) has low everyday communicative frequency compared to core food vocabulary.',
  },
  'id-v2-563': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['restaurant'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'у́стриця (oyster, FREQ_6000_DB #1096) is a luxury seafood item with low everyday utility for a 1,200-noun core Ukrainian curriculum.',
  },
  'id-v2-1731': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['cultural-music'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'цимба́ли (hammered dulcimer, FREQ_6000_DB #1331) is a specialized folk orchestra instrument outside the top 1,200 everyday nouns.',
  },
  'id-v2-1504': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['clothing-store'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare'],
    duplicateOfVocabularyId: 'id-v2-831',
    rationaleEn:
      'плахта (historical woven wrap skirt, FREQ_6000_DB #1341) is an ethnographic costume piece superseded for everyday communication by спідни́ця (skirt, id-v2-831).',
  },
  'id-v2-1501': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['clothing-store'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'шарова́ри (wide historical Cossack trousers, FREQ_6000_DB #1347) is a historical/folkloric costume term rather than everyday modern clothing.',
  },
  'id-v2-1883': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['clothing-store'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'modifier_padded_duplicate'],
    rationaleEn:
      'кептар (безрука́вка карпа́тська) (Carpathian folk vest, FREQ_6000_DB #1348) is a regional ethnographic garment outside everyday 1,200-noun needs.',
  },
  'id-v2-429': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'аґру́с (gooseberry, FREQ_6000_DB #1416) appears in early course phonetics solely to illustrate the letter Ґ; low everyday frequency compared to core fruits.',
  },
  'id-v2-407': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['playground', 'bedroom'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'дзи́ґа (spinning top, FREQ_6000_DB #1417) appears in A0 phonetics solely to illustrate the letter Ґ; low everyday communicative utility.',
  },
  'id-v2-1494': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['cultural-music'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'дириге́нт (orchestra conductor, FREQ_6000_DB #1962) is a niche concert-hall profession outside the 1,200 everyday vocabulary target.',
  },
  'id-v2-1540': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'hypernym_ambiguous'],
    duplicateOfVocabularyId: 'pk-tree',
    rationaleEn:
      'топо́ля (poplar tree, FREQ_6000_DB #2071) is an overly specific tree species that visually overlaps with generic де́рево (pk-tree).',
  },
};

// ----------------------------------------------------------------------------
// 2. Structured Duplicate & Lexical-Sense Resolution Records for Batch 2
// ----------------------------------------------------------------------------

export const IDENTIFY_BATCH_2_DUPLICATE_AND_SENSE_RECORDS: readonly IdentifyDuplicateAndSenseResolutionRecord[] = [
  {
    batchNumber: 2,
    candidateVocabularyId: 'id-v2-799',
    candidateConceptId: 'noun-concept-1258',
    candidateUk: 'вчи́тель',
    candidateEn: 'teacher',
    canonicalConceptId: 'noun-concept-1151',
    canonicalVocabularyId: 'cl-teacher',
    canonicalUk: 'учи́тель',
    canonicalEn: 'teacher',
    relationshipType: 'exact_orthographic_variant',
    recommendedCanonicalEntry: 'cl-teacher (учи́тель / вчи́тель)',
    curationActionOnBatch2Candidate: 'exclude',
    reasonEn:
      'Ukrainian учи́тель and вчи́тель are euphonic (у/в) orthographic variants of the exact same noun concept ("school teacher"). Canonical cl-teacher (noun-concept-1151) was already accepted in Batch 1; id-v2-799 is excluded so "teacher" is counted once.',
  },
  {
    batchNumber: 2,
    candidateVocabularyId: 'id-v2-800',
    candidateConceptId: 'noun-concept-1279',
    candidateUk: 'студе́нт',
    candidateEn: 'university student',
    canonicalConceptId: 'noun-concept-1279',
    canonicalVocabularyId: 'id-v2-800',
    canonicalUk: 'студе́нт',
    canonicalEn: 'university student',
    relationshipType: 'distinct_lexical_sense_preserved',
    recommendedCanonicalEntry: 'id-v2-800 (студе́нт) alongside cl-student (у́чень)',
    curationActionOnBatch2Candidate: 'keep',
    reasonEn:
      'Unlike English "student", Ukrainian strictly distinguishes у́чень (school pupil, cl-student) from студе́нт (university/college student, id-v2-800). Both are kept as separate concepts.',
  },
  {
    batchNumber: 2,
    candidateVocabularyId: 'id-v2-932',
    candidateConceptId: 'noun-concept-1435',
    candidateUk: 'мі́сяць (небесне тіло)',
    candidateEn: 'moon',
    canonicalConceptId: 'noun-concept-1435',
    canonicalVocabularyId: 'id-v2-932',
    canonicalUk: 'мі́сяць (небесне тіло)',
    canonicalEn: 'moon',
    relationshipType: 'polysemy_sense_disambiguated',
    recommendedCanonicalEntry: 'id-v2-932 (мі́сяць — celestial moon)',
    curationActionOnBatch2Candidate: 'keep',
    reasonEn:
      'Ukrainian мі́сяць means both "moon" and "calendar month"; the visual Identify target preserves the concrete celestial-body sense.',
  },
  {
    batchNumber: 2,
    candidateVocabularyId: 'id-v2-790',
    candidateConceptId: 'noun-concept-1278',
    candidateUk: 'чолові́к',
    candidateEn: 'man',
    canonicalConceptId: 'noun-concept-1278',
    canonicalVocabularyId: 'id-v2-790',
    canonicalUk: 'чолові́к',
    canonicalEn: 'man / husband',
    relationshipType: 'polysemy_sense_disambiguated',
    recommendedCanonicalEntry: 'id-v2-790 (чолові́к)',
    curationActionOnBatch2Candidate: 'keep',
    reasonEn:
      'Ukrainian чолові́к means both "adult man" and "husband"; in visual scenes it anchors an adult man (and husband in family scenes).',
  },
  {
    batchNumber: 2,
    candidateVocabularyId: 'id-v2-858',
    candidateConceptId: 'noun-concept-1296',
    candidateUk: 'бли́скавка (застібка)',
    candidateEn: 'zipper',
    canonicalConceptId: 'noun-concept-1296',
    canonicalVocabularyId: 'id-v2-858',
    canonicalUk: 'бли́скавка (застібка)',
    canonicalEn: 'zipper',
    relationshipType: 'polysemy_sense_disambiguated',
    recommendedCanonicalEntry: 'id-v2-858 (бли́скавка — zipper fastener)',
    curationActionOnBatch2Candidate: 'keep',
    reasonEn:
      'Explicitly disambiguates the clothing fastener sense ("zipper") from meteorological lightning (бли́скавка, id-v2-936).',
  },
  {
    batchNumber: 2,
    candidateVocabularyId: 'id-v2-268',
    candidateConceptId: 'noun-concept-0361',
    candidateUk: 'сві́чка',
    candidateEn: 'candle',
    canonicalConceptId: 'noun-concept-0361',
    canonicalVocabularyId: 'id-v2-268',
    canonicalUk: 'сві́чка',
    canonicalEn: 'candle',
    relationshipType: 'canonical_base_superseding_later_modifier_duplicate',
    recommendedCanonicalEntry: 'id-v2-268 (сві́чка)',
    curationActionOnBatch2Candidate: 'keep',
    reasonEn:
      'Canonical base noun сві́чка (#799) kept here in Batch 2; its modifier-padded duplicate id-v2-1783 (сві́чка аромати́чна) was already excluded in Batch 1.',
  },
  {
    batchNumber: 2,
    candidateVocabularyId: 'id-v2-430',
    candidateConceptId: 'noun-concept-0553',
    candidateUk: 'каву́н',
    candidateEn: 'watermelon',
    canonicalConceptId: 'noun-concept-0553',
    canonicalVocabularyId: 'id-v2-430',
    canonicalUk: 'каву́н',
    canonicalEn: 'watermelon',
    relationshipType: 'canonical_base_superseding_later_modifier_duplicate',
    recommendedCanonicalEntry: 'id-v2-430 (каву́н)',
    curationActionOnBatch2Candidate: 'keep',
    reasonEn:
      'Canonical base noun каву́н (#685) kept in Batch 2; supersedes later modifier-padded entry id-v2-1798 (каву́н ски́бка).',
  },
  {
    batchNumber: 2,
    candidateVocabularyId: 'id-v2-503',
    candidateConceptId: 'noun-concept-0595',
    candidateUk: 'па́мпушка',
    candidateEn: 'pampushka garlic bun',
    canonicalConceptId: 'noun-concept-0595',
    canonicalVocabularyId: 'id-v2-503',
    canonicalUk: 'па́мпушка',
    canonicalEn: 'pampushka garlic bun',
    relationshipType: 'canonical_base_superseding_later_modifier_duplicate',
    recommendedCanonicalEntry: 'id-v2-503 (па́мпушка)',
    curationActionOnBatch2Candidate: 'keep',
    reasonEn:
      'Canonical base noun па́мпушка (#793) kept in Batch 2; supersedes later modifier-padded entry id-v2-1786 (пампу́шка з часнико́м).',
  },
  {
    batchNumber: 2,
    candidateVocabularyId: 'id-v2-867',
    candidateConceptId: 'noun-concept-1407',
    candidateUk: 'нами́сто',
    candidateEn: 'necklace / coral beads',
    canonicalConceptId: 'noun-concept-1407',
    canonicalVocabularyId: 'id-v2-867',
    canonicalUk: 'нами́сто',
    canonicalEn: 'necklace / coral beads',
    relationshipType: 'canonical_base_superseding_later_modifier_duplicate',
    recommendedCanonicalEntry: 'id-v2-867 (нами́сто)',
    curationActionOnBatch2Candidate: 'keep',
    reasonEn:
      'Canonical base noun нами́сто (#834) kept in Batch 2; supersedes later modifier-padded entry id-v2-1886 (нами́сто кора́лове).',
  },
  {
    batchNumber: 2,
    candidateVocabularyId: 'id-v2-624',
    candidateConceptId: 'noun-concept-0800',
    candidateUk: 'вітри́на',
    candidateEn: 'shop window',
    canonicalConceptId: 'noun-concept-0800',
    canonicalVocabularyId: 'id-v2-624',
    canonicalUk: 'вітри́на',
    canonicalEn: 'shop window',
    relationshipType: 'canonical_base_superseding_later_modifier_duplicate',
    recommendedCanonicalEntry: 'id-v2-624 (вітри́на)',
    curationActionOnBatch2Candidate: 'keep',
    reasonEn:
      'Canonical base noun вітри́на (#1191) kept in Batch 2; supersedes later modifier-padded entry id-v2-1821 (вітри́на пека́рні).',
  },
  {
    batchNumber: 2,
    candidateVocabularyId: 'id-v2-258',
    candidateConceptId: 'noun-concept-0195',
    candidateUk: 'підвіко́ння',
    candidateEn: 'windowsill',
    canonicalConceptId: 'noun-concept-0195',
    canonicalVocabularyId: 'id-v2-258',
    canonicalUk: 'підвіко́ння',
    canonicalEn: 'windowsill',
    relationshipType: 'canonical_base_superseding_later_modifier_duplicate',
    recommendedCanonicalEntry: 'id-v2-258 (підвіко́ння)',
    curationActionOnBatch2Candidate: 'keep',
    reasonEn:
      'Canonical base noun підвіко́ння (#1247) kept in Batch 2; supersedes later modifier-padded entry id-v2-1752 (підвіко́ння мармуро́ве).',
  },
  {
    batchNumber: 2,
    candidateVocabularyId: 'id-v2-852',
    candidateConceptId: 'noun-concept-1276',
    candidateUk: 'рукави́чки',
    candidateEn: 'gloves',
    canonicalConceptId: 'noun-concept-1276',
    canonicalVocabularyId: 'id-v2-852',
    canonicalUk: 'рукави́чки',
    canonicalEn: 'gloves',
    relationshipType: 'canonical_base_superseding_later_modifier_duplicate',
    recommendedCanonicalEntry: 'id-v2-852 (рукави́чки)',
    curationActionOnBatch2Candidate: 'keep',
    reasonEn:
      'Canonical base noun рукави́чки (#1700) kept in Batch 2; supersedes later modifier-padded entries id-v2-1643 (рукави́чки меди́чні) and id-v2-1954 (рукави́чки атлети́чні).',
  },
];

// ----------------------------------------------------------------------------
// 3. Separate 13-Domain Vocabulary Coverage Gap Report
// ----------------------------------------------------------------------------

export const IDENTIFY_VOCABULARY_COVERAGE_GAP_ENTRIES: readonly IdentifyMissingVocabularyGapEntry[] = [
  // 1. Body Parts
  {
    uk: 'рука́',
    en: 'hand / arm',
    domain: 'body_parts',
    gapClassification: 'present_only_as_modifier_padded_or_slash_compound',
    instructionalSeqRankInFreq6000Db: 70,
    courseModuleId: 'A1.2',
    existingMasterVocabularyIdIfPresent: 'id-v2-1033',
    existingMasterUkIfPresent: 'рука́ / кисть',
    recommendedVisualFraming: 'human_body_portrait_illustration',
    pedagogicalNotesEn:
      'Present in IDENTIFY_MASTER_2000_NOUNS only as the slash-compound label "рука́ / кисть" (id-v2-1033); should be normalized to clean headword рука́.',
  },
  {
    uk: 'живі́т',
    en: 'stomach / belly',
    domain: 'body_parts',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 1708,
    courseModuleId: 'A2.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'human_body_portrait_illustration',
    pedagogicalNotesEn:
      'Core A1/A2 body and medical-symptom noun (болить живі́т) completely absent from IDENTIFY_MASTER_2000_NOUNS.',
  },
  {
    uk: 'брова́',
    en: 'eyebrow',
    domain: 'body_parts',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 718,
    courseModuleId: 'A1.2',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'human_body_portrait_illustration',
    pedagogicalNotesEn:
      'Taught in FREQ_6000_DB (#718) and A1 facial descriptions, but omitted from IDENTIFY_MASTER_2000_NOUNS.',
  },

  // 2. Family & People
  {
    uk: 'ма́ма',
    en: 'mom / mother',
    domain: 'family_and_people',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 135,
    courseModuleId: 'A0.2',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'human_body_portrait_illustration',
    pedagogicalNotesEn:
      'Essential A0/A1 family noun (#135 in FREQ_6000_DB); omitted from the 2,000-noun registry even though діду́сь and бабу́ся were included.',
  },
  {
    uk: 'ба́тько',
    en: 'father',
    domain: 'family_and_people',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 134,
    courseModuleId: 'A0.2',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'human_body_portrait_illustration',
    pedagogicalNotesEn:
      'Essential A0/A1 family noun (#134 in FREQ_6000_DB, alongside colloquial та́то #1404); omitted from IDENTIFY_MASTER_2000_NOUNS.',
  },
  {
    uk: 'син',
    en: 'son',
    domain: 'family_and_people',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 272,
    courseModuleId: 'A1.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'human_body_portrait_illustration',
    pedagogicalNotesEn:
      'Core A1 family noun (#272 in FREQ_6000_DB); omitted from the 2,000-noun registry.',
  },
  {
    uk: 'дочка́',
    en: 'daughter',
    domain: 'family_and_people',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 273,
    courseModuleId: 'A1.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'human_body_portrait_illustration',
    pedagogicalNotesEn:
      'Core A1 family noun (#273 in FREQ_6000_DB, alongside до́нька); omitted from the 2,000-noun registry.',
  },
  {
    uk: 'хло́пець',
    en: 'boy / young man',
    domain: 'family_and_people',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 270,
    courseModuleId: 'A1.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'human_body_portrait_illustration',
    pedagogicalNotesEn:
      'High-frequency A1 person noun (#270 in FREQ_6000_DB); only diminutive хло́пчик (id-v2-792) exists in the 2,000-noun registry.',
  },
  {
    uk: 'ді́вчина',
    en: 'girl / young woman',
    domain: 'family_and_people',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 271,
    courseModuleId: 'A1.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'human_body_portrait_illustration',
    pedagogicalNotesEn:
      'High-frequency A1 person noun (#271 in FREQ_6000_DB); only diminutive ді́вчинка (id-v2-793) exists in the 2,000-noun registry.',
  },

  // 3. Clothing
  {
    uk: 'штани́',
    en: 'trousers / pants',
    domain: 'clothing',
    gapClassification: 'present_only_as_modifier_padded_or_slash_compound',
    instructionalSeqRankInFreq6000Db: 571,
    courseModuleId: 'A1.2',
    existingMasterVocabularyIdIfPresent: 'id-v2-828',
    existingMasterUkIfPresent: 'штани́ / брю́ки',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    pedagogicalNotesEn:
      'Present in IDENTIFY_MASTER_2000_NOUNS only as the slash-compound "штани́ / брю́ки" (id-v2-828); should use clean primary headword штани́.',
  },
  {
    uk: 'взуття́',
    en: 'footwear / shoes',
    domain: 'clothing',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 349,
    courseModuleId: 'A1.2',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'clothing_wardrobe_display',
    pedagogicalNotesEn:
      'Core A1 collective noun (#349 in FREQ_6000_DB) for footwear in hallway shoe-rack and shoe-store scenes; absent from the 2,000-noun registry.',
  },
  {
    uk: 'костю́м',
    en: 'suit',
    domain: 'clothing',
    gapClassification: 'present_only_as_modifier_padded_or_slash_compound',
    instructionalSeqRankInFreq6000Db: null,
    courseModuleId: 'A2.1',
    existingMasterVocabularyIdIfPresent: 'id-v2-833',
    existingMasterUkIfPresent: 'костю́м ділови́й',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    pedagogicalNotesEn:
      'Present in IDENTIFY_MASTER_2000_NOUNS only in modifier-padded form "костю́м ділови́й" (id-v2-833).',
  },

  // 4. Food & Drinks
  {
    uk: 'вода́',
    en: 'water',
    domain: 'food_and_drinks',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 111,
    courseModuleId: 'A0.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'food_table_display',
    pedagogicalNotesEn:
      'Foundational A0 noun (#111 in FREQ_6000_DB); omitted from IDENTIFY_MASTER_2000_NOUNS (which included пля́шка and скля́нка but not вода́ itself).',
  },
  {
    uk: 'ма́сло',
    en: 'butter',
    domain: 'food_and_drinks',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 213,
    courseModuleId: 'A1.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'food_table_display',
    pedagogicalNotesEn:
      'Essential A1 breakfast and baking noun (#213 in FREQ_6000_DB); omitted even though масля́нка (butter dish, id-v2-196) was included.',
  },
  {
    uk: 'м’я́со',
    en: 'meat',
    domain: 'food_and_drinks',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 215,
    courseModuleId: 'A1.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'market_counter_display',
    pedagogicalNotesEn:
      'Primary A1 hypernym (#215 in FREQ_6000_DB) needed to replace the visually indistinguishable raw meat sub-cuts (свини́на, ялови́чина, теля́тина, бара́нина).',
  },
  {
    uk: 'суп',
    en: 'soup',
    domain: 'food_and_drinks',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 217,
    courseModuleId: 'A1.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'food_table_display',
    pedagogicalNotesEn:
      'Essential A1 dining noun (#217 in FREQ_6000_DB); omitted from IDENTIFY_MASTER_2000_NOUNS.',
  },
  {
    uk: 'чай',
    en: 'tea',
    domain: 'food_and_drinks',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 209,
    courseModuleId: 'A0.2',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'food_table_display',
    pedagogicalNotesEn:
      'Essential A0/A1 beverage (#209 in FREQ_6000_DB); omitted even though ка́ва (cf-coffee) and ча́йник (k-kettle) are present.',
  },
  {
    uk: 'сік',
    en: 'juice',
    domain: 'food_and_drinks',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 1406,
    courseModuleId: 'A1.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'food_table_display',
    pedagogicalNotesEn:
      'Core A1 beverage noun (#1406 in FREQ_6000_DB); omitted from the 2,000-noun registry.',
  },
  {
    uk: 'рис',
    en: 'rice',
    domain: 'food_and_drinks',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 1561,
    courseModuleId: 'A1.2',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'food_table_display',
    pedagogicalNotesEn:
      'Core everyday grain/side dish (#1561 in FREQ_6000_DB); omitted from IDENTIFY_MASTER_2000_NOUNS.',
  },
  {
    uk: 'капу́ста',
    en: 'cabbage',
    domain: 'food_and_drinks',
    gapClassification: 'present_only_as_modifier_padded_or_slash_compound',
    instructionalSeqRankInFreq6000Db: 1563,
    courseModuleId: 'A1.2',
    existingMasterVocabularyIdIfPresent: 'id-v2-445',
    existingMasterUkIfPresent: 'капу́ста білокача́нна',
    recommendedVisualFraming: 'market_counter_display',
    pedagogicalNotesEn:
      'Present in IDENTIFY_MASTER_2000_NOUNS only as botanical modifier phrase "капу́ста білокача́нна" (id-v2-445); should be normalized to base noun капу́ста.',
  },

  // 5. Home & Furniture
  {
    uk: 'стіна́',
    en: 'wall',
    domain: 'home_and_furniture',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 1596,
    courseModuleId: 'A1.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'full_room_scene',
    pedagogicalNotesEn:
      'Fundamental room-structure noun (#1596 in FREQ_6000_DB); omitted from the 2,000-noun registry.',
  },
  {
    uk: 'підло́га',
    en: 'floor',
    domain: 'home_and_furniture',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 700,
    courseModuleId: 'A1.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'full_room_scene',
    pedagogicalNotesEn:
      'Core A1 interior noun (#700 in FREQ_6000_DB); omitted from IDENTIFY_MASTER_2000_NOUNS.',
  },
  {
    uk: 'сте́ля',
    en: 'ceiling',
    domain: 'home_and_furniture',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 701,
    courseModuleId: 'A1.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'full_room_scene',
    pedagogicalNotesEn:
      'Core A1 interior noun (#701 in FREQ_6000_DB); omitted from IDENTIFY_MASTER_2000_NOUNS.',
  },

  // 6. Personal Belongings
  {
    uk: 'су́мка',
    en: 'bag / handbag',
    domain: 'personal_belongings',
    gapClassification: 'present_only_as_modifier_padded_or_slash_compound',
    instructionalSeqRankInFreq6000Db: 243,
    courseModuleId: 'A1.1',
    existingMasterVocabularyIdIfPresent: 'id-v2-870',
    existingMasterUkIfPresent: 'су́мка жіно́ча',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    pedagogicalNotesEn:
      'High-frequency A1 noun (#243 in FREQ_6000_DB) present only in modifier-padded form "су́мка жіно́ча" (id-v2-870).',
  },
  {
    uk: 'окуля́ри',
    en: 'glasses / spectacles',
    domain: 'personal_belongings',
    gapClassification: 'present_only_as_modifier_padded_or_slash_compound',
    instructionalSeqRankInFreq6000Db: 354,
    courseModuleId: 'A1.2',
    existingMasterVocabularyIdIfPresent: 'id-v2-862',
    existingMasterUkIfPresent: 'окуля́ри для зо́ру',
    recommendedVisualFraming: 'close_up_detail',
    pedagogicalNotesEn:
      'Core A1 noun (#354 in FREQ_6000_DB) present only as modifier phrases "окуля́ри для зо́ру" (id-v2-862) and "со́нцезахисні́ окуля́ри" (id-v2-863).',
  },
  {
    uk: 'гро́ші',
    en: 'money / cash',
    domain: 'personal_belongings',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 139,
    courseModuleId: 'A0.2',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'close_up_detail',
    pedagogicalNotesEn:
      'Essential A0/A1 shopping/wallet noun (#139 in FREQ_6000_DB); omitted (only готі́вка id-v2-647 and моне́та id-v2-649 are present).',
  },

  // 7. Transportation
  {
    uk: 'вокза́л',
    en: 'train station',
    domain: 'transportation',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 286,
    courseModuleId: 'A1.2',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'street_urban_scene',
    pedagogicalNotesEn:
      'Essential A1 travel landmark (#286 in FREQ_6000_DB); omitted as a target noun (only перо́н at-platform is present).',
  },
  {
    uk: 'аеропо́рт',
    en: 'airport',
    domain: 'transportation',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 287,
    courseModuleId: 'A1.2',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'public_service_environment',
    pedagogicalNotesEn:
      'Essential A1 travel noun (#287 in FREQ_6000_DB); used as a scene category title but omitted from the 2,000 target nouns.',
  },
  {
    uk: 'корабе́ль',
    en: 'ship',
    domain: 'transportation',
    gapClassification: 'present_only_as_modifier_padded_or_slash_compound',
    instructionalSeqRankInFreq6000Db: 887,
    courseModuleId: 'A2.1',
    existingMasterVocabularyIdIfPresent: 'id-v2-1403',
    existingMasterUkIfPresent: 'корабе́ль / теплохі́д',
    recommendedVisualFraming: 'outdoor_nature_scene',
    pedagogicalNotesEn:
      'Present only as slash-compound "корабе́ль / теплохі́д" (id-v2-1403).',
  },

  // 8. City Infrastructure
  {
    uk: 'ву́лиця',
    en: 'street',
    domain: 'city_infrastructure',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 146,
    courseModuleId: 'A0.2',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'street_urban_scene',
    pedagogicalNotesEn:
      'Foundational A0/A1 urban noun (#146 in FREQ_6000_DB); omitted from IDENTIFY_MASTER_2000_NOUNS.',
  },
  {
    uk: 'пло́ща',
    en: 'city square / plaza',
    domain: 'city_infrastructure',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 290,
    courseModuleId: 'A1.2',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'street_urban_scene',
    pedagogicalNotesEn:
      'Core A1 urban navigation noun (#290 in FREQ_6000_DB); omitted from IDENTIFY_MASTER_2000_NOUNS.',
  },
  {
    uk: 'по́шта',
    en: 'post office',
    domain: 'city_infrastructure',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 1605,
    courseModuleId: 'A1.2',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'public_service_environment',
    pedagogicalNotesEn:
      'Core civic service noun (#1605 in FREQ_6000_DB); omitted even though поси́лка (id-v2-633) and листоно́ша (id-v2-1484) are included.',
  },

  // 9. Shopping
  {
    uk: 'магази́н',
    en: 'store / shop',
    domain: 'shopping',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 236,
    courseModuleId: 'A1.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'street_urban_scene',
    pedagogicalNotesEn:
      'Core A1 shopping noun (#236 in FREQ_6000_DB); omitted as a target noun in street/shopping scenes.',
  },
  {
    uk: 'чек',
    en: 'receipt',
    domain: 'shopping',
    gapClassification: 'present_only_as_modifier_padded_or_slash_compound',
    instructionalSeqRankInFreq6000Db: null,
    courseModuleId: 'A1.2',
    existingMasterVocabularyIdIfPresent: 'id-v2-646',
    existingMasterUkIfPresent: 'чек ка́совий',
    recommendedVisualFraming: 'close_up_detail',
    pedagogicalNotesEn:
      'Present in IDENTIFY_MASTER_2000_NOUNS only in modifier-padded form "чек ка́совий" (id-v2-646).',
  },

  // 10. Education
  {
    uk: 'шко́ла',
    en: 'school building',
    domain: 'education',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 130,
    courseModuleId: 'A0.2',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'street_urban_scene',
    pedagogicalNotesEn:
      'Foundational A0/A1 education noun (#130 in FREQ_6000_DB); omitted from the 2,000-noun registry.',
  },
  {
    uk: 'університе́т',
    en: 'university building',
    domain: 'education',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 258,
    courseModuleId: 'A1.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'street_urban_scene',
    pedagogicalNotesEn:
      'Essential A1 education landmark (#258 in FREQ_6000_DB); omitted from the 2,000-noun registry.',
  },

  // 11. Work
  {
    uk: 'інжене́р',
    en: 'engineer',
    domain: 'work',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 1451,
    courseModuleId: 'A1.2',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'public_service_environment',
    pedagogicalNotesEn:
      'High-utility profession noun (#1451 in FREQ_6000_DB; visually distinct with hard hat and blueprints); omitted while niche дириге́нт was included.',
  },
  {
    uk: 'програмі́ст',
    en: 'software developer / programmer',
    domain: 'work',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 1452,
    courseModuleId: 'A1.2',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'public_service_environment',
    pedagogicalNotesEn:
      'High-utility modern profession noun (#1452 in FREQ_6000_DB); omitted from IDENTIFY_MASTER_2000_NOUNS.',
  },
  {
    uk: 'папі́р',
    en: 'paper',
    domain: 'work',
    gapClassification: 'present_only_as_modifier_padded_or_slash_compound',
    instructionalSeqRankInFreq6000Db: 249,
    courseModuleId: 'A1.1',
    existingMasterVocabularyIdIfPresent: 'id-v2-1996',
    existingMasterUkIfPresent: 'папі́р акваре́льний факту́рний',
    recommendedVisualFraming: 'close_up_detail',
    pedagogicalNotesEn:
      'Core A1 office/school noun (#249 in FREQ_6000_DB) present only as absurdly over-specified "папі́р акваре́льний факту́рний" (textured watercolor paper, id-v2-1996).',
  },

  // 12. Health
  {
    uk: 'ліка́рня',
    en: 'hospital',
    domain: 'health',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 262,
    courseModuleId: 'A1.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'street_urban_scene',
    pedagogicalNotesEn:
      'Core A1 health landmark (#262 in FREQ_6000_DB); omitted even though апте́ка (hp-pharmacy) is present.',
  },
  {
    uk: 'паціє́нт',
    en: 'patient',
    domain: 'health',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 2092,
    courseModuleId: 'A2.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'public_service_environment',
    pedagogicalNotesEn:
      'Essential hospital/clinic role noun (#2092 in FREQ_6000_DB) pairing naturally with лі́кар (hp-doctor) and медсестра́ (hp-nurse).',
  },
  {
    uk: 'табле́тка',
    en: 'pill / tablet',
    domain: 'health',
    gapClassification: 'present_under_synonym_or_different_id',
    instructionalSeqRankInFreq6000Db: 1714,
    courseModuleId: 'A2.1',
    existingMasterVocabularyIdIfPresent: 'id-v2-1010',
    existingMasterUkIfPresent: 'пігу́лки',
    recommendedVisualFraming: 'close_up_detail',
    pedagogicalNotesEn:
      'Represented in IDENTIFY_MASTER_2000_NOUNS under the plural synonym пігу́лки (id-v2-1010); should be cross-linked as a synonym rather than duplicated.',
  },

  // 13. Everyday Nature
  {
    uk: 'не́бо',
    en: 'sky',
    domain: 'everyday_nature',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 304,
    courseModuleId: 'A1.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'outdoor_nature_scene',
    pedagogicalNotesEn:
      'Foundational A1 nature noun (#304 in FREQ_6000_DB); omitted even though со́нце, мі́сяць, зі́рка, and хма́ра are present.',
  },
  {
    uk: 'ліс',
    en: 'forest / woods',
    domain: 'everyday_nature',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: 310,
    courseModuleId: 'A1.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'outdoor_nature_scene',
    pedagogicalNotesEn:
      'Foundational A1 nature noun (#310 in FREQ_6000_DB); omitted while poetic дібро́ва (oak grove, id-v2-1536) was included.',
  },
  {
    uk: 'соба́ка',
    en: 'dog',
    domain: 'everyday_nature',
    gapClassification: 'present_only_as_modifier_padded_or_slash_compound',
    instructionalSeqRankInFreq6000Db: 317,
    courseModuleId: 'A0.2',
    existingMasterVocabularyIdIfPresent: 'id-v2-960',
    existingMasterUkIfPresent: 'соба́ка / пес',
    recommendedVisualFraming: 'outdoor_nature_scene',
    pedagogicalNotesEn:
      'Present in IDENTIFY_MASTER_2000_NOUNS only as the slash-compound "соба́ка / пес" (id-v2-960).',
  },
  {
    uk: 'кіт',
    en: 'cat',
    domain: 'everyday_nature',
    gapClassification: 'present_only_as_modifier_padded_or_slash_compound',
    instructionalSeqRankInFreq6000Db: 318,
    courseModuleId: 'A0.1',
    existingMasterVocabularyIdIfPresent: 'id-v2-961',
    existingMasterUkIfPresent: 'кіт / кі́шка',
    recommendedVisualFraming: 'full_room_scene',
    pedagogicalNotesEn:
      'Present in IDENTIFY_MASTER_2000_NOUNS only as the slash-compound "кіт / кі́шка" (id-v2-961).',
  },
];

export function getIdentifyVocabularyCoverageGapReport(): IdentifyVocabularyCoverageGapReport {
  const genuineOmissionsCount = IDENTIFY_VOCABULARY_COVERAGE_GAP_ENTRIES.filter(
    (e) => e.gapClassification === 'genuine_omission_from_2000_registry'
  ).length;
  const modifierOrCompoundOnlyMatchesCount =
    IDENTIFY_VOCABULARY_COVERAGE_GAP_ENTRIES.filter(
      (e) => e.gapClassification === 'present_only_as_modifier_padded_or_slash_compound'
    ).length;
  const synonymOrDifferentIdMatchesCount =
    IDENTIFY_VOCABULARY_COVERAGE_GAP_ENTRIES.filter(
      (e) => e.gapClassification === 'present_under_synonym_or_different_id'
    ).length;

  return {
    auditVersion: '2.0.0-batch2',
    totalDomainsAudited: 13,
    genuineOmissionsCount,
    modifierOrCompoundOnlyMatchesCount,
    synonymOrDifferentIdMatchesCount,
    entries: IDENTIFY_VOCABULARY_COVERAGE_GAP_ENTRIES,
    summaryFindingsEn: [
      `1. Audited all 13 everyday domains against FREQ_6000_DB and COURSE_MODULES without mutating IDENTIFY_MASTER_2000_NOUNS.`,
      `2. Found ${genuineOmissionsCount} high-value A0–A2 concrete nouns genuinely omitted from IDENTIFY_MASTER_2000_NOUNS (including ма́ма #135, ба́тько #134, син #272, дочка́ #273, хло́пець #270, ді́вчина #271, вода́ #111, чай #209, ма́сло #213, м’я́со #215, суп #217, сік #1406, рис #1561, підло́га #700, сте́ля #701, стіна́ #1596, взуття́ #349, гро́ші #139, вокза́л #286, аеропо́рт #287, ву́лиця #146, пло́ща #290, по́шта #1605, магази́н #236, шко́ла #130, університе́т #258, інжене́р #1451, програмі́ст #1452, ліка́рня #262, паціє́нт #2092, не́бо #304, ліс #310).`,
      `3. Found ${modifierOrCompoundOnlyMatchesCount} essential everyday nouns that exist in IDENTIFY_MASTER_2000_NOUNS only as slash-compounds or modifier-padded phrases (e.g., рука́ as "рука́ / кисть" id-v2-1033, штани́ as "штани́ / брю́ки" id-v2-828, соба́ка as "соба́ка / пес" id-v2-960, кіт as "кіт / кі́шка" id-v2-961, су́мка as "су́мка жіно́ча" id-v2-870, окуля́ри as "окуля́ри для зо́ру" id-v2-862, капу́ста as "капу́ста білокача́нна" id-v2-445, and папі́р as "папі́р акваре́льний факту́рний" id-v2-1996).`,
      `4. Found ${synonymOrDifferentIdMatchesCount} case where a common noun is already represented under a valid Ukrainian synonym (табле́тка -> пігу́лки id-v2-1010) and therefore should not be duplicated.`,
    ],
  };
}
