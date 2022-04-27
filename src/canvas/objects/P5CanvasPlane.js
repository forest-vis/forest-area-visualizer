import * as THREE from "three";

import gsap, { Linear, Quart } from "gsap/all";
import AssetsLoaderController from "../controllers/AssetsLoaderController";
import ThreeUtils from "../utils/ThreeUtils";

import CameraController from "../controllers/CameraController";
import CanvasManager from "../managers/CanvasManager";

import P5CanvasPlaneFrag from "../shaders/P5CanvasPlane.frag"
import P5CanvasPlaneVert from "../shaders/P5CanvasPlane.vert"
import HeightPlaneFrag from "../shaders/HeightPlane.frag"
import HeightPlaneVert from "../shaders/HeightPlane.vert"


// ES6:
import * as dat from 'dat.gui';
import { P5Canvas2Manager } from "../commons/createP5ver2";


class P5CanvasPlane extends THREE.Group {

    constructor(tex, countryName) {
        super();

        this.meshes = [];

        const mapLineTexture = new THREE.TextureLoader().load('/Assets/data/' + countryName + '_line.png');
        const mapWorldTexture = new THREE.TextureLoader().load('/Assets/data/' + countryName + '_line_wide.png');
        const maskTexture = new THREE.TextureLoader().load('/Assets/T_Mask.png');

        let geo = new THREE.PlaneGeometry(1, 1);
        let mat = new THREE.MeshBasicMaterial({
            // wireframe: true,
            color: 0xffffff,
            transparent: true,
            // map: AssetsLoaderController.assets.uv_test
            map: tex
        });
        this.mesh = new THREE.Mesh(geo, mat);
        this.mesh.position.set(0, 0.0, 0);
        this.mesh.rotation.set(-3.14 / 2, 0, 0);
        // super.add(this.mesh);

        let geo2 = new THREE.PlaneGeometry(1, 1);
        let mat2 = new THREE.MeshBasicMaterial({
            // wireframe: true,
            transparent: true,
            // depthWrite: false,
            color: 0xffffff,
            map: mapLineTexture,
        });
        this.mesh2 = new THREE.Mesh(geo2, mat2);
        this.mesh2.position.set(0, 0.0, 0);
        this.mesh2.rotation.set(-3.14 / 2, 0, 0);
        super.add(this.mesh2);
        this.meshes.push(this.mesh2);

        let geo22 = new THREE.PlaneGeometry(1, 1);
        let mat22 = new THREE.MeshBasicMaterial({
            // wireframe: true,
            transparent: true,
            // depthWrite: false,
            color: 0x334433,
            map: mapLineTexture,
        });
        this.mesh22 = new THREE.Mesh(geo22, mat22);
        this.mesh22.position.set(0, -0.01, 0);
        this.mesh22.rotation.set(-3.14 / 2, 0, 0);
        super.add(this.mesh22);
        this.meshes.push(this.mesh22);



        let geo3 = new THREE.PlaneGeometry(2, 2);
        let mat3 = new THREE.MeshBasicMaterial({
            // wireframe: true,
            transparent: true,
            // depthWrite: false,
            color: 0xffffff,
            alphaMap: maskTexture,
            map: mapWorldTexture
        });
        this.mesh3 = new THREE.Mesh(geo3, mat3);
        this.mesh3.position.set(0, -0.001, 0);
        this.mesh3.rotation.set(-3.14 / 2, 0, 0);
        super.add(this.mesh3);
        this.meshes.push(this.mesh3);

        let geo33 = new THREE.PlaneGeometry(2, 2);
        let mat33 = new THREE.MeshBasicMaterial({
            // wireframe: true,
            transparent: true,
            // depthWrite: false,
            color: 0x334433,
            alphaMap: maskTexture,
            map: mapWorldTexture
        });
        this.mesh33 = new THREE.Mesh(geo33, mat33);
        this.mesh33.position.set(0, -0.011, 0);
        this.mesh33.rotation.set(-3.14 / 2, 0, 0);
        super.add(this.mesh33);
        this.meshes.push(this.mesh33);

        const canvasTex2 = new THREE.Texture(P5Canvas2Manager.getCanvasElement())

        this.planes = [];
        // for (let i = 0; i < 1; i++) {
        for (let i = 0; i < 20; i++) {
            const mesh3 = new THREE.Mesh(
                new THREE.PlaneGeometry(1, 1, 1, 1),
                // new THREE.MeshBasicMaterial({
                //     // wireframe: true,
                //     color: 0xffffff * i / 10.0,
                //     transparent: true,
                //     opacity: (10 - i) / 10.0,
                //     // map: AssetsLoaderController.assets.uv_test
                //     map: this.mesh.material.map
                // })
                new THREE.ShaderMaterial({
                    vertexShader: P5CanvasPlaneVert,
                    fragmentShader: P5CanvasPlaneFrag,
                    uniforms: {
                        time: { value: 0 },
                        index: { value: i },
                        texture1: { value: tex },
                        texture2: { value: canvasTex2 },
                        // heightMap: { value: AssetsLoaderController.assets.madagascar_height },
                        heightScale: { value: 0.02 },
                        // fade: { value: (10 - i) / 10.0 },
                        fade: { value: 1.0 },
                    },
                    // side: THREE.DoubleSide,
                    transparent: true,
                    depthWrite: false,
                    // wireframe: true,
                    // opacity: (10 - i) / 10.0,
                    alphaTest: 0.9,

                    // blending: THREE.AdditiveBlending, // ブレンドモード
                })
            );
            mesh3.position.set(0, -0.0012 * (i - 10 + (i == 10 ? 1 : 0)), 0);
            mesh3.rotation.set(-3.14 / 2, 0, 0);
            super.add(mesh3);
            this.planes.push(mesh3);
            this.meshes.push(mesh3);
        }

        // var params = {
        //     value: 0,
        //     height: 0
        // };
        // var gui = new dat.GUI();
        // gui.add(params, 'height', 0.0, 0.1).step(0.001).name("height").onChange(v => {
        //     // console.log(v)
        //     this.planes.forEach(element => {
        //         element.material.uniforms.heightScale.value = v;
        //     });

        //     // this.heightMesh.material.uniforms.heightScale.value = v;
        // });
        // gui.add(params, 'value', 0.0, 1.0).step(0.001).name("crossWidth").onChange(v => {
        //     // console.log(v)
        //     this.planes.forEach((element, i) => {
        //         element.position.set(0, -0.015 * (i - 10 + (i == 10 ? 1 : 0)) * v, 0);
        //     })
        // });

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
        this.meshes.forEach(m => {
            super.remove(m);
            ThreeUtils.disposeHierchy(m)
        })

        ThreeUtils.disposeHierchy(this.mesh);
    }

    update(step) {

        step /= 1000.0;
        this.intervalId = requestAnimationFrame(step => this.update(step));

        if (this.mesh.material.map.image != undefined) {
            this.mesh.material.map.needsUpdate = true;
        }
        this.planes.forEach(element => {
            element.material.uniforms.time.value = step;
            element.material.uniforms.texture2.value.needsUpdate = true;
        });

        // console.log(step);
    }



}

export default P5CanvasPlane;

