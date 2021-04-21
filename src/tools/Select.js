/**
 * @Tool Select
 * @author guszi
 *
 * Rectangular Selection tool.
 */
import Tool from "../classes/abstracts/Tool";
import SelectIcon from "../assets/svg/rectselect.svg";
import EventBus from "../utils/EventBus";
import {getRect} from "../utils/CanvasUtils";
import ToolInfo from "../actions/tool/ToolInfo";
import WatchKey from "../actions/tool/WatchKey";
import CutImage from "../actions/canvas/CutImage";
import IsOpaque from "../actions/canvas/IsOpaque";
import OffsetImage from "../actions/canvas/OffsetImage";
import AxisLocking from "../actions/tool/AxisLocking";
import InitCutImage from "../actions/file/selection/InitCutImage";
import DrawToolCanvasOnLayer from "../actions/file/selection/DrawToolCanvasOnLayer";
import DrawSelectionBorders from "../actions/canvas/DrawSelectionBorders";
import ImgDataToCanvas from "../actions/canvas/ImgDataToCanvas";
import GetMaskImage from "../actions/canvas/GetMaskImage";

export default class Select extends Tool {

    constructor() {
        super();

        this.id = "select";
        this.name = "Select Tool";
        this.icon = SelectIcon;
        this.cursor = 'crosshair';
        this.hotkey = 'm';

        this.mode = 'cut';

        this.doAction(AxisLocking, 'Shift', () => this.context === 'object');

        this.doAction(WatchKey, 'Alt', isAltDown => {
            if (!this.moving) this.mode = isAltDown ? 'copy':'cut';
            this._resetInfo();
        });
        this.doAction(WatchKey, 'Shift', () => { this._resetInfo(); });
    }

    select() {
        this._resetInfo();
    }

    hover(file,canvas,x,y,toolCanvas) {
        if (this.moving) return false;
        if (file.selectionCanvas && file.selectionCanvas.doAction(IsOpaque, x, y)) { // inside current selection
            this.context = 'object';
        } else {
            this.context = 'selection';
        }
        this._resetInfo();
    }

    start(file, canvas, x, y, toolCanvas) {
        this.moving = true;
        this.rectMode = 'reset';

        if (file.selectionCanvas) { // a selection is defined
            file.lastSelectionOffset = null;
            // if inside current selection
            if (file.selectionCanvas && file.selectionCanvas.doAction(IsOpaque, x, y)) { 
                this.dragging = {x, y};
                this.context = 'object';

                if (this.mode === "copy") { 
                    this._doCopy(canvas, file); 
                }
                else if (!file.toolSelectionCanvas || file.forceCut) { 
                    this._doCut(canvas, file) 
                }
            }
            else { // outside selection
                this.dragging = false;
                this.context = 'selection';
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
            file.selectionOffset = {x: x - this.dragging.x, y: y - this.dragging.y};
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

        if (file.selectionOverlay) file.selectionBorders = file.selectionOverlay.doAction(DrawSelectionBorders, file.selectionOverlay, file.zoom, file, true);
    }

    _onFinished() {
        this.dragging = false;
        this.newPos = this.startPos = this.rect = this.tempRect = this.img = null;
    }

    _onClear(canvas, file) {
        this._clearCut(file);
        EventBus.$emit('select-area', 'selectionCanvas', [0,0,0,0]);
        if (file.toolSelectionCanvas) {
            file.doAction(DrawToolCanvasOnLayer);
            file.toolSelectionCanvas = null;
        }
    }

    _doCopy(canvas, file) {
        if (!file.toolSelectionCanvas) file.doAction(InitCutImage, canvas);
        file.doAction(DrawToolCanvasOnLayer);
    }

    _doCut(canvas, file) {
        delete file.forceCut;
        file.doAction(InitCutImage, canvas);
        canvas.doAction(CutImage, file.selectionCanvas.el); // remove the image from the layer
    }

    _clearCut(file) {}

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
}
