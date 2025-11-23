import React from 'react'
import { assets } from '../assets/assets'
import {motion} from 'motion/react';

const Footer = () => {
  return (
     <motion.div
        initial = {{opacity:0, y:20}}
        whileInView={{opacity:1, y:0}}
        transition={{duration: 0.6}}
        className='px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm bg-gray-200 py-10'>
            <motion.div 
            initial = {{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            transition={{ delay:0.2, duration: 0.6}}
            className='flex flex-wrap justify-between gap-8 pb-6 border-borderColor
                border-b items-start '>
                <div className='max-w-80'>
                    <motion.img
                    initial = {{opacity:0}}
                    whileInView={{opacity:1}}
                    transition={{ delay:0.3, duration: 0.5}}
                    src={assets.logo} alt="logo" className='h-8 md:h-9' />
                    <motion.p
                    initial = {{opacity:0}}
                    whileInView={{opacity:1}}
                    transition={{ delay:0.5, duration: 0.5}}
                    className='max-w-80 mt-3'>
                        Premium car rental service with a wide selection of luxury and everyday vehicles for all your travel needs.
                    </motion.p>

                    <motion.div
                    initial = {{opacity:0}}
                    whileInView={{opacity:1}}
                    transition={{ delay:0.5, duration: 0.5}}
                    className='flex items-center gap-3 mt-4'>
                       <a href="#"><img src={assets.instagram_logo} alt="Instagram" className='w-5 h-5' /></a>
                       <a href="#"><img src={assets.facebook_logo} alt="Facebook" className='w-5 h-5' /></a>
                       <a href="#"><img src={assets.twitter_logo} alt="Twitter" className='w-5 h-5' /></a>
                       <a href="#"><img src={assets.gmail_logo} alt="email" className='w-5 h-5' /></a>
                    </motion.div>

                </div>

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Quick Links</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Browse Cars</a></li>
                        <li><a href="#">List Your Car</a></li>
                        <li><a href="#">About Us</a></li>
                    </ul>
                </div>

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Resources</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Insurance</a></li>
                    </ul>
                </div>

                 <div>
                    <h2 className='text-base font-medium 
                    text-gray-800 uppercase'>Contact</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li>132, Hospital Lane, Jaffna</li>
                        <li>Sarujanan, SJ 2453</li>
                        <li>+94 76 322 7023</li>
                        <li>sarujanang@gmail.com</li>
                    </ul>
                </div>
                
                </motion.div>
                
            
            <motion.div
                initial = {{opacity:0, y:10}}
                whileInView={{opacity:1, y:0}}
                transition={{ delay:0.7, duration: 0.6}}
            className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} Brand. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><a href="#">Privacy</a> </li>
                    <li> |</li>
                    <li><a href="#">Terms</a> </li>
                    <li> |</li>
                    <li><a href="#">Cookies</a> </li>
                </ul>
            </motion.div>
        </motion.div>
  )
}

export default Footer