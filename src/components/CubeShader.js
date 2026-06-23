// Custom GLSL Shader Chunks and Shader Definitions for Hubtown Landing Page Scene

export const default_pars = `
#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#define saturate( a ) clamp( a, 0.0, 1.0 )

float map(float value,float min1,float max1,float min2,float max2){return min2+(value-min1)*(max2-min2)/(max1-min1);}
vec2 map(vec2 value,vec2 min1,vec2 max1,vec2 min2,vec2 max2){return min2+(value-min1)*(max2-min2)/(max1-min1);}
vec2 map(vec2 value,float min1,float max1,float min2,float max2){return min2+(value-min1)*(max2-min2)/(max1-min1);}
vec3 map(vec3 value,vec3 min1,vec3 max1,vec3 min2,vec3 max2){return min2+(value-min1)*(max2-min2)/(max1-min1);}
vec3 map(vec3 value,float min1,float max1,float min2,float max2){return min2+(value-min1)*(max2-min2)/(max1-min1);}

vec3 transformDirection(in vec3 dir,in mat4 matrix){return normalize((matrix*vec4(dir,0.0)).xyz);}
vec3 inverseTransformDirection(in vec3 dir,in mat4 matrix){return normalize((vec4(dir,0.0)*matrix).xyz);}
`;

export const default_frag_pars = `
float blendSoftLight(float base,float blend){return(blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));}
vec3 blendSoftLight(vec3 base,vec3 blend){return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));}
vec3 blendSoftLight(vec3 base,vec3 blend,float opacity){return(blendSoftLight(base,blend)*opacity+base*(1.0-opacity));}
float blendLinearBurn(float base,float blend){return max(base+blend-1.0,0.0);}
vec3 blendLinearBurn(vec3 base,vec3 blend){return max(base+blend-vec3(1.0),vec3(0.0));}
vec3 blendLinearBurn(vec3 base,vec3 blend,float opacity){return(blendLinearBurn(base,blend)*opacity+base*(1.0-opacity));}
float blendLinearDodge(float base,float blend){return min(base+blend,1.0);}
vec3 blendLinearDodge(vec3 base,vec3 blend){return min(base+blend,vec3(1.0));}
vec3 blendLinearDodge(vec3 base,vec3 blend,float opacity){return(blendLinearDodge(base,blend)*opacity+base*(1.0-opacity));}
float blendLinearLight(float base,float blend){return blend<0.5?blendLinearBurn(base,(2.0*blend)):blendLinearDodge(base,(2.0*(blend-0.5)));}
vec3 blendLinearLight(vec3 base,vec3 blend){return vec3(blendLinearLight(base.r,blend.r),blendLinearLight(base.g,blend.g),blendLinearLight(base.b,blend.b));}
vec3 blendLinearLight(vec3 base,vec3 blend,float opacity){return(blendLinearLight(base,blend)*opacity+base*(1.0-opacity));}
float blendLighten(float base,float blend){return max(blend,base);}
vec3 blendLighten(vec3 base,vec3 blend){return vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));}
vec3 blendLighten(vec3 base,vec3 blend,float opacity){return(blendLighten(base,blend)*opacity+base*(1.0-opacity));}
float blendOverlay(float base,float blend){return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));}
vec3 blendOverlay(vec3 base,vec3 blend){return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));}
vec3 blendOverlay(vec3 base,vec3 blend,float opacity){return(blendOverlay(base,blend)*opacity+base*(1.0-opacity));}
float blendColorDodge(float base,float blend){return(blend==1.0)?blend:min(base/(1.0-blend),1.0);}
vec3 blendColorDodge(vec3 base,vec3 blend){return vec3(blendColorDodge(base.r,blend.r),blendColorDodge(base.g,blend.g),blendColorDodge(base.b,blend.b));}
vec3 blendColorDodge(vec3 base,vec3 blend,float opacity){return(blendColorDodge(base,blend)*opacity+base*(1.0-opacity));}
float blendScreen(float base,float blend){return 1.0-((1.0-base)*(1.0-blend));}
vec3 blendScreen(vec3 base,vec3 blend){return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));}
vec3 blendScreen(vec3 base,vec3 blend,float opacity){return(blendScreen(base,blend)*opacity+base*(1.0-opacity));}
float blendAdd(float base,float blend){return min(base+blend,1.0);}
vec3 blendAdd(vec3 base,vec3 blend){return min(base+blend,vec3(1.0));}
vec3 blendAdd(vec3 base,vec3 blend,float opacity){return(blendAdd(base,blend)*opacity+base*(1.0-opacity));}
vec3 blendMultiply(vec3 base,vec3 blend){return base*blend;}
vec3 blendMultiply(vec3 base,vec3 blend,float opacity){return(blendMultiply(base,blend)*opacity+base*(1.0-opacity));}

#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
float pow2(const in float x){return x*x;}
vec3 pow2(const in vec3 x){return x*x;}
float pow3(const in float x){return x*x*x;}
float pow4(const in float x){float x2=x*x;return x2*x2;}
float max3(const in vec3 v){return max(max(v.x,v.y),v.z);}
`;

