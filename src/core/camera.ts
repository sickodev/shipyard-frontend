import * as THREE from 'three';

export const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);
