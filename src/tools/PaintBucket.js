import FillArea from "../actions/canvas/FillArea";
import Tool from "../classes/abstracts/Tool";
import PaintBucketIcon from "../assets/svg/fill.svg";
import PaintBucketCursor from "../assets/png/fill.png"
import DrawRect from "../actions/canvas/DrawRect";

export default class PaintBucket extends Tool {

    constructor() {
        super();

        this.name = "Paint Bucket";
        this.icon = PaintBucketIcon;
        this.cursor = PaintBucketCursor;
        this.cursorOffset = [0, 14];
        this.hotkey = 'f';
        this.save = true;
    }

    start(file, canvas, x, y) {
        canvas.doAction(FillArea, x, y, file.color);
    }
    stop(file, canvas, x, y) {
    }

    use(file, canvas, x, y, toolCanvas) {
        // the following code will help debugging the cursor position:
        // toolCanvas.doAction(DrawRect, x, y, 1, 1, null, '#008833')
    }

}
