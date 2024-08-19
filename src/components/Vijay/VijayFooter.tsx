import { motion } from "framer-motion";
import type { FC } from "react";
import type { ItemProps } from "../types";

const VijayFooter: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => {

  return (
    <motion.div
      className="flex flex-col gap-4 w-full h-full justify-center items-center font-bold text-white bg-black hover:border-2 hover:border-white hover:rounded-lg transition-all text-4xl"
      id="vijay"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <motion.div animate={{ opacity: [0, 1], x: [25, 0] }}>
        Developer
      </motion.div>
      <motion.div animate={{ opacity: [0, 1], x: [25, 0] }} transition={{ delay: 0.1 }}>
        Game Designer
      </motion.div>
      <motion.div animate={{ opacity: [0, 1], x: [25, 0] }} transition={{ delay: 0.2 }}>
        Musician
      </motion.div>
    </motion.div>
  )
}

VijayFooter.displayName = "VijayFooter";


export default VijayFooter;
