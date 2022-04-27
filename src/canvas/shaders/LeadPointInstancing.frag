/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */

varying vec2 vUv;
varying vec4 vColor;

uniform sampler2D texture1;
uniform float fade;

void main() {
  // gl_FragColor = texture2D(texture1, vUv);
  gl_FragColor = vColor;//vec4(.5,0,0,1);
  gl_FragColor *= .8;
  
  // gl_FragColor.a *= .5;
  gl_FragColor.a *= fade;
}