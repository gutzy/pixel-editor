import EventBus from "../utils/EventBus";
import Input from "./Input";
import MainCanvas from "./MainCanvas";
import {getCenterRect, screenToRectXY} from "../utils/CanvasUtils";
import Tools from "../config/Tools";
import Menu from "../config/Menu";
import {AppAction} from "./abstracts/Actions";
import NewFile from "../actions/app/NewFile";
import SetToolCursor from "../actions/app/SetToolCursor";

class _AppManager {

    constructor() {
        this.canvas = null;
        this.input = null;
        this.file = null;
        this.tools = null;
        this.menu = null;
    }

    init(canvasEl) {
        this.loadAppConfig();
        this.bindElements(canvasEl);
        this.bindListeners();

        const file = this.doAction(NewFile,320, 240, 'advanced', 'Funky test', ["#ff0000", "#ffe21f", "#46ca35", "#ffffff", "#000000"]);

        file.color = '#ff0000';
    }

    loadAppConfig() {
        this.tools = Tools.map(t => new t());
        EventBus.$emit("set-tools", this.tools);

        this.menu = Menu;
        EventBus.$emit("set-menu", this.menu);
    }

    bindElements(canvasEl) {
        this.canvas = new MainCanvas(canvasEl);
    }

    bindListeners() {

        this.input = new Input(this.canvas);
        this.input.bindInputs();

        EventBus.$on("input-mouse-down", this.onMouseDown.bind(this));
        EventBus.$on("input-mouse-up", this.onMouseUp.bind(this));
        EventBus.$on("input-key-down", this.onKeyDown.bind(this));
        EventBus.$on("input-mouse-move", this.onMouseMove.bind(this));
        EventBus.$on("reset-canvas", this.onResetCanvas.bind(this));
        EventBus.$on("redraw-canvas", this.onRedrawCanvas.bind(this));
        EventBus.$on('try-selecting-tool', this.onSelectTool.bind(this));
        EventBus.$on('set-tool-cursor', this.onSetToolCursor.bind(this));
        EventBus.$on('run-menu-item', this.onRunMenuItem.bind(this));
    }

    doAction(action, ...params) {

        const a = new action();
        if (!(a instanceof AppAction)) {
            throw new Error("Not an app action!");
        }
        return a.do(this, ...params);
    }

    async onMouseDown(x,y) {
        let pos = screenToRectXY(getCenterRect(this.canvas.el, this.file.width,this.file.height, this.file.zoom), x, y);
        if (this.file && pos) {
        	await this.file.startTool(pos.x, pos.y);
		}

        EventBus.$emit('redraw-canvas');
    }

    async onMouseUp(x,y) {
        let pos = screenToRectXY(getCenterRect(this.canvas.el, this.file.width,this.file.height, this.file.zoom), x, y);
        if (this.file) await this.file.stopTool(pos.x, pos.y);

        EventBus.$emit('redraw-canvas');
    }

    async onMouseMove(x,y) {
        let pos = screenToRectXY(getCenterRect(this.canvas.el, this.file.width,this.file.height, this.file.zoom), x, y);
        if (this.input.isMouseDown() && this.file && pos) {
            await this.file.useTool(pos.x, pos.y);
            EventBus.$emit('redraw-canvas');
        }
    }

    onResetCanvas(width, height) {
        if (this.canvas) {
            this.canvas.reset(width, height);
        }
    }

    onKeyDown(key) {
        if (!this.file) return false;

        for (let tool of this.tools) {
            if (tool.hotkey === key) {
                this.file.setTool(tool);
                EventBus.$emit('try-selecting-tool', tool.name);
                return true;
            }
        }
    }

    onRedrawCanvas() {
        if (!this.file) return false;
        this.file.redraw(this.canvas);
    }

    onSelectTool(toolName, ...params) {
        if (!this.file) return false;
        const tool = this.tools.find(t => t.name === toolName);

        if (tool) {
            this.file.setTool(tool, ...params);
            EventBus.$emit('select-tool', toolName);
            if (tool.cursor) {  this.doAction(SetToolCursor, tool) }

        }
    }

    onSetToolCursor(cursor) {
        if (!this.file) return false;
        if (this.file && this.file.selectedTool) { this.doAction(SetToolCursor, this.file.selectedTool, cursor) }
    }

    onRunMenuItem(item) {
        switch (item.scope) {
            case "app":
                if (item.action) this.doAction(item.action);
                if (item.emit) EventBus.$emit(item.emit);
                break;
            case "file":
                if (!this.file) return false;
                if (item.action) this.file.doAction(item.action);
                if (item.emit) EventBus.$emit(item.emit);
                break;
            case "layer":
                if (!this.file) return false;
                let tgt = this.file.layers[this.file.activeLayer];
                if (item.scopeParam) tgt = tgt[item.scopeParam];

                if (item.action) this.file.doAction(item.action, tgt);
                if (item.emit) EventBus.$emit(item.emit, tgt);
                break;
        }
    }
}

// Create singleton instance

const AppManager = new _AppManager();

export default AppManager;
