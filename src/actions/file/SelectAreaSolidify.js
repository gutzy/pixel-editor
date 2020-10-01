import {FileAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";
import DrawRect from "../canvas/DrawRect";
import ClearCanvas from "../canvas/ClearCanvas";
import DrawImage from "../canvas/DrawImage";
import ClearRect from "../canvas/ClearRect";

export default class SelectAreaSolidify extends FileAction {
	do(file) {
		console.log("Solidify......");

		if (!file.selectionOverlay) return;

		let offset = file.selectionOffset ? file.selectionOffset : {x:0, y: 0};
		file.selectionOverlay.doAction(ClearCanvas);
		file.selectionOverlay.doAction(DrawImage, file.selectionCanvas.el);
		if (file.expandArea) { file.selectionOverlay.doAction(DrawRect, ...file.expandArea, '#daba78');	}
		else if (file.shrinkArea) { file.selectionOverlay.doAction(ClearRect, ...file.shrinkArea); }

		file.selectionCanvas.doAction(ClearCanvas);
		file.selectionCanvas.doAction(DrawImage, file.selectionOverlay.el, offset.x, offset.y);

		file.expandArea = file.shrinkArea = file.selectionOffset = null;
		EventBus.$emit('redraw-canvas');
	}
}
