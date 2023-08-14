import { motion } from "framer-motion";

const VijayTallImage = () => (
  <motion.img
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="h-full"
    src="./IMG_9860.JPG"
    alt="Vijay"
  />
);

export default VijayTallImage;
