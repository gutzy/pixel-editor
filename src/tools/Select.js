import Tool from "../classes/abstracts/Tool";
import SelectIcon from "../assets/svg/rectselect.svg";
import EventBus from "../utils/EventBus";
import {getRect} from "../utils/CanvasUtils";
import ToolInfo from "../actions/tool/ToolInfo";
import WatchKey from "../actions/tool/WatchKey";
import ImgDataToCanvas from "../actions/canvas/ImgDataToCanvas";
import DrawImage from "../actions/canvas/DrawImage";
import CutImage from "../actions/canvas/CutImage";
import GetMaskImage from "../actions/canvas/GetMaskImage";
import IsOpaque from "../actions/canvas/IsOpaque";
import OffsetImage from "../actions/canvas/OffsetImage";

export default class Select extends Tool {

    constructor() {
        super();

        this.id = "select";
        this.name = "Select Tool";
        this.icon = SelectIcon;
        this.cursor = 'crosshair';
        this.hotkey = 'm';

        this.mode = 'cut';

        this.doAction(WatchKey, 'Alt', isAltDown => {
            if (!this.moving) this.mode = isAltDown ? 'copy':'cut';
            this._resetInfo();
        });
        this.doAction(WatchKey, 'Shift', isShiftDown => {
            this.lockAxis = isShiftDown;
            this._resetInfo();
        });
    }

    select() {
        this._resetInfo();
    }

    hover(file,canvas,x,y,toolCanvas) {
        if (file.selectionCanvas && file.selectionCanvas.doAction(IsOpaque, x, y)) { // inside current selection
            this.context = 'object';
        } else {
            this.context = 'selection';
        }
        this._resetInfo();
    }

    start(file, canvas, x, y, toolCanvas) {
        this.moving = true;
        this.axisOffset = 0;
        this.rectMode = 'reset';

        if (this.rect) { // a selection is defined
            file.lastSelectionOffset = null;
            if (file.selectionCanvas && file.selectionCanvas.doAction(IsOpaque, x, y)) { // inside current selection
                this.dragging = {x, y};
                if (this.mode === "copy") { this._doCopy(canvas, file); }
                else if (!this.cut) { this._doCut(canvas, file) }
            }
            else { // outside selection
                this.dragging = false;
                if (this.lockAxis) { // shift pressed: expanding selection
                    this.rectMode = 'expand';
                } else if (this.mode === 'copy') { // alt pressed: shrinking selection
                    this.rectMode = 'shrink';
                } else { // default behavior: reset
                    this._onClear(canvas, file);
                    this._onFinished(canvas, file);
                }
                this.startPos = {x, y};
            }
        } else { // selection not defined
            this.dragging = false;
            this.rect = this.newPos = null;
            this.startPos = {x, y};
            this._onClear(canvas, file);
        }
    }

    stop(file, canvas, x, y, toolCanvas) {
        this.moving = false;

        EventBus.$emit('select-area-solidify');
        if (this.rectMode !== 'reset') {
            this.rectMode = 'reset';
            return;
        }

        if (this.dragging) {
            // ...
        }
        else if (this.startPos && this.newPos) {
            this.rect = [...this.tempRect];
            this.startPos = {x: this.rect[0], y: this.rect[1]};
            this.newPos = {x: this.rect[0]+this.rect[2], y: this.rect[1]+this.rect[3]};
            EventBus.$emit('select-area', 'selectionCanvas', ...this.rect);
        }

        if (file.toolSelectionCanvas && file.lastSelectionOffset) {
            file.toolSelectionCanvas.doAction(OffsetImage, file.lastSelectionOffset.x, file.lastSelectionOffset.y)
        }

    }

    use(file, canvas, x, y, toolCanvas) {
        if (this.dragging) {
            const offset = {x: x-this.dragging.x, y: y-this.dragging.y};

            if (this.lockAxis && this.axis) {
                if (this.axis === 1) offset.y = 0;
                else if (this.axis === -1) offset.x = 0;
            }

            this._detectAxis(offset);
            file.selectionOffset = offset;
            file.lastSelectionOffset = null;
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

    _onFinished() {
        this.dragging = false;
        this.newPos = this.startPos = this.rect = this.tempRect = this.img = null;
    }

    _onClear(canvas, file) {
        this._clearCut(file);
        EventBus.$emit('select-area', 'selectionCanvas', [0,0,0,0]);
        if (file.toolSelectionCanvas) {
            this._drawToolCanvasOnLayer(file);
            file.toolSelectionCanvas = this.cut = null;
        }
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

    _doCopy(canvas, file) {
        if (!this.cut) this._initCutImage(canvas, file);
        this._drawToolCanvasOnLayer(file);
    }

    _doCut(canvas, file) {
       this._initCutImage(canvas, file);
        canvas.doAction(CutImage, file.selectionCanvas.el); // remove the image from the layer
    }

    _clearCut(file) {}

    _initCutImage(canvas, file) {
        let extra = false;
        if (file.toolSelectionCanvas) {
            extra = canvas.doAction(ImgDataToCanvas, file.toolSelectionCanvas.doAction(GetMaskImage, file.selectionCanvas.el));
        }

        this.cut = canvas.doAction(ImgDataToCanvas, canvas.doAction(GetMaskImage, file.selectionCanvas.el));
        if (extra) {
            EventBus.$emit('save-history');
            this.cut.doAction(DrawImage, extra.el);
        }

        file.toolSelectionCanvas = this.cut;
        EventBus.$emit('save-history');
    }

    _resetInfo() {
        if (this.context === "selection") {
            this.doAction(ToolInfo,{"Selection Mode" : this.mode==='copy'?"Shrink":(this.lockAxis?"Expand":"Reset")});
        }
        else {
            if (this.lockAxis && this.axis) {
                this.doAction(ToolInfo,{"Mode" : this.mode, "Axis": this.axis?(this.axis>0?"X":"Y"):"Locked"});
            }
            else {
                this.doAction(ToolInfo,{"Mode" : this.mode, "Axis": this.lockAxis?"Locked":"Both"});
            }
        }
    }

    _drawToolCanvasOnLayer(file) {
        let tx = 0, ty = 0;
        if (file.selectionOffset) { tx = file.selectionOffset.x; ty = file.selectionOffset.y; }
        else if (file.lastSelectionOffset) { tx = file.lastSelectionOffset.x; ty = file.lastSelectionOffset.y; }
        file.layers[file.activeLayer].canvas.doAction(DrawImage, file.toolSelectionCanvas.el,tx,ty);
    }
}
