import { Icon } from '../../components';
import { cx } from '../../lib/format';
import styles from './FormProgress.module.scss';

export interface FormProgressProps {
  sections: { id: string; title: string; complete: boolean }[];
}

/** Compact progress bar on mobile/tablet; adds a jump-to-section list on desktop. */
export function FormProgress({ sections }: FormProgressProps) {
  const done = sections.filter((s) => s.complete).length;
  const pct = Math.round((done / sections.length) * 100);
  return (
    <nav className={styles.progress} aria-label="Form progress">
      <div className={styles.top}>
        <span className={styles.label}>Intake progress</span>
        <span className={styles.pct}>{done} of {sections.length} sections</span>
      </div>
      <div className={styles.bar} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Sections completed">
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <ol className={styles.steps}>
        {sections.map((s, i) => (
          <li key={s.id} className={cx(styles.step, s.complete && styles.done)}>
            <a href={`#${s.id}`}>
              <span className={styles.dot} aria-hidden="true">{s.complete ? <Icon name="check" size={14} /> : i + 1}</span>
              {s.title}
              {s.complete && <span className="sr-only"> — complete</span>}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
