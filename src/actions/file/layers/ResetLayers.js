import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";
import Layer from "../../../classes/Layer";

export default class ResetLayers extends FileAction {
	do(file, layers = []) {
		file.layers = layers;
	}
}
