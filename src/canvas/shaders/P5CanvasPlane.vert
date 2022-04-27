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

// uniform sampler2D heightMap;
uniform float heightScale;

varying vec2 vUv;
varying vec4 vColor;
uniform float time;


void main() {
    
    vec3 pos = position;
    // float height = texture2D(heightMap, uv).r;
    // pos.z += height * heightScale;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos , 1.0);
    vUv = uv;
}
