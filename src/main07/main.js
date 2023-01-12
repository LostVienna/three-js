import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as CANNON from 'cannon-es';
import { Mesh } from 'three';

const audio = new Audio('../assets/audio/hit.mp3');
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
  85,
  window.innerWidth / window.innerHeight,
  0.1,
  300
);

// 设置相机位置
camera.position.set(0, 0, 18); // x y z 轴
scene.add(camera);

const floor = new Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ side: THREE.DoubleSide })
);

floor.rotation.x = -Math.PI / 2;
floor.position.set(0, -5, 0);

floor.receiveShadow = true;
scene.add(floor);

// 创建物理世界
// const world = new CANNON.World({ gravity: 9.8 });

const world = new CANNON.World();
world.gravity.set(0, -9.8, 0);

const cubeArr = [];
const cubeWorldMaterail = new CANNON.Material('cube');

function createCube() {
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial = new THREE.MeshStandardMaterial();
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
  scene.add(cube);

  // 创建物理小球形状
  const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));

  const cubeBody = new CANNON.Body({
    shape: cubeShape,
    position: new CANNON.Vec3(0, 0, 0),

    // 质量
    mass: 1,
    material: cubeWorldMaterail,
  });
  cubeBody.applyLocalForce(
    new CANNON.Vec3(500, 0, 0), // 添加力的大小和方向
    new CANNON.Vec3(0, 0, 0) // 施加力所在的位置
  );
  world.addBody(cubeBody);

  cubeArr.push({
    cubeBody,
    mesh: cube,
  });

  // 监听碰撞
  cubeBody.addEventListener('collide', (e) => {
    const impactDtrenght = e.contact.getImpactVelocityAlongNormal();
    console.log(impactDtrenght);
    audio.currentTime = 0;
    // audio.volume = impactDtrenght / 12; // 设置声量随碰撞减弱
    audio.volume = Math.random(); // 设置声量随碰撞减弱
    audio.play();
  });
}

// 创建物理地面
const floorShape = new CANNON.Plane();
const floorWorldMaterail = new CANNON.Material('floor');
const floorBody = new CANNON.Body({
  shape: floorShape,
  mass: 0, // 质量为0，物体保持不动
  position: new CANNON.Vec3(0, -5, 0),
  material: floorWorldMaterail,
});

floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

world.addBody(floorBody);

// 关联材质
const defaultContactMaterail = new CANNON.ContactMaterial(
  cubeWorldMaterail,
  floorWorldMaterail,
  {
    friction: 0.1, // 摩擦力
    restitution: 0.7, // 弹性
  }
);

world.addContactMaterial(defaultContactMaterail);

// 设置world默认材质

// 添加环境光和平行光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight();
dirLight.castShadow = true;
scene.add(dirLight);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });

// 开启环境中的阴影贴图
renderer.shadowMap.enabled = true;

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

const clock = new THREE.Clock();
function render() {
  controls.update();
  const deltaTime = clock.getDelta();

  world.step(1 / 120, deltaTime);

  cubeArr.forEach((item) => {
    item.mesh.position.copy(item.cubeBody.position);
    // 设置渲染的物体随物理的物体旋转
    item.mesh.quaternion.copy(item.cubeBody.quaternion);
  });

  renderer.render(scene, camera);
  // 渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

window.addEventListener('click', createCube);
render();
