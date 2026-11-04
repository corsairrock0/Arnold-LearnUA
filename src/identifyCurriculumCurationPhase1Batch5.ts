// ============================================================================
// LANGO IDENTIFY — PHASE 1, BATCH 5:
// CURATION OF NEXT 200 EVERYDAY UKRAINIAN NOUNS (CANDIDATES 801..1000),
// SEMANTIC DUPLICATE VALIDATION & COVERAGE-GAP RECONCILIATION PLAN
// ============================================================================
// IMPORTANT SAFETY BOUNDARY:
// - This module is development-only curriculum curation infrastructure.
// - It does NOT modify active learner-facing scenes (10 verified scenes,
//   49 approved active targets, 2,471 unverified associations excluded),
//   nor does it mutate IDENTIFY_MASTER_2000_NOUNS or Batches 1–4.
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

export type ExplicitBatch5Assessment = ExplicitBatch4Assessment;

// ----------------------------------------------------------------------------
// 1. Explicit Batch 5 Assessments (38 EXCLUDE, 36 REVIEW, and Key KEEP Overrides)
//    Out of 200 Batch 5 candidates: 126 KEEP + 36 REVIEW + 38 EXCLUDE = 200
// ----------------------------------------------------------------------------

export const EXPLICIT_BATCH_5_ASSESSMENTS: Record<
  string,
  ExplicitBatch5Assessment
