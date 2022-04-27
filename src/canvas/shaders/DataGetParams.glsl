

vec3 getParams(sampler2D texture1, float inedx_0){
    float dd = (1.0/4096.0) * 0.5;
    float x = (inedx_0/4096.0);
    x = fract(x/1.0);
    // float y = floor(index/4096.0)/4096.0;
    float y = 2.0/4096.0;
    vec4 data = texture2D( texture1, vec2(x+dd,y+dd));
    return data.xyz;
}

#pragma glslify: export(getParams)