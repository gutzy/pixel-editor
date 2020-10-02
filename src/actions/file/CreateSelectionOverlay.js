import {FileAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";
import Canvas from "../../classes/Canvas";
import ClearCanvas from "../canvas/ClearCanvas";
import DrawImage from "../canvas/DrawImage";
import DrawRect from "../canvas/DrawRect";
import ClearRect from "../canvas/ClearRect";

export default class CreateSelectionOverlay extends FileAction {
    do(file) {
        if (!file.selectionOverlay) file.selectionOverlay = new Canvas(null, this.width, this.height);
        file.selectionOverlay.doAction(ClearCanvas);
        file.selectionOverlay.doAction(DrawImage, file.selectionCanvas.el);
        if (file.expandArea) { file.selectionOverlay.doAction(DrawRect, ...file.expandArea, '#daba78');	}
        else if (file.shrinkArea) { file.selectionOverlay.doAction(ClearRect, ...file.shrinkArea); }


    }
}
