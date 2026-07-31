/**
 * coastal-translations.data.ts — EN/FI copy for CoastalHomePage
 *
 * Chrome (nav, labels, hero, stat captions) is translated. Long-form body
 * copy (project descriptions, delivery-practice paragraphs) stays in
 * English on both languages — langNote below says so explicitly — to
 * avoid maintaining two full prose passes for every project update.
 */

export interface CoastalStrings {
  nav1: string
  nav2: string
  nav3: string
  nav4: string
  nav5: string
  nav6: string
  cv: string
  cvView: string
  send: string
  langNote: string
  sec1: string
  sec2: string
  sec3: string
  sec4: string
  sec5: string
  sec6: string
  heroA: string
  heroAccent: string
  heroB: string
  heroIntro: string
  statRepos: string
  statSprints: string
  statCI: string
  caseStudy: string
  repoBtn: string
  timeline: string
  skillsSub: string
  certsNote: string
  addAdmin: string
  openSlot: string
  guidebook: string
  contactH: string
}

export const coastalTranslations: Record<'en' | 'fi', CoastalStrings> = {
  en: {
    nav1: 'Overview',
    nav2: 'Projects',
    nav3: 'Delivery & PM',
    nav4: 'Skills',
    nav5: 'Certificates',
    nav6: 'Contact',
    cv: 'Download CV ↓',
    cvView: 'Preview & download',
    send: 'Send a message',
    langNote: 'Body copy in English',
    sec1: '01 — Overview',
    sec2: '02 — Projects',
    sec3: '03 — How I run a project',
    sec4: '04 — Skills, with evidence',
    sec5: '05 — Certificates & coursework',
    sec6: '06 — Contact',
    heroA: 'Two disciplines, one delivery record:',
    heroAccent: 'code that ships',
    heroB: 'and projects that stay on the rails.',
    heroIntro:
      'I am in my third year of ICT Engineering at Turku University of Applied Sciences. Python and TypeScript on the engineering side; charters, risk registers and sprint governance on the project side. Every project below carries both.',
    statRepos: 'PUBLIC REPOS',
    statSprints: 'SPRINTS RUN',
    statCI: 'ON EVERY REPO',
    caseStudy: 'Case study →',
    repoBtn: 'Repository',
    timeline: 'DELIVERY TIMELINE',
    skillsSub: 'No percentages. Each skill points at the project where I used it.',
    certsNote: 'uploads appear here automatically',
    addAdmin: 'ADD FROM ADMIN PANEL',
    openSlot: 'Add a project from the admin panel — screenshots, stack and links, no code changes.',
    guidebook: 'Open guidebook →',
    contactH: 'Open to kesätyö, harjoittelu and thesis work from summer 2027.',
  },
  fi: {
    nav1: 'Yleiskatsaus',
    nav2: 'Projektit',
    nav3: 'Toteutus & PM',
    nav4: 'Osaaminen',
    nav5: 'Todistukset',
    nav6: 'Yhteystiedot',
    cv: 'Lataa CV ↓',
    cvView: 'Esikatsele & lataa',
    send: 'Lähetä viesti',
    langNote: 'Leipäteksti englanniksi',
    sec1: '01 — Yleiskatsaus',
    sec2: '02 — Projektit',
    sec3: '03 — Näin vedän projektin',
    sec4: '04 — Osaaminen, näytöillä',
    sec5: '05 — Todistukset ja kurssit',
    sec6: '06 — Yhteystiedot',
    heroA: 'Kaksi osaamisaluetta, yksi näyttö:',
    heroAccent: 'koodia joka toimii tuotannossa',
    heroB: 'ja projekteja jotka pysyvät aikataulussa.',
    heroIntro:
      'Opiskelen kolmatta vuotta ICT-insinööriksi Turun ammattikorkeakoulussa. Ohjelmistopuolella Python ja TypeScript; projektipuolella projektisuunnitelmat, riskirekisterit ja sprinttikäytännöt. Jokainen alla oleva projekti sisältää molemmat.',
    statRepos: 'JULKISTA REPOA',
    statSprints: 'SPRINTTIÄ',
    statCI: 'JOKA REPOSSA',
    caseStudy: 'Projektikuvaus →',
    repoBtn: 'Lähdekoodi',
    timeline: 'TOTEUTUSAIKATAULU',
    skillsSub: 'Ei prosentteja. Jokainen taito viittaa projektiin, jossa käytin sitä.',
    certsNote: 'lataukset ilmestyvät tänne automaattisesti',
    addAdmin: 'LISÄÄ HALLINNASTA',
    openSlot: 'Lisää projekti hallintapaneelista — kuvakaappaukset, teknologiat ja linkit ilman koodimuutoksia.',
    guidebook: 'Avaa opas →',
    contactH: 'Avoinna kesätöihin, harjoitteluun ja opinnäytetyöhön kesästä 2027 alkaen.',
  },
}
