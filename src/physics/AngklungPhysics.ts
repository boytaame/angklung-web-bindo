/**
 * 2D Physics Engine for Indonesian Bamboo Angklung
 * Simulates:
 * - Free translation across screen (no pulling back to center)
 * - Gentle, natural pendulum sway (restrained tilt, non-aggressive response)
 * - Internal bamboo tubes rattling in slotted troughs
 * - Dynamic composite shake intensity tracking for audio modulation
 */

export interface CollisionEvent {
  tubeIndex: 0 | 1; // 0 = Anak (high), 1 = Induk (low)
  velocity: number; // 0 to 1
  isLeftHit: boolean;
  time: number;
}

export class AngklungPhysics {
  // Top Handle State - Can move anywhere on screen
  public handleX: number = 0; // Current position in px relative to start/center
  public handleY: number = 0;
  public handleVx: number = 0;
  public handleVy: number = 0;
  public prevHandleVx: number = 0;
  public targetHandleX: number = 0;
  public targetHandleY: number = 0;
  public isDragging: boolean = false;

  // Frame Pendulum State - Gentle, realistic bamboo sway
  public frameAngle: number = 0; // radians
  public frameAngleVel: number = 0;
  public frameLength: number = 340; // px distance from handle to bottom trough

  // Tube 1 (Tabung Anak - Small / High Pitch Tube)
  public tube1Offset: number = 0; // px displacement relative to slot center
  public tube1Vel: number = 0;
  public readonly slot1Width: number = 16; // +/- 16px bound

  // Tube 2 (Tabung Induk - Large / Low Pitch Tube)
  public tube2Offset: number = 0;
  public tube2Vel: number = 0;
  public readonly slot2Width: number = 19; // +/- 19px bound

  // External impulse/shake automation (for Kurulung / Centok presets)
  private automatedShakeDuration: number = 0;
  private automatedShakeTime: number = 0;
  private automatedShakeFreq: number = 18; // Hz
  private automatedShakeAmp: number = 0;

  // Shake motion energy accumulator for continuous shake audio
  private recentShakeEnergy: number = 0;

  // Collision callback
  private onCollision: ((event: CollisionEvent) => void) | null = null;

  // Rate limiting for audio clicks
  private lastHit1Time: number = 0;
  private lastHit2Time: number = 0;

  // Screen Boundary Limits (so angklung cannot leave screen)
  public minHandleX: number = -600;
  public maxHandleX: number = 600;
  public minHandleY: number = -400;
  public maxHandleY: number = 400;

  constructor(onCollision?: (event: CollisionEvent) => void) {
    if (onCollision) {
      this.onCollision = onCollision;
    }
  }

  public setBounds(minX: number, maxX: number, minY: number, maxY: number) {
    this.minHandleX = minX;
    this.maxHandleX = maxX;
    this.minHandleY = minY;
    this.maxHandleY = maxY;

    // Immediately clamp current positions
    this.handleX = Math.max(this.minHandleX, Math.min(this.maxHandleX, this.handleX));
    this.handleY = Math.max(this.minHandleY, Math.min(this.maxHandleY, this.handleY));
    this.targetHandleX = Math.max(this.minHandleX, Math.min(this.maxHandleX, this.targetHandleX));
    this.targetHandleY = Math.max(this.minHandleY, Math.min(this.maxHandleY, this.targetHandleY));
  }

  public setCollisionCallback(cb: (event: CollisionEvent) => void) {
    this.onCollision = cb;
  }

  public setPosition(x: number, y: number) {
    this.handleX = Math.max(this.minHandleX, Math.min(this.maxHandleX, x));
    this.handleY = Math.max(this.minHandleY, Math.min(this.maxHandleY, y));
    this.targetHandleX = this.handleX;
    this.targetHandleY = this.handleY;
  }

  public startDrag(x: number, y: number) {
    this.isDragging = true;
    this.targetHandleX = Math.max(this.minHandleX, Math.min(this.maxHandleX, x));
    this.targetHandleY = Math.max(this.minHandleY, Math.min(this.maxHandleY, y));
  }

