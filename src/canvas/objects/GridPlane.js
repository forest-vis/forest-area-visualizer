import * as THREE from "three";
import * as dat from 'dat.gui';


import gsap, { Linear, Quart } from "gsap/all";
import AssetsLoaderController from "../controllers/AssetsLoaderController";
import ThreeUtils from "../utils/ThreeUtils";

import GridPlaneFrag from "../shaders/GridPlane.frag"
import GridPlaneVert from "../shaders/GridPlane.vert"


var Params = function () {
    this.value = 0.5;
    this.speed = 0.8;
    this.flag = false;
};




class GridPlane extends THREE.Group {

    constructor() {
        super();


        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 4),
            // new THREE.PlaneGeometry(1, 1),
            // new THREE.MeshBasicMaterial({
            //     // wireframe: true,
            //     color: 0xffffff * i / 10.0,
            //     transparent: true,
            //     opacity: (10 - i) / 10.0,
            //     // map: AssetsLoaderController.assets.uv_test
            //     map: this.mesh.material.map
            // })
            new THREE.ShaderMaterial({
                vertexShader: GridPlaneVert,
                fragmentShader: GridPlaneFrag,
                uniforms: {
                    time: { value: 0 },
                    // texture1: { value: tex },
                    // fade: { value: (10 - i) / 10.0 },
                    fade: { value: 0.13 },

                    crossWidth: { value: 0.0003 },
                    crossRepeat: { value: 0.08 },
                    crossSize: { value: 0.0012 },

                    gridWidth: { value: 0.02 },
                    gridRpeat: { value: 0.01 },
                    gridFade: { value: 0.1 },
                },
                // side: THREE.DoubleSide,
                transparent: true,
                depthWrite: false
                // wireframe: true
                // opacity: (10 - i) / 10.0,
                // alphaTest: 0.9
            })
        );
        this.mesh.rotation.set(-3.14 / 2, 0, 0);
        super.add(this.mesh);

        // var params = new Params();
        // var gui = new dat.GUI();
        // // gui.add(this.mesh.material.uniforms.crossSize, 'value', 0.0, 0.125);
        // gui.add(this.mesh.material.uniforms.crossWidth, 'value', 0.0, 0.0025).name("crossWidth");
        // gui.add(this.mesh.material.uniforms.crossRepeat, 'value', 0.0, 0.1).name("crossRepeat");
        // gui.add(this.mesh.material.uniforms.crossSize, 'value', 0.0, 0.0125).name("crossSize");
        // gui.add(this.mesh.material.uniforms.fade, 'value', 0.0, 1.0).name("fade");


        // gui.add(this.mesh.material.uniforms.gridWidth, 'value', 0.0, 0.1).name("gridWidth");
        // gui.add(this.mesh.material.uniforms.gridRpeat, 'value', 0.0, 0.1).name("gridRpeat");
        // gui.add(this.mesh.material.uniforms.gridFade, 'value', 0.0, 1.0).name("gridFade");

    }

    show() {
        cancelAnimationFrame(this.intervalId);
        this.intervalId = requestAnimationFrame(step => this.update(step));

    }

    hide() {
        cancelAnimationFrame(this.intervalId);
    }

    destory() {

        cancelAnimationFrame(this.intervalId);
        super.remove(this.mesh);
        ThreeUtils.disposeHierchy(this.mesh)
    }

    update(step) {

        step /= 1000.0;
        this.intervalId = requestAnimationFrame(step => this.update(step));

        this.mesh.material.uniforms.time.value = step;
        // this.mesh2.material.map.needsUpdate = true;

        // this.p5CanvasPlaneUniforms
        // this.p5CanvasPlaneUniforms.texture1.value.needsUpdate = true;

    }



}

export default GridPlane;

