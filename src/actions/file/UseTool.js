import {FileAction} from "../../classes/abstracts/Actions";
import Canvas from "../../classes/Canvas";
import EventBus from "../../utils/EventBus";

export default class UseTool extends FileAction {
    async do(file, x ,y) {
        if (file.selectedTool && file.activeLayer > -1 && !file.layers[file.activeLayer].locked) {
            await file.selectedTool.use(file, file.layers[file.activeLayer].canvas, x / file.zoom, y / file.zoom, file.toolCanvas);
            if (file.selectedTool.persist) file.selectedTool.persist(file.toolCanvas, true);
        }
    }
}
