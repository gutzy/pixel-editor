/**
 * @Tool Pencil
 * @author guszi
 *
 * Lets you draw stuff
 */

import Tool from "../classes/abstracts/Tool";
import PencilIcon from "../assets/svg/pencil.svg";
import DrawRect from "../actions/canvas/DrawRect";
import { pixelsBetween } from "../utils/CanvasUtils";
import ToolInfo from "../actions/tool/ToolInfo";
import AxisLocking from "../actions/tool/AxisLocking";

export default class Pencil extends Tool {

    constructor() {
        super();

        this.id = "pencil";
        this.name = "Pencil Tool";
        this.icon = PencilIcon;
        this.cursor = 'crosshair';
        this.cursorOffset = [0, 0];
        this.hotkey = 'b';
        this.save = true;
        this.useOutside = true;

        this.size = 1;

        this.doAction(AxisLocking);
    }

    select() {
        this.doAction(ToolInfo,{"Size" : this.size});
    }

    start(file, canvas, x, y) {
        canvas.doAction(DrawRect, x, y,this.size,this.size, file.color);
        this.pos = {x,y};
    }

    stop(file, canvas, x, y) {
        canvas.doAction(DrawRect, x, y,this.size,this.size, file.color);
    }

    use(file, canvas, x, y) {
        const px = pixelsBetween(x, y, this.pos.x, this.pos.y);
        for (let p of px) { // draw pixels between this and the previous mouse movement
            canvas.doAction(DrawRect, p.x, p.y,this.size,this.size, file.color);
        }
        canvas.doAction(DrawRect,x, y,this.size,this.size, file.color);
        this.pos = {x,y};
    }
}
