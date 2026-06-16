import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App.jsx'

const Login = ({ setToken }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {

        try {

            // Hotta kia hai is skyy bagair form submit hone pr page reload ho jata hai aur humara state reset ho jata hai. Isliye hum form submit hone pr default behavior ko prevent karte hain.
            e.preventDefault()
            // For now just log the email and password to the console
            console.log(email, password)
            //  yeh backend URL hai iss prr post request kii ja rhi hai jisme email aur password bheja ja rha hai. 
            const response = await axios.post(backendUrl + '/api/users/admin', { email, password })
            // Hm console.log lgaa krr dekh skty agrr na response.data mai token aai tou tbb UI dikh jai gii.
            // Andar Hm state veriable mai token add krr dain gyy and then actually UI show hoo ga hamain.
            if (response.data.token) {
                setToken(response.data.token)
            }
            else {
                toast.error(response.data.message)
            }
        }
        catch (error) {
            console.log(error)
            toast.error(error.message)

        }


    }

    return (
        <div className='flex items-center justify-center w-full min-h-screen'>
            <div className='max-w-md px-8 py-6 bg-white rounded-lg shadow-md'>
                <h1 className='mb-4 text-2xl font-bold'>Admin Panel</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className='mb-3 min-w-72'>
                        <p className='mb-2 text-sm font-medium text-gray-700'>Email Address</p>
                        <input
                            className='w-full px-3 py-2 border border-gray-300 rounded-md outline-none'
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className='mb-3 min-w-72'>
                        <p className='mb-2 text-sm font-medium text-gray-700'>Password</p>
                        <input
                            className='w-full px-3 py-2 border border-gray-300 rounded-md outline-none'
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className='w-full py-2 mt-2 text-white bg-black rounded-md ' type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login
