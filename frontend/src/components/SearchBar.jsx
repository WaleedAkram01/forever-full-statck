import { useState, useContext, useEffect } from "react"
import { ShopContext } from "../context/ShopContext.jsx"
import { assets } from "../assets/assets.js"
import { useLocation } from "react-router-dom"
function SearchBar() {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext)
    // We want SearchBar only in CollectionPage therefore using UseLocation hook.
    const location = useLocation()
    let [visible, setVisible] = useState(false)
    // If showSearch is true then we will show search bar otherwise we will hide it.
    useEffect(() => {
        if (location.pathname.includes('collection')) {
            setVisible(true)
        } else {
            setVisible(false)
        }
    }, [location])


    return showSearch && visible ? (
        <div className="border-t border-b bg-gray-50 text-center">
            <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4  sm:w-/2">
                <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 outline-none bg-inherit text-sm " />
                <img className="w-4" src={assets.search_icon} alt="Search" />
            </div>
            <img onClick={() => setShowSearch(false)} src={assets.cross_icon} alt="Close" className="inline w-3 cursor-pointer" />
        </div>
    ) : null
}

export default SearchBar
