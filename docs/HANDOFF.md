# Hand-off guide: reusing the revamped components

This guide is for developers rolling the new Patient Forms & Records components out to the rest of the app (dashboards, reports, admin screens).

## 1. Principles

1. **Presentation only.** Components receive data and callbacks through props. They never fetch data and never change the payloads the backend expects.
2. **Tokens, not values.** No hex codes, pixel spacing or font sizes go inside components. Everything references `var(--…)` from `src/styles/_tokens.scss`.
3. **One breakpoint vocabulary.** Use `mobile-only`, `tablet-up`, `tablet-only` and `desktop-up` from `_mixins.scss`. Never write a raw `@media` query.
4. **Accessible by default.** If a component needs an `aria-*` attribute to be usable, the component adds it. Consumers shouldn't have to remember.

## 2. Adopting this in the existing repo (incremental, low-risk)

| Step | Change | Risk |
|---|---|---|
| 1 | Add `_tokens.scss` + `_mixins.scss` and import tokens once in the global stylesheet | None. These are only new CSS variables |
| 2 | Add `components/` primitives; nothing uses them yet | None |
| 3 | Swap the styling of **one** form (e.g. intake) by wrapping its existing inputs with `Field` | Low: props and handlers are unchanged |
| 4 | Replace the records tables with `DataView`, feeding it the **same data array** the old table got | Low |
| 5 | Repeat per screen, one PR each, with before/after screenshots | Low |

### Wrapping a legacy input without touching its logic

```tsx
// Before
<label>Email</label>
<LegacyInput name="email" value={form.email} onChange={handleChange} />
{errors.email && <span className="err">{errors.email}</span>}

// After: same input, same props, same handler
<Field label="Email" required hint="For appointment reminders" error={errors.email}>
  {(a11y) => <LegacyInput {...a11y} name="email" value={form.email} onChange={handleChange} />}
</Field>
```

`Field` adds the label, hint, error message, `aria-describedby`, `aria-invalid` and the valid/invalid styling. The existing validation library (Formik, React Hook Form or custom) keeps producing `errors.email` exactly as it does today.

### Replacing a table with DataView

```tsx
const columns: DataColumn<Diagnosis>[] = [
  { id: 'condition', header: 'Condition', cell: (d) => d.condition, hideInCard: true },
  { id: 'icd', header: 'ICD-10', cell: (d) => <code>{d.icd10}</code> },
  { id: 'status', header: 'Status', cell: (d) => <StatusChip tone={d.status}>{d.status}</StatusChip>, hideInCard: true },
];

<DataView
  rows={existingRows}                  // same data the old table received
  columns={columns}
  getRowId={(d) => d.id}
  view={isMobile ? 'cards' : view}     // cards on phones; user's choice elsewhere
  caption="Diagnoses"
  cardTitle={(d) => d.condition}
  cardBadge={(d) => <StatusChip tone={d.status}>{d.status}</StatusChip>}
/>
```

## 3. Component reference

| Component | Use it for | Key props |
|---|---|---|
| `Button` | Any action | `variant` primary/secondary/ghost, `size`, `loading`, `icon`, `block` |
| `Field` | Wrapping **any** control (incl. legacy) | `label`, `hint`, `error`, `valid`, `required`, `optional`, render-prop child |
| `TextField` / `SelectField` / `TextAreaField` | Standard inputs | `Field` props + native input props |
| `ChoiceGroup` | ≤5 mutually exclusive options | `legend`, `options`, `value`, `onChange` |
| `Checkbox` | Consent, single booleans | `label`, `error` |
| `FormSection` | Grouping related fields | `title`, `description`, `step`, `complete`, `columns` 1–3 |
| `ErrorSummary` | Post-submit error list | `errors: {id, message}[]`; focus it via `ref` |
| `Card` | Any panel on a dashboard | `title`, `icon`, `count`, `actions`, `flush` |
| `DataView` | Any list of records | `rows`, `columns`, `view`, `cardTitle`, `cardBadge`, `accent` |
| `SegmentedControl` | Filters, view switches | `label`, `options`, `value`, `onChange` |
| `StatusChip` | Any clinical/workflow status | `tone`: critical · active · chronic · resolved · info · neutral |
| `Collapsible` | Secondary detail (notes, history) | `label`, `openLabel`, `defaultOpen` |
| `Tabs` + `TabPanel` | Section navigation | `items`, `value`, `onChange` |
| `EmptyState` | No-data states | `icon`, `title`, children |

Hooks:
- `useFormValidation(initial, rules)` validates on blur, then on change. `field(name)` returns props you can spread onto a field, and `validateAll()` runs on submit.
- `useMediaQuery(MOBILE_QUERY | DESKTOP_QUERY)` covers layout decisions that CSS can't make on its own.

## 4. Status colour semantics

Use the **same tone for the same meaning** everywhere, so clinicians learn it once.

| Tone | Meaning | Examples |
|---|---|---|
| `critical` | Needs action now | Critical diagnosis, abnormal lab, overdue |
| `active` | In progress / watch | Active condition, pending result, no-show |
| `chronic` | Long-term, stable | Diabetes, hypertension |
| `resolved` | Done / good | Resolved, completed visit, normal |
| `info` | Neutral scheduling info | Scheduled, booked |
| `neutral` | Inactive | Cancelled, archived |

## 5. Extending to dashboards & reports (phase 2)

- **KPI tiles**: the same structure as `PatientBanner`'s glance tiles. Extract them into a `StatTile` component.
- **Report tables**: `DataView` with sortable headers (add an optional `sort` prop to `DataColumn`).
- **Filters**: `SegmentedControl` for 2–4 options and `SelectField` for more.
- **Charts**: draw colours from tokens (`--color-primary`, `--status-*`) so charts match the status chips.

## 6. Checklist for every new screen

- [ ] Only tokens are used: no raw colours, spacing or font sizes
- [ ] Tested at 390 / 834 / 1440 px with no horizontal scroll on mobile
- [ ] Tab order matches visual order, and every action is reachable by keyboard
- [ ] Storybook story added, with the a11y panel showing 0 violations
- [ ] Status shown with text and colour, never colour alone
- [ ] No changes to API calls or submitted payloads
