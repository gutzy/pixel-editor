import {CanvasAction} from "../../classes/abstracts/Actions";

export default class IsOpaque extends CanvasAction {
	do(target, x, y) {
		return target.ctx.getImageData(x, y, 1, 1).data[3] > 128
	}
}
