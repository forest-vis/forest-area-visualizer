/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */

varying vec2 vUv;
varying vec4 vColor;

uniform sampler2D numberTexture;
uniform float fade;

varying float vIsLoss;

void main() {
  gl_FragColor = texture2D(numberTexture, vUv);
  gl_FragColor *= vColor;//vec4(.5,0,0,1);
  
  // gl_FragColor += vec4(1.0,0.0,0.0,1.0);

  // gl_FragColor.a *= .5;
  gl_FragColor.a *= fade;
}