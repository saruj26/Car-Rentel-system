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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const {
    cars,
    axios,
    currency,
    pickupDate,
    returnDate,
    setPickupDate,
    setReturnDate,
  } = useAppContext();

  // fetch reviews & average rating for this car
  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/reviews/car/${id}`);
      if (data.success) setReviews(data.reviews || []);
    } catch (err) {
      // ignore
    }
    try {
      const { data } = await axios.get(`/api/reviews/car/${id}/average`);
      if (data.success) {
        // show avg only when there are reviews
        if (data.count && Number(data.count) > 0) {
          const v = Number(data.avgRating) || 0;
          setAvgRating(v.toFixed(1));
        } else {
          setAvgRating(null);
        }
      }
    } catch (err) {}
  };

  const checkCanReview = async () => {
    try {
      const { data } = await axios.get(`/api/bookings/user`);
      if (data.success) {
        const has = (data.bookings || []).some((b) => {
          // b.car may be populated object
          const carId = b.car?._id || b.car;
          return String(carId) === String(id) && b.status === "confirmed";
        });
        setCanReview(has);
      }
    } catch (err) {
      setCanReview(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchReviews();
      checkCanReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
      const imgs =
        found.images && found.images.length
          ? found.images
          : found.image
          ? [found.image]
          : [];
      const first = imgs.length ? imgs[0] : assets.upload_icon;
      setThumbnail(first);
      setCurrentIndex(0);
    }
  }, [cars, id]);

  return car ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer"
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
          className="lg:col-span-2 space-y-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-4 w-full items-start">
              {/* Thumbnails column */}
              <div className="flex flex-col gap-3">
                {(car?.images?.length
                  ? car.images
                  : car?.image
                  ? [car.image]
                  : []
                ).map((image, index) => {
                  const isActive = index === currentIndex;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setThumbnail(image);
                        setCurrentIndex(index);
                      }}
                      className={`w-20 h-20 rounded overflow-hidden cursor-pointer p-0 flex items-center justify-center border ${
                        isActive
                          ? "ring-2 ring-primary border-primary"
                          : "border-gray-200"
                      }`}
                      aria-label={`Select image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Main hero image */}
              <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 relative">
                {/* left accent bar to indicate big view */}
                <div className="absolute left-0 top-0 h-full w-1 bg-primary z-10" />
                <div className="w-full h-[40vh] md:h-[45vh] lg:h-[50vh] relative">
                  <img
                    src={thumbnail || car?.image || assets.upload_icon}
                    alt="Selected product"
                    className="w-full h-full object-cover rounded-xl"
                  />

                  {/* Left / Right arrows overlay */}
                  <button
                    type="button"
                    onClick={() => {
                      const imgs =
                        car?.images && car.images.length
                          ? car.images
                          : car?.image
                          ? [car.image]
                          : [];
                      if (!imgs.length) return;
                      const n = imgs.length;
                      const next = (currentIndex - 1 + n) % n;
                      setCurrentIndex(next);
                      setThumbnail(imgs[next]);
                    }}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
                  >
                    <img
                      src={assets.arrow_icon}
                      alt="prev"
                      className="w-4 h-4 rotate-180"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const imgs =
                        car?.images && car.images.length
                          ? car.images
                          : car?.image
                          ? [car.image]
                          : [];
                      if (!imgs.length) return;
                      const n = imgs.length;
                      const next = (currentIndex + 1) % n;
                      setCurrentIndex(next);
                      setThumbnail(imgs[next]);
                    }}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
                  >
                    <img
                      src={assets.arrow_icon}
                      alt="next"
                      className="w-4 h-4"
                    />
                  </button>
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
                  className="flex flex-col items-center bg-light p-4 rounded-lg"
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
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
            {/* Reviews Section */}
            <div className="mt-6">
              <h2 className="text-xl font-medium mb-3">Reviews</h2>

              <div className="mb-4 flex items-center gap-3">
                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 .587l3.668 7.431L23.327 9.6l-5.664 5.522L18.999 24 12 20.202 5.001 24l1.337-8.878L.674 9.6l7.659-1.582L12 .587z" />
                  </svg>
                  <span className="font-semibold">{avgRating || "—"}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </div>
              </div>

              {reviews.length === 0 ? (
                <p className="text-gray-500 mb-4">No reviews yet.</p>
              ) : (
                <ul className="space-y-3">
                  {reviews.map((r) => (
                    <li key={r._id} className="p-3 bg-light rounded">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">
                          {r.user?.name || r.user?.email || "User"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center text-yellow-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < r.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M12 .587l3.668 7.431L23.327 9.6l-5.664 5.522L18.999 24 12 20.202 5.001 24l1.337-8.878L.674 9.6l7.659-1.582L12 .587z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      {r.comment && (
                        <p className="text-gray-600">{r.comment}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {canReview ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const payload = {
                        car: id,
                        rating: newRating,
                        comment: newComment,
                      };
                      const { data } = await axios.post(
                        `/api/reviews`,
                        payload
                      );
                      if (data.success) {
                        setNewComment("");
                        setNewRating(5);
                        fetchReviews();
                        toast.success("Review submitted");
                      } else {
                        toast.error(data.message || "Failed to submit review");
                      }
                    } catch (err) {
                      toast.error(err.message || "Failed to submit review");
                    }
                  }}
                  className="mt-4 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <label className="text-sm">Your rating:</label>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const val = idx + 1; // 1..5
                        const filled = val <= newRating;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setNewRating(val)}
                            aria-label={`${val} star${val > 1 ? "s" : ""}`}
                            className={`w-7 h-7 inline-flex items-center justify-center ${
                              filled ? "text-yellow-400" : "text-gray-300"
                            }`}
                          >
                            <svg
                              className="w-5 h-5"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M12 .587l3.668 7.431L23.327 9.6l-5.664 5.522L18.999 24 12 20.202 5.001 24l1.337-8.878L.674 9.6l7.659-1.582L12 .587z" />
                            </svg>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm">Comment (optional)</label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full border rounded p-2 mt-1"
                      rows={3}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded"
                  >
                    Submit review
                  </button>
                </form>
              ) : (
                <p className="text-sm text-gray-500 mt-4">
                  Only customers who booked this car (confirmed booking) can
                  leave a review.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Car Booking Section */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="shadow h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500"
        >
          <p className="flex items-center justify-between text-2xl text-gray-800 font-semibold">
            {currency}
            {car.pricePerDay}
            <span className="text-base text-gray-400 font-normal">per day</span>
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
              className="border border-borderColor rounded-lg px-3 py-2"
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
              className="border border-borderColor rounded-lg px-3 py-2"
              required
            />
          </div>

          <button className="w-full bg-primary text-white py-3 rounded-xl hover:bg-primary-dull font-medium cursor-pointer">
            Book Now
          </button>

          <p className="text-center text-sm">
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
