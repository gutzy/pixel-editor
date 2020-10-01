import {CanvasAction} from "../../classes/abstracts/Actions";

export default class FirstOpaqueXY extends CanvasAction {
	do(target) {
		const d = target.ctx.getImageData(0, 0, target.el.width, target.el.height);
		let x = target.el.width, y = target.el.height;
		for (let i = 0; i < d.data.length; i+= 4) {
			if (d.data[i+3] > 127) {
				let t = {x: (i/4) % target.el.width, y: Math.floor(i/target.el.width/4)};
				if (t.x < x) { x = t.x; }
				if (t.y < y) { y = t.y; }
			}
		}
		return {x, y}
	}
}
