/**
 * First Opaque XY
 * @ActionType: Canvas
 * @Description Return the {x, y} coordinates of the first non-transparent pixel in a canvas
 */
import {CanvasAction} from "../../classes/abstracts/Actions";

export default class FirstOpaqueXY extends CanvasAction {
	/**
	 *
	 * @param target
	 * @return {{x: number, y: number}}
	 */
	do(target) {
		const d = target.ctx.getImageData(0, 0, target.el.width, target.el.height);
		let x = target.el.width, y = target.el.height;
		// iterate through pixels
		for (let i = 0; i < d.data.length; i+= 4) {
			if (d.data[i+3] > 127) { // found solid pixel!
				// calculate x,y position for pixel
				let t = {x: (i/4) % target.el.width, y: Math.floor(i/target.el.width/4)};
				if (t.x < x) { x = t.x; }
				if (t.y < y) { y = t.y; }
			}
		}
		return {x, y}
	}
}
