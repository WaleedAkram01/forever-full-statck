import { useContext, useState, useEffect } from "react"
import { ShopContext } from "../context/ShopContext.jsx"
import Title from "./Title.jsx"
import ProductItem from "./ProductItem.jsx"
function LatestCollection() {
    const { products } = useContext(ShopContext)
    // Initially its empty array. We will set it to 10 products in useEffect.
    const [latestProducts, setLatestProducts] = useState([])

    useEffect(() => {
        // Set the latest products to the first 10 products from the context. This will run only once when the component mounts.
        setLatestProducts(products.slice(0, 10))
    }, [])


    // Direct bina kisi state ke 10 products nikaalein to wo har render pe change hote rahenge aur infinite loop me chala jaayega kyunki state update hone pe component re-render hota hai. Isliye useState aur useEffect ka istemal karke hum ek baar hi latest products set karte hain, jisse infinite loop se bach sakte hain.
    // const latestProducts = products.slice(0, 10);
    // console.log(latestProducts);
    return (
        < div className="my-10" >
            <div className="text-center py-8 text-3xl">
                <Title text1={'LATEST'} text2={'COLLECTION'} />
                <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 ">Discover our newest arrivals</p>
            </div>

            {/* Now we will ad logic soo that we can only displaly recently added 10 products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {latestProducts.map((item, index) => (
                    <ProductItem
                        key={index}
                        id={item._id}
                        image={item.image}
                        name={item.name}
                        price={item.price}
                    />
                ))}
            </div>
        </div>
    )
}

export default LatestCollection
