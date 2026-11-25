import { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/shop'

const Login = () => {
    const { token, setToken, navigate, backendUrl } = useContext(ShopContext)
    const [params] = useSearchParams()
    const [mode, setMode] = useState('login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const next = params.get('next') || '/'

    useEffect(() => {
        if (token) navigate(next)
    }, [token, navigate, next])

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        setLoading(true)
        try {
            const url = mode === 'signup' ? '/api/users/register' : '/api/users/login'
            const body = mode === 'signup' ? { name, email, password } : { email, password }
            const { data } = await axios.post(backendUrl + url, body)
            if (data.success) {
                localStorage.setItem('token', data.token)
                setToken(data.token)
                toast.success(mode === 'signup' ? 'Welcome to Kapra!' : `Welcome back${data.name ? `, ${data.name}` : ''}!`)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container-page flex justify-center py-16">
            <form onSubmit={onSubmitHandler} className="card w-full max-w-md p-8 sm:p-10">
                <p className="eyebrow">{mode === 'signup' ? 'Join Kapra' : 'Welcome back'}</p>
                <h1 className="mt-2 text-3xl font-medium">{mode === 'signup' ? 'Create your account' : 'Sign in'}</h1>
                <p className="mt-2 text-sm text-muted">{mode === 'signup' ? 'Save your bag and track every order.' : 'Sign in to check out and see your orders.'}</p>

                <div className="mt-8 flex flex-col gap-4">
                    {mode === 'signup' && <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="input" placeholder="Full name" autoComplete="name" required />}
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input" placeholder="Email address" autoComplete="email" required />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="input" placeholder={mode === 'signup' ? 'Password (8+ characters)' : 'Password'} minLength={mode === 'signup' ? 8 : undefined} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required />
                </div>

                <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
                    {loading ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
                </button>

                <p className="mt-6 text-center text-sm text-muted">
                    {mode === 'signup' ? 'Already have an account?' : 'New to Kapra?'}{' '}
                    <button type="button" onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} className="font-medium text-ink underline underline-offset-4">
                        {mode === 'signup' ? 'Sign in' : 'Create an account'}
                    </button>
                </p>
            </form>
        </div>
    )
}

export default Login
