/**
 * Is Pixel Opaque
 * @ActionType: Canvas
 * @Description Returns whether a designated pixel is non-transparent
 *
 */
import {CanvasAction} from "../../classes/abstracts/Actions";

export default class IsOpaque extends CanvasAction {
	/**
	 *
	 * @param target
	 * @param {number} x - rect x position
	 * @param {number} y - rect y position
	 * @return {boolean}
	 */
	do(target, x, y) {
		return target.ctx.getImageData(x, y, 1, 1).data[3] > 128
	}
}
