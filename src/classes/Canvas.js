/**
 * Canvas wrapper.
 * This class holds a pointer to a canvas element and can perform Canvas actions on it. In most cases, it it created
 * without referencing an existing Canvas element, and creates one on the spot. a notable exception is the MainCanvas.
 *
 * The canvas element and ctx should only be exposed via canvas actions, to allow for drawing via composition rather
 * than direct canvas context editing, which is very prone to bugs.
 *
 */
import {CanvasAction} from "./abstracts/Actions";
import PutImage from "../actions/canvas/PutImage";

export default class Canvas {

    /**
     * constructor
     * @param {HTMLCanvasElement|null} canvasElement - optional canvas element reference, if it is empty, a canvas element will be created
     * @param {number|null} width - optional, for no canvasElement. Designates the width of new canvas element.
     * @param {number|null} height - optional, for no canvasElement. Designates the height of new canvas element.
     * @param {ImageData|null} data - optional ImageData, if provided the canvasElement will have it pre-drawn on it on initialization.
     */
    constructor(canvasElement = null, width = 666, height = 420, data = null) {
        // A reference already exists, this is an existing HTML canvas. Just reset width/height to its real size.
        if (canvasElement) {
            this.el = canvasElement;
            canvasElement.setAttribute('width', canvasElement.offsetWidth);
            canvasElement.setAttribute('height', canvasElement.offsetHeight);
        }
        // No reference - create a new canvas element and set its width/height according to provided arguments
        else {
            const c = document.createElement("canvas");
            c.setAttribute('width', width+'');
            c.setAttribute('height', height+'');
            this.el = c;
        }

        // initialize ctx reference
        this.ctx = this.el.getContext('2d');
        this.ctx.mozImageSmoothingEnabled    = false;
        this.ctx.oImageSmoothingEnabled      = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled     = false;
        this.ctx.imageSmoothingEnabled       = false;

        // if initial ImageData was provided, draw it on the canvas
        if (data) {
            this.doAction(PutImage, data, 0, 0);
        }

    }

    /**
     * Run a canvas action on a canvas
     */
    doAction(action, ...params) {
        const a = new action();
        if (!(a instanceof CanvasAction)) {
            throw new Error("Not a canvas action!");
        }

        return a.do(this, ...params);
    }
}
