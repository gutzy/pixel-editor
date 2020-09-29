import FillArea from "../actions/canvas/FillArea";
import Tool from "../classes/abstracts/Tool";
import PaintBucketIcon from "../assets/svg/fill.svg";
import PaintBucketCursor from "../assets/png/fill.png"

export default class PaintBucket extends Tool {

    constructor() {
        super();

        this.name = "Paint Bucket";
        this.icon = PaintBucketIcon;
        this.cursor = PaintBucketCursor;
        this.cursorOffset = [0, 10];
        this.hotkey = 'g';
    }

    start(file, canvas, x, y) {
        canvas.doAction(FillArea, x, y, file.color);
    }
    stop(file, canvas, x, y) {
    }

    use(file, canvas, x, y) {}

}
