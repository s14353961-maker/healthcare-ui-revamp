import type { ReactNode } from 'react';
import type { ClinicalStatus } from '../../data/types';
import { cx } from '../../lib/format';
import styles from './StatusChip.module.scss';

export interface StatusChipProps {
  tone: ClinicalStatus;
  children: ReactNode;
  className?: string;
}

/** Colour + dot + text: status is never conveyed by colour alone (WCAG 1.4.1). */
export function StatusChip({ tone, children, className }: StatusChipProps) {
  return (
    <span className={cx(styles.chip, styles[tone], className)}>
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </span>
  );
}
