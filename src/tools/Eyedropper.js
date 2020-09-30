import FillArea from "../actions/canvas/FillArea";
import Tool from "../classes/abstracts/Tool";
import EyedropperIcon from "../assets/svg/eyedropper.svg";
import EyedropperCursor from "../assets/png/eyedropper.png"
import DrawRect from "../actions/canvas/DrawRect";

export default class EyeDropper extends Tool {

    constructor() {
        super();

        this.name = "Eyedropper";
        this.icon = EyedropperIcon;
        this.cursor = EyedropperCursor;
        this.cursorOffset = [0, 14];
        this.hotkey = 'g';
    }

    start(file, canvas, x, y) {
        canvas.doAction(GetC, x, y, file.color);
    }
    stop(file, canvas, x, y) {
    }

    use(file, canvas, x, y, toolCanvas) {
        // the following code will help debugging the cursor position:
        // toolCanvas.doAction(DrawRect, x, y, 1, 1, null, '#008833')
    }

}