  public updateDrag(x: number, y: number) {
    if (this.isDragging) {
      this.targetHandleX = Math.max(this.minHandleX, Math.min(this.maxHandleX, x));
      this.targetHandleY = Math.max(this.minHandleY, Math.min(this.maxHandleY, y));
    }
  }

  public endDrag() {
    this.isDragging = false;
  }

  public applyImpulse(fx: number, fy: number = 0) {
    this.handleVx += fx;
    this.handleVy += fy;
    // Gentle frame impulse
    this.frameAngleVel += (fx / this.frameLength) * 0.25;
    this.tube1Vel += fx * 0.85;
    this.tube2Vel += fx * 0.75;
    this.recentShakeEnergy = Math.min(this.recentShakeEnergy + Math.abs(fx) / 300, 1.0);
  }

  /**
   * Directly injects shake energy into bamboo sound tubes during toss/shake
   */
  public injectShakeImpulse(dx: number, speed: number) {
    const dir = Math.sign(dx) || 1;
    const intensity = Math.min(speed / 400, 1.5);
    this.tube1Vel += dir * 180 * intensity;
    this.tube2Vel += dir * 150 * intensity;
    // Very gentle subtle angular nudge, no aggressive tilting
    this.frameAngleVel += dir * 0.04 * intensity;
    this.recentShakeEnergy = Math.min(this.recentShakeEnergy + 0.35 * intensity, 1.0);
  }

  public triggerKurulung(durationMs: number = 1500, intensity: number = 1.0) {
    this.automatedShakeDuration = durationMs / 1000;
    this.automatedShakeTime = 0;
    this.automatedShakeAmp = 20 * intensity;
    this.automatedShakeFreq = 16;
    this.recentShakeEnergy = 1.0;
  }

  public triggerCentok(intensity: number = 1.0) {
    this.applyImpulse(320 * intensity, 0);
    this.tube1Vel += 650 * intensity;
    this.tube2Vel += 600 * intensity;
    this.recentShakeEnergy = Math.min(this.recentShakeEnergy + 0.8, 1.0);
  }

