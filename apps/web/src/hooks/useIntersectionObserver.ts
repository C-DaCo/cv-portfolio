import { useState, useEffect, useRef, RefObject } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook pour déclencher des animations au scroll
 * Respecte `prefers-reduced-motion` en amont
 *
 * @example
 * const { ref, isVisible } = useIntersectionObserver({ triggerOnce: true });
 * return <section ref={ref} className={isVisible ? 'visible' : ''}> ... </section>
 */
export function useIntersectionObserver<T extends HTMLElement>(
  options: UseIntersectionObserverOptions = {}
): { ref: RefObject<T>; isVisible: boolean } {
  const { threshold = 0.1, rootMargin = "0px 0px -60px 0px", triggerOnce = true } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) observer.disconnect();
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}
