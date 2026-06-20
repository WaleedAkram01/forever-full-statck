import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
function Navbar() {
    const [visible, setVisible] = useState(false)
    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext)

    const logout = () => {
        navigate('/login')
        setToken('')
        localStorage.removeItem('token')
        setCartItems({})

    }

    return (
        <div className='flex items-center justify-between py-5 font-medium'>
            <Link to='/'><img src={assets.logo} alt='logo' className='w-36' /></Link>
            <ul className='hidden gap-5 text-sm text-gray-700 sm:flex'>
                {/* The <NavLink> tag is a special component in React Router. It acts like an anchor <a> tag but allows for seamless in-app navigation without page reloads. */}

                <NavLink to='/' className='flex flex-col items-center gap-1 '>
                    <p>Home</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/collection' className='flex flex-col items-center gap-1'>
                    <p>Collection</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden   ' />
                </NavLink>
                <NavLink to='/about' className='flex flex-col items-center gap-1'>
                    <p>About</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden             ' />
                </NavLink>

                <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                    <p>Contact</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

            </ul>

            <div className='flex items-center gap-6 '>
                <img onClick={() => setShowSearch(true)} src={assets.search_icon} alt='search' className='w-5 cursor-pointer' />

                <div className='relative group'>
                    {/* We want that agrr hmm logout hain tou dropdown joo show hoo rha a tha woo na hoo. */}
                    <img onClick={() => token ? null : navigate('/login')} src={assets.profile_icon} alt='profile' className='w-5 cursor-pointer' />

                    {/* Dropdown menu for logged-in users */}
                    {token && (
                        <div className='absolute right-0 hidden pt-4 group-hover:block dropdown-menu'>
                            <div className='flex flex-col gap-2 px-5 py-3 text-gray-500 rounded w-36 bg-slate-100'>
                                <p className='cursor-pointer hover:text-black' >MY Profile</p>
                                <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black' >Orders</p>
                                <p onClick={logout} className='cursor-pointer hover:text-black' >Logout</p>
                            </div>
                        </div>
                    )}
                </div>
                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} alt='cart' className='w-5 min-w-5 ' />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                </Link>
                <img onClick={() => setVisible(true)} src={assets.menu_icon} alt='menu' className='w-5 cursor-pointer sm:hidden' />
            </div>
            {/* SideBar Menu for small screens */}
            <div className={`absolute top-0 bottom-0 right-0 overflow-hidden transition-all bg-white ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <img src={assets.dropdown_icon} alt='logo' className='h-4 rotate-180' />
                        <p>Back</p>
                    </div>
                    <NavLink to='/' onClick={() => setVisible(false)} className='py-2 pl-6 border'>
                        <p>Home</p>
                    </NavLink>
                    <NavLink to='/collection' onClick={() => setVisible(false)} className='py-2 pl-6 border'>
                        <p>Collection</p>
                    </NavLink>
                    <NavLink to='/about' onClick={() => setVisible(false)} className='py-2 pl-6 border'>
                        <p>About</p>
                    </NavLink>
                    <NavLink to='/contact' onClick={() => setVisible(false)} className='py-2 pl-6 border'>
                        <p>Contact</p>
                    </NavLink>
                </div>

            </div>
        </div>
    )
}

export default Navbar

