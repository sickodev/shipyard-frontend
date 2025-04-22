import { scene } from "./core/scene";
import { camera } from "./core/camera";
import { renderer } from "./core/renderer";
import { updateOcean } from "./game/ocean";
import { loadShip } from "./game/ship";
import { createLights } from "./core/lights";
import { Controller } from "./core/controller";

import * as THREE from "three";

createLights(scene);

let playerX = 0;
let playerZ = 0;

const controller = new Controller();

let ship: THREE.Object3D;

loadShip().then((loadedShip) => {
  ship = loadedShip;
  scene.add(ship);
  animate(); // Start game loop after model is ready
});

function animate() {
  requestAnimationFrame(animate);
  const t = performance.now() * 0.001; // seconds

  if (ship) {
    // Smooth movement
    ship.position.set(playerX, 1 + Math.sin(t * 2) * 0.1, playerZ); // Y bob

    // Optional: Pitch & roll for realism
    ship.rotation.x = Math.sin(t * 1.5) * 0.02; // pitch (forward-back)
    ship.rotation.z = Math.sin(t * 1.2) * 0.02; // roll (side to side)

    // Face movement direction
    const velocity = controller.getVelocity();
    if (velocity.length() > 0.01) {
      const targetAngle = Math.atan2(velocity.x, velocity.y);
      const currentY = ship.rotation.y;
      const angleDiff = targetAngle - currentY;
      const normalizedDiff = Math.atan2(
        Math.sin(angleDiff),
        Math.cos(angleDiff)
      );
      ship.rotation.y += normalizedDiff * 0.1;
    }
  }

  // Update player position using the controller
  const newPosition = controller.updatePosition(playerX, playerZ);
  playerX = newPosition.x;
  playerZ = newPosition.z;

  // Camera follows player
  camera.position.set(playerX, 10, playerZ + 20);
  camera.lookAt(playerX, 0, playerZ);

  updateOcean(playerX, playerZ, performance.now() * 0.001);

  renderer.render(scene, camera);
}

animate();

/** This code sets up a basic 3D scene using Three.js.
 * It creates a camera, a renderer, and an ocean effect.
 *  The player can move around using the WASD keys, and the ocean
 * tiles update based on the player's position.
 * The camera follows the player, creating a dynamic and
 * interactive environment.
 */
