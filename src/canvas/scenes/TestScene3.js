import * as THREE from "three";
import { P5Canvas1Manager } from "../commons/createP5";
import AssetsLoaderController from "../controllers/AssetsLoaderController";
import CanvasManager from "../managers/CanvasManager";
import ForestTextEffect from "../objects/ForestTextEffect";
import GraphParticleInstancing from "../objects/GraphParticleInstancing";
import LeadLineInstancingObject from "../objects/LeadLineInstancingObject";
import LeadPointInstancingObject from "../objects/LeadPointInstancingObject";
import LeadTextInstancingObject from "../objects/LeadTextInstancingObject";
import P5CanvasPlane from "../objects/P5CanvasPlane";
import TestBoxObject from "../objects/TestBoxObject";

import AbstractScene from './AbstractScene'

class TestScene3 extends AbstractScene {

    constructor(params) {
        super(params);
    }

    init() {
        super.init();
    }

    update(step) {
        step /= 1000.0;
        this.intervalId = requestAnimationFrame(step => this.update(step));
        this.canvasTex.needsUpdate = true;
    }


    show() {
        super.show();

        const canvasTex = new THREE.Texture(P5Canvas1Manager.getCanvasElement());

        console.log(canvasTex)
        this.canvasTex = canvasTex;

        // this.p5CanvasPlane = new P5CanvasPlane(canvasTex);
        // this.p5CanvasPlane.position.set(0, 0, 0)
        // CanvasManager.getScene().add(this.p5CanvasPlane);
        // this.p5CanvasPlane.show();
        // this.p5CanvasPlane.setHeight(0.02);

        this.leadPointInstancingObject = new LeadPointInstancingObject(canvasTex);
        this.leadPointInstancingObject.position.set(0, 0, 0)
        CanvasManager.getScene().add(this.leadPointInstancingObject);


        this.leadLineInstancingObject = new LeadLineInstancingObject(canvasTex);
        this.leadLineInstancingObject.position.set(0, 0, 0)
        CanvasManager.getScene().add(this.leadLineInstancingObject);


        this.leadTextInstancingObject = new LeadTextInstancingObject(canvasTex);
        this.leadTextInstancingObject.position.set(0, 0, 0)
        CanvasManager.getScene().add(this.leadTextInstancingObject);

        console.log("aa")

        this.leadPointInstancingObject.show();
        this.leadLineInstancingObject.show();
        this.leadTextInstancingObject.show();

        this.update();

        document.addEventListener('keydown', event => {
            const keyName = event.key;
            switch (keyName) {
                case 'a':
                    this.leadPointInstancingObject.hide();
                    this.leadLineInstancingObject.hide();
                    this.leadTextInstancingObject.hide();
                    break;
            }
        });
    }


    hide() {
        setTimeout(() => {
            super.hide();
        }, 1000)
    }
}

export default TestScene3;