export const normals_tangents_vert_pars = `
attribute vec4 tangent;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vBitangent;
`;

export const normals_tangents_vert = `
vec3 objectNormal = vec3(normal);
vec3 objectTangent = vec3(tangent.xyz);
vec3 transformedNormal = objectNormal;
vec3 transformedTangent = objectTangent;

#ifdef USE_INSTANCING
mat3 im = mat3(instanceMatrix);
transformedNormal /= vec3(dot(im[0],im[0]),dot(im[1],im[1]),dot(im[2],im[2]));
transformedNormal = im*transformedNormal;
transformedTangent = im*transformedTangent;
#endif

transformedNormal = normalMatrix * transformedNormal;
transformedTangent = (modelViewMatrix * vec4(transformedTangent, 0.0)).xyz;
vNormal = normalize(transformedNormal);
vTangent = normalize(transformedTangent);
vBitangent = normalize(cross(vNormal, vTangent) * tangent.w);
`;

export const home_fog_vert_pars = `
varying float vFogDepth;
varying float vFogHeight;
varying float vFogWorldPosY;
`;

export const home_fog_vert = `
vFogDepth = -mvPosition.z;
vFogHeight = mvPosition.y;
vFogWorldPosY = worldPosition.y;
`;

export const home_fog_frag_pars = `
varying float vFogDepth;
varying float vFogHeight;
varying float vFogWorldPosY;
uniform float uFogNear_D;
uniform float uFogFar_D;
uniform float uFogStrength_D;
uniform float uFogNear_H;
uniform float uFogFar_H;
uniform float uFogStrength_H;

uniform vec3 uFogColorTop;
uniform vec3 uFogColorMiddle;
uniform vec3 uFogColorBottom;
uniform float uFogStep1;
uniform float uFogStep2;
uniform float uFogStep3;

vec3 threeColorFogGradient(float t){
  vec3 color = mix(uFogColorBottom, uFogColorMiddle, smoothstep(uFogStep1, uFogStep2, t));
  color = mix(color, uFogColorTop, smoothstep(uFogStep2, uFogStep3, t));
  return color;
}
uniform float uSceneFogMix;
uniform bool uEnableFog;
uniform bool uDebugFog;
`;

export const home_fog_frag = `
if(uEnableFog){
  vec4 debugColorOriginal = vec4(gl_FragColor.rgb,1.0);
  vec3 fogSample = threeColorFogGradient(vFogWorldPosY);
  vec3 fog = fogSample;
  float worldDepthFogFactor = smoothstep(uFogNear_D, uFogFar_D, vFogDepth);
  float worldHeightFogFactor = smoothstep(-uFogNear_H, -uFogFar_H, vFogHeight);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fog, clamp(worldDepthFogFactor*uFogStrength_D, 0.0, 1.0));
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fog, clamp(worldHeightFogFactor*uFogStrength_H, 0.0, 1.0));
  if(uDebugFog){
    vec3 debugCol = vec3(0.0, 1.0, 1.0);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, debugCol, clamp(worldDepthFogFactor*uFogStrength_D, 0.0, 1.0));
    gl_FragColor.rgb = mix(gl_FragColor.rgb, debugCol, clamp(worldHeightFogFactor*uFogStrength_H, 0.0, 1.0));
  }
}
`;

