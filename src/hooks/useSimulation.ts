import { useRef, useEffect } from 'react';

interface UseSimulationOptions {
  acceleration: number;
  force: number;
  isPlaying: boolean;
}

interface UseSimulationReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function useSimulation({
  acceleration,
  force,
  isPlaying,
}: UseSimulationOptions): UseSimulationReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mutable refs so the draw loop always has the latest values
  // without needing to restart the RAF when they change
  const accelerationRef = useRef(acceleration);
  const forceRef = useRef(force);
  accelerationRef.current = acceleration;
  forceRef.current = force;

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // Flag to reset block when sliders change — checked inside the RAF loop
  const shouldResetRef = useRef(false);

  useEffect(() => {
    shouldResetRef.current = true;
  }, [acceleration, force]);

  // Simulation state as refs (not state — no re-renders needed)
  const positionRef = useRef(-48); // block x in px; start off-screen left
  const velocityRef = useRef(0); // px/s
  const lastTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── Physics constants ──────────────────────────────────────────────
    // Physical acceleration spans 0.05 m/s² (F=1,m=20) to 50 m/s² (F=50,m=1),
    // a 1 000× range.  A power-curve compresses this to a ~100× pixel-space
    // range so both extremes are clearly distinguishable.
    // Integration is purely: dv = a_px · dt,  dx = v · dt.
    // No drag, no target-speed, no adaptive damping.
    const ACCEL_POWER = 0.75; // less compression → better high-end separation
    const ACCEL_SCALE = 35; // px/s² per unit of compressed accel

    const BLOCK_W = 48;
    const BLOCK_H = 48;

    function resetBlock() {
      positionRef.current = -BLOCK_W;
      velocityRef.current = 0;
    }

    function draw(timestamp: number) {
      if (!canvas || !ctx) return;

      // Reset block when sliders change (flag set by useEffect above)
      if (shouldResetRef.current) {
        shouldResetRef.current = false;
        resetBlock();
      }

      const dt =
        lastTimeRef.current === null ? 0 : Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      const dpr = window.devicePixelRatio || 1;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const TRACK_Y = H / 2;

      const accel = accelerationRef.current;
      const currentForce = forceRef.current;

      // ── Physics step (pure acceleration integration) ───────────────
      if (isPlayingRef.current) {
        // 1) Map physical acceleration to pixel-space acceleration.
        const pixelAccel = Math.pow(Math.max(accel, 0), ACCEL_POWER) * ACCEL_SCALE;

        // 2) Integrate velocity from acceleration (Euler).
        velocityRef.current += pixelAccel * dt;

        // 3) Integrate position from velocity.
        positionRef.current += velocityRef.current * dt;

        // Wrap when block fully exits the right edge.
        if (positionRef.current > W) {
          resetBlock();
        }
      }

      // ── Drawing ────────────────────────────────────────────────────
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

      // Ghost trails (behind the block)
      const ghostCount = Math.min(3, Math.floor(accel / 5));
      if (accel > 0 && ghostCount > 0) {
        const trailSpacing = Math.max(8, velocityRef.current * 0.05);
        for (let i = ghostCount; i >= 1; i--) {
          const ghostX = blockX - i * trailSpacing;
          const alpha = (1 - i / (ghostCount + 1)) * 0.18;
          ctx.fillStyle = `rgba(42, 42, 64, ${alpha})`;
          ctx.strokeStyle = `rgba(133, 133, 145, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.fillRect(ghostX, blockY, BLOCK_W, BLOCK_H);
          ctx.strokeRect(ghostX, blockY, BLOCK_W, BLOCK_H);
        }
      }

      // Block shadow
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(blockX + 4, blockY + BLOCK_H + 2, BLOCK_W, 5);

      // Main block
      ctx.fillStyle = '#2a2a40';
      ctx.strokeStyle = '#858591';
      ctx.lineWidth = 1.5;
      ctx.fillRect(blockX, blockY, BLOCK_W, BLOCK_H);
      ctx.strokeRect(blockX, blockY, BLOCK_W, BLOCK_H);

      // Block label — minimum 18px (fCC accessibility baseline)
      ctx.fillStyle = '#dbb8ff';
      ctx.font = 'bold 18px "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('m', blockX + BLOCK_W / 2, blockY + BLOCK_H / 2);

      // ── Force arrow — starts at right face of block, extends rightward ──
      const MIN_ARROW_LEN = 14;
      const rawArrowLen = (currentForce / 50) * 80;
      const arrowLength = currentForce > 0 ? Math.max(MIN_ARROW_LEN, rawArrowLen) : 0;

      const blockVisible = blockX + BLOCK_W > 0 && blockX < W;
      const arrowStartX = blockX + BLOCK_W;

      // Draw arrow only while the block's right face is still on canvas.
      // The arrow travels with the block and exits naturally off the right
      // edge — canvas clips anything beyond W, so no clamping is needed.
      if (arrowLength > 0 && blockVisible && arrowStartX < W) {
        const arrowY = TRACK_Y;
        const arrowEndX = arrowStartX + arrowLength;

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

        // "F" label — only if the label center is within canvas
        const labelX = arrowStartX + arrowLength / 2;
        if (labelX < W) {
          ctx.fillStyle = '#acd157';
          ctx.font = 'bold 18px "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText('F', labelX, arrowY - 4);
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    }

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
    };
  }, []); // Empty deps — loop runs once, reads latest values from refs

  return { canvasRef };
}
