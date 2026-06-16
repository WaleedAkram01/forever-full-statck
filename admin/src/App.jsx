import React from 'react'
import Navbar from './components/Navbar.jsx'
import SideBar from './components/Sidebar.jsx'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add.jsx'
import List from './pages/List.jsx'
import Orders from './pages/Orders.jsx'
function App() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <>
        <Navbar />
        <hr />
        <div className='flex w-full'>

          <SideBar />
          <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base ' >
            <Routes>
              <Route path='/add' element={<Add />} />
              <Route path='/list' element={<List />} />
              <Route path='/orders' element={<Orders />} />
            </Routes>
          </div>
        </div>
      </>
    </div>
  )
}

export default App