// HOLOGRAPHIC CUBE VERTEX SHADER (c1e with chunk replacements)
export const cubeVertexShader = `
${default_pars}
${normals_tangents_vert_pars}

attribute vec2 uv1;
attribute vec2 uv2;
varying vec2 vUv;
varying vec2 vUv1;
varying vec2 vUv2;
varying vec3 vWorldNormal;
varying vec3 vPosition;
varying vec3 vViewPosition;
varying vec4 vWorldPosition;

uniform float uRotationSpeed;
uniform float uVerticalMovementSpeed;
uniform float uVerticalMovementAmount;
uniform float uTime;

mat3 rotate3D(float angle, vec3 axis){
  float s=sin(angle);
  float c=cos(angle);
  float oc=1.0-c;
  return mat3(oc*axis.x*axis.x+c,oc*axis.x*axis.y-axis.z*s,oc*axis.z*axis.x+axis.y*s,oc*axis.x*axis.y+axis.z*s,oc*axis.y*axis.y+c,oc*axis.y*axis.z-axis.x*s,oc*axis.z*axis.x-axis.y*s,oc*axis.y*axis.z+axis.x*s,oc*axis.z*axis.z+c);
}

void main(){
  vUv = uv;
  vUv1 = uv1;
  vUv2 = uv2;
  vPosition = position;
  vec4 transformedPosition = vec4(position, 1.0);
  mat3 rotationMatrix = rotate3D(uTime * uRotationSpeed, normalize(vec3(0.0, 1.0, 0.0)));
  transformedPosition.xyz = rotationMatrix * transformedPosition.xyz;
  transformedPosition.y += sin(uTime * uVerticalMovementSpeed + PI * 0.4) * uVerticalMovementAmount;

#ifdef USE_INSTANCING
  transformedPosition = instanceMatrix * transformedPosition;
#endif

  vec4 worldPosition = modelMatrix * transformedPosition;
  vec4 mvPosition = viewMatrix * worldPosition;

  ${normals_tangents_vert}

  vWorldNormal = normalize(objectNormal);
  vWorldPosition = worldPosition;
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

// HOLOGRAPHIC CUBE FRAGMENT SHADER (l1e with chunk replacements)
export const cubeFragmentShader = `
${default_pars}
${default_frag_pars}

varying vec2 vUv;
varying vec2 vUv1;
varying vec2 vUv2;
varying vec3 vNormal;
varying vec3 vWorldNormal;
varying vec3 vPosition;
varying vec4 vWorldPosition;
varying vec3 vViewPosition;
varying vec3 vTangent;
varying vec3 vBitangent;

