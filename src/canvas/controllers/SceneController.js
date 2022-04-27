

import ForestVisScene from "../scenes/ForestVisScene";
import SelectCountryScene from "../scenes/SelectCountryScene";
import TestScene1 from "../scenes/TestScene1";
import TestScene2 from "../scenes/TestScene2";
import TestScene3 from "../scenes/TestScene3";

class SceneController {

    static init() {

        // console.log("SceneController::init");
        this._scenes = {
            "ForestVisScene": new ForestVisScene("ForestVisScene"),
            "TestScene1": new TestScene1("TestScene1"),
            "TestScene2": new TestScene2("TestScene2"),
            "TestScene3": new TestScene3("TestScene3"),
            "SelectCountryScene": new SelectCountryScene("SelectCountryScene"),
        };

        // console.log(this._scenes)

        this._currentScene = null;
        this._targetSceneName = "";

        this._scenes["ForestVisScene"].init();
        this._scenes["SelectCountryScene"].init();
        this._scenes["TestScene1"].init();
        this._scenes["TestScene2"].init();
        this._scenes["TestScene3"].init();
        this._params = {};

    }

    static gotoScene(sceneName, isSkipTargetCheck = false, params = {}) {

        this._params = params;

        console.log("SceneController::" + sceneName);
        if (isSkipTargetCheck == false && sceneName == this._targetSceneName) {
            return;
        }

        if (this._currentScene != null && sceneName == this._currentScene.sceneName) {
            return;
        }

        // console.log("SceneController run::" + sceneName);

        if (this._currentScene != null) {
            // this._currentScene.onStateChanged.addEventListener("HIDE_COMPLETE", this.handleHideComplete);
            this._currentScene.onStateChanged.addEventListener("HIDE_COMPLETE", this.handleHideComplete);
            this._targetSceneName = sceneName;
            this._currentScene.hide();
            return;
        }

        // console.log(this._scenes[sceneName])
        this._scenes[sceneName].show(this._params);
        this._currentScene = this._scenes[sceneName];

        console.log("SceneController comp::" + sceneName);

    }

    static handleHideComplete() {
        // console.log(SceneController._currentScene);
        SceneController._currentScene.onStateChanged.removeEventListener("HIDE_COMPLETE", this.handleHideComplete)
        SceneController._currentScene = null;
        SceneController.gotoScene(SceneController._targetSceneName, true, SceneController._params);
    }

}

export default SceneController;

