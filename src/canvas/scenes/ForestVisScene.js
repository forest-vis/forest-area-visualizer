import * as THREE from "three";

import gsap, { Linear, Quart, Sine } from "gsap/all";

import AssetsLoaderController from "../controllers/AssetsLoaderController";
import CameraController from "../controllers/CameraController";
import CanvasManager from "../managers/CanvasManager";
import ForestTextEffect from "../objects/ForestTextEffect";
import GraphParticleInstancing from "../objects/GraphParticleInstancing";
import GridCrossPlane from "../objects/GridCrossPlane";
import GridPlane from "../objects/GridPlane";
import LeadLineInstancingObject from "../objects/LeadLineInstancingObject";
import LeadPointInstancingObject from "../objects/LeadPointInstancingObject";
import LeadTextInstancingObject from "../objects/LeadTextInstancingObject";
import MapTextEffect from "../objects/MapTextEffect";
import P5CanvasPlane from "../objects/P5CanvasPlane";
import TestBoxObject from "../objects/TestBoxObject";

import AbstractScene from './AbstractScene'
import { Group, Vector3 } from "three";
import BlackFadePlane from "../objects/BlackFadePlane";
import { P5Canvas1Manager } from "../commons/createP5";
import { P5Canvas2Manager } from "../commons/createP5ver2";
import SelectCountryScene from "./SelectCountryScene";
import SceneController from "../controllers/SceneController";
import getCaption, { rotOffset } from "../models/CaptionModel";
import CommonTextEffect from "../objects/CommonTextEffect";

