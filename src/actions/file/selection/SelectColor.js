/**
 * Select Color
 * @ActionType: File / Selection
 * @Description Select the file's active color
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";

export default class SelectColor extends FileAction {
	/**
	 *
	 * @param file
	 * @param {string} color - hex color
	 */
	do(file, color) {
		// set color
		file.color = color;

		// update UI
		EventBus.$emit('ui-select-color', color);
	}
}
