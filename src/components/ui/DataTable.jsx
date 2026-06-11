import cx from '@/lib/cx'

// Generic table for the management screens. The horizontal scroll lives on the
// wrapper, so wide tables never push the page sideways on small screens.
export default function DataTable({
  columns = [],
  rows = [],
  rowKey = 'id',
  actions,
  empty,
  dense = false,
  className,
}) {
  if (!rows.length && empty) return empty

  return (
    <div className={cx('glass overflow-x-auto rounded-3xl border border-white/10', className)}>
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 font-mono text-[11px] uppercase tracking-wider text-muted">
            {columns.map((c) => (
              <th
                key={c.key}
                className={cx(
                  'px-4 py-3.5 font-medium',
                  c.align === 'right' && 'text-right',
                  c.align === 'center' && 'text-center',
                )}
              >
                {c.header}
              </th>
            ))}
            {actions && <th className="px-4 py-3.5 text-right font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row[rowKey]}
              className="border-b border-white/5 transition last:border-0 hover:bg-white/[0.03]"
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cx(
                    'px-4 align-middle text-ink/90',
                    dense ? 'py-2.5' : 'py-3.5',
                    c.align === 'right' && 'text-right',
                    c.align === 'center' && 'text-center',
                  )}
                >
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
              {actions && <td className="px-4 py-3.5 text-right">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
