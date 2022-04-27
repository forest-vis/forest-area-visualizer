import gsap, { Linear, Quart } from "gsap/all";
import * as THREE from "three";
import AssetsLoaderController from "../controllers/AssetsLoaderController";
import ThreeUtils from "../utils/ThreeUtils";

import instancingFrag from "../shaders/LeadLineInstancing.frag"
import instancingVert from "../shaders/LeadLineInstancing.vert"


export default class LeadLineInstancingObject extends THREE.Group {

    constructor(canvasTex) {
        super();

        const NUM = 4096;

        const originBox = new THREE.BoxBufferGeometry(1, 1, 1);
        const position = originBox.attributes.position.clone();
        const normals = originBox.attributes.normal.clone();
        const uv = originBox.attributes.uv.clone();
        const indices = originBox.index.clone();

        const geo = new THREE.InstancedBufferGeometry();
        geo.setAttribute('position', position);
        geo.setAttribute('normal', normals);
        geo.setAttribute('uv', uv);
        geo.setIndex(indices);

        const instanceIndex = new THREE.InstancedBufferAttribute(new Float32Array(NUM * 1), 1, false, 1);
        for (let i = 0; i < NUM; i++) {
            instanceIndex.setX(i, i * 2.0);
        }
        geo.setAttribute('index', instanceIndex);

        this.uniforms =
        {
            time: { value: 0 },
            texture1: { value: canvasTex },
            fade: { value: 0 },
        }
        this.uniforms.texture1.value.needsUpdate = true;

        const mat = new THREE.ShaderMaterial({
            vertexShader: instancingVert,
            fragmentShader: instancingFrag,
            uniforms: this.uniforms,
            // side: THREE.DoubleSide,
            transparent: true,
            // wireframe: true,
            depthWrite: false

        })
        this.mesh = new THREE.Mesh(geo, mat);
        this.mesh.frustumCulled = false;
        this.mesh.position.set(0, 0., 0)

        super.add(this.mesh);

    }

    show() {

        cancelAnimationFrame(this.intervalId);
        this.intervalId = requestAnimationFrame(step => this.update(step));

        gsap.killTweensOf(this.uniforms.fade);
        gsap.to(this.uniforms.fade, {
            duration: 1.0, value: 1, ease: Quart.easeOut
        });

    }

    hide() {

        gsap.killTweensOf(this.uniforms.fade);
        gsap.to(this.uniforms.fade, {
            duration: 1.0, value: 0, ease: Quart.easeOut,
            onComplete: () => {
                cancelAnimationFrame(this.intervalId);
            }
        });

    }

    destory() {
        cancelAnimationFrame(this.intervalId);
        super.remove(this.mesh);
        ThreeUtils.disposeHierchy(this.mesh)
    }

    update(step) {

        step /= 1000.0;

        this.intervalId = requestAnimationFrame(step => this.update(step));
        this.uniforms.time.value = step;

    }


}
