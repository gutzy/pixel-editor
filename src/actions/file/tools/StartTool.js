/**
 * Start Tool
 * @ActionType: File / Tools
 * @Description run the Start action in the selected tool
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import Canvas from "../../../classes/Canvas";
import SelectionMasking from "../selection/SelectionMasking";
import DrawImage from "../../canvas/DrawImage";
import CreateSelectionOverlay from "../selection/CreateSelectionOverlay";

export default class StartTool extends FileAction {
    /**
     *
     * @param file
     * @param {number} x - cursor x position
     * @param {number} y - cursor y position
     */
    async do(file, x, y) {
        // check if there's a tool, active layer and that the layer isn't locked
        if (file.selectedTool && file.activeLayer > -1 && !file.layers[file.activeLayer].locked) {

            // Set tool as started
            file.toolStarted = true;

            // default canvas to edit
            let canvas = file.layers[file.activeLayer].canvas;
            let editCanvas = canvas;

            // if there's a selection...
            if (file.selectionCanvas && file.selectedTool.id !== 'select') {
                // if needed, create the tool work canvas
                if (!file.toolSelectionCanvas) file.toolSelectionCanvas = new Canvas(null, canvas.width, canvas.height);
                // apply the canvas within the selection
                file.toolSelectionCanvas.doAction(DrawImage, canvas.el, 0, 0);
                // set the canvas to edit as the tool work canvas
                editCanvas = file.toolSelectionCanvas;
            } else if (file.selectionCanvas) {
                // if this is the select tool, just create a selection overlay
                file.doAction(CreateSelectionOverlay);
            }

            // create tool canvas for persistence
            if (!file.selectedTool.persistent || !file.toolCanvas) file.toolCanvas = new Canvas(null, file.width, file.height);

            // run selected tool start hook
            await file.selectedTool.start(file, editCanvas, x / file.zoom, y / file.zoom, file.toolCanvas, file.selectedTool.size);

            // run first persistence if needed
            if (file.selectedTool.persistent) file.selectedTool.persist(file.toolCanvas, file, true);

            // Apply selection masking if needed
            file.doAction(SelectionMasking, editCanvas);
        }
    }
}
