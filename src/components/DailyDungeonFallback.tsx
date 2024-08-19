import type { FC } from "react";
import type { ItemProps } from "./types";


const DailyDungeonFallback: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => (
  <video src="/dailydungeon.mov" autoPlay loop muted className="w-full h-full" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />
);

DailyDungeonFallback.displayName = "DailyDungeonFallback";

export default DailyDungeonFallback;
