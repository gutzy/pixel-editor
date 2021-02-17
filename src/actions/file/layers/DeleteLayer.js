/**
 * Delete Layer
 * @ActionType: File / Layers
 * @Description Delete a layer from the current file
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";

export default class DeleteLayer extends FileAction {
	/**
	 *
	 * @param file
	 * @param {string} layerName - layer name
	 * @return {boolean}
	 */
	do(file, layerName) {
		// iterate layers to find layer with the given name
		for (let l = 0; l < file.layers.length; l++) {
			if (file.layers[l].name === layerName && file.layers.length > 1) {
				// remove layer
				file.layers.splice(l ,1);

				// update UI
				EventBus.$emit("ui-update-layers", file.layers);

				// save history snapshot
				EventBus.$emit('save-history');
				return true;
			}
		}
	}
}
