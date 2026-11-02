/**
 * LANGO IDENTIFY — PHASE 1, BATCH 3 CURATION DATA (CANDIDATES 401..600)
 *
 * Contains:
 * 1. Explicit per-candidate assessments and visual framing recommendations for Batch 3 candidates.
 * 2. Structured Duplicate, Inflected-Plural, Calque & Modifier-Padded Resolution records for Batch 3.
 * 3. Batch 3 additions to the Missing-Vocabulary Gap Report (household, kitchenware, and everyday electronics).
 */

import type {
  IdentifyCurriculumPriorityLevel,
  IdentifyCurationRecommendation,
  IdentifyCandidateIssueFlag,
} from './identifyCurriculumCurationPhase1.ts';
import type {
  IdentifyVisualSceneFraming,
  Batch2ManualAssessment,
  IdentifyMissingVocabularyGapEntry,
} from './identifyCurriculumCurationPhase1Batch2.ts';

export type Batch3ManualAssessment = Batch2ManualAssessment;

export interface IdentifyBatch3DuplicateAndSenseRecord {
  batchNumber: 3;
  candidateVocabularyId: string;
  candidateConceptId: string;
  candidateUk: string;
  candidateEn: string;
  canonicalConceptId: string;
  canonicalVocabularyId: string;
  canonicalUk: string;
  canonicalEn: string;
  relationshipType:
    | 'modifier_padded_duplicate_of_prior_batch'
    | 'modifier_padded_duplicate_within_batch3'
    | 'inflected_plural_duplicate_within_batch3'
    | 'calque_or_synonym_duplicate_within_batch3'
    | 'compositional_phrase_duplicate'
    | 'polysemy_sense_disambiguated';
  recommendedCanonicalEntry: string;
  curationActionOnBatch3Candidate: IdentifyCurationRecommendation;
  reasonEn: string;
}

// ----------------------------------------------------------------------------
// 1. Explicit Assessments for Batch 3 Candidates (38 EXCLUDE, 30 REVIEW, and notable KEEP overrides)
// ----------------------------------------------------------------------------

