import * as THREE from "three";
import { Camera } from "three";
import CameraController from "../controllers/CameraController";
import CanvasManager from "../managers/CanvasManager";
import ForestTextEffect from "../objects/ForestTextEffect";
import GraphParticleInstancing from "../objects/GraphParticleInstancing";
import LeadLineInstancingObject from "../objects/LeadLineInstancingObject";
import LeadPointInstancingObject from "../objects/LeadPointInstancingObject";
import LeadTextInstancingObject from "../objects/LeadTextInstancingObject";
import P5CanvasPlane from "../objects/P5CanvasPlane";
import TestBoxObject from "../objects/TestBoxObject";

import AbstractScene from './AbstractScene'

class TestScene1 extends AbstractScene {

    constructor(params) {
        super(params);
    }

    init() {
        super.init();


    }

    show() {
        super.show();

        this.testBoxObject = new TestBoxObject();
        this.testBoxObject.position.set(0, 0, 0)
        CanvasManager.getScene().add(this.testBoxObject);

    }


    hide() {

        CanvasManager.getScene().remove(this.testBoxObject);
        this.testBoxObject.destory();

        setTimeout(() => {
            super.hide();
        }, 1000)

    }
}

export default TestScene1;

