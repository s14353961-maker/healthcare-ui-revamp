const dateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const timeFmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });
const monthFmt = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });
const weekdayFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short' });

export const formatDate = (iso: string) => dateFmt.format(new Date(iso));
export const formatTime = (iso: string) => timeFmt.format(new Date(iso));
export const formatMonth = (iso: string) => monthFmt.format(new Date(iso));
export const formatWeekday = (iso: string) => weekdayFmt.format(new Date(iso));

export function ageFrom(isoDob: string, now = new Date()): number {
  const dob = new Date(isoDob);
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}
