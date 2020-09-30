import Tool from "../classes/abstracts/Tool";
import SelectIcon from "../assets/svg/rectselect.svg";
import EventBus from "../utils/EventBus";
import ClearCanvas from "../actions/canvas/ClearCanvas";
import DrawRect from "../actions/canvas/DrawRect";
import ClearRect from "../actions/canvas/ClearRect";
import {getRect} from "../utils/CanvasUtils";

export default class Select extends Tool {

    constructor() {
        super();

        this.name = "Select Tool";
        this.icon = SelectIcon;
        this.cursor = 'crosshair';

        this.hotkey = 'm';
        this.persistent = true;
        this.dashIndex = 0;
    }

    start(file, canvas, x, y) {
        this.startPos = {x, y};
        this.newPos = null;
    }

    stop(file, canvas, x, y) {
        if (this.startPos && this.newPos) {
            EventBus.$emit('select-area', getRect(this.startPos, this.newPos));
        }
        else {
            this.startPos = null;
            EventBus.$emit('select-area', null);
        }
    }

    use(file, canvas, x, y, toolCanvas) {
        this.newPos = {x, y}
    }

    persist(toolCanvas, hard = false) {
        if (toolCanvas) toolCanvas.doAction(ClearCanvas);
        if (this.startPos && this.newPos) {
            if (!hard) this.dashIndex++;

            const rect = getRect(this.startPos, this.newPos);

            toolCanvas.doAction(DrawRect, rect[0], rect[1], rect[2]-rect[0], rect[3]-rect[1], null, "#aaaaaa");
            // clear the ants!
            for (let x = rect[0]; x < rect[2]; x += 8) {
                toolCanvas.doAction(ClearRect, x + this.dashIndex % 8, rect[1], 4, 1);
                toolCanvas.doAction(ClearRect, x - this.dashIndex % 8, rect[3]-1, 4, 1);
            }
            for (let y = rect[1]; y < rect[3]; y += 8) {
                toolCanvas.doAction(ClearRect, rect[0], y - this.dashIndex % 8, 1, 4);
                toolCanvas.doAction(ClearRect, rect[2], y + this.dashIndex % 8, 1, 4);
            }
        }
    }

}
