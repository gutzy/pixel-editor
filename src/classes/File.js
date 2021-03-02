/**
 * File wrapper.
 * A file = data for an edited pixel drawing.
 * This class holds a single file, including its name, history, layers, palette and any other serializable setting.
 * Similar to a canvas wrapper, it allows running FileActions on a file.
 *
 */
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
import SaveHistory from "../actions/file/history/SaveHistory";
import ResetLayers from "../actions/file/layers/ResetLayers";
import SortLayers from "../actions/file/layers/SortLayers";

const DEBUG = false;

export default class File {

    /**
     * constructor
     * @param {number} width - px width of current drawing
     * @param {number} height - px height of current drawing
     * @param {string} editorMode - editor mode, basic/advanced
     * @param {Object} contents - optional - the contents of the file. An object with all the info related to the drawing.
     */
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
        this.dragOffset = {x:0, y:0};

        this.history = new History();
        this.toolCanvas = null;
        this.selectionCanvas = null;
        this.toolSelectionCanvas = null;

        this.activeLayer = -1;
        this.selectedTool = null;
        this.color = null;

        this.init();
    }

    /**
     * Initialize the file
     */
    init() {
        this.bindListeners();

        // reset all file layers
        this.doAction(ResetLayers);

        // if file has contents, now is the time to load them
        if (this.contents) {
            this.doAction(LoadContents, this.contents);
        }

        // Otherwise, create a first empty layer, and save the empty, one-layer file to history as the base state
        else {
            const layer = this.doAction(AddLayer,'Layer 1');
            EventBus.$emit('ui-select-layer', layer);
            this.doAction(SaveHistory);
        }
    }

    /**
     * Bind all events to their designated file actions
     */
    bindListeners() {
        EventBus.$on('input-key-combination', this.onKeyCombination.bind(this));
        EventBus.$on('sort-layers', (...a) => this.doAction(SortLayers, ...a));
        EventBus.$on('save-history', (...a) => this.doAction(SaveHistory, ...a));
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

    /**
     * Run a file action on a file
     */
    doAction(action, ...params) {
        if (!this.isActiveFile) return false;

        const a = new action();
        if (!(a instanceof FileAction)) {
            throw new Error("Not a file action!");
        }
        return a.do(this, ...params);
    }

    /**
     * Focus - set this file as the active file.
     * This doesn't do a lot until we have tabbed files etc
     */
    focus() {
        this.isActiveFile = true;
        EventBus.$emit("ui-zoom", this.zoom);
        EventBus.$emit("reset-canvas", this.width, this.height);
    }

    /**
     * Blur - unset this file as the active file.
     * This doesn't do a lot until we have tabbed files etc
     */
    blur() {
        this.isActiveFile = false;
    }

    /**
     * OnKeyCombination
     * Initializes ctrl-z for Undo and ctrl-y/ctrl-shift-z for Redo
     */
    onKeyCombination(combo) {
        if (!this.isActiveFile) return false;

        if (comboIs(combo, 'ctrl','z')) { this.doAction(Undo); }
        else if (comboIs(combo, 'ctrl','shift', 'z') || comboIs(combo, 'ctrl','y')) { this.doAction(Redo); }
    }

}
