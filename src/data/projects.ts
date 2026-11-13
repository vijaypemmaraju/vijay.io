import type { ImageMetadata } from "astro";
import seeds from "../assets/projects/seeds.png";
import rako from "../assets/projects/rako.png";
import rious from "../assets/projects/rious.png";
import nullGame from "../assets/projects/null.png";
import wikitcg from "../assets/projects/wikitcg.png";
import bsi from "../assets/projects/bsi.png";
import dailydungeon from "../assets/projects/dailydungeon.gif";
import semantical from "../assets/projects/semantical.png";
import fireflies from "../assets/projects/fireflies.png";
import megaflora from "../assets/projects/megaflora.png";
import rondocode from "../assets/projects/rondocode.png";
import technicallyPop from "../assets/projects/technically-pop.jpg";
import yibble from "../assets/projects/yibble-icon.png";
import schmamera from "../assets/projects/schmamera-icon.png";
import jottie from "../assets/projects/jottie.png";
import upg from "../assets/projects/upg.png";

export type Link = { label: string; href: string };

export type Project = {
  name: string;
  year: number;
  blurb: string;
  made: string[];
  links: Link[];
  image?: ImageMetadata;
  alt?: string;
  // cover crops to fill the frame; contain keeps icons and portrait shots whole
  fit?: "cover" | "contain";
  note?: string;
};

export type Group = { name: string; about: string; projects: Project[] };

export const feature: Project = {
  name: "seeds for tomorrow",
  year: 2026,
  blurb:
    "a cozy solarpunk game set in a valley. you bring all the drones home and charge them, get the power back on, and then everyone gathers at the overlook for a drone show in the evening.",
  made: ["three.js", "blender", "elevenlabs", "cloudflare"],
  links: [{ label: "walk the valley", href: "https://seeds-for-tomorrow.vijayvmp.workers.dev" }],
  image: seeds,
  alt: "a sunlit porch overlooking a green valley, with a small round robot waving and a solar glider parked in the grass",
  note: "my favorite thing i'm working on right now. it changes most days.",
};

