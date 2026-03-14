import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./AgentCard.module.scss";

// ── Types ─────────────────────────────────────────────────────────────────────

type Mode = "chat" | "motivation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// ── Composant ─────────────────────────────────────────────────────────────────

interface AgentCardProps {
  visible: boolean;
}

export function AgentCard({ visible }: AgentCardProps) {
  const { t } = useTranslation();

  const [mode, setMode] = useState<Mode>("chat");
  const [techVisible, setTechVisible] = useState(false);
  const [input, setInput] = useState("");
  const [jobOffer, setJobOffer] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll automatique vers le dernier message
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [history]);

  // Reset de l'historique au changement de mode
  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setHistory([]);
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
    setHistory(newHistory);
    setInput("");
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
            history: history, // on envoie l'historique avant le nouveau message
            jobOffer: mode === "motivation" ? jobOffer : undefined,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message ?? t("playground.agent.errorGeneric"));
        return;
      }

      setHistory([...newHistory, { role: "assistant", content: data.reply }]);
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
    : t("playground.agent.tech.systemMotivation");

  return (
    <div
      className={`${styles.card} ${styles.cardFull} ${visible ? styles.visible : ""}`}
      style={{ transitionDelay: "0.4s" }}
    >
      {/* ── Header ── */}
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon} aria-hidden="true">✦</span>
        <div>
          <h3 className={styles.cardTitle}>{t("playground.agent.title")}</h3>
          <p className={styles.cardDesc}>{t("playground.agent.desc")}</p>
        </div>
      </div>

      {/* ── Feature list ── */}
      <ul className={styles.featureList} aria-label={t("playground.agent.title")}>
        <li>{t("playground.agent.featureList.context")}</li>
        <li>{t("playground.agent.featureList.history")}</li>
        <li>{t("playground.agent.featureList.modes")}</li>
        <li><code>claude-sonnet-4</code></li>
      </ul>

      {/* ── Tabs mode ── */}
      <div className={styles.tabs} role="tablist" aria-label={t("playground.agent.tabsLabel")}>
        <button
          role="tab"
          aria-selected={mode === "chat"}
          className={`${styles.tab} ${mode === "chat" ? styles.tabActive : ""}`}
          onClick={() => handleModeChange("chat")}
        >
          {t("playground.agent.tabs.chat")}
        </button>
        <button
          role="tab"
          aria-selected={mode === "motivation"}
          className={`${styles.tab} ${mode === "motivation" ? styles.tabActive : ""}`}
          onClick={() => handleModeChange("motivation")}
        >
          {t("playground.agent.tabs.motivation")}
        </button>
      </div>

      {/* ── Offre d'emploi (mode motivation) ── */}
      {mode === "motivation" && (
        <div className={styles.offerWrapper}>
          <label htmlFor="job-offer" className={styles.offerLabel}>
            {t("playground.agent.offerLabel")}
          </label>
          <textarea
            id="job-offer"
            className={styles.offerTextarea}
            value={jobOffer}
            onChange={(e) => setJobOffer(e.target.value)}
            placeholder={t("playground.agent.offerPlaceholder")}
            rows={4}
          />
        </div>
      )}

      {/* ── Historique messages ── */}
      <div
        className={styles.messages}
        role="log"
        aria-live="polite"
        aria-label={t("playground.agent.messagesLabel")}
      >
        {history.length === 0 && (
          <p className={styles.emptyState}>
            {mode === "chat"
              ? t("playground.agent.emptyChat")
              : t("playground.agent.emptyMotivation")}
          </p>
        )}
        {history.map((msg, i) => (
          <div
            key={i}
            className={`${styles.message} ${msg.role === "user" ? styles.messageUser : styles.messageAssistant}`}
          >
            <span className={styles.messageRole} aria-hidden="true">
              {msg.role === "user" ? "Vous" : "IA"}
            </span>
            <p className={styles.messageContent}>{msg.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className={styles.message} aria-live="polite">
            <span className={styles.messageRole} aria-hidden="true">IA</span>
            <span className={styles.loading} aria-label={t("playground.agent.loading")}>
              <span /><span /><span />
            </span>
          </div>
        )}
        {error && (
          <p className={styles.error} role="alert">{error}</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div className={styles.inputWrapper}>
        <label htmlFor="agent-input" className="sr-only">
          {t("playground.agent.inputLabel")}
        </label>
        <textarea
          id="agent-input"
          ref={inputRef}
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            mode === "chat"
              ? t("playground.agent.inputPlaceholderChat")
              : t("playground.agent.inputPlaceholderMotivation")
          }
          rows={2}
          disabled={isLoading}
          aria-describedby="agent-hint"
        />
        <p id="agent-hint" className={styles.inputHint}>
          {t("playground.agent.inputHint")}
        </p>
        <button
          className={styles.sendBtn}
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          aria-label={t("playground.agent.send")}
        >
          {t("playground.agent.send")} <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* ── Toggle technique ── */}
      <div className={styles.techToggleWrapper}>
        <button
          className={styles.techToggle}
          onClick={() => setTechVisible((v) => !v)}
          aria-expanded={techVisible}
          aria-controls="agent-tech-panel"
        >
          <span className={styles.techToggleIcon} aria-hidden="true">
            {techVisible ? "▾" : "▸"}
          </span>
          {t("playground.agent.tech.toggle")}
        </button>

        {techVisible && (
          <div id="agent-tech-panel" className={styles.techPanel}>
            <div className={styles.techBlock}>
              <p className={styles.techLabel}>{t("playground.agent.tech.systemLabel")}</p>
              <pre className={styles.techPre}><code>{systemPrompt}</code></pre>
            </div>
            <div className={styles.techBlock}>
              <p className={styles.techLabel}>{t("playground.agent.tech.historyLabel")}</p>
              <pre className={styles.techPre}>
                <code>{JSON.stringify(history, null, 2)}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}