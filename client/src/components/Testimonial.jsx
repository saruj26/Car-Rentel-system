import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";

const Testimonial = () => {
  const testimonials = [
    {
      name: "Emma Rodriguez",
      location: "Barcelona, Spain",
      image:
        assets.testimonial_image_1,
      testimonial:
        "I have rented cars from this service multiple times, and they never disappoint. The vehicles are always in top condition, and the customer service is exceptional.",
    },
    {
      name: "Liam Johnson",
      location: "New York, USA",
      image:
        assets.testimonial_image_2,
      testimonial:
        "The booking process was seamless, and the staff went above and beyond to ensure I had a great experience. Highly recommend to anyone looking for reliable car rentals.",
    },
    {
      name: "Sophia Lee",
      location: "Seoul, South Korea",
      image:
        assets.testimonial_image_2,
      testimonial:"I highly recommend this car rental service. The cars are well-maintained, and the staff is friendly and knowledgeable. They made my trip stress-free and enjoyable.", 
    }
    ];

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">
      <Title
        title="What Our Customers Say"
        subTitle="Discover why discerning travelers choose us for their car rental needs"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg max-w-xs hover:translate-y-1
            transition-all duration-500"
          >
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className="text-xl">{testimonial.name}</p>
                <p className="text-gray-500">{testimonial.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                    <img key={index} src={assets.star_icon} alt="star" />
                ))}
            </div>
            <p className="text-gray-500 max-w-90 mt-4">
              "{testimonial.testimonial}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
