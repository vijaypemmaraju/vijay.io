import type { FC } from "react";
import type { ItemProps } from "./types";
import { Code } from "@mui/icons-material";

const CodeIcon: FC<ItemProps> = ({ onMouseEnter, onMouseLeave }) => (
  <div
    className="flex w-full h-full text-[128px] justify-center items-center"
    id="CodeIcon"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <Code fontSize="inherit" className="text-[128px]" />
  </div>
);

CodeIcon.displayName = "CodeIcon";

export default CodeIcon;
