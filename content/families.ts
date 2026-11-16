export type FamilyId = 'fresh' | 'floral' | 'woody' | 'amber' | 'gourmand' | 'aquatic' | 'green';

export type Family = {
  id: FamilyId;
  name: string;
  short: string;
  mood: string;
  description: string;
  keyNotes: string[];
  wearWhen: string;
  /** Background behind bottle art and cards */
  tint: string;
  /** Liquid / accent colour */
  colour: string;
  /** Text colour that passes contrast on `tint` */
  ink: string;
};

export const families: Family[] = [
  {
    id: 'fresh',
    name: 'Citrus & Fresh',
    short: 'Fresh',
    mood: 'Bright, clean, awake',
    description:
      'Zesty citrus peels, cool herbs and airy musks. The kind of scent that smells like a fresh shirt on a sunny morning.',
    keyNotes: ['Bergamot', 'Lemon', 'Neroli', 'Grapefruit', 'Mint'],
    wearWhen: 'Hot days, the office, the gym bag',
    tint: '#F1E3CF',
    colour: '#D4B06A',
    ink: '#1F0512',
  },
  {
    id: 'floral',
    name: 'Floral',
    short: 'Floral',
    mood: 'Soft, romantic, radiant',
    description:
      'Bouquets of rose, jasmine, peony and tuberose. From dewy and delicate to rich and creamy, florals are the heart of perfumery.',
    keyNotes: ['Rose', 'Jasmine', 'Peony', 'Tuberose', 'Orange blossom'],
    wearWhen: 'Brunch, weddings, date night',
    tint: '#F2D6DE',
    colour: '#B8275E',
    ink: '#1F0512',
  },
  {
    id: 'woody',
    name: 'Woody',
    short: 'Woody',
    mood: 'Grounded, smooth, confident',
    description:
      'Cedar, sandalwood, vetiver and oud. Warm, dry and quietly powerful, with a finish that lasts well into the evening.',
    keyNotes: ['Cedarwood', 'Sandalwood', 'Vetiver', 'Oud', 'Patchouli'],
    wearWhen: 'Meetings, cooler evenings, every day',
    tint: '#E8D7C9',
    colour: '#7A4A2C',
    ink: '#1F0512',
  },
  {
    id: 'amber',
    name: 'Amber & Spice',
    short: 'Amber',
    mood: 'Warm, rich, magnetic',
    description:
      'Resins, saffron, cardamom and incense. Sometimes called oriental, this family glows on the skin and leaves a memorable trail.',
    keyNotes: ['Amber', 'Saffron', 'Cardamom', 'Incense', 'Labdanum'],
    wearWhen: 'Evenings out, celebrations, harmattan',
    tint: '#EFCBAA',
    colour: '#B55A1E',
    ink: '#1F0512',
  },
  {
    id: 'gourmand',
    name: 'Gourmand',
    short: 'Gourmand',
    mood: 'Sweet, cosy, playful',
    description:
      'Vanilla, caramel, tonka and coffee. Edible-smelling notes that feel like a warm hug and get compliments all day.',
    keyNotes: ['Vanilla', 'Tonka bean', 'Praline', 'Coffee', 'Cacao'],
    wearWhen: 'Weekends, cosy nights, gifting',
    tint: '#ECD3C6',
    colour: '#8C4A33',
    ink: '#1F0512',
  },
  {
    id: 'aquatic',
    name: 'Aquatic',
    short: 'Aquatic',
    mood: 'Cool, breezy, effortless',
    description:
      'Sea salt, marine accords and driftwood. Inspired by open water and ocean air, easy to wear from morning to night.',
    keyNotes: ['Sea salt', 'Marine accord', 'Ambroxan', 'Driftwood', 'Sage'],
    wearWhen: 'Holidays, daytime, warm weather',
    tint: '#D8DEE8',
    colour: '#3A5A8C',
    ink: '#1F0512',
  },
  {
    id: 'green',
    name: 'Green',
    short: 'Green',
    mood: 'Crisp, natural, modern',
    description:
      'Cut grass, fig leaf, tea and galbanum. Green scents smell alive and leafy, with an easy, unisex character.',
    keyNotes: ['Fig leaf', 'Green tea', 'Galbanum', 'Basil', 'Violet leaf'],
    wearWhen: 'Spring days, creative work, travel',
    tint: '#DCE2CF',
    colour: '#5E7A3A',
    ink: '#1F0512',
  },
];

export const familyById = Object.fromEntries(families.map((f) => [f.id, f])) as Record<FamilyId, Family>;
