import Layer from "./Layer";
import {FileAction} from "./abstracts/Actions";
import EventBus from "../utils/EventBus";
import ClearCanvas from "../actions/canvas/ClearCanvas";
import DrawMainCanvasBoundaries from "../actions/canvas/DrawMainCanvasBoundaries";
import {getCenterRect} from "../utils/CanvasUtils";
import DrawImage from "../actions/canvas/DrawImage";
import History from "./History";
import {comboIs} from "../utils/InputUtils";
import Canvas from "./Canvas";
import GetImage from "../actions/canvas/GetImage";

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
        this.toolCanvas = null;

        this.activeLayer = -1;
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
            const layer = this.addLayer('Layer 1');
            EventBus.$emit('select-layer', layer);
            this.saveHistory();
        }
    }

    bindListeners() {
        EventBus.$on('input-key-combination', this.onKeyCombination.bind(this));
        EventBus.$on('save-history', this.onSaveHistoryRequest.bind(this));
        EventBus.$on('try-selecting-layer', this.onTrySelectingLayer.bind(this));
        EventBus.$on('try-adding-layer', this.onTryAddingLayer.bind(this));
        EventBus.$on('try-toggling-layer-visibility', this.onTryTogglingLayerVisibility.bind(this));
        EventBus.$on('try-toggling-layer-lock', this.onTryTogglingLayerLock.bind(this));
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
    }

    undo() {
        if (this.historyIndex > 1) {
            this.historyIndex--;
            const state = this.history.getState(this.historyIndex-1);
            this.resetLayers();
            this.loadContents({name: this.name, layers: state});
            EventBus.$emit("redraw-canvas")
        }
    }

    redo() {
        if (this.historyIndex < this.history.snapshots.length) {
            this.historyIndex++;
            const state = this.history.getState(this.historyIndex-1);
            this.resetLayers();
            this.loadContents({name: this.name, layers: state});
            EventBus.$emit("redraw-canvas")
        }
    }

    addLayer(name = 'Untitled Layer', index = -1) {

        if (index === -1) index = this.activeLayer+1;

        console.log(index);
        let existing = this.layers.find(l => l.name === name);
        while (existing) {
            let match = name.match(/([0-9]+)$/);
            if (match) {
                name = name.replace(/([0-9]+)$/, match[0]*1+1)
            }
            else {
                name = name + ' 2';
            }
            existing = this.layers.find(l => l.name === name);
        }

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

        EventBus.$emit("update-layers", this.layers);
        EventBus.$emit('select-layer', this.layers[this.activeLayer]);
        return layer;
    }

    redraw(canvas) {
        const r = getCenterRect(canvas.el, this.width, this.height);
        let img;
        canvas.doAction(ClearCanvas);
        canvas.ctx.globalAlpha = 255;
        canvas.doAction(DrawMainCanvasBoundaries, this.width, this.height);
        for (let i = 0; i < this.layers.length; i++) {
            if (this.layers[i].visible) {
                img = this.layers[i].getImage();
                canvas.doAction(DrawImage, img, r[0],r[1]);
            }
        }
        if (this.toolCanvas) {
            canvas.doAction(DrawImage, this.toolCanvas.el, r[0], r[1]);
        }
    }

    setTool(tool, ...params) {
        this.selectedTool = tool;
        tool.params = params;
    }

    async startTool(x, y) {
        if (DEBUG) console.log("Start tool on",x,y);
        if (this.selectedTool && this.activeLayer > -1 && !this.layers[this.activeLayer].locked) {
            this.toolCanvas = new Canvas(null, this.width, this.height);
            await this.selectedTool.start(this, this.layers[this.activeLayer].canvas, x, y);
        }
    }

    async stopTool(x, y) {
        if (DEBUG) console.log("Stop tool on",x,y);
        if (this.selectedTool && this.activeLayer > -1 && !this.layers[this.activeLayer].locked) {
            this.toolCanvas = null;
            EventBus.$emit('save-history');
            await this.selectedTool.stop(this, this.layers[this.activeLayer].canvas, x, y);
        }
    }

    async useTool(x, y) {
        if (DEBUG) console.log("Use tool on",x,y);
        if (this.selectedTool && this.activeLayer > -1 && !this.layers[this.activeLayer].locked) {
            await this.selectedTool.use(this, this.layers[this.activeLayer].canvas, x, y, this.toolCanvas);
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

    onKeyCombination(combo) {
        if (!this.isActiveFile) return false;

        if (comboIs(combo, 'ctrl','z')) { this.undo(); }
        else if (comboIs(combo, 'ctrl','shift', 'z') || comboIs(combo, 'ctrl','y')) { this.redo(); }
    }

    onSaveHistoryRequest() {
        if (!this.isActiveFile) return false;
        this.saveHistory();
    }

    onTrySelectingLayer(layerName) {
        if (!this.isActiveFile) return false;

        for (let l = 0; l < this.layers.length; l++) {
            if (this.layers[l].name === layerName) {
                this.activeLayer = l;
                EventBus.$emit('select-layer', this.layers[l]);
                return true;
            }
        }
    }

    onTryAddingLayer() {
        this.addLayer('Layer 1');
        EventBus.$emit('update-layers', this.layers);
    }

    onTryTogglingLayerLock(layerName) {
        if (!this.isActiveFile) return false;
        for (let l = 0; l < this.layers.length; l++) {
            if (this.layers[l].name === layerName) {
                this.layers[l].locked = !(this.layers[l].locked);
                EventBus.$emit('update-layers', this.layers);
                return true;
            }
        }
    }

    onTryTogglingLayerVisibility(layerName) {
        if (!this.isActiveFile) return false;
        for (let l = 0; l < this.layers.length; l++) {
            if (this.layers[l].name === layerName) {
                this.layers[l].visible = !(this.layers[l].visible);
                EventBus.$emit('update-layers', this.layers);
                return true;
            }
        }
    }


}
