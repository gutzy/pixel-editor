import {FileAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";
import DrawRect from "../canvas/DrawRect";
import ClearCanvas from "../canvas/ClearCanvas";
import DrawImage from "../canvas/DrawImage";
import ClearRect from "../canvas/ClearRect";
import CreateSelectionOverlay from "./CreateSelectionOverlay";

export default class SelectAreaSolidify extends FileAction {
	do(file) {

		if (!file.selectionOverlay) return;

		let offset = file.selectionOffset ? file.selectionOffset : {x:0, y: 0};
		file.doAction(CreateSelectionOverlay);

		file.selectionCanvas.doAction(ClearCanvas);
		file.selectionCanvas.doAction(DrawImage, file.selectionOverlay.el, offset.x, offset.y);

		file.lastSelectionOffset = file.selectionOffset ? {...file.selectionOffset} : {x:0, y: 0};
		file.expandArea = file.shrinkArea = file.selectionOffset = null;
		EventBus.$emit('redraw-canvas');
	}
}
