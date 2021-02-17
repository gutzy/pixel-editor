/**
 * Try Setting Cursor
 * @ActionType: Tool
 * @Description attempt to set the canvas cursor to the given tool's cursor
 */
import {ToolAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";

export default class TrySettingCursor extends ToolAction {
	/**
	 *
	 * @param tool
	 * @param {*} cursor - either a png or a default cursor style
	 */
	do(tool, cursor) {
		EventBus.$emit('set-tool-cursor', cursor)
	}
}
