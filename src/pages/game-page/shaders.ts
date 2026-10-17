export const animatedVertexShader = `
  uniform float uTime;
  uniform float uAmplitude;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normal;
    vec3 transformed = position;
    transformed.x += sin((position.y * 2.2) + uTime * 1.1) * uAmplitude;
    transformed.z += cos((position.x * 2.0) + uTime * 1.35) * uAmplitude * 0.8;

    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

export const animatedFragmentShader = `
  uniform vec3 uBaseColor;
  uniform vec3 uAccentColor;
  uniform vec3 uLightningColor;
  uniform float uLightningIntensity;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 lightDirection = normalize(vec3(-0.4, 1.0, 0.2));
    float diffuse = max(dot(normalize(vNormal), lightDirection), 0.0);
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
    float pulse = 0.5 + 0.5 * sin(uTime * 1.35 + vWorldPosition.y * 1.6);
    vec3 color = mix(uBaseColor, uAccentColor, pulse * 0.35 + fresnel * 0.25);
    color *= 0.65 + diffuse * 0.75;
    color += uLightningColor * uLightningIntensity * (0.18 + diffuse * 0.24 + fresnel * 0.16);

    gl_FragColor = vec4(color, 1.0);
  }
`

export const atmosphereVertexShader = `
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

export const atmosphereFragmentShader = `
  uniform vec3 uLightningColor;
  uniform float uLightningBranchOffset;
  uniform float uLightningIntensity;
  uniform float uLightningSeed;
  uniform float uLightningSpread;
  uniform float uLightningStrikeX;
  uniform float uLightningStrikeZ;
  uniform float uTime;
  varying vec3 vWorldPosition;

  void main() {
    float heightBlend = smoothstep(-4.0, 20.0, vWorldPosition.y);
    vec3 horizon = vec3(0.52, 0.57, 0.60);
    vec3 zenith = vec3(0.17, 0.20, 0.25);
    vec3 skyColor = mix(horizon, zenith, heightBlend);

    float cloudWaveA = sin(vWorldPosition.x * 0.08 + uTime * 0.05);
    float cloudWaveB = cos(vWorldPosition.z * 0.09 - uTime * 0.06);
    float cloudWaveC = sin((vWorldPosition.x + vWorldPosition.z) * 0.04 + uTime * 0.04);
    float stormClouds = smoothstep(0.2, 0.95, cloudWaveA * 0.4 + cloudWaveB * 0.35 + cloudWaveC * 0.25 + 0.5);
    stormClouds *= smoothstep(1.0, 12.0, vWorldPosition.y);
    float highMist = smoothstep(-2.0, 9.0, vWorldPosition.y) * (1.0 - smoothstep(18.0, 30.0, vWorldPosition.y));

    vec3 cloudTint = vec3(0.14, 0.17, 0.19);
    vec3 hazeTint = vec3(0.11, 0.13, 0.15);
    vec3 color = skyColor;
    color -= stormClouds * cloudTint * 0.26;
    color += highMist * hazeTint * 0.18;

    float stormHeight = smoothstep(3.0, 12.0, vWorldPosition.y) * (1.0 - smoothstep(28.0, 42.0, vWorldPosition.y));
    float boltPathX = uLightningStrikeX
      + sin(vWorldPosition.y * 1.18 + uLightningSeed * 9.0) * uLightningSpread * 0.22
      + sin(vWorldPosition.y * 3.5 + uLightningSeed * 16.0) * uLightningSpread * 0.08;
    float boltPathZ = uLightningStrikeZ
      + cos(vWorldPosition.y * 1.04 + uLightningSeed * 11.0) * uLightningSpread * 0.18;
    float branchBlend = smoothstep(8.0, 20.0, vWorldPosition.y);
    float branchPathX = boltPathX + uLightningBranchOffset * branchBlend;
    float branchPathZ = boltPathZ - uLightningBranchOffset * 0.35 * branchBlend;
    float boltDistance = length(vec2(vWorldPosition.x - boltPathX, vWorldPosition.z - boltPathZ));
    float branchDistance = length(vec2(vWorldPosition.x - branchPathX, vWorldPosition.z - branchPathZ));
    float boltCore = smoothstep(1.0, 0.0, boltDistance);
    float boltBranch = smoothstep(0.75, 0.0, branchDistance) * branchBlend;
    float bolt = max(boltCore, boltBranch * 0.72) * stormHeight;
    float cloudFlash = smoothstep(18.0, 0.0, boltDistance * 1.5 + abs(vWorldPosition.y - 17.0) * 0.8);
    color += uLightningColor * uLightningIntensity * (cloudFlash * 0.32 + bolt * 1.15);

    gl_FragColor = vec4(color, 1.0);
  }
`

export const groundFogVertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;

    vec3 transformed = position;
    transformed.y += sin(position.x * 0.18 + uTime * 0.16) * 0.08;
    transformed.y += cos(position.z * 0.16 - uTime * 0.12) * 0.06;

    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

export const groundFogFragmentShader = `
  uniform vec3 uLightningColor;
  uniform float uLightningIntensity;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    float dist = distance(vUv, vec2(0.5));
    float radialFade = smoothstep(0.56, 0.12, dist);
    float driftA = sin(vUv.x * 17.0 + uTime * 0.12 + vWorldPosition.x * 0.02);
    float driftB = cos(vUv.y * 14.0 - uTime * 0.09 + vWorldPosition.z * 0.02);
    float driftC = sin((vUv.x + vUv.y) * 11.0 + uTime * 0.07);
    float breakup = smoothstep(-0.25, 0.75, driftA * 0.38 + driftB * 0.38 + driftC * 0.24);
    float edgeSoftness = 1.0 - smoothstep(0.22, 0.5, dist);
    float alpha = radialFade * breakup * edgeSoftness;

    vec3 baseColor = mix(vec3(0.38, 0.42, 0.44), vec3(0.65, 0.69, 0.72), vUv.y * 0.35 + 0.2);
    vec3 color = mix(baseColor, uLightningColor, min(1.0, uLightningIntensity * 0.26));

    gl_FragColor = vec4(color, alpha * (0.34 + uLightningIntensity * 0.08));
  }
`

export const particleVertexShader = `
  uniform float uTime;
  attribute float aScale;
  varying float vAlpha;

  void main() {
    vec3 transformed = position;
    transformed.x += sin(uTime * 0.3 + position.y * 0.4) * 0.22;
    transformed.z += cos(uTime * 0.24 + position.x * 0.35) * 0.22;
    transformed.y += sin(uTime * 0.6 + position.x * 0.18 + position.z * 0.18) * 0.18;

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aScale * (120.0 / -mvPosition.z);
    vAlpha = smoothstep(-8.0, 14.0, transformed.y);
  }
`

export const particleFragmentShader = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uLightningColor;
  uniform float uLightningIntensity;
  varying float vAlpha;

  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    float alpha = smoothstep(0.5, 0.0, dist);
    vec3 color = mix(uColorA, uColorB, gl_PointCoord.y);
    color = mix(color, uLightningColor, min(1.0, uLightningIntensity * 0.55));
    gl_FragColor = vec4(color, alpha * vAlpha * (0.65 + uLightningIntensity * 0.22));
  }
`
