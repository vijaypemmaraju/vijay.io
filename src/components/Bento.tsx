import cx from "classnames";
import { motion } from "framer-motion";
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
      className: "col-span-2 sm:col-span-3 row-span-2",
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
      key: "description",
      component: (
        <Description
          onMouseEnter={handleEnter("description")}
          onMouseLeave={handleLeave}
        />
      ),
      className: "col-span-2 sm:col-span-2 row-span-1",
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
      key: "github",
      component: (
        <GitHubIcon
          onMouseEnter={handleEnter("github")}
          onMouseLeave={handleLeave}
        />
      ),
      className: "col-span-1 row-span-1",
    },
  ];

  const projectItems: BentoItem[] = projects.map((project, i) => ({
    key: `project-${project.title}`,
    component: (
      <ProjectCard
        project={project}
        index={i}
        onMouseEnter={handleEnter(project.title)}
        onMouseLeave={handleLeave}
      />
    ),
    className:
      project.span === "2"
        ? "col-span-2 sm:col-span-2 row-span-1"
        : "col-span-1 row-span-1",
  }));

  const allItems = [...heroItems, ...projectItems];

  return (
    <div className="w-full max-w-5xl mx-auto px-6 sm:px-10">
      {/* section label */}
      <motion.div
        className="mb-8 flex items-end gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">
          portfolio / 2024
        </span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </motion.div>

      <div className="grid auto-rows-[120px] sm:auto-rows-[140px] grid-cols-2 sm:grid-cols-4 gap-[2px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] w-full">
        {allItems.map((item, i) => (
          <motion.div
            key={item.key}
            className={cx("overflow-hidden", item.className)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {item.component}
          </motion.div>
        ))}
      </div>

      {/* projects divider */}
      {projects.length > 0 && (
        <motion.div
          className="mt-1 mb-1 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">
            selected works
          </span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </motion.div>
      )}
    </div>
  );
};

export default Bento;
