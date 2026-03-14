import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { PoemIllustration } from "./PoemIllustration";
import type { PoemData } from "./poem.utils";
import styles from "./AgentCard.module.scss";

type Mode = "chat" | "poem" | "motivation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AgentCardProps {
  visible: boolean;
}

export function AgentCard({ visible }: AgentCardProps) {
  const { t } = useTranslation();

  const [mode, setMode] = useState<Mode>("chat");
  const [caroleMode, setCaroleMode] = useState(false);
  const [techVisible, setTechVisible] = useState(false);
  const [input, setInput] = useState("");
  const [jobOffer, setJobOffer] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [poemData, setPoemData] = useState<PoemData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const iconClickCount = useRef(0);
  const iconClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleIconClick = () => {
    iconClickCount.current += 1;
    if (iconClickTimer.current) clearTimeout(iconClickTimer.current);
    if (iconClickCount.current >= 2) {
      iconClickCount.current = 0;
      setCaroleMode((prev) => {
        const next = !prev;
        if (next) handleModeChange("motivation");
        else handleModeChange("chat");
        return next;
      });
      return;
    }
    iconClickTimer.current = setTimeout(() => { iconClickCount.current = 0; }, 400);
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setHistory([]);
    setPoemData(null);
    setError(null);
    setInput("");
    setJobOffer("");
  };

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    if (mode === "motivation" && !jobOffer.trim()) {
      setError(t("playground.agent.errorNoOffer"));
      return;
    }
    const userMessage: Message = { role: "user", content: trimmed };
    const newHistory = [...history, userMessage];
    if (mode !== "poem") setHistory(newHistory);
    setInput("");
    setPoemData(null);
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL ?? "http://localhost:3001"}/api/agent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode,
            message: trimmed,
            history: mode !== "poem" ? history : [],
            jobOffer: mode === "motivation" ? jobOffer : undefined,
          }),
        }
      );
      const data = await res.json();
      if (!data.success) {
        setError(data.message ?? t("playground.agent.errorGeneric"));
        return;
      }
      if (mode === "poem") {
        setPoemData(data.poem);
      } else {
        setHistory([...newHistory, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setError(t("playground.agent.errorNetwork"));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const systemPrompt = mode === "chat"
    ? t("playground.agent.tech.systemChat")
    : mode === "motivation"
    ? t("playground.agent.tech.systemMotivation")
    : t("playground.agent.tech.systemPoem");

  const inputPlaceholder = mode === "chat"
    ? t("playground.agent.inputPlaceholderChat")
    : mode === "poem"
    ? t("playground.agent.inputPlaceholderPoem")
    : t("playground.agent.inputPlaceholderMotivation");

  const emptyStateText = mode === "chat"
    ? t("playground.agent.emptyChat")
    : mode === "poem"
    ? t("playground.agent.emptyPoem")
    : t("playground.agent.emptyMotivation");

  return (
    <div
      className={`${styles.card} ${styles.cardFull} ${visible ? styles.visible : ""}`}
      style={{ transitionDelay: "0.4s" }}
    >
      <div className={styles.cardHeader}>
        <button
          className={styles.cardIconBtn}
          onClick={handleIconClick}
          aria-label={caroleMode ? "Mode Carole actif" : "Assistant IA"}
        >
          <span className={`${styles.cardIcon} ${caroleMode ? styles.cardIconActive : ""}`} aria-hidden="true">✦</span>
        </button>
        <div>
          <h3 className={styles.cardTitle}>{t("playground.agent.title")}</h3>
          <p className={styles.cardDesc}>{t("playground.agent.desc")}</p>
        </div>
      </div>

      <ul className={styles.featureList} aria-label={t("playground.agent.title")}>
        <li>{t("playground.agent.featureList.context")}</li>
        <li>{t("playground.agent.featureList.history")}</li>
        <li>{t("playground.agent.featureList.modes")}</li>
        <li><code>claude-sonnet-4</code></li>
      </ul>

      <div className={styles.tabs} role="tablist" aria-label={t("playground.agent.tabsLabel")}>
        <button role="tab" aria-selected={mode === "chat"}
          className={`${styles.tab} ${mode === "chat" ? styles.tabActive : ""}`}
          onClick={() => handleModeChange("chat")}>
          {t("playground.agent.tabs.chat")}
        </button>
        <button role="tab" aria-selected={mode === "poem"}
          className={`${styles.tab} ${mode === "poem" ? styles.tabActive : ""}`}
          onClick={() => handleModeChange("poem")}>
          {t("playground.agent.tabs.poem")}
        </button>
        {caroleMode && (
          <button role="tab" aria-selected={mode === "motivation"}
            className={`${styles.tab} ${styles.tabSecret} ${mode === "motivation" ? styles.tabActive : ""}`}
            onClick={() => handleModeChange("motivation")}>
            {t("playground.agent.tabs.motivation")}
          </button>
        )}
      </div>

      {mode === "motivation" && (
        <div className={styles.offerWrapper}>
          <label htmlFor="job-offer" className={`sr-only ${styles.offerLabel}`}>{t("playground.agent.offerLabel")}</label>
          <textarea id="job-offer" className={styles.offerTextarea} value={jobOffer}
            onChange={(e) => setJobOffer(e.target.value)}
            placeholder={t("playground.agent.offerPlaceholder")} rows={4} />
        </div>
      )}

      {mode === "poem" && poemData && <PoemIllustration poemData={poemData} />}

      {mode !== "poem" && (
        <div className={styles.messages} role="log" aria-live="polite" aria-label={t("playground.agent.messagesLabel")}>
          {history.length === 0 && <p className={styles.emptyState}>{emptyStateText}</p>}
          {history.map((msg, i) => (
            <div key={i} className={`${styles.message} ${msg.role === "user" ? styles.messageUser : styles.messageAssistant}`}>
              <span className={styles.messageRole} aria-hidden="true">{msg.role === "user" ? "Vous" : "IA"}</span>
              <p className={styles.messageContent}>{msg.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className={styles.message} aria-live="polite">
              <span className={styles.messageRole} aria-hidden="true">IA</span>
              <span className={styles.loading} aria-label={t("playground.agent.loading")}><span /><span /><span /></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {mode === "poem" && !poemData && (
        <div className={styles.messages} aria-live="polite">
          {isLoading
            ? <div className={styles.message}>
                <span className={styles.messageRole} aria-hidden="true">IA</span>
                <span className={styles.loading} aria-label={t("playground.agent.loading")}><span /><span /><span /></span>
              </div>
            : <p className={styles.emptyState}>{emptyStateText}</p>
          }
        </div>
      )}

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.inputWrapper}>
        <label htmlFor="agent-input" className="sr-only">{t("playground.agent.inputLabel")}</label>
        <textarea id="agent-input" ref={inputRef} className={styles.input} value={input}
          onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
          placeholder={inputPlaceholder} rows={2} disabled={isLoading} aria-describedby="agent-hint" />
        <p id="agent-hint" className={styles.inputHint}>{t("playground.agent.inputHint")}</p>
        <button className={styles.sendBtn} onClick={handleSubmit}
          disabled={isLoading || !input.trim()} aria-label={t("playground.agent.send")}>
          {t("playground.agent.send")} <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className={styles.techToggleWrapper}>
        <button className={styles.techToggle} onClick={() => setTechVisible((v) => !v)}
          aria-expanded={techVisible} aria-controls="agent-tech-panel">
          <span className={styles.techToggleIcon} aria-hidden="true">{techVisible ? "▾" : "▸"}</span>
          {t("playground.agent.tech.toggle")}
        </button>
        {techVisible && (
          <div id="agent-tech-panel" className={styles.techPanel}>
            <div className={styles.techBlock}>
              <p className={styles.techLabel}>{t("playground.agent.tech.systemLabel")}</p>
              <pre className={styles.techPre}><code>{systemPrompt}</code></pre>
            </div>
            {mode !== "poem" && (
              <div className={styles.techBlock}>
                <p className={styles.techLabel}>{t("playground.agent.tech.historyLabel")}</p>
                <pre className={styles.techPre}><code>{JSON.stringify(history, null, 2)}</code></pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}