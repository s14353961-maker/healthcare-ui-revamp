import type { Meta, StoryObj } from '@storybook/react';
import { Collapsible } from './Collapsible';

const meta: Meta<typeof Collapsible> = {
  title: 'Primitives/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  args: {
    label: 'Show plan & vitals',
    openLabel: 'Hide plan & vitals',
    children: <ul><li>Hold metformin</li><li>Repeat U&amp;E in 48 h</li></ul>,
  },
};
export default meta;
export const Closed: StoryObj<typeof Collapsible> = {};
export const Open: StoryObj<typeof Collapsible> = { args: { defaultOpen: true } };
