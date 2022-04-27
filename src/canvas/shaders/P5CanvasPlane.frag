/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

varying vec2 vUv;
varying vec4 vColor;

uniform sampler2D texture1;
uniform sampler2D texture2;
// uniform sampler2D heightMap;
uniform float fade;
uniform float index;
uniform float time;

void main() {
  vec2 uv = vUv;
  float lifegame = texture2D(texture2,vUv).r;

  uv *= (1.0+snoise3(vec3(
    uv.x*40.0,//+time*0.08*,
    uv.y*40.0,//+time*0.08*,
    -time*0.02+index*0.1
  ))*.01);

  vec4 data = texture2D(texture1, uv);

  // uv.y += index*0.001;

  gl_FragColor = texture2D(texture1, uv+vec2(0.0,0.002));
  gl_FragColor.a *= .3 + lifegame*.7;

  if( data.r < 0.1 ){
    gl_FragColor.a *= step(10.,index); 
    gl_FragColor.a *= max(0.0,1.0-((index-10.)/10.0) );
    gl_FragColor.g += lifegame*0.5;
  }else{
    gl_FragColor.a *= step(10.,(20.-index));
    gl_FragColor.a *= max(0.0,(index)/10.0 );
    gl_FragColor.r += lifegame*1.5;

    // gl_FragColor.a *= min(0.0,(20.-index) );
  }

    // gl_FragColor.rgb *= 0.5+texture2D(heightMap, uv).r*1.0;

  // gl_FragColor.a *= .5;
  // gl_FragColor.a *= fade;
}