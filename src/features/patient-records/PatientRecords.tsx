import type { Appointment, Diagnosis } from '../../data/types';
import { AppointmentsPanel } from './AppointmentsPanel';
import { MedicalHistory } from './MedicalHistory';
import styles from './PatientRecords.module.scss';

/** Records screen = composition only. Data comes in via props, exactly as the existing app provides it. */
export function PatientRecords({ diagnoses, appointments, now }: { diagnoses: Diagnosis[]; appointments: Appointment[]; now?: Date }) {
  return (
    <div className={styles.stack}>
      <MedicalHistory diagnoses={diagnoses} />
      <AppointmentsPanel appointments={appointments} now={now} />
    </div>
  );
}
