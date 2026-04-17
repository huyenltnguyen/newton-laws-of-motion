import styles from './SecondLawReadout.module.css';

interface SecondLawReadoutProps {
  force: number;
  mass: number;
  acceleration: number;
}

export function SecondLawReadout({ force, mass, acceleration }: SecondLawReadoutProps) {
  return (
    <div className={styles.container} role="region" aria-label="Physics readouts">
      <ReadoutItem variable="F" label="Net Force" value={force} unit="N" colorClass="accentGreen" />
      <div className={styles.divider} aria-hidden="true">
        =
      </div>
      <ReadoutItem variable="m" label="Mass" value={mass} unit="kg" colorClass="accentPurple" />
      <div className={styles.divider} aria-hidden="true">
        ×
      </div>
      <ReadoutItem
        variable="a"
        label="Acceleration"
        value={acceleration.toFixed(2)}
        unit="m/s²"
        colorClass="textPrimary"
      />
    </div>
  );
}

interface ReadoutItemProps {
  variable: React.ReactNode;
  label: string;
  value: number | string;
  unit: string;
  colorClass: 'accentGreen' | 'accentPurple' | 'textPrimary';
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
