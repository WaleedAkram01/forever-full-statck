// Iss filemai kia seekha hai
// URL.createObjectURL--> Iss sy na image jb computer syy selct karain gyy wo image mai show hoo gii 
//  sleect sizes logic

import { React, useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App.jsx'

// Remember:- Hhm tbb tkk product add nhii krr skty hain jbb tkk token naa sath send karain aur woo auhorize hoo jai
const Add = ({ token }) => {
    //  Now we will make state variable to handle all form data.

    // Firstly state variable for all 4 images.
    const [image1, setImage1] = useState(false);
    const [image2, setImage2] = useState(false);
    const [image3, setImage3] = useState(false);
    const [image4, setImage4] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Men");
    const [subCategory, setSubCategory] = useState("Topwear");
    const [bestseller, setBestseller] = useState(false);
    // Initially size is empty array because user can select multiple sizes for a product.
    const [sizes, setSizes] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            // FormData ka iss liay use kar rahe hain kyunki hum images ko bhi backend prr bhejna chahte hain aur images ko bhejne kyy liay formData ka use hota hai. Hm directly json format mai images ko backend prr nahi bhej sakte hain. 
            // MOST important:-
            // Jab aap isay use karte hain, toh background mein Content-Type: multipart/form-data header automatically set ho jata hai, jo server ko batata hai ki file aa rahi hai. 
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("subCategory", subCategory);
            formData.append("bestseller", bestseller);
            // We cannot send array directly in formData we we have to convert it into string.
            // And when we will access it in backend we will convert it back into array.
            formData.append("sizes", JSON.stringify(sizes));

            // IF conditons iss liay aply kii zarurii nhii kyy aik product 4 hii images uplaod karian tou uss kyy liay hmm nyy yeh kiaa hai kyy condition set krr dii agrr image hai then formData mai include kroo
            if (image1) formData.append("image1", image1);
            if (image2) formData.append("image2", image2);
            if (image3) formData.append("image3", image3);
            if (image4) formData.append("image4", image4);

            const response = await axios.post(`${backendUrl}/api/product/add`, formData, { headers: { token } });
            console.log(response.data);


            // Agrr data add hoo jai tou success ka toast show krr doo.
            // and srii form data ko reset krr doo.
            if (response.data.success) {
                toast.success("Product added successfully");
                setName("");
                setDescription("");
                setPrice("");
                setCategory("Men");
                setSubCategory("Topwear");
                setBestseller(false);
                setSizes([]);
                setImage1(false);
                setImage2(false);
                setImage3(false);
                setImage4(false);

            }
            else {
                toast.error(response.data.message);
            }

        }
        catch (error) {
            console.log(error);
            toast.error(error.message);
        }

    }

    return (
        <form onSubmit={handleSubmit} className='flex flex-col items-start w-full gap-3 ' >
            <div>
                <p>Upload Image</p>

                <div className='flex gap-2'>
                    <label htmlFor="image1">
                        {/* AB jo image Hm COMPuter syy select karain gyy woo show nhii hoo ga image UI mai jb tk  */}
                        {/* Kyunki yeh ek file object hai, iska koi direct URL nahi hota. Is ko screen par dekhne ke liye browser ka ek function use hota hai URL.createObjectURL(): */}
                        <img src={image1 ? URL.createObjectURL(image1) : assets.upload_area} className='w-20' alt="" />
                        {/* hidden syy na woo choose file wali option nhii dyy ga. */}
                        {/* UnderStading this oNChnage */}
                        {/* File Input (type="file"): User yahan computer se poori file utha raha hai (jis mein file ka naam, size, file ki type, aur uske andar ka poora data hota hai). Browser is poore data ko ek Object ke roop mein treat karta hai, string ke roop mein nahi */}
                        {/* File {
                            name: "avatar.png",
                        size: 24000,
                        type: "image/png",
                        lastModified: 1718361600000
} */}
                        <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
                    </label>
                    <label htmlFor="image2">
                        <img src={image2 ? URL.createObjectURL(image2) : assets.upload_area} className='w-20' alt="" />
                        {/* hidden syy na woo choose file wali option nhii dyy ga. */}
                        <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
                    </label>
                    <label htmlFor="image3">
                        <img src={image3 ? URL.createObjectURL(image3) : assets.upload_area} className='w-20' alt="" />
                        {/* hidden syy na woo choose file wali option nhii dyy ga. */}
                        <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
                    </label>
                    <label htmlFor="image4">
                        <img src={image4 ? URL.createObjectURL(image4) : assets.upload_area} className='w-20' alt="" />
                        {/* hidden syy na woo choose file wali option nhii dyy ga. */}
                        <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
                    </label>
                </div>
            </div>

            <div className='w-full'>
                <p className='mb-2'>Product Name</p>
                <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
            </div>

            <div className='w-full'>
                <p className='mb-2'>Product description</p>
                <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here' required />
            </div>

            <div className='flex flex-col w-full gap-2 sm:flex-row sm:gap-8'>


                {/* Product category div */}
                <div>
                    <p className='mb-2'>Product Category</p>
                    <select onChange={(e) => setCategory(e.target.value)} className='w-full px-2 py-2' >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                    </select>

                </div>
                {/* Sub-category div */}
                <div>
                    <p className='mb-2'>Sub Category</p>
                    <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-2 py-2' >
                        <option value="Topwear">Topwear</option>
                        <option value="Bottomwear">Bottomwear</option>
                        <option value="Winterwear">Winterwear</option>
                    </select>
                </div>


                <div>
                    <p className='mb-2'>Product Price</p>
                    < input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='25' />
                </div>
            </div>

            <div>
                <p className='mb-2'>Product Sizes</p>
                <div className='flex gap-3'>
                    {/* Its logic in sizes.txt file */}
                    {/* Summarizing */}
                    {/* Jb kisi size prr click karain gyy tou agrr include hai tu hmm remove krr dain gyy wrna hm add krr dain gyy simply ussay. */}
                    <div onClick={() => setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev, "S"])}>
                        {/* agrr sizes kii array mai yeh include hai tou issay pink color wrna grey color */}
                        <p className={`${sizes.includes("S") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer `}>S</p>
                    </div>

                    <div onClick={() => setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev, "M"])}>

                        <p className={`${sizes.includes("M") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer `}>M</p>
                    </div>

                    <div onClick={() => setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev, "L"])}>
                        <p className={`${sizes.includes("L") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer `}>L</p>
                    </div>

                    <div onClick={() => setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev, "XL"])}>
                        <p className={`${sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer `}>XL</p>
                    </div>

                    <div onClick={() => setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev, "XXL"])}>
                        <p className={`${sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer `}>XXL</p>
                    </div>
                </div>
            </div>

            <div className='flex gap-2 mt-2 '>
                {/* checked--- Iss mai hmm dekhain gyy agrr bestSeller is true then checkbo would be tick otherwise unCheck. */}
                <input onChange={(e) => setBestseller(e.target.checked)} checked={bestseller} type="checkbox" id="bestseller" />
                <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
            </div>
            <button type="submit" className='py-3 mt-4 text-white bg-black w-28'>ADD</button>

        </form >
    )
}

export default Add
