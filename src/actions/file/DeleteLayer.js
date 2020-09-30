import {FileAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";

export default class DeleteLayer extends FileAction {
	do(file, layerName) {
		for (let l = 0; l < file.layers.length; l++) {
			if (file.layers[l].name === layerName) {
				file.layers.splice(l ,1);
				return true;
			}
		}
	}
}
