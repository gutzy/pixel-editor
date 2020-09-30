import EventBus from "../utils/EventBus";
import Input from "./Input";
import File from "./File";
import MainCanvas from "./MainCanvas";
import {getCenterRect, screenToRectXY} from "../utils/CanvasUtils";
import Tools from "../config/Tools";
import SetCursor from "../actions/canvas/SetCursor";

class _AppManager {

    constructor() {
        this.canvas = null;
        this.input = null;
        this.file = null;
        this.tools = null;
    }

    init(canvasEl) {
        this.loadAppConfig();
        this.bindElements(canvasEl);
        this.bindListeners();

        const file = this.newFile(320, 240, 'advanced', 'Funky test', ["#ff0000", "#ffe21f", "#46ca35", "#ffffff", "#000000"]);

        file.color = '#ff0000';
    }

    loadAppConfig() {
        this.tools = Tools.map(t => new t());
        EventBus.$emit("set-tools", this.tools);
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
    }

    newFile(width, height, editorMode, name = 'Untitled', palette) {
        const file = new File(width, height, editorMode);
        file.name = name;
        file.palette = palette;
        EventBus.$emit('set-palette', palette);
        EventBus.$emit("new-file", this.file);
        this.loadFile(file);
        return file;
    }

    loadFile(file) {
        if (this.file) this.file.blur();

        this.file = file;
        this.file.focus();

        EventBus.$emit("load-file", this.file);
    }

    setToolCursor(tool, cursor = null, cursorOffset = null) {
        cursor = (cursor === null ? tool.cursor : cursor);
        cursorOffset = (cursorOffset === null ? tool.cursorOffset : cursorOffset);
        if (tool.cursor) this.canvas.doAction(SetCursor, cursor, cursorOffset);
        else this.canvas.doAction(SetCursor, 'default');
    }

    async onMouseDown(x,y) {
        let pos = screenToRectXY(getCenterRect(this.canvas.el, this.file.width,this.file.height), x, y);
        if (this.file && pos) {
        	await this.file.startTool(pos.x, pos.y);
		}

        EventBus.$emit('redraw-canvas');
    }

    async onMouseUp(x,y) {
        let pos = screenToRectXY(getCenterRect(this.canvas.el, this.file.width,this.file.height), x, y);
        if (this.file) await this.file.stopTool(pos.x, pos.y);

        EventBus.$emit('redraw-canvas');
    }

    async onMouseMove(x,y) {
        let pos = screenToRectXY(getCenterRect(this.canvas.el, this.file.width,this.file.height), x, y);
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
            if (tool.cursor) {  this.setToolCursor(tool) }

        }
    }

    onSetToolCursor(cursor) {
        if (!this.file) return false;
        if (this.file && this.file.selectedTool) { this.setToolCursor(this.file.selectedTool, cursor) }
    }
}

// Create singleton instance

const AppManager = new _AppManager();

export default AppManager;
