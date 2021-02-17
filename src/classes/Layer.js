/**
 * Layer wrapper class.
 * Contains the layer name and contents, and when inflated also the layer's canvas.
 */
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
     * becomes a big boy, gets its own blit canvas and can play with the main canvas.
     * This creates the array canvas and puts any loaded content into it
     *
     * @param data - optional ImageData to draw on array. Usually the packed contents of a saved file.
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
     *  get image - return the layer's canvas element
     * @return HTMLCanvasElement
     */
    getImage() {
        return this.canvas.el;
    }

    /**
     * getImageData - return the layer's ImageData object
     * @return ImageData
     */
    getImageData() {
        return this.canvas.doAction(GetImage);
    }

    /**
     * Runs a canvas action on the layer's canvas.
     * Useful when interacting with different layers.
     */
    canvasAction(action, ...params) {
        return this.canvas.doAction(action, ...params);
    }


}
