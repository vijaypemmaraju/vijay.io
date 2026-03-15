import { motion } from "framer-motion";
import { useState, type FC } from "react";
import type { Project } from "../data/projects";
import type { ItemProps } from "./types";

type ProjectCardProps = ItemProps & {
  project: Project;
  index: number;
};

const ProjectCard: FC<ProjectCardProps> = ({
  project,
  index,
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
      className="flex flex-col w-full h-full justify-between p-5 bg-white/[0.03] border border-white/[0.06] transition-all duration-500 cursor-pointer group overflow-hidden relative hover:bg-white/[0.06] hover:border-white/[0.12]"
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
        <motion.div
          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700"
          initial={{ scale: 1.1 }}
          whileHover={{ scale: 1 }}
        >
          <img
            src={project.image}
            alt=""
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      <div className="relative z-10 flex justify-between items-start">
        <motion.span
          className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>
        {project.url && (
          <motion.span
            className="text-white/0 group-hover:text-white/40 transition-all duration-500 text-xs -translate-x-2 group-hover:translate-x-0"
          >
            ↗
          </motion.span>
        )}
      </div>

      <div className="relative z-10">
        <motion.div
          className="text-base sm:text-lg font-semibold text-white/90 lowercase tracking-[-0.01em] mb-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {project.title}
        </motion.div>
        <motion.p
          className="text-xs text-white/30 mb-3 leading-relaxed lowercase"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {project.description}
        </motion.p>
        <motion.div
          className="flex gap-2 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono uppercase tracking-[0.1em] text-white/20 group-hover:text-white/40 transition-colors duration-500"
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
