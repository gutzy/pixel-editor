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
        this.rect = null;
        this.dragging = false;
        this.dashIndex = 0;

        // handle custom events
        EventBus.$on('input-key-down', this.onKeyDown.bind(this));
        EventBus.$on('input-key-up', this.onKeyDown.bind(this));
    }

    onKeyDown(key, input) {
        if (!this.selected) return;
        if (!this.dragging) {
            this.mode = !!input.isKeyDown('Alt') ? 'copy':'cut';
            this.lockAxis = !!input.isKeyDown('shift');
        }
    }

    start(file, canvas, x, y, toolCanvas) {
        this.used = false;
        if (this.rect && isXYinRect(this.rect, x, y)) {
            this.dragging = {x, y};
        } else {
            this.dragging = false;
            this.rect = null;
            this.startPos = {x, y};
            this.newPos = null;
        }

    }

    stop(file, canvas, x, y, toolCanvas) {

        if (this.startPos && this.newPos) {
            this.rect = [...this.tempRect];
            this.startPos = {x: this.rect[0], y: this.rect[1]};
            this.newPos = {x: this.rect[0]+this.rect[2], y: this.rect[1]+this.rect[3]};
            EventBus.$emit('select-area', this.rect);
        }

        if (!this.used) {
            this.dragging = false;
            this.newPos = this.startPos = this.rect = this.tempRect = null;
        }
    }

    use(file, canvas, x, y, toolCanvas) {
        this.used = true;
        if (this.dragging) {
            const offset = {x: x-this.dragging.x, y: y-this.dragging.y};
            this.tempRect = rectApplyOffset(getRect(this.startPos, this.newPos), offset.x, offset.y);
        }
        else {
            this.newPos = {x, y};
            this.tempRect = getRect(this.startPos, this.newPos);
        }
    }

    persist(toolCanvas, hard = false) {
        toolCanvas.doAction(ClearCanvas);
        if (this.tempRect) {

            if (!hard) this.dashIndex++;

            if (this.img && this.dragOffset) {
                toolCanvas.doAction(DrawImage, this.img, this.startPos.x - this.dragOffset.x, this.startPos.y - this.dragOffset.y);
            }
            toolCanvas.doAction(DrawRect, ...this.tempRect, null, "#aaaaaa");
            toolCanvas.doAction(ClearMarquee, 8, ...this.tempRect, this.dashIndex);
        }
    }

}
