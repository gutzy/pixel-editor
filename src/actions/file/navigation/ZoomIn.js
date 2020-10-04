import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";

export default class ZoomIn extends FileAction {
	do(file, zoomLevels) {
		let zoom = file.zoom;
		for (let l = 0; l < zoomLevels.length; l++) {
			if (file.zoom < zoomLevels[l]) { zoom = zoomLevels[l]; break; }
		}
		file.zoom = zoom;
		EventBus.$emit('zoom', file.zoom);
		EventBus.$emit('redraw-canvas');
	}
}
