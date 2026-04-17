import styles from './FirstLawInfo.module.css';

export function FirstLawInfo() {
  return (
    <aside className={styles.panel}>
      <h2 className={styles.title}>Key Concepts</h2>
      <ul className={styles.list}>
        <li>
          <b>Inertia</b> is a property of matter, not a force. It is the resistance of an object to
          any change in its motion.
        </li>
        <li>
          <b>Equilibrium:</b> when all forces on an object are balanced, the net force is zero and
          the object’s motion does not change.
        </li>
        <li>
          <b>Net force</b> is the sum of all forces acting on an object. Only a nonzero net force
          can change an object’s velocity.
        </li>
      </ul>
    </aside>
  );
}
