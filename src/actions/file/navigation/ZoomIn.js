/**
 * Zoom In
 * @ActionType: File / Navigation
 * @Description Increases the viewport zoom level
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";
import CreateSelectionOverlay from "../selection/CreateSelectionOverlay";

export default class ZoomIn extends FileAction {

	/**
	 *
	 * @param file
	 * @param {number[]} zoomLevels an array designating the different available zoom levels
	 */

	do(file, zoomLevels) {
		let zoom = file.zoom;
		// iterate zoom levels to see where we currently are
		for (let l = 0; l < zoomLevels.length; l++) {
			// set file zoom to the next available level
			if (file.zoom < zoomLevels[l]) { zoom = zoomLevels[l]; break; }
		}
		file.zoom = zoom;

		// update UI
		EventBus.$emit('ui-zoom', file.zoom);

		// if a selection exists, create a new selection overlay
		if (file.selectionCanvas) file.doAction(CreateSelectionOverlay)
		EventBus.$emit('redraw-canvas');
	}
}
