import type { FC } from "react";
import type { ItemProps } from "../types";

const Vijay: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => {

  return (
    <a href="/vijay">
      <div
        className="flex w-full h-full justify-center items-center text-7xl font-bold text-white bg-black hover:border-2 hover:border-white hover:rounded-lg transition-all"
        id="vijay"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <span style={{
        }}>
          Hi. I'm Vijay.
        </span>
      </div>
    </a>
  )
}

Vijay.displayName = "Vijay";


export default Vijay;
