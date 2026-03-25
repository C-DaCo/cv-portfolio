// ─────────────────────────────────────────────
// Projects Types
// ─────────────────────────────────────────────

export type TagVariant = "coral" | "sage" | "mauve" | "sand";

export interface ProjectTag {
  label: string;
  variant: TagVariant;
}

export interface ProjectTab {
  id: "video" | "screenshots" | "tests" | "archi";
  label: string;
}

export interface Project {
  id: string;
  company: string;
  title: string;
  desc: string;
  longDesc?: string;
  tags: ProjectTag[];
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  video?: string;
  screenshots?: string[];
  link?: string;
  linkLabel?: string;
  github?: string;
  year: string;
  tabs: ProjectTab[];
}