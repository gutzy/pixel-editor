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
import ResizeCanvas from "../ResizeCanvas";

export default class Undo extends FileAction {
	do(file, layerName) {
		// check if undo is available
		if (file.historyIndex > 1) {
			// move history pointer
			file.historyIndex--;

			// Load and restore history state
			const state = file.history.getState(file.historyIndex-1);
			const widthDelta = state.canvasWidth - file.width;
			const heightDelta = state.canvasHeight - file.height;

			file.doAction(ResetLayers);
			file.doAction(ResizeCanvas, 'middle', Math.round(widthDelta/2), 
				widthDelta - Math.round(widthDelta/2), Math.round(heightDelta/2),
				heightDelta - Math.round(heightDelta/2), false);
			file.doAction(LoadContents, {name: file.name, layers: state.layers});
			EventBus.$emit("redraw-canvas");
			EventBus.$emit("ui-update-layers", file.layers);
		}
	}
}
