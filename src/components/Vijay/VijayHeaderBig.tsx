import { motion } from "framer-motion";
import type { FC } from "react";
import type { ItemProps } from "../types";

const VijayHeaderBig: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => {

  return (
    <a href="/vijay">
      <div
        className="flex flex-col w-full h-full justify-center items-center font-bold text-white bg-black hover:border-2 hover:border-white hover:rounded-lg transition-all"
        id="vijay"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <motion.div className="text-5xl" animate={{ opacity: [0, 1], y: [-50, 0] }} style={{
          'view-transition-name': 'vijay',
        }}>
          Vijay Pemmaraju
        </motion.div>
      </div>
    </a>
  )
}

VijayHeaderBig.displayName = "VijayHeaderBig";


export default VijayHeaderBig;
