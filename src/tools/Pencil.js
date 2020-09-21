import Tool from "../classes/abstracts/Tool";
import Line from "../actions/canvas/Line";
import MoveTo from "../actions/canvas/MoveTo";

export default class Pencil extends Tool {

    start(file, canvas, x, y) {
        canvas.doAction(MoveTo, x-0.5, y-0.5);
        canvas.doAction(Line, x-0.5, y-0.5, file.color);
    }
    stop(file, canvas, x, y) { //...
    }

    use(file, canvas, x, y) {
        canvas.doAction(Line, x-0.5, y-0.5, file.color);
    }

}
