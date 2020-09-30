import Tool from "../classes/abstracts/Tool";
import EraserIcon from "../assets/svg/eraser.svg";
import ClearRect from "../actions/canvas/ClearRect";
import {pixelsBetween} from "../utils/CanvasUtils";

export default class Eraser extends Tool {

    constructor() {
        super();

        this.name = "Eraser Tool";
        this.icon = EraserIcon;
        this.hotkey = 'e';
        this.save = true;
    }

    start(file, canvas, x, y) {
        canvas.doAction(ClearRect, x, y, 1, 1);
        this.pos = {x, y}
    }
    stop(file, canvas, x, y) {
        canvas.doAction(ClearRect, x, y, 1, 1);
    }

    use(file, canvas, x, y) {
        const px = pixelsBetween(x, y, this.pos.x, this.pos.y);
        for (let p of px) {
            canvas.doAction(ClearRect, p.x, p.y,1,1, file.color);
        }
        canvas.doAction(ClearRect, x, y, 1, 1);
        this.pos = {x, y};
    }

}
