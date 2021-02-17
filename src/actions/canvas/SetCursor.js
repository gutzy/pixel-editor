/**
 * Set Cursor
 * @ActionType: Canvas
 * @Description Sets the visible cursor for a given canvas, using CSS styling
 *
 */
import {CanvasAction} from "../../classes/abstracts/Actions";

export default class SetCursor extends CanvasAction {
    /**
     *
     * @param target
     * @param {*} cursor - png file or system cursor type
     * @param {number[]} cursorOffset - cursor action x,y offset from the top-left corner
     */
    do(target, cursor, cursorOffset = null) {
        if (cursorOffset === null) cursorOffset = '';
        if (cursor.indexOf('png') > -1) cursor = 'url('+cursor+') '+cursorOffset.join(" ") +', auto';
        target.el.style.cursor = cursor;
    }
}
