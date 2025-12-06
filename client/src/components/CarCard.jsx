import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const CarCard = ({ car }) => {
  const currency = import.meta.env.VITE_CURRENCY || "Rs";
  const navigate = useNavigate();
  const { axios } = useAppContext();
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchAvg = async () => {
      try {
        const { data } = await axios.get(`/api/reviews/car/${car._id}/average`);
        if (!mounted) return;
        if (data.success) {
          // if there are no reviews (count === 0) show dash by keeping avgRating null
          if (data.count && Number(data.count) > 0) {
            const v = Number(data.avgRating) || 0;
            setAvgRating(v.toFixed(1));
          } else {
            setAvgRating(null);
          }
        }
      } catch (err) {
        // ignore
      }
    };
    fetchAvg();
    return () => (mounted = false);
  }, [car._id]);

  return (
    <div
      onClick={() => {
        navigate(`/car-details/${car._id}`);
        scrollTo(0, 0);
      }}
      className="group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 
    transition-all duration-500 cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden ">
        <img
          src={car.image}
          alt="Car Image"
          className="w-full h-full object-cover
            transition-transform duration-500 group-hover:scale-105"
        />

        {(car?.isAvailale ?? car?.isAvailale) && (
          <p
            className="absolute top-4 left-4 bg-primary/90
            text-white text-xs px-2.5 py-1 rounded-full "
          >
            Availale Now
          </p>
        )}

        <div
          className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm
            text-white px-3 py-2 rounded-lg text-right"
        >
          <span className="font-semibold">
            {currency}
            {car.pricePerDay}
          </span>
          <span className="text-sm text-white/80"> / day</span>
        </div>

        {/* Rating badge at top-right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/car-details/${car._id}?showReviews=true`);
          }}
          className="absolute top-4 right-4 bg-white/90 text-black px-3 py-1 rounded-full flex items-center gap-2 shadow"
          aria-label="View reviews"
        >
          <svg
            className="w-4 h-4 text-yellow-400"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 .587l3.668 7.431L23.327 9.6l-5.664 5.522L18.999 24 12 20.202 5.001 24l1.337-8.878L.674 9.6l7.659-1.582L12 .587z" />
          </svg>
          <span className="text-sm font-medium">
            {avgRating ? avgRating : "—"}
          </span>
        </button>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-medium">{car.model}</h3>
            <p className="text-muted-foreground text-sm">
              {car.category} . {car.year}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-y-2 text-gray-600">
          <div className="flex items-center text-sm text-muted-foreground">
            <img src={assets.users_icon} alt="user icon" className="h-4 mr-2" />
            <span>{car.seating_capacity}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <img src={assets.fuel_icon} alt="fuel icon" className="h-4 mr-2" />
            <span>{car.fuel_type}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <img src={assets.car_icon} alt="car icon" className="h-4 mr-2" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <img
              src={assets.location_icon}
              alt="location icon"
              className="h-4 mr-2"
            />
            <span>{car.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
