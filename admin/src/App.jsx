import { useCallback, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/Navbar.jsx'
import SideBar from './components/SideBar.jsx'
import Login from './components/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Add from './pages/Add.jsx'
import List from './pages/List.jsx'
import Orders from './pages/Orders.jsx'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || '')
  const [role, setRole] = useState(() => localStorage.getItem('adminRole') || 'admin')

  const onLogin = (newToken, newRole) => {
    localStorage.setItem('adminToken', newToken)
    localStorage.setItem('adminRole', newRole)
    setToken(newToken)
    setRole(newRole)
  }

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminRole')
    setToken('')
  }, [])

  const isDemo = role === 'demo'
  const pageProps = { token, isDemo, onAuthError: logout }

  return (
    <div className="min-h-screen">
      <ToastContainer position="bottom-right" autoClose={2500} hideProgressBar />
      {!token ? (
        <Login onLogin={onLogin} />
      ) : (
        <>
          <Navbar logout={logout} isDemo={isDemo} />
          <div className="flex">
            <SideBar />
            <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10">
              <Routes>
                <Route path="/" element={<Dashboard {...pageProps} />} />
                <Route path="/add" element={<Add {...pageProps} />} />
                <Route path="/list" element={<List {...pageProps} />} />
                <Route path="/orders" element={<Orders {...pageProps} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </>
      )}
    </div>
  )
}

export default App
