import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { cx } from '../../lib/format';
import { Icon } from '../Icon/Icon';
import styles from './Collapsible.module.scss';

export interface CollapsibleProps {
  label: string;
  /** Label when open; defaults to `label`. */
  openLabel?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

/** Disclosure pattern (button + aria-expanded). Collapsed content is removed from tab order and the a11y tree. */
export function Collapsible({ label, openLabel, defaultOpen = false, children }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = `cl${useId().replace(/:/g, '')}`;
  return (
    <div>
      <button type="button" className={styles.trigger} aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        {open ? openLabel ?? label : label}
        <Icon name="chevronDown" size={16} />
      </button>
      <div id={id} className={cx(styles.region, open && styles.open)}>
        <div className={styles.inner}>{children}</div>
      </div>
    </div>
  );
}
