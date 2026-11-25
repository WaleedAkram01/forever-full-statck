const Navbar = ({ logout, isDemo }) => (
    <header className="sticky top-0 z-30 border-b border-line bg-white">
        {isDemo && (
            <div className="bg-rust px-4 py-2 text-center text-xs font-medium text-white">
                Demo mode: you can look around, but saving, deleting and status changes are disabled.
            </div>
        )}
        <div className="flex h-16 items-center justify-between px-4 sm:px-8">
            <p className="font-display text-2xl font-semibold">kapra<span className="text-rust">.</span> <span className="ml-1 rounded bg-sand px-2 py-0.5 font-sans text-xs font-medium text-muted">{isDemo ? 'Demo admin' : 'Admin'}</span></p>
            <div className="flex items-center gap-3">
                <a href="https://forever-full-statck.vercel.app" target="_blank" rel="noreferrer" className="hidden text-sm text-muted hover:text-ink sm:block">View store ↗</a>
                <button className="btn-ghost" onClick={logout}>Sign out</button>
            </div>
        </div>
    </header>
)

export default Navbar
