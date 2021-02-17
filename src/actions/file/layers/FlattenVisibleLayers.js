/**
 * Flatten Visible Layers
 * @ActionType: File / Layers
 * @Description Flatten all visible layers into one layer
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";
import DrawImage from "../../canvas/DrawImage";

export default class FlattenVisibleLayers extends FileAction {
	do(file) {
		let lowest = 9999;
		// look for the lowest visible layer, designate it as the target
		for (let l = file.layers.length-1; l >= 0; l--) {
			if (file.layers[l].visible) lowest = l;
		}
		// iterate layers, from the top to the a layer above lowest visible layer, looking for other visible layers
		for (let l = file.layers.length-1; l > lowest; l--) {
			if (file.layers[l].visible) {
				// draw layer on target (bottom visible layer)
				file.layers[lowest].canvasAction(DrawImage, file.layers[l].getImage());
				// remove layer
				file.layers.splice(l, 1);
			}
		}
		// set lowest visible layer as active layer
		file.activeLayer = lowest;

		// update UI
		EventBus.$emit('ui-update-layers', file.layers);

		// save history snapshot
		EventBus.$emit('save-history');
	}
}
