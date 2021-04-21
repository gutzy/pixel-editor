/**
 * @Tool Pencil
 * @author guszi
 *
 * Lets you draw stuff
 */

import Tool from "../classes/abstracts/Tool";
import PencilIcon from "../assets/svg/pencil.svg";
import DrawRect from "../actions/canvas/DrawRect";
import ClearCanvas from "../actions/canvas/ClearCanvas";
import { pixelsBetween, distance } from "../utils/CanvasUtils";
import ToolInfo from "../actions/tool/ToolInfo";
import AxisLocking from "../actions/tool/AxisLocking";

export default class Pencil extends Tool {
  constructor() {
    super();

    this.id = "pencil";
    this.name = "Pencil Tool";
    this.icon = PencilIcon;
    this.cursor = "crosshair";
    this.cursorOffset = [0, 0];
    this.hotkey = "b";
    this.save = true;
    this.useOutside = true;
    this.coalesced = true;

    this.size = 1;
    this.doAction(AxisLocking);
  }

  select() {
    this.doAction(ToolInfo, { Size: this.size });
  }

  start(file, canvas, x, y) {
    let rect = this.getCenteredRect(x, y, this.size);
    canvas.doAction(DrawRect, rect.x, rect.y, rect.w, rect.h, file.color);
    this.pos = { x, y };
  }

  stop(file, canvas, x, y) {
    let rect = this.getCenteredRect(x, y, this.size);
    canvas.doAction(DrawRect, rect.x, rect.y, rect.w, rect.h, file.color);
  }

  use(file, canvas, x, y, toolCanvas) {
    const dist = distance(x, y, this.pos.x, this.pos.y);
    if (dist > 0.1) {
      const px = pixelsBetween(x, y, this.pos.x, this.pos.y);
      for (let p of px) {
        // draw pixels between this and the previous mouse movement
        let rect = this.getCenteredRect(p.x, p.y, this.size);
        canvas.doAction(DrawRect, rect.x, rect.y, rect.w, rect.h, file.color);
      }
      let rect = this.getCenteredRect(x, y, this.size);
      canvas.doAction(DrawRect, rect.x, rect.y, rect.w, rect.h, file.color);
      this.pos = { x, y };
    }
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
