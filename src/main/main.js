import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import * as dat from 'dat.gui';

console.log(THREE);
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
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);

// 设置相机位置
camera.position.set(0, 0, 10); // x y z 轴
scene.add(camera);

// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// 创建材质
const cubeMaterial = new THREE.MeshBasicMaterial({ color: '#c50a61' });

// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

gui
  .add(cube.position, 'x')
  .min(0)
  .max(5)
  .step(0.01)
  .name('移动X轴')
  .onChange((value) => {
    console.log('值被修改：', value);
  })
  .onFinishChange((value) => {
    console.log('完全停下来：', value);
  });

const params = {
  color: '#ffff00',
  fn() {
    gsap.to(cube.position, {
      x: 5,
      duration: 2,
      yoyo: true,
      repeat: -1,
    });
  },
};
gui.addColor(params, 'color').onChange((value) => {
  console.log('值被修改：', value);
  cube.material.color.set(value);
});

// 设置选项框
gui.add(cube, 'visible').name('是否显示');
gui.add(params, 'fn').name('点击立方体运动');

const floder = gui.addFolder('设置立方体');
floder.add(cube.material, 'wireframe');
// 设置物体的位置
// cube.position.set(10, 0, 0);
// cube.position.x = 5;

// cube.scale.set(3, 2, 1);
// cube.scale.x = 3;

cube.rotation.set(Math.PI / 4, 0, 0);

// 添加到场景中
scene.add(cube);

// 初始化渲染器
const renderer = new THREE.WebGL1Renderer();

// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 讲webgl渲染的canvas内容添加到body
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

// const animate1 = gsap.to(cube.position, {
//   x: 5,
//   duration: 5,
//   // 重复次数， -1 为无限
//   repeat: -1,
//   // 来回运动
//   yoyo: true,
//   // 延迟
//   delay: 2,
//   ease: 'power1.inOut',
//   onComplete() {
//     console.log('complete');
//   },
//   omStart() {
//     console.log('start');
//   },
// });
// gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5, ease: 'power1.inOut' });

// 监听全屏
window.addEventListener('dblclick', () => {
  // if (animate1.isActive()) {
  //   animate1.pause();
  // } else {
  //   animate1.resume();
  // }

  // 全屏操作
  const fullScreenElement = document.fullscreenElement;
  if (!fullScreenElement) {
    renderer.domElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

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

function render() {
  controls.update();
  renderer.render(scene, camera);
  // 渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();
