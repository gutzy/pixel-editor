import {FileAction} from "../../classes/abstracts/Actions";
import Canvas from "../../classes/Canvas";
import EventBus from "../../utils/EventBus";

export default class StopTool extends FileAction {
    async do(file, x, y) {
        if (file.selectedTool && file.activeLayer > -1 && !file.layers[file.activeLayer].locked && file.toolStarted) {
            file.toolStarted = false;
            await file.selectedTool.stop(file, file.layers[file.activeLayer].canvas, x / file.zoom, y / file.zoom, file.toolCanvas);

            if (file.selectedTool.persistent) { file.selectedTool.persist(file.toolCanvas, true); }
            else { file.toolCanvas = null; }

            EventBus.$emit('update-layers', file.layers);
            if (file.selectedTool.save) EventBus.$emit('save-history');
        }
    }
}