> = {
  // === KEY VERIFIED KEEP OVERRIDES (PREFERRED-HEADWORD NORMALIZATION & POLYSEMY) ===
  'id-v2-870': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['bedroom', 'clothing-store', 'hallway-entry', 'city-streets'],
    recommendation: 'keep',
    rationaleEn:
      'су́мка жіно́ча (handbag / purse) represents the core everyday bag concept (FREQ_6000_DB #574, A1.1); normalize learner-facing preferred headword to су́мка.',
  },
  'id-v2-862': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bedroom', 'office', 'classroom', 'hospital-pharmacy'],
    recommendation: 'keep',
    rationaleEn:
      'окуля́ри для зо́ру (eyeglasses) represents the core everyday glasses concept (FREQ_6000_DB #575, A1.2); normalize learner-facing preferred headword to окуля́ри.',
  },
  'id-v2-863': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['beach-nature', 'clothing-store', 'park-garden'],
    recommendation: 'keep',
    rationaleEn:
      'со́нцезахисні́ окуля́ри (sunglasses) is visually distinct from clear prescription glasses via dark tinted lenses in beach and outdoor scenes.',
  },
  'id-v2-1093': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['living-room', 'bedroom', 'office'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'коло́нка аудіо (audio speaker) is the primary modern everyday sense of коло́нка; normalize learner headword to коло́нка while keeping street water pump (id-v2-1340) separate.',
  },
  'id-v2-763': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom', 'office', 'kitchen'],
    recommendation: 'keep',
    rationaleEn:
      'но́жиці канцеля́рські (scissors) is the canonical everyday scissors concept (superseding Batch 1 REVIEW манікю́рні но́жиці id-v2-313); normalize preferred headword to но́жиці.',
  },
  'id-v2-749': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'classroom'],
    recommendation: 'keep',
    rationaleEn:
      'па́пка для докуме́нтів (file folder) is the canonical office/school folder concept; normalize preferred learner headword to па́пка.',
  },
  'id-v2-742': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom', 'airport-station', 'office'],
    recommendation: 'keep',
    rationaleEn:
      'географі́чна ка́рта (wall map) represents the core map concept (ка́рта / ма́па, FREQ_6000_DB #292, A1.2); normalize preferred headword to ка́рта.',
  },
  'id-v2-833': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['clothing-store', 'office', 'bedroom'],
    recommendation: 'keep',
    rationaleEn:
      'костю́м ділови́й (business suit) represents the core suit concept (FREQ_6000_DB #572, A2.3); normalize preferred headword to костю́м.',
  },
  'id-v2-834': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['gym-fitness', 'bedroom', 'clothing-store'],
    recommendation: 'keep',
    rationaleEn:
      'спортивний костю́м (tracksuit) is a very common everyday athletic outfit in Ukraine, visually distinct from a tailored business suit.',
  },
  'id-v2-720': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'public-transportation', 'garage-workshop'],
    recommendation: 'keep',
    rationaleEn:
      'колесо́ автомобі́льне (car wheel) represents the canonical wheel concept (колесо́, FREQ_6000_DB #725); normalize preferred headword to колесо́.',
  },
  'id-v2-719': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'garage-workshop'],
    recommendation: 'keep',
    rationaleEn:
      'фа́ра автомобі́льна (headlight) represents the canonical vehicle headlight concept; normalize preferred headword to фа́ра.',
  },
  'id-v2-856': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['clothing-store', 'bedroom'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'мете́лик (краватка) (bow tie) is a distinct lexical sense of Ukrainian мете́лик alongside мете́лик (комаха) (butterfly, id-v2-991).',
  },
  'id-v2-991': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'countryside'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'мете́лик (комаха) (butterfly) is a core A1/A2 nature insect noun preserved alongside the clothing sense мете́лик (краватка) (id-v2-856).',
  },
  'id-v2-993': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'common_situational',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['park-garden', 'countryside'],
    recommendation: 'keep',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'со́нечко (божа корівка) (ladybug) is a distinct lexical sense of Ukrainian со́нечко (red-and-black beetle, not a duplicate of bn-sun со́нце).',
  },
  'id-v2-687': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['public-transportation', 'airport-station'],
    recommendation: 'keep',
    rationaleEn:
      'ремі́нь безпе́ки (seatbelt) is an essential everyday travel/safety noun in cars and airplanes, distinct from waist belt ремі́нь / па́сок (id-v2-854).',
  },
  'id-v2-854': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'essential_everyday',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['bedroom', 'clothing-store'],
    recommendation: 'keep',
    rationaleEn:
      'ремі́нь / па́сок (leather waist belt) is a core everyday clothing accessory; normalize primary headword to ремі́нь with па́сок preserved as a synonym.',
  },

  // === EXPLICIT REVIEW CANDIDATES IN BATCH 5 (36 ITEMS) ===
  'id-v2-849': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['clothing-store', 'bedroom'],
    recommendation: 'review',
    rationaleEn:
      'бере́т (beret) is a specific headwear subtype; hold for review alongside ша́пка (id-v2-846), капелю́х (id-v2-847), and ке́пка / бейсбо́лка (id-v2-848).',
  },
  'id-v2-1051': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['gym-fitness'],
    recommendation: 'review',
    rationaleEn:
      'еспа́ндер (resistance band) is a secondary fitness accessory held for gym scene equipment quota review.',
  },
  'id-v2-1118': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['cultural-music', 'classroom'],
    recommendation: 'review',
    rationaleEn:
      'синтеза́тор (electronic keyboard synthesizer) visually overlaps with піані́но / роя́ль (id-v2-1117, kept in Batch 4) unless shown on an X-stand.',
  },
  'id-v2-1120': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['cultural-music', 'bedroom'],
    recommendation: 'review',
    rationaleEn:
      'електрогіта́ра (electric guitar) is a subtype of гіта́ра (id-v2-1119, kept in Batch 4); hold for musical-instrument quota review.',
  },
  'id-v2-770': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['office'],
    recommendation: 'review',
    rationaleEn:
      'шре́дер (paper shredder) visually resembles an office wastebasket unless paper strips are shown; held for office scene review while duplicate id-v2-1964 is excluded.',
  },
  'id-v2-1054': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['gym-fitness', 'classroom'],
    recommendation: 'review',
    rationaleEn:
      'секундомі́р (stopwatch) requires close-up framing to distinguish from a wristwatch or pocket watch.',
  },
  'id-v2-853': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'clothing_wardrobe_display',
    candidateSceneCategories: ['bedroom', 'clothing-store', 'park-garden'],
    recommendation: 'review',
    rationaleEn:
      'рукави́ці (winter mittens) is held for review alongside Batch 2 accepted рукави́чки (gloves, id-v2-852) to confirm whether both are needed in the 1,200 core.',
  },
  'id-v2-1123': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['cultural-music'],
    recommendation: 'review',
    rationaleEn:
      'смичо́к (violin bow) is an instrument sub-part/accessory that requires non-overlapping pin placement next to скри́пка (id-v2-1122).',
  },
  'id-v2-1124': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['cultural-music'],
    recommendation: 'review',
    rationaleEn:
      'віолонче́ль (cello) is an orchestral string instrument held for review on musical-instrument scene quota alongside скри́пка (id-v2-1122).',
  },
  'id-v2-1327': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'park-garden'],
    recommendation: 'review',
    rationaleEn:
      'колона́да (colonnade) is an architectural row of columns held for review alongside core architectural landmarks.',
  },
  'id-v2-291': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'review',
    rationaleEn:
      'ванту́з (plunger) is a recognizable plumbing tool, held for review to avoid cluttering standard bathroom scenes.',
  },
  'id-v2-307': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bathroom', 'bedroom'],
    recommendation: 'review',
    rationaleEn:
      'пло́йка (curling iron) is a secondary hair-styling appliance held for review alongside фен (hairdryer, id-v2-306).',
  },
  'id-v2-455': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'farmers-market'],
    recommendation: 'review',
    rationaleEn:
      'спа́ржа (asparagus) is less central in everyday Ukrainian cuisine than core vegetables (бро́колі, баклажа́н, кабачо́к, гарбу́з); held for vegetable quota review.',
  },
  'id-v2-457': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market', 'kitchen'],
    recommendation: 'review',
    rationaleEn:
      'щаве́ль (sorrel) is culturally used in Ukrainian green borscht, but its leaves visually resemble шпина́т (spinach, id-v2-456) in static imagery.',
  },
  'id-v2-459': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['supermarket', 'kitchen'],
    recommendation: 'review',
    rationaleEn:
      'ру́кола (arugula) requires close-up lobed-leaf detail so learners can distinguish it from general leafy greens and spinach.',
  },
  'id-v2-471': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'market_counter_display',
    candidateSceneCategories: ['farmers-market', 'countryside'],
    recommendation: 'review',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'лиси́чка (chanterelle mushroom) is a culinary mushroom subtype (polysemous with diminutive of fox лиси́ця, id-v2-973); held for mushroom subtype review alongside печери́ця (id-v2-469).',
  },
  'id-v2-1376': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets', 'gym-fitness'],
    recommendation: 'review',
    rationaleEn:
      'мегафо́н / гучномо́вець (megaphone) is a situational public-event device held for review.',
  },
  'id-v2-717': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['public-transportation', 'city-streets'],
    recommendation: 'review',
    rationaleEn:
      'важі́ль коро́бки переда́ч (gearshift lever) is a multi-word car-interior phrase held for review alongside приладо́ва пане́ль (dashboard, id-v2-716) and лобове́ скло (windshield, id-v2-713).',
  },
  'id-v2-718': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['public-transportation'],
    recommendation: 'review',
    rationaleEn:
      'педа́ль га́льм (brake pedal) is hidden in the driver footwell unless a dedicated car-cockpit close-up scene is used.',
  },
  'id-v2-869': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bedroom', 'clothing-store'],
    recommendation: 'review',
    rationaleEn:
      'бро́шка (brooch) is a lower-frequency jewelry item compared to каблу́чка / пе́рстень (id-v2-865), сере́жки (id-v2-866), and брасле́т (id-v2-868).',
  },
  'id-v2-875': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['bedroom', 'cultural-music'],
    recommendation: 'review',
    rationaleEn:
      'ві́яло (folding hand fan) has low everyday utility compared to core personal accessories.',
  },
  'id-v2-1143': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom', 'creative-studio'],
    recommendation: 'review',
    rationaleEn:
      'пасте́ль (pastel crayons) visually resembles кре́йда (chalk, id-v2-735, kept in Batch 4) and флома́стер (id-v2-755).',
  },
  'id-v2-740': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom', 'office'],
    recommendation: 'review',
    rationaleEn:
      'екра́н проєкці́йний (projection screen) requires careful framing with проє́ктор (id-v2-739) so it does not collide with cl-board (до́шка).',
  },
  'id-v2-1007': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['hospital-pharmacy'],
    recommendation: 'review',
    rationaleEn:
      'рентге́нівський зні́мок (X-ray film) is recognizable on a clinic lightboxes; held for medical scene allocation.',
  },
  'id-v2-1008': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['hospital-pharmacy'],
    recommendation: 'review',
    rationaleEn:
      'табли́ця переві́рки зо́ру (eye chart) is visually iconic on a doctor’s office wall, but is a multi-word descriptive phrase.',
  },
  'id-v2-1009': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['hospital-pharmacy'],
    recommendation: 'review',
    rationaleEn:
      'стоматологі́чне крі́сло (dental chair) is held for review depending on whether a dedicated dental clinic scene is included in the 80 scenes.',
  },
  'id-v2-1326': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'review',
    rationaleEn:
      'арка міська́ (archway) is a modifier-padded architectural phrase whose preferred headword is а́рка; held for headword normalization review.',
  },
  'id-v2-1340': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'outdoor_nature_scene',
    candidateSceneCategories: ['countryside'],
    recommendation: 'review',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'коло́нка водопро́відна (village street water pump) is a traditional rural sense of коло́нка, held for review while коло́нка аудіо (id-v2-1093) is kept.',
  },
  'id-v2-730': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['hotel-room', 'airport-station'],
    recommendation: 'review',
    rationaleEn:
      'візо́к для багажу́ (bellhop luggage cart) is a specialized hotel trolley held for review alongside рецепція готе́лю (id-v2-728).',
  },
  'id-v2-354': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['garage-workshop'],
    recommendation: 'review',
    rationaleEn:
      'куса́чки (wire cutters) visually resembles плоскогу́бці (pliers, id-v2-353, kept in Batch 5) in a workshop scene.',
  },
  'id-v2-1088': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'bedroom'],
    recommendation: 'review',
    rationaleEn:
      'килимо́к для ми́ші (mousepad) lies directly underneath ми́ша (of-mouse) and requires careful non-overlapping hotspot geometry.',
  },
  'id-v2-1342': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'review',
    rationaleEn:
      'стовпчи́к тротуа́рний (street bollard) is ubiquitous on modern Ukrainian sidewalks, but lower priority than core street nouns.',
  },
  'id-v2-1343': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'review',
    rationaleEn:
      'відбі́йник доро́жній (highway guardrail) is a secondary road-infrastructure noun held for review.',
  },
  'id-v2-733': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hotel-room'],
    recommendation: 'review',
    rationaleEn:
      'табли́чка на дверя́х (do-not-disturb door sign) is a narrow hotel-room detail held for review.',
  },
  'id-v2-1391': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['airport-station'],
    recommendation: 'review',
    issueFlags: ['polysemy_sense_preserved'],
    rationaleEn:
      'гвинт / пропе́лер (propeller) is polysemous in Ukrainian with metal screw (гвинт); held for headword normalization to пропе́лер.',
  },
  'id-v2-373': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'useful_extended',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['garage-workshop'],
    recommendation: 'review',
    rationaleEn:
      'ізострі́чка (electrical tape) is a secondary workshop consumable held for review alongside скотч (id-v2-766, kept in Batch 4).',
  },

  // === EXPLICIT EXCLUDE CANDIDATES IN BATCH 5 (38 ITEMS) ===
  // 14 Cross-Batch & Within-Batch Semantic Duplicates / Synonyms / Subtypes
  'id-v2-286': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'ba-sink',
    canonicalConceptId: 'noun-concept-0341',
    rationaleEn:
      'умива́льник (bathroom sink) duplicates Batch 1 accepted ba-sink (ра́ковина, noun-concept-0341); умива́льник is recorded as a standard Ukrainian synonym on ba-sink.',
  },
  'id-v2-287': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['bathroom', 'kitchen'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'ba-faucet',
    canonicalConceptId: 'noun-concept-0356',
    rationaleEn:
      'змі́шувач (faucet / mixer tap) duplicates Batch 1 accepted ba-faucet (кран, noun-concept-0356); змі́шувач is preserved as a synonym on ba-faucet.',
  },
  'id-v2-701': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['public-transportation', 'city-streets'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'pt-stop',
    canonicalConceptId: 'noun-concept-1041',
    rationaleEn:
      'зупи́нка тра́нспорту (bus shelter / transit stop) is a modifier-padded duplicate of Batch 1 accepted pt-stop (зупи́нка, noun-concept-1041).',
  },
  'id-v2-705': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'cs-car',
    canonicalConceptId: 'noun-concept-0833',
    rationaleEn:
      'легкови́й автомобі́ль (sedan passenger car) is a modifier-padded duplicate of Batch 1 accepted cs-car (автомобі́ль, noun-concept-0833).',
  },
  'id-v2-734': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['classroom'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'cl-board',
    canonicalConceptId: 'noun-concept-1132',
    rationaleEn:
      'шкільна́ до́шка (blackboard / whiteboard) is a modifier-padded duplicate of Batch 1 accepted cl-board (до́шка, noun-concept-1132).',
  },
  'id-v2-748': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office', 'classroom'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'noun-arkush-sheet',
    canonicalConceptId: 'noun-concept-0010',
    rationaleEn:
      'а́ркуш папе́ру (sheet of paper) is an exact duplicate of Batch 1 accepted noun-arkush-sheet (а́ркуш (папе́ру), noun-concept-0010).',
  },
  'id-v2-752': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom', 'office'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'cl-pen',
    canonicalConceptId: 'noun-concept-1198',
    rationaleEn:
      'ру́чка кулькова́ (ballpoint pen) is a modifier-padded duplicate of Batch 1 accepted cl-pen (ру́чка, noun-concept-1198).',
  },
  'id-v2-753': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept', 'overly_specialized'],
    duplicateOfVocabularyId: 'cl-pen',
    canonicalConceptId: 'noun-concept-1198',
    rationaleEn:
      'перо́ва ру́чка (fountain pen) is a narrow pen subtype redundant alongside canonical cl-pen (ру́чка, noun-concept-1198).',
  },
  'id-v2-754': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'cl-pencil',
    canonicalConceptId: 'noun-concept-1208',
    rationaleEn:
      'кольорови́й оліве́ць (colored pencil) is a modifier-padded subtype of Batch 1 accepted cl-pencil (оліве́ць, noun-concept-1208).',
  },
  'id-v2-1087': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['office'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'of-mouse',
    canonicalConceptId: 'noun-concept-1112',
    rationaleEn:
      'ми́ша комп’ю́терна (computer mouse) is a modifier-padded duplicate of Batch 1 accepted of-mouse (ми́ша, noun-concept-1112).',
  },
  'id-v2-1000': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'hp-thermometer',
    canonicalConceptId: 'noun-concept-1762',
    rationaleEn:
      'термо́метр меди́чний (clinical thermometer) is a modifier-padded duplicate of Batch 1 accepted hp-thermometer (термо́метр, noun-concept-1762).',
  },
  'id-v2-1003': {
    everydayRelevance: 'moderate_situational',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['hospital-pharmacy'],
    recommendation: 'exclude',
    issueFlags: ['modifier_padded_duplicate'],
    duplicateOfVocabularyId: 'bd-bed',
    canonicalConceptId: 'noun-concept-0048',
    rationaleEn:
      'лікарня́не лі́жко (hospital bed) is a modifier-padded subtype of Batch 1 accepted bd-bed (лі́жко, noun-concept-0048).',
  },
  'id-v2-1017': {
    everydayRelevance: 'high_daily',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy'],
    recommendation: 'exclude',
    issueFlags: ['duplicate_concept'],
    duplicateOfVocabularyId: 'id-v2-1015',
    canonicalConceptId: 'noun-concept-1803',
    rationaleEn:
      'блі́стер з лі́ками (blister pack of pills) visually duplicates Batch 4 accepted id-v2-1015 (пігу́лка / табле́тка, noun-concept-1803) and Batch 1 hp-medicine (лі́ки).',
  },
  'id-v2-1964': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['office'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'modifier_padded_duplicate'],
    rationaleEn:
      'шредер (зни́щувач папе́рів) (office paper shredder) is a parenthetical-gloss duplicate of Batch 5 REVIEW candidate id-v2-770 (шре́дер, noun-concept-1125) and has low everyday priority; excluded without canonical KEEP target link because id-v2-770 is held in REVIEW.',
  },

  // 24 Specialist, Lab, Clinical, Hardware & Industrial Exclusions
  'id-v2-779': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'пробі́рка (chemistry test tube) is specialized laboratory glassware outside the 1,200 everyday vocabulary core.',
  },
  'id-v2-780': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'ко́лба (Erlenmeyer laboratory flask) is specialized chemistry equipment with low everyday communicative utility.',
  },
  'id-v2-781': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'context_dependent',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'ме́нзурка (graduated laboratory cylinder/beaker) is technical chemistry glassware.',
  },
  'id-v2-782': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom', 'hospital-pharmacy'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'піпе́тка (laboratory dropper / pipette) is a tiny scientific/medical dropper outside core everyday vocabulary.',
  },
  'id-v2-788': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['classroom'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'протига́з / захисні́ окуля́ри conflates a civil-defense gas mask with laboratory safety goggles; both are overly specialized.',
  },
  'id-v2-1006': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'public_service_environment',
    candidateSceneCategories: ['hospital-pharmacy'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'но́ші меди́чні (ambulance stretcher / gurney) is emergency paramedic equipment outside the 1,200 everyday core.',
  },
  'id-v2-1011': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'дзеркало стоматологі́чне (dental mouth mirror) is a tiny clinical instrument with low everyday communicative utility.',
  },
  'id-v2-1014': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['hospital-pharmacy'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'джгут меди́чний (medical tourniquet) is specialized emergency/clinical equipment.',
  },
  'id-v2-1134': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['cultural-music'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'камерто́н (tuning fork) is a specialist acoustic/choir pitch tool outside general everyday vocabulary.',
  },
  'id-v2-1135': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['cultural-music'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'метроно́м (mechanical metronome) is a niche music-practice device.',
  },
  'id-v2-1132': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['cultural-music'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'пюпі́тр (orchestral sheet-music stand) is a low-frequency specialist music-hall term.',
  },
  'id-v2-1992': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['cultural-music'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'overly_specialized'],
    rationaleEn:
      'калімба (мбі́ра) (thumb piano kalimba) is an obscure specialty instrument with minimal utility in a 1,200-word Ukrainian curriculum.',
  },
  'id-v2-1149': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['tailor-workshop'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'overly_specialized'],
    rationaleEn:
      'напе́рсток (sewing thimble) is a tiny tailoring cap too small for scene pins and rarely used in everyday speech.',
  },
  'id-v2-349': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['living-room'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'ба́лка (structural ceiling beam) is an architectural framing element rather than an everyday household object.',
  },
  'id-v2-370': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['garage-workshop'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'га́йка (hex nut) is a tiny hardware fastener sub-part with low general communicative priority.',
  },
  'id-v2-371': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['garage-workshop'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'ша́йба (metal hardware washer) is a tiny mechanical spacer ring outside the 1,200 everyday vocabulary core.',
  },
  'id-v2-372': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'close_up_detail',
    candidateSceneCategories: ['garage-workshop'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'дю́бель (plastic wall anchor plug) is a specialist construction fastener.',
  },
  'id-v2-1329': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'exclude',
    issueFlags: ['obscure_or_rare', 'unnatural_scene_filler'],
    rationaleEn:
      'флю́гер (rooftop weathervane) is a rare architectural ornament with low everyday communicative utility.',
  },
  'id-v2-1373': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'нару́чники (police handcuffs) is specialized law-enforcement gear unsuitable for everyday-life Identify scenes.',
  },
  'id-v2-1378': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'obscure_or_rare'],
    rationaleEn:
      'гідромоніто́р / брандспо́йт (industrial fire monitor nozzle) is technical firefighting terminology.',
  },
  'id-v2-1381': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['city-streets'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'автови́шка (hydraulic cherry-picker utility truck) is specialized municipal utility machinery.',
  },
  'id-v2-1383': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['supermarket'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'піддо́н дерев’я́ний / пале́та (wooden shipping pallet) is industrial warehouse equipment outside the 1,200 everyday core.',
  },
  'id-v2-1386': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'clear_distinct_object',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'street_urban_scene',
    candidateSceneCategories: ['airport-station', 'city-streets'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized'],
    rationaleEn:
      'паливозапра́вник (fuel tanker truck) is a specialized industrial vehicle subtype redundant alongside вантажі́вка (truck, id-v2-707, kept in Batch 4).',
  },
  'id-v2-289': {
    everydayRelevance: 'low_niche',
    visualRecognizability: 'poor_or_ambiguous',
    recommendedPriority: 'none_exclude',
    recommendedVisualFraming: 'full_room_scene',
    candidateSceneCategories: ['bathroom'],
    recommendation: 'exclude',
    issueFlags: ['overly_specialized', 'unnatural_scene_filler'],
    rationaleEn:
      'біде́ (bidet) is visually confusable with уніта́з (toilet bowl, id-v2-288, kept in Batch 5) and low priority for the 1,200 everyday curriculum.',
  },
};

