import { useState, useCallback } from 'react';

export const FORCE_MIN = 1;
export const FORCE_MAX = 50;
export const MASS_MIN = 1;
export const MASS_MAX = 20;
export const FORCE_DEFAULT = 20;
export const MASS_DEFAULT = 5;

export interface PhysicsState {
  force: number;       // Newtons
  mass: number;        // kilograms
  acceleration: number; // m/s² = force / mass
  setForce: (value: number) => void;
  setMass: (value: number) => void;
}

export function usePhysics(): PhysicsState {
  const [force, setForceRaw] = useState(FORCE_DEFAULT);
  const [mass, setMassRaw] = useState(MASS_DEFAULT);

  const setForce = useCallback((value: number) => {
    setForceRaw(Math.round(Math.min(FORCE_MAX, Math.max(FORCE_MIN, value))));
  }, []);

  const setMass = useCallback((value: number) => {
    setMassRaw(Math.round(Math.min(MASS_MAX, Math.max(MASS_MIN, value))));
  }, []);

  const acceleration = force / mass;

  return { force, mass, acceleration, setForce, setMass };
}
