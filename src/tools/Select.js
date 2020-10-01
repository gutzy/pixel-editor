import Tool from "../classes/abstracts/Tool";
import SelectIcon from "../assets/svg/rectselect.svg";
import EventBus from "../utils/EventBus";
import {getRect, isXYinRect, rectApplyOffset} from "../utils/CanvasUtils";
import ToolInfo from "../actions/tool/ToolInfo";
import WatchKey from "../actions/tool/WatchKey";
import ImgDataToCanvas from "../actions/canvas/ImgDataToCanvas";
import GetRectImage from "../actions/canvas/GetRectImage";
import ClearRect from "../actions/canvas/ClearRect";
import DrawImage from "../actions/canvas/DrawImage";
import CutImage from "../actions/canvas/CutImage";
import GetMaskImage from "../actions/canvas/GetMaskImage";

export default class Select extends Tool {

    constructor() {
        super();

        this.name = "Select Tool";
        this.icon = SelectIcon;
        this.cursor = 'crosshair';
        this.hotkey = 'm';

        this.mode = 'cut';

        this.doAction(WatchKey, 'Alt', isAltDown => {
            if (!this.moving) this.mode = isAltDown ? 'copy':'cut';
            this.doAction(ToolInfo,{"Mode" : this.mode, "Axis": this.lockAxis?"Locked":"Both"});
        });
        this.doAction(WatchKey, 'Shift', isShiftDown => {
            this.lockAxis = isShiftDown;
            this.doAction(ToolInfo,{"Mode" : this.mode, "Axis": this.lockAxis?"Locked":"Both"});
        });
    }

    select() {
        this.doAction(ToolInfo,{"Mode" : this.mode, "Axis": this.lockAxis?"Locked":"Both"});
    }

    start(file, canvas, x, y, toolCanvas) {
        this.finished = this.moving = true;
        this.axisOffset = 0;
        this.rectMode = 'reset';

        if (this.rect) { // a selection is defined
            if (isXYinRect(this.rect, x, y)) { // inside current selection
                this.dragging = {x, y};
                if (this.mode === "copy") { this._doCopy(canvas, file, this.rect); }
                else if (!this.cut) { this._doCut(canvas, file, this.rect) }
            }
            else { // outside selection
                if (this.lockAxis) { // shift pressed: expanding selection
                    this.rectMode = 'expand';
                } else if (this.mode === 'copy') { // alt pressed: shrinking selection
                    this.rectMode = 'shrink';
                } else { // default behavior: reset
                    this._onFinished(canvas, file);
                    EventBus.$emit('select-area', 'selectionCanvas', [0,0,0,0]);
                }
                this.startPos = {x, y};
            }
        } else { // selection not defined
            this.dragging = false;
            this.rect = this.newPos = null;
            this.startPos = {x, y};
            EventBus.$emit('select-area', 'selectionCanvas', [0,0,0,0]);
        }
    }

    stop(file, canvas, x, y, toolCanvas) {
        this.moving = false;
        if (this.rectMode !== 'reset') {
            EventBus.$emit('select-area-solidify');
            this.rectMode = 'reset';
            return;
        }

        if (this.startPos && this.newPos) {
            this.rect = [...this.tempRect];
            this.startPos = {x: this.rect[0], y: this.rect[1]};
            this.newPos = {x: this.rect[0]+this.rect[2], y: this.rect[1]+this.rect[3]};
            EventBus.$emit('select-area', 'selectionCanvas', ...this.rect);
        }

        if (this.finished) { this._onFinished(canvas, file); }
    }

    use(file, canvas, x, y, toolCanvas) {
        this.finished = false;
        if (this.dragging) {
            const offset = {x: x-this.dragging.x, y: y-this.dragging.y};
            this._detectAxis(offset);
            this.tempRect = rectApplyOffset(getRect(this.startPos, this.newPos), this.axis===-1? 0 : offset.x, this.axis===1? 0 : offset.y);
        }
        else {
            this.newPos = {x, y};
            this.tempRect = getRect(this.startPos, this.newPos);
        }

        if (this.rectMode === 'reset') {
            file.expandArea = file.shrinkArea = null;
            if (!this.dragging) EventBus.$emit('select-area', 'selectionCanvas', ...this.tempRect);
        }
        else if (this.rectMode === 'expand') file.expandArea = this.tempRect;
        else if (this.rectMode === 'shrink') file.shrinkArea = this.tempRect;
    }

    _onFinished(canvas, file) {
        if (this.cut) {
            canvas.doAction(DrawImage, this.cut.el, this.rect[0], this.rect[1]);
            EventBus.$emit('save-history');
        }
        this.dragging = false;
        this.newPos = this.startPos = this.rect = this.tempRect = this.img = this.cut = null;
    }

    _detectAxis(offset) {
        if (this.lockAxis) {
            if (this.axisOffset >= 3) { // try 3 iterations of generating offset before committing to an axis lock
                if (!this.axis) { this.axis = (Math.abs(offset.x) > Math.abs(offset.y)) ? 1:-1; }
            }
            else { this.axis = 0; this.axisOffset++; } // accumulate axis offset

            this.doAction(ToolInfo,{"Mode" : this.mode, "Axis": this.axis?(this.axis>0?"X":"Y"):"Locked"});

        } else { this.axis = 0; } // no lock, no axis.
    }

    _doCopy(canvas, file, rect) {
        if (this.cut) {
            canvas.doAction(DrawImage, this.cut.el, this.rect[0], this.rect[1]);
            EventBus.$emit('save-history');
        }
        else {
            this.cut = canvas.doAction(ImgDataToCanvas, canvas.doAction(GetRectImage, ...rect));
        }
    }

    _doCut(canvas, file, rect) {
        this.cut = canvas.doAction(ImgDataToCanvas, canvas.doAction(GetMaskImage, file.selectionCanvas.el));
        canvas.doAction(CutImage, file.selectionCanvas.el);
    }
}
