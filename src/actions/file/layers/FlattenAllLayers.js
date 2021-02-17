/**
 * Flatten All Layers
 * @ActionType: File / Layers
 * @Description Flatten all layers into one layer
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";
import DrawImage from "../../canvas/DrawImage";

export default class FlattenAllLayers extends FileAction {
	do(file) {
		// iterate through all the layers, except the bottom layer
		for (let l = file.layers.length-1; l > 0; l--) {
			// draw layer contents on bottom layer
			file.layers[0].canvasAction(DrawImage, file.layers[l].getImage());

			// delete layer
			file.layers.splice(l, 1);
		}
		// make bottom layer visible and active
		file.layers[0].visible = true;
		file.activeLayer = 0;

		// update UI
		EventBus.$emit('ui-update-layers', file.layers);

		// save history snapshot
		EventBus.$emit('save-history');
	}
}
