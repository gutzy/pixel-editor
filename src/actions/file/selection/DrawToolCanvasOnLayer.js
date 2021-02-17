import {FileAction} from "../../../classes/abstracts/Actions";
import DrawImage from "../../canvas/DrawImage";

export default class DrawToolCanvasOnLayer extends FileAction {

    do(file) {
        let tx = 0, ty = 0;
        if (file.selectionOffset) { tx = file.selectionOffset.x; ty = file.selectionOffset.y; }
        else if (file.lastSelectionOffset) { tx = file.lastSelectionOffset.x; ty = file.lastSelectionOffset.y; }
        console.log("blyad")
        file.layers[file.activeLayer].canvas.doAction(DrawImage, file.toolSelectionCanvas.el,tx,ty);
    }

}
