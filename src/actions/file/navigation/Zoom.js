/**
 * Zoom
 * @ActionType: File / Navigation
 * @Description sets viewport zoom level
 *
 */
import { FileAction } from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";
import CreateSelectionOverlay from "../selection/CreateSelectionOverlay";
import { clamp } from "../../../utils/MathUtils";

export default class ZoomIn extends FileAction {
  /**
   *
   * @param file
   * @param {number[]} zoomLevels an array designating the different available zoom levels
   */

  do(file, zoomX, zoomY, startZoom, delta) {
    // find the diff between canvas and mouse positions
    let diff = {
      x: file.dragOffset.x - zoomX,
      y: file.dragOffset.y - zoomY,
    };
    let lastZoom = file.zoom;

    // iterate zoom levels to see where we currently are
    file.zoom = startZoom + (delta/50), 1;
    file.zoom = Math.pow(1.01,delta) * startZoom;
    file.zoom = Math.min(Math.max(1, file.zoom), 10);
    // console.log(delta)



    // update UI
    EventBus.$emit("ui-zoom", file.zoom);

    // scalar for the new zoom
    let ratio = file.zoom / lastZoom;

    // apply scalar to diff to get new offset
    // file.dragOffset = {
    //   x: zoomX + diff.x * ratio,
    //   y: zoomY + diff.y * ratio,
    // };

    // if a selection exists, create a new selection overlay
    if (file.selectionCanvas) file.doAction(CreateSelectionOverlay);
    EventBus.$emit("redraw-canvas");
  }
}
