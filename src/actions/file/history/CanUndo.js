/**
 * Can Redo
 * @ActionType: File / History
 * @Description Returns whether the history pointer can still go back (or is at the history beginning)
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";

export default class CanUndo extends FileAction {
	/**
	 *
	 * @param file
	 * @return {boolean}
	 */
	do(file) {
		return file.historyIndex > 1;
	}
}
