import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Icon } from '../Icon/Icon';
import { SegmentedControl } from './SegmentedControl';

const meta: Meta = { title: 'Primitives/SegmentedControl', tags: ['autodocs'] };
export default meta;

export const Filter: StoryObj = {
  render: function Render() {
    const [v, setV] = useState<'current' | 'resolved' | 'all'>('current');
    return (
      <SegmentedControl
        label="Filter diagnoses"
        value={v}
        onChange={setV}
        options={[
          { value: 'current', label: 'Current', count: 4 },
          { value: 'resolved', label: 'Resolved', count: 2 },
          { value: 'all', label: 'All', count: 6 },
        ]}
      />
    );
  },
};

export const IconOnlyViewToggle: StoryObj = {
  render: function Render() {
    const [v, setV] = useState<'table' | 'cards'>('table');
    return (
      <SegmentedControl
        label="Layout"
        value={v}
        onChange={setV}
        options={[
          { value: 'table', label: 'Table view', icon: <Icon name="table" size={16} />, iconOnly: true },
          { value: 'cards', label: 'Card view', icon: <Icon name="cards" size={16} />, iconOnly: true },
        ]}
      />
    );
  },
};
