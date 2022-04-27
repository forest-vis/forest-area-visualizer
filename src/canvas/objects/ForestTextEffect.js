import * as THREE from "three";

import gsap, { Linear, Quart } from "gsap/all";
import { Text } from 'troika-three-text'

import ThreeUtils from "../utils/ThreeUtils";

import CameraController from "../controllers/CameraController";
import CanvasManager from "../managers/CanvasManager";

import ForestTextEffectFrag from "../shaders/ForestTextEffect.frag"
import ForestTextEffectVert from "../shaders/ForestTextEffect.vert"

class FadeBuffer {
    constructor() {
        this.c = 0;
        this.l = "";
    }
}

class ForestTextEffect extends THREE.Group {

    constructor(text, isCapital) {
        super();

        this.meshes = [];

        this.codeletters = "   .../-";
        // this.codeletters = "-+";
        // this.codeletters = "abcdefghijklmnopqrstuvwxyz1234567890";
        // this.codeletters = "&#*+%?.-_$";
        this.codeletters2 = "        + /";

        this.currentTextLen = 0;
        this.textInfo = null;
        this.targetText = text;
        this.currentText = this.targetText;
        this.isFinished = true;
        this.isKeepRandom = false;
        this.time = 0.0;
        this.prevStep = 0.0;
        this.updateDelay = 0.02;

        this.textHeight = isCapital ? 2 : 1.0;
        this.shuffleCountFactor = 20;

        this.textMat = new THREE.ShaderMaterial({
            vertexShader: ForestTextEffectVert,
            fragmentShader: ForestTextEffectFrag,
            uniforms: {
                time: { value: 0 },
                fade: { value: 1.0 },
                textColor: {
                    value: new THREE.Vector3(
                        255.0 / 255.0 * (isCapital ? 1.0 : 0.75),
                        255.0 / 255.0 * (isCapital ? 1.0 : 0.75),
                        255.0 / 255.0 * (isCapital ? 1.0 : 0.75),
                    )
                }
            },
            side: THREE.DoubleSide,
            transparent: true,
        })
        this.textMat2 = new THREE.ShaderMaterial({
            vertexShader: ForestTextEffectVert,
            fragmentShader: ForestTextEffectFrag,
            uniforms: {
                time: { value: 0 },
                fade: { value: 1.0 },
                textColor: {
                    value: new THREE.Vector3(
                        19.0 / 255.0,
                        76.0 / 255.0,
                        0,
                    )
                }
            },
            side: THREE.DoubleSide,
            transparent: true,
        })
        this.textMat3 = new THREE.ShaderMaterial({
            vertexShader: ForestTextEffectVert,
            fragmentShader: ForestTextEffectFrag,
            uniforms: {
                time: { value: 0 },
                fade: { value: 1.0 },
                textColor: {
                    value: new THREE.Vector3(
                        219.0 / 255.0,
                        18.0 / 255.0,
                        1.0 / 255.0,
                    )
                },
            },
            side: THREE.DoubleSide,
            transparent: true,
        })

        const fontSize = isCapital ? 0.2 : 0.15;
        const FONT_URL = process.env.PUBLIC_URL + "/Assets/font/NunitoSans-Regular.ttf";
        this.shuffleText = new Text()
        this.shuffleText.font = FONT_URL;
        this.shuffleText.fontSize = fontSize;
        this.shuffleText.text = ""
        this.shuffleText.color = 0xffffff;
        this.shuffleText.material = this.textMat;
        this.shuffleText.anchorX = "50%";
        this.shuffleText.anchorY = "50%";
        this.shuffleText.position.set(0, this.textHeight + 0.2, 0.0)
        this.shuffleText.sync()
        super.add(this.shuffleText);

        this.shuffleText2 = new Text()
        this.shuffleText2.font = FONT_URL;
        this.shuffleText2.fontSize = fontSize;
        this.shuffleText2.text = ""
        this.shuffleText2.color = 0xFD5E53
        this.shuffleText2.material = this.textMat2;
        this.shuffleText2.anchorX = "50%";
        this.shuffleText2.anchorY = "50%";
        this.shuffleText2.position.set(0, this.textHeight + 0.2, 0.1)
        this.shuffleText2.sync()
        super.add(this.shuffleText2);

        this.shuffleText3 = new Text()
        this.shuffleText3.font = FONT_URL;
        this.shuffleText3.fontSize = fontSize;
        this.shuffleText3.text = ""
        this.shuffleText3.color = 0xB0EACD
        this.shuffleText3.material = this.textMat3;
        this.shuffleText3.anchorX = "50%";
        this.shuffleText3.anchorY = "50%";
        this.shuffleText3.position.set(0, this.textHeight + 0.2, -0.1)
        this.shuffleText3.sync()
        super.add(this.shuffleText3);


        const lineGeo = new THREE.CylinderGeometry(-.01, -.01, this.textHeight);
        const lineMat = new THREE.MeshBasicMaterial({
            // wireframe: true,
            // transparent: true,
            // depthWrite: false,
            color: 0x666666
            // map: this.mesh.material.map
        });
        lineGeo.translate(0, this.textHeight / 2, 0);
        this.lineMesh = new THREE.Mesh(lineGeo, lineMat);
        this.lineMesh.position.set(0, 0, 0);
        gsap.to(this.lineMesh.scale, { duration: 0.0, y: 0 });
        super.add(this.lineMesh);
        this.meshes.push(this.lineMesh)

        const sphereGeo = new THREE.SphereGeometry(0.04);
        const sphereMat = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        this.sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
        this.sphereMesh.position.set(0, 0, 0);
        gsap.to(this.sphereMesh.scale, { duration: 0.0, x: 0, y: 0, z: 0 });
        super.add(this.sphereMesh);
        this.meshes.push(this.sphereMesh)

        this.scale.set(0.05, 0.05, 0.05);



    }

