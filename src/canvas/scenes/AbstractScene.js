class AbstractScene {

    constructor(sceneName) {
        this.sceneName = sceneName;
        this.onStateChanged = document.createElement("div");
    }

    init() {

    }

    show() {
        this.onStateChanged.dispatchEvent(new Event("SHOW_COMPLETE"));
    }

    hide() {
        this.onStateChanged.dispatchEvent(new Event("HIDE_COMPLETE"));
    }
}

export default AbstractScene;


