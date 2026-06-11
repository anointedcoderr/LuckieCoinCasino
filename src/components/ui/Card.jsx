import cx from '@/lib/cx'

const variants = {
  glass: 'glass',
  'glass-dark': 'glass-dark',
  solid: 'bg-surface border border-divider',
  bare: '',
}

export default function Card({
  as: Tag = 'div',
  variant = 'glass',
  hover = false,
  glow = false,
  padding = 'p-6',
  className,
  children,
  ...rest
}) {
  return (
    <Tag
      className={cx(
        'rounded-3xl shadow-card',
        variants[variant] ?? variants.glass,
        hover && 'lift-on-hover transition hover:border-primary/45',
        glow && 'shadow-card-gold',
        padding,
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}