uniform vec3 uColor;
uniform vec3 uSize;
uniform float uPatternRepeat;
uniform float uPatternThickness;
uniform float uPatternSmoothness;
uniform vec3 uPatternColor;
uniform float uEdgeThickness;
uniform float uEdgeSmoothness;
uniform vec3 uEdgeColor;
uniform float uContrast;
uniform vec3 uBloomColor;
uniform sampler2D tAO;
uniform float uAoContrast;
uniform vec2 uAoSmoothstep;
uniform sampler2D tGrid;
uniform sampler2D tEdges;
uniform float uGridTextureScale;
uniform vec2 uGridTextureOffset;
uniform float uGridTextureContrast;
uniform float uGridTextureStrength;
uniform vec2 uGridTextureRemap;
uniform float uGridEdgesContrast;
uniform vec2 uGridEdgesThresholds;
uniform float uGridEdgesStrength;
uniform sampler2D tDetails;
uniform float uDetailsScale;
uniform float uDetailsContrast;
uniform float uDetailsStrength;
uniform float uFresnelAmount;
uniform float uFresnelOffset;
uniform float uFresnelFalloff;
uniform float uFresnelAddition;
uniform float uTime;
uniform vec2 uGradientNoiseScale;
uniform float uGradientNoiseSpeed;
uniform float uGradientNoiseContrast;
uniform sampler2D tNoise1;
uniform sampler2D tNoise2;
uniform vec2 uNoiseTextureScale;
uniform float uNoiseTextureContrast;
uniform float uNoiseTextureStrength;
uniform vec2 uNoiseTextureRemap;
uniform float uNoiseTextureSpeed;
uniform vec3 uGradientColor1;
uniform vec3 uGradientColor2;
uniform vec3 uGradientColor3;
uniform vec4 uGradientStep;
uniform vec2 uGradientNoiseThresholds;
uniform vec3 uExtraHighlightColor;
uniform vec4 uExtraHighlightSteps;
uniform float uExtraHighlightStrength;
uniform sampler2D tRevealPattern;
uniform vec2 uRevealPatternScale;
uniform vec2 uRevealPatternOffset;
uniform vec2 uRevealPatternEdge;
uniform vec2 uRevealGradientThresholds;
uniform float uRevealSpeed;
uniform vec3 uRevealPatternColor;
uniform float uRevealPatternStrength;

vec3 threeColorGradient(vec3 color1, vec3 color2, vec3 color3, float step1, float step2, float step3, float step4, float t){
  vec3 color = mix(color1, color2, smoothstep(step1, step2, t));
  color = mix(color, color3, smoothstep(step3, step4, t));
  return color;
}

vec2 getParallaxUV(vec2 uv, float scale, vec3 parallaxDirection){
  return uv - parallaxDirection.xy * scale;
}

mat3 getTangentFrame(vec3 eye_pos, vec3 surf_norm, vec2 uv){
  vec3 q0 = dFdx(eye_pos.xyz);
  vec3 q1 = dFdy(eye_pos.xyz);
  vec2 st0 = dFdx(uv.st);
  vec2 st1 = dFdy(uv.st);
  vec3 N = surf_norm;
  vec3 q1perp = cross(q1, N);
  vec3 q0perp = cross(N, q0);
  vec3 T = q1perp * st0.x + q0perp * st1.x;
  vec3 B = q1perp * st0.y + q0perp * st1.y;
  float det = max(dot(T, T), dot(B, B));
  float scale = (det == 0.0) ? 0.0 : inversesqrt(det);
  return mat3(T * scale, B * scale, N);
}

float fresnelFunc(float amount, float offset, float falloff, vec3 normal, vec3 view){
  return clamp(offset + (1.0 - offset) * pow(1.0 - dot(normal, view), amount) * falloff, 0., 1.);
}

