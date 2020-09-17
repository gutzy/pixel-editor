import Layer from "./Layer";

export default class File {

    constructor(width, height, editorMode, contents = null) {
        this.width = width;
        this.height = height;
        this.editorMode = editorMode;
        this.contents = contents;
        this.layers = [];

        this.init();
    }

    init() {
        this.resetLayers();

        if (this.contents) {
            this.loadContents();
        }
    }

    resetLayers() {
        this.layers = [];
    }

    loadContents() {
        for (let layer of this.contents.layers) {
            this.layers.push(new Layer(this, layer.contents, layer.name));
        }
    }


}
