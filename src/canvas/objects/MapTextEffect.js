import * as THREE from "three";

import gsap, { Linear, Quart } from "gsap/all";
import { Text } from 'troika-three-text'

import AssetsLoaderController from "../controllers/AssetsLoaderController";
import ThreeUtils from "../utils/ThreeUtils";

import CameraController from "../controllers/CameraController";
import CanvasManager from "../managers/CanvasManager";

import MapTextEffectFrag from "../shaders/MapTextEffect.frag"
import MapTextEffectVert from "../shaders/MapTextEffect.vert"

class FadeBuffer {
    constructor() {
        this.c = 0;
        this.l = "";
    }
}

class MapTextEffect extends THREE.Group {

    constructor(text) {
        super();

        this.codeletters = " + -0123456789";
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

        this.textHeight = 0.2;
        this.shuffleCountFactor = 20;

        this.textMat = new THREE.ShaderMaterial({
            vertexShader: MapTextEffectVert,
            fragmentShader: MapTextEffectFrag,
            uniforms: {
                time: { value: 0 },
                fade: { value: 1.0 },
                textColor: {
                    value: new THREE.Vector3(
                        155.0 / 255.0 * 0.5,
                        155.0 / 255.0 * 0.5,
                        155.0 / 255.0 * 0.5,
                    )
                }
            },
            side: THREE.DoubleSide,
            transparent: true,
        })

        const fontSize = 0.1;
        const FONT_URL = process.env.PUBLIC_URL + "/Assets/font/NunitoSans-Regular.ttf";
        this.shuffleText = new Text()
        this.shuffleText.font = FONT_URL;
        this.shuffleText.fontSize = fontSize;
        this.shuffleText.text = ""
        this.shuffleText.color = 0xffffff;
        this.shuffleText.material = this.textMat;
        this.shuffleText.anchorX = "50%";
        this.shuffleText.anchorY = "50%";
        this.shuffleText.position.set(0, this.textHeight + 0.3, 0.0)
        this.shuffleText.sync()
        super.add(this.shuffleText);


        this.scale.set(0.05, 0.05, 0.05);

        this.isShow = false;
    }

    show() {

        this.isShow = true;

        this.shuffleCountFactor = 30;
        this.currentText = this.targetText;

        cancelAnimationFrame(this.intervalId);
        this.intervalId = requestAnimationFrame(step => this.update(step));


        gsap.delayedCall(0.5, () => {
            this.showText();
        });

    }

    hide() {

        this.isShow = false;

        this.shuffleCountFactor = 10;
        let newText = "";
        Array(this.currentText.length).fill(0).map((item, index) => {
            newText += " ";
        });
        this.currentText = newText;
        this.showText();

        // cancelAnimationFrame(this.intervalId);
    }

    destory() {

        cancelAnimationFrame(this.intervalId);
        super.remove(this.shuffleText);
        this.shuffleText.dispose();
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

        this.shuffleText.text = this.generateRandomString(this.currentTextLen, this.codeletters);
        // if (this.currentTextLen < this.currentText.length) {
        this.updateDelay = 0.04;

        if (this.isShow) {
            this.currentTextLen = this.currentTextLen + 1;
            if (this.currentTextLen > this.currentText.length) {
                this.currentTextLen = this.currentText.length;
            }
        } else {
            this.currentTextLen = this.currentTextLen - 1;
            if (this.currentTextLen < 0) {
                this.currentTextLen = 0;
            }
        }

        //     var message = this.generateRandomString(this.currentTextLen, this.codeletters);

        //     //apply

        // } else {
        //     this.updateDelay = 0.04;
        //     if (this.textInfo == null) {
        //         this.textInfo = [];
        //         for (var i = 0; i < this.currentText.length; i++) {
        //             let tmp = new FadeBuffer();
        //             tmp.c = (Math.floor(Math.random() * this.shuffleCountFactor)) + 1;
        //             tmp.l = this.currentText[i];
        //             this.textInfo.push(tmp);
        //         }
        //     }

        //     let do_cycles = false;
        //     let message = "";

        //     for (let i = 0; i < this.textInfo.length; i++) {
        //         let fader = this.textInfo[i];
        //         if (fader.c > 0) {
        //             do_cycles = true;
        //             if (this.isKeepRandom == false) fader.c--;
        //             message += this.codeletters[Math.floor(Math.random() * 1.0 * this.codeletters.length)];
        //         } else {
        //             message += fader.l;
        //         }
        //     }

        //     this.shuffleText.text = message;

        //     if (do_cycles == false) {
        //         this.isFinished = true;
        //     }

        // }
    }

    generateRandomString(length, codeletters) {
        var random_text = "";
        while (random_text.length < length) {
            random_text += codeletters[Math.floor(Math.random() * 1.0 * codeletters.length)];
        }
        return random_text;
    }

    showText() {
        // this.currentTextLen = 0;
        this.textInfo = null;
        this.shuffleText.text = "";
        this.isFinished = false;
        this.isKeepRandom = false;
    }



}

export default MapTextEffect;

