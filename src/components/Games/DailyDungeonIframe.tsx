import type { FC } from "react";
import type { ItemProps } from "../types";

const DailyDungeonIframe: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => (
  <span
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <iframe
      src="http://dailydungeon.net?demo=true"
      width="100%"
      height="100%"
      className="pointer-events-none"
    />
  </span>
);

DailyDungeonIframe.displayName = "DailyDungeonIframe";

export default DailyDungeonIframe;
