import React, { useEffect, useRef } from "react";

interface AnimatedCanvasProps {
  theme?: "gateway" | "arvea" | "dxn";
  className?: string;
}

export const AnimatedCanvas: React.FC<AnimatedCanvasProps> = ({ theme = "gateway", className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle color palettes
    const palettes = {
      gateway: [
        "rgba(204, 166, 85, 0.4)",  // Gold
        "rgba(50, 74, 53, 0.35)",   // Forest
        "rgba(247, 243, 235, 0.2)",  // Cream
        "rgba(230, 195, 120, 0.3)", // Soft Gold
      ],
      arvea: [
        "rgba(52, 211, 153, 0.35)", // Emerald
        "rgba(204, 166, 85, 0.4)",  // Gold
        "rgba(16, 185, 129, 0.25)", // Green
        "rgba(236, 253, 245, 0.2)",  // Pale Mint
      ],
      dxn: [
        "rgba(245, 158, 11, 0.4)",  // Amber
        "rgba(217, 119, 6, 0.35)",  // Deep Amber
        "rgba(180, 83, 9, 0.3)",    // Coffee Red-Brown
        "rgba(251, 191, 36, 0.35)", // Gold
      ],
    };

    const currentPalette = palettes[theme];

    // Create particles
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 4 + 1.5,
      color: currentPalette[Math.floor(Math.random() * currentPalette.length)],
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      alpha: Math.random() * 0.7 + 0.3,
      alphaSpeed: Math.random() * 0.01 + 0.005,
    }));

    // Wave parameters
    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle animated glowing fluid wave at the bottom
      step += 0.008;
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 20) {
        const y = Math.sin(x * 0.003 + step) * 25 + Math.cos(x * 0.002 + step * 1.2) * 15 + height - 120;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();

      const waveGradient = ctx.createLinearGradient(0, height - 150, 0, height);
      if (theme === "arvea") {
        waveGradient.addColorStop(0, "rgba(16, 185, 129, 0.08)");
        waveGradient.addColorStop(1, "rgba(6, 78, 59, 0.25)");
      } else if (theme === "dxn") {
        waveGradient.addColorStop(0, "rgba(245, 158, 11, 0.08)");
        waveGradient.addColorStop(1, "rgba(120, 53, 15, 0.3)");
      } else {
        waveGradient.addColorStop(0, "rgba(204, 166, 85, 0.08)");
        waveGradient.addColorStop(1, "rgba(26, 36, 25, 0.3)");
      }
      ctx.fillStyle = waveGradient;
      ctx.fill();

      // Render floating particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Pulse alpha
        p.alpha += p.alphaSpeed;
        if (p.alpha > 0.8 || p.alpha < 0.2) p.alphaSpeed *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 z-1 ${className}`} />;
};
