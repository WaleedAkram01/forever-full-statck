import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import SideBar from './components/Sidebar.jsx'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add.jsx'
import List from './pages/List.jsx'
import Orders from './pages/Orders.jsx'
import Login from './components/Login.jsx'
import { ToastContainer, toast } from 'react-toastify'

// Yehan prr hmm backend URL add krr rhyy hain
// export soo we can use in any component
export const backendUrl = import.meta.env.VITE_BACKEND_URL


function App() {


  // If token is empty then show login page otherwise show the dashboard 
  // Below is the Logic
  // Initialay its empty.
  // const [token, setToken] = useState('')

  // Yeh localStoarge mai iss lay save kii bcz na jb refresh krty thyy dubara login p[age prr aa jain gyy iss ko solve krnyy k liay 
  // localStrage mai kehain gyy agrr token available hai tou ussay 
  // Imp:- Bcz pehly joo hmm keh rhyy thyy agrr login waqt token hoo tou ussay access krr loo. Uss sy refresh jb krty thyy duabara login prr chala jata thaa. Iss liay ab localSttarge syy lai rhyy token.
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')

  useEffect(() => {
    // Jab bhi token change ho toh localStorage mai save krdo
    localStorage.setItem('token', token)
  }, [token])
  return (
    <div className='min-h-screen bg-gray-50'>
      < ToastContainer />
      {token === '' ? <Login setToken={setToken} /> :
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>

            <SideBar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base ' >
              <Routes>
                {/* Yehan hmm nyy token iss liay set kia kyy hrr request kyy sath bhej sakain then amdin verify hoo skyy ga. */}
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>

      }


    </div>
  )
}

export default App
