import { create } from "zustand";
import { motion } from "framer-motion";
import { useEffect, useState, type FC } from "react";
import type { ItemProps } from "../types";

type Store = {
  ticks: number;
  letterPositions: LetterPosition[];
  setTicks: (ticks: number) => void;
  setLetterPositions: (letterPositions: LetterPosition[]) => void;
  reset: () => void;
  simulate: () => void;
  interval?: number;
  start: () => void;
};

type LetterPosition = {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
};

const TEXT = "Software Engineer • Game Developer • Musician";

const useStore = create<Store>((set, get) => ({
  ticks: 0,
  setTicks: (ticks) => set({ ticks }),
  letterPositions: [],
  setLetterPositions: (letterPositions) => set({
    letterPositions
  }),
  reset: () => {
    const interval = get().interval;
    if (interval) {
      window.clearInterval(interval);
    }
    set({ ticks: 0, letterPositions: [], interval: undefined });
  },
  simulate: () => set((state) => {
    const { ticks, letterPositions } = state;
    const newLetterPositions = TEXT.split("").map((_, index) => {
      const velocity = letterPositions[index]?.velocity || { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
      const magnitude = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
      velocity.x /= magnitude;
      velocity.y /= magnitude;
      velocity.x *= 1.5;
      velocity.y *= 1.5;
      const position = letterPositions[index]?.position || { x: 0, y: 0 };

      const newPosition = {
        x: position.x + velocity.x,
        y: position.y + velocity.y,
      };

      if (newPosition.x < -30 || newPosition.x > 30) {
        velocity.x = -velocity.x;
      }

      if (newPosition.y < -60 || newPosition.y > 60) {
        velocity.y = -velocity.y;
      }

      return {
        position: newPosition,
        velocity,
      };
    });

    return {
      ticks: ticks + 1,
      letterPositions: newLetterPositions,
    };
  }),
  start: () => !get().interval && set((state) => ({
    ...state,
    interval: window.setInterval(() => {
      state.simulate();
    },
      1000 / 60)
  })),
}));


const Description: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => {
  const ticks = useStore((state) => state.ticks);
  const setTicks = useStore((state) => state.setTicks);
  const letterPositions = useStore((state) => state.letterPositions);
  const setLetterPositions = useStore((state) => state.setLetterPositions);
  const reset = useStore((state) => state.reset);
  const start = useStore((state) => state.start);

  const [isHovered, setIsHovered] = useState(false);

  console.log(letterPositions);

  return (
    <a href="/vijay">
      <div
        className="flex flex-col w-full h-full justify-center items-center bg-secondary text-secondary-content  hover:border-2 hover:border-white hover:rounded-lg transition-all"
        id="vijay"
        onMouseEnter={() => {
          setIsHovered(true);
          onMouseEnter?.();
          start();
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          onMouseLeave?.();
          reset();
        }}
      >
        <motion.span
          layout
          transition={{
            staggerChildren: 0.1,
          }}
        >
          {TEXT
            .split("")
            .map((char, index) => (
              <motion.span
                key={index}
                className="inline-flex"
                layout
                animate={{
                  opacity: [0, 1],
                  x: letterPositions[index]?.position.x || 0,
                  y: letterPositions[index]?.position.y || 0,
                }}
                transition={{
                  duration: 0.1,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
        </motion.span>
      </div>
    </a>
  )
}

Description.displayName = "Description";


export default Description;
