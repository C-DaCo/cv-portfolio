import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Film, Image, TestTube, Layers } from "lucide-react";
import { ArchDiagramContent } from "../ArchDiagram/ArchDiagram";
import { BrainBoostArchiContent } from "../ArchDiagram/BrainBoostArchiContent";
import type { Project, ProjectTab } from "@/types/projects.types";
import styles from "./Drawer.module.scss";
import { TestDashboardContent } from "@pages/TestDashboard/TestDashboardContent";
import { BrainBoostTestsStatic } from "@pages/TestDashboard/BrainBoostTestsStatic";
import { useTranslation } from "react-i18next";

// ── Icônes par onglet ─────────────────────────

const TAB_ICONS: Record<ProjectTab["id"], React.ReactNode> = {
    video: <Film size={13} strokeWidth={1.5} />,
    screenshots: <Image size={13} strokeWidth={1.5} />,
    tests: <TestTube size={13} strokeWidth={1.5} />,
    archi: <Layers size={13} strokeWidth={1.5} />,
};

// ── Tab contents ──────────────────────────────

function VideoTab({ project }: { project: Project }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Pause à la fermeture
        return () => { videoRef.current?.pause(); };
    }, []);

    if (!project.video) return null;

    return (
        <div className={styles.tabContent}>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
                ref={videoRef}
                src={project.video}
                className={styles.drawerVideo}
                controls
                playsInline
                aria-label={`Démo vidéo de ${project.title}`}
            />
        </div>
    );
}

function ScreenshotsTab({ project }: { project: Project }) {
    const [active, setActive] = useState(0);
    const shots = project.screenshots ?? [];

    if (shots.length === 0) return (
        <div className={styles.tabContent}>
            <p className={styles.empty}>Aucun screenshot disponible.</p>
        </div>
    );

    return (
        <div className={styles.tabContent}>
            <div className={styles.screenshotMain}>
                <img src={shots[active]} alt={`Screenshot ${active + 1} de ${project.title}`} className={styles.screenshotImg} loading="lazy" />
            </div>
            {shots.length > 1 && (
                <div className={styles.screenshotThumbs}>
                    {shots.map((src, i) => (
                        <button
                            key={i}
                            className={`${styles.thumb} ${i === active ? styles.thumbActive : ""}`}
                            onClick={() => setActive(i)}
                            aria-label={`Screenshot ${i + 1}`}
                        >
                            <img src={src} alt="" loading="lazy" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function TestsTab({ project }: { project: Project }) {
    return (
        <div className={styles.tabContent}>
            {project.id === "brainboost"
                ? <BrainBoostTestsStatic />
                : <TestDashboardContent />
            }
        </div>
    );
}

function ArchiTab({ project }: { project: Project }) {
    return (
        <div className={styles.tabContent}>
            {project.id === "brainboost"
                ? <BrainBoostArchiContent />
                : <ArchDiagramContent />
            }
        </div>
    );
}

// ── Drawer ────────────────────────────────────

interface DrawerProps {
    project: Project | null;
    onClose: () => void;
}

export function Drawer({ project, onClose }: DrawerProps) {
    const [activeTab, setActiveTab] = useState<ProjectTab["id"]>("screenshots");
    const [visible, setVisible] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const { t } = useTranslation();

    // Animate in
    useEffect(() => {
        if (project) {
            setActiveTab(project.tabs[0]?.id ?? "screenshots");
            requestAnimationFrame(() => setVisible(true));
        } else {
            setVisible(false);
        }
    }, [project]);

    // Focus trap + Escape
    useEffect(() => {
        if (!project) return;

        closeRef.current?.focus();

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [project, onClose]);

    // Scroll lock (iOS-safe)
    useEffect(() => {
        const restoreScroll = () => {
            const top = document.body.style.top;
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            if (top) try { window.scrollTo(0, -parseInt(top)); } catch { /* jsdom */ }
        };

        if (project) {
            const scrollY = window.scrollY;
            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = "100%";
        } else {
            restoreScroll();
        }
        return restoreScroll;
    }, [project]);

    if (!project) return null;

    const renderTabContent = () => {
        switch (activeTab) {
            case "screenshots": return <ScreenshotsTab project={project} />;
            case "video": return <VideoTab project={project} />;
            case "archi": return <ArchiTab project={project} />;
            case "tests": return <TestsTab project={project} />;
            default: return null;
        }
    };

    return createPortal(
        <div
            className={`${styles.overlay} ${visible ? styles.overlayVisible : ""}`}
            onClick={(e) => e.target === e.currentTarget && onClose()}
            role="dialog"
            aria-modal="true"
            aria-label={`Détail du projet — ${project.title}`}
        >
            <div
                ref={drawerRef}
                className={`${styles.drawer} ${visible ? styles.drawerVisible : ""}`}
            >
                {/* ── Header ── */}
                <div className={styles.drawerHeader}>
                    <div className={styles.drawerMeta}>
                        <span className={styles.drawerCompany}>{project.company}</span>
                        <span className={styles.drawerYear}>{project.year}</span>
                    </div>
                    <h2 className={styles.drawerTitle}>{project.title}</h2>

                    <button
                        ref={closeRef}
                        className={styles.closeBtn}
                        onClick={onClose}
                        aria-label={t("projects.close")}
                    >
                        <X size={18} strokeWidth={1.5} />
                    </button>
                </div>

                {/* ── Description ── */}
                <p className={styles.drawerDesc}>{project.longDesc ?? project.desc}</p>

                {/* ── Tags ── */}
                <div className={styles.drawerTags} role="list" aria-label="Technologies">
                    {project.tags.map((tag) => (
                        <span key={tag.label} role="listitem" className={`${styles.tag} ${styles[tag.variant]}`}>
                            {tag.label}
                        </span>
                    ))}
                </div>

                {/* ── Tabs ── */}
                <div className={styles.tabs} role="tablist">
                    {project.tabs.map((tab) => (
                        <button
                            key={tab.id}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {TAB_ICONS[tab.id]}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Contenu onglet ── */}
                <div className={styles.tabPanel} role="tabpanel" tabIndex={0}>
                    {renderTabContent()}
                </div>
            </div>
        </div>,
        document.body
    );
}