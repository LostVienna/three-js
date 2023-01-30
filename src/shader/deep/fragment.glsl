    
precision highp float;
varying vec2 vUv;

// 获取时间
uniform float uTime;

void main() {

  // gl_FragColor = vec4(vUv,1,0);

  // float strength = vUv.x;
  // gl_FragColor = vec4(strength,strength,strength,1);

  // float strength = 1.0 - vUv.y;
  // gl_FragColor = vec4(strength,strength,strength,1);

  // 反复渐变效果
  // float strength = mod(vUv.y * 10.0, 1.0);
  // gl_FragColor = vec4(strength,strength,strength,1);

  // step
  // float strength = mod(vUv.y * 10.0, 1.0);
  // strength = step(0.5, strength);
  // gl_FragColor = vec4(strength,strength,strength,1);

  // float strength = step(0.8, mod((vUv.x + uTime * 0.1) * 10.0, 1.0));
  // strength -= step(0.8, mod(vUv.y * 10.0, 1.0));
  // gl_FragColor = vec4(strength,strength,strength,1);

  // float strength = abs(vUv.x - 0.5);
  // gl_FragColor = vec4(strength,strength,strength,1);

  // float strength = min(abs(vUv.x - 0.5),abs(vUv.y - 0.5));
  // float strength = max(abs(vUv.x - 0.5),abs(vUv.y - 0.5));
  // gl_FragColor = vec4(strength,strength,strength,1);

  // float strength = floor(vUv.x * 10.0)/10.0;
  // float strength = floor(vUv.x * 10.0)/10.0 * floor(vUv.y * 10.0)/10.0;
  // float strength = ceil(vUv.x * 10.0)/10.0 * floor(vUv.y * 10.0)/10.0;
  // gl_FragColor = vec4(strength,strength,strength,1);

  // length
  // float strength = length(vUv);
  // gl_FragColor = vec4(strength,strength,strength,1);.

  // distance
  // float strength = 1.0 - distance(vUv, vec2(0.5,0.5));
  // float strength = 0.15 / distance(vUv, vec2(0.5,0.5));
  // float strength = 0.15 / distance(vUv, vec2(0.5,0.5)) - 1.0;
  // float strength = 0.15 / distance(vec2(vUv.x, vUv.y * 5.0), vec2(0.5,0.5));
  // gl_FragColor = vec4(strength,strength,strength,1);


  float strength = 0.15 / distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5,0.5));
  strength += 0.15 / distance(vec2(vUv.y, (vUv.x - 0.5) * 5.0 + 0.5), vec2(0.5,0.5));
  gl_FragColor = vec4(strength,strength,strength,strength);

}