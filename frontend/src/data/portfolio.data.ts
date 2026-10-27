/**
 * portfolio.data.ts — Content for the Portfolio v5 homepage
 *
 * WHAT THIS FILE IS:
 *   Every fact the homepage shows, in one place. The components in
 *   components/v5/ only decide how things look; this file decides what
 *   they say. To update the site (a new certificate, a new job), edit
 *   this file — no component needs to change.
 *
 * WHERE THE FACTS COME FROM:
 *   - GitHub profile and repositories (github.com/Abdul1452): bio, location,
 *     projects, project READMEs, starred repositories
 *   - LinkedIn profile: experience, education, certifications, availability
 *   Each block below says which source it came from, so it's easy to check.
 *
 * OPTIONAL SECTIONS:
 *   A section whose data is empty doesn't render (see the components). So
 *   to hide something temporarily, empty its array instead of deleting code.
 */

// ─── Profile ──────────────────────────────────────────────────────────────────
// Source: LinkedIn headline + GitHub profile.

export const profile = {
  name: 'Abdullahi Abdulwasiu',
  fullName: 'Abdullahi Olamilekan Abdulwasiu',
  monogram: 'A',
  role: 'Software engineering & project management',
  location: 'Turku, Finland',
  email: 'abdulwasiuabdullah@gmail.com',
  avatarUrl: 'https://avatars.githubusercontent.com/u/194928869?v=4',
  links: {
    github: 'https://github.com/Abdul1452',
    githubLogin: 'Abdul1452',
    linkedin: 'https://www.linkedin.com/in/abdullahi-abdulwasiu-82114a234/',
  },
}

