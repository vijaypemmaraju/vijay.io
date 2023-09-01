import { motion } from "framer-motion";
import { useState, type FC } from "react";
import type { ItemProps } from "../types";

const Vijay: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a href="/vijay">
      <div
        className="flex w-full h-full justify-center items-center text-7xl font-bold text-white bg-black hover:border-2 hover:border-white hover:rounded-lg transition-all"
        id="vijay"
        onMouseEnter={() => {
          setIsHovered(true);
          onMouseEnter?.();
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          onMouseLeave?.();
        }}
      >
        <motion.span layout transition={{
          staggerChildren: 0.1,
        }}>
          {(isHovered ? "Hi." : "Hi. I'm Vijay.").split("").map((char, index) => (
            <motion.span
              key={index}
              className="inline-flex"
              layout
              animate={{
                opacity: [0, 1],
                y: [50, 0],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.span>
      </div>
    </a>
  );
};

Vijay.displayName = "Vijay";

export default Vijay;
