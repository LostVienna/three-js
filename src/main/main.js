import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import gsap from 'gsap';

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
  85,
  window.innerWidth / window.innerHeight,
  0.1,
  300
);

// 设置相机位置
camera.position.set(0, 0, 18); // x y z 轴
scene.add(camera);

const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
const cubeMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
});
const redMaterial = new THREE.MeshBasicMaterial({ color: '#ff0000' });

let cubeArr = [];
const cubeGround = new THREE.Group();
for (let x = 0; x < 5; x++) {
  for (let y = 0; y < 5; y++) {
    for (let z = 0; z < 5; z++) {
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.set(x * 2 - 4, y * 2 - 4, z * 2 - 4);
      cubeGround.add(cube);
      cubeArr.push(cube);
    }
  }
}
scene.add(cubeGround);
// 创建投射光线对象
const raycaster = new THREE.Raycaster();

// 鼠标位置对象
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);

  raycaster.setFromCamera(mouse, camera);

  const result = raycaster.intersectObjects(cubeArr);
  result[0].object.material = redMaterial;
  // result.forEach((item) => {
  //   item.object.material = redMaterial;
  // });
});

// 三角形
const sjxGrounp = new THREE.Group();
for (let x = 0; x < 50; x++) {
  const geometry = new THREE.BufferGeometry();
  const positionArr = new Float32Array(9);
  for (let y = 0; y < 9; y++) {
    if (y % 3 == 1) {
      positionArr[y] = Math.random() * 10 - 5;
    } else {
      positionArr[y] = Math.random() * 10 - 5;
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positionArr, 3));
  // 创建材质
  const color = new THREE.Color(Math.random(), Math.random(), Math.random());
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  sjxGrounp.add(mesh);
}
sjxGrounp.position.set(0, -30, 0);
scene.add(sjxGrounp);

// 弹跳小球
const ballGrounp = new THREE.Group();

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const material = new THREE.MeshStandardMaterial();

const sphere = new THREE.Mesh(sphereGeometry, material);
// 投射阴影
sphere.castShadow = true;

ballGrounp.add(sphere);

// 创建平面
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;

// 接收阴影
plane.receiveShadow = true;

ballGrounp.add(plane);

const smallBall = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
smallBall.position.set(2, 2, 2);

// 灯光
// 环境光
// const light = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(light);

const pointLight = new THREE.PointLight(0xff0000, 20);
pointLight.position.set(2, 2, 2);

pointLight.castShadow = true;

// 阴影贴图模糊度
pointLight.shadow.radius = 20;
// 阴影贴图分辨率
pointLight.shadow.mapSize.set(512, 512);

smallBall.add(pointLight);
ballGrounp.add(smallBall);

ballGrounp.position.set(0, -60, 0);
scene.add(ballGrounp);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });

renderer.physicallyCorrectLights = true;

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
// const controls = new OrbitControls(camera, renderer.domElement);
// // 增加阻尼，拖动具有惯性效果
// controls.enableDamping = true;

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

gsap.to(cubeGround.position, {
  z: `+=${Math.PI}`,
  x: `+=${Math.PI}`,
  duration: 6,
  ease: 'power2.inOut',
  repeat: -1,
  yoyo: true,
});

gsap.to(sjxGrounp.position, {
  z: `+=${Math.PI}`,
  x: `-=${Math.PI}`,
  duration: 6,
  ease: 'power2.inOut',
  repeat: -1,
  yoyo: true,
});

gsap.to(smallBall.position, {
  x: -3,
  duration: 6,
  ease: 'power2.inOut',
  repeat: -1,
  yoyo: true,
});
gsap.to(smallBall.position, {
  y: 0,
  duration: 0.5,
  ease: 'power2.inOut',
  repeat: -1,
  yoyo: true,
});

window.addEventListener('mouseover', (event) => {
  mouse.x = event.clientX / window.innerWidth - 0.5;
  mouse.y = event.clientY / window.innerHeight - 0.5;
});

const clock = new THREE.Clock();
function render() {
  // controls.update();
  const deltaTime = clock.getDelta();
  // cubeGround.rotation.x = time * 0.5;
  // cubeGround.rotation.y = time * 0.5;

  // sjxGrounp.rotation.x = time * 0.4;
  // sjxGrounp.rotation.y = time * 0.3;

  // smallBall.position.x = Math.sin(time) * 3;
  // smallBall.position.z = Math.cos(time) * 3;
  // smallBall.position.y = 2 + Math.sin(time * 5);
  // ballGrounp.rotation.z = Math.sin(time) * 0.1;
  // ballGrounp.rotation.x = Math.sin(time) * 0.1;
  camera.position.y = -(window.scrollY / window.innerHeight) * 30;
  camera.position.x += (mouse.x * 10 - camera.position.x) * deltaTime * 5;
  // camera.position.x += mouse.x * 10 * deltaTime;

  renderer.render(scene, camera);
  // 渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

let currentPage = 0;
const groupArr = [cubeGround, sjxGrounp, ballGrounp];
window.addEventListener('scroll', () => {
  const newPage = Math.round(window.scrollY / window.innerHeight);
  if (newPage != currentPage) {
    currentPage = newPage;
    console.log('页面更该', currentPage);

    gsap.to(groupArr[currentPage].rotation, {
      z: `+=${Math.PI * 2}`,
      x: `+=${Math.PI * 2}`,
      duration: 2,
      onComplete() {
        console.log('旋转完成');
      },
    });

    gsap.fromTo(
      `.page${currentPage + 1} h1`,
      {
        x: -300,
      },
      {
        x: 0,
        rotate: '+=360',
        duration: 1.5,
      }
    );
  }
});

render();
