import { useId } from 'react';
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { cx } from '../../lib/format';
import { Icon } from '../Icon/Icon';
import styles from './Field.module.scss';

interface FieldBaseProps {
  label: string;
  hint?: string;
  error?: string;
  /** Shows a subtle check once the field has been touched and passes validation. */
  valid?: boolean;
  required?: boolean;
  optional?: boolean;
  className?: string;
}

interface ControlA11yProps {
  id: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
}

/**
 * Field wraps ANY control with a label, hint and error message and wires up the
 * accessibility attributes. Use it directly to restyle a legacy input without
 * changing that input's props or handlers:
 *
 *   <Field label="MRN">{(a11y) => <LegacyInput {...a11y} {...legacyProps} />}</Field>
 */
export function Field({
  label,
  hint,
  error,
  valid,
  required,
  optional,
  className,
  children,
  id: idProp,
}: FieldBaseProps & { id?: string; children: (a11y: ControlA11yProps) => ReactNode }) {
  const autoId = useId();
  const id = idProp ?? `f${autoId.replace(/:/g, '')}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div
      className={cx(styles.field, error && styles.invalid, (error || valid) && styles.hasStatus, className)}
    >
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.required} aria-hidden="true">*</span>}
        {optional && <span className={styles.optional}>(optional)</span>}
      </label>
      <div className={styles.controlWrap}>
        {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy, 'aria-required': required || undefined })}
        {valid && !error && (
          <span className={cx(styles.statusIcon, styles.statusValid)}>
            <Icon name="check" size={18} />
          </span>
        )}
      </div>
      {/* Hint sits below the control so inputs in the same row stay aligned */}
      {hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className={styles.error}>
          <Icon name="alert" size={14} />
          {error}
        </span>
      )}
    </div>
  );
}

type TextFieldProps = FieldBaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>;

export function TextField({ label, hint, error, valid, required, optional, className, id, ...input }: TextFieldProps) {
  return (
    <Field {...{ label, hint, error, valid, required, optional, className, id }}>
      {(a11y) => <input className={styles.control} {...a11y} {...input} />}
    </Field>
  );
}

type SelectFieldProps = FieldBaseProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> & {
    options: { value: string; label: string }[];
    placeholder?: string;
  };

export function SelectField({
  label, hint, error, valid, required, optional, className, id, options, placeholder, ...select
}: SelectFieldProps) {
  return (
    <Field {...{ label, hint, error, required, optional, className, id }} valid={false}>
      {(a11y) => (
        <select className={styles.control} {...a11y} {...select}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

type TextAreaFieldProps = FieldBaseProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>;

export function TextAreaField({ label, hint, error, valid, required, optional, className, id, ...ta }: TextAreaFieldProps) {
  return (
    <Field {...{ label, hint, error, required, optional, className, id }} valid={false}>
      {(a11y) => <textarea className={styles.control} {...a11y} {...ta} />}
    </Field>
  );
}

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: ReactNode;
  error?: string;
  /** Accepted for API parity with other fields; checkboxes don't show a valid tick. */
  valid?: boolean;
};

export function Checkbox({ label, error, id: idProp, valid: _valid, ...input }: CheckboxProps) {
  const autoId = useId();
  const id = idProp ?? `c${autoId.replace(/:/g, '')}`;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={cx(styles.field, error && styles.invalid)}>
      <label className={styles.checkbox} htmlFor={id}>
        <input type="checkbox" id={id} aria-invalid={error ? true : undefined} aria-describedby={errorId} {...input} />
        <span>{label}</span>
      </label>
      {error && (
        <span id={errorId} className={styles.error}>
          <Icon name="alert" size={14} />
          {error}
        </span>
      )}
    </div>
  );
}

interface ChoiceGroupProps {
  legend: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: InputHTMLAttributes<HTMLInputElement>['onChange'];
  onBlur?: InputHTMLAttributes<HTMLInputElement>['onBlur'];
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  id?: string;
  valid?: boolean;
}

/** Radio group rendered as pill chips — faster to scan and tap than a select for ≤5 options. */
export function ChoiceGroup({ legend, name, value, options, onChange, onBlur, error, required, hint, className, id }: ChoiceGroupProps) {
  const autoId = useId();
  const base = id ?? `g${autoId.replace(/:/g, '')}`;
  const hintId = hint ? `${base}-hint` : undefined;
  const errorId = error ? `${base}-error` : undefined;
  return (
    <fieldset
      id={base}
      className={cx(styles.choiceGroup, error && styles.invalid, className)}
      aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend className={styles.label}>
        {legend}
        {required && <span className={styles.required} aria-hidden="true">*</span>}
      </legend>
      <div className={styles.choices}>
        {options.map((o, i) => (
          <label key={o.value} className={styles.choice}>
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={onChange}
              onBlur={onBlur}
              id={i === 0 ? `${base}-first` : undefined}
              required={required}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      {hint && <span id={hintId} className={styles.hint}>{hint}</span>}
      {error && (
        <span id={errorId} className={styles.error}>
          <Icon name="alert" size={14} />
          {error}
        </span>
      )}
    </fieldset>
  );
}
