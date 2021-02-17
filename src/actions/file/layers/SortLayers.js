/**
 * Sort Layers
 * @ActionType: File / Layers
 * @Description Resets a layer position, from one index to another
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";

export default class SortLayers extends FileAction {
	/**
	 *
	 * @param file
	 * @param {number} oldIndex - original layer index
	 * @param {number} newIndex - target layer index
	 */
	do(file, oldIndex, newIndex) {

		// reverse index order (layers are actually upside-down, for rendering purposes)
		oldIndex = (file.layers.length-1)-oldIndex;
		newIndex = (file.layers.length-1)-newIndex;

		// grab layer
		const movedLayer = file.layers.splice(oldIndex, 1)[0];

		// reposition layer
		file.layers.splice(newIndex, 0, movedLayer);

		// set layer as active
		file.activeLayer = newIndex;

		// save history snapshot
		EventBus.$emit('save-history');

		// redraw canvas
		EventBus.$emit('redraw-canvas');

		// update UI
		EventBus.$emit('ui-update-layers', file.layers);
	}
}
