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
import DrawRect from "../actions/canvas/DrawRect";

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

    hover(file, canvas, x, y, toolCanvas, uiCanvas) {
        this.cursorPos = { x, y };
        toolCanvas.doAction(ClearCanvas);
        let rect = this.getCenteredRect(x, y, this.size);
        toolCanvas.doAction(DrawRect, rect.x, rect.y, rect.w, rect.h, file.color);
      }
    
      getCenteredRect(x, y, size) {
        return {
          x: Math.ceil(Math.floor(x) - size / 2),
          y: Math.ceil(Math.floor(y) - size / 2),
          w: size,
          h: size,
        };
      }
    
      canvasToScreenSpace(x, y, canvasX, canvasY) {}
    
      ui(file, uiCanvas) {
        if (this.cursorPos) {
          let rect = this.getCenteredRect(
            this.cursorPos.x,
            this.cursorPos.y,
            this.size
          );
    
          uiCanvas.ctx.lineWidth = 2 / file.zoom;
          uiCanvas.ctx.strokeStyle = "white";
          uiCanvas.ctx.strokeRect(
            rect.x + 0.5 / file.zoom,
            rect.y + 0.5 / file.zoom,
            rect.w,
            rect.h
          );
    
          uiCanvas.ctx.lineWidth = 1 / file.zoom;
          uiCanvas.ctx.strokeStyle = "black";
          uiCanvas.ctx.strokeRect(
            rect.x + 0.5 / file.zoom,
            rect.y + 0.5 / file.zoom,
            rect.w,
            rect.h
          );
        }
      }
}
