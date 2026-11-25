import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl, DEMO_CREDENTIALS } from '../config.js'

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const submit = async (creds) => {
        setLoading(true)
        try {
            const { data } = await axios.post(backendUrl + '/api/users/admin', creds)
            if (data.success) {
                onLogin(data.token, data.role || 'admin')
                toast.success(data.role === 'demo' ? 'Signed in to the read-only demo' : 'Welcome back')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Could not sign in')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-sand px-4">
            <div className="w-full max-w-md">
                <p className="mb-6 text-center font-display text-3xl font-semibold">kapra<span className="text-rust">.</span> <span className="font-sans text-base font-normal text-muted">admin</span></p>
                <form onSubmit={(e) => { e.preventDefault(); submit({ email, password }) }} className="card p-8">
                    <h1 className="text-2xl font-semibold">Sign in</h1>
                    <p className="mt-1 text-sm text-muted">Manage products and orders for the Kapra store.</p>
                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="label" htmlFor="email">Email</label>
                            <input id="email" className="input" type="text" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <label className="label" htmlFor="password">Password</label>
                            <input id="password" className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                    </div>
                    <button disabled={loading} className="btn-primary mt-6 w-full py-3" type="submit">{loading ? 'Signing in…' : 'Sign in'}</button>
                </form>

                <div className="card mt-4 border-dashed p-5 text-sm">
                    <p className="font-medium">Just looking around?</p>
                    <p className="mt-1 text-muted">Use the read-only demo account. You can browse everything, but changes are blocked.</p>
                    <button disabled={loading} onClick={() => submit(DEMO_CREDENTIALS)} className="btn-ghost mt-4 w-full">Explore the demo</button>
                </div>
            </div>
        </div>
    )
}

export default Login
