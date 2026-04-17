import { useEffect, useRef } from 'react';
import styles from './ThirdLawCanvas.module.css';
import { useThirdLawSimulation } from '../../hooks/useThirdLawSimulation';

interface ThirdLawCanvasProps {
  force: number;
  isPlaying: boolean;
}

export function ThirdLawCanvas({ force, isPlaying }: ThirdLawCanvasProps) {
  const { canvasRef } = useThirdLawSimulation({ force, isPlaying });
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
        aria-label="Static force diagram showing Block A and Block B in contact. Equal-length arrows point in opposite directions, showing that the force A exerts on B always equals the force B exerts on A."
        role="img"
      />
    </div>
  );
}
