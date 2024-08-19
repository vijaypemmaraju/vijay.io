import type { FC } from "react";
import type { ItemProps } from "../types";
import Back from "../Back";

const VijayHeader: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => {

  return (
    <div
      className="flex w-full h-full p-4 text-2xl font-bold text-white bg-black transition-all items-center gap-2"
      id="vijay"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Back />
      <div style={{
        'view-transition-name': 'vijay',
      }}>
        Vijay Pemmaraju
      </div>
    </div>
  )
}

VijayHeader.displayName = "VijayHeader";


export default VijayHeader;
