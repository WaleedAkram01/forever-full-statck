import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/shop'
import CartTotal from '../components/CartTotal'

const FIELDS = { firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: 'Pakistan', phone: '' }

function PlaceOrder() {
    const [method, setMethod] = useState('cod')
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState(FIELDS)
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, products, logout } = useContext(ShopContext)

    useEffect(() => {
        if (!token) navigate('/login?next=/place-order')
    }, [token, navigate])

    const onChange = (e) => setFormData((d) => ({ ...d, [e.target.name]: e.target.value }))

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        if (getCartAmount() === 0) {
            toast.error('Your bag is empty')
            return
        }
        // Only ids, sizes and quantities are sent. The server looks up prices itself.
        const items = []
        for (const id in cartItems) {
            for (const size in cartItems[id]) {
                if (cartItems[id][size] > 0 && products.some((p) => p._id === id)) items.push({ _id: id, size, quantity: cartItems[id][size] })
            }
        }

        setSubmitting(true)
        try {
            const orderData = { address: formData, items }
            if (method === 'cod') {
                const { data } = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
                setCartItems({})
                toast.success(data.message || 'Order placed')
                navigate('/orders')
            } else {
                const { data } = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } })
                window.location.replace(data.session_url)
            }
        } catch (error) {
            if (error.response?.status === 401) {
                logout('Your session expired. Please sign in again.')
                navigate('/login?next=/place-order')
            } else {
                toast.error(error.response?.data?.message || 'Could not place your order')
            }
        } finally {
            setSubmitting(false)
        }
    }

    const Field = ({ name, placeholder, type = 'text', ...rest }) => (
        <input required name={name} value={formData[name]} onChange={onChange} type={type} placeholder={placeholder} className="input" {...rest} />
    )

    return (
        <form onSubmit={onSubmitHandler} className="container-page grid gap-12 pt-10 lg:grid-cols-[1fr_400px]">
            <div>
                <p className="eyebrow">Checkout</p>
                <h1 className="mt-2 text-4xl font-medium">Delivery details</h1>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {Field({ name: 'firstName', placeholder: 'First name', autoComplete: 'given-name' })}
                    {Field({ name: 'lastName', placeholder: 'Last name', autoComplete: 'family-name' })}
                    <div className="sm:col-span-2">{Field({ name: 'email', placeholder: 'Email address', type: 'email', autoComplete: 'email' })}</div>
                    <div className="sm:col-span-2">{Field({ name: 'street', placeholder: 'House, street and area', autoComplete: 'street-address' })}</div>
                    {Field({ name: 'city', placeholder: 'City', autoComplete: 'address-level2' })}
                    {Field({ name: 'state', placeholder: 'Province', autoComplete: 'address-level1' })}
                    {Field({ name: 'zipcode', placeholder: 'Postal code', inputMode: 'numeric', autoComplete: 'postal-code' })}
                    {Field({ name: 'country', placeholder: 'Country', autoComplete: 'country-name' })}
                    <div className="sm:col-span-2">{Field({ name: 'phone', placeholder: 'Phone (e.g. 0300 1234567)', type: 'tel', autoComplete: 'tel' })}</div>
                </div>
            </div>

            <aside className="card h-fit p-6">
                <CartTotal />
                <p className="mt-8 text-sm font-medium">Payment method</p>
                <div className="mt-3 flex flex-col gap-3">
                    {[
                        { id: 'cod', title: 'Cash on delivery', text: 'Pay when your order arrives' },
                        { id: 'stripe', title: 'Card payment', text: 'Secure checkout with Stripe (test mode)' },
                    ].map((m) => (
                        <label key={m.id} className={`flex cursor-pointer items-start gap-3 border p-4 transition ${method === m.id ? 'border-ink bg-sand' : 'border-line'}`}>
                            <input type="radio" name="method" checked={method === m.id} onChange={() => setMethod(m.id)} className="mt-1 accent-[#9A3B1E]" />
                            <span>
                                <span className="block text-sm font-medium">{m.title}</span>
                                <span className="block text-xs text-muted">{m.text}</span>
                            </span>
                        </label>
                    ))}
                </div>
                <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full">
                    {submitting ? 'Placing order…' : method === 'cod' ? 'Place order' : 'Continue to payment'}
                </button>
            </aside>
        </form>
    )
}

export default PlaceOrder
