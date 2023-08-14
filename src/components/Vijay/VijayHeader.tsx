import type { FC } from "react";
import type { ItemProps } from "../types";

const VijayHeader: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => {

  return (
    <a href="/vijay">
      <div
        className="flex w-full h-full p-4 text-2xl font-bold text-white bg-black hover:border-2 hover:border-white hover:rounded-lg transition-all"
        id="vijay"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div style={{
          'view-transition-name': 'vijay',
        }}>
          Vijay Pemmaraju
        </div>
      </div>
    </a>
  )
}

VijayHeader.displayName = "VijayHeader";


export default VijayHeader;
