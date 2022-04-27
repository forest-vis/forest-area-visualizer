import gsap, { Linear, Quart } from "gsap/all";
import * as THREE from "three";
import * as dat from 'dat.gui';

import ThreeUtils from "../utils/ThreeUtils";

import instancingFrag from "../shaders/GraphParticleInstancing.frag"
import instancingVert from "../shaders/GraphParticleInstancing.vert"
import CameraController from "../controllers/CameraController";
import ForestTextEffect from "./ForestTextEffect";
import CommonTextEffect from "./CommonTextEffect";

function getImageData(image) {


    var canvas = document.createElement('canvas');
    canvas.width = image.width / 40;
    canvas.height = image.height / 40;

    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return context.getImageData(0, 0, canvas.width, canvas.height);

}

function getPixel(imagedata, x, y) {
    var position = (x + imagedata.width * y) * 4, data = imagedata.data;
    return { r: data[position], g: data[position + 1], b: data[position + 2], a: data[position + 3] };

}


export default class GraphParticleInstancing extends THREE.Group {

    constructor(canvasTex, filledCanvasTexture, countryName) {
        super();

        this.meshes = [];


        // let geo2 = new THREE.PlaneGeometry(1, 1);
        // let mat2 = new THREE.MeshBasicMaterial({
        //     // wireframe: true,
        //     transparent: true,
        //     opacity: 0.4,
        //     // depthWrite: false,
        //     // color: 0xff0000,
        //     color: 0xffffff,
        //     // color: 0x333333,
        //     map: AssetsLoaderController.assets.canvas_test
        //     // map: this.mesh.material.map
        // });
        // this.mesh2 = new THREE.Mesh(geo2, mat2);
        // this.mesh2.position.set(0, 0.01, 0);
        // this.mesh2.rotation.set(-3.14 / 2, 0, 0);
        // super.add(this.mesh2);


        // var imagedata = getImageData(canvasTex);
        var imagedata = getImageData(filledCanvasTexture.image);

        const TEXTURE_SIZE = imagedata.width;
        console.log("width:" + imagedata.width);
        console.log("height:" + imagedata.height);
        console.log("NUM:" + NUM);

        let tmp = [];
        let indexR = 0, indexG = 0;
        for (let ix = 0; ix < imagedata.width; ix++) {
            for (let iy = 0; iy < imagedata.height; iy++) {
                var color = getPixel(imagedata, ix, iy);
                // tmp.push({x:ix})
                // console.log(color.a);
                if (color.a != 0.0) tmp.push({
                    x: ix / imagedata.width - 0.5,
                    y: iy / imagedata.height - 0.5,
                    color: color.r > color.g ? 1.0 : 0.0,
                    index: color.r > color.g ? indexR++ : indexG++
                });
            }
        }


        // for (let ix = 20; ix < 60; ix++) {
        //     for (let iy = 20; iy < 60; iy++) {
        //         var color = getPixel(imagedata, ix, iy);
        //         // tmp.push({x:ix})
        //         console.log(color);
        //         // if (color.a != 0.0) tmp.push(color);
        //     }
        // }
        // var color = getPixel(imagedata, 101 / 2 + 2, 101 / 2 + 1);
        // console.log(color);
        // console.log();

        const dataTextureSize = Math.ceil(Math.sqrt(tmp.length));
        const size = dataTextureSize * dataTextureSize;
        const data = new Float32Array(4 * size);

        for (let i = 0; i < size; i++) {
            if (i >= tmp.length) continue;
            const stride = i * 4;
            data[stride + 0] = tmp[i].x;
            data[stride + 1] = tmp[i].y;
            data[stride + 2] = tmp[i].color;
            data[stride + 3] = tmp[i].index;
        }


        console.log("tmp len:" + tmp.length)
        console.log("dataTextureSize:" + dataTextureSize)

        // used the buffer to create a DataTexture
        const dataTexture = new THREE.DataTexture(data, dataTextureSize, dataTextureSize, THREE.RGBAFormat, THREE.FloatType);
        dataTexture.needsUpdate = true;

        const NUM = tmp.length;

        const originBox = new THREE.BoxBufferGeometry(.7, .7, .7);
        // const originBox = new THREE.SphereBufferGeometry(1, 16, 16);
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
            frame: { value: 0 },
            scaleIn: { value: 0 },
            texture1: { value: canvasTex },
            texture2: { value: filledCanvasTexture },
            dataTexture: { value: dataTexture },
            fade: { value: 0 },
            textureSize: { value: TEXTURE_SIZE },
            dataTextureSize: { value: dataTextureSize },
            totalNum: { value: NUM },
        }
        this.uniforms.texture1.value.needsUpdate = true;
        this.uniforms.texture2.value.needsUpdate = true;

