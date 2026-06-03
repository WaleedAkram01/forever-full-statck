import React from 'react'
import { assets } from '../assets/assets'
function Hero() {
    return (
        <div className='flex flex-col border border-gray-400 sm:flex-row'>
            {/* Hero left side */}
            <div className='flex items-center justify-center w-full py-10 sm:w-1/2 sm:py-0'>
                <div className='text-[#414141]'>
                    <div className='flex items-center gap-2'>
                        <p className='w-8 md:w-11 h-[2px] bg-[#414141]'></p>
                        <p className='text-sm font-medium md:text-base'>OUR BESTSELLERS</p>
                    </div>
                    {/* prata-regular is font-family from google fonts */}
                    <h1 className='prata-regular text-3xl leading-relaxed sm:py-3 lg:text-5xl'>Latest Arrivals</h1>
                    <div className='flex items-center gap-2'>
                        <p className='text-sm font-semibold md:text-base'>SHOP NOW</p>
                        <p className='w-8 md:w-11 h-[1px] bg-[#414141]'></p>

                    </div>
                </div>
            </div>
            {/* Hero Right Side */}
            <img src={assets.hero_img} alt="Hero Image" className='object-cover w-full sm:w-1/2' />
        </div>
    )
}

export default Hero
