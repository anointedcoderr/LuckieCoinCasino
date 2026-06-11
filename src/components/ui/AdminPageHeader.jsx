// In content header for management pages. The page title lives in the topbar, so this
// shows the supporting description and the primary actions for the page.
export default function AdminPageHeader({ description, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {description && <p className="max-w-2xl text-sm leading-relaxed text-muted">{description}</p>}
      {actions && <div className="flex flex-wrap items-center gap-3 sm:ml-auto">{actions}</div>}
    </div>
  )
}
