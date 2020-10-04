import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";
import DrawImage from "../../canvas/DrawImage";

export default class FlattenAllLayers extends FileAction {
	do(file) {
		for (let l = file.layers.length-1; l > 0; l--) {
			file.layers[0].canvasAction(DrawImage, file.layers[l].getImage());
			file.layers.splice(l, 1);
		}
		file.layers[0].visible = true;
		file.activeLayer = 0;
		EventBus.$emit('update-layers', file.layers);
		EventBus.$emit('save-history');
	}
}
