import type { Meta, StoryObj } from '@storybook/react';
import { ErrorSummary } from './ErrorSummary';

const meta: Meta<typeof ErrorSummary> = {
  title: 'Forms/ErrorSummary',
  component: ErrorSummary,
  tags: ['autodocs'],
  args: {
    errors: [
      { id: 'x-last', message: 'Last name is required' },
      { id: 'x-email', message: 'Enter an email like name@example.com' },
    ],
  },
};
export default meta;
export const Default: StoryObj<typeof ErrorSummary> = {};
