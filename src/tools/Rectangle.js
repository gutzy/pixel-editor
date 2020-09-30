import Tool from "../classes/abstracts/Tool";
import RectangleIcon from "../assets/svg/rectangle.svg";
import DrawRect from "../actions/canvas/DrawRect";
import ClearCanvas from "../actions/canvas/ClearCanvas";

export default class Rectangle extends Tool {

    constructor() {
        super();

        this.name = "Rectangle Tool";
        this.icon = RectangleIcon;
        this.cursor = "crosshair";
        this.hotkey = 'r';
        this.save = true;
    }

    start(file, canvas, x, y) {
        this.startPos = {x, y}
    }

    stop(file, canvas, x, y) {
        if (this.startPos) canvas.doAction(DrawRect, this.startPos.x, this.startPos.y, x-this.startPos.x, y-this.startPos.y, null, file.color);
    }

    use(file, canvas, x, y, toolCanvas) {
        toolCanvas.doAction(ClearCanvas);
        toolCanvas.doAction(DrawRect, this.startPos.x, this.startPos.y, x-this.startPos.x, y-this.startPos.y, null, file.color)
    }
}
