import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

// 创建场景
const scene = new THREE.Scene();

const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync('textures/hdr/1.hdr').then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

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

const event = {
  onLoad: () => {
    console.log('加载完成');
  },
  onProgress: (e, num, total) => {
    console.log('onprogress: ', e, num, total);
    console.log('加载进度：: ', `${((num / total) * 100).toFixed(2)}%`);
  },
  onError: (e) => {
    console.log('onerror: ', e);
  },
};

// 加载管理器
const loadManger = new THREE.LoadingManager(
  event.onLoad,
  event.onProgress,
  event.onError
);

// 设置cube纹理加载器
const cubeTextureLoader = new THREE.CubeTextureLoader(loadManger);
const envMapTexture = cubeTextureLoader.load([
  './textures/env/1.jpg',
  './textures/env/2.jpg',
  './textures/env/3.jpg',
  './textures/env/4.jpg',
  './textures/env/5.jpg',
  './textures/env/6.jpg',
]);
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const material = new THREE.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.1,
  // envMap: envMapTexture,
});

const sphere = new THREE.Mesh(sphereGeometry, material);
scene.add(sphere);
// 添加场景背景
scene.background = envMapTexture;
// 给场景所有物体添加环境贴图
scene.environment = envMapTexture;

// 灯光
// 环境光
// const light = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();

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
