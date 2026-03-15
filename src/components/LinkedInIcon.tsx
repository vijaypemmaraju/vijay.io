import { motion } from "framer-motion";
import type { FC } from "react";
import type { ItemProps } from "./types";

const LinkedInIcon: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => (
  <a
    href="https://www.linkedin.com/in/vijay-pemmaraju"
    target="_blank"
    rel="noopener noreferrer"
    className="flex w-full h-full justify-center items-center bg-white/[0.03] border border-white/[0.06] transition-all duration-500 hover:bg-white/[0.08]"
    id="LinkedInIcon"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <motion.svg
      className="w-6 h-6 fill-white/50"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.15 }}
      transition={{ duration: 0.4 }}
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </motion.svg>
  </a>
);

LinkedInIcon.displayName = "LinkedInIcon";

export default LinkedInIcon;
