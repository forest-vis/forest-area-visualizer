import * as THREE from "three";
import ThreeUtils from "../utils/ThreeUtils";


class TestBoxObject extends THREE.Group {

    constructor() {
        super();

        let geo = new THREE.BoxGeometry(.5, .5, .5);
        let mat = new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0xff0000,
            // map: AssetsLoaderController.assets.test_uv
        });
        this.box = new THREE.Mesh(geo, mat);
        super.add(this.box);
    }

    destory() {
        super.remove(this.backPlane);
        ThreeUtils.disposeHierchy(this.box)
    }


}

export default TestBoxObject;

