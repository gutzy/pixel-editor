import {CanvasAction} from "../../classes/abstracts/Actions";

export default class SetCursor extends CanvasAction {
    do(target, cursor, cursorOffset = null) {
        if (cursorOffset === null) cursorOffset = '';
        if (cursor.indexOf('png') > -1) cursor = 'url('+cursor+') '+cursorOffset.join(" ") +', auto';
        return target.el.style.cursor = cursor;
    }
}
