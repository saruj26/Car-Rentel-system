import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

/**
 * StepCardDisplay
 * Shows cards in a step-by-step format with manual navigation
 * instead of automatic rotation
 */
const StepCardDisplay = ({
  cards = [],
  showControls = false,
  autoAdvance = false,
  interval = 4000,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let timer;
    if (autoAdvance && cards.length > 1) {
      timer = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % cards.length);
      }, interval);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoAdvance, cards.length, interval]);

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % cards.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="w-full">
      {/* Step Indicators */}
      <div className="flex justify-center gap-1 mb-2">
        {cards.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentStep
                ? "bg-primary w-6"
                : "bg-gray-300 w-2"
            }`}
          />
        ))}
      </div>

      {/* Card Container */}
      <div className="relative h-90 w-full">
        {cards.map((card, index) => (
          <motion.div
            key={card.id || index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: index === currentStep ? 1 : 0,
              scale: index === currentStep ? 1 : 0.8,
              display: index === currentStep ? "block" : "none",
            }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-white rounded-lg shadow-sm flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="h-full w-full flex items-center justify-center">
              <img
                src={card.image}
                alt={card.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
              <h3 className="font-bold text-lg">{card.title}</h3>
              <p className="text-sm opacity-90">{card.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Controls */}
      {showControls && cards.length > 1 && (
        <div className="flex justify-between items-center mt-3">
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            ← Prev
          </button>
          <div className="text-sm text-gray-600">
            {currentStep + 1} / {cards.length}
          </div>
          <button
            type="button"
            onClick={nextStep}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dull transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

// Default export wrapper
export default function StepCardDisplayExported(props) {
  const defaultCards = [
    {
      id: "c1",
      title: "Honda",
      subtitle: "SUV · Auto",
      image: props.assets?.car_image1 || "",
    },
    {
      id: "c2",
      title: "Toyota",
      subtitle: "Sedan · Auto",
      image: props.assets?.car_image2 || "",
    },
    {
      id: "c3",
      title: "Jeep",
      subtitle: "SUV · Auto",
      image: props.assets?.car_image3 || "",
    },
  ];

  return (
    <StepCardDisplay
      cards={props.cards || defaultCards}
      showControls={props.showControls || false}
      autoAdvance={props.autoAdvance || false}
      interval={props.interval || 4000}
    />
  );
}