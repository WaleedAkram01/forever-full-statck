import { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
function Collection() {
    // Ab hmm search karain aur relevent product show hoo woo bhii yehan hii karai gy like I added search,showSearch & further see applyFilters function. 
    const { products, search, showSearch } = useContext(ShopContext);
    const [showfilter, setShowFilter] = useState(false)
    const [filteredProducts, setFilteredProducts] = useState([])
    // Further,We will  add logic on filters
    const [category, setCategory] = useState([])
    const [subCategory, setSubCategory] = useState([])
    const [sortType, setSortType] = useState('relevant')

    // This is for category.
    const toogleCategory = (e) => {
        // Dekho Hm na checkbox prr click karain gy Agrr already category state me wo category hai to usko remove kar do Agrr nhi hai to usko add kar do 
        if (category.includes(e.target.value)) {
            // Means in this case category is already in this category array we will remove that category.
            setCategory(prev => prev.filter((item) => item !== e.target.value));
        } else {
            // Means in this case category is not in this category array we will add that category.
            setCategory(prev => [...prev, e.target.value]);
        }

    }
    // This is for subcategory.
    const toogleSubCategory = (e) => {
        if (subCategory.includes(e.target.value)) {
            setSubCategory(prev => prev.filter((item) => item !== e.target.value));
        } else {
            setSubCategory(prev => [...prev, e.target.value]);
        }
    }

    // This function will apply filters on products based on category and subcategory. It will be called whenever category or subcategory changes.
    const applyFilters = () => {
        let productCopy = products.slice()

        if (showSearch && search) {
            productCopy = productCopy.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
        }
        if (category.length > 0) {
            productCopy = productCopy.filter((item) => category.includes(item.category))
        }
        if (subCategory.length > 0) {
            productCopy = productCopy.filter((item) => subCategory.includes(item.subCategory))
        }
        setFilteredProducts(productCopy)
    }


    // Ab sorting kyy 
    const sortProducts = () => {
        // It will create a copy of filteredProducts array.
        let fpCopy = filteredProducts.slice();

        switch (sortType) {
            case 'low-high':
                setFilteredProducts(fpCopy.sort((a, b) => a.price - b.price))
                break;
            case 'high-low':
                setFilteredProducts(fpCopy.sort((a, b) => b.price - a.price))
                break;
            default:
                applyFilters();
                break;

        }
    }

    useEffect(() => {
        sortProducts();
    }, [sortType])

    // Whenever category or subcategory changes we will call applyFilters function to apply filters on products and update the filteredProducts state.
    useEffect(() => {
        applyFilters();
    }, [category, subCategory, search, showSearch]);
    return (
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-10  pt-10 border-t'>
            {/* Filter Options */}
            <div onClick={() => setShowFilter(!showfilter)} className='min-w-60'>
                <p className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
                    <img className={`h-3 sm:hidden ${showfilter ? 'rotate-90' : ''} `} src={assets.dropdown_icon} alt="Filter" />
                </p>
                {/* Categories Filter */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showfilter ? '' : 'hidden'} sm:block `} >
                    <p className='text-gray-500 text-sm mb-1'>Categories</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700 '>
                        <p className='flex gap-2'>
                            <input onChange={toogleCategory} className='w-3' type='checkbox' value={'Men'} />
                            Men
                        </p>
                        <p className='flex gap-2'>
                            <input onChange={toogleCategory} className='w-3' type='checkbox' value={'Women'} />
                            Women
                        </p>
                        <p className='flex gap-2'>
                            <input onChange={toogleCategory} className='w-3' type='checkbox' value={'Kids'} />
                            Kids
                        </p>
                    </div>
                </div>

                {/*SubCategories Filter */}
                <div className={`border border-gray-300 pl-5 py-3 my-6 ${showfilter ? '' : 'hidden'} sm:block `} >
                    <p className='text-gray-500 text-sm mb-1'>SubCategories</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700 '>
                        <p className='flex gap-2'>
                            <input onChange={toogleSubCategory} className='w-3' type='checkbox' value={'Topwear'} />
                            Topwear
                        </p>
                        <p className='flex gap-2'>
                            <input onChange={toogleSubCategory} className='w-3' type='checkbox' value={'Bottomwear'} />
                            Bottomwear
                        </p>
                        <p className='flex gap-2'>
                            <input onChange={toogleSubCategory} className='w-3' type='checkbox' value={'Winterwear'} />
                            Winterwear
                        </p>
                    </div>
                </div>


            </div>


            {/* Right Side */}
            <div className='flex-1'>
                <div className='flex justify-between text-base sm:text-2xl mb-4 '>
                    <Title text1={'ALL'} text2={'COLLECTION'} />
                    {/* Product Sort */}
                    <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2 '>
                        <option value='relevant'>Newest</option>
                        <option value='low-high'>Sort by: Low To High</option>
                        <option value='high-low'>Sort by: High To Low</option>
                    </select>
                </div>
                {/* Map Products */}
                <div className='grid grid-cols-2 md:grid-cols-3 
                 lg:grid-cols-4 gap-4 gap-y-6'>
                    {filteredProducts.map((product, index) => (
                        <ProductItem key={index} name={product.name} id={product._id} price={product.price} image={product.image} />
                    ))}

                </div>


            </div>

        </div>
    )
}

export default Collection;