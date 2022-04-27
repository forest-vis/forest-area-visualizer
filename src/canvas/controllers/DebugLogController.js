import { RepeatWrapping, TextureLoader } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class Assets {
    constructor(params) {
        this.type = params.type;
        this.id = params.id;
        this.path = params.path;
        this.wrapmode = params.wrapmode;
    }
}

class DebugLogController {

    static addLog(text) {
        return;
        this.logs.unshift(text);
        if (this.logs.length > 20) {
            this.logs.length = 20;
        }

        let message = "";
        this.logs.forEach((v, i) => {
            message += "<p>" + v + "</p>";
        });
        this.container.innerHTML = message;
    }

    static init() {

        this.logs = [];
        this.container = document.getElementById("LogContainer");
        // console.log(this.container);
    }

}

DebugLogController.init();
export default DebugLogController;