import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default init;

function init(dpr) {
  let width, height;

  width = window.innerWidth;
  height = window.innerHeight;

  const renderer = new THREE.WebGLRenderer({
    canvas: document.createElement("canvas"),
    antialias: true, // default false
    // preserveDrawingBuffer: true
  });

  // renderer.autoClearColor = false;
  // renderer.setClearColor(0x000000, 0.0);
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(width, height);
  renderer.setPixelRatio(dpr);
  // window.renderer = renderer;

  const scene = new THREE.Scene();

  // const camera = new THREE.OrthographicCamera( 1 / - 2, 1 / 2, 1 / 2, 1 / - 2, 1, 1000 )
  // camera.position.set(0, 0, 1)

  const camera = new THREE.PerspectiveCamera(35, width / height, 0.01, 1100);
  // camera.position.set(0, 0, 0.01);
  // camera.lookAt(new THREE.Vector3());


  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.enableDamping = true;
  controls.rotateSpeed = 0.25;

  window.addEventListener("resize", resize);

  return {
    renderer,
    scene,
    // controls,
    camera
  };

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;

    if (!renderer) return;

    renderer.setSize(width, height);
    renderer.setViewport(0, 0, width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}