// ----------------------------------------------------------------------------
// 2. Batch 5 Semantic Duplicate, Synonym, Headword & Lexical-Sense Validation
//    Explicitly distinguishes all 7 required semantic relationship categories:
//    - EXACT_SAME_CONCEPT
//    - SYNONYM
//    - ALTERNATE_UKRAINIAN_HEADWORD
//    - MODIFIER_PADDED_VARIANT
//    - MORE_SPECIFIC_SUBTYPE
//    - DISTINCT_LEXICAL_SENSE
//    - UNRELATED_SIMILAR_SPELLING
// ----------------------------------------------------------------------------

export type IdentifyBatch5SemanticRelationshipType =
  | 'EXACT_SAME_CONCEPT'
  | 'SYNONYM'
  | 'ALTERNATE_UKRAINIAN_HEADWORD'
  | 'MODIFIER_PADDED_VARIANT'
  | 'MORE_SPECIFIC_SUBTYPE'
  | 'DISTINCT_LEXICAL_SENSE'
  | 'UNRELATED_SIMILAR_SPELLING';

export interface IdentifyBatch5SemanticDuplicateRecord {
  batchNumber: 5;
  candidateVocabularyId: string;
  candidateConceptId: string;
  candidateUk: string;
  candidateEn: string;
  comparedVocabularyId: string;
  comparedConceptId: string;
  comparedUk: string;
  comparedEn: string;
  relationshipType: IdentifyBatch5SemanticRelationshipType;
  countsAsDuplicateConcept: boolean;
  curationActionOnBatch5Candidate: IdentifyCurationRecommendation;
  preferredCanonicalHeadwordUk: string;
  reasonEn: string;
}

