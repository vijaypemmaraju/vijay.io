export type Project = {
  title: string;
  description: string;
  tags: string[];
  url?: string;
  image?: string;
  span?: "1" | "2";
};

const projects: Project[] = [
  {
    title: "Daily Dungeon",
    description: "A daily roguelike puzzle game playable in your browser.",
    tags: ["game", "web"],
    url: "https://dailydungeon.net",
    span: "2",
  },
  // Add your projects here! Examples:
  // {
  //   title: "Project Name",
  //   description: "Short description of the project.",
  //   tags: ["react", "typescript"],
  //   url: "https://example.com",
  //   span: "1",
  // },
];

export default projects;
