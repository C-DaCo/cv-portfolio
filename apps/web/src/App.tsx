import { lazy, Suspense } from "react";
import { Hero, Contact, Skills, Education, Experiences, Footer } from "@components/index";
import "@styles/main.scss";
import styles from "./App.module.scss";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { A11yMenu } from "@components/ui/A11yMenu/A11yMenu";
import { BackToTop } from "@components/ui/BackToTop/BackToTop";
import { SectionSkeleton } from "@components/ui/Skeleton/Skeleton";
import { useDocumentTitle } from "@hooks/useDocumentTitle";
import { Nav } from "@components/layout/Nav/Nav";

const Projects  = lazy(() => import("@components/sections/Projects/Projects").then(m => ({ default: m.Projects })));
const Playground = lazy(() => import("@components/sections/Playground/Playground").then(m => ({ default: m.Playground })));

export default function App() {
  const { t, i18n } = useTranslation();
  useDocumentTitle();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className={styles.app}>
      <a href="#main" className="skip-link">
        {t("skipLink")}
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <Experiences />
        <Suspense fallback={<SectionSkeleton />}>
          <Projects />
        </Suspense>
        <Skills />
        <Suspense fallback={<SectionSkeleton />}>
          <Playground />
        </Suspense>
        <Education />
        <Contact />
      </main>

      <Footer />
      <A11yMenu />
      <BackToTop />
    </div>
  );
}