    show() {

        this.shuffleCountFactor = 30;
        this.currentText = this.targetText;

        cancelAnimationFrame(this.intervalId);
        this.intervalId = requestAnimationFrame(step => this.update(step));

        gsap.to(this.lineMesh.scale, { duration: 0.0, y: 0 });
        gsap.killTweensOf(this.lineMesh.scale);
        gsap.to(this.lineMesh.scale, {
            duration: 0.7, delay: 0.1, y: 1, ease: Quart.easeOut
        });

        gsap.to(this.sphereMesh.scale, { duration: 0.0, x: 0, y: 0, z: 0 });
        gsap.killTweensOf(this.sphereMesh.scale);
        gsap.to(this.sphereMesh.scale, {
            duration: 0.3, x: 1, y: 1, z: 1, ease: Quart.easeOut
        });

        gsap.delayedCall(0.5, () => {
            this.showText();
        });

    }

    hide() {

        this.shuffleCountFactor = 10;
        let newText = "";
        Array(this.currentText.length).fill(0).map((item, index) => {
            newText += " ";
        });
        this.currentText = newText;
        this.showText();

        // cancelAnimationFrame(this.intervalId);

        gsap.killTweensOf(this.lineMesh.scale);
        gsap.to(this.lineMesh.scale, {
            duration: 0.7, y: 0, ease: Quart.easeOut, delay: 0.1
        });

        gsap.killTweensOf(this.sphereMesh.scale);
        gsap.to(this.sphereMesh.scale, {
            duration: 0.3, delay: 0.6, x: 0, y: 0, z: 0, ease: Quart.easeOut
        });
    }

    destory() {

        cancelAnimationFrame(this.intervalId);

        super.remove(this.shuffleText);
        this.shuffleText.dispose()
        super.remove(this.shuffleText2);
        this.shuffleText2.dispose()
        super.remove(this.shuffleText3);
        this.shuffleText3.dispose()

        this.meshes.forEach(m => {
            super.remove(m);
            ThreeUtils.disposeHierchy(m)
        })

    }

    update(step) {

        step /= 1000.0;
        this.intervalId = requestAnimationFrame(step => this.update(step));

        this.textMat.uniforms.time.value = step;

        this.time += (step - this.prevStep);
        this.prevStep = step;

        if (this.time < this.updateDelay) return;
        this.time = 0;

        if (this.isFinished) return;

        if (this.currentTextLen < this.currentText.length) {
            this.updateDelay = 0.02;
            this.currentTextLen = this.currentTextLen + 1;
            if (this.currentTextLen > this.currentText.length) {
                this.currentTextLen = this.currentText.length;
            }
            var message = this.generateRandomString(this.currentTextLen, this.codeletters);

            //apply
            this.shuffleText.text = message;
            this.shuffleText2.text = message;
            this.shuffleText3.text = message;

        } else {
            this.updateDelay = 0.04;
            if (this.textInfo == null) {
                this.textInfo = [];
                for (var i = 0; i < this.currentText.length; i++) {
                    let tmp = new FadeBuffer();
                    tmp.c = (Math.floor(Math.random() * this.shuffleCountFactor)) + 1;
                    tmp.l = this.currentText[i];
                    this.textInfo.push(tmp);
                }
            }

            let do_cycles = false;
            let message = "";

            for (let i = 0; i < this.textInfo.length; i++) {
                let fader = this.textInfo[i];
                if (fader.c > 0) {
                    do_cycles = true;
                    if (this.isKeepRandom == false) fader.c--;
                    message += this.codeletters[Math.floor(Math.random() * 1.0 * this.codeletters.length)];
                } else {
                    message += fader.l;
                }
            }

            this.shuffleText.text = message;
            this.shuffleText2.text = this.generateRandomString(this.currentTextLen, this.codeletters2);
            this.shuffleText3.text = this.generateRandomString(this.currentTextLen, this.codeletters2);

            if (do_cycles == false) {
                this.isFinished = true;
                this.shuffleText2.text = ""
                this.shuffleText3.text = ""
            }

        }
    }

    generateRandomString(length, codeletters) {
        var random_text = "";
        while (random_text.length < length) {
            random_text += codeletters[Math.floor(Math.random() * 1.0 * codeletters.length)];
        }
        return random_text;
    }

    showText() {
        this.currentTextLen = 0;
        this.textInfo = null;
        this.shuffleText.text = "";
        this.shuffleText2.text = "";
        this.isFinished = false;
        this.isKeepRandom = false;
    }



}

export default ForestTextEffect;

