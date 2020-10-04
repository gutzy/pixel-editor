import {FileAction} from "./abstracts/Actions";
import EventBus from "../utils/EventBus";
import History from "./History";
import {comboIs} from "../utils/InputUtils";
import SelectColor from "../actions/file/selection/SelectColor";
import SelectLayer from "../actions/file/layers/SelectLayer";
import AddLayer from "../actions/file/layers/AddLayer";
import DeleteLayer from "../actions/file/layers/DeleteLayer";
import RenameLayer from "../actions/file/layers/RenameLayer";
import MergeLayerBelow from "../actions/file/layers/MergeLayerBelow";
import FlattenVisibleLayers from "../actions/file/layers/FlattenVisibleLayers";
import FlattenAllLayers from "../actions/file/layers/FlattenAllLayers";
import ToggleLayerVisibility from "../actions/file/layers/ToggleLayerVisibility";
import ToggleLayerLock from "../actions/file/layers/ToggleLayerLock";
import Undo from "../actions/file/history/Undo";
import Redo from "../actions/file/history/Redo";
import LoadContents from "../actions/file/history/LoadContents";
import SelectArea from "../actions/file/selection/SelectArea";
import SelectAreaSolidify from "../actions/file/selection/SelectAreaSolidify";

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
        this.selectionCanvas = null;
        this.toolSelectionCanvas = null;

        this.activeLayer = -1;
        this.selectedTool = null;
        this.color = null;
        this.persistenceTimeout = null;

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
        EventBus.$on('select-area', (...a) => this.doAction(SelectArea, ...a));
        EventBus.$on('shrink-area', (...a) => this.doAction(SelectArea, ...a));
        EventBus.$on('expand-area', (...a) => this.doAction(SelectArea, ...a));
        EventBus.$on('select-area-solidify', (...a) => this.doAction(SelectAreaSolidify, ...a));
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
        this.historyIndex = this.history.saveState(this.layers, this.activeLayer, this.historyIndex, this.toolSelectionCanvas);
    }

    resetLayers() {
        this.layers = [];
    }

    loadContents(contents) {
        this.doAction(LoadContents, contents);
    }

    onKeyCombination(combo) {
        if (!this.isActiveFile) return false;

        if (comboIs(combo, 'ctrl','z')) { this.doAction(Undo); }
        else if (comboIs(combo, 'ctrl','shift', 'z') || comboIs(combo, 'ctrl','y')) { this.doAction(Redo); }
    }

    onSaveHistoryRequest() {
        if (!this.isActiveFile) return false;
        this.saveHistory();
    }
}
