import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import cx from '@/lib/cx'

const variants = {
  primary: 'bg-gold-sheen text-deep font-semibold shadow-coin-soft hover:shadow-coin-strong',
  secondary: 'glass text-ink border border-primary/30 hover:border-primary/60',
  ghost: 'text-ink/90 hover:text-primary',
  outline: 'border border-primary/40 text-primary hover:bg-primary/10',
  danger: 'bg-danger/90 text-ink font-semibold hover:bg-danger',
  emerald: 'bg-accent/90 text-ink font-semibold hover:bg-accent shadow-[0_0_18px_rgba(31,138,91,0.3)]',
}

const sizes = {
  sm: 'px-3.5 py-2 text-xs min-h-[40px]',
  md: 'px-5 py-2.5 text-sm min-h-[44px]',
  lg: 'px-7 py-3.5 text-base min-h-[48px]',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  fullWidth = false,
  className,
  children,
  ...rest
}) {
  const classes = cx(
    'magnetic-btn inline-flex items-center justify-center gap-2 rounded-full transition',
    'disabled:pointer-events-none disabled:opacity-50',
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    fullWidth && 'w-full',
    className,
  )

  const content = (
    <>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : Icon ? (
        <Icon className="h-4 w-4" strokeWidth={2.3} />
      ) : null}
      {children ? <span>{children}</span> : null}
      {IconRight && !loading ? <IconRight className="h-4 w-4" strokeWidth={2.3} /> : null}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }
  return (
    <button className={classes} disabled={loading || rest.disabled} {...rest}>
      {content}
    </button>
  )
}
