import cx from "classnames";
import { useState } from "react";
import DailyDungeonIframe from "./Games/DailyDungeonIframe";
import Vijay from "./Vijay/Vijay";
import VijayHeaderBig from "./Vijay/VijayHeaderBig";
import LinkedInIcon from "./LinkedInIcon";
import ThreadsIcon from "./ThreadsIcon";
import GitHubIcon from "./GitHubIcon";
import Description from "./Vijay/Description";
import ProjectCard from "./ProjectCard";
import projects from "../data/projects";

type BentoItem = {
  key: string;
  component: React.ReactNode;
  className: string;
};

const Bento = () => {
  const [currentHovered, setCurrentHovered] = useState<string | null>(null);

  const handleEnter = (name: string) => () => setCurrentHovered(name);
  const handleLeave = () => setCurrentHovered(null);

  const heroItems: BentoItem[] = [
    {
      key: "header",
      component: (
        <VijayHeaderBig
          onMouseEnter={handleEnter("header")}
          onMouseLeave={handleLeave}
        />
      ),
      className: "col-span-2 row-span-1",
    },
    {
      key: "threads",
      component: (
        <ThreadsIcon
          onMouseEnter={handleEnter("threads")}
          onMouseLeave={handleLeave}
        />
      ),
      className: "col-span-1 row-span-1",
    },
    {
      key: "linkedin",
      component: (
        <LinkedInIcon
          onMouseEnter={handleEnter("linkedin")}
          onMouseLeave={handleLeave}
        />
      ),
      className: "col-span-1 row-span-1",
    },
    {
      key: "hi",
      component: (
        <Vijay
          onMouseEnter={handleEnter("hi")}
          onMouseLeave={handleLeave}
        />
      ),
      className: "col-span-1 row-span-1",
    },
    {
      key: "github",
      component: (
        <GitHubIcon
          onMouseEnter={handleEnter("github")}
          onMouseLeave={handleLeave}
        />
      ),
      className: "col-span-1 row-span-1",
    },
    {
      key: "description",
      component: (
        <Description
          onMouseEnter={handleEnter("description")}
          onMouseLeave={handleLeave}
        />
      ),
      className: "col-span-2 row-span-1",
    },
  ];

  const projectItems: BentoItem[] = projects.map((project) => ({
    key: `project-${project.title}`,
    component: (
      <ProjectCard
        project={project}
        onMouseEnter={handleEnter(project.title)}
        onMouseLeave={handleLeave}
      />
    ),
    className: project.span === "2" ? "col-span-2 row-span-1" : "col-span-1 row-span-1",
  }));

  const allItems = [...heroItems, ...projectItems];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div
        className="grid auto-rows-[140px] grid-cols-2 sm:grid-cols-4 gap-1.5 transition-all duration-300 ease-in-out w-full"
      >
        {allItems.map((item) => (
          <div
            key={item.key}
            className={cx(
              "row-span-1 rounded-lg overflow-hidden",
              item.className
            )}
          >
            {item.component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bento;
