import type { FC } from "react";
import type { ItemProps } from "./types";

const Empty: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => (
  <div
    className="flex w-full h-full justify-center items-center text-4xl"
    id="empty"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
  </div>
);

Empty.displayName = "Empty";

export default Empty;
