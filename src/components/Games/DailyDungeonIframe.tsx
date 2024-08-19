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
        src="https://dailydungeon.net?demo=true"
        width="100%"
        height="100%"
        className="hover:border-2 hover:border-white hover:rounded-lg box-border"
      />
    )}
  </span>
);

DailyDungeonIframe.displayName = "DailyDungeonIframe";

export default DailyDungeonIframe;
