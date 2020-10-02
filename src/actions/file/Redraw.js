import {FileAction} from "../../classes/abstracts/Actions";
import {getCenterRect} from "../../utils/CanvasUtils";
import ClearCanvas from "../canvas/ClearCanvas";
import DrawMainCanvasBoundaries from "../canvas/DrawMainCanvasBoundaries";
import DrawImage from "../canvas/DrawImage";
import PixelGrid from "../canvas/PixelGrid";
import CreateSelectionOverlay from "./CreateSelectionOverlay";
import Canvas from "../../classes/Canvas";
import DrawSelectionBorders from "../canvas/DrawSelectionBorders";
import DrawSelectionMarchingAnts from "../canvas/DrawSelectionMarchingAnts";

export default class Redraw extends FileAction {

	do(file, canvas, offset = 0) {
		const r = getCenterRect(canvas.el, file.width, file.height, file.zoom, file.dragOffset);
		let img;
		canvas.doAction(ClearCanvas);
		canvas.ctx.globalAlpha = 255;
		canvas.doAction(DrawMainCanvasBoundaries, file.width, file.height, file.zoom, file.dragOffset);
		for (let i = 0; i < file.layers.length; i++) {
			if (file.layers[i].visible) {
				img = file.layers[i].getImage();
				canvas.doAction(DrawImage, img, r[0],r[1], file.zoom);
			}
		}

		if (file.selectionCanvas) {
		    file.doAction(CreateSelectionOverlay);
		    const c = new Canvas(null, file.width, file.height);
		    c.doAction(DrawSelectionBorders, file.selectionOverlay);
		    const d = new Canvas(null, file.width, file.height);
		    d.doAction(DrawSelectionMarchingAnts, c, offset, 8);

			let x = r[0], y = r[1];
			if (file.selectionOffset) { x += file.selectionOffset.x*file.zoom; y += file.selectionOffset.y*file.zoom}
			canvas.doAction(DrawImage, d.el, x, y, file.zoom);

		}
		else { file.selectionOverlay = null; }

		if (file.toolCanvas) {
			canvas.doAction(DrawImage, file.toolCanvas.el, r[0], r[1], file.zoom);
		}

		if (file.zoom >= 8) {
			canvas.doAction(PixelGrid, file.zoom, Math.min(0, r[0]), Math.min(0, r[1]));
		}
	}
}
