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
varying float vIsLoss;
uniform float time;


void main() {

    vec3 params = getParams(texture1, index);
    
    vec3 pos = position;

    // time
    pos *= step(0.01,params.y);

    pos.y += 0.5;

    // pos.x += 0.1;
    pos.xyz *= 0.01;

    // pos.x += index*0.2;
    // pos.xz -= 0.5;

    vec3 offset = vec3(0.0);
    offset.x += getPositionX(texture1, index);
    offset.z += getPositionY(texture1, index);
    offset.xz -= 0.5;


    vUv = uv;

    vUv.x *= 0.2;
    vUv.y *= 0.2;

    vUv.x = (vUv.x);
    vUv.y = (vUv.y);

    // // vUv.x = (1.0-vUv.x);
    float uvIndex = floor(params.x * 21.0 * 2.0);
    // vIsLoss = params.y < 0.5 ? 0.0 : 1.0;
    vIsLoss = 1.0;
    uvIndex = mix(uvIndex,20.0,vIsLoss);
    vUv.y += floor(uvIndex/5.)*0.2;
    vUv.x += fract(uvIndex/5.)*5.0*0.2;
    
    // vUv.y -= 0.5;
    // vUv.y *= 0.5;
    // vUv.y += 0.5;

    if( params.x == .0 ){
        vColor = vec4(0.0,0.0,0.0,0.0);
        // vUv = uv*0.2;
        // vUv.y += 0.8;
        // offset.y += 0.075*.5;
    }else{
        vColor = vec4(
            1.0,
            mix(0.0, 1., params.x),
            0,
            1.0
        );
        // offset.x += 0.01;
        // offset.y += 0.09;
        offset.y += 0.04;
    }

    gl_Position = projectionMatrix * (modelViewMatrix * vec4(offset.xyz, 1.0) + vec4(pos.x, pos.y, 0.0, 0.0));
    // pos.y += sin(time+index)*0.1;
    // pos.x += snoise3(vec3(0.3,0.3,index+time)) * 0.1;

    // gl_Position = projectionMatrix * modelViewMatrix * vec4(pos , 1.0);
    
    
 
  
}
