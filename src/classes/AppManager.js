/**
 * App Manager
 * This is the main application class, a wrapper that handles running an instance of the pixel editor.
 * It is immediately initialized into a singleton instance, as we don't want more than one pixel editor at once for now.
 *
 */
import EventBus from "../utils/EventBus";
import Input from "./Input";
import MainCanvas from "./MainCanvas";
import {getCenterRect, isXYinRect, screenToRectXY} from "../utils/CanvasUtils";
import Tools from "../config/Tools";
import Menu from "../config/Menu";
import {AppAction} from "./abstracts/Actions";
import NewFile from "../actions/app/NewFile";
import SetToolCursor from "../actions/app/SetToolCursor";
import StartTool from "../actions/file/tools/StartTool";
import StopTool from "../actions/file/tools/StopTool";
import UseTool from "../actions/file/tools/UseTool";
import SetTool from "../actions/file/tools/SetTool";
import Redraw from "../actions/file/Redraw";
import HoverTool from "../actions/file/tools/HoverTool";

class _AppManager {

    constructor() {
        this.canvas = null;
        this.input = null;
        this.file = null;
        this.tools = null;
        this.menu = null;

        this.persistentLoop = null;
        this.loopCount = 0;
    }

    /**
     * Initialize the application with given canvas element
     * @param canvasEl - pointer to the main HTML Canvas element
     */
    init(canvasEl) {
        this.loadAppConfig();
        this.bindElements(canvasEl);
        this.bindListeners();
        this.startLoop();

        // Create the first file
        const file = this.doAction(NewFile,320, 240, 'advanced', 'Funky test', ["#ff0000", "#ffe21f", "#46ca35", "#ffffff", "#000000"]);

        // Set file color
        file.color = '#ff0000';
    }

    /**
     * Load main application configuration
     * load tools and menu settings from the Tools and Menu /config files
     */
    loadAppConfig() {
        this.tools = Tools.map(t => new t());
        EventBus.$emit("ui-set-tools", this.tools);

        this.menu = Menu;
        EventBus.$emit("ui-set-menu", this.menu);
    }

    /**
     * bind the main canvas to a general canvas wrapper
     * @param canvasEl - pointer to the main HTML Canvas element
     */
    bindElements(canvasEl) {
        this.canvas = new MainCanvas(canvasEl);
    }

    /**
     * Start the persistence loop
     */
    startLoop() {
        clearTimeout(this.persistentLoop);
        this.persistentLoop = setTimeout(() => this.loop(), 25);
    }

    /**
     * One iteration of the persistence loop.
     * Emits a 'loop' event, that all active persistent tools can detect.
     */
    loop() {
        clearTimeout(this.persistentLoop);
        // emit loop event to any active persistent tool
        EventBus.$emit('loop', this.loopCount);

        // redraw canvas
        if (this.file && this.file.selectionCanvas) this.onRedrawCanvas();

        // increase loop iteration
        ++this.loopCount;

        // re-run persistence loop
        this.persistentLoop = setTimeout(() => this.loop(), 25);
    }

    /**
     * Bind all input methods from input class to the designated AppManager methods
     */
    bindListeners() {

        this.input = new Input(this.canvas);
        this.input.bindInputs();

        EventBus.$on("input-mouse-down", this.onMouseDown.bind(this));
        EventBus.$on("input-mouse-up", this.onMouseUp.bind(this));
        EventBus.$on("input-key-down", this.onKeyDown.bind(this));
        EventBus.$on("input-key-up", this.onKeyUp.bind(this));
        EventBus.$on("input-mouse-move", this.onMouseMove.bind(this));
        EventBus.$on("reset-canvas", this.onResetCanvas.bind(this));
        EventBus.$on("redraw-canvas", this.onRedrawCanvas.bind(this));
        EventBus.$on('try-selecting-tool', this.onSelectTool.bind(this));
        EventBus.$on('set-tool-cursor', this.onSetToolCursor.bind(this));
        EventBus.$on('run-menu-item', this.onRunMenuItem.bind(this));
    }

    /**
     * Run an app action on the app
     * @param action
     * @param params
     * @return {*}
     */
    doAction(action, ...params) {

        const a = new action();
        if (!(a instanceof AppAction)) {
            throw new Error("Not an app action!");
        }
        return a.do(this, ...params);
    }

    /**
     * proxy a mousedown event from the app to the active file
     * @param x - cursor x position
     * @param y - cursor y position
     */
    async onMouseDown(x,y) {
        // get position
        const r = getCenterRect(this.canvas.el, this.file.width,this.file.height, this.file.zoom, this.file.dragOffset);
        let pos = screenToRectXY(r, x, y);
        // Check that the click was within bounds, unless the tool can be used outside the bounds.
        if (this.file && this.file.selectedTool && (isXYinRect(r,x,y) || (this.file.selectedTool && this.file.selectedTool.useOutside))) {
            // Run Start Tool action
        	if (this.file.selectedTool.useOutside) await this.file.doAction(StartTool, x, y);
            else await this.file.doAction(StartTool, pos.x, pos.y);
		}

        EventBus.$emit('redraw-canvas');
    }
    /**
     * proxy a mouseup event from the app to the active file
     * @param x - cursor x position
     * @param y - cursor y position
     */
    async onMouseUp(x,y) {
        // get position
        const r = getCenterRect(this.canvas.el, this.file.width,this.file.height, this.file.zoom, this.file.dragOffset);
        let pos = screenToRectXY(r, x, y);
        if (this.file) {
            if (this.file.selectedTool && this.file.selectedTool.useOutside) await this.file.doAction(StopTool, x, y);
            // Run Stop Tool action
            else await this.file.doAction(StopTool, pos.x, pos.y);
        }

        EventBus.$emit('redraw-canvas');
    }

