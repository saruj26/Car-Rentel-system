import React from 'react'
import { assets, dummyUserData } from '../../assets/assets'
import { Link } from 'react-router-dom'

const NavbarOwner = () => {

const user = dummyUserData;

  return (
   <div className='flex items-center justify-between px-6 
        md:px-10 py-4 text-gray-600 border-b 
        border-borderColor relative trasition-all'>

    <Link to='/'>
    <img src={assets.logo} alt="" className='h-7' />

    </Link>
    <p>Welcome, {user.name || Owner}</p>
   </div>
  )
}

export default NavbarOwner