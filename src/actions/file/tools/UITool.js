/**
 * Hover Tool
 * @ActionType: File / Tools
 * @Description Run the hover action on the selected tool
 *
 */
import { FileAction } from "../../../classes/abstracts/Actions";

export default class UITool extends FileAction {
  /**
   *
   * @param file
   * @param {number} x - cursor x position
   * @param {number} y - cursor y position
   */
  do(file, target, x, y) {
    if (
      file.selectedTool &&
      file.activeLayer > -1 &&
      file.layers[file.activeLayer] &&
      !file.layers[file.activeLayer].locked
    ) {
      file.selectedTool.ui(file, target, x, y);
    }
  }
}
