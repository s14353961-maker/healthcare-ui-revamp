import { Icon, StatusChip } from '../../components';
import type { Appointment, Diagnosis, Patient } from '../../data/types';
import { ageFrom, formatDate } from '../../lib/format';
import styles from './PatientBanner.module.scss';

export interface PatientBannerProps {
  patient: Patient;
  diagnoses: Diagnosis[];
  appointments: Appointment[];
  now?: Date;
}

/** Identity + safety-critical info (allergies) + at-a-glance numbers, always at the top of the record. */
export function PatientBanner({ patient, diagnoses, appointments, now = new Date() }: PatientBannerProps) {
  const current = diagnoses.filter((d) => d.status !== 'resolved');
  const critical = current.filter((d) => d.status === 'critical').length;
  const upcoming = appointments
    .filter((a) => a.status === 'scheduled' && new Date(a.date) >= now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const lastVisit = appointments
    .filter((a) => a.status === 'completed')
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))[0];
  const initials = `${patient.firstName[0]}${patient.lastName[0]}`;

  return (
    <section className={styles.banner} aria-label="Patient summary">
      <div className={styles.identity}>
        <span className={styles.avatar} aria-hidden="true">{initials}</span>
        <div>
          <h1 className={styles.name}>
            {patient.firstName} {patient.lastName}
            {patient.preferredName && <span className={styles.preferred}>“{patient.preferredName}”</span>}
          </h1>
          <dl className={styles.facts}>
            <div><dt>Age</dt><dd>{ageFrom(patient.dateOfBirth, now)}</dd></div>
            <div><dt>DOB</dt><dd>{formatDate(patient.dateOfBirth)}</dd></div>
            <div><dt>Sex</dt><dd>{patient.sexAtBirth}</dd></div>
            <div><dt>MRN</dt><dd className={styles.mono}>{patient.mrn}</dd></div>
            {patient.bloodType && <div><dt>Blood</dt><dd>{patient.bloodType}</dd></div>}
          </dl>
        </div>
      </div>

      {patient.allergies.length > 0 && (
        <div className={styles.allergy} role="note" aria-label="Allergies">
          <Icon name="alert" size={18} />
          <span>
            <strong>Allergies: </strong>
            {patient.allergies.map((a, i) => (
              <span key={a.substance}>
                {i > 0 && ' · '}
                <strong>{a.substance}</strong> ({a.reaction.toLowerCase()})
              </span>
            ))}
          </span>
        </div>
      )}

      <dl className={styles.glance}>
        <div className={styles.tile}>
          <dt>Current problems</dt>
          <dd>
            {current.length}
            {critical > 0 && <StatusChip tone="critical">{critical} critical</StatusChip>}
          </dd>
        </div>
        <div className={styles.tile}>
          <dt>Next appointment</dt>
          <dd>
            {upcoming[0] ? formatDate(upcoming[0].date) : '—'}
            {upcoming.length > 1 && <span className={styles.sub}>+{upcoming.length - 1} more</span>}
          </dd>
        </div>
        <div className={styles.tile}>
          <dt>Last visit</dt>
          <dd>{lastVisit ? formatDate(lastVisit.date) : '—'}</dd>
        </div>
        <div className={styles.tile}>
          <dt>Primary clinician</dt>
          <dd className={styles.clinician}>{patient.primaryClinician}</dd>
        </div>
      </dl>
    </section>
  );
}
