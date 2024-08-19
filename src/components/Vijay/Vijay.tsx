import cx from "classnames";
import { motion } from "framer-motion";
import { useState, type FC } from "react";
import type { ItemProps } from "../types";

const Vijay: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cx(
        "flex w-full h-full justify-center items-center font-bold text-accent-content bg-accent hover:border-2 hover:border-white hover:rounded-lg transition-all",
        isHovered ? "text-5xl" : "text-4xl"
      )}
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
      <motion.span
        layout
        transition={{
          staggerChildren: 0.1,
        }}
      >
        {(isHovered ? "Hi." : "Hi.")
          .split("")
          .map((char, index) => (
            <motion.span
              key={index}
              className="inline-flex"
              layout
              animate={{
                opacity: [0, 1],
                y: [50, 0],
              }}
              whileHover={{
                scale: 1.8,
                rotate: [0, 10, -10, 0],
                rotateX: [0, 10, -10, 0],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
      </motion.span>
    </div>
  );
};

Vijay.displayName = "Vijay";

export default Vijay;
