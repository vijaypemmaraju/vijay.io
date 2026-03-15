import { motion } from "framer-motion";
import { useState, type FC } from "react";
import type { Project } from "../data/projects";
import type { ItemProps } from "./types";

type ProjectCardProps = ItemProps & {
  project: Project;
};

const ProjectCard: FC<ProjectCardProps> = ({
  project,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const Wrapper = project.url ? "a" : "div";

  return (
    <Wrapper
      {...(project.url
        ? { href: project.url, target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="flex flex-col w-full h-full justify-end p-4 bg-neutral-800 hover:border hover:border-white/20 hover:rounded-lg transition-all cursor-pointer group overflow-hidden relative"
      onMouseEnter={() => {
        setIsHovered(true);
        onMouseEnter?.();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onMouseLeave?.();
      }}
    >
      {project.image && (
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
          <img
            src={project.image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="relative z-10">
        <motion.div
          className="text-lg font-semibold text-white mb-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {project.title}
          {project.url && (
            <motion.span
              className="inline-block ml-1.5 opacity-0 group-hover:opacity-60 transition-opacity text-sm"
              aria-hidden
            >
              ↗
            </motion.span>
          )}
        </motion.div>
        <motion.p
          className="text-sm text-neutral-400 mb-2 leading-snug"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {project.description}
        </motion.p>
        <motion.div
          className="flex gap-1.5 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-neutral-300"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </Wrapper>
  );
};

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
