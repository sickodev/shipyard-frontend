export const waterVertexShader = `
  precision highp float;  // Ensure consistent precision

  varying vec2 vUv;
  varying float vWave;

  uniform float uTime;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin(pos.x * 0.15 + uTime * 0.4) * 0.3 +
                 cos(pos.y * 0.15 + uTime * 0.2) * 0.3;
    pos.z += wave;
    vWave = wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const waterFragmentShader = `
  precision highp float;  // Ensure consistent precision

  varying vec2 vUv;
  varying float vWave;

  uniform float uTime;

  // Random noise generation
  float random(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // Noise function for wave distortion
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    // Base colors for ocean (Atlantic/Pacific theme)
    vec3 deepBlue = vec3(0.0, 0.22, 0.4);
    vec3 seaGreen = vec3(0.0, 0.65, 0.6);
    vec3 turquoise = vec3(0.0, 0.8, 0.85);

    // Add noise and wave based on UV and time
    float n = noise(vUv * 5.0 + uTime * 0.1);
    float waveStrength = clamp(vWave * 0.5 + 0.5, 0.0, 1.0);
    vec3 baseColor = mix(deepBlue, seaGreen, waveStrength);
    baseColor = mix(baseColor, turquoise, n * 0.3);

    // God ray effect (soft light near the top)
    vec2 lightCenter = vec2(0.5, 0.2);
    float distToSun = distance(vUv, lightCenter);
    float godray = smoothstep(0.5, 0.0, distToSun);
    baseColor += godray * vec3(1.0, 0.9, 0.7) * 0.1;

    // Foam caps effect based on wave strength
    float foam = smoothstep(0.6, 0.95, waveStrength + n * 0.2);
    baseColor = mix(baseColor, vec3(1.0), foam * 0.3);

    // Final color output
    gl_FragColor = vec4(baseColor, 1.0);
  }
`;

