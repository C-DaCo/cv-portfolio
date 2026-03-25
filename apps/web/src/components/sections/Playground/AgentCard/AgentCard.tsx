import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@components/ui/Button/Button";
import styles from "./AgentCard.module.scss";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AgentCardProps {
  visible: boolean;
}

export function AgentCard({ visible }: AgentCardProps) {
  const { t } = useTranslation();

  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [techVisible, setTechVisible] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

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
          body: JSON.stringify({ mode: "chat", message: trimmed, history }),
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

  return (
    <div
      className={`${styles.card} ${styles.cardFull} ${visible ? styles.visible : ""}`}
      style={{ transitionDelay: "0.4s" }}
    >
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon} aria-hidden="true">✦</span>
        <div>
          <h3 className={styles.cardTitle}>{t("playground.agent.title")}</h3>
          <p className={styles.cardDesc}>{t("playground.agent.desc")}</p>
        </div>
      </div>

      <ul className={styles.featureList} aria-label={t("playground.agent.title")}>
        <li>{t("playground.agent.featureList.context")}</li>
        <li>{t("playground.agent.featureList.history")}</li>
        <li><code>claude-sonnet-4</code></li>
      </ul>

      <div className={styles.messages} role="log" aria-live="polite" aria-label={t("playground.agent.messagesLabel")}>
        {history.length === 0 && (
          <p className={styles.emptyState}>{t("playground.agent.emptyChat")}</p>
        )}
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

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.inputWrapper}>
        <label htmlFor="agent-input" className="sr-only">{t("playground.agent.inputLabel")}</label>
        <textarea
          id="agent-input"
          ref={inputRef}
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("playground.agent.inputPlaceholder")}
          rows={2}
          disabled={isLoading}
          aria-describedby="agent-hint"
        />
        <p id="agent-hint" className={styles.inputHint}>{t("playground.agent.inputHint")}</p>
        <Button
          className={styles.sendBtn}
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          aria-label={t("playground.agent.send")}
        >
          {t("playground.agent.send")} <span aria-hidden="true">→</span>
        </Button>
      </div>

      <div className={styles.techToggleWrapper}>
        <button
          className={styles.techToggle}
          onClick={() => setTechVisible((v) => !v)}
          aria-expanded={techVisible}
          aria-controls="agent-tech-panel"
        >
          <span className={styles.techToggleIcon} aria-hidden="true">{techVisible ? "▾" : "▸"}</span>
          {t("playground.agent.tech.toggle")}
        </button>
        {techVisible && (
          <div id="agent-tech-panel" className={styles.techPanel}>
            <div className={styles.techBlock}>
              <p className={styles.techLabel}>{t("playground.agent.tech.systemLabel")}</p>
              <pre className={styles.techPre}><code>{t("playground.agent.tech.systemChat")}</code></pre>
            </div>
            <div className={styles.techBlock}>
              <p className={styles.techLabel}>{t("playground.agent.tech.historyLabel")}</p>
              <pre className={styles.techPre}><code>{JSON.stringify(history, null, 2)}</code></pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
