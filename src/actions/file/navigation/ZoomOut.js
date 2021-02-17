import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";
import CreateSelectionOverlay from "../selection/CreateSelectionOverlay";

export default class ZoomOut extends FileAction {
	do(file, zoomLevels) {
		let zoom = file.zoom;
		for (let l = 0; l < zoomLevels.length; l++) {
			if (file.zoom > zoomLevels[l]) zoom = zoomLevels[l];
			else break;
		}
		file.zoom = zoom;
		EventBus.$emit('zoom', file.zoom);

		if (file.selectionCanvas) file.doAction(CreateSelectionOverlay)

		EventBus.$emit('redraw-canvas');
	}
}