vec4 permute(vec4 x){
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

vec4 taylorInvSqrt(vec4 r){
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t){
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

vec2 fade(vec2 t){
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

float aaStep(float compValue, float gradient){
  float halfChange = fwidth(gradient) * 0.5;
  float lowerEdge = compValue - halfChange;
  float upperEdge = compValue + halfChange;
  float stepped = (gradient - lowerEdge) / (upperEdge - lowerEdge);
  stepped = saturate(stepped);
  return stepped;
}

float aaSmoothStep(float edge0, float edge1, float gradient){
  float halfChange = fwidth(gradient) * 0.5;
  float lowerEdge = edge0 - halfChange;
  float upperEdge = edge1 + halfChange;
  float smoothed = smoothstep(lowerEdge, upperEdge, gradient);
  return smoothed;
}

void main(){
  float faceDirection = gl_FrontFacing ? 1.0 : -1.0;
  vec3 normal = normalize(vNormal);

#ifdef DOUBLE_SIDED
  normal = normal * faceDirection;
#endif

  float fresnel = fresnelFunc(uFresnelAmount, uFresnelOffset, uFresnelFalloff, normal, normalize(vViewPosition));
  float gradientNoiseSample = cnoise(vec3(vUv2 * uGradientNoiseScale, uTime * uGradientNoiseSpeed));
  gradientNoiseSample = (gradientNoiseSample + 1.0) / 2.0;
  gradientNoiseSample = pow(gradientNoiseSample, uGradientNoiseContrast);
  gradientNoiseSample = smoothstep(uGradientNoiseThresholds.x, uGradientNoiseThresholds.y, gradientNoiseSample);
  
  vec3 gradientColor = threeColorGradient(uGradientColor1, uGradientColor2, uGradientColor3, uGradientStep.x, uGradientStep.y, uGradientStep.z, uGradientStep.w, gradientNoiseSample);
  
  float noiseTextureSample1 = texture2D(tNoise1, vUv * uNoiseTextureScale + vec2(uTime * uNoiseTextureSpeed)).r;
  float noiseTextureSample2 = texture2D(tNoise2, vUv * uNoiseTextureScale * 0.5 - vec2(uTime * uNoiseTextureSpeed)).r;
  float noiseTextureSample = max(noiseTextureSample1, noiseTextureSample2);
  noiseTextureSample = pow(noiseTextureSample, uNoiseTextureContrast);
  noiseTextureSample = map(noiseTextureSample, 0.0, 1.0, uNoiseTextureRemap.x, uNoiseTextureRemap.y);
  
  vec2 baseUV = map(vPosition.xy, -uSize.xy / 2.0, uSize.xy / 2.0, vec2(0.0), vec2(1.0));
  
  // Blend Soft Light helper local definition inline
  float baseL = pow(baseUV.y, 1.0);
  float blendL = noiseTextureSample;
  float edgesUV = (blendL < 0.5) ? (2.0 * baseL * blendL + baseL * baseL * (1.0 - 2.0 * blendL)) : (sqrt(baseL) * (2.0 * blendL - 1.0) + 2.0 * baseL * (1.0 - blendL));
  edgesUV = mix(baseL, edgesUV, uNoiseTextureStrength);

  float extraHighlight = threeColorGradient(vec3(1.0), vec3(0.0), vec3(1.0), uExtraHighlightSteps.x, uExtraHighlightSteps.y, uExtraHighlightSteps.z, uExtraHighlightSteps.w, edgesUV).r;
  
  gradientColor += extraHighlight * uExtraHighlightStrength * uExtraHighlightColor;
  gradientColor = pow(gradientColor, vec3(uContrast));
  
  vec3 color = gradientColor;
  float ao = pow(texture2D(tAO, vUv).r, uAoContrast);
  ao = smoothstep(uAoSmoothstep.x, uAoSmoothstep.y, ao);
  color *= ao;
  
  float gridTextureSample = pow(texture2D(tGrid, (vUv1 - 0.5) * uGridTextureScale + 0.5 + uGridTextureOffset).r, uGridTextureContrast);
  gridTextureSample = map(gridTextureSample, 0.0, 1.0, uGridTextureRemap.x, uGridTextureRemap.y);
  
  float edges = texture2D(tEdges, (vUv1 - 0.5) * uGridTextureScale + 0.5 + uGridTextureOffset).r;
  edges = pow(edges, uGridEdgesContrast);
  edges = 1.0 - smoothstep(uGridEdgesThresholds.x, uGridEdgesThresholds.y, edges);
  
  color *= mix(1.0, gridTextureSample, uGridTextureStrength);
  color += edges * uGridEdgesStrength * color;
  
  vec3 coord = vPosition.xyz * uPatternRepeat;
  vec3 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
  float lineVal = min(min(grid.x, grid.y), grid.z);
  float pattern = 1.0 - smoothstep(uPatternThickness - uPatternSmoothness, uPatternThickness + uPatternSmoothness, lineVal);
  pattern = pow(pattern, 1.0 / 2.2);
  
  vec2 detailsUV = (vUv1 - 0.5) * uDetailsScale + 0.5;
  vec3 details = pow(texture2D(tDetails, detailsUV).rgb, vec3(uDetailsContrast));
  color += details * uDetailsStrength * map(color, 0.0, 1.0, 0.2, 1.5);
  
  vec3 coords = (vPosition.xyz / uSize) * 2.0;
  coords = abs(coords);
  coords = 1.0 - coords;
  
  float horizontalEdge1 = 1.0 - aaSmoothStep(uEdgeThickness - uEdgeSmoothness, uEdgeThickness + uEdgeSmoothness, coords.x);
  float horizontalEdge2 = 1.0 - aaSmoothStep(uEdgeThickness - uEdgeSmoothness, uEdgeThickness + uEdgeSmoothness, coords.z);
  float verticalEdge1 = 1.0 - aaSmoothStep(uEdgeThickness - uEdgeSmoothness, uEdgeThickness + uEdgeSmoothness, coords.y);
  
  float topFace = step(1.0, normalize(vWorldNormal).y);
  float bottomFace = (1.0 - step(0.0, normalize(vWorldNormal).y)) * (1.0 - step(0.5, vPosition.y));
  float topBottomFace = max(topFace, bottomFace);
  float frontBackFace = step(0.5, abs(normalize(vWorldNormal).z)) * (1.0 - topBottomFace);
  float sideFaces = step(0.5, abs(normalize(vWorldNormal).x)) * (1.0 - topBottomFace);
  
  float frontBackFaceEdges = max(horizontalEdge1, verticalEdge1) * (1.0 - topBottomFace) * frontBackFace;
  float topBottomFaceEdges = max(horizontalEdge1, horizontalEdge2) * topBottomFace;
  float leftRightFaceEdges = max(horizontalEdge2, verticalEdge1) * sideFaces;
  
  float edgeMask = frontBackFaceEdges + topBottomFaceEdges + leftRightFaceEdges;
  
  color += uBloomColor * color;
  color += edgeMask * uEdgeColor;
  
  vec3 c = color;
  c *= max(1.0, uFresnelAddition * fresnel);
  gl_FragColor = vec4(c, 1.0);
  
  float revealPattern = texture2D(tRevealPattern, (vUv2 - 0.5) * uRevealPatternScale + 0.5 + uRevealPatternOffset).r;
  revealPattern = 1.0 - revealPattern;
  revealPattern = pow(revealPattern, 2.0);
  revealPattern = smoothstep(uRevealPatternEdge.x, uRevealPatternEdge.y, revealPattern);
  
  vec3 dt = map(vPosition.xyz, -uSize.xyz / 2.0, uSize.xyz / 2.0, vec3(-0.5), vec3(0.5));
  float revealUV = length(dt) * 4.0 + 4.0;
  float revealProgress = clamp(fract(uTime * uRevealSpeed), 0.0, 1.0) * step(0.0, sin(uTime * uRevealSpeed * PI));
  revealUV -= (revealProgress + 1.0 / 4.0) * 4.0 * 2.0;
  revealUV = abs(revealUV);
  revealUV = smoothstep(uRevealGradientThresholds.x, uRevealGradientThresholds.y, revealUV);
  
  float reveal = clamp(revealPattern - revealUV, 0.0, 1.0);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, uRevealPatternColor * uRevealPatternStrength, reveal);
  gl_FragColor.rgb = clamp(gl_FragColor.rgb, 0.0, 1.0);

#include <tonemapping_fragment>
#include <colorspace_fragment>
}
`;

// STARRY SKYBOX VERTEX SHADER (Xbe)
export const skyboxVertexShader = `
${default_pars}
${normals_tangents_vert_pars}

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vWorldNormal;
varying vec4 vScreenSpacePosition;

void main(){
  vUv = uv;
  vPosition = position;
  vec4 transformedPosition = vec4(position, 1.0);

  ${normals_tangents_vert}

  vWorldNormal = normalize((modelMatrix * vec4(objectNormal, 0.0)).xyz);
  vec4 mvPosition = modelViewMatrix * transformedPosition;
  gl_Position = projectionMatrix * mvPosition;
  vScreenSpacePosition = gl_Position;
}
`;

// STARRY SKYBOX FRAGMENT SHADER (Ybe)
export const skyboxFragmentShader = `
precision highp float;
precision highp int;

${default_pars}
${default_frag_pars}

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vWorldNormal;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec4 vWorldPosition;

uniform float uTime;
uniform float uRadius;
uniform float uPixelRatio;
uniform vec2 uResolution;
uniform vec3 uColor1;
uniform float uColor1Stop;
uniform vec3 uColor2;
uniform float uColor2Stop;
uniform vec3 uColor3;
uniform float uColor3Stop;
uniform vec3 uColor4;
uniform float uColor4Stop;
uniform sampler2D tVoronoi;
uniform float uStarsScale;
uniform float uStarsThreshold;
uniform float uStarsStrength;

struct ColorStop {
  vec3 color;
  float position;
};

vec3 bSplineColor(in ColorStop colors[4], int count, float factor){
  factor = clamp(factor, colors[0].position, colors[count-1].position);
  int i = 0;
  for(int j=0; j<count-1; j++){
    if(factor >= colors[j].position && factor <= colors[j+1].position){
      i = j;
      break;
    }
  }
  float t = (factor - colors[i].position) / (colors[i+1].position - colors[i].position);
  t = clamp(t, 0.0, 1.0);
  int i0 = max(i-1, 0);
  int i1 = i;
  int i2 = min(i+1, count-1);
  int i3 = min(i+2, count-1);
  float t2 = t*t;
  float t3 = t2*t;
  float B0 = (1.0-t)*(1.0-t)*(1.0-t)/6.0;
  float B1 = (3.0*t3-6.0*t2+4.0)/6.0;
  float B2 = (-3.0*t3+3.0*t2+3.0*t+1.0)/6.0;
  float B3 = t3/6.0;
  vec3 col = colors[i0].color*B0 + colors[i1].color*B1 + colors[i2].color*B2 + colors[i3].color*B3;
  return col;
}

void main(){
  vec2 screenUV = gl_FragCoord.xy / (uResolution.xy * uPixelRatio);
  vec2 uv = vUv;
  vec2 uvStars = uv;
  uvStars.x = fract(uvStars.x);

  ColorStop[4] colors = ColorStop[](
    ColorStop(uColor4, uColor4Stop),
    ColorStop(uColor3, uColor3Stop),
    ColorStop(uColor2, uColor2Stop),
    ColorStop(uColor1, uColor1Stop)
  );

  ColorStop[4] m = ColorStop[](
    ColorStop(vec3(1.), uColor4Stop),
    ColorStop(vec3(1.), uColor3Stop),
    ColorStop(vec3(0.), uColor2Stop),
    ColorStop(vec3(0.), uColor1Stop)
  );

  vec3 color = bSplineColor(colors, 4, 1.0 - uv.y);
  vec3 mask = bSplineColor(m, 4, 1.0 - uv.y);

  float stars_exposure = uStarsStrength;
  float stars_scale = mix(uStarsScale, uStarsScale * 0.7, smoothstep(uRadius, -uRadius * 1.25, vWorldPosition.y));
  float stars = 0.0;
  stars = texture2D(tVoronoi, uvStars * stars_scale).r;

  if(uPixelRatio > 1.0){
    stars = smoothstep(uStarsThreshold, (uStarsThreshold + 0.01), stars);
  } else {
    float edge = 0.02 + (1.0 - uPixelRatio > 1.0 ? 0.01 : 0.0);
    stars = smoothstep(uStarsThreshold, uStarsThreshold + edge, stars);
    stars = pow(stars, 1.2);
  }

  stars *= stars_exposure;
  stars = clamp(stars, 0.0, 1.0);
  stars = max(0.0, stars);

  gl_FragColor = vec4(color + mask * stars, 1.0);

#include <tonemapping_fragment>
#include <colorspace_fragment>
}
`;
