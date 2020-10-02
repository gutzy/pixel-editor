import {FileAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";
import Canvas from "../../classes/Canvas";
import ClearCanvas from "../canvas/ClearCanvas";
import DrawImage from "../canvas/DrawImage";
import DrawRect from "../canvas/DrawRect";
import ClearRect from "../canvas/ClearRect";

export default class SelectionMasking extends FileAction {
    do(file, canvas) {
        if (file.selectionCanvas && file.selectedTool.id !== 'select') {
            file.toolSelectionCanvas.ctx.globalCompositeOperation = 'destination-in';
            file.toolSelectionCanvas.doAction(DrawImage, file.selectionCanvas.el);
            file.toolSelectionCanvas.ctx.globalCompositeOperation = 'source-over';
            canvas.doAction(DrawImage, file.toolSelectionCanvas.el);
        }
    }
}
