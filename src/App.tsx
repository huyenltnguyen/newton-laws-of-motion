import { useState } from 'react';
import styles from './App.module.css';
import { Header } from './components/Header/Header';
import { SliderControl } from './components/SliderControl/SliderControl';
import { SecondLawReadout } from './components/SecondLawReadout/SecondLawReadout';
import { SecondLawInfo } from './components/SecondLawInfo/SecondLawInfo';
import { SimulationCanvas } from './components/SimulationCanvas/SimulationCanvas';
import { usePhysics } from './hooks/usePhysics';
import { FORCE_MIN, FORCE_MAX, MASS_MIN, MASS_MAX } from './hooks/usePhysics';
import { useFirstLawPhysics } from './hooks/useFirstLawPhysics';
import { VELOCITY_MIN, VELOCITY_MAX, FRICTION_MIN, FRICTION_MAX } from './hooks/useFirstLawPhysics';
import { FirstLawCanvas } from './components/FirstLawCanvas/FirstLawCanvas';
import { FirstLawReadout } from './components/FirstLawReadout/FirstLawReadout';
import { FirstLawInfo } from './components/FirstLawInfo/FirstLawInfo';
import {
  useThirdLawPhysics,
  FORCE_MIN as THIRD_FORCE_MIN,
  FORCE_MAX as THIRD_FORCE_MAX,
} from './hooks/useThirdLawPhysics';
import { ThirdLawCanvas } from './components/ThirdLawCanvas/ThirdLawCanvas';
import { ThirdLawReadout } from './components/ThirdLawReadout/ThirdLawReadout';
import { ThirdLawInfo } from './components/ThirdLawInfo/ThirdLawInfo';

function InfoIconButton({
  expanded,
  controls,
  onClick,
}: {
  expanded: boolean;
  controls: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.infoIconBtn}
      aria-expanded={expanded}
      aria-controls={controls}
      aria-label={expanded ? 'Hide key concepts' : 'Show key concepts'}
      onClick={onClick}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <line
          x1="12"
          y1="11"
          x2="12"
          y2="17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="7.5" r="1.2" fill="currentColor" />
      </svg>
    </button>
  );
}

