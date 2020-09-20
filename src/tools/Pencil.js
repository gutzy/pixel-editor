import FillArea from "../actions/canvas/FillArea";
import Tool from "../classes/abstracts/Tool";
import Rectangle from "../actions/canvas/Rectangle";

export default class Pencil extends Tool {

    start(file, canvas, x, y) {
        canvas.doAction(Rectangle, x-0.5, y-0.5, 1, 1, file.color);
    }
    stop(file, canvas, x, y) { //...
    }

    use(file, canvas, x, y) {
        canvas.doAction(Rectangle, x-0.5, y-0.5, 1, 1, file.color);
    }

}
