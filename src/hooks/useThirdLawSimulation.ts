import { useRef, useEffect } from 'react';

interface UseThirdLawSimulationOptions {
  force: number;
  isPlaying: boolean; // kept for interface compatibility but not used
}

const BLOCK_W = 64;
const BLOCK_H = 64;
const FORCE_MAX = 50;

export function useThirdLawSimulation({ force }: UseThirdLawSimulationOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const forceRef = useRef(force);
  forceRef.current = force;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;

    function draw() {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const trackY = H / 2;
      const currentForce = forceRef.current;

      ctx.clearRect(0, 0, W, H);

      // Surface
      ctx.fillStyle = '#3b3b4f';
      ctx.fillRect(0, trackY + BLOCK_H / 2, W, 2);
      ctx.fillStyle = '#858591';
      for (let x = 0; x < W; x += 60) {
        ctx.fillRect(x, trackY + BLOCK_H / 2 + 2, 20, 4);
      }

      // Block positions — touching at center
      const centerX = W / 2;
      const blockAX = centerX - BLOCK_W; // A's right face touches center
      const blockBX = centerX; // B's left face touches center
      const blockY = trackY - BLOCK_H / 2;

      // Arrow length
      const arrowLen = (currentForce / FORCE_MAX) * 80 + 20;

      // Ground shadows
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(blockAX + 4, blockY + BLOCK_H + 2, BLOCK_W, 5);
      ctx.fillRect(blockBX + 4, blockY + BLOCK_H + 2, BLOCK_W, 5);

      // Block A
      ctx.fillStyle = '#2a2a40';
      ctx.strokeStyle = '#858591';
      ctx.lineWidth = 1.5;
      ctx.fillRect(blockAX, blockY, BLOCK_W, BLOCK_H);
      ctx.strokeRect(blockAX, blockY, BLOCK_W, BLOCK_H);
      ctx.fillStyle = '#dbb8ff';
      ctx.font = 'bold 18px "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('A', blockAX + BLOCK_W / 2, blockY + BLOCK_H / 2);

      // Block B
      ctx.fillStyle = '#2a2a40';
      ctx.strokeStyle = '#858591';
      ctx.lineWidth = 1.5;
      ctx.fillRect(blockBX, blockY, BLOCK_W, BLOCK_H);
      ctx.strokeRect(blockBX, blockY, BLOCK_W, BLOCK_H);
      ctx.fillStyle = '#99c9ff';
      ctx.font = 'bold 18px "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('B', blockBX + BLOCK_W / 2, blockY + BLOCK_H / 2);

      // Contact indicator — small vertical line at center seam
      ctx.strokeStyle = '#858591';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, blockY - 8);
      ctx.lineTo(centerX, blockY + BLOCK_H + 8);
      ctx.stroke();

      // Arrow on A — points LEFT
      const arrowAEndX = blockAX - arrowLen;
      ctx.beginPath();
      ctx.strokeStyle = '#dbb8ff';
      ctx.lineWidth = 2.5;
      ctx.moveTo(blockAX, trackY);
      ctx.lineTo(arrowAEndX + 10, trackY);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = '#dbb8ff';
      ctx.moveTo(arrowAEndX, trackY);
      ctx.lineTo(arrowAEndX + 10, trackY - 6);
      ctx.lineTo(arrowAEndX + 10, trackY + 6);
      ctx.closePath();
      ctx.fill();

      // Arrow label A — variable name only
      ctx.fillStyle = '#dbb8ff';
      ctx.font = 'bold 14px "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('F', blockAX - arrowLen / 2, trackY - 8);

      // Arrow on B — points RIGHT
      const arrowBEndX = blockBX + BLOCK_W + arrowLen;
      ctx.beginPath();
      ctx.strokeStyle = '#99c9ff';
      ctx.lineWidth = 2.5;
      ctx.moveTo(blockBX + BLOCK_W, trackY);
      ctx.lineTo(arrowBEndX - 10, trackY);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = '#99c9ff';
      ctx.moveTo(arrowBEndX, trackY);
      ctx.lineTo(arrowBEndX - 10, trackY - 6);
      ctx.lineTo(arrowBEndX - 10, trackY + 6);
      ctx.closePath();
      ctx.fill();

      // Arrow label B — variable name only
      ctx.fillStyle = '#99c9ff';
      ctx.font = 'bold 14px "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('F', blockBX + BLOCK_W + arrowLen / 2, trackY - 8);

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);

  return { canvasRef };
}
