import {FileAction} from "../../classes/abstracts/Actions";

export default class CanUndo extends FileAction {
	do(file) {
		return file.historyIndex > 1;
	}
}
