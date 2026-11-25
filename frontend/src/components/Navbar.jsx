import { useContext, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/shop'
import Logo from './Logo'
import { BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from './Icons'

const links = [
    { to: '/', label: 'Home' },
    { to: '/collection', label: 'Shop' },
    { to: '/about', label: 'Our Story' },
    { to: '/contact', label: 'Contact' },
]

function Navbar() {
    const [open, setOpen] = useState(false)
    const { setShowSearch, getCartCount, navigate, token, logout } = useContext(ShopContext)
    const location = useLocation()
    const count = getCartCount()

    const openSearch = () => {
        setShowSearch(true)
        if (!location.pathname.includes('collection')) navigate('/collection')
    }

    return (
        <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur">
            <div className="bg-ink py-2 text-center text-[11px] font-medium uppercase tracking-widest2 text-cream">
                Free exchanges within 7 days · Cash on delivery across Pakistan
            </div>
            <nav className="container-page flex h-16 items-center justify-between">
                <Logo />

                <ul className="hidden items-center gap-8 text-sm sm:flex">
                    {links.map((l) => (
                        <li key={l.to}>
                            <NavLink to={l.to} end={l.to === '/'} className="group flex flex-col items-center gap-1 text-muted transition hover:text-ink [&.active]:text-ink">
                                {l.label}
                                <span className="h-px w-0 bg-rust transition-all group-hover:w-full group-[.active]:w-full" />
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-5">
                    <button onClick={openSearch} aria-label="Search" className="transition hover:text-rust"><SearchIcon /></button>

                    <div className="group relative">
                        <button aria-label="Account" onClick={() => (token ? navigate('/orders') : navigate('/login'))} className="transition hover:text-rust"><UserIcon /></button>
                        {token && (
                            <div className="invisible absolute right-0 top-full z-50 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
                                <div className="card flex w-40 flex-col py-2 text-sm shadow-lg">
                                    <button onClick={() => navigate('/orders')} className="px-4 py-2 text-left hover:bg-sand">My orders</button>
                                    <button onClick={() => { logout(); navigate('/login') }} className="px-4 py-2 text-left hover:bg-sand">Sign out</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <Link to="/cart" aria-label={`Bag, ${count} items`} className="relative transition hover:text-rust">
                        <BagIcon />
                        {count > 0 && (
                            <span className="absolute -right-2 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rust px-1 text-[10px] font-semibold text-white">{count}</span>
                        )}
                    </Link>

                    <button onClick={() => setOpen(true)} aria-label="Open menu" className="sm:hidden"><MenuIcon /></button>
                </div>
            </nav>

            {/* Mobile drawer */}
            <div className={`fixed inset-0 z-50 bg-ink/40 transition sm:hidden ${open ? 'visible opacity-100' : 'invisible opacity-0'}`} onClick={() => setOpen(false)}>
                <div onClick={(e) => e.stopPropagation()} className={`absolute right-0 top-0 h-full w-[80%] max-w-xs bg-cream p-6 transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="mb-10 flex items-center justify-between">
                        <Logo />
                        <button onClick={() => setOpen(false)} aria-label="Close menu"><CloseIcon /></button>
                    </div>
                    <ul className="flex flex-col gap-1">
                        {links.map((l) => (
                            <li key={l.to}>
                                <NavLink to={l.to} end={l.to === '/'} onClick={() => setOpen(false)} className="block border-b border-line py-4 font-display text-2xl [&.active]:text-rust">{l.label}</NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </header>
    )
}

export default Navbar
