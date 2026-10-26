import type { Meta, StoryObj } from '@storybook/react';
import { StatusChip } from './StatusChip';

const meta: Meta<typeof StatusChip> = {
  title: 'Data display/StatusChip',
  component: StatusChip,
  tags: ['autodocs'],
  args: { tone: 'active', children: 'Active' },
};
export default meta;

export const Playground: StoryObj<typeof StatusChip> = {};

export const AllTones: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <StatusChip tone="critical">Critical</StatusChip>
      <StatusChip tone="active">Active</StatusChip>
      <StatusChip tone="chronic">Chronic</StatusChip>
      <StatusChip tone="resolved">Resolved</StatusChip>
      <StatusChip tone="info">Scheduled</StatusChip>
      <StatusChip tone="neutral">Cancelled</StatusChip>
    </div>
  ),
};
