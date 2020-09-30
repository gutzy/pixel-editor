import {AppAction} from "../../classes/abstracts/Actions";
import File from "../../classes/File";
import EventBus from "../../utils/EventBus";
import LoadFile from "./LoadFile";

export default class NewFile extends AppAction {
	do(app, width, height, editorMode, name = 'Untitled', palette) {
		const file = new File(width, height, editorMode);
		file.name = name;
		file.palette = palette;
		EventBus.$emit('set-palette', palette);
		EventBus.$emit("new-file", app.file);
		app.doAction(LoadFile, file);
		return file;
	}
}