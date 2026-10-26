import { useState } from 'react';
import { Icon, TabPanel, Tabs } from './components';
import { appointments, diagnoses, patient } from './data/mockPatient';
import { PatientIntakeForm } from './features/patient-forms/PatientIntakeForm';
import { PatientBanner } from './features/patient-records/PatientBanner';
import { PatientRecords } from './features/patient-records/PatientRecords';
import styles from './App.module.scss';

/** Fixed "today" so the synthetic demo always shows the same upcoming/past split. */
const DEMO_NOW = new Date('2026-10-27T09:00:00');

type View = 'records' | 'intake';

export default function App() {
  const [view, setView] = useState<View>('records');
  const critical = diagnoses.filter((d) => d.status === 'critical').length;

  return (
    <>
      <a href="#main" className={styles.skip}>Skip to content</a>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <span className={styles.brand}>
            <span className={styles.logo} aria-hidden="true"><Icon name="heart" size={18} /></span>
            Clinic Portal
          </span>
          <span className={styles.demoTag}>Demo · synthetic data</span>
        </div>
      </header>

      <main id="main" className={styles.main}>
        <PatientBanner patient={patient} diagnoses={diagnoses} appointments={appointments} now={DEMO_NOW} />

        <Tabs<View>
          label="Patient sections"
          value={view}
          onChange={setView}
          items={[
            { value: 'records', label: 'Records', icon: 'file', badge: critical || undefined },
            { value: 'intake', label: 'Intake form', icon: 'user' },
          ]}
        />

        <TabPanel value="records" active={view === 'records'}>
          <PatientRecords diagnoses={diagnoses} appointments={appointments} now={DEMO_NOW} />
        </TabPanel>
        <TabPanel value="intake" active={view === 'intake'}>
          <PatientIntakeForm onSubmit={() => new Promise((r) => setTimeout(r, 600))} />
        </TabPanel>
      </main>
    </>
  );
}
