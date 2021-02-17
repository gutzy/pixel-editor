/**
 * Can Redo
 * @ActionType: File / History
 * @Description Returns whether a redo is available in the file's history
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";

export default class CanRedo extends FileAction {
	/**
	 *
	 * @param file
	 * @return {boolean}
	 */
	do(file) {
		return file.historyIndex < file.history.snapshots.length;
	}
}
