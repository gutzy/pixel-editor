/**
 * Rename layer
 * @ActionType: File / Layers
 * @Description Change a given layer's name
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";

export default class RenameLayer extends FileAction {
	/**
	 *
	 * @param file
	 * @param {string} layerName - existing layer name
	 * @param {string} newLayerName - new layer name
	 * @return {boolean}
	 */
	do(file, layerName, newLayerName) {
		// iterate layers, find target layer
		for (let l = 0; l < file.layers.length; l++) {
			if (file.layers[l].name === layerName) {

				// change layer name
				file.layers[l].name = newLayerName;

				// update UI
				EventBus.$emit('ui-update-layers', file.layers);

				// save history snapshot
				EventBus.$emit('save-history');
				return true;
			}
		}
		return false;
	}
}
