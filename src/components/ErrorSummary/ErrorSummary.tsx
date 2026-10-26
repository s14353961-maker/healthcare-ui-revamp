import { forwardRef } from 'react';
import type { MouseEvent } from 'react';
import { Icon } from '../Icon/Icon';
import styles from './ErrorSummary.module.scss';

export interface ErrorSummaryProps {
  errors: { id: string; message: string }[];
  title?: string;
}

/**
 * Shown after a failed submit. Receives focus so screen-reader users hear it,
 * and each item jumps to (and focuses) the field that needs fixing.
 */
export const ErrorSummary = forwardRef<HTMLDivElement, ErrorSummaryProps>(function ErrorSummary(
  { errors, title = 'Please fix the following before saving' },
  ref,
) {
  if (errors.length === 0) return null;

  const jumpTo = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const focusable = el.matches('input, select, textarea, button')
      ? el
      : el.querySelector<HTMLElement>('input, select, textarea, button');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    focusable?.focus({ preventScroll: true });
  };

  return (
    <div ref={ref} className={styles.summary} role="alert" tabIndex={-1} aria-labelledby="error-summary-title">
      <h2 id="error-summary-title" className={styles.title}>
        <Icon name="alert" size={18} />
        {title} ({errors.length})
      </h2>
      <ul className={styles.list}>
        {errors.map((err) => (
          <li key={err.id}>
            <a href={`#${err.id}`} onClick={(e) => jumpTo(e, err.id)}>
              {err.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});
