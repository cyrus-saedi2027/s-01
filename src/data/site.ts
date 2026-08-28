export const identity = {
  name: "Zayla Monroe",
  role: "Creative Developer",
  location: "Netherlands",
  email: "studio@zaylamonroe.com",
  address: "Prinsengracht 123, 1016 GV Amsterdam, The Netherlands",
};

/**
 * Hero artwork. The card is 3:4 and uses object-fit: cover, so any
 * portrait-ish file works — point `src` at whatever you drop into
 * `public/art/`. A photographic pair (hero.webp / hero.jpg) is also bundled
 * there if you want to switch back to it.
 *
 * The bundled default is drawn by scripts/generate-hero-art.mjs.
 */
export const heroImage = {
  src: "/art/hero.svg",
  alt: "Ink-wash landscape: a red sun over a snow-capped mountain, a lakeside pagoda, and maple leaves drifting onto still water",
};

/** Sits under the hero card, split into words for the staggered reveal. */
export const heroTagline = "An independent creative Designer & Developer based in Netherlands";

/** Oversized wordmark that scrolls behind the hero card. */
export const heroMarquee = "Zayla Monroe";

export const about = {
  eyebrow: "who i am",
  body:
    "I design and build digital products from Amsterdam. Eight years in, my work sits where interface design, motion and front-end engineering overlap — which means I can take an idea from a blank canvas through to a shipped, running site without handing it off three times.",
  secondary:
    "I work with founders and small teams who care about how a thing feels, not only how it looks in a screenshot.",
  stats: [
    { value: "08", label: "Years in practice" },
    { value: "60", label: "Projects shipped" },
    { value: "24", label: "Awards & mentions" },
  ],
};

export type Project = {
  index: string;
  title: string;
  tags: string;
  year: string;
  art: string;
  /** Wide cover used by the feature rows. */
  cover: string;
  blurb: string;
};

export const projects: Project[] = [
  {
    index: "/ 01",
    title: "Halcyon",
    cover: "/art/cover-01.svg",
    tags: "UX Design, UI Design, Branding",
    year: "2025",
    art: "/art/work-01.svg",
    blurb: "A workshop tooling suite rebuilt around one uncluttered canvas.",
  },
  {
    index: "/ 02",
    title: "Vantable",
    cover: "/art/cover-02.svg",
    tags: "Branding, UI/UX Design, Illustration",
    year: "2024",
    art: "/art/work-02.svg",
    blurb: "An identity system for a research lab, from mark to motion kit.",
  },
  {
    index: "/ 03",
    title: "Ottermade",
    cover: "/art/cover-03.svg",
    tags: "Branding, UI/UX Design, Web Development",
    year: "2024",
    art: "/art/work-03.svg",
    blurb: "Editorial commerce for a studio that sells very few, very good objects.",
  },
  {
    index: "/ 04",
    title: "Persimmon",
    cover: "/art/cover-04.svg",
    tags: "Product Design, Branding",
    year: "2023",
    art: "/art/work-04.svg",
    blurb: "A scheduling product reduced to the three screens people actually use.",
  },
];

export const solutions = [
  {
    n: "01",
    title: "Strategy",
    art: "/art/panel-strategy.svg",
    items: ["Discovery", "Research", "Analysis", "Consultation", "Optimization"],
  },
  {
    n: "02",
    title: "Design",
    art: "/art/panel-design.svg",
    items: ["Branding", "UI/UX", "Visual Identity", "Graphics", "Illustration"],
  },
  {
    n: "03",
    title: "Development",
    art: "/art/panel-development.svg",
    items: ["Full Stack", "Framer", "API Integration", "Testing", "Deployment"],
  },
  {
    n: "04",
    title: "Production",
    art: "/art/panel-production.svg",
    items: ["3D Modeling", "VR Experiences", "Visualization", "Motion Graphics", "Animations"],
  },
];

export const process = [
  {
    n: "/ 01",
    title: "Discover",
    body:
      "We start by getting the problem right. I dig into your goals, your audience and the constraints nobody mentions until week three, then write down what success actually looks like.",
  },
  {
    n: "/ 02",
    title: "Design",
    body:
      "With a direction agreed, I move into layout, type and motion — building real screens rather than mood boards, so we are judging the thing itself and not a picture of it.",
  },
  {
    n: "/ 03",
    title: "Develop",
    body:
      "I write the front-end myself. Componentised, accessible and fast on a mid-range phone, because that is where most of your traffic will read it.",
  },
  {
    n: "/ 04",
    title: "Deliver",
    body:
      "Testing, performance passes and a proper handover. After launch I stay reachable for the fixes and small additions that always follow a first release.",
  },
];

