import type { FC } from "react";
import type { ItemProps } from "../types";

const DailyDungeonHeader: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => {

  return (
    <div
      className="flex flex-col w-full h-full justify-center items-center font-bold text-white bg-black hover:border-2 hover:border-white hover:rounded-lg transition-all"
      id="vijay"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="text-4xl" style={{
        'view-transition-name': 'daily-dungeon',
      }}>
        Games
      </div>
      <div>

      </div>
    </div>
  )
}

DailyDungeonHeader.displayName = "DailyDungeonHeader";


export default DailyDungeonHeader;
