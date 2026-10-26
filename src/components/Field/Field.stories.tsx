import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox, ChoiceGroup, Field, SelectField, TextAreaField, TextField } from './Field';

const meta: Meta<typeof TextField> = {
  title: 'Forms/Fields',
  component: TextField,
  tags: ['autodocs'],
  decorators: [(S) => <div style={{ maxWidth: 360 }}><S /></div>],
};
export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = { args: { label: 'First name', required: true } };
export const WithHint: Story = { args: { label: 'Email', type: 'email', hint: 'For appointment reminders', required: true } };
export const Optional: Story = { args: { label: 'Preferred name', optional: true } };
export const Invalid: Story = { args: { label: 'Email', defaultValue: 'nell@', error: 'Enter an email like name@example.com', required: true } };
export const Valid: Story = { args: { label: 'First name', defaultValue: 'Eleanor', valid: true, required: true } };

export const Select: StoryObj = {
  render: () => (
    <SelectField label="Relationship" required placeholder="Select…" options={['Parent', 'Spouse / partner', 'Friend'].map((v) => ({ value: v, label: v }))} />
  ),
};

export const TextArea: StoryObj = {
  render: () => <TextAreaField label="Current medications" optional hint="Name, dose and how often" />,
};

export const Choices: StoryObj = {
  render: function Render() {
    const [v, setV] = useState('');
    return (
      <ChoiceGroup
        legend="Sex assigned at birth"
        name="sex"
        required
        value={v}
        onChange={(e) => setV(e.target.value)}
        options={[{ value: 'f', label: 'Female' }, { value: 'm', label: 'Male' }, { value: 'x', label: 'Intersex' }]}
      />
    );
  },
};

export const CheckboxConsent: StoryObj = {
  render: () => <Checkbox label="I consent to this information being stored in my medical record." />,
};

/** Wrapping a legacy input: Field supplies label/hint/error + a11y ids; the input keeps its own props. */
export const WrapLegacyInput: StoryObj = {
  render: () => (
    <Field label="MRN" hint="Wraps any existing control">
      {(a11y) => <input {...a11y} defaultValue="MRN-0048213" style={{ width: '100%', minHeight: 44, padding: 8 }} />}
    </Field>
  ),
};
