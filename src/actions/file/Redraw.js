import {FileAction} from "../../classes/abstracts/Actions";
import {getCenterRect} from "../../utils/CanvasUtils";
import ClearCanvas from "../canvas/ClearCanvas";
import DrawMainCanvasBoundaries from "../canvas/DrawMainCanvasBoundaries";
import DrawImage from "../canvas/DrawImage";
import PixelGrid from "../canvas/PixelGrid";
import Canvas from "../../classes/Canvas";
import DrawRect from "../canvas/DrawRect";
import ClearRect from "../canvas/ClearRect";

export default class Redraw extends FileAction {
	do(file, canvas) {
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

		if (file.selectionCanvas) { // TODO: This is ugly
		    if (!file.selectionOverlay) file.selectionOverlay = new Canvas(null, this.width, this.height);
			file.selectionOverlay.doAction(ClearCanvas);
			file.selectionOverlay.doAction(DrawImage, file.selectionCanvas.el);
			if (file.expandArea) { file.selectionOverlay.doAction(DrawRect, ...file.expandArea, '#daba78');	}
			else if (file.shrinkArea) { file.selectionOverlay.doAction(ClearRect, ...file.shrinkArea); }

			let x = r[0], y = r[1];
			if (file.selectionOffset) { x += file.selectionOffset.x; y += file.selectionOffset.y}
			canvas.doAction(DrawImage, file.selectionOverlay.el, x, y, file.zoom);
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
