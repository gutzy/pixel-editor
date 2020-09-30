import {FileAction} from "./abstracts/Actions";
import EventBus from "../utils/EventBus";
import History from "./History";
import {comboIs} from "../utils/InputUtils";
import Canvas from "./Canvas";
import SelectColor from "../actions/file/SelectColor";
import SelectLayer from "../actions/file/SelectLayer";
import AddLayer from "../actions/file/AddLayer";
import DeleteLayer from "../actions/file/DeleteLayer";
import RenameLayer from "../actions/file/RenameLayer";
import MergeLayerBelow from "../actions/file/MergeLayerBelow";
import FlattenVisibleLayers from "../actions/file/FlattenVisibleLayers";
import FlattenAllLayers from "../actions/file/FlattenAllLayers";
import ToggleLayerVisibility from "../actions/file/ToggleLayerVisibility";
import ToggleLayerLock from "../actions/file/ToggleLayerLock";
import Undo from "../actions/file/Undo";
import Redo from "../actions/file/Redo";
import Redraw from "../actions/file/Redraw";
import LoadContents from "../actions/file/LoadContents";

const DEBUG = false;

export default class File {

    constructor(width, height, editorMode, contents = null) {

        this.isActiveFile = true;
        this.name = null;
        this.palette = null;
        this.width = width;
        this.height = height;
        this.editorMode = editorMode;
        this.contents = contents;
        this.historyIndex = 0;
        this.layers = [];
        this.zoom = 1;
        this.dragOffset = [0, 0];

        this.history = new History();
        this.toolCanvas = null;
        this.toolStarted = false;

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
            const layer = this.doAction(AddLayer,'Layer 1');
            EventBus.$emit('select-layer', layer);
            this.saveHistory();
        }
    }

    bindListeners() {
        EventBus.$on('input-key-combination', this.onKeyCombination.bind(this));
        EventBus.$on('save-history', this.onSaveHistoryRequest.bind(this));
        EventBus.$on('try-toggling-layer-visibility', (...a) => this.doAction(ToggleLayerVisibility, ...a));
        EventBus.$on('try-toggling-layer-lock', (...a) => this.doAction(ToggleLayerLock, ...a));

        EventBus.$on('try-selecting-color', (...a) => this.doAction(SelectColor, ...a));
        EventBus.$on('try-selecting-layer', (...a) => this.doAction(SelectLayer, ...a));
        EventBus.$on('try-adding-layer', (...a) => this.doAction(AddLayer, ...a));
        EventBus.$on('try-deleting-layer', (...a) => this.doAction(DeleteLayer, ...a));
        EventBus.$on('try-renaming-layer', (...a) => this.doAction(RenameLayer, ...a));
        EventBus.$on('try-merging-layer-below', (...a) => this.doAction(MergeLayerBelow, ...a));
        EventBus.$on('try-flatten-visible-layers', (...a) => this.doAction(FlattenVisibleLayers, ...a));
        EventBus.$on('try-flatten-all-layers', (...a) => this.doAction(FlattenAllLayers, ...a));
    }

    doAction(action, ...params) {
        if (!this.isActiveFile) return false;

        const a = new action();
        if (!(a instanceof FileAction)) {
            throw new Error("Not a file action!");
        }
        return a.do(this, ...params);
    }

    focus() {
        this.isActiveFile = true;
        EventBus.$emit("zoom", this.zoom);
        EventBus.$emit("reset-canvas", this.width, this.height);

    }

    blur() {
        this.isActiveFile = false;
    }

    saveHistory() {
        this.historyIndex = this.history.saveState(this.layers, this.historyIndex);
    }

    undo() {this.doAction(Undo) }
    redo() { this.doAction(Redo) }
    redraw(canvas) { this.doAction(Redraw, canvas) }

    setTool(tool, ...params) {
        if (this.selectedTool) {
            this.selectedTool.selected = false;
        }
        this.selectedTool = tool;
        tool.params = params;
        tool.selected = true;
    }

    async startTool(x, y) {
        if (DEBUG) console.log("Start tool on",x,y);
        if (this.selectedTool && this.activeLayer > -1 && !this.layers[this.activeLayer].locked) {
            this.toolStarted = true;
            this.toolCanvas = new Canvas(null, this.width, this.height);
            await this.selectedTool.start(this, this.layers[this.activeLayer].canvas, x / this.zoom, y / this.zoom);
        }
    }

    async stopTool(x, y) {
        if (DEBUG) console.log("Stop tool on",x,y);
        if (this.selectedTool && this.activeLayer > -1 && !this.layers[this.activeLayer].locked && this.toolStarted) {
            this.toolStarted = false;
            this.toolCanvas = null;
            await this.selectedTool.stop(this, this.layers[this.activeLayer].canvas, x / this.zoom, y / this.zoom);
            EventBus.$emit('update-layers', this.layers);
            EventBus.$emit('save-history');
        }
    }

    async useTool(x, y) {
        if (DEBUG) console.log("Use tool on",x,y);
        if (this.selectedTool && this.activeLayer > -1 && !this.layers[this.activeLayer].locked) {
            await this.selectedTool.use(this, this.layers[this.activeLayer].canvas, x / this.zoom, y / this.zoom, this.toolCanvas);
        }
    }

    resetLayers() {
        this.layers = [];
    }

    loadContents(contents) {
        this.doAction(LoadContents, contents);
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
}
