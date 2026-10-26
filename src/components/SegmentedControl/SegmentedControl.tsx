import type { ReactNode } from 'react';
import styles from './SegmentedControl.module.scss';

export interface SegmentedOption<V extends string> {
  value: V;
  label: string;
  icon?: ReactNode;
  count?: number;
  /** Hide the visible label (icon-only) — label is still announced. */
  iconOnly?: boolean;
}

export interface SegmentedControlProps<V extends string> {
  label: string;
  value: V;
  options: SegmentedOption<V>[];
  onChange: (value: V) => void;
}

/** Toggle buttons (aria-pressed) for filters and view switches. */
export function SegmentedControl<V extends string>({ label, value, options, onChange }: SegmentedControlProps<V>) {
  return (
    <div className={styles.group} role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={styles.option}
          aria-pressed={o.value === value}
          aria-label={o.iconOnly ? o.label : undefined}
          title={o.iconOnly ? o.label : undefined}
          onClick={() => onChange(o.value)}
        >
          {o.icon}
          {!o.iconOnly && o.label}
          {o.count !== undefined && <span className={styles.count}>{o.count}</span>}
        </button>
      ))}
    </div>
  );
}
