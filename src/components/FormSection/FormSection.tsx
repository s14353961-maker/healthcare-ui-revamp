import type { ReactNode } from 'react';
import { cx } from '../../lib/format';
import { Icon } from '../Icon/Icon';
import styles from './FormSection.module.scss';

export interface FormSectionProps {
  id?: string;
  title: string;
  description?: string;
  step?: number;
  complete?: boolean;
  /** Responsive columns: 1 on mobile, up to 2 on tablet, up to 3 on desktop. */
  columns?: 1 | 2 | 3;
  children: ReactNode;
}

/** A semantic <fieldset> that groups related fields with a numbered header. */
export function FormSection({ id, title, description, step, complete, columns = 2, children }: FormSectionProps) {
  return (
    <fieldset id={id} className={cx(styles.section, complete && styles.complete)}>
      {/* legend must be the fieldset's first child to name the group for assistive tech */}
      <legend className={styles.legend}>
        {step !== undefined && (
          <span className={styles.step} aria-hidden="true">
            {complete ? <Icon name="check" size={16} /> : step}
          </span>
        )}
        <span>
          {title}
          {complete && <span className="sr-only"> (complete)</span>}
        </span>
      </legend>
      {description && <p className={styles.description}>{description}</p>}
      <div className={cx(styles.grid, columns === 2 && styles.cols2, columns === 3 && styles.cols3)}>{children}</div>
    </fieldset>
  );
}

/** Layout helpers for fields inside a FormSection grid. */
export const formSpan = { two: styles.span2, all: styles.spanAll };
