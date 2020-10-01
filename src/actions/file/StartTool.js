import {FileAction} from "../../classes/abstracts/Actions";
import Canvas from "../../classes/Canvas";

export default class StartTool extends FileAction {
    async do(file, x, y) {
        if (file.selectedTool && file.activeLayer > -1 && !file.layers[file.activeLayer].locked) {
            file.toolStarted = true;
            if (!file.selectedTool.persistent || !file.toolCanvas) file.toolCanvas = new Canvas(null, file.width, file.height);
            await file.selectedTool.start(file, file.layers[file.activeLayer].canvas, x / file.zoom, y / file.zoom, file.toolCanvas);
            if (file.selectedTool.persistent) file.selectedTool.persist(file.toolCanvas, true);
        }
    }
}
