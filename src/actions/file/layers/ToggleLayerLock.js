/**
 * Toggle Layer Lock
 * @ActionType: File / Layers
 * @Description Toggle whether a layer is locked (can't be edited by tools)
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";

export default class ToggleLayerLock extends FileAction {
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
				// toggle layer 'locked' property
				file.layers[l].locked = !(file.layers[l].locked);

				// update UI
				EventBus.$emit('ui-update-layers', file.layers);

				// save history snapshot
				EventBus.$emit('save-history');

				// return success
				return true;
			}
		}
	}
}
