import { useState, useId } from "react";
import styles from "./Contact.module.scss";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Github, Linkedin, MessageCircle } from "lucide-react";

// ── Types ──────────────────────────────────────

interface FormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

type Status = "idle" | "loading" | "success" | "error";

// ── Validation ────────────────────────────────

function validate(fields: FormFields, t: ReturnType<typeof useTranslation>['t']): FormErrors {
  const errors: FormErrors = {};
  if (fields.name.trim().length < 2) errors.name = t("contact.validation.nameMin");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = t("contact.validation.emailInvalid");
  if (fields.subject.trim().length < 5) errors.subject = t("contact.validation.subjectMin");
  if (fields.message.trim().length < 20) errors.message = t("contact.validation.messageMin");
  return errors;
}

// ── Composant ────────────────────────────────

export function Contact() {
  const { t } = useTranslation();
  const uid = useId();

  const [fields, setFields] = useState<FormFields>({
    name: "", email: "", subject: "", message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updated = { ...fields, [name]: value };
    setFields(updated);
    if (touched[name as keyof FormFields]) setErrors(validate(updated, t));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(fields, t));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(fields, t);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStatus("success");
      setFields({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const hasError = (field: keyof FormFields) => touched[field] && !!errors[field];

  return (
    <section
      id="contact"
      className={styles.contact}
      aria-labelledby="contact-title"
    >
      {/* ── Gauche : accroche ── */}
      <div className={styles.left}>
        <p className={styles.eyebrow} aria-hidden="true">{t("contact.eyebrow")}</p>
        <h2 id="contact-title" className={styles.title}>
          {t("contact.title")}<br />
          <em>{t("contact.titleAccent")}</em>
        </h2>
        <p className={styles.desc}>{t("contact.desc")}</p>

        {/* Infos de contact */}
        <ul className={styles.infoList} role="list">
          <li className={styles.infoItem}>
            <span className={styles.infoIcon} aria-hidden="true">
              <Mail size={16} strokeWidth={1.5} />
            </span>
            <a href="mailto:caroledacosta.rotton@gmail.com" className={styles.infoLink}>
              caroledacosta.rotton@gmail.com
            </a>
          </li>
          <li className={styles.infoItem}>
            <span className={styles.infoIcon} aria-hidden="true">
              <Phone size={16} strokeWidth={1.5} />
            </span>
            <a href="tel:+33687727549" className={styles.infoLink}>
              06 87 72 75 49
            </a>
          </li>
          <li className={styles.infoItem}>
            <span className={styles.infoIcon} aria-hidden="true">
              <MapPin size={16} strokeWidth={1.5} />
            </span>
            <span>France · Full Remote</span>
          </li>
        </ul>

        {/* Liens sociaux */}
        <div className={styles.socials}>
          
            <a href="https://github.com/C-DaCo"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Profil GitHub de Carole Rotton (nouvelle fenêtre)"
          >
            <Github size={18} strokeWidth={1.5} />
            <span>GitHub</span>
          </a>
          
           <a  href="https://www.linkedin.com/in/carole-rotton-b09854b0"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Profil LinkedIn de Carole Rotton (nouvelle fenêtre)"
          >
            <Linkedin size={18} strokeWidth={1.5} />
            <span>LinkedIn</span>
          </a>
          
            <a href="https://wa.me/33687727549"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.socialLink} ${styles.whatsapp}`}
            aria-label="Contacter Carole sur WhatsApp (nouvelle fenêtre)"
          >
            <MessageCircle size={18} strokeWidth={1.5} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* ── Droite : formulaire ── */}
      <div className={styles.right}>
        <div className={styles.formCard}>

          {status === "success" && (
            <div className={styles.successMsg} role="alert" aria-live="polite">
              <span className={styles.successIcon} aria-hidden="true">✓</span>
              <div>
                <strong>{t("contact.form.successTitle")}</strong>
                <p>{t("contact.form.successDesc")}</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className={styles.errorMsg} role="alert" aria-live="polite">
              {t("contact.form.errorMsg")}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate aria-label="Formulaire de contact">

            <div className={styles.field}>
              <label htmlFor={`${uid}-name`} className={styles.label}>
                {t("contact.form.name")}
              </label>
              <input
                id={`${uid}-name`} name="name" type="text"
                value={fields.name} onChange={handleChange} onBlur={handleBlur}
                className={`${styles.input} ${hasError("name") ? styles.inputError : ""}`}
                placeholder={t("contact.form.namePlaceholder")}
                autoComplete="name" aria-required="true"
                aria-invalid={hasError("name")}
                aria-describedby={hasError("name") ? `${uid}-name-err` : undefined}
              />
              {hasError("name") && (
                <p id={`${uid}-name-err`} className={styles.fieldError} role="alert">{errors.name}</p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor={`${uid}-email`} className={styles.label}>
                {t("contact.form.email")}
              </label>
              <input
                id={`${uid}-email`} name="email" type="email"
                value={fields.email} onChange={handleChange} onBlur={handleBlur}
                className={`${styles.input} ${hasError("email") ? styles.inputError : ""}`}
                placeholder={t("contact.form.emailPlaceholder")}
                autoComplete="email" aria-required="true"
                aria-invalid={hasError("email")}
                aria-describedby={hasError("email") ? `${uid}-email-err` : undefined}
              />
              {hasError("email") && (
                <p id={`${uid}-email-err`} className={styles.fieldError} role="alert">{errors.email}</p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor={`${uid}-subject`} className={styles.label}>
                {t("contact.form.subject")}
              </label>
              <input
                id={`${uid}-subject`} name="subject" type="text"
                value={fields.subject} onChange={handleChange} onBlur={handleBlur}
                className={`${styles.input} ${hasError("subject") ? styles.inputError : ""}`}
                placeholder={t("contact.form.subjectPlaceholder")}
                aria-required="true" aria-invalid={hasError("subject")}
                aria-describedby={hasError("subject") ? `${uid}-subject-err` : undefined}
              />
              {hasError("subject") && (
                <p id={`${uid}-subject-err`} className={styles.fieldError} role="alert">{errors.subject}</p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor={`${uid}-message`} className={styles.label}>
                {t("contact.form.message")}
              </label>
              <textarea
                id={`${uid}-message`} name="message"
                value={fields.message} onChange={handleChange} onBlur={handleBlur}
                className={`${styles.textarea} ${hasError("message") ? styles.inputError : ""}`}
                placeholder={t("contact.form.messagePlaceholder")}
                rows={5} aria-required="true" aria-invalid={hasError("message")}
                aria-describedby={hasError("message") ? `${uid}-message-err` : undefined}
              />
              {hasError("message") && (
                <p id={`${uid}-message-err`} className={styles.fieldError} role="alert">{errors.message}</p>
              )}
              <p className={styles.charCount} aria-live="polite">
                {fields.message.length} / 20 {t("contact.form.charMin")}
              </p>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={status === "loading"}
              aria-busy={status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  {t("contact.form.submitting")}
                </>
              ) : (
                <>
                  {t("contact.form.submit")}
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}