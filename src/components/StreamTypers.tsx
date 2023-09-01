import type { FC } from "react";
import type { ItemProps } from "./types";

const StreamTypers: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => (
  <div
    className="flex w-full h-full justify-center items-center"
    id="empty"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <div className="w-">
      <h1
        className=""
        style={{
          fontSize: 48,
          fontWeight: 'lighter',
          margin: 4,
          overflow: 'hidden',
          borderRight: '.1em solid orange',
          whiteSpace: 'nowrap',
          letterSpacing: '.15em',
          animation: `typing 1.5s steps(19, end), blink-caret .75s step-end infinite`,
        }}
      >
        Stream Typers
      </h1>
    </div>
  </div>
);

StreamTypers.displayName = "StreamTypers";

export default StreamTypers;
