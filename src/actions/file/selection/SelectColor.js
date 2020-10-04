import {FileAction} from "../../../classes/abstracts/Actions";
import EventBus from "../../../utils/EventBus";

export default class SelectColor extends FileAction {
	do(file, color) {
		file.color = color;
		EventBus.$emit('select-color', color);
	}
}
