'use client'

import type { FC } from "react";
import type { ItemProps } from "../types";
import DailyDungeonFallback from "../DailyDungeonFallback";

const isMobile = /Mobi/.test(navigator.userAgent);

const DailyDungeonIframe: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => (
  <span onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    {isMobile && <DailyDungeonFallback />}
    {!isMobile && (
      <iframe
        src="http://dailydungeon.net?demo=true"
        width="100%"
        height="100%"
        className="pointer-events-none"
      />
    )}
  </span>
);

DailyDungeonIframe.displayName = "DailyDungeonIframe";

export default DailyDungeonIframe;
