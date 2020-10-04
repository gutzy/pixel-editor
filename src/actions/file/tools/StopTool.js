import {FileAction} from "../../../classes/abstracts/Actions";
import Canvas from "../../../classes/Canvas";
import EventBus from "../../../utils/EventBus";
import SelectionMasking from "../selection/SelectionMasking";
import CreateSelectionOverlay from "../selection/CreateSelectionOverlay";

export default class StopTool extends FileAction {
    async do(file, x, y) {
        if (file.selectedTool && file.activeLayer > -1 && !file.layers[file.activeLayer].locked && file.toolStarted) {
            file.toolStarted = false;

            let canvas = file.layers[file.activeLayer].canvas;
            let editCanvas = canvas;

            if (file.selectionCanvas && file.selectedTool.id !== 'select') {
                if (!file.toolSelectionCanvas) file.toolSelectionCanvas = new Canvas(null, canvas.width, canvas.height);
                editCanvas = file.toolSelectionCanvas;
            } else if (file.selectionCanvas) {
                file.doAction(CreateSelectionOverlay);
            }
            await file.selectedTool.stop(file, editCanvas, x / file.zoom, y / file.zoom, file.toolCanvas);

            if (file.selectedTool.persistent) { file.selectedTool.persist(file.toolCanvas, true); }
            else { file.toolCanvas = null; }

            file.doAction(SelectionMasking, editCanvas);

            EventBus.$emit('update-layers', file.layers);
            if (file.selectedTool.save) EventBus.$emit('save-history');
        }
    }
}
