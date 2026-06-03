import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext.jsx'
import { Link } from 'react-router-dom'
function ProductItem({ id, image, name, price }) {

    const { currency } = useContext(ShopContext)
    return (
        // AnyOne Will click on this product then this link will open /product/id
        <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
            <div className="overflow-hidden">
                <img src={image[0]} alt={name} className="hover:scale-110 transition ease-in-out" />
            </div>
            <p className='pt-3 pb-1 text-sm'>{name}</p>
            <p className=' text-sm font-medium'>{currency} {price}</p>
        </Link>
    )
}

export default ProductItem
