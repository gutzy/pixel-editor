/**
 * @Tool Pencil
 * @author guszi
 *
 * Draws a rectangle
 */

import Tool from "../classes/abstracts/Tool";
import RectangleIcon from "../assets/svg/rectangle.svg";
import DrawRect from "../actions/canvas/DrawRect";
import ClearCanvas from "../actions/canvas/ClearCanvas";
import Line from "../actions/canvas/Line";

export default class Rectangle extends Tool {

    constructor() {
        super();

        this.id = "rectangle";
        this.name = "Rectangle Tool";
        this.icon = RectangleIcon;
        this.cursor = "crosshair";
        this.hotkey = 'r';
        this.save = true;
    }

    start(file, canvas, x, y) {
        this.startPos = {x, y}
    }

    stop(file, canvas, x, y) {
        if (this.startPos) {
            let currentStart = {x: this.startPos.x, y: this.startPos.y};
            let currentEnd = {x: x, y: this.startPos.y};

            canvas.doAction(Line, currentStart, currentEnd, file.color, 1);
            
            currentStart.x = x;
            currentEnd.y = y;

            canvas.doAction(Line, currentStart, currentEnd, file.color, 1);

            currentStart.y = y;
            currentEnd.x = this.startPos.x;

            canvas.doAction(Line, currentStart, currentEnd, file.color, 1);

            currentStart.x = this.startPos.x;
            currentEnd.y = this.startPos.y;
            
            canvas.doAction(Line, currentStart, currentEnd, file.color, 1);
        }
    }

    use(file, canvas, x, y, toolCanvas) {
        let currentStart = {x: this.startPos.x, y: this.startPos.y};
        let currentEnd = {x: x, y: this.startPos.y};

        toolCanvas.doAction(ClearCanvas);

        toolCanvas.doAction(Line, currentStart, currentEnd, file.color, 1);
        
        currentStart.x = x;
        currentEnd.y = y;

        toolCanvas.doAction(Line, currentStart, currentEnd, file.color, 1);

        currentStart.y = y;
        currentEnd.x = this.startPos.x;

        toolCanvas.doAction(Line, currentStart, currentEnd, file.color, 1);

        currentStart.x = this.startPos.x;
        currentEnd.y = this.startPos.y;
        
        toolCanvas.doAction(Line, currentStart, currentEnd, file.color, 1);
    }
}
