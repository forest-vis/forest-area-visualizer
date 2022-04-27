

float getPositionX(sampler2D texture1, float inedx_0){
    float dd = (1.0/4096.0) * 0.5;
    float x = (inedx_0/4096.0);
    x = fract(x/1.0);
    // float y = floor(index/4096.0)/4096.0;
    float y = 0.0;
    vec4 data = texture2D( texture1, vec2(x+dd,y+dd));

    float r1 = data.r;
    float r2 = data.g / (255.0);
    float r3 = data.b / (255.0 * 255.0);
    float result = r1 + r2 + r3;

    return result;
}

#pragma glslify: export(getPositionX)