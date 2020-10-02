import {FileAction} from "../../classes/abstracts/Actions";
import Canvas from "../../classes/Canvas";
import SelectionMasking from "./SelectionMasking";
import CreateSelectionOverlay from "./CreateSelectionOverlay";

export default class UseTool extends FileAction {
    async do(file, x ,y) {
        if (file.selectedTool && file.activeLayer > -1 && !file.layers[file.activeLayer].locked) {
            let canvas = file.layers[file.activeLayer].canvas;
            let editCanvas = canvas;

            if (file.selectionCanvas && file.selectedTool.id !== 'select') {
                file.toolSelectionCanvas = new Canvas(null, canvas.width, canvas.height);
                editCanvas = file.toolSelectionCanvas;
            } else if (file.selectionCanvas) {
                file.doAction(CreateSelectionOverlay);
            }

            await file.selectedTool.use(file, editCanvas, x / file.zoom, y / file.zoom, file.toolCanvas);
            if (file.selectedTool.persist) file.selectedTool.persist(file.toolCanvas, true);

            file.doAction(SelectionMasking, canvas);
        }
    }
}