  /**
   * Advances physics simulation by dt seconds
   */
  public update(dt: number) {
    const clampedDt = Math.min(Math.max(dt, 0.001), 0.04);

    this.prevHandleVx = this.handleVx;

    // 1. Handle Position
    if (this.isDragging) {
      // Very responsive direct tracking to cursor/touch without lag or spring snapping
      const followStiffness = 32;
      const dx = this.targetHandleX - this.handleX;
      const dy = this.targetHandleY - this.handleY;

      // Track velocity from positional movement
      this.handleVx = dx * followStiffness;
      this.handleVy = dy * followStiffness;

      this.handleX += dx * Math.min(followStiffness * clampedDt, 1.0);
      this.handleY += dy * Math.min(followStiffness * clampedDt, 1.0);

      // Clamp strictly inside boundaries
      this.handleX = Math.max(this.minHandleX, Math.min(this.maxHandleX, this.handleX));
      this.handleY = Math.max(this.minHandleY, Math.min(this.maxHandleY, this.handleY));
    } else {
      // Check automated shake (e.g. keyboard Kurulung)
      let autoForceX = 0;
      if (this.automatedShakeTime < this.automatedShakeDuration) {
        this.automatedShakeTime += clampedDt;
        const progress = this.automatedShakeTime / this.automatedShakeDuration;
        const env = Math.sin(progress * Math.PI);
        autoForceX =
          Math.sin(this.automatedShakeTime * this.automatedShakeFreq * 2 * Math.PI) *
          this.automatedShakeAmp *
          env *
          160;
      }

      // NO spring pulling back to center!
      // When released, the angklung stays wherever it was placed, only smoothly coasting with drag friction
      const airFriction = 7.0;
      this.handleVx = (this.handleVx + autoForceX * clampedDt) * Math.exp(-airFriction * clampedDt);
      this.handleVy = this.handleVy * Math.exp(-airFriction * clampedDt);

      this.handleX += this.handleVx * clampedDt;
      this.handleY += this.handleVy * clampedDt;

      // Soft boundary bounce when coasting so it never leaves the screen
      if (this.handleX < this.minHandleX) {
        this.handleX = this.minHandleX;
        const speed = Math.abs(this.handleVx);
        this.handleVx = speed * 0.45;
        if (speed > 60) {
          this.tube1Vel += 100;
          this.tube2Vel += 80;
        }
      } else if (this.handleX > this.maxHandleX) {
        this.handleX = this.maxHandleX;
        const speed = Math.abs(this.handleVx);
        this.handleVx = -speed * 0.45;
        if (speed > 60) {
          this.tube1Vel -= 100;
          this.tube2Vel -= 80;
        }
      }

      if (this.handleY < this.minHandleY) {
        this.handleY = this.minHandleY;
        this.handleVy = Math.abs(this.handleVy) * 0.45;
      } else if (this.handleY > this.maxHandleY) {
        this.handleY = this.maxHandleY;
        this.handleVy = -Math.abs(this.handleVy) * 0.45;
      }
    }

    // 2. Linear handle acceleration calculation
    const handleAccX = (this.handleVx - this.prevHandleVx) / clampedDt;

    // Decay recent shake energy
    this.recentShakeEnergy *= Math.exp(-4.2 * clampedDt);

    // 3. Gentle Pendulum Frame Rotation
    // Upright gravitational stability
    const uprightStiffness = 24.0;
    const gravityTorque = -uprightStiffness * this.frameAngle;

    // Greatly reduced inertial torque from handle movement:
    // Mild coupling so the instrument stays mostly vertical and never tilts aggressively
    const inertialCoupling = 0.0007; // Much softer tilt response
    const inertiaTorque = -handleAccX * inertialCoupling;

    // High angular damping prevents wild swinging and quickly settles the instrument upright
    const angularDamping = 6.5;

    const angleAcc = gravityTorque + inertiaTorque - angularDamping * this.frameAngleVel;
    this.frameAngleVel += angleAcc * clampedDt;
    this.frameAngle += this.frameAngleVel * clampedDt;

    // Tightly clamp maximum tilt angle to +/- 12 degrees so it never tilts aggressively
    const maxAngle = (12 * Math.PI) / 180;
    if (Math.abs(this.frameAngle) > maxAngle) {
      this.frameAngle = Math.sign(this.frameAngle) * maxAngle;
      this.frameAngleVel = -this.frameAngleVel * 0.1;
    }

    // 4. Horizontal acceleration at the bottom bamboo trough
    // Trough acceleration couples directly with horizontal shake to throw the tubes
    const troughAccX = handleAccX + (this.frameAngleVel * 120);

    // 5. Internal Sound Tubes Dynamics (Inertial sliding inside trough slot)
    const now = performance.now();
    const inertiaScale = 0.75;

    // --- Tube 1 (Anak - Small) ---
    const t1Restoring = -45 * this.tube1Offset;
    const t1Inertia = -troughAccX * inertiaScale;
    const t1Damping = -5.0 * this.tube1Vel;
    const t1Acc = t1Restoring + t1Inertia + t1Damping;

    this.tube1Vel += t1Acc * clampedDt;
    this.tube1Offset += this.tube1Vel * clampedDt;

    // Tube 1 Collision with Slot Boundaries
    if (this.tube1Offset > this.slot1Width) {
      this.tube1Offset = this.slot1Width;
      const hitVel = Math.abs(this.tube1Vel);
      this.tube1Vel = -this.tube1Vel * 0.35;

      if (hitVel > 24 && now - this.lastHit1Time > 35) {
        this.lastHit1Time = now;
        const normVel = Math.min(Math.max((hitVel - 20) / 340, 0.1), 1.0);
        this.recentShakeEnergy = Math.min(this.recentShakeEnergy + normVel * 0.45, 1.0);
        this.onCollision?.({
          tubeIndex: 0,
          velocity: normVel,
          isLeftHit: false,
          time: now,
        });
      }
    } else if (this.tube1Offset < -this.slot1Width) {
      this.tube1Offset = -this.slot1Width;
      const hitVel = Math.abs(this.tube1Vel);
      this.tube1Vel = -this.tube1Vel * 0.35;

      if (hitVel > 24 && now - this.lastHit1Time > 35) {
        this.lastHit1Time = now;
        const normVel = Math.min(Math.max((hitVel - 20) / 340, 0.1), 1.0);
        this.recentShakeEnergy = Math.min(this.recentShakeEnergy + normVel * 0.45, 1.0);
        this.onCollision?.({
          tubeIndex: 0,
          velocity: normVel,
          isLeftHit: true,
          time: now,
        });
      }
    }

    // --- Tube 2 (Induk - Large) ---
    const t2Restoring = -35 * this.tube2Offset;
    const t2Inertia = -troughAccX * (inertiaScale * 1.15);
    const t2Damping = -4.5 * this.tube2Vel;
    const t2Acc = t2Restoring + t2Inertia + t2Damping;

    this.tube2Vel += t2Acc * clampedDt;
    this.tube2Offset += this.tube2Vel * clampedDt;

    // Tube 2 Collision with Slot Boundaries
    if (this.tube2Offset > this.slot2Width) {
      this.tube2Offset = this.slot2Width;
      const hitVel = Math.abs(this.tube2Vel);
      this.tube2Vel = -this.tube2Vel * 0.38;

      if (hitVel > 24 && now - this.lastHit2Time > 38) {
        this.lastHit2Time = now;
        const normVel = Math.min(Math.max((hitVel - 20) / 340, 0.1), 1.0);
        this.recentShakeEnergy = Math.min(this.recentShakeEnergy + normVel * 0.5, 1.0);
        this.onCollision?.({
          tubeIndex: 1,
          velocity: normVel,
          isLeftHit: false,
          time: now,
        });
      }
    } else if (this.tube2Offset < -this.slot2Width) {
      this.tube2Offset = -this.slot2Width;
      const hitVel = Math.abs(this.tube2Vel);
      this.tube2Vel = -this.tube2Vel * 0.38;

      if (hitVel > 24 && now - this.lastHit2Time > 38) {
        this.lastHit2Time = now;
        const normVel = Math.min(Math.max((hitVel - 20) / 340, 0.1), 1.0);
        this.recentShakeEnergy = Math.min(this.recentShakeEnergy + normVel * 0.5, 1.0);
        this.onCollision?.({
          tubeIndex: 1,
          velocity: normVel,
          isLeftHit: true,
          time: now,
        });
      }
    }
  }

