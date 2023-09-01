import type { FC } from "react";
import type { ItemProps } from "./types";
import { SportsEsports } from "@mui/icons-material";

const GameIcon: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => (
  <div
    className="flex w-full h-full text-[128px] justify-center items-center"
    id="GameIcon"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <SportsEsports fontSize="inherit" className="text-[128px]" />
  </div>
);

GameIcon.displayName = "GameIcon";

export default GameIcon;
