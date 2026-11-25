import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import Home from './pages/Home'
import About from './pages/About'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Orders from './pages/Orders'
import PlaceOrder from './pages/PlaceOrder'
import Product from './pages/Product'
import Verify from './pages/Verify'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import Footer from './components/Footer'

function ScrollToTop() {
    const { pathname } = useLocation()
    useEffect(() => { window.scrollTo(0, 0) }, [pathname])
    return null
}

function NotFound() {
    return (
        <div className="container-page py-32 text-center">
            <p className="eyebrow">404</p>
            <h1 className="mt-3 text-4xl font-medium">This page doesn’t exist</h1>
            <Link to="/" className="btn-primary mt-8">Back to home</Link>
        </div>
    )
}

function App() {
    return (
        <div className="flex min-h-screen flex-col">
            <ToastContainer position="bottom-right" autoClose={2500} hideProgressBar theme="light" />
            <ScrollToTop />
            <Navbar />
            <SearchBar />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/collection" element={<Collection />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/place-order" element={<PlaceOrder />} />
                    <Route path="/verify" element={<Verify />} />
                    <Route path="/product/:productId" element={<Product />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </div>
    )
}

export default App