export const IDENTIFY_BATCH_5_SEMANTIC_DUPLICATE_RECORDS: readonly IdentifyBatch5SemanticDuplicateRecord[] = [
  // === 14 TRUE DUPLICATES / SYNONYMS / MODIFIER-PADDED VARIANTS / SUBTYPES (EXCLUDED) ===
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-748',
    candidateConceptId: 'noun-concept-1255',
    candidateUk: 'а́ркуш папе́ру',
    candidateEn: 'sheet of paper',
    comparedVocabularyId: 'noun-arkush-sheet',
    comparedConceptId: 'noun-concept-0010',
    comparedUk: 'а́ркуш (папе́ру)',
    comparedEn: 'sheet of paper',
    relationshipType: 'EXACT_SAME_CONCEPT',
    countsAsDuplicateConcept: true,
    curationActionOnBatch5Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'а́ркуш',
    reasonEn:
      'Exact same concept as Batch 1 accepted noun-arkush-sheet (noun-concept-0010).',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-1964',
    candidateConceptId: 'noun-concept-0794',
    candidateUk: 'шредер (зни́щувач папе́рів)',
    candidateEn: 'office paper shredder',
    comparedVocabularyId: 'id-v2-770',
    comparedConceptId: 'noun-concept-1125',
    comparedUk: 'шре́дер',
    comparedEn: 'paper shredder',
    relationshipType: 'EXACT_SAME_CONCEPT',
    countsAsDuplicateConcept: false,
    curationActionOnBatch5Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'шре́дер',
    reasonEn:
      'Parenthetical-gloss duplicate of Batch 5 REVIEW candidate id-v2-770 (шре́дер, noun-concept-1125); recorded as comparison-only (countsAsDuplicateConcept: false) because id-v2-770 is held in REVIEW rather than an approved KEEP target.',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-1017',
    candidateConceptId: 'noun-concept-1841',
    candidateUk: 'блі́стер з лі́ками',
    candidateEn: 'blister pack of pills',
    comparedVocabularyId: 'id-v2-1015',
    comparedConceptId: 'noun-concept-1803',
    comparedUk: 'пігу́лка / табле́тка',
    comparedEn: 'pill / tablet',
    relationshipType: 'EXACT_SAME_CONCEPT',
    countsAsDuplicateConcept: true,
    curationActionOnBatch5Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'пігу́лка / табле́тка',
    reasonEn:
      'Occupies the same visual blister-pack target as Batch 4 accepted id-v2-1015 (пігу́лка / табле́тка) and Batch 1 hp-medicine (лі́ки).',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-286',
    candidateConceptId: 'noun-concept-0317',
    candidateUk: 'умива́льник',
    candidateEn: 'bathroom sink',
    comparedVocabularyId: 'ba-sink',
    comparedConceptId: 'noun-concept-0341',
    comparedUk: 'ра́ковина',
    comparedEn: 'bathroom sink / washbasin',
    relationshipType: 'SYNONYM',
    countsAsDuplicateConcept: true,
    curationActionOnBatch5Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'ра́ковина / умива́льник',
    reasonEn:
      'умива́льник is a standard Ukrainian synonym of Batch 1 accepted ba-sink (ра́ковина, noun-concept-0341).',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-287',
    candidateConceptId: 'noun-concept-0330',
    candidateUk: 'змі́шувач',
    candidateEn: 'faucet / tap',
    comparedVocabularyId: 'ba-faucet',
    comparedConceptId: 'noun-concept-0356',
    comparedUk: 'кран',
    comparedEn: 'faucet / tap',
    relationshipType: 'SYNONYM',
    countsAsDuplicateConcept: true,
    curationActionOnBatch5Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'кран / змі́шувач',
    reasonEn:
      'змі́шувач is the technical synonym for Batch 1 accepted ba-faucet (кран, noun-concept-0356).',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-701',
    candidateConceptId: 'noun-concept-0984',
    candidateUk: 'зупи́нка тра́нспорту',
    candidateEn: 'bus shelter / stop',
    comparedVocabularyId: 'pt-stop',
    comparedConceptId: 'noun-concept-1041',
    comparedUk: 'зупи́нка',
    comparedEn: 'transit stop',
    relationshipType: 'MODIFIER_PADDED_VARIANT',
    countsAsDuplicateConcept: true,
    curationActionOnBatch5Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'зупи́нка',
    reasonEn:
      'Modifier-padded variant of Batch 1 accepted pt-stop (зупи́нка, noun-concept-1041).',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-705',
    candidateConceptId: 'noun-concept-1044',
    candidateUk: 'легкови́й автомобі́ль',
    candidateEn: 'sedan car',
    comparedVocabularyId: 'cs-car',
    comparedConceptId: 'noun-concept-0833',
    comparedUk: 'автомобі́ль',
    comparedEn: 'car / automobile',
    relationshipType: 'MODIFIER_PADDED_VARIANT',
    countsAsDuplicateConcept: true,
    curationActionOnBatch5Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'автомобі́ль / маши́на',
    reasonEn:
      'Modifier-padded variant of Batch 1 accepted cs-car (автомобі́ль, noun-concept-0833).',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-734',
    candidateConceptId: 'noun-concept-1241',
    candidateUk: 'шкільна́ до́шка',
    candidateEn: 'blackboard / whiteboard',
    comparedVocabularyId: 'cl-board',
    comparedConceptId: 'noun-concept-1132',
    comparedUk: 'до́шка',
    comparedEn: 'board / blackboard',
    relationshipType: 'MODIFIER_PADDED_VARIANT',
    countsAsDuplicateConcept: true,
    curationActionOnBatch5Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'до́шка',
    reasonEn:
      'Modifier-padded variant of Batch 1 accepted cl-board (до́шка, noun-concept-1132).',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-752',
    candidateConceptId: 'noun-concept-1169',
    candidateUk: 'ру́чка кулькова́',
    candidateEn: 'ballpoint pen',
    comparedVocabularyId: 'cl-pen',
    comparedConceptId: 'noun-concept-1198',
    comparedUk: 'ру́чка',
    comparedEn: 'pen',
    relationshipType: 'MODIFIER_PADDED_VARIANT',
    countsAsDuplicateConcept: true,
    curationActionOnBatch5Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'ру́чка',
    reasonEn:
      'Modifier-padded variant of Batch 1 accepted cl-pen (ру́чка, noun-concept-1198).',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-1087',
    candidateConceptId: 'noun-concept-1916',
    candidateUk: 'ми́ша комп’ю́терна',
    candidateEn: 'computer mouse',
    comparedVocabularyId: 'of-mouse',
    comparedConceptId: 'noun-concept-1112',
    comparedUk: 'ми́ша',
    comparedEn: 'computer mouse',
    relationshipType: 'MODIFIER_PADDED_VARIANT',
    countsAsDuplicateConcept: true,
    curationActionOnBatch5Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'ми́ша',
    reasonEn:
      'Modifier-padded variant of Batch 1 accepted of-mouse (ми́ша, noun-concept-1112).',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-1000',
    candidateConceptId: 'noun-concept-1700',
    candidateUk: 'термо́метр меди́чний',
    candidateEn: 'clinical thermometer',
    comparedVocabularyId: 'hp-thermometer',
    comparedConceptId: 'noun-concept-1762',
    comparedUk: 'термо́метр',
    comparedEn: 'thermometer',
    relationshipType: 'MODIFIER_PADDED_VARIANT',
    countsAsDuplicateConcept: true,
    curationActionOnBatch5Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'термо́метр',
    reasonEn:
      'Modifier-padded variant of Batch 1 accepted hp-thermometer (термо́метр, noun-concept-1762).',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-1003',
    candidateConceptId: 'noun-concept-1763',
    candidateUk: 'лікарня́не лі́жко',
    candidateEn: 'hospital bed',
    comparedVocabularyId: 'bd-bed',
    comparedConceptId: 'noun-concept-0048',
    comparedUk: 'лі́жко',
    comparedEn: 'bed',
    relationshipType: 'MORE_SPECIFIC_SUBTYPE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch5Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'лі́жко',
    reasonEn:
      'Hospital-room subtype of Batch 1 accepted bd-bed (лі́жко, noun-concept-0048).',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-753',
    candidateConceptId: 'noun-concept-1185',
    candidateUk: 'перо́ва ру́чка',
    candidateEn: 'fountain pen',
    comparedVocabularyId: 'cl-pen',
    comparedConceptId: 'noun-concept-1198',
    comparedUk: 'ру́чка',
    comparedEn: 'pen',
    relationshipType: 'MORE_SPECIFIC_SUBTYPE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch5Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'ру́чка',
    reasonEn:
      'Specific pen subtype visually overlapping with Batch 1 accepted cl-pen (ру́чка, noun-concept-1198).',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-754',
    candidateConceptId: 'noun-concept-1201',
    candidateUk: 'кольорови́й оліве́ць',
    candidateEn: 'colored pencil',
    comparedVocabularyId: 'cl-pencil',
    comparedConceptId: 'noun-concept-1208',
    comparedUk: 'оліве́ць',
    comparedEn: 'pencil',
    relationshipType: 'MORE_SPECIFIC_SUBTYPE',
    countsAsDuplicateConcept: true,
    curationActionOnBatch5Candidate: 'exclude',
    preferredCanonicalHeadwordUk: 'оліве́ць',
    reasonEn:
      'Specific pencil subtype overlapping with Batch 1 accepted cl-pencil (оліве́ць, noun-concept-1208).',
  },

  // === PREFERRED HEADWORD NORMALIZATION ON ACCEPTED BATCH 5 CONCEPTS ===
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-870',
    candidateConceptId: 'noun-concept-1286',
    candidateUk: 'су́мка жіно́ча',
    candidateEn: 'handbag / purse',
    comparedVocabularyId: 'id-v2-870',
    comparedConceptId: 'noun-concept-1286',
    comparedUk: 'су́мка',
    comparedEn: 'bag / handbag',
    relationshipType: 'ALTERNATE_UKRAINIAN_HEADWORD',
    countsAsDuplicateConcept: false,
    curationActionOnBatch5Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'су́мка',
    reasonEn:
      'Kept in Batch 5 as the canonical bag/handbag concept in the 1,200 curriculum, with the modifier stripped so learners practice natural headword су́мка.',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-862',
    candidateConceptId: 'noun-concept-1298',
    candidateUk: 'окуля́ри для зо́ру',
    candidateEn: 'eyeglasses',
    comparedVocabularyId: 'id-v2-862',
    comparedConceptId: 'noun-concept-1298',
    comparedUk: 'окуля́ри',
    comparedEn: 'glasses / eyeglasses',
    relationshipType: 'ALTERNATE_UKRAINIAN_HEADWORD',
    countsAsDuplicateConcept: false,
    curationActionOnBatch5Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'окуля́ри',
    reasonEn:
      'Kept in Batch 5 as the canonical glasses concept, normalized to natural single-word headword окуля́ри.',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-1093',
    candidateConceptId: 'noun-concept-1917',
    candidateUk: 'коло́нка аудіо',
    candidateEn: 'speaker',
    comparedVocabularyId: 'id-v2-1093',
    comparedConceptId: 'noun-concept-1917',
    comparedUk: 'коло́нка',
    comparedEn: 'audio speaker',
    relationshipType: 'ALTERNATE_UKRAINIAN_HEADWORD',
    countsAsDuplicateConcept: false,
    curationActionOnBatch5Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'коло́нка',
    reasonEn:
      'Kept in Batch 5 as the canonical audio speaker concept, normalized to everyday headword коло́нка.',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-833',
    candidateConceptId: 'noun-concept-1340',
    candidateUk: 'костю́м ділови́й',
    candidateEn: 'business suit',
    comparedVocabularyId: 'id-v2-833',
    comparedConceptId: 'noun-concept-1340',
    comparedUk: 'костю́м',
    comparedEn: 'suit',
    relationshipType: 'ALTERNATE_UKRAINIAN_HEADWORD',
    countsAsDuplicateConcept: false,
    curationActionOnBatch5Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'костю́м',
    reasonEn:
      'Kept in Batch 5 as the canonical suit concept, normalized to natural headword костю́м.',
  },

  // === DISTINCT LEXICAL SENSES & UNRELATED SIMILAR SPELLINGS (PROTECTED FROM FALSE POSITIVES) ===
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-856',
    candidateConceptId: 'noun-concept-1393',
    candidateUk: 'мете́лик (краватка)',
    candidateEn: 'bow tie',
    comparedVocabularyId: 'id-v2-991',
    comparedConceptId: 'noun-concept-1440',
    comparedUk: 'мете́лик (комаха)',
    comparedEn: 'butterfly',
    relationshipType: 'DISTINCT_LEXICAL_SENSE',
    countsAsDuplicateConcept: false,
    curationActionOnBatch5Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'мете́лик',
    reasonEn:
      'Polysemous Ukrainian noun: bow tie (clothing) and butterfly (insect) are distinct visual concepts; both are kept in Batch 5.',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-993',
    candidateConceptId: 'noun-concept-1480',
    candidateUk: 'со́нечко (божа корівка)',
    candidateEn: 'ladybug',
    comparedVocabularyId: 'bn-sun',
    comparedConceptId: 'noun-concept-1557',
    comparedUk: 'со́нце',
    comparedEn: 'sun',
    relationshipType: 'DISTINCT_LEXICAL_SENSE',
    countsAsDuplicateConcept: false,
    curationActionOnBatch5Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'со́нечко',
    reasonEn:
      'In Ukrainian, со́нечко denotes both the ladybug beetle and the diminutive of sun; id-v2-993 is the insect concept and does not duplicate bn-sun.',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-687',
    candidateConceptId: 'noun-concept-0983',
    candidateUk: ' ремі́нь безпе́ки',
    candidateEn: 'seatbelt',
    comparedVocabularyId: 'id-v2-854',
    comparedConceptId: 'noun-concept-1358',
    comparedUk: 'ремі́нь / па́сок',
    comparedEn: 'leather belt',
    relationshipType: 'DISTINCT_LEXICAL_SENSE',
    countsAsDuplicateConcept: false,
    curationActionOnBatch5Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'ремі́нь безпе́ки',
    reasonEn:
      'Vehicle safety seatbelt and clothing waist belt are distinct everyday concepts in different scene domains.',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-1085',
    candidateConceptId: 'noun-concept-1810',
    candidateUk: 'повітряний змій',
    candidateEn: 'kite',
    comparedVocabularyId: 'id-v2-981',
    comparedConceptId: 'noun-concept-1479',
    comparedUk: 'змія́',
    comparedEn: 'snake',
    relationshipType: 'UNRELATED_SIMILAR_SPELLING',
    countsAsDuplicateConcept: false,
    curationActionOnBatch5Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'повітряний змій',
    reasonEn:
      'Flying toy kite (повітряний змій) and reptile snake (змія́) share an etymological root but are unrelated visual concepts; both are kept.',
  },
  {
    batchNumber: 5,
    candidateVocabularyId: 'id-v2-861',
    candidateConceptId: 'noun-concept-1297',
    candidateUk: 'рука́в',
    candidateEn: 'sleeve',
    comparedVocabularyId: 'id-v2-1033',
    comparedConceptId: 'noun-concept-1766',
    comparedUk: 'рука́ / кисть',
    comparedEn: 'hand / arm',
    relationshipType: 'UNRELATED_SIMILAR_SPELLING',
    countsAsDuplicateConcept: false,
    curationActionOnBatch5Candidate: 'keep',
    preferredCanonicalHeadwordUk: 'рука́в',
    reasonEn:
      'Garment sleeve (рука́в) and body part hand/arm (рука́) share a prefix substring but are distinct concepts in clothing vs body domains.',
  },
];

