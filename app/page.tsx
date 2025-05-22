"use client";
import { useEffect, useRef, useState } from "react";

export default function HomePage() {
  // DOM refs
  const canvasDotsRef = useRef<HTMLCanvasElement>(null);
  const canvasBarsRef = useRef<HTMLCanvasElement>(null);
  const canvasMiddleRef = useRef<HTMLCanvasElement>(null);

  // State for dark mode
  const [isDark, setIsDark] = useState(false);

  // Animation & snow effect handled in useEffect
  useEffect(() => {
    // --- Variables
    const boxSize = 450;
    const canvasDots = canvasDotsRef.current!;
    const ctxDots = canvasDots.getContext("2d")!;
    const canvasBars = canvasBarsRef.current!;
    const ctxBars = canvasBars.getContext("2d")!;
    const canvasMiddle = canvasMiddleRef.current!;
    const ctxMiddle = canvasMiddle.getContext("2d")!;
    canvasDots.width = canvasBars.width = canvasMiddle.width = boxSize;
    canvasDots.height = canvasBars.height = canvasMiddle.height = boxSize;

    function noise(x: number, y: number) {
      return Math.sin(x * 0.01 + y * 0.01 + Date.now() * 0.0003);
    }
    const numDots = 3000, numBars = 600;
    const dots: any[] = [], bars: any[] = [];
    let midDots: any[] = [], midBars: any[] = [];
    let snowMode = false;
    const startPileTime = Date.now() + 3000;
    const heightMap = new Array(boxSize).fill(boxSize);
    const barHeightMap = new Array(boxSize).fill(boxSize);
    const maxMidDots = 500, maxMidBars = 160;

    for (let i = 0; i < numDots; i++) {
      const speed = 0.1 + Math.random() * 0.15;
      const offsetX = 5 * speed * 60;
      dots.push({
        x: Math.random() * boxSize + boxSize * 2 - offsetX,
        y: Math.random() * boxSize,
        speed,
        size: Math.random() * (1.8 - 1.08) + 1.08,
        phase: Math.random() * Math.PI * 2
      });
    }
    for (let i = 0; i < numBars; i++) {
      const baseSpeed = 0.15 + Math.random() * 0.2;
      const speed = baseSpeed * 0.7;
      const offsetX = 5 * speed * 60;
      bars.push({
        x: -Math.random() * boxSize + offsetX,
        y: Math.random() * boxSize,
        speed,
        width: Math.random() * (11.2 - 6.4) + 6.4,
        height: Math.random() * (2.0 - 1.2) + 1.2,
        offset: Math.random() * 1000,
        phase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2
      });
    }
    function createFallingDot(obj: any) {
      return {
        x: obj.x,
        y: obj.y,
        speed: obj.speed * 1.1,
        size: obj.size,
        phase: obj.phase,
        vx: 0,
        vy: 0.5 + obj.speed * 1.2,
        stuck: false
      };
    }
    function createFallingBar(obj: any) {
      return {
        x: obj.x,
        y: obj.y,
        width: obj.width,
        height: obj.height,
        speed: obj.speed * 1.1,
        phase: obj.phase,
        rotation: obj.rotation,
        vx: 0,
        vy: 0.5 + obj.speed * 1.2,
        stuck: false
      };
    }
    let isAnimating = true;
    let animFrameId: number;
    function animate(t: number) {
      if (!isAnimating) return;
      ctxDots.clearRect(0, 0, boxSize, boxSize);
      ctxBars.clearRect(0, 0, boxSize, boxSize);
      ctxMiddle.clearRect(0, 0, boxSize, boxSize);
      ctxDots.fillStyle = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";
      ctxBars.fillStyle = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)";
      ctxMiddle.fillStyle = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";

      for (let p of dots) {
        const n = noise(p.x * 0.2, p.y * 0.2);
        const wave = Math.sin(t * 0.001 + p.phase + n * 2);
        p.x -= (p.speed * 2) + wave * 0.8;
        p.y += wave * 1.2;
        if (p.x >= 0 && p.x <= boxSize) {
          ctxDots.beginPath();
          ctxDots.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
          ctxDots.fill();
        }
        if (Date.now() > startPileTime && p.x >= -boxSize && p.x < 0 && midDots.length < maxMidDots) {
          midDots.push(createFallingDot({
            x: p.x + boxSize,
            y: p.y,
            speed: p.speed,
            size: p.size,
            phase: p.phase
          }));
        }
        if (p.x < -boxSize - 20 || p.y < -20 || p.y > boxSize + 20) {
          const speed = 0.1 + Math.random() * 0.15;
          const offsetX = 5 * speed * 60;
          p.x = boxSize + Math.random() * boxSize - offsetX;
          p.y = Math.random() * boxSize;
          p.speed = speed;
          p.phase = Math.random() * Math.PI * 2;
        }
      }
      for (let b of bars) {
        const n = noise(b.x * 0.2, b.y * 0.2);
        const wave = Math.sin(t * 0.001 + b.phase + n * 2);
        b.x += (b.speed * 2) + wave * 0.8;
        b.y += wave * 1.2;
        if (b.x >= 0 && b.x <= boxSize) {
          ctxBars.save();
          ctxBars.translate(b.x + b.width / 2, b.y + b.height / 2);
          ctxBars.rotate((t * 0.001 + b.rotation) % (Math.PI * 2));
          ctxBars.fillRect(-b.width / 2, -b.height / 2, b.width, b.height);
          ctxBars.restore();
        }
        if (Date.now() > startPileTime && b.x > boxSize && b.x < boxSize * 2 && midBars.length < maxMidBars) {
          midBars.push(createFallingBar({
            x: b.x - boxSize,
            y: b.y,
            width: b.width,
            height: b.height,
            speed: b.speed,
            phase: b.phase,
            rotation: b.rotation
          }));
        }
        if (b.x > boxSize * 2 + 20 || b.y < -20 || b.y > boxSize + 20) {
          const baseSpeed = 0.15 + Math.random() * 0.2;
          const speed = baseSpeed * 0.7;
          const offsetX = 5 * speed * 60;
          b.x = -Math.random() * boxSize + offsetX;
          b.y = Math.random() * boxSize;
          b.speed = speed;
          b.phase = Math.random() * Math.PI * 2;
          b.rotation = Math.random() * Math.PI * 2;
        }
      }

      if (Date.now() > startPileTime) snowMode = true;
      if (snowMode) {
        for (let p of midDots) {
          if (!p.stuck) {
            p.vy = Math.min(p.vy + 0.08, 2.8);
            let newY = p.y + p.vy;
            let px = Math.round(p.x);
            px = Math.max(0, Math.min(boxSize - 1, px));
            if (newY + p.size >= heightMap[px]) {
              newY = heightMap[px] - p.size;
              p.stuck = true;
              let spread = Math.floor(p.size) + 1;
              for (let s = -spread; s <= spread; s++) {
                let idx = Math.max(0, Math.min(boxSize - 1, px + s));
                if (heightMap[idx] > newY + p.size)
                  heightMap[idx] = newY + p.size;
              }
            }
            p.y = newY;
          }
          ctxMiddle.beginPath();
          ctxMiddle.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
          ctxMiddle.fill();
        }
        for (let b of midBars) {
          if (!b.stuck) {
            b.vy = Math.min(b.vy + 0.08, 2.2);
            let newY = b.y + b.vy;
            let left = Math.round(b.x);
            let right = Math.round(b.x + b.width);
            left = Math.max(0, Math.min(boxSize - 1, left));
            right = Math.max(left, Math.min(boxSize - 1, right));
            let minPile = boxSize;
            for (let i = left; i <= right; i++) {
              minPile = Math.min(minPile, barHeightMap[i]);
            }
            if (newY + b.height >= minPile) {
              newY = minPile - b.height;
              b.stuck = true;
              for (let i = left; i <= right; i++) {
                if (barHeightMap[i] > newY + b.height)
                  barHeightMap[i] = newY + b.height;
              }
            }
            b.y = newY;
          }
          ctxMiddle.save();
          ctxMiddle.translate(b.x + b.width / 2, b.y + b.height / 2);
          ctxMiddle.rotate(b.rotation);
          ctxMiddle.fillRect(-b.width / 2, -b.height / 2, b.width, b.height);
          ctxMiddle.restore();
        }
        ctxMiddle.save();
        ctxMiddle.globalAlpha = 0.7;
        ctxMiddle.fillStyle = isDark ? "#333" : "#fff";
        ctxMiddle.beginPath();
        for (let x = 0; x < boxSize; x++) ctxMiddle.lineTo(x, heightMap[x]);
        ctxMiddle.lineTo(boxSize, boxSize);
        ctxMiddle.lineTo(0, boxSize);
        ctxMiddle.closePath();
        ctxMiddle.fill();
        ctxMiddle.globalAlpha = 0.28;
        ctxMiddle.fillStyle = "#c7c7c7";
        ctxMiddle.beginPath();
        for (let x = 0; x < boxSize; x++) ctxMiddle.lineTo(x, barHeightMap[x]);
        ctxMiddle.lineTo(boxSize, boxSize);
        ctxMiddle.lineTo(0, boxSize);
        ctxMiddle.closePath();
        ctxMiddle.fill();
        ctxMiddle.restore();
      } else {
        for (let p of midDots) {
          ctxMiddle.beginPath();
          ctxMiddle.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
          ctxMiddle.fill();
        }
        for (let b of midBars) {
          ctxMiddle.save();
          ctxMiddle.translate(b.x + b.width / 2, b.y + b.height / 2);
          ctxMiddle.rotate(b.rotation);
          ctxMiddle.fillRect(-b.width / 2, -b.height / 2, b.width, b.height);
          ctxMiddle.restore();
        }
      }
      animFrameId = requestAnimationFrame(animate);
    }
    animFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameId);
  }, [isDark]);

  // ---- AGENT MENU (unchanged logic from previous posts) ----
  // ... (Omitted for brevity. You would convert the menu and agent-panel rendering to React with useState/useEffect.)

  return (
    <>
      <img src="/GB3.png" alt="Golden Box Logo" style={{
        position: 'absolute', top: 15, left: 15, height: 60, zIndex: 10, objectFit: "contain"
      }} />
      <div style={{
        position: 'absolute', top: 80, left: 15, width: "3cm", height: 2, background: isDark ? "#eee" : "#000", zIndex: 9
      }}></div>
      <div style={{
        position: 'absolute', top: 90, left: 15, fontFamily: 'Helvetica Neue,Roboto,sans-serif', fontWeight: 300, fontSize: 22, color: isDark ? "#eee" : "#000", zIndex: 10
      }}>Golden Box</div>
      {/* (You would convert agent menu and agent panel here as components) */}
      <div style={{ position: 'absolute', left: 'calc(50% - 705px)', width: 1410, top: 80, bottom: 'calc(3cm + 480px)', border: `1px dotted ${isDark ? "#888" : "#000"}`, background: "transparent", zIndex: 1 }}>
        {/* AGENT PANEL CONTENT HERE */}
      </div>
      <button style={{
        position: 'absolute', left: 'calc(50% - 705px - 80px)', bottom: 'calc(3cm + 450px - 75px)', width: 75, height: 75, background: "transparent", border: "none", cursor: "pointer", zIndex: 20, fontSize: 75, color: isDark ? "#eee" : "#000", lineHeight: 1, padding: 0
      }} onClick={() => window.location.reload()}>⏸</button>
      <img src={isDark ? "/dark2.jpg" : "/light.jpg"} alt="Toggle Theme" style={{
        position: 'absolute', left: 'calc(50% - 705px - 80px)', bottom: 'calc(3cm + 450px - 75px - 90px)', width: 75, height: 75, transform: 'rotate(-90deg)', cursor: "pointer", zIndex: 20, objectFit: "contain"
      }} onClick={() => setIsDark(v => !v)} />
      <div style={{ position: "absolute", left: 'calc(50% - 705px)', bottom: '3cm', width: 450, height: 450 }}>
        <canvas ref={canvasBarsRef} width={450} height={450} />
      </div>
      <div style={{ position: "absolute", left: 'calc(50% - 225px)', bottom: '3cm', width: 450, height: 450 }}>
        <canvas ref={canvasMiddleRef} width={450} height={450} />
      </div>
      <div style={{ position: "absolute", left: 'calc(50% + 255px)', bottom: '3cm', width: 450, height: 450 }}>
        <canvas ref={canvasDotsRef} width={450} height={450} />
      </div>
      <div style={{
        position: 'absolute', bottom: 'calc(3cm - 30px)', left: 'calc(50% + 255px)', width: 450, textAlign: "center",
        fontFamily: 'Helvetica Neue,Roboto,sans-serif', fontSize: 14, fontWeight: 300, zIndex: 5, color: isDark ? "#eee" : "#000"
      }}>
        <span style={{ color: "goldenrod", fontWeight: "bold" }}>The one and only </span>
        <span style={{ fontWeight: "bold" }}>Golden.Box</span>
        <span> in the world </span>
        <span style={{ fontWeight: "bold" }}>forever.</span>
      </div>
      <div style={{
        position: 'absolute', bottom: 'calc(3cm - 30px)', left: 'calc(50% - 705px)', fontFamily: 'Helvetica Neue,Roboto,sans-serif', fontSize: 14, zIndex: 5, color: isDark ? "#eee" : "#000"
      }}>
        <a href="#" style={{ color: isDark ? "#eee" : "#000", textDecoration: "none", marginRight: 20 }}>Info</a>
        <a href="#" style={{ color: isDark ? "#eee" : "#000", textDecoration: "none" }}>Contact</a>
      </div>
    </>
  );
}
