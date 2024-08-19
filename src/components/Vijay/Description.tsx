import { motion } from "framer-motion";
import type { FC } from "react";
import type { ItemProps } from "../types";

const Description: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => {

  return (
    <a href="/vijay">
      <div
        className="flex flex-col w-full h-full justify-center items-center text-white  hover:border-2 hover:border-white hover:rounded-lg transition-all"
        id="vijay"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <motion.div className="text-base" animate={{ opacity: [0, 1], y: [-50, 0] }} style={{
          'view-transition-name': 'vijay',
        }}>
          Software Engineer • Game Developer • Musician
        </motion.div>
      </div>
    </a>
  )
}

Description.displayName = "Description";


export default Description;
