// Small, composable validators. Each returns an error message or undefined.
export type Validator = (value: string) => string | undefined;

export const required =
  (label: string): Validator =>
  (v) =>
    v.trim() ? undefined : `${label} is required`;

export const email: Validator = (v) =>
  !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? undefined : 'Enter an email like name@example.com';

export const phone: Validator = (v) => {
  if (!v) return undefined;
  const digits = v.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15 ? undefined : 'Enter a phone number with 7–15 digits';
};

export const pastDate =
  (label: string): Validator =>
  (v) => {
    if (!v) return undefined;
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return `Enter a valid ${label.toLowerCase()}`;
    return d > new Date() ? `${label} can't be in the future` : undefined;
  };

export const maxLength =
  (n: number): Validator =>
  (v) =>
    v.length <= n ? undefined : `Keep this under ${n} characters`;

export const compose =
  (...validators: Validator[]): Validator =>
  (v) => {
    for (const validate of validators) {
      const err = validate(v);
      if (err) return err;
    }
    return undefined;
  };
