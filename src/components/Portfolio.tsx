import { useEffect, useRef, useState, type FC } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParticleField from "./ParticleField";
import projects from "../data/projects";

gsap.registerPlugin(ScrollTrigger);

// stable viewport height that doesn't change with mobile address bar
const getVH = () => window.visualViewport?.height ?? window.innerHeight;
const getVW = () => window.visualViewport?.width ?? window.innerWidth;
const getPx = () => getVW() >= 1024 ? 96 : getVW() >= 640 ? 64 : 32;

/* ─── Hero ──────────────────────────────────────────────── */
const Hero: FC = () => {
  const spacerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const inlineLastNameRef = useRef<HTMLSpanElement>(null);
  const lastNameRef = useRef<HTMLDivElement>(null);
  const extraRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const heroTriggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const spacer = spacerRef.current;
    const name = nameRef.current;
    const lastName = lastNameRef.current;
    const extra = extraRef.current;
    const indicator = indicatorRef.current;
    const inlineLastName = inlineLastNameRef.current;
    if (!spacer || !name || !inlineLastName || !lastName || !extra || !indicator) return;

    // pure helper: compute all positions from current viewport (no side effects)
    const getPositions = () => {
      const px = getPx();
      const vh = getVH();
      const heroFontSize = Math.min(getVW() * 0.14, 192);
      const lineHeight = heroFontSize * 0.9;
      const heroNameY = vh * 0.5 - lineHeight * 1.5;
      const heroLastNameY = heroNameY + lineHeight;
      const heroExtraY = heroLastNameY + lineHeight + 32;
      return { px, vh, heroFontSize, lineHeight, heroNameY, heroLastNameY, heroExtraY };
    };

    const targetNameFontSize = 20;

    const pos = getPositions();

    gsap.set(name, { fontSize: pos.heroFontSize, x: pos.px, y: pos.heroNameY, opacity: 1 });
    gsap.set(inlineLastName, { display: "inline", opacity: 0, width: 0, overflow: "hidden" });
    gsap.set(lastName, { fontSize: pos.heroFontSize, x: pos.px, y: pos.heroLastNameY, autoAlpha: 0.3 });
    gsap.set(extra, { x: pos.px, y: pos.heroExtraY, autoAlpha: 1 });
    gsap.set(indicator, { autoAlpha: 1 });

    // entrance animations
    gsap.from(name, { y: pos.heroNameY + 80, opacity: 0, duration: 1, ease: "power3.out" });
    gsap.from(lastName, { y: pos.heroLastNameY + 80, opacity: 0, duration: 1, delay: 0.1, ease: "power3.out" });
    gsap.from(extra, { y: pos.heroExtraY + 20, opacity: 0, duration: 0.8, delay: 0.3, ease: "power3.out" });
    gsap.from(indicator, { opacity: 0, duration: 0.8, delay: 1.2 });

    // scroll timeline with functional values that re-evaluate on refresh
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: spacer,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
        invalidateOnRefresh: true,
        id: "hero-scroll",
      },
    });

    // name shrinks to top-left
    tl.to(name, { fontSize: targetNameFontSize, x: pos.px, y: 20, duration: 1, ease: "power2.inOut" }, 0);

    // last name fades
    tl.to(lastName, { autoAlpha: 0, y: pos.heroLastNameY - 40, duration: 0.3 }, 0);

    // extras fade
    tl.to(extra, { autoAlpha: 0, y: pos.heroExtraY - 30, duration: 0.25 }, 0);

    // indicator
    tl.to(indicator, { autoAlpha: 0, duration: 0.08 }, 0);

    // inline last name reveal
    tl.to(inlineLastName, { width: "auto", opacity: 1, duration: 0.15, ease: "power2.out" }, 0.8);

    heroTriggersRef.current.push(ScrollTrigger.getById("hero-scroll")!);

    // on visualViewport resize (mobile address bar), just refresh triggers
    const onVPResize = () => ScrollTrigger.refresh();
    window.visualViewport?.addEventListener("resize", onVPResize);

    return () => {
      window.visualViewport?.removeEventListener("resize", onVPResize);
      heroTriggersRef.current.forEach((t) => t.kill());
      heroTriggersRef.current = [];
    };
  }, []);

  return (
    <>
      {/* all hero content is fixed — always on screen */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        {/* name */}
        <div
          ref={nameRef}
          className="absolute top-0 left-0 font-display font-extrabold text-[var(--text)] lowercase leading-[0.9] tracking-[-0.04em] will-change-transform whitespace-nowrap pointer-events-auto"
        >
          vijay<span ref={inlineLastNameRef}> pemmaraju</span>
        </div>

        {/* last name ghost */}
        <div
          ref={lastNameRef}
          className="absolute top-0 left-0 font-display font-extrabold text-[var(--text)] lowercase leading-[0.9] tracking-[-0.04em] will-change-transform"
        >
          pemmaraju
        </div>

        {/* roles + socials */}
        <div ref={extraRef} className="absolute top-0 left-0 will-change-transform pointer-events-auto">
          <p className="text-sm font-mono lowercase tracking-[0.05em] text-[var(--text-muted)]">
            engineer • creator • musician
          </p>
          <div className="flex gap-6 mt-6">
            {[
              { label: "github", href: "https://github.com/vijaypemmaraju" },
              { label: "linkedin", href: "https://www.linkedin.com/in/vijay-pemmaraju" },
              { label: "threads", href: "https://threads.net/@hi.im.vijay" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono lowercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* scroll indicator (also fixed) */}
      <div
        ref={indicatorRef}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-40"
      >
        <span className="text-[10px] font-mono lowercase tracking-[0.3em] text-[var(--text-muted)]">scroll</span>
        <div className="w-px h-8 bg-[var(--text-muted)] animate-pulse" />
      </div>

      {/* spacer — this is what you scroll through to drive the animation */}
      <div ref={spacerRef} className="relative h-[150svh] sm:h-[200svh]" />
    </>
  );
};

/* ─── Project Card ───────────────────────────────────────── */
const ProjectCard: FC<{
  project: (typeof projects)[number];
  index: number;
}> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const color = project.color || "#fff";
  const Wrapper = project.url ? "a" : "div";

  return (
    <Wrapper
      {...(project.url ? { href: project.url, target: "_blank", rel: "noopener noreferrer" } : {})}
      className="block relative group cursor-pointer py-5 border-b border-[var(--border)] transition-colors duration-500 hover:border-opacity-30"
      style={{ borderColor: isHovered ? `${color}25` : undefined }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* left accent */}
      <div
        className="absolute left-0 top-0 w-[2px] h-full transition-all duration-500"
        style={{ backgroundColor: `${color}${isHovered ? "50" : "15"}` }}
      />

      <div className="pl-6 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
        {/* number */}
        <span
          className="text-xs font-mono lowercase tracking-[0.2em] transition-colors duration-500"
          style={{ color: isHovered ? `${color}aa` : "var(--text-muted)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* title */}
        <h2
          className="font-display font-extrabold text-2xl sm:text-3xl lowercase leading-[0.95] tracking-[-0.02em] transition-colors duration-500"
          style={{ color: isHovered ? color : "var(--text)" }}
        >
          {project.title}
        </h2>

        {/* arrow */}
        {project.url && (
          <span
            className="text-lg transition-all duration-500"
            style={{
              color: isHovered ? color : "var(--text-muted)",
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "translateX(0)" : "translateX(-8px)",
            }}
          >
            ↗
          </span>
        )}
      </div>

      {/* description */}
      <p className="pl-6 mt-2 text-sm text-[var(--text-dim)] max-w-xl lowercase leading-relaxed">
        {project.description}
      </p>
    </Wrapper>
  );
};

/* ─── Projects List ─────────────────────────────────────── */
const ProjectsList: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const items = container.querySelectorAll("[data-project]");
    const t = triggersRef.current;

    items.forEach((item, i) => {
      gsap.set(item, { opacity: 0, y: 40, x: i % 2 === 0 ? -30 : 30 });

      t.push(ScrollTrigger.create({
        trigger: item,
        start: "top 90%",
        end: "top 60%",
        scrub: 0.3,
        animation: gsap.to(item, { opacity: 1, y: 0, x: 0, ease: "power2.out" }),
      }));
    });

    return () => {
      t.forEach((st) => st.kill());
      triggersRef.current = [];
    };
  }, []);

  return (
    <div ref={ref} className="relative z-10 px-8 sm:px-16 lg:px-24 max-w-5xl mx-auto">
      {projects.map((project, i) => (
        <div key={project.title} data-project>
          <ProjectCard project={project} index={i} />
        </div>
      ))}
    </div>
  );
};

/* ─── Portfolio ─────────────────────────────────────────── */
const Portfolio: FC = () => {
  const worksLabelRef = useRef<HTMLDivElement>(null);
  const miscRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const t = miscRef.current;
    if (worksLabelRef.current) {
      t.push(ScrollTrigger.create({
        trigger: worksLabelRef.current, start: "top 85%", end: "top 60%", scrub: 0.3,
        animation: gsap.from(worksLabelRef.current, { opacity: 0, y: 20 }),
      }));
    }
    return () => { t.forEach((st) => st.kill()); miscRef.current = []; };
  }, []);

  return (
    <div className="relative">
      <ParticleField />
      <div data-game-fade="">
        <Hero />

        <div ref={worksLabelRef} className="relative z-10 px-8 sm:px-16 lg:px-24 pt-8 pb-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono lowercase tracking-[0.3em] text-[var(--text-muted)]">selected works</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>
        </div>

        <ProjectsList />

        <div className="h-16 sm:h-[30vh]" />
      </div>
    </div>
  );
};

export default Portfolio;