  /**
   * Calculates overall shake intensity (0.0 to 1.0) combining pointer motion,
   * internal tube velocities, and recent collisions.
   */
  public getCompositeShakeIntensity(): number {
    const handleSpeed = Math.hypot(this.handleVx, this.handleVy);
    const tubeSpeed = Math.abs(this.tube1Vel) + Math.abs(this.tube2Vel);

    const normHandle = Math.min(handleSpeed / 380, 1.0);
    const normTube = Math.min(tubeSpeed / 300, 1.0);

    const maxDynamic = Math.max(
      normHandle * 0.95,
      normTube * 1.0,
      this.recentShakeEnergy
    );

    return Math.min(Math.max(maxDynamic, 0), 1.0);
  }

  /**
   * Returns true if the angklung instrument is in physical motion (moving handle, vibrating tubes, or oscillating)
   */
  public isMoving(): boolean {
    const handleSpeed = Math.hypot(this.handleVx, this.handleVy);
    const tubeSpeed = Math.abs(this.tube1Vel) + Math.abs(this.tube2Vel);
    const angleSpeed = Math.abs(this.frameAngleVel);

    return (
      handleSpeed > 14 ||
      tubeSpeed > 20 ||
      angleSpeed > 0.08 ||
      this.recentShakeEnergy > 0.04 ||
      this.automatedShakeDuration > 0
    );
  }

  public reset() {
    this.handleX = 0;
    this.handleY = 0;
    this.handleVx = 0;
    this.handleVy = 0;
    this.prevHandleVx = 0;
    this.frameAngle = 0;
    this.frameAngleVel = 0;
    this.tube1Offset = 0;
    this.tube1Vel = 0;
    this.tube2Offset = 0;
    this.tube2Vel = 0;
    this.automatedShakeDuration = 0;
    this.recentShakeEnergy = 0;
  }
}
