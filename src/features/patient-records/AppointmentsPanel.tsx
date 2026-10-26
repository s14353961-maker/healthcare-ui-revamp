import type { CSSProperties } from 'react';
import { Card, Collapsible, EmptyState, Icon, StatusChip } from '../../components';
import type { Appointment, ClinicalStatus } from '../../data/types';
import { formatDate, formatMonth, formatTime, formatWeekday } from '../../lib/format';
import styles from './AppointmentsPanel.module.scss';

const STATUS: Record<Appointment['status'], { tone: ClinicalStatus; label: string }> = {
  scheduled: { tone: 'info', label: 'Scheduled' },
  completed: { tone: 'resolved', label: 'Completed' },
  cancelled: { tone: 'neutral', label: 'Cancelled' },
  'no-show': { tone: 'active', label: 'No-show' },
};

function groupByMonth(items: Appointment[]) {
  const groups = new Map<string, Appointment[]>();
  for (const a of items) {
    const key = formatMonth(a.date);
    groups.set(key, [...(groups.get(key) ?? []), a]);
  }
  return [...groups.entries()];
}

export function AppointmentsPanel({ appointments, now = new Date() }: { appointments: Appointment[]; now?: Date }) {
  const upcoming = appointments
    .filter((a) => a.status === 'scheduled' && new Date(a.date) >= now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const past = appointments
    .filter((a) => !upcoming.includes(a))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <Card title="Appointments & care notes" icon="calendar" count={appointments.length}>
      <div className={styles.layout}>
        <section aria-labelledby="upcoming-heading">
          <h3 id="upcoming-heading" className={styles.heading}>Upcoming</h3>
          {upcoming.length === 0 ? (
            <EmptyState icon="calendar" title="No upcoming appointments" />
          ) : (
            <ul className={styles.upcoming}>
              {upcoming.map((a) => (
                <li key={a.id} className={styles.appt}>
                  <time className={styles.dateBlock} dateTime={a.date}>
                    <span className={styles.dow}>{formatWeekday(a.date)}</span>
                    <span className={styles.day}>{new Date(a.date).getDate()}</span>
                    <span className={styles.mon}>{new Date(a.date).toLocaleString('en-GB', { month: 'short' })}</span>
                  </time>
                  <div className={styles.apptBody}>
                    <p className={styles.apptTitle}>{a.type}</p>
                    <p className={styles.metaLine}><Icon name="clock" size={14} />{formatTime(a.date)} · {a.durationMin} min</p>
                    <p className={styles.metaLine}><Icon name="user" size={14} />{a.clinician}</p>
                    <p className={styles.metaLine}><Icon name="pin" size={14} />{a.location}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="past-heading">
          <h3 id="past-heading" className={styles.heading}>Past visits & care notes</h3>
          {groupByMonth(past).map(([month, items]) => (
            <div key={month} className={styles.month}>
              <h4 className={styles.monthLabel}>{month}</h4>
              <ol className={styles.timeline}>
                {items.map((a) => {
                  const s = STATUS[a.status];
                  return (
                    <li key={a.id} className={styles.entry}>
                      <span className={styles.node} style={{ '--node': `var(--status-${s.tone}-dot)` } as CSSProperties} aria-hidden="true" />
                      <div className={styles.entryHead}>
                        <span className={styles.entryTitle}>{a.type}</span>
                        <StatusChip tone={s.tone}>{s.label}</StatusChip>
                      </div>
                      <p className={styles.when}>
                        <time dateTime={a.date}>{formatDate(a.date)} · {formatTime(a.date)}</time>
                      </p>
                      <p className={styles.who}>{a.clinician}, {a.role} — {a.location}</p>

                      {a.careNote && (
                        <div className={styles.note}>
                          <p className={styles.summary}>{a.careNote.summary}</p>
                          <Collapsible label="Show plan & vitals" openLabel="Hide plan & vitals">
                            <div className={styles.details}>
                              {a.careNote.vitals && (
                                <dl className={styles.vitals} aria-label="Vitals">
                                  {a.careNote.vitals.map((v) => (
                                    <div key={v.label}><dt>{v.label}</dt><dd>{v.value}</dd></div>
                                  ))}
                                </dl>
                              )}
                              <div>
                                <p className={styles.planTitle}>Plan</p>
                                <ul className={styles.plan}>
                                  {a.careNote.plan.map((p) => <li key={p}>{p}</li>)}
                                </ul>
                              </div>
                            </div>
                          </Collapsible>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </section>
      </div>
    </Card>
  );
}
