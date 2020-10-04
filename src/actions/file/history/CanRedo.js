import {FileAction} from "../../../classes/abstracts/Actions";

export default class CanRedo extends FileAction {
	do(file) {
		return file.historyIndex < file.history.snapshots.length;
	}
}
