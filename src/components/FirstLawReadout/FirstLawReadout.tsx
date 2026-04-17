import styles from './FirstLawReadout.module.css';

interface FirstLawReadoutProps {
  initialVelocity: number;
  friction: number;
  frictionForce: number;
}

export function FirstLawReadout({
  initialVelocity,
  friction,
  frictionForce,
}: FirstLawReadoutProps) {
  return (
    <div className={styles.container} role="region" aria-label="First Law readouts">
      <div className={styles.itemsRow}>
        <ReadoutItem
          variable={
            <>
              v<sub className={styles.subscript}>0</sub>
            </>
          }
          label="Initial Velocity"
          value={String(Math.round(initialVelocity))}
          unit="m/s"
          colorClass="accentGreen"
        />
        <ReadoutItem
          variable="μ"
          label="Friction Coeff."
          value={friction.toFixed(2)}
          unit=""
          colorClass="accentRed"
        />
        <ReadoutItem
          variable={
            <>
              F<sub className={styles.subscript}>f</sub>
            </>
          }
          label="Friction Force"
          value={frictionForce.toFixed(2)}
          unit="N"
          colorClass="textPrimary"
        />
      </div>
      <div className={styles.formula} aria-label="Friction force equals mu times m times g">
        <span className={styles.formulaText}>
          <span className={styles.textPrimary}>
            F<sub className={styles.subscript}>f</sub>
          </span>
          {' = '}
          μ
          {' × mg'}
        </span>
        <span className={styles.formulaNote}>m=1 kg, g=10 m/s²</span>
      </div>
    </div>
  );
}

interface ReadoutItemProps {
  variable: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  colorClass: 'accentGreen' | 'accentRed' | 'textPrimary';
}

function ReadoutItem({ variable, label, value, unit, colorClass }: ReadoutItemProps) {
  return (
    <div className={styles.item}>
      <span className={`${styles.variable} ${styles[colorClass]}`}>{variable}</span>
      <span className={`${styles.valueNum} ${styles[colorClass]}`}>{value}</span>
      <span className={styles.unit}>{unit}</span>
      <span className={styles.itemLabel}>{label}</span>
    </div>
  );
}
