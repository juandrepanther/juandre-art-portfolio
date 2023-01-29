precision mediump float;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform float uTime;
uniform vec2 uFrequency;
uniform float uIntensity;

attribute vec3 position;



void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.z += cos(modelPosition.x * uFrequency.x + uTime ) * uIntensity;
  modelPosition.z += sin(modelPosition.y * uFrequency.y + uTime ) * 0.1;

  vec4 viewPosition = viewMatrix * modelPosition;

  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  
  // passing attributes to the fragment shader
  
}