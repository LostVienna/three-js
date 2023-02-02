uniform sampler2D uTexture; 
uniform sampler2D uTexture1; 
uniform sampler2D uTexture2; 

varying float vImgIndex;
varying vec3 vColor;

void main() {
  // float strength = distance(gl_PointCoord, vec2(0.5));
  // strength *= 2.0;
  // strength = 1.0 - strength;
  // gl_FragColor = vec4(strength);
  
  vec4 textureColor;
  if(vImgIndex == 0.0) {
    textureColor = texture2D(uTexture, gl_PointCoord);
  } else if(vImgIndex == 1.0) {
    textureColor = texture2D(uTexture1, gl_PointCoord);
  } else {
    textureColor = texture2D(uTexture2, gl_PointCoord);
  }

  gl_FragColor = vec4(vColor,textureColor.r);
}