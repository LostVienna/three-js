    
precision lowp float;
varying vec2 vUv;
varying float eElevation;

uniform sampler2D uTexture;

void main() {
  // 越低越黑，越高越红
  // float height = eElevation + 0.05 * 10.0; 
  // gl_FragColor = vec4(vUv, 0.0, 1.0);
  // gl_FragColor = vec4(1.0 * height,0.0, 0.0, 1.0);

  // 根据UV，取出对应颜色
  vec4 textureColor = texture2D(uTexture, vUv);
  float height = eElevation + 0.05 * 10.0;
  textureColor.rgba *= height;
  gl_FragColor = textureColor;
}