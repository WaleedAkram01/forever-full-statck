function Title({ eyebrow, title, subtitle, align = 'center' }) {
    return (
        <div className={`mb-10 ${align === 'center' ? 'text-center' : ''}`}>
            {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
            <h2 className="text-3xl font-medium sm:text-4xl">{title}</h2>
            {subtitle && <p className={`mt-3 text-sm text-muted sm:text-base ${align === 'center' ? 'mx-auto max-w-xl' : ''}`}>{subtitle}</p>}
        </div>
    )
}

export default Title
