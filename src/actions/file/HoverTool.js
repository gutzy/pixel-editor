import {FileAction} from "../../classes/abstracts/Actions";
import Canvas from "../../classes/Canvas";
import EventBus from "../../utils/EventBus";

export default class HoverTool extends FileAction {
    do(file, x ,y) {
        if (file.selectedTool && file.activeLayer > -1 && !file.layers[file.activeLayer].locked) {
            file.selectedTool.hover(file, file.layers[file.activeLayer].canvas, x / file.zoom, y / file.zoom, file.toolCanvas);
        }
    }
}
