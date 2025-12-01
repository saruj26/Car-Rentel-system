import React, { useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";

/**
 * AnimatedCardSwap
 * Renders a list of cards with images and every `interval` ms performs a left-rotation
 * where the image in card i moves to card (i-1) (first -> last, second -> first, ...).
 *
 * This implementation uses a FLIP-style clone + Web Animations API to animate each
 * image from its source card to its destination card, then commits the new image order
 * into React state.
 *
 * Props:
 * - cards: array of { id, title, subtitle, image }
 * - interval: ms between rotations (default 3000)
 * - duration: animation duration in ms (default 600)
 */
const AnimatedCardSwap = ({
  cards: initialCards = [],
  interval = 3000,
  duration = 600,
  showControls = false,
}) => {
  const [cards, setCards] = useState(() => initialCards.slice());
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const imgRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    // reset internal cards if initialCards changes
    setCards(initialCards.slice());
  }, [initialCards]);

  useEffect(() => {
    start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  function start() {
    stop();
    timerRef.current = setInterval(() => {
      rotateOnce();
    }, interval);
  }
  function stop() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  // FLIP animation: clone image elements, animate cloned nodes from source rect to dest rect
  async function rotateOnce() {
    if (!containerRef.current) return;
    const n = cards.length;
    if (n <= 1) return;

    // compute destination index for each image: dest = (i - 1 + n) % n (left shift)
    const destIndex = (i) => (i - 1 + n) % n;

    // gather bounding rects for cards
    const rects = cardRefs.current.map(
      (el) => el?.getBoundingClientRect() || null
    );

    // make clone elements and animate
    const clones = [];
    const animations = [];

    for (let i = 0; i < n; i++) {
      const imgEl = imgRefs.current[i];
      const srcRect = rects[i];
      const dIdx = destIndex(i);
      const dstRect = rects[dIdx];
      if (!imgEl || !srcRect || !dstRect) continue;

      // create clone node
      const clone = imgEl.cloneNode(true);
      const body = document.body;
      clone.style.position = "absolute";
      clone.style.left = `${srcRect.left}px`;
      clone.style.top = `${srcRect.top}px`;
      clone.style.width = `${srcRect.width}px`;
      clone.style.height = `${srcRect.height}px`;
      clone.style.margin = "0";
      clone.style.zIndex = 9999;
      clone.style.pointerEvents = "none";
      body.appendChild(clone);
      clones.push(clone);

      // compute translate delta
      const deltaX = dstRect.left - srcRect.left;
      const deltaY = dstRect.top - srcRect.top;

      // animate using Web Animations API (falls back to CSS transition if not supported)
      const anim = clone.animate(
        [
          { transform: "translate(0px, 0px)", opacity: 1 },
          { transform: `translate(${deltaX}px, ${deltaY}px)`, opacity: 1 },
        ],
        {
          duration,
          easing: "cubic-bezier(.2,.8,.2,1)",
          fill: "forwards",
        }
      );
      animations.push(anim.finished);
    }

    // wait for all animations to finish and then commit the new order
    try {
      await Promise.all(animations);
    } catch (e) {
      // ignore
    }

    // cleanup clones
    clones.forEach((c) => c.remove());

    // commit left-shifted images into state
    setCards((prev) => {
      if (!prev || prev.length <= 1) return prev;
      const newCards = prev.slice(1).concat(prev[0]);
      return newCards;
    });
  }

  return (
    <div ref={containerRef} className="w-full">
      <div
        className="flex gap-4 overflow-x-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {cards.map((c, i) => (
          <div
            key={c.id || i}
            ref={(el) => (cardRefs.current[i] = el)}
            className="flex-shrink-0 bg-white rounded-lg shadow-sm flex flex-col items-center text-center"
            style={{ width: 144 }}
          >
            <div className="h-36 w-full  flex items-center justify-center overflow-hidden rounded">
              <img
                ref={(el) => (imgRefs.current[i] = el)}
                src={c.image}
                alt={c.title}
                className="h-full w-full object-cover"
                style={{ maxHeight: 144 }}
              />
            </div>
          </div>
        ))}
      </div>
      {showControls && (
        <div className="flex gap-2 mt-3 justify-center">
          <button
            type="button"
            onClick={() => rotateOnce()}
            className="px-3 py-2 bg-primary text-white rounded"
          >
            Rotate Now
          </button>
          <button
            type="button"
            onClick={() => stop()}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded"
          >
            Pause
          </button>
          <button
            type="button"
            onClick={() => start()}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded"
          >
            Play
          </button>
        </div>
      )}
    </div>
  );
};

// Example default export usage using existing assets if no props provided
export default function AnimatedCardSwapExported(props) {
  const defaultCards = [
    {
      id: "c1",
      title: "Honda",
      subtitle: "SUV · Auto",
      image: assets.car_image1,
    },
    {
      id: "c2",
      title: "Toyota",
      subtitle: "Sedan · Auto",
      image: assets.car_image2,
    },
    {
      id: "c3",
      title: "Jeep",
      subtitle: "SUV · Auto",
      image: assets.car_image3,
    },
    {
      id: "c4",
      title: "Ford",
      subtitle: "Compact · Auto",
      image: assets.car_image4,
    },
  ];

  return (
    <AnimatedCardSwap
      cards={props.cards || defaultCards}
      interval={props.interval || 3500}
      duration={props.duration || 650}
    />
  );
}
