import * as THREE from "three";

import gsap, { Linear, Quart } from "gsap/all";
import ThreeUtils from "../utils/ThreeUtils";


class BlackFadePlane extends THREE.Group {

    constructor() {
        super();

        let geo = new THREE.PlaneGeometry(5, 5);
        let mat = new THREE.MeshBasicMaterial({
            // wireframe: true,
            color: 0x000000,
            transparent: true,
            opacity: 0
            // map: tex
        });
        this.mesh = new THREE.Mesh(geo, mat);
        this.mesh.position.set(0, 0.0, 0);
        this.mesh.rotation.set(-3.14 / 2, 0, 0);
        super.add(this.mesh);

    }


    show() {
        gsap.killTweensOf(this.mesh.material)
        gsap.to(this.mesh.material, {
            duration: 3.0, opacity: 1, ease: Quart.easeInOut,
        });
    }

    hide() {

    }

    destory() {

        gsap.killTweensOf(this.mesh.material)
        super.remove(this.mesh);
        ThreeUtils.disposeHierchy(this.mesh)
    }

}

export default BlackFadePlane;

