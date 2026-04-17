import styles from './SecondLawInfo.module.css';

export function SecondLawInfo() {
  return (
    <aside className={styles.panel}>
      <h2 className={styles.title}>Key Concepts</h2>
      <ul className={styles.list}>
        <li>
          <b>Force, mass, and acceleration are linked</b>: net force equals mass times acceleration.
          Knowing any two determines the third.
        </li>
        <li>
          <b>Direction matters.</b> Net force and acceleration are both vectors. An object
          accelerates in the direction of the net force.
        </li>
        <li>
          <b>Mass measures inertia.</b> For the same net force, a greater mass results in a smaller
          acceleration.
        </li>
      </ul>
    </aside>
  );
}
