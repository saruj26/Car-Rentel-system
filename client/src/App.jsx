import React, { use } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import MyBookings from './pages/MyBookings';
import Cars from './pages/Cars';
import Footer from './components/Footer';

const App = () => {
  const [showLogin, setShowLogin] = React.useState(false);
  const isOwnerPath = useLocation().pathname.startsWith('/owner');
  return (
    <>
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin} />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/bookings' element={<MyBookings />} />
        <Route path='/car-details/:id' element={<CarDetails />} />
        <Route path='/car' element={<Cars />} />
      </Routes>

      {!isOwnerPath && <Footer />}
    </>
  )
}

export default App