precision mediump float;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float uElevation;
uniform vec2 uFrequency;
uniform float uTime;
uniform vec2 uSpeed;



attribute vec3 position;



void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float elevation = sin(modelPosition.x * uFrequency.x + uTime * uSpeed.x) * 
                    sin(modelPosition.z * uFrequency.y + uTime * uSpeed.y) * 
                    uElevation;
                    
  modelPosition.y += elevation;
  

  vec4 viewPosition = viewMatrix * modelPosition;

  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  
  // passing attributes to the fragment shader
  
}