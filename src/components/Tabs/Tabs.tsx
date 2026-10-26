import { useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/Icon';
import styles from './Tabs.module.scss';

export interface TabItem<V extends string> {
  value: V;
  label: string;
  icon?: IconName;
  badge?: ReactNode;
}

export interface TabsProps<V extends string> {
  label: string;
  items: TabItem<V>[];
  value: V;
  onChange: (value: V) => void;
  idPrefix?: string;
}

/** WAI-ARIA tabs: roving tabindex, ←/→/Home/End keyboard support. */
export function Tabs<V extends string>({ label, items, value, onChange, idPrefix = 'tab' }: TabsProps<V>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const last = items.length - 1;
    const next =
      e.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : e.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    refs.current[next]?.focus();
    onChange(items[next].value);
  };

  return (
    <div role="tablist" aria-label={label} className={styles.list}>
      {items.map((item, i) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            ref={(el) => { refs.current[i] = el; }}
            role="tab"
            type="button"
            id={`${idPrefix}-${item.value}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${item.value}`}
            tabIndex={selected ? 0 : -1}
            className={styles.tab}
            onClick={() => onChange(item.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {item.icon && <Icon name={item.icon} size={18} />}
            {item.label}
            {item.badge !== undefined && <span className={styles.badge}>{item.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({ idPrefix = 'tab', value, active, children }: { idPrefix?: string; value: string; active: boolean; children: ReactNode }) {
  return (
    <div role="tabpanel" id={`${idPrefix}-panel-${value}`} aria-labelledby={`${idPrefix}-${value}`} hidden={!active} tabIndex={0}>
      {active && children}
    </div>
  );
}
