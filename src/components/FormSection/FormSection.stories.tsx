import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from '../Field/Field';
import { FormSection, formSpan } from './FormSection';

const meta: Meta<typeof FormSection> = {
  title: 'Forms/FormSection',
  component: FormSection,
  tags: ['autodocs'],
  args: { title: 'Personal details', description: "As shown on the patient's ID.", step: 1, columns: 3 },
  render: (args) => (
    <FormSection {...args}>
      <TextField label="First name" required />
      <TextField label="Last name" required />
      <TextField label="Preferred name" optional />
      <TextField className={formSpan.all} label="Home address" optional />
    </FormSection>
  ),
};
export default meta;
export const Default: StoryObj<typeof FormSection> = {};
export const Complete: StoryObj<typeof FormSection> = { args: { complete: true } };
export const TwoColumns: StoryObj<typeof FormSection> = { args: { columns: 2 } };