export const EXPLICIT_BATCH_3_ASSESSMENTS: Record<string, Batch3ManualAssessment> = {
  // === TOP VERIFIED-EVIDENCE KEEP CANDIDATES IN BATCH 3 ===
  'id-v2-245': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['kitchen', 'office', 'city-streets', 'park-garden'],
    recommendation: 'keep',
    rationaleEn:
      'смітни́к (trash can / wastebasket, FREQ_6000_DB #1222) is an essential everyday household and urban object.',
  },
  'id-v2-858': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['clothing-store', 'bedroom', 'hallway-entry'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'бли́скавка (застібка) (zipper fastener, FREQ_6000_DB #1237) preserves explicit sense disambiguation from meteorological lightning (id-v2-936).',
  },
  'id-v2-935': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'beach-nature'],
    recommendation: 'keep',
    rationaleEn:
      'весе́лка (rainbow, FREQ_6000_DB #1239) is a visually unmistakable sky phenomenon taught in A1/A2 weather and nature lessons.',
  },
  'id-v2-722': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'airport-train', 'hotel'],
    recommendation: 'keep',
    rationaleEn:
      'бага́жник (car trunk / boot, FREQ_6000_DB #1246) is the canonical base noun for vehicle luggage storage (superseding id-v2-1838).',
  },
  'id-v2-258': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living-room', 'bedroom', 'kitchen', 'classroom'],
    recommendation: 'keep',
    rationaleEn:
      'підвіко́ння (windowsill, FREQ_6000_DB #1247) is a staple interior noun across apartment and classroom scenes (superseding id-v2-1752).',
  },
  'id-v2-1486': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['clothing-store', 'tailor-atelier'],
    recommendation: 'keep',
    rationaleEn:
      'краве́ць (tailor, FREQ_6000_DB #1250) is a recognizable service profession in clothing/atelier scenes.',
  },
  'id-v2-804': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['cafe', 'supermarket', 'farmers-market'],
    recommendation: 'keep',
    rationaleEn:
      'пе́кар (baker, FREQ_6000_DB #1253) is a high-utility everyday food-service profession.',
  },
  'id-v2-572': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['dining-room', 'cafe', 'restaurant', 'kitchen'],
    recommendation: 'keep',
    rationaleEn:
      'нали́сники (thin filled crepes, FREQ_6000_DB #1399) are a staple Ukrainian breakfast and café dish.',
  },

  // === EXPLICIT REVIEW CANDIDATES IN BATCH 3 (30 ITEMS) ===
  'id-v2-530': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'dining-room', 'cafe'],
    recommendation: 'review',
    rationaleEn:
      'гірчи́ця (mustard, FREQ_6000_DB #1398) is a common condiment, but requires a distinct yellow mustard jar or squeeze bottle beside sausages/cutlets to be visually unambiguous.',
  },
  'id-v2-1762': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['bedroom', 'clothing-store'],
    recommendation: 'review',
    rationaleEn:
      'відпа́рювач для о́дягу (garment steamer) requires visible steam and a hanging garment to avoid confusion with a handheld scanner or clothes iron (пра́ска).',
  },
  'id-v2-316': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'review',
    rationaleEn:
      'ва́тна па́личка (cotton swab) is the canonical singular form (superseding plural id-v2-1771), but is very small and requires a close-up bathroom vanity organizer view.',
  },
  'id-v2-358': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['home-workshop'],
    recommendation: 'review',
    rationaleEn:
      'шурупове́рт (cordless screwdriver/driver) is visually very similar to дриль (power drill, id-v2-357, kept in Batch 1); held for review to prevent ambiguous tool pins.',
  },
  'id-v2-1191': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen', 'cafe'],
    recommendation: 'review',
    rationaleEn:
      'ту́рка / дже́зва (copper cezve coffee pot) has a distinctive long-handled silhouette and high cultural usage in Ukraine, but requires headword normalization from the slash-compound label.',
  },
  'id-v2-317': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom', 'bedroom'],
    recommendation: 'review',
    rationaleEn:
      'ва́тний диск (cotton pad) is the canonical singular form (superseding plural id-v2-1772), held in review because it requires close-up vanity framing.',
  },
  'id-v2-1192': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'cafe'],
    recommendation: 'review',
    rationaleEn:
      'френч-пре́с (French press coffee maker) is visually distinct (glass carafe with metal plunger), held in review to balance coffee-equipment density alongside кавова́рка (id-v2-155).',
  },
  'id-v2-255': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living-room', 'bedroom'],
    recommendation: 'review',
    rationaleEn:
      'тюль (sheer window curtain) is ubiquitous in Ukrainian apartments, but shares the window area with што́ра (heavy drape, id-v2-254) and requires non-overlapping pin placement.',
  },
  'id-v2-1765': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'review',
    issueFlags: ['modifier_padded_duplicate'],
    rationaleEn:
      'килимо́к протиковзний (non-slip bath mat) uses an overly technical modifier phrase; held in review to normalize or reconcile with gm-mat (килимо́к).',
  },
  'id-v2-162': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'review',
    rationaleEn:
      'ва́фельниця (waffle iron) is recognizable only when depicted open showing the grid plates and a cooked waffle.',
  },
  'id-v2-383': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden'],
    recommendation: 'review',
    rationaleEn:
      'моти́ка (garden hoe) is recognizable in a garden shed scene, but has lower daily conversational priority than лопа́та (spade, id-v2-381) and граблі́ (rake, id-v2-382).',
  },
  'id-v2-278': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['bedroom', 'living-room'],
    recommendation: 'review',
    rationaleEn:
      'зволо́жувач пові́тря (air humidifier) requires a visible mist plume to be visually distinguishable from a small speaker or diffuser.',
  },
  'id-v2-299': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'review',
    rationaleEn:
      'кондиціоне́р для воло́сся (hair conditioner) is a common daily hygiene product, but its bottle looks identical to шампу́нь (id-v2-298) unless paired with distinct bottle styling.',
  },
  'id-v2-341': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hallway-entry'],
    recommendation: 'review',
    rationaleEn:
      'вічко́ дверне́ (door peephole) is a tiny circular lens in an entry door that requires close-up door framing.',
  },
  'id-v2-1173': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hallway-entry'],
    recommendation: 'review',
    rationaleEn:
      'крем для взуття́ (shoe polish tin) requires close-up placement beside щі́тка для взуття́ (shoe brush, id-v2-1172) to be visually unmistakable.',
  },
  'id-v2-175': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'review',
    rationaleEn:
      'шумі́вка (slotted skimmer spoon) is used for lifting varenyky/pelmeni, held in review to balance utensil density alongside ополо́ник (ladle, id-v2-174).',
  },
  'id-v2-195': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['dining-room', 'restaurant'],
    recommendation: 'review',
    rationaleEn:
      'соусни́к (gravy boat / sauce pitcher) has a distinct pouring-boat shape, held in review as an extended dining-table item.',
  },
  'id-v2-300': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'review',
    rationaleEn:
      'гель для ду́шу (body wash / shower gel) is a daily hygiene item, but visually overlaps with шампу́нь (id-v2-298) in a shower caddy without distinct visual cues.',
  },
  'id-v2-342': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hallway-entry', 'home-workshop'],
    recommendation: 'review',
    rationaleEn:
      'петля́ дверна́ (door hinge) is a small metal hardware component on the edge of a door frame requiring close-up detail.',
  },
  'id-v2-1196': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'review',
    rationaleEn:
      'мі́рна ло́жка (measuring spoon) is a small baking utensil; held in review alongside мі́рна скля́нка (measuring cup, id-v2-1195).',
  },
  'id-v2-182': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'review',
    rationaleEn:
      'часникода́вка (garlic press) is common in Ukrainian kitchens, but requires a close-up countertop view next to garlic (часни́к).',
  },
  'id-v2-1197': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'review',
    rationaleEn:
      'куліна́рний пе́нзлик (pastry basting brush) is a secondary baking tool requiring a close-up baking scene.',
  },
  'id-v2-1219': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['hallway-entry'],
    recommendation: 'review',
    rationaleEn:
      'клю́чниця насті́нна (wall key holder/cabinet) overlaps functionally in hallway scenes with вішак насті́нний (id-v2-1169).',
  },
  'id-v2-323': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'countryside'],
    recommendation: 'review',
    rationaleEn:
      'ринва (rain gutter / downspout) is a recognizable exterior roof drainage pipe, held in review as extended architectural vocabulary.',
  },
  'id-v2-344': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living-room', 'hallway-entry'],
    recommendation: 'review',
    rationaleEn:
      'плінту́с (floor baseboard / skirting board) is a narrow wall-floor trim strip that requires careful non-overlapping hotspot geometry.',
  },
  'id-v2-1770': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'review',
    rationaleEn:
      'осві́жувач пові́тря (air freshener spray) is a common bathroom item, but requires a recognizable aerosol spray can silhouette.',
  },
  'id-v2-303': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'review',
    rationaleEn:
      'ополі́скувач (mouthwash bottle) requires a transparent bottle with mint-blue/green liquid beside зубна́ щі́тка and зубна́ па́ста to be visually unambiguous.',
  },
  'id-v2-1178': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['bathroom', 'laundry'],
    recommendation: 'review',
    rationaleEn:
      'кондиціоне́р для біли́зни (fabric softener bottle) looks similar to liquid laundry detergent unless paired with пра́льний порошо́к (powder detergent box, id-v2-1177).',
  },
  'id-v2-1223': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['kitchen', 'hallway-entry', 'office'],
    recommendation: 'review',
    rationaleEn:
      'датчик ди́му (ceiling smoke detector) is a small ceiling disc that requires clear close-up or ceiling visibility.',
  },
  'id-v2-369': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['home-workshop'],
    recommendation: 'review',
    rationaleEn:
      'болт (hex bolt) requires a close-up hardware bench view showing its hexagonal head and flat tip to distinguish it from шуру́п (wood screw, id-v2-368).',
  },

  // === EXPLICIT EXCLUDE CANDIDATES IN BATCH 3 (38 ITEMS) ===
  'id-v2-531': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen', 'dining-room'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare'],
    rationaleEn:
      'хрін (horseradish, FREQ_6000_DB #1397) has poor visual recognizability (either an indistinct beige root or a small condiment jar).',
  },
  'id-v2-586': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['dining-room'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'hypernym_ambiguous'],
    rationaleEn:
      'кисі́ль (kissel starch berry drink, FREQ_6000_DB #1400) is visually indistinguishable in a cup from berry juice or compote.',
  },
  'id-v2-585': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['cafe', 'supermarket'],
    recommendation: 'exclude',
    issueFlags: ['hypernym_ambiguous'],
    rationaleEn:
      'квас (fermented bread drink, FREQ_6000_DB #1401) looks identical to dark beer, cola, or iced tea in a glass without a printed text label.',
  },
  'id-v2-516': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'hypernym_ambiguous'],
    rationaleEn:
      'пови́дло (plum/apple butter, FREQ_6000_DB #1402) cannot be visually distinguished from jam (варе́ння) in a bowl or jar.',
  },
  'id-v2-1168': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living-room'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'unnatural_scene_filler', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-178',
    canonicalConceptId: 'noun-concept-0188',
    rationaleEn:
      'щипці́ камі́нні (fireplace tongs) is rare hearth equipment (flagged in the project audit alongside кочерга́) and a modifier-padded variant of щипці́ (id-v2-178).',
  },
  'id-v2-1190': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['kitchen', 'office'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-155',
    canonicalConceptId: 'noun-concept-0127',
    rationaleEn:
      'ка́псульна кавомаши́на (pod coffee machine) is a modifier-padded sub-type of canonical кавова́рка (coffee maker, id-v2-155, kept in Batch 3).',
  },
  'id-v2-1213': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['restaurant', 'hotel'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'unnatural_scene_filler'],
    rationaleEn:
      'лідни́ця (champagne ice bucket) is a niche hospitality vessel with low everyday conversational value.',
  },
  'id-v2-1763': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'exclude',
    issueFlags: ['compositional_phrase', 'unnatural_scene_filler'],
    rationaleEn:
      'мішо́к для прання́ (mesh laundry bag) is a compositional phrase and visually indistinct white mesh pouch.',
  },
  'id-v2-338': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hallway-entry'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'noun-zamok-lock',
    canonicalConceptId: 'noun-concept-0004',
    rationaleEn:
      'замо́к дверни́й (id-v2-338) is an exact duplicate of Batch 1 kept canonical noun-zamok-lock (замо́к (дверни́й), noun-concept-0004).',
  },
  'id-v2-1214': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['bedroom'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'unnatural_scene_filler'],
    duplicateOfVocabularyId: 'id-v2-198',
    canonicalConceptId: 'noun-concept-0239',
    rationaleEn:
      'підно́с сніданко́вий (breakfast bed tray) is a modifier-padded duplicate of Batch 2 kept canonical та́ця (serving tray, id-v2-198, #1112).',
  },
  'id-v2-1764': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept', 'unnatural_scene_filler'],
    duplicateOfVocabularyId: 'id-v2-1166',
    rationaleEn:
      'щі́тка для уніта́за (йоржик) duplicates id-v2-1166 (йоржик для уніта́зу), which was already excluded in Batch 1 as inappropriate bathroom filler.',
  },
  'id-v2-360': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['home-workshop'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'електроло́бзик (power jigsaw) is a specialist woodworking tool outside the 1,200 everyday vocabulary target.',
  },
  'id-v2-1193': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'unnatural_scene_filler'],
    rationaleEn:
      'заварни́к-сите́чко (tea infuser ball) is a tiny kitchen gadget redundant alongside си́то (sieve, id-v2-170) and ча́йник (teapot/kettle, k-kettle).',
  },
  'id-v2-1215': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['bedroom'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'unnatural_scene_filler'],
    rationaleEn:
      'балдахі́н (four-poster bed canopy) is a rare palace/nursery fixture rather than an everyday Ukrainian bedroom object.',
  },
  'id-v2-361': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['home-workshop'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'руба́нок (carpenter hand plane) is a specialist woodworking tool with low daily communicative utility.',
  },
  'id-v2-1766': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-297',
    canonicalConceptId: 'noun-concept-0137',
    rationaleEn:
      'ми́льниця керамі́чна (ceramic soap dish) is a modifier-padded duplicate of canonical ми́льниця (soap dish, id-v2-297, kept in Batch 3).',
  },
  'id-v2-362': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['home-workshop'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'стаме́ска (wood chisel) is a specialist carpentry tool outside core everyday vocabulary.',
  },
  'id-v2-1217': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['bedroom', 'living-room'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'unnatural_scene_filler'],
    rationaleEn:
      'ши́рма кімна́тна (folding room screen) is a rare interior fixture used as artificial scene filler.',
  },
  'id-v2-1767': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'exclude',
    issueFlags: ['compositional_phrase', 'modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'dr-glass',
    canonicalConceptId: 'noun-concept-0071',
    rationaleEn:
      'скля́нка для зубни́х щіто́к (toothbrush tumbler cup) is a multi-word compositional phrase combining скля́нка (dr-glass, noun-concept-0071) and зубна́ щі́тка (ba-toothbrush).',
  },
  'id-v2-237': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living-room'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-236',
    canonicalConceptId: 'noun-concept-0172',
    rationaleEn:
      'ро́бот-пилосо́с (robot vacuum) is a compound sub-type of canonical пилосо́с (vacuum cleaner, id-v2-236, #706, already kept in Batch 2).',
  },
  'id-v2-363': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['home-workshop'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'напи́лок (metalworking file) is a specialist workshop tool outside the 1,200 everyday vocabulary target.',
  },
  'id-v2-364': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['home-workshop'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'нажда́чний папі́р (sandpaper) has poor visual recognizability in a scene and low everyday communicative priority.',
  },
  'id-v2-197': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['dining-room'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'unnatural_scene_filler'],
    rationaleEn:
      'супни́ця (formal soup tureen) is a rare banquet vessel; everyday soup is served in a bowl (ми́ска, k-bowl) or pot (кастру́ля, k-pot).',
  },
  'id-v2-1198': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'конди́терський мішо́к (pastry piping bag) is a specialist confectionery tool outside everyday 1,200-noun needs.',
  },
  'id-v2-1220': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['hallway-entry'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'лічи́льник електроене́ргії (electric utility meter box) is technical utility infrastructure used as artificial scene filler.',
  },
  'id-v2-240': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['kitchen', 'hallway-entry'],
    recommendation: 'exclude',
    issueFlags: ['compositional_phrase', 'duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-239',
    canonicalConceptId: 'noun-concept-0226',
    rationaleEn:
      'щі́тка для підло́ги (push broom) is a compositional phrase duplicating canonical ві́ник (broom, id-v2-239) and шва́бра (mop, id-v2-238).',
  },
  'id-v2-366': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['home-workshop'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'рі́вень будіве́льний (construction spirit level) is a specialist building tool outside core everyday vocabulary.',
  },
  'id-v2-1199': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'unnatural_scene_filler'],
    rationaleEn:
      'фо́рмочка для пе́чива (cookie cutter) is a small niche baking accessory with low daily conversational priority.',
  },
  'id-v2-1221': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['hallway-entry'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'електрощито́к (electrical circuit breaker panel) is technical building hardware rather than everyday conversational vocabulary.',
  },
  'id-v2-1771': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'exclude',
    issueFlags: ['inflected_plural_duplicate'],
    duplicateOfVocabularyId: 'id-v2-316',
    canonicalConceptId: 'noun-concept-0098',
    rationaleEn:
      'ва́тні па́лички (id-v2-1771) is an inflected plural duplicate of id-v2-316 (ва́тна па́личка, noun-concept-0098) in the same batch.',
  },
  'id-v2-1772': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'exclude',
    issueFlags: ['inflected_plural_duplicate'],
    duplicateOfVocabularyId: 'id-v2-317',
    canonicalConceptId: 'noun-concept-0117',
    rationaleEn:
      'ва́тні ди́ски (id-v2-1772) is an inflected plural duplicate of id-v2-317 (ва́тний диск, noun-concept-0117) in the same batch.',
  },
  'id-v2-1157': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living-room'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-222',
    canonicalConceptId: 'noun-concept-0294',
    rationaleEn:
      'каво́вий сто́лик (id-v2-1157) is an English calque duplicating the idiomatic Ukrainian term журна́льний сто́лик (coffee table, id-v2-222, kept in Batch 3).',
  },
  'id-v2-1179': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen', 'bathroom'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-852',
    canonicalConceptId: 'noun-concept-1276',
    rationaleEn:
      'гумові рукави́чки (rubber cleaning gloves) is a modifier-padded duplicate of canonical рукави́чки (gloves, id-v2-852, kept in Batch 2).',
  },
  'id-v2-1201': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['kitchen'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'unnatural_scene_filler'],
    rationaleEn:
      'горіхоко́л (nutcracker tool) is a niche seasonal kitchen gadget outside the 1,200 everyday vocabulary target.',
  },
  'id-v2-1773': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'id-v2-301',
    canonicalConceptId: 'noun-concept-0214',
    rationaleEn:
      'моча́лка ба́нна (bath loofah sponge, id-v2-1773) is a modifier-padded duplicate of canonical моча́лка (id-v2-301, kept in Batch 3).',
  },
  'id-v2-348': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living-room'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate', 'obscure_or_rare'],
    duplicateOfVocabularyId: 'id-v2-257',
    canonicalConceptId: 'noun-concept-0173',
    rationaleEn:
      'карни́з стельови́й (crown molding, id-v2-348) is an architectural trim modifier phrase duplicating headword карни́з (curtain rod / cornice, id-v2-257, kept in Batch 3).',
  },
  'id-v2-1158': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'food_table_display',
    candidateSceneCategories: ['dining-room', 'restaurant'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'dr-napkin',
    canonicalConceptId: 'noun-concept-0107',
    rationaleEn:
      'серве́тка тканинна (cloth napkin, id-v2-1158) is a modifier-padded duplicate of Batch 1 kept canonical dr-napkin (серве́тка, noun-concept-0107).',
  },
  'id-v2-1180': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom', 'living-room'],
    recommendation: 'exclude',
    issueFlags: ['compositional_phrase', 'unnatural_scene_filler'],
    rationaleEn:
      'скребо́к для ві́кон (window squeegee) is a niche compositional cleaning tool phrase outside the 1,200 everyday vocabulary target.',
  },
};

