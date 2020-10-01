import {AppAction} from "../../classes/abstracts/Actions";
import SetCursor from "../canvas/SetCursor";

export default class SetToolCursor extends AppAction {
	do(app, tool, cursor = null, cursorOffset = null) {
		cursor = (cursor === null ? tool.cursor : cursor);
		cursorOffset = (cursorOffset === null ? tool.cursorOffset : cursorOffset);
		if (tool.cursor) app.canvas.doAction(SetCursor, cursor, cursorOffset);
		else app.canvas.doAction(SetCursor, 'default');
	}
}