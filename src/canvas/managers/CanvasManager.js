import * as THREE from "three";
import { AxesHelper } from "three";
import Stats from 'three/examples/jsm/libs/stats.module'

import canvasRecord from "canvas-record";
import canvasContext from "canvas-context";


import threeApp from "../commons/createThree";
import CameraController from "../controllers/CameraController";
import SceneController from "../controllers/SceneController";
import { P5Canvas1Manager } from "../commons/createP5";
import { P5Canvas2Manager } from "../commons/createP5ver2";
import CityDataModel from "../models/CityDataModel";


// Scale for retina
const DPR = Math.min(2.0, window.devicePixelRatio);
const { camera, scene, renderer } = threeApp(DPR);


const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
export default class CanvasManager {

    static init() {

        // console.log("CanvasManager::init");

        this.isDebug = params.hasOwnProperty("debug");
        this.shibamataGrammetry = null;

        const stats = Stats()
        // document.body.appendChild(stats.dom)
        stats.dom.style.cssText = 'position:absolute;top:100px;left:0px;';

        this.scene = scene;

        // console.log("start");
        CameraController.init(camera);

        SceneController.init();

        if (this.isDebug == false) {



            // document.addEventListener('keydown', event => {
            //     const keyName = event.key;
            //     switch (keyName) {
            //         case '1':
            //             const countryName = "Madagascar";
            //             const cityData = CityDataModel[countryName];

            //             P5Canvas1Manager.load(countryName);
            //             P5Canvas2Manager.load(countryName);
            //             SceneController.gotoScene("ForestVisScene", false, { countryName, cityData });
            //             break;

            //         case '2':
            //             SceneController.gotoScene("TestScene1");
            //             break;

            //         case '3':
            //             P5Canvas1Manager.start();
            //             P5Canvas2Manager.start();
            //             break;

            //         case '4':
            //             P5Canvas1Manager.stop();
            //             P5Canvas2Manager.stop();
            //             break;

            //         case '5':
            //             P5Canvas1Manager.reset();
            //             P5Canvas2Manager.reset();
            //             break;
            //     }
            // });

            SceneController.gotoScene("SelectCountryScene");



        } else {


            // CameraController.setDebugPosition();
            // const countryName = "Brazil";


            // const countryName = "Australia";
            // const countryName = "Bolivia";
            // const countryName = "Brazil";
            // const countryName = "Congo";
            // const countryName = "Indonesia";
            const countryName = "Japan";
            // const countryName = "Madagascar";
            // const countryName = "Myanmar";
            // const countryName = "Nigeria";
            // const countryName = "Tanzania";
            // const countryName = "Zimbabwe";
            window.REF_fadeBlackIn();

            P5Canvas1Manager.load(countryName);
            P5Canvas2Manager.load(countryName);

            SceneController.gotoScene(params.debug, false, { countryName });

            P5Canvas1Manager.start();
            P5Canvas2Manager.start(true);

            // const gridHelper = new THREE.GridHelper(10, 50);
            // scene.add(gridHelper);

            // const axis = new AxesHelper(5);
            // axis.position.set(0, 0, 0);
            // scene.add(axis);


        }


        renderLoop();

        window.REF_assetsLocaComp();




        function renderLoop() {
            requestAnimationFrame(renderLoop);
            CameraController.update();
            renderer.render(scene, camera);

            stats.update()
        }



    }

    static getElement() {
        return renderer.domElement;
    }

    static getScene() {
        return scene;
    }

    static start() {
        if (this.isDebug) return;
        let nodeId = 10;
        if (params.hasOwnProperty("node")) {
            nodeId = params.node
        }
        SceneController.gotoScene("LocationNodeScene" + nodeId);
    }

    static enableNoise() {
        if (this.shibamataGrammetry != null) {
            this.shibamataGrammetry.enableNoise();
        }
    }
    static disableNoise() {
        if (this.shibamataGrammetry != null) {
            this.shibamataGrammetry.disableNoise();
        }
    }
    static enableAllNoise() {
        if (this.shibamataGrammetry != null) {
            this.shibamataGrammetry.enableAllNoise();
        }
    }

}
