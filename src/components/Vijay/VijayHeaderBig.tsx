import cx from "classnames";
import { motion } from "framer-motion";
import { useState, type FC } from "react";
import type { ItemProps } from "../types";


const VijayHeaderBig: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => {

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cx("flex flex-col w-full h-full justify-center items-center text-white hover:border-2 hover:border-white hover:rounded-lg transition-all duration-100",
        isHovered ? "text-base font-extralight" : "text-xl font-bold"
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
      <motion.div animate={{ opacity: [0, 1], y: [-50, 0] }} style={{
        'view-transition-name': 'vijay',
      }}>
        {isHovered && 'VIH-jay PEH-muh-RAH-joo'}
        {!isHovered && 'Vijay Pemmaraju'}
      </motion.div>
    </div>
  )
}

VijayHeaderBig.displayName = "VijayHeaderBig";


export default VijayHeaderBig;
