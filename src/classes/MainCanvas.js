/**
 * Main Canvas wrapper.
 * It extends canvas, however it wraps the main <canvas> tag that contains the entire app.
 *
 */
import ClearCanvas from "../actions/canvas/ClearCanvas";
import Canvas from "./Canvas";
import DrawMainCanvasBoundaries from "../actions/canvas/DrawMainCanvasBoundaries";

export default class MainCanvas extends Canvas {

    constructor(canvasElement) {
        super(canvasElement);
    }

    /**
     * Allows resetting the main canvas. Redraws the boundaries.
     * @param {number} width
     * @param {number} height
     */
    reset(width, height) {
        this.doAction(ClearCanvas);
        this.doAction(DrawMainCanvasBoundaries, width, height);
    }


}
