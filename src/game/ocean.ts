import { waterVertexShader, waterFragmentShader } from '../shaders/waterShader';
import * as THREE from 'three';
import { scene } from '../core/scene';
// Ocean tile size and setup
const tileSize = 700;
const segments = 32;
const oceanGeometry = new THREE.PlaneGeometry(tileSize, tileSize, segments, segments);

const oceanMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: { value: 0 },  // Initial time value
  },
  side: THREE.DoubleSide,
});

const tiles: THREE.Mesh[] = [];
const tileRange = 5;

for (let x = -tileRange; x <= tileRange; x++) {
  for (let z = -tileRange; z <= tileRange; z++) {
    const tile = new THREE.Mesh(oceanGeometry.clone(), oceanMaterial);
    tile.rotation.x = -Math.PI / 2;
    tile.position.set(x * tileSize, 0, z * tileSize);
    scene.add(tile);
    tiles.push(tile);
  }
}

// Add ambient ocean light
const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x1e90ff, 0.6);
scene.add(hemiLight);

// Update ocean animation and position based on time
function updateWave(tile: THREE.Mesh, time: number) {
  const geometry = tile.geometry as THREE.PlaneGeometry;
  const position = geometry.attributes.position;

  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const waveHeight = Math.sin(x * 0.1 + time) * 0.3 + Math.cos(y * 0.1 + time) * 0.3;
    position.setZ(i, waveHeight);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

export function updateOcean(playerX: number, playerZ: number, time: number) {
  for (const tile of tiles) {
    // Recenter tiles based on player position
    const offsetX = Math.round((playerX - tile.position.x) / tileSize);
    const offsetZ = Math.round((playerZ - tile.position.z) / tileSize);
    tile.position.x += offsetX * tileSize;
    tile.position.z += offsetZ * tileSize;

    updateWave(tile, time);
  }

  // Update the time uniform for the shaders
  oceanMaterial.uniforms.uTime.value = time;
}
