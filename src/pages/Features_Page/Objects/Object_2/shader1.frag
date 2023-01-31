precision mediump float;

uniform float uTime;



void main() {
  float customColor = 0.1;
  customColor += sin(uTime) * 0.9;

  gl_FragColor = vec4(customColor, 0.6, 0.9, 1.0);
}