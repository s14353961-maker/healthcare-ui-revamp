import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../Icon/Icon';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Save record' },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', children: 'Save draft' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Cancel' } };
export const WithIcon: Story = { args: { icon: <Icon name="calendar" />, children: 'Book appointment' } };
export const Loading: Story = { args: { loading: true, children: 'Submitting…' } };
export const Small: Story = { args: { size: 'sm', variant: 'secondary', children: 'Edit' } };
