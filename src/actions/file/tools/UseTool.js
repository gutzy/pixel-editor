/**
 * Use Tool
 * @ActionType: File / Tools
 * @Description run the Use action in the selected tool
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import Canvas from "../../../classes/Canvas";
import SelectionMasking from "../selection/SelectionMasking";

export default class UseTool extends FileAction {
    /**
     *
     * @param file
     * @param {number} x - cursor x position
     * @param {number} y - cursor y position
     */
    async do(file, x, y) {
        // check if there's a tool, active layer and that the layer isn't locked
        if (file.selectedTool && file.activeLayer > -1 && !file.layers[file.activeLayer].locked) {

            // default canvas to edit
            let canvas = file.layers[file.activeLayer].canvas;
            let editCanvas = canvas;

            // if there's a selection...
            if (file.selectionCanvas && file.selectedTool.id !== 'select') {
                // if needed, create the tool work canvas
                if (!file.toolSelectionCanvas) file.toolSelectionCanvas = new Canvas(null, canvas.width, canvas.height);

                // set the canvas to edit as the tool work canvas
                editCanvas = file.toolSelectionCanvas;
            }

            // run selected tool use hook
            await file.selectedTool.use(file, editCanvas, x / file.zoom, y / file.zoom, file.toolCanvas);

            // run persistence if needed
            if (file.selectedTool.persist) file.selectedTool.persist(file.toolCanvas, file, true);

            // Apply selection masking if needed
            file.doAction(SelectionMasking, editCanvas);
        }
    }
}
