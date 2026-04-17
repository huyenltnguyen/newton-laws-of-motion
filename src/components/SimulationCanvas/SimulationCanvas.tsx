import { useEffect, useRef } from 'react';
import styles from './SimulationCanvas.module.css';
import { useSimulation } from '../../hooks/useSimulation';

interface SimulationCanvasProps {
  acceleration: number;
  force: number;
  isPlaying: boolean;
}

export function SimulationCanvas({ acceleration, force, isPlaying }: SimulationCanvasProps) {
  const { canvasRef } = useSimulation({ acceleration, force, isPlaying });
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep canvas pixel dimensions in sync with its CSS display size
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resizeObserver = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
    });

    resizeObserver.observe(container);
    // Set initial size
    const dpr = window.devicePixelRatio || 1;
    canvas.width = container.clientWidth * dpr;
    canvas.height = container.clientHeight * dpr;

    return () => resizeObserver.disconnect();
  }, [canvasRef]);

  return (
    <div ref={containerRef} className={styles.container}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-label="Animation showing a block accelerating across a surface. Speed reflects the calculated acceleration."
        role="img"
      />
    </div>
  );
}
