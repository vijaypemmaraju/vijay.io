import cx from "classnames";
import { useEffect, useRef, useState } from "react";
import DailyDungeonIframe from "./Games/DailyDungeonIframe";
import Empty from "./Empty";
import Vijay from "./Vijay/Vijay";
import VijayTallImage from "./Vijay/VijayTallImage";
import VijayHeader from "./Vijay/VijayHeader";
import VijayHeaderBig from "./Vijay/VijayHeaderBig";
import GamesHeader from "./Games/GamesHeader";
import Video from "./MusicVideo";
import GameIcon from "./GameIcon";
import CodeIcon from "./CodeIcon";
import MusicIcon from "./MusicIcon";
import VijayFooter from "./Vijay/VijayFooter";
import StreamTypers from "./StreamTypers";

const Items = [DailyDungeonIframe, Empty, Empty, Vijay, Empty, Empty, Empty];

const Bento = () => {
	const [currentHovered, setCurrentHovered] = useState<string | null>(null);

	let Items = [DailyDungeonIframe, GameIcon, Video, Vijay, MusicIcon, CodeIcon, StreamTypers];
	let itemClassNames = ["", "", "", "col-span-2", "", "", "col-span-2"];

	if (currentHovered === "Vijay") {
		itemClassNames = ["col-span-2", "row-span-3", "col-span-2", "col-span-2"];
		Items = [VijayHeaderBig, VijayTallImage, Vijay, VijayFooter]
	}

	if (currentHovered === "DailyDungeonIframe") {
		itemClassNames = ["m-1", "col-span-2", "col-span-3", "col-span-3"];
		Items = [DailyDungeonIframe, GamesHeader, Empty, Empty];
	}

	return (
		<div
			className={cx(
				"grid auto-rows-[250px] grid-cols-3 transition-all duration-300 ease-in-out",
				currentHovered ? "gap-0" : "gap-3"
			)}
		>
			{Items.map((Item, index) => {
				return (
					<div
						className={cx(
							"row-span-1 border-slate-400/10 bg-neutral-100 dark:bg-neutral-900",
							!currentHovered && 'border-2 rounded-xl',
							itemClassNames[index]
						)}
					>
						<Item
							key={index}
							onMouseEnter={() => setCurrentHovered(Item.displayName || "")}
							onMouseLeave={() => setCurrentHovered(null)}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default Bento;
