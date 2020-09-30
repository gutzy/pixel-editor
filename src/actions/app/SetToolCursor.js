import {AppAction} from "../../classes/abstracts/Actions";
import EventBus from "../../utils/EventBus";
import SetCursor from "../canvas/SetCursor";

export default class SetToolCursor extends AppAction {
	do(app, tool, cursor = null, cursorOffset = null) {
		console.log(tool, cursor);
		cursor = (cursor === null ? tool.cursor : cursor);
		cursorOffset = (cursorOffset === null ? tool.cursorOffset : cursorOffset);
		if (tool.cursor) app.canvas.doAction(SetCursor, cursor, cursorOffset);
		else app.canvas.doAction(SetCursor, 'default');
	}
}