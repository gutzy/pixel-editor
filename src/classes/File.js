import Layer from "./Layer";
import {FileAction} from "./abstracts/Actions";
import EventBus from "../utils/EventBus";
import ClearCanvas from "../actions/canvas/ClearCanvas";
import DrawMainCanvasBoundaries from "../actions/canvas/DrawMainCanvasBoundaries";
import PutImage from "../actions/canvas/PutImage";
import {getCenterRect} from "../utils/CanvasUtils";
import DrawImage from "../actions/canvas/DrawImage";
import Pencil from "../tools/Pencil";
import PaintBucket from "../tools/PaintBucket";
import History from "./History";
import {comboIs} from "../utils/InputUtils";

const DEBUG = false;

export default class File {

    constructor(width, height, editorMode, contents = null) {

        this.isActiveFile = false;
        this.name = null;
        this.width = width;
        this.height = height;
        this.editorMode = editorMode;
        this.contents = contents;
        this.history = new History();
        this.historyIndex = 0;
        this.layers = [];

        this.activeLayer = null;
        this.selectedTool = null;
        this.color = null;

        this.init();
    }

    init() {
        this.bindListeners();
        this.resetLayers();

        if (this.contents) {
            this.loadContents(this.contents);
        }
        else {
            this.addLayer('Background');
            this.saveHistory();
        }
    }

    bindListeners() {
        EventBus.$on('input-key-down', (key) => {
            if (!this.isActiveFile) return false;

            switch (key) {
                case 'p': this.setTool(Pencil); break;
                case 'f': this.setTool(PaintBucket); break;
            }
        });

        EventBus.$on('input-key-combination', (combo) => {
            if (!this.isActiveFile) return false;

            if (comboIs(combo, 'ctrl','z')) { this.undo(); }
            else if (comboIs(combo, 'ctrl','shift', 'z') || comboIs(combo, 'ctrl','y')) { this.redo(); }

        });

        EventBus.$on('save-history', () => {
            if (!this.isActiveFile) return false;
            this.saveHistory();
        })
    }

    doAction(action, ...params) {
        if (!(action instanceof FileAction)) {
            throw new Error("Not a file action!");
        }
        return new action().do(this, ...params);
    }

    focus() {
        this.isActiveFile = true;
        EventBus.$emit("reset-canvas", this.width, this.height);
    }

    blur() {
        this.isActiveFile = false;
    }

    saveHistory() {
        this.historyIndex = this.history.saveState(this.layers, this.historyIndex);
        console.log("Saving", this.historyIndex)
    }

    undo() {
        if (this.historyIndex > 1) {
            this.historyIndex--;
            console.log(this.historyIndex);
            const state = this.history.getState(this.historyIndex-1);
            this.resetLayers();
            this.loadContents({name: this.name, layers: state});
            EventBus.$emit("redraw-canvas")
        }
    }

    redo() {
        console.log(this.history, this.historyIndex);
        if (this.historyIndex < this.history.snapshots.length) {
            this.historyIndex++;
            console.log(this.historyIndex);
            const state = this.history.getState(this.historyIndex-1);
            this.resetLayers();
            this.loadContents({name: this.name, layers: state});
            EventBus.$emit("redraw-canvas")
        }
    }

    addLayer(name = 'Untitled Layer', index = -1) {
        const layer = new Layer(this, null, name);
        layer.inflate();
        if (index > -1) {
            this.layers.splice(index,0,layer);
            this.activeLayer = index;
        }
        else {
            this.layers.push(layer);
            this.activeLayer = this.layers.length-1;
        }
    }

    redraw(canvas) {
        const r = getCenterRect(canvas.el, this.width, this.height);
        let img;
        canvas.doAction(ClearCanvas);
        canvas.ctx.globalAlpha = 255;
        canvas.doAction(DrawMainCanvasBoundaries, this.width, this.height);
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
        if (this.selectedTool && this.activeLayer > -1) {
            await this.selectedTool.start(this, this.layers[this.activeLayer].canvas, x, y);
        }
    }

    async stopTool(x, y) {
        if (DEBUG) console.log("Stop tool on",x,y);
        if (this.selectedTool && this.activeLayer > -1) {
            EventBus.$emit('save-history');
            await this.selectedTool.stop(this, this.layers[this.activeLayer].canvas, x, y);
        }
    }

    async useTool(x, y) {
        if (DEBUG) console.log("Use tool on",x,y);
        if (this.selectedTool && this.activeLayer > -1) {
            await this.selectedTool.use(this, this.layers[this.activeLayer].canvas, x, y);
        }
    }

    resetLayers() {
        this.layers = [];
    }

    loadContents(contents) {
        if (contents.name) this.name = contents.name;
        if (contents.layers)
            for (let l = 0; l < contents.layers.length; l++) {
                const layer = new Layer(this, contents.layers[l].contents, contents.layers[l].name);
                layer.inflate(contents.layers[l].data)
                this.layers.push(layer);
                this.activeLayer = l;
            }
    }


}
