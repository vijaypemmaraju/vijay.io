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
  originalPosition: { x: number; y: number };
  velocity: { x: number; y: number };
};

const TEXT = "Software Engineer • Game Developer • Musician";

let mousePosition = { x: 0, y: 0 };

document.addEventListener("mousemove", (event) => {
  mousePosition = { x: event.clientX, y: event.clientY };
});

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
      const parentBoundingBox = document.getElementById("description")?.getBoundingClientRect();
      const letterBoundingBox = document.getElementById(`char-${index}`)?.getBoundingClientRect();
      const relativePosition = {
        x: (letterBoundingBox?.x || 0) - (parentBoundingBox?.x || 0),
        y: (letterBoundingBox?.y || 0) - (parentBoundingBox?.y || 0),
      };
      const originalPosition = letterPositions[index]?.originalPosition || relativePosition;
      const magnitude = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
      velocity.x /= magnitude;
      velocity.y /= magnitude;
      velocity.x *= 1.8;
      velocity.y *= 1.8;
      const position = letterPositions[index]?.position || { x: 0, y: 0 };

      const newPosition = {
        x: position.x + velocity.x,
        y: position.y + velocity.y,
      };

      const newRelativePosition = {
        x: relativePosition.x + velocity.x,
        y: relativePosition.y + velocity.y,
      };

      if (newRelativePosition.x < 0) {
        velocity.x = -velocity.x;
        newPosition.x += -newRelativePosition.x;
      }

      if (newRelativePosition.x > (parentBoundingBox?.width || 0) - (letterBoundingBox?.width || 0)) {
        velocity.x = -velocity.x;
        newPosition.x -= (newRelativePosition.x - (parentBoundingBox?.width || 0) + (letterBoundingBox?.width || 0));
      }

      if (newRelativePosition.y < 0) {
        velocity.y = -velocity.y;
        newPosition.y += -newRelativePosition.y;
      }

      if (newRelativePosition.y > (parentBoundingBox?.height || 0) - (letterBoundingBox?.height || 0)) {
        velocity.y = -velocity.y;
        newPosition.y -= (newRelativePosition.y - (parentBoundingBox?.height || 0) + (letterBoundingBox?.height || 0));
      }

      // add slight attraction to mouse
      const dx = mousePosition.x - (parentBoundingBox?.x || 0) - newRelativePosition.x;
      const dy = mousePosition.y - (parentBoundingBox?.y || 0) - newRelativePosition.y;
      const distance = Math.sqrt(dx ** 2 + dy ** 2);
      const force = 0.05;
      velocity.x += dx / distance * force;
      velocity.y += dy / distance * force;


      return {
        position: newPosition,
        originalPosition,
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

  return (
    <div
      className="flex flex-col w-full h-full justify-center items-center bg-secondary text-secondary-content text-[15px] hover:border-2 hover:border-white hover:rounded-lg transition-all"
      id="description"
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
              id={`char-${index}`}
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
  )
}

Description.displayName = "Description";


export default Description;
