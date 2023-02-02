attribute float imgIndex;
attribute float aScale;
varying float vImgIndex;
uniform float uTime;

varying vec3 vColor;

void main() {
  vec4 modelPosition = modelMatrix * vec4( position, 1.0 );

  // 获取顶点的角度
  float angle = atan(modelPosition.x, modelPosition.z);
  // 获取顶点到中心的距离
  float distanceToCenter = length(modelPosition.zx);
  // 根据顶点到中心的距离，设置旋转偏移度数
  float angleOffset = 1.0/distanceToCenter*uTime;
  // 目前旋转的度数
  angle += angleOffset;

  modelPosition.x = cos(angle)*distanceToCenter;
  modelPosition.z = sin(angle)*distanceToCenter;

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position =  projectionMatrix * viewPosition;

  gl_PointSize = 200.0 / -viewPosition.z;

  vImgIndex=imgIndex;
  vColor = color;
}