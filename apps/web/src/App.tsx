import { Hero, Contact, Skills, Education, Experiences, Playground, Footer } from "@components/index";
import "@styles/main.scss";
import styles from "./App.module.scss";
import { useTranslation } from "react-i18next";
import { A11yMenu } from "@components/ui/A11yMenu/A11yMenu";
import { Projects } from "@components/index";
import { useDocumentTitle } from "@hooks/useDocumentTitle";
import { Nav } from "@components/layout/Nav/Nav";

export default function App() {
  const { t } = useTranslation();
  useDocumentTitle();

  return (
    <div className={styles.app}>
      <a href="#main" className="skip-link">
        {t("skipLink")}
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <Experiences />
        <Projects />
        <Skills />
        <Playground />
        <Education />
        <Contact />
      </main>

      <Footer />
      <A11yMenu />
    </div>
  );
}