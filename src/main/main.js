import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import * as dat from 'dat.gui';

import vertexShader from '../shader/water/vertex.glsl';
import fragmentShader from '../shader/water/fragment.glsl';

//创建gui对象
const gui = new dat.GUI();

// 创建场景
const scene = new THREE.Scene();

// 创建相机 函数总共有四个参数，分别是fov，aspect，near，far 。fov表示摄像机视锥体垂直视野角度，最小值为0，最大值为180，默认值为50，实际项目中一般都定义45，因为45最接近人正常睁眼角度；aspect表示摄像机视锥体长宽比，默认长宽比为1，即表示看到的是正方形，实际项目中使用的是屏幕的宽高比；near表示摄像机视锥体近端面，这个值默认为0.1，实际项目中都会设置为1；far表示摄像机视锥体远端面，默认为2000，这个值可以是无限的，说的简单点就是我们视觉所能看到的最远距离。
/**
 * 初始显示的大小
 *  屏幕
 * 放大后消失的窗口比，越小越不易消失
 * 放小后消失的窗口比，越大越不易消失
 */

const camera = new THREE.PerspectiveCamera(
  90,
  window.innerHeight / window.innerHeight,
  0.1,
  1000
);

// 设置相机位置
camera.position.set(0, 0, 2); // x y z 轴
scene.add(camera);

const params = {
  uWaresFrequency: 14,
  uScale: 0.03,
  uXzScale: 1.5,
  uNoiseFrequency: 10,
  uNoiseScale: 1.5,
  uLowColor: '#ff0000',
  uHighColor: '#ffff00',
  uXspeed: 1,
  uZspeed: 1,
  uNoiseSpeed: 1,
  uOpacity: 1,
};

gui
  .add(params, 'uWaresFrequency')
  .min(1)
  .max(100)
  .step(0.1)
  .onChange((value) => {
    shaderMaterial.uniforms.uWaresFrequency.value = value;
  });

gui
  .add(params, 'uScale')
  .min(0)
  .max(0.2)
  .step(0.001)
  .onChange((value) => {
    shaderMaterial.uniforms.uScale.value = value;
  });

gui
  .add(params, 'uNoiseFrequency')
  .min(1)
  .max(100)
  .step(0.1)
  .onChange((value) => {
    shaderMaterial.uniforms.uNoiseFrequency.value = value;
  });

gui
  .add(params, 'uNoiseScale')
  .min(0)
  .max(5)
  .step(0.001)
  .onChange((value) => {
    shaderMaterial.uniforms.uNoiseScale.value = value;
  });

gui
  .add(params, 'uXzScale')
  .min(0)
  .max(5)
  .step(0.01)
  .onChange((value) => {
    shaderMaterial.uniforms.uXzScale.value = value;
  });

gui.addColor(params, 'uLowColor').onFinishChange((value) => {
  shaderMaterial.uniforms.uLowColor.value = new THREE.Color(value);
});
gui.addColor(params, 'uHighColor').onFinishChange((value) => {
  shaderMaterial.uniforms.uHighColor.value = new THREE.Color(value);
});

gui
  .add(params, 'uXspeed')
  .min(0)
  .max(5)
  .step(0.001)
  .onChange((value) => {
    shaderMaterial.uniforms.uXspeed.value = value;
  });

gui
  .add(params, 'uZspeed')
  .min(0)
  .max(5)
  .step(0.001)
  .onChange((value) => {
    shaderMaterial.uniforms.uZspeed.value = value;
  });

gui
  .add(params, 'uNoiseSpeed')
  .min(0)
  .max(5)
  .step(0.001)
  .onChange((value) => {
    shaderMaterial.uniforms.uNoiseSpeed.value = value;
  });

gui
  .add(params, 'uOpacity')
  .min(0)
  .max(1)
  .step(0.01)
  .onChange((value) => {
    shaderMaterial.uniforms.uOpacity.value = value;
  });

// 创建着色器材质;
const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uWaresFrequency: {
      value: params.uWaresFrequency,
    },
    uScale: {
      value: params.uScale,
    },
    uNoiseFrequency: {
      value: params.uNoiseFrequency,
    },
    uNoiseScale: {
      value: params.uNoiseScale,
    },
    uXzScale: {
      value: params.uXzScale,
    },
    uTime: {
      value: params.uTime,
    },
    uLowColor: {
      value: new THREE.Color(params.uLowColor),
    },
    uHighColor: {
      value: new THREE.Color(params.uHighColor),
    },
    uXspeed: {
      value: params.uXspeed,
    },
    uZspeed: {
      value: params.uZspeed,
    },
    uNoiseSpeed: {
      value: params.uNoiseSpeed,
    },
    uOpacity: {
      value: params.uOpacity,
    },
  },
  transparent: true,
});

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 1024, 1024),
  shaderMaterial
);

plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });

// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 增加阻尼，拖动具有惯性效果
controls.enableDamping = true;

// 添加坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

window.addEventListener('resize', () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});

const clock = new THREE.Clock();
function render() {
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  shaderMaterial.uniforms.uTime.value = elapsedTime;

  renderer.render(scene, camera);
  // 渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();
