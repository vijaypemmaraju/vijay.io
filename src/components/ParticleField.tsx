import { useEffect, useRef, type FC } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; size: number; opacity: number; twinkleSpeed: number; twinkleOffset: number };
type Boid = { x: number; y: number; vx: number; vy: number; trail: { x: number; y: number }[] };
type Planet = {
  x: number; y: number; vx: number; vy: number;
  radius: number; mass: number; color: string; colorRgb: [number, number, number];
  orbitCenter: { x: number; y: number };
  ringAngle: number; hasRing: boolean;
  moons: { angle: number; dist: number; speed: number; radius: number }[];
};
type ShootingStar = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number };

const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

const ParticleField: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let mouse = { x: -1000, y: -1000 };
    let time = 0;

    const particles: Particle[] = [];
    const boids: Boid[] = [];
    const planets: Planet[] = [];
    const shootingStars: ShootingStar[] = [];

    const accentColors = ["#4ecdc4", "#ffd93d", "#6c5ce7", "#ff6b6b", "#ff6b2b"];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      const w = canvas.width;
      const h = canvas.height;

      // constellation particles
      particles.length = 0;
      const pCount = Math.floor((w * h) / 16000);
      for (let i = 0; i < pCount; i++) {
        particles.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
          size: Math.random() * 1.8 + 0.3,
          opacity: Math.random() * 0.35 + 0.05,
          twinkleSpeed: 0.5 + Math.random() * 2,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }

      // boids
      boids.length = 0;
      const bCount = Math.floor(Math.min(w, 1600) / 35);
      for (let i = 0; i < bCount; i++) {
        boids.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2,
          trail: [],
        });
      }

      // planets
      planets.length = 0;
      const planetConfigs = [
        { rMin: 6, rMax: 12, mMin: 80, mMax: 150, orbitMin: 100, orbitMax: 180 },
        { rMin: 4, rMax: 8, mMin: 50, mMax: 100, orbitMin: 70, orbitMax: 140 },
        { rMin: 8, rMax: 15, mMin: 100, mMax: 200, orbitMin: 120, orbitMax: 200 },
        { rMin: 3, rMax: 6, mMin: 30, mMax: 70, orbitMin: 60, orbitMax: 120 },
      ];
      const count = Math.min(planetConfigs.length, 3 + Math.floor(Math.random() * 2));
      for (let i = 0; i < count; i++) {
        const cfg = planetConfigs[i];
        const cx = w * (0.15 + Math.random() * 0.7);
        const cy = h * (0.15 + Math.random() * 0.7);
        const orbitRadius = cfg.orbitMin + Math.random() * (cfg.orbitMax - cfg.orbitMin);
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.2 + Math.random() * 0.4;
        const radius = cfg.rMin + Math.random() * (cfg.rMax - cfg.rMin);
        const color = accentColors[i % accentColors.length];

        const moonCount = Math.random() > 0.5 ? 1 + Math.floor(Math.random() * 2) : 0;
        const moons = [];
        for (let m = 0; m < moonCount; m++) {
          moons.push({
            angle: Math.random() * Math.PI * 2,
            dist: radius * 2.5 + Math.random() * radius * 2,
            speed: 0.01 + Math.random() * 0.02,
            radius: 1 + Math.random() * 1.5,
          });
        }

        planets.push({
          x: cx + Math.cos(angle) * orbitRadius,
          y: cy + Math.sin(angle) * orbitRadius,
          vx: -Math.sin(angle) * speed,
          vy: Math.cos(angle) * speed,
          radius, mass: cfg.mMin + Math.random() * (cfg.mMax - cfg.mMin),
          color, colorRgb: hexToRgb(color),
          orbitCenter: { x: cx, y: cy },
          ringAngle: Math.random() * Math.PI * 0.4 - 0.2,
          hasRing: Math.random() > 0.5,
          moons,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      time += 0.016;

      // ── shooting stars (spawn randomly) ──
      if (Math.random() < 0.003) {
        const startX = Math.random() * w;
        const startY = Math.random() * h * 0.4;
        const angle = Math.PI * 0.15 + Math.random() * 0.3;
        const speed = 6 + Math.random() * 6;
        shootingStars.push({
          x: startX, y: startY,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
          life: 0, maxLife: 40 + Math.random() * 30,
        });
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx; s.y += s.vy; s.life++;
        const alpha = 1 - s.life / s.maxLife;
        const tailLen = 30;
        const grad = ctx.createLinearGradient(
          s.x, s.y, s.x - s.vx * tailLen * 0.15, s.y - s.vy * tailLen * 0.15
        );
        grad.addColorStop(0, `rgba(240, 236, 230, ${alpha * 0.8})`);
        grad.addColorStop(1, `rgba(240, 236, 230, 0)`);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * tailLen * 0.15, s.y - s.vy * tailLen * 0.15);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
        if (s.life >= s.maxLife) shootingStars.splice(i, 1);
      }

      // ── 1. Constellation particles ──
      const connDist = 110;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // twinkle
        const twinkle = 0.5 + 0.5 * Math.sin(time * p.twinkleSpeed + p.twinkleOffset);
        const drawOpacity = p.opacity * (0.4 + twinkle * 0.6);

        // mouse gravity
        const mdx = mouse.x - p.x; const mdy = mouse.y - p.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 200 && mdist > 0) {
          const f = 0.02 * (1 - mdist / 200);
          p.vx += (mdx / mdist) * f; p.vy += (mdy / mdist) * f;
        }

        // planet gravity
        for (const pl of planets) {
          const pdx = pl.x - p.x; const pdy = pl.y - p.y;
          const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pdist > 10 && pdist < 200) {
            const gf = (pl.mass * 0.00003) / (pdist * 0.05);
            p.vx += (pdx / pdist) * gf; p.vy += (pdy / pdist) * gf;
          }
        }

        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.99; p.vy *= 0.99;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.8 + twinkle * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 236, 230, ${drawOpacity})`;
        ctx.fill();

        // connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x; const dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < connDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(240, 236, 230, ${(1 - d / connDist) * 0.06})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // ── 2. Boids with trails ──
      const boidSpeed = 2.5;
      const visualRange = 100;
      const separationDist = 25;

      for (const b of boids) {
        let sepX = 0, sepY = 0, avgVx = 0, avgVy = 0, alignCount = 0, avgX = 0, avgY = 0, cohCount = 0;

        for (const other of boids) {
          if (other === b) continue;
          const dx = b.x - other.x; const dy = b.y - other.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < separationDist && d > 0) { sepX += dx / d; sepY += dy / d; }
          if (d < visualRange) {
            avgVx += other.vx; avgVy += other.vy; alignCount++;
            avgX += other.x; avgY += other.y; cohCount++;
          }
        }

        b.vx += sepX * 0.05; b.vy += sepY * 0.05;
        if (alignCount > 0) { b.vx += ((avgVx / alignCount) - b.vx) * 0.04; b.vy += ((avgVy / alignCount) - b.vy) * 0.04; }
        if (cohCount > 0) { b.vx += ((avgX / cohCount) - b.x) * 0.003; b.vy += ((avgY / cohCount) - b.y) * 0.003; }

        // flee mouse
        const bmx = b.x - mouse.x; const bmy = b.y - mouse.y;
        const bmd = Math.sqrt(bmx * bmx + bmy * bmy);
        if (bmd < 150 && bmd > 0) { const flee = 0.15 * (1 - bmd / 150); b.vx += (bmx / bmd) * flee; b.vy += (bmy / bmd) * flee; }

        // planet gravity
        for (const pl of planets) {
          const pdx = pl.x - b.x; const pdy = pl.y - b.y;
          const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
          if (pdist > 15 && pdist < 250) { const gf = (pl.mass * 0.00005) / (pdist * 0.03); b.vx += (pdx / pdist) * gf; b.vy += (pdy / pdist) * gf; }
        }

        const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (spd > boidSpeed) { b.vx = (b.vx / spd) * boidSpeed; b.vy = (b.vy / spd) * boidSpeed; }

        b.x += b.vx; b.y += b.vy;

        const m = 50;
        const wrapped = b.x < -m || b.x > w + m || b.y < -m || b.y > h + m;
        if (b.x < -m) b.x = w + m; if (b.x > w + m) b.x = -m;
        if (b.y < -m) b.y = h + m; if (b.y > h + m) b.y = -m;

        // trail — clear on wrap to avoid cross-screen lines
        if (wrapped) b.trail.length = 0;
        b.trail.push({ x: b.x, y: b.y });
        if (b.trail.length > 12) b.trail.shift();

        // draw trail
        if (b.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(b.trail[0].x, b.trail[0].y);
          for (let t = 1; t < b.trail.length; t++) {
            ctx.lineTo(b.trail[t].x, b.trail[t].y);
          }
          ctx.strokeStyle = `rgba(240, 236, 230, 0.1)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // draw boid
        const angle = Math.atan2(b.vy, b.vx);
        const sz = 4;
        ctx.beginPath();
        ctx.moveTo(b.x + Math.cos(angle) * sz * 1.2, b.y + Math.sin(angle) * sz * 1.2);
        ctx.lineTo(b.x + Math.cos(angle + 2.4) * sz * 0.7, b.y + Math.sin(angle + 2.4) * sz * 0.7);
        ctx.lineTo(b.x + Math.cos(angle - 2.4) * sz * 0.7, b.y + Math.sin(angle - 2.4) * sz * 0.7);
        ctx.closePath();
        ctx.fillStyle = `rgba(240, 236, 230, 0.22)`;
        ctx.fill();
      }

      // ── 3. Planets ──
      for (const pl of planets) {
        // orbital gravity
        const dx = pl.orbitCenter.x - pl.x; const dy = pl.orbitCenter.y - pl.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) { pl.vx += (dx / dist) * 0.008 * dist * 0.01; pl.vy += (dy / dist) * 0.008 * dist * 0.01; }

        // mouse push
        const pmx = pl.x - mouse.x; const pmy = pl.y - mouse.y;
        const pmd = Math.sqrt(pmx * pmx + pmy * pmy);
        if (pmd < 200 && pmd > 0) { const push = 0.05 * (1 - pmd / 200); pl.vx += (pmx / pmd) * push; pl.vy += (pmy / pmd) * push; }

        // planet interactions
        for (const other of planets) {
          if (other === pl) continue;
          const ppx = other.x - pl.x; const ppy = other.y - pl.y;
          const ppd = Math.sqrt(ppx * ppx + ppy * ppy);
          if (ppd > 0 && ppd < 300) {
            const force = ppd < 60 ? -0.01 * (1 - ppd / 60) : 0.001 * (1 - ppd / 300);
            pl.vx += (ppx / ppd) * force; pl.vy += (ppy / ppd) * force;
          }
        }

        pl.vx *= 0.998; pl.vy *= 0.998;
        pl.x += pl.vx; pl.y += pl.vy;

        const [r, g, b] = pl.colorRgb;

        // orbit trail (dashed)
        const orbitR = Math.sqrt((pl.x - pl.orbitCenter.x) ** 2 + (pl.y - pl.orbitCenter.y) ** 2);
        ctx.beginPath();
        ctx.arc(pl.orbitCenter.x, pl.orbitCenter.y, orbitR, 0, Math.PI * 2);
        ctx.setLineDash([4, 8]);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.04)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.setLineDash([]);

        // outer atmosphere glow
        const atmoGrad = ctx.createRadialGradient(pl.x, pl.y, pl.radius * 0.5, pl.x, pl.y, pl.radius * 6);
        atmoGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.08)`);
        atmoGrad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.03)`);
        atmoGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.beginPath();
        ctx.arc(pl.x, pl.y, pl.radius * 6, 0, Math.PI * 2);
        ctx.fillStyle = atmoGrad;
        ctx.fill();

        // planet body with shading
        const bodyGrad = ctx.createRadialGradient(
          pl.x - pl.radius * 0.3, pl.y - pl.radius * 0.3, pl.radius * 0.1,
          pl.x, pl.y, pl.radius
        );
        bodyGrad.addColorStop(0, `rgba(${Math.min(r + 60, 255)}, ${Math.min(g + 60, 255)}, ${Math.min(b + 60, 255)}, 0.6)`);
        bodyGrad.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.45)`);
        bodyGrad.addColorStop(1, `rgba(${Math.floor(r * 0.4)}, ${Math.floor(g * 0.4)}, ${Math.floor(b * 0.4)}, 0.5)`);
        ctx.beginPath();
        ctx.arc(pl.x, pl.y, pl.radius, 0, Math.PI * 2);
        ctx.fillStyle = bodyGrad;
        ctx.fill();

        // specular highlight
        const specGrad = ctx.createRadialGradient(
          pl.x - pl.radius * 0.35, pl.y - pl.radius * 0.35, 0,
          pl.x - pl.radius * 0.2, pl.y - pl.radius * 0.2, pl.radius * 0.6
        );
        specGrad.addColorStop(0, `rgba(255, 255, 255, 0.2)`);
        specGrad.addColorStop(1, `rgba(255, 255, 255, 0)`);
        ctx.beginPath();
        ctx.arc(pl.x, pl.y, pl.radius, 0, Math.PI * 2);
        ctx.fillStyle = specGrad;
        ctx.fill();

        // ring
        if (pl.hasRing) {
          ctx.save();
          ctx.translate(pl.x, pl.y);
          ctx.rotate(pl.ringAngle);
          ctx.scale(1, 0.3);
          ctx.beginPath();
          ctx.arc(0, 0, pl.radius * 2.2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.15)`;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, pl.radius * 1.8, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.08)`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }

        // moons
        for (const moon of pl.moons) {
          moon.angle += moon.speed;
          const mx = pl.x + Math.cos(moon.angle) * moon.dist;
          const my = pl.y + Math.sin(moon.angle) * moon.dist;

          // moon orbit line
          ctx.beginPath();
          ctx.arc(pl.x, pl.y, moon.dist, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.03)`;
          ctx.lineWidth = 0.3;
          ctx.stroke();

          // moon body
          const moonGrad = ctx.createRadialGradient(mx - moon.radius * 0.3, my - moon.radius * 0.3, 0, mx, my, moon.radius);
          moonGrad.addColorStop(0, `rgba(220, 220, 220, 0.4)`);
          moonGrad.addColorStop(1, `rgba(150, 150, 150, 0.2)`);
          ctx.beginPath();
          ctx.arc(mx, my, moon.radius, 0, Math.PI * 2);
          ctx.fillStyle = moonGrad;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    const handleMouse = (e: MouseEvent) => { mouse = { x: e.clientX, y: e.clientY }; };
    // touch support
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    window.addEventListener("resize", init);
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("touchmove", handleTouch, { passive: true });
    init();
    draw();

    return () => {
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("touchmove", handleTouch);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default ParticleField;
