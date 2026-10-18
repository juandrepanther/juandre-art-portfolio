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
