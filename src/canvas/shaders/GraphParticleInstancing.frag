/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */

varying vec2 vUv;
varying vec4 vColor;

uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float fade;

void main() {
  // gl_FragColor = texture2D(texture2, vUv*vec2(1.0,1.03));
  // // gl_FragColor = vColor;//vec4(.5,0,0,1);
  // gl_FragColor.rgb += vec3(
  //   0.05,
  //   0.05,
  //   0.05
  // );
  
  // gl_FragColor.a = gl_FragColor.a>0.01?1.:0.;
  
  // if(vColor.r+vColor.g+vColor.b==0.0)discard;
  
  // gl_FragColor.a *= fade;

  gl_FragColor = vColor;
  // gl_FragColor = vec4(1.0,0.0,0.0,1.0);
}