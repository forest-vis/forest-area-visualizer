/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */

// #pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

// attribute float index;
uniform sampler2D texture1;

varying vec2 vUv;
varying vec4 vColor;
uniform float time;

// float random (vec2 st) {
//     return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
// }

void main() {
    // index;
    vec3 pos = position;
    pos *= 0.05;
    gl_Position = projectionMatrix * (modelViewMatrix * vec4(0.0,0.0,0.0, 1.0) + vec4(pos.x, pos.y, 0.0, 0.0));
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(pos , 1.0);
    vUv = uv;
}
