import type { ReactNode } from 'react';
import { cx } from '../../lib/format';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/Icon';
import styles from './Card.module.scss';

export interface CardProps {
  title?: string;
  icon?: IconName;
  count?: number;
  actions?: ReactNode;
  /** Removes body padding — for edge-to-edge tables. */
  flush?: boolean;
  as?: 'section' | 'article' | 'div';
  className?: string;
  children: ReactNode;
}

export function Card({ title, icon, count, actions, flush, as: Tag = 'section', className, children }: CardProps) {
  const headingId = title ? `card-${title.replace(/\W+/g, '-').toLowerCase()}` : undefined;
  return (
    <Tag className={cx(styles.card, className)} aria-labelledby={headingId}>
      {(title || actions) && (
        <header className={styles.header}>
          {title && (
            <div className={styles.titleWrap}>
              {icon && <span className={styles.icon}><Icon name={icon} size={20} /></span>}
              <h2 id={headingId} className={styles.title}>{title}</h2>
              {count !== undefined && <span className={styles.count} aria-label={`${count} items`}>{count}</span>}
            </div>
          )}
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
      )}
      <div className={cx(styles.body, flush && styles.flush)}>{children}</div>
    </Tag>
  );
}
