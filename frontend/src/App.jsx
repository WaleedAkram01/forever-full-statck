import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Collection from './pages/Collection.jsx'
import Contact from './pages/Contact.jsx'
import Cart from './pages/Cart.jsx'
import Login from './pages/Login.jsx'
import Orders from './pages/Orders.jsx'
import PlaceOrder from './pages/PlaceOrder.jsx'
import Product from './pages/Product.jsx'
import Navbar from './components/Navbar.jsx'
import SearchBar from './components/SearchBar.jsx'
import Footer from './components/Footer.jsx'
import { ToastContainer, toast } from 'react-toastify';

function App() {
  console.log("App component chala!");

  return (
    < div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]' >
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/place-order' element={<PlaceOrder />} />

        <Route path='/product/:productId' element={<Product />} />
      </Routes>
      <Footer />
    </ div>
  )
}

export default App;
