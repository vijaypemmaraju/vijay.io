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
        <div className="text-4xl" style={{
          'view-transition-name': 'vijay',
        }}>
          Vijay Pemmaraju
        </div>
        <div>
          Developer, Game Designer, and Musician
        </div>
      </div>
    </a>
  )
}

VijayHeaderBig.displayName = "VijayHeaderBig";


export default VijayHeaderBig;
