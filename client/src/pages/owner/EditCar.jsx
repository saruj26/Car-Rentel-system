import React, { useEffect, useState } from "react";
import Title from "../../components/owner/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const EditCar = () => {
  const { axios, currency } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [images, setImages] = useState([]);
  const [keptImages, setKeptImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // helper: combined view array (existing kept images first, then new previews)
  const combinedSlots = (() => {
    const kept = Array.isArray(keptImages) ? keptImages : [];
    const newP = Array.isArray(newPreviews) ? newPreviews : [];
    const combined = [...kept, ...newP];
    return Array.from({ length: 4 }).map((_, i) => combined[i]);
  })();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get("/api/owner/cars");
        if (data.success) {
          const found = data.cars.find((c) => c._id === id);
          if (found) setCar(found);
          else toast.error("Car not found");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetch();
  }, [axios, id]);

  // initialize keptImages when car loads
  useEffect(() => {
    if (!car) return;
    const existing =
      car.images && car.images.length
        ? car.images
        : car.image
        ? [car.image]
        : [];
    setKeptImages(existing);
  }, [car]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!car) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      images.slice(0, 4).forEach((f) => formData.append("images", f));
      const carToSend = { ...car, _id: id, images: keptImages };
      formData.append("car", JSON.stringify(carToSend));
      formData.append("carId", id);

      const { data } = await axios.put("/api/owner/update-car", formData);
      if (data.success) {
        toast.success(data.message);
        navigate("/owner/manage-cars");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeField = (key, value) => {
    setCar((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title title="Edit Car" subTitle="Modify car details and images" />

      {!car ? (
        <p>Loading...</p>
      ) : (
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl"
        >
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium">Existing images</label>
            <div className="flex gap-2">
              {combinedSlots.map((slot, idx) => {
                const isKept = idx < (keptImages ? keptImages.length : 0);
                if (slot) {
                  return (
                    <div
                      key={idx}
                      className="relative h-20 w-28 rounded overflow-hidden border"
                    >
                      <img
                        src={slot}
                        alt={`img-${idx}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (isKept) {
                            setKeptImages((prev) =>
                              prev.filter((p) => p !== slot)
                            );
                          } else {
                            const newIndex =
                              idx - (keptImages ? keptImages.length : 0);
                            setNewPreviews((prev) => {
                              const next = prev.slice();
                              const [removed] = next.splice(newIndex, 1);
                              if (removed) URL.revokeObjectURL(removed);
                              return next;
                            });
                            setImages((prev) =>
                              prev.filter((_, i) => i !== newIndex)
                            );
                          }
                        }}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className="h-20 w-28 rounded overflow-hidden border flex items-center justify-center bg-gray-50"
                  >
                    <img
                      src={assets.upload_icon}
                      alt="empty"
                      className="h-8 w-8 opacity-50"
                    />
                  </div>
                );
              })}
            </div>
            <label className="text-sm font-medium mt-3">
              Upload new images (optional, up to 4)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files).slice(0, 4);
                setImages(files);
                // create previews
                const previews = files.map((f) => URL.createObjectURL(f));
                setNewPreviews(previews);
              }}
            />

            {/* previews are integrated into the 4 slots above; no separate preview list needed */}
          </div>

          {/* reuse fields from AddCar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col w-full">
              <label>Brand</label>
              <input
                value={car.brand}
                onChange={(e) => onChangeField("brand", e.target.value)}
                className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
                required
              />
            </div>
            <div className="flex flex-col w-full">
              <label>Model</label>
              <input
                value={car.model}
                onChange={(e) => onChangeField("model", e.target.value)}
                className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex flex-col w-full">
              <label>Year</label>
              <input
                type="number"
                value={car.year}
                onChange={(e) => onChangeField("year", e.target.value)}
                className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
                required
              />
            </div>
            <div className="flex flex-col w-full">
              <label>Daily Price ({currency})</label>
              <input
                type="number"
                value={car.pricePerDay}
                onChange={(e) => onChangeField("pricePerDay", e.target.value)}
                className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
                required
              />
            </div>
            <div className="flex flex-col w-full">
              <label>Category</label>
              <select
                value={car.category}
                onChange={(e) => onChangeField("category", e.target.value)}
                className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              >
                <option value="">Select Category</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex flex-col w-full">
              <label>Transmission</label>
              <select
                value={car.transmission}
                onChange={(e) => onChangeField("transmission", e.target.value)}
                className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              >
                <option value="">Select Transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="Semi-Automatic">Semi-Automatic</option>
              </select>
            </div>
            <div className="flex flex-col w-full">
              <label>Fuel Type</label>
              <select
                value={car.fuel_type}
                onChange={(e) => onChangeField("fuel_type", e.target.value)}
                className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              >
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div className="flex flex-col w-full">
              <label>Seating Capacity</label>
              <input
                type="number"
                value={car.seating_capacity}
                onChange={(e) =>
                  onChangeField("seating_capacity", e.target.value)
                }
                className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col w-full">
            <label>Location</label>
            <select
              value={car.location}
              onChange={(e) => onChangeField("location", e.target.value)}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select Location</option>
              <option value="Jaffna">Jaffna</option>
              <option value="Colombo">Colombo</option>
              <option value="Kandy">Kandy</option>
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label>Description</label>
            <textarea
              rows={4}
              value={car.description}
              onChange={(e) => onChangeField("description", e.target.value)}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              required
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-md font-medium w-max cursor-pointer">
            {isLoading ? "Updating..." : "Update Car"}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditCar;
