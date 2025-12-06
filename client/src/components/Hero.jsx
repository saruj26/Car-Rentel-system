import React, { useState } from "react";
import { assets, cityList } from "../assets/assets";
import StepCardDisplay from "./AnimatedCardSwap"; // Now uses StepCardDisplay
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState("");

  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } =
    useAppContext();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      "/cars?pickupLocation=" +
        pickupLocation +
        "&pickupDate=" +
        pickupDate +
        "&returnDate=" +
        returnDate
    );
  };

  // Define proper card data for left stack (3-step display)
  const leftCards = [
    { 
      id: "l1", 
      title: "Mercedes", 
      subtitle: "Luxury Sedan", 
      image: assets.car_image1 
    },
    { 
      id: "l2", 
      title: "BMW", 
      subtitle: "Sports Coupe", 
      image: assets.car_image2 
    },
    { 
      id: "l3", 
      title: "Audi", 
      subtitle: "Premium Sedan", 
      image: assets.car_image3 
    },
  ];

  // Define proper card data for right stack (3-step display)
  const rightCards = [
    { 
      id: "r1", 
      title: "Porsche", 
      subtitle: "Sports Car", 
      image: assets.car_image4 
    },
    { 
      id: "r2", 
      title: "Range Rover", 
      subtitle: "Luxury SUV", 
      image: assets.car_image5 || assets.car_image1 // Fallback if needed
    },
    { 
      id: "r3", 
      title: "Tesla", 
      subtitle: "Electric Luxury", 
      image: assets.car_image6 || assets.car_image2 // Fallback if needed
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        backgroundImage:
          "url('https://static.vecteezy.com/system/resources/thumbnails/026/769/896/small_2x/illustration-image-of-landscape-with-country-road-empty-asphalt-road-on-blue-cloudy-sky-background-multicolor-vibrant-outdoors-horizontal-image-generative-ai-illustration-photo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      
      className="relative h-screen flex flex-col items-center justify-center gap-14 text-center"
    >
      {/* DARK GRADIENT OVERLAY FOR READABILITY */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#120f0f]/80 via-[#120f0f]/60 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div> 

      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl md:text-5xl font-semibold text-white relative z-10"
      >
        Luxury cars on Rent
      </motion.h1>

      {/* left decorative card stack — step-by-step display */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="hidden lg:block absolute left-2 sm:left-6 top-20 sm:top-28 z-10"
      >
        <div className="w-28 md:w-72">
          <StepCardDisplay
            cards={leftCards}
            autoAdvance={true}
            interval={3500}
            showControls={false}
          />
        </div>
      </motion.div>

      {/* right decorative card stack — step-by-step display */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="hidden lg:block absolute right-2 sm:right-6 top-20 sm:top-28 z-10"
      >
        <div className="w-28 md:w-72">
          <StepCardDisplay
            cards={rightCards}
            autoAdvance={true}
            interval={4000}
            showControls={false}
          />
        </div>
      </motion.div>

      <motion.form
        initial={{ scale: 0.95, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        onSubmit={handleSearch}
        className="relative z-10 flex flex-col md:flex-row items-start md:items-center
          justify-between p-4 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200
          bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8">
          <div className="flex flex-col items-start gap-2">
            <select
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full p-2 border-none focus:outline-none bg-transparent text-lg"
            >
              <option value="">PickUp Location</option>
              {cityList.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <p className="px-1 text-sm text-gray-500">
              {pickupLocation ? pickupLocation : "Select your pick-up Location"}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <label htmlFor="pickup-date" className="text-gray-600 font-medium">
              Pick-Up Date
            </label>
            <input
              type="date"
              id="pickup-date"
              min={new Date().toISOString().split("T")[0]}
              className="text-sm text-gray-500 border-none focus:outline-none bg-transparent"
              name="pickup-date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col items-start gap-2">
            <label htmlFor="return-date" className="text-gray-600 font-medium">
              Return Date
            </label>
            <input
              type="date"
              id="return-date"
              className="text-sm text-gray-500 border-none focus:outline-none bg-transparent"
              name="return-date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="flex items-center justify-center gap-1 px-9 py-3
            max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer"
        >
          <img
            src={assets.search_icon}
            alt="Search"
            className="brightness-300 w-5 h-5"
          />
          Search
        </motion.button>
      </motion.form>

      <motion.img
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        src={assets.main_car}
        alt="car"
        className="max-h-74 relative z-10"
      />
    </motion.div>
  );
};

export default Hero;