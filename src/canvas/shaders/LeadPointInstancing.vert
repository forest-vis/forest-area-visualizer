/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: getPositionX = require(./DataGetPositionX.glsl)
#pragma glslify: getPositionY = require(./DataGetPositionY.glsl)
#pragma glslify: getParams = require(./DataGetParams.glsl)

attribute float index;
uniform sampler2D texture1;

varying vec2 vUv;
varying vec4 vColor;
uniform float time;


void main() {

    vec3 params = getParams(texture1, index);
    
    vec3 pos = position;
    pos.y += 0.5;
    pos.y *= 0.002;
    pos.xz *= 0.002;

    pos *= params.y;

    // pos.x += index*0.2;
    pos.xz -= 0.5;


    pos.x += getPositionX(texture1, index);
    pos.z += getPositionY(texture1, index);


    // pos.y += sin(time+index)*0.1;
    // pos.x += snoise3(vec3(0.3,0.3,index+time)) * 0.1;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos , 1.0);
    
    vUv = uv;

    if( params.x == .0 ){
        vColor = vec4(
            61.0/255.0,
            120.0/255.0,
            0,
            0.0
        );
    }else{
        vColor = vec4(
            1.0,
            mix(0., 1., params.x),
            0,
            1.0
        );
    }
  
}
