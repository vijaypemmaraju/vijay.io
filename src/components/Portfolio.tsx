import { useEffect, useRef, useState, type FC } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParticleField from "./ParticleField";
import projects from "../data/projects";

gsap.registerPlugin(ScrollTrigger);

/* ─── Hero ──────────────────────────────────────────────── */
const Hero: FC = () => {
  const spacerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const inlineLastNameRef = useRef<HTMLSpanElement>(null);
  const lastNameRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const extraRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const heroTriggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const spacer = spacerRef.current;
    const name = nameRef.current;
    const lastName = lastNameRef.current;
    const title = titleRef.current;
    const extra = extraRef.current;
    const indicator = indicatorRef.current;
    const inlineLastName = inlineLastNameRef.current;
    if (!spacer || !name || !inlineLastName || !lastName || !title || !extra || !indicator) return;

    let hasEntrance = false;

    const setup = () => {
      // kill previous triggers
      heroTriggersRef.current.forEach((t) => t.kill());
      heroTriggersRef.current = [];
      gsap.killTweensOf([name, lastName, title, extra, indicator, inlineLastName]);

      const px = window.innerWidth >= 1024 ? 96 : window.innerWidth >= 640 ? 64 : 32;
      const vh = window.innerHeight;
      const heroFontSize = Math.min(window.innerWidth * 0.14, 192);
      const lineHeight = heroFontSize * 0.9;

      const heroNameY = vh * 0.5 - lineHeight * 1.5;
      const heroLastNameY = heroNameY + lineHeight;
      const heroTitleY = heroLastNameY + lineHeight + 32;

      gsap.set(title, { x: px, y: heroTitleY, scale: 1, transformOrigin: "top left" });
      const titleHeight = title.getBoundingClientRect().height;
      const heroExtraY = heroTitleY + titleHeight + 16;

      const targetNameFontSize = 20;
      const targetNameX = px;
      const targetNameY = 20;
      const targetTitleFontSize = 10;
      const targetTitleX = px;
      const targetTitleY = 44;

      // if page is already scrolled, snap to final state
      const scrolled = window.scrollY > vh;

      gsap.set(name, { fontSize: scrolled ? targetNameFontSize : heroFontSize, x: scrolled ? targetNameX : px, y: scrolled ? targetNameY : heroNameY, opacity: 1 });
      gsap.set(inlineLastName, { display: "inline", opacity: scrolled ? 1 : 0, width: scrolled ? "auto" : 0, overflow: "hidden" });
      gsap.set(lastName, { fontSize: heroFontSize, x: px, y: heroLastNameY, autoAlpha: scrolled ? 0 : 0.3 });
      gsap.set(extra, { x: px, y: heroExtraY, autoAlpha: scrolled ? 0 : 1 });
      gsap.set(indicator, { autoAlpha: scrolled ? 0 : 1 });
      gsap.set(title, { x: scrolled ? targetTitleX : px, y: scrolled ? targetTitleY : heroTitleY, scale: scrolled ? targetTitleFontSize / 14 : 1 });

      // entrance only on first load
      if (!hasEntrance && !scrolled) {
        hasEntrance = true;
        gsap.from(name, { y: heroNameY + 80, opacity: 0, duration: 1, ease: "power3.out" });
        gsap.from(lastName, { y: heroLastNameY + 80, opacity: 0, duration: 1, delay: 0.1, ease: "power3.out" });
        gsap.from(title, { y: heroTitleY + 20, opacity: 0, duration: 0.8, delay: 0.3, ease: "power3.out" });
        gsap.from(extra, { y: heroExtraY + 20, opacity: 0, duration: 0.8, delay: 0.5, ease: "power3.out" });
        gsap.from(indicator, { opacity: 0, duration: 0.8, delay: 1.2 });
      }

      // scroll timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: spacer,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          id: "hero-scroll",
        },
      });

      tl.to(name, { fontSize: targetNameFontSize, x: targetNameX, y: targetNameY, duration: 1, ease: "power2.inOut" }, 0);

      const titleScale = targetTitleFontSize / 14;
      tl.to(title, { scale: titleScale, x: targetTitleX, y: targetTitleY, duration: 1, ease: "power2.inOut" }, 0);

      tl.to(lastName, { autoAlpha: 0, y: heroLastNameY - 40, duration: 0.3 }, 0);
      tl.to(extra, { autoAlpha: 0, y: heroExtraY - 30, duration: 0.25 }, 0);
      tl.to(indicator, { autoAlpha: 0, duration: 0.08 }, 0);
      tl.to(inlineLastName, { width: "auto", opacity: 1, duration: 0.15, ease: "power2.out" }, 0.8);

      heroTriggersRef.current.push(ScrollTrigger.getById("hero-scroll")!);
    };

    setup();

    // debounced resize handler
    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setup();
        ScrollTrigger.refresh();
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
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

        {/* title */}
        <div
          ref={titleRef}
          className="absolute top-0 left-0 flex items-center gap-2 will-change-transform pointer-events-auto"
          style={{ maxWidth: `calc(100vw - ${64}px)` }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
          <span className="font-mono lowercase tracking-[0.1em] text-[var(--text-dim)]">
            forward deployed engineer @{" "}
            <span className="text-[var(--text)] opacity-70">elevenlabs</span>
          </span>
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
                className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-300"
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
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--text-muted)]">scroll</span>
        <div className="w-px h-8 bg-[var(--text-muted)] animate-pulse" />
      </div>

      {/* spacer — this is what you scroll through to drive the animation */}
      <div ref={spacerRef} className="relative h-[150vh] sm:h-[200vh]" />
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
          className="text-xs font-mono uppercase tracking-[0.2em] transition-colors duration-500"
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
      <Hero />

      <div ref={worksLabelRef} className="relative z-10 px-8 sm:px-16 lg:px-24 pt-8 pb-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--text-muted)]">selected works</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>
      </div>

      <ProjectsList />

      <div className="h-16 sm:h-[30vh]" />
    </div>
  );
};

export default Portfolio;
