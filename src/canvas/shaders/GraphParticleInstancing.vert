/**
 * Multiply each vertex by the
 * model-view matrix and the
 * projection matrix (both provided
 * by Three.js) to get a final
 * vertex position
 */

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

attribute float index;
uniform sampler2D dataTexture;
uniform sampler2D texture2;

varying vec2 vUv;
varying vec4 vColor;
uniform float time;
uniform float frame;

uniform float totalNum;
uniform float textureSize;
uniform float dataTextureSize;
uniform float scaleIn;



vec3 getColor(float inedx_0){
    float dd = (1.0/textureSize) * 0.5;
    float x = (inedx_0/textureSize);
    x = fract(x/1.0);
    float y = floor(index/textureSize)/textureSize;
    y = 1.0-y;

    // float y = 1.0/2048.0;
    vec4 data = texture2D( texture2, vec2(x+dd,y+dd));
    return data.rgb;
}

vec4 getParams(float inedx_0){
    float dd = (1.0/dataTextureSize) * 0.5;
    float x = (inedx_0/dataTextureSize);
    x = fract(x/1.0);
    // x = 1.0-x;
    float y = floor(index/dataTextureSize)/dataTextureSize;
    // y = 1.0-y;
    vec4 data = texture2D( dataTexture, vec2(x+dd,y+dd));
    return data;
}

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}

void main() {
    index;
    
    vec4 params = getParams(index);
    
    vUv = vec2(
        fract(index / textureSize),
        1.0-floor(index / textureSize)/textureSize
    );

    vec3 col = getColor(index);
    float isRed = step(0.1,col.r-col.g);

    vec3 pos = position;
    float scaleAnimation = scaleIn; 
    scaleAnimation = clamp(scaleAnimation*10.0-(params.y+0.5)*8.0-random(vec2(index+0.123)*5.0 ),0.0,1.0);
    // scaleAnimation = clamp(scaleAnimation*20.0-params.y*10.0-random(vec2(index+0.32)),0.0,1.0);
    pos *= scaleAnimation;


    // pos *= step(0.0001,frame);

    float t = frame;
    // float t = 10.0;
    float delay = random(vec2(index + 0.341)) * 0.3;
    delay += (1.0-isRed)*0.3;
    float speed = 0.2;//1.0;//0.8 + random(vec2(index + 0.830)) * 0.4;
    // t *= speed;
    t = clamp(t*speed - delay,0.0,1.0);

    vec3 initPos = vec3(0.0);    
    vec3 movingPos = vec3(0.0);   
    vec3 targetPos = vec3(0.0);   

    // initial position
    initPos.x += params.x*100.0;//fract(index / textureSize) * textureSize - textureSize/2.0;
    initPos.z += params.y*100.0;//floor(index / textureSize) - textureSize/2.0;


 


    // // moving position
    float radius = 30. * (0.95 + random(vec2(index + 0.134)) * 0.1);
    
    movingPos.x += sin(index*0.01+time) * radius;
    movingPos.y += 7.0 + random(vec2(index*0.01,index*0.01))*10.0*(0.8+sin(t*0.4)*0.2);
    movingPos.z += cos(index*0.01+time) * radius;

    movingPos.x += snoise3(movingPos*0.02+vec3(index + 0.,0,time*.1+0.9371))*10.0;
    movingPos.y += 7.0 + snoise3(movingPos*0.01+vec3(index + time*.1+0.3711,0.0,0.0))*3.0;
    movingPos.z += snoise3(movingPos*0.02+vec3(index + 0.,time*.1+0.3711,0.0))*10.0;
    
    
    
    // // target position
    targetPos = vec3(
        (params.z>0.5?100.0:0.0) - (params.w / totalNum) * 100.0*(params.z>0.5?1.0:-1.0) - 50.0,// floor(params.w/100.0) - 50.0,
        20.0,
        0.0
    );

    pos.xy *= mix(
        vec2(1.0,1.0),
        vec2(0.2,10.0),
        clamp(frame-4.0,0.0,1.0)
    );

    // pos.x *= 0.1;
    // pos.y *= 10.0;

    // (params.z>0.5?1.0:-1.0)

    // rotation
    // pos = (vec4(pos.xyz,1.0) * rotation3d(
    //     normalize(vec3(
    //         random(vec2(0.121+index)),
    //         random(vec2(0.314+index)),
    //         random(vec2(0.581+index))
    //     )),time)
    // ).xyz;

    pos += mix(
        initPos,
        mix(movingPos,targetPos,clamp((t-0.5)*2.0,0.0,1.0)),
        clamp(t*2.0,0.0,1.0)
    );

    // pos += initPos;
    
    pos *= 1.0/textureSize;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos , 1.0);
    
    // vColor = vec4(col.rgb,1.0);
    
    // vColor = vec4(params.z,1.0-params.z,0.0,1.0);

    if( params.z == .0 ){
        vColor = vec4(
            19.0/255.0,
            76.0/255.0,
            0,
            1.0
        );
    }else{
        vColor = vec4(
            219.0/255.0,
            18.0/255.0,
            1.0/255.0,
            1.0
        );
    }
  
}
