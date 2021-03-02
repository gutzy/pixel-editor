/**
 * Zoom In
 * @ActionType: File / Navigation
 * @Description Increases the viewport zoom level
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

  do(file, zoomLevels, zoomX, zoomY) {
    // find the diff between canvas and mouse positions
    let diff = {
      x: file.dragOffset.x - zoomX,
      y: file.dragOffset.y - zoomY,
    };
    let lastZoom = file.zoom;

    let zoom = file.zoom;

    // iterate zoom levels to see where we currently are
    for (let l = 0; l < zoomLevels.length; l++) {
      // set file zoom to the next available level
      if (file.zoom < zoomLevels[l]) {
        zoom = zoomLevels[l];
        break;
      }
    }

    file.zoom = zoom;

    // update UI
    EventBus.$emit("ui-zoom", file.zoom);

    // scalar for the new zoom
    let ratio = file.zoom / lastZoom;

    // apply scalar to diff to get new offset
    file.dragOffset = {
      x: zoomX + diff.x * ratio,
      y: zoomY + diff.y * ratio,
    };

    // if a selection exists, create a new selection overlay
    if (file.selectionCanvas) file.doAction(CreateSelectionOverlay);
    EventBus.$emit("redraw-canvas");
  }
}
