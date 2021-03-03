/**
 * Start Tool
 * @ActionType: File / Tools
 * @Description run the Stop action in the selected tool
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import Canvas from "../../../classes/Canvas";
import EventBus from "../../../utils/EventBus";
import SelectionMasking from "../selection/SelectionMasking";
import CreateSelectionOverlay from "../selection/CreateSelectionOverlay";

export default class StopTool extends FileAction {
    /**
     *
     * @param file
     * @param {number} x - cursor x position
     * @param {number} y - cursor y position
     */
    async do(file, x, y) {
        // check if there's a tool, active layer and that the layer isn't locked
        if (file.selectedTool && file.activeLayer > -1 && !file.layers[file.activeLayer].locked && file.toolStarted) {

            // Set tool as stopped
            file.toolStarted = false;

            // default canvas to edit
            let canvas = file.layers[file.activeLayer].canvas;
            let editCanvas = canvas;

            // if there's a selection...
            if (file.selectionCanvas && file.selectedTool.id !== 'select') {
                // if needed, create the tool work canvas
                if (!file.toolSelectionCanvas) file.toolSelectionCanvas = new Canvas(null, canvas.width, canvas.height);

                // set the canvas to edit as the tool work canvas
                editCanvas = file.toolSelectionCanvas;
            } else if (file.selectionCanvas) {
                // if this is the select tool, just create a selection overlay
                file.doAction(CreateSelectionOverlay);
            }

            // run selected tool stop hook
            await file.selectedTool.stop(file, editCanvas, x / file.zoom, y / file.zoom, file.toolCanvas, file.selectedTool.size);

            // run last persistence if needed
            if (file.selectedTool.persistent) { file.selectedTool.persist(file.toolCanvas, file, true); }
            else { file.toolCanvas = null; }

            // Apply selection masking if needed
            file.doAction(SelectionMasking, editCanvas);

            EventBus.$emit('ui-update-layers', file.layers);
            if (file.selectedTool.save) EventBus.$emit('save-history');
        }
    }
}