        const mat = new THREE.ShaderMaterial({
            vertexShader: instancingVert,
            fragmentShader: instancingFrag,
            uniforms: this.uniforms,
            // side: THREE.DoubleSide,
            transparent: true,
            wireframe: true,
            // blending: THREE.AdditiveBlending, // ブレンドモード

        })
        this.mesh = new THREE.Mesh(geo, mat);
        this.mesh.frustumCulled = false;
        this.mesh.position.set(0, 0., 0)

        super.add(this.mesh);
        this.meshes.push(this.mesh);

        // var gui = new dat.GUI();
        // gui.add(this.uniforms.frame, 'value', 0.0, 10.0).step(0.001).name("frame");
        // gui.add(this.uniforms.scaleIn, 'value', 0.0, 1.0).step(0.001).name("scaleIn");
        // this.uniforms.frame.value = 10.0;
        // this.uniforms.scaleIn.value = 1.0;//
        // this.loop();

        const lossPer = Math.floor(indexR / tmp.length * 100.0);
        const keepPer = Math.floor(indexG / tmp.length * 100.0);

        this.commonTextEffect = new CommonTextEffect(lossPer + "% Loss", 0.5, "0%", 0xdb1102);
        this.commonTextEffect.position.set(0.5 + 0.025, 0.2 - 0.004, 0.0)
        super.add(this.commonTextEffect);

        this.commonTextEffect2 = new CommonTextEffect((100 - lossPer) + "% No Change", 0.5, "100%", 0x22a000);
        this.commonTextEffect2.position.set(-0.5 - 0.025, 0.2 - 0.004, 0.0)
        super.add(this.commonTextEffect2);

        this.commonTextEffect3 = new CommonTextEffect("Forest Change in " + countryName + " 2000 - 2020", 0.5, "50%", 0xffffff);
        this.commonTextEffect3.position.set(0.0, 0.34, 0.0)
        super.add(this.commonTextEffect3);

        this.delayedCalls = [];

        // this.commonTextEffect.show();
        // this.commonTextEffect2.show();
        // this.commonTextEffect3.show();
        // this.uniforms.frame.value = 8.0;
        // this.uniforms.scaleIn.value = 1.0;

    }

    act() {

        this.uniforms.frame.value = 0.0;
        this.uniforms.scaleIn.value = 0.0;
        gsap.killTweensOf(this.uniforms.frame);
        gsap.to(this.uniforms.scaleIn, {
            duration: 4.0, value: 1, ease: Quart.easeInOut,
            onComplete: () => {
                gsap.to(this.uniforms.frame, {
                    duration: 4.0, value: 4, ease: Quart.easeInOut,
                    onComplete: () => {
                        const delayedCall1 = gsap.delayedCall(3.2, () => {
                            this.commonTextEffect3.show();
                        })
                        const delayedCall2 = gsap.delayedCall(4.2, () => {
                            this.commonTextEffect.show();
                            this.commonTextEffect2.show();
                        })
                        this.delayedCalls.push(delayedCall1)
                        this.delayedCalls.push(delayedCall2)

                        gsap.to(this.uniforms.frame, {
                            duration: 4.0, value: 8, ease: Quart.easeInOut,
                            onComplete: () => {

                                // gsap.delayedCall(2.0, () => {
                                //     this.loop();
                                // });
                            }
                        });
                    }
                });
            },
        });
    }

    show() {
        this.act();

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

        gsap.killTweensOf(this.uniforms.fade);
        gsap.killTweensOf(this.uniforms.frame);

        cancelAnimationFrame(this.intervalId);

        this.delayedCalls.forEach(c => {
            c.kill();
        })

        super.remove(this.commonTextEffect);
        this.commonTextEffect.destory()

        super.remove(this.commonTextEffect2);
        this.commonTextEffect2.destory()

        super.remove(this.commonTextEffect3);
        this.commonTextEffect3.destory()

        this.meshes.forEach(m => {
            super.remove(m);
            ThreeUtils.disposeHierchy(m)
        })

    }

    update(step) {

        step /= 1000.0;

        this.intervalId = requestAnimationFrame(step => this.update(step));
        this.uniforms.time.value = step;

        // this.lookAt(CameraController.camera.position)

    }


}
