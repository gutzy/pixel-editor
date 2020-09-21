/**
 * Canvas wrapper.
 * This class holds a pointer to the main canvas element and can perform actions on it.
 */
import {CanvasAction} from "./abstracts/Actions";

export default class Canvas {

    constructor(canvasElement = null, width = 666, height = 420, data = null) {
        if (canvasElement) {
            this.el = canvasElement;
            canvasElement.setAttribute('width', canvasElement.offsetWidth);
            canvasElement.setAttribute('height', canvasElement.offsetHeight);
        }
        else {
            const c = document.createElement("canvas");
            c.setAttribute('width', width+'');
            c.setAttribute('height', height+'');
            this.el = c;
        }

        this.ctx = this.el.getContext('2d');

        if (data) {
            this.ctx
        }
    }

    doAction(action, ...params) {
        const a = new action();
        if (!(a instanceof CanvasAction)) {
            throw new Error("Not a canvas action!");
        }

        return a.do(this, ...params);
    }
}
