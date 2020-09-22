import {FileAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";
import DrawImage from "../canvas/DrawImage";

export default class MergeLayerBelow extends FileAction {
	do(file, layerName) {
		for (let l = 0; l < file.layers.length; l++) {
			if (file.layers[l].name === layerName) {
				if (l <= 0) return false;

				file.layers[l-1].canvasAction(DrawImage, file.layers[l].getImage());
				file.layers.splice(l, 1);
				EventBus.$emit('update-layers', file.layers);
				EventBus.$emit('save-history');
				return true;
			}
		}
	}
}
