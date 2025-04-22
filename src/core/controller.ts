import * as THREE from 'three';

export class ShipController {
  private ship: THREE.Group;
  private velocity: THREE.Vector3 = new THREE.Vector3();
  private direction: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
  private acceleration = 0.2;
  private maxSpeed = 5;
  private damping = 0.96;

  private keys: Record<string, boolean> = {};

  constructor(ship: THREE.Group) {
    this.ship = ship;
    this.initInput();
  }

  private initInput() {
    window.addEventListener('keydown', (e) => (this.keys[e.key.toLowerCase()] = true));
    window.addEventListener('keyup', (e) => (this.keys[e.key.toLowerCase()] = false));
  }

  update(delta: number) {
    const moveDir = new THREE.Vector3();
    const isAccelerating = this.keys['w'];
    const isBraking = this.keys['s'];
  
    // Allow rotation only if not braking
    if (!isBraking) {
      if (this.keys['a']) {
        this.ship.rotation.y += 1.5 * delta;
      }
      if (this.keys['d']) {
        this.ship.rotation.y -= 1.5 * delta;
      }
    }
  
    // Update direction based on ship's current rotation
    this.direction.set(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.ship.rotation.y);
  
    // Apply acceleration or braking
    if (isAccelerating) {
      moveDir.add(this.direction);
    }
  
    if (moveDir.lengthSq() > 0) {
      moveDir.normalize();
      this.velocity.addScaledVector(moveDir, this.acceleration);
    } else if (isBraking) {
      // Smooth deceleration without rotation
      this.velocity.multiplyScalar(this.damping);
    } else {
      // Natural damping when no input is provided
      this.velocity.multiplyScalar(this.damping);
    }
  
    // Clamp max speed
    if (this.velocity.length() > this.maxSpeed) {
      this.velocity.setLength(this.maxSpeed);
    }
  
    // Update ship position
    this.ship.position.addScaledVector(this.velocity, delta);
  
    // Smooth bobbing
    const t = performance.now() * 0.001;
    this.ship.position.y = 1 + Math.sin(t * 2) * 0.1;
  
    // Optional: ship pitch and roll for feel
    this.ship.rotation.x = Math.sin(t * 1.5) * 0.02;
    this.ship.rotation.z = Math.sin(t * 1.2) * 0.02;
  }  
}

export class Controller {
  private keys: Record<string, boolean> = {};
  private velocity: THREE.Vector2 = new THREE.Vector2(0, 0);
  private acceleration: number = 0.02;
  private friction: number = 0.95;

  constructor() {
    window.addEventListener("keydown", (e) => (this.keys[e.key] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.key] = false));
  }

  updatePosition(playerX: number, playerZ: number): { x: number; z: number } {
    if (this.keys["w"]) this.velocity.y -= this.acceleration;
    if (this.keys["s"]) this.velocity.y += this.acceleration;
    if (this.keys["a"]) this.velocity.x -= this.acceleration;
    if (this.keys["d"]) this.velocity.x += this.acceleration;

    this.velocity.multiplyScalar(this.friction);

    return {
      x: playerX + this.velocity.x,
      z: playerZ + this.velocity.y,
    };
  }

  getVelocity(): THREE.Vector2 {
    return this.velocity;
  }
}
