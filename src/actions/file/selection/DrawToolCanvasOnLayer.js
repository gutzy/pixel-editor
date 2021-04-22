/**
 * Draw Tool Canvas on Layer
 * @ActionType: File / Selection
 * @Description Draw the canvas used by the selection on the active layer. Used to transfer anything done inside
 * a selection back to the layer from which the selection was taken
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import DrawImage from "../../canvas/DrawImage";
import SaveHistory from "../history/SaveHistory";

export default class DrawToolCanvasOnLayer extends FileAction {

    do(file, offsetComputed = false) {
        // calculate selection offset for drawing the selection properly
        let tx = 0, ty = 0;

        if (!offsetComputed) {
            if (file.selectionOffset) { 
                tx = file.selectionOffset.x; ty = file.selectionOffset.y;
            }
            else if (file.lastSelectionOffset) { 
                tx = file.lastSelectionOffset.x; ty = file.lastSelectionOffset.y;
            }
        }
        
        // draw selection layer on active layer
        file.layers[file.activeLayer].canvas.doAction(DrawImage, file.toolSelectionCanvas.el,tx,ty);
        file.doAction(SaveHistory);
    }

}
