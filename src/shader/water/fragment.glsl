precision lowp float;

varying float vElevation;
uniform vec3 uLowColor;
uniform vec3 uHighColor;
uniform float uOpacity;

void main() {
  float opacity = (vElevation + 1.0) / 2.0;
  vec3 color = mix(uLowColor, uHighColor, opacity);
  gl_FragColor = vec4(color, uOpacity);
}