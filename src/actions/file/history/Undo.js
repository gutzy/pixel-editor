/**
 * Undo
 * @ActionType: File / History
 * @Description Undo action, moves the history pointer backwards (if possible)
 *
 */
import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";
import ResetLayers from "../layers/ResetLayers";
import LoadContents from "./LoadContents";

export default class Undo extends FileAction {
	do(file, layerName) {
		// check if undo is available
		if (file.historyIndex > 1) {

			// move history pointer
			file.historyIndex--;

			// Load and restore history state
			const state = file.history.getState(file.historyIndex-1);
			file.doAction(ResetLayers);
			file.doAction(LoadContents, {name: file.name, layers: state});
			EventBus.$emit("redraw-canvas");
			EventBus.$emit("ui-update-layers", file.layers);
		}
	}
}
