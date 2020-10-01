import {ToolAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";

export default class TrySettingCursor extends ToolAction {
	do(tool, cursor) {
		EventBus.$emit('set-tool-cursor', cursor)
	}
}