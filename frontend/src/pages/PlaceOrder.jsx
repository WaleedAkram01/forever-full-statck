import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
function PlaceOrder() {
    const [method, setMethod] = useState('cod')
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

    // Purpose of this state variable is to store the form data that user will enter in the delivery information form. It will be an object with keys as the form field names and values as the form field values.
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value

        setFormData(data => ({ ...data, [name]: value }))
    }


    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            //  Yeh orderItems array iss liay banaya hai kyy na jab user place order krrta hai tou uss waqt hmmm cartItems mai syy un items ki details nikal kr orderItems array mai store kr lain gy, jisse hum backend ko bhej sakein aur uss hisaab syy order create krwa saken.
            let orderItems = []

            // Yeh nested loop iss liay hai kyy na cartItems ek nested object hai jisme pehle product id hota hai aur uske andar size wise quantity hoti hai. Tou hmmm dono loop chalakar cartItems mai syy un items ki details nikal kr orderItems array mai store kr lain gy.
            for (const items in cartItems) {
                // Yeh line iss liay hai kyy na cartItems mai syy product id se us product ki details nikal lain gy taki hum orderItems array mai uss hisaab syy product ki details store kr saken.
                for (const item in cartItems[items]) {
                    // Yeh line iss liay hai kyy na cartItems mai syy size wise quantity check kr lain gy kyy na wo 0 se zyada hai, agrr wo 0 se zyada hai tou uss item ki details nikal kr orderItems array mai store kr lain gy.
                    if (cartItems[items][item] > 0) {
                        // Yeh line iss liay hai kyy na products array mai syy product id se us product ki details nikal lain gy taki hum orderItems array mai uss hisaab syy product ki details store kr saken. StructuredClone is used to create a deep copy of the product object, so that when we add size and quantity properties to it, it does not affect the original product object in the products array.
                        const itemInfo = structuredClone(products.find(product => product._id === items))
                        // Yeh line iss liay hai kyy na itemInfo object mai size aur quantity properties add kr lain gy taki jab hum orderItems array mai uss item ki details store krain tou uss hisaab syy size aur quantity ki details bhi store ho jayein.
                        if (itemInfo) {
                            // Yeh line iss liay hai kyy na itemInfo object mai size aur quantity properties add kr lain gy taki jab hum orderItems array mai uss item ki details store krain tou uss hisaab syy size aur quantity ki details bhi store ho jayein.
                            itemInfo.size = item
                            // Yeh line iss liay hai kyy na itemInfo object mai size aur quantity properties add kr lain gy taki jab hum orderItems array mai uss item ki details store krain tou uss hisaab syy size aur quantity ki details bhi store ho jayein.
                            itemInfo.quantity = cartItems[items][item]
                            // Yeh line iss liay hai kyy na orderItems array mai uss item ki details store kr lain gy taki jab hum backend ko orderItems array bhejen tou uss hisaab syy us item ki details backend ko mil jayein.
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }
            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }

            switch (method) {

                // API Calls for COD
                case 'cod':
                    const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
                    if (response.data.success) {
                        setCartItems({})
                        navigate('/orders')
                    } else {
                        toast.error(response.data.message)
                    }
                    break;

                // API Calls for Stripe
                case 'stripe':
                    const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } })
                    if (responseStripe.data.success) {
                        const { session_url } = responseStripe.data
                        window.location.replace(session_url)
                    } else {
                        toast.error(responseStripe.data.message)
                    }
                    break;

                default:
                    break;
            }
        }
        catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5  min-h-[80vh] border-t '>
            <div className='flex flex-col gap-4 w-full sm:w-[480px]'>
                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='First name' />
                    <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Last name' />
                </div>
                <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='email' placeholder='Email address' />
                <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Street' />
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='City' />
                    <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='State' />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='number' placeholder='Zipcode' />
                    <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Country' />
                </div>

                <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='number' placeholder='Phone ' />


            </div>
            {/* ________RIGHT SIDE __________ */}
            <div className='mt-8'>

                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>

                <div className='mt-12'>
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    {/* --------------- Payment Method Selection --------------- */}
                    <div className='flex gap-3 flex-col lg:flex-row'>

                        <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-500' : ''}`}></p>
                            <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
                        </div>

                        {/* <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-500' : ''}`}></p>
                            <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
                        </div> */}
                        <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-500' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                        </div>

                    </div>


                    <div className='w-full text-end mt-8'>
                        <button type='submit' className='bg-black text-white text-sm my-8 px-8 py-3'>
                            PLACE ORDER
                        </button>
                    </div>

                </div>

            </div>

        </form>
    )
}

export default PlaceOrder
