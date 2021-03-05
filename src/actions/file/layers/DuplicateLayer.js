/**
 * Delete Layer
 * @ActionType: File / Layers
 * @Description Duplicate a layer from the current file
 *
 */
 import {FileAction} from "../../../classes/abstracts/Actions";
import Layer from "../../../classes/Layer";
 import EventBus from "../../../utils/EventBus";

export default class DuplicateLayer extends FileAction {
    do(file, layerName) {
        // iterate layers to find layer with the given name
		for (let l = 0; l < file.layers.length; l++) {
			if (file.layers[l].name === layerName) {
				// duplicate layer
                const layer = new Layer(file, null, layerName + ' copy');
                layer.inflate(file.layers[l].getImageData());

                // add it into the array
                file.layers.splice(l, 0, layer);
                
				// update UI
				EventBus.$emit("ui-update-layers", file.layers);

				// save history snapshot
				EventBus.$emit('save-history');

				return true;
			}
		}
    }
}