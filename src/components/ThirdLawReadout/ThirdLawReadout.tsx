import styles from './ThirdLawReadout.module.css';

interface ThirdLawReadoutProps {
  force: number;
}

export function ThirdLawReadout({ force }: ThirdLawReadoutProps) {
  return (
    <div className={styles.container} role="region" aria-label="Third Law readouts">
      <div className={styles.itemsRow}>
        <div className={styles.group}>
          <div className={styles.groupLabel}>Force on A</div>
          <ReadoutItem
            variable={
              <>
                F<sub className={styles.subscript}>BA</sub>
              </>
            }
            label="B pushes A"
            value={String(force)}
            unit="N"
            colorClass="accentPurple"
          />
        </div>
        <div className={styles.group}>
          <div className={styles.groupLabel}>Force on B</div>
          <ReadoutItem
            variable={
              <>
                F<sub className={styles.subscript}>AB</sub>
              </>
            }
            label="A pushes B"
            value={String(force)}
            unit="N"
            colorClass="accentBlue"
          />
        </div>
      </div>
    </div>
  );
}

interface ReadoutItemProps {
  variable: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  colorClass: 'accentPurple' | 'accentBlue';
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