// ----------------------------------------------------------------------------
// 3. Separated Coverage-Gap Protection & Final-Shortlist Reconciliation View
//    Preserves all 34 genuinely missing concepts from Batch 4 without
//    inserting them into IDENTIFY_MASTER_2000_NOUNS or inflating Batch 5 counts.
// ----------------------------------------------------------------------------

export interface IdentifyShortlistReconciliationCandidate {
  acceptedLegacyVocabularyId: string;
  acceptedLegacyConceptId: string;
  acceptedLegacyUk: string;
  acceptedLegacyEn: string;
  acceptedInBatchNumber: 1 | 2 | 3 | 4 | 5;
  currentPriority: IdentifyCurriculumPriorityLevel;
  higherValueMissingConceptUk: string;
  higherValueMissingConceptEn: string;
  missingConceptDomain: IdentifyCoverageDomainId;
  reconciliationNoteEn: string;
}

export const IDENTIFY_FINAL_SHORTLIST_RECONCILIATION_FLAGS: readonly IdentifyShortlistReconciliationCandidate[] = [
  {
    acceptedLegacyVocabularyId: 'id-v2-272',
    acceptedLegacyConceptId: 'noun-concept-0056',
    acceptedLegacyUk: 'дрова́',
    acceptedLegacyEn: 'firewood logs',
    acceptedInBatchNumber: 1,
    currentPriority: 'useful_extended',
    higherValueMissingConceptUk: 'підло́га',
    higherValueMissingConceptEn: 'floor',
    missingConceptDomain: 'home_and_furniture',
    reconciliationNoteEn:
      'Essential A1 room-structure noun підло́га (FREQ_6000_DB #700) has higher everyday communicative value than hearth firewood logs (дрова́); flagged for final 1,200-shortlist reconciliation without mutating Batch 1.',
  },
  {
    acceptedLegacyVocabularyId: 'id-v2-357',
    acceptedLegacyConceptId: 'noun-concept-0081',
    acceptedLegacyUk: 'дриль',
    acceptedLegacyEn: 'power drill',
    acceptedInBatchNumber: 1,
    currentPriority: 'useful_extended',
    higherValueMissingConceptUk: 'стіна́',
    higherValueMissingConceptEn: 'wall',
    missingConceptDomain: 'home_and_furniture',
    reconciliationNoteEn:
      'Essential A1 room-structure noun стіна́ (FREQ_6000_DB #1596) has broader daily utility across all indoor scenes than workshop power drill (дриль).',
  },
  {
    acceptedLegacyVocabularyId: 'id-v2-1044',
    acceptedLegacyConceptId: 'noun-concept-1787',
    acceptedLegacyUk: 'ги́ря',
    acceptedLegacyEn: 'kettlebell',
    acceptedInBatchNumber: 4,
    currentPriority: 'useful_extended',
    higherValueMissingConceptUk: 'живі́т',
    higherValueMissingConceptEn: 'stomach / belly',
    missingConceptDomain: 'body_parts',
    reconciliationNoteEn:
      'Core A2 body/health noun живі́т (FREQ_6000_DB #1727) is higher priority for everyday health communication than gym kettlebell (ги́ря).',
  },
  {
    acceptedLegacyVocabularyId: 'id-v2-1114',
    acceptedLegacyConceptId: 'noun-concept-1983',
    acceptedLegacyUk: 'квадроко́птер / дрон',
    acceptedLegacyEn: 'camera drone',
    acceptedInBatchNumber: 4,
    currentPriority: 'useful_extended',
    higherValueMissingConceptUk: 'дріт',
    higherValueMissingConceptEn: 'electrical wire / cord',
    missingConceptDomain: 'home_and_furniture',
    reconciliationNoteEn:
      'Everyday household/tech noun дріт (wire/cord, FREQ_6000_DB #1648) has higher daily utility than hobbyist camera drone.',
  },
  {
    acceptedLegacyVocabularyId: 'id-v2-1080',
    acceptedLegacyConceptId: 'noun-concept-1708',
    acceptedLegacyUk: 'ла́сти',
    acceptedLegacyEn: 'swim fins / flippers',
    acceptedInBatchNumber: 5,
    currentPriority: 'useful_extended',
    higherValueMissingConceptUk: 'вода́',
    higherValueMissingConceptEn: 'water (glass/pitcher of water)',
    missingConceptDomain: 'food_and_drinks',
    reconciliationNoteEn:
      'Foundational A0 noun вода́ (FREQ_6000_DB #111) is essential for dining and daily life compared to seasonal swim fins (ла́сти).',
  },
];

