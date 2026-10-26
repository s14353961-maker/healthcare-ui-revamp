import type { Meta, StoryObj } from '@storybook/react';
import { appointments, diagnoses, patient } from '../../data/mockPatient';
import { AppointmentsPanel } from './AppointmentsPanel';
import { MedicalHistory } from './MedicalHistory';
import { PatientBanner } from './PatientBanner';

const NOW = new Date('2026-10-27T09:00:00');
const meta: Meta = { title: 'Screens/Patient Records', parameters: { layout: 'fullscreen' }, decorators: [(S) => <div style={{ padding: 24 }}><S /></div>] };
export default meta;

export const Banner: StoryObj = { render: () => <PatientBanner patient={patient} diagnoses={diagnoses} appointments={appointments} now={NOW} /> };
export const History: StoryObj = { render: () => <MedicalHistory diagnoses={diagnoses} /> };
export const HistoryEmpty: StoryObj = { render: () => <MedicalHistory diagnoses={[]} /> };
export const Appointments: StoryObj = { render: () => <AppointmentsPanel appointments={appointments} now={NOW} /> };
