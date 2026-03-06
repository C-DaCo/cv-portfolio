import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useIntersectionObserver } from "@hooks/useIntersectionObserver";
import { useTheme } from "@hooks/useTheme";
import { ExternalLink, Github, Play, Pause, Film, Maximize2, X } from "lucide-react";
import tacktileo from "@assets/projects/Tactileo-mockup.jpg";
import tacktiléoVideo from "@assets/projects/Video_Tactileo_Module.mp4";
import portfolioLight from "@assets/projects/Portfolio-Hero-Light.png";
import portfolioDark from "@assets/projects/Portfolio-Hero-Dark.png";
import styles from "./Projects.module.scss";
import { ArchDiagram } from "./ArchDiagram";

// ── Types ─────────────────────────────────────

interface Project {
  id: string;
  company: string;
  title: string;
  desc: string;
  tags: { label: string; variant: "coral" | "sage" | "mauve" | "sand" }[];
  image?: string;
  video?: string;
  link?: string;
  github?: string;
  year: string;
}

// ── Card ─────────────────────────────────────

function ProjectCard({ project, index, isVisible }: {
  project: Project;
  index: number;
  isVisible: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullVideoRef = useRef<HTMLVideoElement>(null);

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      setShowVideo(true);
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const openFullscreen = () => {
    setIsFullscreen(true);

    // Force landscape sur mobile
    const orientation = screen.orientation as ScreenOrientation & {
      lock?: (orientation: string) => Promise<void>;
    };
    orientation.lock?.("landscape").catch(() => {});
  
    setTimeout(() => {
      if (fullVideoRef.current && videoRef.current) {
        fullVideoRef.current.currentTime = videoRef.current.currentTime;
        if (isPlaying) fullVideoRef.current.play();
      }
    }, 100);
  };

  const closeFullscreen = () => {
    if (fullVideoRef.current && videoRef.current) {
      videoRef.current.currentTime = fullVideoRef.current.currentTime;
      fullVideoRef.current.pause();
    }
    setIsFullscreen(false);

    // Relâche l'orientation au retour
    const orientation = screen.orientation as ScreenOrientation & {
      unlock?: () => void;
    };
    orientation.unlock?.();
  };

  return (
    <>
      <article
        className={`${styles.card} ${isVisible ? styles.visible : ""}`}
        style={{ transitionDelay: `${index * 0.15}s` }}
        aria-label={`${project.company} — ${project.title}`}
      >
        {/* ── Média ── */}
        <div className={styles.media}>
          {project.image && !showVideo && (
            <img
              src={project.image}
              alt={`Capture de ${project.title}`}
              className={styles.poster}
            />
          )}

          {!project.image && !showVideo && (
            <div className={styles.portfolioMedia} aria-hidden="true">
              <div className={styles.archDiagram}>
                {["Front", "API", "Tests", "i18n", "a11y"].map((label) => (
                  <span key={label} className={styles.archNode}>{label}</span>
                ))}
              </div>
            </div>
          )}

          {project.video && (
            <>
              <video
                ref={videoRef}
                src={project.video}
                className={`${styles.video} ${showVideo ? styles.videoVisible : ""}`}
                onEnded={() => {
                  setIsPlaying(false);
                  setTimeout(() => setShowVideo(false), 300);
                }}
                playsInline
                aria-label={`Démo vidéo de ${project.title}`}
              />
              <button
                className={`${styles.playBtn} ${isPlaying ? styles.playBtnPlaying : ""}`}
                onClick={handlePlayToggle}
                aria-label={isPlaying ? "Mettre en pause la vidéo" : "Lancer la démo vidéo"}
              >
                {isPlaying
                  ? <Pause size={20} strokeWidth={1.5} />
                  : <><Play size={20} strokeWidth={1.5} /><span>Voir la démo</span></>
                }
              </button>
              {!isPlaying && (
                <span className={styles.videoBadge} aria-hidden="true">
                  <Film size={12} /> 1:26
                </span>
              )}
              {showVideo && (
                <button
                  className={styles.fullscreenBtn}
                  onClick={openFullscreen}
                  aria-label="Agrandir la vidéo"
                >
                  <Maximize2 size={14} strokeWidth={1.5} />
                </button>
              )}
            </>
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
              <a href={project.link} target="_blank" rel="noopener noreferrer"
                className={styles.link} aria-label={`Voir le site ${project.title} (nouvelle fenêtre)`}>
                <ExternalLink size={14} strokeWidth={1.5} /> Voir le site
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className={styles.link} aria-label="Voir le code source sur GitHub (nouvelle fenêtre)">
                <Github size={14} strokeWidth={1.5} /> GitHub
              </a>
            )}
            {project.id === "portfolio" && (
              <ArchDiagram />
            )}
          </div>
        </div>
      </article>

      {/* ── Modal fullscreen ── */}
      {isFullscreen && createPortal(
        <div
          className={styles.videoOverlay}
          onClick={closeFullscreen}
          role="dialog"
          aria-label="Vidéo en plein écran"
          aria-modal="true"
        >
          <button className={styles.overlayClose} onClick={closeFullscreen} aria-label="Fermer">
            <X size={20} />
          </button>
          <video
            ref={fullVideoRef}
            src={project.video}
            className={styles.fullVideo}
            controls
            autoPlay
            playsInline
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}
    </>
  );
}

// ── Section ───────────────────────────────────

export function Projects() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });

  // ← image recalculée à chaque changement de thème
  const portfolioImage = theme === "dark" ? portfolioLight : portfolioDark;

  const projects: Project[] = [
    {
      id: "maskott",
      company: "Maskott · EdTech",
      title: "Tactileo — Plateforme pédagogique",
      desc: "Lecteur de modules interactifs (QCM, drag & drop, textes à trou, vidéo, contenu pédagogique...), moteur de recommandation de ressources, Design System, Accessibilité WCAG 2.1.",
      tags: [
        { label: "React", variant: "coral" },
        { label: "TypeScript", variant: "coral" },
        { label: "GitLab", variant: "sage" },
        { label: "Docker", variant: "sage" },
        { label: "API", variant: "mauve" },
        { label: "Responsive Design", variant: "sand" },
      ],
      image: tacktileo,
      video: tacktiléoVideo,
      link: "https://www.maskott.com",
      year: "2023 — 2025",
    },
    {
      id: "portfolio",
      company: "Projet personnel",
      title: "Ce portfolio",
      desc: "Monorepo Turborepo, React 18, TypeScript, Node.js, API Resend, tests Vitest 42/42, i18n fr/en, accessibilité WCAG, menu a11y, dark/light mode automatique.",
      tags: [
        { label: "React", variant: "coral" },
        { label: "TypeScript", variant: "coral" },
        { label: "Node.js", variant: "sage" },
        { label: "Vitest", variant: "sage" },
        { label: "i18n", variant: "mauve" },
        { label: "WCAG", variant: "sand" },
      ],
      image: portfolioImage,
      github: "https://github.com/C-DaCo",
      year: "2026",
    },
  ];

  return (
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
          />
        ))}
      </div>
    </section>
  );
}