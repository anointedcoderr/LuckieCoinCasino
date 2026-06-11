import cx from '@/lib/cx'

// Labeled input, select, or textarea with a champagne gold focus ring and inline error.
export default function Field({
  label,
  name,
  type = 'text',
  as = 'input',
  value,
  onChange,
  error,
  hint,
  required = false,
  placeholder,
  options = [],
  rows = 4,
  className,
  children,
  ...rest
}) {
  const id = name || label
  const base =
    'w-full rounded-xl border bg-surface-2/70 px-4 py-3 text-sm text-ink placeholder:text-muted transition focus:border-primary/70 focus:outline-none focus:ring-2 focus:ring-primary/30'
  const border = error ? 'border-danger/60' : 'border-white/10'

  return (
    <div className={cx('w-full', className)}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-muted">
          {label}
          {required && <span className="text-primary"> *</span>}
        </label>
      )}
      {as === 'select' ? (
        <select id={id} name={name} value={value} onChange={onChange} className={cx(base, border)} {...rest}>
          {children ||
            options.map((o) =>
              typeof o === 'string' ? (
                <option key={o} value={o}>
                  {o}
                </option>
              ) : (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ),
            )}
        </select>
      ) : as === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          className={cx(base, border, 'resize-none')}
          {...rest}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cx(base, border)}
          {...rest}
        />
      )}
      {error ? (
        <p className="mt-1.5 text-xs text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
}
