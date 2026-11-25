import { Link } from 'react-router-dom'

export default function Logo({ className = '' }) {
    return (
        <Link to="/" aria-label="Kapra home" className={`font-display text-[28px] font-semibold leading-none tracking-tight text-ink ${className}`}>
            kapra<span className="text-rust">.</span>
        </Link>
    )
}
