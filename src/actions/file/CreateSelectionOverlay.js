import {FileAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";
import Canvas from "../../classes/Canvas";
import ClearCanvas from "../canvas/ClearCanvas";
import DrawImage from "../canvas/DrawImage";
import DrawRect from "../canvas/DrawRect";
import ClearRect from "../canvas/ClearRect";
import DrawSelectionBorders from "../canvas/DrawSelectionBorders";
import GetRectImage from "../canvas/GetRectImage";

export default class CreateSelectionOverlay extends FileAction {
    do(file) {
        if (!file.selectionOverlay) file.selectionOverlay = new Canvas(null, this.width, this.height);
        file.selectionOverlay.doAction(ClearCanvas);
        file.selectionOverlay.doAction(DrawImage, file.selectionCanvas.el);
        if (file.expandArea) { file.selectionOverlay.doAction(DrawRect, ...file.expandArea, '#daba78');	}
        else if (file.shrinkArea) { file.selectionOverlay.doAction(ClearRect, ...file.shrinkArea); }

        // draw selection borders (color lines for ants to march on)
        file.coloredSelectionOverlay = new Canvas(null, file.width, file.height);
        file.coloredSelectionOverlay.doAction(DrawSelectionBorders, file.selectionOverlay);
        file.coloredSelectionData = file.coloredSelectionOverlay.doAction(GetRectImage,0,0,file.width,file.height);
    }
}
