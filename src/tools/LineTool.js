/**
 * @Tool Line
 * @author Liam / Unsettled
 *
 * Line tool, allows for drawing lines
 */

import Tool from "../classes/abstracts/Tool";
import LineIcon from "../assets/svg/line.svg";
import Line from "../actions/canvas/Line";
import ClearCanvas from "../actions/canvas/ClearCanvas";
import ToolInfo from "../actions/tool/ToolInfo";

export default class LineTool extends Tool {

    constructor() {
        super();

        this.id = 'line';
        this.name = "Line Tool";
        this.icon = LineIcon;
        this.cursor = 'crosshair';
        this.hotkey = 'l';
        this.save = true;
        this.size = 1;
    }

    select() {
        this.doAction(ToolInfo,{"Size" : this.size});
    }

    // Saving the start position of the line
    start(file, canvas, x, y) {
        this.startPos = {x,y};
    }

    // Saving the end position of the line and drawing it into the right canvas
    stop(file, canvas, x, y, toolCanvas, size) {
        this.endPos = {x,y};
        canvas.doAction(Line, this.startPos, this.endPos, file.color, size);
    }

    // Updating the line preview in the toolCanvas
    use(file, canvas, x, y, toolCanvas, size) {
        this.endPos = {x,y};

        toolCanvas.doAction(ClearCanvas);
        toolCanvas.doAction(Line, this.startPos, this.endPos, file.color, size);
    }
}
