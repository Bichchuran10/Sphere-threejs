import * as THREE from "three";
import gsap from "gsap";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//Scene
const scene = new THREE.Scene();

//Create our sphere
const geometry = new THREE.SphereGeometry(3, 64, 64); //radius,segments(width,height) ->clay,just the shape let's say
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.5,
}); //how it looks like

const mesh = new THREE.Mesh(geometry, material); //(an object that takes a geometry and applies material to it)
scene.add(mesh);

//sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
//light
const light = new THREE.PointLight(0xffffff, 100);
light.position.set(0, 10, 10);
light.intensity = 40;
scene.add(light);

//Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
); //field of view (extent of the scene that is seen on the display), (aspect ratio(innerWidth/innerHeight)),near clipping point,far clipping
camera.position.z = 20;
scene.add(camera);

//Renderer (used to display the scene to us)
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGL1Renderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;
//Resize
window.addEventListener("resize", () => {
  //update sizes
  console.log(window.innerWidth);
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  // mesh.position.x += 0.2;
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};

loop();

//timeline magicc
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

//mouse Animation color
let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageX / sizes.width) * 255),
      150,
    ];
    console.log(rgb);
  }

  //animate
  let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
  gsap.to(mesh.material.color, {
    r: newColor.r,
    g: newColor.g,
    b: newColor.b,
  });
});
