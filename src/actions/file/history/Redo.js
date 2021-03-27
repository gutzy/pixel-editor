/**
 * Redo
 * @ActionType: File / History
 * @Description Redo action, moves the history pointer ahead (if possible)
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";
import ResetLayers from "../layers/ResetLayers";
import LoadContents from "./LoadContents";

export default class Redo extends FileAction {
	do(file) {
		// check if redo is available
		if (file.historyIndex < file.history.snapshots.length) {
			// move history pointer
			file.historyIndex++;

			// Load and restore history state
			const state = file.history.getState(file.historyIndex-1);
			file.doAction(ResetLayers);
			file.doAction(LoadContents, {name: file.name, layers: state.layers});
			EventBus.$emit("redraw-canvas");
			EventBus.$emit("ui-update-layers", file.layers);
		}
	}
}
