import { useCallback, useMemo, useState } from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import type { Validator } from '../lib/validators';

type Values<K extends string> = Record<K, string>;
type Errors<K extends string> = Partial<Record<K, string>>;

/**
 * Presentation-only form state helper.
 *
 * Validation strategy (kinder to users than validate-on-keystroke):
 *  - a field is validated the first time it loses focus ("touched")
 *  - after that it re-validates on every change, so errors clear as soon as they're fixed
 *  - submit validates everything and returns the list of errors for the ErrorSummary
 *
 * It does NOT submit anything — the existing app's submit handler stays in charge.
 */
export function useFormValidation<K extends string>(
  initial: Values<K>,
  rules: Partial<Record<K, Validator>>,
) {
  const [values, setValues] = useState<Values<K>>(initial);
  const [touched, setTouched] = useState<Partial<Record<K, boolean>>>({});
  const [errors, setErrors] = useState<Errors<K>>({});

  const validateField = useCallback(
    (name: K, value: string) => {
      const rule = rules[name];
      return rule ? rule(value) : undefined;
    },
    [rules],
  );

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      const next = type === 'checkbox' ? ((e.target as HTMLInputElement).checked ? 'yes' : '') : value;
      setValues((v) => ({ ...v, [name]: next }));
      if (touched[name as K]) {
        setErrors((er) => ({ ...er, [name]: validateField(name as K, next) }));
      }
    },
    [touched, validateField],
  );

  const onBlur = useCallback(
    (e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const name = e.target.name as K;
      setTouched((t) => ({ ...t, [name]: true }));
      setErrors((er) => ({ ...er, [name]: validateField(name, values[name] ?? '') }));
    },
    [validateField, values],
  );

  const validateAll = useCallback(() => {
    const next: Errors<K> = {};
    (Object.keys(values) as K[]).forEach((k) => {
      const err = validateField(k, values[k]);
      if (err) next[k] = err;
    });
    setErrors(next);
    setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])) as Record<K, boolean>);
    return next;
  }, [validateField, values]);

  const reset = useCallback(() => {
    setValues(initial);
    setErrors({});
    setTouched({});
  }, [initial]);

  /** Spread onto any field: `<TextField {...field('email')} />` */
  const field = useCallback(
    (name: K) => ({
      name,
      value: values[name],
      onChange,
      onBlur,
      error: errors[name],
      valid: Boolean(touched[name] && !errors[name] && values[name]),
    }),
    [values, onChange, onBlur, errors, touched],
  );

  const isValid = useMemo(() => Object.values(errors).every((e) => !e), [errors]);

  return { values, errors, touched, field, validateAll, reset, isValid, setValues };
}
