import { useState } from 'react';

export const FORCE_MIN = 1;
export const FORCE_MAX = 50;
export const FORCE_DEFAULT = 10;

export function useThirdLawPhysics() {
  const [force, setForceRaw] = useState(FORCE_DEFAULT);

  const setForce = (v: number) =>
    setForceRaw(Math.max(FORCE_MIN, Math.min(FORCE_MAX, v)));

  return { force, setForce };
}
