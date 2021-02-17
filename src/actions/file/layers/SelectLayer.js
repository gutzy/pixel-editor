/**
 * Select Layer
 * @ActionType: File / Layers
 * @Description Sets the active layer to the designated layer
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";

export default class SelectLayer extends FileAction {
	/**
	 *
	 * @param file
	 * @param {string} layerName - target layer name
	 * @return {boolean}
	 */
	do(file, layerName) {
		// iterate layers, look for target layer
		for (let l = 0; l < file.layers.length; l++) {
			if (file.layers[l].name === layerName) {

				// set target layer as active layer
				file.activeLayer = l;

				// update UI
				EventBus.$emit('ui-select-layer', file.layers[l]);

				// return success
				return true;
			}
		}
	}
}
