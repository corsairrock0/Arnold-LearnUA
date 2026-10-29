import type { StructuredCourseLesson } from './courseVisualComponents.ts';

export interface CourseDialogueLine {
  speaker: string;
  uk: string;
  en: string;
}

export interface CourseActiveRecallItem {
  promptEn: string;
  answerUk: string;
  hint: string;
}

export interface CourseQuestion {
  q: string;
  opts: string[];
  ans: number;
  exp: string;
  audioUk?: string;
}

export interface CoursePracticeDrill {
  prompt?: string;
  q?: string;
  opts: string[];
  ans: number;
  audioUk: string;
  exp: string;
  hint?: string;
}

export type CourseVocabTuple = [string, string, string, string?, string?];

export interface CourseModule {
  id: string;
  level: 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  topicTag: string;
  title: string;
  objectives: string[];
  summary: string;
  rules: string[];
  examples: Array<{ uk: string; en: string }>;
  dialogue: {
    title: string;
    lines: CourseDialogueLine[];
  };
  activeRecall: CourseActiveRecallItem[];
  reviewSummary: string;
  cfu: CourseQuestion[];
  practice: CoursePracticeDrill[];
  vocab: CourseVocabTuple[];
  exam: CourseQuestion[];
  structuredLesson?: StructuredCourseLesson | Record<string, any>;
}

export const COURSE_MODULES_A0_A1: CourseModule[] = [
  {
    id: 'A0.1',
    level: 'A0',
    topicTag: 'Pre-A1 Foundation • Alphabet & Vowels',
    title: 'Reading the Ukrainian Alphabet & Clear Vowels',
    objectives: [
      'Read your first everyday Ukrainian words using the 7 "True Friend" letters that look and sound like English (А, Е, І, К, М, О, Т).',
      'Spot and pronounce the 6 "Look-Alike" Cyrillic letters that look like English letters but make different sounds (В, Н, Р, С, У, Х).',
      'Hear and pronounce the difference between Ukrainian’s two "I" vowels—dotted І і ("ee" in meet) and undotted И и (short "i" in bit)—plus keep every unstressed О crisp and clear.',
      'Use natural Ukrainian sentence melody (intonation) to ask questions, make statements, and sound polite.',
    ],
    summary:
      'Ukrainian uses a 33-letter Cyrillic alphabet, and it has a huge advantage over English: almost every letter makes one consistent sound. Even better, Ukrainian vowels stay clear when unstressed—so once you know the letters and the accent mark (´), you can read any Ukrainian word aloud with confidence.',
    rules: [
      '<b>1. True Friends (7 Letters You Already Know)</b>: Seven Ukrainian letters look and sound almost exactly like English: <b>А а</b> ("ah" as in <i>father</i>), <b>Е е</b> ("eh" as in <i>met</i>), <b>І і</b> ("ee" as in <i>meet</i>), <b>К к</b> (<i>k</i>), <b>М м</b> (<i>m</i>), <b>О о</b> (rounded "o" as in <i>more</i>), and <b>Т т</b> (<i>t</i>). With just these seven letters, you can already read <b>ма́ма</b> (mom), <b>та́то</b> (dad), <b>кіт</b> (cat), <b>там</b> (there), and <b>те́ма</b> (topic)!',
      '<b>2. Look-Alikes with Different Sounds (6 "False Friends")</b>: Six letters look like familiar English letters, but they represent different sounds in Ukrainian: <b>В в</b> sounds like <i>v</i> (<b>вода́</b> = water), <b>Н н</b> sounds like <i>n</i> (<b>ні</b> = no), <b>Р р</b> is a quick tapped <i>r</i> (<b>ра́нок</b> = morning), <b>С с</b> always sounds like <i>s</i> (<b>сік</b> = juice), <b>У у</b> sounds like "oo" in <i>moon</i> (<b>тут</b> = here), and <b>Х х</b> is a warm, breathy "kh" sound made at the back of your mouth like in <i>Bach</i> or Scottish <i>loch</i> (<b>хліб</b> = bread).',
      '<b>3. The Two "I" Vowels: І і vs. И и</b>: Ukrainian has two distinct "i"-family vowels. Dotted <b>І і</b> is a bright, smiling "ee" sound as in <i>meet</i> (<b>сік</b> = juice, <b>мі́сто</b> = city, <b>дім</b> = house). Undotted <b>И и</b> (which looks like a backward capital N) sounds like the short, relaxed "i" in English <i>bit</i> or <i>sit</i> (<b>ти</b> = you, <b>ми</b> = we, <b>син</b> = son).',
      '<b>4. Word Stress (´) & Why Every Ukrainian "О" Stays Clear</b>: In learning materials, an accent mark (<b>´</b>) sits above the vowel in the stressed syllable—the syllable you say slightly louder and longer, as in <b>молоко́</b> (mo-lo-KO = milk). Unlike English (or Russian), Ukrainian <b>never</b> turns an unstressed <b>о</b> into an "uh" or "ah" sound. All three <b>о</b> vowels in <b>молоко́</b> sound like a clear, rounded "o".',
      '<b>5. Natural Vowel Harmony (е/и, о/у) & The 5 Sentence Melodies (Intonation)</b>:<ul><li><b>Subtle Unstressed Vowel Harmony</b>: While Ukrainian vowels never collapse into a blurry English "uh" [ə], in smooth everyday speech an unstressed <b>е</b> and <b>и</b> glide slightly toward each other (<b>село́</b> [се<sup>и</sup>ло́] = village, <b>весна́</b> [ве<sup>и</sup>сна́] = spring, <b>живе́</b> [жи<sup>е</sup>ве́] = lives), and an unstressed <b>о</b> right before a stressed syllable containing <b>у</b> rounds slightly toward "oo" [u] (<b>голу́бка</b> [го<sup>у</sup>лу́бка] = dove, <b>зозу́ля</b> [зо<sup>у</sup>зу́ля] = cuckoo).</li><li><b>5 Core Intonation Contours</b>: (1) <b>Statements</b> end with a calm falling pitch on the stressed syllable of the final key word (<i>Ось наш буди́нок.</i>); (2) <b>Wh-Questions</b> (starting with <i>хто, що, де, коли́, як</i>) begin with a high pitch on the question word and fall gently at the end (<i>Хто́ це? Де́ парк?</i>); (3) <b>Yes/No Questions without «чи»</b> keep the exact same word order as a statement and use a sharp rise-then-fall on the stressed syllable of the word you are asking about (<i>Це <b>ка́</b>ва? Ти <b>тут</b>?</i>); (4) <b>Contrastive «А...?» & Alternative «...чи...?» Questions</b> rise before <i>чи</i> ("or") and fall on the second choice (<i>Це чай чи ка́ва? А ти?</i>); (5) <b>Polite Requests</b> rise warmly on the action verb and fall gently on <i>будь ла́ска</i> ("please": <i>Скажі́ть, будь ла́ска!</i>).</li></ul>',
    ],
    examples: [
      { uk: 'Ма́ма, та́то і син удо́ма.', en: 'Mom, dad, and the son are at home.' },
      { uk: 'Тут ка́ва, чай і молоко́.', en: 'Here are coffee, tea, and milk.' },
      { uk: 'Це мій кіт і мій дім.', en: 'This is my cat and my house.' },
      { uk: 'Так, це сві́жий сік і хліб.', en: 'Yes, this is fresh juice and bread.' },
      { uk: 'Це ка́ва чи чай? — Це ка́ва. А де молоко́?', en: 'Is this coffee or tea (rising on coffee, falling on tea)? — This is coffee. And where is the milk?' },
    ],
    dialogue: {
      title: 'At the Breakfast Table',
      lines: [
        { speaker: 'Ма́ма', uk: 'До́брого ра́нку! Ось ка́ва і молоко́.', en: 'Good morning! Here are coffee and milk.' },
        { speaker: 'Та́то', uk: 'Дя́кую! А де сік і хліб?', en: 'Thank you! And where are the juice and bread?' },
        { speaker: 'Ма́ма', uk: 'Сік і хліб тут, на столі́.', en: 'The juice and bread are right here on the table.' },
      ],
    },
    activeRecall: [
      { promptEn: 'mom', answerUk: 'ма́ма', hint: 'Uses the same M and A letters as English' },
      { promptEn: 'milk (stress on the last syllable)', answerUk: 'молоко́', hint: 'All three vowels are pronounced as a clear "o"' },
      { promptEn: 'you (informal singular)', answerUk: 'ти', hint: 'Uses Т + short vowel и (like "i" in bit)' },
      { promptEn: 'water', answerUk: 'вода́', hint: 'Starts with В (v-sound) and ends in stressed -а́' },
    ],
    reviewSummary:
      'Remember the 6 simple vowels: А (ah), О (clear rounded o), У (oo in moon), Е (eh in met), І (long ee in meet), and И (short i in bit). Every Ukrainian "о" stays a clear "o" sound even when unstressed!',
    cfu: [
      {
        q: 'How is the Ukrainian word «молоко́» (milk) pronounced?',
        opts: [
          'Malako (the first two o’s turn into "a")',
          'Mo-lo-KO (all three "о" vowels sound like a clear "o", with stress on the last syllable)',
          'Mi-li-KO',
        ],
        ans: 1,
        exp: 'In Ukrainian, unstressed "о" always keeps its clear "o" sound. Only the last syllable (-ко́) is stressed: mo-lo-KO.',
      },
      {
        q: 'What is the difference in sound between the Ukrainian vowels «І і» and «И и»?',
        opts: [
          '«І і» sounds like "ee" in "meet", while «И и» sounds like short "i" in "bit"',
          'Both sound identical in Ukrainian',
          '«И и» is silent at the end of a word',
        ],
        ans: 0,
        exp: 'Dotted «і» is a high front "ee" sound (as in мі́сто), whereas «и» is a short relaxed vowel like "i" in English "bit" (as in ти, ми, син).',
      },
      {
        q: 'Which English sound does the Ukrainian letter «В в» represent at the start of «вода́» (water)?',
        opts: ['"b" as in boy', '"w" as in window', '"v" as in voice'],
        ans: 2,
        exp: 'Before a vowel (like о in вода́), Ukrainian «В в» sounds like English "v": vo-DA.',
      },
    ],
    practice: [
      {
        prompt: 'Read the Ukrainian word and choose the word that means "cat":',
        opts: ['кіт', 'там', 'ма́ма'],
        ans: 0,
        audioUk: 'кіт',
        exp: '«кіт» (pronounced "keet") means "cat".',
      },
      {
        prompt: 'Which Ukrainian word means "we" (pronounced with the short vowel in "bit")?',
        opts: ['ма́ма', 'ми', 'ні'],
        ans: 1,
        audioUk: 'ми',
        exp: '«ми» means "we", while «ти» means "you" (informal singular).',
      },
      {
        prompt: 'Which word means "here" and uses the vowel «у» ("oo" as in moon)?',
        opts: ['так', 'тут', 'дім'],
        ans: 1,
        audioUk: 'тут',
        exp: '«тут» (pronounced "toot") means "here".',
      },
      {
        prompt: 'Look at the Cyrillic letters in «ка́ва». What does this everyday word mean?',
        opts: ['water', 'coffee', 'city'],
        ans: 1,
        audioUk: 'ка́ва',
        exp: '«ка́ва» (KA-va) means "coffee".',
      },
      {
        prompt: 'Which word means "yes" in Ukrainian?',
        opts: ['ні', 'так', 'хто'],
        ans: 1,
        audioUk: 'так',
        exp: '«так» means "yes", and «ні» means "no".',
      },
    ],
    vocab: [
      ['ма́ма', 'NOUN', 'mom / mother', 'Це моя́ ма́ма.', 'This is my mom.'],
      ['та́то', 'NOUN', 'dad / father', 'Мій та́то вдо́ма.', 'My dad is at home.'],
      ['кіт', 'NOUN', 'cat', 'Ось наш кіт.', 'Here is our cat.'],
      ['дім', 'NOUN', 'house / home', 'Це вели́кий дім.', 'This is a big house.'],
      ['вода́', 'NOUN', 'water', 'Тут є сві́жа вода́.', 'There is fresh water here.'],
      ['молоко́', 'NOUN', 'milk', 'Я люблю́ молоко́.', 'I like milk.'],
      ['ка́ва', 'NOUN', 'coffee', 'Це гаря́ча ка́ва.', 'This is hot coffee.'],
      ['чай', 'NOUN', 'tea', 'Ось зелений чай.', 'Here is green tea.'],
      ['хліб', 'NOUN', 'bread', 'Хліб на столі́.', 'The bread is on the table.'],
      ['ти', 'PRON', 'you (informal singular)', 'Де ти за́раз?', 'Where are you right now?'],
      ['ми', 'PRON', 'we', 'Ми вже тут.', 'We are already here.'],
      ['так', 'PART', 'yes', 'Так, це пра́вда.', 'Yes, that is true.'],
      ['ні', 'PART', 'no', 'Ні, дя́кую.', 'No, thank you.'],
      ['тут', 'ADV', 'here', 'Я живу́ тут.', 'I live here.'],
      ['там', 'ADV', 'there', 'Кав’я́рня там.', 'The coffee shop is over there.'],
    ],
    exam: [
      {
        q: 'What does the Ukrainian word «вода́» mean?',
        opts: ['coffee', 'water', 'bread'],
        ans: 1,
        exp: '«вода́» (vo-DA) means "water".',
      },
      {
        q: 'Which letter in «ні» (no) represents the "n" sound?',
        opts: ['Н н', 'І і', 'П п'],
        ans: 0,
        exp: 'Ukrainian «Н н» represents the "n" sound.',
      },
      {
        q: 'What do «ти» and «ми» mean in English?',
        opts: ['"he" and "she"', '"you (singular)" and "we"', '"here" and "there"'],
        ans: 1,
        exp: '«ти» is "you" (informal singular) and «ми» is "we".',
      },
      {
        q: 'How is the vowel «у» pronounced in «тут» (here)?',
        opts: ['Like "oo" in "moon"', 'Like "u" in "cup"', 'Like "y" in "yes"'],
        ans: 0,
        exp: 'Ukrainian «у» always sounds like a pure "oo" as in "moon".',
      },
      {
        q: 'In the word «молоко́», which syllable is stressed?',
        opts: ['The first syllable (мо-)', 'The middle syllable (-ло-)', 'The final syllable (-ко́)'],
        ans: 2,
        exp: 'The acute accent mark shows stress on the final syllable: молоко́.',
      },
      {
        q: 'Choose the correct translation of «Тут ка́ва і молоко́»:',
        opts: ['Here are coffee and milk.', 'Where is the water?', 'There is tea and bread.'],
        ans: 0,
        exp: '«тут» = here, «ка́ва» = coffee, «і» = and, «молоко́» = milk.',
      },
    ],
    structuredLesson: {
      prerequisites: [
        { modId: 'A0.1', label: 'Start Here — Module 1 of 29 (No prior Ukrainian needed)' },
      ],
      relatedTopics: [
        'Next Module: A0.2 (Consonants Г vs. Ґ, Soft Sign ь & Apostrophe ’)',
        'Phonetics & G2P Sound Lab (Interactive IPA & Cursive Practice)',
        'Everyday Vocab: Greetings, Politeness & Introductions',
      ],
      bigIdea: {
        headline: 'Ukrainian Is Read Almost Exactly How It Is Written',
        plainEnglish:
          'In English, the same vowel letter can make five different sounds (think of the "o" in "hot", "home", "women", "love", and "to"). Ukrainian is the exact opposite: its 33-letter Cyrillic alphabet is designed so one letter corresponds to one reliable sound.',
        englishComparison:
          'In English, unstressed vowels usually blur into a lazy "uh" sound (like the first "a" in "banana" or the "o" in "police"). In Ukrainian, vowels stay crisp and recognizable even when they are not stressed—especially the vowel О, which always sounds like a clean "o".',
        keyInsight:
          'Instead of memorizing 33 letters in isolation, divide the alphabet into groups: (1) Letters you already know from English ("True Friends"), (2) Letters that look like English but make a different sound ("Look-Alikes"), and (3) The 6 pure vowels.',
      },
      seeItInAction: [
        {
          uk: 'Ма́ма і та́то вдо́ма.',
          highlightUk: 'та́то',
          phoneticGuide: 'MA-ma ee TA-to VDO-ma',
          en: 'Mom and dad are at home.',
          contextLabel: 'Pattern 1 • True Friends + Clear Unstressed O',
          whyItWorks:
            'Every single letter in «ма́ма», «і», and «та́то» looks and sounds like English! Notice that the final unstressed -о in «та́то» stays a crisp "o" (TA-to, never "TA-tuh").',
          segments: [
            { partUk: 'Ма́ма', roleLabel: 'Noun (Subject)', explanation: 'mom (stress on first syllable МА-)' },
            { partUk: 'і', roleLabel: 'Conjunction', explanation: 'and (pronounced "ee")' },
            { partUk: 'та́то', roleLabel: 'Noun (Subject)', explanation: 'dad (unstressed final -о stays clear)' },
            { partUk: 'вдо́ма', roleLabel: 'Adverb', explanation: 'at home' },
          ],
        },
        {
          uk: 'Тут ка́ва, чай і молоко́.',
          highlightUk: 'молоко́',
          phoneticGuide: 'toot KA-va, chay ee mo-lo-KO',
          en: 'Here are coffee, tea, and milk.',
          contextLabel: 'Pattern 2 • All Three "O" Vowels Stay Clear',
          whyItWorks:
            'In «молоко́» (milk), the accent mark (´) is on the last syllable (-ко́). Even though the first two syllables (мо-ло-) are unstressed, they are pronounced with a clear rounded "o": mo-lo-KO.',
          segments: [
            { partUk: 'Тут', roleLabel: 'Adverb', explanation: 'here (у = "oo" as in moon)' },
            { partUk: 'ка́ва', roleLabel: 'Noun', explanation: 'coffee (в = "v" sound)' },
            { partUk: 'чай', roleLabel: 'Noun', explanation: 'tea (ч = "ch" + ай = "ay")' },
            { partUk: 'молоко́', roleLabel: 'Noun', explanation: 'milk (stress on final -ко́)' },
          ],
        },
        {
          uk: 'Це мій кіт, а там наш дім.',
          highlightUk: 'кіт',
          phoneticGuide: 'tse meey keet, a tam nash deem',
          en: 'This is my cat, and over there is our house.',
          contextLabel: 'Pattern 3 • Dotted І і ("ee" as in meet)',
          whyItWorks:
            'Whenever you see dotted «І і» in Ukrainian (as in кіт = cat or дім = house), pronounce it like a clean, smiling "ee" in English "meet".',
          segments: [
            { partUk: 'Це', roleLabel: 'Pronoun / Particle', explanation: 'this is (ц = "ts" as in cats)' },
            { partUk: 'мій кіт', roleLabel: 'Noun Phrase', explanation: 'my cat (кіт = keet)' },
            { partUk: 'там', roleLabel: 'Adverb', explanation: 'there (True Friend letters T-A-M)' },
            { partUk: 'дім', roleLabel: 'Noun', explanation: 'house / home (дім = deem)' },
          ],
        },
        {
          uk: 'Ти вже тут? — Так, ми вже тут!',
          highlightUk: 'Ти',
          phoneticGuide: 'tih vzhe toot? — tak, mih vzhe toot!',
          en: 'Are you already here? — Yes, we are already here!',
          contextLabel: 'Pattern 4 • Undotted И и (short "i" in bit) + Question Melody',
          whyItWorks:
            'Undotted «И и» in «ти» (you) and «ми» (we) makes the short, relaxed "i" sound in English "bit" or "sit". Notice how «Ти вже тут?» uses exact statement word order—your voice simply rises and falls on «тут» to make it a question!',
          segments: [
            { partUk: 'Ти', roleLabel: 'Pronoun', explanation: 'you (informal singular, short "i" sound)' },
            { partUk: 'вже тут?', roleLabel: 'Question Focus', explanation: 'already here? (rise-fall pitch on тут)' },
            { partUk: 'Так', roleLabel: 'Particle', explanation: 'yes' },
            { partUk: 'ми', roleLabel: 'Pronoun', explanation: 'we (short "i" sound in bit)' },
          ],
        },
      ],
      patternTables: [
        {
          title: '1. The 7 "True Friends" (Letters That Look & Sound Like English)',
          subtitle: 'Start reading Ukrainian immediately with these 7 familiar letters. Tap any Ukrainian word to hear its pronunciation.',
          headers: ['Ukrainian Letter', 'Sound (IPA)', 'Sounds Like in English', 'First Ukrainian Word', 'Meaning'],
          rows: [
            {
              cells: [
                { text: 'А а', badge: 'Vowel' },
                '[ɑ]',
                'Open "ah" in father',
                { text: 'ма́ма', audioUk: 'ма́ма', highlight: 'а́', subtext: 'MA-ma' },
                'mom / mother',
              ],
            },
            {
              cells: [
                { text: 'Е е', badge: 'Vowel' },
                '[ɛ]',
                'Clean "eh" in met or bed',
                { text: 'те́ма', audioUk: 'те́ма', highlight: 'е́', subtext: 'TE-ma' },
                'topic / theme',
              ],
            },
            {
              cells: [
                { text: 'І і', badge: 'Vowel' },
                '[i]',
                'Long "ee" in meet or see',
                { text: 'кіт', audioUk: 'кіт', highlight: 'і', subtext: 'keet' },
                'cat',
              ],
            },
            {
              cells: [
                { text: 'О о', badge: 'Vowel' },
                '[ɔ]',
                'Rounded "o" in more (never "uh")',
                { text: 'та́то', audioUk: 'та́то', highlight: 'о', subtext: 'TA-to' },
                'dad / father',
              ],
            },
            {
              cells: [
                { text: 'К к', badge: 'Consonant' },
                '[k]',
                '"k" in kite (without a big puff of air)',
                { text: 'ка́ва', audioUk: 'ка́ва', highlight: 'к', subtext: 'KA-va' },
                'coffee',
              ],
            },
            {
              cells: [
                { text: 'М м', badge: 'Consonant' },
                '[m]',
                '"m" in mom',
                { text: 'ми', audioUk: 'ми', highlight: 'м', subtext: 'mih' },
                'we',
              ],
            },
            {
              cells: [
                { text: 'Т т', badge: 'Consonant' },
                '[t]',
                'Crisp "t" with tongue tip touching upper teeth',
                { text: 'там', audioUk: 'там', highlight: 'т', subtext: 'tam' },
                'there',
              ],
            },
          ],
          footnote: 'With only these 7 letters, you can already read ма́ма, та́то, кіт, там, так, and те́ма!',
        },
        {
          title: '2. The 6 "Look-Alikes" (Familiar Shapes, Different Ukrainian Sounds)',
          subtitle: 'These letters look like English B, H, P, C, Y, and X—but in Cyrillic they represent completely different sounds.',
          headers: ['Ukrainian Letter', 'Looks Like English...', 'Actual Ukrainian Sound', 'Everyday Example', 'Meaning'],
          rows: [
            {
              cells: [
                { text: 'В в', badge: 'Not B!' },
                'Capital B',
                '"v" in voice (or "w" at the end of a syllable)',
                { text: 'вода́', audioUk: 'вода́', highlight: 'в', subtext: 'vo-DA' },
                'water',
              ],
            },
            {
              cells: [
                { text: 'Н н', badge: 'Not H!' },
                'Capital H',
                '"n" in no or nine',
                { text: 'ні', audioUk: 'ні', highlight: 'н', subtext: 'nee' },
                'no',
              ],
            },
            {
              cells: [
                { text: 'Р р', badge: 'Not P!' },
                'Capital P',
                'Rolled / tapped "r" (like Spanish r or quick tt in butter)',
                { text: 'ра́нок', audioUk: 'ра́нок', highlight: 'р', subtext: 'RA-nok' },
                'morning',
              ],
            },
            {
              cells: [
                { text: 'С с', badge: 'Always S!' },
                'Letter C',
                'Always "s" in sun (never "k"!)',
                { text: 'сік', audioUk: 'сік', highlight: 'с', subtext: 'seek' },
                'juice',
              ],
            },
            {
              cells: [
                { text: 'У у', badge: 'Vowel' },
                'Lowercase y',
                'Pure "oo" in moon or boot',
                { text: 'тут', audioUk: 'тут', highlight: 'у', subtext: 'toot' },
                'here',
              ],
            },
            {
              cells: [
                { text: 'Х х', badge: 'Not X!' },
                'Letter X',
                'Breathy "kh" in Bach or Scottish loch',
                { text: 'хліб', audioUk: 'хліб', highlight: 'х', subtext: 'khleeb' },
                'bread',
              ],
            },
          ],
          footnote: 'Memory trick: Think of «СССР» on old hockey jerseys—in Cyrillic, С is S and Р is R!',
        },
        {
          title: '3. New Cyrillic Shapes You Will Use Every Day (Д, Л, П, Б, З, Ч, Й)',
          subtitle: 'These letters have distinctive Cyrillic shapes, but their sounds exist right in English.',
          headers: ['Ukrainian Letter', 'English Sound Match', 'Memory Shape Cue', 'Everyday Word', 'Meaning'],
          rows: [
            {
              cells: [
                'Б б [b]',
                '"b" in boy',
                'Looks like a lowercase b with a flat roof on top',
                { text: 'ба́ба', audioUk: 'ба́ба', subtext: 'BA-ba' },
                'grandma (colloquial)',
              ],
            },
            {
              cells: [
                'Д д [d]',
                '"d" in door',
                'Looks like a house with a roof and two foundation legs',
                { text: 'дім', audioUk: 'дім', subtext: 'deem' },
                'house / home',
              ],
            },
            {
              cells: [
                'Л л [l]',
                '"l" in lamp',
                'A pointed tent peak (like Greek Lambda Λ)',
                { text: 'молоко́', audioUk: 'молоко́', subtext: 'mo-lo-KO' },
                'milk',
              ],
            },
            {
              cells: [
                'П п [p]',
                '"p" in park',
                'Looks like the math symbol Pi (π) or a doorway',
                { text: 'парк', audioUk: 'парк', subtext: 'park' },
                'park',
              ],
            },
            {
              cells: [
                'З з [z]',
                '"z" in zoo',
                'Looks like the number 3, buzzing like a bee',
                { text: 'за́раз', audioUk: 'за́раз', subtext: 'ZA-raz' },
                'right now',
              ],
            },
            {
              cells: [
                'Ч ч [tʃ]',
                '"ch" in chair',
                'Looks like a small chair or the number 4',
                { text: 'чай', audioUk: 'чай', subtext: 'chay' },
                'tea',
              ],
            },
            {
              cells: [
                'Й й [j]',
                '"y" glide in boy or yes',
                'An И with a little curved hat that glides quickly',
                { text: 'мій', audioUk: 'мій', subtext: 'meey' },
                'my (masculine)',
              ],
            },
          ],
        },
      ],
      diagrams: [
        {
          title: 'The 6 Core Simple Vowels of Ukrainian (А, О, У, Е, І, И)',
          subtitle: 'Tap any card to hear the vowel in a real word. Pay special attention to the contrast between dotted І і and undotted И и.',
          diagramType: 'vowel-grid',
          vowelItems: [
            {
              letter: 'А а',
              ipa: '[ɑ]',
              soundLikeEn: '"ah" in father',
              mouthPosition: 'Mouth open wide, tongue relaxed and low.',
              sampleWordUk: 'ма́ма',
              sampleWordEn: 'mom',
              contrastNote: 'Stays a clear open "ah" whether stressed or unstressed.',
            },
            {
              letter: 'О о',
              ipa: '[ɔ]',
              soundLikeEn: '"o" in more / story',
              mouthPosition: 'Lips gently rounded in a circle.',
              sampleWordUk: 'молоко́',
              sampleWordEn: 'milk',
              contrastNote: 'Never turns into "ah" or "uh" when unstressed!',
            },
            {
              letter: 'У у',
              ipa: '[u]',
              soundLikeEn: '"oo" in moon / boot',
              mouthPosition: 'Lips rounded tightly forward.',
              sampleWordUk: 'тут',
              sampleWordEn: 'here',
              contrastNote: 'Looks like English y, but always sounds like pure "oo".',
            },
            {
              letter: 'Е е',
              ipa: '[ɛ]',
              soundLikeEn: '"eh" in met / ten',
              mouthPosition: 'Mouth medium-open, no "y" glide at the start.',
              sampleWordUk: 'те́ма',
              sampleWordEn: 'topic',
              contrastNote: 'Pure "eh" sound (never "ee" or "yeh").',
            },
            {
              letter: 'І і',
              ipa: '[i]',
              soundLikeEn: '"ee" in meet / see',
              mouthPosition: 'Corners of lips spread in a gentle smile; tongue high in front.',
              sampleWordUk: 'сік',
              sampleWordEn: 'juice',
              contrastNote: 'Has a dot on top! Softens the consonant before it.',
            },
            {
              letter: 'И и',
              ipa: '[ɪ]',
              soundLikeEn: 'short "i" in bit / sit',
              mouthPosition: 'Relax your smile and pull the tongue slightly back from І.',
              sampleWordUk: 'ти / ми',
              sampleWordEn: 'you / we',
              contrastNote: 'No dot! Sounds deeper and shorter than dotted І і.',
            },
          ],
        },
        {
          title: 'The 5 Ukrainian Intonation Contours (Sentence Melodies)',
          subtitle: 'In Ukrainian, you often turn a statement into a question using your voice pitch alone—without changing word order! Tap any card to listen.',
          diagramType: 'intonation-contours',
          intonationItems: [
            {
              id: 'Contour 1',
              title: 'Calm Statement',
              patternLabel: 'Steady → Fall ↘',
              svgPath: 'M 20 26 L 145 26 Q 185 26 235 50',
              pitchPoints: [
                { x: 40, y: 26, label: 'Ось' },
                { x: 115, y: 26, label: 'наш' },
                { x: 215, y: 48, label: 'буди́нок ↘' },
              ],
              exampleUk: 'Ось наш буди́нок.',
              focusWordUk: 'буди́нок',
              exampleEn: 'Here is our house.',
              howToSoundNatural: 'Keep a level conversational tone, then drop your pitch calmly on the stressed syllable (-ди́-) of the final word.',
            },
            {
              id: 'Contour 2',
              title: 'Wh-Question (хто, що, де, як)',
              patternLabel: 'High Start ↗ → Fall ↘',
              svgPath: 'M 25 16 Q 75 14 125 32 L 235 48',
              pitchPoints: [
                { x: 45, y: 16, label: 'Де́ ↗' },
                { x: 140, y: 34, label: 'молоко́' },
                { x: 225, y: 48, label: '↘' },
              ],
              exampleUk: 'Де́ молоко́?',
              focusWordUk: 'Де́',
              exampleEn: 'Where is the milk?',
              howToSoundNatural: 'Start with an energetic high pitch right on the question word (Де́, Хто́, Що́), then let your voice fall toward the end.',
            },
            {
              id: 'Contour 3',
              title: 'Yes/No Question (No «чи» Needed)',
              patternLabel: 'Sharp Rise-Fall ↗↘ on Focus Word',
              svgPath: 'M 20 38 L 115 38 Q 165 8 195 20 L 238 48',
              pitchPoints: [
                { x: 55, y: 38, label: 'Це' },
                { x: 172, y: 14, label: 'ка́- ↗' },
                { x: 228, y: 48, label: '-ва? ↘' },
              ],
              exampleUk: 'Це ка́ва?',
              focusWordUk: 'ка́ва',
              exampleEn: 'Is this coffee?',
              howToSoundNatural: 'Keep the exact same word order as «Це ка́ва.» ("This is coffee"), but lift your pitch sharply on the stressed syllable «ка́-» and drop on «-ва».',
            },
            {
              id: 'Contour 4',
              title: 'Alternative («...чи...?») & «А ти?» Questions',
              patternLabel: 'Rise on Option 1 ↗ → Fall on Option 2 ↘',
              svgPath: 'M 20 38 L 85 16 L 145 34 L 235 50',
              pitchPoints: [
                { x: 82, y: 16, label: 'чай ↗' },
                { x: 142, y: 34, label: 'чи' },
                { x: 218, y: 50, label: 'ка́ва? ↘' },
              ],
              exampleUk: 'Це чай чи ка́ва?',
              focusWordUk: 'чи',
              exampleEn: 'Is this tea or coffee?',
              howToSoundNatural: 'Raise your voice on the first choice before «чи» (or), pause for a split second, and drop your voice on the final choice.',
            },
            {
              id: 'Contour 5',
              title: 'Warm Polite Request',
              patternLabel: 'Warm Rise ↗ → Gentle Fall ↘',
              svgPath: 'M 20 34 Q 75 14 120 24 Q 180 38 235 46',
              pitchPoints: [
                { x: 75, y: 18, label: 'Скажі́ть ↗' },
                { x: 160, y: 34, label: 'будь' },
                { x: 220, y: 46, label: 'ла́ска ↘' },
              ],
              exampleUk: 'Скажі́ть, будь ла́ска!',
              focusWordUk: 'будь ла́ска',
              exampleEn: 'Tell me, please!',
              howToSoundNatural: 'Lift your tone warmly on the request verb («Скажі́ть»), then glide down gently on «будь ла́ска» (please) to sound friendly and respectful.',
            },
          ],
        },
      ],
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Start with the 7 "True Friends" (А, Е, І, К, М, О, Т)',
          plainRule:
            'Don’t let the word "Cyrillic" intimidate you—both the English (Latin) and Ukrainian (Cyrillic) alphabets evolved from the ancient Greek alphabet. Seven Ukrainian letters look and sound almost identical to English, so you can read whole words right away.',
          formula: 'М + А + М + А = ма́ма (mom)  •  К + І + Т = кіт (cat)  •  Т + А + М = там (there)',
          examplesUk: [
            { uk: 'ма́ма', en: 'mom', note: 'stress on first syllable' },
            { uk: 'та́то', en: 'dad', note: 'both vowels stay clear' },
            { uk: 'кіт', en: 'cat', note: 'і = "ee" in meet' },
            { uk: 'так', en: 'yes', note: 'а = open "ah"' },
          ],
        },
        {
          stepNumber: 2,
          title: 'Retrain Your Eyes for the 6 "Look-Alikes" (В, Н, Р, С, У, Х)',
          plainRule:
            'When an English speaker sees «вода́» or «ні», their brain automatically wants to read "boda" or "hi". Whenever you spot В, Н, Р, С, У, or Х in a Ukrainian word, pause for half a second and swap in its real Ukrainian sound.',
          formula: 'В = v  •  Н = n  •  Р = tapped r  •  С = s  •  У = oo  •  Х = breathy kh',
          examplesUk: [
            { uk: 'вода́', en: 'water', note: 'vo-DA (В = v)' },
            { uk: 'ні', en: 'no', note: 'nee (Н = n)' },
            { uk: 'сік', en: 'juice', note: 'seek (С = s)' },
            { uk: 'тут', en: 'here', note: 'toot (У = oo)' },
            { uk: 'хліб', en: 'bread', note: 'khleeb (Х = kh)' },
          ],
        },
        {
          stepNumber: 3,
          title: 'Tell the Two "I" Vowels Apart: Dotted І і vs. Undotted И и',
          plainRule:
            'Ukrainian has two different letters that English speakers often group together as "i". Dotted «І і» is a high, smiling "ee" as in "meet". Undotted «И и» (which looks like a backward capital N) is the relaxed, short "i" sound in English "bit" or "sit".',
          formula: 'І і = "ee" in meet (дім, сік, ні)   vs.   И и = short "i" in bit (ти, ми, син)',
          examplesUk: [
            { uk: 'дім', en: 'house / home', note: 'dotted і = deem' },
            { uk: 'ти', en: 'you (singular)', note: 'undotted и = tih' },
            { uk: 'ми', en: 'we', note: 'undotted и = mih' },
            { uk: 'син', en: 'son', note: 'undotted и = sihn' },
          ],
          exception: {
            badge: 'Everyday Essential',
            title: 'Why the Difference Matters',
            explanation:
              'Swapping «і» and «и» can change the meaning or grammar of a word! Plus, dotted «і» softens the consonant right before it, while «и» keeps the consonant hard.',
            examples: [
              { uk: 'кіт', en: 'cat (with dotted і)' },
              { uk: 'кит', en: 'whale (with undotted и!)' },
            ],
          },
        },
        {
          stepNumber: 4,
          title: 'Keep Every "О" Clear — Even When Unstressed',
          plainRule:
            'In Ukrainian textbooks and dictionaries, an acute accent mark (´) shows which syllable receives the main word stress (extra energy and length). Unlike English or Russian, Ukrainian does NOT turn unstressed "о" into "ah" or "uh". Every «о» in a word is pronounced as a clear, rounded "o".',
          formula: 'молоко́ = [mɔ-lɔ-ˈkɔ] (mo-lo-KO, never "mah-lah-KO")',
          examplesUk: [
            { uk: 'молоко́', en: 'milk', note: 'all three O vowels sound like clear "o"' },
            { uk: 'вода́', en: 'water', note: 'vo-DA, never "vah-DA"' },
            { uk: 'до́брого ра́нку', en: 'good morning', note: 'every unstressed о stays rounded' },
          ],
          exception: {
            badge: 'Watch Out',
            title: 'Moving the Stress Can Change the Word!',
            explanation:
              'Word stress in Ukrainian is "free"—it can fall on any syllable, and sometimes two words are spelled with the exact same letters and differ only by where the stress lands.',
            examples: [
              { uk: 'за́мок', en: 'castle (stress on first syllable ЗА-)' },
              { uk: 'замо́к', en: 'lock (stress on second syllable -МОК)' },
            ],
          },
        },
        {
          stepNumber: 5,
          title: 'Ask Questions with Voice Melody (Intonation) Instead of Helping Verbs',
          plainRule:
            'In English, you have to rearrange words or add "do/does/is/are" to ask a question ("This is coffee" → "Is this coffee?"). In Ukrainian, you can keep the exact same word order and simply lift your pitch on the stressed syllable of the word you are asking about!',
          formula: 'Statement: Це ка́ва. (↘ fall)   →   Question: Це ка́ва? (↗↘ rise-fall on ка́-)',
          examplesUk: [
            { uk: 'Це ка́ва?', en: 'Is this coffee?', note: 'sharp rise-fall on ка́-' },
            { uk: 'Це чай чи ка́ва?', en: 'Is this tea or coffee?', note: 'rise on чай, fall on ка́ва' },
            { uk: 'А де молоко́?', en: 'And where is the milk?', note: 'high start on де, fall at the end' },
          ],
        },
      ],
      moreExamples: [
        {
          groupTitle: 'Group 1: Everyday Words Using Familiar Letters & Clear Vowels',
          groupNote: 'Practice reading these out loud—every letter follows the exact sound rules from the tables above.',
          items: [
            {
              uk: 'Ось ка́ва і молоко́.',
              highlightUk: 'Ось',
              phoneticGuide: 'os KA-va ee mo-lo-KO',
              en: 'Here are coffee and milk.',
              whyItWorks: '«Ось» means "here is / behold" (used when pointing to or handing something to someone).',
            },
            {
              uk: 'Мій та́то і моя́ ма́ма тут.',
              highlightUk: 'тут',
              phoneticGuide: 'meey TA-to ee mo-YA MA-ma toot',
              en: 'My dad and my mom are here.',
              whyItWorks: 'Notice how Ukrainian does not need a word for "are" (is/am/are) in the present tense!',
            },
          ],
        },
        {
          groupTitle: 'Group 2: Contrasting Dotted І і ("ee") vs. Undotted И и ("short i")',
          groupNote: 'Listen closely to how smiling «і» contrasts with relaxed «и».',
          items: [
            {
              uk: 'Ми вдо́ма, і наш кіт теж тут.',
              highlightUk: 'Ми',
              phoneticGuide: 'mih VDO-ma, ee nash keet tezh toot',
              en: 'We are at home, and our cat is here too.',
              whyItWorks: '«Ми» uses short «и» (mih), while «і» (ee) and «кіт» (keet) use dotted «і».',
            },
            {
              uk: 'Ні, це сві́жий сік і хліб.',
              highlightUk: 'сік',
              phoneticGuide: 'nee, tse SVEE-zhyy seek ee khleeb',
              en: 'No, this is fresh juice and bread.',
              whyItWorks: 'All three nouns/particles («ні», «сік», «хліб») feature the crisp dotted «і» vowel [i].',
            },
          ],
        },
      ],
      importantExceptions: [
        {
          badge: 'Everyday Essential',
          title: 'No Present-Tense "Am / Is / Are" Needed in Ukrainian',
          rule: 'When you read sentences like «Ма́ма тут» (Mom is here) or «Це ка́ва» (This is coffee), you won’t see a word for "is" or "are". In modern Ukrainian, the present tense of "to be" is usually left out completely!',
          examples: [
            { uk: 'Ма́ма вдо́ма.', en: 'Mom [is] at home.' },
            { uk: 'Хліб на столі́.', en: 'The bread [is] on the table.' },
          ],
        },
        {
          badge: 'Natural Speech Detail',
          title: 'Subtle Unstressed Vowel Harmony ([е/и] and [о/у])',
          rule: 'While Ukrainian vowels never turn into an English schwa ("uh"), in natural connected speech an unstressed Е and И move slightly closer to each other in sound, and an unstressed О right before a stressed syllable containing У rounds slightly toward [u]. You do not need to force this—it happens naturally when you speak smoothly!',
          examples: [
            { uk: 'село́', en: 'village', note: 'unstressed е sounds slightly closer to и: [сеило́]' },
            { uk: 'весна́', en: 'spring', note: 'unstressed е glides slightly toward и: [веисна́]' },
            { uk: 'живе́', en: 'lives', note: 'unstressed и glides slightly toward е: [жиеве́]' },
            { uk: 'голу́бка', en: 'dove / darling', note: 'unstressed о before stressed у́ rounds slightly: [гоулу́бка]' },
          ],
        },
      ],
      commonMistakes: [
        {
          topic: 'Pronouncing Unstressed "О" Like an "A" or "Uh"',
          wrongText: 'малако́ (mah-lah-KO) / вада́ (vah-DA)',
          rightText: 'молоко́ (mo-lo-KO) / вода́ (vo-DA)',
          audioUk: 'молоко́, вода́',
          whyWrong:
            'English (and Russian) speakers are used to reducing unstressed "o" into "ah" or "uh". In standard Ukrainian, turning unstressed "о" into "a" sounds unnatural—every "о" stays rounded.',
          howToRemember: 'Keep your lips gently rounded on every single «о» you see in a Ukrainian word.',
        },
        {
          topic: 'Reading Cyrillic Look-Alikes as English Letters',
          wrongText: 'Reading «вода́» as "boda" or «ні» as "hi"',
          rightText: 'вода́ = vo-DA ("water") • ні = nee ("no")',
          audioUk: 'вода́, ні',
          whyWrong:
            'Cyrillic «В» comes from Greek Beta after it shifted to a "v" sound, and «Н» comes from Greek Eta/Nu.',
          howToRemember: 'Associate «вода́» with "Vital Water" (В = V) and «ні» with "No / Never" (Н = N).',
        },
        {
          topic: 'Pronouncing Undotted «И и» Like Dotted «І і»',
          wrongText: 'Pronouncing «ти» (you) and «ми» (we) as "tee" and "mee"',
          rightText: 'ти (tih) and ми (mih) — with the short "i" in English "bit"',
          audioUk: 'ти, ми',
          whyWrong:
            'If you say "tee" and "mee" with a high smiling "ee", you are pronouncing «ті» and «мі» instead of «ти» and «ми».',
          howToRemember: 'Dot on top («і») = bright smile ("ee" in meet). No dot («и») = relaxed jaw ("i" in bit).',
        },
      ],
      embeddedChecks: [
        {
          id: 'kc-1',
          question: 'You see the word «молоко́» on a café menu in Lviv. How should you pronounce the three «о» vowels?',
          options: [
            'Turn the first two into "ah" (mah-lah-KO)',
            'Pronounce all three as a clear, rounded "o", stressing the last syllable (mo-lo-KO)',
            'Skip the first vowel completely (mlo-KO)',
          ],
          correctIndex: 1,
          explanation: 'Ukrainian keeps every unstressed «о» clear and rounded: mo-lo-KO.',
          audioUk: 'молоко́',
        },
        {
          id: 'kc-2',
          question: 'Which pair of Ukrainian words shows the contrast between dotted «і» ("ee" in meet) and undotted «и» (short "i" in bit)?',
          options: [
            'кіт (cat, "keet") vs. кит (whale, "kiht")',
            'ма́ма (mom) vs. та́то (dad)',
            'тут (here) vs. там (there)',
          ],
          correctIndex: 0,
          explanation: '«кіт» uses dotted «і» [i] ("cat"), while «кит» uses undotted «и» [ɪ] ("whale").',
          audioUk: 'кіт, кит',
        },
        {
          id: 'kc-3',
          question: 'How do you turn the statement «Це ка́ва.» ("This is coffee.") into the Yes/No question «Це ка́ва?» ("Is this coffee?") in everyday conversation?',
          options: [
            'You must reverse the word order to «Ка́ва це?»',
            'Keep the exact same words («Це ка́ва?») and use a sharp rise-fall pitch on the stressed syllable «ка́-»',
            'Add the English word "is" at the beginning',
          ],
          correctIndex: 1,
          explanation: 'Ukrainian Yes/No questions can keep statement word order—a rise-fall intonation contour (Contour 3) on the focus word signals the question!',
          audioUk: 'Це ка́ва?',
        },
      ],
      dialogueContextNote:
        'In this morning conversation at home, notice how «До́брого ра́нку!» (Good morning!) keeps every «о» clear, how «Ось ка́ва і молоко́» introduces items on the table without needing a verb for "are", and how «А де сік і хліб?» uses the contrastive connector «А» ("And what about...") with Wh-question intonation.',
      completeReference: {
        title: 'Complete Alphabet, Unstressed Vowel Harmony & Intonation Reference',
        subtitle: 'Full linguistic reference for Module A0.1 — all 33 letters, positional vowel allophones ([е/и], [о/у]), and the 5 intonation contours',
        sections: [
          {
            heading: '1. Complete 33-Letter Ukrainian Alphabet Overview',
            summary:
              'The modern Ukrainian alphabet consists of 33 letters: 10 vowel letters (6 simple vowels: А, Е, И, І, О, У and 4 iotated "y"-vowels covered in Module A0.2: Я, Ю, Є, Ї), 22 consonants, and 1 silent softening sign (ь). An apostrophe (’) is also used in spelling to block consonant softening.',
            bullets: [
              'Alphabetical order: А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я.',
              'Every written vowel is pronounced—there are no silent final "e" vowels in Ukrainian.',
              'Stress marks (´) are printed in textbooks and dictionaries to help learners know which syllable is stressed, though everyday Ukrainian newspapers, signs, and messages omit them unless needed to disambiguate two words (like за́мок "castle" vs. замо́к "lock").',
            ],
          },
          {
            heading: '2. Phonetic Deep-Dive: Unstressed Vowel Harmony ([е/и] and [о/у])',
            summary:
              'In linguistic terms, Ukrainian is a language with full vocalism (unlike vowel-reducing languages that neutralize unstressed vowels to schwa [ə]). However, two subtle positional vowel harmonies occur in natural connected speech:',
            bullets: [
              'Unstressed [е] and [и] convergence (писа́ння/вимо́ва [еи] та [ие]): When unstressed, mid-front /ɛ/ (е) rises slightly toward [ɪ] (as in село́ [sɛɪˈlɔ] "village", весна́ [vɛɪsˈnɑ] "spring"), and high-central-front /ɪ/ (и) lowers slightly toward [ɛ] (as in живе́ [ʒɪɛˈvɛ] "lives", мине́ [mɪɛˈnɛ] "will pass"). Because they sound similar when unstressed, even Ukrainian schoolchildren learn spelling rules to check whether to write е or и!',
              'Unstressed [о] before stressed [у] (укання [оу]): While unstressed /ɔ/ (о) never turns into [ɑ] ("akanie"), when an unstressed /ɔ/ stands immediately before a syllable containing a stressed high rounded [u] (у or ю), anticipatory lip-rounding raises it slightly toward [oʊ/u]: голу́бка [ɦoʊˈlubkɑ] ("dove"), зозу́ля [zoʊˈzulʲɑ] ("cuckoo"), кожу́х [koʊˈʒux] ("sheepskin coat").',
            ],
          },
          {
            heading: '3. Complete Summary of the 5 Ukrainian Intonation Contours (ІК-1 to ІК-5)',
            summary:
              'Ukrainian prosody uses five primary intonation contours across statements, questions, and requests:',
            bullets: [
              'Contour 1 (Declarative Statement): Level mid pitch across the phrase with a calm fall on the stressed syllable of the final rheme (new information): «Ось наш буди́нок.»',
              'Contour 2 (Interrogative-Word Question): High initial pitch peak on the question word (хто́, що́, де́, куди́, коли́, я́к, чомý) followed by a gradual fall to the end of the clause: «Хто́ це? Де́ парк?»',
              'Contour 3 (General Yes/No Question without «чи»): Steep rise-fall peak centered on the stressed syllable of the word being questioned: «Це ка́ва?» (asking if it is coffee) vs. «Це́ кава?» (asking if THIS one is the coffee).',
              'Contour 4 (Alternative «...чи...?» & Elliptical «А...?» Questions): Rising pitch on the first alternative before «чи», followed by a falling pitch on the final alternative: «Це чай чи ка́ва?»; or rising-incomplete contour on elliptical follow-ups: «А ти? А де молоко́?»',
              'Contour 5 (Polite Imperatives & Vocative Address): Warm pitch rise on the imperative verb or vocative name, softening into a gentle fall on «будь ла́ска»: «Скажі́ть, будь ла́ска!»',
            ],
          },
        ],
      },
      whatToRemember: [
        '7 "True Friends" look and sound like English: А (ah), Е (eh), І (ee), К (k), М (m), О (clear o), and Т (t).',
        '6 "Look-Alikes" make different Ukrainian sounds: В = v, Н = n, Р = tapped r, С = s, У = oo, and Х = breathy kh.',
        'Dotted І і sounds like "ee" in meet (кіт, сік, дім), while undotted И и sounds like short "i" in bit (ти, ми, син).',
        'Every Ukrainian О stays a clear, rounded "o" even when unstressed (молоко́ = mo-lo-KO, вода́ = vo-DA).',
        'You can turn any statement into a Yes/No question without changing word order—just lift and drop your pitch on the stressed syllable of the key word («Це ка́ва?»).',
      ],
    },
  },
  {
    id: 'A0.2',
    level: 'A0',
    topicTag: 'Pre-A1 Foundation • Consonants, Softness & Apostrophe',
    title: 'Key Ukrainian Consonants, Soft Sounds & The Apostrophe',
    objectives: [
      'Distinguish between the warm Ukrainian "h" sound (Г г) and the hard "g" sound (Ґ ґ).',
      'Read the "y"-gliding vowels (я, ю, є, ї) and the consonant Й й.',
      'Understand how the soft sign (ь) and the apostrophe (’) work in everyday words.',
    ],
    summary:
      'Now let’s unlock the remaining letters of the Ukrainian alphabet! Once you know how Г vs. Ґ, the "y"-vowels (я, ю, є, ї), the soft sign (ь), and the apostrophe (’) work, you can read any Ukrainian word aloud.',
    rules: [
      '<b>1. Two Different Sounds: Г г ("h") vs. Ґ ґ ("g")</b>: Very common <b>Г г</b> is a warm, voiced "h" sound made in the throat, like the "h" in English <i>aha!</i> or <i>behind</i> (<b>га́рний</b> = nice, <b>гора́</b> = mountain, <b>говори́ти</b> = to speak). Much rarer <b>Ґ ґ</b> (with an upturned hook) is a hard "g" as in English <i>go</i> (<b>ґа́нок</b> = porch, <b>ґу́дзик</b> = button).',
      '<b>2. The "Y" Sound (Й й) and Four "Y"-Vowels (Я, Ю, Є, Ї)</b>: <b>Й й</b> sounds like "y" in <i>boy</i> or <i>yes</i> (<b>мій</b> = my, <b>чай</b> = tea). Four vowels built with this "y" glide are: <b>Я я</b> ("ya" as in <i>yard</i>: <b>я</b> = I), <b>Ю ю</b> ("yu" as in <i>you</i>: <b>люблю́</b> = I love), <b>Є є</b> ("ye" as in <i>yes</i>: <b>є</b> = there is), and two-dot <b>Ї ї</b>, which ALWAYS sounds like "yee" (<b>Украї́на</b> = Ukraine, <b>ї́жа</b> = food, <b>Ки́їв</b> = Kyiv).',
      '<b>3. Unique Consonants to Recognize</b>: <b>Б б</b> (<i>b</i>), <b>Д д</b> (<i>d</i>), <b>Ж ж</b> ("zh" as in <i>measure</i>: <b>життя́</b> = life), <b>З з</b> (<i>z</i>: <b>за́раз</b> = now), <b>Л л</b> (<i>l</i>), <b>П п</b> (<i>p</i>), <b>Ф ф</b> (<i>f</i>), <b>Ц ц</b> ("ts" as in <i>cats</i>: <b>це</b> = this is), <b>Ч ч</b> ("ch" as in <i>chat</i>: <b>час</b> = time), <b>Ш ш</b> ("sh" as in <i>shop</i>: <b>шко́ла</b> = school), and <b>Щ щ</b> ("shch" as in <i>fresh cheese</i>: <b>борщ</b>, <b>що</b> = what).',
      '<b>4. Soft Sign (ь), Apostrophe (’) & Final В [w]</b>: The soft sign <b>ь</b> makes no sound of its own—it softens the consonant right before it by raising the middle of your tongue toward the roof of your mouth (<b>день</b> = day, <b>сіль</b> = salt). Conversely, an apostrophe (<b>’</b>) keeps a consonant hard and makes you pronounce a clear "y" glide right after it (<b>сім’я́</b> = family, <b>п’ять</b> = five, <b>м’я́со</b> = meat). Finally, at the end of a word or before another consonant, <b>в</b> sounds like a rounded English "w" (<b>Ки́їв</b> [kɪjiw], <b>сказа́в</b> [skɑzɑw]).',
      '<b>5. Crisp Dental Consonants (т, д, н, л), Unaspirated (п, т, к), Fused Affricates (дж, дз) & Long Double Consonants (-ння, -ття)</b>:<ul><li><b>Dental Articulation & No Puff of Air</b>: Pronounce Ukrainian <b>т, д, н, л</b> with the tip of your tongue touching the back of your upper front teeth (not the ridge behind them as in English), and pronounce <b>п, т, к</b> cleanly without an English puff of breath (aspiration).</li><li><b>One Fused Sound Written with Two Letters (дж, дз)</b>: Inside a root, <b>дж</b> is pronounced as a single fused sound like English "j" in <i>jump</i> [dʒ] (<b>бджола́</b> = bee, <b>джерело́</b> = spring, <b>піджа́к</b> = jacket, <b>сиджу́</b> = I sit), and <b>дз</b> is a single fused "dz" sound [dz] (<b>дзво́ник</b> = bell, <b>ґу́дзик</b> = button, <b>дзерка́ло</b> = mirror).</li><li><b>Prolonged Soft Consonants (-ння, -ття, -лля)</b>: Doubled consonants before <b>-я</b> in neuter nouns like <b>знання́</b> (knowledge), <b>життя́</b> (life), <b>взуття́</b> (footwear), <b>завда́ння</b> (task), and <b>оповіда́ння</b> (short story) are held ~1.5× longer as a prolonged soft sound.</li></ul>',
      '<b>6. Smooth Consonant Cluster Simplification & Soft Sibilant Assimilation</b>:<ul><li><b>Dropping Middle Consonants for Easy Flow</b>: To keep speech melodic, Ukrainian simplifies heavy consonant clusters both in pronunciation and spelling: <b>ти́ждень → ти́жня</b> (<i>д</i> drops in all oblique cases!), <b>ко́ристь → кори́сний</b> (useful), <b>ра́дість → ра́дісний</b> (joyful), <b>ща́стя → щасли́вий</b> (happy — <i>т</i> drops), <b>се́рце → серде́чний</b> (<i>д</i> reappears when the cluster breaks), <b>черне́ць → ченця́</b> (monk). In a few words like <b>шістна́дцять</b> (16) and <b>контра́стний</b>, the <i>т</i> is kept in writing but silent in natural speech: [ʃisnɑ́dʲtsʲɑtʲ]!</li><li><b>Sibilants Before «-ці» and «-ся»</b>: When <b>ж, ч, ш</b> come right before soft <b>ц</b> or <b>с</b>, they assimilate smoothly in speech: <b>кни́жка → у кни́жці</b> sounds like soft [knɪ́zʲtsʲi], <b>ка́чка → ка́чці</b> sounds like [kɑ́tsʲtsʲi], and 2nd-person reflexive <b>одяга́єшся / у́чишся</b> sounds like a long soft [sʲsʲɑ]!</li></ul>',
      '<b>7. Which Consonants Double Before «-я/-ю» vs. Take an Apostrophe, Selective Softener «-і», & Prefix Boundaries in «підживи́ти»</b>:<ul><li><b>Consonants That Double (Geminate) vs. Consonants That Take an Apostrophe</b>: Dental and palatal consonants (<b>д, т, з, с, л, н, ц, ж, ч, ш</b>) lengthen between vowels before <b>-я / -ю / -є</b> (written doubled: <b>пита́ння, життя́, дозві́лля, воло́сся, узбі́ччя, збі́жжя, суддя́</b>; notice minimal pairs like <b>Ві́тя</b> [name] vs. <b>ві́ття</b> [branches], <b>рі́ля</b> vs. <b>рілля́</b> [tilled soil]). By contrast, labials (<b>б, п, в, м, ф</b>) and <b>г, ґ, й, к, р, х, щ</b> NEVER double in native roots—instead, labials and hard <b>р</b> keep an apostrophe before <b>я, ю, є, ї</b>: <b>подві́р’я</b> (courtyard), <b>сім’я́</b> (family), <b>любо́в’ю</b> (with love).</li><li><b>Selective Softening Before «-і» & Soft «-л-» Before Dropped «-е-»</b>: While <b>я, ю, є, ь</b> fully palatalize preceding dentals, the vowel <b>і</b> softens <b>д, т, з, с, л, н, ц</b> only semi-softly in literary speech (<b>ді́вчина, ті́тка, зір, сіль, полі́т, ніс</b>). Also note that when fleeting <b>-е-</b> drops after <b>л</b> in <b>-ець</b> nouns, a soft sign <b>ь</b> is written: <b>па́лець → па́льці</b> (fingers), <b>стіле́ць → стільці́</b> (chairs), <b>брази́лець → брази́льці</b>.</li><li><b>Root Affricates «дж / дз» vs. Prefix-Root Boundaries & Reflexive «-ться / -шся»</b>: Inside a root, <b>дж</b> [dʒ] and <b>дз</b> [dz] are pronounced as one fused sound (<b>ходжу́, джерело́, дзе́ркало, дзвін</b>), but across a prefix-root boundary they are pronounced separately: <b>під-живи́ти</b>, <b>над-звукови́й</b>! Finally, in natural speech 3rd-person reflexive <b>-ться</b> (<b>він ди́виться, вони́ смію́ться</b>) sounds like a lengthened soft <b>[tsʲːa]</b>, and 2nd-person <b>-шся</b> (<b>ти ди́вишся, сміє́шся, бої́шся</b>) sounds like <b>[sʲːa]</b>.</li></ul>',
      '<b>8. The Story of «Ґ ґ», Two-Sound «зг» [zɦ] vs. «ж» [ʒ], Official Place-Name Spelling & Stress Minimal Pairs</b>:<ul><li><b>Resilience of the Letter «Ґ ґ»</b>: Included in the 1929 Kharkiv orthography to distinguish the velar plosive [ɡ] (<b>ґу́дзик, ґа́нок, а́ґрус, дзи́ґа</b>) from the voiced glottal fricative <b>Г г</b> [ɦ], the letter <b>Ґ ґ</b> was banned in Soviet orthography in 1946 and officially restored to the Ukrainian alphabet in 1990–1993.</li><li><b>Two Separate Sounds in «зг» [zɦ] vs. «ж» [ʒ]</b>: When the letters <b>з</b> and <b>г</b> meet in words like <b>зго́да!</b> ("Agreed!"), <b>згада́ти</b> ("to recall"), or <b>розмова з го́стем</b>, pronounce <b>з</b> [z] and <b>г</b> [ɦ] separately—never fuse them into <b>ж</b> [ʒ] (as in <b>журна́л</b>)!</li><li><b>Official Ukrainian Romanization of Place Names</b>: Always use the official Ukrainian forms in English—<b>Kyiv</b> (Ки́їв), <b>Odesa</b> (Оде́са), <b>Lviv</b> (Львів), <b>Kharkiv</b> (Ха́рків), <b>Chernihiv</b> (Черні́гів), <b>Zaporizhzhia</b> (Запорі́жжя), and the <b>Dnipro</b> River (Дніпро́)—and say <b>Ukraine</b> (never <i>"the Ukraine"</i>).</li><li><b>Four Essential Stress Minimal Pairs</b>: Because Ukrainian word stress is free and mobile, shifting stress alone can change a word’s meaning completely:<ul><li><b>доро́га</b> (road, noun) vs. <b>дорога́</b> (dear / expensive, feminine adjective)</li><li><b>за́мок</b> (castle) vs. <b>замо́к</b> (lock / zipper)</li><li><b>о́рган</b> (anatomical organ or governing body) vs. <b>орга́н</b> (pipe organ, musical instrument)</li><li><b>брати́</b> (brothers, Nominative plural of <i>брат</i>) vs. <b>бра́ти</b> (to take, infinitive).</li></ul></li></ul>',
    ],
    structuredLesson: {
      bigIdea: {
        headline: 'Finish the Alphabet: Warm "H" vs. Hard "G", Y-Gliding Vowels, Soft Sounds, and the Apostrophe',
        body: 'In Module A0.1, you learned the six pure vowels and the consonants that look like English or Greek letters. Now you will unlock the remaining letters of the 33-letter Ukrainian alphabet! Once you understand the difference between warm «Г г» ("h") and hooked «Ґ ґ» ("g"), how the four "Y"-gliding vowels («я, ю, є, ї») work, and how the Soft Sign («ь») and the Apostrophe («’») control consonant softness, you can read any Ukrainian word aloud with confidence.',
        keyTerms: [
          {
            term: 'Voiced "H" (Г г [ɦ]) vs. Hard "G" (Ґ ґ [ɡ])',
            plainEnglish: 'Unlike Russian, standard Ukrainian «Г г» is a warm, voiced breathy "h" sound made in the throat (like the "h" in "aha!" or "behind"). The much rarer hard "g" sound (as in "go") has its own letter with an upturned hook: «Ґ ґ».',
          },
          {
            term: 'Iotated ("Y"-Gliding) Vowels (Я, Ю, Є, Ї)',
            plainEnglish: 'Four vowel letters that start with a "y" glide [j] ("ya, yu, ye, yee") at the beginning of a word, after another vowel, or after an apostrophe—or soften the consonant right before them.',
          },
          {
            term: 'Palatalization (Soft Consonants & Soft Sign «ь»)',
            plainEnglish: 'Pronouncing a consonant while arching the middle of your tongue gently toward the roof of your mouth (the hard palate), giving the consonant a bright, "y"-colored release.',
          },
          {
            term: 'The Ukrainian Apostrophe (’)',
            plainEnglish: 'A separator mark written after a consonant (especially labials б, п, в, м, ф and hard р) before я, ю, є, ї. It does NOT mean a letter was deleted—instead, it keeps the consonant hard and tells you to pronounce a crisp "y" sound on the vowel right after it.',
          },
        ],
      },
      seeItInAction: [
        {
          uk: '<mark class="vc-highlight">Я</mark> любл<mark class="vc-highlight">ю́</mark> Ки́<mark class="vc-highlight">їв</mark> і Укра<mark class="vc-highlight">ї́</mark>ну.',
          en: 'I love Kyiv and Ukraine.',
          highlightNote: 'Notice «Я» ("ya"), «-ю́» (softening л), two-dotted «ї» (always "yee" [ji]), and final «-в» pronounced like a rounded English "w" [kɪ́jiw].',
        },
        {
          uk: 'С<mark class="vc-highlight">ьо</mark><mark class="vc-highlight">г</mark>о́дні ду́<mark class="vc-highlight">ж</mark>е <mark class="vc-highlight">г</mark>а́рний ден<mark class="vc-highlight">ь</mark>.',
          en: 'Today is a very nice day.',
          highlightNote: '«ього» softens «с» before «о», both «г» letters are a warm voiced "h" [ɦ], «ж» sounds like "zh" in "measure", and «ь» softens final «н».',
        },
        {
          uk: 'Це моя́ дру́жна сі<mark class="vc-highlight">м’я́</mark>, а на обі́д є смачни́й бор<mark class="vc-highlight">щ</mark> і <mark class="vc-highlight">м’я́</mark>со.',
          en: 'This is my friendly family, and for lunch there is delicious borscht and meat.',
          highlightNote: 'The apostrophe in «сім’я́» [sʲimjɑ́] and «м’я́со» [mjɑ́so] keeps «м» unsoftened and triggers a clear "y" glide before «я». «щ» is pronounced "shch" [ʃtʃ].',
        },
        {
          uk: 'Нове́ зна<mark class="vc-highlight">ння́</mark>, ціка́ве оповіда́<mark class="vc-highlight">ння</mark> і лісове́ <mark class="vc-highlight">дж</mark>ерело́.',
          en: 'New knowledge, an interesting short story, and a forest spring.',
          highlightNote: 'Doubled «-ння» is held ~1.5× longer as a soft sound, while «дж» inside a root is a single fused "j" sound [dʒ] as in "jump".',
        },
      ],
      visualTables: [
        {
          title: '1. The Two "H / G" Letters: Warm Voiced «Г г» vs. Hooked Hard «Ґ ґ»',
          subtitle: 'Look closely at the top right corner of the letter: an upturned hook means hard "g" [ɡ]; a flat top means warm "h" [ɦ].',
          headers: ['Letter', 'IPA & Sound', 'How to Pronounce It', 'Everyday Examples'],
          rows: [
            [
              '<b class="uk-text">Г г</b>',
              '<code>[ɦ]</code> — Warm Voiced "H"',
              'Like the breathy, vocalized "h" in English <i>aha!</i> or <i>behind</i> (your vocal cords vibrate). Extremely common in Ukrainian.',
              '<b class="uk-text">га́рний</b> (nice/beautiful), <b class="uk-text">гора́</b> (mountain), <b class="uk-text">говори́ти</b> (to speak), <b class="uk-text">готе́ль</b> (hotel), <b class="uk-text">гро́ші</b> (money)',
            ],
            [
              '<b class="uk-text">Ґ ґ</b>',
              '<code>[ɡ]</code> — Hard "G"',
              'Like the hard "g" in English <i>go</i> or <i>garden</i>. Used in a select group of native words and loanwords.',
              '<b class="uk-text">ґа́нок</b> (porch), <b class="uk-text">ґу́дзик</b> (button), <b class="uk-text">а́ґрус</b> (gooseberry), <b class="uk-text">ґрунт</b> (soil/ground), <b class="uk-text">дзи́ґа</b> (spinning top)',
            ],
          ],
          footnote: 'Remember: Ukrainian also has voiceless «Х х» [x] (like "ch" in Scottish "loch": хліб, хорошо́), where your vocal cords do NOT vibrate.',
        },
        {
          title: '2. The Consonant «Й й» and the Four "Y"-Gliding Vowels («Я, Ю, Є, Ї»)',
          subtitle: 'Compare the 4 pure vowels from Module A0.1 (а, у, е, і) with their "Y"-gliding partners (я, ю, є, ї).',
          headers: ['Letter', 'Base Vowel Partner', 'At Word Start / After Vowel / After ’', 'Right After a Consonant', 'Examples'],
          rows: [
            [
              '<b class="uk-text">Й й</b> (Consonant)',
              '— (Short "y" [j])',
              'Sounds like "y" in <i>yes</i>',
              'Forms a smooth glide at the end of a syllable (like "y" in <i>boy</i>)',
              '<b class="uk-text">йогу́рт</b> (yogurt), <b class="uk-text">мій</b> (my), <b class="uk-text">чай</b> (tea), <b class="uk-text">трамва́й</b> (tram)',
            ],
            [
              '<b class="uk-text">Я я</b>',
              'Partner of <b class="uk-text">А а</b>',
              '<b>"ya"</b> <code>[jɑ]</code> as in <i>yard</i>',
              'Softens the consonant + <code>[ɑ]</code>',
              '<b class="uk-text">я</b> (I), <b class="uk-text">я́блуко</b> (apple), <b class="uk-text">сім’я́</b> (family), <b class="uk-text">земля́</b> (earth/land)',
            ],
            [
              '<b class="uk-text">Ю ю</b>',
              'Partner of <b class="uk-text">У у</b>',
              '<b>"yu"</b> <code>[ju]</code> as in <i>you</i>',
              'Softens the consonant + <code>[u]</code>',
              '<b class="uk-text">ю́шка</b> (broth), <b class="uk-text">люблю́</b> (I love), <b class="uk-text">працю́ю</b> (I work)',
            ],
            [
              '<b class="uk-text">Є є</b>',
              'Partner of <b class="uk-text">Е е</b>',
              '<b>"ye"</b> <code>[jɛ]</code> as in <i>yes</i>',
              'Softens the consonant + <code>[ɛ]</code>',
              '<b class="uk-text">є</b> (is / there is), <b class="uk-text">Євро́па</b> (Europe), <b class="uk-text">моє́</b> (my — neuter), <b class="uk-text">си́нє</b> (blue)',
            ],
            [
              '<b class="uk-text">Ї ї</b> (Two Dots)',
              'Pure "yee" partner of <b class="uk-text">І і</b>',
              'ALWAYS <b>"yee"</b> <code>[ji]</code>!',
              'Appears after vowels or an apostrophe; ALWAYS pronounced <b>"yee"</b> <code>[ji]</code>',
              '<b class="uk-text">Украї́на</b> (Ukraine), <b class="uk-text">Ки́їв</b> (Kyiv), <b class="uk-text">ї́жа</b> (food), <b class="uk-text">ї́хати</b> (to go by vehicle)',
            ],
          ],
          footnote: 'Golden rule for «І і» vs. «Ї ї»: One dot («І і») = one sound ("ee" [i]). Two dots («Ї ї») = two sounds ("y + ee" [ji])!',
        },
        {
          title: '3. Distinct Cyrillic Consonants & Sibilants («Б, Д, Ж, З, Л, П, Ф, Ц, Ч, Ш, Щ, ДЖ, ДЗ»)',
          subtitle: 'Master these letters and the two fused two-letter combinations (digraphs) «дж» and «дз».',
          headers: ['Letter / Digraph', 'English Sound Guide', 'Key Ukrainian Example', 'Meaning & Pronunciation Tip'],
          rows: [
            ['<b class="uk-text">Б б / П п</b>', '<b>b</b> in <i>book</i> / <b>p</b> in <i>spin</i> (no puff of air)', '<b class="uk-text">ба́тько, брат / парк, пі́сня</b>', 'father, brother / park, song'],
            ['<b class="uk-text">Д д / Л л / Ф ф</b>', '<b>d</b> in <i>day</i> / <b>l</b> in <i>look</i> / <b>f</b> in <i>fact</i>', '<b class="uk-text">день, друг / лі́то / фотогра́фія</b>', 'Pronounce д, т, н, л with the tongue tip against the upper front teeth'],
            ['<b class="uk-text">З з</b>', '<b>z</b> in <i>zoo</i>', '<b class="uk-text">за́раз, земля́, зі́рка</b>', 'now, land, star (looks like a cursive 3, never a number!)'],
            ['<b class="uk-text">Ж ж</b>', '<b>zh</b> <code>[ʒ]</code> as in <i>measure</i> or <i>vision</i>', '<b class="uk-text">життя́, жі́нка, ду́же</b>', 'life, woman, very'],
            ['<b class="uk-text">Ц ц</b>', '<b>ts</b> <code>[ts]</code> as in <i>cats</i>', '<b class="uk-text">це, центр, цу́кор, пра́ця</b>', 'this is, center, sugar, work'],
            ['<b class="uk-text">Ч ч</b>', '<b>ch</b> <code>[tʃ]</code> as in <i>chat</i>', '<b class="uk-text">час, чай, чоти́ри, чита́ти</b>', 'time, tea, four, to read'],
            ['<b class="uk-text">Ш ш</b>', '<b>sh</b> <code>[ʃ]</code> as in <i>shop</i>', '<b class="uk-text">шко́ла, шість, ша́фа</b>', 'school, six, wardrobe'],
            ['<b class="uk-text">Щ щ</b>', '<b>shch</b> <code>[ʃtʃ]</code> as in <i>fre<u>sh ch</u>eese</i>', '<b class="uk-text">що, борщ, дощ, пло́ща</b>', 'what, borscht, rain, square (always two crisp sounds: ш + ч!)'],
            ['<b class="uk-text">дж</b> (Fused Digraph)', '<b>j</b> <code>[dʒ]</code> as in <i>jump</i> (one fused sound inside roots)', '<b class="uk-text">бджола́, джерело́, піджа́к, сиджу́</b>', 'bee, spring/source, jacket, I sit'],
            ['<b class="uk-text">дз</b> (Fused Digraph)', '<b>dz</b> <code>[dz]</code> as in <i>a<u>ds</u></i> (one fused sound inside roots)', '<b class="uk-text">дзво́ник, ґу́дзик, дзе́ркало, кукуру́дза</b>', 'bell, button, mirror, corn'],
          ],
        },
        {
          title: '4. Soft Sign («ь») vs. Apostrophe («’») vs. Prolonged Doubled Consonants («-ння, -ття»)',
          subtitle: 'How Ukrainian spelling shows whether a consonant is softened, kept hard before a "Y"-vowel, or held longer.',
          headers: ['Feature', 'What It Does to the Sound', 'Where It Appears', 'Everyday Examples'],
          rows: [
            [
              '<b class="uk-text">Ь ь</b> (М’яки́й знак — Soft Sign)',
              'Makes NO vowel sound of its own; softens (palatalizes) the dental consonant right before it (<b class="uk-text">д, т, з, с, л, н, ц</b>).',
              'At the end of a word, before another consonant, or before <b class="uk-text">-о</b> (<b class="uk-text">ьо</b>).',
              '<b class="uk-text">день</b> (day), <b class="uk-text">сіль</b> (salt), <b class="uk-text">о́сінь</b> (autumn), <b class="uk-text">хло́пець</b> (boy), <b class="uk-text">Львів</b> (Lviv), <b class="uk-text">сьо́мий</b> (seventh)',
            ],
            [
              '<b class="uk-text">’</b> (Апо́строф — Apostrophe)',
              'Keeps the preceding consonant <b>hard</b> and forces a clear <b>"y" glide [j]</b> on the following vowel (<b class="uk-text">я, ю, є, ї</b>).',
              'After labials (<b class="uk-text">б, п, в, м, ф</b>), hard <b class="uk-text">р</b>, and prefixes ending in a consonant before <b class="uk-text">я, ю, є, ї</b>.',
              '<b class="uk-text">сім’я́</b> (family), <b class="uk-text">ім’я́</b> (first name), <b class="uk-text">п’ять</b> (five), <b class="uk-text">де́в’ять</b> (nine), <b class="uk-text">м’я́со</b> (meat), <b class="uk-text">кав’я́рня</b> (coffee shop), <b class="uk-text">подві́р’я</b> (courtyard)',
            ],
            [
              '<b class="uk-text">-ння, -ття, -лля, -жжя, -ччя</b> (Gemination)',
              'Softens AND lengthens the consonant (~1.5× longer hold) between vowels before <b class="uk-text">-я / -ю</b>.',
              'Dental and palatal consonants (<b class="uk-text">д, т, з, с, л, н, ц, ж, ч, ш</b>) in neuter nouns and special forms.',
              '<b class="uk-text">знання́</b> (knowledge), <b class="uk-text">життя́</b> (life), <b class="uk-text">пита́ння</b> (question), <b class="uk-text">завда́ння</b> (task), <b class="uk-text">взуття́</b> (footwear), <b class="uk-text">воло́сся</b> (hair), <b class="uk-text">узбі́ччя</b> (roadside)',
            ],
          ],
        },
      ],
      diagrams: [
        {
          title: 'Visual Decision Tree: Soft Consonant, Doubled Consonant, or Apostrophe Before «-я / -ю / -є»?',
          subtitle: 'Why does Ukrainian write «знання́» with a doubled consonant, «земля́» with a single consonant, and «сім’я́» with an apostrophe?',
          type: 'flow',
          nodes: [
            {
              label: '1. Dental / Palatal Between Vowels',
              value: 'д, т, з, с, л, н, ц, ж, ч, ш → DOUBLES!',
              description: 'In neuter nouns ending in -я, these consonants soften and lengthen (written doubled): знання́, життя́, дозві́лля, збі́жжя. Compare Ві́тя (name) vs. ві́ття (branches)!',
            },
            {
              label: '2. Labial (Lip Consonant) + я, ю, є, ї',
              value: 'б, п, в, м, ф → TAKES APOSTROPHE (’)!',
              description: 'Lip consonants never double and resist softening before я, ю, є, ї. Unless preceded by a root consonant (like свя́то, цвях), write an apostrophe: сім’я́, п’ять, м’я́со, любо́в’ю.',
            },
            {
              label: '3. Consonant «р» + я, ю, є, ї',
              value: 'End of syllable → Апо́строф (подві́р’я, бур’я́н)',
              description: 'When р is pronounced hard at the end of a syllable before [j], write an apostrophe (подві́р’я); when р begins a syllable right before the vowel, no apostrophe is used (бу́ря, рясно́, гово́рять).',
            },
          ],
        },
        {
          title: 'Four Essential Stress Minimal Pairs to Watch Out For',
          subtitle: 'Just like in Module A0.1, moving the stress mark by a single syllable creates an entirely different word.',
          type: 'comparison',
          nodes: [
            {
              label: 'доро́га vs. дорога́',
              value: 'доро́га (road) • дорога́ (dear / expensive, f.)',
              description: 'До́вга доро́га (a long road) vs. дорога́ су́кня / дорога́ ма́мо (an expensive dress / dear mom).',
            },
            {
              label: 'за́мок vs. замо́к',
              value: 'за́мок (castle) • замо́к (lock / zipper)',
              description: 'Старови́нний за́мок у Лу́цьку (an ancient castle in Lutsk) vs. міцни́й замо́к на дверя́х (a sturdy lock on the door).',
            },
            {
              label: 'о́рган vs. орга́н',
              value: 'о́рган (body organ / agency) • орга́н (pipe organ)',
              description: 'Держа́вний о́рган (a state body) vs. слу́хати класи́чний орга́н у собо́рі (listening to a classical pipe organ).',
            },
            {
              label: 'брати́ vs. бра́ти',
              value: 'брати́ (brothers, pl.) • бра́ти (to take, verb)',
              description: 'Мої́ ста́рші брати́ (my older brothers) vs. бра́ти кни́жку з поли́ці (to take a book from the shelf).',
            },
          ],
        },
      ],
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Check «Г г» vs. «Ґ ґ» First',
          explanation: 'Whenever you see flat-topped «Г г» (almost every word), relax your throat and make a warm, voiced "h" sound [ɦ]. Reserve hard "g" [ɡ] strictly for hooked «Ґ ґ».',
          examples: [
            { uk: 'гово́рить [ɦoˈwɔrɪtʲ] • га́рний [ˈɦɑrnɪj]', en: 'speaks • nice (both use warm voiced "h")' },
            { uk: 'ґа́нок [ˈɡɑnok] • ґу́дзик [ˈɡudzɪk]', en: 'porch • button (both use hooked hard "g")' },
          ],
        },
        {
          stepNumber: 2,
          title: 'Spot «І і» (1 Dot = "ee") vs. «Ї ї» (2 Dots = "yee")',
          explanation: 'Count the dots above the letter! One dot («і») is a pure "ee" vowel that softens the consonant before it. Two dots («ї») ALWAYS starts with a "y" sound ("yee" [ji]).',
          examples: [
            { uk: 'мі́сто [ˈmʲisto] • ніч [nʲitʃ]', en: 'city • night (single-dot і)' },
            { uk: 'Украї́на [ukrɑˈjinɑ] • Ки́їв [ˈkɪjiw] • ї́жа [ˈjiʒɑ]', en: 'Ukraine • Kyiv • food (two-dot ї = "yee")' },
          ],
        },
        {
          stepNumber: 3,
          title: 'Look for Soft Sign («ь») or Apostrophe («’»)',
          explanation: 'If a consonant is followed by «ь», lift the middle of your tongue to soften that consonant without adding an extra syllable. If a consonant is followed by «’» + я/ю/є/ї, keep the consonant hard and pronounce a crisp "y" sound on the vowel.',
          examples: [
            { uk: 'день [dɛnʲ] • сіль [sʲilʲ] • сього́дні [sʲoˈɦɔdnʲi]', en: 'day • salt • today (softened by ь)' },
            { uk: 'сім’я́ [sʲimˈjɑ] • п’ять [pjɑtʲ] • кав’я́рня [kɑwˈjɑrnʲɑ]', en: 'family • five • coffee shop (apostrophe before я)' },
          ],
        },
        {
          stepNumber: 4,
          title: 'Round Final «-в» to [w] and Hold Doubled Consonants («-ння, -ття»)',
          explanation: 'At the end of a word or syllable before a consonant, round your lips for «в» like English "w" (never "f"). When you see a doubled consonant before «-я» (like «знання́» or «життя́»), hold that soft consonant slightly longer.',
          examples: [
            { uk: 'Ки́їв [ˈkɪjiw] • любо́в [lʲuˈbɔw] • сказа́в [skɑˈzɑw]', en: 'Kyiv • love • he said (rounded [w], never [f]!)' },
          ],
        },
      ],
      moreExamples: [
        {
          uk: 'Цього́ <mark class="vc-highlight">ти́жня</mark> ми прочита́ли у <mark class="vc-highlight">кни́жці</mark> <mark class="vc-highlight">шістна́дцять</mark> <mark class="vc-highlight">кори́сних</mark> і <mark class="vc-highlight">ра́дісних</mark> нови́н.',
          en: 'This week we read sixteen useful and joyful pieces of news in the book.',
          highlightNote: 'Notice consonant cluster simplification (ти́ждень → ти́жня, ко́ристь → кори́сний, ра́дість → ра́дісний), silent first т in шістна́дцять [ʃisnɑ́dʲtsʲɑtʲ], and smooth sibilant assimilation in у кни́жці [u knɪ́zʲtsʲi].',
        },
        {
          uk: 'На за́тишному <mark class="vc-highlight">подві́р’ї</mark> стої́ть чоти́ри <mark class="vc-highlight">стільці́</mark>; ти <mark class="vc-highlight">ди́вишся</mark> на <mark class="vc-highlight">збі́жжя</mark> й усміха́єшся.',
          en: 'In the cozy courtyard stand four chairs; you look at the grain and smile.',
          highlightNote: 'Apostrophe after hard р in подві́р’ї, soft sign ь after л when fleeting е drops (стіле́ць → стільці́), and smooth 2nd-person reflexive pronunciation in ди́вишся [-sʲːɑ].',
        },
        {
          uk: '<mark class="vc-highlight">Зго́да</mark>! <mark class="vc-highlight">Доро́га</mark> веде́ до старови́нного <mark class="vc-highlight">за́мку</mark>, де мої́ <mark class="vc-highlight">брати́</mark> слу́хають класи́чний <mark class="vc-highlight">орга́н</mark>, а на дверя́х виси́ть міцни́й <mark class="vc-highlight">замо́к</mark>.',
          en: 'Agreed! The road leads to the ancient castle, where my brothers listen to a classical pipe organ, and a sturdy lock hangs on the door.',
          highlightNote: 'Pronounce з and г separately in зго́да [zɦɔ́dɑ] (never "zh"!), and notice all four stress minimal pairs in context.',
        },
      ],
      exceptionsAndEdgeCases: [
        {
          ruleTitle: 'Cluster Simplification in Spelling vs. Speech («ти́ждень → ти́жня» vs. «шістна́дцять»)',
          ruleExplanation: 'To keep Ukrainian melodic and avoid heavy three-consonant clusters (-стн-, -ждн-, -стл-), the middle consonant usually drops in BOTH pronunciation and spelling when an ending or suffix is added.',
          exceptions: [
            {
              item: 'ти́ждень (week) → ти́жня, ти́жнів; ко́ристь → кори́сний; ра́дість → ра́дісний; ща́стя → щасли́вий; се́рце → серде́чний; черне́ць → ченця́',
              note: 'The middle d/t drops right out of the written word! (In серде́чний, historical д reappears when a vowel separates the cluster.)',
            },
            {
              item: 'шістна́дцять (16), пестли́вий (affectionate), хвастли́вий (boastful), зап’я́стний (wrist), and foreign stems like контра́стний, бала́стний',
              note: 'In these specific exceptions, the letter «т» is kept in spelling, but in natural spoken Ukrainian it is still silent or lightly glided over (e.g., шістна́дцять [ʃisnɑ́dʲtsʲɑtʲ])!',
            },
          ],
        },
        {
          ruleTitle: 'Fused Digraphs «дж / дз» Inside Roots vs. Prefix-Root Boundaries',
          ruleExplanation: 'Inside a root or verb stem, the two letters «дж» [dʒ] and «дз» [dz] represent a single fused affricate sound (like English "j" in "jump" or "dz" in "ads").',
          exceptions: [
            {
              item: 'бджола́, джерело́, піджа́к, сиджу́, ходжу́ / дзво́ник, ґу́дзик, дзе́ркало',
              note: 'Inside the root/stem → pronounce as ONE fused sound [dʒ] or [dz].',
            },
            {
              item: 'під-живи́ти (to nourish/boost), від-жи́ти (to outlive), над-звукови́й (supersonic), під-земни́й (underground)',
              note: 'Across a prefix + root boundary → pronounce the prefix consonant [d] and the root consonant [ʒ] or [z] separately!',
            },
          ],
        },
      ],
      commonMistakes: [
        {
          mistake: 'Pronouncing Ukrainian «Г г» like a hard English "g" in "go" (*га́рний as "garnyy", *гово́рить as "govoryt")',
          wrongUk: 'гово́рить [ɡoˈvɔrɪtʲ] (Russian-style hard "g")',
          correctUk: 'гово́рить [ɦoˈwɔrɪtʲ] (warm Ukrainian voiced "h" [ɦ])',
          explanation: 'In Ukrainian, «Г г» is ALWAYS the warm voiced "h" sound [ɦ]. Hard [ɡ] only occurs in words spelled with hooked «Ґ ґ» (ґа́нок, ґу́дзик, а́ґрус, ґрунт).',
        },
        {
          mistake: 'Pronouncing word-final «-в» like an English "f" (*Ки́їф, *любо́ф, *сказа́ф)',
          wrongUk: 'Ки́їв [ˈkɪjif] / любо́в [lʲuˈbɔf]',
          correctUk: 'Ки́їв [ˈkɪjiw] / любо́в [lʲuˈbɔw]',
          explanation: 'Ukrainian never turns final «-в» into voiceless "f". At the end of a syllable or word, round your lips into a smooth English "w" [w].',
        },
        {
          mistake: 'Using outdated Russian-based transliterations ("Kiev, Lvov, Odessa, Kharkov") or saying "the Ukraine"',
          wrongUk: '"Kiev, Lvov, Odessa, the Ukraine"',
          correctUk: 'Kyiv (Ки́їв), Lviv (Львів), Odesa (Оде́са), Kharkiv (Ха́рків), Ukraine (Украї́на)',
          explanation: 'Official English spelling follows Ukrainian phonology directly (Ки́їв → Kyiv, Львів → Lviv, Оде́са → Odesa), and sovereign countries take no article ("Ukraine").',
        },
      ],
      inlineChecks: [
        {
          id: 'a02-check-1',
          question: 'How do you pronounce the letter «Г г» in everyday words like «га́рний» (nice) and «гора́» (mountain)?',
          options: [
            'Like a hard "g" in "go"',
            'Like a warm, voiced "h" sound [ɦ] (as in "aha!" or "behind")',
            'Silent like the soft sign «ь»',
          ],
          correctIndex: 1,
          explanation: 'Standard Ukrainian «Г г» is a warm, voiced glottal "h" sound [ɦ]. The hard "g" sound is written with the hooked letter «Ґ ґ».',
        },
        {
          id: 'a02-check-2',
          question: 'Why is there an apostrophe in «сім’я́» (family), «п’ять» (five), and «м’я́со» (meat)?',
          options: [
            'It shows that a vowel was dropped in casual speech',
            'It keeps the labial consonant (м, п) hard and signals a crisp "y" glide [j] on the following vowel «я»',
            'It makes the word plural',
          ],
          correctIndex: 1,
          explanation: 'The Ukrainian apostrophe keeps the preceding consonant unsoftened and triggers a full "y" glide on я, ю, є, or ї (seem-YA, pyat, MYA-so).',
        },
        {
          id: 'a02-check-3',
          question: 'What happens to the consonant «д» when «ти́ждень» (week) changes to "of the week" in «цього́ ти́жня»?',
          options: [
            'It doubles to «-дд-»',
            'It drops out in both pronunciation and spelling (ти́ждень → ти́жня) to simplify the heavy consonant cluster',
            'It turns into an apostrophe',
          ],
          correctIndex: 1,
          explanation: 'Ukrainian simplifies heavy consonant clusters (-ждн-, -стн-, -стл-) so speech flows smoothly: ти́ждень → ти́жня, ко́ристь → кори́сний, ща́стя → щасли́вий.',
        },
      ],
      completeReference: [
        {
          title: 'Advanced Reference 1: Complete Rules of the Ukrainian Apostrophe («’») vs. Consonant Doubling',
          summary: 'Expand to view the exact orthographic rules for when to write an apostrophe vs. when consonants double before -я/-ю.',
          contentHtml: `
            <p class="mb-2"><b>1. Where the Apostrophe («’») Is Written Before «я, ю, є, ї»:</b></p>
            <ul class="list-disc pl-5 space-y-1 mb-3">
              <li><b>After labial consonants (б, п, в, м, ф)</b> when they are NOT preceded by another root consonant (except <i>р</i>): <b>сім’я́, ім’я́, п’ять, де́в’ять, м’я́со, здоров’я, любо́в’ю, кав’я́рня, черв’я́к, торф’яни́й, верб’я́</b>. (Compare when preceded by another root consonant—no apostrophe: <b>свя́то, цвях, морквя́ний, мавпя́чий</b>.)</li>
              <li><b>After hard «р» at the end of a syllable</b> (when a clear [j] glide is pronounced): <b>подві́р’я, бур’я́н, пі́р’я, матір’ю, сузі́р’я, Мар’я́на</b>. (When <i>р</i> softens directly into the vowel at the start of a syllable, no apostrophe is written: <b>бу́ря, рясно́, рюмса́ти, крюк, гово́рять</b>.)</li>
              <li><b>After prefixes and first parts of compound words ending in a hard consonant</b>: <b>під’ї́зд</b> (building entrance), <b>об’є́кт</b>, <b>з’ї́сти</b> (to eat up), <b>роз’ясни́ти</b> (to explain), <b>дит’я́сла</b>, <b>комп’ю́тер</b>, <b>інтерв’ю́</b>.</li>
              <li><b>After the Velar «к» in «Лук’я́н» and its derivatives</b>: <b>Лук’я́н, Лук’я́ненко, Лук’я́нівка</b>.</li>
            </ul>
            <p class="mb-2"><b>2. Consonants That Double (Geminate) Between Vowels Before «-я, -ю, -є, -і»:</b></p>
            <ul class="list-disc pl-5 space-y-1">
              <li>The ten dental and palatal consonants <b>д, т, з, с, л, н, ц, ж, ч, ш</b> lengthen and double between vowels in neuter nouns in <i>-я</i> (<b>знання́, життя́, завда́ння, оповіда́ння, пита́ння, взуття́, дозві́лля, воло́сся, узбі́ччя, збі́жжя, сторі́ччя, гілля́, рілля́</b>), in select feminine/masculine nouns (<b>рілля́, стаття́, суддя́, Ілля́</b>), in feminine Instrumental singular of 3rd-declension nouns (<b>ніч → ні́ччю, сіль → сі́ллю, ра́дість → ра́дістю</b> [no doubling after another consonant!]), and in forms of <i>лля́ти / ли́ти</i> (<b>ллю, ллєш</b>).</li>
            </ul>
          `,
        },
        {
          title: 'Advanced Reference 2: Sibilant Assimilation, Reflexive «-ться / -шся», Two-Sound «зг», & Resilient «Ґ ґ»',
          summary: 'Expand to review natural spoken assimilation in «у кни́жці» and «ди́виться / ди́вишся», plus the history of «Ґ ґ».',
          contentHtml: `
            <ul class="list-disc pl-5 space-y-2">
              <li><b>Sibilant Assimilation Before Soft «-ці»:</b> When hushers (<b>ж, ч, ш</b>) stand immediately before soft dental <b>ц</b> in Dative/Locative singular (<i>кни́жка → у кни́жці, ка́чка → ка́чці, до́шка → на до́шці</i>), they assimilate smoothly in natural speech to soft whistlers: <b>у кни́жці</b> <code>[u knɪ́zʲtsʲi]</code>, <b>ка́чці</b> <code>[kɑ́tsʲtsʲi]</code>, <b>на до́шці</b> <code>[nɑ dɔ́sʲtsʲi]</code>.</li>
              <li><b>Spoken Reflexive Endings «-ться» and «-шся»:</b> In natural literary pronunciation, 3rd-person reflexive <b>-ться</b> (<b>він у́читься, вони́ ди́вляться, смію́ться</b>) merges into a lengthened soft <b><code>[tsʲːɑ]</code></b>, and 2nd-person singular <b>-шся</b> (<b>ти у́чишся, ди́вишся, сміє́шся, бої́шся</b>) assimilates to a lengthened soft <b><code>[sʲːɑ]</code></b>.</li>
              <li><b>Soft Sign After «л» When Fleeting «-е-» Drops:</b> In nouns ending in <b>-лець</b>, when fleeting <i>е</i> drops in plurals and oblique cases, a soft sign <b>ь</b> is always written after <b>л</b>: <b>па́лець → па́льці</b> (fingers), <b>стіле́ць → стільці́</b> (chairs), <b>брази́лець → брази́льці</b>.</li>
              <li><b>Two Separate Sounds in «зг» <code>[zɦ]</code> vs. «ж» <code>[ʒ]</code>:</b> Unlike English "zh", Ukrainian <b>зг</b> in <b>зго́да</b> ("Agreed!"), <b>згада́ти</b> ("to remember"), and <b>розга́дка</b> is pronounced as two distinct voiced sounds—dental <code>[z]</code> followed by glottal <code>[ɦ]</code>—never fused into <code>[ʒ]</code>.</li>
              <li><b>History of «Ґ ґ»:</b> Codified in the 1929 Kharkiv orthography to distinguish hard <code>[ɡ]</code> (<b>ґа́нок, ґу́дзик, а́ґрус, дзи́ґа</b>) from voiced glottal <b>Г г</b> <code>[ɦ]</code>, the letter <b>Ґ ґ</b> was removed during the 1933/1946 Soviet orthographic decrees and officially restored to the Ukrainian alphabet in 1990–1993.</li>
            </ul>
          `,
        },
      ],
      takeaways: [
        '«Г г» is a warm, voiced "h" sound [ɦ] (га́рний, гово́рить), whereas hooked «Ґ ґ» is a hard "g" [ɡ] (ґа́нок, ґу́дзик).',
        'One-dot «І і» is pure "ee" [i]; two-dot «Ї ї» is ALWAYS two sounds: "yee" [ji] (Украї́на, Ки́їв, ї́жа).',
        'The soft sign («ь») softens the consonant before it (день, сіль), while the apostrophe («’») keeps the consonant hard and triggers a crisp "y" glide on я, ю, є, ї (сім’я́, п’ять, м’я́со).',
        'Inside a root, «дж» [dʒ] (бджола́, джерело́) and «дз» [dz] (дзво́ник, ґу́дзик) are pronounced as single fused sounds, and doubled consonants before -я (знання́, життя́) are held ~1.5× longer.',
      ],
    },
    examples: [
      { uk: 'Я люблю́ Ки́їв і Украї́ну.', en: 'I love Kyiv and Ukraine.' },
      { uk: 'Це моя́ дру́жна сім’я́.', en: 'This is my friendly family.' },
      { uk: 'Сього́дні ду́же га́рний день.', en: 'Today is a very nice day.' },
      { uk: 'На обі́д є смачни́й украї́нський борщ і м’я́со.', en: 'For lunch there is delicious Ukrainian borscht and meat.' },
      { uk: 'Нове́ знання́, ціка́ве оповіда́ння і лісове́ джерело́.', en: 'New knowledge, an interesting short story (prolonged soft -нн-), and a forest spring (fused дж [dʒ]).' },
      { uk: 'Цього́ ти́жня ми прочита́ли у кни́жці шістна́дцять кори́сних і ра́дісних новин.', en: 'This week (ти́ждень → ти́жня) we read sixteen (шістна́дцять) useful (кори́сний) and joyful (ра́дісний) pieces of news in the book (у кни́жці).' },
      { uk: 'На за́тишному подві́р’ї стої́ть чотири стільці́; ти ди́вишся на збі́жжя й усміха́єшся.', en: 'In the cozy courtyard (подві́р’я with apostrophe) stand four chairs (стіле́ць → стільці́); you look (ди́вишся [-sʲːa]) at the grain (збі́жжя) and smile.' },
      { uk: 'Зго́да! Доро́га веде́ до старови́нного за́мку, де мої́ брати́ слу́хають класи́чний орга́н, а на дверя́х виси́ть міцни́й замо́к.', en: 'Agreed (зго́да [zɦ])! The road (доро́га) leads to the ancient castle (за́мок), where my brothers (брати́) listen to a classical pipe organ (орга́н), and a sturdy lock (замо́к) hangs on the door.' },
    ],
    dialogue: {
      title: 'Ordering Ukrainian Borscht',
      lines: [
        { speaker: 'Оле́на', uk: 'Скажі́ть, будь ла́ска, що сього́дні є на обі́д?', en: 'Tell me, please, what is there for lunch today?' },
        { speaker: 'Офіціа́нт', uk: 'Сього́дні є гаря́чий украї́нський борщ, м’я́со і сві́жий хліб.', en: 'Today there is hot Ukrainian borscht, meat, and fresh bread.' },
        { speaker: 'Оле́на', uk: 'Чудо́во! Я ду́же люблю́ борщ.', en: 'Wonderful! I really love borscht.' },
      ],
    },
    activeRecall: [
      { promptEn: 'I (first-person pronoun)', answerUk: 'я', hint: 'Single letter pronounced "ya"' },
      { promptEn: 'family (written with an apostrophe)', answerUk: 'сім’я́', hint: 'сім + apostrophe + я́' },
      { promptEn: 'what', answerUk: 'що', hint: 'Starts with щ ("shch") + о' },
      { promptEn: 'day (ends with a soft sign)', answerUk: 'день', hint: 'д + е + н + ь' },
    ],
    reviewSummary:
      'Key takeaways: Г г is a voiced breathy "h", while Ґ ґ is a hard "g". Ї ї is always "yee" (Украї́на, Ки́їв). The soft sign (ь) softens a consonant, while the apostrophe (’) separates a consonant from a following "y" glide (сім’я́, п’ять).',
    cfu: [
      {
        q: 'How do you pronounce the letter «Г г» in common Ukrainian words like «га́рний» (nice) and «говори́ти» (to speak)?',
        opts: [
          'Like a hard "g" in "go"',
          'Like a warm, voiced "h" sound (as in "aha" or "behind")',
          'Like "f" in "food"',
        ],
        ans: 1,
        exp: 'Standard Ukrainian «Г г» is a voiced glottal "h" sound [ɦ]. The hard "g" sound is written with the hooked letter «Ґ ґ» (as in ґа́нок).',
      },
      {
        q: 'How is the two-dotted letter «Ї ї» always pronounced in words like «Украї́на», «Ки́їв», and «ї́жа»?',
        opts: ['Like short "i" in "bit"', 'Like "yee" [ji] (with a clear "y" sound at the start)', 'Like "oo" in "moon"'],
        ans: 1,
        exp: '«Ї ї» always represents the two-sound combination "yee" [ji].',
      },
      {
        q: 'What does the apostrophe (’) do in Ukrainian words like «сім’я́» (family), «п’ять» (five), and «м’я́со» (meat)?',
        opts: [
          'It shows that a letter was deleted for slang',
          'It keeps the consonant before it unsoftened and signals a clear "y" sound on the following vowel (я, ю, є, ї)',
          'It makes the vowel silent',
        ],
        ans: 1,
        exp: 'An apostrophe separates a consonant (like м or п) from я, ю, є, or ї so you pronounce a distinct "y" glide (seem-YA, pyat, MYA-so).',
      },
    ],
    practice: [
      {
        prompt: 'Which word means "this is" and starts with the letter «Ц ц» ("ts")?',
        opts: ['що', 'це', 'ще'],
        ans: 1,
        audioUk: 'це',
        exp: '«це» (pronounced "tseh") means "this / this is / it is".',
      },
      {
        prompt: 'Choose the Ukrainian word for "family" (notice the apostrophe before -я́):',
        opts: ['сім’я́', 'земля́', 'пі́сня'],
        ans: 0,
        audioUk: 'сім’я́',
        exp: '«сім’я́» (seem-YA) means "family".',
      },
      {
        prompt: 'How is the final letter «в» pronounced at the end of «Ки́їв» (Kyiv)?',
        opts: ['Like voiceless "f"', 'Like a rounded "w" sound [w]', 'Like "p"'],
        ans: 1,
        audioUk: 'Ки́їв',
        exp: 'At the end of a word or before a consonant, Ukrainian «в» sounds like a rounded "w" [w], never "f".',
      },
      {
        prompt: 'Which word means "food" and starts with «Ї ї» ("yee")?',
        opts: ['ї́жа', 'іде́я', 'ім’я́'],
        ans: 0,
        audioUk: 'ї́жа',
        exp: '«ї́жа» (YEE-zha) means "food".',
      },
      {
        prompt: 'Which word means "nice / beautiful" and begins with the warm "h" letter «Г г»?',
        opts: ['ґа́нок', 'га́рний', 'чо́рний'],
        ans: 1,
        audioUk: 'га́рний',
        exp: '«га́рний» (HAR-nyy) means "nice, fine, or beautiful".',
      },
    ],
    vocab: [
      ['я', 'PRON', 'I', 'Я вивча́ю украї́нську.', 'I am learning Ukrainian.'],
      ['це', 'PRON', 'this / this is / it is', 'Це мій друг.', 'This is my friend.'],
      ['що', 'PRON', 'what', 'Що це?', 'What is this?'],
      ['день', 'NOUN', 'day', 'Сього́дні га́рний день.', 'Today is a nice day.'],
      ['га́рний', 'ADJ', 'beautiful / nice / fine', 'Яки́й га́рний парк!', 'What a nice park!'],
      ['сім’я́', 'NOUN', 'family', 'Це на́ша сім’я́.', 'This is our family.'],
      ['ім’я́', 'NOUN', 'first name', 'Це га́рне ім’я́.', 'This is a beautiful name.'],
      ['ї́жа', 'NOUN', 'food', 'Тут смачна́ ї́жа.', 'There is tasty food here.'],
      ['м’я́со', 'NOUN', 'meat', 'Ми купу́ємо сві́же м’я́со.', 'We are buying fresh meat.'],
      ['борщ', 'NOUN', 'borscht (Ukrainian beet soup)', 'Я ду́же люблю́ борщ.', 'I really love borscht.'],
      ['сіль', 'NOUN', 'salt', 'Ось сіль і хліб.', 'Here are salt and bread.'],
      ['ніч', 'NOUN', 'night', 'Ти́ха те́пла ніч.', 'A quiet warm night.'],
      ['п’ять', 'NUM', 'five', 'У ме́не є п’ять хвили́н.', 'I have five minutes.'],
      ['життя́', 'NOUN', 'life', 'Життя́ трива́є.', 'Life goes on.'],
      ['любо́в', 'NOUN', 'love', 'З любо́в’ю з Украї́ни.', 'With love from Ukraine.'],
    ],
    exam: [
      {
        q: 'Which Ukrainian letter represents the "shch" sound in «що» (what) and «борщ»?',
        opts: ['Ш ш', 'Ч ч', 'Щ щ'],
        ans: 2,
        exp: '«Щ щ» is pronounced as the two-sound combination "shch" [ʃtʃ].',
      },
      {
        q: 'What does the soft sign «ь» do at the end of «день» (day) and «сіль» (salt)?',
        opts: [
          'It softens (palatalizes) the consonant right before it',
          'It adds an "uh" vowel sound',
          'It makes the word plural',
        ],
        ans: 0,
        exp: 'The soft sign «ь» softens the preceding consonant without adding a separate syllable.',
      },
      {
        q: 'Which pair of words both contain the Ukrainian apostrophe (’)?',
        opts: ['сім’я́ and п’ять', 'ма́ма and та́то', 'день and ніч'],
        ans: 0,
        exp: 'Both «сім’я́» (family) and «п’ять» (five) use an apostrophe before я to keep the preceding labial consonant hard.',
      },
      {
        q: 'How is «це» (this is) pronounced?',
        opts: ['"cheh"', '"tseh"', '"seh"'],
        ans: 1,
        exp: '«Ц ц» sounds like "ts" in "cats", so «це» is pronounced "tseh".',
      },
      {
        q: 'Which letter is used for the hard "g" sound in words like «ґа́нок» (porch) and «ґу́дзик» (button)?',
        opts: ['Г г', 'Ґ ґ', 'Х х'],
        ans: 1,
        exp: '«Ґ ґ» (with the upturned hook) represents the hard "g" sound [ɡ].',
      },
      {
        q: 'What is the English meaning of «Сього́дні ду́же га́рний день»?',
        opts: ['Today is a very nice day.', 'Tomorrow is a new week.', 'Here is my family.'],
        ans: 0,
        exp: '«сього́дні» = today, «ду́же» = very, «га́рний» = nice/beautiful, «день» = day.',
      },
    ],
  },
  {
    id: 'A0.3',
    level: 'A0',
    topicTag: 'Pre-A1 Foundation • Greetings & Introductions',
    title: 'Everyday Greetings, Politeness & Introducing Yourself',
    objectives: [
      'Greet people naturally in the morning, afternoon, and evening.',
      'Choose appropriately between informal «ти» and polite/formal «Ви».',
      'Introduce yourself («Мене́ зва́ти...»), ask how someone is doing, and use essential polite expressions.',
    ],
    summary:
      'Whether you are meeting a new Ukrainian friend, walking into a café in Lviv, or joining a video call with colleagues in Kyiv, warm greetings and polite phrases open every conversation.',
    rules: [
      '<b>1. Saying Hello Throughout the Day</b>: Between friends, say <b>Приві́т!</b> (Hi!) or <b>Віта́ю!</b> (Greetings! / Hello!). For polite everyday greetings at any level of formality, use:<ul><li>Morning: <b>До́брого ра́нку!</b> (Good morning!)</li><li>Afternoon / Daytime: <b>До́брий день!</b> (Good day! / Hello!)</li><li>Evening: <b>До́брий ве́чір!</b> (Good evening!)</li></ul>',
      '<b>2. Informal «ти» vs. Polite/Plural «Ви»</b>: Ukrainian has two words for "you":<ul><li><b>ти</b> — used with friends, family members, children, and peers. (<i>Як у те́бе спра́ви?</i> = How are things with you?)</li><li><b>Ви</b> — used when speaking politely to a stranger, an older person, a client, or to more than one person. (<i>Як у Вас спра́ви?</i>)</li></ul>',
      '<b>3. Introducing Yourself</b>: To say "My name is...", Ukrainians literally say "They call me...": <b>Мене́ зва́ти...</b> (for example, <i>Мене́ зва́ти А́нна</i>). To ask someone’s name, say <b>Як тебе́ зва́ти?</b> (informal) or <b>Як Вас зва́ти?</b> (polite/formal). Reply with <b>Ду́же приє́мно!</b> (Nice to meet you!).',
      '<b>4. Essential Politeness & Saying Goodbye</b>:<ul><li><b>Дя́кую!</b> = Thank you! / <b>Ду́же дя́кую!</b> = Thank you very much!</li><li><b>Будь ла́ска</b> = Please, AND also You’re welcome! (In western Ukraine, you will also often hear <b>Про́шу!</b>).</li><li><b>Перепро́шую</b> or <b>Ви́бачте</b> = Excuse me / I’m sorry.</li><li><b>До поба́чення!</b> = Goodbye! / <b>До зу́стрічі!</b> = See you soon! / <b>На добра́ніч!</b> = Good night!</li></ul>',
      '<b>5. Polite Titles (Па́не, Па́ні, Пано́ве) & Ukrainian Patronymics (По ба́тькові)</b>:<ul><li>When addressing someone politely by title, use <b>Па́не</b> (Mr./Sir, Vocative of <i>пан</i>), <b>Па́ні</b> (Ms./Mrs./Madam — indeclinable), or the collective Vocative plural <b>Пано́ве!</b> / <b>Шано́вні па́ні та пано́ве!</b> (Ladies and gentlemen!).</li><li>In formal, academic, and official contexts, Ukrainians use a first name + <b>patronymic</b> (<b>ім’я́ по ба́тькові</b>, formed from the father’s first name): masculine <b>-ович / -йович</b> (<i>Іва́н → Іва́нович, Сергі́й → Сергі́йович</i>; Vocative: <b>Іва́новичу!</b>) and feminine <b>-івна / -ївна</b> (<i>Іва́н → Іва́нівна, Сергі́й → Сергі́ївна</i>; Vocative: <b>Іва́нівно!</b>).</li></ul>',
      '<b>6. Three Ways to State Names, Formal Introductions & «про́шу» vs. «прошу́»</b>:<ul><li><b>Stating & Asking Names</b>: In addition to <b>Мене́ зва́ти...</b>, Ukrainian uses <b>Мене́ звуть Тара́с Ко́валь</b> ("They call me Taras Koval"; <i>Його́ звуть Мико́ла, Її́ звуть Окса́на</i>) OR <b>Моє́ ім’я́ Тара́с, моє́ прі́звище Ко́валь</b> ("My first name is Taras, my surname is Koval"; question: <i>Як Ва́ше ім’я́ та прі́звище?</i>).</li><li><b>Introducing Yourself & Others</b>: In formal settings, say <b>Дозво́льте відрекомендува́тися!</b> (Allow me to introduce myself!) or <b>Дозво́льте познайо́мити: це мій коле́га</b> (Allow me to introduce: this is my colleague). With friends, say <b>Познайо́мся: це мій друг</b> (Meet my friend).</li><li><b>Stress Minimal Pair «про́шу» vs. «прошу́»</b>: Both forms come from <i>проси́ти</i>, but stress changes the meaning! <b>Про́шу!</b> (stress on the first syllable) means "please / go ahead / help yourself / you’re welcome" (<i>Про́шу заходи́ти! Про́шу сіда́ти!</i>), whereas <b>прошу́</b> (stress on the second syllable) means "I ask / I request" (<i>Я прошу́ вас зачека́ти</i>).</li></ul>',
      '<b>7. Standard vs. Regional/Diaspora Greetings («Як ся ма́єш?»), Language Adverbials & Phone Etiquette</b>:<ul><li><b>Asking "How are you?" Across Regions</b>: Standard literary Ukrainian uses <b>Як у те́бе (у Вас) спра́ви?</b> or <b>Як пожива́єш (пожива́єте)?</b>. In Western Ukraine (Galicia) and the North American Ukrainian diaspora, you will also frequently hear the warm greeting <b>Як ся ма́єш?</b> (informal) / <b>Як ся ма́єте?</b> (formal/plural), where the reflexive particle <i>ся</i> stands independently before the verb!</li><li><b>Speaking a Language</b>: Standard Ukrainian expresses "in Ukrainian / in English" with the Instrumental case (<b>розмовля́ти украї́нською мо́вою / англі́йською мо́вою</b>) or the adverb in <b>-ськи</b> (<b>говори́ти по-украї́нськи / по-англі́йськи</b>), whereas older diaspora speech often uses <i>по-украї́нському / по-англі́йському</i>.</li><li><b>Phone & Parting Expressions</b>: Answer the phone with <b>Алло́! Слу́хаю!</b> ("Hello! I’m listening!"); reply to <i>Дя́кую</i> with <b>Будь ла́ска!</b>, <b>Про́шу!</b>, or <b>Нема́ за що!</b> ("Don’t mention it! / Not at all!"); and wish someone well at parting with <b>На все до́бре!</b> or <b>Усього́ найкра́щого!</b> ("All the best!").</li></ul>',
      '<b>8. Transitioning from «Ви» to «ти» («перейти́ на ти»), Full Telephone Etiquette & Tag Questions («..., так?»)</b>:<ul><li><b>Social Etiquette of «перейти́ на ти»</b>: When two adults meet in professional or formal life, they address each other with polite <b>Ви</b> (and often first name + patronymic: <i>Іри́но Васи́лівно</i>). Moving to informal <b>ти</b> and first-name basis is a meaningful social milestone called <b>перейти́ на «ти»</b> (<i>Ми вже перейшли́ на «ти»</i>), which by etiquette is always initiated by the older person, the senior colleague, or the host: <b>Дава́йте пере́йдемо на «ти»!</b> ("Let’s switch to <i>ти</i>!").</li><li><b>Complete Telephone Formulas</b>:<ul><li>Identifying yourself politely on the phone: <b>Це Вас турбу́є Джон</b> ("This is John bothering/calling you") or <b>Це гово́рить Іри́на</b> ("This is Iryna speaking").</li><li>Asking for someone on the line (Accusative/Genitive after <i>попроси́ти</i>): <b>Чи мо́жна попроси́ти до телефо́ну па́ні Малярчу́к / па́на Малярчука́?</b> ("May I ask for Ms. Maliarchuk / Mr. Maliarchuk to come to the phone?").</li><li>Asking the caller to hold & closing: <b>Одну́ хвили́ночку, будь ла́ска!</b> ("Just one moment, please!"), <b>Переда́йте, будь ла́ска, приві́т Іва́нові</b> ("Please pass on my regards to Ivan"), and <b>Дя́кую за дзвіно́к!</b> ("Thank you for the call!").</li></ul></li><li><b>Conversational Tag Questions («..., так?»)</b>: To turn any statement into a natural confirmation question ("...isn’t she? / ...aren’t you? / ...right?"), simply add a comma and <b>так?</b> (or <b>пра́вда?</b>) with rising intonation at the end: <b>Ві́ра украї́нка, так?</b> ("Vira is Ukrainian, isn’t she?"), <b>Ви сього́дні працю́єте вдо́ма, так?</b></li></ul>',
    ],
    structuredLesson: {
      bigIdea: {
        headline: 'Open Every Conversation Warmly: Time-of-Day Greetings, «ти» vs. «Ви», Introductions & Politeness',
        body: 'In English, a single word ("you") works for a toddler, your best friend, a stranger on the train, and a room full of professors. Ukrainian gives you two distinct forms—informal «ти» for friends, family, and peers, and polite/plural «Ви» for strangers, elders, formal settings, or groups. Combined with time-of-day greetings, three ways to state your name, and polite titles («Па́не / Па́ні»), you can navigate any social or professional interaction in Ukraine.',
        keyTerms: [
          {
            term: 'Informal «ти» vs. Polite/Plural «Ви»',
            plainEnglish: '«ти» is singular and informal (friends, family, children). «Ви» is used BOTH for a group ("you all") and as a sign of respect for one person you don’t know closely yet.',
          },
          {
            term: '«Мене́ зва́ти...» (Literally "Me [they] call...")',
            plainEnglish: 'The most natural Ukrainian formula for "My name is...". Instead of saying "My name is...", Ukrainians say how people call them: «Мене́ зва́ти Тара́с».',
          },
          {
            term: 'Vocative Case (Кличний відмінок — Addressing Someone Directly)',
            plainEnglish: 'When calling someone by name or title ("Oksana!", "Mr. Andrew!"), Ukrainian changes the end of the word to show you are speaking directly to them: Окса́на → Окса́но!, пан → Па́не!',
          },
          {
            term: 'Patronymic (Ім’я́ по ба́тькові)',
            plainEnglish: 'A middle name derived from a person’s father’s first name (-ович/-йович for men, -івна/-ївна for women), used with the first name in formal, academic, and official contexts (e.g., Оле́на Іва́нівна).',
          },
        ],
      },
      seeItInAction: [
        {
          uk: '<mark class="vc-highlight">До́брого ра́нку</mark>! <mark class="vc-highlight">Мене́ зва́ти</mark> Олекса́ндр. А як <mark class="vc-highlight">Вас</mark> зва́ти?',
          en: 'Good morning! My name is Oleksandr. And what is your name (polite)?',
          highlightNote: 'Notice «До́брого ра́нку!» for the morning and polite «Вас» when meeting someone new.',
        },
        {
          uk: '<mark class="vc-highlight">Приві́т</mark>, Окса́н<mark class="vc-highlight">о</mark>! Як у <mark class="vc-highlight">те́бе</mark> спра́ви? — <mark class="vc-highlight">Дя́кую</mark>, все до́бре!',
          en: 'Hi, Oksana! How are things with you (informal)? — Thank you, everything is good!',
          highlightNote: 'With a friend, use «Приві́т!», direct address «Окса́но!» (Vocative), and informal «у те́бе».',
        },
        {
          uk: '<mark class="vc-highlight">Перепро́шую</mark>, де тут кав’я́рня? — Ось там. — Ду́же дя́кую! — <mark class="vc-highlight">Будь ла́ска</mark>!',
          en: 'Excuse me, where is the coffee shop here? — Right over there. — Thank you very much! — You’re welcome!',
          highlightNote: '«Будь ла́ска» means BOTH "please" (when requesting) and "you’re welcome" (when replying to дя́кую)!',
        },
        {
          uk: 'Дозво́льте відрекомендува́тися: <mark class="vc-highlight">моє́ ім’я́</mark> Петро́, а <mark class="vc-highlight">моє́ прі́звище</mark> Ко́валь. <mark class="vc-highlight">Про́шу</mark> сіда́ти!',
          en: 'Allow me to introduce myself: my first name is Petro, and my surname is Koval. Please have a seat!',
          highlightNote: 'First-syllable stress «Про́шу!» means "please / go ahead / you’re welcome", whereas second-syllable «прошу́» means "I ask/request".',
        },
      ],
      visualTables: [
        {
          title: '1. Greeting & Parting Throughout the Day',
          subtitle: 'Match your greeting to the time of day and level of formality.',
          headers: ['Time / Situation', 'Ukrainian Phrase', 'Literal Sense', 'Natural English Meaning'],
          rows: [
            ['Morning (until ~11:00–12:00)', '<b class="uk-text">До́брого ра́нку!</b>', 'Of a good morning! (Genitive wish)', 'Good morning!'],
            ['Daytime / Afternoon', '<b class="uk-text">До́брий день!</b> (or <b class="uk-text">Добри́день!</b>)', 'Good day!', 'Good afternoon! / Hello!'],
            ['Evening (after ~5:00–6:00 PM)', '<b class="uk-text">До́брий ве́чір!</b> (or <b class="uk-text">Добри́вечір!</b>)', 'Good evening!', 'Good evening!'],
            ['Anytime — Informal (Friends)', '<b class="uk-text">Приві́т!</b>', 'Hi / Salutation!', 'Hi! / Hey!'],
            ['Anytime — Warm & Universal', '<b class="uk-text">Віта́ю!</b>', 'I greet (you)!', 'Hello! / Greetings! / Congratulations!'],
            ['Parting — Standard Polite', '<b class="uk-text">До поба́чення!</b>', 'Until seeing (each other)!', 'Goodbye!'],
            ['Parting — Warm / Soon', '<b class="uk-text">До зу́стрічі!</b> / <b class="uk-text">До за́втра!</b>', 'Until the meeting! / Until tomorrow!', 'See you soon! / See you tomorrow!'],
            ['Parting — Best Wishes', '<b class="uk-text">На все до́бре!</b> / <b class="uk-text">Усього́ найкра́щого!</b>', 'For all good! / Of all the best!', 'All the best! / Take care!'],
            ['Before Bedtime Only', '<b class="uk-text">На добра́ніч!</b>', 'For a good night!', 'Good night! (when going to sleep)'],
          ],
          footnote: 'Why does "Good morning" end in -ого -у («До́брого ра́нку!»)? It is an elliptical wish: "[Я ба́жаю Вам] до́брого ра́нку!" ("I wish you a good morning!").',
        },
        {
          title: '2. Informal «ти» vs. Polite/Plural «Ви» Across Everyday Questions',
          subtitle: 'Every greeting, introduction, and polite question has an informal «ти» version and a respectful/plural «Ви» version.',
          headers: ['Communicative Goal', 'Informal («ти» — Friend, Peer, Child)', 'Polite or Plural («Ви» — Stranger, Elder, Formal, Group)'],
          rows: [
            ['Subject Pronoun ("you")', '<b class="uk-text">ти</b>', '<b class="uk-text">Ви</b> (capitalized in polite correspondence) / <b class="uk-text">ви</b> (plural)'],
            ['What is your name?', '<b class="uk-text">Як тебе́ зва́ти?</b> / <b class="uk-text">Як тебе́ звуть?</b>', '<b class="uk-text">Як Вас зва́ти?</b> / <b class="uk-text">Як Вас звуть?</b>'],
            ['How are things with you?', '<b class="uk-text">Як у те́бе спра́ви?</b>', '<b class="uk-text">Як у Вас спра́ви?</b>'],
            ['How are you getting on?', '<b class="uk-text">Як пожива́єш?</b> (West/Diaspora: <b class="uk-text">Як ся ма́єш?</b>)', '<b class="uk-text">Як пожива́єте?</b> (West/Diaspora: <b class="uk-text">Як ся ма́єте?</b>)'],
            ['Excuse me / Forgive me', '<b class="uk-text">Ви́бач!</b> / <b class="uk-text">Перепро́шую!</b>', '<b class="uk-text">Ви́бачте!</b> / <b class="uk-text">Перепро́шую!</b>'],
            ['Meet my friend / colleague!', '<b class="uk-text">Познайо́мся: це мій друг.</b>', '<b class="uk-text">Дозво́льте познайо́мити: це мій коле́га.</b>'],
          ],
        },
        {
          title: '3. Three Ways to State & Ask Names in Ukrainian',
          subtitle: 'You will hear all three constructions in everyday conversation, travel, and official settings.',
          headers: ['Construction Pattern', '1st Person ("My name is...")', '2nd Person ("Your name")', '3rd Person ("His / Her name")'],
          rows: [
            [
              '<b>1. «...зва́ти»</b> (Most common)',
              '<b class="uk-text">Мене́ зва́ти А́нна / Тара́с.</b>',
              '<b class="uk-text">Як тебе́ / Вас зва́ти?</b>',
              '<b class="uk-text">Його́ зва́ти Мико́ла. Її́ зва́ти Окса́на.</b>',
            ],
            [
              '<b>2. «...звуть»</b> ("They call...")',
              '<b class="uk-text">Мене́ звуть Тара́с Ко́валь.</b>',
              '<b class="uk-text">Як тебе́ / Вас звуть?</b>',
              '<b class="uk-text">Його́ звуть Андрі́й. Її́ звуть Марі́я.</b>',
            ],
            [
              '<b>3. «Моє́ ім’я́ / прі́звище»</b> (Formal)',
              '<b class="uk-text">Моє́ ім’я́ Тара́с, моє́ прі́звище Ко́валь.</b>',
              '<b class="uk-text">Як Ва́ше ім’я́ та прі́звище?</b>',
              '<b class="uk-text">Його́ ім’я́ Петро́. Її́ прі́звище Бо́йко.</b>',
            ],
          ],
        },
        {
          title: '4. Polite Titles («Па́не, Па́ні, Пано́ве»), Patronymics & Telephone Formulas',
          subtitle: 'Essential etiquette for addressing people respectfully in person and on the phone.',
          headers: ['Category', 'Ukrainian Expression', 'English Meaning & Usage Note'],
          rows: [
            ['Polite Titles (Direct Address)', '<b class="uk-text">Па́не Андрі́ю! / Па́ні Оле́но! / Пано́ве!</b>', 'Mr. Andriy! / Ms. Olena! / Gentlemen (or Ladies & Gentlemen: <b class="uk-text">Шано́вні па́ні та пано́ве!</b>). Note that <b class="uk-text">па́ні</b> never changes its ending!'],
            ['Patronymics (<b class="uk-text">по ба́тькові</b>)', 'Male: <b class="uk-text">-ович / -йович</b> (<b class="uk-text">Іва́нович, Сергі́йович</b>)<br>Female: <b class="uk-text">-івна / -ївна</b> (<b class="uk-text">Іва́нівна, Сергі́ївна</b>)', 'Used after the first name for teachers, doctors, and officials. In direct Vocative address: <b class="uk-text">Петре́ Іва́новичу! Оле́но Іва́нівно!</b>'],
            ['Answering & Identifying on Phone', '<b class="uk-text">Алло́! Слу́хаю! — Це Вас турбу́є Марко́ / Це гово́рить Іри́на.</b>', '"Hello! I’m listening! — This is Marko calling you / This is Iryna speaking."'],
            ['Asking for Someone on Phone', '<b class="uk-text">Чи мо́жна попроси́ти до телефо́ну па́ні Малярчу́к / па́на Малярчука́?</b>', '"May I ask for Ms. Maliarchuk / Mr. Maliarchuk to come to the phone?" — reply: <b class="uk-text">Одну́ хвили́ночку, будь ла́ска!</b> ("Just one moment, please!")'],
          ],
        },
      ],
      diagrams: [
        {
          title: 'The Social Milestone of «перейти́ на ти» (Switching from Formal «Ви» to Informal «ти»)',
          subtitle: 'How Ukrainian adults transition from polite distance to warm familiarity.',
          type: 'flow',
          nodes: [
            {
              label: 'Stage 1: Initial Meeting',
              value: 'Polite «Ви» (+ Па́не/Па́ні or Patronymic)',
              description: 'Strangers, colleagues, and clients begin on «Ви»: «Як Вас зва́ти? Ви працю́єте тут, так?»',
            },
            {
              label: 'Stage 2: The Invitation',
              value: '«Дава́йте пере́йдемо на "ти"!»',
              description: 'By etiquette, the older person, senior colleague, or host proposes switching: "Let’s switch to ти!"',
            },
            {
              label: 'Stage 3: First-Name Basis',
              value: 'Informal «ти» («Ми вже перейшли́ на "ти"»)',
              description: 'Both speakers now use «ти» and first names in the Vocative case (Окса́но, Андрі́ю, Тара́се).',
            },
          ],
        },
        {
          title: 'Stress Minimal Pair «про́шу» vs. «прошу́» & Regional Greeting Variants',
          subtitle: 'Pay attention to which syllable carries the stress in «просити» forms!',
          type: 'comparison',
          nodes: [
            {
              label: 'Про́шу! (1st-Syllable Stress)',
              value: '"Please go ahead! / Help yourself! / You’re welcome!"',
              description: 'Used to invite someone in (Про́шу заходи́ти! Про́шу сіда́ти!), reply to Дя́кую, or say "Pardon?" when you didn’t catch a word.',
            },
            {
              label: 'Я прошу́... (2nd-Syllable Stress)',
              value: '"I ask / I request..." (Active Verb)',
              description: 'Regular 1st-person singular of проси́ти (to ask/request): «Я прошу́ вас тро́хи зачека́ти» (I ask you to wait a little).',
            },
            {
              label: 'Standard vs. Western / Diaspora "How are you?"',
              value: 'Як у те́бе спра́ви? • Як ся ма́єш?',
              description: 'Standard Ukrainian places -ся attached at the end of verbs, while Western Ukraine (Galicia) and the diaspora preserve movable «ся» before the verb in «Як ся ма́єш? / Як ся ма́єте?».',
            },
          ],
        },
      ],
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Pick Your Greeting by Time of Day',
          explanation: 'Use «До́брого ра́нку!» in the morning, «До́брий день!» during the day, and «До́брий ве́чір!» in the evening. With close friends, «Приві́т!» works at any hour.',
          examples: [
            { uk: 'До́брого ра́нку! Чи мо́жна одну́ ка́ву, будь ла́ска?', en: 'Good morning! May I have one coffee, please?' },
          ],
        },
        {
          stepNumber: 2,
          title: 'Choose «ти» or «Ви» Before Asking a Question',
          explanation: 'Ask yourself: am I speaking to a close friend/child («ти» → те́бе, пожива́єш), or to a stranger, elder, or group («Ви» → Вас, пожива́єте)?',
          examples: [
            { uk: 'Як тебе́ зва́ти? (to a peer/child) • Як Вас зва́ти? (to a stranger/elder)', en: 'What is your name?' },
          ],
        },
        {
          stepNumber: 3,
          title: 'State Your Name with «Мене́ зва́ти...» and Reply «Ду́же приє́мно!»',
          explanation: 'Give your name in the Nominative dictionary form after «Мене́ зва́ти...» and respond to the other person’s name with «Ду́же приє́мно!» ("Very nice to meet you!").',
          examples: [
            { uk: 'Мене́ зва́ти Софі́я. — Ду́же приє́мно! Мені́ тако́ж ду́же приє́мно!', en: 'My name is Sofiya. — Very nice to meet you! Nice to meet you too!' },
          ],
        },
        {
          stepNumber: 4,
          title: 'Add «..., так?» to Confirm Information Effortlessly',
          explanation: 'Need to ask "...isn’t it?", "...aren’t you?", or "...right?" at the end of any statement? Just add a comma and «так?» (or «пра́вда?») with rising intonation!',
          examples: [
            { uk: 'Ві́ра украї́нка, так? Ви сього́дні працю́єте вдо́ма, так?', en: 'Vira is Ukrainian, isn’t she? You are working at home today, aren’t you?' },
          ],
        },
      ],
      moreExamples: [
        {
          uk: '<mark class="vc-highlight">До поба́чення</mark>, <mark class="vc-highlight">па́ні Оле́но Іва́нівно</mark>! Га́рного вам дня!',
          en: 'Goodbye, Ms. Olena Ivanivna! Have a nice day!',
          highlightNote: 'Notice how both the first name (Оле́но) and patronymic (Іва́нівно) take the Vocative -о ending, while па́ні never changes.',
        },
        {
          uk: '<mark class="vc-highlight">Як пожива́єте</mark>? (У діа́спорі та Галичині́: <mark class="vc-highlight">Як ся ма́єте</mark>?) — Дя́кую, чу́дово! <mark class="vc-highlight">На все до́бре</mark>!',
          en: 'How are you doing? (In the diaspora and Galicia: Як ся ма́єте?) — Thank you, wonderfully! All the best!',
          highlightNote: 'Comparing standard «Як пожива́єте?» with Western/diaspora «Як ся ма́єте?» and the warm parting wish «На все до́бре!».',
        },
        {
          uk: '<mark class="vc-highlight">Алло́</mark>! <mark class="vc-highlight">Це Вас турбу́є</mark> Марко́. Чи мо́жна попроси́ти до телефо́ну па́ні Малярчу́к? — <mark class="vc-highlight">Одну́ хвили́ночку</mark>! До ре́чі, ми вже <mark class="vc-highlight">перейшли́ на «ти»</mark>, <mark class="vc-highlight">так</mark>?',
          en: 'Hello! This is Marko calling you. May I ask for Ms. Maliarchuk to come to the phone? — One moment! By the way, we have already switched to «ти», haven’t we?',
          highlightNote: 'Combines polite phone opening («Це Вас турбу́є...»), holding («Одну́ хвили́ночку!»), «перейшли́ на ти», and the tag question «..., так?».',
        },
      ],
      exceptionsAndEdgeCases: [
        {
          ruleTitle: 'Why «До́брого ра́нку!» Uses Genitive While «До́брий день / ве́чір!» Uses Nominative',
          ruleExplanation: 'Students often wonder why "Good morning" is «До́брого ра́нку!» (-ого -у), whereas "Good day" and "Good evening" are «До́брий день!» and «До́брий ве́чір!».',
          exceptions: [
            {
              item: 'До́брого ра́нку! (Genitive of wish after implied «Бажа́ю Вам...»)',
              note: 'In the morning, the Genitive form is standard. When parting, wishes also use the Genitive: «Га́рного дня!» (Have a nice day!), «Га́рного ве́чора!» (Have a nice evening!).',
            },
            {
              item: 'До́брий день! / До́брий ве́чір! (or fused Добри́день! / Добри́вечір!)',
              note: 'In daytime and evening greetings upon arrival, the Nominative phrase is standard in modern literary Ukrainian.',
            },
          ],
        },
        {
          ruleTitle: 'Saying "Speak Ukrainian / English": Standard Instrumental vs. Adverbial Forms',
          ruleExplanation: 'There are two standard ways to say "in Ukrainian / in English" after verbs like розмовля́ти or говори́ти:',
          exceptions: [
            {
              item: 'розмовля́ти / говори́ти украї́нською (мо́вою), англі́йською (мо́вою)',
              note: 'The primary literary standard uses the Instrumental feminine form of the language adjective (with мо́вою optional).',
            },
            {
              item: 'говори́ти по-украї́нськи, по-англі́йськи (vs. diaspora/colloquial по-украї́нському)',
              note: 'The adverbial form in «по-...-ськи» is also standard in conversation; older diaspora speech often uses «по-украї́нському».',
            },
          ],
        },
      ],
      commonMistakes: [
        {
          mistake: 'Translating "My name is..." word-for-word as *«Мій ім’я́ є...» or *«Я є зва́ти...»',
          wrongUk: '*Мій ім’я́ є Оле́на / *Я є зва́ти Оле́на.',
          correctUk: 'Мене́ зва́ти Оле́на. (or: Моє́ ім’я́ Оле́на.)',
          explanation: 'Use «Мене́ зва́ти...» ("They call me..."). If you use the noun «ім’я́» (first name), remember it is neuter («моє́ ім’я́») and takes no present-tense verb "is".',
        },
        {
          mistake: 'Using «На добра́ніч!» as an evening greeting when arriving at a restaurant at 8:00 PM',
          wrongUk: 'На добра́ніч! Сто́лик на двох, будь ла́ска.',
          correctUk: 'До́брий ве́чір! Сто́лик на двох, будь ла́ска.',
          explanation: 'Just like English "Good night!", «На добра́ніч!» is ONLY used when parting for bed/sleep. Use «До́брий ве́чір!» when greeting someone in the evening.',
        },
        {
          mistake: 'Confusing «Перепро́шую / Ви́бачте» (Excuse me) with «Будь ла́ска» (Please / You’re welcome)',
          wrongUk: '*Будь ла́ска, де тут метро́? (to get a stranger’s attention)',
          correctUk: 'Перепро́шую (or Ви́бачте), де тут метро́?',
          explanation: 'To politely get someone’s attention or apologize, start with «Перепро́шую» or «Ви́бачте». Use «будь ла́ска» inside a request ("Да́йте, будь ла́ска, ка́ву") or to reply "You’re welcome!".',
        },
      ],
      inlineChecks: [
        {
          id: 'a03-check-1',
          question: 'Which two meanings does the everyday phrase «будь ла́ска» have in Ukrainian?',
          options: [
            '"Good morning" and "Good evening"',
            '"Please" (when making a request) and "You’re welcome" (when replying to дя́кую)',
            '"Excuse me" and "Goodbye"',
          ],
          correctIndex: 1,
          explanation: '«Будь ла́ска» serves as both "please" and "you’re welcome" (alongside «Про́шу!» and «Нема́ за що!»).',
        },
        {
          id: 'a03-check-2',
          question: 'What is the difference between «Про́шу!» (stress on the 1st syllable) and «я прошу́» (stress on the 2nd syllable)?',
          options: [
            '«Про́шу!» means "Please / Go ahead / You’re welcome!", while «я прошу́» means "I ask / I request"',
            'They have the exact same meaning',
            '«Про́шу!» is plural and «прошу́» is singular',
          ],
          correctIndex: 0,
          explanation: 'Shifting stress from the first syllable («Про́шу!») to the second syllable («я прошу́») distinguishes the polite formula from the active verb "I ask/request".',
        },
        {
          id: 'a03-check-3',
          question: 'In Ukrainian social etiquette, what does the phrase «Дава́йте пере́йдемо на "ти"!» mean?',
          options: [
            '"Let’s switch from formal Ви to informal ти (first-name basis)!"',
            '"Let’s speak more slowly!"',
            '"Let’s call on the telephone tomorrow!"',
          ],
          correctIndex: 0,
          explanation: '«Перейти́ на "ти"» is the social transition from formal «Ви» to informal «ти», traditionally proposed by the older or senior person.',
        },
      ],
      completeReference: [
        {
          title: 'Advanced Reference: Forming Ukrainian Patronymics («Ім’я́ по ба́тькові») & Their Vocative Forms',
          summary: 'Expand to see how masculine (-ович/-йович) and feminine (-івна/-ївна) patronymics are formed and addressed.',
          contentHtml: `
            <p class="mb-2">In formal, academic, medical, and governmental settings in Ukraine, adults are politely addressed by their <b>First Name + Patronymic (ім’я́ по ба́тькові)</b>, derived from their father’s given name:</p>
            <table class="vc-table mb-3">
              <thead>
                <tr>
                  <th>Father’s Name</th>
                  <th>Son’s Patronymic (Nom. → Vocative)</th>
                  <th>Daughter’s Patronymic (Nom. → Vocative)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>Іва́н, Петро́, Богда́н, Васи́ль</b> (Hard/Soft Consonants)</td>
                  <td><b>Іва́нович → Іва́новичу!</b><br><b>Петро́вич → Петро́вичу!</b><br><b>Васи́льович → Васи́льовичу!</b></td>
                  <td><b>Іва́нівна → Іва́нівно!</b><br><b>Петрі́вна → Петрі́вно!</b><br><b>Васи́лівна → Васи́лівно!</b></td>
                </tr>
                <tr>
                  <td><b>Сергі́й, Андрі́й, Ю́рій, Олексі́й</b> (Stems in -й)</td>
                  <td><b>Сергі́йович → Сергі́йовичу!</b><br><b>Андрі́йович → Андрі́йовичу!</b></td>
                  <td><b>Сергі́ївна → Сергі́ївно!</b><br><b>Андрі́ївна → Андрі́ївно!</b> (two-dot <b>-ївна</b>!)</td>
                </tr>
                <tr>
                  <td><b>Special Traditional Forms:</b><br><b>Мико́ла, Ілля́, Лука́, Хома́, Са́ва, Я́ків, Григо́рій</b></td>
                  <td><b>Микола́йович (or Мико́лович), Іллі́ч, Луки́ч, Хоми́ч, Са́вич (Саво́вич), Я́кович, Григо́рович</b></td>
                  <td><b>Микола́ївна, Іллі́вна, Лукі́вна, Хомі́вна, Са́вівна, Я́ківна, Григо́рівна</b></td>
                </tr>
              </tbody>
            </table>
            <p class="text-sm"><b>Direct Address Rule:</b> When addressing someone by First Name + Patronymic, <i>both</i> words take the Vocative case: masculine patronymics take <b>-у</b> (<b>Тара́се Григо́ровичу! Андрі́ю Сергі́йовичу!</b>) and feminine patronymics take <b>-о</b> (<b>Оле́но Іва́нівно! Іри́но Васи́лівно!</b>).</p>
          `,
        },
      ],
      takeaways: [
        'Use «До́брого ра́нку!» (morning), «До́брий день!» (daytime), and «До́брий ве́чір!» (evening) in any setting, and «Приві́т!» with friends.',
        'Address friends, family, and children with «ти» (Як тебе́ зва́ти? Як у те́бе спра́ви?) and strangers, elders, or groups with «Ви» (Як Вас зва́ти? Як у Вас спра́ви?).',
        'Introduce yourself with «Мене́ зва́ти...» (or «Мене́ звуть... / Моє́ ім’я́...») and reply «Ду́же приє́мно!».',
        '«Будь ла́ска» and «Про́шу!» (1st-syllable stress) mean both "please" and "you’re welcome", while adding «..., так?» turns any statement into a natural confirmation question.',
      ],
    },
    examples: [
      { uk: 'До́брого ра́нку! Мене́ зва́ти Оле́ксaндр. А як Вас зва́ти?', en: 'Good morning! My name is Oleksandr. And what is your name?' },
      { uk: 'Приві́т, Окса́но! Як у те́бе спра́ви? — Дя́кую, все до́бре!', en: 'Hi, Oksana! How are things with you? — Thank you, everything is good!' },
      { uk: 'Перепро́шую, де тут кав’я́рня? — Ось там. — Ду́же дя́кую!', en: 'Excuse me, where is the coffee shop here? — Right over there. — Thank you very much!' },
      { uk: 'До поба́чення, па́ні Оле́но Іва́нівно! Гарно́го вам дня!', en: 'Goodbye, Ms. Olena Ivanivna! Have a nice day!' },
      { uk: 'Дозво́льте відрекомендува́тися: моє́ ім’я́ Петро́, а моє́ прі́звище Ко́валь. Про́шу сіда́ти!', en: 'Allow me to introduce myself: my first name is Petro, and my surname is Koval. Please have a seat!' },
      { uk: 'Як пожива́єте? (У діа́спорі та Галичині́: Як ся ма́єте?) — Дя́кую, чу́дово! На все до́бре!', en: 'How are you doing? (In the diaspora and Galicia: Як ся ма́єте?) — Thank you, wonderfully! All the best!' },
      { uk: 'Алло́! Це Вас турбу́є Марко́. Чи мо́жна попроси́ти до телефо́ну па́ні Малярчу́к? — Одну́ хвили́ночку! До ре́чі, ми вже перейшли́ на «ти», так?', en: 'Hello! This is Marko calling you. May I ask for Ms. Maliarchuk to come to the phone? — One moment! By the way, we have already switched to «ти», haven’t we?' },
    ],
    dialogue: {
      title: 'Meeting Someone New in Kyiv',
      lines: [
        { speaker: 'Андрі́й', uk: 'До́брий день! Мене́ зва́ти Андрі́й. А як Вас зва́ти?', en: 'Good day! My name is Andriy. And what is your name?' },
        { speaker: 'Софі́я', uk: 'До́брий день! Мене́ зва́ти Софі́я. Ду́же приє́мно!', en: 'Good day! My name is Sofiya. Very nice to meet you!' },
        { speaker: 'Андрі́й', uk: 'Мені́ тако́ж ду́же приє́мно! Зві́дки Ви?', en: 'Nice to meet you too! Where are you from?' },
        { speaker: 'Софі́я', uk: 'Я з Кана́ди, але́ за́раз я живу́ тут, у Ки́єві.', en: 'I am from Canada, but right now I live here in Kyiv.' },
      ],
    },
    activeRecall: [
      { promptEn: 'Good morning!', answerUk: 'До́брого ра́нку!', hint: 'Two words: До́брого + ра́нку' },
      { promptEn: 'My name is...', answerUk: 'Мене́ зва́ти...', hint: 'Literally "They call me..."' },
      { promptEn: 'Thank you very much!', answerUk: 'Ду́же дя́кую!', hint: 'Ду́же (very) + дя́кую (I thank)' },
      { promptEn: 'Please / You’re welcome', answerUk: 'будь ла́ска', hint: 'Two words used for both "please" and "you’re welcome"' },
    ],
    reviewSummary:
      'Use Приві́т! with friends and До́брого ра́нку! / До́брий день! / До́брий ве́чір! in any situation. Introduce yourself with Мене́ зва́ти..., say thank you with Дя́кую, and use Будь ла́ска for both "please" and "you’re welcome".',
    cfu: [
      {
        q: 'How do you say "My name is Olena" in natural Ukrainian?',
        opts: ['Я є зва́ти Оле́на.', 'Мене́ зва́ти Оле́на.', 'Мій зва́ти Оле́на.'],
        ans: 1,
        exp: '«Мене́ зва́ти...» is the natural Ukrainian expression for "My name is..." (literally "They call me...").',
      },
      {
        q: 'When should you address one person as «Ви» instead of «ти»?',
        opts: [
          'When speaking to a close childhood friend or a pet',
          'When speaking politely to a stranger, an older person, or in a formal setting',
          'Only when speaking in the morning',
        ],
        ans: 1,
        exp: '«Ви» is used both for addressing a group ("you all") and as the polite/formal "you" for one person.',
      },
      {
        q: 'Which two meanings does the phrase «будь ла́ска» have in everyday Ukrainian?',
        opts: [
          '"Hello" and "Goodbye"',
          '"Please" and "You’re welcome"',
          '"Good morning" and "Good night"',
        ],
        ans: 1,
        exp: '«Будь ла́ска» is used both when making a polite request ("please") and when replying to «дя́кую» ("you’re welcome").',
      },
    ],
    practice: [
      {
        prompt: 'It is 8:30 AM and you walk into a bakery. How do you greet the baker?',
        opts: ['До́брий ве́чір!', 'До́брого ра́нку!', 'На добра́ніч!'],
        ans: 1,
        audioUk: 'До́брого ра́нку!',
        exp: '«До́брого ра́нку!» means "Good morning!".',
      },
      {
        prompt: 'You want to politely get someone’s attention on the street to ask a question. Which word do you use?',
        opts: ['Перепро́шую', 'До поба́чення', 'На добра́ніч'],
        ans: 0,
        audioUk: 'Перепро́шую',
        exp: '«Перепро́шую» (or «Ви́бачте») means "Excuse me / Pardon me".',
      },
      {
        prompt: 'Someone says «Ду́же приє́мно!» after you introduce yourself. What are they saying?',
        opts: ['See you tomorrow!', 'Very nice to meet you!', 'What time is it?'],
        ans: 1,
        audioUk: 'Ду́же приє́мно!',
        exp: '«Ду́же приє́мно!» means "Very pleasant! / Nice to meet you!".',
      },
      {
        prompt: 'How do you ask a friend "How are things?" in Ukrainian?',
        opts: ['Як спра́ви?', 'Де вокза́л?', 'Хто це?'],
        ans: 0,
        audioUk: 'Як спра́ви?',
        exp: '«Як спра́ви?» (or «Як у те́бе спра́ви?») is the standard way to ask "How are things? / How are you?".',
      },
      {
        prompt: 'Choose the standard polite way to say "Goodbye!" in Ukrainian:',
        opts: ['Приві́т!', 'До поба́чення!', 'Будь ла́ска!'],
        ans: 1,
        audioUk: 'До поба́чення!',
        exp: '«До поба́чення!» means "Goodbye!" (literally "Until we see each other!").',
      },
    ],
    vocab: [
      ['приві́т', 'PHRASE', 'hi / hello (informal)', 'Приві́т! Як спра́ви?', 'Hi! How are things?'],
      ['віта́ю', 'VERB', 'hello / greetings / congratulations', 'Віта́ю вас у Ки́єві!', 'Welcome / Greetings to you in Kyiv!'],
      ['до́брого ра́нку', 'PHRASE', 'good morning', 'До́брого ра́нку, дру́зі!', 'Good morning, friends!'],
      ['до́брий день', 'PHRASE', 'good day / hello', 'До́брий день! Чим мо́жу допомогти́?', 'Good day! How can I help?'],
      ['до́брий ве́чір', 'PHRASE', 'good evening', 'До́брий ве́чір! Ра́дий вас ба́чити.', 'Good evening! Glad to see you.'],
      ['на добра́ніч', 'PHRASE', 'good night', 'На добра́ніч! До за́втра.', 'Good night! See you tomorrow.'],
      ['мене́ зва́ти', 'PHRASE', 'my name is...', 'Мене́ зва́ти Марі́я.', 'My name is Mariya.'],
      ['ду́же приє́мно', 'PHRASE', 'very nice to meet you', 'Ду́же приє́мно познайо́митися!', 'Very nice to meet you!'],
      ['як спра́ви', 'PHRASE', 'how are things? / how are you?', 'Приві́т! Як у те́бе спра́ви?', 'Hi! How are things with you?'],
      ['дя́кую', 'VERB', 'thank you', 'Ду́же дя́кую за ка́ву!', 'Thank you very much for the coffee!'],
      ['будь ла́ска', 'PHRASE', 'please / you’re welcome', 'Прохо́дьте, будь ла́ска.', 'Come in, please.'],
      ['перепро́шую', 'VERB', 'excuse me / pardon me', 'Перепро́шую, чи це мі́сце ві́льне?', 'Excuse me, is this seat free?'],
      ['ви́бачте', 'VERB', 'excuse me / forgive me (formal)', 'Ви́бачте, я тро́хи запізни́вся.', 'Excuse me, I am a little late.'],
      ['до поба́чення', 'PHRASE', 'goodbye', 'До поба́чення! Гарно́го ве́чора!', 'Goodbye! Have a nice evening!'],
      ['до зу́стрічі', 'PHRASE', 'see you soon / until next time', 'Дя́кую за розмо́ву, до зу́стрічі!', 'Thanks for the chat, see you soon!'],
    ],
    exam: [
      {
        q: 'Which greeting should you use at 7:00 PM in the evening?',
        opts: ['До́брого ра́нку!', 'До́брий ве́чір!', 'На добра́ніч!'],
        ans: 1,
        exp: '«До́брий ве́чір!» means "Good evening!". («На добра́ніч!» is used when going to sleep.)',
      },
      {
        q: 'How do you politely ask an older person or stranger what their name is?',
        opts: ['Як Вас зва́ти?', 'Як тебе́ зва́ти?', 'Мене́ зва́ти?'],
        ans: 0,
        exp: '«Як Вас зва́ти?» uses the polite pronoun «Вас» (you).',
      },
      {
        q: 'What does «Дя́кую, все до́бре!» mean?',
        opts: ['Excuse me, where is it?', 'Thank you, everything is good!', 'Please speak slowly.'],
        ans: 1,
        exp: '«дя́кую» = thank you, «все» = everything, «до́бре» = good/well.',
      },
      {
        q: 'Which informal greeting is best for saying "Hi!" to a close friend?',
        opts: ['Приві́т!', 'До поба́чення!', 'Ви́бачте!'],
        ans: 0,
        exp: '«Приві́т!» is the warm, informal way to say "Hi!".',
      },
      {
        q: 'What does «До зу́стрічі!» mean when parting?',
        opts: ['Good morning!', 'See you soon! / Until we meet again!', 'What is your name?'],
        ans: 1,
        exp: '«До зу́стрічі!» literally means "Until the meeting!" ("See you soon!").',
      },
      {
        q: 'Complete the polite request: «Да́йте, ________, ка́ву.» ("Give me a coffee, please.")',
        opts: ['будь ла́ска', 'до поба́чення', 'приві́т'],
        ans: 0,
        exp: '«будь ла́ска» means "please".',
      },
    ],
  },
  {
    id: 'A0.4',
    level: 'A0',
    topicTag: 'Pre-A1 Foundation • Sentences, Questions & Numbers',
    title: 'Simple Sentences, Questions, Negation & Numbers 1–10',
    objectives: [
      'Build simple Ukrainian sentences without needing "am / is / are" or "a / the".',
      'Ask everyday questions using Хто?, Що?, Де?, Коли́?, Як?, and the yes/no word Чи.',
      'Make negative sentences with не and count from 1 to 10.',
    ],
    summary:
      'Building your first sentences in Ukrainian is remarkably direct: Ukrainian has no articles ("a", "an", "the") and usually leaves out "am / is / are" in the present tense. With a handful of question words and numbers 1–10, you can start exchanging real information right away.',
    rules: [
      '<b>1. No "a / the" and No Present-Tense "am / is / are"</b>: Ukrainian does not use articles like "a" or "the". And in the present tense, "am / is / are" is simply omitted!<ul><li><b>Я студе́нт.</b> = I (am a) student.</li><li><b>Це ка́ва.</b> = This (is) coffee.</li><li><b>Ка́ва гаря́ча.</b> = (The) coffee (is) hot.</li><li>When defining one noun with another noun in writing, a long dash (<b>—</b>) is often placed where "is" would be: <b>Ки́їв — столи́ця Украї́ни.</b> (Kyiv is the capital of Ukraine.)</li></ul>',
      '<b>2. Essential Question Words</b>:<ul><li><b>Хто?</b> = Who? (<i>Хто це?</i> — Who is this?)</li><li><b>Що?</b> = What? (<i>Що це?</i> — What is this?)</li><li><b>Де?</b> = Where? (<i>Де метро́?</i> — Where is the subway?)</li><li><b>Коли́?</b> = When? (<i>Коли́ уро́к?</i> — When is the lesson?)</li><li><b>Як?</b> = How? / <b>Скі́льки?</b> = How much / How many?</li></ul>',
      '<b>3. Yes/No Questions & Negation with «не»</b>: You can turn any statement into a yes/no question simply by raising your voice at the end (<i>Ти вдо́ма?</i> = Are you at home?), OR by putting the question word <b>Чи</b> at the beginning: <b>Чи це ві́льне мі́сце?</b> (Is this seat free?). To make a sentence negative, place <b>не</b> right before the word you are negating: <b>Це не чай, це ка́ва.</b> (This is not tea, this is coffee.) / <b>Я не зна́ю.</b> (I do not know.)',
      '<b>4. Counting from 1 to 10 (plus Teens 11–19 & Tens 20–100)</b>:<ul><li><b>Digits 1–10</b>: 1 — <b>оди́н</b> (m.) / <b>одна́</b> (f.) / <b>одне́</b> (n.); 2 — <b>два</b> (m./n.) / <b>дві</b> (f.); 3 — <b>три</b>; 4 — <b>чоти́ри</b>; 5 — <b>п’ять</b>; 6 — <b>шість</b>; 7 — <b>сім</b>; 8 — <b>ві́сім</b>; 9 — <b>де́в’ять</b>; 10 — <b>де́сять</b>.</li><li><b>Teens (11–19 — Contraction of «на де́сять» = "on ten" → -на́дцять)</b>: 11 — <b>одина́дцять</b>, 12 — <b>двана́дцять</b>, 13 — <b>трина́дцять</b>, 14 — <b>чотирна́дцять</b>, 15 — <b>п’ятна́дцять</b>, 16 — <b>шістна́дцять</b> (note <i>шість</i> drops <i>ь</i>), 17 — <b>сімна́дцять</b>, 18 — <b>вісімна́дцять</b>, 19 — <b>дев’ятна́дцять</b> (note <i>п’ять / де́в’ять</i> drop <i>ь</i> before <i>-надцять</i>!).</li><li><b>Tens (20–100)</b>: 20 — <b>два́дцять</b>, 30 — <b>три́дцять</b>, 40 — <b>со́рок</b>, 50 — <b>п’ятдеся́т</b>, 60 — <b>шістдеся́т</b>, 70 — <b>сімдеся́т</b>, 80 — <b>вісімдеся́т</b> (notice that 50–80 end in hard <b>-т</b> without a soft sign!), 90 — <b>дев’яно́сто</b>, 100 — <b>сто</b>. Compound numbers simply place the unit right after the ten with no hyphen or "and": 21 — <b>два́дцять оди́н</b>, 26 — <b>два́дцять шість</b>, 45 — <b>со́рок п’ять</b>.</li></ul>',
      '<b>5. How Word Order Expresses English "The" vs. "A / An"</b>: Even though Ukrainian has no articles, word order shows whether a person or thing is already known ("the") or brand-new ("a/an"):<ul><li><b>Known / Definite ("The") — Subject at the Start</b>: <b>Хло́пчик чека́є на вас.</b> = <i>The</i> boy is waiting for you.</li><li><b>New / Indefinite ("A / An") — Subject at the End</b>: <b>На вас чека́є хло́пчик.</b> = <i>A</i> boy is waiting for you.</li><li>When you want extra emphasis, use <b>цей / той</b> ("this / that") for a specific item or <b>оди́н / яки́йсь</b> ("one / some") for an unspecified one.</li></ul>',
      '<b>6. The Three Roles of «чи», Expressive «хіба́», Conditional «якщо́» & Contrastive «А»</b>:<ul><li><b>Three Distinct Jobs of «чи»</b>:<ul><li><b>1) Yes/No Question Particle</b> at the start of a sentence: <b>Чи ти готу́єш обі́д?</b> (Are you cooking lunch?);</li><li><b>2) "Or" in Questions & Choices</b>: <b>Ти бу́деш чай чи ка́ву?</b> (Will you have tea or coffee?);</li><li><b>3) "Whether / If" in Indirect Questions</b>: <b>Я не зна́ю, чи він сього́дні вдо́ма</b> (I don’t know whether/if he is at home today).</li></ul></li><li><b>Never Confuse Indirect «чи» ("whether") with Conditional «якщо́» ("if")</b>: Use <b>чи</b> when asking or wondering <i>whether</i> something is true, and <b>якщо́</b> for a real condition ("in the event that"): <b>Якщо́ ма́тимеш час, зателефону́й мені́</b>.</li><li><b>Rhetorical «хіба́» & Contrastive «А»</b>: Start a surprised question with <b>Хіба́...?</b> ("Really? / Can it be that...?" — <i>Хіба́ ти ще не зна́єш?</i>) and a follow-up pivot question with <b>А...?</b> ("And what about...?" — <i>Це стіл. А це що? Я студе́нт. А ти?</i>).</li></ul>',
      '<b>7. Emphatic «є» vs. Pointing Adverbs («ось / он»), Correlative Conjunctions («і... і, або́... або́, ні... ні»), & Spatial Adverbs («де / куди́ / зві́дки»)</b>:<ul><li><b>Statement of Fact vs. Emphatic «є» vs. Pointing «ось / он»</b>:<ul><li>In ordinary statements of location, <b>є</b> is omitted: <b>Він тут. Вони́ вдо́ма.</b> (He is here. They are at home.)</li><li>When you want to strongly emphasize that someone or something <i>is indeed</i> somewhere, include <b>є</b>: <b>Він є тут! Вони́ є вдо́ма!</b> (He <i>is</i> here! They <i>are</i> at home!)</li><li>With the emphatic pointing adverbs <b>ось</b> ("right here!") and <b>он</b> ("right over there!"), <b>є</b> is always omitted: <b>Ось вона́!</b> (Here she is!), <b>Он вони́!</b> (There they are!).</li></ul></li><li><b>Correlative Conjunctions</b>:<ul><li><b>і ... і</b> = both ... and (<i>І він і вона́ звичайно вдо́ма</i>)</li><li><b>або́ ... або́</b> = either ... or (<i>Він або́ тут, або́ надво́рі</i>)</li><li><b>ні ... ні (+ не before verb!)</b> = neither ... nor (<i>Вона́ ні тут, ні вдо́ма; Він ні чита́є, ні пи́ше</i>).</li></ul></li><li><b>The Spatial Adverb Triad (Location «де?» vs. Motion «куди́?» vs. Origin «зві́дки?»)</b>:<ul><li><b>Static Location (Де? — Where at?)</b>: <b>тут</b> (here), <b>там</b> (there), <b>ніде́</b> (nowhere), <b>десь</b> (somewhere), <b>удо́ма / вдо́ма</b> (at home), <b>надво́рі</b> (outdoors / outside).</li><li><b>Directional Motion (Куди́? — Where to?)</b>: <b>сюди́</b> (hither / to here), <b>туди́</b> (thither / to there), <b>ніку́ди</b> (to nowhere), <b>куди́сь</b> (to somewhere), <b>додо́му</b> (homeward), <b>надві́р</b> (to the outdoors: <i>Ді́ти біжа́ть надві́р</i>).</li><li><b>Origin (Зві́дки? — Where from?)</b>: <b>зві́дси</b> (from here), <b>зві́дти</b> (from there).</li></ul></li></ul>',
    ],
    structuredLesson: {
      bigIdea: {
        headline: 'Build Complete Sentences on Day One: Zero "Am/Is/Are", No Articles, Questions, Negation & Numbers 1–100',
        body: 'Ukrainian makes building your first real sentences refreshingly fast. Unlike English, Ukrainian has NO articles ("a, an, the") and normally omits "am, is, are" in the present tense! Two words («Це ка́ва.» or «Вона́ студе́нтка.») form a complete grammatical sentence. Add six core question words, the versatile particle «чи», negation with «не», and numbers 1–100, and you can immediately ask prices, give directions, and exchange everyday facts.',
        keyTerms: [
          {
            term: 'Zero Copula (Omitting Present-Tense "am / is / are")',
            plainEnglish: 'In normal present-tense statements ("I am a student", "The coffee is hot"), Ukrainian leaves out the verb "to be" completely: «Я студе́нт. Ка́ва гаря́ча.» In writing, a long dash (—) often stands between two nouns: «Ки́їв — столи́ця Украї́ни».',
          },
          {
            term: 'Theme–Rheme Word Order (Expressing "The" vs. "A / An")',
            plainEnglish: 'Even without words for "the" or "a", Ukrainian shows whether a noun is already known ("the") or brand-new ("a/an") by its position: known information comes at the start of the sentence, while brand-new information comes at the end!',
          },
          {
            term: 'The Question & Choice Particle «чи»',
            plainEnglish: 'A versatile little word with three jobs: (1) starts a polite Yes/No question («Чи це ка́ва?»), (2) means "or" between choices («чай чи ка́ва?»), and (3) means "whether/if" in indirect questions («Я не зна́ю, чи він тут»).',
          },
          {
            term: 'Gender-Matching Numbers 1 & 2 (оди́н/одна́/одне́, два/дві)',
            plainEnglish: 'In Ukrainian, the numbers 1 and 2 change their ending to match the gender of the noun they count: оди́н квито́к (m.), одна́ ка́ва (f.), одне́ вікно́ (n.); два квитки́ (m./n.) vs. дві ка́ви (f.).',
          },
        ],
      },
      seeItInAction: [
        {
          uk: '<mark class="vc-highlight">Хто це</mark>? — <mark class="vc-highlight">Це</mark> мій друг Тара́с. Він лі́кар.',
          en: 'Who is this? — This is my friend Taras. He is a doctor.',
          highlightNote: 'Zero articles ("a") and zero present-tense "is" in all three sentences!',
        },
        {
          uk: 'Це <mark class="vc-highlight">не</mark> готе́ль, це музе́й. <mark class="vc-highlight">Ки́їв — столи́ця</mark> Украї́ни.',
          en: 'This is not a hotel, this is a museum. Kyiv is the capital of Ukraine.',
          highlightNote: 'Place «не» right before the word you negate, and use a dash (—) when defining one noun with another noun.',
        },
        {
          uk: '<mark class="vc-highlight">Чи</mark> ви бу́дете чай <mark class="vc-highlight">чи</mark> ка́ву? Я ще <mark class="vc-highlight">не</mark> зна́ю, <mark class="vc-highlight">чи</mark> ма́тиму час.',
          en: 'Will you have tea or coffee? I don’t know yet whether I will have time.',
          highlightNote: 'See all three roles of «чи» in one pair of sentences: (1) Yes/No question starter, (2) "or", and (3) "whether"!',
        },
        {
          uk: 'Да́йте, будь ла́ска, <mark class="vc-highlight">оди́н</mark> чай і <mark class="vc-highlight">дві</mark> ка́ви. — Ра́зом <mark class="vc-highlight">вісімдеся́т п’ять</mark> гри́вень.',
          en: 'Please give me one tea and two coffees. — Together eighty-five hryvnias.',
          highlightNote: 'Masculine «чай» takes «оди́н», while feminine «ка́ви» takes «дві»!',
        },
      ],
      visualTables: [
        {
          title: '1. Essential Question Words & Yes/No Particles',
          subtitle: 'Master these question starters to ask about people, things, places, time, and prices.',
          headers: ['Question Word', 'English Meaning', 'Model Question', 'Model Answer'],
          rows: [
            ['<b class="uk-text">Хто?</b>', 'Who? (people)', '<b class="uk-text">Хто це?</b> (Who is this?)', '<b class="uk-text">Це мій друг / моя́ сестра́.</b>'],
            ['<b class="uk-text">Що?</b>', 'What? (things/actions)', '<b class="uk-text">Що це?</b> (What is this?)', '<b class="uk-text">Це украї́нський словни́к.</b>'],
            ['<b class="uk-text">Де?</b>', 'Where? (static location)', '<b class="uk-text">Де тут метро́ / апте́ка?</b>', '<b class="uk-text">Ось тут / Он там.</b>'],
            ['<b class="uk-text">Куди́? / Зві́дки?</b>', 'Where to? / Where from?', '<b class="uk-text">Куди́ ти йдеш? Зві́дки ви?</b>', '<b class="uk-text">Я йду додо́му. Ми з Ки́єва.</b>'],
            ['<b class="uk-text">Коли́?</b>', 'When?', '<b class="uk-text">Коли́ наш уро́к / по́їзд?</b>', '<b class="uk-text">Сього́дні о тре́тій.</b>'],
            ['<b class="uk-text">Як?</b>', 'How?', '<b class="uk-text">Як це сказа́ти украї́нською?</b>', '<b class="uk-text">Ду́же просто!</b>'],
            ['<b class="uk-text">Скі́льки?</b>', 'How much / How many?', '<b class="uk-text">Скі́льки це ко́штує?</b>', '<b class="uk-text">Три́дцять гри́вень.</b>'],
            ['<b class="uk-text">Чи...?</b>', 'Yes/No question starter', '<b class="uk-text">Чи це ві́льне мі́сце?</b>', '<b class="uk-text">Так, ві́льне. / Ні, зайняте́.</b>'],
            ['<b class="uk-text">Хіба́...?</b>', 'Really? / Can it be that...?', '<b class="uk-text">Хіба́ ти ще не зна́єш?</b>', 'Expresses surprise or disbelief'],
          ],
        },
        {
          title: '2. Numbers 1–10, Teens (11–19) & Tens (20–100)',
          subtitle: 'Compare the base digits 1–10 with their Teen («-на́дцять») and Ten («-дцять / -деся́т») partners.',
          headers: ['Digit (1–10)', 'Ukrainian (1–10)', 'Teen (11–19: on ten «-на́дцять»)', 'Ten (20–100)'],
          rows: [
            ['<b>1</b>', '<b class="uk-text">оди́н</b> (m.), <b class="uk-text">одна́</b> (f.), <b class="uk-text">одне́</b> (n.)', '11 — <b class="uk-text">одина́дцять</b>', '10 — <b class="uk-text">де́сять</b>'],
            ['<b>2</b>', '<b class="uk-text">два</b> (m./n.), <b class="uk-text">дві</b> (f.)', '12 — <b class="uk-text">двана́дцять</b>', '20 — <b class="uk-text">два́дцять</b>'],
            ['<b>3</b>', '<b class="uk-text">три</b>', '13 — <b class="uk-text">трина́дцять</b>', '30 — <b class="uk-text">три́дцять</b>'],
            ['<b>4</b>', '<b class="uk-text">чоти́ри</b>', '14 — <b class="uk-text">чотирна́дцять</b>', '40 — <b class="uk-text">со́рок</b>'],
            ['<b>5</b>', '<b class="uk-text">п’ять</b>', '15 — <b class="uk-text">п’ятна́дцять</b> (no ь before -н-)', '50 — <b class="uk-text">п’ятдеся́т</b> (hard final -т!)'],
            ['<b>6</b>', '<b class="uk-text">шість</b>', '16 — <b class="uk-text">шістна́дцять</b> (no ь before -н-)', '60 — <b class="uk-text">шістдеся́т</b> (hard final -т!)'],
            ['<b>7</b>', '<b class="uk-text">сім</b>', '17 — <b class="uk-text">сімна́дцять</b>', '70 — <b class="uk-text">сімдеся́т</b> (hard final -т!)'],
            ['<b>8</b>', '<b class="uk-text">ві́сім</b>', '18 — <b class="uk-text">вісімна́дцять</b>', '80 — <b class="uk-text">вісімдеся́т</b> (hard final -т!)'],
            ['<b>9</b>', '<b class="uk-text">де́в’ять</b>', '19 — <b class="uk-text">дев’ятна́дцять</b> (no ь before -н-)', '90 — <b class="uk-text">дев’яно́сто</b>'],
            ['<b>10 / 100 / 0</b>', '<b class="uk-text">де́сять</b> (10) • <b class="uk-text">нуль</b> (0)', '—', '100 — <b class="uk-text">сто</b>'],
          ],
          footnote: 'Spelling watch-out: 11–19, 20, and 30 end in soft «-ть», whereas 50, 60, 70, and 80 («п’ятдеся́т, шістдеся́т, сімдеся́т, вісімдеся́т») end in a HARD «-т» with NO soft sign!',
        },
        {
          title: '3. The Spatial Adverb Triad: Static «Де?» vs. Motion «Куди́?» vs. Origin «Зві́дки?»',
          subtitle: 'Ukrainian distinguishes where someone IS from where they are GOING and where they are COMING FROM.',
          headers: ['Meaning Group', 'Static Location (Де? — Where at?)', 'Direction (Куди́? — Where to?)', 'Origin (Зві́дки? — Where from?)'],
          rows: [
            ['Here (Close to speaker)', '<b class="uk-text">тут</b> (here)', '<b class="uk-text">сюди́</b> (to here / hither)', '<b class="uk-text">зві́дси</b> (from here)'],
            ['There (Away from speaker)', '<b class="uk-text">там</b> (there)', '<b class="uk-text">туди́</b> (to there / thither)', '<b class="uk-text">зві́дти</b> (from there)'],
            ['Home', '<b class="uk-text">вдо́ма / удо́ма</b> (at home)', '<b class="uk-text">додо́му</b> (homeward)', '<b class="uk-text">здо́му</b> (from home)'],
            ['Outdoors / Outside', '<b class="uk-text">надво́рі</b> (outdoors / outside)', '<b class="uk-text">надві́р</b> (to the outdoors)', '<b class="uk-text">знадво́ру</b> (from outside)'],
            ['Somewhere / Nowhere', '<b class="uk-text">десь / ніде́</b>', '<b class="uk-text">куди́сь / ніку́ди</b>', '<b class="uk-text">зві́дкись / нізві́дки</b>'],
          ],
        },
      ],
      diagrams: [
        {
          title: 'How Word Order Expresses English "The" vs. "A / An" (Theme → Rheme)',
          subtitle: 'Because Ukrainian has no articles, the position of the subject tells the listener whether it is known ("the") or new ("a/an").',
          type: 'comparison',
          nodes: [
            {
              label: 'Subject FIRST = Known ("The")',
              value: 'Хло́пчик чека́є на вас.',
              description: '"THE boy is waiting for you." Starting with хло́пчик treats him as already known in the conversation.',
            },
            {
              label: 'Subject LAST = Brand-New ("A / An")',
              value: 'На вас чека́є хло́пчик.',
              description: '"A boy is waiting for you." Placing хло́пчик at the end introduces him as brand-new information!',
            },
          ],
        },
        {
          title: 'The Three Distinct Jobs of «чи» vs. Conditional «якщо́»',
          subtitle: 'Never confuse indirect question «чи» ("whether/if") with conditional «якщо́» ("in the event that").',
          type: 'flow',
          nodes: [
            {
              label: 'Job 1: Yes/No Starter',
              value: 'Чи ти вдо́ма?',
              description: 'Placed at the start of a sentence to form a clean, polite Yes/No question ("Are you at home?").',
            },
            {
              label: 'Job 2: "Or" in Choices',
              value: 'Ти бу́деш чай чи ка́ву?',
              description: 'Links two options in a question or alternative ("tea or coffee?").',
            },
            {
              label: 'Job 3: Indirect "Whether / If"',
              value: 'Я не зна́ю, чи він удо́ма.',
              description: 'Introduces an embedded Yes/No question ("whether/if"). For a real condition ("If you have time..."), use якщо́ instead!',
            },
          ],
        },
      ],
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Drop "a / the" and Present-Tense "am / is / are"',
          explanation: 'State the subject and its description directly. In writing, if both the subject and predicate are nouns, place a dash (—) between them.',
          examples: [
            { uk: 'Я студе́нт. Ка́ва гаря́ча. Ки́їв — столи́ця Украї́ни.', en: 'I am a student. The coffee is hot. Kyiv is the capital of Ukraine.' },
          ],
        },
        {
          stepNumber: 2,
          title: 'Place «не» Directly Before the Word You Want to Negate',
          explanation: 'Unlike English ("do not / is not"), Ukrainian simply places «не» right in front of the negated verb, noun, or adjective.',
          examples: [
            { uk: 'Я не зна́ю. Це не чай, це ка́ва.', en: 'I do not know. This is not tea, this is coffee.' },
          ],
        },
        {
          stepNumber: 3,
          title: 'Form Questions with Intonation, «Чи», or a Question Word',
          explanation: 'Raise your pitch at the end of a statement (or put «Чи» in front) for a Yes/No question, or start with Хто?, Що?, Де?, Куди́?, Коли́?, Як?, or Скі́льки?.',
          examples: [
            { uk: 'Чи це ву́лиця Шевче́нка? — Ні, це пло́ща Ри́нок.', en: 'Is this Shevchenko Street? — No, this is Rynok Square.' },
          ],
        },
        {
          stepNumber: 4,
          title: 'Combine Tens and Units Directly (No "and" or Hyphen)',
          explanation: 'To say compound numbers like 21, 45, or 85, simply say the ten followed by the unit—remembering to match 1 (оди́н/одна́/одне́) and 2 (два/дві) to the noun’s gender.',
          examples: [
            { uk: 'два́дцять оди́н день • два́дцять дві хвили́ни • вісімдеся́т п’ять гри́вень', en: '21 days • 22 minutes • 85 hryvnias' },
          ],
        },
      ],
      moreExamples: [
        {
          uk: '<mark class="vc-highlight">Хло́пчик</mark> чека́є на вас. / На вас чека́є <mark class="vc-highlight">хло́пчик</mark>.',
          en: 'The boy is waiting for you (known). / A boy is waiting for you (new).',
          highlightNote: 'Notice how moving the subject from the start to the end shifts the meaning from definite "the" to indefinite "a".',
        },
        {
          uk: '<mark class="vc-highlight">Ось вона́</mark>, і <mark class="vc-highlight">он вони́</mark>! Ді́ти за́раз <mark class="vc-highlight">надво́рі</mark>, а по́тім іду́ть <mark class="vc-highlight">сюди́ додо́му</mark>.',
          en: 'Here she is, and there they are! The children are outside right now, and afterwards they are coming here homeward.',
          highlightNote: 'Pointing words «ось» (right here) and «он» (right over there) never use «є», and «надво́рі» (static) contrasts with «сюди́ додо́му» (motion).',
        },
      ],
      exceptionsAndEdgeCases: [
        {
          ruleTitle: 'When DO We Use «є» in Present-Tense Location Statements?',
          ruleExplanation: 'Normally, present-tense «є» is omitted in location statements (Він тут. Вони́ вдо́ма.). However, there are two important rules:',
          exceptions: [
            {
              item: 'Emphatic Confirmation: Він є тут! Вони́ є вдо́ма!',
              note: 'When contradicting doubt or strongly emphasizing that someone IS indeed present ("He IS here!"), include «є».',
            },
            {
              item: 'Pointing Adverbs «ось» & «он»: Ось вона́! Он вони́! Ось ваш квито́к!',
              note: 'After pointing words ось ("right here!") and он ("right over there!"), «є» is NEVER used.',
            },
          ],
        },
        {
          ruleTitle: 'Correlative Conjunctions: Why «ні ... ні» Still Requires «не» Before the Verb',
          ruleExplanation: 'Compare the three paired conjunctions in Ukrainian:',
          exceptions: [
            {
              item: 'і ... і (both ... and) / або́ ... або́ (either ... or)',
              note: 'Affirmative pairs: «І він, і вона́ вдо́ма», «Він або́ тут, або́ надво́рі».',
            },
            {
              item: 'ні ... ні (neither ... nor) + mandatory «не» before a verb!',
              note: 'Ukrainian uses double negation: when «ні ... ні» links verbs or clauses with a verb, you must still keep «не» before the verb: «Він ні чита́є, ні не пи́ше» / «Вона́ не була́ ні тут, ні вдо́ма».',
            },
          ],
        },
      ],
      commonMistakes: [
        {
          mistake: 'Using conditional «якщо́» instead of «чи» in indirect questions ("I don’t know if/whether he is home")',
          wrongUk: '*Я не зна́ю, якщо́ він удо́ма.',
          correctUk: 'Я не зна́ю, чи він удо́ма.',
          explanation: 'In English, "if" can mean both "whether" and "in the event that". In Ukrainian, indirect questions ("whether") ALWAYS use «чи», never «якщо́»!',
        },
        {
          mistake: 'Forgetting to change «оди́н» and «два» for feminine nouns (*оди́н ка́ва, *два ка́ви)',
          wrongUk: '*оди́н ка́ва, *два ка́ви',
          correctUk: 'одна́ ка́ва, дві ка́ви',
          explanation: 'Because «ка́ва» is feminine, "one" must be «одна́» and "two" must be «дві».',
        },
        {
          mistake: 'Writing a soft sign at the end of 50, 60, 70, or 80 (*п’ятдеся́ть, *шістдеся́ть)',
          wrongUk: '*п’ятдеся́ть, *сімдеся́ть',
          correctUk: 'п’ятдеся́т, шістдеся́т, сімдеся́т, вісімдеся́т (hard final -т)',
          explanation: 'While 5–30 end in soft «-ть», the tens 50, 60, 70, and 80 always end in a hard «-т» with no soft sign in the Nominative case.',
        },
      ],
      inlineChecks: [
        {
          id: 'a04-check-1',
          question: 'How does Ukrainian distinguish between "The boy is waiting for you" (known) and "A boy is waiting for you" (new)?',
          options: [
            'By word order: «Хло́пчик чека́є на вас» (subject first = "the") vs. «На вас чека́є хло́пчик» (subject last = "a")',
            'By adding an article before хло́пчик',
            'There is no way to distinguish them',
          ],
          correctIndex: 0,
          explanation: 'Putting the subject first treats it as known information ("the"), while placing it at the end introduces it as new information ("a/an").',
        },
        {
          id: 'a04-check-2',
          question: 'How do you translate "I don’t know whether (if) she is at home today"?',
          options: [
            'Я не зна́ю, якщо́ вона́ сього́дні вдо́ма.',
            'Я не зна́ю, чи вона́ сього́дні вдо́ма.',
            'Я зна́ю не, де вона́ вдо́ма.',
          ],
          correctIndex: 1,
          explanation: 'Use «чи» (never «якщо́») to mean "whether/if" in indirect questions after «Я не зна́ю...» or «Запита́й...».',
        },
        {
          id: 'a04-check-3',
          question: 'Which pair correctly matches the numbers 1 and 2 to the feminine noun «кни́жка» (book)?',
          options: [
            'оди́н кни́жка, два книжки́',
            'одна́ кни́жка, дві книжки́',
            'одне́ кни́жка, дві книжки́',
          ],
          correctIndex: 1,
          explanation: 'Feminine nouns take «одна́» for 1 and «дві» for 2.',
        },
      ],
      completeReference: [
        {
          title: 'Advanced Reference: Contrastive «А» vs. Additive «І / Та» & Rhetorical «Хіба́ / Невже́»',
          summary: 'Expand to see how Ukrainian links contrasting ideas with «а» and asks expressive questions with «хіба́» and «невже́».',
          contentHtml: `
            <ul class="list-disc pl-5 space-y-2">
              <li><b>Contrastive Pivot «а» ("and / whereas / while") vs. Additive «і / й / та» ("and"):</b> Whenever two clauses or questions pivot to a different person or lightly contrast two facts, Ukrainian uses <b>а</b> rather than <i>і</i>: <b>Я студе́нт, а мій брат — лі́кар</b> ("I am a student, and/whereas my brother is a doctor"); <b>Мене́ зва́ти Андрі́й. А як Вас зва́ти?</b> ("And what about you—what is your name?"); <b>Це стіл. А це що?</b></li>
              <li><b>Expressive & Disbelieving Questions («Хіба́...?» and «Невже́...?»):</b> Start a question with <b>Хіба́...?</b> ("Really? / Could it be that...?") or <b>Невже́...?</b> ("Is it really true that...?") when you are surprised: <b>Хіба́ ти ще не зна́єш?</b> ("Don’t you know yet?"), <b>Невже́ вже деся́та годи́на?</b> ("Can it really be ten o’clock already?").</li>
            </ul>
          `,
        },
      ],
      takeaways: [
        'Ukrainian has no articles ("a/an/the") and omits present-tense "am/is/are" in normal statements (Я студе́нт. Ка́ва гаря́ча. Ки́їв — столи́ця Украї́ни.).',
        'Word order shows definiteness: subject at the start = known ("the"), subject at the end = new ("a/an").',
        '«Чи» has three jobs: Yes/No question starter (Чи ти вдо́ма?), "or" in choices (чай чи ка́ва?), and "whether/if" in indirect questions (Я не зна́ю, чи він тут).',
        'Match 1 (оди́н / одна́ / одне́) and 2 (два / дві) to the noun’s gender, and distinguish static location (тут, там, вдо́ма, надво́рі) from motion (сюди́, туди́, додо́му, надві́р).',
      ],
    },
    examples: [
      { uk: 'Хто це? — Це мій друг Тара́с. Він лі́кар.', en: 'Who is this? — This is my friend Taras. He is a doctor.' },
      { uk: 'Це не готе́ль, це музе́й.', en: 'This is not a hotel, this is a museum.' },
      { uk: 'Перепро́шую, де тут авто́бус но́мер вісімна́дцять?', en: 'Excuse me, where is bus number eighteen here?' },
      { uk: 'Да́йте, будь ла́ска, один чай і дві ка́ви. — Ра́зом вісімдеся́т п’ять гри́вень.', en: 'Please give me one tea and two coffees. — Together eighty-five hryvnias.' },
      { uk: 'Хло́пчик чека́є на вас. / На вас чека́є хло́пчик.', en: 'The boy is waiting for you (known). / A boy is waiting for you (new).' },
      { uk: 'Чи ви бу́дете чай чи ка́ву? Я ще не зна́ю, чи ма́тиму час.', en: 'Will you have tea or coffee? I don’t know yet whether I will have time (all three uses of чи).' },
      { uk: 'Ось вона́, і он вони́! Ді́ти за́раз надво́рі, а по́тім іду́ть сюди́ додо́му.', en: 'Here she is (ось вона́), and there they are (он вони́)! The children are outside (надво́рі) right now, and afterwards they are coming here (сюди́) homeward (додо́му).' },
    ],
    dialogue: {
      title: 'Asking Quick Questions in the City',
      lines: [
        { speaker: 'Марко́', uk: 'Перепро́шую, чи це ву́лиця Шевче́нка?', en: 'Excuse me, is this Shevchenko Street?' },
        { speaker: 'Іри́на', uk: 'Ні, це не ву́лиця Шевче́нка. Це пло́ща Ри́нок.', en: 'No, this is not Shevchenko Street. This is Rynok Square.' },
        { speaker: 'Марко́', uk: 'А де туристи́чний центр?', en: 'And where is the tourist center?' },
        { speaker: 'Іри́на', uk: 'Він о́сь там, буди́нок но́мер сім.', en: 'It is right over there, building number seven.' },
      ],
    },
    activeRecall: [
      { promptEn: 'Who is this?', answerUk: 'Хто це?', hint: 'Хто (who) + це (this is)' },
      { promptEn: 'I do not know.', answerUk: 'Я не зна́ю.', hint: 'Я + не (not) + зна́ю (know)' },
      { promptEn: 'Where is the subway?', answerUk: 'Де метро́?', hint: 'Де (where) + метро́' },
      { promptEn: 'one, two, three', answerUk: 'оди́н, два, три', hint: 'First three numbers in Ukrainian' },
    ],
    reviewSummary:
      'In present-tense Ukrainian, omit "am / is / are" (Це ка́ва = This is coffee). Place не before a word to negate it (Це не чай). Use Хто? (Who?), Що? (What?), Де? (Where?), Коли́? (When?), and Чи...? for yes/no questions.',
    cfu: [
      {
        q: 'Why does the Ukrainian sentence «Вона́ студе́нтка» ("She is a student") only have two words?',
        opts: [
          'Because Ukrainian omits both articles ("a/the") and present-tense "am/is/are"',
          'Because "вона́" means "she is a"',
          'Because it is a question',
        ],
        ans: 0,
        exp: 'Ukrainian has no articles ("a/an/the") and omits "am/is/are" in normal present-tense statements.',
      },
      {
        q: 'Which question word do you use to ask about a person ("Who is this?") vs. a thing ("What is this?")?',
        opts: [
          '«Де це?» for a person and «Коли́ це?» for a thing',
          '«Хто це?» for a person and «Що це?» for a thing',
          '«Чи це?» for both',
        ],
        ans: 1,
        exp: '«Хто?» means "Who?" (for people) and «Що?» means "What?" (for things).',
      },
      {
        q: 'What does the word «Чи» do at the start of «Чи ти вдо́ма?»?',
        opts: [
          'It turns the sentence into a clear yes/no question ("Are you at home?")',
          'It makes the sentence negative',
          'It means "because"',
        ],
        ans: 0,
        exp: 'Placing «Чи» at the start of a statement is a clean, polite way to form a yes/no question.',
      },
    ],
    practice: [
      {
        prompt: 'Translate "I do not understand" into Ukrainian:',
        opts: ['Я розумі́ю не.', 'Я не розумі́ю.', 'Не я розумі́ю.'],
        ans: 1,
        audioUk: 'Я не розумі́ю.',
        exp: 'Place the negation particle «не» directly before the verb: «Я не розумі́ю».',
      },
      {
        prompt: 'You want to ask "Where is the hotel?". Which sentence is correct?',
        opts: ['Хто готе́ль?', 'Де готе́ль?', 'Коли́ готе́ль?'],
        ans: 1,
        audioUk: 'Де готе́ль?',
        exp: '«Де?» means "Where?", so «Де готе́ль?» means "Where is the hotel?".',
      },
      {
        prompt: 'Which sequence shows the numbers 3, 4, 5 in Ukrainian?',
        opts: ['оди́н, два, три', 'три, чоти́ри, п’ять', 'шість, сім, ві́сім'],
        ans: 1,
        audioUk: 'три, чоти́ри, п’ять',
        exp: '«три» = 3, «чоти́ри» = 4, «п’ять» = 5.',
      },
      {
        prompt: 'Why do we say «два квитки́» (two tickets) but «дві ка́ви» (two coffees)?',
        opts: [
          'Because the number 2 changes to «дві» for feminine nouns like ка́ва',
          'Because coffee is uncountable',
          'Because «дві» means three',
        ],
        ans: 0,
        audioUk: 'два квитки́, дві ка́ви',
        exp: 'The number 1 (оди́н / одна́ / одне́) and the number 2 (два for masculine/neuter, дві for feminine) match the gender of the noun.',
      },
      {
        prompt: 'How do you ask "How much does this cost?" in a shop?',
        opts: ['Скі́льки це ко́штує?', 'Хто це ко́штує?', 'Коли́ це?'],
        ans: 0,
        audioUk: 'Скі́льки це ко́штує?',
        exp: '«Скі́льки?» means "How much / How many?", and «ко́штує» means "costs".',
      },
    ],
    vocab: [
      ['хто', 'PRON', 'who', 'Хто цей чолові́к?', 'Who is this man?'],
      ['де', 'ADV', 'where', 'Де тут апте́ка?', 'Where is the pharmacy here?'],
      ['коли́', 'ADV', 'when', 'Коли́ наш по́їзд?', 'When is our train?'],
      ['скі́льки', 'ADV', 'how much / how many', 'Скі́льки це ко́штує?', 'How much does this cost?'],
      ['чи', 'PART', 'yes/no question particle / or', 'Чи ви говори́те англі́йською?', 'Do you speak English?'],
      ['не', 'PART', 'not', 'Це не мій ключ.', 'This is not my key.'],
      ['оди́н', 'NUM', 'one (f. одна́, n. одне́)', 'Оди́н квито́к, будь ла́ска.', 'One ticket, please.'],
      ['два', 'NUM', 'two (f. дві)', 'Два дні і дві но́чі.', 'Two days and two nights.'],
      ['три', 'NUM', 'three', 'Три ча́шки ча́ю.', 'Three cups of tea.'],
      ['чоти́ри', 'NUM', 'four', 'Чоти́ри кімна́ти.', 'Four rooms.'],
      ['шість', 'NUM', 'six', 'Шість годи́н.', 'Six hours / six o’clock.'],
      ['сім', 'NUM', 'seven', 'Но́мер сім.', 'Number seven.'],
      ['ві́сім', 'NUM', 'eight', 'Ві́сім гри́вень.', 'Eight hryvnias.'],
      ['де́в’ять', 'NUM', 'nine', 'Де́в’ять хвили́н.', 'Nine minutes.'],
      ['де́сять', 'NUM', 'ten', 'Де́сять слів.', 'Ten words.'],
    ],
    exam: [
      {
        q: 'Choose the correct Ukrainian translation of "This is not tea, this is coffee":',
        opts: ['Це не чай, це ка́ва.', 'Не це чай, ка́ва це.', 'Чи це чай, чи ка́ва.'],
        ans: 0,
        exp: '«Це не чай, це ка́ва» puts «не» directly before «чай».',
      },
      {
        q: 'Which number is «ві́сім»?',
        opts: ['6', '7', '8'],
        ans: 2,
        exp: '«шість» = 6, «сім» = 7, «ві́сім» = 8.',
      },
      {
        q: 'Which question word means "When?"',
        opts: ['Де?', 'Коли́?', 'Хто?'],
        ans: 1,
        exp: '«Коли́?» means "When?".',
      },
      {
        q: 'Why do we say «одна́ кни́жка» (one book) instead of «оди́н кни́жка»?',
        opts: [
          'Because «кни́жка» ends in -а (feminine), so "one" takes the feminine form «одна́»',
          'Because «одна́» means "two"',
          'Because books are plural',
        ],
        ans: 0,
        exp: 'In Ukrainian, "one" matches the noun’s gender: оди́н (masculine), одна́ (feminine), одне́ (neuter).',
      },
      {
        q: 'What does «Чи мо́жна меню́?» mean in a restaurant?',
        opts: ['Where is the restaurant?', 'May I have the menu?', 'I do not have a menu.'],
        ans: 1,
        exp: '«Чи мо́жна...?» is a very useful polite phrase meaning "May I have...? / Is it possible to...?".',
      },
      {
        q: 'Which number is written with an apostrophe in Ukrainian?',
        opts: ['де́в’ять (9)', 'ві́сім (8)', 'де́сять (10)'],
        ans: 0,
        exp: 'Both «п’ять» (5) and «де́в’ять» (9) have an apostrophe before я.',
      },
    ],
  },
  {
    id: 'A1.1',
    level: 'A1',
    topicTag: 'A1 Beginner • Gender, Plurals & Adjectives',
    title: 'Noun Gender, Plurals & Describing Things with Adjectives',
    objectives: [
      'Identify whether a Ukrainian noun is Masculine, Feminine, or Neuter just by looking at its ending.',
      'Form basic plural nouns.',
      'Match adjectives (like нови́й, нова́, нове́, нові́) and possessives (мій, моя́, моє́, мої́) to the noun they describe.',
    ],
    summary:
      'In Ukrainian, every noun belongs to one of three grammatical genders: Masculine, Feminine, or Neuter. The good news is that you almost never have to guess a noun’s gender—the last letter of the word tells you right away!',
    rules: [
      '<b>1. How to Tell Noun Gender by the Ending</b>:<ul><li><b>Masculine</b>: Most nouns ending in a <b>consonant</b> or <b>-й</b> are masculine: <b>стіл</b> (table), <b>парк</b> (park), <b>друг</b> (friend), <b>чай</b> (tea), <b>музе́й</b> (museum). (Note: words for male family members like <b>та́то</b> "dad" and <b>ба́тько</b> "father" are also masculine!)</li><li><b>Feminine</b>: Most nouns ending in <b>-а</b> or <b>-я</b> are feminine: <b>кни́жка</b> (book), <b>ка́ва</b> (coffee), <b>ву́лиця</b> (street), <b>пі́сня</b> (song).</li><li><b>Neuter</b>: Nouns ending in <b>-о</b>, <b>-е</b>, or a doubled consonant + <b>-я</b> are neuter: <b>мі́сто</b> (city), <b>вікно́</b> (window), <b>мо́ре</b> (sea), <b>життя́</b> (life), <b>пита́ння</b> (question).</li></ul>',
      '<b>2. Matching Adjectives to Noun Gender</b>: In the dictionary, adjectives are listed in their masculine form ending in <b>-ий</b> (or soft <b>-ій</b>). When describing a feminine, neuter, or plural noun, simply swap the ending:<ul><li>Masculine (<b>-ий / -ій</b>): <b>нови́й буди́нок</b> (a new building), <b>си́ній авто́бус</b> (a blue bus)</li><li>Feminine (<b>-а / -я</b>): <b>нова́ кни́жка</b> (a new book), <b>си́ня су́кня</b> (a blue dress)</li><li>Neuter (<b>-е / -є</b>): <b>нове́ мі́сто</b> (a new city), <b>си́нє не́бо</b> (a blue sky)</li><li>Plural for ALL genders (<b>-і</b>): <b>нові́ буди́нки / книжки́ / міста́</b> (new buildings / books / cities)</li></ul>',
      '<b>3. Matching "My", "Your", and "This"</b>: Possessive words like <b>мій</b> (my), <b>твій</b> (your), <b>наш</b> (our), and <b>цей</b> (this) follow the exact same gender pattern:<ul><li>Masculine: <b>мій телефон́</b>, <b>цей стіл</b>, <b>наш парк</b></li><li>Feminine: <b>моя́ су́мка</b>, <b>ця ву́лиця</b>, <b>на́ша шко́ла</b></li><li>Neuter: <b>моє́ мі́сце</b>, <b>це вікно́</b>, <b>на́ше мі́сто</b></li><li>Plural: <b>мої́ дру́зі</b>, <b>ці квитки́</b>, <b>на́ші пла́ни</b></li></ul>',
      '<b>4. Making Nouns Plural</b>: Most masculine and feminine nouns form their plural with <b>-и</b> (hard) or <b>-і</b> (soft): <i>парк → па́рки, квито́к → квитки́, кни́жка → книжки́, ву́лиця → ву́лиці</i>. Neuter nouns in <i>-о</i> change to <b>-а</b> in the plural: <i>мі́сто → міста́, вікно́ → ві́кна</i>.',
      '<b>5. Watch Out: Singular vs. Plural Mismatches with English!</b>:<ul><li><b>Singular-Only in Ukrainian (where English uses plural)</b>: <b>о́дяг</b> (clothes — masculine singular: <i>мій те́плий о́дяг</i>), <b>взуття́</b> (footwear — neuter singular), and collective produce nouns like <b>карто́пля</b> (potatoes), <b>мо́рква</b> (carrots), <b>цибу́ля</b> (onions), <b>зе́лень</b> (greens), and <b>сміття́</b> (trash).</li><li><b>Plural-Only in Ukrainian (where English uses singular)</b>: <b>гро́ші</b> (money — always plural: <i>Де мої́ гро́ші?</i>), <b>кані́кули</b> (school vacation), <b>вершки́</b> (cream), <b>парфу́ми</b> (perfume), <b>ша́хи</b> (chess), <b>две́рі</b> (door), <b>воро́та</b> (gate), plus paired items like <b>окуля́ри</b> (glasses), <b>штани́</b> (trousers), and <b>но́жиці</b> (scissors).</li><li><b>Countable in Ukrainian</b>: <b>пора́да → пора́ди</b> (a piece of advice / advices) and <b>новина́ → нови́ни</b> (a piece of news / news).</li></ul>',
      '<b>6. Non-Typical Gender Nouns, Essential Irregular Plurals & Profession Gender Pairs</b>:<ul><li><b>Non-Typical Gender Endings</b>: Nouns denoting male people that end in <b>-о, -а, -я</b> are grammatically <b>Masculine</b> and take masculine adjectives: <b>мій дя́дько</b> (my uncle), <b>діду́сь Мико́ла</b>, <b>справедли́вий суддя́</b> (a fair judge), <b>завзя́тий риба́лка</b> (an avid fisherman). Conversely, 3rd-declension nouns ending in a soft consonant or sibilant—such as <b>ніч</b> (night), <b>річ</b> (thing), <b>тінь</b> (shadow/shade), <b>сіль</b> (salt), <b>любо́в</b> (love), <b>ра́дість</b> (joy), and <b>по́дорож</b> (trip)—are <b>Feminine</b> (<i>те́пла ніч, ціка́ва по́дорож</i>). And nouns in <b>-м’я</b> (<b>ім’я́</b> = first name) or <b>-а/-я</b> for young beings (<b>дівча́, ім’я́</b>) are <b>Neuter</b> (<i>га́рне ім’я́</i>).</li><li><b>Four Essential Irregular Plurals & Neuter «-ння» Nouns</b>: Memorize <b>люди́на → лю́ди</b> (person → people), <b>дити́на → ді́ти</b> (child → children), <b>друг → дру́зі</b> (friend → friends, with <i>г → з</i>), and <b>ма́ти → матері́</b> (mother → mothers). Meanwhile, neuter nouns in <b>-ння</b> (like <b>оповіда́ння</b> = story, <b>завда́ння</b> = assignment, <b>пита́ння</b> = question) have the <i>exact same form and stress</i> in Nominative singular and Nominative plural: <b>ціка́ве оповіда́ння → ціка́ві оповіда́ння</b>!</li><li><b>Profession Gender Pairs</b>: Ukrainian regularly forms feminine profession nouns with suffixes: <b>студе́нт → студе́нтка</b>, <b>учи́тель → учи́телька</b>, <b>письме́нник → письме́нниця</b>, <b>у́чень → учени́ця</b>, <b>робітни́к → робітни́ця</b>, <b>продаве́ць → продавчи́ня</b>, while classic specialist titles like <b>інжене́р, філо́лог, біо́лог, агроно́м, лі́кар</b> can also be paired with female names or feminine agreement (<i>Молода́ лі́кар увійшла́ в кабіне́т</i>).</li></ul>',
      '<b>7. Nationality & City-Resident Suffixes (-ець/-ка, -янин/-янка → -яни) & «украї́нський профе́сор» vs. «профе́сор украї́нської мо́ви»</b>:<ul><li><b>Nationalities in -(н)ець / -(н)ка & Friends</b>: Most nationalities form the masculine with <b>-ець / -єць</b> (fleeting <i>е</i> drops in plurals and oblique cases!) and the feminine with <b>-ка</b>: <b>украї́нець / украї́нка (украї́нці)</b>, <b>кана́дець / кана́дка</b>, <b>америка́нець / америка́нка</b>, <b>англі́єць / англі́йка (англі́йці)</b>, <b>ні́мець / ні́мка або́ німке́ня (ні́мці)</b>; compare also <b>поля́к / по́лька</b>, <b>слова́к / слова́чка</b>, <b>францу́з / францу́женка</b>, <b>чех / че́шка</b>.</li><li><b>Residents & Citizens in -янин / -янка (Drop -ин in the Plural!)</b>: Nouns ending in <b>-янин / -анин</b> drop the singular suffix <b>-ин</b> in the plural: <b>кия́нин</b> (f. <b>кия́нка</b>) → pl. <b>кия́ни</b> (Kyivans), <b>львів’я́нин → львів’я́ни</b>, <b>селя́нин → селя́ни</b> (villagers), <b>громадя́нин → громадя́ни</b> (citizens), <b>слов’яни́н → слов’я́ни</b>.</li><li><b>Nationality vs. Subject Taught</b>: Be careful to distinguish <b>украї́нський профе́сор / профе́сор-украї́нець</b> (a professor who is Ukrainian by nationality) from <b>профе́сор / виклада́ч украї́нської мо́ви</b> (a professor/instructor of the Ukrainian language), and use <b>з + Genitive</b> for textbooks or exercises in a subject: <b>підру́чник / зо́шит / впра́ви з украї́нської мо́ви</b>!</li></ul>',
      '<b>8. Plural Stress Shifts, Stem Vowel Alternations («ко́лір → кольори́») & «па́м’ятник» vs. «па́м’ятка»</b>:<ul><li><b>Mandatory Stress Shifts in Nominative Plurals</b>:<ul><li><b>Stem-to-Ending Shift</b>: <b>чолові́к → чоловіки́</b> (men), <b>жі́нка → жінки́</b> (women), <b>кни́жка → книжки́</b>, <b>зі́рка → зірки́</b>, <b>ліс → ліси́</b>, <b>дах → дахи́</b>, <b>брат → брати́</b>. Watch out for <b>ба́тько</b> (father, stem stress) vs. plural <b>батьки́</b> (ending stress = <b>parents</b>!).</li><li><b>Ending-to-Stem Shift in Feminines</b>: <b>гора́ → го́ри</b>, <b>ріка́ → рі́ки</b>, <b>трава́ → тра́ви</b>, <b>сестра́ → се́стри</b>.</li><li><b>Neuter Plurals in -а / -я</b>: Two-syllable neuters flip their stress to the opposite syllable (<b>вікно́ → ві́кна, село́ → се́ла</b> vs. <b>мо́ре → моря́, по́ле → поля́, мі́сто → міста́, мі́сце → місця́</b>), while three-syllable neuters shift stress to the middle syllable: <b>о́зеро → озе́ра</b>, <b>де́рево → дере́ва</b> (Gen. pl. <b>дере́в</b>).</li></ul></li><li><b>Three Classic Stem Alternations in Plurals</b>:<ul><li><b>Closed-Syllable і → о</b>: <b>стіл → столи́, рік → роки́, ніч → но́чі, гість → го́сті, ніж → ножі́</b>, and with soft <i>ьо</i>: <b>ко́лір → кольори́</b> (colors)!</li><li><b>Fleeting о in -ок</b>: <b>буди́нок → буди́нки, квито́к → квитки́, малю́нок → малю́нки, подару́нок → подару́нки, жовто́к → жовтки́</b>.</li><li><b>Fleeting е in -ець (with soft plural -і)</b>: <b>хло́пець → хло́пці, стіле́ць → стільці́, гребіне́ць → гребінці́, оліве́ць → олівці́</b>.</li></ul></li><li><b>«па́м’ятник» (Statue) vs. «па́м’ятка» (Heritage Landmark)</b>: Masculine <b>па́м’ятник (+ Dative)</b> is a sculpted statue or memorial to a person/event (<i>па́м’ятник Тара́сові Шевче́нку</i>), whereas feminine <b>па́м’ятка (+ Genitive)</b> is a historical or architectural monument/heritage site (<i>па́м’ятка архітекту́ри на пло́щі Ри́нок</i>)!</li></ul>',
    ],
    structuredLesson: {
      bigIdea: {
        headline: 'Read Any Noun’s Gender at a Glance & Match Adjectives, Possessives, and Plurals',
        body: 'In many European languages, you have to memorize the gender of every noun blindly. In Ukrainian, the last letter of a noun tells you its gender almost 100% of the time! Once you spot whether a noun is Masculine (consonant/-й), Feminine (-а/-я), or Neuter (-о/-е/-CCя), matching adjectives («нови́й / нова́ / нове́ / нові́») and possessives («мій / моя́ / моє́ / мої́») clicks into place like puzzle pieces.',
        keyTerms: [
          {
            term: 'Grammatical Gender (Рід іме́нника: Masculine, Feminine, Neuter)',
            plainEnglish: 'Every Ukrainian noun—even a table, a book, or a window—belongs to one of three categories based on its ending: Masculine (consonant/-й), Feminine (-а/-я), or Neuter (-о/-е or doubled consonant + -я).',
          },
          {
            term: 'Grammatical Agreement (Узго́дження)',
            plainEnglish: 'Changing the ending of an adjective (like нови́й "new") or possessive (like мій "my") so it matches the gender and number of the noun it describes.',
          },
          {
            term: 'Hard-Stem vs. Soft-Stem Adjectives (-ий vs. -ій)',
            plainEnglish: 'Most adjectives end in hard -ий (-а, -е, -і), like нови́й. A smaller group ends in soft -ій (-я, -є, -і), like си́ній (dark blue) or лі́тній (summer).',
          },
          {
            term: 'Stem Vowel Alternation (Ікавізм: і ↔ о/е & Fleeting о/е)',
            plainEnglish: 'When adding a plural or case ending turns a closed syllable into an open syllable, Ukrainian often swaps і back to historical о or е (стіл → столи́, ко́лір → кольори́) or drops a fleeting о/е (квито́к → квитки́, хло́пець → хло́пці).',
          },
        ],
      },
      seeItInAction: [
        {
          uk: 'Це <mark class="vc-highlight">нови́й</mark> телефо́н, <mark class="vc-highlight">нова́</mark> су́мка і <mark class="vc-highlight">нове́</mark> мі́сце.',
          en: 'This is a new phone (m.), a new bag (f.), and a new place (n.).',
          highlightNote: 'See how «нови́й» swaps its ending (-ий → -а → -е) to match the noun’s ending!',
        },
        {
          uk: '<mark class="vc-highlight">Моє́ рі́дне</mark> мі́сто ду́же <mark class="vc-highlight">краси́ве</mark>, а <mark class="vc-highlight">на́ші нові́</mark> оповіда́ння — <mark class="vc-highlight">ціка́ві</mark>.',
          en: 'My hometown is very beautiful, and our new short stories are interesting.',
          highlightNote: 'Neuter «мі́сто» takes -є/-е, while ALL plural adjectives and possessives end in -і!',
        },
        {
          uk: 'Де <mark class="vc-highlight">мої́ нові́ окуля́ри, гро́ші</mark> та ключі́? А <mark class="vc-highlight">те́плий о́дяг</mark> уже́ тут.',
          en: 'Where are my new glasses, money, and keys? And the warm clothes are already here.',
          highlightNote: 'Watch out for number mismatches: «гро́ші» (money) and «окуля́ри» (glasses) are always plural in Ukrainian, while «о́дяг» (clothes) is masculine singular!',
        },
      ],
      visualTables: [
        {
          title: '1. How to Tell Noun Gender & Form Basic Plurals',
          subtitle: 'Look at the final letter of the dictionary (Nominative singular) form.',
          headers: ['Gender', 'Typical Singular Ending', 'Singular Examples', 'Typical Plural Ending', 'Plural Examples'],
          rows: [
            [
              '<b>Masculine (Чолові́чий)</b>',
              '<b>Consonant</b> or <b class="uk-text">-й</b><br><span class="text-xs">(+ male people in -о/-а: та́то, ба́тько, дя́дько, суддя́)</span>',
              '<b class="uk-text">стіл</b> (table), <b class="uk-text">парк</b> (park), <b class="uk-text">буди́нок</b> (building), <b class="uk-text">музе́й</b> (museum), <b class="uk-text">хло́пець</b> (boy)',
              '<b class="uk-text">-и</b> (hard)<br><b class="uk-text">-і / -ї</b> (soft)',
              '<b class="uk-text">столи́, па́рки, буди́нки, музе́ї, хло́пці</b>',
            ],
            [
              '<b>Feminine (Жіно́чий)</b>',
              '<b class="uk-text">-а</b> or <b class="uk-text">-я</b><br><span class="text-xs">(+ 3rd-declension soft/sibilant: ніч, сіль, любо́в, по́дорож)</span>',
              '<b class="uk-text">кни́жка</b> (book), <b class="uk-text">ка́ва</b> (coffee), <b class="uk-text">ву́лиця</b> (street), <b class="uk-text">пі́сня</b> (song), <b class="uk-text">ніч</b> (night)',
              '<b class="uk-text">-и</b> (hard)<br><b class="uk-text">-і / -ї</b> (soft)',
              '<b class="uk-text">книжки́, ву́лиці, пісні́, но́чі</b>',
            ],
            [
              '<b>Neuter (Сере́дній)</b>',
              '<b class="uk-text">-о</b>, <b class="uk-text">-е</b>, or doubled consonant + <b class="uk-text">-я</b> (<b class="uk-text">-ння, -ття</b>)<br><span class="text-xs">(+ ім’я́, дівча́)</span>',
              '<b class="uk-text">мі́сто</b> (city), <b class="uk-text">вікно́</b> (window), <b class="uk-text">мо́ре</b> (sea), <b class="uk-text">життя́</b> (life), <b class="uk-text">пита́ння</b> (question)',
              '<b class="uk-text">-а</b> (hard)<br><b class="uk-text">-я</b> (soft)',
              '<b class="uk-text">міста́, ві́кна, моря́, пита́ння</b> (unchanged!)',
            ],
          ],
        },
        {
          title: '2. Complete Adjective, Possessive & Demonstrative Agreement Matrix',
          subtitle: 'Every modifier matches its noun’s gender in the singular, and ALL genders share «-і» in the Nominative plural!',
          headers: ['Modifier Type', 'Masculine (Він)', 'Feminine (Вона́)', 'Neuter (Воно́)', 'Plural — ALL Genders (Вони́)'],
          rows: [
            ['<b>Hard Adjective</b> ("new")', '<b class="uk-text">нови́й</b> (буди́нок)', '<b class="uk-text">нова́</b> (кни́жка)', '<b class="uk-text">нове́</b> (мі́сто)', '<b class="uk-text">нові́</b> (буди́нки / книжки́ / міста́)'],
            ['<b>Soft Adjective</b> ("dark blue")', '<b class="uk-text">си́ній</b> (авто́бус)', '<b class="uk-text">си́ня</b> (су́кня)', '<b class="uk-text">си́нє</b> (не́бо)', '<b class="uk-text">си́ні</b> (авто́буси / су́кні)'],
            ['<b>"My / Your (informal)"</b>', '<b class="uk-text">мій / твій</b>', '<b class="uk-text">моя́ / твоя́</b>', '<b class="uk-text">моє́ / твоє́</b>', '<b class="uk-text">мої́ / твої́</b>'],
            ['<b>"Our / Your (polite/pl.)"</b>', '<b class="uk-text">наш / ваш</b>', '<b class="uk-text">на́ша / ва́ша</b>', '<b class="uk-text">на́ше / ва́ше</b>', '<b class="uk-text">на́ші / ва́ші</b>'],
            ['<b>"Their" (Declinable!)</b>', '<b class="uk-text">ї́хній</b>', '<b class="uk-text">ї́хня</b>', '<b class="uk-text">ї́хнє</b>', '<b class="uk-text">ї́хні</b>'],
            ['<b>"His / Her" (Never changes!)</b>', '<b class="uk-text">його́ / її́</b>', '<b class="uk-text">його́ / її́</b>', '<b class="uk-text">його́ / її́</b>', '<b class="uk-text">його́ / її́</b>'],
            ['<b>"This / That"</b>', '<b class="uk-text">цей / той</b>', '<b class="uk-text">ця / та</b>', '<b class="uk-text">це / те</b>', '<b class="uk-text">ці / ті</b>'],
            ['<b>Question "Which / What kind of?"</b>', '<b class="uk-text">яки́й? / чий?</b>', '<b class="uk-text">яка́? / чия́?</b>', '<b class="uk-text">яке́? / чиє́?</b>', '<b class="uk-text">які́? / чиї́?</b>'],
          ],
        },
        {
          title: '3. Singular vs. Plural Mismatches Between Ukrainian and English',
          subtitle: 'These high-frequency nouns have the opposite grammatical number from English—memorize them early!',
          headers: ['Category', 'Ukrainian Nouns', 'Grammatical Agreement Example'],
          rows: [
            [
              '<b>Singular-Only in Ukrainian</b><br>(English often uses plural)',
              '<b class="uk-text">о́дяг</b> (clothes, m.), <b class="uk-text">взуття́</b> (footwear/shoes, n.), <b class="uk-text">карто́пля</b> (potatoes, f.), <b class="uk-text">мо́рква</b> (carrots, f.), <b class="uk-text">цибу́ля</b> (onions, f.), <b class="uk-text">зе́лень</b> (greens, f.), <b class="uk-text">сміття́</b> (trash, n.)',
              '<b class="uk-text">Мій те́плий о́дяг; нове́ взуття́; сві́жа карто́пля і мо́рква.</b>',
            ],
            [
              '<b>Plural-Only in Ukrainian</b><br>(English often uses singular)',
              '<b class="uk-text">гро́ші</b> (money), <b class="uk-text">две́рі</b> (door), <b class="uk-text">воро́та</b> (gate), <b class="uk-text">кані́кули</b> (school vacation), <b class="uk-text">парфу́ми</b> (perfume), <b class="uk-text">вершки́</b> (cream), <b class="uk-text">ша́хи</b> (chess), <b class="uk-text">ме́блі</b> (furniture), <b class="uk-text">окуля́ри</b> (glasses), <b class="uk-text">штани́</b> (pants), <b class="uk-text">но́жиці</b> (scissors)',
              '<b class="uk-text">Де мої́ гро́ші? Скляні́ две́рі відчи́нені. Ці францу́зькі парфу́ми.</b>',
            ],
            [
              '<b>Countable in Ukrainian</b><br>(Uncountable in English)',
              '<b class="uk-text">пора́да → пора́ди</b> (advice / pieces of advice), <b class="uk-text">новина́ → нови́ни</b> (a piece of news / news)',
              '<b class="uk-text">Одна́ кори́сна пора́да; дві до́брі нови́ни.</b>',
            ],
          ],
        },
        {
          title: '4. Plural Stem Alternations, Irregular Plurals & Stress Flip Patterns',
          subtitle: 'Why «стіл» becomes «столи́», «квито́к» becomes «квитки́», and «вікно́» flips stress to «ві́кна».',
          headers: ['Pattern Type', 'Rule in Plain English', 'Singular → Nominative Plural Examples'],
          rows: [
            [
              '<b>1. Closed-Syllable «і → о / е»</b>',
              'When adding a plural ending opens a closed syllable, <b class="uk-text">і</b> returns to <b class="uk-text">о</b> (or <b class="uk-text">е</b>).',
              '<b class="uk-text">стіл → столи́, рік → роки́, ніч → но́чі, гість → го́сті, ніж → ножі́, ко́лір → кольори́</b> (with ьо!), <b class="uk-text">річ → ре́чі</b>',
            ],
            [
              '<b>2. Fleeting «о» in «-ок» & «е» in «-ець»</b>',
              'Unstressed <b class="uk-text">о</b> or <b class="uk-text">е</b> in the final syllable drops out when an ending is added.',
              '<b class="uk-text">буди́нок → буди́нки, квито́к → квитки́, малю́нок → малю́нки; хло́пець → хло́пці, стіле́ць → стільці́, украї́нець → украї́нці</b>',
            ],
            [
              '<b>3. Four Essential Irregular Plurals</b>',
              'Suppletive or consonant-mutated human plurals used every day.',
              '<b class="uk-text">люди́на → лю́ди</b> (person → people), <b class="uk-text">дити́на → ді́ти</b> (child → children), <b class="uk-text">друг → дру́зі</b> (г→з), <b class="uk-text">ма́ти → матері́</b>',
            ],
            [
              '<b>4. Citizens & Residents in «-янин / -анин»</b>',
              'Drop the singular suffix <b class="uk-text">-ин</b> and add <b class="uk-text">-и</b> in the plural.',
              '<b class="uk-text">кия́нин (f. кия́нка) → кия́ни, львів’я́нин → львів’я́ни, громадя́нин → громадя́ни, селя́нин → селя́ни</b>',
            ],
            [
              '<b>5. Mandatory Stress Flips in Plurals</b>',
              'Many 2-syllable feminines and neuters flip stress to the opposite syllable in the plural!',
              'End → Stem: <b class="uk-text">гора́ → го́ри, ріка́ → рі́ки, сестра́ → се́стри, вікно́ → ві́кна, село́ → се́ла</b><br>Stem → End: <b class="uk-text">кни́жка → книжки́, жі́нка → жінки́, мі́сто → міста́, мо́ре → моря́, ба́тько</b> (father) vs. <b class="uk-text">батьки́</b> (parents!)',
            ],
          ],
        },
      ],
      diagrams: [
        {
          title: 'Visual Gender & Agreement Flow: From Noun Ending to Adjective Ending',
          subtitle: 'Follow the noun’s ending in the singular, or jump straight to «-і» in the plural.',
          type: 'flow',
          nodes: [
            {
              label: 'Consonant / -й (Masculine)',
              value: 'нови́й стіл • си́ній авто́бус • мій друг',
              description: 'Also includes male family/person words in -о/-а (мій ба́тько, мій дя́дько, справедли́вий суддя́, завзя́тий риба́лка).',
            },
            {
              label: '-а / -я (Feminine)',
              value: 'нова́ кни́жка • си́ня су́кня • моя́ сім’я́',
              description: 'Also includes 3rd-declension soft/sibilant feminines (те́пла ніч, ціка́ва по́дорож, сві́жа зе́лень).',
            },
            {
              label: '-о / -е / -CCя (Neuter)',
              value: 'нове́ мі́сто • си́нє мо́ре • важли́ве пита́ння',
              description: 'Includes doubled-consonant -ння/-ття nouns (нове́ життя́, ціка́ве оповіда́ння) and ім’я́ (га́рне ім’я́).',
            },
            {
              label: 'ALL Plurals',
              value: 'нові́ столи́ / книжки́ / міста́ / оповіда́ння',
              description: 'In the Nominative plural, every adjective ends in -і (and possessives in мої́, на́ші, ці) regardless of gender!',
            },
          ],
        },
        {
          title: 'Meaning Contrasts: «украї́нський профе́сор» vs. «профе́сор украї́нської мо́ви» & «па́м’ятник» vs. «па́м’ятка»',
          subtitle: 'Look closely at how Ukrainian distinguishes nationality from subject matter and statues from heritage sites.',
          type: 'comparison',
          nodes: [
            {
              label: 'украї́нський профе́сор',
              value: 'A professor who is Ukrainian by nationality',
              description: 'Compare: профе́сор / виклада́ч украї́нської мо́ви (a professor of the Ukrainian language) and підру́чник з украї́нської мо́ви (a textbook in Ukrainian, using з + Genitive!).',
            },
            {
              label: 'па́м’ятник vs. па́м’ятка',
              value: 'па́м’ятник (statue/memorial) • па́м’ятка (landmark)',
              description: 'Masculine па́м’ятник (+ Dative: па́м’ятник Тара́сові Шевче́нку) is a sculpted monument, whereas feminine па́м’ятка (+ Genitive: па́м’ятка архітекту́ри) is a historical heritage site.',
            },
          ],
        },
      ],
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Identify the Noun’s Gender from Its Ending (and Check for Male Family Words)',
          explanation: 'Check the last letter: consonant/-й = Masculine; -а/-я = Feminine; -о/-е or doubled consonant + -я (-ння, -ття) = Neuter. Remember that male people like та́то, ба́тько, дя́дько, Мико́ла are Masculine!',
          examples: [
            { uk: 'парк (m.) • кав’я́рня (f.) • вікно́ (n.) • пита́ння (n.) • мій ба́тько (m.)', en: 'park • coffee shop • window • question • my father' },
          ],
        },
        {
          stepNumber: 2,
          title: 'Match Your Adjective and Possessive Ending',
          explanation: 'Swap masculine -ий/-ій to -а/-я for Feminine, -е/-є for Neuter, or -і for ANY Plural.',
          examples: [
            { uk: 'ціка́вий фільм • ціка́ва кни́жка • ціка́ве оповіда́ння • ціка́ві оповіда́ння', en: 'interesting movie • interesting book • interesting story • interesting stories' },
          ],
        },
        {
          stepNumber: 3,
          title: 'Apply Stem Alternations and Stress Shifts in the Plural',
          explanation: 'When forming plurals, drop fleeting -о-/-е- in -ок/-ець (квито́к → квитки́, хло́пець → хло́пці), change closed-syllable і → о in classic roots (стіл → столи́, рік → роки́, ко́лір → кольори́), and flip stress on two-syllable neuters (вікно́ → ві́кна, мі́сто → міста́).',
          examples: [
            { uk: 'висо́кі го́ри • глибо́кі озе́ра • яскра́ві кольори́ • нові́ буди́нки', en: 'high mountains • deep lakes • bright colors • new buildings' },
          ],
        },
      ],
      moreExamples: [
        {
          uk: '<mark class="vc-highlight">Мій дя́дько Мико́ла</mark> — <mark class="vc-highlight">завзя́тий риба́лка</mark>, а <mark class="vc-highlight">ці нові́</mark> украї́нські <mark class="vc-highlight">оповіда́ння</mark> ду́же <mark class="vc-highlight">ціка́ві</mark>.',
          en: 'My uncle Mykola is an avid fisherman, and these new Ukrainian short stories are very interesting.',
          highlightNote: 'Male person nouns in -о/-а (дя́дько, Мико́ла, риба́лка) take masculine adjectives, while neuter -ння nouns (оповіда́ння) look identical in singular and plural!',
        },
        {
          uk: '<mark class="vc-highlight">Корінні́ кия́ни</mark> та молоді́ україні́сти купи́ли нови́й <mark class="vc-highlight">підру́чник з украї́нської мо́ви</mark>.',
          en: 'Native Kyivans and young Ukrainian studies specialists bought a new textbook in the Ukrainian language.',
          highlightNote: 'Notice кия́нин → кия́ни (dropping -ин in the plural) and «підру́чник з украї́нської мо́ви» (з + Genitive for a subject textbook).',
        },
        {
          uk: 'У Карпа́тах висо́кі <mark class="vc-highlight">го́ри</mark>, густі́ <mark class="vc-highlight">ліси́</mark>, глибо́кі <mark class="vc-highlight">озе́ра</mark> та яскра́ві <mark class="vc-highlight">кольори́</mark>, а у Льво́ві — да́вні <mark class="vc-highlight">па́м’ятки архітекту́ри</mark>.',
          en: 'In the Carpathians there are high mountains, dense forests, deep lakes, and bright colors, and in Lviv — ancient architectural monuments.',
          highlightNote: 'Showcases plural stress shifts (гора́ → го́ри, ліс → ліси́, о́зеро → озе́ра), і → ьо (ко́лір → кольори́), and па́м’ятки архітекту́ри.',
        },
      ],
      exceptionsAndEdgeCases: [
        {
          ruleTitle: 'Non-Typical Gender Endings to Know by Heart',
          ruleExplanation: 'Three compact groups of nouns have a grammatical gender that differs from the basic consonant / -а / -о rule:',
          exceptions: [
            {
              item: 'Masculine Nouns in -о, -а, -я (Male People): та́то, ба́тько, дя́дько, діду́сь Мико́ла, суддя́, риба́лка, воєво́да',
              note: 'Because they denote male persons, adjectives and verbs agree in the Masculine: «мій до́брий та́то», «справедли́вий суддя́».',
            },
            {
              item: 'Feminine 3rd-Declension Nouns Ending in a Consonant: ніч, річ, сіль, любо́в, о́сінь, тінь, ра́дість, по́дорож, молодь',
              note: 'These nouns take Feminine adjectives: «те́пла ніч», «ціка́ва по́дорож», «золота́ о́сінь».',
            },
            {
              item: 'Neuter Nouns Ending in -я: пита́ння, життя́, знання́, завда́ння, оповіда́ння, взуття́ + ім’я́ (first name) & теля́, дівча́',
              note: 'Always take Neuter singular agreement (-е/-є): «важли́ве пита́ння», «нове́ життя́», «га́рне ім’я́».',
            },
          ],
        },
      ],
      commonMistakes: [
        {
          mistake: 'Treating «життя́», «пита́ння», or «ім’я́» as feminine because they end in -я (*нова́ життя́, *моя́ ім’я́)',
          wrongUk: '*нова́ життя́, *ціка́ва пита́ння, *моя́ ім’я́',
          correctUk: 'нове́ життя́, ціка́ве пита́ння, моє́ ім’я́',
          explanation: 'Nouns ending in a doubled consonant + -я (-ння, -ття) and nouns in -м’я (ім’я́) are Neuter and take -е / -є!',
        },
        {
          mistake: 'Using singular agreement with «гро́ші» (money) or «две́рі» (door), or plural agreement with «о́дяг» (clothes)',
          wrongUk: '*де мій гро́ші? / *де мої́ о́дяги?',
          correctUk: 'Де мої́ гро́ші? (plural) / Де мій о́дяг? (masculine singular)',
          explanation: '«Гро́ші» and «две́рі» are always plural in Ukrainian, while «о́дяг» and «взуття́» are singular collectives.',
        },
        {
          mistake: 'Confusing «ба́тько» (father) with plural «батьки́» (parents)',
          wrongUk: 'Using «ба́тько» and «батьки́» as the same stress',
          correctUk: 'ба́тько (1st-syllable stress = father) vs. батьки́ (2nd-syllable stress = parents)',
          explanation: 'In the plural with ending stress, «батьки́» means "parents" (mother and father together).',
        },
      ],
      inlineChecks: [
        {
          id: 'a11-check-1',
          question: 'Why do we say «важли́ве пита́ння» (an important question) and «га́рне ім’я́» (a beautiful name) with the neuter ending «-е»?',
          options: [
            'Because nouns ending in a doubled consonant + -я (-ння, -ття) and nouns in -м’я (ім’я́) are grammatically Neuter',
            'Because they are plural',
            'Because adjectives never end in -а',
          ],
          correctIndex: 0,
          explanation: 'Abstract verbal nouns in -ння/-ття (пита́ння, життя́, знання́) and ім’я́ belong to the Neuter gender.',
        },
        {
          id: 'a11-check-2',
          question: 'Which sentence correctly uses Ukrainian singular/plural agreement for "money" («гро́ші») and "clothes" («о́дяг»)?',
          options: [
            'Де моє́ гро́ші і мої́ нові́ о́дяги?',
            'Де мої́ гро́ші і мій те́плий о́дяг?',
            'Де мій гро́ші і моя́ о́дяг?',
          ],
          correctIndex: 1,
          explanation: '«Гро́ші» (money) is always plural («мої́ гро́ші»), while «о́дяг» (clothes) is masculine singular («мій те́плий о́дяг»).',
        },
        {
          id: 'a11-check-3',
          question: 'What is the Nominative plural of «кия́нин» (a resident of Kyiv) and «ко́лір» (color)?',
          options: [
            'кия́ни (drops -ин) and кольори́ (і alternates to ьо)',
            'кия́нини and ко́ліри',
            'кия́нці and кольо́рі',
          ],
          correctIndex: 0,
          explanation: 'Nouns in -янин/-анин drop -ин in the plural (кия́нин → кия́ни), and ко́лір alternates closed-syllable і to ьо (кольори́).',
        },
      ],
      completeReference: [
        {
          title: 'Advanced Reference: Profession Gender Pairs & Nationality Suffixes («-ець / -ка», «-янин / -янка»)',
          summary: 'Expand to view parallel masculine/feminine profession titles and nationality nouns.',
          contentHtml: `
            <p class="mb-2"><b>1. Masculine & Feminine Profession Pairs (Фемініти́ви):</b></p>
            <ul class="list-disc pl-5 space-y-1 mb-3">
              <li><b>Suffix -ка:</b> <b>студе́нт → студе́нтка, учи́тель → учи́телька, виклада́ч → виклада́чка, журналі́ст → журналі́стка, офіціа́нт → офіціа́нтка, лі́кар → лі́карка, профе́сор → профе́сорка</b>.</li>
              <li><b>Suffix -иця / -ниця:</b> <b>письме́нник → письме́нниця</b> (writer), <b>робітни́к → робітни́ця</b> (worker), <b>у́чень → учени́ця</b> (pupil), <b>переклада́ч → переклада́чка</b>.</li>
              <li><b>Suffix -иня / -чиня:</b> <b>продаве́ць → продавчи́ня</b> (salesperson), <b>краве́ць → кравчи́ня</b>, <b>ми́тець → мистки́ня</b> (artist).</li>
            </ul>
            <p class="mb-2"><b>2. Nationalities & City Residents (Маскулініти́ви / Фемініти́ви / Множина́):</b></p>
            <ul class="list-disc pl-5 space-y-1">
              <li><b>украї́нець / украї́нка → украї́нці</b> (fleeting <i>е</i> drops!)</li>
              <li><b>америка́нець / америка́нка → америка́нці; кана́дець / кана́дка → кана́дці; англі́єць / англі́йка → англі́йці; ні́мець / ні́мка (німке́ня) → ні́мці</b></li>
              <li><b>поля́к / по́лька → поля́ки; слова́к / слова́чка → слова́ки; чех / че́шка → че́хи; францу́з / францу́женка → францу́зи</b></li>
              <li><b>кия́нин / кия́нка → кия́ни; львів’я́нин / львів’я́нка → львів’я́ни; харків’я́нин / харків’я́нка → харків’я́ни</b>.</li>
            </ul>
          `,
        },
      ],
      takeaways: [
        'Tell a noun’s gender by its ending: consonant/-й = Masculine (стіл, музе́й + male people та́то, ба́тько), -а/-я = Feminine (кни́жка, ву́лиця + 3rd-declension ніч, по́дорож), -о/-е/-CCя = Neuter (мі́сто, мо́ре, пита́ння, життя́, ім’я́).',
        'Match adjectives and possessives to the noun: нови́й / мій (m.), нова́ / моя́ (f.), нове́ / моє́ (n.), and нові́ / мої́ for ALL plurals.',
        'Watch out for number mismatches: гро́ші (money), две́рі (door), окуля́ри (glasses), and кані́кули (vacation) are plural-only, while о́дяг (clothes), взуття́ (footwear), and карто́пля (potatoes) are singular-only.',
        'Apply stem alternations in plurals: стіл → столи́, ко́лір → кольори́, квито́к → квитки́, хло́пець → хло́пці, кия́нин → кия́ни, люди́на → лю́ди, дити́на → ді́ти, друг → дру́зі.',
      ],
    },
    examples: [
      { uk: 'Це нови́й телефо́н, нова́ су́мка і нове́ мі́сце.', en: 'This is a new phone (m.), a new bag (f.), and a new place (n.).' },
      { uk: 'Моє́ рі́дне мі́сто ду́же краси́ве і зеле́не.', en: 'My hometown (neuter) is very beautiful and green.' },
      { uk: 'Де мої́ нові́ окуля́ри, гро́ші та ключі́?', en: 'Where are my new glasses, money, and keys (all plural in Ukrainian)?' },
      { uk: 'Цей зимо́вий о́дяг те́плий, а сві́жа мо́рква і карто́пля вже на столі́.', en: 'These winter clothes are warm, and the fresh carrots and potatoes are already on the table (all singular in Ukrainian).' },
      { uk: 'Мій дя́дько Мико́ла — завзя́тий риба́лка, а ці нові́ украї́нські оповіда́ння ду́же ціка́ві.', en: 'My uncle Mykola (masculine in -о/-а) is an avid fisherman, and these new Ukrainian short stories (-ння plural = singular) are very interesting.' },
      { uk: 'Корінні́ кия́ни та молоді́ україні́сти купи́ли нови́й підру́чник з украї́нської мо́ви.', en: 'Native Kyivans (кия́нин → кия́ни) and young Ukrainian studies specialists bought a new textbook in the Ukrainian language (з + Genitive).' },
      { uk: 'У Карпа́тах висо́кі го́ри, густі́ ліси́, глибо́кі озе́ра та яскра́ві кольори́, а в Льво́ві — да́вні па́м’ятки архітекту́ри.', en: 'In the Carpathians there are high mountains (го́ри), dense forests (ліси́), deep lakes (озе́ра), and bright colors (ко́лір → кольори́), and in Lviv — ancient architectural monuments (па́м’ятки архітекту́ри).' },
    ],
    dialogue: {
      title: 'Showing a Friend Your New Apartment',
      lines: [
        { speaker: 'Ната́ля', uk: 'Ласка́во про́симо! Це на́ша нова́ кварти́ра.', en: 'Welcome! This is our new apartment.' },
        { speaker: 'Богда́н', uk: 'Яка́ сві́тла і вели́ка кімна́та! І ду́же вели́ке вікно́.', en: 'What a bright and large room! And a very big window.' },
        { speaker: 'Ната́ля', uk: 'Так, а ось там наш балкон і зелений парк.', en: 'Yes, and right over there is our balcony and a green park.' },
      ],
    },
    activeRecall: [
      { promptEn: 'a new book (feminine)', answerUk: 'нова́ кни́жка', hint: 'кни́жка ends in -а, so нови́й becomes нова́' },
      { promptEn: 'a big city (neuter)', answerUk: 'вели́ке мі́сто', hint: 'мі́сто ends in -о (neuter), so the adjective ends in -е' },
      { promptEn: 'my bag (feminine)', answerUk: 'моя́ су́мка', hint: 'Feminine form of мій is моя́' },
      { promptEn: 'interesting books (plural)', answerUk: 'ціка́ві книжки́', hint: 'All plural adjectives end in -і' },
    ],
    reviewSummary:
      'Masculine nouns end in a consonant (нови́й стіл), Feminine nouns end in -а/-я (нова́ кни́жка), and Neuter nouns end in -о/-е/-CCя (нове́ мі́сто). In the plural, adjectives always end in -і for all genders (нові́ столи́, нові́ книжки́, нові́ міста́).',
    cfu: [
      {
        q: 'What grammatical gender are the nouns «мі́сто» (city), «вікно́» (window), and «мо́ре» (sea)?',
        opts: ['Masculine', 'Feminine', 'Neuter (because they end in -о or -е)'],
        ans: 2,
        exp: 'Nouns ending in -о or -е (except male family words like та́то/ба́тько) are Neuter and take neuter adjectives ending in -е/-є.',
      },
      {
        q: 'How does the adjective «ціка́вий» (interesting) change to describe «кни́жка» (book, feminine) and «фільм» (movie, masculine)?',
        opts: [
          'ціка́ва кни́жка and ціка́вий фільм',
          'ціка́ве кни́жка and ціка́ва фільм',
          'ціка́вий кни́жка and ціка́вий фільм',
        ],
        ans: 0,
        exp: '«кни́жка» is feminine (-а), so it takes «ціка́ва». «фільм» ends in a consonant (masculine), so it takes «ціка́вий».',
      },
      {
        q: 'What ending do Ukrainian adjectives take in the Nominative Plural across ALL three genders?',
        opts: ['-и', '-і (for example: нові́ буди́нки, нові́ книжки́, нові́ ві́кна)', '-а'],
        ans: 1,
        exp: 'In the plural, all Ukrainian adjectives end in -і regardless of the noun’s singular gender.',
      },
    ],
    practice: [
      {
        prompt: 'Choose the correct form of "my" for the feminine noun «робо́та» (work/job):',
        opts: ['мій робо́та', 'моя́ робо́та', 'моє́ робо́та'],
        ans: 1,
        audioUk: 'моя́ робо́та',
        exp: 'Because «робо́та» ends in -а (feminine), use the feminine possessive «моя́».',
      },
      {
        prompt: 'Choose the correct adjective form for the neuter noun «мі́сце» (place / seat):',
        opts: ['ві́льний мі́сце', 'ві́льна мі́сце', 'ві́льне мі́сце'],
        ans: 2,
        audioUk: 'ві́льне мі́сце',
        exp: '«мі́сце» ends in -е (neuter), so the adjective takes the neuter ending -е: «ві́льне мі́сце» (a free seat).',
      },
      {
        prompt: 'Why is «ба́тько» (father) masculine even though it ends in -о?',
        opts: [
          'Because it refers to a male person, so we say «мій до́брий ба́тько»',
          'Because all words starting with б are masculine',
          'It is actually neuter',
        ],
        ans: 0,
        audioUk: 'мій до́брий ба́тько',
        exp: 'Words for male family members like «ба́тько» (father) and «та́то» (dad) are grammatically masculine.',
      },
      {
        prompt: 'Select the correct plural phrase for "delicious varenyky (dumplings)":',
        opts: ['смачни́й варе́ники', 'смачна́ варе́ники', 'смачні́ варе́ники'],
        ans: 2,
        audioUk: 'смачні́ варе́ники',
        exp: '«варе́ники» is plural, so the adjective takes the plural ending -і: «смачні́ варе́ники».',
      },
      {
        prompt: 'What is the gender of «пита́ння» (question) and «життя́» (life)?',
        opts: [
          'Neuter (nouns with a doubled consonant before -я take neuter agreement: важли́ве пита́ння)',
          'Masculine',
          'Plural',
        ],
        ans: 0,
        audioUk: 'важли́ве пита́ння',
        exp: 'Nouns ending in a doubled consonant + -я (-ння, -ття) are neuter: «важли́ве пита́ння», «нове́ життя́».',
      },
    ],
    vocab: [
      ['нови́й', 'ADJ', 'new (f. нова́, n. нове́, pl. нові́)', 'Це наш нови́й проє́кт.', 'This is our new project.'],
      ['вели́кий', 'ADJ', 'big / large', 'У нас вели́ка кімна́та.', 'We have a large room.'],
      ['мали́й', 'ADJ', 'small / little', 'Це мале́ вікно́.', 'This is a small window.'],
      ['смачни́й', 'ADJ', 'tasty / delicious', 'Ду́же смачни́й обі́д!', 'A very delicious lunch!'],
      ['гаря́чий', 'ADJ', 'hot (food/drink)', 'Ось гаря́ча ка́ва.', 'Here is hot coffee.'],
      ['холо́дний', 'ADJ', 'cold', 'Холо́дна вода́ з лимо́ном.', 'Cold water with lemon.'],
      ['те́плий', 'ADJ', 'warm', 'Сього́дні те́плий ве́чір.', 'Today is a warm evening.'],
      ['ціка́вий', 'ADJ', 'interesting', 'Це ціка́ва кни́жка.', 'This is an interesting book.'],
      ['важли́вий', 'ADJ', 'important', 'Це важли́ве пита́ння.', 'This is an important question.'],
      ['ві́льний', 'ADJ', 'free / available', 'Чи цей сто́лик ві́льний?', 'Is this table free?'],
      ['мій', 'DET', 'my (f. моя́, n. моє́, pl. мої́)', 'Це моя́ сестра́.', 'This is my sister.'],
      ['наш', 'DET', 'our (f. на́ша, n. на́ше, pl. на́ші)', 'Це на́ше рі́дне мі́сто.', 'This is our hometown.'],
      ['цей', 'DET', 'this (f. ця, n. це, pl. ці)', 'Ця кав’я́рня ду́же затишна́.', 'This coffee shop is very cozy.'],
      ['вікно́', 'NOUN', 'window (neuter, pl. ві́кна)', 'Вели́ке сві́тле вікно́.', 'A large bright window.'],
      ['пита́ння', 'NOUN', 'question (neuter -ння)', 'У ме́не є одне́ пита́ння.', 'I have one question.'],
    ],
    exam: [
      {
        q: 'Which phrase correctly matches the adjective to the feminine noun «ка́ва»?',
        opts: ['смачни́й ка́ва', 'смачна́ ка́ва', 'смачне́ ка́ва'],
        ans: 1,
        exp: '«ка́ва» is feminine (-а), so the adjective takes the feminine ending -а: «смачна́ ка́ва».',
      },
      {
        q: 'Which phrase correctly says "this window" (where «вікно́» is neuter)?',
        opts: ['цей вікно́', 'ця вікно́', 'це вікно́'],
        ans: 2,
        exp: 'For a neuter noun like «вікно́», "this" is «це»: «це вікно́».',
      },
      {
        q: 'What is the plural of the neuter noun «мі́сто» (city)?',
        opts: ['міста́', 'мі́сти', 'мі́сту'],
        ans: 0,
        exp: 'Neuter nouns in -о take -а in the nominative plural: мі́сто → міста́.',
      },
      {
        q: 'How do you say "our friends" in the plural?',
        opts: ['наш дру́зі', 'на́ша дру́зі', 'на́ші дру́зі'],
        ans: 2,
        exp: 'In the plural, «наш» becomes «на́ші»: «на́ші дру́зі».',
      },
      {
        q: 'How do soft-stem adjectives like «си́ній» (dark blue) form their feminine and neuter singular?',
        opts: ['си́ня (feminine) and си́нє (neuter)', 'си́на and си́не', 'си́ній for all genders'],
        ans: 0,
        exp: 'Soft-stem adjectives ending in -ій take -я in the feminine (си́ня) and -є in the neuter (си́нє).',
      },
      {
        q: 'Why is «життя́» (life) described as «нове́ життя́» rather than «нова́ життя́»?',
        opts: [
          'Because nouns ending in a doubled consonant + -я (-ття, -ння) are neuter',
          'Because життя́ is masculine',
          'Because життя́ is plural',
        ],
        ans: 0,
        exp: 'Abstract nouns ending in a doubled consonant + -я (like життя́, знання́, пита́ння) are neuter.',
      },
    ],
  },
  {
    id: 'A1.2',
    level: 'A1',
    topicTag: 'A1 Beginner • Present & Past Tense Verbs',
    title: 'Everyday Verbs in the Present & Past Tense',
    objectives: [
      'Conjugate common Ukrainian verbs in the Present Tense (Group I -є- and Group II -и-).',
      'Recognize how -увати verbs (like працюва́ти "to work") change to -ую in the present tense.',
      'Form the Past Tense effortlessly using gender and plural endings (-в, -ла, -ло, -ли).',
    ],
    summary:
      'In Ukrainian, dictionary verbs end in -ти (like чита́ти "to read" or говори́ти "to speak"). To say who is doing the action in the present tense, we swap -ти for personal endings. And the past tense is even easier: it only changes by gender and plural!',
    rules: [
      '<b>1. Present Tense Group I (The "-аю / -єш / -є" Pattern)</b>: Many verbs ending in <b>-ати</b> drop <i>-ти</i> and add <b>-ю, -єш, -є, -ємо, -єте, -ють</b>. Notice that for "he / she" (<b>він / вона́</b>), Group I verbs end in a bare vowel <b>-є</b> (with NO <i>-ть</i> at the end!):<ul><li><b>чита́ти</b> (to read): я <b>чита́ю</b>, ти <b>чита́єш</b>, він/вона́ <b>чита́є</b>, ми <b>чита́ємо</b>, ви <b>чита́єте</b>, вони́ <b>чита́ють</b>.</li><li><b>зна́ти</b> (to know), <b>слу́хати</b> (to listen), <b>ду́мати</b> (to think), <b>сні́дати</b> (to eat breakfast), and <b>вивча́ти</b> (to study) work the exact same way!</li></ul>',
      '<b>2. Verbs in -увати / -ювати (Drop -ва- in the Present!)</b>: Dozens of useful verbs end in <b>-увати</b> or <b>-ювати</b>, such as <b>працюва́ти</b> (to work), <b>готува́ти</b> (to cook), <b>купува́ти</b> (to buy), and <b>подорожува́ти</b> (to travel). In the present tense, replace <i>-увати</i> with <b>-ую, -уєш, -ує, -уємо, -уєте, -ують</b>:<ul><li>я <b>працю́ю</b>, ти <b>працю́єш</b>, він/вона́ <b>працю́є</b>, ми <b>працю́ємо</b>, ви <b>працю́єте</b>, вони́ <b>працю́ють</b>.</li></ul>',
      '<b>3. Present Tense Group II (The "-ю / -иш / -ить" Pattern)</b>: Verbs ending in <b>-ити</b> or <b>-іти</b> use the vowel <b>-и-</b> and always keep <b>-ть</b> in the "he / she" form:<ul><li><b>говори́ти</b> (to speak): я <b>говорю́</b>, ти <b>гово́риш</b>, він/вона́ <b>гово́рить</b>, ми <b>гово́римо</b>, ви <b>гово́рите</b>, вони́ <b>гово́рять</b>.</li><li>If the verb stem ends in <b>б, п, в, м</b> (like <b>люби́ти</b> "to love" or <b>роби́ти</b> "to do"), an <b>-л-</b> appears in BOTH "I" and "they": я <b>люблю́</b>, ти <b>лю́биш</b>, він <b>лю́бить</b>, вони́ <b>лю́блять</b>; я <b>роблю́</b>, вони́ <b>ро́блять</b>!</li></ul>',
      '<b>4. The Super-Simple Past Tense (-в, -ла, -ло, -ли)</b>: To talk about the past, simply take the infinitive (e.g. <b>чита́ти</b>, <b>працюва́ти</b>, <b>бу́ти</b>), drop <b>-ти</b>, and add the gender/plural ending:<ul><li>Masculine (я / ти / він): <b>-в</b> (pronounced [w]!) → <b>чита́в, працюва́в, був</b></li><li>Feminine (я / ти / вона́): <b>-ла</b> → <b>чита́ла, працюва́ла, була́</b></li><li>Neuter (воно́): <b>-ло</b> → <b>було́</b></li><li>Plural (ми / ви / вони́): <b>-ли</b> → <b>чита́ли, працюва́ли, були́</b></li></ul>',
      '<b>5. When Present-Tense «є» Is Kept & The Habitual Verb «бува́ти»</b>:<ul><li>Although Ukrainian normally omits "am/is/are" in the present tense, the verb form <b>є</b> IS explicitly used when emphasizing existence, asking whether something is available, or giving a short affirmative reply: <b>Чи тут є словни́к? — Так, є!</b> (Is there a dictionary here? — Yes, there is!).</li><li>From <b>бу́ти</b> (to be), Ukrainian also forms the frequentative verb <b>бува́ти</b> (я <b>бува́ю</b>, ти <b>бува́єш</b>, він/вона́ <b>бува́є</b>), which means "to visit/be somewhere occasionally" or "it happens sometimes": <b>Ми ча́сто бува́ємо в теа́трі</b> (We often go to / attend the theater), <b>Уся́ке бува́є!</b> (All sorts of things happen!).</li></ul>',
      '<b>6. «могти́» vs. «умі́ти», «ма́ти + Infinitive», & Present Tense for "Have Been Doing"</b>:<ul><li><b>Physical Possibility («могти́») vs. Learned Skill («умі́ти / вмі́ти»)</b>: Use <b>могти́</b> (я <b>мо́жу</b>, ти <b>мо́жеш</b>, вони́ <b>мо́жуть</b>) for circumstantial possibility ("can / be able to right now": <i>Я мо́жу прийти́ о п’я́тій</i>), and <b>умі́ти / вмі́ти</b> (я <b>вмі́ю</b>, ти <b>вмі́єш</b>) for a learned skill ("know how to": <i>Вона́ чу́дово вмі́є пла́вати й готува́ти</i>).</li><li><b>Scheduled Obligation («ма́ти + Infinitive»)</b>: When <b>ма́ти</b> is followed by an infinitive verb instead of a noun, it means "have to / am supposed to": <b>Ви́бачте, я вже ма́ю йти додо́му</b> ("I have to go home now").</li><li><b>Present Tense for Ongoing Duration ("Have Been Doing")</b>: Where English uses the Present Perfect Continuous ("I have been studying Ukrainian for two years"), Ukrainian uses the <b>Present Tense</b> with <b>вже</b> and NO preposition for "for": <b>Я вивча́ю украї́нську мо́ву вже два ро́ки</b>; <b>Ми живемо́ в Ки́єві вже три мі́сяці</b>.</li></ul>',
      '<b>7. Positional Verbs of Placement (стоя́ти, лежа́ти, сиді́ти, висі́ти) — Why Ukrainian Plates "Stand" and Books "Lie"!</b>:<ul><li>Instead of a generic "is on the table", Ukrainian vividly describes an object’s posture using four Group II verbs:<ul><li><b>стоя́ти</b> (стої́ть, стоя́ть = to stand): used for people standing AND for upright objects with a base or legs—<b>стіл, стіле́ць, ша́фа, ла́мпа, ва́за, ча́шка, скля́нка, тарі́лка, пля́шка, телеві́зор, взуття́ стої́ть</b>!</li><li><b>лежа́ти</b> (лежи́ть, лежа́ть = to lie flat): used for flat or horizontal items—<b>кни́жка, зо́шит, газе́та, лист, ру́чка, оліве́ць, ніж, виде́лка, ло́жка, скате́рка, ки́лим, хліб лежи́ть</b>.</li><li><b>висі́ти</b> (виси́ть, вися́ть = to hang): used for items suspended on a wall or hook—<b>карти́на, портре́т, рушни́к, лю́стра виси́ть</b>; clothes in a closet also "hang" (<b>Су́кня й па́льто вися́ть у ша́фі</b>).</li><li><b>сиді́ти</b> (я <b>сиджу́</b> [dʒ], ти <b>сиди́ш</b>, він <b>сиди́ть</b>, вони́ <b>сидя́ть</b> = to sit): used for seated people, birds, or animals.</li></ul></li><li><b>«на столі́» vs. «у столі́»</b>: Note that <b>Кни́жка лежи́ть на столі́</b> means "The book is lying <i>on top of</i> the desk (зве́рху)", whereas <b>Зо́шит лежи́ть у столі́</b> means "The notebook is lying <i>inside the desk drawer</i> (всере́дині)"!</li></ul>',
      '<b>8. The 3rd-Plural Link-Vowel Shortcut, Phase Verbs (+ Imperfective Infinitive), & "Tried in Vain" («так і не»)</b>:<ul><li><b>How the "They" Form Predicts Every Other Ending</b>: If you know the 3rd-person plural ("вони́") of any Ukrainian verb, you automatically know its conjugation group and link vowel!<ul><li>If <b>вони́</b> ends in <b>-уть / -ють</b> → it is <b>1st Conjugation</b> and uses the link vowel <b>-е- / -є-</b> in ти, він/вона́, ми, ви: <i>писа́ти → вони́ пи́ш<b>уть</b> → ти пи́ш<b>еш</b>, він пи́ш<b>е</b>, ми пи́ш<b>емо</b>, ви пи́ш<b>ете</b></i>; <i>чита́ти → вони́ чита́<b>ють</b> → ти чита́<b>єш</b>, він чита́<b>є</b></i>.</li><li>If <b>вони́</b> ends in <b>-ать / -ять</b> → it is <b>2nd Conjugation</b> and uses the link vowel <b>-и- / -ї-</b>: <i>крича́ти → вони́ крич<b>а́ть</b> → ти крич<b>и́ш</b>, він крич<b>и́ть</b></i>; <i>стоя́ти → вони́ сто<b>я́ть</b> → ти сто<b>ї́ш</b>, він сто<b>ї́ть</b></i>.</li></ul></li><li><b>Phase Verbs Always Take an Imperfective Infinitive</b>: Verbs that mark the start, continuation, or end of an activity—<b>почина́ти / поча́ти</b> (to begin), <b>продо́вжувати / продо́вжити</b> (to continue), <b>закі́нчувати / закі́нчити</b> (to finish), <b>перестава́ти / переста́ти</b> (to stop)—are ALWAYS followed by an <b>imperfective infinitive</b>: <b>Ми почали́ вивча́ти украї́нську мо́ву</b> (never <i>*почали́ ви́вчити</i>!).</li><li><b>Expressing Unsuccessful Effort («довго роби́в, але́ так і не зроби́в»)</b>: Pair an imperfective past verb of effort with <b>але́ так і не + perfective past</b> to say someone tried for a long time but never succeeded: <b>Він три ра́зи вступа́в до університе́ту, але́ так і не вступи́в</b>.</li></ul>',
      '<b>9. Complete Second Conjugation Subgroup System & The «я / ти» Mutation Diagnostic Rule</b>:<ul><li><b>Five Subgroups of the Second Conjugation</b> (all share <b>-иш, -ить, -имо, -ите</b> except vowel stems in <b>-їш, -їть, -їмо, -їте</b>):<ul><li><b>1) Stems in л, н, р</b> (<i>говори́ти, кури́ти, голи́тися, жури́тися</i>): take <b>-ю</b> in <i>я</i> and <b>-ять</b> in <i>вони́</i> (<b>я гово́рю, вони́ гово́рять</b>).</li><li><b>2) Stems in hushers ж, ч, ш, щ</b> (<i>ба́чити, лежа́ти, мовча́ти, крича́ти, ва́жити, спіши́ти, ті́шитися, ска́ржитися, вчи́тися</i>, plus <b>бі́гти → біж-</b>): take <b>-у</b> in <i>я</i> and <b>-ать</b> in <i>вони́</i> (<b>я ба́чу, вони́ ба́чать; я біжу́, вони́ біжа́ть</b>).</li><li><b>3) Stems in labials б, в, м, п, ф</b> (<i>роби́ти, люби́ти, спа́ти, диви́тися, ломи́ти, губи́ти</i>): insert <b>-л-</b> in BOTH <i>я</i> and <i>вони́</i> (<b>я роблю́, вони́ ро́блять; я сплю, вони́ сплять</b>).</li><li><b>4) Stems in dentals д, з, с, т</b> (<i>сиді́ти, леті́ти, плати́ти, проси́ти, му́сити, ходи́ти, ї́здити, носи́ти, вози́ти</i>): mutate the consonant <b>ONLY in the «я» form</b> (<b>д→дж, зд→ждж, з→ж, с→ш, т→ч</b>) and return to the original consonant for <i>ти</i> and <i>вони́</i> (<b>я сиджу́, ти сиди́ш, вони́ сидя́ть; я плачу́, ти пла́тиш, вони́ пла́тять; я му́шу, ти му́сиш; я ї́жджу, ти ї́здиш</b>).</li><li><b>5) Vowel Stems</b> (<i>стоя́ти, боя́тися</i>): take <b>-ю, -їш, -їть, -їмо, -їте, -ять</b> (<b>я стою́, ти стої́ш, вони́ стоя́ть; я бою́ся, ти бої́шся</b>).</li></ul></li><li><b>The Golden «я / ти» Diagnostic Rule (1st vs. 2nd Conjugation)</b>: When a verb has a consonant mutation in <b>я</b>, check the <b>ти</b> form!<ul><li>If the mutated consonant <b>stays in «ти»</b> (and all persons), it is a <b>First Conjugation</b> verb: <b>писа́ти → я пишу́, ти пи́шеш, вони́ пи́шуть</b>; <b>каза́ти → я кажу́, ти ка́жеш</b>; <b>пла́кати → я пла́чу, ти пла́чеш</b>; <b>шепта́ти → я шепчу́, ти ше́пчеш</b>.</li><li>If the mutated consonant <b>disappears in «ти»</b>, it is a <b>Second Conjugation</b> verb: <b>сиді́ти → я сиджу́, ти сиди́ш, вони́ сидя́ть</b>; <b>проси́ти → я прошу́, ти про́сиш, вони́ про́сять</b>!</li></ul></li></ul>',
    ],
    structuredLesson: {
      bigIdea: {
        headline: 'Master Everyday Ukrainian Verbs: Present Conjugations I & II, the «-увати → -ую» Shortcut, and the 4-Ending Past Tense',
        body: 'In the dictionary, Ukrainian verbs end in «-ти» (the infinitive, like чита́ти "to read" or говори́ти "to speak"). In the present tense, every Ukrainian verb belongs to one of two families based on its link vowel: Conjugation I (the «-е- / -є-» family, where "he/she" ends in a clean vowel «він чита́є» with NO -ть!) and Conjugation II (the «-и- / -ї-» family, where "he/she" always keeps «-ть»: «він гово́рить»). And the Past Tense is even simpler—instead of changing by person (I/you/he), it just takes four gender/plural endings («-в, -ла, -ло, -ли»)!',
        keyTerms: [
          {
            term: 'Infinitive (Інфініти́в / Неозна́чена фо́рма)',
            plainEnglish: 'The base dictionary form of a verb ending in -ти ("to read" = чита́ти, "to work" = працюва́ти, "to speak" = говори́ти).',
          },
          {
            term: 'First Conjugation (І дієвідмі́на — Link Vowel «-е- / -є-»)',
            plainEnglish: 'Verbs whose 3rd-person plural ("they") ends in -уть / -ють. Their "he/she" form ends in a bare vowel -е or -є (він чита́є, він працю́є, він пи́ше, він живе́)—never with -ть!',
          },
          {
            term: 'Second Conjugation (ІІ дієвідмі́на — Link Vowel «-и- / -ї-»)',
            plainEnglish: 'Verbs whose 3rd-person plural ("they") ends in -ать / -ять. Their "he/she" form always ends in -ить or -їть (він гово́рить, він ро́бить, він стої́ть).',
          },
          {
            term: 'Gender-Based Past Tense (-в, -ла, -ло, -ли)',
            plainEnglish: 'Formed directly from the infinitive by dropping -ти and adding -в (masculine), -ла (feminine), -ло (neuter), or -ли (plural for all genders).',
          },
        ],
      },
      seeItInAction: [
        {
          uk: 'За́раз я <mark class="vc-highlight">чита́ю</mark> кни́жку, мій брат <mark class="vc-highlight">слу́хає</mark> му́зику, а батьки́ <mark class="vc-highlight">працю́ють</mark>.',
          en: 'Right now I am reading a book, my brother is listening to music, and my parents are working.',
          highlightNote: 'Notice Conjugation I: bare vowel «-є» in «слу́хає», and «працюва́ти» dropping -ва- to become «працю́ють»!',
        },
        {
          uk: 'Я ду́же <mark class="vc-highlight">люблю́</mark> ка́ву, мій друг <mark class="vc-highlight">гово́рить</mark> украї́нською, і ми ра́зом <mark class="vc-highlight">ро́бимо</mark> впра́ви.',
          en: 'I really love coffee, my friend speaks Ukrainian, and together we do exercises.',
          highlightNote: 'Conjugation II uses link vowel «-и-» and keeps «-ть» in «гово́рить». Labial stems like люби́ти add -л- in я люблю́ and вони́ лю́блять.',
        },
        {
          uk: 'Учо́ра Оле́на <mark class="vc-highlight">працюва́ла</mark> вдо́ма, Тара́с <mark class="vc-highlight">був</mark> у Льво́ві, а ми <mark class="vc-highlight">гуля́ли</mark> в па́рку.',
          en: 'Yesterday Olena worked at home, Taras was in Lviv, and we walked in the park.',
          highlightNote: 'Past tense simply swaps -ти for -в [w] (m.), -ла (f.), -ло (n.), or -ли (pl.)!',
        },
      ],
      visualTables: [
        {
          title: '1. The Two Present-Tense Conjugation Families Side by Side',
          subtitle: 'Compare how Conjugation I (-е-/-є- link vowel, -уть/-ють in вони́) differs from Conjugation II (-и-/-ї- link vowel, -ать/-ять in вони́).',
          headers: ['Person / Pronoun', 'Conj. I: -ати (чита́ти)', 'Conj. I: -увати → -ую (працюва́ти)', 'Conj. II: -ити (говори́ти)', 'Conj. II: Labial + л (роби́ти)'],
          rows: [
            ['<b>я</b> (I)', '<b class="uk-text">чита́ю</b>', '<b class="uk-text">працю́ю</b> (drops -ва-!)', '<b class="uk-text">говорю́</b>', '<b class="uk-text">роблю́</b> (adds -л-!)'],
            ['<b>ти</b> (you — inf.)', '<b class="uk-text">чита́єш</b>', '<b class="uk-text">працю́єш</b>', '<b class="uk-text">гово́риш</b>', '<b class="uk-text">ро́биш</b>'],
            ['<b>він / вона́ / воно́</b>', '<b class="uk-text">чита́є</b> (NO -ть!)', '<b class="uk-text">працю́є</b> (NO -ть!)', '<b class="uk-text">гово́рить</b> (keeps -ть!)', '<b class="uk-text">ро́бить</b> (keeps -ть!)'],
            ['<b>ми</b> (we)', '<b class="uk-text">чита́ємо</b>', '<b class="uk-text">працю́ємо</b>', '<b class="uk-text">гово́римо</b>', '<b class="uk-text">ро́бимо</b>'],
            ['<b>ви</b> (you — pol./pl.)', '<b class="uk-text">чита́єте</b>', '<b class="uk-text">працю́єте</b>', '<b class="uk-text">гово́рите</b>', '<b class="uk-text">ро́бите</b>'],
            ['<b>вони́</b> (they — Diagnostic!)', '<b class="uk-text">чита́ють</b> (<b>-ють</b>)', '<b class="uk-text">працю́ють</b> (<b>-ють</b>)', '<b class="uk-text">гово́рять</b> (<b>-ять</b>)', '<b class="uk-text">ро́блять</b> (adds -л- + <b>-ять</b>!)'],
          ],
          footnote: 'Shortcut: If "вони́" ends in -уть/-ють, the link vowel is ALWAYS -е-/-є-. If "вони́" ends in -ать/-ять, the link vowel is ALWAYS -и-/-ї-!',
        },
        {
          title: '2. The Super-Simple Past Tense («-в, -ла, -ло, -ли»)',
          subtitle: 'Drop «-ти» from the infinitive and match the gender or plural of the subject.',
          headers: ['Subject Gender / Number', 'Ending', 'чита́ти (to read)', 'працюва́ти (to work)', 'бу́ти (to be)', 'жи́ти (to live)'],
          rows: [
            ['<b>Masculine</b> (я, ти, він)', '<b class="uk-text">-в</b> <code>[w]</code>', '<b class="uk-text">чита́в</b>', '<b class="uk-text">працюва́в</b>', '<b class="uk-text">був</b>', '<b class="uk-text">жив</b>'],
            ['<b>Feminine</b> (я, ти, вона́)', '<b class="uk-text">-ла</b>', '<b class="uk-text">чита́ла</b>', '<b class="uk-text">працюва́ла</b>', '<b class="uk-text">була́</b>', '<b class="uk-text">жила́</b>'],
            ['<b>Neuter</b> (воно́)', '<b class="uk-text">-ло</b>', '<b class="uk-text">чита́ло</b>', '<b class="uk-text">працюва́ло</b>', '<b class="uk-text">було́</b>', '<b class="uk-text">жило́</b>'],
            ['<b>Plural — ALL</b> (ми, ви, вони́)', '<b class="uk-text">-ли</b>', '<b class="uk-text">чита́ли</b>', '<b class="uk-text">працюва́ли</b>', '<b class="uk-text">були́</b>', '<b class="uk-text">жили́</b>'],
          ],
          footnote: 'Pronunciation reminder: Always pronounce masculine past-tense «-в» as a rounded English "w" [w] (чита́в [tʃɪtɑ́w], був [buw]). Also note that polite singular «Ви» takes the plural verb form (-ли) even for one person!',
        },
        {
          title: '3. Positional Verbs of Placement: Why Ukrainian Plates "Stand" and Books "Lie"',
          subtitle: 'Instead of a generic "is on the table", Ukrainian chooses one of four Group II verbs based on the object’s physical posture.',
          headers: ['Positional Verb', 'Present Forms (він / вони́)', 'What Uses This Posture', 'Natural Ukrainian Example'],
          rows: [
            [
              '<b class="uk-text">стоя́ти</b> (to stand)',
              '<b class="uk-text">стої́ть / стоя́ть</b> (я стою́, ти стої́ш)',
              'Standing people AND upright objects with a base, legs, or bottom (furniture, dishes, bottles, lamps, shoes)',
              '<b class="uk-text">На столі́ стої́ть ва́за, ча́шка, скля́нка і тарі́лка. У кімна́ті стої́ть стіл і ша́фа.</b>',
            ],
            [
              '<b class="uk-text">лежа́ти</b> (to lie flat)',
              '<b class="uk-text">лежи́ть / лежа́ть</b> (я лежу́, ти лежи́ш)',
              'Reclining people AND flat/horizontal items without a standing base (books, papers, pens, cutlery, rugs, bread)',
              '<b class="uk-text">Кни́жка лежи́ть на столі́ (on top), а зо́шит лежи́ть у столі́ (inside the drawer).</b>',
            ],
            [
              '<b class="uk-text">висі́ти</b> (to hang)',
              '<b class="uk-text">виси́ть / вися́ть</b> (я вишу́, ти виси́ш)',
              'Objects suspended on a wall, ceiling, hook, or hanger',
              '<b class="uk-text">На стіні́ виси́ть карти́на, а су́кня й па́льто вися́ть у ша́фі.</b>',
            ],
            [
              '<b class="uk-text">сиді́ти</b> (to sit)',
              '<b class="uk-text">сиди́ть / сидя́ть</b> (я сиджу́ [dʒ], ти сиди́ш)',
              'Seated people, birds, or animals',
              '<b class="uk-text">Ми сидимо́ в затишні́й кав’я́рні й п’ємо́ ка́ву.</b>',
            ],
          ],
        },
      ],
      conjugations: [
        {
          title: 'Interactive Conjugation Explorer: High-Frequency Present & Past Verbs',
          subtitle: 'Click any verb to inspect its full Present and Past Tense forms, stem changes, and stress.',
          verbs: [
            {
              infinitive: 'писа́ти',
              translation: 'to write (Conj. I: с → ш in ALL persons)',
              aspect: 'Imperfective',
              conjugationClass: '1st Conj. (-е-)',
              forms: {
                я: 'пишу́',
                ти: 'пи́шеш',
                'він/вона́': 'пи́ше',
                ми: 'пи́шемо',
                ви: 'пи́шете',
                вони́: 'пи́шуть',
                past: 'писа́в / писа́ла / писа́ли',
              },
              stemNote: 'Notice that с → ш stays across ALL 6 persons (я пишу́, ти пи́шеш, вони́ пи́шуть)—the hallmark of a 1st Conjugation consonant mutation!',
            },
            {
              infinitive: 'сиді́ти',
              translation: 'to sit (Conj. II: д → дж ONLY in «я»)',
              aspect: 'Imperfective',
              conjugationClass: '2nd Conj. (-и-)',
              forms: {
                я: 'сиджу́ [dʒ]',
                ти: 'сиди́ш',
                'він/вона́': 'сиди́ть',
                ми: 'сидимо́',
                ви: 'сидите́',
                вони́: 'сидя́ть',
                past: 'сиді́в / сиді́ла / сиді́ли',
              },
              stemNote: 'In 2nd Conjugation dental stems (д, т, з, с), the consonant mutates ONLY in «я» (сиджу́) and returns to д in ти сиди́ш, вони́ сидя́ть!',
            },
            {
              infinitive: 'жи́ти',
              translation: 'to live (Conj. I: stem жив-)',
              aspect: 'Imperfective',
              conjugationClass: '1st Conj. (-е-)',
              forms: {
                я: 'живу́',
                ти: 'живе́ш',
                'він/вона́': 'живе́',
                ми: 'живемо́',
                ви: 'живете́',
                вони́: 'живу́ть',
                past: 'жив / жила́ / жили́',
              },
              stemNote: 'Adds -в- to the stem in the present tense (живу́, живе́ш).',
            },
            {
              infinitive: 'пи́ти',
              translation: 'to drink (Conj. I with apostrophe)',
              aspect: 'Imperfective',
              conjugationClass: '1st Conj. (-є-)',
              forms: {
                я: 'п’ю',
                ти: 'п’єш',
                'він/вона́': 'п’є',
                ми: 'п’ємо́',
                ви: 'п’єте́',
                вони́: 'п’ють',
                past: 'пив / пила́ / пили́',
              },
              stemNote: 'All present-tense forms are written with an apostrophe after п before ю/є.',
            },
            {
              infinitive: 'ї́сти',
              translation: 'to eat (Archaic Athematic Conjugation)',
              aspect: 'Imperfective',
              conjugationClass: 'Special (їм / їси́)',
              forms: {
                я: 'їм',
                ти: 'їси́',
                'він/вона́': 'їсть',
                ми: 'їмо́',
                ви: 'їсте́',
                вони́: 'їдя́ть',
                past: 'їв / ї́ла / ї́ли',
              },
              stemNote: 'One of the four classic athematic verbs (alongside да́ти, відповісти́, бу́ти). Memorize я їм, ти їси́, він їсть, вони́ їдя́ть!',
            },
          ],
        },
      ],
      diagrams: [
        {
          title: 'The Golden «я / ти» Mutation Diagnostic Rule (1st vs. 2nd Conjugation)',
          subtitle: 'When a verb mutates its consonant in the «я» form, check the «ти» form to know its entire conjugation!',
          type: 'comparison',
          nodes: [
            {
              label: 'Mutation STAYS in «ти» → 1st Conj. (-е-)',
              value: 'писа́ти → я пишу́, ти пи́шеш, вони́ пи́шуть',
              description: 'Also каза́ти (я кажу́, ти ка́жеш), пла́кати (я пла́чу, ти пла́чеш), хоті́ти (я хо́чу, ти хо́чеш). The mutated husher stays in all 6 persons!',
            },
            {
              label: 'Mutation DISAPPEARS in «ти» → 2nd Conj. (-и-)',
              value: 'сиді́ти → я сиджу́, ти сиди́ш, вони́ сидя́ть',
              description: 'Also плати́ти (я плачу́, ти пла́тиш), проси́ти (я прошу́, ти про́сиш), ходи́ти (я ходжу́, ти хо́диш). Only «я» mutates!',
            },
          ],
        },
        {
          title: 'Nuances of Ability, Obligation & Ongoing Duration',
          subtitle: 'Three high-utility verb patterns where Ukrainian works differently from English.',
          type: 'flow',
          nodes: [
            {
              label: 'могти́ vs. умі́ти (вмі́ти)',
              value: 'мо́жу (circumstance) • вмі́ю (learned skill)',
              description: 'Я мо́жу прийти́ о п’я́тій (I can / am free to come at 5) vs. Вона́ вмі́є пла́вати й готува́ти (She knows how to swim and cook).',
            },
            {
              label: 'ма́ти + Infinitive',
              value: 'Я вже ма́ю йти додо́му',
              description: 'When ма́ти (to have) is followed by a verb, it means "have to / am supposed to" (scheduled duty).',
            },
            {
              label: 'Present Tense + вже ("Have Been Doing")',
              value: 'Я вивча́ю украї́нську вже два ро́ки',
              description: 'For an action that started in the past and continues right now, Ukrainian uses the Present Tense + вже with NO preposition for "for"!',
            },
          ],
        },
      ],
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Check Whether the Verb Ends in «-увати / -ювати»',
          explanation: 'If the infinitive ends in -увати or -ювати (працюва́ти, готува́ти, купува́ти, подорожува́ти), drop -ва- in the present tense and add -ю, -єш, -є, -ємо, -єте, -ють!',
          examples: [
            { uk: 'працюва́ти → я працю́ю, ти працю́єш, він працю́є • купува́ти → я купу́ю', en: 'to work → I work • to buy → I buy' },
          ],
        },
        {
          stepNumber: 2,
          title: 'Distinguish 3rd-Person Singular: Bare «-є / -е» (Group I) vs. «-ить / -їть» (Group II)',
          explanation: 'Never put -ть on a Group I "he/she" verb (він чита́є, вона́ працю́є, він живе́), and always keep -ть on a Group II "he/she" verb (він гово́рить, вона́ ро́бить, він стої́ть).',
          examples: [
            { uk: 'Він чита́є і працю́є (Conj. I) vs. Він гово́рить і ро́бить (Conj. II).', en: 'He reads and works vs. He speaks and does.' },
          ],
        },
        {
          stepNumber: 3,
          title: 'Form the Past Tense by Gender and Number (-в, -ла, -ло, -ли)',
          explanation: 'Go back to the full infinitive (including -ва- in працюва́ти!), take off -ти, and attach -в (male), -ла (female), -ло (neuter), or -ли (plural).',
          examples: [
            { uk: 'Він працюва́в • Вона́ працюва́ла • Вони́ працюва́ли', en: 'He worked • She worked • They worked' },
          ],
        },
      ],
      moreExamples: [
        {
          uk: 'Я <mark class="vc-highlight">вивча́ю</mark> украї́нську мо́ву <mark class="vc-highlight">вже два ро́ки</mark> і <mark class="vc-highlight">вмі́ю</mark> чита́ти книжки́, але́ за́раз уже́ <mark class="vc-highlight">ма́ю йти</mark>.',
          en: 'I have been studying Ukrainian for two years and know how to read books, but right now I already have to go.',
          highlightNote: 'Combines Present Tense + вже for ongoing duration ("have been studying"), вмі́ю for a learned skill, and ма́ю + infinitive for "have to".',
        },
        {
          uk: 'Ми <mark class="vc-highlight">почали́ чита́ти</mark> цю статтю́ вранці; я до́вго <mark class="vc-highlight">шука́в</mark> словни́к, але́ <mark class="vc-highlight">так і не знайшо́в</mark> його́.',
          en: 'We started reading this article in the morning; I looked for the dictionary for a long time, but never found it.',
          highlightNote: 'Phase verbs (поча́ти, продо́вжити, закі́нчити) ALWAYS take an imperfective infinitive (чита́ти), and «довго роби́в, але́ так і не зроби́в» expresses trying in vain.',
        },
      ],
      exceptionsAndEdgeCases: [
        {
          ruleTitle: 'Phase Verbs («поча́ти, продо́вжити, закі́нчити, переста́ти») Always Take Imperfective Infinitives',
          ruleExplanation: 'Whenever a verb marks the start, continuation, or stopping of an action, the following infinitive MUST be imperfective:',
          exceptions: [
            {
              item: 'Ми почали́ вивча́ти украї́нську мо́ву. Вона́ продо́вжила чита́ти. Він закі́нчив працюва́ти.',
              note: 'Never use a perfective infinitive (*почали́ ви́вчити, *закі́нчив попрацюва́ти) after a phase verb!',
            },
          ],
        },
        {
          ruleTitle: 'When Present-Tense «є» Is Retained & Habitual «бува́ти»',
          ruleExplanation: 'While «є» is omitted in ordinary copular statements, Ukrainian keeps «є» for emphatic existence/availability and uses «бува́ти» for habitual attendance:',
          exceptions: [
            {
              item: 'Чи тут є словни́к? — Так, є! / Ми ча́сто бува́ємо в теа́трі.',
              note: '«бува́ти» (бува́ю, бува́єш, бува́є) means "to visit/be somewhere occasionally" or "to happen sometimes" («Уся́ке бува́є!»).',
            },
          ],
        },
      ],
      commonMistakes: [
        {
          mistake: 'Adding «-ть» to 3rd-person singular Conjugation I verbs (*він чита́єть, *вона́ працю́єть)',
          wrongUk: '*Він чита́єть кни́жку, *вона́ працю́єть удо́ма.',
          correctUk: 'Він чита́є кни́жку, вона́ працю́є вдо́ма.',
          explanation: 'In Conjugation I, the "he/she" form ends in a pure vowel (-є or -е) with NO -ть! Only Conjugation II (-ить/-їть) and 3rd-person plural (-уть/-ють/-ать/-ять) end in -ть.',
        },
        {
          mistake: 'Keeping «-ва-» in the present tense of «-увати» verbs (*я працюва́ю, *ми купува́ємо)',
          wrongUk: '*Я працюва́ю, *ми готува́ємо.',
          correctUk: 'Я працю́ю, ми готу́ємо. (Past tense keeps -ва-: працюва́в, готува́ли!)',
          explanation: 'In the present tense, the suffix -увати/-ювати always contracts to -ую, -уєш, -ує.',
        },
        {
          mistake: 'Using the Past Tense for an action that started in the past and is STILL happening ("I have been living here for two years")',
          wrongUk: '*Я жив у Ки́єві вже два ро́ки (when you still live in Kyiv!).',
          correctUk: 'Я живу́ в Ки́єві вже два ро́ки.',
          explanation: 'If the action is still going on right now, Ukrainian uses the Present Tense + вже!',
        },
      ],
      inlineChecks: [
        {
          id: 'a12-check-1',
          question: 'Which sentence has the correct 3rd-person singular ("he/she") forms for «чита́ти» (Conj. I) and «говори́ти» (Conj. II)?',
          options: [
            'Вона́ чита́єть і гово́рить.',
            'Вона́ чита́є і гово́рить.',
            'Вона́ чита́є і гово́ре.',
          ],
          correctIndex: 1,
          explanation: 'Conjugation I drops -ть in the 3rd-person singular (вона́ чита́є), while Conjugation II keeps -ть (вона́ гово́рить).',
        },
        {
          id: 'a12-check-2',
          question: 'Why does Ukrainian say «На столі́ стої́ть тарі́лка, а поруч лежи́ть кни́жка»?',
          options: [
            'Objects with a base or bottom (plates, cups, bottles, furniture) "stand" (стої́ть), while flat objects (books, pens, cutlery) "lie" (лежи́ть)',
            'Because тарі́лка is masculine and кни́жка is feminine',
            'Because books cannot be placed on tables',
          ],
          correctIndex: 0,
          explanation: 'Ukrainian positional verbs reflect physical posture: upright/footed items stand (стоя́ти), flat items lie (лежа́ти), and suspended items hang (висі́ти).',
        },
        {
          id: 'a12-check-3',
          question: 'In «я сиджу́, ти сиди́ш, вони́ сидя́ть» vs. «я пишу́, ти пи́шеш, вони́ пи́шуть», what does the «ти» form tell you?',
          options: [
            'When the consonant mutation stays in «ти» (пи́шеш), it is 1st Conjugation; when the mutation disappears in «ти» (сиди́ш), it is 2nd Conjugation',
            'Both verbs belong to the 2nd Conjugation',
            'The «ти» form is irregular in both verbs',
          ],
          correctIndex: 0,
          explanation: 'In 1st Conjugation verbs (писа́ти, каза́ти), the mutated consonant stays across all persons; in 2nd Conjugation dental verbs (сиді́ти, плати́ти, проси́ти), only the «я» form mutates!',
        },
      ],
      completeReference: [
        {
          title: 'Advanced Reference: The Five Subgroups of the Second Conjugation (ІІ дієвідмі́на)',
          summary: 'Expand to view all 5 stem subgroups of Conjugation II and their exact 1st-singular («я») and 3rd-plural («вони́») endings.',
          contentHtml: `
            <p class="mb-2">All Second Conjugation verbs share <b>-иш, -ить, -имо, -ите</b> (or <b>-їш, -їть, -їмо, -їте</b> after a vowel), while their <b>я</b> and <b>вони́</b> forms follow 5 predictable stem rules:</p>
            <table class="vc-table">
              <thead>
                <tr>
                  <th>Subgroup</th>
                  <th>Stem Consonants</th>
                  <th>«я» Ending</th>
                  <th>«вони́» Ending</th>
                  <th>Model Verbs</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>1. Sonorants</b></td>
                  <td><b>л, н, р</b></td>
                  <td><b>-ю</b></td>
                  <td><b>-ять</b></td>
                  <td><b>говори́ти</b> (говорю́, гово́рять), <b>вари́ти</b> (варю́, ва́рять), <b>звони́ти</b></td>
                </tr>
                <tr>
                  <td><b>2. Hushers</b></td>
                  <td><b>ж, ч, ш, щ</b></td>
                  <td><b>-у</b></td>
                  <td><b>-ать</b></td>
                  <td><b>ба́чити</b> (ба́чу, ба́чать), <b>лежа́ти</b> (лежу́, лежа́ть), <b>мовча́ти</b>, <b>вчи́тися</b> (вчу́ся, вча́ться), <b>бі́гти</b> (біжу́, біжа́ть)</td>
                </tr>
                <tr>
                  <td><b>3. Labials</b></td>
                  <td><b>б, п, в, м, ф</b></td>
                  <td><b>-лю</b></td>
                  <td><b>-лять</b></td>
                  <td><b>роби́ти</b> (роблю́, ро́блять), <b>люби́ти</b> (люблю́, лю́блять), <b>спа́ти</b> (сплю, сплять), <b>диви́тися</b> (дивлю́ся, ди́вляться)</td>
                </tr>
                <tr>
                  <td><b>4. Dentals</b></td>
                  <td><b>д, т, з, с, зд, ст</b></td>
                  <td><b>Mutates + -у</b><br>(д→дж, т→ч, з→ж, с→ш, зд→ждж)</td>
                  <td><b>No mutation + -ять</b></td>
                  <td><b>сиді́ти</b> (сиджу́, ти сиди́ш, вони́ сидя́ть), <b>плати́ти</b> (плачу́, ти пла́тиш, вони́ пла́тять), <b>проси́ти</b> (прошу́, про́сять), <b>ходи́ти</b> (ходжу́, хо́дять), <b>ї́здити</b> (ї́жджу, ї́здять)</td>
                </tr>
                <tr>
                  <td><b>5. Vowel Stems</b></td>
                  <td>After a vowel</td>
                  <td><b>-ю</b></td>
                  <td><b>-ять</b> (-їш, -їть)</td>
                  <td><b>стоя́ти</b> (стою́, стої́ш, стої́ть, стоя́ть), <b>боя́тися</b> (бою́ся, бої́шся, боя́ться)</td>
                </tr>
              </tbody>
            </table>
          `,
        },
      ],
      takeaways: [
        'Conjugation I uses link vowel -е-/-є- with NO -ть in "he/she" (він чита́є, вона́ працю́є, вони́ чита́ють), while Conjugation II uses -и-/-ї- and keeps -ть (він гово́рить, вона́ ро́бить, вони́ гово́рять).',
        'Verbs in -увати/-ювати drop -ва- in the present tense (працюва́ти → я працю́ю, купува́ти → я купу́ю).',
        'Past tense drops -ти and adds -в [w] (m.), -ла (f.), -ло (n.), or -ли (pl.): чита́в, чита́ла, чита́ло, чита́ли.',
        'Use стоя́ти for upright/base objects (ча́шка, тарі́лка, стіл стої́ть), лежа́ти for flat objects (кни́жка, ніж лежи́ть), and Present Tense + вже for ongoing duration (Я вивча́ю украї́нську вже два ро́ки).',
      ],
    },
    examples: [
      { uk: 'За́раз я чита́ю кни́жку, а мій брат слу́хає му́зику.', en: 'Right now I am reading a book, and my brother is listening to music.' },
      { uk: 'Де ви працю́єте? — Ми працю́ємо в міжнаро́дній компа́нії.', en: 'Where do you work? — We work at an international company.' },
      { uk: 'Я ду́же люблю́ ка́ву, і мої́ дру́зі також лю́блять ка́ву.', en: 'I really love coffee, and my friends also love coffee.' },
      { uk: 'Учо́ра Оле́на працюва́ла вдо́ма, а Тара́с був у Льво́ві.', en: 'Yesterday Olena worked at home, and Taras was in Lviv.' },
      { uk: 'Чи у вас є нови́й підру́чник? — Так, є! А вве́чері ми інколи бува́ємо в кіно́.', en: 'Do you have the new textbook? — Yes, I do! And in the evening we sometimes go to the cinema.' },
      { uk: 'Я вивча́ю украї́нську мо́ву вже два ро́ки і вмі́ю чита́ти книжки́, але́ за́раз уже́ ма́ю йти.', en: 'I have been studying Ukrainian for two years and know how to read books, but right now I already have to go.' },
      { uk: 'На столі́ стої́ть ва́за з кві́тами й ча́шка, поруч лежи́ть кни́жка, а в ша́фі виси́ть нове́ па́льто.', en: 'On the table stand a vase with flowers and a cup, nearby lies a book, and in the wardrobe hangs a new coat.' },
      { uk: 'Ми почали́ чита́ти цю статтю́ вранці; я до́вго шука́в словни́к, але́ так і не знайшо́в його́.', en: 'We started reading (почали́ + impf. чита́ти) this article in the morning; I looked for the dictionary for a long time, but never found it (так і не знайшо́в).' },
      { uk: 'Я пишу́ листа́, і ти пи́шеш листа́ (І дієвідмі́на), але́ я сиджу́ за столо́м і плачу́ за ка́ву, а ти сиди́ш і пла́тиш (ІІ дієвідмі́на).', en: 'I write a letter and you write a letter (1st Conj. mutation stays in ти пи́шеш), whereas I sit at the table and pay for coffee, and you sit and pay (2nd Conj. mutation only in я сиджу́, плачу́ → ти сиди́ш, пла́тиш).' },
    ],
    dialogue: {
      title: 'Catching Up About Today and Yesterday',
      lines: [
        { speaker: 'Дмитро́', uk: 'Приві́т, А́нно! Що ти за́раз ро́биш?', en: 'Hi, Anna! What are you doing right now?' },
        { speaker: 'А́нна', uk: 'Приві́т! Я обі́даю в кав’я́рні і чита́ю нови́ни. А ти сього́дні працю́єш?', en: 'Hi! I am having lunch at a café and reading the news. Are you working today?' },
        { speaker: 'Дмитро́', uk: 'Ні, я працюва́в учо́ра весь день, тож сього́дні я відпочива́ю.', en: 'No, I worked all day yesterday, so today I am resting.' },
      ],
    },
    activeRecall: [
      { promptEn: 'He reads / is reading (from чита́ти)', answerUk: 'він чита́є', hint: 'Group I 3rd person singular ends in -є (no -ть)' },
      { promptEn: 'I work / am working (from працюва́ти)', answerUk: 'я працю́ю', hint: '-увати changes to -ую in the present tense' },
      { promptEn: 'They love (from люби́ти)', answerUk: 'вони́ лю́блять', hint: 'Labial б adds -л- in both я люблю́ and вони́ лю́блять' },
      { promptEn: 'She worked yesterday (past tense of працюва́ти)', answerUk: 'вона́ працюва́ла', hint: 'Drop -ти and add feminine -ла' },
    ],
    reviewSummary:
      'Group I verbs use -ю, -єш, -є (він чита́є, він працю́є). Group II verbs use -ю, -иш, -ить (він гово́рить, він ро́бить). In the past tense, drop -ти and add -в (masculine), -ла (feminine), -ло (neuter), or -ли (plural).',
    cfu: [
      {
        q: 'What is the correct "he / she" (він / вона́) present-tense form of «чита́ти» (to read) and «працюва́ти» (to work)?',
        opts: [
          'він чита́є, вона́ працю́є (ending in -є with no -ть)',
          'він чита́ти, вона́ працюва́ти',
          'він чита́ють, вона́ працю́ють',
        ],
        ans: 0,
        exp: 'In Conjugation I, the 3rd-person singular (він/вона́) ends in a clean vowel -є: він чита́є, вона́ працю́є.',
      },
      {
        q: 'How does the verb «купува́ти» (to buy) conjugate for «я» (I) in the present tense?',
        opts: ['я купува́ю', 'я купу́ю (the -увати suffix becomes -ую)', 'я купи́в'],
        ans: 1,
        exp: 'Verbs ending in -увати drop -ва- in the present tense: купува́ти → я купу́ю, ти купу́єш, він купу́є.',
      },
      {
        q: 'If a woman says "I was in Kyiv yesterday", which past-tense form of «бу́ти» does she use?',
        opts: ['Я був у Ки́єві.', 'Я була́ в Ки́єві.', 'Я були́ в Ки́єві.'],
        ans: 1,
        exp: 'In the past tense, verbs match the speaker’s gender: a male speaker says «Я був», and a female speaker says «Я була́».',
      },
    ],
    practice: [
      {
        prompt: 'Complete the sentence: «Ми ________ украї́нську мо́ву.» ("We are studying the Ukrainian language" — from вивча́ти):',
        opts: ['вивча́ю', 'вивча́ємо', 'вивча́ють'],
        ans: 1,
        audioUk: 'Ми вивча́ємо украї́нську мо́ву.',
        exp: 'With «ми» (we), Group I verbs end in -ємо: «ми вивча́ємо».',
      },
      {
        prompt: 'Choose the correct present-tense forms of «роби́ти» (to do/make) for «я» and «вони́»:',
        opts: ['я роблю́, вони́ ро́блять', 'я робу́, вони́ ро́бють', 'я ро́биш, вони́ ро́бить'],
        ans: 0,
        audioUk: 'я роблю́, вони́ ро́блять',
        exp: 'Because the stem ends in б, an -л- is added in both the "I" form (я роблю́) and the "they" form (вони́ ро́блять).',
      },
      {
        prompt: 'Complete the sentence: «Він ду́же до́бре ________ украї́нською.» ("He speaks Ukrainian very well" — from говори́ти):',
        opts: ['гово́рить', 'говорю́', 'гово́риш'],
        ans: 0,
        audioUk: 'Він ду́же до́бре гово́рить украї́нською.',
        exp: '«говори́ти» is a Group II verb, so the 3rd-person singular ends in -ить: «він гово́рить».',
      },
      {
        prompt: 'Translate "Yesterday my friends were at the theater" into Ukrainian:',
        opts: ['Учо́ра мої́ дру́зі був у теа́трі.', 'Учо́ра мої́ дру́зі була́ в теа́трі.', 'Учо́ра мої́ дру́зі були́ в теа́трі.'],
        ans: 2,
        audioUk: 'Учо́ра мої́ дру́зі були́ в теа́трі.',
        exp: 'For any plural subject (ми, ви, вони́, дру́зі), the past tense ends in -ли: «були́».',
      },
      {
        prompt: 'What are the "I" and "they" forms of the everyday verb «ї́сти» (to eat)?',
        opts: ['я їм, вони́ їдя́ть', 'я ї́стю, вони́ ї́стять', 'я їв, вони́ ї́ли'],
        ans: 0,
        audioUk: 'я їм, вони́ їдя́ть',
        exp: '«ї́сти» has special present-tense forms: я їм, ти їси́, він/вона́ їсть, ми їмо́, ви їсте́, вони́ їдя́ть.',
      },
    ],
    vocab: [
      ['чита́ти', 'VERB', 'to read (чита́ю, чита́єш, чита́є)', 'Вона́ чита́є кни́жку.', 'She is reading a book.'],
      ['зна́ти', 'VERB', 'to know (зна́ю, зна́єш, зна́є)', 'Я зна́ю цю ву́лицю.', 'I know this street.'],
      ['вивча́ти', 'VERB', 'to study / learn (вивча́ю, вивча́єш)', 'Ми вивча́ємо украї́нську.', 'We are studying Ukrainian.'],
      ['слу́хати', 'VERB', 'to listen (слу́хаю, слу́хаєш)', 'Я слу́хаю подка́ст.', 'I am listening to a podcast.'],
      ['працюва́ти', 'VERB', 'to work (працю́ю, працю́єш, працю́є)', 'Де ти працю́єш?', 'Where do you work?'],
      ['готува́ти', 'VERB', 'to cook / prepare (готу́ю, готу́єш)', 'Та́то готу́є вече́рю.', 'Dad is cooking dinner.'],
      ['купува́ти', 'VERB', 'to buy (купу́ю, купу́єш)', 'Ми купу́ємо сві́жі фру́кти.', 'We are buying fresh fruit.'],
      ['відпочива́ти', 'VERB', 'to rest / relax (відпочива́ю)', 'У неді́лю ми відпочива́ємо.', 'On Sunday we rest.'],
      ['говори́ти', 'VERB', 'to speak / talk (говорю́, гово́риш, гово́рить)', 'Він гово́рить пові́льно.', 'He speaks slowly.'],
      ['роби́ти', 'VERB', 'to do / make (роблю́, ро́биш, ро́блять)', 'Що ти за́раз ро́биш?', 'What are you doing right now?'],
      ['люби́ти', 'VERB', 'to love / like (люблю́, лю́биш, лю́блять)', 'Вони́ лю́блять подорожува́ти.', 'They love traveling.'],
      ['жи́ти', 'VERB', 'to live (живу́, живе́ш, живе́)', 'Я живу́ у Льво́ві.', 'I live in Lviv.'],
      ['ї́сти', 'VERB', 'to eat (їм, їси́, їсть, їдя́ть)', 'Ми ра́зом їмо́ сніда́нок.', 'We eat breakfast together.'],
      ['пи́ти', 'VERB', 'to drink (п’ю, п’єш, п’є, п’ють)', 'Я п’ю зелений чай.', 'I am drinking green tea.'],
      ['вчо́ра', 'ADV', 'yesterday (variant: учо́ра)', 'Вчо́ра ми гуля́ли в па́рку.', 'Yesterday we walked in the park.'],
    ],
    exam: [
      {
        q: 'Which form correctly completes «Ти ________ ка́ву вранці?» ("Do you drink coffee in the morning?" — from пи́ти)?',
        opts: ['п’ю', 'п’єш', 'п’ють'],
        ans: 1,
        exp: '«пи́ти» conjugates with an apostrophe: я п’ю, ти п’єш, він/вона́ п’є, вони́ п’ють.',
      },
      {
        q: 'How do you say "They love Ukrainian music" using «люби́ти»?',
        opts: ['Вони́ лю́блять украї́нську му́зику.', 'Вони́ лю́бить украї́нську му́зику.', 'Вони́ люблю́ украї́нську му́зику.'],
        ans: 0,
        exp: 'For «вони́» (they), «люби́ти» takes the -лять ending: «вони́ лю́блять».',
      },
      {
        q: 'Choose the correct present-tense form for «Я ________ в центрі мі́ста» ("I live in the city center" — from жи́ти):',
        opts: ['жи́ю', 'живу́', 'живе́'],
        ans: 1,
        exp: '«жи́ти» adds -в- in the present tense: я живу́, ти живе́ш, він/вона́ живе́, ми живемо́, вони́ живу́ть.',
      },
      {
        q: 'What is the feminine past-tense form of «чита́ти» (to read)?',
        opts: ['чита́в', 'чита́ла', 'чита́ли'],
        ans: 1,
        exp: 'Drop -ти and add -ла for a feminine subject: «вона́ чита́ла».',
      },
      {
        q: 'How is the final «-в» pronounced in masculine past-tense verbs like «чита́в», «працюва́в», and «був»?',
        opts: ['Like a rounded English "w" [w]', 'Like "f"', 'It is completely silent'],
        ans: 0,
        exp: 'Word-final «-в» in Ukrainian is always pronounced as a bilabial [w] sound, never "f".',
      },
      {
        q: 'What does «Що ти роби́ла вчо́ра вве́чері?» ask (spoken to a woman)?',
        opts: [
          'What are you doing right now?',
          'What did you do yesterday evening?',
          'Where will you work tomorrow?',
        ],
        ans: 1,
        exp: '«роби́ла» is the feminine past tense of «роби́ти» (to do), and «вчо́ра вве́чері» means "yesterday evening".',
      },
    ],
  },
  {
    id: 'A1.3',
    level: 'A1',
    topicTag: 'A1 Beginner • Food, Cafés & The Accusative Case',
    title: 'Ordering Food, Café Conversations & The Accusative Case',
    objectives: [
      'Order food and drinks naturally using «Я хо́чу...», «Я бу́ду...», and «Да́йте, будь ла́ска...».',
      'Understand what a Direct Object is and how the Accusative case works.',
      'Change feminine nouns (-а/-я → -у/-ю) and feminine adjectives (-а/-я → -у/-ю) when they are the direct object of a verb.',
    ],
    summary:
      'Now you are ready for your first grammatical case! In English, word order shows who is doing the action and what is receiving the action ("I am reading a book"). In Ukrainian, the word receiving the action (the Direct Object) takes the Accusative case—and only feminine words change their ending in basic everyday sentences!',
    rules: [
      '<b>1. What Is the Accusative Case (Direct Object)?</b>: When a noun is the direct target of an action verb—such as <b>чита́ю</b> (I read), <b>п’ю</b> (I drink), <b>їм</b> (I eat), <b>купу́ю</b> (I buy), <b>люблю́</b> (I love), or <b>хо́чу</b> (I want)—it is in the <b>Accusative case</b>.',
      '<b>2. The Golden Rule for Feminine Direct Objects (-а → -у, -я → -ю)</b>:<ul><li>When a <b>Feminine noun</b> ending in <b>-а</b> or <b>-я</b> is the direct object, change <b>-а → -у</b> and <b>-я → -ю</b>:<ul><li>Це <b>ка́ва</b> (Subject) → Я п’ю <b>ка́ву</b>. (I am drinking coffee.)</li><li>Це <b>кни́жка</b> (Subject) → Я чита́ю <b>кни́жку</b>. (I am reading a book.)</li><li>Це <b>вода́</b> (Subject) → Да́йте, будь ла́ска, <b>во́ду</b>. (Please give me water.)</li><li>Це <b>пі́сня</b> (Subject) → Ми слу́хаємо <b>пі́сню</b>. (We are listening to a song.)</li></ul></li><li>If a feminine adjective describes that direct object, its ending ALSO changes from <b>-а/-я → -у/-ю</b>: <b>гаря́ча ка́ва → Я п’ю гаря́чу ка́ву</b>; <b>ціка́ва кни́жка → Я чита́ю ціка́ву кни́жку</b>.</li></ul>',
      '<b>3. Good News: Inanimate Masculine, Neuter & Plural Objects Stay the Same!</b>: When the direct object is a non-living <b>Masculine noun</b> (like <b>чай, борщ, хліб, сік</b>), a <b>Neuter noun</b> (like <b>молоко́, я́блуко, меню́</b>), or an inanimate <b>Plural noun</b> (like <b>варе́ники, фру́кти</b>), its ending does NOT change at all!<ul><li>Я п’ю <b>зелений чай</b>. / Я їм <b>смачни́й борщ</b> і <b>варе́ники</b>. / Я купу́ю <b>сві́же молоко́</b>.</li></ul>',
      '<b>4. Polite Café Phrases</b>:<ul><li><b>Я хо́чу замо́вити...</b> = I want to order... (with <b>хоті́ти</b>: я <b>хо́чу</b>, ти <b>хо́чеш</b>, він/вона́ <b>хо́че</b>, ми <b>хо́чемо</b>, ви <b>хо́чете</b>, вони́ <b>хо́чуть</b>)</li><li><b>Да́йте, будь ла́ска, ...</b> = Give me, please, ...</li><li><b>Принесі́ть, будь ла́ска, раху́нок.</b> = Please bring the check.</li><li><b>Чи мо́жна оплати́ти ка́рткою?</b> = Can I pay by card?</li></ul>',
      '<b>5. Asking for "Some" of a Food or Drink (Partitive Genitive)</b>: When you want <i>some</i> of a drink or food (a cup, glass, or portion rather than the whole thing), or after a container word like <b>ча́шка</b> (cup) or <b>скля́нка</b> (glass), Ukrainian uses the <b>Genitive case</b>:<ul><li><b>ча́шка ча́ю / ка́ви</b> (a cup of tea / coffee), <b>скля́нка води́ / молока́</b> (a glass of water / milk), <b>тро́хи цу́кру / ме́ду</b> (a little sugar / honey).</li><li><b>Ви́пий гаря́чого ча́ю!</b> = Drink some hot tea!</li></ul>',
      '<b>6. Animate Accusative (People, Animals & Surnames) & «проси́ти» vs. «пита́ти»</b>:<ul><li><b>Animate Masculine & Plural Nouns</b>: When a direct object refers to a living person or animal, Masculine Singular AND both Masculine and Feminine Plural take the <b>Genitive form</b>: <i>брат → Я ба́чу <b>бра́та</b>; дру́зі → Я запрошу́ю <b>дру́зів</b>; се́стри → Я ба́чу <b>сесте́р</b>; ки́ці → Вона́ году́є <b>киць</b></i>!</li><li><b>Ukrainian Surnames Ending in a Consonant</b>: Surnames ending in a consonant (like <b>Ковальчу́к, Малярчу́к, Моро́з, Ко́валь</b>) decline when referring to a man (<i>Чи мо́жна попроси́ти до телефо́ну <b>па́на Малярчука́</b>?</i>), but remain <b>indeclinable when referring to a woman</b> (<i>Чи мо́жна попроси́ти до телефо́ну <b>па́ні Малярчу́к</b>?</i>).</li><li><b>«проси́ти / попроси́ти» ("ask for / request") vs. «пита́ти / запита́ти» ("ask a question")</b>: Use <b>попроси́ти + Accusative</b> when requesting an item or person (<b>Мо́жна попроси́ти раху́нок?</b>), and <b>запита́ти / спита́ти</b> when asking a question (<b>Запита́й дру́га, чи він лю́бить борщ</b>).</li></ul>',
      '<b>7. Multi-Course Ukrainian Dining («на заку́ску / на пе́рше / на дру́ге / на десе́рт») & Object of Thought or Speech («про + Accusative»)</b>:<ul><li><b>Ordering a Traditional Ukrainian Meal by Course</b>: In a Ukrainian restaurant or home dinner, courses are introduced with <b>на + Accusative</b>:<ul><li><b>на заку́ску</b> = for an appetizer / starter (<i>На заку́ску візьмемо́ овоче́вий сала́т або́ холоде́ць</i>)</li><li><b>на пе́рше</b> = for the first course (soup/borscht: <i>Що ви візьмете́ на пе́рше? — На пе́рше візьму́ черво́ний украї́нський борщ</i>)</li><li><b>на дру́ге</b> = for the main course (<i>А на дру́ге — котле́ту по-ки́ївськи або́ варе́ники зі смета́ною</i>)</li><li><b>на десе́рт / на тре́тє / на соло́дке</b> = for dessert (<i>На десе́рт — моро́зиво, узва́р або́ сві́жа ря́жанка</i>). And to defer to your host’s or waiter’s recommendation, say: <b>Я поклада́юсь на ваш смак!</b> ("I rely on your taste!").</li></ul></li><li><b>Talking & Thinking "About" Someone or Something («про + Accusative»)</b>: Verbs of speech, thought, and memory—<b>говори́ти, розповіда́ти, чита́ти, писа́ти, ду́мати, мрі́яти, зга́дувати, співа́ти</b>—use the preposition <b>про + Accusative</b> ("Про ко́го? Про що?"): <b>Ми чита́ємо кни́жку про Ки́їв і розповіда́ємо про на́шу подо́рож</b>; personal pronouns after <i>про</i> are <b>про ме́не, про те́бе, про ньо́го, про не́ї, про нас, про вас, про них</b>.</li></ul>',
      '<b>8. Definite (Accusative) vs. Indefinite (Genitive) Objects After «пита́ти, шука́ти, хоті́ти» & Going to Fetch («по + Accusative»)</b>:<ul><li><b>Specific ("the") vs. Unspecified ("a/an") Direct Objects</b>: After the verbs <b>пита́ти</b> (to ask), <b>шука́ти</b> (to look for), and <b>хоті́ти</b> (to want), Ukrainian distinguishes whether the object is specific/definite ("the") or unspecified/indefinite ("a/an"):<ul><li><b>Accusative Case (Specific / Definite "the")</b>: <b>Вони́ пита́ють учи́тельку</b> (They are asking <i>the</i> teacher); <b>Вона́ шука́є парасо́лю</b> (She is looking for <i>the</i> umbrella); <b>Жі́нка хо́че ва́зу</b> (The woman wants <i>the</i> vase).</li><li><b>Genitive Case (Unspecified / Indefinite "a / an")</b>: <b>Вони́ пита́ють бібліоте́карки</b> (They are asking <i>a</i> librarian); <b>Вона́ шука́є холоди́льника</b> (She is looking for <i>a</i> refrigerator); <b>Ді́ти хо́чуть ножа́</b> (The children want <i>a</i> knife). (Note: <b>пита́ти у/в + Genitive</b> is also used for "asking someone": <i>пита́ють в учи́тельки</i>.)</li></ul></li><li><b>Going to Fetch or Pick Up («іти́ / ї́хати по + Accusative»)</b>: To say you are going to fetch, buy, or pick up someone or something ("going for milk / going to pick up the children"), use the preposition <b>по + Accusative</b>: <b>Вона́ йде до крамни́ці по молоко́ й хліб</b> (She is going to the store for milk and bread); <b>Він ї́де до шко́ли по діте́й / по асисте́нта</b> (He is driving to school to pick up the children / the assistant).</li></ul>',
    ],
    structuredLesson: {
      bigIdea: {
        headline: 'Meet Your First Grammatical Case: The Accusative Direct Object & Café Ordering',
        body: 'In English, word order is the only thing that tells you who is doing the action and what is receiving it ("I am reading a book"). In Ukrainian, the word that directly receives the action of a verb (the Direct Object) takes a special form called the Accusative case (Знахі́дний відмі́нок). And here is the best news for beginners: for non-living things (food, drinks, books, furniture), ONLY feminine words ending in «-а / -я» change their ending («-а → -у», «-я → -ю»)—inanimate masculine, neuter, and plural nouns stay 100% unchanged!',
        keyTerms: [
          {
            term: 'Direct Object (Прями́й дода́ток)',
            plainEnglish: 'The person or thing that directly receives the action of a verb like "read", "drink", "eat", "buy", "want", or "love" (e.g., "coffee" in "I am drinking coffee").',
          },
          {
            term: 'Accusative Case (Знахі́дний відмі́нок — Кого́? Що?)',
            plainEnglish: 'The grammatical case used for direct objects and after prepositions like про ("about") and на ("for [a course]"). Feminine -а/-я changes to -у/-ю!',
          },
          {
            term: 'Animacy Rule (Істо́та vs. Неісто́та)',
            plainEnglish: 'Ukrainian grammar distinguishes living beings (people and animals) from non-living things. For non-living masculine/plural objects (чай, борщ, варе́ники), Accusative = Nominative. For living masculine/plural beings (брат → бра́та, дру́зі → дру́зів), Accusative borrows the Genitive form!',
          },
          {
            term: 'Partitive Genitive ("Some" of a Food or Drink)',
            plainEnglish: 'When you ask for a portion or container of a food or drink (a cup of tea = ча́шка ча́ю, a glass of water = скля́нка води́, some hot tea = гаря́чого ча́ю), Ukrainian uses the Genitive case.',
          },
        ],
      },
      seeItInAction: [
        {
          uk: 'Я п’ю <mark class="vc-highlight">гаря́чу ка́ву</mark> і чита́ю <mark class="vc-highlight">ціка́ву кни́жку</mark>.',
          en: 'I am drinking hot coffee and reading an interesting book.',
          highlightNote: 'Both the feminine adjective (-а → -у) and the feminine noun (-а → -у) change when they are the direct object: гаря́ча ка́ва → гаря́чу ка́ву!',
        },
        {
          uk: 'Ми замовля́ємо <mark class="vc-highlight">украї́нський борщ</mark>, <mark class="vc-highlight">сві́же молоко́</mark> і <mark class="vc-highlight">варе́ники</mark>.',
          en: 'We are ordering Ukrainian borscht, fresh milk, and varenyky.',
          highlightNote: 'Inanimate masculine (борщ), neuter (молоко́), and plural (варе́ники) direct objects do NOT change their endings at all!',
        },
        {
          uk: 'Да́йте, будь ла́ска, одну́ <mark class="vc-highlight">ча́шку</mark> зе́леного <mark class="vc-highlight">ча́ю</mark> і <mark class="vc-highlight">скля́нку води́</mark>.',
          en: 'Please give me one cup of green tea and a glass of water.',
          highlightNote: 'The containers (ча́шку, скля́нку) are Accusative direct objects of да́йте, while the contents ("of tea", "of water" → ча́ю, води́) take the Partitive Genitive!',
        },
        {
          uk: 'Я ба́чу свого́ <mark class="vc-highlight">бра́та</mark> й запрошу́ю <mark class="vc-highlight">дру́зів</mark>, і ми розповіда́ємо <mark class="vc-highlight">про ціка́ву екску́рсію</mark>.',
          en: 'I see my brother and invite friends, and we talk about the interesting excursion.',
          highlightNote: 'Living masculine/plural objects take the Animate Accusative (брат → бра́та, дру́зі → дру́зів), and «про» ("about") always governs the Accusative!',
        },
      ],
      visualTables: [
        {
          title: '1. Complete Accusative Case Overview (Direct Objects: Кого́? Що?)',
          subtitle: 'See at a glance which nouns and adjectives change in the Accusative case and which stay identical to the dictionary form.',
          headers: ['Gender & Number', 'Does It Change?', 'Nominative (Subject: Хто? Що?)', 'Accusative (Direct Object: Кого́? Що?)'],
          rows: [
            [
              '<b>Feminine Singular in -а / -я</b><br>(Both living & non-living!)',
              '<b>YES!</b><br><b class="uk-text">-а → -у</b>, <b class="uk-text">-я → -ю</b>',
              '<b class="uk-text">гаря́ча ка́ва</b> (hot coffee)<br><b class="uk-text">нова́ пі́сня</b> (new song)<br><b class="uk-text">моя́ сестра́</b> (my sister)',
              'Я п’ю <b class="uk-text">гаря́чу ка́ву</b>.<br>Ми слу́хаємо <b class="uk-text">нову́ пі́сню</b>.<br>Я ба́чу <b class="uk-text">мою́ сестру́</b>.',
            ],
            [
              '<b>Masculine Singular — Inanimate</b><br>(Non-living things)',
              '<b>NO</b> (= Nominative)',
              '<b class="uk-text">зелений чай</b> (green tea)<br><b class="uk-text">смачни́й борщ</b> (tasty borscht)',
              'Я п’ю <b class="uk-text">зелений чай</b>.<br>Ми їмо́ <b class="uk-text">смачни́й борщ</b>.',
            ],
            [
              '<b>Masculine Singular — Animate</b><br>(People & Animals)',
              '<b>YES!</b> (= Genitive:<br>adj. <b class="uk-text">-ого</b>, noun <b class="uk-text">-а/-я</b>)',
              '<b class="uk-text">мій ста́рший брат</b> (my older brother)<br><b class="uk-text">пан Малярчу́к</b> (Mr. Maliarchuk)',
              'Я ба́чу <b class="uk-text">мого́ ста́ршого бра́та</b>.<br>Попросі́ть <b class="uk-text">па́на Малярчука́</b>.',
            ],
            [
              '<b>Neuter Singular</b><br>(All neuter nouns)',
              '<b>NO</b> (= Nominative)',
              '<b class="uk-text">сві́же молоко́</b> (fresh milk)<br><b class="uk-text">нове́ меню́</b> (new menu)',
              'Я купу́ю <b class="uk-text">сві́же молоко́</b>.<br>Принесі́ть <b class="uk-text">нове́ меню́</b>.',
            ],
            [
              '<b>Plural — Inanimate</b><br>(Non-living things)',
              '<b>NO</b> (= Nominative)',
              '<b class="uk-text">смачні́ варе́ники</b> (tasty dumplings)<br><b class="uk-text">ціка́ві книжки́</b> (interesting books)',
              'Ми їмо́ <b class="uk-text">смачні́ варе́ники</b>.<br>Вона́ чита́є <b class="uk-text">ціка́ві книжки́</b>.',
            ],
            [
              '<b>Plural — Animate</b><br>(People & Animals, m. & f.!)',
              '<b>YES!</b> (= Genitive Plural:<br>adj. <b class="uk-text">-их/-іх</b>, noun <b class="uk-text">-ів / -Ø</b>)',
              '<b class="uk-text">мої́ дру́зі</b> (my friends)<br><b class="uk-text">мої́ се́стри</b> (my sisters)<br><b class="uk-text">малі́ ді́ти</b> (small children)',
              'Я запрошу́ю <b class="uk-text">мої́х дру́зів</b>.<br>Я ба́чу <b class="uk-text">мої́х сесте́р</b>.<br>Він ї́де по <b class="uk-text">мали́х діте́й</b>.',
            ],
          ],
          footnote: '3rd-declension feminine nouns ending in a consonant (ніч, сіль, любо́в, річ) also stay unchanged in the Accusative singular: «Я люблю́ цю те́плу о́сінь».',
        },
        {
          title: '2. Ordering a Multi-Course Ukrainian Meal & Essential Café Phrases',
          subtitle: 'How to order course by course («на + Accusative»), request portions, and ask for the check.',
          headers: ['Dining Stage / Situation', 'Ukrainian Formula', 'English Meaning & Grammar Note'],
          rows: [
            ['Appetizer / Starter', '<b class="uk-text">На заку́ску візьмемо́ овоче́вий сала́т або́ холоде́ць.</b>', '<b>на заку́ску</b> (Acc.) = for a starter / appetizer'],
            ['First Course (Soup / Borscht)', '<b class="uk-text">Що ви візьмете́ на пе́рше? — На пе́рше візьму́ черво́ний борщ.</b>', '<b>на пе́рше</b> = for the first course (traditionally soup/borscht)'],
            ['Main Course', '<b class="uk-text">А на дру́ге — котле́ту по-ки́ївськи або́ варе́ники зі смета́ною.</b>', '<b>на дру́ге</b> = for the main/second course (котле́та → Acc. котле́ту)'],
            ['Dessert & Traditional Drinks', '<b class="uk-text">На десе́рт (на тре́тє / на соло́дке) — моро́зиво, узва́р або́ ря́жанка.</b>', '<b>узва́р</b> = dried-fruit compote; <b>ря́жанка</b> = baked fermented milk'],
            ['Trusting the Host / Waiter', '<b class="uk-text">Я поклада́юсь на ваш смак!</b>', '"I rely on your taste / I’ll trust your recommendation!"'],
            ['Ordering a Portion / Container', '<b class="uk-text">Ча́шку ка́ви, скля́нку води́, тро́хи цу́кру й ме́ду.</b>', 'Container in Accusative (ча́шку, скля́нку) + substance in Partitive Genitive (-и/-у/-ю)'],
            ['Paying the Bill', '<b class="uk-text">Принесі́ть, будь ла́ска, раху́нок. Чи мо́жна оплати́ти ка́рткою?</b>', '"Please bring the check. Can I pay by card?"'],
          ],
        },
        {
          title: '3. Prepositions Governing the Accusative: «про» (About), «по» (To Fetch), & Personal Pronouns',
          subtitle: 'Learn the Accusative forms of personal pronouns and how «про» and «по» work.',
          headers: ['Nominative (Subject)', 'Direct Object Accusative', 'After a Preposition (про + Acc. = "about")', 'Everyday Example'],
          rows: [
            ['<b class="uk-text">я / ти</b>', '<b class="uk-text">мене́ / тебе́</b>', '<b class="uk-text">про ме́не / про те́бе</b> (stress shifts!)', '<b class="uk-text">Ти пам’ята́єш про ме́не?</b>'],
            ['<b class="uk-text">він, воно́ / вона́</b>', '<b class="uk-text">його́ / її́</b>', '<b class="uk-text">про ньо́го / про не́ї</b> (adds н-!)', '<b class="uk-text">Ми ча́сто зга́дуємо про ньо́го й про не́ї.</b>'],
            ['<b class="uk-text">ми / ви / вони́</b>', '<b class="uk-text">нас / вас / їх</b>', '<b class="uk-text">про нас / про вас / про них</b> (adds н-!)', '<b class="uk-text">Це ціка́ва стаття́ про них.</b>'],
          ],
        },
      ],
      diagrams: [
        {
          title: 'Definite (Accusative) vs. Indefinite (Genitive) Objects After «пита́ти, шука́ти, хоті́ти»',
          subtitle: 'After verbs of seeking, asking, or wanting, Ukrainian can distinguish "the" (Accusative) from "a/an" (Genitive)!',
          type: 'comparison',
          nodes: [
            {
              label: 'Accusative = Specific / Definite ("THE")',
              value: 'Вона́ шука́є си́ню парасо́лю. Вони́ пита́ють учи́тельку.',
              description: 'She is looking for THE (her specific) blue umbrella. They are asking THE teacher.',
            },
            {
              label: 'Genitive = Unspecified / Indefinite ("A / SOME")',
              value: 'Вона́ шука́є холоди́льника. Ді́ти хо́чуть ножа́.',
              description: 'She is looking for A refrigerator (to buy). The children want A knife. Also used for partitive portions: Ви́пий гаря́чого ча́ю!',
            },
          ],
        },
        {
          title: 'Key Verb & Preposition Contrasts in Module A1.3',
          subtitle: 'Master «проси́ти» vs. «пита́ти», «іти́ по + Accusative», and Ukrainian surname declension.',
          type: 'flow',
          nodes: [
            {
              label: 'проси́ти vs. пита́ти',
              value: 'попроси́ти раху́нок (request) • запита́ти дру́га (ask question)',
              description: 'Use проси́ти / попроси́ти when asking FOR an item or person, and пита́ти / запита́ти when asking a question for information.',
            },
            {
              label: 'іти́ / ї́хати по + Accusative',
              value: 'Вона́ йде по молоко́ • Він ї́де по діте́й',
              description: 'To go fetch, buy, or pick up someone/something uses «по + Accusative» ("going for milk / going to pick up the children").',
            },
            {
              label: 'Consonant Surnames (m. vs. f.)',
              value: 'па́на Малярчука́ (m.) • па́ні Малярчу́к (f. indeclinable!)',
              description: 'Surnames ending in a consonant (-ук, -чук, -енко, -ко, -о́з) decline for men, but never change their ending for women!',
            },
          ],
        },
      ],
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Spot the Direct Object of the Verb',
          explanation: 'Ask yourself: what noun is directly receiving the action of verbs like чита́ю, п’ю, їм, купу́ю, замовля́ю, люблю́, ба́чу, or хо́чу?',
          examples: [
            { uk: 'Я чита́ю [що?] кни́жку. Ми п’ємо́ [що?] гаря́чу ка́ву.', en: 'I am reading [what?] a book. We are drinking [what?] hot coffee.' },
          ],
        },
        {
          stepNumber: 2,
          title: 'Change Feminine «-а / -я» to «-у / -ю» (Both Adjective and Noun!)',
          explanation: 'If the direct object is a feminine noun in -а or -я, swap -а → -у and -я → -ю on both the noun and any describing adjective or possessive.',
          examples: [
            { uk: 'моя́ нова́ су́мка → Я купу́ю мою́ нову́ су́мку. • украї́нська пі́сня → Слу́хаю украї́нську пі́сню.', en: 'my new bag → I buy my new bag. • Ukrainian song → I listen to a Ukrainian song.' },
          ],
        },
        {
          stepNumber: 3,
          title: 'Check Animacy for Masculine & Plural Direct Objects',
          explanation: 'If a masculine or plural direct object is a non-living thing (чай, борщ, варе́ники), leave it unchanged! If it is a living person or animal (брат, друг, дру́зі, се́стри, ді́ти), use the Animate Accusative (= Genitive: бра́та, дру́га, дру́зів, сесте́р, діте́й).',
          examples: [
            { uk: 'Я люблю́ зелений чай (inanimate = unchanged) • Я ба́чу ста́ршого бра́та і дру́зів (animate = Genitive).', en: 'I love green tea • I see my older brother and friends.' },
          ],
        },
      ],
      moreExamples: [
        {
          uk: 'Чи мо́жна <mark class="vc-highlight">попроси́ти</mark> до телефо́ну <mark class="vc-highlight">па́ні Малярчу́к</mark> або́ <mark class="vc-highlight">па́на Малярчука́</mark>?',
          en: 'May I ask for Ms. Maliarchuk or Mr. Maliarchuk to come to the phone?',
          highlightNote: 'Notice «попроси́ти» ("ask for"), indeclinable female surname «па́ні Малярчу́к», and declined male animate Accusative «па́на Малярчука́».',
        },
        {
          uk: 'Вона́ <mark class="vc-highlight">шука́є свою́ си́ню парасо́лю</mark>, а по́тім іде́ до крамни́ці <mark class="vc-highlight">по молоко́ й хліб</mark>.',
          en: 'She is looking for her blue umbrella, and then goes to the shop for milk and bread.',
          highlightNote: 'Soft feminine adjective си́ня → си́ню, парасо́ля → парасо́лю, and «по + Accusative» for going to fetch milk and bread.',
        },
      ],
      exceptionsAndEdgeCases: [
        {
          ruleTitle: 'Why Feminine Surnames in a Consonant Stay Indeclinable',
          ruleExplanation: 'In Ukrainian, surnames ending in -а/-я (like Ковальо́ва, Га́нжа, Майборода́) decline for both men and women. However, surnames ending in a consonant or -ко/-енко (like Малярчу́к, Ковальчу́к, Моро́з, Ко́валь, Шевче́нко in modern spoken usage) follow a special gender split:',
          exceptions: [
            {
              item: 'Referring to a man → Declines in all cases: па́на Малярчука́, па́на Моро́за, па́на Коваля́',
              note: 'Takes regular masculine animate endings.',
            },
            {
              item: 'Referring to a woman → Indeclinable (never changes!): па́ні Малярчу́к, па́ні Моро́з, па́ні Ко́валь, па́ні Шевче́нко',
              note: 'Only the first name or title declines (Оле́ну Малярчу́к, з Оле́ною Малярчу́к).',
            },
          ],
        },
      ],
      commonMistakes: [
        {
          mistake: 'Leaving a feminine direct object in «-а» after an action verb (*Я п’ю ка́ва, *Я чита́ю ціка́ва кни́жка)',
          wrongUk: '*Я п’ю гаря́ча ка́ва і чита́ю ціка́ва кни́жка.',
          correctUk: 'Я п’ю гаря́чу ка́ву і чита́ю ціка́ву кни́жку.',
          explanation: 'Feminine direct objects in -а/-я MUST change to -у/-ю along with their adjectives!',
        },
        {
          mistake: 'Changing an inanimate masculine noun to -а/-у when it is a direct object (*Я хо́чу замо́вити раху́нка)',
          wrongUk: '*Принесі́ть раху́нка / *Я їм гаря́чого борща́ (for a whole order).',
          correctUk: 'Принесі́ть, будь ла́ска, раху́нок. Я їм гаря́чий борщ.',
          explanation: 'Inanimate masculine direct objects keep their Nominative form (раху́нок, борщ, чай, хліб), unless you specifically mean a partitive portion ("some tea" = ча́ю).',
        },
        {
          mistake: 'Using «за + Accusative» instead of «по + Accusative» for going to fetch something',
          wrongUk: '*Вона́ пішла́ в магази́н за хлі́бом (Russian-style calque).',
          correctUk: 'Вона́ пішла́ до крамни́ці по хліб і молоко́.',
          explanation: 'Idiomatic Ukrainian uses «іти́ / ї́хати по + Accusative» when going to fetch, buy, or pick up something or someone.',
        },
      ],
      inlineChecks: [
        {
          id: 'a13-check-1',
          question: 'How does «гаря́ча ка́ва і сві́жий круаса́н» change when you say "I want to order hot coffee and a fresh croissant"?',
          options: [
            'Я хо́чу замо́вити гаря́чу ка́ву і сві́жий круаса́н.',
            'Я хо́чу замо́вити гаря́ча ка́ва і сві́жого круаса́на.',
            'Я хо́чу замо́вити гаря́чій ка́ві і сві́жий круаса́н.',
          ],
          correctIndex: 0,
          explanation: 'Feminine «гаря́ча ка́ва» changes -а → -у («гаря́чу ка́ву»), while inanimate masculine «сві́жий круаса́н» stays unchanged!',
        },
        {
          id: 'a13-check-2',
          question: 'How do you say "She is going to the store for milk and going to school to pick up the children" using idiomatic Ukrainian?',
          options: [
            'Вона́ йде до крамни́ці по молоко́ і ї́де до шко́ли по діте́й.',
            'Вона́ йде до крамни́ці про молоко́ і ї́де до шко́ли про діте́й.',
            'Вона́ йде до крамни́ці молоко́.',
          ],
          correctIndex: 0,
          explanation: 'Going to fetch or pick up something/someone is expressed with «по + Accusative» (по молоко́, по діте́й).',
        },
        {
          id: 'a13-check-3',
          question: 'In a traditional Ukrainian restaurant, what do the phrases «на пе́рше» and «на дру́ге» mean?',
          options: [
            'For the first person and for the second person',
            'For the first course (soup/borscht) and for the main course',
            'On the first floor and on the second floor',
          ],
          correctIndex: 1,
          explanation: '«На заку́ску» = for an appetizer, «на пе́рше» = for the first course (soup/borscht), «на дру́ге» = for the main course, and «на десе́рт / на тре́тє» = for dessert.',
        },
      ],
      completeReference: [
        {
          title: 'Advanced Reference: Conjugation of «хоті́ти» (to want) & Partitive Genitive vs. Accusative in Dining',
          summary: 'Expand to review the mixed conjugation of «хоті́ти» and when to choose Partitive Genitive vs. Accusative.',
          contentHtml: `
            <p class="mb-2"><b>1. Present & Past Conjugation of «хоті́ти» (to want — 1st Conjugation with т → ч in all persons):</b></p>
            <ul class="list-disc pl-5 space-y-1 mb-3">
              <li>Present: <b>я хо́чу, ти хо́чеш, він/вона́ хо́че, ми хо́чемо, ви хо́чете, вони́ хо́чуть</b> (never <i>*хотя́ть</i>!).</li>
              <li>Past: <b>він хоті́в, вона́ хоті́ла, воно́ хоті́ло, вони́ хоті́ли</b>.</li>
            </ul>
            <p class="mb-2"><b>2. Accusative (Whole Item) vs. Partitive Genitive (Some / A Portion):</b></p>
            <ul class="list-disc pl-5 space-y-1">
              <li><b>Accusative (Specific item or whole unit):</b> <b>Я купу́ю цю ри́бу, бі́лий хліб і чорну ка́ву.</b></li>
              <li><b>Partitive Genitive (An unmeasured portion or after a container):</b> <b>Да́йте, будь ла́ска, хлі́ба, си́ру, ме́ду, зе́леного ча́ю; скля́нка чисто́ї води́; ча́шка гаря́чої ка́ви.</b></li>
            </ul>
          `,
        },
      ],
      takeaways: [
        'In the Accusative case (direct object of verbs like чита́ю, п’ю, їм, купу́ю, люблю́, хо́чу), feminine nouns and adjectives change -а/-я to -у/-ю (гаря́ча ка́ва → гаря́чу ка́ву).',
        'Inanimate masculine, neuter, and plural direct objects stay unchanged (зелений чай, сві́же молоко́, смачні́ варе́ники), while animate masculine and plural direct objects take the Genitive form (бра́та, дру́зів, діте́й).',
        'Use Partitive Genitive after containers or for "some" of a food/drink (ча́шка ча́ю, скля́нка води́, тро́хи цу́кру).',
        'Use «на заку́ску / на пе́рше / на дру́ге / на десе́рт» to order by course, «про + Accusative» for "about", and «по + Accusative» for going to fetch/pick up (іти́ по молоко́, ї́хати по діте́й).',
      ],
    },
    examples: [
      { uk: 'Я п’ю гаря́чу ка́ву і чита́ю ціка́ву кни́жку.', en: 'I am drinking hot coffee (ка́ва → ка́ву) and reading an interesting book (кни́жка → кни́жку).' },
      { uk: 'Ми хо́чемо замо́вити украї́нський борщ, варе́ники і мінера́льну во́ду.', en: 'We want to order Ukrainian borscht, varenyky, and mineral water (вода́ → во́ду).' },
      { uk: 'Да́йте, будь ла́ска, одну́ ча́шку зе́леного ча́ю і скля́нку води́.', en: 'Please give me one cup of green tea and a glass of water (Partitive Genitive ча́ю, води́).' },
      { uk: 'Принесі́ть, будь ла́ска, меню́ і раху́нок.', en: 'Please bring the menu and the check.' },
      { uk: 'Чи мо́жна попроси́ти до телефо́ну па́ні Малярчу́к або́ па́на Малярчука́?', en: 'May I ask for Ms. Maliarchuk (indeclinable) or Mr. Maliarchuk (Acc./Gen. -а) to come to the phone?' },
      { uk: 'На заку́ску ми взяли́ сала́т, на пе́рше — борщ, на дру́ге — варе́ники, і довго розповіда́ли про ціка́ву екску́рсію.', en: 'For an appetizer we took salad, for the first course — borscht, for the main course — varenyky, and talked for a long time about the interesting excursion (про + Accusative).' },
      { uk: 'Вона́ шука́є свою́ си́ню парасо́лю (Acc.), бо надво́рі дощ, а по́тім іде́ до крамни́ці по молоко́ (по + Acc.).', en: 'She is looking for her blue umbrella (definite Acc.), because it is raining outside, and then goes to the shop for milk (по + Acc.).' },
    ],
    dialogue: {
      title: 'Ordering at a Lviv Coffee Shop',
      lines: [
        { speaker: 'Бари́ста', uk: 'До́брий день! Що ви хо́чете замо́вити?', en: 'Good day! What would you like to order?' },
        { speaker: 'Макси́м', uk: 'До́брий день! Да́йте, будь ла́ска, вели́ку чорну ка́ву і скля́нку води́.', en: 'Good day! Please give me a large black coffee and a glass of water.' },
        { speaker: 'Бари́ста', uk: 'Звича́йно! Чи хо́чете сві́жий круаса́н або́ десе́рт?', en: 'Of course! Do you want a fresh croissant or dessert?' },
        { speaker: 'Макси́м', uk: 'Так, візьму́ оди́н круаса́н. Чи мо́жна оплати́ти ка́рткою?', en: 'Yes, I will take one croissant. Can I pay by card?' },
        { speaker: 'Бари́ста', uk: 'Так, будь ла́ска. Ось ваш чек!', en: 'Yes, please go ahead. Here is your receipt!' },
      ],
    },
    activeRecall: [
      { promptEn: 'I am reading a book. (кни́жка → ?)', answerUk: 'Я чита́ю кни́жку.', hint: 'Feminine direct object changes -а to -у' },
      { promptEn: 'I love Ukrainian music. (украї́нська му́зика → ?)', answerUk: 'Я люблю́ украї́нську му́зику.', hint: 'Both adjective and noun change -а to -у' },
      { promptEn: 'I want to order borscht.', answerUk: 'Я хо́чу замо́вити борщ.', hint: 'Masculine inanimate борщ does not change' },
      { promptEn: 'Please bring the check.', answerUk: 'Принесі́ть, будь ла́ска, раху́нок.', hint: 'раху́нок = check / bill' },
    ],
    reviewSummary:
      'When a noun is the direct object of a verb (Accusative case), feminine nouns and adjectives change -а/-я to -у/-ю (Я п’ю гаря́чу ка́ву). Inanimate masculine, neuter, and plural nouns stay unchanged (Я п’ю зелений чай; Я купу́ю сві́же молоко́).',
    cfu: [
      {
        q: 'Why does «кни́жка» change to «кни́жку» in the sentence «Я чита́ю кни́жку» ("I am reading a book")?',
        opts: [
          'Because «кни́жка» is the direct object of the verb «чита́ю», so its feminine -а ending changes to Accusative -у',
          'Because «кни́жку» is plural',
          'Because «чита́ю» is in the past tense',
        ],
        ans: 0,
        exp: 'Feminine nouns ending in -а/-я change to -у/-ю when they are the direct object (Accusative case) of an action verb.',
      },
      {
        q: 'In the sentence «Ми замовля́ємо гаря́чий борщ і сві́же молоко́», why do «борщ» and «молоко́» keep their dictionary endings?',
        opts: [
          'Because inanimate masculine and neuter nouns do not change their ending in the Accusative case',
          'Because «замовля́ємо» does not take a direct object',
          'Because they are plural',
        ],
        ans: 0,
        exp: 'Inanimate masculine nouns (борщ, чай, хліб) and neuter nouns (молоко́, меню́) have the exact same form in the Accusative as in the Nominative.',
      },
      {
        q: 'How do both the adjective and noun change when «холо́дна вода́» (cold water) becomes the direct object in "I am drinking cold water"?',
        opts: [
          'Я п’ю холо́дна во́ду.',
          'Я п’ю холо́дну во́ду.',
          'Я п’ю холо́дний вода́.',
        ],
        ans: 1,
        exp: 'Both the feminine adjective (-а → -у) and the feminine noun (-а → -у) change to match in the Accusative case: «холо́дну во́ду».',
      },
    ],
    practice: [
      {
        prompt: 'Complete the sentence: «Вона́ слу́хає украї́нську ________.» (from пі́сня "song"):',
        opts: ['пі́сня', 'пі́сню', 'пі́сні'],
        ans: 1,
        audioUk: 'Вона́ слу́хає украї́нську пі́сню.',
        exp: 'Soft feminine nouns ending in -я change to -ю in the Accusative case: пі́сня → пі́сню.',
      },
      {
        prompt: 'Choose the natural way to say "Please give me a cup of coffee":',
        opts: [
          'Да́йте, будь ла́ска, ча́шку ка́ви.',
          'Да́йте, будь ла́ска, ча́шка ка́ва.',
          'Да́йте, будь ла́ска, ча́шкою ка́вою.',
        ],
        ans: 0,
        audioUk: 'Да́йте, будь ла́ска, ча́шку ка́ви.',
        exp: '«ча́шку» is the Accusative direct object of «да́йте» ("give a cup"), and «ка́ви» means "of coffee".',
      },
      {
        prompt: 'How do you ask "What do you want?" using the verb «хоті́ти» (to want)?',
        opts: ['Що ти хо́чеш?', 'Що ти хоті́ти?', 'Що ти хо́чуть?'],
        ans: 0,
        audioUk: 'Що ти хо́чеш?',
        exp: '«хоті́ти» conjugates as: я хо́чу, ти хо́чеш, він/вона́ хо́че, ми хо́чемо, ви хо́чете, вони́ хо́чуть.',
      },
      {
        prompt: 'Complete the sentence: «Я купу́ю ________ су́мку.» ("I am buying a new bag"):',
        opts: ['нови́й', 'нова́', 'нову́'],
        ans: 2,
        audioUk: 'Я купу́ю нову́ су́мку.',
        exp: 'Because «су́мку» is a feminine Accusative direct object, the adjective also takes -у: «нову́ су́мку».',
      },
      {
        prompt: 'You have finished your meal at a restaurant and want the check. What do you say?',
        opts: [
          'Принесі́ть, будь ла́ска, раху́нок.',
          'Принесі́ть, будь ла́ска, вокза́л.',
          'Де тут апте́ка?',
        ],
        ans: 0,
        audioUk: 'Принесі́ть, будь ла́ска, раху́нок.',
        exp: '«раху́нок» means "the bill / check".',
      },
    ],
    vocab: [
      ['хоті́ти', 'VERB', 'to want (хо́чу, хо́чеш, хо́че, хо́чуть)', 'Я хо́чу замо́вити ка́ву.', 'I want to order coffee.'],
      ['замовля́ти', 'VERB', 'to order (imperfective: замовля́ю)', 'Ми вже замовля́ємо обі́д.', 'We are already ordering lunch.'],
      ['замо́вити', 'VERB (pf)', 'to order (completed: замо́влю)', 'Що ви хо́чете замо́вити?', 'What do you want to order?'],
      ['сніда́нок', 'NOUN', 'breakfast', 'Смачни́й сніда́нок удо́ма.', 'A delicious breakfast at home.'],
      ['обі́д', 'NOUN', 'lunch', 'Ми йдемо́ на обі́д.', 'We are going for lunch.'],
      ['вече́ря', 'NOUN', 'dinner / supper (Acc. вече́рю)', 'Ма́ма готу́є вече́рю.', 'Mom is cooking dinner.'],
      ['варе́ники', 'NOUN', 'varenyky / Ukrainian dumplings', 'Я люблю́ варе́ники з ви́шнями.', 'I love varenyky with cherries.'],
      ['суп', 'NOUN', 'soup', 'Гаря́чий овоче́вий суп.', 'Hot vegetable soup.'],
      ['сир', 'NOUN', 'cheese / cottage cheese', 'Хліб і сві́жий сир.', 'Bread and fresh cheese.'],
      ['цу́кор', 'NOUN', 'sugar (Gen. цу́кру)', 'Ка́ва без цу́кру.', 'Coffee without sugar.'],
      ['ча́шка', 'NOUN', 'cup (Acc. ча́шку)', 'Да́йте, будь ла́ска, ча́шку ча́ю.', 'Please give me a cup of tea.'],
      ['скля́нка', 'NOUN', 'glass (Acc. скля́нку)', 'Скля́нка чисто́ї води́.', 'A glass of clean water.'],
      ['раху́нок', 'NOUN', 'bill / check / account', 'Принесі́ть, будь ла́ска, раху́нок.', 'Please bring the check.'],
      ['кав’я́рня', 'NOUN', 'coffee shop / café (Acc. кав’я́рню)', 'Це моя́ улю́блена кав’я́рня.', 'This is my favorite coffee shop.'],
      ['рестора́н', 'NOUN', 'restaurant', 'Затишни́й украї́нський рестора́н.', 'A cozy Ukrainian restaurant.'],
    ],
    exam: [
      {
        q: 'Which sentence correctly translates "I am reading an interesting book"?',
        opts: [
          'Я чита́ю ціка́ва кни́жка.',
          'Я чита́ю ціка́ву кни́жку.',
          'Я чита́ю ціка́вий кни́жку.',
        ],
        ans: 1,
        exp: 'Both «ціка́ва» and «кни́жка» change -а to -у because the book is the feminine direct object of «чита́ю».',
      },
      {
        q: 'Which sentence correctly translates "We are drinking hot tea"?',
        opts: [
          'Ми п’ємо́ гаря́чий чай.',
          'Ми п’ємо́ гаря́чу ча́ю.',
          'Ми п’ємо́ гаря́че чай.',
        ],
        ans: 0,
        exp: '«чай» is an inanimate masculine noun, so both the adjective and noun stay in their dictionary form in the Accusative case.',
      },
      {
        q: 'What is the Accusative direct object form of the soft feminine noun «вече́ря» (dinner) in "I am cooking dinner"?',
        opts: ['Я готу́ю вече́ря.', 'Я готу́ю вече́рю.', 'Я готу́ю вече́рі.'],
        ans: 1,
        exp: 'Feminine nouns ending in -я change -я to -ю in the Accusative singular: вече́ря → вече́рю.',
      },
      {
        q: 'How do you say "They want" using «хоті́ти»?',
        opts: ['вони́ хо́чуть', 'вони́ хо́че', 'вони́ хо́чете'],
        ans: 0,
        exp: 'The 3rd-person plural of «хоті́ти» is «вони́ хо́чуть».',
      },
      {
        q: 'What does «Ка́ва без цу́кру» mean?',
        opts: ['Coffee with milk', 'Coffee without sugar', 'Hot tea with lemon'],
        ans: 1,
        exp: '«без» means "without", and «цу́кру» is the Genitive form of «цу́кор» (sugar).',
      },
      {
        q: 'How do you politely ask "Can I pay by card?" in a café or store?',
        opts: [
          'Чи мо́жна оплати́ти ка́рткою?',
          'Де тут банкома́т?',
          'Скі́льки у вас ка́рток?',
        ],
        ans: 0,
        exp: '«Чи мо́жна оплати́ти ка́рткою?» is the natural everyday phrase for "Can I pay by card?".',
      },
    ],
  },
  {
    id: 'A1.4',
    level: 'A1',
    topicTag: 'A1 Beginner • Family, Possession & Locations',
    title: 'Family, Saying What You Have & Basic Locations (Genitive & Locative Intro)',
    objectives: [
      'Talk about family members and express possession using both «У ме́не є...» and the verb «ма́ти».',
      'Say what you do NOT have using «У ме́не нема́є...» + the Genitive case.',
      'Say where you live, study, or work using «у / в» and «на» + the Locative case.',
    ],
    summary:
      'In this lesson, you will learn how to talk about your family, say what you have and don’t have, and describe where people and places are located. You will also discover one of Ukrainian’s most pleasant features: alternating between «у» and «в» so sentences flow smoothly!',
    rules: [
      '<b>1. Two Ways to Say "I Have" in Ukrainian</b>: Unlike Russian, Ukrainian actively uses BOTH the "by me there is" pattern AND a regular verb <b>ма́ти</b> (to have):<ul><li>Pattern A: <b>У ме́не є...</b> (I have), <b>У те́бе є...</b> (You have), <b>У ньо́го є...</b> (He has), <b>У не́ї є...</b> (She has), <b>У нас є...</b> (We have), <b>У вас є...</b> (You have), <b>У них є...</b> (They have) + Nominative subject (<i>У ме́не є сестра́ і брат</i>).</li><li>Pattern B: Verb <b>ма́ти</b> (я <b>ма́ю</b>, ти <b>ма́єш</b>, він/вона́ <b>ма́є</b>, ми <b>ма́ємо</b>, ви <b>ма́єте</b>, вони́ <b>ма́ють</b>) + Accusative direct object (<i>Я ма́ю сестру́ і бра́та; Чи ти ма́єш час?</i>).</li></ul>',
      '<b>2. Saying "I Don’t Have" («нема́є» + Genitive Case)</b>: Whenever you say someone does NOT have something (or something is not present) using <b>нема́є</b> (short form: <b>нема́</b>), the noun after <b>нема́є</b> changes to the <b>Genitive case</b>:<ul><li>Feminine <b>-а/-я → -и/-і</b>: <i>сестра́ → У ме́не нема́є <b>сестри́</b>; ка́ва → Нема́є <b>ка́ви</b>; сім’я́ → Нема́є <b>сім’ї́</b></i>.</li><li>Masculine & Neuter <b>→ -а/-я or -у/-ю</b>: <i>брат → У ме́не нема́є <b>бра́та</b>; час → У ме́не нема́є <b>ча́су</b>; вікно́ → Нема́є <b>вікна́</b></i>.</li></ul>',
      '<b>3. Saying Where You Are («у/в» & «на» + Locative Case)</b>: To answer <b>Де?</b> (Where — static location), use <b>у / в</b> ("in/at" for cities, countries, rooms, and most buildings) or <b>на</b> ("on/at" for surfaces, open spaces, events, and a few words like <b>на робо́ті</b> "at work", <b>на ву́лиці</b> "on the street", <b>на вокза́лі</b> "at the station"). After <b>у/в</b> and <b>на</b>, most singular nouns end in <b>-і</b> (or <b>-у</b> after <i>-ок/-к</i>):<ul><li><i>Ки́їв → <b>у Ки́єві</b>; Львів → <b>у Льво́ві</b>; Украї́на → <b>в Украї́ні</b>; шко́ла → <b>у шко́лі</b>; стіл → <b>на столі́</b>; робо́та → <b>на робо́ті</b>; буди́нок → <b>у буди́нку</b>; парк → <b>у па́рку</b></i>.</li><li><b>Consonant Swap Before -і</b>: If a noun stem ends in <b>к, г, х</b>, that consonant softens before the Locative ending <b>-і</b>: <b>к → ц</b> (<i>кни́жка → у кни́жці; апте́ка → в апте́ці; рік → у ро́ці</i>), <b>г → з</b> (<i>доро́га → на доро́зі</i>), <b>х → с</b>!</li></ul>',
      '<b>4. Smooth Flow (Euphony): Choosing «у» vs. «в» and «і» vs. «й»</b>: Both <b>у</b> and <b>в</b> mean "in/at". Use <b>в</b> before vowels (<i><b>в</b> Украї́ні, <b>в</b> о́фісі, <b>в</b> апте́ці</i>) and <b>у</b> before consonants or clusters (<i><b>у</b> Ки́єві, <b>у</b> Льво́ві, <b>у</b> шко́лі</i>) so your speech never gets stuck on hard consonant clusters!',
      '<b>5. Family Possessive Adjectives (ма́мин, ба́тьків) & Reflexive «свій»</b>:<ul><li>Instead of saying "of mom" or "of father", Ukrainian forms warm <b>possessive adjectives</b> directly from singular family members and first names:<ul><li>From feminine nouns in <i>-а/-я</i> → add <b>-ин / -їн</b> (f. <b>-ина</b>, n. <b>-ине</b>, pl. <b>-ині</b>): <b>ма́ма → ма́мин голос, ма́мина пора́да</b>; <b>сестра́ → се́стрин зо́шит</b>; <b>Марі́я → Марі́їн</b>.</li><li>From masculine nouns → add <b>-ів / -їв</b> (f. <b>-ова/-єва</b>, n. <b>-ове/-єве</b>, pl. <b>-ові/-єві</b>): <b>ба́тько → ба́тьків дім, ба́тькова кни́жка</b>; <b>брат → бра́тів телефо́н</b>; <b>Андрі́й → Андрі́їв</b>.</li></ul></li><li>Use <b>свій (своя́, своє́, свої́)</b> to mean "one’s own" (my own, your own, his/her own) whenever the owner is the subject of the sentence: <b>Я люблю́ свою́ сім’ю́</b>; <b>Він чита́є свою́ кни́жку</b>.</li></ul>',
      '<b>6. Pronoun Stress Shift After Prepositions, Locative in «-у» & Declining «ма́ти»</b>:<ul><li>Notice how the Genitive/Accusative pronouns <b>мене́</b> (me) and <b>тебе́</b> (you) shift their stress onto the first syllable right after a preposition: <i>Він ба́чить <b>мене́</b></i>, but <b>У ме́не є час</b>, <b>бі́ля ме́не</b>, <b>до те́бе</b>! Also remember that 3rd-person pronouns add an initial <b>н-</b> after prepositions: <b>у ньо́го</b>, <b>у не́ї</b>, <b>до них</b>, <b>з ним</b>, <b>з не́ю</b>.</li><li>While most masculine nouns take <b>-і</b> (or <b>-ові/-еві</b> for people) in the Locative case, masculine nouns ending in <b>-к / -ок</b> and several monosyllabic nouns take <b>-у́</b>: <b>у буди́нку</b> (in the building), <b>у па́рку</b> (in the park), <b>у лі́жку</b> (in bed), <b>в саду́</b> (in the orchard), <b>на даху́</b> (on the roof), <b>у снігу́</b> (in the snow), <b>на мосту́</b> (on the bridge), <b>у Криму́</b> (in Crimea).</li><li>The formal word <b>ма́ти</b> (mother) adds <b>-ер- / -ір-</b> in all other cases: Gen./Dat./Loc. <b>ма́тері</b>, Acc. <b>ма́тір</b>, Inst. <b>ма́тір’ю</b> (with an apostrophe!).</li></ul>',
      '<b>7. Past & Future of Possession («був / не було́»), 4-Way Place Directions & «Що в те́бе ново́го?»</b>:<ul><li><b>Past & Future of «У ме́не є / нема́є»</b>: In the affirmative past/future, the verb <b>бу́ти</b> agrees with the possessed item: <b>У те́бе була́ маши́на?</b> (Did you have a car?), <b>В Оста́па були́ гро́ші</b> (Ostap had money). In the negative, it is ALWAYS impersonal neuter <b>не було́</b> (past) or <b>не бу́де</b> (future) + <b>Genitive</b>: <b>В Оста́па не було́ гро́шей / не бу́де гро́шей</b>!</li><li><b>4-Way Place Contrast</b>: <b>Я іду́ в університе́т</b> (entering inside as a student/worker) vs. <b>до університе́ту</b> (heading to or as far as the university building/stop); <b>з університе́ту</b> (coming out from inside) vs. <b>від університе́ту</b> (walking away from the outside/vicinity of the building).</li><li><b>«Що в те́бе ново́го?» ("What’s new with you?")</b>: After <b>що</b>, <b>щось</b>, or <b>нічо́го</b>, descriptive adjectives take the <b>Neuter Genitive Singular (-ого/-ього)</b>: <b>Що в газе́ті ціка́вого? — Нічо́го ново́го нема́є</b>; <b>Ви́пиймо чого́сь холо́дного!</b></li></ul>',
      '<b>8. Masculine Genitive «-а/-я» vs. «-у/-ю», Negated Direct Objects, & Singulative «-и́на»</b>:<ul><li><b>When Masculine Nouns Take Genitive -а/-я vs. -у/-ю</b>:<ul><li>Take <b>-а / -я</b>: people & animals (<b>бра́та, това́риша, коня́</b>), countable objects, machines & architectural elements (<b>стола́, олівця́, комп’ю́тера, тра́ктора, коридо́ра</b>), units of measurement/currency (<b>кілогра́ма, гекта́ра, мі́сяця, ти́жня, до́лара</b>), and cities/settlements (<b>Ки́єва, Льво́ва, Лондо́на</b>).</li><li>Take <b>-у / -ю</b>: substances & materials (<b>ме́ду, цу́кру, си́ру, ча́ю, борщу́, азо́ту</b>), weather & nature/landscapes (<b>сні́гу, дощу́, ві́тру, моро́зу, лі́су, га́ю, са́ду</b>), large buildings/institutions, abstract concepts & processes (<b>університе́ту, вокза́лу, теа́тру, ча́су, у́спіху, ро́звитку, ру́ху</b>), and rivers, mountain ranges & countries (<b>Дніпра́/Дуна́ю, Кавка́зу, Кри́му, Кита́ю</b>). Notice how a stress shift can even distinguish meaning: <b>мо́сту</b> (Gen. of bridge) vs. <b>мосту́</b> (Loc. <i>на мосту́</i>)!</li></ul></li><li><b>Negated Direct Objects (Genitive vs. Accusative)</b>: After a negated verb (<b>не + verb</b>), an indefinite or general direct object takes the <b>Genitive</b> (<b>Я не купи́в словника́ / кни́жки; Ми не ма́ємо ча́су</b>), whereas a specific, modified object can stay in the <b>Accusative</b> (<b>Я ще не купи́в цю нову́ кни́жку / ва́шу кни́жку</b>).</li><li><b>Singulative Suffix «-и́на» ("One Single Item" from Collective Produce)</b>: Because produce words like <b>капу́ста</b> (cabbage), <b>цибу́ля</b> (onions), and <b>карто́пля</b> (potatoes) are collective singulars, Ukrainian adds stressed <b>-и́на</b> to name a single head, bulb, or tuber: <b>капусти́на</b> (one head of cabbage), <b>цибули́на</b> (one onion), <b>картопли́на</b> (one potato)!</li></ul>',
      '<b>9. Locative «-у/-ю» After «по» vs. «-і» After «у/на», Street-Name Patterns, & «зва́ти» vs. «назива́тися»</b>:<ul><li><b>Why «у мі́сті» Changes to «по мі́сту»</b>: Inanimate masculine and neuter nouns that take <b>-і</b> after static <b>у/на</b> (<i>у мі́сті, у селі́, у це́нтрі, у теа́трі, на вокза́лі, у по́лі, на мо́рі</i>) switch to <b>-у / -ю</b> after the preposition <b>по</b> meaning "around / along / through": <b>ходи́ти по мі́сту, по селу́, по це́нтру, по теа́тру, по вокза́лу</b>; <b>бі́гати по по́лю</b>; <b>пла́вати по мо́рю</b>! (You can also express this with the bare Traversive Instrumental: <b>гуля́ти мі́стом, па́рком, ву́лицею, лі́сом</b>.) With plural days or times of day, <b>по + Locative plural (-ах/-ях)</b> means "on [Mondays] / in the [evenings]": <b>по понеді́лках, по субо́тах, по вечора́х</b>.</li><li><b>Two Patterns of Ukrainian Street & Square Names</b>:<ul><li>Pattern 1 (<b>Adjective + ву́лиця / пло́ща / проспе́кт</b>): Both words decline together → <b>Володи́мирська ву́лиця → на Володи́мирській ву́лиці</b>, <b>Контракто́ва пло́ща → на Контракто́вій пло́щі</b>, <b>Андрі́ївський узві́з → на Андрі́ївському узво́зі</b>.</li><li>Pattern 2 (<b>ву́лиця / пло́ща / бульва́р + Genitive of Person’s Name</b>): Only the word <i>ву́лиця / пло́ща / бульва́р</i> declines, while the Genitive name stays unchanged → <b>ву́лиця Мазе́пи → на ву́лиці Мазе́пи</b>, <b>бульва́р Шевче́нка → на бульва́рі Шевче́нка</b>!</li></ul></li><li><b>People Have an «ім’я́» («зва́ти»), Things Have a «на́зва» («назива́тися»), & «мі́сто» vs. «мі́сце»</b>:<ul><li>Use <b>Як зва́ти + Accusative?</b> for people and pets (<i>Як зва́ти ва́шого бра́та? — Мого́ бра́та зва́ти Яре́ма</i>), and <b>Як назива́ється + Nominative?</b> for cities, streets, books, films, and cafés (<i>Як назива́ється цей фільм / ця ву́лиця?</i>). Proper titles in quotation marks stay in the <b>Nominative</b> when preceded by a generic noun: <b>у кінотеа́трі «Украї́на»</b>, <b>у книга́рні «Є»</b>, <b>в готе́лі «Десна́»</b>.</li><li>Never confuse <b>мі́сто</b> (city → adjective <b>міськи́й</b> = urban/municipal, <i>міськи́й тра́нспорт</i>) with <b>мі́сце</b> (place, seat, or room → adjective <b>місце́вий</b> = local, <i>місце́вий час</i>; <b>У вас є ві́льні місця́?</b> = Do you have free seats/vacancies?).</li></ul></li></ul>',
      '<b>10. The 3-Way Spatial Orientation Matrix («де? / куди́? / зві́дки?»), Ukrainian Floor Numbering & Apartment Classifieds</b>:<ul><li><b>3-Way Spatial Adverbs (Location vs. Destination vs. Origin)</b>: Just as prepositions distinguish <b>у/на + Locative</b> (where at), <b>у/на + Accusative or до + Genitive</b> (where to), and <b>з/від + Genitive</b> (where from), Ukrainian spatial adverbs form systematic three-column triads:<ul><li>Here: <b>тут</b> (at here) — <b>сюди́</b> (to here) — <b>зві́дси</b> (from here)</li><li>There: <b>там</b> (at there) — <b>туди́</b> (to there) — <b>зві́дти</b> (from there)</li><li>Home: <b>вдо́ма / удо́ма</b> (at home) — <b>додо́му</b> (homeward) — <b>здо́му</b> (from home)</li><li>In front / ahead: <b>попе́реду</b> (ahead) — <b>впере́д / напере́д</b> (forward) — <b>спе́реду</b> (from the front)</li><li>Behind / back: <b>поза́ду</b> (behind) — <b>наза́д</b> (backward / back) — <b>зза́ду</b> (from behind)</li><li>Left / right / up / down: <b>ліво́руч / налі́во</b> (on/to the left) — <b>злі́ва</b> (from/on the left); <b>право́руч / напра́во</b> — <b>спра́ва</b>; <b>нагорі́ / вгорі́</b> (upstairs / above) — <b>наго́ру / вго́ру</b> (upward) — <b>згори́</b> (from above); <b>внизу́</b> (downstairs / below) — <b>вниз</b> (downward) — <b>зни́зу</b> (from below).</li></ul></li><li><b>Ukrainian Floor Numbering & Apartment Block Vocabulary</b>:<ul><li>In Ukraine (as in North America), the ground/street level is the <b>пе́рший по́верх</b> ("first floor"), so British "3rd floor" is <b>четве́ртий по́верх</b> (<i>на четве́ртому по́версі</i>)!</li><li>Entering an apartment building: <b>під’ї́зд</b> (building entrance/stairwell section: <i>дру́гий під’ї́зд</i>), <b>код на дверя́х</b> (door keypad code), <b>схі́дці</b> (stairs: <i>підніма́тися схі́дцями наго́ру</i>), <b>ліфт</b> (elevator).</li><li>Apartment classifieds (<b>оголо́шення</b>): <b>здава́ти / зда́ти кварти́ру</b> (to rent out / let an apartment as landlord) vs. <b>найма́ти / найня́ти (зніма́ти / зня́ти) кварти́ру без посере́дників</b> (to rent an apartment as tenant without middlemen/brokers).</li></ul></li><li><b>Standard Ukrainian Postal Address Abbreviations</b>: Envelopes and directories write the 5-digit postcode (<b>пошто́вий і́ндекс</b>), city, street, building, and apartment using standard abbreviations: <b>вул.</b> (<i>ву́лиця</i>), <b>пл.</b> (<i>пло́ща</i>), <b>пров.</b> (<i>прову́лок</i>), <b>просп.</b> (<i>проспе́кт</i>), <b>б-р</b> (<i>бульва́р</i>), <b>буд.</b> (<i>буди́нок</i>), <b>корп.</b> (<i>ко́рпус</i> = building wing), <b>пов.</b> (<i>по́верх</i>), <b>кв.</b> (<i>кварти́ра</i>).</li></ul>',
    ],
    structuredLesson: {
      bigIdea: {
        headline: 'Talk About Family, What You Have (and Don’t Have), and Where You Live (Genitive & Locative Foundations)',
        body: 'In this capstone A1 lesson, you will unlock two of Ukrainian’s most important everyday structures: expressing possession and absence («У ме́не є... / Я ма́ю...» vs. «У ме́не нема́є + Genitive case»), and describing static locations («у/в» and «на» + the Locative case). You will also discover how Ukrainian alternates smoothly between «у» and «в» for melodic flow (euphony) and softens «к, г, х → ц, з, с» before the Locative ending «-і» (апте́ка → в апте́ці)!',
        keyTerms: [
          {
            term: 'Two Ways to Say "Have": «У ме́не є + Nom.» vs. «Я ма́ю + Acc.»',
            plainEnglish: 'Unlike Russian, Ukrainian actively uses BOTH "By me there is..." («У ме́не є сестра́» — where сестра́ is the Nominative subject) AND the regular verb ма́ти "to have" («Я ма́ю сестру́» — where сестру́ is the Accusative direct object).',
          },
          {
            term: 'Genitive Case (Родови́й відмі́нок — Кого́? Чого́?)',
            plainEnglish: 'The case of "of", absence, and origin. Whenever you say someone does NOT have something after «нема́є» (or in the past «не було́»), the noun changes to the Genitive case (ка́ва → нема́є ка́ви, час → нема́є ча́су).',
          },
          {
            term: 'Locative Case (Місце́вий відмі́нок — На ко́му? У/На чо́му? Де?)',
            plainEnglish: 'The case used after the prepositions у/в ("in/at") and на ("on/at") to show where someone or something is located. Most singular nouns take -і (Ки́їв → у Ки́єві, шко́ла → у шко́лі) or -у (у па́рку, у буди́нку).',
          },
          {
            term: 'Locative Velar Mutation (к → ц, г → з, х → с before -і)',
            plainEnglish: 'When a noun stem ends in к, г, or х, that consonant softens before the Locative ending -і: апте́ка → в апте́ці, кни́жка → у кни́жці, доро́га → на доро́зі, по́верх → на по́версі!',
          },
        ],
      },
      seeItInAction: [
        {
          uk: '<mark class="vc-highlight">У ме́не є</mark> ста́рший брат і сестра́ (або́: <mark class="vc-highlight">Я ма́ю</mark> ста́ршого бра́та і сестру́), але́ сього́дні <mark class="vc-highlight">нема́є ві́льного ча́су</mark>.',
          en: 'I have an older brother and a sister, but today I do not have free time.',
          highlightNote: 'Compare Nominative after «У ме́не є», Accusative after «Я ма́ю», and Genitive («ві́льного ча́су») after «нема́є»!',
        },
        {
          uk: 'Мої́ батьки́ живу́ть <mark class="vc-highlight">у Ки́єві</mark>, сестра́ навча́ється <mark class="vc-highlight">у Льво́ві</mark>, а вітамі́ни продаю́ть <mark class="vc-highlight">в апте́ці</mark>.',
          en: 'My parents live in Kyiv, my sister studies in Lviv, and vitamins are sold at the pharmacy.',
          highlightNote: 'Notice closed-syllable і → о in Львів → у Льво́ві, euphony («у» before consonants vs. «в» before vowel а-), and к → ц in апте́ка → в апте́ці!',
        },
        {
          uk: 'Це <mark class="vc-highlight">ма́мина</mark> улю́блена ча́шка і <mark class="vc-highlight">ба́тьків</mark> стіл, а я люблю́ <mark class="vc-highlight">свою́</mark> сім’ю́.',
          en: 'This is mom’s favorite cup and father’s desk, and I love my own family.',
          highlightNote: 'Ukrainian forms warm possessive adjectives from family nouns (-ин for feminine ма́ма → ма́мин, -ів for masculine ба́тько → ба́тьків) and uses reflexive «свій» when the subject owns the object.',
        },
      ],
      visualTables: [
        {
          title: '1. Expressing "Have" and "Do Not Have" Across All Persons',
          subtitle: 'Notice how personal pronouns add an initial «н-» (ньо́го, не́ї, них) and shift stress (У ме́не, У те́бе) after the preposition «У / В».',
          headers: ['Owner', 'Pattern A: «У/В ... є + Nominative»', 'Pattern B: Verb «ма́ти + Accusative»', 'Negative: «У/В ... нема́є + Genitive»'],
          rows: [
            ['<b>I</b> (я)', '<b class="uk-text">У ме́не є</b> час / сестра́.', '<b class="uk-text">Я ма́ю</b> час / сестру́.', '<b class="uk-text">У ме́не нема́є</b> ча́су / сестри́.'],
            ['<b>You</b> (ти)', '<b class="uk-text">У те́бе є</b> кни́жка?', '<b class="uk-text">Ти ма́єш</b> кни́жку?', '<b class="uk-text">У те́бе нема́є</b> кни́жки.'],
            ['<b>He</b> (він)', '<b class="uk-text">У ньо́го є</b> брат.', '<b class="uk-text">Він ма́є</b> бра́та.', '<b class="uk-text">У ньо́го нема́є</b> бра́та.'],
            ['<b>She</b> (вона́)', '<b class="uk-text">У не́ї є</b> маши́на.', '<b class="uk-text">Вона́ ма́є</b> маши́ну.', '<b class="uk-text">У не́ї нема́є</b> маши́ни.'],
            ['<b>We / You (pl.)</b>', '<b class="uk-text">У нас / У вас є</b> квитки́.', '<b class="uk-text">Ми ма́ємо / Ви ма́єте</b> квитки́.', '<b class="uk-text">У нас / У вас нема́є</b> квиткі́в.'],
            ['<b>They</b> (вони́)', '<b class="uk-text">У них є</b> кварти́ра.', '<b class="uk-text">Вони́ ма́ють</b> кварти́ру.', '<b class="uk-text">У них нема́є</b> кварти́ри.'],
            ['<b>Past / Future Negative</b>', 'Affirmative agrees: <b class="uk-text">У ме́не була́ маши́на.</b>', '<b class="uk-text">Я мав / ма́ла маши́ну.</b>', 'ALWAYS impersonal neuter: <b class="uk-text">У ме́не не було́ / не бу́де ча́су (гро́шей)!</b>'],
          ],
        },
        {
          title: '2. Masculine Genitive Singular Split: When to Use «-а / -я» vs. «-у / -ю»',
          subtitle: 'Unlike feminine (-и/-і) and neuter (-а/-я), masculine nouns choose between -а/-я (countable/living) and -у/-ю (substances, spaces, abstractions).',
          headers: ['Ending Group', 'What Belongs Here', 'Everyday Genitive Examples (after нема́є, без, до, з)'],
          rows: [
            [
              '<b>Masculine Genitive in «-а / -я»</b><br>(Living, Countable, Cities)',
              '1) People & animals<br>2) Countable objects & machines<br>3) Units of measure & currency<br>4) Cities & settlements',
              '• People: <b class="uk-text">бра́та, ба́тька, дру́га, студе́нта, вчи́теля</b><br>• Objects: <b class="uk-text">стола́, стільця́, словника́, комп’ю́тера, олівця́</b><br>• Units: <b class="uk-text">кілогра́ма, мі́сяця, ти́жня, до́лара</b><br>• Cities: <b class="uk-text">з Ки́єва, до Льво́ва, з Ха́ркова, до Лондо́на</b>',
            ],
            [
              '<b>Masculine Genitive in «-у / -ю»</b><br>(Substances, Spaces, Abstract, Countries)',
              '1) Food/drink substances & materials<br>2) Weather & landscapes<br>3) Large buildings, institutions & abstract concepts<br>4) Countries, regions & rivers (most)',
              '• Substances: <b class="uk-text">ча́ю, цу́кру, ме́ду, си́ру, борщу́, со́ку</b><br>• Nature/Weather: <b class="uk-text">сні́гу, дощу́, ві́тру, лі́су, са́ду, па́рку</b><br>• Buildings/Abstract: <b class="uk-text">університе́ту, вокза́лу, теа́тру, магази́ну, буди́нку, ча́су, у́спіху, ру́ху</b><br>• Regions: <b class="uk-text">Кри́му, Кита́ю, Дуна́ю</b>',
            ],
          ],
          footnote: 'Notice how stress can distinguish Genitive from Locative: бі́ля мо́сту (Genitive: near the bridge) vs. на мосту́ (Locative: on the bridge)!',
        },
        {
          title: '3. Static Location («Де?») with «у / в» and «на» + The Locative Case',
          subtitle: 'How to form the Locative singular and choose between «у/в» ("in/at") and «на» ("on/at").',
          headers: ['Rule / Pattern', 'Nominative (Що?)', 'Locative (Де? У/На чо́му?)', 'Why It Works This Way'],
          rows: [
            ['<b>Standard «-і» Ending</b>', '<b class="uk-text">Ки́їв, шко́ла, стіл, мі́сто, мо́ре</b>', '<b class="uk-text">у Ки́єві, у шко́лі, на столі́, у мі́сті, на мо́рі</b>', 'Default Locative singular ending across all genders is <b class="uk-text">-і</b>.'],
            ['<b>Closed-Syllable «о → і» Reversal</b>', '<b class="uk-text">Львів, Харків, стіл, ніч</b>', '<b class="uk-text">у Льво́ві, у Ха́ркові, на столі́, у ночі́</b>', 'Adding <b class="uk-text">-і</b> opens the syllable, so <b class="uk-text">і</b> reverts to <b class="uk-text">о</b>!'],
            ['<b>Velar Mutation (к→ц, г→з, х→с)</b>', '<b class="uk-text">апте́ка, кни́жка, рік, доро́га, по́верх</b>', '<b class="uk-text">в апте́ці, у кни́жці, у ро́ці, на доро́зі, на по́версі</b>', 'Before Locative <b class="uk-text">-і</b>, velars <b class="uk-text">к, г, х</b> always soften to <b class="uk-text">ц, з, с</b>!'],
            ['<b>Masculine Locative in «-у / -ю»</b>', '<b class="uk-text">парк, буди́нок, лі́жко, сад, дах, сніг, міст, Крим</b>', '<b class="uk-text">у па́рку, у буди́нку, у лі́жку, в саду́, на даху́, у снігу́, на мосту́, у Криму́</b>', 'Masculine nouns in <b class="uk-text">-к/-ок</b> (avoiding к→ц) and short spatial monosyllables take <b class="uk-text">-у́</b>.'],
            ['<b>«у мі́сті» vs. «по мі́сту»</b>', '<b class="uk-text">мі́сто, це́нтр, се́ло, вокза́л</b>', 'Static: <b class="uk-text">у мі́сті, у це́нтрі</b><br>Along/around: <b class="uk-text">гуля́ти по мі́сту, по це́нтру</b>', 'After <b class="uk-text">по</b> ("around/along"), masculine & neuter nouns take <b class="uk-text">-у/-ю</b> instead of <b class="uk-text">-і</b>!'],
            ['<b>When to Choose «на» Instead of «у/в»</b>', '<b class="uk-text">робо́та, ву́лиця, пло́ща, вокза́л, по́шта, стадіо́н, конце́рт, уро́к, Украї́на (hist.)</b>', '<b class="uk-text">на робо́ті, на ву́лиці, на пло́щі, на вокза́лі, на по́шті, на конце́рті</b> (but country: <b class="uk-text">в Украї́ні</b>!)', 'Open spaces, surfaces, events/activities, and stations/post offices use <b class="uk-text">на</b>; sovereign countries use <b class="uk-text">у/в</b> (<b class="uk-text">в Украї́ні</b>).'],
          ],
        },
        {
          title: '4. Complete 3-Way Spatial Matrix (Where At «Де?» vs. Where To «Куди́?» vs. Where From «Зві́дки?»)',
          subtitle: 'Prepositions and spatial adverbs work in a clean three-column system.',
          headers: ['Spatial Concept', '1. Static Location (Де? — Locative)', '2. Destination (Куди́? — Acc. / до + Gen.)', '3. Origin (Зві́дки? — з / від + Gen.)'],
          rows: [
            ['<b>Inside a Place (у/в)</b>', '<b class="uk-text">у шко́лі, у Ки́єві, в університе́ті</b>', '<b class="uk-text">у шко́лу, до Ки́єва, в / до університе́ту</b>', '<b class="uk-text">зі шко́ли, з Ки́єва, з університе́ту</b>'],
            ['<b>On a Surface / Event (на)</b>', '<b class="uk-text">на робо́ті, на столі́, на вокза́лі</b>', '<b class="uk-text">на робо́ту, на стіл, на вокза́л</b>', '<b class="uk-text">з робо́ти, зі столу́, з вокза́лу</b>'],
            ['<b>Person / Vicinity (у / до / від)</b>', '<b class="uk-text">у лі́каря, у дру́зів</b> (at the doctor’s / friends’)', '<b class="uk-text">до лі́каря, до дру́зів</b> (to the doctor / friends)', '<b class="uk-text">від лі́каря, від дру́зів</b> (from the doctor / friends)'],
            ['<b>Here / There / Home</b>', '<b class="uk-text">тут / там / вдо́ма</b>', '<b class="uk-text">сюди́ / туди́ / додо́му</b>', '<b class="uk-text">зві́дси / зві́дти / здо́му</b>'],
            ['<b>Upstairs / Downstairs</b>', '<b class="uk-text">нагорі́ (вгорі́) / внизу́</b>', '<b class="uk-text">наго́ру (вго́ру) / вниз</b>', '<b class="uk-text">згори́ / зни́зу</b>'],
            ['<b>Ahead / Behind / Left / Right</b>', '<b class="uk-text">попе́реду / поза́ду / ліво́руч / право́руч</b>', '<b class="uk-text">впере́д / наза́д / налі́во / напра́во</b>', '<b class="uk-text">спе́реду / зза́ду / злі́ва / спра́ва</b>'],
          ],
        },
      ],
      declensions: [
        {
          title: 'Interactive Declension Explorer: Nominative, Genitive, Accusative & Locative',
          subtitle: 'Click through 6 essential nouns to compare all four A1 cases side by side.',
          nouns: [
            {
              lemma: 'сестра́',
              translation: 'sister (Hard Feminine in -а)',
              gender: 'Feminine',
              declensionGroup: '1st Decl. Hard',
              forms: {
                nom: ['сестра́', 'се́стри'],
                gen: ['сестри́ (нема́є сестри́)', 'сесте́р'],
                dat: ['сестрі́', 'се́страм'],
                acc: ['сестру́ (ма́ю сестру́)', 'сесте́р (animate)'],
                inst: ['сестро́ю', 'се́страми'],
                loc: ['на / у сестрі́', 'на / у се́страх'],
                voc: ['се́стро!', 'се́стри!'],
              },
              notes: 'Notice how Nominative (-а), Genitive (-и), Accusative (-у), and Locative (-і) each have a distinct vowel in feminine nouns!',
            },
            {
              lemma: 'апте́ка',
              translation: 'pharmacy (Feminine in -ка with к → ц)',
              gender: 'Feminine',
              declensionGroup: '1st Decl. Hard (Velar)',
              forms: {
                nom: ['апте́ка', 'апте́ки'],
                gen: ['апте́ки (з апте́ки)', 'апте́к'],
                dat: ['апте́ці (к → ц)', 'апте́кам'],
                acc: ['апте́ку (в апте́ку)', 'апте́ки'],
                inst: ['апте́кою', 'апте́ками'],
                loc: ['в апте́ці (к → ц!)', 'в апте́ках'],
                voc: ['апте́ко!', 'апте́ки!'],
              },
              notes: 'Stem-final к mutates to ц before the Dative/Locative ending -і: в апте́ці!',
            },
            {
              lemma: 'брат',
              translation: 'brother (Animate Masculine)',
              gender: 'Masculine',
              declensionGroup: '2nd Decl. Hard',
              forms: {
                nom: ['брат', 'брати́'],
                gen: ['бра́та (нема́є бра́та)', 'браті́в'],
                dat: ['бра́тові / бра́ту', 'брата́м'],
                acc: ['бра́та (animate = Gen.)', 'браті́в'],
                inst: ['бра́том', 'брата́ми'],
                loc: ['на / при бра́тові (бра́ті)', 'на брата́х'],
                voc: ['бра́те!', 'брати́!'],
              },
              notes: 'Because брат is an animate masculine noun, its Accusative singular (ба́чу бра́та) is identical to its Genitive singular (нема́є бра́та).',
            },
            {
              lemma: 'буди́нок',
              translation: 'building / house (Masculine in -ок with fleeting о)',
              gender: 'Masculine',
              declensionGroup: '2nd Decl. Hard (-ок)',
              forms: {
                nom: ['буди́нок', 'буди́нки'],
                gen: ['буди́нку (з буди́нку)', 'буди́нків'],
                dat: ['буди́нкові / буди́нку', 'буди́нкам'],
                acc: ['буди́нок (inanimate = Nom.)', 'буди́нки'],
                inst: ['буди́нком', 'буди́нками'],
                loc: ['у буди́нку (takes -у!)', 'у буди́нках'],
                voc: ['буди́нку!', 'буди́нки!'],
              },
              notes: 'Drops fleeting о in all cases outside Nominative/Accusative singular, and takes -у in both Genitive and Locative singular!',
            },
            {
              lemma: 'мі́сто',
              translation: 'city (Hard Neuter in -о)',
              gender: 'Neuter',
              declensionGroup: '2nd Decl. Hard',
              forms: {
                nom: ['мі́сто', 'міста́'],
                gen: ['мі́ста (з мі́ста)', 'міст'],
                dat: ['мі́сту', 'міста́м'],
                acc: ['мі́сто', 'міста́'],
                inst: ['мі́стом', 'міста́ми'],
                loc: ['у мі́сті (але́: по мі́сту!)', 'у міста́х'],
                voc: ['мі́сто!', 'міста́!'],
              },
              notes: 'Takes -і after static у/на (у мі́сті), but takes -у after по meaning "around" (гуля́ти по мі́сту)!',
            },
            {
              lemma: 'ма́ти',
              translation: 'mother (Special 3rd-Declension with -ер-/-ір-)',
              gender: 'Feminine',
              declensionGroup: '3rd Decl. (-ер-)',
              forms: {
                nom: ['ма́ти', 'матері́'],
                gen: ['ма́тері', 'матері́в'],
                dat: ['ма́тері', 'матеря́м'],
                acc: ['ма́тір', 'матері́в'],
                inst: ['ма́тір’ю (with apostrophe!)', 'матеря́ми'],
                loc: ['на / при ма́тері', 'на матеря́х'],
                voc: ['ма́ти!', 'матері́!'],
              },
              notes: 'Adds the stem extension -ер- (or closed-syllable -ір- in Acc. ма́тір and Inst. ма́тір’ю) across all oblique cases.',
            },
          ],
        },
      ],
      diagrams: [
        {
          title: 'Two Patterns of Ukrainian Street & Square Names in the Locative Case',
          subtitle: 'Why does «Володи́мирська ву́лиця» decline both words, while «ву́лиця Мазе́пи» only declines the first word?',
          type: 'comparison',
          nodes: [
            {
              label: 'Pattern 1: Adjective + ву́лиця / пло́ща',
              value: 'на Володи́мирській ву́лиці • на Контракто́вій пло́щі',
              description: 'When the street name is an adjective describing ву́лиця or пло́ща, BOTH words change to the Locative case (-ій -і).',
            },
            {
              label: 'Pattern 2: ву́лиця + Genitive of Person’s Name',
              value: 'на ву́лиці Мазе́пи • на бульва́рі Шевче́нка',
              description: 'Because Мазе́пи ("of Mazepa") and Шевче́нка ("of Shevchenko") are ALREADY in the Genitive case, only ву́лиці / бульва́рі changes!',
            },
          ],
        },
        {
          title: '4-Way Place Contrast: «в університе́т» vs. «до університе́ту» & «зва́ти» vs. «назива́тися»',
          subtitle: 'Fine-tune how you talk about buildings, names of people, and titles of places.',
          type: 'flow',
          nodes: [
            {
              label: 'в університе́т vs. до університе́ту',
              value: 'Going inside (в + Acc.) • Heading to/toward (до + Gen.)',
              description: 'Similarly: ви́йти з університе́ту (come out from inside) vs. відійти́ від університе́ту (walk away from the building’s exterior).',
            },
            {
              label: 'Як зва́ти? vs. Як назива́ється?',
              value: 'Як зва́ти бра́та? (Person) • Як назива́ється фільм? (Thing)',
              description: 'People and pets have an ім’я́ (Як зва́ти + Acc.?), while cities, streets, books, and cafés have a на́зва (Як назива́ється + Nom.?).',
            },
            {
              label: 'Singulative «-и́на» for Single Produce Items',
              value: 'карто́пля → картопли́на • цибу́ля → цибули́на',
              description: 'Add stressed -и́на to collective produce nouns to name one single item: одна́ картопли́на (1 potato), вели́ка капусти́на (1 head of cabbage).',
            },
          ],
        },
      ],
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Choose Your Possession Pattern («У ме́не є + Nom.» or «Я ма́ю + Acc.»)',
          explanation: 'Use Nominative after «У ме́не є...» and Accusative after «Я ма́ю...». When the subject owns the object, use reflexive «свій / своя́ / своє́ / свої́».',
          examples: [
            { uk: 'У ме́не є сестра́. = Я ма́ю сестру́. Я люблю́ свою́ сім’ю́.', en: 'I have a sister. I love my family.' },
          ],
        },
        {
          stepNumber: 2,
          title: 'Switch to the Genitive Case After «нема́є / не було́ / не бу́де»',
          explanation: 'Whenever something is absent or not possessed, change feminine -а/-я → -и/-і, neuter -о/-е → -а/-я, and masculine → -а/-я (living/countable) or -у/-ю (substances/abstract).',
          examples: [
            { uk: 'У ме́не нема́є сестри́, ві́льного ча́су, молока́ і словника́.', en: 'I do not have a sister, free time, milk, or a dictionary.' },
          ],
        },
        {
          stepNumber: 3,
          title: 'Form the Locative Case After «у / в» and «на» (Watching for к/г/х → ц/з/с)',
          explanation: 'Add -і to most singular nouns (mutating к→ц, г→з, х→с before -і) or -у to masculine nouns in -к/-ок (у па́рку, у буди́нку). Alternate «в» (after/before vowels) and «у» (before consonant clusters) for smooth flow.',
          examples: [
            { uk: 'у Ки́єві • в Украї́ні • в апте́ці • у кни́жці • на доро́зі • у па́рку', en: 'in Kyiv • in Ukraine • at the pharmacy • in the book • on the road • in the park' },
          ],
        },
      ],
      moreExamples: [
        {
          uk: 'Учо́ра в нас <mark class="vc-highlight">не було́ ві́льного ча́су</mark>. <mark class="vc-highlight">Що в те́бе ново́го й ціка́вого</mark>?',
          en: 'Yesterday we had no free time. What is new and interesting with you?',
          highlightNote: 'Past negative possession is always impersonal «не було́ + Genitive», and adjectives after що / щось / нічо́го take the Neuter Genitive (-ого): «Що ново́го?».',
        },
        {
          uk: '<mark class="vc-highlight">По субо́тах</mark> ми гуля́ємо <mark class="vc-highlight">по мі́сту</mark>, захо́димо до <mark class="vc-highlight">книга́рні «Є»</mark> <mark class="vc-highlight">на Володи́мирській ву́лиці</mark> або́ <mark class="vc-highlight">на бульва́рі Шевче́нка</mark>.',
          en: 'On Saturdays we walk around the city and stop by the "Ye" Bookstore on Volodymyrska Street or on Shevchenko Boulevard.',
          highlightNote: 'Showcases «по субо́тах» (on Saturdays), «по мі́сту» (-у after по), quoted title staying Nominative after a generic noun («до книга́рні "Є"»), and both street-name patterns.',
        },
        {
          uk: 'За оголо́шенням ми <mark class="vc-highlight">найняли́</mark> кварти́ру <mark class="vc-highlight">без посере́дників</mark>: дру́гий <mark class="vc-highlight">під’ї́зд</mark>, <mark class="vc-highlight">на четве́ртому по́версі нагорі́</mark>.',
          en: 'Through an ad we rented an apartment without brokers: second entrance, on the fourth floor upstairs.',
          highlightNote: 'Notice по́верх → на по́версі (х → с mutation) and practical Ukrainian apartment vocabulary.',
        },
      ],
      exceptionsAndEdgeCases: [
        {
          ruleTitle: 'Why Adjectives Take Neuter Genitive «-ого» After «що, щось, нічо́го»',
          ruleExplanation: 'In expressions like "What’s new?", "something interesting", or "nothing cold", the adjective after що / щось / нічо́го / чого́сь ALWAYS takes the Neuter Genitive Singular ending «-ого / -ього»:',
          exceptions: [
            {
              item: 'Що в те́бе ново́го? — Нічо́го особли́вого! / Що в газе́ті ціка́вого? / Ви́пиймо чого́сь холо́дного!',
              note: 'Literally "What of new? / Nothing of special! / Let’s drink something of cold!".',
            },
          ],
        },
        {
          ruleTitle: 'Negated Direct Objects: Genitive vs. Accusative',
          ruleExplanation: 'When a transitive verb is negated with «не», how do you choose between Genitive and Accusative?',
          exceptions: [
            {
              item: 'General or Indefinite Negated Object → Genitive: Я ще не купи́в словника́ / кни́жки. Ми не ма́ємо ча́су.',
              note: 'Traditional literary Ukrainian prefers the Genitive case after a negated verb.',
            },
            {
              item: 'Specific, Modified or Proper Object → Accusative Allowed: Я ще не чита́в цю нову́ кни́жку.',
              note: 'When pointing to a specific, modified item ("this new book"), the Accusative is also natural.',
            },
          ],
        },
      ],
      commonMistakes: [
        {
          mistake: 'Using the Nominative case after «нема́є» (*У ме́не нема́є час, *Нема́є ка́ва)',
          wrongUk: '*У ме́не нема́є час / *У магази́ні нема́є молоко́.',
          correctUk: 'У ме́не нема́є ча́су. У магази́ні нема́є молока́.',
          explanation: '«Нема́є» (and past «не було́» / future «не бу́де») ALWAYS requires the Genitive case!',
        },
        {
          mistake: 'Forgetting the «к → ц, г → з, х → с» mutation before Locative «-і» (*в апте́кі, *у кни́жкі, *на доро́гі)',
          wrongUk: '*в апте́кі, *у кни́жкі, *на доро́гі',
          correctUk: 'в апте́ці, у кни́жці, на доро́зі, на четве́ртому по́версі',
          explanation: 'Velar consonants к, г, х always mutate to ц, з, с before the Locative singular ending -і.',
        },
        {
          mistake: 'Confusing «мі́сто» (city) with «мі́сце» (place / seat) or «вдо́ма» (at home) with «додо́му» (going home)',
          wrongUk: '*Я іду́ вдо́ма / *Чи це мі́сто ві́льне?',
          correctUk: 'Я вдо́ма (static) vs. Я іду́ додо́му (motion). Чи це мі́сце ві́льне? (seat/place) vs. вели́ке мі́сто (city).',
          explanation: 'Keep «вдо́ма» (where at?) vs. «додо́му» (where to?) and «мі́сто» (city, pl. міста́) vs. «мі́сце» (place/seat, pl. місця́) distinct!',
        },
      ],
      inlineChecks: [
        {
          id: 'a14-check-1',
          question: 'Why do we say «У ме́не є сестра́» (Nominative), «Я ма́ю сестру́» (Accusative), and «У ме́не нема́є сестри́» (Genitive)?',
          options: [
            'In «У ме́не є...» the possessed noun is the grammatical subject (Nom.); after «Я ма́ю...» it is the direct object (Acc.); and after «нема́є» it takes the Genitive of absence',
            'All three endings are interchangeable',
            'Because сестра́ is an irregular noun',
          ],
          correctIndex: 0,
          explanation: 'Each construction assigns a clear grammatical role: Nominative subject with є, Accusative object with ма́ти, and Genitive after нема́є.',
        },
        {
          id: 'a14-check-2',
          question: 'Which sentence correctly applies the Locative consonant mutation to «апте́ка» (pharmacy) and «доро́га» (road)?',
          options: [
            'Ми зустрі́лися на доро́зі бі́ля апте́ки, а лі́ки купи́ли в апте́ці.',
            'Ми зустрі́лися на доро́гі, а лі́ки купи́ли в апте́кі.',
            'Ми зустрі́лися на доро́гу, а лі́ки купи́ли в апте́ку.',
          ],
          correctIndex: 0,
          explanation: 'Before the Locative ending -і, г mutates to з (на доро́зі) and к mutates to ц (в апте́ці).',
        },
        {
          id: 'a14-check-3',
          question: 'Why do we say «на Володи́мирській ву́лиці» (both words change), but «на бульва́рі Шевче́нка» (only the first word changes)?',
          options: [
            'Because «Володи́мирська» is an adjective agreeing with ву́лиці, whereas «Шевче́нка» ("of Shevchenko") is already a noun in the Genitive case',
            'Because Шевче́нка is indeclinable in all contexts',
            'Because бульва́р is neuter',
          ],
          correctIndex: 0,
          explanation: 'Adjectival street names agree in case with ву́лиця/пло́ща, whereas a person’s name in the Genitive ("Street of Mazepa / Boulevard of Shevchenko") stays in the Genitive!',
        },
      ],
      completeReference: [
        {
          title: 'Advanced Reference: Family Possessive Adjectives («ма́мин, ба́тьків») & Ukrainian Postal Abbreviations',
          summary: 'Expand to view how Ukrainian forms possessive adjectives from family members and formats addresses.',
          contentHtml: `
            <p class="mb-2"><b>1. Singular Family Possessive Adjectives («ма́мин / ба́тьків»):</b></p>
            <ul class="list-disc pl-5 space-y-1 mb-3">
              <li><b>From 1st-Declension Nouns in -а/-я → Suffix -ин / -їн:</b> <b>ма́ма → ма́мин (ма́мина, ма́мине, ма́мині)</b>, <b>сестра́ → се́стрин</b>, <b>бабу́ся → бабу́син</b>, <b>ті́тка → ті́тчин</b> (к→ч!), <b>Марі́я → Марі́їн</b>, <b>Софі́я → Софі́їн</b>.</li>
              <li><b>From 2nd-Declension Masculine Nouns → Suffix -ів / -їв (open syllable -ов- / -єв-):</b> <b>ба́тько → ба́тьків (ба́тькова, ба́тькове, ба́тькові)</b>, <b>та́то → та́тів (та́това)</b>, <b>брат → бра́тів (бра́това)</b>, <b>дя́дько → дя́дьків</b>, <b>Андрі́й → Андрі́їв (Андрі́єва)</b>.</li>
            </ul>
            <p class="mb-2"><b>2. Standard Ukrainian Address & Classified Abbreviations:</b></p>
            <ul class="list-disc pl-5 space-y-1">
              <li><b>вул.</b> = ву́лиця (street) • <b>пл.</b> = пло́ща (square) • <b>просп.</b> = проспе́кт (avenue) • <b>б-р</b> = бульва́р (boulevard) • <b>пров.</b> = прову́лок (lane)</li>
              <li><b>буд.</b> = буди́нок (building) • <b>корп.</b> = ко́рпус (wing) • <b>під’ї́зд</b> = entrance/stairwell • <b>пов.</b> = по́верх (floor; ground floor = <b>1-й по́верх</b>) • <b>кв.</b> = кварти́ра (apartment).</li>
            </ul>
          `,
        },
      ],
      takeaways: [
        'Express possession with either «У ме́не є + Nominative» (У ме́не є сестра́) or «Я ма́ю + Accusative» (Я ма́ю сестру́), and absence with «У ме́не нема́є / не було́ + Genitive» (нема́є сестри́, нема́є ча́су).',
        'Masculine Genitive singular uses -а/-я for living beings, countable objects, units, and cities (бра́та, стола́, Ки́єва) and -у/-ю for substances, weather, large buildings, and abstractions (ча́ю, сні́гу, університе́ту, ча́су).',
        'Static location uses «у/в» or «на» + Locative (-і or -у), mutating к→ц, г→з, х→с before -і (в апте́ці, у кни́жці, на доро́зі, на по́версі) and switching to -у after по ("around": гуля́ти по мі́сту).',
        'Keep the 3-way spatial triad distinct: тут / сюди́ / зві́дси (here), там / туди́ / зві́дти (there), and вдо́ма / додо́му / здо́му (home).',
      ],
    },
    examples: [
      { uk: 'У ме́не є ста́рший брат і моло́дша сестра́.', en: 'I have an older brother and a younger sister.' },
      { uk: 'Ви́бач, але́ сього́дні у ме́не нема́є ві́льного ча́су.', en: 'Sorry, but today I do not have free time (час → ча́су after нема́є).' },
      { uk: 'Мої́ батьки́ живу́ть у Ки́єві, а сестра́ навча́ється у Льво́ві.', en: 'My parents live in Kyiv, and my sister studies in Lviv.' },
      { uk: 'Кни́жка лежи́ть на столі́, а вітамі́ни продаю́ть в апте́ці.', en: 'The book is lying on the table, and vitamins are sold at the pharmacy (апте́ка → в апте́ці).' },
      { uk: 'Це ма́мина улю́блена ча́шка і ба́тьків робо́чий стіл, а діду́сь за́раз відпочива́є в саду́.', en: 'This is mom’s favorite cup and father’s work desk, and grandfather is resting in the orchard right now.' },
      { uk: 'Учо́ра в нас не було́ ві́льного ча́су. Що в те́бе ново́го й ціка́вого?', en: 'Yesterday we had no free time (impersonal не було́ + Gen.). What is new and interesting with you?' },
      { uk: 'Ми купи́ли кілогра́м ме́ду, вели́ку капусти́ну і дві цибули́ни, але́ ще не купи́ли словника́.', en: 'We bought a kilogram of honey (ме́ду), a large head of cabbage (капусти́на), and two onions (цибули́ни), but haven’t bought a dictionary (словника́) yet.' },
      { uk: 'По субо́тах ми гуля́ємо по мі́сту, заходимо до книга́рні «Є» на Володи́мирській ву́лиці або́ на бульва́рі Шевче́нка.', en: 'On Saturdays (по субо́тах) we walk around the city (по мі́сту in -у) and stop by the "Ye" Bookstore on Volodymyrska Street or on Shevchenko Boulevard.' },
      { uk: 'За оголо́шенням у газе́ті ми найняли́ двокімна́тну кварти́ру без посере́дників: дру́гий під’ї́зд, четве́ртий по́верх нагорі́, код на дверя́х 38.', en: 'Through a newspaper ad we rented a two-room apartment without brokers: second entrance, fourth floor upstairs, door code 38.' },
    ],
    dialogue: {
      title: 'Talking About Family and Where They Live',
      lines: [
        { speaker: 'Ю́лія', uk: 'Розкажи́ про свою́ сім’ю́! Чи у те́бе є брат або́ сестра́?', en: 'Tell me about your family! Do you have a brother or a sister?' },
        { speaker: 'Павло́', uk: 'У ме́не є сестра́, але́ нема́є бра́та. Моя́ сестра́ живе́ в Оде́сі.', en: 'I have a sister, but I do not have a brother. My sister lives in Odesa.' },
        { speaker: 'Ю́лія', uk: 'А ким вона́ працю́є?', en: 'And what does she do for work?' },
        { speaker: 'Павло́', uk: 'Вона́ лі́кар і працю́є в вели́кій ліка́рні. А де живу́ть твої́ батьки́?', en: 'She is a doctor and works at a large hospital. And where do your parents live?' },
        { speaker: 'Ю́лія', uk: 'Мої́ батьки́ живу́ть тут, у Ки́єві. За́раз та́то на робо́ті, а ма́ма вдо́ма.', en: 'My parents live here in Kyiv. Right now dad is at work, and mom is at home.' },
      ],
    },
    activeRecall: [
      { promptEn: 'I have a question.', answerUk: 'У ме́не є пита́ння.', hint: 'У ме́не є + пита́ння' },
      { promptEn: 'I do not have time. (час → ?)', answerUk: 'У ме́не нема́є ча́су.', hint: 'After нема́є, час takes Genitive -у' },
      { promptEn: 'in Kyiv (Locative case)', answerUk: 'у Ки́єві', hint: 'Ки́їв → у Ки́єві' },
      { promptEn: 'at work (Locative case)', answerUk: 'на робо́ті', hint: 'робо́та takes на + -і' },
    ],
    reviewSummary:
      'Use У ме́не є... (or Я ма́ю...) to say what you have, and У ме́не нема́є + Genitive (нема́є ча́су, нема́є ка́ви, нема́є бра́та) to say what you do not have. For static location ("in/at"), use у/в or на + Locative (у Ки́єві, в Украї́ні, на робо́ті, в апте́ці).',
    cfu: [
      {
        q: 'What happens to a noun when it comes after «нема́є» ("there is no / do not have")?',
        opts: [
          'It stays in the Nominative dictionary form',
          'It changes to the Genitive case (for example: ка́ва → нема́є ка́ви, час → нема́є ча́су)',
          'It becomes plural',
        ],
        ans: 1,
        exp: 'Expressing absence or non-possession with «нема́є» always requires the Genitive case in Ukrainian.',
      },
      {
        q: 'Why does «апте́ка» (pharmacy) become «в апте́ці» and «кни́жка» (book) become «у кни́жці» in the Locative case?',
        opts: [
          'Because before the Locative ending -і, stem-final к changes to ц (г → з, х → с)',
          'Because pharmacy is masculine',
          'Because it is a typo',
        ],
        ans: 0,
        exp: 'In Ukrainian, consonants к, г, and х soften before the Locative ending -і: к → ц (апте́ка → в апте́ці), г → з (доро́га → на доро́зі), х → с.',
      },
      {
        q: 'Why do we say «в Украї́ні» and «в апте́ці», but «у Ки́єві» and «у Льво́ві»?',
        opts: [
          '«в» and «у» are different cases',
          'Ukrainian alternates «в» (before vowels) and «у» (before consonants) so speech flows smoothly',
          '«в» is only used for countries',
        ],
        ans: 1,
        exp: 'Both «у» and «в» mean "in". Choosing «в» before vowels and «у» before consonants keeps Ukrainian smooth and melodic.',
      },
    ],
    practice: [
      {
        prompt: 'Complete the sentence: «Сього́дні в магази́ні нема́є ________.» (from молоко́ "milk"):',
        opts: ['молоко́', 'молока́', 'молоці́'],
        ans: 1,
        audioUk: 'Сього́дні в магази́ні нема́є молока́.',
        exp: 'After «нема́є», neuter nouns in -о change to Genitive -а: молоко́ → молока́.',
      },
      {
        prompt: 'How do you say "She has a sister" in Ukrainian?',
        opts: ['У не́ї є сестра́.', 'У її́ є сестра́.', 'Вона́ нема́є сестра́.'],
        ans: 0,
        audioUk: 'У не́ї є сестра́.',
        exp: 'After the preposition «у», «її́» (her) takes an initial н- and becomes «у не́ї»: «У не́ї є сестра́».',
      },
      {
        prompt: 'Choose the correct Locative phrase for "My brother is at work":',
        opts: ['Мій брат на робо́та.', 'Мій брат на робо́ті.', 'Мій брат без робо́ти.'],
        ans: 1,
        audioUk: 'Мій брат на робо́ті.',
        exp: 'Static location "at work" uses «на» + Locative ending -і: «на робо́ті».',
      },
      {
        prompt: 'Choose the correct Locative form for "in the park" and "in the building":',
        opts: ['у па́рку, у буди́нку', 'у па́рці, у буди́нці', 'у парк, у буди́нок'],
        ans: 0,
        audioUk: 'у па́рку, у буди́нку',
        exp: 'Masculine nouns ending in -к/-ок like «парк» and «буди́нок» take -у in the Locative singular: «у па́рку», «у буди́нку».',
      },
      {
        prompt: 'How do you say "We are at home" using a single everyday Ukrainian adverb?',
        opts: ['Ми вдо́ма.', 'Ми додо́му.', 'Ми з до́му.'],
        ans: 0,
        audioUk: 'Ми вдо́ма.',
        exp: '«вдо́ма» (or «удо́ма») means "at home" (static location), whereas «додо́му» means "homeward / going home".',
      },
    ],
    vocab: [
      ['ба́тько', 'NOUN', 'father', 'Мій ба́тько інжене́р.', 'My father is an engineer.'],
      ['брат', 'NOUN', 'brother (Gen. бра́та)', 'У ме́не є ста́рший брат.', 'I have an older brother.'],
      ['сестра́', 'NOUN', 'sister (Gen. сестри́)', 'У ме́не нема́є сестри́.', 'I do not have a sister.'],
      ['син', 'NOUN', 'son', 'Ї́хній син навча́ється в шко́лі.', 'Their son studies at school.'],
      ['дочка́', 'NOUN', 'daughter (also до́нька)', 'Ї́хня дочка́ живе́ у Льво́ві.', 'Their daughter lives in Lviv.'],
      ['батьки́', 'NOUN', 'parents (plural)', 'Мої́ батьки́ за́раз удо́ма.', 'My parents are at home right now.'],
      ['діду́сь', 'NOUN', 'grandfather', 'Діду́сь чита́є газе́ту в саду́.', 'Grandfather is reading a newspaper in the garden.'],
      ['бабу́ся', 'NOUN', 'grandmother', 'Бабу́ся готу́є смачни́й пирі́г.', 'Grandmother is baking a tasty pie.'],
      ['ма́ти', 'VERB', 'to have (ма́ю, ма́єш, ма́є, ма́ють)', 'Чи ти ма́єш ві́льний час?', 'Do you have free time?'],
      ['нема́є', 'PRED', 'there is no / do not have (+ Genitive)', 'Сього́дні у ме́не нема́є ча́су.', 'Today I do not have time.'],
      ['робо́та', 'NOUN', 'work / job (Loc. на робо́ті)', 'Він за́раз на робо́ті.', 'He is at work right now.'],
      ['шко́ла', 'NOUN', 'school (Loc. у шко́лі)', 'Ді́ти в шко́лі.', 'The children are at school.'],
      ['апте́ка', 'NOUN', 'pharmacy (Loc. в апте́ці)', 'Апте́ка поруч із до́мом.', 'The pharmacy is next to the house.'],
      ['вдо́ма', 'ADV', 'at home (variant: удо́ма)', 'Уве́чері ми бу́демо вдо́ма.', 'In the evening we will be at home.'],
      ['додо́му', 'ADV', 'home / homeward (direction)', 'Я вже іду́ додо́му.', 'I am already walking home.'],
    ],
    exam: [
      {
        q: 'Translate "I don’t have coffee" into Ukrainian:',
        opts: ['У ме́не нема́є ка́ви.', 'У ме́не нема́є ка́ва.', 'Я не є ка́ва.'],
        ans: 0,
        exp: 'After «нема́є», feminine «ка́ва» changes to the Genitive form «ка́ви».',
      },
      {
        q: 'Which sentence correctly says "We live in Lviv"?',
        opts: ['Ми живемо́ у Львів.', 'Ми живемо́ у Льво́ві.', 'Ми живемо́ без Льво́ва.'],
        ans: 1,
        exp: 'In the Locative case ("in Lviv"), the closed-syllable «і» in «Львів» alternates to «о» in the open syllable: «у Льво́ві».',
      },
      {
        q: 'How do you say "He has a new car" using the «У... є» construction?',
        opts: ['У ньо́го є нова́ маши́на.', 'У він є нова́ маши́на.', 'У його́ нема́є нова́ маши́на.'],
        ans: 0,
        exp: 'After the preposition «у», «його́» (him) takes an initial н- and becomes «у ньо́го»: «У ньо́го є нова́ маши́на».',
      },
      {
        q: 'What is the Locative form of «кни́жка» (book) after «у» ("in the book")?',
        opts: ['у кни́жкі', 'у кни́жці', 'у кни́жку'],
        ans: 1,
        exp: 'Before the Locative ending -і, stem-final к mutates to ц: кни́жка → у кни́жці.',
      },
      {
        q: 'What is the difference between «вдо́ма» and «додо́му»?',
        opts: [
          '«вдо́ма» means "at home" (where you are), while «додо́му» means "homeward / going home" (where you are going)',
          'They are interchangeable',
          '«вдо́ма» is plural and «додо́му» is singular',
        ],
        ans: 0,
        exp: 'Use «вдо́ма» for static location (Я вдо́ма = I am at home) and «додо́му» with motion verbs (Я іду́ додо́му = I am going home).',
      },
      {
        q: 'Which sentence uses the verb «ма́ти» (to have) + Accusative direct object correctly?',
        opts: ['Я ма́ю ціка́ву робо́ту.', 'Я ма́ю ціка́ва робо́та.', 'Я ма́ти ціка́ву робо́ту.'],
        ans: 0,
        exp: '«Я ма́ю» is a transitive verb, so its feminine direct object «ціка́ва робо́та» takes the Accusative case: «ціка́ву робо́ту».',
      },
    ],
  },
];
