import React, { useState } from "react";
import { assets, cityList } from "../assets/assets";
import StepCardDisplay from "./AnimatedCardSwap";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [showContact, setShowContact] = useState(true);

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
      image: assets.car_image1,
    },
    {
      id: "l2",
      title: "BMW",
      subtitle: "Sports Coupe",
      image: assets.car_image2,
    },
    {
      id: "l3",
      title: "Audi",
      subtitle: "Premium Sedan",
      image: assets.car_image3,
    },
  ];

  // Define proper card data for right stack (3-step display)
  const rightCards = [
    {
      id: "r1",
      title: "Porsche",
      subtitle: "Sports Car",
      image: assets.car_image4,
    },
    {
      id: "r2",
      title: "Range Rover",
      subtitle: "Luxury SUV",
      image: assets.car_image5 || assets.car_image1,
    },
    {
      id: "r3",
      title: "Tesla",
      subtitle: "Electric Luxury",
      image: assets.car_image6 || assets.car_image2,
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
      className="relative h-screen flex flex-col items-center justify-center gap-14 text-center overflow-hidden"
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
        <div className="w-28 md:w-60">
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
        <div className="w-28 md:w-60">
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

      {/* Professional Contact Card - Bottom Right */}
      {showContact ? (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="hidden md:flex fixed right-6 bottom-6 z-30"
        >
          <div className="relative bg-white shadow-2xl rounded-2xl overflow-hidden w-88 max-w-sm border border-gray-100">
            {/* Professional Header with Gradient */}
            <div className="bg-gradient-to-r from-primary to-primary-dull px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Contact Support
                    </h3>
                    <p className="text-white/80 text-sm">
                      24/7 Customer Service
                    </p>
                  </div>
                </div>

                {/* Professional Close Button */}
                <button
                  onClick={() => setShowContact(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 group"
                  aria-label="Close contact card"
                >
                  <svg
                    className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-2 bg-gray-50/50">
              <div className="space-y-1">
                <div className="flex items-start gap-1 p-1 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium">Email</p>
                    <a
                      href="mailto:contact@carrental.example"
                      className="text-sm text-gray-800 hover:text-primary transition-colors duration-200"
                    >
                      contact@carrental.example
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-1 p-1 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium">Phone</p>
                    <a
                      href="tel:+1234567890"
                      className="text-sm text-gray-800 hover:text-primary transition-colors duration-200"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>
              </div>           
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowContact(true)}
          className="fixed right-6 bottom-6 z-30 hidden md:flex items-center justify-center w-14 h-14 bg-gradient-to-r from-primary to-primary-dull text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Open contact card"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </motion.button>
      )}
    </motion.div>
  );
};

export default Hero;