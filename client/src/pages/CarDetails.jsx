import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, dummyCarData } from "../assets/assets";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [thumbnail, setThumbnail] = useState("");

  const {
    cars,
    axios,
    currency,
    pickupDate,
    returnDate,
    setPickupDate,
    setReturnDate,
  } = useAppContext();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/bookings/create", {
        car: id,
        pickUpDate: pickupDate,
        returnDate,
      });

      if (data.success) {
        toast.success("Booking created successfully");
        navigate("/my-bookings");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const found = cars.find((c) => c._id === id);
    if (found) {
      setCar(found);
      const first =
        found.images && found.images.length
          ? found.images[0]
          : found.image || assets.upload_icon;
      setThumbnail(first);
    }
  }, [cars, id]);

  return car ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-500 
      cursor-pointer"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65" />
        Back to all cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Car Image and Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2"
        >
          {/* <motion.img
            initial = {{ opacity: 0, scale: 0.95}}
            animate={{ opacity:1, scale:1 }}
            transition={{ duration: 0.5, }}
            src={car.image}
            alt={car.model}
            className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md"
          /> */}

          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="flex gap-4 w-full items-start">
              {/* Thumbnails column */}
              <div className="flex flex-col gap-3">
                {(car?.images?.length
                  ? car.images
                  : car?.image
                  ? [car.image]
                  : []
                ).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setThumbnail(image)}
                    className="border w-20 h-20 border-gray-200 rounded overflow-hidden cursor-pointer p-0"
                    aria-label={`Select image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main hero image - fills available height and uses object-cover */}
              <div className="flex-1 rounded-xl overflow-hidden border border-gray-200">
                <div className="w-full h-[40vh] md:h-[45vh] lg:h-[50vh]">
                  <img
                    src={thumbnail || car?.image || assets.upload_icon}
                    alt="Selected product"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500 text-lg">
                {car.category} . {car.year}
              </p>
            </div>
            <hr className="border-borderColor my-6" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: assets.users_icon,
                  text: `${car.seating_capacity} Seats`,
                },
                { icon: assets.fuel_icon, text: `${car.fuel_type}` },
                { icon: assets.car_icon, text: `${car.transmission}` },
                { icon: assets.location_icon, text: `${car.location}` },
              ].map(({ icon, text }) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  key={text}
                  className="flex flex-col items-center bg-light
                 p-4 rounded-lg"
                >
                  <img src={icon} alt="" className="h-5 mb-2" />
                  <p>{text}</p>
                </motion.div>
              ))}
            </div>

            <div>
              <h2 className="text-xl font-medium mb-3">Description</h2>
              <p className="text-gray-500">{car.description}</p>
            </div>

            <div>
              <h1 className="text-xl font-medium mb-3">Features</h1>
              <ul className=" grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "360 camera",
                  "Bluetooth",
                  "GPS",
                  "Heated seats",
                  "Rear view Mirror",
                ].map((item) => (
                  <li key={item} className="text-gray-500 flex items-center">
                    <img src={assets.check_icon} alt="" className="h-4 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Car Booking Section */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="shadow h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500 "
        >
          <p
            className="flex items-center justify-between text-2xl text-gray-800
                font-semibold"
          >
            {currency}
            {car.pricePerDay}
            <span
              className="text-base
                text-gray-400 font-normal"
            >
              {" "}
              per day
            </span>
          </p>

          <hr className="border-borderColor my-6" />

          <div className="flex flex-col gap-2">
            <label htmlFor="pickup-date" className="block mb-2">
              Pickup Date
            </label>
            <input
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              type="date"
              id="pickup-date"
              className="border 
                  border-borderColor rounded-lg px-3 py-2 "
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="return-date" className="block mb-2">
              Return Date
            </label>
            <input
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              type="date"
              id="return-date"
              className="border 
                  border-borderColor rounded-lg px-3 py-2 "
              required
            />
          </div>

          <button
            className="w-full bg-primary text-white py-3 rounded-xl
                hover:bg-primary-dull font-medium cursor-pointer"
          >
            Book Now
          </button>

          <p className="text-center text-sm">
            {" "}
            No credit card required to reserve
          </p>
        </motion.form>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default CarDetails;
