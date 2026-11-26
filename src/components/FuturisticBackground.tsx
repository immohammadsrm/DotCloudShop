"use client";

import { useEffect, useRef } from "react";

/**
 * Site-wide futuristic background (fixed, behind all content):
 *  - a particle "network" that drifts, links up, and reacts to the mouse (pushes away + connects to it)
 *  - rotating 3D wireframe shapes (icosahedron, cube, octahedron, orbit rings) that tilt and
 *    shift with the mouse at different depths, and drift with scrolling
 *  - a tech grid that lights up around the mouse
 * Without a mouse (touch) it animates on its own; with "reduce motion" it draws one still frame.
 */

type V3 = [number, number, number];
type Mesh = { v: V3[]; e: Array<[number, number]> };

const PHI = (1 + Math.sqrt(5)) / 2;

function edgesByLength(v: V3[], len: number): Array<[number, number]> {
  const e: Array<[number, number]> = [];
  for (let i = 0; i < v.length; i++)
    for (let j = i + 1; j < v.length; j++) {
      const d = Math.hypot(v[i][0] - v[j][0], v[i][1] - v[j][1], v[i][2] - v[j][2]);
      if (Math.abs(d - len) < 0.01) e.push([i, j]);
    }
  return e;
}

const ICO_V: V3[] = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
].map(([x, y, z]) => [x / PHI, y / PHI, z / PHI] as V3);
const CUBE_V: V3[] = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x * 0.75, y * 0.75, z * 0.75] as V3)));
const OCTA_V: V3[] = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];

const MESHES: Record<string, Mesh> = {
  ico: { v: ICO_V, e: edgesByLength(ICO_V, 2 / PHI) },
  cube: { v: CUBE_V, e: edgesByLength(CUBE_V, 1.5) },
  octa: { v: OCTA_V, e: edgesByLength(OCTA_V, Math.SQRT2) },
};

type Shape = { kind: "ico" | "cube" | "octa" | "rings"; x: number; y: number; s: number; depth: number; spin: number; phase: number };

const SHAPES: Shape[] = [
  { kind: "ico", x: 0.88, y: 0.24, s: 78, depth: 1, spin: 0.25, phase: 0 },
  { kind: "cube", x: 0.08, y: 0.68, s: 46, depth: 0.7, spin: 0.32, phase: 1.3 },
  { kind: "octa", x: 0.7, y: 0.84, s: 40, depth: 0.5, spin: 0.4, phase: 2.1 },
  { kind: "ico", x: 0.2, y: 0.16, s: 26, depth: 0.35, spin: 0.5, phase: 0.7 },
  { kind: "rings", x: 0.93, y: 0.7, s: 120, depth: 0.25, spin: 0.15, phase: 0 },
  { kind: "rings", x: 0.04, y: 0.2, s: 80, depth: 0.45, spin: -0.2, phase: 1 },
];

type P = { x: number; y: number; vx: number; vy: number; bx: number; by: number; r: number; z: number };

