import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../lib/format';
import styles from './DataView.module.scss';

export interface DataColumn<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  align?: 'start' | 'end';
  nowrap?: boolean;
  /** Omit from the <dl> in card view (e.g. because it's already the card title or badge). */
  hideInCard?: boolean;
}

export interface DataViewProps<T> {
  rows: T[];
  columns: DataColumn<T>[];
  getRowId: (row: T) => string;
  view: 'table' | 'cards';
  /** Announced to screen readers as the table caption / list label. */
  caption: string;
  cardTitle: (row: T) => ReactNode;
  cardBadge?: (row: T) => ReactNode;
  cardFooter?: (row: T) => ReactNode;
  /** CSS colour for the row/card accent bar, e.g. `var(--status-critical-dot)`. */
  accent?: (row: T) => string | undefined;
  empty?: ReactNode;
}

/**
 * One data source, two presentations. Desktop users can pick a dense table or
 * scannable cards; on mobile the parent forces `view="cards"` so nothing scrolls sideways.
 */
export function DataView<T>({
  rows, columns, getRowId, view, caption, cardTitle, cardBadge, cardFooter, accent, empty,
}: DataViewProps<T>) {
  if (rows.length === 0) return <>{empty}</>;

  if (view === 'table') {
    return (
      <div className={styles.scroller} role="region" aria-label={caption} tabIndex={0}>
        <table className={styles.table}>
          <caption>{caption}</caption>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.id} scope="col" className={cx(c.align === 'end' && styles.alignEnd)}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const a = accent?.(row);
              return (
                <tr key={getRowId(row)} className={cx(a && styles.accent)} style={a ? ({ '--row-accent': a } as CSSProperties) : undefined}>
                  {columns.map((c) => (
                    <td key={c.id} className={cx(c.align === 'end' && styles.alignEnd, c.nowrap && styles.nowrap)}>
                      {c.cell(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  const metaColumns = columns.filter((c) => !c.hideInCard);
  return (
    <ul className={styles.cards} aria-label={caption}>
      {rows.map((row) => {
        const a = accent?.(row);
        return (
          <li key={getRowId(row)} className={styles.card} style={a ? ({ '--row-accent': a } as CSSProperties) : undefined}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>{cardTitle(row)}</h3>
              {cardBadge?.(row)}
            </div>
            {metaColumns.length > 0 && (
              <dl className={styles.meta}>
                {metaColumns.map((c) => (
                  <div key={c.id} style={{ display: 'contents' }}>
                    <dt>{c.header}</dt>
                    <dd>{c.cell(row)}</dd>
                  </div>
                ))}
              </dl>
            )}
            {cardFooter && cardFooter(row) && <div className={styles.cardFooter}>{cardFooter(row)}</div>}
          </li>
        );
      })}
    </ul>
  );
}
