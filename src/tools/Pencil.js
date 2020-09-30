import Tool from "../classes/abstracts/Tool";
import PencilIcon from "../assets/svg/pencil.svg";
import PencilCursor from "../assets/png/pencil.png";
import DrawRect from "../actions/canvas/DrawRect";
import { pixelsBetween } from "../utils/CanvasUtils";

export default class Pencil extends Tool {

    constructor() {
        super();

        this.name = "Pencil Tool";
        this.icon = PencilIcon;
        this.cursor = 'crosshair';
        this.cursorOffset = [0, 0];
        this.hotkey = 'b';
    }

    start(file, canvas, x, y) {
        canvas.doAction(DrawRect, x, y,1,1, file.color);
        this.pos = {x,y};
    }
    stop(file, canvas, x, y) {
        canvas.doAction(DrawRect, x, y,1,1, file.color);
    }

    use(file, canvas, x, y) {
        const px = pixelsBetween(x, y, this.pos.x, this.pos.y);
        for (let p of px) {
            canvas.doAction(DrawRect, p.x, p.y,1,1, file.color);
        }
        canvas.doAction(DrawRect,x, y,1,1, file.color);
        this.pos = {x,y};
    }
}
