import cx from "classnames";
import { motion } from "framer-motion";
import { useState, type FC } from "react";
import type { ItemProps } from "../types";


const VijayHeaderBig: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => {

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cx("flex flex-col w-full h-full justify-center items-center text-primary-content bg-primary hover:border-2 hover:border-white hover:rounded-lg",
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
      <motion.div animate={{ opacity: [0, 1], y: [-50, 0] }} className="flex flex-col justify-center items-center text-center gap-0" layout>
        <motion.div className="text-2xl font-bold lowercase" layout>
          {'vijay pemmaraju'}
        </motion.div>
        {isHovered && <motion.div
          layout
          className="text-sm font-extralight lowercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          dangerouslySetInnerHTML={{
            __html: '<span class="font-bold">vih</span>-jay <span class="font-bold">peh</span>-muh-<span class="font-bold">rah</span>-joo'
          }}
        />}
      </motion.div>
    </div>
  )
}

VijayHeaderBig.displayName = "VijayHeaderBig";


export default VijayHeaderBig;
