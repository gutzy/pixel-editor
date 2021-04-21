/**
 * Select area solidify
 * @ActionType: File / Selection
 * @Description draw changes made by select tool dragging into the selection canvas
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";
import ClearCanvas from "../../canvas/ClearCanvas";
import DrawImage from "../../canvas/DrawImage";

export default class SelectAreaSolidify extends FileAction {
	do(file) {

		if (!file.selectionOverlay) return;

		let offset = file.selectionOffset ? file.selectionOffset : {x:0, y: 0};

		file.selectionCanvas.doAction(ClearCanvas);
		file.selectionCanvas.doAction(DrawImage, file.selectionOverlay.el, offset.x, offset.y);

		file.lastSelectionOffset = file.selectionOffset ? {...file.selectionOffset} : {x:0, y: 0};
		console.log("last selection offset: ");
		console.log(file.lastSelectionOffset);
		file.expandArea = file.shrinkArea = file.selectionOffset = null;
		EventBus.$emit('redraw-canvas');
	}
}
