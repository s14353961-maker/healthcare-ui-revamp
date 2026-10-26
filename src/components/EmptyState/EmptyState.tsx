import type { ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/Icon';
import styles from './EmptyState.module.scss';

export function EmptyState({ icon = 'file', title, children }: { icon?: IconName; title: string; children?: ReactNode }) {
  return (
    <div className={styles.empty}>
      <span className={styles.icon}><Icon name={icon} size={22} /></span>
      <p className={styles.title}>{title}</p>
      {children && <p className={styles.body}>{children}</p>}
    </div>
  );
}