export default function FuturisticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let W = 0, H = 0, dpr = 1;
    let pts: P[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 }; // eased mouse position, -1..1
    const grid = { x: -9999, y: -9999 };
    let raf = 0;
    let t = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(95, Math.round((W * H) / 19000));
      pts = Array.from({ length: n }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.08 + Math.random() * 0.22;
        return { x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, bx: Math.cos(a) * sp, by: Math.sin(a) * sp, r: 0.6 + Math.random() * 1.4, z: 0.3 + Math.random() * 0.7 };
      });
    };

    const drawMesh = (m: Mesh, cx: number, cy: number, s: number, rx: number, ry: number, alpha: number) => {
      const cX = Math.cos(rx), sX = Math.sin(rx), cY = Math.cos(ry), sY = Math.sin(ry);
      const proj = m.v.map(([x, y, z]) => {
        const y1 = y * cX - z * sX;
        const z1 = y * sX + z * cX;
        const x2 = x * cY + z1 * sY;
        const z2 = -x * sY + z1 * cY;
        const f = 3.2 / (3.2 + z2);
        return [cx + x2 * s * f, cy + y1 * s * f, z2] as V3;
      });
      ctx.lineWidth = 1;
      for (const [a, b] of m.e) {
        const depthFade = 0.55 + 0.45 * (1 - (proj[a][2] + proj[b][2] + 2) / 4);
        ctx.strokeStyle = `rgba(251,146,60,${(alpha * depthFade).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(proj[a][0], proj[a][1]);
        ctx.lineTo(proj[b][0], proj[b][1]);
        ctx.stroke();
      }
      ctx.fillStyle = `rgba(253,186,116,${(alpha * 1.6).toFixed(3)})`;
      for (const p of proj) {
        ctx.beginPath();
        ctx.arc(p[0], p[1], 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawRings = (cx: number, cy: number, s: number, rot: number, tiltX: number, alpha: number) => {
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const r = s * (0.55 + i * 0.25);
        const squash = 0.32 + 0.12 * i + tiltX * 0.15;
        ctx.strokeStyle = `rgba(251,146,60,${(alpha * (1 - i * 0.25)).toFixed(3)})`;
        ctx.setLineDash(i === 1 ? [4, 7] : []);
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, Math.max(4, r * Math.abs(squash)), rot + i * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        // satellite travelling along the ring
        const a = t * (0.6 + i * 0.3) * (i % 2 ? -1 : 1) + i;
        const ex = Math.cos(a) * r, ey = Math.sin(a) * r * Math.abs(squash);
        const ang = rot + i * 0.5;
        const px = cx + ex * Math.cos(ang) - ey * Math.sin(ang);
        const py = cy + ex * Math.sin(ang) + ey * Math.cos(ang);
        ctx.fillStyle = `rgba(253,186,116,${(alpha * 3).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.setLineDash([]);
    };

    const frame = () => {
      t += 0.016;
      tilt.x += (tilt.tx - tilt.x) * 0.05;
      tilt.y += (tilt.ty - tilt.y) * 0.05;
      if (!mouse.active) {
        // no mouse: slow automatic sway
        tilt.tx = Math.sin(t * 0.3) * 0.5;
        tilt.ty = Math.cos(t * 0.23) * 0.4;
      }
      const scrollY = window.scrollY;

      ctx.clearRect(0, 0, W, H);

      // Wireframe shapes (behind the particle network)
      for (const sh of SHAPES) {
        const span = H + sh.s * 4;
        let cy = sh.y * H + tilt.y * 50 * sh.depth - scrollY * 0.12 * sh.depth;
        cy = ((((cy + sh.s * 2) % span) + span) % span) - sh.s * 2;
        const cx = sh.x * W + tilt.x * 60 * sh.depth;
        const alpha = 0.1 + sh.depth * 0.12;
        if (sh.kind === "rings") {
          drawRings(cx, cy, sh.s, t * sh.spin + tilt.x * 0.4, tilt.y, alpha * 0.8);
        } else {
          const ry = t * sh.spin + sh.phase + tilt.x * 1.1 * sh.depth;
          const rx = t * sh.spin * 0.7 + sh.phase - tilt.y * 1.1 * sh.depth;
          drawMesh(MESHES[sh.kind], cx, cy, sh.s, rx, ry, alpha);
        }
      }

      // Particle network
      const R = 170;
      for (const p of pts) {
        if (mouse.active) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < R && d > 0.1) {
            const f = ((R - d) / R) * 0.6;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.bx + p.vx + tilt.x * 0.15 * p.z;
        p.y += p.by + p.vy;
        if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
      }
      const L = 130;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          if (Math.abs(dx) > L || Math.abs(dy) > L) continue;
          const d = Math.hypot(dx, dy);
          if (d < L) {
            ctx.strokeStyle = `rgba(249,115,22,${((1 - d / L) * 0.16).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      if (mouse.active) {
        const ML = 210;
        ctx.lineWidth = 1;
        for (const p of pts) {
          const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (d < ML) {
            ctx.strokeStyle = `rgba(253,186,116,${((1 - d / ML) * 0.45).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = `rgba(253,186,116,${(0.25 + p.z * 0.45).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Grid spotlight follows the mouse with a soft lag
      if (gridRef.current && mouse.active) {
        grid.x += (mouse.x - grid.x) * 0.12;
        grid.y += (mouse.y - grid.y) * 0.12;
        gridRef.current.style.setProperty("--mx", `${grid.x.toFixed(1)}px`);
        gridRef.current.style.setProperty("--my", `${grid.y.toFixed(1)}px`);
      }

      if (!reduce) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!mouse.active) {
        grid.x = e.clientX;
        grid.y = e.clientY;
        gridRef.current?.classList.add("is-on");
      }
      mouse.active = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      tilt.tx = (e.clientX / W) * 2 - 1;
      tilt.ty = (e.clientY / H) * 2 - 1;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = mouse.y = -9999;
      gridRef.current?.classList.remove("is-on");
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    if (fine && !reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
      window.addEventListener("blur", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fx-bg">
      <div ref={gridRef} className="fx-grid" />
      <canvas ref={canvasRef} className="fx-canvas" />
      <div className="fx-vignette" />
    </div>
  );
}
