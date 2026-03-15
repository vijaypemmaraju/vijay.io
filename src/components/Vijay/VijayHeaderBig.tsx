import cx from "classnames";
import { motion } from "framer-motion";
import { useState, type FC } from "react";
import type { ItemProps } from "../types";


const VijayHeaderBig: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => {

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cx(
        "flex flex-col w-full h-full justify-end items-start p-6 sm:p-8 bg-transparent overflow-hidden relative group",
      )}
      id="vijay-header"
      onMouseEnter={() => {
        setIsHovered(true);
        onMouseEnter?.();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onMouseLeave?.();
      }}
    >
      <motion.div
        animate={{ opacity: [0, 1], x: [-30, 0] }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col justify-end items-start gap-1"
        layout
      >
        <motion.div
          className="text-[clamp(2.5rem,6vw,5rem)] font-black lowercase leading-[0.85] tracking-[-0.04em] text-white"
          layout
        >
          vijay
        </motion.div>
        <motion.div
          className="text-[clamp(2.5rem,6vw,5rem)] font-black lowercase leading-[0.85] tracking-[-0.04em] text-white/40"
          layout
        >
          pemmaraju
        </motion.div>
        {isHovered && (
          <motion.div
            layout
            className="text-[10px] font-light uppercase tracking-[0.3em] text-white/30 mt-3 font-mono"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            dangerouslySetInnerHTML={{
              __html:
                '<span class="text-white/60">vih</span>-jay <span class="text-white/60">peh</span>-muh-<span class="text-white/60">rah</span>-joo',
            }}
          />
        )}
      </motion.div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.03] to-transparent pointer-events-none" />
    </div>
  );
};

VijayHeaderBig.displayName = "VijayHeaderBig";

export default VijayHeaderBig;
