/**
 * Zoom In
 * @ActionType: File / Navigation
 * @Description Increases the viewport zoom level
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";
import CreateSelectionOverlay from "../selection/CreateSelectionOverlay";
import {clamp} from "../../../utils/MathUtils";

export default class ZoomIn extends FileAction {

	/**
	 *
	 * @param file
	 * @param {number[]} zoomLevels an array designating the different available zoom levels
	 */

	do(file, zoomLevels, zoomX, zoomY) {
		let zoom = file.zoom;
		zoomX = clamp(zoomX, 0, file.width);
		zoomY = clamp(zoomY, 0, file.height);
		// iterate zoom levels to see where we currently are
		for (let l = 0; l < zoomLevels.length; l++) {
			// set file zoom to the next available level
			if (file.zoom < zoomLevels[l]) { zoom = zoomLevels[l]; break; }
		}
	   
	   	/*file.dragOffset =  {
			x : file.dragOffset.x + (file.width * zoom - file.width) * (zoomX - file.width / 2) / file.width,
			y : file.dragOffset.y + (file.height * zoom - file.height) * (zoomY - file.height / 2) / file.height
		}*/

		file.zoom = zoom;

		// update UI
		EventBus.$emit('ui-zoom', file.zoom);		

		// if a selection exists, create a new selection overlay
		if (file.selectionCanvas) file.doAction(CreateSelectionOverlay)
		EventBus.$emit('redraw-canvas');
	}
}
