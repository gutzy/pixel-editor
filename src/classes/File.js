import Layer from "./Layer";
import {FileAction} from "./abstracts/Actions";
import EventBus from "../utils/EventBus";
import ClearCanvas from "../actions/canvas/ClearCanvas";
import DrawMainCanvasBoundaries from "../actions/canvas/DrawMainCanvasBoundaries";
import PutImage from "../actions/canvas/PutImage";
import {getCenterRect} from "../utils/CanvasUtils";
import DrawImage from "../actions/canvas/DrawImage";
import Pencil from "../tools/Pencil";
import Fill from "../tools/Fill";

const DEBUG = false;

export default class File {

    constructor(width, height, editorMode, contents = null) {

        this.name = null;
        this.width = width;
        this.height = height;
        this.editorMode = editorMode;
        this.contents = contents;
        this.layers = [];

        this.activeLayer = null;
        this.selectedTool = null;
        this.color = null;

        this.init();

        EventBus.$on('input-key-down', (key) => {
            switch (key) {
                case 'p': this.setTool(Pencil); break;
                case 'f': this.setTool(Fill); break;
            }
        })
    }

    doAction(action, ...params) {
        if (!(action instanceof FileAction)) {
            throw new Error("Not a file action!");
        }
        return new action().do(this, ...params);
    }

    focus() {
        EventBus.$emit("reset-canvas", this.width, this.height);
    }

    blur() {

    }

    init() {
        this.resetLayers();

        if (this.contents) {
            this.loadContents();
        }
        else {
            this.addLayer('Background');
        }
    }

    addLayer(name = 'Untitled Layer') {
        const layer = new Layer(this, null, name);
        layer.inflate();
        this.layers.push(layer);
        this.activeLayer = layer;
    }

    redraw(canvas) {
        const r = getCenterRect(canvas.el, this.width, this.height);
        let img;
        canvas.doAction(DrawMainCanvasBoundaries);
        canvas.ctx.globalAlpha = 255;
        for (let i = 0; i < this.layers.length; i++) {
            img = this.layers[i].getImage();
            canvas.doAction(DrawImage, img, r[0],r[1]);
        }
    }

    setTool(tool, ...params) {
        this.selectedTool = new tool(...params);
        console.log(this.selectedTool);
    }

    async startTool(x, y) {
        if (DEBUG) console.log("Start tool on",x,y);
        if (this.selectedTool && this.activeLayer) {
            await this.selectedTool.start(this, this.activeLayer.canvas, x, y);
        }
    }

    async stopTool(x, y) {
        if (DEBUG) console.log("Stop tool on",x,y);
        if (this.selectedTool && this.activeLayer) {
            await this.selectedTool.stop(this, this.activeLayer.canvas, x, y);
        }
    }

    async useTool(x, y) {
        if (DEBUG) console.log("Use tool on",x,y);
        if (this.selectedTool && this.activeLayer) {
            await this.selectedTool.use(this, this.activeLayer.canvas, x, y);
        }
    }

    resetLayers() {
        this.layers = [];
    }

    loadContents() {
        if (this.contents.name) this.name = this.contents.name;
        if (this.contents.layers)
            for (let layer of this.contents.layers) {
                const layer = new Layer(this, layer.contents, layer.name);
                this.layers.push(layer);
                this.activeLayer = layer;
            }
    }


}
