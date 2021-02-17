/**
 * New File
 * @ActionType: App
 * @Description Creates a new file as the currently active file
 *
 */

import {AppAction} from "../../classes/abstracts/Actions";
import File from "../../classes/File";
import EventBus from "../../utils/EventBus";
import LoadFile from "./LoadFile";

export default class NewFile extends AppAction {
	/**
	 *
	 * @param app
	 * @param {number} width - file width in px
	 * @param {number} height - file height in px
	 * @param {string} editorMode - simple/advanced editor mode
	 * @param {string} name - file name
	 * @param {[]} palette - color palette for file
	 * @return {File}
	 */
	do(app, width, height, editorMode, name = 'Untitled', palette) {
		const file = new File(width, height, editorMode);
		file.name = name;
		file.palette = palette;

		// Emit a 'ui-set-palette' event, with the given palette
		EventBus.$emit('ui-set-palette', palette);

		// Emit a 'new-file' event
		EventBus.$emit("new-file", app.file);

		// run app LoadFile action on new file
		app.doAction(LoadFile, file);
		return file;
	}
}
