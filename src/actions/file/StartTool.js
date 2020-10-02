import {FileAction} from "../../classes/abstracts/Actions";
import Canvas from "../../classes/Canvas";
import SelectionMasking from "./SelectionMasking";
import DrawImage from "../canvas/DrawImage";

export default class StartTool extends FileAction {
    async do(file, x, y) {
        if (file.selectedTool && file.activeLayer > -1 && !file.layers[file.activeLayer].locked) {
            file.toolStarted = true;
            let canvas = file.layers[file.activeLayer].canvas;
            let editCanvas = canvas;

            if (file.selectionCanvas && file.selectedTool.id !== 'select') {
                file.toolSelectionCanvas = new Canvas(null, canvas.width, canvas.height);
                file.toolSelectionCanvas.doAction(DrawImage, canvas.el, 0, 0);
                editCanvas = file.toolSelectionCanvas;
            }

            if (!file.selectedTool.persistent || !file.toolCanvas) file.toolCanvas = new Canvas(null, file.width, file.height);
            await file.selectedTool.start(file, editCanvas, x / file.zoom, y / file.zoom, file.toolCanvas);
            if (file.selectedTool.persistent) file.selectedTool.persist(file.toolCanvas, true);

            file.doAction(SelectionMasking,  canvas);
        }
    }
}
