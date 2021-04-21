/**
 * Add Layer
 * @ActionType: File / Layers
 * @Description Add a new layer to the current file
 *
 * @param name - layer name
 * @param index - layer index position
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";
import Layer from "../../../classes/Layer";
import DrawToolCanvasOnLayer from "../selection/DrawToolCanvasOnLayer";

export default class AddLayer extends FileAction {
	do(file, name = "Untitled Layer", index = -1) {

		// if no position given, add this as the top layer
		if (index === -1) index = file.activeLayer+1;

		// find layers with an identical name, and rename the new layer to include a number with the name (1 or more)
		let existing = file.layers.find(l => l.name === name);
		while (existing) {
			let match = name.match(/([0-9]+)$/);
			if (match) {
				name = name.replace(/([0-9]+)$/, match[0]*1+1)
			}
			else {
				name = name + ' 2';
			}
			existing = file.layers.find(l => l.name === name);
		}

		// Create the new layer instance
		const layer = new Layer(file, null, name);
		layer.inflate();

		// If index is > -1, insert layer into the designated position
		if (index > -1) {
			file.layers.splice(index,0,layer);
			file.activeLayer = index;
		}
		// otherwise put the layer at the top
		else {
			file.layers.push(layer);
			file.activeLayer = file.layers.length-1;
		}

		// emit ui-update-layers event to reflect in UI
		EventBus.$emit("ui-update-layers", file.layers);

		// emit event to save history
		EventBus.$emit('save-history');

		// Keeping the selection on the previous layer
		if (file.toolSelectionCanvas) {
            file.doAction(DrawToolCanvasOnLayer, true);
            file.toolSelectionCanvas = null;
        }

		// emit event to select active layer in UI
		EventBus.$emit('ui-select-layer', file.layers[file.activeLayer], file);
		return layer;
	}
}