// ----------------------------------------------------------------------------
// 2. Structured Duplicate, Inflected-Plural & Calque Resolution Records (Batch 3)
// ----------------------------------------------------------------------------

export const IDENTIFY_BATCH_3_DUPLICATE_AND_SENSE_RECORDS: readonly IdentifyBatch3DuplicateAndSenseRecord[] = [
  {
    batchNumber: 3,
    candidateVocabularyId: 'id-v2-338',
    candidateConceptId: 'noun-concept-0118',
    candidateUk: 'замо́к дверни́й',
    candidateEn: 'door lock',
    canonicalConceptId: 'noun-concept-0004',
    canonicalVocabularyId: 'noun-zamok-lock',
    canonicalUk: 'замо́к (дверни́й)',
    canonicalEn: 'door lock / padlock',
    relationshipType: 'modifier_padded_duplicate_of_prior_batch',
    recommendedCanonicalEntry: 'noun-zamok-lock (замо́к)',
    curationActionOnBatch3Candidate: 'exclude',
    reasonEn:
      'Duplicates Batch 1 accepted canonical noun-zamok-lock (noun-concept-0004); excluded so "door lock" is counted only once.',
  },
  {
    batchNumber: 3,
    candidateVocabularyId: 'id-v2-1158',
    candidateConceptId: 'noun-concept-0303',
    candidateUk: 'серве́тка тканинна',
    candidateEn: 'cloth napkin',
    canonicalConceptId: 'noun-concept-0107',
    canonicalVocabularyId: 'dr-napkin',
    canonicalUk: 'серве́тка',
    canonicalEn: 'napkin',
    relationshipType: 'modifier_padded_duplicate_of_prior_batch',
    recommendedCanonicalEntry: 'dr-napkin (серве́тка)',
    curationActionOnBatch3Candidate: 'exclude',
    reasonEn:
      'Modifier-padded variant of Batch 1 accepted dr-napkin (серве́тка, noun-concept-0107).',
  },
  {
    batchNumber: 3,
    candidateVocabularyId: 'id-v2-1214',
    candidateConceptId: 'noun-concept-0124',
    candidateUk: 'підно́с сніданко́вий',
    candidateEn: 'bed tray',
    canonicalConceptId: 'noun-concept-0239',
    canonicalVocabularyId: 'id-v2-198',
    canonicalUk: 'та́ця',
    canonicalEn: 'serving tray',
    relationshipType: 'modifier_padded_duplicate_of_prior_batch',
    recommendedCanonicalEntry: 'id-v2-198 (та́ця)',
    curationActionOnBatch3Candidate: 'exclude',
    reasonEn:
      'Modifier-padded variant of Batch 2 accepted canonical та́ця (serving tray, id-v2-198, FREQ_6000_DB #1112).',
  },
  {
    batchNumber: 3,
    candidateVocabularyId: 'id-v2-237',
    candidateConceptId: 'noun-concept-0194',
    candidateUk: 'ро́бот-пилосо́с',
    candidateEn: 'robot vacuum',
    canonicalConceptId: 'noun-concept-0172',
    canonicalVocabularyId: 'id-v2-236',
    canonicalUk: 'пилосо́с',
    canonicalEn: 'vacuum cleaner',
    relationshipType: 'modifier_padded_duplicate_of_prior_batch',
    recommendedCanonicalEntry: 'id-v2-236 (пилосо́с)',
    curationActionOnBatch3Candidate: 'exclude',
    reasonEn:
      'Sub-type of Batch 2 accepted canonical пилосо́с (vacuum cleaner, id-v2-236, FREQ_6000_DB #706).',
  },
  {
    batchNumber: 3,
    candidateVocabularyId: 'id-v2-1179',
    candidateConceptId: 'noun-concept-0286',
    candidateUk: 'гумові рукави́чки',
    candidateEn: 'rubber cleaning gloves',
    canonicalConceptId: 'noun-concept-1276',
    canonicalVocabularyId: 'id-v2-852',
    canonicalUk: 'рукави́чки',
    canonicalEn: 'gloves',
    relationshipType: 'modifier_padded_duplicate_of_prior_batch',
    recommendedCanonicalEntry: 'id-v2-852 (рукави́чки)',
    curationActionOnBatch3Candidate: 'exclude',
    reasonEn:
      'Modifier-padded variant of Batch 2 accepted canonical рукави́чки (gloves, id-v2-852, FREQ_6000_DB #1700).',
  },
  {
    batchNumber: 3,
    candidateVocabularyId: 'id-v2-1766',
    candidateConceptId: 'noun-concept-0166',
    candidateUk: 'ми́льниця керамі́чна',
    candidateEn: 'soap dish',
    canonicalConceptId: 'noun-concept-0137',
    canonicalVocabularyId: 'id-v2-297',
    canonicalUk: 'ми́льниця',
    canonicalEn: 'soap dish',
    relationshipType: 'modifier_padded_duplicate_within_batch3',
    recommendedCanonicalEntry: 'id-v2-297 (ми́льниця)',
    curationActionOnBatch3Candidate: 'exclude',
    reasonEn:
      'Modifier-padded duplicate of canonical ми́льниця (id-v2-297, kept in Batch 3).',
  },
  {
    batchNumber: 3,
    candidateVocabularyId: 'id-v2-1773',
    candidateConceptId: 'noun-concept-0289',
    candidateUk: 'моча́лка ба́нна',
    candidateEn: 'bath loofah sponge',
    canonicalConceptId: 'noun-concept-0214',
    canonicalVocabularyId: 'id-v2-301',
    canonicalUk: 'моча́лка',
    canonicalEn: 'bath sponge / loofah',
    relationshipType: 'modifier_padded_duplicate_within_batch3',
    recommendedCanonicalEntry: 'id-v2-301 (моча́лка)',
    curationActionOnBatch3Candidate: 'exclude',
    reasonEn:
      'Modifier-padded duplicate of canonical моча́лка (id-v2-301, kept in Batch 3).',
  },
  {
    batchNumber: 3,
    candidateVocabularyId: 'id-v2-1190',
    candidateConceptId: 'noun-concept-0085',
    candidateUk: 'ка́псульна кавомаши́на',
    candidateEn: 'pod coffee machine',
    canonicalConceptId: 'noun-concept-0127',
    canonicalVocabularyId: 'id-v2-155',
    canonicalUk: 'кавова́рка',
    canonicalEn: 'coffee maker',
    relationshipType: 'modifier_padded_duplicate_within_batch3',
    recommendedCanonicalEntry: 'id-v2-155 (кавова́рка)',
    curationActionOnBatch3Candidate: 'exclude',
    reasonEn:
      'Modifier-padded sub-type of canonical кавова́рка (id-v2-155, kept in Batch 3).',
  },
  {
    batchNumber: 3,
    candidateVocabularyId: 'id-v2-1771',
    candidateConceptId: 'noun-concept-0255',
    candidateUk: 'ва́тні па́лички',
    candidateEn: 'cotton swabs',
    canonicalConceptId: 'noun-concept-0098',
    canonicalVocabularyId: 'id-v2-316',
    canonicalUk: 'ва́тна па́личка',
    canonicalEn: 'cotton swab',
    relationshipType: 'inflected_plural_duplicate_within_batch3',
    recommendedCanonicalEntry: 'id-v2-316 (ва́тна па́личка)',
    curationActionOnBatch3Candidate: 'exclude',
    reasonEn:
      'Inflected nominative plural of id-v2-316 (ва́тна па́личка) entered as a separate concept ID in the legacy 2,000-noun list.',
  },
  {
    batchNumber: 3,
    candidateVocabularyId: 'id-v2-1772',
    candidateConceptId: 'noun-concept-0272',
    candidateUk: 'ва́тні ди́ски',
    candidateEn: 'cotton makeup pads',
    canonicalConceptId: 'noun-concept-0117',
    canonicalVocabularyId: 'id-v2-317',
    canonicalUk: 'ва́тний диск',
    canonicalEn: 'cotton pad',
    relationshipType: 'inflected_plural_duplicate_within_batch3',
    recommendedCanonicalEntry: 'id-v2-317 (ва́тний диск)',
    curationActionOnBatch3Candidate: 'exclude',
    reasonEn:
      'Inflected nominative plural of id-v2-317 (ва́тний диск) entered as a separate concept ID in the legacy 2,000-noun list.',
  },
  {
    batchNumber: 3,
    candidateVocabularyId: 'id-v2-1157',
    candidateConceptId: 'noun-concept-0285',
    candidateUk: 'каво́вий сто́лик',
    candidateEn: 'side table',
    canonicalConceptId: 'noun-concept-0294',
    canonicalVocabularyId: 'id-v2-222',
    canonicalUk: 'журна́льний сто́лик',
    canonicalEn: 'coffee table',
    relationshipType: 'calque_or_synonym_duplicate_within_batch3',
    recommendedCanonicalEntry: 'id-v2-222 (журна́льний сто́лик)',
    curationActionOnBatch3Candidate: 'exclude',
    reasonEn:
      'In Ukrainian, журна́льний сто́лик (id-v2-222) is the standard idiomatic term for a living-room coffee/side table; каво́вий сто́лик (id-v2-1157) is a literal calque.',
  },
  {
    batchNumber: 3,
    candidateVocabularyId: 'id-v2-348',
    candidateConceptId: 'noun-concept-0300',
    candidateUk: 'карни́з стельови́й',
    candidateEn: 'crown molding',
    canonicalConceptId: 'noun-concept-0173',
    canonicalVocabularyId: 'id-v2-257',
    canonicalUk: 'карни́з',
    canonicalEn: 'curtain rod',
    relationshipType: 'modifier_padded_duplicate_within_batch3',
    recommendedCanonicalEntry: 'id-v2-257 (карни́з)',
    curationActionOnBatch3Candidate: 'exclude',
    reasonEn:
      'Modifier-padded architectural phrase duplicating headword карни́з (id-v2-257, kept in Batch 3).',
  },
];

