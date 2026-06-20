import React, { useState, useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
    const { token, setToken, navigate, backendUrl } = useContext(ShopContext)
    const [currentState, setCurrentState] = useState('Sign Up');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const onSubmitHandler = async (event) => {
        //  Yeh sirf page refresh hone se rok raha hai. 
        event.preventDefault();


        // Sign Up logic
        try {
            // Agrr current state signup hai.
            if (currentState === 'Sign Up') {
                const response = await axios.post(`${backendUrl}/api/users/register`, {
                    name,
                    email,
                    password
                });
                // API kyy resposne mai agrr token aai ga tou hmm ussay token state mai set krr dain gy 
                // And in localStorage too. 
                if (response.data.success) {
                    setToken(response.data.token);
                    localStorage.setItem('token', response.data.token);
                    toast.success('Account created successfully!');
                }
                else {
                    toast.error(response.data.message);
                }
            }
            else {
                // Login logic
                const response = await axios.post(`${backendUrl}/api/users/login`, {
                    email,
                    password
                });
                // API kyy resposne mai agrr token aai ga tou hmm ussay token state mai set krr dain gy 
                // And in localStorage too. 
                if (response.data.success) {
                    setToken(response.data.token);
                    localStorage.setItem('token', response.data.token);
                    toast.success('Logged in successfully!');
                }
                else {
                    toast.error(response.data.message);
                }
            }
            // Handle successful signup (e.g., redirect to login page)   
        } catch (error) {
            console.log(error);
            // Catch axios error response with 400, 500 status codes
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else if (error.message) {
                toast.error(error.message);
            } else {
                toast.error('Something went wrong');
            }
        }
    };

    // Jb token state update hoga tou useEffect chaley ga aur uss mai hm check karain gy agrr token hai tou navigate kar do home page prr.

    // Still problem,
    // ABbhii bhii aik problme yeh hoo rhii as hmm ny intially token state empty rakhaa hai uss syy yeh hoo ga kyy gyy mai signup krr ky home page prr aaun ga aur refresh karun ga tou token state lgyyga empty hii hai aur dubara profile mai chhala jaun ga 
    //Iss liay ShopContext mai functon banain gyy aur check karain gyy agrr LocalStorage mai token hai tou ussay wahan prr hii rakhy.
    // Iss  sy hm brr brr My Profile prr  nhi jaa p-in gyy.
    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token]);

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='prata-regular text-3xl'>{currentState}</p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
            </div>
            {/* Name input field waqt sirf lsignup waqt show hoo. */}
            {currentState === 'Login' ? '' : <input value={name} onChange={(e) => setName(e.target.value)} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />}
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />

            <div className='w-full flex justify-between text-sm mt-[-8px]'>
                <p className='cursor-pointer'>Forgot your password?</p>

                {
                    currentState === 'Login'
                        ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
                        : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
                }
            </div>

            <button type='submit' className='bg-black text-white font-light px-8 py-2 mt-4'>
                {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
            </button>
        </form>
    )
}

export default Login
