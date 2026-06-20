import { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ShopContext = createContext();
function ShopContextProvider({ children }) {
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

    // Jb proceed to checkout prr click karain gy tou wo checkout page prr navigate karay ga. Iss kyy liay useNavigate hook import kia hai react-router-dom se.
    const navigate = useNavigate();


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
    }

    //Now functonality kyy ahi cart prr static number shhow hoo rha ahi dynamic number how hoo.
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
    // In this we can clear the cart items.
    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;
        setCartItems(cartData);
    }

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
        navigate,
        backendUrl,
    }
    return (
        <div>
            <ShopContext.Provider value={value}>
                {children}
            </ShopContext.Provider>
        </div>
    )
}

export default ShopContextProvider;