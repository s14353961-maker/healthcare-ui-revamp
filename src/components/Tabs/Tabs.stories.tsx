import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TabPanel, Tabs } from './Tabs';

const meta: Meta = { title: 'Navigation/Tabs', tags: ['autodocs'] };
export default meta;

export const Default: StoryObj = {
  render: function Render() {
    const [v, setV] = useState<'records' | 'intake'>('records');
    return (
      <>
        <Tabs label="Patient sections" value={v} onChange={setV} items={[
          { value: 'records', label: 'Records', icon: 'file', badge: 1 },
          { value: 'intake', label: 'Intake form', icon: 'user' },
        ]} />
        <TabPanel value="records" active={v === 'records'}><p style={{ padding: 16 }}>Records panel — use ← → to switch tabs.</p></TabPanel>
        <TabPanel value="intake" active={v === 'intake'}><p style={{ padding: 16 }}>Intake panel</p></TabPanel>
      </>
    );
  },
};
