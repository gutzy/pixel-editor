/**
 * Load File
 * @ActionType: App
 * @Description Loads a file as the currently active file
 */
import {AppAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";

export default class LoadFile extends AppAction {
	/**
	 *
	 * @param app
	 * @param {File} file - file instance to load
	 */
	do(app, file) {
		if (app.file) app.file.blur();

		app.file = file;
		app.file.focus();

		// Emit a 'load file' event
		EventBus.$emit("load-file", app.file);
	}
}
