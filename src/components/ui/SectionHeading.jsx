import cx from '@/lib/cx'

export default function SectionHeading({
  eyebrow,
  title,
  flourish,
  subtitle,
  align = 'left',
  className,
}) {
  const centered = align === 'center'
  return (
    <div className={cx('max-w-2xl', centered && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary/80">{eyebrow}</p>
      )}
      <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
        {title}
        {flourish && (
          <span className="block text-balance font-serif text-2xl font-medium italic text-primary-light/90 sm:text-3xl lg:text-4xl">
            {flourish}
          </span>
        )}
      </h2>
      {subtitle && (
        <p className={cx('mt-4 text-base leading-relaxed text-muted', centered && 'mx-auto')}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
