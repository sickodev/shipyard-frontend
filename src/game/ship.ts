import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export async function loadShip(): Promise<THREE.Object3D> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      '/models/ship.glb',
      (      gltf: { scene: any; }) => {
        const ship = gltf.scene;
        ship.scale.set(2, 2, 2); // Adjust to size
        ship.position.set(0, 1, 0);
        ship.traverse((obj: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>) => {
          if ((obj as THREE.Mesh).isMesh) {
            (obj as THREE.Mesh).castShadow = true;
            (obj as THREE.Mesh).receiveShadow = true;
          }
        });
        resolve(ship);
      },
      undefined,
      reject
    );
  });
}