export default function App() {
  const [activeLaw, setActiveLaw] = useState<'first' | 'second' | 'third'>('first');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { force, mass, acceleration, setForce, setMass } = usePhysics();
  const { initialVelocity, friction, frictionForce, setInitialVelocity, setFriction } =
    useFirstLawPhysics();
  const { force: thirdLawForce, setForce: setThirdLawForce } = useThirdLawPhysics();

  const handleChangeLaw = (law: 'first' | 'second' | 'third') => {
    setActiveLaw(law);
    setIsPlaying(false);
    setShowDetails(false);
  };

  const panelId = 'law-panel';

  return (
    <div className={styles.layout}>
      <Header activeLaw={activeLaw} onChangeLaw={handleChangeLaw} panelId={panelId} />

      <main
        id={panelId}
        role="tabpanel"
        aria-labelledby={`tab-${activeLaw}`}
        className={styles.main}
      >
        {activeLaw === 'second' ? (
          <div className={styles.contentGrid}>
            <div className={styles.mainArea}>
              <section className={styles.simulationArea} aria-label="Simulation">
                <div className={styles.canvasWrapper}>
                  <SimulationCanvas
                    acceleration={acceleration}
                    force={force}
                    isPlaying={isPlaying}
                  />
                  <button
                    type="button"
                    className={styles.playPauseBtn}
                    onClick={() => setIsPlaying((p) => !p)}
                    aria-label={isPlaying ? 'Pause simulation' : 'Resume simulation'}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                </div>
              </section>

              <section className={styles.controlsArea} aria-label="Controls">
                <div className={styles.sliders}>
                  <SliderControl
                    id="force-slider"
                    label="Net Force"
                    unit="N"
                    value={force}
                    min={FORCE_MIN}
                    max={FORCE_MAX}
                    onChange={setForce}
                    accentColor="green"
                  />
                  <SliderControl
                    id="mass-slider"
                    label="Mass"
                    unit="kg"
                    value={mass}
                    min={MASS_MIN}
                    max={MASS_MAX}
                    onChange={setMass}
                    accentColor="purple"
                  />
                </div>
                <SecondLawReadout force={force} mass={mass} acceleration={acceleration} />
              </section>
            </div>

            <aside className={styles.sidePanel}>
              <div className={styles.formulaRow}>
                <p className={styles.formulaDisplay} aria-label="Formula: F equals m times a">
                  <span className={`${styles.formulaVar} ${styles.formulaAccentGreen}`}>F</span>
                  {' = '}
                  <span className={`${styles.formulaVar} ${styles.formulaAccentPurple}`}>m</span>
                  <span className={`${styles.formulaVar} ${styles.formulaTextPrimary}`}>a</span>
                </p>
                <InfoIconButton
                  expanded={showDetails}
                  controls="second-law-details"
                  onClick={() => setShowDetails((s) => !s)}
                />
              </div>
              <blockquote id="second-law-quote" className={styles.lawQuote}>
                The acceleration of an object is directly proportional to the net force acting on it
                and inversely proportional to its mass.
              </blockquote>
              {showDetails && (
                <div id="second-law-details">
                  <SecondLawInfo />
                </div>
              )}
            </aside>
          </div>
        ) : activeLaw === 'first' ? (
          <div className={styles.contentGrid}>
            <div className={styles.mainArea}>
              <section className={styles.simulationArea} aria-label="First Law Simulation">
                <div className={styles.canvasWrapper}>
                  <FirstLawCanvas
                    initialVelocity={initialVelocity}
                    friction={friction}
                    isPlaying={isPlaying}
                  />
                  <button
                    type="button"
                    className={styles.playPauseBtn}
                    onClick={() => setIsPlaying((p) => !p)}
                    aria-label={isPlaying ? 'Pause simulation' : 'Resume simulation'}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                </div>
              </section>

              <section className={styles.controlsArea} aria-label="Controls">
                <div className={styles.sliders}>
                  <SliderControl
                    id="velocity-slider"
                    label="Initial Velocity"
                    unit="m/s"
                    value={initialVelocity}
                    min={VELOCITY_MIN}
                    max={VELOCITY_MAX}
                    onChange={setInitialVelocity}
                    accentColor="green"
                  />
                  <SliderControl
                    id="friction-slider"
                    label="Friction (μ)"
                    unit=""
                    value={friction}
                    min={FRICTION_MIN}
                    max={FRICTION_MAX}
                    onChange={setFriction}
                    accentColor="red"
                    step={0.1}
                  />
                </div>
                <FirstLawReadout
                  initialVelocity={initialVelocity}
                  friction={friction}
                  frictionForce={frictionForce}
                />
              </section>
            </div>

            <aside className={styles.sidePanel}>
              <div className={styles.formulaRow}>
                <p
                  className={styles.formulaDisplay}
                  aria-label="Formula: sum of F equals zero implies v equals constant"
                >
                  <span className={`${styles.formulaVar} ${styles.formulaAccentBlue}`}>ΣF</span>
                  {' = 0  →  '}
                  <span className={`${styles.formulaVar} ${styles.formulaAccentGreen}`}>v</span>
                  {' = const'}
                </p>
                <InfoIconButton
                  expanded={showDetails}
                  controls="first-law-details"
                  onClick={() => setShowDetails((s) => !s)}
                />
              </div>
              <blockquote id="first-law-quote" className={styles.lawQuote}>
                An object at rest remains at rest, and an object in motion remains in motion at
                constant velocity, unless acted upon by a net external force.
              </blockquote>
              {showDetails && (
                <div id="first-law-details">
                  <FirstLawInfo />
                </div>
              )}
            </aside>
          </div>
        ) : (
          <div className={styles.contentGrid}>
            <div className={styles.mainArea}>
              <section className={styles.simulationArea} aria-label="Third Law Simulation">
                <div className={styles.canvasWrapper}>
                  <ThirdLawCanvas force={thirdLawForce} isPlaying={isPlaying} />
                </div>
              </section>

              <section className={styles.controlsArea} aria-label="Controls">
                <div className={styles.sliders}>
                  <SliderControl
                    id="force-ab-slider"
                    label="Force on B from A"
                    unit="N"
                    value={thirdLawForce}
                    min={THIRD_FORCE_MIN}
                    max={THIRD_FORCE_MAX}
                    onChange={setThirdLawForce}
                    accentColor="blue"
                  />
                  <SliderControl
                    id="force-ba-slider"
                    label="Force on A from B"
                    unit="N"
                    value={thirdLawForce}
                    min={THIRD_FORCE_MIN}
                    max={THIRD_FORCE_MAX}
                    onChange={setThirdLawForce}
                    accentColor="purple"
                  />
                </div>
                <ThirdLawReadout force={thirdLawForce} />
              </section>
            </div>

            <aside className={styles.sidePanel}>
              <div className={styles.formulaRow}>
                <p
                  className={styles.formulaDisplay}
                  aria-label="Formula: Force AB equals negative Force BA"
                >
                  <span className={`${styles.formulaVar} ${styles.formulaAccentBlue}`}>
                    F<sub>AB</sub>
                  </span>
                  {' = −'}
                  <span className={`${styles.formulaVar} ${styles.formulaAccentPurple}`}>
                    F<sub>BA</sub>
                  </span>
                </p>
                <InfoIconButton
                  expanded={showDetails}
                  controls="third-law-details"
                  onClick={() => setShowDetails((s) => !s)}
                />
              </div>
              <blockquote id="third-law-quote" className={styles.lawQuote}>
                For every action, there is an equal and opposite reaction.
              </blockquote>
              {showDetails && (
                <div id="third-law-details">
                  <ThirdLawInfo />
                </div>
              )}
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