// ----------------------------------------------------------------------------
// 3. Batch 3 Additions to the Missing-Vocabulary Gap Report
// ----------------------------------------------------------------------------

export const IDENTIFY_BATCH_3_NEW_COVERAGE_GAP_ENTRIES: readonly IdentifyMissingVocabularyGapEntry[] = [
  {
    uk: 'сковорі́дка',
    en: 'frying pan / skillet (also пате́льня)',
    domain: 'home_and_furniture',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: null,
    courseModuleId: 'A1.2',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'full_room_scene',
    pedagogicalNotesEn:
      'Essential everyday kitchen cookware (сковорі́дка / пате́льня) completely omitted from IDENTIFY_MASTER_2000_NOUNS, which included кастру́ля (k-pot) and niche гусятниця (id-v2-167) but no frying pan.',
  },
  {
    uk: 'батаре́йка',
    en: 'battery (AA/AAA cell)',
    domain: 'personal_belongings',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: null,
    courseModuleId: 'A2.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'close_up_detail',
    pedagogicalNotesEn:
      'Common everyday household electronics item omitted from the 2,000-noun registry.',
  },
  {
    uk: 'дріт',
    en: 'wire / cord',
    domain: 'home_and_furniture',
    gapClassification: 'genuine_omission_from_2000_registry',
    instructionalSeqRankInFreq6000Db: null,
    courseModuleId: 'A2.1',
    existingMasterVocabularyIdIfPresent: null,
    existingMasterUkIfPresent: null,
    recommendedVisualFraming: 'close_up_detail',
    pedagogicalNotesEn:
      'Everyday Ukrainian word for an electrical wire/cord; omitted from IDENTIFY_MASTER_2000_NOUNS.',
  },
  {
    uk: 'пульт',
    en: 'remote control',
    domain: 'home_and_furniture',
    gapClassification: 'present_only_as_modifier_padded_or_slash_compound',
    instructionalSeqRankInFreq6000Db: null,
    courseModuleId: 'A1.2',
    existingMasterVocabularyIdIfPresent: 'id-v2-1103',
    existingMasterUkIfPresent: 'пульт дистанці́йного керува́ння',
    recommendedVisualFraming: 'full_room_scene',
    pedagogicalNotesEn:
      'Present in IDENTIFY_MASTER_2000_NOUNS only as formal bureaucratic phrase "пульт дистанці́йного керува́ння" (id-v2-1103) and "пульт ді-дже́я" (id-v2-1981); everyday speech uses пульт.',
  },
  {
    uk: 'ро́утер',
    en: 'Wi-Fi router',
    domain: 'home_and_furniture',
    gapClassification: 'present_only_as_modifier_padded_or_slash_compound',
    instructionalSeqRankInFreq6000Db: null,
    courseModuleId: 'A2.1',
    existingMasterVocabularyIdIfPresent: 'id-v2-1096',
    existingMasterUkIfPresent: 'ро́утер / маршрутиза́тор',
    recommendedVisualFraming: 'full_room_scene',
    pedagogicalNotesEn:
      'Present only as slash-compound "ро́утер / маршрутиза́тор" (id-v2-1096); should be normalized to primary headword ро́утер.',
  },
  {
    uk: 'коло́нка',
    en: 'speaker (audio)',
    domain: 'personal_belongings',
    gapClassification: 'present_only_as_modifier_padded_or_slash_compound',
    instructionalSeqRankInFreq6000Db: null,
    courseModuleId: 'A2.1',
    existingMasterVocabularyIdIfPresent: 'id-v2-1093',
    existingMasterUkIfPresent: 'коло́нка аудіо',
    recommendedVisualFraming: 'full_room_scene',
    pedagogicalNotesEn:
      'Present only as awkward modifier phrase "коло́нка аудіо" (id-v2-1093).',
  },
  {
    uk: 'ка́бель',
    en: 'cable / charging cord',
    domain: 'personal_belongings',
    gapClassification: 'present_only_as_modifier_padded_or_slash_compound',
    instructionalSeqRankInFreq6000Db: null,
    courseModuleId: 'A2.1',
    existingMasterVocabularyIdIfPresent: 'id-v2-1102',
    existingMasterUkIfPresent: 'ка́бель USB',
    recommendedVisualFraming: 'close_up_detail',
    pedagogicalNotesEn:
      'Present only as technical modifier phrases "ка́бель USB" (id-v2-1102) and "ка́бель HDMI" (id-v2-1965).',
  },
];
