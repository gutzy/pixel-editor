import {FileAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";

export default class Redo extends FileAction {
	do(file) {
		if (file.historyIndex < file.history.snapshots.length) {
			file.historyIndex++;
			const state = file.history.getState(file.historyIndex-1);
			file.resetLayers();
			file.loadContents({name: file.name, layers: state});
			EventBus.$emit("redraw-canvas");
			EventBus.$emit("update-layers", file.layers);
		}
	}
}
