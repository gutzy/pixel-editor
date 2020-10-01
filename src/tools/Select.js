import Tool from "../classes/abstracts/Tool";
import SelectIcon from "../assets/svg/rectselect.svg";
import EventBus from "../utils/EventBus";
import ClearCanvas from "../actions/canvas/ClearCanvas";
import DrawRect from "../actions/canvas/DrawRect";
import {getRect, isXYinRect, rectApplyOffset, rectToAbsolute} from "../utils/CanvasUtils";
import GetRectImage from "../actions/canvas/GetRectImage";
import DrawImage from "../actions/canvas/DrawImage";
import Canvas from "../classes/Canvas";
import ClearMarquee from "../actions/canvas/ClearMarquee";
import ImgDataToCanvas from "../actions/canvas/ImgDataToCanvas";
import ClearRect from "../actions/canvas/ClearRect";

export default class Select extends Tool {

    constructor() {
        super();

        // tool settings
        this.name = "Select Tool";
        this.icon = SelectIcon;
        this.cursor = 'crosshair';
        this.hotkey = 'm';
        this.persistent = true;

        // internally used properties
        this.dashIndex = 0;
        this.mode = 'cut';

        // handle custom events
        EventBus.$on('input-key-down', this.onKeyChanges.bind(this));
        EventBus.$on('input-key-up', this.onKeyChanges.bind(this));
        EventBus.$on('focus', this.onFocus.bind(this));
    }

    onFocus(input) { this.onKeyChanges(null, input); }

    onKeyChanges(key, input) {
        if (!this.selected) return;
        if (!this.moving) { this.mode = !!input.isKeyDown('Alt') ? 'copy':'cut'; }
        this.lockAxis = !!input.isKeyDown('Shift');

        EventBus.$emit('tool-info', {"Mode" : this.mode, "Axis": this.lockAxis?"Locked":"Both"})
    }

    select() {
        EventBus.$emit('tool-info', {"Mode" : this.mode, "Axis": this.lockAxis?"Locked":"Both"})
    }

    start(file, canvas, x, y, toolCanvas) {
        this.finished = this.moving = true;
        this.axisOffset = 0;

        if (this.rect) {
            if (isXYinRect(this.rect, x, y)) {
                this.dragging = {x, y};
                if (!this.img) {
                    this.img = canvas.doAction(ImgDataToCanvas, canvas.doAction(GetRectImage, ...this.rect));
                    canvas.doAction(ClearRect, ...this.rect);
                }
                if (this.mode === "copy") {
                    const start = {x: this.rect[0], y: this.rect[1]}, img = this.img,
                        end = {x: this.rect[0]+this.rect[2], y: this.rect[1]+this.rect[3]};

                    if (img) {
                        this._onFinished(canvas);
                        this.img = img;
                    }
                    this.dragging = {x, y};
                    this.startPos = start;
                    this.newPos = end;
                }
            }
            else {
                this._onFinished(canvas);
                this.startPos = {x, y};
            }
        } else {
            this.dragging = false;
            this.rect = this.newPos = null;
            this.startPos = {x, y};
        }
    }

    stop(file, canvas, x, y, toolCanvas) {
        this.moving = false;

        if (this.startPos && this.newPos) {
            this.rect = [...this.tempRect];
            this.startPos = {x: this.rect[0], y: this.rect[1]};
            this.newPos = {x: this.rect[0]+this.rect[2], y: this.rect[1]+this.rect[3]};
            EventBus.$emit('select-area', this.rect);
        }

        if (this.finished) { this._onFinished(canvas); }
    }

    use(file, canvas, x, y, toolCanvas) {
        this.finished = false;
        if (this.dragging) {
            const offset = {x: x-this.dragging.x, y: y-this.dragging.y};
            if (this.lockAxis) {
                if (this.axisOffset >= 3) { // try 3 iterations of generating offset before committing to an axis lock
                    if (!this.axis) { this.axis = (Math.abs(offset.x) > Math.abs(offset.y)) ? 1:-1; }
                }
                else { this.axis = 0; this.axisOffset++; } // accumulate axis offset

                EventBus.$emit('tool-info', {"Mode" : this.mode, "Axis": this.axis?(this.axis>0?"X":"Y"):"Locked"});

            } else { this.axis = 0; } // no lock, no axis.

            this.tempRect = rectApplyOffset(getRect(this.startPos, this.newPos), this.axis===-1? 0 : offset.x, this.axis===1? 0 : offset.y);
        }
        else {
            this.newPos = {x, y};
            this.tempRect = getRect(this.startPos, this.newPos);
        }
    }

    persist(toolCanvas, hard = false) {
        if (!toolCanvas) return;
        toolCanvas.doAction(ClearCanvas);
        if (this.tempRect) {
            if (!hard) this.dashIndex++;

            if (this.img) { toolCanvas.doAction(DrawImage, this.img, this.tempRect[0], this.tempRect[1]); }
            toolCanvas.doAction(DrawRect, ...this.tempRect, null, "#aaaaaa");
            toolCanvas.doAction(ClearMarquee, 8, ...this.tempRect, this.dashIndex);
        }
    }

    _onFinished(canvas) {
        if (this.img) {
            canvas.doAction(DrawImage, this.img, this.tempRect[0], this.tempRect[1]);
            EventBus.$emit('save-history');
        }
        this.dragging = false;
        this.newPos = this.startPos = this.rect = this.tempRect = this.img = null;
    }
}
