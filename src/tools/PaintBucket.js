import FillArea from "../actions/canvas/FillArea";
import Tool from "../classes/abstracts/Tool";

export default class PaintBucket extends Tool {

    start(file, canvas, x, y) {
        canvas.doAction(FillArea, x, y, file.color);
    }
    stop(file, canvas, x, y) {
    }

    use(file, canvas, x, y) {}

}
