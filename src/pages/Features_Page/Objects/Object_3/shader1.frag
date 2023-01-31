precision mediump float;

uniform vec2 uAxis;
uniform vec3 uTone;

varying vec2 vUv;


void main() {
  
  float gradient = max(abs(vUv.x-uAxis.x), abs(vUv.y - uAxis.y));

  float strength_r = gradient * uTone.r ;
  float strength_g = gradient * uTone.g ;
  float strength_b = gradient * uTone.b ;


  gl_FragColor = vec4(strength_r, strength_g, strength_b, 1.0);
}