/**
 * Set the colour to a lovely pink.
 * Note that the color is a 4D Float
 * Vector, R,G,B and A and each part
 * runs from 0.0 to 1.0
 */


varying vec2 vUv;
varying vec4 vColor;


uniform sampler2D maskMap;
uniform sampler2D heightMap;
uniform float fade;
uniform float index;
uniform float time;

void main() {

  vec2 uv = vUv;
  gl_FragColor = texture2D(heightMap, uv);
  gl_FragColor.rgb *= 0.2;
  gl_FragColor.rgb += 0.05;
  gl_FragColor.a = texture2D(maskMap, uv).r;

}