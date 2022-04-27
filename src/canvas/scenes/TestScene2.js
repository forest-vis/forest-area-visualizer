import * as THREE from "three";
import { Camera } from "three";
import { P5Canvas1Manager } from "../commons/createP5";
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

class TestScene2 extends AbstractScene {

    constructor(params) {
        super(params);
    }

    init() {
        super.init();


    }

    show(params) {
        super.show();

        const countryName = params.countryName;

        // const testBoxObject = new TestBoxObject();
        // testBoxObject.position.set(0, 0, 0)
        // CanvasManager.getScene().add(testBoxObject);


        // const forestTextEffect = new ForestTextEffect("Antananarivo");
        // forestTextEffect.position.set(0.1, 0, 0)
        // CanvasManager.getScene().add(forestTextEffect);

        // const forestTextEffect2 = new ForestTextEffect("Tokyo");
        // forestTextEffect2.position.set(-0.1, 0, 0);
        // CanvasManager.getScene().add(forestTextEffect2);
        // forestTextEffect.show();

        const canvasTex = new THREE.Texture(P5Canvas1Manager.getCanvasElement())
        canvasTex.repeat = THREE.ClampToEdgeWrapping;
        // console.log(canvasTex)

        this.filledCanvasTexture = new THREE.TextureLoader().load('/Assets/data/' + countryName + '_fill.png');
        setTimeout(() => {
            const graphParticleInstancing = new GraphParticleInstancing(canvasTex, this.filledCanvasTexture, countryName);
            graphParticleInstancing.position.set(0, 0, 0)
            CanvasManager.getScene().add(graphParticleInstancing);
            graphParticleInstancing.show();
        }, 1000);

        // CameraController.debug = true;
        // const leadPointInstancingObject = new LeadPointInstancingObject(canvasTex);
        // leadPointInstancingObject.position.set(0, 0, 0)
        // CanvasManager.getScene().add(leadPointInstancingObject);
        // leadPointInstancingObject.show();

        // const leadLineInstancingObject = new LeadLineInstancingObject(canvasTex);
        // leadLineInstancingObject.position.set(0, 0, 0)
        // CanvasManager.getScene().add(leadLineInstancingObject);
        // leadLineInstancingObject.show();

        // const leadTextInstancingObject = new LeadTextInstancingObject(canvasTex);
        // leadTextInstancingObject.position.set(0, 0, 0)
        // CanvasManager.getScene().add(leadTextInstancingObject);
        // leadTextInstancingObject.show();

        setTimeout(() => {

            const POS = {
                x: -0.05684662914219594,
                y: 0.17064556635613712,
                z: 1.5025473541416816
            }

            const ROT = {
                x: -0.1130862936059017,
                y: -0.037574150589035564,
                z: -0.00426629794729851
            }

            console.log(POS)
            CameraController.rotFactor = 0
            CameraController.moveCamera(POS, ROT, .05, () => {
                CameraController.debug = true
            })

        }, 500)
    }


    hide() {
        setTimeout(() => {
            super.hide();
        }, 1000)
    }
}

export default TestScene2;

