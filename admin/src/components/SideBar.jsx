import { NavLink } from 'react-router-dom'

const icon = (d) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
)

const links = [
  { to: '/', label: 'Dashboard', end: true, i: icon(<><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></>) },
  { to: '/orders', label: 'Orders', i: icon(<><path d="M5 8h14l-1 13H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>) },
  { to: '/list', label: 'Products', i: icon(<><path d="M4 6h16M4 12h16M4 18h16" /></>) },
  { to: '/add', label: 'Add product', i: icon(<><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>) },
]

function Sidebar() {
  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-16 flex-shrink-0 border-r border-line bg-white md:w-56">
      <nav className="flex flex-col gap-1 p-3">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${isActive ? 'bg-ink text-white' : 'text-muted hover:bg-sand hover:text-ink'}`}>
            {l.i}
            <span className="hidden md:block">{l.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
