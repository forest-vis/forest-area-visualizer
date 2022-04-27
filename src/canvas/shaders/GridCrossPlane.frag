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
uniform float fade;
uniform float index;
uniform float time;

uniform float gridWidth;
uniform float gridRpeat;
uniform float gridFade;

uniform float crossWidth;
uniform float crossRepeat;
uniform float crossSize;

float sdCross( in vec2 p, in vec2 b, float r ) 
{
    p = abs(p); p = (p.y>p.x) ? p.yx : p.xy;
    vec2  q = p - b;
    float k = max(q.y,q.x);
    vec2  w = (k>0.0) ? q : vec2(b.y-p.x,-k);
    return sign(k)*length(max(w,0.0)) + r;
}

vec2 opRep( in vec2 p, in vec2 c)
{
    vec2 q = mod(p+0.5*c,c)-0.5*c;
    return q;
}

void main() {

  vec2 uv = vUv-0.5;
  // uv.y += index*0.001;

  // gl_FragColor = texture2D(texture1, uv+vec2(0.0,0.002));
  vec2 q = opRep(uv,vec2(crossRepeat));
  
  gl_FragColor = vec4(
    1.0,
    1.0,
    1.0,
    (1.0-step(0.,sdCross(q.xy,vec2(crossSize,crossWidth),0.0)))*gridFade
  );

  
  // if( data.r < 0.1 ){
  //   gl_FragColor.a *= step(10.,index); 
  //   gl_FragColor.a *= max(0.0,1.0-((index-10.)/10.0) );
  // }else{
  //   gl_FragColor.a *= step(10.,(20.-index));
  //   gl_FragColor.a *= max(0.0,(index)/10.0 );
  //   // gl_FragColor.a *= min(0.0,(20.-index) );
  // }

}