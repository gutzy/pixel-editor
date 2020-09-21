import Canvas from "./Canvas";
import GetImage from "../actions/canvas/GetImage";
import {LayerAction} from "./abstracts/Actions";
import DrawImage from "../actions/canvas/DrawImage";

export default class Layer {

    constructor(file, contents = null, name = "Untitled Layer") {
        this.file = file;
        this.contents = contents;
        this.name = name;

        this.locked = false;
        this.visible = true;
        this.canvas = null;
        this.data = null;
    }

    merge(layer) {

    }

    doAction(action, ...params) {
        if (!(action instanceof LayerAction)) {
            throw new Error("Not a layer action!");
        }

        return new action().do(this, ...params);
    }

    /**
     * becomes a big boy, gets its own blit canvas and can play with the main canvas
     */
    inflate(data) {

        if (!this.canvas) this.canvas = new Canvas(null, this.file.width, this.file.height);
        if (data) {
            if (data instanceof ImageData) {
                const c = document.createElement("canvas");
                c.setAttribute('width', this.file.width+'');
                c.setAttribute('height', this.file.height+'');
                c.getContext('2d').putImageData(data, 0, 0);
                data = c;
            }
            this.canvas.doAction(DrawImage, data);
        }
    }

    /**
     * shrinks into just a serialization and stands in the corner with the other boys
     */
    deflate() {
        this.data = this.canvas.doAction(GetImage);
        delete this.canvas;
    }

    getImage() {
        return this.canvas.el;
    }

    getImageData() {
        return this.canvas.doAction(GetImage);
    }

    canvasAction(action, ...params) {
        return this.canvas.doAction(action, ...params);
    }


}
