import { useEffect, useRef } from 'react';
import styles from './FirstLawCanvas.module.css';
import { useFirstLawSimulation } from '../../hooks/useFirstLawSimulation';

interface FirstLawCanvasProps {
  initialVelocity: number;
  friction: number;
  isPlaying: boolean;
}

export function FirstLawCanvas({ initialVelocity, friction, isPlaying }: FirstLawCanvasProps) {
  const { canvasRef } = useFirstLawSimulation({ initialVelocity, friction, isPlaying });
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
        aria-label="Animation showing a block sliding across a surface. Friction decelerates the block; with no friction, the block coasts indefinitely."
        role="img"
      />
    </div>
  );
}
