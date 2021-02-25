/**
 * Create Selection Overlay
 * @ActionType: File / Selection
 * @Description Create an overlay (and borders for animation) for current selection. This should be done whenever
 * the selection has changed, as redrawing the borders is an expensive operation.
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import Canvas from "../../../classes/Canvas";
import ClearCanvas from "../../canvas/ClearCanvas";
import DrawImage from "../../canvas/DrawImage";
import DrawRect from "../../canvas/DrawRect";
import ClearRect from "../../canvas/ClearRect";
import DrawSelectionBorders from "../../canvas/DrawSelectionBorders";

let bt;

export default class CreateSelectionOverlay extends FileAction {
    do(file) {
        // create overlay canvas if it doesn't exist
        if (!file.selectionOverlay) file.selectionOverlay = new Canvas(null, this.width, this.height);

        // clear overlay, then draw existing selection
        file.selectionOverlay.doAction(ClearCanvas);
        file.selectionOverlay.doAction(DrawImage, file.selectionCanvas.el);
        // draw any ongoing drag selection expansion or shrinkage (select tool alt/shift usage)
        if (file.expandArea) { file.selectionOverlay.doAction(DrawRect, ...file.expandArea, '#daba78');	}
        else if (file.shrinkArea) { file.selectionOverlay.doAction(ClearRect, ...file.shrinkArea); }

        // redraw selection borders
        clearTimeout(bt);
        bt = setTimeout(() => {
            delete file.marchingAnts;
            if (file.selectionOverlay) file.selectionBorders = file.selectionOverlay.doAction(DrawSelectionBorders, file.selectionOverlay, file.zoom, file);
        },10)

    }
}
