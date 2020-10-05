import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";
import Layer from "../../../classes/Layer";

export default class SortLayers extends FileAction {
	do(file, oldIndex, newIndex) {

		oldIndex = (file.layers.length-1)-oldIndex;
		newIndex = (file.layers.length-1)-newIndex;

		const movedLayer = file.layers.splice(oldIndex, 1)[0];
		file.layers.splice(newIndex, 0, movedLayer);
		file.activeLayer = newIndex;

		EventBus.$emit('save-history');
		EventBus.$emit('redraw-canvas');
		EventBus.$emit('update-layers', file.layers);
	}
}
