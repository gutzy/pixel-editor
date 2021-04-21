/**
 * Toggle Pixel Grid
 * @ActionType: App
 * @Description Toggles the Pixel Grid
 *
 */

import { AppAction } from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";

export default class TogglePixelGrid extends AppAction {
  /**
   *
   * @param app
   */
  do(app) {
    app.pixelGrid = !app.pixelGrid;
    app.menu.Editor[0].value = app.pixelGrid;

    EventBus.$emit("redraw-canvas");
  }
}
