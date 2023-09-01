import type { FC } from "react";
import type { ItemProps } from "./types";
import { MusicNote } from "@mui/icons-material";

const MusicIcon: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => (
  <div
    className="flex w-full h-full text-[128px] justify-center items-center"
    id="MusicIcon"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <MusicNote fontSize="inherit" className="text-[128px]" />
  </div>
);

MusicIcon.displayName = "MusicIcon";

export default MusicIcon;
