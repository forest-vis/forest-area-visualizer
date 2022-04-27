import { ClampToEdgeWrapping, RepeatWrapping, TextureLoader } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as Pizzicato from "pizzicato";

import DebugLogController from "./DebugLogController";
import { isMobile } from "react-device-detect";

class Assets {
    constructor(params) {
        this.size = params.size;
        this.type = params.type;
        this.id = params.id;
        this.path = params.path;
        this.wrapmode = params.wrapmode;
    }
}

class AssetsLoaderController {

    constructor(success, error) {

        let isComplete = false;
        const ASSET_LIST = [

            // new Assets({ size: 20000, type: "fbx", id: "model_star", path: "/Assets/model/FBX_Star.fbx" }),
            // new Assets({ size: 8608441, type: "gltf", id: "photogrammetry", path: "/Assets/model/GLB_sibamata_low_bake_2.glb" }),
            // new Assets({ size: 50000, type: "sound", id: "se_contact", path: "/Assets/sounds/contact.mp3" }),

            // new Assets({ size: 10000, type: "texture", wrapmode: RepeatWrapping, id: "uv_test", path: "/Assets/T_UV_grid_directx.jpg" }),
            // new Assets({ size: 10000, type: "texture", wrapmode: RepeatWrapping, id: "number", path: "/Assets/T_NumberTexture.png" }),

            // new Assets({ size: 10000, type: "texture", wrapmode: RepeatWrapping, id: "madagascar_line", path: "/Assets/data/Madagascar_line.png" }),
            // new Assets({ size: 10000, type: "texture", wrapmode: RepeatWrapping, id: "world", path: "/Assets/data/Madagascar_line_wide.png" }),

            // new Assets({ size: 10000, type: "texture", wrapmode: RepeatWrapping, id: "canvas_test", path: "/Assets/T_CanvasTest.png" }),
        ];


        const assets = {}

        let count = 0;
        let compCount = 0;

        let totalSize = 0.0;
        ASSET_LIST.forEach(v => {
            totalSize += v.size;
        });
        let totalLoaded = 0.0;
        const loadStart = () => {
            // console.log("loadStart: " + count)

            if (count >= ASSET_LIST.length) return;
            const asset = ASSET_LIST[count];
            // console.log(asset.id)
            count += 1;

            // console.log(totalLoaded, totalSize)

            switch (asset.type) {
                case "gltf":
                    let loaded = 0.0;
                    const loader = new GLTFLoader();
                    loader.load(process.env.PUBLIC_URL + asset.path, function (gltf) {
                        assets[asset.id] = gltf;
                        // totalLoaded += asset.size;
                        // window.REF_setLoadProgress(totalLoaded / totalSize);
                        loadComp();
                    }, (e) => {
                        totalLoaded += (e.loaded - loaded);
                        loaded = e.loaded;
                        window.REF_setLoadProgress(totalLoaded / totalSize);
                        DebugLogController.addLog(e.loaded);
                    }, handleError);
                    break;

                case "fbx":
                    const fbxloader = new FBXLoader();
                    fbxloader.load(process.env.PUBLIC_URL + asset.path, function (gltf) {
                        assets[asset.id] = gltf;
                        totalLoaded += asset.size;
                        window.REF_setLoadProgress(totalLoaded / totalSize);
                        loadComp();
                    }, (e) => {
                        // window.REF_setLoadProgress((totalLoaded + e.loaded) / totalSize);
                        DebugLogController.addLog(e.loaded);
                    }, handleError);
                    break;

                case "texture":
                    new TextureLoader().load(process.env.PUBLIC_URL + asset.path, texture => {
                        texture.wrapS = texture.wrapT = asset.wrapmode;
                        assets[asset.id] = texture;
                        totalLoaded += asset.size;
                        window.REF_setLoadProgress(totalLoaded / totalSize);

                        loadComp();
                    }, null, handleError);
                    break;

                case "sound":
                    const sound = new Pizzicato.Sound({
                        source: 'file',
                        options: { path: process.env.PUBLIC_URL + asset.path }
                    }, () => {
                        if (asset.id == 'bgm') sound.loop = true;
                        assets[asset.id] = sound;
                        sound.volume = 0.5;
                        totalLoaded += asset.size;
                        window.REF_setLoadProgress(totalLoaded / totalSize);

                        loadComp();
                    });
                    break;
            }
        }

        const loadComp = () => {
            if (isComplete) return;
            compCount += 1;
            if (compCount >= ASSET_LIST.length) {

                isComplete = true;
                DebugLogController.init();
                DebugLogController.addLog("comp");

                AssetsLoaderController.assets = assets;
                window.AssetsLoaderController = AssetsLoaderController;

                success(assets);
            } else {
                loadStart();
            }
        }

        const handleError = e => {
            error(e);
        }

        loadStart();
        // loadStart();
        // loadStart();
        // loadStart();
        // loadStart();
    }

}

export default AssetsLoaderController;