export interface IdentifyBatch5CoverageGapPlanningView {
  planningVersion: '5.0.0-batch5';
  preservedTotalGapAuditRecordsCount: 54;
  genuineMissingConceptsCount: 34;
  reclassifiedNonMissingConceptsCount: 20;
  genuineMissingConcepts: readonly IdentifyLexicalGapAuditRecord[];
  existingConceptsRequiringPreferredHeadwordNormalization: ReadonlyArray<{
    record: IdentifyLexicalGapAuditRecord;
    nowAcceptedThroughBatch5: boolean;
    acceptedVocabularyIdsInBatches1To5: readonly string[];
  }>;
  synonymsOfAlreadyAcceptedConcepts: readonly IdentifyLexicalGapAuditRecord[];
  conceptsStillRequiringManualReview: readonly IdentifyLexicalGapAuditRecord[];
  reconciliationCandidatesFlaggedForFinalShortlist: readonly IdentifyShortlistReconciliationCandidate[];
}

export function getBatch5VocabularyGapReconciliationPlan(
  acceptedVocabularyIdsThroughBatch5: ReadonlySet<string>
): IdentifyBatch5CoverageGapPlanningView {
  const genuineMissingConcepts = IDENTIFY_BATCH_4_LEXICAL_GAP_AUDIT_RECORDS.filter(
    (r) => r.relationshipType === 'GENUINELY_MISSING_CONCEPT' && r.countsAsMissingConcept
  );

  const headwordRecords = IDENTIFY_BATCH_4_LEXICAL_GAP_AUDIT_RECORDS.filter(
    (r) =>
      r.relationshipType === 'PREFERRED_HEADWORD' ||
      r.relationshipType === 'POLYSEMY'
  ).map((record) => {
    const acceptedIds = record.existingMasterVocabularyIds.filter((id) =>
      acceptedVocabularyIdsThroughBatch5.has(id)
    );
    return {
      record,
      nowAcceptedThroughBatch5: acceptedIds.length > 0,
      acceptedVocabularyIdsInBatches1To5: acceptedIds,
    };
  });

  const synonymsOfAlreadyAcceptedConcepts =
    IDENTIFY_BATCH_4_LEXICAL_GAP_AUDIT_RECORDS.filter(
      (r) =>
        r.relationshipType === 'SYNONYM' ||
        r.relationshipType === 'MORE_SPECIFIC_SUBTYPE' ||
        r.relationshipType === 'DUPLICATE'
    );

  const conceptsStillRequiringManualReview =
    IDENTIFY_BATCH_4_LEXICAL_GAP_AUDIT_RECORDS.filter(
      (r) =>
        !r.countsAsMissingConcept &&
        !r.existingMasterVocabularyIds.some((id) =>
          acceptedVocabularyIdsThroughBatch5.has(id)
        )
    );

  return {
    planningVersion: '5.0.0-batch5',
    preservedTotalGapAuditRecordsCount: 54,
    genuineMissingConceptsCount: 34,
    reclassifiedNonMissingConceptsCount: 20,
    genuineMissingConcepts,
    existingConceptsRequiringPreferredHeadwordNormalization: headwordRecords,
    synonymsOfAlreadyAcceptedConcepts,
    conceptsStillRequiringManualReview,
    reconciliationCandidatesFlaggedForFinalShortlist:
      IDENTIFY_FINAL_SHORTLIST_RECONCILIATION_FLAGS,
  };
}