    /**
     * proxy a mousemove event from the app to the active file
     * @param x - cursor x position
     * @param y - cursor y position
     */
    async onMouseMove(x,y) {
        // get position
        const r = getCenterRect(this.canvas.el, this.file.width,this.file.height, this.file.zoom, this.file.dragOffset);
        let pos = screenToRectXY(r, x, y);

        // run tool hover action
        this.file.doAction(HoverTool,pos.x, pos.y);
        // check if mouse is still clicked and cursor is within the drawing bounds, unless the tool can be used outside the bounds.
        if (this.input.isMouseDown() && this.file && (isXYinRect(r,x,y) || (this.file.selectedTool && this.file.selectedTool.useOutside))) {

            // Run Use Tool action
            if (this.file.selectedTool && this.file.selectedTool.useOutside) await this.file.doAction(UseTool, x, y);
            else await this.file.doAction(UseTool,pos.x, pos.y);
            EventBus.$emit('redraw-canvas');
        }
    }

    /**
     * proxy a canvas reset to the main canvas
     * @param width - canvas width
     * @param height - canvas height
     */
    onResetCanvas(width, height) {
        if (this.canvas) {
            this.canvas.reset(width, height);
        }
    }

    /**
     * onKeyDown - Look for tool hotkeys or spicykeys (tool active only when key held) to set tool
     * @param key - designated key
     * @param input - input helper class
     */
    onKeyDown(key, input) {
        if (!this.file) return false;
        if (input.isKeyDown("Alt")) return false;

        // iterate tools
        for (let tool of this.tools) {
            // if hotkey belongs to tool, switch to the tool
            if (tool.hotkey === key) {
                this.file.doAction(SetTool, tool);
                EventBus.$emit('try-selecting-tool', tool.name);
                return true;
            }

            // if spicykey belongs to tool, switch to the tool until key is released
            if (tool.spicykey === key) {
                this.file.spicy = this.file.selectedTool;
                this.file.doAction(SetTool, tool);
                EventBus.$emit('try-selecting-tool', tool.name);
                return true;
            }
        }
    }

    /**
     * onKeyUp - Look for spicykeys (tool active only when key held) to cancel
     * @param key - designated key
     */
    onKeyUp(key) {
        for (let tool of this.tools) {
            // Look for a released active spicy tool
            if (tool.spicykey === key && this.file.spicy) {

                // restore old tool
                this.file.doAction(SetTool, this.file.spicy);

                // run selection event for UI etc.
                EventBus.$emit('try-selecting-tool', this.file.spicy.name);

                // reset spicy key
                this.file.spicy = null;
            }
        }
    }

    /**
     * Redraw canvas, if file exists
     * @return boolean
     */
    onRedrawCanvas() {
        if (!this.file) return false;
        this.file.doAction(Redraw, this.canvas, this.loopCount);
    }

    /**
     * on select tool - set tool to named tool, if possible.
     *
     * @param toolName - the tool to try to select
     * @params - additional tool settings
     * @return boolean
     */
    onSelectTool(toolName, ...params) {
        if (!this.file) return false;
        // look for a given tool
        const tool = this.tools.find(t => t.name === toolName);

        if (tool) {
            this.file.doAction(SetTool, tool, ...params);

            // update UI
            EventBus.$emit('ui-select-tool', toolName);

            // update tool cursor
            if (tool.cursor) {  this.doAction(SetToolCursor, tool) }

        }
    }

    /**
     * proxy tool cursor selection to active file
     * @param cursor - image or system cursor name
     * @return boolean
     */
    onSetToolCursor(cursor) {
        if (!this.file) return false;
        if (this.file && this.file.selectedTool) { this.doAction(SetToolCursor, this.file.selectedTool, cursor) }
    }

    /**
     * Launch a menu item entry, with its callback pointing to the menu entry's configured scope
     * @param item
     * @return boolean
     */
    onRunMenuItem(item) {
        switch (item.scope) {
            // Runs menu action on the app... AppAction()
            case "app":
                if (item.action) this.doAction(item.action);
                if (item.emit) EventBus.$emit(item.emit);
                break;
            // Runs menu action on current file... FileAction(this.file, ...params)
            case "file":
                if (!this.file) return false;
                if (item.action) this.file.doAction(item.action);
                if (item.emit) EventBus.$emit(item.emit);
                break;
            // Runs menu action on current layer (tgt)... FileAction(this.file, tgt, ...params)
            case "layer":
                if (!this.file) return false;
                let tgt = this.file.layers[this.file.activeLayer];

                // Extra-refinement to a more specific 2nd FileAction parameter in the target layer (name etc.)
                if (item.scopeParam) tgt = tgt[item.scopeParam];

                if (item.action) this.file.doAction(item.action, tgt);
                if (item.emit) EventBus.$emit(item.emit, tgt);
                break;
        }
    }
}

// Create singleton instance - we will only ever have one appManager
const AppManager = new _AppManager();

export default AppManager;
