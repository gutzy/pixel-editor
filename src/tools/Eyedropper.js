/**
 * @Tool Eyedropper
 * @author guszi
 *
 * Choose the active color by clicking on the drawing
 */

import Tool from "../classes/abstracts/Tool";
import EyedropperIcon from "../assets/svg/eyedropper.svg";
import EyedropperCursor from "../assets/png/eyedropper.png"
import GetColor from "../actions/canvas/GetColor";
import SelectColor from "../actions/file/selection/SelectColor";

export default class EyeDropper extends Tool {

    constructor() {
        super();

        this.id = 'eyedropper';
        this.name = "Eyedropper";
        this.icon = EyedropperIcon;
        this.cursor = EyedropperCursor;
        this.cursorOffset = [0, 0];
        this.hotkey = 'i';
    }

    start(file, canvas, x, y) {
        const color = canvas.doAction(GetColor, x, y);
    }
    stop(file, canvas, x, y) {
        const color = canvas.doAction(GetColor, x, y);
        if (color) {
            file.doAction(SelectColor, color);
        }
    }

    use(file, canvas, x, y, toolCanvas) {
        // the following code will help debugging the cursor position:
        // toolCanvas.doAction(DrawRect, x, y, 1, 1, null, '#008833')
    }

}
