import * as THREE from "three";

export default class ThreeUtils {


    static disposeNode(node) {
        if (node instanceof THREE.Mesh) {

            if (node.geometry) {
                node.geometry.dispose();
                node.geometry = undefined;
            }

            if (node.material) {
                if (node.material instanceof THREE.MeshFaceMaterial || node.material instanceof THREE.MultiMaterial) {
                    node.material.materials.forEach(function (mtrl, idx) {
                        if (mtrl.map) mtrl.map.dispose();
                        if (mtrl.lightMap) mtrl.lightMap.dispose();
                        if (mtrl.bumpMap) mtrl.bumpMap.dispose();
                        if (mtrl.normalMap) mtrl.normalMap.dispose();
                        if (mtrl.specularMap) mtrl.specularMap.dispose();
                        if (mtrl.envMap) mtrl.envMap.dispose();

                        mtrl.dispose();
                        mtrl = null;
                    });
                }
                else {
                    if (node.material.map) node.material.map.dispose();
                    if (node.material.lightMap) node.material.lightMap.dispose();
                    if (node.material.bumpMap) node.material.bumpMap.dispose();
                    if (node.material.normalMap) node.material.normalMap.dispose();
                    if (node.material.specularMap) node.material.specularMap.dispose();
                    if (node.material.envMap) node.material.envMap.dispose();

                    node.material.dispose();
                    node.material = null;
                }
            }
        }
        // console.log('node before removal: ', node);

    }

    static disposeHierchy(node) {
        for (var i = node.children.length - 1; i >= 0; i--) {
            var child = node.children[i];
            this.disposeNode(child,);
        }
    }


}


