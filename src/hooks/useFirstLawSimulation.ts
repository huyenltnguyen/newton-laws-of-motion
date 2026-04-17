import { useRef, useEffect } from 'react';

interface UseFirstLawSimulationOptions {
  initialVelocity: number;
  friction: number;
  isPlaying: boolean;
}

interface UseFirstLawSimulationReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const PIXEL_SCALE = 20; // px/s per m/s of real velocity
const BLOCK_W = 48;
const BLOCK_H = 48;

export function useFirstLawSimulation({
  initialVelocity,
  friction,
  isPlaying,
}: UseFirstLawSimulationOptions): UseFirstLawSimulationReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mutable refs so the draw loop always has the latest values
  const initialVelocityRef = useRef(initialVelocity);
  const frictionRef = useRef(friction);
  initialVelocityRef.current = initialVelocity;
  frictionRef.current = friction;

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // Flag to reset block when sliders change
  const shouldResetRef = useRef(false);

  useEffect(() => {
    shouldResetRef.current = true;
  }, [initialVelocity, friction]);

  // Simulation state as refs (no re-renders needed)
  const positionRef = useRef(-BLOCK_W);
  const velocityRef = useRef(0); // px/s
  const lastTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number>(0);
  const pauseTimerRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resetBlock() {
      positionRef.current = -BLOCK_W;
      velocityRef.current = initialVelocityRef.current * PIXEL_SCALE;
      isPausedRef.current = false;
      if (pauseTimerRef.current !== null) {
        clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = null;
      }
    }

    function draw(timestamp: number) {
      if (!canvas || !ctx) return;

      // Reset block when sliders change
      if (shouldResetRef.current) {
        shouldResetRef.current = false;
        resetBlock();
        lastTimeRef.current = null;
      }

      const dt =
        lastTimeRef.current === null ? 0 : Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      const dpr = window.devicePixelRatio || 1;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const TRACK_Y = H / 2;

      const currentFriction = frictionRef.current;
      const pixelDecel = currentFriction * 10 * PIXEL_SCALE; // friction * g * scale in px/s²

      // ── Physics step ──────────────────────────────────────────────
      if (isPlayingRef.current && !isPausedRef.current) {
        velocityRef.current -= pixelDecel * dt;
        if (velocityRef.current < 0) velocityRef.current = 0;

        positionRef.current += velocityRef.current * dt;

        // Wrap when block fully exits the right edge
        if (positionRef.current > W) {
          positionRef.current = -BLOCK_W;
          velocityRef.current = initialVelocityRef.current * PIXEL_SCALE;
        }

        // When velocity reaches 0, pause then reset
        if (velocityRef.current === 0 && dt > 0 && pauseTimerRef.current === null) {
          isPausedRef.current = true;
          pauseTimerRef.current = window.setTimeout(() => {
            pauseTimerRef.current = null;
            if (isPlayingRef.current) {
              resetBlock();
              lastTimeRef.current = null;
            }
          }, 1500);
        }
      }

      // ── Drawing ─────────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);

      // Surface line
      ctx.fillStyle = '#3b3b4f';
      ctx.fillRect(0, TRACK_Y + BLOCK_H / 2, W, 2);

      // Ground tick marks
      ctx.fillStyle = '#2a2a40';
      const dashSpacing = 60;
      const dashW = 20;
      const dashH = 4;
      for (let x = 0; x < W; x += dashSpacing) {
        ctx.fillRect(x, TRACK_Y + BLOCK_H / 2 + 2, dashW, dashH);
      }

      const blockX = positionRef.current;
      const blockY = TRACK_Y - BLOCK_H / 2;

      // Block shadow
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(blockX + 4, blockY + BLOCK_H + 2, BLOCK_W, 5);

      // Main block
      ctx.fillStyle = '#2a2a40';
      ctx.strokeStyle = '#858591';
      ctx.lineWidth = 1.5;
      ctx.fillRect(blockX, blockY, BLOCK_W, BLOCK_H);
      ctx.strokeRect(blockX, blockY, BLOCK_W, BLOCK_H);

      const blockVisible = blockX + BLOCK_W > 0 && blockX < W;
      const currentVelocity = velocityRef.current;

      // ── Friction arrow (points LEFT, only when friction > 0 AND moving) ──
      if (currentFriction > 0 && currentVelocity > 2 && blockVisible) {
        const arrowY = TRACK_Y;
        const arrowLength = (currentFriction / 0.8) * 60 + 10;
        const arrowTipX = blockX; // tip at left face of block
        const arrowBaseX = arrowTipX - arrowLength;

        // Shaft
        ctx.beginPath();
        ctx.strokeStyle = '#ffadad';
        ctx.lineWidth = 2.5;
        ctx.moveTo(arrowBaseX + 10, arrowY);
        ctx.lineTo(arrowTipX, arrowY);
        ctx.stroke();

        // Arrowhead (pointing left)
        ctx.beginPath();
        ctx.fillStyle = '#ffadad';
        ctx.moveTo(arrowBaseX, arrowY);
        ctx.lineTo(arrowBaseX + 10, arrowY - 5);
        ctx.lineTo(arrowBaseX + 10, arrowY + 5);
        ctx.closePath();
        ctx.fill();

        // 'F_f' label above arrow midpoint — 16px minimum (see comment)
        ctx.fillStyle = '#ffadad';
        ctx.font = 'bold 16px "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        const labelX = arrowBaseX + arrowLength / 2;
        ctx.fillText('Fꜰ', labelX, arrowY - 6);
      }

      // ── Velocity arrow (green, points RIGHT, only when friction=0 AND moving) ──
      if (currentFriction === 0 && currentVelocity > 0 && blockVisible) {
        const arrowY = TRACK_Y;
        const arrowStartX = blockX + BLOCK_W;
        const arrowLen = 30;
        const arrowEndX = arrowStartX + arrowLen;

        // Shaft
        ctx.beginPath();
        ctx.strokeStyle = '#acd157';
        ctx.lineWidth = 2.5;
        ctx.moveTo(arrowStartX, arrowY);
        ctx.lineTo(arrowEndX - 8, arrowY);
        ctx.stroke();

        // Arrowhead
        ctx.beginPath();
        ctx.fillStyle = '#acd157';
        ctx.moveTo(arrowEndX, arrowY);
        ctx.lineTo(arrowEndX - 10, arrowY - 5);
        ctx.lineTo(arrowEndX - 10, arrowY + 5);
        ctx.closePath();
        ctx.fill();

        // 'v' label
        ctx.fillStyle = '#acd157';
        ctx.font = 'bold 18px "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText('v', arrowStartX + arrowLen / 2, arrowY - 4);
      }

      animFrameRef.current = requestAnimationFrame(draw);
    }

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      if (pauseTimerRef.current !== null) {
        clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = null;
      }
    };
  }, []); // Empty deps — loop runs once, reads latest values from refs

  return { canvasRef };
}
