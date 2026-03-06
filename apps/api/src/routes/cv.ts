import { Router } from "express";

export const cvRouter = Router();

// GET /api/cv — retourne toutes les données du CV
cvRouter.get("/", (_req, res) => {
  // Les données CV sont importées statiquement
  // En production, elles pourraient venir d'une BDD
  res.json({
    success: true,
    data: getCVData(),
  });
});

// GET /api/cv/experiences
cvRouter.get("/experiences", (_req, res) => {
  const cv = getCVData();
  res.json({ success: true, data: cv.experiences });
});

// GET /api/cv/skills
cvRouter.get("/skills", (_req, res) => {
  const cv = getCVData();
  res.json({ success: true, data: cv.skills });
});

function getCVData() {
  return {
    personalInfo: {
      firstName: "Carole",
      lastName: "Rotton",
      title: "Développeuse Front-End",
      email: "caroledacosta.rotton@gmail.com",
      location: "France",
      remote: true,
    },
    experiences: [
      {
        id: "maskott",
        role: "Développeuse Web Front-End",
        company: "Maskott",
        sector: "EdTech",
        startDate: "2023-03",
        endDate: "2025-09",
        duration: "2.5 ans",
      },
      {
        id: "ktm-advance",
        role: "Développeuse Web Full Stack",
        company: "KTM Advance",
        sector: "EdTech",
        startDate: "2020-11",
        endDate: "2022-11",
        duration: "2 ans",
      },
      {
        id: "hippocad",
        role: "Développeuse App Mobile Front-End",
        company: "Hippocad",
        sector: "Santé",
        startDate: "2018-01",
        endDate: "2020-11",
        duration: "3 ans",
      },
    ],
    skills: {
      front: ["JavaScript", "TypeScript", "React", "Angular", "Redux", "SCSS", "Accessibilité"],
      back: ["Node.js", "PHP", "MongoDB", "PostgreSQL", "MySQL"],
      divers: ["GitLab", "JIRA", "SCRUM"],
    },
  };
}
