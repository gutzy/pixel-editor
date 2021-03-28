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
import ResizeCanvas from "../ResizeCanvas";

export default class Redo extends FileAction {
	do(file) {
		// check if redo is available
		if (file.historyIndex < file.history.snapshots.length) {
			// move history pointer
			file.historyIndex++;

			// Load and restore history state
			const state = file.history.getState(file.historyIndex-1);

			console.log("width: " + state.width + "height: " + state.height);

			const widthDelta = state.canvasWidth - file.width;
			const heightDelta = state.canvasHeight - file.height;

			// BUG HERE

			console.log("state size: " + state.canvasWidth + " x " + state.canvasHeight);
			console.log("Width delta: " + widthDelta + ", height delta: " + heightDelta);
			
			file.doAction(ResetLayers);
			file.doAction(ResizeCanvas, 'middle', Math.round(widthDelta/2), 
				widthDelta - Math.round(widthDelta/2), Math.round(heightDelta/2),
				heightDelta - Math.round(heightDelta/2));
			file.doAction(LoadContents, {name: file.name, layers: state.layers});
			EventBus.$emit("redraw-canvas");
			EventBus.$emit("ui-update-layers", file.layers);
		}
	}
}