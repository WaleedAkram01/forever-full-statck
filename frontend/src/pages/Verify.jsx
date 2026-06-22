// Jb verify payment hoo gii uss kyy liay yeh function hai brother.
import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Verify = () => {

    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
    const [searchParams, setSearchParams] = useSearchParams()

    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')

    const verifyPayment = async () => {
        try {
            if (!token) {
                return null
            }

            // Backend URL update syntax logic complete kiya hai aur data objects pass kiye hain
            const response = await axios.post(backendUrl + '/api/order/verifyStripe', { success, orderId }, { headers: { token } })

            // Rememeber webhooks is a long procedure to implement what happend agrr hmmpayment prr gyy aur fail hoo tou /cart prr redirect krr dia hai hmm nyy.
            // Agrr success hai tou /orders pages prr redirect krr dia hai 
            // Remember:- Yhe sahi secure kkaam nhii yeh better approach thii stripe webhooks ka use kia jata but hmm ny nhii kia woo.
            if (response.data.success) {
                setCartItems({})
                navigate('/orders') // Success par order page par le jaane ke liye
            } else {
                navigate('/cart') // Fail hone par cart par wapas bhejne ke liye
            }

        } catch (error) {
            console.log(error)
            toast.error("Payment verification failed. Please try again.")
        }
    }

    // Is response function ko trigger karne ke liye useEffect code initialize kiya
    useEffect(() => {
        verifyPayment()
    }, [token])

    return (
        <div>
            {/* Aap yahan ek loading spinner UI add kar sakte hain */}
        </div>
    )
}

export default Verify
