import React from 'react'
import { assets } from '../assets/assets'

const Add = () => {
    return (
        <form className='flex flex-col items-start w-full gap-3 ' >
            <div>
                <p>Upload Image</p>

                <div className='flex gap-2'>
                    <label htmlFor="image1">
                        <img src={assets.upload_area} className='w-20' alt="" />
                        {/* hidden syy na woo choose file wali option nhii dyy ga. */}
                        <input type="file" id="image1" hidden />
                    </label>
                    <label htmlFor="image2">
                        <img src={assets.upload_area} className='w-20' alt="" />
                        {/* hidden syy na woo choose file wali option nhii dyy ga. */}
                        <input type="file" id="image2" hidden />
                    </label>
                    <label htmlFor="image3">
                        <img src={assets.upload_area} className='w-20' alt="" />
                        {/* hidden syy na woo choose file wali option nhii dyy ga. */}
                        <input type="file" id="image3" hidden />
                    </label>
                    <label htmlFor="image4">
                        <img src={assets.upload_area} className='w-20' alt="" />
                        {/* hidden syy na woo choose file wali option nhii dyy ga. */}
                        <input type="file" id="image4" hidden />
                    </label>
                </div>

                <p>Product Name</p>
                <input className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
            </div>
        </form>
    )
}

export default Add
