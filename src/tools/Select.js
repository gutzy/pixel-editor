import Tool from "../classes/abstracts/Tool";
import SelectIcon from "../assets/svg/rectselect.svg";
import EventBus from "../utils/EventBus";
import ClearCanvas from "../actions/canvas/ClearCanvas";
import DrawRect from "../actions/canvas/DrawRect";
import ClearRect from "../actions/canvas/ClearRect";
import {getRect, isXYinRect} from "../utils/CanvasUtils";
import GetRectImage from "../actions/canvas/GetRectImage";
import DrawImage from "../actions/canvas/DrawImage";
import Canvas from "../classes/Canvas";

export default class Select extends Tool {

    constructor() {
        super();

        this.name = "Select Tool";
        this.icon = SelectIcon;
        this.cursor = 'crosshair';

        this.hotkey = 'm';
        this.persistent = true;
        this.dashIndex = 0;

        EventBus.$on('input-key-down', this.onKeyDown.bind(this));
        EventBus.$on('input-key-up', this.onKeyDown.bind(this));
    }

    onKeyDown(key, input) {
        if (!this.selected) return;
        if (!this.dragging) {
            this.mode = !!input.isKeyDown('Alt') ? 'copy':'cut';
        }
        this.lockAxis = !!input.isKeyDown('shift');
    }

    start(file, canvas, x, y) {
        if (this.startPos && this.endPos) {
            const rect = getRect(this.startPos, this.endPos, true);
            if (isXYinRect(rect, x, y)) {
                this.dragStart = {x,y};
                if (this.dragging) return;
                this.dragging = true;
                this.newPos = this.endPos;
                const imgData = canvas.doAction(GetRectImage, ...rect);

                const c = new Canvas(null, imgData.width, imgData.height, imgData);
                this.img = c.el;

                if (this.mode !== "copy") {
                    canvas.doAction(ClearRect, ...rect);
                }
            }
            else {
                console.log("!!!!")
                setTimeout(() => EventBus.$emit('save-history'), 1);
                this.finishedDragging = true;
                this.newPos = this.endPos = null;
            }
        }
        else {
            this.startPos = {x, y};
            this.newPos = this.endPos = null;
        }
    }

    stop(file, canvas, x, y, toolCanvas) {

        if (this.finishedDragging) {
            if (this.img) {
                canvas.doAction(DrawImage, toolCanvas.el);
                toolCanvas.doAction(ClearCanvas);
            }
            this.dragging = this.finishedDragging = false;
            this.startPos = this.endPos = this.newPos = this.dragStart = this.dragOffset = this.img = null;
            EventBus.$emit('select-area', null);
            return;
        }

        if (this.dragging) {
            this.startPos = {x: this.startPos.x - this.dragOffset.x, y: this.startPos.y - this.dragOffset.y};
            this.newPos = this.endPos = {x: this.endPos.x - this.dragOffset.x, y: this.endPos.y - this.dragOffset.y};
            this.dragOffset = {x:0, y: 0};
            return;
        }

        if (this.startPos && this.newPos) {
            this.endPos = {...this.newPos};
            EventBus.$emit('select-area', getRect(this.startPos, this.endPos));
            this.newPos = null;
        }
    }

    use(file, canvas, x, y, toolCanvas) {
        if (this.dragging) {
            this.dragOffset = {x: this.dragStart.x - x, y: this.dragStart.y - y};
            toolCanvas.doAction(ClearCanvas);
            toolCanvas.doAction(DrawImage, this.img, this.startPos.x - this.dragOffset.x, this.startPos.y - this.dragOffset.y);
            console.log("poi", this.img)
        }
        else {
            this.newPos = {x, y};
            this.endPos = {x, y};
        }
    }

    persist(toolCanvas, hard = false) {
        if (!toolCanvas) return;
        toolCanvas.doAction(ClearCanvas);
        let tgt = this.newPos ? this.newPos : this.endPos;
            console.log(this.newPos);
        if (this.startPos && tgt) {

            if (!hard) this.dashIndex++;

            const rect = getRect(this.startPos, tgt);

            toolCanvas.doAction(DrawRect, rect[0], rect[1], rect[2]-rect[0], rect[3]-rect[1], null, "#aaaaaa");
            // clear the ants!
            for (let x = rect[0]; x < rect[2]; x += 8) {
                toolCanvas.doAction(ClearRect, x + this.dashIndex % 8, rect[1]-1, 4, 2);
                toolCanvas.doAction(ClearRect, x - this.dashIndex % 8, rect[3]-2, 4, 2);
            }
            for (let y = rect[1]; y < rect[3]; y += 8) {
                toolCanvas.doAction(ClearRect, rect[0]-1, y - this.dashIndex % 8, 2, 4);
                toolCanvas.doAction(ClearRect, rect[2]-1, y + this.dashIndex % 8, 2, 4);
            }
        }
        if (this.img && this.dragOffset) {
            toolCanvas.doAction(DrawImage, this.img, this.startPos.x - this.dragOffset.x, this.startPos.y - this.dragOffset.y);
        }
    }

}
