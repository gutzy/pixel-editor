import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";
import DrawImage from "../../canvas/DrawImage";

export default class FlattenVisibleLayers extends FileAction {
	do(file) {
		let lowest = 9999;
		for (let l = file.layers.length-1; l >= 0; l--) {
			if (file.layers[l].visible) lowest = l;
		}
		for (let l = file.layers.length-1; l > lowest; l--) {
			if (file.layers[l].visible) {
				file.layers[lowest].canvasAction(DrawImage, file.layers[l].getImage());
				file.layers.splice(l, 1);
			}
		}
		file.activeLayer = lowest;
		EventBus.$emit('update-layers', file.layers);
		EventBus.$emit('save-history');
	}
}
