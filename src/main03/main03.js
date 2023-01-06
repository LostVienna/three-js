import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

// 导入纹理
const textureLoader = new THREE.TextureLoader(loadManger);
const fabricColorTexture = textureLoader.load('./textures/fabric/color.jpg');
const fabricAlphaTexture = textureLoader.load('./textures/fabric/alpha.jpg');
const fabricAoTexture = textureLoader.load('./textures/fabric/ao.jpg');
const fabricHightTexture = textureLoader.load(
  './textures/fabric/hightlight.jpg'
);
const roughnessTexture = textureLoader.load('./textures/fabric/roughness.jpg');
const metalnessTexture = textureLoader.load('./textures/fabric/metalness.jpg');
const normalTexture = textureLoader.load('./textures/fabric/normal.jpg');

// const texture = textureLoader.load('./textures/fabric/filter.png');
// texture.minFilter = THREE.NearestFilter;
// texture.magFilter = THREE.NearestFilter;

// texture.minFilter = THREE.LinearFilter;
// texture.magFilter = THREE.LinearFilter;

// fabricColorTexture.offset.x = 0.5;
// fabricColorTexture.offset.y = 0.5;
// fabricColorTexture.offset.set(0.5, 0.5);

// 设置旋转原点
// fabricColorTexture.center.set(0.5, 0.5);
// fabricColorTexture.rotation = Math.PI / 4;

// 水平重复2次，垂直方向3次
// fabricColorTexture.repeat.set(2, 3);
// 设置重复模式
// fabricColorTexture.wrapS = THREE.MirroredRepeatWrapping;
// fabricColorTexture.wrapT = THREE.RepeatWrapping;

// 创建几何体
const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 100, 100, 100);

const material = new THREE.MeshStandardMaterial({
  color: '#ffff00',
  map: fabricColorTexture,
  alphaMap: fabricAlphaTexture,
  aoMap: fabricAoTexture, //  aoMap 需要设置第二组uv
  // aoMapIntensity: 0.5,
  transparent: true,
  displacementMap: fabricHightTexture,
  displacementScale: 0.1,
  roughness: 1,
  roughnessMap: roughnessTexture,
  metalness: 1,
  metalnessMap: metalnessTexture,
  normalMap: normalTexture,
  // opacity: 0.5,
  // side: THREE.DoubleSide,
  // map: texture,
});

const cube = new THREE.Mesh(cubeGeometry, material);
scene.add(cube);
cubeGeometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2)
);

const planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 200, 200);

const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(1.5, 0, 0);
scene.add(plane);

planeGeometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
);

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
