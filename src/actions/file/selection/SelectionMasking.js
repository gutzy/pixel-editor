/**
 * Selection Masking
 * @ActionType: File / Selection
 * @Description Apply a mask of the current selection to selection work layer, to preserve the selection mask
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import DrawImage from "../../canvas/DrawImage";

export default class SelectionMasking extends FileAction {
    /**
     *
     * @param file
     * @param {Canvas} editCanvas - canvas to which apply the masking
     */
    do(file, editCanvas) {
        // Allow on tools other than 'select', as select tool changes these things
        if (file.selectionCanvas && file.selectedTool.id !== 'select') {

            // Set selection work canvas drawing mode to apply a mask
            file.toolSelectionCanvas.ctx.globalCompositeOperation = 'destination-in';

            // apply selection mask
            file.toolSelectionCanvas.doAction(DrawImage, file.selectionCanvas.el);

            // set selection work canvas drawing mode back
            file.toolSelectionCanvas.ctx.globalCompositeOperation = 'source-over';

            // Draw the canvas
            editCanvas.doAction(DrawImage, file.toolSelectionCanvas.el);
        }
    }
}
