import { useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  Button, Checkbox, ChoiceGroup, ErrorSummary, FormSection, Icon, SelectField, TextAreaField, TextField, formSpan,
} from '../../components';
import { useFormValidation } from '../../hooks/useFormValidation';
import { FormProgress } from './FormProgress';
import { fieldId, initialIntake, intakeRules, intakeSections } from './intakeSchema';
import type { IntakeField } from './intakeSchema';
import styles from './PatientIntakeForm.module.scss';

export interface PatientIntakeFormProps {
  /**
   * The EXISTING submit handler from the app. The revamp only changes
   * presentation — this is called with the same values object as before.
   */
  onSubmit?: (values: typeof initialIntake) => Promise<void> | void;
  onSaveDraft?: (values: typeof initialIntake) => void;
}

const today = new Date().toISOString().slice(0, 10);

export function PatientIntakeForm({ onSubmit, onSaveDraft }: PatientIntakeFormProps) {
  const { values, field, validateAll } = useFormValidation(initialIntake, intakeRules);
  const [summary, setSummary] = useState<{ id: string; message: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  // `id` + `field()` wired together so the ErrorSummary can link straight to each control.
  const f = (name: IntakeField) => ({ ...field(name), id: fieldId(name) });

  const sectionState = useMemo(
    () =>
      intakeSections.map((s) => ({
        id: s.id,
        title: s.title,
        complete: s.fields
          .filter((k) => intakeRules[k])
          .every((k) => values[k] && !intakeRules[k]?.(values[k])),
      })),
    [values],
  );
  const isComplete = (id: string) => sectionState.find((s) => s.id === id)?.complete;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateAll();
    const list = (Object.keys(found) as IntakeField[]).map((k) => ({ id: fieldId(k), message: found[k]! }));
    setSummary(list);
    if (list.length) {
      setSubmitted(false);
      // wait a frame so the summary is in the DOM, then move focus to it
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit?.(values);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.layout}>
      <div className={styles.aside}>
        <FormProgress sections={sectionState} />
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate aria-label="Patient intake form">
        <p className={styles.intro}>
          Fields marked <span className={styles.req} aria-hidden="true">*</span>
          <span className="sr-only">with an asterisk</span> are required. Takes about 3 minutes.
        </p>

        <ErrorSummary ref={summaryRef} errors={summary} />

        {submitted && (
          <div className={styles.success} role="status">
            <Icon name="check" size={20} />
            <span>
              <strong>Intake form submitted</strong>
              Demo only — nothing was sent. In the real app this calls the existing submit handler unchanged.
            </span>
          </div>
        )}

        <FormSection id="sec-personal" step={1} title="Personal details" description="As shown on the patient's ID or insurance card." columns={3} complete={isComplete('sec-personal')}>
          <TextField label="First name" required autoComplete="given-name" {...f('firstName')} />
          <TextField label="Last name" required autoComplete="family-name" {...f('lastName')} />
          <TextField label="Preferred name" optional autoComplete="nickname" {...f('preferredName')} />
          <TextField label="Date of birth" required type="date" max={today} autoComplete="bday" {...f('dob')} />
          <SelectField
            label="Pronouns"
            optional
            placeholder="Select…"
            options={[
              { value: 'she/her', label: 'she/her' },
              { value: 'he/him', label: 'he/him' },
              { value: 'they/them', label: 'they/them' },
              { value: 'other', label: 'Other / prefer to describe' },
            ]}
            {...f('pronouns')}
          />
          <ChoiceGroup
            className={formSpan.all}
            legend="Sex assigned at birth"
            required
            hint="Used for clinical reference ranges only."
            options={[
              { value: 'female', label: 'Female' },
              { value: 'male', label: 'Male' },
              { value: 'intersex', label: 'Intersex' },
              { value: 'not-stated', label: 'Prefer not to say' },
            ]}
            {...f('sex')}
          />
        </FormSection>

        <FormSection id="sec-contact" step={2} title="Contact & emergency" complete={isComplete('sec-contact')}>
          <TextField label="Mobile number" required type="tel" inputMode="tel" autoComplete="tel" placeholder="(555) 000-0000" {...f('phone')} />
          <TextField label="Email" required type="email" inputMode="email" autoComplete="email" hint="For appointment reminders" {...f('email')} />
          <TextField className={formSpan.all} label="Home address" optional autoComplete="street-address" {...f('address')} />
          <TextField label="Emergency contact name" required autoComplete="off" {...f('emergencyName')} />
          <SelectField
            label="Relationship"
            required
            placeholder="Select…"
            options={['Spouse / partner', 'Parent', 'Child', 'Sibling', 'Friend', 'Carer', 'Other'].map((v) => ({ value: v, label: v }))}
            {...f('emergencyRelation')}
          />
          <TextField label="Emergency contact number" required type="tel" inputMode="tel" autoComplete="off" {...f('emergencyPhone')} />
        </FormSection>

        <FormSection id="sec-clinical" step={3} title="Reason for visit" description="Helps the care team prepare before the appointment." complete={isComplete('sec-clinical')}>
          <SelectField
            label="Reason for visit"
            required
            placeholder="Select a reason…"
            options={[
              { value: 'new-symptom', label: 'New symptom or illness' },
              { value: 'follow-up', label: 'Follow-up on existing condition' },
              { value: 'prescription', label: 'Prescription review' },
              { value: 'test-results', label: 'Discuss test results' },
              { value: 'preventive', label: 'Check-up / preventive care' },
            ]}
            {...f('reason')}
          />
          <TextAreaField
            className={formSpan.all}
            label="Describe your symptoms"
            optional
            maxLength={500}
            hint={`When they started and what makes them better or worse · ${values.symptoms.length}/500`}
            {...f('symptoms')}
          />
          <TextAreaField label="Known allergies" optional hint="Include the reaction if you know it" rows={3} {...f('allergies')} />
          <TextAreaField label="Current medications" optional hint="Name, dose and how often" rows={3} {...f('medications')} />
        </FormSection>

        <FormSection id="sec-consent" step={4} title="Review & consent" columns={1} complete={isComplete('sec-consent')}>
          <Checkbox
            label="I confirm the information above is accurate and consent to it being stored in my medical record."
            checked={values.consent === 'yes'}
            {...f('consent')}
            value="yes"
          />
        </FormSection>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => onSaveDraft?.(values)}>Save draft</Button>
          <Button type="submit" loading={submitting}>
            Submit intake form
          </Button>
        </div>
      </form>
    </div>
  );
}
