/**
 * Select an area
 * @ActionType: File / Selection
 * @Description Draws a rectangle selection box in a designated special file canvas, and creates a selection overlay
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";
import Canvas from "../../../classes/Canvas";
import DrawRect from "../../canvas/DrawRect";
import CreateSelectionOverlay from "./CreateSelectionOverlay";

export default class SelectArea extends FileAction {
	/**
	 *
	 * @param file
	 * @param {string} fileProp - reference to the designated special file canvas
	 * @param {number} x - rect x
	 * @param {number} y - rect y
	 * @param {number} width - rect width
	 * @param {number} height - rect height
	 */
	do(file, fileProp,x, y, width, height) {

		// Check parameters for invalid stuff
		if (width===0||height===0|| typeof width === "undefined") {
			file[fileProp] = null;
			return;
		}

		// Create the designated canvas
		file[fileProp] = new Canvas(null, file.width, file.height);

		// Draw rectangle on the canvas
		file[fileProp].doAction(DrawRect, x,y,width,height, "#faaf3f");

		// Create selection overlay
        file.doAction(CreateSelectionOverlay);

        // Redraw canvas
		EventBus.$emit('redraw-canvas');
	}
}
