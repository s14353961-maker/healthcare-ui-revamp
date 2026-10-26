import type { Meta, StoryObj } from '@storybook/react';
import { diagnoses } from '../../data/mockPatient';
import type { Diagnosis } from '../../data/types';
import { StatusChip } from '../StatusChip/StatusChip';
import { DataView } from './DataView';
import type { DataColumn } from './DataView';

const columns: DataColumn<Diagnosis>[] = [
  { id: 'condition', header: 'Condition', hideInCard: true, cell: (d) => <strong>{d.condition}</strong> },
  { id: 'icd', header: 'ICD-10', cell: (d) => <code>{d.icd10}</code> },
  { id: 'status', header: 'Status', hideInCard: true, cell: (d) => <StatusChip tone={d.status}>{d.status}</StatusChip> },
  { id: 'clinician', header: 'Clinician', cell: (d) => d.clinician },
];

const meta: Meta<typeof DataView<Diagnosis>> = {
  title: 'Data display/DataView',
  component: DataView,
  tags: ['autodocs'],
  parameters: { backgrounds: { default: 'surface' } },
  args: {
    rows: diagnoses,
    columns,
    getRowId: (d: Diagnosis) => d.id,
    caption: 'Diagnoses',
    cardTitle: (d: Diagnosis) => d.condition,
    cardBadge: (d: Diagnosis) => <StatusChip tone={d.status}>{d.status}</StatusChip>,
    accent: (d: Diagnosis) => `var(--status-${d.status}-dot)`,
  },
};
export default meta;
type Story = StoryObj<typeof DataView<Diagnosis>>;

export const Table: Story = { args: { view: 'table' } };
export const Cards: Story = { args: { view: 'cards' } };
export const Empty: Story = { args: { view: 'table', rows: [], empty: <p>No records.</p> } };
