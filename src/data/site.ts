export const identity = {
  name: "Zayla Monroe",
  role: "Creative Developer",
  location: "Netherlands",
  email: "studio@zaylamonroe.com",
  address: "Prinsengracht 123, 1016 GV Amsterdam, The Netherlands",
};

/**
 * Hero artwork. Swap these for your own picture in `public/art/` — the card is
 * 3:4 and uses object-fit: cover, so any portrait-ish crop works. The webp is
 * served first with the jpeg as a fallback, and `heroBlur` is a 24x32 preview
 * that fills the card until the real file decodes.
 */
export const heroImage = {
  webp: "/art/hero.webp",
  jpg: "/art/hero.jpg",
  alt: "Ink-wash landscape: a red sun over a snow-capped mountain, a lakeside pagoda, and maple leaves drifting onto still water",
};

export const heroBlur =
  "data:image/jpeg;base64,/9j/2wBDAA8LDA0MCg8NDA0REA8SFyYZFxUVFy8iJBwmODE7OjcxNjU9RVhLPUFUQjU2TWlOVFteY2RjPEpsdGxgc1hhY1//2wBDARARERcUFy0ZGS1fPzY/X19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1//wAARCAAgABgDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAQFBgID/8QAJRAAAQMDAwQDAQAAAAAAAAAAAgEDBAAFERITIQYiMVEjQXEy/8QAFwEAAwEAAAAAAAAAAAAAAAAAAAIDAf/EABoRAQEBAQADAAAAAAAAAAAAAAEAEQIiMUH/2gAMAwEAAhEDEQA/ANRb7XsRNlTLnzmvWPbdlS0mun9qe5c5jg6QbVM+q7iz5beRNksIn3S4VXvpVaq3IjyAJsS7W/6opJiW33I3GVsjXKr9LRQb9hzfH1RrdNSP8hKakXlFSk7r1QTbqtNhxjC8VVYmRUxvAHPqlbnBt9wJTawhiPCe6DCztV1su31DIaiuMajVVLKFminovT5OQ3ULQr2rj8op9KaN/9k=";

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
  blurb: string;
};

export const projects: Project[] = [
  {
    index: "/ 01",
    title: "Halcyon",
    tags: "UX Design, UI Design, Branding",
    year: "2025",
    art: "/art/work-01.svg",
    blurb: "A workshop tooling suite rebuilt around one uncluttered canvas.",
  },
  {
    index: "/ 02",
    title: "Vantable",
    tags: "Branding, UI/UX Design, Illustration",
    year: "2024",
    art: "/art/work-02.svg",
    blurb: "An identity system for a research lab, from mark to motion kit.",
  },
  {
    index: "/ 03",
    title: "Ottermade",
    tags: "Branding, UI/UX Design, Web Development",
    year: "2024",
    art: "/art/work-03.svg",
    blurb: "Editorial commerce for a studio that sells very few, very good objects.",
  },
  {
    index: "/ 04",
    title: "Persimmon",
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
    items: ["Discovery", "Research", "Analysis", "Consultation", "Optimization"],
  },
  {
    n: "02",
    title: "Design",
    items: ["Branding", "UI/UX", "Visual Identity", "Graphics", "Illustration"],
  },
  {
    n: "03",
    title: "Development",
    items: ["Full Stack", "Framer", "API Integration", "Testing", "Deployment"],
  },
  {
    n: "04",
    title: "Production",
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

export const awards = [
  {
    org: "Site of the Day",
    lines: [
      "9× Featured build",
      "4× Developer pick",
      "2× Site of the Month",
      "14× Honourable mention",
    ],
  },
  {
    org: "Interaction Annual",
    lines: ["6× Motion feature", "1× Grand jury shortlist"],
  },
  {
    org: "Type & Layout Review",
    lines: [
      "3× Editorial craft",
      "5× Interface of the Month",
      "1× Studio of the Year nominee",
    ],
  },
  { org: "Frontend Guild", lines: ["2× Performance citation"] },
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
