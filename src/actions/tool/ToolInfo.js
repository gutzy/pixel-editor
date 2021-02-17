import {ToolAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";

export default class ToolInfo extends ToolAction {
	do(tool, toolInfo) {
		EventBus.$emit('ui-tool-info', toolInfo);
	}
}
