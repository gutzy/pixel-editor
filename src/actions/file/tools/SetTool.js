/**
 * Set Tool
 * @ActionType: File / Tools
 * @Description Set the active tool
 *
 */
import { FileAction } from "../../../classes/abstracts/Actions";
import Canvas from "../../../classes/Canvas";
import RunToolPersistence from "./RunToolPersistence";
import ToolInfo from "../../tool/ToolInfo";

export default class SetTool extends FileAction {
  /**
   *
   * @param file
   * @param {Tool} tool - tool class instance
   * @param {*} params - additional parameters that define tool settings
   */
  async do(file, tool, ...params) {
    // unset currently active tool
    if (file.selectedTool) {
      file.selectedTool.selected = false;
    }
    // set active tool, apply additional params
    file.selectedTool = tool;
    tool.params = params;
    tool.selected = true;

    // clear tool info
    tool.doAction(ToolInfo, null);

    // Run tool select hook
    tool.select();

    // Reset the tool's designated persistence canvas, then run it
    // file.toolCanvas = null;
    // create tool canvas for persistence
    if (!file.selectedTool.persistent || !file.toolCanvas)
      file.toolCanvas = new Canvas(null, file.width, file.height);
    file.doAction(RunToolPersistence);
  }
}
