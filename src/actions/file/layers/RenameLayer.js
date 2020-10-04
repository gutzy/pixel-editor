import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";

export default class RenameLayer extends FileAction {
	do(file, layerName, newLayerName) {
		for (let l = 0; l < file.layers.length; l++) {
			if (file.layers[l].name === layerName) {
				file.layers[l].name = newLayerName;
				EventBus.$emit('update-layers', file.layers);
				EventBus.$emit('save-history');
				return true;
			}
		}
	}
}
