/**
 * Draw Rectangle
 * @ActionType: Canvas
 * @Description Draws the boundaries of the main canvas in the center of the screen, depending on zoom/pan
 *

 *
 */
import { CanvasAction } from "../../classes/abstracts/Actions";

export default class DrawRect extends CanvasAction {
  /**
   *
   * @param target
   * @param {number} x - rect x
   * @param {number} y - rect y
   * @param {number} w - rect width
   * @param {number} h - rect height
   * @param {string|null} fill - fill color
   * @param {string|null} stroke - stroke color
   * @param {number|null} strokeWidth - stroke width
   */
  do(target, x, y, w, h, fill = null, stroke = null, strokeWidth = 1) {
    x = Math.floor(x);
    y = Math.floor(y);
    w = Math.floor(w);
    h = Math.floor(h);

    if (fill !== null) {
      target.ctx.fillStyle = fill ? fill : "transparent";
      target.ctx.fillRect(x, y, w, h);
    }
    if (stroke !== null) {
      // rects draw weird when width and hight are negative,
      // so I'm reconfiguring the values to draw in a positive direction.

      if (w <= 0 && h <= 0) {
        w = -w + 2;
        h = -h + 2;
        x = x - w + 1;
        y = y - h + 1;
      }

      // centering the stroke to the edge of the rectangle
      let halfStroke = Math.floor(strokeWidth / 2);
      w = w + halfStroke * 2;
      h = h + halfStroke * 2;
      x = x - halfStroke;
      y = y - halfStroke;

      // Adjust for odd-sized stroke widths
      w -= 1 - (strokeWidth % 2);
      h -= 1 - (strokeWidth % 2);

      target.ctx.fillStyle = stroke ? stroke : "transparent";
      target.ctx.fillRect(x, y, w, strokeWidth); // Top
      target.ctx.fillRect(x, y, strokeWidth, h); // Left
      target.ctx.fillRect(
        x, y + h - strokeWidth, w, strokeWidth
      ); // Bottom
      target.ctx.fillRect(
        w + x - 1 * strokeWidth,
        y,
        strokeWidth,
        h
      ); // Right
    }
  }
}