const lerp = (start, end, amt) => {
    return (1 - amt) * start + amt * end
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

class ForestVisScene extends AbstractScene {

    constructor(params) {
        super(params);
    }

    init() {
        super.init();
    }

    show(params) {
        super.show();

        this.countryName = params.countryName;
        this.cityData = params.cityData;


        this.canvasTex = new THREE.Texture(P5Canvas1Manager.getCanvasElement());

        this.filledCanvasTexture = new THREE.TextureLoader().load('/Assets/data/' + this.countryName + '_fill.png');

        this.p5CanvasPlane = new P5CanvasPlane(this.canvasTex, this.countryName);
        this.p5CanvasPlane.position.set(0, 0, 0)
        CanvasManager.getScene().add(this.p5CanvasPlane);
        this.p5CanvasPlane.show();

        this.forestTextEffects = [];
        this.cityData.forEach(element => {
            const forestTextEffect = new ForestTextEffect(element[0], element[3]);
            forestTextEffect.position.set(element[1] / 1024.0, 0.0, element[2] / 1024.0)
            CanvasManager.getScene().add(forestTextEffect);
            this.forestTextEffects.push(forestTextEffect);
        });

        this.mapTextEffects = [];
        Array(25).fill(0).map((item, index) => {
            const mapTextEffect = new MapTextEffect("123");
            mapTextEffect.position.set(
                (Math.floor(index / 5.0) - 2.5) * 0.25,
                0.0,
                (Math.floor(index % 5.0) - 2.5) * 0.25
            )
            CanvasManager.getScene().add(mapTextEffect);
            mapTextEffect.show();
            this.mapTextEffects.push(mapTextEffect);
        });


        this.leadPointInstancingObject = new LeadPointInstancingObject(this.canvasTex);
        this.leadPointInstancingObject.position.set(0, 0, 0)
        CanvasManager.getScene().add(this.leadPointInstancingObject);


        this.leadLineInstancingObject = new LeadLineInstancingObject(this.canvasTex);
        this.leadLineInstancingObject.position.set(0, 0, 0)
        CanvasManager.getScene().add(this.leadLineInstancingObject);


        this.leadTextInstancingObject = new LeadTextInstancingObject(this.canvasTex);
        this.leadTextInstancingObject.position.set(0, 0, 0)
        CanvasManager.getScene().add(this.leadTextInstancingObject);


        this.blackFadePlane = new BlackFadePlane();
        this.blackFadePlane.position.set(0, 0.02, 0)
        CanvasManager.getScene().add(this.blackFadePlane);


        this.gridPlane = new GridPlane(this.canvasTex);
        this.gridPlane.position.set(0.0, -0.02, 0.0);
        CanvasManager.getScene().add(this.gridPlane);
        this.gridPlane.show();

        this.gridCrossPlane = new GridCrossPlane(this.canvasTex);
        this.gridCrossPlane.position.set(0.0, -0.015, 0.0);
        CanvasManager.getScene().add(this.gridCrossPlane);
        this.gridCrossPlane.show();

        this.countyNameEffect = new CommonTextEffect(this.countryName, 1.7, "50%", 0xffffff);
        this.countyNameEffect.position.set(0.0, 0.1, 0.0)
        CanvasManager.getScene().add(this.countyNameEffect);

        CameraController.rotOffset = rotOffset[this.countryName];

        this.delayedCalls = [];
        document.addEventListener('keydown', event => {
            const keyName = event.key;
            switch (keyName) {
                case 'f':
                    CameraController.enabeleRotation();
                    break;

                case 'g':
                    CameraController.disableRotation();
                    const POS = {
                        x: 0.42571483295590234,
                        y: 0.39597229442155624,
                        z: 0.32237042707571606
                    }

                    const ROT = {
                        x: -0.8875025119297505,
                        y: 0.694982392852278,
                        z: 0.6665031429147243
                    }

                    CameraController.moveCamera(POS, ROT, 1.0, () => {
                        // this.act(5);
                    })
                    break;

                case 'h':
                    CameraController.enabeleZoom()
                    break;

                case 'j':
                    CameraController.disableZoom()
                    break;
            }
        });




        this.act(0);
        // this.act(5);
        // this.act(4); window.REF_fadeBlackIn();
        // this.leadPointInstancingObject.show();
        // this.leadLineInstancingObject.show();
        // this.leadTextInstancingObject.show();
    }

    act(actId) {
        console.log("ACT : " + actId)
        switch (actId) {

            //=======================================================================
            // init
            //=======================================================================
            case 0:
                {
                    window.REF_fadeBlackIn();
                    window.REF_showCaption(getCaption(0, this.countryName));

                    const delayedCall2 = gsap.delayedCall(1.0, () => {
                        this.countyNameEffect.show();
                        const delayedCall3 = gsap.delayedCall(6.0, () => {
                            this.countyNameEffect.hide();
                        });
                        this.delayedCalls.push(delayedCall3);
                    });
                    this.delayedCalls.push(delayedCall2);


                    const delayedCall = gsap.delayedCall(8.0, () => {
                        window.REF_showTitle();
                        window.REF_showCaption(getCaption(1, this.countryName));
                        P5Canvas1Manager.start();
                        P5Canvas2Manager.start(this.countryName == "Japan");
                    });
                    this.delayedCalls.push(delayedCall);

                    CameraController.enabeleRotation();
                    CameraController.camPos = 1.0;
                    gsap.to(CameraController, {
                        camPos: 0,
                        duration: 10.0,
                        // duration: 1.0,
                        ease: Quart.easeInOut,
                        onComplete: () => {
                            this.act(1);
                        }
                    })
                }
                break;


            //=======================================================================
            // show tooltip
            //=======================================================================
            case 1:
                {



                    const delayedCall1 = gsap.delayedCall(1.0, () => {


                        window.REF_showExample();

                        this.leadPointInstancingObject.show();
                        this.leadLineInstancingObject.show();
                        this.leadTextInstancingObject.show();
                    })
                    this.delayedCalls.push(delayedCall1);

                    const delayedCall2 = gsap.delayedCall(5.0, () => {
                        this.act(2);
                    });
                    this.delayedCalls.push(delayedCall2);
                }
                break;



            //=======================================================================
            // show cityName
            //=======================================================================
            case 2:
                {

                    window.REF_showCaption(getCaption(2, this.countryName));

                    this.forestTextEffects.forEach(v => {
                        v.show();
                    })

                    const delayedCall = gsap.delayedCall(10.0, () => {
                        this.act(3);
                    });
                    this.delayedCalls.push(delayedCall);
                }
                break;


            //=======================================================================
            // show cityName
            //=======================================================================
            case 3:
                {
                    const delayedCall1 = gsap.delayedCall(10.0, () => {
                        window.REF_showCaption(getCaption(3, this.countryName));
                    });
                    this.delayedCalls.push(delayedCall1);


                    CameraController.enabeleZoom();
                    const delayedCall = gsap.delayedCall(20.0, () => {
                        this.act(4);
                    });
                    this.delayedCalls.push(delayedCall);
                }
                break;

            //=======================================================================
            // none
            //=======================================================================
            case 4:
                {

                    CameraController.disableRotation();


                    const POS = {
                        x: 0.2864020878340023,
                        y: 0.5978289731942943,
                        z: 0.3212053276929663
                    }

                    const ROT = {
                        x: -1.0777664703312104,
                        y: 0.39933908658883777,
                        z: 0.626425516332758
                    }

                    CameraController.moveCamera(POS, ROT, 18.0, () => {
                        this.act(5);
                    })
                    CameraController.disableZoom();
                }
                break;


            //=======================================================================
            // particle
            //=======================================================================
            case 5:
                {

                    window.REF_showCaption(getCaption(4, this.countryName));

                    this.graphParticleInstancing = new GraphParticleInstancing(
                        P5Canvas1Manager.getCanvasElement(),
                        this.filledCanvasTexture,
                        this.countryName
                    );
                    this.graphParticleInstancing.position.set(0, 0, 0)
                    CanvasManager.getScene().add(this.graphParticleInstancing);

                    const delayedCall = gsap.delayedCall(2.0, () => {

                        this.mapTextEffects.forEach(v => {
                            v.hide();
                        })
                        this.forestTextEffects.forEach(v => {
                            v.hide();
                        })
                        this.leadPointInstancingObject.hide();
                        this.leadLineInstancingObject.hide();
                        this.leadTextInstancingObject.hide();


                        const delayedCall = gsap.delayedCall(2.5, () => {
                            this.blackFadePlane.show();

                            const params = { value: 1 }
                            gsap.to(params, {
                                value: 0, delay: 1.0, duration: 1.5, ease: Sine.easeInOut,
                                // onUpdate: () => {
                                //     // console.log(params.value)
                                //     this.p5CanvasPlane.setHeight(params.value * .02);
                                // }
                            })
                        });
                        this.delayedCalls.push(delayedCall);
                    });
                    this.delayedCalls.push(delayedCall);

                    this.graphParticleInstancing.show();

                    const POS = {
                        x: 0,//-0.019157817362726273,
                        y: 0.1985177438504151,
                        z: 1.1
                    }

                    const ROT = {
                        x: -0.0,//29852610683979357,
                        y: -0.0,//4701545871733611,
                        z: -0.0//01403433174612944
                    }

                    CameraController.moveCamera(POS, ROT, 13.0, () => {
                        const delayedCall = gsap.delayedCall(3.0, () => {
                            if (this.countryName != "Japan") {
                                window.REF_fadeBlackOut()
                                const delayedCall2 = gsap.delayedCall(1.0, () => {
                                    SceneController.gotoScene("SelectCountryScene");
                                });
                                this.delayedCalls.push(delayedCall2);
                            }
                        });
                        this.delayedCalls.push(delayedCall);
                    })

                }
                break;


        }
    }



    hide() {

        if (this.graphParticleInstancing != undefined) {
            CanvasManager.getScene().remove(this.graphParticleInstancing);
            this.graphParticleInstancing.destory();
        }

        CanvasManager.getScene().remove(this.p5CanvasPlane);
        this.p5CanvasPlane.destory();

        this.forestTextEffects.forEach(forestTextEffect => {
            CanvasManager.getScene().remove(forestTextEffect);
            forestTextEffect.destory();
        })

        this.mapTextEffects.forEach(mapTextEffect => {
            CanvasManager.getScene().remove(mapTextEffect);
            mapTextEffect.destory();
        })

        CanvasManager.getScene().remove(this.leadPointInstancingObject);
        this.leadPointInstancingObject.destory()

        CanvasManager.getScene().remove(this.leadLineInstancingObject);
        this.leadLineInstancingObject.destory()

        CanvasManager.getScene().remove(this.leadTextInstancingObject);
        this.leadTextInstancingObject.destory()

        CanvasManager.getScene().remove(this.blackFadePlane);
        this.blackFadePlane.destory();

        CanvasManager.getScene().remove(this.gridPlane);
        this.gridPlane.destory();

        CanvasManager.getScene().remove(this.gridCrossPlane);
        this.gridCrossPlane.destory();

        this.delayedCalls.forEach(c => {
            c.kill();
        })

        gsap.killTweensOf(CameraController);

        CameraController.reset();

        P5Canvas1Manager.stop();
        P5Canvas2Manager.stop();

        P5Canvas1Manager.reset();
        P5Canvas2Manager.reset();

        setTimeout(() => {
            super.hide();
        }, 1000)

    }
}

export default ForestVisScene;

