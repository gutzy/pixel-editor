/**
 * Load Contents
 * @ActionType: File / History
 * @Description Load the contents of a history snapshot into view
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import Layer from "../../../classes/Layer";
import Canvas from "../../../classes/Canvas";

export default class LoadContents extends FileAction {
	/**
	 *
	 * @param file
	 * @param {Object} contents - a history snapshot object, containing name, palette, layers, selection...
	 */
	do(file, contents) {
		let selection = false;

		// assign name and palette from snapshot
		if (contents.name) file.name = contents.name;
		if (contents.palette) file.palette = contents.palette;

		if (contents.layers) {
			// look for selection layer, splice it
			for (let l = contents.layers.length-1; l >= 0; l--) {
				if (contents.layers[l].name === '_selection-canvas') {
					selection = contents.layers[l];
					contents.layers.splice(l, 1);
					break;
				}
			}

			// Create layers from snapshot data
			for (let l = 0; l < contents.layers.length; l++) {
				const layer = new Layer(file, contents.layers[l].contents, contents.layers[l].name);
				layer.locked = contents.layers[l].locked;
				layer.visible = contents.layers[l].visible;
				layer.inflate(contents.layers[l].data);
				file.layers.push(layer);
				if (contents.layers[l].active) file.activeLayer = l;
			}

			// Restore selection
			if (selection) {
				file.toolSelectionCanvas = new Canvas(null, file.width, file.height, selection.data);
				console.log("Restored selection canvas")
			}
			else {
				if (file.toolSelectionCanvas) {
					file.toolSelectionCanvas = null;
				}
			}
		}
	}
}
