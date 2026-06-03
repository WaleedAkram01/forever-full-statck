import { createContext, useEffect, useState } from 'react'
import { products } from '../assets/assets';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const ShopContext = createContext();
function ShopContextProvider({ children }) {
    const currency = 'PKR'
    const delivery_fee = 10;
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(true)
    // Ab add to cart ki logic yehan pr likhain gy. Jab hm add to cart pr click karain gy tou wo product ka data iss cartItems state variable mai add ho jayega.
    const [cartItems, setCartItems] = useState({});

    // Jb proceed to checkout prr click karain gy tou wo checkout page prr navigate karay ga. Iss kyy liay useNavigate hook import kia hai react-router-dom se.
    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {

        // This is for showing toast notification when item is added to cart.
        if (!size) {
            toast.error('Please select a size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
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
        navigate
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