// Shown in the dark bar above the header. Source: LinkedIn "Open to work"
// (Finland, on-site or hybrid) + education end date.
export const announcement = {
  text: 'Open to backend and full-stack roles in Finland, on-site or hybrid. Graduating July 2027.',
  linkLabel: 'LinkedIn profile →',
  linkUrl: profile.links.linkedin,
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export const hero = {
  status: 'Open to work · Turku',
  // The headline is split into lines so each one can animate in turn.
  headline: ['I build the software,', 'and I keep', 'the project'],
  headlineMuted: 'moving.',
  intro:
    'Third-year ICT engineering student at Turku University of Applied Sciences, focused on the backend: APIs, databases and system design. Two internships at theFIRMA, the university’s ICT project office, and a PRY Foundation certificate in project management.',
  facts: [
    { label: 'Based', value: 'Turku, Finland' },
    { label: 'Studies', value: 'BEng ICT, graduating July 2027' },
    { label: 'Languages', value: 'English · Finnish (YKI passed 2026)' },
    { label: 'Open to', value: 'Backend & full-stack, on-site or hybrid' },
  ],
}

// The small "progress" card in the hero. done: true = ticked.
export const nowCard = {
  title: 'Autumn 2026',
  items: [
    { label: 'Working Hours module shipped at theFIRMA', done: true },
    { label: 'MuutoKaveri built at JunctionX Turku', done: true },
    { label: 'Phishing & scam detection tool (course project)', done: false },
  ],
}

// ─── Featured projects ────────────────────────────────────────────────────────
// Source: each repository's README. The `tile` key picks which interactive
// demo renders above the project in the "Work" section.

export type TileKind = 'move-plan' | 'quote-api' | 'fraud-score'

export interface FeaturedProject {
  id: string
  tile: TileKind
  title: string
  tileCaption: string
  badge: string
  meta: string
  problem: string
  whatIDid: string
  result: string
  role: string
  team: string
  stack: string
  imageUrl: string
  imageAlt: string
  links: { label: string; url: string }[]
}

// GitHub generates a social preview card for every public repository.
const repoCard = (repo: string) => `https://opengraph.githubassets.com/portfolio/Abdul1452/${repo}`

export const featuredProjects: FeaturedProject[] = [
  {
    id: 'muutokaveri',
    tile: 'move-plan',
    title: 'MuutoKaveri',
    tileCaption: 'Change the home and the moving plan rewrites itself.',
    badge: 'Hackathon · 48 h',
    meta: 'JunctionX Turku · Oct 2026',
    problem:
      'Finns move about seven times in their lives, and insurance is the step many get wrong: in an If survey, 38% of movers believed their belongings were not insured during their last move.',
    whatIDid:
      'Built it solo in 48 hours for If’s challenge “If Insurance Could Do More”. A Vite + TypeScript app turns the move date, building year and appliance ages into a plan for the move and the first 30 days, with live FMI weather from a small Express server.',
    result:
      'A working app in English, Finnish and Swedish, live on Vercel. No login and no customer data: the plan comes from readable rules, and everything stays in the browser unless you choose to save it.',
    role: 'Sole developer',
    team: 'Solo, 48 hours',
    stack: 'TypeScript · Vite · Node/Express · FMI open data · Vercel',
    imageUrl: repoCard('MuutoKaveri'),
    imageAlt: 'GitHub preview card for the MuutoKaveri repository',
    links: [
      { label: 'Repository', url: 'https://github.com/Abdul1452/MuutoKaveri' },
      { label: 'Live site', url: 'https://muutokaveri.vercel.app' },
    ],
  },
  {
    id: 'quote-api',
    tile: 'quote-api',
    title: 'Serverless Quote API',
    tileCaption: 'Send twice: the first call pays the Lambda cold start.',
    badge: 'API service',
    meta: 'Solo · 2025–2026',
    problem:
      'I wanted to learn how a production-style serverless service fits together: infrastructure as code, a scheduled job, structured logs and CI, not just a Lambda that returns JSON.',
    whatIDid:
      'Two Lambda functions behind API Gateway and EventBridge, defined in an AWS SAM template. A REST API with filters by category, author and tag, and a daily job that posts a quote to a Slack or Discord webhook.',
    result:
      'Written in Python with no runtime dependencies beyond the standard library. Structured JSON logs in CloudWatch, a pytest suite across models, service, handlers and notifier, and GitHub Actions on every pull request.',
    role: 'Sole developer',
    team: 'Solo',
    stack: 'Python · AWS Lambda · API Gateway · EventBridge · SAM',
    imageUrl: repoCard('inspirational-quote-generator'),
    imageAlt: 'GitHub preview card for the inspirational-quote-generator repository',
    links: [
      { label: 'Repository', url: 'https://github.com/Abdul1452/inspirational-quote-generator' },
      { label: 'API docs', url: 'https://github.com/Abdul1452/inspirational-quote-generator/blob/main/docs/api.md' },
    ],
  },
  {
    id: 'petosvahti',
    tile: 'fraud-score',
    title: 'PetosVahti',
    tileCaption: 'Change one signal and watch the decision flip.',
    badge: 'In progress',
    meta: 'Fintech · ML · 2026',
    problem:
      'Under PSD3, payment providers that miss fraud-detection standards carry more of the liability for push-payment fraud, and with SEPA Instant the money moves in under ten seconds, so batch checks come too late.',
    whatIDid:
      'Running it like an enterprise project from day one: charter, business case, risk register, sprint plan, ADRs and an EU compliance folder. The plan: Kafka streams synthetic Finnish transactions, an Isolation Forest scores them, and FastAPI returns approve, review or block with reason codes.',
    result:
      'Sprint 0 (governance and environment) is underway; the baseline model is next. The tile above shows the decision step with illustrative rules, not the trained model.',
    role: 'Developer & project manager',
    team: 'Solo',
    stack: 'Python · scikit-learn · FastAPI · Kafka · PostgreSQL · Docker',
    imageUrl: repoCard('Fraud-Detector-PetosVahti-'),
    imageAlt: 'GitHub preview card for the PetosVahti repository',
    links: [{ label: 'Repository', url: 'https://github.com/Abdul1452/Fraud-Detector-PetosVahti-' }],
  },
]

// ─── Skills ───────────────────────────────────────────────────────────────────
// "shipped" = used in a finished project or internship.
// "learning" = only in a project that's still in progress.

export interface SkillGroup {
  title: string
  skills: { name: string; level: 'shipped' | 'learning' }[]
}

const shipped = (...names: string[]) => names.map(name => ({ name, level: 'shipped' as const }))
const learning = (...names: string[]) => names.map(name => ({ name, level: 'learning' as const }))

export const skillGroups: SkillGroup[] = [
  {
    title: 'Backend',
    skills: [...shipped('Node.js', 'Express', 'TypeScript', 'Prisma', 'Zod', 'REST APIs', 'Python'), ...learning('FastAPI')],
  },
  {
    title: 'Data & delivery',
    skills: [
      ...shipped('PostgreSQL', 'Docker & Compose', 'GitHub Actions', 'AWS Lambda & SAM', 'pytest', 'Postman'),
      ...learning('Kafka', 'scikit-learn'),
    ],
  },
  {
    title: 'Frontend',
    skills: shipped('React', 'Vite', 'Tailwind CSS', 'Next.js'),
  },
  {
    title: 'Project management',
    skills: shipped('IPMA ICB foundation', 'Scrum', 'WBS & PBS', 'Risk registers', 'ADRs'),
  },
]

// ─── Experience & studies ─────────────────────────────────────────────────────
// Source: LinkedIn. Most recent first. `kind: 'study'` gets the square marker.

export interface TimelineItem {
  period: string
  title: string
  org: string
  text: string
  kind: 'work' | 'study'
  highlights?: string[]
}

export const timeline: TimelineItem[] = [
  {
    period: 'May – Aug 2026',
    title: 'Backend developer (internship)',
    org: 'theFIRMA, Turku UAS ICT project office',
    kind: 'work',
    text:
      'Working Hours module for Project Gate 2.0: REST API in Node.js, Express and TypeScript on PostgreSQL with Prisma. Built the weekly auto-submission job, overlap-prevention validation and the rule that locks approved entries, and wrote the module’s Product Breakdown Structure.',
  },
  {
    period: 'Sep – Dec 2025',
    title: 'Full-stack developer (internship)',
    org: 'theFIRMA, Turku UAS ICT project office',
    kind: 'work',
    text:
      'Varaus App, a reservation web application, built in a Scrum team: full-stack TypeScript with a React front end, booking features end to end, feature branches and code review.',
  },
  {
    period: 'Jan – Aug 2021',
    title: 'Sales support assistant',
    org: 'UCC Cargo, Lagos',
    kind: 'work',
    text:
      'Coordinated deliveries of imported goods to clients, kept the sales records and handled payments for an import and logistics company.',
  },
  {
    period: 'Sep 2024 – Jul 2027',
    title: 'BEng, Information and Communications Technology',
    org: 'Turku University of Applied Sciences',
    kind: 'study',
    text: 'Software engineering and project management track.',
    highlights: [
      '2026 · Grade 5, Backend Development course (library API, team project)',
      '2026 · Passed the YKI Finnish exam, earning a Turku UAS scholarship',
      '2026 · PRY Foundation Certificate in Project Management (IPMA ICB)',
    ],
  },
]

// ─── Certifications ───────────────────────────────────────────────────────────
// Source: LinkedIn "Licenses & certifications". `url` = the public credential
// page; leave it out when there isn't one and the row won't link.

export interface Certification {
  mark: string
  name: string
  issuer: string
  year: string
  url?: string
}

export const certifications: Certification[] = [
  {
    mark: 'IPMA',
    name: 'PRY Foundation Certificate in Project Management (IPMA ICB)',
    issuer: 'Projektiyhdistys ry',
    year: '2026',
  },
  {
    mark: 'TS',
    name: 'Building Scalable Microservices with TypeScript and Node.js',
    issuer: 'LinkedIn Learning',
    year: '2026',
    url: 'https://www.linkedin.com/learning/certificates/9787f16d386eaf652e6533e2422f61c1ada823d850586903979614aa7df2b903/',
  },
  {
    mark: 'TS',
    name: 'TypeScript for Node.js Developers',
    issuer: 'LinkedIn Learning',
    year: '2026',
    url: 'https://www.linkedin.com/learning/certificates/c617789ec8b508b8757f11fea009e47be47bb946059414b943f4e9c578b684a1/',
  },
  {
    mark: 'DKR',
    name: 'Learning Docker',
    issuer: 'LinkedIn Learning',
    year: '2026',
    url: 'https://www.linkedin.com/learning/certificates/2cfbd2eb3a5af206d43f3f379341d74707c00ab0b22554c1892291973920fd6b/',
  },
  {
    mark: 'CIP',
    name: 'Introduction to CIP (Critical Infrastructure Protection)',
    issuer: 'OPSWAT Academy',
    year: '2026',
    url: 'https://learn.opswatacademy.com/certificate/y8AjX0NlUw',
  },
  { mark: 'SQL', name: 'Learn SQL', issuer: 'Codecademy', year: '2025' },
]

// ─── Project management guidebook ─────────────────────────────────────────────
// Source: the guidebook PDF itself (frontend/public/docs/). Written by
// Group 3, a team of six, in the project management course at Turku UAS.
//
// `page` is the PDF page each chapter starts on; the preview links straight
// to it with "#page=N", which browsers' built-in PDF viewers understand.
// `myChapters` holds the numbers of the chapters I wrote; they get a "Mine"
// tag in the preview. Leave it empty to show no tags.

export interface GuidebookChapter {
  title: string
  summary: string
  page: number
}

export const guidebook = {
  eyebrow: 'Course project · Team of 6',
  title: 'Project Management Guidebook',
  year: '2026',
  credit: 'Written by a team of six · Project management course, Turku UAS, 2026',
  description:
    'A practical guide for software project teams: choosing between Waterfall, Agile or a hybrid, then planning, scoping and running the project, with templates you can use straight away.',
  pdfUrl: '/docs/project-management-guidebook.pdf',
  pageCount: 54,
  myChapters: [] as number[],
  chapters: [
    { title: 'Introduction', page: 4, summary: 'What the guidebook is for: helping a project team understand frameworks, roles and responsibilities, and choose a management style that fits.' },
    { title: 'Waterfall project management', page: 4, summary: 'The six sequential stages from requirements to maintenance, their benefits and limits, and the projects where a fixed plan works best.' },
    { title: 'Agile & Lean project management', page: 6, summary: 'Scrum roles, events and artifacts; user stories, boards and backlogs; XP, SAFe and FDD; and a decision matrix and flowchart for Waterfall, Agile or hybrid.' },
    { title: 'WBS & Gantt chart', page: 19, summary: 'Breaking a software project into a Work Breakdown Structure, then scheduling it in a Gantt chart with dependencies, critical path and milestones.' },
    { title: 'Scope management', page: 23, summary: 'Deciding what is in and out of scope, stopping scope creep with a trade-off rule, and writing a scope management plan.' },
    { title: 'Risk management', page: 27, summary: 'Identifying and scoring risks, a four-step process with a worked example, and a risk register template.' },
    { title: 'Change management', page: 31, summary: 'A change management plan, an eight-step change request process, and how a change trades off scope, time and quality.' },
    { title: 'Quality management', page: 35, summary: 'Conformance versus fitness for use, quality planning, assurance and control in Agile and Waterfall, and six practical quality tools.' },
    { title: 'PM software', page: 42, summary: 'Jira, Trello and Microsoft Planner compared, and how to pick a tool for your team size, methodology and budget.' },
    { title: 'Professional development', page: 44, summary: 'Project management associations, from PMI and IPMA to Finland’s PRY, and certifications from CSM and PSM to PMP, with a suggested path.' },
    { title: 'Appendices', page: 51, summary: 'Sources, the team’s ethical AI use statement, and a ready-to-use change request form.' },
  ] as GuidebookChapter[],
}

// ─── How I work ───────────────────────────────────────────────────────────────
// Source: my LinkedIn posts (learning in public).

export const fit = {
  good: [
    'You want a backend developer who also thinks in planning artifacts: WBS, PBS, risk registers.',
    'Your team works in English, and doesn’t mind that my Finnish is still growing.',
    'You’d rather I understand the code than just ship it fast, including code an AI wrote.',
  ],
  notGood: [
    'The role needs fluent Finnish from day one.',
    'The work is mostly visual frontend design.',
    'You need one person to own the whole architecture alone from day one.',
  ],
}

export const workingSteps = [
  {
    title: 'Understand before speed',
    text: 'I want to be able to explain why every tool in the stack exists. Speed gives momentum; understanding lets you own the work.',
  },
  {
    title: 'Plan to find the gaps',
    text: 'A WBS says what work we’ll do; a PBS says what must exist at the end. Side by side, they show what task lists hide.',
  },
  {
    title: 'Thin layers, clear owners',
    text: 'Validation at the edge, thin controllers, logic in services. Same rule on the frontend: components show, hooks do.',
  },
  {
    title: 'Let the pipeline remember',
    text: 'Lint, type-check and build on every push, so I find out in minutes instead of after deploying.',
  },
]

// ─── Questions recruiters ask ─────────────────────────────────────────────────

export const faqs: { q: string; a: string }[] = [
  {
    q: 'When do you graduate?',
    a: 'July 2027. Bachelor of Engineering in Information and Communications Technology at Turku University of Applied Sciences.',
  },
  {
    q: 'Which roles are you looking for?',
    a: 'Backend or full-stack developer roles in Finland, on-site or hybrid: Node.js, TypeScript, PostgreSQL and Docker. My project management certificate makes me useful close to a delivery team too.',
  },
  {
    q: 'Have you worked in a real team?',
    a: 'Yes, two internships at theFIRMA, the Turku UAS ICT project office: full-stack on the Varaus reservation app in a Scrum team (autumn 2025), and backend on the Working Hours module of Project Gate 2.0 (summer 2026).',
  },
  {
    q: 'Which languages can we work in?',
    a: 'English. I passed the YKI Finnish exam in 2026 and I’m working towards the intermediate level.',
  },
  {
    q: 'Where can I see the code?',
    a: 'The public projects above link to GitHub. The internship code and my Backend Development course project live in private repositories, so I describe them instead of linking.',
  },
]

// ─── What I'm exploring ───────────────────────────────────────────────────────
// Source: repositories I've starred on GitHub (other people's work).

export const exploring = [
  { name: 'ossu/computer-science', note: 'Path to a free self-taught education in computer science', url: 'https://github.com/ossu/computer-science' },
  { name: 'papers-we-love/papers-we-love', note: 'Computer science papers to read and discuss', url: 'https://github.com/papers-we-love/papers-we-love' },
  { name: 'OWASP/APTS', note: 'OWASP Autonomous Penetration Testing Standard', url: 'https://github.com/OWASP/APTS' },
  { name: 'redcanaryco/atomic-red-team', note: 'Small, portable detection tests based on MITRE ATT&CK', url: 'https://github.com/redcanaryco/atomic-red-team' },
  { name: 'TauricResearch/TradingAgents', note: 'Multi-agent LLM framework for financial trading', url: 'https://github.com/TauricResearch/TradingAgents' },
  { name: 'hesreallyhim/awesome-claude-code', note: 'Curated resources for agentic coding with Claude Code', url: 'https://github.com/hesreallyhim/awesome-claude-code' },
]

// ─── Contact ──────────────────────────────────────────────────────────────────

export const contact = {
  heading: 'Let’s talk.',
  text: 'Backend or full-stack roles in Finland, on-site or hybrid. Email or LinkedIn both reach me.',
  footnote: 'References available on request.',
}
