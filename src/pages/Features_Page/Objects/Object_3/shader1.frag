precision mediump float;

uniform vec2 uAxis;

varying vec2 vUv;


void main() {
  float strength = max(abs(vUv.x-uAxis.x), abs(vUv.y - uAxis.y));

  gl_FragColor = vec4(vec3(strength), 1.0);
}