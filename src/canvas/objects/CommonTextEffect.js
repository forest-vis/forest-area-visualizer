import * as THREE from "three";

import gsap, { Linear, Quart } from "gsap/all";
import { Text } from 'troika-three-text'

import AssetsLoaderController from "../controllers/AssetsLoaderController";
import ThreeUtils from "../utils/ThreeUtils";

import CameraController from "../controllers/CameraController";
import CanvasManager from "../managers/CanvasManager";

import CommonTextEffectFrag from "../shaders/ForestTextEffect.frag"
import CommonTextEffectVert from "../shaders/ForestTextEffect.vert"

class FadeBuffer {
    constructor() {
        this.c = 0;
        this.l = "";
    }
}

class CommonTextEffect extends THREE.Group {

    constructor(text, size, align, hexcolor) {
        super();

        this.codeletters = "     .|";
        // this.codeletters = "      +";
        // this.codeletters = "1234567890";
        // this.codeletters = "              &#*+%?.-_$";

        this.currentTextLen = 0;
        this.textInfo = null;
        this.targetText = text;
        this.currentText = this.targetText;
        this.isFinished = true;
        this.isKeepRandom = false;
        this.time = 0.0;
        this.prevStep = 0.0;
        this.updateDelay = 0.02;

        this.shuffleCountFactor = 20;


        const color = new THREE.Color(hexcolor);
        console.log(color.r)
        this.textMat = new THREE.ShaderMaterial({
            vertexShader: CommonTextEffectVert,
            fragmentShader: CommonTextEffectFrag,
            uniforms: {
                time: { value: 0 },
                fade: { value: 1.0 },
                textColor: {
                    value: new THREE.Vector3(
                        color.r,
                        color.g,
                        color.b,
                    )
                }
            },
            side: THREE.DoubleSide,
            transparent: true,
        })
        // this.textMat2 = new THREE.ShaderMaterial({
        //     vertexShader: CommonTextEffectVert,
        //     fragmentShader: CommonTextEffectFrag,
        //     uniforms: {
        //         time: { value: 0 },
        //         fade: { value: 1.0 },
        //         textColor: {
        //             value: new THREE.Vector3(
        //                 0.0,//176.0 / 255.0,
        //                 255.0,//234.0 / 255.0,
        //                 0.0,//205.0 / 255.0,
        //             )
        //         }
        //     },
        //     side: THREE.DoubleSide,
        //     transparent: true,
        // })
        // this.textMat3 = new THREE.ShaderMaterial({
        //     vertexShader: CommonTextEffectVert,
        //     fragmentShader: CommonTextEffectFrag,
        //     uniforms: {
        //         time: { value: 0 },
        //         fade: { value: 1.0 },
        //         textColor: {
        //             value: new THREE.Vector3(
        //                 255.0 / 255.0,
        //                 0,//94.0 / 255.0,
        //                 0//83.0 / 255.0,
        //             )
        //         },
        //     },
        //     side: THREE.DoubleSide,
        //     transparent: true,
        // })

        const fontSize = size;
        const FONT_URL = process.env.PUBLIC_URL + "/Assets/font/NunitoSans-Bold.ttf";
        this.shuffleText = new Text()
        this.shuffleText.font = FONT_URL;
        this.shuffleText.fontSize = fontSize;
        this.shuffleText.text = ""
        this.shuffleText.color = 0xffffff;
        this.shuffleText.material = this.textMat;
        this.shuffleText.anchorX = align;
        this.shuffleText.anchorY = "50%";
        this.shuffleText.position.set(0, 0.0, 0.0)
        this.shuffleText.sync()
        super.add(this.shuffleText);

        // this.shuffleText2 = new Text()
        // this.shuffleText2.font = FONT_URL;
        // this.shuffleText2.fontSize = fontSize;
        // this.shuffleText2.text = ""
        // this.shuffleText2.color = 0xFD5E53
        // this.shuffleText2.material = this.textMat2;
        // this.shuffleText2.anchorX = align;
        // this.shuffleText2.anchorY = "50%";
        // this.shuffleText2.position.set(0, 0.0, 0.1)
        // this.shuffleText2.sync()
        // super.add(this.shuffleText2);

        // this.shuffleText3 = new Text()
        // this.shuffleText3.font = FONT_URL;
        // this.shuffleText3.fontSize = fontSize;
        // this.shuffleText3.text = ""
        // this.shuffleText3.color = 0xB0EACD
        // this.shuffleText3.material = this.textMat3;
        // this.shuffleText3.anchorX = align;
        // this.shuffleText3.anchorY = "50%";
        // this.shuffleText3.position.set(0, 0.0, -0.1)
        // this.shuffleText3.sync()
        // super.add(this.shuffleText3);



        this.scale.set(0.05, 0.05, 0.05);


        // document.addEventListener('keydown', event => {
        //     const keyName = event.key;
        //     switch (keyName) {
        //         case 'q':

        //             this.show();
        //             break;

        //         case 'w':

        //             this.hide();

        //             break;

        //         case 'd':
        //             break;
        //     }
        // });

    }

    show() {

        this.shuffleCountFactor = 30;
        this.currentText = this.targetText;

        cancelAnimationFrame(this.intervalId);
        this.intervalId = requestAnimationFrame(step => this.update(step));

        this.showText();

    }

    hide() {

        this.shuffleCountFactor = 10;
        let newText = "";
        Array(this.currentText.length).fill(0).map((item, index) => {
            newText += " ";
        });
        this.currentText = newText;
        this.showText();

    }

    destory() {
        cancelAnimationFrame(this.intervalId);
        super.remove(this.shuffleText);
        this.shuffleText.dispose()


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
            this.currentTextLen = this.currentTextLen + 4;
            if (this.currentTextLen > this.currentText.length) {
                this.currentTextLen = this.currentText.length;
            }
            var message = this.generateRandomString(this.currentTextLen, this.codeletters);

            //apply
            this.shuffleText.text = message;
            // this.shuffleText2.text = message;
            // this.shuffleText3.text = message;

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
            // this.shuffleText2.text = this.generateRandomString(this.currentTextLen, this.codeletters2);
            // this.shuffleText3.text = this.generateRandomString(this.currentTextLen, this.codeletters2);

            if (do_cycles == false) {
                this.isFinished = true;
                // this.shuffleText2.text = ""
                // this.shuffleText3.text = ""
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
        // this.shuffleText2.text = "";
        this.isFinished = false;
        this.isKeepRandom = false;
    }



}

export default CommonTextEffect;

