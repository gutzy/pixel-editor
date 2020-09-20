/**
 * Main Canvas wrapper.
 * It does what a canvas does..... and more!
 */
import {CanvasAction} from "./abstracts/Actions";
import EventBus from "../utils/EventBus";
import ClearCanvas from "../actions/canvas/ClearCanvas";
import Canvas from "./Canvas";
import DrawMainCanvasBoundaries from "../actions/canvas/DrawMainCanvasBoundaries";

export default class MainCanvas extends Canvas {

    constructor(canvasElement) {
        super(canvasElement);
    }

    doAction(action, ...params) {
        const a = new action();
        if (!(a instanceof CanvasAction)) {
            throw new Error("Not a canvas action!");
        }

        return a.do(this, ...params);
    }

    reset(width, height) {
        this.doAction(ClearCanvas);
        this.doAction(DrawMainCanvasBoundaries, width, height);
    }


}
