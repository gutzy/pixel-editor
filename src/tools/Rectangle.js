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
import ToolInfo from "../actions/tool/ToolInfo";

export default class Rectangle extends Tool {

    constructor() {
        super();

        this.id = "rectangle";
        this.name = "Rectangle Tool";
        this.icon = RectangleIcon;
        this.cursor = "crosshair";
        this.hotkey = 'r';
        this.save = true;
        this.size = 1;
    }

    select() {
        this.doAction(ToolInfo,{"Size" : this.size});
    }

    start(file, canvas, x, y) {
        this.startPos = {x:Math.floor(x), y:Math.floor(y)}
    }

    stop(file, canvas, x, y, toolCanvas, size) {
        if (this.startPos) canvas.doAction(DrawRect, this.startPos.x, this.startPos.y, x-this.startPos.x+1, y-this.startPos.y+1, null, file.color, size);
    }

    use(file, canvas, x, y, toolCanvas, size) {
        let currentStart = {x: this.startPos.x, y: this.startPos.y};
        let currentEnd = {x: x, y: this.startPos.y};

        toolCanvas.doAction(ClearCanvas);
        toolCanvas.doAction(DrawRect, this.startPos.x, this.startPos.y, x-this.startPos.x+1, y-this.startPos.y+1, null, file.color, size);
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
