/**
 * @Tool Eraser
 * @author guszi
 *
 * Eraser tool, like a pencil but erases stuff
 */

import Tool from "../classes/abstracts/Tool";
import ToolInfo from "../actions/tool/ToolInfo";
import EraserIcon from "../assets/svg/eraser.svg";
import ClearRect from "../actions/canvas/ClearRect";
import {pixelsBetween} from "../utils/CanvasUtils";

export default class Eraser extends Tool {

    constructor() {
        super();

        this.id = 'eraser';
        this.name = "Eraser Tool";
        this.icon = EraserIcon;
        this.cursor = 'crosshair';
        this.hotkey = 'e';
        this.save = true;
        this.size = 1;

        console.log("Eraser size: " + this.size);
    }

    select() {
        this.doAction(ToolInfo,{"Size" : this.size});
    }
    
    start(file, canvas, x, y, toolCanvas, size) {
        canvas.doAction(ClearRect, x, y, size, size);
        this.pos = {x, y}
    }
    stop(file, canvas, x, y, toolCanvas,size) {
        canvas.doAction(ClearRect, x, y, size, size);
    }

    use(file, canvas, x, y, toolCanvas, size) {
        const px = pixelsBetween(x, y, this.pos.x, this.pos.y);
        for (let p of px) {
            canvas.doAction(ClearRect, p.x, p.y,size,size, file.color);
        }
        canvas.doAction(ClearRect, x, y, size, size);
        this.pos = {x, y};
    }
}
