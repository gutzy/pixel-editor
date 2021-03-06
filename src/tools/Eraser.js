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
import DrawRect from "../actions/canvas/DrawRect";
import ClearCanvas from "../actions/canvas/ClearCanvas";
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
    
    getCenteredRect(x, y, size) {
        return {
                x: Math.ceil(Math.floor(x) - size / 2),
                y: Math.ceil(Math.floor(y) - size / 2),
                w: size,
                h: size,
        };
    }

    hover(file, canvas, x, y, toolCanvas, uiCanvas) {
        this.cursorPos = { x, y };
        toolCanvas.doAction(ClearCanvas);
    }

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
