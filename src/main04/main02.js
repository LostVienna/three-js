import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

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

// 灯光阴影
// 1、设置渲染器开启阴影的计算 renderer.shadowMap.enabled = true
// 2、设置光照投射阴影 spotLight.castShadow = true
// 3、设置物体投射阴影 sphere.castShadow = true
// 4、设置物体接收投射阴影 plane.receiveShadow = true

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const material = new THREE.MeshStandardMaterial();

const sphere = new THREE.Mesh(sphereGeometry, material);
// 投射阴影
sphere.castShadow = true;

scene.add(sphere);

// 创建平面
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;

// 接收阴影
plane.receiveShadow = true;

scene.add(plane);

// 灯光
// 环境光
// const light = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(light);

const spotLight = new THREE.SpotLight(0xffffff, 2);
spotLight.position.set(10, 10, 10);

spotLight.castShadow = true;

// 阴影贴图模糊度
spotLight.shadow.radius = 20;
// 阴影贴图分辨率
spotLight.shadow.mapSize.set(4096, 4096);

spotLight.target = sphere;

spotLight.angle = Math.PI / 6;

spotLight.distance = 0;

spotLight.penumbra = 0;

spotLight.decay = 0; // renderer.physicallyCorrectLights为true才生效

// 设置透射相机的属性
// spotLight.shadow.camera.near = 0.5;
// spotLight.shadow.camera.far = 500;
// spotLight.shadow.camera.fov = 500;

scene.add(spotLight);

gui.add(sphere.position, 'x', -50, 50);
gui.add(spotLight, 'angle', 0, Math.PI / 2);
gui.add(spotLight, 'distance', 0, 10, 0.01);
gui.add(spotLight, 'penumbra', 0, 1, 0.01);
gui.add(spotLight, 'decay', 0, 5, 0.01);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();

// 开启环境中的阴影贴图
renderer.shadowMap.enabled = true;

renderer.physicallyCorrectLights = true;

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
