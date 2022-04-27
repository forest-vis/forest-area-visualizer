import gsap, { Linear, Quart } from "gsap/all";
import * as THREE from "three";
import AssetsLoaderController from "../controllers/AssetsLoaderController";
import ThreeUtils from "../utils/ThreeUtils";

import instancingTemplateFrag from "../shaders/InstancingTemplate.frag"
import instancingTemplateVert from "../shaders/InstancingTemplate.vert"


export default class InstancingObjectTemplate extends THREE.Group {

    constructor() {
        super();

        const NUM = 100;

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
            instanceIndex.setX(i, i);
        }
        geo.setAttribute('index', instanceIndex);

        this.uniforms =
        {
            time: { value: 0 },
            texture1: { value: null },
            fade: { value: 0 },
        }
        // this.uniforms.texture1.value = AssetsLoaderController.assets.test_uv.clone();
        this.uniforms.texture1.value.needsUpdate = true;

        const mat = new THREE.ShaderMaterial({
            vertexShader: instancingTemplateVert,
            fragmentShader: instancingTemplateFrag,
            uniforms: this.uniforms,
            // side: THREE.DoubleSide,
            transparent: true
        })
        this.mesh = new THREE.Mesh(geo, mat);
        this.mesh.frustumCulled = false;
        this.mesh.position.set(0, 1, 0)

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
        super.remove(this.mesh);
        ThreeUtils.disposeHierchy(this.mesh)
    }

    update(step) {

        step /= 1000.0;

        this.intervalId = requestAnimationFrame(step => this.update(step));
        this.uniforms.time.value = step;

    }


}
