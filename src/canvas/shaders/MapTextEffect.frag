/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

varying vec2 vUv;
// varying vec3 vColor;

uniform sampler2D texture1;
uniform float fade;
uniform vec3 textColor;
uniform float index;
uniform float time;

void main() {
  vec2 uv = vUv;
  
  // uv *= (1.0+snoise3(vec3(
  //   uv.x*100.0+time*0.08,
  //   uv.y*100.0+time*0.08,
  //   -time*0.08+index
  // ))*.01);

  // vec4 data = texture2D(texture1, uv);

  // uv.y += index*0.001;
  // gl_FragColor = texture2D(texture1, uv);
  gl_FragColor = vec4(textColor.rgb,1.0);
  // a
  // gl_FragColor = vec4(uv.xy,0.0,1.0);
  // gl_FragColor = vec4(vTroikaGlyphDimensions.xy,0.0,1.0);

  // if( data.r < 0.1 ){
  //   gl_FragColor.a *= step(10.,index); 
  //   gl_FragColor.a *= max(0.0,1.0-((index-10.)/10.0) );
  // }else{
  //   gl_FragColor.a *= step(10.,(20.-index));
  //   gl_FragColor.a *= max(0.0,(index)/10.0 );
  //   // gl_FragColor.a *= min(0.0,(20.-index) );
  // }

  // gl_FragColor.a *= fade;
}