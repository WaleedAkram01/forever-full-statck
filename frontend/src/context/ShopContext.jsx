import { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ShopContext = createContext();

export default function ShopContextProvider({ children }) {
    console.log("ShopContext load hua!")

    const currency = 'PKR'
    const delivery_fee = 10;
    // Imported from backend folder.
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    // Search bar ki value store karne kyy liay state variable.
    const [search, setSearch] = useState('')
    // Search bar dikhao ya chhupao
    const [showSearch, setShowSearch] = useState(true)
    // cartItems---> Cart ka poora data iss mai hoo gaa
    const [cartItems, setCartItems] = useState({});

    // Products data store karne kyy liay state variable.
    const [products, setProducts] = useState([]);

    // Yeh will use this for login and SignUp
    // And t be used in Login.jsx file
    const [token, setToken] = useState('')
    // Jb proceed to checkout prr click karain gy tou wo checkout page prr navigate karay ga. Iss kyy liay useNavigate hook import kia hai react-router-dom se.
    const navigate = useNavigate();

    //  ADD TP CRAT funnction
    // Understand Why this approach is better of frnetnd and backend mai addToCart Wali.
    // Click
    // UI Update Immediately
    // Backend Save
    // Agar Save Fail Ho
    // UI Rollback

    const addToCart = async (itemId, size) => {

        // This is for showing toast notification when item is added to cart.
        if (!size) {
            toast.error('Please select a size');
            return;
        }

        let cartData = structuredClone(cartItems);
        //  If product exists cartData["101"]
        if (cartData[itemId]) {
            // Check Size Exists?
            if (cartData[itemId][size]) {
                // Agrr already hai tou quantity increase kroo.
                cartData[itemId][size] += 1;
            }
            // Agrr sze already nhii koi thaa tou add krr do.
            else {
                cartData[itemId][size] = 1;
            }
        }
        // Yeh tbb chalta hai jb product pehli dfaa cart mai add honi hoo.
        else {
            // Means hmm nyy 101 product select kia
            // Yani product 101 ke liye ek khaali object bana diya.
            cartData[itemId] = {};
            //  {   
            //   "101": {
            //     "M": 1
            //   }
            // }
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
        toast.success('Item added to cart');
        // Ab hum nyy cartData update kr diya hai tou usko database mai save kr den gy.
        // First we will check if user is logged in or not. Agrr token hai tou hum API call krain gy add to cart kyy liay.

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error('Failed to add item to cart')
            }
        }

    }

    // Iss ka complate knwolegde context kii fiels mai hai
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    // Error handling
                }
            }
        }
        return totalCount;
    }

    // Yeh is sliay keh naa hmm total cart amount calculate kar sakain aur naa hi checkout page pr wo show kar sakain gy.
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalAmount;
    }



    // When cartItems state variable changes then we want to log the cart items in console. So we will use useEffect for that.
    useEffect(() => {
        console.log(cartItems);
    }, [cartItems])


    // Purose of this function
    // Yeh function is liay hai keh jab bhi user cart page prr jaye tou uska cart data backend syy fetch kr krr laay aur uss hisaab syy cartItems state variable ko update kr de taki cart page prr sahi data show ho. 
    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }

    // Now problem is that hmm cart mai koi data Enter karain gyy Header mai cart ka count update hota hai lakin na refresh krty hain tou khatam hoo jata hai.
    // Kindly doo fix it someHow Plz
    // Hm DB syy lain gy
    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
            // Ab API kyy response mai agrr cart data aai ga tou hmm ussay cartItems state variable mai set kr den gy taki cart page pr wo show ho sakay.
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        }
        catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    // This is for getALLproduct data api.
    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    useEffect(() => {
        getProductsData()
    }, [])

    // Load token from localStorage when app starts
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            // Now we will call getUserCart function to fetch the cart data from backend and set it to cartItems state variable.
            getUserCart(storedToken);
        }
    }, [])

    // We are passing here so we can access in any component.
    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        getUserCart,
        navigate,
        backendUrl,
        setCartItems,
        token,
        setToken,
    }
    return (
        <div>
            <ShopContext.Provider value={value}>
                {children}
            </ShopContext.Provider>
        </div>
    )
}