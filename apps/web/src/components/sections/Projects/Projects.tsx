import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useIntersectionObserver } from "@hooks/useIntersectionObserver";
import { useTheme } from "@hooks/useTheme";
import { ExternalLink, Github, ArrowRight, X } from "lucide-react";
import styles from "./Projects.module.scss";
import { Drawer } from "./Drawer/Drawer";
import { getProjects } from "@data/projects.data";
import type { Project } from "@/types/projects.types";

// ── Card ─────────────────────────────────────

function ProjectCard({ project, index, isVisible, onOpen }: {
  project: Project;
  index: number;
  isVisible: boolean;
  onOpen: (project: Project) => void;
}) {

  const { t } = useTranslation();
  return (
    <>
      <article
        className={`${styles.card} ${isVisible ? styles.visible : ""}`}
        style={{ transitionDelay: `${index * 0.15}s` }}
        aria-label={`${project.company} — ${project.title}`}
        onClick={() => onOpen(project)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onOpen(project)}
      >
        {/* ── Média ── */}
        <div className={styles.media}>
          {project.image && (
            <img
              src={project.image}
              alt={`Capture de ${project.title}`}
              className={styles.poster}
            />
          )}

          {!project.image && (
            <div className={styles.portfolioMedia} aria-hidden="true">
              <div className={styles.archDiagram}>
                {["Front", "API", "Tests", "i18n", "a11y"].map((label) => (
                  <span key={label} className={styles.archNode}>{label}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Contenu ── */}
        <div className={styles.content}>
          <div className={styles.meta}>
            <span className={styles.company}>{project.company}</span>
            <span className={styles.year}>{project.year}</span>
          </div>
          <h3 className={styles.title}>{project.title}</h3>
          <p className={styles.desc}>{project.desc}</p>
          <div className={styles.tags} role="list" aria-label="Technologies">
            {project.tags.map((tag) => (
              <span key={tag.label} role="listitem" className={`${styles.tag} ${styles[tag.variant]}`}>
                {tag.label}
              </span>
            ))}
          </div>
          <div className={styles.links}>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
                aria-label={`Voir le site ${project.title} (nouvelle fenêtre)`}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={14} strokeWidth={1.5} /> {project.linkLabel}
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
                aria-label="Voir le code source sur GitHub (nouvelle fenêtre)"
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={14} strokeWidth={1.5} /> GitHub
              </a>
            )}
          </div>
          {/* Badge "Voir le détail" */}
          <div className={styles.cardBadge} aria-hidden="true">
            {t("projects.seeDetail")} <ArrowRight size={11} strokeWidth={1.5} />
          </div>
        </div>
      </article>

    </>
  );
}

// ── Section ───────────────────────────────────

export function Projects() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

  const projects = getProjects(theme, t);

  return (
    <>
      <section id="projects" className={styles.projects} aria-labelledby="projects-title">
        <div ref={ref} className={`${styles.header} ${isVisible ? styles.visible : ""}`}>
          <p className={styles.eyebrow} aria-hidden="true">{t("projects.eyebrow")}</p>
          <h2 id="projects-title" className={styles.title}>{t("projects.title")}</h2>
          <p className={styles.subtitle}>{t("projects.subtitle")}</p>
        </div>

        <div className={styles.grid}>
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              isVisible={isVisible}
              onOpen={setActiveProject}
            />
          ))}
        </div>
      </section>

      <Drawer
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </>
  );
}