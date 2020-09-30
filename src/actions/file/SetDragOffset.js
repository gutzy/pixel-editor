import {FileAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";

export default class SetDragOffset extends FileAction {
	do(file, dragOffset) {
		file.dragOffset = dragOffset;
		EventBus.$emit('drag-offset', dragOffset);
		EventBus.$emit('redraw-canvas');
	}
}
