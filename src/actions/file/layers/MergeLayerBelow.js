/**
 * Merge Layer Below
 * @ActionType: File / Layers
 * @Description Merge the target layer into the layer below it
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";
import DrawImage from "../../canvas/DrawImage";

export default class MergeLayerBelow extends FileAction {
	/**
	 *
	 * @param file
	 * @param {string} layerName - target layer name, will be merged into the layer below it
	 * @return {boolean}
	 */
	do(file, layerName) {
		// iterate layers, find target layer
		for (let l = 0; l < file.layers.length; l++) {
			if (file.layers[l].name === layerName) {
				// if target layer is bottom layer, do nothing (no layer to merge it into) - return failure
				if (l <= 0) return false;

				// draw target layer onto layer below it
				file.layers[l-1].canvasAction(DrawImage, file.layers[l].getImage());

				// remove target layer
				file.layers.splice(l, 1);

				// update UI
				EventBus.$emit('ui-update-layers', file.layers);

				// save history snapshot
				EventBus.$emit('save-history');

				// return a success
				return true;
			}
		}
	}
}
