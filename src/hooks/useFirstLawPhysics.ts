import { useState } from 'react';

export const VELOCITY_MIN = 0;
export const VELOCITY_MAX = 20;
export const FRICTION_MIN = 0;
export const FRICTION_MAX = 0.8; // μ coefficient

export function useFirstLawPhysics() {
  const [initialVelocity, setInitialVelocity] = useState(10); // m/s
  const [friction, setFriction] = useState(0); // μ

  const G = 10; // m/s² (simplified gravity)
  const frictionForce = +(friction * G).toFixed(2); // F_friction = μmg, m=1 kg

  return {
    initialVelocity,
    friction,
    frictionForce,
    setInitialVelocity: (v: number) =>
      setInitialVelocity(Math.max(VELOCITY_MIN, Math.min(VELOCITY_MAX, v))),
    setFriction: (f: number) =>
      setFriction(Math.max(FRICTION_MIN, Math.min(FRICTION_MAX, f))),
  };
}
