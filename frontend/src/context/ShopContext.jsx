import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { ShopContext, formatPrice } from './shop'

export default function ShopContextProvider({ children }) {
    const currency = 'Rs.'
    const delivery_fee = 250
    const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/+$/, '')

    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [products, setProducts] = useState([])
    const [productsLoading, setProductsLoading] = useState(true)
    const [token, setToken] = useState(() => localStorage.getItem('token') || '')
    const navigate = useNavigate()

    const logout = useCallback((message) => {
        setToken('')
        localStorage.removeItem('token')
        setCartItems({})
        if (message) toast.info(message)
    }, [])

    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Please select a size')
            return
        }
        const cartData = structuredClone(cartItems)
        cartData[itemId] = cartData[itemId] || {}
        cartData[itemId][size] = (cartData[itemId][size] || 0) + 1
        setCartItems(cartData)
        toast.success('Added to your bag')

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })
            } catch (error) {
                if (error.response?.status === 401) logout('Your session expired. Please sign in again.')
                else toast.error('Could not save your bag. Please try again.')
            }
        }
    }

    const getCartCount = () => {
        let total = 0
        for (const id in cartItems) {
            for (const size in cartItems[id]) {
                if (cartItems[id][size] > 0) total += cartItems[id][size]
            }
        }
        return total
    }

    const getCartAmount = () => {
        let total = 0
        for (const id in cartItems) {
            const product = products.find((p) => p._id === id)
            if (!product) continue
            for (const size in cartItems[id]) {
                if (cartItems[id][size] > 0) total += product.price * cartItems[id][size]
            }
        }
        return total
    }

    const updateQuantity = async (itemId, size, quantity) => {
        const cartData = structuredClone(cartItems)
        if (!cartData[itemId]) return
        if (quantity <= 0) {
            delete cartData[itemId][size]
            if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId]
        } else {
            cartData[itemId][size] = quantity
        }
        setCartItems(cartData)

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })
            } catch (error) {
                if (error.response?.status === 401) logout('Your session expired. Please sign in again.')
                else toast.error('Could not update your bag')
            }
        }
    }

    useEffect(() => {
        axios.get(backendUrl + '/api/product/list')
            .then(({ data }) => { if (data.success) setProducts(data.products) })
            .catch(() => toast.error('Could not load products. Please refresh the page.'))
            .finally(() => setProductsLoading(false))
    }, [backendUrl])

    // Load the saved bag whenever a user signs in
    useEffect(() => {
        if (!token) return
        localStorage.setItem('token', token)
        axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
            .then(({ data }) => { if (data.success) setCartItems(data.cartData || {}) })
            .catch((error) => { if (error.response?.status === 401) logout() })
    }, [token, backendUrl, logout])

    const value = {
        products, productsLoading, currency, delivery_fee, formatPrice,
        search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart, getCartCount, updateQuantity, getCartAmount,
        navigate, backendUrl, token, setToken, logout,
    }

    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}