export const testimonials = [
  {
    quote:
      "Zayla took a half-formed brief and turned it into a storefront that finally looks like us. Sales in the first quarter after launch were up by a third.",
    name: "Perrine Vaugh",
    role: "Founder, Ashgrove Botanics",
  },
  {
    quote:
      "The 3D work went straight into our client pitches. Detailed, quick to revise, and delivered ahead of the date we agreed.",
    name: "Idris Bellweather",
    role: "Creative Director, Fathom Nine",
  },
  {
    quote:
      "A rebuild that was genuinely collaborative. Zayla pushed back where it mattered and the site is better for it.",
    name: "Noor Vasquez",
    role: "Marketing Lead, Kelpwood",
  },
  {
    quote:
      "Design through to deployment on our dashboard, handled by one person. The performance numbers speak for themselves.",
    name: "Callum Trent",
    role: "CEO, Ironleaf Systems",
  },
  {
    quote:
      "Our furniture line reads better in Zayla's renders than in the photography we commissioned. That was not the plan, but we will take it.",
    name: "Sena Okonkwo",
    role: "Art Director, Marlowe Interiors",
  },
  {
    quote:
      "Fresh, careful branding that matched our mission without shouting about it. The whole process was calm.",
    name: "Bram Oosterhuis",
    role: "Co-Founder, Northlight Learning",
  },
  {
    quote:
      "Easy to work with and genuinely good at the details — typography, spacing, the way things move. It all feels considered.",
    name: "Wren Ashby",
    role: "Brand Manager, Studio Quintal",
  },
  {
    quote:
      "Modelling plus the front-end integration for our AR platform, both to a standard we had not managed in-house.",
    name: "Mateo Ferreira",
    role: "Head of Product, Loamfield",
  },
];

/**
 * The showcase wall — six plates that ride in over the testimonials on their
 * own layer. Titles are short on purpose: they sit under the frame as a
 * caption, not as a heading.
 */
export const showcase = {
  eyebrow: "Archive",
  lines: ["Recent", "Frames"],
  blurb:
    "Loose ends, test renders and the frames that never made it into a case study.",
  items: [
    { n: "01", title: "Kinetic Grid", meta: "Motion study", art: "/art/showcase-01.svg" },
    { n: "02", title: "Vermilion", meta: "Colour test", art: "/art/showcase-02.svg" },
    { n: "03", title: "Long Form", meta: "Editorial layout", art: "/art/showcase-03.svg" },
    { n: "04", title: "Contour", meta: "Type specimen", art: "/art/showcase-04.svg" },
    { n: "05", title: "Night Shift", meta: "Interface pass", art: "/art/showcase-05.svg" },
    { n: "06", title: "Off Register", meta: "Print trial", art: "/art/showcase-06.svg" },
  ],
};

/**
 * The booking panel. `availability` is wall-clock time in the host's own zone —
 * visitors see it converted to theirs, daylight saving included.
 */
export const booking = {
  title: "Intro call",
  blurb: "Tell me what you are building and where it is stuck. Thirty minutes is usually enough to work out whether I am the right person for it.",
  place: "Google Meet",
  durations: [15, 30, 60],
  defaultDuration: 30,
  availability: {
    days: [1, 2, 3, 4, 5],
    start: 9,
    end: 17,
    hostTimeZone: "Europe/Amsterdam",
    horizon: 60,
  },
} as const;

/** The plate that stands beside the recognition ledger. */
export const accolade = {
  src: "/art/accolade.svg",
  alt: "An ember plume rising through darkness under a bright crescent of light",
};

export const awards = [
  {
    org: "Site of the Day",
    lines: [
      "1× Studio of the year nominee",
      "3× E-commerce of the year nominee",
      "2× Site of the month",
      "12× Site of the day",
      "11× Developer award",
      "20× Honourable mention",
    ],
  },
  {
    org: "Interaction Annual",
    lines: ["12× Motion feature", "1× Grand jury shortlist"],
  },
  {
    org: "Type & Layout Review",
    lines: [
      "2× Editorial craft",
      "3× Interface of the month",
      "7× Interface of the day",
      "1× Studio of the year nominee",
      "5× Innovation",
    ],
  },
  { org: "Frontend Guild", lines: ["1× Performance citation"] },
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About Me", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Playground", href: "#process" },
  { label: "Contact", href: "#contact" },
];
export const socials = [
  { label: "Instagram", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Dribbble", href: "#" },
];

/**
 * Tiles for the gallery that closes the case-studies section. Heights vary so
 * the three columns stagger rather than lining up in bands.
 */
export const gallery = [
  "/art/tile-01.svg",
  "/art/tile-02.svg",
  "/art/tile-03.svg",
  "/art/tile-04.svg",
  "/art/tile-05.svg",
  "/art/tile-06.svg",
  "/art/tile-07.svg",
  "/art/tile-08.svg",
  "/art/tile-09.svg",
];
