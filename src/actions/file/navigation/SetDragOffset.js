/**
 * Set Drag Offset
 * @ActionType: File / Navigation
 * @Description Changes the drag offsets of the file, used by panning to navigate around
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";

export default class SetDragOffset extends FileAction {
	/**
	 *
	 * @param file
	 * @param {{x,y}} dragOffset - offset from the viewport center
	 */
	do(file, dragOffset) {
		// set drag offset
		file.dragOffset = dragOffset;

		// redraw canvas
		EventBus.$emit('redraw-canvas');
	}
}
