import Tool from "../classes/abstracts/Tool";
import Line from "../actions/canvas/Line";
import MoveTo from "../actions/canvas/MoveTo";
import PencilIcon from "../assets/svg/pencil.svg";
export default class Pencil extends Tool {

    constructor() {
        super();

        this.name = "Pencil Tool";
        this.icon = PencilIcon;
        this.hotkey = 'b';
    }

    start(file, canvas, x, y) {
        canvas.doAction(MoveTo, x, y);
        canvas.doAction(Line, x, y, file.color);
    }
    stop(file, canvas, x, y) {}

    use(file, canvas, x, y) {
        canvas.doAction(Line, x, y, file.color);
    }

}
