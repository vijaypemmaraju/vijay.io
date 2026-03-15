import cx from "classnames";
import { motion } from "framer-motion";
import { useState, type FC } from "react";
import type { ItemProps } from "../types";

const Vijay: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cx(
        "flex w-full h-full justify-center items-center font-black select-none relative overflow-hidden transition-all duration-500",
        "bg-white text-black"
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
        className={cx(
          "transition-all duration-300 z-10",
          isHovered ? "text-6xl sm:text-7xl" : "text-5xl sm:text-6xl"
        )}
        layout
      >
        {"hi.".split("").map((char, index) => (
          <motion.span
            key={index}
            className="inline-flex"
            layout
            animate={{
              opacity: [0, 1],
              y: [30, 0],
              rotate: isHovered ? [0, -5, 5, 0] : 0,
            }}
            transition={{
              delay: index * 0.05,
              duration: 0.4,
            }}
            whileHover={{
              scale: 1.5,
              rotate: [0, 15, -15, 0],
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 0 }}
      />
      <motion.span
        className={cx(
          "absolute z-20 text-white font-black pointer-events-none",
          isHovered ? "text-6xl sm:text-7xl" : "text-5xl sm:text-6xl"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ delay: 0.15 }}
      >
        hi.
      </motion.span>
    </div>
  );
};

Vijay.displayName = "Vijay";

export default Vijay;
