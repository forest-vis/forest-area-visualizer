/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

attribute float index;

varying vec2 vUv;
uniform float time;

void main() {

    vec3 pos = position;

    pos *= 0.1;
    pos.x += index*0.2;
    pos.y += sin(time+index)*0.1;

    pos.x += snoise3(vec3(0.3,0.3,index+time)) * 0.1;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos , 1.0);
    
    vUv = uv;
}
