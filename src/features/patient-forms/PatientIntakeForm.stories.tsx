import type { Meta, StoryObj } from '@storybook/react';
import { PatientIntakeForm } from './PatientIntakeForm';

const meta: Meta<typeof PatientIntakeForm> = {
  title: 'Screens/Patient Intake Form',
  component: PatientIntakeForm,
  parameters: { layout: 'fullscreen' },
  decorators: [(S) => <div style={{ padding: 24 }}><S /></div>],
  args: { onSubmit: (v) => new Promise((r) => { console.log('submit', v); setTimeout(r, 600); }) },
};
export default meta;
export const Default: StoryObj<typeof PatientIntakeForm> = {};
