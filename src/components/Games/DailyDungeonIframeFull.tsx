import type { FC } from "react";
import type { ItemProps } from "../types";

const DailyDungeonIframe: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => (
  <iframe
    src="http://dailydungeon.net"
    width="100%"
    height="100%"
    frameBorder="0"
    scrolling="no"
    className="pointer-events-none"
  />
);

DailyDungeonIframe.displayName = "DailyDungeonIframe";

export default DailyDungeonIframe;
