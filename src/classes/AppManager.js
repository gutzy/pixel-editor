import EventBus from "../utils/EventBus";
import Input from "./Input";
import File from "./File";
import MainCanvas from "./MainCanvas";
import {getCenterRect, screenToRectXY} from "../utils/CanvasUtils";
import PaintBucket from "../tools/PaintBucket";
import Pencil from "../tools/Pencil";

class _AppManager {

    constructor() {
        this.canvas = null;
        this.input = null;
        this.file = null;
    }

    init(canvasEl) {
        this.bindElements(canvasEl);
        this.bindListeners();

        const file = this.newFile(320, 240, 'advanced', 'Funky test');
        file.color = '#ff0000';
    }

    bindElements(canvasEl) {
        this.canvas = new MainCanvas(canvasEl);
    }

    bindListeners() {

        this.input = new Input(this.canvas);
        this.input.bindInputs();

        EventBus.$on("input-mouse-down", async (x, y) => {
            let pos = screenToRectXY(getCenterRect(this.canvas.el, this.file.width,this.file.height), x, y);
            if (this.file && pos) await this.file.startTool(pos.x, pos.y);
            EventBus.$emit('redraw-canvas');
        });
        EventBus.$on("input-mouse-up", async (x, y) => {
            let pos = screenToRectXY(getCenterRect(this.canvas.el, this.file.width,this.file.height), x, y);
            if (this.file && pos) await this.file.stopTool(pos.x, pos.y);
            EventBus.$emit('redraw-canvas');
        });
        EventBus.$on("input-mouse-move", async (x, y) => {
            let pos = screenToRectXY(getCenterRect(this.canvas.el, this.file.width,this.file.height), x, y);
            if (this.input.isMouseDown() && this.file && pos) {
                await this.file.useTool(pos.x, pos.y);
                EventBus.$emit('redraw-canvas');
            }
        });
        EventBus.$on("reset-canvas", (width, height) => {
            if (this.canvas) {
                this.canvas.reset(width, height);
            }
        });
        EventBus.$on("redraw-canvas", () => {
            if (!this.file) return false;
            this.file.redraw(this.canvas);
        });
    }

    newFile(width, height, editorMode, name = 'Untitled') {
        const file = new File(width, height, editorMode);
        file.name = name;
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
}

const AppManager = new _AppManager();

export default AppManager;
