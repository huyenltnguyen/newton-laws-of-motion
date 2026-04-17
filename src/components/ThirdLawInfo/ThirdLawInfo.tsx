import styles from './ThirdLawInfo.module.css';

export function ThirdLawInfo() {
  return (
    <aside className={styles.panel}>
      <h2 className={styles.title}>Key Concepts</h2>
      <ul className={styles.list}>
        <li>
          <b>Interaction pairs:</b> forces always arise in pairs from a single interaction between
          two objects. There is no such thing as an isolated force.
        </li>
        <li>
          <b>Different objects.</b> The two forces in a pair each act on a different object, so they
          never cancel each other out.
        </li>
        <li>
          <b>Equal magnitude, opposite direction.</b> The paired forces are always equal in size
          regardless of the objects' masses. A lighter object accelerates more because of the second
          law, not because it receives more force.
        </li>
      </ul>
    </aside>
  );
}
