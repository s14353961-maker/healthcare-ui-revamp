export type ClinicalStatus = 'critical' | 'active' | 'chronic' | 'resolved' | 'info' | 'neutral';

export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  dateOfBirth: string; // ISO date
  sexAtBirth: 'Female' | 'Male' | 'Intersex' | 'Not stated';
  pronouns?: string;
  bloodType?: string;
  primaryClinician: string;
  allergies: { substance: string; reaction: string; severity: 'severe' | 'moderate' | 'mild' }[];
  phone: string;
  email: string;
}

export interface Diagnosis {
  id: string;
  condition: string;
  icd10: string;
  status: Exclude<ClinicalStatus, 'info' | 'neutral'>;
  onset: string; // ISO date
  resolvedOn?: string;
  clinician: string;
  note?: string;
}

export interface Appointment {
  id: string;
  date: string; // ISO datetime
  durationMin: number;
  type: string;
  clinician: string;
  role: string;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  careNote?: {
    summary: string;
    plan: string[];
    vitals?: { label: string; value: string }[];
  };
}
