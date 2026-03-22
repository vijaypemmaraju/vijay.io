import { useEffect, useRef, type FC } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; size: number; opacity: number; twinkleSpeed: number; twinkleOffset: number };
type BoidBehavior = "flock" | "scout" | "aggressive" | "flanker" | "swarm";
type Boid = {
  x: number; y: number; vx: number; vy: number;
  trail: { x: number; y: number }[]; dead: boolean; respawnTimer: number;
  behavior: BoidBehavior; aggroTimer: number; squadSlot: number;
  hp: number;
};
type Bullet = { x: number; y: number; vx: number; vy: number; life: number };
type Debris = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number };
type ShootingStar = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number };
type Ship = {
  x: number; y: number; vx: number; vy: number; angle: number;
  trail: { x: number; y: number; alpha: number }[];
  thrusting: boolean; score: number; active: boolean;
  shootCooldown: number; hp: number; maxHp: number;
  invincible: number; damageFlash: number; deathTime: number;
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
    const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    let gameMode = false; // whether touch input goes to game vs page scroll

    // virtual joystick state
    const joystick = {
      active: false, touchId: -1,
      originX: 0, originY: 0, // where thumb first touched
      dx: 0, dy: 0, // current offset from origin
    };

    const particles: Particle[] = [];
    const boids: Boid[] = [];
    const shootingStars: ShootingStar[] = [];
    const bullets: Bullet[] = [];
    const debris: Debris[] = [];
    const keys: Record<string, boolean> = {};
    let hintAlpha = 0.6;
    let hintFadeStarted = false;
    let morphT = 0; // 0 = play triangle, 1 = pause bars

    const ship: Ship = {
      x: 0, y: 0, vx: 0, vy: 0, angle: -Math.PI / 2,
      trail: [], thrusting: false, score: 0, active: false,
      shootCooldown: 0, hp: 5, maxHp: 5,
      invincible: 0, damageFlash: 0, deathTime: 0,
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      updateTogglePos();
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

      // position ship at center
      ship.x = w / 2;
      ship.y = h / 2;
      ship.vx = 0;
      ship.vy = 0;

      // boids — spawn off-screen so they fly in
      boids.length = 0;
      const bCount = Math.floor(Math.min(w, 1600) / 10);
      for (let i = 0; i < bCount; i++) {
        // place along random edge
        const edge = Math.floor(Math.random() * 4);
        let bx: number, by: number, bvx: number, bvy: number;
        const margin = 60;
        if (edge === 0) { bx = -margin; by = Math.random() * h; bvx = 1 + Math.random(); bvy = (Math.random() - 0.5) * 2; }
        else if (edge === 1) { bx = w + margin; by = Math.random() * h; bvx = -1 - Math.random(); bvy = (Math.random() - 0.5) * 2; }
        else if (edge === 2) { bx = Math.random() * w; by = -margin; bvx = (Math.random() - 0.5) * 2; bvy = 1 + Math.random(); }
        else { bx = Math.random() * w; by = h + margin; bvx = (Math.random() - 0.5) * 2; bvy = -1 - Math.random(); }
        boids.push({
          x: bx, y: by, vx: bvx, vy: bvy,
          trail: [], dead: false, respawnTimer: 0, behavior: "flock" as BoidBehavior, aggroTimer: 0, squadSlot: 0, hp: 1,
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

      // ── 2. Boids with trails (only when game active) ──
      const boidSpeed = 2.5;
      const visualRange = 100;
      const separationDist = 25;

      if (!ship.active || !gameMode) {
        // skip boid update/draw when game not started or paused
      } else for (const b of boids) {
        // handle dead boids
        if (b.dead) {
          b.respawnTimer -= 0.016;
          if (b.respawnTimer <= 0) {
            b.dead = false;
            // respawn from off-screen edge
            const edge = Math.floor(Math.random() * 4);
            const mg = 60;
            if (edge === 0) { b.x = -mg; b.y = Math.random() * h; b.vx = 1 + Math.random(); b.vy = (Math.random() - 0.5) * 2; }
            else if (edge === 1) { b.x = w + mg; b.y = Math.random() * h; b.vx = -1 - Math.random(); b.vy = (Math.random() - 0.5) * 2; }
            else if (edge === 2) { b.x = Math.random() * w; b.y = -mg; b.vx = (Math.random() - 0.5) * 2; b.vy = 1 + Math.random(); }
            else { b.x = Math.random() * w; b.y = h + mg; b.vx = (Math.random() - 0.5) * 2; b.vy = -1 - Math.random(); }
            b.trail = [];
            // evolving behavior based on score
            const r = Math.random();
            if (ship.score >= 30) {
              // late game: swarm + all types
              b.behavior = r < 0.2 ? "swarm" : r < 0.38 ? "aggressive" : r < 0.52 ? "flanker" : r < 0.62 ? "scout" : "flock";
            } else if (ship.score >= 18) {
              b.behavior = r < 0.15 ? "swarm" : r < 0.3 ? "aggressive" : r < 0.45 ? "flanker" : r < 0.55 ? "scout" : "flock";
            } else if (ship.score >= 8) {
              b.behavior = r < 0.15 ? "aggressive" : r < 0.25 ? "scout" : "flock";
            } else {
              b.behavior = r < 0.08 ? "scout" : "flock";
            }
            b.aggroTimer = Math.random() * Math.PI * 2;
            b.squadSlot = 0;
            b.hp = b.behavior === "aggressive" ? 2 : 1;
          }
          continue;
        }

        let sepX = 0, sepY = 0, avgVx = 0, avgVy = 0, alignCount = 0, avgX = 0, avgY = 0, cohCount = 0;

        for (const other of boids) {
          if (other === b || other.dead) continue;
          const dx = b.x - other.x; const dy = b.y - other.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < separationDist && d > 0) { sepX += dx / d; sepY += dy / d; }
          if (d < visualRange) {
            avgVx += other.vx; avgVy += other.vy; alignCount++;
            avgX += other.x; avgY += other.y; cohCount++;
          }
        }

        // separation always applies
        b.vx += sepX * 0.05; b.vy += sepY * 0.05;

        const toShipX = ship.x - b.x; const toShipY = ship.y - b.y;
        const toShipD = Math.sqrt(toShipX * toShipX + toShipY * toShipY);

        if (b.behavior === "flock") {
          // passive — standard flocking, flee from ship
          if (alignCount > 0) { b.vx += ((avgVx / alignCount) - b.vx) * 0.04; b.vy += ((avgVy / alignCount) - b.vy) * 0.04; }
          if (cohCount > 0) { b.vx += ((avgX / cohCount) - b.x) * 0.003; b.vy += ((avgY / cohCount) - b.y) * 0.003; }
          const bmx = b.x - mouse.x; const bmy = b.y - mouse.y;
          const bmd = Math.sqrt(bmx * bmx + bmy * bmy);
          if (bmd < 150 && bmd > 0) { const flee = 0.15 * (1 - bmd / 150); b.vx += (bmx / bmd) * flee; b.vy += (bmy / bmd) * flee; }

        } else if (b.behavior === "scout") {
          // cautious — keeps ~150px distance, watches the ship, darts away if too close
          if (toShipD > 0) {
            const idealDist = 150;
            if (toShipD < idealDist * 0.6) {
              // too close — flee fast
              b.vx -= (toShipX / toShipD) * 0.15;
              b.vy -= (toShipY / toShipD) * 0.15;
            } else if (toShipD < idealDist) {
              // orbit at distance
              b.vx += (-toShipY / toShipD) * 0.05;
              b.vy += (toShipX / toShipD) * 0.05;
            } else if (toShipD < idealDist * 2.5) {
              // approach to ideal distance
              b.vx += (toShipX / toShipD) * 0.03;
              b.vy += (toShipY / toShipD) * 0.03;
            }
          }
          // light flocking with nearby scouts
          if (alignCount > 0) { b.vx += ((avgVx / alignCount) - b.vx) * 0.02; b.vy += ((avgVy / alignCount) - b.vy) * 0.02; }

        } else if (b.behavior === "aggressive") {
          // berserker — charges directly at ship, fast, takes 2 hits
          if (toShipD > 0) {
            const strength = 0.1;
            b.vx += (toShipX / toShipD) * strength;
            b.vy += (toShipY / toShipD) * strength;
          }
          // slight alignment with other aggressors
          if (alignCount > 0) { b.vx += ((avgVx / alignCount) - b.vx) * 0.01; b.vy += ((avgVy / alignCount) - b.vy) * 0.01; }

        } else if (b.behavior === "flanker") {
          // hit-and-run — orbits then dashes in periodically
          b.aggroTimer += 0.016;
          const rushing = Math.sin(b.aggroTimer * 1.5) > 0.7;
          if (toShipD > 0) {
            if (rushing) {
              b.vx += (toShipX / toShipD) * 0.14;
              b.vy += (toShipY / toShipD) * 0.14;
            } else {
              const targetDist = 90;
              const pull = (toShipD - targetDist) * 0.002;
              b.vx += (toShipX / toShipD) * pull + (-toShipY / toShipD) * 0.06;
              b.vy += (toShipY / toShipD) * pull + (toShipX / toShipD) * 0.06;
            }
          }

        } else if (b.behavior === "swarm") {
          // coordinated encirclement — each swarm boid takes a slot around the ship
          // count live swarm boids and assign slots
          let swarmIdx = 0; let swarmTotal = 0;
          for (const other of boids) {
            if (other.dead || other.behavior !== "swarm") continue;
            if (other === b) swarmIdx = swarmTotal;
            swarmTotal++;
          }
          b.squadSlot = swarmIdx;
          const slotAngle = (swarmIdx / Math.max(swarmTotal, 1)) * Math.PI * 2;
          b.aggroTimer += 0.016;
          // phases: encircle (shrink ring), then rush together
          const ringPhase = Math.sin(b.aggroTimer * 0.8);
          const targetDist = ringPhase > 0.5 ? 25 : 60 + ringPhase * 40;
          const targetX = ship.x + Math.cos(slotAngle) * targetDist;
          const targetY = ship.y + Math.sin(slotAngle) * targetDist;
          const tdx = targetX - b.x; const tdy = targetY - b.y;
          const tdd = Math.sqrt(tdx * tdx + tdy * tdy);
          if (tdd > 0) {
            const strength = ringPhase > 0.5 ? 0.15 : 0.08;
            b.vx += (tdx / tdd) * strength;
            b.vy += (tdy / tdd) * strength;
          }
        }

        const speedMap: Record<BoidBehavior, number> = {
          flock: boidSpeed, scout: 2.8, aggressive: 3.5, flanker: 3.8, swarm: 3.2,
        };
        const curBoidSpeed = speedMap[b.behavior];
        const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (spd > curBoidSpeed) { b.vx = (b.vx / spd) * curBoidSpeed; b.vy = (b.vy / spd) * curBoidSpeed; }

        b.x += b.vx; b.y += b.vy;

        const m = 50;
        const wrapped = b.x < -m || b.x > w + m || b.y < -m || b.y > h + m;
        if (b.x < -m) b.x = w + m; if (b.x > w + m) b.x = -m;
        if (b.y < -m) b.y = h + m; if (b.y > h + m) b.y = -m;

        // trail — clear on wrap to avoid cross-screen lines
        if (wrapped) b.trail.length = 0;
        b.trail.push({ x: b.x, y: b.y });
        if (b.trail.length > 12) b.trail.shift();

        // color per behavior
        const colorMap: Record<BoidBehavior, string> = {
          flock: "240, 236, 230", scout: "255, 220, 60",
          aggressive: "255, 60, 60", flanker: "180, 80, 255", swarm: "60, 220, 200",
        };
        const trailColor = colorMap[b.behavior];
        const isHostile = b.behavior !== "flock" && b.behavior !== "scout";

        // draw trail
        if (b.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(b.trail[0].x, b.trail[0].y);
          for (let t = 1; t < b.trail.length; t++) {
            ctx.lineTo(b.trail[t].x, b.trail[t].y);
          }
          ctx.strokeStyle = `rgba(${trailColor}, ${isHostile ? 0.18 : 0.1})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // draw boid — different shapes per type
        const angle = Math.atan2(b.vy, b.vx);
        const fillAlpha = b.behavior === "flock" ? 0.22 : 0.4;

        if (b.behavior === "swarm") {
          // diamond shape
          const sz = 5;
          ctx.beginPath();
          ctx.moveTo(b.x + Math.cos(angle) * sz * 1.3, b.y + Math.sin(angle) * sz * 1.3);
          ctx.lineTo(b.x + Math.cos(angle + Math.PI / 2) * sz * 0.5, b.y + Math.sin(angle + Math.PI / 2) * sz * 0.5);
          ctx.lineTo(b.x + Math.cos(angle + Math.PI) * sz * 0.8, b.y + Math.sin(angle + Math.PI) * sz * 0.8);
          ctx.lineTo(b.x + Math.cos(angle - Math.PI / 2) * sz * 0.5, b.y + Math.sin(angle - Math.PI / 2) * sz * 0.5);
          ctx.closePath();
          ctx.fillStyle = `rgba(${trailColor}, ${fillAlpha})`;
          ctx.fill();
        } else if (b.behavior === "aggressive") {
          // larger, sharper triangle
          const sz = 6;
          ctx.beginPath();
          ctx.moveTo(b.x + Math.cos(angle) * sz * 1.4, b.y + Math.sin(angle) * sz * 1.4);
          ctx.lineTo(b.x + Math.cos(angle + 2.2) * sz * 0.8, b.y + Math.sin(angle + 2.2) * sz * 0.8);
          ctx.lineTo(b.x + Math.cos(angle + Math.PI) * sz * 0.3, b.y + Math.sin(angle + Math.PI) * sz * 0.3);
          ctx.lineTo(b.x + Math.cos(angle - 2.2) * sz * 0.8, b.y + Math.sin(angle - 2.2) * sz * 0.8);
          ctx.closePath();
          ctx.fillStyle = `rgba(${trailColor}, ${fillAlpha})`;
          ctx.fill();
          // red glow for aggressors
          const agGrad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 10);
          agGrad.addColorStop(0, `rgba(255, 60, 60, 0.06)`);
          agGrad.addColorStop(1, `rgba(255, 60, 60, 0)`);
          ctx.beginPath();
          ctx.arc(b.x, b.y, 10, 0, Math.PI * 2);
          ctx.fillStyle = agGrad;
          ctx.fill();
        } else if (b.behavior === "scout") {
          // small circle + line feeler
          const sz = 3;
          ctx.beginPath();
          ctx.arc(b.x, b.y, sz, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${trailColor}, ${fillAlpha * 0.7})`;
          ctx.fill();
          // "antenna" line toward ship
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(b.x + Math.cos(angle) * sz * 3, b.y + Math.sin(angle) * sz * 3);
          ctx.strokeStyle = `rgba(${trailColor}, 0.15)`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        } else {
          // default triangle (flock + flanker)
          const sz = b.behavior === "flanker" ? 5 : 4;
          ctx.beginPath();
          ctx.moveTo(b.x + Math.cos(angle) * sz * 1.2, b.y + Math.sin(angle) * sz * 1.2);
          ctx.lineTo(b.x + Math.cos(angle + 2.4) * sz * 0.7, b.y + Math.sin(angle + 2.4) * sz * 0.7);
          ctx.lineTo(b.x + Math.cos(angle - 2.4) * sz * 0.7, b.y + Math.sin(angle - 2.4) * sz * 0.7);
          ctx.closePath();
          ctx.fillStyle = `rgba(${trailColor}, ${fillAlpha})`;
          ctx.fill();
        }
      }

      // ── 3. Debris particles ──
      for (let i = debris.length - 1; i >= 0; i--) {
        const d = debris[i];
        d.x += d.vx; d.y += d.vy;
        d.vx *= 0.97; d.vy *= 0.97;
        d.life++;
        const alpha = (1 - d.life / d.maxLife) * 0.8;
        if (d.life >= d.maxLife) { debris.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * (1 - d.life / d.maxLife), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 107, 43, ${alpha})`;
        ctx.fill();
      }

      // ── 5. Ship mini game ──
      const shipThrust = 0.12;
      const shipMaxSpeed = 4;
      const shipFriction = 0.985;
      const bulletSpeed = 8;
      const bulletHitRadius = 12;

      // activate ship on first key press, touch, or play button
      if (!ship.active && (keys["w"] || keys["a"] || keys["s"] || keys["d"] || keys["arrowup"] || keys["arrowdown"] || keys["arrowleft"] || keys["arrowright"] || keys[" "] || joystick.active || gameMode)) {
        ship.active = true;
        gameMode = true;
        hintFadeStarted = true;
        document.documentElement.dataset.game = "active";
      }

      // fade hint
      if (hintFadeStarted && hintAlpha > 0) {
        hintAlpha -= 0.01;
        if (hintAlpha < 0) hintAlpha = 0;
      }

      // draw hint
      if (hintAlpha > 0) {
        ctx.save();
        ctx.font = "11px 'IBM Plex Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(240, 236, 230, ${hintAlpha * 0.5})`;
        ctx.fillText(isMobile ? "[ touch to fly and shoot ]" : "[ WASD to fly · SPACE to shoot ]", w / 2, h - 30);
        ctx.restore();
      }

      // update & draw bullets (skip when paused)
      if (gameMode) for (let i = bullets.length - 1; i >= 0; i--) {
        const bl = bullets[i];
        bl.x += bl.vx; bl.y += bl.vy;
        bl.life++;
        if (bl.life > 80 || bl.x < -20 || bl.x > w + 20 || bl.y < -20 || bl.y > h + 20) {
          bullets.splice(i, 1); continue;
        }
        const alpha = Math.max(0, 1 - bl.life / 80);
        // bullet trail
        const tailLen = 8;
        const grad = ctx.createLinearGradient(
          bl.x, bl.y, bl.x - bl.vx * tailLen * 0.12, bl.y - bl.vy * tailLen * 0.12
        );
        grad.addColorStop(0, `rgba(255, 107, 43, ${alpha * 0.9})`);
        grad.addColorStop(1, `rgba(255, 107, 43, 0)`);
        ctx.beginPath();
        ctx.moveTo(bl.x, bl.y);
        ctx.lineTo(bl.x - bl.vx * tailLen * 0.12, bl.y - bl.vy * tailLen * 0.12);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.stroke();
        // bullet head
        ctx.beginPath();
        ctx.arc(bl.x, bl.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 100, ${alpha})`;
        ctx.fill();

        // check bullet-boid collisions
        for (const b of boids) {
          if (b.dead) continue;
          const dx = bl.x - b.x; const dy = bl.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < bulletHitRadius) {
            b.hp--;
            bullets.splice(i, 1);
            if (b.hp <= 0) {
              b.dead = true;
              b.respawnTimer = 4 + Math.random() * 3;
              ship.score++;
              // spawn debris explosion
              for (let k = 0; k < 8; k++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1 + Math.random() * 3;
                debris.push({
                  x: b.x, y: b.y,
                  vx: Math.cos(angle) * speed + b.vx * 0.5,
                  vy: Math.sin(angle) * speed + b.vy * 0.5,
                  life: 0, maxLife: 20 + Math.random() * 20,
                  size: 1 + Math.random() * 2,
                });
              }
            } else {
              // hit but not dead — knockback + small sparks
              b.vx += bl.vx * 0.15; b.vy += bl.vy * 0.15;
              for (let k = 0; k < 3; k++) {
                const angle = Math.random() * Math.PI * 2;
                debris.push({
                  x: b.x, y: b.y,
                  vx: Math.cos(angle) * 2, vy: Math.sin(angle) * 2,
                  life: 0, maxLife: 10 + Math.random() * 10, size: 0.8,
                });
              }
            }
            break;
          }
        }
      }

      // restart on R or tap when dead (with 1s delay to prevent accidental restart)
      const canRestart = ship.hp <= 0 && ship.active && gameMode && (time - ship.deathTime) > 1;
      if (canRestart && (keys["r"] || (isMobile && joystick.active))) {
        ship.hp = ship.maxHp;
        ship.score = 0;
        ship.x = w / 2;
        ship.y = h / 2;
        ship.vx = 0;
        ship.vy = 0;
        ship.invincible = 2;
        ship.damageFlash = 0;
        // reset all boids to flock
        for (const b of boids) { b.behavior = "flock"; b.aggroTimer = 0; b.hp = 1; }
      }

      // input (only when active, alive, and game mode)
      ship.thrusting = false;
      if (ship.active && ship.hp > 0 && gameMode) {
        if (keys["w"] || keys["arrowup"]) { ship.vy -= shipThrust; ship.thrusting = true; }
        if (keys["s"] || keys["arrowdown"]) { ship.vy += shipThrust; ship.thrusting = true; }
        if (keys["a"] || keys["arrowleft"]) { ship.vx -= shipThrust; ship.thrusting = true; }
        if (keys["d"] || keys["arrowright"]) { ship.vx += shipThrust; ship.thrusting = true; }

        // virtual joystick input
        if (joystick.active) {
          const joyDist = Math.sqrt(joystick.dx * joystick.dx + joystick.dy * joystick.dy);
          const joyMax = 40; // max joystick radius
          if (joyDist > 5) { // dead zone
            const norm = Math.min(joyDist, joyMax) / joyMax;
            ship.vx += (joystick.dx / joyDist) * shipThrust * norm;
            ship.vy += (joystick.dy / joyDist) * shipThrust * norm;
            ship.thrusting = true;
          }
        }

        // shooting
        if (ship.shootCooldown > 0) ship.shootCooldown -= 0.016;
        const wantsShoot = keys[" "] || keys["mouse0"] || (isMobile && gameMode && ship.active);
        if (wantsShoot && ship.shootCooldown <= 0) {
          ship.shootCooldown = 0.18;
          // aim: mouse click → mouse, mobile → nearest boid, else ship facing
          let aimAngle = ship.angle;
          if (keys["mouse0"]) {
            aimAngle = Math.atan2(mouse.y - ship.y, mouse.x - ship.x);
          } else if (isMobile) {
            // auto-target nearest living boid
            let nearestDist = Infinity;
            for (const b of boids) {
              if (b.dead) continue;
              const dx = b.x - ship.x; const dy = b.y - ship.y;
              const d = dx * dx + dy * dy;
              if (d < nearestDist) { nearestDist = d; aimAngle = Math.atan2(dy, dx); }
            }
          }
          bullets.push({
            x: ship.x + Math.cos(aimAngle) * 10,
            y: ship.y + Math.sin(aimAngle) * 10,
            vx: Math.cos(aimAngle) * bulletSpeed + ship.vx * 0.3,
            vy: Math.sin(aimAngle) * bulletSpeed + ship.vy * 0.3,
            life: 0,
          });
        }
      }

      if (gameMode) {
        // face velocity direction
        if (Math.abs(ship.vx) > 0.1 || Math.abs(ship.vy) > 0.1) {
          ship.angle = Math.atan2(ship.vy, ship.vx);
        }

        // clamp speed
        const spd = Math.sqrt(ship.vx * ship.vx + ship.vy * ship.vy);
        if (spd > shipMaxSpeed) { ship.vx = (ship.vx / spd) * shipMaxSpeed; ship.vy = (ship.vy / spd) * shipMaxSpeed; }
        ship.vx *= shipFriction; ship.vy *= shipFriction;

        ship.x += ship.vx; ship.y += ship.vy;

        // wrap
        if (ship.x < 0) ship.x = w; if (ship.x > w) ship.x = 0;
        if (ship.y < 0) ship.y = h; if (ship.y > h) ship.y = 0;

        // trail
        ship.trail.push({ x: ship.x, y: ship.y, alpha: 1 });
        if (ship.trail.length > 25) ship.trail.shift();
      }

      // draw trail (engine exhaust)
      for (let i = 0; i < ship.trail.length - 1; i++) {
        const t = ship.trail[i];
        const progress = i / ship.trail.length;
        const alpha = progress * 0.3;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 1.5 * (1 - progress) + 0.5, 0, Math.PI * 2);
        ctx.fillStyle = ship.thrusting
          ? `rgba(255, 107, 43, ${alpha})`
          : `rgba(240, 236, 230, ${alpha * 0.4})`;
        ctx.fill();
      }

      // draw ship body (blink when invincible)
      const shipVisible = ship.invincible <= 0 || Math.sin(time * 30) > 0;
      const sz = 7;
      const a = ship.angle;

      if (shipVisible && ship.hp > 0) {
        ctx.save();

        // damage flash — red glow
        if (ship.damageFlash > 0) {
          const dmgGrad = ctx.createRadialGradient(ship.x, ship.y, 0, ship.x, ship.y, sz * 6);
          dmgGrad.addColorStop(0, `rgba(255, 50, 50, ${ship.damageFlash * 0.3})`);
          dmgGrad.addColorStop(1, `rgba(255, 50, 50, 0)`);
          ctx.beginPath();
          ctx.arc(ship.x, ship.y, sz * 6, 0, Math.PI * 2);
          ctx.fillStyle = dmgGrad;
          ctx.fill();
        }

        // ship glow
        const glowGrad = ctx.createRadialGradient(ship.x, ship.y, 0, ship.x, ship.y, sz * 4);
        glowGrad.addColorStop(0, `rgba(255, 107, 43, 0.12)`);
        glowGrad.addColorStop(1, `rgba(255, 107, 43, 0)`);
        ctx.beginPath();
        ctx.arc(ship.x, ship.y, sz * 4, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // ship triangle
        ctx.beginPath();
        ctx.moveTo(ship.x + Math.cos(a) * sz, ship.y + Math.sin(a) * sz);
        ctx.lineTo(ship.x + Math.cos(a + 2.5) * sz * 0.6, ship.y + Math.sin(a + 2.5) * sz * 0.6);
        ctx.lineTo(ship.x + Math.cos(a + Math.PI) * sz * 0.3, ship.y + Math.sin(a + Math.PI) * sz * 0.3);
        ctx.lineTo(ship.x + Math.cos(a - 2.5) * sz * 0.6, ship.y + Math.sin(a - 2.5) * sz * 0.6);
        ctx.closePath();
        ctx.fillStyle = `rgba(255, 107, 43, 0.7)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 107, 43, 0.9)`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // thruster flame
        if (ship.thrusting) {
          const flicker = 0.7 + Math.random() * 0.6;
          const flameLen = sz * 0.8 * flicker;
          ctx.beginPath();
          ctx.moveTo(ship.x + Math.cos(a + 2.5) * sz * 0.4, ship.y + Math.sin(a + 2.5) * sz * 0.4);
          ctx.lineTo(ship.x + Math.cos(a + Math.PI) * flameLen, ship.y + Math.sin(a + Math.PI) * flameLen);
          ctx.lineTo(ship.x + Math.cos(a - 2.5) * sz * 0.4, ship.y + Math.sin(a - 2.5) * sz * 0.4);
          ctx.fillStyle = `rgba(255, 200, 50, ${0.5 * flicker})`;
          ctx.fill();
        }

        ctx.restore();
      }

      // draw HUD
      ctx.save();
      ctx.font = "12px 'IBM Plex Mono', monospace";
      ctx.textAlign = "right";

      // score
      if (ship.score > 0) {
        ctx.fillStyle = `rgba(255, 107, 43, 0.4)`;
        ctx.fillText(`× ${ship.score}`, w - 20, 30);
      }

      // HP pips
      if (ship.active) {
        for (let i = 0; i < ship.maxHp; i++) {
          const pipX = w - 20 - i * 14;
          const pipY = 46;
          ctx.beginPath();
          ctx.arc(pipX, pipY, 3.5, 0, Math.PI * 2);
          if (i < ship.hp) {
            ctx.fillStyle = ship.damageFlash > 0 ? `rgba(255, 80, 80, 0.6)` : `rgba(255, 107, 43, 0.5)`;
          } else {
            ctx.fillStyle = `rgba(240, 236, 230, 0.1)`;
          }
          ctx.fill();
        }
      }

      // game over
      if (ship.hp <= 0 && ship.active) {
        ctx.textAlign = "center";
        ctx.font = "14px 'IBM Plex Mono', monospace";
        ctx.fillStyle = `rgba(255, 80, 80, ${0.3 + Math.sin(time * 2) * 0.1})`;
        ctx.fillText(`destroyed · ${ship.score} kills`, w / 2, h / 2);
        ctx.font = "11px 'IBM Plex Mono', monospace";
        ctx.fillStyle = `rgba(240, 236, 230, 0.25)`;
        ctx.fillText(isMobile ? "[ tap to restart ]" : "[ R to restart ]", w / 2, h / 2 + 22);
      }
      ctx.restore();

      // boid-ship interactions (skip when paused)
      if (gameMode && ship.invincible > 0) ship.invincible -= 0.016;
      if (gameMode && ship.damageFlash > 0) ship.damageFlash -= 0.03;
      const contactRadius = 10;
      if (gameMode) for (const b of boids) {
        if (b.dead) continue;
        const bsx = b.x - ship.x; const bsy = b.y - ship.y;
        const bsd = Math.sqrt(bsx * bsx + bsy * bsy);

        // contact damage
        if (bsd < contactRadius && ship.invincible <= 0 && ship.hp > 0) {
          ship.hp--;
          if (ship.hp <= 0) ship.deathTime = time;
          ship.invincible = 1.5;
          ship.damageFlash = 1;
          // knockback
          if (bsd > 0) {
            ship.vx += (bsx / bsd) * -3;
            ship.vy += (bsy / bsd) * -3;
          }
          // kill the boid on contact
          b.dead = true;
          b.respawnTimer = 3 + Math.random() * 2;
          for (let k = 0; k < 6; k++) {
            const ang = Math.random() * Math.PI * 2;
            const spd2 = 1 + Math.random() * 2;
            debris.push({
              x: b.x, y: b.y,
              vx: Math.cos(ang) * spd2, vy: Math.sin(ang) * spd2,
              life: 0, maxLife: 15 + Math.random() * 15,
              size: 1 + Math.random() * 1.5,
            });
          }
        }

        // passive boids flee from ship
        if ((b.behavior === "flock" || b.behavior === "scout") && bsd < 120 && bsd > 0) {
          const flee = 0.1 * (1 - bsd / 120);
          b.vx += (bsx / bsd) * flee;
          b.vy += (bsy / bsd) * flee;
        }
      }

      // ── Pause/play toggle button (desktop + mobile) ──
      // sync data-game attribute with gameMode
      if (ship.active) {
        document.documentElement.dataset.game = gameMode ? "active" : "paused";
      }
      if (ship.active || isMobile) {
        // animate morph between play and pause
        const targetT = gameMode ? 1 : 0;
        morphT += (targetT - morphT) * 0.12;

        ctx.save();
        ctx.beginPath();
        ctx.arc(toggleBtn.x, toggleBtn.y, toggleBtn.r, 0, Math.PI * 2);
        const btnR = Math.round(morphT * 255 + (1 - morphT) * 240);
        const btnG = Math.round(morphT * 107 + (1 - morphT) * 236);
        const btnB = Math.round(morphT * 43 + (1 - morphT) * 230);
        ctx.fillStyle = `rgba(${btnR}, ${btnG}, ${btnB}, ${0.08 + morphT * 0.07})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${btnR}, ${btnG}, ${btnB}, ${0.15 + morphT * 0.25})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // morphing icon: play triangle (t=0) ↔ pause bars (t=1)
        // play triangle vertices: left-center tip, top-right, bottom-right
        // pause: two vertical bars
        const cx = toggleBtn.x; const cy = toggleBtn.y;
        const s = 7; // icon half-size
        const t = morphT;

        // left shape: triangle left edge → left bar
        const lx0 = cx - s + t * (s * 0.15);           // top-left x
        const ly0 = cy - s + t * 0;                      // top-left y
        const lx1 = cx - s + t * (s * 0.15);           // bottom-left x
        const ly1 = cy + s - t * 0;                      // bottom-left y
        const lx2 = cx + s - t * (s * 0.7);             // right x (triangle tip → bar right edge)
        const ly2 = cy - s * t;                            // right top y (converges to center at t=0 for triangle tip)
        const lx3 = cx + s - t * (s * 0.7);             // right x bottom
        const ly3 = cy + s * t;                            // right bottom y (converges to center at t=0 for triangle tip)

        ctx.fillStyle = `rgba(${btnR}, ${btnG}, ${btnB}, ${0.3 + morphT * 0.3})`;

        // left shape / triangle
        ctx.beginPath();
        ctx.moveTo(lx0, ly0);
        ctx.lineTo(lx2, ly2);
        ctx.lineTo(lx3, ly3);
        ctx.lineTo(lx1, ly1);
        ctx.closePath();
        ctx.fill();

        // right bar (only visible when morphing toward pause, fades in)
        if (t > 0.01) {
          ctx.globalAlpha = t;
          const rx = cx + s * 0.4;
          ctx.beginPath();
          ctx.rect(rx - s * 0.15, cy - s, s * 0.3, s * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        ctx.restore();
      }

      // ── Mobile controls overlay ──
      if (isMobile && gameMode && ship.active && ship.hp > 0) {
        ctx.save();
        // joystick base
        if (joystick.active) {
          ctx.beginPath();
          ctx.arc(joystick.originX, joystick.originY, 40, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(240, 236, 230, 0.12)`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          // joystick thumb
          const jx = joystick.originX + joystick.dx;
          const jy = joystick.originY + joystick.dy;
          ctx.beginPath();
          ctx.arc(jx, jy, 14, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 107, 43, 0.25)`;
          ctx.fill();
          ctx.strokeStyle = `rgba(255, 107, 43, 0.4)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    const handleMouse = (e: MouseEvent) => { mouse = { x: e.clientX, y: e.clientY }; };

    // toggle button position (bottom-right)
    const toggleBtn = { x: 0, y: 0, r: 20 };
    const updateTogglePos = () => {
      toggleBtn.x = window.innerWidth - 36;
      toggleBtn.y = window.innerHeight - 36;
    };

    // check if touch hits the toggle button
    const hitsToggle = (tx: number, ty: number) => {
      const dx = tx - toggleBtn.x; const dy = ty - toggleBtn.y;
      return Math.sqrt(dx * dx + dy * dy) < toggleBtn.r + 10; // generous tap area
    };

    // touch handlers for virtual joystick + fire
    const handleTouchStart = (e: TouchEvent) => {
      // check toggle button first (always active)
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (hitsToggle(t.clientX, t.clientY)) {
          gameMode = !gameMode;
          // release any active touches when switching off
          if (!gameMode) {
            joystick.active = false; joystick.touchId = -1; joystick.dx = 0; joystick.dy = 0;
          }
          e.preventDefault();
          return;
        }
      }
      if (!gameMode) return; // let page scroll normally
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (!joystick.active) {
          joystick.active = true;
          joystick.touchId = t.identifier;
          joystick.originX = t.clientX;
          joystick.originY = t.clientY;
          joystick.dx = 0;
          joystick.dy = 0;
        }
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!gameMode) return;
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === joystick.touchId && joystick.active) {
          const rawDx = t.clientX - joystick.originX;
          const rawDy = t.clientY - joystick.originY;
          const dist = Math.sqrt(rawDx * rawDx + rawDy * rawDy);
          const maxR = 40;
          if (dist > maxR) {
            joystick.dx = (rawDx / dist) * maxR;
            joystick.dy = (rawDy / dist) * maxR;
          } else {
            joystick.dx = rawDx;
            joystick.dy = rawDy;
          }
        }
      }
    };
    const handleTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === joystick.touchId) {
          joystick.active = false;
          joystick.touchId = -1;
          joystick.dx = 0;
          joystick.dy = 0;
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "escape") {
        gameMode = !gameMode;
        return;
      }
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", " ", "r"].includes(key)) {
        keys[key] = true;
        // prevent page scroll for arrow keys and spacebar
        if (key.startsWith("arrow") || key === " ") e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        // check toggle button
        if (ship.active && hitsToggle(e.clientX, e.clientY)) {
          gameMode = !gameMode;
          if (!gameMode) {
            // release keys when pausing
            for (const k in keys) keys[k] = false;
          }
          return;
        }
        keys["mouse0"] = true;
      }
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) keys["mouse0"] = false;
    };

    window.addEventListener("resize", init);
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);
    init();
    draw();

    return () => {
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      cancelAnimationFrame(animId);
      delete document.documentElement.dataset.game;
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
