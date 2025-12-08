import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'

const Banner = () => {
  return (
    <motion.div
    initial = {{opacity:0, y:50}}
    whileInView={{ opacity:1 , y:0 }}
    transition={{duration: 0.6 }}
    className='flex flex-col md:flex-row md:items-start
    items-center justify-between px-8 min-md:pl-14 pt-10 bg-gradient-to-r
    from-[#0558fe] to-[#A9CFFF] max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden'>

    <div className='text-white'>
        <h2 className="text-3xl font-medium">Do you Own a luxury car?</h2>
        <p className='mt-2'>Monetize your vehicle by listing it on our platform and earn extra income effortlessly.</p>
        <p className='max-w-130'>We take care of everything, from bookings to maintenance, so you can relax and earn.</p>

        <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className='mt-6 px-6 py-2 bg-white text-primary font-medium
        rounded-lg hover:bg-slate-100 hover:bg-gray-100 transition-all cursor-pointer'>
            List Your Car
        </motion.button>
    </div>

    <motion.img
    initial = {{opacity:0, x:50}}
    whileInView={{ opacity:1 , x:0 }}
    transition={{duration: 0.6, delay: 0.4 }}
    src={assets.banner_car_image} alt="Banner Car" className='max-h-45 mt-10'/>
    </motion.div>
  )
}

export default Banner