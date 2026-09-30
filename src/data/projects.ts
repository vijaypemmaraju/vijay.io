import type { ImageMetadata } from "astro";
import seeds from "../assets/projects/seeds.png";
import rako from "../assets/projects/rako.png";
import wikitcg from "../assets/projects/wikitcg.png";
import bsi from "../assets/projects/bsi.png";
import dailydungeon from "../assets/projects/dailydungeon.gif";
import semantical from "../assets/projects/semantical.png";
import fireflies from "../assets/projects/fireflies.png";
import megaflora from "../assets/projects/megaflora.png";
import rondocode from "../assets/projects/rondocode.png";
import technicallyPop from "../assets/projects/technically-pop.jpg";
import yibble from "../assets/projects/yibble-icon.png";
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
    "a cozy solarpunk valley. bring every drone home and fully charged, get the power back on, and the whole valley gathers at the overlook for the evening drone show.",
  made: ["three.js", "blender", "elevenlabs", "cloudflare"],
  links: [{ label: "walk the valley", href: "https://seeds-for-tomorrow.vijayvmp.workers.dev" }],
  image: seeds,
  alt: "a sunlit porch overlooking a green valley, with a small round robot waving and a solar glider parked in the grass",
  note: "my favorite thing i'm working on right now. it changes most days.",
};

export const groups: Group[] = [
  {
    name: "games",
    about: "most are seeded or procedural, and all of them run in a browser or on a phone.",
    projects: [
      {
        name: "rako",
        year: 2026,
        blurb:
          "a field guide to three great beasts. one seed string builds the whole archipelago, its creatures and its weather in the browser, with no engine, and a piano score to wander by.",
        made: ["typescript", "webgl", "web audio"],
        links: [{ label: "rako.vijayvmp.workers.dev", href: "https://rako.vijayvmp.workers.dev" }],
        image: rako,
        alt: "an ink and watercolour title screen: a cloaked figure on a beach looking out at three beasts on distant islands",
      },
      {
        name: "wikitcg",
        year: 2026,
        blurb:
          "every wikipedia article is a holographic trading card. open packs, fuse duplicates, trade, raid and battle. over sixteen thousand players so far, most of them in france.",
        made: ["svelte", "three.js", "cloudflare"],
        links: [{ label: "wikitcg.net", href: "https://wikitcg.net" }],
        image: wikitcg,
        alt: "a fan of foil card packs for series like living heritage and lost empires",
      },
      {
        name: "big science ideas: systems",
        year: 2026,
        blurb:
          "a rebuild of mecc's 1996 classroom cd-rom: a pond, a toilet and the plates of the earth. no copy of the original survives online, so it was pieced back together from sell sheets and teacher guides.",
        made: ["typescript", "canvas", "vite"],
        links: [{ label: "big-science-ideas.vijayvmp.workers.dev", href: "https://big-science-ideas.vijayvmp.workers.dev" }],
        image: bsi,
        alt: "a purple windows 3.1 style sign in dialog for big science ideas: systems",
      },
      {
        name: "semantical",
        year: 2024,
        blurb:
          "a word association game. click through a growing graph of related words until you land on the target.",
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
        blurb: "a pixel-art dungeon crawler with puzzles. a new dungeon every day, and about thirty secret badges.",
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
    about: "lots of small things, computed on the gpu, behaving like living ones.",
    projects: [
      {
        name: "ten million fireflies",
        year: 2026,
        blurb: "ten million fireflies drifting and pulsing at 60fps, simulated entirely in compute shaders.",
        made: ["webgpu", "three.js tsl"],
        links: [{ label: "tenmillionfireflies.com", href: "https://tenmillionfireflies.com" }],
        image: fireflies,
        alt: "a dense cloud of green and gold points of light",
      },
      {
        name: "neural megaflora",
        year: 2026,
        blurb:
          "plants grown in real time by a trained neural cellular automaton. cut one and it heals. an early prototype.",
        made: ["webgpu", "wgsl", "pytorch"],
        links: [{ label: "neural-gamedev.vijayvmp.workers.dev", href: "https://neural-gamedev.vijayvmp.workers.dev" }],
        image: megaflora,
        alt: "a row of glowing teal and gold vines growing out of dark soil",
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
          "live-code synths and patterns in the browser, even on a phone. it runs on a dsp engine written from scratch in an audioworklet, and it can sing.",
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
        blurb: "short pop songs that explain technical ideas: bond pricing, inflation, backpropagation.",
        made: ["elevenlabs", "python", "generated video"],
        links: [{ label: "youtube.com/@technically_pop", href: "https://www.youtube.com/@technically_pop" }],
        image: technicallyPop,
        alt: "two bars comparing a 10-year and a 3-year bond under the word sensitivity",
      },
    ],
  },
  {
    name: "on your phone",
    about: "free, and they keep your data on the device.",
    projects: [
      {
        name: "yibble",
        year: 2026,
        blurb:
          "a tiny alien hatches on your phone, listens to you talk, and slowly learns to speak back in its own language. it runs fully offline.",
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
        blurb: "notes for the disorganized. on-device ai tags, sorts and connects what you write, and it all works offline.",
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
        blurb: "an auto-shooting platformer. dash and wall-slide through procedural levels while your weapons fire on their own.",
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
];

export const smaller: Project[] = [
  {
    name: "tooey",
    year: 2026,
    blurb: "a ui library for interfaces that llms write, using about 41% fewer tokens than the same thing in react.",
    made: [],
    links: [{ label: "tooey", href: "https://vijaypemmaraju.github.io/tooey/" }],
  },
  {
    name: "stream typers",
    year: 2022,
    blurb: "a twitch chat game where viewers race to type answers to trivia, flags and riddles.",
    made: [],
    links: [{ label: "streamtypers.com", href: "https://streamtypers.com" }],
  },
].sort((a, b) => b.year - a.year);

export const elsewhere: Link[] = [
  { label: "github", href: "https://github.com/vijaypemmaraju" },
  { label: "linkedin", href: "https://www.linkedin.com/in/vijay-pemmaraju" },
  { label: "threads", href: "https://threads.net/@hi.im.vijay" },
];
