/**
 * Redraw
 * @ActionType: File / General
 * @Description Redraw the main canvas file
 *
 */
import { FileAction } from "../../classes/abstracts/Actions";
import { getCenterRect } from "../../utils/CanvasUtils";
import ClearCanvas from "../canvas/ClearCanvas";
import DrawMainCanvasBoundaries from "../canvas/DrawMainCanvasBoundaries";
import DrawImage from "../canvas/DrawImage";
import PixelGrid from "../canvas/PixelGrid";
import Canvas from "../../classes/Canvas";
import DrawSelectionMarchingAnts from "../canvas/DrawSelectionMarchingAnts";
import UITool from "./tools/UITool.js";

export default class Redraw extends FileAction {
  /**
   *
   * @param file
   * @param {Canvas} canvas - target canvas (should be main canvas)
   * @param {number} offset - an incremental index of the main loop
   */
  do(file, canvas, offset = 0) {
    ///////////////////////////////////////////////////////////////////////
    // Get the center rectangle, we're going to use it as a base for the drawing
    let r = getCenterRect(
      canvas.el,
      file.width,
      file.height,
      file.zoom,
      file.dragOffset
    );
    r = r.map((val) => Math.floor(val));
    let img;

    ///////////////////////////////////////////////////////////////////////
    // Clear canvas and draw center rectangle
    canvas.doAction(ClearCanvas);
    canvas.ctx.globalAlpha = 255;
    canvas.doAction(
      DrawMainCanvasBoundaries,
      file.width,
      file.height,
      file.zoom,
      file.dragOffset
    );

    ///////////////////////////////////////////////////////////////////////
    // Draw each layer
    let tx = 0,
      ty = 0;
    for (let i = 0; i < file.layers.length; i++) {
      // if layer is visible, draw its image
      if (file.layers[i].visible) {
        img = file.layers[i].getImage();
        canvas.doAction(DrawImage, img, r[0], r[1], file.zoom);
      }

      // if there's an active selection, draw the selection layer's content on top of the active layer
      if (i === file.activeLayer && file.toolSelectionCanvas) {
        let dx = 0,
          dy = 0;
        if (file.selectionOffset) {
          dx = file.selectionOffset.x * file.zoom;
          dy = file.selectionOffset.y * file.zoom;
        }
        canvas.doAction(
          DrawImage,
          file.toolSelectionCanvas.el,
          r[0] + dx,
          r[1] + dy,
          file.zoom
        );
      }
    }

    ///////////////////////////////////////////////////////////////////////
    // Tool canvas - used for tool helpers

    if (file.toolCanvas) {
      canvas.doAction(DrawImage, file.toolCanvas.el, r[0], r[1], file.zoom);
    }

    ///////////////////////////////////////////////////////////////////////
    // draw a Pixel Grid if zoom is high enough so it won't be obstructive

    if (file.zoom >= 8) {
      canvas.doAction(PixelGrid, file.zoom, r[0] - 1, r[1] - 1);
    }

    file.doAction(UITool, canvas, r[0] - 1, r[1] - 1);

    ///////////////////////////////////////////////////////////////////////
    // Selection related overlays
    if (file.selectionCanvas) {
      // Create an overlay for selections
      const ants = file.doAction(
        DrawSelectionMarchingAnts,
        canvas,
        file.selectionBorders,
        offset,
        8,
        file.zoom,
        file.dragOffset
      );

      // calculate selection overlay position
      let x = r[0],
        y = r[1];
      if (file.selectionOffset) {
        file.lastSelectionOffset = null;
        x += file.selectionOffset.x * file.zoom;
        y += file.selectionOffset.y * file.zoom;
      }

      if (file.lastSelectionOffset) {
        x += file.lastSelectionOffset.x * file.zoom;
        y += file.lastSelectionOffset.y * file.zoom;
      }

      // Draw selection overlay on main canvas
      if (ants) canvas.doAction(DrawImage, ants, x, y);
    } else {
      file.selectionOverlay = null;
    }
  }
}
