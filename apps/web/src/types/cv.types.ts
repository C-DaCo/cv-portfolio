// ─────────────────────────────────────────────
// CV Data Types
// ─────────────────────────────────────────────

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  subtitle: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  remote: boolean;
  photo: string;
  links: SocialLink[];
}

export interface SocialLink {
  platform: "github" | "linkedin" | "portfolio" | "other";
  url: string;
  label: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  companyLogo: string;
  companyUrl: string;
  sector: string;
  location: string;
  remote: boolean;
  startDate: string;       // ISO format: "2023-03"
  endDate: string | null;  // null = en poste
  duration: string;        // "2.5 ans"
  description: string[];
  technologies: Technology[];
}

export interface Technology {
  name: string;
  category: TechCategory;
}

export type TechCategory =
  | "frontend"
  | "backend"
  | "mobile"
  | "database"
  | "devops"
  | "tools"
  | "language";

export interface Skill {
  name: string;
  category: SkillCategory;
  level: 1 | 2 | 3 | 4 | 5;
}

export type SkillCategory = "front" | "back" | "divers" | "language";

export interface Formation {
  id: string;
  school: string;
  url?: string;
  year: string;
  duration: string;
  degree: string;
  logo: string;
  certifications?: string[];
}

export interface Language {
  name: string;
  level: "natif" | "courant" | "professionnel" | "intermédiaire" | "notions";
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experiences: Experience[];
  skills: Skill[];
  formations: Formation[];
  languages: Language[];
}
