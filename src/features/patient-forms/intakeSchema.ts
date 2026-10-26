import { compose, email, maxLength, pastDate, phone, required } from '../../lib/validators';
import type { Validator } from '../../lib/validators';

export const initialIntake = {
  firstName: '',
  lastName: '',
  preferredName: '',
  dob: '',
  sex: '',
  pronouns: '',
  phone: '',
  email: '',
  address: '',
  emergencyName: '',
  emergencyRelation: '',
  emergencyPhone: '',
  reason: '',
  symptoms: '',
  allergies: '',
  medications: '',
  consent: '',
};

export type IntakeField = keyof typeof initialIntake;

export const intakeRules: Partial<Record<IntakeField, Validator>> = {
  firstName: required('First name'),
  lastName: required('Last name'),
  dob: compose(required('Date of birth'), pastDate('Date of birth')),
  sex: required('Sex assigned at birth'),
  phone: compose(required('Mobile number'), phone),
  email: compose(required('Email'), email),
  emergencyName: required('Emergency contact name'),
  emergencyRelation: required('Relationship'),
  emergencyPhone: compose(required('Emergency contact number'), phone),
  reason: required('Reason for visit'),
  symptoms: maxLength(500),
  consent: required('Consent'),
};

/** Sections drive both the form layout and the progress navigation. */
export const intakeSections: { id: string; title: string; fields: IntakeField[] }[] = [
  { id: 'sec-personal', title: 'Personal details', fields: ['firstName', 'lastName', 'preferredName', 'dob', 'sex', 'pronouns'] },
  { id: 'sec-contact', title: 'Contact & emergency', fields: ['phone', 'email', 'address', 'emergencyName', 'emergencyRelation', 'emergencyPhone'] },
  { id: 'sec-clinical', title: 'Reason for visit', fields: ['reason', 'symptoms', 'allergies', 'medications'] },
  { id: 'sec-consent', title: 'Review & consent', fields: ['consent'] },
];

/** Id used for each field's control — the ErrorSummary links to these. */
export const fieldId = (name: IntakeField) => `intake-${name}`;
