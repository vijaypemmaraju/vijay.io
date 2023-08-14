import type { FC } from "react";
import type { ItemProps } from "../types";

const DailyDungeonIframe: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => (
  <a
    href="/daily-dungeon"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <iframe
      src="http://dailydungeon.net?demo=true"
      width="100%"
      height="100%"
      frameBorder="0"
      scrolling="no"
      className="pointer-events-none"
    />
  </a>
);

DailyDungeonIframe.displayName = "DailyDungeonIframe";

export default DailyDungeonIframe;
