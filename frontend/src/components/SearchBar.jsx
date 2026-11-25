import { useContext, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { ShopContext } from '../context/shop'
import { CloseIcon, SearchIcon } from './Icons'

function SearchBar() {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext)
    const location = useLocation()
    const inputRef = useRef(null)
    const visible = showSearch && location.pathname.includes('collection')

    useEffect(() => { if (visible) inputRef.current?.focus() }, [visible])

    if (!visible) return null
    return (
        <div className="border-b border-line bg-sand">
            <div className="container-page flex items-center gap-3 py-4">
                <div className="flex flex-1 items-center gap-3 border border-line bg-white px-4 py-3">
                    <SearchIcon size={18} className="text-muted" />
                    <input ref={inputRef} type="text" placeholder="Search shirts, denim, coats..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" />
                </div>
                <button onClick={() => { setShowSearch(false); setSearch('') }} aria-label="Close search" className="p-2 hover:text-rust"><CloseIcon /></button>
            </div>
        </div>
    )
}

export default SearchBar
