import Canvas from "./Canvas";
import GetImage from "../actions/canvas/GetImage";
import PutImage from "../actions/canvas/PutImage";
import {LayerAction} from "./abstracts/Actions";
import DrawImage from "../actions/canvas/DrawImage";

export default class Layer {

    constructor(file, contents = null, name = "Untitled Layer") {
        this.file = file;
        this.contents = contents;
        this.name = name;

        this.visible = true;
        this.canvas = null;
        this.data = null;
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
    inflate() {
        this.canvas = new Canvas(null, this.file.width, this.file.height);
        if (this.data) this.canvas.doAction(DrawImage, this.data);
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


}
