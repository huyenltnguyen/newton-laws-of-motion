import styles from './Header.module.css';

interface HeaderProps {
  activeLaw: 'first' | 'second' | 'third';
  onChangeLaw: (law: 'first' | 'second' | 'third') => void;
  panelId: string;
}

export function Header({ activeLaw, onChangeLaw, panelId }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Newton&apos;s Laws of Motion</h1>
        </div>
        <nav className={styles.tabBar} aria-label="Law selector">
          <div role="tablist" className={styles.tabList}>
            <button type="button" id="tab-first" role="tab"
              className={`${styles.tab} ${activeLaw === 'first' ? styles.tabActive : ''}`}
              onClick={() => onChangeLaw('first')}
              aria-selected={activeLaw === 'first'}
              aria-controls={panelId}>1st Law</button>
            <button type="button" id="tab-second" role="tab"
              className={`${styles.tab} ${activeLaw === 'second' ? styles.tabActive : ''}`}
              onClick={() => onChangeLaw('second')}
              aria-selected={activeLaw === 'second'}
              aria-controls={panelId}>2nd Law</button>
            <button type="button" id="tab-third" role="tab"
              className={`${styles.tab} ${activeLaw === 'third' ? styles.tabActive : ''}`}
              onClick={() => onChangeLaw('third')}
              aria-selected={activeLaw === 'third'}
              aria-controls={panelId}>3rd Law</button>
          </div>
        </nav>
      </div>
    </header>
  );
}
