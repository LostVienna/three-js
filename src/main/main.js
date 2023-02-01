import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

import vertexShader from '../shader/flylight/vertex.glsl';
import fragmentShader from '../shader/flylight/fragment.glsl';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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

// 创建纹理加载器对象
const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync('./assets/2k.hdr').then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  // transparent: true,
  side: THREE.DoubleSide,
  uniforms: {},
});

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });

// 开启环境中的阴影贴图
// renderer.shadowMap.enabled = true;

// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.BasicShadowMap;
// renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMapping = THREE.LinearToneMapping;
// renderer.toneMapping = THREE.ReinhardToneMapping;
// renderer.toneMapping = THREE.CineonToneMapping;
renderer.toneMappingExposure = 0.2;

const gltfLoader = new GLTFLoader();
let LightBox = null;
gltfLoader.load('./assets/model/flyLight.glb', (gltf) => {
  scene.add(gltf.scene);
  LightBox = gltf.scene.children[0];
  LightBox.material = shaderMaterial;

  for (let index = 0; index < 150; index++) {
    let flyLight = gltf.scene.clone(true);
    let x = (Math.random() - 0.5) * 300;
    let z = (Math.random() - 0.5) * 300;
    let y = Math.random() * 60 + 25;
    flyLight.position.set(x, y, z);

    gsap.to(flyLight.rotation, {
      y: 2 * Math.PI,
      duration: 10 + Math.random() * 30,
      repeat: -1,
    });
    gsap.to(flyLight.position, {
      x: '+=' + Math.random() * 5,
      y: '+=' + Math.random() * 20,
      yoyo: true,
      duration: 5 + Math.random() * 10,
      repeat: -1,
    });

    scene.add(flyLight);
  }
});

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
// 设置自动旋转
controls.autoRotate = true;
controls.autoRotateSpeed = 2;
controls.maxPolarAngle = (Math.PI / 3) * 2;
controls.minPolarAngle = (Math.PI / 3) * 2;
// 添加坐标轴
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

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

  renderer.render(scene, camera);
  // 渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();
