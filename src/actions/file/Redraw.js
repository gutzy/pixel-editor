import {FileAction} from "../../classes/abstracts/Actions";
import {getCenterRect} from "../../utils/CanvasUtils";
import ClearCanvas from "../canvas/ClearCanvas";
import DrawMainCanvasBoundaries from "../canvas/DrawMainCanvasBoundaries";
import DrawImage from "../canvas/DrawImage";
import PixelGrid from "../canvas/PixelGrid";
import Canvas from "../../classes/Canvas";
import DrawSelectionMarchingAnts from "../canvas/DrawSelectionMarchingAnts";

export default class Redraw extends FileAction {

	do(file, canvas, offset = 0) {
		const r = getCenterRect(canvas.el, file.width, file.height, file.zoom, file.dragOffset);
		let img;

		///////////////////////////////////////////////////////////////////////
		// Clear canvas and draw center rectangle
		canvas.doAction(ClearCanvas);
		canvas.ctx.globalAlpha = 255;
		canvas.doAction(DrawMainCanvasBoundaries, file.width, file.height, file.zoom, file.dragOffset);

		///////////////////////////////////////////////////////////////////////
		// Draw each layer
		let tx = 0, ty = 0;
		for (let i = 0; i < file.layers.length; i++) {
			if (file.layers[i].visible) {
				img = file.layers[i].getImage();
				canvas.doAction(DrawImage, img, r[0],r[1], file.zoom);
			}
			if (i === file.activeLayer && file.toolSelectionCanvas) {
				let dx = 0, dy = 0;
				if (file.selectionOffset) { dx = file.selectionOffset.x*file.zoom; dy = file.selectionOffset.y*file.zoom }
				canvas.doAction(DrawImage, file.toolSelectionCanvas.el, r[0]+dx,r[1]+dy, file.zoom);
			}
		}

		///////////////////////////////////////////////////////////////////////
		// Selection related stuff
		if (file.selectionCanvas) {
			const d = new Canvas(null, file.width, file.height);
			d.doAction(DrawSelectionMarchingAnts, file.coloredSelectionData, offset, 8);

			let x = r[0], y = r[1];
			if (file.selectionOffset) {
				file.lastSelectionOffset = null;
				x += file.selectionOffset.x*file.zoom; y += file.selectionOffset.y*file.zoom;
			}

			if (file.lastSelectionOffset) {
				x += file.lastSelectionOffset.x*file.zoom; y+= file.lastSelectionOffset.y*file.zoom;
			}

			canvas.doAction(DrawImage, d.el, x, y, file.zoom);

		}
		else { file.selectionOverlay = null; }

		///////////////////////////////////////////////////////////////////////
		// Tool canvas

		if (file.toolCanvas) {
			canvas.doAction(DrawImage, file.toolCanvas.el, r[0], r[1], file.zoom);
		}

		///////////////////////////////////////////////////////////////////////
		// Pixel Grid

		if (file.zoom >= 8) {
			canvas.doAction(PixelGrid, file.zoom, Math.min(0, r[0]), Math.min(0, r[1]));
		}
	}
}
