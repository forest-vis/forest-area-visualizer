/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */

varying vec2 vUv;
uniform sampler2D texture1;
uniform float fade;

void main() {
  gl_FragColor = texture2D(texture1, vUv);
  gl_FragColor.a *= fade;
}