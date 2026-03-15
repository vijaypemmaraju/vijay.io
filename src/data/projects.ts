export type Project = {
  title: string;
  description: string;
  tags: string[];
  url?: string;
  color?: string;

  span?: "1" | "2" | "4";
  rowSpan?: "1" | "2";
};

const projects: Project[] = [
  {
    title: "wikitcg",
    description:
      "turn any wikipedia article into a holographic trading card. collect, trade, battle.",
    tags: ["svelte", "three.js", "cloudflare"],
    url: "https://wikitcg.net",
    color: "#4ecdc4",

    span: "2",
    rowSpan: "2",
  },
  {
    title: "semantical",
    description:
      "an ai word-association game. explore meaning through interactive graph visualization.",
    tags: ["react", "neo4j", "claude"],
    url: "https://semantical.fun",
    color: "#ffd93d",

    span: "2",
  },
  {
    title: "jottie",
    description:
      "ai-powered notes with vector search. remember meaning, not exact words.",
    tags: ["astro", "react", "pgvector"],
    color: "#6c5ce7",

    span: "2",
  },
  {
    title: "daily dungeon",
    description:
      "a procedurally-generated puzzle dungeon that changes every day.",
    tags: ["phaser", "react", "firebase"],
    url: "https://dailydungeon.net",
    color: "#ff6b6b",

    span: "4",
  },
];

export default projects;
