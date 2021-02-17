/**
 * Set Tool Cursor
 * @ActionType: App
 * @Description Sets the app cursor depending on the active tool
 */
import {AppAction} from "../../classes/abstracts/Actions";
import SetCursor from "../canvas/SetCursor";

export default class SetToolCursor extends AppAction {
	/**
	 *
	 * @param app
	 * @param {Tool} tool - tool class instance that has the cursor definition
	 * @param {string|null} cursor - optional custom cursor to override tool cursor
	 * @param {[number,number]} cursorOffset - optional custom cursor offset ([x,y] from top left corner) to override tool cursor offset
	 */
	do(app, tool, cursor = null, cursorOffset = null) {
		cursor = (cursor === null ? tool.cursor : cursor);
		cursorOffset = (cursorOffset === null ? tool.cursorOffset : cursorOffset);

		// run SetCursor canvas action on main app canvas (or show default cursor if no cursor)
		if (tool.cursor) app.canvas.doAction(SetCursor, cursor, cursorOffset);
		else app.canvas.doAction(SetCursor, 'default');
	}
}
