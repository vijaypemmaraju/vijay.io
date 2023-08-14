import type { FC } from "react";
import type { ItemProps } from "./types";


const MusicVideo: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => (
  <video src="/announcement_banger.mp4" autoPlay loop muted className="w-full h-full" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />
);

MusicVideo.displayName = "MusicVideo";

export default MusicVideo;
