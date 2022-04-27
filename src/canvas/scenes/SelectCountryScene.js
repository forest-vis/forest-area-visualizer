import * as THREE from "three";
import { Camera } from "three";
import { P5Canvas1Manager } from "../commons/createP5";
import { P5Canvas2Manager } from "../commons/createP5ver2";
import CameraController from "../controllers/CameraController";
import SceneController from "../controllers/SceneController";
import CanvasManager from "../managers/CanvasManager";
import ForestTextEffect from "../objects/ForestTextEffect";
import GraphParticleInstancing from "../objects/GraphParticleInstancing";
import LeadLineInstancingObject from "../objects/LeadLineInstancingObject";
import LeadPointInstancingObject from "../objects/LeadPointInstancingObject";
import LeadTextInstancingObject from "../objects/LeadTextInstancingObject";
import P5CanvasPlane from "../objects/P5CanvasPlane";
import TestBoxObject from "../objects/TestBoxObject";

import CityDataModel from "../models/CityDataModel";

import AbstractScene from './AbstractScene'

const COUNTRY_LIST = [
    { name: "Australia", area: "Country in Oceania" },
    { name: "Bolivia", area: "Country in South America" },
    { name: "Brazil", area: "Country in South America" },
    { name: "Congo", area: "Country in Central Africa" },
    { name: "Indonesia", area: "Country in South Asia" },
    { name: "Madagascar", area: "Country in East Africa" },
    { name: "Myanmar", area: "Country in South Asia" },
    { name: "Nigeria", area: "Country in West Africa" },
    { name: "Tanzania", area: "Country in East Africa" },
    // "Zimbabwe",
]

const JAPAN = { name: "Japan", area: "Country in East Asia" };

class SelectCountryScene extends AbstractScene {

    constructor(params) {
        super(params);
    }

    init() {
        super.init();
        this.isSecondCountry = false;
    }

    show() {
        super.show();

        this.timeoutId = setTimeout(() => {

            const country = this.isSecondCountry ?
                JAPAN :
                COUNTRY_LIST[Math.floor(Math.random() * COUNTRY_LIST.length)];
            // COUNTRY_LIST[4];

            this.isSecondCountry = true;

            const countryName = country.name;
            const countryArea = country.area;
            // const countryName = COUNTRY_LIST[0];
            // const countryName = COUNTRY_LIST[2];

            window.REF_setCountry(countryName, countryArea);

            const cityData = CityDataModel[country.name];
            P5Canvas1Manager.load(countryName);
            P5Canvas2Manager.load(countryName);
            SceneController.gotoScene("ForestVisScene", false, { countryName, cityData });
        }, 1000);

    }


    hide() {

        clearTimeout(this.timeoutId);
        setTimeout(() => {
            super.hide();
        }, 1000)

    }
}

export default SelectCountryScene;

