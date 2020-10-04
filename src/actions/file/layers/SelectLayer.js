import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";

export default class SelectLayer extends FileAction {
	do(file, layerName) {
		for (let l = 0; l < file.layers.length; l++) {
			if (file.layers[l].name === layerName) {
				file.activeLayer = l;
				EventBus.$emit('select-layer', file.layers[l]);
				return true;
			}
		}
	}
}
