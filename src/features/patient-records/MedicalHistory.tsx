import { useMemo, useState } from 'react';
import { Card, DataView, EmptyState, Icon, SegmentedControl, StatusChip } from '../../components';
import type { DataColumn } from '../../components';
import type { Diagnosis } from '../../data/types';
import { MOBILE_QUERY, useMediaQuery } from '../../hooks/useMediaQuery';
import { formatDate } from '../../lib/format';
import styles from './MedicalHistory.module.scss';

type Filter = 'current' | 'resolved' | 'all';
type View = 'table' | 'cards';

const STATUS_LABEL: Record<Diagnosis['status'], string> = {
  critical: 'Critical',
  active: 'Active',
  chronic: 'Chronic',
  resolved: 'Resolved',
};
const STATUS_ORDER: Record<Diagnosis['status'], number> = { critical: 0, active: 1, chronic: 2, resolved: 3 };
const accent = (d: Diagnosis) => `var(--status-${d.status}-dot)`;

const columns: DataColumn<Diagnosis>[] = [
  {
    id: 'condition',
    header: 'Condition',
    hideInCard: true,
    cell: (d) => (
      <>
        <div className={styles.condition}>{d.condition}</div>
        {d.note && <div className={styles.note}>{d.note}</div>}
      </>
    ),
  },
  { id: 'icd', header: 'ICD-10', nowrap: true, cell: (d) => <code className={styles.code}>{d.icd10}</code> },
  { id: 'status', header: 'Status', nowrap: true, hideInCard: true, cell: (d) => <StatusChip tone={d.status}>{STATUS_LABEL[d.status]}</StatusChip> },
  {
    id: 'onset',
    header: 'Onset',
    nowrap: true,
    cell: (d) => (
      <span className={styles.date}>
        {formatDate(d.onset)}
        {d.resolvedOn && <span className={styles.resolved}>Resolved {formatDate(d.resolvedOn)}</span>}
      </span>
    ),
  },
  { id: 'clinician', header: 'Clinician', nowrap: true, cell: (d) => d.clinician },
];

export function MedicalHistory({ diagnoses }: { diagnoses: Diagnosis[] }) {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const [filter, setFilter] = useState<Filter>('current');
  const [preferredView, setPreferredView] = useState<View>('table');
  const view: View = isMobile ? 'cards' : preferredView;

  const counts = useMemo(
    () => ({
      current: diagnoses.filter((d) => d.status !== 'resolved').length,
      resolved: diagnoses.filter((d) => d.status === 'resolved').length,
      all: diagnoses.length,
    }),
    [diagnoses],
  );

  const rows = useMemo(
    () =>
      diagnoses
        .filter((d) => (filter === 'all' ? true : filter === 'resolved' ? d.status === 'resolved' : d.status !== 'resolved'))
        .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || +new Date(b.onset) - +new Date(a.onset)),
    [diagnoses, filter],
  );

  return (
    <Card
      title="Medical history & diagnoses"
      icon="heart"
      flush
      actions={
        <>
          <SegmentedControl<Filter>
            label="Filter diagnoses"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'current', label: 'Current', count: counts.current },
              { value: 'resolved', label: 'Resolved', count: counts.resolved },
              { value: 'all', label: 'All', count: counts.all },
            ]}
          />
          {!isMobile && (
            <SegmentedControl<View>
              label="Layout"
              value={preferredView}
              onChange={setPreferredView}
              options={[
                { value: 'table', label: 'Table view', icon: <Icon name="table" size={16} />, iconOnly: true },
                { value: 'cards', label: 'Card view', icon: <Icon name="cards" size={16} />, iconOnly: true },
              ]}
            />
          )}
        </>
      }
    >
      <DataView
        rows={rows}
        columns={columns}
        getRowId={(d) => d.id}
        view={view}
        caption="Diagnoses"
        accent={accent}
        cardTitle={(d) => d.condition}
        cardBadge={(d) => <StatusChip tone={d.status}>{STATUS_LABEL[d.status]}</StatusChip>}
        cardFooter={(d) => d.note}
        empty={<EmptyState icon="heart" title="No diagnoses in this view">Try switching the filter to “All”.</EmptyState>}
      />
    </Card>
  );
}
