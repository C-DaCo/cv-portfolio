import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary";

type ButtonAsButton = ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: "button";
  variant?: ButtonVariant;
};

type ButtonAsAnchor = AnchorHTMLAttributes<HTMLAnchorElement> & {
  as: "a";
  href: string;
  variant?: ButtonVariant;
};

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

/**
 * Composant Button polymorphique — rendu <button> ou <a> selon `as`
 * Accessible : focus-visible, aria supporté nativement
 */
export function Button({ variant = "primary", as, className: extraClass, children, ...props }: ButtonProps) {
  const className = [styles.btn, styles[variant], extraClass].filter(Boolean).join(" ");

  if (as === "a") {
    const { ...anchorProps } = props as ButtonAsAnchor;
    return (
      <a className={className} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { ...buttonProps } = props as ButtonAsButton;
  return (
    <button className={className} {...buttonProps}>
      {children}
    </button>
  );
}
