import type { CVData } from "../types/cv.types";

export const cvData: CVData = {
  personalInfo: {
    firstName: "Carole",
    lastName: "Rotton",
    title: "Développeuse Front-End",
    subtitle: "Full Remote",
    tagline: "React · TypeScript · Node.js · EdTech",
    email: "caroledacosta.rotton@gmail.com",
    phone: "06 87 72 75 49",
    location: "France",
    remote: true,
    photo: "/assets/photo.jpg",
    links: [
      {
        platform: "github",
        url: "https://github.com/carole-rotton", // À mettre à jour
        label: "GitHub",
      },
      {
        platform: "linkedin",
        url: "https://linkedin.com/in/carole-rotton", // À mettre à jour
        label: "LinkedIn",
      },
    ],
  },

  summary:
    "Spécialisée en React et Node.js, avec plus de 5 ans d'expérience dans l'EdTech. Habituée à travailler en full remote au sein d'équipes agiles, je conçois des applications performantes, accessibles et scalables. Autonome, curieuse et passionnée par les bonnes pratiques, j'aime transformer des besoins complexes en solutions simples et efficaces.",

  experiences: [
    {
      id: "maskott",
      role: "Développeuse Web Front-End",
      company: "Maskott",
      companyLogo: "maskott",
      companyUrl: "https://www.maskott.com/",
      sector: "EdTech",
      location: "Full Remote",
      remote: true,
      startDate: "2023-03",
      endDate: "2025-09",
      duration: "2.5 ans",
      description: [
        "Création d'une application dédiée aux apprenants",
        "Évolutions et corrections du lecteur de contenu pédagogique",
        "Migration vers TypeScript du Design System conçu en React JS",
        "Création d'un outil de gestion d'abonnements via le GAR et d'analyse des usages",
        "Implémentation d'un moteur de recommandation de ressources",
      ],
      technologies: [
        { name: "React", category: "frontend" },
        { name: "TypeScript", category: "language" },
        { name: "Android", category: "mobile" },
        { name: "Capacitor", category: "mobile" },
        { name: "Node.js", category: "backend" },
        { name: "MongoDB", category: "database" },
        { name: "Python", category: "backend" },
      ],
    },
    {
      id: "ktm-advance",
      role: "Développeuse Web Full Stack",
      company: "KTM Advance",
      companyLogo: "ktmAdvance",
      companyUrl: "https://www.youtube.com/@KTMADVANCE1",
      sector: "EdTech",
      location: "Full Remote",
      remote: true,
      startDate: "2020-11",
      endDate: "2022-11",
      duration: "2 ans",
      description: [
        "Maintenance et évolution du moteur d'édition de modules de formation professionnelle",
        "Création de plus de 15 modules (Bouygues TP, Total, PSA, Agreenium...)",
        "Refonte du Back-Office dédié au recyclage des agents GRDF",
      ],
      technologies: [
        { name: "Angular JS", category: "frontend" },
        { name: "Angular TS", category: "frontend" },
        { name: "PHP", category: "backend" },
        { name: "PostgreSQL", category: "database" },
      ],
    },
    {
      id: "hippocad",
      role: "Développeuse App Mobile Front-End",
      company: "Hippocad",
      companyLogo: "hippocad",
      companyUrl: "https://www.domiserve.com/",
      sector: "Santé",
      location: "Fontainebleau 77",
      remote: false,
      startDate: "2018-01",
      endDate: "2020-11",
      duration: "3 ans",
      description: [
        "Développement d'une application mobile",
        "Maintenance et amélioration de l'application existante",
      ],
      technologies: [
        { name: "ExtJS", category: "frontend" },
        { name: "Android", category: "mobile" },
        { name: "Java", category: "language" },
      ],
    },
  ],

  skills: [
  // Langages
  { name: "JavaScript", category: "language", level: 5 },
  { name: "TypeScript", category: "language", level: 4 },
  { name: "PHP",        category: "language", level: 3 },
  { name: "Python",     category: "language", level: 2 },
  { name: "Java",       category: "language", level: 2 },
  // Front
  { name: "React",          category: "front", level: 5 },
  { name: "SCSS",           category: "front", level: 4 },
  { name: "Redux",          category: "front", level: 4 },
  { name: "Responsive",     category: "front", level: 5 },
  { name: "Accessibilité",  category: "front", level: 4 },
  { name: "Angular",        category: "front", level: 3 },
  { name: "ExtJS",          category: "front", level: 2 },
  // Back
  { name: "Node.js",    category: "back", level: 4 },
  { name: "MongoDB",    category: "back", level: 3 },
  { name: "PostgreSQL", category: "back", level: 3 },
  { name: "MySQL",      category: "back", level: 3 },
  // Outils
  { name: "GitLab",    category: "divers", level: 4 },
  { name: "SCRUM",     category: "divers", level: 4 },
  { name: "JIRA",      category: "divers", level: 4 },
  { name: "Capacitor", category: "divers", level: 3 },
  { name: "Android",   category: "divers", level: 2 },
],

  formations: [
    {
      id: "dawan",
      school: "DAWAN",
      url: "https://www.dawan.fr/",
      year: "2022",
      duration: "2 semaines",
      degree: "Formation NodeJS & React",
      logo: "logoDawan",
    },
    {
      id: "ifocop",
      school: "IFOCOP",
      url: "https://www.ifocop.fr/domaines-de-formation/developpement-web/",
      year: "2017",
      duration: "1 an",
      degree: "Titre RNCP niveau II — Développeuse Web",
      logo: "logoIfocop",
    },
    {
      id: "openclassrooms",
      school: "OpenClassrooms",
      url: "https://openclassrooms.com/fr/",
      year: "2016",
      duration: "6 mois",
      degree: "Certifications HTML5/CSS3 & PHP/MySQL",
      logo: "logoOcr",
    },
  ],

  languages: [
    { name: "Français", level: "natif" },
    { name: "Anglais", level: "intermédiaire" },
  ],
};