export const groups: Group[] = [
  {
    name: "on your phone",
    about: "these are all free and they keep your data on your phone.",
    projects: [
      {
        name: "schmamera",
        year: 2026,
        blurb:
          "a free camera app for iphone. there are seven looks you can blend by dragging across the photo, a plain look that's developed from the sensor's raw data, and a full manual mode. no ads, no account, and nothing leaves your phone. it's in testflight beta right now.",
        made: ["swiftui", "avfoundation", "core image", "metal"],
        links: [
          { label: "schmamera.com", href: "https://schmamera.com" },
          { label: "testflight beta", href: "https://testflight.apple.com/join/228Dun1W" },
        ],
        image: schmamera,
        alt: "the schmamera icon: a small cream camera shrugging with both arms raised",
        fit: "contain",
      },
      {
        name: "yibble",
        year: 2026,
        blurb:
          "a tiny alien pet that hatches on your phone. it listens to you talk and slowly learns to talk back in its own language. it works fully offline.",
        made: ["swift", "spritekit", "on-device ai"],
        links: [
          { label: "app store", href: "https://apps.apple.com/us/app/yibble-tiny-alien-pet/id6761661025" },
          { label: "privacy", href: "/yibble/privacy" },
        ],
        image: yibble,
        alt: "yibble: a round lavender alien with big eyes and two antennae",
        fit: "contain",
      },
      {
        name: "jottie",
        year: 2026,
        blurb: "a note taking app for people like me that like taking notes but dread organizing them. it tags and organizes your notes for you on your device, and it works offline.",
        made: ["swiftui", "on-device ml"],
        links: [
          { label: "app store", href: "https://apps.apple.com/us/app/jottie-smart-notes/id6757324448" },
          { label: "jottie.io", href: "https://jottie.io" },
        ],
        image: jottie,
        alt: "the jottie logo, a sketched seal, on lined notebook paper",
      },
      {
        name: "upg",
        year: 2024,
        blurb: "a platformer where your weapons fire on their own. you dash and wall-slide through procedurally generated levels.",
        made: ["typescript", "tauri"],
        links: [
          { label: "app store", href: "https://apps.apple.com/us/app/upg-bullet-heaven/id6739788187" },
          { label: "privacy", href: "/upg/privacy-policy" },
        ],
        image: upg,
        alt: "a teal pixel title screen with a small orange character on a ledge",
        fit: "contain",
      },
    ],
  },
  {
    name: "sound",
    about: "i'm a musician too, so a lot of what i build ends up making noise.",
    projects: [
      {
        name: "rondocode",
        year: 2026,
        blurb:
          "a live-coding environment for synths and patterns that runs in the browser, even on a phone. i wrote the dsp engine from scratch in an audioworklet. it can also sing.",
        made: ["typescript", "audioworklet", "a small language"],
        links: [
          { label: "rondocode.com", href: "https://rondocode.com" },
          { label: "source", href: "https://github.com/vijaypemmaraju/rondocode" },
        ],
        image: rondocode,
        alt: "a code editor defining an acid synth, with an envelope curve drawn inline",
      },
      {
        name: "technically pop",
        year: 2026,
        blurb: "short pop songs that explain technical stuff like bond pricing, inflation and backpropagation.",
        made: ["elevenlabs", "python", "generated video"],
        links: [{ label: "youtube.com/@technically_pop", href: "https://www.youtube.com/@technically_pop" }],
        image: technicallyPop,
        alt: "two bars comparing a 10-year and a 3-year bond under the word sensitivity",
      },
    ],
  },
  {
    name: "games",
    about: "most of these are procedurally generated from a seed. they all run in a browser or on a phone.",
    projects: [
      {
        name: "null",
        year: 2026,
        blurb:
          "a first-person horror game set in a tower block that's generated from a seed. you wake up on the unfinished top floor and have to make it down to the street. there's something in the building that only moves when you aren't looking at it. you get a torch, a hand mirror and some site cameras.",
        made: ["three.js", "blender", "elevenlabs", "cloudflare"],
        links: [{ label: "null-game.vijayvmp.workers.dev", href: "https://null-game.vijayvmp.workers.dev" }],
        image: nullGame,
        alt: "a dim apartment corridor lit by ceiling tubes, with a black hole ringed in swirling pale light waiting at the far end",
      },
      {
        name: "rious",
        year: 2026,
        blurb:
          "a puzzle game on a seeded island, drawn in ballpoint pen. you have a notebook, and your notes get written onto the world as you notice things. i just started this one.",
        made: ["typescript", "canvas", "blender"],
        links: [{ label: "rious-2d.vijayvmp.workers.dev", href: "https://rious-2d.vijayvmp.workers.dev" }],
        image: rious,
        alt: "a blue ballpoint sketch of a beach and jetty on ruled paper, with a red-coated explorer and the handwritten note: day 1. a boat, a storm, then this beach.",
      },
      {
        name: "rako",
        year: 2026,
        blurb:
          "an exploration game about three giant beasts. the whole archipelago, the creatures and the weather are generated in the browser from one seed string. there's no game engine, and it has a piano score.",
        made: ["typescript", "webgl", "web audio"],
        links: [{ label: "rako.vijayvmp.workers.dev", href: "https://rako.vijayvmp.workers.dev" }],
        image: rako,
        alt: "an ink and watercolour title screen: a cloaked figure on a beach looking out at three beasts on distant islands",
      },
      {
        name: "wikitcg",
        year: 2026,
        blurb:
          "a trading card game where every wikipedia article is a holographic card. you can open packs, fuse duplicates, trade, raid and battle. it has over sixteen thousand players so far, and most of them are in france.",
        made: ["svelte", "three.js", "cloudflare"],
        links: [{ label: "wikitcg.net", href: "https://wikitcg.net" }],
        image: wikitcg,
        alt: "a fan of foil card packs for series like living heritage and lost empires",
      },
      {
        name: "big science ideas: systems",
        year: 2026,
        blurb:
          "a rebuild of a classroom cd-rom that mecc put out in 1996. it has a pond, a toilet and plate tectonics. there's no copy of the original anywhere online, so i pieced it back together from sell sheets and teacher guides.",
        made: ["typescript", "canvas", "vite"],
        links: [{ label: "big-science-ideas.vijayvmp.workers.dev", href: "https://big-science-ideas.vijayvmp.workers.dev" }],
        image: bsi,
        alt: "a purple windows 3.1 style sign in dialog for big science ideas: systems",
      },
      {
        name: "semantical",
        year: 2024,
        blurb:
          "a word association game. you click through a growing graph of related words until you get to the target word.",
        made: ["react", "neo4j", "claude"],
        links: [
          { label: "semantical.fun", href: "https://semantical.fun" },
          { label: "the 2026 rewrite, scored by an embedding model in your browser", href: "https://semantical-2026.vijayvmp.workers.dev" },
        ],
        image: semantical,
        alt: "a graph of words branching out from beguiling: charming, alluring, captivating, enchanting",
      },
      {
        name: "daily dungeon",
        year: 2022,
        blurb: "a pixel art dungeon crawler with puzzles. there's a new dungeon every day and about thirty secret badges.",
        made: ["phaser", "react"],
        links: [{ label: "dailydungeon.net", href: "https://dailydungeon.net" }],
        image: dailydungeon,
        alt: "a tiny pixel-art hero pushing blocks around a dungeon room",
        fit: "contain",
      },
    ],
  },
  {
    name: "simulations",
    about: "gpu simulations of lots of tiny things.",
    projects: [
      {
        name: "ten million fireflies",
        year: 2026,
        blurb: "ten million fireflies drifting and pulsing at 60fps. the whole simulation runs in compute shaders.",
        made: ["webgpu", "three.js tsl"],
        links: [{ label: "tenmillionfireflies.com", href: "https://tenmillionfireflies.com" }],
        image: fireflies,
        alt: "a dense cloud of green and gold points of light",
      },
      {
        name: "neural megaflora",
        year: 2026,
        blurb:
          "plants that are grown in real time by a trained neural cellular automaton. if you cut one, it heals. it's an early prototype.",
        made: ["webgpu", "wgsl", "pytorch"],
        links: [{ label: "neural-gamedev.vijayvmp.workers.dev", href: "https://neural-gamedev.vijayvmp.workers.dev" }],
        image: megaflora,
        alt: "a row of glowing teal and gold vines growing out of dark soil",
      },
    ],
  },
];

export const smaller: Project[] = [
  {
    name: "tooey",
    year: 2026,
    blurb: "a ui library made for llms to write. it uses about 41% fewer tokens than the same ui in react.",
    made: [],
    links: [{ label: "tooey", href: "https://vijaypemmaraju.github.io/tooey/" }],
  },
  {
    name: "stream typers",
    year: 2022,
    blurb: "a twitch chat game where viewers race to type the answers to trivia, flags and riddles.",
    made: [],
    links: [{ label: "streamtypers.com", href: "https://streamtypers.com" }],
  },
].sort((a, b) => b.year - a.year);

export const elsewhere: Link[] = [
  { label: "github", href: "https://github.com/vijaypemmaraju" },
  { label: "linkedin", href: "https://www.linkedin.com/in/vijay-pemmaraju" },
  { label: "threads", href: "https://threads.net/@hi.im.vijay" },
];
