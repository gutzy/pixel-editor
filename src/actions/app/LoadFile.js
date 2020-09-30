import {AppAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";

export default class LoadFile extends AppAction {
	do(app, file) {
		if (app.file) app.file.blur();

		app.file = file;
		app.file.focus();

		EventBus.$emit("load-file", app.file);
	}
}