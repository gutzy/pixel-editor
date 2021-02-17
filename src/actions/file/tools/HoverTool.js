/**
 * Hover Tool
 * @ActionType: File / Tools
 * @Description Run the hover action on the selected tool
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";

export default class HoverTool extends FileAction {
    /**
     *
     * @param file
     * @param {number} x - cursor x position
     * @param {number} y - cursor y position
     */
    do(file, x ,y) {
        if (file.selectedTool && file.activeLayer > -1 && file.layers[file.activeLayer] && !file.layers[file.activeLayer].locked) {
            file.selectedTool.hover(file, file.layers[file.activeLayer].canvas, x / file.zoom, y / file.zoom, file.toolCanvas);
        }
    }
}
